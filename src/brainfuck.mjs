import { MELODY_NAMES, melodyFor } from "./music.mjs";

const TAPE_SIZE = 256;

export const BASS_NAMES = Object.freeze([
  "WALKING CELLAR",
  "ACID CATACOMB",
  "SUBTERRANEAN PEDAL",
  "TAPE-LOOP BOOGIE",
  "CRYPT ARPEGGIATOR",
  "PENDULUM OSTINATO",
  "PHANTOM FUGUE BASS",
  "SEANCE DUB SUB",
]);

// Groove templates per step: [gateLevel (0=rest, 1=staccato, 2=sustained), accent (0|1), register (0=sub, 1=upper), slide (0|1)]
const GROOVE_TEMPLATES = Object.freeze([
  // 0: WALKING CELLAR
  Object.freeze([
    [2, 1, 0, 0], [1, 0, 0, 0], [1, 0, 1, 0], [2, 0, 0, 1],
    [1, 0, 0, 0], [1, 0, 1, 0], [2, 1, 0, 0], [1, 0, 0, 0],
    [1, 0, 1, 0], [2, 0, 0, 1], [1, 0, 0, 0], [1, 1, 1, 1],
  ]),
  // 1: ACID CATACOMB
  Object.freeze([
    [1, 1, 0, 0], [1, 0, 1, 1], [0, 0, 0, 0], [1, 1, 1, 0],
    [2, 0, 0, 1], [1, 0, 1, 0], [1, 1, 0, 0], [0, 0, 0, 0],
    [1, 1, 1, 1], [1, 0, 0, 0], [1, 1, 1, 0], [2, 1, 0, 1],
  ]),
  // 2: SUBTERRANEAN PEDAL
  Object.freeze([
    [2, 1, 0, 0], [2, 0, 0, 1], [0, 0, 0, 0], [2, 0, 0, 0],
    [2, 0, 1, 1], [0, 0, 0, 0], [2, 1, 0, 0], [2, 0, 0, 1],
    [0, 0, 0, 0], [2, 0, 0, 0], [1, 0, 1, 0], [2, 1, 0, 1],
  ]),
  // 3: TAPE-LOOP BOOGIE
  Object.freeze([
    [1, 1, 0, 0], [1, 0, 1, 0], [1, 0, 0, 0], [1, 1, 1, 1],
    [1, 0, 0, 0], [1, 0, 1, 0], [1, 1, 0, 0], [1, 0, 1, 0],
    [1, 0, 0, 0], [1, 1, 1, 1], [1, 0, 0, 0], [1, 1, 1, 0],
  ]),
  // 4: CRYPT ARPEGGIATOR
  Object.freeze([
    [2, 1, 0, 0], [1, 0, 0, 0], [1, 0, 1, 1], [1, 1, 1, 0],
    [1, 0, 0, 0], [1, 0, 1, 0], [2, 1, 0, 0], [1, 0, 0, 0],
    [1, 0, 1, 1], [1, 1, 1, 0], [1, 0, 1, 0], [2, 0, 0, 1],
  ]),
  // 5: PENDULUM OSTINATO
  Object.freeze([
    [2, 1, 0, 0], [0, 0, 0, 0], [1, 0, 1, 0], [2, 0, 0, 1],
    [0, 0, 0, 0], [1, 1, 1, 0], [2, 1, 0, 0], [0, 0, 0, 0],
    [1, 0, 1, 0], [2, 0, 0, 1], [0, 0, 0, 0], [1, 1, 1, 1],
  ]),
  // 6: PHANTOM FUGUE BASS
  Object.freeze([
    [2, 1, 0, 0], [1, 0, 0, 0], [1, 0, 0, 1], [1, 0, 1, 0],
    [2, 1, 0, 0], [1, 0, 1, 1], [1, 0, 0, 0], [1, 1, 0, 0],
    [2, 0, 0, 1], [1, 0, 1, 0], [1, 0, 0, 0], [2, 1, 1, 1],
  ]),
  // 7: SEANCE DUB SUB
  Object.freeze([
    [2, 1, 0, 1], [0, 0, 0, 0], [0, 0, 0, 0], [1, 0, 0, 0],
    [2, 1, 0, 1], [0, 0, 0, 0], [2, 1, 0, 0], [0, 0, 0, 0],
    [1, 0, 1, 0], [2, 1, 0, 1], [0, 0, 0, 0], [1, 0, 0, 1],
  ]),
]);

