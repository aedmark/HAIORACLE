export const GENRE_RULEBOOKS = Object.freeze({
  VICTORIAN_TONNETZ: "victorian_tonnetz",
  BLUES_TWELVE_BAR: "blues_twelve_bar",
  SMOKY_JAZZ: "smoky_jazz",
  RENAISSANCE_COUNTERPOINT: "renaissance_counterpoint",
  MODAL_DRONE: "modal_drone",
  RAW_CHAOS: "raw_chaos",
});

export const GENRE_NAMES = Object.freeze({
  victorian_tonnetz: "VICTORIAN NEO-RIEMANNIAN TONNETZ",
  blues_twelve_bar: "12-BAR DELTA & PARLOR BLUES",
  smoky_jazz: "SMOKY PARLOR JAZZ & EXTENDED TONNETZ",
  renaissance_counterpoint: "PALESTRINA MODAL COUNTERPOINT",
  modal_drone: "MYSTIC BYZANTINE & HIMALAYAN DRONE",
  raw_chaos: "RAW ESOTERIC CHAOS (UNFETTERED VMS)",
});

export const GENRE_DESCRIPTIONS = Object.freeze({
  victorian_tonnetz: "Parsimonious P/L/R voice-leading across 4 harmonic regions with Euler G ≤ 8 consonance.",
  blues_twelve_bar: "Authentic I7-IV7-V7 12-bar chord matrix with walking shuffle bass and blue-note sieve.",
  smoky_jazz: "ii-V-I progressions with rootless 3rd/7th/9th guide tones, swung overtones, and chromatic approaches.",
  renaissance_counterpoint: "16th-century species counterpoint with prepared suspensions, stepwise motion, and strict G ≤ 5 consonance.",
  modal_drone: "Hypnotic root & fifth drone pedal with Phrygian dominant microtonal scale ladders and open chords.",
  raw_chaos: "Zero harmonic filtration. Raw, native, unquantized mathematical outputs from all six esoteric virtual machines.",
});

export const PITCH_NAMES = Object.freeze(["C", "C♯", "D", "E♭", "E", "F", "F♯", "G", "A♭", "A", "B♭", "B"]);

const SEMITONE_RATIOS = Object.freeze([
  [1, 1],   // 0: Unison (G = 1)
  [16, 15], // 1: Minor Second (G = 11)
  [9, 8],   // 2: Major Second (G = 8)
  [6, 5],   // 3: Minor Third (G = 8)
  [5, 4],   // 4: Major Third (G = 7)
  [4, 3],   // 5: Perfect Fourth (G = 5)
  [7, 5],   // 6: Septimal Tritone (G = 11)
  [3, 2],   // 7: Perfect Fifth (G = 4)
  [8, 5],   // 8: Minor Sixth (G = 8)
  [5, 3],   // 9: Major Sixth (G = 7)
  [9, 5],   // 10: Minor Seventh (G = 9)
  [15, 8],  // 11: Major Seventh (G = 10)
]);

const TONNETZ_PATHS = Object.freeze([
  ["R", "L", "P"],
  ["P", "R", "L"],
  ["L", "R", "P"],
  ["R", "P", "L"],
  ["L", "P", "R"],
  ["R", "L", "R"],
  ["P", "L", "R"],
  ["L", "R", "L"],
]);

const CONSONANT_CHIME_RATIOS = Object.freeze([
  { ratio: "1/1", value: 1.0 },
  { ratio: "9/8", value: 9 / 8 },
  { ratio: "6/5", value: 6 / 5 },
  { ratio: "5/4", value: 5 / 4 },
  { ratio: "4/3", value: 4 / 3 },
  { ratio: "3/2", value: 3 / 2 },
  { ratio: "5/3", value: 5 / 3 },
  { ratio: "2/1", value: 2.0 },
]);

const BLUES_CHIME_RATIOS = Object.freeze([
  { ratio: "1/1", value: 1.0 },
  { ratio: "7/6", value: 7 / 6 },
  { ratio: "6/5", value: 6 / 5 },
  { ratio: "5/4", value: 5 / 4 },
  { ratio: "4/3", value: 4 / 3 },
  { ratio: "7/5", value: 7 / 5 }, // Blue note (septimal tritone)
  { ratio: "3/2", value: 3 / 2 },
  { ratio: "7/4", value: 7 / 4 }, // Harmonic flat 7th
  { ratio: "2/1", value: 2.0 },
]);

const JAZZ_CHIME_RATIOS = Object.freeze([
  { ratio: "1/1", value: 1.0 },
  { ratio: "9/8", value: 9 / 8 },
  { ratio: "5/4", value: 5 / 4 },
  { ratio: "11/8", value: 11 / 8 }, // Sharp 11th
  { ratio: "3/2", value: 3 / 2 },
  { ratio: "13/8", value: 13 / 8 }, // Flat 13th
  { ratio: "7/4", value: 7 / 4 },
  { ratio: "2/1", value: 2.0 },
]);

const COUNTERPOINT_CHIME_RATIOS = Object.freeze([
  { ratio: "1/1", value: 1.0 },
  { ratio: "9/8", value: 9 / 8 },
  { ratio: "4/3", value: 4 / 3 },
  { ratio: "3/2", value: 3 / 2 },
  { ratio: "16/9", value: 16 / 9 },
  { ratio: "2/1", value: 2.0 },
]);

const MODAL_DRONE_CHIME_RATIOS = Object.freeze([
  { ratio: "1/1", value: 1.0 },
  { ratio: "9/8", value: 9 / 8 },
  { ratio: "5/4", value: 5 / 4 },
  { ratio: "4/3", value: 4 / 3 },
  { ratio: "3/2", value: 3 / 2 },
  { ratio: "7/4", value: 7 / 4 },
  { ratio: "2/1", value: 2.0 },
]);

