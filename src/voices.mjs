// Fun Machine voices (D-040, P5-28). A voice is data: a patch for each of the
// accompanist's three roles (the region pad, the arpeggio pluck, and the
// progression lead), validated against hard bounds so no patch can run away
// with the CPU or the speakers. The schedulers below turn a patch into Web
// Audio nodes; src/app.mjs owns note logging and live pad release.

export const OSCILLATOR_TYPES = Object.freeze(["sine", "triangle", "sawtooth", "square"]);
const SIDES = Object.freeze(["center", "left", "right"]);
// Per note, so a four-note pad is at most 12 oscillators plus one LFO.
const MAX_LAYERS = 3;

const deepFreeze = (value) => {
  if (value && typeof value === "object") {
    for (const child of Object.values(value)) deepFreeze(child);
    Object.freeze(value);
  }
  return value;
};

// VELVET PAD is the Fun Machine as it sounded before voices existed, number
// for number; tests and the parity render hold it there.
const VELVET_PAD = deepFreeze({
  id: "velvet_pad",
  label: "VELVET PAD",
  program: 89, // General MIDI "Pad 2 (warm)", 0-based
  pad: {
    level: 0.34,
    attack: { share: 0.32, min: 0.16, max: 0.7 },
    sustain: 0.82,
    sustainTau: 0.4,
    release: 0.9,
    tail: 1.6,
    filter: { type: "lowpass", q: 0.6, base: 420, peak: 1750, settle: 1250, settleTau: 0.5 },
    width: 0.55,
    chorus: { rate: 0.23, depth: 6 },
    root: [{ type: "triangle", ratio: 1, detune: 0, gain: 0.55, side: "center", chorus: false }],
    upper: [
      { type: "sawtooth", ratio: 1, detune: -8, gain: 0.3, side: "left", chorus: true },
      { type: "sawtooth", ratio: 1, detune: 8, gain: 0.3, side: "right", chorus: true },
      { type: "triangle", ratio: 1, detune: 0, gain: 0.32, side: "center", chorus: false },
    ],
  },
  pluck: {
    level: 0.11,
    accentLevel: 0.15,
    attack: 0.006,
    decay: { share: 1.6, min: 0.14, max: 0.55 },
    tail: 0.05,
    filter: { type: "lowpass", q: 1.2, base: 3000, accentBase: 3600, to: 700 },
    layers: [
      { type: "triangle", ratio: 1, detune: 0, gain: 1 },
      { type: "square", ratio: 1, detune: 4, gain: 0.18 },
    ],
  },
  lead: {
    level: 0.2,
    attack: 0.035,
    sustain: 0.8,
    sustainTau: 0.2,
    releaseTau: 0.06,
    minLength: 0.14,
    tail: 0.3,
    glide: 0.07,
    filter: { type: "lowpass", q: 0.7, base: 2600 },
    vibrato: { rate: 5.2, depth: 9, delayMax: 0.45, delayShare: 0.6 },
    layers: [
      { type: "sine", ratio: 1, detune: 0, gain: 0.6 },
      { type: "triangle", ratio: 1, detune: 0, gain: 0.32 },
      { type: "sine", ratio: 2, detune: 0, gain: 0.08 },
    ],
  },
});

export const DEFAULT_VOICE_ID = VELVET_PAD.id;

// ---------------------------------------------------------------------------
// Validation. Strict and allowlisted, like src/session.mjs: every patch,
// including the shipped presets, passes through here before it can sound.

export class VoiceError extends Error {
  constructor(path, message) {
    super(`${path} ${message}`);
    this.name = "VoiceError";
    this.path = path;
  }
}

const isPlainObject = (value) => value !== null && typeof value === "object" && !Array.isArray(value)
  && Object.getPrototypeOf(value) === Object.prototype;

