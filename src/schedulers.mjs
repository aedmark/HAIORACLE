import { GM_DRUMS } from "./midi.mjs";
import { myceliumEvents } from "./mycelium.mjs";
import { foldIntoRange, leadOctaveShift } from "./ensemble.mjs";
import { interaction, mulberry32 } from "./vitrine-canvas.mjs";

export const LEAD_DUCK_GAIN = 10 ** (-10 / 20);

export function midiToFrequency(note) {
  return 440 * (2 ** ((note - 69) / 12));
}

export function harmonicField() {
  const radius = Math.min(1, Math.hypot(interaction.smoothX, interaction.smoothY)) * interaction.hold;
  const angle = Math.atan2(interaction.smoothY, interaction.smoothX);
  const unitPhase = (angle + Math.PI) / (Math.PI * 2);
  const cyclePosition = unitPhase * 12;
  const phaseStep = Math.floor(cyclePosition) % 12;
  const phaseFraction = cyclePosition - Math.floor(cyclePosition);
  const crossfadeAngle = (Math.PI * 0.5) * Math.min(1, radius * (0.45 + 0.55 * phaseFraction));
  return {
    radius,
    angle,
    unitPhase,
    phaseStep: (phaseStep + 1) % 12,
    primaryWeight: Math.cos(crossfadeAngle),
    shiftedWeight: Math.sin(crossfadeAngle),
  };
}

export function voiceStack(score, step) {
  const stacks = [
    [{ interval: 0, detune: 0, gain: 1 }],
    [{ interval: 0, detune: -5, gain: 0.72 }, { interval: 0, detune: 7, gain: 0.48 }],
    [{ interval: 0, detune: 0, gain: 0.78 }, { interval: -12, detune: -3, gain: 0.32 }],
    [{ interval: 0, detune: 0, gain: 0.76 }, { interval: -12, detune: 4, gain: 0.3 }],
    [{ interval: 0, detune: -9, gain: 0.6 }, { interval: 12, detune: 9, gain: 0.28 }],
    [{ interval: 0, detune: 0, gain: 0.64 }, { interval: -12, detune: -3, gain: 0.24 }, { interval: 12, detune: 3, gain: 0.22 }],
  ];
  const selected = stacks[score.voice];
  return step % 6 === 5 && score.voice < 4
    ? [...selected, { interval: 12, detune: 0, gain: 0.2 }]
    : selected;
}

let noiseBuffer = null;
let cachedWaxCrackleBuffer = null;
let cachedParlorImpulseBuffer = null;

export function ensureNoiseBuffer(context) {
  if (noiseBuffer && noiseBuffer.sampleRate === context.sampleRate) return noiseBuffer;
  const length = Math.floor(context.sampleRate * 0.25);
  const buffer = context.createBuffer(1, length, context.sampleRate);
  const channel = buffer.getChannelData(0);
  const random = mulberry32(0x4d414c42);
  for (let i = 0; i < length; i += 1) {
    channel[i] = random() * 2 - 1;
  }
  noiseBuffer = buffer;
  return buffer;
}

export function ensureWaxCrackleBuffer(context, durationSeconds = 4.0) {
  if (cachedWaxCrackleBuffer && cachedWaxCrackleBuffer.sampleRate === context.sampleRate) {
    return cachedWaxCrackleBuffer;
  }
  const frames = Math.ceil(context.sampleRate * durationSeconds);
  const buffer = context.createBuffer(2, frames, context.sampleRate);
  const left = buffer.getChannelData(0);
  const right = buffer.getChannelData(1);

  let b0L = 0, b1L = 0, b2L = 0;
  let b0R = 0, b1R = 0, b2R = 0;
  let rumbleL = 0, rumbleR = 0;
  const rotPeriod = 60 / 78; // 78 RPM period ~0.769s

  for (let i = 0; i < frames; i += 1) {
    const t = i / context.sampleRate;
    const rotPhase = (t % rotPeriod) / rotPeriod;
    const rotThump = Math.exp(-Math.pow((rotPhase - 0.12) * 12, 2)) * 0.04;
    const rotWobble = 1 + 0.25 * Math.sin(t * (1 / rotPeriod) * 2 * Math.PI) + rotThump;

    // Filtered brown noise for mechanical turntable rumble (subtle, non-tonal)
    const subWhiteL = Math.random() * 2 - 1;
    const subWhiteR = Math.random() * 2 - 1;
    rumbleL = rumbleL * 0.96 + subWhiteL * 0.04;
    rumbleR = rumbleR * 0.96 + subWhiteR * 0.04;

    // Acoustic horn body noise (bandpass 800Hz - 3.5kHz)
    const whiteL = Math.random() * 2 - 1;
    const whiteR = Math.random() * 2 - 1;
    b0L = 0.85 * b0L + whiteL * 0.15;
    b1L = 0.72 * b1L + (whiteL - b0L) * 0.28;
    b2L = 0.55 * b2L + b1L * 0.45;

    b0R = 0.85 * b0R + whiteR * 0.15;
    b1R = 0.72 * b1R + (whiteR - b0R) * 0.28;
    b2R = 0.55 * b2R + b1R * 0.45;

    const hornL = (b1L - b2L) * 0.24;
    const hornR = (b1R - b2R) * 0.24;

    left[i] = (hornL + rumbleL * 0.20) * rotWobble;
    right[i] = (hornR + rumbleR * 0.20) * rotWobble;
  }

  // Dense stylus micro-crackle: small asperities with fast exponential decay
  for (let i = 0; i < frames; i += 1) {
    if (Math.random() < 340 / context.sampleRate) {
      const amp = (Math.random() * 0.28 + 0.08) * (Math.random() < 0.5 ? 1 : -1);
      const decayLen = Math.floor(Math.random() * 12 + 4);
      for (let k = 0; k < decayLen && i + k < frames; k += 1) {
        const env = Math.exp(-k * 0.42);
        left[i + k] += amp * env;
        right[i + k] += amp * env * (0.7 + Math.random() * 0.6);
      }
    }
  }

  // Discrete dust pops & shellac clicks with damped acoustic ringing
  for (let i = 0; i < frames; i += 1) {
    if (Math.random() < 38 / context.sampleRate) {
      const popAmp = (Math.random() * 0.55 + 0.30) * (Math.random() < 0.5 ? 1 : -1);
      const popLen = Math.floor(Math.random() * 32 + 16);
      const ringFreq = 1800 + Math.random() * 2200;
      for (let k = 0; k < popLen && i + k < frames; k += 1) {
        const tPop = k / context.sampleRate;
        const env = Math.exp(-k * 0.18) * Math.cos(2 * Math.PI * ringFreq * tPop);
        left[i + k] += popAmp * env;
        right[i + k] += popAmp * env * (0.8 + Math.random() * 0.4);
      }
    }
  }

  // Seamless boundary crossfade to prevent seam click on loop
  const fadeLen = Math.min(2400, Math.floor(frames / 8));
  for (let j = 0; j < fadeLen; j += 1) {
    const ramp = j / fadeLen;
    const tailIdx = frames - fadeLen + j;
    left[tailIdx] = left[tailIdx] * (1 - ramp) + left[j] * ramp;
    right[tailIdx] = right[tailIdx] * (1 - ramp) + right[j] * ramp;
  }

  cachedWaxCrackleBuffer = buffer;
  return buffer;
}

