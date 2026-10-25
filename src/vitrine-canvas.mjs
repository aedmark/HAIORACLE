export const interaction = {
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
  dragDistance: 0,
  morphPhase: 0,
  pitchBend: 0,
  lastFrameAt: 0,
  lastTickAt: 0,
  ripples: [],
  agitation: 0,
  tapStreak: 0,
  lastTapAt: 0,
  retaliateUntil: 0,
  cooldownUntil: 0,
  retaliationFlash: 0,
  retaliationPitchDrop: 0,
  lunge: 0,
  sulk: 0,
  retaliationPoint: { x: 0, y: 0 },
  retaliationFractures: [],
};

export function mulberry32(seed) {
  let state = seed >>> 0;
  return () => {
    state += 0x6d2b79f5;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

export function wrapHue(hue) {
  return ((hue % 360) + 360) % 360;
}

export function paletteFor(score) {
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

export function shapeFamilyRadius(shape, symmetry, edge, twist, angle) {
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

export function shapeRadius(score, angle, elapsed) {
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
    const directionalPull = Math.cos(angle - pointerAngle) * pointerReach * (interaction.hold * 0.22 + interaction.dragSpeed * 0.18);
    const harmonicPinch = Math.cos((angle - pointerAngle) * (2 + (score.symmetry % 4)) + interaction.morphPhase) * (interaction.tap * 0.08 + interaction.hold * 0.06);
    radius += directionalPull + harmonicPinch;
  }
  return Math.max(0.38, Math.min(1.08, radius + fluxOffset(score, angle, elapsed)));
}

export function fluxOffset(score, angle, elapsed) {
  const speed = 0.12 + score.kineticSpeed / 92;
  const time = elapsed * speed + interaction.morphPhase * 1.35 + score.kineticTilt / 8 * Math.PI * 2;
  const depth = (0.022 + score.kineticDepth / 100 * 0.095) * (1 + interaction.hold * 0.75 + interaction.dragSpeed * 0.6);
  const tapWave = Math.sin(angle * (score.symmetry + 5) - elapsed * 10.5) * interaction.tap * 0.068;
  const agitationWave = (interaction.agitation || 0) * Math.sin(angle * 13 + elapsed * 32) * 0.032;
  const perturbation = tapWave + agitationWave;
  switch (score.fluxMode) {
    case 0: return Math.sin(angle * score.twist - time) * depth + perturbation;
    case 1: return Math.sin(angle * score.symmetry + time) * Math.cos(angle * score.twist - time * 0.63) * depth + perturbation;
    case 2: return Math.sin(angle * 2 + time) * Math.sin(angle * (score.symmetry + 1) - time * 0.8) * depth + perturbation;
    case 3: return Math.tanh(Math.sin(angle * score.symmetry - time) * 3) * depth * 0.82 + perturbation;
    case 4: {
      const morph = (Math.sin(time * 0.55) + 1) / 2;
      return (Math.cos(angle * score.symmetry) * (1 - morph) + Math.cos(angle * (score.symmetry + 1)) * morph) * depth + perturbation;
    }
    case 5: return (Math.sin(angle * 3 - time) * 0.55 + Math.sin(angle * 7 + time * 0.73) * 0.3 + Math.cos(angle * 11 - time * 0.41) * 0.15) * depth + perturbation;
    case 6: return Math.sin(angle + Math.sin(time) * 1.4) * Math.cos(angle * score.twist - time) * depth + perturbation;
    case 7: return Math.sin(angle * score.symmetry - time) ** 3 * depth + perturbation;
    default: return perturbation;
  }
}

export function traceBody(ctx, score, base, elapsed, points) {
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

export function projectedTesseract(score, base, elapsed) {
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

export function drawKineticCore(ctx, score, base, elapsed, colors) {
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

export function traceAppendageSilhouette(ctx, shape, size) {
  ctx.beginPath();
  switch (shape) {
    case 0: // Sporangium Globule
      ctx.moveTo(0, -size * 1.35);
      ctx.bezierCurveTo(size * 1.25, -size * 1.05, size * 1.2, size * 0.85, 0, size * 1.15);
      ctx.bezierCurveTo(-size * 1.2, size * 0.85, -size * 1.25, -size * 1.05, 0, -size * 1.35);
      ctx.closePath();
      break;
    case 1: // Ciliated Flagellum / Tentacle
      ctx.moveTo(-size * 0.45, size * 1.4);
      ctx.quadraticCurveTo(-size * 0.8, 0, -size * 0.25, -size * 1.5);
      ctx.arc(0, -size * 1.5, size * 0.35, Math.PI, 0);
      ctx.quadraticCurveTo(size * 0.8, 0, size * 0.45, size * 1.4);
      ctx.closePath();
      break;
    case 2: // Bioluminescent Vacuole / Cellular Nucleus
      ctx.arc(0, 0, size * 1.15, 0, Math.PI * 2);
      break;
    case 3: // Ascus Spore-Sac
      ctx.moveTo(0, -size * 1.65);
      ctx.bezierCurveTo(size * 0.65, -size * 1.1, size * 0.65, size * 1.1, 0, size * 1.55);
      ctx.bezierCurveTo(-size * 0.65, size * 1.1, -size * 0.65, -size * 1.1, 0, -size * 1.65);
      ctx.closePath();
      break;
    case 4: // Stipitate Hydathode / Guttation Droplet
      ctx.moveTo(0, -size * 1.6);
      ctx.bezierCurveTo(size * 0.95, -size * 1.6, size * 0.95, -size * 0.2, 0, -size * 0.2);
      ctx.bezierCurveTo(-size * 0.95, -size * 0.2, -size * 0.95, -size * 1.6, 0, -size * 1.6);
      ctx.closePath();
      break;
    case 5: // Anastomosing Cirri
      ctx.moveTo(-size * 0.3, size * 1.2);
      ctx.lineTo(-size * 1.2, -size * 0.6);
      ctx.lineTo(0, -size * 0.2);
      ctx.lineTo(size * 1.2, -size * 0.6);
      ctx.lineTo(size * 0.3, size * 1.2);
      ctx.closePath();
      break;
    case 6: // Pholiota Phosphor-Gland Lantern
      for (let p = 0; p < 8; p += 1) {
        const a = -Math.PI / 2 + (p / 8) * Math.PI * 2;
        const r = p % 2 ? size * 0.85 : size * 1.35;
        const px = Math.cos(a) * r;
        const py = Math.sin(a) * r;
        if (p === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      break;
    case 7: // Cellular Platelet / Sorus Rosette
      for (let p = 0; p < 6; p += 1) {
        const a = -Math.PI / 2 + (p / 6) * Math.PI * 2;
        const px = Math.cos(a) * size * 1.25;
        const py = Math.sin(a) * size * 1.25;
        if (p === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      break;
    default:
      ctx.arc(0, 0, size, 0, Math.PI * 2);
  }
}

export function traceGermAperture(ctx, shape, x, y, size) {
  ctx.beginPath();
  switch (shape) {
    case 0: // Dense Spheroid Nucleolus
      ctx.arc(x, y, size * 0.42, 0, Math.PI * 2);
      break;
    case 1: // Longitudinal Dehiscence Slit
      ctx.ellipse(x, y, size * 0.16, size * 0.62, 0, 0, Math.PI * 2);
      break;
    case 2: // Transverse Stomatal Cleft
      ctx.ellipse(x, y, size * 0.62, size * 0.16, 0, 0, Math.PI * 2);
      break;
    case 3: // Faceted Rhomboid Crystal Inclusion
      ctx.moveTo(x, y - size * 0.58);
      ctx.lineTo(x + size * 0.44, y);
      ctx.lineTo(x, y + size * 0.58);
      ctx.lineTo(x - size * 0.44, y);
      ctx.closePath();
      break;
    case 4: // Radiolarian Aster Star
      for (let point = 0; point < 10; point += 1) {
        const angle = -Math.PI / 2 + (point / 10) * Math.PI * 2;
        const radius = point % 2 ? size * 0.22 : size * 0.62;
        const px = x + Math.cos(angle) * radius;
        const py = y + Math.sin(angle) * radius;
        if (point === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      break;
    case 5: // Cruciform Spore Tetrad
      ctx.rect(x - size * 0.16, y - size * 0.62, size * 0.32, size * 1.24);
      ctx.rect(x - size * 0.62, y - size * 0.16, size * 1.24, size * 0.32);
      break;
    case 6: // Annular Lumen / Torus Vesicle
      ctx.arc(x, y, size * 0.52, 0, Math.PI * 2);
      ctx.arc(x, y, size * 0.24, 0, Math.PI * 2, true);
      break;
    case 7: // Trilete Y-Scar
      for (let arm = 0; arm < 3; arm += 1) {
        const a = -Math.PI / 2 + (arm / 3) * Math.PI * 2;
        const armW = size * 0.14;
        const p1x = x + Math.cos(a + Math.PI / 2) * armW;
        const p1y = y + Math.sin(a + Math.PI / 2) * armW;
        const p2x = x + Math.cos(a) * size * 0.65;
        const p2y = y + Math.sin(a) * size * 0.65;
        const p3x = x + Math.cos(a - Math.PI / 2) * armW;
        const p3y = y + Math.sin(a - Math.PI / 2) * armW;
        if (arm === 0) ctx.moveTo(p1x, p1y);
        else ctx.lineTo(p1x, p1y);
        ctx.lineTo(p2x, p2y);
        ctx.lineTo(p3x, p3y);
      }
      ctx.closePath();
      break;
    default:
      ctx.arc(x, y, size * 0.42, 0, Math.PI * 2);
  }
}

export function appendagePlacement(score, index, count, base, elapsed) {
  const ratio = count <= 1 ? 0.5 : index / (count - 1);
  const sulk = interaction.sulk || 0;
  const sulkRetract = 1 - sulk * 0.32;
  const now = performance.now();
  const isRetaliating = now < (interaction.retaliateUntil || 0);
  const surge = isRetaliating ? 1.18 : 1.0;

  switch (score.eyeLayout) {
    case 0: { // Orbital Rosette / Crown
      const angle = (index / count) * Math.PI * 2 + elapsed * 0.055 * (score.motion % 2 ? 1 : -1);
      const orbit = base * (0.16 + Math.min(count, 8) * 0.015) * sulkRetract * surge;
      return { x: Math.cos(angle) * orbit, y: Math.sin(angle) * orbit, angle: angle + Math.PI / 2, scale: 1 };
    }
    case 1: { // Bilateral Branching
      const columns = Math.min(6, count);
      const row = Math.floor(index / columns);
      const column = index % columns;
      const rowCount = Math.ceil(count / columns);
      const side = column < columns / 2 ? -1 : 1;
      return {
        x: (column - (Math.min(columns, count - row * columns) - 1) / 2) * base * 0.14 * sulkRetract * surge,
        y: (row - (rowCount - 1) / 2) * base * 0.14 * sulkRetract,
        angle: side * 0.35,
        scale: 0.92,
      };
    }
    case 2: { // Golden Spiral
      const angle = index * 2.399 + elapsed * 0.025;
      const orbit = base * (0.05 + ratio * 0.32) * sulkRetract * surge;
      return { x: Math.cos(angle) * orbit, y: Math.sin(angle) * orbit, angle: angle + Math.PI / 2, scale: 0.75 + ratio * 0.35 };
    }
    case 3: { // Dorsal Crescent
      const angle = Math.PI + ratio * Math.PI;
      const orbit = base * 0.33 * sulkRetract * surge;
      return { x: Math.cos(angle) * orbit, y: Math.sin(angle) * orbit, angle: angle + Math.PI / 2, scale: 0.85 + Math.sin(ratio * Math.PI) * 0.3 };
    }
    case 4: { // Cellular Colony Cluster
      const columns = Math.ceil(Math.sqrt(count));
      const rows = Math.ceil(count / columns);
      const column = index % columns;
      const row = Math.floor(index / columns);
      const cx = (column - (columns - 1) / 2) * base * 0.135 * sulkRetract * surge;
      const cy = (row - (rows - 1) / 2) * base * 0.135 * sulkRetract * surge;
      const angle = Math.atan2(cy, cx) + Math.PI / 2;
      return {
        x: cx,
        y: cy,
        angle,
        scale: 0.8 + ((index * 3) % 4) * 0.08,
      };
    }
    case 5: { // Axial Hyphal Spine
      const side = index % 2 ? 1 : -1;
      return {
        x: Math.sin(index * 1.7) * base * 0.09 * sulkRetract + side * base * 0.04,
        y: (ratio - 0.5) * base * 0.62 * sulkRetract,
        angle: side * 0.42,
        scale: 0.75 + (index % 3) * 0.14,
      };
    }
    default:
      return { x: 0, y: 0, angle: 0, scale: 1 };
  }
}

export function drawAppendageOrganelle(ctx, score, index, radius, elapsed, colors) {
  const hue = wrapHue(score.irisHue + index * score.irisShift);
  const secondHue = wrapHue(hue + score.hueShift);
  const now = performance.now();
  const isRetaliating = now < (interaction.retaliateUntil || 0);
  const agitation = interaction.agitation || 0;
  const sulk = interaction.sulk || 0;
  const tap = interaction.tap || 0;
  const hold = interaction.hold || 0;

  // Bio-fluid cytoplasm gradient
  const grad = ctx.createRadialGradient(-radius * 0.15, -radius * 0.18, radius * 0.08, 0, 0, radius);
  if (isRetaliating) {
    grad.addColorStop(0, "hsl(45 100% 95%)");
    grad.addColorStop(0.35, "hsl(35 100% 68%)");
    grad.addColorStop(1, "hsl(15 90% 35%)");
  } else {
    grad.addColorStop(0, `hsl(${secondHue} 95% ${78 + agitation * 14}%)`);
    grad.addColorStop(0.35, `hsl(${hue} 88% ${50 + agitation * 10}%)`);
    grad.addColorStop(1, `hsl(${wrapHue(hue - 32)} 78% ${22 - sulk * 10}%)`);
  }
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(0, 0, radius, 0, Math.PI * 2);
  ctx.fill();

  // Internal cytoplasmic texture / organelle structure (irisStyle 0..7)
  ctx.save();
  ctx.lineWidth = Math.max(0.65, radius * 0.08);
  ctx.strokeStyle = `hsla(${secondHue} 100% 84% / ${0.7 + agitation * 0.25})`;
  ctx.fillStyle = `hsla(${secondHue} 100% 74% / 0.55)`;

  switch (score.irisStyle) {
    case 0: { // Cytosol Sol-Gel Cyclosis
      const pulseR = radius * (0.35 + Math.sin(elapsed * 2.8 + index) * 0.08);
      ctx.beginPath();
      ctx.arc(0, 0, pulseR, 0, Math.PI * 2);
      ctx.stroke();
      break;
    }
    case 1: // Concentric Lipid Bilayers (3 rippling rings)
    case 5: { // Endoplasmic Reticulum (5 fine rings)
      const rings = score.irisStyle === 1 ? 3 : 5;
      for (let r = 1; r <= rings; r += 1) {
        const ringR = radius * (r / (rings + 1));
        const wave = Math.sin(elapsed * 2.2 + r * 1.5) * radius * 0.04;
        ctx.beginPath();
        ctx.arc(0, 0, Math.max(1, ringR + wave), 0, Math.PI * 2);
        ctx.stroke();
      }
      break;
    }
    case 2: // Cytoskeletal Microtubules (8 spokes)
    case 6: { // Siliceous Aster Spicules (16 spokes)
      const spokes = score.irisStyle === 2 ? 8 : 16;
      for (let s = 0; s < spokes; s += 1) {
        const a = (s / spokes) * Math.PI * 2 + elapsed * 0.05 + interaction.morphPhase * 0.4;
        ctx.beginPath();
        ctx.moveTo(Math.cos(a) * radius * 0.2, Math.sin(a) * radius * 0.2);
        ctx.lineTo(Math.cos(a) * radius * 0.92, Math.sin(a) * radius * 0.92);
        ctx.stroke();
      }
      break;
    }
    case 3: { // Circulating Mitochondrial / Spore Granules
      for (let dot = 0; dot < 7; dot += 1) {
        const a = (dot / 7) * Math.PI * 2 + elapsed * 0.35 + index * 0.8;
        const gr = radius * 0.11;
        ctx.beginPath();
        ctx.arc(Math.cos(a) * radius * 0.62, Math.sin(a) * radius * 0.62, gr, 0, Math.PI * 2);
        ctx.fill();
      }
      break;
    }
    case 4: { // Thylakoid Lamellar Crescent
      ctx.beginPath();
      ctx.arc(0, 0, radius * 0.82, -Math.PI / 2, Math.PI / 2);
      ctx.lineTo(0, 0);
      ctx.closePath();
      ctx.fill();
      for (let l = 1; l <= 3; l += 1) {
        ctx.beginPath();
        ctx.arc(0, 0, radius * (l / 4) * 0.82, -Math.PI / 2, Math.PI / 2);
        ctx.stroke();
      }
      break;
    }
    case 7: { // Chitinous Corona Sheath
      ctx.lineWidth = Math.max(1, radius * 0.14);
      ctx.beginPath();
      ctx.arc(0, 0, radius * 0.74, 0, Math.PI * 2);
      ctx.stroke();
      break;
    }
    default:
      break;
  }
  ctx.restore();

  // Central Germ Aperture / Nucleolus (pupilShape 0..7)
  const apertureScale = isRetaliating
    ? 1.45
    : Math.max(0.45, Math.min(1.35, 1 + tap * 0.3 - hold * 0.18 + agitation * 0.28 - sulk * 0.3));

  if (isRetaliating) {
    ctx.fillStyle = "hsl(45 100% 96%)";
    ctx.strokeStyle = "hsl(35 100% 80%)";
  } else {
    ctx.fillStyle = `hsl(${wrapHue(hue + 180)} 44% ${12 - sulk * 6}%)`;
    ctx.strokeStyle = `hsla(${secondHue} 100% 88% / 0.85)`;
  }
  ctx.lineWidth = Math.max(0.8, radius * 0.08);

  traceGermAperture(ctx, score.pupilShape, 0, 0, radius * apertureScale);
  ctx.fill("evenodd");
  ctx.stroke();
}

export function drawCellularAppendage(ctx, score, index, base, elapsed, colors) {
  const placement = appendagePlacement(score, index, score.eyes, base, elapsed + interaction.morphPhase * 0.6);
  const crowding = 1 - Math.max(0, score.eyes - 7) * 0.025;
  const size = Math.max(5, base * (0.026 + score.eyeSize / 2200) * placement.scale * crowding);

  const now = performance.now();
  const isRetaliating = now < (interaction.retaliateUntil || 0);
  const agitation = interaction.agitation || 0;
  const sulk = interaction.sulk || 0;
  const tap = interaction.tap || 0;
  const hold = interaction.hold || 0;

  const hue = wrapHue(score.irisHue + index * score.irisShift);
  const secondHue = wrapHue(hue + score.hueShift);
  const membraneHue = wrapHue(colors[1] + index * 14);

  // Dynamic tropism toward pointer or defensive curl during sulk
  const toPointerX = (interaction.smoothX || 0) * base - placement.x;
  const toPointerY = (interaction.smoothY || 0) * base - placement.y;
  const reachAngle = Math.atan2(toPointerY, toPointerX);
  const attention = Math.min(1, hold * 0.8 + tap * 0.5 + agitation * 0.65) * (1 - sulk * 0.85);
  const quiver = tap > 0.01 ? Math.sin(elapsed * 50 + index * 3.8) * tap * size * 0.22 : 0;
  const twitch = agitation > 0.1 ? Math.sin(elapsed * 32 + index * 2.2) * agitation * 0.18 : 0;
  const dynamicAngle = placement.angle + (reachAngle - placement.angle) * attention * 0.38 + twitch;

  ctx.save();
  ctx.translate(placement.x + quiver, placement.y + quiver);
  ctx.rotate(dynamicAngle);

  // Glow halo
  ctx.shadowBlur = size * (0.35 + agitation * 0.45 + (isRetaliating ? 1.1 : 0) + (interaction.retaliationFlash || 0) * 0.8);
  ctx.shadowColor = isRetaliating
    ? "hsl(45 100% 88%)"
    : `hsla(${hue} 100% 72% / ${0.5 + agitation * 0.4})`;

  const stalkStroke = `hsla(${membraneHue} 65% ${42 + agitation * 18}% / 0.75)`;
  const membraneFill = `hsla(${membraneHue} 55% ${28 - sulk * 10}% / 0.65)`;
  const chitinHighlight = `hsla(${secondHue} 95% 82% / 0.8)`;
  const darkOutline = `hsl(${colors[0]} 72% 10%)`;

  switch (score.eyeShape) {
    case 0: { // Archetype 0: Sporangium Globule
      ctx.lineWidth = Math.max(1, size * 0.12);
      ctx.strokeStyle = stalkStroke;
      ctx.beginPath();
      ctx.moveTo(0, size * 1.5);
      ctx.quadraticCurveTo(-size * 0.35, size * 0.75, 0, size * 0.3);
      ctx.stroke();

      ctx.lineWidth = Math.max(0.6, size * 0.07);
      ctx.strokeStyle = chitinHighlight;
      for (let r = 1; r <= 3; r += 1) {
        const ry = size * (0.5 + r * 0.28);
        ctx.beginPath();
        ctx.moveTo(-size * 0.15, ry);
        ctx.lineTo(size * 0.15, ry);
        ctx.stroke();
      }

      ctx.save();
      ctx.translate(0, -size * 0.2);
      ctx.beginPath();
      ctx.moveTo(0, -size * 1.2);
      ctx.bezierCurveTo(size * 1.15, -size * 0.95, size * 1.1, size * 0.85, 0, size * 1.05);
      ctx.bezierCurveTo(-size * 1.1, size * 0.85, -size * 1.15, -size * 0.95, 0, -size * 1.2);
      ctx.closePath();
      ctx.fillStyle = membraneFill;
      ctx.fill();

      ctx.lineWidth = Math.max(0.7, size * 0.08);
      ctx.strokeStyle = chitinHighlight;
      ctx.beginPath();
      ctx.ellipse(0, 0, size * 0.95, size * 0.32, 0, 0, Math.PI * 2);
      ctx.stroke();

      drawAppendageOrganelle(ctx, score, index, size * 0.6, elapsed, colors);

      ctx.fillStyle = chitinHighlight;
      for (let s = 0; s < 6; s += 1) {
        const sa = (s / 6) * Math.PI * 2 + elapsed * 0.2;
        const sr = size * (0.68 + Math.sin(sa * 3) * 0.1);
        ctx.beginPath();
        ctx.arc(Math.cos(sa) * sr, Math.sin(sa) * sr * 0.8, size * 0.05, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.lineWidth = Math.max(0.8, size * 0.09);
      ctx.strokeStyle = darkOutline;
      ctx.beginPath();
      ctx.moveTo(0, -size * 1.2);
      ctx.bezierCurveTo(size * 1.15, -size * 0.95, size * 1.1, size * 0.85, 0, size * 1.05);
      ctx.bezierCurveTo(-size * 1.1, size * 0.85, -size * 1.15, -size * 0.95, 0, -size * 1.2);
      ctx.closePath();
      ctx.stroke();
      ctx.restore();
      break;
    }

    case 1: { // Archetype 1: Ciliated Flagellum / Hyphal Tentacle
      const segments = 6;
      const spine = [];
      const waveSpeed = 2.4 + agitation * 3.6;
      for (let s = 0; s <= segments; s += 1) {
        const t = s / segments;
        const sy = size * 1.4 - t * size * 2.8;
        const curl = sulk * Math.sin(t * Math.PI) * size * 0.65;
        const sx = Math.sin(elapsed * waveSpeed + s * 0.8) * size * (0.15 + t * 0.3) * (1 - sulk * 0.6) + curl;
        spine.push({ x: sx, y: sy });
      }

      ctx.lineWidth = Math.max(0.55, size * 0.05);
      ctx.strokeStyle = chitinHighlight;
      for (let s = 1; s < segments; s += 1) {
        const p = spine[s];
        const prev = spine[s - 1];
        const next = spine[s + 1];
        const dx = next.x - prev.x;
        const dy = next.y - prev.y;
        const len = Math.hypot(dx, dy) || 1;
        const nx = -dy / len;
        const ny = dx / len;
        const ciliaLen = size * (0.28 + (s % 2) * 0.12);
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.x + nx * ciliaLen, p.y + ny * ciliaLen);
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.x - nx * ciliaLen, p.y - ny * ciliaLen);
        ctx.stroke();
      }

      ctx.beginPath();
      for (let s = 0; s <= segments; s += 1) {
        const p = spine[s];
        const w = size * (0.22 - (s / segments) * 0.12);
        const pX = p.x + w;
        if (s === 0) ctx.moveTo(pX, p.y);
        else ctx.lineTo(pX, p.y);
      }
      for (let s = segments; s >= 0; s -= 1) {
        const p = spine[s];
        const w = size * (0.22 - (s / segments) * 0.12);
        ctx.lineTo(p.x - w, p.y);
      }
      ctx.closePath();
      ctx.fillStyle = membraneFill;
      ctx.fill();
      ctx.lineWidth = Math.max(0.7, size * 0.08);
      ctx.strokeStyle = darkOutline;
      ctx.stroke();

      const tip = spine[segments];
      ctx.save();
      ctx.translate(tip.x, tip.y);
      drawAppendageOrganelle(ctx, score, index, size * 0.48, elapsed, colors);
      ctx.restore();
      break;
    }

    case 2: { // Archetype 2: Bioluminescent Vacuole / Cellular Nucleus
      ctx.save();
      ctx.beginPath();
      const numPts = 24;
      for (let p = 0; p < numPts; p += 1) {
        const a = (p / numPts) * Math.PI * 2;
        const wave = Math.sin(a * 4 + elapsed * 2.5 + index) * size * 0.06;
        const r = size * 1.1 + wave;
        const px = Math.cos(a) * r;
        const py = Math.sin(a) * r;
        if (p === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.fillStyle = membraneFill;
      ctx.fill();
      ctx.lineWidth = Math.max(0.75, size * 0.08);
      ctx.strokeStyle = stalkStroke;
      ctx.stroke();

      ctx.lineWidth = Math.max(0.5, size * 0.05);
      ctx.strokeStyle = chitinHighlight;
      for (let b = 0; b < 12; b += 1) {
        const a = (b / 12) * Math.PI * 2;
        ctx.beginPath();
        ctx.moveTo(Math.cos(a) * size * 0.85, Math.sin(a) * size * 0.85);
        ctx.lineTo(Math.cos(a) * size * 1.05, Math.sin(a) * size * 1.05);
        ctx.stroke();
      }

      drawAppendageOrganelle(ctx, score, index, size * 0.78, elapsed, colors);

      ctx.lineWidth = Math.max(0.6, size * 0.06);
      ctx.strokeStyle = `hsla(${secondHue} 90% 75% / 0.65)`;
      for (let c = 0; c < 6; c += 1) {
        const a = (c / 6) * Math.PI * 2 + elapsed * 0.15;
        ctx.beginPath();
        ctx.moveTo(Math.cos(a) * size * 0.35, Math.sin(a) * size * 0.35);
        ctx.quadraticCurveTo(
          Math.cos(a + 0.4) * size * 0.6,
          Math.sin(a + 0.4) * size * 0.6,
          Math.cos(a) * size * 0.85,
          Math.sin(a) * size * 0.85
        );
        ctx.stroke();
      }
      ctx.restore();
      break;
    }

    case 3: { // Archetype 3: Ascus Spore-Sac
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(0, -size * 1.55);
      ctx.bezierCurveTo(size * 0.72, -size * 1.1, size * 0.72, size * 1.1, 0, size * 1.5);
      ctx.bezierCurveTo(-size * 0.72, size * 1.1, -size * 0.72, -size * 1.1, 0, -size * 1.55);
      ctx.closePath();
      ctx.fillStyle = membraneFill;
      ctx.fill();

      ctx.lineWidth = Math.max(0.6, size * 0.06);
      ctx.strokeStyle = stalkStroke;
      const septaCount = 7;
      for (let s = 1; s < septaCount; s += 1) {
        const sy = -size * 1.35 + (s / septaCount) * size * 2.7;
        const sw = size * 0.62 * Math.sin((s / septaCount) * Math.PI);
        ctx.beginPath();
        ctx.moveTo(-sw, sy);
        ctx.lineTo(sw, sy);
        ctx.stroke();
      }

      const sporeCount = 6;
      for (let s = 0; s < sporeCount; s += 1) {
        const sy = -size * 1.05 + (s / (sporeCount - 1)) * size * 2.1;
        const sr = size * 0.15;
        const sporeHue = wrapHue(secondHue + s * 16);
        ctx.fillStyle = `hsl(${sporeHue} 95% 72%)`;
        ctx.beginPath();
        ctx.arc(0, sy, sr, 0, Math.PI * 2);
        ctx.fill();
        ctx.lineWidth = Math.max(0.5, size * 0.04);
        ctx.strokeStyle = darkOutline;
        ctx.stroke();
      }

      ctx.save();
      ctx.translate(0, -size * 1.3);
      drawAppendageOrganelle(ctx, score, index, size * 0.32, elapsed, colors);
      ctx.restore();

      ctx.lineWidth = Math.max(0.8, size * 0.09);
      ctx.strokeStyle = darkOutline;
      ctx.beginPath();
      ctx.moveTo(0, -size * 1.55);
      ctx.bezierCurveTo(size * 0.72, -size * 1.1, size * 0.72, size * 1.1, 0, size * 1.5);
      ctx.bezierCurveTo(-size * 0.72, size * 1.1, -size * 0.72, -size * 1.1, 0, -size * 1.55);
      ctx.closePath();
      ctx.stroke();
      ctx.restore();
      break;
    }

    case 4: { // Archetype 4: Stipitate Hydathode
      ctx.lineWidth = Math.max(1, size * 0.12);
      ctx.strokeStyle = stalkStroke;
      ctx.beginPath();
      ctx.moveTo(0, size * 1.5);
      ctx.lineTo(0, 0);
      ctx.stroke();

      ctx.lineWidth = Math.max(0.5, size * 0.04);
      ctx.strokeStyle = chitinHighlight;
      ctx.beginPath();
      ctx.moveTo(-size * 0.06, size * 1.4);
      ctx.lineTo(-size * 0.06, 0.1);
      ctx.moveTo(size * 0.06, size * 1.4);
      ctx.lineTo(size * 0.06, 0.1);
      ctx.stroke();

      ctx.save();
      ctx.translate(0, -size * 0.75);
      ctx.beginPath();
      ctx.moveTo(0, -size * 0.85);
      ctx.bezierCurveTo(size * 0.9, -size * 0.85, size * 0.85, size * 0.55, 0, size * 0.75);
      ctx.bezierCurveTo(-size * 0.85, size * 0.55, -size * 0.9, -size * 0.85, 0, -size * 0.85);
      ctx.closePath();
      ctx.fillStyle = membraneFill;
      ctx.fill();

      drawAppendageOrganelle(ctx, score, index, size * 0.45, elapsed, colors);

      ctx.lineWidth = Math.max(0.7, size * 0.07);
      ctx.strokeStyle = chitinHighlight;
      ctx.beginPath();
      ctx.arc(-size * 0.3, -size * 0.35, size * 0.28, Math.PI * 0.9, Math.PI * 1.5);
      ctx.stroke();

      ctx.lineWidth = Math.max(0.8, size * 0.09);
      ctx.strokeStyle = darkOutline;
      ctx.beginPath();
      ctx.moveTo(0, -size * 0.85);
      ctx.bezierCurveTo(size * 0.9, -size * 0.85, size * 0.85, size * 0.55, 0, size * 0.75);
      ctx.bezierCurveTo(-size * 0.85, size * 0.55, -size * 0.9, -size * 0.85, 0, -size * 0.85);
      ctx.closePath();
      ctx.stroke();
      ctx.restore();
      break;
    }

    case 5: { // Archetype 5: Anastomosing Cirri
      ctx.lineWidth = Math.max(1.1, size * 0.14);
      ctx.strokeStyle = stalkStroke;
      ctx.beginPath();
      ctx.moveTo(0, size * 1.4);
      ctx.lineTo(0, size * 0.1);
      ctx.stroke();

      ctx.lineWidth = Math.max(0.6, size * 0.06);
      ctx.strokeStyle = chitinHighlight;
      for (let n = 1; n <= 3; n += 1) {
        const ny = size * (0.3 + n * 0.32);
        ctx.beginPath();
        ctx.arc(0, ny, size * 0.12, 0, Math.PI * 2);
        ctx.stroke();
      }

      const reach = 1 - sulk * 0.75;
      for (const side of [-1, 1]) {
        ctx.beginPath();
        const startX = 0;
        const startY = size * 0.1;
        ctx.moveTo(startX, startY);
        for (let t = 0; t <= 12; t += 1) {
          const ratio = t / 12;
          const a = side * (0.4 + ratio * Math.PI * 1.4);
          const r = size * (0.2 + ratio * 0.85) * reach;
          const tx = side * Math.sin(a) * r;
          const ty = startY - Math.cos(a) * r;
          ctx.lineTo(tx, ty);
        }
        ctx.lineWidth = Math.max(0.8, size * 0.09);
        ctx.strokeStyle = stalkStroke;
        ctx.stroke();

        const finalA = side * (0.4 + Math.PI * 1.4);
        const finalR = size * 1.05 * reach;
        const tipX = side * Math.sin(finalA) * finalR;
        const tipY = startY - Math.cos(finalA) * finalR;
        ctx.fillStyle = chitinHighlight;
        ctx.beginPath();
        ctx.arc(tipX, tipY, size * 0.08, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.save();
      ctx.translate(0, 0);
      drawAppendageOrganelle(ctx, score, index, size * 0.46, elapsed, colors);
      ctx.restore();
      break;
    }

    case 6: { // Archetype 6: Pholiota Phosphor-Gland Lantern
      const bractCount = 6;
      const flare = isRetaliating ? 1.35 : 1 + agitation * 0.25;

      ctx.save();
      const beamCount = 12;
      for (let b = 0; b < beamCount; b += 1) {
        const a = (b / beamCount) * Math.PI * 2 + elapsed * 0.1;
        const beamLen = size * (1.2 + Math.sin(a * 3 + elapsed * 3) * 0.3) * flare;
        ctx.strokeStyle = `hsla(${secondHue} 100% 85% / ${0.28 + agitation * 0.3})`;
        ctx.lineWidth = Math.max(0.8, size * 0.07);
        ctx.beginPath();
        ctx.moveTo(Math.cos(a) * size * 0.4, Math.sin(a) * size * 0.4);
        ctx.lineTo(Math.cos(a) * beamLen, Math.sin(a) * beamLen);
        ctx.stroke();
      }
      ctx.restore();

      drawAppendageOrganelle(ctx, score, index, size * 0.72, elapsed, colors);

      ctx.lineWidth = Math.max(0.8, size * 0.1);
      ctx.strokeStyle = darkOutline;
      ctx.fillStyle = membraneFill;
      for (let b = 0; b < bractCount; b += 1) {
        const a = (b / bractCount) * Math.PI * 2;
        const bx = Math.cos(a) * size * 0.85 * flare;
        const by = Math.sin(a) * size * 0.85 * flare;
        ctx.beginPath();
        ctx.arc(bx, by, size * 0.22, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      }
      break;
    }

    case 7: { // Archetype 7: Cellular Platelet / Sorus Rosette
      const lobes = 6;
      ctx.beginPath();
      for (let p = 0; p < lobes; p += 1) {
        const a = -Math.PI / 2 + (p / lobes) * Math.PI * 2;
        const px = Math.cos(a) * size * 1.25;
        const py = Math.sin(a) * size * 1.25;
        if (p === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.fillStyle = membraneFill;
      ctx.fill();

      ctx.lineWidth = Math.max(0.6, size * 0.06);
      ctx.strokeStyle = chitinHighlight;
      ctx.fillStyle = `hsla(${secondHue} 100% 88% / 0.6)`;
      for (let p = 0; p < lobes * 2; p += 1) {
        const a = (p / (lobes * 2)) * Math.PI * 2;
        const pr = size * 0.95;
        ctx.beginPath();
        ctx.arc(Math.cos(a) * pr, Math.sin(a) * pr, size * 0.09, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      }

      drawAppendageOrganelle(ctx, score, index, size * 0.65, elapsed, colors);

      ctx.lineWidth = Math.max(0.8, size * 0.09);
      ctx.strokeStyle = darkOutline;
      ctx.beginPath();
      for (let p = 0; p < lobes; p += 1) {
        const a = -Math.PI / 2 + (p / lobes) * Math.PI * 2;
        const px = Math.cos(a) * size * 1.25;
        const py = Math.sin(a) * size * 1.25;
        if (p === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.stroke();
      break;
    }

    default: {
      drawAppendageOrganelle(ctx, score, index, size * 0.65, elapsed, colors);
      break;
    }
  }

  ctx.restore();
}

// Backwards-compatibility aliases
export const eyePlacement = appendagePlacement;
export function drawEye(ctx, score, eye, base, elapsed, colors) {
  drawCellularAppendage(ctx, score, eye, base, elapsed, colors);
}
export function traceEyeShape(ctx, shape, size) {
  traceAppendageSilhouette(ctx, shape, size);
}
export function tracePupil(ctx, shape, x, y, size) {
  traceGermAperture(ctx, shape, x, y, size);
}
export function drawIris(ctx, score, eye, size, elapsed) {
  drawAppendageOrganelle(ctx, score, eye, size * 0.6, elapsed, null);
}

export function buildMycelialNetwork(score) {
  const random = mulberry32(score.seed ^ 0x3f5c7a19);
  const rootCount = Math.max(7, Math.min(18, Math.round(6 + score.fungalHyphae / 7.5)));
  const branches = [];
  const nodes = [];

  for (let r = 0; r < rootCount; r += 1) {
    const angle = ((r + (random() - 0.5) * 0.35) / rootCount) * Math.PI * 2;
    const normRad = shapeRadius(score, angle, 0);
    const startX = Math.cos(angle) * normRad * 0.94;
    const startY = Math.sin(angle) * normRad * 0.94;
    let heading = angle + (random() - 0.5) * 0.42;

    const mainSteps = 5 + Math.floor(random() * 5);
    const mainPoints = [{ x: startX, y: startY, dist: 0, depth: 0 }];
    let cx = startX;
    let cy = startY;
    let totalDist = 0;

    for (let s = 1; s <= mainSteps; s += 1) {
      const stepLen = 0.12 + random() * 0.16;
      heading += (random() - 0.5) * 0.46;
      cx += Math.cos(heading) * stepLen;
      cy += Math.sin(heading) * stepLen;
      totalDist += stepLen;
      const pt = { x: cx, y: cy, dist: totalDist, depth: 0 };
      mainPoints.push(pt);
      nodes.push({ x: cx, y: cy, angle: heading, dist: totalDist, mainBranch: r });

      if (s >= 2 && random() < 0.52) {
        const forkAngle = heading + (random() > 0.5 ? 1 : -1) * (0.42 + random() * 0.44);
        const subSteps = 3 + Math.floor(random() * 3);
        const subPoints = [{ x: cx, y: cy, dist: totalDist, depth: 1 }];
        let scx = cx;
        let scy = cy;
        let subDist = totalDist;
        let subHeading = forkAngle;

        for (let ss = 1; ss <= subSteps; ss += 1) {
          const subLen = 0.08 + random() * 0.12;
          subHeading += (random() - 0.5) * 0.42;
          scx += Math.cos(subHeading) * subLen;
          scy += Math.sin(subHeading) * subLen;
          subDist += subLen;
          const subPt = { x: scx, y: scy, dist: subDist, depth: 1 };
          subPoints.push(subPt);
          nodes.push({ x: scx, y: scy, angle: subHeading, dist: subDist, mainBranch: r });
        }
        branches.push({ points: subPoints, maxDist: subDist, rootIndex: r });
      }
    }
    branches.push({ points: mainPoints, maxDist: totalDist, rootIndex: r });
  }

  const bridges = [];
  for (let i = 0; i < nodes.length; i += 3) {
    for (let j = i + 1; j < nodes.length; j += 4) {
      if (nodes[i].mainBranch !== nodes[j].mainBranch) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const dist = Math.hypot(dx, dy);
        if (dist > 0.14 && dist < 0.32) {
          bridges.push({
            from: nodes[i],
            to: nodes[j],
            midX: (nodes[i].x + nodes[j].x) * 0.5 + (random() - 0.5) * 0.08,
            midY: (nodes[i].y + nodes[j].y) * 0.5 + (random() - 0.5) * 0.08,
            dist: Math.max(nodes[i].dist, nodes[j].dist),
          });
          break;
        }
      }
    }
  }

  return { branches, nodes, bridges };
}

export function buildFruitingBodies(score, mycelium) {
  const random = mulberry32(score.seed ^ 0x6e91b4c3);
  const bodyCount = 3 + (score.symmetry % 4) + Math.floor(score.fungalBloom / 28);
  const fruitingBodies = [];

  const candidates = mycelium.nodes.filter((node) => {
    const r = Math.hypot(node.x, node.y);
    return r >= 0.55 && r <= 1.45;
  });

  if (candidates.length === 0) {
    for (let i = 0; i < bodyCount; i += 1) {
      const a = (i / bodyCount) * Math.PI * 2;
      const r = shapeRadius(score, a, 0);
      candidates.push({ x: Math.cos(a) * r, y: Math.sin(a) * r, angle: a });
    }
  }

  candidates.sort((a, b) => Math.atan2(a.y, a.x) - Math.atan2(b.y, b.x));
  const step = Math.max(1, Math.floor(candidates.length / bodyCount));

  for (let i = 0; i < bodyCount && i * step < candidates.length; i += 1) {
    const node = candidates[i * step];
    const outAngle = Math.atan2(node.y, node.x);
    fruitingBodies.push({
      id: i,
      x: node.x,
      y: node.y,
      angle: outAngle,
      tilt: (random() - 0.5) * 0.45,
      curve: (random() - 0.5) * 0.35,
      size: (0.16 + (score.fungalBloom / 100) * 0.22) * (0.8 + random() * 0.4),
      archetype: score.fungalForm,
      gills: 12 + Math.floor(random() * 16),
      rings: 3 + Math.floor(random() * 4),
      sproutDelay: 0.08 + (i / bodyCount) * 0.32,
    });
  }

  return fruitingBodies;
}

export function buildSporeSystem(score, fruitingBodies) {
  const random = mulberry32(score.seed ^ 0x184d82f7);
  const count = 36 + Math.floor(score.fungalSpores * 0.5);
  return Array.from({ length: count }, (_, idx) => {
    const fb = fruitingBodies[idx % (fruitingBodies.length || 1)] || { x: 0, y: 0, angle: 0 };
    return {
      x: fb.x + (random() - 0.5) * 0.15,
      y: fb.y + (random() - 0.5) * 0.15,
      vx: (random() - 0.5) * 0.2,
      vy: -0.15 - random() * 0.25,
      life: random(),
      maxLife: 2.5 + random() * 3.5,
      size: 0.9 + random() * (1.1 + score.fungalSpores / 70),
      hueOffset: (random() - 0.5) * 45,
      fbIndex: idx % (fruitingBodies.length || 1),
    };
  });
}

export function drawMycelium(ctx, score, mycelium, base, growth, elapsed, colors) {
  if (!mycelium || growth <= 0.01) return;

  ctx.save();
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  const pulseRate = 0.8 + score.kineticSpeed / 120;
  const holdBoost = interaction.hold * 0.45;
  const tapBoost = interaction.tap * 0.35;

  for (let b = 0; b < mycelium.branches.length; b += 1) {
    const branch = mycelium.branches[b];
    const targetDist = growth * branch.maxDist * 1.15;
    const pts = branch.points;
    if (pts.length < 2 || targetDist < pts[0].dist) continue;

    const isSub = pts[0].depth > 0;
    const baseWidth = isSub ? 0.75 : 1.35;
    ctx.lineWidth = baseWidth * (1 + holdBoost * 0.6);

    ctx.beginPath();
    ctx.moveTo(pts[0].x * base, pts[0].y * base);

    let activeTip = null;
    for (let p = 1; p < pts.length; p += 1) {
      if (pts[p].dist <= targetDist) {
        ctx.lineTo(pts[p].x * base, pts[p].y * base);
        if (p === pts.length - 1 || pts[p + 1].dist > targetDist) {
          activeTip = pts[p];
        }
      } else {
        const prev = pts[p - 1];
        const span = pts[p].dist - prev.dist;
        const frac = span > 0.0001 ? (targetDist - prev.dist) / span : 0;
        const tipX = prev.x + (pts[p].x - prev.x) * frac;
        const tipY = prev.y + (pts[p].y - prev.y) * frac;
        ctx.lineTo(tipX * base, tipY * base);
        activeTip = { x: tipX, y: tipY, dist: targetDist };
        break;
      }
    }

    const travelingPulse = Math.sin(branch.maxDist * 10 - elapsed * 4.5 * pulseRate + b) * 0.28 + 0.72;
    const alpha = (isSub ? 0.42 : 0.65) * travelingPulse * (0.7 + holdBoost + tapBoost);
    ctx.strokeStyle = `hsla(${colors[1]} ${score.saturation}% ${72 + holdBoost * 18}% / ${Math.min(0.95, alpha)})`;
    ctx.stroke();

    if (activeTip && (growth < 0.98 || holdBoost > 0.05)) {
      ctx.fillStyle = `hsla(${colors[2]} 100% 86% / ${0.75 + holdBoost * 0.25})`;
      ctx.beginPath();
      ctx.arc(activeTip.x * base, activeTip.y * base, (baseWidth * 1.4 + holdBoost * 1.5), 0, Math.PI * 2);
      ctx.fill();
    }
  }

  for (const bridge of mycelium.bridges) {
    if (growth * 1.15 >= bridge.dist) {
      const bridgeAlpha = 0.38 * (0.6 + holdBoost);
      ctx.strokeStyle = `hsla(${colors[0]} ${score.saturation}% 74% / ${bridgeAlpha})`;
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.moveTo(bridge.from.x * base, bridge.from.y * base);
      ctx.quadraticCurveTo(bridge.midX * base, bridge.midY * base, bridge.to.x * base, bridge.to.y * base);
      ctx.stroke();
    }
  }

  ctx.restore();
}

function drawAgaricCap(ctx, score, fb, maturity, elapsed, colors) {
  const stipeLen = 50 * maturity;
  const capW = 38 * maturity;
  const capH = 22 * maturity;
  const curve = fb.curve * 20;

  ctx.strokeStyle = `hsla(${colors[1]} 45% 78% / 0.85)`;
  ctx.lineWidth = Math.max(1.8, 4.2 * maturity);
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.quadraticCurveTo(curve, stipeLen * 0.5, curve * 0.4, stipeLen);
  ctx.stroke();

  // Haeckel partial veil annulus skirt on stipe
  if (maturity > 0.45) {
    ctx.strokeStyle = `hsla(${colors[2]} 85% 82% / 0.9)`;
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.ellipse(curve * 0.7, stipeLen * 0.52, 6 * maturity, 2.5 * maturity, 0.2, 0, Math.PI * 2);
    ctx.stroke();

    // Fine lace edging on veil
    ctx.fillStyle = `hsla(${colors[2]} 95% 90% / 0.75)`;
    for (let v = -2; v <= 2; v += 1) {
      ctx.beginPath();
      ctx.arc(curve * 0.7 + v * 2.2 * maturity, stipeLen * 0.52 + 2, 0.9, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  ctx.save();
  ctx.translate(curve * 0.4, stipeLen);

  // Radiating lamellae (gills) with alternating secondary lamellulae
  if (maturity > 0.3) {
    ctx.strokeStyle = `hsla(${colors[2]} 90% 75% / 0.55)`;
    ctx.lineWidth = 0.8;
    const gillCount = Math.max(7, fb.gills * 2);
    for (let g = 0; g < gillCount; g += 1) {
      const gx = (-capW * 0.48) + (g / (gillCount - 1)) * (capW * 0.96);
      const gy = Math.sin((g / (gillCount - 1)) * Math.PI) * 4;
      const isSecondary = g % 2 === 1;
      ctx.beginPath();
      ctx.moveTo(isSecondary ? gx * 0.45 : 0, isSecondary ? -capH * 0.2 : 0);
      ctx.lineTo(gx, gy);
      ctx.stroke();
    }
  }

  const capGrad = ctx.createLinearGradient(0, -capH, 0, 4);
  capGrad.addColorStop(0, `hsla(${colors[0]} ${score.saturation}% 52% / 0.92)`);
  capGrad.addColorStop(0.7, `hsla(${colors[1]} ${score.saturation}% 65% / 0.85)`);
  capGrad.addColorStop(1, `hsla(${colors[2]} 100% 80% / 0.95)`);
  ctx.fillStyle = capGrad;
  ctx.strokeStyle = `hsla(${colors[2]} 100% 88% / 0.9)`;
  ctx.lineWidth = 1.2;

  ctx.beginPath();
  ctx.moveTo(-capW * 0.5, 2);
  ctx.bezierCurveTo(-capW * 0.5, -capH, capW * 0.5, -capH, capW * 0.5, 2);
  ctx.quadraticCurveTo(0, 5, -capW * 0.5, 2);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Marginal veil teeth
  ctx.fillStyle = `hsla(${colors[2]} 100% 90% / 0.92)`;
  for (let d = -2; d <= 2; d += 1) {
    ctx.beginPath();
    ctx.arc(d * (capW * 0.2), 3, 1.2, 0, Math.PI * 2);
    ctx.fill();
  }

  // Ernst Haeckel-style stippled universal veil scales (verrucae) across pileus
  if (maturity > 0.45) {
    ctx.fillStyle = `hsla(${colors[2]} 95% 88% / 0.8)`;
    const scales = [
      [0, -capH * 0.8, 1.6],
      [-capW * 0.22, -capH * 0.6, 1.3],
      [capW * 0.22, -capH * 0.6, 1.3],
      [-capW * 0.35, -capH * 0.25, 1.1],
      [capW * 0.35, -capH * 0.25, 1.1],
      [-capW * 0.12, -capH * 0.35, 1.2],
      [capW * 0.12, -capH * 0.35, 1.2],
    ];
    for (const [sx, sy, sr] of scales) {
      ctx.beginPath();
      ctx.arc(sx, sy, sr * maturity, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  ctx.restore();
}

function drawBracketConk(ctx, score, fb, maturity, elapsed, colors) {
  const conkW = 44 * maturity;
  const conkH = 26 * maturity;
  const tiers = Math.max(3, fb.rings);

  for (let t = tiers; t >= 1; t -= 1) {
    const frac = t / tiers;
    const tw = conkW * frac;
    const th = conkH * frac;
    const hueIdx = t % colors.length;

    ctx.fillStyle = `hsla(${colors[hueIdx]} ${Math.max(30, score.saturation - t * 8)}% ${35 + t * 9}% / ${0.72 + t * 0.05})`;
    ctx.strokeStyle = `hsla(${colors[2]} 100% ${76 + t * 4}% / 0.8)`;
    ctx.lineWidth = 1.0;

    ctx.beginPath();
    ctx.moveTo(-tw * 0.5, 0);
    ctx.bezierCurveTo(-tw * 0.55, th * 0.8, tw * 0.55, th * 0.8, tw * 0.5, 0);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Haeckel concentric annular sulcus lines (growth zones)
    if (maturity > 0.35) {
      ctx.strokeStyle = `hsla(${colors[2]} 85% 90% / 0.45)`;
      ctx.lineWidth = 0.65;
      ctx.beginPath();
      ctx.moveTo(-tw * 0.4, th * 0.3);
      ctx.quadraticCurveTo(0, th * 0.65, tw * 0.4, th * 0.3);
      ctx.stroke();
    }
  }

  // Ventral pore hymenium micro-stippling
  if (maturity > 0.4) {
    ctx.fillStyle = `hsla(${colors[2]} 90% 85% / 0.75)`;
    for (let p = -5; p <= 5; p += 1) {
      const px = p * (conkW * 0.08);
      const py = conkH * 0.72 - Math.abs(p) * 1.4;
      ctx.beginPath();
      ctx.arc(px, py, 0.9, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

function drawCoralClavaria(ctx, score, fb, maturity, elapsed, colors) {
  const height = 48 * maturity;
  ctx.lineCap = "round";

  function branch(x, y, len, angle, depth) {
    if (depth > 3 || len < 4) return;
    const endX = x + Math.cos(angle) * len;
    const endY = y + Math.sin(angle) * len;

    ctx.strokeStyle = `hsla(${colors[depth % colors.length]} ${score.saturation}% ${58 + depth * 10}% / ${0.7 + depth * 0.08})`;
    ctx.lineWidth = Math.max(0.8, (4 - depth) * 1.1 * maturity);
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(endX, endY);
    ctx.stroke();

    // Haeckel longitudinal striations along antler trunk
    if (depth <= 1 && maturity > 0.4) {
      ctx.strokeStyle = `hsla(${colors[2]} 90% 88% / 0.4)`;
      ctx.lineWidth = 0.6;
      ctx.beginPath();
      ctx.moveTo(x + 1, y);
      ctx.lineTo(endX + 1, endY);
      ctx.stroke();
    }

    if (depth === 3) {
      ctx.fillStyle = `hsla(${colors[2]} 100% 86% / 0.95)`;
      ctx.beginPath();
      ctx.arc(endX, endY, 1.6, 0, Math.PI * 2);
      ctx.fill();
    } else {
      const spread = 0.32 + Math.sin(elapsed * 2 + depth) * 0.05;
      branch(endX, endY, len * 0.72, angle - spread, depth + 1);
      branch(endX, endY, len * 0.72, angle + spread, depth + 1);
    }
  }

  branch(0, 0, height * 0.42, Math.PI * 0.5, 0);
}

function drawBioluminescentBonnet(ctx, score, fb, maturity, elapsed, colors) {
  const stipeLen = 56 * maturity;
  const bonnetW = 28 * maturity;
  const bonnetH = 26 * maturity;
  const sway = Math.sin(elapsed * 2.8 + fb.id) * 6;

  ctx.strokeStyle = `hsla(${colors[1]} 60% 82% / 0.78)`;
  ctx.lineWidth = Math.max(1.0, 2.4 * maturity);
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.quadraticCurveTo(fb.curve * 28 + sway, stipeLen * 0.5, sway * 1.2, stipeLen);
  ctx.stroke();

  ctx.save();
  ctx.translate(sway * 1.2, stipeLen);

  const bellGrad = ctx.createRadialGradient(0, -bonnetH * 0.5, 2, 0, -bonnetH * 0.5, bonnetW);
  bellGrad.addColorStop(0, `hsla(${colors[2]} 100% 82% / 0.95)`);
  bellGrad.addColorStop(0.6, `hsla(${colors[1]} ${score.saturation}% 60% / 0.65)`);
  bellGrad.addColorStop(1, `hsla(${colors[0]} ${score.saturation}% 45% / 0.35)`);

  ctx.fillStyle = bellGrad;
  ctx.strokeStyle = `hsla(${colors[2]} 100% 88% / 0.95)`;
  ctx.lineWidth = 1.1;

  ctx.beginPath();
  ctx.moveTo(-bonnetW * 0.5, 0);
  ctx.quadraticCurveTo(-bonnetW * 0.35, -bonnetH, 0, -bonnetH);
  ctx.quadraticCurveTo(bonnetW * 0.35, -bonnetH, bonnetW * 0.5, 0);
  ctx.quadraticCurveTo(0, 4, -bonnetW * 0.5, 0);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Haeckel pleated-striate radial ribs from disc to margin
  ctx.strokeStyle = `hsla(${colors[2]} 100% 84% / 0.55)`;
  ctx.lineWidth = 0.75;
  for (let r = -4; r <= 4; r += 1) {
    const rx = r * (bonnetW * 0.11);
    ctx.beginPath();
    ctx.moveTo(rx, 0);
    ctx.quadraticCurveTo(rx * 0.35, -bonnetH * 0.75, 0, -bonnetH);
    ctx.stroke();
  }

  // Apical papilla / dewdrop jewel
  ctx.fillStyle = `hsla(${colors[2]} 100% 96% / 0.95)`;
  ctx.beginPath();
  ctx.arc(0, -bonnetH - 1.2, 1.8, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

function drawCupPeziza(ctx, score, fb, maturity, elapsed, colors) {
  const cupW = 36 * maturity;
  const cupH = 24 * maturity;

  ctx.fillStyle = `hsla(${colors[1]} 50% 45% / 0.85)`;
  ctx.beginPath();
  ctx.moveTo(-4 * maturity, 0);
  ctx.lineTo(4 * maturity, 0);
  ctx.lineTo(6 * maturity, 8 * maturity);
  ctx.lineTo(-6 * maturity, 8 * maturity);
  ctx.closePath();
  ctx.fill();

  ctx.save();
  ctx.translate(0, 8 * maturity);

  ctx.fillStyle = `hsla(${colors[0]} ${score.saturation}% 42% / 0.9)`;
  ctx.strokeStyle = `hsla(${colors[2]} 90% 78% / 0.85)`;
  ctx.lineWidth = 1.2;

  ctx.beginPath();
  ctx.moveTo(-cupW * 0.5, 0);
  ctx.bezierCurveTo(-cupW * 0.55, cupH, cupW * 0.55, cupH, cupW * 0.5, 0);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  const discGrad = ctx.createRadialGradient(0, cupH * 0.35, 1, 0, cupH * 0.35, cupW * 0.45);
  discGrad.addColorStop(0, `hsla(${colors[2]} 100% 78% / 0.95)`);
  discGrad.addColorStop(0.7, `hsla(${colors[1]} ${score.saturation}% 55% / 0.8)`);
  discGrad.addColorStop(1, `hsla(${colors[0]} ${score.saturation}% 35% / 0.7)`);
  ctx.fillStyle = discGrad;

  ctx.beginPath();
  ctx.ellipse(0, 3, cupW * 0.48, cupH * 0.28, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = `hsla(${colors[2]} 100% 86% / 0.9)`;
  ctx.lineWidth = 0.9;
  ctx.stroke();

  // Haeckel fimbriate eyelash fringe around cup margin
  ctx.fillStyle = `hsla(${colors[2]} 100% 90% / 0.9)`;
  for (let b = 0; b < 14; b += 1) {
    const bAngle = (b / 14) * Math.PI * 2;
    const bx = Math.cos(bAngle) * cupW * 0.48;
    const by = 3 + Math.sin(bAngle) * cupH * 0.28;
    ctx.beginPath();
    ctx.arc(bx, by, 1.1, 0, Math.PI * 2);
    ctx.fill();
  }

  // Radial hymenial spore folds
  if (maturity > 0.45) {
    ctx.strokeStyle = `hsla(${colors[2]} 90% 82% / 0.45)`;
    ctx.lineWidth = 0.7;
    for (let f = 0; f < 8; f += 1) {
      const fAngle = (f / 8) * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(0, 3);
      ctx.lineTo(Math.cos(fAngle) * cupW * 0.4, 3 + Math.sin(fAngle) * cupH * 0.22);
      ctx.stroke();
    }
  }

  ctx.restore();
}

function drawMorelHoneycomb(ctx, score, fb, maturity, elapsed, colors) {
  const headW = 30 * maturity;
  const headH = 50 * maturity;
  const stipeLen = 18 * maturity;

  ctx.fillStyle = `hsla(${colors[1]} 30% 75% / 0.85)`;
  ctx.strokeStyle = `hsla(${colors[1]} 40% 60% / 0.75)`;
  ctx.lineWidth = 1.0;
  ctx.beginPath();
  ctx.rect(-headW * 0.28, 0, headW * 0.56, stipeLen);
  ctx.fill();
  ctx.stroke();

  ctx.save();
  ctx.translate(0, stipeLen);

  ctx.fillStyle = `hsla(${colors[0]} ${score.saturation}% 25% / 0.95)`;
  ctx.beginPath();
  ctx.moveTo(-headW * 0.5, 0);
  ctx.bezierCurveTo(-headW * 0.6, headH * 0.5, -headW * 0.2, headH, 0, headH);
  ctx.bezierCurveTo(headW * 0.2, headH, headW * 0.6, headH * 0.5, headW * 0.5, 0);
  ctx.closePath();
  ctx.fill();

  ctx.strokeStyle = `hsla(${colors[2]} 90% 76% / 0.85)`;
  ctx.lineWidth = 1.1;
  const rows = 5;
  const cols = 4;
  for (let r = 0; r < rows; r += 1) {
    const yFrac = r / rows;
    const ry = yFrac * headH * 0.9 + 3;
    const rw = headW * (1 - yFrac * 0.5);
    for (let c = 0; c < cols; c += 1) {
      const rx = (-rw * 0.5) + (c / (cols - 1)) * rw;
      ctx.beginPath();
      ctx.ellipse(rx, ry, rw * 0.16, headH * 0.08, (c % 2 ? 0.2 : -0.2), 0, Math.PI * 2);
      ctx.stroke();

      // Haeckel inner scalariform chamber ridge
      if (maturity > 0.4) {
        ctx.strokeStyle = `hsla(${colors[2]} 85% 88% / 0.45)`;
        ctx.lineWidth = 0.6;
        ctx.beginPath();
        ctx.ellipse(rx, ry, rw * 0.09, headH * 0.045, (c % 2 ? 0.2 : -0.2), 0, Math.PI * 2);
        ctx.stroke();
        ctx.strokeStyle = `hsla(${colors[2]} 90% 76% / 0.85)`;
        ctx.lineWidth = 1.1;
      }
    }
  }
  ctx.restore();
}

function drawGlobularPuffball(ctx, score, fb, maturity, elapsed, colors) {
  const rad = 24 * maturity;
  const ostioleRad = 3.5 * maturity;

  const bulbGrad = ctx.createRadialGradient(-rad * 0.25, rad * 0.3, 1, 0, rad * 0.5, rad * 1.1);
  bulbGrad.addColorStop(0, `hsla(${colors[2]} 80% 86% / 0.95)`);
  bulbGrad.addColorStop(0.5, `hsla(${colors[1]} ${score.saturation}% 62% / 0.85)`);
  bulbGrad.addColorStop(1, `hsla(${colors[0]} ${score.saturation}% 38% / 0.9)`);

  ctx.fillStyle = bulbGrad;
  ctx.strokeStyle = `hsla(${colors[2]} 90% 82% / 0.8)`;
  ctx.lineWidth = 1.2;

  ctx.beginPath();
  ctx.arc(0, rad, rad, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Haeckel pyramidal peridial scales / verrucae
  ctx.fillStyle = `hsla(${colors[2]} 100% 92% / 0.85)`;
  for (let w = 0; w < 16; w += 1) {
    const wAngle = (w / 16) * Math.PI * 2 + fb.id;
    const wx = Math.cos(wAngle) * rad * 0.78;
    const wy = rad + Math.sin(wAngle) * rad * 0.78;
    ctx.beginPath();
    ctx.arc(wx, wy, 1.2, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.fillStyle = `hsla(${colors[0]} 70% 12% / 0.95)`;
  ctx.strokeStyle = `hsla(${colors[2]} 100% 88% / 0.95)`;
  ctx.lineWidth = 1.3;
  ctx.beginPath();
  ctx.ellipse(0, rad * 2, ostioleRad, ostioleRad * 0.6, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  const puffPhase = (elapsed * 2.5 + fb.id) % 1;
  const puffY = rad * 2 + puffPhase * 16 * maturity;
  const puffAlpha = (1 - puffPhase) * 0.65;
  ctx.fillStyle = `hsla(${colors[2]} 90% 85% / ${puffAlpha})`;
  ctx.beginPath();
  ctx.arc(0, puffY, 2 + puffPhase * 5, 0, Math.PI * 2);
  ctx.fill();
}

function drawHyphalHydra(ctx, score, fb, maturity, elapsed, colors) {
  const stalkCount = 3 + (fb.id % 3);
  const stalkLen = 42 * maturity;

  for (let s = 0; s < stalkCount; s += 1) {
    const sFrac = (s / (stalkCount - 1 || 1)) - 0.5;
    const sAngle = Math.PI * 0.5 + sFrac * 0.85;
    const sway = Math.sin(elapsed * 2.4 + s + fb.id) * 4;
    const endX = Math.cos(sAngle) * stalkLen + sway;
    const endY = Math.sin(sAngle) * stalkLen;

    ctx.strokeStyle = `hsla(${colors[1]} 65% 75% / 0.8)`;
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.quadraticCurveTo(endX * 0.4, endY * 0.5 + sway, endX, endY);
    ctx.stroke();

    ctx.save();
    ctx.translate(endX, endY);
    ctx.fillStyle = `hsla(${colors[0]} ${score.saturation}% 48% / 0.92)`;
    ctx.strokeStyle = `hsla(${colors[2]} 100% 84% / 0.9)`;
    ctx.lineWidth = 1.0;
    ctx.beginPath();
    ctx.ellipse(0, 0, 5 * maturity, 8 * maturity, sFrac * 0.4, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = `hsla(${colors[2]} 100% 92% / 0.95)`;
    ctx.fillRect(-1, -4 * maturity, 2, 8 * maturity);

    // Pendant aculei / spine rows
    if (maturity > 0.4) {
      ctx.strokeStyle = `hsla(${colors[2]} 90% 85% / 0.55)`;
      ctx.lineWidth = 0.7;
      for (let tooth = -2; tooth <= 2; tooth += 1) {
        ctx.beginPath();
        ctx.moveTo(tooth * 2, 8 * maturity);
        ctx.lineTo(tooth * 2, 12 * maturity);
        ctx.stroke();
      }
    }

    ctx.strokeStyle = `hsla(${colors[2]} 90% 82% / 0.45)`;
    ctx.lineWidth = 0.7;
    ctx.beginPath();
    ctx.moveTo(0, 7 * maturity);
    ctx.quadraticCurveTo(sway * 0.8, 14 * maturity, sway * 1.5, 20 * maturity);
    ctx.stroke();
    ctx.restore();
  }
}

export function drawFruitingBodies(ctx, score, fruitingBodies, base, growth, elapsed, colors) {
  if (!fruitingBodies || growth <= 0.05) return;

  for (const fb of fruitingBodies) {
    const maturity = Math.max(0, Math.min(1, (growth - fb.sproutDelay) / (1 - fb.sproutDelay)));
    if (maturity <= 0.01) continue;

    const currentScale = fb.size * (0.2 + 0.8 * maturity);
    const anchorX = fb.x * base;
    const anchorY = fb.y * base;
    const breathing = Math.sin(elapsed * 2.2 + fb.id * 1.7) * (0.04 + interaction.hold * 0.06);
    const currentAngle = fb.angle + fb.tilt + breathing;

    ctx.save();
    ctx.translate(anchorX, anchorY);
    ctx.rotate(currentAngle);
    ctx.scale(currentScale, currentScale);

    switch (fb.archetype) {
      case 0: drawAgaricCap(ctx, score, fb, maturity, elapsed, colors); break;
      case 1: drawBracketConk(ctx, score, fb, maturity, elapsed, colors); break;
      case 2: drawCoralClavaria(ctx, score, fb, maturity, elapsed, colors); break;
      case 3: drawBioluminescentBonnet(ctx, score, fb, maturity, elapsed, colors); break;
      case 4: drawCupPeziza(ctx, score, fb, maturity, elapsed, colors); break;
      case 5: drawMorelHoneycomb(ctx, score, fb, maturity, elapsed, colors); break;
      case 6: drawGlobularPuffball(ctx, score, fb, maturity, elapsed, colors); break;
      case 7: drawHyphalHydra(ctx, score, fb, maturity, elapsed, colors); break;
      default: drawAgaricCap(ctx, score, fb, maturity, elapsed, colors); break;
    }
    ctx.restore();
  }
}

export function stepInteraction(timestamp, reducedMotion, { stageContainer = null, stageCaption = null, onUpdateAudioInteraction = null } = {}) {
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
    interaction.morphPhase += dt * (interaction.hold * 2.2 + interaction.dragSpeed * 4.8 + interaction.tap * 1.9 + (interaction.agitation || 0) * 2.5);
  }
  const targetPitch = interaction.active
    ? -interaction.smoothY
    : interaction.tap * 0.25;
  interaction.pitchBend += (targetPitch - interaction.pitchBend) * Math.min(1, dt * 6.5);
  interaction.ripples = interaction.ripples.filter((ripple) => (timestamp - ripple.bornAt) < (ripple.duration || 920));

  // Agitation decay when tapping pauses
  if (timestamp > interaction.lastTapAt + 1400 && timestamp > interaction.retaliateUntil) {
    interaction.agitation *= Math.exp(-dt * 0.72);
    if (interaction.agitation < 0.02) {
      interaction.agitation = 0;
      interaction.tapStreak = 0;
    }
  }

  // Lunge, flash, and retaliation pitch drop decay
  interaction.lunge *= Math.exp(-dt * 5.2);
  interaction.retaliationFlash *= Math.exp(-dt * 3.4);
  interaction.retaliationPitchDrop *= Math.exp(-dt * 2.4);

  // Sulk recovery during cooldown
  const isCooldown = timestamp < interaction.cooldownUntil;
  const targetSulk = isCooldown ? 1 : 0;
  interaction.sulk += (targetSulk - interaction.sulk) * Math.min(1, dt * (isCooldown ? 4.5 : 1.2));

  // Sync vitrine stage CSS classes
  const isRetaliating = timestamp < interaction.retaliateUntil;
  if (stageContainer) {
    if (isRetaliating) {
      stageContainer.classList.add("is-retaliating");
      stageContainer.classList.remove("is-agitated");
    } else if (interaction.agitation >= 0.38) {
      stageContainer.classList.add("is-agitated");
      stageContainer.classList.remove("is-retaliating");
    } else {
      stageContainer.classList.remove("is-retaliating", "is-agitated");
    }
    if (interaction.sulk > 0.05) {
      stageContainer.classList.add("is-sulking");
    } else {
      stageContainer.classList.remove("is-sulking");
    }
  }

  // Dynamic stage caption
  if (stageCaption) {
    if (isRetaliating) {
      stageCaption.textContent = "RETALIATION! · THE SPECIMEN STRUCK THE GLASS!";
    } else if (interaction.sulk > 0.15) {
      stageCaption.textContent = "SPECIMEN SULKING · RECOVERING IN DARKNESS";
    } else if (interaction.agitation >= 0.55) {
      stageCaption.textContent = "WARNING: ORGANISM AGITATED · CEASE TAPPING!";
    } else if (interaction.agitation >= 0.25) {
      stageCaption.textContent = "ECTOPLASMIC APPARITION · IRRITATION RISING";
    } else {
      stageCaption.textContent = "ECTOPLASMIC APPARITION · DO NOT TAP THE VITRINE";
    }
  }

  onUpdateAudioInteraction?.();
}

export function buildGlassCondensation(seed) {
  const rng = mulberry32((seed ^ 0x91a55c01) >>> 0);
  const drops = [];
  // Left curved vitrine wall
  for (let i = 0; i < 16; i += 1) {
    drops.push({
      normX: 0.035 + rng() * 0.08,
      normY: 0.16 + rng() * 0.70,
      size: 0.8 + rng() * 1.8,
      alpha: 0.22 + rng() * 0.45,
      phase: rng() * Math.PI * 2,
    });
  }
  // Right curved vitrine wall
  for (let i = 0; i < 16; i += 1) {
    drops.push({
      normX: 0.885 + rng() * 0.08,
      normY: 0.16 + rng() * 0.70,
      size: 0.8 + rng() * 1.8,
      alpha: 0.22 + rng() * 0.45,
      phase: rng() * Math.PI * 2,
    });
  }
  // Upper curved bell jar dome
  for (let i = 0; i < 14; i += 1) {
    const t = (i + 0.5) / 14;
    drops.push({
      normX: 0.16 + t * 0.68 + (rng() - 0.5) * 0.04,
      normY: 0.055 + Math.sin(t * Math.PI) * 0.11 + rng() * 0.04,
      size: 0.7 + rng() * 1.5,
      alpha: 0.2 + rng() * 0.42,
      phase: rng() * Math.PI * 2,
    });
  }
  return drops;
}

export function drawVitrinePedestal(ctx, width, height, colors, score, elapsed) {
  const pedestalY = height * 0.91;
  const pedestalW = width * 0.84;
  const pedestalX = (width - pedestalW) * 0.5;

  ctx.save();

  // 1. Turned-wood Plinth Base (Victorian specimen mount)
  const woodGrad = ctx.createLinearGradient(0, pedestalY, 0, height);
  woodGrad.addColorStop(0, "hsl(25 24% 16%)");
  woodGrad.addColorStop(0.2, "hsl(25 28% 10%)");
  woodGrad.addColorStop(0.7, "hsl(25 32% 6%)");
  woodGrad.addColorStop(1, "hsl(20 30% 3%)");

  // Bottom stepped tier
  ctx.fillStyle = woodGrad;
  ctx.beginPath();
  if (typeof ctx.roundRect === "function") {
    ctx.roundRect(pedestalX, pedestalY + 12, pedestalW, height - (pedestalY + 12), [4, 4, 0, 0]);
  } else {
    ctx.rect(pedestalX, pedestalY + 12, pedestalW, height - (pedestalY + 12));
  }
  ctx.fill();

  // Middle stepped bevel
  const midW = pedestalW * 0.92;
  const midX = (width - midW) * 0.5;
  ctx.beginPath();
  if (typeof ctx.roundRect === "function") {
    ctx.roundRect(midX, pedestalY + 4, midW, 10, [3, 3, 0, 0]);
  } else {
    ctx.rect(midX, pedestalY + 4, midW, 10);
  }
  ctx.fill();

  // Polished brass channel ring where the vitrine bell jar rests
  const brassW = pedestalW * 0.86;
  const brassX = (width - brassW) * 0.5;
  ctx.strokeStyle = "hsla(42 75% 62% / 0.78)";
  ctx.lineWidth = 1.6;
  ctx.beginPath();
  ctx.moveTo(brassX, pedestalY + 4);
  ctx.lineTo(brassX + brassW, pedestalY + 4);
  ctx.stroke();

  // Brass specular highlight
  ctx.strokeStyle = "hsla(45 95% 88% / 0.65)";
  ctx.lineWidth = 0.8;
  ctx.beginPath();
  ctx.moveTo(brassX + brassW * 0.25, pedestalY + 3.5);
  ctx.lineTo(brassX + brassW * 0.45, pedestalY + 3.5);
  ctx.stroke();

  // 2. Bed of fibrous peat, decaying driftwood, and living lichen substrate
  const peatMounds = [
    { x: width * 0.22, y: pedestalY + 3, rx: width * 0.14, ry: 9, hue: 85 },
    { x: width * 0.48, y: pedestalY + 1, rx: width * 0.18, ry: 11, hue: 45 },
    { x: width * 0.74, y: pedestalY + 2, rx: width * 0.15, ry: 10, hue: 75 },
    { x: width * 0.35, y: pedestalY + 5, rx: width * 0.12, ry: 8, hue: 105 },
    { x: width * 0.62, y: pedestalY + 4, rx: width * 0.13, ry: 8, hue: 65 },
  ];

  for (const m of peatMounds) {
    const moundGrad = ctx.createRadialGradient(m.x, m.y - 2, 1, m.x, m.y, m.rx);
    moundGrad.addColorStop(0, `hsla(${m.hue} 42% 16% / 0.92)`);
    moundGrad.addColorStop(0.65, `hsla(${m.hue - 15} 35% 10% / 0.95)`);
    moundGrad.addColorStop(1, "hsla(25 28% 6% / 0.98)");
    ctx.fillStyle = moundGrad;
    ctx.beginPath();
    ctx.ellipse(m.x, m.y, m.rx, m.ry, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  // Lichen flakes and fibrous botanical rootlets
  const seedRng = mulberry32((score.seed ^ 0x5b3a8e12) >>> 0);
  ctx.fillStyle = `hsla(${colors[2]} 65% 72% / 0.42)`;
  for (let i = 0; i < 24; i += 1) {
    const lx = brassX + seedRng() * brassW;
    const ly = pedestalY - 2 + seedRng() * 9;
    ctx.beginPath();
    ctx.arc(lx, ly, 0.8 + seedRng() * 1.1, 0, Math.PI * 2);
    ctx.fill();
  }

  // Driftwood grain lines
  ctx.strokeStyle = "hsla(30 25% 22% / 0.4)";
  ctx.lineWidth = 0.8;
  for (let d = 0; d < 5; d += 1) {
    const dy = pedestalY + 16 + d * 3;
    ctx.beginPath();
    ctx.moveTo(pedestalX + 15, dy);
    ctx.quadraticCurveTo(width * 0.5, dy + (d % 2 ? 1 : -1) * 2, pedestalX + pedestalW - 15, dy);
    ctx.stroke();
  }

  ctx.restore();
}

export function drawGlassCondensation(ctx, width, height, colors, score, elapsed, drops) {
  if (!drops || drops.length === 0) return;
  ctx.save();
  ctx.globalCompositeOperation = "screen";

  const bloomFactor = score.bloom / 100;
  const tapJitter = interaction.tap * 1.5 + (interaction.agitation || 0) * 2.2;

  for (const drop of drops) {
    const jitterX = Math.sin(elapsed * 24 + drop.phase) * tapJitter;
    const jitterY = Math.cos(elapsed * 24 + drop.phase) * tapJitter;
    const dx = drop.normX * width + jitterX;
    const dy = drop.normY * height + jitterY;

    const baseAlpha = drop.alpha * (0.65 + bloomFactor * 0.35 + interaction.hold * 0.15);
    // Droplet glow
    ctx.fillStyle = `hsla(${colors[2]} 85% 82% / ${baseAlpha})`;
    ctx.beginPath();
    ctx.arc(dx, dy, drop.size * (1 + interaction.tap * 0.3), 0, Math.PI * 2);
    ctx.fill();

    // Tiny specular glint
    ctx.fillStyle = `rgba(255, 255, 255, ${Math.min(0.9, baseAlpha * 1.6)})`;
    ctx.beginPath();
    ctx.arc(dx - drop.size * 0.3, dy - drop.size * 0.3, drop.size * 0.35, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

export class OracleVision {
  constructor(canvas, { stageContainer = null, stageCaption = null, onUpdateAudioInteraction = null } = {}) {
    this.canvas = canvas;
    this.stageContainer = stageContainer;
    this.stageCaption = stageCaption;
    this.onUpdateAudioInteraction = onUpdateAudioInteraction;
    this.context = canvas.getContext("2d", { alpha: false });
    this.score = {
      seed: 132071, pulse: 72, hue: 274, hueShift: 126, saturation: 88, palette: 2,
      symmetry: 7, twist: 4, bloom: 66, melodyMode: 1, melodyTurn: 0,
      eyes: 3, eyeShape: 3, irisStyle: 2,
      pupilShape: 1, irisHue: 164, irisShift: 72, eyeSize: 68, gaze: 1, eyeLayout: 0,
      shape: 0, size: 66, edge: 50, motion: 2, kineticMode: 0, kineticSpeed: 64,
      kineticDepth: 72, kineticTilt: 3, fluxMode: 1,
      fungalForm: 0, fungalName: "AGARIC CAP", fungalHyphae: 64, fungalSpores: 55, fungalBloom: 60,
      funVoice: 0, funBright: 0, funSpread: 2,
      harmonyTurn: 0, harmonySwap: 0, harmonyBorrow: 0, harmonyCadence: 0, harmonyPace: 0, harmonyCharacter: 0,
    };
    this.startedAt = performance.now();
    this.particles = [];
    this.mycelium = null;
    this.fruitingBodies = [];
    this.spores = [];
    this.glassCondensation = [];
    // Re-read when the visitor changes the setting, not only at load (P4-02).
    const motionQuery = matchMedia("(prefers-reduced-motion: reduce)");
    this.reducedMotion = motionQuery.matches;
    motionQuery.addEventListener?.("change", (event) => {
      this.reducedMotion = event.matches;
    });
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
    this.mycelium = buildMycelialNetwork(score);
    this.fruitingBodies = buildFruitingBodies(score, this.mycelium);
    this.spores = buildSporeSystem(score, this.fruitingBodies);
    this.glassCondensation = buildGlassCondensation(score.seed);
  }

  burstSpores(strength = 1) {
    if (!this.spores) return;
    for (const sp of this.spores) {
      const angle = Math.atan2(sp.y, sp.x);
      sp.vx += Math.cos(angle) * (1.2 + Math.random() * 2.2) * strength;
      sp.vy += Math.sin(angle) * (1.2 + Math.random() * 2.2) * strength;
      sp.life = Math.min(1.0, sp.life + 0.35);
    }
  }

  updateAndDrawSpores(ctx, score, base, elapsed, colors, timestamp) {
    if (!this.spores || this.spores.length === 0) return;
    const dt = 0.016;
    const tapImpulse = interaction.tap * 4.2;
    const holdBoost = interaction.hold * 0.5;

    ctx.save();
    ctx.globalCompositeOperation = "screen";

    for (let i = 0; i < this.spores.length; i += 1) {
      const sp = this.spores[i];
      sp.life -= dt / sp.maxLife;

      if (sp.life <= 0) {
        const fb = this.fruitingBodies[sp.fbIndex % (this.fruitingBodies.length || 1)];
        if (fb) {
          const fbScale = fb.size * base;
          sp.x = fb.x * base + (Math.random() - 0.5) * fbScale * 0.4;
          sp.y = fb.y * base + (Math.random() - 0.5) * fbScale * 0.4;
          const outAngle = fb.angle + fb.tilt;
          sp.vx = Math.cos(outAngle) * (0.2 + Math.random() * 0.6);
          sp.vy = Math.sin(outAngle) * (0.2 + Math.random() * 0.6) - 0.3;
        } else {
          sp.x = (Math.random() - 0.5) * base;
          sp.y = (Math.random() - 0.5) * base;
          sp.vx = (Math.random() - 0.5) * 0.4;
          sp.vy = -0.3;
        }
        sp.life = 1.0;
      }

      if (!this.reducedMotion) {
        sp.x += sp.vx;
        sp.y += sp.vy;
        sp.vy -= 0.04 * dt * 60;
        sp.vx += Math.sin(elapsed * 1.8 + sp.y * 0.01) * 0.08 * dt * 60;

        if (tapImpulse > 0.1) {
          const rad = Math.hypot(sp.x, sp.y) || 1;
          sp.vx += (sp.x / rad) * tapImpulse * 0.7;
          sp.vy += (sp.y / rad) * tapImpulse * 0.7;
        }

        if (interaction.dragSpeed > 0.05) {
          const ptrDistX = (interaction.smoothX * base) - sp.x;
          const ptrDistY = (interaction.smoothY * base) - sp.y;
          const ptrDist = Math.hypot(ptrDistX, ptrDistY);
          if (ptrDist < base * 0.75 && ptrDist > 5) {
            sp.vx += (ptrDistX / ptrDist) * interaction.dragSpeed * 0.5;
            sp.vy += (ptrDistY / ptrDist) * interaction.dragSpeed * 0.5;
          }
        }
      }

      const sporeAlpha = sp.life * (0.35 + holdBoost * 0.45);
      const sporeHue = wrapHue(colors[2] + sp.hueOffset);
      ctx.fillStyle = `hsla(${sporeHue} 100% 82% / ${sporeAlpha})`;
      ctx.beginPath();
      ctx.arc(sp.x, sp.y, sp.size * (1 + interaction.tap * 0.4), 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }

  draw(timestamp) {
    stepInteraction(timestamp, this.reducedMotion, {
      stageContainer: this.stageContainer,
      stageCaption: this.stageCaption,
      onUpdateAudioInteraction: this.onUpdateAudioInteraction,
    });
    const ctx = this.context;
    const score = this.score;
    const width = this.width;
    const height = this.height;
    const elapsed = this.reducedMotion ? 1.25 : (timestamp - this.startedAt) / 1000;
    const colors = paletteFor(score);
    const naturalGrowth = this.reducedMotion ? 1.0 : Math.min(1.0, elapsed / 10.0);
    const growth = Math.min(1.0, naturalGrowth + interaction.hold * 0.35 + interaction.tap * 0.25);

    const glowFocusX = width * (0.5 + interaction.smoothX * 0.28);
    const glowFocusY = height * (0.48 + interaction.smoothY * 0.24);
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

    drawVitrinePedestal(ctx, width, height, colors, score, elapsed);

    const orbitDistance = this.reducedMotion ? 0 : score.motion * Math.min(width, height) * 0.004;
    const maxTugX = width * 0.32;
    const maxTugY = height * 0.24;
    const tugX = this.reducedMotion ? 0 : interaction.smoothX * maxTugX * (0.65 + interaction.hold * 0.35);
    const tugY = this.reducedMotion ? 0 : interaction.smoothY * maxTugY * (0.65 + interaction.hold * 0.35);
    const lungeShiftX = this.reducedMotion ? 0 : (interaction.retaliationPoint.x * width * 0.22 * interaction.lunge);
    const lungeShiftY = this.reducedMotion ? 0 : (interaction.retaliationPoint.y * height * 0.22 * interaction.lunge);
    const agitationShudder = this.reducedMotion ? 0 : (interaction.agitation * Math.sin(elapsed * 48) * 3);
    const sulkRetreatY = interaction.sulk * height * 0.06;
    const centerX = width * 0.5 + Math.cos(elapsed * 0.21) * orbitDistance + tugX + lungeShiftX + agitationShudder;
    const centerY = height * 0.5 + Math.sin(elapsed * 0.27) * orbitDistance + tugY + lungeShiftY + sulkRetreatY;
    const lungeScale = this.reducedMotion ? (interaction.lunge * 0.18) : (interaction.lunge * 0.42);
    const sulkScale = interaction.sulk * 0.2;
    const sizeFactor = (0.15 + score.size / 100 * (width < 760 ? 0.14 : 0.22)) * (1 + lungeScale - sulkScale);
    const base = Math.min(width, height) * sizeFactor;
    const points = Math.max(120, score.symmetry * 28);
    const dragDist = Math.hypot(interaction.smoothX, interaction.smoothY);
    const dragAngle = Math.atan2(interaction.smoothY, interaction.smoothX);
    const stretchAmount = this.reducedMotion ? 0 : (dragDist * 0.16 + interaction.dragSpeed * 0.22) * interaction.hold;
    const stretchX = 1 + (Math.cos(dragAngle) ** 2) * stretchAmount - (Math.sin(dragAngle) ** 2) * stretchAmount * 0.45 + (interaction.tap * 0.06);
    const stretchY = 1 + (Math.sin(dragAngle) ** 2) * stretchAmount - (Math.cos(dragAngle) ** 2) * stretchAmount * 0.45 - (interaction.tap * 0.05);
    const aspectX = [1, 1, 1.08, 1, 0.9, 1.16, 1.25, 1, 0.92, 0.88][score.shape] * stretchX;
    const aspectY = [1, 1, 0.92, 1, 1.12, 0.88, 0.72, 1, 1.08, 1.25][score.shape] * stretchY;

    ctx.save();
    ctx.translate(centerX, centerY);
    const direction = score.kineticTilt % 2 ? 1 : -1;
    ctx.rotate(this.reducedMotion ? 0.16 : (elapsed * (0.004 + score.kineticSpeed / 12000) + interaction.morphPhase * 0.14) * direction);
    ctx.scale(aspectX, aspectY);

    drawMycelium(ctx, score, this.mycelium, base, growth, elapsed, colors);
    drawFruitingBodies(ctx, score, this.fruitingBodies, base, growth, elapsed, colors);

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
      drawCellularAppendage(ctx, score, eye, base, elapsed, colors);
    }

    this.updateAndDrawSpores(ctx, score, base, elapsed, colors, timestamp);
    ctx.restore();

    drawGlassCondensation(ctx, width, height, colors, score, elapsed, this.glassCondensation);

    if (interaction.ripples.length > 0) {
      ctx.save();
      ctx.globalCompositeOperation = "screen";
      for (const ripple of interaction.ripples) {
        const rippleDuration = ripple.duration || 920;
        const age = Math.max(0, (timestamp - ripple.bornAt) / rippleDuration);
        const rx = (ripple.x * 0.5 + 0.5) * width;
        const ry = (ripple.y * 0.5 + 0.5) * height;
        const rippleRadius = base * (0.1 + age * (0.95 + ripple.strength * 0.45));
        if (ripple.isRetaliation) {
          ctx.strokeStyle = `hsla(42 100% 88% / ${(1 - age) ** 1.2 * 0.85})`;
          ctx.lineWidth = 3.2 * (1 - age * 0.5);
          ctx.beginPath();
          ctx.arc(rx, ry, rippleRadius * 1.3, 0, Math.PI * 2);
          ctx.stroke();
          if (age > 0.12) {
            const age2 = (age - 0.12) / 0.88;
            ctx.strokeStyle = `hsla(${colors[2]} 100% 75% / ${(1 - age2) ** 1.5 * 0.65})`;
            ctx.lineWidth = 2.0 * (1 - age2);
            ctx.beginPath();
            ctx.arc(rx, ry, rippleRadius * 0.85, 0, Math.PI * 2);
            ctx.stroke();
          }
        } else {
          ctx.strokeStyle = `hsla(${colors[2]} 100% 86% / ${(1 - age) ** 1.6 * 0.52})`;
          ctx.lineWidth = 1.6 * (1 - age * 0.6);
          ctx.beginPath();
          ctx.arc(rx, ry, rippleRadius, 0, Math.PI * 2);
          ctx.stroke();
        }
      }
      ctx.restore();
    }

    if (interaction.retaliationFlash > 0.01) {
      ctx.save();
      ctx.globalCompositeOperation = "screen";
      const rx = (interaction.retaliationPoint.x * 0.5 + 0.5) * width;
      const ry = (interaction.retaliationPoint.y * 0.5 + 0.5) * height;

      const flashGrad = ctx.createRadialGradient(rx, ry, 0, rx, ry, Math.max(width, height) * 0.75);
      flashGrad.addColorStop(0, `hsla(45 100% 95% / ${interaction.retaliationFlash * 0.65})`);
      flashGrad.addColorStop(0.35, `hsla(${colors[2]} 90% 70% / ${interaction.retaliationFlash * 0.35})`);
      flashGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = flashGrad;
      ctx.fillRect(0, 0, width, height);

      if (interaction.retaliationFractures && interaction.retaliationFractures.length > 0) {
        ctx.strokeStyle = `hsla(45 100% 92% / ${interaction.retaliationFlash * 0.85})`;
        ctx.shadowColor = `hsla(35 100% 70% / ${interaction.retaliationFlash * 0.9})`;
        ctx.shadowBlur = 8 * interaction.retaliationFlash;
        ctx.lineWidth = 1.8 * interaction.retaliationFlash;
        for (const segments of interaction.retaliationFractures) {
          ctx.beginPath();
          ctx.moveTo(rx, ry);
          for (const seg of segments) {
            const sx = rx + Math.cos(seg.a) * seg.r;
            const sy = ry + Math.sin(seg.a) * seg.r;
            ctx.lineTo(sx, sy);
          }
          ctx.stroke();
        }
      }
      ctx.restore();
    }

    requestAnimationFrame(this.draw);
  }
}
