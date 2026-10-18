# HAI, ORACLE!

Feed it a thought. See what hums back.

HAI, ORACLE! turns a short phrase into a deterministic looping audiovisual creature. The same normalized phrase always produces the same name, twelve-note repeating motif, pulse, waveform, rhythm, color grammar, shape, size, motion, and questionable anatomy. Motifs range across seeded scale walks, five arpeggio families, chromatic ascents, descents and orbits, fifths, whole-tone motion, and a glassy interval ladder. Each creature deforms through one of eight bounded silhouette grammars while one of eight kinetic geometries folds, spins, or travels inside it. Eyes vary by count, silhouette, arrangement, size, gaze, iris color and treatment, and pupil geometry.

The score is composed by [`src/oracle.lol`](src/oracle.lol), accompanied by a 12-step ternary beat automaton written in 1998 Malbolge ([`src/beat.mal`](src/beat.mal)), a 12-cell walking bassline written in 1993 Brainfuck ([`src/bass.bf`](src/bass.bf)), a 12-cell 2D mirror chord organ written in 1993 Befunge ([`src/harmony.bfg`](src/harmony.bfg)), a 12-step Just Intonation prime-ratio chime and codel chorus engine written in 2001 Piet ([`src/pad.piet`](src/pad.piet)) and 1987 FRACTRAN ([`src/chimes.frac`](src/chimes.frac)), and a 12-scene 3-formant vowel choir written in 2001 Shakespeare Programming Language ([`src/chant.spl`](src/chant.spl)). Purpose-built browser interpreters execute all esoteric programs locally, validate their output, harmonize the six-language ensemble through an Euler-Tonnetz and Euclidean rhythm conductor ([`src/conductor.mjs`](src/conductor.mjs)), and hand the score, ternary percussion matrix, bass tape, torus chord voicings, prime-ratio codel chimes, and formant vowel choir to Canvas and Web Audio. There are no packages, remote assets, analytics, cookies, accounts, or network calls after the static files load.

The interface is a bespoke, esoteric parlor cabinet and broadsheet built around an engraved old-style serif and telegraph-monospace type stack, foxed parchment, ebonized wood, sealing-wax oxblood, tarnished brass rules, inline SVG astrolabe spandrels, and a bell-jar apparition vitrine. No remote or proprietary font file is distributed: browsers use locally installed book serifs and monospace faces.

## Run it

From the repository root:

```bash
python3 -m http.server 8000
```

Open [http://localhost:8000](http://localhost:8000), enter a phrase, and choose **SUMMON**. Sound requires the button press because browsers block unsolicited audio.

The composition loops until you summon another creature, mute it, or close the page. **RESTART THE MELODY** returns the current creature to the first note, **COPY OMEN LINK** seals the phrase into a client-only `#omen=...` URL fragment for sharing without server logs, and **ENGRAVE PNG PLATE** downloads a 1200×1520 Victorian specimen broadsheet PNG with the creature portrait, name, confided phrase, seed, and six-language ensemble ledger. The master-volume slider starts at a stronger listening level and can move continuously from silence to a compressor-protected boost, while the **TEMPO** slider (`36..208` BPM, initialized to the creature's native pulse) adjusts the live ensemble pace in real time. Tapping, holding, or dragging directly across the apparition vitrine disturbs the specimen—striking synthesized glass and membrane percussion, bending pitch and filter intensity, and morphing and tugging its geometry until you let go. A comprehensive standalone technical manual answering What, How, and Why for every component is available at [`manual.html`](manual.html).

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
- The first prototype stores nothing between visits.
- The interpreter supports the documented subset used by the spell. It makes no claim of full LOLCODE compatibility.

Project state and next work live in [`docs/HANDOFF.md`](docs/HANDOFF.md) and [`ROADMAP.md`](ROADMAP.md).