export function ensureParlorImpulseResponse(context, durationSeconds = 1.6) {
  if (cachedParlorImpulseBuffer && cachedParlorImpulseBuffer.sampleRate === context.sampleRate) {
    return cachedParlorImpulseBuffer;
  }
  const frames = Math.ceil(context.sampleRate * durationSeconds);
  const buffer = context.createBuffer(2, frames, context.sampleRate);
  const left = buffer.getChannelData(0);
  const right = buffer.getChannelData(1);

  // Discrete early reflections with alternating polarity and room delays
  const reflections = [
    { t: 0.007, gL: 0.35, gR: -0.28 },
    { t: 0.015, gL: -0.28, gR: 0.32 },
    { t: 0.024, gL: 0.22, gR: -0.19 },
    { t: 0.036, gL: -0.18, gR: 0.22 },
    { t: 0.052, gL: 0.14, gR: -0.15 },
    { t: 0.073, gL: -0.11, gR: 0.12 },
    { t: 0.098, gL: 0.08, gR: -0.09 },
    { t: 0.128, gL: -0.06, gR: 0.07 },
  ];

  for (const ref of reflections) {
    const idx = Math.min(frames - 1, Math.floor(ref.t * context.sampleRate));
    left[idx] += ref.gL;
    right[idx] += ref.gR;
  }

  // Tail with highpass DC block and air damping to eliminate low-frequency fog-horn resonance
  let lpL = 0, lpR = 0;
  let hpInL = 0, hpOutL = 0;
  let hpInR = 0, hpOutR = 0;
  const R = 0.985; // ~105Hz highpass cutoff preventing low-end rumble accumulation

  for (let i = 0; i < frames; i += 1) {
    const t = i / context.sampleRate;
    const decay = Math.exp(-2.8 * t);
    const whiteL = (Math.random() * 2 - 1) * decay * 0.25;
    const whiteR = (Math.random() * 2 - 1) * decay * 0.25;

    // Air absorption damping (gentle lowpass)
    const filterCoeff = 0.55 + 0.35 * Math.exp(-3.5 * t);
    lpL = lpL * filterCoeff + whiteL * (1 - filterCoeff);
    lpR = lpR * filterCoeff + whiteR * (1 - filterCoeff);

    // DC-block highpass filter
    hpOutL = lpL - hpInL + R * hpOutL;
    hpInL = lpL;
    hpOutR = lpR - hpInR + R * hpOutR;
    hpInR = lpR;

    left[i] += hpOutL;
    right[i] += hpOutR;
  }

  // Measure peak spectral magnitude to normalize impulse response to safe unity room gain
  const probeFreqs = [30, 60, 90, 120, 150, 200, 300, 500, 1000, 2000, 4000];
  let maxSpectralMag = 0;
  for (const f of probeFreqs) {
    let re = 0, im = 0;
    const omega = 2 * Math.PI * f / context.sampleRate;
    for (let n = 0; n < frames; n += 2) {
      re += left[n] * Math.cos(omega * n);
      im -= left[n] * Math.sin(omega * n);
    }
    const mag = Math.sqrt(re * re + im * im) * 2;
    if (mag > maxSpectralMag) maxSpectralMag = mag;
  }

  const targetGain = 0.75;
  const normFactor = maxSpectralMag > 0 ? targetGain / maxSpectralMag : 0.05;
  for (let i = 0; i < frames; i += 1) {
    left[i] *= normFactor;
    right[i] *= normFactor;
  }

  cachedParlorImpulseBuffer = buffer;
  return buffer;
}

