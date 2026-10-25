import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import { composeScore } from "../src/score.mjs";
import { composeBeat } from "../src/malbolge.mjs";
import { composeBass } from "../src/brainfuck.mjs";
import { composeHarmony } from "../src/befunge.mjs";
import { composeChimes } from "../src/fractran.mjs";
import { composeChant } from "../src/shakespeare.mjs";
import {
  INSPECTOR_PLATE_IDS,
  PLATE_INSPECTOR_SPECS,
  inspectBassStep,
  inspectBeatStep,
  inspectChantStep,
  inspectChimeStep,
  inspectHarmonyStep,
  inspectPlateStep,
  toTernary10,
} from "../src/inspector.mjs";

const root = new URL("../", import.meta.url);

test("toTernary10 formats 10-trit Malbolge words deterministically (P5-34)", () => {
  assert.equal(toTernary10(0), "0t0000000000");
  assert.equal(toTernary10(1), "0t0000000001");
  assert.equal(toTernary10(2), "0t0000000002");
  assert.equal(toTernary10(3), "0t0000000010");
  assert.equal(toTernary10(59048), "0t2222222222");
});

test("Under the Parlor Glass inspectors format live VM state across all 5 esoteric plates and 12 steps (P5-34)", async () => {
  const [oracleSrc, beatSrc, bassSrc, harmonySrc, pietSrc, fracSrc, chantSrc] = await Promise.all([
    readFile(new URL("src/oracle.lol", root), "utf8"),
    readFile(new URL("src/beat.mal", root), "utf8"),
    readFile(new URL("src/bass.bf", root), "utf8"),
    readFile(new URL("src/harmony.bfg", root), "utf8"),
    readFile(new URL("src/pad.piet", root), "utf8"),
    readFile(new URL("src/chimes.frac", root), "utf8"),
    readFile(new URL("src/chant.spl", root), "utf8"),
  ]);

  const score = composeScore(oracleSrc, "the moon owes me five dollars");
  const beat = composeBeat(beatSrc, score, 0);
  const bass = composeBass(bassSrc, score, 0);
  const harmony = composeHarmony(harmonySrc, score, 0);
  const chimes = composeChimes(pietSrc, fracSrc, score, 0);
  const chant = composeChant(chantSrc, score, 0);

  // Standby fallbacks when no specimen is loaded yet
  for (const id of INSPECTOR_PLATE_IDS) {
    assert.ok(PLATE_INSPECTOR_SPECS[id].title.length > 0);
    const standby = inspectPlateStep(id, null, 0);
    assert.equal(standby.plate, id);
    assert.match(standby.headline, /STANDBY/);
  }

  for (let step = 0; step < 12; step += 1) {
    const bInfo = inspectBeatStep(beat, step);
    assert.equal(bInfo.stepIndex, step);
    assert.match(bInfo.registers, /ROTR=0t[0-2]{10} · CRAZY=0t[0-2]{10}/);
    assert.match(bInfo.detail, /TRITS \[[0-2]{3}\]/);

    const bassInfo = inspectBassStep(bass, step);
    assert.equal(bassInfo.stepIndex, step);
    assert.match(bassInfo.registers, /PTR=\*\d{2} \[0x[0-9A-F]{2}=\d+\] · SHUTTLE \[->\+<\]/);
    assert.match(bassInfo.detail, /GATE=[0-2]/);

    const harmInfo = inspectHarmonyStep(harmony, step);
    assert.equal(harmInfo.stepIndex, step);
    assert.match(harmInfo.registers, /IP=\(\d+,\d+\) DIR=[↗↙↘↖] · MIRROR '[\/\\]'/);
    assert.match(harmInfo.detail, /TRIAD=\[/);

    const chimeInfo = inspectChimeStep(chimes, step);
    assert.equal(chimeInfo.stepIndex, step);
    assert.match(chimeInfo.registers, /PIET CODEL=[LND][RYGCBM] .* FRACTRAN=/);
    assert.match(chimeInfo.detail, /JI RATIO=/);

    const chantInfo = inspectChantStep(chant, step);
    assert.equal(chantInfo.stepIndex, step);
    assert.match(chantInfo.registers, /ACT [IVX]+ · SCENE [IVX]+ · \[[A-Z]+ ➔ [A-Z]+\]/);
    assert.match(chantInfo.detail, /FORMANTS F1=\d+Hz F2=\d+Hz F3=\d+Hz/);
  }

  assert.throws(() => inspectPlateStep("unknown", {}, 0), /Unknown plate inspector id/);
});

test("Wing III plates expose expandable aria-live='off' VM inspector loupes without layout shift (P5-34)", async () => {
  const [html, styles, app] = await Promise.all([
    readFile(new URL("index.html", root), "utf8"),
    readFile(new URL("styles.css", root), "utf8"),
    readFile(new URL("src/app.mjs", root), "utf8"),
  ]);

  for (const id of INSPECTOR_PLATE_IDS) {
    assert.match(
      html,
      new RegExp(`id="${id}-inspect-toggle"[^>]*aria-expanded="false"[^>]*aria-controls="${id}-inspector"`),
      `${id} has inspector toggle button`,
    );
    assert.match(
      html,
      new RegExp(`id="${id}-inspector"[^>]*hidden[^>]*aria-live="off"`),
      `${id} inspector starts hidden and silent to screen readers`,
    );
    for (const sub of ["headline", "registers", "detail"]) {
      assert.match(html, new RegExp(`id="${id}-inspector-${sub}"`), `${id}-inspector-${sub} exists`);
    }
  }

  assert.match(styles, /\.vm-inspector\[hidden\] \{\s*display: none !important;\s*\}/);
  assert.match(app, /function updatePlateInspector\(/);
  assert.match(app, /function updateAllPlateInspectors\(/);
});
