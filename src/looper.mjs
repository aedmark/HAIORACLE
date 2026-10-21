// The Fun Machine loop machine (D-039, P5-26). Pure model only: a song of
// loops, each loop a stack of takes, plus the recorder that turns held keys
// into takes and the rule that decides which take the band follows. The host
// (src/app.mjs) schedules the sound and draws the strip.
//
//   song  = { loops: [loop …] }                    at most MAX_LOOPS
//   loop  = { repeats, layers: [take …] }           repeats 1..MAX_REPEATS, at most MAX_LAYERS
//   take  = [slot × 12]                             one slot per loop step
//   slot  = null | { key, style, voice }            manual position 0..12, accompaniment style, voice (D-040)
//
// Steps are the grain because the accompanist already plays on the step grid,
// so a slot per step replays exactly what was heard. A slot keeps the voice it
// was played in, so stacked layers can be different instruments; "creature"
// is the session phrase's own voice, which the saved phrase reproduces.

import { ACCOMPANIMENT_STYLES } from "./accompaniment.mjs";
import { CREATURE_VOICE_ID, DEFAULT_VOICE_ID, VOICE_IDS } from "./voices.mjs";

export const LOOP_STEPS = 12;
export const MAX_LOOPS = 16;
export const MAX_LAYERS = 4;
export const MAX_REPEATS = 8;
// Exports render the whole song, so its length is bounded (D-039).
export const MAX_SONG_PASSES = 32;
const MAX_KEY = 12;
export const SLOT_VOICES = Object.freeze([CREATURE_VOICE_ID, ...VOICE_IDS]);

const freezeSong = (loops) => Object.freeze({ loops: Object.freeze(loops) });
const freezeLoop = (repeats, layers) => Object.freeze({ repeats, layers: Object.freeze(layers) });

export function emptySong() {
  return freezeSong([]);
}

export function emptyTake() {
  return Object.freeze(Array(LOOP_STEPS).fill(null));
}

export function makeSlot(key, style, voice = DEFAULT_VOICE_ID) {
  if (!Number.isInteger(key) || key < 0 || key > MAX_KEY) throw new RangeError(`A slot's key must be 0..${MAX_KEY}`);
  if (!ACCOMPANIMENT_STYLES.includes(style)) throw new RangeError(`Unknown accompaniment style: ${style}`);
  if (!SLOT_VOICES.includes(voice)) throw new RangeError(`Unknown voice: ${voice}`);
  return Object.freeze({ key, style, voice });
}

export function isEmptyTake(take) {
  return take.every((slot) => slot === null);
}

/** Total passes of the band the song plays before it starts over. */
export function songPasses(song) {
  return song.loops.reduce((sum, loop) => sum + loop.repeats, 0);
}

export function canAppendLoop(song) {
  return song.loops.length < MAX_LOOPS && songPasses(song) < MAX_SONG_PASSES;
}

export function canOverdub(song, loopIndex) {
  const loop = song.loops[loopIndex];
  return Boolean(loop) && loop.layers.length < MAX_LAYERS;
}

// Every edit returns a new frozen song, or the same song when the edit is not
// allowed (full song, full loop, empty take, bad index), so callers can test
// `next === song` to tell the visitor nothing changed.

export function appendLoop(song, take) {
  if (isEmptyTake(take) || !canAppendLoop(song)) return song;
  return freezeSong([...song.loops, freezeLoop(1, [Object.freeze([...take])])]);
}

export function overdubLayer(song, loopIndex, take) {
  if (isEmptyTake(take) || !canOverdub(song, loopIndex)) return song;
  const loops = [...song.loops];
  const loop = loops[loopIndex];
  loops[loopIndex] = freezeLoop(loop.repeats, [...loop.layers, Object.freeze([...take])]);
  return freezeSong(loops);
}

/** Removes the newest layer of a loop; a loop left with no layers is removed. */
export function undoLayer(song, loopIndex) {
  const loop = song.loops[loopIndex];
  if (!loop) return song;
  if (loop.layers.length <= 1) return deleteLoop(song, loopIndex);
  const loops = [...song.loops];
  loops[loopIndex] = freezeLoop(loop.repeats, loop.layers.slice(0, -1));
  return freezeSong(loops);
}

export function deleteLoop(song, loopIndex) {
  if (!song.loops[loopIndex]) return song;
  return freezeSong(song.loops.filter((_, index) => index !== loopIndex));
}

