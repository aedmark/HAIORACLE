import assert from "node:assert/strict";
import test from "node:test";

import {
  ACCOMPANIMENT_STYLES,
  arpeggioNotes,
  buildPerformance,
  chordText,
  leadMidi,
  padVoicing,
  soundingPitchClasses,
  stepsToRegionBoundary,
} from "../src/accompaniment.mjs";
import { buildFunChord, buildFunProgression } from "../src/conductor.mjs";
import { GENRES } from "./install-rulebooks.mjs";


test("each style turns a key into four region chords and twelve steps", () => {
  for (const genre of GENRES) {
    for (let key = 0; key < 13; key += 1) {
      for (const style of ACCOMPANIMENT_STYLES) {
        const performance = buildPerformance(key, style, genre, 52);
        assert.equal(performance.chords.length, 4);
        assert.equal(performance.steps.length, 12);
        performance.steps.forEach((step, index) => {
          assert.equal(step.regionIndex, Math.floor(index / 3));
          assert.equal(step.isRegionStart, index % 3 === 0);
          assert.equal(step.chord, performance.chords[step.regionIndex], "steps share their region's chord");
        });
        assert.ok(Object.isFrozen(performance) && Object.isFrozen(performance.steps));
      }
    }
  }
  assert.throws(() => buildPerformance(0, "organ", GENRES[0]), RangeError);
});

test("swell and arpeggio hold one genre-coloured chord; progression walks the genre progression with a lead line", () => {
  const swell = buildPerformance(7, "swell", "smoky_jazz", 52);
  const expected = buildFunChord(7, "auto", "smoky_jazz", 52);
  assert.ok(swell.chords.every((chord) => JSON.stringify(chord) === JSON.stringify(expected)));
  assert.ok(swell.steps.every((step) => step.leadPitch === null));
  assert.equal(swell.summary, `${chordText(expected)} · SWELL`);

  const arpeggio = buildPerformance(7, "arpeggio", "smoky_jazz", 52);
  assert.deepEqual(arpeggio.chords, swell.chords);

  const progression = buildPerformance(7, "progression", "blues_twelve_bar", 52);
  const genreProgression = buildFunProgression(7, "auto", "blues_twelve_bar", 52);
  assert.deepEqual(progression.chords, genreProgression.chords);
  assert.deepEqual(progression.steps.map((s) => s.leadPitch), genreProgression.steps.map((s) => s.melodyPitch));
  assert.ok(progression.steps.every((s) => leadMidi(s.leadPitch) >= 60 && leadMidi(s.leadPitch) <= 96));
  assert.match(progression.summary, / → .* → .* → /);
});

test("pad voicings keep the root low, upper voices in range, and no doubled notes", () => {
  for (const genre of GENRES) {
    for (let key = 0; key < 12; key += 1) {
      let previous = null;
      for (const chord of buildPerformance(key, "progression", genre, 52).chords) {
        const voicing = padVoicing(chord, previous);
        const [root, ...upper] = voicing;
        assert.equal(root % 12, chord.rootPc, "the bottom note is the root");
        assert.ok(root >= 43 && root <= 54, `root ${root} sits below the upper voices`);
        assert.ok(upper.every((midi) => midi >= 55 && midi < 79), `upper ${upper}`);
        assert.equal(new Set(voicing).size, voicing.length, `no doubled notes in ${voicing}`);
        assert.deepEqual(new Set(upper.map((m) => m % 12)), new Set(soundingPitchClasses(chord)), "every chord tone sounds");
        previous = voicing;
      }
    }
  }
});

test("voice leading moves each upper voice to the nearest octave of its pitch class", () => {
  const jazz = buildPerformance(2, "progression", "smoky_jazz", 52).chords;
  let previous = null;
  let totalLed = 0;
  let totalNaive = 0;
  for (const chord of jazz) {
    const led = padVoicing(chord, previous);
    const naive = padVoicing(chord);
    if (previous) {
      const motion = (voicing) => voicing.slice(1).reduce((sum, m) => sum + Math.min(...previous.slice(1).map((p) => Math.abs(p - m))), 0);
      totalLed += motion(led);
      totalNaive += motion(naive);
    }
    previous = led;
  }
  assert.ok(totalLed <= totalNaive, `led motion ${totalLed} ≤ unled ${totalNaive}`);
});

