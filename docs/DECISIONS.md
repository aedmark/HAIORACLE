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

**Context:** Maintainer direction called for tapping/clicking, holding, and holding-and-dragging on the specimen vitrine to alter audio pitch, intensity, and percussives as well as visual shape, movement, and morphing.

**Decision:** Handle pointer gestures (`pointerdown`, `pointermove`, `pointerup`) directly on `#vision` via a transient session state object (`interaction`) coupled with a polar harmonic field (`harmonicField`). Tapping triggers a synthesized four-partial harmonic bloom (`[0.5, 1, 1.5, 2]`) and membrane strike, spawns a concentric vitrine ripple, and jolts silhouette lobes and pupil dilation. Holding swells filter cutoff/resonance, mix and echo feedback, tempo density, and motif-locked step percussion while morphing the silhouette toward a secondary shape family and locking the creature's gaze onto the pointer. Holding and dragging maps pointer coordinates into polar `(radius, angle)` to drive a constant-power ($\cos\alpha, \sin\alpha$) harmonic phase shift across the creature's 12-note motif and consonant fifth/fourth intervals, crossfades a three-partial harmonic drone choir (`-12`, `-5` fifth, `+7` twelfth) via raised-cosine angular weights without bending `delayTime`, fires motif-locked harmonic bell plucks along the drag path, and elastically tugs and stretches the creature within its `[0.38, 1.08]` silhouette clamp. Releasing the pointer decays all offsets smoothly back to the creature's deterministic resting state.

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

## Open questions

- **Q-001** Which static host and public domain should carry the first release? (asked 2026-10-17; blocks P6-01; recommendation: decide after P4-01)
