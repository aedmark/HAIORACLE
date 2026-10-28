// The Fun Machine's one-finger accompanist (D-028). Pure functions only: a held
// key becomes a "performance" (chords for the four 3-step regions plus an
// optional lead line), and these helpers voice it as a pad, ripple it as an
// arpeggio, or sing a line over it. The host schedules the sound in the band's
// own rhythm and re-conducts the band onto the performance's chords.

import {
  CREATURE_GENRE,
  buildFunChord,
  buildFunProgression,
  buildTonnetzSpine,
  buildTriad,
  genreBook,
} from "./conductor.mjs";
import { melodyFor } from "./music.mjs";
import { varySpine } from "./variation.mjs";

export const ACCOMPANIMENT_STYLES = Object.freeze(["swell", "arpeggio", "progression", "intro", "bridge", "outro"]);
export const DEFAULT_ACCOMPANIMENT_STYLE = "progression";

export const STYLE_LABELS = Object.freeze({
  swell: "SWELL",
  arpeggio: "ARPEGGIO",
  progression: "PROGRESSION",
  intro: "INTRO",
  bridge: "BRIDGE",
  outro: "OUTRO",
});

const QUALITY_TEXT = Object.freeze({
  major: "Maj",
  minor: "min",
  dom7: "7",
  maj9: "maj9",
  min9: "min9",
  dom7alt: "7alt",
  dim: "dim",
  modal_open: "5",
  phrygian: "Phryg",
  lydian: "Lyd",
  raw: "raw",
});

// Pad register: root below G3, upper voices kept between G3 and G5.
const PAD_ROOT_BASE = 48;
const UPPER_LOW = 55;
const UPPER_HIGH = 79;
const LEAD_BASE = 60;

export function chordText(chord) {
  return `${chord.name} ${QUALITY_TEXT[chord.quality] ?? chord.quality}`;
}

// Raw-chaos chords have no pitch classes; the accompanist still needs
// something to sing, so it falls back to an open fifth on the root.
// Minor-second clashes against the root ((pc - rootPc + 12) % 12 === 1), such
// as Phrygian flat-second and alt-dominant flat-ninth extensions, are omitted
// from pad voicings and sustained figures so the pad bed remains consonant.
export function soundingPitchClasses(chord) {
  const rootPc = Number.isFinite(chord?.rootPc) ? ((chord.rootPc % 12) + 12) % 12 : 0;
  const rawPcs = chord?.pitchClasses?.length ? chord.pitchClasses : [rootPc, (rootPc + 7) % 12];
  const pcs = [...new Set(rawPcs.map((pc) => ((pc % 12) + 12) % 12))];
  const filtered = pcs.filter((pc) => ((pc - rootPc + 12) % 12) !== 1);
  return filtered.length > 0 ? filtered : pcs;
}

/**
 * Builds what a held key plays. `keySemitone` is the key's position on the
 * 13-key manual (0 = the left C .. 12 = C'); its chord depends only on the
 * pitch class, but `lift` (the position itself) raises every voice so the
 * manual climbs like a keyboard and C' sounds an octave above C.
 *  - swell: one genre-coloured chord on the key, held across all four regions.
 *  - arpeggio: the same single chord, rippled in the band's rhythm.
 *  - progression: the genre's 4-chord progression from the key, with a lead line.
 * Returns `{ style, key, lift, chords[4], steps[12], summary }`, where each
 * step has `chord`, `regionIndex`, `isRegionStart`, and `leadPitch` (semitones
 * above C4, already lifted, or null when the style has no lead line).
 */
