import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import { FUNGAL_SOUNDS, myceliumEvents } from "../src/mycelium.mjs";
import { FUNGAL_NAMES, composeScore } from "../src/score.mjs";

const oracle = await readFile(new URL("../src/oracle.lol", import.meta.url), "utf8");
const base = composeScore(oracle, "three pigeons in a borrowed coat");
const loop = (score) => Array.from({ length: 12 }, (_, step) => myceliumEvents(score, step));

test("every sporophore form has its own sound", () => {
  assert.equal(FUNGAL_SOUNDS.length, FUNGAL_NAMES.length);
  const fingerprints = FUNGAL_SOUNDS.map((_, form) => JSON.stringify(loop({ ...base, fungalForm: form }).map((events) => events.map((e) => [e.kind, e.wave, Math.round(e.freq ?? e.band[0])]))));
  assert.equal(new Set(fingerprints).size, FUNGAL_SOUNDS.length, "no two forms make the same loop");
  const spikeRegisters = FUNGAL_SOUNDS.map((sound) => sound.spikes.freq);
  assert.ok(Math.max(...spikeRegisters) / Math.min(...spikeRegisters) > 10, "forms span low knocks to high glints");
  for (const sound of FUNGAL_SOUNDS) for (const part of ["spikes", "drops", "puffs"]) assert.match(sound[part].pattern, /^[x.]{12}$/);
});

test("hyphae, spores, and bloom shape the sound within a form, deterministically", () => {
  const score = { ...base, fungalForm: 0 };
  assert.deepEqual(loop(score), loop({ ...score }), "same score, same events");
  const count = (s) => loop(s).flat().filter((e) => e.kind === "tone").length;
  assert.ok(count({ ...score, fungalHyphae: 100 }) > count({ ...score, fungalHyphae: 10 }), "more hyphae, longer spike trains");
  const puffs = (s) => loop(s).flat().filter((e) => e.kind === "noise").length;
  assert.equal(puffs({ ...score, fungalSpores: 15 }), 0, "sparse spores never puff");
  assert.ok(puffs({ ...score, fungalSpores: 90 }) > puffs({ ...score, fungalSpores: 40 }), "dense spores puff more often");
  const firstTone = (s) => loop(s).flat().find((e) => e.kind === "tone").freq;
  assert.ok(firstTone({ ...score, fungalBloom: 100 }) > firstTone({ ...score, fungalBloom: 10 }) * 1.9, "bloom tilts pitch about an octave end to end");
});

test("events stay in bounds for every form and every extreme", () => {
  for (let form = 0; form < 8; form += 1) for (const v of [10, 100]) {
    const events = loop({ ...base, fungalForm: form, fungalHyphae: v, fungalSpores: v, fungalBloom: v }).flat();
    for (const e of events) {
      assert.ok(e.peak > 0 && e.peak <= 0.1, `peak ${e.peak}`);
      assert.ok(e.at >= 0 && e.at < 0.6 && e.decay > 0 && e.decay <= 0.4);
      for (const f of [e.freq, e.to, e.band?.[0]].filter((x) => x !== undefined)) assert.ok(f >= 150 && f <= 12000, `frequency ${f}`);
    }
    assert.ok(events.length <= 12 * 8, "a bounded number of events per loop");
  }
});
