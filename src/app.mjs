import { HARMONY_NAMES, composeHarmony, cycleHarmonyCell } from "./befunge.mjs";
import { BASS_NAMES, composeBass, cycleBassCell } from "./brainfuck.mjs";
import { conductEnsemble } from "./conductor.mjs";
import { CHIME_NAMES, composeChimes, cycleChimeCell } from "./fractran.mjs";
import { BEAT_NAMES, composeBeat, cycleBeatStep } from "./malbolge.mjs";
import { MELODY_NAMES, melodyFor } from "./music.mjs";
import { composeScore, WAVEFORMS } from "./score.mjs";
import { buildShareUrl, decodeOmenHash, encodeOmenHash, specimenFilenameFor } from "./share.mjs";
import { CHANT_NAMES, composeChant, cycleChantCell } from "./shakespeare.mjs";

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
  shareLink: document.querySelector("#share-link"),
  exportPng: document.querySelector("#export-png"),
  sound: document.querySelector("#sound-toggle"),
  volume: document.querySelector("#master-volume"),
  volumeValue: document.querySelector("#volume-value"),
  tempo: document.querySelector("#tempo-bpm"),
  tempoValue: document.querySelector("#tempo-value"),
  name: document.querySelector("#creature-name"),
  pulse: document.querySelector("#score-pulse"),
  wave: document.querySelector("#score-wave"),
  formValue: document.querySelector("#score-form"),
  melody: document.querySelector("#score-melody"),
  beatName: document.querySelector("#score-beat"),
  beatTelemetry: document.querySelector("#beat-telemetry"),
  beatToggle: document.querySelector("#beat-toggle"),
  beatMutate: document.querySelector("#beat-mutate"),
  beatGrid: document.querySelector("#beat-grid"),
  bassName: document.querySelector("#score-bass"),
  bassTelemetry: document.querySelector("#bass-telemetry"),
  bassToggle: document.querySelector("#bass-toggle"),
  bassMutate: document.querySelector("#bass-mutate"),
  bassGrid: document.querySelector("#bass-grid"),
  harmonyName: document.querySelector("#score-harmony"),
  harmonyTelemetry: document.querySelector("#harmony-telemetry"),
  harmonyToggle: document.querySelector("#harmony-toggle"),
  harmonyMutate: document.querySelector("#harmony-mutate"),
  harmonyGrid: document.querySelector("#harmony-grid"),
  chimeName: document.querySelector("#score-chime"),
  chimeTelemetry: document.querySelector("#chime-telemetry"),
  chimeToggle: document.querySelector("#chime-toggle"),
  chimeMutate: document.querySelector("#chime-mutate"),
  chimeGrid: document.querySelector("#chime-grid"),
  chantName: document.querySelector("#score-chant"),
  chantTelemetry: document.querySelector("#chant-telemetry"),
  chantToggle: document.querySelector("#chant-toggle"),
  chantMutate: document.querySelector("#chant-mutate"),
  chantGrid: document.querySelector("#chant-grid"),
  bandstandStatus: document.querySelector("#bandstand-status"),
  bandstandTelemetry: document.querySelector("#bandstand-telemetry"),
  bandstandEngageAll: document.querySelector("#bandstand-engage-all"),
  bandstandSoloLead: document.querySelector("#bandstand-solo-lead"),
  bandstandMutateAll: document.querySelector("#bandstand-mutate-all"),
  status: document.querySelector("#status"),
};

let oracleSource = "";
let beatSource = "";
let bassSource = "";
let harmonySource = "";
let pietSource = "";
let fractranSource = "";
let chantSource = "";
let currentScore = null;
let currentBeat = null;
let currentBass = null;
let currentHarmony = null;
let currentChimes = null;
let currentChant = null;
let beatEnabled = true;
let bassEnabled = true;
let harmonyEnabled = true;
let chimeEnabled = true;
let chantEnabled = true;
let beatMutation = 0;
let bassMutation = 0;
let harmonyMutation = 0;
let chimeMutation = 0;
let chantMutation = 0;
let activeBeatStep = -1;
let audioContext = null;
let noiseBuffer = null;
let currentTransport = null;
let muted = false;
let masterVolume = Number(elements.volume.value);
let activeTempoBpm = Number(elements.tempo?.value || 108);

const interaction = {
  active: false,
  pointerId: null,
  x: 0,
  y: 0,
  smoothX: 0,
  smoothY: 0,
  hold: 0,
  tap: 0,
  dragSpeed: 0,
  dragTravel: 0,
  morphPhase: 0,
  pitchBend: 0,
  lastFrameAt: 0,
  lastTickAt: 0,
  ripples: [],
};

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

function masterGainFor(volume) {
  if (volume <= 0) return 0;
  return Math.min(1.4, (volume / 82) ** 1.6);
}

function setMasterVolume(value) {
  masterVolume = Math.max(0, Math.min(100, Number(value)));
  elements.volumeValue.value = `${Math.round(masterVolume)}%`;
  if (!audioContext || !currentTransport) return;
  const now = audioContext.currentTime;
  currentTransport.output.gain.cancelScheduledValues(now);
  currentTransport.output.gain.setTargetAtTime(masterGainFor(masterVolume), now, 0.018);
}

