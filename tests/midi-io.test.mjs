import assert from "node:assert/strict";
import test from "node:test";
import {
  MIDI_CHANNELS,
  bindMidiInput,
  getAudioOutputDevices,
  getMidiPorts,
  isSetSinkIdSupported,
  isWebMidiSupported,
  makeAllNotesOff,
  makeNoteOff,
  makeNoteOn,
  midiNoteToSemitone,
  parseMidiMessage,
  requestMidiAccess,
  semitoneToMidiNote,
  sendMidiMessage,
  setAudioOutputSink,
} from "../src/midi-io.mjs";

test("midiNoteToSemitone folds octaves into 0..12 while preserving Middle C and C5", () => {
  // Middle C octave (60..72)
  assert.equal(midiNoteToSemitone(60), 0); // C4
  assert.equal(midiNoteToSemitone(61), 1); // C#4
  assert.equal(midiNoteToSemitone(64), 4); // E4
  assert.equal(midiNoteToSemitone(67), 7); // G4
  assert.equal(midiNoteToSemitone(71), 11); // B4
  assert.equal(midiNoteToSemitone(72), 12); // C5 (C')

  // Lower octaves fold to 0..11
  assert.equal(midiNoteToSemitone(48), 0); // C3
  assert.equal(midiNoteToSemitone(59), 11); // B3
  assert.equal(midiNoteToSemitone(36), 0); // C2

  // Higher octaves fold to 0..11, preserving high C as 12
  assert.equal(midiNoteToSemitone(84), 12); // C6
  assert.equal(midiNoteToSemitone(73), 1); // C#5
  assert.equal(midiNoteToSemitone(96), 12); // C7

  // Non-finite edge cases
  assert.equal(midiNoteToSemitone(NaN), 0);
  assert.equal(midiNoteToSemitone(null), 0);
});

test("semitoneToMidiNote converts semitones to MIDI note numbers", () => {
  assert.equal(semitoneToMidiNote(0, 4), 60); // C4
  assert.equal(semitoneToMidiNote(1, 4), 61); // C#4
  assert.equal(semitoneToMidiNote(12, 4), 72); // C5
  assert.equal(semitoneToMidiNote(0, 3), 48); // C3
});

test("parseMidiMessage decodes Note On and treats velocity 0 as Note Off", () => {
  const on = parseMidiMessage([0x90, 60, 100]); // Ch 1 Note On C4
  assert.equal(on.type, "noteon");
  assert.equal(on.channel, 1);
  assert.equal(on.note, 60);
  assert.equal(on.velocity, 100);
  assert.equal(on.semitone, 0);

  const offViaZeroVelocity = parseMidiMessage([0x90, 60, 0]);
  assert.equal(offViaZeroVelocity.type, "noteoff");
  assert.equal(offViaZeroVelocity.channel, 1);
  assert.equal(offViaZeroVelocity.note, 60);
  assert.equal(offViaZeroVelocity.velocity, 0);
  assert.equal(offViaZeroVelocity.semitone, 0);

  const explicitOff = parseMidiMessage([0x81, 72, 64]); // Ch 2 Note Off C5
  assert.equal(explicitOff.type, "noteoff");
  assert.equal(explicitOff.channel, 2);
  assert.equal(explicitOff.note, 72);
  assert.equal(explicitOff.semitone, 12);
});

test("parseMidiMessage decodes Control Change controllers (Sustain, Mod Wheel, Volume)", () => {
  const sustain = parseMidiMessage([0xb0, 64, 127]); // Sustain down
  assert.equal(sustain.type, "cc");
  assert.equal(sustain.controller, 64);
  assert.equal(sustain.value, 127);
  assert.equal(sustain.isSustain, true);

  const modWheel = parseMidiMessage([0xb0, 1, 90]);
  assert.equal(modWheel.type, "cc");
  assert.equal(modWheel.controller, 1);
  assert.equal(modWheel.value, 90);
  assert.equal(modWheel.isModWheel, true);

  const volume = parseMidiMessage([0xb0, 7, 105]);
  assert.equal(volume.type, "cc");
  assert.equal(volume.controller, 7);
  assert.equal(volume.isVolume, true);

  const expression = parseMidiMessage([0xb0, 11, 45]);
  assert.equal(expression.type, "cc");
  assert.equal(expression.controller, 11);
  assert.equal(expression.isExpression, true);
});

