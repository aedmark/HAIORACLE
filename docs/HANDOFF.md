# Session Handoff

Read this first when resuming work. Protocol: [AGENTS.md](../AGENTS.md). Plan: [ROADMAP.md](../ROADMAP.md). Architecture: [ARCHITECTURE.md](ARCHITECTURE.md). Decisions: [DECISIONS.md](DECISIONS.md). Tests: [TESTING.md](TESTING.md).

## Current state

_Last updated: 2026-10-20, session 44, on `main`: songs are saved with presets and `.fun` files (sessions v4, P5-26 phase 4); session 43 built the loop strip._

**Where things stand:** P1, P2, P3-01 through P3-03, P4-01, P5-01 through P5-25 and P5-27 are implemented and verified; P5-26 is designed. The ensemble features an INTERCAL 1972 Grand Conductor (`src/conductor.i`, `src/intercal.mjs`, P5-22, D-028) that overcomes the "wall of sound" by executing a canonical 35-statement INTERCAL score with 22.9% politeness checking (ICL079/ICL099) that reads each creature's arrangement word with `WRITE IN` and chooses its form per phrase with at least five band voices on every step (D-031, D-032), channel registers that the program itself sets across four regions (Exposition groove, Antiphonal conversation, Tutti climax, Breakdown), and `COME FROM (60)` turnaround cadence interception at step 11 (D-030). The transport names the current section, rested console strips light TACET, and MIDI exports carry section markers. The Esoteric Fun Machine (`#fun-machine-engine`, P5-17, P5-22, D-029) is a one-finger accompanist: a held key plays a SWELL, ARPEGGIO, or PROGRESSION on the band's step grid through a voice-led stereo pad, a soft arpeggio pluck, and a gliding lead, while the band is re-conducted onto that chord in the correct key and the LOLCODE lead and drones step back by 10 dB. A master transport with `Space`/`Esc` (P5-18), an eight-channel mixer with VU meters in a graph shared by live and offline audio (P5-19), nine-stem ZIP and Type 1 MIDI export (P5-21), and a Session Ledger with on-device presets and validated `.fun` files (P5-20) complete the workstation wings.

**Verified** (2026-10-20, session 39, local Linux environment)

| Suite | Result |
| --- | --- |
| `node --test tests/*.test.mjs` | **117/117 behavioral and structural checks passed** |
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

### Session 44: 2026-10-20: songs are saved (P5-26 phase 4)

**Contributor:** Claude Code with maintainer direction

**Goal:** P5-26 phase 4: sessions v4 carry the loop machine's song (D-039).

**Changed:**
1. `src/session.mjs`: `SESSION_VERSION` 4, which adds a required `song` validated by `validateSong()` (a `SongError` becomes a `SessionError` with the same field path). v1–v3 open with an empty song, and v3 or v4 share `funMachine: { style }`. The version is checked before the keys, because it decides which keys belong.
2. `src/app.mjs`: `captureSession()` stores the song; `applySession()` restores it, selects its last loop, resets the recorder, lets the band re-follow, and redraws the strip.
3. Tests: v4 samples carry a two-layer song; v3 opens with an empty song; song errors name `session.song…` paths; v1 and v2 samples drop the song. Docs: ARCHITECTURE and SECURITY trust rows, the manual's ledger entry, ROADMAP, CHANGELOG, and D-039 status.

**Verified:** 125/125 Node checks. In the browser, two recorded loops (the second at ×2) saved as a v4 preset. After CLEAR SONG and a page reload, loading the preset restored both tiles and the readout ("2 LOOPS · 3 PASSES"), and playback had the band following loop 1 (bass "G G G+ E♭~"). No console errors; the test preset was removed.

**Left undone:** P5-26 phase 5 (whole-song WAV, stem, and MIDI export, capped at 32 passes); the P4-02 screen-reader pass; P6-01.

**Next session should start with:** P5-26 phase 5.

### Session 43: 2026-10-20: the loop strip (P5-26 phase 3)

