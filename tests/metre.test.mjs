import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import { DEFAULT_GRID_STEPS, GRID_STEPS_OPTIONS, stepUnitSeconds } from "../src/tuning.mjs";
import { composeScore } from "../src/score.mjs";
import { composeBeat } from "../src/malbolge.mjs";
import { composeBass } from "../src/brainfuck.mjs";
import { composeHarmony } from "../src/befunge.mjs";
import { composeChimes } from "../src/fractran.mjs";
import { composeChant } from "../src/shakespeare.mjs";
import { buildTonnetzSpine, conductEnsemble, installRulebooks, passSpine } from "../src/conductor.mjs";
import { compileRulebooks } from "../src/inform.mjs";
import { arrangementSectionAt, composeArrangement } from "../src/intercal.mjs";
import { emptyTake, makeSlot, songPosition, validateSong } from "../src/looper.mjs";
import { parseSession, serializeSession } from "../src/session.mjs";

const root = new URL("../", import.meta.url);

test("stepUnitSeconds calculates sample-accurate durations for 12 and 16-step metre (P8-05)", () => {
  assert.deepEqual(GRID_STEPS_OPTIONS, [12, 16]);
  assert.equal(DEFAULT_GRID_STEPS, 16);

  const bpm = 120;
  const flatRhythm = [1, 1, 1, 1];

  // 1. In 16-step mode, 16 steps always fill 4 quarter notes = 2.0 seconds at 120 BPM
  const unit16 = stepUnitSeconds(bpm, flatRhythm, false, 16);
  assert.equal(unit16, 0.125, "16th note at 120 BPM is 125 ms");
  assert.equal(unit16 * 16, 2.0, "16 steps fill exactly one 4/4 bar");

  // 2. In 12-step mode without bar lock (native parlor feel), 12 steps take 6 beats = 3.0 seconds
  const unit12Unlocked = stepUnitSeconds(bpm, flatRhythm, false, 12);
  assert.equal(unit12Unlocked, 0.25, "eighth note at 120 BPM is 250 ms");
  assert.equal(unit12Unlocked * 12, 3.0, "12 steps fill 6 beats (3/4 or 6/4)");

  // 3. In 12-step mode with bar lock, 12 steps fill 4 beats = 2.0 seconds
  const unit12Locked = stepUnitSeconds(bpm, flatRhythm, true, 12);
  assert.equal(Number((unit12Locked * 12).toFixed(6)), 2.0, "12 bar-locked steps fill one 4/4 bar");
});

test("all five esoteric bandmates compose native 16-step sequences (P8-05 Phase 2)", async () => {
  const [oracleSrc, beatSrc, bassSrc, harmonySrc, pietSrc, fracSrc, chantSrc] = await Promise.all([
    readFile(new URL("src/oracle.lol", root), "utf8"),
    readFile(new URL("src/beat.mal", root), "utf8"),
    readFile(new URL("src/bass.bf", root), "utf8"),
    readFile(new URL("src/harmony.bfg", root), "utf8"),
    readFile(new URL("src/pad.piet", root), "utf8"),
    readFile(new URL("src/chimes.frac", root), "utf8"),
    readFile(new URL("src/chant.spl", root), "utf8"),
  ]);

  const score = composeScore(oracleSrc, "clockwork monarch of the marsh");

  const beat16 = composeBeat(beatSrc, score, 0, 16);
  assert.equal(beat16.steps.length, 16, "Malbolge generates 16 drum steps");
  assert.equal(beat16.steps[0].kick, 2, "downbeat kick accent on step 0");

  const bass16 = composeBass(bassSrc, score, 0, 16);
  assert.equal(bass16.steps.length, 16, "Brainfuck generates 16 bass steps");
  assert.equal(bass16.steps[0].gate, 2, "bass downbeat accent on step 0");

  const harmony16 = composeHarmony(harmonySrc, score, 0, 16);
  assert.equal(harmony16.steps.length, 16, "Befunge generates 16 harmony voicings");
  assert.ok(harmony16.steps[0].gate >= 1, "harmony chord sounds on downbeat");

  const chimes16 = composeChimes(pietSrc, fracSrc, score, 0, 16);
  assert.equal(chimes16.steps.length, 16, "Piet/FRACTRAN generates 16 chime steps");
  assert.ok(chimes16.steps[0].gate >= 1, "chime overtone rings on downbeat");

  const chant16 = composeChant(chantSrc, score, 0, 16);
  assert.equal(chant16.steps.length, 16, "Shakespeare generates 16 dramatic chant cues");
  assert.ok(chant16.steps[0].gate >= 1, "choir sings on downbeat");
});

