import assert from "node:assert/strict";
import test from "node:test";

import { CHANNEL_VOICING_DB, ENSEMBLE_BUS_GAINS, LEAD_DRY_TAP, SILENT_GAIN, buildEnsembleGraph, parlorSendLevels, voicingGain } from "../src/ensemble.mjs";
import { TRANSPORT_STATES, createTransportState, transportCommandForKey, transportReduce } from "../src/transport.mjs";

// A minimal AudioContext stand-in that records every node and connection, so
// routing can be asserted without a browser.
function fakeContext({ panner = true } = {}) {
  const nodes = [];
  const edges = [];
  const param = (value = 0) => ({
    value,
    events: [],
    setValueAtTime(v, t) { this.value = v; this.events.push(["set", v, t]); },
    exponentialRampToValueAtTime(v, t) { this.value = v; this.events.push(["exp", v, t]); },
  });
  const node = (kind, extra = {}) => {
    const created = {
      kind,
      id: `${kind}#${nodes.filter((n) => n.kind === kind).length}`,
      connect(target) { edges.push([created.id, target.id]); return target; },
      ...extra,
    };
    nodes.push(created);
    return created;
  };
  const source = (kind, extra) => node(kind, {
    started: null,
    stopped: null,
    start(t) { this.started = t; },
    stop(t) { this.stopped = t; },
    ...extra,
  });
  const context = {
    nodes,
    edges,
    destination: { id: "destination" },
    createGain: () => node("gain", { gain: param(1) }),
    createBiquadFilter: () => node("biquad", { type: "lowpass", frequency: param(350), Q: param(1) }),
    createDynamicsCompressor: () => node("compressor", { threshold: param(), knee: param(), ratio: param() }),
    createDelay: () => node("delay", { delayTime: param() }),
    createConvolver: () => node("convolver", { normalize: true, buffer: null }),
    createBufferSource: () => source("bufferSource", { buffer: null, loop: false }),
    createOscillator: () => source("oscillator", { type: "sine", frequency: param(440), detune: param() }),
    createAnalyser: () => node("analyser", { fftSize: 2048 }),
  };
  if (panner) context.createStereoPanner = () => node("panner", { pan: param() });
  return context;
}

const SCORE = Object.freeze({ voice: 1, bloom: 40, hueShift: 120, edge: 30, rhythm: 2, root: 52, waveform: "sawtooth" });
const BUFFER = Object.freeze({ fake: "buffer" });

function build(context, overrides = {}) {
  return buildEnsembleGraph(context, SCORE, {
    start: 0.5,
    unit: 0.25,
    outputGain: 1,
    parlor: { reverb: 0.2, crackle: 0.1 },
    impulseBuffer: BUFFER,
    crackleBuffer: BUFFER,
    ...overrides,
  });
}

function reaches(edges, from, to) {
  const seen = new Set([from]);
  const queue = [from];
  while (queue.length) {
    const current = queue.shift();
    if (current === to) return true;
    for (const [a, b] of edges) {
      if (a === current && !seen.has(b)) {
        seen.add(b);
        queue.push(b);
      }
    }
  }
  return false;
}

test("every ensemble bus reaches the destination with its documented routing", () => {
  const context = fakeContext();
  const graph = build(context);
  const { edges } = context;
  for (const bus of ["mix", "beatBus", "bassBus", "harmonyBus", "chimeBus", "chantBus", "fungalBus", "funBus"]) {
    assert.ok(reaches(edges, graph[bus].id, "destination"), `${bus} is connected to the output`);
  }
  for (const bus of ["mix", "harmonyBus", "chimeBus", "fungalBus"]) {
    assert.ok(reaches(edges, graph[bus].id, graph.filter.id), `${bus} passes through the creature filter`);
  }
  for (const bus of ["beatBus", "bassBus", "funBus", "chantBus"]) {
    assert.equal(reaches(edges, graph[bus].id, graph.filter.id), false, `${bus} bypasses the creature filter`);
  }
  assert.ok(reaches(edges, graph.filter.id, graph.parlorReverbSend.id));
  assert.ok(reaches(edges, graph.chantBus.id, graph.parlorReverbSend.id), "the choir still reaches the chamber reverb");
  assert.ok(reaches(edges, graph.chantBus.id, graph.delay.id), "the choir still reaches the delay");
  assert.ok(reaches(edges, graph.funBus.id, graph.parlorReverbSend.id), "the accompanist pad blooms in the chamber reverb");
  assert.ok(reaches(edges, graph.funBus.id, graph.delay.id), "the accompanist reaches the delay");
  assert.ok(reaches(edges, graph.parlorReverbSend.id, graph.compressor.id));
  assert.ok(reaches(edges, graph.parlorCrackleSource.id, graph.output.id));
  assert.equal(graph.drones.length, 3);
  for (const drone of graph.drones) assert.ok(reaches(edges, drone.id, graph.mix.id));
});

