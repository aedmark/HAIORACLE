import { melodyFor } from "./music.mjs";

const GRID_WIDTH = 80;
const GRID_HEIGHT = 25;

const VALID_COMMANDS = new Set([
  ..."0123456789",
  "+", "-", "*", "%", "`", "!",
  ">", "<", "^", "v", "/", "\\", "_", "|", "#",
  ":", "$", ".", "&", "g", "p", "@", " ",
]);

export const HARMONY_NAMES = Object.freeze([
  "PARLOR REED ORGAN",
  "HARPSICHORD PINBALL",
  "CATHEDRAL SWELL",
  "CLOCKWORK CELESTA",
  "PHANTOM CALLIOPE",
  "GLASS HARMONICA",
  "VICTORIAN HARMONIUM",
  "ASTRAL CARILLON",
]);

// Per-archetype 12-step rhythmic gate templates (0=rest, 1=staccato/strum, 2=sustained organ swell)
const ORGAN_GATES = Object.freeze([
  // 0: PARLOR REED ORGAN
  Object.freeze([2, 0, 0, 1, 0, 0, 2, 0, 0, 1, 0, 1]),
  // 1: HARPSICHORD PINBALL
  Object.freeze([1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 2]),
  // 2: CATHEDRAL SWELL
  Object.freeze([2, 0, 0, 0, 2, 0, 0, 0, 2, 0, 0, 1]),
  // 3: CLOCKWORK CELESTA
  Object.freeze([1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 2]),
  // 4: PHANTOM CALLIOPE
  Object.freeze([0, 1, 0, 2, 0, 1, 0, 1, 0, 2, 0, 1]),
  // 5: GLASS HARMONICA
  Object.freeze([2, 0, 1, 0, 0, 2, 2, 0, 1, 0, 0, 2]),
  // 6: VICTORIAN HARMONIUM
  Object.freeze([2, 0, 1, 2, 0, 1, 2, 0, 1, 2, 0, 1]),
  // 7: ASTRAL CARILLON
  Object.freeze([1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 0, 2]),
]);

export function runBefunge(source, input = [], maxSteps = 4096) {
  if (typeof source !== "string") {
    throw new TypeError("Befunge source must be a string");
  }

  const lines = source.replace(/\r\n?/g, "\n").split("\n");
  while (lines.length > 0 && lines[lines.length - 1].trim() === "") {
    lines.pop();
  }

  if (lines.length === 0) {
    throw new Error("Befunge program is empty");
  }
  if (lines.length > GRID_HEIGHT) {
    throw new Error(`Befunge program exceeds ${GRID_HEIGHT} rows`);
  }

  const grid = Array.from({ length: GRID_HEIGHT }, () => (
    new Uint8Array(GRID_WIDTH).fill(32)
  ));

  let hasHalt = false;
  for (let row = 0; row < lines.length; row += 1) {
    const line = lines[row];
    if (line.length > GRID_WIDTH) {
      throw new Error(`Befunge line ${row + 1}: Row exceeds ${GRID_WIDTH} columns`);
    }
    for (let col = 0; col < line.length; col += 1) {
      const ch = line[col];
      if (!VALID_COMMANDS.has(ch)) {
        throw new Error(`Befunge line ${row + 1}: Unsupported instruction '${ch}' at column ${col + 1}`);
      }
      if (ch === "@") hasHalt = true;
      grid[row][col] = ch.charCodeAt(0);
    }
  }

  if (!hasHalt) {
    throw new Error("Befunge line 1: Program must contain a halting '@' instruction");
  }

  const stack = [];
  const pop = () => (stack.length > 0 ? stack.pop() : 0);
  const push = (val) => stack.push(val | 0);

  let x = 0;
  let y = 0;
  let dx = 1;
  let dy = 0;
  let inputIndex = 0;
  let stepsExecuted = 0;
  let mirrorsHit = 0;
  const output = [];

  while (stepsExecuted < maxSteps) {
    const ch = String.fromCharCode(grid[y][x]);
    stepsExecuted += 1;

    if (ch === "@") {
      return {
        output,
        stepsExecuted,
        mirrorsHit,
        stackDepth: stack.length,
      };
    }

    if (ch >= "0" && ch <= "9") {
      push(ch.charCodeAt(0) - 48);
    } else {
      switch (ch) {
        case "+": {
          const a = pop();
          const b = pop();
          push(b + a);
          break;
        }
        case "-": {
          const a = pop();
          const b = pop();
          push(b - a);
          break;
        }
        case "*": {
          const a = pop();
          const b = pop();
          push(Math.imul(b, a));
          break;
        }
        case "%": {
          const a = pop();
          const b = pop();
          push(a === 0 ? 0 : Math.abs(b) % Math.abs(a));
          break;
        }
        case "`": {
          const a = pop();
          const b = pop();
          push(b > a ? 1 : 0);
          break;
        }
        case "!": {
          const a = pop();
          push(a === 0 ? 1 : 0);
          break;
        }
        case ">":
          dx = 1;
          dy = 0;
          break;
        case "<":
          dx = -1;
          dy = 0;
          break;
        case "^":
          dx = 0;
          dy = -1;
          break;
        case "v":
          dx = 0;
          dy = 1;
          break;
        case "/": {
          const nextDx = -dy;
          const nextDy = -dx;
          dx = nextDx;
          dy = nextDy;
          mirrorsHit += 1;
          break;
        }
        case "\\": {
          const nextDx = dy;
          const nextDy = dx;
          dx = nextDx;
          dy = nextDy;
          mirrorsHit += 1;
          break;
        }
        case "_":
          dx = pop() === 0 ? 1 : -1;
          dy = 0;
          break;
        case "|":
          dx = 0;
          dy = pop() === 0 ? 1 : -1;
          break;
        case "#":
          x = (x + dx + GRID_WIDTH) % GRID_WIDTH;
          y = (y + dy + GRID_HEIGHT) % GRID_HEIGHT;
          break;
        case ":": {
          const top = pop();
          push(top);
          push(top);
          break;
        }
        case "$":
          pop();
          break;
        case ".":
          output.push(pop() & 0xff);
          break;
        case "&":
          push(inputIndex < input.length ? (input[inputIndex++] & 0xff) : 0);
          break;
        case "g": {
          const gy = ((pop() % GRID_HEIGHT) + GRID_HEIGHT) % GRID_HEIGHT;
          const gx = ((pop() % GRID_WIDTH) + GRID_WIDTH) % GRID_WIDTH;
          push(grid[gy][gx]);
          break;
        }
        case "p": {
          const py = ((pop() % GRID_HEIGHT) + GRID_HEIGHT) % GRID_HEIGHT;
          const px = ((pop() % GRID_WIDTH) + GRID_WIDTH) % GRID_WIDTH;
          const val = pop() & 0xff;
          grid[py][px] = val;
          break;
        }
        case " ":
        default:
          break;
      }
    }

    x = (x + dx + GRID_WIDTH) % GRID_WIDTH;
    y = (y + dy + GRID_HEIGHT) % GRID_HEIGHT;
  }

  throw new Error(`Befunge execution exceeded ${maxSteps} steps without halting`);
}

