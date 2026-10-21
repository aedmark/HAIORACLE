import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import "./install-rulebooks.mjs";
import { composeHarmony } from "../src/befunge.mjs";
import { composeBass } from "../src/brainfuck.mjs";
import { CREATURE_GENRE, compiledRulebooks, conductEnsemble, genreBook, installCreatureBook } from "../src/conductor.mjs";
import { buildCreatureBook, chordOnRoot, scalePitchClasses } from "../src/creature-rulebook.mjs";
import { composeChimes } from "../src/fractran.mjs";
import { compileRulebooks } from "../src/inform.mjs";
import { composeBeat } from "../src/malbolge.mjs";
import { melodyFor } from "../src/music.mjs";
import { composeScore } from "../src/score.mjs";
import { composeChant } from "../src/shakespeare.mjs";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");
const [oracle, rulebookSource, beat, bass, harmony, piet, fractran, chant] = await Promise.all(
  ["src/oracle.lol", "src/rulebooks.ni", "src/beat.mal", "src/bass.bf", "src/harmony.bfg", "src/pad.piet", "src/chimes.frac", "src/chant.spl"].map(read),
);
const scores = Array.from({ length: 200 }, (_, i) => composeScore(oracle, `creature rulebook ${i}`));
const books = compiledRulebooks();

test("the grammar for THE CREATURE'S OWN is written in Inform 7 and validated", () => {
  const { creature } = books;
  assert.deepEqual(Object.keys(creature.functions).map(Number), [1, 2, 3]);
  assert.deepEqual(creature.functions[1].name, "tonic");
  assert.ok(creature.paths.length >= 8 && creature.paths.every((path) => path.length === 4 && path[0] === 1));
  assert.equal(creature.shapes[0].quality, "major");
  const withoutPaths = rulebookSource.replace(/Table of Harmonic Paths[\s\S]*?(?=\n\[Shapes)/, "");
  assert.throws(() => compileRulebooks(withoutPaths), /Harmonic Functions, Harmonic Paths, and Chord Shapes together/);
  const strayPath = rulebookSource.replace("1\t{1, 2, 3, 3}", "1\t{2, 2, 3, 3}");
  assert.throws(() => compileRulebooks(strayPath), /must start at home/);
});

test("every creature writes its own changes, from home, with every chord tone in its scale", () => {
  const distinct = new Set();
  for (const score of scores) {
    const book = buildCreatureBook(score, books);
    assert.deepEqual(buildCreatureBook(score, books), book, "deterministic");
    const regions = book.spine.steps.filter((_, step) => step % 3 === 0);
    const scale = scalePitchClasses(score);
    assert.equal(regions[0].degree, 0, "home first");
    for (const region of regions) {
      for (const tone of region.tones) assert.ok(scale.includes((region.degree + tone) % 12), `${book.motto}: ${region.label} stays in the scale`);
      assert.notEqual(region.quality, "dim", "a chord with a third, or an open one, before a diminished");
    }
    const character = books.genres.find((genre) => genre.code === book.character);
    assert.ok(character && !character.unfettered);
    assert.deepEqual([book.bass, book.overtones, book.variation, book.insistent], [character.bass, character.overtones, character.variation, character.insistent], "the borrowed character");
    // Organ and melody keep to the members the creature's triads have.
    if (book.organ.method === "voiced") assert.ok(book.organ.members.every((member) => ["root", "third", "fifth", "octave"].includes(member)));
    assert.notEqual(book.melody.method, "scale", "no blue notes over the creature's own chords");
    if (book.melody.method === "members") assert.deepEqual(book.melody.extensions, []);
    distinct.add(regions.map((region) => `${region.degree}${region.quality}`).join(" "));
  }
  assert.ok(distinct.size >= 80, `${distinct.size} distinct progressions over 200 creatures`);
});

test("a Phrygian creature leans home on ♭II, the shape order prefers chords with thirds", () => {
  const phrygian = [0, 1, 3, 5, 7, 8, 10];
  assert.equal(chordOnRoot(7, phrygian, books.creature.shapes, true), null, "no major or minor on v in Phrygian");
  assert.equal(chordOnRoot(1, phrygian, books.creature.shapes, true).quality, "major", "♭II is major");
  assert.equal(chordOnRoot(0, [0, 2, 4, 6, 8, 10], books.creature.shapes).quality, "dom7", "the whole-tone scale finds a dominant shell");
});

test("the conductor plays a creature's own rulebook, and it agrees with itself", () => {
  let steps = 0;
  let clashing = 0;
  for (const score of scores.slice(0, 60)) {
    installCreatureBook(buildCreatureBook(score, books));
    assert.equal(genreBook(CREATURE_GENRE).title, "THE CREATURE'S OWN RULEBOOK");
    const c = conductEnsemble({
      score, melody: melodyFor(score), beat: composeBeat(beat, score, 0), bass: composeBass(bass, score, 0),
      harmony: composeHarmony(harmony, score, 0), chimes: composeChimes(piet, fractran, score, 0), chant: composeChant(chant, score, 0),
      genre: CREATURE_GENRE, varied: true, harmonicPass: 0,
    });
    assert.equal(c.genre, CREATURE_GENRE);
    c.spine.forEach((chord, s) => {
      const pc = (value) => ((Math.round(value) % 12) + 12) % 12;
      const parts = [[pc(c.melody[s])]];
      if (c.harmony.steps[s].gate) parts.push(c.harmony.steps[s].chord.map(pc));
      if (c.chimes.steps[s].gate) parts.push([pc(12 * Math.log2(c.chimes.steps[s].ratioValue))]);
      const held = new Set(chord.pitchClasses);
      let hit = false;
      for (let a = 0; a < parts.length; a += 1) for (let b = a + 1; b < parts.length; b += 1) {
        for (const x of parts[a]) for (const y of parts[b]) if (Math.min((x - y + 12) % 12, (y - x + 12) % 12) === 1 && !(held.has(x) && held.has(y))) hit = true;
      }
      steps += 1;
      if (hit) clashing += 1;
    });
  }
  installCreatureBook(null);
  assert.ok((100 * clashing) / steps <= 6, `creature rulebooks clash on ${((100 * clashing) / steps).toFixed(1)}% of steps`);
});