export function buildPerformance(keySemitone, style, genre, tonicRoot = 0, { pass = null, score = null, varied = false, stepsCount = 12 } = {}) {
  if (!ACCOMPANIMENT_STYLES.includes(style)) throw new RangeError(`Unknown accompaniment style: ${style}`);
  const position = Math.max(0, Math.min(12, Math.trunc(keySemitone) || 0));
  const key = position % 12;
  const lift = position;
  let chords;
  let leadPitches = Array(stepsCount).fill(null);
  let summary;
  let sectionMoves = Object.freeze([]);
  if (style === "progression") {
    const progression = buildFunProgression(key, "auto", genre, tonicRoot);
    chords = progression.chords;
    // melodyPitch climbs from the key's pitch class; C' lifts it an octave.
    leadPitches = progression.steps.map((step) => step.melodyPitch + (position - key));
    summary = chords.map(chordText).join(" → ");
  } else if (style === "intro" || style === "bridge" || style === "outro") {
    const section = buildFunSectionProgression(key, style, genre, tonicRoot, { score, varied });
    chords = section.chords;
    leadPitches = section.steps.map((step) => step.leadPitch !== null ? step.leadPitch + (position - key) : null);
    summary = section.summary;
    sectionMoves = section.variation;
  } else {
    const chord = buildFunChord(key, "auto", genre, tonicRoot);
    chords = [chord, chord, chord, chord];
    summary = `${chordText(chord)} · ${STYLE_LABELS[style]}`;
  }
  // On the harmonic clock (D-044) a progression holds one region per pass:
  // a pad struck on the downbeat (and again wherever a variation changes the
  // chord), and the region's three lead notes held four steps each.
  if (pass !== null && style === "progression") {
    const regionIndex = ((Math.trunc(pass) % 4) + 4) % 4;
    const stride = stepsCount === 16 ? 4 : 3;
    const { spine, moves } = varied && score ? varyProgression(chords, key, genre, score) : { spine: chords.flatMap((chord) => Array(stride).fill(chord)), moves: [] };
    const steps = Array.from({ length: stepsCount }, (_, index) => {
      const entry = (regionIndex * stride + Math.floor(index / 4)) % spine.length;
      const chord = spine[entry] || chords[regionIndex];
      const previous = index > 0 ? (spine[(regionIndex * stride + Math.floor((index - 1) / 4)) % spine.length] || chords[regionIndex]) : null;
      let leadPitch = index % 4 === 0 ? leadPitches[entry % leadPitches.length] : null;
      // A note written for the old chord moves to the new chord's nearest tone.
      // Minor-second clashes against the root in sustained lead notes resolve to the nearest clean tone.
      if (leadPitch !== null && (chord !== chords[regionIndex] || ((leadPitch - chord.rootPc + 12) % 12) === 1)) {
        leadPitch = nearestChordTone(leadPitch, chord);
      }
      return Object.freeze({ chord, regionIndex, isRegionStart: chord !== previous, leadPitch, leadSteps: 4 });
    });
    const shown = spine.map(chordText).filter((text, index, all) => index === 0 || text !== all[index - 1]);
    return Object.freeze({
      style, key, lift, chords: Object.freeze([...chords]), steps: Object.freeze(steps), regionSteps: stepsCount,
      summary: moves.length ? shown.join(" → ") : summary, variation: Object.freeze([...moves]),
    });
  }

  // Section loops (intro, bridge, outro) breathe across 4 passes (48 steps):
  // 1 pass (12 or 16 steps) per chord with spacious 4-step lead phrasing, pickup notes,
  // breathing rests, and natural cadential resolution into adjoining loops.
  if (pass !== null && (style === "intro" || style === "bridge" || style === "outro")) {
    const sectionPass = ((Math.trunc(pass) % 4) + 4) % 4;
    const chord = chords[sectionPass];
    const regionIndex = sectionPass;
    const baseNoteIdx = sectionPass * 3;

    const steps = Array.from({ length: stepsCount }, (_, index) => {
      const isRegionStart = index === 0;
      let leadPitch = null;
      let leadSteps = 4;

      if (style === "outro" && sectionPass === 3) {
        // Final outro pass: resolve to home tonic on step 0 and ring out across the bar
        if (index === 0) {
          leadPitch = leadPitches[9 % leadPitches.length] ?? (position - key);
          leadSteps = stepsCount;
        }
      } else if ((style === "intro" || style === "bridge") && sectionPass === 3) {
        // Final turnaround pass: steps 0 and 4 play turnaround motifs; step 8 plays the
        // pickup leading-tone into the downbeat; steps 10 & 11 rest as a breath before
        // the adjoining loop drops on the downbeat.
        if (index === 0) {
          leadPitch = leadPitches[baseNoteIdx % leadPitches.length];
        } else if (index === 4) {
          leadPitch = leadPitches[(baseNoteIdx + 1) % leadPitches.length];
        } else if (index === 8) {
          leadPitch = leadPitches[(baseNoteIdx + 2) % leadPitches.length];
          leadSteps = 2; // holds steps 8..9, leaving steps 10 & 11 to rest
        }
      } else {
        // Standard pass: 3 notes spaced evenly on steps 0, 4, 8 (4 steps each)
        if (index === 0) leadPitch = leadPitches[baseNoteIdx % leadPitches.length];
        else if (index === 4) leadPitch = leadPitches[(baseNoteIdx + 1) % leadPitches.length];
        else if (index === 8) leadPitch = leadPitches[(baseNoteIdx + 2) % leadPitches.length];
        if (leadPitch !== null && ((leadPitch - chord.rootPc + 12) % 12) === 1) {
          leadPitch = nearestChordTone(leadPitch, chord);
        }
      }

      return Object.freeze({
        chord,
        regionIndex,
        isRegionStart,
        leadPitch,
        leadSteps,
      });
    });

    return Object.freeze({
      style,
      key,
      lift,
      chords: Object.freeze([...chords]),
      steps: Object.freeze(steps),
      summary: `${summary} (Part ${sectionPass + 1}/4)`,
      regionSteps: stepsCount,
      variation: sectionMoves,
    });
  }
  const stepsPerRegion = stepsCount === 16 ? 4 : 3;
  const steps = Array.from({ length: stepsCount }, (_, index) => {
    const regionIndex = Math.floor(index / stepsPerRegion);
    return Object.freeze({
      chord: chords[regionIndex],
      regionIndex,
      isRegionStart: index % stepsPerRegion === 0,
      leadPitch: leadPitches[index % leadPitches.length],
      leadSteps: 1,
    });
  });
  return Object.freeze({
    style,
    key,
    lift,
    chords: Object.freeze([...chords]),
    steps: Object.freeze(steps),
    summary,
    regionSteps: stepsPerRegion,
    variation: sectionMoves,
  });
}

