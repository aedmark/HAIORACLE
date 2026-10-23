// The Fun Machine's one-finger accompanist (D-028). Pure functions only: a held
// key becomes a "performance" (chords for the four 3-step regions plus an
// optional lead line), and these helpers voice it as a pad, ripple it as an
// arpeggio, or sing a line over it. The host schedules the sound in the band's
// own rhythm and re-conducts the band onto the performance's chords.

import { buildFunChord, buildFunProgression, buildTriad, genreBook } from "./conductor.mjs";
import { varySpine } from "./variation.mjs";

export const ACCOMPANIMENT_STYLES = Object.freeze(["swell", "arpeggio", "progression", "intro", "bridge", "outro"]);
export const DEFAULT_ACCOMPANIMENT_STYLE = "progression";

export const STYLE_LABELS = Object.freeze({
  swell: "SWELL",
  arpeggio: "ARPEGGIO",
  progression: "PROGRESSION",
  intro: "INTRO",
  bridge: "BRIDGE",
  outro: "OUTRO",
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
export function buildPerformance(keySemitone, style, genre, tonicRoot = 0, { pass = null, score = null, varied = false } = {}) {
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
  } else if (style === "intro" || style === "bridge" || style === "outro") {
    const section = buildFunSectionProgression(key, style, genre, tonicRoot);
    chords = section.chords;
    leadPitches = section.steps.map((step) => step.leadPitch !== null ? step.leadPitch + (position - key) : null);
    summary = section.summary;
  } else {
    const chord = buildFunChord(key, "auto", genre, tonicRoot);
    chords = [chord, chord, chord, chord];
    summary = `${chordText(chord)} · ${STYLE_LABELS[style]}`;
  }
  // On the harmonic clock (D-044) a progression holds one region per pass:
  // a pad struck on the downbeat (and again wherever a variation changes the
  // chord), and the region's three lead notes held four steps each.
  if (pass !== null && style === "progression") {
    const regionIndex = ((Math.trunc(pass) % 4) + 4) % 4;
    const { spine, moves } = varied && score ? varyProgression(chords, key, genre, score) : { spine: chords.flatMap((chord) => [chord, chord, chord]), moves: [] };
    const steps = Array.from({ length: 12 }, (_, index) => {
      const entry = regionIndex * 3 + Math.floor(index / 4);
      const chord = spine[entry];
      const previous = index > 0 ? spine[regionIndex * 3 + Math.floor((index - 1) / 4)] : null;
      let leadPitch = index % 4 === 0 ? leadPitches[entry] : null;
      // A note written for the old chord moves to the new chord's nearest tone.
      if (leadPitch !== null && chord !== chords[regionIndex]) leadPitch = nearestChordTone(leadPitch, chord);
      return Object.freeze({ chord, regionIndex, isRegionStart: chord !== previous, leadPitch, leadSteps: 4 });
    });
    const shown = spine.map(chordText).filter((text, index, all) => index === 0 || text !== all[index - 1]);
    return Object.freeze({
      style, key, lift, chords: Object.freeze([...chords]), steps: Object.freeze(steps), regionSteps: 12,
      summary: moves.length ? shown.join(" → ") : summary, variation: Object.freeze([...moves]),
    });
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
 * The creature's variation on a Fun Machine progression (D-043), by the same
 * harmony fields and genre moves as the band, except rotation (the key you
 * hold always sounds first) and harmonic pace (the pad strikes on the clock).
 * Returns twelve absolute chords (three per region) and the moves made; an
 * unchanged entry is the original chord object.
 */
function varyProgression(chords, key, genre, score) {
  const relative = chords.flatMap((chord) => {
    const root = (chord.rootPc - key + 12) % 12;
    const tones = chord.pitchClasses.map((pc) => (pc - key + 12) % 12);
    const triad = buildTriad(root, chord.quality, chord.op, tones);
    return [triad, triad, triad];
  });
  const permitted = genreBook(genre).variation.filter((move) => move !== "rotation" && move !== "harmonic_pace");
  const { spine, moves } = varySpine(relative, score, permitted, buildTriad);
  const absolute = spine.map((chord, index) => (chord === relative[index]
    ? chords[Math.floor(index / 3)]
    : buildTriad((chord.root + key) % 12, chord.quality, chord.op, chord.pitchClasses.map((pc) => (pc + key) % 12))));
  return { spine: absolute, moves };
}

function nearestChordTone(pitch, chord) {
  for (let distance = 0; distance <= 6; distance += 1) {
    for (const candidate of [pitch - distance, pitch + distance]) {
      if (chord.pitchClasses.includes(((candidate % 12) + 12) % 12)) return candidate;
    }
  }
  return pitch;
}

/**
 * Builds section-specific 4-chord progressions and 12-step lead motifs from the
 * active genre's rulebook:
 *  - intro: preparatory tonic vamp/pedal and turnaround setup leading to the downbeat.
 *  - bridge: contrasting subdominant/relative changes with secondary dominants.
 *  - outro: the genre's permitted cadence (authentic, plagal, or Phrygian) resolving to home tonic.
 */
export function buildFunSectionProgression(key, section, genre, tonicRoot = 0) {
  const r = ((Math.trunc(key) % 12) + 12) % 12;
  const book = genreBook(genre);
  const permitted = book?.variation ?? [];

  const tonicChord = buildFunChord(r, "auto", genre, tonicRoot);
  const isMinor = tonicChord.quality === "minor" || tonicChord.quality === "min9" || tonicChord.quality === "phrygian";
  const isRaw = tonicChord.quality === "raw";

  let chordRoots;
  let chordQualities;
  let melodyOffsets;
  let sectionSummary;

  if (section === "intro") {
    if (genre === "mystic_drone" || isRaw) {
      chordRoots = [r, r, r, r];
      chordQualities = ["auto", "auto", "auto", "auto"];
      melodyOffsets = [0, 7, 12, 0, 7, 14, 0, 7, 12, 7, 11, null];
      sectionSummary = `${chordText(tonicChord)} (Tonic Pedal Intro)`;
    } else {
      const ivRoot = (r + 5) % 12;
      const vRoot = (r + 7) % 12;
      const turnRoot = permitted.includes("tritone_substitution") ? (r + 1) % 12 : vRoot;
      const turnQuality = permitted.includes("tritone_substitution") ? "dom7alt" : "dom7";

      chordRoots = [r, ivRoot, r, turnRoot];
      chordQualities = ["auto", "auto", "auto", turnQuality];
      const third = isMinor ? 3 : 4;
      melodyOffsets = [
        0, third, 7,
        5, (5 + third) % 12, 12,
        12, 7, third,
        7, 11, null,
      ];
    }
  } else if (section === "bridge") {
    if (genre === "mystic_drone" || isRaw) {
      chordRoots = [r, (r + 7) % 12, (r + 5) % 12, (r + 7) % 12];
      chordQualities = ["auto", "auto", "auto", "auto"];
      melodyOffsets = [12, 14, 12, 7, 9, 7, 5, 7, 5, 7, 9, 11];
      sectionSummary = "Drone Bridge (V → IV → V)";
    } else {
      const hasRelative = permitted.includes("relative_substitution");
      const r0Root = hasRelative ? (r + (isMinor ? 3 : 9)) % 12 : (r + 5) % 12;

      const hasSecDom = permitted.includes("secondary_dominants");
      const hasModalBorrow = permitted.includes("modal_borrowing");
      let r1Root;
      let r1Quality = "auto";
      if (hasSecDom) {
        r1Root = (r + 2) % 12;
        r1Quality = "dom7";
      } else if (hasModalBorrow) {
        r1Root = (r + 8) % 12;
        r1Quality = "major";
      } else {
        r1Root = (r + 2) % 12;
      }

      const r2Root = (r + 5) % 12;
      const r3Root = (r + 7) % 12;
      const r3Quality = "dom7";

      chordRoots = [r0Root, r1Root, r2Root, r3Root];
      chordQualities = ["auto", r1Quality, "auto", r3Quality];

      const third = isMinor ? 3 : 4;
      melodyOffsets = [
        5, (5 + third) % 12, 12,
        14, 16, 14,
        12, 11, 9,
        7, 9, 11,
      ];
    }
  } else {
    // section === "outro"
    if (genre === "mystic_drone" || isRaw) {
      chordRoots = [(r + 7) % 12, (r + 5) % 12, r, r];
      chordQualities = ["auto", "auto", "auto", "auto"];
      melodyOffsets = [7, 5, 4, 2, 0, 0, 0, 0, 0, 0, 0, 0];
      sectionSummary = `${chordText(tonicChord)} (Drone Resolution)`;
    } else if (permitted.includes("phrygian_cadence")) {
      chordRoots = [(r + 5) % 12, (r + 3) % 12, (r + 1) % 12, r];
      chordQualities = ["minor", "major", "major", "auto"];
      melodyOffsets = [
        5, 7, 5,
        3, 5, 3,
        1, 3, 1,
        0, 0, 0,
      ];
    } else if (permitted.includes("plagal_cadence")) {
      chordRoots = [r, (r + 5) % 12, (r + 5) % 12, r];
      chordQualities = ["auto", "major", "major", "auto"];
      melodyOffsets = [
        0, 4, 7,
        5, 9, 12,
        9, 5, 4,
        0, 0, 0,
      ];
    } else {
      const iiRoot = (r + 2) % 12;
      const vRoot = (r + 7) % 12;
      chordRoots = [iiRoot, vRoot, vRoot, r];
      chordQualities = ["auto", "major", "dom7", "auto"];
      melodyOffsets = [
        2, 5, 9,
        7, 9, 11,
        11, 9, 7,
        0, 0, 0,
      ];
    }
  }

  const chords = chordRoots.map((root, i) => buildFunChord(root, chordQualities[i], genre, tonicRoot));
  if (!sectionSummary) {
    const shown = chords.map(chordText).join(" → ");
    sectionSummary = `${shown} (${STYLE_LABELS[section]})`;
  }

  const steps = Array.from({ length: 12 }, (_, index) => {
    const regionIndex = Math.floor(index / 3);
    const chord = chords[regionIndex];
    const offset = melodyOffsets[index];
    let leadPitch = offset === null ? null : (r + offset);
    if (leadPitch !== null && chord && chord.quality !== "raw") {
      leadPitch = nearestChordTone(leadPitch, chord);
    }
    return Object.freeze({
      chord,
      regionIndex,
      isRegionStart: index % 3 === 0,
      leadPitch,
      leadSteps: 1,
    });
  });

  return Object.freeze({
    chords: Object.freeze(chords),
    steps: Object.freeze(steps),
    summary: sectionSummary,
  });
}

/** Steps a chord struck at `stepIndex` holds before the performance strikes again. */
export function strikeLength(performance, stepIndex) {
  let length = 1;
  while (stepIndex + length < 12 && !performance.steps[stepIndex + length].isRegionStart) length += 1;
  return length;
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
