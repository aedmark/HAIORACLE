import assert from "node:assert/strict";
import test from "node:test";
import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";

test("Whimsy Machine C reference implementation compiles and passes all golden tests (P7-02)", () => {
  assert.ok(existsSync("firmware-c/whimsy_esoteric.h"), "whimsy_esoteric.h exists");
  assert.ok(existsSync("firmware-c/whimsy_esoteric.c"), "whimsy_esoteric.c exists");
  assert.ok(existsSync("firmware-c/whimsy_fm1_synth.h"), "whimsy_fm1_synth.h exists");
  assert.ok(existsSync("firmware-c/whimsy_fm1_synth.c"), "whimsy_fm1_synth.c exists");
  assert.ok(existsSync("firmware-c/test_whimsy.c"), "test_whimsy.c exists");

  // Compile with native gcc or clang
  execFileSync("gcc", [
    "-Wall", "-Wextra", "-O2",
    "firmware-c/whimsy_esoteric.c",
    "firmware-c/whimsy_fm1_synth.c",
    "firmware-c/test_whimsy.c",
    "-lm",
    "-o", "firmware-c/test_whimsy",
  ]);

  // Run executable
  const output = execFileSync("./firmware-c/test_whimsy", { encoding: "utf8" });
  assert.match(output, /All Whimsy Machine C tests passed successfully!/);
  assert.match(output, /C FNV-1a phrase hashing matches JS contract/);
  assert.match(output, /C Euler Gradus Suavitatis matches Euler 1739 formula/);
  assert.match(output, /C Brainfuck VM matches canonical src\/bass\.bf 12-byte golden output/);
  assert.match(output, /C Malbolge VM matches canonical src\/beat\.mal 12-step golden output/);
  assert.match(output, /C Befunge-93 VM matches canonical src\/harmony\.bfg 12-cell golden output/);
  assert.match(output, /C FRACTRAN prime-ratio VM executes state transition accurately/);
  assert.match(output, /C FM-1 native audio synthesis engine renders valid 128-frame Q23 stereo blocks/);
});
