# Archived Session Log

Active handoff state and the latest ten sessions live in [../HANDOFF.md](../HANDOFF.md).

### Session 1: 2026-10-17: first summoning

**Contributor:** Codex with maintainer direction

**Goal:** Specify and prototype a whimsical zero-dependency browser app in LOLCODE.

**Done:** P1-01, P1-02, P2-01, P2-02, P2-03

**Changed:** Created the project specification, interpreter, spell, score boundary, interface, animation, audio instrument, and tests.

**Decisions:** D-001 through D-004

**Verified:** Nine Node checks passed; documentation checker reported 0 errors and 0 warnings.

**Not verified:** Real browser visuals, listening quality, mobile devices, Firefox, Safari, and assistive technology.

**Problems:** Standard LOLCODE lacks browser media APIs; D-002 assigns score composition to LOLCODE and instrument duties to a narrow host.

**Left undone:** P3, P4, P5, and P6 roadmap items.

**Next session should start with:** P4-01.

### Session 2: 2026-10-17: the omen keeps humming

**Contributor:** Codex with maintainer direction

**Goal:** Loop sound continuously and expand repeated musical, visual, and naming outcomes.

**Done:** P5-01; expanded P2-02 behavior

**Changed:** Added a continuous look-ahead audio scheduler, twelve-note phrases, eight scales, six rhythms and voice stacks, ten shape families, larger visual ranges, and six ceremonial name templates with larger vocabularies.

**Decisions:** D-005 supersedes the fixed-duration part of D-004.

**Verified:** Eleven Node checks passed; documentation checker and whitespace review passed.

**Not verified:** Listening continuity, subjective mix, animation quality, and cross-browser behavior.

**Problems:** None at handoff update time.

### Session 3: 2026-10-17: eyes with opinions

**Contributor:** Codex with maintainer direction

**Goal:** Replace repeated stamped eyes with varied anatomy and expression.

**Done:** P5-02

**Changed:** Added eight eye silhouettes, eight iris treatments, eight pupil geometries, six layouts, eight gaze directions, size variation, and per-eye color shifts driven by new LOLCODE score fields.

**Decisions:** D-006

**Verified:** Eleven Node checks passed, including score ranges and 256-phrase coverage of every categorical eye variant; documentation checker reported 0 errors and 0 warnings.

**Not verified:** Subjective eye rendering, clipping, and legibility in real browsers.

**Problems:** None at handoff update time.

**Left undone:** P3, P4, and P6 roadmap items.

**Next session should start with:** P4-01.

### Session 4: 2026-10-17: impossible geometry with boundaries

**Contributor:** Codex with maintainer direction

**Goal:** Replace pulse-dominated blobs with complex self-contained forms that have their own kinetic movement.

**Done:** P5-03

**Changed:** Added five deterministic kinetic score fields, eight silhouette-flux grammars, and eight internal motion systems. The tesseract renderer rotates in four dimensions before two-stage perspective projection; every system is clipped to the currently deforming body. Reduced the shared beat pulse so it no longer dominates motion.

**Decisions:** D-007

**Verified:** Twelve Node checks passed, including 256-phrase categorical coverage and structural boundary containment; documentation checker reported 0 errors and 0 warnings.

**Not verified:** Subjective motion quality, frame rate, clipping, and legibility in real browsers.

**Problems:** None at handoff update time.

**Left undone:** P3, P4, and P6 roadmap items.

**Next session should start with:** P4-01.

### Session 5: 2026-10-17: no more macroblock heartbeat

**Contributor:** Codex with maintainer direction

**Goal:** Remove the glitchy, compression-artifact quality from sound-synchronous body movement.

**Done:** Incidental rendering fix; no roadmap item added.

**Changed:** Replaced the six-percent, eighth-power beat spike with a continuously differentiable 1.2% peak-to-peak sinusoidal scale envelope. Independent boundary flux and kinetic-core movement are unchanged.

**Decisions:** No new durable decision; this corrects the pulse treatment already defined by D-007.

**Verified:** Thirteen Node checks passed, including a regression marker for the smooth envelope; documentation checker reported 0 errors and 0 warnings.

**Not verified:** Subjective visual quality in a real browser remains P4-01.

**Problems:** None at handoff update time.

**Left undone:** P3, P4, and P6 roadmap items.

**Next session should start with:** P4-01.

### Session 6: 2026-10-17: let the geometry keep its footing

**Contributor:** Codex with maintainer direction

**Goal:** Remove the beat-periodic jitter still visible after smoothing the scale envelope.

**Done:** Incidental rendering correction; no roadmap item added.

**Changed:** Removed audio-pulse-driven Canvas scaling completely. Boundary flux, internal kinetic systems, eye behavior, and slow orbital drift are unchanged.

**Decisions:** D-008 supersedes the retained beat-scale portion of D-007.

**Verified:** Reviewed the supplied 3.25-second, 757×648 H.264 screencast frame by frame; hard vertical update bands coincide with whole-creature beat changes. Thirteen Node checks passed, including a regression check that the visual draw path does not consume `score.pulse`; documentation checker reported 0 errors and 0 warnings.

**Not verified:** A follow-up capture of the corrected renderer and cross-browser sensory review remain P4-01.

**Problems:** The first correction made the scale envelope mathematically smooth but did not prevent large synchronous repaints from reading as jitter.

**Left undone:** P3, P4, and P6 roadmap items.

**Next session should start with:** Re-record the same creature, then continue P4-01.

### Session 7: 2026-10-17: take the fog machine off the linework

**Contributor:** Codex with maintainer direction

**Goal:** Correct persistent animation judder without sacrificing kinetic motion or audio playback.

**Done:** Incidental Canvas performance fix; no roadmap item added.

**Changed:** Scoped the large silhouette shadow blur to the single body-fill pass and explicitly disabled shadow blur inside the kinetic renderer. Previously every internal line, ring, and eye inherited a blur as large as 62 pixels, multiplying per-frame compositing work.

**Decisions:** No new durable product decision; this corrects leaked Canvas state.

**Verified:** Fourteen Node checks passed, including a regression check that the body blur is restored before kinetic linework; the continuous audio scheduler marker still passes; documentation checker reported 0 errors and 0 warnings.

**Not verified:** Follow-up subjective motion and audio playback in the maintainer's browser remain P4-01.

**Problems:** The prior beat-decoupling change removed one synchronized repaint but did not address the underlying leaked blur cost. A page reload also stops the old audio context; playback requires a new Summon gesture under browser autoplay policy.

**Left undone:** P3, P4, and P6 roadmap items.

**Next session should start with:** Summon the same phrase after reload and record frame pacing; then continue P4-01.

### Session 8: 2026-10-17: give the oracle a volume knob

**Contributor:** Codex with maintainer direction

**Goal:** Make quiet generated voices easier to hear and give the listener direct loudness control.

**Done:** P5-04

**Changed:** Raised the dry-mix target from `0.19` to `0.28`, routed the wet delay through the compressor, and added a labeled 0–100 master-volume slider with a perceptual gain curve, live 18-millisecond ramps, and a stronger default setting.

**Decisions:** D-009

**Verified:** Fifteen Node checks passed, including control labeling, default value, stronger mix, compressor routing, and live gain-ramp markers; documentation checker reported 0 errors and 0 warnings.

**Not verified:** Perceived loudness, clipping, compressor pumping, and slider presentation in real browsers remain P4-01 and P4-02 work.

**Problems:** None at handoff update time.

**Left undone:** P3, P4, and P6 roadmap items.

**Next session should start with:** Listen to several sparse and dense creatures at default and maximum volume, then continue P4-01.

### Session 9: 2026-10-17: twelve notes walk into infinity

**Contributor:** Codex with maintainer direction

**Goal:** Give every creature a deterministic repeating melody with explicit arpeggio and chromatic vocabularies.

**Done:** P5-05

**Changed:** Added LOLCODE-selected melody family and rotation fields, a pure twelve-step motif engine, twelve named melodic families, transport-level motif caching, and a visible motif label in the score readout.

**Decisions:** D-010

**Verified:** Sixteen Node checks passed, including all score ranges, coverage of all twelve families across 256 phrases, and exact major-arpeggio plus ascending and descending chromatic sequences; documentation checker reported 0 errors and 0 warnings.

**Not verified:** Musicality, loop transitions, register balance, and the score-label layout in real browsers remain P4-01 work.

**Problems:** None at handoff update time.

**Left undone:** P3, P4, and P6 roadmap items.

**Next session should start with:** Listen across all twelve named motifs, then continue P4-01.

### Session 10: 2026-10-17: the parlor vitrine opens and answers the glass

**Contributor:** Codex and Antigravity with maintainer direction

