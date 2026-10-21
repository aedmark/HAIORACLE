// A creature's variation on its genre's changes (D-043, P5-30 phase 2). The
// genre's rulebook names the moves it permits (src/rulebooks.ni); the
// creature's harmony score fields choose among them. Pure: takes the spine
// the genre wrote (twelve chords above the tonic) and returns a varied one,
// plus the names of the moves it made, for the Kapellmeister readout.
//
// The moves work on "runs": consecutive steps holding the same chord. The
// first run is home and is never swapped, so every creature still starts on
// its genre's tonic chord (unless the genre permits rotation).

export const VARIATION_MOVES = Object.freeze([
  "rotation",
  "relative_substitution",
  "tritone_substitution",
  "secondary_dominants",
  "modal_borrowing",
  "deceptive_cadence",
  "plagal_cadence",
  "phrygian_cadence",
  "authentic_cadence",
  "harmonic_pace",
]);

const SWAP_MOVES = Object.freeze(["relative_substitution", "tritone_substitution", "secondary_dominants"]);
const CADENCE_MOVES = Object.freeze(["deceptive_cadence", "plagal_cadence", "phrygian_cadence", "authentic_cadence"]);

// The tones a chord the variation writes carries, above its root, so the
// organ, chimes, and melody follow it as they follow a table's chords.
const TONES = Object.freeze({
  major: [0, 4, 7],
  minor: [0, 3, 7],
  dom7: [0, 4, 7, 10],
  maj9: [0, 4, 7, 11, 2],
  min9: [0, 3, 7, 10, 2],
  dom7alt: [0, 4, 7, 10],
  dim: [0, 3, 6, 9],
  min7: [0, 3, 7, 10],
  maj7: [0, 4, 7, 11],
  half_diminished: [0, 3, 6, 10],
  augmented: [0, 4, 8],
  sus4: [0, 5, 7],
  major_6: [0, 4, 7, 9],
});

const NUMERALS = ["I", "♭II", "II", "♭III", "III", "IV", "♯IV", "V", "♭VI", "VI", "♭VII", "VII"];
const MINORISH = new Set(["minor", "min9", "dim", "min7", "half_diminished"]);

function numeral(root, quality) {
  const name = NUMERALS[((root % 12) + 12) % 12];
  const shown = MINORISH.has(quality) ? name.toLowerCase() : name;
  const suffix = quality === "dom7" || quality === "dom7alt" || quality === "min7" ? "7"
    : quality === "maj9" ? "maj9"
    : quality === "min9" ? "9"
    : quality === "dim" ? "°"
    : quality === "maj7" ? "maj7"
    : quality === "half_diminished" ? "ø7"
    : quality === "augmented" ? "+"
    : quality === "sus4" ? "sus4"
    : quality === "major_6" ? "6"
    : "";
  return `${shown}${suffix}`;
}

function runsOf(steps) {
  const runs = [];
  steps.forEach((chord, index) => {
    const last = runs.at(-1);
    if (last && sameChord(steps[last.start], chord)) last.length += 1;
    else runs.push({ start: index, length: 1 });
  });
  return runs;
}

const sameChord = (a, b) => a.root === b.root && a.quality === b.quality && a.op === b.op;

/**
 * Varies `spine` by the moves `permitted` (codes from the genre's rulebook),
 * steered by the score's harmony fields. `makeChord(root, quality, label,
 * pitchClasses)` builds a chord the way the conductor does. Returns
 * `{ spine, moves }`; with nothing permitted, or a raw spine, `moves` is empty
 * and the spine comes back as it was.
 */
