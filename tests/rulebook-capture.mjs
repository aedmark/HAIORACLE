// Captures everything the Kapellmeister genre rulebooks decide, through the
// conductor's public functions, as plain JSON. P5-23 (D-033) moves those
// rulebooks into Inform 7; `tests/fixtures/rulebooks-golden.json` freezes this
// capture from the pre-migration JavaScript so the migration must reproduce it
// exactly. Shared by `tools/freeze_rulebooks.mjs` and `tests/rulebooks.test.mjs`.

import { readFile } from "node:fs/promises";

import { composeHarmony } from "../src/befunge.mjs";
import { composeBass } from "../src/brainfuck.mjs";
import {
  GENRE_DESCRIPTIONS,
  GENRE_NAMES,
  GENRE_RULEBOOKS,
  buildFunChord,
  buildFunProgression,
  buildGenreSpine,
  conductEnsemble,
  projectConsonantPitch,
} from "../src/conductor.mjs";
import { composeChimes } from "../src/fractran.mjs";
import { composeBeat } from "../src/malbolge.mjs";
import { melodyFor } from "../src/music.mjs";
import { composeScore } from "../src/score.mjs";
import { composeChant } from "../src/shakespeare.mjs";

export const CAPTURE_VERSION = 1;

const GENRES = Object.values(GENRE_RULEBOOKS);
const KEYS = Array.from({ length: 12 }, (_, i) => i);
// Only "auto" colouring reads the tonic, so only "auto" is swept across tonics.
const TONICS = [0, 7];
const tonicsFor = (quality) => (quality === "auto" ? TONICS : [0]);
// Every branch of buildFunChord, including an unknown quality's major fallback.
const CHORD_QUALITIES = ["auto", "major", "minor", "dom7", "maj9", "min9", "dom7alt", "dim", "modal_open", "phrygian", "lydian", "raw", "unknown"];
const PROGRESSION_QUALITIES = ["auto", "major", "minor", "dom7", "maj9", "dim", "modal_open"];
const PHRASES = [
  "three pigeons in a borrowed coat",
  "the moon owes me five dollars",
  "hai oracle",
  "marmalade",
  "tax season ghosts",
  "a",
];
const MUTATIONS = [0, 1, 2, 3];
const STRICTNESS = Array.from({ length: 12 }, (_, i) => i + 1);
const ENSEMBLE_STRICTNESS = [3, 8, 12];
const RAW_PITCHES = Array.from({ length: 48 }, (_, i) => i - 12);

const root = new URL("../", import.meta.url);
const source = (path) => readFile(new URL(path, root), "utf8");

// Chords are interned: every chord object is stored once as canonical JSON
// (sorted keys) and referenced by index everywhere else.
function chordTable() {
  const index = new Map();
  const chords = [];
  const ref = (chord) => {
    if (chord === null || chord === undefined) return null;
    const canonical = JSON.stringify(Object.fromEntries(Object.keys(chord).sort().map((key) => [key, chord[key]])));
    if (!index.has(canonical)) {
      index.set(canonical, chords.length);
      chords.push(canonical);
    }
    return index.get(canonical);
  };
  return { chords, ref };
}

const PROGRESSION_STEP_KEYS = "chord,isRegionStart,melodyNote,melodyPitch,regionIndex,stepIndex,stepLabel";

// A progression step as [melodyPitch, melodyNote, stepLabel, chord]. Its
// structural fields are checked here instead of stored, so the tuple loses
// nothing: any change to them, or a new field, fails the capture outright.
function progressionStep(ref) {
  return (step, i) => {
    const keys = Object.keys(step).sort().join(",");
    if (keys !== PROGRESSION_STEP_KEYS) throw new Error(`progression step fields changed: ${keys}`);
    if (step.stepIndex !== i || step.regionIndex !== Math.floor(i / 3) || step.isRegionStart !== (i % 3 === 0)) {
      throw new Error(`progression step ${i} structure changed`);
    }
    return [step.melodyPitch, step.melodyNote, step.stepLabel, ref(step.chord)];
  };
}

