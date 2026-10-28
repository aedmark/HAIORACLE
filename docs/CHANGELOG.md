# Changelog

## [1.4.1] - 2026-10-27

### Fixed

- 16-Step Metre Alignment & Chord Progression Temporal Synchronization (`P8-17`, `D-084`):
  - Fixed pad truncation bug in `src/accompaniment.mjs` (`strikeLength`) where 16-step clock-synced chords cut off at step 12 (beat 3) instead of holding for all 16 steps of the bar, and un-clocked step 12 chords cut off after a single sixteenth note.
  - Parameterized `buildFunProgression()` in `src/conductor.mjs` to generate 16 steps (4 steps per region) in 16-step mode, keeping lead melody offsets locked to region chord boundaries.
  - Parameterized `varyProgression()` in `src/accompaniment.mjs` to generate a 16-chord spine in 16-step mode (`stride = 4`), preventing region chords from wrapping around into adjacent regions.
  - Added `effectiveRhythmTemplate()` in `src/tuning.mjs` with length-4 symmetric beat templates (`RHYTHMS_16`) and length-3 triplet templates (`RHYTHMS_LOCKED_12`), guaranteeing equal quarter-note beat durations ($60 / \text{BPM}$ seconds) and zero metric loop drift across both 16-step straight time and 12-step bar-locked time.
  - Retuned delay echo line across tempo, genre, bar lock, and grid changes using scaled step unit duration.

## [1.4.0] - 2026-10-27

### Added

- Discrete Creative Determinant (CD) Field Solver (`P9-01`, `D-083`): Pure mathematical module (`src/autopoiesis.mjs`) implementing Nelson Spence's discrete nonlinear elliptic boundary value problem ($(L \Phi)_x = a \|\nabla \Phi\|_x + b \Phi_x - c (\Phi_x^+)^p$) across finite weighted graphs, circular $S^1$ vitrine perimeters, and the Neo-Riemannian Tonnetz, with Picard iteration steady-state solver and spectral viability verification ($\lambda_1(L - \text{diag}(b)) < 0$).
- Autopoietic Fractal Vitrine Morphogenesis & Attractor Core (`P9-02`, `D-083`): Integrated Weierstrass self-similar fractal harmonic fluting into the creature perimeter flux in `src/vitrine-canvas.mjs`, and implemented deterministic Clifford and De Jong strange attractor fractal point rendering (`drawStrangeAttractorDust`) within the creature's glowing nucleus.
- Tonnetz Autopoietic Field, Fibonacci Delay & Fractal Arpeggiation (`P9-03`, `D-083`): Evaluated harmonic vitality across chord progressions on the Tonnetz torus graph, implemented Golden-Ratio Fibonacci fractal delay cascades (`fibonacciDelayTaps`), and recursive self-similar fractal arpeggiation (`fractalArpeggioSequence`).

## [1.3.0] - 2026-10-26

### Added