test("conductor and INTERCAL arrange and conduct 16-step straight grid (P8-05)", async () => {
  const [oracleSrc, intercalSrc, rulebooksSrc] = await Promise.all([
    readFile(new URL("src/oracle.lol", root), "utf8"),
    readFile(new URL("src/conductor.i", root), "utf8"),
    readFile(new URL("src/rulebooks.ni", root), "utf8"),
  ]);

  installRulebooks(compileRulebooks(rulebooksSrc));
  const score = composeScore(oracleSrc, "starlight and subterranean ferns");

  // 1. Tonnetz spine across 16 steps
  const spine16 = buildTonnetzSpine(score, 0, undefined, 16);
  assert.equal(spine16.length, 16, "16 steps in spine");
  // 4 harmonic regions of 4 steps each
  assert.equal(spine16[0], spine16[3], "steps 0..3 share region chord");
  assert.equal(spine16[4], spine16[7], "steps 4..7 share region chord");

  // 2. Pass spine across 16 steps
  const pass = passSpine(spine16, 0, 16);
  assert.equal(pass.length, 16);

  // 3. INTERCAL dynamic arrangement in 16 steps
  const arrangement16 = composeArrangement(intercalSrc, score, 16);
  assert.equal(arrangement16.channelMasks.length, 16, "16 channel masks in arrangement");
  assert.equal(arrangement16.sections.length, 4, "4 sections");
  assert.deepEqual(arrangement16.sections[0].steps, [0, 1, 2, 3], "section 0 has 4 steps");
  assert.ok(arrangement16.turnaroundStep >= 14, "turnaround is at end of 16-step bar");

  const secAt0 = arrangementSectionAt(arrangement16, 0);
  assert.equal(secAt0.section.name, "EXPOSITION GROOVE");
  assert.equal(secAt0.isTurnaround, false);

  const secAt15 = arrangementSectionAt(arrangement16, 15);
  assert.equal(secAt15.section.name, "HYPOGEAL BREAKDOWN & CADENCE");
  assert.equal(secAt15.isTurnaround, true);
});

test("looper and session models store and serialize 16-step grid (P8-05)", () => {
  const take16 = emptyTake(16);
  assert.equal(take16.length, 16);

  const slot = makeSlot(0, "swell", "creature");
  const parsed = validateSong({
    loops: [
      {
        repeats: 2,
        role: "main",
        layers: [
          Array(16).fill(slot),
        ],
      },
    ],
  });
  assert.equal(parsed.loops[0].layers[0].length, 16);

  const pos0 = songPosition(parsed, 0, 16);
  assert.equal(pos0.loopIndex, 0);
  assert.equal(pos0.step, 0);

  const pos15 = songPosition(parsed, 15, 16);
  assert.equal(pos15.step, 15);

  const pos16 = songPosition(parsed, 16, 16);
  assert.equal(pos16.loopIndex, 0);
  assert.equal(pos16.repeat, 1);
  assert.equal(pos16.step, 0);

  // Session format persistence
  const plates = {};
  for (const id of ["beat", "bass", "harmony", "chime", "chant"]) plates[id] = { mutation: 0, cellCycles: Array(16).fill(0) };
  const channels = {};
  for (const id of ["lead", "fun", "beat", "bass", "harmony", "chime", "chant", "fungal"]) channels[id] = { fader: 80, pan: 0, muted: false, soloed: false };

  const sessionData = {
    format: "whimsy-session",
    version: 7,
    engineVersion: 1,
    phrase: "moth in an antique telescope",
    tempo: 124,
    volume: 85,
    genre: "victorian_tonnetz",
    strictness: 8,
    varied: true,
    rootOverride: null,
    scaleOverride: null,
    referencePitch: 440,
    barLock: true,
    gridSteps: 16,
    acoustics: { enabled: true, level: 55, crackle: true, reverb: true, ticks: true },
    funMachine: { style: "swell", voice: "velvet_pad" },
    plates: Object.freeze(plates),
    mixer: Object.freeze(channels),
    song: parsed,
  };

  const serialized = serializeSession(sessionData);
  const reParsed = parseSession(serialized);
  assert.equal(reParsed.gridSteps, 16, "reloaded session preserves 16-step grid");
});
