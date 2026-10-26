import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import test from "node:test";

import { APP_VERSION, ENGINE_FINGERPRINT, ENGINE_FINGERPRINT_FILES, ENGINE_VERSION } from "../src/version.mjs";

test("P8-03 the engine fingerprint matches the score programs and golden fixtures", () => {
  const hash = createHash("sha256");
  for (const file of ENGINE_FINGERPRINT_FILES) {
    hash.update(`${file}\n`);
    hash.update(readFileSync(new URL(`../${file}`, import.meta.url), "utf8").replace(/\r\n/g, "\n"));
  }
  const fingerprint = hash.digest("hex").slice(0, 16);
  assert.equal(
    fingerprint,
    ENGINE_FINGERPRINT,
    `A score program or golden fixture changed. If phrases now sound different, bump ENGINE_VERSION (now ${ENGINE_VERSION}) in src/version.mjs; then set ENGINE_FINGERPRINT to "${fingerprint}" (D-077).`,
  );
});

test("P8-03 versions are well formed", () => {
  assert.ok(Number.isInteger(ENGINE_VERSION) && ENGINE_VERSION >= 1);
  assert.match(APP_VERSION, /^\d+\.\d+\.\d+(-[a-z0-9.]+)?$/);
});
