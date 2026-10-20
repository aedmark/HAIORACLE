# Session Handoff

Read this first when resuming work. Protocol: [AGENTS.md](../AGENTS.md). Plan: [ROADMAP.md](../ROADMAP.md). Architecture: [ARCHITECTURE.md](ARCHITECTURE.md). Decisions: [DECISIONS.md](DECISIONS.md). Tests: [TESTING.md](TESTING.md).

## Current state

_Last updated: 2026-10-20, session 25, on `main`: the Fun Machine is reworked into a one-finger accompanist the band follows (D-029); session 24 added the INTERCAL 1972 Grand Ensemble Conductor (`src/conductor.i`, `src/intercal.mjs`) overcomes the continuous wall of sound with dynamic arrangement breathing across Exposition, Antiphony, Tutti, and Breakdown, and the Esoteric Fun Machine is overhauled into a warm, lush analog synth pad lead with real-time ensemble accompaniment modulation (P5-22, D-028)._

**Where things stand:** P1, P2, P3-01 through P3-03, P4-01, P5-01 through P5-22 are implemented and verified. The ensemble features an INTERCAL 1972 Grand Conductor (`src/conductor.i`, `src/intercal.mjs`, P5-22, D-028) that overcomes the "wall of sound" by executing a canonical 27-statement INTERCAL score with 22.2% politeness checking (ICL079/ICL099), sectional orchestration via `PLEASE IGNORE` and `PLEASE REMEMBER` across four regions (Exposition groove, Antiphonal conversation, Tutti climax, Breakdown), and `COME FROM (60)` turnaround cadence interception at step 11. The Esoteric Fun Machine (`#fun-machine-engine`, P5-17, P5-22, D-029) is a one-finger accompanist: a held key plays a SWELL, ARPEGGIO, or PROGRESSION on the band's step grid through a voice-led stereo pad, a soft arpeggio pluck, and a gliding lead, while the band is re-conducted onto that chord in the correct key and the LOLCODE lead and drones step back by 10 dB. A master transport with `Space`/`Esc` (P5-18), an eight-channel mixer with VU meters in a graph shared by live and offline audio (P5-19), nine-stem ZIP and Type 1 MIDI export (P5-21), and a Session Ledger with on-device presets and validated `.fun` files (P5-20) complete the workstation wings.

**Verified** (2026-10-20, session 24, local Linux environment)

| Suite | Result |
| --- | --- |
| `node --test tests/*.test.mjs` | **87/87 behavioral and structural checks passed** |
| `python3 tools/check_docs.py` | **0 errors, 0 warnings across 14 documents** |
| `python3 tools/manual.py check docs/manual.json` | **6 sections, 33 entries, 0 errors, 0 warnings** |

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
- The Fun Machine accompanist (`#fun-machine-engine`, D-029): hold a key on the 13-key manual or `[A..K]` and choose SWELL, ARPEGGIO, or PROGRESSION; the pad, arpeggio, and lead play in the band's rhythm, the band follows the chord, and the LOLCODE lead ducks. Punch-in recording and the 12-step sequencer write chords that play as pads live and in exports.
- Summoned creatures sync their phrase to `#omen=...` URL fragments without sending query parameters over HTTP, can be copied via `COPY OMEN LINK` (`#share-link`), and can be exported as a 1200×1520 engraved broadsheet PNG (`#export-png`) containing the live creature capture, specimen name, confided phrase, seed, and six-language ensemble ledger (P3-01, P3-02, D-015).
- A comprehensive 3x technical manual (`docs/manual.json`, `manual.html`, `tools/manual.py`) documents What, How, and Why across all 28 major systems, interpreters, and algorithms with 0 warnings.
- Full interactive and audiovisual functionality verified in live browser review (P4-01).
- The master transport (`#transport-deck`) plays, pauses at the last heard step, and stops-and-rewinds the loop; `Space` toggles play/pause and `Esc` stops from anywhere. Live playback and WAV export build one shared graph (`src/ensemble.mjs`), so exports render the routing the listener hears (P5-18, D-023).
- The Session Ledger (`#session-engine`) saves the whole apparatus as named presets in this browser's `localStorage` or as portable `.fun` files, and restores it exactly; files and stored presets pass a strict validator first (P5-20, D-026).
- `EXPORT 9 STEMS (ZIP)` downloads eight aligned channel stems, a parlor-room stem, and a README; `WRITE MIDI SCORE` downloads a Type 1 MIDI file with a tempo track and seven named parts captured from the live schedulers (P5-21, D-025).
- The parlor mixing console (`#mixer-engine`) gives all eight voices a fader, pan, mute, solo, and live post-fader VU meter. Plate ENGAGE/SILENCE switches are the console's mutes, and WAV exports follow the mix. Default voicing trims lift the lead +6 dB and the choir +12 dB with faders still at unity, faders reach a further +12 dB, the choir bypasses the creature filter, and bandpass creatures blend a dry lead tap, so neither voice is buried by narrow bandpass creatures any more (P5-19, D-024).
- Below the vitrine and the reading strip (name and score card only), the page is a four-wing workstation (D-027): **Perform** (transport rail with restart, volume, and tempo; Fun Machine; Kapellmeister), **Mix** (Bandstand, console, parlor room), **Keep** (Session Ledger; export desk with WAV, stems, MIDI, PNG, and omen link), and **The Band** (Plates II–VI). Tab order follows the same sequence, and nothing overflows at 320, 375, 768, or 1100 px.
- Runtime assets are local and dependency-free (D-001).

