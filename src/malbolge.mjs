const MEMORY_SIZE = 59049;
const MAX_TRIT_WORD = MEMORY_SIZE - 1;
const VALID_OPCODES = new Set([4, 5, 23, 39, 40, 62, 68, 81]);
const XLAT2 =
  "5z]&gqtyfr$(we4{WP)H-Zn,[%\\3dL+Q;>U!pJS72FhOA1CB6v^=I_0/8|jsb9m<.TVac`uY*MK'X~xDl}REokN:#?G\"i@";

const CRAZY_TABLE = Object.freeze([
  Object.freeze([1, 0, 0]),
  Object.freeze([1, 0, 2]),
  Object.freeze([2, 2, 1]),
]);

export const BEAT_NAMES = Object.freeze([
  "AUTOMATON MARCH",
  "SEANCE WALTZ",
  "PENDULUM GALOP",
  "OSSUARY POLYRHYTHM",
  "TELEGRAM CLATTER",
  "BELL-TOWER TOLL",
  "ECTOPLASM SHUFFLE",
  "INFERNAL HABANERA",
]);

const CADENCE_MASKS = Object.freeze([
  // 0: AUTOMATON MARCH (4/4 driving pulse across 12 steps)
  Object.freeze([
    [2, 0, 1], [0, 0, 1], [0, 1, 0], [1, 2, 1],
    [0, 0, 1], [1, 0, 1], [2, 0, 1], [0, 1, 1],
    [0, 0, 1], [1, 2, 0], [0, 0, 1], [0, 1, 2],
  ]),
  // 1: SEANCE WALTZ (triple-time parlor knock)
  Object.freeze([
    [2, 0, 1], [0, 1, 1], [0, 1, 0], [1, 0, 2],
    [0, 1, 1], [0, 2, 0], [2, 0, 1], [0, 1, 1],
    [0, 1, 0], [1, 2, 1], [0, 1, 1], [0, 1, 2],
  ]),
  // 2: PENDULUM GALOP (syncopated escapement gallop)
  Object.freeze([
    [2, 0, 2], [0, 1, 1], [1, 0, 1], [0, 2, 1],
    [1, 0, 0], [1, 0, 1], [2, 0, 2], [0, 1, 1],
    [1, 0, 1], [0, 2, 1], [0, 1, 1], [1, 1, 2],
  ]),
  // 3: OSSUARY POLYRHYTHM (3-against-4 cross-rhythm)
  Object.freeze([
    [2, 0, 2], [0, 1, 0], [0, 0, 1], [1, 2, 0],
    [2, 0, 1], [0, 0, 1], [0, 2, 2], [0, 1, 0],
    [2, 0, 1], [0, 2, 0], [0, 0, 1], [1, 1, 2],
  ]),
  // 4: TELEGRAM CLATTER (rapid telegraph relay)
  Object.freeze([
    [2, 1, 1], [0, 1, 1], [1, 0, 1], [0, 2, 1],
    [0, 1, 1], [1, 1, 0], [2, 0, 1], [0, 1, 1],
    [1, 1, 1], [0, 2, 1], [0, 1, 1], [1, 2, 2],
  ]),
  // 5: BELL-TOWER TOLL (spacious ceremonial downbeats)
  Object.freeze([
    [2, 0, 2], [0, 0, 1], [0, 0, 0], [0, 1, 1],
    [1, 0, 0], [0, 0, 1], [2, 0, 2], [0, 0, 0],
    [0, 1, 1], [0, 2, 1], [0, 0, 1], [0, 0, 2],
  ]),
  // 6: ECTOPLASM SHUFFLE (swung parlor groove)
  Object.freeze([
    [2, 0, 1], [0, 0, 0], [1, 1, 1], [0, 2, 1],
    [0, 0, 0], [1, 0, 2], [2, 0, 1], [0, 0, 1],
    [1, 1, 1], [0, 2, 1], [0, 0, 0], [1, 1, 2],
  ]),
  // 7: INFERNAL HABANERA (tresillo-inflected gothic cadence)
  Object.freeze([
    [2, 0, 1], [0, 0, 1], [0, 1, 1], [2, 0, 0],
    [1, 2, 1], [0, 0, 1], [2, 0, 2], [0, 1, 0],
    [0, 0, 1], [2, 1, 1], [1, 2, 0], [0, 1, 2],
  ]),
]);