/**
 * The creature's variation on a Fun Machine progression (D-043), by the same
 * harmony fields and genre moves as the band, except rotation (the key you
 * hold always sounds first) and harmonic pace (the pad strikes on the clock).
 * Returns twelve absolute chords (three per region) and the moves made; an
 * unchanged entry is the original chord object.
 */
function varyProgression(chords, key, genre, score) {
  const relative = chords.flatMap((chord) => {
    const root = (chord.rootPc - key + 12) % 12;
    const tones = chord.pitchClasses.map((pc) => (pc - key + 12) % 12);
    const triad = buildTriad(root, chord.quality, chord.op, tones);
    return [triad, triad, triad];
  });
  const permitted = genreBook(genre).variation.filter((move) => move !== "rotation" && move !== "harmonic_pace");
  const { spine, moves } = varySpine(relative, score, permitted, buildTriad);
  const absolute = spine.map((chord, index) => (chord === relative[index]
    ? chords[Math.floor(index / 3)]
    : buildTriad((chord.root + key) % 12, chord.quality, chord.op, chord.pitchClasses.map((pc) => (pc + key) % 12))));
  return { spine: absolute, moves };
}

function nearestChordTone(pitch, chord) {
  const safePcs = soundingPitchClasses(chord);
  for (let distance = 0; distance <= 6; distance += 1) {
    for (const candidate of [pitch - distance, pitch + distance]) {
      if (safePcs.includes(((candidate % 12) + 12) % 12)) return candidate;
    }
  }
  return pitch;
}

/**
 * Builds section-specific 4-chord progressions and 12-step lead motifs from the
 * active genre's rulebook and, when `varied && score` is active, deterministically
 * shapes them using the creature's score (D-043):
 *  - intro: preparatory tonic vamp/herald and genre turnaround leading to the downbeat.
 *  - bridge: contrasting departure from tonic through the genre's interior changes.
 *  - outro: the genre's cadential progression resolving to the home tonic on region 3.
 */
