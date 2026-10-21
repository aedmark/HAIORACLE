# Testing

Automated checks prove determinism, boundary validation, the required LOLCODE subset, and static project structure. They do not judge whether the creature looks compelling or the mix sounds good.

## Suites

| Suite | File | Proves | Does not prove | Needs |
| --- | --- | --- | --- | --- |
| Oracle logic | `tests/oracle.test.mjs` | deterministic hashing, valid score ranges, batch name/body/eye/scale/kinetic/melody/beat diversity, exact twelve-note arpeggio and chromatic motifs, Malbolge `crazy`/`rotr` ternary VM and `src/beat.mal` execution, negative LOLCODE and Malbolge interpreter behavior | browser API integration or sensory quality | Node 20 or newer |
| Session boundary | `tests/session.test.mjs` | `.fun` round-trip, field-level rejection, size and JSON limits, prototype-key refusal, preset ordering/capping/corruption recovery, console rebuild, exact chord rebuild, per-cell edit replay | browser storage behavior across real private windows or quotas | Node 20 or newer |
| Export writers | `tests/export.test.mjs` | CRC-32 check value, ZIP round-trip and determinism, entry-name safety, MIDI VLQ examples, Type 1 structure, tempo, programs, drum channel, loop clipping, velocity scaling | that a DAW imports the files as intended | Node 20 or newer |
| Fun Machine accompanist | `tests/accompaniment.test.mjs` | performance shape per style and genre, chord colouring, pad register and voice leading, arpeggio figure, raw-chaos fallback, tonic-relative conversion | how the pad, arpeggio, and lead sound or feel to play | Node 20 or newer |
| Inform 7 rulebooks | `tests/inform.test.mjs` | every subset construct (kinds, values, properties and defaults, either/or adjectives, globals, tables with `--` and `(continued)`, first-match rulebooks with `at most`, `at least`, `listed in`, `not`, `and`), out-of-subset rejection with line numbers, compile validation messages, deterministic frozen output, and how the conductor applies each compiled method (colours, progressions, spines, Tonnetz walks, melody projection, bass walks, organ voicings, overtones) | full Inform 7 semantics; only the documented subset | Node 20 or newer |
| Extra genre | `tests/seventh-genre.test.mjs` with `tests/fixtures/barbershop.ni` | a test-only genre written only in Inform 7 compiles after the canonical genres without changing them, and the Fun Machine, conductor (changes, bass walk, organ voicing, melody, overtones), and session validation all play or accept it; no `src/*.mjs` or `index.html` names it | that the genre sounds good; it is never shipped | Node 20 or newer |
| Rulebook contract | `tests/rulebooks.test.mjs` with `tests/rulebook-capture.mjs` and `tests/fixtures/rulebooks-golden.json` | every Kapellmeister genre decision matches the frozen capture exactly (P5-23, D-033; re-frozen on purpose for the D-043 clash fixes): Fun Machine chord colours and progressions, genre spines over sample scores and mutations, melody projection over every pitch and strictness, and the full conducted ensemble with and without a punched spine | that the frozen behaviour is musically right; only that it is unchanged | Node 20 or newer |
| Clash ceilings | `tests/clashes.test.mjs` | over 60 phrases, the share of steps where two conducted parts sound a semitone apart outside the chord stays under a per-genre ceiling, as written and varied (D-043); chord members from a chord's own tones, avoid-note resolution, chord-fitting chimes, and walks landing on members | timbre, register, or anything a listener would call a clash between non-adjacent notes | Node 20 or newer |
| Genre variation | `tests/variation.test.mjs` with `tests/variation-capture.mjs` and `tests/fixtures/variations-golden.json` | every fettered genre permits real moves and reaches a floor of distinct progressions over 80 creatures; variations are deterministic, keep home unless rotated, and hold their chords' roots and thirds; the harmonic clock spreads a spine over four passes with changes only on four-step boundaries (D-044); 24 sample creatures' varied progressions match the frozen fixture (re-freeze with `node tools/freeze_variations.mjs --rewrite` only on purpose) | that a variation sounds good | Node 20 or newer |
| Loop machine model | `tests/looper.test.mjs` | append, overdub, undo, delete, and move; the 16-loop, 4-layer, 1–8-repeat, and 32-pass limits; song position through repeats and wrap-around; the newest-layer follow rule and live override; recorder timing (next boundary; overdub waits for its loop; one pass); strict song validation | sound, timing in the browser, or the strip UI (later phases) | Node 20 or newer |
| Discovery and the cabinet | `tests/cabinet.test.mjs` | drawers in page order with one trigger each, unlock-once and closed-stays-closed rules, the whole cabinet and the return to discovery, remembered-state round trip and rejection of malformed storage | how discovery feels to a first-time visitor, or screen-reader announcements in real assistive technology | Node 20 or newer |
| Mixer model | `tests/mixer.test.mjs` | channel list, fader taper and dB readout, pan clamping, mute/solo precedence, Bandstand group mutes, meter RMS/peak math | how the console sounds or feels to operate | Node 20 or newer |
| Transport and graph | `tests/transport.test.mjs` | shared ensemble graph routing, mixer strips, meter taps, vitrine pan trim, and live/offline topology parity via a fake `AudioContext`, transport state transitions and cursor handling, `Space`/`Esc` focus rules | real audio output, timing under load, or how pause/resume sounds | Node 20 or newer |
| Cache boundary | `tests/assets.test.mjs` | `ASSET_VERSION` in `index.html` matches the hash of `src/`, the import map lists exactly the import closure of `src/app.mjs`, `index.html` has no other script, and every source fetch goes through `sourceUrl()` (D-035) | how a particular host or browser caches; check a real host's headers | Node 20 or newer |
| Static structure | `tests/static.test.mjs` | required assets (`src/oracle.lol`, `src/beat.mal`, `manual.html`, `docs/manual.json`), basic labels, centered apparition-stage and serif-broadsheet markers, continuous scheduler and master-volume markers, bounded silhouette and clipped-core markers, vitrine tap/hold/drag interaction and percussion markers, Malbolge 12-step beat matrix and percussion scheduler markers, perform/mix/keep/band wing order with a control-free reading strip (D-027), no audio-driven visual resizing, scoped body glow, no remote runtime references | computed accessibility tree, scheduler timing, perceived loudness, or visual quality | Node 20 or newer |
| Documentation | `tools/check_docs.py` | no placeholders, broken local links, or unknown roadmap and decision references | factual accuracy of every claim | Python 3 |
| 3x Manual | `tools/manual.py` | structural validity, What/How/Why completeness, and evidence integrity of `docs/manual.json` | subjective prose elegance | Python 3 |

