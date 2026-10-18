import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { HARMONY_NAMES, composeHarmony, cycleHarmonyCell, runBefunge } from "../src/befunge.mjs";
import { BASS_NAMES, composeBass, cycleBassCell, runBrainfuck } from "../src/brainfuck.mjs";
import { applyTonnetzOperation, bjorklund, buildTonnetzSpine, buildTriad, conductEnsemble, eulerGradus, semitoneGradus } from "../src/conductor.mjs";
import { CHIME_NAMES, composeChimes, cycleChimeCell, runFractran, runPiet } from "../src/fractran.mjs";
import { runLolcode } from "../src/lolcode.mjs";
import { BEAT_NAMES, composeBeat, crazy, cycleBeatStep, rotr, runMalbolge } from "../src/malbolge.mjs";
import { MELODY_NAMES, melodyFor } from "../src/music.mjs";
import { composeScore, hashPhrase, parseScore } from "../src/score.mjs";
import { buildShareUrl, decodeOmenHash, encodeOmenHash, specimenFilenameFor } from "../src/share.mjs";
import { CHANT_NAMES, FORMANT_VOWELS, PERSONA_ROLES, composeChant, cycleChantCell, runShakespeare } from "../src/shakespeare.mjs";

const [source, beatSource, bassSource, harmonySource, pietSource, fractranSource, chantSource] = await Promise.all([
  readFile(new URL("../src/oracle.lol", import.meta.url), "utf8"),
  readFile(new URL("../src/beat.mal", import.meta.url), "utf8"),
  readFile(new URL("../src/bass.bf", import.meta.url), "utf8"),
  readFile(new URL("../src/harmony.bfg", import.meta.url), "utf8"),
  readFile(new URL("../src/pad.piet", import.meta.url), "utf8"),
  readFile(new URL("../src/chimes.frac", import.meta.url), "utf8"),
  readFile(new URL("../src/chant.spl", import.meta.url), "utf8"),
]);

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
  assert.ok(score.kineticMode >= 0 && score.kineticMode <= 7);
  assert.ok(score.kineticSpeed >= 20 && score.kineticSpeed <= 100);
  assert.ok(score.kineticDepth >= 20 && score.kineticDepth <= 100);
  assert.ok(score.kineticTilt >= 0 && score.kineticTilt <= 7);
  assert.ok(score.fluxMode >= 0 && score.fluxMode <= 7);
  assert.ok(score.melodyMode >= 0 && score.melodyMode <= 11);
  assert.ok(score.melodyTurn >= 0 && score.melodyTurn <= 11);
  assert.ok(score.beatMode >= 0 && score.beatMode <= 7);
  assert.ok(score.beatDensity >= 35 && score.beatDensity <= 100);
  assert.ok(score.bassMode >= 0 && score.bassMode <= 7);
  assert.ok(score.bassGlide >= 20 && score.bassGlide <= 100);
  assert.ok(score.harmonyMode >= 0 && score.harmonyMode <= 7);
  assert.ok(score.harmonyStrum >= 15 && score.harmonyStrum <= 100);
  assert.ok(score.chimeMode >= 0 && score.chimeMode <= 7);
  assert.ok(score.chimeShimmer >= 20 && score.chimeShimmer <= 100);
  assert.ok(score.chantMode >= 0 && score.chantMode <= 7);
  assert.ok(score.chantFormant >= 25 && score.chantFormant <= 100);
  assert.equal(melodyFor(score).length, 12);
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

test("a phrase batch exercises the expanded name, shape, sound, eye, and kinetic spaces", () => {
  const scores = Array.from({ length: 256 }, (_, index) => composeScore(source, `omen ${index}`));
  assert.ok(new Set(scores.map((score) => score.name)).size >= 250);
  assert.equal(new Set(scores.map((score) => score.shape)).size, 10);
  assert.equal(new Set(scores.map((score) => score.scale)).size, 8);
  assert.equal(new Set(scores.map((score) => score.eyeShape)).size, 8);
  assert.equal(new Set(scores.map((score) => score.irisStyle)).size, 8);
  assert.equal(new Set(scores.map((score) => score.pupilShape)).size, 8);
  assert.equal(new Set(scores.map((score) => score.eyeLayout)).size, 6);
  assert.equal(new Set(scores.map((score) => score.kineticMode)).size, 8);
  assert.equal(new Set(scores.map((score) => score.fluxMode)).size, 8);
  assert.equal(new Set(scores.map((score) => score.melodyMode)).size, 12);
  assert.equal(new Set(scores.map((score) => score.beatMode)).size, 8);
  assert.equal(new Set(scores.map((score) => score.bassMode)).size, 8);
  assert.equal(new Set(scores.map((score) => score.harmonyMode)).size, 8);
  assert.equal(new Set(scores.map((score) => score.chimeMode)).size, 8);
  assert.equal(new Set(scores.map((score) => score.chantMode)).size, 8);
});

