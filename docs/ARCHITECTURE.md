# Architecture

HAI, ORACLE! is a static browser application. A phrase is normalized and hashed locally, the resulting seed enters a purpose-built LOLCODE interpreter, and `src/oracle.lol` emits a text score. The host validates every field before Canvas and Web Audio render a named looping creature. Nothing leaves the browser and the app retains no state after the page closes.

Rationale lives in [DECISIONS.md](DECISIONS.md).

## Code map

| Area | Where | Entry point | Talks to |
| --- | --- | --- | --- |
| Page shell | `index.html`, `styles.css` | document load | browser host |
| Browser host | `src/app.mjs` | form submission | score compiler, Canvas, Web Audio, share/PNG export |
| Phrase and score boundary | `src/score.mjs` | `composeScore()` | interpreter |
| Share and PNG boundary | `src/share.mjs` | `encodeOmenHash()`, `decodeOmenHash()`, `specimenFilenameFor()` | browser URL fragment and PNG download |
| Melody grammar | `src/music.mjs` | `melodyFor()` | validated score, browser host |
| LOLCODE runtime | `src/lolcode.mjs` | `runLolcode()` | spell source only |
| Composition | `src/oracle.lol` | `HAI 1.2` program | interpreter output |
| Malbolge runtime | `src/malbolge.mjs` | `runMalbolge()`, `composeBeat()` | `src/beat.mal`, validated score, browser host |
| Beat spell | `src/beat.mal` | 1998 Malbolge program | Malbolge VM output |
| Brainfuck runtime | `src/brainfuck.mjs` | `runBrainfuck()`, `composeBass()` | `src/bass.bf`, validated score, browser host |
| Bass spell | `src/bass.bf` | 1993 Brainfuck tape program | Brainfuck VM output |
| Befunge-93 runtime | `src/befunge.mjs` | `runBefunge()`, `composeHarmony()` | `src/harmony.bfg`, validated score, browser host |
| Harmony spell | `src/harmony.bfg` | 1993 Befunge 2D torus program | Befunge VM output |
| Piet & FRACTRAN runtime | `src/fractran.mjs` | `runPiet()`, `runFractran()`, `composeChimes()` | `src/pad.piet`, `src/chimes.frac`, validated score, browser host |
| Codel & fraction spells | `src/pad.piet`, `src/chimes.frac` | 2001 Piet codel canvas & 1987 FRACTRAN fractions | Piet and FRACTRAN VM output |
| Shakespeare runtime | `src/shakespeare.mjs` | `runShakespeare()`, `composeChant()` | `src/chant.spl`, validated score, browser host |
| Dramatic choir spell | `src/chant.spl` | 2001 Shakespeare Programming Language play | Shakespeare VM output |
| Ensemble audio graph | `src/ensemble.mjs` | `buildEnsembleGraph()` | live `AudioContext` and offline WAV `OfflineAudioContext` in `src/app.mjs` |
| Mixer model | `src/mixer.mjs` | `channelSettings()`, `isChannelAudible()`, `meterReading()` | mixing console and strips in `src/app.mjs`, `src/ensemble.mjs` |
| Master transport | `src/transport.mjs` | `transportReduce()`, `transportCommandForKey()` | transport deck and hotkeys in `src/app.mjs` |
| Harmonic conductor | `src/conductor.mjs` | `conductEnsemble()`, `eulerGradus()`, `buildTonnetzSpine()`, `bjorklund()` | all 6 esoteric engines, `src/app.mjs` |
| Verification | `tests/` | Node test runner | pure modules and static assets |

## Interfaces and data flow

