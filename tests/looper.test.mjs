import assert from "node:assert/strict";
import test from "node:test";

import {
  DEFAULT_LOOP_ROLE,
  LOOP_ROLES,
  LOOP_STEPS,
  MAX_LAYERS,
  MAX_LOOPS,
  MAX_REPEATS,
  MAX_SONG_PASSES,
  SLOT_VOICES,
  SongError,
  appendLoop,
  canAppendLoop,
  canInsertLoops,
  canOverdub,
  clampSelection,
  deleteLoop,
  emptySong,
  emptyTake,
  idleRecorder,
  insertSection,
  isEmptyTake,
  leadSlotAt,
  makeSlot,
  moveLoop,
  overdubLayer,
  recorderReduce,
  sectionPassForLoop,
  setLoopRole,
  setLoopSlot,
  setRepeats,
  setSectionVoices,
  slotsAt,
  songPasses,
  songPosition,
  transposeSectionLoops,
  undoLayer,
  validateSong,
} from "../src/looper.mjs";

// A take holding `key` on the given steps.
function take(key, steps, style = "progression") {
  const slots = Array(LOOP_STEPS).fill(null);
  for (const step of steps) slots[step] = makeSlot(key, style);
  return Object.freeze(slots);
}

test("a song of loops, each a stack of takes: append, overdub, undo, delete, move", () => {
  let song = emptySong();
  assert.equal(songPasses(song), 0);
  assert.equal(appendLoop(song, emptyTake()), song, "an empty take adds nothing");
  song = appendLoop(song, take(0, [0, 1, 2]));
  song = appendLoop(song, take(7, [3]));
  assert.equal(song.loops.length, 2);
  assert.deepEqual(song.loops.map((loop) => [loop.repeats, loop.layers.length]), [[1, 1], [1, 1]]);
  assert.ok(Object.isFrozen(song) && Object.isFrozen(song.loops[0].layers[0]));

  song = overdubLayer(song, 0, take(4, [6, 7]));
  assert.equal(song.loops[0].layers.length, 2, "overdub stacks a layer on the chosen loop");
  assert.equal(overdubLayer(song, 5, take(4, [0])), song, "no such loop");
  assert.equal(overdubLayer(song, 0, emptyTake()), song, "an empty overdub adds nothing");

  song = undoLayer(song, 0);
  assert.equal(song.loops[0].layers.length, 1, "undo removes the newest layer");
  song = undoLayer(song, 1);
  assert.equal(song.loops.length, 1, "undoing a loop's only layer removes the loop");

  song = appendLoop(appendLoop(song, take(2, [0])), take(9, [0]));
  assert.deepEqual(song.loops.map((loop) => loop.layers[0][0].key), [0, 2, 9]);
  song = moveLoop(song, 2, -2);
  assert.deepEqual(song.loops.map((loop) => loop.layers[0][0].key), [9, 0, 2], "move a loop earlier");
  assert.equal(moveLoop(song, 0, -1), song, "cannot move past the start");
  song = deleteLoop(song, 1);
  assert.deepEqual(song.loops.map((loop) => loop.layers[0][0].key), [9, 2]);
});

test("limits: 16 loops, 4 layers, 1..8 repeats, 32 passes in all", () => {
  let song = emptySong();
  for (let i = 0; i < MAX_LOOPS + 3; i += 1) song = appendLoop(song, take(i % 13, [0]));
  assert.equal(song.loops.length, MAX_LOOPS);
  assert.equal(canAppendLoop(song), false);

  let loop = appendLoop(emptySong(), take(0, [0]));
  for (let i = 0; i < MAX_LAYERS + 2; i += 1) loop = overdubLayer(loop, 0, take(1, [1]));
  assert.equal(loop.loops[0].layers.length, MAX_LAYERS);
  assert.equal(canOverdub(loop, 0), false);

  assert.equal(setRepeats(loop, 0, 99).loops[0].repeats, MAX_REPEATS);
  assert.equal(setRepeats(loop, 0, 0).loops[0].repeats, 1);
  assert.equal(setRepeats(loop, 0, 1), loop, "no change returns the same song");

  // Sixteen loops at x2 would be 32 passes: the pass budget then stops more.
  let full = song;
  for (let i = 0; i < MAX_LOOPS; i += 1) full = setRepeats(full, i, 2);
  assert.equal(songPasses(full), MAX_SONG_PASSES);
  assert.equal(setRepeats(full, 0, 5).loops[0].repeats, 2, "repeats cannot exceed the song's pass budget");
  const short = deleteLoop(full, 15);
  assert.equal(canAppendLoop(short), true);
  assert.equal(setRepeats(short, 0, 8).loops[0].repeats, 4, "the freed passes go to the loop that asks");
});

