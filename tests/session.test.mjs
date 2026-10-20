import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import { buildFunChord, buildFunProgression, GENRE_RULEBOOKS } from "../src/conductor.mjs";
import { composeBeat, cycleBeatStep } from "../src/malbolge.mjs";
import { composeChant, cycleChantCell } from "../src/shakespeare.mjs";
import { createMixerState, mixerStateFromChannels, setFader, setPan, toggleMute, toggleSolo } from "../src/mixer.mjs";
import { composeScore } from "../src/score.mjs";
import {
  MAX_PRESETS,
  MAX_SESSION_BYTES,
  SESSION_FORMAT,
  SESSION_VERSION,
  SessionError,
  emptyPresetStore,
  parsePresetStore,
  parseSession,
  removePreset,
  serializePresetStore,
  serializeSession,
  upsertPreset,
  validateSession,
} from "../src/session.mjs";

const root = new URL("../", import.meta.url);

function sampleSession(overrides = {}) {
  const channels = {};
  for (const id of ["lead", "fun", "beat", "bass", "harmony", "chime", "chant", "fungal"]) {
    channels[id] = { fader: 80, pan: 0, muted: false, soloed: false };
  }
  channels.chant = { fader: 92, pan: -35, muted: false, soloed: true };
  const plates = {};
  for (const id of ["beat", "bass", "harmony", "chime", "chant"]) plates[id] = { mutation: 0, cellCycles: Array(12).fill(0) };
  plates.beat = { mutation: 2, cellCycles: [1, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 2] };
  return {
    format: SESSION_FORMAT,
    version: SESSION_VERSION,
    phrase: "the moon owes me five dollars",
    tempo: 96,
    volume: 70,
    genre: GENRE_RULEBOOKS.SMOKY_JAZZ,
    strictness: 10,
    acoustics: { enabled: true, level: 40, crackle: false, reverb: true, ticks: true },
    funMachine: { style: "arpeggio", progression: [[7, "minor"], null, null, [0, "maj9"], null, null, null, null, null, null, null, null] },
    plates,
    mixer: channels,
    ...overrides,
  };
}

function rejectsAt(value, path) {
  assert.throws(() => validateSession(value), (error) => error instanceof SessionError && error.path === path, path);
}

test("a session round-trips through its .fun text unchanged", () => {
  const session = sampleSession();
  const text = serializeSession(session);
  assert.deepEqual(parseSession(text), validateSession(session));
  assert.deepEqual(JSON.parse(text), session);
  assert.ok(Object.isFrozen(parseSession(text).plates.beat.cellCycles));
});

test("session validation rejects anything outside the allowlist, naming the field", () => {
  rejectsAt({ ...sampleSession(), extra: 1 }, "session.extra");
  const missing = sampleSession();
  delete missing.tempo;
  rejectsAt(missing, "session.tempo");
  rejectsAt(sampleSession({ format: "something-else" }), "session.format");
  rejectsAt(sampleSession({ version: 3 }), "session.version");
  rejectsAt({ ...sampleSession(), funMachine: { ...sampleSession().funMachine, style: "organ" } }, "session.funMachine.style");
  rejectsAt(sampleSession({ tempo: 300 }), "session.tempo");
  rejectsAt(sampleSession({ tempo: 96.5 }), "session.tempo");
  rejectsAt(sampleSession({ volume: "70" }), "session.volume");
  rejectsAt(sampleSession({ genre: "polka" }), "session.genre");
  rejectsAt(sampleSession({ phrase: "" }), "session.phrase");
  rejectsAt(sampleSession({ phrase: "x".repeat(73) }), "session.phrase");
  rejectsAt(sampleSession({ phrase: "bell\u0007" }), "session.phrase");
  rejectsAt(sampleSession({ phrase: 42 }), "session.phrase");

  const badChord = sampleSession();
  badChord.funMachine.progression[1] = [12, "major"];
  rejectsAt(badChord, "session.funMachine.progression[1][0]");
  const badQuality = sampleSession();
  badQuality.funMachine.progression[2] = [3, "<script>"];
  rejectsAt(badQuality, "session.funMachine.progression[2][1]");
  const shortProgression = sampleSession();
  shortProgression.funMachine.progression.pop();
  rejectsAt(shortProgression, "session.funMachine.progression");

  const badCycles = sampleSession();
  badCycles.plates.bass.cellCycles[4] = 1000;
  rejectsAt(badCycles, "session.plates.bass.cellCycles[4]");
  const badPan = sampleSession();
  badPan.mixer.fun.pan = -101;
  rejectsAt(badPan, "session.mixer.fun.pan");
  const missingChannel = sampleSession();
  delete missingChannel.mixer.fungal;
  rejectsAt(missingChannel, "session.mixer.fungal");
});

test("session text is bounded, must be JSON, and cannot smuggle prototype keys", () => {
  assert.throws(() => parseSession("{nope"), (error) => error.path === "file");
  assert.throws(() => parseSession(" ".repeat(MAX_SESSION_BYTES + 1)), (error) => error.path === "file");
  assert.throws(() => parseSession(42), (error) => error.path === "file");
  const proto = serializeSession(sampleSession()).replace('"tempo"', '"__proto__": {"polluted": true}, "tempo"');
  assert.throws(() => parseSession(proto), (error) => error.path === "session.__proto__");
  assert.equal({}.polluted, undefined);
  assert.throws(() => validateSession([]), (error) => error.path === "session");
  assert.throws(() => validateSession(null), (error) => error.path === "session");
});

