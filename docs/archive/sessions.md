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
