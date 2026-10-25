// Web MIDI input/output and Web Audio sink routing adapter.
// Zero dependencies: interfaces with standard W3C Web MIDI API and
// AudioContext.setSinkId for hardware synthesizers, virtual MIDI buses
// (ALSA/PipeWire, IAC, loopMIDI), and multi-channel DAW routing (D-061).

export const MIDI_CHANNELS = Object.freeze({
  MANUAL: 1,
  LEAD: 2,
  BASS: 3,
  HARMONY: 4,
  CHIME: 5,
  CHANT: 6,
  FUNGAL: 7,
  BEAT: 10,
});

export const MIDI_CLOCK_MODES = Object.freeze(["internal", "slave", "master"]);
export const MIDI_REALTIME = Object.freeze({
  CLOCK: 0xf8,
  START: 0xfa,
  CONTINUE: 0xfb,
  STOP: 0xfc,
});
export const MIDI_CLOCK_PPQ = 24;
export const MIDI_TICKS_PER_STEP = 12;
export const MIN_MIDI_CLOCK_BPM = 36;
export const MAX_MIDI_CLOCK_BPM = 208;

/**
 * Maps a standard MIDI note number (0..127) to a Fun Machine manual semitone (0..12, C..C').
 * Middle C (MIDI 60) maps to 0. C5 (MIDI 72) maps to 12.
 * Higher/lower octaves fold into 0..11, preserving note 72 as high C (12).
 */
export function midiNoteToSemitone(note) {
  if (!Number.isFinite(note)) return 0;
  const n = Math.round(note);
  if (n >= 72 && n % 12 === 0) return 12;
  return ((n % 12) + 12) % 12;
}

/**
 * Converts a Fun Machine manual semitone (0..12) to a standard MIDI note number.
 * Octave 4 base: 0 -> 60 (Middle C), 12 -> 72 (C5).
 */
export function semitoneToMidiNote(semitone, baseOctave = 4) {
  const base = baseOctave * 12 + 12;
  return Math.max(0, Math.min(127, base + Math.round(semitone || 0)));
}

/**
 * Parses raw MIDI byte data (from Uint8Array or Array) into a structured event.
 * Handles Note On/Off, Control Change (Sustain, Mod Wheel, Volume), and Realtime Clock.
 */
export function parseMidiMessage(data) {
  if (!data || !data.length) return null;
  const status = data[0];

  // System Realtime Messages (single byte, status >= 0xF8)
  if (status === 0xf8) return { type: "clock" };
  if (status === 0xfa) return { type: "start" };
  if (status === 0xfb) return { type: "continue" };
  if (status === 0xfc) return { type: "stop" };

  const messageType = status & 0xf0;
  const channel = (status & 0x0f) + 1; // 1-16
  const byte1 = data[1] ?? 0;
  const byte2 = data[2] ?? 0;

  if (messageType === 0x90) {
    // Note On with velocity 0 is treated as Note Off in standard MIDI
    if (byte2 === 0) {
      return { type: "noteoff", channel, note: byte1, velocity: 0, semitone: midiNoteToSemitone(byte1) };
    }
    return { type: "noteon", channel, note: byte1, velocity: byte2, semitone: midiNoteToSemitone(byte1) };
  }

  if (messageType === 0x80) {
    return { type: "noteoff", channel, note: byte1, velocity: byte2, semitone: midiNoteToSemitone(byte1) };
  }

  if (messageType === 0xb0) {
    return {
      type: "cc",
      channel,
      controller: byte1,
      value: byte2,
      isSustain: byte1 === 64,
      isModWheel: byte1 === 1,
      isVolume: byte1 === 7,
      isExpression: byte1 === 11,
    };
  }

  return { type: "unknown", status, channel, data };
}

/**
 * Creates a 3-byte Note On message. Channel is 1..16.
 */
export function makeNoteOn(channel, note, velocity = 100) {
  const ch = Math.max(0, Math.min(15, (channel || 1) - 1));
  return new Uint8Array([0x90 | ch, Math.max(0, Math.min(127, Math.round(note))), Math.max(0, Math.min(127, Math.round(velocity)))]);
}

/**
 * Creates a 3-byte Note Off message. Channel is 1..16.
 */
export function makeNoteOff(channel, note) {
  const ch = Math.max(0, Math.min(15, (channel || 1) - 1));
  return new Uint8Array([0x80 | ch, Math.max(0, Math.min(127, Math.round(note))), 0]);
}

/**
 * Creates an All Notes Off Control Change message (CC 123). Channel is 1..16.
 */
