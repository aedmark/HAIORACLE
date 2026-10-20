import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import { GENRES } from "./install-rulebooks.mjs";
import { CAPTURE_VERSION, captureRulebooks, serializeCapture } from "./rulebook-capture.mjs";

const fixtureText = await readFile(new URL("./fixtures/rulebooks-golden.json", import.meta.url), "utf8");
const golden = JSON.parse(fixtureText);

test("the golden fixture covers every genre in every rulebook decision", () => {
  assert.equal(golden.version, CAPTURE_VERSION);
  const genres = GENRES;
  assert.deepEqual(golden.genres.map((genre) => genre.id), genres);
  for (const section of ["colours", "progressions", "spines", "projection"]) {
    const covered = new Set(Object.keys(golden[section]).map((key) => key.split("|")[0]));
    assert.deepEqual([...covered].sort(), [...genres].sort(), `${section} covers every genre`);
  }
  const ensembleGenres = new Set(Object.keys(golden.ensembles).map((key) => key.split("|")[1]));
  assert.deepEqual([...ensembleGenres].sort(), [...genres].sort());
});

// The P5-23 migration contract (D-033): whatever implements the rulebooks,
// the conductor's decisions must match the pre-migration capture exactly.
test("the Kapellmeister rulebooks reproduce the golden fixture exactly", async () => {
  const capture = await captureRulebooks();
  const text = serializeCapture(capture);
  if (text === fixtureText) return;
  const actualLines = text.split("\n");
  const goldenLines = fixtureText.split("\n");
  const differing = [];
  for (let i = 0; i < Math.max(actualLines.length, goldenLines.length) && differing.length < 5; i += 1) {
    if (actualLines[i] !== goldenLines[i]) differing.push(`line ${i + 1}\n  golden: ${goldenLines[i]?.slice(0, 240)}\n  actual: ${actualLines[i]?.slice(0, 240)}`);
  }
  assert.fail(`rulebook behaviour drifted from tests/fixtures/rulebooks-golden.json:\n${differing.join("\n")}`);
});
