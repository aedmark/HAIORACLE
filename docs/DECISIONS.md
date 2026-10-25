# Decisions

This append-only record holds choices that a future session might otherwise re-litigate.

## D-001 Static site with no project dependencies  (2026-10-17, status: accepted)

**Context:** The product must be browser-based, portable, and zero dependency.

**Decision:** Ship authored HTML, CSS, JavaScript modules, and LOLCODE directly. Use no package manager, bundler, framework, remote font, CDN asset, analytics service, or server runtime.

**Alternatives:** A framework starter would speed common UI work but add a build and dependency chain. A desktop wrapper would weaken the immediate browser-toy quality.

**Consequences:** The app needs a static HTTP origin and must implement its own narrow interpreter. Browser-native APIs define the compatibility floor.

## D-002 Execute a purpose-built LOLCODE subset in the browser  (2026-10-17, status: accepted)

**Context:** Standard LOLCODE has no browser graphics or Web Audio surface, while LOLCODE must retain a causal role in the product.

**Decision:** `src/oracle.lol` owns generative score arithmetic. `src/lolcode.mjs` implements only the 1.2 constructs required by that spell and fails on all unsupported statements.

**Alternatives:** Translating LOLCODE by hand into JavaScript would make it decorative. Shipping a compiled full interpreter would increase size and build complexity. Calling a server-side interpreter would violate the local zero-dependency boundary.

**Consequences:** Compatibility claims remain narrow. Every new language construct requires interpreter tests before the spell can use it.

## D-003 Phrase determinism is a product contract  (2026-10-17, status: accepted)

**Context:** A repeatable creature gives the toy memory-like character without storing user data.

**Decision:** Normalize each phrase with NFKC, trim it, case-fold with the fixed `en-US` locale, hash it with 32-bit FNV-1a, and pass that seed to the spell. The same normalized phrase must produce the same score.

**Alternatives:** Fresh randomness offers novelty but erases identity. Persisted random results require storage and migration rules.

**Consequences:** Changes to normalization, hashing, score formulas, name tables, or scale mapping are compatibility changes and require an explicit superseding decision.

## D-004 One score drives a ten-second paired omen  (2026-10-17, status: superseded by D-005)

**Context:** Sound and image need shared causality, and a browser toy benefits from a bounded encounter.

**Decision:** The score controls waveform, root, pulse, eight melodic steps, hue, symmetry, twist, bloom, eyes, and name. Web Audio plays for ten seconds while the Canvas creature continues as a quiet visual presence.

**Alternatives:** Endless playback risks fatigue. A generic audio analyser would make the image react to volume without sharing compositional structure.

**Consequences:** Replay repeats the same omen. Future length or parameter changes must preserve the shared-score invariant.

## D-005 Continuous loops and expanded creature grammar  (2026-10-17, status: accepted)

**Context:** The first hands-on review found that ten seconds ended too quickly and narrow visual, musical, and naming ranges made repeats visible.

**Decision:** Keep an omen sounding until it is muted, replaced, restarted, or the page closes. Expand the LOLCODE score to twelve melodic steps, eight scales, six rhythms, six voice stacks, ten shape families, 65 sizes, eight palette grammars, broader motion and form ranges, and a six-template ceremonial name grammar.

**Alternatives:** A longer fixed duration still ends without user intent. Fresh randomness would create variety at the cost of deterministic identity. Cosmetic host-side variation would weaken LOLCODE's causal role.

**Consequences:** Phrase outputs from the initial prototype intentionally change under this pre-release schema expansion. Continuous audio increases the importance of visible mute behavior and clean replacement scheduling. The shared-score and phrase-determinism invariants remain intact for the new schema.

## D-006 Eyes are a composed anatomy  (2026-10-17, status: accepted)

**Context:** Maintainer review found that changing only eye count made the eyes read as repeated stamps across otherwise varied creatures.

**Decision:** Extend the LOLCODE score with eye silhouette, iris treatment, pupil geometry, iris hue and shift, eye size, gaze, and layout. Render eight silhouettes, eight iris treatments, eight pupil geometries, six layouts, eight gaze directions, and per-eye color shifts from those fields.

**Alternatives:** Host-side random styling would weaken determinism and LOLCODE ownership. A single larger eye vocabulary without layout or color variation would preserve the repeated-stamp problem.

**Consequences:** Pre-release phrase outputs change again because the schema gained new fields. Eye rendering is more complex and requires real-browser visual review under P4-01. The score boundary validates every anatomy field before Canvas receives it.

## D-007 Motion is bounded topology  (2026-10-17, status: superseded in part by D-008)

**Context:** Hands-on review found that body motion was dominated by one shared rhythmic pulse. Creatures needed seed-specific kinetic behavior and the spirit of self-contained higher-dimensional objects: always changing, never escaping their own boundaries.

**Decision:** Extend the LOLCODE score with kinetic family, speed, depth, tilt, and boundary-flux family. Canvas renders eight internal motion systems—a projected rotating tesseract, nested frames, ribbons, chord web, dimensional grid, contour membrane, gyroscope, and crystal network—and eight independently animated silhouette-flux grammars. Clamp the silhouette radius to a hard envelope and clip every internal system to the current body path. Retain a much smaller audio-synchronous pulse as connective tissue rather than the primary motion.

**Alternatives:** More pulse speeds would preserve the sameness. Host-side randomness would weaken deterministic identity and LOLCODE ownership. Unclipped geometry would create visual variety but violate the requested self-contained form.

**Consequences:** Pre-release phrase outputs change because the score schema gains new fields. Geometry is computationally richer and needs real-browser performance and visual review under P4-01. Reduced-motion mode freezes both boundary and kinetic phase while retaining the complete still composition.

## D-008 Pair sound and image by score, not beat scaling  (2026-10-17, status: accepted)

**Context:** A maintainer screencast showed beat-periodic hard update bands and compression-like jumps even after the whole-creature scale envelope was reduced from six percent to 1.2 percent peak-to-peak. Moving the complete translucent, glowing geometry together still produced a large synchronous repaint that read as jitter rather than life.

**Decision:** Remove audio-pulse-driven visual scaling. Sound and image remain one creature because the immutable LOLCODE score determines both systems; visual motion comes from boundary flux, kinetic cores, orbital drift, and eye behavior rather than direct beat resizing.

**Alternatives:** Further reducing or filtering the scale envelope would preserve a weak version of the observed artifact. Driving only opacity or bloom would still make a large canvas region change on every beat. A frequency analyser would add coupling and complexity without addressing the aesthetic problem.

**Consequences:** The pulse field controls audio tempo and displayed metadata, not Canvas geometry. Creature size no longer oscillates with each beat, while all seed-specific visual kinetics remain intact. P4-01 should confirm the result in-browser and under screen recording.

## D-009 Loudness is a session control, not creature identity  (2026-10-17, status: accepted)

**Context:** Listening review found many generated voices difficult to hear even with high system volume. Raising every oscillator independently would change voice balance and could make dense stacks clip, while a fixed global increase would offer no accommodation for different devices or listeners.

**Decision:** Raise the shared dry-mix target from `0.19` to `0.28`, route both dry and delayed signals through the existing compressor, and add a keyboard-accessible `0..100` master-volume slider after compression. Start at `82`, which maps to unity output gain; use a perceptual curve bounded below `1.4` gain at maximum. Ramp live changes over 18 milliseconds to avoid zipper noise. Keep this session-local control outside the LOLCODE score.

**Alternatives:** Per-voice mixer controls add interface and state complexity before the voices have completed listening review. A simple linear gain makes the quiet half of a slider less useful. Persisting volume would require a new storage contract.

**Consequences:** The default dry mix is roughly 47 percent stronger before output gain, with additional user-controlled headroom. Creature determinism is unchanged. The slider resets on reload, and P4-01 must still listen for clipping, harsh compressor pumping, and device-specific loudness.

## D-010 Melody is a named twelve-step motif  (2026-10-17, status: accepted)

**Context:** The original loop selected twelve scale degrees but did not give most creatures a legible melodic identity. Workshop direction called for deterministic repeating melodies with explicit arpeggio and chromatic vocabularies.

**Decision:** Add LOLCODE-owned melody-family and rotation fields. Resolve them in a pure music module to one frozen twelve-semitone sequence per creature. Provide twelve named families: seeded scale walk; major, minor, diminished, augmented, and minor-seventh arpeggios; ascending, descending, and interleaved chromatic motion; circle-of-fifths motion; whole-tone motion; and a glass interval ladder. Cache the resolved motif on the active audio transport and repeat it modulo twelve.

**Alternatives:** Extending only the scale table would add pitch sets without giving phrases recognizable contour. Freshly generating notes each loop would weaken identity. A user-facing sequencer would turn a one-gesture oracle into a composition tool before the core listening experience is mature.

**Consequences:** Pre-release phrase audio changes because the score schema gains two fields and most phrases select a new motif. The same normalized phrase remains deterministic under the new schema. The score readout names the motif, and exact tests pin representative arpeggio and chromatic sequences.

## D-011 The interface is an esoteric parlor cabinet and broadsheet  (2026-10-17, status: accepted)

**Context:** Art direction moved away from both the dark futuristic interface and bright geometric pastel storybook framing toward a bespoke, esoteric, old-timey macabre parlor vibe—not sinister, just weird.

**Decision:** Reframe the application as a 19th-century spiritualist broadsheet and parlor specimen cabinet. Give the creature a bounded bell-jar apparition vitrine with inline SVG astrolabe spandrels; use bilateral broadsheet composition, folio and specimen-plate inscriptions, double brass rules, foxed vellum parchment, ebonized cabinet wood, and sealing-wax oxblood. Use a local engraved book-serif stack paired with telegraph monospace for catalog telemetry. Preserve the generative Canvas as the primary animated specimen and use no remote assets or external font binaries.

**Alternatives:** Keeping a futuristic dark UI or a pastel Futura hotel aesthetic missed the desired esoteric, eccentric Victorian macabre tone. Loading remote web fonts would violate the local zero-dependency boundary (D-001).

**Consequences:** The canvas is centered inside a framed bell-jar vitrine rather than acting as a full-screen background. Inline SVG ornaments and layered CSS gradients supply the engraved broadsheet and cabinet textures without external image files. P4-01 must verify composition at real desktop and phone sizes.

## D-012 Vitrine gestures modulate live expression without mutating the score  (2026-10-17, status: accepted)

**Context:** Maintainer direction called for tapping/clicking, holding, and holding-and-dragging on the specimen vitrine to alter audio pitch, intensity, and percussives as well as visual shape, movement, and morphing. Later ensemble expansion (P5-08 through P5-15) diluted gesture responsiveness because new accompaniments bypassed the filter and drag tugging remained restricted to 14% of canvas width.

**Decision:** Handle pointer gestures (`pointerdown`, `pointermove`, `pointerup`) directly on `#vision` via a transient session state object (`interaction`) coupled with a polar harmonic field (`harmonicField`). Tapping triggers a synthesized four-partial harmonic bloom (`[0.5, 1, 1.5, 2]`) and membrane strike, spawns a concentric vitrine ripple, and jolts silhouette lobes and pupil dilation. Holding swells filter cutoff/resonance, mix and echo feedback, tempo density, and motif-locked step percussion while morphing the silhouette toward a secondary shape family and locking the creature's gaze onto the pointer. Holding and dragging maps pointer coordinates into polar `(radius, angle)` and continuous displacement:
1. **Dynamic Vitrine Elasticity:** The specimen travels elastically up to 32% of stage width and 24% of height, with directional velocity squash-and-stretch along the drag vector and magnetic lobe reach toward the pointer.
2. **Spatial Stereo Panning (`StereoPannerNode`):** Smoothly pans the creature's lead voice, drone choir, and interactive percussion across the stereo field (`-0.85` left to `+0.85` right) as it is moved across the vitrine.
3. **Continuous Drone Choir Pitch Glissando:** Modulates detune by up to $\pm 140$ cents in real-time with vertical pointer tracking (`interaction.pitchBend`), providing continuous theremin-like vocal performance.
4. **Unified Vitrine Chamber Filter & Formant Modulation:** Busses for Befunge organ, Piet/FRACTRAN chimes, Shakespeare choir, and bio-acoustic fungi route through the master vitrine filter, opening up to $5200\,\text{Hz}$ on high drags and plunging to $220\,\text{Hz}$ on low drags, while accompaniment registers and choir formant frequencies shift harmonically.
5. **Distance-Based Linear Drag Haptics:** Moving in any direction (linear, circular, or zigzag) accumulates drag distance to trigger rhythmic ratchet chimes, spore puffs, and vitrine ripples.
6. **Bell Jar Glass Proximity:** Approaching the curved glass perimeter swells convolution reverb resonance and contact horn crackle.

Releasing the pointer decays all offsets smoothly back to the creature's deterministic resting state.

**Alternatives:** Permanently mutating the score on click would break phrase determinism (D-003). Bending oscillator detune microtonally or modulating `delayTime` during echoes created atonal Doppler smearing against the repeating motif. Using external audio samples for percussion would violate the zero-dependency boundary (D-001).

**Consequences:** The immutable LOLCODE score still defines the creature's identity and resting behavior, while direct manipulation turns the vitrine into an expressive performance instrument. Reduced-motion mode suppresses the extra phase spin and elastic tug while keeping audio modulation and percussion active.

## D-013 A Malbolge 1998 virtual machine drives the twelve-step ternary beat automaton  (2026-10-18, status: accepted)

**Context:** Maintainer direction called for a "hat trick" esoteric beat generator built in Malbolge alongside the LOLCODE score engine and interactive parlor vitrine.

**Decision:** Add LOLCODE-owned `beat_mode` (`[0, 7]`) and `beat_density` (`[35, 100]`) fields so `src/oracle.lol` remains the causal root of creature identity, and feed the resulting seed stream into a spec-compliant 1998 Malbolge virtual machine (`src/malbolge.mjs`) executing `src/beat.mal`. The VM initializes a $3^{10}$ (59,049-word) ternary tape using the canonical `crazy` recurrence, validates instruction opcodes at load time, applies post-instruction `XLAT2` encryption, and emits 12 deterministic output bytes in 50 instructions. Each step decomposes into a 3-trit ternary drum state (`kick`, `snare`, `hat` in `{0, 1, 2}`) shaped by one of eight cadence masks (`AUTOMATON MARCH`, `SEANCE WALTZ`, `PENDULUM GALOP`, `OSSUARY POLYRHYTHM`, `TELEGRAM CLATTER`, `BELL-TOWER TOLL`, `ECTOPLASM SHUFFLE`, `INFERNAL HABANERA`). Expose a Plate II 12-step ternary matrix (`#beat-engine`) in the cabinet with live step cycling, a pulse engage/silence toggle, and a `RE-INCANT BEAT` mutation trigger.

**Alternatives:** Faking Malbolge with a random table would violate the esoteric language premise. Letting Malbolge run unbounded loops without a step budget would risk hanging the browser UI thread.

**Consequences:** Pre-release score validation gains two fields (`beat_mode`, `beat_density`) and the page fetches both `src/oracle.lol` and `src/beat.mal` from the same origin. Every phrase deterministically summons both its melody and its 12-step ternary percussion cadence, while interactive step buttons and mutations remain session-local.

## D-014 Each esoteric bandmate maps its native machine model to a distinct musical role across the six-language parlor ensemble  (2026-10-18, status: accepted)

**Context:** Maintainer direction called for speccing out and implementing a complete multi-language esoteric jam band—pairing LOLCODE and Malbolge with Brainfuck, Befunge-93, Piet/FRACTRAN, and Shakespeare Programming Language—along with an ensemble bandstand console.

