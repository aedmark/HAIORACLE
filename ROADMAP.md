# Roadmap

Item IDs are permanent. `[ ]` is open, `[~]` is active, `[x]` is done, and `[-]` is dropped.

## Phase 1: Foundations

Goal: establish a documented, dependency-free project whose LOLCODE boundary is honest and testable.

- [x] P1-01 Adopt the Manifold documentation template and replace every placeholder with project truth. Verified by `python3 tools/check_docs.py` on 2026-10-17.
- [x] P1-02 Implement the required LOLCODE 1.2 subset with line-numbered failures for unsupported syntax. Verified by `tests/oracle.test.mjs` on 2026-10-17.

## Phase 2: Core experience

Goal: summon one coherent audiovisual creature from one phrase.

- [x] P2-01 Generate a deterministic, validated score in `src/oracle.lol`. Verified by deterministic and range tests on 2026-10-17.
- [x] P2-02 Render the score as a continuously looping Web Audio composition and animated Canvas creature. Expanded from a ten-second playback after maintainer feedback on 2026-10-17; subjective browser review remains P4-01.
- [x] P2-03 Provide responsive summon, surprise, mute, and replay controls with accessible labels and status text. Static checks passed 2026-10-17; assistive-technology review remains P4-02.

## Phase 3: Output and sharing

Goal: let a creature travel without adding accounts or remote storage.

- [ ] P3-01 Encode the phrase in a shareable URL while preserving the deterministic privacy model. Origin: product workshop, 2026-10-17.
- [ ] P3-02 Export a still image containing the creature name and originating phrase. Origin: prototype follow-up, 2026-10-17.

## Phase 4: Quality

Goal: verify the sensory experience beyond structural automation.

- [x] P4-01 Review animation, mix, controls, and responsive layout across the six-language parlor ensemble in a live browser. Verified by maintainer hands-on review on 2026-10-18.
- [ ] P4-02 Test keyboard navigation, reduced motion, contrast, screen-reader announcements, and mute behavior with real assistive technology. Origin: accessibility review, 2026-10-17.

## Phase 5: Later experiments

Goal: expand only where additional complexity creates more play.

