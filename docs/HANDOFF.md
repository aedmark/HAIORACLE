# Session Handoff

Read this first when resuming work. Protocol: [AGENTS.md](../AGENTS.md). Plan: [ROADMAP.md](../ROADMAP.md). Architecture: [ARCHITECTURE.md](ARCHITECTURE.md). Decisions: [DECISIONS.md](DECISIONS.md). Tests: [TESTING.md](TESTING.md).

## Current state

_Last updated: 2026-10-25, session 80, on `main`._

- P5-28–P5-30: 22 Inform 7 genres, rhythmic feel, THE CREATURE'S OWN rulebook, variations, and creature voices (D-040, D-041, D-043, D-044, D-060).
- D-045–D-065: Console UX (D-056), Wave 3 rhythms (D-060), Studio Companion (P5-32: D-061–D-064), Neocities release (D-065, Q-001).
- D-066–D-071: v1.0.0 Release, App Icon, Module decomposition (P4-03, D-067), GitHub Actions CI (P4-04), MIDI Clock 24-PPQ Sync (P5-33, D-068), Esoteric Step Inspector (P5-34, D-069), Naturalist's Herbarium (P5-35, D-070), and Kapellmeister's Manuscript (P5-36, D-071), packaged into `v1.1.0`.
- Phase 7: Hardware & Firmware Integration (M-VAVE FM-1) established in `ROADMAP.md` (P7-01 through P7-05, D-072). P7-01 complete: M-VAVE FM-1 hardware controller profile. P7-02 complete: C core port in `firmware-c/` verified against golden fixtures.
- Next: P7-03 (FM-1 native audio synthesis engine mapping on `m-vave/fm1_open` / Felucca SDK).

**Where things stand:** P1–P6, P7-01, and P7-02 are fully implemented, verified, and complete. Semantic version 1.1.0. Phase 7 active for M-VAVE FM-1 pocket synthesizer companion mode and standalone firmware. Zero-dependency web app ready for Neocities deployment (`tools/stage_neocities.py`, D-065) and official multi-platform desktop release (Linux, Windows, macOS) via `.github/workflows/release.yml` and `tools/build_desktop.sh` (D-064, D-066).

**Verified** (2026-10-25, session 80, local Linux environment)

| Suite | Result |
| --- | --- |
| `node --test tests/*.test.mjs` | **224/224 behavioral and structural checks passed** |
| `python3 tools/check_docs.py` | **0 errors, 0 warnings across 14 documents** |
| `python3 tools/manual.py check docs/manual.json` | **6 sections, 39 entries, 0 errors, 0 warnings** |

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
- The Kapellmeister music-theory console (`#kapellmeister-engine`) provides 22 selectable rulebooks across five menu families plus THE CREATURE'S OWN rulebook, an Euler consonance strictness slider ($3\dots 14$), live harmonic step/chord/vector/Euler score telemetry, and an animated 4-region SVG Tonnetz compass (P5-15, P5-29, D-019, D-041, D-060).
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

- No public hosting or domain exists.
- Session presets have not been checked by hand in a real browser private window; blocked-storage and `QuotaExceededError` mid-write eviction/fallback paths are verified via simulated storage adapters (`tests/session.test.mjs`, P4-05).
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

1. Deploy staged bundle (`dist-neocities/`) to Neocities via web dashboard or `neocities-cli` (P6-01, D-065).
2. Hands-on review of the four-wing layout (D-027) in Safari and Firefox.
3. Tag v1.0.0 semantic release.

## Open questions

- None (Q-001 answered by D-065).

## Session log

### Session 79 (2026-10-25): Cross-Platform Application Icon & Official v1.0.0 Release (D-066, P6-01)

**Contributor:** Antigravity with maintainer direction

**Goal:** Create a cross-platform application icon across Linux, Windows, and macOS capturing the Victorian esoteric parlor aesthetic, bump project version to 1.0.0, and configure automated multi-platform desktop release builds.

**Done:** All parts implemented and verified under D-066. P6-01 marked complete. 198/198 tests pass.

**Changed:**
1. Cross-Platform Application Icon (`src-tauri/icons/`):
   - Designed 1024×1024 master icon (`src-tauri/icons/master-icon.png`): centered antique brass-rimmed bell jar vitrine mounted on turned mahogany, enclosing a glowing bioluminescent organism with emerald/amethyst tendrils, flanked by celestial crescent moon (☽) and radiant sun (☉) sigils on parlor velvet.
   - Generated native platform icons using `@tauri-apps/cli icon`: `icon.ico` (Windows), `icon.icns` (macOS), `icon.png` (512×512 Linux), `128x128.png`, `32x32.png`.
   - Registered Linux desktop application entry `~/.local/share/applications/whimsy-machine.desktop` and icon `~/.local/share/icons/whimsy-machine.png`.
