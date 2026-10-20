import assert from "node:assert/strict";
import test from "node:test";

import {
  LOOP_STEPS,
  MAX_LAYERS,
  MAX_LOOPS,
  MAX_REPEATS,
  MAX_SONG_PASSES,
  SongError,
  appendLoop,
  canAppendLoop,
  canOverdub,
  deleteLoop,
  emptySong,
  emptyTake,
  idleRecorder,
  isEmptyTake,
  leadSlotAt,
  makeSlot,
  moveLoop,
  overdubLayer,
  recorderReduce,
  setRepeats,
  slotsAt,
  songPasses,
  songPosition,
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
  rejects(bad({ key: 13, style: "swell" }), "song.loops[0].layers[0][0].key");
  rejects(bad({ key: 2, style: "organ" }), "song.loops[0].layers[0][0].style");
  rejects(bad({ key: 2, style: "swell", velocity: 9 }), "song.loops[0].layers[0][0].velocity");
  const long = { loops: Array.from({ length: 5 }, () => ({ repeats: 8, layers: plain.loops[0].layers })) };
  rejects(long, "song.loops");
  assert.throws(() => makeSlot(13, "swell"), RangeError);
});
