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
  constructor(source) {
    this.source = String(source || "");
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
      } else if (body.includes("<-")) {
        const [target, expr] = body.split("<-").map((s) => s.trim());
        let val = 0;
        if (expr.startsWith("#")) {
          val = parseInt(expr.slice(1), 10) || 0;
        } else if (expr.startsWith(":")) {
          val = this.vars32.get(expr) || 0;
        } else if (expr.startsWith(".")) {
          val = this.vars16.get(expr) || 0;
        }

        if (!this.ignoredVars.has(target)) {
          if (target.startsWith(":")) {
            this.vars32.set(target, val);
          } else if (target.startsWith(".")) {
            this.vars16.set(target, val);
            // Onespot markers carry the arrangement's form, so each one keeps
            // a snapshot of the twospot channel registers at that moment.
            this.trace.push(Object.freeze({ target, value: val, registers: Object.freeze(Object.fromEntries(this.vars32)) }));
          }
        }
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

export function runIntercal(source) {
  const vm = new IntercalVM(source);
  return vm.evaluate();
}

// The conductor score's calling convention (src/conductor.i):
//  - twospot registers :1..:8 hold one channel each, in INTERCAL_CHANNELS
//    order; #1 plays and #0 rests;
//  - `.1 <- #n` opens section n (1..4); a section plays the registers as they
//    stand when the next section opens;
//  - `.3 <- #s` names the turnaround step and closes section 4; the turnaround
//    step plays the registers as they stand at GIVE UP.
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
 * Composes the 12-step ensemble arrangement by running the INTERCAL conductor
 * score: four 3-step sections (Exposition, Antiphony, Tutti, Breakdown) plus a
 * COME FROM turnaround step. Every mask comes from the program's registers, so
 * editing src/conductor.i re-arranges the band; malformed form is rejected.
 * The arrangement is the band's form, so it is the same for every creature.
 */
export function composeArrangement(source) {
  const exec = runIntercal(source);
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
      if (!Number.isInteger(mark.value) || mark.value < 0 || mark.value >= SECTION_COUNT * STEPS_PER_SECTION) {
        throw new RangeError(`INTERCAL conductor: turnaround step #${mark.value} is outside the 12-step loop`);
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
    step === turnaroundStep
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
  return Object.freeze({ section, isTurnaround: index === arrangement.turnaroundStep, mask: arrangement.channelMasks[index] });
}