function gcd(a, b) {
  let x = Math.abs(Math.trunc(a));
  let y = Math.abs(Math.trunc(b));
  while (y !== 0) {
    const t = y;
    y = x % y;
    x = t;
  }
  return x || 1;
}

/**
 * Leonhard Euler's 1739 Gradus Suavitatis ("Degree of Sweetness / Consonance"):
 * G(n) = 1 + sum(e_i * (p_i - 1)) for prime factorization of lcm(p, q) in lowest terms.
 */
export function eulerGradus(numerator, denominator = 1) {
  const p = Math.max(1, Math.abs(Math.trunc(numerator)));
  const q = Math.max(1, Math.abs(Math.trunc(denominator)));
  const div = gcd(p, q);
  let n = (p / div) * (q / div);
  let sum = 1;
  let factor = 2;
  while (factor * factor <= n) {
    while (n % factor === 0) {
      sum += factor - 1;
      n = Math.trunc(n / factor);
    }
    factor += 1;
  }
  if (n > 1) {
    sum += n - 1;
  }
  return sum;
}

export function semitoneGradus(semitones) {
  const pc = ((Math.trunc(semitones) % 12) + 12) % 12;
  const [p, q] = SEMITONE_RATIOS[pc];
  return eulerGradus(p, q);
}

export const SEMITONE_GRADUS = Object.freeze(
  Array.from({ length: 12 }, (_, i) => semitoneGradus(i)),
);

/**
 * Neo-Riemannian Tonnetz P (Parallel), L (Leading-Tone), and R (Relative) operators.
 * Each transformation preserves exactly two of the three triad pitch classes.
 */
export function applyTonnetzOperation(triad, op) {
  const root = ((triad.root % 12) + 12) % 12;
  const isMajor = triad.quality === "major";
  let nextRoot = root;
  let nextQuality = triad.quality;

  if (op === "P") {
    nextQuality = isMajor ? "minor" : "major";
  } else if (op === "L") {
    if (isMajor) {
      nextRoot = (root + 4) % 12;
      nextQuality = "minor";
    } else {
      nextRoot = (root + 8) % 12;
      nextQuality = "major";
    }
  } else if (op === "R") {
    if (isMajor) {
      nextRoot = (root + 9) % 12;
      nextQuality = "minor";
    } else {
      nextRoot = (root + 3) % 12;
      nextQuality = "major";
    }
  }

  return buildTriad(nextRoot, nextQuality, op);
}

export function buildTriad(root, quality = "minor", op = "I", customPcs = null) {
  const r = ((root % 12) + 12) % 12;
  let thirdOffset = 3;
  let seventhOffset = 10;
  if (quality === "major" || quality === "dom7" || quality === "maj9") {
    thirdOffset = 4;
  }
  if (quality === "major" || quality === "maj9") {
    seventhOffset = 11;
  }

  const third = (r + thirdOffset) % 12;
  const fifth = (r + 7) % 12;
  const seventh = (r + seventhOffset) % 12;
  const ninth = (r + 2) % 12;
  const pitchClasses = customPcs
    ? Object.freeze([...customPcs].map((pc) => ((pc % 12) + 12) % 12))
    : Object.freeze([r, third, fifth]);

  return Object.freeze({
    root: r,
    name: PITCH_NAMES[r],
    rootPc: r,
    quality,
    op,
    third,
    fifth,
    seventh,
    ninth,
    pitchClasses,
  });
}

export function chordLabelFor(chord, tonicMidi = 60) {
  if (!chord || chord.quality === "raw") return "RAW VM OUTPUT";
  const absRoot = (((tonicMidi + chord.root) % 12) + 12) % 12;
  const name = PITCH_NAMES[absRoot];
  if (chord.quality === "major") return `${name} Maj`;
  if (chord.quality === "minor") return `${name} min`;
  if (chord.quality === "dom7") return `${name}7`;
  if (chord.quality === "maj9") return `${name}maj9`;
  if (chord.quality === "min9") return `${name}min9`;
  if (chord.quality === "dom7alt") return `${name}7alt`;
  if (chord.quality === "modal_open") return `${name}5 (Open)`;
  if (chord.quality === "phrygian") return `${name} Phryg`;
  if (chord.quality === "lydian") return `${name} Lyd`;
  return `${name} ${chord.quality}`;
}

export const CHORD_QUALITIES = Object.freeze({
  AUTO: "auto",
  MAJOR: "major",
  MINOR: "minor",
  DOM7: "dom7",
  MAJ9: "maj9",
  DIM: "dim",
  OPEN5: "modal_open",
});

export const FUN_KEY_MAP = Object.freeze([
  { semitone: 0, note: "C", isBlack: false, key: "KeyA", displayKey: "A" },
  { semitone: 1, note: "C♯", isBlack: true, key: "KeyW", displayKey: "W" },
  { semitone: 2, note: "D", isBlack: false, key: "KeyS", displayKey: "S" },
  { semitone: 3, note: "D♯", isBlack: true, key: "KeyE", displayKey: "E" },
  { semitone: 4, note: "E", isBlack: false, key: "KeyD", displayKey: "D" },
  { semitone: 5, note: "F", isBlack: false, key: "KeyF", displayKey: "F" },
  { semitone: 6, note: "F♯", isBlack: true, key: "KeyT", displayKey: "T" },
  { semitone: 7, note: "G", isBlack: false, key: "KeyG", displayKey: "G" },
  { semitone: 8, note: "G♯", isBlack: true, key: "KeyY", displayKey: "Y" },
  { semitone: 9, note: "A", isBlack: false, key: "KeyH", displayKey: "H" },
  { semitone: 10, note: "A♯", isBlack: true, key: "KeyU", displayKey: "U" },
  { semitone: 11, note: "B", isBlack: false, key: "KeyJ", displayKey: "J" },
  { semitone: 12, note: "C'", isBlack: false, key: "KeyK", displayKey: "K" },
]);

