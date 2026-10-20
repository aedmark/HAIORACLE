# Session Handoff

Read this first when resuming work. Protocol: [AGENTS.md](../AGENTS.md). Plan: [ROADMAP.md](../ROADMAP.md). Architecture: [ARCHITECTURE.md](ARCHITECTURE.md). Decisions: [DECISIONS.md](DECISIONS.md). Tests: [TESTING.md](TESTING.md).

## Current state

_Last updated: 2026-10-19, session 20, on `main`: eight-channel parlor mixing console with faders, panning, mute/solo, and VU meters built into the shared ensemble graph (P5-19, D-024)._

**Where things stand:** P1, P2, P3-01 through P3-03, P4-01, P5-01 through P5-19 are implemented and verified. The DAW phase continues with P5-21 (stems and MIDI) and P5-20 (sessions, which needs a storage decision first). A phrase deterministically drives a LOLCODE-generated score, one of twelve named repeating melody motifs, one of eight Malbolge ternary beat cadences, one of eight Brainfuck walking bass grooves, one of eight Befunge-93 2D mirror chord organs, one of eight Piet/FRACTRAN Just Intonation chime and codel chorus engines, one of eight Shakespeare Programming Language 3-formant vowel choir dramas, one of ten Canvas body families, one of eight bounded silhouette-flux grammars, one of eight internal kinetic systems, expressive composed eye anatomy, a procedural branching mycelial network with eight generative sporophore fruiting bodies (Agaric Cap, Bracket Conk, Coral Clavaria, Bioluminescent Bonnet, Cup Peziza, Morel Honeycomb, Globular Puffball, Hyphal Hydra) engraved with Ernst Haeckel anatomical lithography, an antique turned-wood mahogany pedestal, mossy peat/driftwood substrate bed, 46 dew condensation droplets clinging to the vitrine bell jar, bio-acoustic audio sonification (micro-voltage action potentials, guttation droplet chimes, and tactile ballistospore puffs), drifting ballistospores with vitrine tap bursts, a multi-template ceremonial name, and a continuously looping Web Audio composition with live master volume and tempo controls. An Euler-Tonnetz & Euclidean harmonic conductor (`src/conductor.mjs`, P5-14) harmonizes all six esoteric interpreters through Neo-Riemannian *Tonnetz* (`P`, `L`, `R`) parsimonious voice-leading, Leonhard Euler's 1739 *Gradus Suavitatis* consonance sieve, and Bjorklund Euclidean rhythm hockets $E(k, 12)$. The Kapellmeister music-theory and genre console (`#kapellmeister-engine`, P5-15, D-019) allows confidants to switch between six historical and theoretical rulebooks (Victorian Neo-Riemannian Tonnetz, 12-Bar Delta Blues, Smoky Parlor Jazz, Palestrina Modal Counterpoint, Mystic Drone, Raw Esoteric Chaos) with a live harmonic dashboard and animated SVG Tonnetz compass. An antique parlor room acoustic space (`#parlor-acoustics-engine`, D-022) immerses the ensemble in tactile synthesized Edison wax-cylinder phonograph surface noise (filtered mechanical brown noise, 78 RPM eccentric wobble, rich stylus micro-crackle and shellac dust pops), a 1.6-second wood-and-velvet chamber convolution impulse response (`ConvolverNode`) with alternating-phase reflection taps, DC-blocking highpass filtering, and peak spectral gain normalization ($0.75$), with a dedicated $180\,\text{Hz}$ highpass send filter (`parlorReverbFilter`) protecting the chamber from fog-horn runaway. The Esoteric Fun Machine (`#fun-machine-engine`, P5-17, D-020, D-022) provides real-time play-along chord organ accompaniment via an interactive 13-key manual (`C..C'`) and physical keyboard mapping (`[A..K]`), one-finger auto-chord harmonization with 7 quality chips, 12-step synchronized loop chord progression changes over the 4 harmonic regions ($3\times\text{stepDuration}$ sustained chords at $t = 0, 3, 6, 9$), singing step melody notes on every tempo beat, standalone auditioning when idle, and a 12-step punch-in loop sequencer matrix (`#fun-sequence-grid`). The experience lives inside a bespoke, esoteric Victorian parlor cabinet and broadsheet with an interactive bell-jar central apparition vitrine (Plate I), a Malbolge 12-step ternary beat automaton (Plate II), a Brainfuck 12-cell walking tape bassline (Plate III), a Befunge-93 2D mirror chord organ (Plate IV), a Piet/FRACTRAN 12-step prime-ratio chime and codel chorus matrix (Plate V), a Shakespeare 12-scene formant vowel choir (Plate VI), an Esoteric Fun Machine organ manual and sequencer matrix (Plate VII), a Parlor Bandstand six-language ensemble console, client-only `#omen=...` URL sharing (P3-01), 1200×1520 broadsheet PNG plate engraving (P3-02), and client-side uncompressed 16-bit 44.1 kHz WAV loop export (`#export-wav`, P3-03). Remaining open work covers assistive-technology checks (P4-02) and public hosting (P6-01).