test("the song plays each loop for its repeats, then the next, then starts over", () => {
  let song = appendLoop(appendLoop(emptySong(), take(0, [0])), take(5, [0]));
  song = setRepeats(song, 0, 2);
  assert.equal(songPasses(song), 3);
  const at = (absoluteStep) => {
    const position = songPosition(song, absoluteStep);
    return [position.loopIndex, position.repeat, position.step];
  };
  assert.deepEqual(at(0), [0, 0, 0]);
  assert.deepEqual(at(11), [0, 0, 11]);
  assert.deepEqual(at(12), [0, 1, 0], "loop 1 again for its second repeat");
  assert.deepEqual(at(24), [1, 0, 0], "then loop 2");
  assert.deepEqual(at(36), [0, 0, 0], "then back to the top");
  assert.equal(songPosition(emptySong(), 5), null);
});

test("every layer sounds, but the band follows the newest layer holding a key; a live key overrides", () => {
  let song = appendLoop(emptySong(), take(0, [0, 1, 2, 3]));
  song = overdubLayer(song, 0, take(7, [2, 3, 4]));
  const loop = song.loops[0];
  assert.deepEqual(slotsAt(loop, 2).map((entry) => [entry.layerIndex, entry.slot.key]), [[0, 0], [1, 7]], "both layers sound at step 3");
  assert.deepEqual([0, 2, 4, 5].map((step) => leadSlotAt(loop, step)?.key ?? null), [0, 7, 7, null], "newest layer leads, older fills in");
  assert.equal(leadSlotAt(loop, 0, makeSlot(12, "swell")).key, 12, "a live key overrides every recording");
  assert.equal(leadSlotAt(null, 0), null);
});

test("the recorder starts on the next loop boundary and hands back one full pass", () => {
  let recorder = idleRecorder();
  const step = (state, stepIndex, held, loopIndex = null) => recorderReduce(state, { type: "step", step: stepIndex, loopIndex, held });

  let result = step(recorder, 4, makeSlot(0, "swell"));
  assert.equal(result.recorder, recorder, "an idle recorder ignores steps");

  recorder = recorderReduce(recorder, { type: "arm", kind: "new" }).recorder;
  assert.equal(recorder.mode, "armed");
  result = step(recorder, 7, makeSlot(3, "swell"));
  assert.equal(result.recorder.mode, "armed", "armed mid-loop waits for step 1");
  recorder = result.recorder;
  const held = (s) => (s >= 2 && s <= 4 ? makeSlot(3, "arpeggio") : null);
  let finished = null;
  for (let s = 0; s < LOOP_STEPS; s += 1) {
    ({ recorder, finished } = step(recorder, s, held(s)));
    if (s < LOOP_STEPS - 1) assert.equal(recorder.mode, "recording");
  }
  assert.equal(recorder.mode, "idle", "one pass, then it stops");
  assert.equal(finished.kind, "new");
  assert.deepEqual(finished.take.map((slot) => slot?.key ?? null), [null, null, 3, 3, 3, null, null, null, null, null, null, null]);

  // Overdub waits for its own loop's next pass.
  recorder = recorderReduce(idleRecorder(), { type: "arm", kind: "overdub", loopIndex: 1 }).recorder;
  assert.equal(step(recorder, 0, null, 0).recorder.mode, "armed", "loop 1 playing: keep waiting for loop 2");
  recorder = step(recorder, 0, makeSlot(9, "swell"), 1).recorder;
  assert.equal(recorder.mode, "recording");
  for (let s = 1; s < LOOP_STEPS; s += 1) ({ recorder, finished } = step(recorder, s, null, 1));
  assert.equal(finished.kind, "overdub");
  assert.equal(finished.loopIndex, 1);
  assert.equal(isEmptyTake(finished.take), false);

  // A pass with no key held is still reported, so the host can say it was discarded.
  recorder = recorderReduce(idleRecorder(), { type: "arm", kind: "new" }).recorder;
  for (let s = 0; s < LOOP_STEPS; s += 1) ({ recorder, finished } = step(recorder, s, null));
  assert.equal(isEmptyTake(finished.take), true);

  assert.equal(recorderReduce(recorderReduce(idleRecorder(), { type: "arm", kind: "new" }).recorder, { type: "cancel" }).recorder.mode, "idle");
  assert.equal(recorderReduce(idleRecorder(), { type: "arm", kind: "overdub" }).recorder.mode, "idle", "overdub needs a loop");
});

