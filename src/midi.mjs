// Standard MIDI File (Type 1) writer for the ensemble score. Pure functions:
// the host captures note events from its schedulers and hands them here.
// One conductor track carries tempo; each instrument gets its own track and
// MIDI channel, so a DAW opens the loop as separate, named parts.

export const MIDI_PPQ = 480;
export const DRUM_CHANNEL = 9;

// General MIDI kit notes for the Malbolge percussion voices.
export const GM_DRUMS = Object.freeze({ kick: 36, snare: 38, hat: 42, openHat: 46 });

// Track layout. Programs are zero-based General MIDI numbers chosen as the
// nearest stock timbre: square lead, warm pad, synth bass, church organ,
// tubular bells, choir aahs.
export const MIDI_TRACKS = Object.freeze([
  Object.freeze({ id: "lead", name: "LEAD · LOLCODE", channel: 0, program: 80 }),
  Object.freeze({ id: "fun", name: "MANUAL · FUN MACHINE", channel: 1, program: 89 }),
  Object.freeze({ id: "beat", name: "PULSE · MALBOLGE", channel: DRUM_CHANNEL, program: null }),
  Object.freeze({ id: "bass", name: "BASS · BRAINFUCK", channel: 2, program: 38 }),
  Object.freeze({ id: "harmony", name: "ORGAN · BEFUNGE", channel: 3, program: 19 }),
  Object.freeze({ id: "chime", name: "CHIMES · PIET·FRACTRAN", channel: 4, program: 14 }),
  Object.freeze({ id: "chant", name: "CHOIR · SHAKESPEARE", channel: 5, program: 52 }),
]);

// The Fun Machine plays in voices (D-040), and stacked loop layers can sound
// in different voices at the same moment. One MIDI channel holds one program,
// so each voice used gets its own MANUAL track and channel: the first keeps
// channel 1, the rest take the channels no other part uses.
export const FUN_VOICE_CHANNELS = Object.freeze([1, 6, 7, 8, 10, 11, 12, 13]);

/**
 * Splits the Fun Machine's events into one track per voice, in order of first
 * appearance. Each event carries `voice: { key, label, program }`; events with
 * none fall back to `base` (the stock MANUAL track). One voice gives one track
 * named for it. Returns `[{ ...base, name, channel, program, events }]`.
 */
export function funVoiceTracks(base, events) {
  const groups = new Map();
  for (const event of events) {
    const voice = event.voice ?? { key: "stock", label: null, program: base.program };
    if (!groups.has(voice.key)) groups.set(voice.key, { voice, events: [] });
    groups.get(voice.key).events.push(event);
  }
  if (groups.size === 0) return [{ ...base, events: [] }];
  return [...groups.values()].slice(0, FUN_VOICE_CHANNELS.length).map(({ voice, events: grouped }, index) => ({
    ...base,
    name: voice.label ? `${base.name} · ${voice.label}` : base.name,
    channel: FUN_VOICE_CHANNELS[index],
    program: voice.program,
    events: grouped,
  }));
}

const textEncoder = new TextEncoder();

export function encodeVlq(value) {
  let n = Math.max(0, Math.floor(value));
  if (n > 0x0fffffff) throw new RangeError("MIDI delta time too large");
  const bytes = [n & 0x7f];
  n >>>= 7;
  while (n > 0) {
    bytes.unshift((n & 0x7f) | 0x80);
    n >>>= 7;
  }
  return bytes;
}

export function ticksForSeconds(seconds, bpm, ppq = MIDI_PPQ) {
  return Math.round((seconds * bpm * ppq) / 60);
}

function clampByte(value, min = 0, max = 127) {
  return Math.max(min, Math.min(max, Math.round(value)));
}

function metaText(type, text) {
  const bytes = [...textEncoder.encode(text)];
  return [0xff, type, ...encodeVlq(bytes.length), ...bytes];
}

function chunk(type, data) {
  const length = data.length;
  return [
    ...[...type].map((c) => c.charCodeAt(0)),
    (length >>> 24) & 0xff, (length >>> 16) & 0xff, (length >>> 8) & 0xff, length & 0xff,
    ...data,
  ];
}

