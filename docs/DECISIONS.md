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

## D-020 Esoteric Fun Machine: Real-Time Play-Along Keyboard Manual, Auto-Chord Harmonization, and 12-Step Punch-In Loop Sequencer (2026-10-19, status: accepted)

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

## D-024 Eight-channel parlor mixer built into the shared ensemble graph (2026-10-19, status: accepted)

**Context:** P5-19 asks for faders, stereo panning, a mute/solo matrix, and VU metering. The ensemble already had a second, partial mute system: each plate's ENGAGE/SILENCE switch skipped scheduling and ducked its bus with hard-coded levels repeated in a dozen places. A mixer added on top would have given each bandmate two mutes that could disagree.

**Decision:**
1. **One strip per bus, inside `buildEnsembleGraph()`.** Eight channels (`lead`, `fun`, `beat`, `bass`, `harmony`, `chime`, `chant`, `fungal`) each route bus → fader → `StereoPannerNode` before reaching the existing filter, compressor, and output paths. Live playback adds a post-pan `AnalyserNode` tap for meters; offline renders skip it. WAV export therefore honors every fader, pan, mute, and solo.
2. **Faders upmix to stereo.** Each fader is an explicit 2-channel `GainNode`, so a centered panner passes mono voices at unity instead of the −3 dB it applies to mono input. The vitrine's drag panner, which now receives stereo, gets a fixed `Math.SQRT1_2` trim so its path keeps the pre-mixer balance. Measured: a default-console WAV of "the moon owes me five dollars" (parlor off) rendered −26.78 dB RMS and peak 14280 both before and after the change.
3. **Plate switches are channel mutes.** The five `*Enabled` flags are gone. A plate's ENGAGE/SILENCE switch toggles its channel's mixer mute, and the Bandstand's ENGAGE FULL BAND and SOLO LOLCODE LEAD mute or unmute the five accompaniment channels. A muted plate still skips scheduling, as before. Bus voicing levels are now constant (`ENSEMBLE_BUS_GAINS`).
4. **Pure state in `src/mixer.mjs`:** a two-part fader taper: square-law `(v / 80)²` below unity (40 = −12 dB) and linear in dB above it (80 = unity, 100 = +12 dB; raised from +3.9 dB the same day after listening found the lead and choir too quiet to lift), pan −100..100, and solo semantics where any solo isolates the soloed channels but an explicit mute still wins. Mixer settings are a session control like master volume (D-009): they persist across summons, never touch the score, and are not stored.
5. **Placement:** between the Fun Machine and Plate II, as the roadmap item says. Below 480 px the strips become a horizontally scrolling rail instead of shrinking past legibility.
6. **Default voicing trims (`CHANNEL_VOICING_DB`).** Each strip starts with a fixed trim before its fader, so the default balance can change while every fader still opens at 0.0 dB. Listening found the lead and choir consistently too quiet. Solo WAV renders confirmed it: on two typical phrases the lead measured about level with the bass (−32.7 vs −30.8 dB RMS) and the choir 20–29 dB under it. The lead is trimmed +6 dB and the choir +12 dB. The lead's own `mix` node is left alone because it also carries the vitrine's hold-and-tap swell. After the trims, full-mix peaks on three test phrases stayed between −6.5 and −7.7 dBFS with no clipping. This intentionally ends the "default console matches the pre-mixer level" property measured in point 2.
7. **The choir bypasses the creature filter.** Shakespeare voices are already shaped by three formant bandpasses each, and on bandpass creatures (score voices 1 and 5) the creature filter stacked a fourth narrow bandpass on top. The choir strip now feeds the compressor, delay, and parlor reverb send directly. Measured on "three pigeons in a borrowed coat" (voice 5): choir solo −66.6 → −47.2 dB RMS. On the lowpass creatures "the moon owes me five dollars" and "an accordion at the edge of time" the gain was only 3.6 dB and 1.7 dB, so the +12 dB trim stays. The choir no longer follows the vitrine drag panner or the creature filter's live sweep.

**Alternatives:** Keeping plate switches separate from mixer mutes would leave two silencing controls per bandmate. A master-bus meter alone would not show which bandmate is hot. Building strips only in the live graph would let exports diverge from what is heard (the problem D-023 fixed).

**Consequences:** Narrow bandpass creature filters (score voices 1 and 5) can still bury the lead, organ, and chimes: "three pigeons in a borrowed coat" solos its lead at −51 dB even with the +6 dB trim. Those voices carry the creature's filter identity, so they stay filtered unless a later decision says otherwise. Hard-panning a channel puts its full level on one side (+3 dB acoustic power versus center), which is standard balance behavior for a stereo source. The Fun Machine strip applies only while the transport is running; idle keyboard auditioning still uses its direct path. The parlor room (reverb, crackle, ticks) keeps its own console and is the ninth stem planned for P5-21.

## Open questions

- **Q-001** Which static host and public domain should carry the first release? (asked 2026-10-17; blocks P6-01; recommendation: decide after P4-01)