**Contributor:** Claude Code with maintainer direction

**Goal:** P5-26 phase 3: the full loop strip (D-039).

**Changed:**
1. `index.html` and `styles.css`: `#looper-tiles`, a sideways-scrolling row of fixed height (so adding or playing loops never moves the page). Each tile is one select button (`aria-pressed`, a spoken summary of layers and repeats); the playing tile gets `is-playing`. Below it, `#looper-edit` acts on the selected loop: repeats − / + (with a `×n` readout), ◀ EARLIER, LATER ▶, UNDO LAYER, and DELETE LOOP. Every edit button starts disabled.
2. `src/app.mjs`: `renderLooperTiles()` rebuilds only when the song or selection changes, so focus survives playback; the playing mark comes from `audiblePosition` at loop boundaries. `renderLooperEdit()` enables only what applies and locks move, undo, and delete while a take is armed or recording. `editSong()` applies an edit, keeps the selection valid (`clampSelection()`), lets the band re-follow, and announces the result or the reason for a refusal (8-repeat cap, 32-pass limit).
3. `src/looper.mjs`: `clampSelection()`, with a unit test; static checks cover the tiles, edit row, fixed height, and recording lock.

**Verified:** 124/124 Node checks. In the browser, three recordings made three tiles with the newest selected, and the playing mark walked loop 1 → 2. Loop 1 at ×3, moved later, undone (removed, as it had one layer), and a delete each landed with an announcement. Move and delete were disabled while armed; the page height stayed constant throughout; no console errors.

**Not verified:** Listening; keyboard-only and screen-reader use of the strip.

**Left undone:** P5-26 phase 4 (sessions v4) and phase 5 (song exports); the P4-02 screen-reader pass; P6-01.

**Next session should start with:** P5-26 phase 4, saving songs in sessions and presets.

### Session 42: 2026-10-20: the loop machine records and plays (P5-26 phase 2)

**Contributor:** Claude Code with maintainer direction

**Goal:** P5-26 phase 2: live recording and song playback in the transport (D-039).

**Changed:**
1. `src/app.mjs`: the scheduler now runs `advanceRecorder()` (one slot per step from the live key, the same moment the accompanist reads), then `followSong()` (a live key leads; otherwise the newest recorded layer holding a key re-conducts the band, only when the leader changes), then the band, then the live key and every recorded layer through the new `playPerformanceStep()`. Recorded pads use `releasable: false`, so a live key release no longer fades them. The LOLCODE lead and drones duck for a leading layer (`songLeading`). Arming starts playback; stop, pause, and restart cancel a take; empty takes are announced and discarded; a landed take opens the Keep drawer.
2. `index.html` and `styles.css`: the `#looper` strip under the keys, with RECORD NEW LOOP, OVERDUB, and CLEAR SONG (`aria-pressed` while armed or recording), a fixed-line readout, and `#looper-announcer`. `looper.mjs` joins the import map.
3. Tests: static checks for the strip, the conduct-before-play order, layer playback, and non-releasable recorded pads; the duck assertion includes `songLeading`.

**Verified:** 123/123 Node checks. In the browser on "three pigeons" at 208 BPM:
- RECORD NEW LOOP started the transport and recorded from step 1.
- Holding G landed "LOOP 1 ADDED TO THE SONG". With no key held, the band then followed the take (bass "G G G+ E♭~" against its own "A♭ A♭ A♭+ E~").
- An overdub holding D♯ landed "LAYER ADDED TO LOOP 1" and took the lead (bass "E♭ E♭ E♭+ C~").
- Stopping while armed said "RECORDING STOPPED · NOTHING WAS KEPT", and CLEAR SONG returned the band to its own score.
- No console errors. One bug was caught and fixed along the way: arming cancelled itself because cancellation sat in `stopCurrentSound()`, which `playScore()` also calls; it now runs only on stop, pause, or restart.

**Not verified:** Listening to stacked layers, especially two pads at once.