test("arpeggios ripple up and back down the chord, an octave above the pad, continuously across steps", () => {
  const chord = buildFunChord(0, "major");
  const figure = Array.from({ length: 6 }, (_, step) => arpeggioNotes(chord, step, 2)).flat();
  assert.deepEqual(figure.slice(0, 6), [67, 72, 76, 79, 76, 72]);
  assert.deepEqual(figure.slice(6), figure.slice(0, 6), "the figure repeats seamlessly");
  const upper = new Set(padVoicing(chord).slice(1).map((m) => (m + 12) % 12));
  assert.ok(figure.every((m) => upper.has(m % 12)), "every arpeggio note is a chord tone");
});

test("raw chaos chords still sing an open fifth, and region boundaries count correctly", () => {
  const raw = buildPerformance(5, "swell", "raw_chaos", 52).chords[0];
  assert.equal(raw.pitchClasses.length, 0);
  assert.deepEqual(soundingPitchClasses(raw), [5, 0]);
  assert.equal(padVoicing(raw).length, 3);
  assert.deepEqual([0, 1, 2, 3, 11, 12, 13].map(stepsToRegionBoundary), [3, 2, 1, 3, 1, 3, 2]);
});

test("Fun Machine chords shift into the conductor's tonic-relative frame", async () => {
  const { toTonicRelative } = await import("../src/accompaniment.mjs");
  const gMinor = buildFunChord(7, "minor");
  const relative = toTonicRelative(gMinor, 51); // E♭ creature
  assert.equal(relative.root, 4, "G sits a major third above E♭");
  assert.deepEqual([...relative.pitchClasses], [4, 7, 11]);
  assert.equal(relative.quality, "minor");
  assert.equal((relative.root + 51) % 12, gMinor.rootPc, "adding the tonic back recovers the absolute chord");
  assert.deepEqual(toTonicRelative(gMinor, 48).pitchClasses, gMinor.pitchClasses, "a C tonic changes nothing");
  const raw = buildFunChord(5, "auto", "raw_chaos", 51);
  assert.deepEqual([...toTonicRelative(raw, 51).pitchClasses], []);
});

test("the manual climbs like a keyboard: every voice rises with the key, and C' sounds an octave above C", () => {
  for (const genre of GENRES) {
    for (const style of ACCOMPANIMENT_STYLES) {
      const low = buildPerformance(0, style, genre, 52);
      const high = buildPerformance(12, style, genre, 52);
      assert.equal(low.lift, 0);
      assert.equal(high.lift, 12);
      assert.equal(high.key, 0, "C' plays the same chords as C");
      assert.deepEqual(high.chords, low.chords);
      assert.deepEqual(
        high.steps.map((s) => s.leadPitch),
        low.steps.map((s) => (s.leadPitch === null ? null : s.leadPitch + 12)),
        `${genre} ${style}: C' sings the lead an octave higher`,
      );
      for (const chord of low.chords) {
        assert.deepEqual(padVoicing(chord, null, 12), padVoicing(chord).map((m) => m + 12), "the pad lifts an octave");
        assert.deepEqual(arpeggioNotes(chord, 3, 2, 12), arpeggioNotes(chord, 3, 2).map((m) => m + 12), "the arpeggio lifts an octave");
      }
    }
  }
  // Each key's pad and arpeggio sit in a window that rises a semitone per key.
  for (let position = 0; position <= 12; position += 1) {
    const chord = buildPerformance(position, "swell", "victorian_tonnetz", 52).chords[0];
    const voicing = padVoicing(chord, null, position);
    assert.ok(voicing[0] < 55 + position && voicing[0] >= 43 + position, `root of key ${position}`);
    assert.ok(voicing.slice(1).every((m) => m >= 55 + position && m < 79 + position), `upper voices of key ${position}`);
    const arpeggio = arpeggioNotes(chord, 0, 6, position);
    assert.ok(Math.min(...arpeggio) >= 67 + position, `arpeggio of key ${position} starts above its window`);
  }
});

