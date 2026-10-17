import { composeScore, WAVEFORMS } from "./score.mjs";

const SCALES = Object.freeze([
  [0, 2, 3, 5, 7, 9, 10, 12, 14],
  [0, 2, 4, 7, 9, 12, 14, 16, 19],
  [0, 1, 4, 5, 7, 8, 11, 12, 13],
  [0, 3, 5, 6, 7, 10, 12, 15, 17],
  [0, 2, 4, 6, 8, 10, 12, 14, 16],
  [0, 1, 3, 5, 7, 8, 10, 12, 13],
  [0, 2, 3, 6, 7, 9, 10, 12, 14],
  [0, 4, 7, 11, 14, 16, 19, 23, 24],
]);

const RHYTHMS = Object.freeze([
  [1, 1, 1, 1],
  [1.5, 0.5, 1, 1],
  [0.5, 0.5, 1, 0.5, 1.5],
  [1, 0.5, 0.5, 1.5, 0.5],
  [2, 0.5, 0.5, 1],
  [0.75, 0.75, 0.5, 1, 0.5, 0.5],
]);

const SURPRISES = Object.freeze([
  "the moon owes me five dollars",
  "a cucumber with excellent boundaries",
  "Tuesday smells faintly purple",
  "my shadow has joined a union",
  "please hold for the infinite goose",
  "the wallpaper knows jazz",
  "a very small thunderstorm",
  "soup for the final astronaut",
  "the celestial laundromat is closing",
  "three pigeons in a borrowed coat",
  "gravity has submitted its resignation",
  "an accordion at the edge of time",
]);

const elements = {
  canvas: document.querySelector("#vision"),
  form: document.querySelector("#oracle-controls"),
  phrase: document.querySelector("#phrase"),
  surprise: document.querySelector("#surprise"),
  replay: document.querySelector("#replay"),
  sound: document.querySelector("#sound-toggle"),
  name: document.querySelector("#creature-name"),
  pulse: document.querySelector("#score-pulse"),
  wave: document.querySelector("#score-wave"),
  formValue: document.querySelector("#score-form"),
  status: document.querySelector("#status"),
};

let oracleSource = "";
let currentScore = null;
let audioContext = null;
let currentTransport = null;
let muted = false;

