// D-043 phase 0: no part sings a semitone against the chord. Measures, over a
// batch of phrases, how often two parts of the conducted ensemble sound a
// semitone apart where the chord itself does not hold both notes, and holds
// each fettered genre under a ceiling. Before the fixes the triadic genres
// clashed on 20-29% of steps; the blues keep their blue notes on purpose.

import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import "./install-rulebooks.mjs";
import { composeHarmony } from "../src/befunge.mjs";
import { composeBass } from "../src/brainfuck.mjs";
import { avoidNoteResolution, buildTriad, chordOvertones, conductEnsemble, genreCodes, walkTone } from "../src/conductor.mjs";
import { composeChimes } from "../src/fractran.mjs";
import { composeBeat } from "../src/malbolge.mjs";
import { melodyFor } from "../src/music.mjs";
import { composeScore } from "../src/score.mjs";
import { composeChant } from "../src/shakespeare.mjs";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");
const [oracle, beat, bass, harmony, piet, fractran, chant] = await Promise.all(
  ["src/oracle.lol", "src/beat.mal", "src/bass.bf", "src/harmony.bfg", "src/pad.piet", "src/chimes.frac", "src/chant.spl"].map(read),
);
const pc = (value) => ((Math.round(value) % 12) + 12) % 12;

// Percent of steps with a clash, per genre. Blues: the loose sieve's blue notes.
const CEILINGS = Object.freeze({
  victorian_tonnetz: 8,
  blues_twelve_bar: 35,
  smoky_jazz: 6,
  renaissance_counterpoint: 8,
  modal_drone: 3,
  parlor_ragtime: 3,
  // D-041 wave 1, measured at 0-6% when written.
  doowop_ballad: 3,
  sacred_harp: 3,
  andalusian_flamenco: 3,
  klezmer_freygish: 3,
  sea_shanty: 3,
  silent_film_lydian: 8,
  // D-041 wave 2, measured at 0% when written.
  bossa_nova_salon: 4,
  baroque_chorale: 4,
  gothic_horror: 4,
  gospel_shout: 4,
  tango_habanera: 4,
  neo_soul: 4,
  // D-041 wave 3.
  vaudeville_waltz: 4,
  swing_ballroom: 4,
  gamelan_pelog: 4,
});

// Varied creatures (D-043 phase 2) may reach chords the genre never wrote;
// jazz then adds idiomatic rubs (a 6th against a minor 7th).
const VARIED_CEILINGS = Object.freeze({ ...CEILINGS, smoky_jazz: 10, silent_film_lydian: 10, bossa_nova_salon: 6, neo_soul: 6, swing_ballroom: 6 });

function clashRate(genre, phrases, varied = false) {
  let steps = 0;
  let clashing = 0;
  for (const phrase of phrases) {
    const score = composeScore(oracle, phrase);
    const c = conductEnsemble({
      score, melody: melodyFor(score), beat: composeBeat(beat, score, 0), bass: composeBass(bass, score, 0),
      harmony: composeHarmony(harmony, score, 0), chimes: composeChimes(piet, fractran, score, 0), chant: composeChant(chant, score, 0), genre, varied,
    });
    c.spine.forEach((chord, s) => {
      const parts = [[pc(c.melody[s])]];
      if (c.bass.steps[s].gate) parts.push([pc(c.bass.steps[s].interval)]);
      if (c.harmony.steps[s].gate) parts.push(c.harmony.steps[s].chord.map(pc));
      if (c.chimes.steps[s].gate) parts.push([pc(12 * Math.log2(c.chimes.steps[s].ratioValue))]);
      if (c.chant.steps[s].gate) parts.push([pc(c.chant.steps[s].interval)]);
      const held = new Set(chord.pitchClasses);
      let hit = false;
      for (let a = 0; a < parts.length; a += 1) for (let b = a + 1; b < parts.length; b += 1) {
        for (const x of parts[a]) for (const y of parts[b]) {
          if (Math.min((x - y + 12) % 12, (y - x + 12) % 12) === 1 && !(held.has(x) && held.has(y))) hit = true;
        }
      }
      steps += 1;
      if (hit) clashing += 1;
    });
  }
  return (100 * clashing) / steps;
}