**Goal:** Replace the futuristic interface and intermediate pastel storybook draft with a bespoke, esoteric, old-timey macabre parlor cabinet and make the apparition vitrine interactive on tap, hold, and drag.

**Done:** P5-06, P5-07

**Changed:** Rebuilt `index.html` and `styles.css` as an aged vellum, ebonized wood, oxblood, and tarnished brass spiritualist cabinet with engraved old-style serif and telegraph-monospace typography, inline SVG eye crest and astrolabe spandrels, a bell-jar apparition vitrine, centered Canvas coordinates, a lined calling-slip form, and an ebony telemetry drawer. Added pointer gesture handling on `#vision` for tap/click, press-and-hold, and hold-and-drag that drives synthesized strike, ratchet, and step percussion, continuous pitch/filter/echo modulation, shape-family morphing, directional lobe tugging, gaze tracking, and vitrine ripples.

**Decisions:** D-011, D-012

**Verified:** Eighteen Node checks passed, including the serif-display stack, centered stage, symmetrical grid, vitrine gesture and percussion markers, and existing accessibility and dependency markers; headless Chromium captures confirmed desktop and mobile vitrine bounds; documentation checker reported 0 errors and 0 warnings.

**Not verified:** Subjective fidelity, exact installed-font rendering, vertical rhythm, text collision, and responsive composition in real browsers remain P4-01 work.

**Problems:** None at handoff update time.

**Left undone:** P3, P4, and P6 roadmap items.

**Next session should start with:** Review the cabinet at desktop and phone widths, then continue P4-01.

### Session 11: 2026-10-18: the esoteric jam band takes the stage

**Contributor:** Antigravity with maintainer direction

**Goal:** Add a Malbolge ternary beat generator (`P5-08`), spec out and implement the full six-language esoteric jam band (`P5-09` through `P5-13`), verify full browser functionality (`P4-01`), add privacy-preserving `#omen=...` URL sharing (`P3-01`) and 1200×1520 broadsheet PNG plate export (`P3-02`), and harmonize all six esoteric players with an Euler-Tonnetz & Euclidean harmonic conductor (`P5-14`).

**Done:** P3-01, P3-02, P4-01, P5-08, P5-09, P5-10, P5-11, P5-12, P5-13, P5-14

**Changed:** Added `src/malbolge.mjs` and `src/beat.mal` (Plate II), `src/brainfuck.mjs` and `src/bass.bf` (Plate III), `src/befunge.mjs` and `src/harmony.bfg` (Plate IV), `src/fractran.mjs`, `src/pad.piet`, and `src/chimes.frac` (Plate V), `src/shakespeare.mjs` and `src/chant.spl` (Plate VI), `src/share.mjs` (`encodeOmenHash`, `decodeOmenHash`, `buildShareUrl`, `specimenFilenameFor`), and `src/conductor.mjs` (`eulerGradus`, `semitoneGradus`, `applyTonnetzOperation`, `buildTonnetzSpine`, `bjorklund`, `conductEnsemble`). Extended `src/oracle.lol` and `src/score.mjs` with causal fields for all six languages. Added interactive 12-step matrices, synthesized multi-language Web Audio busses, the Parlor Bandstand Six-Language Ensemble Console, `#share-link` URL fragment sync/copy, and `#export-png` 1200×1520 broadsheet PNG rendering in `index.html`, `styles.css`, and `src/app.mjs`. Added milestone P5-15 to `ROADMAP.md` for granular user-controlled music-theory and genre rulebooks.

**Decisions:** D-013, D-014, D-015, D-016

**Verified:** Thirty Node checks passed, including all six esoteric language interpreters, Euler *Gradus Suavitatis* consonance, Neo-Riemannian *Tonnetz* involutions, Bjorklund Euclidean rhythms, ensemble harmonization, shareable URL fragment round-tripping, deterministic PNG filename generation, and UI/audio scheduler markers; maintainer verified full functionality in browser (P4-01); documentation checker reported 0 errors and 0 warnings across 14 documents.

**Not verified:** Assistive-technology and screen-reader testing remains P4-02 work.

**Problems:** None at handoff update time.

**Left undone:** P5-15, P4-02, and P6-01 roadmap items.

**Next session should start with:** P5-15, P4-02, or P6-01 when ready.

### Session 12: 2026-10-18: the mycelium colonizes the parlor glass

**Contributor:** Antigravity with maintainer direction

**Goal:** Introduce a procedural mycelial/fungal layer (P5-16, D-017) where the parlor specimen can "grow" branching mycelial networks (hyphae) and sprouting fungal fruiting bodies (sporophores) with ballistospore particle dispersion.

**Done:** P5-16

**Changed:** Added LOLCODE-owned `fungal_form`, `fungal_hyphae`, `fungal_spores`, and `fungal_bloom` score parameters to `src/oracle.lol` and validated in `src/score.mjs`. Implemented `buildMycelialNetwork()`, `buildFruitingBodies()`, `buildSporeSystem()`, `drawMycelium()`, `drawFruitingBodies()`, and `updateAndDrawSpores()` in `src/app.mjs`. Rendered eight distinct sporophore archetypes (`AGARIC CAP`, `BRACKET CONK`, `CORAL CLAVARIA`, `BIOLUMINESCENT BONNET`, `CUP PEZIZA`, `MOREL HONEYCOMB`, `GLOBULAR PUFFBALL`, `HYPHAL HYDRA`). Added spore burst on vitrine tap (`vision.burstSpores()`), mycelial growth acceleration on vitrine hold, `#score-fungal` catalog telemetry in `index.html` and `styles.css`, and broadsheet PNG plate metadata. Documented in `docs/manual.json` (entry 24) and rebuilt `manual.html`.

**Decisions:** D-017

**Verified:** Thirty-one Node checks passed, including all interpreter tests, conductor mathematics, and mycelial/fruiting body structural tests; documentation checker reported 0 errors and 0 warnings across 14 documents; 3x manual validator reported 6 sections, 24 entries, 0 warnings.

**Not verified:** Dedicated assistive-technology and screen-reader testing remains P4-02 work.

**Problems:** None at handoff update time.

**Left undone:** P5-15, P4-02, and P6-01 roadmap items.

**Next session should start with:** P5-15, P4-02, or P6-01 when ready.

### Session 13: 2026-10-18: recording the chamber loop & botanical vitrine staging

**Contributor:** Antigravity with maintainer direction

**Goal:** Implement client-side uncompressed 16-bit WAV loop export (`P3-03`, `D-018`), bio-acoustic sonification (action potentials, droplet chimes, spore puffs), Victorian vitrine botanical staging (turned-wood pedestal, peat bed substrate, curved glass dew condensation), and Ernst Haeckel lithographic sporophore engravings (`P5-16`, `D-018`).

**Done:** P3-03, P5-16

**Changed:**
1. Implemented dependency-free pure JavaScript 16-bit stereo PCM RIFF/WAVE encoder `audioBufferToWavBlob()` and updated `specimenFilenameFor(score, "wav")` in `src/share.mjs`.
2. Implemented `exportSpecimenWav()` in `src/app.mjs` using `OfflineAudioContext` (44.1 kHz, 2-channel, 12-step cycle + 1.35s decay tail), mirroring the full conducted six-language ensemble graph and triggering `hai-oracle-<name>-<seed>.wav` downloads.
3. Added `#export-wav` (`RECORD WAV LOOP`) button to `index.html` `.reading-actions` and wired up live status feedback.
4. Added Victorian vitrine botanical staging: antique turned-wood mahogany pedestal with brass retaining ring (`drawVitrinePedestal()`), fibrous humic peat/driftwood substrate bed grounding the hyphal rootlets, and 46 persistent dew condensation micro-droplets clinging along the curved glass profile of the vitrine bell jar (`buildGlassCondensation()`, `drawGlassCondensation()`).
5. Enriched all eight sporophore archetypes with Ernst Haeckel-style lithographic anatomical details: radiating lamellae with secondary lamellulae, stippled veil verrucae, sulcate concentric growth ridges, fimbriate eyelash fringe margins, and scalariform alveoli chambers.
6. Added bio-acoustic sonification: dedicated `fungalBus`, micro-voltage mycelial action-potential click trains (`scheduleFungalBioStep()`), guttation droplet chimes, and tactile ballistospore release pops (`triggerSporePuff()`) responding to vitrine disturbances and spore bursts.
7. Documented entry 25 (`deterministic-wav-export`) and enriched entry 24 in `docs/manual.json`, rebuilding `manual.html` with zero warnings.
8. Added decision `D-018` in `docs/DECISIONS.md` and updated `ROADMAP.md` (`P3-03`, `P5-16`).

