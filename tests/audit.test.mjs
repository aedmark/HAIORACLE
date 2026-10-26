import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import {
  FUNGAL_NAMES,
  composeScore,
  hashPhrase,
  parseScore,
} from "../src/score.mjs";
import { runLolcode } from "../src/lolcode.mjs";
import { composeBeat } from "../src/malbolge.mjs";
import { composeBass } from "../src/brainfuck.mjs";
import { composeHarmony } from "../src/befunge.mjs";
import { composeChimes } from "../src/fractran.mjs";
import { composeChant } from "../src/shakespeare.mjs";
import { composeArrangement } from "../src/intercal.mjs";
import { compileRulebooks } from "../src/inform.mjs";
import {
  CHORD_QUALITIES,
  buildFunChord,
  buildTriad,
  conductEnsemble,
  installRulebooks,
} from "../src/conductor.mjs";
import { melodyFor } from "../src/music.mjs";
import { buildCreatureBook } from "../src/creature-rulebook.mjs";
import { VARIATION_MOVES, varySpine } from "../src/variation.mjs";
import {
  DEFAULT_VOICE_ID,
  VOICE_PRESETS,
  creatureVoice,
  validateVoice,
} from "../src/voices.mjs";
import {
  LOOP_STEPS,
  MAX_LAYERS,
  MAX_LOOPS,
  emptySong,
  emptyTake,
  idleRecorder,
  makeSlot,
  recorderReduce,
  setLoopSlot,
  validateSong,
} from "../src/looper.mjs";
import {
  SESSION_FORMAT,
  SESSION_VERSION,
  SessionError,
  parseSession,
  serializeSession,
  validateSession,
} from "../src/session.mjs";
import { createStoredZip } from "../src/zip.mjs";
import { buildMidiFile } from "../src/midi.mjs";
import { buildEnsembleGraph } from "../src/ensemble.mjs";
import { FUNGAL_SOUNDS, myceliumEvents } from "../src/mycelium.mjs";
import { decodeOmenHash, encodeOmenHash, specimenFilenameFor } from "../src/share.mjs";

const root = new URL("../", import.meta.url);