function expectKeys(value, path, keys) {
  if (!isPlainObject(value)) throw new VoiceError(path, "must be an object");
  for (const key of Object.keys(value)) if (!keys.includes(key)) throw new VoiceError(`${path}.${key}`, "is not allowed");
  for (const key of keys) if (!(key in value)) throw new VoiceError(`${path}.${key}`, "is required");
}

function expectNumber(value, path, min, max) {
  if (typeof value !== "number" || !Number.isFinite(value) || value < min || value > max) {
    throw new VoiceError(path, `must be a number ${min}..${max}`);
  }
}

function expectOneOf(value, path, allowed) {
  if (!allowed.includes(value)) throw new VoiceError(path, `must be one of ${allowed.join(", ")}`);
}

function checkLayers(layers, path, keys) {
  if (!Array.isArray(layers) || layers.length < 1 || layers.length > MAX_LAYERS) {
    throw new VoiceError(path, `must list 1..${MAX_LAYERS} layers`);
  }
  layers.forEach((layer, index) => {
    const at = `${path}[${index}]`;
    expectKeys(layer, at, keys);
    expectOneOf(layer.type, `${at}.type`, OSCILLATOR_TYPES);
    expectNumber(layer.ratio, `${at}.ratio`, 0.25, 8);
    expectNumber(layer.detune, `${at}.detune`, -50, 50);
    expectNumber(layer.gain, `${at}.gain`, 0, 1);
    if (keys.includes("side")) expectOneOf(layer.side, `${at}.side`, SIDES);
    if (keys.includes("chorus") && typeof layer.chorus !== "boolean") throw new VoiceError(`${at}.chorus`, "must be true or false");
  });
}

const FREQUENCY = [80, 8000];

function checkPad(pad, path) {
  expectKeys(pad, path, ["level", "attack", "sustain", "sustainTau", "release", "tail", "filter", "width", "chorus", "root", "upper"]);
  expectNumber(pad.level, `${path}.level`, 0, 0.5);
  expectKeys(pad.attack, `${path}.attack`, ["share", "min", "max"]);
  expectNumber(pad.attack.share, `${path}.attack.share`, 0, 1);
  expectNumber(pad.attack.min, `${path}.attack.min`, 0.003, 2);
  expectNumber(pad.attack.max, `${path}.attack.max`, pad.attack.min, 2);
  expectNumber(pad.sustain, `${path}.sustain`, 0, 1);
  expectNumber(pad.sustainTau, `${path}.sustainTau`, 0.01, 4);
  expectNumber(pad.release, `${path}.release`, 0.05, 3);
  expectNumber(pad.tail, `${path}.tail`, 1, 3);
  expectKeys(pad.filter, `${path}.filter`, ["type", "q", "base", "peak", "settle", "settleTau"]);
  expectOneOf(pad.filter.type, `${path}.filter.type`, ["lowpass", "bandpass"]);
  expectNumber(pad.filter.q, `${path}.filter.q`, 0.1, 8);
  for (const key of ["base", "peak", "settle"]) expectNumber(pad.filter[key], `${path}.filter.${key}`, ...FREQUENCY);
  expectNumber(pad.filter.settleTau, `${path}.filter.settleTau`, 0.01, 4);
  expectNumber(pad.width, `${path}.width`, 0, 1);
  expectKeys(pad.chorus, `${path}.chorus`, ["rate", "depth"]);
  expectNumber(pad.chorus.rate, `${path}.chorus.rate`, 0, 8);
  expectNumber(pad.chorus.depth, `${path}.chorus.depth`, 0, 30);
  const keys = ["type", "ratio", "detune", "gain", "side", "chorus"];
  checkLayers(pad.root, `${path}.root`, keys);
  checkLayers(pad.upper, `${path}.upper`, keys);
}

