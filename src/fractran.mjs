export const CHIME_NAMES = Object.freeze([
  "TONNETZ CATHEDRAL",
  "PRISMATIC CARILLON",
  "SEPTIMAL GLASS CHOIR",
  "PYTHAGOREAN PENDULUM",
  "CODEL AURORA PAD",
  "PRIME RATIO GAMELAN",
  "EULER HARMONIC LATTICE",
  "VESPER VIOLET CHIMES",
]);

export const PIET_HUE_NAMES = Object.freeze([
  "RED",
  "YELLOW",
  "GREEN",
  "CYAN",
  "BLUE",
  "MAGENTA",
]);

export const PIET_LIGHTNESS_NAMES = Object.freeze([
  "LIGHT",
  "NORMAL",
  "DARK",
]);

const HUE_CHAR_MAP = Object.freeze({
  R: 0,
  Y: 1,
  G: 2,
  C: 3,
  B: 4,
  M: 5,
});

const LIGHTNESS_CHAR_MAP = Object.freeze({
  L: 0,
  N: 1,
  D: 2,
});

export const JI_RATIOS = Object.freeze([
  Object.freeze({ label: "1/1", num: 1, den: 1, value: 1.0, primeTag: "2⁰3⁰" }),
  Object.freeze({ label: "9/8", num: 9, den: 8, value: 9 / 8, primeTag: "3²/2³" }),
  Object.freeze({ label: "6/5", num: 6, den: 5, value: 6 / 5, primeTag: "2·3/5" }),
  Object.freeze({ label: "5/4", num: 5, den: 4, value: 5 / 4, primeTag: "5/2²" }),
  Object.freeze({ label: "4/3", num: 4, den: 3, value: 4 / 3, primeTag: "2²/3" }),
  Object.freeze({ label: "7/5", num: 7, den: 5, value: 7 / 5, primeTag: "7/5" }),
  Object.freeze({ label: "3/2", num: 3, den: 2, value: 3 / 2, primeTag: "3/2" }),
  Object.freeze({ label: "8/5", num: 8, den: 5, value: 8 / 5, primeTag: "2³/5" }),
  Object.freeze({ label: "5/3", num: 5, den: 3, value: 5 / 3, primeTag: "5/3" }),
  Object.freeze({ label: "7/4", num: 7, den: 4, value: 7 / 4, primeTag: "7/2²" }),
  Object.freeze({ label: "15/8", num: 15, den: 8, value: 15 / 8, primeTag: "3·5/2³" }),
  Object.freeze({ label: "2/1", num: 2, den: 1, value: 2.0, primeTag: "2¹" }),
]);

const CHIME_GATES = Object.freeze([
  // 0: TONNETZ CATHEDRAL (sustained bell & choir pillars)
  [2, 1, 0, 1, 2, 0, 2, 1, 0, 1, 2, 1],
  // 1: PRISMATIC CARILLON (shimmering active carillon)
  [2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 2],
  // 2: SEPTIMAL GLASS CHOIR (swelling harmonic-seventh pads)
  [2, 0, 1, 2, 0, 1, 2, 0, 1, 2, 1, 0],
  // 3: PYTHAGOREAN PENDULUM (alternating 5ths & octaves)
  [2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 1],
  // 4: CODEL AURORA PAD (long luminous codel clouds)
  [2, 1, 1, 0, 2, 1, 1, 0, 2, 1, 1, 0],
  // 5: PRIME RATIO GAMELAN (syncopated metallic strikes)
  [2, 1, 0, 2, 1, 2, 0, 2, 1, 0, 2, 1],
  // 6: EULER HARMONIC LATTICE (5-limit triad breathes)
  [2, 0, 1, 1, 2, 0, 1, 1, 2, 0, 1, 2],
  // 7: VESPER VIOLET CHIMES (twilight off-beat dub bells)
  [1, 2, 0, 1, 2, 0, 1, 2, 0, 1, 2, 1],
]);