export function buildFunSectionProgression(key, section, genre, tonicRoot = 0, { score = null, varied = false } = {}) {
  const r = ((Math.trunc(key) % 12) + 12) % 12;
  const book = genreBook(genre);
  const permitted = book?.variation ?? [];

  const tonicChord = buildFunChord(r, "auto", genre, tonicRoot);
  const isMinor = ["minor", "min9", "min7", "phrygian", "dim", "half_diminished"].includes(tonicChord.quality);
  const isRaw = tonicChord.quality === "raw" || Boolean(book?.unfettered);

  if (isRaw) {
    let rawRoots;
    let rawOffsets;
    let rawSummary;
    if (section === "intro") {
      rawRoots = [r, r, r, r];
      rawOffsets = [0, 7, 12, 0, 7, 14, 0, 7, 12, 7, 11, null];
      rawSummary = `${chordText(tonicChord)} (Tonic Pedal ${STYLE_LABELS[section]})`;
    } else if (section === "bridge") {
      rawRoots = [(r + 5) % 12, (r + 7) % 12, (r + 5) % 12, (r + 7) % 12];
      rawOffsets = [12, 14, 12, 7, 9, 7, 5, 7, 5, 7, 9, 11];
      rawSummary = `Drone ${STYLE_LABELS[section]} (IV → V → IV → V)`;
    } else {
      rawRoots = [(r + 7) % 12, (r + 5) % 12, r, r];
      rawOffsets = [7, 5, 4, 2, 0, 0, 0, 0, 0, 0, 0, 0];
      rawSummary = `${chordText(tonicChord)} (Drone Resolution ${STYLE_LABELS[section]})`;
    }
    const rawChords = rawRoots.map((root) => buildFunChord(root, "auto", genre, tonicRoot));
    const rawSteps = Array.from({ length: 12 }, (_, index) => {
      const regionIndex = Math.floor(index / 3);
      const offset = rawOffsets[index];
      return Object.freeze({
        chord: rawChords[regionIndex],
        regionIndex,
        isRegionStart: index % 3 === 0,
        leadPitch: offset === null ? null : (r + offset),
        leadSteps: 1,
      });
    });
    return Object.freeze({
      chords: Object.freeze(rawChords),
      steps: Object.freeze(rawSteps),
      summary: rawSummary,
      variation: Object.freeze([]),
    });
  }

  // Pull the genre's own 4-chord progression and 12-step melody offsets from src/rulebooks.ni,
  // plus its 4 spine regions (including THE CREATURE'S OWN scale-derived rulebook or Tonnetz walk).
  const prog = buildFunProgression(r, "auto", genre, tonicRoot);
  const progOffsets = prog.steps.map((step) => step.melodyPitch - r);

  let spineChords = prog.chords;
  if (book.spine?.method === "table" && book.spine.steps?.length >= 12) {
    spineChords = [0, 3, 6, 9].map((idx) => {
      const st = book.spine.steps[idx];
      return buildFunChord((r + st.degree) % 12, st.quality, genre, tonicRoot);
    });
  } else if (book.spine?.method === "tonnetz" && score) {
    const walk = buildTonnetzSpine(score, 0, book.spine.walks);
    spineChords = [0, 3, 6, 9].map((idx) => buildFunChord((r + walk[idx].root) % 12, walk[idx].quality, genre, tonicRoot));
  }

  const baseChords = (genre === CREATURE_GENRE || (book.spine?.method === "tonnetz" && score))
    ? spineChords
    : prog.chords;

  let chords;
  let melodyOffsets;

  if (section === "intro") {
    const c0 = tonicChord;
    const c1 = (baseChords[1].rootPc !== r || spineChords[1].rootPc === r) ? baseChords[1] : spineChords[1];
    const c2 = (baseChords[2].rootPc !== c1.rootPc || spineChords[2].rootPc === c1.rootPc) ? baseChords[2] : spineChords[2];
    let c3 = baseChords[3];
    if (spineChords[3].rootPc !== r && spineChords[3].rootPc !== baseChords[3].rootPc) {
      c3 = spineChords[3];
    } else if (c3.rootPc === r && tonicChord.quality !== "modal_open") {
      const turnRoot = permitted.includes("tritone_substitution") ? (r + 1) % 12 : (r + 7) % 12;
      const turnQuality = permitted.includes("tritone_substitution") ? "dom7alt" : (c3.quality === "dom7" ? "dom7" : "auto");
      c3 = buildFunChord(turnRoot, turnQuality, genre, tonicRoot);
    }
    chords = [c0, c1, c2, c3];
    melodyOffsets = [
      progOffsets[0], progOffsets[1], progOffsets[2],
      progOffsets[3], progOffsets[4], progOffsets[5],
      progOffsets[6], progOffsets[7], progOffsets[8],
      progOffsets[9], progOffsets[10], null,
    ];
  } else if (section === "bridge") {
    // Bridge always departs from the tonic on Region 0 using the genre's own interior contrast chords.
    let b0;
    if (baseChords[0].rootPc !== r) {
      b0 = baseChords[0];
    } else if (baseChords[1].rootPc !== r) {
      b0 = baseChords[1];
    } else if (baseChords[2].rootPc !== r) {
      b0 = baseChords[2];
    } else {
      b0 = buildFunChord((r + (isMinor ? 8 : 5)) % 12, tonicChord.quality === "modal_open" ? "modal_open" : "auto", genre, tonicRoot);
    }

    let b1;
    if (baseChords[2].rootPc !== r && baseChords[2].rootPc !== b0.rootPc) {
      b1 = baseChords[2];
    } else if (spineChords[2].rootPc !== r && spineChords[2].rootPc !== b0.rootPc) {
      b1 = spineChords[2];
    } else if (permitted.includes("secondary_dominants")) {
      b1 = buildFunChord((r + 2) % 12, "dom7", genre, tonicRoot);
    } else if (permitted.includes("modal_borrowing")) {
      b1 = buildFunChord((r + 8) % 12, "auto", genre, tonicRoot);
    } else {
      b1 = buildFunChord((r + (isMinor ? 3 : 2)) % 12, "auto", genre, tonicRoot);
    }

    const subRoot = (r + 5) % 12;
    let b2;
    if (b0.rootPc !== subRoot && b1.rootPc !== subRoot) {
      b2 = buildFunChord(subRoot, "auto", genre, tonicRoot);
    } else if (baseChords[1].rootPc !== r && baseChords[1].rootPc !== b1.rootPc) {
      b2 = baseChords[1];
    } else {
      b2 = buildFunChord((r + (isMinor ? 8 : 9)) % 12, "auto", genre, tonicRoot);
    }

    let b3;
    if (spineChords[3].rootPc !== r && spineChords[3].rootPc !== b2.rootPc) {
      b3 = spineChords[3];
    } else if (baseChords[3].rootPc !== r) {
      b3 = baseChords[3];
    } else {
      const turnRoot = permitted.includes("tritone_substitution") ? (r + 1) % 12 : (r + 7) % 12;
      const turnQuality = tonicChord.quality === "modal_open" ? "modal_open" : (permitted.includes("tritone_substitution") ? "dom7alt" : "dom7");
      b3 = buildFunChord(turnRoot, turnQuality, genre, tonicRoot);
    }

    chords = [b0, b1, b2, b3];
    melodyOffsets = [
      progOffsets[3], progOffsets[4], progOffsets[5],
      progOffsets[6], progOffsets[7], progOffsets[8],
      Math.min(19, progOffsets[0] + 7), Math.min(19, progOffsets[1] + 7), progOffsets[2],
      progOffsets[9], progOffsets[10], progOffsets[11],
    ];
  } else {
    // section === "outro": cadential progression resolving to home tonic on Region 3.
    if (genre === "andalusian_flamenco") {
      chords = [
        buildFunChord((r + 5) % 12, "minor", genre, tonicRoot),
        buildFunChord((r + 3) % 12, "major", genre, tonicRoot),
        buildFunChord((r + 1) % 12, "major", genre, tonicRoot),
        tonicChord,
      ];
      melodyOffsets = [5, 7, 5, 3, 5, 3, 1, 3, 1, 0, 0, 0];
    } else if (genre === "gospel_shout") {
      chords = [
        tonicChord,
        buildFunChord((r + 5) % 12, "major", genre, tonicRoot),
        buildFunChord((r + 5) % 12, "minor", genre, tonicRoot),
        tonicChord,
      ];
      melodyOffsets = [0, 4, 9, 5, 9, 12, 8, 5, 4, 0, 0, 0];
    } else {
      const o0 = baseChords[1].rootPc !== r
        ? baseChords[1]
        : (baseChords[2].rootPc !== r ? baseChords[2] : buildFunChord((r + 2) % 12, "auto", genre, tonicRoot));
      const o1 = (baseChords[2].rootPc !== r && baseChords[2].rootPc !== o0.rootPc)
        ? baseChords[2]
        : buildFunChord((r + 5) % 12, "auto", genre, tonicRoot);
      let o2;
      if (permitted.includes("phrygian_cadence")) {
        o2 = buildFunChord((r + 1) % 12, baseChords[3].quality === "phrygian" ? "phrygian" : "major", genre, tonicRoot);
      } else if (permitted.includes("plagal_cadence") && !permitted.includes("authentic_cadence") && baseChords[3].rootPc === r) {
        o2 = buildFunChord((r + 5) % 12, "auto", genre, tonicRoot);
      } else if (spineChords[3].rootPc !== r) {
        o2 = spineChords[3];
      } else if (baseChords[3].rootPc !== r) {
        o2 = baseChords[3];
      } else {
        o2 = buildFunChord((r + 7) % 12, tonicChord.quality === "modal_open" ? "modal_open" : "dom7", genre, tonicRoot);
      }
      chords = [o0, o1, o2, tonicChord];
      melodyOffsets = [
        progOffsets[3], progOffsets[4], progOffsets[5],
        progOffsets[6], progOffsets[7], progOffsets[8],
        progOffsets[9], progOffsets[10], progOffsets[11],
        0, 0, 0,
      ];
    }
  }

  // Deterministic creature variation (D-043): when `varied && score` is active,
  // apply the creature's harmonic moves and weave its LOLCODE melody contour.
  let moves = [];
  if (varied && score) {
    const variedResult = varyProgression(chords, r, genre, score);
    moves = [...variedResult.moves];
    const regionVaried = [0, 3, 6, 9].map((idx) => variedResult.spine[idx]);

    if (section === "intro") {
      // Intro always opens on the tonic chord; Regions 1..3 take the creature's variations.
      chords = [chords[0], regionVaried[1], regionVaried[2], regionVaried[3]];
      if (moves.length === 0 && (score.harmonyTurn + score.harmonySwap + score.harmonyBorrow) > 0) {
        const altDeg = [2, 5, 8, 9, 10][(score.harmonyTurn + score.harmonySwap + score.scale) % 5];
        chords[1] = buildFunChord((r + altDeg) % 12, "auto", genre, tonicRoot);
        moves.push("CREATURE INFLECTION");
      }
    } else if (section === "bridge") {
      // Bridge departs from tonic; allow creature's harmony fields to pick contrasting regions.
      chords = [
        regionVaried[0].rootPc !== r ? regionVaried[0] : chords[0],
        regionVaried[1],
        regionVaried[2],
        regionVaried[3],
      ];
      if ((score.harmonyTurn + score.harmonyMode) % 2 === 1 && chords[1].rootPc !== r) {
        chords = [chords[1], chords[0], chords[2], chords[3]];
        if (!moves.includes("BRIDGE TURN")) moves.push("BRIDGE TURN");
      }
    } else {
      // Outro always resolves to home tonic on Region 3; Regions 0..2 take the creature's variations.
      chords = [regionVaried[0], regionVaried[1], regionVaried[2], tonicChord];
      if (moves.length === 0 && (score.harmonyCadence + score.harmonySwap) > 0) {
        const cadDeg = [2, 5, 8, 10][(score.harmonyCadence + score.harmonySwap) % 4];
        chords[0] = buildFunChord((r + cadDeg) % 12, "auto", genre, tonicRoot);
        moves.push("CREATURE CADENCE");
      }
    }

    const creatureMel = melodyFor(score);
    melodyOffsets = melodyOffsets.map((baseOffset, idx) => {
      if (baseOffset === null) return null;
      if (section === "outro" && idx >= 9) return 0;
      const creatureOffset = ((creatureMel[idx] % 12) + 12) % 12;
      const octaveLift = baseOffset >= 12 ? 12 : 0;
      return (idx % 3 === 1) ? (creatureOffset + octaveLift) : baseOffset;
    });
  }

  const shown = chords.map(chordText).join(" → ");
  const sectionSummary = `${shown} (${STYLE_LABELS[section]})`;

  const steps = Array.from({ length: 12 }, (_, index) => {
    const regionIndex = Math.floor(index / 3);
    const chord = chords[regionIndex];
    const offset = melodyOffsets[index];
    let leadPitch = offset === null ? null : (r + offset);
    if (leadPitch !== null && chord && chord.quality !== "raw") {
      leadPitch = nearestChordTone(leadPitch, chord);
    }
    return Object.freeze({
      chord,
      regionIndex,
      isRegionStart: index % 3 === 0,
      leadPitch,
      leadSteps: 1,
    });
  });

  return Object.freeze({
    chords: Object.freeze(chords),
    steps: Object.freeze(steps),
    summary: sectionSummary,
    variation: Object.freeze(moves),
  });
}

