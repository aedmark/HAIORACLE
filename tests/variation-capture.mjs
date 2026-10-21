// Captures how creatures vary their genres' changes (D-043, P5-30 phase 2):
// for a fixed phrase sample, each fettered genre's varied spine (root,
// quality, label per step) and the moves named. Shared by
// tools/freeze_variations.mjs and tests/variation.test.mjs, so an unintended
// change to any creature's progression fails a test.

import { readFile } from "node:fs/promises";

import { buildGenreSpine, buildTriad, genreBook } from "../src/conductor.mjs";
import { composeScore } from "../src/score.mjs";
import { varySpine } from "../src/variation.mjs";
import { GENRES } from "./install-rulebooks.mjs";

export const VARIATION_PHRASES = Object.freeze(Array.from({ length: 24 }, (_, i) => `variation fixture ${i}`));

export async function captureVariations() {
  const oracle = await readFile(new URL("../src/oracle.lol", import.meta.url), "utf8");
  const scores = VARIATION_PHRASES.map((phrase) => composeScore(oracle, phrase));
  const entries = {};
  for (const genre of GENRES.filter((code) => !genreBook(code).unfettered)) {
    scores.forEach((score, index) => {
      const { spine, moves } = varySpine(buildGenreSpine(genre, score), score, genreBook(genre).variation, buildTriad);
      entries[`${genre}|${index}`] = `${spine.map((c) => `${c.root}:${c.quality}:${c.op}`).join(" ")} || ${moves.join(", ")}`;
    });
  }
  return { version: 1, phrases: VARIATION_PHRASES, entries };
}

export const serializeVariations = (capture) => `${JSON.stringify(capture, null, 1)}\n`;