```text
phrase -> normalize and FNV-1a hash -> INPUT_SEED
      -> LOLCODE spell -> key=value lines -> strict score validation
      -> shared immutable score -> twelve-note motif -> Euler-Tonnetz & Euclidean Conductor -> Web Audio composition
                              +-> Malbolge VM (src/beat.mal) -> 12-step ternary beat matrix -^
                              +-> Brainfuck VM (src/bass.bf) -> 12-cell walking bass tape ---^
                              +-> Befunge-93 VM (src/harmony.bfg) -> 12-cell 2D mirror chord organ -^
                              +-> Piet & FRACTRAN VMs (src/pad.piet, src/chimes.frac) -> 12-step prime-ratio chimes -^
                              +-> Shakespeare VM (src/chant.spl) -> 12-scene formant vowel choir -^
                              +-> Canvas creature + text reading
```

| Interface | Producer | Consumer | Contract |
| --- | --- | --- | --- |
| `INPUT_SEED` | `hashPhrase()` | `src/oracle.lol` | unsigned 32-bit integer |
| LOLCODE output | `runLolcode()` | `parseScore()` | one known `key=integer` per line; all required keys exactly once |
| Score object | `composeScore()` | `src/app.mjs` | frozen, range-checked object with twelve note choices plus musical, beat-cadence, bass-groove, harmony-organ, chime-carillon, chant-choir, body, eye-anatomy, palette, bounded-flux, kinetic-core, and naming grammar indices |
| Malbolge beat | `composeBeat()` | `src/conductor.mjs`, `src/app.mjs` | frozen 12-step ternary sequence (`kick`, `snare`, `hat` in `0..2`, `trits`) produced by executing `src/beat.mal` on a 59,049-word ternary tape |
| Brainfuck bass | `composeBass()` | `src/conductor.mjs`, `src/app.mjs` | frozen 12-cell bass sequence (`cell`, `gate`, `interval`, `register`, `slide`, `accent`, `label`) produced by executing `src/bass.bf` on a 256-cell byte tape |
| Befunge harmony | `composeHarmony()` | `src/conductor.mjs`, `src/app.mjs` | frozen 12-step polyphonic organ sequence (`raw`, `gate`, `mirror`, `chord`, `degreeIndex`, `strumMs`, `label`) produced by executing `src/harmony.bfg` on an 80×25 2D torus |
| Piet/FRACTRAN chimes | `composeChimes()` | `src/conductor.mjs`, `src/app.mjs` | frozen 12-step Just Intonation chime and codel pad sequence (`gate`, `codelCode`, `hueIndex`, `lightnessIndex`, `fraction`, `exponents`, `ratioLabel`, `ratioValue`, `label`) produced by executing `src/pad.piet` and `src/chimes.frac` |
| Shakespeare choir | `composeChant()` | `src/conductor.mjs`, `src/app.mjs` | frozen 12-scene formant vowel choir sequence (`gate`, `act`, `scene`, `speaker`, `addressee`, `personaShort`, `voiceType`, `vowelCode`, `vowelIpa`, `f1`, `f2`, `f3`, `interval`, `label`) produced by executing `src/chant.spl` |
| Ensemble conductor | `conductEnsemble()` | `src/app.mjs` | harmonizes the 12-step lead motif, bass tape, Befunge triads, Piet/FRACTRAN overtone ratios, and Shakespeare choir onto a 4-region Neo-Riemannian *Tonnetz* progression (`P`, `L`, `R`), Euler *Gradus Suavitatis* consonance sieve, and Bjorklund Euclidean hocket $E(k, 12)$ |
| Mycelial network | `buildMycelialNetwork()`, `buildFruitingBodies()` | Canvas renderer (`src/app.mjs`) | procedural branching hyphae, anastomotic fusion loops, eight generative sporophore archetypes, and drifting ballistospores growing over a 10-second envelope from creature perimeter into vitrine glass |
| User gesture | summon, replay, or unmute button | Web Audio | audio context starts or resumes only from the gesture path |
| Audio scheduler | current score and audio clock | Web Audio nodes | schedules roughly 280 ms ahead and repeats until stopped or replaced |
| Ensemble graph | `buildEnsembleGraph()` | `playScore()`, `exportSpecimenWav()` | one node topology for live and offline audio; drums, bass, and Fun Machine bypass the creature filter, everything else passes through it; `stop` ends looping sources for offline renders |
| Mixer console | `#mixer-engine` strips, plate ENGAGE/SILENCE switches, Bandstand buttons | `updateMixer()` → strip gains and pans in live and offline graphs | eight channels; fader `0..100` (80 = unity, 100 = +12 dB), pan `−100..100`, mute, solo; any solo isolates soloed channels and an explicit mute still wins; post-pan analyser drives VU meters live only |
| Master transport | `#transport-deck` buttons, `Space`/`Esc` via `transportCommandForKey()` | `runTransportCommand()` | `stopped`/`playing`/`paused` with a raw step cursor; pause resumes after the last audible step; audio runs only while playing and unmuted |
| Melody motif | `melodyFor()` | audio transport | exactly twelve frozen semitone offsets selected and rotated by validated score fields |
| Master volume | range input | active transport output gain | session-local `0..100` value mapped through a bounded perceptual curve; changes ramp over 18 ms |
| Tempo (BPM) | range input (`#tempo-bpm`) | active audio transport scheduler | session-local `36..208` BPM value initialized to `score.pulse` on summon (double-click restores native pulse); updates upcoming step durations in real time |
| Vitrine gesture | pointer events on `#vision` | Canvas renderer and active audio transport | transient normalized coordinates, hold, tap, and drag velocity modulate shape morphing, gaze, harmonic phase shift, filter/mix intensity, and synthesized percussion without mutating the score |
| Fun Machine keyboard | `triggerFunKey()`, `buildFunChord()` | `src/app.mjs`, active audio transport | interactive 13-key manual (`C..C'`) and `[A..K]` physical keyboard mapping; plays 5.5 Hz vibrato reed organ chord, triggers accompaniment burst, and punches chords into `customSpine` |
| Fun loop sequencer | `#fun-sequence-grid`, `#fun-machine-rec` | `conductEnsemble()`, `#export-wav` | 12-step progression matrix with step targeting, live punch-in recording, and progression reset; custom chords overlay the active genre spine and render into live audio and offline 16-bit WAV loops |