test("saved songs validate strictly and round-trip", () => {
  let song = appendLoop(emptySong(), take(12, [0, 5], "arpeggio"));
  song = setRepeats(overdubLayer(song, 0, take(3, [6])), 0, 3);
  const plain = JSON.parse(JSON.stringify(song));
  assert.deepEqual(validateSong(plain), song);
  assert.deepEqual(validateSong({ loops: [] }), emptySong());

  const rejects = (raw, path) => assert.throws(() => validateSong(raw), (error) => error instanceof SongError && error.path === path, path);
  rejects([], "song");
  rejects({ loops: [], extra: 1 }, "song.extra");
  rejects({ loops: [{ repeats: 0, layers: plain.loops[0].layers }] }, "song.loops[0].repeats");
  rejects({ loops: [{ repeats: 1, layers: [] }] }, "song.loops[0].layers");
  rejects({ loops: [{ repeats: 1, layers: [Array(11).fill(null)] }] }, "song.loops[0].layers[0]");
  rejects({ loops: [{ repeats: 1, layers: [Array(12).fill(null)] }] }, "song.loops[0].layers[0]");
  const bad = (slot) => ({ loops: [{ repeats: 1, layers: [[slot, ...Array(11).fill(null)]] }] });
  rejects(bad({ key: 13, style: "swell", voice: "velvet_pad" }), "song.loops[0].layers[0][0].key");
  rejects(bad({ key: 2, style: "organ", voice: "velvet_pad" }), "song.loops[0].layers[0][0].style");
  rejects(bad({ key: 2, style: "swell", voice: "kazoo" }), "song.loops[0].layers[0][0].voice");
  rejects(bad({ key: 2, style: "swell" }), "song.loops[0].layers[0][0].voice");
  rejects(bad({ key: 2, style: "swell", voice: "velvet_pad", velocity: 9 }), "song.loops[0].layers[0][0].velocity");
  const long = { loops: Array.from({ length: 5 }, () => ({ repeats: 8, layers: plain.loops[0].layers })) };
  rejects(long, "song.loops");
  assert.throws(() => makeSlot(13, "swell"), RangeError);
  assert.throws(() => makeSlot(2, "swell", "kazoo"), RangeError);
});

test("every slot keeps the voice it was played in; songs saved before voices play in VELVET PAD", () => {
  assert.equal(makeSlot(4, "swell").voice, "velvet_pad");
  assert.equal(makeSlot(4, "swell", "creature").voice, "creature");
  assert.ok(SLOT_VOICES.includes("creature") && SLOT_VOICES.includes("aether_choir"));
  const song = appendLoop(emptySong(), Object.freeze([makeSlot(0, "swell", "music_box"), makeSlot(0, "swell", "harmonium"), ...Array(10).fill(null)]));
  assert.deepEqual(validateSong(JSON.parse(JSON.stringify(song))), song);
  const legacy = { loops: [{ repeats: 1, layers: [[{ key: 3, style: "arpeggio" }, ...Array(11).fill(null)]] }] };
  assert.equal(validateSong(legacy, "song", { legacy: true }).loops[0].layers[0][0].voice, "velvet_pad");
  assert.throws(() => validateSong({ loops: [{ repeats: 1, layers: [[{ key: 3, style: "arpeggio", voice: "harmonium" }, ...Array(11).fill(null)]] }] }, "song", { legacy: true }),
    (error) => error.path === "song.loops[0].layers[0][0].voice");
});

