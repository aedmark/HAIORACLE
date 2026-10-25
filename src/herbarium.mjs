// Cabinet Curio Gallery ("The Naturalist's Herbarium", P5-35, D-070).
// Pure functions and a strict boundary validator for pinning summoned
// specimens on-device, rendering deterministic miniature silhouettes, and
// comparing two specimens side-by-side.

import { MELODY_NAMES } from "./music.mjs";
import { WAVEFORMS } from "./score.mjs";
import { paletteFor, shapeFamilyRadius } from "./vitrine-canvas.mjs";

export const HERBARIUM_STORAGE_KEY = "whimsy-machine.herbarium.v1";
export const MAX_HERBARIUM_SPECIMENS = 24;
export const MAX_SPECIMEN_PHRASE_LENGTH = 72;
export const MAX_SPECIMEN_TEXT_LENGTH = 80;

const SPECIMEN_KEYS = Object.freeze([
  "phrase",
  "seed",
  "name",
  "folioId",
  "curiosaClass",
  "bellJar",
  "pulse",
  "wave",
  "shape",
  "shapeName",
  "melodyMode",
  "fungalForm",
  "fungalName",
  "hue",
  "accent",
  "pinnedAt",
]);

export class HerbariumError extends Error {
  constructor(path, message) {
    super(`${path}: ${message}`);
    this.name = "HerbariumError";
    this.path = path;
  }
}

function isPlainObject(value) {
  if (typeof value !== "object" || value === null || Array.isArray(value)) return false;
  const proto = Object.getPrototypeOf(value);
  return proto === Object.prototype || proto === null;
}

function expectExactKeys(obj, path, allowed) {
  if (!isPlainObject(obj)) throw new HerbariumError(path, "must be an object");
  for (const key of Object.keys(obj)) {
    if (key === "__proto__" || key === "constructor" || key === "prototype" || !allowed.includes(key)) {
      throw new HerbariumError(`${path}.${key}`, "is not a recognized specimen field");
    }
  }
  for (const key of allowed) {
    if (!Object.prototype.hasOwnProperty.call(obj, key)) {
      throw new HerbariumError(`${path}.${key}`, "is required");
    }
  }
}

function expectInt(value, path, min, max) {
  if (typeof value !== "number" || !Number.isInteger(value) || value < min || value > max) {
    throw new HerbariumError(path, `must be an integer in ${min}..${max}`);
  }
  return value;
}

function expectPrintableText(value, path, maxLen = MAX_SPECIMEN_TEXT_LENGTH) {
  if (typeof value !== "string") throw new HerbariumError(path, "must be text");
  const cleaned = value.trim().replace(/\s+/g, " ");
  if (!cleaned || cleaned.length > maxLen || /[\u0000-\u001f\u007f]/.test(cleaned)) {
    throw new HerbariumError(path, `must be 1..${maxLen} printable characters`);
  }
  return cleaned;
}

export function emptyHerbariumStore() {
  return Object.freeze({
    version: 1,
    specimens: Object.freeze([]),
  });
}

export function validateSpecimen(raw, path = "specimen") {
  expectExactKeys(raw, path, SPECIMEN_KEYS);
  return Object.freeze({
    phrase: expectPrintableText(raw.phrase, `${path}.phrase`, MAX_SPECIMEN_PHRASE_LENGTH),
    seed: expectInt(raw.seed, `${path}.seed`, 0, 0xffffffff),
    name: expectPrintableText(raw.name, `${path}.name`, 80),
    folioId: expectPrintableText(raw.folioId, `${path}.folioId`, 40),
    curiosaClass: expectPrintableText(raw.curiosaClass, `${path}.curiosaClass`, 48),
    bellJar: expectPrintableText(raw.bellJar, `${path}.bellJar`, 40),
    pulse: expectInt(raw.pulse, `${path}.pulse`, 36, 208),
    wave: expectInt(raw.wave, `${path}.wave`, 0, 3),
    shape: expectInt(raw.shape, `${path}.shape`, 0, 9),
    shapeName: expectPrintableText(raw.shapeName, `${path}.shapeName`, 40),
    melodyMode: expectInt(raw.melodyMode, `${path}.melodyMode`, 0, 11),
    fungalForm: expectInt(raw.fungalForm, `${path}.fungalForm`, 0, 7),
    fungalName: expectPrintableText(raw.fungalName, `${path}.fungalName`, 48),
    hue: expectInt(raw.hue, `${path}.hue`, 0, 359),
    accent: expectInt(raw.accent, `${path}.accent`, 0, 359),
    pinnedAt: expectPrintableText(raw.pinnedAt, `${path}.pinnedAt`, 40),
  });
}

