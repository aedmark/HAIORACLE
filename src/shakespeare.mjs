import { melodyFor } from "./music.mjs";

export const CHANT_NAMES = Object.freeze([
  "TRAGIC SOLILOQUY",
  "WITCHES' HEXACHORD",
  "TEMPEST ARIEL CHOIR",
  "ELSINORE REQUIEM",
  "PARLOR VODER SEANCE",
  "MIDSUMMER MADRIGAL",
  "GLOBE THEATRE ANTIPHON",
  "HECATE'S MIDNIGHT CANTICLE",
]);

export const FORMANT_VOWELS = Object.freeze([
  Object.freeze({ code: "AH", ipa: "/ɑ/", f1: 730, f2: 1090, f3: 2440 }),
  Object.freeze({ code: "EH", ipa: "/ɛ/", f1: 530, f2: 1840, f3: 2480 }),
  Object.freeze({ code: "EE", ipa: "/i/", f1: 270, f2: 2290, f3: 3010 }),
  Object.freeze({ code: "OH", ipa: "/o/", f1: 450, f2: 800, f3: 2600 }),
  Object.freeze({ code: "OO", ipa: "/u/", f1: 300, f2: 870, f3: 2240 }),
  Object.freeze({ code: "AE", ipa: "/æ/", f1: 660, f2: 1720, f3: 2410 }),
]);

const CANONICAL_CHARACTERS = new Set([
  "HAMLET",
  "OPHELIA",
  "PROSPERO",
  "HECATE",
  "MACBETH",
  "LADY MACBETH",
  "ROMEO",
  "JULIET",
  "PUCK",
  "ARIEL",
  "YORICK",
  "BANQUO",
]);

export const PERSONA_ROLES = Object.freeze({
  HAMLET: Object.freeze({ short: "HAM", voice: "BARITONE", registerOffset: -12, vibratoHz: 5.2 }),
  OPHELIA: Object.freeze({ short: "OPH", voice: "SOPRANO", registerOffset: 0, vibratoHz: 6.1 }),
  PROSPERO: Object.freeze({ short: "PRO", voice: "BASS", registerOffset: -12, vibratoHz: 4.6 }),
  HECATE: Object.freeze({ short: "HEC", voice: "ALTO", registerOffset: 0, vibratoHz: 5.7 }),
});

const POSITIVE_NOUNS = new Set([
  "heaven",
  "king",
  "lord",
  "angel",
  "rose",
  "day",
  "moon",
  "star",
  "lantern",
  "crown",
  "music",
  "chord",
  "heart",
]);

const NEGATIVE_NOUNS = new Set([
  "hell",
  "devil",
  "ghost",
  "skull",
  "curse",
  "winter",
  "poison",
  "shadow",
  "grave",
  "canker",
  "toad",
]);

const ADJECTIVES = new Set([
  "fair",
  "golden",
  "bright",
  "sweet",
  "fine",
  "noble",
  "lovely",
  "summer's",
  "mighty",
  "pure",
  "foul",
  "black",
  "cursed",
  "dark",
  "ancient",
  "gentle",
  "strange",
  "bold",
  "wild",
  "eternal",
  "deep",
]);

const CHANT_GATES = Object.freeze([
  // 0: TRAGIC SOLILOQUY (expressive phrased soliloquy)
  [2, 1, 0, 2, 1, 0, 2, 1, 1, 0, 2, 1],
  // 1: WITCHES' HEXACHORD (syncopated coven chant)
  [2, 0, 2, 1, 0, 2, 2, 0, 1, 2, 0, 2],
  // 2: TEMPEST ARIEL CHOIR (floating legato vowel choir)
  [2, 1, 1, 0, 2, 1, 1, 0, 2, 1, 1, 2],
  // 3: ELSINORE REQUIEM (solemn cathedral pillars)
  [2, 0, 0, 2, 0, 0, 2, 0, 1, 2, 0, 1],
  // 4: PARLOR VODER SEANCE (12-step active talking head)
  [2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 2],
  // 5: MIDSUMMER MADRIGAL (interlocking 4-voice hocket)
  [2, 1, 2, 0, 1, 2, 1, 0, 2, 1, 2, 1],
  // 6: GLOBE THEATRE ANTIPHON (call and response)
  [2, 2, 0, 1, 1, 0, 2, 2, 0, 1, 1, 2],
  // 7: HECATE'S MIDNIGHT CANTICLE (dark ritual vowel ostinato)
  [1, 2, 0, 2, 1, 0, 1, 2, 0, 2, 1, 2],
]);

