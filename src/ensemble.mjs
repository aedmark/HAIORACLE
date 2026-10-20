// The one Web Audio graph for the six-language ensemble. Live playback and the
// offline WAV render both build from here, so an export renders exactly the
// routing the listener hears. Scheduling stays with the host; this module only
// creates and wires nodes, which keeps it testable with a fake context in Node.

export const MIX_LEVEL = 0.28;
export const SILENT_GAIN = 0.0001;

// Resting bus levels. A disabled bandmate drops to SILENT_GAIN rather than
// disconnecting, so toggles can ramp without rebuilding the graph.
export const ENSEMBLE_BUS_GAINS = Object.freeze({
  beat: 0.82,
  bass: 0.84,
  harmony: 0.78,
  chime: 0.8,
  chant: 0.82,
  fungal: 0.72,
  fun: 0.88,
});

const FILTER_TYPES = Object.freeze(["lowpass", "bandpass", "lowpass", "lowpass", "lowpass", "bandpass"]);
const DELAY_MULTIPLIERS = Object.freeze([1, 1.5, 0.75, 2, 1.25, 0.5]);
const DRONE_INTERVALS = Object.freeze([-12, -5, 7]);
const DRONE_DETUNE = Object.freeze([-5, 4, -3]);

export function busGainFor(name, enabled = true) {
  return enabled ? ENSEMBLE_BUS_GAINS[name] : SILENT_GAIN;
}

export function parlorSendLevels({ enabled, reverbEnabled, crackleEnabled, level }) {
  return {
    reverb: enabled && reverbEnabled ? 0.32 * level : SILENT_GAIN,
    crackle: enabled && crackleEnabled ? 0.42 * level : SILENT_GAIN,
  };
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
 */
export function buildEnsembleGraph(context, score, {
  start,
  stop = null,
  fadeIn = true,
  unit,
  outputGain,
  enabled = {},
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
  beatBus.gain.setValueAtTime(busGainFor("beat", enabled.beat ?? true), now);
  bassBus.gain.setValueAtTime(busGainFor("bass", enabled.bass ?? true), now);
  harmonyBus.gain.setValueAtTime(busGainFor("harmony", enabled.harmony ?? true), now);
  chimeBus.gain.setValueAtTime(busGainFor("chime", enabled.chime ?? true), now);
  chantBus.gain.setValueAtTime(busGainFor("chant", enabled.chant ?? true), now);
  fungalBus.gain.setValueAtTime(busGainFor("fungal"), now);
  funBus.gain.setValueAtTime(busGainFor("fun"), now);
  filter.type = FILTER_TYPES[score.voice];
  filter.frequency.value = 720 + score.bloom * 20 + score.hueShift * 1.6;
  filter.Q.value = 1.6 + score.edge / 28;
  compressor.threshold.value = -18;
  compressor.knee.value = 18;
  compressor.ratio.value = 5;
  delay.delayTime.value = Math.min(1.45, unit * DELAY_MULTIPLIERS[score.rhythm]);
  feedback.gain.value = 0.14 + score.bloom / 650;
  output.gain.value = outputGain;

  // Drums and bass skip the creature filter so they keep their weight; the Fun
  // Machine reaches the output both dry and compressed so it sits on top.
  mix.connect(filter);
  harmonyBus.connect(filter);
  chimeBus.connect(filter);
  chantBus.connect(filter);
  fungalBus.connect(filter);
  beatBus.connect(compressor);
  bassBus.connect(compressor);
  funBus.connect(output);
  funBus.connect(compressor);

  if (panner) {
    panner.pan.setValueAtTime(0, now);
    filter.connect(panner);
    panner.connect(compressor);
    panner.connect(delay);
  } else {
    filter.connect(compressor);
    filter.connect(delay);
  }

  filter.connect(output);
  delay.connect(feedback).connect(delay);
  delay.connect(compressor);
  compressor.connect(output).connect(context.destination);

  // Parlor chamber reverb. The 180 Hz highpass send keeps sub-bass and filter
  // resonance out of the convolver (D-022).
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
  filter.connect(parlorReverbFilter).connect(parlorReverbSend).connect(parlorConvolver).connect(compressor);

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