export const FUN_KEY_BY_CODE = Object.freeze(
  Object.fromEntries(FUN_KEY_MAP.map((item) => [item.key, item])),
);

export const FUN_KEY_BY_KEY = Object.freeze(
  Object.fromEntries(FUN_KEY_MAP.map((item) => [item.displayKey, item])),
);

export function buildFunChord(rootSemitone, quality = "auto", genre = GENRE_RULEBOOKS.VICTORIAN_TONNETZ, tonicRoot = 0) {
  const r = ((Math.trunc(rootSemitone) % 12) + 12) % 12;
  const relFromTonic = ((r - (Math.trunc(tonicRoot) % 12)) % 12 + 12) % 12;
  let resolvedQuality = quality;

  if (quality === "auto" || !quality) {
    switch (genre) {
      case GENRE_RULEBOOKS.BLUES_TWELVE_BAR:
        resolvedQuality = "dom7";
        break;
      case GENRE_RULEBOOKS.SMOKY_JAZZ:
        resolvedQuality = [0, 5].includes(relFromTonic) ? "maj9"
          : [1, 6, 11].includes(relFromTonic) ? "dom7alt"
          : "min9";
        break;
      case GENRE_RULEBOOKS.MODAL_DRONE:
        resolvedQuality = relFromTonic === 1 ? "phrygian"
          : relFromTonic === 6 ? "lydian"
          : "modal_open";
        break;
      case GENRE_RULEBOOKS.RENAISSANCE_COUNTERPOINT:
        resolvedQuality = [0, 2, 5, 7, 9].includes(relFromTonic) ? "minor" : "major";
        break;
      case GENRE_RULEBOOKS.RAW_CHAOS:
        resolvedQuality = "raw";
        break;
      case GENRE_RULEBOOKS.VICTORIAN_TONNETZ:
      default:
        resolvedQuality = [0, 5, 7].includes(relFromTonic) ? "major" : "minor";
        break;
    }
  }

  let customPcs = null;
  if (resolvedQuality === "dom7") {
    customPcs = [r, (r + 4) % 12, (r + 7) % 12, (r + 10) % 12];
  } else if (resolvedQuality === "maj9") {
    customPcs = [r, (r + 4) % 12, (r + 7) % 12, (r + 11) % 12, (r + 2) % 12];
  } else if (resolvedQuality === "min9") {
    customPcs = [r, (r + 3) % 12, (r + 7) % 12, (r + 10) % 12, (r + 2) % 12];
  } else if (resolvedQuality === "dom7alt") {
    customPcs = [r, (r + 4) % 12, (r + 7) % 12, (r + 10) % 12, (r + 1) % 12];
  } else if (resolvedQuality === "dim") {
    customPcs = [r, (r + 3) % 12, (r + 6) % 12, (r + 9) % 12];
  } else if (resolvedQuality === "modal_open") {
    customPcs = [r, (r + 7) % 12, (r + 2) % 12];
  } else if (resolvedQuality === "phrygian") {
    customPcs = [r, (r + 1) % 12, (r + 4) % 12, (r + 7) % 12];
  } else if (resolvedQuality === "lydian") {
    customPcs = [r, (r + 6) % 12, (r + 7) % 12, (r + 11) % 12];
  } else if (resolvedQuality === "minor") {
    customPcs = [r, (r + 3) % 12, (r + 7) % 12];
  } else if (resolvedQuality === "raw") {
    customPcs = [];
  } else {
    resolvedQuality = "major";
    customPcs = [r, (r + 4) % 12, (r + 7) % 12];
  }

  const name = PITCH_NAMES[r];
  const opLabel = `FUN·${name}`;
  const triad = buildTriad(r, resolvedQuality, opLabel, customPcs);
  return Object.freeze({
    ...triad,
    name,
    rootPc: r,
  });
}

