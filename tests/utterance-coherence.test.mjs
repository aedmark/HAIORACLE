import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import { buildPerformance, strikeLength } from "../src/accompaniment.mjs";
import { buildGenreSpine, conductEnsemble, installRulebooks } from "../src/conductor.mjs";
import { delayTimeFor } from "../src/ensemble.mjs";
import { compileRulebooks } from "../src/inform.mjs";
import { composeBeat } from "../src/malbolge.mjs";
import { composeBass } from "../src/brainfuck.mjs";
import { composeHarmony } from "../src/befunge.mjs";
import { composeChimes } from "../src/fractran.mjs";
import { composeChant } from "../src/shakespeare.mjs";
import { melodyFor } from "../src/music.mjs";
import { myceliumEvents } from "../src/mycelium.mjs";
import { composeScore } from "../src/score.mjs";
import {
  scheduleBassStep,
  scheduleBeatStep,
  scheduleChantStep,
  scheduleChimeStep,
  scheduleHarmonyStep,
  scheduleNote,
  voiceStack,
} from "../src/schedulers.mjs";
import { effectiveRhythmTemplate, stepUnitSeconds } from "../src/tuning.mjs";

const root = new URL("../", import.meta.url);

const [oracleSrc, rulebooksSrc, beatSrc, bassSrc, harmonySrc, pietSrc, fracSrc, chantSrc] = await Promise.all([
  readFile(new URL("src/oracle.lol", root), "utf8"),
  readFile(new URL("src/rulebooks.ni", root), "utf8"),
  readFile(new URL("src/beat.mal", root), "utf8"),
  readFile(new URL("src/bass.bf", root), "utf8"),
  readFile(new URL("src/harmony.bfg", root), "utf8"),
  readFile(new URL("src/pad.piet", root), "utf8"),
  readFile(new URL("src/chimes.frac", root), "utf8"),
  readFile(new URL("src/chant.spl", root), "utf8"),
]);

installRulebooks(compileRulebooks(rulebooksSrc));

test("P8-15 conductEnsemble generates 16-chord spines and harmonizes 16-step plates without out-of-bounds error", () => {
  const score = composeScore(oracleSrc, "clockwork monarch of the marsh");
  const melody16 = melodyFor(score, 16);
  assert.equal(melody16.length, 16);

  const beat16 = composeBeat(beatSrc, score, 0, 16);
  const bass16 = composeBass(bassSrc, score, 0, 16);
  const harmony16 = composeHarmony(harmonySrc, score, 0, 16);
  const chimes16 = composeChimes(pietSrc, fracSrc, score, 0, 16);
  const chant16 = composeChant(chantSrc, score, 0, 16);

  const conducted = conductEnsemble({
    score,
    melody: melody16,
    beat: beat16,
    bass: bass16,
    harmony: harmony16,
    chimes: chimes16,
    chant: chant16,
    genre: "victorian_tonnetz",
    stepsCount: 16,
  });

  assert.equal(conducted.spine.length, 16, "spine has 16 chords");
  assert.equal(conducted.melody.length, 16, "melody has 16 notes");
  assert.equal(conducted.bass.steps.length, 16, "bass has 16 steps");
  assert.equal(conducted.harmony.steps.length, 16, "harmony has 16 steps");
  assert.equal(conducted.chimes.steps.length, 16, "chimes has 16 steps");
  assert.equal(conducted.chant.steps.length, 16, "chant has 16 steps");

  for (let s = 0; s < 16; s += 1) {
    assert.ok(conducted.spine[s], `spine chord ${s} is defined`);
    assert.ok(conducted.bass.steps[s].label, `bass step ${s} has valid label`);
    assert.ok(conducted.harmony.steps[s].label, `harmony step ${s} has valid label`);
    assert.ok(conducted.chimes.steps[s].label, `chime step ${s} has valid label`);
    assert.ok(conducted.chant.steps[s].label, `chant step ${s} has valid label`);
  }
});

test("P8-15 myceliumEvents scales seamlessly to 16 steps without wrapping prematurely at step 12", () => {
  const score = composeScore(oracleSrc, "botanical expedition into the cellar");

  // 12-step baseline
  const events12 = Array.from({ length: 12 }, (_, s) => myceliumEvents(score, s, 0, 12));
  assert.equal(events12.length, 12);

  // 16-step mode
  const events16 = Array.from({ length: 16 }, (_, s) => myceliumEvents(score, s, 0, 16));
  assert.equal(events16.length, 16);

  // In 16-step mode, downbeat step 0 and step 15 are distinct
  assert.ok(Array.isArray(events16[0]));
  assert.ok(Array.isArray(events16[15]));
});

