// Concert pitch for every voice (P8-04, D-078).
//
// All three synth paths (ensemble drones, plate schedulers, Fun Machine
// voices) turn MIDI notes into hertz here, so one setting retunes the whole
// band, live and in exports. It is host state, not score: the phrase still
// summons the same notes, and A4 only moves where those notes sit in hertz.

export const DEFAULT_REFERENCE_PITCH = 440;
export const MIN_REFERENCE_PITCH = 415;
export const MAX_REFERENCE_PITCH = 466;
// The choices offered in the UI: baroque, verdi, standard, orchestral, and
// the high historic pitch. Any whole number in range is accepted from files.
export const REFERENCE_PITCH_PRESETS = Object.freeze([415, 432, 440, 442, 444, 466]);

let reference = DEFAULT_REFERENCE_PITCH;

export function isReferencePitch(value) {
  return Number.isInteger(value) && value >= MIN_REFERENCE_PITCH && value <= MAX_REFERENCE_PITCH;
}

export function referencePitch() {
  return reference;
}

/** Sets A4 in hertz. Out-of-range or non-integer values are rejected. */
export function setReferencePitch(value) {
  const hz = Number(value);
  if (!isReferencePitch(hz)) throw new RangeError(`A4 must be a whole number from ${MIN_REFERENCE_PITCH} to ${MAX_REFERENCE_PITCH} Hz`);
  reference = hz;
  return reference;
}

export function midiToFrequency(note) {
  return reference * (2 ** ((note - 69) / 12));
}

/**
 * Returns a score with optional key (`rootOverride`, pitch class 0..11) and
 * scale (`scaleOverride`, index 0..7) overrides applied (P8-04, D-078).
 * Shifts `score.root` to the requested pitch class while keeping it near the
 * creature's original octave register (within [30, 65]).
 */
export function applyScoreOverrides(score, { rootOverride = null, scaleOverride = null } = {}) {
  if (!score) return score;
  if (rootOverride === null && scaleOverride === null) return score;
  let root = score.root;
  if (Number.isInteger(rootOverride) && rootOverride >= 0 && rootOverride <= 11) {
    const basePc = ((score.root % 12) + 12) % 12;
    let delta = ((rootOverride - basePc + 18) % 12) - 6;
    if (score.root + delta < 30) delta += 12;
    if (score.root + delta > 65) delta -= 12;
    root = score.root + delta;
  }
  const scale = Number.isInteger(scaleOverride) && scaleOverride >= 0 && scaleOverride <= 7
    ? scaleOverride
    : score.scale;
  if (root === score.root && scale === score.scale) return score;
  return Object.freeze({ ...score, root, scale });
}

/**
 * Base step unit duration in seconds.
 * - With `barLock44 = false` (native parlor feel): each step unit is an eighth
 *   note (`60 / bpm / 2`), so a 12-step pass takes 6 quarter-beats (one 6/4 bar
 *   or two 3/4 bars).
 * - With `barLock44 = true` (P8-05, D-079 Phase 1): a 12-step pass is locked to
 *   exactly one 4/4 bar (4 quarter-beats = `240 / bpm`), so every pass and loop
 *   lands squarely on a DAW's 4/4 barlines at the stated BPM.
 */
export function stepUnitSeconds(bpm, rhythmTemplate = [1, 1, 1, 1], barLock44 = false) {
  const safeBpm = Number(bpm) > 0 ? Number(bpm) : 108;
  if (!barLock44) return 60 / safeBpm / 2;
  let unitsInPass = 0;
  for (let s = 0; s < 12; s += 1) {
    unitsInPass += rhythmTemplate[s % rhythmTemplate.length];
  }
  const barSeconds = (60 / safeBpm) * 4;
  return barSeconds / (unitsInPass || 12);
}