test("live and offline builds share one topology and differ only in timing", () => {
  const live = fakeContext();
  const offline = fakeContext();
  const liveGraph = build(live, { fadeIn: true });
  const offlineGraph = build(offline, { start: 0, stop: 3.2, fadeIn: false });
  assert.deepEqual(offline.edges, live.edges);
  assert.deepEqual(offline.nodes.map((n) => n.kind), live.nodes.map((n) => n.kind));
  assert.deepEqual(liveGraph.mix.gain.events, [["set", SILENT_GAIN, 0.5], ["exp", 0.28, 0.5 + 0.16]]);
  assert.deepEqual(offlineGraph.mix.gain.events, [["set", 0.28, 0]]);
  for (const drone of liveGraph.drones) assert.equal(drone.stopped, null);
  for (const drone of offlineGraph.drones) assert.equal(drone.stopped, 3.2);
  assert.equal(offlineGraph.parlorCrackleSource.stopped, 3.2);
});

test("engines without a stereo panner still route the filter to compressor and delay", () => {
  const context = fakeContext({ panner: false });
  const graph = build(context);
  assert.equal(graph.panner, null);
  assert.ok(context.edges.some(([a, b]) => a === graph.filter.id && b === graph.compressor.id));
  assert.ok(context.edges.some(([a, b]) => a === graph.filter.id && b === graph.delay.id));
});

test("each bus passes through its own stereo mixer strip before the shared graph", () => {
  const context = fakeContext();
  const graph = build(context, {
    channels: { beat: { gain: 0, pan: -0.5 }, chime: { gain: 1.2, pan: 0.25 } },
  });
  const { edges } = context;
  for (const id of ["lead", "fun", "beat", "bass", "harmony", "chime", "chant", "fungal"]) {
    const strip = graph.strips[id];
    assert.equal(strip.fader.channelCount, 2, `${id} upmixes to stereo before panning`);
    assert.equal(strip.fader.channelCountMode, "explicit");
    assert.ok(edges.some(([a, b]) => a === strip.fader.id && b === strip.pan.id), `${id} fader feeds its pan`);
    assert.equal(strip.analyser, null, "meters are off unless requested");
  }
  assert.ok(edges.some(([a, b]) => a === graph.mix.id && b === graph.strips.lead.trim.id));
  for (const id of Object.keys(graph.strips)) {
    const strip = graph.strips[id];
    assert.ok(edges.some(([a, b]) => a === strip.trim.id && b === strip.fader.id), `${id} trim feeds its fader`);
    assert.equal(strip.trim.gain.value, voicingGain(id));
  }
  assert.ok(edges.some(([a, b]) => a === graph.strips.chime.pan.id && b === graph.filter.id));
  assert.ok(edges.some(([a, b]) => a === graph.strips.beat.pan.id && b === graph.compressor.id));
  assert.equal(edges.some(([a, b]) => a === graph.beatBus.id && b === graph.compressor.id), false, "no bus bypasses its strip");
  assert.equal(graph.strips.beat.fader.gain.value, 0);
  assert.equal(graph.strips.beat.pan.pan.value, -0.5);
  assert.equal(graph.strips.chime.fader.gain.value, 1.2);
  assert.equal(graph.strips.bass.fader.gain.value, 1, "an unlisted channel sits at unity");
  assert.equal(graph.beatBus.gain.value, ENSEMBLE_BUS_GAINS.beat, "bus voicing never carries mute");
});

