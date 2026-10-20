# Edmark's Esoteric Fun Machine

Feed it a thought. See what hums back. Play along on the organ.

**Edmark's Esoteric Fun Machine** turns a short phrase into a deterministic looping audiovisual creature with a six-language esoteric chamber band and a one-finger accompanist inspired by Baldwin home organs. Hold a key on the 13-key manual (`C..C'`) or the computer keyboard (`[A..K]`) and a stereo synth pad plays a **Swell**, an **Arpeggio**, or a **Progression** in the band's own rhythm; the band follows your chord and its lead steps back. Chords can also be punched into a 12-step loop sequencer for jams and WAV, stem, and MIDI exports. The same normalized phrase always produces the same name, twelve-note repeating motif, pulse, waveform, rhythm, color grammar, shape, size, motion, and questionable anatomy. Motifs range across seeded scale walks, five arpeggio families, chromatic ascents, descents and orbits, fifths, whole-tone motion, and a glassy interval ladder. Each creature deforms through one of eight bounded silhouette grammars while one of eight kinetic geometries folds, spins, or travels inside it. Eyes vary by count, silhouette, arrangement, size, gaze, iris color and treatment, and pupil geometry.

The generative score is composed by the *HAI, ORACLE!* spell ([`src/oracle.lol`](src/oracle.lol)), accompanied by a 12-step ternary beat automaton written in 1998 Malbolge ([`src/beat.mal`](src/beat.mal)), a 12-cell walking bassline written in 1993 Brainfuck ([`src/bass.bf`](src/bass.bf)), a 12-cell 2D mirror chord organ written in 1993 Befunge ([`src/harmony.bfg`](src/harmony.bfg)), a 12-step Just Intonation prime-ratio chime and codel chorus engine written in 2001 Piet ([`src/pad.piet`](src/pad.piet)) and 1987 FRACTRAN ([`src/chimes.frac`](src/chimes.frac)), and a 12-scene 3-formant vowel choir written in 2001 Shakespeare Programming Language ([`src/chant.spl`](src/chant.spl)). Purpose-built browser interpreters execute all esoteric programs locally, validate their output, harmonize the six-language ensemble through an Euler-Tonnetz and Euclidean rhythm conductor ([`src/conductor.mjs`](src/conductor.mjs)) whose seven Kapellmeister genres (Parlor Ragtime the newest) are written in Inform 7 ([`src/rulebooks.ni`](src/rulebooks.ni)), arrange it with an INTERCAL 1972 conductor score ([`src/conductor.i`](src/conductor.i)), and hand the score, ternary percussion matrix, bass tape, torus chord voicings, prime-ratio codel chimes, and formant vowel choir to Canvas and Web Audio. There are no packages, remote assets, analytics, cookies, accounts, or network calls after the static files load.

The interface is a bespoke, esoteric parlor cabinet and broadsheet built around an engraved old-style serif and telegraph-monospace type stack, foxed parchment, ebonized wood, sealing-wax oxblood, tarnished brass rules, inline SVG astrolabe spandrels, and a bell-jar apparition vitrine. No remote or proprietary font file is distributed: browsers use locally installed book serifs and monospace faces.

## Run it

From the repository root:

```bash
python3 tools/serve.py
```

This standard-library server sends `Cache-Control: no-cache`, so a reload always sees your latest edits. Plain `python3 -m http.server 8000` also works. Every module and source URL carries a version stamp, so a browser never mixes old and new files after an update (D-035). If you edit anything under `src/`, run `node tools/stamp_assets.mjs` before committing.

Open [http://localhost:8000](http://localhost:8000), enter a phrase, and choose **SUMMON**. Sound requires the button press because browsers block unsolicited audio.

The composition loops until you summon another creature, pause or stop it, mute it, or close the page. The master transport offers **PLAY**, **PAUSE**, and **STOP · REWIND**; press `Space` to play or pause and `Esc` to stop and rewind. The **PARLOR MIXING CONSOLE** below the Fun Machine gives each of the eight voices a fader, pan, mute, solo, and VU meter, and WAV exports follow the mix. **EXPORT 9 STEMS (ZIP)** downloads every channel plus the parlor room as aligned WAV stems, and **WRITE MIDI SCORE** downloads the loop as a multi-track MIDI file. The **SESSION LEDGER** saves the whole apparatus (phrase, plate edits, progression, rulebook, room, tempo, and mix) as named presets kept only in your browser, or as a portable `.fun` file. **RESTART THE MELODY** returns the current creature to the first note, **COPY OMEN LINK** seals the phrase into a client-only `#omen=...` URL fragment for sharing without server logs, and **ENGRAVE PNG PLATE** downloads a 1200×1520 Victorian specimen broadsheet PNG with the creature portrait, name, confided phrase, seed, and six-language ensemble ledger. The master-volume slider starts at a stronger listening level and can move continuously from silence to a compressor-protected boost, while the **TEMPO** slider (`36..208` BPM, initialized to the creature's native pulse) adjusts the live ensemble pace in real time. Tapping, holding, or dragging directly across the apparition vitrine disturbs the specimen—striking synthesized glass and membrane percussion, bending pitch and filter intensity, and morphing and tugging its geometry until you let go. A comprehensive standalone technical manual answering What, How, and Why for every component is available at [`manual.html`](manual.html).

Opening `index.html` directly through a `file:` URL is unsupported. The browser must fetch the separate LOLCODE spell from the same HTTP origin.

## Verify it

```bash
node --test tests/*.test.mjs
python3 tools/check_docs.py
python3 tools/manual.py check docs/manual.json
```

All checks use standard-library tools and install nothing. Rebuild the manual anytime with `python3 tools/manual.py build docs/manual.json --output manual.html`.

## Technical promise

- LOLCODE owns the generative decisions.
- JavaScript interprets, validates, draws, and plays those decisions.
- Phrase processing stays inside the browser.
- Nothing is stored between visits unless you save a session preset, which stays in your own browser until you delete it.
- The interpreter supports the documented subset used by the spell. It makes no claim of full LOLCODE compatibility.

Project state and next work live in [`docs/HANDOFF.md`](docs/HANDOFF.md) and [`ROADMAP.md`](ROADMAP.md).
