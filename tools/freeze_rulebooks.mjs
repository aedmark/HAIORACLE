// Freezes the Kapellmeister rulebooks' current behaviour into
// tests/fixtures/rulebooks-golden.json (P5-23, D-033). Run once, before the
// rulebooks migrate to Inform 7; afterwards the fixture is the contract, so
// this refuses to overwrite it unless `--rewrite` is passed deliberately.
//
//   node tools/freeze_rulebooks.mjs [--rewrite]

import { existsSync } from "node:fs";
import { writeFile } from "node:fs/promises";

import { captureRulebooks, serializeCapture } from "../tests/rulebook-capture.mjs";

const target = new URL("../tests/fixtures/rulebooks-golden.json", import.meta.url);
if (existsSync(target) && !process.argv.includes("--rewrite")) {
  console.error("tests/fixtures/rulebooks-golden.json already exists; it is the migration contract. Pass --rewrite only on purpose.");
  process.exit(1);
}
const text = serializeCapture(await captureRulebooks());
await writeFile(target, text);
console.log(`wrote tests/fixtures/rulebooks-golden.json (${text.length.toLocaleString("en")} bytes)`);
