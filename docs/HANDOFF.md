# Session Handoff

Read this first when resuming work. Protocol: [AGENTS.md](../AGENTS.md). Plan: [ROADMAP.md](../ROADMAP.md). Architecture: [ARCHITECTURE.md](ARCHITECTURE.md). Decisions: [DECISIONS.md](DECISIONS.md). Tests: [TESTING.md](TESTING.md).

## Current state

_Last updated: 2026-10-20, session 39, on `main`: the cabinet starts in discovery, with drawers that open as you play and a switch for the whole cabinet, plus the first P4-02 accessibility fixes (D-037); session 38 shipped Parlor Ragtime._

**Where things stand:** P1, P2, P3-01 through P3-03, P4-01, P5-01 through P5-24 are implemented and verified. The ensemble features an INTERCAL 1972 Grand Conductor (`src/conductor.i`, `src/intercal.mjs`, P5-22, D-028) that overcomes the "wall of sound" by executing a canonical 35-statement INTERCAL score with 22.9% politeness checking (ICL079/ICL099) that reads each creature's arrangement word with `WRITE IN` and chooses its form per phrase with at least five band voices on every step (D-031, D-032), channel registers that the program itself sets across four regions (Exposition groove, Antiphonal conversation, Tutti climax, Breakdown), and `COME FROM (60)` turnaround cadence interception at step 11 (D-030). The transport names the current section, rested console strips light TACET, and MIDI exports carry section markers. The Esoteric Fun Machine (`#fun-machine-engine`, P5-17, P5-22, D-029) is a one-finger accompanist: a held key plays a SWELL, ARPEGGIO, or PROGRESSION on the band's step grid through a voice-led stereo pad, a soft arpeggio pluck, and a gliding lead, while the band is re-conducted onto that chord in the correct key and the LOLCODE lead and drones step back by 10 dB. A master transport with `Space`/`Esc` (P5-18), an eight-channel mixer with VU meters in a graph shared by live and offline audio (P5-19), nine-stem ZIP and Type 1 MIDI export (P5-21), and a Session Ledger with on-device presets and validated `.fun` files (P5-20) complete the workstation wings.

**Verified** (2026-10-20, session 39, local Linux environment)

| Suite | Result |
| --- | --- |
| `node --test tests/*.test.mjs` | **117/117 behavioral and structural checks passed** |
| `python3 tools/check_docs.py` | **0 errors, 0 warnings across 14 documents** |
| `python3 tools/manual.py check docs/manual.json` | **6 sections, 35 entries, 0 errors, 0 warnings** |

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
- Updates load cleanly without a hard reload (D-035): `index.html` builds an import map that stamps every module with `?v=<ASSET_VERSION>` (a hash of `src/`), and sources are fetched with the same stamp. Verified in the built-in browser against plain `python3 -m http.server`: with 28 of 29 files served from heuristic cache, a new export added to `src/ensemble.mjs` and imported by `src/app.mjs`, plus a restamp, loaded on a normal reload with all 29 requests at the new stamp and no console errors.

**Not verified**

- Dedicated assistive-technology and screen-reader testing remains P4-02 work.
- No public hosting or domain exists.
- Session presets have not been checked in a real private window or against a full storage quota. The blocked-storage path was simulated by making `localStorage` throw.
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

1. Listening pass on the Fun Machine accompanist (D-029): pad warmth and level against the band, arpeggio density at fast tempos, the lead line's glide, and whether a 10 dB lead duck is the right amount.
2. Optional: on bandpass creatures (voices 1 and 5) the organ, chimes, and mycelium remain heavily filtered (pigeons organ −73.9 dB solo). The lead and choir are fixed (D-024 points 7–8).
3. Exports render one 12-step loop, but rhythm patterns 2 and 3 have five cells, so their WAV, stems, and MIDI do not tile seamlessly (the live loop is unaffected). A 60-step render, or rounding those patterns to 12, would fix it; either is a determinism-adjacent choice for the maintainer.
4. Hands-on review of the four-wing layout (D-027) in Safari and Firefox; the maintainer approved it from the Chromium review. A sticky transport rail was deferred; it needs the cabinet's `overflow: hidden` changed to `overflow: clip`.
5. Complete P4-02 with keyboard, reduced-motion, contrast, and screen-reader checks.
6. Choose public hosting and domain (Q-001 / P6-01). Serve `index.html` with `Cache-Control: no-cache` there (D-035); stamped `src/` URLs can be cached freely.

## Open questions

- Q-001 blocks P6-01: choose public hosting and domain.

## Session log

### Session 39: 2026-10-20: discovery drawers and the accessibility audit

**Contributor:** Claude Code with maintainer direction

**Goal:** Start P4-02. The maintainer asked that the cabinet not overwhelm people: "more like a discovery, and then maybe an advanced mode where it's all laid bare like equipment cabinet." They chose drawers that unlock as you play, remembered on this device. (The maintainer also listened to Parlor Ragtime from session 38: "its beautiful".)

**Done:** D-037; P4-02 progress (real assistive-technology pass still open).

