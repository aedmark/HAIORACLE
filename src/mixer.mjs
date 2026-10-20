// Parlor mixing console state. Pure functions only: the host applies the
// resulting gains to channel strips in the shared ensemble graph and renders
// the console. Mixer settings are a session control, like master volume
// (D-009): they never alter the deterministic creature score.

// Console order follows the page: lead and organ manual first, then Plates II-VI.
export const MIXER_CHANNELS = Object.freeze([
  Object.freeze({ id: "lead", bus: "mix", label: "LEAD", source: "LOLCODE" }),
  Object.freeze({ id: "fun", bus: "funBus", label: "MANUAL", source: "FUN MACHINE" }),
  Object.freeze({ id: "beat", bus: "beatBus", label: "PULSE", source: "MALBOLGE" }),
  Object.freeze({ id: "bass", bus: "bassBus", label: "BASS", source: "BRAINFUCK" }),
  Object.freeze({ id: "harmony", bus: "harmonyBus", label: "ORGAN", source: "BEFUNGE" }),
  Object.freeze({ id: "chime", bus: "chimeBus", label: "CHIMES", source: "PIET·FRACTRAN" }),
  Object.freeze({ id: "chant", bus: "chantBus", label: "CHOIR", source: "SHAKESPEARE" }),
  Object.freeze({ id: "fungal", bus: "fungalBus", label: "MYCELIUM", source: "BIO-ACOUSTIC" }),
]);

export const MIXER_CHANNEL_IDS = Object.freeze(MIXER_CHANNELS.map((channel) => channel.id));

// The five accompaniment plates the Bandstand engages or silences together.
export const ACCOMPANIMENT_CHANNEL_IDS = Object.freeze(["beat", "bass", "harmony", "chime", "chant"]);

export const FADER_UNITY = 80;
export const FADER_MAX = 100;
export const FADER_CEILING_DB = 12;
export const PAN_RANGE = 100;
export const METER_FLOOR_DB = -60;

const DEFAULT_CHANNEL = Object.freeze({ fader: FADER_UNITY, pan: 0, muted: false, soloed: false });

function assertChannel(id) {
  if (!MIXER_CHANNEL_IDS.includes(id)) throw new RangeError(`Unknown mixer channel: ${id}`);
}

function clamp(value, min, max) {
  const number = Number(value);
  if (!Number.isFinite(number)) return min;
  return Math.max(min, Math.min(max, number));
}

function withChannel(state, id, patch) {
  assertChannel(id);
  const channel = Object.freeze({ ...state.channels[id], ...patch });
  return Object.freeze({ channels: Object.freeze({ ...state.channels, [id]: channel }) });
}

export function createMixerState() {
  const channels = {};
  for (const id of MIXER_CHANNEL_IDS) channels[id] = DEFAULT_CHANNEL;
  return Object.freeze({ channels: Object.freeze(channels) });
}

export function setFader(state, id, value) {
  return withChannel(state, id, { fader: Math.round(clamp(value, 0, FADER_MAX)) });
}

export function setPan(state, id, value) {
  return withChannel(state, id, { pan: Math.round(clamp(value, -PAN_RANGE, PAN_RANGE)) });
}

export function setMuted(state, ids, muted) {
  return [].concat(ids).reduce((next, id) => withChannel(next, id, { muted: Boolean(muted) }), state);
}

export function toggleMute(state, id) {
  assertChannel(id);
  return setMuted(state, id, !state.channels[id].muted);
}

export function toggleSolo(state, id) {
  assertChannel(id);
  return withChannel(state, id, { soloed: !state.channels[id].soloed });
}

export function resetChannel(state, id) {
  return withChannel(state, id, DEFAULT_CHANNEL);
}

export function anySoloed(state) {
  return MIXER_CHANNEL_IDS.some((id) => state.channels[id].soloed);
}

// Solo wins over everything except an explicit mute on the soloed channel.
export function isChannelAudible(state, id) {
  assertChannel(id);
  const { muted, soloed } = state.channels[id];
  if (muted) return false;
  return anySoloed(state) ? soloed : true;
}

