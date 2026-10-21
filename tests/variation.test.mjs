import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import { GENRES } from "./install-rulebooks.mjs";
import { HARMONIC_PASSES, buildGenreSpine, buildTriad, genreBook, passSpine } from "../src/conductor.mjs";
import { composeScore } from "../src/score.mjs";
import { VARIATION_MOVES, varySpine } from "../src/variation.mjs";
import { captureVariations, serializeVariations } from "./variation-capture.mjs";

const oracle = await readFile(new URL("../src/oracle.lol", import.meta.url), "utf8");
const fixtureText = await readFile(new URL("./fixtures/variations-golden.json", import.meta.url), "utf8");
const scores = Array.from({ length: 80 }, (_, i) => composeScore(oracle, `variation test ${i}`));
const fettered = GENRES.filter((code) => !genreBook(code).unfettered);
const vary = (genre, score) => varySpine(buildGenreSpine(genre, score), score, genreBook(genre).variation, buildTriad);

test("every genre's permitted moves come from the rulebook and name real moves", () => {
  for (const genre of fettered) {
    const moves = genreBook(genre).variation;
    assert.ok(moves.length >= 3, `${genre} permits at least three moves`);
    for (const move of moves) assert.ok(VARIATION_MOVES.includes(move), `${genre}: ${move}`);
  }
  assert.deepEqual(genreBook("raw_chaos").variation, [], "Raw Chaos stays unfettered");
});

test("creatures no longer share one progression: every fettered genre varies widely", () => {
  const floors = {
    victorian_tonnetz: 50, blues_twelve_bar: 30, smoky_jazz: 50, renaissance_counterpoint: 20, modal_drone: 15, parlor_ragtime: 20,
    doowop_ballad: 15, sacred_harp: 10, andalusian_flamenco: 15, klezmer_freygish: 12, sea_shanty: 15, silent_film_lydian: 30,
    bossa_nova_salon: 50, baroque_chorale: 18, gothic_horror: 8, gospel_shout: 10, tango_habanera: 10, neo_soul: 50,
  };
  for (const genre of fettered) {
    const distinct = new Set(scores.map((score) => vary(genre, score).spine.map((c) => `${c.root}${c.quality}`).join(" ")));
    assert.ok(distinct.size >= floors[genre], `${genre}: ${distinct.size} distinct progressions over 80 creatures`);
  }
});

test("a variation is deterministic, keeps the genre's home unless it rotates, and names its moves", () => {
  for (const genre of fettered) {
    for (const score of scores.slice(0, 20)) {
      const first = vary(genre, score);
      assert.deepEqual(vary(genre, score), first, "same creature, same changes");
      assert.equal(first.spine.length, 12);
      const written = buildGenreSpine(genre, score);
      if (!first.moves.includes("ROTATED")) assert.deepEqual([first.spine[0].root, first.spine[0].quality], [written[0].root, written[0].quality], `${genre} starts at home`);
      // Chords written without a third (the drone's open fifth and Lydian
      // colour) have none to hold; every other chord holds its own.
      for (const chord of first.spine) {
        const hasThird = chord.pitchClasses.some((pc) => [3, 4].includes((pc - chord.root + 12) % 12));
        assert.ok(chord.pitchClasses.includes(chord.root) && (!hasThird || chord.pitchClasses.includes(chord.third)), `${genre} ${chord.op} holds its root and third`);
      }
    }
  }
  const quiet = { harmonyTurn: 0, harmonySwap: 0, harmonyBorrow: 0, harmonyCadence: 0, harmonyPace: 0 };
  for (const genre of fettered) {
    const written = buildGenreSpine(genre, { ...scores[0], ...quiet });
    assert.deepEqual(vary(genre, { ...scores[0], ...quiet }).moves, [], `${genre}: all fields at rest, no moves`);
    assert.equal(varySpine(written, scores[0], [], buildTriad).spine, written, "nothing permitted: as written");
  }
});

test("sample creatures' varied progressions match the frozen fixture", async () => {
  const text = serializeVariations(await captureVariations());
  if (text === fixtureText) return;
  const now = JSON.parse(text).entries;
  const frozen = JSON.parse(fixtureText).entries;
  const changed = Object.keys(frozen).filter((key) => now[key] !== frozen[key]);
  assert.fail(`${changed.length} varied progressions changed (first: ${changed[0]}). If deliberate, run node tools/freeze_variations.mjs --rewrite.`);
});

test("the harmonic clock spreads a spine over four passes, one region each, changing only on four-step boundaries (D-044)", () => {
  assert.equal(HARMONIC_PASSES, 4);
  for (const genre of fettered) {
    const spine = vary(genre, scores[3]).spine;
    const walked = Array.from({ length: HARMONIC_PASSES }, (_, pass) => passSpine(spine, pass)).flat();
    assert.equal(walked.length, 48);
    walked.forEach((chord, step) => assert.equal(chord, spine[Math.floor(step / 4)], `${genre} step ${step}`));
    walked.forEach((chord, step) => {
      if (step % 4 !== 0) assert.equal(chord, walked[step - 1], `${genre}: chords change only on a four-step boundary`);
    });
  }
  assert.deepEqual(passSpine(buildGenreSpine("smoky_jazz", scores[0]), 5), passSpine(buildGenreSpine("smoky_jazz", scores[0]), 1), "passes wrap");
});
