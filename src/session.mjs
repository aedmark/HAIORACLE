// Session files (.fun) and on-device presets. Pure functions only.
//
// A session is untrusted boundary data: it may come from a file someone sent,
// or from localStorage another script on this origin could have touched. It is
// validated against a strict allowlist and rejected whole, never repaired, so
// nothing malformed reaches the score, the audio graph, or the page. Only
// small integers, booleans, enum strings, and the phrase cross the boundary;
// chords are stored as (root, quality) and rebuilt by the conductor, and plate
// cell edits as per-cell click counts replayed through each plate's cycler
// (cells cycle independently, so order does not matter).

import { GENRE_RULEBOOKS } from "./conductor.mjs";
import { MIXER_CHANNEL_IDS } from "./mixer.mjs";

export const SESSION_FORMAT = "edmark-fun-session";
export const SESSION_VERSION = 1;
export const SESSION_FILE_EXTENSION = "fun";
export const MAX_SESSION_BYTES = 64 * 1024;
export const MAX_PHRASE_LENGTH = 72;
export const MAX_CELL_CYCLES = 999;
export const MAX_MUTATION = 9999;

export const PRESET_STORAGE_KEY = "edmark-fun-machine.presets.v1";
export const MAX_PRESETS = 24;
export const MAX_PRESET_NAME_LENGTH = 40;

export const PLATE_IDS = Object.freeze(["beat", "bass", "harmony", "chime", "chant"]);
export const FUN_MODES = Object.freeze(["auto_chord", "lead"]);
export const FUN_QUALITIES = Object.freeze(["auto", "major", "minor", "dom7", "maj9", "dim", "modal_open"]);
// Every quality buildFunChord() can resolve to, including genre-driven ones.
export const CHORD_QUALITY_IDS = Object.freeze([
  "major", "minor", "dom7", "maj9", "min9", "dom7alt", "dim", "modal_open", "phrygian", "lydian", "raw",
]);
export const GENRE_IDS = Object.freeze(Object.values(GENRE_RULEBOOKS));

export class SessionError extends Error {
  constructor(path, message) {
    super(`${path}: ${message}`);
    this.name = "SessionError";
    this.path = path;
  }
}

function isPlainObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value)
    && Object.getPrototypeOf(value) === Object.prototype;
}

function expectKeys(value, path, keys) {
  if (!isPlainObject(value)) throw new SessionError(path, "must be an object");
  for (const key of Object.keys(value)) {
    if (!keys.includes(key)) throw new SessionError(`${path}.${key}`, "is not a known field");
  }
  for (const key of keys) {
    if (!Object.hasOwn(value, key)) throw new SessionError(`${path}.${key}`, "is missing");
  }
}

function expectInt(value, path, min, max) {
  if (!Number.isInteger(value) || value < min || value > max) {
    throw new SessionError(path, `must be an integer from ${min} to ${max}`);
  }
  return value;
}

function expectBool(value, path) {
  if (typeof value !== "boolean") throw new SessionError(path, "must be true or false");
  return value;
}

function expectEnum(value, path, allowed) {
  if (!allowed.includes(value)) throw new SessionError(path, `must be one of ${allowed.join(", ")}`);
  return value;
}

function expectPhrase(value, path) {
  if (typeof value !== "string") throw new SessionError(path, "must be text");
  const trimmed = value.trim();
  if (!trimmed || trimmed.length > MAX_PHRASE_LENGTH) {
    throw new SessionError(path, `must be 1 to ${MAX_PHRASE_LENGTH} characters`);
  }
  // Control characters have no place in a phrase and could hide content.
  if (/[\u0000-\u001f\u007f]/.test(trimmed)) throw new SessionError(path, "must not contain control characters");
  return trimmed;
}

/**
 * Validates a parsed session object and returns a frozen, normalized copy.
 * Throws SessionError naming the first offending field.
 */