**Audit found:** 172 tab stops (top 14, Perform 38, Mix 41, Keep 9, Band 70); `#transport-position` (an `<output>`, so implicitly polite) and the Kapellmeister readout (`aria-live="polite"`) re-announced every loop step; 43 rules set text below 0.6rem, the smallest rendering at 6.7 px; dimmed bone text at alpha 0.42/0.5/0.52 fell below 4.5:1; reduced motion was read once at load. Every control already had an accessible name, and the Fun Machine letter keys ignore typing fields. Automatic contrast detection is unreliable on the parchment and wood textures, so contrast was computed per colour token instead.

**Changed:**
1. `src/cabinet.mjs` (new): `DRAWERS` (Kapellmeister, Mix, Keep, The Band; each with a target, invitation, and trigger), `cabinetReduce()`, `parseCabinetState()`/`serializeCabinetState()`, `isDrawerOpen()`.
2. `src/app.mjs`: `buildDrawers()` moves each target's contents into a `drawer-body` behind a `drawer-bar` with a toggle (`aria-expanded`, `aria-controls`). It also adds the cabinet switch, announcements via `#cabinet-announcer`, guarded storage, and four triggers: a held key, a completed loop, changes inside the Kapellmeister/Mix/Band/sequencer/style chips, and mute/solo or bandstand clicks (or four loops).
3. `index.html`: `#cabinet-switch` (hidden until the script runs) with the announcer; `cabinet.mjs` in the import map; `#transport-position` set to `aria-live="off"`; the Kapellmeister readout is no longer a live region.
4. `styles.css`: drawer and switch styles, slim sealed nameplates, an opening animation only without reduced motion, `select:focus-visible`, a `.visually-hidden` utility, a 0.6rem text floor, dimmed text raised to alpha 0.62, and content-box sizing for the two telemetry boxes (border-box had left the Fun Machine status room for only about 1.5 lines).
5. Tests: `tests/cabinet.test.mjs`; static checks for the triggers, guarded cabinet storage, the switch, quiet readouts, the type floor, and the contrast floor.
6. Docs: D-037, SECURITY and ARCHITECTURE (a second accepted `localStorage` store), README, TESTING, CHANGELOG, ROADMAP (P4-02 progress), AGENTS map, and a manual entry (35 entries).

**Verified:** 117/117 Node checks. In the browser, a fresh visit starts with all four drawers sealed and 55 tab stops. A held key, a loop, a genre change, and a mute each opened their drawer in turn with an announcement. A drawer closed by hand stayed closed across the cabinet switch and in storage, and the whole cabinet showed every drawer and no bars. With the larger type, every width from 320 to 1720 px kept one page height across all seven genres and held keys, with nothing clipped and no horizontal overflow; the Fun Machine status text fits at 360, 720, and 1390 px. No console errors.

**Not verified:** A screen reader (NVDA, VoiceOver, or Orca) reading the drawers and announcements; Safari and Firefox.

**Left undone:** The P4-02 assistive-technology pass; P6-01.

**Next session should start with:** a screen-reader pass of discovery mode, or the maintainer's feel for the drawer triggers.

### Session 38: 2026-10-20: Parlor Ragtime, written in Inform 7

**Contributor:** Claude Code with maintainer direction

**Goal:** Ship a seventh Kapellmeister genre written only in Inform 7 (follow-up to P5-23). The maintainer chose Parlor Ragtime over Sea Shanty Dorian and Gamelan Slendro.

**Done:** P5-24.

**Changed:**
1. `src/rulebooks.ni`: Chapter 6, Parlor Ragtime (`parlor_ragtime`, insistent, voiced). Twelve-step changes I · I · I7 · IV · IV · ♯iv° · I · I · VI7 · II7 · V7 · V7. Colours: major on 0 and 5, dom7 on 2/4/7/9/10, passing diminished elsewhere. A "Table of Parlor Rag" progression (I → I7 → IV → V7) and member snapping {root, third, fifth} plus the major sixth. A stride bass walk {0, 7, …, 0, 7, 2, 4} (climbs A, B over V7 back to C), organ {third, fifth, octave}, and Ragtime Overtones including 5/3 and 7/4. Raw Esoteric Chaos moves to Chapter 7 so it stays last in the menu. No `src/*.mjs` changed.
2. `tests/fixtures/rulebooks-golden.json` re-frozen with `--rewrite`. After resolving interned chord indices, every entry of the original six genres is identical; the fixture only gained ragtime entries (colours 14, progressions 8, spines 24, projection 14, ensembles 36).
3. Tests: genre lists include ragtime; a new suite pins its changes, colours, Fun Machine summary ("C Maj → C7 → F Maj → G7"), stride bass, organ, and sixth overtone. The barbershop fixture test now calls itself an extra, test-only genre.
4. Docs: README, manual (Kapellmeister and Inform entries), ARCHITECTURE, TESTING, ROADMAP (P5-24), CHANGELOG. `ASSET_VERSION` restamped.