- Unified Utterance Metre & Multi-Instrument Synchronization (`P8-15`, `D-081`): Parameterized step unit calculations, delay reflection taps, mycelium spore and hyphal triggers, parlor clockwork escapement ticks, and voice filter sweeps across both 12-step compound shuffle and 16-step straight time. Conductor and Accompaniment engines dynamically generate 16-chord spines and 4-step region strides ($S/4$), eliminating polyrhythmic drift, vertical clashes, and out-of-bounds indexing exceptions.
- The Keep Wing Segmented Telegraph Decks & Kapellmeister Ergonomic Polish (`P8-16`, `D-082`): Refactored Wing IV into a clean, unbloated segmented deck architecture with a telegraph switcher (`EXPORT`, `SESSION`, `STUDIO`, `HERBARIUM`), persisted via `whimsy-machine.keep-deck` with strict panel display isolation (`.wing-keep .beat-engine[hidden] { display: none !important; }`). Grouped Kapellmeister action controls into semantic `.kapellmeister-group-rulebook` and `.kapellmeister-group-tuning` flex containers to eliminate button crowding and line-wrap glitches. Reorganized studio WAV format selectors into a balanced $2 \times 2$ grid with Victorian parameter sublabels.
- Studio-Grade Audio Export (`P8-01`, `D-076`): Pure audio export engine (`src/audio-export.mjs`) supporting 16-bit PCM (with phrase-seeded TPDF dither for byte-reproducible renders), 24-bit PCM, and 32-bit float WAV across 44.1, 48, and 96 kHz.
- Loop-Perfect Tail Folding & Sampler Metadata (`P8-01`, `D-076`): Beat one anchored at sample zero; loop-perfect export folds decay tails back into the loop start for seamless DAW repetition. Embedded `smpl` loop points, `acid` chunk (tempo, beat count, root note), and `LIST/INFO` chunk (specimen name, engine version, key, A4 reference).
- Dry Stem Multi-Track Rendering (`P8-01`, `D-076`): Dry stem export mode bypasses master compression and chamber reverb (`masterDynamics: false`), rendering uncompressed linear channel stems that sum cleanly to the mix, bounded by a shared −1 dBFS sample-peak ceiling.
- DAW-Ready MIDI Enhancements (`P8-02`): Conductor track transmits Key Signature (`0xFF 0x59`) and Time Signature (`0xFF 0x58`) meta events; General MIDI drum channel 9 is preserved when channel flattening is enabled.
- Engine Versioning & Integrity Guard (`P8-03`, `D-077`): Defined `ENGINE_VERSION` and `ENGINE_FINGERPRINT` over esoteric scores and golden fixtures (`src/version.mjs`, `tests/engine-version.test.mjs`), with session format v7 telemetry warnings on version mismatch.
- Key, Mode, and Concert Pitch Retuning (`P8-04`, `D-078`): Real-time host controls for key override ($C\dots B$), scale override (8 mode families), and concert pitch reference A4 ($415\dots 466\text{ Hz}$ with Baroque, Verdi, Standard, and Orchestral presets), routed through `src/tuning.mjs` across all audio synthesis paths without violating the deterministic phrase-to-creature score contract.
- 4/4 Bar-Aligned Metre Lock & Native 16-Step Straight Grid (`P8-05`, `D-079`): Master transport `4/4 BAR LOCK` (`#transport-bar-lock`) scales 12-step passes via `stepUnitSeconds()` to fit exactly one 4/4 bar (4 quarter-beats) at the stated BPM. Master transport grid toggle (`#transport-grid-steps`) switches between native 16-step straight grid (`16 STEPS (4/4)`) and triplet shuffle (`12 STEPS (TRIPLET)`), parameterized across all five esoteric VM band generators (Malbolge, Brainfuck, Befunge-93, Piet/FRACTRAN, Shakespeare), Euler Tonnetz conductor, INTERCAL dynamic arrangement orchestrator, Fun Machine accompanist, and Loop Machine sequencer, serialized in session format v7 (`gridSteps`).

## [1.2.0] - 2026-10-26

### Added

