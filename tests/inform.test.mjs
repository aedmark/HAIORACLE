import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import { composeHarmony } from "../src/befunge.mjs";
import { composeBass } from "../src/brainfuck.mjs";
import {
  PITCH_NAMES,
  buildFunChord,
  buildFunProgression,
  buildGenreSpine,
  conductEnsemble,
  projectConsonantPitch,
} from "../src/conductor.mjs";
import { composeChimes } from "../src/fractran.mjs";
import { STRICTNESS_RANGE, InformError, compileRulebooks, followRulebook, propertyOf, readStory } from "../src/inform.mjs";
import { composeBeat } from "../src/malbolge.mjs";
import { melodyFor } from "../src/music.mjs";
import { composeScore } from "../src/score.mjs";
import { composeChant } from "../src/shakespeare.mjs";
import { GENRES } from "./install-rulebooks.mjs";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");
const [rulebookSource, oracle, beatSource, bassSource, harmonySource, pietSource, fractranSource, chantSource] = await Promise.all([
  read("src/rulebooks.ni"), read("src/oracle.lol"), read("src/beat.mal"), read("src/bass.bf"),
  read("src/harmony.bfg"), read("src/pad.piet"), read("src/chimes.frac"), read("src/chant.spl"),
]);
const books = compileRulebooks(rulebookSource);
const PHRASES = ["three pigeons in a borrowed coat", "the moon owes me five dollars", "hai oracle", "marmalade", "tax season ghosts", "a"];
const scores = PHRASES.map((phrase) => composeScore(oracle, phrase));

// ---------------------------------------------------------------------------
// The subset.

const KIT = `"Test Kit" by Tester

A gadget is a kind of thing.
Colour is a kind of value. The colours are red, green and blue.
A gadget has some text called the label. A gadget has a number called the size. A gadget has a colour.
A gadget has a list of colours called the palette. A gadget has a table name called the manual.
A gadget can be quiet or loud. A gadget is usually loud.
The dial is a number that varies.
The tint rules are a gadget based rulebook producing a colour.

Widget is a quiet gadget. The label of Widget is "W [root]". The size of Widget is 3. The palette of Widget is {blue, red}.
Gizmo is a gadget. The manual of Gizmo is the Table of Gizmo Facts.

Tint rule for Widget when the dial is at most 2 and the dial is not 1: rule succeeds with result red.
Tint rule for Widget when the dial is listed in {1, 5}: rule succeeds with result green.
Tint rule for Widget when the dial is at least 4: rule succeeds with result blue.
Tint rule for Widget: rule succeeds with result green.

Table of Gizmo Facts
part	weight	shades
"cog"	2	{red}
"lever"	--	{green, blue}

Table of Gizmo Facts (continued)
part	weight	shades
"spring"	7	{}
`;

test("the subset reads kinds, values, properties, defaults, adjectives, globals, and tables", () => {
  const story = readStory(KIT);
  assert.equal(story.title, "Test Kit");
  assert.equal(story.author, "Tester");
  const widget = story.objects.get("widget");
  const gizmo = story.objects.get("gizmo");
  assert.equal(propertyOf(widget, "label"), "W [root]", "substitutions inside quotes are kept");
  assert.equal(propertyOf(widget, "size"), 3);
  assert.deepEqual(propertyOf(widget, "palette"), ["blue", "red"]);
  assert.equal(propertyOf(widget, "colour"), "red", "an unset value property defaults to its kind's first value");
  assert.equal(propertyOf(gizmo, "size"), 0);
  assert.equal(propertyOf(gizmo, "label"), "");
  assert.deepEqual(propertyOf(gizmo, "manual"), { table: "Table of Gizmo Facts" });
  assert.equal(widget.adjectives.get("quiet"), "quiet");
  assert.equal(gizmo.adjectives.get("quiet"), undefined, "unset adjectives fall back to the usual one");
  const table = story.tables.get("table of gizmo facts");
  assert.deepEqual(table.rows, [
    { part: "cog", weight: 2, shades: ["red"] },
    { part: "lever", weight: null, shades: ["green", "blue"] },
    { part: "spring", weight: 7, shades: [] },
  ]);
});

test("rulebooks follow source order, first match wins, over at most, at least, listed in, not, and and", () => {
  const story = readStory(KIT);
  const widget = story.objects.get("widget");
  const tint = (dial) => followRulebook(story, "tint", widget, { dial });
  assert.deepEqual([0, 1, 2, 3, 4, 5, 6].map(tint), ["red", "green", "red", "green", "blue", "green", "blue"]);
  assert.equal(followRulebook(story, "tint", story.objects.get("gizmo"), { dial: 0 }), undefined, "no rule for Gizmo");
  assert.throws(() => followRulebook(story, "tint", widget, {}), /did not set "dial"/);
});

