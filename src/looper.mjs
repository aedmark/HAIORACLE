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
export const LOOP_ROLES = Object.freeze(["intro", "main", "bridge", "outro"]);
export const DEFAULT_LOOP_ROLE = "main";

const freezeSong = (loops) => Object.freeze({ loops: Object.freeze(loops) });
const freezeLoop = (repeats, layers, role) => {
  const loop = { repeats, layers: Object.freeze(layers) };
  if (role !== undefined) loop.role = role;
  return Object.freeze(loop);
};

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

export function canInsertLoops(song, count = 1) {
  return (song.loops.length + count) <= MAX_LOOPS && (songPasses(song) + count) <= MAX_SONG_PASSES;
}

export function canOverdub(song, loopIndex) {
  const loop = song.loops[loopIndex];
  return Boolean(loop) && loop.layers.length < MAX_LAYERS;
}

// Every edit returns a new frozen song, or the same song when the edit is not
// allowed (full song, full loop, empty take, bad index), so callers can test
// `next === song` to tell the visitor nothing changed.

export function appendLoop(song, take, role) {
  if (isEmptyTake(take) || !canAppendLoop(song)) return song;
  return freezeSong([...song.loops, freezeLoop(1, [Object.freeze([...take])], role)]);
}

/** Inserts a multi-loop section (e.g. 4-bar Intro, Bridge, or Outro) at the target index. */
export function insertSection(song, role, takes, atIndex = null) {
  if (!Array.isArray(takes) || takes.length === 0 || !canInsertLoops(song, takes.length)) return song;
  if (role !== undefined && !LOOP_ROLES.includes(role)) return song;
  const newLoops = takes.map((take) => freezeLoop(1, [Object.freeze([...take])], role));
  const targetIndex = atIndex === null ? song.loops.length : Math.max(0, Math.min(song.loops.length, atIndex));
  const loops = [...song.loops];
  loops.splice(targetIndex, 0, ...newLoops);
  return freezeSong(loops);
}

/**
 * Calculates which pass (0..3) of a 4-pass section (Intro, Groove, Bridge, Outro)
 * a loop/repeat belongs to, based on preceding contiguous loops of the same role.
 */
export function sectionPassForLoop(song, loopIndex, repeat = 0) {
  if (!song || !Array.isArray(song.loops) || loopIndex === null || loopIndex === undefined) return null;
  const loop = song.loops[loopIndex];
  if (!loop) return null;
  const role = loop.role ?? DEFAULT_LOOP_ROLE;
  let sectionPassCount = 0;
  let startIdx = loopIndex;
  while (startIdx > 0 && (song.loops[startIdx - 1]?.role ?? DEFAULT_LOOP_ROLE) === role) {
    startIdx -= 1;
  }
  for (let i = startIdx; i < loopIndex; i += 1) {
    sectionPassCount += song.loops[i].repeats;
  }
  sectionPassCount += repeat;
  return sectionPassCount % 4;
}

export function overdubLayer(song, loopIndex, take) {
  if (isEmptyTake(take) || !canOverdub(song, loopIndex)) return song;
  const loops = [...song.loops];
  const loop = loops[loopIndex];
  loops[loopIndex] = freezeLoop(loop.repeats, [...loop.layers, Object.freeze([...take])], loop.role);
  return freezeSong(loops);
}