test("live meters only add analyser taps and never change what is heard", () => {
  const metered = fakeContext();
  const plain = fakeContext();
  const graph = build(metered, { meters: true });
  build(plain, { meters: false });
  const analyserIds = new Set(metered.nodes.filter((n) => n.kind === "analyser").map((n) => n.id));
  assert.equal(analyserIds.size, 8);
  for (const strip of Object.values(graph.strips)) {
    assert.ok(metered.edges.some(([a, b]) => a === strip.pan.id && b === strip.analyser.id), "meter taps post-pan");
    assert.equal(metered.edges.some(([a]) => a === strip.analyser.id), false, "analysers are sinks");
  }
  assert.deepEqual(metered.edges.filter(([, b]) => !analyserIds.has(b)), plain.edges);
});

test("the vitrine panner path is trimmed to keep the pre-mixer balance", () => {
  const context = fakeContext();
  const graph = build(context);
  const trim = context.edges.find(([a]) => a === graph.panner.id);
  const trimNode = context.nodes.find((n) => n.id === trim[1]);
  assert.equal(trimNode.gain.value, Math.SQRT1_2);
  assert.ok(context.edges.some(([a, b]) => a === trimNode.id && b === graph.compressor.id));
  assert.ok(context.edges.some(([a, b]) => a === trimNode.id && b === graph.delay.id));
});

test("parlor layers start silent when switched off", () => {
  const context = fakeContext();
  const graph = build(context, {
    parlor: parlorSendLevels({ enabled: true, reverbEnabled: false, crackleEnabled: true, level: 0.5 }),
  });
  assert.equal(graph.parlorReverbSend.gain.value, SILENT_GAIN);
  assert.equal(graph.parlorCrackleGain.gain.value, 0.42 * 0.5);
  assert.deepEqual(
    parlorSendLevels({ enabled: false, reverbEnabled: true, crackleEnabled: true, level: 1 }),
    { reverb: SILENT_GAIN, crackle: SILENT_GAIN },
  );
});

test("a missing parlor buffer silences that layer without breaking the graph", () => {
  const context = fakeContext();
  const graph = build(context, { impulseBuffer: null, crackleBuffer: null });
  assert.equal(graph.parlorCrackleSource, null);
  assert.equal(graph.parlorCrackleGain, null);
  assert.ok(reaches(context.edges, graph.mix.id, "destination"));
});

test("the transport moves between stopped, playing, and paused and keeps its cursor", () => {
  let state = createTransportState();
  assert.deepEqual(state, { state: TRANSPORT_STATES.STOPPED, cursor: 0 });

  state = transportReduce(state, "play");
  assert.deepEqual(state, { state: TRANSPORT_STATES.PLAYING, cursor: 0 });
  assert.equal(transportReduce(state, "play"), state, "play while playing is a no-op");

  state = transportReduce(state, "pause", { cursor: 17 });
  assert.deepEqual(state, { state: TRANSPORT_STATES.PAUSED, cursor: 17 }, "raw step counter is preserved past 12");
  assert.equal(transportReduce(state, "pause", { cursor: 3 }), state, "pause while paused is a no-op");

  state = transportReduce(state, "toggle", { cursor: 99 });
  assert.deepEqual(state, { state: TRANSPORT_STATES.PLAYING, cursor: 17 }, "resume ignores a stale cursor");

  state = transportReduce(state, "toggle", { cursor: 21 });
  assert.deepEqual(state, { state: TRANSPORT_STATES.PAUSED, cursor: 21 });

  state = transportReduce(state, "stop");
  assert.deepEqual(state, { state: TRANSPORT_STATES.STOPPED, cursor: 0 });
  assert.equal(transportReduce(state, "pause", { cursor: 5 }), state, "a stopped transport cannot pause");

  assert.deepEqual(transportReduce({ state: TRANSPORT_STATES.PAUSED, cursor: 8 }, "restart"), { state: TRANSPORT_STATES.PLAYING, cursor: 0 });
  assert.deepEqual(transportReduce({ state: TRANSPORT_STATES.PLAYING, cursor: 0 }, "pause", { cursor: -4 }).cursor, 0);
  assert.ok(Object.isFrozen(transportReduce(createTransportState(), "play")));
  assert.throws(() => transportReduce(createTransportState(), "fast-forward"), RangeError);
});

function keyTarget(tagName, { type = "", role = null, isContentEditable = false } = {}) {
  return {
    tagName,
    type,
    isContentEditable,
    getAttribute: (name) => (name === "role" ? role : null),
  };
}

