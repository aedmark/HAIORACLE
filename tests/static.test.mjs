import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);

test("the static entry points exist", async () => {
  await Promise.all([
    "index.html",
    "styles.css",
    "src/app.mjs",
    "src/befunge.mjs",
    "src/brainfuck.mjs",
    "src/conductor.mjs",
    "src/fractran.mjs",
    "src/lolcode.mjs",
    "src/malbolge.mjs",
    "src/music.mjs",
    "src/score.mjs",
    "src/share.mjs",
    "src/shakespeare.mjs",
    "src/oracle.lol",
    "src/beat.mal",
    "src/bass.bf",
    "src/harmony.bfg",
    "src/pad.piet",
    "src/chimes.frac",
    "src/chant.spl",
    "manual.html",
    "docs/manual.json",
    "tools/manual.py",
  ].map((path) => access(new URL(path, root))));
});

test("the page exposes one labeled text input and its core controls", async () => {
  const html = await readFile(new URL("index.html", root), "utf8");
  assert.match(html, /<label for="phrase">/);
  assert.match(html, /id="phrase"/);
  assert.match(html, /href="manual\.html"/);
  assert.match(html, /id="sound-toggle"/);
  assert.match(html, /<label for="master-volume">MASTER VOLUME<\/label>/);
  assert.match(html, /id="master-volume" type="range" min="0" max="100" value="82"/);
  assert.match(html, /id="volume-value"/);
  assert.match(html, /<label for="tempo-bpm">TEMPO<\/label>/);
  assert.match(html, /id="tempo-bpm" type="range" min="36" max="208" value="108"/);
  assert.match(html, /id="tempo-value"/);
  assert.match(html, /id="score-melody"/);
  assert.match(html, /id="score-fungal"/);
  assert.match(html, /id="score-beat"/);
  assert.match(html, /id="beat-grid"/);
  assert.match(html, /id="beat-toggle"/);
  assert.match(html, /id="beat-mutate"/);
  assert.match(html, /id="score-bass"/);
  assert.match(html, /id="bass-grid"/);
  assert.match(html, /id="bass-toggle"/);
  assert.match(html, /id="bass-mutate"/);
  assert.match(html, /id="score-harmony"/);
  assert.match(html, /id="harmony-grid"/);
  assert.match(html, /id="harmony-toggle"/);
  assert.match(html, /id="harmony-mutate"/);
  assert.match(html, /id="score-chime"/);
  assert.match(html, /id="chime-grid"/);
  assert.match(html, /id="chime-toggle"/);
  assert.match(html, /id="chime-mutate"/);
  assert.match(html, /id="score-chant"/);
  assert.match(html, /id="chant-grid"/);
  assert.match(html, /id="chant-toggle"/);
  assert.match(html, /id="chant-mutate"/);
  assert.match(html, /id="bandstand-engage-all"/);
  assert.match(html, /id="bandstand-solo-lead"/);
  assert.match(html, /id="bandstand-mutate-all"/);
  assert.match(html, /id="replay"/);
  assert.match(html, /id="share-link"/);
  assert.match(html, /id="export-png"/);
  assert.match(html, /id="export-wav"/);
  assert.match(html, /aria-live="polite"/);
  assert.match(html, /RESTART THE MELODY/);
  assert.match(html, /COPY OMEN LINK/);
  assert.match(html, /ENGRAVE PNG PLATE/);
  assert.match(html, /RECORD WAV LOOP/);
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
  assert.match(app, /function setTempoBpm\(value\)/);
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
  assert.match(app, /transport\.panner/);
  assert.match(app, /interaction\.dragDistance/);
  assert.match(app, /maxTugX = width \* 0\.32/);
  assert.match(app, /pitchBendCents = interaction\.pitchBend/);
});

test("procedural mycelium and generative fruiting bodies grow within the vitrine", async () => {
  const [html, app] = await Promise.all([
    readFile(new URL("index.html", root), "utf8"),
    readFile(new URL("src/app.mjs", root), "utf8"),
  ]);
  assert.match(html, /id="score-fungal"/);
  assert.match(app, /function buildMycelialNetwork/);
  assert.match(app, /function buildFruitingBodies/);
  assert.match(app, /function buildSporeSystem/);
  assert.match(app, /function drawMycelium/);
  assert.match(app, /function drawFruitingBodies/);
  assert.match(app, /case 0: drawAgaricCap/);
  assert.match(app, /case 1: drawBracketConk/);
  assert.match(app, /case 2: drawCoralClavaria/);
  assert.match(app, /case 3: drawBioluminescentBonnet/);
  assert.match(app, /case 4: drawCupPeziza/);
  assert.match(app, /case 5: drawMorelHoneycomb/);
  assert.match(app, /case 6: drawGlobularPuffball/);
  assert.match(app, /case 7: drawHyphalHydra/);
  assert.match(app, /updateAndDrawSpores/);
  assert.match(app, /burstSpores/);
  assert.match(app, /drawVitrinePedestal/);
  assert.match(app, /drawGlassCondensation/);
  assert.match(app, /scheduleFungalBioStep/);
  assert.match(app, /triggerSporePuff/);
});