**Decisions:** D-018

**Verified:** Thirty-one Node unit and static tests passed; `tools/check_docs.py` passed with 0 errors and 0 warnings across 14 documents; `tools/manual.py` check passed with 6 sections, 25 entries, 0 warnings; `manual.html` rebuilt (121,532 bytes).

**Not verified:** Dedicated assistive-technology and screen-reader testing remains P4-02 work.

**Problems:** None at handoff update time.

**Left undone:** P5-15, P4-02, and P6-01 roadmap items.

**Next session should start with:** P5-15, P4-02, or P6-01 when ready.

### Session 14: 2026-10-18: the kapellmeister console, antique parlor room acoustics & vitrine modulation audit

**Contributor:** Antigravity with maintainer direction

**Goal:** Implement the Kapellmeister music-theory and genre rule console (`P5-15`, `D-019`), antique parlor room acoustic space (wax-cylinder noise, parlor convolution reverb, clockwork escapement ticking), and audit and restore vitrine organism mobility and full-ensemble modulation (`D-012`).

**Done:** P5-15, D-012 audit & enhancement

**Changed:**
1. Implemented six selectable music-theory rulebooks in `src/conductor.mjs`: `VICTORIAN NEO-RIEMANNIAN TONNETZ`, `12-BAR DELTA & PARLOR BLUES`, `SMOKY PARLOR JAZZ & EXTENDED TONNETZ`, `PALESTRINA MODAL COUNTERPOINT`, `MYSTIC BYZANTINE & HIMALAYAN DRONE`, and `RAW ESOTERIC CHAOS (UNFETTERED VMS)`.
2. Implemented genre-specific harmonic progression generators (`buildGenreSpine()`, `buildBluesSpine()`, `buildJazzSpine()`, `buildCounterpointSpine()`, `buildModalDroneSpine()`, `buildRawChaosSpine()`) and enhanced `projectConsonantPitch()` to respect genre constraints (blues $\flat 5$ notes, jazz guide-tone voice leading, Palestrina downward suspensions, and Euler consonance filtering).
3. Created the Kapellmeister Console interface (`#kapellmeister-engine`) in `index.html` and `styles.css` with a genre selector, Euler consonance strictness slider ($3\dots 14$), live harmonic dashboard (`#harmonic-step`, `#harmonic-chord`, `#harmonic-vector`, `#harmonic-euler`), and an animated 4-region SVG Tonnetz compass lattice (`.tonnetz-compass-svg`).
4. Implemented the Antique Parlor Room Acoustic Space (`#parlor-acoustics-engine`) in `src/app.mjs`:
   - 3.0-second procedural Edison wax-cylinder surface noise buffer with acoustic horn resonance ($350\text{--}3200\,\text{Hz}$), Poisson dust pops, and 78 RPM turntable groove rumble (`ensureWaxCrackleBuffer()`).
   - 1.6-second wood-and-velvet chamber convolution impulse response (`ensureParlorImpulseResponse()`) loaded into a `ConvolverNode` with dry/wet ambience control.
   - Mechanical brass clockwork mantel clock escapement ticks ($2600\,\text{Hz}$ "tick" and $1800\,\text{Hz}$ "tock") synthesized on quarter-beats ($t = 0, 3, 6, 9$).
5. Audited and revitalized vitrine organism mobility and full-ensemble modulation (`D-012`):
   - Expanded physical specimen displacement from 14% to 32% of stage width and 24% of height, with kinetic squash-and-stretch along the drag vector and magnetic lobe reach toward the cursor.
   - Integrated native Web Audio `StereoPannerNode` on the organism's voice, smoothly spatializing sound across the stereo field ($-0.85$ left to $+0.85$ right) as the creature is moved around the bell jar.
   - Added continuous real-time drone choir pitch-glide (up to $\pm 140$ cents) and raised-cosine harmonic beating tracking vertical displacement (`interaction.pitchBend`), giving expressive theremin-like vocal performance.
   - Routed all melodic and harmonic accompaniment busses (Befunge organ, Piet/FRACTRAN chimes, Shakespeare choir, bio-acoustic fungi) through the master vitrine chamber filter, opening up to $5200\,\text{Hz}$ on high drags and dropping to $220\,\text{Hz}$ on low drags, with accompanying interval and vowel formant shifts.
   - Upgraded drag haptics to track cumulative distance, triggering clockwork ratchet clicks, spore puffs, and vitrine ripples along any drag path.
   - Swelled parlor convolution reverb resonance when approaching the perimeter of the curved glass bell jar.
6. Wired both real-time playback (`playScore()`) and offline 16-bit WAV loop export (`exportSpecimenWav()`) to respect active genre selections and render parlor room acoustics.
7. Added comprehensive unit and static tests for all six genre rulebooks, chord labels, UI controls, and enhanced interaction modulation in `tests/oracle.test.mjs` and `tests/static.test.mjs`.
8. Documented entry 26 (`kapellmeister-genre-console`) and entry 27 (`antique-parlor-acoustics`) in `docs/manual.json` and rebuilt `manual.html` (132,393 bytes, 0 warnings).
9. Recorded decision `D-019` and updated `D-012` in `docs/DECISIONS.md`; updated `ROADMAP.md` (`P5-15`).

**Decisions:** D-012, D-019

**Verified:** Thirty-three Node unit and static tests passed; `tools/check_docs.py` passed with 0 errors and 0 warnings across 14 documents; `tools/manual.py` check passed with 6 sections, 27 entries, 0 warnings; `manual.html` rebuilt (132,393 bytes).

**Not verified:** Dedicated assistive-technology and screen-reader testing remains P4-02 work.

**Problems:** None at handoff update time.

**Left undone:** P4-02 and P6-01 roadmap items.

**Next session should start with:** P4-02 or P6-01 when ready.

Older sessions: [archive/sessions.md](sessions.md).

### Session 15: 2026-10-18: antique parlor acoustics overhaul & interactive layer console

**Contributor:** Antigravity with maintainer direction

**Goal:** Audit and overhaul the Antique Parlor Acoustics engine (`#parlor-acoustics-engine`, `P5-15`, `D-019`) so that Edison wax-cylinder phonograph surface noise, Victorian chamber convolution reverb, and mechanical clockwork escapement ticking are clearly audible, prominent, tactile, and independently controllable.

**Done:** P5-15, D-019 parlor acoustics audit & overhaul

**Changed:**
1. **Wax-Cylinder Surface Noise Synthesis (`ensureWaxCrackleBuffer()`)**:
   - Diagnosed root cause of inaudibility: previous bandpass filter had attenuated buffer output to $\sim -76.5\,\text{dBFS}$ RMS and $-47.6\,\text{dBFS}$ peak, completely below noise floor.
   - Re-architected procedural stereo generator (4.0s seamless loop):
     - Continuous acoustic horn friction hiss shaped with two-pole bandpass filtering ($500\text{--}3200\,\text{Hz}$).
     - Sub-bass motor rumble ($33\,\text{Hz}$ and $66\,\text{Hz}$) with periodic rotational eccentricity thud and whoosh matching $78\,\text{RPM}$ shellac / wax cylinder rotation ($T \approx 0.769\,\text{s}$).
     - High-density stylus micro-crackle: $\sim 190$ micro-pops per second with rapid asymmetric exponential decay.
     - Distinct dust pops & shellac scratch transients: $\sim 28$ pops per second with damped resonant ringing ($1800\text{--}3800\,\text{Hz}$).
     - Seamless 2400-sample boundary crossfade ensuring zero clicks on loop seam.
   - Raised playback gain target to $0.38 \times \text{level}$ (up from $0.075$), bringing peak crackle to $-15.5\,\text{dBFS}$ and RMS to $-41.4\,\text{dBFS}$ at 55% level—crisp, rich, authentic vintage needle patina without clipping.
2. **Victorian Chamber Convolution Reverb (`ensureParlorImpulseResponse()`)**:
   - Diagnosed root cause: default Web Audio `ConvolverNode.normalize = true` calculated impulse energy integral and attenuated wet output by $>10\times$ (effective $-36\,\text{dB}$ below dry signal).
   - Set `parlorConvolver.normalize = false;` across both live playback and offline WAV rendering.
   - Synthesized 1.6-second wood-and-velvet chamber impulse response with eight prominent early reflections ($t = 8\dots 138\,\text{ms}$, gains up to $0.48$) and high-frequency damped diffuse decay tail ($e^{-2.2 t}$ with wall/velvet absorption filter).
   - Raised send gain target to $0.42 \times \text{level}$ (up from $0.28$), producing an audible, rich, warm wooden parlor room acoustic bloom behind all harmonic voices.