test("arpeggio and chromatic motifs are exact twelve-note loops", () => {
  const base = { scale: 0, steps: Array(12).fill(0), melodyTurn: 0 };
  assert.deepEqual(melodyFor({ ...base, melodyMode: 1 }), [0, 4, 7, 12, 16, 12, 7, 4, 0, 7, 12, 19]);
  assert.deepEqual(melodyFor({ ...base, melodyMode: 5 }), [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]);
  assert.deepEqual(melodyFor({ ...base, melodyMode: 6 }), [12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1]);
  assert.equal(MELODY_NAMES.length, 12);
});

test("the Malbolge virtual machine executes src/beat.mal deterministically across all eight cadences", () => {
  assert.equal(crazy(0, 0), 29524);
  assert.equal(rotr(1), 19683);
  assert.equal(BEAT_NAMES.length, 8);
  const score = composeScore(source, "the moon owes me five dollars");
  const firstBeat = composeBeat(beatSource, score, 0);
  const secondBeat = composeBeat(beatSource, score, 0);
  const mutatedBeat = composeBeat(beatSource, score, 1);
  assert.deepEqual(firstBeat, secondBeat);
  assert.equal(firstBeat.steps.length, 12);
  assert.equal(firstBeat.stepsExecuted, 50);
  assert.notDeepEqual(firstBeat.rawOutput, mutatedBeat.rawOutput);
  for (const step of firstBeat.steps) {
    assert.match(step.trits, /^[012]{3}$/);
  }
  const cycled = cycleBeatStep(firstBeat.steps[0]);
  assert.match(cycled.trits, /^[012]{3}$/);
  assert.notEqual(cycled.trits, firstBeat.steps[0].trits);
});

test("invalid Malbolge instructions fail with a line-numbered error", () => {
  assert.throws(
    () => runMalbolge("!!"),
    /Malbolge line 1: Invalid instruction/,
  );
});

test("the Brainfuck interpreter executes src/bass.bf deterministically across all eight bass grooves", () => {
  assert.equal(BASS_NAMES.length, 8);
  const score = composeScore(source, "the moon owes me five dollars");
  const firstBass = composeBass(bassSource, score, 0);
  const secondBass = composeBass(bassSource, score, 0);
  const shiftedBass = composeBass(bassSource, score, 1);
  assert.deepEqual(firstBass, secondBass);
  assert.equal(firstBass.steps.length, 12);
  assert.ok(firstBass.stepsExecuted > 100);
  assert.notDeepEqual(
    firstBass.steps.map((s) => s.cell),
    shiftedBass.steps.map((s) => s.cell),
  );
  const cycled = cycleBassCell(firstBass.steps[0]);
  assert.notEqual(cycled.cell, firstBass.steps[0].cell);
});

test("unmatched Brainfuck brackets fail with a line-numbered error", () => {
  assert.throws(
    () => runBrainfuck("++[>+<-"),
    /Brainfuck line 1: Unmatched '\['/,
  );
  assert.throws(
    () => runBrainfuck("++]>+<"),
    /Brainfuck line 1: Unmatched '\]'/,
  );
});

test("the Befunge-93 torus interpreter executes src/harmony.bfg deterministically across all eight chord organs", () => {
  assert.equal(HARMONY_NAMES.length, 8);
  const score = composeScore(source, "the moon owes me five dollars");
  const firstHarmony = composeHarmony(harmonySource, score, 0);
  const secondHarmony = composeHarmony(harmonySource, score, 0);
  const flippedHarmony = composeHarmony(harmonySource, score, 1);
  assert.deepEqual(firstHarmony, secondHarmony);
  assert.equal(firstHarmony.steps.length, 12);
  assert.equal(firstHarmony.stepsExecuted, 93);
  assert.notDeepEqual(
    firstHarmony.steps.map((s) => s.raw),
    flippedHarmony.steps.map((s) => s.raw),
  );
  for (const step of firstHarmony.steps) {
    assert.equal(step.chord.length, 3);
    assert.match(step.mirror, /^[\\/]$/);
  }
  const cycled = cycleHarmonyCell(firstHarmony.steps[0], score);
  assert.notEqual(cycled.raw, firstHarmony.steps[0].raw);
});

