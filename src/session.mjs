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

import { ACCOMPANIMENT_STYLES } from "./accompaniment.mjs";
import { CREATURE_GENRE, genreCodes } from "./conductor.mjs";
import { SLOT_VOICES, SongError, emptySong, validateSong } from "./looper.mjs";
import { DEFAULT_VOICE_ID } from "./voices.mjs";
import { MIXER_CHANNEL_IDS } from "./mixer.mjs";
import { DEFAULT_REFERENCE_PITCH, MAX_REFERENCE_PITCH, MIN_REFERENCE_PITCH } from "./tuning.mjs";
import { ENGINE_VERSION } from "./version.mjs";

export const SESSION_FORMAT = "whimsy-session";
// Version 2 (D-028) replaced the Fun Machine's mode and chord quality with an
// accompaniment style. Version 1 files still open and are upgraded on read.
// Version 7 (P8-03, P8-04, D-077, D-078) adds engineVersion and optional
// rootOverride, scaleOverride, referencePitch, and barLock.
export const SESSION_VERSION = 7;
export const SESSION_FILE_EXTENSION = "fun";
export const MAX_SESSION_BYTES = 64 * 1024;
export const MAX_PHRASE_LENGTH = 72;
export const MAX_CELL_CYCLES = 999;
export const MAX_MUTATION = 9999;

export const PRESET_STORAGE_KEY = "whimsy-machine.presets.v1";
export const MAX_PRESETS = 24;
export const MAX_PRESET_NAME_LENGTH = 40;