export function varySpine(spine, score, permitted, makeChord) {
  const allowed = new Set(permitted ?? []);
  if (!allowed.size || spine.some((chord) => chord.quality === "raw")) return { spine, moves: Object.freeze([]) };
  let steps = [...spine];
  const moves = [];
  // New chords speak the genre's own colour: a genre written in ninths gets
  // ninths, one written all in dominant sevenths gets sevenths, so its organ
  // voicing (a jazz organ's 3rd/7th/9th) still lands inside the chord.
  const written = new Set(spine.map((c) => c.quality));
  const flavour = written.has("maj9") || written.has("min9")
    ? { major: "maj9", minor: "min9" }
    : [...written].every((quality) => quality === "dom7") ? { major: "dom7", minor: "min9" } : {};
  const ninths = written.has("maj9") || written.has("min9");
  // `tag` says why the chord is there ("relative"); `label` overrides the
  // numeral for chords named by their target (V7/ii).
  const chord = (root, quality, tag, label = null) => {
    const r = ((root % 12) + 12) % 12;
    const coloured = flavour[quality] ?? quality;
    // In a genre of ninths a new dominant carries its 9th too.
    const tones = ninths && coloured === "dom7" ? [...TONES.dom7, 2] : TONES[coloured];
    return makeChord(r, coloured, label ?? `${numeral(r, coloured)} (${tag})`, tones.map((tone) => (r + tone) % 12));
  };
  const fill = (run, value) => { for (let k = 0; k < run.length; k += 1) steps[run.start + k] = value; };
  const homeMinor = MINORISH.has(spine[0].quality);

  // 1. Rotation: start the changes from another region of the loop.
  if (allowed.has("rotation") && score.harmonyTurn > 0) {
    const shift = score.harmonyTurn * 3;
    steps = [...steps.slice(shift), ...steps.slice(0, shift)];
    moves.push("ROTATED");
  }

  // 2. Swaps: each run past home whose bit is set in harmony_swap takes the
  // first applicable substitution the genre permits, starting from a move the
  // field picks.
  const swaps = SWAP_MOVES.filter((move) => allowed.has(move));
  if (swaps.length && score.harmonySwap > 0) {
    const runs = runsOf(steps);
    runs.forEach((run, index) => {
      if (index === 0 || !(score.harmonySwap & (1 << (index % 4)))) return;
      const current = steps[run.start];
      for (let tries = 0; tries < swaps.length; tries += 1) {
        const move = swaps[(index + score.harmonySwap + tries) % swaps.length];
        if (move === "relative_substitution" && ["major", "minor", "maj9", "min9", "maj7", "min7"].includes(current.quality)) {
          const toMinor = current.quality === "major" || current.quality === "maj9" || current.quality === "maj7";
          const quality = { major: "minor", maj9: "min9", maj7: "min7", minor: "major", min9: "maj9", min7: "maj7" }[current.quality];
          const root = current.root + (toMinor ? 9 : 3);
          fill(run, chord(root, quality, "relative"));
          moves.push("RELATIVE SUB");
          return;
        }
        if (move === "tritone_substitution" && (current.quality === "dom7" || current.quality === "dom7alt")) {
          const root = current.root + 6;
          fill(run, chord(root, current.quality, "tritone"));
          moves.push("TRITONE SUB");
          return;
        }
        if (move === "secondary_dominants" && run.length >= 2) {
          const next = steps[(run.start + run.length) % steps.length];
          if (next.quality === "dim") continue;
          const root = next.root + 7;
          steps[run.start + run.length - 1] = chord(root, "dom7", null, `V7/${numeral(next.root, next.quality)}`);
          moves.push("SECONDARY DOMINANT");
          return;
        }
      }
    });
  }

  // 3. Modal borrowing (major homes only): a IV turns minor (iv), then a
  // second reach brings in ♭VI, a third ♭VII.
  if (allowed.has("modal_borrowing") && score.harmonyBorrow > 0 && !homeMinor) {
    const runs = runsOf(steps).slice(1);
    const borrow = (test, root, quality, name) => {
      const run = runs.find((candidate) => test(steps[candidate.start]));
      if (!run) return;
      fill(run, chord(root, quality, "borrowed"));
      moves.push(`BORROWED ${name}`);
    };
    borrow((c) => c.root === 5 && (c.quality === "major" || c.quality === "maj9"), 5, "minor", "iv");
    if (score.harmonyBorrow >= 2) borrow((c) => c.root === 9 && MINORISH.has(c.quality), 8, "major", "♭VI");
    if (score.harmonyBorrow >= 3) borrow((c) => (c.root === 2 || c.root === 4) && MINORISH.has(c.quality), 10, "major", "♭VII");
  }

  // 4. Cadence: how the last run turns the loop home.
  const cadences = CADENCE_MOVES.filter((move) => allowed.has(move));
  if (cadences.length && score.harmonyCadence > 0) {
    const run = runsOf(steps).at(-1);
    const move = cadences[(score.harmonyCadence - 1) % cadences.length];
    if (move === "plagal_cadence") {
      const quality = homeMinor ? "minor" : "major";
      fill(run, chord(5, quality, "plagal"));
      moves.push("PLAGAL CADENCE");
    } else if (move === "phrygian_cadence") {
      fill(run, chord(1, "major", "Phrygian"));
      moves.push("PHRYGIAN CADENCE");
    } else if (move === "authentic_cadence") {
      fill(run, chord(7, "dom7", "authentic"));
      moves.push("AUTHENTIC CADENCE");
    } else if (move === "deceptive_cadence") {
      const dominant = chord(7, "dom7", "deceptive");
      const turn = homeMinor ? chord(8, "major", "deceptive") : chord(9, "minor", "deceptive");
      fill(run, dominant);
      steps[run.start + run.length - 1] = turn;
      moves.push("DECEPTIVE CADENCE");
    }
  }

  // 5. Harmonic pace: changes arrive a step early (pushed) or a step late
  // (lingering), wherever both neighbouring runs are long enough to keep.
  if (allowed.has("harmonic_pace") && score.harmonyPace > 0) {
    const runs = runsOf(steps);
    const before = [...steps];
    let changed = false;
    for (let index = 1; index < runs.length; index += 1) {
      const previous = runs[index - 1];
      const run = runs[index];
      if (previous.length < 2 || run.length < 2) continue;
      if (score.harmonyPace === 1) steps[run.start - 1] = before[run.start];
      else steps[run.start] = before[run.start - 1];
      changed = true;
    }
    if (changed) moves.push(score.harmonyPace === 1 ? "PUSHED CHANGES" : "LINGERING CHANGES");
  }

  return { spine: Object.freeze(steps), moves: Object.freeze([...new Set(moves)]) };
}
