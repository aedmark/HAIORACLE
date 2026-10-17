import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { runLolcode } from "../src/lolcode.mjs";
import { composeScore, hashPhrase, parseScore } from "../src/score.mjs";

const source = await readFile(new URL("../src/oracle.lol", import.meta.url), "utf8");

test("the LOLCODE spell produces every required score field", () => {
  const score = composeScore(source, "the moon owes me five dollars");
  assert.equal(score.steps.length, 12);
  assert.ok(score.name.length > 12);
  assert.ok(score.pulse >= 42 && score.pulse <= 167);
  assert.ok(score.hue >= 0 && score.hue <= 359);
  assert.ok(score.symmetry >= 2 && score.symmetry <= 15);
  assert.ok(score.shape >= 0 && score.shape <= 9);
  assert.ok(score.size >= 36 && score.size <= 100);
  assert.ok(score.scale >= 0 && score.scale <= 7);
  assert.ok(score.eyeShape >= 0 && score.eyeShape <= 7);
  assert.ok(score.irisStyle >= 0 && score.irisStyle <= 7);
  assert.ok(score.pupilShape >= 0 && score.pupilShape <= 7);
  assert.ok(score.irisHue >= 0 && score.irisHue <= 359);
  assert.ok(score.eyeLayout >= 0 && score.eyeLayout <= 5);
});

test("the same normalized phrase summons the same creature", () => {
  const first = composeScore(source, "  A Cucumber With Excellent Boundaries  ");
  const second = composeScore(source, "a cucumber with excellent boundaries");
  assert.deepEqual(first, second);
});

test("different phrases produce different seeds and scores", () => {
  const first = composeScore(source, "Tuesday smells faintly purple");
  const second = composeScore(source, "the wallpaper knows jazz");
  assert.notEqual(first.seed, second.seed);
  assert.notDeepEqual(first.steps, second.steps);
});

test("a phrase batch exercises the expanded name, shape, and scale spaces", () => {
  const scores = Array.from({ length: 256 }, (_, index) => composeScore(source, `omen ${index}`));
  assert.ok(new Set(scores.map((score) => score.name)).size >= 250);
  assert.equal(new Set(scores.map((score) => score.shape)).size, 10);
  assert.equal(new Set(scores.map((score) => score.scale)).size, 8);
  assert.equal(new Set(scores.map((score) => score.eyeShape)).size, 8);
  assert.equal(new Set(scores.map((score) => score.irisStyle)).size, 8);
  assert.equal(new Set(scores.map((score) => score.pupilShape)).size, 8);
  assert.equal(new Set(scores.map((score) => score.eyeLayout)).size, 6);
});

test("empty phrases are rejected at the input boundary", () => {
  assert.throws(() => hashPhrase("   "), /visible character/);
});

test("malformed or out-of-range score output is rejected", () => {
  assert.throws(() => parseScore(["pulse=999"], 1, "bad omen"), /escaped its range|Oracle field/);
  assert.throws(() => parseScore(["surprise=4"], 1, "bad omen"), /Unexpected oracle field/);
});

test("unsupported LOLCODE fails with a useful line number", () => {
  assert.throws(
    () => runLolcode("HAI 1.2\nHOW DUZ I WAT\nKTHXBYE"),
    /LOLCODE line 2: Unsupported statement/,
  );
});
