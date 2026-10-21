// The Fun Machine's one-finger accompanist (D-028). Pure functions only: a held
// key becomes a "performance" (chords for the four 3-step regions plus an
// optional lead line), and these helpers voice it as a pad, ripple it as an
// arpeggio, or sing a line over it. The host schedules the sound in the band's
// own rhythm and re-conducts the band onto the performance's chords.

import { buildFunChord, buildFunProgression } from "./conductor.mjs";

export const ACCOMPANIMENT_STYLES = Object.freeze(["swell", "arpeggio", "progression"]);
export const DEFAULT_ACCOMPANIMENT_STYLE = "progression";

export const STYLE_LABELS = Object.freeze({
  swell: "SWELL",
  arpeggio: "ARPEGGIO",
  progression: "PROGRESSION",
});

const QUALITY_TEXT = Object.freeze({
  major: "Maj",
  minor: "min",
  dom7: "7",
  maj9: "maj9",
  min9: "min9",
  dom7alt: "7alt",
  dim: "dim",
  modal_open: "5",
  phrygian: "Phryg",
  lydian: "Lyd",
  raw: "raw",
});

// Pad register: root below G3, upper voices kept between G3 and G5.
const PAD_ROOT_BASE = 48;
const UPPER_LOW = 55;
const UPPER_HIGH = 79;
const LEAD_BASE = 60;

export function chordText(chord) {
  return `${chord.name} ${QUALITY_TEXT[chord.quality] ?? chord.quality}`;
}

// Raw-chaos chords have no pitch classes; the accompanist still needs
// something to sing, so it falls back to an open fifth on the root.
export function soundingPitchClasses(chord) {
  const pcs = chord?.pitchClasses?.length ? chord.pitchClasses : [chord.rootPc, (chord.rootPc + 7) % 12];
  return [...new Set(pcs.map((pc) => ((pc % 12) + 12) % 12))];
}

/**
 * Builds what a held key plays. `keySemitone` is the key's position on the
 * 13-key manual (0 = the left C .. 12 = C'); its chord depends only on the
 * pitch class, but `lift` (the position itself) raises every voice so the
 * manual climbs like a keyboard and C' sounds an octave above C.
 *  - swell: one genre-coloured chord on the key, held across all four regions.
 *  - arpeggio: the same single chord, rippled in the band's rhythm.
 *  - progression: the genre's 4-chord progression from the key, with a lead line.
 * Returns `{ style, key, lift, chords[4], steps[12], summary }`, where each
 * step has `chord`, `regionIndex`, `isRegionStart`, and `leadPitch` (semitones
 * above C4, already lifted, or null when the style has no lead line).
 */
export function buildPerformance(keySemitone, style, genre, tonicRoot = 0, { pass = null } = {}) {
  if (!ACCOMPANIMENT_STYLES.includes(style)) throw new RangeError(`Unknown accompaniment style: ${style}`);
  const position = Math.max(0, Math.min(12, Math.trunc(keySemitone) || 0));
  const key = position % 12;
  const lift = position;
  let chords;
  let leadPitches = Array(12).fill(null);
  let summary;
  if (style === "progression") {
    const progression = buildFunProgression(key, "auto", genre, tonicRoot);
    chords = progression.chords;
    // melodyPitch climbs from the key's pitch class; C' lifts it an octave.
    leadPitches = progression.steps.map((step) => step.melodyPitch + (position - key));
    summary = chords.map(chordText).join(" → ");
  } else {
    const chord = buildFunChord(key, "auto", genre, tonicRoot);
    chords = [chord, chord, chord, chord];
    summary = `${chordText(chord)} · ${STYLE_LABELS[style]}`;
  }
  // On the harmonic clock (D-044) a progression holds one chord for the whole
  // pass: one pad, and the region's three lead notes held four steps each.
  if (pass !== null && style === "progression") {
    const regionIndex = ((Math.trunc(pass) % 4) + 4) % 4;
    const steps = Array.from({ length: 12 }, (_, index) => Object.freeze({
      chord: chords[regionIndex],
      regionIndex,
      isRegionStart: index === 0,
      leadPitch: index % 4 === 0 ? leadPitches[regionIndex * 3 + index / 4] : null,
      leadSteps: 4,
    }));
    return Object.freeze({ style, key, lift, chords: Object.freeze([...chords]), steps: Object.freeze(steps), summary, regionSteps: 12 });
  }
  const steps = Array.from({ length: 12 }, (_, index) => {
    const regionIndex = Math.floor(index / 3);
    return Object.freeze({
      chord: chords[regionIndex],
      regionIndex,
      isRegionStart: index % 3 === 0,
      leadPitch: leadPitches[index],
      leadSteps: 1,
    });
  });
  return Object.freeze({ style, key, lift, chords: Object.freeze([...chords]), steps: Object.freeze(steps), summary, regionSteps: 3 });
}

