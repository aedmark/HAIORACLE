// Studio-grade audio export (P8-01, D-076). Pure functions only: the app
// renders through OfflineAudioContext and hands the channel data here.
//
// What a DAW needs from a loop file, and what this module guarantees:
// - beat one sits at sample zero, and a loop-perfect file is exactly one loop
//   long, with the decay that rings past the loop end folded back onto its
//   start, so the file repeats seamlessly on a grid;
// - 16-bit (TPDF-dithered from a seeded generator, so a phrase still exports
//   the same bytes), 24-bit PCM, or 32-bit float at 44.1, 48, or 96 kHz;
// - `smpl` loop points and an `acid` chunk carrying tempo, beats, and root
//   note, which Ableton Live, FL Studio, Logic, and samplers read to place and
//   stretch the file; and a `LIST/INFO` chunk naming the creature and engine.

import { PITCH_NAMES } from "./conductor.mjs";
import { SCALE_NAMES } from "./music.mjs";

export const EXPORT_BIT_DEPTHS = Object.freeze(["16", "24", "32f"]);
export const EXPORT_SAMPLE_RATES = Object.freeze([44100, 48000, 96000]);
export const EXPORT_LOOP_MODES = Object.freeze(["loop", "oneshot"]);
export const EXPORT_STEM_MODES = Object.freeze(["dry", "printed"]);
export const DEFAULT_EXPORT_SETTINGS = Object.freeze({
  bitDepth: "24",
  sampleRate: 48000,
  loopMode: "loop",
  stemMode: "dry",
});
// Sample-peak ceiling. Exports are only ever turned down to meet it, never up.
export const PEAK_CEILING_DB = -1;

const ASCII_PITCH = Object.freeze(["C", "Csharp", "D", "Eflat", "E", "F", "Fsharp", "G", "Aflat", "A", "Bflat", "B"]);

/** Accepts only known settings; anything else falls back to the defaults. */
export function normalizeExportSettings(raw = {}) {
  const rate = Number(raw.sampleRate);
  return Object.freeze({
    bitDepth: EXPORT_BIT_DEPTHS.includes(String(raw.bitDepth)) ? String(raw.bitDepth) : DEFAULT_EXPORT_SETTINGS.bitDepth,
    sampleRate: EXPORT_SAMPLE_RATES.includes(rate) ? rate : DEFAULT_EXPORT_SETTINGS.sampleRate,
    loopMode: EXPORT_LOOP_MODES.includes(raw.loopMode) ? raw.loopMode : DEFAULT_EXPORT_SETTINGS.loopMode,
    stemMode: EXPORT_STEM_MODES.includes(raw.stemMode) ? raw.stemMode : DEFAULT_EXPORT_SETTINGS.stemMode,
  });
}

/**
 * The key a creature sounds in: `rootMidi` is the score root (any octave) and
 * `scaleIndex` an index into SCALE_NAMES. Returns a display label, an ASCII
 * filename slug, and the MIDI unity note for sampler chunks (octave 3-4).
 */
