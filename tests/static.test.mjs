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
    "src/accompaniment.mjs",
    "src/conductor.mjs",
    "src/ensemble.mjs",
    "src/fractran.mjs",
    "src/lolcode.mjs",
    "src/malbolge.mjs",
    "src/midi.mjs",
    "src/mixer.mjs",
    "src/music.mjs",
    "src/score.mjs",
    "src/session.mjs",
    "src/share.mjs",
    "src/shakespeare.mjs",
    "src/intercal.mjs",
    "src/transport.mjs",
    "src/zip.mjs",
    "src/oracle.lol",
    "src/beat.mal",
    "src/bass.bf",
    "src/harmony.bfg",
    "src/pad.piet",
    "src/chimes.frac",
    "src/chant.spl",
    "src/conductor.i",
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
  assert.match(html, /UTTER A PHRASE<br><em>UNTO THE GLASS<\/em>/);
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
  const [app, ensemble] = await Promise.all([
    readFile(new URL("src/app.mjs", root), "utf8"),
    readFile(new URL("src/ensemble.mjs", root), "utf8"),
  ]);
  assert.match(app, /function masterGainFor\(volume\)/);
  assert.match(app, /function setTempoBpm\(value\)/);
  assert.match(ensemble, /exponentialRampToValueAtTime\(0\.28, now \+ 0\.16\)/);
  assert.match(app, /outputGain: masterGainFor\(masterVolume\)/);
  assert.match(ensemble, /output\.gain\.value = outputGain/);
  assert.match(app, /output\.gain\.setTargetAtTime\(masterGainFor\(masterVolume\), now, 0\.018\)/);
  assert.match(ensemble, /delay\.connect\(compressor\)/);
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
  assert.match(html, /PLATE I · MALBOLGE TERNARY BEAT GENERATOR/);
  assert.match(html, /PLATE II · BRAINFUCK TAPE BASSLINE/);
  assert.match(html, /PLATE III · BEFUNGE-93 2D MIRROR CHORD ORGAN/);
  assert.match(html, /PLATE IV · PIET &amp; FRACTRAN SPECTRAL CHIMES/);
  assert.match(html, /PLATE V · SHAKESPEARE FORMANT VOWEL CHOIR/);
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
  assert.match(app, /fetch\(sourceUrl\("beat\.mal"\)\)/);
  assert.match(app, /fetch\(sourceUrl\("bass\.bf"\)\)/);
  assert.match(app, /fetch\(sourceUrl\("harmony\.bfg"\)\)/);
  assert.match(app, /fetch\(sourceUrl\("pad\.piet"\)\)/);
  assert.match(app, /fetch\(sourceUrl\("chimes\.frac"\)\)/);
  assert.match(app, /fetch\(sourceUrl\("chant\.spl"\)\)/);
  assert.match(app, /fetch\(sourceUrl\("conductor\.i"\)\)/);
  assert.match(app, /fetch\(sourceUrl\("rulebooks\.ni"\)\)/);
  // The Inform 7 rulebooks install before anything reads a genre or a preset (D-033).
  const install = app.indexOf("installRulebooks(compileRulebooks(rulebooksSource));");
  assert.ok(install > 0, "the app installs the compiled rulebooks");
  assert.ok(app.indexOf("renderPresetList();", install) > install, "presets render only after the rulebooks install");
  assert.equal(app.slice(0, install).match(/^renderPresetList\(\);$/m), null, "no preset render at module start");
  assert.match(app, /function updateFunKeyboardChordLabels\(\) \{\n[^\n]*\n  if \(!rulebooksInstalled\(\)\) return;/);
  // The Kapellmeister menu, title, and motto come from the rulebooks, not the page.
  assert.doesNotMatch(html, /<option value="(victorian_tonnetz|smoky_jazz|raw_chaos)"/, "no genre is hard-coded in index.html");
  assert.match(html, /<select id="kapellmeister-genre"[^>]*aria-describedby="kapellmeister-genre-motto"[^>]*disabled><\/select>/);
  assert.match(html, /<p class="kapellmeister-motto" id="kapellmeister-genre-motto"><\/p>/);
  assert.match(app, /function buildGenreMenu\(\) \{[\s\S]*?for \(const code of genreCodes\(\)\)[\s\S]*?option\.title = book\.motto;[\s\S]*?group\.label = book\.family;/);
  assert.ok(app.indexOf("buildGenreMenu();", install) > install, "the menu is built after the rulebooks install");
  // Changing text never reflows the Perform wing (fixed line boxes, minmax columns).
  assert.match(styles, /\.kapellmeister-motto \{[^}]*height: 4\.2em;[^}]*-webkit-line-clamp: 3;/);
  assert.match(styles, /#fun-machine-heading,\n#kapellmeister-heading \{[^}]*height: 2\.5em;/);
  assert.match(styles, /#fun-machine-telemetry \{[^}]*flex: 1 0 100%;[^}]*height: 3\.2em;[^}]*contain: inline-size;/);
  assert.match(styles, /\.step-trits,\n\.beat-step \.cell-byte \{[^}]*height: 1\.3em;[^}]*white-space: nowrap;/);
  assert.match(app, /function setTempoBpm\(value\) \{[\s\S]*?currentTransport\.delay\.delayTime\.setTargetAtTime\(delayTimeFor\(currentScore, activeTempoBpm\)/, "a live tempo change retimes the echo");
  assert.match(app, /async function triggerFunKey\(semitone, isKeyDown = true\) \{\n[^\n]*\n  if \(semitone === null \|\| semitone === undefined \|\| !rulebooksInstalled\(\)\) return;/);
  assert.match(app, /composeArrangement\(/);
  // The arrangement reaches the whole workstation, not only the scheduler.
  assert.match(app, /function activeArrangement\(\)/);
  assert.match(app, /arrangementPlays\("fun", stepIndex\)/, "the player's part consults register :8");
  assert.match(app, /classList\.toggle\("is-tacet", resting\)/, "console strips show TACET while rested");
  assert.match(app, /buildMidiFile\(\{[^}]*markers \}\)/, "MIDI export writes section markers");
  assert.match(app, /\.\.\.arrangementReadme\(stepStarts\)/, "the stem README maps the sections");
  assert.match(html, /<output class="transport-section" id="transport-section"/);
  assert.match(styles, /\.mixer-strip\.is-tacet \.mixer-tacet/);
  assert.match(styles, /\.transport-section \{[^}]*flex: 1 0 100%;[^}]*height: 1\.5em;[^}]*white-space: nowrap;/, "section names never re-wrap the transport row");
  assert.match(styles, /\.transport-section \{[^}]*contain: inline-size;/, "section names never widen the transport row");
});

test("the application has no remote runtime assets", async () => {
  const files = await Promise.all([
    "index.html",
    "styles.css",
    "src/app.mjs",
    "src/befunge.mjs",
    "src/brainfuck.mjs",
    "src/accompaniment.mjs",
    "src/conductor.mjs",
    "src/ensemble.mjs",
    "src/fractran.mjs",
    "src/lolcode.mjs",
    "src/malbolge.mjs",
    "src/midi.mjs",
    "src/mixer.mjs",
    "src/music.mjs",
    "src/score.mjs",
    "src/session.mjs",
    "src/share.mjs",
    "src/shakespeare.mjs",
    "src/intercal.mjs",
    "src/transport.mjs",
    "src/zip.mjs",
  ].map((path) => readFile(new URL(path, root), "utf8")));
  assert.equal(files.some((contents) => /https?:\/\//i.test(contents)), false);
  assert.equal(files.some((contents) => /node_modules|from\s+["'](?!\.\/)/i.test(contents)), false);
});

test("the Kapellmeister console and antique parlor acoustics controls are wired up", async () => {
  const [html, styles, app, ensemble] = await Promise.all([
    readFile(new URL("index.html", root), "utf8"),
    readFile(new URL("styles.css", root), "utf8"),
    readFile(new URL("src/app.mjs", root), "utf8"),
    readFile(new URL("src/ensemble.mjs", root), "utf8"),
  ]);
  assert.match(html, /id="kapellmeister-engine"/);
  assert.match(html, /id="kapellmeister-genre"/);
  assert.match(html, /id="kapellmeister-strictness"/);
  assert.match(html, /id="harmonic-step"/);
  assert.match(html, /id="harmonic-chord"/);
  assert.match(html, /id="harmonic-vector"/);
  assert.match(html, /id="harmonic-euler"/);
  assert.match(html, /<ol class="tonnetz-compass">/);
  for (let i = 0; i < 4; i += 1) assert.match(html, new RegExp(`<li class="compass-region[^"]*" id="compass-reg-${i}">[\\s\\S]*?<span class="tonnetz-node-text" id="node-text-${i}">`));
  assert.match(styles, /\.tonnetz-compass \{[^}]*grid-template-columns: repeat\(4, minmax\(0, 1fr\)\);/, "compass labels get equal columns");
  assert.match(styles, /\.tonnetz-node-text \{[^}]*height: 2\.6em;[^}]*-webkit-line-clamp: 2;/, "compass labels reserve two lines");
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
  assert.match(ensemble, /parlorConvolver\.normalize\s*=\s*false/);
  assert.match(ensemble, /parlorReverbFilter/);
  assert.match(app, /maxSpectralMag/);
  assert.match(app, /elements\.chipCrackle\?\.addEventListener/);
  assert.match(app, /elements\.chipReverb\?\.addEventListener/);
  assert.match(app, /elements\.chipTick\?\.addEventListener/);
});

test("the Esoteric Fun Machine accompanist is wired up, and the removed loop sequencer is gone (D-038)", async () => {
  const [html, styles, app] = await Promise.all([
    readFile(new URL("index.html", root), "utf8"),
    readFile(new URL("styles.css", root), "utf8"),
    readFile(new URL("src/app.mjs", root), "utf8"),
  ]);

  // Markup: style chips replace the organ's mode switch and chord-quality chips (D-028).
  assert.match(html, /id="fun-machine-engine"/);
  assert.match(html, /id="fun-machine-status"/);
  assert.match(html, /id="fun-keyboard"/);
  assert.doesNotMatch(html, /id="fun-machine-rec"|id="fun-machine-reset"|id="fun-sequence-grid"|PUNCH-IN/);
  assert.match(html, /role="group" aria-label="Accompaniment style"/);
  for (const style of ["swell", "arpeggio", "progression"]) {
    assert.match(html, new RegExp(`id="chip-style-${style}" data-style="${style}"`), style);
  }
  assert.doesNotMatch(html, /id="fun-machine-mode"|data-quality=/);

  // Keyboard keys [A..K]
  assert.match(html, /data-semitone="0"\s+data-key="KeyA"/);
  assert.match(html, /data-semitone="1"\s+data-key="KeyW"/);
  assert.match(html, /data-semitone="12"\s+data-key="KeyK"/);

  const funIdx = html.indexOf('id="fun-machine-engine"');
  const beatIdx = html.indexOf('id="beat-engine"');
  assert.ok(funIdx > 0 && beatIdx > funIdx, "Fun Machine section must sit above the beat plate in the stack");

  assert.match(styles, /\.fun-machine-engine/);
  assert.match(styles, /\.fun-keyboard/);
  assert.match(styles, /\.fun-key-white/);
  assert.match(styles, /\.fun-key-black/);
  assert.doesNotMatch(styles, /\.fun-sequence|\.fun-step/);

  // Voices: a pad, an arpeggio pluck, and a gliding lead; no organ vibrato.
  assert.match(app, /function schedulePadChord\(/);
  assert.match(app, /function scheduleArpNote\(/);
  assert.match(app, /function scheduleFunLeadNote\(/);
  assert.match(app, /function releaseFunPads\(/);
  assert.doesNotMatch(app, /scheduleFunMachineChord|scheduleFunMachineLeadNote|startFunMachineVoice|frequency\.setValueAtTime\(5\.5/);
  assert.match(app, /const performance = performanceOf\(normSemi, funMachineStyle\)/);
  assert.match(app, /return buildPerformance\(key, style, activeGenre, currentScore \? currentScore\.root : 0, \{\n    pass: currentHarmonicPass,\n    score: currentScore,\n    varied: genreVaried,/, "every performance follows the clock and the creature (D-043, D-044)");
  assert.match(app, /applyEnsembleConductor\(performance\.steps\.map\(\(step\) => step\.chord\)\)/);
  // Raw Esoteric Chaos is unfettered unless a key is held (P5-27): no empty spine stands in.
  assert.match(app, /const spineToUse = overrideProgression\n    \? overrideProgression\.map\([^\n]*\n    : null;/);
  // The LOLCODE lead steps back for a held key or a recorded layer that leads (D-029, D-039).
  assert.match(app, /const duck = \(transport === currentTransport && activeHeldFunKey !== null\) \|\| transport\.songLeading \? LEAD_DUCK_GAIN : 1;/);
  // Phase 5: exports render the whole song with the same layer playback and follow rule.
  // Without a song an export renders the whole harmonic cycle (D-044).
  assert.match(app, /const passes = songPasses\(song\) \|\| HARMONIC_PASSES;/);
  assert.match(app, /const stepsCount = 12 \* passes;/);
  // The harmony moves on at each loop's downbeat, live and offline (D-044).
  assert.match(app, /if \(stepIndex === 0\) enterHarmonicPass\(transport, harmonicPassAt\(currentStep\)\);/);
  assert.match(app, /if \(step % 12 === 0 && harmonicPassAt\(step\) !== currentHarmonicPass\)/);
  assert.match(app, /harmonicPass: currentHarmonicPass,/);
  // MIDI markers name every chord change; sessions keep AS WRITTEN (D-043).
  assert.match(app, /\.\.\.arrangementMarkers\(stepStarts\), \.\.\.chordMarkers\(stepStarts, stepChords, score\)/);
  assert.match(app, /stepChords\.push\(currentConductedSpine\?\.\[step % 12\] \?\? null\);/);
  assert.match(app, /    varied: genreVaried,\n    funMachine: \{/);
  assert.match(app, /genreVaried = session\.varied;/);
  assert.match(app, /activeGenre = CREATURE_GENRE;/, "a fresh creature plays its own rulebook (D-043)");
  assert.match(app, /followSong\(offlineTransport, loop, step % 12, null\);/);
  assert.match(app, /playSongLayers\(offlineCtx, offlineTransport, score, step, loop,/);
  assert.match(app, /currentHarmonicPass = livePass;\n  restoreLiveConducting\(\);/, "the render hands the band back to the live loop");
  // Each recorded layer plays in the voice it was recorded in (D-040).
  assert.match(app, /performanceFor\(slot\), \{\n      \.\.\.timing,\n      patch: voicePatch\(slot\.voice\),/);
  assert.match(app, /makeSlot\(activeHeldFunKey, funMachineStyle, funVoiceId\)/);
  // The drones breathe with the harmony and rest with the lead, live and in exports.
  assert.equal((app.match(/shapeDrones\((?:transport|offlineTransport), score, (?:currentStep|step), (?:at|stepTime)\);/g) || []).length, 2);
  assert.match(app, /const resting = !arrangementPlays\("lead", stepIndex\);/);
  // The loop machine (P5-26 phase 2): record, follow, and play every layer on the step grid.
  assert.match(html, /<div class="looper" id="looper" role="group" aria-label="Loop machine">/);
  for (const id of ["looper-record", "looper-overdub", "looper-clear"]) assert.match(html, new RegExp(`id="${id}"`));
  assert.match(html, /<output class="looper-readout" id="looper-readout" aria-live="off">/);
  assert.match(html, /<div class="looper-steps" id="looper-steps"/, "looper has 12-step progress ribbon");
  assert.match(styles, /\.looper-steps \{[^}]*display: grid;/, "12-step tracker grid");
  assert.match(styles, /\.looper-step\.is-count-in/, "amber count-in styling");
  assert.match(styles, /\.looper-step\.is-recording/, "red recording styling");
  assert.match(app, /function renderLooperSteps\(/);
  assert.match(app, /advanceRecorder\(stepIndex, position, liveSlot\);\n      followSong\(transport, loop, stepIndex, liveSlot\);\n\n      scheduleEnsembleStep\(/, "the band is conducted before it plays the step");
  assert.match(app, /for \(const \{ layerIndex, slot \} of slotsAt\(loop, stepIndex\)\)/);
  assert.match(app, /releasable: false,/, "recorded pads ring out when a live key lets go");
  // Phase 3: loop tiles (one button each) and one edit row for the selected loop.
  assert.match(html, /<ol class="looper-tiles" id="looper-tiles" aria-label="Loops in the song, in playing order"><\/ol>/);
  for (const id of ["looper-repeats-down", "looper-repeats-up", "looper-move-earlier", "looper-move-later", "looper-undo", "looper-delete"]) {
    assert.match(html, new RegExp(`id="${id}"[^>]*disabled`), `${id} starts disabled`);
  }
  assert.match(styles, /\.looper-tiles \{[^}]*height: 3\.4rem;[^}]*overflow-x: auto;/, "tiles scroll sideways at a fixed height");
  assert.match(app, /enable\("#looper-move-earlier", loop && !busy && selectedLoop > 0\);/, "no structural edits while a take is armed or recording");
  assert.match(app, /function updateFunKeyboardChordLabels\(/);
  assert.match(app, /async function triggerFunKey\(/);
  assert.doesNotMatch(app, /customProgression|funMachineRec|funMachineReset|renderFunSequencerGrid|scheduleSequencedFunChord|selectedSequencerStep/);
});



test("the master transport deck exposes play, pause, stop, position, and hotkeys", async () => {
  const [html, styles, app] = await Promise.all([
    readFile(new URL("index.html", root), "utf8"),
    readFile(new URL("styles.css", root), "utf8"),
    readFile(new URL("src/app.mjs", root), "utf8"),
  ]);
  assert.match(html, /id="transport-deck" role="group" aria-label="Master transport"/);
  assert.match(html, /id="transport-play"[^>]*aria-pressed="false"[^>]*aria-keyshortcuts="Space"/);
  assert.match(html, /id="transport-pause"[^>]*aria-pressed="false"[^>]*aria-keyshortcuts="Space"/);
  assert.match(html, /id="transport-stop"[^>]*aria-keyshortcuts="Escape"/);
  // The step readout changes every step, so it must not talk to screen readers (P4-02).
  assert.match(html, /<output class="transport-position" id="transport-position" aria-live="off">/);
  assert.doesNotMatch(html, /class="kapellmeister-readout" aria-live/, "the per-step harmony readout stays quiet");
  assert.doesNotMatch(styles, /font-size: 0\.[0-5]\d?rem/, "no text below 0.6rem");
  assert.doesNotMatch(styles, /(?<!-)color: rgba\(228, 215, 190, 0\.(?:[0-4]\d?|5[0-4]?)\)/, "dimmed bone text keeps 4.5:1");
  assert.match(styles, /\.transport-deck \{/);
  assert.match(styles, /\.transport-button\[aria-pressed="true"\]/);
  assert.match(app, /async function runTransportCommand\(command\)/);
  assert.match(app, /transportCommandForKey\(event, \{ pointerFocused: pointerFocusedControl \}\)/);
  // Both transports build from the shared graph so a WAV renders what is heard.
  assert.equal(app.match(/buildEnsembleGraph\(/g).length, 2);
  assert.doesNotMatch(app, /context\.createDynamicsCompressor\(\)|offlineCtx\.createDynamicsCompressor\(\)/);
});

test("the parlor mixing console sits after the Fun Machine and before the beat plate and drives the strips", async () => {
  const [html, styles, app] = await Promise.all([
    readFile(new URL("index.html", root), "utf8"),
    readFile(new URL("styles.css", root), "utf8"),
    readFile(new URL("src/app.mjs", root), "utf8"),
  ]);
  const funAt = html.indexOf('id="fun-machine-engine"');
  const mixerAt = html.indexOf('id="mixer-engine"');
  const beatAt = html.indexOf('id="beat-engine"');
  assert.ok(funAt > 0 && funAt < mixerAt && mixerAt < beatAt);
  assert.match(html, /id="mixer-strips"/);
  assert.match(html, /id="mixer-telemetry"/);
  assert.match(html, /id="mixer-reset"/);
  assert.match(styles, /\.mixer-fader \{[\s\S]*writing-mode: vertical-lr/);
  assert.match(styles, /\.mixer-meter-fill \{[\s\S]*var\(--level\)/);
  assert.match(app, /function renderMixerConsole\(\)/);
  assert.match(app, /function applyMixerToTransport\(\)/);
  assert.match(app, /channels: channelSettings\(mixerState\)/);
  assert.match(app, /getFloatTimeDomainData\(meterBuffer\)/);
  // Plate switches are channel mutes; no parallel enable flags remain.
  assert.doesNotMatch(app, /\b(beat|bass|harmony|chime|chant)Enabled\b/);
  assert.match(app, /updateMixer\(toggleMute\(mixerState, "beat"\)\)/);
});

test("stem ZIP and MIDI exports are wired through the shared offline renderer", async () => {
  const [html, app] = await Promise.all([
    readFile(new URL("index.html", root), "utf8"),
    readFile(new URL("src/app.mjs", root), "utf8"),
  ]);
  assert.match(html, /id="export-stems"[^>]*disabled/);
  assert.match(html, /EXPORT 9 STEMS \(ZIP\)/);
  assert.match(html, /id="export-midi"[^>]*disabled/);
  assert.match(html, /WRITE MIDI SCORE/);
  assert.match(app, /async function renderEnsembleLoop\(score/);
  assert.match(app, /async function exportSpecimenStems\(\)/);
  assert.match(app, /async function exportSpecimenMidi\(\)/);
  assert.match(app, /channels: stemSettings\(mixerState, id\)/);
  assert.match(app, /captureNotes: true, render: false/);
  // WAV, stems, and MIDI all schedule through renderEnsembleLoop; only one OfflineAudioContext is built.
  assert.equal(app.match(/new OfflineAudioCtx\(/g).length, 1);
  for (const channel of ["lead", "beat", "bass", "harmony", "chime", "chant"]) {
    assert.match(app, new RegExp(`logNote\\(transport, "${channel}"`), channel);
  }
});

test("the session ledger saves presets on-device and .fun files through the validated boundary", async () => {
  const [html, app] = await Promise.all([
    readFile(new URL("index.html", root), "utf8"),
    readFile(new URL("src/app.mjs", root), "utf8"),
  ]);
  const mixerAt = html.indexOf('id="mixer-engine"');
  const sessionAt = html.indexOf('id="session-engine"');
  const beatAt = html.indexOf('id="beat-engine"');
  assert.ok(mixerAt < sessionAt && sessionAt < beatAt);
  for (const id of ["session-preset-name", "session-save-preset", "session-preset-list", "session-load-preset", "session-delete-preset", "session-save-file", "session-open-file", "session-file-input"]) {
    assert.match(html, new RegExp(`id="${id}"`), id);
  }
  assert.match(html, /<label for="session-preset-name">/);
  assert.match(html, /<label for="session-preset-list">/);
  assert.match(html, /id="session-file-input" type="file" accept="\.fun,application\/json" hidden/);
  assert.match(app, /function captureSession\(\)/);
  assert.match(app, /function applySession\(session\)/);
  assert.match(app, /applySession\(parseSession\(await file\.text\(\)\)\)/);
  assert.match(app, /file\.size > MAX_SESSION_BYTES/);
  // Every storage access is guarded.
  const storageCalls = app.match(/window\.localStorage\.\w+/g) || [];
  assert.ok(storageCalls.length >= 3);
  for (const fn of ["readPresetStore", "writePresetStore", "readCabinetState", "writeCabinetState"]) {
    const body = app.slice(app.indexOf(`function ${fn}(`), app.indexOf("\n}\n", app.indexOf(`function ${fn}(`)));
    assert.match(body, /try \{[\s\S]*window\.localStorage[\s\S]*\} catch \{/, fn);
  }
  assert.equal((app.match(/localStorage\./g) || []).length, storageCalls.length, "no unguarded storage access elsewhere");
  assert.doesNotMatch(app, /sessionStorage|indexedDB|document\.cookie/);
  // Discovery (D-037): the four drawers unlock from the app's own moments.
  assert.match(app, /unlockDrawer\("held-key"\)/);
  assert.match(app, /if \(currentStep % 12 === 11\) noteLoopHeard\(\);/);
  assert.match(app, /if \(target\.closest\(KEEPSAKE_AREAS\)\) unlockDrawer\("change"\);/);
  assert.match(app, /unlockDrawer\("band"\)/);
  assert.match(html, /<div class="cabinet-switch" id="cabinet-switch" hidden>/, "the switch appears only once the script runs");
  assert.match(html, /<p class="visually-hidden" id="cabinet-announcer" role="status"><\/p>/);
});

test("the page groups the workstation into perform, mix, keep, and band wings (D-027)", async () => {
  const [html, styles] = await Promise.all([
    readFile(new URL("index.html", root), "utf8"),
    readFile(new URL("styles.css", root), "utf8"),
  ]);
  const at = (id) => {
    const index = html.indexOf(`id="${id}"`);
    assert.ok(index > 0, `missing #${id}`);
    return index;
  };
  const wingOf = (id) => ["wing-band", "wing-keep", "wing-mix", "wing-perform"].find((wing) => at(wing) < at(id));
  const order = ["reading", "cabinet-switch", "wing-perform", "transport-deck", "fun-machine-engine", "kapellmeister-engine",
    "wing-mix", "bandstand-engine", "mixer-engine", "parlor-acoustics-engine",
    "wing-keep", "session-engine", "export-engine",
    "wing-band", "beat-engine", "bass-engine", "harmony-engine", "chime-engine", "chant-engine"];
  for (let i = 1; i < order.length; i += 1) {
    assert.ok(at(order[i - 1]) < at(order[i]), `${order[i - 1]} must precede ${order[i]}`);
  }
  for (const wing of ["perform", "mix", "keep", "band"]) {
    assert.match(html, new RegExp(`<section class="workstation-wing wing-${wing}" id="wing-${wing}" aria-labelledby="wing-${wing}-heading">`));
    assert.match(html, new RegExp(`<h2 id="wing-${wing}-heading">`));
  }

  // The reading strip only reads: no control lives inside the live region.
  const reading = html.slice(at("reading"), html.indexOf("</section>", at("reading")));
  assert.doesNotMatch(reading, /<button|<input|<select/);
  for (const id of ["transport-play", "replay", "master-volume", "tempo-bpm"]) {
    assert.equal(wingOf(id), "wing-perform", id);
    assert.ok(at(id) < at("fun-machine-engine"), `${id} belongs to the transport rail`);
  }
  for (const id of ["export-wav", "export-stems", "export-midi", "export-png", "share-link"]) {
    assert.equal(wingOf(id), "wing-keep", id);
    assert.ok(at(id) > at("export-engine"), `${id} belongs to the export desk`);
  }

  // The calling-slip look belongs to the phrase alone, so the preset field stays one line tall.
  assert.doesNotMatch(styles, /input\[type="text"\]/);
  assert.match(styles, /#phrase \{\n {4}min-height: 3\.8rem;/);
  // Consoles never widen past the cabinet, which clips overflow instead of scrolling.
  assert.match(styles, /\.beat-engine \{\n {2}display: grid;\n {2}grid-template-columns: minmax\(0, 1fr\);/);
});

test("every element the app looks up by id exists in the page", async () => {
  // The Fun Machine's telemetry line once vanished from index.html while the
  // app kept writing to it, so its narration never showed.
  const [app, html] = await Promise.all([readFile(new URL("../src/app.mjs", import.meta.url), "utf8"), readFile(new URL("../index.html", import.meta.url), "utf8")]);
  const ids = [...new Set([...app.matchAll(/document\.querySelector\("#([a-z0-9-]+)"\)/g)].map((match) => match[1]))];
  assert.ok(ids.length > 100);
  const missing = ids.filter((id) => !html.includes(`id="${id}"`));
  assert.deepEqual(missing, [], `the app looks for ${missing.join(", ")}`);
  assert.match(html, /<span class="beat-telemetry" id="fun-machine-telemetry">/);
});