**Verified** (2026-10-19, session 20, local Linux environment)

| Suite | Result |
| --- | --- |
| `node --test tests/*.test.mjs` | **56/56 behavioral and structural checks passed** |
| `python3 tools/check_docs.py` | **0 errors, 0 warnings across 14 documents** |
| `python3 tools/manual.py check docs/manual.json` | **6 sections, 30 entries, 0 errors, 0 warnings** |

**What works**


- The static page accepts a phrase and offers surprise, replay, and mute controls (P2-03).
- The phrase becomes a stable unsigned seed under the D-003 normalization contract.
- A purpose-built interpreter executes `src/oracle.lol` and rejects unsupported syntax with line numbers (P1-02, D-002).
- The spell emits validated audio, visual, and naming parameters (P2-01).
- Canvas and Web Audio share the same immutable score (P2-02, D-004).
- Audio loops continuously until mute, restart, replacement, or page close (D-005).
- The expanded grammar covers twelve-note phrases, eight scales, six rhythms and voices, ten shapes, broader size and color ranges, and six name templates (P5-01, D-005).
- Eye silhouette, iris treatment and color, pupil shape, layout, size, and gaze vary deterministically (P5-02, D-006).
- Body boundaries continuously deform through eight clamped flux grammars while eight seed-selected kinetic systems move independently inside them (P5-03, D-007).
- Canvas geometry does not resize on audio beats; sound and image remain paired through their shared immutable score (D-008).
- The large exterior glow is isolated to the body fill; kinetic lines, rings, and eyes no longer inherit its expensive per-primitive blur.
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
- The Kapellmeister music-theory console (`#kapellmeister-engine`) provides six selectable rulebooks (`Victorian Tonnetz`, `12-Bar Blues`, `Smoky Jazz`, `Palestrina Counterpoint`, `Mystic Drone`, `Raw Chaos`), an Euler consonance strictness slider ($3\dots 14$), live harmonic step/chord/vector/Euler score telemetry, and an animated 4-region SVG Tonnetz compass (P5-15, D-019).
- The Antique Parlor Room Acoustic Space (`#parlor-acoustics-engine`) synthesizes authentic 1890s Edison wax-cylinder surface noise (horn resonance, Poisson dust pops, 78 RPM groove rumble), a 1.6-second wood-and-velvet chamber convolution reverb (`ConvolverNode`), and mechanical brass clockwork escapement ticks on quarter-beats, active in both live playback and offline 16-bit WAV rendering (P5-15, D-019).
- Play along in real time using the Esoteric Fun Machine (`#fun-machine-engine`), an authentic 1970s Baldwin-inspired auto-chord organ console featuring an interactive 13-key manual (`C..C'`) and physical keyboard mapping (`[A..K]`). In One-Finger Auto-Chord mode, striking a key fires a dual-oscillator reed-organ voice with 5.5 Hz parlor vibrato and triggers matching accompaniment bursts across the ensemble, with quick chord quality chips (`AUTO-GENRE`, `MAJOR`, `MINOR`, `DOM 7TH`, `MAJ 9TH`, `DIMINISHED`, `OPEN 5TH`). A 12-step punch-in loop sequencer matrix (`#fun-sequence-grid`) lets users punch chords into the loop on the fly or target steps, re-conducting the entire ensemble and rendering custom progressions into live playback and offline 16-bit WAV downloads (P5-17, D-020).
- Summoned creatures sync their phrase to `#omen=...` URL fragments without sending query parameters over HTTP, can be copied via `COPY OMEN LINK` (`#share-link`), and can be exported as a 1200×1520 engraved broadsheet PNG (`#export-png`) containing the live creature capture, specimen name, confided phrase, seed, and six-language ensemble ledger (P3-01, P3-02, D-015).
- A comprehensive 3x technical manual (`docs/manual.json`, `manual.html`, `tools/manual.py`) documents What, How, and Why across all 28 major systems, interpreters, and algorithms with 0 warnings.
- Full interactive and audiovisual functionality verified in live browser review (P4-01).
- The master transport (`#transport-deck`) plays, pauses at the last heard step, and stops-and-rewinds the loop; `Space` toggles play/pause and `Esc` stops from anywhere. Live playback and WAV export build one shared graph (`src/ensemble.mjs`), so exports render the routing the listener hears (P5-18, D-023).
- The parlor mixing console (`#mixer-engine`) gives all eight voices a fader, pan, mute, solo, and live post-fader VU meter. Plate ENGAGE/SILENCE switches are the console's mutes, and WAV exports follow the mix. Default voicing trims lift the lead +6 dB and the choir +12 dB with faders still at unity, faders reach a further +12 dB, the choir bypasses the creature filter, and bandpass creatures blend a dry lead tap, so neither voice is buried by narrow bandpass creatures any more (P5-19, D-024).
- Runtime assets are local and dependency-free (D-001).

