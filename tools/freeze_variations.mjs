// Freezes how sample creatures vary their genres (D-043) into
// tests/fixtures/variations-golden.json. Refuses to overwrite it unless
// `--rewrite` is passed on purpose, after a deliberate change to the moves.
//
//   node tools/freeze_variations.mjs [--rewrite]

import { existsSync } from "node:fs";
import { writeFile } from "node:fs/promises";

import "../tests/install-rulebooks.mjs";
import { captureVariations, serializeVariations } from "../tests/variation-capture.mjs";

const target = new URL("../tests/fixtures/variations-golden.json", import.meta.url);
if (existsSync(target) && !process.argv.includes("--rewrite")) {
  console.error("tests/fixtures/variations-golden.json already exists. Pass --rewrite only on purpose.");
  process.exit(1);
}
const text = serializeVariations(await captureVariations());
await writeFile(target, text);
console.log(`wrote tests/fixtures/variations-golden.json (${text.length.toLocaleString("en")} bytes)`);