- Add M-VAVE FM-1 Hardware Controller Companion Profile (`P7-01`, `D-072`): auto-detects connected M-VAVE / Cuvave FM-1 synthesizers over USB and BLE Bluetooth MIDI (`isFm1Port`), mapping upper keys ($C_4\dots G_5$) to the 13-key manual and lower keys ($F_3\dots B_3$) to section and accompaniment triggers, with dedicated MIDI CC bindings (CC 70–73 for mixer faders, CC 2/74 for filter cutoff, CC 7 for master volume, and CC 75 for Euler strictness) and live telemetry.
- Add Standalone C Reference Engine (`P7-02`, `D-073`): exact pure C implementation of FNV-1a 32-bit score hashing, Euler *Gradus Suavitatis*, and all seven esoteric virtual machines (Brainfuck, Malbolge, Befunge-93, FRACTRAN/Piet, Shakespeare, and INTERCAL) in `firmware-c/whimsy_esoteric.h` and `firmware-c/whimsy_esoteric.c`, guarded by golden fixtures in `tests/firmware-c.test.mjs`.
- Add FM-1 Native 44.1 kHz Stereo Audio Engine (`P7-03`, `D-073`): real-time 44.1 kHz, 128-frame signed Q23 stereo audio block renderer in `firmware-c/whimsy_fm1_synth.h/c` with precomputed MIDI note-to-phase-increment tables (zero runtime `math.h` / `libm` floating point) and 8-track voice synthesis.
- Add FM-1 240×240 RGB565 Color TFT Screen Renderer (`P7-04`, `D-074`): embedded graphics engine in `firmware-c/whimsy_fm1_ui.h/c` rendering the Victorian parlor palette (Obsidian, Parchment, Brass, Oxblood, Verdigris, Cyan), precomputed static bell jar arch geometry, and 16-row DMA banded screen transfers.
- Add Standalone Browser Web MIDI Firmware Flasher (`P7-05`, `tools/flash_fm1.html`): browser utility using W3C Web MIDI SysEx API (`00 59` bootloader protocol) for one-click USB flashing.
- Add Native JieLi PI32v2 `.fwsc` Container Packaging & `fm1-emu` Integration (`P7-06`, `D-075`): firmware application core in `firmware-c/whimsy_fm1_app.h/c`, pure-Python zero-dependency JLFS/UFW firmware packager in `tools/build_fm1_firmware.py`, and automated headless smoke test in `tests/fm1-firmware.test.mjs` running inside Joakim Eriksson's `fm1-emu` emulator harness.

## [1.1.0] - 2026-10-25

### Added

- Add 24-PPQ External MIDI Clock & Transport Slave/Master Mode to the Studio Deck (`P5-33`, `D-068`): lock the parlor ensemble to an external DAW or hardware drum machine (`SLAVE TO MIDI IN (24 PPQ)` with 24-tick rolling BPM estimation and 12-tick eighth-note step phase lock) or transmit jitter-free `0xF8` Timing Clock and `0xFA`/`0xFB`/`0xFC` Start/Continue/Stop transport messages (`MASTER CLOCK OUT (24 PPQ)`) via `src/midi-io.mjs` and `src/app.mjs`.
- Add "Under the Parlor Glass" Live Esoteric VM Step Inspector for Plates I–V in Wing III (`P5-34`, `D-069`): expandable `INSPECT VM ⌕` loupes (`src/inspector.mjs`) reveal real-time Malbolge 10-trit `rotr`/`crazy` words, Brainfuck 6-cell tape windows and `[->+<]` shuttles, Befunge-93 2D torus `(x, y)` coordinates and `/` vs. `\` mirror deflections, Piet codel transitions and FRACTRAN prime-exponent registers $2^{e_2}\cdots 13^{e_{13}}$, and Shakespeare Act/Scene `[SPEAKER ➔ ADDRESSEE]` dialogue cues and $F_1/F_2/F_3$ formant frequencies without layout shift or screen-reader chatter (`aria-live="off"`).
- Add "The Naturalist's Herbarium" Cabinet Curio Gallery & Trait Comparator (`P5-35`, `D-070`): pin up to 24 favorite summoned creatures on-device (`src/herbarium.mjs`, `#herbarium-engine` in Wing IV) with deterministic 48-vertex miniature SVG portraits, re-summon any pinned specimen in one click, and compare two specimens side-by-side across 8 canonical anatomical and musical traits through a strictly validated storage boundary.
- Add "The Kapellmeister's Manuscript" Live Inform 7 Custom Rulebook Sandbox (`P5-36`, `D-071`): collapsible Inform 7 rulebook editor (`src/manuscript.mjs`, `#kapellmeister-manuscript`) preloaded with the `"celestial_music_box"` custom genre template; compiles live in the browser via `compileRulebooks()` with 1-based manuscript line diagnostics while guaranteeing canonical genres in `src/rulebooks.ni` remain untouched.
- Add lightweight GitHub Actions CI verification workflow (`P4-04`, `.github/workflows/ci.yml`): runs the full Node test suite (`220` checks), `tools/check_docs.py`, and `tools/manual.py check docs/manual.json` on every push and pull request.

