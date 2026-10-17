import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);

test("the static entry points exist", async () => {
  await Promise.all([
    "index.html",
    "styles.css",
    "src/app.mjs",
    "src/lolcode.mjs",
    "src/music.mjs",
    "src/score.mjs",
    "src/oracle.lol",
  ].map((path) => access(new URL(path, root))));
});

test("the page exposes one labeled text input and its core controls", async () => {
  const html = await readFile(new URL("index.html", root), "utf8");
  assert.match(html, /<label for="phrase">/);
  assert.match(html, /id="phrase"/);
  assert.match(html, /id="sound-toggle"/);
  assert.match(html, /<label for="master-volume">MASTER VOLUME<\/label>/);
  assert.match(html, /id="master-volume" type="range" min="0" max="100" value="82"/);
  assert.match(html, /id="volume-value"/);
  assert.match(html, /id="score-melody"/);
  assert.match(html, /id="replay"/);
  assert.match(html, /aria-live="polite"/);
  assert.match(html, /RESTART THE MELODY/);
});

test("the interface uses the centered esoteric parlor cabinet design system", async () => {
  const [html, styles, app] = await Promise.all([
    readFile(new URL("index.html", root), "utf8"),
    readFile(new URL("styles.css", root), "utf8"),
    readFile(new URL("src/app.mjs", root), "utf8"),
  ]);
  assert.match(html, /class="vision-stage"/);
  assert.match(html, /CONFIDE A PHRASE<br><em>UNTO THE PARLOR GLASS<\/em>/);
  assert.match(styles, /--serif-display: "Palatino Linotype", "Book Antiqua", Palatino/);
  assert.match(styles, /grid-template-columns: 1fr auto 1fr/);
  assert.match(app, /const centerX = width \* 0\.5/);
  assert.match(app, /const centerY = height \* 0\.5/);
});

test("audio uses a continuing look-ahead scheduler", async () => {
  const app = await readFile(new URL("src/app.mjs", root), "utf8");
  assert.match(app, /setInterval\(scheduleAhead, 90\)/);
  assert.match(app, /OMEN LOOPING/);
  assert.doesNotMatch(app, /OMEN COMPLETE/);
});

test("master volume raises the default mix and updates the live output safely", async () => {
  const app = await readFile(new URL("src/app.mjs", root), "utf8");
  assert.match(app, /function masterGainFor\(volume\)/);
  assert.match(app, /exponentialRampToValueAtTime\(0\.28, now \+ 0\.16\)/);
  assert.match(app, /output\.gain\.value = masterGainFor\(masterVolume\)/);
  assert.match(app, /output\.gain\.setTargetAtTime\(masterGainFor\(masterVolume\), now, 0\.018\)/);
  assert.match(app, /delay\.connect\(compressor\)/);
});

test("kinetic geometry remains inside a bounded, deforming silhouette", async () => {
  const app = await readFile(new URL("src/app.mjs", root), "utf8");
  assert.match(app, /Math\.max\(0\.38, Math\.min\(1\.08, radius \+ fluxOffset/);
  assert.match(app, /ctx\.clip\(\);\s*drawKineticCore\(ctx, score, base, elapsed, colors\)/);
  assert.match(app, /case 0: drawTesseract/);
  assert.match(app, /case 7: drawCrystalNetwork/);
});

test("audio pulse does not resize the visual geometry", async () => {
  const app = await readFile(new URL("src/app.mjs", root), "utf8");
  const visualDraw = app.slice(app.indexOf("draw(timestamp)"), app.indexOf("async function ensureAudioContext"));
  assert.doesNotMatch(visualDraw, /score\.pulse|beatScale|smoothBeatScale/);
});

test("the expensive body glow is cleared before kinetic linework", async () => {
  const app = await readFile(new URL("src/app.mjs", root), "utf8");
  const bodyDraw = app.slice(app.indexOf("const direction ="), app.indexOf("const ringCount ="));
  assert.match(bodyDraw, /ctx\.save\(\);\s*ctx\.shadowColor[\s\S]*ctx\.fill\(\);\s*ctx\.restore\(\);\s*ctx\.save\(\);\s*traceBody/);
  assert.match(app, /function drawKineticCore[\s\S]*ctx\.shadowBlur = 0;/);
});

test("tapping, holding, and dragging the vitrine modulate shape morphing, movement, pitch, intensity, and percussion", async () => {
  const [styles, app] = await Promise.all([
    readFile(new URL("styles.css", root), "utf8"),
    readFile(new URL("src/app.mjs", root), "utf8"),
  ]);
  assert.match(styles, /touch-action:\s*none/);
  assert.match(app, /elements\.canvas\.addEventListener\("pointerdown"/);
  assert.match(app, /elements\.canvas\.addEventListener\("pointermove"/);
  assert.match(app, /elements\.canvas\.addEventListener\("pointerup"/);
  assert.match(app, /function triggerPercussion\(kind/);
  assert.match(app, /triggerPercussion\("strike"/);
  assert.match(app, /triggerPercussion\("ratchet"/);
  assert.match(app, /function updateAudioInteraction\(\)/);
  assert.match(app, /interaction\.pitchBend/);
  assert.match(app, /const morphMix = Math\.min\(1, interaction\.hold/);
});

test("the application has no remote runtime assets", async () => {
  const files = await Promise.all([
    "index.html",
    "styles.css",
    "src/app.mjs",
    "src/lolcode.mjs",
    "src/music.mjs",
    "src/score.mjs",
  ].map((path) => readFile(new URL(path, root), "utf8")));
  assert.equal(files.some((contents) => /https?:\/\//i.test(contents)), false);
  assert.equal(files.some((contents) => /node_modules|from\s+["'](?!\.\/)/i.test(contents)), false);
});