export function triggerPercussion(kind, normX = 0, normY = 0, strength = 1, {
  audioContext = null,
  currentTransport = null,
  muted = false,
  score = null,
  parlorAcousticsEnabled = true,
  parlorReverbEnabled = true,
} = {}) {
  if (!audioContext || !currentTransport || muted || !score) return;
  const now = audioContext.currentTime;
  const melody = currentTransport.melody;
  const sector = Math.floor((((Math.atan2(normY, normX) + Math.PI) / (Math.PI * 2)) * 12)) % 12;
  const degree = melody[(currentTransport.step + sector) % melody.length] || 0;
  const registerLift = -normY > 0.35 ? 12 : (-normY < -0.35 ? 0 : 7);
  const baseMidi = score.root + degree + registerLift;
  const baseFreq = midiToFrequency(baseMidi);

  if (kind === "strike") {
    for (const [partialIndex, ratio] of [0.5, 1, 1.5, 2].entries()) {
      const partialOsc = audioContext.createOscillator();
      const partialGain = audioContext.createGain();
      partialOsc.type = partialIndex < 2 ? "sine" : "triangle";
      partialOsc.frequency.setValueAtTime(baseFreq * ratio, now);
      partialOsc.detune.setValueAtTime((partialIndex - 1.5) * 2.5, now);
      const duration = 0.42 - partialIndex * 0.065;
      const peak = [0.09, 0.13, 0.075, 0.045][partialIndex] * strength;
      partialGain.gain.setValueAtTime(0.0001, now);
      partialGain.gain.exponentialRampToValueAtTime(peak, now + 0.016);
      partialGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
      partialOsc.connect(partialGain).connect(currentTransport.mix);
      partialOsc.start(now);
      partialOsc.stop(now + duration + 0.04);
    }
    // High resonant sizzle if organism is irritated
    if (interaction.agitation > 0.3) {
      const dissOsc = audioContext.createOscillator();
      const dissGain = audioContext.createGain();
      dissOsc.type = "sawtooth";
      dissOsc.frequency.setValueAtTime(baseFreq * 3.73, now);
      const dissDur = 0.18;
      const dissPeak = 0.045 * strength * interaction.agitation;
      dissGain.gain.setValueAtTime(0.0001, now);
      dissGain.gain.exponentialRampToValueAtTime(dissPeak, now + 0.01);
      dissGain.gain.exponentialRampToValueAtTime(0.0001, now + dissDur);
      dissOsc.connect(dissGain).connect(currentTransport.mix);
      dissOsc.start(now);
      dissOsc.stop(now + dissDur + 0.02);
    }
  } else if (kind === "ratchet") {
    for (const [partialIndex, ratio] of [1, 2].entries()) {
      const harmonicOsc = audioContext.createOscillator();
      const harmonicGain = audioContext.createGain();
      harmonicOsc.type = partialIndex === 0 ? "sine" : "triangle";
      harmonicOsc.frequency.setValueAtTime(baseFreq * ratio, now);
      const duration = partialIndex === 0 ? 0.24 : 0.15;
      const peak = (partialIndex === 0 ? 0.085 : 0.038) * strength;
      harmonicGain.gain.setValueAtTime(0.0001, now);
      harmonicGain.gain.exponentialRampToValueAtTime(peak, now + 0.014);
      harmonicGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
      harmonicOsc.connect(harmonicGain).connect(currentTransport.mix);
      harmonicOsc.start(now);
      harmonicOsc.stop(now + duration + 0.03);
    }
  } else if (kind === "retaliation") {
    // 1. Sub-bass kinetic cabinet boom (mass slamming against bell jar)
    const subOsc = audioContext.createOscillator();
    const subGain = audioContext.createGain();
    subOsc.type = "sine";
    subOsc.frequency.setValueAtTime(105, now);
    subOsc.frequency.exponentialRampToValueAtTime(28, now + 0.36);
    subGain.gain.setValueAtTime(0.0001, now);
    subGain.gain.exponentialRampToValueAtTime(0.45 * strength, now + 0.012);
    subGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.42);
    subOsc.connect(subGain).connect(currentTransport.mix);
    subOsc.start(now);
    subOsc.stop(now + 0.46);

    // 2. High-tension glass snap transient
    const snapOsc = audioContext.createOscillator();
    const snapGain = audioContext.createGain();
    snapOsc.type = "triangle";
    snapOsc.frequency.setValueAtTime(1650, now);
    snapOsc.frequency.exponentialRampToValueAtTime(420, now + 0.11);
    snapGain.gain.setValueAtTime(0.0001, now);
    snapGain.gain.exponentialRampToValueAtTime(0.28 * strength, now + 0.005);
    snapGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.13);
    snapOsc.connect(snapGain).connect(currentTransport.mix);
    snapOsc.start(now);
    snapOsc.stop(now + 0.15);

    // 3. Bio-acoustic snarl & air hiss
    const snarlSource = audioContext.createBufferSource();
    snarlSource.buffer = ensureNoiseBuffer(audioContext);
    const snarlFilter = audioContext.createBiquadFilter();
    snarlFilter.type = "bandpass";
    snarlFilter.frequency.setValueAtTime(3400, now);
    snarlFilter.frequency.exponentialRampToValueAtTime(360, now + 0.38);
    snarlFilter.Q.setValueAtTime(4.2, now);
    const snarlGain = audioContext.createGain();
    snarlGain.gain.setValueAtTime(0.0001, now);
    snarlGain.gain.exponentialRampToValueAtTime(0.26 * strength, now + 0.008);
    snarlGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.38);
    snarlSource.connect(snarlFilter).connect(snarlGain).connect(currentTransport.mix);
    snarlSource.start(now);
    snarlSource.stop(now + 0.42);

    // 4. Electric discharge / static spark crackle
    const sparkSource = audioContext.createBufferSource();
    sparkSource.buffer = ensureNoiseBuffer(audioContext);
    const sparkFilter = audioContext.createBiquadFilter();
    sparkFilter.type = "bandpass";
    sparkFilter.frequency.setValueAtTime(5600, now);
    sparkFilter.Q.setValueAtTime(6.5, now);
    const sparkGain = audioContext.createGain();
    sparkGain.gain.setValueAtTime(0.0001, now);
    sparkGain.gain.exponentialRampToValueAtTime(0.22 * strength, now + 0.004);
    sparkGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.18);
    sparkSource.connect(sparkFilter).connect(sparkGain).connect(currentTransport.mix);
    sparkSource.start(now);
    sparkSource.stop(now + 0.2);

    // 5. Parlor reverberation if active
    if (currentTransport.parlorReverbSend && parlorAcousticsEnabled && parlorReverbEnabled) {
      subGain.connect(currentTransport.parlorReverbSend);
      snapGain.connect(currentTransport.parlorReverbSend);
      sparkGain.connect(currentTransport.parlorReverbSend);
    }
  } else if (kind === "dull_thud") {
    // Muted low wooden/glass thud when tapped during sulk recovery
    const thudOsc = audioContext.createOscillator();
    const thudGain = audioContext.createGain();
    thudOsc.type = "sine";
    thudOsc.frequency.setValueAtTime(85, now);
    thudOsc.frequency.exponentialRampToValueAtTime(38, now + 0.08);
    thudGain.gain.setValueAtTime(0.0001, now);
    thudGain.gain.exponentialRampToValueAtTime(0.09 * strength, now + 0.007);
    thudGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.09);
    thudOsc.connect(thudGain).connect(currentTransport.mix);
    thudOsc.start(now);
    thudOsc.stop(now + 0.11);
  }
}

