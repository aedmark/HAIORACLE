# Session Handoff

Read this first when resuming work. Protocol: [AGENTS.md](../AGENTS.md). Plan: [ROADMAP.md](../ROADMAP.md). Architecture: [ARCHITECTURE.md](ARCHITECTURE.md). Decisions: [DECISIONS.md](DECISIONS.md). Tests: [TESTING.md](TESTING.md).

## Current state

_Last updated: 2026-10-24, session 74, on `main`._

- P5-28–P5-30: 22 Inform 7 genres, rhythmic feel, THE CREATURE'S OWN rulebook, variations, and creature voices (D-040, D-041, D-043, D-044, D-060).
- D-045–D-055: armed downbeat sync, 1-loop count-in, tracker ribbons, 83.8M names, 72-slip urn, vitrine agitation/retaliation/sulk, fungal appendages, metric closure (D-050), volume surge elimination (D-051), looper sync & Casio sections (D-052), audio sweep audit (D-053), 4-pass breathing sections (D-054), section loops (+ INTRO/BRIDGE/OUTRO, D-055).
- D-056–D-061: "The Whimsy Machine" Korg R3-inspired tiered console UX (D-056–D-057); Wings III/IV swapped (D-058); raw 48-step groove loops (D-059); Wave 3 rhythmic feel & 22-genre expansion (D-060); Standalone Studio Companion Stage 1: Web MIDI & Audio Sink (D-061).
- Next: CachyOS PipeWire & REAPER live routing verification (Stage 2) and Tauri v2 packaging (Stage 3).

**Where things stand:** P1, P2, P3, P4, P5-01 through P5-31 are implemented and verified; P5-32 Stage 1 is complete. The application features bidirectional Web MIDI and multi-channel audio sink routing (`src/midi-io.mjs`, D-061), 22 Inform 7 genres across 5 families with rhythmic feel (D-060), and full DAW stem and SMF Type 1 MIDI export.

**Verified** (2026-10-24, session 74, local Linux environment)

| Suite | Result |
| --- | --- |
| `node --test tests/*.test.mjs` | **194/194 behavioral and structural checks passed** |
| `python3 tools/check_docs.py` | **0 errors, 0 warnings across 14 documents** |
| `python3 tools/manual.py check docs/manual.json` | **6 sections, 36 entries, 0 errors, 0 warnings** |

**What works**