export function crazy(a, d) {
  let left = a >>> 0;
  let right = d >>> 0;
  let result = 0;
  let power = 1;
  for (let trit = 0; trit < 10; trit += 1) {
    const tritA = left % 3;
    const tritD = right % 3;
    result += CRAZY_TABLE[tritD][tritA] * power;
    left = Math.floor(left / 3);
    right = Math.floor(right / 3);
    power *= 3;
  }
  return result;
}

export function rotr(d) {
  const value = d >>> 0;
  return Math.floor(value / 3) + (value % 3) * 19683;
}

export function assembleMalbolge(opcodes) {
  if (!Array.isArray(opcodes) || opcodes.length < 2) {
    throw new Error("Malbolge assembly requires at least two opcodes");
  }
  let output = "";
  for (let index = 0; index < opcodes.length; index += 1) {
    const target = opcodes[index];
    if (!VALID_OPCODES.has(target)) {
      throw new Error(`Invalid Malbolge opcode ${target} at index ${index}`);
    }
    let code = (target - (index % 94) + 94) % 94;
    if (code < 33) code += 94;
    output += String.fromCharCode(code);
  }
  return output;
}

export function runMalbolge(source, input = [], maxSteps = 4096) {
  if (typeof source !== "string") {
    throw new TypeError("Malbolge source must be a string");
  }

  const memory = new Uint16Array(MEMORY_SIZE);
  let address = 0;
  const lines = source.replace(/\r\n?/g, "\n").split("\n");

  for (let lineIndex = 0; lineIndex < lines.length; lineIndex += 1) {
    const line = lines[lineIndex];
    for (let charIndex = 0; charIndex < line.length; charIndex += 1) {
      const code = line.charCodeAt(charIndex);
      if (code === 9 || code === 10 || code === 13 || code === 32) continue;
      if (code < 33 || code > 126) {
        throw new Error(`Malbolge line ${lineIndex + 1}: Non-printable character at column ${charIndex + 1}`);
      }
      if (address >= MEMORY_SIZE) {
        throw new Error(`Malbolge line ${lineIndex + 1}: Program exceeds ${MEMORY_SIZE} words`);
      }
      const decoded = (code + address) % 94;
      if (!VALID_OPCODES.has(decoded)) {
        throw new Error(`Malbolge line ${lineIndex + 1}: Invalid instruction '${line[charIndex]}' at address ${address}`);
      }
      memory[address] = code;
      address += 1;
    }
  }

  if (address < 2) {
    throw new Error("Malbolge program requires at least two instructions");
  }

  while (address < MEMORY_SIZE) {
    memory[address] = crazy(memory[address - 1], memory[address - 2]);
    address += 1;
  }

  let a = 0;
  let c = 0;
  let d = 0;
  let inputIndex = 0;
  let stepsExecuted = 0;
  const output = [];

  while (stepsExecuted < maxSteps) {
    const instruction = memory[c];
    if (instruction < 33 || instruction > 126) {
      throw new Error(`Malbolge runtime fault: unexecutable word ${instruction} at ${c}`);
    }

    const opcode = (instruction + c) % 94;
    stepsExecuted += 1;

    if (opcode === 81) {
      return { output, stepsExecuted, accumulator: a };
    }

    switch (opcode) {
      case 4:
        c = memory[d];
        break;
      case 5:
        output.push(a & 0xff);
        break;
      case 23:
        if (inputIndex < input.length) {
          a = input[inputIndex] & 0xff;
          inputIndex += 1;
        } else {
          a = MAX_TRIT_WORD;
        }
        break;
      case 39:
        a = rotr(memory[d]);
        memory[d] = a;
        break;
      case 40:
        d = memory[d];
        break;
      case 62:
        a = crazy(a, memory[d]);
        memory[d] = a;
        break;
      case 68:
      default:
        break;
    }

    if (memory[c] >= 33 && memory[c] <= 126) {
      memory[c] = XLAT2.charCodeAt(memory[c] - 33);
    }

    c = (c + 1) % MEMORY_SIZE;
    d = (d + 1) % MEMORY_SIZE;
  }

  throw new Error(`Malbolge execution exceeded ${maxSteps} steps without halting`);
}