3. **Mechanical Clockwork Escapement Ticks (`scheduleClockworkTick()`)**:
   - Diagnosed root cause: narrow bandpass filter ($Q = 4.5$) centered at $2400\,\text{Hz}$ with downward frequency sweep killed $80\%$ of oscillator energy, and tick amplitude ($0.038 \times \text{level}$) was inaudible under drum kicks.
   - Implemented dual-mechanism escapement synthesizer:
     - Quarter-beats ($t = 0, 3, 6, 9$): alternating crisp high "TICK" (steps 0, 6: $3200 \to 1400\,\text{Hz}$ strike transient + $520\,\text{Hz}$ wood casing knock, peak $0.20 \times \text{level}$) and deep low "TOCK" (steps 3, 9: $2100 \to 820\,\text{Hz}$ pallet release + $340\,\text{Hz}$ resonant grandfather clock cabinet thunk, peak $0.17 \times \text{level}$).
     - Intervening steps: delicate highpass mechanical brass gear ratchet tick ($3800 \to 2200\,\text{Hz}$ at $0.048 \times \text{level}$), creating steady clockwork pulse in 12/8 meter.
4. **Interactive Layer Toggle Controls**:
   - Converted `#chip-crackle`, `#chip-reverb`, and `#chip-tick` from static labels into accessible interactive toggle buttons (`role="button"`, `aria-pressed`, hover styling).
   - Added click event listeners allowing listeners to solo or toggle each acoustic layer individually (`parlorCrackleEnabled`, `parlorReverbEnabled`, `parlorTickEnabled`).
   - Dynamic status updater displays exactly which layers are active (`WAX CRACKLE · CHAMBER REVERB · CLOCKWORK ACTIVE` vs `PARLOR ACOUSTICS MUTED · DRY ISOLATION`).
5. **Offline WAV Loop Synchronization**:
   - Updated `exportSpecimenWav()` to mirror exact boosted crackle, un-normalized convolution reverb, clockwork escapement, and layer gates in exported 16-bit WAV files.
6. **Verification & Tests**:
   - Added static assertions verifying interactive chip elements, `normalize = false`, and event listener wiring in `tests/static.test.mjs`.

**Decisions:** D-019

**Verified:** Thirty-three Node unit and static tests passed; `tools/check_docs.py` passed with 0 errors and 0 warnings across 14 documents; `tools/manual.py` check passed with 6 sections, 27 entries, 0 warnings.

**Not verified:** Dedicated assistive-technology and screen-reader testing remains P4-02 work.

**Problems:** None at handoff update time.

**Left undone:** P4-02 and P6-01 roadmap items.

**Next session should start with:** P4-02 or P6-01 when ready.

### Session 16: 2026-10-19: the kapellmeister conductor awakens with authentic genre rulebooks & walking bass

**Contributor:** Antigravity with maintainer direction

**Goal:** Audit and overhaul the Kapellmeister Music-Theory & Genre Rulebook Console (`#kapellmeister-engine`, `P5-15`, `D-019`) so that switching between the six historical and theoretical genres produces unmistakable, dramatic audiovisual and musical transformations, the Euler Gradus strictness slider ($G \le 3\dots 14$) smoothly sieves harmonic consonance, and all plate grids, telemetry bars, and compass indicators update synchronously on user interaction.

**Done:** P5-15, D-019 Kapellmeister conductor audit and overhaul.

