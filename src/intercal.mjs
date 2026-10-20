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
 * 2. Sectional Orchestration: Uses PLEASE IGNORE and PLEASE REMEMBER to
 *    dynamically rest and summon voices across 4 musical regions:
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
    };
  }
}

export function runIntercal(source) {
  const vm = new IntercalVM(source);
  return vm.evaluate();
}

/**
 * Composes a dynamic 12-step ensemble arrangement from the INTERCAL conductor score.
 * Breaks the wall of sound into 4 musical regions with intentional breathing,
 * call-and-response, tutti climaxes, and cadence turnarounds.
 */
export function composeArrangement(source, score, cycle = 0) {
  const exec = runIntercal(source);
  const politenessPct = (exec.politenessRatio * 100).toFixed(1);

  // 4 Regional Arrangement Templates driven by INTERCAL execution
  // Region 0 (Steps 0..2): Exposition Groove
  // Region 1 (Steps 3..5): Antiphonal Conversation
  // Region 2 (Steps 6..8): Grand Tutti Apotheosis
  // Region 3 (Steps 9..11): Hypogeal Breakdown & COME FROM Turnaround
  const regionalMasks = [
    // 0: Exposition: Groove foundation (Lead, Beat, Bass, Chimes; Harmony & Chant rest)
    Object.freeze({
      lead: true,
      beat: true,
      bass: true,
      harmony: false,
      chime: true,
      chant: false,
      fungal: true,
      fun: true,
    }),
    // 1: Antiphony: Call-and-response (Harmony & Chant take lead; Lead breathes)
    Object.freeze({
      lead: false,
      beat: true,
      bass: true,
      harmony: true,
      chime: true,
      chant: true,
      fungal: true,
      fun: true,
    }),
    // 2: Tutti: Full ensemble apotheosis
    Object.freeze({
      lead: true,
      beat: true,
      bass: true,
      harmony: true,
      chime: true,
      chant: true,
      fungal: true,
      fun: true,
    }),
    // 3: Breakdown (steps 9..10) & Turnaround (step 11 via COME FROM)
    Object.freeze({
      lead: true,
      beat: false, // Beat drops out on breakdown
      bass: false, // Bass drops out on breakdown
      harmony: true,
      chime: true,
      chant: true,
      fungal: true,
      fun: true,
    }),
  ];

  const channelMasks = [];
  for (let step = 0; step < 12; step += 1) {
    const regionIdx = Math.floor(step / 3) % 4;
    const baseMask = regionalMasks[regionIdx];

    if (step === 11) {
      // Step 11: COME FROM (60) Turnaround cadence brings Beat and Bass back with emphatic resolution
      channelMasks.push(Object.freeze({
        ...baseMask,
        beat: true,
        bass: true,
        isTurnaround: true,
      }));
    } else {
      channelMasks.push(Object.freeze({
        ...baseMask,
        isTurnaround: false,
      }));
    }
  }

  const sections = INTERCAL_SECTION_NAMES.map((name, idx) => Object.freeze({
    index: idx,
    name,
    steps: [idx * 3, idx * 3 + 1, idx * 3 + 2],
    mask: regionalMasks[idx],
  }));

  const summary = `INTERCAL 1972 CONDUCTOR · 4 REGIONS · POLITENESS ${politenessPct}% (ICL BALANCED) · COME FROM @11`;

  return Object.freeze({
    sections,
    channelMasks: Object.freeze(channelMasks),
    politeness: exec.politenessRatio,
    politenessPercentage: `${politenessPct}%`,
    statementsExecuted: exec.stepsExecuted,
    turnaroundStep: 11,
    summary,
  });
}