function mulberry32(seed) {
  let state = seed >>> 0;
  return () => {
    state += 0x6d2b79f5;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

function midiToFrequency(note) {
  return 440 * (2 ** ((note - 69) / 12));
}

function wrapHue(hue) {
  return ((hue % 360) + 360) % 360;
}

function paletteFor(score) {
  const shifts = [
    [0, score.hueShift, 180],
    [0, -score.hueShift, score.hueShift],
    [0, 28, 64],
    [0, 120, 240],
    [0, 180, 180 + score.hueShift / 3],
    [0, 150, 210],
    [0, score.hueShift / 2, score.hueShift],
    [0, 90, 180],
  ][score.palette];
  return shifts.map((shift) => wrapHue(score.hue + shift));
}

function shapeRadius(score, angle, elapsed) {
  const folded = Math.cos(angle * score.symmetry);
  const moving = Math.sin(angle * score.twist + elapsed * (0.35 + score.motion * 0.08));
  const edge = score.edge / 100;

  switch (score.shape) {
    case 0: return 0.72 + folded * (0.12 + edge * 0.16) + moving * 0.05;
    case 1: return 0.58 + (Math.abs(folded) ** (3 + edge * 8)) * 0.38 + moving * 0.025;
    case 2: return 0.68 + folded * 0.08 + moving * (0.1 + edge * 0.08);
    case 3: return 0.58 + (Math.floor((angle / Math.PI) * score.symmetry * 2) % 2) * (0.2 + edge * 0.16);
    case 4: return 0.64 + Math.abs(folded) * (0.16 + edge * 0.18);
    case 5: return 0.7 + Math.sin(angle * 2 + elapsed * 0.35) * 0.12 + Math.cos(angle * 3 - 1.7) * 0.08 + folded * 0.04;
    case 6: return 0.63 + Math.sin(angle + elapsed * 0.22) * 0.18 + Math.cos(angle * score.symmetry) * 0.07;
    case 7: return 0.74 + Math.sin(angle * score.twist - elapsed * 0.28) * 0.055 + folded * 0.045;
    case 8: return 0.52 + Math.max(0, folded) * (0.28 + edge * 0.17) + moving * 0.035;
    case 9: return 0.67 + Math.cos(angle * 2) * 0.15 + Math.max(0, Math.sin(angle)) * 0.12 + folded * 0.055;
    default: return 0.72;
  }
}

class OracleVision {
  constructor(canvas) {
    this.canvas = canvas;
    this.context = canvas.getContext("2d", { alpha: false });
    this.score = {
      seed: 132071, pulse: 72, hue: 274, hueShift: 126, saturation: 88, palette: 2,
      symmetry: 7, twist: 4, bloom: 66, eyes: 3, shape: 0, size: 66, edge: 50, motion: 2,
    };
    this.startedAt = performance.now();
    this.particles = [];
    this.reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
    this.resize = this.resize.bind(this);
    this.draw = this.draw.bind(this);
    window.addEventListener("resize", this.resize, { passive: true });
    this.resize();
    this.setScore(this.score);
    requestAnimationFrame(this.draw);
  }

  resize() {
    const ratio = Math.min(devicePixelRatio || 1, 2);
    const rect = this.canvas.getBoundingClientRect();
    this.width = rect.width;
    this.height = rect.height;
    this.canvas.width = Math.round(rect.width * ratio);
    this.canvas.height = Math.round(rect.height * ratio);
    this.context.setTransform(ratio, 0, 0, ratio, 0, 0);
  }

  setScore(score) {
    this.score = score;
    this.startedAt = performance.now();
    const random = mulberry32(score.seed);
    const particleCount = 45 + score.size;
    this.particles = Array.from({ length: particleCount }, () => ({
      x: random(),
      y: random(),
      radius: 0.25 + random() * (0.8 + score.bloom / 38),
      phase: random() * Math.PI * 2,
      drift: 0.15 + random() * 1.15,
    }));
  }

  draw(timestamp) {
    const ctx = this.context;
    const score = this.score;
    const width = this.width;
    const height = this.height;
    const elapsed = this.reducedMotion ? 1.25 : (timestamp - this.startedAt) / 1000;
    const beat = elapsed * score.pulse / 60;
    const pulse = 0.84 + Math.max(0, Math.sin(beat * Math.PI * 2)) ** 8 * 0.16;
    const colors = paletteFor(score);

    const backdrop = ctx.createRadialGradient(width * 0.58, height * 0.44, 0, width * 0.58, height * 0.44, Math.max(width, height) * 0.78);
    backdrop.addColorStop(0, `hsl(${colors[0]} ${Math.max(30, score.saturation - 24)}% 16%)`);
    backdrop.addColorStop(0.48, `hsl(${colors[1]} ${Math.max(25, score.saturation - 35)}% 8%)`);
    backdrop.addColorStop(1, `hsl(${colors[2]} 32% 3%)`);
    ctx.fillStyle = backdrop;
    ctx.fillRect(0, 0, width, height);

    ctx.save();
    for (const particle of this.particles) {
      const driftX = this.reducedMotion ? 0 : Math.sin(elapsed * particle.drift + particle.phase) * (4 + score.motion * 1.8);
      const driftY = this.reducedMotion ? 0 : Math.cos(elapsed * 0.3 + particle.phase) * score.motion;
      ctx.globalAlpha = 0.15 + Math.sin(elapsed + particle.phase) * 0.1;
      ctx.fillStyle = `hsl(${colors[Math.floor(particle.phase) % colors.length]} ${score.saturation}% 78%)`;
      ctx.beginPath();
      ctx.arc(particle.x * width + driftX, particle.y * height + driftY, particle.radius, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();

    const orbitDistance = this.reducedMotion ? 0 : score.motion * Math.min(width, height) * 0.004;
    const centerX = width * (width < 760 ? 0.66 : 0.72) + Math.cos(elapsed * 0.21) * orbitDistance;
    const centerY = height * (width < 760 ? 0.66 : 0.5) + Math.sin(elapsed * 0.27) * orbitDistance;
    const sizeFactor = 0.15 + score.size / 100 * (width < 760 ? 0.14 : 0.22);
    const base = Math.min(width, height) * sizeFactor * pulse;
    const points = Math.max(120, score.symmetry * 28);
    const aspectX = [1, 1, 1.08, 1, 0.9, 1.16, 1.25, 1, 0.92, 0.88][score.shape];
    const aspectY = [1, 1, 0.92, 1, 1.12, 0.88, 0.72, 1, 1.08, 1.25][score.shape];

    ctx.save();
    ctx.translate(centerX, centerY);
    const direction = score.motion % 2 ? 1 : -1;
    ctx.rotate(this.reducedMotion ? 0.16 : elapsed * (0.012 + score.motion * 0.006) * direction);
    ctx.scale(aspectX, aspectY);
    ctx.shadowColor = `hsla(${colors[1]} 100% 70% / 0.58)`;
    ctx.shadowBlur = score.bloom * 0.62;

    const aura = ctx.createRadialGradient(0, 0, base * 0.04, 0, 0, base * 1.25);
    aura.addColorStop(0, `hsla(${colors[2]} ${score.saturation}% 90% / 0.96)`);
    aura.addColorStop(0.24, `hsla(${colors[0]} ${score.saturation}% 62% / 0.86)`);
    aura.addColorStop(0.68, `hsla(${colors[1]} ${score.saturation}% 48% / 0.38)`);
    aura.addColorStop(1, `hsla(${colors[2]} ${score.saturation}% 48% / 0)`);
    ctx.fillStyle = aura;
    ctx.beginPath();
    for (let i = 0; i <= points; i += 1) {
      const angle = i / points * Math.PI * 2;
      const radius = base * shapeRadius(score, angle, elapsed);
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fill();

    ctx.globalCompositeOperation = "screen";
    ctx.lineWidth = 0.7 + score.edge / 70;
    ctx.strokeStyle = `hsla(${colors[2]} 100% 84% / 0.58)`;
    const ringCount = 2 + score.palette % 4;
    for (let ring = 0; ring < ringCount; ring += 1) {
      ctx.beginPath();
      for (let i = 0; i <= points; i += 1) {
        const angle = i / points * Math.PI * 2;
        const motion = Math.sin(angle * (score.symmetry + ring) - elapsed * (0.3 + ring * 0.08)) * (0.035 + score.edge / 1800);
        const radius = base * (0.25 + ring * (0.52 / ringCount) + motion);
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.stroke();
    }

    ctx.globalCompositeOperation = "source-over";
    const eyeOrbit = base * (0.16 + Math.min(score.eyes, 8) * 0.014);
    for (let eye = 0; eye < score.eyes; eye += 1) {
      const angle = (eye / Math.max(1, score.eyes)) * Math.PI * 2 + elapsed * 0.055 * direction;
      const layer = 0.72 + (eye % 3) * 0.16;
      const x = Math.cos(angle) * eyeOrbit * layer;
      const y = Math.sin(angle) * eyeOrbit * layer;
      const eyeSize = Math.max(3.5, base * (0.027 + (eye % 2) * 0.006));
      ctx.fillStyle = "#f7f1dc";
      ctx.beginPath();
      ctx.ellipse(x, y, eyeSize * 1.55, eyeSize, angle, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = `hsl(${colors[0]} 65% 8%)`;
      ctx.beginPath();
      ctx.arc(x + Math.sin(elapsed + eye) * eyeSize * 0.24, y, eyeSize * 0.42, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();

    requestAnimationFrame(this.draw);
  }
}

const vision = new OracleVision(elements.canvas);

async function ensureAudioContext() {
  if (!audioContext) audioContext = new AudioContext();
  if (audioContext.state === "suspended") await audioContext.resume();
  return audioContext;
}

function stopCurrentSound() {
  if (!currentTransport || !audioContext) return;
  const transport = currentTransport;
  currentTransport = null;
  window.clearInterval(transport.timer);
  const now = audioContext.currentTime;
  transport.mix.gain.cancelScheduledValues(now);
  transport.mix.gain.setTargetAtTime(0.0001, now, 0.035);
  for (const drone of transport.drones) {
    try {
      drone.stop(now + 0.18);
    } catch {
      // A previously stopped oscillator is harmless during rapid resummoning.
    }
  }
  window.setTimeout(() => transport.output.disconnect(), 350);
}

function voiceStack(score, step) {
  const stacks = [
    [{ interval: 0, detune: 0, gain: 1 }],
    [{ interval: 0, detune: -5, gain: 0.72 }, { interval: 0, detune: 7, gain: 0.48 }],
    [{ interval: 0, detune: 0, gain: 0.78 }, { interval: 7, detune: -3, gain: 0.34 }],
    [{ interval: 0, detune: 0, gain: 0.76 }, { interval: -12, detune: 4, gain: 0.3 }],
    [{ interval: 0, detune: -9, gain: 0.6 }, { interval: 12, detune: 9, gain: 0.28 }],
    [{ interval: 0, detune: 0, gain: 0.64 }, { interval: 7, detune: 2, gain: 0.26 }, { interval: 12, detune: -2, gain: 0.2 }],
  ];
  const selected = stacks[score.voice];
  return step % 6 === 5 && score.voice < 4
    ? [...selected, { interval: 12, detune: 0, gain: 0.2 }]
    : selected;
}

function scheduleNote(context, transport, score, step, at, duration) {
  const scale = SCALES[score.scale];
  const scaleStep = score.steps[step % score.steps.length];
  const phraseLift = step % score.steps.length >= 8 ? 12 : 0;
  const note = score.root + scale[scaleStep] + phraseLift;
  const envelope = context.createGain();
  const attack = Math.min(0.045, duration * 0.18);
  envelope.gain.setValueAtTime(0.0001, at);
  envelope.gain.exponentialRampToValueAtTime(0.3, at + attack);
  envelope.gain.exponentialRampToValueAtTime(0.0001, at + duration);
  envelope.connect(transport.mix);

  for (const [voiceIndex, voice] of voiceStack(score, step).entries()) {
    const oscillator = context.createOscillator();
    oscillator.type = voiceIndex === 0
      ? score.waveform
      : ["triangle", "sine", "sawtooth", "square"][(score.wave + voiceIndex + score.voice) % 4];
    oscillator.frequency.value = midiToFrequency(note + voice.interval);
    oscillator.detune.value = voice.detune + (step % 3 - 1) * score.twist * 0.55;
    const level = context.createGain();
    level.gain.value = voice.gain;
    oscillator.connect(level).connect(envelope);
    oscillator.start(at);
    oscillator.stop(at + duration + 0.06);
  }
}

async function playScore(score) {
  stopCurrentSound();
  vision.setScore(score);
  if (muted) {
    elements.status.textContent = "OMEN MUTED";
    return;
  }

  const context = await ensureAudioContext();
  const now = context.currentTime + 0.045;
  const unit = 60 / score.pulse / 2;
  const mix = context.createGain();
  const filter = context.createBiquadFilter();
  const compressor = context.createDynamicsCompressor();
  const delay = context.createDelay(1.5);
  const feedback = context.createGain();
  const output = context.createGain();
  const drones = [];
  const transport = { mix, output, drones, timer: 0, nextNoteTime: now, step: 0 };
  currentTransport = transport;

  mix.gain.setValueAtTime(0.0001, now);
  mix.gain.exponentialRampToValueAtTime(0.19, now + 0.16);
  filter.type = ["lowpass", "bandpass", "lowpass", "highpass", "lowpass", "bandpass"][score.voice];
  filter.frequency.value = 620 + score.bloom * 24 + score.hueShift * 2;
  filter.Q.value = 2.5 + score.edge / 16;
  compressor.threshold.value = -18;
  compressor.knee.value = 18;
  compressor.ratio.value = 5;
  delay.delayTime.value = unit * [1, 1.5, 0.75, 2, 1.25, 0.5][score.rhythm];
  feedback.gain.value = 0.14 + score.bloom / 650;
  output.gain.value = 0.72;

  mix.connect(filter);
  filter.connect(compressor).connect(output).connect(context.destination);
  filter.connect(delay);
  delay.connect(feedback).connect(delay);
  delay.connect(output);

  const droneCount = score.voice === 5 ? 2 : 1;
  for (let index = 0; index < droneCount; index += 1) {
    const drone = context.createOscillator();
    const droneGain = context.createGain();
    drone.type = index ? "sine" : (score.waveform === "square" ? "triangle" : score.waveform);
    drone.frequency.value = midiToFrequency(score.root - 12 + index * 7);
    drone.detune.value = index ? 8 : -6;
    droneGain.gain.value = index ? 0.035 : 0.085;
    drone.connect(droneGain).connect(mix);
    drone.start(now);
    drones.push(drone);
  }

  const scheduleAhead = () => {
    if (currentTransport !== transport) return;
    const rhythm = RHYTHMS[score.rhythm];
    while (transport.nextNoteTime < context.currentTime + 0.28) {
      const lengthMultiplier = rhythm[transport.step % rhythm.length];
      const stepDuration = unit * lengthMultiplier;
      const soundingDuration = Math.max(0.06, stepDuration * score.gate / 100);
      scheduleNote(context, transport, score, transport.step, transport.nextNoteTime, soundingDuration);
      transport.nextNoteTime += stepDuration;
      transport.step += 1;
    }
  };

  scheduleAhead();
  transport.timer = window.setInterval(scheduleAhead, 90);
  elements.status.textContent = "OMEN LOOPING";
}

function showScore(score) {
  currentScore = score;
  elements.name.textContent = score.name;
  elements.pulse.textContent = String(score.pulse);
  elements.wave.textContent = WAVEFORMS[score.wave];
  elements.formValue.textContent = score.shapeName;
  elements.replay.disabled = false;
}

async function summon(phrase) {
  if (!oracleSource) {
    elements.status.textContent = "SPELL UNAVAILABLE";
    return;
  }

  try {
    const score = composeScore(oracleSource, phrase);
    showScore(score);
    await playScore(score);
  } catch (error) {
    elements.status.textContent = "THE ORACLE COUGHED";
    console.error(error);
  }
}

elements.form.addEventListener("submit", (event) => {
  event.preventDefault();
  summon(elements.phrase.value);
});

elements.surprise.addEventListener("click", () => {
  const next = SURPRISES[Math.floor(Math.random() * SURPRISES.length)];
  elements.phrase.value = next;
  summon(next);
});

elements.replay.addEventListener("click", () => {
  if (currentScore) playScore(currentScore);
});

elements.sound.addEventListener("click", () => {
  muted = !muted;
  elements.sound.setAttribute("aria-pressed", String(muted));
  elements.sound.setAttribute("aria-label", muted ? "Enable sound" : "Mute sound");
  if (muted) {
    stopCurrentSound();
    elements.status.textContent = currentScore ? "OMEN MUTED" : "AWAITING INPUT";
  } else if (currentScore) {
    playScore(currentScore);
  }
});

try {
  const response = await fetch("src/oracle.lol");
  if (!response.ok) throw new Error(`Oracle source returned ${response.status}`);
  oracleSource = await response.text();
  elements.status.textContent = "AWAITING INPUT";
} catch (error) {
  elements.status.textContent = "SERVE THIS DIRECTORY OVER HTTP";
  console.error(error);
}