**Changed:**
1. **Genre Rulebooks & Harmonic Conductors (`src/conductor.mjs`)**:
   - **Authentic Walking Basslines (`conductedBass`)**:
     - `12-BAR DELTA & PARLOR BLUES`: Walks authentic chord root, 3rd, 5th, and 6th/b7th degrees (`[0, 4, 7, 9, 0, 4, 0, 7, 0, 0, 0, 0]`) locking to the 12-bar progression (I7 $\to$ IV7 $\to$ I7 $\to$ V7 $\to$ IV7 $\to$ I7 $\to$ V7 turn) with driving quarter-note gates.
     - `SMOKY PARLOR JAZZ & EXTENDED TONNETZ`: Implements an authentic upright acoustic walking bass line with chromatic passing/approach tones (`[0, 4, 10, 0, 7, 3, 0, 5, 0, 0, 7, 11]`) enclosing each downbeat of the chord changes (Imaj9 $\to$ vi9 $\to$ ii9 $\to$ $\flat$II7alt tritone sub).
     - `MYSTIC BYZANTINE & HIMALAYAN DRONE`: Sustained sub-bass pedal on tonic root with 4th-step open fifths.
     - `PALESTRINA MODAL COUNTERPOINT`: Contrary-motion stepwise cantus firmus resolving to the Picardy third cadence at step 11.
     - `VICTORIAN NEO-RIEMANNIAN TONNETZ`: Root/fifth/third triad voice-leading.
   - **Accompaniment Plate Labels & Feedback**:
     - `conductedBass`: Steps dynamically compute their note name and register/slide decoration (`PITCH_NAMES[absRoot]`, e.g., `E♭`, `G`, `B♭+~`, `C+`).
     - `conductedHarmony`: Steps display conducted chord quality and mirror orientation (e.g., `E♭7/`, `A♭7\`, `E♭M9/`, `Cm9\`, `E5/`).
     - `conductedChant`: Steps display dramatis persona and conducted vowel pitch (e.g., `HAM·G`, `PRO·C`, `HEC·E`).
     - `conductedChimes`: Steps update ratio labels and indicate `REST` on Euclidean hockets.
   - **Euler Gradus Consonance Sieve (`projectConsonantPitch`)**:
     - Rewrote sieve to utilize a precomputed `SEMITONE_GRADUS` lookup table ($G = 1\dots 11$).
     - Lower strictness ($G \le 3\dots 5$) strictly sieve raw VM pitches to pure unisons, octaves, and fifths; moderate strictness ($G \le 7\dots 9$) permits sweet major and minor thirds; permissive settings ($G \le 10\dots 14$) open up full chromatic extensions, blue notes ($\flat 5$), and dissonant intervals.
2. **UI Wiring & State Mutation Bleed Prevention (`src/app.mjs`)**:
   - Wired `#kapellmeister-telemetry` into `elements` (previously omitted from `elements`, preventing telemetry text from updating).
   - Introduced `rawBeat`, `rawBass`, `rawHarmony`, `rawChimes`, `rawChant` references. Re-conducting now always pulls from pristine virtual machine outputs or active mutation shifts rather than re-conducting already-conducted structures, preserving exact VM purity when returning to `RAW ESOTERIC CHAOS`.
   - Updated `applyEnsembleConductor()` to synchronously refresh plate grid buttons (`updateBassGrid`, `updateHarmonyGrid`, `updateChimeGrid`, `updateChantGrid`), `#kapellmeister-telemetry`, and active step indicators (`highlightBeatStep(activeBeatStep)`).
   - Cell click cycling on accompaniment plates updates the raw state and re-conducts live sound and visuals immediately.
3. **Automated Verification (`tests/oracle.test.mjs`)**:
   - Expanded Kapellmeister test suite to assert note and chord labels across Blues, Jazz, Drone, Counterpoint, and Raw Chaos.
   - Verified that `RAW_CHAOS` preserves the exact byte-for-byte outputs of all virtual machines.

**Decisions:** Fulfills and refines D-016 and D-019.

**Verified:** 33/33 Node checks passed (`node --test tests/*.test.mjs`), `python3 tools/check_docs.py` reported 0 errors and 0 warnings, `python3 tools/manual.py check docs/manual.json` passed with 0 warnings.

**Not verified:** Assistive-technology and screen-reader testing remains P4-02 work.

**Problems:** None.

**Left undone:** P4-02 and P6-01 roadmap items.

**Next session should start with:** P4-02 assistive technology and screen reader checks.

### Session 17: 2026-10-19: esoteric fun machine real-time play-along keyboard & loop sequencer

**Contributor:** Antigravity with maintainer direction

**Goal:** Implement the Esoteric Fun Machine (`#fun-machine-engine`, `P5-17`, `D-020`) auto-chord organ console, enabling users to play along with summoned creatures in real time on an interactive 13-key manual (`C..C'`) and physical computer keyboard (`[A..K]`), trigger one-finger chord progressions and ensemble accompaniment bursts on demand, and punch custom chords into the 12-step loop sequencer for live jam sessions and offline 16-bit WAV downloads. Place the Fun Machine at the very top of the plate stack and resolve interactive audio scheduling so key strikes are immediately audible and punchy.

**Done:** P5-17, D-020 Esoteric Fun Machine play-along manual, auto-chord engine, and punch-in sequencer matrix.

**Changed:**
1. **Plate Stack Relocation (`index.html`, `styles.css`)**:
   - Relocated `<section class="beat-engine fun-machine-engine" id="fun-machine-engine">` to the very top of the accompaniment plates stack, positioned directly beneath the central apparition vitrine and creature replay/export deck (Plate I) and immediately above Plate II Malbolge ternary beat generator (`#beat-engine`). This places the keyboard manual and punch-in sequencer in immediate, prominent view for play-along sessions.
2. **Interactive 13-Key Ivory & Ebony Keyboard Manual (`src/conductor.mjs`, `index.html`, `styles.css`)**:
   - `FUN_KEY_MAP`, `FUN_KEY_BY_CODE`, and `FUN_KEY_BY_KEY`: 13 chromatic keys from semitone 0 (`C`) to 12 (`C'`), mapping 8 ivory white keys and 5 ebony black keys to physical computer keyboard shortcuts (`KeyA, KeyW, KeyS, KeyE, KeyD, KeyF, KeyT, KeyG, KeyY, KeyH, KeyU, KeyJ, KeyK`) and letter keys (`A..K`).
   - Positioned black keys proportionally with vintage stepped keytops, active press transforms, brass glows, and dynamic chord preview labels (`#fun-chord-0` to `#fun-chord-12`) that update instantly with genre and quality changes.
   - Screen buttons and physical keys support pointer, click, and keyboard events, with phrase input, repeat spam, and modifier key guards. Removed `e.preventDefault()` on pointerdown to preserve browser user-activation tokens required for Web Audio autoplay unlock across all platforms.
3. **Dual-Oscillator Reed Organ Audio Engine & Lookahead Scheduling (`src/app.mjs`)**:
   - Fixed interactive audio scheduling in `scheduleFunMachineChord()`, `scheduleFunMachineLeadNote()`, and `triggerFunKey()`: replaced fragile $8\,\text{ms}$ exponential ramps that could evaluate in the past on main-thread events with lookahead-protected $22\,\text{ms}$ linear attack ramps (`linearRampToValueAtTime`) and doubled peak voice gain (from $0.14$ to $0.28$) with a dual-oscillator sawtooth reed generator, sub-octave triangle body, a 5.5 Hz vibrato LFO, and a $2400\,\text{Hz}$ lowpass formant filter.
   - Wired a dedicated `funBus` (gain $0.88$) into `playScore` and `renderWavAudioBuffer` transports connected to compressor and output, ensuring both live key manual strikes and custom loop progression steps project clearly over the six-language backing track without clipping or attenuation.
   - Updated `setMasterVolume()` to modulate `funMachineDryGain` when playing the organ in standalone mode (with transport idle).
   - In `AUTO-CHORD: ONE-FINGER` mode, striking a key harmonizes the chord via `buildFunChord()`, plays the organ voice, and fires synchronized accompaniment bursts (Brainfuck walking bass, Befunge chord organ, Shakespeare formant choir, Piet chimes) scheduled with safe lookahead.
   - In `LEAD SOLO: MANUAL NOTE` mode, keys play single lead notes over the backing track.
4. **Unchained Sustained Organ Voices Over Accompaniment (`src/conductor.mjs`, `src/app.mjs`)**:
   - Decoupled keyboard chords completely from 16th-note tempo clock steps, eliminating the jittering/stuttering and step-chopping artifacts caused by re-triggering voices on each sequencer tick.
   - `startFunMachineVoice(context, destination, chord, semitone, mode)`: Fires a rich, dedicated dual-oscillator reed organ voice (sawtooth + sub triangle + 5.5 Hz parlor vibrato + 2400 Hz formant lowpass filter) that sustains continuously and smoothly over top of the backing accompaniment for as long as the key is held down.
   - `stopFunMachineVoice(semitone, immediateCrossfade)`: On key release, provides a natural 0.20s organ pipe release fade (with a 0.40s minimum ring-out on quick taps); when switching keys, executes a seamless 40ms crossfade between chords without clicks or voice pileups.
   - `playScore()` now solely plays sequenced custom chords from `customProgression` when no manual key is held, while punch-in recording stamps passing beat steps without chopping or restarting the live held voice.
   - `buildFunProgression(rootSemitone, quality, genre, tonicRoot)`: Provides harmonic progression metadata, step mappings, and telemetry summaries across all Kapellmeister genres and qualities.
   - Global `window.pointerup`, `pointercancel`, and `window.blur` listeners guarantee clean voice release without stuck keys.
5. **One-Finger Auto-Chord Harmonization & Quality Chips (`src/conductor.mjs`, `index.html`, `src/app.mjs`)**:
   - 7 chord quality selector chips (`AUTO-GENRE`, `MAJOR`, `MINOR`, `DOM 7TH`, `MAJ 9TH`, `DIMINISHED`, `OPEN 5TH`).
   - In `AUTO-GENRE`, chords resolve according to the active Kapellmeister genre (Blues $\to$ dom7, Jazz $\to$ maj9/min9, Tonnetz $\to$ major/minor, Counterpoint $\to$ minor/major, Drone $\to$ open fifth). Clicking quality chips while a key is held immediately re-evaluates the active progression melody.
6. **12-Step Loop Sequencer Matrix & Punch-In Recording (`#fun-sequence-grid`, `#fun-machine-rec`, `#fun-machine-reset`)**:
   - Renders 12 step pills showing step index, chord label, and `★ USER` / `AUTO` badges.
   - Clicking a step pill targets that step (`selectedSequencerStep`); striking any key punches the chord into `customProgression[step]`, re-conducting the entire ensemble via `customSpine` in `conductEnsemble()`.
   - Arming punch-in recording (`#fun-machine-rec`) writes struck keys directly into the active beat step (`activeBeatStep`) during live playback.
   - `#fun-machine-reset` clears custom chords and restores Kapellmeister genre rulebook chords.
   - Custom progressions and Fun Machine organ chords are rendered into both live playback (`scheduleAhead`) and offline 16-bit 44.1 kHz WAV exports (`exportSpecimenWav()`).
7. **Full Product Rebrand to Edmark's Esoteric Fun Machine (`index.html`, `styles.css`, `src/app.mjs`, `manual.html`, `docs/manual.json`, `docs/DECISIONS.md`)**:
   - Rebranded application title, masthead wordmark, Plate VII manual header, broadsheet canvas header, and technical manual to **Edmark's Esoteric Fun Machine** (D-021), paying tribute to kinetic sculptor John Edmark and vintage Baldwin chord organs.
   - Preserved *HAI, ORACLE!* and `src/oracle.lol` as the canonical LOLCODE 1.2 generative score engine that computes deterministic organism seeds, geometries, and motifs.

**Decisions:** D-020, D-021 accepted.

**Verified:** Thirty-five Node checks passed (`tests/oracle.test.mjs`, `tests/static.test.mjs`), including manual key mapping, `buildFunChord` and `buildFunProgression` across all genres, `conductEnsemble` with `customSpine`, plate stack ordering (Fun Machine at top before Plate II), markup and styling invariants, and control event wiring. Documentation checker passed with 0 errors and 0 warnings; manual validator passed with 0 warnings.

**Not verified:** Subjective physical jam feel across external MIDI keyboard devices remains out of scope for browser-native prototype.

**Problems:** None at handoff update time.

**Left undone:** P4-02 assistive-technology review, P6-01 public hosting.

**Next session should start with:** P4-02 or P6-01.

### Session 18: 2026-10-19: chamber reverb fog-horn damping, wax crackle enrichment & 12-step fun machine loop harmonization

**Contributor:** Antigravity with maintainer direction

**Goal:** Eliminate intense "fog-horn like feedback" in the parlor chamber convolution reverb on resonant phrases, enrich and balance Edison wax crackle surface noise so it is warm and audible without being drowned out, and reconcile the Esoteric Fun Machine play-along keyboard with the 12-step tempo loop so chord progressions and solo melodies lock rhythmically into the loop without 16th-note retriggering jitter.

**Done:** D-022 Chamber Reverb Damping Normalization & 12-Step Fun Machine Loop Harmonization.

**Changed:**
1. **Chamber Convolution Reverb Fog-Horn Damping & Spectral Normalization (`src/app.mjs`)**:
   - Identified root cause of runaway resonance: positive early-reflection taps and an un-damped diffuse lowpass tail accumulated massive DC and sub-bass gain ($+25\dots +30\,\text{dB}$) in the synthetic impulse response when convolved without normalization.
   - Replaced reflection taps with alternating phase polarities ($[+0.35, -0.28, +0.22, -0.18, +0.14, -0.11, +0.08, -0.06]$), keeping the reflection DC sum near zero.
   - Added a first-order highpass DC-block filter ($R = 0.985$, ~105 Hz cutoff) and air absorption damping to the diffuse tail generator.
   - Measured peak spectral magnitude across the audio spectrum and normalized the impulse response buffer to a safe unity room gain ceiling ($0.75$).
   - Inserted a dedicated $180\,\text{Hz}$ highpass send filter (`parlorReverbFilter`, $Q = 0.7$) before `parlorConvolver` in both live (`playScore`) and offline (`exportSpecimenWav`) transports, and routed the convolver through the master dynamics compressor before reaching the output bus.
   - Balanced baseline reverb send gain from $0.42$ to $0.32$.
2. **Reshaped Wax Crackle Surface Noise (`src/app.mjs`)**:
   - Replaced artificial $33\,\text{Hz}$ and $66\,\text{Hz}$ sine tones with gentle filtered mechanical brown noise ($0.04$ level, $0.20$ mix) modulated by 78 RPM eccentric wobble and thumps.
   - Enriched stylus micro-crackle density ($340/\text{sec}$) and discrete shellac dust pops ($38/\text{sec}$ with damped acoustic ringing), and adjusted default crackle gain from $0.38$ to $0.42$ for an audible, warm vintage texture that sits cleanly behind the music without being masked.
3. **12-Step Synchronized Loop Progression & Overlay Melody (`src/app.mjs`)**:
   - When a key is held during playback:
     - *Accompaniment Chord Progression*: In auto-chord mode, chords advance across the 4 harmonic regions, triggering solely on region start steps ($t = 0, 3, 6, 9$) with a sustained $3\times\text{stepDuration}$ envelope. This eliminates 16th-note retriggering jitter while preserving authentic harmonic progression voice-leading.
     - *Overlaying Progression Melody*: On every tempo step ($t = 0\dots 11$), the Fun Machine schedules the corresponding melodic note (`step.melodyPitch`) with a warm, singing solo lead voice.
     - *Punch-In REC*: As steps pass with REC armed, the regional chords are stamped into `customProgression` and reflected on the 12-step sequence grid.
     - *Live Telemetry*: The console telemetry dynamically reports current step, region, chord, and solo melody notes in real time.
     - *Standalone Auditioning*: When the transport is stopped/idle, keys audition directly with natural release.
4. **Behavioral & Structural Verification (`tests/oracle.test.mjs`, `tests/static.test.mjs`)**:
   - Added a dedicated test in `tests/oracle.test.mjs` verifying that the impulse response has an early reflection DC sum near zero, attenuates 30 Hz sub-bass by $>2\times$ relative to 500 Hz mids, and bounds peak spectral magnitude $\le 0.76$.
   - Added static checks in `tests/static.test.mjs` confirming `parlorReverbFilter` and `maxSpectralMag`.

**Decisions:** D-022 accepted.

**Verified:** Thirty-six Node checks passed (`tests/oracle.test.mjs`, `tests/static.test.mjs`); documentation checker passed with 0 errors and 0 warnings; manual validator passed with 0 warnings.

**Not verified:** Dedicated screen-reader testing remains P4-02 work.

**Problems:** None at handoff update time.

**Left undone:** P4-02 assistive-technology review, P6-01 public hosting.

**Next session should start with:** P4-02 or P6-01.

### Session 19: 2026-10-19: master transport and the shared ensemble graph

**Contributor:** Claude Code with maintainer direction

**Goal:** Begin the synthesizer-workstation phase with P5-18: first extract one ensemble audio graph for live and offline audio, then add Play/Pause/Stop and `Space`/`Esc` hotkeys.

**Done:** P5-18, D-023.

**Changed:**
1. `src/ensemble.mjs` (new): `buildEnsembleGraph()` builds the full bus, filter, delay, compressor, parlor, and drone graph for any context; `ENSEMBLE_BUS_GAINS`, `busGainFor()`, `parlorSendLevels()`.
2. `src/transport.mjs` (new): pure `transportReduce()` state model and `transportCommandForKey()` hotkey rules.
3. `src/app.mjs`: `playScore()` and `exportSpecimenWav()` both build from the shared graph; `scheduleEnsembleStep()` and `scheduleSequencedFunChord()` replace duplicated per-step code; `runTransportCommand()` is the one path for play/pause/stop/restart; `stopCurrentSound()` now fades the whole output and returns the resume step; a negative step clears every plate playhead.
4. `index.html`, `styles.css`: `#transport-deck` rail with position readout and hotkey legend, placed below the reading at every breakpoint.
5. WAV exports now match live routing (chimes, choir, and fungal through the creature filter; panner and dry tap present; no sequenced chords in lead-solo mode). See D-023 consequences.

**Verified:** 45/45 Node checks, including a fake-`AudioContext` routing and live/offline parity suite (mutation-checked: moving the chime bus off the filter fails it). Live browser smoke test at `http://127.0.0.1:8765`: summon → playing; Space with the mouse-clicked summon button focused pauses without re-submitting; keyboard-focused Play/Stop activate natively; Space types in the phrase field; Esc stops, rewinds, and clears playheads; mute/unmute resumes from the frozen cursor and preserves pause; WAV export produced a valid 2-channel 44.1 kHz RIFF (peak 14647 of 32767); no horizontal overflow at 375 px.

**Not verified:** Listening review of pause/resume and the new export routing; screen-reader announcements for the transport (P4-02).

**Problems:** The first hotkey design used `:focus-visible` to tell mouse focus from keyboard focus. Chrome promotes a clicked button to `:focus-visible` on the first key press, so it was replaced with explicit pointer-focus tracking.

**Left undone:** P5-19, P5-20, P5-21, P4-02, P6-01.

**Next session should start with:** P5-19.

### Session 20: 2026-10-19: the parlor mixing console

**Contributor:** Claude Code with maintainer direction

**Goal:** P5-19: an eight-channel mixer with faders, panning, mute/solo, and VU meters, built inside the shared ensemble graph so live and offline audio both honor it.

**Done:** P5-19, D-024.

**Changed:**
1. `src/mixer.mjs` (new): channel list, frozen console state, fader taper, solo rules, dB/pan formatting, meter RMS/peak math.
2. `src/ensemble.mjs`: one fader → `StereoPannerNode` strip per bus (stereo upmix for unity at center), optional post-pan `AnalyserNode` taps, a `Math.SQRT1_2` trim on the vitrine panner path; bus gains are now constant.
3. `src/app.mjs`: console rendering, `updateMixer()`, and a VU `requestAnimationFrame` loop; the five `*Enabled` flags are replaced by channel mutes, so plate switches, mixer M buttons, and Bandstand buttons share one state.
4. `index.html`, `styles.css`: `#mixer-engine` between the Fun Machine and Plate II; vertical faders via `writing-mode`; eight columns on desktop, four below 620 px, and a scrolling rail below 480 px.

**Verified:** 56/56 Node checks, including new mixer-model and strip-routing tests (mutation-checked: removing mute-beats-solo fails two tests). Browser at `http://127.0.0.1:8765`: a default-console WAV for "the moon owes me five dollars" with parlor acoustics off rendered −26.78 dB RMS, peak 14280, identical to the pre-mixer commit served from a scratch worktree; soloing PULSE hard left rendered the right channel at −113 dB; plate switch, M button, and Bandstand stayed in sync; every playing channel's meter moved within 4 s; arrow keys move vertical faders with matching `aria-valuetext`; no page overflow at 375 px or 1100 px, with eight strips in one row on desktop.

**Not verified:** Listening review; screen-reader pass over the strips (P4-02). The browser pane is 314 px wide, below the page's 320 px `min-width`, so overflow there is expected and pre-existing.

**Problems:** The first phone layout (four columns) clipped strips below 480 px; replaced with a scrolling rail placed after the 620 px block so it wins the cascade.

**Left undone:** P5-20, P5-21, P4-02, P6-01.

**Next session should start with:** P5-21.

### Session 21: 2026-10-19: stems and the MIDI score

**Contributor:** Claude Code with maintainer direction

**Goal:** P5-21: a zero-dependency nine-track WAV stem ZIP and a Type 1 MIDI file, built on the shared graph and mixer.

**Done:** P5-21, D-025. Also in this session's run-up: mixer fader ceiling raised to +12 dB, default voicing trims (lead +6 dB, choir +12 dB), the choir routed around the creature filter, and a dry lead tap on bandpass creatures (all D-024).

**Changed:**
1. `src/zip.mjs` (new): CRC-32 and STORED ZIP writer with fixed DOS dates and entry-name validation.
2. `src/midi.mjs` (new): VLQ, SMF Type 1 writer, GM track layout, loop-safe note clipping, velocity scaling.
3. `src/mixer.mjs`: `stemSettings()` and `silentSettings()`.
4. `src/app.mjs`: `renderEnsembleLoop()` replaces the WAV-only renderer; `exportSpecimenStems()` and `exportSpecimenMidi()`; `logNote()` in the lead, beat, bass, organ, chime, choir, and Fun Machine chord schedulers; `transportEngages()` lets offline renders include muted plates.
5. `index.html`: `#export-stems` and `#export-midi` buttons.

**Verified:** 67/67 Node checks, including a new writer suite. Python `zipfile.testzip()` and `unzip -t` accept a 3 MB generated archive. In-browser export of "the moon owes me five dollars" with one punched-in chord: ZIP of 9 WAVs plus README (8.45 MB, 1.8 s), all stems 2-channel 44.1 kHz and 234,638 frames, summing to the full mix within −27 dB; MIDI 1,109 bytes, Type 1, 480 PPQ, eight tracks ending at 2160 ticks (the 3.971 s loop at 68 BPM), balanced note-on/off counts, and the punched G minor chord on MANUAL.

**Not verified:** DAW import; listening review.

**Problems:** None.

**Left undone:** P5-20, P4-02, P6-01; five-cell rhythm tiling; export button grouping.

**Next session should start with:** a decision on P5-20 storage, or the design and layout pass.

### Session 22: 2026-10-19: the session ledger

**Contributor:** Claude Code with maintainer direction

**Goal:** P5-20: on-device preset storage plus `.fun` session files, with the decision recorded and ARCHITECTURE and SECURITY updated (maintainer-approved storage boundary change).

**Done:** P5-20, D-026.

**Changed:**
1. `src/session.mjs` (new): versioned session schema, strict validator, `.fun` parse/serialize, preset store parse/upsert/remove.
2. `src/mixer.mjs`: `mixerStateFromChannels()`.
3. `src/app.mjs`: per-cell edit counts (`plateCellCycles`, `cyclePlateCell()`), `recomposePlate()` shared by mutations and restore, `setFunMachineMode()` and `setFunChordQuality()`, `captureSession()`, `applySession()`, guarded preset storage, and ledger handlers.
4. `index.html`, `styles.css`: `#session-engine` between the mixer and Plate II.
5. ARCHITECTURE, SECURITY, README: the "no storage" promises now describe the one on-device store.

**Verified:** 75/75 Node checks, including a new session suite (field-level rejection, prototype keys, size limit, preset corruption, exact chord rebuild, per-cell replay equivalence). Browser: changed plates, mutations, cell edits, a punched chord, rulebook, strictness, chord quality, mode, room, tempo, volume, and console, then saved a preset and a file. A fresh page restored the preset with zero differences across 18 UI readouts, and re-saving produced a byte-identical `.fun` file. Tampered files (bad tempo, injected quality, unknown key, non-JSON, 70 KB) were each rejected with the field named and the current creature left untouched. DELETE removed the storage key. With `localStorage` throwing, preset save reported it and file save still worked. No overflow at 375 px.

**Not verified:** Real private-window and quota behavior; screen-reader pass over the ledger (P4-02).

**Problems:** Plate cells do not return to an identical state after any cycle length, so edits are stored as exact per-cell counts rather than counts modulo a period.

**Left undone:** P4-02, P6-01; the design and layout pass.

**Next session should start with:** the design and layout pass.

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

**Follow-up (maintainer screenshot):** The Tonnetz compass drew each region's label centred inside a small SVG circle at fixed 110-unit spacing, so table genres' long labels ("Tonic 1-5 Drone", "Phrygian Inflection") collided. The compass is now an HTML `<ol class="tonnetz-compass">` of four equal `minmax(0, 1fr)` columns. Each has a glyph with a region numeral (I–IV) and a two-line label underneath (smaller type at 400 px or less). Across all six genres × three mutations, from 300 to 1720 px, no labels overlap or clip and the compass keeps one height.

**Not verified:** Safari/Firefox rendering of `line-clamp` and `contain: inline-size` (evergreen support is documented, not observed here).

**Left undone:** P5-23 phase 5 (fixture-only seventh genre); listening pass; P4-02; P6-01.

**Next session should start with:** P5-23 phase 5.

### Session 33: 2026-10-20: the parlor room, measured

**Contributor:** Claude Code with maintainer direction

**Goal:** Maintainer: the reverb and clockwork escapement did not seem to do anything, and the crackle should be about half as loud.

**Done:** D-034.

**Measured (exported WAV loops, each layer toggled, repeat renders differ by −130 dB):** before the change, on "three pigeons", the reverb was −70.3 dBFS RMS (45 dB under the −25.4 dBFS mix), the escapement −50.3 RMS with −16.5 peaks, and the crackle −39.2 RMS. Cause of the silent reverb: it heard only the creature filter's output (plus choir and pad); bandpass creatures nearly silence that filter, and beat and bass never reached it.

**Changed:**
1. `src/ensemble.mjs`: the reverb hears lead, organ, chimes, choir, fungal, and pad post-fader, plus the pulse at half strength (`PARLOR_BEAT_SEND`); the bass stays dry. New constants `PARLOR_REVERB_PER_LEVEL` (0.32 → 1.0) and `PARLOR_CRACKLE_PER_LEVEL` (0.42 → 0.21).
2. `src/app.mjs`: live ambience, toggles, and the vitrine glass boost use the constants; the escapement strike, case knock (now 70 ms), and ratchet are roughly doubled.
3. `tests/transport.test.mjs`: the chamber hears every bus but the bass; the crackle is pinned at half.

**Verified after:** reverb 14.2–21.2 dB under the mix on three creatures (pigeons −21.2, moon −14.2, hai oracle −15.6); escapement −42 RMS, peaks −9.7; crackle −45.3 RMS (−6 dB). Mix RMS and peaks unchanged. 101/101 Node checks.

**Not verified:** Listening. Whether the room now sounds right, and whether "half as loud" should be −10 dB (perceived half) rather than this −6 dB.

**Left undone:** P5-23 phase 5; listening pass; P4-02; P6-01.

**Next session should start with:** the maintainer's listen to the room, then P5-23 phase 5.

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

### Session 36: 2026-10-20: the echo keeps the tempo

**Contributor:** Claude Code with maintainer direction

**Goal:** Maintainer: the one-finger accompaniment seemed slightly faster than the tempo setting.

**Found:** the accompanist itself plays on the band's step grid at the live tempo (`loopStepDuration()` and the scheduler both read `activeTempoBpm`). The delay, however, was timed once when the loop started (`unit × DELAY_MULTIPLIERS[score.rhythm]`) and never followed the tempo slider. Since D-029 the pad, arpeggio, and lead all feed that delay, so after a tempo change mid-loop their echoes ran at the old tempo.

**Changed:** `src/ensemble.mjs` exports `delayTimeFor(score, bpm)` and uses it at build time; `setTempoBpm()` in `src/app.mjs` retimes the running loop's delay with a short glide. Tests cover the formula and the live retime. `ASSET_VERSION` restamped.

**Verified:** 107/107 Node checks; in the browser, a normal reload picked up the new stamp, and moving the tempo 70 → 150 → 96 while holding a key raised no errors.

**Not verified:** Listening. If the accompaniment still feels quick at a steady tempo, the likely cause is the ARPEGGIO style's two notes per step (sixteenths against the band's eighth-note steps, D-029). That is a design choice to revisit, not this bug.