function evaluateSplExpression(exprText, speakerState, addresseeState, lineNumber) {
  const cleaned = exprText.trim().replace(/[.!?]+$/, "").trim();
  const lower = cleaned.toLowerCase();

  if (lower === "thyself" || lower === "yourself" || lower === "thee" || lower === "thou" || lower === "you") {
    return addresseeState.value;
  }
  if (lower === "me" || lower === "myself") {
    return speakerState.value;
  }
  if (lower === "nothing" || lower === "zero") {
    return 0;
  }

  if (lower.startsWith("the sum of ")) {
    const rest = cleaned.slice(11);
    const splitIdx = rest.toLowerCase().indexOf(" and ");
    if (splitIdx === -1) {
      throw new Error(`Shakespeare line ${lineNumber}: Malformed sum expression '${cleaned}'`);
    }
    const left = evaluateSplExpression(rest.slice(0, splitIdx), speakerState, addresseeState, lineNumber);
    const right = evaluateSplExpression(rest.slice(splitIdx + 5), speakerState, addresseeState, lineNumber);
    return left + right;
  }

  if (lower.startsWith("the difference between ")) {
    const rest = cleaned.slice(23);
    const splitIdx = rest.toLowerCase().indexOf(" and ");
    if (splitIdx === -1) {
      throw new Error(`Shakespeare line ${lineNumber}: Malformed difference expression '${cleaned}'`);
    }
    const left = evaluateSplExpression(rest.slice(0, splitIdx), speakerState, addresseeState, lineNumber);
    const right = evaluateSplExpression(rest.slice(splitIdx + 5), speakerState, addresseeState, lineNumber);
    return left - right;
  }

  if (lower.startsWith("the product of ")) {
    const rest = cleaned.slice(15);
    const splitIdx = rest.toLowerCase().indexOf(" and ");
    if (splitIdx === -1) {
      throw new Error(`Shakespeare line ${lineNumber}: Malformed product expression '${cleaned}'`);
    }
    const left = evaluateSplExpression(rest.slice(0, splitIdx), speakerState, addresseeState, lineNumber);
    const right = evaluateSplExpression(rest.slice(splitIdx + 5), speakerState, addresseeState, lineNumber);
    return left * right;
  }

  if (lower.startsWith("twice ")) {
    return 2 * evaluateSplExpression(cleaned.slice(6), speakerState, addresseeState, lineNumber);
  }

  const tokens = lower.split(/\s+/).filter((t) => t !== "a" && t !== "an" && t !== "the");
  if (tokens.length === 0) {
    throw new Error(`Shakespeare line ${lineNumber}: Empty poetic expression`);
  }

  const noun = tokens[tokens.length - 1];
  let base = 0;
  if (POSITIVE_NOUNS.has(noun)) {
    base = 1;
  } else if (NEGATIVE_NOUNS.has(noun)) {
    base = -1;
  } else {
    throw new Error(`Shakespeare line ${lineNumber}: Unrecognized Shakespearean noun '${noun}'`);
  }

  let multiplier = 1;
  for (let i = 0; i < tokens.length - 1; i += 1) {
    const word = tokens[i];
    if (!ADJECTIVES.has(word)) {
      throw new Error(`Shakespeare line ${lineNumber}: Unrecognized Shakespearean adjective '${word}'`);
    }
    multiplier *= 2;
  }

  return base * multiplier;
}