function checkPluck(pluck, path) {
  expectKeys(pluck, path, ["level", "accentLevel", "attack", "decay", "tail", "filter", "layers"]);
  expectNumber(pluck.level, `${path}.level`, 0, 0.3);
  expectNumber(pluck.accentLevel, `${path}.accentLevel`, 0, 0.3);
  expectNumber(pluck.attack, `${path}.attack`, 0.001, 0.2);
  expectKeys(pluck.decay, `${path}.decay`, ["share", "min", "max"]);
  expectNumber(pluck.decay.share, `${path}.decay.share`, 0.1, 4);
  expectNumber(pluck.decay.min, `${path}.decay.min`, 0.03, 2);
  expectNumber(pluck.decay.max, `${path}.decay.max`, pluck.decay.min, 3);
  expectNumber(pluck.tail, `${path}.tail`, 0, 1);
  expectKeys(pluck.filter, `${path}.filter`, ["type", "q", "base", "accentBase", "to"]);
  expectOneOf(pluck.filter.type, `${path}.filter.type`, ["lowpass", "bandpass"]);
  expectNumber(pluck.filter.q, `${path}.filter.q`, 0.1, 8);
  for (const key of ["base", "accentBase", "to"]) expectNumber(pluck.filter[key], `${path}.filter.${key}`, ...FREQUENCY);
  checkLayers(pluck.layers, `${path}.layers`, ["type", "ratio", "detune", "gain"]);
}

function checkLead(lead, path) {
  expectKeys(lead, path, ["level", "attack", "sustain", "sustainTau", "releaseTau", "minLength", "tail", "glide", "filter", "vibrato", "layers"]);
  expectNumber(lead.level, `${path}.level`, 0, 0.35);
  expectNumber(lead.attack, `${path}.attack`, 0.002, 1);
  expectNumber(lead.sustain, `${path}.sustain`, 0, 1);
  expectNumber(lead.sustainTau, `${path}.sustainTau`, 0.01, 4);
  expectNumber(lead.releaseTau, `${path}.releaseTau`, 0.01, 1);
  expectNumber(lead.minLength, `${path}.minLength`, 0.05, 1);
  expectNumber(lead.tail, `${path}.tail`, 0.05, 2);
  expectNumber(lead.glide, `${path}.glide`, 0.005, 0.5);
  expectKeys(lead.filter, `${path}.filter`, ["type", "q", "base"]);
  expectOneOf(lead.filter.type, `${path}.filter.type`, ["lowpass", "bandpass"]);
  expectNumber(lead.filter.q, `${path}.filter.q`, 0.1, 8);
  expectNumber(lead.filter.base, `${path}.filter.base`, ...FREQUENCY);
  expectKeys(lead.vibrato, `${path}.vibrato`, ["rate", "depth", "delayMax", "delayShare"]);
  expectNumber(lead.vibrato.rate, `${path}.vibrato.rate`, 0, 8);
  expectNumber(lead.vibrato.depth, `${path}.vibrato.depth`, 0, 40);
  expectNumber(lead.vibrato.delayMax, `${path}.vibrato.delayMax`, 0.01, 2);
  expectNumber(lead.vibrato.delayShare, `${path}.vibrato.delayShare`, 0, 1);
  checkLayers(lead.layers, `${path}.layers`, ["type", "ratio", "detune", "gain"]);
}

/** Validates a voice patch and returns a frozen copy; throws VoiceError naming the bad field. */
export function validateVoice(raw, path = "voice") {
  expectKeys(raw, path, ["id", "label", "program", "pad", "pluck", "lead"]);
  if (typeof raw.id !== "string" || !/^[a-z][a-z0-9_]{0,31}$/.test(raw.id)) throw new VoiceError(`${path}.id`, "must be a short lowercase id");
  if (typeof raw.label !== "string" || raw.label.length < 1 || raw.label.length > 24) throw new VoiceError(`${path}.label`, "must be 1..24 characters");
  if (!Number.isInteger(raw.program) || raw.program < 0 || raw.program > 127) throw new VoiceError(`${path}.program`, "must be a General MIDI program 0..127");
  checkPad(raw.pad, `${path}.pad`);
  checkPluck(raw.pluck, `${path}.pluck`);
  checkLead(raw.lead, `${path}.lead`);
  return deepFreeze(structuredClone(raw));
}

