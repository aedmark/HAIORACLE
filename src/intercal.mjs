/**
 * Edmark's Esoteric Fun Machine — INTERCAL 1972 Grand Ensemble Conductor
 *
 * Implements a purpose-built virtual machine for INTERCAL 1972 (Don Woods &
 * James M. Lyon, Princeton University), serving as the master conductor and
 * dynamic arrangement orchestrator for the ensemble.
 *
 * The INTERCAL score (src/conductor.i) overcomes the "wall of sound" by
 * dynamically orchestrating channel breathing, call-and-response antiphony,
 * tutti climaxes, and COME FROM cadence interceptions across the 12-step loop:
 *
 * 1. Politeness Quotient: Statement politeness ratio (P / N) is strictly
 *    verified (0.20 <= P <= 0.33). Rude code is rejected with ICL079;
 *    groveling code is rejected with ICL099.
 * 2. Sectional Orchestration: eight twospot registers rest (#0) or summon (#1)
 *    one channel each; onespot markers open sections, and the registers as the
 *    program leaves them become the masks. PLEASE IGNORE freezes the Fun
 *    Machine register so no later order can rest the player:
 *    - Region 0 (Steps 0..2): Exposition Groove (Lead, Beat, Bass, Chimes; Harmony & Choir rest)
 *    - Region 1 (Steps 3..5): Antiphonal Conversation (Chords & Choir enter; Lead breathes)
 *    - Region 2 (Steps 6..8): Grand Tutti Apotheosis (All 8 channels unite)
 *    - Region 3 (Steps 9..11): Hypogeal Breakdown & COME FROM Cadence Turnaround
 * 3. COME FROM Cadence Interception: Intercepts the turnaround boundary at
 *    step 11 to trigger dynamic cadence resolution into the next cycle.
 */

export const INTERCAL_SECTION_NAMES = Object.freeze([
  "EXPOSITION GROOVE",
  "ANTIPHONAL CONVERSATION",
  "GRAND TUTTI APOTHEOSIS",
  "HYPOGEAL BREAKDOWN & CADENCE",
]);

export const INTERCAL_CHANNELS = Object.freeze([
  "lead",
  "beat",
  "bass",
  "harmony",
  "chime",
  "chant",
  "fungal",
  "fun",
]);

/**
 * INTERCAL 1972 Mingle operator ($):
 * Interleaves alternate bits of two 16-bit values into a 32-bit result.
 */
export function intercalMingle(a, b) {
  let res = 0n;
  const bigA = BigInt((a >>> 0) & 0xffff);
  const bigB = BigInt((b >>> 0) & 0xffff);
  for (let i = 0n; i < 16n; i += 1n) {
    const bitA = (bigA >> i) & 1n;
    const bitB = (bigB >> i) & 1n;
    res |= (bitB << (2n * i));
    res |= (bitA << (2n * i + 1n));
  }
  return Number(res);
}

/**
 * INTERCAL 1972 Select operator (~):
 * Selects bits from A corresponding to 1s in B and packs them to the right.
 */
export function intercalSelect(a, b) {
  let res = 0;
  let outBit = 0;
  const uA = a >>> 0;
  const uB = b >>> 0;
  for (let i = 0; i < 32; i += 1) {
    if ((uB & (1 << i)) !== 0) {
      if ((uA & (1 << i)) !== 0) {
        res |= (1 << outBit);
      }
      outBit += 1;
    }
  }
  return res >>> 0;
}

export class IntercalVM {
  constructor(source, input = []) {
    this.source = String(source || "");
    // WRITE IN reads from this queue. Real INTERCAL spells input digits out in
    // English ("ONE TWO"); the host hands numbers over directly.
    this.input = [...input];
    this.statements = [];
    this.labels = new Map();
    this.comeFroms = new Map();
    this.vars16 = new Map();
    this.vars32 = new Map();
    this.ignoredVars = new Set();
    this.trace = [];
    this.parse();
  }