**Left undone:** P5-26 phases 3–5 (loop tiles with select, repeats, move, delete, and undo; sessions v4; song exports); the P4-02 screen-reader pass; P6-01.

**Next session should start with:** P5-26 phase 3, the full strip.

### Session 41: 2026-10-20: Raw Chaos unfettered; the loop machine designed

**Contributor:** Claude Code with maintainer direction

**Goal:** Maintainer: "I've never tested raw unfettered chaos so fix away, then let's design the loop machine."

**Done:** P5-27; D-039 (P5-26 design agreed, build pending).

**Changed:**
1. `src/app.mjs`: `applyEnsembleConductor()` passes no custom spine with no key held, so Raw Esoteric Chaos takes its unfettered path. A static test pins it.
2. The maintainer's own `index.html` copy edits, kept at their request: plates renumbered I–V, shorter stage labels, the Fun Machine telemetry line removed (every write to it is guarded). Static tests and the manual's plate titles follow the new numbers.
3. D-039 records the loop-machine design; ROADMAP gives P5-26 five phases with acceptance; CHANGELOG notes the Raw Chaos fix.

**Verified:** 117/117 Node checks; the golden fixture passes, so fettered genres are unchanged. In the browser, Raw Chaos plates show raw VM output (bass "RT RT OCT RT~ REST 4TH+ …" against Tonnetz "A♭ A♭ A♭+ E~ …"). Holding G conducted the band onto G and release returned it to raw, with no console errors.

**Loop machine design (D-039):** a song of up to 16 loops; each loop is one 12-step pass, ×1–×8 repeats, with up to 4 stacked takes of `{ key, style }` per step. Controls are RECORD NEW LOOP (appends at the next boundary) and OVERDUB (adds a layer to the selected loop). The band follows the newest layer holding a key, and a live key overrides. Chords are derived at playback, so songs re-harmonise with the rulebook. The strip sits under the Fun Machine keys; sessions become v4; exports render the whole song, capped at 32 passes.

**Not verified:** Listening to Raw Chaos.

