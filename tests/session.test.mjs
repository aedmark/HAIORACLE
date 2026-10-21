import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import { buildFunChord, buildFunProgression } from "../src/conductor.mjs";
import { GENRES } from "./install-rulebooks.mjs";
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
    genre: "smoky_jazz",
    strictness: 10,
    acoustics: { enabled: true, level: 40, crackle: false, reverb: true, ticks: true },
    funMachine: { style: "arpeggio", voice: "glass_harmonica" },
    plates,
    mixer: channels,
    song: { loops: [{ repeats: 2, layers: [[{ key: 7, style: "progression", voice: "creature" }, ...Array(11).fill(null)], [null, null, { key: 12, style: "arpeggio", voice: "music_box" }, ...Array(9).fill(null)]] }] },
    ...overrides,
  };
}

// An older-format sample: versions before 5 carry no voices, and versions
// before 4 no song.
function olderSession(version, overrides = {}) {
  const session = sampleSession({ version, funMachine: { style: "arpeggio" }, ...overrides });
  if (version === 4) {
    session.song = { loops: session.song.loops.map((loop) => ({ ...loop, layers: loop.layers.map((take) => take.map((slot) => slot && { key: slot.key, style: slot.style })) })) };
  } else {
    delete session.song;
  }
  return session;
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
  rejectsAt(sampleSession({ version: 6 }), "session.version");
  rejectsAt(sampleSession({ song: { loops: [{ repeats: 9, layers: [[{ key: 0, style: "swell" }, ...Array(11).fill(null)]] }] } }), "session.song.loops[0].repeats");
  rejectsAt(sampleSession({ song: { loops: [{ repeats: 1, layers: [[{ key: 0, style: "organ", voice: "velvet_pad" }, ...Array(11).fill(null)]] }] } }), "session.song.loops[0].layers[0][0].style");
  const noSong = sampleSession();
  delete noSong.song;
  rejectsAt(noSong, "session.song");
  rejectsAt({ ...sampleSession(), funMachine: { style: "organ", voice: "velvet_pad" } }, "session.funMachine.style");
  rejectsAt({ ...sampleSession(), funMachine: { style: "arpeggio", voice: "velvet_pad", progression: Array(12).fill(null) } }, "session.funMachine.progression");
  rejectsAt(sampleSession({ tempo: 300 }), "session.tempo");
  rejectsAt(sampleSession({ tempo: 96.5 }), "session.tempo");
  rejectsAt(sampleSession({ volume: "70" }), "session.volume");
  rejectsAt(sampleSession({ genre: "polka" }), "session.genre");
  rejectsAt(sampleSession({ phrase: "" }), "session.phrase");
  rejectsAt(sampleSession({ phrase: "x".repeat(73) }), "session.phrase");
  rejectsAt(sampleSession({ phrase: "bell\u0007" }), "session.phrase");
  rejectsAt(sampleSession({ phrase: 42 }), "session.phrase");


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

test("version 2 files still open: their punched progression is checked, then dropped (D-038)", () => {
  const v2 = (progression) => ({ ...olderSession(2), funMachine: { style: "swell", progression } });
  const punched = [[7, "minor"], null, null, [0, "maj9"], null, null, null, null, null, null, null, null];
  const opened = validateSession(v2(punched));
  assert.equal(opened.version, SESSION_VERSION);
  assert.deepEqual(opened.funMachine, { style: "swell", voice: "velvet_pad" }, "only the style survives, in the voice it was made in");
  assert.equal(JSON.parse(serializeSession(opened)).funMachine.progression, undefined, "a re-save writes v3 without it");
  for (const genre of GENRES) {
    for (let root = 0; root < 12; root += 1) {
      for (const quality of ["major", "minor", "dom7", "maj9", "dim", "modal_open"]) {
        const chord = buildFunProgression(root, quality, genre, 52).chords[0];
        const steps = Array(12).fill(null);
        steps[0] = [chord.rootPc, chord.quality];
        assert.doesNotThrow(() => validateSession(v2(steps)), `${genre} ${quality}: every chord an old file could hold still opens`);
      }
    }
  }
  const bad = (index, step, path) => {
    const steps = Array(12).fill(null);
    steps[index] = step;
    rejectsAt(v2(steps), path);
  };
  bad(1, [12, "major"], "session.funMachine.progression[1][0]");
  bad(2, [3, "<script>"], "session.funMachine.progression[2][1]");
  rejectsAt(v2(Array(11).fill(null)), "session.funMachine.progression");
  assert.equal(buildFunChord(0, "major").quality, "major");
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
    const session = olderSession(1);
    session.funMachine = { mode, quality: "maj9", progression: [[7, "minor"], ...Array(11).fill(null)] };
    return session;
  };
  const upgraded = validateSession(v1("auto_chord"));
  assert.equal(upgraded.version, SESSION_VERSION);
  assert.equal(upgraded.funMachine.style, "progression");
  assert.equal(validateSession(v1("lead")).funMachine.style, "arpeggio");
  assert.deepEqual(upgraded.funMachine, { style: "progression", voice: "velvet_pad" }, "the old progression is dropped");
  assert.equal(JSON.parse(serializeSession(upgraded)).version, SESSION_VERSION, "an upgraded session saves as the current version");
  const badMode = v1("theremin");
  assert.throws(() => validateSession(badMode), (error) => error.path === "session.funMachine.mode");
  const v1WithStyle = olderSession(1);
  assert.throws(() => validateSession(v1WithStyle), (error) => error.path === "session.funMachine.style");
});

