import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import { composeScore } from "../src/score.mjs";
import { composeBeat } from "../src/malbolge.mjs";
import { composeBass } from "../src/brainfuck.mjs";
import { composeHarmony } from "../src/befunge.mjs";
import { composeChimes } from "../src/fractran.mjs";
import { composeChant } from "../src/shakespeare.mjs";
import { melodyFor } from "../src/music.mjs";
import {
  appendagePlacement,
  buildFruitingBodies,
  buildGlassCondensation,
  buildMycelialNetwork,
  buildSporeSystem,
  fluxOffset,
  interaction,
  mulberry32,
  paletteFor,
  projectedTesseract,
  shapeFamilyRadius,
  shapeRadius,
  stepInteraction,
  wrapHue,
} from "../src/vitrine-canvas.mjs";
import {
  renderSpecimenBroadsheetCanvas,
  wrapCanvasText,
} from "../src/broadsheet.mjs";
import {
  LEAD_DUCK_GAIN,
  ensureNoiseBuffer,
  ensureParlorImpulseResponse,
  ensureWaxCrackleBuffer,
  harmonicField,
  midiToFrequency,
  scheduleBassStep,
  scheduleBeatStep,
  scheduleChantStep,
  scheduleChimeStep,
  scheduleClockworkTick,
  scheduleFungalBioStep,
  scheduleHarmonyStep,
  scheduleNote,
  triggerPercussion,
  triggerSporePuff,
  voiceStack,
} from "../src/schedulers.mjs";

const root = new URL("../", import.meta.url);

function createFakeAudioContext() {
  const nodes = [];
  const param = (initial = 0) => ({
    value: initial,
    setValueAtTime(v) { this.value = v; },
    exponentialRampToValueAtTime(v) { this.value = v; },
    setTargetAtTime(v) { this.value = v; },
  });
  const node = (kind, extra = {}) => {
    const created = {
      kind,
      connect(target) { return target; },
      ...extra,
    };
    nodes.push(created);
    return created;
  };
  return {
    currentTime: 1.0,
    sampleRate: 8000,
    nodes,
    createGain: () => node("gain", { gain: param(1) }),
    createBiquadFilter: () => node("biquad", { type: "lowpass", frequency: param(350), Q: param(1) }),
    createBufferSource: () => node("bufferSource", { buffer: null, start() {}, stop() {} }),
    createOscillator: () => node("oscillator", { type: "sine", frequency: param(440), detune: param(), start() {}, stop() {} }),
    createStereoPanner: () => node("panner", { pan: param() }),
    createBuffer: (channels, frames, sampleRate) => {
      const data = Array.from({ length: channels }, () => new Float32Array(frames));
      return {
        numberOfChannels: channels,
        length: frames,
        sampleRate,
        getChannelData(ch) { return data[ch]; },
      };
    },
  };
}

test("vitrine-canvas exports deterministic geometry, palette, and mycelial builders (P4-03)", async () => {
  const oracleSource = await readFile(new URL("src/oracle.lol", root), "utf8");
  const score = composeScore(oracleSource, "a quiet velvet bell");

  assert.equal(wrapHue(-30), 330);
  assert.equal(wrapHue(390), 30);

  const rngA = mulberry32(score.seed);
  const rngB = mulberry32(score.seed);
  assert.equal(rngA(), rngB());

  const palette = paletteFor(score);
  assert.equal(palette.length, 3);
  for (const hue of palette) {
    assert.ok(hue >= 0 && hue < 360);
  }

  for (let shape = 0; shape < 10; shape += 1) {
    const r = shapeFamilyRadius(shape, score.symmetry, score.edge / 100, score.twist, 0.5);
    assert.ok(r > 0 && r < 2);
  }
  const clamped = shapeRadius(score, 0.75, 1.2);
  assert.ok(clamped >= 0.38 && clamped <= 1.08);
  assert.ok(Number.isFinite(fluxOffset(score, 0.5, 1.0)));

  const pts = projectedTesseract(100, 1.0, 2);
  assert.equal(pts.length, 16);

  const placement = appendagePlacement(score, 0, score.eyes, 120, 1.0);
  assert.ok(Number.isFinite(placement.x) && Number.isFinite(placement.y) && placement.scale > 0);

  const mycelium = buildMycelialNetwork(score);
  assert.ok(mycelium.branches.length >= 7);
  const fruiting = buildFruitingBodies(score, mycelium);
  assert.ok(fruiting.length >= 3);
  const spores = buildSporeSystem(score, fruiting);
  assert.equal(spores.length, 36 + Math.floor(score.fungalSpores * 0.5));
  const droplets = buildGlassCondensation(score);
  assert.ok(droplets.length > 0);

  stepInteraction(100);
  assert.ok(Number.isFinite(interaction.hold));
});