export function makeAllNotesOff(channel) {
  const ch = Math.max(0, Math.min(15, (channel || 1) - 1));
  return new Uint8Array([0xb0 | ch, 123, 0]);
}

/**
 * System Realtime 1-byte message builders (24-PPQ MIDI Clock & Transport).
 */
export function makeClockTick() {
  return new Uint8Array([MIDI_REALTIME.CLOCK]);
}

export function makeMidiStart() {
  return new Uint8Array([MIDI_REALTIME.START]);
}

export function makeMidiContinue() {
  return new Uint8Array([MIDI_REALTIME.CONTINUE]);
}

export function makeMidiStop() {
  return new Uint8Array([MIDI_REALTIME.STOP]);
}

/**
 * Computes Web MIDI high-resolution timestamps (ms) for all 24-PPQ `0xF8` clock
 * pulses falling within the audio scheduler window `[nextClockTimeSec, windowEndSec)`.
 */
export function computeMasterClockWindow({
  nextClockTimeSec = 0,
  windowEndSec = 0,
  bpm = 108,
  audioCurrentTimeSec = 0,
  nowMs = 0,
} = {}) {
  const clampedBpm = Math.max(MIN_MIDI_CLOCK_BPM, Math.min(MAX_MIDI_CLOCK_BPM, Number(bpm) || 108));
  const tickPeriodSec = 60 / (clampedBpm * MIDI_CLOCK_PPQ);
  const tickTimestampsMs = [];
  let cursorSec = Number.isFinite(nextClockTimeSec) ? nextClockTimeSec : audioCurrentTimeSec;
  const endSec = Number.isFinite(windowEndSec) ? windowEndSec : cursorSec;

  while (cursorSec < endSec - 1e-9) {
    const delaySec = Math.max(0, cursorSec - audioCurrentTimeSec);
    tickTimestampsMs.push(nowMs + delaySec * 1000);
    cursorSec += tickPeriodSec;
  }

  return {
    tickTimestampsMs,
    nextClockTimeSec: cursorSec,
    tickPeriodSec,
  };
}

/**
 * Stateful 24-PPQ MIDI Clock & Transport Slave synchronizer (P5-33).
 * Smooths incoming `0xF8` inter-tick deltas over a rolling 24-tick (1 quarter-note)
 * window to derive BPM (`36..208`) and tracks 12-tick eighth-note step boundaries
 * across the 12-step (144-tick) ensemble loop.
 */
export function createMidiClockSlave({
  windowSize = MIDI_CLOCK_PPQ,
  minBpm = MIN_MIDI_CLOCK_BPM,
  maxBpm = MAX_MIDI_CLOCK_BPM,
  ticksPerStep = MIDI_TICKS_PER_STEP,
} = {}) {
  let running = false;
  let tickCount = 0;
  let lastTickMs = null;
  let intervals = [];
  let bpm = null;

  function stepIndex() {
    return Math.floor(tickCount / ticksPerStep) % 12;
  }

  return {
    reset() {
      running = false;
      tickCount = 0;
      lastTickMs = null;
      intervals = [];
      bpm = null;
    },
    onStart(timestampMs = null) {
      running = true;
      tickCount = 0;
      lastTickMs = Number.isFinite(timestampMs) ? timestampMs : null;
      return { command: "restart", step: 0, tickCount: 0, bpm };
    },
    onContinue(timestampMs = null) {
      running = true;
      lastTickMs = Number.isFinite(timestampMs) ? timestampMs : null;
      return { command: "play", step: stepIndex(), tickCount, bpm };
    },
    onStop() {
      running = false;
      lastTickMs = null;
      return { command: "stop", step: stepIndex(), tickCount, bpm };
    },
    onClock(timestampMs = null) {
      if (Number.isFinite(timestampMs)) {
        if (lastTickMs !== null) {
          const deltaMs = timestampMs - lastTickMs;
          // Accept plausible 24-PPQ inter-tick intervals (~4 ms to ~1500 ms)
          if (deltaMs > 4 && deltaMs < 1500) {
            intervals.push(deltaMs);
            if (intervals.length > windowSize) intervals.shift();
            const sum = intervals.reduce((acc, v) => acc + v, 0);
            const avgDeltaMs = sum / intervals.length;
            const rawBpm = 60000 / (MIDI_CLOCK_PPQ * avgDeltaMs);
            bpm = Math.max(minBpm, Math.min(maxBpm, Math.round(rawBpm)));
          }
        }
        lastTickMs = timestampMs;
      }
      const currentTick = tickCount;
      tickCount += 1;
      const stepBoundary = currentTick % ticksPerStep === 0;
      const currentStepIndex = Math.floor(currentTick / ticksPerStep) % 12;
      return {
        running,
        currentTick,
        tickCount,
        stepBoundary,
        stepIndex: currentStepIndex,
        bpm,
      };
    },
    getState() {
      return {
        running,
        tickCount,
        bpm,
        stepIndex: stepIndex(),
      };
    },
  };
}