test("presets store newest first, replace by name, cap the list, and survive corruption", () => {
  let store = emptyPresetStore();
  store = upsertPreset(store, "  midnight   jam ", sampleSession(), "2026-10-19T10:00:00.000Z");
  store = upsertPreset(store, "dawn chorus", sampleSession({ tempo: 120 }), "2026-10-19T11:00:00.000Z");
  assert.deepEqual(store.presets.map((p) => p.name), ["dawn chorus", "midnight jam"]);
  store = upsertPreset(store, "midnight jam", sampleSession({ tempo: 60 }), "2026-10-19T12:00:00.000Z");
  assert.deepEqual(store.presets.map((p) => [p.name, p.session.tempo]), [["midnight jam", 60], ["dawn chorus", 120]]);

  const roundTrip = parsePresetStore(serializePresetStore(store));
  assert.deepEqual(roundTrip, store);
  assert.deepEqual(removePreset(store, "dawn chorus").presets.map((p) => p.name), ["midnight jam"]);

  for (let i = 0; i < MAX_PRESETS + 5; i += 1) store = upsertPreset(store, `take ${i}`, sampleSession(), "t");
  assert.equal(store.presets.length, MAX_PRESETS);
  assert.equal(store.presets[0].name, `take ${MAX_PRESETS + 4}`);

  assert.throws(() => upsertPreset(store, "", sampleSession(), "t"), SessionError);
  assert.throws(() => upsertPreset(store, "x".repeat(41), sampleSession(), "t"), SessionError);
  assert.throws(() => upsertPreset(store, "ok", sampleSession({ tempo: 1 }), "t"), SessionError);

  for (const junk of [null, "", "{", "[]", '{"version":2,"presets":[]}', '{"version":1,"presets":{}}']) {
    assert.deepEqual(parsePresetStore(junk), emptyPresetStore(), String(junk));
  }
  const mixed = JSON.stringify({ version: 1, presets: [
    { name: "good", savedAt: "t", session: sampleSession() },
    { name: "bad tempo", savedAt: "t", session: sampleSession({ tempo: 999 }) },
    { name: "good", savedAt: "t", session: sampleSession() },
    { name: "extra", savedAt: "t", session: sampleSession(), sneaky: true },
  ] });
  assert.deepEqual(parsePresetStore(mixed).presets.map((p) => p.name), ["good"], "bad and duplicate entries are dropped individually");
});

test("console state rebuilds from session channels", () => {
  const session = validateSession(sampleSession());
  const state = mixerStateFromChannels(session.mixer);
  const expected = toggleSolo(setPan(setFader(createMixerState(), "chant", 92), "chant", -35), "chant");
  assert.deepEqual(state, expected);
  const muted = mixerStateFromChannels({ ...session.mixer, beat: { fader: 10, pan: 50, muted: true, soloed: false } });
  assert.deepEqual(muted.channels.beat, toggleMute(setPan(setFader(createMixerState(), "beat", 10), "beat", 50), "beat").channels.beat);
});

test("punched chords rebuild exactly from root and quality", () => {
  for (const genre of Object.values(GENRE_RULEBOOKS)) {
    for (const quality of ["auto", "major", "minor", "dom7", "maj9", "dim", "modal_open"]) {
      for (let semitone = 0; semitone < 12; semitone += 1) {
        for (const chord of buildFunProgression(semitone, quality, genre, 52).chords) {
          assert.deepEqual(buildFunChord(chord.rootPc, chord.quality), chord);
          const session = sampleSession();
          session.funMachine.progression[0] = [chord.rootPc, chord.quality];
          assert.doesNotThrow(() => validateSession(session), `${genre} ${quality} ${chord.quality}`);
        }
      }
    }
  }
});

test("plate cells cycle independently, so per-cell counts replay any click order", async () => {
  const [oracle, beatSource, chantSource] = await Promise.all([
    readFile(new URL("src/oracle.lol", root), "utf8"),
    readFile(new URL("src/beat.mal", root), "utf8"),
    readFile(new URL("src/chant.spl", root), "utf8"),
  ]);
  const score = composeScore(oracle, "three pigeons in a borrowed coat");
  const clicks = [3, 0, 3, 11, 3, 0, 7, 11, 3];
  for (const [plate, cycle] of [
    [composeBeat(beatSource, score, 1), (step) => cycleBeatStep(step)],
    [composeChant(chantSource, score, 0), (step) => cycleChantCell(step, score)],
  ]) {
    const interleaved = [...plate.steps];
    for (const index of clicks) interleaved[index] = cycle(interleaved[index]);
    const counts = Array(12).fill(0);
    for (const index of clicks) counts[index] += 1;
    const replayed = [...plate.steps];
    counts.forEach((count, index) => { for (let n = 0; n < count; n += 1) replayed[index] = cycle(replayed[index]); });
    assert.deepEqual(replayed, interleaved);
  }
});

test("version 1 sessions upgrade: chord mode becomes a progression, lead solo an arpeggio", () => {
  const v1 = (mode) => {
    const session = sampleSession({ version: 1 });
    session.funMachine = { mode, quality: "maj9", progression: sampleSession().funMachine.progression };
    return session;
  };
  const upgraded = validateSession(v1("auto_chord"));
  assert.equal(upgraded.version, SESSION_VERSION);
  assert.equal(upgraded.funMachine.style, "progression");
  assert.equal(validateSession(v1("lead")).funMachine.style, "arpeggio");
  assert.deepEqual(upgraded.funMachine.progression, validateSession(sampleSession()).funMachine.progression);
  assert.equal(JSON.parse(serializeSession(upgraded)).version, 2, "an upgraded session saves as version 2");
  const badMode = v1("theremin");
  assert.throws(() => validateSession(badMode), (error) => error.path === "session.funMachine.mode");
  const v1WithStyle = sampleSession({ version: 1 });
  assert.throws(() => validateSession(v1WithStyle), (error) => error.path === "session.funMachine.style");
});
