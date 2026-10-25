# Architecture

The Whimsy Machine is a static browser application; HAI, ORACLE! is its LOLCODE score engine. A phrase is normalized and hashed locally, the resulting seed enters a purpose-built LOLCODE interpreter, and `src/oracle.lol` emits a text score. The host validates every field before Canvas and Web Audio render a named looping creature. Nothing leaves the browser. The only state that survives the page is the session presets a player chooses to save on-device (D-026).

Rationale lives in [DECISIONS.md](DECISIONS.md).

## Code map

| Area | Where | Entry point | Talks to |
| --- | --- | --- | --- |
| Page shell | `index.html`, `styles.css`: vitrine and calling slip, read-only reading strip, then the Perform, Mix, Band, and Keep wings (D-027) | document load | browser host |
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
| Master arrangement conductor | `src/intercal.mjs`, `src/conductor.i` | `composeArrangement()`, `arrangementWordFor()`, `arrangementSectionAt()`, `runIntercal()` | live scheduler, offline exports, transport section readout, console TACET lamps, and MIDI markers in `src/app.mjs` |
| Kapellmeister rulebooks | `src/inform.mjs`, `src/rulebooks.ni` | `compileRulebooks()`, `readStory()`, `followRulebook()` | Inform 7 subset source for the seven genres, compiled to frozen genre data (D-033). The app fetches and installs it (`installRulebooks()`) before anything reads a genre; the conductor, the Fun Machine, session validation, and the Kapellmeister menu, title, and motto (`buildGenreMenu()`) look genres up by code (`genreBook()`, `genreCodes()`) |
| Ensemble audio graph | `src/ensemble.mjs` | `buildEnsembleGraph()` | live `AudioContext` and offline WAV `OfflineAudioContext` in `src/app.mjs` |
| Session boundary | `src/session.mjs` | `parseSession()`, `validateSession()`, `parsePresetStore()` | session ledger in `src/app.mjs`, `localStorage`, `.fun` files |
| Export writers | `src/zip.mjs`, `src/midi.mjs` | `createStoredZip()`, `buildMidiFile()` | stem and MIDI exports in `src/app.mjs` |
| Loop machine model | `src/looper.mjs` | `appendLoop()`, `overdubLayer()`, `songPosition()`, `leadSlotAt()`, `recorderReduce()`, `validateSong()`, `setLoopRole()` | the pure song/loop/take model, limits, follow rule, recorder, and validation (D-039, D-052). The live scheduler in `src/app.mjs` records takes (`advanceRecorder()`), conducts the band onto the leading layer (`followSong()`), and plays every layer through `playPerformanceStep()`, shared with the live key; the loop strip is `#looper`, with tiles (`renderLooperTiles()`) and a selected-loop edit row (`editSong()`). `renderEnsembleLoop()` renders every song pass with the same `followSong()` and `playSongLayers()`, then `restoreLiveConducting()` |
| Discovery and the cabinet | `src/cabinet.mjs` | `cabinetReduce()`, `parseCabinetState()`, `DRAWERS` | drawer chrome, unlock triggers, and the cabinet switch in `src/app.mjs` (D-037) |
| Fun Machine accompanist | `src/accompaniment.mjs` | `buildPerformance()`, `buildFunSectionProgression()`, `padVoicing()`, `arpeggioNotes()`, `toTonicRelative()` | Fun Machine scheduler and Casio arranger section buttons (Intro, Bridge, Outro) in `src/app.mjs` |
| Mycelium voice | `src/mycelium.mjs` | `myceliumEvents()`, `FUNGAL_SOUNDS` | eight per-form sounds (spikes, drops, spore puffs) shaped by hyphae, spores, and bloom; `scheduleFungalBioStep()` in `src/app.mjs` plays them (D-042) |
| Fun Machine voices | `src/voices.mjs` | `validateVoice()`, `voiceById()`, `scheduleVoicePad()`, `scheduleVoicePluck()`, `scheduleVoiceLead()` | patch presets and their synths (D-040); `schedulePadChord()`, `scheduleArpNote()`, and `scheduleFunLeadNote()` in `src/app.mjs` play the current voice |
| Mixer model | `src/mixer.mjs` | `channelSettings()`, `isChannelAudible()`, `meterReading()` | mixing console and strips in `src/app.mjs`, `src/ensemble.mjs` |
| Master transport | `src/transport.mjs` | `transportReduce()`, `transportCommandForKey()` | transport deck and hotkeys in `src/app.mjs` |
| Harmonic clock | `src/conductor.mjs` | `HARMONIC_PASSES`, `passSpine()`, `conductEnsemble({ harmonicPass })` | one region per loop pass, chords changing on the downbeat; `enterHarmonicPass()` and `harmonicPassAt()` in `src/app.mjs` walk the four-pass cycle live and in exports, and `buildPerformance(…, { pass })` moves the Fun Machine with it (D-044) |
| Creature's own rulebook | `src/creature-rulebook.mjs` | `buildCreatureBook()`, `chordOnRoot()`, `scalePitchClasses()` | a per-creature genre book from its scale and the functional grammar in `src/rulebooks.ni` Part 5; `installCreatureBook()` in `src/conductor.mjs` makes it genre `"creature"`, installed on every summon (D-043) |
| Genre variation | `src/variation.mjs` | `varySpine()`, `VARIATION_MOVES` | the moves a genre's rulebook permits (`The permitted moves of … are {…}` in `src/rulebooks.ni`), chosen by the score's `harmony_*` fields; `conductEnsemble({ varied: true })` applies them, and the app always passes it (D-043) |
| Harmonic conductor | `src/conductor.mjs` | `conductEnsemble()`, `eulerGradus()`, `buildTonnetzSpine()`, `bjorklund()`, `avoidNoteResolution()`, `chordOvertones()`, `walkTone()` | all 6 esoteric engines, `src/app.mjs`; chord members come from a chord's own tones, the melody resolves avoid notes, chimes ring only chord tones and genre colours, and walks land on chord members (D-043) |
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