### Changed

- Modularize host architecture (`P4-03`, `D-067`): extracted the Apparition Vitrine 2D Canvas renderer (`src/vitrine-canvas.mjs`), the 1200×1520 engraved broadsheet PNG renderer (`src/broadsheet.mjs`), and the per-step Web Audio voice schedulers and parlor acoustic buffer synthesizers (`src/schedulers.mjs`) out of `src/app.mjs` with direct unit test coverage (`tests/decomposition.test.mjs`).
- Add `QuotaExceededError` oldest-entry eviction fallback (`P4-05`, `D-070`): both the Session Ledger (`writePresetStoreTo` in `src/session.mjs`) and the Naturalist's Herbarium (`writeHerbariumStoreTo` in `src/herbarium.mjs`) automatically evict oldest entries when browser `localStorage` quota is tight and fall back cleanly when storage quota is zero.

## [1.0.0] - 2026-10-25

### Added

- Bespoke cross-platform master application icon (`src-tauri/icons/`): high-resolution centered Victorian brass-rimmed bell jar vitrine containing a luminous ethereal organism with celestial crescent moon (☽) and sun (☉) sigils, compiled into `.ico` (Windows), `.icns` (macOS), `.png` (Linux desktop launcher), and Android/iOS icon sets.
- Automated multi-platform release builds for Linux, Windows, and macOS (`.github/workflows/release.yml`): automated GitHub Actions matrix compiling native installers (.deb, .rpm, .AppImage, .tar.gz for Linux; .msi, .exe for Windows; .dmg for macOS) on tag push.
- Stage Neocities static web release bundle (D-065): added `tools/stage_neocities.py` and transparent dual-extension fallbacks in `src/app.mjs` (`oracle.lol` -> `oracle.lol.txt`) to support zero-dependency hosting on both free (file-extension whitelisted) and supporter Neocities accounts.
- Package as a standalone desktop studio companion (D-064): isolated Tauri v2 desktop wrapper (`src-tauri/`) builds an 11 MB standalone native desktop binary (`tools/build_desktop.sh`) that integrates directly with DAWs via system Web MIDI and PipeWire/JACK routing without requiring a browser tab or local dev server.
- Choose clean DAW MIDI export (D-062): an export format selector (`#export-midi-format`) offers `CLEAN DAW` (default, stripping General MIDI Program Change bytes that overwrite VST synth presets, omitting marker clutter that prompts DAW tempo stretching, and flattening notes to Channel 1), `DAW WITH CHORD MARKERS`, and archival `FULL ARCHIVE`.
- Program loop notes with a 12-step note sequencer (D-046): click any step on the 12-step ribbon (`#looper-steps`) to select and assign notes with the keyboard manual or computer keys, playing an instant audition preview, or click again to clear.
- Auto-advance step recording (`STEP REC`): toggle `STEP REC` (`#looper-step-rec`) to step through 1..12 automatically on each key strike on the manual, with a dedicated `REST (—)` button (`#looper-rest`) to insert rests.
- Latch anticipated downbeat keystrokes: striking a key during the armed count-in pass immediately latches onto step 1 and illuminates the step with the note name, eliminating downbeat misses from look-ahead timing.
- Arm and sync the Loop Machine (D-045): `RECORD NEW LOOP` and `OVERDUB` now arm with downbeat sync. Starting from stopped plays a 1-loop (12-step) count-in pass, while arming mid-loop counts down the remaining steps to the downbeat. A mechanical clockwork tick metronome automatically sounds during count-in and recording with an accented downbeat.
- See loop recording progress in real time: a dedicated 12-step progress tracker ribbon (`#looper-steps`) displays the advancing playhead during playback, amber countdown steps during armed count-in, and vibrant red cells displaying recorded notes during takes. The readout narrates every step (`STEP 1 OF 12`, `FINAL STEP`), and buttons pulse amber while armed and red while recording.
- Capture keystrokes right on the beat: live key strikes during recording immediately register on the audible step, eliminating look-ahead scheduling latency mismatches.

