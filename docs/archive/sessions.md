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
