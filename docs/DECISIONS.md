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

## D-041 Many more Kapellmeister genres, in waves, written in Inform 7 (2026-10-20, status: proposed)

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

**Related:** D-043 (proposed 2026-10-20) adds a goal to this redesign: every creature varies its genre or writes its own. New genres are then written with the variation moves they permit.

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

## Open questions

- **Q-001** Which static host and public domain should carry the first release? (asked 2026-10-17; blocks P6-01; recommendation: decide after P4-01)