export function buildFunProgression(rootSemitone, quality = "auto", genre = GENRE_RULEBOOKS.VICTORIAN_TONNETZ, tonicRoot = 0) {
  const r = ((Math.trunc(rootSemitone) % 12) + 12) % 12;
  const relFromTonic = ((r - (Math.trunc(tonicRoot) % 12)) % 12 + 12) % 12;

  let chordDefs = [];
  let summary = "";

  if (quality === "dom7" || (quality === "auto" && genre === GENRE_RULEBOOKS.BLUES_TWELVE_BAR)) {
    // 12-Bar Blues Riff Progression: I7 -> IV7 -> V7 -> I7 Turnaround
    const sub = (r + 5) % 12;
    const dom = (r + 7) % 12;
    chordDefs = [
      { root: r, quality: "dom7", melodyOffsets: [0, 4, 7] },
      { root: sub, quality: "dom7", melodyOffsets: [5, 3, 5] },
      { root: dom, quality: "dom7", melodyOffsets: [7, 6, 7] },
      { root: r, quality: "dom7", melodyOffsets: [10, 7, 6] },
    ];
    summary = `${PITCH_NAMES[r]}7 → ${PITCH_NAMES[sub]}7 → ${PITCH_NAMES[dom]}7 → ${PITCH_NAMES[r]}7`;
  } else if (quality === "maj9" || (quality === "auto" && genre === GENRE_RULEBOOKS.SMOKY_JAZZ)) {
    // Smoky Jazz ii-V-I-VI turnaround: Imaj9 -> vi9 -> ii9 -> V7alt
    const vi = (r + 9) % 12;
    const ii = (r + 2) % 12;
    const v = (r + 7) % 12;
    chordDefs = [
      { root: r, quality: "maj9", melodyOffsets: [14, 11, 7] },
      { root: vi, quality: "min9", melodyOffsets: [11, 7, 3] },
      { root: ii, quality: "min9", melodyOffsets: [4, 0, 5] },
      { root: v, quality: "dom7alt", melodyOffsets: [8, 5, 0] },
    ];
    summary = `${PITCH_NAMES[r]}maj9 → ${PITCH_NAMES[vi]}m9 → ${PITCH_NAMES[ii]}m9 → ${PITCH_NAMES[v]}7alt`;
  } else if (quality === "modal_open" || (quality === "auto" && genre === GENRE_RULEBOOKS.MODAL_DRONE)) {
    // Mystic Modal Drone Progression: Open 5th -> Phrygian -> Lydian -> Harmonic 7th
    chordDefs = [
      { root: r, quality: "modal_open", melodyOffsets: [0, 7, 12] },
      { root: r, quality: "phrygian", melodyOffsets: [1, 4, 7] },
      { root: r, quality: "lydian", melodyOffsets: [6, 7, 11] },
      { root: r, quality: "modal_open", melodyOffsets: [10, 7, 0] },
    ];
    summary = `${PITCH_NAMES[r]} Drone → Phryg → Lydian → 7th`;
  } else if (quality === "minor" || (quality === "auto" && (genre === GENRE_RULEBOOKS.RENAISSANCE_COUNTERPOINT || (![0, 5, 7].includes(relFromTonic) && genre === GENRE_RULEBOOKS.VICTORIAN_TONNETZ)))) {
    // Minor Progression: i -> VI -> iv -> V
    const vi = (r + 8) % 12;
    const iv = (r + 5) % 12;
    const v = (r + 7) % 12;
    chordDefs = [
      { root: r, quality: "minor", melodyOffsets: [0, 3, 7] },
      { root: vi, quality: "major", melodyOffsets: [8, 12, 8] },
      { root: iv, quality: "minor", melodyOffsets: [5, 8, 12] },
      { root: v, quality: "major", melodyOffsets: [7, 11, 14] },
    ];
    summary = `${PITCH_NAMES[r]}m → ${PITCH_NAMES[vi]} Maj → ${PITCH_NAMES[iv]}m → ${PITCH_NAMES[v]} Maj`;
  } else if (quality === "dim") {
    // Symmetrical Diminished Circle
    const d1 = (r + 3) % 12;
    const d2 = (r + 6) % 12;
    const d3 = (r + 9) % 12;
    chordDefs = [
      { root: r, quality: "dim", melodyOffsets: [0, 3, 6] },
      { root: d1, quality: "dim", melodyOffsets: [3, 6, 9] },
      { root: d2, quality: "dim", melodyOffsets: [6, 9, 12] },
      { root: d3, quality: "dim", melodyOffsets: [9, 6, 3] },
    ];
    summary = `${PITCH_NAMES[r]}° → ${PITCH_NAMES[d1]}° → ${PITCH_NAMES[d2]}° → ${PITCH_NAMES[d3]}°`;
  } else {
    // Classic Victorian & Parlor Major Progression: I -> vi -> IV -> V (Baldwin Heart & Soul Vamp)
    const vi = (r + 9) % 12;
    const iv = (r + 5) % 12;
    const v = (r + 7) % 12;
    chordDefs = [
      { root: r, quality: "major", melodyOffsets: [0, 4, 7] },
      { root: vi, quality: "minor", melodyOffsets: [9, 12, 9] },
      { root: iv, quality: "major", melodyOffsets: [5, 9, 12] },
      { root: v, quality: "major", melodyOffsets: [7, 11, 14] },
    ];
    summary = `${PITCH_NAMES[r]} Maj → ${PITCH_NAMES[vi]}m → ${PITCH_NAMES[iv]} Maj → ${PITCH_NAMES[v]} Maj`;
  }

  const chords = chordDefs.map((def) => buildFunChord(def.root, def.quality, genre, tonicRoot));

  const steps = [];
  for (let i = 0; i < 12; i += 1) {
    const regionIdx = Math.floor(i / 3) % 4;
    const subIdx = i % 3;
    const def = chordDefs[regionIdx];
    const chord = chords[regionIdx];
    const offset = def.melodyOffsets[subIdx];
    const melodyPitch = r + offset;
    const melodyNote = PITCH_NAMES[melodyPitch % 12];

    steps.push(Object.freeze({
      stepIndex: i,
      regionIndex: regionIdx,
      chord,
      melodyPitch,
      melodyNote,
      isRegionStart: subIdx === 0,
      stepLabel: `${chord.name} ${chord.quality === "major" ? "Maj" : chord.quality === "minor" ? "min" : chord.quality.toUpperCase()}`,
    }));
  }

  return Object.freeze({
    rootPc: r,
    summary,
    chords: Object.freeze(chords),
    steps: Object.freeze(steps),
  });
}

/**
 * E. Bjorklund's (2003) Euclidean Rhythm algorithm E(pulses, steps).
 */
