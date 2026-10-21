import assert from "node:assert/strict";
import test from "node:test";

import {
  DRUM_CHANNEL,
  GM_DRUMS,
  MIDI_PPQ,
  FUN_VOICE_CHANNELS,
  MIDI_TRACKS,
  funVoiceTracks,
  buildMidiFile,
  encodeVlq,
  loopSafeNotes,
  ticksForSeconds,
  velocitiesFor,
} from "../src/midi.mjs";
import { crc32, createStoredZip } from "../src/zip.mjs";

const decoder = new TextDecoder();

// A small reader for stored archives, independent of the writer's internals.
function readStoredZip(bytes) {
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  const eocd = bytes.length - 22;
  assert.equal(view.getUint32(eocd, true), 0x06054b50, "end of central directory");
  const count = view.getUint16(eocd + 10, true);
  let offset = view.getUint32(eocd + 16, true);
  const entries = [];
  for (let i = 0; i < count; i += 1) {
    assert.equal(view.getUint32(offset, true), 0x02014b50, "central header");
    const crc = view.getUint32(offset + 16, true);
    const size = view.getUint32(offset + 20, true);
    const nameLength = view.getUint16(offset + 28, true);
    const localOffset = view.getUint32(offset + 42, true);
    const name = decoder.decode(bytes.subarray(offset + 46, offset + 46 + nameLength));
    assert.equal(view.getUint32(localOffset, true), 0x04034b50, "local header");
    assert.equal(view.getUint16(localOffset + 8, true), 0, "stored");
    const localNameLength = view.getUint16(localOffset + 26, true);
    const dataStart = localOffset + 30 + localNameLength;
    entries.push({ name, crc, data: bytes.subarray(dataStart, dataStart + size) });
    offset += 46 + nameLength;
  }
  return entries;
}

test("CRC-32 matches the standard check value", () => {
  assert.equal(crc32(new TextEncoder().encode("123456789")), 0xcbf43926);
  assert.equal(crc32(new Uint8Array()), 0);
});

test("stored ZIP archives round-trip names, bytes, and checksums deterministically", () => {
  const wav = Uint8Array.from({ length: 1000 }, (_, i) => (i * 37) & 0xff);
  const entries = [
    { name: "01-lead.wav", data: wav },
    { name: "README.txt", data: "Tempo: 108 BPM\n" },
    { name: "empty.bin", data: new Uint8Array() },
  ];
  const zip = createStoredZip(entries);
  const read = readStoredZip(zip);
  assert.deepEqual(read.map((e) => e.name), ["01-lead.wav", "README.txt", "empty.bin"]);
  assert.deepEqual([...read[0].data], [...wav]);
  assert.equal(decoder.decode(read[1].data), "Tempo: 108 BPM\n");
  for (const entry of read) assert.equal(entry.crc, crc32(entry.data));
  assert.deepEqual([...createStoredZip(entries)], [...zip], "same input, same bytes");
});

test("ZIP entry names cannot escape the archive", () => {
  for (const name of ["../evil.wav", "/abs.wav", "a/../../b", "win\\path.wav", ""]) {
    assert.throws(() => createStoredZip([{ name, data: "x" }]), RangeError, name);
  }
  assert.throws(() => createStoredZip([{ name: "ok.txt", data: 42 }]), TypeError);
});

test("MIDI variable-length quantities match the SMF specification examples", () => {
  const cases = [
    [0, [0x00]], [0x40, [0x40]], [0x7f, [0x7f]], [0x80, [0x81, 0x00]],
    [0x2000, [0xc0, 0x00]], [0x3fff, [0xff, 0x7f]], [0x4000, [0x81, 0x80, 0x00]],
    [0x100000, [0xc0, 0x80, 0x00]], [0x0fffffff, [0xff, 0xff, 0xff, 0x7f]],
  ];
  for (const [value, bytes] of cases) assert.deepEqual(encodeVlq(value), bytes, `0x${value.toString(16)}`);
  assert.throws(() => encodeVlq(0x10000000), RangeError);
  assert.equal(ticksForSeconds(0.5, 120), MIDI_PPQ, "half a second at 120 BPM is one quarter note");
});

function readVlq(bytes, offset) {
  let value = 0;
  let index = offset;
  for (;;) {
    const byte = bytes[index];
    index += 1;
    value = (value << 7) | (byte & 0x7f);
    if (!(byte & 0x80)) return [value, index];
  }
}