2. Version Bump to v1.0.0 & Canonical Branding:
   - Synchronized product branding to "The Whimsy Machine" (`whimsy-machine`, identifier `com.aedmark.whimsy-machine`) across `src-tauri/tauri.conf.json`, `src-tauri/Cargo.toml`, `AGENTS.md`, `README.md`, `LICENSE`, `docs/ARCHITECTURE.md`, `docs/SECURITY.md`, `docs/manual.json`, and desktop manifests.
   - Cleared legacy PyCharm IDE clutter: purged 8.1 GB of stale `src-tauri/target/` build files via `cargo clean`, added root `.gitignore` rules for desktop build outputs (`src-tauri/target/`, `src-tauri/dist/`, `src-tauri/gen/`), updated `.idea/whimsy-machine.iml` with explicit `<excludeFolder>` paths, and configured `.idea/.name` to display "The Whimsy Machine".
   - Bumped version to `1.0.0` in `src-tauri/Cargo.toml`, `src-tauri/tauri.conf.json`, `docs/manual.json`.
   - Rebuilt `manual.html` via `python3 tools/manual.py build --output manual.html docs/manual.json`.
   - Restamped asset version (`tools/stamp_assets.mjs`).
   - Updated `docs/CHANGELOG.md` converting `Unreleased` into `[1.0.0] - 2026-10-25`.
   - Marked Phase 6 roadmap item P6-01 complete in `ROADMAP.md`.
3. Release Packaging & GitHub Actions CI:
   - Updated `tools/build_desktop.sh` to package portable Linux standalone tarball (`dist-desktop/whimsy-machine-v1.0.0-linux-x86_64.tar.gz`, 3.5 MB) with executable, desktop entry, icon, and install script, and support `--bundle` for `.deb`, `.rpm`, `.AppImage`.
   - Created `.github/workflows/release.yml` using `tauri-apps/tauri-action@v0` matrix across Ubuntu 22.04 (.deb, .AppImage), Windows (.msi, .exe), and macOS (Universal .dmg) on tag push or manual workflow dispatch.
   - Added `dist-desktop/` to `.gitignore`.
   - Logged D-066 in `docs/DECISIONS.md`.
   - Archived Session 69 to `docs/archive/sessions.md`.