test("all five esoteric accompaniment plates and the parlor bandstand render 12-step matrices and schedule voices", async () => {
  const [html, styles, app] = await Promise.all([
    readFile(new URL("index.html", root), "utf8"),
    readFile(new URL("styles.css", root), "utf8"),
    readFile(new URL("src/app.mjs", root), "utf8"),
  ]);
  assert.match(html, /PLATE II · MALBOLGE TERNARY BEAT GENERATOR/);
  assert.match(html, /PLATE III · BRAINFUCK TAPE BASSLINE/);
  assert.match(html, /PLATE IV · BEFUNGE-93 2D MIRROR CHORD ORGAN/);
  assert.match(html, /PLATE V · PIET &amp; FRACTRAN SPECTRAL CHIMES/);
  assert.match(html, /PLATE VI · SHAKESPEARE FORMANT VOWEL CHOIR/);
  assert.match(html, /PARLOR BANDSTAND · SIX-LANGUAGE ENSEMBLE CONSOLE/);
  assert.match(html, /href="src\/beat\.mal"/);
  assert.match(html, /href="src\/bass\.bf"/);
  assert.match(html, /href="src\/harmony\.bfg"/);
  assert.match(html, /href="src\/pad\.piet"/);
  assert.match(html, /href="src\/chimes\.frac"/);
  assert.match(html, /href="src\/chant\.spl"/);
  assert.match(styles, /\.beat-grid/);
  assert.match(styles, /\.beat-step\.is-current/);
  assert.match(styles, /\.bass-step/);
  assert.match(styles, /\.harmony-step/);
  assert.match(styles, /\.chime-step/);
  assert.match(styles, /\.chant-step/);
  assert.match(styles, /\.bandstand-engine/);
  assert.match(app, /function applyEnsembleConductor\(\)/);
  assert.match(app, /function scheduleBeatStep\(/);
  assert.match(app, /function scheduleBassStep\(/);
  assert.match(app, /function scheduleHarmonyStep\(/);
  assert.match(app, /function scheduleChimeStep\(/);
  assert.match(app, /function scheduleChantStep\(/);
  assert.match(app, /function renderBeatGrid\(\)/);
  assert.match(app, /function renderBassGrid\(\)/);
  assert.match(app, /function renderHarmonyGrid\(\)/);
  assert.match(app, /function renderChimeGrid\(\)/);
  assert.match(app, /function renderChantGrid\(\)/);
  assert.match(app, /function renderSpecimenBroadsheetCanvas\(/);
  assert.match(app, /function copyShareLink\(\)/);
  assert.match(app, /function exportSpecimenPng\(\)/);
  assert.match(app, /function exportSpecimenWav\(\)/);
  assert.match(app, /fetch\("src\/beat\.mal"\)/);
  assert.match(app, /fetch\("src\/bass\.bf"\)/);
  assert.match(app, /fetch\("src\/harmony\.bfg"\)/);
  assert.match(app, /fetch\("src\/pad\.piet"\)/);
  assert.match(app, /fetch\("src\/chimes\.frac"\)/);
  assert.match(app, /fetch\("src\/chant\.spl"\)/);
});

test("the application has no remote runtime assets", async () => {
  const files = await Promise.all([
    "index.html",
    "styles.css",
    "src/app.mjs",
    "src/befunge.mjs",
    "src/brainfuck.mjs",
    "src/conductor.mjs",
    "src/fractran.mjs",
    "src/lolcode.mjs",
    "src/malbolge.mjs",
    "src/music.mjs",
    "src/score.mjs",
    "src/share.mjs",
    "src/shakespeare.mjs",
  ].map((path) => readFile(new URL(path, root), "utf8")));
  assert.equal(files.some((contents) => /https?:\/\//i.test(contents)), false);
  assert.equal(files.some((contents) => /node_modules|from\s+["'](?!\.\/)/i.test(contents)), false);
});

test("the Kapellmeister console and antique parlor acoustics controls are wired up", async () => {
  const [html, styles, app] = await Promise.all([
    readFile(new URL("index.html", root), "utf8"),
    readFile(new URL("styles.css", root), "utf8"),
    readFile(new URL("src/app.mjs", root), "utf8"),
  ]);
  assert.match(html, /id="kapellmeister-engine"/);
  assert.match(html, /id="kapellmeister-genre"/);
  assert.match(html, /id="kapellmeister-strictness"/);
  assert.match(html, /id="harmonic-step"/);
  assert.match(html, /id="harmonic-chord"/);
  assert.match(html, /id="harmonic-vector"/);
  assert.match(html, /id="harmonic-euler"/);
  assert.match(html, /class="tonnetz-compass-svg"/);
  assert.match(html, /id="parlor-acoustics-engine"/);
  assert.match(html, /id="parlor-acoustics-toggle"/);
  assert.match(html, /id="parlor-acoustics-level"/);
  assert.match(html, /id="chip-crackle"/);
  assert.match(html, /id="chip-reverb"/);
  assert.match(html, /id="chip-tick"/);
  assert.match(styles, /\.kapellmeister-engine/);
  assert.match(styles, /\.parlor-acoustics-engine/);
  assert.match(app, /function ensureWaxCrackleBuffer\(/);
  assert.match(app, /function ensureParlorImpulseResponse\(/);
  assert.match(app, /function scheduleClockworkTick\(/);
  assert.match(app, /function updateKapellmeisterUI\(/);
  assert.match(app, /parlorConvolver\.normalize\s*=\s*false/);
  assert.match(app, /elements\.chipCrackle\?\.addEventListener/);
  assert.match(app, /elements\.chipReverb\?\.addEventListener/);
  assert.match(app, /elements\.chipTick\?\.addEventListener/);
});