  parse() {
    const lines = this.source.split("\n");
    for (let i = 0; i < lines.length; i += 1) {
      const lineNum = i + 1;
      let raw = lines[i].trim();
      if (!raw || raw.startsWith("PLEASE NOTE")) continue;

      let label = null;
      const labelMatch = raw.match(/^\((\d+)\)\s*(.*)$/);
      if (labelMatch) {
        label = parseInt(labelMatch[1], 10);
        raw = labelMatch[2].trim();
      }

      const isPlease = /^PLEASE\b/i.test(raw);
      let body = raw.replace(/^PLEASE\s+/i, "").trim();
      const isDo = /^DO\b/i.test(body);
      if (isDo) {
        body = body.replace(/^DO\s+/i, "").trim();
      } else if (/^DON'T\b/i.test(body)) {
        body = body.replace(/^DON'T\s+/i, "").trim();
      }

      const stmtObj = {
        lineNum,
        label,
        raw,
        isPlease,
        isDo,
        body,
      };

      if (label !== null) {
        this.labels.set(label, this.statements.length);
      }

      const comeFromMatch = body.match(/^COME\s+FROM\s*\(?(\d+)\)?/i);
      if (comeFromMatch) {
        const target = parseInt(comeFromMatch[1], 10);
        this.comeFroms.set(target, this.statements.length);
      }

      this.statements.push(stmtObj);
    }
  }

  operand(text, stmt) {
    if (/^#\d+$/.test(text)) return parseInt(text.slice(1), 10);
    if (/^:\d+$/.test(text)) return this.vars32.get(text) || 0;
    if (/^\.\d+$/.test(text)) return this.vars16.get(text) || 0;
    throw new Error(`INTERCAL line ${stmt.lineNum}: Unrecognized operand ${text} (ICL017)`);
  }

  // One binary operator at most: select (~) or mingle ($). Real INTERCAL
  // groups deeper expressions with sparks and rabbit-ears; the score needs none.
  expression(expr, stmt) {
    const match = expr.match(/^(\S+)\s*([~$])\s*(\S+)$/);
    if (!match) return this.operand(expr, stmt);
    const left = this.operand(match[1], stmt);
    const right = this.operand(match[3], stmt);
    return match[2] === "~" ? intercalSelect(left, right) : intercalMingle(left, right);
  }

  assign(target, val, stmt) {
    if (this.ignoredVars.has(target)) return;
    if (target.startsWith(":")) {
      this.vars32.set(target, val >>> 0);
    } else if (target.startsWith(".")) {
      if (val > 0xffff) throw new Error(`INTERCAL line ${stmt.lineNum}: ${val} does not fit a onespot variable (ICL275)`);
      this.vars16.set(target, val);
      // Onespot markers carry the arrangement's form, so each one keeps
      // a snapshot of the twospot channel registers at that moment.
      this.trace.push(Object.freeze({ target, value: val, registers: Object.freeze(Object.fromEntries(this.vars32)) }));
    }
  }

  evaluate() {
    const total = this.statements.length;
    if (total === 0) {
      throw new Error("INTERCAL line 1: Empty program");
    }

    const politeCount = this.statements.filter((s) => s.isPlease).length;
    const politenessRatio = politeCount / total;

    if (politenessRatio < 0.20) {
      const line = this.statements[0]?.lineNum || 1;
      throw new Error(`INTERCAL line ${line}: Insufficiently polite (ICL079, ratio ${politenessRatio.toFixed(3)} < 0.20)`);
    }
    if (politenessRatio > 0.3334) {
      const line = this.statements[0]?.lineNum || 1;
      throw new Error(`INTERCAL line ${line}: Overly polite (ICL099, ratio ${politenessRatio.toFixed(3)} > 0.333)`);
    }

    let pc = 0;
    let steps = 0;
    const maxSteps = 2000;
    let gaveUp = false;

    while (pc < this.statements.length && steps < maxSteps) {
      const stmt = this.statements[pc];
      steps += 1;
      const body = stmt.body;

      if (/^GIVE\s+UP/i.test(body)) {
        gaveUp = true;
        break;
      } else if (/^IGNORE\s+([.:]\d+)/i.test(body)) {
        const v = body.match(/^IGNORE\s+([.:]\d+)/i)[1];
        this.ignoredVars.add(v);
      } else if (/^REMEMBER\s+([.:]\d+)/i.test(body)) {
        const v = body.match(/^REMEMBER\s+([.:]\d+)/i)[1];
        this.ignoredVars.delete(v);
      } else if (/^WRITE\s+IN\s+([.:]\d+)/i.test(body)) {
        const target = body.match(/^WRITE\s+IN\s+([.:]\d+)/i)[1];
        if (this.input.length === 0) throw new Error(`INTERCAL line ${stmt.lineNum}: Input exhausted (ICL562 I DO NOT COMPUTE)`);
        this.assign(target, this.input.shift(), stmt);
      } else if (body.includes("<-")) {
        const [target, expr] = body.split("<-").map((part) => part.trim());
        this.assign(target, this.expression(expr, stmt), stmt);
      }

      // Check COME FROM for the label of the statement just completed
      if (stmt.label !== null && this.comeFroms.has(stmt.label)) {
        const dest = this.comeFroms.get(stmt.label);
        pc = dest;
        continue;
      }

      pc += 1;
    }

    return {
      statementsCount: total,
      politeCount,
      politenessRatio,
      stepsExecuted: steps,
      gaveUp,
      ignoredVars: Array.from(this.ignoredVars),
      vars32: Object.fromEntries(this.vars32),
      vars16: Object.fromEntries(this.vars16),
      trace: Object.freeze([...this.trace]),
    };
  }
}

export function runIntercal(source, input = []) {
  const vm = new IntercalVM(source, input);
  return vm.evaluate();
}

// The conductor score's calling convention (src/conductor.i):
//  - twospot registers :1..:8 hold one channel each, in INTERCAL_CHANNELS
//    order; #1 plays and #0 rests;
//  - `.1 <- #n` opens section n (1..4); a section plays the registers as they
//    stand when the next section opens;
//  - `.3 <- #s` closes section 4 and starts the turnaround on step s, inside
//    section 4 but after its first step; from s to the loop's end the band
//    plays the registers as they stand at GIVE UP;
//  - WRITE IN supplies the creature's 16-bit arrangement word, then its
//    complement, so the score can choose per phrase with select (~).
const SECTION_COUNT = 4;
const STEPS_PER_SECTION = 3;

function channelMask(registers, where) {
  const mask = {};
  INTERCAL_CHANNELS.forEach((channel, index) => {
    const name = `:${index + 1}`;
    const value = registers[name];
    if (value !== 0 && value !== 1) {
      throw new RangeError(`INTERCAL conductor: register ${name} (${channel}) must hold #0 or #1 at ${where}, found ${value === undefined ? "nothing" : `#${value}`}`);
    }
    mask[channel] = value === 1;
  });
  return Object.freeze(mask);
}

/**
 * The creature's 16-bit arrangement word: the score seed, avalanche-mixed so
 * the form does not move in lockstep with the seed bits the other VMs read.
 */
export function arrangementWordFor(score) {
  let x = (score?.seed ?? 0) >>> 0;
  x = Math.imul(x ^ (x >>> 16), 0x45d9f3b) >>> 0;
  x = Math.imul(x ^ (x >>> 16), 0x45d9f3b) >>> 0;
  return (x ^ (x >>> 16)) & 0xffff;
}

/**
 * Composes the 12-step ensemble arrangement by running the INTERCAL conductor
 * score on the creature's arrangement word: four 3-step sections (Exposition,
 * Antiphony, Tutti, Breakdown) plus a COME FROM turnaround. Every mask comes
 * from the program's registers, so editing src/conductor.i re-arranges the
 * band; malformed form is rejected. The same phrase always gets the same form.
 */
export function composeArrangement(source, score) {
  const word = arrangementWordFor(score);
  const exec = runIntercal(source, [word, word ^ 0xffff]);
  if (!exec.gaveUp) throw new RangeError("INTERCAL conductor: the score must end with GIVE UP");
  const politenessPct = (exec.politenessRatio * 100).toFixed(1);

  const regionalMasks = [];
  let openSection = 0;
  let turnaroundStep = null;
  for (const mark of exec.trace) {
    if (mark.target === ".1") {
      if (mark.value !== openSection + 1 || mark.value > SECTION_COUNT) {
        throw new RangeError(`INTERCAL conductor: expected section ${openSection + 1}, found .1 <- #${mark.value}`);
      }
      if (openSection > 0) regionalMasks.push(channelMask(mark.registers, `the start of section ${mark.value}`));
      openSection = mark.value;
    } else if (mark.target === ".3") {
      if (openSection !== SECTION_COUNT || turnaroundStep !== null) {
        throw new RangeError("INTERCAL conductor: the turnaround .3 must follow section 4, once");
      }
      const lastSectionStart = (SECTION_COUNT - 1) * STEPS_PER_SECTION;
      if (!Number.isInteger(mark.value) || mark.value <= lastSectionStart || mark.value >= SECTION_COUNT * STEPS_PER_SECTION) {
        throw new RangeError(`INTERCAL conductor: turnaround step #${mark.value} must fall on step 10 or 11 of section 4`);
      }
      regionalMasks.push(channelMask(mark.registers, "the turnaround"));
      turnaroundStep = mark.value;
    }
  }
  if (regionalMasks.length !== SECTION_COUNT || turnaroundStep === null) {
    throw new RangeError(`INTERCAL conductor: expected 4 sections and a turnaround, found ${regionalMasks.length} sections`);
  }
  const turnaroundMask = channelMask(exec.vars32, "GIVE UP");

  const channelMasks = Array.from({ length: SECTION_COUNT * STEPS_PER_SECTION }, (_, step) => (
    step >= turnaroundStep
      ? Object.freeze({ ...turnaroundMask, isTurnaround: true })
      : Object.freeze({ ...regionalMasks[Math.floor(step / STEPS_PER_SECTION)], isTurnaround: false })
  ));

  const sections = INTERCAL_SECTION_NAMES.map((name, idx) => Object.freeze({
    index: idx,
    name,
    steps: Object.freeze([idx * 3, idx * 3 + 1, idx * 3 + 2]),
    mask: regionalMasks[idx],
  }));

  const summary = `INTERCAL 1972 CONDUCTOR · 4 REGIONS · POLITENESS ${politenessPct}% (ICL BALANCED) · COME FROM @${turnaroundStep}`;

  return Object.freeze({
    word,
    sections: Object.freeze(sections),
    channelMasks: Object.freeze(channelMasks),
    politeness: exec.politenessRatio,
    politenessPercentage: `${politenessPct}%`,
    statementsExecuted: exec.stepsExecuted,
    turnaroundStep,
    summary,
  });
}

/** The section a loop step belongs to, and whether it is the turnaround. */
export function arrangementSectionAt(arrangement, step) {
  const index = ((Math.trunc(step) % 12) + 12) % 12;
  const section = arrangement.sections[Math.floor(index / STEPS_PER_SECTION)];
  return Object.freeze({ section, isTurnaround: index >= arrangement.turnaroundStep, mask: arrangement.channelMasks[index] });
}