- The static page accepts a phrase and offers surprise, replay, and mute controls (P2-03).
- The phrase becomes a stable unsigned seed under the D-003 normalization contract.
- A purpose-built interpreter executes `src/oracle.lol` and rejects unsupported syntax with line numbers (P1-02, D-002).
- The spell emits validated audio, visual, and naming parameters (P2-01).
- Canvas and Web Audio share the same immutable score (P2-02, D-004).
- Audio loops continuously until mute, restart, replacement, or page close (D-005).
- The expanded grammar covers twelve-note phrases, eight scales, six rhythms and voices, ten shapes, broader size and color ranges, and six name templates (P5-01, D-005).
- Cellular appendages and fruiting bodies (sporangia, flagella, vacuoles, ascus spore-sacs, hydathodes, cirri, phosphor-glands, platelet rosettes), internal organelle textures, germ apertures, layouts, and sizes vary deterministically without ocular animal sclera (P5-02, D-006, D-049).
- Body boundaries continuously deform through eight clamped flux grammars while eight seed-selected kinetic systems move independently inside them (P5-03, D-007).
- Canvas geometry does not resize on audio beats; sound and image remain paired through their shared immutable score (D-008).
- The large exterior glow is isolated to the body fill; kinetic lines, rings, and cellular appendages no longer inherit its expensive per-primitive blur.
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
- The Kapellmeister music-theory console (`#kapellmeister-engine`) provides 19 selectable rulebooks across five menu families plus THE CREATURE'S OWN rulebook, an Euler consonance strictness slider ($3\dots 14$), live harmonic step/chord/vector/Euler score telemetry, and an animated 4-region SVG Tonnetz compass (P5-15, P5-29, D-019, D-041).
- The Antique Parlor Room Acoustic Space (`#parlor-acoustics-engine`) synthesizes authentic 1890s Edison wax-cylinder surface noise (horn resonance, Poisson dust pops, 78 RPM groove rumble), a 1.6-second wood-and-velvet chamber convolution reverb (`ConvolverNode`), and mechanical brass clockwork escapement ticks on quarter-beats, active in both live playback and offline 16-bit WAV rendering (P5-15, D-019).
- The Fun Machine accompanist and Loop Machine (`#fun-machine-engine`, `#looper`, D-029, D-039, P5-26, D-045, D-046, D-052): hold a key on the 13-key manual or `[A..K]` and choose SWELL, ARPEGGIO, or PROGRESSION; the pad, arpeggio, and lead play in the band's rhythm, the band follows the chord, and the LOLCODE lead ducks. The Loop Machine records takes into stacked loops (up to 4 layers, 16 loops, 32 passes) with real-time audible clock latching, layer isolation during new loop recording, armed downbeat sync, a 1-loop count-in pass, a mechanical clockwork metronome, an interactive 12-step tracker ribbon, auto-advancing STEP REC, downbeat anticipation latching, and musical section roles (Intro, Main, Bridge, Outro) with live Outro cueing and full linear offline export to WAV, stems, and MIDI.
- Summoned creatures sync their phrase to `#omen=...` URL fragments without sending query parameters over HTTP, can be copied via `COPY OMEN LINK` (`#share-link`), and can be exported as a 1200×1520 engraved broadsheet PNG (`#export-png`) containing the live creature capture, specimen name, confided phrase, seed, and six-language ensemble ledger (P3-01, P3-02, D-015).
- A comprehensive 3x technical manual (`docs/manual.json`, `manual.html`, `tools/manual.py`) documents What, How, and Why across all 28 major systems, interpreters, and algorithms with 0 warnings.
- Full interactive and audiovisual functionality verified in live browser review (P4-01).
- The master transport (`#transport-deck`) plays, pauses at the last heard step, and stops-and-rewinds the loop; `Space` toggles play/pause and `Esc` stops from anywhere. Live playback and WAV export build one shared graph (`src/ensemble.mjs`), so exports render the routing the listener hears (P5-18, D-023).
- The Session Ledger (`#session-engine`) saves the whole apparatus as named presets in this browser's `localStorage` or as portable `.fun` files, and restores it exactly; files and stored presets pass a strict validator first (P5-20, D-026).
- `EXPORT 9 STEMS (ZIP)` downloads eight aligned channel stems, a parlor-room stem, and a README; `WRITE MIDI SCORE` downloads a Type 1 MIDI file with a tempo track and seven named parts captured from the live schedulers (P5-21, D-025).
- The parlor mixing console (`#mixer-engine`) gives all eight voices a fader, pan, mute, solo, and live post-fader VU meter. Plate ENGAGE/SILENCE switches are the console's mutes, and WAV exports follow the mix. Default voicing trims lift the lead +6 dB and the choir +12 dB with faders still at unity, faders reach a further +12 dB, the choir bypasses the creature filter, and bandpass creatures blend a dry lead tap, so neither voice is buried by narrow bandpass creatures any more (P5-19, D-024).
- Below the vitrine and the reading strip (name and score card only), the page is a four-wing workstation (D-027, D-058): **Perform** (transport rail with restart, volume, and tempo; Fun Machine; Kapellmeister), **Mix** (Bandstand, console, parlor room), **The Band** (Plates I–V), and **Keep** (Session Ledger; export desk with WAV, stems, MIDI, PNG, and omen link). Tab order follows the same sequence, and nothing overflows at 320, 375, 768, or 1100 px.
- Runtime assets are local and dependency-free (D-001).
- Updates load cleanly without a hard reload (D-035): `index.html` builds an import map that stamps every module with `?v=<ASSET_VERSION>` (a hash of `src/`), and sources are fetched with the same stamp. Verified in the built-in browser against plain `python3 -m http.server`: with 28 of 29 files served from heuristic cache, a new export added to `src/ensemble.mjs` and imported by `src/app.mjs`, plus a restamp, loaded on a normal reload with all 29 requests at the new stamp and no console errors.
- All six rhythm templates divide the 12-step barline evenly ($12 \bmod \text{len} = 0$), mathematically guaranteeing zero metric loop drift across loop boundaries and seamless export loop tiling; summoned creature tempos fold into the $68\dots 144$ BPM groove pocket; region boundary damping prevents chord release tail bleed; and a vertical anti-clash sieve resolves passing tone collisions down to 0.00% under THE CREATURE'S OWN rulebook (D-050).
- Voice envelope GainNodes initialize to `0.0001` at construction, pad releases cleanly anchor active gains via `cancelAndHoldAtTime` and cancel future look-ahead nodes before they sound, and legato key changes grace-window drone ducking to eliminate volume spikes (D-051).
- Looper recording synchronization eliminates clock collision, premature overdub discards, and sustain note truncation; section roles (Intro, Main, Bridge, Outro) support full musical arrangements with seamless Outro cueing and linear export (D-052).

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

1. Maintainer hands-on testing of the note sequencer, STEP REC mode, armed downbeat sync, and count-in (D-045, D-046).
2. Hands-on review of the four-wing layout (D-027) in Safari and Firefox; the maintainer approved it from the Chromium review. A sticky transport rail was deferred; it needs the cabinet's `overflow: hidden` changed to `overflow: clip`.
3. Complete P4-02 with keyboard, reduced-motion, contrast, and screen-reader checks.
4. Choose public hosting and domain (Q-001 / P6-01). Serve `index.html` with `Cache-Control: no-cache` there (D-035); stamped `src/` URLs can be cached freely.