Web Audio composition (per-step schedulers in src/app.mjs)
      -> eight buses -> mixer strips: voicing trim -> fader -> pan (+ live VU analyser)   [src/ensemble.mjs, src/mixer.mjs]
      -> creature filter (LOLCODE lead only, D-042) / compressor / delay / parlor reverb -> master output
      live:    master transport (play / pause / stop, Space / Esc) drives the look-ahead scheduler   [src/transport.mjs]
      offline: renderEnsembleLoop() -> WAV mix | 9 solo stems -> STORED ZIP | noteLog -> SMF Type 1   [src/zip.mjs, src/midi.mjs]

session state <-> captureSession() / applySession() <-> strict validator <-> localStorage presets | .fun files   [src/session.mjs]
```

| Interface | Producer | Consumer | Contract |
| --- | --- | --- | --- |
| `INPUT_SEED` | `hashPhrase()` | `src/oracle.lol` | unsigned 32-bit integer |
| LOLCODE output | `runLolcode()` | `parseScore()` | one known `key=integer` per line; all required keys exactly once |
| Score object | `composeScore()` | `src/app.mjs` | frozen, range-checked object with twelve note choices plus musical, beat-cadence, bass-groove, harmony-organ, chime-carillon, chant-choir, body, cellular-appendage, palette, bounded-flux, kinetic-core, and naming grammar indices |
| Malbolge beat | `composeBeat()` | `src/conductor.mjs`, `src/app.mjs` | frozen 12-step ternary sequence (`kick`, `snare`, `hat` in `0..2`, `trits`) produced by executing `src/beat.mal` on a 59,049-word ternary tape |
| Brainfuck bass | `composeBass()` | `src/conductor.mjs`, `src/app.mjs` | frozen 12-cell bass sequence (`cell`, `gate`, `interval`, `register`, `slide`, `accent`, `label`) produced by executing `src/bass.bf` on a 256-cell byte tape |
| Befunge harmony | `composeHarmony()` | `src/conductor.mjs`, `src/app.mjs` | frozen 12-step polyphonic organ sequence (`raw`, `gate`, `mirror`, `chord`, `degreeIndex`, `strumMs`, `label`) produced by executing `src/harmony.bfg` on an 80×25 2D torus |
| Piet/FRACTRAN chimes | `composeChimes()` | `src/conductor.mjs`, `src/app.mjs` | frozen 12-step Just Intonation chime and codel pad sequence (`gate`, `codelCode`, `hueIndex`, `lightnessIndex`, `fraction`, `exponents`, `ratioLabel`, `ratioValue`, `label`) produced by executing `src/pad.piet` and `src/chimes.frac` |
| Shakespeare choir | `composeChant()` | `src/conductor.mjs`, `src/app.mjs` | frozen 12-scene formant vowel choir sequence (`gate`, `act`, `scene`, `speaker`, `addressee`, `personaShort`, `voiceType`, `vowelCode`, `vowelIpa`, `f1`, `f2`, `f3`, `interval`, `label`) produced by executing `src/chant.spl` |
| INTERCAL arrangement | `composeArrangement()` | `scheduleEnsembleStep()`, `arrangementPlays()`, `updateArrangementDisplay()`, `arrangementMarkers()` in `src/app.mjs` | 12-step channel masks across 4 sections plus a `COME FROM` turnaround, built from register snapshots of `src/conductor.i` (`:1..:8` channels, `.1` sections, `.3` turnaround start; D-030), which reads the creature's `arrangementWordFor(score)` with `WRITE IN` and chooses its form per phrase (D-031); bypassed under Raw Chaos |
| Ensemble conductor | `conductEnsemble()` (genre choices from the installed rulebooks) | `src/app.mjs` | harmonizes the 12-step lead motif, bass tape, Befunge triads, Piet/FRACTRAN overtone ratios, and Shakespeare choir onto a 4-region Neo-Riemannian *Tonnetz* progression (`P`, `L`, `R`), Euler *Gradus Suavitatis* consonance sieve, and Bjorklund Euclidean hocket $E(k, 12)$ |
| Mycelial network | `buildMycelialNetwork()`, `buildFruitingBodies()` | Canvas renderer (`src/app.mjs`) | procedural branching hyphae, anastomotic fusion loops, eight generative sporophore archetypes, and drifting ballistospores growing over a 10-second envelope from creature perimeter into vitrine glass |
| User gesture | summon, replay, or unmute button | Web Audio | audio context starts or resumes only from the gesture path |
| Audio scheduler | current score and audio clock | Web Audio nodes | schedules roughly 280 ms ahead and repeats until stopped or replaced |
| Channel voicing | `CHANNEL_VOICING_DB` in `src/ensemble.mjs` | each strip's trim node | fixed default balance in dB before the fader (lead +6, choir +12, others 0); never changed at runtime |
| Ensemble graph | `buildEnsembleGraph()` | `playScore()`, `exportSpecimenWav()` | one node topology for live and offline audio; only the LOLCODE lead passes through the creature filter (`creatureFilter()`, shared with the live vitrine sweep), with a parallel dry lead tap (−6 dB on bandpass creatures, −10 dB on lowpass ones); every other voice goes straight to the compressor and delay and still reaches the parlor reverb (D-042). `leadOctaveShift()` raises low-rooted leads by octaves to at least C3; `stop` ends looping sources for offline renders |
| Mixer console | `#mixer-engine` strips, plate ENGAGE/SILENCE switches, Bandstand buttons | `updateMixer()` → strip gains and pans in live and offline graphs | eight channels; fader `0..100` (80 = unity, 100 = +12 dB), pan `−100..100`, mute, solo; any solo isolates soloed channels and an explicit mute still wins; post-pan analyser drives VU meters live only |
| Offline render | `renderEnsembleLoop()` | WAV, stem, and MIDI exports | one 12-step loop through the shared graph starting at 0.04 s with a 1.35 s tail; overrides for strip levels, room levels, clockwork, muted plates, and note capture |
| Stem bundle | `#export-stems` | browser download | STORED ZIP of `01-lead.wav` … `08-mycelium.wav` (each channel alone at its fader and pan, mute/solo ignored), `09-parlor-room.wav`, and `README.txt` |
| MIDI score | `#export-midi`, scheduler `logNote()` calls | browser download | SMF Type 1, 480 PPQ; conductor track plus seven named parts on separate channels (drums on channel 10), the MANUAL part split into one track and channel per Fun Machine voice used (`funVoiceTracks()`, D-040); notes clipped to the loop |
| Session file / preset | `captureSession()` → `serializeSession()`; `.fun` file or `localStorage` → `parseSession()` / `parsePresetStore()` | `applySession()` | versioned JSON, every field required and range-checked; chords as `(root, quality)`, plate edits as per-cell click counts; restore re-summons the phrase then layers the rest |
| Master transport | `#transport-deck` buttons, `Space`/`Esc` via `transportCommandForKey()` | `runTransportCommand()` | `stopped`/`playing`/`paused` with a raw step cursor; pause resumes after the last audible step; audio runs only while playing and unmuted |
| Melody motif | `melodyFor()` | audio transport | exactly twelve frozen semitone offsets selected and rotated by validated score fields |
| Master volume | range input | active transport output gain | session-local `0..100` value mapped through a bounded perceptual curve; changes ramp over 18 ms |
| Tempo (BPM) | range input (`#tempo-bpm`) | active audio transport scheduler | session-local `36..208` BPM value initialized to `score.pulse` on summon (double-click restores native pulse); updates upcoming step durations in real time |
| Vitrine gesture | pointer events on `#vision` | Canvas renderer and active audio transport | transient normalized coordinates, hold, tap, and drag velocity modulate shape morphing, gaze, harmonic phase shift, filter/mix intensity, and synthesized percussion without mutating the score |
| Fun Machine accompanist | `triggerFunKey()` → `buildPerformance(key, style, genre, tonic)` | live scheduler, `applyEnsembleConductor()` | 13-key manual (`C..C'`) and `[A..K]` keys; a held key plays SWELL, ARPEGGIO, PROGRESSION, INTRO, BRIDGE, or OUTRO on the band's step grid (voice-led pad, two-per-step arpeggio, gliding lead, rulebook section progressions), re-conducts the band onto its chords, and ducks the LOLCODE lead and drones by 10 dB |
| Loop machine | `#looper` controls, `triggerFunKey()` | live scheduler, `recorderReduce()`, `applyEnsembleConductor()` | 16 loops × 4 takes × 12 steps; quick-generate buttons (`+ INTRO`, `+ GROOVE`, `+ BRIDGE`, `+ OUTRO`) synthesizing 48-step section movements and raw automaton band grooves directly from the active rulebook; live recording with 1-loop count-in, audible clock latching, layer isolation during new loop recording, armed downbeat sync with anticipation latching, clockwork tick metronome; musical section roles (Intro, Main, Bridge, Outro) with prelude Intro, cycling body, Outro cueing, and linear offline export; interactive 12-step tracker ribbon with click-to-edit note placement/clearing and auto-advancing STEP REC mode; exports full song to WAV, stems, and MIDI |