test("parseMidiMessage decodes System Realtime Clock and Transport messages", () => {
  assert.deepEqual(parseMidiMessage([0xf8]), { type: "clock" });
  assert.deepEqual(parseMidiMessage([0xfa]), { type: "start" });
  assert.deepEqual(parseMidiMessage([0xfb]), { type: "continue" });
  assert.deepEqual(parseMidiMessage([0xfc]), { type: "stop" });
  assert.equal(parseMidiMessage([]), null);
  assert.equal(parseMidiMessage(null), null);
});

test("makeNoteOn, makeNoteOff, and makeAllNotesOff construct valid byte sequences", () => {
  const on = makeNoteOn(1, 60, 110);
  assert.deepEqual([...on], [0x90, 60, 110]);

  const ch10Drums = makeNoteOn(10, 36, 120); // Kick on Ch 10 (status 0x99)
  assert.deepEqual([...ch10Drums], [0x99, 36, 120]);

  const off = makeNoteOff(2, 64);
  assert.deepEqual([...off], [0x81, 64, 0]);

  const allOff = makeAllNotesOff(1);
  assert.deepEqual([...allOff], [0xb0, 123, 0]);
});

test("Web MIDI port enumeration and message binding with mock MIDIAccess", () => {
  const sentMessages = [];
  const mockInput = {
    id: "in-1",
    name: "Mock In",
    state: "connected",
    onmidimessage: null,
  };
  const mockOutput = {
    id: "out-1",
    name: "Mock Out",
    state: "connected",
    send: (bytes, timestamp) => {
      sentMessages.push({ bytes: [...bytes], timestamp });
    },
  };

  const mockAccess = {
    inputs: new Map([["in-1", mockInput]]),
    outputs: new Map([["out-1", mockOutput]]),
  };

  const { inputs, outputs } = getMidiPorts(mockAccess);
  assert.equal(inputs.length, 1);
  assert.equal(inputs[0].name, "Mock In");
  assert.equal(outputs.length, 1);
  assert.equal(outputs[0].name, "Mock Out");

  const received = [];
  const unbind = bindMidiInput(mockAccess, "in-1", (msg) => received.push(msg));
  assert.ok(mockInput.onmidimessage);

  // Trigger simulated incoming Note On
  mockInput.onmidimessage({ data: [0x90, 60, 100] });
  assert.equal(received.length, 1);
  assert.equal(received[0].type, "noteon");
  assert.equal(received[0].semitone, 0);

  // Test sendMidiMessage
  sendMidiMessage(mockAccess, "out-1", makeNoteOn(1, 60, 100), 12345.67);
  assert.equal(sentMessages.length, 1);
  assert.deepEqual(sentMessages[0].bytes, [0x90, 60, 100]);
  assert.equal(sentMessages[0].timestamp, 12345.67);

  // Unbind cleans up handler
  unbind();
  assert.equal(mockInput.onmidimessage, null);
});

test("Audio sink detection and routing fallbacks", async () => {
  const mockContextWithSink = {
    setSinkId: async (id) => {
      mockContextWithSink.currentSink = id;
    },
  };
  assert.equal(isSetSinkIdSupported(mockContextWithSink), true);
  assert.equal(isSetSinkIdSupported({}), false);

  const routed = await setAudioOutputSink(mockContextWithSink, "virtual-pipewire-bus");
  assert.equal(routed, true);
  assert.equal(mockContextWithSink.currentSink, "virtual-pipewire-bus");

  const failed = await setAudioOutputSink({}, "bus");
  assert.equal(failed, false);
});
