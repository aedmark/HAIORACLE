import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import {
  CREATURE_VOICE_ID,
  DEFAULT_VOICE_ID,
  creatureVoice,
  creatureVoiceLabel,
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
  const { env, oscillators, peak, start } = scheduleVoicePad(context, {}, velvet, [48, 55, 60, 64], { start: 1, sounding: 2, level: 1 });
  assert.equal(oscillators.length, 1 + 1 + 3 * 3, "chorus LFO, the root's layer, three layers on each upper note");
  assert.equal(context.counts.panner, 2);
  assert.equal(peak, 0.34 / 2);
  assert.equal(env.gain.value, 0.0001, "initial gain is bounded to 0.0001 so cancellation can never spike to unity 1.0");
  assert.equal(start, 1, "start time is returned for safe schedule release handling");

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

test("the VOICE chips offer the creature's own voice first and pressed, then every preset in order", async () => {
  const html = await readFile(new URL("../index.html", import.meta.url), "utf8");
  const chips = [...html.matchAll(/<button class="fun-chip( is-active)?" data-voice="([a-z_]+)" type="button" aria-pressed="(true|false)" title="[^"]+">([^<]+)<\/button>/g)];
  assert.deepEqual(chips.map((m) => m[2]), [CREATURE_VOICE_ID, ...VOICE_IDS]);
  assert.deepEqual(chips.map((m) => m[4]), ["THE CREATURE'S OWN", ...VOICE_PRESETS.map((voice) => voice.label)]);
  assert.deepEqual(chips.filter((m) => m[3] === "true").map((m) => [m[2], Boolean(m[1])]), [[CREATURE_VOICE_ID, true]]);
});

test("tremolo, formants, and a struck rolled chord build bounded extra nodes", () => {
  const organ = fakeContext();
  const { oscillators } = scheduleVoicePad(organ, {}, voiceById("theatre_organ"), [48, 55, 60], { start: 0, sounding: 1 });
  assert.equal(oscillators.length, 2 + 3 * 3, "chorus and tremulant LFOs are released with the pad");

  const choir = fakeContext();
  scheduleVoicePad(choir, {}, voiceById("aether_choir"), [48, 55, 60], { start: 0, sounding: 1 });
  assert.equal(choir.counts.filter, 1 + 3, "a lowpass feeding three formant bands");

  const box = fakeContext();
  const original = box.createOscillator;
  const starts = [];
  box.createOscillator = () => { const osc = original(); osc.start = (at) => starts.push(at); return osc; };
  scheduleVoicePad(box, {}, voiceById("music_box"), [48, 55, 60, 64], { start: 1, sounding: 0.06 });
  const noteStarts = [...new Set(starts.slice(0, -1))];
  assert.deepEqual(noteStarts, [1, 1.03], "the roll never takes more than half the chord's length");

  const bad = structuredClone(voiceById("aether_choir"));
  bad.pad.formants.push({ freq: 3000, q: 8, gain: 1 });
  assert.throws(() => validateVoice(bad), (error) => error.path === "voice.pad.formants");
  const fast = structuredClone(voiceById("theatre_organ"));
  fast.lead.tremolo.depth = 0.9;
  assert.throws(() => validateVoice(fast), (error) => error.path === "voice.lead.tremolo.depth");
  const pluckFormants = structuredClone(velvet);
  pluckFormants.pluck.formants = [];
  assert.throws(() => validateVoice(pluckFormants), (error) => error.path === "voice.pluck.formants");
});

test("the creature's own voice is a preset the spell chose, tilted and spread within bounds", async () => {
  const { composeScore } = await import("../src/score.mjs");
  const oracle = await readFile(new URL("../src/oracle.lol", import.meta.url), "utf8");
  const seen = new Set();
  for (let i = 0; i < 120; i += 1) {
    const score = composeScore(oracle, `voice test ${i}`);
    const voice = creatureVoice(score);
    assert.deepEqual(creatureVoice(composeScore(oracle, `voice test ${i}`)), voice, "the same phrase always sounds the same");
    assert.equal(voice.id, CREATURE_VOICE_ID);
    assert.equal(voice.label, VOICE_PRESETS[score.funVoice].label);
    seen.add(score.funVoice);
  }
  assert.equal(seen.size, VOICE_PRESETS.length, "every preset is some creature's voice");

  const at = (funBright, funSpread) => creatureVoice({ funVoice: 0, funBright, funSpread });
  assert.deepEqual(at(0, 2).pad, velvet.pad, "the middle of both ranges is the preset as tuned");
  assert.equal(at(3, 2).pad.filter.peak, Math.round(1750 * Math.SQRT2), "brightest is half an octave up");
  assert.equal(at(-3, 2).lead.filter.base, Math.round(2600 / Math.SQRT2));
  assert.equal(at(0, 4).pad.upper[0].detune, -8 * 1.4);
  assert.equal(at(0, 0).pad.width, 0.55 * 0.6);
  const choir = creatureVoice({ funVoice: 6, funBright: 3, funSpread: 4 });
  assert.deepEqual(choir.pad.formants, voiceById("aether_choir").pad.formants, "formants are the vowel, so they stay");
  assert.equal(creatureVoiceLabel({ funVoice: 2, funBright: 2, funSpread: 3 }), "GLASS HARMONICA · BRIGHTER · WIDE");
  assert.equal(creatureVoiceLabel({ funVoice: 0, funBright: 0, funSpread: 2 }), "VELVET PAD");
});
