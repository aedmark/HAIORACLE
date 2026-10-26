# The Whimsy Machine

The Whimsy Machine is a zero-dependency browser toy and play-along synthesizer that turns a short phrase into a deterministic looping audiovisual omen with real-time organ accompaniment. A purpose-built browser interpreter executes the generative score in LOLCODE 1.2 (the *HAI, ORACLE!* spell); Canvas and Web Audio render the score and auto-chord organ without sending data off-device.

This is the canonical instruction file for coding agents. `CLAUDE.md` imports it. Project facts belong in the documents linked below.

## Start here

1. Read `docs/HANDOFF.md` for current state and active work.
2. Read the relevant `ROADMAP.md` item and applicable parts of `docs/ARCHITECTURE.md` and `docs/TESTING.md`.
3. Inspect `git status` and recent history. Preserve work you did not create.
4. Verify important inherited claims with the fastest relevant check.
5. Work on one independently reviewable change at a time.

For an unfamiliar session, read `README.md` and `docs/README.md` first. Stop for maintainer direction when a request conflicts with these instructions or overlaps unrelated working-tree edits.

## While working

- Reference roadmap IDs where they exist. Do not invent one for an incidental fix.
- Keep changes scoped and preserve user work.
- Record durable, revisitable choices in `docs/DECISIONS.md`.
- Update documentation when behavior, interfaces, commands, risks, or structure change.
- Distinguish observations from inference. Date volatile claims.
- Prefer executable checks for important invariants.
- Treat phrase input and LOLCODE output as untrusted boundary data.
- Add discovered work to the roadmap only when it is genuinely out of scope.

## Finishing a change

1. Run the checks specified in `docs/TESTING.md`.
2. Review the diff for unrelated edits, generated files, credentials, stale names, and documentation drift.
3. Update `docs/HANDOFF.md` when current state materially changes or work pauses.
4. Update other documents only when their trigger in `docs/README.md` applies.
5. Run `python3 tools/check_docs.py`.

## Working agreement

This repository uses direct-to-main development for the current prototype. The maintainer and an agent explicitly asked to implement a change may edit and commit after relevant checks pass. Publishing, adding runtime dependencies, deleting user data, rewriting history, and changing the product premise require explicit maintainer permission.

- Default branch: `main`.
- Working branch pattern when branches become useful: `feature/<topic>`.
- Commit format: imperative summary, with a roadmap ID when the commit completes planned work.
- Release scheme: semantic versioning, with `docs/CHANGELOG.md` as the human-readable record.

Never force-push or rewrite shared history.

## Maintainer preferences

- **Writing:** Direct, playful, concrete. Preserve the LOLCODE voice without burying instructions in jokes.
- **Code comments:** Explain boundaries and surprising choices. Do not narrate obvious syntax.
- **Asking vs. doing:** Implement bounded reversible work. Ask before publishing, adding dependencies, or expanding data collection.
- **Reporting:** Lead with what now works, then exact verification and honest gaps.

## Protected areas

| Path or thing | Rule | Why |
| --- | --- | --- |
| `LICENSE` | Do not change without maintainer permission | Legal ownership and terms are maintainer-controlled |
| Determinism contract | Do not change casually | A phrase must summon the same creature across supported runs |
| Zero-dependency boundary | Requires an accepted decision | It defines portability, privacy, and the product's technical character |

## Names and terms

| Canonical term | Meaning | Avoid confusing with |
| --- | --- | --- |
| The Whimsy Machine | The product | A generic synthesizer or toy |
| HAI, ORACLE! | The underlying generative score spell and engine | The overarching product |
| spell | `src/oracle.lol`, the score-generating program | JavaScript rendering code |
| score | Validated parameters emitted by the spell | Rendered sound alone |
| creature | The combined named visual and musical result | A stored user profile |
| host | Browser adapters, interpreter, Canvas, and Web Audio | A server or remote service |

## Repository map

