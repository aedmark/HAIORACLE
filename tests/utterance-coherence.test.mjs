import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import { buildPerformance, strikeLength } from "../src/accompaniment.mjs";
import { buildGenreSpine, conductEnsemble, installRulebooks } from "../src/conductor.mjs";
import { delayTimeFor } from "../src/ensemble.mjs";
import { compileRulebooks } from "../src/inform.mjs";
import { composeBeat } from "../src/malbolge.mjs";
import { composeBass } from "../src/brainfuck.mjs";
import { composeHarmony } from "../src/befunge.mjs";
import { composeChimes } from "../src/fractran.mjs";
import { composeChant } from "../src/shakespeare.mjs";
import { melodyFor } from "../src/music.mjs";
import { myceliumEvents } from "../src/mycelium.mjs";
import { composeScore } from "../src/score.mjs";
import { effectiveRhythmTemplate, stepUnitSeconds } from "../src/tuning.mjs";

const root = new URL("../", import.meta.url);

const [oracleSrc, rulebooksSrc, beatSrc, bassSrc, harmonySrc, pietSrc, fracSrc, chantSrc] = await Promise.all([
  readFile(new URL("src/oracle.lol", root), "utf8"),
  readFile(new URL("src/rulebooks.ni", root), "utf8"),
  readFile(new URL("src/beat.mal", root), "utf8"),
  readFile(new URL("src/bass.bf", root), "utf8"),
  readFile(new URL("src/harmony.bfg", root), "utf8"),
  readFile(new URL("src/pad.piet", root), "utf8"),
  readFile(new URL("src/chimes.frac", root), "utf8"),
  readFile(new URL("src/chant.spl", root), "utf8"),
]);

installRulebooks(compileRulebooks(rulebooksSrc));

test("P8-15 conductEnsemble generates 16-chord spines and harmonizes 16-step plates without out-of-bounds error", () => {
  const score = composeScore(oracleSrc, "clockwork monarch of the marsh");
  const melody16 = melodyFor(score, 16);
  assert.equal(melody16.length, 16);

  const beat16 = composeBeat(beatSrc, score, 0, 16);
  const bass16 = composeBass(bassSrc, score, 0, 16);
  const harmony16 = composeHarmony(harmonySrc, score, 0, 16);
  const chimes16 = composeChimes(pietSrc, fracSrc, score, 0, 16);
  const chant16 = composeChant(chantSrc, score, 0, 16);

  const conducted = conductEnsemble({
    score,
    melody: melody16,
    beat: beat16,
    bass: bass16,
    harmony: harmony16,
    chimes: chimes16,
    chant: chant16,
    genre: "victorian_tonnetz",
    stepsCount: 16,
  });

  assert.equal(conducted.spine.length, 16, "spine has 16 chords");
  assert.equal(conducted.melody.length, 16, "melody has 16 notes");
  assert.equal(conducted.bass.steps.length, 16, "bass has 16 steps");
  assert.equal(conducted.harmony.steps.length, 16, "harmony has 16 steps");
  assert.equal(conducted.chimes.steps.length, 16, "chimes has 16 steps");
  assert.equal(conducted.chant.steps.length, 16, "chant has 16 steps");

  for (let s = 0; s < 16; s += 1) {
    assert.ok(conducted.spine[s], `spine chord ${s} is defined`);
    assert.ok(conducted.bass.steps[s].label, `bass step ${s} has valid label`);
    assert.ok(conducted.harmony.steps[s].label, `harmony step ${s} has valid label`);
    assert.ok(conducted.chimes.steps[s].label, `chime step ${s} has valid label`);
    assert.ok(conducted.chant.steps[s].label, `chant step ${s} has valid label`);
  }
});

test("P8-15 myceliumEvents scales seamlessly to 16 steps without wrapping prematurely at step 12", () => {
  const score = composeScore(oracleSrc, "botanical expedition into the cellar");

  // 12-step baseline
  const events12 = Array.from({ length: 12 }, (_, s) => myceliumEvents(score, s, 0, 12));
  assert.equal(events12.length, 12);

  // 16-step mode
  const events16 = Array.from({ length: 16 }, (_, s) => myceliumEvents(score, s, 0, 16));
  assert.equal(events16.length, 16);

  // In 16-step mode, downbeat step 0 and step 15 are distinct
  assert.ok(Array.isArray(events16[0]));
  assert.ok(Array.isArray(events16[15]));
});

