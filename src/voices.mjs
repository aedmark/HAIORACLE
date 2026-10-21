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

function expectKeys(value, path, keys, optional = []) {
  if (!isPlainObject(value)) throw new VoiceError(path, "must be an object");
  for (const key of Object.keys(value)) if (!keys.includes(key) && !optional.includes(key)) throw new VoiceError(`${path}.${key}`, "is not allowed");
  for (const key of keys) if (!(key in value)) throw new VoiceError(`${path}.${key}`, "is required");
}

// Optional colour shared by pad and lead: an amplitude tremolo (the theatre
// organ's tremulant) and up to three parallel formant bandpasses (the choir).
function checkTremolo(tremolo, path) {
  expectKeys(tremolo, path, ["rate", "depth"]);
  expectNumber(tremolo.rate, `${path}.rate`, 0.1, 12);
  expectNumber(tremolo.depth, `${path}.depth`, 0, 0.5);
}

function checkFormants(formants, path) {
  if (!Array.isArray(formants) || formants.length < 1 || formants.length > 3) throw new VoiceError(path, "must list 1..3 formants");
  formants.forEach((formant, index) => {
    const at = `${path}[${index}]`;
    expectKeys(formant, at, ["freq", "q", "gain"]);
    expectNumber(formant.freq, `${at}.freq`, 150, 5000);
    expectNumber(formant.q, `${at}.q`, 0.5, 12);
    expectNumber(formant.gain, `${at}.gain`, 0, 2);
  });
}