function setTempoBpm(value) {
  activeTempoBpm = Math.max(36, Math.min(208, Math.round(Number(value))));
  if (elements.tempo) elements.tempo.value = String(activeTempoBpm);
  if (elements.tempoValue) elements.tempoValue.value = `${activeTempoBpm} BPM`;
  if (elements.pulse && currentScore) elements.pulse.textContent = String(activeTempoBpm);
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

function shapeFamilyRadius(shape, symmetry, edge, twist, angle) {
  const folded = Math.cos(angle * symmetry);
  switch (shape) {
    case 0: return 0.72 + folded * (0.12 + edge * 0.16);
    case 1: return 0.58 + (Math.abs(folded) ** (3 + edge * 8)) * 0.38;
    case 2: return 0.68 + folded * 0.11;
    case 3: return 0.58 + (Math.floor((angle / Math.PI) * symmetry * 2) % 2) * (0.2 + edge * 0.16);
    case 4: return 0.64 + Math.abs(folded) * (0.16 + edge * 0.18);
    case 5: return 0.7 + Math.sin(angle * 2) * 0.12 + Math.cos(angle * 3 - 1.7) * 0.08 + folded * 0.04;
    case 6: return 0.63 + Math.sin(angle) * 0.18 + Math.cos(angle * symmetry) * 0.07;
    case 7: return 0.74 + Math.sin(angle * twist) * 0.055 + folded * 0.045;
    case 8: return 0.52 + Math.max(0, folded) * (0.28 + edge * 0.17);
    case 9: return 0.67 + Math.cos(angle * 2) * 0.15 + Math.max(0, Math.sin(angle)) * 0.12 + folded * 0.055;
    default: return 0.72;
  }
}

function shapeRadius(score, angle, elapsed) {
  const edge = score.edge / 100;
  let radius = shapeFamilyRadius(score.shape, score.symmetry, edge, score.twist, angle);
  const morphMix = Math.min(1, interaction.hold * 0.72 + interaction.tap * 0.42 + interaction.dragSpeed * 0.5);
  if (morphMix > 0.001) {
    const altShape = (score.shape + 3 + Math.floor(interaction.morphPhase * 0.35)) % 10;
    const altSymmetry = 2 + ((score.symmetry + 2) % 14);
    const altTwist = 1 + ((score.twist + 3) % 14);
    const morphed = shapeFamilyRadius(
      altShape,
      altSymmetry,
      Math.min(1, edge + 0.22),
      altTwist,
      angle + interaction.morphPhase * 0.45,
    );
    radius = radius * (1 - morphMix) + morphed * morphMix;
    const pointerAngle = Math.atan2(interaction.smoothY, interaction.smoothX);
    const pointerReach = Math.min(1, Math.hypot(interaction.smoothX, interaction.smoothY));
    const directionalPull = Math.cos(angle - pointerAngle) * pointerReach * (interaction.hold * 0.11 + interaction.dragSpeed * 0.09);
    const harmonicPinch = Math.cos((angle - pointerAngle) * (2 + (score.symmetry % 4)) + interaction.morphPhase) * interaction.tap * 0.07;
    radius += directionalPull + harmonicPinch;
  }
  return Math.max(0.38, Math.min(1.08, radius + fluxOffset(score, angle, elapsed)));
}

function fluxOffset(score, angle, elapsed) {
  const speed = 0.12 + score.kineticSpeed / 92;
  const time = elapsed * speed + interaction.morphPhase * 1.35 + score.kineticTilt / 8 * Math.PI * 2;
  const depth = (0.022 + score.kineticDepth / 100 * 0.095) * (1 + interaction.hold * 0.75 + interaction.dragSpeed * 0.6);
  const tapWave = Math.sin(angle * (score.symmetry + 5) - elapsed * 10.5) * interaction.tap * 0.068;
  switch (score.fluxMode) {
    case 0: return Math.sin(angle * score.twist - time) * depth + tapWave;
    case 1: return Math.sin(angle * score.symmetry + time) * Math.cos(angle * score.twist - time * 0.63) * depth + tapWave;
    case 2: return Math.sin(angle * 2 + time) * Math.sin(angle * (score.symmetry + 1) - time * 0.8) * depth + tapWave;
    case 3: return Math.tanh(Math.sin(angle * score.symmetry - time) * 3) * depth * 0.82 + tapWave;
    case 4: {
      const morph = (Math.sin(time * 0.55) + 1) / 2;
      return (Math.cos(angle * score.symmetry) * (1 - morph) + Math.cos(angle * (score.symmetry + 1)) * morph) * depth + tapWave;
    }
    case 5: return (Math.sin(angle * 3 - time) * 0.55 + Math.sin(angle * 7 + time * 0.73) * 0.3 + Math.cos(angle * 11 - time * 0.41) * 0.15) * depth + tapWave;
    case 6: return Math.sin(angle + Math.sin(time) * 1.4) * Math.cos(angle * score.twist - time) * depth + tapWave;
    case 7: return Math.sin(angle * score.symmetry - time) ** 3 * depth + tapWave;
    default: return tapWave;
  }
}

function traceBody(ctx, score, base, elapsed, points) {
  ctx.beginPath();
  for (let index = 0; index <= points; index += 1) {
    const angle = index / points * Math.PI * 2;
    const radius = base * shapeRadius(score, angle, elapsed);
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    if (index === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
}

const TESSERACT_VERTICES = Object.freeze(Array.from({ length: 16 }, (_, index) => [
  index & 1 ? 1 : -1,
  index & 2 ? 1 : -1,
  index & 4 ? 1 : -1,
  index & 8 ? 1 : -1,
]));

const TESSERACT_EDGES = Object.freeze(TESSERACT_VERTICES.flatMap((_, index) => (
  [1, 2, 4, 8]
    .filter((bit) => (index & bit) === 0)
    .map((bit) => [index, index | bit])
)));

function rotatePlane(point, first, second, angle) {
  const cosine = Math.cos(angle);
  const sine = Math.sin(angle);
  const a = point[first] * cosine - point[second] * sine;
  const b = point[first] * sine + point[second] * cosine;
  point[first] = a;
  point[second] = b;
}

function projectedTesseract(score, base, elapsed) {
  const speed = 0.08 + score.kineticSpeed / 145;
  const phase = score.kineticTilt / 8 * Math.PI * 2;
  return TESSERACT_VERTICES.map((source) => {
    const point = [...source];
    rotatePlane(point, 0, 3, elapsed * speed + phase);
    rotatePlane(point, 1, 2, elapsed * speed * 0.73 - phase * 0.4);
    rotatePlane(point, 1, 3, elapsed * speed * 0.47 + phase * 0.7);
    rotatePlane(point, 0, 2, elapsed * speed * 0.29);
    const perspective4 = 3.1 / (3.1 - point[3]);
    const x3 = point[0] * perspective4;
    const y3 = point[1] * perspective4;
    const z3 = point[2] * perspective4;
    const perspective3 = 4.2 / (4.2 - z3);
    const scale = base * (0.15 + score.kineticDepth / 1000);
    return { x: x3 * perspective3 * scale, y: y3 * perspective3 * scale, depth: z3 };
  });
}

function drawTesseract(ctx, score, base, elapsed, colors) {
  const vertices = projectedTesseract(score, base, elapsed);
  for (const [start, end] of TESSERACT_EDGES) {
    const a = vertices[start];
    const b = vertices[end];
    const depth = Math.max(-1.8, Math.min(1.8, (a.depth + b.depth) / 2));
    ctx.globalAlpha = 0.28 + (depth + 1.8) / 3.6 * 0.58;
    ctx.strokeStyle = `hsl(${colors[(start + end) % colors.length]} 100% ${62 + depth * 8}%)`;
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.stroke();
  }
  ctx.globalAlpha = 0.85;
  for (const [index, vertex] of vertices.entries()) {
    ctx.fillStyle = `hsl(${colors[index % colors.length]} 100% 76%)`;
    ctx.beginPath();
    ctx.arc(vertex.x, vertex.y, Math.max(1, base * 0.008), 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawNestedFrames(ctx, score, base, elapsed, colors) {
  const sides = 4 + score.kineticTilt % 5;
  const speed = 0.08 + score.kineticSpeed / 180;
  for (let layer = 0; layer < 6; layer += 1) {
    const radius = base * (0.13 + layer * 0.085);
    const rotation = elapsed * speed * (layer % 2 ? -1 : 1) + layer * 0.37;
    ctx.strokeStyle = `hsla(${colors[layer % colors.length]} 100% 76% / ${0.75 - layer * 0.07})`;
    ctx.beginPath();
    for (let point = 0; point <= sides; point += 1) {
      const angle = point / sides * Math.PI * 2 + rotation;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius * Math.cos(rotation * 0.6 + layer);
      if (point === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
  }
}

function drawRibbons(ctx, score, base, elapsed, colors) {
  const speed = 0.15 + score.kineticSpeed / 150;
  for (let ribbon = 0; ribbon < 4; ribbon += 1) {
    ctx.strokeStyle = `hsla(${colors[ribbon % colors.length]} 100% 78% / 0.62)`;
    ctx.beginPath();
    for (let point = 0; point <= 120; point += 1) {
      const phase = point / 120 * Math.PI * 2;
      const radius = base * (0.2 + ribbon * 0.08 + Math.sin(phase * score.twist + elapsed * speed) * 0.04);
      const x = Math.cos(phase + elapsed * speed * 0.2 * (ribbon + 1)) * radius;
      const y = Math.sin(phase * (1 + ribbon * 0.5) - elapsed * speed) * radius * 0.8;
      if (point === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
  }
}

function drawChordWeb(ctx, score, base, elapsed, colors) {
  const count = 18 + score.kineticTilt;
  const rotation = elapsed * (0.05 + score.kineticSpeed / 300);
  const vertices = Array.from({ length: count }, (_, index) => {
    const angle = index / count * Math.PI * 2 + rotation;
    const radius = base * (0.33 + Math.sin(index * score.twist + elapsed * 0.4) * 0.05);
    return [Math.cos(angle) * radius, Math.sin(angle) * radius];
  });
  for (let index = 0; index < count; index += 1) {
    const target = (index + score.symmetry) % count;
    ctx.strokeStyle = `hsla(${colors[index % colors.length]} 100% 76% / 0.42)`;
    ctx.beginPath();
    ctx.moveTo(vertices[index][0], vertices[index][1]);
    ctx.lineTo(vertices[target][0], vertices[target][1]);
    ctx.stroke();
  }
}

function drawDimensionalGrid(ctx, score, base, elapsed, colors) {
  const speed = 0.12 + score.kineticSpeed / 190;
  const rotation = elapsed * speed;
  ctx.save();
  ctx.rotate(rotation * 0.3);
  for (let line = -5; line <= 5; line += 1) {
    const shift = Math.sin(rotation + line * 0.7) * base * 0.08;
    ctx.strokeStyle = `hsla(${colors[(line + 6) % colors.length]} 100% 78% / 0.42)`;
    ctx.beginPath();
    ctx.moveTo(-base * 0.55, line * base * 0.075 + shift);
    ctx.bezierCurveTo(-base * 0.15, line * base * 0.04 - shift, base * 0.15, line * base * 0.11 + shift, base * 0.55, line * base * 0.075 - shift);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(line * base * 0.075 + shift, -base * 0.55);
    ctx.bezierCurveTo(line * base * 0.04 - shift, -base * 0.15, line * base * 0.11 + shift, base * 0.15, line * base * 0.075 - shift, base * 0.55);
    ctx.stroke();
  }
  ctx.restore();
}

function drawContourMembrane(ctx, score, base, elapsed, colors) {
  for (let layer = 1; layer <= 6; layer += 1) {
    ctx.strokeStyle = `hsla(${colors[layer % colors.length]} 100% 82% / ${0.24 + layer * 0.055})`;
    traceBody(ctx, score, base * layer / 7, elapsed + layer * 0.7, Math.max(80, score.symmetry * 16));
    ctx.stroke();
  }
}

function drawGyroscope(ctx, score, base, elapsed, colors) {
  const speed = 0.14 + score.kineticSpeed / 175;
  for (let ring = 0; ring < 7; ring += 1) {
    ctx.save();
    ctx.rotate(ring / 7 * Math.PI + elapsed * speed * (ring % 2 ? -0.32 : 0.28));
    ctx.strokeStyle = `hsla(${colors[ring % colors.length]} 100% 80% / 0.58)`;
    ctx.beginPath();
    ctx.ellipse(0, 0, base * (0.18 + ring * 0.045), base * (0.05 + (ring % 3) * 0.035), 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }
}

function drawCrystalNetwork(ctx, score, base, elapsed, colors) {
  const speed = 0.11 + score.kineticSpeed / 210;
  const nodes = Array.from({ length: 14 }, (_, index) => {
    const angle = index / 14 * Math.PI * 2 + elapsed * speed * (index % 2 ? -1 : 1);
    const radius = base * (0.14 + (index % 5) * 0.07 + Math.sin(elapsed * speed + index) * 0.025);
    return [Math.cos(angle) * radius, Math.sin(angle * (1 + score.kineticTilt / 16)) * radius];
  });
  for (let index = 0; index < nodes.length; index += 1) {
    for (const jump of [3, 5]) {
      const target = (index + jump) % nodes.length;
      ctx.strokeStyle = `hsla(${colors[(index + jump) % colors.length]} 100% 78% / 0.34)`;
      ctx.beginPath();
      ctx.moveTo(nodes[index][0], nodes[index][1]);
      ctx.lineTo(nodes[target][0], nodes[target][1]);
      ctx.stroke();
    }
    ctx.fillStyle = `hsl(${colors[index % colors.length]} 100% 78%)`;
    ctx.beginPath();
    ctx.arc(nodes[index][0], nodes[index][1], Math.max(1, base * 0.009), 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawKineticCore(ctx, score, base, elapsed, colors) {
  const coreElapsed = elapsed + interaction.morphPhase * 1.9;
  ctx.save();
  ctx.globalCompositeOperation = "screen";
  ctx.shadowBlur = 0;
  ctx.lineWidth = Math.max(0.7, base * (0.003 + score.kineticDepth / 32000) * (1 + interaction.hold * 0.55 + interaction.tap * 0.4));
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  switch (score.kineticMode) {
    case 0: drawTesseract(ctx, score, base, coreElapsed, colors); break;
    case 1: drawNestedFrames(ctx, score, base, coreElapsed, colors); break;
    case 2: drawRibbons(ctx, score, base, coreElapsed, colors); break;
    case 3: drawChordWeb(ctx, score, base, coreElapsed, colors); break;
    case 4: drawDimensionalGrid(ctx, score, base, coreElapsed, colors); break;
    case 5: drawContourMembrane(ctx, score, base, coreElapsed, colors); break;
    case 6: drawGyroscope(ctx, score, base, coreElapsed, colors); break;
    case 7: drawCrystalNetwork(ctx, score, base, coreElapsed, colors); break;
    default: drawTesseract(ctx, score, base, coreElapsed, colors);
  }
  ctx.restore();
}

function traceEyeShape(ctx, shape, size) {
  ctx.beginPath();
  switch (shape) {
    case 0:
      ctx.ellipse(0, 0, size * 1.55, size, 0, 0, Math.PI * 2);
      break;
    case 1:
      ctx.arc(0, 0, size * 1.12, 0, Math.PI * 2);
      break;
    case 2:
      ctx.moveTo(-size * 1.5, 0);
      ctx.lineTo(0, -size);
      ctx.lineTo(size * 1.5, 0);
      ctx.lineTo(0, size);
      ctx.closePath();
      break;
    case 3:
      ctx.moveTo(-size * 1.6, 0);
      ctx.bezierCurveTo(-size * 0.72, -size * 1.15, size * 0.72, -size * 1.15, size * 1.6, 0);
      ctx.bezierCurveTo(size * 0.72, size * 0.68, -size * 0.72, size * 0.68, -size * 1.6, 0);
      ctx.closePath();
      break;
    case 4:
      ctx.moveTo(0, -size * 1.18);
      ctx.lineTo(size * 1.38, size * 0.88);
      ctx.lineTo(-size * 1.38, size * 0.88);
      ctx.closePath();
      break;
    case 5:
      ctx.roundRect(-size * 1.42, -size * 0.86, size * 2.84, size * 1.72, size * 0.48);
      break;
    case 6:
      ctx.moveTo(-size * 1.55, size * 0.16);
      ctx.quadraticCurveTo(0, -size * 1.42, size * 1.55, size * 0.16);
      ctx.quadraticCurveTo(0, size * 0.72, -size * 1.55, size * 0.16);
      ctx.closePath();
      break;
    case 7:
      for (let point = 0; point < 6; point += 1) {
        const angle = -Math.PI / 2 + point / 6 * Math.PI * 2;
        const x = Math.cos(angle) * size * (point % 2 ? 1.18 : 1.42);
        const y = Math.sin(angle) * size;
        if (point === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      break;
    default:
      ctx.arc(0, 0, size, 0, Math.PI * 2);
  }
}

function tracePupil(ctx, shape, x, y, size) {
  ctx.beginPath();
  switch (shape) {
    case 0:
      ctx.arc(x, y, size * 0.38, 0, Math.PI * 2);
      break;
    case 1:
      ctx.ellipse(x, y, size * 0.17, size * 0.58, 0, 0, Math.PI * 2);
      break;
    case 2:
      ctx.ellipse(x, y, size * 0.62, size * 0.16, 0, 0, Math.PI * 2);
      break;
    case 3:
      ctx.moveTo(x, y - size * 0.56);
      ctx.lineTo(x + size * 0.42, y);
      ctx.lineTo(x, y + size * 0.56);
      ctx.lineTo(x - size * 0.42, y);
      ctx.closePath();
      break;
    case 4:
      for (let point = 0; point < 10; point += 1) {
        const angle = -Math.PI / 2 + point / 10 * Math.PI * 2;
        const radius = point % 2 ? size * 0.2 : size * 0.58;
        const px = x + Math.cos(angle) * radius;
        const py = y + Math.sin(angle) * radius;
        if (point === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      break;
    case 5:
      ctx.rect(x - size * 0.14, y - size * 0.6, size * 0.28, size * 1.2);
      ctx.rect(x - size * 0.6, y - size * 0.14, size * 1.2, size * 0.28);
      break;
    case 6:
      ctx.arc(x, y, size * 0.48, 0, Math.PI * 2);
      ctx.arc(x, y, size * 0.25, 0, Math.PI * 2, true);
      break;
    case 7:
      ctx.moveTo(x, y - size * 0.58);
      ctx.lineTo(x + size * 0.55, y + size * 0.48);
      ctx.lineTo(x - size * 0.55, y + size * 0.48);
      ctx.closePath();
      break;
    default:
      ctx.arc(x, y, size * 0.38, 0, Math.PI * 2);
  }
}

function eyePlacement(score, index, count, base, elapsed) {
  const ratio = count <= 1 ? 0.5 : index / (count - 1);
  switch (score.eyeLayout) {
    case 0: {
      const angle = index / count * Math.PI * 2 + elapsed * 0.055 * (score.motion % 2 ? 1 : -1);
      const orbit = base * (0.15 + Math.min(count, 8) * 0.014);
      return { x: Math.cos(angle) * orbit, y: Math.sin(angle) * orbit, angle, scale: 1 };
    }
    case 1: {
      const columns = Math.min(6, count);
      const row = Math.floor(index / columns);
      const column = index % columns;
      const rowCount = Math.ceil(count / columns);
      return {
        x: (column - (Math.min(columns, count - row * columns) - 1) / 2) * base * 0.13,
        y: (row - (rowCount - 1) / 2) * base * 0.13,
        angle: 0,
        scale: 0.9,
      };
    }
    case 2: {
      const angle = index * 2.399 + elapsed * 0.025;
      const orbit = base * (0.04 + ratio * 0.28);
      return { x: Math.cos(angle) * orbit, y: Math.sin(angle) * orbit, angle: angle + Math.PI / 2, scale: 0.72 + ratio * 0.34 };
    }
    case 3: {
      const angle = Math.PI + ratio * Math.PI;
      return { x: Math.cos(angle) * base * 0.31, y: Math.sin(angle) * base * 0.31, angle: angle + Math.PI / 2, scale: 0.82 + Math.sin(ratio * Math.PI) * 0.28 };
    }
    case 4: {
      const columns = Math.ceil(Math.sqrt(count));
      const rows = Math.ceil(count / columns);
      const column = index % columns;
      const row = Math.floor(index / columns);
      return {
        x: (column - (columns - 1) / 2) * base * 0.13,
        y: (row - (rows - 1) / 2) * base * 0.13,
        angle: (column - row) * 0.12,
        scale: 0.78 + ((index * 3) % 4) * 0.08,
      };
    }
    case 5:
      return { x: Math.sin(index * 1.7) * base * 0.08, y: (ratio - 0.5) * base * 0.58, angle: index % 2 ? 0.12 : -0.12, scale: 0.72 + (index % 3) * 0.13 };
    default:
      return { x: 0, y: 0, angle: 0, scale: 1 };
  }
}

function drawIris(ctx, score, eye, size, elapsed) {
  const hue = wrapHue(score.irisHue + eye * score.irisShift);
  const secondHue = wrapHue(hue + score.hueShift);
  const baseGazeAngle = score.gaze / 8 * Math.PI * 2 + Math.sin(elapsed * 0.32 + eye) * 0.16;
  const attention = Math.min(1, interaction.hold * 0.85 + interaction.tap * 0.65);
  const pointerAngle = Math.atan2(interaction.smoothY, interaction.smoothX);
  const pointerReach = Math.min(1.35, 0.45 + Math.hypot(interaction.smoothX, interaction.smoothY));
  const x = (Math.cos(baseGazeAngle) * (1 - attention) + Math.cos(pointerAngle) * pointerReach * attention) * size * 0.24;
  const y = (Math.sin(baseGazeAngle) * (1 - attention) + Math.sin(pointerAngle) * pointerReach * attention) * size * 0.16;
  const radius = size * (0.48 + (eye % 3) * 0.055);
  const gradient = ctx.createRadialGradient(x - radius * 0.18, y - radius * 0.2, radius * 0.08, x, y, radius);
  gradient.addColorStop(0, `hsl(${secondHue} 100% 88%)`);
  gradient.addColorStop(0.3, `hsl(${hue} 94% 58%)`);
  gradient.addColorStop(1, `hsl(${wrapHue(hue - 35)} 82% 22%)`);
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fill();

  ctx.save();
  ctx.translate(x, y);
  ctx.lineWidth = Math.max(0.7, size * 0.07);
  ctx.strokeStyle = `hsla(${secondHue} 100% 84% / 0.72)`;
  ctx.fillStyle = `hsla(${secondHue} 100% 72% / 0.52)`;

  if (score.irisStyle === 1 || score.irisStyle === 5) {
    const rings = score.irisStyle === 1 ? 3 : 5;
    for (let ring = 1; ring <= rings; ring += 1) {
      ctx.beginPath();
      ctx.arc(0, 0, radius * ring / (rings + 1), 0, Math.PI * 2);
      ctx.stroke();
    }
  } else if (score.irisStyle === 2 || score.irisStyle === 6) {
    const spokes = score.irisStyle === 2 ? 8 : 16;
    for (let spoke = 0; spoke < spokes; spoke += 1) {
      const angle = spoke / spokes * Math.PI * 2 + elapsed * 0.04 + interaction.morphPhase * 0.5;
      ctx.beginPath();
      ctx.moveTo(Math.cos(angle) * radius * 0.22, Math.sin(angle) * radius * 0.22);
      ctx.lineTo(Math.cos(angle) * radius * 0.9, Math.sin(angle) * radius * 0.9);
      ctx.stroke();
    }
  } else if (score.irisStyle === 3) {
    for (let dot = 0; dot < 7; dot += 1) {
      const angle = dot / 7 * Math.PI * 2 + eye + interaction.morphPhase * 0.3;
      ctx.beginPath();
      ctx.arc(Math.cos(angle) * radius * 0.64, Math.sin(angle) * radius * 0.64, radius * 0.09, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (score.irisStyle === 4) {
    ctx.fillStyle = `hsla(${secondHue} 100% 66% / 0.62)`;
    ctx.beginPath();
    ctx.arc(0, 0, radius * 0.88, -Math.PI / 2, Math.PI / 2);
    ctx.lineTo(0, 0);
    ctx.closePath();
    ctx.fill();
  } else if (score.irisStyle === 7) {
    ctx.strokeStyle = `hsl(${secondHue} 100% 74%)`;
    ctx.lineWidth = Math.max(1, size * 0.12);
    ctx.beginPath();
    ctx.arc(0, 0, radius * 0.76, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.restore();

  const pupilScale = Math.max(0.65, Math.min(1.42, 1 + interaction.tap * 0.36 - interaction.hold * 0.22 + interaction.dragSpeed * 0.25));
  ctx.fillStyle = `hsl(${wrapHue(hue + 180)} 36% 5%)`;
  tracePupil(ctx, score.pupilShape, x, y, radius * pupilScale);
  ctx.fill("evenodd");
}

function drawEye(ctx, score, eye, base, elapsed, colors) {
  const placement = eyePlacement(score, eye, score.eyes, base, elapsed + interaction.morphPhase * 0.6);
  const crowding = 1 - Math.max(0, score.eyes - 7) * 0.025;
  const size = Math.max(4, base * (0.022 + score.eyeSize / 2450) * placement.scale * crowding);
  ctx.save();
  ctx.translate(placement.x, placement.y);
  ctx.rotate(placement.angle);
  ctx.shadowBlur = size * 0.35;
  ctx.shadowColor = `hsla(${score.irisHue} 100% 72% / 0.55)`;
  traceEyeShape(ctx, score.eyeShape, size);
  ctx.fillStyle = `hsl(${wrapHue(colors[2] + 20)} 34% 92%)`;
  ctx.fill();
  ctx.save();
  traceEyeShape(ctx, score.eyeShape, size);
  ctx.clip();
  drawIris(ctx, score, eye, size, elapsed);
  ctx.restore();
  traceEyeShape(ctx, score.eyeShape, size);
  ctx.lineWidth = Math.max(0.8, size * 0.11);
  ctx.strokeStyle = `hsl(${colors[0]} 70% 8%)`;
  ctx.stroke();
  ctx.restore();
}

function stepInteraction(timestamp, reducedMotion) {
  const dt = interaction.lastFrameAt ? Math.min(0.06, (timestamp - interaction.lastFrameAt) / 1000) : 0.016;
  interaction.lastFrameAt = timestamp;
  const targetHold = interaction.active ? 1 : 0;
  interaction.hold += (targetHold - interaction.hold) * Math.min(1, dt * (interaction.active ? 4.2 : 2.8));
  interaction.tap *= Math.exp(-dt * 3.8);
  interaction.dragSpeed *= Math.exp(-dt * 6.0);
  const followRate = Math.min(1, dt * (interaction.active ? 9.5 : 3.6));
  const targetX = interaction.active ? interaction.x : 0;
  const targetY = interaction.active ? interaction.y : 0;
  interaction.smoothX += (targetX - interaction.smoothX) * followRate;
  interaction.smoothY += (targetY - interaction.smoothY) * followRate;
  if (!reducedMotion) {
    interaction.morphPhase += dt * (interaction.hold * 2.2 + interaction.dragSpeed * 4.8 + interaction.tap * 1.9);
  }
  const targetPitch = interaction.active
    ? -interaction.smoothY
    : interaction.tap * 0.25;
  interaction.pitchBend += (targetPitch - interaction.pitchBend) * Math.min(1, dt * 6.5);
  interaction.ripples = interaction.ripples.filter((ripple) => (timestamp - ripple.bornAt) < 920);
  updateAudioInteraction();
}

class OracleVision {
  constructor(canvas) {
    this.canvas = canvas;
    this.context = canvas.getContext("2d", { alpha: false });
    this.score = {
      seed: 132071, pulse: 72, hue: 274, hueShift: 126, saturation: 88, palette: 2,
      symmetry: 7, twist: 4, bloom: 66, melodyMode: 1, melodyTurn: 0,
      eyes: 3, eyeShape: 3, irisStyle: 2,
      pupilShape: 1, irisHue: 164, irisShift: 72, eyeSize: 68, gaze: 1, eyeLayout: 0,
      shape: 0, size: 66, edge: 50, motion: 2, kineticMode: 0, kineticSpeed: 64,
      kineticDepth: 72, kineticTilt: 3, fluxMode: 1,
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
    stepInteraction(timestamp, this.reducedMotion);
    const ctx = this.context;
    const score = this.score;
    const width = this.width;
    const height = this.height;
    const elapsed = this.reducedMotion ? 1.25 : (timestamp - this.startedAt) / 1000;
    const colors = paletteFor(score);

    const glowFocusX = width * (0.5 + interaction.smoothX * 0.14);
    const glowFocusY = height * (0.48 + interaction.smoothY * 0.14);
    const backdrop = ctx.createRadialGradient(glowFocusX, glowFocusY, 0, width * 0.5, height * 0.48, Math.max(width, height) * 0.78);
    backdrop.addColorStop(0, `hsl(${colors[0]} ${Math.max(30, score.saturation - 24)}% ${16 + interaction.hold * 7 + interaction.tap * 6}%)`);
    backdrop.addColorStop(0.48, `hsl(${colors[1]} ${Math.max(25, score.saturation - 35)}% ${8 + interaction.hold * 4}%)`);
    backdrop.addColorStop(1, `hsl(${colors[2]} 32% 3%)`);
    ctx.fillStyle = backdrop;
    ctx.fillRect(0, 0, width, height);

    ctx.save();
    for (const particle of this.particles) {
      const driftX = this.reducedMotion ? 0 : Math.sin(elapsed * particle.drift + particle.phase + interaction.morphPhase * 0.5) * (4 + score.motion * 1.8);
      const driftY = this.reducedMotion ? 0 : Math.cos(elapsed * 0.3 + particle.phase + interaction.morphPhase * 0.4) * score.motion;
      ctx.globalAlpha = 0.15 + Math.sin(elapsed + particle.phase) * 0.1 + interaction.hold * 0.12;
      ctx.fillStyle = `hsl(${colors[Math.floor(particle.phase) % colors.length]} ${score.saturation}% 78%)`;
      ctx.beginPath();
      ctx.arc(particle.x * width + driftX, particle.y * height + driftY, particle.radius * (1 + interaction.tap * 0.45), 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();

    const orbitDistance = this.reducedMotion ? 0 : score.motion * Math.min(width, height) * 0.004;
    const tugX = this.reducedMotion ? 0 : interaction.smoothX * width * (0.075 + interaction.hold * 0.065);
    const tugY = this.reducedMotion ? 0 : interaction.smoothY * height * (0.075 + interaction.hold * 0.065);
    const centerX = width * 0.5 + Math.cos(elapsed * 0.21) * orbitDistance + tugX;
    const centerY = height * 0.5 + Math.sin(elapsed * 0.27) * orbitDistance + tugY;
    const sizeFactor = 0.15 + score.size / 100 * (width < 760 ? 0.14 : 0.22);
    const base = Math.min(width, height) * sizeFactor;
    const points = Math.max(120, score.symmetry * 28);
    const stretchX = 1 + (this.reducedMotion ? 0 : (interaction.smoothX * interaction.hold * 0.14 + interaction.tap * 0.05));
    const stretchY = 1 + (this.reducedMotion ? 0 : (interaction.smoothY * interaction.hold * 0.14 - interaction.tap * 0.04));
    const aspectX = [1, 1, 1.08, 1, 0.9, 1.16, 1.25, 1, 0.92, 0.88][score.shape] * stretchX;
    const aspectY = [1, 1, 0.92, 1, 1.12, 0.88, 0.72, 1, 1.08, 1.25][score.shape] * stretchY;

    ctx.save();
    ctx.translate(centerX, centerY);
    const direction = score.kineticTilt % 2 ? 1 : -1;
    ctx.rotate(this.reducedMotion ? 0.16 : (elapsed * (0.004 + score.kineticSpeed / 12000) + interaction.morphPhase * 0.14) * direction);
    ctx.scale(aspectX, aspectY);

    ctx.save();
    ctx.shadowColor = `hsla(${colors[1]} 100% 70% / 0.58)`;
    ctx.shadowBlur = score.bloom * 0.62;

    const aura = ctx.createRadialGradient(0, 0, base * 0.04, 0, 0, base * 1.25);
    aura.addColorStop(0, `hsla(${colors[2]} ${score.saturation}% 90% / 0.96)`);
    aura.addColorStop(0.24, `hsla(${colors[0]} ${score.saturation}% 62% / 0.86)`);
    aura.addColorStop(0.68, `hsla(${colors[1]} ${score.saturation}% 48% / 0.38)`);
    aura.addColorStop(1, `hsla(${colors[2]} ${score.saturation}% 48% / 0)`);
    ctx.fillStyle = aura;
    traceBody(ctx, score, base, elapsed, points);
    ctx.fill();
    ctx.restore();

    ctx.save();
    traceBody(ctx, score, base, elapsed, points);
    ctx.clip();
    drawKineticCore(ctx, score, base, elapsed, colors);
    ctx.restore();

    ctx.globalCompositeOperation = "screen";
    ctx.lineWidth = (0.7 + score.edge / 70) * (1 + interaction.hold * 0.45 + interaction.tap * 0.35);
    ctx.strokeStyle = `hsla(${colors[2]} 100% 84% / ${0.58 + interaction.hold * 0.24})`;
    const ringCount = 2 + score.palette % 4;
    const kineticRate = 0.12 + score.kineticSpeed / 180;
    const kineticPhase = score.kineticTilt / 8 * Math.PI * 2 + interaction.morphPhase * 1.2;
    for (let ring = 0; ring < ringCount; ring += 1) {
      ctx.beginPath();
      for (let i = 0; i <= points; i += 1) {
        const angle = i / points * Math.PI * 2;
        const ringDirection = ring % 2 ? -1 : 1;
        const motion = Math.sin(
          angle * (score.symmetry + ring) + elapsed * kineticRate * ringDirection + kineticPhase,
        ) * (0.022 + score.kineticDepth / 2400) * (1 + interaction.hold * 0.8 + interaction.dragSpeed * 0.7);
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
    for (let eye = 0; eye < score.eyes; eye += 1) {
      drawEye(ctx, score, eye, base, elapsed, colors);
    }
    ctx.restore();

    if (interaction.ripples.length > 0) {
      ctx.save();
      ctx.globalCompositeOperation = "screen";
      for (const ripple of interaction.ripples) {
        const age = Math.max(0, (timestamp - ripple.bornAt) / 920);
        const rx = (ripple.x * 0.5 + 0.5) * width;
        const ry = (ripple.y * 0.5 + 0.5) * height;
        const rippleRadius = base * (0.1 + age * (0.95 + ripple.strength * 0.45));
        ctx.strokeStyle = `hsla(${colors[2]} 100% 86% / ${(1 - age) ** 1.6 * 0.52})`;
        ctx.lineWidth = 1.6 * (1 - age * 0.6);
        ctx.beginPath();
        ctx.arc(rx, ry, rippleRadius, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.restore();
    }

    requestAnimationFrame(this.draw);
  }
}

const vision = new OracleVision(elements.canvas);

async function ensureAudioContext() {
  if (!audioContext) audioContext = new AudioContext();
  if (audioContext.state === "suspended") await audioContext.resume();
  return audioContext;
}

function harmonicField() {
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

function updateAudioInteraction() {
  if (!audioContext || !currentTransport || muted) return;
  const score = currentScore || vision.score;
  const now = audioContext.currentTime;
  const transport = currentTransport;
  const field = harmonicField();

  const baseCutoff = 620 + score.bloom * 24 + score.hueShift * 2;
  const harmonicExponent = (interaction.pitchBend * 0.58 + Math.sin(field.angle) * 0.28) * Math.max(0.25, interaction.hold) + interaction.tap * 0.22;
  const targetCutoff = Math.max(240, Math.min(4800, baseCutoff * (2 ** harmonicExponent)));
  const baseQ = 2.5 + score.edge / 16;
  const targetQ = Math.min(5.2, baseQ + field.radius * 1.35 + interaction.tap * 0.6);
  const targetMix = 0.28 * (1 + interaction.hold * 0.16 + interaction.tap * 0.1);
  const baseFeedback = 0.14 + score.bloom / 650;
  const targetFeedback = Math.min(0.46, baseFeedback + field.radius * 0.12);

  transport.filter.frequency.setTargetAtTime(targetCutoff, now, 0.045);
  transport.filter.Q.setTargetAtTime(targetQ, now, 0.045);
  transport.mix.gain.setTargetAtTime(targetMix, now, 0.045);
  transport.feedback.gain.setTargetAtTime(targetFeedback, now, 0.05);

  const subWeight = 0.085 * (1 + Math.max(0, -interaction.pitchBend) * 0.45 * interaction.hold);
  const fifthWeight = 0.035 + field.radius * 0.055 * (0.5 - 0.5 * Math.cos(field.angle * 2));
  const shimmerWeight = field.radius * 0.048 * (0.5 + 0.5 * Math.sin(interaction.pitchBend * Math.PI * 0.5));
  const targetDroneGains = [subWeight, fifthWeight, shimmerWeight];

  for (const [index, drone] of transport.drones.entries()) {
    const baseDetune = [-5, 4, -3][index] || 0;
    const phaseBeating = Math.sin(field.angle + index * 2.094) * 3.5 * field.radius;
    drone.detune.setTargetAtTime(baseDetune + phaseBeating, now, 0.05);
    if (transport.droneGains?.[index]) {
      transport.droneGains[index].gain.setTargetAtTime(targetDroneGains[index] ?? 0.03, now, 0.06);
    }
  }
}

function triggerPercussion(kind, normX = 0, normY = 0, strength = 1) {
  if (!audioContext || !currentTransport || muted) return;
  const score = currentScore || vision.score;
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
  }
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
  const field = harmonicField();
  const primaryNote = score.root + transport.melody[step % transport.melody.length];
  const consonantInterval = interaction.pitchBend > 0.32 ? 7 : (interaction.pitchBend < -0.32 ? -5 : 0);
  const shiftedNote = score.root + transport.melody[(step + field.phaseStep) % transport.melody.length] + consonantInterval;
  const envelope = context.createGain();
  const attack = Math.min(0.055, duration * (0.2 + field.radius * 0.06));
  const peakGain = 0.3 * (1 + interaction.hold * 0.12);
  envelope.gain.setValueAtTime(0.0001, at);
  envelope.gain.exponentialRampToValueAtTime(peakGain, at + Math.max(0.01, attack));
  envelope.gain.exponentialRampToValueAtTime(0.0001, at + duration);
  envelope.connect(transport.mix);

  const chorusPhaseCents = Math.sin(field.angle + step * 0.52) * 3.5 * field.radius;
  const layers = field.shiftedWeight > 0.04
    ? [
      { note: primaryNote, weight: field.primaryWeight, detuneOffset: -chorusPhaseCents },
      { note: shiftedNote, weight: field.shiftedWeight, detuneOffset: chorusPhaseCents },
    ]
    : [{ note: primaryNote, weight: 1, detuneOffset: 0 }];

  for (const layer of layers) {
    for (const [voiceIndex, voice] of voiceStack(score, step).entries()) {
      const oscillator = context.createOscillator();
      oscillator.type = voiceIndex === 0
        ? (score.waveform === "sawtooth" ? "triangle" : score.waveform)
        : ["triangle", "sine", "triangle", "sine"][(score.wave + voiceIndex + score.voice) % 4];
      oscillator.frequency.value = midiToFrequency(layer.note + voice.interval);
      oscillator.detune.value = voice.detune * 0.45 + layer.detuneOffset + (step % 3 - 1) * score.twist * 0.14;
      const level = context.createGain();
      level.gain.value = voice.gain * layer.weight;
      oscillator.connect(level).connect(envelope);
      oscillator.start(at);
      oscillator.stop(at + duration + 0.06);
    }
  }
}

function ensureNoiseBuffer(context) {
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

function scheduleBeatStep(context, transport, score, stepIndex, at, stepDuration) {
  if (!beatEnabled || !currentBeat || !transport.beatBus) return;
  const step = currentBeat.steps[stepIndex % currentBeat.steps.length];
  if (!step) return;

  const holdLift = 1 + interaction.hold * 0.18;

  if (step.kick > 0) {
    const kickOsc = context.createOscillator();
    const kickGain = context.createGain();
    const startFreq = midiToFrequency(score.root - 5);
    const endFreq = Math.max(34, midiToFrequency(score.root - 24));
    const peak = (step.kick === 2 ? 0.24 : 0.13) * holdLift;
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

function scheduleBassStep(context, transport, score, stepIndex, at, stepDuration) {
  if (!bassEnabled || !currentBass || !transport.bassBus) return;
  const step = currentBass.steps[stepIndex % currentBass.steps.length];
  if (!step || step.gate === 0) return;

  const nextStep = currentBass.steps[(stepIndex + 1) % currentBass.steps.length];
  const baseMidi = Math.max(28, score.root - (step.register > 0 ? 12 : 24) + step.interval);
  const nextMidi = Math.max(28, score.root - ((nextStep?.register || 0) > 0 ? 12 : 24) + (nextStep?.interval || 0));
  const freq = midiToFrequency(baseMidi);
  const glideFreq = midiToFrequency(nextMidi);

  const duration = Math.max(0.08, stepDuration * (step.gate === 2 ? 0.88 : 0.46));
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
  const startCutoff = Math.min(1250, freq * (step.accent ? 5.2 : 3.4) + (score.bassGlide || 55) * 3);
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

function scheduleHarmonyStep(context, transport, score, stepIndex, at, stepDuration) {
  if (!harmonyEnabled || !currentHarmony || !transport.harmonyBus) return;
  const step = currentHarmony.steps[stepIndex % currentHarmony.steps.length];
  if (!step || step.gate === 0) return;

  const isSustained = step.gate === 2;
  const duration = Math.max(0.18, stepDuration * (isSustained ? 1.45 : 0.78));
  const strumSec = (step.strumMs || 24) / 1000;
  const holdBoost = 1 + interaction.hold * 0.14;
  const waveforms = [
    ["triangle", "sine", "triangle"],
    ["sine", "triangle", "sine"],
    ["triangle", "sine", "sine"],
    ["sine", "sine", "triangle"],
  ][score.harmonyMode % 4];

  for (const [voiceIndex, interval] of step.chord.entries()) {
    const noteStart = at + voiceIndex * strumSec;
    const midi = Math.min(79, score.root + interval);
    const freq = midiToFrequency(midi);
    const osc = context.createOscillator();
    const voiceGain = context.createGain();

    osc.type = waveforms[voiceIndex % waveforms.length];
    osc.frequency.setValueAtTime(freq, noteStart);
    osc.detune.setValueAtTime((voiceIndex - 1) * 1.8 * (step.mirror === "/" ? 1 : -1), noteStart);

    const peak = (isSustained ? 0.056 : 0.044) * (1 - voiceIndex * 0.14) * holdBoost;
    const attack = isSustained ? 0.045 : 0.018;
    voiceGain.gain.setValueAtTime(0.0001, noteStart);
    voiceGain.gain.exponentialRampToValueAtTime(peak, noteStart + attack);
    voiceGain.gain.exponentialRampToValueAtTime(0.0001, noteStart + duration);

    osc.connect(voiceGain).connect(transport.harmonyBus);
    osc.start(noteStart);
    osc.stop(noteStart + duration + 0.04);
  }
}

function scheduleChimeStep(context, transport, score, stepIndex, at, stepDuration) {
  if (!chimeEnabled || !currentChimes || !transport.chimeBus) return;
  const step = currentChimes.steps[stepIndex % currentChimes.steps.length];
  if (!step || step.gate === 0) return;

  const isAccented = step.gate === 2;
  const rootMidi = Math.min(72, score.root + 12);
  const rootFreq = midiToFrequency(rootMidi);
  const bellFreq = rootFreq * step.ratioValue;
  const holdBoost = 1 + interaction.hold * 0.16;

  // 1. FRACTRAN Just Intonation overtone chime bell locked to active Tonnetz chord
  const bellOsc = context.createOscillator();
  const bellGain = context.createGain();
  bellOsc.type = "sine";
  bellOsc.frequency.setValueAtTime(bellFreq, at);
  const bellDuration = Math.max(0.24, stepDuration * (isAccented ? 1.6 : 1.0));
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

function scheduleChantStep(context, transport, score, stepIndex, at, stepDuration) {
  if (!chantEnabled || !currentChant || !transport.chantBus) return;
  const step = currentChant.steps[stepIndex % currentChant.steps.length];
  if (!step || step.gate === 0) return;

  const isSoliloquy = step.gate === 2;
  const duration = Math.max(0.24, stepDuration * (isSoliloquy ? 1.65 : 1.15));
  const midi = Math.max(40, Math.min(74, score.root + step.registerOffset + step.interval));
  const baseFreq = midiToFrequency(midi);
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

  const formants = [
    { freq: step.f1, q: 4.5 + (step.formantResonance || 55) * 0.025, weight: 1.0 },
    { freq: step.f2, q: 5.8 + (step.formantResonance || 55) * 0.03, weight: 0.62 },
    { freq: step.f3, q: 7.0 + (step.formantResonance || 55) * 0.035, weight: 0.28 },
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

function highlightBeatStep(stepIndex) {
  const normalized = ((stepIndex % 12) + 12) % 12;
  activeBeatStep = normalized;
  if (elements.beatGrid) {
    for (const button of elements.beatGrid.querySelectorAll(".beat-step")) {
      const idx = Number(button.dataset.step);
      button.classList.toggle("is-current", idx === normalized);
    }
  }
  if (elements.bassGrid) {
    for (const button of elements.bassGrid.querySelectorAll(".bass-step")) {
      const idx = Number(button.dataset.step);
      button.classList.toggle("is-current", idx === normalized);
    }
  }
  if (elements.harmonyGrid) {
    for (const button of elements.harmonyGrid.querySelectorAll(".harmony-step")) {
      const idx = Number(button.dataset.step);
      button.classList.toggle("is-current", idx === normalized);
    }
  }
  if (elements.chimeGrid) {
    for (const button of elements.chimeGrid.querySelectorAll(".chime-step")) {
      const idx = Number(button.dataset.step);
      button.classList.toggle("is-current", idx === normalized);
    }
  }
  if (elements.chantGrid) {
    for (const button of elements.chantGrid.querySelectorAll(".chant-step")) {
      const idx = Number(button.dataset.step);
      button.classList.toggle("is-current", idx === normalized);
    }
  }
}

function updateBeatGrid() {
  if (!elements.beatGrid) return;
  const steps = currentBeat?.steps || [];
  for (const button of elements.beatGrid.querySelectorAll(".beat-step")) {
    const idx = Number(button.dataset.step);
    const step = steps[idx] || { kick: 0, snare: 0, hat: 0, trits: "000" };
    const kickPip = button.querySelector(".pip-kick");
    const snarePip = button.querySelector(".pip-snare");
    const hatPip = button.querySelector(".pip-hat");
    const tritsEl = button.querySelector(".step-trits");
    if (kickPip) kickPip.dataset.level = String(step.kick);
    if (snarePip) snarePip.dataset.level = String(step.snare);
    if (hatPip) hatPip.dataset.level = String(step.hat);
    if (tritsEl) tritsEl.textContent = step.trits;
    button.setAttribute(
      "aria-label",
      `Step ${idx + 1}: ternary ${step.trits}, kick ${step.kick}, snare ${step.snare}, chime ${step.hat}`,
    );
  }
}

function renderBeatGrid() {
  if (!elements.beatGrid) return;
  elements.beatGrid.innerHTML = "";
  for (let index = 0; index < 12; index += 1) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "beat-step";
    button.dataset.step = String(index);
    button.innerHTML = `
      <span class="step-index">${String(index + 1).padStart(2, "0")}</span>
      <span class="step-pips" aria-hidden="true">
        <span class="voice-pip pip-kick" data-level="0"></span>
        <span class="voice-pip pip-snare" data-level="0"></span>
        <span class="voice-pip pip-hat" data-level="0"></span>
      </span>
      <span class="step-trits">000</span>
    `;
    button.addEventListener("click", () => {
      if (!currentBeat) return;
      const nextSteps = [...currentBeat.steps];
      nextSteps[index] = cycleBeatStep(nextSteps[index]);
      currentBeat = Object.freeze({
        ...currentBeat,
        steps: Object.freeze(nextSteps),
      });
      updateBeatGrid();
      if (audioContext && currentTransport && currentScore && !muted) {
        scheduleBeatStep(audioContext, currentTransport, currentScore, index, audioContext.currentTime + 0.01, 0.18);
      }
    });
    elements.beatGrid.append(button);
  }
}

function updateBassGrid() {
  if (!elements.bassGrid) return;
  const steps = currentBass?.steps || [];
  for (const button of elements.bassGrid.querySelectorAll(".bass-step")) {
    const idx = Number(button.dataset.step);
    const step = steps[idx] || { cell: 0, gate: 0, register: 0, slide: 0, accent: 0, label: "---" };
    const gatePip = button.querySelector(".pip-gate");
    const regPip = button.querySelector(".pip-reg");
    const slidePip = button.querySelector(".pip-slide");
    const labelEl = button.querySelector(".step-trits");
    const byteEl = button.querySelector(".cell-byte");
    button.dataset.gate = String(step.gate);
    button.dataset.accent = String(step.accent);
    if (gatePip) gatePip.dataset.level = String(step.gate);
    if (regPip) regPip.dataset.level = String(step.register ? 2 : 0);
    if (slidePip) slidePip.dataset.level = String(step.slide ? 2 : (step.accent ? 1 : 0));
    if (labelEl) labelEl.textContent = step.label;
    if (byteEl) byteEl.textContent = `[${String(step.cell).padStart(3, "0")}]`;
    button.setAttribute(
      "aria-label",
      `Tape cell ${idx}: ${step.label}, byte ${step.cell}`,
    );
  }
}

function renderBassGrid() {
  if (!elements.bassGrid) return;
  elements.bassGrid.innerHTML = "";
  for (let index = 0; index < 12; index += 1) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "beat-step bass-step";
    button.dataset.step = String(index);
    button.innerHTML = `
      <span class="step-index">@${String(index).padStart(2, "0")}</span>
      <span class="step-pips" aria-hidden="true">
        <span class="voice-pip pip-gate" data-level="0"></span>
        <span class="voice-pip pip-reg" data-level="0"></span>
        <span class="voice-pip pip-hat pip-slide" data-level="0"></span>
      </span>
      <span class="step-trits">---</span>
      <span class="cell-byte">[000]</span>
    `;
    button.addEventListener("click", () => {
      if (!currentBass || !currentScore) return;
      const nextSteps = [...currentBass.steps];
      nextSteps[index] = cycleBassCell(nextSteps[index], melodyFor(currentScore));
      currentBass = Object.freeze({
        ...currentBass,
        steps: Object.freeze(nextSteps),
      });
      updateBassGrid();
      if (audioContext && currentTransport && !muted) {
        scheduleBassStep(audioContext, currentTransport, currentScore, index, audioContext.currentTime + 0.01, 0.24);
      }
    });
    elements.bassGrid.append(button);
  }
}

function updateHarmonyGrid() {
  if (!elements.harmonyGrid) return;
  const steps = currentHarmony?.steps || [];
  for (const button of elements.harmonyGrid.querySelectorAll(".harmony-step")) {
    const idx = Number(button.dataset.step);
    const step = steps[idx] || { raw: 0, gate: 0, mirror: "/", label: "REST" };
    const idxEl = button.querySelector(".step-index");
    const rootPip = button.querySelector(".pip-root");
    const thirdPip = button.querySelector(".pip-third");
    const fifthPip = button.querySelector(".pip-fifth");
    const labelEl = button.querySelector(".step-trits");
    const byteEl = button.querySelector(".cell-byte");
    button.dataset.gate = String(step.gate);
    if (idxEl) idxEl.textContent = `${String(idx + 1).padStart(2, "0")}${step.mirror}`;
    if (rootPip) rootPip.dataset.level = String(step.gate);
    if (thirdPip) thirdPip.dataset.level = String(step.gate > 0 ? (step.mirror === "/" ? 2 : 1) : 0);
    if (fifthPip) fifthPip.dataset.level = String(step.gate === 2 ? 2 : (step.gate === 1 ? 1 : 0));
    if (labelEl) labelEl.textContent = step.label;
    if (byteEl) byteEl.textContent = `#${String(step.raw).padStart(3, "0")}`;
    button.setAttribute(
      "aria-label",
      `Mirror node ${idx + 1} (${step.mirror}): ${step.label}, stack ${step.raw}`,
    );
  }
}

function renderHarmonyGrid() {
  if (!elements.harmonyGrid) return;
  elements.harmonyGrid.innerHTML = "";
  for (let index = 0; index < 12; index += 1) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "beat-step harmony-step";
    button.dataset.step = String(index);
    button.innerHTML = `
      <span class="step-index">${String(index + 1).padStart(2, "0")}/</span>
      <span class="step-pips" aria-hidden="true">
        <span class="voice-pip pip-root" data-level="0"></span>
        <span class="voice-pip pip-third" data-level="0"></span>
        <span class="voice-pip pip-hat pip-fifth" data-level="0"></span>
      </span>
      <span class="step-trits">REST</span>
      <span class="cell-byte">#000</span>
    `;
    button.addEventListener("click", () => {
      if (!currentHarmony || !currentScore) return;
      const nextSteps = [...currentHarmony.steps];
      nextSteps[index] = cycleHarmonyCell(nextSteps[index], currentScore);
      currentHarmony = Object.freeze({
        ...currentHarmony,
        steps: Object.freeze(nextSteps),
      });
      updateHarmonyGrid();
      if (audioContext && currentTransport && !muted) {
        scheduleHarmonyStep(audioContext, currentTransport, currentScore, index, audioContext.currentTime + 0.01, 0.28);
      }
    });
    elements.harmonyGrid.append(button);
  }
}

const CODEL_SWATCHES = Object.freeze([
  ["#f38c8c", "#f3e28c", "#98eb98", "#8cebf3", "#98a9f3", "#eb98f3"],
  ["#cf4848", "#cfb83e", "#46b858", "#3eb8cf", "#4d66cf", "#b846cf"],
  ["#7d2222", "#7d6b1a", "#216e2d", "#1c6e7d", "#26367d", "#6e217d"],
]);

function updateChimeGrid() {
  if (!elements.chimeGrid) return;
  const steps = currentChimes?.steps || [];
  for (const button of elements.chimeGrid.querySelectorAll(".chime-step")) {
    const idx = Number(button.dataset.step);
    const step = steps[idx] || {
      gate: 0,
      codelCode: "LC",
      hueIndex: 3,
      lightnessIndex: 0,
      fraction: "35/6",
      exponents: { e2: 1, e3: 1, e5: 0, e7: 0 },
      label: "REST",
    };
    const idxEl = button.querySelector(".step-index");
    const p2Pip = button.querySelector(".pip-p2");
    const p3Pip = button.querySelector(".pip-p3");
    const p57Pip = button.querySelector(".pip-p57");
    const labelEl = button.querySelector(".step-trits");
    const byteEl = button.querySelector(".cell-byte");
    button.dataset.gate = String(step.gate);
    const swatch = CODEL_SWATCHES[step.lightnessIndex % 3]?.[step.hueIndex % 6] || "#8cebf3";
    button.style.setProperty("--codel-color", swatch);
    if (idxEl) idxEl.textContent = `${String(idx + 1).padStart(2, "0")}·${step.codelCode}`;
    if (p2Pip) p2Pip.dataset.level = String(step.gate === 0 ? 0 : Math.min(2, step.exponents.e2));
    if (p3Pip) p3Pip.dataset.level = String(step.gate === 0 ? 0 : Math.min(2, step.exponents.e3));
    if (p57Pip) p57Pip.dataset.level = String(step.gate === 0 ? 0 : Math.min(2, step.exponents.e5 + step.exponents.e7));
    if (labelEl) labelEl.textContent = step.label;
    if (byteEl) byteEl.textContent = step.fraction;
    button.setAttribute(
      "aria-label",
      `Codel ${idx + 1} (${step.codelCode}): ratio ${step.label}, fraction ${step.fraction}`,
    );
  }
}

function renderChimeGrid() {
  if (!elements.chimeGrid) return;
  elements.chimeGrid.innerHTML = "";
  for (let index = 0; index < 12; index += 1) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "beat-step chime-step";
    button.dataset.step = String(index);
    button.innerHTML = `
      <span class="step-index">${String(index + 1).padStart(2, "0")}·LC</span>
      <span class="step-pips" aria-hidden="true">
        <span class="voice-pip pip-p2" data-level="0"></span>
        <span class="voice-pip pip-p3" data-level="0"></span>
        <span class="voice-pip pip-hat pip-p57" data-level="0"></span>
      </span>
      <span class="step-trits">1/1 LC</span>
      <span class="cell-byte">35/6</span>
    `;
    button.addEventListener("click", () => {
      if (!currentChimes || !currentScore) return;
      const nextSteps = [...currentChimes.steps];
      nextSteps[index] = cycleChimeCell(nextSteps[index]);
      currentChimes = Object.freeze({
        ...currentChimes,
        steps: Object.freeze(nextSteps),
      });
      updateChimeGrid();
      if (audioContext && currentTransport && !muted) {
        scheduleChimeStep(audioContext, currentTransport, currentScore, index, audioContext.currentTime + 0.01, 0.3);
      }
    });
    elements.chimeGrid.append(button);
  }
}

function updateChantGrid() {
  if (!elements.chantGrid) return;
  const steps = currentChant?.steps || [];
  for (const button of elements.chantGrid.querySelectorAll(".chant-step")) {
    const idx = Number(button.dataset.step);
    const step = steps[idx] || {
      gate: 0,
      scene: `SCENE ${idx + 1}`,
      personaShort: "HAM",
      vowelIpa: "/ɑ/",
      f1: 730,
      f2: 1090,
      label: "SILENT",
    };
    const idxEl = button.querySelector(".step-index");
    const f1Pip = button.querySelector(".pip-f1");
    const f2Pip = button.querySelector(".pip-f2");
    const f3Pip = button.querySelector(".pip-f3");
    const labelEl = button.querySelector(".step-trits");
    const byteEl = button.querySelector(".cell-byte");
    button.dataset.gate = String(step.gate);
    if (idxEl) idxEl.textContent = step.scene.replace("SCENE ", "SC·");
    if (f1Pip) f1Pip.dataset.level = String(step.gate === 0 ? 0 : (step.f1 > 500 ? 2 : 1));
    if (f2Pip) f2Pip.dataset.level = String(step.gate === 0 ? 0 : (step.f2 > 1500 ? 2 : 1));
    if (f3Pip) f3Pip.dataset.level = String(step.gate === 2 ? 2 : (step.gate === 1 ? 1 : 0));
    if (labelEl) labelEl.textContent = step.label;
    if (byteEl) byteEl.textContent = step.vowelIpa;
    button.setAttribute(
      "aria-label",
      `${step.scene} (${step.personaShort}): ${step.label} ${step.vowelIpa}`,
    );
  }
}

function renderChantGrid() {
  if (!elements.chantGrid) return;
  elements.chantGrid.innerHTML = "";
  for (let index = 0; index < 12; index += 1) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "beat-step chant-step";
    button.dataset.step = String(index);
    button.innerHTML = `
      <span class="step-index">SC·${index + 1}</span>
      <span class="step-pips" aria-hidden="true">
        <span class="voice-pip pip-f1" data-level="0"></span>
        <span class="voice-pip pip-f2" data-level="0"></span>
        <span class="voice-pip pip-hat pip-f3" data-level="0"></span>
      </span>
      <span class="step-trits">HAM·AH</span>
      <span class="cell-byte">/ɑ/</span>
    `;
    button.addEventListener("click", () => {
      if (!currentChant || !currentScore) return;
      const nextSteps = [...currentChant.steps];
      nextSteps[index] = cycleChantCell(nextSteps[index], currentScore);
      currentChant = Object.freeze({
        ...currentChant,
        steps: Object.freeze(nextSteps),
      });
      updateChantGrid();
      if (audioContext && currentTransport && !muted) {
        scheduleChantStep(audioContext, currentTransport, currentScore, index, audioContext.currentTime + 0.01, 0.32);
      }
    });
    elements.chantGrid.append(button);
  }
}

function updateBandstandStatus() {
  if (!elements.bandstandStatus) return;
  const activeCount =
    1 +
    (beatEnabled ? 1 : 0) +
    (bassEnabled ? 1 : 0) +
    (harmonyEnabled ? 1 : 0) +
    (chimeEnabled ? 1 : 0) +
    (chantEnabled ? 1 : 0);
  if (activeCount === 6) {
    elements.bandstandStatus.textContent = "ALL SIX ESOTERIC PLAYERS ENGAGED";
  } else if (activeCount === 1) {
    elements.bandstandStatus.textContent = "SOLO LOLCODE BANDLEADER · ACCOMPANIMENT SILENCED";
  } else {
    elements.bandstandStatus.textContent = `${activeCount} OF 6 ESOTERIC PLAYERS ENGAGED`;
  }
}

renderBeatGrid();
renderBassGrid();
renderHarmonyGrid();
renderChimeGrid();
renderChantGrid();

async function playScore(score) {
  stopCurrentSound();
  vision.setScore(score);
  if (muted) {
    elements.status.textContent = "OMEN MUTED";
    return;
  }

  const context = await ensureAudioContext();
  const now = context.currentTime + 0.045;
  const initialPulse = activeTempoBpm || score.pulse;
  const initialUnit = 60 / initialPulse / 2;
  const mix = context.createGain();
  const beatBus = context.createGain();
  const bassBus = context.createGain();
  const harmonyBus = context.createGain();
  const chimeBus = context.createGain();
  const chantBus = context.createGain();
  const filter = context.createBiquadFilter();
  const compressor = context.createDynamicsCompressor();
  const delay = context.createDelay(1.5);
  const feedback = context.createGain();
  const output = context.createGain();
  const drones = [];
  const droneGains = [];
  const transport = {
    mix,
    beatBus,
    bassBus,
    harmonyBus,
    chimeBus,
    chantBus,
    filter,
    delay,
    feedback,
    output,
    drones,
    droneGains,
    melody: currentConductedMelody || melodyFor(score),
    timer: 0,
    nextNoteTime: now,
    step: 0,
  };
  currentTransport = transport;

  mix.gain.setValueAtTime(0.0001, now);
  mix.gain.exponentialRampToValueAtTime(0.28, now + 0.16);
  beatBus.gain.setValueAtTime(beatEnabled ? 0.82 : 0.0001, now);
  bassBus.gain.setValueAtTime(bassEnabled ? 0.84 : 0.0001, now);
  harmonyBus.gain.setValueAtTime(harmonyEnabled ? 0.78 : 0.0001, now);
  chimeBus.gain.setValueAtTime(chimeEnabled ? 0.8 : 0.0001, now);
  chantBus.gain.setValueAtTime(chantEnabled ? 0.82 : 0.0001, now);
  filter.type = ["lowpass", "bandpass", "lowpass", "lowpass", "lowpass", "bandpass"][score.voice];
  filter.frequency.value = 720 + score.bloom * 20 + score.hueShift * 1.6;
  filter.Q.value = 1.6 + score.edge / 28;
  compressor.threshold.value = -18;
  compressor.knee.value = 18;
  compressor.ratio.value = 5;
  delay.delayTime.value = Math.min(1.45, initialUnit * [1, 1.5, 0.75, 2, 1.25, 0.5][score.rhythm]);
  feedback.gain.value = 0.14 + score.bloom / 650;
  output.gain.value = masterGainFor(masterVolume);

  mix.connect(filter);
  harmonyBus.connect(filter);
  chimeBus.connect(delay);
  chimeBus.connect(compressor);
  chantBus.connect(delay);
  chantBus.connect(compressor);
  beatBus.connect(compressor);
  bassBus.connect(compressor);
  filter.connect(compressor).connect(output).connect(context.destination);
  filter.connect(delay);
  delay.connect(feedback).connect(delay);
  delay.connect(compressor);

  const droneIntervals = [-12, -5, 7];
  const initialDroneGains = [0.085, score.voice === 5 ? 0.035 : 0.018, 0.0001];
  for (const [index, interval] of droneIntervals.entries()) {
    const drone = context.createOscillator();
    const droneGain = context.createGain();
    drone.type = index === 0
      ? (score.waveform === "square" ? "triangle" : score.waveform)
      : "sine";
    drone.frequency.value = midiToFrequency(score.root + interval);
    drone.detune.value = [-5, 4, -3][index];
    droneGain.gain.value = initialDroneGains[index];
    drone.connect(droneGain).connect(mix);
    drone.start(now);
    drones.push(drone);
    droneGains.push(droneGain);
  }

  const scheduleAhead = () => {
    if (currentTransport !== transport) return;
    updateAudioInteraction();
    const rhythm = RHYTHMS[score.rhythm];
    while (transport.nextNoteTime < context.currentTime + 0.28) {
      const livePulse = activeTempoBpm || score.pulse;
      const unit = 60 / livePulse / 2;
      const currentStep = transport.step;
      const lengthMultiplier = rhythm[currentStep % rhythm.length];
      const stepDuration = unit * lengthMultiplier;
      const gateRatio = Math.min(0.94, score.gate / 100 + interaction.hold * 0.12);
      const soundingDuration = Math.max(0.06, stepDuration * gateRatio);
      scheduleNote(context, transport, score, currentStep, transport.nextNoteTime, soundingDuration);
      scheduleBeatStep(context, transport, score, currentStep, transport.nextNoteTime, stepDuration);
      scheduleBassStep(context, transport, score, currentStep, transport.nextNoteTime, stepDuration);
      scheduleHarmonyStep(context, transport, score, currentStep, transport.nextNoteTime, stepDuration);
      scheduleChimeStep(context, transport, score, currentStep, transport.nextNoteTime, stepDuration);
      scheduleChantStep(context, transport, score, currentStep, transport.nextNoteTime, stepDuration);
      const delayMs = Math.max(0, (transport.nextNoteTime - context.currentTime) * 1000);
      window.setTimeout(() => {
        if (currentTransport === transport) highlightBeatStep(currentStep);
      }, delayMs);
      transport.nextNoteTime += stepDuration;
      transport.step += 1;
    }
  };

  scheduleAhead();
  transport.timer = window.setInterval(scheduleAhead, 90);
  elements.status.textContent = "OMEN LOOPING";
}

let currentConductedMelody = null;

function applyEnsembleConductor() {
  if (!currentScore) return;
  const conducted = conductEnsemble({
    score: currentScore,
    melody: melodyFor(currentScore),
    beat: currentBeat,
    bass: currentBass,
    harmony: currentHarmony,
    chimes: currentChimes,
    chant: currentChant,
    mutation: harmonyMutation + bassMutation + chimeMutation + chantMutation,
  });
  currentConductedMelody = conducted.melody;
  if (conducted.bass) currentBass = conducted.bass;
  if (conducted.harmony) currentHarmony = conducted.harmony;
  if (conducted.chimes) currentChimes = conducted.chimes;
  if (conducted.chant) currentChant = conducted.chant;
  if (currentTransport) {
    currentTransport.melody = currentConductedMelody;
  }
}

function showScore(score) {
  currentScore = score;
  beatMutation = 0;
  bassMutation = 0;
  harmonyMutation = 0;
  chimeMutation = 0;
  chantMutation = 0;
  if (beatSource) {
    currentBeat = composeBeat(beatSource, score, beatMutation);
    if (elements.beatName) elements.beatName.textContent = currentBeat.modeName;
    if (elements.beatTelemetry) {
      elements.beatTelemetry.textContent = `3¹⁰ TAPE · ${currentBeat.stepsExecuted} OPS · DENSITY ${score.beatDensity}%`;
    }
    if (elements.beatMutate) elements.beatMutate.disabled = false;
  } else if (elements.beatName) {
    elements.beatName.textContent = BEAT_NAMES[score.beatMode];
  }
  if (bassSource) {
    currentBass = composeBass(bassSource, score, bassMutation);
    if (elements.bassName) elements.bassName.textContent = currentBass.modeName;
    if (elements.bassTelemetry) {
      elements.bassTelemetry.textContent = `256-CELL TAPE · ${currentBass.stepsExecuted} OPS · GLIDE ${score.bassGlide}%`;
    }
    if (elements.bassMutate) elements.bassMutate.disabled = false;
  } else if (elements.bassName) {
    elements.bassName.textContent = BASS_NAMES[score.bassMode];
  }
  if (harmonySource) {
    currentHarmony = composeHarmony(harmonySource, score, harmonyMutation);
    if (elements.harmonyName) elements.harmonyName.textContent = currentHarmony.modeName;
    if (elements.harmonyTelemetry) {
      elements.harmonyTelemetry.textContent = `2D TORUS · ${currentHarmony.stepsExecuted} OPS · ${currentHarmony.mirrorsHit} MIRRORS`;
    }
    if (elements.harmonyMutate) elements.harmonyMutate.disabled = false;
  } else if (elements.harmonyName) {
    elements.harmonyName.textContent = HARMONY_NAMES[score.harmonyMode];
  }
  if (pietSource && fractranSource) {
    currentChimes = composeChimes(pietSource, fractranSource, score, chimeMutation);
    if (elements.chimeName) elements.chimeName.textContent = currentChimes.modeName;
    if (elements.chimeTelemetry) {
      elements.chimeTelemetry.textContent = `${currentChimes.pietStepsExecuted} CODELS · ${currentChimes.fractranStepsExecuted} FRACTRAN RATIOS · SHIMMER ${score.chimeShimmer}%`;
    }
    if (elements.chimeMutate) elements.chimeMutate.disabled = false;
  } else if (elements.chimeName) {
    elements.chimeName.textContent = CHIME_NAMES[score.chimeMode];
  }
  if (chantSource) {
    currentChant = composeChant(chantSource, score, chantMutation);
    if (elements.chantName) elements.chantName.textContent = currentChant.modeName;
    if (elements.chantTelemetry) {
      elements.chantTelemetry.textContent = `3 ACTS · ${currentChant.statementsExecuted} CUES · FORMANT ${score.chantFormant}%`;
    }
    if (elements.chantMutate) elements.chantMutate.disabled = false;
  } else if (elements.chantName) {
    elements.chantName.textContent = CHANT_NAMES[score.chantMode];
  }
  applyEnsembleConductor();
  updateBeatGrid();
  updateBassGrid();
  updateHarmonyGrid();
  updateChimeGrid();
  updateChantGrid();
  if (elements.bandstandMutateAll) elements.bandstandMutateAll.disabled = false;
  updateBandstandStatus();
  elements.name.textContent = score.name;
  setTempoBpm(score.pulse);
  elements.wave.textContent = WAVEFORMS[score.wave];
  elements.formValue.textContent = score.shapeName;
  elements.melody.textContent = MELODY_NAMES[score.melodyMode];
  elements.replay.disabled = false;
  if (elements.shareLink) elements.shareLink.disabled = false;
  if (elements.exportPng) elements.exportPng.disabled = false;
  try {
    const nextHash = encodeOmenHash(score.phrase);
    if (window.location.hash !== nextHash) {
      window.history.replaceState(null, "", nextHash);
    }
  } catch {
    // Non-standard history environments continue without mutating location.
  }
}

async function summon(phrase, { playAudio = true } = {}) {
  if (!oracleSource) {
    elements.status.textContent = "SPELL UNAVAILABLE";
    return;
  }

  try {
    const score = composeScore(oracleSource, phrase);
    showScore(score);
    if (playAudio) {
      await playScore(score);
    } else {
      elements.status.textContent = "OMEN RESTORED FROM LINK · PRESS SUMMON OR REPLAY FOR SOUND";
    }
  } catch (error) {
    elements.status.textContent = "THE ORACLE COUGHED";
    console.error(error);
  }
}

function wrapCanvasText(ctx, text, maxWidth) {
  const words = String(text).split(/\s+/).filter(Boolean);
  if (words.length === 0) return [""];
  const lines = [words[0]];
  for (let i = 1; i < words.length; i += 1) {
    const candidate = `${lines[lines.length - 1]} ${words[i]}`;
    if (ctx.measureText(candidate).width <= maxWidth) {
      lines[lines.length - 1] = candidate;
    } else {
      lines.push(words[i]);
    }
  }
  return lines;
}

function renderSpecimenBroadsheetCanvas(score) {
  const width = 1200;
  const height = 1520;
  const plate = document.createElement("canvas");
  plate.width = width;
  plate.height = height;
  const pctx = plate.getContext("2d");

  pctx.fillStyle = "#120e0c";
  pctx.fillRect(0, 0, width, height);

  const paperGrad = pctx.createLinearGradient(0, 36, 0, height - 36);
  paperGrad.addColorStop(0, "#ede0c8");
  paperGrad.addColorStop(0.5, "#e4d2b4");
  paperGrad.addColorStop(1, "#d8c3a0");
  pctx.fillStyle = paperGrad;
  pctx.fillRect(38, 38, width - 76, height - 76);

  pctx.strokeStyle = "#6b1f28";
  pctx.lineWidth = 3;
  pctx.strokeRect(52, 52, width - 104, height - 104);
  pctx.strokeStyle = "#b89249";
  pctx.lineWidth = 1.5;
  pctx.strokeRect(60, 60, width - 120, height - 120);

  const corners = [
    [76, 76],
    [width - 76, 76],
    [76, height - 76],
    [width - 76, height - 76],
  ];
  for (const [cx, cy] of corners) {
    pctx.save();
    pctx.strokeStyle = "#6b1f28";
    pctx.lineWidth = 1.4;
    pctx.beginPath();
    pctx.arc(cx, cy, 10, 0, Math.PI * 2);
    pctx.stroke();
    pctx.fillStyle = "#b89249";
    pctx.beginPath();
    pctx.arc(cx, cy, 3.5, 0, Math.PI * 2);
    pctx.fill();
    pctx.restore();
  }

  pctx.textAlign = "center";
  pctx.fillStyle = "#6b1f28";
  pctx.font = '700 15px "Courier New", Courier, monospace';
  pctx.fillText("❧ THE SOCIETY FOR QUESTIONABLE SPIRITUALISM & HARMONIC AUTOMATA ❧", width * 0.5, 104);

  const seedHex = (score.seed >>> 0).toString(16).toUpperCase().padStart(8, "0");
  pctx.fillStyle = "#1b1512";
  pctx.font = '700 34px "Palatino Linotype", "Book Antiqua", Palatino, Georgia, serif';
  pctx.fillText("HAI, ORACLE! — SPECIMEN BROADSHEET", width * 0.5, 146);

  pctx.fillStyle = "#57483e";
  pctx.font = '600 14px "Courier New", Courier, monospace';
  pctx.fillText(`FOLIO XVII · SEED 0x${seedHex} · DETERMINISTIC AUDIOVISUAL OMEN`, width * 0.5, 174);

  const vitrineX = 96;
  const vitrineY = 200;
  const vitrineW = width - 192;
  const vitrineH = 560;

  const stageGrad = pctx.createRadialGradient(
    width * 0.5,
    vitrineY + vitrineH * 0.5,
    30,
    width * 0.5,
    vitrineY + vitrineH * 0.5,
    vitrineW * 0.55,
  );
  stageGrad.addColorStop(0, "#1c1512");
  stageGrad.addColorStop(0.7, "#110d0b");
  stageGrad.addColorStop(1, "#090706");
  pctx.fillStyle = stageGrad;
  pctx.fillRect(vitrineX, vitrineY, vitrineW, vitrineH);

  pctx.strokeStyle = "#b89249";
  pctx.lineWidth = 2.5;
  pctx.strokeRect(vitrineX, vitrineY, vitrineW, vitrineH);
  pctx.strokeStyle = "rgba(218, 181, 107, 0.35)";
  pctx.lineWidth = 1;
  pctx.strokeRect(vitrineX + 8, vitrineY + 8, vitrineW - 16, vitrineH - 16);

  pctx.save();
  pctx.strokeStyle = "rgba(218, 181, 107, 0.26)";
  pctx.setLineDash([4, 8]);
  pctx.beginPath();
  pctx.arc(width * 0.5, vitrineY + vitrineH * 0.5, 210, 0, Math.PI * 2);
  pctx.stroke();
  pctx.setLineDash([]);
  pctx.beginPath();
  pctx.arc(width * 0.5, vitrineY + vitrineH * 0.5, 168, 0, Math.PI * 2);
  pctx.stroke();
  pctx.restore();

  if (elements.canvas.width > 0 && elements.canvas.height > 0) {
    const scale = Math.min(vitrineW / elements.canvas.width, vitrineH / elements.canvas.height);
    const drawW = elements.canvas.width * scale;
    const drawH = elements.canvas.height * scale;
    const drawX = vitrineX + (vitrineW - drawW) * 0.5;
    const drawY = vitrineY + (vitrineH - drawH) * 0.5;
    pctx.drawImage(elements.canvas, drawX, drawY, drawW, drawH);
  }

  pctx.fillStyle = "#dab56b";
  pctx.font = '700 13px "Courier New", Courier, monospace';
  pctx.textAlign = "left";
  pctx.fillText("PLATE I · LIVE SPECIMEN CAPTURE", vitrineX + 22, vitrineY + 30);
  pctx.textAlign = "right";
  pctx.fillText(`BELL JAR Nº 01 · ${score.shapeName}`, vitrineX + vitrineW - 22, vitrineY + 30);

  const bannerY = 788;
  pctx.fillStyle = "#16110e";
  pctx.fillRect(96, bannerY, width - 192, 232);
  pctx.strokeStyle = "#b89249";
  pctx.lineWidth = 2;
  pctx.strokeRect(96, bannerY, width - 192, 232);

  pctx.textAlign = "center";
  pctx.fillStyle = "#dab56b";
  pctx.font = '700 13px "Courier New", Courier, monospace';
  pctx.fillText("CATALOGUED MANIFESTATION", width * 0.5, bannerY + 32);

  pctx.fillStyle = "#faf3e6";
  pctx.font = '700 32px "Palatino Linotype", "Book Antiqua", Palatino, Georgia, serif';
  const nameLines = wrapCanvasText(pctx, score.name, width - 260).slice(0, 2);
  nameLines.forEach((line, idx) => {
    pctx.fillText(line, width * 0.5, bannerY + 74 + idx * 38);
  });

  const phraseY = bannerY + (nameLines.length > 1 ? 150 : 128);
  pctx.fillStyle = "#e4d2b4";
  pctx.font = 'italic 600 22px "Palatino Linotype", "Book Antiqua", Palatino, Georgia, serif';
  const quotedPhrase = `“${score.phrase}”`;
  const phraseLines = wrapCanvasText(pctx, quotedPhrase, width - 260).slice(0, 2);
  phraseLines.forEach((line, idx) => {
    pctx.fillText(line, width * 0.5, phraseY + idx * 28);
  });

  pctx.fillStyle = "#b89249";
  pctx.font = '700 13px "Courier New", Courier, monospace';
  pctx.fillText("CONFIDED PHRASE INSCRIBED UPON THE CALLING SLIP", width * 0.5, bannerY + 212);

  const gridY = 1044;
  const colW = (width - 212) / 2;
  const rowH = 110;
  const plates = [
    {
      plate: "PLATE I · LOLCODE 1.2 SCORE SPELL",
      title: `${MELODY_NAMES[score.melodyMode]} (${score.pulse} BPM)`,
      detail: `WAVE: ${WAVEFORMS[score.wave]} · FORM: ${score.shapeName}`,
    },
    {
      plate: "PLATE II · MALBOLGE 1998 TERNARY DRUMS",
      title: currentBeat ? currentBeat.modeName : BEAT_NAMES[score.beatMode],
      detail: `3¹⁰ TAPE · DENSITY ${score.beatDensity}% · 12-STEP CRAZY/ROTR`,
    },
    {
      plate: "PLATE III · BRAINFUCK 1993 WALKING BASS",
      title: currentBass ? currentBass.modeName : BASS_NAMES[score.bassMode],
      detail: `256-CELL TAPE · GLIDE ${score.bassGlide}% · [->+<] SHUTTLE`,
    },
    {
      plate: "PLATE IV · BEFUNGE-93 2D MIRROR ORGAN",
      title: currentHarmony ? currentHarmony.modeName : HARMONY_NAMES[score.harmonyMode],
      detail: `80×25 TORUS · STRUM ${score.harmonyStrum}% · /\\ MIRROR TRIADS`,
    },
    {
      plate: "PLATE V · PIET & FRACTRAN CHIMES",
      title: currentChimes ? currentChimes.modeName : CHIME_NAMES[score.chimeMode],
      detail: `2ᵃ3ᵇ5ᶜ7ᵈ PRIME RATIOS · SHIMMER ${score.chimeShimmer}% · 18 CODELS`,
    },
    {
      plate: "PLATE VI · SHAKESPEARE VOWEL CHOIR",
      title: currentChant ? currentChant.modeName : CHANT_NAMES[score.chantMode],
      detail: `3 ACTS · 12 SCENES · FORMANT ${score.chantFormant}% · A-E-I-O-U VODER`,
    },
  ];

  plates.forEach((entry, index) => {
    const col = index % 2;
    const row = Math.floor(index / 2);
    const boxX = 96 + col * (colW + 20);
    const boxY = gridY + row * (rowH + 14);

    pctx.fillStyle = "#18120f";
    pctx.fillRect(boxX, boxY, colW, rowH);
    pctx.strokeStyle = "#8d6b32";
    pctx.lineWidth = 1.5;
    pctx.strokeRect(boxX, boxY, colW, rowH);

    pctx.textAlign = "left";
    pctx.fillStyle = "#dab56b";
    pctx.font = '700 12px "Courier New", Courier, monospace';
    pctx.fillText(entry.plate, boxX + 18, boxY + 28);

    pctx.fillStyle = "#faf3e6";
    pctx.font = '700 20px "Palatino Linotype", "Book Antiqua", Palatino, Georgia, serif';
    pctx.fillText(entry.title, boxX + 18, boxY + 58);

    pctx.fillStyle = "#c8b698";
    pctx.font = '600 12px "Courier New", Courier, monospace';
    pctx.fillText(entry.detail, boxX + 18, boxY + 86);
  });

  pctx.textAlign = "center";
  pctx.fillStyle = "#4b382d";
  pctx.font = '700 13px "Courier New", Courier, monospace';
  pctx.fillText(
    `SHARE SEAL: ${encodeOmenHash(score.phrase)} · ZERO-DEPENDENCY LOCAL BROWSER SYNTHESIS`,
    width * 0.5,
    height - 74,
  );

  return plate;
}

async function copyShareLink() {
  if (!currentScore) return;
  const shareUrl = buildShareUrl(window.location.href, currentScore.phrase);
  let copied = false;
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(shareUrl);
      copied = true;
    } catch {
      copied = false;
    }
  }
  if (!copied) {
    const helper = document.createElement("textarea");
    helper.value = shareUrl;
    helper.setAttribute("readonly", "");
    helper.style.position = "fixed";
    helper.style.opacity = "0";
    document.body.appendChild(helper);
    helper.select();
    try {
      copied = document.execCommand("copy");
    } catch {
      copied = false;
    }
    helper.remove();
  }
  elements.status.textContent = copied ? "OMEN LINK COPIED TO CLIPBOARD" : "OMEN LINK SEALED IN ADDRESS BAR";
  if (elements.shareLink) {
    const original = elements.shareLink.innerHTML;
    elements.shareLink.textContent = copied ? "LINK COPIED ✦" : "LINK IN URL BAR ✦";
    window.setTimeout(() => {
      if (elements.shareLink) elements.shareLink.innerHTML = original;
    }, 1800);
  }
}

function exportSpecimenPng() {
  if (!currentScore) return;
  const plate = renderSpecimenBroadsheetCanvas(currentScore);
  const filename = specimenFilenameFor(currentScore);
  const triggerDownload = (href, revokeAfter = false) => {
    const anchor = document.createElement("a");
    anchor.href = href;
    anchor.download = filename;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    if (revokeAfter) {
      window.setTimeout(() => URL.revokeObjectURL(href), 1500);
    }
    elements.status.textContent = "SPECIMEN PLATE ENGRAVED (PNG)";
  };

  if (typeof plate.toBlob === "function") {
    plate.toBlob((blob) => {
      if (blob) {
        triggerDownload(URL.createObjectURL(blob), true);
      } else {
        triggerDownload(plate.toDataURL("image/png"));
      }
    }, "image/png");
  } else {
    triggerDownload(plate.toDataURL("image/png"));
  }
}

function vitrineCoordinates(event) {
  const rect = elements.canvas.getBoundingClientRect();
  const x = ((event.clientX - rect.left) / Math.max(1, rect.width)) * 2 - 1;
  const y = ((event.clientY - rect.top) / Math.max(1, rect.height)) * 2 - 1;
  return {
    x: Math.max(-1, Math.min(1, x)),
    y: Math.max(-1, Math.min(1, y)),
  };
}

const stageContainer = elements.canvas.closest(".vision-stage");

elements.canvas.addEventListener("pointerdown", async (event) => {
  if (event.button !== undefined && event.button !== 0) return;
  const coords = vitrineCoordinates(event);
  interaction.active = true;
  interaction.pointerId = event.pointerId;
  interaction.x = coords.x;
  interaction.y = coords.y;
  interaction.smoothX = coords.x;
  interaction.smoothY = coords.y;
  interaction.tap = 1;
  interaction.hold = Math.max(interaction.hold, 0.35);
  interaction.dragTravel = Math.floor((((Math.atan2(coords.y, coords.x) + Math.PI) / (Math.PI * 2)) * 12)) % 12;
  interaction.pitchBend = -coords.y;
  interaction.ripples.push({ x: coords.x, y: coords.y, bornAt: performance.now(), strength: 1 });
  stageContainer?.classList.add("is-interacting");
  try {
    elements.canvas.setPointerCapture(event.pointerId);
  } catch {
    // Synthetic or non-capturable pointers safely continue without capture.
  }

  if (!currentScore && oracleSource) {
    const initialPhrase = elements.phrase.value.trim() || SURPRISES[0];
    elements.phrase.value = initialPhrase;
    await summon(initialPhrase);
  } else if (currentScore && !currentTransport && !muted) {
    await playScore(currentScore);
  }

  updateAudioInteraction();
  triggerPercussion("strike", coords.x, coords.y, 1);
  if (!muted) {
    elements.status.textContent = "VITRINE DISTURBED";
  }
});

elements.canvas.addEventListener("pointermove", (event) => {
  if (!interaction.active || event.pointerId !== interaction.pointerId) return;
  const coords = vitrineCoordinates(event);
  const dx = coords.x - interaction.x;
  const dy = coords.y - interaction.y;
  const delta = Math.hypot(dx, dy);
  interaction.x = coords.x;
  interaction.y = coords.y;
  interaction.dragSpeed = Math.min(1, interaction.dragSpeed + delta * 2.8);
  interaction.pitchBend = -coords.y;
  updateAudioInteraction();

  const now = performance.now();
  const sector = Math.floor((((Math.atan2(coords.y, coords.x) + Math.PI) / (Math.PI * 2)) * 12)) % 12;
  if (sector !== interaction.dragTravel && now - interaction.lastTickAt > 140) {
    interaction.dragTravel = sector;
    interaction.lastTickAt = now;
    interaction.ripples.push({ x: coords.x, y: coords.y, bornAt: now, strength: 0.55 });
    triggerPercussion("ratchet", coords.x, coords.y, Math.min(0.85, 0.4 + interaction.dragSpeed * 0.45));
  }
});

function endVitrineInteraction(event) {
  if (!interaction.active) return;
  if (event?.pointerId !== undefined && interaction.pointerId !== null && event.pointerId !== interaction.pointerId) {
    return;
  }
  interaction.active = false;
  interaction.pointerId = null;
  stageContainer?.classList.remove("is-interacting");
  if (currentTransport && !muted) {
    elements.status.textContent = "OMEN LOOPING";
  }
}

elements.canvas.addEventListener("pointerup", endVitrineInteraction);
elements.canvas.addEventListener("pointercancel", endVitrineInteraction);
elements.canvas.addEventListener("lostpointercapture", endVitrineInteraction);

function setBandPlayersEnabled(nextState) {
  beatEnabled = nextState;
  bassEnabled = nextState;
  harmonyEnabled = nextState;
  chimeEnabled = nextState;
  chantEnabled = nextState;
  if (elements.beatToggle) {
    elements.beatToggle.setAttribute("aria-pressed", String(beatEnabled));
    elements.beatToggle.textContent = beatEnabled ? "PULSE: ENGAGED" : "PULSE: SILENCED";
  }
  if (elements.bassToggle) {
    elements.bassToggle.setAttribute("aria-pressed", String(bassEnabled));
    elements.bassToggle.textContent = bassEnabled ? "BASS: ENGAGED" : "BASS: SILENCED";
  }
  if (elements.harmonyToggle) {
    elements.harmonyToggle.setAttribute("aria-pressed", String(harmonyEnabled));
    elements.harmonyToggle.textContent = harmonyEnabled ? "ORGAN: ENGAGED" : "ORGAN: SILENCED";
  }
  if (elements.chimeToggle) {
    elements.chimeToggle.setAttribute("aria-pressed", String(chimeEnabled));
    elements.chimeToggle.textContent = chimeEnabled ? "CHIMES: ENGAGED" : "CHIMES: SILENCED";
  }
  if (elements.chantToggle) {
    elements.chantToggle.setAttribute("aria-pressed", String(chantEnabled));
    elements.chantToggle.textContent = chantEnabled ? "CHOIR: ENGAGED" : "CHOIR: SILENCED";
  }
  if (audioContext && currentTransport) {
    const now = audioContext.currentTime;
    currentTransport.beatBus?.gain.setTargetAtTime(beatEnabled ? 0.82 : 0.0001, now, 0.025);
    currentTransport.bassBus?.gain.setTargetAtTime(bassEnabled ? 0.84 : 0.0001, now, 0.025);
    currentTransport.harmonyBus?.gain.setTargetAtTime(harmonyEnabled ? 0.78 : 0.0001, now, 0.025);
    currentTransport.chimeBus?.gain.setTargetAtTime(chimeEnabled ? 0.8 : 0.0001, now, 0.025);
    currentTransport.chantBus?.gain.setTargetAtTime(chantEnabled ? 0.82 : 0.0001, now, 0.025);
  }
  updateBandstandStatus();
}

elements.beatToggle?.addEventListener("click", () => {
  beatEnabled = !beatEnabled;
  elements.beatToggle.setAttribute("aria-pressed", String(beatEnabled));
  elements.beatToggle.textContent = beatEnabled ? "PULSE: ENGAGED" : "PULSE: SILENCED";
  if (audioContext && currentTransport?.beatBus) {
    const now = audioContext.currentTime;
    currentTransport.beatBus.gain.cancelScheduledValues(now);
    currentTransport.beatBus.gain.setTargetAtTime(beatEnabled ? 0.82 : 0.0001, now, 0.025);
  }
  updateBandstandStatus();
});

elements.beatMutate?.addEventListener("click", () => {
  if (!currentScore || !beatSource) return;
  beatMutation += 1;
  currentBeat = composeBeat(beatSource, currentScore, beatMutation);
  applyEnsembleConductor();
  if (elements.beatTelemetry) {
    elements.beatTelemetry.textContent = `3¹⁰ TAPE · ${currentBeat.stepsExecuted} OPS · MUTATION #${beatMutation}`;
  }
  updateBeatGrid();
  updateBassGrid();
});

elements.bassToggle?.addEventListener("click", () => {
  bassEnabled = !bassEnabled;
  elements.bassToggle.setAttribute("aria-pressed", String(bassEnabled));
  elements.bassToggle.textContent = bassEnabled ? "BASS: ENGAGED" : "BASS: SILENCED";
  if (audioContext && currentTransport?.bassBus) {
    const now = audioContext.currentTime;
    currentTransport.bassBus.gain.cancelScheduledValues(now);
    currentTransport.bassBus.gain.setTargetAtTime(bassEnabled ? 0.84 : 0.0001, now, 0.025);
  }
  updateBandstandStatus();
});

elements.bassMutate?.addEventListener("click", () => {
  if (!currentScore || !bassSource) return;
  bassMutation += 1;
  currentBass = composeBass(bassSource, currentScore, bassMutation);
  applyEnsembleConductor();
  if (elements.bassTelemetry) {
    elements.bassTelemetry.textContent = `256-CELL TAPE · ${currentBass.stepsExecuted} OPS · SHIFT #${bassMutation}`;
  }
  updateBassGrid();
});

elements.harmonyToggle?.addEventListener("click", () => {
  harmonyEnabled = !harmonyEnabled;
  elements.harmonyToggle.setAttribute("aria-pressed", String(harmonyEnabled));
  elements.harmonyToggle.textContent = harmonyEnabled ? "ORGAN: ENGAGED" : "ORGAN: SILENCED";
  if (audioContext && currentTransport?.harmonyBus) {
    const now = audioContext.currentTime;
    currentTransport.harmonyBus.gain.cancelScheduledValues(now);
    currentTransport.harmonyBus.gain.setTargetAtTime(harmonyEnabled ? 0.78 : 0.0001, now, 0.025);
  }
  updateBandstandStatus();
});

elements.harmonyMutate?.addEventListener("click", () => {
  if (!currentScore || !harmonySource) return;
  harmonyMutation += 1;
  currentHarmony = composeHarmony(harmonySource, currentScore, harmonyMutation);
  applyEnsembleConductor();
  if (elements.harmonyTelemetry) {
    elements.harmonyTelemetry.textContent = `2D TORUS · ${currentHarmony.stepsExecuted} OPS · DEFLECTION #${harmonyMutation}`;
  }
  updateHarmonyGrid();
  updateBassGrid();
  updateChimeGrid();
  updateChantGrid();
});

elements.chimeToggle?.addEventListener("click", () => {
  chimeEnabled = !chimeEnabled;
  elements.chimeToggle.setAttribute("aria-pressed", String(chimeEnabled));
  elements.chimeToggle.textContent = chimeEnabled ? "CHIMES: ENGAGED" : "CHIMES: SILENCED";
  if (audioContext && currentTransport?.chimeBus) {
    const now = audioContext.currentTime;
    currentTransport.chimeBus.gain.cancelScheduledValues(now);
    currentTransport.chimeBus.gain.setTargetAtTime(chimeEnabled ? 0.8 : 0.0001, now, 0.025);
  }
  updateBandstandStatus();
});

elements.chimeMutate?.addEventListener("click", () => {
  if (!currentScore || !pietSource || !fractranSource) return;
  chimeMutation += 1;
  currentChimes = composeChimes(pietSource, fractranSource, currentScore, chimeMutation);
  applyEnsembleConductor();
  if (elements.chimeTelemetry) {
    elements.chimeTelemetry.textContent = `${currentChimes.pietStepsExecuted} CODELS · ${currentChimes.fractranStepsExecuted} RATIOS · REFRACTION #${chimeMutation}`;
  }
  updateChimeGrid();
});

elements.chantToggle?.addEventListener("click", () => {
  chantEnabled = !chantEnabled;
  elements.chantToggle.setAttribute("aria-pressed", String(chantEnabled));
  elements.chantToggle.textContent = chantEnabled ? "CHOIR: ENGAGED" : "CHOIR: SILENCED";
  if (audioContext && currentTransport?.chantBus) {
    const now = audioContext.currentTime;
    currentTransport.chantBus.gain.cancelScheduledValues(now);
    currentTransport.chantBus.gain.setTargetAtTime(chantEnabled ? 0.82 : 0.0001, now, 0.025);
  }
  updateBandstandStatus();
});

elements.chantMutate?.addEventListener("click", () => {
  if (!currentScore || !chantSource) return;
  chantMutation += 1;
  currentChant = composeChant(chantSource, currentScore, chantMutation);
  applyEnsembleConductor();
  if (elements.chantTelemetry) {
    elements.chantTelemetry.textContent = `3 ACTS · ${currentChant.statementsExecuted} CUES · RECAST #${chantMutation}`;
  }
  updateChantGrid();
});

elements.bandstandEngageAll?.addEventListener("click", () => {
  setBandPlayersEnabled(true);
});

elements.bandstandSoloLead?.addEventListener("click", () => {
  setBandPlayersEnabled(false);
});

elements.bandstandMutateAll?.addEventListener("click", () => {
  if (!currentScore) return;
  elements.beatMutate?.click();
  elements.bassMutate?.click();
  elements.harmonyMutate?.click();
  elements.chimeMutate?.click();
  elements.chantMutate?.click();
  if (elements.bandstandTelemetry) {
    elements.bandstandTelemetry.textContent = `ENSEMBLE JAM MUTATION #${beatMutation} APPLIED ACROSS ALL PLATES`;
  }
});

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

elements.shareLink?.addEventListener("click", () => {
  copyShareLink();
});

elements.exportPng?.addEventListener("click", () => {
  exportSpecimenPng();
});

window.addEventListener("hashchange", () => {
  const hashPhrase = decodeOmenHash(window.location.hash);
  if (hashPhrase && (!currentScore || currentScore.phrase !== hashPhrase)) {
    elements.phrase.value = hashPhrase;
    summon(hashPhrase, { playAudio: Boolean(audioContext && !muted) });
  }
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

elements.volume.addEventListener("input", (event) => {
  setMasterVolume(event.currentTarget.value);
});

elements.tempo?.addEventListener("input", (event) => {
  setTempoBpm(event.currentTarget.value);
});

elements.tempo?.addEventListener("dblclick", () => {
  if (currentScore) {
    setTempoBpm(currentScore.pulse);
  }
});

try {
  const [oracleResponse, beatResponse, bassResponse, harmonyResponse, pietResponse, fractranResponse, chantResponse] = await Promise.all([
    fetch("src/oracle.lol"),
    fetch("src/beat.mal"),
    fetch("src/bass.bf"),
    fetch("src/harmony.bfg"),
    fetch("src/pad.piet"),
    fetch("src/chimes.frac"),
    fetch("src/chant.spl"),
  ]);
  if (!oracleResponse.ok) throw new Error(`Oracle source returned ${oracleResponse.status}`);
  if (!beatResponse.ok) throw new Error(`Malbolge source returned ${beatResponse.status}`);
  if (!bassResponse.ok) throw new Error(`Brainfuck source returned ${bassResponse.status}`);
  if (!harmonyResponse.ok) throw new Error(`Befunge source returned ${harmonyResponse.status}`);
  if (!pietResponse.ok) throw new Error(`Piet source returned ${pietResponse.status}`);
  if (!fractranResponse.ok) throw new Error(`FRACTRAN source returned ${fractranResponse.status}`);
  if (!chantResponse.ok) throw new Error(`Shakespeare source returned ${chantResponse.status}`);
  [oracleSource, beatSource, bassSource, harmonySource, pietSource, fractranSource, chantSource] = await Promise.all([
    oracleResponse.text(),
    beatResponse.text(),
    bassResponse.text(),
    harmonyResponse.text(),
    pietResponse.text(),
    fractranResponse.text(),
    chantResponse.text(),
  ]);
  const initialHashPhrase = decodeOmenHash(window.location.hash);
  if (initialHashPhrase) {
    elements.phrase.value = initialHashPhrase;
    await summon(initialHashPhrase, { playAudio: false });
  } else {
    elements.status.textContent = "AWAITING INPUT";
  }
} catch (error) {
  elements.status.textContent = "SERVE THIS DIRECTORY OVER HTTP";
  console.error(error);
}
