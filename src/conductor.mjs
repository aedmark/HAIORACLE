// The Kapellmeister genres are not written here: src/rulebooks.ni states them
// in Inform 7 and src/inform.mjs compiles them (D-033). The host installs the
// compiled rulebooks once at load; every genre-dependent choice below reads
// them by genre code.

import { varySpine } from "./variation.mjs";
let installedRulebooks = null;

export function installRulebooks(rulebooks) {
  if (!rulebooks?.genres?.length || !rulebooks.byCode || !rulebooks.progressions || !rulebooks.qualityProgressions) {
    throw new TypeError("installRulebooks() needs compileRulebooks() output");
  }
  installedRulebooks = rulebooks;
}

export function rulebooksInstalled() {
  return installedRulebooks !== null;
}

function rulebooks() {
  if (!installedRulebooks) throw new Error("The Kapellmeister rulebooks (src/rulebooks.ni) are not installed yet");
  return installedRulebooks;
}

/** Codes of every installed genre, in menu order. */
export function genreCodes() {
  return rulebooks().genres.map((genre) => genre.code);
}

// THE CREATURE'S OWN rulebook (D-043): written per creature by
// src/creature-rulebook.mjs and installed by the host when it summons one.
export const CREATURE_GENRE = "creature";
let creatureBook = null;

export function installCreatureBook(book) {
  creatureBook = book;
}

/** The compiled rulebooks themselves, for building a creature's own. */
export function compiledRulebooks() {
  return rulebooks();
}

/** The compiled genre for a code; an unknown code falls back to the first genre. */
export function genreBook(code) {
  if (code === CREATURE_GENRE && creatureBook) return creatureBook;
  const books = rulebooks();
  return books.byCode[code] ?? books.genres[0];
}

export const RHYTHMIC_FEELS = Object.freeze({
  straight: 0,
  swing: 1,
  syncopated: 2,
  gallop: 3,
  stately: 4,
  habanera: 5,
  waltz: 6,
});

/**
 * Resolves the effective rhythm template index (0..6) for a score and genre.
 * If the genre declares a recognized feel, that feel's rhythm is used;
 * otherwise, or for THE CREATURE'S OWN, the score's native rhythm is preserved (D-041 Wave 3).
 */
export function effectiveRhythmIndex(score, genreCode) {
  if (!genreCode || genreCode === CREATURE_GENRE) return score?.rhythm ?? 0;
  const book = genreBook(genreCode);
  if (book?.feel && RHYTHMIC_FEELS[book.feel] !== undefined) {
    return RHYTHMIC_FEELS[book.feel];
  }
  return score?.rhythm ?? 0;
}

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

// The members a quality implies when a chord names no tones of its own.
// Altered dominants, Lydian chords, maj7, augmented, and 6th chords have a
// major third; diminished and half-diminished flat fifths; augmented sharp fifths.
const MAJOR_THIRD_QUALITIES = new Set(["major", "dom7", "maj9", "dom7alt", "lydian", "maj7", "augmented", "major_6"]);

