import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import test from "node:test";
import { assetVersion, stampedVersion } from "../tools/stamp_assets.mjs";

// Cache boundary (D-035): every module and source URL the browser loads carries
// one version stamp derived from src/, so no cached old file meets a fresh one.
const root = new URL("../", import.meta.url);
const srcDir = new URL("src/", root);

async function bootScript() {
  const html = await readFile(new URL("index.html", root), "utf8");
  const boot = html.match(/<script>([\s\S]*?const ASSET_VERSION[\s\S]*?)<\/script>/)?.[1];
  assert.ok(boot, "index.html keeps the ASSET_VERSION boot script");
  return { html, boot };
}

function moduleList(boot) {
  const list = boot.match(/const MODULES = \[([\s\S]*?)\];/)?.[1];
  assert.ok(list, "the boot script declares MODULES");
  return [...list.matchAll(/"([^"]+)"/g)].map((match) => match[1]);
}

const relativeSpecifier = /(?:\bfrom|\bimport)\s*\(?\s*["']([^"']+)["']/g;

async function importClosure(entry) {
  const seen = new Set();
  const queue = [entry];
  while (queue.length > 0) {
    const name = queue.pop();
    if (seen.has(name)) continue;
    seen.add(name);
    const source = await readFile(new URL(name, srcDir), "utf8");
    for (const [, specifier] of source.matchAll(relativeSpecifier)) {
      assert.match(specifier, /^\.\/[\w-]+\.mjs$/, `${name} imports ${specifier}; browser modules import sibling ./*.mjs files only`);
      queue.push(specifier.slice(2));
    }
  }
  return seen;
}

test("ASSET_VERSION in index.html matches the bytes under src/", async () => {
  const { html } = await bootScript();
  const expected = await assetVersion(root);
  assert.equal(stampedVersion(html), expected, `src/ changed: run \`node tools/stamp_assets.mjs\` to restamp index.html with ${expected}`);
});

test("the import map versions every module the app can load", async () => {
  const { boot } = await bootScript();
  const listed = moduleList(boot);
  const closure = await importClosure("app.mjs");
  assert.deepEqual([...listed].sort(), [...closure].sort(), "MODULES must equal the import closure of src/app.mjs");
  assert.equal(new Set(listed).size, listed.length, "MODULES has no duplicates");
  assert.match(boot, /imports\[`\.\/src\/\$\{name\}`\] = `\.\/src\/\$\{name\}\?v=\$\{ASSET_VERSION\}`/, "each import-map entry appends ?v=ASSET_VERSION");
  assert.match(boot, /importMap\.type = "importmap"/);
  assert.match(boot, /app\.src = imports\["\.\/src\/app\.mjs"\]/, "the entry module loads through its versioned URL");
});

test("index.html loads no module or script outside the versioned boot", async () => {
  const { html } = await bootScript();
  const scripts = [...html.matchAll(/<script\b[^>]*>/g)].map((match) => match[0]);
  assert.deepEqual(scripts, ["<script>"], "the only script tag is the inline boot script");
});

test("every source fetch carries the module's version stamp", async () => {
  const modules = (await readdir(srcDir)).filter((name) => name.endsWith(".mjs"));
  for (const name of modules) {
    const source = await readFile(new URL(name, srcDir), "utf8");
    for (const [call] of source.matchAll(/\bfetch\(\s*[^)]*/g)) {
      assert.match(call, /^fetch\(sourceUrl\("[\w.-]+"$/, `${name}: ${call}) must go through sourceUrl()`);
    }
  }
  const app = await readFile(new URL("app.mjs", srcDir), "utf8");
  assert.match(app, /url\.search = new URL\(import\.meta\.url\)\.search;/, "sourceUrl copies this module's ?v= stamp");
  const fetched = [...app.matchAll(/fetch\(sourceUrl\("([\w.-]+)"\)\)/g)].map((match) => match[1]).sort();
  const sources = (await readdir(srcDir)).filter((file) => !file.endsWith(".mjs")).sort();
  assert.deepEqual(fetched, sources, "every non-module file under src/ is fetched through sourceUrl()");
});