**Phase 1 (same session):** `src/looper.mjs` is the pure model. It covers frozen songs, loops, and takes; append, overdub, undo-layer, delete, move, and repeat edits that return the same song when not allowed; the 16-loop, 4-layer, 1–8-repeat, and 32-pass limits; `songPosition()` through repeats and wrap-around; and `leadSlotAt()` (newest layer, live override). It also has the recorder state machine (arm new or overdub, start on the next boundary or on the target loop's pass, one pass, empty takes reported) and `validateSong()` for sessions v4. `tests/looper.test.mjs` has six tests; making the follow rule pick the oldest layer failed them. 123/123 Node checks. Not wired into the app yet (it is outside the import map until phase 2 imports it).

**Left undone:** P5-26 phases 2–5 (live recording and playback, the strip, sessions v4, song exports); the P4-02 screen-reader pass; P6-01.

**Next session should start with:** P5-26 phase 2, live recording and song playback in the transport.

### Session 40: 2026-10-20: the punch-in sequencer comes out

**Contributor:** Claude Code with maintainer direction

**Goal:** Maintainer: the 12-step loop progression was "fundamentally broken". It was meant to be a loop machine for recording a series of loops. They asked to remove it safely before building anything else, and to drop it from saved sessions while keeping old files openable.

**Done:** D-038 (P5-25).

**Changed:**
1. `index.html`: the REC and RESET PROGRESSION buttons and the 12-step grid are removed, and the telemetry text is updated.
2. `src/app.mjs`: sequencer state, rendering, step targeting, punch-in (in `triggerFunKey()` and the scheduler), `scheduleSequencedFunChord()` (live and offline), and session capture and restore of the progression are removed. `applyEnsembleConductor()` keeps passing an empty 12-step spine with no key held, so the band is unchanged. The discovery Keep trigger no longer watches the grid.
3. `src/session.mjs`: `SESSION_VERSION` 3, with `funMachine: { style }`. v1 and v2 still open; their progression is validated, then dropped.
4. `styles.css`: 16 sequencer rules (133 lines) removed.
5. Tests: session samples are v3; v2 files open with punched chords dropped and malformed ones still rejected; static checks assert the sequencer is gone.
6. Docs: D-038 (D-020 marked), ARCHITECTURE, manual, README, CHANGELOG (Removed), ROADMAP (P5-25 done, P5-26 loop machine, P5-26 Raw Chaos).

**Verified:** 117/117 Node checks. In the browser, there was no sequencer markup, and holding a key during play worked. A preset rewritten into the old v2 form with punched chords listed, loaded (status "PRESET LOADED", style ARPEGGIO), and re-saved as v3 with only the style. No console errors.

**Found:** the truthy empty spine means Raw Esoteric Chaos is still conducted in the live app (P5-27). It is kept as-is for this change.

**Left undone:** P5-26 loop machine design; P5-27; the P4-02 screen-reader pass; P6-01.

**Next session should start with:** designing the loop machine (P5-26) with the maintainer.

### Session 39: 2026-10-20: discovery drawers and the accessibility audit

**Contributor:** Claude Code with maintainer direction

**Goal:** Start P4-02. The maintainer asked that the cabinet not overwhelm people: "more like a discovery, and then maybe an advanced mode where it's all laid bare like equipment cabinet." They chose drawers that unlock as you play, remembered on this device. (The maintainer also listened to Parlor Ragtime from session 38: "its beautiful".)

**Done:** D-037; P4-02 progress (real assistive-technology pass still open).

**Audit found:** 172 tab stops (top 14, Perform 38, Mix 41, Keep 9, Band 70); `#transport-position` (an `<output>`, so implicitly polite) and the Kapellmeister readout (`aria-live="polite"`) re-announced every loop step; 43 rules set text below 0.6rem, the smallest rendering at 6.7 px; dimmed bone text at alpha 0.42/0.5/0.52 fell below 4.5:1; reduced motion was read once at load. Every control already had an accessible name, and the Fun Machine letter keys ignore typing fields. Automatic contrast detection is unreliable on the parchment and wood textures, so contrast was computed per colour token instead.

**Changed:**
1. `src/cabinet.mjs` (new): `DRAWERS` (Kapellmeister, Mix, Keep, The Band; each with a target, invitation, and trigger), `cabinetReduce()`, `parseCabinetState()`/`serializeCabinetState()`, `isDrawerOpen()`.
2. `src/app.mjs`: `buildDrawers()` moves each target's contents into a `drawer-body` behind a `drawer-bar` with a toggle (`aria-expanded`, `aria-controls`). It also adds the cabinet switch, announcements via `#cabinet-announcer`, guarded storage, and four triggers: a held key, a completed loop, changes inside the Kapellmeister/Mix/Band/sequencer/style chips, and mute/solo or bandstand clicks (or four loops).
3. `index.html`: `#cabinet-switch` (hidden until the script runs) with the announcer; `cabinet.mjs` in the import map; `#transport-position` set to `aria-live="off"`; the Kapellmeister readout is no longer a live region.
4. `styles.css`: drawer and switch styles, slim sealed nameplates, an opening animation only without reduced motion, `select:focus-visible`, a `.visually-hidden` utility, a 0.6rem text floor, dimmed text raised to alpha 0.62, and content-box sizing for the two telemetry boxes (border-box had left the Fun Machine status room for only about 1.5 lines).
5. Tests: `tests/cabinet.test.mjs`; static checks for the triggers, guarded cabinet storage, the switch, quiet readouts, the type floor, and the contrast floor.
6. Docs: D-037, SECURITY and ARCHITECTURE (a second accepted `localStorage` store), README, TESTING, CHANGELOG, ROADMAP (P4-02 progress), AGENTS map, and a manual entry (35 entries).

**Verified:** 117/117 Node checks. In the browser, a fresh visit starts with all four drawers sealed and 55 tab stops. A held key, a loop, a genre change, and a mute each opened their drawer in turn with an announcement. A drawer closed by hand stayed closed across the cabinet switch and in storage, and the whole cabinet showed every drawer and no bars. With the larger type, every width from 320 to 1720 px kept one page height across all seven genres and held keys, with nothing clipped and no horizontal overflow; the Fun Machine status text fits at 360, 720, and 1390 px. No console errors.

**Not verified:** A screen reader (NVDA, VoiceOver, or Orca) reading the drawers and announcements; Safari and Firefox.

**Left undone:** The P4-02 assistive-technology pass; P6-01.

**Next session should start with:** a screen-reader pass of discovery mode, or the maintainer's feel for the drawer triggers.

### Session 38: 2026-10-20: Parlor Ragtime, written in Inform 7

**Contributor:** Claude Code with maintainer direction

**Goal:** Ship a seventh Kapellmeister genre written only in Inform 7 (follow-up to P5-23). The maintainer chose Parlor Ragtime over Sea Shanty Dorian and Gamelan Slendro.

**Done:** P5-24.

**Changed:**
1. `src/rulebooks.ni`: Chapter 6, Parlor Ragtime (`parlor_ragtime`, insistent, voiced). Twelve-step changes I · I · I7 · IV · IV · ♯iv° · I · I · VI7 · II7 · V7 · V7. Colours: major on 0 and 5, dom7 on 2/4/7/9/10, passing diminished elsewhere. A "Table of Parlor Rag" progression (I → I7 → IV → V7) and member snapping {root, third, fifth} plus the major sixth. A stride bass walk {0, 7, …, 0, 7, 2, 4} (climbs A, B over V7 back to C), organ {third, fifth, octave}, and Ragtime Overtones including 5/3 and 7/4. Raw Esoteric Chaos moves to Chapter 7 so it stays last in the menu. No `src/*.mjs` changed.
2. `tests/fixtures/rulebooks-golden.json` re-frozen with `--rewrite`. After resolving interned chord indices, every entry of the original six genres is identical; the fixture only gained ragtime entries (colours 14, progressions 8, spines 24, projection 14, ensembles 36).
3. Tests: genre lists include ragtime; a new suite pins its changes, colours, Fun Machine summary ("C Maj → C7 → F Maj → G7"), stride bass, organ, and sixth overtone. The barbershop fixture test now calls itself an extra, test-only genre.
4. Docs: README, manual (Kapellmeister and Inform entries), ARCHITECTURE, TESTING, ROADMAP (P5-24), CHANGELOG. `ASSET_VERSION` restamped.

**Verified:** 113/113 Node checks. In the browser: seven menu entries with ragtime sixth; title, motto, compass (I, IV, I, II7), and key colours update; one page height and nothing clipped at 340, 400, 720, and 1390 px across all seven genres; holding a key during play works; no console errors.

**Not verified:** Nothing further; the maintainer listened on 2026-10-20 ("its beautiful").

**Left undone:** Listening passes; P4-02; P6-01.

**Next session should start with:** the maintainer's listen to Parlor Ragtime.

### Session 37: 2026-10-20: Inform 7 rulebooks, phase 5 (P5-23 complete)

**Contributor:** Claude Code with maintainer direction

**Goal:** P5-23 phase 5: prove a genre written only in Inform 7 plays with no JavaScript change (D-033).

**Done:** P5-23 (all five phases).

**Changed:**
1. `tests/fixtures/barbershop.ni`: a barbershop quartet. Changes I → VI7 → II7 → V7, a major tonic with every other key coloured dom7, a "Barbershop Tag" progression, a root–fifth bass walk, organ voicing {third, fifth, seventh}, melody snapping to {root, third, fifth, seventh}, and overtones ringing 7/4. It reuses the canonical kinds and adds its own three tables.
2. `tests/seventh-genre.test.mjs`: appends it to `src/rulebooks.ni`, installs the result, and checks that the six canonical genres compile identically. It then checks key colours, the progression summary ("D Maj → B7 → E7 → A7"), the accompanist's chords and lifted lead, the conducted spine, bass walk and insistent gates, organ voicing, melody on chord members, and overtones. Sessions accept the new code but still refuse "polka", and no `src/*.mjs` or `index.html` mentions "barbershop".

**Verified:** 112/112 Node checks; the new suite passed on its first run.

**Not verified:** The barbershop genre in the browser. It is test-only and never shipped.

**Left undone:** A seventh playable genre in `src/rulebooks.ni` (the maintainer's follow-up); listening passes; P4-02; P6-01.

**Next session should start with:** the maintainer's choice: ship a seventh genre, the outstanding listening passes, or P4-02 / P6-01.

### Session 36: 2026-10-20: the echo keeps the tempo

**Contributor:** Claude Code with maintainer direction

**Goal:** Maintainer: the one-finger accompaniment seemed slightly faster than the tempo setting.

**Found:** the accompanist itself plays on the band's step grid at the live tempo (`loopStepDuration()` and the scheduler both read `activeTempoBpm`). The delay, however, was timed once when the loop started (`unit × DELAY_MULTIPLIERS[score.rhythm]`) and never followed the tempo slider. Since D-029 the pad, arpeggio, and lead all feed that delay, so after a tempo change mid-loop their echoes ran at the old tempo.

**Changed:** `src/ensemble.mjs` exports `delayTimeFor(score, bpm)` and uses it at build time; `setTempoBpm()` in `src/app.mjs` retimes the running loop's delay with a short glide. Tests cover the formula and the live retime. `ASSET_VERSION` restamped.

**Verified:** 107/107 Node checks; in the browser, a normal reload picked up the new stamp, and moving the tempo 70 → 150 → 96 while holding a key raised no errors.

**Not verified:** Listening. If the accompaniment still feels quick at a steady tempo, the likely cause is the ARPEGGIO style's two notes per step (sixteenths against the band's eighth-note steps, D-029). That is a design choice to revisit, not this bug.

**Left undone:** P5-23 phase 5; listening passes; P4-02; P6-01.

**Next session should start with:** the maintainer's listen, then P5-23 phase 5.

### Session 35: 2026-10-20: the manual climbs like a keyboard

**Contributor:** Claude Code with maintainer direction

**Goal:** Maintainer: "the C on the left hand side is the same octave as the one on the right. That's not how keyboards work."

**Done:** D-036.

**Changed:**
1. `src/accompaniment.mjs`: `buildPerformance()` keeps the key's manual position as `lift` (0..12); `leadPitch` includes it; `padVoicing(chord, previous, lift)` and `arpeggioNotes(chord, step, subdivisions, lift)` raise their windows by it.
2. `src/app.mjs`: held-key pads (region, bridge, and idle audition) and arpeggios pass `performance.lift`.
3. `tests/accompaniment.test.mjs`: C' equals C plus an octave in every genre and style, and every key's pad and arpeggio sit in a window that rises a semitone per key.
4. `index.html`: `ASSET_VERSION` restamped (`node tools/stamp_assets.mjs`, D-035) because `src/` changed.

**Verified:** 106/106 Node checks. In the browser (served by `tools/serve.py`), C pads 48,55,60,64 and C' pads 60,67,72,76; keys 0, 4, 7, 11, and 12 climb in pad, arpeggio, and lead; holding C and then C' over the loop raised no console errors. The first browser run used a cached pre-D-035 `index.html`, which is the very problem D-035 prevents from now on.

**Not verified:** Listening, especially how bright the top keys are.

**Left undone:** P5-23 phase 5; listening passes (parlor room, manual); P4-02; P6-01.

**Next session should start with:** the maintainer's listen, then P5-23 phase 5.

Older sessions: [archive/sessions.md](archive/sessions.md).