test("P8-15 Fun Machine progression in 16-step mode builds 16 steps across 4 regions", () => {
  const perf16 = buildPerformance(0, "progression", "victorian_tonnetz", 0, { stepsCount: 16 });
  assert.equal(perf16.steps.length, 16, "performance has 16 steps");
  assert.equal(perf16.regionSteps, 4, "steps per region is 4 in 16-step mode");

  // 4 regions of 4 steps each: region starts at 0, 4, 8, 12
  const regionStarts = perf16.steps.map((step, idx) => (step.isRegionStart ? idx : null)).filter((idx) => idx !== null);
  assert.deepEqual(regionStarts, [0, 4, 8, 12]);

  // Strike length at each region start holds for 4 steps, never truncating early
  assert.equal(strikeLength(perf16, 0), 4, "region 0 holds 4 steps");
  assert.equal(strikeLength(perf16, 4), 4, "region 1 holds 4 steps");
  assert.equal(strikeLength(perf16, 8), 4, "region 2 holds 4 steps");
  assert.equal(strikeLength(perf16, 12), 4, "region 3 holds 4 steps");

  // Clock-synced progression holds the region chord across all 16 steps of the pass
  const clockPerf = buildPerformance(0, "progression", "victorian_tonnetz", 0, { pass: 0, stepsCount: 16 });
  assert.equal(clockPerf.steps.length, 16);
  assert.equal(strikeLength(clockPerf, 0), 16, "clock-synced 16-step pass pad holds full 16-step bar");
  assert.equal(clockPerf.steps[12].chord.name, clockPerf.steps[0].chord.name, "beat 4 chord remains on region chord");
});

test("P8-15 delayTimeFor accounts for step unit duration when barLock44 or 16-step is active", () => {
  const score = composeScore(oracleSrc, "astrolabe in the drawing room");
  const bpm = 120;
  const flatRhythm = [1, 1, 1, 1];

  // 16-step unit duration: 240 / 120 / 16 = 0.125s
  const unit16 = stepUnitSeconds(bpm, flatRhythm, false, 16);
  assert.equal(unit16, 0.125);

  const delaySec16 = delayTimeFor(score, bpm, 0, unit16);
  assert.equal(delaySec16, 0.125, "delay time follows 16th note step unit duration");

  // 12-step unlocked unit duration: 60 / 120 / 2 = 0.25s
  const unit12 = stepUnitSeconds(bpm, flatRhythm, false, 12);
  const delaySec12 = delayTimeFor(score, bpm, 0, unit12);
  assert.equal(delaySec12, 0.25, "delay time follows 8th note unlocked step unit duration");
});

test("effectiveRhythmTemplate guarantees equal quarter-note beats in 16-step and 12-step 4/4 lock metre", () => {
  const bpm = 120;
  for (let idx = 0; idx < 7; idx += 1) {
    // 1. 16-step mode: every template divides 16 evenly and has equal 4-step quarter-note beats
    const r16 = effectiveRhythmTemplate(idx, 16);
    assert.equal(16 % r16.length, 0, `16-step rhythm ${idx} divides 16`);
    const beatSums16 = [0, 4, 8, 12].map((b) => {
      let sum = 0;
      for (let s = 0; s < 4; s += 1) sum += r16[(b + s) % r16.length];
      return sum;
    });
    assert.deepEqual(beatSums16, [4, 4, 4, 4], `16-step rhythm ${idx} produces equal 4.0-unit quarter-note beats`);
    const unit16 = stepUnitSeconds(bpm, r16, false, 16);
    assert.equal(unit16 * 4, 0.5, `quarter note is exactly 0.5s at 120 BPM in 16-step mode`);

    // 2. 12-step 4/4 lock mode: every template divides 12 evenly and has equal 3-step quarter-note beats
    const r12 = effectiveRhythmTemplate(idx, 12, true);
    assert.equal(12 % r12.length, 0, `12-step locked rhythm ${idx} divides 12`);
    const beatSums12 = [0, 3, 6, 9].map((b) => {
      let sum = 0;
      for (let s = 0; s < 3; s += 1) sum += r12[(b + s) % r12.length];
      return sum;
    });
    assert.deepEqual(beatSums12, [3, 3, 3, 3], `12-step locked rhythm ${idx} produces equal 3.0-unit quarter-note beats`);
    const unit12 = stepUnitSeconds(bpm, r12, true, 12);
    assert.ok(Math.abs(unit12 * 3 - 0.5) < 1e-9, `quarter note is approximately 0.5s at 120 BPM in 12-step locked mode`);
  }
});

