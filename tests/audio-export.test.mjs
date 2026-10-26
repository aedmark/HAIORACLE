import assert from "node:assert/strict";
import test from "node:test";

import {
  DEFAULT_EXPORT_SETTINGS,
  applyPeakCeiling,
  beatsIn,
  cutRender,
  encodeWav,
  exportFilename,
  keyLabelFor,
  normalizeExportSettings,
  peakOf,
  readWav,
} from "../src/audio-export.mjs";

const sine = (frames, amplitude = 0.5, period = 64) => Float32Array.from({ length: frames }, (_, i) => amplitude * Math.sin((i / period) * Math.PI * 2));

test("P8-01 encodes 16-bit, 24-bit, and 32-bit float WAV that read back within one LSB", () => {
  const left = sine(500);
  const right = sine(500, -0.25, 37);
  for (const [bitDepth, format, bits, tolerance] of [["16", 1, 16, 2 / 32767], ["24", 1, 24, 1 / 8388607], ["32f", 3, 32, 0]]) {
    for (const rate of [44100, 48000, 96000]) {
      const wav = readWav(encodeWav([left, right], rate, { bitDepth }));
      assert.equal(wav.format, format, `${bitDepth} format tag`);
      assert.equal(wav.bits, bits);
      assert.equal(wav.sampleRate, rate);
      assert.equal(wav.numChannels, 2);
      assert.equal(wav.frames, 500);
      for (let i = 0; i < 500; i += 1) {
        assert.ok(Math.abs(wav.channels[0][i] - left[i]) <= tolerance + 1e-7, `${bitDepth} L[${i}]`);
        assert.ok(Math.abs(wav.channels[1][i] - right[i]) <= tolerance + 1e-7, `${bitDepth} R[${i}]`);
      }
      if (bitDepth === "32f") assert.ok(wav.chunks.includes("fact"), "float WAV carries a fact chunk");
    }
  }
});

test("P8-01 16-bit dither is seeded, so one phrase exports the same bytes", () => {
  const data = [sine(300, 0.001)];
  const a = encodeWav(data, 48000, { bitDepth: "16", seed: 1234 });
  const b = encodeWav(data, 48000, { bitDepth: "16", seed: 1234 });
  const c = encodeWav(data, 48000, { bitDepth: "16", seed: 99 });
  assert.deepEqual(a, b);
  assert.notDeepEqual(a, c);
  const undithered = readWav(encodeWav([new Float32Array(300)], 48000, { bitDepth: "16", dither: false }));
  assert.ok(undithered.channels[0].every((v) => v === 0), "silence stays silent without dither");
});

test("P8-01 writes smpl loop points, an acid chunk, and ASCII LIST/INFO", () => {
  const frames = 960;
  const bytes = encodeWav([sine(frames), sine(frames)], 48000, {
    bitDepth: "24",
    loop: { start: 0, end: frames },
    acid: { bpm: 96, beats: 6, rootNote: 50 },
    info: { name: "Gloomwick the Uncanny · F♯ DORIAN", software: "The Whimsy Machine 1.2.0", comment: "seed 0xdeadbeef" },
  });
  assert.equal(bytes.length % 2, 0);
  const wav = readWav(bytes);
  assert.deepEqual(wav.smpl, { unityNote: 50, loops: 1, loop: { start: 0, end: frames - 1 } });
  assert.equal(wav.acid.beats, 6);
  assert.equal(wav.acid.rootNote, 50);
  assert.equal(Math.round(wav.acid.tempo), 96);
  assert.equal(wav.acid.flags & 0x01, 0, "a loop is not a one-shot");
  assert.ok(wav.acid.flags & 0x02, "root note set");
  assert.equal(wav.info.INAM, "Gloomwick the Uncanny - F# DORIAN");
  assert.equal(wav.info.ISFT, "The Whimsy Machine 1.2.0");
  assert.equal(wav.chunks.at(-1), "data", "data comes last");
  const oneShot = readWav(encodeWav([sine(10)], 44100, { acid: { bpm: 120, beats: 1, rootNote: 60, oneShot: true } }));
  assert.ok(oneShot.acid.flags & 0x01);
  assert.equal(oneShot.smpl.loops, 0);
});