- Choose among six more rulebooks: BOSSA NOVA SALON, BAROQUE CHORALE, GOTHIC HORROR ORGAN, GOSPEL SHOUT & REVIVAL, TANGO HABANERA, and NEO-SOUL LO-FI, bringing the Kapellmeister catalog to nineteen genres.
- Play six new chord qualities: minor 7th (`min7`), major 7th (`maj7`), half-diminished 7th (`m7♭5`), augmented triad, suspended 4th (`sus4`), and major 6th (`major_6`), integrated across Inform 7 rulebooks, conductor voicings, Fun Machine variations, and sessions.
- Choose among six more rulebooks: DOO-WOP PARLOR BALLAD, SACRED HARP SHAPE-NOTE HYMNODY, ANDALUSIAN FLAMENCO CADENCE, KLEZMER FREYGISH DANCE, SEA SHANTY & HORNPIPE, and SILENT-FILM LYDIAN DREAM, all written in Inform 7. The RULEBOOK menu now groups its genres into families (PARLOR, NIGHT CLUB, SACRED & EARLY, FOLK & DANCE, ESOTERIC).
- Let each creature write its own rulebook: THE CREATURE'S OWN, first in the Kapellmeister menu, builds its changes from the creature's own scale (tonic, predominant, dominant, in an order the creature chooses) and borrows a genre's character for its bass and bells. Over 200 creatures it wrote 103 different progressions. It is now the rulebook a fresh creature opens in.
- Hear each creature's own Fun Machine voice: its phrase picks one of seven parlor presets and tilts it brighter or darker, wider or narrower (THE CREATURE'S OWN, the default; hover it to see which). Or choose a preset yourself: VELVET PAD (the original), HARMONIUM, GLASS HARMONICA, THEATRE ORGAN, STRING MACHINE, MUSIC BOX, or ÆTHER CHOIR. Sessions and presets keep your choice (format v5), and every recorded loop layer keeps the voice it was played in, so a harmonium loop can carry a music-box overdub. Older files open in VELVET PAD, as they sounded. MIDI exports give each voice its own MANUAL track and General MIDI instrument.

### Removed

- Remove the Fun Machine's 12-step loop progression, punch-in recording, and RESET PROGRESSION. Holding keys works as before. Sessions and presets saved earlier still open; any punched chords in them are left out. A proper loop machine is planned.

### Changed