export function bjorklund(pulses, steps = 12, rotation = 0) {
  const n = Math.max(1, Math.trunc(steps));
  const k = Math.max(0, Math.min(n, Math.trunc(pulses)));
  if (k === 0) return Object.freeze(Array(n).fill(0));
  if (k === n) return Object.freeze(Array(n).fill(1));

  const pattern = Array.from({ length: n }, (_, index) => (
    ((index * k) % n) < k ? 1 : 0
  ));
  const rot = ((Math.trunc(rotation) % n) + n) % n;
  return Object.freeze(Array.from({ length: n }, (_, index) => pattern[(index - rot + n) % n]));
}

function initialQualityForScore(score) {
  const majorScales = new Set([1, 4, 7]);
  const majorMotifs = new Set([1, 4, 8, 9]);
  if (majorMotifs.has(score.melodyMode)) return "major";
  if (score.melodyMode === 0 && majorScales.has(score.scale)) return "major";
  return "minor";
}

export function buildTonnetzSpine(score, mutation = 0) {
  const pathIndex = ((score.harmonyMode ?? 0) + (score.scale ?? 0) + mutation) % TONNETZ_PATHS.length;
  const ops = TONNETZ_PATHS[pathIndex];
  const tonicQuality = initialQualityForScore(score);
  const chords = [buildTriad(0, tonicQuality, "I")];
  for (const op of ops) {
    chords.push(applyTonnetzOperation(chords[chords.length - 1], op));
  }
  // 12 steps grouped into 4 harmonic regions of 3 steps each
  return Object.freeze(Array.from({ length: 12 }, (_, stepIndex) => chords[Math.floor(stepIndex / 3) % 4]));
}

export function buildBluesSpine(score, mutation = 0) {
  const root = 0;
  const sub = (root + 5) % 12; // IV
  const dom = (root + 7) % 12; // V

  const chordI = buildTriad(root, "dom7", "I7", [root, (root + 4) % 12, (root + 7) % 12, (root + 10) % 12]);
  const chordIV = buildTriad(sub, "dom7", "IV7", [sub, (sub + 4) % 12, (sub + 7) % 12, (sub + 10) % 12]);
  const chordV = buildTriad(dom, "dom7", "V7", [dom, (dom + 4) % 12, (dom + 7) % 12, (dom + 10) % 12]);
  const chordTurn = buildTriad(dom, "dom7", "V7 (Turn)", [dom, (dom + 4) % 12, (dom + 7) % 12, (dom + 10) % 12]);

  // Standard 12-bar blues layout across 12 steps
  const progression = [
    chordI, chordI, chordI, chordI, // Steps 0-3: I7
    chordIV, chordIV,               // Steps 4-5: IV7
    chordI, chordI,                 // Steps 6-7: I7
    chordV,                         // Step 8: V7
    chordIV,                        // Step 9: IV7
    chordI,                         // Step 10: I7
    chordTurn,                      // Step 11: Turnaround V7
  ];
  return Object.freeze(progression);
}

export function buildJazzSpine(score, mutation = 0) {
  const root = 0;
  const chordImaj9 = buildTriad(root, "maj9", "Imaj9", [root, (root + 4) % 12, (root + 7) % 12, (root + 11) % 12, (root + 2) % 12]);
  const viRoot = (root + 9) % 12;
  const chordVi9 = buildTriad(viRoot, "min9", "vi9", [viRoot, (viRoot + 3) % 12, (viRoot + 7) % 12, (viRoot + 10) % 12, (viRoot + 2) % 12]);
  const iiRoot = (root + 2) % 12;
  const chordIi9 = buildTriad(iiRoot, "min9", "ii9", [iiRoot, (iiRoot + 3) % 12, (iiRoot + 7) % 12, (iiRoot + 10) % 12, (iiRoot + 2) % 12]);
  const tritoneSubRoot = (root + 1) % 12; // Flat II7 tritone sub
  const chordSubV7 = buildTriad(tritoneSubRoot, "dom7alt", "♭II7alt", [tritoneSubRoot, (tritoneSubRoot + 4) % 12, (tritoneSubRoot + 7) % 12, (tritoneSubRoot + 10) % 12]);

  const progression = [
    chordImaj9, chordImaj9, chordImaj9,
    chordVi9, chordVi9, chordVi9,
    chordIi9, chordIi9, chordIi9,
    chordSubV7, chordSubV7, chordSubV7,
  ];
  return Object.freeze(progression);
}

export function buildCounterpointSpine(score, mutation = 0) {
  const root = 0;
  const sub = (root + 5) % 12;
  const dom = (root + 7) % 12;

  const chordI = buildTriad(root, "minor", "i (Tonic)", [root, (root + 3) % 12, (root + 7) % 12]);
  const chordIV = buildTriad(sub, "minor", "iv (Susp 4-3)", [sub, (sub + 3) % 12, (sub + 7) % 12]);
  const chordV = buildTriad(dom, "minor", "v (Susp 7-6)", [dom, (dom + 3) % 12, (dom + 7) % 12]);
  const chordPicardy = buildTriad(root, "major", "I (Picardy Cadence)", [root, (root + 4) % 12, (root + 7) % 12]);

  const progression = [
    chordI, chordI, chordI,
    chordIV, chordIV, chordIV,
    chordV, chordV, chordV,
    chordI, chordI, chordPicardy,
  ];
  return Object.freeze(progression);
}