function seedBytesFor(seed, beatMode = 0, beatDensity = 65, mutation = 0) {
  const mixedSeed = (seed ^ Math.imul(mutation >>> 0, 0x9e3779b1) ^ (beatMode << 19) ^ (beatDensity << 7)) >>> 0;
  const bytes = [];
  let state = mixedSeed || 0x6d2b79f5;
  for (let index = 0; index < 12; index += 1) {
    state ^= state << 13;
    state ^= state >>> 17;
    state ^= state << 5;
    state = (state + Math.imul(index + 1 + beatMode, 0x85ebca6b)) >>> 0;
    bytes.push((state & 0xff) ^ ((seed >>> ((index % 4) * 8)) & 0xff));
  }
  return bytes;
}

export function formatStepTrits(step) {
  return `${step.kick}${step.snare}${step.hat}`;
}

export function cycleBeatStep(step) {
  const currentValue = (step.kick % 3) * 9 + (step.snare % 3) * 3 + (step.hat % 3);
  const nextStates = [
    [2, 0, 1],
    [0, 2, 1],
    [0, 0, 2],
    [2, 2, 1],
    [1, 1, 2],
    [0, 0, 0],
  ];
  const matchIndex = nextStates.findIndex(
    ([k, s, h]) => k === step.kick && s === step.snare && h === step.hat,
  );
  const [kick, snare, hat] = nextStates[(matchIndex + 1 + (currentValue === 0 ? 0 : 0)) % nextStates.length];
  const updated = { ...step, kick, snare, hat };
  updated.trits = formatStepTrits(updated);
  return Object.freeze(updated);
}

export function composeBeat(source, score, mutation = 0) {
  const beatMode = (score.beatMode ?? (score.seed % 8)) & 7;
  const beatDensity = score.beatDensity ?? 68;
  const input = seedBytesFor(score.seed >>> 0, beatMode, beatDensity, mutation);
  const { output, stepsExecuted } = runMalbolge(source, input);
  if (output.length < 12) {
    throw new Error(`Malbolge beat spell emitted ${output.length} steps; expected at least 12`);
  }

  const mask = CADENCE_MASKS[beatMode];
  const densityThreshold = Math.max(0.25, Math.min(0.95, beatDensity / 100));

  const steps = Array.from({ length: 12 }, (_, index) => {
    const raw = output[index] & 0xff;
    const trit0 = raw % 3;
    const trit1 = Math.floor(raw / 3) % 3;
    const trit2 = Math.floor(raw / 9) % 3;
    const [maskKick, maskSnare, maskHat] = mask[index];

    const activity = ((raw ^ (index * 37)) & 0xff) / 255;
    let kick = maskKick;
    let snare = maskSnare;
    let hat = maskHat;

    if (index === 0) {
      kick = 2;
      hat = Math.max(1, trit2);
    } else if (activity <= densityThreshold) {
      kick = Math.max(maskKick, trit0 === 2 && index % 3 === 0 ? 1 : 0);
      snare = Math.max(maskSnare, trit1 === 2 && index % 2 === 1 ? 1 : 0);
      hat = Math.max(maskHat, trit2 > 0 ? 1 : 0);
    } else {
      kick = maskKick === 2 ? 2 : 0;
      snare = maskSnare === 2 ? 2 : (trit1 === 2 ? 1 : 0);
      hat = maskHat === 2 ? 2 : (trit2 === 2 ? 1 : 0);
    }

    if (mutation > 0 && ((raw + mutation + index) % 5 === 0)) {
      snare = (snare + trit1) % 3;
      hat = Math.max(1, (hat + trit2) % 3);
    }

    const stepObj = {
      index,
      raw,
      kick,
      snare,
      hat,
      trits: `${kick}${snare}${hat}`,
    };
    return Object.freeze(stepObj);
  });

  return Object.freeze({
    mode: beatMode,
    modeName: BEAT_NAMES[beatMode],
    density: beatDensity,
    mutation,
    stepsExecuted,
    rawOutput: Object.freeze(output.slice(0, 12)),
    steps: Object.freeze(steps),
  });
}