function harmonySeedBytesFor(seed, harmonyMode = 0, harmonyStrum = 45, mutation = 0) {
  const mixed = (seed ^ Math.imul(mutation >>> 0, 0x517cc1b7) ^ (harmonyMode << 15) ^ (harmonyStrum << 6)) >>> 0;
  let state = mixed || 0x243f6a88;
  const bytes = [];
  for (let i = 0; i < 12; i += 1) {
    state ^= state << 13;
    state ^= state >>> 17;
    state ^= state << 5;
    state = (state + Math.imul(i + 1 + harmonyMode, 0x9e3779b1)) >>> 0;
    bytes.push((state ^ (seed >>> ((i % 4) * 8))) & 0xff);
  }
  return bytes;
}

const ROMAN_DEGREES = Object.freeze(["I", "II", "III", "IV", "V", "VI"]);

function buildChordVoicing(stepIndex, rawByte, mirror, gate, melody) {
  if (gate === 0) {
    return {
      chord: Object.freeze([0, 7, 12]),
      degreeIndex: 0,
      label: "REST",
    };
  }
  const degreeIndex = (stepIndex + (rawByte % 6)) % 6;
  const rootNote = melody[(stepIndex + (rawByte % 3)) % melody.length] % 12;
  const thirdNote = melody[(stepIndex + 2 + (rawByte % 4)) % melody.length] % 12;
  const fifthNote = melody[(stepIndex + 4 + (rawByte % 5)) % melody.length] % 12;

  const n0 = rootNote;
  const n1 = thirdNote <= n0 ? thirdNote + 7 : thirdNote;
  const n2 = fifthNote <= n1 ? fifthNote + 12 : fifthNote;

  const ordered = mirror === "/"
    ? [n0, n1, n2]
    : [n2, n1, n0 + 12];

  const roman = ROMAN_DEGREES[degreeIndex];
  const ext = gate === 2 ? "9" : "7";
  return {
    chord: Object.freeze(ordered),
    degreeIndex,
    label: `${roman}${mirror}${ext}`,
  };
}

export function cycleHarmonyCell(step, score) {
  const melody = melodyFor(score);
  const nextGate = (step.gate + 1) % 3;
  const nextMirror = nextGate === 0 ? step.mirror : (step.mirror === "/" ? "\\" : "/");
  const nextRaw = (step.raw + 29) & 0xff;
  const voicing = buildChordVoicing(step.index, nextRaw, nextMirror, nextGate, melody);
  return Object.freeze({
    ...step,
    raw: nextRaw,
    gate: nextGate,
    mirror: nextMirror,
    chord: voicing.chord,
    degreeIndex: voicing.degreeIndex,
    label: voicing.label,
  });
}

export function composeHarmony(source, score, mutation = 0) {
  const harmonyMode = (score.harmonyMode ?? ((score.seed >>> 5) % 8)) & 7;
  const harmonyStrum = score.harmonyStrum ?? 48;
  const input = harmonySeedBytesFor(score.seed >>> 0, harmonyMode, harmonyStrum, mutation);
  const { output, stepsExecuted, mirrorsHit } = runBefunge(source, input);
  if (output.length < 12) {
    throw new Error(`Befunge harmony spell emitted ${output.length} voicings; expected at least 12`);
  }

  const melody = melodyFor(score);
  const gateTemplate = ORGAN_GATES[harmonyMode];

  const steps = Array.from({ length: 12 }, (_, index) => {
    const raw = output[index] & 0xff;
    let gate = gateTemplate[index];
    if (index === 0) {
      gate = Math.max(1, gate);
    } else if (gate === 0 && (raw % 9 === 0)) {
      gate = 1;
    }

    const mirror = ((raw + index + mutation) & 1) === 0 ? "/" : "\\";
    const voicing = buildChordVoicing(index, raw, mirror, gate, melody);

    return Object.freeze({
      index,
      raw,
      gate,
      mirror,
      chord: voicing.chord,
      degreeIndex: voicing.degreeIndex,
      strumMs: Math.round(8 + (harmonyStrum / 100) * 34),
      label: voicing.label,
    });
  });

  return Object.freeze({
    mode: harmonyMode,
    modeName: HARMONY_NAMES[harmonyMode],
    strum: harmonyStrum,
    mutation,
    stepsExecuted,
    mirrorsHit,
    steps: Object.freeze(steps),
  });
}