export function moveLoop(song, loopIndex, delta) {
  const target = loopIndex + delta;
  if (!song.loops[loopIndex] || target < 0 || target >= song.loops.length || delta === 0) return song;
  const loops = [...song.loops];
  const [loop] = loops.splice(loopIndex, 1);
  loops.splice(target, 0, loop);
  return freezeSong(loops);
}

/** Sets a loop's repeats, clamped to 1..MAX_REPEATS and to the song's pass budget. */
export function setRepeats(song, loopIndex, repeats) {
  const loop = song.loops[loopIndex];
  if (!loop || !Number.isFinite(repeats)) return song;
  const budget = MAX_SONG_PASSES - (songPasses(song) - loop.repeats);
  const next = Math.max(1, Math.min(MAX_REPEATS, budget, Math.trunc(repeats)));
  if (next === loop.repeats) return song;
  const loops = [...song.loops];
  loops[loopIndex] = freezeLoop(next, loop.layers);
  return freezeSong(loops);
}

/** A valid selected loop after an edit: the same index if it exists, else the last loop, else null. */
export function clampSelection(song, index) {
  if (!song.loops.length) return null;
  if (!Number.isInteger(index) || index < 0) return 0;
  return Math.min(index, song.loops.length - 1);
}

/**
 * Where the song is after `absoluteStep` steps (counted from the song's first
 * step): the loop, which of its repeats, and the step within the loop. The song
 * starts over after its last pass. Returns null for an empty song.
 */
export function songPosition(song, absoluteStep) {
  const passes = songPasses(song);
  if (passes === 0) return null;
  const step = ((Math.trunc(absoluteStep) % LOOP_STEPS) + LOOP_STEPS) % LOOP_STEPS;
  let pass = ((Math.floor(absoluteStep / LOOP_STEPS) % passes) + passes) % passes;
  for (let loopIndex = 0; loopIndex < song.loops.length; loopIndex += 1) {
    const { repeats } = song.loops[loopIndex];
    if (pass < repeats) return Object.freeze({ loopIndex, repeat: pass, step });
    pass -= repeats;
  }
  return null;
}

/** Every layer's slot at a step of a loop, oldest first (empty slots left out). */
export function slotsAt(loop, step) {
  return loop.layers
    .map((take, layerIndex) => ({ layerIndex, slot: take[step] }))
    .filter((entry) => entry.slot !== null);
}

/**
 * The slot the band follows at a step: a live key overrides everything;
 * otherwise the newest layer holding a key there, falling back to older ones.
 */
export function leadSlotAt(loop, step, liveSlot = null) {
  if (liveSlot) return liveSlot;
  if (!loop) return null;
  for (let layerIndex = loop.layers.length - 1; layerIndex >= 0; layerIndex -= 1) {
    const slot = loop.layers[layerIndex][step];
    if (slot) return slot;
  }
  return null;
}

// ---------------------------------------------------------------------------
// The recorder. RECORD NEW LOOP and OVERDUB arm it; a take starts on the next
// loop boundary (for OVERDUB, the next pass of the chosen loop), records one
// slot per step for a full pass, and then hands the take back.

export function idleRecorder() {
  return Object.freeze({ mode: "idle", kind: null, loopIndex: null, take: null });
}

/**
 * Events:
 *  - `{ type: "arm", kind: "new" }` or `{ type: "arm", kind: "overdub", loopIndex }`
 *  - `{ type: "cancel" }`
 *  - `{ type: "step", step, loopIndex, held }`: a loop step is about to sound.
 *    `step` is 0..11, `loopIndex` is the song loop playing (null with no song),
 *    and `held` is the live slot (or null).
 * Returns `{ recorder, finished }`. `finished` is `{ kind, loopIndex, take }`
 * when a pass of recording completes, else null; an empty take is still
 * reported so the host can say it was discarded.
 */
export function recorderReduce(recorder, event) {
  if (event.type === "arm") {
    if (event.kind === "new") {
      return { recorder: Object.freeze({ mode: "armed", kind: "new", loopIndex: null, take: null }), finished: null };
    }
    if (event.kind === "overdub" && Number.isInteger(event.loopIndex) && event.loopIndex >= 0) {
      return { recorder: Object.freeze({ mode: "armed", kind: "overdub", loopIndex: event.loopIndex, take: null }), finished: null };
    }
    return { recorder, finished: null };
  }
  if (event.type === "cancel") return { recorder: idleRecorder(), finished: null };
  if (event.type !== "step" || recorder.mode === "idle") return { recorder, finished: null };

  let current = recorder;
  if (current.mode === "armed") {
    const atBoundary = event.step === 0;
    const onTarget = current.kind === "new" || event.loopIndex === current.loopIndex;
    if (!atBoundary || !onTarget) return { recorder: current, finished: null };
    current = Object.freeze({ ...current, mode: "recording", take: emptyTake() });
  }
  const take = [...current.take];
  take[event.step] = event.held ?? null;
  if (event.step === LOOP_STEPS - 1) {
    return {
      recorder: idleRecorder(),
      finished: Object.freeze({ kind: current.kind, loopIndex: current.loopIndex, take: Object.freeze(take) }),
    };
  }
  return { recorder: Object.freeze({ ...current, take: Object.freeze(take) }), finished: null };
}