export function triggerSporePuff(strength = 1, atTime = null, {
  audioContext = null,
  currentTransport = null,
  muted = false,
} = {}) {
  if (!audioContext || !currentTransport || muted) return;
  const context = audioContext;
  const now = atTime ?? context.currentTime;
  const bus = currentTransport.fungalBus || currentTransport.mix;

  const noise = context.createBufferSource();
  noise.buffer = ensureNoiseBuffer(context);
  const filter = context.createBiquadFilter();
  filter.type = "bandpass";
  filter.frequency.setValueAtTime(2250, now);
  filter.Q.setValueAtTime(3.2, now);

  const gain = context.createGain();
  const peak = Math.min(0.09, 0.048 * strength);
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(peak, now + 0.005);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.045);

  const pip = context.createOscillator();
  const pipGain = context.createGain();
  pip.type = "sine";
  pip.frequency.setValueAtTime(740, now);
  pip.frequency.exponentialRampToValueAtTime(220, now + 0.038);
  pipGain.gain.setValueAtTime(0.0001, now);
  pipGain.gain.exponentialRampToValueAtTime(peak * 0.75, now + 0.004);
  pipGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.04);

  noise.connect(filter).connect(gain).connect(bus);
  pip.connect(pipGain).connect(bus);
  noise.start(now);
  noise.stop(now + 0.055);
  pip.start(now);
  pip.stop(now + 0.055);
}

// The escapement sits on the master output, under nothing but the master
// volume. Its levels were roughly doubled after measuring it 9 dB under the
// mix's peaks and masked by the wax crackle.
export function scheduleClockworkTick(context, destination, at, stepIndex, level = 0.55, {
  parlorAcousticsEnabled = true,
  parlorTickEnabled = true,
  looperNeedsTick = false,
} = {}) {
  if ((!parlorAcousticsEnabled || !parlorTickEnabled) && !looperNeedsTick) return;
  const isQuarter = stepIndex % 3 === 0;
  const isHighTick = stepIndex === 0 || stepIndex === 6;
  const effLevel = Math.max(0, Math.min(1, looperNeedsTick ? Math.max(level, 0.65) : level));

  if (isQuarter) {
    // 1. Escapement Pallet Strike Transient
    const strikeOsc = context.createOscillator();
    const strikeGain = context.createGain();
    strikeOsc.type = isHighTick ? "triangle" : "sine";
    const startFreq = isHighTick ? 3200 : 2100;
    const endFreq = isHighTick ? 1400 : 820;
    strikeOsc.frequency.setValueAtTime(startFreq, at);
    strikeOsc.frequency.exponentialRampToValueAtTime(endFreq, at + 0.012);

    const strikeAmp = (isHighTick ? 0.42 : 0.36) * effLevel;
    strikeGain.gain.setValueAtTime(strikeAmp, at);
    strikeGain.gain.exponentialRampToValueAtTime(0.0001, at + 0.016);

    strikeOsc.connect(strikeGain).connect(destination);
    strikeOsc.start(at);
    strikeOsc.stop(at + 0.02);

    // 2. Resonant Wood Clock Case Body Knock
    const bodyOsc = context.createOscillator();
    const bodyGain = context.createGain();
    bodyOsc.type = "sine";
    const bodyStartFreq = isHighTick ? 240 : 180;
    bodyOsc.frequency.setValueAtTime(bodyStartFreq, at);
    bodyOsc.frequency.exponentialRampToValueAtTime(55, at + 0.024);

    const bodyAmp = (isHighTick ? 0.30 : 0.32) * effLevel;
    bodyGain.gain.setValueAtTime(bodyAmp, at);
    bodyGain.gain.exponentialRampToValueAtTime(0.0001, at + 0.028);

    bodyOsc.connect(bodyGain).connect(destination);
    bodyOsc.start(at);
    bodyOsc.stop(at + 0.032);
  } else {
    // Intervening mechanical brass gear ratchet tick
    const ratchetOsc = context.createOscillator();
    const ratchetGain = context.createGain();
    const ratchetFilter = context.createBiquadFilter();

    ratchetOsc.type = "triangle";
    ratchetOsc.frequency.setValueAtTime(3800, at);
    ratchetOsc.frequency.exponentialRampToValueAtTime(2200, at + 0.007);

    ratchetFilter.type = "highpass";
    ratchetFilter.frequency.value = 2000;

    const ratchetAmp = 0.09 * effLevel;
    ratchetGain.gain.setValueAtTime(ratchetAmp, at);
    ratchetGain.gain.exponentialRampToValueAtTime(0.0001, at + 0.009);

    ratchetOsc.connect(ratchetFilter).connect(ratchetGain).connect(destination);
    ratchetOsc.start(at);
    ratchetOsc.stop(at + 0.012);
  }
}

