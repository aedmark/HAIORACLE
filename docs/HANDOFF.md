# Session Handoff

Read this first when resuming work. Protocol: [AGENTS.md](../AGENTS.md). Plan: [ROADMAP.md](../ROADMAP.md). Architecture: [ARCHITECTURE.md](ARCHITECTURE.md). Decisions: [DECISIONS.md](DECISIONS.md). Tests: [TESTING.md](TESTING.md).

## Current state

_Last updated: 2026-10-23, session 69, on `main`._

- P5-28–P5-30: 19 Inform 7 genres, THE CREATURE'S OWN rulebook, variations, and creature voices (D-040, D-043, D-044).
- D-045/D-046: armed downbeat sync, 1-loop count-in, tick metronome, interactive 12-step tracker ribbon with note sequencer & STEP REC.
- D-047/D-048: expanded lexicon (83.8M names) & 72-slip urn; vitrine tap agitation, retaliatory strike, audio disruption, and sulk recovery.
- D-049/D-050: generative fungal appendages replacing eyes; metric closure (lengths 4 & 6), tempo pocketing, boundary damping, anti-clash sieve.
- D-051: eliminated volume spikes on note hold and legato transitions via GainNode 0.0001 bounding, safe pad release, and transition ducking smoothing.
- D-052: looper recording synchronization (audible-clock latching, 1-loop count-in, layer isolation), Casio-style 1-pass arranger section buttons (`INTRO` rolling into groove, `BRIDGE` auto-returning to groove, `OUTRO` closing and auto-stopping), and look-ahead pass isolation preventing premature section cutoff.
- Next: maintainer testing of note sequencer, looper recording and section roles, vitrine retaliation, cellular fruiting bodies, locked mixes, and Fun Machine legato transitions, or Wave 3 (feel) / P4-02.

**Where things stand:** P1, P2, P3-01 through P3-03, P4-01, P5-01 through P5-28, P5-29 waves 1 & 2, and P5-30 are implemented and verified. The ensemble features an INTERCAL 1972 Grand Conductor (`src/conductor.i`, `src/intercal.mjs`, P5-22, D-028) that overcomes the "wall of sound" by executing a canonical 35-statement INTERCAL score with 22.9% politeness checking (ICL079/ICL099) that reads each creature's arrangement word with `WRITE IN` and chooses its form per phrase with at least five band voices on every step (D-031, D-032), channel registers that the program itself sets across four regions (Exposition groove, Antiphonal conversation, Tutti climax, Breakdown), and `COME FROM (60)` turnaround cadence interception at step 11 (D-030). The transport names the current section, rested console strips light TACET, and MIDI exports carry section markers. The Esoteric Fun Machine (`#fun-machine-engine`, P5-17, P5-22, D-029) is a one-finger accompanist: a held key plays a SWELL, ARPEGGIO, or PROGRESSION on the band's step grid through a voice-led stereo pad, a soft arpeggio pluck, and a gliding lead, while the band is re-conducted onto that chord in the correct key and the LOLCODE lead and drones step back by 10 dB. A master transport with `Space`/`Esc` (P5-18), an eight-channel mixer with VU meters in a graph shared by live and offline audio (P5-19), nine-stem ZIP and Type 1 MIDI export (P5-21), and a Session Ledger with on-device presets and validated `.fun` files (P5-20) complete the workstation wings.

**Verified** (2026-10-23, session 69, local Linux environment)

| Suite | Result |
| --- | --- |
| `node --test tests/*.test.mjs` | **182/182 behavioral and structural checks passed** |
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
- Below the vitrine and the reading strip (name and score card only), the page is a four-wing workstation (D-027): **Perform** (transport rail with restart, volume, and tempo; Fun Machine; Kapellmeister), **Mix** (Bandstand, console, parlor room), **Keep** (Session Ledger; export desk with WAV, stems, MIDI, PNG, and omen link), and **The Band** (Plates II–VI). Tab order follows the same sequence, and nothing overflows at 320, 375, 768, or 1100 px.
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