**Decision:** Assign each esoteric language the musical role that matches its underlying computational mechanics, with `src/oracle.lol` remaining the causal bandleader that seeds every player:
1. **LOLCODE 1.2 (`src/oracle.lol`)** — Bandleader, 12-note lead motif, and Plate I interactive apparition vitrine.
2. **Malbolge 1998 (`src/beat.mal`)** — $3^{10}$ ternary percussion automaton (Plate II, P5-08).
3. **Brainfuck 1993 (`src/bass.bf`, `src/brainfuck.mjs`)** — 256-cell byte tape interpreter with bracket validation and step-budget protection driving a 12-cell walking sub-bass and resonant acid-organ ostinato across eight groove archetypes (`WALKING CELLAR` through `SEANCE DUB SUB`) in Plate III (`#bass-engine`, P5-09).
4. **Befunge-93 (`src/harmony.bfg`, `src/befunge.mjs`)** — 80×25 2D torus playfield interpreter with directional arrows (`> < ^ v`), `#` bridges, and four diagonal mirrors (`\ / / \`) executing in 93 steps to voice polyphonic 3-note triads (`I..VI`, `/` ascending or `\` descending strum) across eight organ archetypes (`CATHEDRAL REED` through `PHANTOM CALLIOPE`) in Plate IV (`#harmony-engine`, P5-10).
5. **Piet & FRACTRAN (`src/pad.piet`, `src/chimes.frac`, `src/fractran.mjs`)** — 25×5 clockwise Piet 2001 codel canvas executing `in -> push -> add -> out` transitions across all 18 chromatic codels (`[LND][RYGCBM]`) in 49 steps paired with a 1987 John Conway FRACTRAN BigInt prime-factor machine ($2^a 3^b 5^c 7^d 11^e 13^f$) executing 20 rational multipliers to voice 7-limit Just Intonation overtone bells (`1/1`, `9/8`, `6/5`, `5/4`, `4/3`, `7/5`, `3/2`, `8/5`, `5/3`, `7/4`, `15/8`, `2/1`) and codel-filtered spectral chorus pads across eight archetypes (`TONNETZ CATHEDRAL` through `VESPER VIOLET CHIMES`) in Plate V (`#chime-engine`, P5-11).
6. **Shakespeare Programming Language (`src/chant.spl`, `src/shakespeare.mjs`)** — 2001 Elizabethan play interpreter executing a 3-Act, 12-Scene tragedy (`The Oracular Tragedy of the Parlor Glass.`) with four dramatis personae (`Hamlet` Tenor, `Ophelia` Soprano, `Prospero` Basso, `Hecate` Alto), stage entrances/exits, stack pushes/pops (`Remember me`, `Recall`), and poetic valence arithmetic (`Thou art as ... as the sum of ...`) in 40 cues to schedule 3-formant ($F_1, F_2, F_3$) parallel bandpass vowel choir voices (`/ɑ/`, `/ɛ/`, `/i/`, `/o/`, `/u/`, `/æ/`) across eight archetypes (`ELIZABETHAN MADRIGAL` through `PROSPERO EPILOGUE`) in Plate VI (`#chant-engine`, P5-12), coordinated by the Parlor Bandstand Six-Language Ensemble Console (`#bandstand-engine`, P5-13).

**Alternatives:** Using one generic sequencer with cosmetic language labels would miss the point of esoteric computation. Approximating FRACTRAN ratios with 12-TET semitones or faking vowel formants with a single lowpass filter would lose pure Just Intonation harmonic ratios and distinct vocal-tract vowels.

**Consequences:** Pre-release score validation gains `bass_mode` (`[0, 7]`), `bass_glide` (`[20, 100]`), `harmony_mode` (`[0, 7]`), `harmony_strum` (`[15, 100]`), `chime_mode` (`[0, 7]`), `chime_shimmer` (`[20, 100]`), `chant_mode` (`[0, 7]`), and `chant_formant` (`[25, 100]`), and the browser fetches `src/bass.bf`, `src/harmony.bfg`, `src/pad.piet`, `src/chimes.frac`, and `src/chant.spl` alongside `src/oracle.lol` and `src/beat.mal`. Every creature now commands a full six-language esoteric chamber ensemble with global engage, solo-lead, and synchronized multi-language mutation controls.

## D-015 Shareable links use client-only URL fragments (`#omen=...`) and PNG plates render on an offscreen Canvas  (2026-10-18, status: accepted)

**Context:** P3-01 and P3-02 call for sharing a unique link to a summoned creature and exporting a still PNG containing the creature's name, portrait, and originating phrase without introducing accounts, servers, or remote telemetry.

**Decision:** Encode the normalized phrase in the URL fragment (`#omen=<encodeURIComponent(phrase)>`) via `src/share.mjs`, synchronize the address bar with `history.replaceState` on summon, restore any `#omen=...` fragment on page load or `hashchange` (holding audio until a user gesture), and provide a `COPY OMEN LINK` control (`#share-link`). For still-image export (`#export-png`), composite a `1200 × 1520` Victorian specimen broadsheet onto an offscreen `<canvas>` (`renderSpecimenBroadsheetCanvas()`) containing the live `#vision` creature capture, specimen name, confided phrase, hexadecimal seed, and all six esoteric instrument plates, then download it as `hai-oracle-<name>-<seed>.png`.

**Alternatives:** Using `?omen=...` query parameters would transmit user phrases in HTTP request logs and `Referer` headers to static hosting providers. Using third-party DOM-to-image libraries would violate the zero-dependency boundary (D-001).

**Consequences:** Because RFC 3986 URL fragments never leave the browser in HTTP requests, links are shareable while preserving complete client-side privacy. PNG broadsheet plates are generated deterministically on-device with zero external libraries.

## D-016 An Euler-Tonnetz and Euclidean harmonic conductor harmonizes all six esoteric VMs  (2026-10-18, status: accepted)

**Context:** When six independent esoteric virtual machines (`src/oracle.lol`, `src/beat.mal`, `src/bass.bf`, `src/harmony.bfg`, `src/pad.piet` + `src/chimes.frac`, and `src/chant.spl`) emit pitches, prime ratios, and rhythmic gates simultaneously without a shared harmonic spine, many seeds collide in minor-second clusters, unrelated triads, and 7-limit wolf intervals.

**Decision:** Introduce a pure mathematical ensemble conductor (`src/conductor.mjs`, P5-14) that post-processes the genuine outputs of all six interpreters before they reach the Web Audio scheduler:
1. **Neo-Riemannian *Tonnetz* Spine (`P`, `L`, `R`)** — Divide the 12-step bar into 4 harmonic regions of 3 steps each, driven by deterministic sequences of Parallel (`P`), Leading-Tone (`L`), and Relative (`R`) triadic involutions so adjacent chords always share two common tones and move the remaining voice by 1 or 2 semitones.
2. **Leonhard Euler's 1739 *Gradus Suavitatis* Consonance Sieve** — Compute $G(n) = 1 + \sum e_i(p_i - 1)$ over interval ratios (`eulerGradus()`, `semitoneGradus()`, `projectConsonantPitch()`) to snap strong-beat LOLCODE melody notes onto active triad tones while allowing low-Gradus passing tones (`9th`, `4th`, `6th`, `7th`) on weak subdivisions, and lock Brainfuck bass cells to the active triad root/fifth, Befunge-93 3-voice organ inversions to the active triad, Piet/FRACTRAN chimes to pure 5-limit overtones (`1/1`, `6/5`, `5/4`, `3/2`, `2/1`) of the active chord root, and Shakespeare choir personas to sustained triad voices (`Prospero` root, `Hamlet` fifth, `Hecate` third, `Ophelia` upper third).
3. **E. Bjorklund's Euclidean Rhythm Hocket ($E(k, 12)$)** — Use complementary Euclidean masks (`bjorklund(7, 12)` vs. `bjorklund(5, 12)`) and Malbolge kick-downbeat locking so bass, lead, chimes, and choir breathe in interlocking pockets instead of crowding every 16th-note subdivision.

**Alternatives:** Replacing the esoteric VMs with hard-coded presets would violate the esoteric computation premise. Leaving all six engines unconducted produced frequent harmonic mud. Granular user-selectable music-theory and genre rulebooks (Palestrina counterpoint, Jazz extended Tonnetz, Blues, etc.) are tracked separately as milestone P5-15.

**Consequences:** Every esoteric interpreter still executes its real program and shapes rhythm, register, inversion, codel timbre, and dramatic persona, while the ensemble plays in locked consonance and rhythmic sync.

## D-017 Procedural mycelial network and generative fungal fruiting bodies  (2026-10-18, status: accepted)

**Context:** The parlor specimen vitrine needed an organic generative layer reflecting cryptogamic and mycological Victorian botany—allowing the creature to germinate branching hyphal networks (mycelium) and sprout generative fruiting bodies (mushrooms/sporophores) that grow over time and respond to vitrine gestures.

**Decision:** Add LOLCODE-owned `fungal_form` (`[0, 7]`), `fungal_hyphae` (`[10, 100]`), `fungal_spores` (`[10, 100]`), and `fungal_bloom` (`[10, 100]`) so `src/oracle.lol` remains causal across visual and mycological identity. In Canvas:
1. **Branching Mycelial Hyphae & Anastomosis** (`buildMycelialNetwork()`, `drawMycelium()`) — Render 7 to 18 primary root hyphae emerging from the creature's silhouette vertices, each branching into wandering 5 to 9 segment trunks and lateral sub-branchlets with anastomotic fusion loops and traveling bioluminescent nutrient waves ($\sin(s \cdot 10 - t \cdot 4.5)$). Hyphae elongate progressively over an initial 10-second germination envelope ($G(t)$).
2. **Generative Fruiting Bodies (Sporophores)** (`buildFruitingBodies()`, `drawFruitingBodies()`) — Anchor 3 to 8 generative sporophores along the creature's perimeter and hyphal junctions across eight distinct botanical archetypes: `AGARIC CAP` (parabolic umbrella cap, fibrous stipe, radial lamellae, annulus veil ring), `BRACKET CONK` (concentric terraced polypore shelves with margin pores), `CORAL CLAVARIA` (dendritic bifurcating antler clubs with glowing forked tips), `BIOLUMINESCENT BONNET` (slender nodding Mycena bonnets with translucent striations and dewdrop jewels), `CUP PEZIZA` (fluted chalice goblets with glistening spore disc hymenia and crenulated margins), `MOREL HONEYCOMB` (conical honeycomb heads with reticulated polygonal alveoli), `GLOBULAR PUFFBALL` (warty spherical bulbs with apical ostiole pores actively venting spore mist), and `HYPHAL HYDRA` (multi-stalked lantern capsules with weeping capillitium tendrils).
3. **Ballistospore Particle System** (`buildSporeSystem()`, `updateAndDrawSpores()`, `burstSpores()`) — Maintain 35 to 85 drifting spores shed from active caps, subjected to upward thermal updrafts in the bell jar, orbital convection, and drag wake currents. Tapping the vitrine shocks the mycelium and discharges high-velocity spore bursts, while holding accelerates vegetative growth and intensifies bioluminescence.

**Alternatives:** Using static bitmap textures or pre-baked sprites would violate zero-dependency rendering and determinism. Allowing unconstrained hyphae would clip past vitrine borders. Applying global blur to hyphae would breach D-007 performance invariants.

**Consequences:** Pre-release score validation gains four causal fungal fields. The specimen palpably lives and grows inside the bell jar from germination to blooming maturity, captured faithfully on still broadsheet exports and responding tactilely to glass disturbance.

## D-018 Client-side 16-bit uncompressed WAV loop export, bio-acoustic sonification, and Victorian vitrine botanical staging  (2026-10-18, status: accepted)

**Context:** Confidants requested the ability to download an exact, uncompressed audio recording of their summoned creature's chamber ensemble loop alongside the existing 1200×1520 broadsheet PNG plate. Furthermore, the living specimen in the parlor vitrine lacked organic grounding (pedestal and substrate), physical bell jar atmosphere (condensation micro-droplets on curved glass), Ernst Haeckel-level botanical engraved details on sporophore caps, and bio-acoustic audio sonification (action potentials, guttation droplet chimes, and spore puffs).

**Decision:**
1. **OfflineAudioContext 16-Bit Stereo PCM WAV Recording (`#export-wav`, `audioBufferToWavBlob()`, `exportSpecimenWav()`)** — When clicked, an `OfflineAudioContext` schedules one complete 12-step cycle of all six esoteric chamber instruments (`LOLCODE 1.2`, `Malbolge 1998`, `Brainfuck 1993`, `Befunge-93`, `Piet 2001 / FRACTRAN 1987`, `Shakespeare 2001`) plus bio-acoustic voices at current BPM with a 1.35-second natural decay tail. A dependency-free pure JavaScript encoder packages the rendered float32 buffers into standard 44-byte RIFF/WAVE PCM format with interleaved 16-bit signed integer samples and downloads `hai-oracle-<name>-<seed>.wav`.
2. **Bio-Acoustic Fungal Sonification (`scheduleFungalBioStep()`, `triggerSporePuff()`)** — Dedicated `fungalBus` routes through master compressor and delay. Synthesizes micro-voltage action-potential spike trains ($2800\text{--}3800\,\text{Hz}$ bandpassed click impulses), delicate guttation water-droplet chimes ($1540\,\text{Hz} \to 650\,\text{Hz}$ downward pitch sweep), and tactile ballistospore discharge pops (filtered noise burst + $740\,\text{Hz} \to 220\,\text{Hz}$ downward chirp) on step events and whenever the vitrine glass is disturbed.
3. **Turned-Wood Vitrine Pedestal & Substrate Bed (`drawVitrinePedestal()`)** — Renders an antique ebonized mahogany specimen mount with stepped plinth mouldings, polished brass retaining ring, and an organic bed of fibrous humic peat mounds, decaying driftwood grain, and living lichen flecks at the base of the bell jar (`height * 0.91`), firmly anchoring the specimen's descending hyphal roots.
4. **Curved Glass Spore Condensation (`buildGlassCondensation()`, `drawGlassCondensation()`)** — Generates 46 deterministic dew condensation micro-droplets clinging along the left, right, and domed upper perimeter of the vitrine bell jar, shimmering and vibrating on glass tap gestures while catching the specimen's bioluminescent glow.
5. **Ernst Haeckel-Style Anatomical Cap Engraving** — Enriches all eight sporophore archetypes with fine lithographic anatomy: radiating lamellae with alternating secondary lamellulae and stippled universal veil verrucae (`AGARIC CAP`), concentric growth sulci and micropore hymenium stippling (`BRACKET CONK`), longitudinal fibrous striations (`CORAL CLAVARIA`), pleated-striate margin ribs and apical papillae (`BIOLUMINESCENT BONNET`), fimbriate eyelash fringe margins and radial spore folds (`CUP PEZIZA`), reticulated polygonal scalariform alveoli (`MOREL HONEYCOMB`), pyramidal peridial scales flaking around the ostiole (`GLOBULAR PUFFBALL`), and pendant aculei spine rows (`HYPHAL HYDRA`).

**Alternatives:** Using server-side rendering or external WebAssembly codecs (like LAME MP3 or ffmpeg.wasm) would violate the client-only privacy model and zero-dependency boundary (D-001). Using MediaRecorder with WebM/Opus produces lossy, non-deterministic container chunks with browser-specific codec support.

**Consequences:** Confidants can save both a museum-grade 1200×1520 broadsheet PNG and an uncompressed 16-bit 44.1 kHz WAV recording rendered in under 60 milliseconds on-device. The vitrine bell jar gains tactile physical grounding, atmospheric glass condensation, and delicate bio-acoustic responsiveness.

## D-019 Kapellmeister Music-Theory & Genre Rule Console and Antique Parlor Room Acoustic Space  (2026-10-18, status: accepted)

**Context:** Listeners and confidants requested the ability to manipulate harmonic and contrapuntal rules beyond the default Victorian Tonnetz progression—enabling genres like authentic 12-bar delta blues, smoky late-night parlor jazz, strict Palestrina renaissance counterpoint, mystic modal drone, and raw unfettered VM chaos. In addition, the six disparate synthesizers needed an authentic acoustic environment—a cohesive 1890s Victorian parlor room with Edison wax-cylinder phonograph surface noise, room resonance, and clockwork escapement ticking—to bind the algorithmic voices into a believable physical chamber.

**Decision:**
1. **Kapellmeister Genre Rulebooks & Sieve (`src/conductor.mjs`, `#kapellmeister-engine`)** — Expose six selectable music-theory rulebooks:
   - `VICTORIAN NEO-RIEMANNIAN TONNETZ`: Parsimonious triadic $P, L, R$ progression with Euler $G \le 8$ consonance sieve.
   - `12-BAR DELTA & PARLOR BLUES`: Authentic $I7 \to IV7 \to V7$ 12-bar blues matrix with walking shuffle bass shuttle ($[0, 4, 7, 9, 10, 9, 7, 4]$), crunchy dominant 7th voicings, and blue-note ($\flat 5$) sieve.
   - `SMOKY PARLOR JAZZ & EXTENDED TONNETZ`: Extended ii-V-I progressions with rootless 3rd/7th/9th guide tones, chromatic approach tones, and swung overtones.
   - `PALESTRINA MODAL COUNTERPOINT`: 16th-century sacred polyphony rules with prepared 4-3 and 7-6 suspensions resolving downward by step, strict Euler $G \le 5$ consonance, and Picardy third cadence.
   - `MYSTIC BYZANTINE & HIMALAYAN DRONE`: Hypnotic root and fifth drone pedal with Phrygian dominant and Lydian mystic modal inflections.
   - `RAW ESOTERIC CHAOS (UNFETTERED VMS)`: Bypasses the harmonic sieve entirely, outputting raw, unquantized mathematical byte sequences from all six virtual machines.
2. **Real-Time Harmonic Dashboard & Compass** — Displays active Step ($1\text{--}12$), active Chord Name (e.g., `C Maj`, `F7`, `Cmaj9`), Harmonic Vector, and live Euler *Gradus Suavitatis* score ($G$). An interactive SVG Tonnetz Compass illustrates the current harmonic region with an animated golden triangle.
3. **Antique Parlor Room Acoustic Space (`ensureWaxCrackleBuffer()`, `ensureParlorImpulseResponse()`, `scheduleClockworkTick()`)** — Dependency-free Web Audio acoustic chamber:
   - *Wax-Cylinder Surface Noise*: Procedural 3.0s stereo buffer synthesizing acoustic horn bandpass room noise ($350\text{--}3200\,\text{Hz}$), Poisson-distributed dust clicks and surface pops, and subtle 78 RPM turntable groove rumble.
   - *Victorian Chamber Reverb*: Procedural 1.6s stereo impulse response buffer loaded into a `ConvolverNode`, modeling wood-paneled walls, plaster ceilings, and velvet drapes.
   - *Clockwork Escapement Ticking*: Mechanical brass mantel clock ticks synthesized on quarter-beats ($t = 0, 3, 6, 9$).
4. **Offline WAV Loop Integration** — Both real-time playback and offline 16-bit WAV rendering (`#export-wav`) respect the selected Kapellmeister genre and render the parlor room acoustics.

**Alternatives:** Using pre-recorded vinyl/crackle audio files would violate the zero-dependency boundary (D-001). Hardcoding genre presets without user control would prevent listeners from exploring the spectrum from strict counterpoint to raw esoteric chaos.

**Consequences:** Confidants can sculpt the musicality and coherence of their summoned omen in real time, from smooth chamber jazz to raw avant-garde chaos, grounded in an authentic 1890s acoustic space.

## D-020 Esoteric Fun Machine: Real-Time Play-Along Keyboard Manual, Auto-Chord Harmonization, and 12-Step Punch-In Loop Sequencer (2026-10-19, status: superseded in part by D-029; sequencer removed by D-038)

**Context:** While confidants could summon algorithmic creatures, modulate parameters via vitrine dragging, and select Kapellmeister genre rulebooks, they could not actively play along or compose harmonic sequences in real time. Confidants requested a Baldwin Fun Machine-inspired auto-chord organ console with a physical/screen keyboard manual, one-finger chord accompaniment, loop punch-in recording, and seamless integration into playback and offline WAV exports.

**Decision:**
1. **Interactive 13-Key Ivory & Ebony Manual (`#fun-keyboard`, `FUN_KEY_MAP`, `FUN_KEY_BY_CODE`)** — Implements an octave manual spanning $C$ to $C'$ with 8 ivory white keys and 5 ebony black keys (`KeyA, KeyW, KeyS, KeyE, KeyD, KeyF, KeyT, KeyG, KeyY, KeyH, KeyU, KeyJ, KeyK`). Keys are playable via pointer clicks, touch gestures, and physical computer keyboard keys, guarded against phrase input focus, key repeat spam, and browser hotkeys. Dynamic chord preview labels on each key update whenever chord quality or genre changes.
2. **Dual-Oscillator Reed-Organ Voice with 5.5 Hz Parlor Vibrato & Sustained Envelopes (`scheduleFunMachineChord()`, `scheduleFunMachineLeadNote()`)** — Synthesizes vintage 1970s parlor chord organ tone using a sawtooth reed oscillator, sub-octave triangle foundation, a 5.5 Hz sine vibrato LFO, a vintage lowpass formant filter ($2200\,\text{Hz}$), and 12ms manual strum stagger between chord notes. Uses an authentic organ sustain envelope (holding at $85\%$ peak with smooth 80ms release on note release or transition) rather than premature decay. Supports both `AUTO-CHORD: ONE-FINGER` and `LEAD SOLO: MANUAL NOTE` modes.
3. **One-Finger Auto-Chord Harmonization & Unchained Sustained Voices (`startFunMachineVoice()`, `stopFunMachineVoice()`, `buildFunChord()`, `buildFunProgression()`, `CHORD_QUALITIES`)** — Quick chord quality selector chips (`AUTO-GENRE`, `MAJOR`, `MINOR`, `DOM 7TH`, `MAJ 9TH`, `DIMINISHED`, `OPEN 5TH`). Striking/holding any key on the manual or computer keyboard starts a dedicated sustained organ voice (`startFunMachineVoice()`) that plays continuously and smoothly over top of the accompaniment without being chained to sequencer tempo steps. Eliminates all jittering, stuttering, and step-chopping artifacts. Tapping allows a natural 0.40s ring-out before release, holding sustains indefinitely as a warm organ ceiling, releasing fades cleanly over 0.20s (`stopFunMachineVoice()`), and switching keys performs a buttery 40ms crossfade. Punch-in recording stamps passing beat steps into `customProgression` without interrupting the live held voice.
4. **12-Step Loop Sequencer Matrix & Punch-In Recording (`#fun-sequence-grid`, `#fun-machine-rec`, `#fun-machine-reset`)** — Visualizes the 12-step chord spine with step numbers, active chords, and `★ USER` / `AUTO` badges. When punch-in recording is armed (`#fun-machine-rec`) or when a step pill is targeted, striking any key instantly writes that chord into the loop (`customProgression[step] = chord`), re-conducting the entire ensemble on the fly via `customSpine` in `conductEnsemble()`. Resetting reverts cleanly to algorithmic genre chords.
5. **Offline 16-Bit WAV Export Coherence** — Custom sequenced chord progressions and Fun Machine reed-organ voices are rendered directly into offline 16-bit 44.1 kHz WAV downloads alongside live playback.

**Alternatives:** Implementing a freeform multi-track MIDI piano roll or third-party synth engine would breach the zero-dependency contract (D-001) and overwhelm the focused, playful vintage parlor premise.

**Consequences:** HAI, ORACLE! transforms from an algorithmic spectator toy into a live esoteric jam instrument. Users can play along in real time, sequence custom chord progressions, and export deterministic WAV loops preserving their compositions.

## D-021 Product Rebrand to Edmark's Esoteric Fun Machine (2026-10-19, status: accepted)

**Context:** With the completion of real-time play-along chord organ functionality, live loop punch-in sequencing, and sustained keyboard accompaniment over the six-language chamber backing track, the application has evolved from a passive oracle toy into an active, performative synthesizer and parlor apparatus. The maintainer directed a full product rebrand to "Edmark's Esoteric Fun Machine", paying tribute to both kinetic sculptor John Edmark (whose algorithmic geometries inspire the deforming vitrine organisms) and vintage Baldwin home auto-chord organs.

**Decision:**
1. **Application Wordmark and Titles** — Rebrand the browser `<title>`, header wordmark (`EDMARK'S ESOTERIC FUN MACHINE`), Plate VII manual header, and technical documentation to "Edmark's Esoteric Fun Machine".
2. **Oracle Engine Preservation** — Preserve *HAI, ORACLE!* and `src/oracle.lol` as the underlying LOLCODE 1.2 generative score engine that computes deterministic organism seeds, anatomical parameters, and motifs from inscribed phrases.
3. **Specimen Broadsheet & Export Identity** — Engraved PNG broadsheet plates and exports celebrate "EDMARK'S ESOTERIC FUN MACHINE" while maintaining zero-dependency browser-native generation and deterministic offline audio rendering.

**Alternatives:** Keeping the original name without acknowledging the interactive synthesizer transformation would undersell the play-along keyboard manual and jam machine features.

**Consequences:** The product establishes a distinct, memorable persona as a playable esoteric instrument while honoring its algorithmic roots and zero-dependency purity.

## D-022 Chamber Reverb Damping Normalization & 12-Step Fun Machine Loop Harmonization (2026-10-19, status: accepted)

**Context:** On phrases with resonant bandpass filter voices or low root pitches, the procedural chamber convolution reverb experienced intense, overpowering low-frequency feedback ("fog-horn" drone). Analysis revealed that the synthetic impulse response had positive early-reflection DC summing and an un-damped integrator tail that amplified signals by $+25\dots +30\,\text{dB}$ when convolved without normalization. Furthermore, the surface noise wax crackle contained artificial $33\,\text{Hz}$ and $66\,\text{Hz}$ sine waves and was masked by the reverb blowout. Finally, the Fun Machine keyboard needed to be reconciled with the 12-step tempo loop: the maintainer clarified that the keyboard should musically drive the 12-step progression rather than being unchained from it, without the rapid 16th-note retriggering stutter ("jittering") that prompted earlier detachment.

**Decision:**
1. **Impulse Response DC Blocking & Spectral Normalization (`ensureParlorImpulseResponse()`)** — Replaced positive reflection taps with alternating phase polarities ($[+0.35, -0.28, +0.22, -0.18, +0.14, -0.11, +0.08, -0.06]$), keeping the reflection DC sum near zero. Added a first-order highpass DC-block filter ($R = 0.985$, ~105 Hz cutoff) and air absorption damping to the diffuse tail generator. Measured peak spectral magnitude across the audio spectrum and normalized the buffer to a safe unity room gain ceiling ($0.75$), preventing the convolver from boosting dry audio.
2. **Reverb Highpass Send Biquad & Compressor Ceilings (`playScore()`, `exportSpecimenWav()`)** — Inserted a dedicated highpass send filter (`parlorReverbFilter`, $180\,\text{Hz}$, $Q = 0.7$) between the mix filter and `parlorReverbSend` in both real-time and offline audio transports, preventing sub-bass drones and bandpass filter peaks from entering the reverb tank. Routed the convolver output through the master dynamics compressor before reaching the output bus.
3. **Reshaped Wax Crackle Surface Noise (`ensureWaxCrackleBuffer()`)** — Replaced artificial $33\,\text{Hz}$ and $66\,\text{Hz}$ sine tones with gentle filtered mechanical brown noise ($0.04$ level, $0.20$ mix) modulated by 78 RPM eccentric wobble and thumps. Increased stylus micro-crackle density to $340/\text{sec}$ and discrete shellac dust pops to $38/\text{sec}$ with damped acoustic ringing, and adjusted default crackle gain to $0.42$ for an audible, warm vintage texture that sits cleanly behind the music without being drowned out.
4. **12-Step Synchronized Loop Progression & Overlay Melody (`scheduleAhead()`, `triggerFunKey()`)** — When a key is held during playback:
   - *Accompaniment Chord Progression*: In auto-chord mode, chords advance across the 4 harmonic regions, triggering solely on region start steps ($t = 0, 3, 6, 9$) with a sustained $3\times\text{stepDuration}$ envelope. This eliminates 16th-note retriggering jitter while preserving authentic harmonic progression voice-leading.
   - *Overlaying Progression Melody*: On every tempo step ($t = 0\dots 11$), the Fun Machine schedules the corresponding melodic note (`step.melodyPitch`) with a warm, singing solo lead voice.
   - *Standalone Playback*: When the transport is stopped/idle, keys audition directly with natural release.
   - *Punch-In REC*: As steps pass with REC armed, the regional chords are stamped into `customProgression` and reflected on the 12-step sequence grid.
   - *Telemetry*: The console telemetry dynamically reports current step, region, chord, and solo melody notes in real time.

**Alternatives:** Lowering master volume or adding steep global lowpass shelving would muddy the entire ensemble. Keeping the keyboard detached from tempo steps made it unable to play synchronized chord progressions with the 12-step backing ensemble.

**Consequences:** The intense fog-horn feedback is completely eliminated across all phrases; chamber reverb provides realistic room ambience; wax crackle and dust pops are warm and audible; and the Fun Machine locks to the 12-step tempo loop with smooth regional chord changes and singing step melodies.

## D-023 Master transport with a shared live/offline ensemble graph (2026-10-19, status: accepted)

**Context:** P5-18 begins the synthesizer-workstation phase (P5-18 through P5-21). Until now the loop could only be restarted or muted, and `playScore()` and `exportSpecimenWav()` each built their own copy of the ensemble graph by hand. The copies had drifted: exports routed chimes, choir, and fungal voices around the creature filter, omitted the stereo panner and the dry filter tap, and played sequenced Fun Machine chords even in lead-solo mode. A mixer (P5-19) and stem export (P5-21) would have had to be built twice.

**Decision:**
1. **One graph builder (`src/ensemble.mjs`, `buildEnsembleGraph()`)** creates and wires every bus, filter, delay, compressor, parlor reverb and crackle layer, and drone for both the live `AudioContext` and the `OfflineAudioContext`. The live routing is canonical because it is what the maintainer has listened to. Per-step voices are scheduled through one host function, `scheduleEnsembleStep()`, plus `scheduleSequencedFunChord()`; held-key play-along and punch-in recording stay live-only.
2. **Transport states (`src/transport.mjs`)** are `stopped`, `playing`, and `paused`, reduced by pure `transportReduce()`. Audio runs only while the transport is playing and the bell is unmuted. Mute keeps the transport state and freezes the cursor; summon and RESTART THE MELODY issue `restart`.
3. **Pause rebuilds rather than suspends.** Pausing stops the scheduler, fades the whole output bus, and stores the raw step after the last *audible* step. Play rebuilds the graph and resumes at that step. The cursor is a raw counter, not wrapped to 12, because rhythm patterns with five or six cells would otherwise lose phase.
4. **Hotkeys:** `Space` toggles play/pause, `Esc` stops and rewinds. Space is left to the browser while typing and on keyboard-focused buttons, checkboxes, and switches. The host tracks the control last focused by a pointer press; Space on that control goes to the transport. `:focus-visible` was tried first and rejected: Chrome promotes a clicked button to `:focus-visible` on the first key press, so Space re-submitted the summon form.

**Alternatives:** `AudioContext.suspend()` would freeze reverb and delay tails mid-air and resume them exactly, but it also silences the Fun Machine keyboard and vitrine percussion while paused, and step-highlight timers run on wall-clock time and would fire early. Space as an unconditional hotkey would take Space activation away from keyboard users (P4-02). Keeping two hand-built graphs would mean building the mixer twice.

**Consequences:** WAV exports now render the same routing as live playback, so they sound slightly different from earlier exports: chimes, choir, and fungal voices pass through the creature filter, with the panner and dry filter tap present. Lead-solo mode no longer renders sequenced chords into the WAV. A paused loop resumes with a fresh 160 ms drone fade-in instead of a frozen tail. P5-19 can add per-channel strips inside `buildEnsembleGraph()` once and get them in both live and offline audio.

## D-024 Eight-channel parlor mixer built into the shared ensemble graph (2026-10-19, status: accepted; placement in point 5 superseded by D-027)

**Context:** P5-19 asks for faders, stereo panning, a mute/solo matrix, and VU metering. The ensemble already had a second, partial mute system: each plate's ENGAGE/SILENCE switch skipped scheduling and ducked its bus with hard-coded levels repeated in a dozen places. A mixer added on top would have given each bandmate two mutes that could disagree.

**Decision:**
1. **One strip per bus, inside `buildEnsembleGraph()`.** Eight channels (`lead`, `fun`, `beat`, `bass`, `harmony`, `chime`, `chant`, `fungal`) each route bus → fader → `StereoPannerNode` before reaching the existing filter, compressor, and output paths. Live playback adds a post-pan `AnalyserNode` tap for meters; offline renders skip it. WAV export therefore honors every fader, pan, mute, and solo.
2. **Faders upmix to stereo.** Each fader is an explicit 2-channel `GainNode`, so a centered panner passes mono voices at unity instead of the −3 dB it applies to mono input. The vitrine's drag panner, which now receives stereo, gets a fixed `Math.SQRT1_2` trim so its path keeps the pre-mixer balance. Measured: a default-console WAV of "the moon owes me five dollars" (parlor off) rendered −26.78 dB RMS and peak 14280 both before and after the change.
3. **Plate switches are channel mutes.** The five `*Enabled` flags are gone. A plate's ENGAGE/SILENCE switch toggles its channel's mixer mute, and the Bandstand's ENGAGE FULL BAND and SOLO LOLCODE LEAD mute or unmute the five accompaniment channels. A muted plate still skips scheduling, as before. Bus voicing levels are now constant (`ENSEMBLE_BUS_GAINS`).
4. **Pure state in `src/mixer.mjs`:** a two-part fader taper: square-law `(v / 80)²` below unity (40 = −12 dB) and linear in dB above it (80 = unity, 100 = +12 dB; raised from +3.9 dB the same day after listening found the lead and choir too quiet to lift), pan −100..100, and solo semantics where any solo isolates the soloed channels but an explicit mute still wins. Mixer settings are a session control like master volume (D-009): they persist across summons, never touch the score, and are not stored.
5. **Placement:** between the Fun Machine and Plate II, as the roadmap item says. Below 480 px the strips become a horizontally scrolling rail instead of shrinking past legibility.
6. **Default voicing trims (`CHANNEL_VOICING_DB`).** Each strip starts with a fixed trim before its fader, so the default balance can change while every fader still opens at 0.0 dB. Listening found the lead and choir consistently too quiet. Solo WAV renders confirmed it: on two typical phrases the lead measured about level with the bass (−32.7 vs −30.8 dB RMS) and the choir 20–29 dB under it. The lead is trimmed +6 dB and the choir +12 dB. The lead's own `mix` node is left alone because it also carries the vitrine's hold-and-tap swell. After the trims, full-mix peaks on three test phrases stayed between −6.5 and −7.7 dBFS with no clipping. This intentionally ends the "default console matches the pre-mixer level" property measured in point 2.
7. **The choir bypasses the creature filter.** Shakespeare voices are already shaped by three formant bandpasses each, and on bandpass creatures (score voices 1 and 5) the creature filter stacked a fourth narrow bandpass on top. The choir strip now feeds the compressor, delay, and parlor reverb send directly. Measured on "three pigeons in a borrowed coat" (voice 5): choir solo −66.6 → −47.2 dB RMS. On the lowpass creatures "the moon owes me five dollars" and "an accordion at the edge of time" the gain was only 3.6 dB and 1.7 dB, so the +12 dB trim stays. The choir no longer follows the vitrine drag panner or the creature filter's live sweep.
8. **Bandpass creatures blend a dry lead tap (`LEAD_DRY_TAP`).** Bandpass creatures centered their filter around 2.5–2.9 kHz, far above the melody, which buried the lead at −51 to −57 dB solo RMS. Lowering Q would not reach the fundamentals and would blur every creature's filter character. Instead the lead strip feeds a parallel unfiltered copy to the compressor and delay at 0.5 (−6 dB) on bandpass creatures and 0 on lowpass ones, so the filtered color stays on top. Solo lead RMS before → after: "three pigeons in a borrowed coat" −51.0 → −28.8 dB, "Tuesday smells faintly purple" −51.2 → −29.2, "my socks are haunted" −57.1 → −33.0, "the clock forgot me" −50.7 → −25.3. Lowpass creatures render identically (moon −26.8, accordion −26.5). Full-mix peaks stay at −7.4 to −7.7 dBFS with no clipping. The tap carries the lead channel's drones as well as its notes.

**Alternatives:** Keeping plate switches separate from mixer mutes would leave two silencing controls per bandmate. A master-bus meter alone would not show which bandmate is hot. Building strips only in the live graph would let exports diverge from what is heard (the problem D-023 fixed).

**Consequences:** On bandpass creatures (score voices 1 and 5) the organ, chimes, and mycelium stay filtered and quiet; the lead and choir are rescued by points 7 and 8. Hard-panning a channel puts its full level on one side (+3 dB acoustic power versus center), which is standard balance behavior for a stereo source. The Fun Machine strip applies only while the transport is running; idle keyboard auditioning still uses its direct path. The parlor room (reverb, crackle, ticks) keeps its own console and is the ninth stem planned for P5-21.

## D-025 Stem bundle and MIDI score built from the shared graph and live schedulers (2026-10-19, status: accepted)

**Context:** P5-21 asks for a nine-track WAV stem ZIP and a multi-track Standard MIDI File without adding dependencies (D-001). D-023 and D-024 already put every voice through one graph with per-channel strips, so the open questions were what each stem contains, where MIDI notes come from, and how to package files in the browser.

**Decision:**
1. **One offline renderer (`renderEnsembleLoop()`)** schedules a 12-step loop through `buildEnsembleGraph()` for the WAV mix, each stem, and MIDI capture. Overrides replace strip levels (`channels`), room levels (`parlor`), clockwork (`clockTicks`), render muted plates (`engageAll`), and capture notes (`captureNotes`); `render: false` schedules without rendering.
2. **Stems:** eight channel stems, each rendered alone at its own console fader and pan with mute and solo ignored (`stemSettings()`), keeping its own chamber reverb but no crackle or clockwork. A ninth parlor-room stem carries the crackle and escapement at the room console's settings. All stems share the WAV loop's length, start offset, and master volume, so they line up at 0 s in any DAW. A README lists tempo, loop length, and contents.
3. **ZIP (`src/zip.mjs`):** STORED entries with CRC-32 and the DOS epoch date, so identical stems produce identical archives. PCM barely compresses, and DEFLATE would mean a dependency or a much larger module. Entry names are validated against path traversal.
4. **MIDI from the schedulers (`logNote()`):** each pitched scheduler records `{ channel, midi, at, duration, peak }` into an optional `transport.noteLog`, so the MIDI file comes from the same code that makes the sound rather than a parallel re-derivation that could drift. `src/midi.mjs` writes SMF Type 1 at 480 PPQ: a conductor track (title, tempo, 4/4), then LEAD, MANUAL, PULSE (GM drums on channel 10), BASS, ORGAN, CHIMES, and CHOIR with stock GM programs. Notes are clipped to the loop, repeated pitches are trimmed so no note-off cuts a newer note, and unison doublings merge. Velocity scales each part from its loudest event (40–127).

**Alternatives:** Deriving MIDI from the VM step data directly would duplicate every scheduler's pitch logic. Rendering stems by muting the live console would make the bundle depend on whatever the player last soloed. A DEFLATE implementation or a library (JSZip, a MIDI writer) would breach the zero-dependency boundary for little gain.

**Consequences:** Stems sum close to, not exactly to, the mix: the master compressor reacts to each stem separately and the wax crackle is random per render (measured −27 dB residual on "the moon owes me five dollars"). Just-intonation chimes round to the nearest equal-tempered note, and the mycelium voice is unpitched, so it is absent from MIDI. MIDI includes muted plates; stems include muted channels. A 9-stem bundle of a four-second loop is about 8.5 MB and renders in under two seconds on the test machine. The rhythm patterns with five cells still do not tile seamlessly at 12 steps (noted in HANDOFF since session 19).

## D-026 Sessions persist on-device in localStorage presets and portable .fun files (2026-10-19, status: accepted)

**Context:** P5-20 asks players to save and recall a whole jam: phrase, plate mutations and edits, punched progression, rulebook, room, tempo, volume, and console. Until now the app kept no state past the tab (D-001, D-015) and ARCHITECTURE and SECURITY promised no local storage. The maintainer approved on-device `localStorage` presets plus `.fun` file save/load on 2026-10-19.

**Decision:**
1. **Two stores, both on-device.** Presets live in one `localStorage` key (`edmark-fun-machine.presets.v1`, at most 24, newest first). `.fun` files are downloaded and opened by the player. Nothing is transmitted; there are still no cookies, `sessionStorage`, IndexedDB, analytics, or service worker.
2. **Strict boundary (`src/session.mjs`).** A session is versioned JSON (`format: "edmark-fun-session"`, `version: 1`) validated against an allowlist: every field required, no unknown keys, integers in range, enums from fixed lists, phrase 1–72 characters without control characters, files at most 64 KB. A failing file is rejected whole and names the field; nothing is repaired. Presets are revalidated on every read, and a bad entry is dropped without hiding the rest.
3. **Small values only.** Punched chords are stored as `(root, quality)` and rebuilt with `buildFunChord()` (verified identical across every genre, quality, and root). Plate cell edits are stored as click counts per cell, replayed through each plate's own cycler; cells cycle independently, so counts reproduce any click order (tested). Plates store their mutation counts, and the VMs recompose from the phrase.
4. **Restoring** summons the phrase through the normal score path, then layers plates, progression, rulebook, room, tempo, volume, and console. A playing transport restarts on the restored loop; otherwise it stops.
5. **Storage failure is ordinary.** Every `localStorage` access is wrapped; when storage is blocked (private windows, previews, full quota) preset saves report it and `.fun` files keep working.

**Alternatives:** IndexedDB is heavier than a handful of small JSON records. Storing full VM step structures would push large, nested, label-bearing data across the boundary. Storing a click log instead of per-cell counts would grow without bound. A server or sync service would end the client-only privacy model.

**Consequences:** Saved presets keep phrases on the device until the player deletes them (DELETE in the ledger, or clearing site data). A `.fun` file contains the phrase in plain text, like the PNG broadsheet and the `#omen=` link. The session format is now a compatibility surface: future fields need a version bump and a migration, and D-003-style determinism changes can make an old session summon a different creature.

## D-027 The page is a four-wing workstation: perform, mix, keep, then the band (2026-10-19, status: accepted)

**Context:** The DAW phase (D-023 through D-026) added its controls wherever there was room. The transport rail, master volume and tempo, restart, and five export buttons all sat in the reading strip, whose action column stacked six buttons on desktop. The mixer and Session Ledger sat between the Fun Machine and Plate II, while the Kapellmeister, Bandstand, and parlor room sat at the bottom of the page. A player had to scroll past the five VM plates to move between related controls. At phone width the preset-name field inherited the summon field's 3.8 rem height, and the Kapellmeister rulebook select and footer links overflowed into the cabinet's hidden overflow.

**Decision:** The maintainer chose this layout on 2026-10-19.
1. **The reading strip only reads.** It holds the creature name and score card and stays the polite live region. It has no buttons, so moving the sliders no longer re-announces the whole reading.
2. **Wing I · Perform:** the transport rail (play, pause, stop, restart, step readout, master volume, tempo, hotkey legend), then the Fun Machine, then the Kapellmeister rulebook that colors its chords.
3. **Wing II · Mix:** the Bandstand's group switches, the eight-channel console, and the parlor room, which is the ninth stem.
4. **Wing III · Keep:** the Session Ledger, then an export and share desk (`#export-engine`) grouped as audio (WAV loop, nine stems), score (MIDI), and plate and link (PNG, copy omen link).
5. **Wing IV · The Band:** Plates II–VI last, as the detailed editors behind the mix. Their ENGAGE/SILENCE switches are still the console's mutes (D-024).
6. **Markup moves, ids stay.** Every id `src/app.mjs` and the tests use is unchanged. Each wing is a `<section>` with an `h2` drawer label on a parchment band, so the heading outline and the keyboard tab order both follow perform → mix → keep → band.
7. **The transport rail stays in place,** not sticky. `Space` and `Esc` already work from anywhere, and a sticky rail would need the cabinet's `overflow: hidden` changed to `overflow: clip`. That is better done as its own change.

**Alternatives:** Placing the plates inside Wing I would follow signal order literally, but it would push the mixer and the Keep wing about 1,300 px further down on desktop. Folding the exports into the Session Ledger would mix "save this jam" with "make files for elsewhere." A sticky transport was deferred, not rejected.

**Consequences:** D-024 point 5 (mixer placement) is superseded. A new structural test in `tests/static.test.mjs` checks the wing order, that the reading strip holds no controls, and that the transport and export buttons sit in their wings. The older order checks (Fun Machine, then mixer, then ledger, then Plate II) still hold. Phrase identity, audio, and stored session formats are untouched.

## D-028 INTERCAL 1972 Grand Ensemble Conductor and Lush Synth Pad Fun Machine Overhaul (2026-10-20, status: accepted; Fun Machine voice superseded by D-029; arrangement mechanics refined by D-030)

**Context:** The ensemble previously suffered from a continuous "wall of sound" where all seven instruments fired unconditionally on every 16th-note step across the 12-step loop without dynamic arrangement, musical breathing, or sectional contrast. Furthermore, the one-finger chord organ had critical sonic and interactive issues: it used a harsh wheezy reed combo-organ tone (two sawteeth with rapid 5.5 Hz vibrato into a buzzy 2400 Hz resonant filter) and an abrasive duplicate lead note on every step, and when keys were pushed during play-along, the rest of the band failed to modulate with the user's chords. The maintainer directed: "INTERCAL it is. Let's overcome the wall of sound *first*. I have issues with the one-finger chord organ right now."

**Decision:**
1. **Canonical INTERCAL (1972) Conductor (`src/conductor.i`, `src/intercal.mjs`):**
   - Employs genuine INTERCAL 1972 semantics (Don Woods & James M. Lyon, Princeton University).
   - Enforces the INTERCAL Politeness Quotient: Statement politeness ratio is strictly checked ($0.20 \le P \le 0.334$). Rude programs fail with `ICL079`; groveling programs fail with `ICL099`. The canonical conductor score executes with 6 polite statements out of 27 ($22.2\%$, balanced consonance).
   - Sectional Dynamic Arrangement: Uses `PLEASE IGNORE` and `PLEASE REMEMBER` to dynamically orchestrate channel breathing across 4 musical regions:
     - Region 0 (Steps 0..2): Exposition Groove (Lead, Beat, Bass, Chimes, Fungal, Fun active; Harmony and Choir rest to establish the groove).
     - Region 1 (Steps 3..5): Antiphonal Conversation (`PLEASE IGNORE :1` rests the Lead; Befunge chord organ and Shakespeare formant choir step forward into the spotlight).
     - Region 2 (Steps 6..8): Grand Tutti Apotheosis (`PLEASE REMEMBER :1`; all instruments join together in full dynamic climax).
     - Region 3 (Steps 9..11): Hypogeal Breakdown & Cadence Turnaround (Beat and Bass rest on steps 9-10; `(100) PLEASE COME FROM (60)` intercepts step 11 to resolve the turnaround cadence into the next cycle).
   - In `RAW ESOTERIC CHAOS (UNFETTERED VMS)`, arrangement breathing is bypassed and all VMs output continuously.
2. **Lush Synth Pad Fun Machine Overhaul:**
   - Replaces the harsh combo reed organ with a warm, lush, cinematic analog-style synth pad & singing lead:
     - Dual detuned oscillators (warm triangle at 65% + soft detuned saw at 35% with $\pm 4.5$ cents detuning).
     - Deep pure sine sub-oscillator (1 octave down at 20% gain) for analog weight.
     - Slow, silky 0.35 Hz stereo chorus shimmer LFO (5 cents depth) replacing rapid 5.5 Hz vibrato.
     - Warm 24dB / smooth resonant lowpass filter (720 Hz attack swell $\to$ 1150 Hz $\to$ 920 Hz resting, Q = 0.85).
     - Silky ADSR envelope with gentle 65ms attack and 180ms velvety exponential release.
3. **Real-Time Ensemble Following:**
   - Striking or holding a key on the Fun Machine manual (`triggerFunKey`) actively re-conducts the entire ensemble in real time: Brainfuck walking bass, Befunge chord organ, Piet chimes, Shakespeare choir, and LOLCODE lead immediately modulate to accompany the user's chord.
   - Releasing the key restores the baseline Kapellmeister / custom progression.
   - Eliminates duplicate lead collision: in `auto_chord` mode, only the sustained chord pad sounds across regions; `scheduleFunMachineLeadNote` only sounds when `funMachineMode === 'lead'`.

**Alternatives:** Adding manual mute automation curves would complicate session format and mixer state. Keeping the 5.5 Hz vibrato combo reed organ clashed with the antique chamber and modern lead synthesis.

**Consequences:** The ensemble breathes naturally with call-and-response and sectional dynamics instead of a continuous wall of sound. The Fun Machine sounds rich, warm, and cinematic, and live play-along feels like jamming with a responsive backing band that modulates on the fly. 79/79 tests pass with zero external dependencies.

## D-029 The Fun Machine is a one-finger accompanist the band follows (2026-10-20, status: accepted)

**Context:** After D-028's pad overhaul, the maintainer said the one-finger accompaniment still did not work as intended: it should be *inspired by* a Baldwin Fun Machine, not sound like a synth organ. A held key should make a synth pad lead play a natural chord, arpeggio, or progression that fits the band's rhythm and instrumentation, "like the band is following a composer playing the lead melody." Investigation found the organ character came from a saw-and-triangle tone with a 65 ms attack re-struck as block chords, a melody note on every step competing with the LOLCODE lead, and no reverb or delay send. It also found a real bug: Fun Machine chords name absolute pitch classes, but the conductor reads spine chords as intervals above the creature's tonic, so the band played a transposed chord under the pad (G held on an E♭ creature conducted B♭ minor). The maintainer chose three selectable styles and a lead that steps back (2026-10-20).

**Decision:**
1. **Style chips replace the mode switch and chord-quality chips.** SWELL holds one genre-coloured pad chord on the key and the band settles onto it; ARPEGGIO adds chord tones rippling two per step in the band's own rhythm; PROGRESSION walks the genre's four-chord progression from the key with a singing lead line. The genre still picks chord colours (`buildFunChord(key, "auto", genre, tonic)`). Pure logic lives in `src/accompaniment.mjs`.
2. **Three non-organ voices.** A stereo pad (two saws detuned ±8 cents panned wide plus a triangle, one slow chorus LFO, a lowpass that opens over an attack scaled to the chord's length, and a 0.9 s release that crossfades into the next chord); a soft pluck for arpeggios (triangle with a quiet pulse through a closing filter, ping-ponged); and a lead with glide between notes and vibrato that arrives only after the note settles. Pads are voice-led (each upper voice takes the nearest octave) with the root kept low.
3. **The band's grid, the band's room.** Pads strike at region starts and arpeggios and lead notes on loop steps, using each step's real duration from the score's rhythm and live tempo. A key pressed mid-region bridges with a pad to the next region start. The Fun Machine strip now feeds the delay and chamber reverb.
4. **The band follows; the lead steps back.** A held key re-conducts the band onto the performance's chords, now converted to the conductor's tonic-relative frame (`toTonicRelative()`), so bass, organ, chimes, and choir play the chord the pad plays. The LOLCODE lead melody and its tonic drones duck by 10 dB while a key is held and return on release. Pads from a previous key fade instead of ringing under the new chord.
5. **Session format v2.** Sessions store `funMachine.style` instead of `mode` and `quality`; v1 files still open (chord mode becomes PROGRESSION, lead solo becomes ARPEGGIO).

**Alternatives:** Keeping chord-quality chips beside style chips would double the choices on a toy meant for one finger. Muting the LOLCODE lead outright would leave the band without its voice while auditioning; keeping it at full level kept two melodies colliding. Fixing the key mismatch by making the pad tonic-relative would have made the C key play something other than C.

**Consequences:** The keyboard plays an arrangement rather than single chords. Sequenced and punched chords sound as pads in the live loop and in WAV and stem exports, and are now labelled and conducted in the right key (the sequencer grid previously showed tonic-relative names for generated steps, such as "C MAJ9" for E♭maj9). The INTERCAL arrangement mask (D-028) gates only the band voices, so the player's part is never rested. Timbre and feel still need a listening pass.

## D-030 The INTERCAL score's registers are the arrangement, and the workstation shows it (2026-10-20, status: accepted; point 4 superseded by D-031)

**Context:** The maintainer asked whether the INTERCAL conductor (D-028) was used in the DAW work and asked for an audit. The masks already gated the live loop, WAV, stems, MIDI capture, and meters through `scheduleEnsembleStep()`. But `composeArrangement()` hard-coded the four masks and read only the politeness ratio from the VM; run literally, `src/conductor.i` disagreed with them (its breakdown kept the beat, and `PLEASE IGNORE :1` froze the lead instead of resting it). Nothing displayed the arrangement, so a soloed voice could fall silent unexplained, and exports carried no section information.

**Decision:**
1. **Registers decide.** Twospot registers `:1..:8` hold one channel each (`#1` plays, `#0` rests); `.1 <- #n` opens section n and each section plays the registers as they stand when the next opens; `.3 <- #s` names the turnaround step, which plays the registers at `GIVE UP`. The VM snapshots registers at each onespot assignment and `composeArrangement(source)` builds the masks from them, rejecting out-of-order sections, non-binary or missing registers, an out-of-range turnaround, or a missing `GIVE UP`. The canonical score was rewritten to this convention and yields the same masks as before.
2. **The player is protected by the score.** `PLEASE IGNORE :8` freezes the Fun Machine register, so the breakdown's `DO :8 <- #0` does nothing; the host consults `:8` for held keys and sequenced chords, so D-029's "the player is never rested" is now a property of the program.
3. **The workstation shows the form.** The transport names the section (`I · EXPOSITION GROOVE`, `· COME FROM` on the turnaround, `UNFETTERED` under Raw Chaos); console strips light TACET while rested; MIDI files carry Marker events at each section and the turnaround; the stem README maps sections to seconds.
4. **Same form for every creature.** The arrangement does not read the score; it is the band's form, not its content.

**Alternatives:** Keeping the hard-coded masks and treating the program as decoration would have left the INTERCAL VM unable to change the music. Seeding the arrangement from the score would vary the form per creature; deferred until someone wants it, since it changes every creature's sound.

**Consequences:** Editing `src/conductor.i` re-arranges the band, and malformed form fails loudly at summon. Default sound is unchanged.

## D-031 Each phrase gets its own arrangement, chosen by the INTERCAL score (2026-10-20, status: accepted; guardrails in point 2 superseded by D-032)

**Context:** After D-030 the maintainer asked that "the arrangements should vary per phrase".

**Decision:**
1. **The phrase whispers, the score chooses.** `arrangementWordFor(score)` avalanche-mixes the score seed into a 16-bit word so the form does not track the seed bits the other VMs read. The VM gains `WRITE IN`, and `composeArrangement(source, score)` writes in the word and then its complement; the score picks each choice with select (`.5 ~ #bit`), using the complement where two voices must alternate.
2. **Guardrails live in the score.** Lead and pulse always open the exposition; bass, organ, and choir may each wait. The choir always sings the antiphony, answered by the lead or the organ but never both, and the pulse may step out. The third section is always tutti. The breakdown always drops the pulse, keeps exactly one of lead and organ, and may drop the bass and choir. The turnaround always brings pulse, bass, and lead home; it starts on step 10 or 11 (`#3 $ .7` mingles binary 11 with one more bit). Chimes, fungal voices, and the player never rest. That is nine binary choices; 272 distinct forms appeared across 400 sample phrases.
3. **The turnaround is a span.** From its start step to the loop's end the band plays the registers at `GIVE UP`; the host rejects a start outside steps 10–11.
4. **Same phrase, same form.** Determinism holds: the word derives only from the seed.

**Alternatives:** Letting the host pick among hard-coded templates would put the choice back in JavaScript (the D-030 problem). Free per-voice random bits would allow forms with no pulse or no tune.

**Consequences:** Every creature now has its own breathing pattern, so phrases sound more distinct; existing creatures' arrangements changed (shared links summon the same phrase but a different form than before this change). Sections keep their names. A listening pass across phrases is still owed.

## D-032 No arrangement falls below five band voices (2026-10-20, status: accepted)

**Context:** In the listening pass, the maintainer said that everything "sounds pretty great" but some arrangements "definitely do sound thin". D-031 allowed steps with as few as three of the seven band voices, such as a breakdown with only organ, chimes, and fungal voices, or an exposition or antiphony with no bass or pulse.

**Decision:** The conductor score guarantees at least five band voices on every step, and pulse and bass under the first three sections. Lead, pulse, and bass always open. The organ and choir may each colour the exposition. The choir always sings the antiphony over pulse and bass, answered by the lead or the organ; the chimes may breathe. The third section is tutti. The breakdown drops only the pulse: lead and organ carry the tune over either the bass or the choir. The turnaround brings pulse, bass, and lead home, and the choir may join. Seven choices remain, which yield 120 distinct forms across 400 sample phrases. A test asserts the floor on every step across 160 phrases.

**Alternatives:** Keeping the D-031 choices but boosting levels in thin sections would hide sparse forms behind loudness. Dropping per-phrase variation would undo D-031.

**Consequences:** Forms are fuller and closer to D-028's original densities, with less contrast between phrases than D-031. Arrangements of existing phrases changed again.

## D-033 The Kapellmeister rulebooks move into an Inform 7 source file (2026-10-20, status: accepted)

**Context:** The six genre rulebooks are the project's most-edited musical knowledge, but they live as `switch (genre)` branches scattered across `src/conductor.mjs`. These cover chord colours in `buildFunChord()`, progressions in `buildFunProgression()`, spines in the `build*Spine()` functions, melody snapping in `projectConsonantPitch()`, and bass walks, organ voicings, chime ratios, and bass gates in `conductEnsemble()`. Adding or retuning a genre means editing six functions. The maintainer asked for Inform 7, the natural-language interactive-fiction language, to take this over (2026-10-20). Inform 7's own core concepts are *kinds*, *properties*, *tables*, and *rulebooks*, which are the shape this knowledge already has.

**Decision:**
1. **A canonical source file, `src/rulebooks.ni`,** written in a strict subset of Inform 7 (`.ni` is Inform 7's source extension). It declares every genre, its chord spine, colouring rules, Fun Machine progressions, melody tones, bass walk, organ voicing, and chime ratios.
2. **A purpose-built interpreter, `src/inform.mjs`,** fetched and run at load like every other band language. It parses the subset, rejects anything else with line numbers, evaluates every rulebook once over its whole input domain, and returns frozen, validated plain data (`compileRulebooks(source) → { genres }`). It runs no world model, no parser, and no turn loop. The conductor consumes the data and never sees Inform text.
3. **Algorithms stay in JavaScript, named by the rulebooks.** The Tonnetz P/L/R walk, the Euler *Gradus* sieve, and counterpoint contrary motion remain `conductor.mjs` functions. A genre selects them through an enumerated kind of value (`The melody method of Victorian Tonnetz is Euler sieving.`), so the source can only choose from an allowlist.
4. **Behaviour is preserved exactly.** Before migration, the current outputs are frozen into a golden fixture, and the compiled rulebooks must reproduce it bit for bit.
5. **Genre codes are stable.** Each genre declares its existing code (`"smoky_jazz"`), so v1/v2 `.fun` sessions and presets keep validating against the same IDs.

**The subset.** Every construct is real Inform 7 syntax, and the interpreter accepts only these:

| Construct | Example |
| --- | --- |
| Bibliographic sentence and headings | `"The Kapellmeister's Rulebooks" by Edmark's Esoteric Fun Machine`; `Part 2 - Smoky Parlor Jazz` |
| Kinds of thing and of value | `A genre is a kind of thing.` `Chord quality is a kind of value. The chord qualities are major, minor, dom7, maj9, min9, dom7alt, dim, modal open, phrygian, lydian and raw.` |
| Properties, either/or properties, defaults | `A genre has some text called the motto.` `A genre can be insistent or patient. A genre is usually patient.` |
| Instances and assertions | `Smoky Parlor Jazz is an insistent genre. The code of Smoky Parlor Jazz is "smoky_jazz".` |
| Globals the host sets before evaluation | `The interval above the tonic is a number that varies.` |
| Tables (tab-separated, `--` blank, `(continued)`) | `Table of Smoky Jazz Changes` with `region`, `degree`, `quality`, `label` columns |
| Value-producing, genre-based rulebooks | `The colouring rules are a genre based rulebook producing a chord quality.` |
| Rules with `when` conditions and a result | `Colouring rule for Smoky Parlor Jazz when the interval above the tonic is listed in {0, 5}: rule succeeds with result maj9.` |
| Conditions | `is`, `is not`, `is at most`, `is at least`, `is listed in {…}`, `and` |

An excerpt of what Smoky Parlor Jazz would look like:

```inform7
Smoky Parlor Jazz is an insistent voiced genre. The code of Smoky Parlor Jazz is "smoky_jazz".
The motto of Smoky Parlor Jazz is "ii-V-I progressions with rootless 3rd/7th/9th guide tones, swung overtones, and chromatic approaches."
The changes of Smoky Parlor Jazz are the Table of Smoky Jazz Changes.
The melody method of Smoky Parlor Jazz is member snapping. The melody members of Smoky Parlor Jazz are {root, third, fifth, seventh, ninth}. The melody extensions of Smoky Parlor Jazz are {5, 9}.
The organ voicing of Smoky Parlor Jazz is {third, seventh, ninth}.

Colouring rule for Smoky Parlor Jazz when the interval above the tonic is listed in {0, 5}: rule succeeds with result maj9.
Colouring rule for Smoky Parlor Jazz when the interval above the tonic is listed in {1, 6, 11}: rule succeeds with result dom7alt.
Colouring rule for Smoky Parlor Jazz: rule succeeds with result min9.

Table of Smoky Jazz Changes
region	degree	quality	label
1	0	maj9	"Imaj9"
2	9	min9	"vi9"
3	2	min9	"ii9"
4	1	dom7alt	"♭II7alt"
```

The excerpt matches `src/rulebooks.ni` as built in phase 2.

**Known deviations from real Inform 7, documented in the interpreter:**
- Rules fire in source order, first match wins. Real Inform sorts rules by specificity.
- A spine table may use a `region` column (expanded to three steps) or a `step` column (twelve rows).
- `.ni` files are read as UTF-8, so chord labels may use `♭` and `♯`.

**Phases and acceptance:**
1. **Freeze today.** Add `tests/fixtures/rulebooks-golden.json`, generated from the current `conductor.mjs`. It covers every genre × 12 keys × every chord quality for chord colours and progressions; every spine for a fixed set of sample scores; melody projection over every pitch and strictness 1–12; and `conductEnsemble()` output for the sample scores.
2. **Interpret.** Add `src/inform.mjs` and `src/rulebooks.ni`. Tests cover each construct, rejection with line numbers for out-of-subset text (actions, `Instead of`, `To decide`, and unknown kinds or values), and determinism.
3. **Migrate.** `conductor.mjs` reads compiled genres instead of branching on IDs, and the JavaScript tables are deleted. The golden fixture passes unchanged. `session.mjs` takes its genre allowlist from the compiled codes.
4. **Surface.** The Kapellmeister `<select>`, title, and description come from the rulebooks, and the six options remain in today's order. Update ARCHITECTURE, the manual (a new `inform-rulebooks` entry), README, and the AGENTS map.
5. **Prove the point.** A test compiles a seventh, fixture-only genre written purely in Inform 7, and the conductor plays it with no JavaScript change.

**Alternatives:** JSON tables would be smaller to parse but would lose the readable English and the project's esoteric-language character. Shipping the real Inform 7 compiler to the browser is a large C toolchain and would break the zero-dependency boundary. Running a precompiled Z-machine story file would commit a generated binary and hide the source from the browser. A full rule-specificity sort would be more faithful, but it is hard to predict and test; source order is explicit.

**Consequences:** Retuning or adding a genre becomes editing English prose and tables, and a second source of truth disappears from `conductor.mjs`. The page loads one more file and parses about 250 lines at startup. Determinism and the zero-dependency boundary are unchanged. The risk is a subtle behaviour change during migration, which the golden fixture is there to catch. No Inform 7 project code is copied; only its published syntax is followed.

**Phase 3 note (2026-10-20):** Genre-dependent code runs only after the app installs the rulebooks. Session validation reads `genreCodes()`, and the preset store refuses to parse before installation. Without that guard, every preset would have been dropped, and the next save would have erased them.

**Completed (2026-10-20):** All five phases landed. A fixture-only seventh genre (barbershop quartet, `tests/fixtures/barbershop.ni`) compiles after the six and plays everywhere genres are read, with no JavaScript change.

**Maintainer answers (2026-10-20):** Raw Esoteric Chaos stays a rulebook in the file (`Raw Esoteric Chaos is an unfettered genre.`). A seventh playable genre is a follow-up; P5-23 only proves it is possible, using the fixture-only genre in phase 5.

## D-034 The parlor room hears the whole band, and its layers are measured (2026-10-20, status: accepted)

**Context:** The maintainer could not hear the chamber reverb or the clockwork escapement, and found the wax crackle overpowering. Measuring exported loops on "three pigeons in a borrowed coat" (each layer toggled, renders bit-identical) found the reverb 45 dB under the mix (−70 dBFS RMS), the escapement 25 dB under with peaks masked by the crackle, and the crackle the loudest room layer (−39 dBFS RMS). The reverb only heard the creature filter's output plus choir and pad; a narrow bandpass creature nearly silences that filter (the reason for D-024's dry lead tap), and beat and bass never reached the room.

**Decision:**
1. **Every voice but the bass is heard in the room**, post-fader so the console's balance carries in. The pulse is sent at half strength (`PARLOR_BEAT_SEND`), and the bass stays dry; the 180 Hz highpass (D-022) remains.
2. **Measured levels, named constants** (`src/ensemble.mjs`): reverb send 1.0 per unit of ambience (was 0.32), crackle 0.21 (was 0.42, halved as asked). At the default 55 % ambience the reverb sits 14–21 dB under the mix on three sample creatures, and the crackle 20–21 dB under.
3. **A clock you can hear:** the escapement strike roughly doubles, the case knock doubles with a 70 ms ring, and the ratchet nearly doubles. It peaks near the mix's peaks and sits about 17 dB under its RMS.

**Alternatives:** Re-normalizing the impulse response instead of raising the send would change the D-022 fog-horn tuning and its test. Sending the bass would muddy the room even through the highpass.

**Consequences:** Every creature now sounds like it plays in a room; the overall mix level and peaks are unchanged (the compressor holds them). Stems carry each channel's own share of the room, as before. This needs a listening pass to confirm the balance.

## D-035 Every module and source URL carries a content-hash version stamp (2026-10-20, status: accepted)

**Context:** After d931024 the maintainer's browser ran a fresh `src/app.mjs` against a cached old `src/ensemble.mjs` and failed with "does not provide an export named 'PARLOR_CRACKLE_PER_LEVEL'". `python3 -m http.server` sends `Last-Modified` without `Cache-Control`, so browsers reuse each file for a heuristic period (10 % of its age) without asking the server, and each file's timer runs separately. Static hosts can do the same: GitHub Pages sends `max-age=600` on every file. A hard reload fixed it, but visitors do not know to do that.

**Decision:**
1. **An import map versions every module.** A small inline script in `index.html` holds `ASSET_VERSION` and the list of modules, writes an import map that maps each `./src/<name>.mjs` to `./src/<name>.mjs?v=<ASSET_VERSION>`, then loads the versioned `src/app.mjs`. Relative imports inside modules resolve to the plain URL and are rewritten by the map, so module source keeps ordinary `./x.mjs` imports and Node tests import them unchanged.
2. **Sources follow the module.** `app.mjs` fetches every esoteric source through `sourceUrl()`, which copies its own `?v=` from `import.meta.url`.
3. **The version is a hash of `src/`.** `ASSET_VERSION` is the first 12 hex digits of SHA-256 over every file name and its bytes under `src/`. `node tools/stamp_assets.mjs` rewrites it. `tests/assets.test.mjs` fails when the stamp is stale, when the module list differs from the import closure of `src/app.mjs`, when `index.html` loads any other script, or when a fetch skips `sourceUrl()`. Forgetting to bump is a test failure, not a production bug.
4. **Local development revalidates.** `python3 tools/serve.py` (standard library only) sends `Cache-Control: no-cache`, so edits show up on a normal reload without restamping.
5. **Host guidance for P6-01:** serve `index.html` with `Cache-Control: no-cache` (or a short `max-age`). Versioned URLs may be cached for any length of time.

**Alternatives:** A `?v=` in every import literal would repeat the version in about 40 places, and Node would load query and non-query URLs as separate module instances. A static import-map JSON would repeat it 20 times. A dev server alone would not protect visitors on a static host. A service worker or build step would add machinery the project avoids (D-001). A hand-bumped counter could be forgotten, which is the bug itself.

**Consequences:** Any `src/` edit needs a restamp before the tests pass. A new module must join `MODULES` in `index.html`; the test names the missing file. The only gap left is a stale `index.html`, which is consistent with its own old URLs. A visitor could then get new bytes under an old stamp only if the browser had evicted part of the old set. Serving the page with `no-cache` closes that gap, and a normal reload revalidates the page in every major browser. `styles.css` is not stamped: a stale stylesheet cannot break module linking.

## D-036 The Fun Machine manual climbs like a keyboard (2026-10-20, status: accepted)

**Context:** The maintainer noticed that the left C and the right C' of the 13-key manual sounded in the same octave. The accompanist reduced every key to its pitch class and voiced the pad, arpeggio, and lead in fixed registers, so C' equalled C and keys further right did not reliably sound higher (B's arpeggio sat below C's).

**Decision:** A performance carries `lift`, the key's position on the manual (0 for the left C up to 12 for C'). The chord, and what the band follows, still depend only on the pitch class. The pad's voicing window, the arpeggio (which derives from it), and the lead line all rise by `lift` semitones, so every key sits a semitone above the one to its left and C' sounds exactly an octave above C. Voice leading still picks the nearest octave within the lifted window. Punched sequencer chords keep the unlifted register.

**Alternatives:** Lifting only C' by an octave would leave the keys between C and C' in fixed registers (B under C). Re-voicing each chord from its own root would make progressions jump instead of glide.

**Consequences:** Keys to the right sound brighter and higher; C' reaches G6 at the top of its arpeggio. This refines D-029's voicing, and it needs a listening pass at the top of the manual.

## D-037 Discovery first, the whole cabinet on request (2026-10-20, status: accepted)

**Context:** P4-02's accessibility review found 172 tab stops on the page (70 in the band wing alone). It also found per-step readouts that made screen readers talk throughout the loop, text as small as 6.7 px, and four dimmed text colours under 4.5:1. The maintainer wanted the cabinet not to overwhelm people all at once: "more like a discovery, and then maybe an advanced mode where it's all laid bare like equipment cabinet." They chose drawers that unlock as you play, remembered on this device.

**Decision:**
1. **Discovery is the default.** The front panel (phrase, vitrine, transport, Fun Machine) is always open. Four drawers sit below: Kapellmeister, Mix, Keep, and The Band. Each opens itself the first time the visitor reaches for what it holds: holding a Fun Machine key, finishing a loop, changing something worth keeping (rulebook, mix, plate, sequencer, accompaniment style), and soloing or silencing a voice or hearing four loops. Any drawer opens early by hand, and a drawer the visitor closes stays closed. Openings are announced through a polite status region; focus never moves.
2. **The whole cabinet lays everything bare.** One switch above Wing I toggles between discovery and the whole cabinet, which hides the drawer bars and opens every drawer. Returning to discovery restores the drawers as the visitor left them.
3. **Progressive enhancement.** Drawers are added by `src/app.mjs` around existing elements (ids unchanged). Without scripts every drawer stays open and the switch stays hidden. Sealed drawer bodies use `hidden`, so they leave the tab order and the accessibility tree: discovery starts at 55 tab stops instead of 172.
4. **Remembered on this device only.** `localStorage` key `edmark-fun-machine.cabinet.v1` holds `{ mode, open, seen }`, validated by `parseCabinetState()` (anything foreign starts fresh). Every access is guarded. This extends the on-device storage the maintainer approved for presets (D-026), with the maintainer's explicit approval (2026-10-20).
5. **Accessibility floor.** No text below 0.6rem, dimmed text at 4.5:1 or better, per-step readouts silent, and reduced motion re-read when the setting changes.

**Alternatives:** A fixed simple panel plus one switch would be easier to build but would never invite a visitor further. A guided tour hand-holds most and costs the most to maintain.

**Consequences:** A first visit shows a small, playable instrument; the depth arrives as the visitor plays. A screen-reader pass with real assistive technology is still outstanding (P4-02 stays open).

## D-038 Remove the 12-step punch-in sequencer (2026-10-20, status: accepted)

**Context:** The maintainer found the Fun Machine's 12-step loop progression "fundamentally broken". They had intended a loop machine for recording a series of loops, and "some wires got crossed". They asked to remove it safely before building anything new, and chose to drop it from saved sessions while keeping old files openable.

**Decision:**
1. **Removed:** the punch-in REC and RESET PROGRESSION buttons, the 12-step grid, step targeting, live punch-in, and playback of punched chords (live, and in WAV, stem, and MIDI exports). Gone from code are `customProgression`, `selectedSequencerStep`, `funMachineRec`, `renderFunSequencerGrid()`, `flashSequencerStep()`, and `scheduleSequencedFunChord()`, plus 133 lines of CSS.
2. **Kept:** held keys, the three styles, the band following the held chord through `customSpine`, the lead duck, and every other export. With no key held, `applyEnsembleConductor()` still passed an empty 12-step spine at first, so the band sounded exactly as before (changed by P5-27, below).
3. **Sessions become v3:** `funMachine` holds only `{ style }`. v1 and v2 files and presets still open; their progression is still validated (malformed files are still rejected) and then dropped, and a re-save writes v3.

**Alternatives:** Reserving an empty progression field for later would keep a field that does nothing; a future loop machine will want its own shape.

**Consequences:** The Fun Machine is simpler: keys and styles only. Exports carry no Fun Machine notes, because held keys are live-only, so the MANUAL stem is silent and the MIDI MANUAL track empty until a loop machine records performances (P5-26). Punched chords in old presets are not restored.

**Found in passing:** with no key held, the conductor has always received that truthy empty spine, so Raw Esoteric Chaos never took its "unfettered" early exit in the live app (D-019 intent). Fixed separately as P5-27 (2026-10-20): with no key held, `applyEnsembleConductor()` now passes no custom spine. Raw Chaos plays the VMs' own output; a held key still leads the band; fettered genres are unchanged.

## D-039 The loop machine: a song of loops, each a stack of takes (2026-10-20, status: accepted; built)

**Context:** The removed punch-in sequencer (D-038) was meant to be a loop machine. The maintainer chose the following design on 2026-10-20:
- **A loop** is a take of what they play.
- **Loops stack and chain:** "They should be able to stack as WELL as be sequenced into a series of loops."
- **The band follows** the recording.
- **The newest layer leads** when stacked layers disagree.
- **Exports** carry the whole song.
- **It lives** in the Fun Machine.

**Decision (design):**
1. **Shape.** A *song* is an ordered list of *loops* (at most 16). A loop is one 12-step pass of the band, repeated ×1–×8 before the next loop, and holds up to 4 stacked *layers*. A layer (take) is 12 slots, one per step, each either empty or `{ key, style }`: the manual position held (0–12, so C' stays an octave up, D-036) and the accompaniment style. Steps are the grain because the accompanist already plays on the step grid (pads at regions, arpeggios and leads per step), so a slot-per-step take replays exactly what was heard.
2. **Recording.** RECORD NEW LOOP arms; the take starts at the next loop boundary (step 1), captures one full pass, and is appended as a new loop with one layer. OVERDUB arms a new layer on the selected loop: on that loop's next pass, the visitor plays over the existing layers. A take with no key held is discarded. Recording is announced through the status region.
3. **Playback.** With a song present, the transport plays it: each loop for its repeats, then the next, then back to the first; STOP rewinds to loop 1. Every layer sounds. At each step the band follows the newest layer holding a key there, then older layers. A live key overrides every recording while held. Chords are derived at playback (`buildPerformance(key, style, genre, tonic)`), so a song re-harmonises when the rulebook changes. The INTERCAL arrangement (D-030/D-031) keeps shaping each pass.
4. **The strip.** A compact strip under the Fun Machine keys holds RECORD NEW LOOP, OVERDUB, UNDO LAYER, and CLEAR SONG, plus a row of loop tiles. Each tile shows its number, layer count, and repeats (− / +), and can be selected, moved left or right, and deleted. The playing tile is marked. The strip is on the front panel, since it records what is played there; its controls are labelled buttons with `aria-pressed` where they toggle.
5. **Sessions v4.** Sessions and presets store the song as `{ loops: [{ repeats, layers: [[slot × 12] …] }] }`, strictly validated: key 0–12, style in the three styles, and the limits above. v1–v3 still open with an empty song.
6. **Exports.** With a song, WAV, stems, and MIDI render the whole song (loops × repeats), so the MANUAL stem and MIDI track carry the takes again. The total is capped at 32 passes to keep files bounded. Without a song, exports stay one loop.

**Alternatives:** One chord per region would be simpler but loses the arpeggios and lead lines that make a take sound like playing. A clip launcher (slots A–D) suits live jamming more than building a song. A separate drawer would hide the recorder from what it records.

**Consequences:** The Fun Machine gains a real arrangement surface. Exports grow with the song. Sessions change format again (v4). Build in phases (P5-26).

## D-040 The Fun Machine chooses a voice: the creature's own, or a parlor preset (2026-10-20, status: accepted)

**Context:** Every phrase plays the Fun Machine through the same velvet pad (two detuned saws and a triangle per note, a 0.23 Hz chorus, and a lowpass that opens on the attack), the same triangle-and-square pluck for arpeggios, and the same sine lead. The maintainer asked on 2026-10-20 for a voice selector, so it is "not always the same synth pad": each phrase should be able to choose its own voice deterministically, and there should be presets that are known to sound good.

**Decision:**
1. **A voice is a patch, not code.** `src/voices.mjs` holds frozen, validated patch objects. Each patch has three parts, one per accompaniment role (`pad`, `pluck` for arpeggios, `lead`). Each part gives:
   - up to three oscillator layers, each with a type, a frequency ratio, detune, gain, and stereo spread;
   - an optional sub layer;
   - an optional breath of noise;
   - a filter (type, base, attack peak, sustain, Q);
   - an amplitude envelope with attack and sustain as fractions of the region, plus release in seconds;
   - a chorus LFO (rate and depth) and a delayed vibrato (rate and depth).

   `schedulePadChord()`, `scheduleArpNote()`, and `scheduleFunLeadNote()` read a patch instead of hard-coded numbers. A validator bounds every field: at most 3 layers per note, filter 80–8000 Hz, Q ≤ 8, and attack and release within the current ranges. That limits oscillator count and stops a bad patch from clipping or screeching.
2. **Presets, tuned by ear.** There are seven curated presets, in parlor language:
   - **VELVET PAD**: today's sound, bit for bit. It is the reference and the fallback.
   - **HARMONIUM**: a reed square, a slow bellows swell, and a little nasal bandpass.
   - **GLASS HARMONICA**: sine partials at 1 and 2.76, a soft attack, and long tails.
   - **THEATRE ORGAN**: drawbar-style stacked sines at 1, 2, 3, and 4 with a tremulant.
   - **STRING MACHINE**: an ensemble of three detuned saws with a fast chorus. It is a Solina homage.
   - **MUSIC BOX**: struck triangles at 1 and 4 with a short decay. The pad becomes a rolled chord.
   - **ÆTHER CHOIR**: two formant bandpasses over a saw, sharing vowel tables with Plate VI.

   Each preset names the General MIDI program its MIDI track announces.
3. **The creature's own voice (deterministic).** `src/oracle.lol` gains three score fields, drawn with new, unused divisors so that no existing field changes:
   - `fun_voice` picks one of the seven presets;
   - `fun_bright` (−3..3) shifts the filter by octave-fractions;
   - `fun_spread` (0..4) scales detune and stereo width.

   The host applies the two tweaks inside the validator's bounds. The selector's default, **THE CREATURE'S OWN**, plays that result, so the same phrase always sounds the same and every phrase is still a known-good family. This keeps the spell causal: the creature's voice originates in the score.
4. **The selector.** A row of voice chips under the style chips on the Fun Machine: THE CREATURE'S OWN, then the seven presets. They work like the style chips (`aria-pressed`, keyboard reachable, no layout shift). A rulebook-suggested voice (**MATCH THE RULEBOOK**) is deferred to D-041.
5. **Recorded takes keep their voice.** A loop-machine slot becomes `{ key, style, voice }`, so stacked layers can be different instruments. As built (2026-10-20), a take played in THE CREATURE'S OWN stores `creature` rather than a preset id. The session saves the phrase, so the take replays the tilted, spread voice exactly, which a preset id could not. Sessions become v5 with `funMachine.voice`. Files from v1–v4 open with VELVET PAD everywhere, so they sound as they did when saved.
6. **Exports.** The MANUAL stem renders each slot's voice. As built (2026-10-20), the MIDI file gives each voice used its own MANUAL track, channel, and program instead of program changes on one track. Stacked layers in different voices sound at the same moment, and one channel can hold only one program.

**Alternatives:**
- **Free synthesis per phrase** (the spell emits raw oscillator and filter numbers): more variety, but many phrases would sound bad, and the maintainer asked for presets that sound good.
- **Presets only, with no deterministic default:** loses "every creature is itself".
- **Patches written in Inform 7:** charming, but it widens the subset (D-033) for numeric data that JavaScript validates better.

**Consequences:**
- Sessions change format (v5).
- The score gains three fields, so the score validator, the manual, the share fragment, and the score tests change. Existing creatures' other fields do not change.
- Creatures' Fun Machine sound changes by default. That is the point, but VELVET PAD is one click away.
- CPU stays bounded by the layer cap.

**Maintainer answers (2026-10-20):**
- Voices are kept per recorded slot, so layers can differ.
- THE CREATURE'S OWN is the default.
- MATCH THE RULEBOOK waits for D-041, so each new genre ships with a suggested voice.
- CALLIOPE is dropped, leaving seven presets.

## D-041 Many more Kapellmeister genres, in waves, written in Inform 7 (2026-10-20, status: accepted for waves 1 and 2, 2026-10-21)

**Context:** Seven genres ship: Victorian Tonnetz, Delta Blues, Smoky Parlor Jazz, Palestrina, Mystic Drone, Parlor Ragtime, and Raw Chaos. P5-24 proved a genre can be added in `src/rulebooks.ni` alone. The maintainer asked on 2026-10-20 for "way more musical genres".

**Decision (proposed):**
1. **Waves**, so each one is reviewable and listenable. Every wave appends genres, keeps every entry of the existing genres in the golden fixture identical (as P5-24 did), and is played in the browser before it is committed.
2. **Wave 1: Inform 7 only.** These six genres need no JavaScript, only today's chord qualities and methods:
   - **DOO-WOP PARLOR BALLAD**: I · vi · IV · V, a triplet-feel bass walk, and member-snapped melodies.
   - **SACRED HARP SHAPE-NOTE**: open fifths and minor modal changes, a stern drone bass, and fourths and fifths in the chimes.
   - **ANDALUSIAN FLAMENCO**: i · ♭VII · ♭VI · V with a Phrygian colour on the dominant, and a descending bass walk.
   - **KLEZMER FREYGISH**: a Phrygian-dominant tonic, minor iv, and ♭VII, with augmented-second melody tones.
   - **SEA SHANTY & HORNPIPE**: I · IV · I · V, with a pedal drone under the chorus and plain consonant overtones.
   - **SILENT-FILM LYDIAN**: lydian and maj9 colours, with a Tonnetz walk at high consonance.
3. **Wave 2: six more chord qualities, then six genres.** The qualities are **min7, maj7, half-diminished (m7♭5), augmented, sus4, and major 6**. These are a one-time JavaScript change in the conductor's quality table, labels, and `chordText()`. The Inform 7 kind gains their names, and the golden fixture is unaffected because no existing genre uses them. Then:
   - **BOSSA NOVA SALON**: maj7 and min7, ii–V–I, and a root–fifth bass that anticipates the beat.
   - **BAROQUE CHORALE**: circle-of-fifths changes, half-diminished pre-dominants, and contrary-motion bass.
   - **GOTHIC HORROR ORGAN**: minor, augmented, and diminished chords with chromatic mediants (a P/L Tonnetz walk), plus a pedal bass.
   - **GOSPEL SHOUT**: I6, IV, sus4 "amens", plagal cadences, and a walking bass.
   - **TANGO HABANERA**: minor and half-diminished chords, V7, and a habanera bass walk.
   - **NEO-SOUL LO-FI**: min9, maj7, and min7, with soft member-snapped melodies.
4. **Wave 3 (optional, needs its own decision): feel.** Genres such as waltz, swing, gamelan, and tango want rhythm, not just harmony. A small `feel` property would let a rulebook choose triple or swing step weighting from a fixed JavaScript menu: straight, swing, waltz, or habanera. It would touch the beat and bass schedulers, so it needs listening and possibly its own golden entries. Candidates: VAUDEVILLE WALTZ, GAMELAN PELOG (pentatonic scale snapping), and SWING-ERA BALLROOM.
5. **Menu families.** With 19+ genres, the RULEBOOK `<select>` groups them into `<optgroup>`s using one new Inform 7 property: "A genre has some text called the family" (PARLOR, SACRED & EARLY, FOLK & DANCE, NIGHT CLUB, ESOTERIC). Families are optional, so ungrouped genres still work. A genre may also name a suggested Fun Machine voice (D-040).
6. **Per-genre definition of done:**
   - a motto;
   - changes, melody, bass, organ voicing, overtones, and a Fun Machine progression;
   - the golden fixture appended and re-frozen with `--rewrite` showing only additions;
   - a test that the genre plays through the conductor, the Fun Machine, and session validation (like `tests/seventh-genre.test.mjs`);
   - no layout shift with its title and motto;
   - the maintainer's listen.

**Alternatives:** one big batch (faster, but nobody can listen to twelve genres at once); generating genres from parameters (variety without character).

**Consequences:**
- The rulebook file roughly triples, and the golden fixture grows. Fixture size is watched: it is about 640 KB now, so if it passes about 1.5 MB, per-genre entries narrow to one tonic sweep.
- Saved sessions accept the new codes. Older builds reject them, which is expected.

**Open choices:** which wave-1 genres to keep or swap; whether wave 3 (feel) is wanted at all.

**Wave 1 as built (2026-10-21):**
- Six genres were written in Inform 7 only: Doo-Wop Parlor Ballad, Sacred Harp Shape-Note Hymnody, Andalusian Flamenco Cadence, Klezmer Freygish Dance, Sea Shanty & Hornpipe, and Silent-Film Lydian Dream. Each comes with its changes, Fun Machine progression, bass walk, melody, overtones, and permitted variation moves (D-043).
- Menu families are an optional `family` text property: PARLOR, NIGHT CLUB, SACRED & EARLY, ESOTERIC, FOLK & DANCE. The RULEBOOK menu groups them as optgroups, with THE CREATURE'S OWN first.
- The only JavaScript change is reading `family` and building the groups.
- The golden fixture was re-frozen with additions only: 677 existing entries identical once indices are resolved, and 544 added.
- As a consequence, `harmony_character` now spans 12 fettered genres, so some creatures' own rulebooks borrow a different character than before.

**Wave 2 as built (2026-10-21):**
- Six new chord qualities were added across the engine: `min7`, `maj7`, `half_diminished` (`m7♭5`), `augmented`, `sus4`, and `major_6`. They are defined in `src/conductor.mjs`, `src/variation.mjs`, `src/session.mjs`, and mapped from Inform 7 names in `src/inform.mjs`.
- Six new Kapellmeister genres were authored in Inform 7 (`src/rulebooks.ni`): Bossa Nova Salon, Baroque Chorale, Gothic Horror Organ, Gospel Shout & Revival, Tango Habanera, and Neo-Soul Lo-Fi (bringing total genres to 19 across the 5 menu families).
- Each new genre comes with changes, a Fun Machine progression table, bass walk, organ voicing, melody extensions/methods, overtones, and permitted variation moves.
- Organ voicings and melody extensions are kept strictly consonant with the chord qualities to prevent semitone rubs, verified by clash ceilings in `tests/clashes.test.mjs` (0.0%–0.8% clash rate).
- Golden fixtures (`tests/fixtures/rulebooks-golden.json` and `tests/fixtures/variations-golden.json`) re-frozen with additions only.
- As a consequence, `harmony_character` now spans 18 fettered genres.

**Related:** D-043 (accepted 2026-10-20) adds a goal to this redesign: every creature varies its genre or writes its own. New genres are then written with the variation moves they permit.

## D-042 Only the lead wears the creature filter; the lead sings above C3; every fungus has its own voice (2026-10-20, status: accepted)

**Context:** On 2026-10-20 the maintainer reported four problems:
- the LOLCODE lead and the mycelium always sounded muffled;
- the mycelium sounded alike across phrases;
- the Befunge organ was inaudible although its meter moved;
- the chimes were far too quiet.

Exported stems on four phrases showed why:
- **The filter.** The lead, organ, chimes, and mycelium all passed through the creature filter, a resonant lowpass or bandpass resting at about 1.1–3.5 kHz with Q up to 5.8. Meters read before it.
  - On a bandpass creature ("three pigeons in a borrowed coat") the organ stem measured −60 dB and the chimes −52 dB.
  - The mycelium's clicks are pitched at 2.8–4.4 kHz, so the filter cut them.
- **The lead's register.** Half of all creatures have a root below C3 (the spell's roots run from MIDI 30 to 65). The lead played root plus melody, so their melodies sat in the bass register.
- **The lead's timbre.** Its sawtooth was swapped for a triangle, and its stacked voices were all sines and triangles.
- **The mycelium's sameness.** The eight sporophore forms only shifted timing and a few pitches; between phrases, mycelium spectra differed by 1.6 dB on average.

**Decision:**
1. **Only the LOLCODE lead passes through the creature filter.** The organ, chimes, and mycelium go straight to the compressor and delay, as the choir already did (D-023 item 7), and still reach the parlor reverb.
2. **A brighter, gentler filter.** It rests at `1300 + bloom × 32 + hueShift × 3` Hz (about 2.0–5.2 kHz) with Q `0.9 + edge / 40` (0.9–3.4). `creatureFilter()` is shared by the graph, and so by every export, and by the live vitrine sweep, which used to rest elsewhere; the sweep's cap rises to 9 kHz and its Q cap falls to 4.5. Lowpass creatures also get a dry lead tap at 0.3, beside the bandpass creatures' 0.5.
3. **The lead sings above C3.** `leadOctaveShift()` raises the whole melody by octaves until the root is at least MIDI 48, so the contour is kept. Drones stay at the root. MIDI exports carry the raised notes.
4. **The lead keeps overtones.** The primary voice uses the creature's own waveform, sawtooth included, and the stacked voices draw from triangle, sawtooth, sine, and square.
5. **Organ, chimes, and mycelium are lifted.** Their voicing trims become +4 dB, +6 dB, and +4 dB.
6. **Every fungus form has its own voice.** `src/mycelium.mjs` gives each form its own spikes (waveform, register, sweep, train length, spacing), droplets, spore puffs, and 12-step patterns. Hyphae lengthen trains and rotate the patterns, spores raise puff level and frequency, and bloom tilts every pitch by up to half an octave either way.

**Alternatives:** Raising faders would not fix a filter that removes a voice's band; keeping the filter on everything but brighter would still let bandpass creatures silence the organ; per-phrase random synthesis for the mycelium would lose the tie between what is drawn and what is heard.

**Consequences:**
- Every creature sounds different from before (deliberately): brighter lead, audible organ and chimes, and form-specific mycelium.
- The determinism contract holds, since all of it derives from the score.
- The creature's colour now lives in the lead alone.
- This supersedes the routing in D-018 item 2 and D-023's "chimes, choir, and fungal voices pass through" note.

## D-043 Every creature varies its rulebook, or writes its own; nothing clashes with the chord (2026-10-20, status: accepted)

**Context:** On 2026-10-20 the maintainer said they were "tired of hearing the same exact chord progression. They often clash." They asked for a new goal in the D-041 redesign: each creature generates its own rulebook, or its own variation of an existing one. Measured the same day:
- **Same progressions.** Over 200 phrases, five of the seven genres (Delta Blues, Smoky Jazz, Palestrina, Mystic Drone, Parlor Ragtime) play one identical four-region progression for every creature, transposed to its tonic. Only Victorian Tonnetz varies (16 variants), and Raw Chaos has none by design.
- **Clashes.** In exported MIDI (4 phrases × 6 genres), parts sounded a semitone apart in 15–68% of samples. Even the triad-only Victorian Tonnetz scored 0.54.

| Genre | Chimes off the chord | Melody off the chord |
| --- | --- | --- |
| Victorian Tonnetz | 71% | 43% |
| Parlor Ragtime | 41% | 16% |
| Palestrina | 9% | 46% |

The bass, organ, and choir sit on the chord (0–8% off).

Two causes:
1. **The chimes ignore the chord.** Each chime picks a ratio from the genre's overtone table regardless of chord quality. The table of consonant overtones lists 1/1, 9/8, 6/5, 5/4, 4/3, 3/2, and 5/3, so on a major chord a chime can ring 6/5 (a minor third) or 4/3 (a fourth), each a semitone from the organ's major third.
2. **The melody keeps "avoid notes".** Euler sieving accepts any low-Gradus interval, including a perfect fourth over a major triad, a semitone above its third. The lead now sings higher (D-042), so this is easier to hear.

**Decision:**
1. **Phase 0: nothing clashes with the chord.** These are fixes, needed before any variety.
   - Chimes pick only overtones that are members of the sounding chord, or tensions its quality allows (the 7th of a dom7, the 9th of a maj9 or min9). They fall back to 1/1 when no table entry fits.
   - The melody keeps an avoid-note rule per chord quality: no pitch a semitone above a chord tone of the sounding chord (the fourth over a major chord, the minor sixth over a minor chord), unless the genre names it as a passing tone on weak steps.
   - An executable clash check guards both: the semitone-collision measure above, computed in Node from the conducted parts, with a ceiling per genre. Jazz and blues are allowed their 7ths and 9ths.
2. **The creature's harmony fields.** The spell emits new score fields, drawn with unused divisors so that no existing field changes, as D-040 did:
   - `harmony_turn` (0..3): which region the progression starts from;
   - `harmony_swap` (0..15): a mask of which regions may take a substitution;
   - `harmony_borrow` (0..3): how far to reach outside the key;
   - `harmony_cadence` (0..3): how the loop turns home;
   - `harmony_pace` (0..2): one chord per 3, 6, or 12 steps in places.
3. **Genres declare their variations in Inform 7.** Each genre keeps its changes table as its "as written" form, and gains sentences naming the moves it permits. For example: "Smoky Parlor Jazz permits tritone substitution, relative substitution and secondary dominants." "Palestrina Counterpoint permits relative substitution and a Phrygian cadence."
   - The moves are a fixed JavaScript menu: rotation, relative substitution (I↔vi, IV↔ii), tritone substitution, a secondary dominant before a target, modal borrowing (iv or ♭VI in major), a deceptive cadence (V→vi), a plagal or Phrygian cadence, and pedal or harmonic-rhythm changes.
   - The creature's fields choose among the moves its genre permits, deterministically. A genre that permits nothing still plays as written.
4. **THE CREATURE'S OWN rulebook.** A new entry, first in the RULEBOOK menu. The creature writes its own changes:
   - Its chords are built from the creature's own scale (`score.scale`, already used by its melody), so the harmony and the melody share their notes and clash less.
   - A functional grammar written in Inform 7 tables walks tonic, predominant, and dominant regions, steered by the harmony fields.
   - Bass walk, organ voicing, melody method, and overtones come from a small genre "character" the spell picks (`harmony_character`, 0..N, drawn from the existing genres).
5. **Determinism and the fixture.** "As written" stays exactly reproducible: the golden fixture keeps guarding the canonical tables with variation off. A second fixture freezes the varied spines for a phrase sample, so an unintended change to a creature's progression is caught.
6. **Visibility.** The Kapellmeister readout names the variation, for example "VARIATION: TRITONE SUB · ROTATED · DECEPTIVE CADENCE". MIDI markers carry the chord names. Sessions save the rulebook choice, with "creature" valid in place of a genre code. Whether a named genre plays varied or as written is a session setting, defaulting to varied (open choice below).

**Alternatives:**
- Random chords per phrase: variety, but no genre identity, and more clashes.
- More genres alone (D-041): more flavours, but each still plays one progression for every creature.
- Freeing the chimes and melody from the chord: removes clashes by giving up on harmony.

**Consequences:**
- Most creatures' progressions change, deliberately.
- The rulebook subset grows a little (a "permits" sentence and the functional-grammar tables).
- The conductor gains a variation step between the spine and the parts.
- New D-041 genres are written with their permitted moves from the start.

**Maintainer answers (2026-10-20):** accepted with the recommendations:
- phase 0 (the clash fixes) ships first, on its own;
- named genres play varied by default, with an AS WRITTEN switch;
- the Fun Machine's progressions vary through the same fields.

The default rulebook for a fresh creature (THE CREATURE'S OWN or Victorian Tonnetz) is decided when phase 3 can be heard.

**As built (phase 2, 2026-10-20):**
- The "permits" sentences are written as a list property in the existing subset: "The permitted moves of Smoky Parlor Jazz are {rotation, relative substitution, …}." No new grammar was needed.
- New chords take the genre's colour: ninths in genres written in ninths, with dominants gaining a 9th; dominant sevenths in the all-dom7 blues. That keeps voiced organs inside the chord.
- Parlor Ragtime also permits relative and tritone substitution, since its runs are too short for pace moves.

**As built (phase 4, 2026-10-21):**
- The Fun Machine varies with the band's fields and genre moves, but never by rotation (the held key's chord sounds first) or harmonic pace (its pad strikes on the clock). A lead note written for a replaced chord moves to that chord's nearest tone.
- Sessions v6 store `varied`. Files from before variation existed (v1–v5) open AS WRITTEN, so they sound as saved.
- MIDI markers name every chord change.

**As built (phase 3, 2026-10-21):**
- The grammar is three Inform 7 tables (Harmonic Functions, Harmonic Paths, Chord Shapes). `src/creature-rulebook.mjs` writes the book.
- The path is chosen by `harmony_turn` and `harmony_cadence`, and a root's alternative by `harmony_swap`. Every candidate root is tried for a chord with a third and no flat fifth before any suspended, open, or diminished shape, and a major dominant takes its scale's ♭7.
- The borrowed character (`harmony_character`) supplies bass, overtones, insistence, and permitted moves. Its organ voicing and melody keep to triad members (blue-note scale snapping becomes chord snapping), because the borrowed 7ths, 9ths, and blue notes clashed on a quarter of steps.
- A fresh creature now opens in THE CREATURE'S OWN. The maintainer chose this on 2026-10-21 after hearing it. Until a creature is summoned, the Kapellmeister shows a note in place of the motto.

## D-044 Harmony moves one chord per loop, on the downbeat (2026-10-20, status: accepted)

**Context:** On 2026-10-20 the maintainer said "the chord progressions move too fast in tempo compared to the overall band. We need to make sure the accompaniment is locked in step with the current tempo always." Measured the same day:
- **No drift.** The live scheduler and the accompanist read the same live tempo every step, so the parts never drift apart in time.
- **The harmonic rhythm is the problem.** A step is an eighth note, a loop is 12 steps (4–6 beats), and a genre's twelve-entry spine passed in one loop: a new chord every 3 steps.
  - In beats, chords lasted 1–1.75 beats.
  - In four of the six rhythms they changed between beats (rhythm 0 at beats 0, 1.5, 3, 4.5; rhythm 2 at 0, 1, 2.25, 3.25).
  - Because everything scales with tempo, the slider could not fix it.

**Decision (maintainer's choices: one chord per loop; exports cover the whole cycle):**
1. **A harmonic cycle of four passes.** `HARMONIC_PASSES` is 4. Pass *p* of the loop plays spine entries 3*p*..3*p*+2, four steps each (`passSpine()`):
   - a region table (a four-chord progression) holds one chord per pass, changing on the loop's downbeat;
   - a twelve-row table (the blues) moves every four steps;
   - a variation's secondary dominant or deceptive turn also lands on a four-step boundary.

   `conductEnsemble({ harmonicPass })` conducts one pass; without it, the whole spine plays in one loop, as the golden fixture records.
2. **The Fun Machine follows the clock.** `buildPerformance(…, { pass })` holds the progression's chord for the whole pass: one pad, and the region's three lead notes at steps 1, 5, and 9, each held four steps. Single-chord styles keep their three-step breath. A held key, a recorded leader, and loop-machine layers all move with the pass.
3. **Live and offline.** At each loop downbeat the scheduler enters the pass (`enterHarmonicPass()`), and a song restarts the cycle with itself. The readout shows "step / 12 · pass / 4" and the harmony that is sounding, not the one the scheduler has run ahead to. The compass shows the cycle's four regions and lights the current pass.
4. **Exports render the whole cycle.** WAV, stems, and MIDI cover four loops when there is no song, so the file holds the full progression and still loops seamlessly. A loop-machine song still renders as recorded.

**Alternatives:**
- Two chords per loop: livelier, but in two rhythms the mid-loop change still falls between beats.
- Tempo-relative chord lengths in seconds: these would drift against the beat.
- Fewer chords per loop: this drops the progression's content.

**Consequences:**
- Every creature's harmony now breathes four times slower and on the beat.
- Exports are four times longer without a song.
- Plates show the current pass's conducted parts, and the golden fixture is unchanged.
- The four-pass cycle is fixed for now. A creature's `harmony_pace` still shapes changes within it.

## D-045 Armed downbeat sync, 1-loop count-in, and 12-step tracker for the Fun Machine loop machine (2026-10-21, status: accepted)

**Context:** The maintainer reported that the Loop Machine (P5-26, D-039) was difficult to use because it was unclear when a loop was starting and stopping its recording, and asked for a way to arm and sync it.
Investigation revealed:
- Starting from stopped instantly engaged recording on step 0 with 0ms notice, so the first step was invariably missed before the player could strike a key.
- Mid-loop recording engaged on the downbeat, but there was no countdown or step indicator, leaving the player guessing when downbeat would land.
- The button showed identical red styling whether armed (waiting) or actively recording.
- During recording, the readout statically displayed "● RECORDING A NEW LOOP" without showing which step (1..12) was being captured.
- Notes struck on audible beats could be missed or shifted due to the 280ms look-ahead scheduler sampling `activeHeldFunKey` in advance of sound playback.

**Decision (maintainer-approved):**
1. **1-Loop Count-In & Downbeat Sync:**
   - When stopped, arming (`RECORD NEW LOOP` or `OVERDUB`) initiates a 1-loop (12-step) count-in pass. The band plays to establish the groove, and recording begins automatically on the downbeat of the next pass.
   - When playing, arming syncs to the next downbeat, counting down the remaining steps of the current loop.
2. **Audible Count-In Metronome:**
   - While armed or recording, the mechanical clockwork tick sounds on quarter-beats with a sharp accented click on step 1 (downbeat) so the tempo and meter are immediately legible by ear.
3. **12-Step Visual Progress Tracker:**
   - A dedicated 12-cell step ribbon (`#looper-steps`) inside `#looper` displays:
     - in normal play: a gold playhead tracking the current audible step (1..12);
     - in armed count-in: amber countdown cells;
     - in recording: vibrant recording-red cells displaying the captured note names (or pips);
     - on take landing: clean transition into playing the newly added loop.
4. **Distinct Button & Readout States:**
   - Buttons display pulsing amber `ARMED · SYNCING` while waiting, and pulsing red `● RECORDING` while capturing.
   - The readout narrates every audible step in real time (e.g. `ARMED · COUNT-IN STEP 4 OF 12`, `● RECORDING · STEP 1 OF 12 [C]`).
5. **Audible-Step Keystroke Capture:**
   - Live keypresses during active recording immediately write to the audible step in `recorder.take`, preventing any look-ahead scheduling dropouts.

**Consequences:**
- The loop machine is transparent, musical, and effortless to play along with.
- Zero extra dependencies, fully accessible (0.6rem text floor, prefers-reduced-motion respected).
- All 161 automated tests pass.

## D-046 Note sequencer with interactive 12-step tracker, auto-advancing STEP REC, and downbeat anticipation latching (2026-10-21, status: accepted)

**Context:** The maintainer reported that timing at the start of live recording remained challenging, and asked for a note sequencer alongside live loop capture.
Investigation revealed two distinct factors:
1. **Downbeat Anticipation Timing Gap:** When musicians play along with an audible count-in, keystrokes for beat 1 are naturally struck slightly before or right on the beat. Because Web Audio schedules up to 280ms ahead of real audio time, step 0 of the recording pass was scheduled while `activeHeldFunKey` was still null. Meanwhile, the user's keystroke landed while the audible engine was still in count-in step 11 or while `recorder.mode` was still `"armed"`. As a result, the keystroke was ignored by the recorder, and when step 0 actually sounded, the key was already held, missing the initial note entirely.
2. **Performance Pressure:** Composing a full 12-step chord progression live on a computer keyboard or screen keys without pauses or mistakes is demanding.

**Decision (maintainer-approved):**
1. **Interactive 12-Step Tracker Ribbon (`#looper-steps`):**
   - Each of the 12 cells in `#looper-steps` is an accessible interactive button.
   - Clicking any step selects it (`selectedStepIndex`).
   - Striking a key on the Fun Machine manual (`C..C'`) or computer keys (`[A..K]`) assigns that note, style, and voice to the selected step, plays an audition preview, and updates the song in memory via `setLoopSlot()`.
   - Clicking an already-selected step with a note clears it to a rest (`null`).
2. **Auto-Advancing STEP REC Mode:**
   - A dedicated `STEP REC` button (`#looper-step-rec`) toggles step-by-step entry.
   - Striking a key on the manual records that note to the current step and automatically advances selection to the next step (`(step + 1) % 12`).
   - A `REST (—)` button (`#looper-rest`) clears the selected step and advances to the next step.
   - If the song is empty when step entry begins, loop 1 is created automatically.
3. **Downbeat Anticipation Latching:**
   - Keystrokes struck during armed count-in (or during the step 11 lookahead window) are latched as `anticipatedSlot`.
   - The Step 1 cell immediately illuminates with the anticipated note name.
   - When the recorder transitions to step 0 on the downbeat, `take[0]` receives the latched slot, guaranteeing that downbeat keystrokes are never dropped.
4. **Full Compatibility:**
   - Step-sequenced loops use the exact same data structure as live takes (`loop.layers`). They stack up to 4 layers, chain up to 16 loops, follow the lead rule, save to `.fun` sessions, and export to WAV, stems, and MIDI without any format changes.

**Consequences:**
- Players can compose loops either in real time with armed count-in and latching, or step-by-step with zero timing pressure.
- Downbeat notes struck right before the count-in downbeat are captured reliably.
- Accessible, zero external dependencies, 163 tests passing.

## D-047 Expanded manifestation lexicon, specimen folio identifiers, and 72-slip urn treasury (2026-10-22, status: accepted)

**Context:** The maintainer requested an expanded lexicon of words used to generate catalogue manifestation names and other unique identifiers, as well as a much broader spectrum of randomized phrases drawn from the urn (`#surprise`).

**Decision (maintainer-approved):**
1. **11x Combinatorial Lexicon Expansion:**
   - Expanded `NAME_PARTS.first` (adjectives) from 32 to 64 words, adding Victorian, astronomical, and curious adjectives (AERATED, AETHERIAL, ASTRONOMICAL, CLOCKWORK, DAMASK, GILDED, LACQUERED, OPALESCENT, PNEUMATIC, PYRITE, SELENITE, etc.).
   - Expanded `NAME_PARTS.second` (nouns) from 32 to 64 words, introducing curious instruments, parlor fixtures, and cosmic relics (APPARATUS, ASTROLABE, AUTOMATON, CARILLON, CARTOGRAPHY, CHANDELIER, ESCAPEMENT, FOSSIL, HOROLOGE, LABYRINTH, ORRERY, PHONOGRAPH, PRISM, etc.).
   - Expanded `NAME_PARTS.third` (actions/verbs) from 48 to 64 phrases with dry Victorian and cosmic punchlines (AVOIDS PARLIAMENT, CHALLENGES THE TIDE, DISPENSES UNPROVOKED COUNSEL, FORGIVES THE ARCHITECTURE, HAUNTS THE OCTAVE, LEVITATES CONSERVATIVELY, TASTES OF THUNDER, etc.).
   - Expanded `NAME_PARTS.fourth` (realms/locations) from 24 to 32 evocative locations (THE ARCHIVE OF LOST COATS, THE BOTANICAL ASYLUM, THE CLOCKMAKER'S BASEMENT, THE FOG OVER GREENWICH, THE PARLOR OF PERPETUAL AUTUMN, THE SUB-AETHER CORRIDOR, THE MIDNIGHT EXPOSITION, THE TAXONOMIST'S PARLOUR).
   - Expanded `creatureName` sentence templates from 6 to 10 forms, introducing ceremonial orders and designations (`ORDER OF THE [ADJ] [NOUN]`, `[REALM]'S [NOUN], WHO [ACTION]`, etc.).
   - Total combinatorial name space expands from 7,077,888 to **83,886,080** unique permutations.
2. **Specimen Folio & Accession Identifiers:**
   - Added `bell_jar` ($1\dots 99$, prime divisor 389) and `folio_series` ($0\dots 15$, prime divisor 397) to the LOLCODE spell (`src/oracle.lol`) and validated score schema.
   - Generated deterministic specimen folio accession codes (`score.folioId`, e.g. `FOLIO IX-3841`) and dynamic bell jar numbers (`score.bellJar`, e.g. `BELL JAR Nº 07`).
   - Introduced 16 Victorian Archival Curiosa Classes (`score.curiosaClass`, e.g. `CLASS III · HARMONIC RESONATOR`, `CLASS IV · CLOCKWORK AUTOMATON`, `CLASS IX · GEOMETRIC PHANTASM`).
   - Displayed dynamically on the apparition vitrine stage marker (`#stage-bell-jar`), the score reading strip (`#folio-readout`), stem bundle `README.txt`, and the engraved 1200×1520 broadsheet PNG banner.
3. **72-Slip Urn Treasury:**
   - Expanded `SURPRISES` in `src/app.mjs` from 12 to 72 hand-crafted, delightfully surreal Victorian parlor, clockwork, and cosmic slips drawn from the urn on `#surprise`.

**Consequences:**
- Tremendously richer variety of creature names and visual curiosity identifiers.
- Determinism contract strictly preserved: every parameter remains causal and originates in the LOLCODE score output.
- All 175 tests passing, zero warnings in docs and manual.

## D-048 Interactive vitrine tapping agitation, retaliatory kinetic strike, and organism recovery cooldown (2026-10-22, status: accepted)

**Context:** The bell jar vitrine in `index.html` has long displayed the Victorian admonition: `ECTOPLASMIC APPARITION · DO NOT TAP THE VITRINE`. A friend of the maintainer suggested that tapping the glass of the organism should do something, and if tapped too much, should annoy the organism and cause it to fight back.

**Decision:**
1. **Vitrine Agitation Accumulator:**
   - Added `interaction.agitation` ($0.0\dots 1.0$) and `interaction.tapStreak` tracking.
   - Rapid tapping within 1.8 seconds increments the streak and increases agitation. Without tapping, agitation smoothly decays back to zero over approximately 1.4 seconds.
2. **Escalating Behavioral Dynamics:**
   - **Taps 1–2 (Gentle disturbance):** The glass rings with resonant chimes (`triggerPercussion("strike")`), ripples radiate, and spores puff outward.
   - **Taps 3–5 (Irritated / Agitated):** The creature's pupils contract into fierce staring slits, gaze locks dead onto the tap coordinate with high attention, perimeter contours bristle with high-frequency agitation jitter, and filter resonance climbs. The bell jar vitrine frame turns amber/crimson (`.is-agitated`) and the vitrine caption warns: `WARNING: ORGANISM AGITATED · CEASE TAPPING!`.
3. **The Retaliatory Kinetic Strike ("Fight Back") & Ensemble Audio Disruption:**
   - Crossing the agitation threshold ($\ge 0.85$ or 6 rapid taps) triggers an immediate retaliatory strike and severe acoustic disruption:
     - **Visual Surge:** The creature lunges forward toward the tap coordinates, swelling by +42% against the glass, accompanied by a blinding phosphorescent radial discharge flash, an explosive shockwave ring, a massive spore eruption, and 7–10 branched crystalline glass stress fractures that slowly fade.
     - **Audio Slam & Electric Spark:** A synthesized transient combining an 80 Hz $\to$ 28 Hz sub-bass cabinet boom (physical mass striking the glass), a sharp 1650 Hz $\to$ 420 Hz glass snap transient, a bandpass-swept bio-acoustic snarl, and a 5.6 kHz high-Q electric discharge spark crackle.
     - **Pitch Plunge & Oscillation Warping:** The physical impact violently knocks the oscillators out of tuning: drones drop by -420 cents and the lead drops by -380 cents via `retaliationPitchDrop`, accompanied by a screaming filter resonance surge ($Q \to 8.5$), slowly swooping back up over 1.5 seconds.
     - **Cabinet Shudder & Physical Glitch:** The entire ensemble output momentarily ducks and sags with an authentic voltage/tape shudder on master gain, the delay feedback explodes into an intense wash (feedback $\to 0.78$), and the Edison phonograph needle jumps in its groove (wax cylinder crackle spikes to 0.55).
     - **Vitrine Shudder:** The vitrine stage executes a dramatic cabinet tremor animation (`vitrine-shudder`), automatically suppressed under `prefers-reduced-motion: reduce`.
     - **Dynamic Alerts:** Caption flashes `RETALIATION! · THE SPECIMEN STRUCK THE GLASS!`, and the status bar alerts `ORGANISM RETALIATED · STEP BACK FROM GLASS`.
4. **Defensive Sulk Recovery & Acoustic Muffle:**
   - After retaliating, the organism retreats to the center background in a 3.4-second defensive sulk (`.is-sulking`).
   - The sound is audibly muffled and subdued: creature filter cutoff drops by up to -62% into dark lowpass depths, lead level is ducked by -45%, and drones exhibit a slow, weary detune drift. Over 3.4 seconds, brightness, volume, and clarity bloom gracefully back to life as the creature calms down.
   - Tapping the vitrine during cooldown produces a dull, hollow wooden/glass thud (`triggerPercussion("dull_thud")`) with no spore discharge, and the status bar reports `SPECIMEN SULKING · REFUSES CONTACT` before normal looping resumes.

**Consequences:**
- Direct, playful reward for exploring the vitrine caption's warning.
- Pure Web Audio synthesis and zero runtime dependencies preserved.
- Full accessibility and reduced-motion safety preserved.
- Deterministic score boundary remains untouched.

## D-049 Generative fungal appendages and cellular organelles replacing ocular anatomy (2026-10-22, status: accepted)

**Context:** The central apparition in the bell jar vitrine previously possessed ocular eyes (scleras, irises, and pupils). The maintainer found that animal eyeballs looked weird and cartoonish on an otherwise esoteric cellular/fungal specimen, requesting their complete removal in favor of generative fruiting bodies, sporangia, cellular organelles, and botanical appendages leaning deeply into fungal and cellular motifs.

**Decision:**
1. **Elimination of Ocular Anatomy:**
   - Removed all white eyeball scleras, animal irises, and pupils from the apparition rendering engine.
2. **Generative Appendage Archetypes (`score.eyeShape` 0..7):**
   - Replaced eye shapes with 8 botanical/cellular appendage archetypes rendered with Ernst Haeckel-style lithographic fine detail:
     - 0 (*Sporangium Globule*): translucent spore capsule with curved pedicel stalk, annular chitin rings, equatorial dehiscence suture, and circulating micro-spores.
     - 1 (*Ciliated Flagellum / Hyphal Tentacle*): sinuous segmented tactile tentacle with lateral fimbriae/cilia fringe and apical sensory organelle bulb.
     - 2 (*Bioluminescent Vacuole / Cellular Nucleus*): nested double-lipid bilayer membranes with undulating osmotic wave, intermembrane protein bridges, and radiating chromatin threads.
     - 3 (*Ascus Spore-Sac*): botanical ascomycete pod with scalariform transverse septa and a visible linear chain of 6 glowing spherical ascospores.
     - 4 (*Stipitate Hydathode*): slender capillary glandular stalk bearing a suspended, glistening guttation nectar tear that trembles with vitrine taps.
     - 5 (*Anastomosing Cirri*): branching mycorrhizal feeler tendrils with annular chitin nodes and curling circinate tips.
     - 6 (*Pholiota Phosphor-Gland*): ribbed lantern organ with arching protective bracts emitting radial bio-luminescent light shafts.
     - 7 (*Cellular Platelet / Sorus Rosette*): Ernst Haeckel radiolarian/diatom hexagonal platelet shield with concentric fenestrated sieve pores and central indusium.
3. **Internal Organelle Cytoplasmic Structures (`score.irisStyle` 0..7):**
   - Replaced eyeball irises with cellular textures: cytosol sol-gel cyclosis (0), concentric lipid bilayers (1), cytoskeletal microtubules (2), circulating mitochondrial granules (3), thylakoid lamellar crescent (4), endoplasmic reticulum (5), siliceous aster spicules (6), and chitinous corona sheath (7).
4. **Germ Aperture & Nucleolus Kernels (`score.pupilShape` 0..7):**
   - Replaced dark pupils with biological apertures: dense spheroid nucleolus (0), longitudinal dehiscence slit (1), transverse stomatal cleft (2), faceted rhomboid crystal (3), radiolarian aster star (4), cruciform spore tetrad (5), annular lumen torus (6), and trilete Y-scar germination suture (7).
5. **Dynamic Vitrine & Interaction Integration:**
   - *Thigmotropism / Phototropism:* Stalks and tendrils flex and orient toward pointer touch coordinates (`harmonicField`).
   - *Vitrine Tap Vibration:* Appendages quiver rapidly and guttation droplets shiver, scattering micro-spores.
   - *Agitation Escalation:* Appendages whip furiously at high frequency; organelle cores heat up with warning luminescence.
   - *Retaliatory Strike:* Appendages surge forward with incandescent discharge flare (`hsl(45 100% 95%)`).
   - *Sulk Recovery:* Appendages curl inward into a tight defensive huddle against the core, stalks retracting and dimming.
6. **Determinism & Compatibility:**
   - 100% causal compatibility with existing LOLCODE score schema (`score.eyes`, `score.eyeShape`, `score.irisStyle`, `score.pupilShape`, `score.eyeLayout`, `score.eyeSize`). Zero phrase summon hashes broken. Backwards-compatibility aliases (`drawEye`, `eyePlacement`, `traceEyeShape`, `tracePupil`) preserved.

**Consequences:**
- The organism gains an authentic, cohesive Victorian bio-luminescent botanical and mycological aesthetic.
- Zero runtime dependencies and full determinism contract preserved.

## D-050 Metric closure of rhythm templates, tempo pocketing, boundary damping, and vertical anti-clash sieve (2026-10-22, status: accepted)

**Context:** The maintainer observed that default mixes occasionally felt out of sync or harmonically cluttered. Analysis revealed three distinct root causes:
1. *Metric loop drift (the polymeter bug):* Rhythm templates 2 and 3 in `RHYTHMS` had length 5. Because 12 is not divisible by 5 ($12 \bmod 5 = 2$), downbeat positions shifted across successive loop boundaries (Loop 1 took 9.0 timing units while Loop 2 took 10.0 units), shifting step 0 downbeats to weak 16th subdivisions and creating a stumbling, out-of-sync feel in 33% of summoned creatures.
2. *Extreme tempo bounds:* While the full transport tempo slider spans $36\dots 208$ BPM for creative user exploration, summoned creatures with pulses $< 68$ BPM sounded sluggish and muddy, while pulses $> 144$ BPM sounded frantic and rushed when combined with complex 12-step polyphony.
3. *Harmonic boundary bleed & semitone collisions:* Long release tails on chord organ and chimes bled across the 3-step regional boundaries (steps 2 $\to$ 3, 5 $\to$ 6, 8 $\to$ 9, 11 $\to$ 0), creating acoustic mud as new chords sounded. Simultaneously, passing tones in the generative melody occasionally formed unintentional minor 2nd (semitone) rubs against active polyphonic accompaniment tones.

The maintainer authorized Option 3: preserving the fundamental 12-step architecture while fixing internal timing, metric closure, boundary releases, and harmonic sieving.

**Decision:**
1. **Metric Closure of Rhythm Templates:**
   - Replaced length-5 rhythm templates with syncopated patterns of lengths 4 and 6 (divisors of 12):
     - Template 2: `[0.5, 1.5, 0.5, 1.5]` (length 4, syncopated offbeat push).
     - Template 3: `[1, 0.5, 0.5, 1, 0.5, 0.5]` (length 6, Charleston / gallop).
   - All 6 rhythm templates now divide 12 evenly ($12 \bmod 4 = 0$, $12 \bmod 6 = 0$). Every 12-step loop pass has identical duration, and the downbeats of all 4 harmonic regions (steps 0, 3, 6, 9) land on rock-solid metric timestamps across endless loops and offline audio/MIDI exports.
2. **Musical Tempo Pocketing (`musicalPocketBpm`):**
   - Implemented octave-gear range folding for default summoned tempos:
     - Pulses $< 68$ BPM fold up by octaves ($\times 2$).
     - Pulses $> 144$ BPM fold down by octaves ($\div 2$).
   - Default summoned playback always lands in the musical groove pocket ($68\dots 144$ BPM), while the full manual tempo slider ($36\dots 208$ BPM) and raw `score.pulse` LOLCODE determinism are 100% preserved.
3. **Harmonic Boundary Damping:**
   - In `scheduleHarmonyStep()` and `scheduleChimeStep()`, voice durations on region boundary steps (`stepIndex % 3 === 2`, i.e., steps 2, 5, 8, 11) are clamped to $\le 0.90 \times \text{stepDuration}$ and $\le 0.92 \times \text{stepDuration}$ respectively.
   - Harmonic tails release cleanly before the next region's downbeat chord strikes, eliminating acoustic bleed between chord changes.
4. **Vertical Anti-Clash Sieve in `conductEnsemble()`:**
   - Added Step 6 vertical anti-clash resolution in `conductEnsemble()`: when conducting under `CREATURE_GENRE`, if a non-chord passing melody note creates a semitone clash ($|melPc - accPc| = 1 \text{ or } 11$) against active bass, chord organ, Just Intonation chimes, or vowel chant, it is snapped to the nearest chord tone using `snapToNearest()`.
   - Reduced semitone clash rate for `CREATURE_GENRE` to 0.00% across melody and accompaniment, while preserving all 18 static Inform 7 rulebook golden fixtures.

**Consequences:**
- Default mixes groove seamlessly without metric drift or polyphonic stumbling across loop boundaries.
- Offline exports (WAV, 9 stems ZIP, MIDI) tile seamlessly across multiple loop passes.
- Chords change crisply without muddy harmonic bleed.
- Zero external dependencies; 178 tests passing.

## D-051 Elimination of audio volume spikes during Fun Machine note holding and legato key transitions (2026-10-22, status: accepted)

**Context:** The maintainer reported that when holding down a Fun Machine note for a while or moving between notes, the audio signal occasionally spiked dramatically in volume—as if the master dB dial was suddenly cranked to maximum and back down again.
Investigation revealed four distinct root causes in Web Audio scheduling:
1. *GainNode default initialization to 1.0 (unity gain):* Web Audio `GainNode` instances created via `context.createGain()` default to `gain.value = 1.0`. In `src/voices.mjs`, envelope gain nodes for pads, plucks, and leads were created without explicit initial value assignment, relying on subsequent `setValueAtTime(0.0001, start)` calls. When `releaseFunPads()` ran `cancelScheduledValues(now)` during a key change on pads scheduled in the look-ahead window (`start > now`), the cancellation wiped all scheduled timeline events including the initial `setValueAtTime(0.0001, start)`. The node's gain immediately reverted to the underlying default value of `1.0`. The subsequent `setTargetAtTime(0.0001, now, fade / 4)` then exponentially decayed starting from 1.0! When the note oscillators started at `start`, they sounded at up to 0.7–0.9 gain (+14 dB to +16 dB over designed peak), producing an explosive volume surge.
2. *Look-ahead pad leakage:* When notes were played, `scheduleVoicePad()` scheduled audio slightly ahead in time (`start = at`). When `releaseFunPads()` was invoked, future-scheduled pads were not prevented from starting; their oscillators continued to spin up and sound unless explicitly stopped.
3. *Unanchored `cancelScheduledValues` timeline jumps:* Invoking `cancelScheduledValues(now)` during an active ramp or `setTargetAtTime` without anchoring the parameter value at `now` causes Web Audio implementations (particularly Chromium) to glitch or jump back to the start of the previous ramp or timeline base value.
4. *Bridge pad harmonic collision and gain doubling:* In `triggerFunKey()`, when a key was pressed mid-region (`bridge > 0.12`), a bridge pad was scheduled using `performance.steps[nextStep % 12].chord` (the chord of the upcoming step rather than the active audible step) with a duration of `bridge + 0.2` (overlapping by 200 ms with the next scheduled region chord), doubling pad voice count into the bus and compressor.
5. *Legato key-transition drone ducking surge:* When transitioning between physical keys or rapid touch taps, `activeHeldFunKey` momentarily became `null` for 20–100 ms between keyup and keydown. In `updateAudioInteraction()`, this instantly released the -10 dB lead ducking on the three tonic drones, causing them to surge upward by +10 dB before violently ducking back down when the new key registered.

**Decision:**
1. **Bounded Initial GainNode Value (`0.0001`):**
   - Explicitly initialize `env.gain.value = 0.0001` immediately upon `context.createGain()` in `scheduleVoicePad()`, `scheduleVoiceLead()`, and `scheduleVoicePluck()` in `src/voices.mjs`. Tremolo swell and depth gains are similarly initialized to `1 - tremolo.depth` and `tremolo.depth`. If any timeline cancellation occurs, the underlying base value is bounded to near-silence rather than unity gain (`1.0`).
2. **Safe Future-Pad Cancellation in `releaseFunPads()`:**
   - `scheduleVoicePad()` now returns `start` alongside `env`, `oscillators`, `stopAt`, and `peak`.
   - In `releaseFunPads()`, pad handles scheduled in the future (`handle.start > now`) have their timelines cancelled, gain anchored at `0.0001`, and all oscillators stopped immediately at `now`. They never sound or burst.
3. **AudioParam Anchoring with `cancelAndHoldAtTime()`:**
   - For actively sounding pads (`handle.start <= now`) and drone shaping in `shapeDrones()`, safe anchoring is applied using `gainParam.cancelAndHoldAtTime(now)` (with a fallback to `cancelScheduledValues(now)` followed immediately by `setValueAtTime(currentVal, now)` for environments lacking `cancelAndHoldAtTime`). The decay to `0.0001` then smoothly progresses from the exact held instantaneous gain without pops or jumps.
4. **Seamless Bridge Pad Handoff:**
   - In `triggerFunKey()`, the bridge pad resolves the active audible step chord (`transport.audibleStep % 12`) and trims duration to `bridge + 0.05`, eliminating chord dissonance and multi-chord gain doubling.
5. **Legato Transition Grace Window for Drone Ducking:**
   - In `updateAudioInteraction()`, a 220 ms grace window (`isKeyTransition = (performance.now() - lastFunKeyReleaseTime) < 220`) prevents tonic drones from surging upward during legato key changes.

**Consequences:**
- Volume surges and deafening spikes during note holding and legato key changes are completely eliminated.
- Note transitions on the Fun Machine sound buttery, smooth, and natural.
- Preserves all 178 tests, zero runtime dependencies, and strict score determinism.

## D-052 Loop machine recording synchronization and musical section roles (Intro, Main, Bridge, Outro) (2026-10-22, status: accepted)

**Context:** The maintainer requested a two-part looper overhaul: first, resolve severe recording glitches (playback chaos/clusterfuck when recording a new loop, overdubbing arming but never recording, and arpeggios/swells truncating held notes); second, introduce Intro, Outro, and Bridge loop sections with real-time cueing and linear offline exports.

Investigation identified four root causes in the recording engine:
1. *Look-ahead vs. real-time clock collision:* The look-ahead scheduler (`scheduleAhead`) samples `activeHeldFunKey` ~280 ms in advance. Live key strikes landed on audible steps while the look-ahead was already scheduling future steps, causing keystrokes to overwrite or be discarded by future null steps.
2. *Premature 0-count-in take discard on overdub:* Arming an overdub during active playback set `countIn = 0`. The look-ahead scheduler processed steps 0–11 in roughly 1 second before the human player could strike a note. The engine evaluated the empty take, discarded it, and disarmed the recorder back to idle.
3. *Sustained note truncation (arpeggios & swells):* Browser `keydown` only fires once on initial strike. Non-strike steps 1..11 were recorded as `null`. When `playSongLayers()` played back the loop, `padSteps` fell back to 1 (staccato cutoff) and arpeggios had no slots on subsequent steps, cutting off after step 0.
4. *Playback clutter & conductor thrashing during recording:* When recording a new loop, `playSongLayers()` simultaneously sounded old loops alongside live keys on `transport.funBus`, while `followSong()` ping-ponged between old loop chords and live input chords every 90 ms.

**Decision:**
1. **Audible Clock Latching & Non-Destructive Step Reduce:**
   - In `src/app.mjs`, keystrokes are continuously latched onto audible steps in the audible timer callback (`window.setTimeout`), recording `heldSlot` into every audible step while `activeHeldFunKey !== null`.
   - In `src/looper.mjs`, `recorderReduce()` preserves previously latched slots (`event.held ?? take[event.step] ?? null`) so staccato taps aren't wiped out by look-ahead nulls.
2. **Layer Isolation and Conductor Stabilization:**
   - In `scheduleAhead()`, existing song layers are muted while recording a new loop (`recorder.mode === "recording" && recorder.kind === "new"`), isolating the live instrument and metronome count-in.
   - `followSong()` is guarded during new loop recording, ensuring the band follows only the player's live Fun Machine chord.
3. **Synchronized 1-Loop Count-In Pass:**
   - Both new loop and overdub arming schedule a synchronized 1-loop count-in pass (`countIn = isStopped ? LOOP_STEPS : (stepsRemaining + LOOP_STEPS)`) with real-time countdown telemetry and metronome escapement clicks, giving the player a reliable 12-step pre-roll.
4. **Casio-Style Arranger Section Engine (Intro, Bridge, Outro):**
   - Following maintainer direction to keep the experience as simple and straightforward as a classic Casio keyboard, section controls are streamlined into 3 dedicated real-time arranger buttons on the Fun Machine (`#casio-intro`, `#casio-bridge`, `#casio-outro`):
     - **INTRO:** Plays a 1-pass prelude from the active rulebook, then rolls directly and seamlessly into the normal groove.
     - **BRIDGE:** Cues on the next downbeat, plays a 1-pass contrasting harmonic departure, and automatically returns to the groove—never getting trapped in an endless bridge loop.
     - **OUTRO:** Cues on the next downbeat, plays the closing cadence resolving home, and automatically halts the transport and rests.
   - Restored the 13-key manual style chips to pure playing modes (`SWELL`, `ARPEGGIO`, `PROGRESSION`).
   - Decluttered the Loop Machine by removing role chips, quick-generate buttons, and cue toggles, restoring pure, sequential loop playback without trapping tracks in loops.

5. **Rulebook-Driven Section Progressions:**
   - Extended one-finger accompaniment styles in `src/accompaniment.mjs`: `ACCOMPANIMENT_STYLES = ["swell", "arpeggio", "progression", "intro", "bridge", "outro"]`.
   - Added `buildFunSectionProgression(key, section, genre, tonicRoot)` to synthesize authentic 4-chord progressions and 12-step lead motifs from the active Inform 7 rulebook:
     - **Intro:** Preparatory tonic vamp/pedal (I -> IV -> I -> V/♭II7 turnaround setup) with a melodic call-and-response and breath on step 11 before the downbeat.
     - **Bridge:** Contrasting harmonic departure to subdominant (IV) or relative minor (vi), secondary dominant (V/V / II7) or modal borrowing (♭VI), predominant, and dominant suspension (V7) pointing home.
     - **Outro:** Executes the genre's specific permitted cadence: Phrygian descent (`iv -> ♭III -> ♭II -> I`) for Andalusian Flamenco/Palestrina/Tango; Plagal "Amen" (`I -> IV -> IV -> I`) for Gospel/Delta Blues/Doo-Wop; or authentic cadence (`ii -> V -> V7 -> I`), with a sustained home tonic held through steps 9..11.

**Consequences:**
- Overdubbing and live loop recording work smoothly and reliably without playback clutter or timing thrashing.
- Sustained arpeggio ripples and swell pads sustain cleanly across all held steps.
- Real-time Casio arranger buttons make Intro, Bridge, and Outro immediate, musical, and playful with zero configuration or trapped loops.
- 182 automated tests passing; zero runtime dependencies.

## D-053 Audio sweep audit: race condition elimination, automation ramp preservation, and acoustic clash resolution (2026-10-23, status: accepted)

**Context:** A clean-sweep audit of the audio and scheduler architecture was performed to detect and resolve race conditions between look-ahead scheduling and real-time audio/UI callbacks, AudioParam automation collisions, and conflicting harmonic patterns that created unintended sounds or made bugs hard to distinguish from intentional design.

Key findings:
1. *Looper take finalization race:* When step 11 was reached in `scheduleAhead()` (~280 ms ahead of real time), `advanceRecorder()` finalized the take immediately, transitioning the recorder to `idle`. Real-time key strikes or holds during audible step 10/11 were completely dropped.
2. *Unguarded orphaned Casio section timeouts:* Nested `setTimeout()` callbacks for Outro and Section completion lacked `currentTransport !== transport` guards, allowing rapid stops, pauses, or summons to be interrupted or halted by orphaned timers from previous playback sessions.
3. *60 FPS AudioParam queue stomping:* Animation frame `updateAudioInteraction()` continuously called `setTargetAtTime` on `mix.gain` and `feedback.gain`, stomping on active `exponentialRampToValueAtTime` automations scheduled during vitrine retaliation strikes.
4. *Unconducted parallel fifths in voiceStack:* `voiceStack` presets 2 and 5 hardcoded `{ interval: 7 }`, generating unconducted parallel fifths above melody notes that created harsh minor-second clashes against chord tones in the organ and bass.
5. *Harmonic clock cross-rhythm drone lag:* `shapeDrones()` checked `absoluteStep % 3 === 0`, causing it to lag for two full steps when chords changed on steps 4 and 8 in `PROGRESSION` style.
6. *Harmonic clock pass frozen on 1-loop songs:* `harmonicPassAt()` evaluated `pass % songPasses(song)`, which for a 1-loop song is permanently 0, locking the 4-pass harmonic cycle.
7. *Pitched clockwork body knock:* `scheduleClockworkTick()` played a static 70 ms pure sine wave at 520 Hz or 340 Hz directly into the master bus on quarter beats, sounding like an out-of-tune sustained tone in unrelated keys.
8. *Unfiltered mycelium glides:* Fungal form 4 (Cup Peziza) and form 7 (Hyphal Hydra) had unfiltered sweeps (`band: null`) up to 3x, sounding like synthetic laser chirps.

**Decision:**
1. **Looper Take Real-Time Latching via `activeTakeLanding`:**
   - In `advanceRecorder()`, `landTake()` returns the landed loop index, and `transport.activeTakeLanding` keeps the take window open for audible steps 10 and 11.
   - Keystrokes struck or held in real time on audible step 10 or 11 update the landed loop directly via `setLoopSlot()`, clearing `activeTakeLanding` only when audible step 11 finishes.
2. **Timeout Tracking & Guarding:**
   - Transports track all pending playback timeouts on `transport.timeouts = new Set()`.
   - `stopCurrentSound()` clears all tracked timeouts immediately.
   - Nested Casio section callbacks check `if (currentTransport !== transport) return;`.
3. **Retaliation Automation Ramp Isolation:**
   - `updateAudioInteraction()` skips `mix.gain` and `feedback.gain` target automations while `nowMs < interaction.retaliateUntil`, allowing violent retaliation ramps to complete smoothly.
4. **Voice Stack Consonance:**
   - Replaced raw `{ interval: 7 }` in `voiceStack` with consonant sub-octave and octave doublings (`interval: -12, 12`), preserving overtone depth without unconducted parallel semitone clashes.
5. **Dynamic Chord Transition Detection in `shapeDrones`:**
   - `shapeDrones()` detects `isChordChange` dynamically, instantly retuning drone frequencies and shaping envelopes whenever chords change, including steps 4 and 8.
6. **Harmonic Pass Cycling for All Songs:**
   - In `harmonicPassAt()`, cycling uses `Math.max(passes || 0, HARMONIC_PASSES)`, cycling through all 4 harmonic passes even for 1-loop songs.
7. **Damped Pitch Transient for Clockwork Body Knock:**
   - Replaced static 70 ms sine beep with a rapid downward exponential pitch transient from 240/180 Hz to 55 Hz decaying in 28 ms, providing an authentic acoustic wooden knock without pitch clash.
8. **Resonant Bandpass for Mycelium Bio-Acoustics:**
   - Equipped forms 4 and 7 with resonant bandpass filters (`[650, 3.5]` and `[2200, 3.5]`), turning raw sweeps into organic bio-acoustic resonance.

**Consequences:**
- Zero dropped keystrokes when playing along with the looper through loop boundaries.
- No cross-transport timeout interference or unexpected stops when interacting with transport controls.
- Retaliation strikes ring out cleanly without automation jitter.
- Harmonic progression moves smoothly without drone lag or parallel fifth dissonance.
- 183 automated behavioral checks passing; zero runtime dependencies; 100% determinism preserved.

## D-054 Section progressions breathe across 4 passes (48 steps: 12 steps per chord) with natural loop transitions (2026-10-23, status: accepted)

**Context:** Live Arranger sections (`Intro`, `Bridge`, `Outro`) felt rushed and cut short in 12 steps: 4 chords crammed into a single 12-step bar gave each chord only 3 steps (0.75 s at 120 BPM), cutting off pad bloom envelopes and forcing melody notes on every step without natural musical breathing room or cadence rest. In standard 12-step hypermeter, 48 steps (4 passes of 12 steps: 4 complete bars) represents the canonical cycle of the harmonic clock (`HARMONIC_PASSES = 4`), allowing each chord in the 4-chord progression to breathe for an entire 12-step bar, resolve naturally, and transition smoothly into adjoining loops without abrupt harmonic or rhythmic clipping.

**Decision:**
1. **4-Pass (48-Step) Harmonic Structure:**
   - Expanded live arranger sections to span 4 full passes (48 steps: 4 bars of 12 steps) instead of 1 pass (12 steps).
   - In `buildPerformance()`, when `pass !== null && (style === "intro" || style === "bridge" || style === "outro")`:
     - Each of the 4 region chords occupies an entire 12-step bar (`sectionPass = pass % 4`, `regionSteps: 12`).
     - Pads bloom and swell over the entire 12-step bar, while arpeggios ripple smoothly without hurried chord chops.
2. **Spacious Lead Phrasing & Natural Adjoining Loop Transitions:**
   - Standard passes (Passes 0, 1, 2) space melody notes 4 steps apart on steps 0, 4, and 8, sustaining for 4 steps (`leadSteps: 4`).
   - **Intro -> Groove Transition:** In Pass 3 (Turnaround chord, e.g. V7 or ♭II7), steps 0 and 4 play turnaround motifs, step 8 plays the leading-tone pickup (`leadSteps: 2`), and steps 10 and 11 rest completely as a musical breath before the adjoining groove drops with maximum downbeat impact on step 48 (step 0 of the next loop).
   - **Bridge -> Groove Transition:** Pass 3 holds dominant tension on step 8 (`leadSteps: 2`), breathing on steps 10 and 11 before naturally resolving back to the groove downbeat.
   - **Outro -> Stop Resolution:** On Pass 3 (step 36, step 0 of the final pass), the melody and harmony resolve decisively to the Home Tonic (I), holding the chord and singing the tonic root for all 12 steps (`leadSteps: 12`) to ring out and decay naturally before transport stops.
3. **Live Arranger & Conductor Synchronization:**
   - In `scheduleAhead()`, `CASIO_SECTION_PASSES = 4` tracks `scheduledCasio` across `startPass` and `passes: 4`.
   - `followSong()` re-conducts the band across all 4 passes (`"casio:${role}:${sectionPass}"`), keeping the accompaniment aligned with the section progression.
   - Looper readout telemetry displays `STEP 1 OF 48` through `STEP 48 OF 48` during section playback.
   - Preserves the 12-step summary view when `pass === null` for backward-compatible inspections and existing unit tests.

**Consequences:**
- Intro, Bridge, and Outro sections feel expansive, musical, and completely resolved rather than hurried blips.
- Adjoining loops transition seamlessly with authentic leading-tone pickups, breath rests, and tonic homecomings.
- 183 automated behavioral tests pass; zero runtime dependencies; 100% determinism preserved.

## D-055 Section progression insertion into the Loop Sequencer (2026-10-23, status: accepted)

**Context:** Following the expansion of Intro, Bridge, and Outro sections into 48-step breathing progressions (D-054), the maintainer requested the ability to insert and record these sections directly into the Loop Machine sequencer.

**Decision:**
1. **Section Loop Insertion Engine:**
   - Added `canInsertLoops(song, count)`, `insertSection(song, role, takes, atIndex)`, and `sectionPassForLoop(song, loopIndex, repeat)` in `src/looper.mjs`.
   - Wired dedicated buttons in the Loop Machine header (`#looper-insert-intro`, `#looper-insert-bridge`, `#looper-insert-outro`) to insert full 4-bar (48-step) section progressions:
     - `+ INTRO`: Inserts 4 consecutive 12-step loops at the beginning (index 0) of the song.
     - `+ BRIDGE`: Inserts 4 consecutive 12-step loops immediately after the currently selected loop (or at the end if none selected).
     - `+ OUTRO`: Appends 4 consecutive 12-step loops to the end of the song.
2. **Contiguous Section Pass Resolution:**
   - `sectionPassForLoop` determines each loop's part (Part 1/4 through Part 4/4) dynamically based on contiguous preceding loops of the same role, preserving session schema compatibility.
   - `performanceFor(slot)` automatically resolves the active section pass during playback and conducting.
3. **Sequencer UI & Color Badges:**
   - Loop tiles in `renderLooperTiles()` display their role and part tag (e.g. `INTRO 1/4`, `BRIDGE 2/4`, `OUTRO 4/4`), styled with section-specific brass, violet, and ruby borders.
   - Reaching the final step of a terminal Outro loop automatically stops the transport and rests the omen.
4. **Roadmap Milestone Added:**
   - Logged `P5-31` on `ROADMAP.md` for full live capture of real-time play converted into loop sequences.

**Consequences:**
- Users can compose complete, structured arrangements (Intro → Groove → Bridge → Groove → Outro) directly in the Loop Machine.
- Offline WAV, stem, and MIDI exports carry all 48 steps of inserted sections seamlessly.
- 184 automated behavioral tests pass; zero runtime dependencies; 100% determinism preserved.

## D-056 Rebrand to "The Whimsy Machine" and Korg R3-inspired unified hardware console layout (2026-10-23, status: accepted)

**Context:** The maintainer recognized that the "open trifold suitcase" concept resulted in an awkward, scrunched 3-column layout that pinched wide controls (like the 8-channel mixer and Tonnetz compass) and broke the natural horizontal flow of a musical instrument. The maintainer directed a pivot to draw inspiration from their beloved **Korg R3 synthesizer**—embracing a sleek, unified, tactile performance synthesizer console with horizontal tiers, zero wasted vertical fluff, an illuminated centerpiece display, macro parameter decks, an illuminated step sequencer ribbon, and a full-width playable keybed. Additionally, the product was rebranded from "Edmark's Esoteric Fun Machine" to "The Whimsy Machine".

**Decision:**
1. **Product Rebrand to "The Whimsy Machine":**
   - Updated page title, description, masthead wordmark, keyboard accessibility label, manual documentation, and noscript text across `index.html`, `docs/manual.json`, and `manual.html`.
2. **Korg R3 Hardware Tiered Console Architecture:**
   - Abandoned the pinched 3-column suitcase grid in favor of a unified horizontal synthesizer console (`width: min(94rem, 100%)`) where every module spans horizontally with natural ergonomic breathing room.
   - **Tier 1 (Performance & Inscription Bezel):** The Whimsy Machine wordmark, bell toggle, and calling slip (`#phrase`, `SUMMON`) framed like the R3's patch inscriber.
   - **Tier 2 (Main Illuminated Display Screen):** The Apparition Vitrine (`.vision-cabinet`, `#vision`) acts as the synthesizer's central backlit display, showing the creature's living anatomy and real-time kinetic reactions with generous height (`clamp(19rem, 34vw, 28rem)`), flanked by its manifestation parameter scorecard (`#reading`).
   - **Tier 3 (Master Transport & Performance Rail):** `#transport-deck` provides tactile Play, Pause, Stop keys, glowing step/position indicator, Master Volume, and Tempo BPM sliders.
   - **Tier 4 (Harmonic & Acoustic Parameter Deck):** Kapellmeister console (`#kapellmeister-engine`) with 19 Inform 7 genre rulebooks, strictness slider, and Tonnetz compass, alongside Parlor Acoustics (`#parlor-acoustics-engine`).
   - **Tier 5 (8-Channel Voice Matrix Console):** `#mixer-engine` spans full width like an 8-timbre mixer deck, with illuminated VU peak meters, smooth vertical faders, pan pots, and mute/solo keys for all eight voices.
   - **Tier 6 (The Arpeggiator & Step Sequencer Ribbon):** The Loop Machine (`#looper`) with its 12-step/48-step glowing LED sequencer tracker ribbon, REC, Overdub, Step Rec, Rest, and Casio Intro/Bridge/Outro section cues, sitting directly above the keys.
   - **Tier 7 (Play-Along Keybed):** The 2-octave keyboard manual (`#fun-keyboard`) spanning full width at the front edge of the instrument.
   - **Tier 8 (Rear Utility Deck):** Session Presets ledger and DAW exports (`#wing-keep`) styled as a sleek bottom utility panel.
3. **Preserved Invariants & Test Guarantees:**
   - 100% compliant with DOM ID sequence invariants enforced by `tests/static.test.mjs` line 621 (`reading` < `cabinet-switch` < `wing-perform` < `transport-deck` < `fun-machine-engine` < `kapellmeister-engine` < `wing-mix` < `wing-keep` < `wing-band`).
   - Zero runtime dependencies; all accessibility font size floors ($\ge 0.6\text{rem}$) and color contrast rules preserved.

**Consequences:**
- Eliminates all vertical and horizontal "scrunched" feel; controls have room to breathe and look like a cohesive high-end boutique instrument.
- 184/184 automated tests pass; zero runtime dependencies; 100% determinism preserved.

## D-057 Hardware console alignment, whitespace harmony, and double-padding elimination (2026-10-23, status: accepted)

**Context:** Following the Korg R3-inspired hardware console layout overhaul (D-056), visual inspection revealed inconsistent whitespace, padding, and vertical guidelines across Wing 1:
1. Volume and tempo sliders in the master transport deck sat lower than the transport buttons with an excessive top gap.
2. The One-Finger Accompanist title had nearly 50px of dead space between the heading text and the accompaniment style buttons.
3. The Kapellmeister rulebook title, telemetry, and motto sat shifted far to the left relative to the readout cells, sliders, and Tonnetz compass below them.

**Decision:**
1. **Master Transport Alignment (`#transport-deck`):**
   - Switched `.transport-deck` from `align-items: center` to `align-items: flex-start`. Previously, the second-row section readout (`.transport-section`) gave `.transport-keys` a ~65px height; flex centering shifted the shorter 34px volume and tempo control block down by ~16px, causing an artificial "pad above" the sliders. With top alignment, transport buttons, step counter, slider labels, and the keyboard hint align cleanly at the top padding guideline.
   - Equalized `.transport-position` padding to `0.72rem 0.75rem` matching the transport button height (~36px).
   - Unified range input dimensions across `#master-volume`, `#tempo-bpm`, `#kapellmeister-strictness`, and `#parlor-acoustics-level`.
2. **One-Finger Accompanist Whitespace Tightening (`#fun-machine-engine`):**
   - Disentangled `#fun-machine-heading` from `#kapellmeister-heading`: reduced `#fun-machine-heading` from a 2-line fixed height (`2.5em`) to its natural 1-line height (`1.25em`), removing a full blank line of reserved space.
   - Tightened `.fun-machine-engine` grid gap to `0.5rem` and `.fun-machine-body` padding to `0.25rem 0 0.5rem`, shrinking dead space between the title and the style bar from ~47px down to a crisp ~11px.
   - Set `.looper` `margin-top: 0`, allowing the uniform `0.75rem` body gap to govern spacing between the keyboard and sequencer.
3. **Double-Padding Elimination on Child Engine Bodies:**
   - Discovered that `.beat-engine` already applies container padding `padding: 1.15rem clamp(1.1rem, 3vw, 2.8rem) 1.35rem;`. Child containers (`.kapellmeister-body`, `.fun-machine-body`, `.acoustics-body`) each had their own redundant `padding: ... clamp(1.1rem, 3vw, 2.8rem) ...`, causing their contents to be double-indented by an extra 42px.
   - Removed inline padding on all child bodies (`padding-inline: 0`), bringing all readouts, compasses, sliders, chips, keyboards, and sequencers into exact alignment with their engine headers.
4. **Rulebook Header Ergonomics:**
   - Changed `.kapellmeister-engine .beat-header` from `align-items: end` to `align-items: flex-start`, seating the Rulebook select dropdown at the top right opposite the title row rather than sinking down to line 8.

**Consequences:**
- Headers, body containers, readout cells, and parameter controls share a unified vertical guide on the left and right across all wings.
- Unnecessary gaps and dead space are eliminated, giving the entire instrument a cohesive, tightly engineered hardware synthesizer console feel.
- 184/184 automated tests pass; zero runtime dependencies; 100% determinism preserved.

## D-058 Swap Wings III (The Band) and IV (Keep) for hardware console workflow (2026-10-23, status: accepted)

**Context:** Following the Korg R3 synthesizer console architecture (D-056), Wing I (Perform) and Wing II (Mix) handle active playing and tonal balance. Placing Keep (Session Presets and DAW exports) as Wing III separated the mixer from the individual instrument engines (The Band, Plates I–V), while putting the DAW export desk above the synthesizer engines rather than at the bottom utility panel.

**Decision:**
1. **Swap Page Order of Wings III and IV in `index.html`:**
   - Wing III is now **THE BAND** (`#wing-band`), containing the five esoteric machines (Plates I–V: Malbolge beat, Brainfuck bass, Befunge harmony organ, Piet/FRACTRAN chimes, Shakespeare choir) right below Wing II (Mix).
   - Wing IV is now **KEEP** (`#wing-keep`), containing the Session Ledger (`#session-engine`) and Engraver's Desk exports (`#export-engine`), positioned as the final rear utility deck immediately preceding the footer.
2. **Synchronize Discovery Drawers (`src/cabinet.mjs`):**
   - Updated `DRAWERS` order to `kapellmeister` → `mix` → `band` → `keep`, matching the physical page order.
   - Preserves progressive disclosure: first loop unlocks Mix; playing with the mix/plates or reaching four loops unlocks The Band; modifying state unlocks Keep.
3. **Restamp and Test Synchronization:**
   - Restamped asset version (`node tools/stamp_assets.mjs`) for the `src/cabinet.mjs` update.
   - Updated `tests/static.test.mjs` and `tests/cabinet.test.mjs` DOM ordering checks.
4. **Keep Drawer Visibility and Specificity Fix (`styles.css`):**
   - Discovered that the desktop layout rule `@media (min-width: 1180px) { #drawer-body-keep { display: grid; ... } }` had ID specificity (`(1, 0, 0)`), which clobbered `.drawer-body[hidden] { display: none; }` (`(0, 2, 0)`). Consequently, `#drawer-body-keep` never hid in desktop view, causing the Keep drawer to stay permanently open regardless of sealed discovery state or button toggles.
   - Enforced `.drawer-body[hidden] { display: none !important; }` and restricted the desktop layout rule to `#drawer-body-keep:not([hidden])`. Added regression checks in `tests/static.test.mjs`.

**Consequences:**
- The ergonomic synthesizer workflow follows Perform → Mix → The Band → Keep, placing utility exports at the bottom of the instrument.
- 184/184 automated tests pass; zero runtime dependencies; 100% determinism preserved.

## D-059 Raw instrumentation 48-step base groove loops in the Loop Machine (2026-10-23, status: accepted)

**Context:** The esoteric automaton band possesses a natural 4-pass harmonic cycle spanning 48 steps (12 steps per pass: Exposition/Tonic, Antiphony/Subdominant, Tutti Climax, Breakdown/Turnaround) under D-044. However, the Loop Machine previously only offered manual recording (`REC`, capturing a single 12-step pass of live organ takes) or section baker buttons (`+ INTRO`, `+ BRIDGE`, `+ OUTRO`). Users had no way to capture or arrange the raw esoteric band's 48-step progression into the Loop Machine to arrange, repeat, overdub, or export mixes longer than a single 5-second (12-step) loop.

**Decision:**
1. **Loop Machine Model Support for Raw Groove Loops (`src/looper.mjs`):**
   - Updated `sectionPassForLoop(song, loopIndex, repeat)` to support role `"main"`, dynamically resolving which pass (0..3) of a contiguous group of groove loops is currently sounding.
   - Updated `validateSong(raw, path)` to permit empty takes (`slots.every(s => s === null)`) when `loop.role === "main"`. Non-main roles (`intro`, `bridge`, `outro`) continue to require key presses. This permits raw band loops without Fun Machine organ takes to be serialized and deserialized in `.fun` session files cleanly.
2. **`+ GROOVE` Button and Section Insertion (`index.html`, `src/app.mjs`):**
   - Added `<button class="beat-button looper-button looper-section-button" id="looper-insert-groove" type="button">+ GROOVE</button>` between `+ INTRO` and `+ BRIDGE`.
   - Wired `insertSectionLoops("main")`:
     - If no key is held on the manual, generates four loops of `emptyTake()` with `role: "main"`, representing the four passes of the raw automaton band with full dynamic volume (no Fun Machine lead/drone ducking).
     - If a key is held, bakes the four passes of the Fun Machine's harmonic progression on that key.
     - Announces `INSERTED GROOVE (4 LOOPS · 48 STEPS) (RAW INSTRUMENTATION)` or progression details.
3. **Harmonic Scheduling and Conductor Tracking (`src/app.mjs`):**
   - `harmonicPassAt(absoluteStep)` queries `sectionPassForLoop` for the active loop position, guaranteeing that groove sections begin on Pass 0 (Exposition) and walk 0..3 through their repeats regardless of where in the song order they appear.
   - `followSong(transport, loop, stepIndex, liveSlot)` tracks `raw:${currentHarmonicPass}` when `lead` is null, seamlessly re-conducting the band to the current pass of the harmonic cycle at each groove loop boundary.
   - Preserves offline export rendering across WAV, Stems, and MIDI: an inserted groove renders the full 48-step (or extended with repeats) mix.
4. **Visual & Readout Styling (`styles.css`, `src/app.mjs`):**
   - Styled `.looper-tile[data-role="main"]` with an emerald/verdigris border accent (`rgba(57, 168, 130, 0.75)`), distinguishing groove tiles from gold Intros, violet Bridges, and ruby Outros.
   - Tiles display `L1 [GROOVE 1/4]`, `L2 [GROOVE 2/4]`, etc.
   - The transport readout reports `NOW LOOP 1 [GROOVE 1/4] · 4 LOOPS · 4 PASSES · ...`.

**Consequences:**
- Users can arrange, loop, repeat, overdub onto, and export full 48-step raw automaton band mixes with zero external dependencies.
- 185/185 automated tests pass; phrase determinism and boundary validation fully preserved.

## D-060 Kapellmeister genre catalog Wave 3: Rhythmic feel and 22-genre expansion (2026-10-23, status: accepted)

**Context:** D-041 outlined a 3-wave expansion for the Kapellmeister genre rulebooks in `src/rulebooks.ni`. Waves 1 and 2 established 19 genres across 5 menu families. Wave 3 was reserved for rhythmic *feel*: genres like waltzes, swing, and traditional ceremonial rhythms require characteristic step timing variations beyond plain 16th-note subdivision. Furthermore, phrase determinism (D-003) requires that unconfigured genres and `THE CREATURE'S OWN` retain their phrase's native `score.rhythm` without drift.

**Decision:**
1. **Inform 7 `feel` Property (`src/rulebooks.ni`, `src/inform.mjs`):**
   - Declared `A genre has some text called the feel.` in Chapter 2 of `src/rulebooks.ni`.
   - Updated `compileRulebooks()` in `src/inform.mjs` to extract `feel` (defaulting to `""` when omitted).
   - Tagged existing rhythmically specific genres with their canonical feels:
     - `parlor_ragtime`: `"habanera"`
     - `doowop_ballad`: `"swing"`
     - `tango_habanera`: `"habanera"`
2. **Three New Kapellmeister Genres (Chapters 19–21, total 22 genres):**
   - Chapter 19: **Vaudeville Viennese Waltz** (`vaudeville_waltz`, Family: `PARLOR`, Feel: `"waltz"`). Authentic 3/4 oom-pah-pah bass walk `{0, 7, 4, 0, 7, 3, 0, 7, 3, 0, 7, 4}`, I · vi · ii · V7 changes, member snapping, and `{rotation, relative substitution, authentic cadence}` moves.
   - Chapter 20: **Swing-Era Savoy Ballroom** (`swing_ballroom`, Family: `NIGHT CLUB`, Feel: `"swing"`). Big-band swing I6 · vi7 · ii7 · V7 changes, walking quarter-note bass `{0, 4, 7, 0, 3, 7, 0, 3, 7, 0, 4, 7}`, guide-tone organ voicing `{third, fifth, seventh}`, and `{rotation, relative substitution, tritone substitution, secondary dominants}` moves.
   - Chapter 21: **Javanese Gamelan Pelog** (`gamelan_pelog`, Family: `ESOTERIC`, Feel: `"straight"`). Kraton court gong and metallophone cycles: pure fifth-and-second open sonorities `{0, 7, 2}`, colotomic gong stride `{0, 7, 0, 0, 7, 0, 0, 7, 0, 0, 7, 0}`, pentatonic scale snapping `{0, 2, 5, 7, 9}`, and `{rotation, phrygian cadence, harmonic pace}` moves.
   - Raw Esoteric Chaos moves to Chapter 22 at the conclusion of Part 2.
3. **Rhythm Templates & Metric Closure (`src/app.mjs`, `src/conductor.mjs`, `src/ensemble.mjs`):**
   - Added 3/4 Viennese Waltz template `[1.4, 0.8, 0.8]` at index 6 in `RHYTHMS`. Because $12 \bmod 3 = 0$, it divides the 12-step bar into 4 measures of 3 steps with zero loop drift, satisfying Audit Dimension 9 (D-050).
   - Extended `DELAY_MULTIPLIERS` in `src/ensemble.mjs` to 7 elements with index 6 at `0.75`.
   - Exported `RHYTHMIC_FEELS` (`straight: 0, swing: 1, syncopated: 2, gallop: 3, stately: 4, habanera: 5, waltz: 6`) and `effectiveRhythmIndex(score, genreCode)` from `src/conductor.mjs`.
   - Wired `effectiveRhythmIndex` into `loopStepDuration`, `scheduleAhead`, `renderEnsembleLoop`, and the genre dropdown change listener, ensuring live tempo and echo updates track genre feel while preserving native `score.rhythm` when `THE CREATURE'S OWN` is selected.
4. **Fixtures and Verification:**
   - Re-froze `tests/fixtures/rulebooks-golden.json` and `tests/fixtures/variations-golden.json`.
   - Updated clash ceilings and varied clash ceilings in `tests/clashes.test.mjs` (0% clash rates achieved across all 3 new genres).
   - Updated variation floors in `tests/variation.test.mjs`.
   - Stamped asset hash `41c33f2f715c`.

**Consequences:**
- The Kapellmeister catalog expands to 22 genres across 5 families with idiomatic rhythm feels.
- 186/186 automated tests pass; 100% phrase determinism and metric closure preserved.

## D-061 Standalone Studio Companion: Web MIDI and Audio Sink Interoperability (2026-10-24, status: accepted)

**Context:** The maintainer requested converting the machine into an interoperable instrument for DAW production (Path A: Standalone Studio Companion). Music producers on Linux (CachyOS/PipeWire), macOS, and Windows require:
1. Playing the Fun Machine and conducting the esoteric ensemble via external MIDI controllers or DAW MIDI tracks.
2. Routing audio directly from the browser/webview into DAW tracks with low latency via PipeWire/JACK or virtual audio cables.
3. Broadcasting the live conducted generative score out to DAW tracks across discrete MIDI channels to drive software instruments.
4. Packaging as a zero-dependency standalone desktop app (Tauri v2) without bloating or mutating the zero-dependency browser core.

**Decision:**
1. **Web MIDI Inbound Adapter (`src/midi-io.mjs`, `src/app.mjs`):**
   - Implemented `parseMidiMessage()`, `midiNoteToSemitone()`, and `bindMidiInput()`.
   - Notes fold into manual semitones 0..12 ($C\dots C'$), triggering `triggerFunKey(semitone, true/false)` to play manual pad voicings, lead arpeggios, and program step sequencer slots.
   - CC 64 engages authentic sustain pedal hold, maintaining manual voices until pedal release.
   - CC 1 (Mod Wheel) scales vitrine agitation ($0.0\dots 1.0$), driving organism perturbation, kinetic vibration, and mycelial spore bursts.
   - CC 7 / 11 trims master volume; Realtime $0xFA$, $0xFC$, $0xFB$ drives transport start, stop, and continue.
2. **Web MIDI Outbound Score Broadcast (`src/midi-io.mjs`, `src/app.mjs`):**
   - Discrete note-on and note-off events emitted with sample-accurate Web Audio timestamp offsets (`performance.now() + (at - audioContext.currentTime) * 1000`).
   - Mapped across 8 channels: Manual (Ch 1), Lead (Ch 2), Bass (Ch 3), Harmony (Ch 4), Chimes (Ch 5), Choir (Ch 6), Mycelium (Ch 7), and GM Percussion (Ch 10).
3. **Web Audio Output Sink Device Selection (`AudioContext.setSinkId`):**
   - Populates available system audio output devices via `navigator.mediaDevices.enumerateDevices()`.
   - Routes audio to chosen virtual audio sinks or soundcard ports without third-party plugins. Under CachyOS / Linux, PipeWire creates patchable nodes patchable via `pw-link` or Helvum.
4. **Studio Deck Interface (`index.html`, `styles.css`):**
   - Integrated `#studio-engine` inside Wing IV (Keep) with MIDI In/Out dropdowns, Connect button, Broadcast toggle, and Audio Sink selector.
   - Restamped asset version `7aa3e6c86ec1`.

**Consequences:**
- The Whimsy Machine functions as an algorithmic MIDI generator and tabletop synthesizer companion.
- Core remains 100% dependency-free vanilla ECMAScript modules.
- 194/194 tests pass with zero warnings.

## D-062 Clean DAW MIDI Export: Program Change & Marker Suppression (2026-10-24, status: accepted)

**Context:** Experienced musicians and producers noted two critical friction points with standard SMF Type 1 MIDI exports in modern DAWs (e.g. REAPER, Ableton, Logic, Pro Tools):
1. **Embedded Markers**: Exporting markers for every section and chord change causes DAWs to prompt for timeline/tempo map imports, and can trigger auto-warping or mismatched timebase stretching in audio tracks.
2. **Program Change Events**: Writing General MIDI program change bytes at tick 0 overrides the producer's carefully sculpted VST synth presets (e.g. in Serum, Vital, Kontakt) back to stock GM instruments upon playback.
3. **Multi-Channel Routing**: Discrete channels on separate tracks can prevent single-channel VST instruments from responding until the track is manually set to Omni.

**Decision:**
1. **Configurable Export Modes (`src/midi.mjs`, `src/app.mjs`):**
   - Added `stripPrograms`, `stripMarkers`, and `flattenChannels` flags to `buildMidiFile()`.
   - Added `#export-midi-format` selector in the Export Desk with three modes:
     - **`CLEAN DAW (NO PATCH OVERWRITE / NO TIMELINE WARPING)`** (Default): Suppresses all program changes, suppresses timeline markers, and flattens track channels to Channel 1 for seamless drag-and-drop into modern VST synths.
     - **`DAW WITH CHORD MARKERS (NO PATCH OVERWRITE)`**: Retains chord analysis markers on the conductor track while protecting VST presets from program changes.
     - **`FULL ARCHIVE (GM PROGRAM CHANGES & CHORD MARKERS)`**: Preserves the classic General MIDI archival format with discrete channels 1..10, GM patch numbers, and section markers.
2. **Verification & Tests:**
   - Added unit test in `tests/export.test.mjs` verifying marker suppression, program change suppression, and channel flattening.
   - Restamped asset version `97ce639b8f7b`.

**Consequences:**
- Exported MIDI files drop cleanly into any modern DAW track without resetting plugin presets or cluttering session timelines.
- 195/195 automated tests pass with zero warnings.

## D-063 Consonant Pad Voicing & Minor-Second Extension Suppression in Accompaniment (2026-10-24, status: accepted)

**Context:** Analysis of exported MIDI files in a DAW session by an experienced musician revealed harsh, errant notes in Phrygian and altered modal passages (e.g. two dissonant B♭ notes in Measure 7 over an A major sonority, and two C notes in Measure 19 over B major). 
Investigation showed two root causes:
1. `padVoicing()` included all pitch classes from `soundingPitchClasses(chord)`. In Phrygian dominant (`[r, r+1, r+4, r+7]`) and altered dominant (`dom7alt`), the minor-second extension above the root (`(r + 1) % 12`, flat-second / flat-ninth) was compressed directly into a closed keyboard cluster alongside the root in the upper register (e.g. A4 and B♭4, a semitone apart, beating at 26 Hz).
2. The esoteric band (Organ, Chimes, Choir, Bass) was playing a clean major triad without the flat-second, making the Fun Machine manual track's flat-second cluster and sustained quarter-note lead sound like an accidental finger slip or counterpoint clash.

**Decision:**
1. **Consonant Pad Voicing (`src/accompaniment.mjs`):**
   - Updated `soundingPitchClasses(chord)` to exclude minor-second clashes against the chord root (`((pc - rootPc + 12) % 12) === 1`), such as Phrygian flat-second and alt-dominant flat-ninth extensions.
   - Pads and arpeggios now voice pure, resonant triads and seventh shells (e.g., A Phrygian voices clean A - C♯ - E; C7alt voices clean C - E - G - B♭).
2. **Sustained Lead Figure Resolution (`src/accompaniment.mjs`):**
   - In `buildPerformance()`, when a 4-step held lead note forms a minor-second clash with the active chord's root (`((leadPitch - chord.rootPc + 12) % 12) === 1`), it smoothly resolves via `nearestChordTone(leadPitch, chord)` down by semitone to the root, following authentic Baroque and classical voice leading.
3. **Verification & Tests:**
   - Added unit test in `tests/accompaniment.test.mjs` verifying that `soundingPitchClasses` and `padVoicing` omit minor-second extensions for both `phrygian` and `dom7alt`.
   - 196/196 automated tests pass with zero warnings.

**Consequences:**
- Phrygian, Andalusian, and altered dominant chords export and broadcast with smooth, consonant voice leading without jarring semitone clusters in pad beds.
- Determinism contract and rulebook structures preserved.

## D-064 Standalone Desktop Packaging with Tauri v2 (2026-10-24, status: accepted)

**Context:** While the zero-dependency browser app works in evergreen browsers, music production workflows require a dedicated desktop application that integrates seamlessly with desktop DAWs (e.g. REAPER, Ableton Live, Bitwig, Ardour) via system Web MIDI and PipeWire/JACK routing without requiring a browser tab or local dev server.

**Decision:**
1. **Isolated Desktop Shell (`src-tauri/`):**
   - The core web application (`index.html`, `styles.css`, `src/`) remains 100% dependency-free vanilla ECMAScript. No npm packages, node_modules, or package.json in the repository root.
   - Initialized Tauri v2 application wrapper in `src-tauri/` with Rust 2021 edition and `tauri-build 2.x`.
   - `src-tauri/tauri.conf.json`:
     - App name: `Edmark's Esoteric Fun Machine`.
     - Identifier: `com.edmark.esoteric-fun-machine`.
     - Window size: $1200 \times 900$ (min $380 \times 600$), resizable.
     - Frontend dist: `"dist"` (staged from root web assets `index.html`, `styles.css`, `manual.html`, and `src/` via `build.rs`, completely self-contained with no dev server or localhost dependency).
     - Security: CSP null for local offline origin.
2. **Build Tooling (`tools/build_desktop.sh`):**
   - Added automated release build script that compiles an optimized 11 MB standalone desktop executable (`src-tauri/target/release/esoteric-fun-machine`).
   - Links against standard system `webkit2gtk-4.1` and `gtk+-3.0`.
3. **Verification & Tests:**
   - Standalone binary built and verified on CachyOS / Wayland with zero launch errors.
   - Automated tests: 196/196 passing.

**Consequences:**
- The Whimsy Machine runs as a native desktop companion window beside DAWs with native Web MIDI, ALSA/PipeWire routing, and full offline autonomy.
- Core zero-dependency web architecture is untouched.

## Open questions

- **Q-001** Which static host and public domain should carry the first release? (asked 2026-10-17; blocks P6-01; recommendation: decide after P4-01)