// Two-part taper. Below unity it is square-law, so 40 is -12 dB and 0 is
// silence. Above unity the top 20 steps are linear in dB up to +12 dB, enough
// headroom to lift quiet voices such as the lead and choir over the band.
export function faderDb(value) {
  const position = clamp(value, 0, FADER_MAX);
  if (position <= 0) return -Infinity;
  if (position <= FADER_UNITY) return 40 * Math.log10(position / FADER_UNITY);
  return ((position - FADER_UNITY) / (FADER_MAX - FADER_UNITY)) * FADER_CEILING_DB;
}

export function faderGain(value) {
  const position = clamp(value, 0, FADER_MAX);
  if (position <= 0) return 0;
  if (position <= FADER_UNITY) return (position / FADER_UNITY) ** 2;
  return 10 ** (faderDb(position) / 20);
}

export function formatDb(db) {
  if (!Number.isFinite(db)) return "-∞ dB";
  const rounded = Math.round(db * 10) / 10;
  return `${rounded > 0 ? "+" : ""}${rounded.toFixed(1)} dB`;
}

export function formatPan(value) {
  const pan = Math.round(clamp(value, -PAN_RANGE, PAN_RANGE));
  if (pan === 0) return "C";
  return pan < 0 ? `L${-pan}` : `R${pan}`;
}

// The gain and pan each strip should carry right now, keyed by channel id.
export function channelSettings(state) {
  const settings = {};
  for (const id of MIXER_CHANNEL_IDS) {
    const { fader, pan } = state.channels[id];
    settings[id] = {
      gain: isChannelAudible(state, id) ? faderGain(fader) : 0,
      pan: pan / PAN_RANGE,
    };
  }
  return settings;
}

// RMS and peak of one analyser frame, in linear and dBFS terms.
export function meterReading(samples) {
  let peak = 0;
  let sumSquares = 0;
  for (const sample of samples) {
    const magnitude = Math.abs(sample);
    if (magnitude > peak) peak = magnitude;
    sumSquares += sample * sample;
  }
  const rms = samples.length ? Math.sqrt(sumSquares / samples.length) : 0;
  const toDb = (value) => (value > 0 ? Math.max(METER_FLOOR_DB, 20 * Math.log10(value)) : METER_FLOOR_DB);
  return { rms, peak, rmsDb: toDb(rms), peakDb: toDb(peak) };
}

// Maps dBFS onto a 0..1 meter column; 0 dBFS sits at the top.
export function meterFill(db) {
  return clamp((db - METER_FLOOR_DB) / -METER_FLOOR_DB, 0, 1);
}

// Strip settings for rendering one channel's stem: that channel at its own
// fader and pan, every other channel silent. Mute and solo are ignored so a
// stem bundle always holds every part, whatever the live console is doing.
export function stemSettings(state, stemId) {
  assertChannel(stemId);
  const settings = {};
  for (const id of MIXER_CHANNEL_IDS) {
    const { fader, pan } = state.channels[id];
    settings[id] = { gain: id === stemId ? faderGain(fader) : 0, pan: pan / PAN_RANGE };
  }
  return settings;
}

// Every strip closed: used for the parlor-room stem, which carries only the
// room's own crackle and clockwork.
export function silentSettings(state) {
  const settings = {};
  for (const id of MIXER_CHANNEL_IDS) settings[id] = { gain: 0, pan: state.channels[id].pan / PAN_RANGE };
  return settings;
}

// Rebuilds console state from plain per-channel settings (a loaded session),
// clamping through the same setters the console uses.
export function mixerStateFromChannels(channels) {
  let state = createMixerState();
  for (const id of MIXER_CHANNEL_IDS) {
    const channel = channels[id];
    if (!channel) continue;
    state = setFader(state, id, channel.fader);
    state = setPan(state, id, channel.pan);
    state = setMuted(state, id, channel.muted);
    if (Boolean(channel.soloed) !== state.channels[id].soloed) state = toggleSolo(state, id);
  }
  return state;
}