export function keyLabelFor(rootMidi, scaleIndex) {
  const pitchClass = ((Math.round(rootMidi) % 12) + 12) % 12;
  const scale = SCALE_NAMES[scaleIndex] ?? "MAJOR";
  return Object.freeze({
    pitchClass,
    display: `${PITCH_NAMES[pitchClass]} ${scale}`,
    ascii: `${ASCII_PITCH[pitchClass]}-${scale.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
    rootNote: 48 + pitchClass,
  });
}

/** Whole beats in a loop of `seconds` at `bpm`, for the `acid` chunk. */
export function beatsIn(seconds, bpm) {
  return Math.max(1, Math.round((seconds * bpm) / 60));
}

/**
 * `whimsy-<name>-<seed>-<bpm>bpm-<key>[-<suffix>].<ext>`, ASCII only, so the
 * tempo and key survive into any sample browser.
 */
export function exportFilename(score, { bpm, keyAscii, suffix = "", extension = "wav" } = {}) {
  const slug = String(score?.name || "specimen").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 40) || "specimen";
  const seedHex = ((score?.seed ?? 0) >>> 0).toString(16).padStart(8, "0");
  const parts = ["whimsy", slug, seedHex];
  if (Number.isFinite(bpm)) parts.push(`${Math.round(bpm)}bpm`);
  if (keyAscii) parts.push(keyAscii);
  if (suffix) parts.push(String(suffix).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, ""));
  return `${parts.join("-")}.${String(extension).replace(/^\./, "")}`;
}

/**
 * Cuts a render into a file. `start` is the sample where beat one falls and
 * `length` the loop's length in samples.
 * - "loop": exactly `length` samples; everything after the loop end (delay
 *   repeats, reverb, release tails) is added back from the loop start, as it
 *   would sound when the loop repeats. Samples before `start` are dropped.
 * - "oneshot": from `start` to the end of the render, tail included.
 */
export function cutRender(channels, { start, length, mode = "loop" }) {
  if (!Array.isArray(channels) || !channels.length) throw new TypeError("cutRender needs channel data");
  if (!Number.isInteger(start) || start < 0 || !Number.isInteger(length) || length < 1) {
    throw new RangeError("cutRender needs an integer start and a positive integer length");
  }
  if (mode === "oneshot") return channels.map((data) => data.slice(start));
  if (mode !== "loop") throw new RangeError(`Unknown loop mode: ${mode}`);
  return channels.map((data) => {
    const out = new Float32Array(length);
    for (let index = start; index < data.length; index += 1) {
      out[(index - start) % length] += data[index];
    }
    return out;
  });
}

export function peakOf(channels) {
  let peak = 0;
  for (const data of channels) {
    for (let index = 0; index < data.length; index += 1) {
      const value = Math.abs(data[index]);
      if (value > peak) peak = value;
    }
  }
  return peak;
}

/**
 * Turns every file in `files` (each an array of channels) down by one shared
 * gain if any peak exceeds the ceiling, so stems keep their balance. Never
 * raises the level. Mutates in place; returns `{ gain, peak }`.
 */
export function applyPeakCeiling(files, ceilingDb = PEAK_CEILING_DB) {
  const ceiling = 10 ** (ceilingDb / 20);
  const peak = Math.max(0, ...files.map((channels) => peakOf(channels)));
  const gain = peak > ceiling ? ceiling / peak : 1;
  if (gain !== 1) {
    for (const channels of files) {
      for (const data of channels) {
        for (let index = 0; index < data.length; index += 1) data[index] *= gain;
      }
    }
  }
  return { gain, peak };
}

// mulberry32: a tiny seeded generator, so dithered exports are reproducible.
function seededRandom(seed) {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// RIFF INFO text is byte strings. Transliterate the parlor's typography and
// drop anything else outside printable ASCII.
function asciiText(value, max = 200) {
  return String(value ?? "")
    .replace(/♯/g, "#").replace(/♭/g, "b").replace(/[·•]/g, "-").replace(/[–—]/g, "-").replace(/º|°/g, "o")
    .normalize("NFKD").replace(/[^\x20-\x7e]/g, "")
    .slice(0, max);
}

/**
 * Encodes channel data as a RIFF WAVE file.
 * Options:
 * - `bitDepth`: "16", "24", or "32f";
 * - `dither`: TPDF dither for 16-bit (default true), seeded by `seed`;
 * - `loop`: `{ start, end }` sample frames (end exclusive) for a `smpl` loop;
 * - `acid`: `{ bpm, beats, rootNote, oneShot }` for an `acid` chunk;
 * - `info`: `{ name, software, comment, keywords }` for `LIST/INFO`.
 * Returns a Uint8Array.
 */
export function encodeWav(channels, sampleRate, {
  bitDepth = "24",
  dither = true,
  seed = 0,
  loop = null,
  acid = null,
  info = null,
} = {}) {
  if (!Array.isArray(channels) || !channels.length) throw new TypeError("encodeWav needs channel data");
  if (!EXPORT_BIT_DEPTHS.includes(String(bitDepth))) throw new RangeError(`Unknown bit depth: ${bitDepth}`);
  const depth = String(bitDepth);
  const numChannels = channels.length;
  const frames = Math.min(...channels.map((data) => data.length));
  const rate = Math.round(Number(sampleRate));
  if (!Number.isInteger(rate) || rate < 8000) throw new RangeError("encodeWav needs a sample rate");
  const isFloat = depth === "32f";
  const bytesPerSample = depth === "16" ? 2 : depth === "24" ? 3 : 4;
  const blockAlign = numChannels * bytesPerSample;
  const dataBytes = frames * blockAlign;

  const chunks = [];
  const chunk = (id, size, write) => chunks.push({ id, size, write });

  chunk("fmt ", isFloat ? 18 : 16, (view, at) => {
    view.setUint16(at, isFloat ? 3 : 1, true);
    view.setUint16(at + 2, numChannels, true);
    view.setUint32(at + 4, rate, true);
    view.setUint32(at + 8, rate * blockAlign, true);
    view.setUint16(at + 12, blockAlign, true);
    view.setUint16(at + 14, bytesPerSample * 8, true);
    if (isFloat) view.setUint16(at + 16, 0, true);
  });
  if (isFloat) chunk("fact", 4, (view, at) => view.setUint32(at, frames, true));

  if (acid) {
    chunk("acid", 24, (view, at) => {
      // Flags: 0x01 one-shot, 0x02 root note set, 0x04 stretch.
      const flags = (acid.oneShot ? 0x01 : 0x04) | (Number.isInteger(acid.rootNote) ? 0x02 : 0);
      view.setUint32(at, flags, true);
      view.setUint16(at + 4, Number.isInteger(acid.rootNote) ? acid.rootNote : 60, true);
      view.setUint16(at + 6, 0x8000, true);
      view.setFloat32(at + 8, 0, true);
      view.setUint32(at + 12, Math.max(0, Math.round(acid.beats || 0)), true);
      view.setUint16(at + 16, 4, true);
      view.setUint16(at + 18, 4, true);
      view.setFloat32(at + 20, Number(acid.bpm) || 120, true);
    });
  }

  if (loop || acid) {
    const loops = loop ? 1 : 0;
    chunk("smpl", 36 + 24 * loops, (view, at) => {
      view.setUint32(at, 0, true);
      view.setUint32(at + 4, 0, true);
      view.setUint32(at + 8, Math.round(1e9 / rate), true);
      view.setUint32(at + 12, Number.isInteger(acid?.rootNote) ? acid.rootNote : 60, true);
      view.setUint32(at + 16, 0, true);
      view.setUint32(at + 20, 0, true);
      view.setUint32(at + 24, 0, true);
      view.setUint32(at + 28, loops, true);
      view.setUint32(at + 32, 0, true);
      if (loop) {
        const start = Math.max(0, Math.min(frames - 1, Math.round(loop.start)));
        const end = Math.max(start, Math.min(frames, Math.round(loop.end)) - 1);
        view.setUint32(at + 36, 0, true);
        view.setUint32(at + 40, 0, true);
        view.setUint32(at + 44, start, true);
        view.setUint32(at + 48, end, true);
        view.setUint32(at + 52, 0, true);
        view.setUint32(at + 56, 0, true);
      }
    });
  }

  if (info) {
    const entries = [
      ["INAM", info.name],
      ["ISFT", info.software],
      ["ICMT", info.comment],
      ["IKEY", info.keywords],
    ].filter(([, text]) => text).map(([id, text]) => {
      const bytes = new TextEncoder().encode(`${asciiText(text)}\0`);
      return { id, bytes };
    });
    const size = 4 + entries.reduce((sum, { bytes }) => sum + 8 + bytes.length + (bytes.length % 2), 0);
    chunk("LIST", size, (view, at, writeId) => {
      writeId(at, "INFO");
      let offset = at + 4;
      for (const { id, bytes } of entries) {
        writeId(offset, id);
        view.setUint32(offset + 4, bytes.length, true);
        bytes.forEach((byte, index) => view.setUint8(offset + 8 + index, byte));
        offset += 8 + bytes.length + (bytes.length % 2);
      }
    });
  }

  chunk("data", dataBytes, (view, at) => {
    const random = seededRandom(seed);
    let offset = at;
    for (let frame = 0; frame < frames; frame += 1) {
      for (let channel = 0; channel < numChannels; channel += 1) {
        const raw = channels[channel][frame];
        const value = Number.isFinite(raw) ? raw : 0;
        if (isFloat) {
          view.setFloat32(offset, value, true);
        } else if (depth === "24") {
          const clamped = Math.max(-1, Math.min(1, value));
          let int = Math.round(clamped * 8388607);
          int = Math.max(-8388608, Math.min(8388607, int));
          view.setUint8(offset, int & 0xff);
          view.setUint8(offset + 1, (int >> 8) & 0xff);
          view.setUint8(offset + 2, (int >> 16) & 0xff);
        } else {
          // TPDF: the sum of two uniform variables, ±1 LSB peak.
          const noise = dither ? (random() - random()) : 0;
          let int = Math.round(Math.max(-1, Math.min(1, value)) * 32767 + noise);
          int = Math.max(-32768, Math.min(32767, int));
          view.setInt16(offset, int, true);
        }
        offset += bytesPerSample;
      }
    }
  });

  const total = 12 + chunks.reduce((sum, { size }) => sum + 8 + size + (size % 2), 0);
  const buffer = new ArrayBuffer(total);
  const view = new DataView(buffer);
  const writeId = (at, id) => {
    for (let index = 0; index < 4; index += 1) view.setUint8(at + index, id.charCodeAt(index));
  };
  writeId(0, "RIFF");
  view.setUint32(4, total - 8, true);
  writeId(8, "WAVE");
  let offset = 12;
  for (const { id, size, write } of chunks) {
    writeId(offset, id);
    view.setUint32(offset + 4, size, true);
    write(view, offset + 8, writeId);
    offset += 8 + size + (size % 2);
  }
  return new Uint8Array(buffer);
}

/**
 * Reads a RIFF WAVE file back into its chunks and samples. Used by the tests
 * as an independent check, and kept small: PCM 16/24 and float 32 only.
 */
export function readWav(bytes) {
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  const id = (at) => String.fromCharCode(...bytes.subarray(at, at + 4));
  if (id(0) !== "RIFF" || id(8) !== "WAVE") throw new Error("not a RIFF WAVE file");
  const chunks = {};
  let offset = 12;
  while (offset + 8 <= bytes.length) {
    const name = id(offset);
    const size = view.getUint32(offset + 4, true);
    chunks[name] = { at: offset + 8, size };
    offset += 8 + size + (size % 2);
  }
  const fmt = chunks["fmt "];
  const format = view.getUint16(fmt.at, true);
  const numChannels = view.getUint16(fmt.at + 2, true);
  const sampleRate = view.getUint32(fmt.at + 4, true);
  const bits = view.getUint16(fmt.at + 14, true);
  const bytesPerSample = bits / 8;
  const frames = chunks.data.size / (numChannels * bytesPerSample);
  const channels = Array.from({ length: numChannels }, () => new Float32Array(frames));
  let at = chunks.data.at;
  for (let frame = 0; frame < frames; frame += 1) {
    for (let channel = 0; channel < numChannels; channel += 1) {
      let value;
      if (format === 3) value = view.getFloat32(at, true);
      else if (bits === 24) {
        let int = bytes[at] | (bytes[at + 1] << 8) | (bytes[at + 2] << 16);
        if (int & 0x800000) int -= 0x1000000;
        value = int / 8388607;
      } else value = view.getInt16(at, true) / 32767;
      channels[channel][frame] = value;
      at += bytesPerSample;
    }
  }
  const result = { format, numChannels, sampleRate, bits, frames, channels, chunks: Object.keys(chunks) };
  if (chunks.smpl) {
    const s = chunks.smpl.at;
    result.smpl = { unityNote: view.getUint32(s + 12, true), loops: view.getUint32(s + 28, true) };
    if (result.smpl.loops) result.smpl.loop = { start: view.getUint32(s + 44, true), end: view.getUint32(s + 48, true) };
  }
  if (chunks.acid) {
    const a = chunks.acid.at;
    result.acid = {
      flags: view.getUint32(a, true),
      rootNote: view.getUint16(a + 4, true),
      beats: view.getUint32(a + 12, true),
      tempo: view.getFloat32(a + 20, true),
    };
  }
  if (chunks.LIST) {
    const info = {};
    let p = chunks.LIST.at + 4;
    const end = chunks.LIST.at + chunks.LIST.size;
    while (p + 8 <= end) {
      const key = id(p);
      const size = view.getUint32(p + 4, true);
      info[key] = new TextDecoder().decode(bytes.subarray(p + 8, p + 8 + size)).replace(/\0+$/, "");
      p += 8 + size + (size % 2);
    }
    result.info = info;
  }
  return result;
}
