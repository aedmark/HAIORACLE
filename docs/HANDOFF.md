# Session Handoff

Read this first when resuming work. Protocol: [AGENTS.md](../AGENTS.md). Plan: [ROADMAP.md](../ROADMAP.md). Architecture: [ARCHITECTURE.md](ARCHITECTURE.md). Decisions: [DECISIONS.md](DECISIONS.md). Tests: [TESTING.md](TESTING.md).

## Current state

_Last updated: 2026-10-20, session 32, on `main`: the Kapellmeister menu, title, and motto come from the Inform 7 rulebooks, and the Perform wing no longer reflows when its text changes (P5-23 phase 4, D-033); session 31 moved the conductor onto the rulebooks; session 30 wrote the rulebooks; session 29 froze the migration contract; session 28: per-phrase arrangements keep at least five band voices (D-032) and the transport no longer rearranges the page once per loop; session 27 gave each phrase its own INTERCAL arrangement (D-031), and section and harmony readouts no longer reflow the layout; session 26 made the conductor's registers decide the arrangement, which the transport, console, MIDI markers, and stem README display (D-030); session 25 reworked the Fun Machine is reworked into a one-finger accompanist the band follows (D-029); session 24 added the INTERCAL 1972 Grand Ensemble Conductor (`src/conductor.i`, `src/intercal.mjs`) overcomes the continuous wall of sound with dynamic arrangement breathing across Exposition, Antiphony, Tutti, and Breakdown, and the Esoteric Fun Machine is overhauled into a warm, lush analog synth pad lead with real-time ensemble accompaniment modulation (P5-22, D-028)._

**Where things stand:** P1, P2, P3-01 through P3-03, P4-01, P5-01 through P5-22 are implemented and verified. The ensemble features an INTERCAL 1972 Grand Conductor (`src/conductor.i`, `src/intercal.mjs`, P5-22, D-028) that overcomes the "wall of sound" by executing a canonical 35-statement INTERCAL score with 22.9% politeness checking (ICL079/ICL099) that reads each creature's arrangement word with `WRITE IN` and chooses its form per phrase with at least five band voices on every step (D-031, D-032), channel registers that the program itself sets across four regions (Exposition groove, Antiphonal conversation, Tutti climax, Breakdown), and `COME FROM (60)` turnaround cadence interception at step 11 (D-030). The transport names the current section, rested console strips light TACET, and MIDI exports carry section markers. The Esoteric Fun Machine (`#fun-machine-engine`, P5-17, P5-22, D-029) is a one-finger accompanist: a held key plays a SWELL, ARPEGGIO, or PROGRESSION on the band's step grid through a voice-led stereo pad, a soft arpeggio pluck, and a gliding lead, while the band is re-conducted onto that chord in the correct key and the LOLCODE lead and drones step back by 10 dB. A master transport with `Space`/`Esc` (P5-18), an eight-channel mixer with VU meters in a graph shared by live and offline audio (P5-19), nine-stem ZIP and Type 1 MIDI export (P5-21), and a Session Ledger with on-device presets and validated `.fun` files (P5-20) complete the workstation wings.

**Verified** (2026-10-20, session 32, local Linux environment)

| Suite | Result |
| --- | --- |
| `node --test tests/*.test.mjs` | **101/101 behavioral and structural checks passed** |
| `python3 tools/check_docs.py` | **0 errors, 0 warnings across 14 documents** |
| `python3 tools/manual.py check docs/manual.json` | **6 sections, 34 entries, 0 errors, 0 warnings** |

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

**Not verified**

- Dedicated assistive-technology and screen-reader testing remains P4-02 work.
- No public hosting or domain exists.
- Session presets have not been checked in a real private window or against a full storage quota. The blocked-storage path was simulated by making `localStorage` throw.
- No DAW import has been tried: stems and MIDI were validated by independent parsers (Python `zipfile`, `unzip -t`, an in-page SMF reader), not by opening them in a DAW.
- Nobody has listened to the mixer yet: hard-pan feel, the fader taper, and meter ballistics were checked by numbers, not by ear.
- The four-wing layout was checked in the built-in browser by measurement and screenshots, not by the maintainer's own hands-on review, and not in Safari or Firefox.
- Nobody has listened to the transport changes yet. Pause/resume, the output fade, and WAV parity were checked structurally and in a live browser by state readouts and PCM statistics, not by ear.

