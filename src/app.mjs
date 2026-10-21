import { HARMONY_NAMES, composeHarmony, cycleHarmonyCell } from "./befunge.mjs";
import { BASS_NAMES, composeBass, cycleBassCell } from "./brainfuck.mjs";
import {
  FUN_KEY_BY_CODE,
  FUN_KEY_BY_KEY,
  FUN_KEY_MAP,
  buildFunChord,
  chordLabelFor,
  conductEnsemble,
  genreBook,
  genreCodes,
  installRulebooks,
  rulebooksInstalled,
  semitoneGradus,
} from "./conductor.mjs";
import { compileRulebooks } from "./inform.mjs";
import { CHIME_NAMES, composeChimes, cycleChimeCell } from "./fractran.mjs";
import { BEAT_NAMES, composeBeat, cycleBeatStep } from "./malbolge.mjs";
import { MELODY_NAMES, melodyFor } from "./music.mjs";
import { composeScore, WAVEFORMS } from "./score.mjs";
import { GM_DRUMS, MIDI_TRACKS, buildMidiFile, ticksForSeconds, velocitiesFor } from "./midi.mjs";
import { createStoredZip } from "./zip.mjs";
import {
  ACCOMPANIMENT_STYLES,
  DEFAULT_ACCOMPANIMENT_STYLE,
  STYLE_LABELS,
  arpeggioNotes,
  buildPerformance,
  chordText,
  leadMidi,
  padVoicing,
  stepsToRegionBoundary,
  toTonicRelative,
} from "./accompaniment.mjs";
import { myceliumEvents } from "./mycelium.mjs";
import { DEFAULT_VOICE_ID, scheduleVoiceLead, scheduleVoicePad, scheduleVoicePluck, voiceById } from "./voices.mjs";
import { audioBufferToWavBlob, buildShareUrl, decodeOmenHash, encodeOmenHash, specimenFilenameFor } from "./share.mjs";
import { CHANT_NAMES, composeChant, cycleChantCell } from "./shakespeare.mjs";
import { arrangementSectionAt, composeArrangement } from "./intercal.mjs";
import {
  DRONE_SETTLE,
  DRONE_SWELL,
  PARLOR_CRACKLE_PER_LEVEL,
  PARLOR_REVERB_PER_LEVEL,
  SILENT_GAIN,
  buildEnsembleGraph,
  creatureFilter,
  delayTimeFor,
  droneFrequencies,
  foldIntoRange,
  leadOctaveShift,
  parlorSendLevels,
} from "./ensemble.mjs";
import {
  ACCOMPANIMENT_CHANNEL_IDS,
  FADER_UNITY,
  MIXER_CHANNELS,
  MIXER_CHANNEL_IDS,
  anySoloed,
  channelSettings,
  createMixerState,
  faderDb,
  formatDb,
  formatPan,
  isChannelAudible,
  meterFill,
  meterReading,
  mixerStateFromChannels,
  resetChannel,
  setFader,
  setMuted,
  setPan,
  silentSettings,
  stemSettings,
  toggleMute,
  toggleSolo,
} from "./mixer.mjs";
import {
  MAX_SESSION_BYTES,
  PLATE_IDS,
  PRESET_STORAGE_KEY,
  SESSION_FILE_EXTENSION,
  SESSION_FORMAT,
  SESSION_VERSION,
  emptyPresetStore,
  parsePresetStore,
  parseSession,
  removePreset,
  serializePresetStore,
  serializeSession,
  upsertPreset,
} from "./session.mjs";
import { TRANSPORT_STATES, createTransportState, transportCommandForKey, transportReduce } from "./transport.mjs";
import {
  MAX_REPEATS,
  MAX_SONG_PASSES,
  appendLoop,
  canAppendLoop,
  canOverdub,
  clampSelection,
  deleteLoop,
  emptySong,
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
} from "./looper.mjs";
import {
  CABINET_STORAGE_KEY,
  DRAWERS,
  LOOPS_BEFORE_BAND,
  cabinetReduce,
  defaultCabinetState,
  drawerForTrigger,
  isDrawerOpen,
  parseCabinetState,
  serializeCabinetState,
} from "./cabinet.mjs";

// Esoteric sources share this module's ?v= stamp from the index.html import map
// (D-035), so a cached old spell is never paired with a fresh interpreter.
function sourceUrl(name) {
  const url = new URL(name, import.meta.url);
  url.search = new URL(import.meta.url).search;
  return url;
}

const RHYTHMS = Object.freeze([
  [1, 1, 1, 1],
  [1.5, 0.5, 1, 1],
  [0.5, 0.5, 1, 0.5, 1.5],
  [1, 0.5, 0.5, 1.5, 0.5],
  [2, 0.5, 0.5, 1],
  [0.75, 0.75, 0.5, 1, 0.5, 0.5],
]);

const SURPRISES = Object.freeze([
  "the moon owes me five dollars",
  "a cucumber with excellent boundaries",
  "Tuesday smells faintly purple",
  "my shadow has joined a union",
  "please hold for the infinite goose",
  "the wallpaper knows jazz",
  "a very small thunderstorm",
  "soup for the final astronaut",
  "the celestial laundromat is closing",
  "three pigeons in a borrowed coat",
  "gravity has submitted its resignation",
  "an accordion at the edge of time",
]);

const elements = {
  canvas: document.querySelector("#vision"),
  form: document.querySelector("#oracle-controls"),
  phrase: document.querySelector("#phrase"),
  surprise: document.querySelector("#surprise"),
  replay: document.querySelector("#replay"),
  shareLink: document.querySelector("#share-link"),
  exportPng: document.querySelector("#export-png"),
  exportWav: document.querySelector("#export-wav"),
  exportStems: document.querySelector("#export-stems"),
  exportMidi: document.querySelector("#export-midi"),
  sound: document.querySelector("#sound-toggle"),
  transportDeck: document.querySelector("#transport-deck"),
  transportPlay: document.querySelector("#transport-play"),
  transportPause: document.querySelector("#transport-pause"),
  transportStop: document.querySelector("#transport-stop"),
  transportPosition: document.querySelector("#transport-position"),
  transportSection: document.querySelector("#transport-section"),
  mixerStrips: document.querySelector("#mixer-strips"),
  mixerTelemetry: document.querySelector("#mixer-telemetry"),
  mixerReset: document.querySelector("#mixer-reset"),
  sessionTelemetry: document.querySelector("#session-telemetry"),
  sessionPresetName: document.querySelector("#session-preset-name"),
  sessionSavePreset: document.querySelector("#session-save-preset"),
  sessionPresetList: document.querySelector("#session-preset-list"),
  sessionLoadPreset: document.querySelector("#session-load-preset"),
  sessionDeletePreset: document.querySelector("#session-delete-preset"),
  sessionSaveFile: document.querySelector("#session-save-file"),
  sessionOpenFile: document.querySelector("#session-open-file"),
  sessionFileInput: document.querySelector("#session-file-input"),
  volume: document.querySelector("#master-volume"),
  volumeValue: document.querySelector("#volume-value"),
  tempo: document.querySelector("#tempo-bpm"),
  tempoValue: document.querySelector("#tempo-value"),
  name: document.querySelector("#creature-name"),
  pulse: document.querySelector("#score-pulse"),
  wave: document.querySelector("#score-wave"),
  formValue: document.querySelector("#score-form"),
  melody: document.querySelector("#score-melody"),
  fungal: document.querySelector("#score-fungal"),
  beatName: document.querySelector("#score-beat"),
  beatTelemetry: document.querySelector("#beat-telemetry"),
  beatToggle: document.querySelector("#beat-toggle"),
  beatMutate: document.querySelector("#beat-mutate"),
  beatGrid: document.querySelector("#beat-grid"),
  bassName: document.querySelector("#score-bass"),
  bassTelemetry: document.querySelector("#bass-telemetry"),
  bassToggle: document.querySelector("#bass-toggle"),
  bassMutate: document.querySelector("#bass-mutate"),
  bassGrid: document.querySelector("#bass-grid"),
  harmonyName: document.querySelector("#score-harmony"),
  harmonyTelemetry: document.querySelector("#harmony-telemetry"),
  harmonyToggle: document.querySelector("#harmony-toggle"),
  harmonyMutate: document.querySelector("#harmony-mutate"),
  harmonyGrid: document.querySelector("#harmony-grid"),
  chimeName: document.querySelector("#score-chime"),
  chimeTelemetry: document.querySelector("#chime-telemetry"),
  chimeToggle: document.querySelector("#chime-toggle"),
  chimeMutate: document.querySelector("#chime-mutate"),
  chimeGrid: document.querySelector("#chime-grid"),
  chantName: document.querySelector("#score-chant"),
  chantTelemetry: document.querySelector("#chant-telemetry"),
  chantToggle: document.querySelector("#chant-toggle"),
  chantMutate: document.querySelector("#chant-mutate"),
  chantGrid: document.querySelector("#chant-grid"),
  bandstandStatus: document.querySelector("#bandstand-status"),
  bandstandTelemetry: document.querySelector("#bandstand-telemetry"),
  bandstandEngageAll: document.querySelector("#bandstand-engage-all"),
  bandstandSoloLead: document.querySelector("#bandstand-solo-lead"),
  bandstandMutateAll: document.querySelector("#bandstand-mutate-all"),
  kapellmeisterEngine: document.querySelector("#kapellmeister-engine"),
  kapellmeisterGenreTitle: document.querySelector("#kapellmeister-genre-title"),
  kapellmeisterGenreMotto: document.querySelector("#kapellmeister-genre-motto"),
  kapellmeisterGenre: document.querySelector("#kapellmeister-genre"),
  kapellmeisterTelemetry: document.querySelector("#kapellmeister-telemetry"),
  kapellmeisterStrictness: document.querySelector("#kapellmeister-strictness"),
  kapellmeisterStrictnessVal: document.querySelector("#kapellmeister-strictness-val"),
  harmonicStep: document.querySelector("#harmonic-step"),
  harmonicChord: document.querySelector("#harmonic-chord"),
  harmonicVector: document.querySelector("#harmonic-vector"),
  harmonicEuler: document.querySelector("#harmonic-euler"),
  compassReg0: document.querySelector("#compass-reg-0"),
  compassReg1: document.querySelector("#compass-reg-1"),
  compassReg2: document.querySelector("#compass-reg-2"),
  compassReg3: document.querySelector("#compass-reg-3"),
  nodeText0: document.querySelector("#node-text-0"),
  nodeText1: document.querySelector("#node-text-1"),
  nodeText2: document.querySelector("#node-text-2"),
  nodeText3: document.querySelector("#node-text-3"),
  parlorAcousticsToggle: document.querySelector("#parlor-acoustics-toggle"),
  parlorAcousticsLevel: document.querySelector("#parlor-acoustics-level"),
  acousticsLevelVal: document.querySelector("#acoustics-level-val"),
  acousticsStatus: document.querySelector("#acoustics-status"),
  chipCrackle: document.querySelector("#chip-crackle"),
  chipReverb: document.querySelector("#chip-reverb"),
  chipTick: document.querySelector("#chip-tick"),
  funMachineEngine: document.querySelector("#fun-machine-engine"),
  funMachineStatus: document.querySelector("#fun-machine-status"),
  funMachineTelemetry: document.querySelector("#fun-machine-telemetry"),
  funKeyboard: document.querySelector("#fun-keyboard"),
  status: document.querySelector("#status"),
};

let oracleSource = "";
let beatSource = "";
let bassSource = "";
let harmonySource = "";
let pietSource = "";
let fractranSource = "";
let chantSource = "";
let conductorSource = "";
let currentScore = null;
let currentArrangement = null;
let currentBeat = null;
let currentBass = null;
let currentHarmony = null;
let currentChimes = null;
let currentChant = null;
let rawBeat = null;
let rawBass = null;
let rawHarmony = null;
let rawChimes = null;
let rawChant = null;
let mixerState = createMixerState();
let beatMutation = 0;
let bassMutation = 0;
let harmonyMutation = 0;
let chimeMutation = 0;
let chantMutation = 0;
let activeBeatStep = -1;
let transportState = createTransportState();
let audioContext = null;
let noiseBuffer = null;
let currentTransport = null;
let muted = false;
let masterVolume = Number(elements.volume.value);
let activeTempoBpm = Number(elements.tempo?.value || 108);
// A genre code from src/rulebooks.ni; set once the rulebooks load.
let activeGenre = null;
let activeStrictness = 8;
let currentConductedSpine = null;
let parlorAcousticsEnabled = true;
let parlorAcousticsLevel = 0.55;
let parlorCrackleEnabled = true;
let parlorReverbEnabled = true;
let parlorTickEnabled = true;
let funMachineStyle = DEFAULT_ACCOMPANIMENT_STYLE;
let funMachineDryGain = null;
let activeHeldFunKey = null;
let activeFunPerformance = null;


const interaction = {
  active: false,
  pointerId: null,
  x: 0,
  y: 0,
  smoothX: 0,
  smoothY: 0,
  hold: 0,
  tap: 0,
  dragSpeed: 0,
  dragTravel: 0,
  dragDistance: 0,
  morphPhase: 0,
  pitchBend: 0,
  lastFrameAt: 0,
  lastTickAt: 0,
  ripples: [],
};