## Open questions

- Q-001 blocks P6-01: choose public hosting and domain.

## Session log

### Session 72: 2026-10-23: raw instrumentation 48-step base groove loops in the Loop Machine (D-059)

**Contributor:** Antigravity with maintainer direction

**Goal:** Enable using the creature's raw 48-step base groove (4 passes of 12 steps) as loops in the Loop Machine so mixes longer than 5 seconds / 12 steps can be created and exported across WAV, Stems, and MIDI.

**Done:** D-059 is accepted and verified. 185/185 checks pass.

**Changed:**
1. `src/looper.mjs`:
   - `sectionPassForLoop(song, loopIndex, repeat)` now resolves pass 0..3 across contiguous `main` groove loops.
   - `validateSong(raw, path)` permits empty takes (`slots.every(s => s === null)`) when `loop.role === "main"`. Non-main roles (`intro`, `bridge`, `outro`) still require keys.
2. `index.html` & `styles.css`:
   - Added `<button class="beat-button looper-button looper-section-button" id="looper-insert-groove" type="button">+ GROOVE</button>` between `+ INTRO` and `+ BRIDGE`.
   - Added emerald/verdigris border accent `.looper-tile[data-role="main"]`.
3. `src/app.mjs`:
   - `insertSectionLoops("main")` inserts 4 loops of `emptyTake()` with `role: "main"` when no key is held on the manual (raw band without organ ducking), or Fun Machine progression takes when a key is held.
   - `harmonicPassAt(absoluteStep)` queries `sectionPassForLoop` for the active loop, ensuring groove loops walk passes 0..3.
   - `followSong(transport, loop, stepIndex, liveSlot)` tracks `raw:${currentHarmonicPass}` when `lead` is null, seamlessly re-conducting the band to the current pass of the harmonic cycle at each groove loop boundary.
   - Readout and tiles display `L1 [GROOVE 1/4]`, `L2 [GROOVE 2/4]`, etc.
4. Tests & documentation:
   - Updated `tests/looper.test.mjs` with test coverage for raw groove loops and pass resolution.
   - Stamped asset version (`node tools/stamp_assets.mjs`).

**Verified:**
- 185/185 automated tests pass (`node --test tests/*.test.mjs`).
- Documentation check passes with 0 errors and 0 warnings (`python3 tools/check_docs.py`).
- Manual check passes with 0 errors and 0 warnings (`python3 tools/manual.py check docs/manual.json`).

### Session 71: 2026-10-23: Swap Wings III (The Band) and IV (Keep) for hardware console workflow (D-058)

**Contributor:** Antigravity with maintainer direction