test("lead singing register headroom and overtone stack consonance", () => {
  const score = composeScore(oracleSrc, "cerulean teapot remembers");
  for (let voice = 0; voice < 6; voice += 1) {
    const stack = voiceStack({ voice }, 0);
    for (const v of stack) {
      assert.ok(v.interval >= 0, `voice stack ${voice} interval ${v.interval} is non-negative (no sub-drag)`);
    }
  }

  // Lead scheduler lifts low roots into the singing register (>= MIDI 60, C4)
  const fakeContext = () => {
    const nodes = [];
    const makeParam = (initial = 0) => ({
      value: initial,
      setValueAtTime() {},
      exponentialRampToValueAtTime() {},
      setTargetAtTime() {},
    });
    return {
      currentTime: 0,
      createGain: () => {
        const g = { gain: makeParam(1), connect: () => g };
        nodes.push(g);
        return g;
      },
      createOscillator: () => {
        const o = { frequency: makeParam(440), detune: makeParam(0), type: "sine", connect: () => o, start() {}, stop() {} };
        nodes.push(o);
        return o;
      },
    };
  };

  const loggedNotes = [];
  const logNote = (transport, channel, note, at, dur, peak) => {
    if (channel === "lead") loggedNotes.push(note);
  };

  for (const root of [30, 36, 48, 55]) {
    const ctx = fakeContext();
    const testScore = { ...score, root, gate: 40 };
    const transport = { mix: ctx.createGain(), melody: [0, 2, 4, 7] };
    scheduleNote(ctx, transport, testScore, 0, 1.0, 0.25, { currentTransport: transport, logNote });
    const lastNote = loggedNotes.at(-1);
    assert.ok(lastNote >= 60, `lead note for root ${root} is elevated into singing register >= 60 (got ${lastNote})`);
  }
});

test("mycelium bio-acoustic harmonic grounding and physical modeling", () => {
  const scoreC = { ...composeScore(oracleSrc, "connoisseur of small umbrellas"), root: 48 };
  const scoreFSharp = { ...composeScore(oracleSrc, "connoisseur of small umbrellas"), root: 54 };

  const loopEventsC = Array.from({ length: 12 }, (_, s) => myceliumEvents(scoreC, s)).flat();
  const loopEventsFSharp = Array.from({ length: 12 }, (_, s) => myceliumEvents(scoreFSharp, s)).flat();

  const tonesC = loopEventsC.filter((e) => e.kind === "tone");
  const tonesFSharp = loopEventsFSharp.filter((e) => e.kind === "tone");

  assert.ok(tonesC.length > 0 && tonesFSharp.length > 0);
  assert.notEqual(tonesC[0].freq, tonesFSharp[0].freq, "fundamental frequencies shift with root pitch class");

  // Every form produces distinct acoustic events
  for (let form = 0; form < 8; form += 1) {
    const formScore = { ...scoreC, fungalForm: form };
    const loopEvents = Array.from({ length: 12 }, (_, s) => myceliumEvents(formScore, s)).flat();
    assert.ok(loopEvents.length > 0, `form ${form} produces loop events`);
    for (const ev of loopEvents) {
      assert.ok(ev.decay >= 0.016 && ev.decay <= 0.36, `form ${form} decay in bounds: ${ev.decay}`);
      assert.ok(ev.peak > 0 && ev.peak <= 0.1, `form ${form} peak in bounds: ${ev.peak}`);
    }
  }
});