export function runShakespeare(source, input = []) {
  if (typeof source !== "string") {
    throw new TypeError("Shakespeare source must be a string");
  }

  const lines = source.replace(/\r\n?/g, "\n").split("\n");
  let lineIdx = 0;

  while (lineIdx < lines.length && !lines[lineIdx].trim()) {
    lineIdx += 1;
  }
  if (lineIdx >= lines.length || !lines[lineIdx].trim().endsWith(".")) {
    throw new Error("Shakespeare line 1: Play must begin with a period-terminated title");
  }
  const title = lines[lineIdx].trim();
  lineIdx += 1;

  const characters = new Map();
  let currentAct = "Act I";
  let currentScene = "Scene I";
  const stage = new Set();
  let activeSpeaker = null;
  let inputIndex = 0;
  let statementsExecuted = 0;
  const output = [];
  const cues = [];

  for (; lineIdx < lines.length; lineIdx += 1) {
    const raw = lines[lineIdx].trim();
    if (!raw) continue;
    const lineNumber = lineIdx + 1;

    const actMatch = /^(Act\s+[IVXLCDM]+)\s*:\s*(.+)\.$/i.exec(raw);
    if (actMatch) {
      currentAct = actMatch[1].toUpperCase();
      activeSpeaker = null;
      continue;
    }

    const sceneMatch = /^(Scene\s+[IVXLCDM]+)\s*:\s*(.+)\.$/i.exec(raw);
    if (sceneMatch) {
      currentScene = sceneMatch[1].toUpperCase();
      activeSpeaker = null;
      continue;
    }

    const bracketMatch = /^\[(.+)\]$/.exec(raw);
    if (bracketMatch) {
      const content = bracketMatch[1].trim();
      activeSpeaker = null;
      if (/^Exeunt$/i.test(content)) {
        stage.clear();
        continue;
      }
      const enterMatch = /^Enter\s+(.+)$/i.exec(content);
      if (enterMatch) {
        const names = enterMatch[1].split(/\s+and\s+|,\s*/i).map((n) => n.trim().toUpperCase()).filter(Boolean);
        for (const name of names) {
          if (!characters.has(name)) {
            throw new Error(`Shakespeare line ${lineNumber}: Undeclared character '${name}' in stage direction`);
          }
          stage.add(name);
        }
        continue;
      }
      const exitMatch = /^Exit\s+(.+)$/i.exec(content);
      if (exitMatch) {
        const name = exitMatch[1].trim().toUpperCase();
        stage.delete(name);
        continue;
      }
      throw new Error(`Shakespeare line ${lineNumber}: Invalid stage direction '[${content}]'`);
    }

    const speakerMatch = /^([A-Za-z][A-Za-z\s]*):$/.exec(raw);
    if (speakerMatch) {
      const name = speakerMatch[1].trim().toUpperCase();
      if (!characters.has(name)) {
        throw new Error(`Shakespeare line ${lineNumber}: Undeclared speaker '${name}'`);
      }
      if (!stage.has(name)) {
        throw new Error(`Shakespeare line ${lineNumber}: Speaker '${name}' is not on stage`);
      }
      activeSpeaker = name;
      continue;
    }

    if (!activeSpeaker && currentAct === "Act I" && stage.size === 0 && output.length === 0) {
      const personaMatch = /^([A-Za-z][A-Za-z\s]*),\s*(.+)\.$/.exec(raw);
      if (personaMatch) {
        const name = personaMatch[1].trim().toUpperCase();
        if (!CANONICAL_CHARACTERS.has(name)) {
          throw new Error(`Shakespeare line ${lineNumber}: Unknown Shakespearean character '${name}'`);
        }
        characters.set(name, { name, value: 0, stack: [] });
        continue;
      }
    }

    if (!activeSpeaker) {
      throw new Error(`Shakespeare line ${lineNumber}: Dialogue '${raw}' has no active speaker`);
    }

    const others = [...stage].filter((name) => name !== activeSpeaker);
    if (others.length !== 1) {
      throw new Error(`Shakespeare line ${lineNumber}: Speaker '${activeSpeaker}' requires exactly one addressee on stage`);
    }
    const addresseeName = others[0];
    const speakerState = characters.get(activeSpeaker);
    const addresseeState = characters.get(addresseeName);

    const sentences = raw.match(/[^.!?]+[.!?]+/g);
    if (!sentences) {
      throw new Error(`Shakespeare line ${lineNumber}: Unterminated sentence '${raw}'`);
    }

    for (const rawSentence of sentences) {
      const sentence = rawSentence.trim();
      const lower = sentence.toLowerCase();
      statementsExecuted += 1;

      if (lower === "listen to your heart.") {
        addresseeState.value = inputIndex < input.length ? (input[inputIndex++] & 0xff) : 0;
        continue;
      }

      if (lower.startsWith("remember ")) {
        const target = sentence.slice(9, -1).trim().toLowerCase();
        const pushed = target === "me" || target === "myself" ? speakerState.value : addresseeState.value;
        addresseeState.stack.push(pushed);
        continue;
      }

      if (lower.startsWith("recall ")) {
        addresseeState.value = addresseeState.stack.length > 0 ? addresseeState.stack.pop() : 0;
        continue;
      }

      if (lower === "open your heart." || lower === "speak your mind.") {
        const emitted = addresseeState.value & 0xff;
        output.push(emitted);
        cues.push({
          act: currentAct,
          scene: currentScene,
          speaker: activeSpeaker,
          addressee: addresseeName,
          value: emitted,
          line: sentence,
        });
        continue;
      }

      const asMatch = /^(?:Thou art|You are)\s+as\s+[a-z']+\s+as\s+(.+)[.!]$/.exec(sentence);
      if (asMatch) {
        addresseeState.value = evaluateSplExpression(asMatch[1], speakerState, addresseeState, lineNumber);
        continue;
      }

      const directMatch = /^(?:Thou art|You are)\s+(.+)[.!]$/.exec(sentence);
      if (directMatch) {
        addresseeState.value = evaluateSplExpression(directMatch[1], speakerState, addresseeState, lineNumber);
        continue;
      }

      throw new Error(`Shakespeare line ${lineNumber}: Unsupported dramatic sentence '${sentence}'`);
    }
  }

  return {
    title,
    charactersCount: characters.size,
    statementsExecuted,
    output,
    cues,
  };
}

function chantSeedBytesFor(seed, chantMode = 0, chantFormant = 55, mutation = 0) {
  const mixed = (seed ^ Math.imul(mutation >>> 0, 0x9e3779b1) ^ (chantMode << 19) ^ (chantFormant << 8)) >>> 0;
  let state = mixed || 0x6a09e667;
  const bytes = [];
  for (let i = 0; i < 12; i += 1) {
    state ^= state << 13;
    state ^= state >>> 17;
    state ^= state << 5;
    state = (state + Math.imul(i + 1 + chantMode, 0x85ebca6b)) >>> 0;
    bytes.push((state ^ (seed >>> ((i % 4) * 8))) & 0xff);
  }
  return bytes;
}

export function cycleChantCell(step, score) {
  const melody = melodyFor(score);
  const nextGate = (step.gate + 1) % 3;
  const nextVowelIndex = (step.vowelIndex + 1) % FORMANT_VOWELS.length;
  const vowel = FORMANT_VOWELS[nextVowelIndex];
  const nextInterval = melody[(step.index + nextVowelIndex) % melody.length] % 12;
  return Object.freeze({
    ...step,
    gate: nextGate,
    vowelIndex: nextVowelIndex,
    vowelCode: vowel.code,
    vowelIpa: vowel.ipa,
    f1: vowel.f1,
    f2: vowel.f2,
    f3: vowel.f3,
    interval: nextInterval,
    label: nextGate === 0 ? "SILENT" : `${step.personaShort}·${vowel.code}`,
  });
}

export function composeChant(source, score, mutation = 0) {
  const chantMode = (score.chantMode ?? ((score.seed >>> 7) % 8)) & 7;
  const chantFormant = score.chantFormant ?? 62;
  const input = chantSeedBytesFor(score.seed >>> 0, chantMode, chantFormant, mutation);
  const { title, statementsExecuted, output, cues } = runShakespeare(source, input);

  if (output.length < 12) {
    throw new Error(`Shakespeare play emitted ${output.length} cues; expected at least 12`);
  }

  const melody = melodyFor(score);
  const gateTemplate = CHANT_GATES[chantMode];

  const steps = Array.from({ length: 12 }, (_, index) => {
    const raw = output[index] & 0xff;
    const cue = cues[index] || {
      act: "ACT I",
      scene: `SCENE ${index + 1}`,
      speaker: "HAMLET",
      addressee: "OPHELIA",
    };
    const persona = PERSONA_ROLES[cue.addressee] || PERSONA_ROLES.HAMLET;
    const vowelIndex = (raw + index + chantMode + mutation) % FORMANT_VOWELS.length;
    const vowel = FORMANT_VOWELS[vowelIndex];
    const interval = melody[(index + (raw % 5)) % melody.length] % 12;

    let gate = gateTemplate[index];
    if (index === 0) {
      gate = Math.max(1, gate);
    } else if (gate === 0 && (raw % 8 === 0)) {
      gate = 1;
    }

    return Object.freeze({
      index,
      raw,
      gate,
      act: cue.act,
      scene: cue.scene,
      speaker: cue.speaker,
      addressee: cue.addressee,
      personaShort: persona.short,
      voiceType: persona.voice,
      registerOffset: persona.registerOffset,
      vibratoHz: persona.vibratoHz,
      vowelIndex,
      vowelCode: vowel.code,
      vowelIpa: vowel.ipa,
      f1: vowel.f1,
      f2: vowel.f2,
      f3: vowel.f3,
      interval,
      formantResonance: chantFormant,
      label: gate === 0 ? "SILENT" : `${persona.short}·${vowel.code}`,
    });
  });

  return Object.freeze({
    title,
    mode: chantMode,
    modeName: CHANT_NAMES[chantMode],
    formant: chantFormant,
    mutation,
    statementsExecuted,
    steps: Object.freeze(steps),
  });
}