**Goal:** Swap Wings III and IV so that The Band (the five esoteric VM machines, Plates I–V) immediately follows Wing II (Mix), while Wing IV (Keep: Session Ledger and Engraver's DAW export desk) forms the bottom rear utility panel of the instrument console.

**Done:** All parts implemented and verified. All 184 checks pass.

**Changed:**
1. `index.html`:
   - Swapped `#wing-band` and `#wing-keep`.
   - Updated `#wing-band` numeral to `WING III` and `#wing-keep` numeral to `WING IV`.
   - Restored `#fun-machine-telemetry` span.
2. `src/cabinet.mjs`:
   - Updated `DRAWERS` sequence to `kapellmeister` → `mix` → `band` → `keep` in page order.
3. Assets:
   - Restamped `ASSET_VERSION` to `10f729ec27f8` (`tools/stamp_assets.mjs`).
4. `styles.css`:
   - Updated `.drawer-body[hidden]` to `display: none !important;` and scoped the desktop layout rule to `#drawer-body-keep:not([hidden])`, fixing a CSS specificity override where ID `#drawer-body-keep` kept the Keep drawer permanently open on viewports $\ge 1180$px.
5. Tests:
   - `tests/cabinet.test.mjs`: updated `DRAWERS.map` page order assertion.
   - `tests/static.test.mjs`: updated wing order assertions in D-027 test, session engine placement assertion, and added `.drawer-body[hidden]` regression assertions.
6. Documentation:
   - Recorded ADR D-058 in `docs/DECISIONS.md`.
   - Updated page shell map and invariants in `docs/ARCHITECTURE.md`.
   - Updated `docs/HANDOFF.md`.

### Session 70: 2026-10-23: Hardware console alignment, whitespace harmony, and double-padding elimination (D-057)

**Contributor:** Antigravity with maintainer direction

**Goal:** Resolve inconsistent whitespace, wrapping, and padding across Wing 1 following the Korg R3-inspired layout pivot: eliminate the excessive top pad over master volume/tempo sliders, tighten the dead space between the One-Finger Accompanist title and its controls, and eliminate the double-padding misalignment that pushed rulebook headers far to the left of the readout and compass.

**Done:** All parts implemented and verified. All 184 behavioral, structural, and audit checks pass.

**Changed:**
1. `styles.css`:
   - `.transport-deck`: changed from `align-items: center` to `align-items: flex-start`, aligning the transport buttons, step counter, volume and tempo sliders, and keyboard hint along the exact same top padding guide.
   - `.transport-position`: updated padding to `0.72rem 0.75rem`, matching transport button height (~36px).
   - `.transport-hint`: added `align-self: flex-start; padding-top: 0.65rem;` to align its baseline with the transport keys.
   - `#fun-machine-heading`: separated from `#kapellmeister-heading` and reduced from `height: 2.5em` to `height: 1.25em`.
   - `.fun-machine-engine`: tightened gap to `0.5rem`.
   - `.fun-machine-body`: set `padding: 0.25rem 0 0.5rem` (0 inline padding), shrinking dead space between heading and style bar from ~47px down to a crisp ~11px.
   - `.looper`: set `margin-top: 0`, using the uniform `0.75rem` body gap between the keyboard and sequencer.
   - `.kapellmeister-body`: set `padding: 0.35rem 0 0.5rem` (0 inline padding), eliminating the double-indentation bug where body readouts and compass were shifted 42px inwards relative to the title and motto.
   - `.acoustics-body`: set `padding: 0.35rem 0 0.5rem` (0 inline padding), aligning acoustics controls with the engine header.
   - `.kapellmeister-engine .beat-header`: changed from `align-items: end` to `align-items: flex-start`, aligning the Rulebook select dropdown with the top title row.
   - Sliders: unified dimensions and brass accent across `#master-volume`, `#tempo-bpm`, `#kapellmeister-strictness`, and `#parlor-acoustics-level`.
2. `tests/static.test.mjs`:
   - Line 321: updated fixed line box assertions for `#kapellmeister-heading` (`2.5em`) and `#fun-machine-heading` (`1.25em`).
3. `docs/DECISIONS.md`:
   - Logged D-057.

### Session 69: 2026-10-23: Casio arranger section lookahead race condition and premature cutoff fix (D-052)

**Contributor:** Antigravity with maintainer direction

**Goal:** Eliminate premature section cutoff (intro/bridge/outro dying off after 2 notes during active playback), eliminate trapped bridge loops, and align live look-ahead audio scheduling with real-time audible callbacks and UI states.

**Root cause:** Web Audio look-ahead vs. real-time callback collision. The scheduler schedules ~280ms ahead. When playback was active and a Casio section was cued, the look-ahead reached step 0 of the upcoming pass and populated the global `activeCasioSection`, scheduling steps 0 and 1. Meanwhile, the previous pass's step 11 was sounding in the room. When its `setTimeout` callback fired, its step 11 check wiped `activeCasioSection = null`. On the next scheduler tick, `activeCasioSection` was null, so steps 2..11 were scheduled as normal groove—cutting the section off after two notes.

**Done:** All parts implemented and verified. All 182 behavioral, structural, and audit checks pass.

**Changed:**
1. `src/app.mjs`:
   - Replaced mutable shared `activeCasioSection` with pass-indexed `scheduledCasio = { role, key, pass, performance }` where `stepPass = Math.floor(currentStep / 12)`.
   - Look-ahead scheduler checks `isCasioStep = scheduledCasio !== null && stepPass === scheduledCasio.pass;`, mathematically guaranteeing all 12 steps (0..11) are scheduled without premature clearing.
   - Enclosed `stepCasioRole`, `stepCasioKey`, `stepCasioPerf`, and `stepIsLast = isCasioStep && stepIndex === 11` within each step's loop scope. Audible `setTimeout` callbacks now update `audibleCasioSection` and reset only when that specific Casio pass completes step 11.
   - Wired live ensemble conduction during Casio sections via `followSong()` and `scheduledCasio.performance`.
   - Prevented post-outro scheduling bleed using `casioOutroEnding` break in the look-ahead loop; when step 11 of the outro finishes sounding, transport cleanly halts and rewinds.
   - Synchronized button UI states: `.is-cued` pulsing while pending/scheduled ahead, transitioning to `.is-active` once audible, and clearing upon step 11 completion.
   - Added Casio progress reporting to `looperReadoutText()`.
   - Restamped `ASSET_VERSION` to `698d822fb894`.

### Session 68: 2026-10-22: looper recording synchronization, Casio arranger sections, and rulebook accompaniment (D-052)

**Contributor:** Antigravity with maintainer direction

**Goal:** Overhaul looper recording synchronization (eliminating look-ahead collisions, overdubbing dropouts, and arpeggio/swell truncation), implement Casio-style 1-pass arranger section buttons (Intro, Bridge, Outro) on the Fun Machine, and streamline the Looper to pure sequential playback without trapped loops (D-052).

**Done:** All parts implemented and verified. All 182 behavioral, structural, and audit checks pass.

**Changed:**
1. `src/accompaniment.mjs`:
   - Added `"intro"`, `"bridge"`, `"outro"` to `ACCOMPANIMENT_STYLES` and `STYLE_LABELS`.
   - Implemented `buildFunSectionProgression(key, section, genre, tonicRoot)` generating Inform 7 rulebook-governed harmonic progressions:
     - Intro: tonic vamp/turnaround ($I \to IV \to I \to V$ or $\flat II7$ setup) with lead motif and a step 11 breath before downbeat.
     - Bridge: contrasting subdominant ($IV$) or relative minor ($vi$), secondary dominant ($V/V$ or $II7$) or modal borrowing ($\flat VI$), predominant, and dominant suspension ($V7$).
     - Outro: genre-specific cadence (Phrygian descent for Andalusian/Palestrina/Tango, Plagal "Amen" for Gospel/Blues/Doo-Wop, Authentic $ii \to V \to V7 \to I$ for others) with tonic held through steps 9..11.
   - Integrated section progression routing into `buildPerformance()`, preserving exact octave-climbing ($C' = C + 12$) invariants.
2. `src/looper.mjs`:
   - Restored `songPosition(song, absoluteStep)` to pure, reliable sequential playback (playing each loop for its repeats, then cycling cleanly), eliminating endless bridge loops.
   - Preserved `LOOP_ROLES` and `validateSong` backwards-compatibility with sessions containing role tags.
3. `src/app.mjs`:
   - Implemented real-time audible-clock keystroke latching in the audible timer callback, recording held keys across all active steps without truncation.
   - Isolated new loop recording in `scheduleAhead()` by muting existing song layers and guarding `followSong()`.
   - Wired 1-loop synchronized count-in pass for both new and overdub recording.
   - Implemented Casio arranger section engine (`triggerCasioSection(role)` and `updateCasioUI()`):
     - `INTRO` (`#casio-intro`): plays 1-pass prelude, then smoothly rolls into the normal groove.
     - `BRIDGE` (`#casio-bridge`): cues on the next downbeat, plays 1-pass contrasting departure, and automatically returns to the groove.
     - `OUTRO` (`#casio-outro`): cues on the next downbeat, plays the closing cadence, and automatically halts the transport and rests.
   - Decluttered the looper UI by removing role chips, quick-generate buttons, and cue toggles.
4. `index.html` & `styles.css`:
   - Added `.fun-casio-bar` with `#casio-intro`, `#casio-bridge`, and `#casio-outro` buttons on the Fun Machine panel.
   - Restored `.fun-quality-chips` to pure chord playing styles (`SWELL`, `ARPEGGIO`, `PROGRESSION`).
   - Cleaned up looper markup and CSS, removing `.looper-gen-button` and `.looper-role-chips`.
   - Styled Casio section buttons with gold (intro), violet (bridge), and ruby (outro) active/cued states and accessible typography ($\ge 0.6\text{rem}$).
5. Tests:
   - Added sustained arpeggio/swell hold test and sequential song playback tests in `tests/looper.test.mjs`.
   - Added unit test in `tests/looper.test.mjs` verifying that section loop slots (`intro`, `bridge`, `outro`) enforce manual key bounds $0..12$ and that MIDI root pitches correctly map to manual pitch classes.
   - Added 11 unit tests in `tests/accompaniment.test.mjs` verifying intro, bridge, outro progressions across 19 genres and 13 keys.
6. Browser runtime hotfixes:
   - Imported `LOOP_STEPS` from `./looper.mjs` in `src/app.mjs`.
   - Used `globalThis.performance ? globalThis.performance.now() : Date.now()` in `triggerFunKey` to eliminate lexical scope TDZ collisions when releasing keys.
   - Mapped `currentScore.root` to the manual key semitone (`((root % 12) + 12) % 12`) when triggering Casio sections without a held key.

**Verified:**
- 182/182 Node tests pass across all test suites.
- `python3 tools/check_docs.py` reports 0 errors, 0 warnings across 14 documents.
- `python3 tools/manual.py check docs/manual.json` passes with 0 warnings.

### Session 67: 2026-10-22: volume spike elimination on note hold and legato key transitions (D-051)

**Contributor:** Antigravity with maintainer direction

**Goal:** Eliminate intermittent audio volume surges/spikes occurring during Fun Machine note holding and legato note changes (D-051).

**Done:** D-051 implemented and verified. All 178 tests pass.

**Changed:**
1. `src/voices.mjs`:
   - Initialized `env.gain.value = 0.0001` immediately upon `context.createGain()` in `scheduleVoicePad()`, `scheduleVoiceLead()`, and `scheduleVoicePluck()`.
   - Initialized tremolo swell and depth gains to `1 - tremolo.depth` and `tremolo.depth` respectively in `connectThroughTremolo()`.
   - Returned `start` property in `scheduleVoicePad()` return object `{ env, oscillators, stopAt, peak, start }`.
2. `src/app.mjs`:
   - Preserved `start` in `schedulePadChord()` return handle `{ env, oscillators, stopAt, start }`.
   - Rewrote `releaseFunPads(context, fade)`:
     - For future-scheduled pads in the look-ahead window (`handle.start > now`), cancelled timeline, anchored gain to `0.0001`, and called `osc.stop(now)` immediately so future nodes never burst or sound at 1.0.
     - For actively sounding pads (`handle.start <= now`), anchored parameter via `cancelAndHoldAtTime(now)` (with `setValueAtTime(currentVal, now)` fallback) before `setTargetAtTime(0.0001, now, Math.max(0.02, fade / 4))` and oscillator stop.
   - Updated `triggerFunKey`:
     - Aligned bridge pad chord to active audible step chord (`transport.audibleStep % 12`) instead of future step.
     - Trimmed bridge duration to `bridge + 0.05` to prevent multi-chord voice doubling and compressor pumping.
     - Added `lastFunKeyReleaseTime` tracking.
   - Updated `updateAudioInteraction`:
     - Added 220 ms grace window to `leadDuck` (`(performance.now() - lastFunKeyReleaseTime) < 220`) preventing +10 dB tonic drone surges during legato key transitions.
   - Updated `shapeDrones`:
     - Applied `cancelAndHoldAtTime` (with anchor fallback) when reshaping drone envelopes on 3-step boundaries.
3. `tests/voices.test.mjs`:
   - Added assertions verifying `env.gain.value === 0.0001` and `start` timestamp return.
4. `index.html`:
   - Restamped `ASSET_VERSION` to `23dae243c96a`.
5. Documentation:
   - Added ADR D-051 in `docs/DECISIONS.md`.
   - Updated invariants in `docs/ARCHITECTURE.md`.
   - Archived Session 54 to `docs/archive/sessions.md`.

**Verified:**
- `node --test tests/*.test.mjs`: 178/178 tests passing in ~11.3s.
- `python3 tools/check_docs.py`: 0 errors, 0 warnings across 14 documents.
- `python3 tools/manual.py check docs/manual.json`: 6 sections, 35 entries, 0 errors, 0 warnings.
- Zero external dependencies and deterministic score invariants preserved.

**Not verified:**
- Hands-on listening review of legato feel and drone transition ducking.

**Next session should start with:** Maintainer hands-on testing of note sequencer, vitrine agitation/retaliation, cellular fruiting bodies, locked mixes, and Fun Machine legato transitions, or Wave 3 (feel) / P4-02.

### Session 66: 2026-10-22: metric closure, tempo pocketing, boundary damping, and anti-clash sieve (D-050)

**Contributor:** Antigravity with maintainer direction

**Goal:** Eliminate out-of-sync rhythm drift across loop passes and harmonic clutter in default mixes while preserving the 12-step architecture (Option 3 / D-050).

**Done:** D-050 implemented and verified. All 178 checks pass.

**Changed:**
1. `src/app.mjs`:
   - Replaced length-5 polymetric rhythm patterns 2 and 3 with syncopated patterns of lengths 4 and 6 (divisors of 12). All 6 rhythms now divide 12 evenly ($12 \bmod 4 = 0$, $12 \bmod 6 = 0$), mathematically guaranteeing identical loop pass duration and metric phase lock.
   - Added `musicalPocketBpm(bpm)`: folds summoned pulse values into the $68\dots 144$ BPM groove pocket via 2:1 octave gears on creature summon and dblclick reset, preserving the full $36\dots 208$ BPM manual range and raw `score.pulse` LOLCODE determinism.
   - Added harmonic boundary damping in `scheduleHarmonyStep` and `scheduleChimeStep`: voice durations on region boundaries (`stepIndex % 3 === 2`) clamped to $\le 0.90 \times \text{stepDuration}$ and $\le 0.92 \times \text{stepDuration}$, eliminating chord release tail mud before new downbeats.
2. `src/conductor.mjs`:
   - Implemented vertical anti-clash sieve (step 6 in `conductEnsemble`): non-chord passing tones under `CREATURE_GENRE` creating semitone clashes against active bass, chord organ, chimes, or vowel chant are cleanly snapped to the nearest chord tone. Clash rate for `CREATURE_GENRE` drops from 5.8% to 0.00%.
   - Added optional `creatureBook` parameter to `conductEnsemble` to cleanly install the creature's book on invocation.
3. `tests/audit.test.mjs`:
   - Added Audit Dimension 9 verifying metric closure across all templates, tempo range folding invariance across all pulse integers $36\dots 208$, and 0.00% semitone clashes across sample creatures.
4. `docs/DECISIONS.md`, `docs/ARCHITECTURE.md`, `docs/HANDOFF.md`:
   - Recorded ADR D-050, updated invariants and session handoff state.

**Verified:**
- 178/178 Node checks pass in 11.3s.
- `python3 tools/check_docs.py` passes with 0 errors, 0 warnings across 14 documents.
- `python3 tools/manual.py check docs/manual.json` passes with 0 errors, 0 warnings.

### Session 62: 2026-10-21: note sequencer and downbeat anticipation latching (D-046)

**Contributor:** Antigravity with maintainer direction

**Goal:** Address timing at the start of loop recording and provide a step sequencer in addition to live loop capture (D-046).

**Done:** D-046 implemented and verified. All 163 checks pass.

**Changed:**
1. `src/looper.mjs`:
   - Added pure `setLoopSlot(song, loopIndex, layerIndex, step, slot)` helper to program individual steps or create an initial loop on demand.
   - Added `{ type: "anticipate", slot }` event to `recorderReduce()` so keystrokes struck during armed count-in latch onto step 0 when recording begins.
2. `src/app.mjs`:
   - Made each cell in `#looper-steps` an accessible interactive button; clicking any step selects it (`selectedStepIndex`), and clicking an already-selected step with a note clears it to a rest.
   - Pressing keys on the Fun Machine manual (`C..C'`) or computer keys (`[A..K]`) while a step is selected sets that note, style, and voice into the loop layer and plays an audition sound.
   - Added `STEP REC` (`#looper-step-rec`) and `REST (—)` (`#looper-rest`) buttons: in STEP REC mode, striking keys automatically advances selection to the next step, while REST clears the step and advances.
   - In `triggerFunKey`: latched downbeat anticipation during armed count-in (and during the step 11 lookahead window) into `recorder.anticipatedSlot`, and rendered the anticipated note on step 1 of `#looper-steps`.
   - Updated `looperReadoutText()` to display live step-record and anticipated-note progress.
3. `index.html` & `styles.css`: Added `#looper-step-rec` and `#looper-rest` buttons, `.is-selected-step` (bright brass focus glow), and `.is-step-rec` button styling.
4. `docs/DECISIONS.md`: Recorded D-046.
5. `docs/manual.json` & `manual.html`: Documented note sequencing and downbeat anticipation in `esoteric-fun-machine`.

**Verified:**
- 163/163 Node checks (including new unit tests for `setLoopSlot` and downbeat anticipation in `tests/looper.test.mjs`, and static UI checks in `tests/static.test.mjs`).
- `python3 tools/check_docs.py` and `python3 tools/manual.py check docs/manual.json` pass with 0 errors.

**Next session should start with:** Maintainer testing of the interactive 12-step note sequencer and STEP REC mode, or P5-29 Wave 3 (feel) / P4-02.

### Session 73 (2026-10-23): Wave 3 of P5-29 (Rhythmic feel & 22-genre expansion, D-060)

**Done:**
- Wave 3 of P5-29 is implemented, documented under D-060, and verified with all 186 automated checks passing.

**Changed:**
1. Inform 7 Feel Property (`src/rulebooks.ni`, `src/inform.mjs`, `src/conductor.mjs`, `src/creature-rulebook.mjs`):
   - Added `A genre has some text called the feel.` to Chapter 2 in `src/rulebooks.ni`.
   - `compileRulebooks()` in `src/inform.mjs` parses `feel` (defaulting to `""`).
   - Tagged existing rhythm-sensitive genres: `parlor_ragtime` ("habanera"), `doowop_ballad` ("swing"), `tango_habanera` ("habanera").
   - `THE CREATURE'S OWN` explicitly defaults `feel: ""` to preserve phrase determinism (`score.rhythm`).
   - Exported `RHYTHMIC_FEELS` and `effectiveRhythmIndex(score, genreCode)` in `src/conductor.mjs`.
2. Three New Kapellmeister Genres (`src/rulebooks.ni`):
   - Chapter 19: **Vaudeville Viennese Waltz** (`vaudeville_waltz`, feel: `"waltz"`). I · vi · ii · V7 changes, member snapping, `{rotation, relative substitution, authentic cadence}`.
   - Chapter 20: **Swing-Era Savoy Ballroom** (`swing_ballroom`, feel: `"swing"`). I6 · vi7 · ii7 · V7 changes, guide-tone organ, `{rotation, relative substitution, tritone substitution, secondary dominants}`.
   - Chapter 21: **Javanese Gamelan Pelog** (`gamelan_pelog`, feel: `"straight"`). i5 · iv5 · v5 · i5 fifth-and-second open sonorities `{0, 7, 2}`, pentatonic scale snapping `{0, 2, 5, 7, 9}`, `{rotation, phrygian cadence, harmonic pace}`.
   - Raw Esoteric Chaos moved to Chapter 22 at the conclusion of Part 2.
   - Three Fun Machine progression tables added to Part 3 (`Table of Viennese Whirl`, `Table of Savoy Stomp`, `Table of Court Slendro`).
3. Rhythm Templates & Audio Graph Wiring (`src/app.mjs`, `src/ensemble.mjs`):
   - Added 3/4 waltz template `[1.4, 0.8, 0.8]` at index 6 in `RHYTHMS` ($12 \bmod 3 = 0$, dividing 12 steps into 4 measures of 3 steps with zero loop drift).
   - Extended `DELAY_MULTIPLIERS` to length 7 with index 6 at `0.75`.
   - Wired `effectiveRhythmIndex` into `loopStepDuration`, `scheduleAhead`, `renderEnsembleLoop`, and `elements.kapellmeisterGenre` change listener.
4. Fixtures, Tests & Assets:
   - Re-froze `tests/fixtures/rulebooks-golden.json` and `tests/fixtures/variations-golden.json`.
   - Updated genre count assertions to 22 across `tests/audit.test.mjs`, `tests/inform.test.mjs`, and `tests/oracle.test.mjs`.
   - Updated `tests/clashes.test.mjs` and `tests/variation.test.mjs`.
   - Re-stamped assets to `41c33f2f715c`.
   - Rebuilt `manual.html` from `docs/manual.json`.

**Verified:**
- `node --test tests/*.test.mjs`: 186/186 checks passed.
- `python3 tools/check_docs.py`: 0 errors, 0 warnings across 14 documents.
- `python3 tools/manual.py check docs/manual.json`: 6 sections, 35 entries, 0 errors, 0 warnings.

### Session 74 (2026-10-24): Standalone Studio Companion Stage 1: Web MIDI & Audio Sink (D-061)

**Done:**
- Implemented Stage 1 of the approved DAW integration specification (D-061): bidirectional Web MIDI input/output, AudioContext sink device selection, and Keep Wing Studio Deck UI.
- All 194 automated checks pass, with zero documentation and manual warnings.

**Changed:**
1. `src/midi-io.mjs`:
   - Note-to-semitone mapping (`midiNoteToSemitone()`) folding octaves into 0..12, preserving C5 as high C.
   - MIDI parser (`parseMidiMessage()`) handling Note On/Off, CC 64 (sustain hold), CC 1 (mod wheel), CC 7/11 (volume), and Realtime Clock/Transport.
   - Outbound packet generators (`makeNoteOn`, `makeNoteOff`, `makeAllNotesOff`).
   - Web MIDI API helpers (`requestMidiAccess`, `getMidiPorts`, `bindMidiInput`, `sendMidiMessage`).
   - Audio sink routing (`getAudioOutputDevices`, `setAudioOutputSink`, `isSetSinkIdSupported`).
2. `src/app.mjs`:
   - Inbound notes trigger `triggerFunKey()`, directly driving manual pad voicings, lead arpeggios, and step sequencer slots.
   - Inbound CC 64 latches manual voices as an authentic sustain pedal until released.
   - Inbound CC 1 drives organism agitation, perturbation, and mycelial spore bursts.
   - Outbound score broadcasting emits precision-timestamped Note On/Off pairs across 8 channels (Manual Ch 1, Lead Ch 2, Bass Ch 3, Harmony Ch 4, Chimes Ch 5, Choir Ch 6, Mycelium Ch 7, Beat Ch 10).
   - Audio sink selector queries output devices and calls `setAudioOutputSink()` on the audio graph.
3. `index.html` & `styles.css`:
   - Added `#studio-engine` inside Wing IV (Keep) with MIDI In/Out dropdowns, Connect button, Broadcast toggle, and Audio Sink selector.
   - Responsive multi-column layout for `#drawer-body-keep:not([hidden])` supporting Session Ledger, Export Desk, and Studio Deck side-by-side.
4. `tests/midi-io.test.mjs` & static tests:
   - Added 8 unit tests in `tests/midi-io.test.mjs` covering note mapping, CC parsing, realtime clock, and mock MIDIAccess port binding.
   - Updated DOM hierarchy assertions in `tests/static.test.mjs`.
5. Assets, Manual & Decisions:
   - Stamped `ASSET_VERSION` to `7aa3e6c86ec1`.
   - Added `studio-deck-and-daw-routing` to `docs/manual.json` and rebuilt `manual.html`.
   - Recorded D-061 in `docs/DECISIONS.md`.

**Verified:**
- `node --test tests/*.test.mjs`: 194/194 checks passed.
- `python3 tools/check_docs.py`: 0 errors, 0 warnings across 14 documents.
- `python3 tools/manual.py check docs/manual.json`: 6 sections, 36 entries, 0 errors, 0 warnings.

**Next session should start with:** Stage 2 live PipeWire / REAPER smoke testing on CachyOS, then Stage 3 Tauri v2 packaging.