/** Steps a chord struck at `stepIndex` holds before the performance strikes again. */
export function strikeLength(performance, stepIndex) {
  let length = 1;
  while (stepIndex + length < 12 && !performance.steps[stepIndex + length].isRegionStart) length += 1;
  return length;
}

/**
 * Voices a chord for the pad: the root alone in the low register, the other
 * tones spread above it. Given the previous voicing, each upper tone takes the
 * octave nearest the previous upper voices, so chord changes glide instead of
 * jumping (simple voice leading). `lift` raises the whole register by that
 * many semitones: the key's position on the manual.
 */
export function padVoicing(chord, previous = null, lift = 0) {
  const pcs = soundingPitchClasses(chord);
  const rootPc = ((chord.rootPc % 12) + 12) % 12;
  // Keep the root below the upper voices (C3..F#3, or G2..B2 for higher keys).
  const low = UPPER_LOW + lift;
  const high = UPPER_HIGH + lift;
  // The root is the highest of its pitch class below the upper window.
  let root = PAD_ROOT_BASE + rootPc;
  while (root >= low) root -= 12;
  while (root + 12 < low) root += 12;
  const previousUpper = previous ? previous.slice(1) : null;
  const upper = [];
  for (const pc of pcs) {
    const candidates = [];
    for (let midi = low; midi < high; midi += 1) if (midi % 12 === pc) candidates.push(midi);
    let choice = candidates[0];
    if (previousUpper?.length) {
      const distance = (midi) => Math.min(...previousUpper.map((p) => Math.abs(p - midi)));
      choice = candidates.reduce((best, midi) => (distance(midi) < distance(best) ? midi : best), candidates[0]);
    }
    if (!upper.includes(choice)) upper.push(choice);
  }
  upper.sort((a, b) => a - b);
  return Object.freeze([root, ...upper]);
}