### Session 61: 2026-10-21: loop machine arming, count-in, downbeat sync, and step tracker (D-045)

**Contributor:** Antigravity with maintainer direction

**Goal:** Address loop machine usability: provide armed downbeat sync, a 1-loop count-in, an audible tick metronome, live step readouts, and a 12-step tracker ribbon (D-045).

**Done:** D-045 implemented and verified. All 161 checks pass.

**Changed:**
1. `src/looper.mjs`: `type: "arm"` accepts `countIn` steps (12 for stopped start, or steps until downbeat). Added `type: "slot"` event to update take slots directly during recording. `recorderReduce` handles `countIn` countdown before transitioning into recording.
2. `src/app.mjs`:
   - `armRecorder`: Starts transport with 12-step count-in if stopped; if already playing, calculates steps remaining until downbeat.
   - `triggerFunKey`: Writes struck key directly into `recorder.take` at `transport.audibleStep % 12` during active recording, eliminating dropped notes from 280ms look-ahead scheduling.
   - `scheduleAhead`: Calls `renderLooper()` on every audible step, driving live step-by-step UI updates.
   - `scheduleClockworkTick`: Automatically sounds the clockwork tick during armed count-in and recording with an accented high tick on step 1 (downbeat), bypassing muted parlor acoustics.
   - `renderLooperSteps` & `looperReadoutText`: 12-step LED ribbon shows playhead, amber count-in countdown, and red recording note pips. Readout announces exact step numbers and keys.
3. `index.html` & `styles.css`: Added `#looper-steps` 12-column grid. Added `.is-armed` (pulsing amber) and `.is-recording` (pulsing red) button and step styles. Accessible $\ge 0.6$rem text.
4. `docs/DECISIONS.md`: Recorded D-045.
5. `docs/manual.json` & `manual.html`: Documented arming, count-in, sync, and step tracker.

**Verified:**
- 161/161 Node checks.
- Static checks verify `#looper-steps`, `.is-count-in`, `.is-recording`, and step rendering.
- `tools/manual.py check docs/manual.json` passes with 0 errors.

**Next session should start with:** Maintainer hands-on testing of loop machine arming, count-in, and sync, or proceeding with P5-29 Wave 3 (feel) / P4-02.

### Session 60: 2026-10-21: six new chord qualities and six new genres (P5-29 wave 2)

**Contributor:** Claude Code with maintainer direction

**Goal:** Implement P5-29 wave 2 (D-041): six new chord qualities (`min7`, `maj7`, `half_diminished`, `augmented`, `sus4`, `major_6`), then six new Inform 7 genres (Bossa Nova Salon, Baroque Chorale, Gothic Horror Organ, Gospel Shout & Revival, Tango Habanera, Neo-Soul Lo-Fi).

**Done:**
- D-041 is accepted for waves 1 and 2. Wave 2 is implemented and all 160 checks pass.

**Changed:**
1. Chord qualities:
   - `src/conductor.mjs`: added `min7`, `maj7`, `half_diminished`, `augmented`, `sus4`, and `major_6` to `CHORD_QUALITIES`, `MAJOR_THIRD_QUALITIES`, `buildTriad()`, `chordLabelFor()`, `buildFunChord()`, and Befunge plate `qualityShort`.
   - `src/variation.mjs`: added pitch classes to `TONES`, updated `MINORISH`, `numeral()`, and relative substitutions.
   - `src/session.mjs`: added new qualities to `CHORD_QUALITY_IDS` for session validation.
   - `src/inform.mjs`: normalize Inform 7 kinds `half-diminished` -> `half_diminished` and `major 6` -> `major_6`.