- [x] P5-01 Expand musical, visual, and naming variation after the first hands-on review exposed repetition. Added twelve-note phrases, eight scales, six rhythms and voice stacks, ten shape families, broader size and color ranges, and six name grammars on 2026-10-17. Verified by batch diversity tests; sensory review remains P4-01.
- [x] P5-02 Give eyes distinct silhouettes, arrangements, iris colors and treatments, pupil geometries, sizes, and gaze behavior. Added after maintainer review on 2026-10-17 and verified across the phrase batch; visual review remains P4-01.
- [x] P5-03 Replace pulse-dominated blobs with bounded kinetic geometries. Added eight independently animated internal systems, including a projected tesseract, and eight silhouette-flux grammars on 2026-10-17. Score coverage and clipping invariants are automated; visual review remains P4-01.
- [x] P5-04 Add an accessible master-volume control and raise the default mix after listening review found quiet creatures difficult to hear. Added a live 0–100 control, perceptual gain curve, stronger dry mix, and compressor-protected wet path on 2026-10-17; listening review remains P4-01.
- [x] P5-05 Expand deterministic melody into twelve repeating motif families. Added major, minor, diminished, augmented and minor-seventh arpeggios; ascending, descending and interleaved chromatic motifs; fifths, whole-tone, glass-ladder, and seeded scale-walk patterns on 2026-10-17. Exact motif tests pass; listening review remains P4-01.
- [x] P5-06 Redesign the interface as a bespoke, esoteric, old-timey macabre parlor cabinet and broadsheet after art-direction review. Added a centered bell-jar apparition vitrine, engraved serif and telegraph-monospace typography, foxed parchment and tarnished brass palette, inline SVG sigil and spandrel linework, formal specimen labels, and responsive staging on 2026-10-17. Structural checks pass; visual review remains P4-01.
- [x] P5-07 Make the apparition vitrine interactive on tap/click, press-and-hold, and hold-and-drag. Added transient shape morphing, directional lobe pull, accelerated kinetic/boundary flux, pointer gaze tracking, vitrine shockwave ripples, continuous pitch/filter/intensity modulation, and synthesized strike, ratchet, and step-percussion transients on 2026-10-17. Structural checks pass; sensory review remains P4-01.
- [x] P5-08 Add a Malbolge ternary beat generator element (`src/beat.mal`, `src/malbolge.mjs`, and the Plate II 12-step ternary matrix). Executes a 50-instruction Malbolge 1998 program on a 59,049-word ($3^{10}$) ternary tape to drive a 3-voice synthesized percussion automaton (bellows kick, clockwork snare, escapement chime) across eight cadence families, with live step editing, pulse toggle, and mutation controls on 2026-10-18. Verified by automated VM and structural tests; listening review remains P4-01.
- [x] P5-09 Add a Brainfuck walking tape-loop bassline element (`src/bass.bf`, `src/brainfuck.mjs`, and the Plate III 12-cell tape sequencer). Executes an 8-command 1993 Brainfuck tape program with `[->+<]` transfer loops on a 256-cell byte tape to drive a sub-sine and resonant lowpass upper-bass ostinato across eight groove archetypes (`WALKING CELLAR`, `ACID CATACOMB`, `SUBTERRANEAN PEDAL`, `TAPE-LOOP BOOGIE`, `CRYPT ARPEGGIATOR`, `PENDULUM OSTINATO`, `PHANTOM FUGUE BASS`, `SEANCE DUB SUB`), with portamento glide, live cell stepping, bass toggle, and tape-shift controls on 2026-10-18. Verified by automated interpreter and structural tests; listening review remains P4-01.
- [x] P5-10 Add a Befunge-93 2D pinball chord organ and counterpoint engine (`src/harmony.bfg`, `src/befunge.mjs`, and Plate IV 2D torus playfield). Executes a 93-step 2D boustrophedon ASCII playfield with directional arrows (`> < ^ v`), `#` bridges, and four diagonal mirrors (`\ / / \`) on an 80×25 torus to voice polyphonic 3-note reed-organ and harp-bell triads across eight organ archetypes (`CATHEDRAL REED`, `PARLOR HARMONIUM`, `GLASS HARP ARPEGGIO`, `STACCATO CLAVIER`, `MIRROR COUNTERPOINT`, `WALTZ CHORD ORGAN`, `TORUS CHORALE`, `PHANTOM CALLIOPE`), with clickable mirror cells, organ toggle, and mirror-flip controls on 2026-10-18. Verified by automated interpreter and structural tests; listening review remains P4-01.
- [x] P5-11 Add a Piet / FRACTRAN synesthetic spectral chorus and prime-ratio chime engine (`src/pad.piet`, `src/chimes.frac`, `src/fractran.mjs`, and Plate V). Executes a 49-step 25×5 clockwise Piet 2001 codel spiral across all 18 chromatic codels (`[LND][RYGCBM]`) and a 12-step 1987 John Conway FRACTRAN prime-ratio program (`35/6 77/10 ... 210/1`) over $2^a 3^b 5^c 7^d 11^e 13^f$ to drive 7-limit Just Intonation overtone bells and synesthetic codel-filtered chorus pads across eight archetypes (`TONNETZ CATHEDRAL`, `PRISMATIC CARILLON`, `SEPTIMAL GLASS CHOIR`, `PYTHAGOREAN PENDULUM`, `CODEL AURORA PAD`, `PRIME RATIO GAMELAN`, `EULER HARMONIC LATTICE`, `VESPER VIOLET CHIMES`), with live codel/ratio cycling, chime toggle, and codel-refraction controls on 2026-10-18. Verified by automated interpreter and structural tests; listening review remains P4-01.
- [x] P5-12 Add a Shakespeare Programming Language (SPL) formant vowel choir and stage-direction barker (`src/chant.spl`, `src/shakespeare.mjs`, and Plate VI). Executes a 3-Act, 12-Scene Elizabethan tragedy (`The Oracular Tragedy of the Parlor Glass.`) with four dramatis personae (`Hamlet` Tenor, `Ophelia` Soprano, `Prospero` Basso, `Hecate` Alto) across 40 dramatic cues to schedule 3-formant ($F_1, F_2, F_3$) parallel bandpass vowel choir voices (`/ɑ/`, `/ɛ/`, `/i/`, `/o/`, `/u/`, `/æ/`) across eight archetypes (`ELIZABETHAN MADRIGAL`, `TRAGIC SOLILOQUY`, `WITCHES' INCANTATION`, `TEMPEST ARIEL AIR`, `PARLOR VODER HYMN`, `GLOBE THEATRE CANON`, `OPHELIA VESPERS`, `PROSPERO EPILOGUE`), with live scene/vowel cycling, choir toggle, and act-revision controls on 2026-10-18. Verified by automated interpreter and structural tests; listening review remains P4-01.
- [x] P5-13 Add an Ensemble Bandstand mixing console (`#bandstand-engine`) for live jam sessions across all six esoteric players (`LOLCODE 1.2`, `Malbolge 1998`, `Brainfuck 1993`, `Befunge-93`, `Piet 2001 / FRACTRAN 1987`, `Shakespeare 2001`), including `ENGAGE FULL BAND`, `SOLO LOLCODE LEAD`, and synchronized `MUTATE ALL PLAYERS` controls on 2026-10-18. Verified by structural tests; listening review remains P4-01.

## Phase 6: Release

Goal: give the finished toy a durable public home.

- [ ] P6-01 Choose hosting, domain, and first release version. Publishing requires maintainer approval. Origin: repository setup, 2026-10-17.
