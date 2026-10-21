import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import {
  DEFAULT_VOICE_ID,
  VOICE_IDS,
  VOICE_PRESETS,
  VoiceError,
  scheduleVoiceLead,
  scheduleVoicePad,
  scheduleVoicePluck,
  validateVoice,
  voiceById,
} from "../src/voices.mjs";

// Counts nodes and remembers every param automation call.
function fakeContext() {
  const counts = { oscillator: 0, gain: 0, filter: 0, panner: 0 };
  const param = () => ({ calls: [], setValueAtTime(...a) { this.calls.push(["set", ...a]); }, linearRampToValueAtTime(...a) { this.calls.push(["lin", ...a]); },
    exponentialRampToValueAtTime(...a) { this.calls.push(["exp", ...a]); }, setTargetAtTime(...a) { this.calls.push(["target", ...a]); } });
  const node = (kind, params) => { counts[kind] += 1; return { ...Object.fromEntries(params.map((p) => [p, param()])), connect: (target) => target, start() {}, stop() {} }; };
  return {
    counts,
    currentTime: 0,
    createGain: () => node("gain", ["gain"]),
    createOscillator: () => node("oscillator", ["frequency", "detune"]),
    createBiquadFilter: () => node("filter", ["frequency", "Q"]),
    createStereoPanner: () => node("panner", ["pan"]),
  };
}

const velvet = voiceById(DEFAULT_VOICE_ID);

test("VELVET PAD is the default and still the Fun Machine's original numbers", () => {
  assert.equal(DEFAULT_VOICE_ID, "velvet_pad");
  assert.equal(VOICE_IDS[0], "velvet_pad");
  assert.equal(velvet.label, "VELVET PAD");
  assert.deepEqual(velvet.pad.upper.map((l) => [l.type, l.detune, l.gain, l.side]), [["sawtooth", -8, 0.3, "left"], ["sawtooth", 8, 0.3, "right"], ["triangle", 0, 0.32, "center"]]);
  assert.deepEqual([velvet.pad.level, velvet.pad.filter.base, velvet.pad.filter.peak, velvet.pad.chorus.rate], [0.34, 420, 1750, 0.23]);
  assert.deepEqual(velvet.lead.layers.map((l) => [l.type, l.ratio, l.gain]), [["sine", 1, 0.6], ["triangle", 1, 0.32], ["sine", 2, 0.08]]);
  assert.equal(voiceById("calliope"), velvet, "unknown voices fall back to VELVET PAD");
  assert.ok(Object.isFrozen(velvet.pad.upper[0]));
});

test("every shipped preset passes the validator, and the validator names the bad field", () => {
  for (const voice of VOICE_PRESETS) assert.deepEqual(validateVoice(structuredClone(voice)), voice, voice.id);
  const rejects = (edit, path) => {
    const raw = structuredClone(velvet);
    edit(raw);
    assert.throws(() => validateVoice(raw), (error) => error instanceof VoiceError && error.path === path, path);
  };
  rejects((v) => { v.extra = 1; }, "voice.extra");
  rejects((v) => { v.id = "Velvet Pad"; }, "voice.id");
  rejects((v) => { v.program = 128; }, "voice.program");
  rejects((v) => { v.pad.level = 0.9; }, "voice.pad.level");
  rejects((v) => { v.pad.filter.peak = 20000; }, "voice.pad.filter.peak");
  rejects((v) => { v.pad.filter.q = 30; }, "voice.pad.filter.q");
  rejects((v) => { v.pad.upper.push(v.pad.root[0]); }, "voice.pad.upper");
  rejects((v) => { v.pad.root[0].type = "custom"; }, "voice.pad.root[0].type");
  rejects((v) => { v.pluck.layers[1].detune = 400; }, "voice.pluck.layers[1].detune");
  rejects((v) => { delete v.lead.vibrato.rate; }, "voice.lead.vibrato.rate");
  rejects((v) => { v.lead.layers[0].side = "left"; }, "voice.lead.layers[0].side");
  rejects((v) => { v.pad.attack.max = 0.01; }, "voice.pad.attack.max");
});

test("the schedulers build what the patch describes, and no more", () => {
  const context = fakeContext();
  const { oscillators, peak } = scheduleVoicePad(context, {}, velvet, [48, 55, 60, 64], { start: 1, sounding: 2, level: 1 });
  assert.equal(oscillators.length, 1 + 1 + 3 * 3, "chorus LFO, the root's layer, three layers on each upper note");
  assert.equal(context.counts.panner, 2);
  assert.equal(peak, 0.34 / 2);

  const pluck = fakeContext();
  const result = scheduleVoicePluck(pluck, {}, velvet, 67, { start: 0, duration: 1, accent: true });
  assert.equal(pluck.counts.oscillator, 2);
  assert.equal(result.decay, 0.55, "decay is clamped to the patch's maximum");
  assert.equal(result.peak, 0.15);

  const lead = fakeContext();
  assert.equal(scheduleVoiceLead(lead, {}, velvet, 72, { start: 0, duration: 0.05 }).sounding, 0.14, "a lead note lasts at least minLength");
  assert.equal(lead.counts.oscillator, 1 + 3, "vibrato plus three layers");
});

test("the app plays the Fun Machine only through voices", async () => {
  const app = await readFile(new URL("../src/app.mjs", import.meta.url), "utf8");
  for (const name of ["scheduleVoicePad", "scheduleVoicePluck", "scheduleVoiceLead"]) {
    assert.equal((app.match(new RegExp(`\\b${name}\\(context`, "g")) || []).length, 1, name);
  }
  assert.doesNotMatch(app, /type: "sawtooth", detune: -8/, "the pad's layers live in src/voices.mjs");
});
