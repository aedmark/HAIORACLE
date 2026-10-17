# Architecture

HAI, ORACLE! is a static browser application. A phrase is normalized and hashed locally, the resulting seed enters a purpose-built LOLCODE interpreter, and `src/oracle.lol` emits a text score. The host validates every field before Canvas and Web Audio render a named looping creature. Nothing leaves the browser and the app retains no state after the page closes.

Rationale lives in [DECISIONS.md](DECISIONS.md).

## Code map

| Area | Where | Entry point | Talks to |
| --- | --- | --- | --- |
| Page shell | `index.html`, `styles.css` | document load | browser host |
| Browser host | `src/app.mjs` | form submission | score compiler, Canvas, Web Audio |
| Phrase and score boundary | `src/score.mjs` | `composeScore()` | interpreter |
| LOLCODE runtime | `src/lolcode.mjs` | `runLolcode()` | spell source only |
| Composition | `src/oracle.lol` | `HAI 1.2` program | interpreter output |
| Verification | `tests/` | Node test runner | pure modules and static assets |

## Interfaces and data flow

```text
phrase -> normalize and FNV-1a hash -> INPUT_SEED
      -> LOLCODE spell -> key=value lines -> strict score validation
      -> shared immutable score -> Canvas creature + Web Audio composition + text reading
```

| Interface | Producer | Consumer | Contract |
| --- | --- | --- | --- |
| `INPUT_SEED` | `hashPhrase()` | `src/oracle.lol` | unsigned 32-bit integer |
| LOLCODE output | `runLolcode()` | `parseScore()` | one known `key=integer` per line; all required keys exactly once |
| Score object | `composeScore()` | `src/app.mjs` | frozen, range-checked object with twelve note choices plus musical, visual, and naming grammar indices |
| User gesture | summon, replay, or unmute button | Web Audio | audio context starts or resumes only from the gesture path |
| Audio scheduler | current score and audio clock | Web Audio nodes | schedules roughly 280 ms ahead and repeats until stopped or replaced |

## Invariants

- A normalized phrase produces one stable score. Enforced by `tests/oracle.test.mjs` and D-003.
- The LOLCODE spell produces every parameter used to distinguish the creature. Enforced by required score fields and range validation.
- Malformed, duplicate, missing, unknown, or out-of-range output never reaches renderers. Enforced by `parseScore()` tests.
- Runtime assets remain local and dependency-free. Enforced by `tests/static.test.mjs` and D-001.
- Unsupported LOLCODE syntax fails with a line number. Enforced by the interpreter and its negative test.
- Rendering and sound share one immutable score. Enforced by the `showScore()` and `playScore()` call path.
- Only one audio transport loops at a time. Enforced by `stopCurrentSound()` before every start.

## Boundaries

| Boundary | Comes in as | Checked by | Rule |
| --- | --- | --- | --- |
| Phrase | user-controlled string | native length limit, normalization, empty check | never inserted as HTML or sent to a service |
| Spell source | same-origin text file | interpreter syntax and closed program checks | unsupported instructions fail closed |
| Spell output | line array | `parseScore()` allowlist, type, uniqueness, and ranges | no repair or best-effort coercion |
| Browser capabilities | Canvas and Web Audio APIs | feature use at runtime | a failure surfaces as status text and console detail |

## Dependencies

The application has no third-party runtime or build dependencies. It relies on current browser implementations of Canvas, Web Audio, ECMAScript modules, and `fetch`. Local verification uses Node and Python standard-library tools supplied by the development environment.

## State and caches

| What | Where | Written by | Reset by | Committed? |
| --- | --- | --- | --- | --- |
| Current phrase and score | browser memory | `src/app.mjs` | reload or tab close | no |
| Audio graph and loop timer | browser audio context and window | `playScore()` | mute, replacement, reload, or tab close | no |
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

- “LOLCODE 1.2” names the syntax profile of the spell. The interpreter implements only the explicitly documented subset.
- Cross-browser sensory quality remains unverified until P4-01.