export function runBrainfuck(source, input = [], maxSteps = 8192) {
  if (typeof source !== "string") {
    throw new TypeError("Brainfuck source must be a string");
  }

  const instructions = [];
  const jumpTable = new Int32Array(source.length).fill(-1);
  const bracketStack = [];
  const lines = source.replace(/\r\n?/g, "\n").split("\n");

  for (let lineIndex = 0; lineIndex < lines.length; lineIndex += 1) {
    const line = lines[lineIndex];
    for (let colIndex = 0; colIndex < line.length; colIndex += 1) {
      const ch = line[colIndex];
      if (!"><+-.,[]".includes(ch)) continue;
      const pc = instructions.length;
      instructions.push({ op: ch, line: lineIndex + 1, col: colIndex + 1 });
      if (ch === "[") {
        bracketStack.push(pc);
      } else if (ch === "]") {
        if (bracketStack.length === 0) {
          throw new Error(`Brainfuck line ${lineIndex + 1}: Unmatched ']' at column ${colIndex + 1}`);
        }
        const openPc = bracketStack.pop();
        jumpTable[openPc] = pc;
        jumpTable[pc] = openPc;
      }
    }
  }

  if (bracketStack.length > 0) {
    const unclosed = instructions[bracketStack[bracketStack.length - 1]];
    throw new Error(`Brainfuck line ${unclosed.line}: Unmatched '[' at column ${unclosed.col}`);
  }

  if (instructions.length === 0) {
    throw new Error("Brainfuck program contains no instructions");
  }

  const tape = new Uint8Array(TAPE_SIZE);
  let pointer = 0;
  let pc = 0;
  let inputIndex = 0;
  let stepsExecuted = 0;
  const output = [];

  while (pc < instructions.length) {
    if (stepsExecuted >= maxSteps) {
      throw new Error(`Brainfuck execution exceeded ${maxSteps} steps without halting`);
    }

    const { op } = instructions[pc];
    stepsExecuted += 1;

    switch (op) {
      case ">":
        pointer = (pointer + 1) & 0xff;
        break;
      case "<":
        pointer = (pointer - 1) & 0xff;
        break;
      case "+":
        tape[pointer] = (tape[pointer] + 1) & 0xff;
        break;
      case "-":
        tape[pointer] = (tape[pointer] - 1) & 0xff;
        break;
      case ".":
        output.push(tape[pointer]);
        break;
      case ",":
        tape[pointer] = inputIndex < input.length ? (input[inputIndex++] & 0xff) : 0;
        break;
      case "[":
        if (tape[pointer] === 0) {
          pc = jumpTable[pc];
        }
        break;
      case "]":
        if (tape[pointer] !== 0) {
          pc = jumpTable[pc];
        }
        break;
      default:
        break;
    }

    pc += 1;
  }

  return {
    output,
    stepsExecuted,
    pointer,
    cells: Array.from(tape.slice(0, 12)),
  };
}

function bassSeedBytesFor(seed, bassMode = 0, bassGlide = 55, mutation = 0) {
  const mixed = (seed ^ Math.imul(mutation >>> 0, 0x7f4a7c15) ^ (bassMode << 17) ^ (bassGlide << 9)) >>> 0;
  let state = mixed || 0x9e3779b9;
  const bytes = [];
  for (let i = 0; i < 12; i += 1) {
    state ^= state << 13;
    state ^= state >>> 17;
    state ^= state << 5;
    state = (state + Math.imul(i + 1 + bassMode, 0x27d4eb2d)) >>> 0;
    // Keep initial loop counters small (1..7) where needed and full bytes elsewhere
    bytes.push((state ^ (seed >>> ((i % 4) * 8))) & 0xff);
  }
  return bytes;
}

