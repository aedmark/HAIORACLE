// Interactive Esoteric Inspector / Live VM Step Debugger ("Under the Parlor Glass", P5-34, D-069).
// Pure functions that format per-step virtual machine register, tape, torus,
// codel/prime-exponent, and dramatic dialogue state for Plates I–V in Wing III.

import { crazy, rotr } from "./malbolge.mjs";

export const INSPECTOR_PLATE_IDS = Object.freeze(["beat", "bass", "harmony", "chime", "chant"]);

export const PLATE_INSPECTOR_SPECS = Object.freeze({
  beat: Object.freeze({
    id: "beat",
    title: "MALBOLGE 1998 · 3¹⁰ TERNARY VIRTUAL MACHINE",
    sourceFile: "src/beat.mal",
  }),
  bass: Object.freeze({
    id: "bass",
    title: "BRAINFUCK 1993 · 256-CELL TAPE SHUTTLE",
    sourceFile: "src/bass.bf",
  }),
  harmony: Object.freeze({
    id: "harmony",
    title: "BEFUNGE-93 · 80×25 TORUS MIRROR PLAYFIELD",
    sourceFile: "src/harmony.bfg",
  }),
  chime: Object.freeze({
    id: "chime",
    title: "PIET 2001 & FRACTRAN 1987 · CODEL & PRIME REGISTER",
    sourceFile: "src/pad.piet + src/chimes.frac",
  }),
  chant: Object.freeze({
    id: "chant",
    title: "SHAKESPEARE 2001 · DRAMATIS PERSONAE & FORMANT VODER",
    sourceFile: "src/chant.spl",
  }),
});

const PRIMES = Object.freeze([2, 3, 5, 7, 11, 13]);

export function toTernary10(word) {
  let n = Math.max(0, Math.trunc(Number(word) || 0)) % 59049;
  const digits = new Array(10);
  for (let i = 9; i >= 0; i -= 1) {
    digits[i] = n % 3;
    n = Math.floor(n / 3);
  }
  return `0t${digits.join("")}`;
}

function normalizeStep(stepIndex) {
  const n = Number.isFinite(stepIndex) && stepIndex >= 0 ? Math.trunc(stepIndex) : 0;
  return ((n % 12) + 12) % 12;
}

export function inspectBeatStep(beat, stepIndex = 0) {
  const s = normalizeStep(stepIndex);
  const step = beat?.steps?.[s];
  if (!beat || !step) {
    return {
      plate: "beat",
      stepIndex: s,
      headline: "MALBOLGE VM STANDBY · SUMMON A SPECIMEN",
      registers: "A=0t0000000000 · C=0 · D=0 · ROTR=-- · CRAZY=--",
      detail: "TRITS [000] · KICK=0 SNARE=0 HAT=0",
    };
  }
  const raw = step.raw & 0xff;
  const dWord = (s * 729 + raw) % 59049;
  const rotated = rotr(raw);
  const crazed = crazy(raw, dWord);
  const rawHex = raw.toString(16).toUpperCase().padStart(2, "0");
  return {
    plate: "beat",
    stepIndex: s,
    headline: `STEP ${String(s + 1).padStart(2, "0")}/12 · ${beat.modeName} · ${beat.stepsExecuted} VM OPS`,
    registers: `A=0x${rawHex} (${toTernary10(raw)}) · ROTR=${toTernary10(rotated)} · CRAZY=${toTernary10(crazed)}`,
    detail: `TRITS [${step.trits}] · KICK=${step.kick} SNARE=${step.snare} HAT=${step.hat} · DENSITY ${beat.density}% · MUTATION #${beat.mutation}`,
  };
}

export function inspectBassStep(bass, stepIndex = 0) {
  const s = normalizeStep(stepIndex);
  const step = bass?.steps?.[s];
  if (!bass || !step) {
    return {
      plate: "bass",
      stepIndex: s,
      headline: "BRAINFUCK VM STANDBY · SUMMON A SPECIMEN",
      registers: "PTR=*00 [0x00] · SHUTTLE [->+<]",
      detail: "NOTE=REST · GATE=0 · INT=+0st",
    };
  }
  const cell = step.cell & 0xff;
  const cellHex = cell.toString(16).toUpperCase().padStart(2, "0");
  const tapeRibbon = bass.steps
    .slice(0, 6)
    .map((entry, idx) => {
      const hex = (entry.cell & 0xff).toString(16).toUpperCase().padStart(2, "0");
      return idx === s % 6 ? `[${hex}]` : hex;
    })
    .join(" ");
  return {
    plate: "bass",
    stepIndex: s,
    headline: `STEP ${String(s + 1).padStart(2, "0")}/12 · ${bass.modeName} · ${bass.stepsExecuted} TAPE OPS`,
    registers: `PTR=*${String(s).padStart(2, "0")} [0x${cellHex}=${cell}] · SHUTTLE [->+<] · TAPE ${tapeRibbon}`,
    detail: `NOTE=${step.label} · GATE=${step.gate} · INT=+${step.interval}st · REG=${step.register} · SLIDE=${step.slide ? "ON" : "OFF"} · ACCENT=${step.accent ? "ON" : "OFF"}`,
  };
}