test("version 3 files open with an empty song, and a v4 song round-trips with its loops and layers (D-039)", () => {
  const v3 = olderSession(3);
  const opened = validateSession(v3);
  assert.deepEqual(opened.song, { loops: [] });
  assert.equal(opened.version, SESSION_VERSION);
  const withSong = validateSession(sampleSession());
  assert.equal(withSong.song.loops[0].repeats, 2);
  assert.deepEqual(withSong.song.loops[0].layers.map((take) => take.filter(Boolean).map((slot) => slot.key)), [[7], [12]]);
  assert.deepEqual(parseSession(serializeSession(withSong)).song, withSong.song);
  const v3WithSong = { ...sampleSession({ version: 3, funMachine: { style: "arpeggio" } }) };
  rejectsAt(v3WithSong, "session.song");
});

test("v5 keeps the Fun Machine's voice and each slot's; v4 songs open in VELVET PAD (D-040)", () => {
  const opened = validateSession(sampleSession());
  assert.equal(opened.funMachine.voice, "glass_harmonica");
  assert.deepEqual(opened.song.loops[0].layers.map((take) => take.filter(Boolean).map((slot) => slot.voice)), [["creature"], ["music_box"]]);
  const v4 = validateSession(olderSession(4));
  assert.equal(v4.funMachine.voice, "velvet_pad");
  assert.deepEqual(v4.song.loops[0].layers.flat().filter(Boolean).map((slot) => slot.voice), ["velvet_pad", "velvet_pad"]);
  assert.equal(v4.version, SESSION_VERSION, "an opened v4 file saves back as v5");
  assert.equal(validateSession(olderSession(2, { funMachine: { style: "swell", progression: Array(12).fill(null) } })).funMachine.voice, "velvet_pad");
  rejectsAt(sampleSession({ funMachine: { style: "arpeggio", voice: "calliope" } }), "session.funMachine.voice");
  rejectsAt(sampleSession({ funMachine: { style: "arpeggio" } }), "session.funMachine.voice");
  const badSlot = sampleSession();
  badSlot.song.loops[0].layers[0][0] = { key: 7, style: "progression", voice: "kazoo" };
  rejectsAt(badSlot, "session.song.loops[0].layers[0][0].voice");
  const v4WithVoice = olderSession(4);
  v4WithVoice.song.loops[0].layers[0][0] = { key: 7, style: "progression", voice: "music_box" };
  rejectsAt(v4WithVoice, "session.song.loops[0].layers[0][0].voice");
  rejectsAt({ ...olderSession(4), funMachine: { style: "arpeggio", voice: "music_box" } }, "session.funMachine.voice");
});