/**
 * Checks whether the environment supports Web MIDI.
 */
export function isWebMidiSupported() {
  return typeof navigator !== "undefined" && typeof navigator.requestMIDIAccess === "function";
}

/**
 * Requests Web MIDI access with graceful failure if permission is denied or unsupported.
 */
export async function requestMidiAccess(options = { sysex: false }) {
  if (!isWebMidiSupported()) return null;
  try {
    return await navigator.requestMIDIAccess(options);
  } catch {
    return null;
  }
}

/**
 * Enumerates all active MIDI input and output ports from a MIDIAccess instance.
 */
export function getMidiPorts(midiAccess) {
  if (!midiAccess) return { inputs: [], outputs: [] };
  const inputs = [];
  const outputs = [];
  if (midiAccess.inputs) {
    for (const port of midiAccess.inputs.values()) {
      inputs.push({ id: port.id, name: port.name || `Input ${port.id}`, manufacturer: port.manufacturer || "", state: port.state });
    }
  }
  if (midiAccess.outputs) {
    for (const port of midiAccess.outputs.values()) {
      outputs.push({ id: port.id, name: port.name || `Output ${port.id}`, manufacturer: port.manufacturer || "", state: port.state });
    }
  }
  return { inputs, outputs };
}

/**
 * Binds an incoming message listener to MIDI input port(s).
 * If targetInputId is "all" or "omni", listens to all connected inputs.
 * Returns an unbind cleanup function.
 */
export function bindMidiInput(midiAccess, targetInputId, onMessage) {
  if (!midiAccess || !midiAccess.inputs || typeof onMessage !== "function") return () => {};
  const boundPorts = [];

  const handler = (event) => {
    const parsed = parseMidiMessage(event.data);
    if (parsed) onMessage(parsed, event);
  };

  const isOmni = !targetInputId || targetInputId === "all" || targetInputId === "omni";

  for (const port of midiAccess.inputs.values()) {
    if (isOmni || port.id === targetInputId) {
      port.onmidimessage = handler;
      boundPorts.push(port);
    }
  }

  return () => {
    for (const port of boundPorts) {
      port.onmidimessage = null;
    }
  };
}

/**
 * Transmits MIDI bytes to the specified output port ID (or all outputs if "all").
 * Supports high-resolution timestamps for scheduled output.
 */
export function sendMidiMessage(midiAccess, targetOutputId, bytes, timestamp) {
  if (!midiAccess || !midiAccess.outputs || !bytes) return false;
  const isAll = targetOutputId === "all";
  let sent = false;

  for (const port of midiAccess.outputs.values()) {
    if (isAll || port.id === targetOutputId) {
      try {
        if (Number.isFinite(timestamp)) {
          port.send(bytes, timestamp);
        } else {
          port.send(bytes);
        }
        sent = true;
      } catch {
        // Output device disconnected or port closed
      }
    }
  }
  return sent;
}

/**
 * Checks whether AudioContext.setSinkId is supported for audio routing.
 */
export function isSetSinkIdSupported(audioContext) {
  return typeof audioContext !== "undefined" && typeof audioContext.setSinkId === "function";
}

/**
 * Enumerates available system audio output devices.
 */
export async function getAudioOutputDevices() {
  if (typeof navigator === "undefined" || !navigator.mediaDevices || typeof navigator.mediaDevices.enumerateDevices !== "function") {
    return [];
  }
  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    return devices
      .filter((d) => d.kind === "audiooutput")
      .map((d, index) => ({
        deviceId: d.deviceId,
        label: d.label || (d.deviceId === "default" ? "System Default Output" : `Audio Output ${index + 1}`),
        groupId: d.groupId,
      }));
  } catch {
    return [];
  }
}

/**
 * Routes an AudioContext's rendered output to a specific audio device ID.
 */
export async function setAudioOutputSink(audioContext, deviceId) {
  if (!isSetSinkIdSupported(audioContext)) return false;
  try {
    await audioContext.setSinkId(deviceId || "");
    return true;
  } catch {
    return false;
  }
}