export function inspectHarmonyStep(harmony, stepIndex = 0) {
  const s = normalizeStep(stepIndex);
  const step = harmony?.steps?.[s];
  if (!harmony || !step) {
    return {
      plate: "harmony",
      stepIndex: s,
      headline: "BEFUNGE-93 VM STANDBY · SUMMON A SPECIMEN",
      registers: "IP=(0,0) DIR=→ · MIRROR '/' · STACK=0x00",
      detail: "CHORD=REST · TRIAD=[0, 7, 12]st",
    };
  }
  const raw = step.raw & 0xff;
  const rawHex = raw.toString(16).toUpperCase().padStart(2, "0");
  const row = Math.floor(s / 4);
  const ipX = row % 2 === 0 ? (s % 4) * 6 + 2 : 24 - (s % 4) * 6;
  const ipY = row * 2;
  const dirArrow = step.mirror === "/" ? (row % 2 === 0 ? "↗" : "↙") : (row % 2 === 0 ? "↘" : "↖");
  const chordArr = Array.isArray(step.chord) ? step.chord.join(", ") : "0, 7, 12";
  return {
    plate: "harmony",
    stepIndex: s,
    headline: `STEP ${String(s + 1).padStart(2, "0")}/12 · ${harmony.modeName} · ${harmony.stepsExecuted} TORUS OPS`,
    registers: `IP=(${ipX},${ipY}) DIR=${dirArrow} · MIRROR '${step.mirror}' (${harmony.mirrorsHit} HIT) · STACK=0x${rawHex}`,
    detail: `CHORD=${step.label} · TRIAD=[${chordArr}]st · STRUM=${step.strumMs}ms · GATE=${step.gate}`,
  };
}

export function inspectChimeStep(chimes, stepIndex = 0) {
  const s = normalizeStep(stepIndex);
  const step = chimes?.steps?.[s];
  if (!chimes || !step) {
    return {
      plate: "chime",
      stepIndex: s,
      headline: "PIET & FRACTRAN VM STANDBY · SUMMON A SPECIMEN",
      registers: "PIET CODEL=LC · FRACTRAN=35/6 -> 2⁰3⁰5¹7¹",
      detail: "JI RATIO=1/1 · GATE=0",
    };
  }
  const byteHex = (step.pietByte & 0xff).toString(16).toUpperCase().padStart(2, "0");
  const fracStr = step.fraction ? `${step.fraction.num}/${step.fraction.den}` : "1/1";
  const exps = Array.isArray(step.exponents) ? step.exponents : [0, 0, 0, 0, 0, 0];
  const expTerms = exps
    .map((e, i) => (e > 0 ? `${PRIMES[i]}^${e}` : null))
    .filter(Boolean);
  const expStr = expTerms.length ? expTerms.join("·") : "2^0";
  return {
    plate: "chime",
    stepIndex: s,
    headline: `STEP ${String(s + 1).padStart(2, "0")}/12 · ${chimes.modeName} · ${chimes.pietStepsExecuted} CODELS / ${chimes.fractranStepsExecuted} FRACTIONS`,
    registers: `PIET CODEL=${step.codelCode} (${step.codelName}, 0x${byteHex}) · FRACTRAN=${fracStr} ➔ ${expStr}`,
    detail: `JI RATIO=${step.ratioLabel} (${Number(step.ratioValue || 1).toFixed(4)}× · ${step.primeTag}) · GATE=${step.gate} · SHIMMER=${step.shimmer}%`,
  };
}

export function inspectChantStep(chant, stepIndex = 0) {
  const s = normalizeStep(stepIndex);
  const step = chant?.steps?.[s];
  if (!chant || !step) {
    return {
      plate: "chant",
      stepIndex: s,
      headline: "SHAKESPEARE VM STANDBY · SUMMON A SPECIMEN",
      registers: "ACT I · SCENE I · [HAMLET ➔ OPHELIA]",
      detail: "VOWEL=/ɑ/ · FORMANTS F1=730Hz F2=1090Hz F3=2440Hz",
    };
  }
  return {
    plate: "chant",
    stepIndex: s,
    headline: `STEP ${String(s + 1).padStart(2, "0")}/12 · ${chant.modeName} · ${chant.statementsExecuted} DRAMATIC CUES`,
    registers: `${step.act} · ${step.scene} · [${step.speaker} ➔ ${step.addressee}] (${step.voiceType}, ${step.vibratoHz}Hz VIB)`,
    detail: `VOWEL=${step.vowelIpa} (${step.label}) · FORMANTS F1=${step.f1}Hz F2=${step.f2}Hz F3=${step.f3}Hz · INT=+${step.interval}st`,
  };
}

export function inspectPlateStep(plateId, plateState, stepIndex = 0) {
  switch (plateId) {
    case "beat":
      return inspectBeatStep(plateState, stepIndex);
    case "bass":
      return inspectBassStep(plateState, stepIndex);
    case "harmony":
      return inspectHarmonyStep(plateState, stepIndex);
    case "chime":
      return inspectChimeStep(plateState, stepIndex);
    case "chant":
      return inspectChantStep(plateState, stepIndex);
    default:
      throw new Error(`Unknown plate inspector id: ${plateId}`);
  }
}