- Hear the harmony keep step with the band: each chord now lasts a whole loop and changes on the loop's downbeat, so a progression unfolds over four loops (the blues moves every half loop) instead of rushing through one loop with changes between beats. The Fun Machine's progressions follow the same clock, and the readout shows which of the four passes is playing. WAV, stem, and MIDI exports cover the whole four-loop cycle.
- See and switch each creature's variation: the Kapellmeister names the moves it made (VARIATION: …), and AS WRITTEN plays the genre exactly as its rulebook wrote it. Sessions and presets keep the switch (format v6); older files open as written, as they sounded.
- Hear the Fun Machine's progressions vary with the creature too: the key you hold still sounds first, then the creature may borrow, substitute, or turn the progression its own way. MIDI exports mark every chord change by name.
- Hear each creature play its own changes: every genre except Raw Chaos now lets the creature vary its progression (rotating it, swapping in relative or tritone substitutes, adding secondary dominants, borrowing chords, choosing its cadence, pushing or delaying the changes), within the moves that genre's rulebook permits. Over 80 creatures a genre now plays 20–70 distinct progressions instead of one.
- Hear a brighter LOLCODE lead: low-pitched creatures now sing an octave or two higher (from C3 up), the lead keeps its saw and square overtones, and the creature filter is brighter and less resonant.
- Hear each mycelium as its own species: the eight fungus forms now knock, glint, bloop, tick, chirp, ring, breathe, or drip in their own patterns, shaped by the creature's hyphae, spores, and bloom.
- Read each Kapellmeister genre's motto under its title. The genres themselves (menu, chord colours, changes, progressions, bass walks, voicings, overtones) are now written in plain-English Inform 7 in `src/rulebooks.ni`; the music is unchanged.
- Keep the Perform wing still while you play: switching genres or Fun Machine styles, or holding keys over the loop, no longer changes the height of any panel at any window width, and long status lines, sequencer chords, and plate labels keep a fixed space.
- Hear every phrase breathe its own way: the INTERCAL conductor reads each creature's arrangement word and chooses who waits, who answers, and when the turnaround lands, so arrangements now differ from creature to creature (existing creatures' arrangements changed).
- See the INTERCAL conductor at work: the transport names the current section, console strips light **TACET** while the conductor rests them, MIDI exports mark each section on the DAW timeline, and the stem README lists section times. The conductor score's own registers now decide who plays, so editing `src/conductor.i` re-arranges the band.
- Keep the layout still while the loop plays: the section readout and the Kapellmeister harmony readout no longer change size when their text gets longer, so on wide windows the volume controls no longer jump to a new line once per loop.
- Keep every arrangement full: each step keeps at least five band voices, and the pulse and bass hold until the breakdown.
- Find every control in one of four wings beneath the vitrine: **Perform** (transport with restart, volume, and tempo; the Fun Machine; the Kapellmeister rulebook), **Mix** (Bandstand, mixing console, parlor room), **Keep** (Session Ledger and a new export and share desk), and **The Band** (Plates II–VI). The reading strip now only names the creature, and the keyboard's tab order follows the wings.

### Fixed

- Keep pad voicings consonant in Phrygian and altered modal passages (D-063): pad voicings and sounding pitch classes now exclude minor-second clashes against the chord root (such as Phrygian flat-second and alt-dominant flat-ninth extensions), keeping pad beds and arpeggios on pure triads and 7th shells without jarring semitone clusters, and resolving held 4-step lead notes cleanly to chord tones.
- See the Fun Machine's status line again: the line under its title that narrates the held key, style, voice, and chord had gone missing from the page, so it never showed. A test now checks that every element the app looks for exists.
- Hear the band agree with its chords: the chimes no longer ring a minor third over a major chord (or a fourth against its third), the melody no longer sits a semitone above a chord tone, walking basses land on each chord's own fifth and seventh, and altered, diminished, Lydian, Phrygian, and open-fifth chords are voiced with their own notes. Measured clashes fell from 20–33% of steps to 0–5% in every genre except the blues, whose blue notes stay.
- Hear the Befunge organ and the chimes: the creature filter could silence the organ even while its meter moved, and dulled the chimes and mycelium. Only the LOLCODE lead passes through it now, and the organ and chimes sit level with the band.
- Stop the lead from droning on one note: the three tonic drones under the lead used to hold one pitch at one level for the whole loop. They now follow each chord's root, swell when it lands and settle back, and fall silent while the arrangement rests the lead.
- Stop favicon 404s in the console: the app and the manual declare an empty icon, so browsers request none.
- Hear the right bass, organ, and choir notes on low-pitched creatures: notes outside a voice's range used to collapse onto its edge (every bass note an E1); they now move by octaves and keep their pitch. MIDI exports carry the corrected notes too.
- Hear Raw Esoteric Chaos as intended: with no Fun Machine key held, the esoteric machines now play their own raw output instead of being quietly conducted. Holding a key still brings the band along.
- Read the cabinet more easily: no text is smaller than 9.6 px, faint labels are brighter (at least 4.5:1 contrast), screen readers no longer announce every step of the loop, and reduced motion takes effect as soon as you turn it on.
- Keep the echo in time when you move the tempo slider during play. The delay was timed once at the start of the loop, so afterwards the Fun Machine's pads, arpeggios, and lead (which all feed it) echoed at the old tempo and sounded rushed or dragging.
- Play the Fun Machine manual like a keyboard: each key now sounds higher than the one to its left, and C' sounds an octave above C (they used to play in the same octave).
- Load the new version after an update without a hard reload: every module and esoteric source URL carries a version stamp, so the browser can no longer run a fresh module against a cached old one ("does not provide an export named ..."). `python3 tools/serve.py` serves the page for local development without stale caching.
- Hear the parlor room: the chamber reverb now hears every voice except the bass (it was nearly silent, especially for bandpass creatures), the clockwork escapement ticks clearly, and the wax crackle sits at half its old level so it no longer overpowers the band.
- Read every Tonnetz compass label clearly: long region names such as "Phrygian Inflection" and "Lydian Mystic (#4)" no longer pile on top of each other. Each region now has its own column, a numbered glyph, and a two-line label underneath.
- Make the band follow a held or punched Fun Machine chord in the right key; it previously played the chord transposed by the creature's tonic. The sequencer grid also names generated steps correctly now.
- Keep the preset-name field one line tall on phones, and stop the Kapellmeister rulebook, Fun Machine keyboard, and footer links from being cut off on narrow screens.
- Render WAV exports through the same audio graph as live playback, so chimes, choir, and fungal voices are filtered and panned exactly as heard.
- Remove audio-synchronous geometry scaling after screencast review exposed beat-periodic tearing and compression-like jumps.
- Confine the large body-glow blur to one silhouette fill instead of applying it to every kinetic line, ring, and eye.

