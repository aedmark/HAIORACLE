# Session Handoff

Read this first when resuming work. Protocol: [AGENTS.md](../AGENTS.md). Plan: [ROADMAP.md](../ROADMAP.md). Architecture: [ARCHITECTURE.md](ARCHITECTURE.md). Decisions: [DECISIONS.md](DECISIONS.md). Tests: [TESTING.md](TESTING.md).

## Current state

_Last updated: 2026-10-21, session 58, on `main`._

- P5-28 is complete: Fun Machine voices, each creature's own by default (D-040).
- D-042 freed the organ, chimes, and mycelium from the creature filter.
- P5-30 is complete (D-043): clashes cut, every creature varying its genre's changes, the VARIATION readout, AS WRITTEN, sessions v6, and THE CREATURE'S OWN rulebook.
- D-044 moves harmony one chord per loop, on the downbeat.
- A fresh creature opens in THE CREATURE'S OWN (maintainer's choice, 2026-10-21).
- Next: D-041 wave 1 (P5-29; the RULEBOOK menu has THE CREATURE'S OWN plus the seven genres, and no new genres yet) or P4-02.

**Where things stand:** P1, P2, P3-01 through P3-03, P4-01, P5-01 through P5-28, and P5-30 are implemented and verified. The ensemble features an INTERCAL 1972 Grand Conductor (`src/conductor.i`, `src/intercal.mjs`, P5-22, D-028) that overcomes the "wall of sound" by executing a canonical 35-statement INTERCAL score with 22.9% politeness checking (ICL079/ICL099) that reads each creature's arrangement word with `WRITE IN` and chooses its form per phrase with at least five band voices on every step (D-031, D-032), channel registers that the program itself sets across four regions (Exposition groove, Antiphonal conversation, Tutti climax, Breakdown), and `COME FROM (60)` turnaround cadence interception at step 11 (D-030). The transport names the current section, rested console strips light TACET, and MIDI exports carry section markers. The Esoteric Fun Machine (`#fun-machine-engine`, P5-17, P5-22, D-029) is a one-finger accompanist: a held key plays a SWELL, ARPEGGIO, or PROGRESSION on the band's step grid through a voice-led stereo pad, a soft arpeggio pluck, and a gliding lead, while the band is re-conducted onto that chord in the correct key and the LOLCODE lead and drones step back by 10 dB. A master transport with `Space`/`Esc` (P5-18), an eight-channel mixer with VU meters in a graph shared by live and offline audio (P5-19), nine-stem ZIP and Type 1 MIDI export (P5-21), and a Session Ledger with on-device presets and validated `.fun` files (P5-20) complete the workstation wings.

**Verified** (2026-10-20, session 45, local Linux environment)

| Suite | Result |
| --- | --- |
| `node --test tests/*.test.mjs` | **126/126 behavioral and structural checks passed** |
| `python3 tools/check_docs.py` | **0 errors, 0 warnings across 14 documents** |
| `python3 tools/manual.py check docs/manual.json` | **6 sections, 35 entries, 0 errors, 0 warnings** |

**What works**


- The static page accepts a phrase and offers surprise, replay, and mute controls (P2-03).
- The phrase becomes a stable unsigned seed under the D-003 normalization contract.
- A purpose-built interpreter executes `src/oracle.lol` and rejects unsupported syntax with line numbers (P1-02, D-002).
- The spell emits validated audio, visual, and naming parameters (P2-01).
- Canvas and Web Audio share the same immutable score (P2-02, D-004).
- Audio loops continuously until mute, restart, replacement, or page close (D-005).
- The expanded grammar covers twelve-note phrases, eight scales, six rhythms and voices, ten shapes, broader size and color ranges, and six name templates (P5-01, D-005).
- Eye silhouette, iris treatment and color, pupil shape, layout, size, and gaze vary deterministically (P5-02, D-006).
- Body boundaries continuously deform through eight clamped flux grammars while eight seed-selected kinetic systems move independently inside them (P5-03, D-007).
- Canvas geometry does not resize on audio beats; sound and image remain paired through their shared immutable score (D-008).
- The large exterior glow is isolated to the body fill; kinetic lines, rings, and eyes no longer inherit its expensive per-primitive blur.
- Master volume adjusts the active loop smoothly from silence through a compressor-protected boost, and the live tempo slider (`#tempo-bpm`, `36..208` BPM) paces all six esoteric instruments in real time while defaulting to `score.pulse` on summon (P5-04, D-009).
- Every phrase selects and rotates one of twelve named twelve-note motifs, including five arpeggio and three chromatic families, then repeats it exactly (P5-05, D-010).
- The responsive page shell uses an engraved book-serif and telegraph-monospace stack, foxed parchment and tarnished brass parlor framing, inline SVG sigil and spandrel linework, and a centered bell-jar apparition vitrine without remote or proprietary assets (P5-06, D-011).
- Tapping/clicking, holding, and holding-and-dragging inside the vitrine trigger synthesized glass and membrane percussion, drive a constant-power harmonic phase shift across the creature's motif and three-partial drone choir, and morph, tug, and accelerate the creature's silhouette, kinetic core, and gaze before decaying smoothly back to its deterministic score (P5-07, D-012).
- A procedural mycelial network with branching hyphae, anastomotic fusion loops, traveling nutrient waves, and eight generative sporophore fruiting bodies (Agaric Cap, Bracket Conk, Coral Clavaria, Bioluminescent Bonnet, Cup Peziza, Morel Honeycomb, Globular Puffball, Hyphal Hydra) grows over a 10-second life-cycle envelope, puffs glowing ballistospores on vitrine taps, and accelerates with touch (P5-16, D-017).
- A spec-compliant 1998 Malbolge virtual machine (`src/malbolge.mjs`) executes `src/beat.mal` on a $3^{10}$ ternary tape to generate a 12-step ternary beat matrix (`#beat-grid`) across eight cadence families, with synthesized bellows kick, clockwork snare, and escapement chime voices plus live step cycling, pulse toggle, and mutation controls (P5-08, D-013).
- A 1993 Brainfuck tape interpreter (`src/brainfuck.mjs`) executes `src/bass.bf` on a 256-cell byte tape with `[->+<]` transfer loops to generate a 12-cell walking sub-bass and resonant lowpass acid-organ ostinato (`#bass-grid`) across eight groove archetypes, with portamento glide, live cell stepping, bass toggle, and tape-shift controls (P5-09, D-014).
- A 1993 Befunge-93 2D torus interpreter (`src/befunge.mjs`) executes `src/harmony.bfg` across an 80×25 boustrophedon mirror grid with `#` bridges and four diagonal mirrors (`\ / / \`) to generate a 12-cell polyphonic 3-voice chord organ (`#harmony-grid`) across eight organ archetypes, with `/` ascending and `\` descending harp-strum voicings, live mirror cycling, organ toggle, and mirror-flip controls (P5-10, D-014).
- A 2001 Piet 2D codel interpreter and 1987 John Conway FRACTRAN prime-ratio machine (`src/fractran.mjs`) execute `src/pad.piet` (49 codel transitions across all 18 chromatic codels) and `src/chimes.frac` ($2^a 3^b 5^c 7^d$ rational multipliers) to drive Just Intonation overtone bells and synesthetic codel-filtered chorus pads (`#chime-grid`) across eight carillon archetypes, with live codel/ratio cycling, chime toggle, and codel-refraction controls (P5-11, D-014).
- A 2001 Shakespeare Programming Language interpreter (`src/shakespeare.mjs`) executes `src/chant.spl` (`The Oracular Tragedy of the Parlor Glass.`) across 3 Acts, 12 Scenes, and four dramatis personae (`Hamlet`, `Ophelia`, `Prospero`, `Hecate`) to drive a 3-formant ($F_1, F_2, F_3$) parallel bandpass vowel choir (`#chant-grid`) across eight dramatic archetypes, coordinated with the other five languages by the Parlor Bandstand ensemble console (`#bandstand-engine`, P5-12, P5-13, D-014).
- An Euler-Tonnetz and Euclidean harmonic conductor (`src/conductor.mjs`) harmonizes all six esoteric bandmates across a 4-region Neo-Riemannian *Tonnetz* (`P`, `L`, `R`) progression, Leonhard Euler's 1739 *Gradus Suavitatis* consonance sieve, pure 5-limit Just Intonation chime overtones, and Bjorklund Euclidean rhythm hocketing $E(k, 12)$ (P5-14, D-016).
- The Kapellmeister music-theory console (`#kapellmeister-engine`) provides six selectable rulebooks (`Victorian Tonnetz`, `12-Bar Blues`, `Smoky Jazz`, `Palestrina Counterpoint`, `Mystic Drone`, `Raw Chaos`), an Euler consonance strictness slider ($3\dots 14$), live harmonic step/chord/vector/Euler score telemetry, and an animated 4-region SVG Tonnetz compass (P5-15, D-019).
- The Antique Parlor Room Acoustic Space (`#parlor-acoustics-engine`) synthesizes authentic 1890s Edison wax-cylinder surface noise (horn resonance, Poisson dust pops, 78 RPM groove rumble), a 1.6-second wood-and-velvet chamber convolution reverb (`ConvolverNode`), and mechanical brass clockwork escapement ticks on quarter-beats, active in both live playback and offline 16-bit WAV rendering (P5-15, D-019).
- The Fun Machine accompanist (`#fun-machine-engine`, D-029): hold a key on the 13-key manual or `[A..K]` and choose SWELL, ARPEGGIO, or PROGRESSION; the pad, arpeggio, and lead play in the band's rhythm, the band follows the chord, and the LOLCODE lead ducks. Punch-in recording and the 12-step sequencer write chords that play as pads live and in exports.
- Summoned creatures sync their phrase to `#omen=...` URL fragments without sending query parameters over HTTP, can be copied via `COPY OMEN LINK` (`#share-link`), and can be exported as a 1200×1520 engraved broadsheet PNG (`#export-png`) containing the live creature capture, specimen name, confided phrase, seed, and six-language ensemble ledger (P3-01, P3-02, D-015).
- A comprehensive 3x technical manual (`docs/manual.json`, `manual.html`, `tools/manual.py`) documents What, How, and Why across all 28 major systems, interpreters, and algorithms with 0 warnings.
- Full interactive and audiovisual functionality verified in live browser review (P4-01).
- The master transport (`#transport-deck`) plays, pauses at the last heard step, and stops-and-rewinds the loop; `Space` toggles play/pause and `Esc` stops from anywhere. Live playback and WAV export build one shared graph (`src/ensemble.mjs`), so exports render the routing the listener hears (P5-18, D-023).
- The Session Ledger (`#session-engine`) saves the whole apparatus as named presets in this browser's `localStorage` or as portable `.fun` files, and restores it exactly; files and stored presets pass a strict validator first (P5-20, D-026).
- `EXPORT 9 STEMS (ZIP)` downloads eight aligned channel stems, a parlor-room stem, and a README; `WRITE MIDI SCORE` downloads a Type 1 MIDI file with a tempo track and seven named parts captured from the live schedulers (P5-21, D-025).
- The parlor mixing console (`#mixer-engine`) gives all eight voices a fader, pan, mute, solo, and live post-fader VU meter. Plate ENGAGE/SILENCE switches are the console's mutes, and WAV exports follow the mix. Default voicing trims lift the lead +6 dB and the choir +12 dB with faders still at unity, faders reach a further +12 dB, the choir bypasses the creature filter, and bandpass creatures blend a dry lead tap, so neither voice is buried by narrow bandpass creatures any more (P5-19, D-024).
- Below the vitrine and the reading strip (name and score card only), the page is a four-wing workstation (D-027): **Perform** (transport rail with restart, volume, and tempo; Fun Machine; Kapellmeister), **Mix** (Bandstand, console, parlor room), **Keep** (Session Ledger; export desk with WAV, stems, MIDI, PNG, and omen link), and **The Band** (Plates II–VI). Tab order follows the same sequence, and nothing overflows at 320, 375, 768, or 1100 px.
- Runtime assets are local and dependency-free (D-001).
- Updates load cleanly without a hard reload (D-035): `index.html` builds an import map that stamps every module with `?v=<ASSET_VERSION>` (a hash of `src/`), and sources are fetched with the same stamp. Verified in the built-in browser against plain `python3 -m http.server`: with 28 of 29 files served from heuristic cache, a new export added to `src/ensemble.mjs` and imported by `src/app.mjs`, plus a restamp, loaded on a normal reload with all 29 requests at the new stamp and no console errors.

**Not verified**

- Dedicated assistive-technology and screen-reader testing remains P4-02 work.
- No public hosting or domain exists.
- Session presets have not been checked in a real private window or against a full storage quota. The blocked-storage path was simulated by making `localStorage` throw.
- No DAW import has been tried: stems and MIDI were validated by independent parsers (Python `zipfile`, `unzip -t`, an in-page SMF reader), not by opening them in a DAW.
- Nobody has listened to the mixer yet: hard-pan feel, the fader taper, and meter ballistics were checked by numbers, not by ear.
- The four-wing layout was checked in the built-in browser by measurement and screenshots, not by the maintainer's own hands-on review, and not in Safari or Firefox.
- Nobody has listened to the transport changes yet. Pause/resume, the output fade, and WAV parity were checked structurally and in a live browser by state readouts and PCM statistics, not by ear.

**Gotchas**

- After editing anything under `src/`, run `node tools/stamp_assets.mjs`; `tests/assets.test.mjs` fails until you do. A new module must also join `MODULES` in `index.html` (D-035).
- Serve the directory over HTTP, preferably with `python3 tools/serve.py` (no stale caching). A direct `file:` URL cannot fetch `src/oracle.lol`, `src/beat.mal`, `src/bass.bf`, `src/harmony.bfg`, `src/pad.piet`, `src/chimes.frac`, or `src/chant.spl`.
- The interpreter deliberately implements a subset. Read D-002 before extending the spell.
- Changes to hash, normalization, formula constants, scale, or name tables can break phrase identity. D-005 through D-007, D-013, D-014, and D-016 record intentional pre-release compatibility breaks.

## Next steps

1. Listening pass on the Fun Machine accompanist (D-029): pad warmth and level against the band, arpeggio density at fast tempos, the lead line's glide, and whether a 10 dB lead duck is the right amount.
2. Optional: on bandpass creatures (voices 1 and 5) the organ, chimes, and mycelium remain heavily filtered (pigeons organ −73.9 dB solo). The lead and choir are fixed (D-024 points 7–8).
3. Exports render one 12-step loop, but rhythm patterns 2 and 3 have five cells, so their WAV, stems, and MIDI do not tile seamlessly (the live loop is unaffected). A 60-step render, or rounding those patterns to 12, would fix it; either is a determinism-adjacent choice for the maintainer.
4. Hands-on review of the four-wing layout (D-027) in Safari and Firefox; the maintainer approved it from the Chromium review. A sticky transport rail was deferred; it needs the cabinet's `overflow: hidden` changed to `overflow: clip`.
5. Complete P4-02 with keyboard, reduced-motion, contrast, and screen-reader checks.
6. Choose public hosting and domain (Q-001 / P6-01). Serve `index.html` with `Cache-Control: no-cache` there (D-035); stamped `src/` URLs can be cached freely.

## Open questions

- Q-001 blocks P6-01: choose public hosting and domain.

## Session log

### Session 58: 2026-10-21: every creature writes its own rulebook (P5-30 complete)

**Contributor:** Claude Code with maintainer direction

**Goal:** P5-30 phase 3, THE CREATURE'S OWN rulebook (D-043).

**Done:** Phase 4 was pushed (b92dca5). Phase 3 is done, which completes P5-30.

**Changed:**
1. `src/rulebooks.ni` Part 5 holds three tables:
   - Harmonic Functions: tonic, predominant, and dominant, with candidate roots.
   - Harmonic Paths: eight four-region paths, each starting at home.
   - Chord Shapes: major, minor, dominant shell, two suspended, open fifth, diminished, quartal.

   `src/inform.mjs` `readCreatureGrammar()` validates them as an optional `creature` section.
2. New `src/creature-rulebook.mjs`:
   - `buildCreatureBook(score, rulebooks)`: the path comes from `harmony_turn` and `harmony_cadence`, and a root's alternative from `harmony_swap`. Chords with a third (no ♭5) are tried on every candidate before weaker shapes, and a major dominant takes the scale's ♭7.
   - The character comes from `harmony_character`, with organ and melody kept to triad members.
   - Fun Machine colours follow the scale.
3. `src/conductor.mjs`: `CREATURE_GENRE`, `installCreatureBook()`, and `compiledRulebooks()`; `genreBook("creature")` returns the installed book. `src/music.mjs` exports `SCALES` and `SCALE_NAMES`.
4. `src/app.mjs`: THE CREATURE'S OWN is first in the menu, and every summon writes and installs the creature's book. `src/session.mjs` accepts the genre `"creature"`.
5. Tests: new `tests/creature-rulebook.test.mjs`, and a session acceptance check.

**Verified:**
- 159/159 Node checks.
- Over 200 creatures: 103 distinct progressions, every chord tone in the scale, no diminished chords, and clashes 0–9% by character before the triad fit, at most 6% overall after.
- In the browser:
  - "three pigeons" (Phrygian, Palestrina character) read i → iv → i (relative) → ♭II (Phrygian), with motto "Written from its phrygian scale, tonic → predominant → tonic → dominant…".
  - "glass eel at midnight" read a Dorian book in the Ragtime character.
  - A saved file kept `"creature"` and reopened on it.

**Not verified:** The maintainer's listen.

**Fixed later in the session:** `#fun-machine-telemetry` is restored under the Fun Machine title. It had dropped out of `index.html` in 3aac60e along with the maintainer's own page edits. A new static test checks that every `#id` the app queries (120 of them) exists in the page. Progression summaries now deduplicate by chord name. Verified in the browser: the line narrates the key, style, step, and chord, names the voice on a chip change, and keeps a fixed height, so the keyboard below never moved.

**Follow-up (same session):** at the maintainer's choice, a fresh creature opens in THE CREATURE'S OWN (`activeGenre = CREATURE_GENRE` at rulebook install). Before any summon, the Kapellmeister shows "Summon a creature and it writes its own rulebook from its scale." Verified in the browser on a fresh page, then on "a moth in the music box".

**Next session should start with:** D-041 wave 1 or P4-02.

### Session 57: 2026-10-21: variation, saved and played (P5-30 phase 4 complete)

**Contributor:** Claude Code with maintainer direction

**Goal:** Finish P5-30 phase 4: sessions v6 with AS WRITTEN, Fun Machine progressions that vary, and chord names in MIDI markers.

**Done:** D-044 and the phase 4 readout and switch were pushed (96815d9) after the maintainer's "This is getting better and better." Phase 4 is complete.

**Changed:**
1. `src/session.mjs`: `SESSION_VERSION` 6 with top-level `varied` (boolean). Versions 1–5 open with `varied: false`. `funMachine.voice` is read from v5 on.
2. `src/app.mjs`: sessions save and restore `genreVaried`.
3. `src/accompaniment.mjs`:
   - `buildPerformance(…, { pass, score, varied })` varies a progression through `varyProgression()`: key-relative chords run through `varySpine()` without rotation or pace, and unchanged chords keep their objects.
   - Pads strike wherever the chord changes, and moved chords get the lead pitch's nearest chord tone. `strikeLength()` is new.
4. `src/app.mjs`:
   - `performanceOf()` builds every performance: the live key, recorded slots, and pass changes. The cache key includes AS WRITTEN and the seed.
   - Pads, bridges, and layer replay hold until the performance strikes again.
   - The AS WRITTEN toggle rebuilds a held key's performance.
   - The offline render records `stepChords`, and `chordMarkers()` adds a "CHORD · …" marker at each change.
5. Tests: the v6 session paths, the varied Fun Machine (at least 8 distinct cycles over 40 creatures, the held key first, strikes exactly at changes, moved chords' leads on chord tones), and static checks for markers and sessions.

**Verified:**
- 155/155 Node checks.
- In the browser on "three pigeons" in Parlor Ragtime:
  - VARIATION read RELATIVE SUB · TRITONE SUB · DECEPTIVE CADENCE.
  - MIDI markers ran A♭ → A♭7 → B♭m (relative) → D° → Fm (relative) → F7 → E7 (tritone) → E♭7 (deceptive) → Fm (deceptive).
  - AS WRITTEN switched the readout and saved a v6 file with `varied: false`.
  - A held C walked C → C7 → F → G7 as written, and C → C7 → Fm → D7 → G7 → Am varied.
  - STOP rewinds the cycle to pass 1/4; PAUSE and PLAY keep it.
- No console errors from the app.

**Not verified:** The maintainer's listen on the varied Fun Machine.

**Still open:** `#fun-machine-telemetry` is missing from `index.html` (see Session 56).

**Next session should start with:** the maintainer's listen and tuning notes on the variation moves, then P5-30 phase 3 (THE CREATURE'S OWN rulebook).

### Session 56: 2026-10-20: harmony keeps step with the band (D-044; P5-30 phase 4 begun)

**Contributor:** Claude Code with maintainer direction

**Goal:** P5-30 phase 4. Midway, the maintainer reported that the progressions moved too fast for the band and asked that the accompaniment always stay locked to the tempo.

**Done:** Phase 2 was pushed (06a6d02). D-044 is accepted with the maintainer's choices: one chord per loop, and exports covering the whole cycle. In phase 4, the VARIATION readout and the AS WRITTEN switch are done.

**Changed:**
1. `index.html`, `styles.css`, `src/app.mjs`:
   - `#kapellmeister-variation` is one fixed line naming the creature's moves.
   - `#kapellmeister-as-written` (`aria-pressed`) toggles `genreVaried`, which `applyEnsembleConductor()` passes as `varied`. Not yet saved in sessions.
2. `src/conductor.mjs`: `HARMONIC_PASSES`, `passSpine()`, and `conductEnsemble({ harmonicPass })`, returning `cycleSpine`.
3. `src/accompaniment.mjs`: `buildPerformance(…, { pass })` builds a progression one chord per pass, with lead notes at steps 0, 4, and 8 (`leadSteps: 4`). Performances carry `regionSteps` (12, or 3 for single-chord styles).
4. `src/app.mjs`:
   - `currentHarmonicPass`, `harmonicPassAt()` (a song restarts the cycle), and `enterHarmonicPass()`, called at each loop downbeat, which re-conducts and rebuilds a held key's performance. `performanceFor()` is cached per pass.
   - Pads and the key-press bridge use `regionSteps`, lead notes hold their steps, and the offline render walks the four passes (`songPasses(song) || HARMONIC_PASSES`) and hands the band back after.
   - The readout shows `heardHarmony`, the harmony captured when each step was scheduled, because the scheduler re-conducts about 0.28 s ahead and the readout used to show the next chord on step 12. The compass shows `currentCycleSpine` and lights the pass.
5. Tests: the harmonic clock (variation test), the per-pass performance (accompaniment test), and static checks for the clock and export wiring.

**Verified:**
- 153/153 Node checks. The golden and variation fixtures are unchanged.
- No tempo drift: the band and the accompanist read the same live tempo each step.
- In the browser (Smoky Jazz, "three pigeons", full tempo), the readout's chord changed at "01 / 12 · 2/4", "· 3/4", and "· 4/4", plus two varied turns at step 09, then returned to ii9 at "01 / 12 · 1/4".
- A held C walked Cmaj9 → Amin9 → Dmin9 → G7alt, one per pass.
- The MIDI export covered four loops (4 turnaround markers, 284 notes).

**Found, not fixed:** `#fun-machine-telemetry` is styled and written to by `src/app.mjs`, but the element is gone from `index.html`, so Fun Machine telemetry never shows. This predates this session.

**Verified by ear:** the maintainer: "This is getting better and better."

**Next session should start with:** that listen, then the rest of P5-30 phase 4: sessions v6 with AS WRITTEN (older files open as written), varying Fun Machine progressions, and chord names in MIDI markers.

### Session 55: 2026-10-20: every creature varies its genre (P5-30 phase 2)

**Contributor:** Claude Code with maintainer direction

**Goal:** P5-30 phase 2: the Inform 7 permitted moves and the conductor's variation moves (D-043).

**Done:** Phase 1 was committed and pushed (ea94bbb). Phase 2 is done.

**Changed:**
1. `src/rulebooks.ni` adds a kind, "Variation move" (rotation, relative and tritone substitution, secondary dominants, modal borrowing, deceptive, plagal, Phrygian, and authentic cadence, harmonic pace), and a property, "permitted moves". Every fettered genre lists its moves; Raw Chaos lists none.
2. `src/inform.mjs` compiles the moves into `book.variation`. The property is optional, so the barbershop fixture still compiles.
3. New `src/variation.mjs`, `varySpine(spine, score, permitted, makeChord)`. It works on runs of one chord and never swaps the home run:
   - rotation by `harmony_turn`;
   - swaps on runs flagged in `harmony_swap`;
   - borrowing by `harmony_borrow` (major homes only);
   - a cadence on the last run by `harmony_cadence`;
   - pushed or lingering changes by `harmony_pace`.

   New chords take the genre's colour (ninths in jazz, dom7 in the blues) and labels like "♭II7 (tritone)" or "V7/ii9".
4. `src/conductor.mjs`: `conductEnsemble({ varied })` varies only when asked, never over a held key, and returns `variation` (the move names). `src/app.mjs` passes `varied: true` and keeps `currentVariation` for the phase 4 readout. The import map gains `variation.mjs`.
5. Tests:
   - new `tests/variation.test.mjs`, `tests/variation-capture.mjs`, `tests/fixtures/variations-golden.json`, and `tools/freeze_variations.mjs`;
   - varied clash ceilings in `tests/clashes.test.mjs` (jazz 10%).

**Verified:**
- 151/151 Node checks. The golden fixture ("as written") passes unchanged.
- Distinct progressions over 80 creatures: Victorian 73, Jazz 69, Blues 51, Ragtime 34, Palestrina 30, Drone 21. Before, each genre had 1, and Victorian 16.
- Varied clash rates: Victorian 5%, Palestrina 5%, Jazz 8%, Drone 0%, Ragtime 0%, Blues 32% (blue notes).
- Live in Smoky Jazz, the readout's vector over one loop:
  - "three pigeons": ii9 → ♭II7alt → Imaj9 → V7/vi9 → V7 (deceptive) → vi9 (deceptive)
  - "the moth reads braille": vi9 → ii9 → V7/♭II7 → ♭II7alt → Imaj9 → V7/vi9
  - "velvet ossuary hymn": Imaj9 → vi9 → V7/ii9 → ii9 → V7 (tritone)

**Not verified:** The maintainer's listen. The Fun Machine's PROGRESSION style does not vary yet; that comes with phase 4, along with the readout's VARIATION line and the AS WRITTEN switch.

**Next session should start with:** the maintainer's listen, then P5-30 phase 3 (THE CREATURE'S OWN rulebook) or phase 4 (readout, sessions, AS WRITTEN, Fun Machine progressions).

### Session 54: 2026-10-20: the creature's harmony fields (P5-30 phase 1)

**Contributor:** Claude Code with maintainer direction

**Goal:** P5-30 phase 1: the spell emits each creature's harmony fields (D-043).

**Done:** Phase 0 was committed and pushed with the D-043 spec (41620bf, e7f47f6) after the maintainer's "so much richer and coherent!". Phase 1 is done.

**Changed:**
1. `src/oracle.lol` emits six fields:
   - `harmony_turn` (`MOD … 353 AN 4`)
   - `harmony_swap` (`… 359 AN 16`)
   - `harmony_borrow` (`… 367 AN 4`)
   - `harmony_cadence` (`… 373 AN 4`)
   - `harmony_pace` (`… 379 AN 3`)
   - `harmony_character` (`… 383 AN 12`, to be used modulo the borrowable genres, so D-041's new genres fit)
2. `src/score.mjs` validates them as `harmonyTurn` … `harmonyCharacter`. The vitrine's default score gains zeros.
3. Tests: `tests/oracle.test.mjs` checks the ranges, and that every value is reached over 200 phrases.

**Verified:**
- 146/146 Node checks.
- Across 500 phrases, no existing score field changed.
- On 500 phrases, turn × cadence looked linked (z = 4.1). Over 20,000 seeds every pair of new fields is independent (|z| ≤ 2.5, turn × cadence 0.4), so it was chance and the divisors stay.
- The browser summons normally.

**Not verified:** Nothing audible yet; nothing reads the fields.

**Next session should start with:** P5-30 phase 2, Inform 7 "permits" sentences and the conductor's variation moves. The golden fixture keeps guarding "as written", and a second fixture freezes the varied spines.

### Session 53: 2026-10-20: the band agrees with its chords (P5-30 phase 0, D-043)

**Contributor:** Claude Code with maintainer direction

**Goal:** The maintainer was "tired of hearing the same exact chord progression. They often clash." Specify per-creature rulebooks (D-043), then fix the clashes first.

**Done:**
- P5-28 phase 5 was pushed (165f705).
- D-043 was accepted with the recommendations and committed (41620bf, not pushed). The fresh-creature default waits for phase 3.
- P5-30 phase 0 is done.

**Changed (`src/conductor.mjs`):**
1. `chordOvertones()`: chimes ring only overtones on the chord, a ninth chord's 9th, or the genre's melody colours (so Ragtime's sixth still rings). The unison is the fallback.
2. `avoidNoteResolution()`: after any melody method, a pitch a semitone above a chord tone it is not part of resolves down onto that tone.
3. `buildTriad()` takes third, fifth, seventh, and ninth from the chord's own tones, so the organ and choir voice what the rulebook wrote. The defaults are corrected: dom7alt and Lydian get major thirds, and dim gets ♭5 and 𝄫7. An open fifth lends its suspended tone to the third.
4. `walkTone()`: walks written to 3/4, 6–8, or 10/11 land on the chord's own third, fifth, or seventh. Other walk tones are passing tones.
5. Tests:
   - new `tests/clashes.test.mjs`: per-genre ceilings over 60 phrases, plus unit checks;
   - `tests/inform.test.mjs` cross-checks updated to the new rules;
   - the golden fixture re-frozen with `--rewrite`.

**Verified:**
- 145/145 Node checks.
- Golden fixture diff: genres, colours, progressions, and spines are unchanged. Chord entries changed only for dom7alt, dim, lydian, phrygian, and modal open, each member now one of the chord's own tones. Projection and ensembles changed as intended (chimes, melody, and the Palestrina bass, which follows the melody).
- Share of steps with a clash outside the chord, in Node over 80 phrases:

| Genre | Before | After |
| --- | --- | --- |
| Victorian Tonnetz | 29% | 5% |
| Delta Blues | 46% | 30% (blue notes, by design) |
| Smoky Jazz | 33% | 3% |
| Palestrina | 20% | 5% |
| Mystic Drone | 7% | 0% |
| Parlor Ragtime | 6% | 0% |

- Exported MIDI in the browser (any semitone between parts, chord-internal 7ths included): Victorian 0.54 → 0.12, Ragtime 0.32 → 0.20, Jazz 0.60 → 0.47, Blues 0.68 → 0.47.

**Verified by ear:** the maintainer listened across genres: "it sounds so much richer and coherent!"

**Next session should start with:** P5-30 phase 1 (the spell's `harmony_*` fields).

### Session 52: 2026-10-20: voices in the exports (P5-28 complete)

**Contributor:** Claude Code with maintainer direction

**Goal:** P5-28 phase 5: exports carry the voices (D-040).

**Done:** Phase 4 was committed and pushed (b92ee0c). P5-28 is complete (all five phases).

**Changed:**
1. `src/midi.mjs`: `FUN_VOICE_CHANNELS` is 1, 6, 7, 8, 10, 11, 12, and 13, none of them used by another part. `funVoiceTracks(base, events)` splits the MANUAL part into one track per voice, in order of first appearance, named "MANUAL · FUN MACHINE · <voice>" with that voice's program. A part with no notes stays one stock track.
2. `src/app.mjs`:
   - `logNote()` takes an optional voice. The three Fun Machine synths log `midiVoiceOf(voice)`, which names the creature's voice as "THE CREATURE'S OWN (HARMONIUM · BRIGHTER · NARROW)".
   - `exportSpecimenMidi()` expands the MANUAL part with `funVoiceTracks()`. Velocity now scales within each voice track.
3. D-040 item 6, as built: one track and channel per voice rather than program changes on one track. Stacked layers sound at the same moment, and a channel holds one program.

**Verified:**
- 142/142 Node checks.
- In the browser on "three pigeons in a borrowed coat" at full tempo: a loop recorded in MUSIC BOX with a HARMONIUM overdub exported MIDI with "MANUAL · FUN MACHINE · MUSIC BOX" (channel 1, program 10) and "MANUAL · FUN MACHINE · HARMONIUM" (channel 6, program 20).
- The MIDI log comes from the same scheduler calls that render WAV and stems, so those carry each layer's voice.

**Not verified:** DAW import of multi-voice MIDI, and listening to stacked voices in an exported WAV.

**Next session should start with:** the maintainer's listen, then D-041 wave 1 (more genres, which also brings the rulebook-suggested voice), P4-02, or P6-01.

### Session 51: 2026-10-20: voices travel with takes and sessions (P5-28 phase 4)

**Contributor:** Claude Code with maintainer direction

**Goal:** P5-28 phase 4: per-slot voices and sessions v5 (D-040).

**Done:** P5-28 phase 3 was committed and pushed (c9580a2). Phase 4 is done.

**Changed:**
1. `src/looper.mjs`: slots are `{ key, style, voice }`. `SLOT_VOICES` is `creature` plus the seven presets. `makeSlot()` defaults to VELVET PAD, and `validateSong(raw, path, { legacy })` reads v4 slots as VELVET PAD.
2. `src/session.mjs`: `SESSION_VERSION` is 5. `funMachine` is `{ style, voice }`. A v4 song is read as legacy, and versions 1–4 open with the Fun Machine in VELVET PAD.
3. `src/app.mjs`:
   - The live slot records `funVoiceId`. `playSongLayers()` plays each layer with `voicePatch(slot.voice)` through a new `patch` option on `playPerformanceStep()`, and `sameSlot()` compares voices.
   - Sessions save `funMachine.voice`, and `applySession()` and `syncSessionControls()` restore it.
4. D-040 item 5 amended: a creature-voice take stores `creature`, which the saved phrase reproduces exactly.
5. Tests: the slot-voice model, v5 and v4 session paths, and static checks for per-layer playback and recording.

**Verified:**
- 141/141 Node checks.
- In the browser on "three pigeons in a borrowed coat":
  - Recording a loop in MUSIC BOX and then switching to HARMONIUM saved a v5 file with `funMachine.voice` "harmonium" and all twelve slots "5/progression/music_box".
  - Loading it back with the voice edited to ÆTHER CHOIR pressed that chip.
  - The same file downgraded to v4 opened with VELVET PAD pressed.
- No console errors.

**Not verified:** Hearing layers in different voices together. Phase 5 (exports) still renders through the same `playSongLayers()`, so WAV and stems should already carry the slot voices; MIDI program changes are still to do.

**Next session should start with:** P5-28 phase 5: a MIDI program change whenever the Fun Machine track's voice changes, and a check that the exports carry each layer's voice.

### Session 50: 2026-10-20: the creature's own voice (P5-28 phase 3)

**Contributor:** Claude Code with maintainer direction

**Goal:** P5-28 phase 3: each phrase chooses its Fun Machine voice deterministically (D-040).

**Done:** P5-28 phase 2 and D-042 were committed separately and pushed (637550b, 9a17a59) after the maintainer's "Much better." Phase 3 is done.

**Changed:**
1. `src/oracle.lol` emits `fun_voice` (`MOD … 337 AN 7`), `fun_bright` (`DIFF OF MOD … 347 AN 7 AN 3`, so −3..3), and `fun_spread` (`MOD … 349 AN 5`). `src/score.mjs` validates them as `funVoice`, `funBright`, and `funSpread`. The vitrine's default score gains neutral values.
2. `src/voices.mjs`:
   - `creatureVoice(score)` clones the chosen preset, scales its filters by 2^(bright/6) and its detune, width, and chorus depth by 0.6 + 0.2 × spread (both clamped to the validator's bounds), leaves formants alone, and validates the result.
   - `creatureVoiceLabel()` gives a reading like "HARMONIUM · BRIGHTER · NARROW".
3. `index.html` and `src/app.mjs`: THE CREATURE'S OWN chip comes first and is pressed by default. `currentFunVoice()` caches the creature voice per seed. `showCreatureVoice()` puts the chosen voice in the chip's tooltip on every summon, and the chip's telemetry names it.

**Verified:**
- 139/139 Node checks.
- Across 500 phrases, no existing score field changed. The new fields spread evenly: each voice is 61–89 creatures, each tilt 61–86, each spread 92–113.
- In the browser, "three pigeons in a borrowed coat" reads HARMONIUM · BRIGHTER · NARROW both times it was summoned, and "the moth reads braille" reads MUSIC BOX · BRIGHT · NARROWEST.
- A held key played the creature voice with no console errors.

**Not verified:** How the tilted and spread extremes sound (DARKEST, BRIGHTEST, NARROWEST, WIDEST).

**Next session should start with:** P5-28 phase 4: per-slot voices in the loop machine, and sessions v5 with `funMachine.voice`. Files from v1–v4 open with VELVET PAD.

### Session 49: 2026-10-20: the lead, organ, chimes, and mycelium come out from under the filter

**Contributor:** Claude Code with maintainer direction

**Goal:** The maintainer reported:
- the LOLCODE lead and mycelium always sounded muffled;
- the mycelium sounded alike across phrases;
- the Befunge organ was inaudible although its meter moved;
- the chimes were far too quiet.

**Done:** D-042 (incidental fixes; no roadmap ID).

**Changed:**
1. `src/ensemble.mjs`:
   - Only the lead passes through the creature filter. Organ, chimes, and mycelium go straight to the compressor and delay.
   - `creatureFilter()` (about 2.0–5.2 kHz, Q 0.9–3.4) is shared with the live sweep in `updateAudioInteraction()`.
   - Lowpass creatures get a 0.3 dry lead tap.
   - `leadOctaveShift()` and `LEAD_FLOOR` (48).
   - Voicing trims: organ +4 dB, chimes +6 dB, mycelium +4 dB.
2. `src/app.mjs`:
   - The lead is raised by `leadOctaveShift()` (MIDI exports included). Its primary voice uses the creature's waveform, sawtooth included, and its stacks mix in saw and square.
   - `scheduleFungalBioStep()` plays `myceliumEvents()`.
3. New `src/mycelium.mjs`: eight per-form sounds (spikes, drops, puffs, patterns), shaped by hyphae, spores, and bloom. It joins the import map. Tests: `tests/mycelium.test.mjs` and updated routing tests.

**Verified:** 138/138 Node checks. Exported stems in the browser, measured by octave bands:
- **Organ:** −60 → −31 dB on a bandpass creature, and about −38 → −33 dB on lowpass ones.
- **Chimes:** −52 → −26 dB and −33 → −25 dB.
- **Bass:** unchanged at about −35 dB.
- **Lead:** centroid up 30–130%, its share of 1–8 kHz up 2–6 dB, and about 1–2 dB louder.
- **Mycelium:** the spread between phrases rose from 1.6 to 6.9 dB, with centroids from 384 Hz (CUP PEZIZA) to 3.4 kHz (BIOLUMINESCENT BONNET).
- **Live:** playback ran with no console errors.

**Not verified:** The maintainer's listen, especially organ and chime balance against the lead, and whether any fungus form grates.

**Verified by ear:** the maintainer: "Much better." P5-28 phase 2 and D-042 were committed separately.

**Next session should start with:** P5-28 phase 3.