// Parses an SMF into header fields and per-track absolute-tick events.
function parseMidi(bytes) {
  const text = (o) => String.fromCharCode(...bytes.subarray(o, o + 4));
  const u32 = (o) => (bytes[o] << 24 | bytes[o + 1] << 16 | bytes[o + 2] << 8 | bytes[o + 3]) >>> 0;
  assert.equal(text(0), "MThd");
  assert.equal(u32(4), 6);
  const format = (bytes[8] << 8) | bytes[9];
  const trackCount = (bytes[10] << 8) | bytes[11];
  const ppq = (bytes[12] << 8) | bytes[13];
  let offset = 14;
  const tracks = [];
  for (let t = 0; t < trackCount; t += 1) {
    assert.equal(text(offset), "MTrk");
    const end = offset + 8 + u32(offset + 4);
    let index = offset + 8;
    let tick = 0;
    const events = [];
    while (index < end) {
      let delta;
      [delta, index] = readVlq(bytes, index);
      tick += delta;
      const status = bytes[index];
      if (status === 0xff) {
        const type = bytes[index + 1];
        let length;
        let dataStart;
        [length, dataStart] = readVlq(bytes, index + 2);
        events.push({ tick, meta: type, data: [...bytes.subarray(dataStart, dataStart + length)] });
        index = dataStart + length;
      } else if ((status & 0xf0) === 0xc0) {
        events.push({ tick, type: "program", channel: status & 0x0f, program: bytes[index + 1] });
        index += 2;
      } else {
        events.push({ tick, type: (status & 0xf0) === 0x90 ? "on" : "off", channel: status & 0x0f, note: bytes[index + 1], velocity: bytes[index + 2] });
        index += 3;
      }
    }
    assert.equal(index, end, "track length matches its chunk header");
    tracks.push(events);
    offset = end;
  }
  return { format, trackCount, ppq, tracks };
}

test("the MIDI file is Type 1 with a tempo track and one named, programmed track per part", () => {
  const bytes = buildMidiFile({
    bpm: 108,
    title: "THE MARMALADE",
    lengthTicks: 1920,
    tracks: [
      { name: "LEAD", channel: 0, program: 80, notes: [{ tick: 0, duration: 240, midi: 60, velocity: 100 }, { tick: 480, duration: 240, midi: 64, velocity: 90 }] },
      { name: "PULSE", channel: DRUM_CHANNEL, program: null, notes: [{ tick: 0, duration: 60, midi: GM_DRUMS.kick, velocity: 127 }] },
    ],
  });
  const midi = parseMidi(bytes);
  assert.equal(midi.format, 1);
  assert.equal(midi.trackCount, 3);
  assert.equal(midi.ppq, MIDI_PPQ);
  const tempo = midi.tracks[0].find((e) => e.meta === 0x51).data;
  assert.equal((tempo[0] << 16) | (tempo[1] << 8) | tempo[2], Math.round(60_000_000 / 108));
  assert.equal(decoder.decode(Uint8Array.from(midi.tracks[0].find((e) => e.meta === 0x03).data)), "THE MARMALADE");
  for (const track of midi.tracks) {
    const last = track.at(-1);
    assert.deepEqual([last.meta, last.tick], [0x2f, 1920], "every track ends at the loop length");
  }
  const lead = midi.tracks[1];
  assert.deepEqual(lead.find((e) => e.type === "program"), { tick: 0, type: "program", channel: 0, program: 80 });
  assert.deepEqual(lead.filter((e) => e.type === "on").map((e) => [e.tick, e.note, e.velocity]), [[0, 60, 100], [480, 64, 90]]);
  assert.deepEqual(lead.filter((e) => e.type === "off").map((e) => [e.tick, e.note]), [[240, 60], [720, 64]]);
  const drums = midi.tracks[2];
  assert.equal(drums.some((e) => e.type === "program"), false, "the drum channel takes no program change");
  assert.deepEqual(drums.filter((e) => e.type === "on").map((e) => [e.channel, e.note]), [[DRUM_CHANNEL, 36]]);
});

