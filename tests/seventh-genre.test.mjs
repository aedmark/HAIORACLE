// P5-23 phase 5 (D-033): an extra genre written purely in Inform 7
// (tests/fixtures/barbershop.ni) compiles alongside the canonical genres and is
// played by the conductor, the Fun Machine, and the session ledger with no
// JavaScript change. This file installs its own rulebooks, so it must not
// import tests/install-rulebooks.mjs.

import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import test from "node:test";

import { buildPerformance } from "../src/accompaniment.mjs";
import { composeHarmony } from "../src/befunge.mjs";
import { composeBass } from "../src/brainfuck.mjs";
import {
  buildFunChord,
  buildFunProgression,
  buildGenreSpine,
  conductEnsemble,
  genreBook,
  genreCodes,
  installRulebooks,
} from "../src/conductor.mjs";
import { composeChimes } from "../src/fractran.mjs";
import { compileRulebooks } from "../src/inform.mjs";
import { composeBeat } from "../src/malbolge.mjs";
import { melodyFor } from "../src/music.mjs";
import { composeScore } from "../src/score.mjs";
import { SESSION_FORMAT, SESSION_VERSION, validateSession } from "../src/session.mjs";
import { composeChant } from "../src/shakespeare.mjs";

const root = new URL("../", import.meta.url);
const read = (path) => readFile(new URL(path, root), "utf8");
const [canonicalSource, barbershopSource, oracle, beatSource, bassSource, harmonySource, pietSource, fractranSource, chantSource] = await Promise.all([
  read("src/rulebooks.ni"), read("tests/fixtures/barbershop.ni"), read("src/oracle.lol"), read("src/beat.mal"), read("src/bass.bf"),
  read("src/harmony.bfg"), read("src/pad.piet"), read("src/chimes.frac"), read("src/chant.spl"),
]);

const CODE = "barbershop_quartet";
const canonical = compileRulebooks(canonicalSource);
const extended = compileRulebooks(`${canonicalSource}\n${barbershopSource}`);
installRulebooks(extended);

test("an extra genre written in Inform 7 compiles after the canonical ones, which stay exactly as they were", () => {
  assert.deepEqual(genreCodes(), [...canonical.genres.map((genre) => genre.code), CODE]);
  for (const genre of canonical.genres) assert.deepEqual(extended.byCode[genre.code], genre, genre.code);
  const book = genreBook(CODE);
  assert.equal(book.title, "BARBERSHOP PARLOR QUARTET");
  assert.equal(book.insistent, true);
  assert.deepEqual(book.overtones.map((o) => o.ratio), ["1/1", "5/4", "3/2", "7/4", "2/1"]);
});

test("the Fun Machine colours keys, builds progressions, and accompanies in the new genre", () => {
  assert.deepEqual([0, 2, 7, 9].map((key) => buildFunChord(key, "auto", CODE, 0).quality), ["major", "dom7", "dom7", "dom7"]);
  assert.equal(buildFunProgression(2, "auto", CODE, 0).summary, "D Maj → B7 → E7 → A7");
  const performance = buildPerformance(7, "progression", CODE, 0);
  assert.deepEqual(performance.chords.map((c) => [c.name, c.quality]), [["G", "major"], ["E", "dom7"], ["A", "dom7"], ["D", "dom7"]]);
  assert.deepEqual(performance.steps.slice(0, 3).map((s) => s.leadPitch), [11, 14, 19]);
});

test("the conductor plays the new genre's changes, bass walk, organ voicing, melody, and overtones", () => {
  const score = composeScore(oracle, "three pigeons in a borrowed coat");
  assert.deepEqual(buildGenreSpine(CODE, score).map((c) => c.op), [
    "I (Tag)", "I (Tag)", "I (Tag)", "VI7", "VI7", "VI7", "II7", "II7", "II7", "V7 (Ring)", "V7 (Ring)", "V7 (Ring)",
  ]);
  const conducted = conductEnsemble({
    score,
    melody: melodyFor(score),
    beat: composeBeat(beatSource, score, 0),
    bass: composeBass(bassSource, score, 0),
    harmony: composeHarmony(harmonySource, score, 0),
    chimes: composeChimes(pietSource, fractranSource, score, 0),
    chant: composeChant(chantSource, score, 0),
    genre: CODE,
  });
  assert.equal(conducted.genre, CODE);
  assert.equal(conducted.genreName, "BARBERSHOP PARLOR QUARTET");
  conducted.spine.forEach((chord, step) => {
    assert.equal(conducted.bass.steps[step].interval, (chord.root + (step % 2 ? 7 : 0)) % 12, `bass walks root-fifth at step ${step}`);
    assert.ok(conducted.bass.steps[step].gate >= 1, "an insistent genre never rests the bass");
    assert.deepEqual([...conducted.harmony.steps[step].chord].sort((a, b) => a - b), [chord.third, chord.fifth, chord.seventh].sort((a, b) => a - b));
    const members = new Set([chord.root, chord.third, chord.fifth, chord.seventh]);
    assert.ok(members.has(((conducted.melody[step] % 12) + 12) % 12), `the lead sings a chord member at step ${step}`);
    assert.ok(["1/1", "5/4", "3/2", "7/4", "2/1"].includes(conducted.chimes.steps[step].ratioLabel));
  });
});

test("saved sessions accept the new genre, and still refuse genres no rulebook names", () => {
  const session = {
    format: SESSION_FORMAT, version: SESSION_VERSION, phrase: "a barbershop tag", tempo: 96, volume: 70, genre: CODE, strictness: 8,
    acoustics: { enabled: true, level: 55, crackle: true, reverb: true, ticks: true },
    funMachine: { style: "progression", progression: Array(12).fill(null) },
    plates: Object.fromEntries(["beat", "bass", "harmony", "chime", "chant"].map((id) => [id, { mutation: 0, cellCycles: Array(12).fill(0) }])),
    mixer: Object.fromEntries(["lead", "fun", "beat", "bass", "harmony", "chime", "chant", "fungal"].map((id) => [id, { fader: 80, pan: 0, muted: false, soloed: false }])),
  };
  assert.equal(validateSession(session).genre, CODE);
  assert.throws(() => validateSession({ ...session, genre: "polka" }), (error) => error.path === "session.genre");
});

test("no JavaScript or page markup names the new genre: Inform 7 alone added it", async () => {
  const files = (await readdir(new URL("src/", root))).filter((name) => name.endsWith(".mjs")).map((name) => `src/${name}`);
  for (const path of [...files, "index.html"]) {
    assert.doesNotMatch(await read(path), /barbershop/i, `${path} mentions the fixture genre`);
  }
});