export function specimenFromScore(score, pinnedAt = new Date().toISOString()) {
  if (!score || typeof score !== "object") {
    throw new HerbariumError("score", "must be a summoned score");
  }
  return validateSpecimen({
    phrase: String(score.phrase || ""),
    seed: (score.seed >>> 0),
    name: String(score.name || "UNNAMED SPECIMEN"),
    folioId: String(score.folioId || "FOLIO I"),
    curiosaClass: String(score.curiosaClass || "CLASS I · PARLOR APPARITION"),
    bellJar: String(score.bellJar || "BELL JAR Nº 01"),
    pulse: Math.max(36, Math.min(208, Math.round(Number(score.pulse) || 96))),
    wave: Number(score.wave ?? 0),
    shape: Number(score.shape ?? 0),
    shapeName: String(score.shapeName || "ELLIPSE"),
    melodyMode: Number(score.melodyMode ?? 0),
    fungalForm: Number(score.fungalForm ?? 0),
    fungalName: String(score.fungalName || "AGARIC CAP"),
    hue: Number(score.hue ?? 180) % 360,
    accent: Number(score.accent ?? 45) % 360,
    pinnedAt: String(pinnedAt || "2026-10-25T00:00:00.000Z"),
  });
}

export function parseHerbariumStore(text) {
  if (typeof text !== "string" || !text) return emptyHerbariumStore();
  let parsed;
  try {
    parsed = JSON.parse(text);
  } catch {
    return emptyHerbariumStore();
  }
  if (!isPlainObject(parsed) || parsed.version !== 1 || !Array.isArray(parsed.specimens)) {
    return emptyHerbariumStore();
  }
  const specimens = [];
  const seenSeeds = new Set();
  for (const raw of parsed.specimens.slice(0, MAX_HERBARIUM_SPECIMENS)) {
    try {
      const valid = validateSpecimen(raw);
      if (seenSeeds.has(valid.seed)) continue;
      seenSeeds.add(valid.seed);
      specimens.push(valid);
    } catch {
      // Drop corrupt entry individually without losing valid neighbors.
    }
  }
  return Object.freeze({
    version: 1,
    specimens: Object.freeze(specimens),
  });
}

export function pinSpecimen(store, scoreOrSpecimen, pinnedAt = new Date().toISOString()) {
  const entry = isPlainObject(scoreOrSpecimen) && Object.prototype.hasOwnProperty.call(scoreOrSpecimen, "pinnedAt")
    ? validateSpecimen(scoreOrSpecimen)
    : specimenFromScore(scoreOrSpecimen, pinnedAt);
  const current = store?.specimens || [];
  const others = current.filter((item) => item.seed !== entry.seed && item.phrase !== entry.phrase);
  return Object.freeze({
    version: 1,
    specimens: Object.freeze([entry, ...others].slice(0, MAX_HERBARIUM_SPECIMENS)),
  });
}

export function unpinSpecimen(store, seedOrPhrase) {
  const current = store?.specimens || [];
  const filtered = current.filter((item) => item.seed !== seedOrPhrase && item.phrase !== seedOrPhrase);
  return Object.freeze({
    version: 1,
    specimens: Object.freeze(filtered),
  });
}

export function isSpecimenPinned(store, score) {
  if (!score || !store?.specimens?.length) return false;
  const seed = score.seed >>> 0;
  return store.specimens.some((item) => item.seed === seed || item.phrase === score.phrase);
}

export function serializeHerbariumStore(store) {
  return JSON.stringify({
    version: 1,
    specimens: store?.specimens || [],
  });
}

function isQuotaError(error) {
  return (
    error?.name === "QuotaExceededError" ||
    error?.name === "NS_ERROR_DOM_QUOTA_REACHED" ||
    error?.code === 22 ||
    error?.code === 1014 ||
    /quota/i.test(error?.message ?? "")
  );
}

export function readHerbariumStoreFrom(storage, key = HERBARIUM_STORAGE_KEY) {
  let text;
  try {
    if (!storage || typeof storage.getItem !== "function") return emptyHerbariumStore();
    text = storage.getItem(key);
  } catch {
    return emptyHerbariumStore();
  }
  return parseHerbariumStore(text);
}