/**
 * Arpeggio notes for one loop step: `subdivisions` notes walking up and back
 * down the chord an octave above the pad, continuing across steps so the
 * figure flows through the whole loop.
 */
export function arpeggioNotes(chord, stepIndex, subdivisions = 2, lift = 0) {
  const upper = padVoicing(chord, null, lift).slice(1).map((midi) => midi + 12);
  const tones = [...upper, upper[0] + 12];
  const cycle = [...tones, ...tones.slice(1, -1).reverse()];
  return Array.from({ length: subdivisions }, (_, k) => cycle[(stepIndex * subdivisions + k) % cycle.length]);
}

/**
 * Fun Machine chords name absolute pitch classes (the C key is C), but the
 * conductor reads spine chords as intervals above the creature's tonic. This
 * shifts a chord into that frame so the band lands on the same chord the pad
 * plays instead of one transposed by the tonic.
 */
export function toTonicRelative(chord, tonicMidi) {
  const tonic = ((Math.trunc(tonicMidi) % 12) + 12) % 12;
  const shift = (pc) => (Number.isInteger(pc) ? (((pc - tonic) % 12) + 12) % 12 : pc);
  return Object.freeze({
    ...chord,
    root: shift(chord.root),
    rootPc: shift(chord.rootPc),
    third: shift(chord.third),
    fifth: shift(chord.fifth),
    seventh: shift(chord.seventh),
    ninth: shift(chord.ninth),
    pitchClasses: Object.freeze((chord.pitchClasses || []).map(shift)),
  });
}

export function leadMidi(leadPitch) {
  return LEAD_BASE + leadPitch;
}

// Steps from `stepIndex` (inclusive) to the next region start, so a pad struck
// mid-region can bridge to the chord the scheduler strikes there.
export function stepsToRegionBoundary(stepIndex) {
  const index = ((stepIndex % 12) + 12) % 12;
  return 3 - (index % 3);
}