// ---------------------------------------------------------------------------
// Validation for saved sessions (phase 4). Strict and allowlisted, like the
// rest of src/session.mjs: anything outside the shape names the bad field.

export class SongError extends Error {
  constructor(path, message) {
    super(`${path} ${message}`);
    this.name = "SongError";
    this.path = path;
  }
}

const isPlainObject = (value) => value !== null && typeof value === "object" && !Array.isArray(value)
  && Object.getPrototypeOf(value) === Object.prototype;

function expectExactKeys(value, path, keys) {
  if (!isPlainObject(value)) throw new SongError(path, "must be an object");
  const actual = Object.keys(value).sort();
  const wanted = [...keys].sort();
  for (const key of actual) if (!wanted.includes(key)) throw new SongError(`${path}.${key}`, "is not allowed");
  for (const key of wanted) if (!actual.includes(key)) throw new SongError(`${path}.${key}`, "is required");
}

/**
 * `legacy` reads songs saved before slots kept a voice (sessions v4): their
 * slots are `{ key, style }` and play in VELVET PAD, as they did when saved.
 */
export function validateSong(raw, path = "song", { legacy = false } = {}) {
  expectExactKeys(raw, path, ["loops"]);
  if (!Array.isArray(raw.loops) || raw.loops.length > MAX_LOOPS) throw new SongError(`${path}.loops`, `must list at most ${MAX_LOOPS} loops`);
  const loops = raw.loops.map((loop, loopIndex) => {
    const loopPath = `${path}.loops[${loopIndex}]`;
    expectExactKeys(loop, loopPath, ["repeats", "layers"]);
    if (!Number.isInteger(loop.repeats) || loop.repeats < 1 || loop.repeats > MAX_REPEATS) {
      throw new SongError(`${loopPath}.repeats`, `must be an integer 1..${MAX_REPEATS}`);
    }
    if (!Array.isArray(loop.layers) || loop.layers.length < 1 || loop.layers.length > MAX_LAYERS) {
      throw new SongError(`${loopPath}.layers`, `must list 1..${MAX_LAYERS} takes`);
    }
    const layers = loop.layers.map((take, layerIndex) => {
      const takePath = `${loopPath}.layers[${layerIndex}]`;
      if (!Array.isArray(take) || take.length !== LOOP_STEPS) throw new SongError(takePath, `must list exactly ${LOOP_STEPS} steps`);
      const slots = take.map((slot, step) => {
        const slotPath = `${takePath}[${step}]`;
        if (slot === null) return null;
        expectExactKeys(slot, slotPath, legacy ? ["key", "style"] : ["key", "style", "voice"]);
        if (!Number.isInteger(slot.key) || slot.key < 0 || slot.key > MAX_KEY) throw new SongError(`${slotPath}.key`, `must be an integer 0..${MAX_KEY}`);
        if (!ACCOMPANIMENT_STYLES.includes(slot.style)) throw new SongError(`${slotPath}.style`, `must be one of ${ACCOMPANIMENT_STYLES.join(", ")}`);
        const voice = legacy ? DEFAULT_VOICE_ID : slot.voice;
        if (!SLOT_VOICES.includes(voice)) throw new SongError(`${slotPath}.voice`, `must be one of ${SLOT_VOICES.join(", ")}`);
        return Object.freeze({ key: slot.key, style: slot.style, voice });
      });
      if (slots.every((slot) => slot === null)) throw new SongError(takePath, "must hold at least one key");
      return Object.freeze(slots);
    });
    return freezeLoop(loop.repeats, layers);
  });
  const song = freezeSong(loops);
  if (songPasses(song) > MAX_SONG_PASSES) throw new SongError(`${path}.loops`, `must total at most ${MAX_SONG_PASSES} passes`);
  return song;
}