## Invariants

- A normalized phrase produces one stable score. Enforced by `tests/oracle.test.mjs` and D-003.
- The LOLCODE spell produces every parameter used to distinguish the creature. Enforced by required score fields and range validation.
- Malformed, duplicate, missing, unknown, or out-of-range output never reaches renderers. Enforced by `parseScore()` tests.
- Runtime assets remain local and dependency-free. Enforced by `tests/static.test.mjs` and D-001.
- Every module URL and every `src/` source fetch carries `?v=<ASSET_VERSION>`, a hash of `src/`, so a browser never links a fresh module to a cached old one. `index.html` writes the import map that stamps modules; `sourceUrl()` stamps sources. Enforced by `tests/assets.test.mjs` and D-035.
- The creature canvas lives in a centered, bounded apparition chamber at every viewport instead of acting as a full-page background. Enforced structurally in `tests/static.test.mjs` (D-011).
- Unsupported LOLCODE syntax fails with a line number. Enforced by the interpreter and its negative test.
- Rendering and sound share one immutable score. Enforced by the `showScore()` and `playScore()` call path.
- Only one audio transport loops at a time. Enforced by `stopCurrentSound()` before every start.
- The reading strip holds no controls, and the workstation wings appear in the order Perform → Mix → Band → Keep, so document order, heading outline, and keyboard focus agree. Enforced by `tests/static.test.mjs` and D-027.
- Live playback and WAV export build the same node topology. Enforced by `tests/transport.test.mjs` and D-023.
- Every ensemble bus passes through its own mixer strip (voicing trim → fader → pan), and the console opens at unity faders, centered, with default balance set only by `CHANNEL_VOICING_DB`. Enforced by `tests/transport.test.mjs`, `tests/mixer.test.mjs`, and D-024.
- A plate's ENGAGE/SILENCE switch and its mixer mute are the same state. Enforced by `tests/static.test.mjs` and D-024.
- WAV mix, stems, and MIDI all come from one offline scheduling path, and MIDI notes are recorded by the same scheduler calls that produce sound. Enforced by `tests/static.test.mjs` and D-025.
- Session data crosses into the app only through `parseSession()` or `parsePresetStore()`, and every `localStorage` access is guarded. Enforced by `tests/session.test.mjs`, `tests/static.test.mjs`, and D-026.
- Audio loops only while the transport is `playing` and the bell is unmuted; mute never changes transport state. Enforced by `runTransportCommand()` and D-023.
- Master volume changes only the post-compressor output gain and never changes the deterministic creature score. Enforced structurally in `tests/static.test.mjs` (D-009).
- Vitrine tap, hold, and drag gestures modulate transient visual morphing, pitch, intensity, and synthesized percussion and decay smoothly back to the immutable score on release. Enforced structurally in `tests/static.test.mjs` (D-012).
- Every melody family resolves to exactly twelve deterministic semitone offsets and the transport repeats them modulo twelve. Enforced by exact arpeggio and chromatic tests (D-010).
- Cellular appendages, fruiting body archetype, internal organelle texture, germ aperture, layout, and size all originate in the validated spell output. Enforced by required score fields and the batch diversity test (D-006, D-049).
- Every silhouette stays within a radius envelope of `0.38..1.08`, and every kinetic core is clipped to the current deforming body path. Enforced structurally in `tests/static.test.mjs` (D-007).
- Kinetic family, speed, depth, tilt, and boundary-flux family originate in validated spell output. Enforced by required ranges and the 256-phrase coverage test (D-007).
- Mycelial branching density, fruiting body archetype, and ballistospore emission originate in validated spell output (`fungal_form`, `fungal_hyphae`, `fungal_spores`, `fungal_bloom`). Enforced by required ranges and the phrase batch test (D-017).
- The Fun Machine's default voice originates in validated spell output too: `fun_voice` (`[0, 6]`) picks a preset, `fun_bright` (`[-3, 3]`) tilts its filters by up to half an octave, and `fun_spread` (`[0, 4]`) scales its detune, chorus, and width; `creatureVoice()` in `src/voices.mjs` builds and validates the result (D-040).
- Each creature's harmony originates in validated spell output: `harmony_turn` (`[0, 3]`), `harmony_swap` (`[0, 15]`), `harmony_borrow` (`[0, 3]`), `harmony_cadence` (`[0, 3]`), `harmony_pace` (`[0, 2]`), and `harmony_character` (`[0, 11]`, taken modulo the genres a creature can borrow from). Emitted since P5-30 phase 1; the conductor reads them from phase 2 on (D-043).
- Fun Machine chords are absolute pitch classes; they reach the conductor only through `toTonicRelative()`, so the band plays the same chord the pad plays. Enforced by `tests/accompaniment.test.mjs` and D-029.
- A held Fun Machine key's chords overlay the active genre spine via `customSpine` without altering virtual machine state or native LOLCODE score determinism. Enforced by `tests/oracle.test.mjs` and D-029. (The 12-step punch-in sequencer that also used it was removed in D-038.)
- Every rhythm template length divides the 12-step barline evenly ($12 \bmod \text{len} = 0$), mathematically guaranteeing zero polymetric loop drift across passes and seamless export loop tiling. Enforced by `tests/audit.test.mjs` (D-050).
- Summoned creature tempos fold into the musical groove pocket ($68\dots 144$ BPM) via 2:1 octave gears on summon and dblclick reset, while preserving the full $36\dots 208$ BPM manual slider and raw `score.pulse` LOLCODE determinism. Enforced by `tests/audit.test.mjs` (D-050).
- The vertical anti-clash sieve resolves accidental semitone collisions between passing melody tones and active accompaniment voices down to 0.00% under `CREATURE_GENRE`, while region-boundary damping prevents chord tail bleed across 3-step transitions. Enforced by `tests/audit.test.mjs` and `tests/clashes.test.mjs` (D-050).
- Voice envelope GainNodes initialize to `0.0001` at construction, pad releases cleanly anchor active gains via `cancelAndHoldAtTime` and cancel future look-ahead nodes before they sound, and legato key changes grace-window drone ducking to eliminate volume spikes. Enforced by `tests/voices.test.mjs` and `tests/audit.test.mjs` (D-051).