test("the selected loop stays valid after edits", () => {
  const song = appendLoop(appendLoop(emptySong(), take(0, [0])), take(5, [0]));
  assert.equal(clampSelection(song, 1), 1);
  assert.equal(clampSelection(song, 4), 1, "past the end falls back to the last loop");
  assert.equal(clampSelection(song, null), 0);
  assert.equal(clampSelection(emptySong(), 0), null, "an empty song selects nothing");
});

test("the recorder supports count-in passes and slot updates", () => {
  let recorder = recorderReduce(idleRecorder(), { type: "arm", kind: "new", countIn: 12 }).recorder;
  assert.equal(recorder.mode, "armed");
  assert.equal(recorder.countIn, 12);

  // 12 steps of count-in pass (steps 0..11)
  for (let s = 0; s < LOOP_STEPS; s += 1) {
    const { recorder: next, finished } = recorderReduce(recorder, { type: "step", step: s, held: null });
    assert.equal(finished, null);
    assert.equal(next.mode, "armed");
    recorder = next;
  }
  assert.equal(recorder.countIn, 0);

  // Next step 0 begins recording pass
  let result = recorderReduce(recorder, { type: "step", step: 0, held: makeSlot(0, "swell") });
  recorder = result.recorder;
  assert.equal(recorder.mode, "recording");
  assert.equal(recorder.take[0]?.key, 0);

  // Live slot update on step 2
  recorder = recorderReduce(recorder, { type: "slot", step: 2, slot: makeSlot(7, "swell") }).recorder;
  assert.equal(recorder.take[2]?.key, 7);

  // Remaining steps 1..11
  let finishedTake = null;
  for (let s = 1; s < LOOP_STEPS; s += 1) {
    const res = recorderReduce(recorder, { type: "step", step: s, held: s === 2 ? recorder.take[2] : null });
    recorder = res.recorder;
    if (res.finished) finishedTake = res.finished;
  }
  assert.equal(recorder.mode, "idle");
  assert.ok(finishedTake);
  assert.equal(finishedTake.take[0]?.key, 0);
  assert.equal(finishedTake.take[2]?.key, 7);
});

test("setLoopSlot programs individual steps and creates a loop on demand", () => {
  let song = emptySong();
  // Setting a slot on an empty song creates a 1-loop, 1-layer song
  song = setLoopSlot(song, null, null, 0, makeSlot(5, "arpeggio"));
  assert.equal(song.loops.length, 1);
  assert.equal(song.loops[0].layers[0][0]?.key, 5);
  assert.equal(song.loops[0].layers[0][1], null);

  // Updating step 4
  song = setLoopSlot(song, 0, 0, 4, makeSlot(9, "swell"));
  assert.equal(song.loops[0].layers[0][4]?.key, 9);

  // Clearing step 4
  song = setLoopSlot(song, 0, 0, 4, null);
  assert.equal(song.loops[0].layers[0][4], null);
  assert.equal(song.loops[0].layers[0][0]?.key, 5);
});

test("downbeat anticipation latches keystrokes during count-in onto step 0", () => {
  let recorder = recorderReduce(idleRecorder(), { type: "arm", kind: "new", countIn: 12 }).recorder;
  assert.equal(recorder.mode, "armed");

  // Advance 11 steps of count-in
  for (let s = 0; s < 11; s += 1) {
    recorder = recorderReduce(recorder, { type: "step", step: s, held: null }).recorder;
  }
  assert.equal(recorder.countIn, 1);

  // User strikes downbeat early during the final count-in step
  recorder = recorderReduce(recorder, { type: "anticipate", slot: makeSlot(3, "progression") }).recorder;
  assert.equal(recorder.anticipatedSlot?.key, 3);

  // Advance step 11 (countIn reaches 0)
  recorder = recorderReduce(recorder, { type: "step", step: 11, held: null }).recorder;
  assert.equal(recorder.countIn, 0);

  // Downbeat step 0 arrives: anticipated slot latches onto take[0]
  const { recorder: recordingState } = recorderReduce(recorder, { type: "step", step: 0, held: null });
  assert.equal(recordingState.mode, "recording");
  assert.equal(recordingState.take[0]?.key, 3);
  assert.equal(recordingState.anticipatedSlot, null);
});