/**
 * Voices a chord for the pad: the root alone in the low register, the other
 * tones spread above it. Given the previous voicing, each upper tone takes the
 * octave nearest the previous upper voices, so chord changes glide instead of
 * jumping (simple voice leading). `lift` raises the whole register by that
 * many semitones: the key's position on the manual.
 */
export function padVoicing(chord, previous = null, lift = 0) {
  const pcs = soundingPitchClasses(chord);
  const rootPc = ((chord.rootPc % 12) + 12) % 12;
  // Keep the root below the upper voices (C3..F#3, or G2..B2 for higher keys).
  const low = UPPER_LOW + lift;
  const high = UPPER_HIGH + lift;
  // The root is the highest of its pitch class below the upper window.
  let root = PAD_ROOT_BASE + rootPc;
  while (root >= low) root -= 12;
  while (root + 12 < low) root += 12;
  const previousUpper = previous ? previous.slice(1) : null;
  const upper = [];
  for (const pc of pcs) {
    const candidates = [];
    for (let midi = low; midi < high; midi += 1) if (midi % 12 === pc) candidates.push(midi);
    let choice = candidates[0];
    if (previousUpper?.length) {
      const distance = (midi) => Math.min(...previousUpper.map((p) => Math.abs(p - midi)));
      choice = candidates.reduce((best, midi) => (distance(midi) < distance(best) ? midi : best), candidates[0]);
    }
    if (!upper.includes(choice)) upper.push(choice);
  }
  upper.sort((a, b) => a - b);
  return Object.freeze([root, ...upper]);
}

/**
 * Arpeggio notes for one loop step: `subdivisions` notes walking up and back
 * down the chord an octave above the pad, continuing across steps so the
 * figure flows through the whole loop.
 */
export function arpeggioNotes(chord, stepIndex, subdivisions = 2, lift = 0) {
  const upper = padVoicing(chord, null, lift).slice(1).map((midi) => midi + 12);
  const tones = [...upper, upper[0] + 12];
  const cycle = [...tones, ...tones.slice(1, -1).reverse()];
  return Array.from({ length: subdivisions }, (_, k) => cycle[(stepIndex * subdivisions + k) % cycle.length]);
}

/**
 * Fun Machine chords name absolute pitch classes (the C key is C), but the
 * conductor reads spine chords as intervals above the creature's tonic. This
 * shifts a chord into that frame so the band lands on the same chord the pad
 * plays instead of one transposed by the tonic.
 */
export function toTonicRelative(chord, tonicMidi) {
  const tonic = ((Math.trunc(tonicMidi) % 12) + 12) % 12;
  const shift = (pc) => (Number.isInteger(pc) ? (((pc - tonic) % 12) + 12) % 12 : pc);
  return Object.freeze({
    ...chord,
    root: shift(chord.root),
    rootPc: shift(chord.rootPc),
    third: shift(chord.third),
    fifth: shift(chord.fifth),
    seventh: shift(chord.seventh),
    ninth: shift(chord.ninth),
    pitchClasses: Object.freeze((chord.pitchClasses || []).map(shift)),
  });
}

export function leadMidi(leadPitch) {
  return LEAD_BASE + leadPitch;
}

// Steps from `stepIndex` (inclusive) to the next region start, so a pad struck
// mid-region can bridge to the chord the scheduler strikes there.
export function stepsToRegionBoundary(stepIndex) {
  const index = ((stepIndex % 12) + 12) % 12;
  return 3 - (index % 3);
}