export function scheduleNote(context, transport, score, step, at, duration, {
  currentTransport = null,
  activeHeldFunKey = null,
  logNote = () => {},
} = {}) {
  const field = harmonicField();
  const leadRoot = score.root + leadOctaveShift(score);
  const primaryNote = leadRoot + transport.melody[step % transport.melody.length];
  const consonantInterval = interaction.pitchBend > 0.48 ? 12 : (interaction.pitchBend > 0.2 ? 7 : (interaction.pitchBend < -0.45 ? -12 : (interaction.pitchBend < -0.2 ? -5 : 0)));
  const shiftedNote = leadRoot + transport.melody[(step + field.phaseStep) % transport.melody.length] + consonantInterval;
  const envelope = context.createGain();
  const attack = Math.min(0.055, duration * (0.2 + field.radius * 0.06));
  const duck = (transport === currentTransport && activeHeldFunKey !== null) || transport.songLeading ? LEAD_DUCK_GAIN : 1;
  const sulkDuck = transport === currentTransport ? (1 - ((interaction.sulk || 0) * 0.45)) : 1;
  const peakGain = 0.3 * (1 + interaction.hold * 0.16) * duck * sulkDuck;
  envelope.gain.setValueAtTime(0.0001, at);
  envelope.gain.exponentialRampToValueAtTime(peakGain, at + Math.max(0.01, attack));
  envelope.gain.exponentialRampToValueAtTime(0.0001, at + duration);
  envelope.connect(transport.mix);
  logNote(transport, "lead", primaryNote, at, duration, peakGain);

  const chorusPhaseCents = Math.sin(field.angle + step * 0.52) * (6 + 14 * field.radius);
  const layers = field.shiftedWeight > 0.04
    ? [
      { note: primaryNote, weight: field.primaryWeight, detuneOffset: -chorusPhaseCents },
      { note: shiftedNote, weight: field.shiftedWeight, detuneOffset: chorusPhaseCents },
    ]
    : [{ note: primaryNote, weight: 1, detuneOffset: 0 }];

  for (const layer of layers) {
    for (const [voiceIndex, voice] of voiceStack(score, step).entries()) {
      const oscillator = context.createOscillator();
      // The creature's own waveform leads, and the stacked voices mix in a
      // saw or square so the line keeps overtones for the creature filter to
      // shape; all sines and triangles sounded muffled (D-042).
      oscillator.type = voiceIndex === 0
        ? score.waveform
        : ["triangle", "sawtooth", "sine", "square"][(score.wave + voiceIndex + score.voice) % 4];
      oscillator.frequency.value = midiToFrequency(layer.note + voice.interval);
      const liveDetuneMod = transport === currentTransport
        ? (Math.sin(at * 32) * ((interaction.agitation || 0) * 45)) - ((interaction.retaliationPitchDrop || 0) * 360) + ((interaction.sulk || 0) * -25)
        : 0;
      oscillator.detune.value = voice.detune * 0.45 + layer.detuneOffset + (step % 3 - 1) * score.twist * 0.14 + liveDetuneMod;
      const level = context.createGain();
      level.gain.value = voice.gain * layer.weight;
      oscillator.connect(level).connect(envelope);
      oscillator.start(at);
      oscillator.stop(at + duration + 0.06);
    }
  }
}

export function scheduleBeatStep(context, transport, score, stepIndex, at, stepDuration, {
  currentBeat = null,
  engaged = true,
  logNote = () => {},
} = {}) {
  if (!engaged || !currentBeat || !transport.beatBus) return;
  const step = currentBeat.steps[stepIndex % currentBeat.steps.length];
  if (!step) return;

  const holdLift = 1 + interaction.hold * 0.18;

  if (step.kick > 0) {
    const kickOsc = context.createOscillator();
    const kickGain = context.createGain();
    const startFreq = midiToFrequency(score.root - 5);
    const endFreq = Math.max(34, midiToFrequency(score.root - 24));
    const peak = (step.kick === 2 ? 0.24 : 0.13) * holdLift;
    logNote(transport, "beat", GM_DRUMS.kick, at, 0.1, peak);
    const decay = Math.min(0.2, Math.max(0.11, stepDuration * 0.68));
    kickOsc.type = "sine";
    kickOsc.frequency.setValueAtTime(startFreq, at);
    kickOsc.frequency.exponentialRampToValueAtTime(endFreq, at + decay);
    kickGain.gain.setValueAtTime(0.0001, at);
    kickGain.gain.exponentialRampToValueAtTime(peak, at + 0.008);
    kickGain.gain.exponentialRampToValueAtTime(0.0001, at + decay + 0.02);
    kickOsc.connect(kickGain).connect(transport.beatBus);
    kickOsc.start(at);
    kickOsc.stop(at + decay + 0.04);
  }

  if (step.snare > 0) {
    const noise = context.createBufferSource();
    const snareFilter = context.createBiquadFilter();
    const snareGain = context.createGain();
    noise.buffer = ensureNoiseBuffer(context);
    snareFilter.type = "bandpass";
    snareFilter.frequency.setValueAtTime(1180 + (stepIndex % 3) * 160, at);
    snareFilter.Q.setValueAtTime(2.6, at);
    const peak = (step.snare === 2 ? 0.14 : 0.065) * holdLift;
    logNote(transport, "beat", GM_DRUMS.snare, at, 0.1, peak);
    const decay = step.snare === 2 ? 0.11 : 0.065;
    snareGain.gain.setValueAtTime(0.0001, at);
    snareGain.gain.exponentialRampToValueAtTime(peak, at + 0.005);
    snareGain.gain.exponentialRampToValueAtTime(0.0001, at + decay);
    noise.connect(snareFilter).connect(snareGain).connect(transport.beatBus);
    noise.start(at);
    noise.stop(at + decay + 0.02);

    const bodyOsc = context.createOscillator();
    const bodyGain = context.createGain();
    bodyOsc.type = "triangle";
    bodyOsc.frequency.setValueAtTime(midiToFrequency(score.root - 7), at);
    bodyOsc.frequency.exponentialRampToValueAtTime(midiToFrequency(score.root - 14), at + 0.055);
    bodyGain.gain.setValueAtTime(0.0001, at);
    bodyGain.gain.exponentialRampToValueAtTime(peak * 0.55, at + 0.005);
    bodyGain.gain.exponentialRampToValueAtTime(0.0001, at + 0.06);
    bodyOsc.connect(bodyGain).connect(transport.beatBus);
    bodyOsc.start(at);
    bodyOsc.stop(at + 0.075);
  }

  if (step.hat > 0) {
    const baseHatFreq = midiToFrequency(score.root + 19);
    const ratios = step.hat === 2 ? [1, 1.5] : [1];
    logNote(transport, "beat", step.hat === 2 ? GM_DRUMS.openHat : GM_DRUMS.hat, at, 0.08, step.hat === 2 ? 0.068 : 0.036);
    for (const [idx, ratio] of ratios.entries()) {
      const hatOsc = context.createOscillator();
      const hatGain = context.createGain();
      hatOsc.type = idx === 0 ? "triangle" : "sine";
      hatOsc.frequency.setValueAtTime(baseHatFreq * ratio, at);
      const decay = step.hat === 2 ? 0.13 : 0.048;
      const peak = (step.hat === 2 ? 0.068 : 0.036) * (idx === 0 ? 1 : 0.6) * holdLift;
      hatGain.gain.setValueAtTime(0.0001, at);
      hatGain.gain.exponentialRampToValueAtTime(peak, at + 0.004);
      hatGain.gain.exponentialRampToValueAtTime(0.0001, at + decay);
      hatOsc.connect(hatGain).connect(transport.beatBus);
      hatOsc.start(at);
      hatOsc.stop(at + decay + 0.02);
    }
  }
}