// Turns timed events into a track body: delta-time + message, ending with
// End of Track at `endTick`. Note-offs sort before note-ons on the same tick.
function trackData(events, endTick) {
  const sorted = [...events].sort((a, b) => a.tick - b.tick || a.order - b.order);
  const data = [];
  let last = 0;
  for (const event of sorted) {
    data.push(...encodeVlq(event.tick - last), ...event.bytes);
    last = event.tick;
  }
  data.push(...encodeVlq(Math.max(0, endTick - last)), 0xff, 0x2f, 0x00);
  return data;
}

/**
 * Clips notes for a clean loop: each note ends at the loop end, and a note is
 * cut short when the same pitch starts again on its channel, so no note-off
 * ever silences a newer note.
 */
export function loopSafeNotes(notes, lengthTicks) {
  const byPitch = new Map();
  const result = [];
  for (const note of [...notes].sort((a, b) => a.tick - b.tick)) {
    if (note.tick >= lengthTicks || note.tick < 0) continue;
    const clipped = { ...note, duration: Math.max(1, Math.min(note.duration, lengthTicks - note.tick)) };
    const previous = byPitch.get(note.midi);
    if (previous && previous.tick === note.tick) {
      // A unison doubling (e.g. two chord voices on one pitch) becomes one note.
      previous.duration = Math.max(previous.duration, clipped.duration);
      previous.velocity = Math.max(previous.velocity, clipped.velocity);
      continue;
    }
    if (previous && previous.tick + previous.duration > note.tick) {
      previous.duration = Math.max(1, note.tick - previous.tick);
    }
    byPitch.set(note.midi, clipped);
    result.push(clipped);
  }
  return result.filter((note) => note.duration > 0);
}

/**
 * Builds an SMF Type 1 file.
 * `tracks`: `[{ name, channel, program, notes: [{ tick, duration, midi, velocity }] }]`.
 * `lengthTicks`: loop length; every track ends there so the file loops cleanly.
 * `markers`: `[{ tick, text }]` written as Marker events on the conductor
 * track, so a DAW shows the arrangement's sections on its timeline.
 */
export function buildMidiFile({ bpm, tracks, lengthTicks, title = "", markers = [], ppq = MIDI_PPQ }) {
  if (!(bpm > 0)) throw new RangeError("MIDI tempo must be positive");
  const microsPerQuarter = Math.round(60_000_000 / bpm);
  const conductor = [
    { tick: 0, order: 0, bytes: metaText(0x03, title || "CONDUCTOR") },
    { tick: 0, order: 1, bytes: [0xff, 0x51, 0x03, (microsPerQuarter >>> 16) & 0xff, (microsPerQuarter >>> 8) & 0xff, microsPerQuarter & 0xff] },
    { tick: 0, order: 2, bytes: [0xff, 0x58, 0x04, 4, 2, 24, 8] },
    ...markers
      .filter((marker) => marker.tick >= 0 && marker.tick < lengthTicks)
      .map((marker) => ({ tick: Math.round(marker.tick), order: 3, bytes: metaText(0x06, marker.text) })),
  ];
  const chunks = [chunk("MTrk", trackData(conductor, lengthTicks))];

  for (const track of tracks) {
    const channel = clampByte(track.channel, 0, 15);
    const events = [{ tick: 0, order: 0, bytes: metaText(0x03, track.name) }];
    if (Number.isInteger(track.program)) {
      events.push({ tick: 0, order: 1, bytes: [0xc0 | channel, clampByte(track.program)] });
    }
    for (const note of loopSafeNotes(track.notes || [], lengthTicks)) {
      const pitch = clampByte(note.midi);
      events.push({ tick: note.tick, order: 3, bytes: [0x90 | channel, pitch, clampByte(note.velocity, 1)] });
      events.push({ tick: note.tick + note.duration, order: 2, bytes: [0x80 | channel, pitch, 0] });
    }
    chunks.push(chunk("MTrk", trackData(events, lengthTicks)));
  }

  const header = chunk("MThd", [0, 1, (chunks.length >>> 8) & 0xff, chunks.length & 0xff, (ppq >>> 8) & 0xff, ppq & 0xff]);
  return Uint8Array.from([...header, ...chunks.flat()]);
}

// Maps captured peak gains onto MIDI velocity per track: the loudest event in
// a part plays at 127 and the quietest audible one no lower than 40.
export function velocitiesFor(peaks) {
  const max = Math.max(0, ...peaks);
  return peaks.map((peak) => (max > 0 ? clampByte(40 + 87 * (peak / max), 1) : 64));
}
