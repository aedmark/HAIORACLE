# Security

Edmark's Esoteric Fun Machine is a local static toy with no accounts, backend, analytics, or secrets. Its only durable data is the session presets a player saves in their own browser (D-026). This narrow surface reduces risk without claiming the project is vulnerability-free.

## Supported versions

| Version or branch | Security fixes |
| --- | --- |
| `main` before the first tagged release | supported |

## Report a vulnerability

Until a public reporting address exists, contact the repository maintainer privately. Include impact, affected commit, reproduction steps, and any workaround. Do not include real credentials or personal data. Public disclosure timing is coordinated with the maintainer.

## Assets and boundaries

| Asset or boundary | Threat | Protection | Owner |
| --- | --- | --- | --- |
| Phrase input | oversized input or DOM injection | 72-character control limit, normalization, text-only DOM assignment | score boundary |
| LOLCODE source | malformed or expanded program | same-origin asset, narrow interpreter, unsupported syntax fails closed | interpreter |
| Score output | unknown keys, duplicate fields, invalid values | allowlist, exact required set, integer and range checks | score parser |
| Audio output | startling or persistent playback | user gesture, visible mute, low master gain, clean stop on mute or replacement | browser host |
| Session files (`.fun`) | malformed, oversized, or hostile JSON | 64 KB limit, `parseSession()` allowlist with exact fields, integer ranges, and enums (the v4 loop-machine song is validated the same way by `validateSong()`); rejected whole; values reach the page only as text or form values | session boundary |
| Stored presets | tampered or corrupt `localStorage` value; blocked storage | revalidated on every read, bad entries dropped, every access wrapped so failure falls back to files |
| Stored cabinet | tampered or corrupt `localStorage` value; blocked storage | `parseCabinetState()` accepts only `{ mode, open, seen }` with known values, otherwise starts fresh; every access wrapped | session boundary |
| User privacy | phrase disclosure | no outbound requests, logs, or analytics; presets stay on-device and are deleted with DELETE or by clearing site data; `.fun` files, PNG plates, and `#omen=` links contain the phrase and travel only where the player sends them | whole application |

## Secure development rules

- Keep credentials, personal data, and production-derived material out of the repository.
- Insert user-controlled text with `textContent` or form values, never HTML parsing.
- Preserve score validation between interpreter and renderers.
- Keep audio user-controlled, moderate in level, and immediately stoppable.
- Treat any proposed remote asset, analytics call, new storage, or dependency as a boundary change requiring a decision and review. Session presets (D-026) and the remembered cabinet mode and drawers (D-037) are the two accepted `localStorage` stores; keep them on-device and validated.
- Do not describe the deterministic seed as cryptographic or globally unique.

## Verification

`tests/static.test.mjs` rejects remote runtime URLs, unguarded `localStorage` access, and any `sessionStorage`, IndexedDB, or cookie use. `tests/oracle.test.mjs` covers malformed and out-of-range score rejection. `tests/session.test.mjs` covers session and preset rejection, including unknown keys, prototype keys, out-of-range values, and oversized files. Manual release review must inspect network traffic and browser behavior. There is no automated dependency scan because the project has no dependency manifest.

## Incident response

For suspected active exploitation or accidental data disclosure, stop publishing the affected revision, preserve a minimal reproduction without personal data, notify the maintainer, patch the boundary, and document the user-visible fix after coordinated disclosure.