## Boundaries

| Boundary | Comes in as | Checked by | Rule |
| --- | --- | --- | --- |
| Phrase | user-controlled string | native length limit, normalization, empty check | never inserted as HTML or sent to a service |
| Spell source | same-origin text file | interpreter syntax and closed program checks | unsupported instructions fail closed |
| Spell output | line array | `parseScore()` allowlist, type, uniqueness, and ranges | no repair or best-effort coercion |
| Session file | user-chosen `.fun` file, at most 64 KB | `parseSession()` allowlist, types, ranges, enums; a v5 song through `validateSong()` (keys 0–12, three styles, a voice per slot, 16 loops × 4 takes × 12 steps, 32 passes); v4 songs open with every slot in VELVET PAD; v6 adds `varied` (AS WRITTEN), and v1–v5 open as written | rejected whole on the first bad field; never repaired |
| Stored presets | `localStorage` value on this origin | `parsePresetStore()` revalidates each preset on read | invalid entries dropped individually; storage errors degrade to files only |
| Stored cabinet | `localStorage` value on this origin | `parseCabinetState()` exact-key allowlist | anything malformed starts discovery fresh |
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
| Session presets | `localStorage` key `whimsy-machine.presets.v1` | SAVE PRESET | DELETE, or clearing site data | no |
| Cabinet mode and drawers | `localStorage` key `whimsy-machine.cabinet.v1` | opening or closing drawers, the cabinet switch | clearing site data | no |
| Static HTTP cache | browser-managed, keyed by `?v=<ASSET_VERSION>` URLs (D-035) | browser | a new stamp, or browser controls | no |

Because a file's content changes only together with its URL, the browser may keep any stamped module or source as long as it likes. Only `index.html`, which holds the stamp, should be revalidated: `tools/serve.py` does that locally with `Cache-Control: no-cache`, and a public host should do the same for the page (D-035).

Session presets (D-026) are the only data that outlive the tab. They stay on the device. The app uses no cookies, `sessionStorage`, IndexedDB, analytics, or service worker, and makes no outbound requests.

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