export function buildModalDroneSpine(score, mutation = 0) {
  const root = 0;
  const droneOpen = buildTriad(root, "modal_open", "Tonic 1-5 Drone", [root, (root + 7) % 12, (root + 2) % 12]);
  const dronePhryg = buildTriad(root, "phrygian", "Phrygian Inflection", [root, (root + 1) % 12, (root + 4) % 12, (root + 7) % 12]);
  const droneLyd = buildTriad(root, "lydian", "Lydian Mystic (#4)", [root, (root + 6) % 12, (root + 7) % 12, (root + 11) % 12]);
  const droneSept = buildTriad(root, "modal_open", "Harmonic 7th Return", [root, (root + 7) % 12, (root + 10) % 12]);

  const progression = [
    droneOpen, droneOpen, droneOpen,
    dronePhryg, dronePhryg, dronePhryg,
    droneLyd, droneLyd, droneLyd,
    droneSept, droneSept, droneSept,
  ];
  return Object.freeze(progression);
}

export function buildRawChaosSpine(score) {
  const rawChord = Object.freeze({
    root: 0,
    quality: "raw",
    op: "RAW VM",
    third: 4,
    fifth: 7,
    seventh: 10,
    ninth: 2,
    pitchClasses: Object.freeze([]),
  });
  return Object.freeze(Array(12).fill(rawChord));
}

export function buildGenreSpine(genre, score, mutation = 0) {
  switch (genre) {
    case GENRE_RULEBOOKS.BLUES_TWELVE_BAR:
      return buildBluesSpine(score, mutation);
    case GENRE_RULEBOOKS.SMOKY_JAZZ:
      return buildJazzSpine(score, mutation);
    case GENRE_RULEBOOKS.RENAISSANCE_COUNTERPOINT:
      return buildCounterpointSpine(score, mutation);
    case GENRE_RULEBOOKS.MODAL_DRONE:
      return buildModalDroneSpine(score, mutation);
    case GENRE_RULEBOOKS.RAW_CHAOS:
      return buildRawChaosSpine(score);
    case GENRE_RULEBOOKS.VICTORIAN_TONNETZ:
    default:
      return buildTonnetzSpine(score, mutation);
  }
}

/**
 * Projects an arbitrary semitone interval onto the nearest pitch that is consonant
 * (low Euler Gradus Suavitatis) with the active Tonnetz or genre chord.
 */
export function projectConsonantPitch(rawSemitone, chord, allowPassing = false, maxGradus = 8, genre = GENRE_RULEBOOKS.VICTORIAN_TONNETZ) {
  if (genre === GENRE_RULEBOOKS.RAW_CHAOS || !chord || chord.quality === "raw") {
    return rawSemitone;
  }

  const octave = Math.floor(rawSemitone / 12) * 12;
  const pc = ((Math.trunc(rawSemitone) % 12) + 12) % 12;

  if (genre === GENRE_RULEBOOKS.BLUES_TWELVE_BAR) {
    // 6-note authentic delta blues scale relative to chord root:
    // [root, b3 (3), 4 (5), b5 Blue Note (6), 5 (7), b7 (10)]
    // If strictness <= 5, lock to strong blues chord tones; if > 5, fully express dirty blue notes!
    const bluesPcs = maxGradus <= 5
      ? [chord.root, (chord.root + 4) % 12, (chord.root + 7) % 12, (chord.root + 10) % 12]
      : [chord.root, (chord.root + 3) % 12, (chord.root + 5) % 12, (chord.root + 6) % 12, (chord.root + 7) % 12, (chord.root + 10) % 12];
    let bestPc = bluesPcs[0];
    let minDiff = 999;
    for (const bpc of bluesPcs) {
      const diff = Math.min(Math.abs(pc - bpc), 12 - Math.abs(pc - bpc));
      if (diff < minDiff) {
        minDiff = diff;
        bestPc = bpc;
      }
    }
    return octave + bestPc;
  }

  if (genre === GENRE_RULEBOOKS.SMOKY_JAZZ) {
    // Smoky jazz: chord tones + extended 9th, 11th, and chromatic approach tones
    const jazzPcs = [
      chord.root,
      chord.third,
      chord.fifth,
      chord.seventh,
      chord.ninth,
      (chord.root + 5) % 12, // 11th
      (chord.root + 9) % 12, // 13th
    ];
    let bestPc = jazzPcs[0];
    let minDiff = 999;
    for (const jpc of jazzPcs) {
      const diff = Math.min(Math.abs(pc - jpc), 12 - Math.abs(pc - jpc));
      if (diff < minDiff) {
        minDiff = diff;
        bestPc = jpc;
      }
    }
    return octave + bestPc;
  }

  if (genre === GENRE_RULEBOOKS.MODAL_DRONE) {
    // Modal drone: open fifths, Phrygian flat-2, and Lydian sharp-4
    const modalPcs = chord.pitchClasses;
    let bestPc = modalPcs[0];
    let minDiff = 999;
    for (const mpc of modalPcs) {
      const diff = Math.min(Math.abs(pc - mpc), 12 - Math.abs(pc - mpc));
      if (diff < minDiff) {
        minDiff = diff;
        bestPc = mpc;
      }
    }
    return octave + bestPc;
  }

  // Victorian Tonnetz & Renaissance Counterpoint: Euler Gradus Consonance Sieve
  const relPc = ((pc - chord.root) % 12 + 12) % 12;
  const rawG = SEMITONE_GRADUS[relPc];

  // If the raw note is already sufficiently consonant under maxGradus, keep it!
  if (rawG <= maxGradus && (allowPassing || chord.pitchClasses.includes(pc))) {
    return octave + pc;
  }

  // Otherwise pull to the closest consonant pitch class that satisfies maxGradus
  let bestPc = chord.root;
  let minCost = Infinity;
  for (let c = 0; c < 12; c += 1) {
    const candRel = ((c - chord.root) % 12 + 12) % 12;
    const g = SEMITONE_GRADUS[candRel];
    if (g <= maxGradus) {
      const dist = Math.min(Math.abs(pc - c), 12 - Math.abs(pc - c));
      const isChordTone = chord.pitchClasses.includes(c);
      const penalty = isChordTone ? 0 : 0.6;
      const cost = dist * 2.2 + g * 0.2 + penalty;
      if (cost < minCost) {
        minCost = cost;
        bestPc = c;
      }
    }
  }
  return octave + bestPc;
}

