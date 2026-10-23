// The one Web Audio graph for the six-language ensemble. Live playback and the
// offline WAV render both build from here, so an export renders exactly the
// routing the listener hears. Scheduling stays with the host; this module only
// creates and wires nodes, which keeps it testable with a fake context in Node.

import { MIXER_CHANNELS } from "./mixer.mjs";

export const MIX_LEVEL = 0.28;
export const SILENT_GAIN = 0.0001;

// Fixed voicing level of each bus before its mixer strip. Muting, soloing, and
// fader moves happen on the strip, so these never change at runtime.
export const ENSEMBLE_BUS_GAINS = Object.freeze({
  beat: 0.82,
  bass: 0.84,
  harmony: 0.78,
  chime: 0.8,
  chant: 0.82,
  fungal: 0.72,
  fun: 0.88,
});

// Default voicing balance, in dB, applied on each strip before its fader so
// the console still opens at unity. Solo renders measured the lead about level
// with the bass and the choir roughly 20 dB under it, so both are lifted.
export const CHANNEL_VOICING_DB = Object.freeze({
  lead: 6,
  fun: 0,
  beat: 0,
  bass: 0,
  // The organ and chimes were tuned under the creature filter; free of it
  // they still sat under the band, so they lift (D-042).
  harmony: 4,
  chime: 6,
  chant: 12,
  // The per-form mycelium voices measured about 3 dB under the old one (D-042).
  fungal: 4,
});

export function voicingGain(id) {
  return 10 ** ((CHANNEL_VOICING_DB[id] ?? 0) / 20);
}

// Parallel unfiltered lead level by creature filter type. A narrow bandpass
// tuned well above the melody buried the lead (D-024), so bandpass creatures
// blend a dry copy under their filtered voice; lowpass creatures keep a
// little of their overtones the same way (D-042).
export const LEAD_DRY_TAP = Object.freeze({ lowpass: 0.3, bandpass: 0.5 });

const FILTER_TYPES = Object.freeze(["lowpass", "bandpass", "lowpass", "lowpass", "lowpass", "bandpass"]);

/**
 * The creature filter's resting cutoff and resonance, shared by the graph
 * (and so every export) and the live vitrine modulation. It colours only the
 * LOLCODE lead now (D-042); it used to sit at 1.1-3.5 kHz with Q up to 5.8 and
 * muffle the lead, the organ, the chimes, and the mycelium.
 */
export function creatureFilter(score) {
  return {
    type: FILTER_TYPES[score.voice],
    cutoff: 1300 + score.bloom * 32 + score.hueShift * 3,
    q: 0.9 + score.edge / 40,
  };
}
const DELAY_MULTIPLIERS = Object.freeze([1, 1.5, 0.75, 2, 1.25, 0.5, 0.75]);
const DRONE_INTERVALS = Object.freeze([-12, -5, 7]);
const DRONE_DETUNE = Object.freeze([-5, 4, -3]);

// Parlor room levels per unit of the ambience slider. The crackle was halved
// after listening found it overpowered the band (it had been 0.42). The
// reverb send was raised from 0.32 once the room heard every voice: measured
// on exported loops, it sat 25-29 dB under the mix, too faint to hear as a room.
export const PARLOR_REVERB_PER_LEVEL = 1.0;
export const PARLOR_CRACKLE_PER_LEVEL = 0.21;
// The pulse is heard in the room at half strength; the bass stays dry.
export const PARLOR_BEAT_SEND = 0.5;

export function parlorSendLevels({ enabled, reverbEnabled, crackleEnabled, level }) {
  return {
    reverb: enabled && reverbEnabled ? PARLOR_REVERB_PER_LEVEL * level : SILENT_GAIN,
    crackle: enabled && crackleEnabled ? PARLOR_CRACKLE_PER_LEVEL * level : SILENT_GAIN,
  };
}

/**
 * The echo time for a score at a tempo: a rhythm-dependent multiple of one
 * loop step (an eighth note), capped by the delay line. The live loop calls
 * this again whenever the tempo changes, so echoes stay on the beat.
 */