**Left undone:** P5-23 phase 5; listening passes; P4-02; P6-01.

**Next session should start with:** the maintainer's listen, then P5-23 phase 5.

Older sessions: [archive/sessions.md](sessions.md).

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

### Session 45: 2026-10-20: songs export whole (P5-26 complete)

**Contributor:** Claude Code with maintainer direction

**Goal:** P5-26 phase 5: WAV, stem, and MIDI exports render the whole song (D-039).

**Done:** P5-26 (all five phases).

**Changed:**
1. `src/app.mjs`: `playSongLayers()` is factored out of the live scheduler and shared with `renderEnsembleLoop()`. The render covers `max(1, songPasses(song))` passes (at most 32). Each step re-follows the recorded leaders (`followSong()` on the offline transport, updating its conducted melody), schedules the band, and plays every layer; `restoreLiveConducting()` then hands the shared band state back to the live loop. The lead duck applies to any transport whose layer leads. `arrangementMarkers()` labels every pass ("LOOP 2 (1/2) · I · EXPOSITION GROOVE"), and the stem README describes the song's length.
2. **Bug found while checking the export:** `scheduleBassStep()`, the organ, and the choir clamped pitches into range (`Math.max(28, …)`, 36–84, 40–82). On low-rooted creatures every bass note became E1, and the organ and choir hit their edges: wrong notes, live and exported, since P5-09. The new `foldIntoRange()` in `src/ensemble.mjs` moves notes by octaves instead, keeping the pitch class, and has a unit test. Creatures that hit the clamp now sound different; they are correct now.
3. Tests: static checks for the song render, offline follow, layer playback, and the conducting hand-back; the fold rule.