/**
 * Conducts and harmonizes all six esoteric bandmates under the selected Kapellmeister
 * music-theory rulebook, Euler Gradus consonance sieve, and Euclidean rhythm hockets.
 */
export function conductEnsemble({
  score,
  melody,
  beat,
  bass,
  harmony,
  chimes,
  chant,
  mutation = 0,
  genre = GENRE_RULEBOOKS.VICTORIAN_TONNETZ,
  consonanceStrictness = 8,
  parsimonyRadius = 2,
  customSpine = null,
}) {
  const activeGenre = Object.values(GENRE_RULEBOOKS).includes(genre)
    ? genre
    : GENRE_RULEBOOKS.VICTORIAN_TONNETZ;

  if (activeGenre === GENRE_RULEBOOKS.RAW_CHAOS && !customSpine) {
    const spine = buildRawChaosSpine(score);
    return Object.freeze({
      spine,
      melody: Object.freeze([...melody]),
      beat,
      bass,
      harmony,
      chimes,
      chant,
      genre: activeGenre,
      genreName: GENRE_NAMES[activeGenre],
      consonanceStrictness,
    });
  }

  const baseSpine = activeGenre === GENRE_RULEBOOKS.RAW_CHAOS
    ? buildRawChaosSpine(score)
    : buildGenreSpine(activeGenre, score, mutation);
  const spine = customSpine
    ? Object.freeze(baseSpine.map((chord, i) => customSpine[i] || chord))
    : baseSpine;
  const leadMask = bjorklund(7, 12, score.melodyTurn % 12);
  const chimeHocketMask = bjorklund(5, 12, (score.melodyTurn + 2) % 12);

  // 1. Harmonize LOLCODE Lead Melody
  const conductedMelody = Object.freeze(
    melody.map((rawOffset, stepIndex) => {
      const chord = spine[stepIndex];
      const isStrongBeat = stepIndex % 3 === 0;
      return projectConsonantPitch(rawOffset, chord, !isStrongBeat, consonanceStrictness, activeGenre);
    }),
  );

  // 2. Lock Brainfuck Bassline to Genre Ostinato
  const conductedBass = bass
    ? Object.freeze({
      ...bass,
      steps: Object.freeze(
        bass.steps.map((step, stepIndex) => {
          const chord = spine[stepIndex];
          const beatStep = beat?.steps?.[stepIndex];
          const isRegionStart = stepIndex % 3 === 0;
          const kickActive = (beatStep?.kick ?? 0) > 0;
          let harmonizedInterval = chord.root;

          if (activeGenre === GENRE_RULEBOOKS.BLUES_TWELVE_BAR) {
            // 12-bar walking blues bass sequence following chord progression
            const bluesDegrees = [0, 4, 7, 9, 0, 4, 0, 7, 0, 0, 0, 0];
            const deg = bluesDegrees[stepIndex % bluesDegrees.length];
            harmonizedInterval = (chord.root + deg) % 12;
          } else if (activeGenre === GENRE_RULEBOOKS.SMOKY_JAZZ) {
            // Walking jazz upright acoustic line with chromatic approach tones
            const jazzDegrees = [0, 4, 10, 0, 7, 3, 0, 5, 0, 0, 7, 11];
            const deg = jazzDegrees[stepIndex % jazzDegrees.length];
            harmonizedInterval = (chord.root + deg) % 12;
          } else if (activeGenre === GENRE_RULEBOOKS.MODAL_DRONE) {
            // Sustained sub-bass pedal on tonic root or 5th
            harmonizedInterval = stepIndex % 4 === 3 ? (chord.root + 7) % 12 : chord.root;
          } else if (activeGenre === GENRE_RULEBOOKS.RENAISSANCE_COUNTERPOINT) {
            // Modal cantus firmus contrary motion to melody
            const mel = conductedMelody[stepIndex] % 12;
            const choices = chord.pitchClasses.filter((pc) => Math.abs(pc - mel) % 12 !== 7);
            harmonizedInterval = choices.length > 0 ? choices[(step.cell + stepIndex) % choices.length] : chord.root;
          } else {
            // Victorian Tonnetz default
            const bassChoices = isRegionStart
              ? [chord.root, chord.root, chord.fifth]
              : [chord.root, chord.fifth, chord.third, chord.root];
            harmonizedInterval = bassChoices[(step.cell + stepIndex) % bassChoices.length];
          }

          const gate = (activeGenre === GENRE_RULEBOOKS.BLUES_TWELVE_BAR || activeGenre === GENRE_RULEBOOKS.SMOKY_JAZZ || activeGenre === GENRE_RULEBOOKS.MODAL_DRONE)
            ? Math.max(1, step.gate)
            : (isRegionStart && kickActive ? Math.max(1, step.gate) : step.gate);
          const noteName = PITCH_NAMES[(((score.root + harmonizedInterval) % 12) + 12) % 12];
          const regMark = step.register > 0 ? "+" : "";
          const slideMark = step.slide ? "~" : "";
          const bassLabel = gate === 0 ? "REST" : `${noteName}${regMark}${slideMark}`;

          return Object.freeze({
            ...step,
            gate,
            interval: harmonizedInterval,
            label: bassLabel,
          });
        }),
      ),
    })
    : null;

  // 3. Voice Befunge-93 2D Mirror Chord Organ
  const conductedHarmony = harmony
    ? Object.freeze({
      ...harmony,
      steps: Object.freeze(
        harmony.steps.map((step, stepIndex) => {
          const chord = spine[stepIndex];
          let voiced = [];

          if (activeGenre === GENRE_RULEBOOKS.BLUES_TWELVE_BAR) {
            // Crunchy dominant 7th voicings (3rd, 5th, b7th)
            voiced = [chord.third, chord.fifth, chord.seventh].sort((a, b) => a - b);
          } else if (activeGenre === GENRE_RULEBOOKS.SMOKY_JAZZ) {
            // Rootless guide-tone voicings (3rd, b7th, 9th)
            voiced = [chord.third, chord.seventh, chord.ninth].sort((a, b) => a - b);
          } else if (activeGenre === GENRE_RULEBOOKS.MODAL_DRONE) {
            // Open 5th and 4th drone pads
            voiced = [chord.root, chord.fifth, (chord.root + 12)].sort((a, b) => a - b);
          } else {
            // Standard triadic voicing with inversions
            const inversion = (step.raw + stepIndex) % 3;
            const baseChord = [chord.root, chord.third, chord.fifth];
            voiced = baseChord.map((pc, idx) => (
              idx < inversion ? pc + 12 : pc
            )).sort((a, b) => a - b);
          }

          const orderedChord = step.mirror === "/" ? voiced : [...voiced].reverse();
          const absChordRoot = (((score.root + chord.root) % 12) + 12) % 12;
          const rootName = PITCH_NAMES[absChordRoot];
          const qualityShort = chord.quality === "major" ? ""
            : chord.quality === "minor" ? "m"
            : chord.quality === "dom7" ? "7"
            : chord.quality === "maj9" ? "M9"
            : chord.quality === "min9" ? "m9"
            : chord.quality === "dom7alt" ? "7alt"
            : chord.quality === "modal_open" ? "5"
            : chord.quality === "phrygian" ? "phr"
            : chord.quality === "lydian" ? "lyd"
            : "";
          const harmonyLabel = step.gate === 0 ? "REST" : `${rootName}${qualityShort}${step.mirror}`;

          return Object.freeze({
            ...step,
            chord: Object.freeze(orderedChord),
            label: harmonyLabel,
          });
        }),
      ),
    })
    : null;

  // 4. Lock Piet/FRACTRAN Chimes to Genre Overtones & Euclidean Hockets
  const conductedChimes = chimes
    ? Object.freeze({
      ...chimes,
      steps: Object.freeze(
        chimes.steps.map((step, stepIndex) => {
          const chord = spine[stepIndex];
          let ratios = CONSONANT_CHIME_RATIOS;
          if (activeGenre === GENRE_RULEBOOKS.BLUES_TWELVE_BAR) {
            ratios = BLUES_CHIME_RATIOS;
          } else if (activeGenre === GENRE_RULEBOOKS.SMOKY_JAZZ) {
            ratios = JAZZ_CHIME_RATIOS;
          } else if (activeGenre === GENRE_RULEBOOKS.RENAISSANCE_COUNTERPOINT) {
            ratios = COUNTERPOINT_CHIME_RATIOS;
          } else if (activeGenre === GENRE_RULEBOOKS.MODAL_DRONE) {
            ratios = MODAL_DRONE_CHIME_RATIOS;
          }

          const chosen = ratios[(step.hueIndex + step.exponents.e2 + step.exponents.e3 + stepIndex) % ratios.length];
          const chordRootFactor = Math.pow(2, chord.root / 12);
          const hocketGate = step.gate > 0 && (chimeHocketMask[stepIndex] === 1 || leadMask[stepIndex] === 0 || stepIndex % 3 === 0)
            ? step.gate
            : (step.gate === 2 ? 1 : 0);
          return Object.freeze({
            ...step,
            gate: hocketGate,
            ratioLabel: chosen.ratio,
            ratioValue: Number((chosen.value * chordRootFactor).toFixed(4)),
            label: hocketGate === 0 ? "REST" : `${chosen.ratio} ${step.codelCode}`,
          });
        }),
      ),
    })
    : null;

  // 5. Lock Shakespeare Formant Choir to Genre Harmonies
  const conductedChant = chant
    ? Object.freeze({
      ...chant,
      steps: Object.freeze(
        chant.steps.map((step, stepIndex) => {
          const chord = spine[stepIndex];
          const personaHarmonyMap = {
            PRO: chord.root,
            HAM: chord.fifth,
            HEC: chord.third,
            OPH: (chord.third + 12) % 24,
          };
          const targetInterval = personaHarmonyMap[step.personaShort] ?? chord.root;
          const phraseGate = stepIndex % 3 === 1 && step.gate === 1 ? 0 : step.gate;
          const chantPitchName = PITCH_NAMES[(((score.root + targetInterval) % 12) + 12) % 12];
          const chantLabel = phraseGate === 0 ? "SILENT" : `${step.personaShort}·${chantPitchName}`;
          return Object.freeze({
            ...step,
            gate: phraseGate,
            interval: targetInterval % 12,
            label: chantLabel,
          });
        }),
      ),
    })
    : null;

  return Object.freeze({
    spine,
    melody: conductedMelody,
    beat,
    bass: conductedBass,
    harmony: conductedHarmony,
    chimes: conductedChimes,
    chant: conductedChant,
    genre: activeGenre,
    genreName: GENRE_NAMES[activeGenre],
    consonanceStrictness,
  });
}