test("broadsheet module wraps text and engraves the 1200x1520 specimen canvas (P4-03)", async () => {
  const oracleSource = await readFile(new URL("src/oracle.lol", root), "utf8");
  const score = composeScore(oracleSource, "three pigeons in a borrowed coat");

  const fakeCtx = {
    fillStyle: "",
    strokeStyle: "",
    lineWidth: 1,
    font: "",
    textAlign: "left",
    measureText: (txt) => ({ width: txt.length * 8 }),
    fillRect() {},
    strokeRect() {},
    beginPath() {},
    arc() {},
    stroke() {},
    fill() {},
    save() {},
    restore() {},
    setLineDash() {},
    drawImage() {},
    fillText() {},
    createLinearGradient: () => ({ addColorStop() {} }),
    createRadialGradient: () => ({ addColorStop() {} }),
  };

  const lines = wrapCanvasText(fakeCtx, "THE QUICK BROWN FOX JUMPS OVER THE LAZY PARLOR ORGAN", 160);
  assert.ok(lines.length >= 2);

  let createdPlate = null;
  const fakeDoc = {
    createElement(tag) {
      assert.equal(tag, "canvas");
      createdPlate = {
        width: 0,
        height: 0,
        getContext: () => fakeCtx,
      };
      return createdPlate;
    },
  };

  const plate = renderSpecimenBroadsheetCanvas(score, {
    doc: fakeDoc,
    sourceCanvas: { width: 640, height: 640 },
  });
  assert.equal(plate, createdPlate);
  assert.equal(plate.width, 1200);
  assert.equal(plate.height, 1520);
});

test("schedulers module synthesizes buffers and schedules all seven ensemble voices (P4-03)", async () => {
  const [oracleSource, beatSource, bassSource, harmonySource, pietSource, fracSource, chantSource] = await Promise.all([
    readFile(new URL("src/oracle.lol", root), "utf8"),
    readFile(new URL("src/beat.mal", root), "utf8"),
    readFile(new URL("src/bass.bf", root), "utf8"),
    readFile(new URL("src/harmony.bfg", root), "utf8"),
    readFile(new URL("src/pad.piet", root), "utf8"),
    readFile(new URL("src/chimes.frac", root), "utf8"),
    readFile(new URL("src/chant.spl", root), "utf8"),
  ]);
  const score = composeScore(oracleSource, "the wallpaper knows jazz");
  const melody = melodyFor(score);
  const currentBeat = composeBeat(beatSource, score);
  const currentBass = composeBass(bassSource, score, melody);
  const currentHarmony = composeHarmony(harmonySource, score);
  const currentChimes = composeChimes(pietSource, fracSource, score);
  const currentChant = composeChant(chantSource, score);

  assert.equal(midiToFrequency(69), 440);
  assert.ok(LEAD_DUCK_GAIN > 0 && LEAD_DUCK_GAIN < 1);
  assert.ok(voiceStack(score, 0).length >= 1);
  assert.ok(Number.isFinite(harmonicField().primaryWeight));

  const ctx = createFakeAudioContext();
  assert.equal(ensureNoiseBuffer(ctx).sampleRate, 8000);
  assert.equal(ensureWaxCrackleBuffer(ctx, 0.25).numberOfChannels, 2);
  assert.equal(ensureParlorImpulseResponse(ctx, 0.25).numberOfChannels, 2);

  const logged = [];
  const logNote = (_transport, channel, midi) => logged.push({ channel, midi: Math.round(midi) });
  const bus = ctx.createGain();
  const transport = {
    step: 0,
    melody,
    mix: bus,
    beatBus: bus,
    bassBus: bus,
    harmonyBus: bus,
    chimeBus: bus,
    chantBus: bus,
    fungalBus: bus,
    parlorReverbSend: bus,
  };

  scheduleNote(ctx, transport, score, 0, 1.0, 0.25, { currentTransport: transport, logNote });
  for (let step = 0; step < 12; step += 1) {
    scheduleBeatStep(ctx, transport, score, step, 1.0, 0.25, { currentBeat, logNote });
    scheduleBassStep(ctx, transport, score, step, 1.0, 0.25, { currentBass, logNote });
    scheduleHarmonyStep(ctx, transport, score, step, 1.0, 0.25, { currentHarmony, logNote });
    scheduleChimeStep(ctx, transport, score, step, 1.0, 0.25, { currentChimes, logNote });
    scheduleChantStep(ctx, transport, score, step, 1.0, 0.25, { currentChant, logNote });
    scheduleFungalBioStep(ctx, transport, score, step, 1.0, 0.25, { logNote });
  }
  scheduleClockworkTick(ctx, bus, 1.0, 0, 0.55);
  scheduleClockworkTick(ctx, bus, 1.0, 1, 0.55);
  triggerPercussion("strike", 0.2, -0.2, 0.8, { audioContext: ctx, currentTransport: transport, score });
  triggerPercussion("ratchet", 0.2, -0.2, 0.8, { audioContext: ctx, currentTransport: transport, score });
  triggerPercussion("retaliation", 0.2, -0.2, 0.8, { audioContext: ctx, currentTransport: transport, score });
  triggerPercussion("dull_thud", 0.2, -0.2, 0.8, { audioContext: ctx, currentTransport: transport, score });
  triggerSporePuff(0.9, 1.0, { audioContext: ctx, currentTransport: transport });

  const channelsLogged = new Set(logged.map((item) => item.channel));
  for (const ch of ["lead", "beat", "bass", "harmony", "chime", "chant"]) {
    assert.ok(channelsLogged.has(ch), `expected ${ch} to log notes`);
  }
});
