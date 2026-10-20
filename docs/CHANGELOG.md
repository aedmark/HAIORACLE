# Changelog

## Unreleased

### Changed

- Read each Kapellmeister genre's motto under its title. The genres themselves (menu, chord colours, changes, progressions, bass walks, voicings, overtones) are now written in plain-English Inform 7 in `src/rulebooks.ni`; the music is unchanged.
- Keep the Perform wing still while you play: switching genres or Fun Machine styles, or holding keys over the loop, no longer changes the height of any panel at any window width, and long status lines, sequencer chords, and plate labels keep a fixed space.
- Hear every phrase breathe its own way: the INTERCAL conductor reads each creature's arrangement word and chooses who waits, who answers, and when the turnaround lands, so arrangements now differ from creature to creature (existing creatures' arrangements changed).
- See the INTERCAL conductor at work: the transport names the current section, console strips light **TACET** while the conductor rests them, MIDI exports mark each section on the DAW timeline, and the stem README lists section times. The conductor score's own registers now decide who plays, so editing `src/conductor.i` re-arranges the band.
- Keep the layout still while the loop plays: the section readout and the Kapellmeister harmony readout no longer change size when their text gets longer, so on wide windows the volume controls no longer jump to a new line once per loop.
- Keep every arrangement full: each step keeps at least five band voices, and the pulse and bass hold until the breakdown.
- Find every control in one of four wings beneath the vitrine: **Perform** (transport with restart, volume, and tempo; the Fun Machine; the Kapellmeister rulebook), **Mix** (Bandstand, mixing console, parlor room), **Keep** (Session Ledger and a new export and share desk), and **The Band** (Plates II–VI). The reading strip now only names the creature, and the keyboard's tab order follows the wings.

### Fixed

- Make the band follow a held or punched Fun Machine chord in the right key; it previously played the chord transposed by the creature's tonic. The sequencer grid also names generated steps correctly now.
- Keep the preset-name field one line tall on phones, and stop the Kapellmeister rulebook, Fun Machine keyboard, and footer links from being cut off on narrow screens.
- Render WAV exports through the same audio graph as live playback, so chimes, choir, and fungal voices are filtered and panned exactly as heard.
- Remove audio-synchronous geometry scaling after screencast review exposed beat-periodic tearing and compression-like jumps.
- Confine the large body-glow blur to one silhouette fill instead of applying it to every kinetic line, ring, and eye.

### Added

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

