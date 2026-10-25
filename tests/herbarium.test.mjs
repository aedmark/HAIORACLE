import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import {
  HERBARIUM_STORAGE_KEY,
  HerbariumError,
  MAX_HERBARIUM_SPECIMENS,
  compareSpecimens,
  emptyHerbariumStore,
  isSpecimenPinned,
  parseHerbariumStore,
  pinSpecimen,
  readHerbariumStoreFrom,
  serializeHerbariumStore,
  specimenFromScore,
  specimenMiniatureData,
  unpinSpecimen,
  validateSpecimen,
  writeHerbariumStoreTo,
} from "../src/herbarium.mjs";
import { composeScore } from "../src/score.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const ORACLE_SOURCE = fs.readFileSync(path.join(ROOT, "src", "oracle.lol"), "utf8");
const SCORE_A = composeScore(ORACLE_SOURCE, "the moon owes me five dollars");
const SCORE_B = composeScore(ORACLE_SOURCE, "a polite ghost inquiring about tea");

test("specimenFromScore extracts and validates a frozen specimen record from a score", () => {
  const spec = specimenFromScore(SCORE_A, "2026-10-25T12:00:00.000Z");
  assert.equal(spec.phrase, SCORE_A.phrase);
  assert.equal(spec.seed, SCORE_A.seed);
  assert.equal(spec.name, SCORE_A.name);
  assert.equal(spec.folioId, SCORE_A.folioId);
  assert.equal(spec.curiosaClass, SCORE_A.curiosaClass);
  assert.equal(spec.bellJar, SCORE_A.bellJar);
  assert.equal(spec.shape, SCORE_A.shape);
  assert.equal(spec.shapeName, SCORE_A.shapeName);
  assert.equal(spec.pinnedAt, "2026-10-25T12:00:00.000Z");
  assert.ok(Object.isFrozen(spec));
});

test("validateSpecimen rejects unknown fields, prototype pollution, and out-of-range values", () => {
  const base = { ...specimenFromScore(SCORE_A, "2026-10-25T12:00:00.000Z") };

  assert.throws(
    () => validateSpecimen({ ...base, extraField: 123 }),
    (err) => err instanceof HerbariumError && /extraField/.test(err.path),
  );
  assert.throws(
    () => validateSpecimen({ ...base, pulse: 999 }),
    (err) => err instanceof HerbariumError && /pulse/.test(err.path),
  );
  assert.throws(
    () => validateSpecimen({ ...base, phrase: "   " }),
    (err) => err instanceof HerbariumError && /phrase/.test(err.path),
  );
  assert.throws(
    () => validateSpecimen({ ...base, wave: 9 }),
    (err) => err instanceof HerbariumError && /wave/.test(err.path),
  );
});

test("pinSpecimen, unpinSpecimen, and isSpecimenPinned manage up to MAX_HERBARIUM_SPECIMENS newest-first", () => {
  let store = emptyHerbariumStore();
  assert.equal(isSpecimenPinned(store, SCORE_A), false);

  store = pinSpecimen(store, SCORE_A, "2026-10-25T12:00:00.000Z");
  assert.equal(store.specimens.length, 1);
  assert.equal(isSpecimenPinned(store, SCORE_A), true);
  assert.equal(isSpecimenPinned(store, SCORE_B), false);

  store = pinSpecimen(store, SCORE_B, "2026-10-25T12:05:00.000Z");
  assert.equal(store.specimens.length, 2);
  assert.equal(store.specimens[0].seed, SCORE_B.seed);

  // Re-pinning moves SCORE_A back to index 0 without duplicating
  store = pinSpecimen(store, SCORE_A, "2026-10-25T12:10:00.000Z");
  assert.equal(store.specimens.length, 2);
  assert.equal(store.specimens[0].seed, SCORE_A.seed);

  store = unpinSpecimen(store, SCORE_A.seed);
  assert.equal(store.specimens.length, 1);
  assert.equal(isSpecimenPinned(store, SCORE_A), false);
  assert.equal(isSpecimenPinned(store, SCORE_B), true);
});