The fast set and full automated set are:

```bash
node --test tests/*.test.mjs
python3 tools/check_docs.py
python3 tools/manual.py check docs/manual.json
```

Expected results from specific runs live in `HANDOFF.md`.

## Before a run

- No setup, install, account, secret, or persistent state is required. The one fixture, `tests/fixtures/rulebooks-golden.json`, is committed.
- Run commands from the repository root.
- Tests write no project files.
- A browser review requires serving the directory over HTTP, preferably with `python3 tools/serve.py`. Direct `file:` loading cannot fetch the spell.
- After any `src/` edit, run `node tools/stamp_assets.mjs`; the cache-boundary test names the expected stamp when it is stale.

## Adding a check

- Put interpreter and score behavior in `tests/oracle.test.mjs`.
- Put asset and shell invariants in `tests/static.test.mjs`.
- Import `tests/install-rulebooks.mjs` before calling any genre-dependent conductor, accompanist, or session function; the genres come from `src/rulebooks.ni`.
- Assert returned values and rejected boundaries instead of message wording where practical.
- Make a new behavioral check fail against the broken implementation before trusting it.
- Never regenerate `tests/fixtures/rulebooks-golden.json` to make a failing rulebook test pass. It is the P5-23 migration contract. `node tools/freeze_rulebooks.mjs --rewrite` is only for an intentional, recorded change to genre behaviour.