export function scheduleBassStep(context, transport, score, stepIndex, at, stepDuration, {
  currentBass = null,
  engaged = true,
  logNote = () => {},
} = {}) {
  if (!engaged || !currentBass || !transport.bassBus) return;
  const step = currentBass.steps[stepIndex % currentBass.steps.length];
  if (!step || step.gate === 0) return;

  const nextStep = currentBass.steps[(stepIndex + 1) % currentBass.steps.length];
  const octaveShift = interaction.pitchBend > 0.45 ? 12 : (interaction.pitchBend < -0.45 ? -12 : 0);
  const baseMidi = foldIntoRange(score.root - (step.register > 0 ? 12 : 24) + step.interval + octaveShift, 28);
  const nextMidi = foldIntoRange(score.root - ((nextStep?.register || 0) > 0 ? 12 : 24) + (nextStep?.interval || 0) + octaveShift, 28);
  const freq = midiToFrequency(baseMidi);
  const glideFreq = midiToFrequency(nextMidi);

  const duration = Math.max(0.08, stepDuration * (step.gate === 2 ? 0.88 : 0.46));
  logNote(transport, "bass", baseMidi, at, duration, step.gate === 2 ? 1 : 0.7);
  const holdBoost = 1 + interaction.hold * 0.16;
  const peak = (step.accent ? 0.21 : 0.145) * holdBoost;

  const subOsc = context.createOscillator();
  const upperOsc = context.createOscillator();
  const upperGain = context.createGain();
  const bassFilter = context.createBiquadFilter();
  const amp = context.createGain();

  subOsc.type = "sine";
  upperOsc.type = "triangle";
  subOsc.frequency.setValueAtTime(freq, at);
  upperOsc.frequency.setValueAtTime(freq * 2, at);

  if (step.slide && nextStep && nextStep.gate > 0) {
    const glideStart = at + duration * 0.45;
    subOsc.frequency.setValueAtTime(freq, glideStart);
    subOsc.frequency.exponentialRampToValueAtTime(glideFreq, at + duration);
    upperOsc.frequency.setValueAtTime(freq * 2, glideStart);
    upperOsc.frequency.exponentialRampToValueAtTime(glideFreq * 2, at + duration);
  }

  upperGain.gain.value = step.accent ? 0.34 : 0.22;
  bassFilter.type = "lowpass";
  const cutoffMod = 1 + interaction.pitchBend * 0.35 + interaction.hold * 0.15;
  const startCutoff = Math.min(1850, freq * (step.accent ? 5.2 : 3.4) * Math.max(0.5, cutoffMod) + (score.bassGlide || 55) * 3);
  const endCutoff = Math.max(85, freq * 1.5);
  bassFilter.frequency.setValueAtTime(startCutoff, at);
  bassFilter.frequency.exponentialRampToValueAtTime(endCutoff, at + duration);
  bassFilter.Q.value = step.accent ? 2.8 : 1.6;

  amp.gain.setValueAtTime(0.0001, at);
  amp.gain.exponentialRampToValueAtTime(peak, at + 0.012);
  amp.gain.exponentialRampToValueAtTime(0.0001, at + duration + 0.025);

  subOsc.connect(bassFilter);
  upperOsc.connect(upperGain).connect(bassFilter);
  bassFilter.connect(amp).connect(transport.bassBus);

  subOsc.start(at);
  upperOsc.start(at);
  subOsc.stop(at + duration + 0.04);
  upperOsc.stop(at + duration + 0.04);
}