**Verified:** 113/113 Node checks. In the browser: seven menu entries with ragtime sixth; title, motto, compass (I, IV, I, II7), and key colours update; one page height and nothing clipped at 340, 400, 720, and 1390 px across all seven genres; holding a key during play works; no console errors.

**Not verified:** Nothing further; the maintainer listened on 2026-10-20 ("its beautiful").

**Left undone:** Listening passes; P4-02; P6-01.

**Next session should start with:** the maintainer's listen to Parlor Ragtime.

### Session 37: 2026-10-20: Inform 7 rulebooks, phase 5 (P5-23 complete)

**Contributor:** Claude Code with maintainer direction

**Goal:** P5-23 phase 5: prove a genre written only in Inform 7 plays with no JavaScript change (D-033).

**Done:** P5-23 (all five phases).

**Changed:**
1. `tests/fixtures/barbershop.ni`: a barbershop quartet. Changes I → VI7 → II7 → V7, a major tonic with every other key coloured dom7, a "Barbershop Tag" progression, a root–fifth bass walk, organ voicing {third, fifth, seventh}, melody snapping to {root, third, fifth, seventh}, and overtones ringing 7/4. It reuses the canonical kinds and adds its own three tables.
2. `tests/seventh-genre.test.mjs`: appends it to `src/rulebooks.ni`, installs the result, and checks that the six canonical genres compile identically. It then checks key colours, the progression summary ("D Maj → B7 → E7 → A7"), the accompanist's chords and lifted lead, the conducted spine, bass walk and insistent gates, organ voicing, melody on chord members, and overtones. Sessions accept the new code but still refuse "polka", and no `src/*.mjs` or `index.html` mentions "barbershop".

**Verified:** 112/112 Node checks; the new suite passed on its first run.

**Not verified:** The barbershop genre in the browser. It is test-only and never shipped.

**Left undone:** A seventh playable genre in `src/rulebooks.ni` (the maintainer's follow-up); listening passes; P4-02; P6-01.

**Next session should start with:** the maintainer's choice: ship a seventh genre, the outstanding listening passes, or P4-02 / P6-01.

### Session 36: 2026-10-20: the echo keeps the tempo

**Contributor:** Claude Code with maintainer direction

**Goal:** Maintainer: the one-finger accompaniment seemed slightly faster than the tempo setting.

**Found:** the accompanist itself plays on the band's step grid at the live tempo (`loopStepDuration()` and the scheduler both read `activeTempoBpm`). The delay, however, was timed once when the loop started (`unit × DELAY_MULTIPLIERS[score.rhythm]`) and never followed the tempo slider. Since D-029 the pad, arpeggio, and lead all feed that delay, so after a tempo change mid-loop their echoes ran at the old tempo.

**Changed:** `src/ensemble.mjs` exports `delayTimeFor(score, bpm)` and uses it at build time; `setTempoBpm()` in `src/app.mjs` retimes the running loop's delay with a short glide. Tests cover the formula and the live retime. `ASSET_VERSION` restamped.

**Verified:** 107/107 Node checks; in the browser, a normal reload picked up the new stamp, and moving the tempo 70 → 150 → 96 while holding a key raised no errors.

**Not verified:** Listening. If the accompaniment still feels quick at a steady tempo, the likely cause is the ARPEGGIO style's two notes per step (sixteenths against the band's eighth-note steps, D-029). That is a design choice to revisit, not this bug.

**Left undone:** P5-23 phase 5; listening passes; P4-02; P6-01.

**Next session should start with:** the maintainer's listen, then P5-23 phase 5.

### Session 35: 2026-10-20: the manual climbs like a keyboard

**Contributor:** Claude Code with maintainer direction

**Goal:** Maintainer: "the C on the left hand side is the same octave as the one on the right. That's not how keyboards work."

**Done:** D-036.

**Changed:**
1. `src/accompaniment.mjs`: `buildPerformance()` keeps the key's manual position as `lift` (0..12); `leadPitch` includes it; `padVoicing(chord, previous, lift)` and `arpeggioNotes(chord, step, subdivisions, lift)` raise their windows by it.
2. `src/app.mjs`: held-key pads (region, bridge, and idle audition) and arpeggios pass `performance.lift`.
3. `tests/accompaniment.test.mjs`: C' equals C plus an octave in every genre and style, and every key's pad and arpeggio sit in a window that rises a semitone per key.
4. `index.html`: `ASSET_VERSION` restamped (`node tools/stamp_assets.mjs`, D-035) because `src/` changed.

**Verified:** 106/106 Node checks. In the browser (served by `tools/serve.py`), C pads 48,55,60,64 and C' pads 60,67,72,76; keys 0, 4, 7, 11, and 12 climb in pad, arpeggio, and lead; holding C and then C' over the loop raised no console errors. The first browser run used a cached pre-D-035 `index.html`, which is the very problem D-035 prevents from now on.

**Not verified:** Listening, especially how bright the top keys are.

**Left undone:** P5-23 phase 5; listening passes (parlor room, manual); P4-02; P6-01.

**Next session should start with:** the maintainer's listen, then P5-23 phase 5.

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

Older sessions: [archive/sessions.md](archive/sessions.md).