4. Section Loop Instrumentation & Deterministic Genre Progressions (`src/accompaniment.mjs`, `src/looper.mjs`, `src/app.mjs`):
   - Overhauled `buildFunSectionProgression` and `buildPerformance` in `src/accompaniment.mjs` so `intro`, `bridge`, and `outro` progressions derive directly from the active rulebook genre's own Inform 7 progression tables and spines (`buildFunProgression`, `book.spine`, `THE CREATURE'S OWN`, and Tonnetz walks) and deterministically vary per creature (`varyProgression`, `score` harmony fields, and `melodyFor(score)`).
   - Added `setSectionVoices` and `transposeSectionLoops` in `src/looper.mjs` and wired them in `src/app.mjs` so selecting a new Fun Machine voice chip, changing Kapellmeister genre/strictness/variation, or summoning a new creature immediately updates recorded `intro`, `bridge`, and `outro` section loops as well as live playback.

**Verified:**
- `./tools/build_desktop.sh` built standalone binary and portable tarball in 7.2s.
- `npx @tauri-apps/cli build` verified local packaging of `.deb`, `.rpm`, and `.AppImage`.
- `node --test tests/*.test.mjs`: 198/198 tests passing.
- `python3 tools/check_docs.py`: 0 errors, 0 warnings across 14 documents.
- `python3 tools/manual.py check docs/manual.json`: 6 sections, 36 entries, 0 errors, 0 warnings.

**Next session should start with:** Push release tag `v1.0.0` and deploy staged bundle (`dist-neocities/`) to Neocities.

### Session 78 (2026-10-25): Neocities Static Web Release & Accessibility Completion (D-065, P4-02, P6-01)

**Contributor:** Antigravity with maintainer direction

**Goal:** Verify accessibility completion (P4-02), resolve public hosting selection with Neocities (Q-001, P6-01, D-065), and add dual-extension fallback handling and bundle staging for seamless deployment across free and supporter Neocities tiers.

**Done:** All parts implemented and verified under D-065. P4-02 marked complete. 196/196 tests pass.

**Changed:**
1. Esoteric Spell Fetch Fallback (`src/app.mjs`):
   - Implemented `fetchSource(name)`: attempts `sourceUrl(name)`, and upon 404/403 status (common on free Neocities accounts where non-standard extensions are whitelisted out), seamlessly falls back to `sourceUrl(name + ".txt")`.
   - Restamped asset version (`tools/stamp_assets.mjs`).
2. Neocities Staging Tool (`tools/stage_neocities.py`):
   - Creates a self-contained static release directory (`dist-neocities/`) containing `index.html`, `styles.css`, `manual.html`, and `src/`.
   - Automatically generates `.txt` dual-fallbacks alongside all nine esoteric source files (`oracle.lol.txt`, `beat.mal.txt`, etc.).
   - Added `dist-neocities/` to root `.gitignore`.
3. Roadmap & Decisions:
   - Marked P4-02 complete in `ROADMAP.md` following maintainer accessibility verification.
   - Set P6-01 in progress in `ROADMAP.md` with Neocities hosting.
   - Recorded D-065 in `docs/DECISIONS.md` and answered Q-001.
   - Added `tools/stage_neocities.py` to `AGENTS.md` repository map.
   - Updated `docs/CHANGELOG.md` and `docs/HANDOFF.md`.
   - Archived Session 68 to `docs/archive/sessions.md`.

**Verified:**
- `python3 tools/stage_neocities.py` successfully stages 48 files (1071.7 KB) with 9 fallbacks.
- `node --test tests/*.test.mjs`: 196/196 checks passed.
- `python3 tools/check_docs.py`: 0 errors, 0 warnings across 14 documents.
- `python3 tools/manual.py check docs/manual.json`: 6 sections, 36 entries, 0 errors, 0 warnings.

**Next session should start with:** P6-01 Neocities public deployment and v1.0.0 release.

### Session 77 (2026-10-24): Standalone Desktop Packaging with Tauri v2 (D-064)

**Contributor:** Antigravity with maintainer direction

**Goal:** Package *Edmark's Esoteric Fun Machine* into an isolated, zero-dependency standalone native desktop studio companion for DAW workflows with system Web MIDI and PipeWire/JACK routing (Stage 3 / P5-32, D-064).

**Done:** All parts implemented and verified under D-064. 196/196 tests pass.

**Changed:**
1. Rust & Tauri Toolchain:
   - Configured stable user-space Rust toolchain (Rust 1.99.1).
   - Initialized isolated desktop application shell in `src-tauri/` without npm packages or root `package.json`.
2. Tauri Configuration (`src-tauri/tauri.conf.json`, `src-tauri/Cargo.toml`, `src-tauri/src/main.rs`):
   - Package identifier `com.edmark.esoteric-fun-machine`, title "Edmark's Esoteric Fun Machine".
   - `frontendDist: "dist"` staged automatically by `build.rs` from root web assets (`index.html`, `styles.css`, `manual.html`, `src/`), completely self-contained with no dev server or localhost dependency.
   - Default window dimensions 1200×900 (minimum 380×600), fully resizable.
   - Built against standard system WebKitGTK 4.1 with `tauri-plugin-midi` (bridging WebKitGTK to system ALSA/PipeWire via `midir` and polyfilling `navigator.requestMIDIAccess`).
3. Build Script (`tools/build_desktop.sh`):
   - Created standalone build script compiling `src-tauri/target/release/esoteric-fun-machine` (11 MB standalone executable).
4. Documentation & Roadmap:
   - Marked P5-32 complete in `ROADMAP.md`.
   - Recorded D-064 in `docs/DECISIONS.md`.
   - Added `src-tauri/` and `tools/build_desktop.sh` to repository map in `AGENTS.md`.
   - Updated `docs/CHANGELOG.md` and `docs/HANDOFF.md`.

**Verified:**
- Native release binary built and verified on CachyOS / Wayland with zero launch errors.
- `node --test tests/*.test.mjs`: 196/196 checks passed.
- `python3 tools/check_docs.py`: 0 errors, 0 warnings across 14 documents.
- `python3 tools/manual.py check docs/manual.json`: 6 sections, 36 entries, 0 errors, 0 warnings.
- Core zero-dependency web architecture remains 100% untouched.

**Next session should start with:** P6-01 (choose public hosting and domain) or user hands-on DAW production with the standalone companion.

### Session 76 (2026-10-24): Consonant Pad Voicing & Minor-Second Extension Suppression (D-063)

**Contributor:** Antigravity with maintainer direction

**Goal:** Eliminate minor-second chord cluster beating and dissonant clashes in Phrygian and altered modal passages identified in musician testing (Option A / D-063).

**Done:** All parts implemented and verified under D-063. 196/196 tests pass.

**Changed:**
1. `src/accompaniment.mjs`:
   - Updated `soundingPitchClasses(chord)` to exclude minor-second clashes against the root (`((pc - rootPc + 12) % 12) === 1`), such as Phrygian flat-second and alt-dominant flat-ninth extensions.
   - `padVoicing()` and `arpeggioNotes()` now voice clean, resonant triads and seventh shells (e.g. A Phrygian voices A - C♯ - E, omitting the clashing B♭ in the pad).
   - In `buildPerformance()`, resolved sustained 4-step lead notes with minor-second root clashes down to the nearest chord tone via `nearestChordTone(leadPitch, chord)`.
   - `nearestChordTone()` operates against clean `soundingPitchClasses(chord)`.
2. `tests/accompaniment.test.mjs`:
   - Added unit test asserting that `soundingPitchClasses` and `padVoicing` omit minor-second extensions for both `phrygian` and `dom7alt`.
3. Assets & Documentation:
   - Stamped `ASSET_VERSION` to `cab1d7a1d929`.
   - Recorded D-063 in `docs/DECISIONS.md`.
   - Updated `docs/CHANGELOG.md`.

**Verified:**
- `node --test tests/*.test.mjs`: 196/196 checks passed.
- `python3 tools/check_docs.py`: 0 errors, 0 warnings across 14 documents.
- `python3 tools/manual.py check docs/manual.json`: 6 sections, 36 entries, 0 errors, 0 warnings.

### Session 75 (2026-10-24): Clean DAW MIDI Export, ALSA Loopback Reflection Suppression & Local Audio Mute (D-062)

**Contributor:** Antigravity with maintainer direction

**Goal:** Implement musician feedback on MIDI exports (suppressing VST patch overwriting Program Changes, timeline marker clutter, and channel flattening), resolve ALSA `Midi Through Port-0` loopback reflection dissonances, and add a local control audio mute toggle.

**Done:** All parts implemented and verified under D-062. 195/195 tests pass.

**Changed:**
1. `src/midi.mjs`:
   - Added `stripPrograms`, `stripMarkers`, and `flattenChannels` flags to `buildMidiFile()`.
   - When `stripPrograms` is true, omits `0xC0` Program Change bytes at tick 0, protecting VST synth presets from being overwritten.
   - When `stripMarkers` is true, omits `0x06` Marker meta events on the conductor track, preventing DAWs from auto-warping or stretching imported sessions.
   - When `flattenChannels` is true, remaps track events to Channel 1 (byte 0) for instant response on single-channel VST instruments.
2. `src/app.mjs`:
   - Registered `broadcastEchoFilter` ring buffer: outbound broadcast note keys `(ch << 8) | pitch` are tracked with timestamps, and incoming echo reflections within 300 ms on ALSA `Midi Through Port-0` loopback are discarded.
   - Added `inboundMidiChannel` filter, defaulting to `1` (Manual Organ) and configurable via `#studio-midi-ch`.
   - Added `setLocalControl(enabled)` and `#studio-local-control-btn`: zeroes browser master audio gain (`0.0001`) when muted while generative MIDI broadcast and scheduler operations continue at full rate.
   - Added `#export-midi-format` dropdown with `CLEAN DAW` (default), `DAW WITH CHORD MARKERS`, and `FULL ARCHIVE`.
3. `index.html` & `styles.css`:
   - Added `#export-midi-format` select control to the Export Desk.
   - Added `#studio-local-control-btn` to the Studio Deck.
4. `tests/export.test.mjs`:
   - Added comprehensive unit test asserting program change stripping, marker stripping, channel flattening, and combined Clean DAW export mode.
5. Assets & Documentation:
   - Stamped `ASSET_VERSION` to `97ce639b8f7b`.
   - Recorded D-062 in `docs/DECISIONS.md`.
   - Updated `docs/CHANGELOG.md`.

**Verified:**
- `node --test tests/*.test.mjs`: 195/195 checks passed.
- `python3 tools/check_docs.py`: 0 errors, 0 warnings across 14 documents.
- `python3 tools/manual.py check docs/manual.json`: 6 sections, 36 entries, 0 errors, 0 warnings.

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