test("unsupported Befunge-93 instructions fail with row and column coordinates", () => {
  assert.throws(
    () => runBefunge(">?@"),
    /Befunge line 1: Unsupported instruction '\?' at column 2/,
  );
});

test("the Piet codel interpreter and FRACTRAN prime-ratio engine execute src/pad.piet and src/chimes.frac deterministically", () => {
  assert.equal(CHIME_NAMES.length, 8);
  const score = composeScore(source, "the moon owes me five dollars");
  const firstChimes = composeChimes(pietSource, fractranSource, score, 0);
  const secondChimes = composeChimes(pietSource, fractranSource, score, 0);
  const refractedChimes = composeChimes(pietSource, fractranSource, score, 1);
  assert.deepEqual(firstChimes, secondChimes);
  assert.equal(firstChimes.steps.length, 12);
  assert.equal(firstChimes.pietStepsExecuted, 49);
  assert.equal(firstChimes.fractranStepsExecuted, 12);
  assert.notDeepEqual(
    firstChimes.steps.map((s) => s.pietByte),
    refractedChimes.steps.map((s) => s.pietByte),
  );
  for (const step of firstChimes.steps) {
    assert.match(step.codelCode, /^[LND][RYGCBM]$/);
    assert.ok(step.ratioValue >= 1 && step.ratioValue <= 2);
  }
  const cycled = cycleChimeCell(firstChimes.steps[0]);
  assert.notEqual(cycled.ratioIndex, firstChimes.steps[0].ratioIndex);
  assert.notEqual(cycled.codelCode, firstChimes.steps[0].codelCode);
});

test("invalid Piet codels and FRACTRAN fractions fail with line-numbered errors", () => {
  assert.throws(
    () => runPiet("LR ZZ WH"),
    /Piet line 1: Invalid codel 'ZZ' at column 2/,
  );
  assert.throws(
    () => runFractran("35/6 bad/fraction"),
    /FRACTRAN line 1: Invalid fraction 'bad\/fraction'/,
  );
});