test("P8-01 a loop-perfect cut is exactly one loop long, starts on beat one, and folds the tail onto the start", () => {
  const start = 10;
  const length = 100;
  const render = new Float32Array(start + length + 40);
  render.fill(0.5, 0, start); // pre-roll: dropped
  render[start] = 1; // beat one
  render[start + length - 1] = 0.25; // last sample of the loop
  render[start + length + 3] = 0.125; // tail: lands on loop sample 3
  render[start + length + 39] = 0.0625; // tail: loop sample 39
  const [loop] = cutRender([render], { start, length, mode: "loop" });
  assert.equal(loop.length, length);
  assert.equal(loop[0], 1);
  assert.equal(loop[3], 0.125);
  assert.equal(loop[39], 0.0625);
  assert.equal(loop[length - 1], 0.25);
  const total = render.slice(start).reduce((a, b) => a + b, 0);
  assert.ok(Math.abs(loop.reduce((a, b) => a + b, 0) - total) < 1e-6, "folding conserves every sample after beat one");

  const tailLongerThanLoop = new Float32Array(start + length * 3);
  tailLongerThanLoop[start + length * 2 + 5] = 0.5;
  assert.equal(cutRender([tailLongerThanLoop], { start, length })[0][5], 0.5, "a tail longer than one loop folds more than once");

  const [shot] = cutRender([render], { start, length, mode: "oneshot" });
  assert.equal(shot.length, length + 40);
  assert.equal(shot[0], 1);
  assert.throws(() => cutRender([render], { start: -1, length }), RangeError);
  assert.throws(() => cutRender([render], { start, length, mode: "wobble" }), RangeError);
});

test("P8-01 the peak ceiling only ever turns files down, by one shared gain", () => {
  const loud = [Float32Array.from([0, 1.5, -0.75])];
  const quiet = [Float32Array.from([0, 0.3, -0.3])];
  const { gain, peak } = applyPeakCeiling([loud, quiet], -1);
  assert.equal(peak, 1.5);
  const ceiling = 10 ** (-1 / 20);
  assert.ok(Math.abs(peakOf(loud) - ceiling) < 1e-6);
  assert.ok(Math.abs(quiet[0][1] - 0.3 * gain) < 1e-7, "stems keep their balance");
  const soft = [Float32Array.from([0.1, -0.2])];
  assert.equal(applyPeakCeiling([soft]).gain, 1);
  assert.ok(Math.abs(soft[0][1] + 0.2) < 1e-7, "never raised");
});

test("P8-01 filenames carry tempo and key in ASCII; settings fall back to known values", () => {
  const key = keyLabelFor(42, 0);
  assert.equal(key.display, "F♯ DORIAN");
  assert.equal(key.ascii, "Fsharp-dorian");
  assert.equal(key.rootNote, 54);
  assert.equal(keyLabelFor(46, 1).ascii, "Bflat-major-pentatonic");
  assert.equal(
    exportFilename({ name: "Gloomwick the Uncanny", seed: 0xdeadbeef }, { bpm: 96.4, keyAscii: key.ascii, suffix: "03 Bass" }),
    "whimsy-gloomwick-the-uncanny-deadbeef-96bpm-Fsharp-dorian-03-bass.wav",
  );
  assert.equal(beatsIn(3.75, 96), 6);
  assert.deepEqual(normalizeExportSettings({}), DEFAULT_EXPORT_SETTINGS);
  assert.deepEqual(normalizeExportSettings({ bitDepth: "32f", sampleRate: "96000", loopMode: "oneshot", stemMode: "printed" }), {
    bitDepth: "32f", sampleRate: 96000, loopMode: "oneshot", stemMode: "printed",
  });
  assert.deepEqual(normalizeExportSettings({ bitDepth: "8", sampleRate: 22050, loopMode: "x", stemMode: "<script>" }), DEFAULT_EXPORT_SETTINGS);
});
