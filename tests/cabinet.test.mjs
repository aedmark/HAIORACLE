import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import {
  CABINET_STORAGE_KEY,
  DRAWERS,
  LOOPS_BEFORE_BAND,
  cabinetReduce,
  defaultCabinetState,
  drawerForTrigger,
  isDrawerOpen,
  parseCabinetState,
  serializeCabinetState,
} from "../src/cabinet.mjs";

const html = await readFile(new URL("../index.html", import.meta.url), "utf8");
const reduce = (state, event) => cabinetReduce(state, event).state;

test("discovery starts with every drawer sealed, in page order, each with its own trigger", () => {
  const state = defaultCabinetState();
  assert.equal(state.mode, "discovery");
  assert.deepEqual(DRAWERS.map((drawer) => drawer.id), ["kapellmeister", "mix", "keep", "band"]);
  for (const drawer of DRAWERS) {
    assert.equal(isDrawerOpen(state, drawer.id), false, drawer.id);
    assert.match(html, new RegExp(`id="${drawer.target}"`), `${drawer.target} exists in the page`);
    assert.equal(drawerForTrigger(drawer.unlock), drawer.id);
  }
  const positions = DRAWERS.map((drawer) => html.indexOf(`id="${drawer.target}"`));
  assert.deepEqual(positions, [...positions].sort((a, b) => a - b), "drawers follow page order");
  assert.equal(drawerForTrigger("nonsense"), null);
  assert.equal(LOOPS_BEFORE_BAND, 4);
});

test("a trigger opens a drawer once; a drawer closed by hand stays closed", () => {
  let result = cabinetReduce(defaultCabinetState(), { type: "unlock", drawer: "mix" });
  assert.equal(result.opened, "mix", "the first unlock reveals the drawer (and is announced)");
  assert.equal(isDrawerOpen(result.state, "mix"), true);
  result = cabinetReduce(result.state, { type: "unlock", drawer: "mix" });
  assert.equal(result.opened, null, "a second unlock is quiet");

  let state = reduce(result.state, { type: "toggle", drawer: "mix" });
  assert.equal(isDrawerOpen(state, "mix"), false, "the visitor closed it");
  state = reduce(state, { type: "unlock", drawer: "mix" });
  assert.equal(isDrawerOpen(state, "mix"), false, "the trigger does not reopen what the visitor closed");

  const early = cabinetReduce(defaultCabinetState(), { type: "toggle", drawer: "band" });
  assert.equal(early.opened, "band", "any drawer can be opened before its trigger");
  assert.equal(cabinetReduce(early.state, { type: "unlock", drawer: "band" }).opened, null, "and its trigger is then spent");
});

test("the whole cabinet lays everything bare, and discovery returns to how the visitor left it", () => {
  let state = reduce(defaultCabinetState(), { type: "unlock", drawer: "kapellmeister" });
  state = reduce(state, { type: "mode", mode: "cabinet" });
  assert.ok(DRAWERS.every((drawer) => isDrawerOpen(state, drawer.id)));
  assert.equal(cabinetReduce(state, { type: "unlock", drawer: "keep" }).opened, null, "nothing to reveal in the whole cabinet");
  assert.equal(reduce(state, { type: "toggle", drawer: "keep" }), state, "drawer toggles do nothing in the whole cabinet");
  state = reduce(state, { type: "mode", mode: "discovery" });
  assert.deepEqual(DRAWERS.map((drawer) => isDrawerOpen(state, drawer.id)), [true, false, false, false]);
  assert.equal(reduce(state, { type: "mode", mode: "theatre" }), state, "unknown modes are ignored");
  assert.equal(reduce(state, { type: "unlock", drawer: "attic" }), state, "unknown drawers are ignored");
});

test("the remembered cabinet round-trips and anything malformed starts fresh", () => {
  let state = reduce(defaultCabinetState(), { type: "toggle", drawer: "band" });
  state = reduce(state, { type: "unlock", drawer: "kapellmeister" });
  state = reduce(state, { type: "mode", mode: "cabinet" });
  const text = serializeCabinetState(state);
  assert.deepEqual(parseCabinetState(text), state);
  assert.deepEqual(JSON.parse(text).open, ["kapellmeister", "band"], "stored in page order");
  assert.equal(CABINET_STORAGE_KEY, "edmark-fun-machine.cabinet.v1");
  for (const junk of [null, "", "{", "[]", "42", JSON.stringify({ mode: "cabinet", open: [], seen: [], extra: 1 }),
    JSON.stringify({ mode: "attic", open: [], seen: [] }), JSON.stringify({ mode: "discovery", open: ["attic"], seen: [] }),
    JSON.stringify({ mode: "discovery", open: "mix", seen: [] }), "x".repeat(600)]) {
    assert.deepEqual(parseCabinetState(junk), defaultCabinetState(), String(junk).slice(0, 40));
  }
  assert.deepEqual(parseCabinetState(JSON.stringify({ mode: "discovery", open: ["mix"], seen: [] })).seen, ["mix"], "an open drawer counts as seen");
});