test("anything outside the subset is rejected with its line number", () => {
  const rejects = (source, line, pattern) => assert.throws(() => readStory(source), (error) => {
    assert.ok(error instanceof InformError, error.message);
    assert.equal(error.line, line, error.message);
    assert.match(error.message, pattern);
    return true;
  });
  rejects("A gadget is a kind of thing.\nInstead of taking a gadget: say \"No.\".", 2, /phrases, actions, or the world model/);
  rejects("A gadget is a kind of thing.\n\nThe gadget glows brightly.", 3, /can't find a verb/);
  rejects("A gadget is a kind of thing.\n[an endless\ncomment", 2, /never closed with '\]'/);
  rejects('A gadget is a kind of thing.\nWidget is a gadget. The label of Widget is "open.', 2, /quoted text is never closed/);
  rejects("A gadget is a kind of thing.\nWidget is a gadget", 2, /never ends with a full stop/);
  rejects(`${KIT}\nTint rule for Widget: rule succeeds with result purple.`, 28, /"purple" is not a colour/i);
  rejects(`${KIT}\nTint rule for Widget: say "hello".`, 28, /rule succeeds with result/);
  rejects(`${KIT}\nGlow rule for Widget: rule succeeds with result red.`, 28, /no rulebook called "Glow"/);
  rejects(`${KIT}\nThe manual of Widget is the Table of Nothing.`, 28, /no table called "Table of Nothing"/);
  rejects(`${KIT}\nTable of Mixed\nthing\n1\n"two"\n`, 31, /mixes number and text/);
  rejects(`${KIT}\nThe size of Widget is 4.`, 28, /already set/);
  rejects(`${KIT}\nWidget is sparkly.`, 28, /cannot be sparkly/);
  rejects("Colour is a kind of value.\nThe colours are red and red.", 2, /already means something else/);
});

test("the canonical rulebooks compile deterministically into frozen data", () => {
  assert.deepEqual(compileRulebooks(rulebookSource), books);
  assert.ok(Object.isFrozen(books) && Object.isFrozen(books.genres[0]) && Object.isFrozen(books.genres[0].colouring));
  assert.equal(books.title, "The Kapellmeister's Rulebooks");
  assert.deepEqual(STRICTNESS_RANGE, [1, 14]);
});

test("compile validation names the genre and what is wrong", () => {
  const broken = (from, to, pattern) => assert.throws(() => compileRulebooks(rulebookSource.replace(from, to)), pattern);
  broken("Colouring rule for Delta Blues: rule succeeds with result dom7.", "", /Delta Blues: no colouring rule decides interval 0/);
  broken('The code of Mystic Drone is "modal_drone"', 'The code of Mystic Drone is "smoky_jazz"', /code "smoky_jazz" is already used by Smoky Parlor Jazz/);
  broken("{0, 4, 10, 0, 7, 3, 0, 5, 0, 0, 7, 11}", "{0, 4, 10}", /Smoky Parlor Jazz: a bass walk needs twelve pitch classes/);
  broken('12	7	dom7	"V7 (Turn)"	{0, 4, 7, 10}\n', "", /Delta Blues changes: Table of Delta Blues Changes needs 12 rows, found 11/);
  broken('"[root]°"', '"[name]°"', /may only substitute \[root\]/);
  broken('"16/9"', '"16:9"', /"16:9" is not a ratio/);
  broken("Melody tone rule for Delta Blues: rule succeeds with result {0, 3, 5, 6, 7, 10}.", "", /no melody tone rule gives pitch classes at strictness 6/);
});

// ---------------------------------------------------------------------------
// The conductor honours the compiled data. Since P5-23 phase 3 it reads this
// data directly; these tests pin down how each method is applied, while
// tests/rulebooks.test.mjs pins down the resulting music.

const snap = (pc, candidates) => {
  let best = candidates[0];
  let min = 999;
  for (const c of candidates) {
    const diff = Math.min(Math.abs(pc - c), 12 - Math.abs(pc - c));
    if (diff < min) {
      min = diff;
      best = c;
    }
  }
  return best;
};

test("genre codes, flags, and menu order are as the rulebooks state", () => {
  assert.deepEqual(books.genres.map((genre) => genre.code), GENRES);
  assert.deepEqual(GENRES, ["victorian_tonnetz", "blues_twelve_bar", "smoky_jazz", "renaissance_counterpoint", "modal_drone", "parlor_ragtime", "raw_chaos"]);
  assert.deepEqual(books.genres.filter((g) => g.unfettered).map((g) => g.code), ["raw_chaos"]);
  assert.deepEqual(books.genres.filter((g) => g.insistent).map((g) => g.code), ["blues_twelve_bar", "smoky_jazz", "modal_drone", "parlor_ragtime"]);
});

test("colouring and progression rules match the Fun Machine's chord colours and progressions", () => {
  for (const genre of books.genres) {
    for (const key of PITCH_NAMES.keys()) {
      for (const tonic of [0, 7]) {
        const interval = (key - tonic + 12) % 12;
        assert.equal(genre.colouring[interval], buildFunChord(key, "auto", genre.code, tonic).quality, `${genre.code} colour ${key}/${tonic}`);
        const expected = buildFunProgression(key, "auto", genre.code, tonic);
        const rows = books.progressions[genre.progressionByInterval[interval]];
        assert.deepEqual(rows.map((row) => [(key + row.degree) % 12, row.quality]), expected.chords.map((c) => [c.rootPc, c.quality]), `${genre.code} progression ${key}/${tonic}`);
        assert.equal(rows.map((row) => row.shown.replace("[root]", PITCH_NAMES[(key + row.degree) % 12])).join(" → "), expected.summary);
        assert.deepEqual(expected.steps.map((step) => step.melodyPitch), rows.flatMap((row) => row.melody.map((offset) => key + offset)));
      }
    }
  }
  for (const [quality, id] of Object.entries(books.qualityProgressions)) {
    const expected = buildFunProgression(4, quality, "victorian_tonnetz", 0);
    assert.deepEqual(books.progressions[id].map((row) => [(4 + row.degree) % 12, row.quality]), expected.chords.map((c) => [c.rootPc, c.quality]), quality);
  }
});

test("changes tables and Tonnetz walks match the genre spines", () => {
  for (const genre of books.genres) {
    scores.forEach((score) => {
      for (let mutation = 0; mutation < 8; mutation += 1) {
        const spine = buildGenreSpine(genre.code, score, mutation);
        if (genre.spine.method === "table") {
          assert.deepEqual(spine.map((c) => [c.root, c.quality, c.op, [...c.pitchClasses]]), genre.spine.steps.map((s) => [s.degree, s.quality, s.label, s.tones.map((t) => (s.degree + t) % 12)]), genre.code);
        } else if (genre.spine.method === "tonnetz") {
          const walk = genre.spine.walks[(score.harmonyMode + score.scale + mutation) % genre.spine.walks.length];
          assert.deepEqual([3, 6, 9].map((step) => spine[step].op), walk);
        } else {
          assert.ok(spine.every((c) => c.quality === "raw"));
        }
      }
    });
  }
});

test("melody methods reproduce the conductor's melody projection", () => {
  for (const genre of books.genres) {
    const chords = new Map();
    scores.forEach((score) => buildGenreSpine(genre.code, score, 0).forEach((c) => chords.set(c.op + c.quality + c.root, c)));
    for (const chord of chords.values()) {
      for (let strictness = STRICTNESS_RANGE[0]; strictness <= STRICTNESS_RANGE[1]; strictness += 1) {
        for (let pitch = -12; pitch < 36; pitch += 1) {
          const actual = projectConsonantPitch(pitch, chord, true, strictness, genre.code);
          const octave = Math.floor(pitch / 12) * 12;
          const pc = ((pitch % 12) + 12) % 12;
          const { melody } = genre;
          // Every method then resolves an avoid note (a semitone above a chord
          // tone it is not part of) down onto that tone (D-043).
          const resolved = (value) => {
            const vpc = ((value % 12) + 12) % 12;
            const below = (vpc + 11) % 12;
            return !chord.pitchClasses.includes(vpc) && chord.pitchClasses.includes(below) ? value - 1 : value;
          };
          if (melody.method === "scale") assert.equal(actual, resolved(octave + snap(pc, melody.tonesByStrictness[strictness].map((t) => (chord.root + t) % 12))));
          else if (melody.method === "members") assert.equal(actual, resolved(octave + snap(pc, [...melody.members.map((m) => chord[m]), ...melody.extensions.map((t) => (chord.root + t) % 12)])));
          else if (melody.method === "chord") assert.equal(actual, resolved(octave + snap(pc, chord.pitchClasses)));
          else if (melody.method === "unfettered") assert.equal(actual, pitch);
          if (melody.method !== "unfettered") {
            const apc = ((actual % 12) + 12) % 12;
            assert.ok(chord.pitchClasses.includes(apc) || !chord.pitchClasses.includes((apc + 11) % 12), `${genre.code} sings no avoid note`);
          }
        }
      }
    }
  }
  assert.deepEqual(books.genres.filter((g) => g.melody.method === "euler").map((g) => g.code), ["victorian_tonnetz", "renaissance_counterpoint"]);
});

test("bass walks, organ voicings, and overtones match the conducted ensemble", () => {
  const chordMember = (chord, member) => (member === "octave" ? chord.root + 12 : chord[member]);
  scores.forEach((score) => {
    const parts = {
      score,
      melody: melodyFor(score),
      beat: composeBeat(beatSource, score, 0),
      bass: composeBass(bassSource, score, 0),
      harmony: composeHarmony(harmonySource, score, 0),
      chimes: composeChimes(pietSource, fractranSource, score, 0),
      chant: composeChant(chantSource, score, 0),
    };
    for (const genre of books.genres.filter((g) => !g.unfettered)) {
      const conducted = conductEnsemble({ ...parts, genre: genre.code });
      conducted.spine.forEach((chord, step) => {
        if (genre.bass.method === "walk") {
          // The walk lands on the chord's own third, fifth, or seventh when its
          // written interval is not in the chord; passing tones play as written (D-043).
          const interval = genre.bass.walk[step];
          const written = (chord.root + interval) % 12;
          const inChord = chord.pitchClasses.includes(written);
          const member = interval === 3 || interval === 4 ? chord.third
            : interval >= 6 && interval <= 8 ? chord.fifth
            : (interval === 10 || interval === 11) && chord.pitchClasses.includes(chord.seventh) ? chord.seventh
            : written;
          assert.equal(conducted.bass.steps[step].interval, inChord ? written : member, `${genre.code} bass ${step}`);
        }
        if (genre.organ.method === "voiced") {
          assert.deepEqual([...conducted.harmony.steps[step].chord].sort((a, b) => a - b), genre.organ.members.map((m) => chordMember(chord, m)).sort((a, b) => a - b), `${genre.code} organ ${step}`);
        }
        // Chimes ring only overtones on the chord, a ninth chord's 9th, or the
        // genre's own colour tones (D-043).
        const raw = parts.chimes.steps[step];
        const allowed = new Set([...chord.pitchClasses.map((pc) => (pc - chord.root + 12) % 12), ...(["maj9", "min9"].includes(chord.quality) ? [2] : []), ...(genre.melody.extensions ?? []).map((t) => t % 12)]);
        const fits = genre.overtones.filter((o) => allowed.has(((Math.round(12 * Math.log2(o.value)) % 12) + 12) % 12));
        const pool = fits.length ? fits : [{ ratio: "1/1", value: 1 }];
        const overtone = pool[(raw.hueIndex + raw.exponents.e2 + raw.exponents.e3 + step) % pool.length];
        assert.equal(conducted.chimes.steps[step].ratioLabel, overtone.ratio, `${genre.code} chime ${step}`);
        assert.equal(conducted.chimes.steps[step].ratioValue, Number((overtone.value * 2 ** (chord.root / 12)).toFixed(4)));
      });
    }
  });
});

test("Parlor Ragtime marches a Joplin strain home: changes, colours, Fun Machine rag, and the stride bass", () => {
  const rag = books.byCode.parlor_ragtime;
  assert.equal(rag.title, "PARLOR RAGTIME & CAKEWALK STRAINS");
  assert.deepEqual(rag.spine.steps.map((step) => step.label), ["I", "I", "I7", "IV", "IV", "♯iv°", "I", "I", "VI7", "II7", "V7", "V7"]);
  assert.deepEqual([0, 5, 7, 9, 2, 6].map((key) => buildFunChord(key, "auto", "parlor_ragtime", 0).quality), ["major", "major", "dom7", "dom7", "dom7", "dim"]);
  assert.equal(buildFunProgression(0, "auto", "parlor_ragtime", 0).summary, "C Maj → C7 → F Maj → G7");
  const spine = buildGenreSpine("parlor_ragtime", scores[0]);
  // The stride bass alternates root and fifth, then climbs A, B over the V7 back to C.
  assert.deepEqual(spine.map((chord, step) => (chord.root + rag.bass.walk[step]) % 12), [0, 7, 0, 0, 5, 1, 0, 7, 9, 9, 9, 11]);
  assert.deepEqual(rag.organ.members, ["third", "fifth", "octave"], "the organ answers the bass with the pah");
  assert.ok(rag.overtones.some((overtone) => overtone.ratio === "5/3"), "the sixth rings in the chimes");
});