function checkColour(part, path) {
  if ("tremolo" in part) checkTremolo(part.tremolo, `${path}.tremolo`);
  if ("formants" in part) checkFormants(part.formants, `${path}.formants`);
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
  expectKeys(pad, path, ["level", "attack", "sustain", "sustainTau", "release", "tail", "filter", "width", "chorus", "root", "upper"], ["tremolo", "formants", "strike"]);
  checkColour(pad, path);
  // A struck pad (the music box): each note rolls in `strum` seconds after the
  // last and every layer dies away over `decay`, instead of sustaining.
  if ("strike" in pad) {
    expectKeys(pad.strike, `${path}.strike`, ["strum", "decay"]);
    expectNumber(pad.strike.strum, `${path}.strike.strum`, 0, 0.2);
    expectNumber(pad.strike.decay, `${path}.strike.decay`, 0.1, 4);
  }
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
  expectKeys(lead, path, ["level", "attack", "sustain", "sustainTau", "releaseTau", "minLength", "tail", "glide", "filter", "vibrato", "layers"], ["tremolo", "formants"]);
  checkColour(lead, path);
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

// The parlor presets (D-040), first-pass numbers to be tuned by ear. Levels are
// set so each sits near VELVET PAD's loudness on the Fun Machine strip.
const layer = (type, ratio, detune, gain, side = "center", chorus = false) => ({ type, ratio, detune, gain, side, chorus });
const tone = (type, ratio, detune, gain) => ({ type, ratio, detune, gain });

// A pump organ: reedy squares under a nasal resonance, slow to speak.
const HARMONIUM = deepFreeze({
  id: "harmonium",
  label: "HARMONIUM",
  program: 20, // Reed Organ
  pad: {
    level: 0.39,
    attack: { share: 0.45, min: 0.25, max: 0.9 },
    sustain: 0.9,
    sustainTau: 0.6,
    release: 0.5,
    tail: 1.6,
    filter: { type: "lowpass", q: 2.2, base: 700, peak: 2200, settle: 1700, settleTau: 0.6 },
    width: 0.4,
    chorus: { rate: 0.4, depth: 3 },
    tremolo: { rate: 4.6, depth: 0.06 },
    root: [layer("square", 1, 0, 0.36), layer("sawtooth", 2, 0, 0.1)],
    upper: [layer("square", 1, -4, 0.24, "left", true), layer("square", 1, 4, 0.24, "right", true), layer("sawtooth", 1, 0, 0.12)],
  },
  pluck: {
    level: 0.1,
    accentLevel: 0.14,
    attack: 0.012,
    decay: { share: 1.4, min: 0.14, max: 0.5 },
    tail: 0.05,
    filter: { type: "lowpass", q: 2, base: 2400, accentBase: 2900, to: 900 },
    layers: [tone("square", 1, 0, 0.5), tone("triangle", 1, 3, 0.6)],
  },
  lead: {
    level: 0.21,
    attack: 0.06,
    sustain: 0.9,
    sustainTau: 0.3,
    releaseTau: 0.07,
    minLength: 0.14,
    tail: 0.3,
    glide: 0.05,
    filter: { type: "lowpass", q: 1.5, base: 1900 },
    vibrato: { rate: 5, depth: 5, delayMax: 0.5, delayShare: 0.6 },
    layers: [tone("square", 1, 0, 0.35), tone("triangle", 1, 0, 0.45), tone("sawtooth", 2, 0, 0.05)],
  },
});

// Wet fingers on spinning glass: pure partials at 1 and 2.76, slow to bloom
// and slow to fade, with the faint beating of a glass bowl.
const GLASS_HARMONICA = deepFreeze({
  id: "glass_harmonica",
  label: "GLASS HARMONICA",
  program: 98, // FX 3 (crystal)
  pad: {
    level: 0.31,
    attack: { share: 0.5, min: 0.3, max: 1.2 },
    sustain: 0.75,
    sustainTau: 0.8,
    release: 1.8,
    tail: 1.6,
    filter: { type: "lowpass", q: 0.5, base: 2400, peak: 4200, settle: 3200, settleTau: 0.8 },
    width: 0.6,
    chorus: { rate: 0.15, depth: 4 },
    tremolo: { rate: 3.2, depth: 0.1 },
    root: [layer("sine", 1, 0, 0.6), layer("sine", 2.76, 0, 0.08)],
    upper: [layer("sine", 1, -3, 0.4, "left", true), layer("sine", 1, 3, 0.4, "right", true), layer("sine", 2.76, 0, 0.06)],
  },
  pluck: {
    level: 0.086,
    accentLevel: 0.115,
    attack: 0.02,
    decay: { share: 2.5, min: 0.3, max: 1.2 },
    tail: 0.1,
    filter: { type: "lowpass", q: 0.5, base: 5000, accentBase: 6000, to: 2500 },
    layers: [tone("sine", 1, 0, 1), tone("sine", 2.76, 0, 0.18)],
  },
  lead: {
    level: 0.2,
    attack: 0.09,
    sustain: 0.8,
    sustainTau: 0.4,
    releaseTau: 0.15,
    minLength: 0.18,
    tail: 0.6,
    glide: 0.1,
    filter: { type: "lowpass", q: 0.5, base: 4000 },
    vibrato: { rate: 4.5, depth: 5, delayMax: 0.5, delayShare: 0.6 },
    layers: [tone("sine", 1, 0, 0.75), tone("triangle", 1, 0, 0.15), tone("sine", 2.76, 0, 0.05)],
  },
});

// A cinema Wurlitzer: drawbar sines at 8', 4', and 2 2/3' with a deep tibia
// tremulant; it speaks at once and stops at once.
const THEATRE_ORGAN = deepFreeze({
  id: "theatre_organ",
  label: "THEATRE ORGAN",
  program: 16, // Drawbar Organ
  pad: {
    level: 0.2,
    attack: { share: 0.05, min: 0.02, max: 0.06 },
    sustain: 1,
    sustainTau: 0.5,
    release: 0.3,
    tail: 2,
    filter: { type: "lowpass", q: 0.5, base: 3500, peak: 3500, settle: 3500, settleTau: 0.5 },
    width: 0.35,
    chorus: { rate: 0.5, depth: 2 },
    tremolo: { rate: 6.8, depth: 0.22 },
    root: [layer("sine", 1, 0, 0.5), layer("sine", 2, 0, 0.3), layer("sine", 3, 0, 0.16)],
    upper: [layer("sine", 1, 0, 0.5), layer("sine", 2, 0, 0.3, "left", true), layer("sine", 3, 0, 0.16, "right", true)],
  },
  pluck: {
    level: 0.176,
    accentLevel: 0.246,
    attack: 0.004,
    decay: { share: 1.2, min: 0.12, max: 0.4 },
    tail: 0.05,
    filter: { type: "lowpass", q: 0.5, base: 4200, accentBase: 5000, to: 2400 },
    layers: [tone("sine", 1, 0, 0.6), tone("sine", 2, 0, 0.35), tone("sine", 3, 0, 0.2)],
  },
  lead: {
    level: 0.31,
    attack: 0.012,
    sustain: 1,
    sustainTau: 0.3,
    releaseTau: 0.04,
    minLength: 0.14,
    tail: 0.25,
    glide: 0.04,
    filter: { type: "lowpass", q: 0.5, base: 4500 },
    vibrato: { rate: 6.8, depth: 10, delayMax: 0.2, delayShare: 0.4 },
    tremolo: { rate: 6.8, depth: 0.2 },
    layers: [tone("sine", 1, 0, 0.55), tone("sine", 2, 0, 0.28), tone("sine", 4, 0, 0.1)],
  },
});

// A 1970s ensemble string machine: three saws a little apart, swimming in a
// fast chorus under a soft lowpass.
const STRING_MACHINE = deepFreeze({
  id: "string_machine",
  label: "STRING MACHINE",
  program: 50, // Synth Strings 1
  pad: {
    level: 0.5,
    attack: { share: 0.4, min: 0.2, max: 0.8 },
    sustain: 0.9,
    sustainTau: 0.5,
    release: 1.2,
    tail: 1.6,
    filter: { type: "lowpass", q: 0.7, base: 800, peak: 2600, settle: 2000, settleTau: 0.6 },
    width: 0.7,
    chorus: { rate: 4.8, depth: 7 },
    root: [layer("sawtooth", 1, -6, 0.3, "left", true), layer("sawtooth", 1, 6, 0.3, "right", true), layer("sawtooth", 1, 0, 0.25)],
    upper: [layer("sawtooth", 1, -6, 0.3, "left", true), layer("sawtooth", 1, 6, 0.3, "right", true), layer("sawtooth", 1, 0, 0.25)],
  },
  pluck: {
    level: 0.127,
    accentLevel: 0.178,
    attack: 0.01,
    decay: { share: 1.8, min: 0.16, max: 0.6 },
    tail: 0.05,
    filter: { type: "lowpass", q: 1, base: 2800, accentBase: 3400, to: 800 },
    layers: [tone("sawtooth", 1, -5, 0.4), tone("sawtooth", 1, 5, 0.4), tone("triangle", 1, 0, 0.4)],
  },
  lead: {
    level: 0.35,
    attack: 0.05,
    sustain: 0.85,
    sustainTau: 0.3,
    releaseTau: 0.1,
    minLength: 0.14,
    tail: 0.4,
    glide: 0.08,
    filter: { type: "lowpass", q: 0.8, base: 2200 },
    vibrato: { rate: 5.5, depth: 10, delayMax: 0.4, delayShare: 0.6 },
    layers: [tone("sawtooth", 1, -5, 0.5), tone("sawtooth", 1, 5, 0.5), tone("triangle", 1, 0, 0.2)],
  },
});

// A wind-up cylinder: every chord is rolled and struck, tines ringing a
// faint two-octave overtone, and nothing sustains.
const MUSIC_BOX = deepFreeze({
  id: "music_box",
  label: "MUSIC BOX",
  program: 10, // Music Box
  pad: {
    level: 0.5,
    attack: { share: 0, min: 0.005, max: 0.005 },
    sustain: 1,
    sustainTau: 0.5,
    release: 0.6,
    tail: 1.6,
    filter: { type: "lowpass", q: 0.5, base: 6000, peak: 6000, settle: 6000, settleTau: 0.5 },
    width: 0.5,
    chorus: { rate: 0.2, depth: 1 },
    strike: { strum: 0.04, decay: 1.4 },
    root: [layer("triangle", 1, 0, 0.9), layer("sine", 4, 0, 0.16)],
    upper: [layer("triangle", 1, 0, 0.85, "left"), layer("sine", 4, 0, 0.14, "right"), layer("sine", 2, 0, 0.16)],
  },
  pluck: {
    level: 0.12,
    accentLevel: 0.16,
    attack: 0.003,
    decay: { share: 3, min: 0.25, max: 1.2 },
    tail: 0.05,
    filter: { type: "lowpass", q: 0.5, base: 6000, accentBase: 7000, to: 3000 },
    layers: [tone("triangle", 1, 0, 0.9), tone("sine", 4, 0, 0.2)],
  },
  lead: {
    level: 0.29,
    attack: 0.004,
    sustain: 0.2,
    sustainTau: 0.3,
    releaseTau: 0.2,
    minLength: 0.14,
    tail: 0.8,
    glide: 0.005,
    filter: { type: "lowpass", q: 0.5, base: 6000 },
    vibrato: { rate: 0.1, depth: 0, delayMax: 0.1, delayShare: 0.5 },
    layers: [tone("triangle", 1, 0, 0.65), tone("sine", 4, 0, 0.12), tone("sine", 2, 0, 0.1)],
  },
});

// A spectral parlour chorus: saws sung through the formants of "ah" (pad) and
// "oh" (lead), with a slow shimmer and a singer's vibrato.
const AETHER_CHOIR = deepFreeze({
  id: "aether_choir",
  label: "ÆTHER CHOIR",
  program: 52, // Choir Aahs
  pad: {
    level: 0.5,
    attack: { share: 0.5, min: 0.25, max: 1 },
    sustain: 0.85,
    sustainTau: 0.6,
    release: 1.4,
    tail: 1.6,
    filter: { type: "lowpass", q: 0.5, base: 1500, peak: 3500, settle: 3000, settleTau: 0.6 },
    width: 0.6,
    chorus: { rate: 0.3, depth: 8 },
    formants: [{ freq: 730, q: 6, gain: 2 }, { freq: 1090, q: 8, gain: 1.25 }, { freq: 2440, q: 8, gain: 0.75 }],
    root: [layer("sawtooth", 1, 0, 0.8, "center", true), layer("triangle", 1, 0, 0.3)],
    upper: [layer("sawtooth", 1, -7, 0.7, "left", true), layer("sawtooth", 1, 7, 0.7, "right", true), layer("triangle", 1, 0, 0.2)],
  },
  pluck: {
    level: 0.11,
    accentLevel: 0.15,
    attack: 0.03,
    decay: { share: 2, min: 0.2, max: 0.7 },
    tail: 0.08,
    filter: { type: "lowpass", q: 0.8, base: 1600, accentBase: 2000, to: 600 },
    layers: [tone("sawtooth", 1, 0, 0.35), tone("triangle", 1, 0, 0.7)],
  },
  lead: {
    level: 0.35,
    attack: 0.08,
    sustain: 0.85,
    sustainTau: 0.4,
    releaseTau: 0.12,
    minLength: 0.16,
    tail: 0.5,
    glide: 0.09,
    filter: { type: "lowpass", q: 0.5, base: 3200 },
    vibrato: { rate: 5, depth: 14, delayMax: 0.35, delayShare: 0.5 },
    formants: [{ freq: 450, q: 6, gain: 2 }, { freq: 800, q: 8, gain: 1.25 }, { freq: 2830, q: 8, gain: 0.6 }],
    layers: [tone("sawtooth", 1, 0, 0.8), tone("triangle", 1, 0, 0.3)],
  },
});

// The shipped presets, in chip order (D-040).
export const VOICE_PRESETS = Object.freeze([
  VELVET_PAD, HARMONIUM, GLASS_HARMONICA, THEATRE_ORGAN, STRING_MACHINE, MUSIC_BOX, AETHER_CHOIR,
].map((voice) => validateVoice(voice)));
const PRESETS_BY_ID = new Map(VOICE_PRESETS.map((voice) => [voice.id, voice]));
export const VOICE_IDS = Object.freeze(VOICE_PRESETS.map((voice) => voice.id));

// THE CREATURE'S OWN voice (D-040): the spell picks a preset (`fun_voice`),
// tilts its filters up to half an octave brighter or darker (`fun_bright`,
// -3..3), and narrows or widens its detune, chorus, and stereo spread
// (`fun_spread`, 0..4, where 2 is the preset as tuned). Formants stay put:
// they are the vowel, not the brightness.
export const CREATURE_VOICE_ID = "creature";
const BRIGHT_WORDS = Object.freeze(["DARKEST", "DARKER", "DARK", "", "BRIGHT", "BRIGHTER", "BRIGHTEST"]);
const SPREAD_WORDS = Object.freeze(["NARROWEST", "NARROW", "", "WIDE", "WIDEST"]);

const clamp = (value, low, high) => Math.min(high, Math.max(low, value));

export function creatureVoice(score) {
  const base = VOICE_PRESETS[score.funVoice] ?? VOICE_PRESETS[0];
  const tilt = 2 ** (score.funBright / 6);
  const spread = 0.6 + score.funSpread * 0.2;
  const voice = structuredClone(base);
  const brighten = (filter, keys) => { for (const key of keys) filter[key] = clamp(Math.round(filter[key] * tilt), ...FREQUENCY); };
  const widen = (layers) => { for (const layer of layers) layer.detune = clamp(layer.detune * spread, -50, 50); };
  brighten(voice.pad.filter, ["base", "peak", "settle"]);
  brighten(voice.pluck.filter, ["base", "accentBase", "to"]);
  brighten(voice.lead.filter, ["base"]);
  widen(voice.pad.root);
  widen(voice.pad.upper);
  widen(voice.pluck.layers);
  widen(voice.lead.layers);
  voice.pad.width = clamp(voice.pad.width * spread, 0, 1);
  voice.pad.chorus.depth = clamp(voice.pad.chorus.depth * spread, 0, 30);
  voice.id = CREATURE_VOICE_ID;
  return validateVoice(voice);
}

/** How the creature's voice reads: "GLASS HARMONICA · BRIGHTER · WIDE". */
export function creatureVoiceLabel(score) {
  const base = VOICE_PRESETS[score.funVoice] ?? VOICE_PRESETS[0];
  return [base.label, BRIGHT_WORDS[score.funBright + 3], SPREAD_WORDS[score.funSpread]].filter(Boolean).join(" · ");
}

/** The preset with this id, or VELVET PAD for anything unknown. */
export function voiceById(id) {
  return PRESETS_BY_ID.get(id) ?? PRESETS_BY_ID.get(DEFAULT_VOICE_ID);
}

// ---------------------------------------------------------------------------
// Schedulers. Each takes the context, a destination, a validated voice, and
// times already clamped by the caller; `hold` is the vitrine press (0..1).

const midiToFrequency = (midi) => 440 * 2 ** ((midi - 69) / 12);

// Routes `source` (the part's filter) to `env`, through formants when the part
// has them. Returns nothing; the formant nodes live as long as the filter.
function connectThroughFormants(context, source, env, formants, start) {
  if (!formants) {
    source.connect(env);
    return;
  }
  for (const formant of formants) {
    const band = context.createBiquadFilter();
    const level = context.createGain();
    band.type = "bandpass";
    band.frequency.setValueAtTime(formant.freq, start);
    band.Q.setValueAtTime(formant.q, start);
    level.gain.setValueAtTime(formant.gain, start);
    source.connect(band).connect(level).connect(env);
  }
}

// Sends `env` to `destination`, through a tremolo when the part has one.
// Returns the tremolo LFO (to start and stop with the note), or null.
function connectThroughTremolo(context, env, destination, tremolo, start) {
  if (!tremolo) {
    env.connect(destination);
    return null;
  }
  const swell = context.createGain();
  const lfo = context.createOscillator();
  const depth = context.createGain();
  swell.gain.setValueAtTime(1 - tremolo.depth, start);
  lfo.frequency.setValueAtTime(tremolo.rate, start);
  depth.gain.setValueAtTime(tremolo.depth, start);
  lfo.connect(depth).connect(swell.gain);
  env.connect(swell).connect(destination);
  return lfo;
}

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
  connectThroughFormants(context, filter, env, pad.formants, start);
  const tremolo = connectThroughTremolo(context, env, destination, pad.tremolo, start);

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
  const oscillators = tremolo ? [lfo, tremolo] : [lfo];
  const strike = pad.strike;
  for (const [index, midi] of notes.entries()) {
    const freq = midiToFrequency(midi);
    // A rolled chord never takes more than half the chord's length to arrive.
    const noteStart = strike ? start + Math.min(index * strike.strum, sounding / 2) : start;
    for (const layer of index === 0 ? pad.root : pad.upper) {
      const osc = context.createOscillator();
      const gain = context.createGain();
      osc.type = layer.type;
      osc.frequency.setValueAtTime(freq * layer.ratio, noteStart);
      osc.detune.setValueAtTime(layer.detune, noteStart);
      if (layer.chorus) lfoDepth.connect(osc.detune);
      if (strike) {
        gain.gain.setValueAtTime(0.0001, noteStart);
        gain.gain.linearRampToValueAtTime(layer.gain, noteStart + 0.004);
        gain.gain.exponentialRampToValueAtTime(0.0001, noteStart + strike.decay);
      } else {
        gain.gain.setValueAtTime(layer.gain, start);
      }
      osc.connect(gain).connect(sides[layer.side]);
      osc.start(noteStart);
      osc.stop(stopAt);
      oscillators.push(osc);
    }
  }
  for (const modulator of tremolo ? [lfo, tremolo] : [lfo]) {
    modulator.start(start);
    modulator.stop(stopAt);
  }
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
  connectThroughFormants(context, filter, env, lead.formants, start);
  const tremolo = connectThroughTremolo(context, env, destination, lead.tremolo, start);

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
  for (const modulator of tremolo ? [vibrato, tremolo] : [vibrato]) {
    modulator.start(start);
    modulator.stop(stopAt);
  }
  return { sounding, peak };
}
