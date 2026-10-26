import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync, existsSync } from "node:fs";
import { execFileSync } from "node:child_process";

const FWSC_PATH = "firmware-c/whimsy-machine.fwsc";
const EMU_DIST = "/tmp/fm1-emu/web/dist";
const WASM_PATH = `${EMU_DIST}/fm1_web.wasm`;

test("M-VAVE FM-1 native firmware package (.fwsc) builds and runs in fm1-emu (P7-06)", async (t) => {
  // If the .fwsc does not exist yet, build it using tools/build_fm1_firmware.py
  if (!existsSync(FWSC_PATH)) {
    if (!existsSync("/tmp/fm1_open") || !existsSync("/tmp/jieli/jieli-linux-toolchains-20260730.1/pi32v2")) {
      t.skip("FM-1 SDK or JieLi toolchain not available in test environment");
      return;
    }
    execFileSync("python3", ["tools/build_fm1_firmware.py"]);
  }

  assert.ok(existsSync(FWSC_PATH), "whimsy-machine.fwsc exists");
  const fwscBytes = new Uint8Array(readFileSync(FWSC_PATH));
  assert.ok(fwscBytes.length > 100000, "firmware container size is plausible");

  // Check if fm1-emu test harness is available
  if (!existsSync(WASM_PATH)) {
    t.skip("fm1-emu wasm module not available in test environment");
    return;
  }

  const { jitImports } = await import(new URL(`${EMU_DIST}/jit.js`, "file://"));
  let x;
  const { instance } = await WebAssembly.instantiate(
    readFileSync(WASM_PATH),
    { env: jitImports(() => x) }
  );
  x = instance.exports;
  x.fm1_jit(1, 16);
  x.fm1_ahead(1024);

  // Allocate and copy package into emulator memory
  const p = x.fm1_alloc(fwscBytes.length);
  new Uint8Array(x.memory.buffer, p, fwscBytes.length).set(fwscBytes);

  // Boot firmware
  const bootResult = x.fm1_boot_fwsc(p, fwscBytes.length, 0, 0, 100);
  assert.equal(bootResult, 0, "fm1_boot_fwsc returned 0 (successful boot)");

  // Render 3 seconds of 44.1 kHz audio frames
  let renderedFrames = 0;
  for (let n = 0; n < 3 * 44100; n += 128) {
    renderedFrames += x.fm1_render(128, 50_000_000);
  }
  assert.ok(renderedFrames >= 2 * 44100, "audio renderer produced at least 2 seconds of frames");
  assert.equal(x.fm1_halted(), 0, "CPU core has not halted or crashed");

  // Verify LCD Framebuffer
  const lcd = new Uint16Array(x.memory.buffer, x.fm1_lcd(), 240 * 240);
  const colorCounts = new Map();
  for (let i = 0; i < lcd.length; i++) {
    const c = lcd[i];
    colorCounts.set(c, (colorCounts.get(c) || 0) + 1);
  }

  // Victorian Parlor Palette assertions (D-074)
  assert.ok(colorCounts.has(0x0841), "Obsidian parlor background (0x0841) is present");
  assert.ok(colorCounts.has(0xbd29), "Victorian brass outline (0xbd29) is present");
  assert.ok(colorCounts.has(0x6905), "Oxblood pedestal base (0x6905) is present");
  assert.ok(colorCounts.has(0x3acb), "Verdigris specimen silhouette (0x3acb) is present");
  assert.ok(colorCounts.has(0x07ff), "Cyan step cursor (0x07ff) is present on 12-step tracker");
  assert.ok(colorCounts.get(0x0841) > 20000, "Obsidian background covers majority of display");

  // Verify MIDI responsiveness
  const measureRmsLevel = (durationSec) => {
    let sum = 0, count = 0;
    const blocks = (durationSec * 44100) / 128;
    for (let b = 0; b < blocks; b++) {
      x.fm1_render(128, 50_000_000);
      const leftChannel = new Float32Array(x.memory.buffer, x.fm1_out_l(), 128);
      for (let i = 0; i < 128; i++) {
        sum += leftChannel[i] * leftChannel[i];
        count++;
      }
    }
    return Math.sqrt(sum / count);
  };

  const ambientLevel = measureRmsLevel(0.3);
  assert.ok(ambientLevel > 0.05, "autonomous esoteric walking bass and organ loop is actively sounding");

  // Send MIDI Note On (Note 60, Middle C, Velocity 100)
  for (const byte of [0x90, 60, 100]) {
    x.fm1_midi(byte);
  }
  const noteLevel = measureRmsLevel(0.3);
  assert.ok(noteLevel > ambientLevel, "MIDI note on sounds and increases audio output level");

  // Send MIDI Note Off
  for (const byte of [0x80, 60, 0]) {
    x.fm1_midi(byte);
  }
});
