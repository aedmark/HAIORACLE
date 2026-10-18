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

export function buildTriad(root, quality = "minor", op = "I") {
  const r = ((root % 12) + 12) % 12;
  const thirdOffset = quality === "major" ? 4 : 3;
  const third = (r + thirdOffset) % 12;
  const fifth = (r + 7) % 12;
  const seventhOffset = quality === "major" ? 11 : 10;
  const ninth = (r + 2) % 12;
  return Object.freeze({
    root: r,
    quality,
    op,
    third,
    fifth,
    seventh: (r + seventhOffset) % 12,
    ninth,
    pitchClasses: Object.freeze([r, third, fifth]),
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

/**
 * Projects an arbitrary semitone interval onto the nearest pitch that is consonant
 * (low Euler Gradus Suavitatis) with the active Tonnetz triad.
 */
export function projectConsonantPitch(rawSemitone, triad, allowPassing = false) {
  const octave = Math.floor(rawSemitone / 12) * 12;
  const pc = ((Math.trunc(rawSemitone) % 12) + 12) % 12;

  if (triad.pitchClasses.includes(pc)) {
    return octave + pc;
  }

  const allowedExtras = allowPassing
    ? [triad.ninth, (triad.root + 5) % 12, (triad.root + 9) % 12, triad.seventh]
    : [triad.ninth, (triad.root + 5) % 12];
  const candidates = [...triad.pitchClasses, ...allowedExtras];

  let bestPc = triad.root;
  let bestScore = Infinity;
  for (const candidate of candidates) {
    const dist = Math.min(
      Math.abs(pc - candidate),
      12 - Math.abs(pc - candidate),
    );
    const gradus = semitoneGradus(candidate - triad.root);
    const totalCost = dist * 2.2 + gradus * 0.35;
    if (totalCost < bestScore) {
      bestScore = totalCost;
      bestPc = candidate;
    }
  }

  return octave + bestPc;
}

/**
 * Conducts and harmonizes all six esoteric bandmates so their genuine VM outputs
 * lock into a shared Neo-Riemannian Tonnetz chord spine, Euler Gradus Suavitatis
 * consonance sieve, and complementary Euclidean hocket pocket.
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
}) {
  const spine = buildTonnetzSpine(score, mutation);
  const leadMask = bjorklund(7, 12, score.melodyTurn % 12);
  const chimeHocketMask = bjorklund(5, 12, (score.melodyTurn + 2) % 12);

  // 1. Harmonize LOLCODE Lead Motif via Euler Consonance Sieve
  const conductedMelody = Object.freeze(
    melody.map((rawOffset, stepIndex) => {
      const triad = spine[stepIndex];
      const isStrongBeat = stepIndex % 3 === 0;
      return projectConsonantPitch(rawOffset, triad, !isStrongBeat);
    }),
  );

  // 2. Lock Brainfuck Bassline to Tonnetz Chord Root / Fifth & Malbolge Kick Pocket
  const conductedBass = bass
    ? Object.freeze({
      ...bass,
      steps: Object.freeze(
        bass.steps.map((step, stepIndex) => {
          const triad = spine[stepIndex];
          const beatStep = beat?.steps?.[stepIndex];
          const isRegionStart = stepIndex % 3 === 0;
          const kickActive = (beatStep?.kick ?? 0) > 0;
          const bassChoices = isRegionStart
            ? [triad.root, triad.root, triad.fifth]
            : [triad.root, triad.fifth, triad.third, triad.root];
          const harmonizedInterval = bassChoices[(step.cell + stepIndex) % bassChoices.length];
          const gate = isRegionStart && kickActive ? Math.max(1, step.gate) : step.gate;
          return Object.freeze({
            ...step,
            gate,
            interval: harmonizedInterval,
          });
        }),
      ),
    })
    : null;

  // 3. Voice Befunge-93 2D Mirror Chord Organ on the Active Tonnetz Triad
  const conductedHarmony = harmony
    ? Object.freeze({
      ...harmony,
      steps: Object.freeze(
        harmony.steps.map((step, stepIndex) => {
          const triad = spine[stepIndex];
          const inversion = (step.raw + stepIndex) % 3;
          const baseChord = [triad.root, triad.third, triad.fifth];
          const voiced = baseChord.map((pc, idx) => (
            idx < inversion ? pc + 12 : pc
          )).sort((a, b) => a - b);
          const orderedChord = step.mirror === "/" ? voiced : [...voiced].reverse();
          return Object.freeze({
            ...step,
            chord: Object.freeze(orderedChord),
          });
        }),
      ),
    })
    : null;

  // 4. Lock Piet/FRACTRAN Chimes to Pure 5-Limit Overtones of the Active Tonnetz Triad & Euclidean Hocket
  const conductedChimes = chimes
    ? Object.freeze({
      ...chimes,
      steps: Object.freeze(
        chimes.steps.map((step, stepIndex) => {
          const triad = spine[stepIndex];
          const isMajor = triad.quality === "major";
          const chordToneRatios = isMajor
            ? [CONSONANT_CHIME_RATIOS[0], CONSONANT_CHIME_RATIOS[3], CONSONANT_CHIME_RATIOS[5], CONSONANT_CHIME_RATIOS[7]]
            : [CONSONANT_CHIME_RATIOS[0], CONSONANT_CHIME_RATIOS[2], CONSONANT_CHIME_RATIOS[5], CONSONANT_CHIME_RATIOS[7]];
          const chosen = chordToneRatios[(step.hueIndex + step.exponents.e2 + step.exponents.e3 + stepIndex) % chordToneRatios.length];
          const chordRootFactor = Math.pow(2, triad.root / 12);
          const hocketGate = step.gate > 0 && (chimeHocketMask[stepIndex] === 1 || leadMask[stepIndex] === 0 || stepIndex % 3 === 0)
            ? step.gate
            : (step.gate === 2 ? 1 : 0);
          return Object.freeze({
            ...step,
            gate: hocketGate,
            ratioLabel: chosen.ratio,
            ratioValue: Number((chosen.value * chordRootFactor).toFixed(4)),
          });
        }),
      ),
    })
    : null;

  // 5. Lock Shakespeare Formant Choir onto Sustained Tonnetz Chord Tones
  const conductedChant = chant
    ? Object.freeze({
      ...chant,
      steps: Object.freeze(
        chant.steps.map((step, stepIndex) => {
          const triad = spine[stepIndex];
          const personaHarmonyMap = {
            PRO: triad.root,
            HAM: triad.fifth,
            HEC: triad.third,
            OPH: triad.third + 12,
          };
          const targetInterval = personaHarmonyMap[step.personaShort] ?? triad.root;
          // Encourage lush 3-step phrase breathing instead of rapid 16th-note chatter
          const phraseGate = stepIndex % 3 === 1 && step.gate === 1 ? 0 : step.gate;
          return Object.freeze({
            ...step,
            gate: phraseGate,
            interval: targetInterval % 12,
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
  });
}