test("on the harmonic clock a progression holds one chord per pass, with lead notes held four steps (D-044)", () => {
  const written = buildPerformance(7, "progression", "victorian_tonnetz", 0);
  for (let pass = 0; pass < 4; pass += 1) {
    const slow = buildPerformance(7, "progression", "victorian_tonnetz", 0, { pass });
    assert.equal(slow.regionSteps, 12);
    for (const step of slow.steps) assert.deepEqual(step.chord, written.chords[pass], `pass ${pass} holds region ${pass}'s chord`);
    assert.deepEqual(slow.steps.map((step) => step.isRegionStart), [true, ...Array(11).fill(false)], "one pad, on the downbeat");
    assert.deepEqual(slow.steps.map((step) => step.leadPitch).filter((pitch) => pitch !== null), written.steps.slice(pass * 3, pass * 3 + 3).map((step) => step.leadPitch));
    assert.deepEqual(slow.steps.map((step, index) => step.leadPitch !== null ? index : null).filter((index) => index !== null), [0, 4, 8]);
  }
  assert.equal(written.regionSteps, 3, "without a pass, the old one-loop progression");
  const swell = buildPerformance(7, "swell", "victorian_tonnetz", 0, { pass: 2 });
  assert.equal(swell.regionSteps, 3, "a single-chord style keeps its three-step breath");
});

test("a creature varies the Fun Machine's progression too, never moving off the key it holds (D-043)", async () => {
  const { readFile } = await import("node:fs/promises");
  const { composeScore } = await import("../src/score.mjs");
  const oracle = await readFile(new URL("../src/oracle.lol", import.meta.url), "utf8");
  const scores = Array.from({ length: 40 }, (_, i) => composeScore(oracle, `fun variation ${i}`));
  const cycle = (score, varied) => [0, 1, 2, 3].flatMap((pass) => buildPerformance(5, "progression", "smoky_jazz", 0, { pass, score, varied }).steps);
  const shape = (steps) => steps.map((step) => `${step.chord.rootPc}${step.chord.quality}`).join(" ");
  const written = shape(cycle(scores[0], false));
  const distinct = new Set(scores.map((score) => shape(cycle(score, true))));
  assert.ok(distinct.size >= 8, `${distinct.size} distinct Fun Machine cycles over 40 creatures`);
  assert.equal(new Set(scores.map((score) => shape(cycle(score, false)))).size, 1, "AS WRITTEN: one progression for everyone");
  for (const score of scores) {
    const steps = cycle(score, true);
    assert.equal(shape(steps.slice(0, 1)), written.split(" ")[0], "the held key's chord sounds first");
    assert.deepEqual(cycle(score, true), steps, "deterministic");
    const asWritten = cycle(score, false);
    steps.forEach((step, index) => {
      const moved = `${step.chord.rootPc}${step.chord.quality}` !== `${asWritten[index].chord.rootPc}${asWritten[index].chord.quality}`;
      if (step.leadPitch !== null && moved) assert.ok(step.chord.pitchClasses.includes(((step.leadPitch % 12) + 12) % 12), "a moved chord gets a lead note on its own tones");
      if (index % 12 > 0) assert.equal(step.isRegionStart, step.chord !== steps[index - 1].chord, "the pad strikes exactly where the chord changes");
    });
  }
  const varied = buildPerformance(5, "progression", "smoky_jazz", 0, { pass: 0, score: scores.find((score) => buildPerformance(5, "progression", "smoky_jazz", 0, { pass: 0, score, varied: true }).variation.length), varied: true });
  assert.ok(varied.variation.length > 0 && !varied.variation.includes("ROTATED") && !varied.variation.some((move) => /CHANGES/.test(move)), "no rotation or pace for the Fun Machine");
});