// The shipped presets, in chip order. Phase 2 adds the other six (D-040).
export const VOICE_PRESETS = Object.freeze([VELVET_PAD].map((voice) => validateVoice(voice)));
const PRESETS_BY_ID = new Map(VOICE_PRESETS.map((voice) => [voice.id, voice]));
export const VOICE_IDS = Object.freeze(VOICE_PRESETS.map((voice) => voice.id));

/** The preset with this id, or VELVET PAD for anything unknown. */
export function voiceById(id) {
  return PRESETS_BY_ID.get(id) ?? PRESETS_BY_ID.get(DEFAULT_VOICE_ID);
}

// ---------------------------------------------------------------------------
// Schedulers. Each takes the context, a destination, a validated voice, and
// times already clamped by the caller; `hold` is the vitrine press (0..1).

const midiToFrequency = (midi) => 440 * 2 ** ((midi - 69) / 12);

/** One pad chord. Returns the nodes a live release needs, and the peak for the note log. */
export function scheduleVoicePad(context, destination, voice, notes, { start, sounding, level = 1, hold = 0 }) {
  const pad = voice.pad;
  const attack = Math.min(pad.attack.max, Math.max(pad.attack.min, sounding * pad.attack.share));
  const end = start + sounding;
  const peak = pad.level * level * (1 + hold * 0.15) / Math.sqrt(notes.length);

  const env = context.createGain();
  env.gain.setValueAtTime(0.0001, start);
  env.gain.linearRampToValueAtTime(peak, start + attack);
  env.gain.setTargetAtTime(peak * pad.sustain, start + attack, pad.sustainTau);
  env.gain.setTargetAtTime(0.0001, end, pad.release / 4);

  const filter = context.createBiquadFilter();
  filter.type = pad.filter.type;
  filter.Q.setValueAtTime(pad.filter.q, start);
  filter.frequency.setValueAtTime(pad.filter.base, start);
  filter.frequency.exponentialRampToValueAtTime(pad.filter.peak, start + attack);
  filter.frequency.setTargetAtTime(pad.filter.settle, start + attack, pad.filter.settleTau);
  filter.connect(env).connect(destination);

  const left = context.createStereoPanner ? context.createStereoPanner() : null;
  const right = context.createStereoPanner ? context.createStereoPanner() : null;
  left?.pan.setValueAtTime(-pad.width, start);
  right?.pan.setValueAtTime(pad.width, start);
  left?.connect(filter);
  right?.connect(filter);
  const sides = { center: filter, left: left || filter, right: right || filter };

  // One slow chorus LFO breathes across every chorused layer in the chord.
  const lfo = context.createOscillator();
  const lfoDepth = context.createGain();
  lfo.frequency.setValueAtTime(pad.chorus.rate, start);
  lfoDepth.gain.setValueAtTime(pad.chorus.depth, start);
  lfo.connect(lfoDepth);

  const stopAt = end + pad.release * pad.tail;
  const oscillators = [lfo];
  for (const [index, midi] of notes.entries()) {
    const freq = midiToFrequency(midi);
    for (const layer of index === 0 ? pad.root : pad.upper) {
      const osc = context.createOscillator();
      const gain = context.createGain();
      osc.type = layer.type;
      osc.frequency.setValueAtTime(freq * layer.ratio, start);
      osc.detune.setValueAtTime(layer.detune, start);
      if (layer.chorus) lfoDepth.connect(osc.detune);
      gain.gain.setValueAtTime(layer.gain, start);
      osc.connect(gain).connect(sides[layer.side]);
      osc.start(start);
      osc.stop(stopAt);
      oscillators.push(osc);
    }
  }
  lfo.start(start);
  lfo.stop(stopAt);
  return { env, oscillators, stopAt, peak };
}