**Not verified**

- Dedicated assistive-technology and screen-reader testing remains P4-02 work.
- No public hosting or domain exists.
- Nobody has listened to the mixer yet: hard-pan feel, the fader taper, and meter ballistics were checked by numbers, not by ear.
- Nobody has listened to the transport changes yet. Pause/resume, the output fade, and WAV parity were checked structurally and in a live browser by state readouts and PCM statistics, not by ear.

**Gotchas**

- Serve the directory over HTTP. A direct `file:` URL cannot fetch `src/oracle.lol`, `src/beat.mal`, `src/bass.bf`, `src/harmony.bfg`, `src/pad.piet`, `src/chimes.frac`, or `src/chant.spl`.
- The interpreter deliberately implements a subset. Read D-002 before extending the spell.
- Changes to hash, normalization, formula constants, scale, or name tables can break phrase identity. D-005 through D-007, D-013, D-014, and D-016 record intentional pre-release compatibility breaks.

## Next steps

1. Optional: on bandpass creatures (voices 1 and 5) the organ, chimes, and mycelium remain heavily filtered (pigeons organ −73.9 dB solo). The lead and choir are fixed (D-024 points 7–8).
2. P5-21 stems: render one solo pass per channel through the shared graph using `channelSettings()` with a single soloed channel, plus a ninth parlor-room stem. Note that rhythm patterns 2 and 3 have five cells, so a 12-step WAV does not tile seamlessly for those creatures (observed while building P5-18; the live loop is unaffected).
3. P5-20 sessions need a decision first: browser preset storage contradicts the "no local storage" statement in ARCHITECTURE.md and SECURITY.md.
4. Complete P4-02 with keyboard, reduced-motion, contrast, and screen-reader checks.
5. Choose public hosting and domain (Q-001 / P6-01).

## Open questions

- Q-001 blocks P6-01: choose public hosting and domain.

## Session log

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

Older sessions: [archive/sessions.md](archive/sessions.md).