function mulberry32(seed) {
  let state = seed >>> 0;
  return () => {
    state += 0x6d2b79f5;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

function midiToFrequency(note) {
  return 440 * (2 ** ((note - 69) / 12));
}

function masterGainFor(volume) {
  if (volume <= 0) return 0;
  return Math.min(1.4, (volume / 82) ** 1.6);
}

function setMasterVolume(value) {
  masterVolume = Math.max(0, Math.min(100, Number(value)));
  elements.volumeValue.value = `${Math.round(masterVolume)}%`;
  if (audioContext && funMachineDryGain) {
    const now = audioContext.currentTime;
    funMachineDryGain.gain.cancelScheduledValues(now);
    funMachineDryGain.gain.setTargetAtTime(masterGainFor(masterVolume), now, 0.018);
  }
  if (!audioContext || !currentTransport) return;
  const now = audioContext.currentTime;
  currentTransport.output.gain.cancelScheduledValues(now);
  currentTransport.output.gain.setTargetAtTime(masterGainFor(masterVolume), now, 0.018);
}

function setTempoBpm(value) {
  activeTempoBpm = Math.max(36, Math.min(208, Math.round(Number(value))));
  if (elements.tempo) elements.tempo.value = String(activeTempoBpm);
  if (elements.tempoValue) elements.tempoValue.value = `${activeTempoBpm} BPM`;
  if (elements.pulse && currentScore) elements.pulse.textContent = String(activeTempoBpm);
  // The echo was timed once when the loop started. Since the Fun Machine's
  // pads, arpeggios, and lead feed it (D-029), a stale echo after a tempo
  // change made the accompaniment sound faster or slower than the setting.
  if (audioContext && currentTransport?.delay && currentScore) {
    currentTransport.delay.delayTime.setTargetAtTime(delayTimeFor(currentScore, activeTempoBpm), audioContext.currentTime, 0.08);
  }
}

function wrapHue(hue) {
  return ((hue % 360) + 360) % 360;
}

function paletteFor(score) {
  const shifts = [
    [0, score.hueShift, 180],
    [0, -score.hueShift, score.hueShift],
    [0, 28, 64],
    [0, 120, 240],
    [0, 180, 180 + score.hueShift / 3],
    [0, 150, 210],
    [0, score.hueShift / 2, score.hueShift],
    [0, 90, 180],
  ][score.palette];
  return shifts.map((shift) => wrapHue(score.hue + shift));
}

function shapeFamilyRadius(shape, symmetry, edge, twist, angle) {
  const folded = Math.cos(angle * symmetry);
  switch (shape) {
    case 0: return 0.72 + folded * (0.12 + edge * 0.16);
    case 1: return 0.58 + (Math.abs(folded) ** (3 + edge * 8)) * 0.38;
    case 2: return 0.68 + folded * 0.11;
    case 3: return 0.58 + (Math.floor((angle / Math.PI) * symmetry * 2) % 2) * (0.2 + edge * 0.16);
    case 4: return 0.64 + Math.abs(folded) * (0.16 + edge * 0.18);
    case 5: return 0.7 + Math.sin(angle * 2) * 0.12 + Math.cos(angle * 3 - 1.7) * 0.08 + folded * 0.04;
    case 6: return 0.63 + Math.sin(angle) * 0.18 + Math.cos(angle * symmetry) * 0.07;
    case 7: return 0.74 + Math.sin(angle * twist) * 0.055 + folded * 0.045;
    case 8: return 0.52 + Math.max(0, folded) * (0.28 + edge * 0.17);
    case 9: return 0.67 + Math.cos(angle * 2) * 0.15 + Math.max(0, Math.sin(angle)) * 0.12 + folded * 0.055;
    default: return 0.72;
  }
}

function shapeRadius(score, angle, elapsed) {
  const edge = score.edge / 100;
  let radius = shapeFamilyRadius(score.shape, score.symmetry, edge, score.twist, angle);
  const morphMix = Math.min(1, interaction.hold * 0.72 + interaction.tap * 0.42 + interaction.dragSpeed * 0.5);
  if (morphMix > 0.001) {
    const altShape = (score.shape + 3 + Math.floor(interaction.morphPhase * 0.35)) % 10;
    const altSymmetry = 2 + ((score.symmetry + 2) % 14);
    const altTwist = 1 + ((score.twist + 3) % 14);
    const morphed = shapeFamilyRadius(
      altShape,
      altSymmetry,
      Math.min(1, edge + 0.22),
      altTwist,
      angle + interaction.morphPhase * 0.45,
    );
    radius = radius * (1 - morphMix) + morphed * morphMix;
    const pointerAngle = Math.atan2(interaction.smoothY, interaction.smoothX);
    const pointerReach = Math.min(1, Math.hypot(interaction.smoothX, interaction.smoothY));
    const directionalPull = Math.cos(angle - pointerAngle) * pointerReach * (interaction.hold * 0.22 + interaction.dragSpeed * 0.18);
    const harmonicPinch = Math.cos((angle - pointerAngle) * (2 + (score.symmetry % 4)) + interaction.morphPhase) * (interaction.tap * 0.08 + interaction.hold * 0.06);
    radius += directionalPull + harmonicPinch;
  }
  return Math.max(0.38, Math.min(1.08, radius + fluxOffset(score, angle, elapsed)));
}

function fluxOffset(score, angle, elapsed) {
  const speed = 0.12 + score.kineticSpeed / 92;
  const time = elapsed * speed + interaction.morphPhase * 1.35 + score.kineticTilt / 8 * Math.PI * 2;
  const depth = (0.022 + score.kineticDepth / 100 * 0.095) * (1 + interaction.hold * 0.75 + interaction.dragSpeed * 0.6);
  const tapWave = Math.sin(angle * (score.symmetry + 5) - elapsed * 10.5) * interaction.tap * 0.068;
  switch (score.fluxMode) {
    case 0: return Math.sin(angle * score.twist - time) * depth + tapWave;
    case 1: return Math.sin(angle * score.symmetry + time) * Math.cos(angle * score.twist - time * 0.63) * depth + tapWave;
    case 2: return Math.sin(angle * 2 + time) * Math.sin(angle * (score.symmetry + 1) - time * 0.8) * depth + tapWave;
    case 3: return Math.tanh(Math.sin(angle * score.symmetry - time) * 3) * depth * 0.82 + tapWave;
    case 4: {
      const morph = (Math.sin(time * 0.55) + 1) / 2;
      return (Math.cos(angle * score.symmetry) * (1 - morph) + Math.cos(angle * (score.symmetry + 1)) * morph) * depth + tapWave;
    }
    case 5: return (Math.sin(angle * 3 - time) * 0.55 + Math.sin(angle * 7 + time * 0.73) * 0.3 + Math.cos(angle * 11 - time * 0.41) * 0.15) * depth + tapWave;
    case 6: return Math.sin(angle + Math.sin(time) * 1.4) * Math.cos(angle * score.twist - time) * depth + tapWave;
    case 7: return Math.sin(angle * score.symmetry - time) ** 3 * depth + tapWave;
    default: return tapWave;
  }
}

function traceBody(ctx, score, base, elapsed, points) {
  ctx.beginPath();
  for (let index = 0; index <= points; index += 1) {
    const angle = index / points * Math.PI * 2;
    const radius = base * shapeRadius(score, angle, elapsed);
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    if (index === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
}

const TESSERACT_VERTICES = Object.freeze(Array.from({ length: 16 }, (_, index) => [
  index & 1 ? 1 : -1,
  index & 2 ? 1 : -1,
  index & 4 ? 1 : -1,
  index & 8 ? 1 : -1,
]));

const TESSERACT_EDGES = Object.freeze(TESSERACT_VERTICES.flatMap((_, index) => (
  [1, 2, 4, 8]
    .filter((bit) => (index & bit) === 0)
    .map((bit) => [index, index | bit])
)));

function rotatePlane(point, first, second, angle) {
  const cosine = Math.cos(angle);
  const sine = Math.sin(angle);
  const a = point[first] * cosine - point[second] * sine;
  const b = point[first] * sine + point[second] * cosine;
  point[first] = a;
  point[second] = b;
}

function projectedTesseract(score, base, elapsed) {
  const speed = 0.08 + score.kineticSpeed / 145;
  const phase = score.kineticTilt / 8 * Math.PI * 2;
  return TESSERACT_VERTICES.map((source) => {
    const point = [...source];
    rotatePlane(point, 0, 3, elapsed * speed + phase);
    rotatePlane(point, 1, 2, elapsed * speed * 0.73 - phase * 0.4);
    rotatePlane(point, 1, 3, elapsed * speed * 0.47 + phase * 0.7);
    rotatePlane(point, 0, 2, elapsed * speed * 0.29);
    const perspective4 = 3.1 / (3.1 - point[3]);
    const x3 = point[0] * perspective4;
    const y3 = point[1] * perspective4;
    const z3 = point[2] * perspective4;
    const perspective3 = 4.2 / (4.2 - z3);
    const scale = base * (0.15 + score.kineticDepth / 1000);
    return { x: x3 * perspective3 * scale, y: y3 * perspective3 * scale, depth: z3 };
  });
}

function drawTesseract(ctx, score, base, elapsed, colors) {
  const vertices = projectedTesseract(score, base, elapsed);
  for (const [start, end] of TESSERACT_EDGES) {
    const a = vertices[start];
    const b = vertices[end];
    const depth = Math.max(-1.8, Math.min(1.8, (a.depth + b.depth) / 2));
    ctx.globalAlpha = 0.28 + (depth + 1.8) / 3.6 * 0.58;
    ctx.strokeStyle = `hsl(${colors[(start + end) % colors.length]} 100% ${62 + depth * 8}%)`;
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.stroke();
  }
  ctx.globalAlpha = 0.85;
  for (const [index, vertex] of vertices.entries()) {
    ctx.fillStyle = `hsl(${colors[index % colors.length]} 100% 76%)`;
    ctx.beginPath();
    ctx.arc(vertex.x, vertex.y, Math.max(1, base * 0.008), 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawNestedFrames(ctx, score, base, elapsed, colors) {
  const sides = 4 + score.kineticTilt % 5;
  const speed = 0.08 + score.kineticSpeed / 180;
  for (let layer = 0; layer < 6; layer += 1) {
    const radius = base * (0.13 + layer * 0.085);
    const rotation = elapsed * speed * (layer % 2 ? -1 : 1) + layer * 0.37;
    ctx.strokeStyle = `hsla(${colors[layer % colors.length]} 100% 76% / ${0.75 - layer * 0.07})`;
    ctx.beginPath();
    for (let point = 0; point <= sides; point += 1) {
      const angle = point / sides * Math.PI * 2 + rotation;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius * Math.cos(rotation * 0.6 + layer);
      if (point === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
  }
}

function drawRibbons(ctx, score, base, elapsed, colors) {
  const speed = 0.15 + score.kineticSpeed / 150;
  for (let ribbon = 0; ribbon < 4; ribbon += 1) {
    ctx.strokeStyle = `hsla(${colors[ribbon % colors.length]} 100% 78% / 0.62)`;
    ctx.beginPath();
    for (let point = 0; point <= 120; point += 1) {
      const phase = point / 120 * Math.PI * 2;
      const radius = base * (0.2 + ribbon * 0.08 + Math.sin(phase * score.twist + elapsed * speed) * 0.04);
      const x = Math.cos(phase + elapsed * speed * 0.2 * (ribbon + 1)) * radius;
      const y = Math.sin(phase * (1 + ribbon * 0.5) - elapsed * speed) * radius * 0.8;
      if (point === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
  }
}

function drawChordWeb(ctx, score, base, elapsed, colors) {
  const count = 18 + score.kineticTilt;
  const rotation = elapsed * (0.05 + score.kineticSpeed / 300);
  const vertices = Array.from({ length: count }, (_, index) => {
    const angle = index / count * Math.PI * 2 + rotation;
    const radius = base * (0.33 + Math.sin(index * score.twist + elapsed * 0.4) * 0.05);
    return [Math.cos(angle) * radius, Math.sin(angle) * radius];
  });
  for (let index = 0; index < count; index += 1) {
    const target = (index + score.symmetry) % count;
    ctx.strokeStyle = `hsla(${colors[index % colors.length]} 100% 76% / 0.42)`;
    ctx.beginPath();
    ctx.moveTo(vertices[index][0], vertices[index][1]);
    ctx.lineTo(vertices[target][0], vertices[target][1]);
    ctx.stroke();
  }
}

function drawDimensionalGrid(ctx, score, base, elapsed, colors) {
  const speed = 0.12 + score.kineticSpeed / 190;
  const rotation = elapsed * speed;
  ctx.save();
  ctx.rotate(rotation * 0.3);
  for (let line = -5; line <= 5; line += 1) {
    const shift = Math.sin(rotation + line * 0.7) * base * 0.08;
    ctx.strokeStyle = `hsla(${colors[(line + 6) % colors.length]} 100% 78% / 0.42)`;
    ctx.beginPath();
    ctx.moveTo(-base * 0.55, line * base * 0.075 + shift);
    ctx.bezierCurveTo(-base * 0.15, line * base * 0.04 - shift, base * 0.15, line * base * 0.11 + shift, base * 0.55, line * base * 0.075 - shift);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(line * base * 0.075 + shift, -base * 0.55);
    ctx.bezierCurveTo(line * base * 0.04 - shift, -base * 0.15, line * base * 0.11 + shift, base * 0.15, line * base * 0.075 - shift, base * 0.55);
    ctx.stroke();
  }
  ctx.restore();
}

function drawContourMembrane(ctx, score, base, elapsed, colors) {
  for (let layer = 1; layer <= 6; layer += 1) {
    ctx.strokeStyle = `hsla(${colors[layer % colors.length]} 100% 82% / ${0.24 + layer * 0.055})`;
    traceBody(ctx, score, base * layer / 7, elapsed + layer * 0.7, Math.max(80, score.symmetry * 16));
    ctx.stroke();
  }
}

function drawGyroscope(ctx, score, base, elapsed, colors) {
  const speed = 0.14 + score.kineticSpeed / 175;
  for (let ring = 0; ring < 7; ring += 1) {
    ctx.save();
    ctx.rotate(ring / 7 * Math.PI + elapsed * speed * (ring % 2 ? -0.32 : 0.28));
    ctx.strokeStyle = `hsla(${colors[ring % colors.length]} 100% 80% / 0.58)`;
    ctx.beginPath();
    ctx.ellipse(0, 0, base * (0.18 + ring * 0.045), base * (0.05 + (ring % 3) * 0.035), 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }
}

function drawCrystalNetwork(ctx, score, base, elapsed, colors) {
  const speed = 0.11 + score.kineticSpeed / 210;
  const nodes = Array.from({ length: 14 }, (_, index) => {
    const angle = index / 14 * Math.PI * 2 + elapsed * speed * (index % 2 ? -1 : 1);
    const radius = base * (0.14 + (index % 5) * 0.07 + Math.sin(elapsed * speed + index) * 0.025);
    return [Math.cos(angle) * radius, Math.sin(angle * (1 + score.kineticTilt / 16)) * radius];
  });
  for (let index = 0; index < nodes.length; index += 1) {
    for (const jump of [3, 5]) {
      const target = (index + jump) % nodes.length;
      ctx.strokeStyle = `hsla(${colors[(index + jump) % colors.length]} 100% 78% / 0.34)`;
      ctx.beginPath();
      ctx.moveTo(nodes[index][0], nodes[index][1]);
      ctx.lineTo(nodes[target][0], nodes[target][1]);
      ctx.stroke();
    }
    ctx.fillStyle = `hsl(${colors[index % colors.length]} 100% 78%)`;
    ctx.beginPath();
    ctx.arc(nodes[index][0], nodes[index][1], Math.max(1, base * 0.009), 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawKineticCore(ctx, score, base, elapsed, colors) {
  const coreElapsed = elapsed + interaction.morphPhase * 1.9;
  ctx.save();
  ctx.globalCompositeOperation = "screen";
  ctx.shadowBlur = 0;
  ctx.lineWidth = Math.max(0.7, base * (0.003 + score.kineticDepth / 32000) * (1 + interaction.hold * 0.55 + interaction.tap * 0.4));
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  switch (score.kineticMode) {
    case 0: drawTesseract(ctx, score, base, coreElapsed, colors); break;
    case 1: drawNestedFrames(ctx, score, base, coreElapsed, colors); break;
    case 2: drawRibbons(ctx, score, base, coreElapsed, colors); break;
    case 3: drawChordWeb(ctx, score, base, coreElapsed, colors); break;
    case 4: drawDimensionalGrid(ctx, score, base, coreElapsed, colors); break;
    case 5: drawContourMembrane(ctx, score, base, coreElapsed, colors); break;
    case 6: drawGyroscope(ctx, score, base, coreElapsed, colors); break;
    case 7: drawCrystalNetwork(ctx, score, base, coreElapsed, colors); break;
    default: drawTesseract(ctx, score, base, coreElapsed, colors);
  }
  ctx.restore();
}

function traceEyeShape(ctx, shape, size) {
  ctx.beginPath();
  switch (shape) {
    case 0:
      ctx.ellipse(0, 0, size * 1.55, size, 0, 0, Math.PI * 2);
      break;
    case 1:
      ctx.arc(0, 0, size * 1.12, 0, Math.PI * 2);
      break;
    case 2:
      ctx.moveTo(-size * 1.5, 0);
      ctx.lineTo(0, -size);
      ctx.lineTo(size * 1.5, 0);
      ctx.lineTo(0, size);
      ctx.closePath();
      break;
    case 3:
      ctx.moveTo(-size * 1.6, 0);
      ctx.bezierCurveTo(-size * 0.72, -size * 1.15, size * 0.72, -size * 1.15, size * 1.6, 0);
      ctx.bezierCurveTo(size * 0.72, size * 0.68, -size * 0.72, size * 0.68, -size * 1.6, 0);
      ctx.closePath();
      break;
    case 4:
      ctx.moveTo(0, -size * 1.18);
      ctx.lineTo(size * 1.38, size * 0.88);
      ctx.lineTo(-size * 1.38, size * 0.88);
      ctx.closePath();
      break;
    case 5:
      ctx.roundRect(-size * 1.42, -size * 0.86, size * 2.84, size * 1.72, size * 0.48);
      break;
    case 6:
      ctx.moveTo(-size * 1.55, size * 0.16);
      ctx.quadraticCurveTo(0, -size * 1.42, size * 1.55, size * 0.16);
      ctx.quadraticCurveTo(0, size * 0.72, -size * 1.55, size * 0.16);
      ctx.closePath();
      break;
    case 7:
      for (let point = 0; point < 6; point += 1) {
        const angle = -Math.PI / 2 + point / 6 * Math.PI * 2;
        const x = Math.cos(angle) * size * (point % 2 ? 1.18 : 1.42);
        const y = Math.sin(angle) * size;
        if (point === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      break;
    default:
      ctx.arc(0, 0, size, 0, Math.PI * 2);
  }
}

function tracePupil(ctx, shape, x, y, size) {
  ctx.beginPath();
  switch (shape) {
    case 0:
      ctx.arc(x, y, size * 0.38, 0, Math.PI * 2);
      break;
    case 1:
      ctx.ellipse(x, y, size * 0.17, size * 0.58, 0, 0, Math.PI * 2);
      break;
    case 2:
      ctx.ellipse(x, y, size * 0.62, size * 0.16, 0, 0, Math.PI * 2);
      break;
    case 3:
      ctx.moveTo(x, y - size * 0.56);
      ctx.lineTo(x + size * 0.42, y);
      ctx.lineTo(x, y + size * 0.56);
      ctx.lineTo(x - size * 0.42, y);
      ctx.closePath();
      break;
    case 4:
      for (let point = 0; point < 10; point += 1) {
        const angle = -Math.PI / 2 + point / 10 * Math.PI * 2;
        const radius = point % 2 ? size * 0.2 : size * 0.58;
        const px = x + Math.cos(angle) * radius;
        const py = y + Math.sin(angle) * radius;
        if (point === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      break;
    case 5:
      ctx.rect(x - size * 0.14, y - size * 0.6, size * 0.28, size * 1.2);
      ctx.rect(x - size * 0.6, y - size * 0.14, size * 1.2, size * 0.28);
      break;
    case 6:
      ctx.arc(x, y, size * 0.48, 0, Math.PI * 2);
      ctx.arc(x, y, size * 0.25, 0, Math.PI * 2, true);
      break;
    case 7:
      ctx.moveTo(x, y - size * 0.58);
      ctx.lineTo(x + size * 0.55, y + size * 0.48);
      ctx.lineTo(x - size * 0.55, y + size * 0.48);
      ctx.closePath();
      break;
    default:
      ctx.arc(x, y, size * 0.38, 0, Math.PI * 2);
  }
}

function eyePlacement(score, index, count, base, elapsed) {
  const ratio = count <= 1 ? 0.5 : index / (count - 1);
  switch (score.eyeLayout) {
    case 0: {
      const angle = index / count * Math.PI * 2 + elapsed * 0.055 * (score.motion % 2 ? 1 : -1);
      const orbit = base * (0.15 + Math.min(count, 8) * 0.014);
      return { x: Math.cos(angle) * orbit, y: Math.sin(angle) * orbit, angle, scale: 1 };
    }
    case 1: {
      const columns = Math.min(6, count);
      const row = Math.floor(index / columns);
      const column = index % columns;
      const rowCount = Math.ceil(count / columns);
      return {
        x: (column - (Math.min(columns, count - row * columns) - 1) / 2) * base * 0.13,
        y: (row - (rowCount - 1) / 2) * base * 0.13,
        angle: 0,
        scale: 0.9,
      };
    }
    case 2: {
      const angle = index * 2.399 + elapsed * 0.025;
      const orbit = base * (0.04 + ratio * 0.28);
      return { x: Math.cos(angle) * orbit, y: Math.sin(angle) * orbit, angle: angle + Math.PI / 2, scale: 0.72 + ratio * 0.34 };
    }
    case 3: {
      const angle = Math.PI + ratio * Math.PI;
      return { x: Math.cos(angle) * base * 0.31, y: Math.sin(angle) * base * 0.31, angle: angle + Math.PI / 2, scale: 0.82 + Math.sin(ratio * Math.PI) * 0.28 };
    }
    case 4: {
      const columns = Math.ceil(Math.sqrt(count));
      const rows = Math.ceil(count / columns);
      const column = index % columns;
      const row = Math.floor(index / columns);
      return {
        x: (column - (columns - 1) / 2) * base * 0.13,
        y: (row - (rows - 1) / 2) * base * 0.13,
        angle: (column - row) * 0.12,
        scale: 0.78 + ((index * 3) % 4) * 0.08,
      };
    }
    case 5:
      return { x: Math.sin(index * 1.7) * base * 0.08, y: (ratio - 0.5) * base * 0.58, angle: index % 2 ? 0.12 : -0.12, scale: 0.72 + (index % 3) * 0.13 };
    default:
      return { x: 0, y: 0, angle: 0, scale: 1 };
  }
}

function drawIris(ctx, score, eye, size, elapsed) {
  const hue = wrapHue(score.irisHue + eye * score.irisShift);
  const secondHue = wrapHue(hue + score.hueShift);
  const baseGazeAngle = score.gaze / 8 * Math.PI * 2 + Math.sin(elapsed * 0.32 + eye) * 0.16;
  const attention = Math.min(1, interaction.hold * 0.92 + interaction.tap * 0.75);
  const pointerAngle = Math.atan2(interaction.smoothY, interaction.smoothX);
  const pointerReach = Math.min(1.5, 0.45 + Math.hypot(interaction.smoothX, interaction.smoothY));
  const x = (Math.cos(baseGazeAngle) * (1 - attention) + Math.cos(pointerAngle) * pointerReach * attention) * size * 0.32;
  const y = (Math.sin(baseGazeAngle) * (1 - attention) + Math.sin(pointerAngle) * pointerReach * attention) * size * 0.22;
  const radius = size * (0.48 + (eye % 3) * 0.055);
  const gradient = ctx.createRadialGradient(x - radius * 0.18, y - radius * 0.2, radius * 0.08, x, y, radius);
  gradient.addColorStop(0, `hsl(${secondHue} 100% 88%)`);
  gradient.addColorStop(0.3, `hsl(${hue} 94% 58%)`);
  gradient.addColorStop(1, `hsl(${wrapHue(hue - 35)} 82% 22%)`);
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fill();

  ctx.save();
  ctx.translate(x, y);
  ctx.lineWidth = Math.max(0.7, size * 0.07);
  ctx.strokeStyle = `hsla(${secondHue} 100% 84% / 0.72)`;
  ctx.fillStyle = `hsla(${secondHue} 100% 72% / 0.52)`;

  if (score.irisStyle === 1 || score.irisStyle === 5) {
    const rings = score.irisStyle === 1 ? 3 : 5;
    for (let ring = 1; ring <= rings; ring += 1) {
      ctx.beginPath();
      ctx.arc(0, 0, radius * ring / (rings + 1), 0, Math.PI * 2);
      ctx.stroke();
    }
  } else if (score.irisStyle === 2 || score.irisStyle === 6) {
    const spokes = score.irisStyle === 2 ? 8 : 16;
    for (let spoke = 0; spoke < spokes; spoke += 1) {
      const angle = spoke / spokes * Math.PI * 2 + elapsed * 0.04 + interaction.morphPhase * 0.5;
      ctx.beginPath();
      ctx.moveTo(Math.cos(angle) * radius * 0.22, Math.sin(angle) * radius * 0.22);
      ctx.lineTo(Math.cos(angle) * radius * 0.9, Math.sin(angle) * radius * 0.9);
      ctx.stroke();
    }
  } else if (score.irisStyle === 3) {
    for (let dot = 0; dot < 7; dot += 1) {
      const angle = dot / 7 * Math.PI * 2 + eye + interaction.morphPhase * 0.3;
      ctx.beginPath();
      ctx.arc(Math.cos(angle) * radius * 0.64, Math.sin(angle) * radius * 0.64, radius * 0.09, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (score.irisStyle === 4) {
    ctx.fillStyle = `hsla(${secondHue} 100% 66% / 0.62)`;
    ctx.beginPath();
    ctx.arc(0, 0, radius * 0.88, -Math.PI / 2, Math.PI / 2);
    ctx.lineTo(0, 0);
    ctx.closePath();
    ctx.fill();
  } else if (score.irisStyle === 7) {
    ctx.strokeStyle = `hsl(${secondHue} 100% 74%)`;
    ctx.lineWidth = Math.max(1, size * 0.12);
    ctx.beginPath();
    ctx.arc(0, 0, radius * 0.76, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.restore();

  const pupilScale = Math.max(0.65, Math.min(1.42, 1 + interaction.tap * 0.36 - interaction.hold * 0.22 + interaction.dragSpeed * 0.25));
  ctx.fillStyle = `hsl(${wrapHue(hue + 180)} 36% 5%)`;
  tracePupil(ctx, score.pupilShape, x, y, radius * pupilScale);
  ctx.fill("evenodd");
}

function drawEye(ctx, score, eye, base, elapsed, colors) {
  const placement = eyePlacement(score, eye, score.eyes, base, elapsed + interaction.morphPhase * 0.6);
  const crowding = 1 - Math.max(0, score.eyes - 7) * 0.025;
  const size = Math.max(4, base * (0.022 + score.eyeSize / 2450) * placement.scale * crowding);
  ctx.save();
  ctx.translate(placement.x, placement.y);
  ctx.rotate(placement.angle);
  ctx.shadowBlur = size * 0.35;
  ctx.shadowColor = `hsla(${score.irisHue} 100% 72% / 0.55)`;
  traceEyeShape(ctx, score.eyeShape, size);
  ctx.fillStyle = `hsl(${wrapHue(colors[2] + 20)} 34% 92%)`;
  ctx.fill();
  ctx.save();
  traceEyeShape(ctx, score.eyeShape, size);
  ctx.clip();
  drawIris(ctx, score, eye, size, elapsed);
  ctx.restore();
  traceEyeShape(ctx, score.eyeShape, size);
  ctx.lineWidth = Math.max(0.8, size * 0.11);
  ctx.strokeStyle = `hsl(${colors[0]} 70% 8%)`;
  ctx.stroke();
  ctx.restore();
}

function buildMycelialNetwork(score) {
  const random = mulberry32(score.seed ^ 0x3f5c7a19);
  const rootCount = Math.max(7, Math.min(18, Math.round(6 + score.fungalHyphae / 7.5)));
  const branches = [];
  const nodes = [];

  for (let r = 0; r < rootCount; r += 1) {
    const angle = ((r + (random() - 0.5) * 0.35) / rootCount) * Math.PI * 2;
    const normRad = shapeRadius(score, angle, 0);
    const startX = Math.cos(angle) * normRad * 0.94;
    const startY = Math.sin(angle) * normRad * 0.94;
    let heading = angle + (random() - 0.5) * 0.42;

    const mainSteps = 5 + Math.floor(random() * 5);
    const mainPoints = [{ x: startX, y: startY, dist: 0, depth: 0 }];
    let cx = startX;
    let cy = startY;
    let totalDist = 0;

    for (let s = 1; s <= mainSteps; s += 1) {
      const stepLen = 0.12 + random() * 0.16;
      heading += (random() - 0.5) * 0.46;
      cx += Math.cos(heading) * stepLen;
      cy += Math.sin(heading) * stepLen;
      totalDist += stepLen;
      const pt = { x: cx, y: cy, dist: totalDist, depth: 0 };
      mainPoints.push(pt);
      nodes.push({ x: cx, y: cy, angle: heading, dist: totalDist, mainBranch: r });

      if (s >= 2 && random() < 0.52) {
        const forkAngle = heading + (random() > 0.5 ? 1 : -1) * (0.42 + random() * 0.44);
        const subSteps = 3 + Math.floor(random() * 3);
        const subPoints = [{ x: cx, y: cy, dist: totalDist, depth: 1 }];
        let scx = cx;
        let scy = cy;
        let subDist = totalDist;
        let subHeading = forkAngle;

        for (let ss = 1; ss <= subSteps; ss += 1) {
          const subLen = 0.08 + random() * 0.12;
          subHeading += (random() - 0.5) * 0.42;
          scx += Math.cos(subHeading) * subLen;
          scy += Math.sin(subHeading) * subLen;
          subDist += subLen;
          const subPt = { x: scx, y: scy, dist: subDist, depth: 1 };
          subPoints.push(subPt);
          nodes.push({ x: scx, y: scy, angle: subHeading, dist: subDist, mainBranch: r });
        }
        branches.push({ points: subPoints, maxDist: subDist, rootIndex: r });
      }
    }
    branches.push({ points: mainPoints, maxDist: totalDist, rootIndex: r });
  }

  const bridges = [];
  for (let i = 0; i < nodes.length; i += 3) {
    for (let j = i + 1; j < nodes.length; j += 4) {
      if (nodes[i].mainBranch !== nodes[j].mainBranch) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const dist = Math.hypot(dx, dy);
        if (dist > 0.14 && dist < 0.32) {
          bridges.push({
            from: nodes[i],
            to: nodes[j],
            midX: (nodes[i].x + nodes[j].x) * 0.5 + (random() - 0.5) * 0.08,
            midY: (nodes[i].y + nodes[j].y) * 0.5 + (random() - 0.5) * 0.08,
            dist: Math.max(nodes[i].dist, nodes[j].dist),
          });
          break;
        }
      }
    }
  }

  return { branches, nodes, bridges };
}

function buildFruitingBodies(score, mycelium) {
  const random = mulberry32(score.seed ^ 0x6e91b4c3);
  const bodyCount = 3 + (score.symmetry % 4) + Math.floor(score.fungalBloom / 28);
  const fruitingBodies = [];

  const candidates = mycelium.nodes.filter((node) => {
    const r = Math.hypot(node.x, node.y);
    return r >= 0.55 && r <= 1.45;
  });

  if (candidates.length === 0) {
    for (let i = 0; i < bodyCount; i += 1) {
      const a = (i / bodyCount) * Math.PI * 2;
      const r = shapeRadius(score, a, 0);
      candidates.push({ x: Math.cos(a) * r, y: Math.sin(a) * r, angle: a });
    }
  }

  candidates.sort((a, b) => Math.atan2(a.y, a.x) - Math.atan2(b.y, b.x));
  const step = Math.max(1, Math.floor(candidates.length / bodyCount));

  for (let i = 0; i < bodyCount && i * step < candidates.length; i += 1) {
    const node = candidates[i * step];
    const outAngle = Math.atan2(node.y, node.x);
    fruitingBodies.push({
      id: i,
      x: node.x,
      y: node.y,
      angle: outAngle,
      tilt: (random() - 0.5) * 0.45,
      curve: (random() - 0.5) * 0.35,
      size: (0.16 + (score.fungalBloom / 100) * 0.22) * (0.8 + random() * 0.4),
      archetype: score.fungalForm,
      gills: 12 + Math.floor(random() * 16),
      rings: 3 + Math.floor(random() * 4),
      sproutDelay: 0.08 + (i / bodyCount) * 0.32,
    });
  }

  return fruitingBodies;
}

function buildSporeSystem(score, fruitingBodies) {
  const random = mulberry32(score.seed ^ 0x184d82f7);
  const count = 36 + Math.floor(score.fungalSpores * 0.5);
  return Array.from({ length: count }, (_, idx) => {
    const fb = fruitingBodies[idx % (fruitingBodies.length || 1)] || { x: 0, y: 0, angle: 0 };
    return {
      x: fb.x + (random() - 0.5) * 0.15,
      y: fb.y + (random() - 0.5) * 0.15,
      vx: (random() - 0.5) * 0.2,
      vy: -0.15 - random() * 0.25,
      life: random(),
      maxLife: 2.5 + random() * 3.5,
      size: 0.9 + random() * (1.1 + score.fungalSpores / 70),
      hueOffset: (random() - 0.5) * 45,
      fbIndex: idx % (fruitingBodies.length || 1),
    };
  });
}

function drawMycelium(ctx, score, mycelium, base, growth, elapsed, colors) {
  if (!mycelium || growth <= 0.01) return;

  ctx.save();
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  const pulseRate = 0.8 + score.kineticSpeed / 120;
  const holdBoost = interaction.hold * 0.45;
  const tapBoost = interaction.tap * 0.35;

  for (let b = 0; b < mycelium.branches.length; b += 1) {
    const branch = mycelium.branches[b];
    const targetDist = growth * branch.maxDist * 1.15;
    const pts = branch.points;
    if (pts.length < 2 || targetDist < pts[0].dist) continue;

    const isSub = pts[0].depth > 0;
    const baseWidth = isSub ? 0.75 : 1.35;
    ctx.lineWidth = baseWidth * (1 + holdBoost * 0.6);

    ctx.beginPath();
    ctx.moveTo(pts[0].x * base, pts[0].y * base);

    let activeTip = null;
    for (let p = 1; p < pts.length; p += 1) {
      if (pts[p].dist <= targetDist) {
        ctx.lineTo(pts[p].x * base, pts[p].y * base);
        if (p === pts.length - 1 || pts[p + 1].dist > targetDist) {
          activeTip = pts[p];
        }
      } else {
        const prev = pts[p - 1];
        const span = pts[p].dist - prev.dist;
        const frac = span > 0.0001 ? (targetDist - prev.dist) / span : 0;
        const tipX = prev.x + (pts[p].x - prev.x) * frac;
        const tipY = prev.y + (pts[p].y - prev.y) * frac;
        ctx.lineTo(tipX * base, tipY * base);
        activeTip = { x: tipX, y: tipY, dist: targetDist };
        break;
      }
    }

    const travelingPulse = Math.sin(branch.maxDist * 10 - elapsed * 4.5 * pulseRate + b) * 0.28 + 0.72;
    const alpha = (isSub ? 0.42 : 0.65) * travelingPulse * (0.7 + holdBoost + tapBoost);
    ctx.strokeStyle = `hsla(${colors[1]} ${score.saturation}% ${72 + holdBoost * 18}% / ${Math.min(0.95, alpha)})`;
    ctx.stroke();

    if (activeTip && (growth < 0.98 || holdBoost > 0.05)) {
      ctx.fillStyle = `hsla(${colors[2]} 100% 86% / ${0.75 + holdBoost * 0.25})`;
      ctx.beginPath();
      ctx.arc(activeTip.x * base, activeTip.y * base, (baseWidth * 1.4 + holdBoost * 1.5), 0, Math.PI * 2);
      ctx.fill();
    }
  }

  for (const bridge of mycelium.bridges) {
    if (growth * 1.15 >= bridge.dist) {
      const bridgeAlpha = 0.38 * (0.6 + holdBoost);
      ctx.strokeStyle = `hsla(${colors[0]} ${score.saturation}% 74% / ${bridgeAlpha})`;
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.moveTo(bridge.from.x * base, bridge.from.y * base);
      ctx.quadraticCurveTo(bridge.midX * base, bridge.midY * base, bridge.to.x * base, bridge.to.y * base);
      ctx.stroke();
    }
  }

  ctx.restore();
}

function drawAgaricCap(ctx, score, fb, maturity, elapsed, colors) {
  const stipeLen = 50 * maturity;
  const capW = 38 * maturity;
  const capH = 22 * maturity;
  const curve = fb.curve * 20;

  ctx.strokeStyle = `hsla(${colors[1]} 45% 78% / 0.85)`;
  ctx.lineWidth = Math.max(1.8, 4.2 * maturity);
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.quadraticCurveTo(curve, stipeLen * 0.5, curve * 0.4, stipeLen);
  ctx.stroke();

  // Haeckel partial veil annulus skirt on stipe
  if (maturity > 0.45) {
    ctx.strokeStyle = `hsla(${colors[2]} 85% 82% / 0.9)`;
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.ellipse(curve * 0.7, stipeLen * 0.52, 6 * maturity, 2.5 * maturity, 0.2, 0, Math.PI * 2);
    ctx.stroke();

    // Fine lace edging on veil
    ctx.fillStyle = `hsla(${colors[2]} 95% 90% / 0.75)`;
    for (let v = -2; v <= 2; v += 1) {
      ctx.beginPath();
      ctx.arc(curve * 0.7 + v * 2.2 * maturity, stipeLen * 0.52 + 2, 0.9, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  ctx.save();
  ctx.translate(curve * 0.4, stipeLen);

  // Radiating lamellae (gills) with alternating secondary lamellulae
  if (maturity > 0.3) {
    ctx.strokeStyle = `hsla(${colors[2]} 90% 75% / 0.55)`;
    ctx.lineWidth = 0.8;
    const gillCount = Math.max(7, fb.gills * 2);
    for (let g = 0; g < gillCount; g += 1) {
      const gx = (-capW * 0.48) + (g / (gillCount - 1)) * (capW * 0.96);
      const gy = Math.sin((g / (gillCount - 1)) * Math.PI) * 4;
      const isSecondary = g % 2 === 1;
      ctx.beginPath();
      ctx.moveTo(isSecondary ? gx * 0.45 : 0, isSecondary ? -capH * 0.2 : 0);
      ctx.lineTo(gx, gy);
      ctx.stroke();
    }
  }

  const capGrad = ctx.createLinearGradient(0, -capH, 0, 4);
  capGrad.addColorStop(0, `hsla(${colors[0]} ${score.saturation}% 52% / 0.92)`);
  capGrad.addColorStop(0.7, `hsla(${colors[1]} ${score.saturation}% 65% / 0.85)`);
  capGrad.addColorStop(1, `hsla(${colors[2]} 100% 80% / 0.95)`);
  ctx.fillStyle = capGrad;
  ctx.strokeStyle = `hsla(${colors[2]} 100% 88% / 0.9)`;
  ctx.lineWidth = 1.2;

  ctx.beginPath();
  ctx.moveTo(-capW * 0.5, 2);
  ctx.bezierCurveTo(-capW * 0.5, -capH, capW * 0.5, -capH, capW * 0.5, 2);
  ctx.quadraticCurveTo(0, 5, -capW * 0.5, 2);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Marginal veil teeth
  ctx.fillStyle = `hsla(${colors[2]} 100% 90% / 0.92)`;
  for (let d = -2; d <= 2; d += 1) {
    ctx.beginPath();
    ctx.arc(d * (capW * 0.2), 3, 1.2, 0, Math.PI * 2);
    ctx.fill();
  }

  // Ernst Haeckel-style stippled universal veil scales (verrucae) across pileus
  if (maturity > 0.45) {
    ctx.fillStyle = `hsla(${colors[2]} 95% 88% / 0.8)`;
    const scales = [
      [0, -capH * 0.8, 1.6],
      [-capW * 0.22, -capH * 0.6, 1.3],
      [capW * 0.22, -capH * 0.6, 1.3],
      [-capW * 0.35, -capH * 0.25, 1.1],
      [capW * 0.35, -capH * 0.25, 1.1],
      [-capW * 0.12, -capH * 0.35, 1.2],
      [capW * 0.12, -capH * 0.35, 1.2],
    ];
    for (const [sx, sy, sr] of scales) {
      ctx.beginPath();
      ctx.arc(sx, sy, sr * maturity, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  ctx.restore();
}

function drawBracketConk(ctx, score, fb, maturity, elapsed, colors) {
  const conkW = 44 * maturity;
  const conkH = 26 * maturity;
  const tiers = Math.max(3, fb.rings);

  for (let t = tiers; t >= 1; t -= 1) {
    const frac = t / tiers;
    const tw = conkW * frac;
    const th = conkH * frac;
    const hueIdx = t % colors.length;

    ctx.fillStyle = `hsla(${colors[hueIdx]} ${Math.max(30, score.saturation - t * 8)}% ${35 + t * 9}% / ${0.72 + t * 0.05})`;
    ctx.strokeStyle = `hsla(${colors[2]} 100% ${76 + t * 4}% / 0.8)`;
    ctx.lineWidth = 1.0;

    ctx.beginPath();
    ctx.moveTo(-tw * 0.5, 0);
    ctx.bezierCurveTo(-tw * 0.55, th * 0.8, tw * 0.55, th * 0.8, tw * 0.5, 0);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Haeckel concentric annular sulcus lines (growth zones)
    if (maturity > 0.35) {
      ctx.strokeStyle = `hsla(${colors[2]} 85% 90% / 0.45)`;
      ctx.lineWidth = 0.65;
      ctx.beginPath();
      ctx.moveTo(-tw * 0.4, th * 0.3);
      ctx.quadraticCurveTo(0, th * 0.65, tw * 0.4, th * 0.3);
      ctx.stroke();
    }
  }

  // Ventral pore hymenium micro-stippling
  if (maturity > 0.4) {
    ctx.fillStyle = `hsla(${colors[2]} 90% 85% / 0.75)`;
    for (let p = -5; p <= 5; p += 1) {
      const px = p * (conkW * 0.08);
      const py = conkH * 0.72 - Math.abs(p) * 1.4;
      ctx.beginPath();
      ctx.arc(px, py, 0.9, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

function drawCoralClavaria(ctx, score, fb, maturity, elapsed, colors) {
  const height = 48 * maturity;
  ctx.lineCap = "round";

  function branch(x, y, len, angle, depth) {
    if (depth > 3 || len < 4) return;
    const endX = x + Math.cos(angle) * len;
    const endY = y + Math.sin(angle) * len;

    ctx.strokeStyle = `hsla(${colors[depth % colors.length]} ${score.saturation}% ${58 + depth * 10}% / ${0.7 + depth * 0.08})`;
    ctx.lineWidth = Math.max(0.8, (4 - depth) * 1.1 * maturity);
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(endX, endY);
    ctx.stroke();

    // Haeckel longitudinal striations along antler trunk
    if (depth <= 1 && maturity > 0.4) {
      ctx.strokeStyle = `hsla(${colors[2]} 90% 88% / 0.4)`;
      ctx.lineWidth = 0.6;
      ctx.beginPath();
      ctx.moveTo(x + 1, y);
      ctx.lineTo(endX + 1, endY);
      ctx.stroke();
    }

    if (depth === 3) {
      ctx.fillStyle = `hsla(${colors[2]} 100% 86% / 0.95)`;
      ctx.beginPath();
      ctx.arc(endX, endY, 1.6, 0, Math.PI * 2);
      ctx.fill();
    } else {
      const spread = 0.32 + Math.sin(elapsed * 2 + depth) * 0.05;
      branch(endX, endY, len * 0.72, angle - spread, depth + 1);
      branch(endX, endY, len * 0.72, angle + spread, depth + 1);
    }
  }

  branch(0, 0, height * 0.42, Math.PI * 0.5, 0);
}

function drawBioluminescentBonnet(ctx, score, fb, maturity, elapsed, colors) {
  const stipeLen = 56 * maturity;
  const bonnetW = 28 * maturity;
  const bonnetH = 26 * maturity;
  const sway = Math.sin(elapsed * 2.8 + fb.id) * 6;

  ctx.strokeStyle = `hsla(${colors[1]} 60% 82% / 0.78)`;
  ctx.lineWidth = Math.max(1.0, 2.4 * maturity);
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.quadraticCurveTo(fb.curve * 28 + sway, stipeLen * 0.5, sway * 1.2, stipeLen);
  ctx.stroke();

  ctx.save();
  ctx.translate(sway * 1.2, stipeLen);

  const bellGrad = ctx.createRadialGradient(0, -bonnetH * 0.5, 2, 0, -bonnetH * 0.5, bonnetW);
  bellGrad.addColorStop(0, `hsla(${colors[2]} 100% 82% / 0.95)`);
  bellGrad.addColorStop(0.6, `hsla(${colors[1]} ${score.saturation}% 60% / 0.65)`);
  bellGrad.addColorStop(1, `hsla(${colors[0]} ${score.saturation}% 45% / 0.35)`);

  ctx.fillStyle = bellGrad;
  ctx.strokeStyle = `hsla(${colors[2]} 100% 88% / 0.95)`;
  ctx.lineWidth = 1.1;

  ctx.beginPath();
  ctx.moveTo(-bonnetW * 0.5, 0);
  ctx.quadraticCurveTo(-bonnetW * 0.35, -bonnetH, 0, -bonnetH);
  ctx.quadraticCurveTo(bonnetW * 0.35, -bonnetH, bonnetW * 0.5, 0);
  ctx.quadraticCurveTo(0, 4, -bonnetW * 0.5, 0);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Haeckel pleated-striate radial ribs from disc to margin
  ctx.strokeStyle = `hsla(${colors[2]} 100% 84% / 0.55)`;
  ctx.lineWidth = 0.75;
  for (let r = -4; r <= 4; r += 1) {
    const rx = r * (bonnetW * 0.11);
    ctx.beginPath();
    ctx.moveTo(rx, 0);
    ctx.quadraticCurveTo(rx * 0.35, -bonnetH * 0.75, 0, -bonnetH);
    ctx.stroke();
  }

  // Apical papilla / dewdrop jewel
  ctx.fillStyle = `hsla(${colors[2]} 100% 96% / 0.95)`;
  ctx.beginPath();
  ctx.arc(0, -bonnetH - 1.2, 1.8, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

function drawCupPeziza(ctx, score, fb, maturity, elapsed, colors) {
  const cupW = 36 * maturity;
  const cupH = 24 * maturity;

  ctx.fillStyle = `hsla(${colors[1]} 50% 45% / 0.85)`;
  ctx.beginPath();
  ctx.moveTo(-4 * maturity, 0);
  ctx.lineTo(4 * maturity, 0);
  ctx.lineTo(6 * maturity, 8 * maturity);
  ctx.lineTo(-6 * maturity, 8 * maturity);
  ctx.closePath();
  ctx.fill();

  ctx.save();
  ctx.translate(0, 8 * maturity);

  ctx.fillStyle = `hsla(${colors[0]} ${score.saturation}% 42% / 0.9)`;
  ctx.strokeStyle = `hsla(${colors[2]} 90% 78% / 0.85)`;
  ctx.lineWidth = 1.2;

  ctx.beginPath();
  ctx.moveTo(-cupW * 0.5, 0);
  ctx.bezierCurveTo(-cupW * 0.55, cupH, cupW * 0.55, cupH, cupW * 0.5, 0);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  const discGrad = ctx.createRadialGradient(0, cupH * 0.35, 1, 0, cupH * 0.35, cupW * 0.45);
  discGrad.addColorStop(0, `hsla(${colors[2]} 100% 78% / 0.95)`);
  discGrad.addColorStop(0.7, `hsla(${colors[1]} ${score.saturation}% 55% / 0.8)`);
  discGrad.addColorStop(1, `hsla(${colors[0]} ${score.saturation}% 35% / 0.7)`);
  ctx.fillStyle = discGrad;

  ctx.beginPath();
  ctx.ellipse(0, 3, cupW * 0.48, cupH * 0.28, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = `hsla(${colors[2]} 100% 86% / 0.9)`;
  ctx.lineWidth = 0.9;
  ctx.stroke();

  // Haeckel fimbriate eyelash fringe around cup margin
  ctx.fillStyle = `hsla(${colors[2]} 100% 90% / 0.9)`;
  for (let b = 0; b < 14; b += 1) {
    const bAngle = (b / 14) * Math.PI * 2;
    const bx = Math.cos(bAngle) * cupW * 0.48;
    const by = 3 + Math.sin(bAngle) * cupH * 0.28;
    ctx.beginPath();
    ctx.arc(bx, by, 1.1, 0, Math.PI * 2);
    ctx.fill();
  }

  // Radial hymenial spore folds
  if (maturity > 0.45) {
    ctx.strokeStyle = `hsla(${colors[2]} 90% 82% / 0.45)`;
    ctx.lineWidth = 0.7;
    for (let f = 0; f < 8; f += 1) {
      const fAngle = (f / 8) * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(0, 3);
      ctx.lineTo(Math.cos(fAngle) * cupW * 0.4, 3 + Math.sin(fAngle) * cupH * 0.22);
      ctx.stroke();
    }
  }

  ctx.restore();
}

function drawMorelHoneycomb(ctx, score, fb, maturity, elapsed, colors) {
  const headW = 30 * maturity;
  const headH = 50 * maturity;
  const stipeLen = 18 * maturity;

  ctx.fillStyle = `hsla(${colors[1]} 30% 75% / 0.85)`;
  ctx.strokeStyle = `hsla(${colors[1]} 40% 60% / 0.75)`;
  ctx.lineWidth = 1.0;
  ctx.beginPath();
  ctx.rect(-headW * 0.28, 0, headW * 0.56, stipeLen);
  ctx.fill();
  ctx.stroke();

  ctx.save();
  ctx.translate(0, stipeLen);

  ctx.fillStyle = `hsla(${colors[0]} ${score.saturation}% 25% / 0.95)`;
  ctx.beginPath();
  ctx.moveTo(-headW * 0.5, 0);
  ctx.bezierCurveTo(-headW * 0.6, headH * 0.5, -headW * 0.2, headH, 0, headH);
  ctx.bezierCurveTo(headW * 0.2, headH, headW * 0.6, headH * 0.5, headW * 0.5, 0);
  ctx.closePath();
  ctx.fill();

  ctx.strokeStyle = `hsla(${colors[2]} 90% 76% / 0.85)`;
  ctx.lineWidth = 1.1;
  const rows = 5;
  const cols = 4;
  for (let r = 0; r < rows; r += 1) {
    const yFrac = r / rows;
    const ry = yFrac * headH * 0.9 + 3;
    const rw = headW * (1 - yFrac * 0.5);
    for (let c = 0; c < cols; c += 1) {
      const rx = (-rw * 0.5) + (c / (cols - 1)) * rw;
      ctx.beginPath();
      ctx.ellipse(rx, ry, rw * 0.16, headH * 0.08, (c % 2 ? 0.2 : -0.2), 0, Math.PI * 2);
      ctx.stroke();

      // Haeckel inner scalariform chamber ridge
      if (maturity > 0.4) {
        ctx.strokeStyle = `hsla(${colors[2]} 85% 88% / 0.45)`;
        ctx.lineWidth = 0.6;
        ctx.beginPath();
        ctx.ellipse(rx, ry, rw * 0.09, headH * 0.045, (c % 2 ? 0.2 : -0.2), 0, Math.PI * 2);
        ctx.stroke();
        ctx.strokeStyle = `hsla(${colors[2]} 90% 76% / 0.85)`;
        ctx.lineWidth = 1.1;
      }
    }
  }
  ctx.restore();
}

function drawGlobularPuffball(ctx, score, fb, maturity, elapsed, colors) {
  const rad = 24 * maturity;
  const ostioleRad = 3.5 * maturity;

  const bulbGrad = ctx.createRadialGradient(-rad * 0.25, rad * 0.3, 1, 0, rad * 0.5, rad * 1.1);
  bulbGrad.addColorStop(0, `hsla(${colors[2]} 80% 86% / 0.95)`);
  bulbGrad.addColorStop(0.5, `hsla(${colors[1]} ${score.saturation}% 62% / 0.85)`);
  bulbGrad.addColorStop(1, `hsla(${colors[0]} ${score.saturation}% 38% / 0.9)`);

  ctx.fillStyle = bulbGrad;
  ctx.strokeStyle = `hsla(${colors[2]} 90% 82% / 0.8)`;
  ctx.lineWidth = 1.2;

  ctx.beginPath();
  ctx.arc(0, rad, rad, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Haeckel pyramidal peridial scales / verrucae
  ctx.fillStyle = `hsla(${colors[2]} 100% 92% / 0.85)`;
  for (let w = 0; w < 16; w += 1) {
    const wAngle = (w / 16) * Math.PI * 2 + fb.id;
    const wx = Math.cos(wAngle) * rad * 0.78;
    const wy = rad + Math.sin(wAngle) * rad * 0.78;
    ctx.beginPath();
    ctx.arc(wx, wy, 1.2, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.fillStyle = `hsla(${colors[0]} 70% 12% / 0.95)`;
  ctx.strokeStyle = `hsla(${colors[2]} 100% 88% / 0.95)`;
  ctx.lineWidth = 1.3;
  ctx.beginPath();
  ctx.ellipse(0, rad * 2, ostioleRad, ostioleRad * 0.6, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  const puffPhase = (elapsed * 2.5 + fb.id) % 1;
  const puffY = rad * 2 + puffPhase * 16 * maturity;
  const puffAlpha = (1 - puffPhase) * 0.65;
  ctx.fillStyle = `hsla(${colors[2]} 90% 85% / ${puffAlpha})`;
  ctx.beginPath();
  ctx.arc(0, puffY, 2 + puffPhase * 5, 0, Math.PI * 2);
  ctx.fill();
}

function drawHyphalHydra(ctx, score, fb, maturity, elapsed, colors) {
  const stalkCount = 3 + (fb.id % 3);
  const stalkLen = 42 * maturity;

  for (let s = 0; s < stalkCount; s += 1) {
    const sFrac = (s / (stalkCount - 1 || 1)) - 0.5;
    const sAngle = Math.PI * 0.5 + sFrac * 0.85;
    const sway = Math.sin(elapsed * 2.4 + s + fb.id) * 4;
    const endX = Math.cos(sAngle) * stalkLen + sway;
    const endY = Math.sin(sAngle) * stalkLen;

    ctx.strokeStyle = `hsla(${colors[1]} 65% 75% / 0.8)`;
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.quadraticCurveTo(endX * 0.4, endY * 0.5 + sway, endX, endY);
    ctx.stroke();

    ctx.save();
    ctx.translate(endX, endY);
    ctx.fillStyle = `hsla(${colors[0]} ${score.saturation}% 48% / 0.92)`;
    ctx.strokeStyle = `hsla(${colors[2]} 100% 84% / 0.9)`;
    ctx.lineWidth = 1.0;
    ctx.beginPath();
    ctx.ellipse(0, 0, 5 * maturity, 8 * maturity, sFrac * 0.4, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = `hsla(${colors[2]} 100% 92% / 0.95)`;
    ctx.fillRect(-1, -4 * maturity, 2, 8 * maturity);

    // Pendant aculei / spine rows
    if (maturity > 0.4) {
      ctx.strokeStyle = `hsla(${colors[2]} 90% 85% / 0.55)`;
      ctx.lineWidth = 0.7;
      for (let tooth = -2; tooth <= 2; tooth += 1) {
        ctx.beginPath();
        ctx.moveTo(tooth * 2, 8 * maturity);
        ctx.lineTo(tooth * 2, 12 * maturity);
        ctx.stroke();
      }
    }

    ctx.strokeStyle = `hsla(${colors[2]} 90% 82% / 0.45)`;
    ctx.lineWidth = 0.7;
    ctx.beginPath();
    ctx.moveTo(0, 7 * maturity);
    ctx.quadraticCurveTo(sway * 0.8, 14 * maturity, sway * 1.5, 20 * maturity);
    ctx.stroke();
    ctx.restore();
  }
}

function drawFruitingBodies(ctx, score, fruitingBodies, base, growth, elapsed, colors) {
  if (!fruitingBodies || growth <= 0.05) return;

  for (const fb of fruitingBodies) {
    const maturity = Math.max(0, Math.min(1, (growth - fb.sproutDelay) / (1 - fb.sproutDelay)));
    if (maturity <= 0.01) continue;

    const currentScale = fb.size * (0.2 + 0.8 * maturity);
    const anchorX = fb.x * base;
    const anchorY = fb.y * base;
    const breathing = Math.sin(elapsed * 2.2 + fb.id * 1.7) * (0.04 + interaction.hold * 0.06);
    const currentAngle = fb.angle + fb.tilt + breathing;

    ctx.save();
    ctx.translate(anchorX, anchorY);
    ctx.rotate(currentAngle);
    ctx.scale(currentScale, currentScale);

    switch (fb.archetype) {
      case 0: drawAgaricCap(ctx, score, fb, maturity, elapsed, colors); break;
      case 1: drawBracketConk(ctx, score, fb, maturity, elapsed, colors); break;
      case 2: drawCoralClavaria(ctx, score, fb, maturity, elapsed, colors); break;
      case 3: drawBioluminescentBonnet(ctx, score, fb, maturity, elapsed, colors); break;
      case 4: drawCupPeziza(ctx, score, fb, maturity, elapsed, colors); break;
      case 5: drawMorelHoneycomb(ctx, score, fb, maturity, elapsed, colors); break;
      case 6: drawGlobularPuffball(ctx, score, fb, maturity, elapsed, colors); break;
      case 7: drawHyphalHydra(ctx, score, fb, maturity, elapsed, colors); break;
      default: drawAgaricCap(ctx, score, fb, maturity, elapsed, colors); break;
    }
    ctx.restore();
  }
}

function stepInteraction(timestamp, reducedMotion) {
  const dt = interaction.lastFrameAt ? Math.min(0.06, (timestamp - interaction.lastFrameAt) / 1000) : 0.016;
  interaction.lastFrameAt = timestamp;
  const targetHold = interaction.active ? 1 : 0;
  interaction.hold += (targetHold - interaction.hold) * Math.min(1, dt * (interaction.active ? 4.2 : 2.8));
  interaction.tap *= Math.exp(-dt * 3.8);
  interaction.dragSpeed *= Math.exp(-dt * 6.0);
  const followRate = Math.min(1, dt * (interaction.active ? 9.5 : 3.6));
  const targetX = interaction.active ? interaction.x : 0;
  const targetY = interaction.active ? interaction.y : 0;
  interaction.smoothX += (targetX - interaction.smoothX) * followRate;
  interaction.smoothY += (targetY - interaction.smoothY) * followRate;
  if (!reducedMotion) {
    interaction.morphPhase += dt * (interaction.hold * 2.2 + interaction.dragSpeed * 4.8 + interaction.tap * 1.9);
  }
  const targetPitch = interaction.active
    ? -interaction.smoothY
    : interaction.tap * 0.25;
  interaction.pitchBend += (targetPitch - interaction.pitchBend) * Math.min(1, dt * 6.5);
  interaction.ripples = interaction.ripples.filter((ripple) => (timestamp - ripple.bornAt) < 920);
  updateAudioInteraction();
}

function buildGlassCondensation(seed) {
  const rng = mulberry32((seed ^ 0x91a55c01) >>> 0);
  const drops = [];
  // Left curved vitrine wall
  for (let i = 0; i < 16; i += 1) {
    drops.push({
      normX: 0.035 + rng() * 0.08,
      normY: 0.16 + rng() * 0.70,
      size: 0.8 + rng() * 1.8,
      alpha: 0.22 + rng() * 0.45,
      phase: rng() * Math.PI * 2,
    });
  }
  // Right curved vitrine wall
  for (let i = 0; i < 16; i += 1) {
    drops.push({
      normX: 0.885 + rng() * 0.08,
      normY: 0.16 + rng() * 0.70,
      size: 0.8 + rng() * 1.8,
      alpha: 0.22 + rng() * 0.45,
      phase: rng() * Math.PI * 2,
    });
  }
  // Upper curved bell jar dome
  for (let i = 0; i < 14; i += 1) {
    const t = (i + 0.5) / 14;
    drops.push({
      normX: 0.16 + t * 0.68 + (rng() - 0.5) * 0.04,
      normY: 0.055 + Math.sin(t * Math.PI) * 0.11 + rng() * 0.04,
      size: 0.7 + rng() * 1.5,
      alpha: 0.2 + rng() * 0.42,
      phase: rng() * Math.PI * 2,
    });
  }
  return drops;
}

function drawVitrinePedestal(ctx, width, height, colors, score, elapsed) {
  const pedestalY = height * 0.91;
  const pedestalW = width * 0.84;
  const pedestalX = (width - pedestalW) * 0.5;

  ctx.save();

  // 1. Turned-wood Plinth Base (Victorian specimen mount)
  const woodGrad = ctx.createLinearGradient(0, pedestalY, 0, height);
  woodGrad.addColorStop(0, "hsl(25 24% 16%)");
  woodGrad.addColorStop(0.2, "hsl(25 28% 10%)");
  woodGrad.addColorStop(0.7, "hsl(25 32% 6%)");
  woodGrad.addColorStop(1, "hsl(20 30% 3%)");

  // Bottom stepped tier
  ctx.fillStyle = woodGrad;
  ctx.beginPath();
  if (typeof ctx.roundRect === "function") {
    ctx.roundRect(pedestalX, pedestalY + 12, pedestalW, height - (pedestalY + 12), [4, 4, 0, 0]);
  } else {
    ctx.rect(pedestalX, pedestalY + 12, pedestalW, height - (pedestalY + 12));
  }
  ctx.fill();

  // Middle stepped bevel
  const midW = pedestalW * 0.92;
  const midX = (width - midW) * 0.5;
  ctx.beginPath();
  if (typeof ctx.roundRect === "function") {
    ctx.roundRect(midX, pedestalY + 4, midW, 10, [3, 3, 0, 0]);
  } else {
    ctx.rect(midX, pedestalY + 4, midW, 10);
  }
  ctx.fill();

  // Polished brass channel ring where the vitrine bell jar rests
  const brassW = pedestalW * 0.86;
  const brassX = (width - brassW) * 0.5;
  ctx.strokeStyle = "hsla(42 75% 62% / 0.78)";
  ctx.lineWidth = 1.6;
  ctx.beginPath();
  ctx.moveTo(brassX, pedestalY + 4);
  ctx.lineTo(brassX + brassW, pedestalY + 4);
  ctx.stroke();

  // Brass specular highlight
  ctx.strokeStyle = "hsla(45 95% 88% / 0.65)";
  ctx.lineWidth = 0.8;
  ctx.beginPath();
  ctx.moveTo(brassX + brassW * 0.25, pedestalY + 3.5);
  ctx.lineTo(brassX + brassW * 0.45, pedestalY + 3.5);
  ctx.stroke();

  // 2. Bed of fibrous peat, decaying driftwood, and living lichen substrate
  const peatMounds = [
    { x: width * 0.22, y: pedestalY + 3, rx: width * 0.14, ry: 9, hue: 85 },
    { x: width * 0.48, y: pedestalY + 1, rx: width * 0.18, ry: 11, hue: 45 },
    { x: width * 0.74, y: pedestalY + 2, rx: width * 0.15, ry: 10, hue: 75 },
    { x: width * 0.35, y: pedestalY + 5, rx: width * 0.12, ry: 8, hue: 105 },
    { x: width * 0.62, y: pedestalY + 4, rx: width * 0.13, ry: 8, hue: 65 },
  ];

  for (const m of peatMounds) {
    const moundGrad = ctx.createRadialGradient(m.x, m.y - 2, 1, m.x, m.y, m.rx);
    moundGrad.addColorStop(0, `hsla(${m.hue} 42% 16% / 0.92)`);
    moundGrad.addColorStop(0.65, `hsla(${m.hue - 15} 35% 10% / 0.95)`);
    moundGrad.addColorStop(1, "hsla(25 28% 6% / 0.98)");
    ctx.fillStyle = moundGrad;
    ctx.beginPath();
    ctx.ellipse(m.x, m.y, m.rx, m.ry, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  // Lichen flakes and fibrous botanical rootlets
  const seedRng = mulberry32((score.seed ^ 0x5b3a8e12) >>> 0);
  ctx.fillStyle = `hsla(${colors[2]} 65% 72% / 0.42)`;
  for (let i = 0; i < 24; i += 1) {
    const lx = brassX + seedRng() * brassW;
    const ly = pedestalY - 2 + seedRng() * 9;
    ctx.beginPath();
    ctx.arc(lx, ly, 0.8 + seedRng() * 1.1, 0, Math.PI * 2);
    ctx.fill();
  }

  // Driftwood grain lines
  ctx.strokeStyle = "hsla(30 25% 22% / 0.4)";
  ctx.lineWidth = 0.8;
  for (let d = 0; d < 5; d += 1) {
    const dy = pedestalY + 16 + d * 3;
    ctx.beginPath();
    ctx.moveTo(pedestalX + 15, dy);
    ctx.quadraticCurveTo(width * 0.5, dy + (d % 2 ? 1 : -1) * 2, pedestalX + pedestalW - 15, dy);
    ctx.stroke();
  }

  ctx.restore();
}

function drawGlassCondensation(ctx, width, height, colors, score, elapsed, drops) {
  if (!drops || drops.length === 0) return;
  ctx.save();
  ctx.globalCompositeOperation = "screen";

  const bloomFactor = score.bloom / 100;
  const tapJitter = interaction.tap * 1.5;

  for (const drop of drops) {
    const jitterX = Math.sin(elapsed * 24 + drop.phase) * tapJitter;
    const jitterY = Math.cos(elapsed * 24 + drop.phase) * tapJitter;
    const dx = drop.normX * width + jitterX;
    const dy = drop.normY * height + jitterY;

    const baseAlpha = drop.alpha * (0.65 + bloomFactor * 0.35 + interaction.hold * 0.15);
    // Droplet glow
    ctx.fillStyle = `hsla(${colors[2]} 85% 82% / ${baseAlpha})`;
    ctx.beginPath();
    ctx.arc(dx, dy, drop.size * (1 + interaction.tap * 0.3), 0, Math.PI * 2);
    ctx.fill();

    // Tiny specular glint
    ctx.fillStyle = `rgba(255, 255, 255, ${Math.min(0.9, baseAlpha * 1.6)})`;
    ctx.beginPath();
    ctx.arc(dx - drop.size * 0.3, dy - drop.size * 0.3, drop.size * 0.35, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

class OracleVision {
  constructor(canvas) {
    this.canvas = canvas;
    this.context = canvas.getContext("2d", { alpha: false });
    this.score = {
      seed: 132071, pulse: 72, hue: 274, hueShift: 126, saturation: 88, palette: 2,
      symmetry: 7, twist: 4, bloom: 66, melodyMode: 1, melodyTurn: 0,
      eyes: 3, eyeShape: 3, irisStyle: 2,
      pupilShape: 1, irisHue: 164, irisShift: 72, eyeSize: 68, gaze: 1, eyeLayout: 0,
      shape: 0, size: 66, edge: 50, motion: 2, kineticMode: 0, kineticSpeed: 64,
      kineticDepth: 72, kineticTilt: 3, fluxMode: 1,
      fungalForm: 0, fungalName: "AGARIC CAP", fungalHyphae: 64, fungalSpores: 55, fungalBloom: 60,
    };
    this.startedAt = performance.now();
    this.particles = [];
    this.mycelium = null;
    this.fruitingBodies = [];
    this.spores = [];
    this.glassCondensation = [];
    // Re-read when the visitor changes the setting, not only at load (P4-02).
    const motionQuery = matchMedia("(prefers-reduced-motion: reduce)");
    this.reducedMotion = motionQuery.matches;
    motionQuery.addEventListener?.("change", (event) => {
      this.reducedMotion = event.matches;
    });
    this.resize = this.resize.bind(this);
    this.draw = this.draw.bind(this);
    window.addEventListener("resize", this.resize, { passive: true });
    this.resize();
    this.setScore(this.score);
    requestAnimationFrame(this.draw);
  }

  resize() {
    const ratio = Math.min(devicePixelRatio || 1, 2);
    const rect = this.canvas.getBoundingClientRect();
    this.width = rect.width;
    this.height = rect.height;
    this.canvas.width = Math.round(rect.width * ratio);
    this.canvas.height = Math.round(rect.height * ratio);
    this.context.setTransform(ratio, 0, 0, ratio, 0, 0);
  }

  setScore(score) {
    this.score = score;
    this.startedAt = performance.now();
    const random = mulberry32(score.seed);
    const particleCount = 45 + score.size;
    this.particles = Array.from({ length: particleCount }, () => ({
      x: random(),
      y: random(),
      radius: 0.25 + random() * (0.8 + score.bloom / 38),
      phase: random() * Math.PI * 2,
      drift: 0.15 + random() * 1.15,
    }));
    this.mycelium = buildMycelialNetwork(score);
    this.fruitingBodies = buildFruitingBodies(score, this.mycelium);
    this.spores = buildSporeSystem(score, this.fruitingBodies);
    this.glassCondensation = buildGlassCondensation(score.seed);
  }

  burstSpores(strength = 1) {
    if (!this.spores) return;
    for (const sp of this.spores) {
      const angle = Math.atan2(sp.y, sp.x);
      sp.vx += Math.cos(angle) * (1.2 + Math.random() * 2.2) * strength;
      sp.vy += Math.sin(angle) * (1.2 + Math.random() * 2.2) * strength;
      sp.life = Math.min(1.0, sp.life + 0.35);
    }
  }

  updateAndDrawSpores(ctx, score, base, elapsed, colors, timestamp) {
    if (!this.spores || this.spores.length === 0) return;
    const dt = 0.016;
    const tapImpulse = interaction.tap * 4.2;
    const holdBoost = interaction.hold * 0.5;

    ctx.save();
    ctx.globalCompositeOperation = "screen";

    for (let i = 0; i < this.spores.length; i += 1) {
      const sp = this.spores[i];
      sp.life -= dt / sp.maxLife;

      if (sp.life <= 0) {
        const fb = this.fruitingBodies[sp.fbIndex % (this.fruitingBodies.length || 1)];
        if (fb) {
          const fbScale = fb.size * base;
          sp.x = fb.x * base + (Math.random() - 0.5) * fbScale * 0.4;
          sp.y = fb.y * base + (Math.random() - 0.5) * fbScale * 0.4;
          const outAngle = fb.angle + fb.tilt;
          sp.vx = Math.cos(outAngle) * (0.2 + Math.random() * 0.6);
          sp.vy = Math.sin(outAngle) * (0.2 + Math.random() * 0.6) - 0.3;
        } else {
          sp.x = (Math.random() - 0.5) * base;
          sp.y = (Math.random() - 0.5) * base;
          sp.vx = (Math.random() - 0.5) * 0.4;
          sp.vy = -0.3;
        }
        sp.life = 1.0;
      }

      if (!this.reducedMotion) {
        sp.x += sp.vx;
        sp.y += sp.vy;
        sp.vy -= 0.04 * dt * 60;
        sp.vx += Math.sin(elapsed * 1.8 + sp.y * 0.01) * 0.08 * dt * 60;

        if (tapImpulse > 0.1) {
          const rad = Math.hypot(sp.x, sp.y) || 1;
          sp.vx += (sp.x / rad) * tapImpulse * 0.7;
          sp.vy += (sp.y / rad) * tapImpulse * 0.7;
        }

        if (interaction.dragSpeed > 0.05) {
          const ptrDistX = (interaction.smoothX * base) - sp.x;
          const ptrDistY = (interaction.smoothY * base) - sp.y;
          const ptrDist = Math.hypot(ptrDistX, ptrDistY);
          if (ptrDist < base * 0.75 && ptrDist > 5) {
            sp.vx += (ptrDistX / ptrDist) * interaction.dragSpeed * 0.5;
            sp.vy += (ptrDistY / ptrDist) * interaction.dragSpeed * 0.5;
          }
        }
      }

      const sporeAlpha = sp.life * (0.35 + holdBoost * 0.45);
      const sporeHue = wrapHue(colors[2] + sp.hueOffset);
      ctx.fillStyle = `hsla(${sporeHue} 100% 82% / ${sporeAlpha})`;
      ctx.beginPath();
      ctx.arc(sp.x, sp.y, sp.size * (1 + interaction.tap * 0.4), 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }

  draw(timestamp) {
    stepInteraction(timestamp, this.reducedMotion);
    const ctx = this.context;
    const score = this.score;
    const width = this.width;
    const height = this.height;
    const elapsed = this.reducedMotion ? 1.25 : (timestamp - this.startedAt) / 1000;
    const colors = paletteFor(score);
    const naturalGrowth = this.reducedMotion ? 1.0 : Math.min(1.0, elapsed / 10.0);
    const growth = Math.min(1.0, naturalGrowth + interaction.hold * 0.35 + interaction.tap * 0.25);

    const glowFocusX = width * (0.5 + interaction.smoothX * 0.28);
    const glowFocusY = height * (0.48 + interaction.smoothY * 0.24);
    const backdrop = ctx.createRadialGradient(glowFocusX, glowFocusY, 0, width * 0.5, height * 0.48, Math.max(width, height) * 0.78);
    backdrop.addColorStop(0, `hsl(${colors[0]} ${Math.max(30, score.saturation - 24)}% ${16 + interaction.hold * 7 + interaction.tap * 6}%)`);
    backdrop.addColorStop(0.48, `hsl(${colors[1]} ${Math.max(25, score.saturation - 35)}% ${8 + interaction.hold * 4}%)`);
    backdrop.addColorStop(1, `hsl(${colors[2]} 32% 3%)`);
    ctx.fillStyle = backdrop;
    ctx.fillRect(0, 0, width, height);

    ctx.save();
    for (const particle of this.particles) {
      const driftX = this.reducedMotion ? 0 : Math.sin(elapsed * particle.drift + particle.phase + interaction.morphPhase * 0.5) * (4 + score.motion * 1.8);
      const driftY = this.reducedMotion ? 0 : Math.cos(elapsed * 0.3 + particle.phase + interaction.morphPhase * 0.4) * score.motion;
      ctx.globalAlpha = 0.15 + Math.sin(elapsed + particle.phase) * 0.1 + interaction.hold * 0.12;
      ctx.fillStyle = `hsl(${colors[Math.floor(particle.phase) % colors.length]} ${score.saturation}% 78%)`;
      ctx.beginPath();
      ctx.arc(particle.x * width + driftX, particle.y * height + driftY, particle.radius * (1 + interaction.tap * 0.45), 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();

    drawVitrinePedestal(ctx, width, height, colors, score, elapsed);

    const orbitDistance = this.reducedMotion ? 0 : score.motion * Math.min(width, height) * 0.004;
    const maxTugX = width * 0.32;
    const maxTugY = height * 0.24;
    const tugX = this.reducedMotion ? 0 : interaction.smoothX * maxTugX * (0.65 + interaction.hold * 0.35);
    const tugY = this.reducedMotion ? 0 : interaction.smoothY * maxTugY * (0.65 + interaction.hold * 0.35);
    const centerX = width * 0.5 + Math.cos(elapsed * 0.21) * orbitDistance + tugX;
    const centerY = height * 0.5 + Math.sin(elapsed * 0.27) * orbitDistance + tugY;
    const sizeFactor = 0.15 + score.size / 100 * (width < 760 ? 0.14 : 0.22);
    const base = Math.min(width, height) * sizeFactor;
    const points = Math.max(120, score.symmetry * 28);
    const dragDist = Math.hypot(interaction.smoothX, interaction.smoothY);
    const dragAngle = Math.atan2(interaction.smoothY, interaction.smoothX);
    const stretchAmount = this.reducedMotion ? 0 : (dragDist * 0.16 + interaction.dragSpeed * 0.22) * interaction.hold;
    const stretchX = 1 + (Math.cos(dragAngle) ** 2) * stretchAmount - (Math.sin(dragAngle) ** 2) * stretchAmount * 0.45 + (interaction.tap * 0.06);
    const stretchY = 1 + (Math.sin(dragAngle) ** 2) * stretchAmount - (Math.cos(dragAngle) ** 2) * stretchAmount * 0.45 - (interaction.tap * 0.05);
    const aspectX = [1, 1, 1.08, 1, 0.9, 1.16, 1.25, 1, 0.92, 0.88][score.shape] * stretchX;
    const aspectY = [1, 1, 0.92, 1, 1.12, 0.88, 0.72, 1, 1.08, 1.25][score.shape] * stretchY;

    ctx.save();
    ctx.translate(centerX, centerY);
    const direction = score.kineticTilt % 2 ? 1 : -1;
    ctx.rotate(this.reducedMotion ? 0.16 : (elapsed * (0.004 + score.kineticSpeed / 12000) + interaction.morphPhase * 0.14) * direction);
    ctx.scale(aspectX, aspectY);

    drawMycelium(ctx, score, this.mycelium, base, growth, elapsed, colors);
    drawFruitingBodies(ctx, score, this.fruitingBodies, base, growth, elapsed, colors);

    ctx.save();
    ctx.shadowColor = `hsla(${colors[1]} 100% 70% / 0.58)`;
    ctx.shadowBlur = score.bloom * 0.62;

    const aura = ctx.createRadialGradient(0, 0, base * 0.04, 0, 0, base * 1.25);
    aura.addColorStop(0, `hsla(${colors[2]} ${score.saturation}% 90% / 0.96)`);
    aura.addColorStop(0.24, `hsla(${colors[0]} ${score.saturation}% 62% / 0.86)`);
    aura.addColorStop(0.68, `hsla(${colors[1]} ${score.saturation}% 48% / 0.38)`);
    aura.addColorStop(1, `hsla(${colors[2]} ${score.saturation}% 48% / 0)`);
    ctx.fillStyle = aura;
    traceBody(ctx, score, base, elapsed, points);
    ctx.fill();
    ctx.restore();

    ctx.save();
    traceBody(ctx, score, base, elapsed, points);
    ctx.clip();
    drawKineticCore(ctx, score, base, elapsed, colors);
    ctx.restore();

    ctx.globalCompositeOperation = "screen";
    ctx.lineWidth = (0.7 + score.edge / 70) * (1 + interaction.hold * 0.45 + interaction.tap * 0.35);
    ctx.strokeStyle = `hsla(${colors[2]} 100% 84% / ${0.58 + interaction.hold * 0.24})`;
    const ringCount = 2 + score.palette % 4;
    const kineticRate = 0.12 + score.kineticSpeed / 180;
    const kineticPhase = score.kineticTilt / 8 * Math.PI * 2 + interaction.morphPhase * 1.2;
    for (let ring = 0; ring < ringCount; ring += 1) {
      ctx.beginPath();
      for (let i = 0; i <= points; i += 1) {
        const angle = i / points * Math.PI * 2;
        const ringDirection = ring % 2 ? -1 : 1;
        const motion = Math.sin(
          angle * (score.symmetry + ring) + elapsed * kineticRate * ringDirection + kineticPhase,
        ) * (0.022 + score.kineticDepth / 2400) * (1 + interaction.hold * 0.8 + interaction.dragSpeed * 0.7);
        const radius = base * (0.25 + ring * (0.52 / ringCount) + motion);
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.stroke();
    }

    ctx.globalCompositeOperation = "source-over";
    for (let eye = 0; eye < score.eyes; eye += 1) {
      drawEye(ctx, score, eye, base, elapsed, colors);
    }

    this.updateAndDrawSpores(ctx, score, base, elapsed, colors, timestamp);
    ctx.restore();

    drawGlassCondensation(ctx, width, height, colors, score, elapsed, this.glassCondensation);

    if (interaction.ripples.length > 0) {
      ctx.save();
      ctx.globalCompositeOperation = "screen";
      for (const ripple of interaction.ripples) {
        const age = Math.max(0, (timestamp - ripple.bornAt) / 920);
        const rx = (ripple.x * 0.5 + 0.5) * width;
        const ry = (ripple.y * 0.5 + 0.5) * height;
        const rippleRadius = base * (0.1 + age * (0.95 + ripple.strength * 0.45));
        ctx.strokeStyle = `hsla(${colors[2]} 100% 86% / ${(1 - age) ** 1.6 * 0.52})`;
        ctx.lineWidth = 1.6 * (1 - age * 0.6);
        ctx.beginPath();
        ctx.arc(rx, ry, rippleRadius, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.restore();
    }

    requestAnimationFrame(this.draw);
  }
}

const vision = new OracleVision(elements.canvas);

async function ensureAudioContext() {
  if (!audioContext) audioContext = new AudioContext();
  if (audioContext.state === "suspended") await audioContext.resume();
  return audioContext;
}

function harmonicField() {
  const radius = Math.min(1, Math.hypot(interaction.smoothX, interaction.smoothY)) * interaction.hold;
  const angle = Math.atan2(interaction.smoothY, interaction.smoothX);
  const unitPhase = (angle + Math.PI) / (Math.PI * 2);
  const cyclePosition = unitPhase * 12;
  const phaseStep = Math.floor(cyclePosition) % 12;
  const phaseFraction = cyclePosition - Math.floor(cyclePosition);
  const crossfadeAngle = (Math.PI * 0.5) * Math.min(1, radius * (0.45 + 0.55 * phaseFraction));
  return {
    radius,
    angle,
    unitPhase,
    phaseStep: (phaseStep + 1) % 12,
    primaryWeight: Math.cos(crossfadeAngle),
    shiftedWeight: Math.sin(crossfadeAngle),
  };
}

function updateAudioInteraction() {
  if (!audioContext || !currentTransport || muted) return;
  const score = currentScore || vision.score;
  const now = audioContext.currentTime;
  const transport = currentTransport;
  const field = harmonicField();

  // The vitrine sweeps the lead's creature filter around the same resting
  // point the exports use (D-042).
  const creature = creatureFilter(score);
  const harmonicExponent = (interaction.pitchBend * 0.72 + Math.sin(field.angle) * 0.35) * Math.max(0.3, interaction.hold) + interaction.tap * 0.25;
  const targetCutoff = Math.max(220, Math.min(9000, creature.cutoff * (2 ** harmonicExponent)));
  const targetQ = Math.min(4.5, creature.q + field.radius * 1.6 + interaction.tap * 0.7);
  const targetMix = 0.28 * (1 + interaction.hold * 0.2 + interaction.tap * 0.12);
  const baseFeedback = 0.14 + score.bloom / 650;
  const targetFeedback = Math.min(0.48, baseFeedback + field.radius * 0.14);

  transport.filter.frequency.setTargetAtTime(targetCutoff, now, 0.045);
  transport.filter.Q.setTargetAtTime(targetQ, now, 0.045);
  transport.mix.gain.setTargetAtTime(targetMix, now, 0.045);
  transport.feedback.gain.setTargetAtTime(targetFeedback, now, 0.05);

  if (transport.panner) {
    const targetPan = Math.max(-0.85, Math.min(0.85, interaction.smoothX * 0.88));
    transport.panner.pan.setTargetAtTime(targetPan, now, 0.04);
  }

  // Real-time continuous drone choir pitch bend & harmonic beating
  const pitchBendCents = interaction.pitchBend * 140 * interaction.hold;
  const subWeight = 0.085 * (1 + Math.max(0, -interaction.pitchBend) * 0.55 * interaction.hold);
  const fifthWeight = 0.035 + field.radius * 0.065 * (0.5 - 0.5 * Math.cos(field.angle * 2));
  const shimmerWeight = field.radius * 0.058 * (0.5 + 0.5 * Math.sin(interaction.pitchBend * Math.PI * 0.5));
  // The tonic drones step back with the lead while the band follows a held key.
  const leadDuck = activeHeldFunKey !== null || currentTransport?.songLeading ? LEAD_DUCK_GAIN : 1;
  const targetDroneGains = [subWeight * leadDuck, fifthWeight * leadDuck, shimmerWeight * leadDuck];

  for (const [index, drone] of transport.drones.entries()) {
    const baseDetune = [-5, 4, -3][index] || 0;
    const phaseBeating = Math.sin(field.angle + index * 2.094) * (10 + 16 * field.radius);
    drone.detune.setTargetAtTime(baseDetune + pitchBendCents + phaseBeating, now, 0.045);
    if (transport.droneGains?.[index]) {
      transport.droneGains[index].gain.setTargetAtTime(targetDroneGains[index] ?? 0.03, now, 0.05);
    }
  }

  // Vitrine bell jar glass acoustic proximity resonance
  if (transport.parlorReverbSend && parlorAcousticsEnabled && parlorReverbEnabled) {
    const glassProximity = Math.max(0, (field.radius - 0.5) / 0.5);
    const glassBoost = 1 + glassProximity * 0.45;
    transport.parlorReverbSend.gain.setTargetAtTime(PARLOR_REVERB_PER_LEVEL * parlorAcousticsLevel * glassBoost, now, 0.05);
  }
}

function triggerPercussion(kind, normX = 0, normY = 0, strength = 1) {
  if (!audioContext || !currentTransport || muted) return;
  const score = currentScore || vision.score;
  const now = audioContext.currentTime;
  const melody = currentTransport.melody;
  const sector = Math.floor((((Math.atan2(normY, normX) + Math.PI) / (Math.PI * 2)) * 12)) % 12;
  const degree = melody[(currentTransport.step + sector) % melody.length] || 0;
  const registerLift = -normY > 0.35 ? 12 : (-normY < -0.35 ? 0 : 7);
  const baseMidi = score.root + degree + registerLift;
  const baseFreq = midiToFrequency(baseMidi);

  if (kind === "strike") {
    for (const [partialIndex, ratio] of [0.5, 1, 1.5, 2].entries()) {
      const partialOsc = audioContext.createOscillator();
      const partialGain = audioContext.createGain();
      partialOsc.type = partialIndex < 2 ? "sine" : "triangle";
      partialOsc.frequency.setValueAtTime(baseFreq * ratio, now);
      partialOsc.detune.setValueAtTime((partialIndex - 1.5) * 2.5, now);
      const duration = 0.42 - partialIndex * 0.065;
      const peak = [0.09, 0.13, 0.075, 0.045][partialIndex] * strength;
      partialGain.gain.setValueAtTime(0.0001, now);
      partialGain.gain.exponentialRampToValueAtTime(peak, now + 0.016);
      partialGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
      partialOsc.connect(partialGain).connect(currentTransport.mix);
      partialOsc.start(now);
      partialOsc.stop(now + duration + 0.04);
    }
  } else if (kind === "ratchet") {
    for (const [partialIndex, ratio] of [1, 2].entries()) {
      const harmonicOsc = audioContext.createOscillator();
      const harmonicGain = audioContext.createGain();
      harmonicOsc.type = partialIndex === 0 ? "sine" : "triangle";
      harmonicOsc.frequency.setValueAtTime(baseFreq * ratio, now);
      const duration = partialIndex === 0 ? 0.24 : 0.15;
      const peak = (partialIndex === 0 ? 0.085 : 0.038) * strength;
      harmonicGain.gain.setValueAtTime(0.0001, now);
      harmonicGain.gain.exponentialRampToValueAtTime(peak, now + 0.014);
      harmonicGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
      harmonicOsc.connect(harmonicGain).connect(currentTransport.mix);
      harmonicOsc.start(now);
      harmonicOsc.stop(now + duration + 0.03);
    }
  }
}

function triggerSporePuff(strength = 1, atTime = null) {
  if (!audioContext || !currentTransport || muted) return;
  const context = audioContext;
  const now = atTime ?? context.currentTime;
  const bus = currentTransport.fungalBus || currentTransport.mix;

  const noise = context.createBufferSource();
  noise.buffer = ensureNoiseBuffer(context);
  const filter = context.createBiquadFilter();
  filter.type = "bandpass";
  filter.frequency.setValueAtTime(2250, now);
  filter.Q.setValueAtTime(3.2, now);

  const gain = context.createGain();
  const peak = Math.min(0.09, 0.048 * strength);
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(peak, now + 0.005);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.045);

  const pip = context.createOscillator();
  const pipGain = context.createGain();
  pip.type = "sine";
  pip.frequency.setValueAtTime(740, now);
  pip.frequency.exponentialRampToValueAtTime(220, now + 0.038);
  pipGain.gain.setValueAtTime(0.0001, now);
  pipGain.gain.exponentialRampToValueAtTime(peak * 0.75, now + 0.004);
  pipGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.04);

  noise.connect(filter).connect(gain).connect(bus);
  pip.connect(pipGain).connect(bus);
  noise.start(now);
  noise.stop(now + 0.055);
  pip.start(now);
  pip.stop(now + 0.055);
}

// Silences the active loop and returns the raw step it should resume from, or
// null when nothing was playing. Steps already queued in the look-ahead window
// are cut by fading the whole output, not just the drone mix.
function stopCurrentSound() {
  releaseFunPads(audioContext, 0.25);
  if (!currentTransport || !audioContext) return null;
  const transport = currentTransport;
  currentTransport = null;
  window.clearInterval(transport.timer);
  const now = audioContext.currentTime;
  transport.mix.gain.cancelScheduledValues(now);
  transport.mix.gain.setTargetAtTime(0.0001, now, 0.035);
  transport.output.gain.cancelScheduledValues(now);
  transport.output.gain.setTargetAtTime(0.0001, now, 0.03);
  for (const drone of transport.drones) {
    try {
      drone.stop(now + 0.18);
    } catch {
      // A previously stopped oscillator is harmless during rapid resummoning.
    }
  }
  window.setTimeout(() => transport.output.disconnect(), 350);
  return transport.audibleStep + 1;
}

function voiceStack(score, step) {
  const stacks = [
    [{ interval: 0, detune: 0, gain: 1 }],
    [{ interval: 0, detune: -5, gain: 0.72 }, { interval: 0, detune: 7, gain: 0.48 }],
    [{ interval: 0, detune: 0, gain: 0.78 }, { interval: 7, detune: -3, gain: 0.34 }],
    [{ interval: 0, detune: 0, gain: 0.76 }, { interval: -12, detune: 4, gain: 0.3 }],
    [{ interval: 0, detune: -9, gain: 0.6 }, { interval: 12, detune: 9, gain: 0.28 }],
    [{ interval: 0, detune: 0, gain: 0.64 }, { interval: 7, detune: 2, gain: 0.26 }, { interval: 12, detune: -2, gain: 0.2 }],
  ];
  const selected = stacks[score.voice];
  return step % 6 === 5 && score.voice < 4
    ? [...selected, { interval: 12, detune: 0, gain: 0.2 }]
    : selected;
}

// Offline renders may set `transport.engageAll` (stems render every part even
// if the console mutes it) and `transport.noteLog` (MIDI export captures every
// pitched event from the same code that makes the sound). Live transports set
// neither.
function transportEngages(transport, id) {
  return transport.engageAll === true || channelEngaged(id);
}

function logNote(transport, channel, midi, at, duration, peak) {
  transport.noteLog?.push({ channel, midi: Math.round(midi), at, duration, peak });
}

function scheduleNote(context, transport, score, step, at, duration) {
  const field = harmonicField();
  const leadRoot = score.root + leadOctaveShift(score);
  const primaryNote = leadRoot + transport.melody[step % transport.melody.length];
  const consonantInterval = interaction.pitchBend > 0.48 ? 12 : (interaction.pitchBend > 0.2 ? 7 : (interaction.pitchBend < -0.45 ? -12 : (interaction.pitchBend < -0.2 ? -5 : 0)));
  const shiftedNote = leadRoot + transport.melody[(step + field.phaseStep) % transport.melody.length] + consonantInterval;
  const envelope = context.createGain();
  const attack = Math.min(0.055, duration * (0.2 + field.radius * 0.06));
  const duck = (transport === currentTransport && activeHeldFunKey !== null) || transport.songLeading ? LEAD_DUCK_GAIN : 1;
  const peakGain = 0.3 * (1 + interaction.hold * 0.16) * duck;
  envelope.gain.setValueAtTime(0.0001, at);
  envelope.gain.exponentialRampToValueAtTime(peakGain, at + Math.max(0.01, attack));
  envelope.gain.exponentialRampToValueAtTime(0.0001, at + duration);
  envelope.connect(transport.mix);
  logNote(transport, "lead", primaryNote, at, duration, peakGain);

  const chorusPhaseCents = Math.sin(field.angle + step * 0.52) * (6 + 14 * field.radius);
  const layers = field.shiftedWeight > 0.04
    ? [
      { note: primaryNote, weight: field.primaryWeight, detuneOffset: -chorusPhaseCents },
      { note: shiftedNote, weight: field.shiftedWeight, detuneOffset: chorusPhaseCents },
    ]
    : [{ note: primaryNote, weight: 1, detuneOffset: 0 }];

  for (const layer of layers) {
    for (const [voiceIndex, voice] of voiceStack(score, step).entries()) {
      const oscillator = context.createOscillator();
      // The creature's own waveform leads, and the stacked voices mix in a
      // saw or square so the line keeps overtones for the creature filter to
      // shape; all sines and triangles sounded muffled (D-042).
      oscillator.type = voiceIndex === 0
        ? score.waveform
        : ["triangle", "sawtooth", "sine", "square"][(score.wave + voiceIndex + score.voice) % 4];
      oscillator.frequency.value = midiToFrequency(layer.note + voice.interval);
      oscillator.detune.value = voice.detune * 0.45 + layer.detuneOffset + (step % 3 - 1) * score.twist * 0.14;
      const level = context.createGain();
      level.gain.value = voice.gain * layer.weight;
      oscillator.connect(level).connect(envelope);
      oscillator.start(at);
      oscillator.stop(at + duration + 0.06);
    }
  }
}

function ensureNoiseBuffer(context) {
  if (noiseBuffer && noiseBuffer.sampleRate === context.sampleRate) return noiseBuffer;
  const length = Math.floor(context.sampleRate * 0.25);
  const buffer = context.createBuffer(1, length, context.sampleRate);
  const channel = buffer.getChannelData(0);
  const random = mulberry32(0x4d414c42);
  for (let i = 0; i < length; i += 1) {
    channel[i] = random() * 2 - 1;
  }
  noiseBuffer = buffer;
  return buffer;
}

let cachedWaxCrackleBuffer = null;
let cachedParlorImpulseBuffer = null;

function ensureWaxCrackleBuffer(context, durationSeconds = 4.0) {
  if (cachedWaxCrackleBuffer && cachedWaxCrackleBuffer.sampleRate === context.sampleRate) {
    return cachedWaxCrackleBuffer;
  }
  const frames = Math.ceil(context.sampleRate * durationSeconds);
  const buffer = context.createBuffer(2, frames, context.sampleRate);
  const left = buffer.getChannelData(0);
  const right = buffer.getChannelData(1);

  let b0L = 0, b1L = 0, b2L = 0;
  let b0R = 0, b1R = 0, b2R = 0;
  let rumbleL = 0, rumbleR = 0;
  const rotPeriod = 60 / 78; // 78 RPM period ~0.769s

  for (let i = 0; i < frames; i += 1) {
    const t = i / context.sampleRate;
    const rotPhase = (t % rotPeriod) / rotPeriod;
    const rotThump = Math.exp(-Math.pow((rotPhase - 0.12) * 12, 2)) * 0.04;
    const rotWobble = 1 + 0.25 * Math.sin(t * (1 / rotPeriod) * 2 * Math.PI) + rotThump;

    // Filtered brown noise for mechanical turntable rumble (subtle, non-tonal)
    const subWhiteL = Math.random() * 2 - 1;
    const subWhiteR = Math.random() * 2 - 1;
    rumbleL = rumbleL * 0.96 + subWhiteL * 0.04;
    rumbleR = rumbleR * 0.96 + subWhiteR * 0.04;

    // Acoustic horn body noise (bandpass 800Hz - 3.5kHz)
    const whiteL = Math.random() * 2 - 1;
    const whiteR = Math.random() * 2 - 1;
    b0L = 0.85 * b0L + whiteL * 0.15;
    b1L = 0.72 * b1L + (whiteL - b0L) * 0.28;
    b2L = 0.55 * b2L + b1L * 0.45;

    b0R = 0.85 * b0R + whiteR * 0.15;
    b1R = 0.72 * b1R + (whiteR - b0R) * 0.28;
    b2R = 0.55 * b2R + b1R * 0.45;

    const hornL = (b1L - b2L) * 0.24;
    const hornR = (b1R - b2R) * 0.24;

    left[i] = (hornL + rumbleL * 0.20) * rotWobble;
    right[i] = (hornR + rumbleR * 0.20) * rotWobble;
  }

  // Dense stylus micro-crackle: small asperities with fast exponential decay
  for (let i = 0; i < frames; i += 1) {
    if (Math.random() < 340 / context.sampleRate) {
      const amp = (Math.random() * 0.28 + 0.08) * (Math.random() < 0.5 ? 1 : -1);
      const decayLen = Math.floor(Math.random() * 12 + 4);
      for (let k = 0; k < decayLen && i + k < frames; k += 1) {
        const env = Math.exp(-k * 0.42);
        left[i + k] += amp * env;
        right[i + k] += amp * env * (0.7 + Math.random() * 0.6);
      }
    }
  }

  // Discrete dust pops & shellac clicks with damped acoustic ringing
  for (let i = 0; i < frames; i += 1) {
    if (Math.random() < 38 / context.sampleRate) {
      const popAmp = (Math.random() * 0.55 + 0.30) * (Math.random() < 0.5 ? 1 : -1);
      const popLen = Math.floor(Math.random() * 32 + 16);
      const ringFreq = 1800 + Math.random() * 2200;
      for (let k = 0; k < popLen && i + k < frames; k += 1) {
        const tPop = k / context.sampleRate;
        const env = Math.exp(-k * 0.18) * Math.cos(2 * Math.PI * ringFreq * tPop);
        left[i + k] += popAmp * env;
        right[i + k] += popAmp * env * (0.8 + Math.random() * 0.4);
      }
    }
  }

  // Seamless boundary crossfade to prevent seam click on loop
  const fadeLen = Math.min(2400, Math.floor(frames / 8));
  for (let j = 0; j < fadeLen; j += 1) {
    const ramp = j / fadeLen;
    const tailIdx = frames - fadeLen + j;
    left[tailIdx] = left[tailIdx] * (1 - ramp) + left[j] * ramp;
    right[tailIdx] = right[tailIdx] * (1 - ramp) + right[j] * ramp;
  }

  cachedWaxCrackleBuffer = buffer;
  return buffer;
}

function ensureParlorImpulseResponse(context, durationSeconds = 1.6) {
  if (cachedParlorImpulseBuffer && cachedParlorImpulseBuffer.sampleRate === context.sampleRate) {
    return cachedParlorImpulseBuffer;
  }
  const frames = Math.ceil(context.sampleRate * durationSeconds);
  const buffer = context.createBuffer(2, frames, context.sampleRate);
  const left = buffer.getChannelData(0);
  const right = buffer.getChannelData(1);

  // Discrete early reflections with alternating polarity and room delays
  const reflections = [
    { t: 0.007, gL: 0.35, gR: -0.28 },
    { t: 0.015, gL: -0.28, gR: 0.32 },
    { t: 0.024, gL: 0.22, gR: -0.19 },
    { t: 0.036, gL: -0.18, gR: 0.22 },
    { t: 0.052, gL: 0.14, gR: -0.15 },
    { t: 0.073, gL: -0.11, gR: 0.12 },
    { t: 0.098, gL: 0.08, gR: -0.09 },
    { t: 0.128, gL: -0.06, gR: 0.07 },
  ];

  for (const ref of reflections) {
    const idx = Math.min(frames - 1, Math.floor(ref.t * context.sampleRate));
    left[idx] += ref.gL;
    right[idx] += ref.gR;
  }

  // Tail with highpass DC block and air damping to eliminate low-frequency fog-horn resonance
  let lpL = 0, lpR = 0;
  let hpInL = 0, hpOutL = 0;
  let hpInR = 0, hpOutR = 0;
  const R = 0.985; // ~105Hz highpass cutoff preventing low-end rumble accumulation

  for (let i = 0; i < frames; i += 1) {
    const t = i / context.sampleRate;
    const decay = Math.exp(-2.8 * t);
    const whiteL = (Math.random() * 2 - 1) * decay * 0.25;
    const whiteR = (Math.random() * 2 - 1) * decay * 0.25;

    // Air absorption damping (gentle lowpass)
    const filterCoeff = 0.55 + 0.35 * Math.exp(-3.5 * t);
    lpL = lpL * filterCoeff + whiteL * (1 - filterCoeff);
    lpR = lpR * filterCoeff + whiteR * (1 - filterCoeff);

    // DC-block highpass filter
    hpOutL = lpL - hpInL + R * hpOutL;
    hpInL = lpL;
    hpOutR = lpR - hpInR + R * hpOutR;
    hpInR = lpR;

    left[i] += hpOutL;
    right[i] += hpOutR;
  }

  // Measure peak spectral magnitude to normalize impulse response to safe unity room gain
  const probeFreqs = [30, 60, 90, 120, 150, 200, 300, 500, 1000, 2000, 4000];
  let maxSpectralMag = 0;
  for (const f of probeFreqs) {
    let re = 0, im = 0;
    const omega = 2 * Math.PI * f / context.sampleRate;
    for (let n = 0; n < frames; n += 2) {
      re += left[n] * Math.cos(omega * n);
      im -= left[n] * Math.sin(omega * n);
    }
    const mag = Math.sqrt(re * re + im * im) * 2;
    if (mag > maxSpectralMag) maxSpectralMag = mag;
  }

  const targetGain = 0.75;
  const normFactor = maxSpectralMag > 0 ? targetGain / maxSpectralMag : 0.05;
  for (let i = 0; i < frames; i += 1) {
    left[i] *= normFactor;
    right[i] *= normFactor;
  }

  cachedParlorImpulseBuffer = buffer;
  return buffer;
}

// The escapement sits on the master output, under nothing but the master
// volume. Its levels were roughly doubled after measuring it 9 dB under the
// mix's peaks and masked by the wax crackle.
function scheduleClockworkTick(context, destination, at, stepIndex, level = 0.55) {
  if (!parlorAcousticsEnabled || !parlorTickEnabled || level <= 0) return;
  const isQuarter = stepIndex % 3 === 0;
  const isHighTick = stepIndex === 0 || stepIndex === 6;
  const effLevel = Math.max(0, Math.min(1, level));

  if (isQuarter) {
    // 1. Escapement Pallet Strike Transient
    const strikeOsc = context.createOscillator();
    const strikeGain = context.createGain();
    strikeOsc.type = isHighTick ? "triangle" : "sine";
    const startFreq = isHighTick ? 3200 : 2100;
    const endFreq = isHighTick ? 1400 : 820;
    strikeOsc.frequency.setValueAtTime(startFreq, at);
    strikeOsc.frequency.exponentialRampToValueAtTime(endFreq, at + 0.012);

    const strikeAmp = (isHighTick ? 0.42 : 0.36) * effLevel;
    strikeGain.gain.setValueAtTime(strikeAmp, at);
    strikeGain.gain.exponentialRampToValueAtTime(0.0001, at + 0.016);

    strikeOsc.connect(strikeGain).connect(destination);
    strikeOsc.start(at);
    strikeOsc.stop(at + 0.02);

    // 2. Resonant Wood Clock Case Body Knock
    const bodyOsc = context.createOscillator();
    const bodyGain = context.createGain();
    bodyOsc.type = "sine";
    bodyOsc.frequency.setValueAtTime(isHighTick ? 520 : 340, at);

    const bodyAmp = (isHighTick ? 0.30 : 0.32) * effLevel;
    bodyGain.gain.setValueAtTime(bodyAmp, at);
    bodyGain.gain.exponentialRampToValueAtTime(0.0001, at + 0.07);

    bodyOsc.connect(bodyGain).connect(destination);
    bodyOsc.start(at);
    bodyOsc.stop(at + 0.075);
  } else {
    // Intervening mechanical brass gear ratchet tick
    const ratchetOsc = context.createOscillator();
    const ratchetGain = context.createGain();
    const ratchetFilter = context.createBiquadFilter();

    ratchetOsc.type = "triangle";
    ratchetOsc.frequency.setValueAtTime(3800, at);
    ratchetOsc.frequency.exponentialRampToValueAtTime(2200, at + 0.007);

    ratchetFilter.type = "highpass";
    ratchetFilter.frequency.value = 2000;

    const ratchetAmp = 0.09 * effLevel;
    ratchetGain.gain.setValueAtTime(ratchetAmp, at);
    ratchetGain.gain.exponentialRampToValueAtTime(0.0001, at + 0.009);

    ratchetOsc.connect(ratchetFilter).connect(ratchetGain).connect(destination);
    ratchetOsc.start(at);
    ratchetOsc.stop(at + 0.012);
  }
}


function scheduleBeatStep(context, transport, score, stepIndex, at, stepDuration) {
  if (!transportEngages(transport, "beat") || !currentBeat || !transport.beatBus) return;
  const step = currentBeat.steps[stepIndex % currentBeat.steps.length];
  if (!step) return;

  const holdLift = 1 + interaction.hold * 0.18;

  if (step.kick > 0) {
    const kickOsc = context.createOscillator();
    const kickGain = context.createGain();
    const startFreq = midiToFrequency(score.root - 5);
    const endFreq = Math.max(34, midiToFrequency(score.root - 24));
    const peak = (step.kick === 2 ? 0.24 : 0.13) * holdLift;
    logNote(transport, "beat", GM_DRUMS.kick, at, 0.1, peak);
    const decay = Math.min(0.2, Math.max(0.11, stepDuration * 0.68));
    kickOsc.type = "sine";
    kickOsc.frequency.setValueAtTime(startFreq, at);
    kickOsc.frequency.exponentialRampToValueAtTime(endFreq, at + decay);
    kickGain.gain.setValueAtTime(0.0001, at);
    kickGain.gain.exponentialRampToValueAtTime(peak, at + 0.008);
    kickGain.gain.exponentialRampToValueAtTime(0.0001, at + decay + 0.02);
    kickOsc.connect(kickGain).connect(transport.beatBus);
    kickOsc.start(at);
    kickOsc.stop(at + decay + 0.04);
  }

  if (step.snare > 0) {
    const noise = context.createBufferSource();
    const snareFilter = context.createBiquadFilter();
    const snareGain = context.createGain();
    noise.buffer = ensureNoiseBuffer(context);
    snareFilter.type = "bandpass";
    snareFilter.frequency.setValueAtTime(1180 + (stepIndex % 3) * 160, at);
    snareFilter.Q.setValueAtTime(2.6, at);
    const peak = (step.snare === 2 ? 0.14 : 0.065) * holdLift;
    logNote(transport, "beat", GM_DRUMS.snare, at, 0.1, peak);
    const decay = step.snare === 2 ? 0.11 : 0.065;
    snareGain.gain.setValueAtTime(0.0001, at);
    snareGain.gain.exponentialRampToValueAtTime(peak, at + 0.005);
    snareGain.gain.exponentialRampToValueAtTime(0.0001, at + decay);
    noise.connect(snareFilter).connect(snareGain).connect(transport.beatBus);
    noise.start(at);
    noise.stop(at + decay + 0.02);

    const bodyOsc = context.createOscillator();
    const bodyGain = context.createGain();
    bodyOsc.type = "triangle";
    bodyOsc.frequency.setValueAtTime(midiToFrequency(score.root - 7), at);
    bodyOsc.frequency.exponentialRampToValueAtTime(midiToFrequency(score.root - 14), at + 0.055);
    bodyGain.gain.setValueAtTime(0.0001, at);
    bodyGain.gain.exponentialRampToValueAtTime(peak * 0.55, at + 0.005);
    bodyGain.gain.exponentialRampToValueAtTime(0.0001, at + 0.06);
    bodyOsc.connect(bodyGain).connect(transport.beatBus);
    bodyOsc.start(at);
    bodyOsc.stop(at + 0.075);
  }

  if (step.hat > 0) {
    const baseHatFreq = midiToFrequency(score.root + 19);
    const ratios = step.hat === 2 ? [1, 1.5] : [1];
    logNote(transport, "beat", step.hat === 2 ? GM_DRUMS.openHat : GM_DRUMS.hat, at, 0.08, step.hat === 2 ? 0.068 : 0.036);
    for (const [idx, ratio] of ratios.entries()) {
      const hatOsc = context.createOscillator();
      const hatGain = context.createGain();
      hatOsc.type = idx === 0 ? "triangle" : "sine";
      hatOsc.frequency.setValueAtTime(baseHatFreq * ratio, at);
      const decay = step.hat === 2 ? 0.13 : 0.048;
      const peak = (step.hat === 2 ? 0.068 : 0.036) * (idx === 0 ? 1 : 0.6) * holdLift;
      hatGain.gain.setValueAtTime(0.0001, at);
      hatGain.gain.exponentialRampToValueAtTime(peak, at + 0.004);
      hatGain.gain.exponentialRampToValueAtTime(0.0001, at + decay);
      hatOsc.connect(hatGain).connect(transport.beatBus);
      hatOsc.start(at);
      hatOsc.stop(at + decay + 0.02);
    }
  }
}

function scheduleBassStep(context, transport, score, stepIndex, at, stepDuration) {
  if (!transportEngages(transport, "bass") || !currentBass || !transport.bassBus) return;
  const step = currentBass.steps[stepIndex % currentBass.steps.length];
  if (!step || step.gate === 0) return;

  const nextStep = currentBass.steps[(stepIndex + 1) % currentBass.steps.length];
  const octaveShift = interaction.pitchBend > 0.45 ? 12 : (interaction.pitchBend < -0.45 ? -12 : 0);
  const baseMidi = foldIntoRange(score.root - (step.register > 0 ? 12 : 24) + step.interval + octaveShift, 28);
  const nextMidi = foldIntoRange(score.root - ((nextStep?.register || 0) > 0 ? 12 : 24) + (nextStep?.interval || 0) + octaveShift, 28);
  const freq = midiToFrequency(baseMidi);
  const glideFreq = midiToFrequency(nextMidi);

  const duration = Math.max(0.08, stepDuration * (step.gate === 2 ? 0.88 : 0.46));
  logNote(transport, "bass", baseMidi, at, duration, step.gate === 2 ? 1 : 0.7);
  const holdBoost = 1 + interaction.hold * 0.16;
  const peak = (step.accent ? 0.21 : 0.145) * holdBoost;

  const subOsc = context.createOscillator();
  const upperOsc = context.createOscillator();
  const upperGain = context.createGain();
  const bassFilter = context.createBiquadFilter();
  const amp = context.createGain();

  subOsc.type = "sine";
  upperOsc.type = "triangle";
  subOsc.frequency.setValueAtTime(freq, at);
  upperOsc.frequency.setValueAtTime(freq * 2, at);

  if (step.slide && nextStep && nextStep.gate > 0) {
    const glideStart = at + duration * 0.45;
    subOsc.frequency.setValueAtTime(freq, glideStart);
    subOsc.frequency.exponentialRampToValueAtTime(glideFreq, at + duration);
    upperOsc.frequency.setValueAtTime(freq * 2, glideStart);
    upperOsc.frequency.exponentialRampToValueAtTime(glideFreq * 2, at + duration);
  }

  upperGain.gain.value = step.accent ? 0.34 : 0.22;
  bassFilter.type = "lowpass";
  const cutoffMod = 1 + interaction.pitchBend * 0.35 + interaction.hold * 0.15;
  const startCutoff = Math.min(1850, freq * (step.accent ? 5.2 : 3.4) * Math.max(0.5, cutoffMod) + (score.bassGlide || 55) * 3);
  const endCutoff = Math.max(85, freq * 1.5);
  bassFilter.frequency.setValueAtTime(startCutoff, at);
  bassFilter.frequency.exponentialRampToValueAtTime(endCutoff, at + duration);
  bassFilter.Q.value = step.accent ? 2.8 : 1.6;

  amp.gain.setValueAtTime(0.0001, at);
  amp.gain.exponentialRampToValueAtTime(peak, at + 0.012);
  amp.gain.exponentialRampToValueAtTime(0.0001, at + duration + 0.025);

  subOsc.connect(bassFilter);
  upperOsc.connect(upperGain).connect(bassFilter);
  bassFilter.connect(amp).connect(transport.bassBus);

  subOsc.start(at);
  upperOsc.start(at);
  subOsc.stop(at + duration + 0.04);
  upperOsc.stop(at + duration + 0.04);
}

function scheduleHarmonyStep(context, transport, score, stepIndex, at, stepDuration) {
  if (!transportEngages(transport, "harmony") || !currentHarmony || !transport.harmonyBus) return;
  const step = currentHarmony.steps[stepIndex % currentHarmony.steps.length];
  if (!step || step.gate === 0) return;

  const isSustained = step.gate === 2;
  const duration = Math.max(0.18, stepDuration * (isSustained ? 1.45 : 0.78));
  const strumSec = (step.strumMs || 24) / 1000;
  const holdBoost = 1 + interaction.hold * 0.14;
  const waveforms = [
    ["triangle", "sine", "triangle"],
    ["sine", "triangle", "sine"],
    ["triangle", "sine", "sine"],
    ["sine", "sine", "triangle"],
  ][score.harmonyMode % 4];

  const harmonyShift = interaction.pitchBend > 0.35 ? 7 : (interaction.pitchBend < -0.35 ? -5 : 0);
  for (const [voiceIndex, interval] of step.chord.entries()) {
    const noteStart = at + voiceIndex * strumSec;
    const midi = foldIntoRange(score.root + interval + harmonyShift, 36, 84);
    const freq = midiToFrequency(midi);
    logNote(transport, "harmony", midi, noteStart, duration, isSustained ? 1 : 0.75);
    const osc = context.createOscillator();
    const voiceGain = context.createGain();

    osc.type = waveforms[voiceIndex % waveforms.length];
    osc.frequency.setValueAtTime(freq, noteStart);
    osc.detune.setValueAtTime((voiceIndex - 1) * 1.8 * (step.mirror === "/" ? 1 : -1), noteStart);

    const peak = (isSustained ? 0.056 : 0.044) * (1 - voiceIndex * 0.14) * holdBoost;
    const attack = isSustained ? 0.045 : 0.018;
    voiceGain.gain.setValueAtTime(0.0001, noteStart);
    voiceGain.gain.exponentialRampToValueAtTime(peak, noteStart + attack);
    voiceGain.gain.exponentialRampToValueAtTime(0.0001, noteStart + duration);

    osc.connect(voiceGain).connect(transport.harmonyBus);
    osc.start(noteStart);
    osc.stop(noteStart + duration + 0.04);
  }
}

function scheduleChimeStep(context, transport, score, stepIndex, at, stepDuration) {
  if (!transportEngages(transport, "chime") || !currentChimes || !transport.chimeBus) return;
  const step = currentChimes.steps[stepIndex % currentChimes.steps.length];
  if (!step || step.gate === 0) return;

  const isAccented = step.gate === 2;
  const chimeOctave = interaction.pitchBend > 0.4 ? 12 : (interaction.pitchBend < -0.4 ? -12 : 0);
  const rootMidi = Math.min(84, score.root + 12 + chimeOctave);
  const rootFreq = midiToFrequency(rootMidi);
  const bellFreq = rootFreq * step.ratioValue;
  // Just-intonation ratios round to the nearest equal-tempered MIDI note.
  logNote(transport, "chime", rootMidi + 12 * Math.log2(step.ratioValue), at, stepDuration * (isAccented ? 1.6 : 1.0), isAccented ? 1 : 0.7);
  const holdBoost = 1 + interaction.hold * 0.16;

  // 1. FRACTRAN Just Intonation overtone chime bell locked to active Tonnetz chord
  const bellOsc = context.createOscillator();
  const bellGain = context.createGain();
  bellOsc.type = "sine";
  bellOsc.frequency.setValueAtTime(bellFreq, at);
  const bellDuration = Math.max(0.24, stepDuration * (isAccented ? 1.6 : 1.0));
  const bellPeak = (isAccented ? 0.054 : 0.036) * holdBoost;
  bellGain.gain.setValueAtTime(0.0001, at);
  bellGain.gain.exponentialRampToValueAtTime(bellPeak, at + 0.008);
  bellGain.gain.exponentialRampToValueAtTime(0.0001, at + bellDuration);
  bellOsc.connect(bellGain).connect(transport.chimeBus);
  bellOsc.start(at);
  bellOsc.stop(at + bellDuration + 0.04);

  if (isAccented) {
    const overtoneOsc = context.createOscillator();
    const overtoneGain = context.createGain();
    const overtoneMult = step.exponents.e3 % 2 === 0 ? 2 : 1.5;
    overtoneOsc.type = "sine";
    overtoneOsc.frequency.setValueAtTime(Math.min(3600, bellFreq * overtoneMult), at);
    overtoneGain.gain.setValueAtTime(0.0001, at);
    overtoneGain.gain.exponentialRampToValueAtTime(bellPeak * 0.3, at + 0.006);
    overtoneGain.gain.exponentialRampToValueAtTime(0.0001, at + bellDuration * 0.65);
    overtoneOsc.connect(overtoneGain).connect(transport.chimeBus);
    overtoneOsc.start(at);
    overtoneOsc.stop(at + bellDuration * 0.65 + 0.03);
  }

  // 2. Piet Codel Synesthetic Spectral Pad
  const registerMult = [1.0, 0.5, 0.5][step.lightnessIndex % 3];
  const padFreq = bellFreq * registerMult;
  const detuneCents = (step.hueIndex + 1) * 1.4;
  const padDuration = Math.max(0.28, stepDuration * (isAccented ? 1.45 : 0.95));
  const padFilter = context.createBiquadFilter();
  padFilter.type = "lowpass";
  padFilter.frequency.setValueAtTime(
    580 + step.hueIndex * 180 + (2 - step.lightnessIndex) * 260,
    at,
  );
  padFilter.Q.setValueAtTime(1.4, at);

  const padGain = context.createGain();
  const padPeak = (isAccented ? 0.036 : 0.025) * holdBoost;
  padGain.gain.setValueAtTime(0.0001, at);
  padGain.gain.exponentialRampToValueAtTime(padPeak, at + 0.06);
  padGain.gain.exponentialRampToValueAtTime(0.0001, at + padDuration);

  for (const sign of [-1, 1]) {
    const padOsc = context.createOscillator();
    padOsc.type = "sine";
    padOsc.frequency.setValueAtTime(padFreq, at);
    padOsc.detune.setValueAtTime(sign * detuneCents, at);
    padOsc.connect(padFilter);
    padOsc.start(at);
    padOsc.stop(at + padDuration + 0.04);
  }
  padFilter.connect(padGain).connect(transport.chimeBus);
}

function scheduleChantStep(context, transport, score, stepIndex, at, stepDuration) {
  if (!transportEngages(transport, "chant") || !currentChant || !transport.chantBus) return;
  const step = currentChant.steps[stepIndex % currentChant.steps.length];
  if (!step || step.gate === 0) return;

  const isSoliloquy = step.gate === 2;
  const duration = Math.max(0.24, stepDuration * (isSoliloquy ? 1.65 : 1.15));
  const chantShift = interaction.pitchBend > 0.35 ? 7 : (interaction.pitchBend < -0.35 ? -5 : 0);
  const midi = foldIntoRange(score.root + step.registerOffset + step.interval + chantShift, 40, 82);
  const baseFreq = midiToFrequency(midi);
  logNote(transport, "chant", midi, at, duration, isSoliloquy ? 1 : 0.75);
  const holdBoost = 1 + interaction.hold * 0.14;

  // Glottal source with gentle triangle-dominant blend and smooth vibrato
  const glottalMix = context.createGain();
  glottalMix.gain.setValueAtTime(1, at);

  const oscA = context.createOscillator();
  const oscB = context.createOscillator();
  const oscBGain = context.createGain();
  oscA.type = "triangle";
  oscB.type = "sawtooth";
  oscBGain.gain.setValueAtTime(0.38, at);
  oscA.frequency.setValueAtTime(baseFreq, at);
  oscB.frequency.setValueAtTime(baseFreq * 1.0015, at);

  const lfo = context.createOscillator();
  const lfoGain = context.createGain();
  lfo.type = "sine";
  lfo.frequency.setValueAtTime(step.vibratoHz || 5.1, at);
  lfoGain.gain.setValueAtTime(isSoliloquy ? 2.4 : 1.6, at);
  lfo.connect(lfoGain);
  lfoGain.connect(oscA.frequency);
  lfoGain.connect(oscB.frequency);

  oscA.connect(glottalMix);
  oscB.connect(oscBGain).connect(glottalMix);

  // Parallel 3-formant vocal tract bandpass bank (F1, F2, F3)
  const voiceAmp = context.createGain();
  const peak = (isSoliloquy ? 0.068 : 0.048) * holdBoost;
  voiceAmp.gain.setValueAtTime(0.0001, at);
  voiceAmp.gain.exponentialRampToValueAtTime(peak, at + 0.055);
  voiceAmp.gain.exponentialRampToValueAtTime(0.0001, at + duration);

  const formantShift = 1 + interaction.pitchBend * 0.22 + interaction.hold * 0.08;
  const formants = [
    { freq: step.f1 * formantShift, q: 4.5 + (step.formantResonance || 55) * 0.025, weight: 1.0 },
    { freq: step.f2 * formantShift, q: 5.8 + (step.formantResonance || 55) * 0.03, weight: 0.62 },
    { freq: step.f3 * formantShift, q: 7.0 + (step.formantResonance || 55) * 0.035, weight: 0.28 },
  ];

  for (const f of formants) {
    const bp = context.createBiquadFilter();
    const fGain = context.createGain();
    bp.type = "bandpass";
    bp.frequency.setValueAtTime(f.freq, at);
    bp.Q.setValueAtTime(f.q, at);
    fGain.gain.setValueAtTime(f.weight, at);
    glottalMix.connect(bp).connect(fGain).connect(voiceAmp);
  }

  voiceAmp.connect(transport.chantBus);
  oscA.start(at);
  oscB.start(at);
  lfo.start(at);
  oscA.stop(at + duration + 0.04);
  oscB.stop(at + duration + 0.04);
  lfo.stop(at + duration + 0.04);
}

// The mycelium's spikes, drops, and spore puffs, from its sporophore form's
// own sound (src/mycelium.mjs, D-042).
function scheduleFungalBioStep(context, transport, score, stepIndex, at, stepDuration) {
  if (!transport.fungalBus) return;
  const bus = transport.fungalBus;
  for (const event of myceliumEvents(score, stepIndex, interaction.hold)) {
    const start = at + event.at * stepDuration;
    const end = start + event.decay;
    const gain = context.createGain();
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(event.peak, start + Math.min(0.006, event.decay / 3));
    gain.gain.exponentialRampToValueAtTime(0.0001, end);
    const panner = context.createStereoPanner ? context.createStereoPanner() : null;
    panner?.pan.setValueAtTime(event.pan, start);
    (panner ? gain.connect(panner) : gain).connect(bus);

    let source;
    if (event.kind === "noise") {
      source = context.createBufferSource();
      source.buffer = ensureNoiseBuffer(context);
    } else {
      source = context.createOscillator();
      source.type = event.wave;
      source.frequency.setValueAtTime(event.freq, start);
      if (event.to !== event.freq) source.frequency.exponentialRampToValueAtTime(event.to, end);
    }
    if (event.band) {
      const band = context.createBiquadFilter();
      band.type = "bandpass";
      band.frequency.setValueAtTime(event.band[0], start);
      band.Q.setValueAtTime(event.band[1], start);
      source.connect(band).connect(gain);
    } else {
      source.connect(gain);
    }
    source.start(start);
    source.stop(end + 0.01);
  }
}

function getFunMachineDirectDestination(context) {
  if (currentTransport?.funBus) return currentTransport.funBus;
  if (currentTransport?.output) return currentTransport.output;
  if (!funMachineDryGain || funMachineDryGain.context !== context) {
    funMachineDryGain = context.createGain();
    funMachineDryGain.connect(context.destination);
  }
  funMachineDryGain.gain.value = masterGainFor(masterVolume);
  return funMachineDryGain;
}

// --- Fun Machine accompanist voices (D-028) ---------------------------------
//
// Three synth voices, none of them an organ: a slow-blooming stereo pad for the
// chords, a soft plucked arpeggio, and a singing lead with glide and delayed
// vibrato. All of them land on the band's own step grid and run through the
// Fun Machine strip, which feeds the delay and chamber reverb.

// Pads still sounding (or scheduled) from held keys, so a key change or release
// can fade them instead of letting an old chord ring under a new one.
const funPadHandles = new Set();

// The voice the Fun Machine plays in, chosen with the VOICE chips. Not saved
// yet, and recorded takes play in it too: sessions v5 and per-slot voices
// arrive in P5-28 phase 4, the creature's own voice in phase 3 (D-040).
let funVoiceId = DEFAULT_VOICE_ID;
function currentFunVoice() {
  return voiceById(funVoiceId);
}

/**
 * Schedules one pad chord in the current Fun Machine voice (D-040), under one
 * envelope whose attack scales with the chord's length. The release overlaps
 * the next chord so changes crossfade. Returns a handle for releaseFunPads().
 */
function schedulePadChord(context, destination, chord, at, duration, { level = 1, voicing = null, transport = null, releasable = true, voice = currentFunVoice() } = {}) {
  if (!chord) return null;
  const notes = voicing || padVoicing(chord);
  const start = Math.max(context.currentTime + 0.01, at);
  const sounding = Math.max(0.3, duration);
  const { env, oscillators, stopAt, peak } = scheduleVoicePad(context, destination, voice, notes, { start, sounding, level, hold: interaction.hold });
  if (transport) for (const midi of notes) logNote(transport, "fun", midi, start, sounding, peak);

  const handle = { env, oscillators, stopAt };
  // Only live pads can be released; offline renders keep their own clock, and
  // recorded loop layers ring out on their own when a live key lets go.
  if (context === audioContext && releasable) {
    funPadHandles.add(handle);
    window.setTimeout(() => funPadHandles.delete(handle), Math.max(0, (stopAt - context.currentTime) * 1000) + 200);
  }
  return handle;
}

// Fades every live pad (including ones scheduled a moment ahead) over `fade`.
function releaseFunPads(context, fade = 0.5) {
  if (!context) return;
  const now = context.currentTime;
  for (const handle of funPadHandles) {
    handle.env.gain.cancelScheduledValues(now);
    handle.env.gain.setTargetAtTime(0.0001, now, fade / 4);
    for (const osc of handle.oscillators) {
      try {
        osc.stop(now + fade * 1.5);
      } catch {
        // Already stopped.
      }
    }
  }
  funPadHandles.clear();
}

// A pluck for each arpeggio note, in the current voice.
function scheduleArpNote(context, destination, midi, at, duration, { accent = false, pan = 0, transport = null, voice = currentFunVoice() } = {}) {
  const start = Math.max(context.currentTime + 0.005, at);
  const { decay, peak } = scheduleVoicePluck(context, destination, voice, midi, { start, duration, accent, pan, hold: interaction.hold });
  if (transport) logNote(transport, "fun", midi, start, decay, peak);
}

// The composer's line, gliding from the previous note, in the current voice.
function scheduleFunLeadNote(context, destination, midi, at, duration, { glideFrom = null, transport = null, voice = currentFunVoice() } = {}) {
  const start = Math.max(context.currentTime + 0.01, at);
  const { sounding, peak } = scheduleVoiceLead(context, destination, voice, midi, { start, duration, glideFrom, hold: interaction.hold });
  if (transport) logNote(transport, "fun", midi, start, sounding, peak);
}

// A negative step clears every plate's playhead (transport stopped).
function highlightBeatStep(stepIndex) {
  const normalized = stepIndex < 0 ? -1 : stepIndex % 12;
  activeBeatStep = normalized;
  if (elements.beatGrid) {
    for (const button of elements.beatGrid.querySelectorAll(".beat-step")) {
      const idx = Number(button.dataset.step);
      button.classList.toggle("is-current", idx === normalized);
    }
  }
  if (elements.bassGrid) {
    for (const button of elements.bassGrid.querySelectorAll(".bass-step")) {
      const idx = Number(button.dataset.step);
      button.classList.toggle("is-current", idx === normalized);
    }
  }
  if (elements.harmonyGrid) {
    for (const button of elements.harmonyGrid.querySelectorAll(".harmony-step")) {
      const idx = Number(button.dataset.step);
      button.classList.toggle("is-current", idx === normalized);
    }
  }
  if (elements.chimeGrid) {
    for (const button of elements.chimeGrid.querySelectorAll(".chime-step")) {
      const idx = Number(button.dataset.step);
      button.classList.toggle("is-current", idx === normalized);
    }
  }
  if (elements.chantGrid) {
    for (const button of elements.chantGrid.querySelectorAll(".chant-step")) {
      const idx = Number(button.dataset.step);
      button.classList.toggle("is-current", idx === normalized);
    }
  }

  if (elements.harmonicStep) {
    elements.harmonicStep.textContent = normalized < 0 ? "-- / 12" : `${String(normalized + 1).padStart(2, "0")} / 12`;
  }
  if (currentConductedSpine && currentConductedSpine[normalized]) {
    const chord = currentConductedSpine[normalized];
    if (elements.harmonicChord) {
      elements.harmonicChord.textContent = chordLabelFor(chord, currentScore ? currentScore.root : 60);
    }
    if (elements.harmonicVector) {
      elements.harmonicVector.textContent = chord.op || "—";
    }
    if (elements.harmonicEuler) {
      if (chord.quality === "raw") {
        elements.harmonicEuler.textContent = "RAW VM";
      } else {
        const melOffset = currentConductedMelody ? currentConductedMelody[normalized] : 0;
        const bassOffset = currentBass?.steps?.[normalized]?.interval ?? 0;
        const g = semitoneGradus(melOffset - bassOffset);
        const flavor = g <= 5 ? "Sweet" : g <= 8 ? "Balanced" : "Dissonant";
        elements.harmonicEuler.textContent = `G = ${g} (${flavor})`;
      }
    }
    const regionIdx = Math.floor(normalized / 3) % 4;
    const compassNodes = [elements.compassReg0, elements.compassReg1, elements.compassReg2, elements.compassReg3];
    compassNodes.forEach((node, idx) => {
      if (node) node.classList.toggle("is-active", idx === regionIdx);
    });
  }

  if (normalized >= 0 && elements.funMachineTelemetry && activeHeldFunKey !== null && activeFunPerformance) {
    const stepInfo = activeFunPerformance.steps[normalized];
    elements.funMachineTelemetry.textContent = `${funKeyLabel(activeHeldFunKey)} · ${STYLE_LABELS[activeFunPerformance.style]} · STEP @${String(normalized + 1).padStart(2, "0")} · ${chordText(stepInfo.chord)} · THE BAND FOLLOWS`;
  }
}

// --- Plate state shared by cell edits, mutations, and sessions (P5-20) -----

// Clicks per cell since the plate was last composed. Cells cycle independently,
// so these counts (not the click order) are enough to rebuild a plate.
const plateCellCycles = {
  beat: Array(12).fill(0),
  bass: Array(12).fill(0),
  harmony: Array(12).fill(0),
  chime: Array(12).fill(0),
  chant: Array(12).fill(0),
};

const PLATE_CELL_CYCLERS = Object.freeze({
  beat: (step) => cycleBeatStep(step),
  bass: (step) => cycleBassCell(step, melodyFor(currentScore)),
  harmony: (step) => cycleHarmonyCell(step, currentScore),
  chime: (step) => cycleChimeCell(step),
  chant: (step) => cycleChantCell(step, currentScore),
});

function plateRaw(id) {
  switch (id) {
    case "beat": return rawBeat || currentBeat;
    case "bass": return rawBass || currentBass;
    case "harmony": return rawHarmony || currentHarmony;
    case "chime": return rawChimes || currentChimes;
    case "chant": return rawChant || currentChant;
    default: return null;
  }
}

function setPlateRaw(id, value) {
  switch (id) {
    case "beat": rawBeat = value; break;
    case "bass": rawBass = value; break;
    case "harmony": rawHarmony = value; break;
    case "chime": rawChimes = value; break;
    case "chant": rawChant = value; break;
    default: break;
  }
}

function applyCellCycle(id, index, times = 1) {
  const base = plateRaw(id);
  if (!base || times <= 0) return;
  const nextSteps = [...base.steps];
  for (let n = 0; n < times; n += 1) nextSteps[index] = PLATE_CELL_CYCLERS[id](nextSteps[index]);
  setPlateRaw(id, Object.freeze({ ...base, steps: Object.freeze(nextSteps) }));
}

function cyclePlateCell(id, index) {
  applyCellCycle(id, index);
  plateCellCycles[id][index] += 1;
}

function plateMutation(id) {
  return { beat: beatMutation, bass: bassMutation, harmony: harmonyMutation, chime: chimeMutation, chant: chantMutation }[id];
}

// Recomposes a plate from its VM at the current mutation count, discarding cell
// edits, and refreshes its telemetry line.
function recomposePlate(id) {
  if (!currentScore) return;
  plateCellCycles[id] = Array(12).fill(0);
  if (id === "beat" && beatSource) {
    rawBeat = composeBeat(beatSource, currentScore, beatMutation);
    currentBeat = rawBeat;
    if (elements.beatTelemetry && beatMutation > 0) {
      elements.beatTelemetry.textContent = `3¹⁰ TAPE · ${currentBeat.stepsExecuted} OPS · MUTATION #${beatMutation}`;
    }
  } else if (id === "bass" && bassSource) {
    rawBass = composeBass(bassSource, currentScore, bassMutation);
    currentBass = rawBass;
    if (elements.bassTelemetry && bassMutation > 0) {
      elements.bassTelemetry.textContent = `256-CELL TAPE · ${currentBass.stepsExecuted} OPS · SHIFT #${bassMutation}`;
    }
  } else if (id === "harmony" && harmonySource) {
    rawHarmony = composeHarmony(harmonySource, currentScore, harmonyMutation);
    currentHarmony = rawHarmony;
    if (elements.harmonyTelemetry && harmonyMutation > 0) {
      elements.harmonyTelemetry.textContent = `2D TORUS · ${currentHarmony.stepsExecuted} OPS · DEFLECTION #${harmonyMutation}`;
    }
  } else if (id === "chime" && pietSource && fractranSource) {
    rawChimes = composeChimes(pietSource, fractranSource, currentScore, chimeMutation);
    currentChimes = rawChimes;
    if (elements.chimeTelemetry && chimeMutation > 0) {
      elements.chimeTelemetry.textContent = `${currentChimes.pietStepsExecuted} CODELS · ${currentChimes.fractranStepsExecuted} RATIOS · REFRACTION #${chimeMutation}`;
    }
  } else if (id === "chant" && chantSource) {
    rawChant = composeChant(chantSource, currentScore, chantMutation);
    currentChant = rawChant;
    if (elements.chantTelemetry && chantMutation > 0) {
      elements.chantTelemetry.textContent = `3 ACTS · ${currentChant.statementsExecuted} CUES · RECAST #${chantMutation}`;
    }
  }
}

function updateBeatGrid() {
  if (!elements.beatGrid) return;
  const steps = currentBeat?.steps || [];
  for (const button of elements.beatGrid.querySelectorAll(".beat-step")) {
    const idx = Number(button.dataset.step);
    const step = steps[idx] || { kick: 0, snare: 0, hat: 0, trits: "000" };
    const kickPip = button.querySelector(".pip-kick");
    const snarePip = button.querySelector(".pip-snare");
    const hatPip = button.querySelector(".pip-hat");
    const tritsEl = button.querySelector(".step-trits");
    if (kickPip) kickPip.dataset.level = String(step.kick);
    if (snarePip) snarePip.dataset.level = String(step.snare);
    if (hatPip) hatPip.dataset.level = String(step.hat);
    if (tritsEl) tritsEl.textContent = step.trits;
    button.setAttribute(
      "aria-label",
      `Step ${idx + 1}: ternary ${step.trits}, kick ${step.kick}, snare ${step.snare}, chime ${step.hat}`,
    );
  }
}

function renderBeatGrid() {
  if (!elements.beatGrid) return;
  elements.beatGrid.innerHTML = "";
  for (let index = 0; index < 12; index += 1) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "beat-step";
    button.dataset.step = String(index);
    button.innerHTML = `
      <span class="step-index">${String(index + 1).padStart(2, "0")}</span>
      <span class="step-pips" aria-hidden="true">
        <span class="voice-pip pip-kick" data-level="0"></span>
        <span class="voice-pip pip-snare" data-level="0"></span>
        <span class="voice-pip pip-hat" data-level="0"></span>
      </span>
      <span class="step-trits">000</span>
    `;
    button.addEventListener("click", () => {
      if (!currentBeat) return;
      cyclePlateCell("beat", index);
      applyEnsembleConductor();
      updateBeatGrid();
      if (audioContext && currentTransport && currentScore && !muted) {
        scheduleBeatStep(audioContext, currentTransport, currentScore, index, audioContext.currentTime + 0.01, 0.18);
      }
    });
    elements.beatGrid.append(button);
  }
}

function updateBassGrid() {
  if (!elements.bassGrid) return;
  const steps = currentBass?.steps || [];
  for (const button of elements.bassGrid.querySelectorAll(".bass-step")) {
    const idx = Number(button.dataset.step);
    const step = steps[idx] || { cell: 0, gate: 0, register: 0, slide: 0, accent: 0, label: "---" };
    const gatePip = button.querySelector(".pip-gate");
    const regPip = button.querySelector(".pip-reg");
    const slidePip = button.querySelector(".pip-slide");
    const labelEl = button.querySelector(".step-trits");
    const byteEl = button.querySelector(".cell-byte");
    button.dataset.gate = String(step.gate);
    button.dataset.accent = String(step.accent);
    if (gatePip) gatePip.dataset.level = String(step.gate);
    if (regPip) regPip.dataset.level = String(step.register ? 2 : 0);
    if (slidePip) slidePip.dataset.level = String(step.slide ? 2 : (step.accent ? 1 : 0));
    if (labelEl) labelEl.textContent = step.label;
    if (byteEl) byteEl.textContent = `[${String(step.cell).padStart(3, "0")}]`;
    button.setAttribute(
      "aria-label",
      `Tape cell ${idx}: ${step.label}, byte ${step.cell}`,
    );
  }
}

function renderBassGrid() {
  if (!elements.bassGrid) return;
  elements.bassGrid.innerHTML = "";
  for (let index = 0; index < 12; index += 1) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "beat-step bass-step";
    button.dataset.step = String(index);
    button.innerHTML = `
      <span class="step-index">@${String(index).padStart(2, "0")}</span>
      <span class="step-pips" aria-hidden="true">
        <span class="voice-pip pip-gate" data-level="0"></span>
        <span class="voice-pip pip-reg" data-level="0"></span>
        <span class="voice-pip pip-hat pip-slide" data-level="0"></span>
      </span>
      <span class="step-trits">---</span>
      <span class="cell-byte">[000]</span>
    `;
    button.addEventListener("click", () => {
      if (!currentBass || !currentScore) return;
      cyclePlateCell("bass", index);
      applyEnsembleConductor();
      if (audioContext && currentTransport && !muted) {
        scheduleBassStep(audioContext, currentTransport, currentScore, index, audioContext.currentTime + 0.01, 0.24);
      }
    });
    elements.bassGrid.append(button);
  }
}

function updateHarmonyGrid() {
  if (!elements.harmonyGrid) return;
  const steps = currentHarmony?.steps || [];
  for (const button of elements.harmonyGrid.querySelectorAll(".harmony-step")) {
    const idx = Number(button.dataset.step);
    const step = steps[idx] || { raw: 0, gate: 0, mirror: "/", label: "REST" };
    const idxEl = button.querySelector(".step-index");
    const rootPip = button.querySelector(".pip-root");
    const thirdPip = button.querySelector(".pip-third");
    const fifthPip = button.querySelector(".pip-fifth");
    const labelEl = button.querySelector(".step-trits");
    const byteEl = button.querySelector(".cell-byte");
    button.dataset.gate = String(step.gate);
    if (idxEl) idxEl.textContent = `${String(idx + 1).padStart(2, "0")}${step.mirror}`;
    if (rootPip) rootPip.dataset.level = String(step.gate);
    if (thirdPip) thirdPip.dataset.level = String(step.gate > 0 ? (step.mirror === "/" ? 2 : 1) : 0);
    if (fifthPip) fifthPip.dataset.level = String(step.gate === 2 ? 2 : (step.gate === 1 ? 1 : 0));
    if (labelEl) labelEl.textContent = step.label;
    if (byteEl) byteEl.textContent = `#${String(step.raw).padStart(3, "0")}`;
    button.setAttribute(
      "aria-label",
      `Mirror node ${idx + 1} (${step.mirror}): ${step.label}, stack ${step.raw}`,
    );
  }
}

function renderHarmonyGrid() {
  if (!elements.harmonyGrid) return;
  elements.harmonyGrid.innerHTML = "";
  for (let index = 0; index < 12; index += 1) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "beat-step harmony-step";
    button.dataset.step = String(index);
    button.innerHTML = `
      <span class="step-index">${String(index + 1).padStart(2, "0")}/</span>
      <span class="step-pips" aria-hidden="true">
        <span class="voice-pip pip-root" data-level="0"></span>
        <span class="voice-pip pip-third" data-level="0"></span>
        <span class="voice-pip pip-hat pip-fifth" data-level="0"></span>
      </span>
      <span class="step-trits">REST</span>
      <span class="cell-byte">#000</span>
    `;
    button.addEventListener("click", () => {
      if (!currentHarmony || !currentScore) return;
      cyclePlateCell("harmony", index);
      applyEnsembleConductor();
      if (audioContext && currentTransport && !muted) {
        scheduleHarmonyStep(audioContext, currentTransport, currentScore, index, audioContext.currentTime + 0.01, 0.28);
      }
    });
    elements.harmonyGrid.append(button);
  }
}

const CODEL_SWATCHES = Object.freeze([
  ["#f38c8c", "#f3e28c", "#98eb98", "#8cebf3", "#98a9f3", "#eb98f3"],
  ["#cf4848", "#cfb83e", "#46b858", "#3eb8cf", "#4d66cf", "#b846cf"],
  ["#7d2222", "#7d6b1a", "#216e2d", "#1c6e7d", "#26367d", "#6e217d"],
]);

function updateChimeGrid() {
  if (!elements.chimeGrid) return;
  const steps = currentChimes?.steps || [];
  for (const button of elements.chimeGrid.querySelectorAll(".chime-step")) {
    const idx = Number(button.dataset.step);
    const step = steps[idx] || {
      gate: 0,
      codelCode: "LC",
      hueIndex: 3,
      lightnessIndex: 0,
      fraction: "35/6",
      exponents: { e2: 1, e3: 1, e5: 0, e7: 0 },
      label: "REST",
    };
    const idxEl = button.querySelector(".step-index");
    const p2Pip = button.querySelector(".pip-p2");
    const p3Pip = button.querySelector(".pip-p3");
    const p57Pip = button.querySelector(".pip-p57");
    const labelEl = button.querySelector(".step-trits");
    const byteEl = button.querySelector(".cell-byte");
    button.dataset.gate = String(step.gate);
    const swatch = CODEL_SWATCHES[step.lightnessIndex % 3]?.[step.hueIndex % 6] || "#8cebf3";
    button.style.setProperty("--codel-color", swatch);
    if (idxEl) idxEl.textContent = `${String(idx + 1).padStart(2, "0")}·${step.codelCode}`;
    if (p2Pip) p2Pip.dataset.level = String(step.gate === 0 ? 0 : Math.min(2, step.exponents.e2));
    if (p3Pip) p3Pip.dataset.level = String(step.gate === 0 ? 0 : Math.min(2, step.exponents.e3));
    if (p57Pip) p57Pip.dataset.level = String(step.gate === 0 ? 0 : Math.min(2, step.exponents.e5 + step.exponents.e7));
    if (labelEl) labelEl.textContent = step.label;
    if (byteEl) byteEl.textContent = step.fraction;
    button.setAttribute(
      "aria-label",
      `Codel ${idx + 1} (${step.codelCode}): ratio ${step.label}, fraction ${step.fraction}`,
    );
  }
}

function renderChimeGrid() {
  if (!elements.chimeGrid) return;
  elements.chimeGrid.innerHTML = "";
  for (let index = 0; index < 12; index += 1) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "beat-step chime-step";
    button.dataset.step = String(index);
    button.innerHTML = `
      <span class="step-index">${String(index + 1).padStart(2, "0")}·LC</span>
      <span class="step-pips" aria-hidden="true">
        <span class="voice-pip pip-p2" data-level="0"></span>
        <span class="voice-pip pip-p3" data-level="0"></span>
        <span class="voice-pip pip-hat pip-p57" data-level="0"></span>
      </span>
      <span class="step-trits">1/1 LC</span>
      <span class="cell-byte">35/6</span>
    `;
    button.addEventListener("click", () => {
      if (!currentChimes || !currentScore) return;
      cyclePlateCell("chime", index);
      applyEnsembleConductor();
      if (audioContext && currentTransport && !muted) {
        scheduleChimeStep(audioContext, currentTransport, currentScore, index, audioContext.currentTime + 0.01, 0.3);
      }
    });
    elements.chimeGrid.append(button);
  }
}

function updateChantGrid() {
  if (!elements.chantGrid) return;
  const steps = currentChant?.steps || [];
  for (const button of elements.chantGrid.querySelectorAll(".chant-step")) {
    const idx = Number(button.dataset.step);
    const step = steps[idx] || {
      gate: 0,
      scene: `SCENE ${idx + 1}`,
      personaShort: "HAM",
      vowelIpa: "/ɑ/",
      f1: 730,
      f2: 1090,
      label: "SILENT",
    };
    const idxEl = button.querySelector(".step-index");
    const f1Pip = button.querySelector(".pip-f1");
    const f2Pip = button.querySelector(".pip-f2");
    const f3Pip = button.querySelector(".pip-f3");
    const labelEl = button.querySelector(".step-trits");
    const byteEl = button.querySelector(".cell-byte");
    button.dataset.gate = String(step.gate);
    if (idxEl) idxEl.textContent = step.scene.replace("SCENE ", "SC·");
    if (f1Pip) f1Pip.dataset.level = String(step.gate === 0 ? 0 : (step.f1 > 500 ? 2 : 1));
    if (f2Pip) f2Pip.dataset.level = String(step.gate === 0 ? 0 : (step.f2 > 1500 ? 2 : 1));
    if (f3Pip) f3Pip.dataset.level = String(step.gate === 2 ? 2 : (step.gate === 1 ? 1 : 0));
    if (labelEl) labelEl.textContent = step.label;
    if (byteEl) byteEl.textContent = step.vowelIpa;
    button.setAttribute(
      "aria-label",
      `${step.scene} (${step.personaShort}): ${step.label} ${step.vowelIpa}`,
    );
  }
}

function renderChantGrid() {
  if (!elements.chantGrid) return;
  elements.chantGrid.innerHTML = "";
  for (let index = 0; index < 12; index += 1) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "beat-step chant-step";
    button.dataset.step = String(index);
    button.innerHTML = `
      <span class="step-index">SC·${index + 1}</span>
      <span class="step-pips" aria-hidden="true">
        <span class="voice-pip pip-f1" data-level="0"></span>
        <span class="voice-pip pip-f2" data-level="0"></span>
        <span class="voice-pip pip-hat pip-f3" data-level="0"></span>
      </span>
      <span class="step-trits">HAM·AH</span>
      <span class="cell-byte">/ɑ/</span>
    `;
    button.addEventListener("click", () => {
      if (!currentChant || !currentScore) return;
      cyclePlateCell("chant", index);
      applyEnsembleConductor();
      if (audioContext && currentTransport && !muted) {
        scheduleChantStep(audioContext, currentTransport, currentScore, index, audioContext.currentTime + 0.01, 0.32);
      }
    });
    elements.chantGrid.append(button);
  }
}

function updateBandstandStatus() {
  if (!elements.bandstandStatus) return;
  const players = ["lead", ...ACCOMPANIMENT_CHANNEL_IDS];
  const activeCount = players.filter(channelEngaged).length;
  if (activeCount === 6) {
    elements.bandstandStatus.textContent = "ALL SIX ESOTERIC PLAYERS ENGAGED";
  } else if (activeCount === 1 && channelEngaged("lead")) {
    elements.bandstandStatus.textContent = "SOLO LOLCODE BANDLEADER · ACCOMPANIMENT SILENCED";
  } else {
    elements.bandstandStatus.textContent = `${activeCount} OF 6 ESOTERIC PLAYERS ENGAGED`;
  }
}

function updateFunKeyboardChordLabels() {
  // Key colours come from the Inform 7 rulebooks; the labels fill in once they load.
  if (!rulebooksInstalled()) return;
  for (let semitone = 0; semitone <= 12; semitone += 1) {
    const el = document.querySelector(`#fun-chord-${semitone}`);
    if (!el) continue;
    el.textContent = chordText(buildFunChord(semitone, "auto", activeGenre, currentScore ? currentScore.root : 0));
  }
}

// While a key is held the LOLCODE lead steps back so the player's part leads
// and the band follows it (D-028).
const LEAD_DUCK_GAIN = 10 ** (-10 / 20);
const FUN_PAD_LEVEL = Object.freeze({ swell: 1, arpeggio: 0.55, progression: 0.8 });

function loopStepDuration(score, step) {
  const rhythm = RHYTHMS[score.rhythm];
  return (60 / (activeTempoBpm || score.pulse) / 2) * rhythm[((step % rhythm.length) + rhythm.length) % rhythm.length];
}

function funKeyLabel(semitone) {
  const keyInfo = FUN_KEY_MAP[semitone];
  return keyInfo ? `[${keyInfo.displayKey}] ${keyInfo.note}` : `KEY #${semitone}`;
}

/**
 * A held key becomes a performance in the selected style. The band is
 * re-conducted onto its chords at once; with the loop running, a pad bridges
 * to the next region start, where the scheduler takes over in the band's
 * rhythm. With the loop stopped, the key auditions a sustained pad.
 */
async function triggerFunKey(semitone, isKeyDown = true) {
  // The accompanist plays genre colours, so the manual is silent until the rulebooks load.
  if (semitone === null || semitone === undefined || !rulebooksInstalled()) return;
  const normSemi = ((Math.trunc(semitone) % 13) + 13) % 13;
  const keyBtn = elements.funKeyboard?.querySelector(`.fun-key[data-semitone="${normSemi}"]`);

  if (!isKeyDown) {
    if (activeHeldFunKey !== normSemi) return;
    activeHeldFunKey = null;
    keyBtn?.classList.remove("is-pressed");
    releaseFunPads(audioContext, 0.9);
    if (currentTransport) currentTransport.liveVoice = { voicing: currentTransport.liveVoice?.voicing ?? null, leadMidi: null };
    applyEnsembleConductor();
    if (elements.funMachineTelemetry) {
      elements.funMachineTelemetry.textContent = `${funKeyLabel(normSemi)} RELEASED · THE BAND RETURNS TO ITS OWN SCORE`;
    }
    return;
  }

  if (activeHeldFunKey === normSemi) return; // key repeat
  const changingKey = activeHeldFunKey !== null;
  activeHeldFunKey = normSemi;
  for (const other of elements.funKeyboard?.querySelectorAll(".fun-key.is-pressed") || []) other.classList.remove("is-pressed");
  keyBtn?.classList.add("is-pressed");

  const performance = buildPerformance(normSemi, funMachineStyle, activeGenre, currentScore ? currentScore.root : 0);
  activeFunPerformance = performance;
  unlockDrawer("held-key");

  applyEnsembleConductor(performance.steps.map((step) => step.chord));

  if (elements.funMachineTelemetry) {
    elements.funMachineTelemetry.textContent = `${funKeyLabel(normSemi)} · ${STYLE_LABELS[performance.style]} · ${performance.summary} · THE BAND FOLLOWS`;
  }

  if (muted) return;
  const context = await ensureAudioContext();
  if (context.state === "suspended") {
    try {
      await context.resume();
    } catch {
      // Resume can fail before any user gesture; the next gesture retries.
    }
  }
  if (activeHeldFunKey !== normSemi) return; // released or changed while the context woke
  releaseFunPads(context, changingKey ? 0.25 : 0.4);

  const transport = currentTransport;
  const level = FUN_PAD_LEVEL[performance.style];
  if (transport?.funBus && currentScore) {
    const nextStep = transport.step;
    const stepsUntilRegion = stepsToRegionBoundary(nextStep) % 3;
    let regionStart = transport.nextNoteTime;
    for (let k = 0; k < stepsUntilRegion; k += 1) regionStart += loopStepDuration(currentScore, nextStep + k);
    const bridge = regionStart - context.currentTime;
    if (bridge > 0.12) {
      const chord = performance.steps[nextStep % 12].chord;
      const voice = liveVoiceOf(transport);
      voice.voicing = padVoicing(chord, voice.voicing, performance.lift);
      schedulePadChord(context, transport.funBus, chord, context.currentTime, bridge + 0.2, { level, voicing: voice.voicing });
    }
  } else {
    const chord = performance.chords[0];
    schedulePadChord(context, getFunMachineDirectDestination(context), chord, context.currentTime, 30, { level, voicing: padVoicing(chord, null, performance.lift) });
  }
}

renderBeatGrid();
renderBassGrid();
renderHarmonyGrid();
renderChimeGrid();
renderChantGrid();
updateFunKeyboardChordLabels();

// Options shared by the live and offline graphs, read from the current session
// controls so an export captures exactly what the listener has dialed in.
function ensembleGraphOptions(context, { start, unit, fadeIn, stop = null, meters = false }) {
  let impulseBuffer = null;
  let crackleBuffer = null;
  try {
    impulseBuffer = ensureParlorImpulseResponse(context, 1.6);
  } catch {
    // The chamber stays silent if the impulse cannot be synthesized.
  }
  try {
    crackleBuffer = ensureWaxCrackleBuffer(context, 4.0);
  } catch {
    // The wax surface stays silent if its buffer cannot be synthesized.
  }
  return {
    start,
    stop,
    unit,
    fadeIn,
    outputGain: masterGainFor(masterVolume),
    channels: channelSettings(mixerState),
    meters,
    parlor: parlorSendLevels({
      enabled: parlorAcousticsEnabled,
      reverbEnabled: parlorReverbEnabled,
      crackleEnabled: parlorCrackleEnabled,
      level: parlorAcousticsLevel,
    }),
    impulseBuffer,
    crackleBuffer,
  };
}

// The INTERCAL arrangement in force, or null when the Raw Chaos rulebook
// unfetters the VMs (or the conductor score has not loaded).
function activeArrangement() {
  return rulebooksInstalled() && genreBook(activeGenre).unfettered ? null : currentArrangement;
}

function arrangementPlays(channel, step) {
  const mask = activeArrangement()?.channelMasks[((step % 12) + 12) % 12];
  return !mask || mask[channel];
}

// Every voice that sounds on a loop step, for both the live scheduler and the
// offline render. Live-only behavior (held Fun Machine keys, punch-in) stays
// in the live scheduler. The INTERCAL 1972 dynamic arrangement mask controls
// channel breathing across Exposition, Antiphony, Tutti, and Breakdown.
function scheduleEnsembleStep(context, transport, score, step, at, stepDuration, soundingDuration) {
  const mask = activeArrangement()?.channelMasks[step % 12];
  const bypassArrangement = !mask;

  if (bypassArrangement || mask.lead) {
    scheduleNote(context, transport, score, step, at, soundingDuration);
  }
  if (bypassArrangement || mask.beat) {
    scheduleBeatStep(context, transport, score, step, at, stepDuration);
  }
  if (bypassArrangement || mask.bass) {
    scheduleBassStep(context, transport, score, step, at, stepDuration);
  }
  if (bypassArrangement || mask.harmony) {
    scheduleHarmonyStep(context, transport, score, step, at, stepDuration);
  }
  if (bypassArrangement || mask.chime) {
    scheduleChimeStep(context, transport, score, step, at, stepDuration);
  }
  if (bypassArrangement || mask.chant) {
    scheduleChantStep(context, transport, score, step, at, stepDuration);
  }
  if (bypassArrangement || mask.fungal) {
    scheduleFungalBioStep(context, transport, score, step, at, stepDuration);
  }
  if (transport.clockTicks ?? (parlorAcousticsEnabled && parlorTickEnabled)) {
    scheduleClockworkTick(context, transport.output, at, step, parlorAcousticsLevel);
  }
}

// Plays every recorded layer of a loop on one step: a pad when a held key
// begins (or a region starts), sustained while the same key is held within the
// region, plus that style's arpeggio or lead. Shared by the live loop and the
// offline song render, so an export carries exactly what the loop plays.
function playSongLayers(context, transport, score, absoluteStep, loop, timing) {
  const { stepIndex } = timing;
  transport.layerVoices ??= [];
  for (const { layerIndex, slot } of slotsAt(loop, stepIndex)) {
    const take = loop.layers[layerIndex];
    const previous = stepIndex > 0 ? take[stepIndex - 1] : null;
    const starts = stepIndex % 3 === 0 || !sameSlot(previous, slot);
    let padSteps = 0;
    if (starts) {
      do padSteps += 1;
      while ((stepIndex + padSteps) % 3 !== 0 && sameSlot(take[stepIndex + padSteps], slot));
    }
    transport.layerVoices[layerIndex] ??= { voicing: null, leadMidi: null };
    playPerformanceStep(context, transport, transport.layerVoices[layerIndex], performanceFor(slot), {
      ...timing,
      padDuration: starts ? padStepsDuration(score, absoluteStep, padSteps) : null,
      releasable: false,
    });
  }
}

// Each region the tonic drones glide to the conducted chord's root, swell,
// and settle; they fade out while the arrangement rests the lead. They used
// to hold one note at one level for the whole loop (the "stuck note").
function shapeDrones(transport, score, absoluteStep, at) {
  if (!transport.droneEnvelopes || absoluteStep % 3 !== 0) return;
  const stepIndex = absoluteStep % 12;
  const chord = currentConductedSpine?.[stepIndex];
  const chordRoot = chord && chord.quality !== "raw" ? chord.root : 0;
  const frequencies = droneFrequencies(score, chordRoot);
  transport.drones.forEach((drone, index) => drone.frequency.setTargetAtTime(frequencies[index], at, 0.06));
  const resting = !arrangementPlays("lead", stepIndex);
  const region = padStepsDuration(score, absoluteStep, 3);
  for (const envelope of transport.droneEnvelopes) {
    envelope.gain.cancelScheduledValues(at);
    if (resting) {
      envelope.gain.setTargetAtTime(0, at, 0.12);
    } else {
      envelope.gain.setTargetAtTime(DRONE_SWELL, at, 0.04);
      envelope.gain.setTargetAtTime(DRONE_SETTLE, at + 0.12, Math.max(0.05, region / 3));
    }
  }
}

function liveVoiceOf(transport) {
  transport.liveVoice ??= { voicing: null, leadMidi: null };
  return transport.liveVoice;
}

function sameSlot(a, b) {
  return Boolean(a && b && a.key === b.key && a.style === b.style);
}

function padStepsDuration(score, absoluteStep, steps) {
  let duration = 0;
  for (let k = 0; k < steps; k += 1) duration += loopStepDuration(score, absoluteStep + k);
  return duration;
}

/**
 * Plays one step of a performance on the band's grid: a pad when
 * `padDuration` is given, then the style's arpeggio pair or lead note. Shared by
 * the live key and every recorded layer; `voice` keeps that player's pad
 * voicing and lead glide.
 */
function playPerformanceStep(context, transport, voice, performance, { stepIndex, at, stepDuration, soundingDuration, padDuration = null, releasable = true }) {
  const stepInfo = performance.steps[stepIndex];
  if (padDuration !== null) {
    voice.voicing = padVoicing(stepInfo.chord, voice.voicing, performance.lift);
    schedulePadChord(context, transport.funBus, stepInfo.chord, at, padDuration, {
      level: FUN_PAD_LEVEL[performance.style],
      voicing: voice.voicing,
      transport,
      releasable,
    });
  }
  if (performance.style === "arpeggio") {
    const half = stepDuration / 2;
    arpeggioNotes(stepInfo.chord, stepIndex, 2, performance.lift).forEach((midi, k) => {
      scheduleArpNote(context, transport.funBus, midi, at + k * half, half, {
        accent: stepInfo.isRegionStart && k === 0,
        pan: k === 0 ? -0.3 : 0.3,
        transport,
      });
    });
  } else if (performance.style === "progression" && stepInfo.leadPitch !== null) {
    const midi = leadMidi(stepInfo.leadPitch);
    scheduleFunLeadNote(context, transport.funBus, midi, at, Math.max(soundingDuration, stepDuration * 0.92), {
      glideFrom: voice.leadMidi ?? null,
      transport,
    });
    voice.leadMidi = midi;
  }
}

async function playScore(score, { cursor = 0 } = {}) {
  stopCurrentSound();
  vision.setScore(score);
  if (muted) {
    elements.status.textContent = "OMEN MUTED";
    return;
  }

  const context = await ensureAudioContext();
  // A newer play, pause, or stop may have landed while the context resumed.
  if (muted || transportState.state !== TRANSPORT_STATES.PLAYING || currentScore !== score) return;
  stopCurrentSound();
  const now = context.currentTime + 0.045;
  const initialPulse = activeTempoBpm || score.pulse;
  const initialUnit = 60 / initialPulse / 2;
  const graph = buildEnsembleGraph(context, score, ensembleGraphOptions(context, {
    start: now,
    unit: initialUnit,
    fadeIn: true,
    meters: true,
  }));
  const transport = {
    ...graph,
    melody: currentConductedMelody || melodyFor(score),
    timer: 0,
    nextNoteTime: now,
    step: cursor,
    // Last step that actually sounded; pause resumes after it, not after the
    // look-ahead window, so no scheduled-but-unheard steps are skipped.
    audibleStep: cursor - 1,
  };
  currentTransport = transport;

  const scheduleAhead = () => {
    if (currentTransport !== transport) return;
    updateAudioInteraction();
    const rhythm = RHYTHMS[score.rhythm];
    while (transport.nextNoteTime < context.currentTime + 0.28) {
      const livePulse = activeTempoBpm || score.pulse;
      const unit = 60 / livePulse / 2;
      const currentStep = transport.step;
      const lengthMultiplier = rhythm[currentStep % rhythm.length];
      const stepDuration = unit * lengthMultiplier;
      const gateRatio = Math.min(0.94, score.gate / 100 + interaction.hold * 0.12);
      const soundingDuration = Math.max(0.06, stepDuration * gateRatio);
      // Fun Machine and loop machine (D-039): record what is held, let the band
      // follow a live key or else the newest recorded layer, then play the band,
      // the live accompanist, and every recorded layer on this step.
      const stepIndex = currentStep % 12;
      const at = transport.nextNoteTime;
      const liveSlot = activeHeldFunKey !== null && activeFunPerformance ? makeSlot(activeHeldFunKey, funMachineStyle) : null;
      const position = songPosition(song, currentStep);
      const loop = position ? song.loops[position.loopIndex] : null;
      transport.songPosition = position;
      advanceRecorder(stepIndex, position, liveSlot);
      followSong(transport, loop, stepIndex, liveSlot);

      scheduleEnsembleStep(context, transport, score, currentStep, at, stepDuration, soundingDuration);
      shapeDrones(transport, score, currentStep, at);

      if (!arrangementPlays("fun", stepIndex)) {
        // The conductor score rests the player only if src/conductor.i stops
        // IGNOREing register :8; the canonical score never does.
      } else {
        const timing = { stepIndex, at, stepDuration, soundingDuration };
        if (liveSlot) {
          const padDuration = activeFunPerformance.steps[stepIndex].isRegionStart ? padStepsDuration(score, currentStep, 3) : null;
          playPerformanceStep(context, transport, liveVoiceOf(transport), activeFunPerformance, { ...timing, padDuration });
        }
        if (loop) playSongLayers(context, transport, score, currentStep, loop, timing);
      }
      const delayMs = Math.max(0, (transport.nextNoteTime - context.currentTime) * 1000);
      window.setTimeout(() => {
        if (currentTransport !== transport) return;
        transport.audibleStep = currentStep;
        if (currentStep % 12 === 11) noteLoopHeard();
        if (currentStep % 12 === 0) {
          transport.audiblePosition = songPosition(song, currentStep);
          renderLooper();
        }
        highlightBeatStep(currentStep);
        updateTransportPosition(currentStep);
      }, delayMs);
      transport.nextNoteTime += stepDuration;
      transport.step += 1;
    }
  };

  scheduleAhead();
  transport.timer = window.setInterval(scheduleAhead, 90);
  startMeters();
  elements.status.textContent = "OMEN LOOPING";
}

function updateTransportPosition(step) {
  const stopped = step === null || step < 0;
  if (elements.transportPosition) {
    elements.transportPosition.value = stopped ? "STEP -- / 12" : `STEP ${String((step % 12) + 1).padStart(2, "0")} / 12`;
  }
  updateArrangementDisplay(stopped ? null : step);
}

// Shows where the INTERCAL conductor has the band: the section on the
// transport, and a TACET lamp on every console strip it rests this step.
function updateArrangementDisplay(step) {
  const arrangement = activeArrangement();
  const place = arrangement && step !== null && step >= 0 ? arrangementSectionAt(arrangement, step) : null;
  if (elements.transportSection) {
    elements.transportSection.value = !currentArrangement
      ? ""
      : !arrangement
        ? "INTERCAL · UNFETTERED"
        : place
          ? `${["I", "II", "III", "IV"][place.section.index]} · ${place.section.name}${place.isTurnaround ? " · COME FROM" : ""}`
          : "INTERCAL · 4 SECTIONS";
  }
  for (const { id } of MIXER_CHANNELS) {
    const refs = mixerStripElements[id];
    if (!refs) continue;
    const resting = Boolean(place && place.mask[id] === false);
    refs.strip.classList.toggle("is-tacet", resting);
  }
}

function syncTransportUI() {
  const { state } = transportState;
  const ready = Boolean(currentScore);
  elements.transportDeck?.setAttribute("data-state", state);
  // Buttons stay enabled while ready so a keyboard user never loses focus to a
  // control that disables itself; pressed state carries the transport state.
  for (const button of [elements.transportPlay, elements.transportPause, elements.transportStop]) {
    if (button) button.disabled = !ready;
  }
  elements.transportPlay?.setAttribute("aria-pressed", String(state === TRANSPORT_STATES.PLAYING));
  elements.transportPause?.setAttribute("aria-pressed", String(state === TRANSPORT_STATES.PAUSED));
}

// The single path for starting, pausing, and stopping the loop. Audio runs only
// while the transport is playing and the bell is unmuted; muting leaves the
// transport state alone and freezes the cursor where the sound stopped.
async function runTransportCommand(command) {
  if (!currentScore) return;
  const resumeStep = currentTransport ? currentTransport.audibleStep + 1 : transportState.cursor;
  const next = transportReduce(transportState, command, { cursor: resumeStep });
  if (next === transportState) return;
  transportState = next;
  syncTransportUI();
  // A take needs an unbroken pass: stop, pause, and restart (and a new summon,
  // which restarts) abandon it. Playing on from a pause or an arm does not.
  if (command === "restart" || next.state !== TRANSPORT_STATES.PLAYING) cancelRecording();
  if (next.state === TRANSPORT_STATES.PLAYING) {
    await playScore(currentScore, { cursor: next.cursor });
    return;
  }
  stopCurrentSound();
  renderLooper();
  if (next.state === TRANSPORT_STATES.STOPPED) {
    highlightBeatStep(-1);
    updateTransportPosition(null);
    elements.status.textContent = "OMEN STOPPED · REWOUND";
  } else {
    // The position readout holds the last step heard; resume plays the one after.
    elements.status.textContent = `OMEN PAUSED · ${elements.transportPosition?.value || "STEP -- / 12"}`;
  }
}

let currentConductedMelody = null;

// The Kapellmeister menu lists the genres of src/rulebooks.ni in source
// order; nothing about a genre is written into the page itself.
function buildGenreMenu() {
  const menu = elements.kapellmeisterGenre;
  if (!menu) return;
  menu.replaceChildren(...genreCodes().map((code) => {
    const book = genreBook(code);
    const option = document.createElement("option");
    option.value = code;
    option.textContent = book.title;
    option.title = book.motto;
    return option;
  }));
  menu.value = activeGenre;
  menu.disabled = false;
}

function updateKapellmeisterUI() {
  if (!rulebooksInstalled()) return;
  const book = genreBook(activeGenre);
  if (elements.kapellmeisterGenreTitle) elements.kapellmeisterGenreTitle.textContent = book.title;
  if (elements.kapellmeisterGenreMotto) elements.kapellmeisterGenreMotto.textContent = book.motto;
  if (elements.kapellmeisterTelemetry) {
    const chord0 = currentConductedSpine?.[0];
    const tonicName = currentScore ? chordLabelFor(chord0, currentScore.root) : "C Maj";
    elements.kapellmeisterTelemetry.textContent = `RULEBOOK: ${book.name.toUpperCase()} · TONIC: ${tonicName} · STRICTNESS: G ≤ ${activeStrictness}`;
  }
  if (currentConductedSpine) {
    const nodeIds = [elements.nodeText0, elements.nodeText1, elements.nodeText2, elements.nodeText3];
    const steps = [0, 3, 6, 9];
    steps.forEach((stepIdx, i) => {
      const el = nodeIds[i];
      if (el && currentConductedSpine[stepIdx]) {
        el.textContent = currentConductedSpine[stepIdx].op || "I";
      }
    });
  }
}

function applyEnsembleConductor() {
  if (!currentScore) return;
  const overrideProgression = arguments.length > 0 ? arguments[0] : null;
  // A held key's chords are absolute; the conductor works above the tonic.
  // With no key held there is no custom spine at all, so Raw Esoteric Chaos
  // takes its unfettered path (P5-27). An empty array here used to be truthy
  // and quietly conducted the raw VMs anyway; fettered genres are unaffected.
  const spineToUse = overrideProgression
    ? overrideProgression.map((chord) => (chord ? toTonicRelative(chord, currentScore.root) : null))
    : null;
  const conducted = conductEnsemble({
    score: currentScore,
    melody: melodyFor(currentScore),
    beat: rawBeat || currentBeat,
    bass: rawBass || currentBass,
    harmony: rawHarmony || currentHarmony,
    chimes: rawChimes || currentChimes,
    chant: rawChant || currentChant,
    mutation: harmonyMutation + bassMutation + chimeMutation + chantMutation,
    genre: activeGenre,
    consonanceStrictness: activeStrictness,
    customSpine: spineToUse,
  });
  currentConductedSpine = conducted.spine;
  currentConductedMelody = conducted.melody;
  if (conducted.bass) currentBass = conducted.bass;
  if (conducted.harmony) currentHarmony = conducted.harmony;
  if (conducted.chimes) currentChimes = conducted.chimes;
  if (conducted.chant) currentChant = conducted.chant;
  if (currentTransport) {
    currentTransport.melody = currentConductedMelody;
  }
  updateKapellmeisterUI();
  updateBassGrid();
  updateHarmonyGrid();
  updateChimeGrid();
  updateChantGrid();
  highlightBeatStep(activeBeatStep);
}

function showScore(score) {
  currentScore = score;
  beatMutation = 0;
  bassMutation = 0;
  harmonyMutation = 0;
  chimeMutation = 0;
  chantMutation = 0;
  for (const id of Object.keys(plateCellCycles)) plateCellCycles[id] = Array(12).fill(0);
  if (beatSource) {
    rawBeat = composeBeat(beatSource, score, beatMutation);
    currentBeat = rawBeat;
    if (elements.beatName) elements.beatName.textContent = currentBeat.modeName;
    if (elements.beatTelemetry) {
      elements.beatTelemetry.textContent = `3¹⁰ TAPE · ${currentBeat.stepsExecuted} OPS · DENSITY ${score.beatDensity}%`;
    }
    if (elements.beatMutate) elements.beatMutate.disabled = false;
  } else if (elements.beatName) {
    elements.beatName.textContent = BEAT_NAMES[score.beatMode];
  }
  if (bassSource) {
    rawBass = composeBass(bassSource, score, bassMutation);
    currentBass = rawBass;
    if (elements.bassName) elements.bassName.textContent = currentBass.modeName;
    if (elements.bassTelemetry) {
      elements.bassTelemetry.textContent = `256-CELL TAPE · ${currentBass.stepsExecuted} OPS · GLIDE ${score.bassGlide}%`;
    }
    if (elements.bassMutate) elements.bassMutate.disabled = false;
  } else if (elements.bassName) {
    elements.bassName.textContent = BASS_NAMES[score.bassMode];
  }
  if (harmonySource) {
    rawHarmony = composeHarmony(harmonySource, score, harmonyMutation);
    currentHarmony = rawHarmony;
    if (elements.harmonyName) elements.harmonyName.textContent = currentHarmony.modeName;
    if (elements.harmonyTelemetry) {
      elements.harmonyTelemetry.textContent = `2D TORUS · ${currentHarmony.stepsExecuted} OPS · ${currentHarmony.mirrorsHit} MIRRORS`;
    }
    if (elements.harmonyMutate) elements.harmonyMutate.disabled = false;
  } else if (elements.harmonyName) {
    elements.harmonyName.textContent = HARMONY_NAMES[score.harmonyMode];
  }
  if (pietSource && fractranSource) {
    rawChimes = composeChimes(pietSource, fractranSource, score, chimeMutation);
    currentChimes = rawChimes;
    if (elements.chimeName) elements.chimeName.textContent = currentChimes.modeName;
    if (elements.chimeTelemetry) {
      elements.chimeTelemetry.textContent = `${currentChimes.pietStepsExecuted} CODELS · ${currentChimes.fractranStepsExecuted} FRACTRAN RATIOS · SHIMMER ${score.chimeShimmer}%`;
    }
    if (elements.chimeMutate) elements.chimeMutate.disabled = false;
  } else if (elements.chimeName) {
    elements.chimeName.textContent = CHIME_NAMES[score.chimeMode];
  }
  if (chantSource) {
    rawChant = composeChant(chantSource, score, chantMutation);
    currentChant = rawChant;
    if (elements.chantName) elements.chantName.textContent = currentChant.modeName;
    if (elements.chantTelemetry) {
      elements.chantTelemetry.textContent = `3 ACTS · ${currentChant.statementsExecuted} CUES · FORMANT ${score.chantFormant}%`;
    }
    if (elements.chantMutate) elements.chantMutate.disabled = false;
  } else if (elements.chantName) {
    elements.chantName.textContent = CHANT_NAMES[score.chantMode];
  }
  if (conductorSource) {
    currentArrangement = composeArrangement(conductorSource, score);
  }
  updateArrangementDisplay(currentTransport?.audibleStep ?? null);
  applyEnsembleConductor();
  renderLooper();
  updateBeatGrid();
  updateBassGrid();
  updateHarmonyGrid();
  updateChimeGrid();
  updateChantGrid();
  updateFunKeyboardChordLabels();
  if (elements.bandstandMutateAll) elements.bandstandMutateAll.disabled = false;
  updateBandstandStatus();
  elements.name.textContent = score.name;
  setTempoBpm(score.pulse);
  elements.wave.textContent = WAVEFORMS[score.wave];
  elements.formValue.textContent = score.shapeName;
  elements.melody.textContent = MELODY_NAMES[score.melodyMode];
  if (elements.fungal) elements.fungal.textContent = score.fungalName;
  elements.replay.disabled = false;
  syncTransportUI();
  syncSessionButtons();
  if (elements.shareLink) elements.shareLink.disabled = false;
  if (elements.exportPng) elements.exportPng.disabled = false;
  if (elements.exportWav) elements.exportWav.disabled = false;
  if (elements.exportStems) elements.exportStems.disabled = false;
  if (elements.exportMidi) elements.exportMidi.disabled = false;
  try {
    const nextHash = encodeOmenHash(score.phrase);
    if (window.location.hash !== nextHash) {
      window.history.replaceState(null, "", nextHash);
    }
  } catch {
    // Non-standard history environments continue without mutating location.
  }
}

async function summon(phrase, { playAudio = true } = {}) {
  if (!oracleSource) {
    elements.status.textContent = "SPELL UNAVAILABLE";
    return;
  }

  try {
    const score = composeScore(oracleSource, phrase);
    showScore(score);
    if (playAudio) {
      await runTransportCommand("restart");
    } else {
      stopCurrentSound();
      transportState = createTransportState();
      syncTransportUI();
      highlightBeatStep(-1);
      updateTransportPosition(null);
      elements.status.textContent = "OMEN RESTORED FROM LINK · PRESS SUMMON OR REPLAY FOR SOUND";
    }
  } catch (error) {
    elements.status.textContent = "THE ORACLE COUGHED";
    console.error(error);
  }
}

function wrapCanvasText(ctx, text, maxWidth) {
  const words = String(text).split(/\s+/).filter(Boolean);
  if (words.length === 0) return [""];
  const lines = [words[0]];
  for (let i = 1; i < words.length; i += 1) {
    const candidate = `${lines[lines.length - 1]} ${words[i]}`;
    if (ctx.measureText(candidate).width <= maxWidth) {
      lines[lines.length - 1] = candidate;
    } else {
      lines.push(words[i]);
    }
  }
  return lines;
}

function renderSpecimenBroadsheetCanvas(score) {
  const width = 1200;
  const height = 1520;
  const plate = document.createElement("canvas");
  plate.width = width;
  plate.height = height;
  const pctx = plate.getContext("2d");

  pctx.fillStyle = "#120e0c";
  pctx.fillRect(0, 0, width, height);

  const paperGrad = pctx.createLinearGradient(0, 36, 0, height - 36);
  paperGrad.addColorStop(0, "#ede0c8");
  paperGrad.addColorStop(0.5, "#e4d2b4");
  paperGrad.addColorStop(1, "#d8c3a0");
  pctx.fillStyle = paperGrad;
  pctx.fillRect(38, 38, width - 76, height - 76);

  pctx.strokeStyle = "#6b1f28";
  pctx.lineWidth = 3;
  pctx.strokeRect(52, 52, width - 104, height - 104);
  pctx.strokeStyle = "#b89249";
  pctx.lineWidth = 1.5;
  pctx.strokeRect(60, 60, width - 120, height - 120);

  const corners = [
    [76, 76],
    [width - 76, 76],
    [76, height - 76],
    [width - 76, height - 76],
  ];
  for (const [cx, cy] of corners) {
    pctx.save();
    pctx.strokeStyle = "#6b1f28";
    pctx.lineWidth = 1.4;
    pctx.beginPath();
    pctx.arc(cx, cy, 10, 0, Math.PI * 2);
    pctx.stroke();
    pctx.fillStyle = "#b89249";
    pctx.beginPath();
    pctx.arc(cx, cy, 3.5, 0, Math.PI * 2);
    pctx.fill();
    pctx.restore();
  }

  pctx.textAlign = "center";
  pctx.fillStyle = "#6b1f28";
  pctx.font = '700 15px "Courier New", Courier, monospace';
  pctx.fillText("❧ THE SOCIETY FOR QUESTIONABLE SPIRITUALISM & HARMONIC AUTOMATA ❧", width * 0.5, 104);

  const seedHex = (score.seed >>> 0).toString(16).toUpperCase().padStart(8, "0");
  pctx.fillStyle = "#1b1512";
  pctx.font = '700 34px "Palatino Linotype", "Book Antiqua", Palatino, Georgia, serif';
  pctx.fillText("EDMARK'S ESOTERIC FUN MACHINE — SPECIMEN BROADSHEET", width * 0.5, 146);

  pctx.fillStyle = "#57483e";
  pctx.font = '600 14px "Courier New", Courier, monospace';
  pctx.fillText(`FOLIO XVII · SEED 0x${seedHex} · DETERMINISTIC AUDIOVISUAL OMEN & AUTO-CHORD ORGAN`, width * 0.5, 174);

  const vitrineX = 96;
  const vitrineY = 200;
  const vitrineW = width - 192;
  const vitrineH = 560;

  const stageGrad = pctx.createRadialGradient(
    width * 0.5,
    vitrineY + vitrineH * 0.5,
    30,
    width * 0.5,
    vitrineY + vitrineH * 0.5,
    vitrineW * 0.55,
  );
  stageGrad.addColorStop(0, "#1c1512");
  stageGrad.addColorStop(0.7, "#110d0b");
  stageGrad.addColorStop(1, "#090706");
  pctx.fillStyle = stageGrad;
  pctx.fillRect(vitrineX, vitrineY, vitrineW, vitrineH);

  pctx.strokeStyle = "#b89249";
  pctx.lineWidth = 2.5;
  pctx.strokeRect(vitrineX, vitrineY, vitrineW, vitrineH);
  pctx.strokeStyle = "rgba(218, 181, 107, 0.35)";
  pctx.lineWidth = 1;
  pctx.strokeRect(vitrineX + 8, vitrineY + 8, vitrineW - 16, vitrineH - 16);

  pctx.save();
  pctx.strokeStyle = "rgba(218, 181, 107, 0.26)";
  pctx.setLineDash([4, 8]);
  pctx.beginPath();
  pctx.arc(width * 0.5, vitrineY + vitrineH * 0.5, 210, 0, Math.PI * 2);
  pctx.stroke();
  pctx.setLineDash([]);
  pctx.beginPath();
  pctx.arc(width * 0.5, vitrineY + vitrineH * 0.5, 168, 0, Math.PI * 2);
  pctx.stroke();
  pctx.restore();

  if (elements.canvas.width > 0 && elements.canvas.height > 0) {
    const scale = Math.min(vitrineW / elements.canvas.width, vitrineH / elements.canvas.height);
    const drawW = elements.canvas.width * scale;
    const drawH = elements.canvas.height * scale;
    const drawX = vitrineX + (vitrineW - drawW) * 0.5;
    const drawY = vitrineY + (vitrineH - drawH) * 0.5;
    pctx.drawImage(elements.canvas, drawX, drawY, drawW, drawH);
  }

  pctx.fillStyle = "#dab56b";
  pctx.font = '700 13px "Courier New", Courier, monospace';
  pctx.textAlign = "left";
  pctx.fillText("PLATE I · LIVE SPECIMEN CAPTURE", vitrineX + 22, vitrineY + 30);
  pctx.textAlign = "right";
  pctx.fillText(`BELL JAR Nº 01 · ${score.shapeName}`, vitrineX + vitrineW - 22, vitrineY + 30);

  const bannerY = 788;
  pctx.fillStyle = "#16110e";
  pctx.fillRect(96, bannerY, width - 192, 232);
  pctx.strokeStyle = "#b89249";
  pctx.lineWidth = 2;
  pctx.strokeRect(96, bannerY, width - 192, 232);

  pctx.textAlign = "center";
  pctx.fillStyle = "#dab56b";
  pctx.font = '700 13px "Courier New", Courier, monospace';
  pctx.fillText("CATALOGUED MANIFESTATION", width * 0.5, bannerY + 32);

  pctx.fillStyle = "#faf3e6";
  pctx.font = '700 32px "Palatino Linotype", "Book Antiqua", Palatino, Georgia, serif';
  const nameLines = wrapCanvasText(pctx, score.name, width - 260).slice(0, 2);
  nameLines.forEach((line, idx) => {
    pctx.fillText(line, width * 0.5, bannerY + 74 + idx * 38);
  });

  const phraseY = bannerY + (nameLines.length > 1 ? 150 : 128);
  pctx.fillStyle = "#e4d2b4";
  pctx.font = 'italic 600 22px "Palatino Linotype", "Book Antiqua", Palatino, Georgia, serif';
  const quotedPhrase = `“${score.phrase}”`;
  const phraseLines = wrapCanvasText(pctx, quotedPhrase, width - 260).slice(0, 2);
  phraseLines.forEach((line, idx) => {
    pctx.fillText(line, width * 0.5, phraseY + idx * 28);
  });

  pctx.fillStyle = "#b89249";
  pctx.font = '700 13px "Courier New", Courier, monospace';
  pctx.fillText("CONFIDED PHRASE INSCRIBED UPON THE CALLING SLIP", width * 0.5, bannerY + 212);

  const gridY = 1044;
  const colW = (width - 212) / 2;
  const rowH = 110;
  const plates = [
    {
      plate: "PLATE I · LOLCODE 1.2 SCORE SPELL",
      title: `${MELODY_NAMES[score.melodyMode]} (${score.pulse} BPM)`,
      detail: `WAVE: ${WAVEFORMS[score.wave]} · FORM: ${score.shapeName} · MYCELIUM: ${score.fungalName}`,
    },
    {
      plate: "PLATE II · MALBOLGE 1998 TERNARY DRUMS",
      title: currentBeat ? currentBeat.modeName : BEAT_NAMES[score.beatMode],
      detail: `3¹⁰ TAPE · DENSITY ${score.beatDensity}% · 12-STEP CRAZY/ROTR`,
    },
    {
      plate: "PLATE III · BRAINFUCK 1993 WALKING BASS",
      title: currentBass ? currentBass.modeName : BASS_NAMES[score.bassMode],
      detail: `256-CELL TAPE · GLIDE ${score.bassGlide}% · [->+<] SHUTTLE`,
    },
    {
      plate: "PLATE IV · BEFUNGE-93 2D MIRROR ORGAN",
      title: currentHarmony ? currentHarmony.modeName : HARMONY_NAMES[score.harmonyMode],
      detail: `80×25 TORUS · STRUM ${score.harmonyStrum}% · /\\ MIRROR TRIADS`,
    },
    {
      plate: "PLATE V · PIET & FRACTRAN CHIMES",
      title: currentChimes ? currentChimes.modeName : CHIME_NAMES[score.chimeMode],
      detail: `2ᵃ3ᵇ5ᶜ7ᵈ PRIME RATIOS · SHIMMER ${score.chimeShimmer}% · 18 CODELS`,
    },
    {
      plate: "PLATE VI · SHAKESPEARE VOWEL CHOIR",
      title: currentChant ? currentChant.modeName : CHANT_NAMES[score.chantMode],
      detail: `3 ACTS · 12 SCENES · FORMANT ${score.chantFormant}% · A-E-I-O-U VODER`,
    },
  ];

  plates.forEach((entry, index) => {
    const col = index % 2;
    const row = Math.floor(index / 2);
    const boxX = 96 + col * (colW + 20);
    const boxY = gridY + row * (rowH + 14);

    pctx.fillStyle = "#18120f";
    pctx.fillRect(boxX, boxY, colW, rowH);
    pctx.strokeStyle = "#8d6b32";
    pctx.lineWidth = 1.5;
    pctx.strokeRect(boxX, boxY, colW, rowH);

    pctx.textAlign = "left";
    pctx.fillStyle = "#dab56b";
    pctx.font = '700 12px "Courier New", Courier, monospace';
    pctx.fillText(entry.plate, boxX + 18, boxY + 28);

    pctx.fillStyle = "#faf3e6";
    pctx.font = '700 20px "Palatino Linotype", "Book Antiqua", Palatino, Georgia, serif';
    pctx.fillText(entry.title, boxX + 18, boxY + 58);

    pctx.fillStyle = "#c8b698";
    pctx.font = '600 12px "Courier New", Courier, monospace';
    pctx.fillText(entry.detail, boxX + 18, boxY + 86);
  });

  pctx.textAlign = "center";
  pctx.fillStyle = "#4b382d";
  pctx.font = '700 13px "Courier New", Courier, monospace';
  pctx.fillText(
    `SHARE SEAL: ${encodeOmenHash(score.phrase)} · EDMARK'S ESOTERIC FUN MACHINE · ZERO-DEPENDENCY`,
    width * 0.5,
    height - 74,
  );

  return plate;
}

async function copyShareLink() {
  if (!currentScore) return;
  const shareUrl = buildShareUrl(window.location.href, currentScore.phrase);
  let copied = false;
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(shareUrl);
      copied = true;
    } catch {
      copied = false;
    }
  }
  if (!copied) {
    const helper = document.createElement("textarea");
    helper.value = shareUrl;
    helper.setAttribute("readonly", "");
    helper.style.position = "fixed";
    helper.style.opacity = "0";
    document.body.appendChild(helper);
    helper.select();
    try {
      copied = document.execCommand("copy");
    } catch {
      copied = false;
    }
    helper.remove();
  }
  elements.status.textContent = copied ? "OMEN LINK COPIED TO CLIPBOARD" : "OMEN LINK SEALED IN ADDRESS BAR";
  if (elements.shareLink) {
    const original = elements.shareLink.innerHTML;
    elements.shareLink.textContent = copied ? "LINK COPIED ✦" : "LINK IN URL BAR ✦";
    window.setTimeout(() => {
      if (elements.shareLink) elements.shareLink.innerHTML = original;
    }, 1800);
  }
}

function exportSpecimenPng() {
  if (!currentScore) return;
  const plate = renderSpecimenBroadsheetCanvas(currentScore);
  const filename = specimenFilenameFor(currentScore);
  const triggerDownload = (href, revokeAfter = false) => {
    const anchor = document.createElement("a");
    anchor.href = href;
    anchor.download = filename;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    if (revokeAfter) {
      window.setTimeout(() => URL.revokeObjectURL(href), 1500);
    }
    elements.status.textContent = "SPECIMEN PLATE ENGRAVED (PNG)";
  };

  if (typeof plate.toBlob === "function") {
    plate.toBlob((blob) => {
      if (blob) {
        triggerDownload(URL.createObjectURL(blob), true);
      } else {
        triggerDownload(plate.toDataURL("image/png"));
      }
    }, "image/png");
  } else {
    triggerDownload(plate.toDataURL("image/png"));
  }
}

// --- Offline exports: WAV mix, stem bundle, MIDI score (P3-03, P5-21) ------

const LOOP_START_OFFSET = 0.04;
const LOOP_TAIL_SECONDS = 1.35; // Natural decay of delay repeats and resonant reverbs
const STEM_FILES = Object.freeze([
  ["lead", "01-lead", "LEAD · LOLCODE melody and drones"],
  ["fun", "02-manual", "MANUAL · Fun Machine sequenced chords"],
  ["beat", "03-pulse", "PULSE · Malbolge percussion"],
  ["bass", "04-bass", "BASS · Brainfuck walking bass"],
  ["harmony", "05-organ", "ORGAN · Befunge chord organ"],
  ["chime", "06-chimes", "CHIMES · Piet/FRACTRAN bells and pads"],
  ["chant", "07-choir", "CHOIR · Shakespeare formant voices"],
  ["fungal", "08-mycelium", "MYCELIUM · bio-acoustic sonification"],
]);

function offlineAudioConstructor() {
  return window.OfflineAudioContext || window.webkitOfflineAudioContext || null;
}

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 2000);
}

// Disables an export button while `task` runs, then restores its label.
async function runExport(button, { idleHtml, busyText, doneText, failStatus }, task) {
  if (!offlineAudioConstructor()) {
    elements.status.textContent = "OFFLINE AUDIO NOT SUPPORTED";
    return;
  }
  if (button) {
    button.disabled = true;
    button.textContent = busyText;
  }
  try {
    await task();
    if (button) {
      button.textContent = doneText;
      window.setTimeout(() => {
        button.disabled = false;
        button.innerHTML = idleHtml;
      }, 1800);
    }
  } catch (error) {
    console.error(error);
    elements.status.textContent = failStatus;
    if (button) {
      button.disabled = false;
      button.innerHTML = idleHtml;
    }
  }
}

/**
 * Renders one 12-step loop offline through the shared graph. Options override
 * the live console: `channels` and `parlor` replace strip and room levels,
 * `clockTicks` forces the escapement on or off, `engageAll` renders muted
 * plates, and `captureNotes` records every pitched event for MIDI. With
 * `render: false` the loop is only scheduled, which is all MIDI capture needs.
 */
async function renderEnsembleLoop(score, {
  channels,
  parlor,
  clockTicks,
  engageAll = false,
  captureNotes = false,
  render = true,
} = {}) {
  const OfflineAudioCtx = offlineAudioConstructor();
  const bpm = activeTempoBpm || score.pulse;
  const unit = 60 / bpm / 2;
  const rhythm = RHYTHMS[score.rhythm];
  // With a loop-machine song the render is the whole song (D-039), at most
  // MAX_SONG_PASSES passes; without one it is a single loop, as before.
  const passes = Math.max(1, songPasses(song));
  const stepsCount = 12 * passes;
  let loopDuration = 0;
  for (let step = 0; step < stepsCount; step += 1) {
    loopDuration += unit * rhythm[step % rhythm.length];
  }
  const totalDuration = loopDuration + LOOP_TAIL_SECONDS;
  const sampleRate = 44100;
  const offlineCtx = new OfflineAudioCtx(2, Math.ceil(totalDuration * sampleRate), sampleRate);
  const options = ensembleGraphOptions(offlineCtx, { start: 0, stop: totalDuration, unit, fadeIn: false });
  if (channels) options.channels = channels;
  if (parlor) options.parlor = parlor;
  const graph = buildEnsembleGraph(offlineCtx, score, options);
  const offlineTransport = {
    ...graph,
    melody: currentConductedMelody || melodyFor(score),
    engageAll,
    clockTicks,
    noteLog: captureNotes ? [] : undefined,
  };

  let stepTime = LOOP_START_OFFSET;
  const stepStarts = [];
  for (let step = 0; step < stepsCount; step += 1) {
    stepStarts.push(stepTime - LOOP_START_OFFSET);
    const stepDuration = unit * rhythm[step % rhythm.length];
    const gateRatio = Math.min(0.94, score.gate / 100);
    const soundingDuration = Math.max(0.06, stepDuration * gateRatio);
    const position = songPosition(song, step);
    const loop = position ? song.loops[position.loopIndex] : null;
    if (song.loops.length) {
      followSong(offlineTransport, loop, step % 12, null);
      offlineTransport.melody = currentConductedMelody || offlineTransport.melody;
    }
    scheduleEnsembleStep(offlineCtx, offlineTransport, score, step, stepTime, stepDuration, soundingDuration);
    shapeDrones(offlineTransport, score, step, stepTime);
    if (loop && arrangementPlays("fun", step % 12)) {
      playSongLayers(offlineCtx, offlineTransport, score, step, loop, { stepIndex: step % 12, at: stepTime, stepDuration, soundingDuration });
    }
    stepTime += stepDuration;
  }
  // Following the song re-conducted the shared band state; hand it back to
  // the live loop (a held key, or the band's own score) before rendering.
  if (song.loops.length) restoreLiveConducting();

  const buffer = render ? await offlineCtx.startRendering() : null;
  return { buffer, noteLog: offlineTransport.noteLog || [], bpm, loopDuration, stepStarts, passes };
}

function restoreLiveConducting() {
  if (activeHeldFunKey !== null && activeFunPerformance) applyEnsembleConductor(activeFunPerformance.steps.map((step) => step.chord));
  else applyEnsembleConductor();
  if (currentTransport) currentTransport.followedSlot = activeHeldFunKey !== null ? "live" : null;
}

async function exportSpecimenWav() {
  if (!currentScore) return;
  const score = currentScore;
  elements.status.textContent = "RECORDING WAV LOOP...";
  await runExport(elements.exportWav, {
    idleHtml: 'RECORD WAV LOOP <span aria-hidden="true">☊</span>',
    busyText: "RECORDING... ✦",
    doneText: "WAV RECORDED ✦",
    failStatus: "WAV EXPORT FAILED",
  }, async () => {
    const { buffer } = await renderEnsembleLoop(score);
    downloadBlob(audioBufferToWavBlob(buffer), specimenFilenameFor(score, "wav"));
    elements.status.textContent = "SPECIMEN AUDIO RECORDED (WAV)";
  });
}

async function wavBytes(buffer) {
  return new Uint8Array(await audioBufferToWavBlob(buffer).arrayBuffer());
}

// Nine stems: each console channel rendered alone at its fader and pan (mute
// and solo ignored) with its own chamber reverb, plus the parlor room's crackle
// and clockwork on their own. All stems share one start time and length.
async function exportSpecimenStems() {
  if (!currentScore) return;
  const score = currentScore;
  await runExport(elements.exportStems, {
    idleHtml: 'EXPORT 9 STEMS (ZIP) <span aria-hidden="true">⧉</span>',
    busyText: "RENDERING STEMS... ✦",
    doneText: "STEMS EXPORTED ✦",
    failStatus: "STEM EXPORT FAILED",
  }, async () => {
    const room = parlorSendLevels({
      enabled: parlorAcousticsEnabled,
      reverbEnabled: parlorReverbEnabled,
      crackleEnabled: parlorCrackleEnabled,
      level: parlorAcousticsLevel,
    });
    const entries = [];
    let loopDuration = 0;
    let bpm = 0;
    let stepStarts = [];
    let passes = 1;
    for (const [index, [id, file]] of STEM_FILES.entries()) {
      elements.status.textContent = `RENDERING STEM ${index + 1}/9 · ${file.slice(3).toUpperCase()}`;
      const result = await renderEnsembleLoop(score, {
        channels: stemSettings(mixerState, id),
        parlor: { reverb: room.reverb, crackle: SILENT_GAIN },
        clockTicks: false,
        engageAll: true,
      });
      ({ loopDuration, bpm, stepStarts, passes } = result);
      entries.push({ name: `${file}.wav`, data: await wavBytes(result.buffer) });
    }
    elements.status.textContent = "RENDERING STEM 9/9 · PARLOR ROOM";
    const roomRender = await renderEnsembleLoop(score, { channels: silentSettings(mixerState), parlor: room });
    entries.push({ name: "09-parlor-room.wav", data: await wavBytes(roomRender.buffer) });
    const seedHex = (score.seed >>> 0).toString(16).padStart(8, "0");
    entries.push({
      name: "README.txt",
      data: [
        "EDMARK'S ESOTERIC FUN MACHINE · STEM BUNDLE",
        "",
        `Specimen: ${score.name}`,
        `Seed: 0x${seedHex}`,
        `Tempo: ${bpm} BPM · ${passes > 1 ? `a song of ${passes} passes (12 steps each)` : "one 12-step loop"} lasting ${loopDuration.toFixed(3)} s plus a ${LOOP_TAIL_SECONDS} s tail`,
        `Format: 16-bit PCM WAV, 44.1 kHz stereo. Every stem starts at 0 s; the loop begins at ${LOOP_START_OFFSET} s.`,
        "",
        ...STEM_FILES.map(([, file, label]) => `${file}.wav  ${label}`),
        "09-parlor-room.wav  PARLOR ROOM · wax-cylinder crackle and clockwork escapement",
        "",
        ...arrangementReadme(stepStarts),
        "Each channel stem is rendered alone through the full chain at its console fader",
        "and pan, ignoring mute and solo, with its own chamber reverb. The master",
        "compressor reacts to each stem separately, so the stems sum close to, but not",
        "exactly to, the full mix.",
        "",
      ].join("\n"),
    });
    const zip = createStoredZip(entries);
    downloadBlob(new Blob([zip], { type: "application/zip" }), specimenFilenameFor(score, "zip").replace(/\.zip$/, "-stems.zip"));
    elements.status.textContent = "NINE STEMS EXPORTED (ZIP)";
  });
}

// The INTERCAL sections (and the COME FROM turnaround) as timeline markers,
// seconds from the loop start. Empty when Raw Chaos unfetters the band.
// The INTERCAL sections (and the COME FROM turnaround) as timeline markers,
// seconds from the loop start, for every pass rendered. With a song, each
// marker names its loop (and repeat), and loops are marked even under Raw Chaos.
function arrangementMarkers(stepStarts) {
  const arrangement = activeArrangement();
  const passes = Math.floor(stepStarts.length / 12);
  const markers = [];
  for (let pass = 0; pass < passes; pass += 1) {
    const base = pass * 12;
    const position = songPosition(song, base);
    const repeats = position ? song.loops[position.loopIndex].repeats : 1;
    const loopLabel = position ? `LOOP ${position.loopIndex + 1}${repeats > 1 ? ` (${position.repeat + 1}/${repeats})` : ""}` : null;
    const prefix = loopLabel ? `${loopLabel} · ` : "";
    if (!arrangement) {
      if (loopLabel) markers.push({ at: stepStarts[base], text: loopLabel });
      continue;
    }
    for (const section of arrangement.sections) {
      markers.push({ at: stepStarts[base + section.steps[0]], text: `${prefix}${["I", "II", "III", "IV"][section.index]} · ${section.name}` });
    }
    markers.push({ at: stepStarts[base + arrangement.turnaroundStep], text: `${prefix}COME FROM (60) · TURNAROUND` });
  }
  return markers.sort((x, y) => x.at - y.at);
}

function arrangementReadme(stepStarts) {
  const markers = arrangementMarkers(stepStarts);
  if (!markers.length) return ["Arrangement: RAW CHAOS · every voice plays every step.", ""];
  const what = song.loops.length ? "Song and arrangement (loop machine and INTERCAL conductor, seconds after the song begins):" : "Arrangement (INTERCAL conductor, seconds after the loop begins):";
  return [what, ...markers.map(({ at, text }) => `  ${at.toFixed(3).padStart(7)} s  ${text}`), ""];
}

// A Type 1 MIDI file of every pitched part in the loop, captured from the same
// schedulers that make the sound. Muted plates are included.
async function exportSpecimenMidi() {
  if (!currentScore) return;
  const score = currentScore;
  elements.status.textContent = "TRANSCRIBING MIDI SCORE...";
  await runExport(elements.exportMidi, {
    idleHtml: 'WRITE MIDI SCORE <span aria-hidden="true">♪</span>',
    busyText: "TRANSCRIBING... ✦",
    doneText: "MIDI WRITTEN ✦",
    failStatus: "MIDI EXPORT FAILED",
  }, async () => {
    const { noteLog, bpm, loopDuration, stepStarts } = await renderEnsembleLoop(score, { engageAll: true, captureNotes: true, render: false });
    const tracks = MIDI_TRACKS.map((track) => {
      const events = noteLog.filter((event) => event.channel === track.id);
      const velocities = velocitiesFor(events.map((event) => event.peak));
      return {
        ...track,
        notes: events.map((event, index) => ({
          tick: ticksForSeconds(event.at - LOOP_START_OFFSET, bpm),
          duration: Math.max(1, ticksForSeconds(event.duration, bpm)),
          midi: event.midi,
          velocity: velocities[index],
        })),
      };
    });
    const markers = arrangementMarkers(stepStarts).map(({ at, text }) => ({ tick: ticksForSeconds(at, bpm), text }));
    const bytes = buildMidiFile({ bpm, tracks, lengthTicks: ticksForSeconds(loopDuration, bpm), title: score.name, markers });
    downloadBlob(new Blob([bytes], { type: "audio/midi" }), specimenFilenameFor(score, "mid"));
    elements.status.textContent = `MIDI SCORE WRITTEN · ${noteLog.length} NOTES`;
  });
}

function vitrineCoordinates(event) {
  const rect = elements.canvas.getBoundingClientRect();
  const x = ((event.clientX - rect.left) / Math.max(1, rect.width)) * 2 - 1;
  const y = ((event.clientY - rect.top) / Math.max(1, rect.height)) * 2 - 1;
  return {
    x: Math.max(-1, Math.min(1, x)),
    y: Math.max(-1, Math.min(1, y)),
  };
}

const stageContainer = elements.canvas.closest(".vision-stage");

elements.canvas.addEventListener("pointerdown", async (event) => {
  if (event.button !== undefined && event.button !== 0) return;
  const coords = vitrineCoordinates(event);
  interaction.active = true;
  interaction.pointerId = event.pointerId;
  interaction.x = coords.x;
  interaction.y = coords.y;
  interaction.smoothX = coords.x;
  interaction.smoothY = coords.y;
  interaction.tap = 1;
  interaction.hold = Math.max(interaction.hold, 0.35);
  interaction.dragTravel = Math.floor((((Math.atan2(coords.y, coords.x) + Math.PI) / (Math.PI * 2)) * 12)) % 12;
  interaction.dragDistance = 0;
  interaction.pitchBend = -coords.y;
  interaction.ripples.push({ x: coords.x, y: coords.y, bornAt: performance.now(), strength: 1 });
  vision.burstSpores(1.2);
  triggerSporePuff(1.2);
  stageContainer?.classList.add("is-interacting");
  try {
    elements.canvas.setPointerCapture(event.pointerId);
  } catch {
    // Synthetic or non-capturable pointers safely continue without capture.
  }

  if (!currentScore && oracleSource) {
    const initialPhrase = elements.phrase.value.trim() || SURPRISES[0];
    elements.phrase.value = initialPhrase;
    await summon(initialPhrase);
  } else if (currentScore && transportState.state === TRANSPORT_STATES.STOPPED && !muted) {
    // Tapping a stopped vitrine wakes the loop; a deliberate pause stays paused.
    await runTransportCommand("play");
  }

  updateAudioInteraction();
  triggerPercussion("strike", coords.x, coords.y, 1);
  if (!muted) {
    elements.status.textContent = "VITRINE DISTURBED";
  }
});

elements.canvas.addEventListener("pointermove", (event) => {
  if (!interaction.active || event.pointerId !== interaction.pointerId) return;
  const coords = vitrineCoordinates(event);
  const dx = coords.x - interaction.x;
  const dy = coords.y - interaction.y;
  const delta = Math.hypot(dx, dy);
  interaction.x = coords.x;
  interaction.y = coords.y;
  interaction.dragSpeed = Math.min(1, interaction.dragSpeed + delta * 2.8);
  interaction.pitchBend = -coords.y;
  interaction.dragDistance = (interaction.dragDistance || 0) + delta;
  updateAudioInteraction();

  const now = performance.now();
  const sector = Math.floor((((Math.atan2(coords.y, coords.x) + Math.PI) / (Math.PI * 2)) * 12)) % 12;
  const sectorChanged = sector !== interaction.dragTravel;
  const distanceReached = interaction.dragDistance > 0.12;

  if ((sectorChanged || distanceReached) && (now - interaction.lastTickAt > 110)) {
    interaction.dragTravel = sector;
    interaction.dragDistance = 0;
    interaction.lastTickAt = now;
    interaction.ripples.push({ x: coords.x, y: coords.y, bornAt: now, strength: 0.55 });
    triggerPercussion("ratchet", coords.x, coords.y, Math.min(0.85, 0.4 + interaction.dragSpeed * 0.45));
    triggerSporePuff(0.65);
    vision.burstSpores(0.45);
  }
});

function endVitrineInteraction(event) {
  if (!interaction.active) return;
  if (event?.pointerId !== undefined && interaction.pointerId !== null && event.pointerId !== interaction.pointerId) {
    return;
  }
  interaction.active = false;
  interaction.pointerId = null;
  stageContainer?.classList.remove("is-interacting");
  if (currentTransport && !muted) {
    elements.status.textContent = "OMEN LOOPING";
  }
}

elements.canvas.addEventListener("pointerup", endVitrineInteraction);
elements.canvas.addEventListener("pointercancel", endVitrineInteraction);
elements.canvas.addEventListener("lostpointercapture", endVitrineInteraction);

// --- Parlor mixing console (P5-19) ---------------------------------------

const PLATE_TOGGLE_LABELS = Object.freeze({
  beat: "PULSE",
  bass: "BASS",
  harmony: "ORGAN",
  chime: "CHIMES",
  chant: "CHOIR",
});
const mixerStripElements = {};
const meterDisplay = {};
let meterBuffer = null;
let meterFrame = 0;

// A plate's engage/silence toggle is its mixer mute: one switch, two places.
function channelEngaged(id) {
  return !mixerState.channels[id].muted;
}

function updateMixer(nextState) {
  mixerState = nextState;
  applyMixerToTransport();
  syncMixerConsole();
  syncPlateToggles();
  updateBandstandStatus();
}

function applyMixerToTransport() {
  if (!audioContext || !currentTransport?.strips) return;
  const now = audioContext.currentTime;
  const settings = channelSettings(mixerState);
  for (const { id } of MIXER_CHANNELS) {
    const strip = currentTransport.strips[id];
    if (!strip) continue;
    strip.fader.gain.cancelScheduledValues(now);
    strip.fader.gain.setTargetAtTime(settings[id].gain, now, 0.02);
    if (strip.pan) {
      strip.pan.pan.cancelScheduledValues(now);
      strip.pan.pan.setTargetAtTime(settings[id].pan, now, 0.02);
    }
  }
}

function syncPlateToggles() {
  const toggles = {
    beat: elements.beatToggle,
    bass: elements.bassToggle,
    harmony: elements.harmonyToggle,
    chime: elements.chimeToggle,
    chant: elements.chantToggle,
  };
  for (const [id, toggle] of Object.entries(toggles)) {
    if (!toggle) continue;
    const engaged = channelEngaged(id);
    toggle.setAttribute("aria-pressed", String(engaged));
    toggle.textContent = `${PLATE_TOGGLE_LABELS[id]}: ${engaged ? "ENGAGED" : "SILENCED"}`;
  }
}

function syncMixerConsole() {
  const soloActive = anySoloed(mixerState);
  let mutedCount = 0;
  let soloCount = 0;
  for (const { id, label } of MIXER_CHANNELS) {
    const refs = mixerStripElements[id];
    const channel = mixerState.channels[id];
    if (channel.muted) mutedCount += 1;
    if (channel.soloed) soloCount += 1;
    if (!refs) continue;
    const db = formatDb(faderDb(channel.fader));
    const pan = formatPan(channel.pan);
    refs.fader.value = String(channel.fader);
    refs.fader.setAttribute("aria-valuetext", db);
    refs.db.value = db;
    refs.pan.value = String(channel.pan);
    refs.pan.setAttribute("aria-valuetext", pan === "C" ? "Center" : pan.replace("L", "Left ").replace("R", "Right "));
    refs.panValue.value = pan;
    refs.mute.setAttribute("aria-pressed", String(channel.muted));
    refs.solo.setAttribute("aria-pressed", String(channel.soloed));
    refs.strip.classList.toggle("is-silent", !isChannelAudible(mixerState, id));
    refs.strip.title = `${label}: ${isChannelAudible(mixerState, id) ? "audible" : "silent"}`;
  }
  if (elements.mixerTelemetry) {
    const parts = [`${MIXER_CHANNELS.length} CHANNELS`];
    if (soloActive) parts.push(`${soloCount} SOLO`);
    if (mutedCount) parts.push(`${mutedCount} MUTED`);
    if (!soloActive && !mutedCount) parts.push("ALL OPEN");
    elements.mixerTelemetry.textContent = parts.join(" · ");
  }
}

function renderMixerConsole() {
  if (!elements.mixerStrips) return;
  elements.mixerStrips.replaceChildren();
  for (const { id, label, source } of MIXER_CHANNELS) {
    const strip = document.createElement("div");
    strip.className = "mixer-strip";
    strip.dataset.channel = id;
    strip.setAttribute("role", "group");
    strip.setAttribute("aria-label", `${label} channel`);

    const name = document.createElement("p");
    name.className = "mixer-strip-label";
    name.textContent = label;
    const sourceTag = document.createElement("span");
    sourceTag.className = "mixer-strip-source";
    sourceTag.textContent = source;
    name.append(sourceTag);

    const bay = document.createElement("div");
    bay.className = "mixer-fader-bay";
    const meter = document.createElement("div");
    meter.className = "mixer-meter";
    meter.setAttribute("aria-hidden", "true");
    const fill = document.createElement("span");
    fill.className = "mixer-meter-fill";
    const peak = document.createElement("span");
    peak.className = "mixer-meter-peak";
    meter.append(fill, peak);
    const fader = document.createElement("input");
    fader.type = "range";
    fader.className = "mixer-fader";
    fader.id = `mixer-fader-${id}`;
    fader.min = "0";
    fader.max = "100";
    fader.step = "1";
    fader.setAttribute("aria-label", `${label} level`);
    fader.title = "Drag to set level (double-click for unity)";
    bay.append(meter, fader);

    const db = document.createElement("output");
    db.className = "mixer-db";
    db.htmlFor = fader.id;

    const pan = document.createElement("input");
    pan.type = "range";
    pan.className = "mixer-pan";
    pan.id = `mixer-pan-${id}`;
    pan.min = "-100";
    pan.max = "100";
    pan.step = "1";
    pan.setAttribute("aria-label", `${label} pan`);
    pan.title = "Drag to pan (double-click to center)";
    const panValue = document.createElement("output");
    panValue.className = "mixer-pan-value";
    panValue.htmlFor = pan.id;

    const switches = document.createElement("div");
    switches.className = "mixer-switches";
    const mute = document.createElement("button");
    mute.type = "button";
    mute.className = "mixer-switch mixer-mute";
    mute.textContent = "M";
    mute.setAttribute("aria-label", `Mute ${label}`);
    const solo = document.createElement("button");
    solo.type = "button";
    solo.className = "mixer-switch mixer-solo";
    solo.textContent = "S";
    solo.setAttribute("aria-label", `Solo ${label}`);
    switches.append(mute, solo);

    fader.addEventListener("input", () => updateMixer(setFader(mixerState, id, fader.value)));
    fader.addEventListener("dblclick", () => updateMixer(setFader(mixerState, id, FADER_UNITY)));
    pan.addEventListener("input", () => updateMixer(setPan(mixerState, id, pan.value)));
    pan.addEventListener("dblclick", () => updateMixer(setPan(mixerState, id, 0)));
    mute.addEventListener("click", () => updateMixer(toggleMute(mixerState, id)));
    solo.addEventListener("click", () => updateMixer(toggleSolo(mixerState, id)));

    const tacet = document.createElement("span");
    tacet.className = "mixer-tacet";
    tacet.textContent = "TACET";
    tacet.title = "The INTERCAL conductor rests this voice for the current section";
    name.append(tacet);

    strip.append(name, bay, db, pan, panValue, switches);
    elements.mixerStrips.append(strip);
    mixerStripElements[id] = { strip, fader, db, pan, panValue, mute, solo, tacet };
  }
  syncMixerConsole();
}

// VU meters read each strip's post-fader analyser once per frame: fast attack,
// ~1.2 s fall, and a peak marker that holds for 0.9 s. The loop stops once the
// transport is gone and every meter has fallen to rest.
function drawMeters(timestamp) {
  meterFrame = 0;
  const strips = currentTransport?.strips;
  let moving = false;
  for (const { id } of MIXER_CHANNELS) {
    const display = (meterDisplay[id] ||= { level: 0, peak: 0, peakAt: 0, clipUntil: 0 });
    const analyser = strips?.[id]?.analyser;
    let reading = null;
    if (analyser) {
      if (!meterBuffer || meterBuffer.length !== analyser.fftSize) meterBuffer = new Float32Array(analyser.fftSize);
      analyser.getFloatTimeDomainData(meterBuffer);
      reading = meterReading(meterBuffer);
    }
    const level = reading ? meterFill(reading.rmsDb) : 0;
    const peak = reading ? meterFill(reading.peakDb) : 0;
    display.level = level >= display.level ? level : Math.max(level, display.level - 0.014);
    if (peak >= display.peak) {
      display.peak = peak;
      display.peakAt = timestamp;
    } else if (timestamp - display.peakAt > 900) {
      display.peak = Math.max(peak, display.peak - 0.012);
    }
    if (reading && reading.peak >= 0.99) display.clipUntil = timestamp + 1200;
    const refs = mixerStripElements[id];
    if (refs) {
      refs.strip.style.setProperty("--level", display.level.toFixed(3));
      refs.strip.style.setProperty("--peak", display.peak.toFixed(3));
      refs.strip.classList.toggle("is-clipping", timestamp < display.clipUntil);
    }
    if (display.level > 0.002 || display.peak > 0.002) moving = true;
  }
  if (currentTransport || moving) meterFrame = window.requestAnimationFrame(drawMeters);
}

function startMeters() {
  if (!meterFrame) meterFrame = window.requestAnimationFrame(drawMeters);
}

function setBandPlayersEnabled(nextState) {
  updateMixer(setMuted(mixerState, ACCOMPANIMENT_CHANNEL_IDS, !nextState));
}

elements.beatToggle?.addEventListener("click", () => {
  updateMixer(toggleMute(mixerState, "beat"));
});

elements.beatMutate?.addEventListener("click", () => {
  if (!currentScore || !beatSource) return;
  beatMutation += 1;
  recomposePlate("beat");
  applyEnsembleConductor();
  updateBeatGrid();
  updateBassGrid();
});

elements.bassToggle?.addEventListener("click", () => {
  updateMixer(toggleMute(mixerState, "bass"));
});

elements.bassMutate?.addEventListener("click", () => {
  if (!currentScore || !bassSource) return;
  bassMutation += 1;
  recomposePlate("bass");
  applyEnsembleConductor();
  updateBassGrid();
});

elements.harmonyToggle?.addEventListener("click", () => {
  updateMixer(toggleMute(mixerState, "harmony"));
});

elements.harmonyMutate?.addEventListener("click", () => {
  if (!currentScore || !harmonySource) return;
  harmonyMutation += 1;
  recomposePlate("harmony");
  applyEnsembleConductor();
  updateHarmonyGrid();
  updateBassGrid();
  updateChimeGrid();
  updateChantGrid();
});

elements.chimeToggle?.addEventListener("click", () => {
  updateMixer(toggleMute(mixerState, "chime"));
});

elements.chimeMutate?.addEventListener("click", () => {
  if (!currentScore || !pietSource || !fractranSource) return;
  chimeMutation += 1;
  recomposePlate("chime");
  applyEnsembleConductor();
  updateChimeGrid();
});

elements.chantToggle?.addEventListener("click", () => {
  updateMixer(toggleMute(mixerState, "chant"));
});

elements.chantMutate?.addEventListener("click", () => {
  if (!currentScore || !chantSource) return;
  chantMutation += 1;
  recomposePlate("chant");
  applyEnsembleConductor();
  updateChantGrid();
});

elements.mixerReset?.addEventListener("click", () => {
  updateMixer(createMixerState());
});

renderMixerConsole();
syncPlateToggles();


// --- Session ledger: .fun files and on-device presets (P5-20, D-026) -------

function captureSession() {
  return {
    format: SESSION_FORMAT,
    version: SESSION_VERSION,
    phrase: currentScore.phrase,
    tempo: activeTempoBpm,
    volume: Math.round(masterVolume),
    genre: activeGenre,
    strictness: activeStrictness,
    acoustics: {
      enabled: parlorAcousticsEnabled,
      level: Math.round(parlorAcousticsLevel * 100),
      crackle: parlorCrackleEnabled,
      reverb: parlorReverbEnabled,
      ticks: parlorTickEnabled,
    },
    funMachine: {
      style: funMachineStyle,
    },
    song,
    plates: Object.fromEntries(PLATE_IDS.map((id) => [id, {
      mutation: plateMutation(id),
      cellCycles: [...plateCellCycles[id]],
    }])),
    mixer: Object.fromEntries(MIXER_CHANNEL_IDS.map((id) => [id, { ...mixerState.channels[id] }])),
  };
}

function syncSessionControls() {
  if (elements.kapellmeisterGenre) elements.kapellmeisterGenre.value = activeGenre;
  if (elements.kapellmeisterStrictness) {
    elements.kapellmeisterStrictness.value = String(activeStrictness);
    elements.kapellmeisterStrictness.dispatchEvent(new Event("input"));
  }
  if (elements.parlorAcousticsToggle) {
    elements.parlorAcousticsToggle.setAttribute("aria-pressed", String(parlorAcousticsEnabled));
    elements.parlorAcousticsToggle.textContent = parlorAcousticsEnabled ? "ACOUSTICS: ENGAGED" : "ACOUSTICS: SILENCED";
  }
  if (elements.parlorAcousticsLevel) elements.parlorAcousticsLevel.value = String(Math.round(parlorAcousticsLevel * 100));
  if (elements.acousticsLevelVal) elements.acousticsLevelVal.textContent = `${Math.round(parlorAcousticsLevel * 100)}%`;
  updateAcousticsStatus();
  setFunStyle(funMachineStyle);
  if (elements.volume) elements.volume.value = String(Math.round(masterVolume));
}

/**
 * Restores a validated session: summons its phrase, then layers the plates'
 * mutations and cell edits, the punched progression, rulebook, room, tempo,
 * volume, and console on top. A playing transport restarts on the new loop.
 */
function applySession(session) {
  if (!oracleSource) throw new Error("Spell unavailable");
  const score = composeScore(oracleSource, session.phrase);
  activeGenre = session.genre;
  activeStrictness = session.strictness;
  funMachineStyle = session.funMachine.style;
  // The loop machine's song travels with the session (v4); older files bring none.
  song = session.song;
  selectedLoop = clampSelection(song, song.loops.length - 1);
  recorder = idleRecorder();
  if (currentTransport) currentTransport.followedSlot = null;
  parlorAcousticsEnabled = session.acoustics.enabled;
  parlorAcousticsLevel = session.acoustics.level / 100;
  parlorCrackleEnabled = session.acoustics.crackle;
  parlorReverbEnabled = session.acoustics.reverb;
  parlorTickEnabled = session.acoustics.ticks;
  elements.phrase.value = session.phrase;
  showScore(score);

  beatMutation = session.plates.beat.mutation;
  bassMutation = session.plates.bass.mutation;
  harmonyMutation = session.plates.harmony.mutation;
  chimeMutation = session.plates.chime.mutation;
  chantMutation = session.plates.chant.mutation;
  for (const id of PLATE_IDS) {
    recomposePlate(id);
    session.plates[id].cellCycles.forEach((count, index) => applyCellCycle(id, index, count));
    plateCellCycles[id] = [...session.plates[id].cellCycles];
  }

  applyEnsembleConductor();
  updateBeatGrid();
  updateBassGrid();
  updateHarmonyGrid();
  updateChimeGrid();
  updateChantGrid();
  updateFunKeyboardChordLabels();
  setTempoBpm(session.tempo);
  setMasterVolume(session.volume);
  syncSessionControls();
  updateMixer(mixerStateFromChannels(session.mixer));
  renderLooper();

  if (transportState.state === TRANSPORT_STATES.PLAYING && !muted) {
    runTransportCommand("restart");
  } else {
    stopCurrentSound();
    transportState = createTransportState();
    syncTransportUI();
    highlightBeatStep(-1);
    updateTransportPosition(null);
  }
}

// localStorage can be missing, full, or blocked (private windows, previews);
// every access is guarded and the ledger still works with files alone.
function readPresetStore() {
  let text;
  try {
    text = window.localStorage.getItem(PRESET_STORAGE_KEY);
  } catch {
    return emptyPresetStore();
  }
  // Throws until src/rulebooks.ni is installed, so nothing reads or rewrites
  // presets with an empty genre list.
  return parsePresetStore(text);
}

function writePresetStore(store) {
  try {
    if (store.presets.length) {
      window.localStorage.setItem(PRESET_STORAGE_KEY, serializePresetStore(store));
    } else {
      window.localStorage.removeItem(PRESET_STORAGE_KEY);
    }
    return true;
  } catch {
    return false;
  }
}

function setSessionTelemetry(text) {
  if (elements.sessionTelemetry) elements.sessionTelemetry.textContent = text;
  elements.status.textContent = text;
}

function renderPresetList(selectName = null) {
  const list = elements.sessionPresetList;
  if (!list) return;
  const { presets } = readPresetStore();
  list.replaceChildren();
  if (!presets.length) {
    const option = document.createElement("option");
    option.value = "";
    option.textContent = "— NO PRESETS IN THIS BROWSER —";
    list.append(option);
  }
  for (const preset of presets) {
    const option = document.createElement("option");
    option.value = preset.name;
    option.textContent = `${preset.name} · ${preset.session.phrase}`;
    list.append(option);
  }
  if (selectName) list.value = selectName;
  list.disabled = !presets.length;
  if (elements.sessionLoadPreset) elements.sessionLoadPreset.disabled = !presets.length;
  if (elements.sessionDeletePreset) elements.sessionDeletePreset.disabled = !presets.length;
}

function syncSessionButtons() {
  const ready = Boolean(currentScore);
  if (elements.sessionSavePreset) elements.sessionSavePreset.disabled = !ready;
  if (elements.sessionSaveFile) elements.sessionSaveFile.disabled = !ready;
}

function describeSessionError(error) {
  return error?.name === "SessionError" ? error.path.replace(/^session\.?/, "").toUpperCase() || "FILE" : "UNREADABLE";
}

elements.sessionSavePreset?.addEventListener("click", () => {
  if (!currentScore) return;
  const name = elements.sessionPresetName?.value.trim() || currentScore.name.slice(0, 40);
  try {
    const store = upsertPreset(readPresetStore(), name, captureSession(), new Date().toISOString());
    if (!writePresetStore(store)) {
      setSessionTelemetry("BROWSER STORAGE UNAVAILABLE · SAVE A .FUN FILE INSTEAD");
      return;
    }
    renderPresetList(store.presets[0].name);
    setSessionTelemetry(`PRESET SAVED IN THIS BROWSER · ${store.presets[0].name.toUpperCase()}`);
  } catch (error) {
    setSessionTelemetry(`PRESET NOT SAVED · ${describeSessionError(error)}`);
  }
});

elements.sessionLoadPreset?.addEventListener("click", () => {
  const name = elements.sessionPresetList?.value;
  const preset = readPresetStore().presets.find((entry) => entry.name === name);
  if (!preset) {
    renderPresetList();
    return;
  }
  try {
    applySession(preset.session);
    setSessionTelemetry(`PRESET LOADED · ${preset.name.toUpperCase()}`);
  } catch (error) {
    console.error(error);
    setSessionTelemetry("PRESET COULD NOT BE LOADED");
  }
});

elements.sessionDeletePreset?.addEventListener("click", () => {
  const name = elements.sessionPresetList?.value;
  if (!name || !window.confirm(`Delete the preset "${name}" from this browser?`)) return;
  if (writePresetStore(removePreset(readPresetStore(), name))) {
    renderPresetList();
    setSessionTelemetry(`PRESET DELETED · ${name.toUpperCase()}`);
  }
});

elements.sessionSaveFile?.addEventListener("click", () => {
  if (!currentScore) return;
  try {
    const text = serializeSession(captureSession());
    downloadBlob(new Blob([text], { type: "application/json" }), specimenFilenameFor(currentScore, SESSION_FILE_EXTENSION));
    setSessionTelemetry("SESSION SEALED INTO A .FUN FILE");
  } catch (error) {
    setSessionTelemetry(`SESSION NOT SAVED · ${describeSessionError(error)}`);
  }
});

elements.sessionOpenFile?.addEventListener("click", () => {
  elements.sessionFileInput?.click();
});

elements.sessionFileInput?.addEventListener("change", async () => {
  const input = elements.sessionFileInput;
  const file = input.files?.[0];
  input.value = "";
  if (!file) return;
  if (file.size > MAX_SESSION_BYTES) {
    setSessionTelemetry("SESSION REJECTED · FILE TOO LARGE");
    return;
  }
  try {
    applySession(parseSession(await file.text()));
    setSessionTelemetry("SESSION RESTORED FROM .FUN FILE");
  } catch (error) {
    if (error?.name !== "SessionError") console.error(error);
    setSessionTelemetry(`SESSION REJECTED · ${describeSessionError(error)}`);
  }
});

syncSessionButtons();

// ---------------------------------------------------------------------------
// Discovery and the whole cabinet (D-037). Each drawer target keeps its own
// markup and ids; at load its contents move into a drawer body behind a bar
// with a name, a one-line invitation, and a toggle. Hidden bodies leave the
// tab order and the accessibility tree. Without this script every drawer
// stays open, so nothing becomes unreachable.

let cabinetState = readCabinetState();
let loopsHeard = 0;
const drawerElements = {};

function readCabinetState() {
  try {
    return parseCabinetState(window.localStorage.getItem(CABINET_STORAGE_KEY));
  } catch {
    return defaultCabinetState();
  }
}

function writeCabinetState() {
  try {
    window.localStorage.setItem(CABINET_STORAGE_KEY, serializeCabinetState(cabinetState));
  } catch {
    // Storage can be blocked; the cabinet still works for this visit.
  }
}

function buildDrawers() {
  for (const drawer of DRAWERS) {
    const host = document.getElementById(drawer.target);
    if (!host) continue;
    const header = host.classList.contains("workstation-wing") ? host.querySelector(":scope > .wing-header") : null;
    const body = document.createElement("div");
    body.className = "drawer-body";
    body.id = `drawer-body-${drawer.id}`;
    body.append(...[...host.children].filter((child) => child !== header));
    body.addEventListener("animationend", () => body.classList.remove("is-newly-open"));

    const bar = document.createElement("div");
    bar.className = "drawer-bar";
    const invite = document.createElement("p");
    invite.className = "drawer-invite";
    const name = document.createElement("b");
    name.textContent = drawer.label;
    const line = document.createElement("span");
    invite.append(name, line);
    const toggle = document.createElement("button");
    toggle.type = "button";
    toggle.className = "drawer-toggle";
    toggle.setAttribute("aria-controls", body.id);
    toggle.addEventListener("click", () => applyCabinet(cabinetReduce(cabinetState, { type: "toggle", drawer: drawer.id })));
    bar.append(invite, toggle);

    host.append(bar, body);
    drawerElements[drawer.id] = { host, bar, body, toggle, line };
  }
  const toggle = document.querySelector("#cabinet-mode-toggle");
  toggle?.addEventListener("click", () => {
    const mode = cabinetState.mode === "cabinet" ? "discovery" : "cabinet";
    applyCabinet(cabinetReduce(cabinetState, { type: "mode", mode }));
    announceCabinet(mode === "cabinet" ? "THE WHOLE CABINET IS OPEN" : "BACK TO DISCOVERY · THE DRAWERS OPEN AS YOU PLAY");
  });
  document.querySelector("#cabinet-switch")?.removeAttribute("hidden");
}

function renderCabinet() {
  const whole = cabinetState.mode === "cabinet";
  for (const drawer of DRAWERS) {
    const refs = drawerElements[drawer.id];
    if (!refs) continue;
    const open = isDrawerOpen(cabinetState, drawer.id);
    refs.body.hidden = !open;
    refs.bar.hidden = whole;
    refs.host.classList.toggle("is-sealed", !open);
    refs.toggle.setAttribute("aria-expanded", String(open));
    refs.toggle.textContent = open ? `CLOSE ${drawer.label}` : `OPEN ${drawer.label}`;
    refs.line.textContent = open ? " · OPEN" : ` · ${drawer.invite.toUpperCase()}`;
  }
  const toggle = document.querySelector("#cabinet-mode-toggle");
  if (toggle) {
    toggle.setAttribute("aria-pressed", String(whole));
    toggle.textContent = whole ? "RETURN TO DISCOVERY" : "OPEN THE WHOLE CABINET";
  }
  const text = document.querySelector("#cabinet-switch-text");
  if (text) text.textContent = whole ? "THE WHOLE CABINET · EVERY DRAWER LAID BARE" : "DISCOVERY · THE DRAWERS OPEN AS YOU PLAY";
}

function announceCabinet(message) {
  const announcer = document.querySelector("#cabinet-announcer");
  if (announcer) announcer.textContent = message;
}

function applyCabinet({ state, opened }) {
  if (state === cabinetState) return;
  cabinetState = state;
  writeCabinetState();
  renderCabinet();
  if (opened) {
    const drawer = DRAWERS.find((entry) => entry.id === opened);
    drawerElements[opened]?.body.classList.add("is-newly-open");
    announceCabinet(`THE ${drawer.label} DRAWER OPENS`);
  }
}

function unlockDrawer(trigger) {
  const drawer = drawerForTrigger(trigger);
  if (drawer) applyCabinet(cabinetReduce(cabinetState, { type: "unlock", drawer }));
}

function noteLoopHeard() {
  loopsHeard += 1;
  unlockDrawer("loop");
  if (loopsHeard >= LOOPS_BEFORE_BAND) unlockDrawer("band");
}

// Anything worth keeping (a rulebook, a fader, a plate edit, an
// accompaniment style) opens the Keep drawer; soloing or silencing a voice
// opens the band.
const KEEPSAKE_AREAS = "#kapellmeister-engine, #wing-mix, #wing-band, .fun-quality-chips";
function noteVisitorChange(event) {
  const target = event.target;
  if (!(target instanceof Element) || target.closest(".drawer-toggle, #cabinet-switch")) return;
  if (target.closest(KEEPSAKE_AREAS)) unlockDrawer("change");
  if (event.type === "click" && target.closest("#mixer-strips button, #bandstand-engine button")) unlockDrawer("band");
}
for (const type of ["input", "change", "click"]) document.addEventListener(type, noteVisitorChange);

buildDrawers();
renderCabinet();

// ---------------------------------------------------------------------------
// The loop machine (D-039, P5-26). `song` is the visitor's arrangement of
// recorded takes, kept across summons; the recorder turns held keys into a
// take one step at a time, from the same moment the live accompanist reads.

let song = emptySong();
let recorder = idleRecorder();
let selectedLoop = null;
const performanceCache = new Map();

function performanceFor(slot) {
  const tonic = currentScore ? currentScore.root : 0;
  const key = `${slot.key}:${slot.style}:${activeGenre}:${tonic}`;
  if (!performanceCache.has(key)) performanceCache.set(key, buildPerformance(slot.key, slot.style, activeGenre, tonic));
  return performanceCache.get(key);
}

function announceLooper(message) {
  const announcer = document.querySelector("#looper-announcer");
  if (announcer) announcer.textContent = message;
}

function advanceRecorder(stepIndex, position, liveSlot) {
  if (recorder.mode === "idle") return;
  const wasArmed = recorder.mode === "armed";
  const result = recorderReduce(recorder, { type: "step", step: stepIndex, loopIndex: position?.loopIndex ?? null, held: liveSlot });
  recorder = result.recorder;
  if (wasArmed && recorder.mode === "recording") {
    announceLooper(recorder.kind === "new" ? "RECORDING A NEW LOOP" : `OVERDUBBING LOOP ${recorder.loopIndex + 1}`);
  }
  if (result.finished) landTake(result.finished);
  renderLooper();
}

function landTake({ kind, loopIndex, take }) {
  if (isEmptyTake(take)) {
    announceLooper("NO KEY WAS HELD · THE TAKE WAS DISCARDED");
    return;
  }
  const next = kind === "new" ? appendLoop(song, take) : overdubLayer(song, loopIndex, take);
  if (next === song) {
    announceLooper(kind === "new" ? "THE SONG IS FULL" : "THAT LOOP ALREADY HAS FOUR LAYERS");
    return;
  }
  song = next;
  selectedLoop = kind === "new" ? song.loops.length - 1 : loopIndex;
  announceLooper(kind === "new" ? `LOOP ${song.loops.length} ADDED TO THE SONG` : `LAYER ADDED TO LOOP ${loopIndex + 1}`);
  unlockDrawer("change");
}

// The band follows a live key (conducted when the key goes down), else the
// newest recorded layer holding a key at this step, else its own score.
function followSong(transport, loop, stepIndex, liveSlot) {
  if (liveSlot) {
    transport.songLeading = false;
    transport.followedSlot = "live";
    return;
  }
  const lead = leadSlotAt(loop, stepIndex);
  transport.songLeading = Boolean(lead);
  const followed = lead ? `${lead.key}:${lead.style}` : null;
  if (followed === transport.followedSlot) return;
  transport.followedSlot = followed;
  if (lead) applyEnsembleConductor(performanceFor(lead).steps.map((step) => step.chord));
  else applyEnsembleConductor();
}

function armRecorder(kind) {
  if (!currentScore) {
    announceLooper("SUMMON A CREATURE FIRST");
    return;
  }
  if (recorder.mode !== "idle" && recorder.kind === kind) {
    recorder = idleRecorder();
    announceLooper("RECORDING CANCELLED");
    renderLooper();
    return;
  }
  if (kind === "new" && !canAppendLoop(song)) {
    announceLooper("THE SONG IS FULL");
    return;
  }
  if (kind === "overdub" && !canOverdub(song, selectedLoop)) {
    announceLooper(song.loops.length ? "THAT LOOP ALREADY HAS FOUR LAYERS" : "RECORD A LOOP FIRST");
    return;
  }
  recorder = recorderReduce(idleRecorder(), kind === "new" ? { type: "arm", kind } : { type: "arm", kind, loopIndex: selectedLoop }).recorder;
  announceLooper(kind === "new" ? "ARMED · THE NEW LOOP STARTS ON STEP 1" : `ARMED · THE OVERDUB STARTS WITH LOOP ${selectedLoop + 1}`);
  renderLooper();
  if (transportState.state !== TRANSPORT_STATES.PLAYING) runTransportCommand("play");
}

function cancelRecording() {
  if (recorder.mode === "idle") return;
  recorder = idleRecorder();
  announceLooper("RECORDING STOPPED · NOTHING WAS KEPT");
  renderLooper();
}

function clearSong() {
  song = emptySong();
  selectedLoop = null;
  recorder = idleRecorder();
  if (currentTransport) currentTransport.followedSlot = null;
  if (currentTransport) currentTransport.songLeading = false;
  if (activeHeldFunKey === null) applyEnsembleConductor();
  announceLooper("THE SONG IS CLEARED");
  renderLooper();
}

function looperReadoutText() {
  const plural = (n, word) => `${n} ${word}${n === 1 ? "" : "S"}`;
  if (recorder.mode === "armed") return recorder.kind === "new" ? "ARMED · NEW LOOP STARTS ON STEP 1" : `ARMED · OVERDUB WAITS FOR LOOP ${recorder.loopIndex + 1}`;
  if (recorder.mode === "recording") return recorder.kind === "new" ? "● RECORDING A NEW LOOP" : `● OVERDUBBING LOOP ${recorder.loopIndex + 1}`;
  if (!song.loops.length) return "NO LOOPS YET · HOLD KEYS AND RECORD WHAT YOU PLAY";
  const playing = currentTransport?.songPosition;
  const now = playing ? `NOW LOOP ${playing.loopIndex + 1} · ` : "";
  const target = selectedLoop !== null ? ` · OVERDUB TARGET LOOP ${selectedLoop + 1} (${plural(song.loops[selectedLoop].layers.length, "LAYER")})` : "";
  return `${now}${plural(song.loops.length, "LOOP")} · ${plural(songPasses(song), "PASS")}${target}`.replace("PASSS", "PASSES");
}

// Tiles are rebuilt only when the song or the selection changes, so a focused
// tile keeps focus while the loop plays; the playing mark is a class toggle.
let renderedTiles = null;
function renderLooperTiles() {
  const list = document.querySelector("#looper-tiles");
  if (!list) return;
  const signature = [song, selectedLoop];
  if (!renderedTiles || renderedTiles[0] !== signature[0] || renderedTiles[1] !== signature[1]) {
    renderedTiles = signature;
    list.replaceChildren(...song.loops.map((loop, index) => {
      const item = document.createElement("li");
      const tile = document.createElement("button");
      tile.type = "button";
      tile.className = "looper-tile";
      tile.dataset.loop = String(index);
      tile.setAttribute("aria-pressed", String(index === selectedLoop));
      tile.setAttribute("aria-label", `Loop ${index + 1}: ${loop.layers.length} layer${loop.layers.length === 1 ? "" : "s"}, plays ${loop.repeats} time${loop.repeats === 1 ? "" : "s"}`);
      const number = document.createElement("b");
      number.textContent = `LOOP ${index + 1}`;
      const detail = document.createElement("span");
      detail.textContent = `${loop.layers.length}L · ×${loop.repeats}`;
      tile.append(number, detail);
      tile.addEventListener("click", () => {
        selectedLoop = index;
        renderLooper();
      });
      item.append(tile);
      return item;
    }));
  }
  const playing = currentTransport?.audiblePosition?.loopIndex ?? null;
  for (const tile of list.querySelectorAll(".looper-tile")) {
    tile.classList.toggle("is-playing", Number(tile.dataset.loop) === playing);
  }
}

function renderLooperEdit() {
  const loop = selectedLoop !== null ? song.loops[selectedLoop] : null;
  const busy = recorder.mode !== "idle";
  const label = document.querySelector("#looper-edit-label");
  if (label) label.textContent = loop ? `LOOP ${selectedLoop + 1} · ${loop.layers.length} LAYER${loop.layers.length === 1 ? "" : "S"}` : "NO LOOP SELECTED";
  const repeats = document.querySelector("#looper-repeats");
  if (repeats) repeats.value = loop ? `×${loop.repeats}` : "×1";
  const enable = (id, on) => {
    const button = document.querySelector(id);
    if (button) button.disabled = !on;
  };
  enable("#looper-repeats-down", loop && loop.repeats > 1);
  enable("#looper-repeats-up", loop && loop.repeats < MAX_REPEATS && songPasses(song) < MAX_SONG_PASSES);
  enable("#looper-move-earlier", loop && !busy && selectedLoop > 0);
  enable("#looper-move-later", loop && !busy && selectedLoop < song.loops.length - 1);
  enable("#looper-undo", loop && !busy);
  enable("#looper-delete", loop && !busy);
}

// Applies a song edit, keeps the selection valid, lets the band re-follow the
// edited song on the next step, and says what happened (or why nothing did).
function editSong(next, { selection = selectedLoop, done, refused }) {
  if (next === song) {
    if (refused) announceLooper(refused);
    renderLooper();
    return;
  }
  song = next;
  selectedLoop = clampSelection(song, selection);
  if (currentTransport) currentTransport.followedSlot = null;
  if (!song.loops.length && activeHeldFunKey === null) applyEnsembleConductor();
  announceLooper(done);
  renderLooper();
}

function renderLooper() {
  renderLooperTiles();
  renderLooperEdit();
  const record = document.querySelector("#looper-record");
  const overdub = document.querySelector("#looper-overdub");
  const clear = document.querySelector("#looper-clear");
  const readout = document.querySelector("#looper-readout");
  const active = (kind) => recorder.mode !== "idle" && recorder.kind === kind;
  record?.setAttribute("aria-pressed", String(active("new")));
  overdub?.setAttribute("aria-pressed", String(active("overdub")));
  if (overdub) overdub.disabled = !song.loops.length;
  if (clear) clear.disabled = !song.loops.length && recorder.mode === "idle";
  if (readout) readout.value = looperReadoutText();
}

document.querySelector("#looper-record")?.addEventListener("click", () => armRecorder("new"));
document.querySelector("#looper-overdub")?.addEventListener("click", () => armRecorder("overdub"));
document.querySelector("#looper-clear")?.addEventListener("click", clearSong);
document.querySelector("#looper-repeats-down")?.addEventListener("click", () => {
  const loop = song.loops[selectedLoop];
  if (loop) editSong(setRepeats(song, selectedLoop, loop.repeats - 1), { done: `LOOP ${selectedLoop + 1} PLAYS ${loop.repeats - 1} TIME${loop.repeats - 1 === 1 ? "" : "S"}` });
});
document.querySelector("#looper-repeats-up")?.addEventListener("click", () => {
  const loop = song.loops[selectedLoop];
  if (!loop) return;
  const next = setRepeats(song, selectedLoop, loop.repeats + 1);
  editSong(next, {
    done: `LOOP ${selectedLoop + 1} PLAYS ${loop.repeats + 1} TIMES`,
    refused: loop.repeats >= MAX_REPEATS ? `A LOOP PLAYS AT MOST ${MAX_REPEATS} TIMES` : `THE SONG IS AT ITS ${MAX_SONG_PASSES}-PASS LIMIT`,
  });
});
document.querySelector("#looper-move-earlier")?.addEventListener("click", () => {
  if (selectedLoop !== null) editSong(moveLoop(song, selectedLoop, -1), { selection: selectedLoop - 1, done: `LOOP MOVED TO POSITION ${selectedLoop}` });
});
document.querySelector("#looper-move-later")?.addEventListener("click", () => {
  if (selectedLoop !== null) editSong(moveLoop(song, selectedLoop, 1), { selection: selectedLoop + 1, done: `LOOP MOVED TO POSITION ${selectedLoop + 2}` });
});
document.querySelector("#looper-undo")?.addEventListener("click", () => {
  const loop = song.loops[selectedLoop];
  if (!loop) return;
  editSong(undoLayer(song, selectedLoop), { done: loop.layers.length > 1 ? `NEWEST LAYER OF LOOP ${selectedLoop + 1} REMOVED` : `LOOP ${selectedLoop + 1} REMOVED` });
});
document.querySelector("#looper-delete")?.addEventListener("click", () => {
  if (selectedLoop !== null) editSong(deleteLoop(song, selectedLoop), { done: `LOOP ${selectedLoop + 1} DELETED` });
});
renderLooper();

elements.bandstandEngageAll?.addEventListener("click", () => {
  setBandPlayersEnabled(true);
});

elements.bandstandSoloLead?.addEventListener("click", () => {
  setBandPlayersEnabled(false);
});

elements.bandstandMutateAll?.addEventListener("click", () => {
  if (!currentScore) return;
  elements.beatMutate?.click();
  elements.bassMutate?.click();
  elements.harmonyMutate?.click();
  elements.chimeMutate?.click();
  elements.chantMutate?.click();
  if (elements.bandstandTelemetry) {
    elements.bandstandTelemetry.textContent = `ENSEMBLE JAM MUTATION #${beatMutation} APPLIED ACROSS ALL PLATES`;
  }
});

function updateAcousticsStatus() {
  if (!elements.acousticsStatus) return;
  const crackleActive = parlorAcousticsEnabled && parlorCrackleEnabled;
  const reverbActive = parlorAcousticsEnabled && parlorReverbEnabled;
  const tickActive = parlorAcousticsEnabled && parlorTickEnabled;

  elements.chipCrackle?.classList.toggle("is-active", crackleActive);
  elements.chipCrackle?.setAttribute("aria-pressed", String(crackleActive));
  elements.chipReverb?.classList.toggle("is-active", reverbActive);
  elements.chipReverb?.setAttribute("aria-pressed", String(reverbActive));
  elements.chipTick?.classList.toggle("is-active", tickActive);
  elements.chipTick?.setAttribute("aria-pressed", String(tickActive));

  if (!parlorAcousticsEnabled || (!crackleActive && !reverbActive && !tickActive)) {
    elements.acousticsStatus.textContent = "PARLOR ACOUSTICS MUTED · DRY ISOLATION";
  } else {
    const activeLayers = [];
    if (crackleActive) activeLayers.push("WAX CRACKLE");
    if (reverbActive) activeLayers.push("CHAMBER REVERB");
    if (tickActive) activeLayers.push("CLOCKWORK");
    elements.acousticsStatus.textContent = `${activeLayers.join(" · ")} ACTIVE`;
  }
}

elements.parlorAcousticsToggle?.addEventListener("click", () => {
  parlorAcousticsEnabled = !parlorAcousticsEnabled;
  elements.parlorAcousticsToggle.setAttribute("aria-pressed", String(parlorAcousticsEnabled));
  elements.parlorAcousticsToggle.textContent = parlorAcousticsEnabled ? "ACOUSTICS: ENGAGED" : "ACOUSTICS: SILENCED";
  if (audioContext && currentTransport) {
    const now = audioContext.currentTime;
    currentTransport.parlorReverbSend?.gain.setTargetAtTime(
      parlorAcousticsEnabled && parlorReverbEnabled ? PARLOR_REVERB_PER_LEVEL * parlorAcousticsLevel : 0.0001,
      now,
      0.025,
    );
    currentTransport.parlorCrackleGain?.gain.setTargetAtTime(
      parlorAcousticsEnabled && parlorCrackleEnabled ? PARLOR_CRACKLE_PER_LEVEL * parlorAcousticsLevel : 0.0001,
      now,
      0.025,
    );
  }
  updateAcousticsStatus();
});

elements.parlorAcousticsLevel?.addEventListener("input", (e) => {
  parlorAcousticsLevel = Number(e.target.value) / 100;
  if (elements.acousticsLevelVal) {
    elements.acousticsLevelVal.textContent = `${Math.round(parlorAcousticsLevel * 100)}%`;
  }
  if (audioContext && currentTransport) {
    const now = audioContext.currentTime;
    currentTransport.parlorReverbSend?.gain.setTargetAtTime(
      parlorAcousticsEnabled && parlorReverbEnabled ? PARLOR_REVERB_PER_LEVEL * parlorAcousticsLevel : 0.0001,
      now,
      0.025
    );
    currentTransport.parlorCrackleGain?.gain.setTargetAtTime(
      parlorAcousticsEnabled && parlorCrackleEnabled ? PARLOR_CRACKLE_PER_LEVEL * parlorAcousticsLevel : 0.0001,
      now,
      0.025
    );
  }
});

elements.chipCrackle?.addEventListener("click", () => {
  parlorCrackleEnabled = !parlorCrackleEnabled;
  if (audioContext && currentTransport) {
    const now = audioContext.currentTime;
    currentTransport.parlorCrackleGain?.gain.setTargetAtTime(
      parlorAcousticsEnabled && parlorCrackleEnabled ? PARLOR_CRACKLE_PER_LEVEL * parlorAcousticsLevel : 0.0001,
      now,
      0.025
    );
  }
  updateAcousticsStatus();
});

elements.chipReverb?.addEventListener("click", () => {
  parlorReverbEnabled = !parlorReverbEnabled;
  if (audioContext && currentTransport) {
    const now = audioContext.currentTime;
    currentTransport.parlorReverbSend?.gain.setTargetAtTime(
      parlorAcousticsEnabled && parlorReverbEnabled ? PARLOR_REVERB_PER_LEVEL * parlorAcousticsLevel : 0.0001,
      now,
      0.025
    );
  }
  updateAcousticsStatus();
});

elements.chipTick?.addEventListener("click", () => {
  parlorTickEnabled = !parlorTickEnabled;
  updateAcousticsStatus();
});

elements.kapellmeisterGenre?.addEventListener("change", (e) => {
  activeGenre = e.target.value;
  updateKapellmeisterUI();
  applyEnsembleConductor();
  updateBeatGrid();
  updateBassGrid();
  updateHarmonyGrid();
  updateChimeGrid();
  updateChantGrid();
  updateFunKeyboardChordLabels();
  updateArrangementDisplay(currentTransport?.audibleStep ?? null);
});

elements.kapellmeisterStrictness?.addEventListener("input", (e) => {
  activeStrictness = Number(e.target.value);
  if (elements.kapellmeisterStrictnessVal) {
    const flavor = activeStrictness <= 5 ? "Strict" : activeStrictness <= 9 ? "Balanced" : "Permissive";
    elements.kapellmeisterStrictnessVal.textContent = `G ≤ ${activeStrictness} (${flavor})`;
  }
  applyEnsembleConductor();
  updateBeatGrid();
  updateBassGrid();
  updateHarmonyGrid();
  updateChimeGrid();
  updateChantGrid();
});

function funStatusText() {
  return `ONE-FINGER ACCOMPANIST · ${STYLE_LABELS[funMachineStyle]}`;
}

function setFunStyle(style) {
  funMachineStyle = ACCOMPANIMENT_STYLES.includes(style) ? style : DEFAULT_ACCOMPANIMENT_STYLE;
  for (const chip of document.querySelectorAll(".fun-chip[data-style]")) {
    const active = chip.dataset.style === funMachineStyle;
    chip.classList.toggle("is-active", active);
    chip.setAttribute("aria-pressed", String(active));
  }
  if (elements.funMachineStatus) elements.funMachineStatus.textContent = funStatusText();
}

for (const chip of document.querySelectorAll(".fun-chip[data-style]")) {
  chip.addEventListener("click", () => {
    setFunStyle(chip.dataset.style);
    if (elements.funMachineTelemetry) {
      elements.funMachineTelemetry.textContent = `STYLE: ${STYLE_LABELS[funMachineStyle]} · HOLD A KEY AND THE BAND FOLLOWS`;
    }
    // A held key switches style on the spot.
    if (activeHeldFunKey !== null) {
      const held = activeHeldFunKey;
      activeHeldFunKey = null;
      triggerFunKey(held, true);
    }
  });
}

function setFunVoice(id) {
  funVoiceId = voiceById(id).id;
  for (const chip of document.querySelectorAll(".fun-chip[data-voice]")) {
    const active = chip.dataset.voice === funVoiceId;
    chip.classList.toggle("is-active", active);
    chip.setAttribute("aria-pressed", String(active));
  }
}

for (const chip of document.querySelectorAll(".fun-chip[data-voice]")) {
  chip.addEventListener("click", () => {
    setFunVoice(chip.dataset.voice);
    if (elements.funMachineTelemetry) {
      elements.funMachineTelemetry.textContent = `VOICE: ${currentFunVoice().label} · HOLD A KEY TO HEAR IT`;
    }
    // A held key changes voice on the spot, as it does for a style.
    if (activeHeldFunKey !== null) {
      const held = activeHeldFunKey;
      activeHeldFunKey = null;
      triggerFunKey(held, true);
    }
  });
}

if (elements.funKeyboard) {
  let lastPointerTriggerTime = 0;
  for (const keyBtn of elements.funKeyboard.querySelectorAll(".fun-key")) {
    const semitone = Number(keyBtn.dataset.semitone);
    keyBtn.addEventListener("pointerdown", () => {
      lastPointerTriggerTime = Date.now();
      triggerFunKey(semitone, true);
    });
    keyBtn.addEventListener("click", () => {
      if (Date.now() - lastPointerTriggerTime < 250) return;
      triggerFunKey(semitone, true);
    });
    keyBtn.addEventListener("pointerup", () => {
      triggerFunKey(semitone, false);
    });
    keyBtn.addEventListener("pointercancel", () => {
      triggerFunKey(semitone, false);
    });
    keyBtn.addEventListener("pointerleave", () => {
      triggerFunKey(semitone, false);
    });
  }
}

window.addEventListener("pointerup", () => {
  if (activeHeldFunKey !== null) {
    triggerFunKey(activeHeldFunKey, false);
  }
});

window.addEventListener("blur", () => {
  if (activeHeldFunKey !== null) {
    triggerFunKey(activeHeldFunKey, false);
  }
});

// The control most recently focused by a pointer press. Keyboard focus moves
// (Tab, scripted focus) clear it, so Space on that control is native again.
let pointerFocusedControl = null;
document.addEventListener("pointerdown", (event) => {
  pointerFocusedControl = event.target?.closest?.("button, summary, input, [role]") || null;
}, true);
document.addEventListener("focusin", (event) => {
  if (event.target !== pointerFocusedControl) pointerFocusedControl = null;
});

window.addEventListener("keydown", (event) => {
  const transportCommand = transportCommandForKey(event, { pointerFocused: pointerFocusedControl });
  if (transportCommand && currentScore) {
    event.preventDefault();
    if (!event.repeat) runTransportCommand(transportCommand);
    return;
  }
  if (
    event.target === elements.phrase ||
    event.target?.tagName === "INPUT" ||
    event.target?.tagName === "TEXTAREA" ||
    event.target?.isContentEditable
  ) {
    return;
  }
  if (event.ctrlKey || event.metaKey || event.altKey) return;
  if (event.repeat) return;
  const mapped = FUN_KEY_BY_CODE[event.code] || (event.key ? FUN_KEY_BY_KEY[event.key.toUpperCase()] : null);
  if (mapped) {
    event.preventDefault();
    triggerFunKey(mapped.semitone, true);
  }
});

window.addEventListener("keyup", (event) => {
  // Space activates a mouse-focused button on keyup; the transport already
  // consumed this press on keydown.
  if (currentScore && transportCommandForKey(event, { pointerFocused: pointerFocusedControl }) === "toggle") {
    event.preventDefault();
    return;
  }
  if (
    event.target === elements.phrase ||
    event.target?.tagName === "INPUT" ||
    event.target?.tagName === "TEXTAREA" ||
    event.target?.isContentEditable
  ) {
    return;
  }
  if (event.ctrlKey || event.metaKey || event.altKey) return;
  const mapped = FUN_KEY_BY_CODE[event.code] || (event.key ? FUN_KEY_BY_KEY[event.key.toUpperCase()] : null);
  if (mapped) {
    event.preventDefault();
    triggerFunKey(mapped.semitone, false);
  }
});


elements.form.addEventListener("submit", (event) => {
  event.preventDefault();
  summon(elements.phrase.value);
});

elements.surprise.addEventListener("click", () => {
  const next = SURPRISES[Math.floor(Math.random() * SURPRISES.length)];
  elements.phrase.value = next;
  summon(next);
});

elements.replay.addEventListener("click", () => {
  runTransportCommand("restart");
});

elements.transportPlay?.addEventListener("click", () => {
  runTransportCommand("play");
});

elements.transportPause?.addEventListener("click", () => {
  runTransportCommand("pause");
});

elements.transportStop?.addEventListener("click", () => {
  runTransportCommand("stop");
});

elements.shareLink?.addEventListener("click", () => {
  copyShareLink();
});

elements.exportPng?.addEventListener("click", () => {
  exportSpecimenPng();
});

elements.exportWav?.addEventListener("click", () => {
  exportSpecimenWav();
});

elements.exportStems?.addEventListener("click", () => {
  exportSpecimenStems();
});

elements.exportMidi?.addEventListener("click", () => {
  exportSpecimenMidi();
});

window.addEventListener("hashchange", () => {
  const hashPhrase = decodeOmenHash(window.location.hash);
  if (hashPhrase && (!currentScore || currentScore.phrase !== hashPhrase)) {
    elements.phrase.value = hashPhrase;
    summon(hashPhrase, { playAudio: Boolean(audioContext && !muted) });
  }
});

elements.sound.addEventListener("click", () => {
  muted = !muted;
  elements.sound.setAttribute("aria-pressed", String(muted));
  elements.sound.setAttribute("aria-label", muted ? "Enable sound" : "Mute sound");
  if (muted) {
    const resumeStep = stopCurrentSound();
    if (resumeStep !== null) {
      transportState = Object.freeze({ state: transportState.state, cursor: resumeStep });
    }
    elements.status.textContent = currentScore ? "OMEN MUTED" : "AWAITING INPUT";
  } else if (currentScore && transportState.state === TRANSPORT_STATES.PLAYING) {
    playScore(currentScore, { cursor: transportState.cursor });
  } else if (currentScore) {
    elements.status.textContent = transportState.state === TRANSPORT_STATES.PAUSED ? "OMEN PAUSED · BELL UNSEALED" : "BELL UNSEALED · PRESS PLAY";
  }
});

elements.volume.addEventListener("input", (event) => {
  setMasterVolume(event.currentTarget.value);
});

elements.tempo?.addEventListener("input", (event) => {
  setTempoBpm(event.currentTarget.value);
});

elements.tempo?.addEventListener("dblclick", () => {
  if (currentScore) {
    setTempoBpm(currentScore.pulse);
  }
});

try {
  const [oracleResponse, beatResponse, bassResponse, harmonyResponse, pietResponse, fractranResponse, chantResponse, conductorResponse, rulebooksResponse] = await Promise.all([
    fetch(sourceUrl("oracle.lol")),
    fetch(sourceUrl("beat.mal")),
    fetch(sourceUrl("bass.bf")),
    fetch(sourceUrl("harmony.bfg")),
    fetch(sourceUrl("pad.piet")),
    fetch(sourceUrl("chimes.frac")),
    fetch(sourceUrl("chant.spl")),
    fetch(sourceUrl("conductor.i")),
    fetch(sourceUrl("rulebooks.ni")),
  ]);
  if (!oracleResponse.ok) throw new Error(`Oracle source returned ${oracleResponse.status}`);
  if (!beatResponse.ok) throw new Error(`Malbolge source returned ${beatResponse.status}`);
  if (!bassResponse.ok) throw new Error(`Brainfuck source returned ${bassResponse.status}`);
  if (!harmonyResponse.ok) throw new Error(`Befunge source returned ${harmonyResponse.status}`);
  if (!pietResponse.ok) throw new Error(`Piet source returned ${pietResponse.status}`);
  if (!fractranResponse.ok) throw new Error(`FRACTRAN source returned ${fractranResponse.status}`);
  if (!chantResponse.ok) throw new Error(`Shakespeare source returned ${chantResponse.status}`);
  if (!conductorResponse.ok) throw new Error(`INTERCAL source returned ${conductorResponse.status}`);
  if (!rulebooksResponse.ok) throw new Error(`Inform 7 rulebooks returned ${rulebooksResponse.status}`);
  let rulebooksSource;
  [oracleSource, beatSource, bassSource, harmonySource, pietSource, fractranSource, chantSource, conductorSource, rulebooksSource] = await Promise.all([
    oracleResponse.text(),
    beatResponse.text(),
    bassResponse.text(),
    harmonyResponse.text(),
    pietResponse.text(),
    fractranResponse.text(),
    chantResponse.text(),
    conductorResponse.text(),
    rulebooksResponse.text(),
  ]);
  // The Kapellmeister's genres live in Inform 7 (D-033). Nothing that reads a
  // genre (the conductor, the Fun Machine, saved presets) runs before this.
  installRulebooks(compileRulebooks(rulebooksSource));
  activeGenre = genreCodes()[0];
  buildGenreMenu();
  updateKapellmeisterUI();
  updateFunKeyboardChordLabels();
  renderPresetList();
  syncSessionButtons();
  const initialHashPhrase = decodeOmenHash(window.location.hash);
  if (initialHashPhrase) {
    elements.phrase.value = initialHashPhrase;
    await summon(initialHashPhrase, { playAudio: false });
  } else {
    elements.status.textContent = "AWAITING INPUT";
  }
} catch (error) {
  const rulebookProblem = error?.name === "InformError" || String(error?.message).startsWith("Kapellmeister rulebooks");
  elements.status.textContent = rulebookProblem ? "KAPELLMEISTER RULEBOOKS REJECTED" : "SERVE THIS DIRECTORY OVER HTTP";
  console.error(error);
}