export function validateSession(raw) {
  expectKeys(raw, "session", [
    "format", "version", "phrase", "tempo", "volume", "genre", "strictness",
    "acoustics", "funMachine", "plates", "mixer",
  ]);
  if (raw.format !== SESSION_FORMAT) throw new SessionError("session.format", `must be "${SESSION_FORMAT}"`);
  if (raw.version !== SESSION_VERSION) throw new SessionError("session.version", `must be ${SESSION_VERSION}`);

  expectKeys(raw.acoustics, "session.acoustics", ["enabled", "level", "crackle", "reverb", "ticks"]);
  const acoustics = Object.freeze({
    enabled: expectBool(raw.acoustics.enabled, "session.acoustics.enabled"),
    level: expectInt(raw.acoustics.level, "session.acoustics.level", 0, 100),
    crackle: expectBool(raw.acoustics.crackle, "session.acoustics.crackle"),
    reverb: expectBool(raw.acoustics.reverb, "session.acoustics.reverb"),
    ticks: expectBool(raw.acoustics.ticks, "session.acoustics.ticks"),
  });

  expectKeys(raw.funMachine, "session.funMachine", ["mode", "quality", "progression"]);
  const { progression } = raw.funMachine;
  if (!Array.isArray(progression) || progression.length !== 12) {
    throw new SessionError("session.funMachine.progression", "must list exactly 12 steps");
  }
  const funMachine = Object.freeze({
    mode: expectEnum(raw.funMachine.mode, "session.funMachine.mode", FUN_MODES),
    quality: expectEnum(raw.funMachine.quality, "session.funMachine.quality", FUN_QUALITIES),
    progression: Object.freeze(progression.map((step, index) => {
      const path = `session.funMachine.progression[${index}]`;
      if (step === null) return null;
      if (!Array.isArray(step) || step.length !== 2) throw new SessionError(path, "must be null or [root, quality]");
      return Object.freeze([expectInt(step[0], `${path}[0]`, 0, 11), expectEnum(step[1], `${path}[1]`, CHORD_QUALITY_IDS)]);
    })),
  });

  expectKeys(raw.plates, "session.plates", PLATE_IDS);
  const plates = {};
  for (const id of PLATE_IDS) {
    const path = `session.plates.${id}`;
    expectKeys(raw.plates[id], path, ["mutation", "cellCycles"]);
    const { cellCycles } = raw.plates[id];
    if (!Array.isArray(cellCycles) || cellCycles.length !== 12) {
      throw new SessionError(`${path}.cellCycles`, "must list exactly 12 counts");
    }
    plates[id] = Object.freeze({
      mutation: expectInt(raw.plates[id].mutation, `${path}.mutation`, 0, MAX_MUTATION),
      cellCycles: Object.freeze(cellCycles.map((count, index) => expectInt(count, `${path}.cellCycles[${index}]`, 0, MAX_CELL_CYCLES))),
    });
  }

  expectKeys(raw.mixer, "session.mixer", MIXER_CHANNEL_IDS);
  const mixer = {};
  for (const id of MIXER_CHANNEL_IDS) {
    const path = `session.mixer.${id}`;
    expectKeys(raw.mixer[id], path, ["fader", "pan", "muted", "soloed"]);
    mixer[id] = Object.freeze({
      fader: expectInt(raw.mixer[id].fader, `${path}.fader`, 0, 100),
      pan: expectInt(raw.mixer[id].pan, `${path}.pan`, -100, 100),
      muted: expectBool(raw.mixer[id].muted, `${path}.muted`),
      soloed: expectBool(raw.mixer[id].soloed, `${path}.soloed`),
    });
  }

  return Object.freeze({
    format: SESSION_FORMAT,
    version: SESSION_VERSION,
    phrase: expectPhrase(raw.phrase, "session.phrase"),
    tempo: expectInt(raw.tempo, "session.tempo", 36, 208),
    volume: expectInt(raw.volume, "session.volume", 0, 100),
    genre: expectEnum(raw.genre, "session.genre", GENRE_IDS),
    strictness: expectInt(raw.strictness, "session.strictness", 3, 14),
    acoustics,
    funMachine,
    plates: Object.freeze(plates),
    mixer: Object.freeze(mixer),
  });
}

export function parseSession(text) {
  if (typeof text !== "string") throw new SessionError("file", "must be text");
  if (new TextEncoder().encode(text).length > MAX_SESSION_BYTES) {
    throw new SessionError("file", `is larger than ${MAX_SESSION_BYTES / 1024} KB`);
  }
  let parsed;
  try {
    parsed = JSON.parse(text);
  } catch {
    throw new SessionError("file", "is not valid JSON");
  }
  return validateSession(parsed);
}

export function serializeSession(session) {
  return `${JSON.stringify(validateSession(session), null, 2)}\n`;
}

// --- On-device presets ------------------------------------------------------

export function emptyPresetStore() {
  return Object.freeze({ version: 1, presets: Object.freeze([]) });
}

function expectPresetName(value, path) {
  if (typeof value !== "string") throw new SessionError(path, "must be text");
  const name = value.trim().replace(/\s+/g, " ");
  if (!name || name.length > MAX_PRESET_NAME_LENGTH || /[\u0000-\u001f\u007f]/.test(name)) {
    throw new SessionError(path, `must be 1 to ${MAX_PRESET_NAME_LENGTH} printable characters`);
  }
  return name;
}

/**
 * Reads the stored preset list. A missing, corrupt, or foreign value yields an
 * empty store, and individual presets that fail validation are dropped, so one
 * bad entry never hides the others.
 */
export function parsePresetStore(text) {
  if (typeof text !== "string" || !text) return emptyPresetStore();
  let parsed;
  try {
    parsed = JSON.parse(text);
  } catch {
    return emptyPresetStore();
  }
  if (!isPlainObject(parsed) || parsed.version !== 1 || !Array.isArray(parsed.presets)) return emptyPresetStore();
  const presets = [];
  for (const entry of parsed.presets.slice(0, MAX_PRESETS)) {
    try {
      expectKeys(entry, "preset", ["name", "savedAt", "session"]);
      if (typeof entry.savedAt !== "string" || entry.savedAt.length > 40) throw new SessionError("preset.savedAt", "must be a timestamp");
      const name = expectPresetName(entry.name, "preset.name");
      if (presets.some((preset) => preset.name === name)) continue;
      presets.push(Object.freeze({ name, savedAt: entry.savedAt, session: validateSession(entry.session) }));
    } catch {
      // Skip just this entry.
    }
  }
  return Object.freeze({ version: 1, presets: Object.freeze(presets) });
}

// Saves or replaces a preset by name, newest first, capped at MAX_PRESETS.
export function upsertPreset(store, name, session, savedAt) {
  const cleanName = expectPresetName(name, "preset.name");
  const entry = Object.freeze({ name: cleanName, savedAt: String(savedAt), session: validateSession(session) });
  const others = store.presets.filter((preset) => preset.name !== cleanName);
  return Object.freeze({ version: 1, presets: Object.freeze([entry, ...others].slice(0, MAX_PRESETS)) });
}

export function removePreset(store, name) {
  return Object.freeze({ version: 1, presets: Object.freeze(store.presets.filter((preset) => preset.name !== name)) });
}

export function serializePresetStore(store) {
  return JSON.stringify({ version: 1, presets: store.presets });
}
