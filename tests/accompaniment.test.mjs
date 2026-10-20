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
