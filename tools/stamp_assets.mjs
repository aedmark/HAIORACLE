#!/usr/bin/env node
// Cache boundary (D-035): index.html stamps every module and source URL with a
// version derived from the bytes under src/, so a browser can never pair a
// fresh module with a cached old one. Run after any src/ edit:
//
//   node tools/stamp_assets.mjs          rewrite ASSET_VERSION in index.html
//   node tools/stamp_assets.mjs --check  exit 1 if the stamp is stale
import { createHash } from "node:crypto";
import { readFile, readdir, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const defaultRoot = new URL("../", import.meta.url);

export const VERSION_PATTERN = /const ASSET_VERSION = "([0-9a-f]+)";/;

// Every file under src/ is runtime: modules are imported and the rest are
// fetched sources. Name and bytes both count, so a rename also restamps.
export async function assetVersion(root = defaultRoot) {
  const srcDir = new URL("src/", root);
  const names = (await readdir(srcDir, { withFileTypes: true }))
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name)
    .sort();
  const hash = createHash("sha256");
  for (const name of names) {
    hash.update(`${name}\0`);
    hash.update(await readFile(new URL(name, srcDir)));
    hash.update("\0");
  }
  return hash.digest("hex").slice(0, 12);
}

export function stampedVersion(html) {
  return html.match(VERSION_PATTERN)?.[1] ?? null;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const indexUrl = new URL("index.html", defaultRoot);
  const html = await readFile(indexUrl, "utf8");
  const current = stampedVersion(html);
  const expected = await assetVersion();
  if (current === null) {
    console.error("index.html has no ASSET_VERSION line.");
    process.exit(1);
  }
  if (process.argv.includes("--check")) {
    if (current !== expected) {
      console.error(`ASSET_VERSION is ${current}; src/ needs ${expected}. Run: node tools/stamp_assets.mjs`);
      process.exit(1);
    }
    console.log(`ASSET_VERSION ${current} matches src/.`);
  } else if (current === expected) {
    console.log(`ASSET_VERSION ${current} already matches src/.`);
  } else {
    await writeFile(indexUrl, html.replace(VERSION_PATTERN, `const ASSET_VERSION = "${expected}";`));
    console.log(`ASSET_VERSION ${current} -> ${expected}`);
  }
}