test("parseHerbariumStore recovers valid specimens while dropping corrupt entries", () => {
  const validA = specimenFromScore(SCORE_A, "2026-10-25T12:00:00.000Z");
  const validB = specimenFromScore(SCORE_B, "2026-10-25T12:05:00.000Z");
  const corrupt = { ...validA, pulse: -99 };

  const text = JSON.stringify({
    version: 1,
    specimens: [validA, corrupt, validB, validA],
  });
  const parsed = parseHerbariumStore(text);
  assert.equal(parsed.specimens.length, 2);
  assert.equal(parsed.specimens[0].seed, SCORE_A.seed);
  assert.equal(parsed.specimens[1].seed, SCORE_B.seed);

  assert.deepEqual(parseHerbariumStore("not-json").specimens, []);
  assert.deepEqual(parseHerbariumStore(JSON.stringify({ version: 99, specimens: [] })).specimens, []);
});

test("writeHerbariumStoreTo evicts oldest specimens on QuotaExceededError and falls back gracefully", () => {
  let store = emptyHerbariumStore();
  store = pinSpecimen(store, SCORE_A, "2026-10-25T12:00:00.000Z");
  store = pinSpecimen(store, SCORE_B, "2026-10-25T12:05:00.000Z");

  const oneSpecimenBytes = serializeHerbariumStore({
    version: 1,
    specimens: [store.specimens[0]],
  }).length;

  let storedValue = null;
  const mockStorage = {
    getItem(k) {
      return k === HERBARIUM_STORAGE_KEY ? storedValue : null;
    },
    setItem(k, v) {
      if (v.length > oneSpecimenBytes + 8) {
        const err = new Error("QuotaExceededError: storage full");
        err.name = "QuotaExceededError";
        throw err;
      }
      storedValue = v;
    },
    removeItem() {
      storedValue = null;
    },
  };

  assert.equal(writeHerbariumStoreTo(mockStorage, store), true);
  const recovered = readHerbariumStoreFrom(mockStorage);
  assert.equal(recovered.specimens.length, 1);
  assert.equal(recovered.specimens[0].seed, SCORE_B.seed);

  const zeroQuotaStorage = {
    setItem() {
      const err = new Error("QuotaExceededError");
      err.name = "QuotaExceededError";
      throw err;
    },
  };
  assert.equal(writeHerbariumStoreTo(zeroQuotaStorage, store), false);
});

test("specimenMiniatureData and compareSpecimens return deterministic portrait geometry and trait diffs", () => {
  const specA = specimenFromScore(SCORE_A, "2026-10-25T12:00:00.000Z");
  const specB = specimenFromScore(SCORE_B, "2026-10-25T12:05:00.000Z");

  const mini1 = specimenMiniatureData(specA, 56);
  const mini2 = specimenMiniatureData(specA, 56);
  assert.equal(mini1.points, mini2.points);
  assert.equal(mini1.points.split(" ").length, 48);
  assert.match(mini1.palette.coreColor, /^hsl\(/);

  const selfReport = compareSpecimens(specA, specA);
  assert.equal(selfReport.sharedCount, 8);
  assert.equal(selfReport.summary, "8 OF 8 TRAITS SHARED");

  const crossReport = compareSpecimens(specA, specB);
  assert.equal(crossReport.rows.length, 8);
  assert.equal(crossReport.rows[0].match, false);
  assert.equal(crossReport.rows[0].delta, "DIVERGENT");
});

test("index.html and src/app.mjs wire the Naturalist's Herbarium curio drawer", () => {
  const html = fs.readFileSync(path.join(ROOT, "index.html"), "utf8");
  const app = fs.readFileSync(path.join(ROOT, "src", "app.mjs"), "utf8");

  assert.match(html, /id="herbarium-engine"/);
  assert.match(html, /id="herbarium-pin-btn"/);
  assert.match(html, /id="herbarium-cards"/);
  assert.match(html, /id="herbarium-compare-left"/);
  assert.match(html, /id="herbarium-compare-right"/);
  assert.match(html, /id="herbarium-compare-btn"/);
  assert.match(html, /id="herbarium-comparison"/);
  assert.match(app, /function renderHerbarium\(/);
  assert.match(app, /function renderHerbariumComparison\(/);
});
