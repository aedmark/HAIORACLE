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
  harmony: 0,
  chime: 0,
  chant: 12,
  fungal: 0,
});

export function voicingGain(id) {
  return 10 ** ((CHANNEL_VOICING_DB[id] ?? 0) / 20);
}

// Parallel unfiltered lead level by creature filter type. A narrow bandpass
// tuned well above the melody buried the lead (D-024), so bandpass creatures
// blend a dry copy under their filtered voice; lowpass creatures are unchanged.
export const LEAD_DRY_TAP = Object.freeze({ lowpass: 0, bandpass: 0.5 });

const FILTER_TYPES = Object.freeze(["lowpass", "bandpass", "lowpass", "lowpass", "lowpass", "bandpass"]);
const DELAY_MULTIPLIERS = Object.freeze([1, 1.5, 0.75, 2, 1.25, 0.5]);
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
export function delayTimeFor(score, bpm) {
  const unit = 60 / bpm / 2;
  return Math.min(1.45, unit * DELAY_MULTIPLIERS[score.rhythm]);
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
  filter.type = FILTER_TYPES[score.voice];
  filter.frequency.value = 720 + score.bloom * 20 + score.hueShift * 1.6;
  filter.Q.value = 1.6 + score.edge / 28;
  compressor.threshold.value = -18;
  compressor.knee.value = 18;
  compressor.ratio.value = 5;
  delay.delayTime.value = delayTimeFor(score, 60 / (unit * 2));
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

  // Drums and bass skip the creature filter so they keep their weight; the Fun
  // Machine reaches the output both dry and compressed so it sits on top. The
  // choir skips it too: its voices are already shaped by their own formant
  // bandpasses, and a narrow bandpass creature filter on top silenced them.
  // It still feeds the delay and, below, the parlor reverb.
  strips.lead.out.connect(filter);
  strips.harmony.out.connect(filter);
  strips.chime.out.connect(filter);
  strips.fungal.out.connect(filter);
  strips.chant.out.connect(compressor);
  strips.chant.out.connect(delay);
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
    drone.connect(droneGain).connect(mix);
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
    parlorReverbSend,
    parlorCrackleGain,
    parlorCrackleSource,
  };
}