function countPrimeExponent(value, prime) {
  let n = value;
  const p = BigInt(prime);
  let count = 0;
  while (n > 0n && n % p === 0n) {
    count += 1;
    n /= p;
  }
  return count;
}

export function runFractran(source, initialState = 78n, stepCount = 12) {
  if (typeof source !== "string") {
    throw new TypeError("FRACTRAN source must be a string");
  }

  const fractions = [];
  const lines = source.replace(/\r\n?/g, "\n").split("\n");
  for (let lineIndex = 0; lineIndex < lines.length; lineIndex += 1) {
    const rawLine = lines[lineIndex].replace(/#.*$/, "").trim();
    if (!rawLine) continue;
    const tokens = rawLine.split(/\s+/);
    for (const token of tokens) {
      const match = /^(\d+)\/(\d+)$/.exec(token);
      if (!match) {
        throw new Error(`FRACTRAN line ${lineIndex + 1}: Invalid fraction '${token}'`);
      }
      const num = BigInt(match[1]);
      const den = BigInt(match[2]);
      if (num <= 0n || den <= 0n) {
        throw new Error(`FRACTRAN line ${lineIndex + 1}: Fraction '${token}' must have positive numerator and denominator`);
      }
      fractions.push({ num, den, label: token });
    }
  }

  if (fractions.length === 0) {
    throw new Error("FRACTRAN line 1: Program contains no fractions");
  }

  let state = typeof initialState === "bigint" ? initialState : BigInt(Math.max(2, Math.trunc(initialState)));
  const states = [];

  for (let step = 0; step < stepCount; step += 1) {
    let matched = null;
    for (const frac of fractions) {
      if (state % frac.den === 0n) {
        state = (state / frac.den) * frac.num;
        matched = frac.label;
        break;
      }
    }
    if (!matched) {
      break;
    }
    const e2 = countPrimeExponent(state, 2);
    const e3 = countPrimeExponent(state, 3);
    const e5 = countPrimeExponent(state, 5);
    const e7 = countPrimeExponent(state, 7);
    const e11 = countPrimeExponent(state, 11);
    const e13 = countPrimeExponent(state, 13);
    states.push({
      state,
      fraction: matched,
      exponents: Object.freeze({ e2, e3, e5, e7, e11, e13 }),
    });
  }

  return {
    fractionsCount: fractions.length,
    stepsExecuted: states.length,
    states,
  };
}

function parsePietToken(token, lineNumber, colNumber) {
  if (token === "WH") {
    return { type: "white", code: "WH", hue: -1, lightness: -1 };
  }
  if (token === "BK") {
    return { type: "black", code: "BK", hue: -1, lightness: -1 };
  }
  if (token.length === 2 && token[0] in LIGHTNESS_CHAR_MAP && token[1] in HUE_CHAR_MAP) {
    const lightness = LIGHTNESS_CHAR_MAP[token[0]];
    const hue = HUE_CHAR_MAP[token[1]];
    return {
      type: "color",
      code: token,
      hue,
      lightness,
    };
  }
  throw new Error(`Piet line ${lineNumber}: Invalid codel '${token}' at column ${colNumber}`);
}

const DP_DELTAS = Object.freeze([
  [1, 0],  // 0: right
  [0, 1],  // 1: down
  [-1, 0], // 2: left
  [0, -1], // 3: up
]);

export function runPiet(source, input = [], maxSteps = 256) {
  if (typeof source !== "string") {
    throw new TypeError("Piet source must be a string");
  }

  const rawLines = source.replace(/\r\n?/g, "\n").split("\n");
  const rows = [];
  for (let lineIdx = 0; lineIdx < rawLines.length; lineIdx += 1) {
    const cleaned = rawLines[lineIdx].replace(/#.*$/, "").trim();
    if (!cleaned) continue;
    const tokens = cleaned.split(/\s+/);
    const parsedRow = tokens.map((tok, colIdx) => parsePietToken(tok, lineIdx + 1, colIdx + 1));
    rows.push(parsedRow);
  }

  if (rows.length === 0) {
    throw new Error("Piet line 1: Canvas contains no codels");
  }

  const height = rows.length;
  const width = Math.max(...rows.map((r) => r.length));
  const grid = rows.map((row) => {
    const padded = row.slice();
    while (padded.length < width) {
      padded.push({ type: "black", code: "BK", hue: -1, lightness: -1 });
    }
    return padded;
  });

  function getBlock(startX, startY) {
    const origin = grid[startY][startX];
    const visited = new Set([`${startX},${startY}`]);
    const queue = [[startX, startY]];
    const coords = [];

    while (queue.length > 0) {
      const [cx, cy] = queue.shift();
      coords.push([cx, cy]);
      for (const [dx, dy] of DP_DELTAS) {
        const nx = cx + dx;
        const ny = cy + dy;
        if (nx < 0 || nx >= width || ny < 0 || ny >= height) continue;
        const key = `${nx},${ny}`;
        if (visited.has(key)) continue;
        const neighbor = grid[ny][nx];
        if (neighbor.code === origin.code) {
          visited.add(key);
          queue.push([nx, ny]);
        }
      }
    }

    return {
      code: origin.code,
      type: origin.type,
      hue: origin.hue,
      lightness: origin.lightness,
      size: coords.length,
      coords,
    };
  }

  function chooseExitCodel(block, dp, cc) {
    let best = block.coords[0];
    for (const [cx, cy] of block.coords) {
      const [bx, by] = best;
      if (dp === 0) {
        if (cx > bx || (cx === bx && (cc === 0 ? cy < by : cy > by))) best = [cx, cy];
      } else if (dp === 1) {
        if (cy > by || (cy === by && (cc === 0 ? cx > bx : cx < bx))) best = [cx, cy];
      } else if (dp === 2) {
        if (cx < bx || (cx === bx && (cc === 0 ? cy > by : cy < by))) best = [cx, cy];
      } else if (dp === 3) {
        if (cy < by || (cy === by && (cc === 0 ? cx < bx : cx > bx))) best = [cx, cy];
      }
    }
    return best;
  }

  let x = 0;
  let y = 0;
  let dp = 0; // right
  let cc = 0; // left
  const stack = [];
  const output = [];
  const visitedCodels = [];
  let inputIndex = 0;
  let stepsExecuted = 0;

  const pop = () => (stack.length > 0 ? stack.pop() : 0);
  const push = (val) => stack.push(Math.trunc(val));

  while (stepsExecuted < maxSteps) {
    const currentBlock = getBlock(x, y);
    if (currentBlock.type === "black" || currentBlock.type === "white") {
      break;
    }

    let moved = false;
    let nextX = x;
    let nextY = y;

    for (let attempt = 0; attempt < 8; attempt += 1) {
      const [ex, ey] = chooseExitCodel(currentBlock, dp, cc);
      const [dx, dy] = DP_DELTAS[dp];
      const tx = ex + dx;
      const ty = ey + dy;

      if (tx >= 0 && tx < width && ty >= 0 && ty < height && grid[ty][tx].type !== "black") {
        nextX = tx;
        nextY = ty;
        moved = true;
        break;
      }

      if (attempt % 2 === 0) {
        cc = 1 - cc;
      } else {
        dp = (dp + 1) & 3;
      }
    }

    if (!moved) {
      break;
    }

    stepsExecuted += 1;
    const nextCodel = grid[nextY][nextX];

    if (currentBlock.type === "color" && nextCodel.type === "color") {
      const dHue = (nextCodel.hue - currentBlock.hue + 6) % 6;
      const dLight = (nextCodel.lightness - currentBlock.lightness + 3) % 3;
      const opKey = `${dHue},${dLight}`;

      switch (opKey) {
        case "0,1": // push
          push(currentBlock.size);
          break;
        case "0,2": // pop
          pop();
          break;
        case "1,0": { // add
          const a = pop();
          const b = pop();
          push(b + a);
          break;
        }
        case "1,1": { // subtract
          const a = pop();
          const b = pop();
          push(b - a);
          break;
        }
        case "1,2": { // multiply
          const a = pop();
          const b = pop();
          push(b * a);
          break;
        }
        case "2,0": { // divide
          const a = pop();
          const b = pop();
          push(a === 0 ? 0 : Math.trunc(b / a));
          break;
        }
        case "2,1": { // mod
          const a = pop();
          const b = pop();
          push(a === 0 ? 0 : ((b % a) + Math.abs(a)) % Math.abs(a));
          break;
        }
        case "2,2": { // not
          const a = pop();
          push(a === 0 ? 1 : 0);
          break;
        }
        case "3,0": { // greater
          const a = pop();
          const b = pop();
          push(b > a ? 1 : 0);
          break;
        }
        case "3,1": { // pointer
          const a = pop();
          dp = ((dp + a) % 4 + 4) % 4;
          break;
        }
        case "3,2": { // switch
          const a = Math.abs(pop());
          if (a % 2 === 1) cc = 1 - cc;
          break;
        }
        case "4,0": { // duplicate
          if (stack.length > 0) {
            push(stack[stack.length - 1]);
          }
          break;
        }
        case "4,1": // roll
          break;
        case "4,2": // in(number)
        case "5,0": { // in(char)
          const val = inputIndex < input.length ? (input[inputIndex++] & 0xff) : 0;
          push(val);
          break;
        }
        case "5,1": // out(number)
        case "5,2": { // out(char)
          const outVal = pop() & 0xff;
          output.push(outVal);
          visitedCodels.push({
            code: nextCodel.code,
            hue: nextCodel.hue,
            lightness: nextCodel.lightness,
            blockSize: currentBlock.size,
          });
          break;
        }
        default:
          break;
      }
    }

    x = nextX;
    y = nextY;
  }

  return {
    output,
    visitedCodels,
    stepsExecuted,
  };
}

function chimeSeedFor(seed, chimeMode = 0, chimeShimmer = 50, mutation = 0) {
  const mixed = (seed ^ Math.imul(mutation >>> 0, 0x85ebca6b) ^ (chimeMode << 17) ^ (chimeShimmer << 7)) >>> 0;
  let state = mixed || 0x27d4eb2d;
  const bytes = [];
  for (let i = 0; i < 12; i += 1) {
    state ^= state << 13;
    state ^= state >>> 17;
    state ^= state << 5;
    state = (state + Math.imul(i + 1 + chimeMode, 0xc2b2ae35)) >>> 0;
    bytes.push((state ^ (seed >>> ((i % 4) * 8))) & 0xff);
  }
  const e2 = 1 + (bytes[0] % 4);
  const e3 = 1 + (bytes[1] % 3);
  const e5 = bytes[2] % 3;
  const e7 = bytes[3] % 2;
  const e11 = bytes[4] % 2;
  const initialFractranState =
    (2n ** BigInt(e2)) *
    (3n ** BigInt(e3)) *
    (5n ** BigInt(e5)) *
    (7n ** BigInt(e7)) *
    (11n ** BigInt(e11));

  return { bytes, initialFractranState };
}

function selectJiRatioIndex(exponents, pietByte, stepIndex, chimeMode) {
  const weighted =
    exponents.e2 * 1 +
    exponents.e3 * 3 +
    exponents.e5 * 5 +
    exponents.e7 * 7 +
    exponents.e11 * 2 +
    exponents.e13 * 4 +
    (pietByte & 0x0f) +
    stepIndex +
    chimeMode;
  return weighted % JI_RATIOS.length;
}

export function cycleChimeCell(step) {
  const nextGate = (step.gate + 1) % 3;
  const nextRatioIndex = (step.ratioIndex + 1) % JI_RATIOS.length;
  const nextHueIndex = (step.hueIndex + 1) % 6;
  const nextLightnessIndex = (step.lightnessIndex + 1) % 3;
  const ratio = JI_RATIOS[nextRatioIndex];
  const lChar = ["L", "N", "D"][nextLightnessIndex];
  const hChar = ["R", "Y", "G", "C", "B", "M"][nextHueIndex];
  const codelCode = `${lChar}${hChar}`;
  return Object.freeze({
    ...step,
    gate: nextGate,
    ratioIndex: nextRatioIndex,
    ratioLabel: ratio.label,
    ratioValue: ratio.value,
    primeTag: ratio.primeTag,
    hueIndex: nextHueIndex,
    lightnessIndex: nextLightnessIndex,
    codelCode,
    codelName: `${PIET_LIGHTNESS_NAMES[nextLightnessIndex]} ${PIET_HUE_NAMES[nextHueIndex]}`,
    label: nextGate === 0 ? "REST" : `${ratio.label} ${codelCode}`,
  });
}

export function composeChimes(pietSource, fractranSource, score, mutation = 0) {
  const chimeMode = (score.chimeMode ?? ((score.seed >>> 6) % 8)) & 7;
  const chimeShimmer = score.chimeShimmer ?? 58;
  const { bytes, initialFractranState } = chimeSeedFor(score.seed >>> 0, chimeMode, chimeShimmer, mutation);

  const pietResult = runPiet(pietSource, bytes);
  if (pietResult.output.length < 12) {
    throw new Error(`Piet chorus canvas emitted ${pietResult.output.length} codel states; expected at least 12`);
  }

  const fractranResult = runFractran(fractranSource, initialFractranState, 12);
  if (fractranResult.states.length < 12) {
    throw new Error(`FRACTRAN chime spell halted after ${fractranResult.states.length} states; expected 12`);
  }

  const gateTemplate = CHIME_GATES[chimeMode];
  const steps = Array.from({ length: 12 }, (_, index) => {
    const pietByte = pietResult.output[index] & 0xff;
    const codel = pietResult.visitedCodels[index] || { code: "LC", hue: index % 6, lightness: index % 3 };
    const fracState = fractranResult.states[index];
    const ratioIndex = selectJiRatioIndex(fracState.exponents, pietByte, index, chimeMode);
    const ratio = JI_RATIOS[ratioIndex];

    let gate = gateTemplate[index];
    if (index === 0) {
      gate = Math.max(1, gate);
    } else if (gate === 0 && (pietByte % 7 === 0)) {
      gate = 1;
    }

    const hueIndex = (codel.hue + mutation) % 6;
    const lightnessIndex = codel.lightness % 3;
    const lChar = ["L", "N", "D"][lightnessIndex];
    const hChar = ["R", "Y", "G", "C", "B", "M"][hueIndex];
    const codelCode = `${lChar}${hChar}`;

    return Object.freeze({
      index,
      gate,
      pietByte,
      codelCode,
      codelName: `${PIET_LIGHTNESS_NAMES[lightnessIndex]} ${PIET_HUE_NAMES[hueIndex]}`,
      hueIndex,
      lightnessIndex,
      fraction: fracState.fraction,
      exponents: fracState.exponents,
      ratioIndex,
      ratioLabel: ratio.label,
      ratioValue: ratio.value,
      primeTag: ratio.primeTag,
      shimmer: chimeShimmer,
      label: gate === 0 ? "REST" : `${ratio.label} ${codelCode}`,
    });
  });

  return Object.freeze({
    mode: chimeMode,
    modeName: CHIME_NAMES[chimeMode],
    shimmer: chimeShimmer,
    mutation,
    pietStepsExecuted: pietResult.stepsExecuted,
    fractranStepsExecuted: fractranResult.stepsExecuted,
    steps: Object.freeze(steps),
  });
}