export const PLATE_IDS = Object.freeze(["beat", "bass", "harmony", "chime", "chant"]);
export const FUN_STYLES = ACCOMPANIMENT_STYLES;
// Version 1 fields, accepted only to upgrade older files.
const V1_FUN_MODES = Object.freeze(["auto_chord", "lead"]);
const V1_FUN_QUALITIES = Object.freeze(["auto", "major", "minor", "dom7", "maj9", "dim", "modal_open"]);
// Every quality buildFunChord() can resolve to, including genre-driven ones.
export const CHORD_QUALITY_IDS = Object.freeze([
  "major", "minor", "dom7", "maj9", "min9", "dom7alt", "dim", "modal_open", "phrygian", "lydian", "raw",
  "min7", "maj7", "half_diminished", "half-diminished", "augmented", "sus4", "major_6",
]);

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
  // v4 adds the loop machine's song (D-039); v1–v3 open with an empty song.
  // v5 adds the Fun Machine's voice and a voice on every recorded slot
  // (D-040); v1–v4 open in VELVET PAD, the voice they were made in.
  // v6 adds `varied`: whether the creature varies its genre (D-043). Older
  // files were made before variation existed, so they open AS WRITTEN.
  const keys = [
    "format", "version", "phrase", "tempo", "volume", "genre", "strictness",
    "acoustics", "funMachine", "plates", "mixer",
  ];
  // The version decides which keys belong, so an unknown version is named first.
  if (isPlainObject(raw) && ![1, 2, 3, 4, 5, 6, SESSION_VERSION].includes(raw.version)) {
    throw new SessionError("session.version", `must be 1 to ${SESSION_VERSION}`);
  }
  const versionKeys = [
    ...keys,
    ...(raw?.version >= 4 ? ["song"] : []),
    ...(raw?.version >= 6 ? ["varied"] : []),
    ...(raw?.version >= 7 ? ["engineVersion", "rootOverride", "scaleOverride", "referencePitch", "barLock"] : []),
  ];
  expectKeys(raw, "session", versionKeys);
  if (raw.format !== SESSION_FORMAT) throw new SessionError("session.format", `must be "${SESSION_FORMAT}"`);

  expectKeys(raw.acoustics, "session.acoustics", ["enabled", "level", "crackle", "reverb", "ticks"]);
  const acoustics = Object.freeze({
    enabled: expectBool(raw.acoustics.enabled, "session.acoustics.enabled"),
    level: expectInt(raw.acoustics.level, "session.acoustics.level", 0, 100),
    crackle: expectBool(raw.acoustics.crackle, "session.acoustics.crackle"),
    reverb: expectBool(raw.acoustics.reverb, "session.acoustics.reverb"),
    ticks: expectBool(raw.acoustics.ticks, "session.acoustics.ticks"),
  });

  // v3 stores only the accompaniment style. Older files still open: v1's
  // chord mode becomes PROGRESSION and its lead solo ARPEGGIO, and the 12-step
  // progression that v1 and v2 stored is checked, then dropped, because the
  // loop sequencer that played it was removed (D-038).
  let style;
  let voice = DEFAULT_VOICE_ID;
  if (raw.version >= 5) {
    expectKeys(raw.funMachine, "session.funMachine", ["style", "voice"]);
    style = expectEnum(raw.funMachine.style, "session.funMachine.style", FUN_STYLES);
    voice = expectEnum(raw.funMachine.voice, "session.funMachine.voice", SLOT_VOICES);
  } else if (raw.version >= 3) {
    expectKeys(raw.funMachine, "session.funMachine", ["style"]);
    style = expectEnum(raw.funMachine.style, "session.funMachine.style", FUN_STYLES);
  } else {
    if (raw.version === 1) {
      expectKeys(raw.funMachine, "session.funMachine", ["mode", "quality", "progression"]);
      const mode = expectEnum(raw.funMachine.mode, "session.funMachine.mode", V1_FUN_MODES);
      expectEnum(raw.funMachine.quality, "session.funMachine.quality", V1_FUN_QUALITIES);
      style = mode === "lead" ? "arpeggio" : "progression";
    } else {
      expectKeys(raw.funMachine, "session.funMachine", ["style", "progression"]);
      style = expectEnum(raw.funMachine.style, "session.funMachine.style", FUN_STYLES);
    }
    const { progression } = raw.funMachine;
    if (!Array.isArray(progression) || progression.length !== 12) {
      throw new SessionError("session.funMachine.progression", "must list exactly 12 steps");
    }
    progression.forEach((step, index) => {
      const path = `session.funMachine.progression[${index}]`;
      if (step === null) return;
      if (!Array.isArray(step) || step.length !== 2) throw new SessionError(path, "must be null or [root, quality]");
      expectInt(step[0], `${path}[0]`, 0, 11);
      expectEnum(step[1], `${path}[1]`, CHORD_QUALITY_IDS);
    });
  }
  const funMachine = Object.freeze({ style, voice });

  let song = emptySong();
  if (raw.version >= 4) {
    try {
      song = validateSong(raw.song, "session.song", { legacy: raw.version === 4 });
    } catch (error) {
      if (error instanceof SongError) throw new SessionError(error.path, error.message.slice(error.path.length + 1));
      throw error;
    }
  }

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

  const engineVersion = raw.version >= 7
    ? expectInt(raw.engineVersion, "session.engineVersion", 1, 999)
    : ENGINE_VERSION;
  const rootOverride = raw.version >= 7 && raw.rootOverride !== null
    ? expectInt(raw.rootOverride, "session.rootOverride", 0, 11)
    : null;
  const scaleOverride = raw.version >= 7 && raw.scaleOverride !== null
    ? expectInt(raw.scaleOverride, "session.scaleOverride", 0, 7)
    : null;
  const referencePitch = raw.version >= 7
    ? expectInt(raw.referencePitch, "session.referencePitch", MIN_REFERENCE_PITCH, MAX_REFERENCE_PITCH)
    : DEFAULT_REFERENCE_PITCH;

  return Object.freeze({
    format: SESSION_FORMAT,
    version: SESSION_VERSION,
    engineVersion,
    phrase: expectPhrase(raw.phrase, "session.phrase"),
    tempo: expectInt(raw.tempo, "session.tempo", 36, 208),
    volume: expectInt(raw.volume, "session.volume", 0, 100),
    // Genre codes come from the installed Inform 7 rulebooks (D-033); validating
    // before they are installed throws instead of rejecting every genre.
    // "creature" is THE CREATURE'S OWN rulebook, rebuilt from the phrase (D-043).
    genre: expectEnum(raw.genre, "session.genre", [CREATURE_GENRE, ...genreCodes()]),
    strictness: expectInt(raw.strictness, "session.strictness", 3, 14),
    varied: raw.version >= 6 ? expectBool(raw.varied, "session.varied") : false,
    rootOverride,
    scaleOverride,
    referencePitch,
    // 4/4 BAR LOCK (P8-05, D-079): each 12-step pass fills one 4/4 bar.
    barLock: raw.version >= 7 ? expectBool(raw.barLock, "session.barLock") : false,
    acoustics,
    funMachine,
    plates: Object.freeze(plates),
    mixer: Object.freeze(mixer),
    song,
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
  // Presets name genres from the installed rulebooks. Reading them earlier must
  // fail loudly: dropping every preset here would let the next save erase them.
  genreCodes();
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

function isQuotaExceededError(error) {
  return (
    error?.name === "QuotaExceededError" ||
    error?.name === "NS_ERROR_DOM_QUOTA_REACHED" ||
    error?.code === 22 ||
    error?.code === 1014 ||
    /quota/i.test(error?.message ?? "")
  );
}

/**
 * Reads and validates the preset store from a Web Storage-compatible object.
 * Missing or blocked storage yields an empty store; throws if genre rulebooks
 * have not been installed yet.
 */
export function readPresetStoreFrom(storage, key = PRESET_STORAGE_KEY) {
  let text;
  try {
    if (!storage || typeof storage.getItem !== "function") return emptyPresetStore();
    text = storage.getItem(key);
  } catch {
    return emptyPresetStore();
  }
  return parsePresetStore(text);
}

/**
 * Writes the preset store to a Web Storage-compatible object. If a write hits
 * a storage quota limit (`QuotaExceededError`), evicts the oldest presets from
 * the tail until the newest presets fit; if even a single preset exceeds the
 * remaining quota or storage is blocked, returns `false` without corrupting
 * the existing stored entry.
 */
export function writePresetStoreTo(storage, store, key = PRESET_STORAGE_KEY) {
  if (!storage) return false;
  if (!store?.presets?.length) {
    try {
      storage.removeItem(key);
      return true;
    } catch {
      return false;
    }
  }
  for (let count = store.presets.length; count >= 1; count -= 1) {
    const candidate = count === store.presets.length
      ? store
      : Object.freeze({ version: 1, presets: Object.freeze(store.presets.slice(0, count)) });
    try {
      storage.setItem(key, serializePresetStore(candidate));
      return true;
    } catch (error) {
      if (!isQuotaExceededError(error)) return false;
    }
  }
  return false;
}

