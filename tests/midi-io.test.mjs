import assert from "node:assert/strict";
import test from "node:test";
import {
  MAX_MIDI_CLOCK_BPM,
  MIDI_CHANNELS,
  MIDI_CLOCK_MODES,
  MIDI_CLOCK_PPQ,
  MIDI_REALTIME,
  MIDI_TICKS_PER_STEP,
  MIN_MIDI_CLOCK_BPM,
  bindMidiInput,
  computeMasterClockWindow,
  createMidiClockSlave,
  getAudioOutputDevices,
  getMidiPorts,
  isFm1Port,
  isSetSinkIdSupported,
  isWebMidiSupported,
  makeAllNotesOff,
  makeClockTick,
  makeMidiContinue,
  makeMidiStart,
  makeMidiStop,
  makeNoteOff,
  makeNoteOn,
  mapFm1ControlChange,
  mapFm1NoteEvent,
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

test("isFm1Port detects M-VAVE and Cuvave device identifiers", () => {
  assert.equal(isFm1Port({ name: "M-VAVE FM-1 MIDI 1", manufacturer: "M-VAVE" }), true);
  assert.equal(isFm1Port({ name: "Cuvave Box", manufacturer: "Cuvave" }), true);
  assert.equal(isFm1Port({ name: "FM1 Bluetooth", manufacturer: "" }), true);
  assert.equal(isFm1Port({ name: "nanoKONTROL2", manufacturer: "KORG" }), false);
  assert.equal(isFm1Port(null), false);
});

test("mapFm1ControlChange maps standard and FM-1 knob CCs (D-072)", () => {
  // Standard CCs
  assert.deepEqual(mapFm1ControlChange(64, 127), { target: "sustain", active: true, value: 127 });
  assert.deepEqual(mapFm1ControlChange(64, 0), { target: "sustain", active: false, value: 0 });
  assert.deepEqual(mapFm1ControlChange(1, 127), { target: "modWheel", agitation: 1, value: 127 });
  assert.deepEqual(mapFm1ControlChange(7, 127), { target: "volume", volume: 100, value: 127 });
  assert.deepEqual(mapFm1ControlChange(11, 64), { target: "volume", volume: 50, value: 64 });
  assert.deepEqual(mapFm1ControlChange(2, 127), { target: "filterCutoff", cutoffPercent: 100, value: 127 });
  assert.deepEqual(mapFm1ControlChange(74, 0), { target: "filterCutoff", cutoffPercent: 0, value: 0 });

  // FM-1 Parameter Knobs 1..4 (CC 70..73) map to mixer faders
  assert.deepEqual(mapFm1ControlChange(70, 100), { target: "mixerFader", channel: "lead", fader: 79, value: 100 });
  assert.deepEqual(mapFm1ControlChange(71, 127), { target: "mixerFader", channel: "bass", fader: 100, value: 127 });
  assert.deepEqual(mapFm1ControlChange(72, 0), { target: "mixerFader", channel: "harmony", fader: 0, value: 0 });
  assert.deepEqual(mapFm1ControlChange(73, 64), { target: "mixerFader", channel: "beat", fader: 50, value: 64 });

  // Euler Strictness (CC 75) maps 0..127 to 3..14
  assert.deepEqual(mapFm1ControlChange(75, 0), { target: "strictness", strictness: 3, value: 0 });
  assert.deepEqual(mapFm1ControlChange(75, 127), { target: "strictness", strictness: 14, value: 127 });
  assert.deepEqual(mapFm1ControlChange(75, 64), { target: "strictness", strictness: 9, value: 64 });

  // Unmapped CC
  assert.deepEqual(mapFm1ControlChange(99, 50), { target: "unmapped", controller: 99, value: 50 });
});

test("mapFm1NoteEvent splits manual organ and hotkey octaves (D-072)", () => {
  // Manual Organ (MIDI 60..72)
  assert.deepEqual(mapFm1NoteEvent(60, true), { type: "manual", semitone: 0, isDown: true });
  assert.deepEqual(mapFm1NoteEvent(67, true), { type: "manual", semitone: 7, isDown: true });
  assert.deepEqual(mapFm1NoteEvent(72, true), { type: "manual", semitone: 12, isDown: true });
  assert.deepEqual(mapFm1NoteEvent(60, false), { type: "manual", semitone: 0, isDown: false });

  // Lower hotkey octave (MIDI 48..59)
  assert.deepEqual(mapFm1NoteEvent(48, true), { type: "command", action: "cycleStyle" });
  assert.deepEqual(mapFm1NoteEvent(50, true), { type: "command", action: "triggerSection", section: "intro" });
  assert.deepEqual(mapFm1NoteEvent(52, true), { type: "command", action: "triggerSection", section: "bridge" });
  assert.deepEqual(mapFm1NoteEvent(53, true), { type: "command", action: "triggerSection", section: "outro" });
  assert.deepEqual(mapFm1NoteEvent(55, true), { type: "command", action: "cycleVoice" });
  assert.deepEqual(mapFm1NoteEvent(57, true), { type: "command", action: "togglePlayPause" });
  assert.deepEqual(mapFm1NoteEvent(59, true), { type: "command", action: "stop" });

  // Hotkey release does not trigger manual Note Off
  assert.deepEqual(mapFm1NoteEvent(48, false), { type: "commandRelease", note: 48 });
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

test("System Realtime 24-PPQ MIDI clock and transport byte builders (P5-33)", () => {
  assert.deepEqual(MIDI_CLOCK_MODES, ["internal", "slave", "master"]);
  assert.equal(MIDI_CLOCK_PPQ, 24);
  assert.equal(MIDI_TICKS_PER_STEP, 12);
  assert.deepEqual([...makeClockTick()], [MIDI_REALTIME.CLOCK]);
  assert.deepEqual([...makeMidiStart()], [MIDI_REALTIME.START]);
  assert.deepEqual([...makeMidiContinue()], [MIDI_REALTIME.CONTINUE]);
  assert.deepEqual([...makeMidiStop()], [MIDI_REALTIME.STOP]);
});

test("createMidiClockSlave tracks 24-PPQ tempo, 12-tick step boundaries, and Start/Continue/Stop (P5-33)", () => {
  const slave = createMidiClockSlave();
  assert.deepEqual(slave.getState(), { running: false, tickCount: 0, bpm: null, stepIndex: 0 });

  // Start at t = 1000 ms
  const startRes = slave.onStart(1000);
  assert.equal(startRes.command, "restart");
  assert.equal(startRes.step, 0);
  assert.equal(slave.getState().running, true);

  // At 120 BPM, 1 quarter note = 500 ms -> 24 PPQ tick interval = 500 / 24 = 20.8333... ms
  const interval120 = 500 / 24;
  const boundaries = [];
  let lastSync = null;
  for (let i = 0; i < 144; i += 1) {
    const sync = slave.onClock(1000 + i * interval120);
    if (sync.stepBoundary) boundaries.push(sync.stepIndex);
    lastSync = sync;
  }

  // 144 ticks = 6 quarter notes = 12 eighth-note steps (0..11)
  assert.deepEqual(boundaries, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]);
  assert.equal(lastSync.bpm, 120);
  assert.equal(lastSync.tickCount, 144);

  // Next tick wraps around to step 0 of the next 12-step bar
  const wrapSync = slave.onClock(1000 + 144 * interval120);
  assert.equal(wrapSync.stepBoundary, true);
  assert.equal(wrapSync.stepIndex, 0);

  // Stop & Continue preserve step position while Start rewinds to step 0
  for (let i = 1; i < 24; i += 1) {
    slave.onClock(1000 + (144 + i) * interval120);
  }
  const stopRes = slave.onStop();
  assert.equal(stopRes.command, "stop");
  assert.equal(stopRes.step, 2);
  assert.equal(slave.getState().running, false);

  const contRes = slave.onContinue(5000);
  assert.equal(contRes.command, "play");
  assert.equal(contRes.step, 2);
  assert.equal(slave.getState().running, true);

  // Clamp out-of-range BPMs to [MIN_MIDI_CLOCK_BPM, MAX_MIDI_CLOCK_BPM]
  slave.reset();
  for (let i = 0; i < 30; i += 1) slave.onClock(i * 6); // ~416 BPM -> clamped to 208
  assert.equal(slave.getState().bpm, MAX_MIDI_CLOCK_BPM);

  slave.reset();
  for (let i = 0; i < 30; i += 1) slave.onClock(i * 120); // ~20.8 BPM -> clamped to 36
  assert.equal(slave.getState().bpm, MIN_MIDI_CLOCK_BPM);
});

test("computeMasterClockWindow schedules exact 24-PPQ 0xF8 timestamps across a step window (P5-33)", () => {
  // At 120 BPM, 1 eighth-note step = 0.25 s, and 24-PPQ tick period = 0.5 / 24 = 0.0208333... s.
  // One eighth-note step of 0.25 s contains exactly 12 ticks.
  const win1 = computeMasterClockWindow({
    nextClockTimeSec: 1.0,
    windowEndSec: 1.25,
    bpm: 120,
    audioCurrentTimeSec: 1.0,
    nowMs: 5000,
  });
  assert.equal(win1.tickTimestampsMs.length, 12);
  assert.equal(win1.tickTimestampsMs[0], 5000);
  assert.ok(Math.abs(win1.nextClockTimeSec - 1.25) < 1e-9);

  // Subsequent step window continues seamlessly without dropping or duplicating a pulse
  const win2 = computeMasterClockWindow({
    nextClockTimeSec: win1.nextClockTimeSec,
    windowEndSec: 1.5,
    bpm: 120,
    audioCurrentTimeSec: 1.0,
    nowMs: 5000,
  });
  assert.equal(win2.tickTimestampsMs.length, 12);
  assert.ok(Math.abs(win2.tickTimestampsMs[0] - 5250) < 1e-6);
  assert.ok(Math.abs(win2.nextClockTimeSec - 1.5) < 1e-9);
});