**Not verified**

- Dedicated assistive-technology and screen-reader testing remains P4-02 work.
- No public hosting or domain exists.
- Session presets have not been checked in a real private window or against a full storage quota. The blocked-storage path was simulated by making `localStorage` throw.
- No DAW import has been tried: stems and MIDI were validated by independent parsers (Python `zipfile`, `unzip -t`, an in-page SMF reader), not by opening them in a DAW.
- Nobody has listened to the mixer yet: hard-pan feel, the fader taper, and meter ballistics were checked by numbers, not by ear.
- The four-wing layout was checked in the built-in browser by measurement and screenshots, not by the maintainer's own hands-on review, and not in Safari or Firefox.
- Nobody has listened to the transport changes yet. Pause/resume, the output fade, and WAV parity were checked structurally and in a live browser by state readouts and PCM statistics, not by ear.

**Gotchas**

- Serve the directory over HTTP. A direct `file:` URL cannot fetch `src/oracle.lol`, `src/beat.mal`, `src/bass.bf`, `src/harmony.bfg`, `src/pad.piet`, `src/chimes.frac`, or `src/chant.spl`.
- The interpreter deliberately implements a subset. Read D-002 before extending the spell.
- Changes to hash, normalization, formula constants, scale, or name tables can break phrase identity. D-005 through D-007, D-013, D-014, and D-016 record intentional pre-release compatibility breaks.

## Next steps

1. Listening pass on the Fun Machine accompanist (D-029): pad warmth and level against the band, arpeggio density at fast tempos, the lead line's glide, and whether a 10 dB lead duck is the right amount.
2. Optional: on bandpass creatures (voices 1 and 5) the organ, chimes, and mycelium remain heavily filtered (pigeons organ −73.9 dB solo). The lead and choir are fixed (D-024 points 7–8).
3. Exports render one 12-step loop, but rhythm patterns 2 and 3 have five cells, so their WAV, stems, and MIDI do not tile seamlessly (the live loop is unaffected). A 60-step render, or rounding those patterns to 12, would fix it; either is a determinism-adjacent choice for the maintainer.
4. Hands-on review of the four-wing layout (D-027) in Safari and Firefox; the maintainer approved it from the Chromium review. A sticky transport rail was deferred; it needs the cabinet's `overflow: hidden` changed to `overflow: clip`.
5. Complete P4-02 with keyboard, reduced-motion, contrast, and screen-reader checks.
6. Choose public hosting and domain (Q-001 / P6-01).

## Open questions

- Q-001 blocks P6-01: choose public hosting and domain.

## Session log

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

Older sessions: [archive/sessions.md](archive/sessions.md).