test("holding a key continuously records across all sustained steps without truncation (arpeggios & swells)", () => {
  let recorder = recorderReduce(idleRecorder(), { type: "arm", kind: "new", countIn: 0 }).recorder;
  // Step 0 begins recording
  recorder = recorderReduce(recorder, { type: "step", step: 0, held: null }).recorder;
  assert.equal(recorder.mode, "recording");

  // User presses and holds an arpeggio key from step 2 through step 5
  const arpSlot = makeSlot(4, "arpeggio");
  // Strike on step 2
  recorder = recorderReduce(recorder, { type: "slot", step: 2, slot: arpSlot }).recorder;
  let finished = null;
  for (let s = 1; s < LOOP_STEPS; s += 1) {
    const isHeld = s >= 2 && s <= 5;
    const res = recorderReduce(recorder, { type: "step", step: s, held: isHeld ? arpSlot : null });
    recorder = res.recorder;
    if (res.finished) finished = res.finished;
  }
  assert.equal(recorder.mode, "idle");
  assert.ok(finished);
  // Assert steps 2, 3, 4, 5 all hold the arpeggio slot
  assert.equal(finished.take[0], null);
  assert.equal(finished.take[1], null);
  assert.equal(finished.take[2]?.key, 4);
  assert.equal(finished.take[3]?.key, 4);
  assert.equal(finished.take[4]?.key, 4);
  assert.equal(finished.take[5]?.key, 4);
  assert.equal(finished.take[6], null);
});

test("loop section roles (intro, main, bridge, outro), progression state machine, and validation", () => {
  let song = emptySong();
  song = appendLoop(song, take(0, [0]), "intro");
  song = appendLoop(song, take(2, [0]), "main");
  song = appendLoop(song, take(4, [0]), "bridge");
  song = appendLoop(song, take(7, [0]), "outro");

  assert.equal(song.loops.length, 4);
  assert.equal(song.loops[0].role, "intro");
  assert.equal(song.loops[1].role, "main");
  assert.equal(song.loops[2].role, "bridge");
  assert.equal(song.loops[3].role, "outro");

  // setLoopRole
  song = setLoopRole(song, 1, "bridge");
  assert.equal(song.loops[1].role, "bridge");
  song = setLoopRole(song, 1, "main");
  assert.equal(song.loops[1].role, "main");
  assert.equal(setLoopRole(song, 1, "invalid_role"), song, "invalid role refused");

  // Continuous playback: plays all loops sequentially in order, then loops back
  assert.equal(songPosition(song, 0 * LOOP_STEPS).loopIndex, 0, "pass 0 = loop 0");
  assert.equal(songPosition(song, 1 * LOOP_STEPS).loopIndex, 1, "pass 1 = loop 1");
  assert.equal(songPosition(song, 2 * LOOP_STEPS).loopIndex, 2, "pass 2 = loop 2");
  assert.equal(songPosition(song, 3 * LOOP_STEPS).loopIndex, 3, "pass 3 = loop 3");
  assert.equal(songPosition(song, 4 * LOOP_STEPS).loopIndex, 0, "pass 4 = cycles cleanly back to loop 0");

  // Validation
  const plain = JSON.parse(JSON.stringify(song));
  const restored = validateSong(plain);
  assert.deepEqual(restored, song);

  // Missing role defaults to main in playback and access
  const withoutRole = { loops: [{ repeats: 1, layers: [take(0, [0])] }] };
  assert.equal(validateSong(withoutRole).loops[0].role ?? DEFAULT_LOOP_ROLE, "main");

  // Bad role throws
  const badRole = { loops: [{ role: "chorus", repeats: 1, layers: [take(0, [0])] }] };
  assert.throws(() => validateSong(badRole), (err) => err instanceof SongError && err.path === "song.loops[0].role");
});