### Added

- Record what you play: the Fun Machine's LOOP MACHINE records a pass of held keys as a loop, overdubs more layers on top, and plays the song back with the band following the newest layer; a live key always takes over. Arrange the song with loop tiles: pick a loop, set how many times it plays, move it earlier or later, undo its newest layer, or delete it. Songs are saved with presets and `.fun` files, and WAV, stem, and MIDI exports carry the whole song, with each loop marked on the MIDI timeline.
- Discover the cabinet as you play: a first visit opens on the phrase, the vitrine, the transport, and the Fun Machine, and the Kapellmeister, Mix, Keep, and Band drawers open themselves when you reach for them. OPEN THE WHOLE CABINET lays every control bare, and your choice is remembered in this browser only.
- Play Parlor Ragtime, a seventh Kapellmeister genre: Joplin-style changes (I · I7 · IV · ♯iv° · I · VI7 · II7 · V7), an oom-pah stride bass that climbs home, an organ "pah", sixth-chord melodies, and a "Parlor Rag" one-finger progression (I → I7 → IV → V7). It was written entirely in the Inform 7 rulebooks.
- Overcome the ensemble's "wall of sound" using the Grand Conductor in INTERCAL 1972 (`src/conductor.i`, `src/intercal.mjs`). Evaluates statement politeness (22.9% P/N, adhering to ICL079/ICL099 limits), dynamically orchestrates channel breathing across Exposition, Antiphony, Tutti, and Breakdown regions with `PLEASE IGNORE` and `PLEASE REMEMBER`, and intercepts turnaround cadences at step 11 with `COME FROM (60)`.
- Play the Esoteric Fun Machine as a one-finger accompanist: hold a key and a stereo synth pad plays a **Swell** (one chord), an **Arpeggio** (chord tones rippling in the band's rhythm), or a **Progression** (four chords with a singing lead line) while the band follows your chord and the LOLCODE lead steps back.
- Enter a phrase to summon a deterministic named audiovisual creature.
- Hear a continuously looping synthesized composition generated from the creature's LOLCODE score.
- Use surprise, replay, and mute controls.
- Save and recall whole sessions in the Session Ledger: name presets kept only in this browser, or seal a portable `.fun` file to reopen anywhere.
- Export nine aligned WAV stems as a ZIP (`EXPORT 9 STEMS (ZIP)`) and the whole loop as a multi-track Type 1 MIDI file (`WRITE MIDI SCORE`) for any DAW.
- Hear the lead melody and Shakespeare choir sit higher in the default mix, with neither the choir nor the lead vanishing behind narrow bandpass creatures.
- Mix the ensemble on an eight-channel parlor console with faders, stereo panning, mute and solo switches, and live VU meters; plate engage/silence switches now share the console's mutes, and WAV exports follow the mix.
- Play, pause, and stop-and-rewind the loop from a master transport rail, or press `Space` to play/pause and `Esc` to stop. Pause resumes on the next unheard step.
- Control a louder default mix and live ensemble pace with keyboard-accessible master-volume (`0..100%`) and tempo (`36..208` BPM) sliders.
- Hear twelve deterministic repeating motif families spanning seeded scale walks, arpeggios, chromatic movement, fifths, whole tones, and stranger ladders.
- Enter a redesigned esoteric parlor cabinet and broadsheet with engraved serif type, foxed parchment, oxblood and tarnished brass trim, formal specimen labels, and a framed central apparition vitrine.
- Tap, hold, or drag inside the apparition vitrine to trigger synthesized glass and membrane percussion, drive a harmonic phase shift, and morph and tug the creature's geometry in real time.
- Accompany every creature with a 12-step ternary percussion cadence generated by a 1998 Malbolge virtual machine (`src/beat.mal`), a 12-cell walking sub-bass and acid-organ ostinato generated by a 1993 Brainfuck tape interpreter (`src/bass.bf`), a 12-cell 3-voice polyphonic chord organ generated by a 1993 Befunge 2D torus interpreter (`src/harmony.bfg`), a 12-step Just Intonation prime-ratio chime and codel chorus engine generated by 2001 Piet (`src/pad.piet`) and 1987 FRACTRAN (`src/chimes.frac`), and a 12-scene 3-formant vowel choir generated by a 2001 Shakespeare Programming Language drama (`src/chant.spl`), complete with live step editing, engage/silence toggles, mutation controls, and a six-language Parlor Bandstand console.
- Harmonize all six esoteric interpreters through an Euler-Tonnetz & Euclidean harmonic conductor (`src/conductor.mjs`) using Leonhard Euler's 1739 *Gradus Suavitatis* consonance sieve, Neo-Riemannian *Tonnetz* (`P`, `L`, `R`) parsimonious triads, and Bjorklund Euclidean rhythm hocketing $E(k, 12)$.
- Explore ten visual families, eight musical scales, six rhythmic grammars, wider color and size ranges, and more than 220,000 possible ceremonial names.
- Meet creatures with eight eye silhouettes, eight colored iris treatments, eight pupil geometries, six eye arrangements, varied sizes, and independent gaze behavior.
- Watch eight bounded kinetic cores—including a rotating projected tesseract—move inside eight independently deforming silhouette grammars.
- Respect reduced-motion preferences while keeping the visual reading available.
- Copy a privacy-preserving `#omen=...` link (`COPY OMEN LINK`) or engrave a 1200×1520 Victorian broadsheet PNG (`ENGRAVE PNG PLATE`) containing the creature portrait, specimen name, confided phrase, hexadecimal seed, and six-language ensemble ledger.
- Inspect the canonical LOLCODE spell, Malbolge beat tape, Brainfuck bass tape, Befunge torus playfield, Piet codel canvas, FRACTRAN prime fractions, and Shakespeare tragedy directly from the application.
- Explore a comprehensive, standalone 3x technical manual (`manual.html` generated from `docs/manual.json` via `tools/manual.py`) documenting What, How, and Why for all twenty core components, visual grammars, esoteric engines, and harmonic conduction layers.
- Punch chords into the Fun Machine's 12-step loop sequencer (`#fun-sequence-grid`) on the fly or by targeting steps; punched chords re-conduct the band and play in live audio and WAV and stem exports.

