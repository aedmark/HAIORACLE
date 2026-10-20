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
  assert.match(app, /fetch\("src\/conductor\.i"\)/);
  assert.match(app, /fetch\("src\/rulebooks\.ni"\)/);
  // The Inform 7 rulebooks install before anything reads a genre or a preset (D-033).
  const install = app.indexOf("installRulebooks(compileRulebooks(rulebooksSource));");
  assert.ok(install > 0, "the app installs the compiled rulebooks");
  assert.ok(app.indexOf("renderPresetList();", install) > install, "presets render only after the rulebooks install");
  assert.equal(app.slice(0, install).match(/^renderPresetList\(\);$/m), null, "no preset render at module start");
  assert.match(app, /function updateFunKeyboardChordLabels\(\) \{\n[^\n]*\n  if \(!rulebooksInstalled\(\)\) return;/);
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
  assert.match(ensemble, /parlorConvolver\.normalize\s*=\s*false/);
  assert.match(ensemble, /parlorReverbFilter/);
  assert.match(app, /maxSpectralMag/);
  assert.match(app, /elements\.chipCrackle\?\.addEventListener/);
  assert.match(app, /elements\.chipReverb\?\.addEventListener/);
  assert.match(app, /elements\.chipTick\?\.addEventListener/);
});

test("the Esoteric Fun Machine accompanist and loop punch-in sequencer are wired up", async () => {
  const [html, styles, app] = await Promise.all([
    readFile(new URL("index.html", root), "utf8"),
    readFile(new URL("styles.css", root), "utf8"),
    readFile(new URL("src/app.mjs", root), "utf8"),
  ]);

  // Markup: style chips replace the organ's mode switch and chord-quality chips (D-028).
  assert.match(html, /id="fun-machine-engine"/);
  assert.match(html, /id="fun-machine-status"/);
  assert.match(html, /id="fun-machine-telemetry"/);
  assert.match(html, /id="fun-machine-rec"/);
  assert.match(html, /id="fun-machine-reset"/);
  assert.match(html, /id="fun-keyboard"/);
  assert.match(html, /id="fun-sequence-grid"/);
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
  assert.ok(funIdx > 0 && beatIdx > funIdx, "Fun Machine section must sit above Plate II beat-engine in the stack");

  assert.match(styles, /\.fun-machine-engine/);
  assert.match(styles, /\.fun-keyboard/);
  assert.match(styles, /\.fun-key-white/);
  assert.match(styles, /\.fun-key-black/);
  assert.match(styles, /\.fun-sequence-grid/);

  // Voices: a pad, an arpeggio pluck, and a gliding lead; no organ vibrato.
  assert.match(app, /function schedulePadChord\(/);
  assert.match(app, /function scheduleArpNote\(/);
  assert.match(app, /function scheduleFunLeadNote\(/);
  assert.match(app, /function releaseFunPads\(/);
  assert.doesNotMatch(app, /scheduleFunMachineChord|scheduleFunMachineLeadNote|startFunMachineVoice|frequency\.setValueAtTime\(5\.5/);
  assert.match(app, /buildPerformance\(normSemi, funMachineStyle, activeGenre/);
  assert.match(app, /applyEnsembleConductor\(performance\.steps\.map\(\(step\) => step\.chord\)\)/);
  assert.match(app, /const duck = transport === currentTransport && activeHeldFunKey !== null \? LEAD_DUCK_GAIN : 1;/);
  assert.match(app, /function renderFunSequencerGrid\(/);
  assert.match(app, /function updateFunKeyboardChordLabels\(/);
  assert.match(app, /async function triggerFunKey\(/);
  assert.match(app, /elements\.funMachineRec\?\.addEventListener/);
  assert.match(app, /elements\.funMachineReset\?\.addEventListener/);
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
  assert.match(html, /<output class="transport-position" id="transport-position">/);
  assert.match(styles, /\.transport-deck \{/);
  assert.match(styles, /\.transport-button\[aria-pressed="true"\]/);
  assert.match(app, /async function runTransportCommand\(command\)/);
  assert.match(app, /transportCommandForKey\(event, \{ pointerFocused: pointerFocusedControl \}\)/);
  // Both transports build from the shared graph so a WAV renders what is heard.
  assert.equal(app.match(/buildEnsembleGraph\(/g).length, 2);
  assert.doesNotMatch(app, /context\.createDynamicsCompressor\(\)|offlineCtx\.createDynamicsCompressor\(\)/);
});

test("the parlor mixing console sits after the Fun Machine and before Plate II and drives the strips", async () => {
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
  for (const fn of ["readPresetStore", "writePresetStore"]) {
    const body = app.slice(app.indexOf(`function ${fn}(`), app.indexOf("\n}\n", app.indexOf(`function ${fn}(`)));
    assert.match(body, /try \{[\s\S]*window\.localStorage[\s\S]*\} catch \{/, fn);
  }
  assert.equal((app.match(/localStorage\./g) || []).length, storageCalls.length, "no unguarded storage access elsewhere");
  assert.doesNotMatch(app, /sessionStorage|indexedDB|document\.cookie/);
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
  const order = ["reading", "wing-perform", "transport-deck", "fun-machine-engine", "kapellmeister-engine",
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
  const reading = html.slice(at("reading"), at("wing-perform"));
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