export function delayTimeFor(score, bpm, rhythmOverride = undefined) {
  const unit = 60 / bpm / 2;
  const rhythmIndex = rhythmOverride !== undefined ? rhythmOverride : (score?.rhythm ?? 0);
  return Math.min(1.45, unit * (DELAY_MULTIPLIERS[rhythmIndex] ?? 1));
}

/**
 * Moves a MIDI note by whole octaves into [low, high], keeping its pitch
 * class. Voices used to clamp instead, so a low-rooted creature's bass, organ,
 * and choir collapsed onto the range edge (every bass note an E1) and played
 * the wrong notes.
 */
export function foldIntoRange(midi, low, high = Infinity) {
  let note = midi;
  while (note < low) note += 12;
  while (note > high && note - 12 >= low) note -= 12;
  return note;
}

// The spell's roots run from MIDI 30 to 65, and half of all creatures used to
// sing their whole melody in the bass register (down to 46 Hz), which sounded
// muffled whatever the filter did. The lead now rises by whole octaves until
// its root reaches C3, keeping the melody's contour; drones stay low (D-042).
export const LEAD_FLOOR = 48;

export function leadOctaveShift(score) {
  return score.root >= LEAD_FLOOR ? 0 : 12 * Math.ceil((LEAD_FLOOR - score.root) / 12);
}

// The tonic drones used to hold one pitch at one level for the whole loop;
// on bright waveforms that sounded like a stuck lead note. The host now moves
// them each region: they glide to the conducted chord's root and swell to
// DRONE_SWELL, then settle toward DRONE_SETTLE, and fall silent while the
// arrangement rests the lead. A separate envelope stage carries this, so the
// vitrine's own drone gains (interaction) stay independent.
export const DRONE_SWELL = 1;
export const DRONE_SETTLE = 0.35;

/** Drone frequencies for a chord root (semitones above the tonic), moved by the shortest way. */
export function droneFrequencies(score, chordRoot) {
  const root = ((Math.trunc(chordRoot) % 12) + 12) % 12;
  const shift = root > 6 ? root - 12 : root;
  return DRONE_INTERVALS.map((interval) => midiToFrequency(score.root + shift + interval));
}

function midiToFrequency(note) {
  return 440 * (2 ** ((note - 69) / 12));
}

/**
 * Builds and connects the ensemble graph on `context`.
 *
 * `start` is the context time sound begins. `stop`, when given, ends the
 * looping sources (drones, wax crackle) so an OfflineAudioContext can finish.
 * `fadeIn` ramps the drone mix in for live starts; offline loops begin at level.
 * `impulseBuffer` and `crackleBuffer` are optional: a missing buffer leaves
 * that parlor layer silent instead of failing the whole graph.
 * `channels` maps mixer channel ids to `{ gain, pan }` for their strips (a
 * missing channel sits at unity, centered). `meters` adds an AnalyserNode tap to
 * each strip for live VU metering; offline renders leave it off.
 */