test("every fettered genre stays under its clash ceiling", () => {
  const phrases = Array.from({ length: 60 }, (_, i) => `clash ceiling ${i}`);
  for (const genre of genreCodes().filter((code) => code !== "raw_chaos")) {
    const rate = clashRate(genre, phrases);
    assert.ok(rate <= CEILINGS[genre], `${genre} clashes on ${rate.toFixed(1)}% of steps (ceiling ${CEILINGS[genre]}%)`);
  }
});

test("varied creatures stay under the clash ceilings too", () => {
  const phrases = Array.from({ length: 60 }, (_, i) => `clash ceiling ${i}`);
  for (const genre of genreCodes().filter((code) => code !== "raw_chaos")) {
    const rate = clashRate(genre, phrases, true);
    assert.ok(rate <= VARIED_CEILINGS[genre], `${genre} varied clashes on ${rate.toFixed(1)}% of steps (ceiling ${VARIED_CEILINGS[genre]}%)`);
  }
});

test("chord members come from the chord's own tones, with honest defaults", () => {
  const alt = buildTriad(1, "dom7alt", "♭II7alt", [1, 5, 8, 11]);
  assert.deepEqual([alt.third, alt.fifth, alt.seventh], [5, 8, 11], "an altered dominant has a major third");
  const dim = buildTriad(6, "dim", "♯iv°", [6, 9, 0, 3]);
  assert.deepEqual([dim.third, dim.fifth, dim.seventh], [9, 0, 3], "a diminished chord has a flat fifth");
  assert.deepEqual([buildTriad(0, "dim").fifth, buildTriad(0, "dom7alt").third, buildTriad(0, "lydian").third], [6, 4, 4]);
  assert.equal(buildTriad(0, "modal_open", "Drone", [0, 7, 2]).third, 2, "an open fifth lends its suspended tone");
});

test("avoid notes resolve, chimes keep to the chord, and walks land on members", () => {
  const cMajor = buildTriad(0, "major");
  assert.equal(avoidNoteResolution(5, cMajor), 4, "the fourth over a major triad falls to the third");
  assert.equal(avoidNoteResolution(2, cMajor), null, "the ninth is no avoid note");
  assert.equal(avoidNoteResolution(8, buildTriad(0, "minor")), 7, "the minor sixth over a minor triad falls to the fifth");
  const table = [["1/1", 1], ["9/8", 9 / 8], ["6/5", 6 / 5], ["5/4", 5 / 4], ["4/3", 4 / 3], ["3/2", 3 / 2], ["5/3", 5 / 3]].map(([ratio, value]) => ({ ratio, value }));
  assert.deepEqual(chordOvertones(table, cMajor).map((o) => o.ratio), ["1/1", "5/4", "3/2"]);
  assert.deepEqual(chordOvertones(table, buildTriad(0, "minor")).map((o) => o.ratio), ["1/1", "6/5", "3/2"]);
  assert.deepEqual(chordOvertones(table, cMajor, [9]).map((o) => o.ratio), ["1/1", "5/4", "3/2", "5/3"], "a genre's colour tone may ring");
  assert.deepEqual(chordOvertones([{ ratio: "9/8", value: 9 / 8 }], cMajor).map((o) => o.ratio), ["1/1"], "nothing fits: the unison");
  const dim = buildTriad(6, "dim", "♯iv°", [6, 9, 0, 3]);
  assert.equal(walkTone(dim, 7), 0, "a walk to the fifth plays the flat fifth");
  assert.equal(walkTone(buildTriad(0, "maj9", "I", [0, 4, 7, 11, 2]), 10), 11, "to the seventh, the chord's own seventh");
  assert.equal(walkTone(cMajor, 2), 2, "passing tones play as written");
});