| Path | Purpose |
| --- | --- |
| `index.html` | Static application shell |
| `styles.css` | Responsive visual system |
| `src/oracle.lol` | Canonical LOLCODE score generator |
| `src/lolcode.mjs` | Purpose-built LOLCODE interpreter |
| `src/beat.mal` | Canonical Malbolge 1998 ternary beat generator |
| `src/malbolge.mjs` | Malbolge virtual machine and 12-step ternary cadence engine |
| `src/bass.bf` | Canonical Brainfuck 1993 walking bass tape generator |
| `src/brainfuck.mjs` | Brainfuck tape interpreter and 12-cell bassline engine |
| `src/harmony.bfg` | Canonical Befunge-93 2D torus mirror chord organ |
| `src/befunge.mjs` | Befunge-93 2D torus interpreter and 12-step chord organ engine |
| `src/pad.piet` | Canonical Piet 2001 25×5 clockwise codel chorus canvas |
| `src/chimes.frac` | Canonical FRACTRAN 1987 prime-ratio overtone chime program |
| `src/fractran.mjs` | Piet codel and FRACTRAN prime-exponent interpreters and 12-step chime engine |
| `src/chant.spl` | Canonical Shakespeare Programming Language 2001 3-Act tragedy and formant choir script |
| `src/shakespeare.mjs` | Shakespeare Programming Language interpreter and 12-scene formant vowel choir engine |
| `src/conductor.i` | Canonical INTERCAL 1972 orchestral conductor score |
| `src/intercal.mjs` | INTERCAL 1972 virtual machine and 12-step dynamic arrangement orchestrator |
| `src/creature-rulebook.mjs` | THE CREATURE'S OWN rulebook: changes written from the creature's scale through the Inform 7 functional grammar (D-043) |
| `src/variation.mjs` | A creature's variation on its genre's changes: rotation, substitutions, borrowing, cadences, pace (D-043) |
| `src/conductor.mjs` | Euler *Gradus Suavitatis*, Neo-Riemannian *Tonnetz*, and Euclidean rhythm ensemble conductor |
| `src/rulebooks.ni` | Canonical Inform 7 (subset) Kapellmeister genre rulebooks |
| `src/inform.mjs` | Inform 7 subset interpreter and rulebook compiler |
| `src/ensemble.mjs` | Shared Web Audio ensemble graph for live playback and offline WAV export |
| `src/accompaniment.mjs` | Fun Machine one-finger accompanist: styles, pad voicing, arpeggios, tonic-relative chords |
| `src/mycelium.mjs` | Mycelium bio-acoustic voice: eight per-form sounds shaped by hyphae, spores, and bloom (D-042) |
| `src/voices.mjs` | Fun Machine voice patches, their validator, and the pad, pluck, and lead synths (D-040) |
| `src/looper.mjs` | Fun Machine loop machine model: songs, loops, stacked takes, recorder, follow rule (D-039) |
| `src/cabinet.mjs` | Discovery drawers and the whole-cabinet mode: state, unlock rules, on-device memory |
| `src/mixer.mjs` | Eight-channel mixing console state, fader taper, solo rules, and VU meter math |
| `src/session.mjs` | Validated `.fun` session format and on-device preset store |
| `src/zip.mjs` | Zero-dependency STORED ZIP writer for stem bundles |
| `src/midi.mjs` | Standard MIDI File (Type 1) writer for the ensemble score |
| `src/midi-io.mjs` | Web MIDI input/output and Web Audio sink routing adapter (D-061) |
| `src/transport.mjs` | Master transport state model and `Space`/`Esc` hotkey rules |
| `src/score.mjs` | Phrase hashing, score validation, and naming |
| `src/share.mjs` | Client-only `#omen=...` URL fragment encoding and PNG broadsheet filename helpers |
| `src/vitrine-canvas.mjs` | Apparition Vitrine 2D Canvas renderer (`OracleVision`), silhouette/kinetic/appendage/mycelium geometry, and gesture physics (D-067) |
| `src/broadsheet.mjs` | 1200×1520 engraved specimen broadsheet PNG Canvas renderer (D-067) |
| `src/schedulers.mjs` | Per-step Web Audio voice schedulers, vitrine percussion, and parlor acoustic buffers (D-067) |
| `src/audio-export.mjs` | Studio-grade 16/24/32f WAV encoder, tail folding, dither, and sampler metadata (P8-01, D-076) |
| `src/tuning.mjs` | Concert pitch A4 tuning reference, score key/mode overrides, and 4/4 bar lock step timing (P8-04, P8-05, D-078, D-079) |
| `src/version.mjs` | Product application version, engine versioning, and score/fixture fingerprint (P8-03, D-077) |
| `src/inspector.mjs` | "Under the Parlor Glass" live esoteric VM step inspector for Plates I–V in Wing III (P5-34, D-069) |
| `src/herbarium.mjs` | "The Naturalist's Herbarium" on-device curio gallery, miniature SVG portrait geometry, and side-by-side trait comparator (P5-35, D-070) |
| `src/manuscript.mjs` | "The Kapellmeister's Manuscript" live Inform 7 custom rulebook sandbox compiler and line-numbered diagnostic adapter (P5-36, D-071) |
| `src/app.mjs` | Browser controls, DOM wiring, session orchestration, and transport loop |
| `src-tauri/` | Isolated Tauri v2 desktop wrapper and native application packaging (D-064) |
| `.github/workflows/ci.yml` | Lightweight GitHub Actions CI verification workflow (P4-04) |
| `.github/workflows/release.yml` | Multi-platform GitHub Actions release workflow for Linux, Windows, and macOS (D-066) |
| `manual.html` | Standalone explorable 3x technical manual |
| `docs/manual.json` | 3x documentation scheme manual source of truth |
| `firmware-c/` | Standalone C reference implementation and native M-VAVE FM-1 firmware application (D-073, D-074, D-075) |
| `tests/` | Dependency-free Node tests |
| `ROADMAP.md` | Planned work with stable IDs |
| `docs/` | Architecture, decisions, tests, risks, and current state |
| `tools/check_docs.py` | Documentation consistency checker |
| `tools/manual.py` | 3x documentation manual validator and builder |
| `tools/build_desktop.sh` | Builds the standalone desktop application binary with Tauri v2 and Cargo |
| `tools/stage_tauri_dist.mjs` | Stages static frontend assets into `src-tauri/dist/` for Tauri bundling |
| `tools/stage_neocities.py` | Stages static deployment bundle for Neocities with .txt fallbacks (D-065) |
| `tools/build_fm1_firmware.py` | Builds and packages the standalone M-VAVE FM-1 firmware container (.fwsc) (D-075) |
| `tools/flash_fm1.html` | Standalone Web MIDI firmware flasher for M-VAVE FM-1 (P7-05) |
| `tools/freeze_rulebooks.mjs` | One-time freezer for the Kapellmeister rulebook golden fixture (P5-23) |
| `tools/freeze_variations.mjs` | Freezes sample creatures' varied progressions into `tests/fixtures/variations-golden.json` (D-043) |
| `tools/stamp_assets.mjs` | Restamps `ASSET_VERSION` in `index.html` from a hash of `src/` (D-035) |
| `tools/serve.py` | Standard-library dev server that sends `Cache-Control: no-cache` (D-035) |