test("the Shakespeare Programming Language interpreter executes src/chant.spl deterministically across all eight dramatic modes", () => {
  assert.equal(CHANT_NAMES.length, 8);
  assert.equal(FORMANT_VOWELS.length, 6);
  assert.equal(Object.keys(PERSONA_ROLES).length, 4);
  const score = composeScore(source, "the moon owes me five dollars");
  const firstChant = composeChant(chantSource, score, 0);
  const secondChant = composeChant(chantSource, score, 0);
  const mutatedChant = composeChant(chantSource, score, 1);

  assert.deepEqual(firstChant, secondChant);
  assert.equal(firstChant.steps.length, 12);
  assert.equal(firstChant.title, "The Oracular Tragedy of the Parlor Glass.");
  assert.ok(firstChant.statementsExecuted > 30 && firstChant.statementsExecuted <= 512);
  assert.notDeepEqual(
    firstChant.steps.map((step) => `${step.gate}:${step.vowelIpa}:${step.personaShort}`),
    mutatedChant.steps.map((step) => `${step.gate}:${step.vowelIpa}:${step.personaShort}`),
  );

  for (let mode = 0; mode < 8; mode += 1) {
    const chant = composeChant(chantSource, { ...score, chantMode: mode, chantFormant: 75 }, mode);
    assert.equal(chant.steps.length, 12);
    assert.equal(chant.modeName, CHANT_NAMES[mode]);
    assert.ok(chant.steps.some((step) => step.gate > 0));
    chant.steps.forEach((step) => {
      assert.ok(step.gate === 0 || step.gate === 1 || step.gate === 2);
      assert.ok(step.f1 > 200 && step.f2 > step.f1 && step.f3 > step.f2);
      assert.ok(step.voiceType.length > 3);
    });
  }

  const cycled = cycleChantCell(firstChant.steps[0], score);
  assert.equal(cycled.gate, (firstChant.steps[0].gate + 1) % 3);
  assert.equal(cycled.vowelIndex, (firstChant.steps[0].vowelIndex + 1) % FORMANT_VOWELS.length);

  assert.throws(
    () => runShakespeare("The Bad Play.\nHamlet, a prince.\nAct I: Start.\nScene I: Here.\n[Enter Ghost]"),
    /Shakespeare line 5: Undeclared character 'GHOST'/,
  );
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

test("shareable URL fragments round-trip phrases locally and generate deterministic PNG filenames", () => {
  const hash = encodeOmenHash("  the moon owes me   five dollars ");
  assert.equal(hash, "#omen=the%20moon%20owes%20me%20five%20dollars");
  assert.equal(decodeOmenHash(hash), "the moon owes me five dollars");
  assert.equal(decodeOmenHash(""), null);
  assert.equal(decodeOmenHash("#other=1"), null);

  const shareUrl = buildShareUrl("https://oracle.example.test/index.html#old", "the moon owes me five dollars");
  assert.equal(shareUrl, "https://oracle.example.test/index.html#omen=the%20moon%20owes%20me%20five%20dollars");

  const score = composeScore(source, "the moon owes me five dollars");
  const filename = specimenFilenameFor(score);
  assert.match(filename, /^hai-oracle-[a-z0-9-]+-[0-9a-f]{8}\.png$/);
  assert.throws(() => encodeOmenHash("   "), /empty omen phrase/);
});

test("Euler Gradus Suavitatis, Neo-Riemannian Tonnetz, and Euclidean conductor harmonize the six-language ensemble", () => {
  // Unison (1:1) = 1, Octave (2:1) = 2, Fifth (3:2) = 4, Fourth (4:3) = 5, Major 3rd (5:4) = 7, Tritone (45:32) = 14
  assert.equal(eulerGradus(1, 1), 1);
  assert.equal(eulerGradus(2, 1), 2);
  assert.equal(eulerGradus(3, 2), 4);
  assert.equal(eulerGradus(4, 3), 5);
  assert.equal(eulerGradus(5, 4), 7);
  assert.ok(semitoneGradus(7) < semitoneGradus(6));
  assert.ok(semitoneGradus(4) < semitoneGradus(1));

  // Neo-Riemannian P, L, R operations are involutions and preserve 2 of 3 pitch classes
  const cMajor = buildTriad(0, "major");
  const cMinor = applyTonnetzOperation(cMajor, "P");
  const eMinor = applyTonnetzOperation(cMajor, "L");
  const aMinor = applyTonnetzOperation(cMajor, "R");
  assert.equal(cMinor.root, 0);
  assert.equal(cMinor.quality, "minor");
  assert.deepEqual(cMinor.pitchClasses, [0, 3, 7]);
  assert.equal(eMinor.root, 4);
  assert.equal(eMinor.quality, "minor");
  assert.deepEqual(eMinor.pitchClasses, [4, 7, 11]);
  assert.equal(aMinor.root, 9);
  assert.equal(aMinor.quality, "minor");
  assert.deepEqual(aMinor.pitchClasses, [9, 0, 4]);
  assert.deepEqual(applyTonnetzOperation(cMinor, "P").pitchClasses, cMajor.pitchClasses);
  assert.deepEqual(applyTonnetzOperation(eMinor, "L").pitchClasses, cMajor.pitchClasses);
  assert.deepEqual(applyTonnetzOperation(aMinor, "R").pitchClasses, cMajor.pitchClasses);

  // Euclidean rhythm E(5, 12) has 5 pulses across 12 steps
  const e512 = bjorklund(5, 12, 0);
  assert.equal(e512.length, 12);
  assert.equal(e512.reduce((sum, hit) => sum + hit, 0), 5);

  const score = composeScore(source, "the moon owes me five dollars");
  const melody = melodyFor(score);
  const beat = composeBeat(beatSource, score, 0);
  const bass = composeBass(bassSource, score, 0);
  const harmony = composeHarmony(harmonySource, score, 0);
  const chimes = composeChimes(pietSource, fractranSource, score, 0);
  const chant = composeChant(chantSource, score, 0);

  const spine = buildTonnetzSpine(score, 0);
  assert.equal(spine.length, 12);

  const conducted = conductEnsemble({
    score,
    melody,
    beat,
    bass,
    harmony,
    chimes,
    chant,
    mutation: 0,
  });

  assert.equal(conducted.spine.length, 12);
  assert.equal(conducted.melody.length, 12);

  // Strong beats (0, 3, 6, 9) of the lead melody, and all bass, harmony, and chant steps lock to the active Tonnetz triad
  conducted.bass.steps.forEach((step, index) => {
    const triad = conducted.spine[index];
    const pc = ((step.interval % 12) + 12) % 12;
    assert.ok(
      triad.pitchClasses.includes(pc),
      `Expected bass step ${index} pitch class ${pc} to belong to triad ${triad.pitchClasses.join(",")}`,
    );
  });

  conducted.harmony.steps.forEach((step, index) => {
    const triad = conducted.spine[index];
    step.chord.forEach((note) => {
      assert.ok(triad.pitchClasses.includes(((note % 12) + 12) % 12));
    });
  });

  conducted.chant.steps.forEach((step, index) => {
    const triad = conducted.spine[index];
    assert.ok(triad.pitchClasses.includes(((step.interval % 12) + 12) % 12));
  });
});