/** One arpeggio pluck. Returns its length and peak for the note log. */
export function scheduleVoicePluck(context, destination, voice, midi, { start, duration, accent = false, pan = 0, hold = 0 }) {
  const pluck = voice.pluck;
  const decay = Math.min(pluck.decay.max, Math.max(pluck.decay.min, duration * pluck.decay.share));
  const peak = (accent ? pluck.accentLevel : pluck.level) * (1 + hold * 0.15);
  const freq = midiToFrequency(midi);

  const env = context.createGain();
  env.gain.setValueAtTime(0.0001, start);
  env.gain.linearRampToValueAtTime(peak, start + pluck.attack);
  env.gain.exponentialRampToValueAtTime(0.0001, start + decay);

  const filter = context.createBiquadFilter();
  filter.type = pluck.filter.type;
  filter.Q.setValueAtTime(pluck.filter.q, start);
  filter.frequency.setValueAtTime(accent ? pluck.filter.accentBase : pluck.filter.base, start);
  filter.frequency.exponentialRampToValueAtTime(pluck.filter.to, start + decay);

  const panner = context.createStereoPanner ? context.createStereoPanner() : null;
  panner?.pan.setValueAtTime(pan, start);
  filter.connect(env);
  (panner ? env.connect(panner) : env).connect(destination);

  for (const layer of pluck.layers) {
    const osc = context.createOscillator();
    const gain = context.createGain();
    osc.type = layer.type;
    osc.frequency.setValueAtTime(freq * layer.ratio, start);
    osc.detune.setValueAtTime(layer.detune, start);
    gain.gain.setValueAtTime(layer.gain, start);
    osc.connect(gain).connect(filter);
    osc.start(start);
    osc.stop(start + decay + pluck.tail);
  }
  return { decay, peak };
}

/** One lead note, gliding from `glideFrom` (a MIDI note) when given. */
export function scheduleVoiceLead(context, destination, voice, midi, { start, duration, glideFrom = null, hold = 0 }) {
  const lead = voice.lead;
  const sounding = Math.max(lead.minLength, duration);
  const freq = midiToFrequency(midi);
  const fromFreq = glideFrom ? midiToFrequency(glideFrom) : freq;
  const peak = lead.level * (1 + hold * 0.15);

  const env = context.createGain();
  env.gain.setValueAtTime(0.0001, start);
  env.gain.linearRampToValueAtTime(peak, start + lead.attack);
  env.gain.setTargetAtTime(peak * lead.sustain, start + lead.attack, lead.sustainTau);
  env.gain.setTargetAtTime(0.0001, start + sounding, lead.releaseTau);

  const filter = context.createBiquadFilter();
  filter.type = lead.filter.type;
  filter.frequency.setValueAtTime(lead.filter.base, start);
  filter.Q.setValueAtTime(lead.filter.q, start);
  filter.connect(env).connect(destination);

  // Vibrato only arrives once the note has settled.
  const vibrato = context.createOscillator();
  const vibratoDepth = context.createGain();
  vibrato.frequency.setValueAtTime(lead.vibrato.rate, start);
  vibratoDepth.gain.setValueAtTime(0, start);
  vibratoDepth.gain.linearRampToValueAtTime(lead.vibrato.depth, start + Math.min(lead.vibrato.delayMax, sounding * lead.vibrato.delayShare));
  vibrato.connect(vibratoDepth);

  const stopAt = start + sounding + lead.tail;
  for (const layer of lead.layers) {
    const osc = context.createOscillator();
    const level = context.createGain();
    osc.type = layer.type;
    osc.frequency.setValueAtTime(fromFreq * layer.ratio, start);
    osc.frequency.exponentialRampToValueAtTime(freq * layer.ratio, start + (glideFrom ? lead.glide : 0.005));
    osc.detune.setValueAtTime(layer.detune, start);
    vibratoDepth.connect(osc.detune);
    level.gain.setValueAtTime(layer.gain, start);
    osc.connect(level).connect(filter);
    osc.start(start);
    osc.stop(stopAt);
  }
  vibrato.start(start);
  vibrato.stop(stopAt);
  return { sounding, peak };
}