## Engineering conventions

- Use browser-native HTML, CSS, Canvas, Web Audio, and ECMAScript modules.
- Support current evergreen browsers. A static HTTP origin is required because the app fetches `src/oracle.lol`.
- Keep `src/oracle.lol` causal: every audiovisual parameter originates in its score output.
- Reject malformed interpreter output before it reaches audio or rendering code.
- Load browser modules only through the `index.html` import map and fetch `src/` sources only through `sourceUrl()`, so every URL carries `ASSET_VERSION` (D-035).
- Add no runtime or build dependency without explicit maintainer approval and an accepted decision.
- Commit authored source. Do not commit caches, coverage output, or generated bundles.

## Environments

| Environment | Can access | Caveats |
| --- | --- | --- |
| Local development | Static files, local HTTP server, Node tests, browser APIs | Audio begins only after a user gesture |
| Static hosting | HTTPS, browser APIs, same-origin assets | No server runtime and no persistence |
| CI | Node's built-in test runner and documentation checker | Does not prove audio quality or visual composition |

## Run and verify

- Setup: none.
- Run: `python3 tools/serve.py` (port 8000; plain `python3 -m http.server` lets browsers cache stale modules).
- After editing anything under `src/`: `node tools/stamp_assets.mjs`, or the cache-boundary test fails (D-035).
- Fast checks: `node --test tests/*.test.mjs`.
- Full checks: `node --test tests/*.test.mjs && python3 tools/check_docs.py && python3 tools/manual.py check docs/manual.json`.
- Detailed guidance: `docs/TESTING.md`.