test("arrangement markers land on the conductor track at their ticks, inside the loop only", () => {
  const midi = parseMidi(buildMidiFile({
    bpm: 120,
    lengthTicks: 1920,
    tracks: [],
    markers: [
      { tick: 480, text: "II · ANTIPHONAL CONVERSATION" },
      { tick: 0, text: "I · EXPOSITION GROOVE" },
      { tick: 1920, text: "PAST THE END" },
    ],
  }));
  const markers = midi.tracks[0].filter((e) => e.meta === 0x06).map((e) => [e.tick, decoder.decode(Uint8Array.from(e.data))]);
  assert.deepEqual(markers, [[0, "I · EXPOSITION GROOVE"], [480, "II · ANTIPHONAL CONVERSATION"]]);
});

test("loop-safe notes clip at the loop end, trim overlapping repeats, and merge unisons", () => {
  const notes = loopSafeNotes([
    { tick: 0, duration: 600, midi: 60, velocity: 80 },
    { tick: 480, duration: 240, midi: 60, velocity: 90 },
    { tick: 480, duration: 960, midi: 67, velocity: 70 },
    { tick: 480, duration: 300, midi: 67, velocity: 100 },
    { tick: 1900, duration: 200, midi: 72, velocity: 60 },
    { tick: 2000, duration: 10, midi: 74, velocity: 60 },
  ], 1920);
  assert.deepEqual(notes.map((n) => [n.tick, n.duration, n.midi, n.velocity]), [
    [0, 480, 60, 80],
    [480, 240, 60, 90],
    [480, 960, 67, 100],
    [1900, 20, 72, 60],
  ]);
  const midi = parseMidi(buildMidiFile({ bpm: 120, lengthTicks: 1920, tracks: [{ name: "T", channel: 0, program: 0, notes: [
    { tick: 0, duration: 600, midi: 60, velocity: 80 },
    { tick: 480, duration: 240, midi: 60, velocity: 90 },
  ] }] }));
  const at480 = midi.tracks[1].filter((e) => e.tick === 480 && e.note === 60).map((e) => e.type);
  assert.deepEqual(at480, ["off", "on"], "a repeated pitch is released before it re-strikes");
});

test("velocities scale each part from its loudest event and tracks cover every pitched part", () => {
  assert.deepEqual(velocitiesFor([0.3, 0.15, 0]), [127, 84, 40]);
  assert.deepEqual(velocitiesFor([0, 0]), [64, 64]);
  assert.deepEqual(MIDI_TRACKS.map((t) => t.id), ["lead", "fun", "beat", "bass", "harmony", "chime", "chant"]);
  assert.equal(new Set(MIDI_TRACKS.map((t) => t.channel)).size, MIDI_TRACKS.length, "one MIDI channel per part");
  assert.equal(MIDI_TRACKS.find((t) => t.id === "beat").channel, DRUM_CHANNEL);
});

test("the MANUAL part splits into one track and channel per voice it was played in (D-040)", () => {
  const base = MIDI_TRACKS.find((track) => track.id === "fun");
  const music = { key: "music_box", label: "MUSIC BOX", program: 10 };
  const organ = { key: "harmonium", label: "HARMONIUM", program: 20 };
  const events = [{ voice: music, midi: 60 }, { voice: organ, midi: 64 }, { voice: music, midi: 67 }];
  const tracks = funVoiceTracks(base, events);
  assert.deepEqual(tracks.map((t) => [t.name, t.channel, t.program, t.events.length]), [
    ["MANUAL · FUN MACHINE · MUSIC BOX", 1, 10, 2],
    ["MANUAL · FUN MACHINE · HARMONIUM", 6, 20, 1],
  ]);
  assert.deepEqual(funVoiceTracks(base, []).map((t) => [t.name, t.channel, t.program]), [[base.name, 1, base.program]], "no notes, one stock track");
  const used = new Set(MIDI_TRACKS.filter((t) => t.id !== "fun").map((t) => t.channel));
  assert.ok(FUN_VOICE_CHANNELS.every((channel) => !used.has(channel)), "voice channels never collide with another part");
  assert.equal(new Set(FUN_VOICE_CHANNELS).size, 8, "one channel for each of the eight voices");
  const file = buildMidiFile({ bpm: 120, lengthTicks: 1920, tracks: tracks.map(({ events: e, ...t }) => ({ ...t, notes: e.map((n, i) => ({ tick: i * 100, duration: 50, midi: n.midi, velocity: 90 })) })) });
  const bytes = [...file];
  const hasProgram = (channel, program) => bytes.some((b, i) => b === (0xc0 | channel) && bytes[i + 1] === program);
  assert.ok(hasProgram(1, 10) && hasProgram(6, 20), "each voice track announces its own program");
});