export function buildTriad(root, quality = "minor", op = "I", customPcs = null) {
  const r = ((root % 12) + 12) % 12;
  const thirdOffset = quality === "sus4" ? 5 : (MAJOR_THIRD_QUALITIES.has(quality) ? 4 : 3);
  const fifthOffset = quality === "dim" || quality === "half_diminished" || quality === "half-diminished" ? 6 : (quality === "augmented" ? 8 : 7);
  const seventhOffset = quality === "dim" ? 9 : (quality === "major" || quality === "maj9" || quality === "maj7" ? 11 : (quality === "major_6" ? 9 : 10));
  const pitchClasses = customPcs
    ? Object.freeze([...customPcs].map((pc) => ((pc % 12) + 12) % 12))
    : null;
  // A chord that names its tones takes its members from them, so the organ
  // and choir voice the chord the rulebook wrote: the first interval present
  // from each list, else the quality's default. A chord with no third (an open
  // fifth) lends its suspended tone to the "third".
  const intervals = new Set((pitchClasses ?? []).map((pc) => (pc - r + 12) % 12));
  const member = (choices, fallback) => (r + (choices.find((interval) => intervals.has(interval)) ?? fallback)) % 12;
  const third = member(thirdOffset === 5 ? [5, 4, 3, 2] : (thirdOffset === 4 ? [4, 3, 2, 5] : [3, 4, 2, 5]), thirdOffset);
  const fifth = member([fifthOffset, 7, 6, 8], fifthOffset);
  const seventh = member([seventhOffset, 10, 11, 9], seventhOffset);
  const ninth = member([2, 1], 2);
  const tones = pitchClasses ?? Object.freeze([r, third, fifth]);

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
    pitchClasses: tones,
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
  if (chord.quality === "min7") return `${name}min7`;
  if (chord.quality === "maj7") return `${name}maj7`;
  if (chord.quality === "half_diminished" || chord.quality === "half-diminished") return `${name}ø7`;
  if (chord.quality === "augmented") return `${name} aug`;
  if (chord.quality === "sus4") return `${name}sus4`;
  if (chord.quality === "major_6") return `${name}6`;
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
  MIN7: "min7",
  MAJ7: "maj7",
  HALF_DIM: "half_diminished",
  AUG: "augmented",
  SUS4: "sus4",
  MAJOR_6: "major_6",
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

export function buildFunChord(rootSemitone, quality = "auto", genre = null, tonicRoot = 0) {
  const r = ((Math.trunc(rootSemitone) % 12) + 12) % 12;
  const relFromTonic = ((r - (Math.trunc(tonicRoot) % 12)) % 12 + 12) % 12;
  // "auto" asks the genre's colouring rules; an explicit quality needs no rulebook.
  let resolvedQuality = quality === "auto" || !quality ? genreBook(genre).colouring[relFromTonic] : quality;

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
  } else if (resolvedQuality === "min7") {
    customPcs = [r, (r + 3) % 12, (r + 7) % 12, (r + 10) % 12];
  } else if (resolvedQuality === "maj7") {
    customPcs = [r, (r + 4) % 12, (r + 7) % 12, (r + 11) % 12];
  } else if (resolvedQuality === "half_diminished" || resolvedQuality === "half-diminished") {
    customPcs = [r, (r + 3) % 12, (r + 6) % 12, (r + 10) % 12];
  } else if (resolvedQuality === "augmented") {
    customPcs = [r, (r + 4) % 12, (r + 8) % 12];
  } else if (resolvedQuality === "sus4") {
    customPcs = [r, (r + 5) % 12, (r + 7) % 12];
  } else if (resolvedQuality === "major_6") {
    customPcs = [r, (r + 4) % 12, (r + 7) % 12, (r + 9) % 12];
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

export function buildFunProgression(rootSemitone, quality = "auto", genre = null, tonicRoot = 0, stepsCount = 12) {
  const r = ((Math.trunc(rootSemitone) % 12) + 12) % 12;
  const relFromTonic = ((r - (Math.trunc(tonicRoot) % 12)) % 12 + 12) % 12;
  const books = rulebooks();
  const tableId = quality === "auto" || !quality
    ? genreBook(genre).progressionByInterval[relFromTonic]
    : books.qualityProgressions[quality] ?? books.qualityProgressions.major;
  const rows = books.progressions[tableId];
  const chordDefs = rows.map((row) => ({ root: (r + row.degree) % 12, quality: row.quality, melodyOffsets: row.melody }));
  const summary = rows.map((row, i) => row.shown.replace("[root]", PITCH_NAMES[chordDefs[i].root])).join(" → ");

  const chords = chordDefs.map((def) => buildFunChord(def.root, def.quality, genre, tonicRoot));

  const stepsPerRegion = stepsCount === 16 ? 4 : 3;
  const steps = [];
  for (let i = 0; i < stepsCount; i += 1) {
    const regionIdx = Math.floor(i / stepsPerRegion) % 4;
    const subIdx = i % stepsPerRegion;
    const def = chordDefs[regionIdx];
    const chord = chords[regionIdx];
    const offset = def.melodyOffsets[subIdx % def.melodyOffsets.length];
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

// The Tonnetz walk: start on the score's tonic triad and apply one walk of
// P/L/R moves (from the genre's Table of Tonnetz Walks) region by region.
export function buildTonnetzSpine(score, mutation = 0, walks = genreBook(null).spine.walks, stepsCount = 12) {
  const pathIndex = ((score.harmonyMode ?? 0) + (score.scale ?? 0) + mutation) % walks.length;
  const ops = walks[pathIndex];
  const tonicQuality = initialQualityForScore(score);
  const chords = [buildTriad(0, tonicQuality, "I")];
  for (const op of ops) {
    chords.push(applyTonnetzOperation(chords[chords.length - 1], op));
  }
  const stepsPerRegion = Math.max(1, Math.floor(stepsCount / 4));
  return Object.freeze(Array.from({ length: stepsCount }, (_, stepIndex) => chords[Math.floor(stepIndex / stepsPerRegion) % 4]));
}

export function buildRawChaosSpine(score, stepsCount = 12) {
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
  return Object.freeze(Array(stepsCount).fill(rawChord));
}

export function buildGenreSpine(genre, score, mutation = 0, stepsCount = 12) {
  const book = genreBook(genre);
  if (book.spine.method === "unfettered") return buildRawChaosSpine(score, stepsCount);
  if (book.spine.method === "tonnetz") return buildTonnetzSpine(score, mutation, book.spine.walks, stepsCount);
  if (stepsCount === 16 && book.spine.steps.length === 12) {
    return Object.freeze(Array.from({ length: 16 }, (_, i) => {
      const step = book.spine.steps[Math.floor(i / 4) * 3];
      return buildTriad(step.degree, step.quality, step.label, step.tones.map((tone) => step.degree + tone));
    }));
  }
  return Object.freeze(book.spine.steps.map((step) => (
    buildTriad(step.degree, step.quality, step.label, step.tones.map((tone) => step.degree + tone))
  )));
}

// Nearest pitch class on the circle; ties go to the earlier candidate.
function snapToNearest(pc, candidates) {
  let best = candidates[0];
  let minDiff = 999;
  for (const candidate of candidates) {
    const diff = Math.min(Math.abs(pc - candidate), 12 - Math.abs(pc - candidate));
    if (diff < minDiff) {
      minDiff = diff;
      best = candidate;
    }
  }
  return best;
}

const chordMember = (chord, member) => (member === "octave" ? chord.root + 12 : chord[member]);

/**
 * Projects an arbitrary semitone interval onto the nearest pitch that is consonant
 * (low Euler Gradus Suavitatis) with the active Tonnetz or genre chord.
 */
/**
 * Avoid notes (D-043): a pitch class that is not in the chord but sits a
 * semitone above one of its tones, such as the fourth over a major triad or
 * the minor sixth over a minor one, rubs against the organ holding that tone.
 * Returns the chord tone to resolve down to, or null when `pc` is safe.
 */
export function avoidNoteResolution(pc, chord) {
  if (!chord || chord.quality === "raw" || chord.pitchClasses.includes(pc)) return null;
  const below = (pc + 11) % 12;
  return chord.pitchClasses.includes(below) ? below : null;
}

export function projectConsonantPitch(rawSemitone, chord, allowPassing = false, maxGradus = 8, genre = null) {
  const book = genreBook(genre);
  if (book.unfettered || !chord || chord.quality === "raw") {
    return rawSemitone;
  }
  const projected = projectWithinGenre(rawSemitone, chord, allowPassing, maxGradus, book);
  const octave = Math.floor(projected / 12) * 12;
  const resolution = avoidNoteResolution(((projected % 12) + 12) % 12, chord);
  return resolution === null ? projected : octave + resolution + (resolution > ((projected % 12) + 12) % 12 ? -12 : 0);
}

function projectWithinGenre(rawSemitone, chord, allowPassing, maxGradus, book) {

  const octave = Math.floor(rawSemitone / 12) * 12;
  const pc = ((Math.trunc(rawSemitone) % 12) + 12) % 12;
  const { melody } = book;

  if (melody.method === "scale") {
    // The genre's melody tone rules decide the scale above the chord root at
    // each strictness (the blues let their blue notes in when the sieve is loose).
    const strictness = Math.min(14, Math.max(1, Math.ceil(maxGradus)));
    return octave + snapToNearest(pc, melody.tonesByStrictness[strictness].map((tone) => (chord.root + tone) % 12));
  }
  if (melody.method === "members") {
    const candidates = [...melody.members.map((member) => chordMember(chord, member)), ...melody.extensions.map((tone) => (chord.root + tone) % 12)];
    return octave + snapToNearest(pc, candidates);
  }
  if (melody.method === "chord") {
    return octave + snapToNearest(pc, chord.pitchClasses);
  }

  // Euler sieving (Victorian Tonnetz, Palestrina Counterpoint): Gradus Suavitatis consonance
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

const UNISON_OVERTONE = Object.freeze({ ratio: "1/1", value: 1 });

// Harmonic rhythm (D-044). A genre's twelve-entry spine used to pass in one
// 12-step loop, 1-1.75 beats a chord, often changing between beats. Now the
// harmony moves on a slower clock: each loop pass holds one region (three
// spine entries, four steps each), so chords change on the loop's downbeat and
// a four-chord progression spans four passes.
export const HARMONIC_PASSES = 4;

/** The chords the band plays on pass `pass` (0..3) of the harmonic cycle. */
export function passSpine(spine, pass, stepsCount = (spine?.length || 12)) {
  const p = ((Math.trunc(pass) % HARMONIC_PASSES) + HARMONIC_PASSES) % HARMONIC_PASSES;
  const count = stepsCount || spine?.length || 12;
  const stride = count === 16 ? 4 : 3;
  return Object.freeze(Array.from({ length: count }, (_, step) => spine[(p * stride + Math.floor(step / 4)) % spine.length]));
}

/**
 * A bass walk names intervals above the chord root, written for the common
 * chord: 3 or 4 means "the third", 6 to 8 "the fifth", 9 to 11 "the seventh".
 * Those land on the chord's own member, so a walk to the fifth plays a flat
 * fifth under a diminished chord, and to the seventh a major seventh under a
 * maj9, instead of a semitone against the organ (D-043). Other intervals are
 * passing tones and play as written. 9 stays a sixth unless the chord holds a
 * seventh to land on.
 */
export function walkTone(chord, interval) {
  const written = (chord.root + interval) % 12;
  const has = (pc) => chord.pitchClasses.includes(pc);
  if (interval === 3 || interval === 4) return has(written) ? written : chord.third;
  if (interval >= 6 && interval <= 8) return has(written) ? written : chord.fifth;
  if (interval === 10 || interval === 11) return has(written) ? written : (has(chord.seventh) ? chord.seventh : written);
  return written;
}

/**
 * The overtones of a genre's table that sound a member of `chord` above its
 * root (rounded to the nearest semitone), the 9th of a ninth chord, or a
 * colour tone the genre names for its melody (Parlor Ragtime's sixth). Falls
 * back to the unison when none fit; unfettered chords keep the whole table.
 */
export function chordOvertones(ratios, chord, colours = []) {
  if (!chord || chord.quality === "raw") return ratios;
  const allowed = new Set(chord.pitchClasses.map((pc) => (((pc - chord.root) % 12) + 12) % 12));
  if (chord.quality === "maj9" || chord.quality === "min9") allowed.add(2);
  for (const tone of colours) allowed.add(((tone % 12) + 12) % 12);
  const fitting = ratios.filter((overtone) => allowed.has(((Math.round(12 * Math.log2(overtone.value)) % 12) + 12) % 12));
  return fitting.length ? fitting : [UNISON_OVERTONE];
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
  genre = null,
  consonanceStrictness = 8,
  parsimonyRadius = 2,
  customSpine = null,
  varied = false,
  harmonicPass = null,
  creatureBook: explicitCreatureBook = null,
  stepsCount = (melody?.length || 12),
}) {
  if (explicitCreatureBook) installCreatureBook(explicitCreatureBook);
  const book = genreBook(genre);
  const activeGenre = book.code;

  if (book.unfettered && !customSpine) {
    const spine = buildRawChaosSpine(score, stepsCount);
    return Object.freeze({
      spine,
      melody: Object.freeze([...melody]),
      beat,
      bass,
      harmony,
      chimes,
      chant,
      genre: activeGenre,
      genreName: book.title,
      consonanceStrictness,
      variation: Object.freeze([]),
      cycleSpine: spine,
    });
  }

  // `varied` lets the creature vary its genre's changes by the moves the
  // rulebook permits (D-043); without it the genre plays as written, which is
  // what the golden fixture guards. A held key's chords are never varied.
  const writtenSpine = buildGenreSpine(activeGenre, score, mutation, stepsCount);
  const variation = varied && !customSpine
    ? varySpine(writtenSpine, score, book.variation, buildTriad)
    : { spine: writtenSpine, moves: Object.freeze([]) };
  // With `harmonicPass` the band plays that pass of the harmonic cycle (D-044);
  // without it, the whole spine in one loop, as the golden fixture records.
  const cycleSpine = variation.spine;
  const baseSpine = harmonicPass === null ? cycleSpine : passSpine(cycleSpine, harmonicPass, stepsCount);
  const spine = customSpine
    ? Object.freeze(baseSpine.map((chord, i) => customSpine[i] || chord))
    : baseSpine;
  const leadMask = bjorklund(stepsCount === 16 ? 9 : 7, stepsCount, score.melodyTurn % stepsCount);
  const chimeHocketMask = bjorklund(stepsCount === 16 ? 7 : 5, stepsCount, (score.melodyTurn + 2) % stepsCount);
  const regionStepStride = stepsCount === 16 ? 4 : 3;

  // 1. Harmonize LOLCODE Lead Melody
  const conductedMelody = Object.freeze(
    melody.map((rawOffset, stepIndex) => {
      const chord = spine[stepIndex];
      const isStrongBeat = stepIndex % regionStepStride === 0;
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
          const isRegionStart = stepIndex % regionStepStride === 0;
          const kickActive = (beatStep?.kick ?? 0) > 0;
          let harmonizedInterval = chord.root;

          if (book.bass.method === "walk") {
            // The genre's bass walk: one interval above the chord root per step.
            harmonizedInterval = walkTone(chord, book.bass.walk[stepIndex % book.bass.walk.length]);
          } else if (book.bass.method === "contrary") {
            // Modal cantus firmus contrary motion to melody
            const mel = conductedMelody[stepIndex] % 12;
            const choices = chord.pitchClasses.filter((pc) => Math.abs(pc - mel) % 12 !== 7);
            harmonizedInterval = choices.length > 0 ? choices[(step.cell + stepIndex) % choices.length] : chord.root;
          } else {
            // Cell choosing: the Brainfuck cell picks among root, fifth, and third
            const bassChoices = isRegionStart
              ? [chord.root, chord.root, chord.fifth]
              : [chord.root, chord.fifth, chord.third, chord.root];
            harmonizedInterval = bassChoices[(step.cell + stepIndex) % bassChoices.length];
          }

          // Insistent genres never let the bass rest; patient ones follow the kick.
          const gate = book.insistent
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

          if (book.organ.method === "voiced") {
            // The genre's organ voicing: named chord members, low to high
            voiced = book.organ.members.map((member) => chordMember(chord, member)).sort((a, b) => a - b);
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
            : chord.quality === "min7" ? "m7"
            : chord.quality === "maj7" ? "M7"
            : chord.quality === "half_diminished" || chord.quality === "half-diminished" ? "ø"
            : chord.quality === "augmented" ? "+"
            : chord.quality === "sus4" ? "sus"
            : chord.quality === "major_6" ? "6"
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
          const ratios = book.overtones;

          // Only overtones that land on the chord (or a tension its quality
          // carries, such as a 9th) may ring; the table's other ratios used to
          // ring against the organ, 71% off the chord in places (D-043).
          const fitting = chordOvertones(ratios, chord, book.melody.extensions ?? []);
          const chosen = fitting[(step.hueIndex + step.exponents.e2 + step.exponents.e3 + stepIndex) % fitting.length];
          const chordRootFactor = Math.pow(2, chord.root / 12);
          const hocketGate = step.gate > 0 && (chimeHocketMask[stepIndex] === 1 || leadMask[stepIndex] === 0 || stepIndex % regionStepStride === 0)
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
          const phraseGate = stepIndex % regionStepStride === 1 && step.gate === 1 ? 0 : step.gate;
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

  // 6. Vertical Anti-Clash Sieve on weak steps: eliminates accidental semitone rubs
  const sievedMelody = Object.freeze(
    conductedMelody.map((melMidi, stepIndex) => {
      if (book.unfettered || activeGenre !== CREATURE_GENRE) return melMidi;
      const chord = spine[stepIndex];
      const held = new Set(chord.pitchClasses);
      const melPc = ((Math.trunc(melMidi) % 12) + 12) % 12;
      if (held.has(melPc)) return melMidi;

      const soundingPcs = [];
      if (conductedBass?.steps[stepIndex]?.gate) soundingPcs.push(((Math.trunc(conductedBass.steps[stepIndex].interval) % 12) + 12) % 12);
      if (conductedHarmony?.steps[stepIndex]?.gate) {
        for (const intv of conductedHarmony.steps[stepIndex].chord) soundingPcs.push(((Math.trunc(intv) % 12) + 12) % 12);
      }
      if (conductedChant?.steps[stepIndex]?.gate) soundingPcs.push(((Math.trunc(conductedChant.steps[stepIndex].interval) % 12) + 12) % 12);
      if (conductedChimes?.steps[stepIndex]?.gate) {
        soundingPcs.push(((Math.round(12 * Math.log2(conductedChimes.steps[stepIndex].ratioValue)) % 12) + 12) % 12);
      }

      const hasClash = soundingPcs.some((pc) => Math.min((melPc - pc + 12) % 12, (pc - melPc + 12) % 12) === 1);
      if (!hasClash) return melMidi;

      const safePc = snapToNearest(melPc, chord.pitchClasses);
      const octave = Math.floor(melMidi / 12) * 12;
      return octave + safePc;
    }),
  );

  return Object.freeze({
    spine,
    melody: sievedMelody,
    beat,
    bass: conductedBass,
    harmony: conductedHarmony,
    chimes: conductedChimes,
    chant: conductedChant,
    variation: variation.moves,
    cycleSpine,
    genre: activeGenre,
    genreName: book.title,
    consonanceStrictness,
  });
}