/** Removes the newest layer of a loop; a loop left with no layers is removed. */
export function undoLayer(song, loopIndex) {
  const loop = song.loops[loopIndex];
  if (!loop) return song;
  if (loop.layers.length <= 1) return deleteLoop(song, loopIndex);
  const loops = [...song.loops];
  loops[loopIndex] = freezeLoop(loop.repeats, loop.layers.slice(0, -1), loop.role);
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

/**
 * Sets or clears a single step's slot in a loop layer. If the song is empty
 * and a slot is provided, a new loop with one layer is created.
 */
export function setLoopSlot(song, loopIndex, layerIndex, step, slot = null) {
  if (!Number.isInteger(step) || step < 0 || step >= LOOP_STEPS) return song;
  if (!song.loops.length) {
    if (!slot) return song;
    const take = Array(LOOP_STEPS).fill(null);
    take[step] = slot;
    return freezeSong([freezeLoop(1, [Object.freeze(take)])]);
  }
  const lIdx = Math.max(0, Math.min(song.loops.length - 1, loopIndex ?? (song.loops.length - 1)));
  const loop = song.loops[lIdx];
  const layIdx = Math.max(0, Math.min(loop.layers.length - 1, layerIndex ?? (loop.layers.length - 1)));
  const take = [...loop.layers[layIdx]];
  take[step] = slot ?? null;
  const layers = [...loop.layers];
  layers[layIdx] = Object.freeze(take);
  const loops = [...song.loops];
  loops[lIdx] = freezeLoop(loop.repeats, layers, loop.role);
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
  loops[loopIndex] = freezeLoop(next, loop.layers, loop.role);
  return freezeSong(loops);
}

/** Sets a loop's musical section role: "intro", "main", "bridge", or "outro". */
export function setLoopRole(song, loopIndex, role) {
  const loop = song.loops[loopIndex];
  if (!loop || !LOOP_ROLES.includes(role)) return song;
  if ((loop.role ?? DEFAULT_LOOP_ROLE) === role) return song;
  const loops = [...song.loops];
  loops[loopIndex] = freezeLoop(loop.repeats, loop.layers, role);
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
  const rawPass = Math.floor(absoluteStep / LOOP_STEPS);
  if (rawPass < 0) return null;

  let p = ((rawPass % passes) + passes) % passes;
  for (let loopIndex = 0; loopIndex < song.loops.length; loopIndex += 1) {
    const { repeats } = song.loops[loopIndex];
    if (p < repeats) return Object.freeze({ loopIndex, repeat: p, step, role: song.loops[loopIndex].role ?? DEFAULT_LOOP_ROLE });
    p -= repeats;
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
  return Object.freeze({ mode: "idle", kind: null, loopIndex: null, take: null, countIn: 0, step: null, anticipatedSlot: null });
}

/**
 * Events:
 *  - `{ type: "arm", kind: "new", countIn }` or `{ type: "arm", kind: "overdub", loopIndex, countIn }`
 *  - `{ type: "cancel" }`
 *  - `{ type: "slot", step, slot }`: set or update a recorded slot during active recording.
 *  - `{ type: "anticipate", slot }`: latch an incoming keystroke struck during armed count-in onto step 0.
 *  - `{ type: "step", step, loopIndex, held }`: a loop step is about to sound.
 *    `step` is 0..11, `loopIndex` is the song loop playing (null with no song),
 *    and `held` is the live slot (or null).
 * Returns `{ recorder, finished }`. `finished` is `{ kind, loopIndex, take }`
 * when a pass of recording completes, else null; an empty take is still
 * reported so the host can say it was discarded.
 */
export function recorderReduce(recorder, event) {
  if (event.type === "arm") {
    const countIn = Math.max(0, Number.isInteger(event.countIn) ? event.countIn : (event.countIn ? LOOP_STEPS : 0));
    if (event.kind === "new") {
      return { recorder: Object.freeze({ mode: "armed", kind: "new", loopIndex: null, take: null, countIn, step: null, anticipatedSlot: null }), finished: null };
    }
    if (event.kind === "overdub" && Number.isInteger(event.loopIndex) && event.loopIndex >= 0) {
      return { recorder: Object.freeze({ mode: "armed", kind: "overdub", loopIndex: event.loopIndex, take: null, countIn, step: null, anticipatedSlot: null }), finished: null };
    }
    return { recorder, finished: null };
  }
  if (event.type === "cancel") return { recorder: idleRecorder(), finished: null };
  if (event.type === "anticipate") {
    if (recorder.mode !== "armed") return { recorder, finished: null };
    return { recorder: Object.freeze({ ...recorder, anticipatedSlot: event.slot ?? null }), finished: null };
  }
  if (event.type === "slot") {
    if (recorder.mode !== "recording" || !recorder.take) return { recorder, finished: null };
    const step = Number.isInteger(event.step) ? ((event.step % LOOP_STEPS) + LOOP_STEPS) % LOOP_STEPS : null;
    if (step === null) return { recorder, finished: null };
    const take = [...recorder.take];
    take[step] = event.slot ?? null;
    return { recorder: Object.freeze({ ...recorder, take: Object.freeze(take) }), finished: null };
  }
  if (event.type !== "step" || recorder.mode === "idle") return { recorder, finished: null };

  let current = recorder;
  if (current.mode === "armed") {
    if (current.countIn > 0) {
      const nextCountIn = current.countIn - 1;
      return {
        recorder: Object.freeze({ ...current, countIn: nextCountIn, step: event.step }),
        finished: null,
      };
    }
    const atBoundary = event.step === 0;
    const onTarget = current.kind === "new" || event.loopIndex === current.loopIndex;
    if (!atBoundary || !onTarget) return { recorder: Object.freeze({ ...current, step: event.step }), finished: null };
    current = Object.freeze({ ...current, mode: "recording", take: emptyTake(), countIn: 0, step: 0 });
  }
  const take = [...current.take];
  take[event.step] = (event.step === 0 && current.anticipatedSlot)
    ? current.anticipatedSlot
    : (event.held ?? take[event.step] ?? null);
  current = current.anticipatedSlot ? Object.freeze({ ...current, anticipatedSlot: null }) : current;
  if (event.step === LOOP_STEPS - 1) {
    return {
      recorder: idleRecorder(),
      finished: Object.freeze({ kind: current.kind, loopIndex: current.loopIndex, take: Object.freeze(take) }),
    };
  }
  return { recorder: Object.freeze({ ...current, take: Object.freeze(take), step: event.step }), finished: null };
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
    const loopKeys = Object.keys(loop);
    for (const key of loopKeys) {
      if (!["repeats", "layers", "role"].includes(key)) throw new SongError(`${loopPath}.${key}`, "is not allowed");
    }
    if (!("repeats" in loop)) throw new SongError(`${loopPath}.repeats`, "is required");
    if (!("layers" in loop)) throw new SongError(`${loopPath}.layers`, "is required");
    if (loop.role !== undefined && !LOOP_ROLES.includes(loop.role)) {
      throw new SongError(`${loopPath}.role`, `must be one of ${LOOP_ROLES.join(", ")}`);
    }
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
      if (loop.role !== "main" && slots.every((slot) => slot === null)) throw new SongError(takePath, "must hold at least one key");
      return Object.freeze(slots);
    });
    return freezeLoop(loop.repeats, layers, loop.role);
  });
  const song = freezeSong(loops);
  if (songPasses(song) > MAX_SONG_PASSES) throw new SongError(`${path}.loops`, `must total at most ${MAX_SONG_PASSES} passes`);
  return song;
}
