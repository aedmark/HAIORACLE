import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { HARMONY_NAMES, composeHarmony, cycleHarmonyCell, runBefunge } from "../src/befunge.mjs";
import { BASS_NAMES, composeBass, cycleBassCell, runBrainfuck } from "../src/brainfuck.mjs";
import {
  CHORD_QUALITIES,
  FUN_KEY_BY_CODE,
  FUN_KEY_MAP,
  GENRE_NAMES,
  GENRE_RULEBOOKS,
  applyTonnetzOperation,
  bjorklund,
  buildFunChord,
  buildFunProgression,
  buildTonnetzSpine,
  buildTriad,
  chordLabelFor,
  conductEnsemble,
  eulerGradus,
  semitoneGradus,
} from "../src/conductor.mjs";
import { CHIME_NAMES, composeChimes, cycleChimeCell, runFractran, runPiet } from "../src/fractran.mjs";
import { runLolcode } from "../src/lolcode.mjs";
import { BEAT_NAMES, composeBeat, crazy, cycleBeatStep, rotr, runMalbolge } from "../src/malbolge.mjs";
import { MELODY_NAMES, melodyFor } from "../src/music.mjs";
import { FUNGAL_NAMES, composeScore, hashPhrase, parseScore } from "../src/score.mjs";
import { audioBufferToWavBlob, buildShareUrl, decodeOmenHash, encodeOmenHash, specimenFilenameFor } from "../src/share.mjs";
import { CHANT_NAMES, FORMANT_VOWELS, PERSONA_ROLES, composeChant, cycleChantCell, runShakespeare } from "../src/shakespeare.mjs";
import {
  INTERCAL_SECTION_NAMES,
  arrangementSectionAt,
  composeArrangement,
  intercalMingle,
  intercalSelect,
  runIntercal,
} from "../src/intercal.mjs";