const space = (target, extra = {}) => ({ code: "Space", key: " ", target, ...extra });
const clicked = (target) => ({ pointerFocused: target });

test("Space toggles the transport except while typing or on a keyboard-focused control", () => {
  assert.equal(transportCommandForKey(space(keyTarget("BODY"))), "toggle");
  assert.equal(transportCommandForKey(space(keyTarget("INPUT", { type: "range" }))), "toggle");
  assert.equal(transportCommandForKey(space(keyTarget("A"))), "toggle");

  assert.equal(transportCommandForKey(space(keyTarget("INPUT", { type: "text" }))), null);
  assert.equal(transportCommandForKey(space(keyTarget("INPUT"))), null, "an untyped input is a text field");
  assert.equal(transportCommandForKey(space(keyTarget("TEXTAREA"))), null);
  assert.equal(transportCommandForKey(space(keyTarget("SELECT"))), null);
  assert.equal(transportCommandForKey(space(keyTarget("DIV", { isContentEditable: true }))), null);

  const button = keyTarget("BUTTON");
  assert.equal(transportCommandForKey(space(button)), null, "keyboard users keep Space for buttons");
  assert.equal(transportCommandForKey(space(button), clicked(button)), "toggle", "a clicked button does not swallow Space");
  assert.equal(transportCommandForKey(space(button), clicked(keyTarget("BUTTON"))), null, "a different clicked control does not count");
  const checkbox = keyTarget("INPUT", { type: "checkbox" });
  assert.equal(transportCommandForKey(space(checkbox)), null);
  assert.equal(transportCommandForKey(space(checkbox), clicked(checkbox)), "toggle");
  assert.equal(transportCommandForKey(space(keyTarget("DIV", { role: "switch" }))), null);
  assert.equal(transportCommandForKey(space(keyTarget("SUMMARY"))), null);

  for (const modifier of ["ctrlKey", "metaKey", "altKey", "shiftKey"]) {
    assert.equal(transportCommandForKey(space(keyTarget("BODY"), { [modifier]: true })), null, `${modifier}+Space is left alone`);
  }
});

test("Escape stops from anywhere and other keys are ignored", () => {
  assert.equal(transportCommandForKey({ key: "Escape", code: "Escape", target: keyTarget("BODY") }), "stop");
  assert.equal(transportCommandForKey({ key: "Escape", code: "Escape", target: keyTarget("INPUT", { type: "text" }) }), "stop");
  assert.equal(transportCommandForKey({ key: "Escape", code: "Escape", ctrlKey: true, target: keyTarget("BODY") }), null);
  assert.equal(transportCommandForKey({ key: "a", code: "KeyA", target: keyTarget("BODY") }), null);
  assert.equal(transportCommandForKey(null), null);
});

test("default voicing lifts the lead and choir while every other channel stays at unity", () => {
  assert.equal(CHANNEL_VOICING_DB.lead, 6);
  assert.equal(CHANNEL_VOICING_DB.chant, 12);
  for (const id of ["fun", "beat", "bass", "harmony", "chime", "fungal"]) assert.equal(voicingGain(id), 1);
  assert.ok(Math.abs(voicingGain("lead") - 1.9953) < 1e-4);
  assert.ok(Math.abs(voicingGain("chant") - 3.9811) < 1e-4);
});

test("bandpass creatures blend a dry lead tap under the filter; lowpass creatures get none", () => {
  const bandpass = fakeContext();
  const bandGraph = build(bandpass);
  assert.equal(bandGraph.filter.type, "bandpass");
  assert.equal(bandGraph.leadDry.gain.value, LEAD_DRY_TAP.bandpass);
  assert.ok(bandpass.edges.some(([a, b]) => a === bandGraph.strips.lead.out.id && b === bandGraph.leadDry.id));
  assert.ok(bandpass.edges.some(([a, b]) => a === bandGraph.leadDry.id && b === bandGraph.compressor.id));
  assert.ok(bandpass.edges.some(([a, b]) => a === bandGraph.leadDry.id && b === bandGraph.delay.id));

  const lowpass = fakeContext();
  const lowGraph = buildEnsembleGraph(lowpass, { ...SCORE, voice: 4 }, { start: 0, unit: 0.25, outputGain: 1 });
  assert.equal(lowGraph.filter.type, "lowpass");
  assert.equal(lowGraph.leadDry.gain.value, 0);
});