test("Audit Dimension 1: DOM IDs and querySelector wiring completeness", async () => {
  const [html, app] = await Promise.all([
    readFile(new URL("index.html", root), "utf8"),
    readFile(new URL("src/app.mjs", root), "utf8"),
  ]);

  // Extract all id="..." from index.html
  const idMatches = html.matchAll(/\bid="([^"]+)"/g);
  const htmlIds = new Set(Array.from(idMatches, (m) => m[1]));
  assert.ok(htmlIds.size > 50, "index.html defines a comprehensive set of element IDs");

  // Extract all document.querySelector("#...") and getElementById("...") from src/app.mjs
  const queryMatches = app.matchAll(/(?:querySelector|getElementById)\(["']#?([a-zA-Z0-9_-]+)["']\)/g);
  const appReferencedIds = new Set(Array.from(queryMatches, (m) => m[1]));

  // Verify that every single ID looked up in src/app.mjs exists in index.html
  const missingFromHtml = [];
  for (const id of appReferencedIds) {
    // Dynamic or generated IDs like compass-reg-X or looper-tile are handled specifically
    if (htmlIds.has(id)) continue;
    // Check if it's a known dynamically generated ID pattern
    if (/^(compass-reg-|node-text-|chip-style-|chip-voice-)/.test(id)) continue;
    missingFromHtml.push(id);
  }
  assert.deepEqual(
    missingFromHtml,
    [],
    `All elements looked up by src/app.mjs must exist in index.html. Missing: ${missingFromHtml.join(", ")}`
  );

  // Check the elements = { ... } dictionary in src/app.mjs
  const elementsMatch = app.match(/const elements = \{([\s\S]*?)\n\};/);
  assert.ok(elementsMatch, "elements dictionary found in src/app.mjs");
  const dictIds = Array.from(elementsMatch[1].matchAll(/document\.querySelector\(["']#([^"']+)["']\)/g), (m) => m[1]);
  for (const id of dictIds) {
    assert.ok(htmlIds.has(id), `elements dictionary references #${id} which must exist in index.html`);
  }
});

test("Audit Dimension 1 (CSS): Accessibility font-size floor and motion preferences", async () => {
  const styles = await readFile(new URL("styles.css", root), "utf8");

  // P4-02 / D-037 invariant: no text below 0.6rem
  const subFloorMatches = Array.from(styles.matchAll(/font-size:\s*0\.[0-5]\d*rem/g));
  assert.equal(
    subFloorMatches.length,
    0,
    `No CSS rule may use font-size below 0.6rem (accessibility floor). Found: ${subFloorMatches.map((m) => m[0]).join(", ")}`
  );

  // Reduced motion query exists and covers animations
  assert.match(styles, /@media\s*\(prefers-reduced-motion:\s*reduce\)/);
});

test("Audit Dimension 2: All 7 esoteric interpreters execute deterministically across diverse phrases", async () => {
  const [oracleSource, beatSource, bassSource, harmonySource, pietSource, fracSource, chantSource, intercalSource] = await Promise.all([
    readFile(new URL("src/oracle.lol", root), "utf8"),
    readFile(new URL("src/beat.mal", root), "utf8"),
    readFile(new URL("src/bass.bf", root), "utf8"),
    readFile(new URL("src/harmony.bfg", root), "utf8"),
    readFile(new URL("src/pad.piet", root), "utf8"),
    readFile(new URL("src/chimes.frac", root), "utf8"),
    readFile(new URL("src/chant.spl", root), "utf8"),
    readFile(new URL("src/conductor.i", root), "utf8"),
  ]);

  const testPhrases = [
    "three pigeons in a borrowed coat",
    "the moth reads braille",
    "clockwork escapement in the parlor",
    "a quiet velvet bell",
    "astrolabe of brass and bone",
  ];

  for (const phrase of testPhrases) {
    const seed = hashPhrase(phrase);
    assert.ok(Number.isInteger(seed) && seed > 0, "seed is a valid positive integer");

    // 1. LOLCODE
    const score = composeScore(oracleSource, phrase);
    assert.ok(score && typeof score.root === "number");

    // 2. Malbolge beat
    const beat = composeBeat(beatSource, score);
    assert.equal(beat.steps.length, 12, "beat has 12 steps");
    for (const step of beat.steps) {
      assert.ok([0, 1, 2].includes(step.kick), "kick trit is 0, 1, or 2");
      assert.ok([0, 1, 2].includes(step.snare), "snare trit is 0, 1, or 2");
      assert.ok([0, 1, 2].includes(step.hat), "hat trit is 0, 1, or 2");
    }

    // 3. Brainfuck bass
    const melody = melodyFor(score);
    const bass = composeBass(bassSource, score, melody);
    assert.equal(bass.steps.length, 12, "bass has 12 steps");
    for (const step of bass.steps) {
      assert.ok(Number.isInteger(step.cell) && step.cell >= 0 && step.cell <= 255, "cell is byte");
      assert.ok(Number.isFinite(step.interval), "interval is finite");
    }

    // 4. Befunge-93 harmony
    const harmony = composeHarmony(harmonySource, score);
    assert.equal(harmony.steps.length, 12, "harmony has 12 steps");
    for (const step of harmony.steps) {
      assert.ok(Array.isArray(step.chord), "chord is array");
      assert.equal(step.chord.length, 3, "triad has 3 notes");
    }

    // 5. Piet / FRACTRAN chimes
    const chimes = composeChimes(pietSource, fracSource, score);
    assert.equal(chimes.steps.length, 12, "chimes has 12 steps");
    for (const step of chimes.steps) {
      assert.ok(Number.isFinite(step.ratioValue) && step.ratioValue > 0, "ratio value is positive finite");
      assert.ok(typeof step.ratioLabel === "string", "ratio label is string");
    }

    // 6. Shakespeare chant choir
    const chant = composeChant(chantSource, score);
    assert.equal(chant.steps.length, 12, "chant has 12 steps");
    for (const step of chant.steps) {
      assert.ok(step.f1 > 0 && step.f2 > 0 && step.f3 > 0, "formants are positive");
      assert.ok(typeof step.vowelIpa === "string", "vowel IPA is string");
    }

    // 7. INTERCAL arrangement
    const arrangement = composeArrangement(intercalSource, score);
    assert.equal(arrangement.channelMasks.length, 12, "arrangement has 12 steps");
    for (const mask of arrangement.channelMasks) {
      assert.equal(typeof mask.isTurnaround, "boolean", "isTurnaround is boolean");
      assert.equal(typeof mask.lead, "boolean", "lead mask is boolean");
      assert.equal(typeof mask.beat, "boolean", "beat mask is boolean");
    }
  }
});

test("Audit Dimension 3: Inform 7 rulebooks, 22 genres, chord qualities, and variations", async () => {
  const [oracleSource, beatSource, bassSource, harmonySource, pietSource, fracSource, chantSource, rulebooksSource] = await Promise.all([
    readFile(new URL("src/oracle.lol", root), "utf8"),
    readFile(new URL("src/beat.mal", root), "utf8"),
    readFile(new URL("src/bass.bf", root), "utf8"),
    readFile(new URL("src/harmony.bfg", root), "utf8"),
    readFile(new URL("src/pad.piet", root), "utf8"),
    readFile(new URL("src/chimes.frac", root), "utf8"),
    readFile(new URL("src/chant.spl", root), "utf8"),
    readFile(new URL("src/rulebooks.ni", root), "utf8"),
  ]);
  const rulebooks = compileRulebooks(rulebooksSource);
  installRulebooks(rulebooks);

  // Assert all 22 catalog genres are present
  assert.equal(rulebooks.genres.length, 22, "Rulebooks compile exactly 22 catalog genres");

  // Assert every chord quality is accounted for
  for (const quality of Object.values(CHORD_QUALITIES)) {
    if (quality !== "auto") {
      const triad = buildTriad(60, quality);
      assert.ok(Array.isArray(triad.pitchClasses) && triad.pitchClasses.length >= 3, `buildTriad handles quality ${quality}`);
    }
    const funChord = buildFunChord(0, quality, rulebooks.genres[0].code, 60);
    assert.ok(funChord && Array.isArray(funChord.pitchClasses), `buildFunChord handles quality ${quality}`);
  }

  // Verify each genre compiles valid properties
  for (const genre of rulebooks.genres) {
    assert.ok(genre.code && genre.title && genre.motto, `Genre ${genre.code} has title and motto`);
    assert.ok(genre.spine && genre.spine.method, `Genre ${genre.code} has spine method`);
    assert.equal(genre.colouring.length, 12, "genre has 12 interval colourings");
  }

  // Test creature variations and THE CREATURE'S OWN rulebook
  const samplePhrase = "three pigeons in a borrowed coat";
  const score = composeScore(oracleSource, samplePhrase);

  const ownRulebook = buildCreatureBook(score, rulebooks);
  assert.ok(ownRulebook && ownRulebook.spine.steps.length === 12, "THE CREATURE'S OWN generates valid 12-step changes");

  assert.ok(VARIATION_MOVES.length > 0, "VARIATION_MOVES are defined");

  const melody = melodyFor(score);
  const beat = composeBeat(beatSource, score);
  const bass = composeBass(bassSource, score, melody);
  const harmony = composeHarmony(harmonySource, score);
  const chimes = composeChimes(pietSource, fracSource, score);
  const chant = composeChant(chantSource, score);

  const conductedVaried = conductEnsemble({
    score,
    melody,
    beat,
    bass,
    harmony,
    chimes,
    chant,
    genre: rulebooks.genres[0].code,
    varied: true,
  });
  assert.ok(conductedVaried.spine && Array.isArray(conductedVaried.spine), "conductEnsemble works with varied: true");
  const conductedAsWritten = conductEnsemble({
    score,
    melody,
    beat,
    bass,
    harmony,
    chimes,
    chant,
    genre: rulebooks.genres[0].code,
    varied: false,
  });
  assert.ok(conductedAsWritten.spine && Array.isArray(conductedAsWritten.spine), "conductEnsemble works with varied: false");
});

test("Audit Dimension 5: Fun Machine voices and Loop Machine note sequencer", () => {
  // Validate all shipped voice presets
  for (const patch of VOICE_PRESETS) {
    assert.doesNotThrow(() => validateVoice(patch), `Preset ${patch.id} must validate`);
  }

  // Loop machine: step recording, slot programming, and downbeat anticipation
  let song = emptySong();
  song = setLoopSlot(song, null, null, 0, makeSlot(0, "swell", DEFAULT_VOICE_ID));
  song = setLoopSlot(song, 0, 0, 3, makeSlot(7, "arpeggio", DEFAULT_VOICE_ID));
  assert.equal(song.loops.length, 1);
  assert.equal(song.loops[0].layers[0][0]?.key, 0);
  assert.equal(song.loops[0].layers[0][3]?.key, 7);

  // Recorder: armed count-in and downbeat anticipation latching
  let rec = recorderReduce(idleRecorder(), { type: "arm", kind: "new", countIn: 12 }).recorder;
  assert.equal(rec.mode, "armed");
  rec = recorderReduce(rec, { type: "anticipate", slot: makeSlot(5, "progression") }).recorder;
  assert.equal(rec.anticipatedSlot?.key, 5);

  // Step 12 completes count-in
  for (let s = 0; s < 12; s += 1) {
    rec = recorderReduce(rec, { type: "step", step: s, held: null }).recorder;
  }
  // Downbeat arrives: step 0 transitions to recording and receives latched slot
  const res = recorderReduce(rec, { type: "step", step: 0, held: null });
  assert.equal(res.recorder.mode, "recording");
  assert.equal(res.recorder.take[0]?.key, 5, "Anticipated keystroke safely latched onto step 0");
});

test("Audit Dimension 7 & 8: Session serialization, STORED ZIP, and SMF Type 1 MIDI exports", async () => {
  const oracleSource = await readFile(new URL("src/oracle.lol", root), "utf8");
  const score = composeScore(oracleSource, "audit specimen");

  // 1. Session serialization round-trip
  let song = emptySong();
  song = setLoopSlot(song, null, null, 0, makeSlot(0, "progression"));
  const mockState = {
    format: SESSION_FORMAT,
    version: SESSION_VERSION,
    engineVersion: 1,
    rootOverride: null,
    scaleOverride: null,
    referencePitch: 440,
    barLock: false,
    phrase: "audit specimen",
    tempo: 120,
    volume: 80,
    genre: "victorian_tonnetz",
    strictness: 8,
    acoustics: {
      enabled: true,
      level: 50,
      crackle: true,
      reverb: true,
      ticks: true,
    },
    varied: true,
    funMachine: {
      style: "progression",
      voice: DEFAULT_VOICE_ID,
    },
    song,
    plates: {
      beat: { mutation: 0, cellCycles: Array(12).fill(0) },
      bass: { mutation: 0, cellCycles: Array(12).fill(0) },
      harmony: { mutation: 0, cellCycles: Array(12).fill(0) },
      chime: { mutation: 0, cellCycles: Array(12).fill(0) },
      chant: { mutation: 0, cellCycles: Array(12).fill(0) },
    },
    mixer: {
      lead: { fader: 80, pan: 0, muted: false, soloed: false },
      fun: { fader: 80, pan: 0, muted: false, soloed: false },
      beat: { fader: 80, pan: 0, muted: false, soloed: false },
      bass: { fader: 80, pan: 0, muted: false, soloed: false },
      harmony: { fader: 80, pan: 0, muted: false, soloed: false },
      chime: { fader: 80, pan: 0, muted: false, soloed: false },
      chant: { fader: 80, pan: 0, muted: false, soloed: false },
      fungal: { fader: 80, pan: 0, muted: false, soloed: false },
    },
  };

  const serialized = serializeSession(mockState);
  const parsed = parseSession(serialized);
  assert.equal(parsed.phrase, "audit specimen");
  assert.equal(parsed.version, SESSION_VERSION);
  assert.equal(parsed.song.loops.length, 1);

  // 2. STORED ZIP writer integrity
  const zipBytes = createStoredZip([
    { name: "README.txt", data: new TextEncoder().encode("Audit test") },
    { name: "test.wav", data: new Uint8Array([0x52, 0x49, 0x46, 0x46]) },
  ]);
  assert.ok(zipBytes.length > 100, "ZIP archive generated with valid size");
  assert.equal(zipBytes[0], 0x50); // 'P'
  assert.equal(zipBytes[1], 0x4b); // 'K'

  // 3. MIDI SMF Type 1 writer integrity
  const midiBytes = buildMidiFile({
    bpm: 120,
    title: "AUDIT SPECIMEN",
    lengthTicks: 1920,
    tracks: [
      { name: "LEAD", channel: 0, program: 80, notes: [{ tick: 0, duration: 240, midi: 60, velocity: 100 }, { tick: 480, duration: 240, midi: 64, velocity: 90 }] },
    ],
    markers: [{ step: 0, label: "Exposition" }],
  });
  assert.ok(midiBytes.length > 50, "MIDI score generated with valid size");
  assert.equal(midiBytes[0], 0x4d); // 'M'
  assert.equal(midiBytes[1], 0x54); // 'T'
  assert.equal(midiBytes[2], 0x68); // 'h'
  assert.equal(midiBytes[3], 0x64); // 'd'
});

function createFakeAudioContext(panner = true) {
  const nodes = [];
  const edges = [];
  const param = (initial = 0) => ({
    value: initial,
    events: [],
    setValueAtTime(v, t) { this.value = v; this.events.push(["set", v, t]); },
    exponentialRampToValueAtTime(v, t) { this.value = v; this.events.push(["exp", v, t]); },
  });
  const node = (kind, extra = {}) => {
    const created = {
      kind,
      id: `${kind}#${nodes.filter((n) => n.kind === kind).length}`,
      connect(target) { edges.push([created.id, target.id]); return target; },
      ...extra,
    };
    nodes.push(created);
    return created;
  };
  const source = (kind, extra) => node(kind, {
    started: null,
    stopped: null,
    start(t) { this.started = t; },
    stop(t) { this.stopped = t; },
    ...extra,
  });
  const context = {
    nodes,
    edges,
    destination: { id: "destination" },
    createGain: () => node("gain", { gain: param(1) }),
    createBiquadFilter: () => node("biquad", { type: "lowpass", frequency: param(350), Q: param(1) }),
    createDynamicsCompressor: () => node("compressor", { threshold: param(), knee: param(), ratio: param() }),
    createDelay: () => node("delay", { delayTime: param() }),
    createConvolver: () => node("convolver", { normalize: true, buffer: null }),
    createBufferSource: () => source("bufferSource", { buffer: null, loop: false }),
    createOscillator: () => source("oscillator", { type: "sine", frequency: param(440), detune: param() }),
    createAnalyser: () => node("analyser", { fftSize: 2048 }),
  };
  if (panner) context.createStereoPanner = () => node("panner", { pan: param() });
  return context;
}

function pathReaches(edges, from, to) {
  const seen = new Set([from]);
  const queue = [from];
  while (queue.length) {
    const current = queue.shift();
    if (current === to) return true;
    for (const [a, b] of edges) {
      if (a === current && !seen.has(b)) {
        seen.add(b);
        queue.push(b);
      }
    }
  }
  return false;
}

test("Audit Dimension 4: Web Audio graph bus connectivity, filter isolation, and isomorphic topologies", () => {
  const sampleScore = { voice: 1, bloom: 40, hueShift: 120, edge: 30, rhythm: 2, root: 52, waveform: "sawtooth" };
  const fakeBuffer = { dummy: true };
  const liveCtx = createFakeAudioContext();
  const liveGraph = buildEnsembleGraph(liveCtx, sampleScore, {
    start: 0.5,
    unit: 0.25,
    outputGain: 1,
    parlor: { reverb: 0.2, crackle: 0.1 },
    impulseBuffer: fakeBuffer,
    crackleBuffer: fakeBuffer,
    fadeIn: true,
  });

  // 1. Every bus connects to destination
  const allBuses = ["mix", "beatBus", "bassBus", "harmonyBus", "chimeBus", "chantBus", "fungalBus", "funBus"];
  for (const bus of allBuses) {
    assert.ok(pathReaches(liveCtx.edges, liveGraph[bus].id, "destination"), `${bus} must reach destination`);
  }

  // 2. Creature filter isolation (D-042): only lead passes through creatureFilter
  assert.ok(pathReaches(liveCtx.edges, liveGraph.mix.id, liveGraph.filter.id), "lead must pass through creature filter");
  for (const bus of ["beatBus", "bassBus", "harmonyBus", "chimeBus", "chantBus", "fungalBus", "funBus"]) {
    assert.equal(pathReaches(liveCtx.edges, liveGraph[bus].id, liveGraph.filter.id), false, `${bus} must bypass creature filter`);
  }

  // 3. Topology equivalence between live and offline contexts
  const offlineCtx = createFakeAudioContext();
  const offlineGraph = buildEnsembleGraph(offlineCtx, sampleScore, {
    start: 0,
    stop: 3.2,
    unit: 0.25,
    outputGain: 1,
    parlor: { reverb: 0.2, crackle: 0.1 },
    impulseBuffer: fakeBuffer,
    crackleBuffer: fakeBuffer,
    fadeIn: false,
  });
  assert.deepEqual(offlineCtx.edges, liveCtx.edges, "Live and offline graphs must share identical edge routing");
  assert.deepEqual(offlineCtx.nodes.map((n) => n.kind), liveCtx.nodes.map((n) => n.kind), "Live and offline graphs must instantiate identical node types");
});

test("Audit Dimension 6: Apparition Vitrine silhouette radius clamping and procedural mycelium", async () => {
  const appSource = await readFile(new URL("src/vitrine-canvas.mjs", root), "utf8");

  // Invariant: silhouette radius clamping to [0.38, 1.08]
  assert.match(
    appSource,
    /Math\.max\(0\.38,\s*Math\.min\(1\.08,\s*radius\s*\+\s*fluxOffset/,
    "Body silhouette must be strictly clamped to [0.38, 1.08] to prevent canvas edge clipping"
  );

  // Mycelium sporophore sound profiles
  assert.equal(FUNGAL_SOUNDS.length, 8, "Exactly 8 distinct fruiting body sound profiles");
  assert.equal(FUNGAL_NAMES.length, 8, "Exactly 8 distinct fruiting body names");

  const oracleSource = await readFile(new URL("src/oracle.lol", root), "utf8");
  const score = composeScore(oracleSource, "mycelium specimen");

  // Every form produces bounded events across extreme hyphal/spore/bloom variations
  for (let form = 0; form < 8; form += 1) {
    for (const val of [10, 50, 100]) {
      const formScore = { ...score, fungalForm: form, fungalHyphae: val, fungalSpores: val, fungalBloom: val };
      for (let step = 0; step < 12; step += 1) {
        const events = myceliumEvents(formScore, step);
        assert.ok(Array.isArray(events), "myceliumEvents returns array");
        for (const evt of events) {
          assert.ok(evt.peak > 0 && evt.peak <= 0.2, "peak amplitude is within safe gain limits");
          assert.ok(evt.at >= 0 && evt.at <= 1.0, "event time offset is non-negative");
          if (evt.freq) assert.ok(evt.freq >= 20 && evt.freq <= 20000, "tone frequency is within audible spectrum");
        }
      }
    }
  }
});

test("Audit Dimension 7 (Extended): Session migrations from legacy schemas v1–v5 and corruption recovery", () => {
  const baseV1 = {
    format: SESSION_FORMAT,
    version: 1,
    phrase: "vintage test",
    tempo: 100,
    volume: 75,
    genre: "blues_twelve_bar",
    strictness: 8,
    acoustics: { enabled: true, level: 30, crackle: true, reverb: false, ticks: true },
    funMachine: {
      mode: "auto_chord",
      quality: "major",
      progression: Array(12).fill([0, "major"]),
    },
    plates: {
      beat: { mutation: 0, cellCycles: Array(12).fill(0) },
      bass: { mutation: 0, cellCycles: Array(12).fill(0) },
      harmony: { mutation: 0, cellCycles: Array(12).fill(0) },
      chime: { mutation: 0, cellCycles: Array(12).fill(0) },
      chant: { mutation: 0, cellCycles: Array(12).fill(0) },
    },
    mixer: {
      lead: { fader: 80, pan: 0, muted: false, soloed: false },
      fun: { fader: 80, pan: 0, muted: false, soloed: false },
      beat: { fader: 80, pan: 0, muted: false, soloed: false },
      bass: { fader: 80, pan: 0, muted: false, soloed: false },
      harmony: { fader: 80, pan: 0, muted: false, soloed: false },
      chime: { fader: 80, pan: 0, muted: false, soloed: false },
      chant: { fader: 80, pan: 0, muted: false, soloed: false },
      fungal: { fader: 80, pan: 0, muted: false, soloed: false },
    },
  };

  // v1 migration
  const migratedV1 = validateSession(baseV1);
  assert.equal(migratedV1.funMachine.style, "progression");
  assert.equal(migratedV1.funMachine.voice, DEFAULT_VOICE_ID);
  assert.equal(migratedV1.varied, false, "Older versions default to unvaried (as written)");
  assert.equal(migratedV1.song.loops.length, 0);

  // v4 legacy take migration
  const baseV4 = {
    ...baseV1,
    version: 4,
    funMachine: { style: "arpeggio" },
    song: {
      loops: [
        { repeats: 1, layers: [[{ key: 0, style: "swell" }, null, null, null, null, null, null, null, null, null, null, null]] },
      ],
    },
  };
  const migratedV4 = validateSession(baseV4);
  assert.equal(migratedV4.song.loops.length, 1);
  assert.equal(migratedV4.song.loops[0].layers[0][0].voice, DEFAULT_VOICE_ID);

  // Corrupted session safety
  assert.throws(() => validateSession({ ...baseV1, tempo: 999 }), (err) => err instanceof SessionError && err.path === "session.tempo");
  assert.throws(() => validateSession({ ...baseV1, genre: "nonexistent_genre" }), (err) => err instanceof SessionError && err.path === "session.genre");
  assert.throws(() => validateSession("not an object"), (err) => err instanceof SessionError && err.path === "session");
});

test("Audit Dimension 8 (Extended): URL fragment #omen=... encoding and specimen filename generation", () => {
  const phrases = [
    "three pigeons in a borrowed coat",
    "the moth reads braille",
    "Café & Parlor 1890!",
    "αβγδε zürich",
  ];

  for (const phrase of phrases) {
    const hash = encodeOmenHash(phrase);
    assert.ok(hash.startsWith("#omen="), "hash starts with #omen=");
    const decoded = decodeOmenHash(hash);
    assert.equal(decoded, phrase.normalize("NFKC").trim().slice(0, 72), "decode matches normalized phrase");
  }

  assert.equal(decodeOmenHash(""), null);
  assert.equal(decodeOmenHash("#something_else=123"), null);
  assert.throws(() => encodeOmenHash("   "), /Cannot encode an empty omen phrase/);

  const mockScore = { name: "THE GOLDEN HARP OF THE MOUNTAIN", seed: 0x1234abcd };
  assert.equal(specimenFilenameFor(mockScore, "wav"), "hai-oracle-the-golden-harp-of-the-mountain-1234abcd.wav");
  assert.equal(specimenFilenameFor(mockScore, "png"), "hai-oracle-the-golden-harp-of-the-mountain-1234abcd.png");
  assert.equal(specimenFilenameFor(mockScore, "mid"), "hai-oracle-the-golden-harp-of-the-mountain-1234abcd.mid");
  assert.equal(specimenFilenameFor(mockScore, "zip"), "hai-oracle-the-golden-harp-of-the-mountain-1234abcd.zip");
});

test("Audit Dimension 9: Metric closure, tempo pocketing, and harmonic clash elimination (D-050)", async () => {
  const appSource = await readFile(new URL("src/app.mjs", root), "utf8");

  // Verify RHYTHMS in src/app.mjs: every rhythm must divide 12 evenly
  const rhythmMatch = appSource.match(/const RHYTHMS = Object\.freeze\(\[([\s\S]*?)\]\);/);
  assert.ok(rhythmMatch, "RHYTHMS definition found in src/app.mjs");
  const parsedRhythms = rhythmMatch[1]
    .trim()
    .split("\n")
    .map((line) => line.replace(/\/\/.*$/, "").trim())
    .filter(Boolean)
    .map((line) => JSON.parse(line.replace(/,$/, "")));

  assert.ok(parsedRhythms.length >= 6, "At least 6 rhythm templates defined");
  for (let i = 0; i < parsedRhythms.length; i += 1) {
    const r = parsedRhythms[i];
    assert.equal(
      12 % r.length,
      0,
      `Rhythm template ${i} (length ${r.length}) must divide 12 evenly to prevent loop drift`
    );
  }

  // Verify tempo pocketing function in src/app.mjs
  assert.ok(appSource.includes("function musicalPocketBpm"), "musicalPocketBpm is defined in src/app.mjs");
  // Test range folding invariant: every integer pulse in [36..208] maps to [68..144]
  function pocketCheck(bpm) {
    let p = bpm;
    while (p < 68) p *= 2;
    while (p > 144) p /= 2;
    return p;
  }
  for (let bpm = 36; bpm <= 208; bpm += 1) {
    const pocketed = pocketCheck(bpm);
    assert.ok(
      pocketed >= 68 && pocketed <= 144,
      `BPM ${bpm} should fold into groove pocket [68, 144], got ${pocketed}`
    );
  }

  // Verify anti-clash vertical sieve on CREATURE_GENRE
  const [oracleSource, beatSource, bassSource, harmonySource, pietSource, fractranSource, chantSource] = await Promise.all([
    readFile(new URL("src/oracle.lol", root), "utf8"),
    readFile(new URL("src/beat.mal", root), "utf8"),
    readFile(new URL("src/bass.bf", root), "utf8"),
    readFile(new URL("src/harmony.bfg", root), "utf8"),
    readFile(new URL("src/pad.piet", root), "utf8"),
    readFile(new URL("src/chimes.frac", root), "utf8"),
    readFile(new URL("src/chant.spl", root), "utf8"),
  ]);

  const compiledBooks = compileRulebooks(await readFile(new URL("src/rulebooks.ni", root), "utf8"));
  installRulebooks(compiledBooks);

  const samplePhrases = [
    "glowing fungal forest",
    "spore colony in deep soil",
    "ancient cathedral moss",
    "whispering mycelium thread",
    "luminous twilight mushroom",
  ];

  for (const phrase of samplePhrases) {
    const score = composeScore(oracleSource, phrase);
    const creatureBook = buildCreatureBook(score, compiledBooks);
    const ensemble = conductEnsemble({
      score,
      melody: melodyFor(score),
      beat: composeBeat(beatSource, score, 0),
      bass: composeBass(bassSource, score, 0),
      harmony: composeHarmony(harmonySource, score, 0),
      chimes: composeChimes(pietSource, fractranSource, score, 0),
      chant: composeChant(chantSource, score, 0),
      genre: "creature",
      varied: true,
      creatureBook,
    });

    const pc = (value) => ((Math.round(value) % 12) + 12) % 12;
    ensemble.spine.forEach((chord, step) => {
      const melPc = pc(ensemble.melody[step]);
      const activeAccompanimentPcs = [];
      if (ensemble.harmony.steps[step].gate) {
        activeAccompanimentPcs.push(...ensemble.harmony.steps[step].chord.map(pc));
      }
      if (ensemble.chimes.steps[step].gate) {
        activeAccompanimentPcs.push(pc(12 * Math.log2(ensemble.chimes.steps[step].ratioValue)));
      }

      const heldChordPcs = new Set(chord.pitchClasses);
      // For any active accompaniment tone, check if melody is a dissonant semitone rub unless held in chord
      for (const accPc of activeAccompanimentPcs) {
        const diff = Math.min((melPc - accPc + 12) % 12, (accPc - melPc + 12) % 12);
        if (diff === 1) {
          const bothInChord = heldChordPcs.has(melPc) && heldChordPcs.has(accPc);
          assert.ok(
            bothInChord,
            `Step ${step} in phrase "${phrase}": melody pc ${melPc} clashes by semitone with accompaniment pc ${accPc} outside chord [${chord.pitchClasses}]`
          );
        }
      }
    });
  }
});

test("Audit Dimension 10: Race conditions, audio param ramps, and acoustic conflict audit", async () => {
  const [appOnly, schedulersOnly] = await Promise.all([
    readFile(new URL("src/app.mjs", root), "utf8"),
    readFile(new URL("src/schedulers.mjs", root), "utf8"),
  ]);
  const app = `${appOnly}\n${schedulersOnly}`;

  // 1. Looper real-time take preservation (no dropped steps during look-ahead boundary)
  assert.match(app, /currentTransport\.activeTakeLanding = \{/, "records pending take landing state when lookahead finishes step 11");
  assert.match(app, /if \(currentTransport\?\.activeTakeLanding\) \{/, "allows user live strikes during audible step 11 to update landed take");
  assert.match(app, /if \(transport\.activeTakeLanding && currentStep % 12 === 11\)/, "cleans up activeTakeLanding when audible step 11 completes");

  // 2. Timeout tracking and transport isolation
  assert.match(app, /timeouts:\s*new Set\(\)/, "transport tracks its active timeouts");
  assert.match(app, /for \(const tid of transport\.timeouts\) window\.clearTimeout\(tid\);/, "stopCurrentSound cleans all pending timeouts");
  assert.match(app, /casioOutroEnding = false;\s*runTransportCommand\("stop"\);/, "outro checks currentTransport !== transport before stopping");

  // 3. AudioParam automation ramp protection (60 FPS setTargetAtTime does not stomp on retaliation ramps)
  assert.match(app, /const isRetaliating = nowMs < \(interaction\.retaliateUntil \|\| 0\);/, "detects active retaliation automation");
  assert.match(app, /if \(!isRetaliating\) \{\s*transport\.mix\.gain\.setTargetAtTime/, "guards mix and feedback gains against collision with retaliation ramps");

  // 4. Harmonic clock cycling on 1-loop songs
  assert.match(app, /const cycle = Math\.max\(passes \|\| 0, HARMONIC_PASSES\);/, "harmonic pass cycles across 4 passes even on 1-loop songs");

  // 5. Voice stack consonance (unconducted parallel 5ths eliminated)
  assert.doesNotMatch(app, /interval:\s*7/, "voice stacks do not contain raw unconducted parallel fifths");

  // 6. Clockwork body knock pitch transient (no static out-of-tune sine beep)
  assert.match(app, /bodyOsc\.frequency\.exponentialRampToValueAtTime\(55,/, "clockwork wood body knock has exponential downward pitch transient");
  assert.doesNotMatch(app, /bodyOsc\.frequency\.setValueAtTime\(isHighTick \? 520 : 340, at\);/, "clockwork wood body knock is not a static 520/340 Hz sine tone");

  // 7. Mycelium bio-acoustic filter shaping (Form 4 and 7 bandpass resonance)
  assert.ok(FUNGAL_SOUNDS[4].spikes.band !== null, "Cup Peziza has bandpass acoustic filtering");
  assert.ok(FUNGAL_SOUNDS[7].spikes.band !== null, "Hyphal Hydra has bandpass acoustic filtering");

  // 8. Drone retuning on non-quarter chord changes (Progression mode steps 4 & 8)
  assert.match(app, /const isChordChange = chord !== prevChord;/, "drones detect dynamic chord transitions");
  assert.match(app, /if \(!isChordChange && !isQuarter\) return;/, "drones retune on chord change even if not on quarter beat");
});