**Gotchas**

- Serve the directory over HTTP. A direct `file:` URL cannot fetch `src/oracle.lol`, `src/beat.mal`, `src/bass.bf`, `src/harmony.bfg`, `src/pad.piet`, `src/chimes.frac`, or `src/chant.spl`.
- The interpreter deliberately implements a subset. Read D-002 before extending the spell.
- Changes to hash, normalization, formula constants, scale, or name tables can break phrase identity. D-005 through D-007, D-013, D-014, and D-016 record intentional pre-release compatibility breaks.

## Next steps

1. Listening pass on the Fun Machine accompanist (D-029): pad warmth and level against the band, arpeggio density at fast tempos, the lead line's glide, and whether a 10 dB lead duck is the right amount.
2. Optional: on bandpass creatures (voices 1 and 5) the organ, chimes, and mycelium remain heavily filtered (pigeons organ −73.9 dB solo). The lead and choir are fixed (D-024 points 7–8).
3. Exports render one 12-step loop, but rhythm patterns 2 and 3 have five cells, so their WAV, stems, and MIDI do not tile seamlessly (the live loop is unaffected). A 60-step render, or rounding those patterns to 12, would fix it; either is a determinism-adjacent choice for the maintainer.
4. Hands-on review of the four-wing layout (D-027) in Safari and Firefox; the maintainer approved it from the Chromium review. A sticky transport rail was deferred; it needs the cabinet's `overflow: hidden` changed to `overflow: clip`.
5. Complete P4-02 with keyboard, reduced-motion, contrast, and screen-reader checks.
6. Choose public hosting and domain (Q-001 / P6-01).

## Open questions

- Q-001 blocks P6-01: choose public hosting and domain.

## Session log

### Session 32: 2026-10-20: Inform 7 rulebooks, phase 4

**Contributor:** Claude Code with maintainer direction

**Goal:** P5-23 phase 4: build the Kapellmeister menu, title, and description from the rulebooks; update the manual, README, architecture, and map (D-033).

**Done:** P5-23 phase 4.

**Changed:**
1. `index.html`: the genre `<select>` starts empty and disabled, the title reads "READING THE RULEBOOKS…", and a new `#kapellmeister-genre-motto` line shows each genre's motto (the mottos were never shown before).
2. `src/app.mjs`: `buildGenreMenu()` fills the menu from `genreCodes()`/`genreBook()` after install (option text = title, tooltip = motto); `updateKapellmeisterUI()` sets the title and motto, and the telemetry names the genre by its Inform 7 name.
3. `styles.css`: changing text reflowed the Perform wing in more places than the transport. The Kapellmeister header is now a fixed grid (title reserves two lines, stacks at 760 px or less; telemetry one fixed line); the Fun Machine heading reserves two lines; the Fun Machine telemetry takes its own line with two reserved lines (three at 480 px or less); the sequencer uses `minmax(0, 1fr)` columns with fixed cell line boxes; plate labels keep fixed line boxes. ♭ and ♯ fall back to a taller font, which had been changing heights by 2 px.
4. `docs/manual.json`: new `inform-rulebooks` entry (34 entries); stale spine-builder text in the Kapellmeister entry replaced. README, ARCHITECTURE, CHANGELOG updated.

**Verified:** 101/101 Node checks, including new static assertions for the generated menu and the fixed boxes. In the browser, every wing and the page kept one height across all six genres at every 20 px from 320 to 1720. With the loop playing at 208 BPM, switching genres and styles and holding keys kept one layout at 340, 400, 560, 720, 1000, and 1440 px with no clipped title or telemetry. There was no horizontal overflow from 320 to 800 px.

**Not verified:** Safari/Firefox rendering of `line-clamp` and `contain: inline-size` (evergreen support is documented, not observed here).

**Left undone:** P5-23 phase 5 (fixture-only seventh genre); listening pass; P4-02; P6-01.