2. `src/rulebooks.ni` adds Chapters 13–18 (Raw Chaos moves to Chapter 19), bringing the catalog to 19 genres across 5 menu families:
   - Bossa Nova Salon (NIGHT CLUB): maj7 and min7, ii-V-I changes, syncopated bass, organ voicing {third, fifth, seventh}.
   - Baroque Chorale (SACRED & EARLY): circle of fifths, half-diminished pre-dominant, contrary-motion bass.
   - Gothic Horror Organ (ESOTERIC): chromatic mediant P/L walk, augmented chords, pedal bass.
   - Gospel Shout & Revival (SACRED & EARLY): I6, IV, sus4 "amen" cadences, walking bass.
   - Tango Habanera (FOLK & DANCE): half-diminished ii, V7, habanera bass walk.
   - Neo-Soul Lo-Fi (NIGHT CLUB): min9, maj7, min7, soft chord-member lead melodies.
   Six new Fun Machine progression tables added to Part 3 (`Table of Ipanema Stroll`, `Table of Chorale Cadence`, `Table of Crypt Mediants`, `Table of Revival Amen`, `Table of Salon Tango`, `Table of Cassette Velvet`).
3. Clash ceilings & variation tests:
   - `tests/clashes.test.mjs` sets ceilings for the 6 new genres (measured at 0.0%–0.8% clash rates).
   - `tests/variation.test.mjs` sets distinct varied progression floors (bossa 50, baroque 18, gothic 8, gospel 10, tango 10, neo-soul 50).
   - Golden and variation fixtures re-frozen with additions only.
   - Asset version stamped to `ae35645dac6b`.
   - `manual.html` rebuilt from `docs/manual.json`.

**Verified:**
- 160/160 Node checks.
- Golden fixtures contain additions only; existing 13 genres unchanged.
- Documentation consistency checks pass (0 errors, 0 warnings).

**Next session should start with:** Maintainer listen to the six Wave 2 genres in the browser, or Wave 3 (feel) / P4-02.

### Session 59: 2026-10-21: six new genres, all in Inform 7 (P5-29 wave 1)

**Contributor:** Claude Code with maintainer direction

**Goal:** Restore the Fun Machine's status line, then P5-29 wave 1 (D-041): six genres with no new chord qualities, plus menu families.

**Done:**
- The status line was pushed (f53b4d9).
- D-041 is accepted for wave 1. Wave 1 is done.

**Changed:**
1. `src/rulebooks.ni` adds Chapters 7–12 (Raw Chaos moves to 13), each with changes, a Fun Machine progression, melody, bass walk, overtones, and permitted moves:
   - Doo-Wop Parlor Ballad: I-vi-IV-V7.
   - Sacred Harp: open i5 and ♭VII5, then ♭III and v.
   - Andalusian Flamenco: i-♭VII-♭VI-V Phrygian ♭9.
   - Klezmer Freygish: a Phrygian-dominant I, iv, ♭vii, ♭II, with melody tone rules admitting ♭2 and ♭6 when loose.
   - Sea Shanty & Hornpipe: I-IV-I-V.
   - Silent-Film Lydian: Imaj9-II-vii-I Lydian.

   Six new Fun Machine progression tables, plus a `family` property for every genre.
2. `src/inform.mjs` reads `family` (optional). `src/app.mjs` `buildGenreMenu()` groups options into optgroups by family, in source order, with THE CREATURE'S OWN first.
3. Tests:
   - genre order, insistence, and families (inform);
   - the octave member in the melody cross-check reference;
   - 13 genres (oracle);
   - clash ceilings and variety floors for the new genres;
   - the static menu check.

   Golden and variation fixtures re-frozen with additions only.

**Verified:**
- 160/160 Node checks.
- Golden fixture: 677 existing entries identical once interned indices are resolved (Raw Chaos's chord moved from index 176 to 193), and 544 added; it is now 1.29 MB. Variation fixture: 144 unchanged, 144 added.
- New genres clash on 0–6% of steps as written and at most 8% varied, with 15–42 distinct varied progressions over 80 creatures.
- In the browser, the menu shows five families, and all six new genres played with titles and VARIATION lines. The keyboard and Kapellmeister body never moved.

**Verified by ear:** The maintainer listened across the new genres and approved ("in love").

**Next session should start with:** D-041 wave 2 (six chord qualities, then six genres) or P4-02.

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



