// Custom Rulebook Sandbox ("The Kapellmeister's Manuscript", P5-36, D-071).
// Compiles a visitor-authored Inform 7 genre manuscript on top of the canonical
// src/rulebooks.ni without altering canonical genres, and translates compiler
// errors into 1-based manuscript line numbers.

import { InformError, compileRulebooks } from "./inform.mjs";

export const MAX_MANUSCRIPT_LENGTH = 16384;

export const DEFAULT_MANUSCRIPT_SOURCE = `[The Kapellmeister's Manuscript: write or edit an Inform 7 genre rulebook below, then press COMPILE & CONDUCT.]

Part 6 - Custom Manuscript

Chapter 1 - Celestial Music Box

Celestial Music Box is an insistent voiced genre. The code of Celestial Music Box is "celestial_music_box". The title of Celestial Music Box is "CELESTIAL MUSIC BOX". The family of Celestial Music Box is "Custom Manuscripts". The motto of Celestial Music Box is "Pinned brass cylinder teeth plucking crystalline Lydian fourths and music-box fifths under a glass dome."

The changes of Celestial Music Box are the Table of Celestial Changes.
The melody method of Celestial Music Box is member snapping. The melody members of Celestial Music Box are {root, third, fifth, seventh}.
The bass method of Celestial Music Box is walking. The bass walk of Celestial Music Box is {0, 4, 7, 4, 0, 4, 7, 4, 0, 4, 7, 4}.
The organ voicing of Celestial Music Box is {root, fifth, seventh}.
The overtones of Celestial Music Box are the Table of Celestial Overtones.

Colouring rule for Celestial Music Box when the interval above the tonic is 11: rule succeeds with result min7.
Colouring rule for Celestial Music Box: rule succeeds with result maj7.
Progression rule for Celestial Music Box: rule succeeds with result the Table of Celestial Carousel.

Table of Celestial Changes
region	degree	quality	label	tones
1	0	maj7	"IΔ7 (Chime)"	{0, 4, 7, 11}
2	2	dom7	"II7 (Lydian)"	{0, 4, 7, 10}
3	9	min7	"vi7 (Velvet)"	{0, 3, 7, 10}
4	7	maj7	"VΔ7 (Spring)"	{0, 4, 7, 11}

Table of Celestial Carousel
degree	quality	melody	shown
0	maj7	{11, 7, 4}	"[root]Δ7"
2	dom7	{9, 6, 2}	"[root]7"
9	min7	{12, 7, 4}	"[root]m7"
7	maj7	{11, 7, 2}	"[root]Δ7"

Table of Celestial Overtones
ratio
"1/1"
"9/8"
"5/4"
"3/2"
"15/8"
"2/1"
`;

/**
 * Compiles `manuscriptSource` appended after `canonicalSource`, verifying that
 * every canonical genre in `canonicalSource` remains bit-for-bit unchanged and
 * that at least one custom genre is defined. Returns `{ ok: true, ... }` or
 * `{ ok: false, line, message, diagnostic }` with line numbers relative to the
 * manuscript editor.
 */
export function compileManuscript(canonicalSource, manuscriptSource) {
  if (typeof canonicalSource !== "string" || !canonicalSource.trim()) {
    return Object.freeze({
      ok: false,
      line: 1,
      message: "Canonical rulebooks source is unavailable",
      diagnostic: "MANUSCRIPT LINE 1: Canonical rulebooks source is unavailable",
    });
  }
  if (typeof manuscriptSource !== "string" || !manuscriptSource.trim()) {
    return Object.freeze({
      ok: false,
      line: 1,
      message: "Manuscript is empty — write an Inform 7 genre definition first",
      diagnostic: "MANUSCRIPT LINE 1: Manuscript is empty — write an Inform 7 genre definition first",
    });
  }
  if (manuscriptSource.length > MAX_MANUSCRIPT_LENGTH) {
    return Object.freeze({
      ok: false,
      line: 1,
      message: `Manuscript exceeds ${MAX_MANUSCRIPT_LENGTH} characters`,
      diagnostic: `MANUSCRIPT LINE 1: Manuscript exceeds ${MAX_MANUSCRIPT_LENGTH} characters`,
    });
  }

  const canonicalLineCount = canonicalSource.split("\n").length;
  const canonical = compileRulebooks(canonicalSource);
  const canonicalCodes = new Set(canonical.genres.map((g) => g.code));

  let compiled;
  try {
    compiled = compileRulebooks(`${canonicalSource}\n${manuscriptSource}`);
  } catch (error) {
    const rawLine = error instanceof InformError || Number.isInteger(error?.line)
      ? error.line
      : canonicalLineCount + 1;
    const manuscriptLine = Math.max(1, rawLine - canonicalLineCount);
    const cleanMsg = String(error?.message || "Invalid Inform 7 rulebook")
      .replace(/^Inform 7 line \d+:\s*/i, "");
    return Object.freeze({
      ok: false,
      line: manuscriptLine,
      message: cleanMsg,
      diagnostic: `MANUSCRIPT LINE ${manuscriptLine}: ${cleanMsg}`,
    });
  }

  for (const baseGenre of canonical.genres) {
    const after = compiled.byCode[baseGenre.code];
    if (!after || JSON.stringify(after) !== JSON.stringify(baseGenre)) {
      return Object.freeze({
        ok: false,
        line: 1,
        message: `Manuscript may not alter canonical genre "${baseGenre.code}"`,
        diagnostic: `MANUSCRIPT LINE 1: Manuscript may not alter canonical genre "${baseGenre.code}"`,
      });
    }
  }

  const addedGenres = compiled.genres.filter((g) => !canonicalCodes.has(g.code));
  if (!addedGenres.length) {
    return Object.freeze({
      ok: false,
      line: 1,
      message: "Manuscript compiled, but declared no new genre (give your genre a unique code)",
      diagnostic: "MANUSCRIPT LINE 1: Manuscript compiled, but declared no new genre (give your genre a unique code)",
    });
  }

  const primaryGenre = addedGenres[0];
  return Object.freeze({
    ok: true,
    rulebooks: compiled,
    addedGenres: Object.freeze(addedGenres),
    primaryCode: primaryGenre.code,
    primaryTitle: primaryGenre.title,
    diagnostic: `MANUSCRIPT COMPILED · ${addedGenres.length} CUSTOM GENRE${addedGenres.length === 1 ? "" : "S"} READY (${addedGenres.map((g) => g.title).join(", ")})`,
  });
}
