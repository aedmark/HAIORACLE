import { encodeOmenHash } from "./share.mjs";
import { MELODY_NAMES } from "./music.mjs";
import { WAVEFORMS } from "./score.mjs";
import { BEAT_NAMES } from "./malbolge.mjs";
import { BASS_NAMES } from "./brainfuck.mjs";
import { HARMONY_NAMES } from "./befunge.mjs";
import { CHIME_NAMES } from "./fractran.mjs";
import { CHANT_NAMES } from "./shakespeare.mjs";

export function wrapCanvasText(ctx, text, maxWidth) {
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

export function renderSpecimenBroadsheetCanvas(score, {
  doc = globalThis.document,
  sourceCanvas = null,
  currentBeat = null,
  currentBass = null,
  currentHarmony = null,
  currentChimes = null,
  currentChant = null,
} = {}) {
  const width = 1200;
  const height = 1520;
  const plate = doc.createElement("canvas");
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
  pctx.fillText("THE WHIMSY MACHINE — SPECIMEN BROADSHEET", width * 0.5, 146);

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

  if (sourceCanvas && sourceCanvas.width > 0 && sourceCanvas.height > 0) {
    const scale = Math.min(vitrineW / sourceCanvas.width, vitrineH / sourceCanvas.height);
    const drawW = sourceCanvas.width * scale;
    const drawH = sourceCanvas.height * scale;
    const drawX = vitrineX + (vitrineW - drawW) * 0.5;
    const drawY = vitrineY + (vitrineH - drawH) * 0.5;
    pctx.drawImage(sourceCanvas, drawX, drawY, drawW, drawH);
  }

  pctx.fillStyle = "#dab56b";
  pctx.font = '700 13px "Courier New", Courier, monospace';
  pctx.textAlign = "left";
  pctx.fillText("PLATE I · LIVE SPECIMEN CAPTURE", vitrineX + 22, vitrineY + 30);
  pctx.textAlign = "right";
  pctx.fillText(`${score.bellJar ?? "BELL JAR Nº 01"} · ${score.shapeName}`, vitrineX + vitrineW - 22, vitrineY + 30);

  const bannerY = 788;
  pctx.fillStyle = "#16110e";
  pctx.fillRect(96, bannerY, width - 192, 232);
  pctx.strokeStyle = "#b89249";
  pctx.lineWidth = 2;
  pctx.strokeRect(96, bannerY, width - 192, 232);

  pctx.textAlign = "center";
  pctx.fillStyle = "#dab56b";
  pctx.font = '700 12px "Courier New", Courier, monospace';
  pctx.fillText(`${score.folioId ?? "FOLIO I-0000"} · ${score.curiosaClass ?? "CLASS I"}`, width * 0.5, bannerY + 25);
  pctx.fillStyle = "#b89249";
  pctx.font = '700 11px "Courier New", Courier, monospace';
  pctx.fillText("CATALOGUED MANIFESTATION", width * 0.5, bannerY + 43);

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
    `SHARE SEAL: ${encodeOmenHash(score.phrase)} · THE WHIMSY MACHINE · ZERO-DEPENDENCY`,
    width * 0.5,
    height - 74,
  );

  return plate;
}