**Verified:** 126/126 Node checks. In the browser on "three pigeons" at 208 BPM:
- With no song, the MIDI was 2,880 ticks with 5 markers and 0 Fun Machine notes. A two-loop song (the second at ×2) exported 8,640 ticks (×3.00) with 71 Fun Machine notes and loop-labelled markers. The WAV was 6.54 s.
- The live band was unchanged after export.
- After the fold fix, the exported bass matched the plate ("A♭ A♭ A♭ E E C♯"), and the choir varied ("B E C♯ E") instead of repeating E2. With the song, the bass followed the G take once the key was held ("… G E♭ E♭ C").
- No console errors.

**Not verified:** Listening to exported songs and to the corrected bass, organ, and choir pitches; DAW import of song-length MIDI.

**Left undone:** The P4-02 screen-reader pass; P6-01.

**Hosting note (same session):** the maintainer deploys to Neocities at `https://oopismcgoopis.com/eefm/`. Just after an upload the console showed `looper.mjs` refused as `application/octet-stream`. Probing showed Neocities' edge cache (`x-cached: HIT`) briefly answering with mixed content types for `.mjs` files (`looper.mjs`, then `session.mjs`) and a stale `app.mjs` (18:46 against 22:29). Within minutes every file answered `application/javascript` with the new upload, so it was propagation, not the code; a hard refresh fixes it. The ASSET_VERSION stamps (D-035) keep versions consistent once edges agree, but cannot fix a wrong content type. If it recurs often, renaming modules to `.js` is the fallback. The Permissions-Policy console warnings come from Neocities' own headers. `index.html` and the generated `manual.html` (via `tools/manual.py`) declare an empty icon (`data:,`), so no favicon is requested anywhere: the maintainer wants a clean console, not an icon.