test("P8-15 Fun Machine progression in 16-step mode builds 16 steps across 4 regions", () => {
  const perf16 = buildPerformance(0, "progression", "victorian_tonnetz", 0, { stepsCount: 16 });
  assert.equal(perf16.steps.length, 16, "performance has 16 steps");
  assert.equal(perf16.regionSteps, 4, "steps per region is 4 in 16-step mode");

  // 4 regions of 4 steps each: region starts at 0, 4, 8, 12
  const regionStarts = perf16.steps.map((step, idx) => (step.isRegionStart ? idx : null)).filter((idx) => idx !== null);
  assert.deepEqual(regionStarts, [0, 4, 8, 12]);

  // Strike length at each region start holds for 4 steps, never truncating early
  assert.equal(strikeLength(perf16, 0), 4, "region 0 holds 4 steps");
  assert.equal(strikeLength(perf16, 4), 4, "region 1 holds 4 steps");
  assert.equal(strikeLength(perf16, 8), 4, "region 2 holds 4 steps");
  assert.equal(strikeLength(perf16, 12), 4, "region 3 holds 4 steps");

  // Clock-synced progression holds the region chord across all 16 steps of the pass
  const clockPerf = buildPerformance(0, "progression", "victorian_tonnetz", 0, { pass: 0, stepsCount: 16 });
  assert.equal(clockPerf.steps.length, 16);
  assert.equal(strikeLength(clockPerf, 0), 16, "clock-synced 16-step pass pad holds full 16-step bar");
  assert.equal(clockPerf.steps[12].chord.name, clockPerf.steps[0].chord.name, "beat 4 chord remains on region chord");
});

test("P8-15 delayTimeFor accounts for step unit duration when barLock44 or 16-step is active", () => {
  const score = composeScore(oracleSrc, "astrolabe in the drawing room");
  const bpm = 120;
  const flatRhythm = [1, 1, 1, 1];

  // 16-step unit duration: 240 / 120 / 16 = 0.125s
  const unit16 = stepUnitSeconds(bpm, flatRhythm, false, 16);
  assert.equal(unit16, 0.125);

  const delaySec16 = delayTimeFor(score, bpm, 0, unit16);
  assert.equal(delaySec16, 0.125, "delay time follows 16th note step unit duration");

  // 12-step unlocked unit duration: 60 / 120 / 2 = 0.25s
  const unit12 = stepUnitSeconds(bpm, flatRhythm, false, 12);
  const delaySec12 = delayTimeFor(score, bpm, 0, unit12);
  assert.equal(delaySec12, 0.25, "delay time follows 8th note unlocked step unit duration");
});

test("effectiveRhythmTemplate guarantees equal quarter-note beats in 16-step and 12-step 4/4 lock metre", () => {
  const bpm = 120;
  for (let idx = 0; idx < 7; idx += 1) {
    // 1. 16-step mode: every template divides 16 evenly and has equal 4-step quarter-note beats
    const r16 = effectiveRhythmTemplate(idx, 16);
    assert.equal(16 % r16.length, 0, `16-step rhythm ${idx} divides 16`);
    const beatSums16 = [0, 4, 8, 12].map((b) => {
      let sum = 0;
      for (let s = 0; s < 4; s += 1) sum += r16[(b + s) % r16.length];
      return sum;
    });
    assert.deepEqual(beatSums16, [4, 4, 4, 4], `16-step rhythm ${idx} produces equal 4.0-unit quarter-note beats`);
    const unit16 = stepUnitSeconds(bpm, r16, false, 16);
    assert.equal(unit16 * 4, 0.5, `quarter note is exactly 0.5s at 120 BPM in 16-step mode`);

    // 2. 12-step 4/4 lock mode: every template divides 12 evenly and has equal 3-step quarter-note beats
    const r12 = effectiveRhythmTemplate(idx, 12, true);
    assert.equal(12 % r12.length, 0, `12-step locked rhythm ${idx} divides 12`);
    const beatSums12 = [0, 3, 6, 9].map((b) => {
      let sum = 0;
      for (let s = 0; s < 3; s += 1) sum += r12[(b + s) % r12.length];
      return sum;
    });
    assert.deepEqual(beatSums12, [3, 3, 3, 3], `12-step locked rhythm ${idx} produces equal 3.0-unit quarter-note beats`);
    const unit12 = stepUnitSeconds(bpm, r12, true, 12);
    assert.ok(Math.abs(unit12 * 3 - 0.5) < 1e-9, `quarter note is approximately 0.5s at 120 BPM in 12-step locked mode`);
  }
});