export async function captureRulebooks() {
  const [oracle, beatSource, bassSource, harmonySource, pietSource, fractranSource, chantSource] = await Promise.all([
    source("src/oracle.lol"),
    source("src/beat.mal"),
    source("src/bass.bf"),
    source("src/harmony.bfg"),
    source("src/pad.piet"),
    source("src/chimes.frac"),
    source("src/chant.spl"),
  ]);
  const { chords, ref } = chordTable();
  const scores = PHRASES.map((phrase) => composeScore(oracle, phrase));

  const genres = GENRES.map((id) => ({ id, name: GENRE_NAMES[id], description: GENRE_DESCRIPTIONS[id] }));

  // Fun Machine chord colours: "genre|quality|tonic" → chord per key.
  const colours = {};
  for (const genre of GENRES) {
    for (const quality of CHORD_QUALITIES) {
      for (const tonic of tonicsFor(quality)) {
        colours[`${genre}|${quality}|${tonic}`] = KEYS.map((key) => ref(buildFunChord(key, quality, genre, tonic)));
      }
    }
  }

  // Fun Machine progressions: chords by reference, steps without their chord copy.
  const progressions = {};
  for (const genre of GENRES) {
    for (const quality of PROGRESSION_QUALITIES) {
      for (const tonic of tonicsFor(quality)) {
        progressions[`${genre}|${quality}|${tonic}`] = KEYS.map((key) => {
          const progression = buildFunProgression(key, quality, genre, tonic);
          return {
            rootPc: progression.rootPc,
            summary: progression.summary,
            chords: progression.chords.map(ref),
            steps: progression.steps.map(progressionStep(ref)),
          };
        });
      }
    }
  }

  // Genre spines for every sample score and mutation.
  const spines = {};
  const spineChords = new Map(GENRES.map((genre) => [genre, new Map()]));
  for (const genre of GENRES) {
    scores.forEach((score, s) => {
      for (const mutation of MUTATIONS) {
        const spine = buildGenreSpine(genre, score, mutation);
        spines[`${genre}|${s}|${mutation}`] = spine.map(ref);
        for (const chord of spine) spineChords.get(genre).set(ref(chord), chord);
      }
    });
  }

  // Melody projection over every spine chord, pitch, passing flag, and strictness.
  const projection = {};
  for (const genre of GENRES) {
    for (const [chordRef, chord] of spineChords.get(genre)) {
      for (const passing of [false, true]) {
        projection[`${genre}|${chordRef}|${passing ? 1 : 0}`] = STRICTNESS.map((strictness) => (
          RAW_PITCHES.map((pitch) => projectConsonantPitch(pitch, chord, passing, strictness, genre)).join(",")
        ));
      }
    }
  }

  // The whole conducted ensemble, with and without a punched Fun Machine spine.
  const ensembles = {};
  scores.forEach((score, s) => {
    const parts = {
      score,
      melody: melodyFor(score),
      beat: composeBeat(beatSource, score, 0),
      bass: composeBass(bassSource, score, 0),
      harmony: composeHarmony(harmonySource, score, 0),
      chimes: composeChimes(pietSource, fractranSource, score, 0),
      chant: composeChant(chantSource, score, 0),
    };
    for (const genre of GENRES) {
      for (const strictness of ENSEMBLE_STRICTNESS) {
        for (const punched of [false, true]) {
          const customSpine = punched
            ? buildFunProgression((score.seed >>> 4) % 12, "auto", genre, 0).steps.map((step, i) => (i % 2 === 0 ? step.chord : null))
            : null;
          const conducted = conductEnsemble({ ...parts, mutation: s % 3, genre, consonanceStrictness: strictness, customSpine });
          ensembles[`${s}|${genre}|${strictness}|${punched ? 1 : 0}`] = {
            genre: conducted.genre,
            genreName: conducted.genreName,
            spine: conducted.spine.map(ref),
            melody: [...conducted.melody],
            bass: conducted.bass.steps.map((step) => [step.interval, step.gate, step.label]),
            harmony: conducted.harmony.steps.map((step) => [[...step.chord], step.label]),
            chimes: conducted.chimes.steps.map((step) => [step.gate, step.ratioLabel, step.ratioValue, step.label]),
            chant: conducted.chant.steps.map((step) => [step.gate, step.interval, step.label]),
          };
        }
      }
    }
  });

  return { version: CAPTURE_VERSION, phrases: PHRASES, genres, chords, colours, progressions, spines, projection, ensembles };
}

// One top-level key per line and one entry per line below it, so a failing
// migration shows a readable diff.
export function serializeCapture(capture) {
  const lines = ["{"];
  const keys = Object.keys(capture);
  keys.forEach((key, k) => {
    const value = capture[key];
    const comma = k < keys.length - 1 ? "," : "";
    if (value && typeof value === "object" && !Array.isArray(value)) {
      const entries = Object.entries(value);
      lines.push(`  ${JSON.stringify(key)}: {`);
      entries.forEach(([entryKey, entryValue], e) => {
        lines.push(`    ${JSON.stringify(entryKey)}: ${JSON.stringify(entryValue)}${e < entries.length - 1 ? "," : ""}`);
      });
      lines.push(`  }${comma}`);
    } else if (Array.isArray(value) && (value.length > 8 || typeof value[0] === "object")) {
      lines.push(`  ${JSON.stringify(key)}: [`);
      value.forEach((item, i) => lines.push(`    ${JSON.stringify(item)}${i < value.length - 1 ? "," : ""}`));
      lines.push(`  ]${comma}`);
    } else {
      lines.push(`  ${JSON.stringify(key)}: ${JSON.stringify(value)}${comma}`);
    }
  });
  lines.push("}");
  return `${lines.join("\n")}\n`;
}
