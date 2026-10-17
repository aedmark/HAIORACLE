import { composeScore, WAVEFORMS } from "./score.mjs";

const SCALE = Object.freeze([0, 2, 3, 5, 7, 9, 10]);
const SURPRISES = Object.freeze([
  "the moon owes me five dollars",
  "a cucumber with excellent boundaries",
  "Tuesday smells faintly purple",
  "my shadow has joined a union",
  "please hold for the infinite goose",
  "the wallpaper knows jazz",
  "a very small thunderstorm",
  "soup for the final astronaut",
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
let currentMix = null;
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

class OracleVision {
  constructor(canvas) {
    this.canvas = canvas;
    this.context = canvas.getContext("2d", { alpha: false });
    this.score = {
      seed: 132071, pulse: 72, hue: 274, symmetry: 7, twist: 4, bloom: 66, eyes: 3,
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
    this.particles = Array.from({ length: 84 }, () => ({
      x: random(),
      y: random(),
      radius: 0.3 + random() * 1.8,
      phase: random() * Math.PI * 2,
      drift: 0.2 + random() * 0.8,
    }));
  }

  draw(timestamp) {
    const ctx = this.context;
    const score = this.score;
    const width = this.width;
    const height = this.height;
    const elapsed = this.reducedMotion ? 1.25 : (timestamp - this.startedAt) / 1000;
    const beat = elapsed * score.pulse / 60;
    const pulse = 0.78 + Math.max(0, Math.sin(beat * Math.PI * 2)) ** 8 * 0.22;

    const backdrop = ctx.createRadialGradient(width * 0.56, height * 0.43, 0, width * 0.56, height * 0.43, Math.max(width, height) * 0.75);
    backdrop.addColorStop(0, `hsl(${score.hue} 48% 15%)`);
    backdrop.addColorStop(0.48, `hsl(${(score.hue + 48) % 360} 40% 8%)`);
    backdrop.addColorStop(1, "#07050d");
    ctx.fillStyle = backdrop;
    ctx.fillRect(0, 0, width, height);

    ctx.save();
    for (const particle of this.particles) {
      const drift = this.reducedMotion ? 0 : Math.sin(elapsed * particle.drift + particle.phase) * 8;
      ctx.globalAlpha = 0.24 + Math.sin(elapsed + particle.phase) * 0.14;
      ctx.fillStyle = `hsl(${(score.hue + particle.phase * 12) % 360} 90% 78%)`;
      ctx.beginPath();
      ctx.arc(particle.x * width + drift, particle.y * height, particle.radius, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();

    const centerX = width * (width < 760 ? 0.66 : 0.72);
    const centerY = height * (width < 760 ? 0.66 : 0.5);
    const base = Math.min(width, height) * (width < 760 ? 0.25 : 0.31) * pulse;
    const points = Math.max(72, score.symmetry * 20);

    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(this.reducedMotion ? 0.16 : elapsed * 0.028 * (score.twist % 2 ? 1 : -1));
    ctx.shadowColor = `hsla(${score.hue} 100% 70% / 0.55)`;
    ctx.shadowBlur = score.bloom * 0.5;

    const aura = ctx.createRadialGradient(0, 0, base * 0.05, 0, 0, base * 1.2);
    aura.addColorStop(0, `hsla(${(score.hue + 170) % 360} 100% 88% / 0.95)`);
    aura.addColorStop(0.28, `hsla(${score.hue} 92% 62% / 0.82)`);
    aura.addColorStop(0.72, `hsla(${(score.hue + 65) % 360} 88% 48% / 0.35)`);
    aura.addColorStop(1, `hsla(${score.hue} 90% 50% / 0)`);
    ctx.fillStyle = aura;
    ctx.beginPath();
    for (let i = 0; i <= points; i += 1) {
      const angle = i / points * Math.PI * 2;
      const folded = Math.cos(angle * score.symmetry);
      const ripple = Math.sin(angle * score.twist + elapsed * 0.9) * 0.08;
      const radius = base * (0.72 + folded * 0.19 + ripple);
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fill();

    ctx.globalCompositeOperation = "screen";
    ctx.lineWidth = 1;
    ctx.strokeStyle = `hsla(${(score.hue + 125) % 360} 100% 82% / 0.55)`;
    for (let ring = 0; ring < 3; ring += 1) {
      ctx.beginPath();
      for (let i = 0; i <= points; i += 1) {
        const angle = i / points * Math.PI * 2;
        const radius = base * (0.34 + ring * 0.18 + Math.sin(angle * score.symmetry - elapsed * (0.6 + ring * 0.1)) * 0.07);
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.stroke();
    }

    ctx.globalCompositeOperation = "source-over";
    const eyeOrbit = base * 0.28;
    for (let eye = 0; eye < score.eyes; eye += 1) {
      const angle = (eye / score.eyes) * Math.PI * 2 + elapsed * 0.07;
      const x = Math.cos(angle) * eyeOrbit;
      const y = Math.sin(angle) * eyeOrbit;
      const size = Math.max(5, base * 0.037);
      ctx.fillStyle = "#f7f1dc";
      ctx.beginPath();
      ctx.ellipse(x, y, size * 1.55, size, angle, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#090711";
      ctx.beginPath();
      ctx.arc(x + Math.sin(elapsed + eye) * size * 0.24, y, size * 0.42, 0, Math.PI * 2);
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
  if (!currentMix || !audioContext) return;
  const now = audioContext.currentTime;
  currentMix.gain.cancelScheduledValues(now);
  currentMix.gain.setTargetAtTime(0, now, 0.035);
  currentMix = null;
}

async function playScore(score) {
  stopCurrentSound();
  vision.setScore(score);
  if (muted) return;

  const context = await ensureAudioContext();
  const now = context.currentTime + 0.035;
  const duration = 10;
  const stepLength = 60 / score.pulse / 2;
  const mix = context.createGain();
  const filter = context.createBiquadFilter();
  const delay = context.createDelay(1);
  const feedback = context.createGain();
  currentMix = mix;

  mix.gain.setValueAtTime(0.0001, now);
  mix.gain.exponentialRampToValueAtTime(0.23, now + 0.14);
  mix.gain.setValueAtTime(0.23, now + duration - 0.8);
  mix.gain.exponentialRampToValueAtTime(0.0001, now + duration);
  filter.type = "lowpass";
  filter.frequency.setValueAtTime(900 + score.bloom * 18, now);
  filter.Q.value = 4 + score.twist * 0.55;
  delay.delayTime.value = stepLength * 0.75;
  feedback.gain.value = 0.22;

  mix.connect(filter);
  filter.connect(context.destination);
  filter.connect(delay);
  delay.connect(feedback);
  feedback.connect(delay);
  delay.connect(context.destination);

  const drone = context.createOscillator();
  const droneGain = context.createGain();
  drone.type = score.waveform === "square" ? "triangle" : score.waveform;
  drone.frequency.value = midiToFrequency(score.root - 12);
  drone.detune.value = -6;
  droneGain.gain.value = 0.18;
  drone.connect(droneGain).connect(mix);
  drone.start(now);
  drone.stop(now + duration + 0.05);

  for (let step = 0, at = now; at < now + duration - 0.2; step += 1, at += stepLength) {
    const oscillator = context.createOscillator();
    const envelope = context.createGain();
    const scaleStep = score.steps[step % score.steps.length];
    const octave = step % 8 === 7 ? 12 : 0;
    oscillator.type = score.waveform;
    oscillator.frequency.value = midiToFrequency(score.root + SCALE[scaleStep] + octave);
    oscillator.detune.value = (step % 3 - 1) * score.twist;
    envelope.gain.setValueAtTime(0.0001, at);
    envelope.gain.exponentialRampToValueAtTime(0.36, at + 0.018);
    envelope.gain.exponentialRampToValueAtTime(0.0001, at + stepLength * 0.8);
    oscillator.connect(envelope).connect(mix);
    oscillator.start(at);
    oscillator.stop(at + stepLength);
  }

  window.setTimeout(() => {
    if (currentMix === mix) {
      currentMix = null;
      elements.status.textContent = "OMEN COMPLETE";
    }
  }, duration * 1000);
}

function showScore(score) {
  currentScore = score;
  elements.name.textContent = score.name;
  elements.pulse.textContent = String(score.pulse);
  elements.wave.textContent = WAVEFORMS[score.wave];
  elements.formValue.textContent = String(score.symmetry);
  elements.replay.disabled = false;
  elements.status.textContent = "OMEN IN PROGRESS";
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
  if (currentScore) {
    elements.status.textContent = "OMEN IN PROGRESS";
    playScore(currentScore);
  }
});

elements.sound.addEventListener("click", () => {
  muted = !muted;
  elements.sound.setAttribute("aria-pressed", String(muted));
  elements.sound.setAttribute("aria-label", muted ? "Enable sound" : "Mute sound");
  if (muted) stopCurrentSound();
  else if (currentScore) playScore(currentScore);
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