**Next session should start with:** the maintainer's listen (exported songs, corrected low voices), then P4-02 or P6-01.

### Session 46: 2026-10-20: the lead's drone breathes

**Contributor:** Claude Code with maintainer direction

**Goal:** The maintainer heard a lead-plate note on some phrases that "never drops off or changes in intensity".

**Done:** Incidental fix (no roadmap ID).

**Changed:**
1. Cause: the three tonic drones (`DRONE_INTERVALS`, root −12/−5/+7, in the score's waveform) connect to the lead bus and sounded at a constant pitch and gain for the whole loop. They ignored chords and arrangement rests, so they stood out most on phrases with sparse melodies or when the lead was soloed.
2. `src/ensemble.mjs`: each drone now passes through its own envelope gain (`droneEnvelopes`, after the interaction gain that `updateAudioInteraction()` still drives). `droneFrequencies(score, chordRoot)` moves the drones to the chord root by the shorter way (at most a tritone), so they never leap.
3. `src/app.mjs`: `shapeDrones()` runs every three steps (one harmonic region), live and in exports. It glides to the conducted chord root (the tonic under Raw Chaos), swells to `DRONE_SWELL`, settles to `DRONE_SETTLE`, and fades to silence while `arrangementPlays("lead", …)` is false.
4. Tests: envelope routing and shortest-path chord following; static checks that both schedulers shape the drones.

**Verified:** 127/127 Node checks. An in-browser offline render of the drones alone at 0.25 s per step, as RMS per step ×1000: before the fix it sat at a flat 19; after, it ran 25 18 12 19 21 23 14 8 3 25…, swelling on each chord and falling to 3 over the rest.

**Not verified:** The maintainer's listen on the phrases that showed it.

**Next session should start with:** that listen, then P4-02 or P6-01.

### Session 47: 2026-10-20: Fun Machine voices, phase 1 (P5-28)

**Contributor:** Claude Code with maintainer direction

**Goal:** The maintainer asked for a voice selector so the one-finger accompaniment is not always the same pad, with deterministic per-phrase voices and good presets. The spec is D-040.

**Done:** D-040 accepted, with the maintainer's answers:
- voices are kept per recorded slot;
- THE CREATURE'S OWN is the default;
- MATCH THE RULEBOOK waits for D-041;
- CALLIOPE is dropped, leaving seven presets.

D-041 (more genres) is committed as proposed. P5-28 phase 1 is done.

**Changed:**
1. New `src/voices.mjs`:
   - a strictly validated voice patch (`validateVoice()`, `VoiceError` paths) with three parts (`pad`, `pluck`, `lead`), bounded layer counts, frequencies, Q, and levels;
   - `VOICE_PRESETS`, which holds only VELVET PAD for now, and `voiceById()`, which falls back to it;
   - `scheduleVoicePad()`, `scheduleVoicePluck()`, and `scheduleVoiceLead()`.
2. `src/app.mjs`: `schedulePadChord()`, `scheduleArpNote()`, and `scheduleFunLeadNote()` are now thin wrappers that clamp times, log notes, and track live pads. They take an optional `voice`, defaulting to `currentFunVoice()`, which is VELVET PAD until phase 4 adds the selector.
3. `index.html`: `voices.mjs` joins the versioned module list, and the stamp is restamped. Tests: `tests/voices.test.mjs`.
4. The patch key is `base` rather than `from`, because `tests/assets.test.mjs` scans for `from "…"` import specifiers.

**Verified:**
- 131/131 Node checks.
- Parity: the old synth source (from the pre-change `app.mjs`) and the new patch synths were rendered offline in the browser for the pad, two plucks (accent and plain), and two leads (with and without glide), each at vitrine hold 0 and 0.6. The largest sample difference was 1.6×10⁻⁷ (about −136 dB), which is float rounding; the plucks were bit-identical.
- Live: SWELL, ARPEGGIO, and PROGRESSION each played with a key held, with no console errors.

**Not verified:** Nothing audible changed, so no listen is needed yet.

**Next session should start with:** P5-28 phase 2, the six other presets: HARMONIUM, GLASS HARMONICA, THEATRE ORGAN, STRING MACHINE, MUSIC BOX, and ÆTHER CHOIR. Some need patch features that are not in the schema yet: tremolo (THEATRE ORGAN), formant bandpasses (ÆTHER CHOIR), and a rolled pad strum (MUSIC BOX). Each preset is tuned by ear with the maintainer.

### Session 48: 2026-10-20: Fun Machine voices, phase 2 (P5-28)

**Contributor:** Claude Code with maintainer direction

**Goal:** P5-28 phase 2: the six other presets (D-040).

**Changed:**
1. `src/voices.mjs`:
   - Patches gain optional colour: `tremolo` ({rate, depth}) and `formants` (1–3 bandpasses) on pad and lead, plus `strike` on the pad (a roll of up to 0.2 s per note, capped at half the chord; each layer decays instead of sustaining). The tremolo LFO is in the pad's oscillator list, so releasing a live pad stops it too.
   - Six presets, each with its General MIDI program:
     - HARMONIUM: reed squares, a nasal Q, slow speech.
     - GLASS HARMONICA: sines at 1 and 2.76 with a slow bloom and a 3.2 Hz beat.
     - THEATRE ORGAN: drawbar sines at 1, 2, and 3 with a 6.8 Hz tremulant.
     - STRING MACHINE: three saws in a fast chorus.
     - MUSIC BOX: a struck, rolled triangle chord with a two-octave tine.
     - ÆTHER CHOIR: saws through "ah" formants on the pad and "oh" formants on the lead.
2. `index.html` and `src/app.mjs`: a VOICE chip row under ACCOMPANIMENT STYLE (`setFunVoice()`). A held key re-voices on the spot. The choice is live only: it is not in sessions, and recorded takes play in the current voice until phase 4.
3. Tests: colour node counts, roll timing, colour validation, and that the chips match `VOICE_PRESETS`.

**Verified:**
- 133/133 Node checks.
- Offline loudness against VELVET PAD (RMS over the sounding part of a four-note pad, eight plucks, and a four-note lead): every role of every preset is within ±0.7 dB, except MUSIC BOX's decaying pad and lead, which are −3.4 and −2.9 dB with higher peaks. No peak exceeds 0.5.
- Live: all 21 voice × style combinations played with a key held, with no console errors.
- The row wraps cleanly at phone and desktop widths, and selecting a chip moves nothing.

**Not verified:** How they sound. These are first-pass numbers for the maintainer to tune by ear.

**Next session should start with:** the maintainer's listen and tuning notes, then phase 3 (the creature's own voice from the spell).

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










