import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { composeHarmony } from "../src/befunge.mjs";
import { composeBass } from "../src/brainfuck.mjs";
import { conductEnsemble, installRulebooks } from "../src/conductor.mjs";
import { composeChimes } from "../src/fractran.mjs";
import { compileRulebooks } from "../src/inform.mjs";
import { composeBeat } from "../src/malbolge.mjs";
import { DEFAULT_MANUSCRIPT_SOURCE, MAX_MANUSCRIPT_LENGTH, compileManuscript } from "../src/manuscript.mjs";
import { melodyFor } from "../src/music.mjs";
import { composeScore } from "../src/score.mjs";
import { composeChant } from "../src/shakespeare.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (rel) => fs.readFileSync(path.join(ROOT, rel), "utf8");
const CANONICAL_SOURCE = read("src/rulebooks.ni");
const ORACLE_SOURCE = read("src/oracle.lol");
const BEAT_SOURCE = read("src/beat.mal");
const BASS_SOURCE = read("src/bass.bf");
const HARMONY_SOURCE = read("src/harmony.bfg");
const PIET_SOURCE = read("src/pad.piet");
const FRACTRAN_SOURCE = read("src/chimes.frac");
const CHANT_SOURCE = read("src/chant.spl");

test("DEFAULT_MANUSCRIPT_SOURCE compiles cleanly alongside src/rulebooks.ni and conducts the ensemble", () => {
  const canonical = compileRulebooks(CANONICAL_SOURCE);
  const result = compileManuscript(CANONICAL_SOURCE, DEFAULT_MANUSCRIPT_SOURCE);
  assert.equal(result.ok, true);
  assert.equal(result.primaryCode, "celestial_music_box");
  assert.equal(result.primaryTitle, "CELESTIAL MUSIC BOX");
  assert.equal(result.addedGenres.length, 1);
  assert.match(result.diagnostic, /MANUSCRIPT COMPILED · 1 CUSTOM GENRE READY/);

  for (const baseGenre of canonical.genres) {
    assert.deepEqual(result.rulebooks.byCode[baseGenre.code], baseGenre);
  }

  installRulebooks(result.rulebooks);
  try {
    const score = composeScore(ORACLE_SOURCE, "the moon owes me five dollars");
    const conducted = conductEnsemble({
      score,
      melody: melodyFor(score),
      beat: composeBeat(BEAT_SOURCE, score, 0),
      bass: composeBass(BASS_SOURCE, score, 0),
      harmony: composeHarmony(HARMONY_SOURCE, score, 0),
      chimes: composeChimes(PIET_SOURCE, FRACTRAN_SOURCE, score, 0),
      chant: composeChant(CHANT_SOURCE, score, 0),
      genre: result.primaryCode,
    });
    assert.equal(conducted.genre, "celestial_music_box");
    assert.equal(conducted.genreName, "CELESTIAL MUSIC BOX");
    assert.deepEqual(
      conducted.spine.slice(0, 4).map((c) => c.op),
      ["IΔ7 (Chime)", "IΔ7 (Chime)", "IΔ7 (Chime)", "II7 (Lydian)"],
    );
  } finally {
    installRulebooks(canonical);
  }
});

test("compileManuscript reports 1-based manuscript line numbers on Inform 7 syntax or semantic errors", () => {
  const broken = [
    "[Line 1 comment]",
    "Part 6 - Broken",
    "",
    "Instead of waiting: say \"Out of subset.\"",
  ].join("\n");

  const result = compileManuscript(CANONICAL_SOURCE, broken);
  assert.equal(result.ok, false);
  assert.equal(result.line, 4);
  assert.match(result.diagnostic, /^MANUSCRIPT LINE 4:/);
});

test("compileManuscript refuses empty, oversized, no-op, or canonical-mutating manuscripts", () => {
  const emptyRes = compileManuscript(CANONICAL_SOURCE, "   ");
  assert.equal(emptyRes.ok, false);
  assert.match(emptyRes.diagnostic, /Manuscript is empty/);

  const hugeRes = compileManuscript(CANONICAL_SOURCE, "x".repeat(MAX_MANUSCRIPT_LENGTH + 1));
  assert.equal(hugeRes.ok, false);
  assert.match(hugeRes.diagnostic, /Manuscript exceeds/);

  const noGenreRes = compileManuscript(CANONICAL_SOURCE, "[Only a comment, no genre]");
  assert.equal(noGenreRes.ok, false);
  assert.match(noGenreRes.diagnostic, /declared no new genre/);

  const redeclareTitle = `The title of Delta Blues is "HIJACKED BLUES".`;
  const redeclareRes = compileManuscript(CANONICAL_SOURCE, redeclareTitle);
  assert.equal(redeclareRes.ok, false);
  assert.match(redeclareRes.diagnostic, /^MANUSCRIPT LINE 1: the title of Delta Blues is already set/);

  const mutatingRule = `Table of Hijack\nregion\tdegree\tquality\tlabel\ttones\n\nTable of Hijack (continued)\n1\t0\tdim\t"i°"\t{0, 3, 6}`;
  const mutateRes = compileManuscript(CANONICAL_SOURCE, mutatingRule);
  assert.equal(mutateRes.ok, false);
});

test("index.html and src/app.mjs wire the Kapellmeister's Manuscript sandbox drawer", () => {
  const html = read("index.html");
  const app = read("src/app.mjs");

  assert.match(html, /id="kapellmeister-manuscript-toggle"/);
  assert.match(html, /id="kapellmeister-manuscript"/);
  assert.match(html, /id="manuscript-source"/);
  assert.match(html, /id="manuscript-compile-btn"/);
  assert.match(html, /id="manuscript-reset-btn"/);
  assert.match(html, /id="manuscript-restore-btn"/);
  assert.match(html, /id="manuscript-diagnostic"/);
  assert.match(app, /compileManuscript\(canonicalRulebooksSource,\s*source\)/);
});