## Invariants

- A normalized phrase produces one stable score. Enforced by `tests/oracle.test.mjs` and D-003.
- The LOLCODE spell produces every parameter used to distinguish the creature. Enforced by required score fields and range validation.
- Malformed, duplicate, missing, unknown, or out-of-range output never reaches renderers. Enforced by `parseScore()` tests.
- Runtime assets remain local and dependency-free. Enforced by `tests/static.test.mjs` and D-001.
- The creature canvas lives in a centered, bounded apparition chamber at every viewport instead of acting as a full-page background. Enforced structurally in `tests/static.test.mjs` (D-011).
- Unsupported LOLCODE syntax fails with a line number. Enforced by the interpreter and its negative test.
- Rendering and sound share one immutable score. Enforced by the `showScore()` and `playScore()` call path.
- Only one audio transport loops at a time. Enforced by `stopCurrentSound()` before every start.
- Live playback and WAV export build the same node topology. Enforced by `tests/transport.test.mjs` and D-023.
- Every ensemble bus passes through its own mixer strip, and a default console is transparent (unity gain, centered). Enforced by `tests/transport.test.mjs`, `tests/mixer.test.mjs`, and D-024.
- A plate's ENGAGE/SILENCE switch and its mixer mute are the same state. Enforced by `tests/static.test.mjs` and D-024.
- Audio loops only while the transport is `playing` and the bell is unmuted; mute never changes transport state. Enforced by `runTransportCommand()` and D-023.
- Master volume changes only the post-compressor output gain and never changes the deterministic creature score. Enforced structurally in `tests/static.test.mjs` (D-009).
- Vitrine tap, hold, and drag gestures modulate transient visual morphing, pitch, intensity, and synthesized percussion and decay smoothly back to the immutable score on release. Enforced structurally in `tests/static.test.mjs` (D-012).
- Every melody family resolves to exactly twelve deterministic semitone offsets and the transport repeats them modulo twelve. Enforced by exact arpeggio and chromatic tests (D-010).
- Eye silhouette, layout, size, gaze, iris, and pupil all originate in the validated spell output. Enforced by required score fields and the batch diversity test (D-006).
- Every silhouette stays within a radius envelope of `0.38..1.08`, and every kinetic core is clipped to the current deforming body path. Enforced structurally in `tests/static.test.mjs` (D-007).
- Kinetic family, speed, depth, tilt, and boundary-flux family originate in validated spell output. Enforced by required ranges and the 256-phrase coverage test (D-007).
- Mycelial branching density, fruiting body archetype, and ballistospore emission originate in validated spell output (`fungal_form`, `fungal_hyphae`, `fungal_spores`, `fungal_bloom`). Enforced by required ranges and the phrase batch test (D-017).
- Custom chords punched into the Esoteric Fun Machine overlay the active genre spine via `customSpine` without altering virtual machine state or native Lolcode score determinism. Enforced by `tests/oracle.test.mjs` and D-020.