function stepLabelFor(gate, interval, register, slide) {
  if (gate === 0) return "REST";
  const regMark = register > 0 ? "+" : "";
  const slideMark = slide ? "~" : "";
  if (interval === 0) return `RT${regMark}${slideMark}`;
  if (interval === 7) return `5TH${regMark}${slideMark}`;
  if (interval === 5) return `4TH${regMark}${slideMark}`;
  if (interval === 12) return `OCT${ slideMark }`;
  return `+${interval}${slideMark}`;
}

export function cycleBassCell(step, melody = [0, 4, 7, 12]) {
  const nextGate = (step.gate + 1) % 3;
  const nextRegister = nextGate === 0 ? 0 : (step.register ^ (nextGate === 2 ? 1 : 0));
  const nextSlide = nextGate === 2 ? (step.slide ^ 1) : step.slide;
  const nextCell = (step.cell + 19) & 0xff;
  const degreeChoices = [0, 0, melody[step.index % melody.length] % 12, 7, 5, 12];
  const interval = degreeChoices[nextCell % degreeChoices.length];
  const label = stepLabelFor(nextGate, interval, nextRegister, nextSlide);
  return Object.freeze({
    ...step,
    cell: nextCell,
    gate: nextGate,
    register: nextRegister,
    slide: nextSlide,
    accent: nextGate === 2 ? 1 : 0,
    interval,
    label,
  });
}

export function composeBass(source, score, mutation = 0) {
  const bassMode = (score.bassMode ?? ((score.seed >>> 3) % 8)) & 7;
  const bassGlide = score.bassGlide ?? 58;
  const input = bassSeedBytesFor(score.seed >>> 0, bassMode, bassGlide, mutation);
  const { output, stepsExecuted } = runBrainfuck(source, input);
  if (output.length < 12) {
    throw new Error(`Brainfuck bass spell emitted ${output.length} cells; expected at least 12`);
  }

  const melody = melodyFor(score);
  const groove = GROOVE_TEMPLATES[bassMode];
  const consonantPool = [
    0,
    0,
    melody[0] % 12,
    7,
    5,
    melody[3] % 12,
    melody[6] % 12,
    12,
  ];

  const steps = Array.from({ length: 12 }, (_, index) => {
    const cell = output[index] & 0xff;
    const [templateGate, templateAccent, templateReg, templateSlide] = groove[index];

    let gate = templateGate;
    if (index === 0) {
      gate = 2;
    } else if (templateGate === 0 && (cell % 7 === 0)) {
      gate = 1;
    }

    const interval = index === 0
      ? 0
      : (index % 6 === 0 ? (cell % 2 === 0 ? 0 : 7) : consonantPool[(cell + index) % consonantPool.length]);
    const register = index === 0 ? 0 : (templateReg || (cell % 5 === 0 ? 1 : 0));
    const slide = gate > 0 && (templateSlide || ((cell & 3) === 3 && bassGlide >= 50)) ? 1 : 0;
    const accent = gate > 0 && (templateAccent || (cell % 4 === 0)) ? 1 : 0;
    const label = stepLabelFor(gate, interval, register, slide);

    return Object.freeze({
      index,
      cell,
      gate,
      interval,
      register,
      slide,
      accent,
      label,
    });
  });

  return Object.freeze({
    mode: bassMode,
    modeName: BASS_NAMES[bassMode],
    glide: bassGlide,
    mutation,
    stepsExecuted,
    melodyName: MELODY_NAMES[score.melodyMode],
    steps: Object.freeze(steps),
  });
}