**Next session should start with:** P5-23 phase 5.

### Session 31: 2026-10-20: Inform 7 rulebooks, phase 3

**Contributor:** Claude Code with maintainer direction

**Goal:** P5-23 phase 3: move the conductor onto the compiled Inform 7 rulebooks and delete its genre tables (D-033).

**Done:** P5-23 phase 3.

**Changed:**
1. `src/conductor.mjs` (−387/+100 lines): `GENRE_RULEBOOKS`, `GENRE_NAMES`, `GENRE_DESCRIPTIONS`, the four fixed spine builders, `TONNETZ_PATHS`, and the five chime-ratio tables are gone. `installRulebooks()`, `rulebooksInstalled()`, `genreCodes()`, and `genreBook()` replace them. Colours, progressions, spines, melody snapping, bass, organ, and overtones read the compiled data, and an unknown code falls back to the first genre. The Euler sieve, Tonnetz walk, contrary motion, and cell choosing stay in JavaScript.
2. `src/app.mjs`: fetches `src/rulebooks.ni` with the other sources and installs it. Only then does it pick the menu genre, label the Fun Machine keys, and render presets. The manual stays silent until the rulebooks load. A compile error shows "KAPELLMEISTER RULEBOOKS REJECTED".
3. `src/session.mjs`: validates genres against `genreCodes()`. `parsePresetStore()` throws before installation instead of silently dropping every preset.
4. Tests: `tests/install-rulebooks.mjs` installs the rulebooks for any test using genres; tests use genre codes; static checks pin the load order.

**Verified:** 101/101 Node checks, with `tests/fixtures/rulebooks-golden.json` unchanged (`git diff` empty). In the browser, a first version crashed at module start because the key labels asked for a genre before the rulebooks loaded; that is fixed. A fresh tab now restores an omen link with no console errors. Switching all six genres updates the title, harmony readout, and key colours, and Raw Chaos shows RAW.

**Not verified:** Listening (the fixture says the music is bit-identical).

**Left undone:** P5-23 phase 4 (menu built from the rulebooks; manual, README, map) and phase 5 (fixture-only seventh genre); listening pass; P4-02; P6-01.

**Next session should start with:** P5-23 phase 4.

### Session 30: 2026-10-20: Inform 7 rulebooks, phase 2

**Contributor:** Claude Code with maintainer direction

**Goal:** P5-23 phase 2: the Inform 7 subset interpreter and the canonical rulebooks file (D-033).

**Done:** P5-23 phase 2.

**Changed:**
1. `src/rulebooks.ni`: all six genres in the Inform 7 subset. It holds kinds (genre, chord quality, chord member, Tonnetz move, spine/melody/bass method), either/or adjectives (fettered/unfettered, patient/insistent, triadic/voiced), colouring, progression, and melody tone rulebooks, and tables of changes, Tonnetz walks, Fun Machine progressions (with `[root]` substitutions), and chime overtones.
2. `src/inform.mjs`: `readStory()` parses the subset and rejects anything else with a line number; `followRulebook()` applies source-order, first-match rules; `compileRulebooks()` follows every rulebook over its whole domain (12 intervals, strictness 1–14) and returns frozen, validated genre data.
3. `tests/inform.test.mjs`: tests every subset construct, rejections and compile errors, and cross-checks every compiled value against today's `conductor.mjs`.
4. `tests/rulebook-capture.mjs` v2: the slider runs 3–14, so the capture now covers strictness 1–14 (ensembles at 3, 8, 14). The fixture was rewritten with `--rewrite` before anything in `src/` changed, so it still records pre-migration behaviour.

**Verified:** 101/101 Node checks. Changing one Smoky Jazz bass-walk note and one jazz overtone in the `.ni` file failed the cross-check; restoring it passed.

**Not verified:** Nothing in the browser yet. The app does not load `src/rulebooks.ni` until phase 3.

**Left undone:** P5-23 phases 3–5; listening pass on the fuller forms; P4-02; P6-01.

