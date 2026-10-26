// Product and engine versions (P8-03, D-077).
//
// APP_VERSION follows docs/CHANGELOG.md. ENGINE_VERSION is the promise that
// matters to a producer: two runs with the same engine version, phrase, and
// session sound the same. Bump it whenever a phrase or a saved session would
// sound different: a spell or VM program, a rulebook, a golden fixture, or a
// synthesis change. Sessions and exports record it, and opening a session
// from another engine version warns instead of quietly sounding different.
//
// ENGINE_FINGERPRINT hashes the score programs and the golden fixtures; the
// engine-version test fails when they change, as a reminder to bump. It cannot
// see JavaScript synthesis changes, which need the bump by hand.

export const APP_VERSION = "1.3.0-dev";
export const ENGINE_VERSION = 1;
export const ENGINE_FINGERPRINT = "bc8e12c85897b4ca";
export const ENGINE_FINGERPRINT_FILES = Object.freeze([
  "src/oracle.lol",
  "src/beat.mal",
  "src/bass.bf",
  "src/harmony.bfg",
  "src/pad.piet",
  "src/chimes.frac",
  "src/chant.spl",
  "src/conductor.i",
  "src/rulebooks.ni",
  "tests/fixtures/rulebooks-golden.json",
  "tests/fixtures/variations-golden.json",
]);