test("section loop slots (intro, bridge, outro) enforce manual key bounds 0..12", () => {
  // MIDI root notes (30..65) must be mapped to manual keys (0..12) before makeSlot
  for (const midiRoot of [36, 48, 55, 60, 65]) {
    assert.throws(() => makeSlot(midiRoot, "intro"), (err) => err instanceof RangeError);
    const key = ((midiRoot % 12) + 12) % 12;
    assert.ok(key >= 0 && key <= 12);
    for (const role of ["intro", "bridge", "outro"]) {
      const slot = makeSlot(key, role);
      assert.equal(slot.key, key);
      assert.equal(slot.style, role);
    }
  }

  // A generated section loop with 12 steps appends and validates cleanly
  let song = emptySong();
  for (const role of ["intro", "bridge", "outro"]) {
    const slot = makeSlot(0, role);
    const fullTake = Object.freeze(Array(LOOP_STEPS).fill(slot));
    song = appendLoop(song, fullTake, role);
  }
  assert.equal(song.loops.length, 3);
  assert.equal(song.loops[0].role, "intro");
  assert.equal(song.loops[1].role, "bridge");
  assert.equal(song.loops[2].role, "outro");
  const validated = validateSong(JSON.parse(JSON.stringify(song)));
  assert.deepEqual(validated, song);
});

test("canInsertLoops, insertSection, and sectionPassForLoop support 48-step sections", () => {
  let song = emptySong();
  assert.equal(canInsertLoops(song, 4), true);
  assert.equal(canInsertLoops(song, 17), false);

  const introSlot = makeSlot(0, "intro");
  const introTakes = Array.from({ length: 4 }, () => Array(LOOP_STEPS).fill(introSlot));

  // Insert 4-bar Intro at the start
  song = insertSection(song, "intro", introTakes, 0);
  assert.equal(song.loops.length, 4);
  assert.equal(song.loops[0].role, "intro");
  assert.equal(song.loops[3].role, "intro");
  assert.equal(sectionPassForLoop(song, 0), 0, "Intro pass 0 (Part 1/4)");
  assert.equal(sectionPassForLoop(song, 1), 1, "Intro pass 1 (Part 2/4)");
  assert.equal(sectionPassForLoop(song, 2), 2, "Intro pass 2 (Part 3/4)");
  assert.equal(sectionPassForLoop(song, 3), 3, "Intro pass 3 (Part 4/4)");

  // Append a main loop
  const mainTake = take(2, [0]);
  song = appendLoop(song, mainTake, "main");
  assert.equal(song.loops.length, 5);
  assert.equal(song.loops[4].role, "main");
  assert.equal(sectionPassForLoop(song, 4), 0, "main loop has pass 0 (Part 1/4)");

  // Insert 4-bar Bridge after the main loop (at index 5)
  const bridgeSlot = makeSlot(5, "bridge");
  const bridgeTakes = Array.from({ length: 4 }, () => Array(LOOP_STEPS).fill(bridgeSlot));
  song = insertSection(song, "bridge", bridgeTakes, 5);
  assert.equal(song.loops.length, 9);
  assert.equal(song.loops[5].role, "bridge");
  assert.equal(song.loops[8].role, "bridge");
  assert.equal(sectionPassForLoop(song, 5), 0, "Bridge pass 0 (Part 1/4)");
  assert.equal(sectionPassForLoop(song, 6), 1, "Bridge pass 1 (Part 2/4)");
  assert.equal(sectionPassForLoop(song, 7), 2, "Bridge pass 2 (Part 3/4)");
  assert.equal(sectionPassForLoop(song, 8), 3, "Bridge pass 3 (Part 4/4)");

  // Append 4-bar Outro at the end
  const outroSlot = makeSlot(0, "outro");
  const outroTakes = Array.from({ length: 4 }, () => Array(LOOP_STEPS).fill(outroSlot));
  song = insertSection(song, "outro", outroTakes);
  assert.equal(song.loops.length, 13);
  assert.equal(song.loops[9].role, "outro");
  assert.equal(song.loops[12].role, "outro");
  assert.equal(sectionPassForLoop(song, 9), 0, "Outro pass 0 (Part 1/4)");
  assert.equal(sectionPassForLoop(song, 12), 3, "Outro pass 3 (Part 4/4)");

  // Validates completely and round-trips
  const roundTripped = validateSong(JSON.parse(JSON.stringify(song)));
  assert.deepEqual(roundTripped, song);
});

