import { runLolcode } from "./lolcode.mjs";

const REQUIRED_RANGES = Object.freeze({
  pulse: [54, 132],
  root: [36, 60],
  wave: [0, 3],
  hue: [0, 359],
  symmetry: [3, 10],
  twist: [1, 9],
  bloom: [35, 90],
  eyes: [1, 7],
  name_a: [0, 7],
  name_b: [0, 7],
  name_c: [0, 7],
  step_0: [0, 6],
  step_1: [0, 6],
  step_2: [0, 6],
  step_3: [0, 6],
  step_4: [0, 6],
  step_5: [0, 6],
  step_6: [0, 6],
  step_7: [0, 6],
});

const NAME_PARTS = Object.freeze({
  first: ["CERULEAN", "VELVET", "WOBBLING", "LUMINOUS", "TINY", "ANCIENT", "POLITE", "ILLEGAL"],
  second: ["POTATO", "MOTH", "TURNIP", "COMET", "PUDDLE", "TEAPOT", "ORBIT", "MARMALADE"],
  third: ["REMEMBERS", "IS LISTENING", "HAS QUESTIONS", "SINGS SIDEWAYS", "REFUSES GRAVITY", "KNOWS A DOOR", "OWES YOU SOUP", "DREAMS IN PLAID"],
});

export const WAVEFORMS = Object.freeze(["SINE", "TRIANGLE", "SQUARE", "SAWTOOTH"]);

export function hashPhrase(phrase) {
  const normalized = phrase.normalize("NFKC").trim().toLocaleLowerCase("en-US");
  if (!normalized) throw new Error("The oracle requires at least one visible character");

  let hash = 0x811c9dc5;
  for (const character of normalized) {
    const codePoint = character.codePointAt(0);
    hash ^= codePoint;
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
}

export function parseScore(lines, seed, phrase) {
  if (!Array.isArray(lines)) throw new TypeError("Oracle output must be an array of lines");
  const values = {};

  for (const line of lines) {
    const match = /^([a-z][a-z0-9_]*)=(-?\d+(?:\.\d+)?)$/i.exec(line.trim());
    if (!match) throw new Error(`Malformed oracle output: ${line}`);
    const key = match[1].toLowerCase();
    if (!(key in REQUIRED_RANGES)) throw new Error(`Unexpected oracle field: ${key}`);
    if (key in values) throw new Error(`Duplicate oracle field: ${key}`);
    values[key] = Number(match[2]);
  }

  for (const [key, [minimum, maximum]] of Object.entries(REQUIRED_RANGES)) {
    const value = values[key];
    if (!Number.isInteger(value) || value < minimum || value > maximum) {
      throw new Error(`Oracle field ${key} escaped its range`);
    }
  }

  const steps = Array.from({ length: 8 }, (_, index) => values[`step_${index}`]);
  const name = `THE ${NAME_PARTS.first[values.name_a]} ${NAME_PARTS.second[values.name_b]} ${NAME_PARTS.third[values.name_c]}`;

  return Object.freeze({
    seed,
    phrase,
    pulse: values.pulse,
    root: values.root,
    wave: values.wave,
    waveform: WAVEFORMS[values.wave].toLowerCase(),
    hue: values.hue,
    symmetry: values.symmetry,
    twist: values.twist,
    bloom: values.bloom,
    eyes: values.eyes,
    steps: Object.freeze(steps),
    name,
  });
}

export function composeScore(source, phrase) {
  const cleanPhrase = phrase
    .normalize("NFKC")
    .trim()
    .slice(0, 72)
    .toLocaleLowerCase("en-US");
  const seed = hashPhrase(cleanPhrase);
  const { output } = runLolcode(source, { INPUT_SEED: seed });
  return parseScore(output, seed, cleanPhrase);
}