**Next session should start with:** P5-23 phase 3: have `conductor.mjs` read `compileRulebooks()` output, delete its genre tables and switches, fetch `src/rulebooks.ni` in the app, and keep `tests/rulebooks.test.mjs` passing unchanged.

### Session 29: 2026-10-20: Inform 7 rulebooks, phase 1

**Contributor:** Claude Code with maintainer direction

**Goal:** The maintainer accepted D-033: the Kapellmeister genre rulebooks move into an Inform 7 subset. Raw Chaos stays a rulebook, and a seventh playable genre is a follow-up. They asked to start phase 1, freezing today's behaviour.

**Done:** D-033 accepted; P5-23 phase 1.

**Changed:**
1. `tests/rulebook-capture.mjs`: captures every genre decision through the conductor's public functions. That covers chord colours (every quality; both tonics for auto), progressions, spines over six phrases and four mutations, melody projection over 48 pitches × 12 strictness × passing, and the conducted ensemble for six phrases × six genres × three strictness levels, with and without a punched spine. Chords are interned; progression steps are stored as tuples whose structural fields are checked rather than stored.
2. `tests/fixtures/rulebooks-golden.json` (618 KB, one entry per line), written by `tools/freeze_rulebooks.mjs`, which refuses to overwrite it without `--rewrite`.
3. `tests/rulebooks.test.mjs`: coverage check and exact-match guard with a line diff on failure.

**Verified:** 91/91 Node checks. Changing one Smoky Jazz colour rule (`{0, 5}` to `{0}`) failed the guard with the two differing lines shown; reverting it passed.

**Left undone:** P5-23 phases 2–5 (interpreter and `src/rulebooks.ni`, migration, surfaced menu, fixture-only seventh genre); listening pass on the fuller forms; P4-02; P6-01.

**Next session should start with:** P5-23 phase 2, `src/inform.mjs` and `src/rulebooks.ni`, using the subset table in D-033.

### Session 28: 2026-10-20: a fuller floor and a still transport

**Contributor:** Claude Code with maintainer direction

**Goal:** Maintainer listening pass: "Everything sounds pretty great. Some arrangements definitely do sound thin." The Perform wing still rearranged once per loop.