export function scheduleHarmonyStep(context, transport, score, stepIndex, at, stepDuration, {
  currentHarmony = null,
  engaged = true,
  logNote = () => {},
} = {}) {
  if (!engaged || !currentHarmony || !transport.harmonyBus) return;
  const step = currentHarmony.steps[stepIndex % currentHarmony.steps.length];
  if (!step || step.gate === 0) return;

  const isSustained = step.gate === 2;
  const isRegionBoundary = stepIndex % 3 === 2;
  const duration = isRegionBoundary
    ? Math.min(stepDuration * 0.90, Math.max(0.08, stepDuration * 0.86))
    : Math.max(0.12, stepDuration * (isSustained ? 1.18 : 0.78));
  const strumSec = (step.strumMs || 24) / 1000;
  const holdBoost = 1 + interaction.hold * 0.14;
  const waveforms = [
    ["triangle", "sine", "triangle"],
    ["sine", "triangle", "sine"],
    ["triangle", "sine", "sine"],
    ["sine", "sine", "triangle"],
  ][score.harmonyMode % 4];

  const harmonyShift = interaction.pitchBend > 0.35 ? 7 : (interaction.pitchBend < -0.35 ? -5 : 0);
  for (const [voiceIndex, interval] of step.chord.entries()) {
    const noteStart = at + voiceIndex * strumSec;
    const voiceDuration = isRegionBoundary ? Math.max(0.06, (at + duration) - noteStart) : duration;
    const midi = foldIntoRange(score.root + interval + harmonyShift, 36, 84);
    const freq = midiToFrequency(midi);
    logNote(transport, "harmony", midi, noteStart, voiceDuration, isSustained ? 1 : 0.75);
    const osc = context.createOscillator();
    const voiceGain = context.createGain();

    osc.type = waveforms[voiceIndex % waveforms.length];
    osc.frequency.setValueAtTime(freq, noteStart);
    osc.detune.setValueAtTime((voiceIndex - 1) * 1.8 * (step.mirror === "/" ? 1 : -1), noteStart);

    const peak = (isSustained ? 0.056 : 0.044) * (1 - voiceIndex * 0.14) * holdBoost;
    const attack = isSustained ? 0.045 : 0.018;
    voiceGain.gain.setValueAtTime(0.0001, noteStart);
    voiceGain.gain.exponentialRampToValueAtTime(peak, noteStart + attack);
    voiceGain.gain.exponentialRampToValueAtTime(0.0001, noteStart + voiceDuration);

    osc.connect(voiceGain).connect(transport.harmonyBus);
    osc.start(noteStart);
    osc.stop(noteStart + voiceDuration + 0.04);
  }
}

export function scheduleChimeStep(context, transport, score, stepIndex, at, stepDuration, {
  currentChimes = null,
  engaged = true,
  logNote = () => {},
} = {}) {
  if (!engaged || !currentChimes || !transport.chimeBus) return;
  const step = currentChimes.steps[stepIndex % currentChimes.steps.length];
  if (!step || step.gate === 0) return;

  const isAccented = step.gate === 2;
  const isRegionBoundary = stepIndex % 3 === 2;
  const chimeOctave = interaction.pitchBend > 0.4 ? 12 : (interaction.pitchBend < -0.4 ? -12 : 0);
  const rootMidi = Math.min(84, score.root + 12 + chimeOctave);
  const rootFreq = midiToFrequency(rootMidi);
  const bellFreq = rootFreq * step.ratioValue;
  const bellDuration = isRegionBoundary
    ? Math.min(stepDuration * 0.92, 0.42)
    : Math.max(0.14, stepDuration * (isAccented ? 1.35 : 0.92));
  // Just-intonation ratios round to the nearest equal-tempered MIDI note.
  logNote(transport, "chime", rootMidi + 12 * Math.log2(step.ratioValue), at, bellDuration, isAccented ? 1 : 0.7);
  const holdBoost = 1 + interaction.hold * 0.16;

  // 1. FRACTRAN Just Intonation overtone chime bell locked to active Tonnetz chord
  const bellOsc = context.createOscillator();
  const bellGain = context.createGain();
  bellOsc.type = "sine";
  bellOsc.frequency.setValueAtTime(bellFreq, at);
  const bellPeak = (isAccented ? 0.054 : 0.036) * holdBoost;
  bellGain.gain.setValueAtTime(0.0001, at);
  bellGain.gain.exponentialRampToValueAtTime(bellPeak, at + 0.008);
  bellGain.gain.exponentialRampToValueAtTime(0.0001, at + bellDuration);
  bellOsc.connect(bellGain).connect(transport.chimeBus);
  bellOsc.start(at);
  bellOsc.stop(at + bellDuration + 0.04);

  if (isAccented) {
    const overtoneOsc = context.createOscillator();
    const overtoneGain = context.createGain();
    const overtoneMult = step.exponents.e3 % 2 === 0 ? 2 : 1.5;
    overtoneOsc.type = "sine";
    overtoneOsc.frequency.setValueAtTime(Math.min(3600, bellFreq * overtoneMult), at);
    overtoneGain.gain.setValueAtTime(0.0001, at);
    overtoneGain.gain.exponentialRampToValueAtTime(bellPeak * 0.3, at + 0.006);
    overtoneGain.gain.exponentialRampToValueAtTime(0.0001, at + bellDuration * 0.65);
    overtoneOsc.connect(overtoneGain).connect(transport.chimeBus);
    overtoneOsc.start(at);
    overtoneOsc.stop(at + bellDuration * 0.65 + 0.03);
  }

  // 2. Piet Codel Synesthetic Spectral Pad
  const registerMult = [1.0, 0.5, 0.5][step.lightnessIndex % 3];
  const padFreq = bellFreq * registerMult;
  const detuneCents = (step.hueIndex + 1) * 1.4;
  const padDuration = Math.max(0.28, stepDuration * (isAccented ? 1.45 : 0.95));
  const padFilter = context.createBiquadFilter();
  padFilter.type = "lowpass";
  padFilter.frequency.setValueAtTime(
    580 + step.hueIndex * 180 + (2 - step.lightnessIndex) * 260,
    at,
  );
  padFilter.Q.setValueAtTime(1.4, at);

  const padGain = context.createGain();
  const padPeak = (isAccented ? 0.036 : 0.025) * holdBoost;
  padGain.gain.setValueAtTime(0.0001, at);
  padGain.gain.exponentialRampToValueAtTime(padPeak, at + 0.06);
  padGain.gain.exponentialRampToValueAtTime(0.0001, at + padDuration);

  for (const sign of [-1, 1]) {
    const padOsc = context.createOscillator();
    padOsc.type = "sine";
    padOsc.frequency.setValueAtTime(padFreq, at);
    padOsc.detune.setValueAtTime(sign * detuneCents, at);
    padOsc.connect(padFilter);
    padOsc.start(at);
    padOsc.stop(at + padDuration + 0.04);
  }
  padFilter.connect(padGain).connect(transport.chimeBus);
}