const [source, beatSource, bassSource, harmonySource, pietSource, fractranSource, chantSource, conductorSource] = await Promise.all([
  readFile(new URL("../src/oracle.lol", import.meta.url), "utf8"),
  readFile(new URL("../src/beat.mal", import.meta.url), "utf8"),
  readFile(new URL("../src/bass.bf", import.meta.url), "utf8"),
  readFile(new URL("../src/harmony.bfg", import.meta.url), "utf8"),
  readFile(new URL("../src/pad.piet", import.meta.url), "utf8"),
  readFile(new URL("../src/chimes.frac", import.meta.url), "utf8"),
  readFile(new URL("../src/chant.spl", import.meta.url), "utf8"),
  readFile(new URL("../src/conductor.i", import.meta.url), "utf8"),
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
  assert.ok(score.fungalForm >= 0 && score.fungalForm <= 7);
  assert.ok(score.fungalHyphae >= 10 && score.fungalHyphae <= 100);
  assert.ok(score.fungalSpores >= 10 && score.fungalSpores <= 100);
  assert.ok(score.fungalBloom >= 10 && score.fungalBloom <= 100);
  assert.ok(FUNGAL_NAMES.includes(score.fungalName));
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
  assert.equal(new Set(scores.map((score) => score.fungalForm)).size, 8);
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
  const wavFilename = specimenFilenameFor(score, "wav");
  assert.match(wavFilename, /^hai-oracle-[a-z0-9-]+-[0-9a-f]{8}\.wav$/);

  // Test 16-bit stereo PCM WAV encoding
  const sampleCount = 64;
  const mockBuffer = {
    numberOfChannels: 2,
    sampleRate: 44100,
    length: sampleCount,
    getChannelData: (c) => {
      const channel = new Float32Array(sampleCount);
      for (let i = 0; i < sampleCount; i += 1) {
        channel[i] = c === 0 ? Math.sin((i / sampleCount) * Math.PI * 2) : -0.5;
      }
      return channel;
    },
  };
  const wavBlob = audioBufferToWavBlob(mockBuffer);
  assert.equal(wavBlob.type, "audio/wav");
  // 44-byte RIFF header + 64 samples * 2 channels * 2 bytes/sample = 44 + 256 = 300 bytes
  assert.equal(wavBlob.size, 44 + sampleCount * 2 * 2);

  assert.throws(() => encodeOmenHash("   "), /empty omen phrase/);
  assert.throws(() => audioBufferToWavBlob(null), /Cannot encode a null/);
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

test("the Kapellmeister music-theory console executes genre rulebooks across Tonnetz, Blues, Jazz, Counterpoint, Drone, and Raw Chaos", () => {
  const score = composeScore(source, "the moon owes me five dollars");
  const melody = melodyFor(score);
  const beat = composeBeat(beatSource, score, 0);
  const bass = composeBass(bassSource, score, 0);
  const harmony = composeHarmony(harmonySource, score, 0);
  const chimes = composeChimes(pietSource, fractranSource, score, 0);
  const chant = composeChant(chantSource, score, 0);

  // 1. All six genre rulebook keys and human-readable names exist
  assert.equal(Object.keys(GENRE_RULEBOOKS).length, 6);
  for (const [key, rulebook] of Object.entries(GENRE_RULEBOOKS)) {
    assert.ok(GENRE_NAMES[rulebook], `Expected display name for genre ${rulebook}`);
  }

  // 2. 12-Bar Blues rulebook: I7 (steps 0-3), IV7 (steps 4-5), I7 (steps 6-7), V7 (step 8), IV7 (step 9), I7 (step 10), V7 Turnaround (step 11)
  const blues = conductEnsemble({
    score, melody, beat, bass, harmony, chimes, chant,
    genre: GENRE_RULEBOOKS.BLUES_TWELVE_BAR,
  });
  assert.equal(blues.genre, "blues_twelve_bar");
  assert.equal(blues.spine[0].op, "I7");
  assert.equal(blues.spine[4].op, "IV7");
  assert.equal(blues.spine[8].op, "V7");
  assert.equal(blues.spine[11].op, "V7 (Turn)");
  assert.equal(chordLabelFor(blues.spine[0], 60), "C7");
  assert.equal(chordLabelFor(blues.spine[4], 60), "F7");
  assert.equal(chordLabelFor(blues.spine[8], 60), "G7");
  assert.ok(blues.bass.steps[0].label.includes("E♭"), "Expected blues bass step 0 to be tonic root E♭");
  assert.ok(blues.harmony.steps[0].label.includes("7"), "Expected blues harmony step 0 to be dominant 7th");

  // 3. Smoky Jazz rulebook: Imaj9, vi9, ii9, subV7
  const jazz = conductEnsemble({
    score, melody, beat, bass, harmony, chimes, chant,
    genre: GENRE_RULEBOOKS.SMOKY_JAZZ,
  });
  assert.equal(jazz.genre, "smoky_jazz");
  assert.equal(jazz.spine[0].op, "Imaj9");
  assert.equal(jazz.spine[3].op, "vi9");
  assert.equal(jazz.spine[6].op, "ii9");
  assert.equal(jazz.spine[9].op, "♭II7alt");
  assert.equal(chordLabelFor(jazz.spine[0], 60), "Cmaj9");
  assert.ok(jazz.bass.steps[0].label.includes("E♭"), "Expected jazz bass step 0 to be tonic root E♭");
  assert.ok(jazz.harmony.steps[0].label.includes("M9"), "Expected jazz harmony step 0 to be major 9th");

  // 4. Renaissance Counterpoint rulebook: Picardy third on step 11
  const counterpoint = conductEnsemble({
    score, melody, beat, bass, harmony, chimes, chant,
    genre: GENRE_RULEBOOKS.RENAISSANCE_COUNTERPOINT,
  });
  assert.equal(counterpoint.genre, "renaissance_counterpoint");
  assert.equal(counterpoint.spine[11].quality, "major");
  assert.ok(counterpoint.chant.steps[0].label.includes("·"), "Expected counterpoint chant step to have persona and pitch label");

  // 5. Modal Drone rulebook: root and fifth pedal
  const drone = conductEnsemble({
    score, melody, beat, bass, harmony, chimes, chant,
    genre: GENRE_RULEBOOKS.MODAL_DRONE,
  });
  assert.equal(drone.genre, "modal_drone");
  assert.ok(drone.spine[0].op.includes("Drone"));
  assert.ok(drone.bass.steps[0].label.includes("E♭"), "Expected drone bass step 0 to be tonic root E♭");
  assert.ok(drone.harmony.steps[0].label.includes("5"), "Expected drone harmony step 0 to be open fifth");

  // 6. Raw Chaos rulebook: zero filtering, exact native VM output preserved
  const chaos = conductEnsemble({
    score, melody, beat, bass, harmony, chimes, chant,
    genre: GENRE_RULEBOOKS.RAW_CHAOS,
  });
  assert.equal(chaos.genre, "raw_chaos");
  assert.deepEqual(chaos.melody, melody);
  assert.deepEqual(chaos.bass, bass);
  assert.deepEqual(chaos.harmony, harmony);
  assert.equal(chordLabelFor(chaos.spine[0], 60), "RAW VM OUTPUT");
});

test("the Esoteric Fun Machine auto-chord organ harmonizes keys and overlays custom progressions", () => {
  const score = composeScore(source, "the celestial laundromat is closing");
  const melody = melodyFor(score);
  const beat = composeBeat(beatSource, score, 0);
  const bass = composeBass(bassSource, score, 0);
  const harmony = composeHarmony(harmonySource, score, 0);
  const chimes = composeChimes(pietSource, fractranSource, score, 0);
  const chant = composeChant(chantSource, score, 0);

  // 1. Keyboard manual: exactly 13 keys, 5 black, 8 white, valid keyboard shortcuts [A..K]
  assert.equal(FUN_KEY_MAP.length, 13);
  const blackKeys = FUN_KEY_MAP.filter((k) => k.isBlack);
  const whiteKeys = FUN_KEY_MAP.filter((k) => !k.isBlack);
  assert.equal(blackKeys.length, 5);
  assert.equal(whiteKeys.length, 8);
  assert.deepEqual(blackKeys.map((k) => k.semitone), [1, 3, 6, 8, 10]);
  assert.deepEqual(whiteKeys.map((k) => k.semitone), [0, 2, 4, 5, 7, 9, 11, 12]);
  assert.equal(FUN_KEY_BY_CODE.KeyA.note, "C");
  assert.equal(FUN_KEY_BY_CODE.KeyW.note, "C♯");
  assert.equal(FUN_KEY_BY_CODE.KeyK.note, "C'");

  // 2. buildFunChord chord qualities and auto-genre harmonization
  const bluesChord = buildFunChord(0, CHORD_QUALITIES.AUTO, GENRE_RULEBOOKS.BLUES_TWELVE_BAR);
  assert.equal(bluesChord.name, "C");
  assert.equal(bluesChord.quality, "dom7");
  assert.deepEqual(bluesChord.pitchClasses, [0, 4, 7, 10]);
  assert.equal(bluesChord.op, "FUN·C");

  const majorChord = buildFunChord(7, CHORD_QUALITIES.MAJOR);
  assert.equal(majorChord.name, "G");
  assert.equal(majorChord.quality, "major");
  assert.deepEqual(majorChord.pitchClasses, [7, 11, 2]);

  const minorChord = buildFunChord(9, CHORD_QUALITIES.MINOR);
  assert.equal(minorChord.name, "A");
  assert.equal(minorChord.quality, "minor");
  assert.deepEqual(minorChord.pitchClasses, [9, 0, 4]);

  const maj9Chord = buildFunChord(5, CHORD_QUALITIES.MAJ9);
  assert.equal(maj9Chord.name, "F");
  assert.equal(maj9Chord.quality, "maj9");
  assert.deepEqual(maj9Chord.pitchClasses, [5, 9, 0, 4, 7]);

  const dimChord = buildFunChord(11, CHORD_QUALITIES.DIM);
  assert.equal(dimChord.name, "B");
  assert.equal(dimChord.quality, "dim");
  assert.deepEqual(dimChord.pitchClasses, [11, 2, 5, 8]);

  const open5Chord = buildFunChord(2, CHORD_QUALITIES.OPEN5);
  assert.equal(open5Chord.name, "D");
  assert.equal(open5Chord.quality, "modal_open");
  assert.deepEqual(open5Chord.pitchClasses, [2, 9, 4]);

  // 3. customSpine overlay conducts ensemble loop without altering other algorithmic steps
  const customProgression = Array(12).fill(null);
  customProgression[2] = buildFunChord(5, "dom7"); // F dom7 on step 2
  customProgression[5] = buildFunChord(0, "maj9"); // C maj9 on step 5

  const conducted = conductEnsemble({
    score, melody, beat, bass, harmony, chimes, chant,
    genre: GENRE_RULEBOOKS.VICTORIAN_TONNETZ,
    customSpine: customProgression,
  });

  assert.equal(conducted.spine[2].name, "F");
  assert.equal(conducted.spine[2].quality, "dom7");
  assert.equal(conducted.spine[2].op, "FUN·F");
  assert.equal(conducted.spine[5].name, "C");
  assert.equal(conducted.spine[5].quality, "maj9");
  assert.equal(conducted.spine[5].op, "FUN·C");

  // Step 0 was not customized, so it retains its Tonnetz rulebook chord
  assert.notEqual(conducted.spine[0].op, "FUN·C");
  assert.ok(conducted.spine[0].name);

  // 4. buildFunProgression generates complete 12-step chord progression melody
  const bluesProg = buildFunProgression(0, "auto", GENRE_RULEBOOKS.BLUES_TWELVE_BAR);
  assert.equal(bluesProg.rootPc, 0);
  assert.equal(bluesProg.chords.length, 4);
  assert.equal(bluesProg.steps.length, 12);
  assert.equal(bluesProg.chords[0].name, "C");
  assert.equal(bluesProg.chords[1].name, "F");
  assert.equal(bluesProg.chords[2].name, "G");
  assert.equal(bluesProg.chords[3].name, "C");
  assert.equal(bluesProg.steps[0].isRegionStart, true);
  assert.equal(bluesProg.steps[1].isRegionStart, false);
  assert.equal(bluesProg.steps[3].isRegionStart, true);
  assert.equal(bluesProg.steps[3].chord.name, "F");
  assert.equal(bluesProg.steps[6].chord.name, "G");
  assert.equal(bluesProg.steps[9].chord.name, "C");
  assert.ok(bluesProg.steps[0].melodyPitch >= 0);
  assert.ok(bluesProg.steps[0].melodyNote);
  assert.match(bluesProg.summary, /C7 → F7 → G7 → C7/);

  const majorProg = buildFunProgression(0, "major", GENRE_RULEBOOKS.VICTORIAN_TONNETZ);
  assert.equal(majorProg.chords[0].name, "C");
  assert.equal(majorProg.chords[1].name, "A");
  assert.equal(majorProg.chords[1].quality, "minor");
  assert.equal(majorProg.chords[2].name, "F");
  assert.equal(majorProg.chords[3].name, "G");
  assert.match(majorProg.summary, /C Maj → Am → F Maj → G Maj/);

  const jazzProg = buildFunProgression(2, "auto", GENRE_RULEBOOKS.SMOKY_JAZZ);
  assert.equal(jazzProg.chords[0].name, "D");
  assert.equal(jazzProg.chords[0].quality, "maj9");
  assert.equal(jazzProg.chords[1].name, "B");
  assert.equal(jazzProg.chords[2].name, "E");
  assert.equal(jazzProg.chords[3].name, "A");
  assert.match(jazzProg.summary, /Dmaj9 → Bm9 → Em9 → A7alt/);

  const minorProg = buildFunProgression(9, "auto", GENRE_RULEBOOKS.RENAISSANCE_COUNTERPOINT);
  assert.equal(minorProg.chords[0].name, "A");
  assert.equal(minorProg.chords[0].quality, "minor");
  assert.equal(minorProg.chords[1].name, "F");
  assert.equal(minorProg.chords[2].name, "D");
  assert.equal(minorProg.chords[3].name, "E");
  assert.match(minorProg.summary, /Am → F Maj → Dm → E Maj/);
});

test("antique parlor chamber impulse response eliminates low-frequency fog-horn resonance and normalizes gain", () => {
  const sampleRate = 44100;
  const frames = Math.ceil(sampleRate * 0.5);
  const left = new Float32Array(frames);

  const reflections = [
    { t: 0.007, gL: 0.35 },
    { t: 0.015, gL: -0.28 },
    { t: 0.024, gL: 0.22 },
    { t: 0.036, gL: -0.18 },
    { t: 0.052, gL: 0.14 },
    { t: 0.073, gL: -0.11 },
    { t: 0.098, gL: 0.08 },
    { t: 0.128, gL: -0.06 },
  ];

  for (const ref of reflections) {
    const idx = Math.min(frames - 1, Math.floor(ref.t * sampleRate));
    left[idx] += ref.gL;
  }

  const refSum = reflections.reduce((sum, r) => sum + r.gL, 0);
  assert.ok(Math.abs(refSum) < 0.25, `Expected reflection DC sum near 0 to avoid drone resonance, got ${refSum}`);

  let lpL = 0;
  let hpInL = 0, hpOutL = 0;
  const R = 0.985;
  let seed = 12345;
  function lcg() {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    return (seed / 4294967296) * 2 - 1;
  }

  for (let i = 0; i < frames; i += 1) {
    const t = i / sampleRate;
    const decay = Math.exp(-2.8 * t);
    const whiteL = lcg() * decay * 0.25;
    const filterCoeff = 0.55 + 0.35 * Math.exp(-3.5 * t);
    lpL = lpL * filterCoeff + whiteL * (1 - filterCoeff);
    hpOutL = lpL - hpInL + R * hpOutL;
    hpInL = lpL;
    left[i] += hpOutL;
  }

  const probeFreqs = [30, 60, 90, 120, 150, 200, 300, 500, 1000, 2000, 4000];
  let maxSpectralMag = 0;
  const mags = {};
  for (const f of probeFreqs) {
    let re = 0, im = 0;
    const omega = 2 * Math.PI * f / sampleRate;
    for (let n = 0; n < frames; n += 2) {
      re += left[n] * Math.cos(omega * n);
      im -= left[n] * Math.sin(omega * n);
    }
    const mag = Math.sqrt(re * re + im * im) * 2;
    if (mag > maxSpectralMag) maxSpectralMag = mag;
    mags[f] = mag;
  }

  const normFactor = 0.75 / (maxSpectralMag || 1);
  const normalized30 = mags[30] * normFactor;
  const normalized500 = mags[500] * normFactor;

  assert.ok(maxSpectralMag * normFactor <= 0.76, `Expected normalized impulse peak spectral gain <= 0.76, got ${maxSpectralMag * normFactor}`);
  assert.ok(normalized30 < 0.35, `Expected 30Hz sub-bass to be attenuated (<0.35) to prevent fog-horn buildup, got ${normalized30}`);
  assert.ok(normalized500 > normalized30 * 2.0, `Expected 500Hz mid presence to dominate 30Hz rumble by >2x, got ${normalized500} vs ${normalized30}`);
});

test("the INTERCAL 1972 conductor executes src/conductor.i deterministically with balanced politeness", () => {
  const word = 0b1_0110_1001;
  const result = runIntercal(conductorSource, [word, word ^ 0xffff]);
  assert.equal(result.statementsCount, 35);
  assert.equal(result.politeCount, 8);
  assert.ok(result.politenessRatio >= 0.20 && result.politenessRatio <= 0.334);
  assert.equal(result.gaveUp, true);
  assert.equal(result.stepsExecuted, 34, "COME FROM (100) skips the lead's exit after (60)");
  assert.deepEqual(result.ignoredVars, [":8"], "the Fun Machine register stays IGNOREd");
  // Bit 5 set: the choir joins the turnaround, so every voice is home at GIVE UP.
  assert.deepEqual(result.vars32, { ":1": 1, ":2": 1, ":3": 1, ":4": 1, ":5": 1, ":6": 1, ":7": 1, ":8": 1 });
  assert.equal(runIntercal(conductorSource, [0, 0xffff]).vars32[":6"], 0, "bit 5 clear leaves the choir out of the turnaround");
  assert.equal(result.vars16[".5"], word, "WRITE IN reads the arrangement word");
  assert.equal(result.vars16[".3"], 11, "#3 $ #1 mingles to binary 1011");
  assert.deepEqual(
    result.trace.filter((mark) => mark.target === ".1" || mark.target === ".3").map((mark) => `${mark.target}=${mark.value}`),
    [".1=1", ".1=2", ".1=3", ".1=4", ".3=11"],
  );
  assert.throws(() => runIntercal(conductorSource, [word]), /ICL562/, "running out of input is an error");

  // INTERCAL bitwise operators
  assert.equal(intercalMingle(9, 3), 135);
  assert.equal(intercalMingle(3, 0), 10);
  assert.equal(intercalSelect(0b1101, 0b1011), 0b101);
});

test("INTERCAL 1972 rejects insufficiently polite or overly polite programs with line numbers", () => {
  const rudeProgram = `
DO :1 <- #1
DO :2 <- #1
DO :3 <- #1
DO :4 <- #1
DO :5 <- #1
DO :6 <- #1
DO GIVE UP
`;
  assert.throws(
    () => runIntercal(rudeProgram),
    /INTERCAL line \d+: Insufficiently polite \(ICL079/,
  );

  const grovelingProgram = `
PLEASE DO :1 <- #1
PLEASE DO :2 <- #1
PLEASE DO :3 <- #1
PLEASE DO :4 <- #1
PLEASE GIVE UP
`;
  assert.throws(
    () => runIntercal(grovelingProgram),
    /INTERCAL line \d+: Overly polite \(ICL099/,
  );
});

test("INTERCAL 1972 dynamic arrangement varies per phrase within the conductor's musical guardrails", () => {
  const forms = new Set();
  for (let n = 0; n < 160; n += 1) {
    const score = composeScore(source, `phrase number ${n}`);
    const arrangement = composeArrangement(conductorSource, score);
    assert.deepEqual(composeArrangement(conductorSource, score), arrangement, "the same phrase always gets the same form");
    forms.add(JSON.stringify(arrangement.channelMasks));
    const masks = arrangement.channelMasks;
    assert.equal(masks.length, 12);
    assert.deepEqual(arrangement.sections.map((section) => section.name), [...INTERCAL_SECTION_NAMES]);
    assert.match(arrangement.politenessPercentage, /22\.9%/);
    assert.ok([10, 11].includes(arrangement.turnaroundStep));
    const section = (index) => masks[index * 3];
    for (let step = 0; step < 12; step += 1) {
      const anchor = step >= arrangement.turnaroundStep ? masks[arrangement.turnaroundStep] : masks[Math.floor(step / 3) * 3];
      assert.deepEqual(masks[step], anchor, `step ${step} plays its section's mask`);
      assert.equal(masks[step].fun, true, "the player is never rested");
      assert.equal(masks[step].fungal, true, "the fungal voice keeps the room alive");
      const bandVoices = ["lead", "beat", "bass", "harmony", "chime", "chant", "fungal"].filter((id) => masks[step][id]).length;
      assert.ok(bandVoices >= 5, `step ${step} keeps at least five band voices (found ${bandVoices})`);
      assert.equal(masks[step].isTurnaround, step >= arrangement.turnaroundStep);
    }
    // I: lead, pulse, and bass set out. II: the choir sings over pulse and bass,
    // answered by lead or organ, never both.
    assert.ok(section(0).lead && section(0).beat && section(0).bass);
    assert.ok(section(1).chant && section(1).bass && section(1).beat);
    assert.notEqual(section(1).lead, section(1).harmony);
    // III: tutti.
    assert.ok(Object.values(section(2)).filter((on) => on === true).length === 8);
    // IV: the pulse falls away; lead and organ carry the tune over the bass or the choir.
    assert.equal(masks[9].beat, false);
    assert.ok(masks[9].lead && masks[9].harmony);
    assert.notEqual(masks[9].bass, masks[9].chant);
    // Turnaround: pulse, bass, and lead come home.
    assert.ok(masks[11].beat && masks[11].bass && masks[11].lead);
  }
  assert.ok(forms.size >= 60, `${forms.size} distinct forms across 160 phrases`);

  assert.equal(arrangementSectionAt(composeArrangement(conductorSource, composeScore(source, "hai oracle")), 4).section.name, "ANTIPHONAL CONVERSATION");
});

test("the INTERCAL score, not the host, decides the arrangement, and malformed form is rejected", () => {
  const pigeons = composeScore(source, "three pigeons in a borrowed coat");
  const arrange = (program) => composeArrangement(program, pigeons);
  // Editing the program re-arranges the band: the choir always opens the exposition.
  assert.equal(arrange(conductorSource.replace("DO :6 <- .5 ~ #4", "DO :6 <- #1")).channelMasks[0].chant, true);
  // Without IGNORE, the breakdown's DO :8 <- #0 rests the Fun Machine from step 9 on.
  const hushed = arrange(conductorSource.replace("PLEASE IGNORE :8", "PLEASE REMEMBER :8"));
  assert.deepEqual(hushed.channelMasks.map((mask) => mask.fun), [...Array(9).fill(true), false, false, false]);
  // Moving the COME FROM target moves the turnaround.
  assert.equal(arrange(conductorSource.replace("DO .3 <- #3 $ .7", "DO .3 <- #11")).turnaroundStep, 11);
  assert.equal(arrange(conductorSource.replace("DO .3 <- #3 $ .7", "DO .3 <- #10")).turnaroundStep, 10);

  const rejects = (program, pattern) => assert.throws(() => arrange(program), pattern);
  rejects(conductorSource.replace("DO .1 <- #3", "DO .1 <- #5"), /expected section 3/);
  rejects(conductorSource.replace("DO .3 <- #3 $ .7", "DO .3 <- #12"), /must fall on step 10 or 11/);
  rejects(conductorSource.replace("DO .3 <- #3 $ .7", "DO .3 <- #9"), /must fall on step 10 or 11/);
  rejects(conductorSource.replace("DO :5 <- #1", "DO :5 <- #2"), /register :5 \(chime\) must hold #0 or #1/);
  rejects(conductorSource.replace("DO :7 <- #1\n", ""), /register :7 \(fungal\)/);
  rejects(conductorSource.replace("(60) DO .3 <- #3 $ .7", "(60) DO :5 <- #1"), /4 sections and a turnaround/);
  rejects(conductorSource.replace("PLEASE GIVE UP", "PLEASE DO :5 <- #1"), /GIVE UP/);
});



