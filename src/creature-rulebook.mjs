// THE CREATURE'S OWN rulebook (D-043, P5-30 phase 3). A creature writes its
// changes from its own scale, through the functional grammar in
// src/rulebooks.ni (Part 5): its harmony fields choose a path of tonic,
// predominant, and dominant regions, a root for each from the function's
// candidates that its scale holds, and the first chord shape on that root
// whose tones all lie in the scale. Bass, organ, melody, overtones, and
// permitted moves come from the fettered genre whose character it borrows
// (`harmony_character`). Pure: returns a genre book the conductor can play.

import { CREATURE_GENRE } from "./conductor.mjs";
import { SCALES, SCALE_NAMES } from "./music.mjs";

const NUMERALS = ["I", "♭II", "II", "♭III", "III", "IV", "♯IV", "V", "♭VI", "VI", "♭VII", "VII"];
const MINORISH = new Set(["minor", "dim"]);

function numeral(root, quality) {
  const name = NUMERALS[root];
  const shown = MINORISH.has(quality) ? name.toLowerCase() : name;
  return `${shown}${quality === "dom7" ? "7" : quality === "dim" ? "°" : quality === "modal_open" ? "5" : ""}`;
}

/** The creature's scale as pitch classes above its root. */
export function scalePitchClasses(score) {
  return [...new Set(SCALES[score.scale].map((step) => step % 12))].sort((a, b) => a - b);
}

/**
 * The first shape on `root` whose tones all lie in `scale`, or null. With
 * `strong`, only shapes with a third and no flat fifth (major, minor, a
 * dominant shell) count.
 */
export function chordOnRoot(root, scale, shapes, strong = false) {
  for (const shape of shapes) {
    if (strong && (!shape.tones.some((tone) => tone === 3 || tone === 4) || shape.tones.includes(6))) continue;
    if (shape.tones.every((tone) => scale.includes((root + tone) % 12))) return shape;
  }
  return null;
}

/**
 * Writes a creature's own rulebook. `rulebooks` is the compiled source, with
 * its `creature` grammar. Returns a genre book with code "creature".
 */
export function buildCreatureBook(score, rulebooks) {
  const grammar = rulebooks.creature;
  if (!grammar) throw new Error("The rulebooks carry no grammar for THE CREATURE'S OWN");
  const fettered = rulebooks.genres.filter((genre) => !genre.unfettered);
  const character = fettered[score.harmonyCharacter % fettered.length];
  const scale = scalePitchClasses(score);
  const path = grammar.paths[(score.harmonyTurn + 4 * (score.harmonyCadence % 2)) % grammar.paths.length];

  const regions = path.map((functionId, region) => {
    const { name, roots } = grammar.functions[functionId];
    // Home is always the tonic itself; elsewhere a bit of harmony_swap may
    // pass over the function's first choice for its next.
    const start = region === 0 ? 0 : (score.harmonySwap >> region) & 1;
    // A chord with a third on any candidate root beats a suspended, open,
    // or diminished one: a Phrygian creature leans home on ♭II, not v°.
    const order = roots.map((_, k) => roots[(start + k) % roots.length]).filter((root) => scale.includes(root));
    for (const [root, strong] of [...order.map((root) => [root, true]), ...order.map((root) => [root, false])]) {
      const shape = chordOnRoot(root, scale, grammar.shapes, strong);
      if (!shape) continue;
      let { quality, tones } = shape;
      // A major chord leaning home takes its seventh when the scale has one.
      if (functionId === 3 && quality === "major" && scale.includes((root + 10) % 12)) {
        quality = "dom7";
        tones = [0, 4, 7, 10];
      }
      return { degree: root, quality, label: `${numeral(root, quality)} (${name})`, tones };
    }
    const home = chordOnRoot(0, scale, grammar.shapes) ?? { quality: "modal_open", tones: [0, 7] };
    return { degree: 0, quality: home.quality, label: `${numeral(0, home.quality)} (${name})`, tones: home.tones };
  });

  // Fun Machine chord colours follow the scale where it has the key, and the
  // borrowed character elsewhere.
  const colouring = Object.freeze(character.colouring.map((quality, interval) => {
    const shape = scale.includes(interval) ? chordOnRoot(interval, scale, grammar.shapes) : null;
    return shape ? shape.quality : quality;
  }));

  // The creature's chords are triads (or shells) from its scale, so a borrowed
  // organ or melody that reaches for 7ths, 9ths, or blue notes keeps to the
  // members the chords have: they clashed on about a quarter of steps.
  const TRIAD_MEMBERS = new Set(["root", "third", "fifth", "octave"]);
  const organMembers = character.organ.method === "voiced" ? character.organ.members.filter((member) => TRIAD_MEMBERS.has(member)) : [];
  const organ = organMembers.length >= 2 ? Object.freeze({ method: "voiced", members: Object.freeze(organMembers) }) : Object.freeze({ method: "inversion" });
  const melody = character.melody.method === "members"
    ? Object.freeze({ method: "members", members: Object.freeze(character.melody.members.filter((member) => TRIAD_MEMBERS.has(member))), extensions: Object.freeze([]) })
    : character.melody.method === "scale" ? Object.freeze({ method: "chord" }) : character.melody;

  return Object.freeze({
    ...character,
    organ,
    melody,
    code: CREATURE_GENRE,
    name: "The Creature's Own",
    title: "THE CREATURE'S OWN RULEBOOK",
    motto: `Written from its ${SCALE_NAMES[score.scale].toLowerCase()} scale, ${path.map((f) => grammar.functions[f].name).join(" → ")}, in the character of ${character.name}.`,
    character: character.code,
    colouring,
    feel: "",
    spine: Object.freeze({ method: "table", steps: Object.freeze(regions.flatMap((row) => [row, row, row]).map((row) => Object.freeze({ ...row, tones: Object.freeze([...row.tones]) }))) }),
  });
}