## Boundaries

| Boundary | Comes in as | Checked by | Rule |
| --- | --- | --- | --- |
| Phrase | user-controlled string | native length limit, normalization, empty check | never inserted as HTML or sent to a service |
| Spell source | same-origin text file | interpreter syntax and closed program checks | unsupported instructions fail closed |
| Spell output | line array | `parseScore()` allowlist, type, uniqueness, and ranges | no repair or best-effort coercion |
| Browser capabilities | Canvas and Web Audio APIs | feature use at runtime | a failure surfaces as status text and console detail |

## Dependencies

The application has no third-party runtime or build dependencies. It relies on current browser implementations of Canvas, Web Audio, ECMAScript modules, and `fetch`. Local verification uses Node and Python standard-library tools supplied by the development environment.

The visual system uses locally installed old-style and transitional book serifs (`Palatino Linotype`, `Book Antiqua`, `Palatino`, `Iowan Old Style`, `Baskerville`, `Goudy Old Style`, `Garamond`, `Georgia`) paired with telegraph monospace (`Courier New`, `Courier`). It deliberately ships no proprietary font binary or remote font request.

## State and caches

| What | Where | Written by | Reset by | Committed? |
| --- | --- | --- | --- | --- |
| Current phrase and score | browser memory | `src/app.mjs` | reload or tab close | no |
| Audio graph and loop timer | browser audio context and window | `playScore()` | pause, stop, mute, replacement, reload, or tab close | no |
| Mixer settings | browser memory | `updateMixer()` | RESET CONSOLE, reload, or tab close | no |
| Transport state and cursor | browser memory | `runTransportCommand()` | stop, summon, reload, or tab close | no |
| Static HTTP cache | browser-managed | browser | browser controls | no |

The prototype uses no cookies, local storage, indexed database, analytics, or service worker.

## Failure modes and observability

| Failure | User-visible behavior | Detection | Recovery |
| --- | --- | --- | --- |
| Opened through `file:` | status asks for HTTP serving | spell fetch rejects | run the documented local server |
| Unsupported or invalid spell | `THE ORACLE COUGHED` | line-numbered console error | fix the spell or interpreter and rerun tests |
| Web Audio unavailable | visual may continue; console records error | rejected audio path | use a supported browser or mute |
| Browser blocks audio | context remains suspended | browser policy | press summon, replay, or unmute |

Only technical errors reach the console. Phrase text is not intentionally logged.

## Claims vs. code

- “LOLCODE 1.2”, “Malbolge 1998”, “Brainfuck 1993”, “Befunge-93”, “Piet 2001”, “FRACTRAN 1987”, and “Shakespeare Programming Language 2001” name the syntax and virtual-machine profiles of the bundled spells. Each interpreter implements the documented subset and fails closed on unsupported instructions.
- Assistive-technology verification remains tracked under P4-02.