**Done:** D-032 (replaces D-031's guardrails).

**Changed:**
1. `src/conductor.i`: 35 statements, 8 polite (22.9%). Every step keeps at least five of the seven band voices. Lead, pulse, and bass always open; pulse and bass hold through the antiphony; lead and organ both carry the breakdown over the bass or the choir. The seven choices left: organ and choir in the exposition, lead or organ answering the choir, chimes breathing in the antiphony, bass or choir under the breakdown, the choir joining the turnaround, and the turnaround's start step. That gives 120 distinct forms across 400 sample phrases.
2. `styles.css`: `#transport-section` gets `contain: inline-size`. Its text had been widening `.transport-keys` from about 980 px up, and on windows of about 1440 px or wider the long section IV label pushed the volume controls onto a new line once per loop. Session 27 had measured only at 314 and 1280 px, where this never happened.

**Verified:** 89/89 Node checks; the property suite now asserts the five-voice floor on every step of 160 phrases. Wing-1 geometry stayed identical for every section label and every long harmony readout at 15 widths from 360 to 1920 px. Live playback at 1500 px and 208 BPM kept one layout across all 12 steps.

**Not verified:** Listening to the fuller forms.

**Left undone:** P4-02; P6-01.

**Next session should start with:** a listening pass on a few phrases to confirm no form sounds thin, then P5-23 (Inform 7 rulebooks, D-033), whose phase 1 golden fixture is the next step.

### Session 27: 2026-10-20: every phrase gets its own form

**Contributor:** Claude Code with maintainer direction

**Goal:** Maintainer: "the arrangements should vary per phrase", and the transport's section text was re-wrapping and rearranging the layout as its length changed.

**Done:** D-031 (supersedes D-030's "same form for every creature").

**Changed:**
1. `src/intercal.mjs`: the VM gains `WRITE IN` (input queue; `ICL562` when exhausted), select `~` and mingle `$` in assignments, and the `ICL275` onespot overflow check. `arrangementWordFor(score)` mixes the seed into a 16-bit word; `composeArrangement(source, score)` feeds the word and its complement and lets the turnaround run from step 10 or 11 to the loop's end.
2. `src/conductor.i`: 37 statements, 8 polite (21.6%). Nine `~` choices per phrase within guardrails: lead and pulse open; the choir sings the antiphony answered by lead or organ, never both; the third section is always tutti; the breakdown drops the pulse and keeps exactly one of lead and organ; pulse, bass, and lead come home on the turnaround, whose start step `#3 $ .7` mingles to 10 or 11.
3. `styles.css`: `#transport-section` sits on its own fixed-height, non-wrapping line; Kapellmeister readout values always reserve two lines (the per-step "G = 9 (Dissonant)" wrap was shifting the Perform wing by 18 px).
4. Tests: per-phrase property suite over 160 phrases (determinism, guardrails, ≥60 distinct forms), program-edit and rejection cases, WRITE IN and mingle checks, a layout-stability style assertion.

**Verified:** 89/89 Node checks; 272 distinct forms across 400 sample phrases. In the browser, "three pigeons in a borrowed coat" played its own form (bass waits in I; lead and choir hush in the breakdown; COME FROM from step 11 of 12, counting from 1). During a full loop, the transport stayed 263 px at 314 px width and page height held constant at 1280 px; at 314 px only the footer status changed, once, on play.

**Not verified:** Listening across many phrases; whether forms where the beat steps out of the antiphony feel too thin.

**Left undone:** Listening pass on the accompanist and the new forms; P4-02; P6-01.

**Next session should start with:** a listening pass across a handful of phrases.

### Session 26: 2026-10-20: the conductor reaches the whole workstation

**Contributor:** Claude Code with maintainer direction

**Goal:** Audit whether the INTERCAL conductor (P5-22, D-028) was tied into the transport, mixer, exports, sessions, and accompanist, and tie the gaps together.

**Done:** D-030 (refines D-028's arrangement mechanics).

**Audit findings:**
1. Already tied: `scheduleEnsembleStep()` gates both the live loop and `renderEnsembleLoop()`, so WAV, stems, MIDI capture, and the VU meters all followed the masks. Sessions needed nothing (the arrangement derives from the score and the stored rulebook).
2. Gap: `composeArrangement()` hard-coded its four masks and only read the politeness ratio from the VM. Run literally, `src/conductor.i` would have kept the beat playing in the breakdown, and its `PLEASE IGNORE :1` froze the lead rather than resting it.
3. Gap: nothing showed the arrangement. `INTERCAL_SECTION_NAMES` was imported and unused, and a soloed choir went silent in the Exposition with no explanation.
4. Gap: the MIDI file and stem bundle carried no section information. The `fun` mask field was never read.

**Changed:**
1. `src/intercal.mjs`: the VM records a register snapshot at each onespot assignment; `composeArrangement(source)` builds every mask from those snapshots and rejects malformed form; new `arrangementSectionAt()`.
2. `src/conductor.i`: rewritten to the calling convention. It produces the same masks as before (27 statements, 22.2% politeness); `PLEASE IGNORE :8` makes the breakdown's `DO :8 <- #0` a no-op so the player is never rested, and `COME FROM (60)` skips the lead's exit.
3. `src/app.mjs`: `activeArrangement()` and `arrangementPlays()`; the transport shows the section; console strips light TACET while rested; the player's part consults register `:8`; MIDI export writes Marker events and the stem README maps sections to seconds. `src/midi.mjs`: `buildMidiFile({ markers })`.
4. `index.html`, `styles.css`: `#transport-section` and the TACET badge.

**Verified:** 89/89 Node checks, including program-driven arrangement, rejection, and MIDI marker tests. In the browser on "three pigeons", the transport walked I → IV with COME FROM on step 12; TACET lit harmony and choir in I, the lead in II, nothing in III, and beat and bass in IV until the turnaround; Raw Chaos shows UNFETTERED; the exported MIDI held all five markers.

**Not verified:** Listening (the masks are unchanged, so the sound should be identical); DAW display of the markers.

**Left undone:** Listening pass on the accompanist; P4-02; P6-01.

**Next session should start with:** a listening pass on the accompanist.

### Session 25: 2026-10-20: the one-finger accompanist

**Contributor:** Claude Code with maintainer direction

**Goal:** Rework the Fun Machine so a held key plays a synth pad chord, arpeggio, or progression in the band's rhythm, with the band following "a composer playing the lead melody" rather than sounding like an organ. Maintainer choices: three style chips; the LOLCODE lead steps back.

**Done:** D-029 (supersedes the Fun Machine voice in D-028 and parts of D-020).

**Changed:**
1. `src/accompaniment.mjs` (new): styles, `buildPerformance()`, voice-led `padVoicing()`, `arpeggioNotes()`, `leadMidi()`, `stepsToRegionBoundary()`, `toTonicRelative()`.
2. `src/app.mjs`: `schedulePadChord()`, `scheduleArpNote()`, `scheduleFunLeadNote()`, and `releaseFunPads()` replace the organ voices; `triggerFunKey()` builds a performance, re-conducts the band, and bridges a pad to the next region; the scheduler plays pads, arpeggios, and lead notes on the step grid; the LOLCODE lead and drones duck while a key is held; the mode switch and quality chips are replaced by style chips; the conductor receives tonic-relative chords; sequencer labels name generated steps in absolute pitch.
3. `src/ensemble.mjs`: the Fun Machine strip feeds the delay and chamber reverb. `src/midi.mjs`: the MANUAL track uses GM Warm Pad. `src/session.mjs`: session format v2 (`funMachine.style`) with a v1 upgrade path.
4. `index.html`, `styles.css`: style chips and hint.

**Verified:** 87/87 Node checks, including the new accompanist suite and a v1→v2 session upgrade test. In the browser, holding G in PROGRESSION on "the moon owes me five dollars" (E♭ tonic) conducted the band through G min → E♭ → C min → D; SWELL held G min; before the fix the same key conducted B♭ min. The lead meter fell about 13 dB in fill while held and recovered on release. The Fun Machine meter showed the accompanist in all three styles, and switching style mid-hold worked. No console errors.

**Not verified:** Listening. Nobody has heard the new pad, arpeggio, or lead.

**Problems:** This session's work landed in the same working tree as session 24's uncommitted INTERCAL and pad-overhaul edits; the pad overhaul is superseded, and the INTERCAL work is untouched.

**Left undone:** Listening pass; P4-02; P6-01.

**Next session should start with:** a listening pass on the accompanist.

### Session 24: 2026-10-20: INTERCAL 1972 conductor and Fun Machine synth pad overhaul

**Contributor:** Antigravity with maintainer direction

**Goal:** Overcome the ensemble's continuous wall of sound by introducing INTERCAL 1972 as master arrangement conductor (`src/conductor.i`, `src/intercal.mjs`), and overhaul the Esoteric Fun Machine into a warm, lush analog synth pad lead with real-time band modulation (P5-22, D-028).

**Done:** P5-22, D-028 (maintainer direction: "INTERCAL it is. Let's overcome the wall of sound first. I have issues with the one-finger chord organ right now").

**Changed:**
1. `src/conductor.i`: Canonical 27-statement INTERCAL 1972 conductor score with 6 polite statements (22.2% politeness ratio), orchestrating dynamic section breathing across Exposition (groove foundation), Antiphony (chords/choir conversation while lead breathes), Tutti (full apotheosis), and Breakdown with `(100) PLEASE COME FROM (60)` loop turnaround cadence interception at step 11.
2. `src/intercal.mjs`: Dependency-free INTERCAL 1972 virtual machine and dynamic arrangement orchestrator. Enforces politeness bounds ($0.20 \le P \le 0.334$), executes 16-bit and 32-bit registers, bitwise mingle (`$`) and select (`~`), statement labels, `PLEASE IGNORE` and `PLEASE REMEMBER` channel masks, `COME FROM` flow interception, and `GIVE UP`.
3. `src/app.mjs`: Overhauled `scheduleFunMachineChord()`, `scheduleFunMachineLeadNote()`, `startFunMachineVoice()`, and `stopFunMachineVoice()` into a warm, lush analog synth pad lead (dual detuned triangle/saw waves, sine sub-bass foundation, slow 0.35 Hz chorus shimmer LFO, 920 Hz resonant lowpass filter with gentle 65ms attack swell and velvety release). Connected `triggerFunKey` to `applyEnsembleConductor(activeFunProgression.steps.map(s => s.chord))` so Brainfuck walking bass, Befunge chord organ, Piet chimes, Shakespeare choir, and LOLCODE lead immediately modulate to accompany the user's chords in real time. Eliminated duplicate lead note clash during `auto_chord` mode in `scheduleAhead()`. Applied INTERCAL arrangement masks in `scheduleEnsembleStep()` and `renderEnsembleLoop()`.
4. `AGENTS.md`, `ROADMAP.md` (P5-22), `docs/DECISIONS.md` (D-028), `docs/ARCHITECTURE.md`, `docs/CHANGELOG.md`, `docs/manual.json` and rebuilt `manual.html`.
5. `tests/oracle.test.mjs`, `tests/static.test.mjs`: Added unit tests for INTERCAL execution, politeness validation (`ICL079`/`ICL099`), `COME FROM` turnaround, dynamic arrangement masks, and Fun Machine real-time ensemble following (79/79 tests passing).

**Verified:** 79/79 Node tests passing; `python3 tools/check_docs.py` 0 errors, 0 warnings; `python3 tools/manual.py check docs/manual.json` 6 sections, 33 entries, 0 errors, 0 warnings.

### Session 23: 2026-10-19: the four-wing workstation

**Contributor:** Claude Code with maintainer direction

**Goal:** The design and layout pass after the DAW phase: group the controls into perform, mix, and keep, fix the six-button action column, the scattered DAW controls, and the tall preset field at phone width.

**Done:** D-027 (maintainer chose "DAW first, plates last" and no sticky transport for now).

**Changed:**
1. `index.html`: the reading strip keeps only the name and score card. Four `workstation-wing` sections, each with an `h2` drawer label: Perform (`#transport-deck` now holds restart, volume, and tempo; Fun Machine; Kapellmeister), Mix (Bandstand, mixer, parlor acoustics), Keep (Session Ledger, new `#export-engine` desk), The Band (Plates II–VI). No id was renamed or removed.
2. `styles.css`: parchment wing headers; the transport rail as a standalone console; volume and tempo side by side; the calling-slip input styling scoped to `#phrase` (it was leaking into the preset field, hence the 61 px phone height); `.beat-engine`, `.fun-machine-body`, and `.kapellmeister-body` use `minmax(0, 1fr)` columns and white keys may shrink, so nothing is clipped at 320 px; footer links wrap; a 2×2 transport grid below 480 px; the unused `.replay-button` and `.reading-actions` rules are gone.
3. `tests/static.test.mjs`: a new wing-order test; the mixer test title no longer claims the old placement.
4. DECISIONS (D-027, D-024 point 5 marked superseded), ARCHITECTURE, TESTING, CHANGELOG, `docs/manual.json` and the rebuilt `manual.html`.

**Verified:** 76/76 Node checks, docs and manual checks clean. Built-in browser at 1100, 768, 375, and 320 px: page `scrollWidth` equals the viewport and no element inside the cabinet extends past it except the intentional mixer rail. Before the change, the Kapellmeister select and readout (to 431 px at 375) and the footer links (to 835 px at 768) were silently clipped. Preset field 61 → 31 px tall at 375. Real `Tab`/`Shift+Tab` from the summon form reaches the transport, volume, and tempo before the Fun Machine. The DOM-order sweep of every focusable control runs header → form → Perform → Mix → Keep → Band → footer, with no positive `tabindex`. PLAY, STOP, and every export and share button still work after the move, and the console shows no errors.

**Not verified:** Maintainer review of the new look; Safari and Firefox; screen-reader pass over the new headings (P4-02).

**Left undone:** Sticky transport; P4-02, P6-01.

**Next session should start with:** a hands-on pass over the four wings in Safari and Firefox, or P4-02.

Older sessions: [archive/sessions.md](archive/sessions.md).