test("raw instrumentation 48-step groove loops validate and walk harmonic passes", () => {
  let song = emptySong();
  const rawTakes = Array.from({ length: 4 }, () => emptyTake());
  song = insertSection(song, "main", rawTakes);
  assert.equal(song.loops.length, 4);
  assert.equal(songPasses(song), 4);
  for (let i = 0; i < 4; i += 1) {
    assert.equal(song.loops[i].role, "main");
    assert.equal(sectionPassForLoop(song, i), i, `Groove pass ${i} (Part ${i + 1}/4)`);
    assert.equal(songPosition(song, i * LOOP_STEPS).loopIndex, i);
  }

  // Raw takes in main loops are permitted in validation
  const roundTripped = validateSong(JSON.parse(JSON.stringify(song)));
  assert.deepEqual(roundTripped, song);

  // Overdubbing a layer onto a raw groove loop works
  const overdubTake = take(4, [0, 6], "progression");
  const overdubbed = overdubLayer(song, 1, overdubTake);
  assert.equal(overdubbed.loops[1].layers.length, 2);
  assert.deepEqual(validateSong(JSON.parse(JSON.stringify(overdubbed))), overdubbed);

  // Empty takes on non-main roles (e.g. intro) are still rejected
  const badIntroSong = { loops: [{ role: "intro", repeats: 1, layers: [emptyTake()] }] };
  assert.throws(() => validateSong(badIntroSong), (err) => err instanceof SongError && err.path === "song.loops[0].layers[0]");
});

test("setSectionVoices and transposeSectionLoops update recorded section instrumentation and key", () => {
  let song = emptySong();
  const introSlot = makeSlot(0, "intro", "velvet_pad");
  const bridgeSlot = makeSlot(0, "bridge", "velvet_pad");
  const outroSlot = makeSlot(0, "outro", "velvet_pad");
  song = insertSection(song, "intro", Array.from({ length: 4 }, () => Array(LOOP_STEPS).fill(introSlot)));
  song = appendLoop(song, take(4, [0, 1], "progression"), "main");
  song = overdubLayer(song, 4, [makeSlot(7, "swell", "music_box"), ...Array(11).fill(null)]);
  song = insertSection(song, "bridge", Array.from({ length: 4 }, () => Array(LOOP_STEPS).fill(bridgeSlot)));
  song = insertSection(song, "outro", Array.from({ length: 4 }, () => Array(LOOP_STEPS).fill(outroSlot)));

  // Selecting a new voice updates all intro, bridge, and outro loops, plus the selected loop's top layer
  const revoiced = setSectionVoices(song, "harmonium", 4);
  assert.equal(revoiced.loops[0].layers[0][0].voice, "harmonium", "intro voice updated");
  assert.equal(revoiced.loops[3].layers[0][11].voice, "harmonium", "all intro passes updated");
  assert.equal(revoiced.loops[4].layers[0][0].voice, "velvet_pad", "older main layer preserved");
  assert.equal(revoiced.loops[4].layers[1][0].voice, "harmonium", "selected main loop top layer updated");
  assert.equal(revoiced.loops[5].layers[0][0].voice, "harmonium", "bridge voice updated");
  assert.equal(revoiced.loops[9].layers[0][0].voice, "harmonium", "outro voice updated");

  // Summoning a new creature transposes section loops to the new tonic root while preserving main loops
  const transposed = transposeSectionLoops(revoiced, 48, 55); // C (0) -> G (7)
  assert.equal(transposed.loops[0].layers[0][0].key, 7, "intro transposed to G");
  assert.equal(transposed.loops[4].layers[0][0].key, 4, "manual main loop key untouched");
  assert.equal(transposed.loops[5].layers[0][0].key, 7, "bridge transposed to G");
  assert.equal(transposed.loops[9].layers[0][0].key, 7, "outro transposed to G");
});