export function scheduleChantStep(context, transport, score, stepIndex, at, stepDuration, {
  currentChant = null,
  engaged = true,
  logNote = () => {},
} = {}) {
  if (!engaged || !currentChant || !transport.chantBus) return;
  const step = currentChant.steps[stepIndex % currentChant.steps.length];
  if (!step || step.gate === 0) return;

  const isSoliloquy = step.gate === 2;
  const duration = Math.max(0.24, stepDuration * (isSoliloquy ? 1.65 : 1.15));
  const chantShift = interaction.pitchBend > 0.35 ? 7 : (interaction.pitchBend < -0.35 ? -5 : 0);
  const midi = foldIntoRange(score.root + step.registerOffset + step.interval + chantShift, 40, 82);
  const baseFreq = midiToFrequency(midi);
  logNote(transport, "chant", midi, at, duration, isSoliloquy ? 1 : 0.75);
  const holdBoost = 1 + interaction.hold * 0.14;

  // Glottal source with gentle triangle-dominant blend and smooth vibrato
  const glottalMix = context.createGain();
  glottalMix.gain.setValueAtTime(1, at);

  const oscA = context.createOscillator();
  const oscB = context.createOscillator();
  const oscBGain = context.createGain();
  oscA.type = "triangle";
  oscB.type = "sawtooth";
  oscBGain.gain.setValueAtTime(0.38, at);
  oscA.frequency.setValueAtTime(baseFreq, at);
  oscB.frequency.setValueAtTime(baseFreq * 1.0015, at);

  const lfo = context.createOscillator();
  const lfoGain = context.createGain();
  lfo.type = "sine";
  lfo.frequency.setValueAtTime(step.vibratoHz || 5.1, at);
  lfoGain.gain.setValueAtTime(isSoliloquy ? 2.4 : 1.6, at);
  lfo.connect(lfoGain);
  lfoGain.connect(oscA.frequency);
  lfoGain.connect(oscB.frequency);

  oscA.connect(glottalMix);
  oscB.connect(oscBGain).connect(glottalMix);

  // Parallel 3-formant vocal tract bandpass bank (F1, F2, F3)
  const voiceAmp = context.createGain();
  const peak = (isSoliloquy ? 0.068 : 0.048) * holdBoost;
  voiceAmp.gain.setValueAtTime(0.0001, at);
  voiceAmp.gain.exponentialRampToValueAtTime(peak, at + 0.055);
  voiceAmp.gain.exponentialRampToValueAtTime(0.0001, at + duration);

  const formantShift = 1 + interaction.pitchBend * 0.22 + interaction.hold * 0.08;
  const formants = [
    { freq: step.f1 * formantShift, q: 4.5 + (step.formantResonance || 55) * 0.025, weight: 1.0 },
    { freq: step.f2 * formantShift, q: 5.8 + (step.formantResonance || 55) * 0.03, weight: 0.62 },
    { freq: step.f3 * formantShift, q: 7.0 + (step.formantResonance || 55) * 0.035, weight: 0.28 },
  ];

  for (const f of formants) {
    const bp = context.createBiquadFilter();
    const fGain = context.createGain();
    bp.type = "bandpass";
    bp.frequency.setValueAtTime(f.freq, at);
    bp.Q.setValueAtTime(f.q, at);
    fGain.gain.setValueAtTime(f.weight, at);
    glottalMix.connect(bp).connect(fGain).connect(voiceAmp);
  }

  voiceAmp.connect(transport.chantBus);
  oscA.start(at);
  oscB.start(at);
  lfo.start(at);
  oscA.stop(at + duration + 0.04);
  oscB.stop(at + duration + 0.04);
  lfo.stop(at + duration + 0.04);
}

// The mycelium's spikes, drops, and spore puffs, from its sporophore form's
// own sound (src/mycelium.mjs, D-042).
export function scheduleFungalBioStep(context, transport, score, stepIndex, at, stepDuration, {
  logNote = () => {},
} = {}) {
  if (!transport.fungalBus) return;
  const bus = transport.fungalBus;
  for (const event of myceliumEvents(score, stepIndex, interaction.hold)) {
    const start = at + event.at * stepDuration;
    const end = start + event.decay;
    const gain = context.createGain();
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(event.peak, start + Math.min(0.006, event.decay / 3));
    gain.gain.exponentialRampToValueAtTime(0.0001, end);
    const panner = context.createStereoPanner ? context.createStereoPanner() : null;
    panner?.pan.setValueAtTime(event.pan, start);
    (panner ? gain.connect(panner) : gain).connect(bus);

    let source;
    if (event.kind === "noise") {
      source = context.createBufferSource();
      source.buffer = ensureNoiseBuffer(context);
    } else {
      source = context.createOscillator();
      source.type = event.wave;
      source.frequency.setValueAtTime(event.freq, start);
      if (event.to !== event.freq) source.frequency.exponentialRampToValueAtTime(event.to, end);
      if (event.freq > 20) {
        const fungalMidi = Math.round(12 * Math.log2(event.freq / 440) + 69);
        logNote(transport, "fungal", fungalMidi, start, event.decay, event.peak);
      }
    }
    if (event.band) {
      const band = context.createBiquadFilter();
      band.type = "bandpass";
      band.frequency.setValueAtTime(event.band[0], start);
      band.Q.setValueAtTime(event.band[1], start);
      source.connect(band).connect(gain);
    } else {
      source.connect(gain);
    }
    source.start(start);
    source.stop(end + 0.01);
  }
}