test("Plates I–V synthesis timbre, tone, and archetype variance (P8-18)", () => {
  const scoreC = { ...composeScore(oracleSrc, "botanical expedition into the cellar"), root: 48 };

  function createInspectorAudioContext() {
    const nodes = [];
    function makeParam(initial = 0) {
      const param = {
        value: initial,
        events: [],
        setValueAtTime(val, time) {
          param.value = val;
          param.events.push({ type: "setValueAtTime", val, time });
        },
        exponentialRampToValueAtTime(val, time) {
          param.value = val;
          param.events.push({ type: "exponentialRampToValueAtTime", val, time });
        },
        linearRampToValueAtTime(val, time) {
          param.value = val;
          param.events.push({ type: "linearRampToValueAtTime", val, time });
        },
        setTargetAtTime(val, time, constant) {
          param.value = val;
          param.events.push({ type: "setTargetAtTime", val, time, constant });
        },
      };
      return param;
    }

    function makeNode(kind, extra = {}) {
      const n = {
        kind,
        connect(target) { return target; },
        start() {},
        stop() {},
        ...extra,
      };
      nodes.push(n);
      return n;
    }

    return {
      currentTime: 0,
      sampleRate: 8000,
      nodes,
      createGain: () => makeNode("gain", { gain: makeParam(1) }),
      createOscillator: () => makeNode("oscillator", { type: "sine", frequency: makeParam(440), detune: makeParam(0) }),
      createBiquadFilter: () => makeNode("biquad", { type: "lowpass", frequency: makeParam(350), Q: makeParam(1) }),
      createBufferSource: () => makeNode("bufferSource", { buffer: null }),
      createBuffer: (channels, frames, sampleRate) => ({
        numberOfChannels: channels,
        length: frames,
        sampleRate,
        getChannelData: () => new Float32Array(frames),
      }),
    };
  }

  // 1. Plate I: Malbolge Beat Machine
  const testBeat = {
    steps: [
      { kick: 2, snare: 1, hat: 1 },
      { kick: 0, snare: 2, hat: 0 },
    ],
  };

  // beatMode 0 (Automaton March) schedules click transient on kick
  {
    const ctx = createInspectorAudioContext();
    const bus = ctx.createGain();
    const transport = { beatBus: bus };
    scheduleBeatStep(ctx, transport, { ...scoreC, beatMode: 0 }, 0, 1.0, 0.25, { currentBeat: testBeat });
    const clickOsc = ctx.nodes.find((n) => n.kind === "oscillator" && n.type === "triangle" && n.frequency.events.some((e) => e.val === 1450));
    assert.ok(clickOsc, "beatMode 0 schedules high-frequency click transient");
  }

  // beatMode 1 (Seance Waltz) has deep sub boom kick and lower snare bandpass center
  {
    const ctx = createInspectorAudioContext();
    const bus = ctx.createGain();
    const transport = { beatBus: bus };
    scheduleBeatStep(ctx, transport, { ...scoreC, beatMode: 1 }, 0, 1.0, 0.25, { currentBeat: testBeat });
    const snareFilter = ctx.nodes.find((n) => n.kind === "biquad" && n.type === "bandpass");
    assert.equal(snareFilter.frequency.value, 780, "beatMode 1 uses 780 Hz snare bandpass center");
    assert.equal(snareFilter.Q.value, 1.8, "beatMode 1 uses 1.8 snare filter Q");
    const kickOsc = ctx.nodes.find((n) => n.kind === "oscillator" && n.type === "sine");
    const endRamp = kickOsc.frequency.events.find((e) => e.type === "exponentialRampToValueAtTime");
    assert.equal(endRamp.val, 28, "beatMode 1 kick ramps down to 28 Hz sub boom");
  }

  // beatMode 2 (Pendulum Galop) has triangle kick and high snare bandpass center
  {
    const ctx = createInspectorAudioContext();
    const bus = ctx.createGain();
    const transport = { beatBus: bus };
    scheduleBeatStep(ctx, transport, { ...scoreC, beatMode: 2 }, 0, 1.0, 0.25, { currentBeat: testBeat });
    const snareFilter = ctx.nodes.find((n) => n.kind === "biquad" && n.type === "bandpass");
    assert.equal(snareFilter.frequency.value, 2200, "beatMode 2 uses 2200 Hz snare bandpass center");
    assert.equal(snareFilter.Q.value, 3.6, "beatMode 2 uses 3.6 snare filter Q");
    const kickOsc = ctx.nodes.find((n) => n.kind === "oscillator" && n.type === "triangle");
    assert.ok(kickOsc, "beatMode 2 uses triangle kick wave");
  }

  // 2. Plate II: Brainfuck Walking Bass
  const testBass = {
    steps: [
      { gate: 1, register: 0, interval: 0, accent: false, slide: false },
      { gate: 2, register: 1, interval: 4, accent: true, slide: true },
    ],
  };

  // bassMode 0 (Walking Cellar) schedules upright fingerboard pluck transient
  {
    const ctx = createInspectorAudioContext();
    const bus = ctx.createGain();
    const transport = { bassBus: bus };
    scheduleBassStep(ctx, transport, { ...scoreC, bassMode: 0 }, 0, 1.0, 0.25, { currentBass: testBass });
    const pluckOsc = ctx.nodes.find((n) => n.kind === "oscillator" && n.frequency.events.some((e) => e.val > 200 && e.time === 1.0));
    assert.ok(pluckOsc, "bassMode 0 schedules upright fingerboard pluck transient");
  }

  // bassMode 1 (Acid Catacomb) uses sawtooth upper osc and resonant 303 filter sweep
  {
    const ctx = createInspectorAudioContext();
    const bus = ctx.createGain();
    const transport = { bassBus: bus };
    scheduleBassStep(ctx, transport, { ...scoreC, bassMode: 1 }, 0, 1.0, 0.25, { currentBass: testBass });
    const upperOsc = ctx.nodes.find((n) => n.kind === "oscillator" && n.type === "sawtooth");
    assert.ok(upperOsc, "bassMode 1 uses sawtooth upper oscillator");
    const bassFilter = ctx.nodes.find((n) => n.kind === "biquad" && n.type === "lowpass");
    assert.equal(bassFilter.Q.value, 3.8, "bassMode 1 has resonant Q of 3.8");
  }

  // bassMode 2 (Subterranean Dub) uses sub unison and lower cutoff
  {
    const ctx = createInspectorAudioContext();
    const bus = ctx.createGain();
    const transport = { bassBus: bus };
    scheduleBassStep(ctx, transport, { ...scoreC, bassMode: 2 }, 0, 1.0, 0.25, { currentBass: testBass });
    const bassFilter = ctx.nodes.find((n) => n.kind === "biquad" && n.type === "lowpass");
    assert.equal(bassFilter.Q.value, 1.2, "bassMode 2 has gentle lowpass Q of 1.2");
    assert.ok(bassFilter.frequency.value <= 420, "bassMode 2 clamps cutoff <= 420 Hz for deep sub weight");
  }

  // 3. Plate III: Befunge-93 Harmony Organ
  const testHarmony = {
    steps: [
      { gate: 1, chord: [0, 4, 7], strumMs: 20, mirror: "/" },
      { gate: 2, chord: [0, 3, 7], strumMs: 30, mirror: "\\" },
    ],
  };

  // harmonyMode 2 (Cathedral Swell) schedules octave stopOsc (freq * 2)
  {
    const ctx = createInspectorAudioContext();
    const bus = ctx.createGain();
    const transport = { harmonyBus: bus };
    scheduleHarmonyStep(ctx, transport, { ...scoreC, harmonyMode: 2 }, 0, 1.0, 0.25, { currentHarmony: testHarmony });
    const oscs = ctx.nodes.filter((n) => n.kind === "oscillator");
    assert.ok(oscs.length >= 4, "harmonyMode 2 schedules 3 chord voices + 4' stop oscillator");
  }

  // harmonyMode 3 (Clockwork Celesta) schedules crystalline inharmonic stopOsc (freq * 2.76)
  {
    const ctx = createInspectorAudioContext();
    const bus = ctx.createGain();
    const transport = { harmonyBus: bus };
    scheduleHarmonyStep(ctx, transport, { ...scoreC, harmonyMode: 3 }, 0, 1.0, 0.25, { currentHarmony: testHarmony });
    const oscs = ctx.nodes.filter((n) => n.kind === "oscillator");
    assert.ok(oscs.length >= 4, "harmonyMode 3 schedules stop oscillator");
    const celestaOsc = oscs.find((o) => {
      const f = o.frequency.value;
      const rootFreq = 440 * (2 ** ((48 - 69) / 12));
      return Math.abs(f - rootFreq * 2.76) < 1.0;
    });
    assert.ok(celestaOsc, "harmonyMode 3 schedules inharmonic celesta overtone at 2.76x");
  }

  // 4. Plate IV: Piet/FRACTRAN Chimes & Pad
  const testChimes = {
    steps: [
      { gate: 1, ratioValue: 1.5, lightnessIndex: 0, hueIndex: 2, exponents: { e3: 1 } },
      { gate: 2, ratioValue: 2.0, lightnessIndex: 1, hueIndex: 4, exponents: { e3: 2 } },
    ],
  };

  // chimeMode 5 (Balinese Gamelan) schedules inharmonic overtone (1.52x)
  {
    const ctx = createInspectorAudioContext();
    const bus = ctx.createGain();
    const transport = { chimeBus: bus };
    scheduleChimeStep(ctx, transport, { ...scoreC, chimeMode: 5 }, 0, 1.0, 0.25, { currentChimes: testChimes });
    const oscs = ctx.nodes.filter((n) => n.kind === "oscillator");
    assert.ok(oscs.length >= 3, "chimeMode 5 schedules overtone oscillator for gamelan resonance");
  }

  // chimeShimmer modulates pad filter frequency
  {
    const ctxLo = createInspectorAudioContext();
    const busLo = ctxLo.createGain();
    scheduleChimeStep(ctxLo, { chimeBus: busLo }, { ...scoreC, chimeShimmer: 10 }, 0, 1.0, 0.25, { currentChimes: testChimes });
    const filterLo = ctxLo.nodes.find((n) => n.kind === "biquad" && n.type === "lowpass");

    const ctxHi = createInspectorAudioContext();
    const busHi = ctxHi.createGain();
    scheduleChimeStep(ctxHi, { chimeBus: busHi }, { ...scoreC, chimeShimmer: 90 }, 0, 1.0, 0.25, { currentChimes: testChimes });
    const filterHi = ctxHi.nodes.find((n) => n.kind === "biquad" && n.type === "lowpass");

    assert.ok(filterHi.frequency.value > filterLo.frequency.value, "chimeShimmer increases pad filter cutoff");
  }

  // 5. Plate V: Shakespeare Formant Choir
  const testChant = {
    steps: [
      { gate: 1, registerOffset: 0, interval: 0, f1: 500, f2: 1500, f3: 2500, vibratoHz: 5.2 },
      { gate: 2, registerOffset: 12, interval: 4, f1: 650, f2: 1750, f3: 2850, vibratoHz: 5.8 },
    ],
  };

  // chantMode 1 (Witches' Coven) schedules breath air noise buffer source
  {
    const ctx = createInspectorAudioContext();
    const bus = ctx.createGain();
    const transport = { chantBus: bus };
    scheduleChantStep(ctx, transport, { ...scoreC, chantMode: 1 }, 0, 1.0, 0.25, { currentChant: testChant });
    const breathNode = ctx.nodes.find((n) => n.kind === "bufferSource");
    assert.ok(breathNode, "chantMode 1 schedules breath air noise buffer source");
  }

  // chantMode 2 (Ariel) schedules breath noise and lifts formantShift by 1.25
  {
    const ctx = createInspectorAudioContext();
    const bus = ctx.createGain();
    const transport = { chantBus: bus };
    scheduleChantStep(ctx, transport, { ...scoreC, chantMode: 2 }, 0, 1.0, 0.25, { currentChant: testChant });
    const filters = ctx.nodes.filter((n) => n.kind === "biquad" && n.type === "bandpass");
    assert.equal(filters.length, 3, "schedules 3 formant filters");
    assert.equal(filters[0].frequency.value, 500 * 1.25, "chantMode 2 lifts formant frequency by 1.25x for soprano register");
  }

  // chantFormant modulates formant resonance Q
  {
    const ctxLo = createInspectorAudioContext();
    const busLo = ctxLo.createGain();
    scheduleChantStep(ctxLo, { chantBus: busLo }, { ...scoreC, chantFormant: 25 }, 0, 1.0, 0.25, { currentChant: testChant });
    const filterLo = ctxLo.nodes.find((n) => n.kind === "biquad" && n.type === "bandpass");

    const ctxHi = createInspectorAudioContext();
    const busHi = ctxHi.createGain();
    scheduleChantStep(ctxHi, { chantBus: busHi }, { ...scoreC, chantFormant: 95 }, 0, 1.0, 0.25, { currentChant: testChant });
    const filterHi = ctxHi.nodes.find((n) => n.kind === "biquad" && n.type === "bandpass");

    assert.ok(filterHi.Q.value > filterLo.Q.value, "chantFormant increases formant resonance Q");
  }
});