export function buildEnsembleGraph(context, score, {
  start,
  stop = null,
  fadeIn = true,
  unit,
  outputGain,
  channels = {},
  meters = false,
  parlor = { reverb: SILENT_GAIN, crackle: SILENT_GAIN },
  impulseBuffer = null,
  crackleBuffer = null,
  rhythmIndex = undefined,
} = {}) {
  const now = start;
  const mix = context.createGain();
  const beatBus = context.createGain();
  const bassBus = context.createGain();
  const harmonyBus = context.createGain();
  const chimeBus = context.createGain();
  const chantBus = context.createGain();
  const fungalBus = context.createGain();
  const funBus = context.createGain();
  const filter = context.createBiquadFilter();
  const panner = typeof context.createStereoPanner === "function" ? context.createStereoPanner() : null;
  const compressor = context.createDynamicsCompressor();
  const delay = context.createDelay(1.5);
  const feedback = context.createGain();
  const output = context.createGain();

  if (fadeIn) {
    mix.gain.setValueAtTime(SILENT_GAIN, now);
    mix.gain.exponentialRampToValueAtTime(0.28, now + 0.16);
  } else {
    mix.gain.setValueAtTime(MIX_LEVEL, now);
  }
  beatBus.gain.setValueAtTime(ENSEMBLE_BUS_GAINS.beat, now);
  bassBus.gain.setValueAtTime(ENSEMBLE_BUS_GAINS.bass, now);
  harmonyBus.gain.setValueAtTime(ENSEMBLE_BUS_GAINS.harmony, now);
  chimeBus.gain.setValueAtTime(ENSEMBLE_BUS_GAINS.chime, now);
  chantBus.gain.setValueAtTime(ENSEMBLE_BUS_GAINS.chant, now);
  fungalBus.gain.setValueAtTime(ENSEMBLE_BUS_GAINS.fungal, now);
  funBus.gain.setValueAtTime(ENSEMBLE_BUS_GAINS.fun, now);
  const creature = creatureFilter(score);
  filter.type = creature.type;
  filter.frequency.value = creature.cutoff;
  filter.Q.value = creature.q;
  compressor.threshold.value = -18;
  compressor.knee.value = 18;
  compressor.ratio.value = 5;
  delay.delayTime.value = delayTimeFor(score, 60 / (unit * 2), rhythmIndex);
  feedback.gain.value = 0.14 + score.bloom / 650;
  output.gain.value = outputGain;

  // Mixer strips: bus -> voicing trim -> fader -> pan, with an optional analyser tap after the
  // pan so meters show what is heard. The fader upmixes mono voices to stereo
  // first, so a centered StereoPanner passes them at unity instead of applying
  // the -3 dB equal-power law it uses for mono input.
  const buses = { mix, beatBus, bassBus, harmonyBus, chimeBus, chantBus, fungalBus, funBus };
  const strips = {};
  for (const { id, bus } of MIXER_CHANNELS) {
    const setting = channels[id] || { gain: 1, pan: 0 };
    const trim = context.createGain();
    trim.gain.value = voicingGain(id);
    const fader = context.createGain();
    fader.channelCount = 2;
    fader.channelCountMode = "explicit";
    fader.channelInterpretation = "speakers";
    fader.gain.setValueAtTime(setting.gain, now);
    buses[bus].connect(trim).connect(fader);
    let out = fader;
    let pan = null;
    if (typeof context.createStereoPanner === "function") {
      pan = context.createStereoPanner();
      pan.pan.setValueAtTime(setting.pan, now);
      out = fader.connect(pan);
    }
    let analyser = null;
    if (meters && typeof context.createAnalyser === "function") {
      analyser = context.createAnalyser();
      analyser.fftSize = 1024;
      out.connect(analyser);
    }
    strips[id] = { trim, fader, pan, analyser, out };
  }

  // Only the LOLCODE lead wears the creature filter (D-042). Drums and bass
  // skip it to keep their weight; the Fun Machine reaches the output both dry
  // and compressed so it sits on top. The choir, organ, chimes, and mycelium
  // skip it too: a bandpass creature silenced the organ outright (its meter
  // moved, because meters read before the filter), and a lowpass one dulled
  // the chimes and cut the mycelium's 3-4 kHz clicks. They still feed the
  // delay and, below, the parlor reverb.
  strips.lead.out.connect(filter);
  for (const id of ["chant", "harmony", "chime", "fungal"]) {
    strips[id].out.connect(compressor);
    strips[id].out.connect(delay);
  }
  const leadDry = context.createGain();
  leadDry.gain.value = LEAD_DRY_TAP[filter.type] ?? 0;
  strips.lead.out.connect(leadDry);
  leadDry.connect(compressor);
  leadDry.connect(delay);
  strips.beat.out.connect(compressor);
  strips.bass.out.connect(compressor);
  strips.fun.out.connect(output);
  strips.fun.out.connect(compressor);
  // The accompanist's pad needs space to bloom: send it to the delay too, and
  // (below) into the chamber reverb (D-028).
  strips.fun.out.connect(delay);

  if (panner) {
    // The vitrine panner used to receive mono and pass -3 dB at center; with
    // stereo strips it passes unity, so this trim keeps the pre-mixer balance.
    const pannerTrim = context.createGain();
    pannerTrim.gain.value = Math.SQRT1_2;
    panner.pan.setValueAtTime(0, now);
    filter.connect(panner).connect(pannerTrim);
    pannerTrim.connect(compressor);
    pannerTrim.connect(delay);
  } else {
    filter.connect(compressor);
    filter.connect(delay);
  }

  filter.connect(output);
  delay.connect(feedback).connect(delay);
  delay.connect(compressor);
  compressor.connect(output).connect(context.destination);

  // Parlor chamber reverb. Every voice but the bass is heard in the room,
  // post-fader so the console's balance carries into it. It used to hear only
  // the creature filter's output (plus choir and pad), which a narrow bandpass
  // creature nearly silences, so the room was ~45 dB under the mix. The 180 Hz
  // highpass keeps sub-bass and resonance out of the convolver (D-022).
  const parlorReverbSend = context.createGain();
  const parlorReverbFilter = context.createBiquadFilter();
  parlorReverbFilter.type = "highpass";
  parlorReverbFilter.frequency.setValueAtTime(180, now);
  parlorReverbFilter.Q.setValueAtTime(0.7, now);
  const parlorConvolver = context.createConvolver();
  try {
    parlorConvolver.normalize = false;
  } catch {
    // Older engines reject the property; their default normalization is tolerable.
  }
  if (impulseBuffer) {
    try {
      parlorConvolver.buffer = impulseBuffer;
    } catch {
      // A rejected buffer leaves the chamber silent rather than failing playback.
    }
  }
  parlorReverbSend.gain.setValueAtTime(parlor.reverb, now);
  parlorReverbFilter.connect(parlorReverbSend).connect(parlorConvolver).connect(compressor);
  for (const id of ["lead", "harmony", "chime", "chant", "fungal", "fun"]) strips[id].out.connect(parlorReverbFilter);
  const parlorBeatSend = context.createGain();
  parlorBeatSend.gain.value = PARLOR_BEAT_SEND;
  strips.beat.out.connect(parlorBeatSend).connect(parlorReverbFilter);

  let parlorCrackleSource = null;
  let parlorCrackleGain = null;
  if (crackleBuffer) {
    try {
      parlorCrackleSource = context.createBufferSource();
      parlorCrackleSource.buffer = crackleBuffer;
      parlorCrackleSource.loop = true;
      parlorCrackleGain = context.createGain();
      parlorCrackleGain.gain.setValueAtTime(parlor.crackle, now);
      parlorCrackleSource.connect(parlorCrackleGain).connect(output);
      parlorCrackleSource.start(now);
      if (stop !== null) parlorCrackleSource.stop(stop);
    } catch {
      parlorCrackleSource = null;
      parlorCrackleGain = null;
    }
  }

  const drones = [];
  const droneGains = [];
  const droneEnvelopes = [];
  const initialDroneGains = [0.085, score.voice === 5 ? 0.035 : 0.018, SILENT_GAIN];
  for (const [index, interval] of DRONE_INTERVALS.entries()) {
    const drone = context.createOscillator();
    const droneGain = context.createGain();
    drone.type = index === 0
      ? (score.waveform === "square" ? "triangle" : score.waveform)
      : "sine";
    drone.frequency.value = midiToFrequency(score.root + interval);
    drone.detune.value = DRONE_DETUNE[index];
    droneGain.gain.value = initialDroneGains[index];
    const envelope = context.createGain();
    envelope.gain.value = DRONE_SWELL;
    drone.connect(droneGain).connect(envelope).connect(mix);
    droneEnvelopes.push(envelope);
    drone.start(now);
    if (stop !== null) drone.stop(stop);
    drones.push(drone);
    droneGains.push(droneGain);
  }

  return {
    mix,
    beatBus,
    bassBus,
    harmonyBus,
    chimeBus,
    chantBus,
    fungalBus,
    funBus,
    strips,
    leadDry,
    filter,
    panner,
    compressor,
    delay,
    feedback,
    output,
    drones,
    droneGains,
    droneEnvelopes,
    parlorReverbSend,
    parlorCrackleGain,
    parlorCrackleSource,
  };
}