## Change-to-check matrix

| Changed area | Minimum checks | Additional evidence |
| --- | --- | --- |
| Documentation only | documentation checker | read changed claims against code |
| LOLCODE spell, interpreter, hash, or score | full automated set | confirm an existing phrase stays compatible or document the break |
| Canvas or audio rendering | full automated set | manual browser review with sound |
| Controls, layout, or accessibility | full automated set | keyboard, narrow viewport, reduced motion, and screen-reader review |
| Dependency boundary | full automated set | inspect network requests and record an accepted decision |
| Adding, renaming, or removing a `src/` module or source | full automated set; update `MODULES` in `index.html` and restamp | load the page over HTTP and confirm every `/src/` request carries the new `?v=` |
| Kapellmeister rulebooks or conductor | full automated set; the rulebook contract must pass unchanged | a deliberate musical change needs a decision record and a `--rewrite` of the fixture in the same commit |

## Manual checks before a release

1. Serve the repository and summon three phrases in current Chrome, Firefox, and Safari.
2. Confirm sound starts only after a gesture, loops without an audible gap, mutes immediately, restarts, and is replaced cleanly by a new summon.
3. Change plates, progression, rulebook, room, tempo, and console; save a preset and a `.fun` file; reload; restore both and confirm everything returns. Repeat in a private window, where presets may be unavailable but files must still work.
4. Export stems and MIDI, import both into a DAW at the README tempo, and confirm the nine stems line up and loop, the MIDI parts land on their own tracks, and drums map to a GM kit.
5. Ride each mixer fader, pan, mute, and solo during playback; confirm meters track each bandmate, a plate's ENGAGE/SILENCE switch and its mixer M button always agree, and a WAV export reflects the console.
6. Play, pause, and resume mid-loop; confirm resume picks up on the next step without a skipped or doubled beat, Stop rewinds to step one, and `Space`/`Esc` work after clicking a plate button but `Space` still activates a button reached with Tab.
7. Move master volume through zero, the default 82 percent, and maximum using pointer and keyboard; confirm live ramps are smooth and the loudest dense voice does not clip or pump.
8. Listen to every named motif family; confirm each forms a recognizable twelve-note loop and that restarts return to its first note.
9. Confirm repeated text produces identical metadata and creature structure.
10. Summon enough creatures to inspect every eye silhouette, iris treatment, pupil geometry, and layout for clipping or illegibility.
11. Inspect all eight kinetic cores and silhouette-flux families for distinct motion, boundary containment, legibility, and stable frame rate.
12. Tap, press-and-hold, and hold-and-drag across the vitrine with mouse and touch; confirm percussive strikes, ratchet ticks, pitch bends, filter swells, eye tracking, and shape morphing respond smoothly and return to the resting creature on release.
13. Use keyboard-only controls at desktop and narrow mobile widths.
14. Confirm the cabinet remains bilaterally balanced, the apparition stays centered in its bell-jar vitrine, labels do not collide, and the serif and telegraph-monospace stacks remain legible at desktop and phone widths.
15. Enable reduced motion and confirm the interface remains legible, calm, and frozen at a representative phase.
16. Inspect the network panel for unexpected outbound requests.

## Known pitfalls

- Web Audio tests require human listening. An oscillator scheduling without throwing does not prove a good mix.
- Timer throttling in background tabs can affect scheduling; the short look-ahead window limits the damage but requires browser review.
- Canvas snapshots are sensitive to browser, graphics stack, pixel ratio, and time. Test score inputs structurally and review the actual animation manually.
- Plain `python3 -m http.server` sends no `Cache-Control`, so browsers reuse files heuristically and can pair a fresh `src/app.mjs` with an old `src/ensemble.mjs` ("does not provide an export named ...", 2026-10-20). The version stamp prevents this (D-035) only if it is current: restamp after every `src/` edit, and develop with `python3 tools/serve.py`.
- FNV-1a collisions are possible. The seed is an identity affordance, not a cryptographic identifier.