export function writeHerbariumStoreTo(storage, store, key = HERBARIUM_STORAGE_KEY) {
  if (!storage) return false;
  const list = store?.specimens || [];
  if (!list.length) {
    try {
      storage.removeItem(key);
      return true;
    } catch {
      return false;
    }
  }
  for (let count = list.length; count >= 1; count -= 1) {
    const candidate = count === list.length
      ? store
      : Object.freeze({ version: 1, specimens: Object.freeze(list.slice(0, count)) });
    try {
      storage.setItem(key, serializeHerbariumStore(candidate));
      return true;
    } catch (error) {
      if (!isQuotaError(error)) return false;
    }
  }
  return false;
}

/**
 * Generates a deterministic SVG polygon point string and palette for a
 * miniature portrait of a pinned specimen.
 */
export function specimenMiniatureData(specimen, size = 56) {
  const valid = validateSpecimen(specimen);
  const center = size / 2;
  const baseRadius = size * 0.44;
  const symmetry = 3 + (valid.seed % 7);
  const twist = 2 + ((valid.seed >>> 4) % 5);
  const steps = 48;
  const points = [];
  for (let i = 0; i < steps; i += 1) {
    const angle = (i / steps) * Math.PI * 2;
    const r = baseRadius * shapeFamilyRadius(valid.shape, symmetry, 0.55, twist, angle);
    const x = (center + Math.cos(angle) * r).toFixed(1);
    const y = (center + Math.sin(angle) * r).toFixed(1);
    points.push(`${x},${y}`);
  }
  const hues = paletteFor({
    hue: valid.hue,
    hueShift: ((valid.accent - valid.hue + 360) % 360) || 45,
    palette: valid.seed % 8,
  });
  const coreColor = `hsl(${hues[0]} 72% 52%)`;
  const highlightColor = `hsl(${hues[1]} 84% 68%)`;
  const accentColor = `hsl(${hues[2]} 78% 60%)`;
  return Object.freeze({
    size,
    center,
    viewBox: `0 0 ${size} ${size}`,
    points: points.join(" "),
    fill: coreColor,
    stroke: highlightColor,
    coreColor,
    palette: Object.freeze({
      coreColor,
      highlightColor,
      accentColor,
    }),
  });
}

/**
 * Compares two validated specimens across their 8 defining traits.
 */
export function compareSpecimens(leftRaw, rightRaw) {
  const left = validateSpecimen(leftRaw, "left");
  const right = validateSpecimen(rightRaw, "right");

  const hexSeed = (s) => `0x${(s >>> 0).toString(16).toUpperCase().padStart(8, "0")}`;
  const rows = [
    {
      trait: "SPECIMEN",
      leftValue: `${left.name} (${hexSeed(left.seed)})`,
      rightValue: `${right.name} (${hexSeed(right.seed)})`,
      match: left.seed === right.seed,
    },
    {
      trait: "PHRASE",
      leftValue: left.phrase,
      rightValue: right.phrase,
      match: left.phrase === right.phrase,
    },
    {
      trait: "FOLIO & CLASS",
      leftValue: `${left.folioId} · ${left.curiosaClass}`,
      rightValue: `${right.folioId} · ${right.curiosaClass}`,
      match: left.curiosaClass === right.curiosaClass,
    },
    {
      trait: "PULSE & WAVE",
      leftValue: `${left.pulse} BPM · ${WAVEFORMS[left.wave] || "SINE"}`,
      rightValue: `${right.pulse} BPM · ${WAVEFORMS[right.wave] || "SINE"}`,
      match: left.pulse === right.pulse && left.wave === right.wave,
    },
    {
      trait: "SILHOUETTE",
      leftValue: left.shapeName,
      rightValue: right.shapeName,
      match: left.shape === right.shape,
    },
    {
      trait: "MELODY MOTIF",
      leftValue: MELODY_NAMES[left.melodyMode] || `MODE ${left.melodyMode}`,
      rightValue: MELODY_NAMES[right.melodyMode] || `MODE ${right.melodyMode}`,
      match: left.melodyMode === right.melodyMode,
    },
    {
      trait: "SPOROPHORE",
      leftValue: left.fungalName,
      rightValue: right.fungalName,
      match: left.fungalForm === right.fungalForm,
    },
    {
      trait: "CHROMATIC HUE",
      leftValue: `${left.hue}° / ${left.accent}°`,
      rightValue: `${right.hue}° / ${right.accent}°`,
      match: left.hue === right.hue && left.accent === right.accent,
    },
  ];

  const sharedCount = rows.filter((r) => r.match).length;
  return Object.freeze({
    left,
    right,
    rows: Object.freeze(rows.map((r) => Object.freeze({
      ...r,
      label: r.trait,
      delta: r.match ? "SHARED" : "DIVERGENT",
    }))),
    sharedCount,
    summary: `${sharedCount} OF ${rows.length} TRAITS SHARED`,
  });
}
