const MAX_PHRASE_LENGTH = 72;

export function sanitizeSharePhrase(rawPhrase) {
  if (typeof rawPhrase !== "string") return "";
  return rawPhrase.trim().replace(/\s+/g, " ").slice(0, MAX_PHRASE_LENGTH);
}

export function encodeOmenHash(phrase) {
  const cleaned = sanitizeSharePhrase(phrase);
  if (!cleaned) {
    throw new Error("Cannot encode an empty omen phrase.");
  }
  return `#omen=${encodeURIComponent(cleaned)}`;
}

export function decodeOmenHash(hashString) {
  if (typeof hashString !== "string" || !hashString) return null;
  const raw = hashString.startsWith("#") ? hashString.slice(1) : hashString;
  if (!raw) return null;

  const params = new URLSearchParams(raw);
  const candidate = params.get("omen");
  if (!candidate) return null;

  const cleaned = sanitizeSharePhrase(candidate);
  return cleaned.length > 0 ? cleaned : null;
}

export function buildShareUrl(baseHref, phrase) {
  const hash = encodeOmenHash(phrase);
  const rawBase = typeof baseHref === "string" ? baseHref : "";
  const hashIndex = rawBase.indexOf("#");
  const cleanBase = hashIndex >= 0 ? rawBase.slice(0, hashIndex) : rawBase;
  return `${cleanBase}${hash}`;
}

export function specimenFilenameFor(score, extension = "png") {
  const nameSlug = String(score?.name || "specimen")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48) || "specimen";
  const seedHex = ((score?.seed ?? 0) >>> 0).toString(16).padStart(8, "0");
  const ext = String(extension).replace(/^\./, "").trim() || "png";
  return `hai-oracle-${nameSlug}-${seedHex}.${ext}`;
}

export function audioBufferToWavBlob(audioBuffer) {
  if (!audioBuffer) {
    throw new Error("Cannot encode a null or undefined audio buffer to WAV.");
  }
  const numChannels = Number(audioBuffer.numberOfChannels) || 1;
  const sampleRate = Number(audioBuffer.sampleRate) || 44100;
  const length = Number(audioBuffer.length) || 0;
  const bytesPerSample = 2; // 16-bit PCM
  const blockAlign = numChannels * bytesPerSample;
  const byteRate = sampleRate * blockAlign;
  const dataByteCount = length * blockAlign;
  const buffer = new ArrayBuffer(44 + dataByteCount);
  const view = new DataView(buffer);

  const writeString = (offset, string) => {
    for (let i = 0; i < string.length; i += 1) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  };

  // RIFF chunk descriptor
  writeString(0, "RIFF");
  view.setUint32(4, 36 + dataByteCount, true);
  writeString(8, "WAVE");

  // "fmt " sub-chunk
  writeString(12, "fmt ");
  view.setUint32(16, 16, true); // Subchunk1Size = 16 for PCM
  view.setUint16(20, 1, true);  // AudioFormat = 1 (PCM)
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, byteRate, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, 16, true); // BitsPerSample = 16

  // "data" sub-chunk
  writeString(36, "data");
  view.setUint32(40, dataByteCount, true);

  // Write interleaved PCM samples
  const channels = [];
  for (let c = 0; c < numChannels; c += 1) {
    channels.push(typeof audioBuffer.getChannelData === "function"
      ? audioBuffer.getChannelData(c)
      : new Float32Array(length));
  }

  let offset = 44;
  for (let i = 0; i < length; i += 1) {
    for (let c = 0; c < numChannels; c += 1) {
      const rawSample = channels[c][i] ?? 0;
      const clamped = Math.max(-1, Math.min(1, rawSample));
      const intSample = clamped < 0 ? clamped * 0x8000 : clamped * 0x7fff;
      view.setInt16(offset, intSample, true);
      offset += 2;
    }
  }

  return new Blob([buffer], { type: "audio/wav" });
}
