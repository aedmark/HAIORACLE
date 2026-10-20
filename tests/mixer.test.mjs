import assert from "node:assert/strict";
import test from "node:test";

import {
  ACCOMPANIMENT_CHANNEL_IDS,
  FADER_UNITY,
  MIXER_CHANNELS,
  MIXER_CHANNEL_IDS,
  channelSettings,
  createMixerState,
  faderDb,
  faderGain,
  formatDb,
  formatPan,
  isChannelAudible,
  meterFill,
  meterReading,
  resetChannel,
  setFader,
  setMuted,
  setPan,
  toggleMute,
  toggleSolo,
} from "../src/mixer.mjs";

test("the console has eight channels, one per ensemble bus, in page order", () => {
  assert.deepEqual(MIXER_CHANNEL_IDS, ["lead", "fun", "beat", "bass", "harmony", "chime", "chant", "fungal"]);
  assert.deepEqual(
    MIXER_CHANNELS.map((channel) => channel.bus),
    ["mix", "funBus", "beatBus", "bassBus", "harmonyBus", "chimeBus", "chantBus", "fungalBus"],
  );
  assert.ok(ACCOMPANIMENT_CHANNEL_IDS.every((id) => MIXER_CHANNEL_IDS.includes(id)));
});

test("a fresh console is transparent: unity gain, centered, nothing muted or soloed", () => {
  const state = createMixerState();
  const settings = channelSettings(state);
  for (const id of MIXER_CHANNEL_IDS) {
    assert.deepEqual(state.channels[id], { fader: FADER_UNITY, pan: 0, muted: false, soloed: false });
    assert.deepEqual(settings[id], { gain: 1, pan: 0 });
  }
  assert.ok(Object.isFrozen(state) && Object.isFrozen(state.channels) && Object.isFrozen(state.channels.lead));
});

test("the fader taper maps 0 to silence, 80 to unity, and 100 to a modest boost", () => {
  assert.equal(faderGain(0), 0);
  assert.equal(faderGain(FADER_UNITY), 1);
  assert.equal(faderGain(100), 1.5625);
  assert.equal(faderGain(40), 0.25);
  assert.equal(faderGain(150), 1.5625, "values clamp to the fader range");
  assert.equal(faderGain(-5), 0);
  assert.equal(faderDb(0), -Infinity);
  assert.equal(formatDb(faderDb(FADER_UNITY)), "0.0 dB");
  assert.equal(formatDb(faderDb(100)), "+3.9 dB");
  assert.equal(formatDb(faderDb(40)), "-12.0 dB");
  assert.equal(formatDb(-Infinity), "-∞ dB");
});

test("fader and pan setters clamp, round, and leave other channels alone", () => {
  let state = setFader(createMixerState(), "bass", 112.6);
  assert.equal(state.channels.bass.fader, 100);
  state = setFader(state, "bass", "37.4");
  assert.equal(state.channels.bass.fader, 37);
  state = setPan(state, "chime", -140);
  assert.equal(state.channels.chime.pan, -100);
  assert.equal(state.channels.lead.fader, FADER_UNITY);
  assert.equal(channelSettings(state).chime.pan, -1);
  assert.equal(formatPan(0), "C");
  assert.equal(formatPan(-35), "L35");
  assert.equal(formatPan(60), "R60");
  assert.throws(() => setFader(state, "kazoo", 50), RangeError);
});

test("mute silences one channel, solo isolates soloed channels, and mute beats solo", () => {
  let state = toggleMute(createMixerState(), "beat");
  assert.equal(isChannelAudible(state, "beat"), false);
  assert.equal(isChannelAudible(state, "bass"), true);
  assert.equal(channelSettings(state).beat.gain, 0);

  state = toggleSolo(state, "chant");
  state = toggleSolo(state, "bass");
  const audible = MIXER_CHANNEL_IDS.filter((id) => isChannelAudible(state, id));
  assert.deepEqual(audible, ["bass", "chant"]);

  state = toggleMute(state, "chant");
  assert.equal(isChannelAudible(state, "chant"), false, "a muted soloed channel stays silent");
  assert.deepEqual(MIXER_CHANNEL_IDS.filter((id) => isChannelAudible(state, id)), ["bass"]);

  state = toggleSolo(toggleSolo(state, "bass"), "chant");
  assert.equal(isChannelAudible(state, "lead"), true, "clearing every solo reopens the console");
});

test("the Bandstand can engage or silence every accompaniment plate at once", () => {
  const silenced = setMuted(createMixerState(), ACCOMPANIMENT_CHANNEL_IDS, true);
  assert.deepEqual(MIXER_CHANNEL_IDS.filter((id) => isChannelAudible(silenced, id)), ["lead", "fun", "fungal"]);
  const engaged = setMuted(silenced, ACCOMPANIMENT_CHANNEL_IDS, false);
  assert.ok(MIXER_CHANNEL_IDS.every((id) => isChannelAudible(engaged, id)));
  const reset = resetChannel(setPan(setFader(toggleSolo(engaged, "fun"), "fun", 3), "fun", 50), "fun");
  assert.deepEqual(reset.channels.fun, createMixerState().channels.fun);
});

test("meter readings report RMS and peak in dBFS with a -60 dB floor", () => {
  const silence = meterReading(new Float32Array(256));
  assert.equal(silence.rms, 0);
  assert.equal(silence.peakDb, -60);
  assert.equal(meterFill(silence.rmsDb), 0);

  const square = meterReading(Float32Array.from({ length: 256 }, (_, i) => (i % 2 ? 0.5 : -0.5)));
  assert.equal(square.peak, 0.5);
  assert.equal(square.rms, 0.5);
  assert.ok(Math.abs(square.rmsDb - 20 * Math.log10(0.5)) < 1e-9);

  assert.equal(meterFill(0), 1);
  assert.equal(meterFill(-30), 0.5);
  assert.equal(meterFill(6), 1, "overs pin to the top of the column");
  assert.equal(meterReading([]).rms, 0);
});
