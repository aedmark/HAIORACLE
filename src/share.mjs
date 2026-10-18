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

export function specimenFilenameFor(score) {
  const nameSlug = String(score?.name || "specimen")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48) || "specimen";
  const seedHex = ((score?.seed ?? 0) >>> 0).toString(16).padStart(8, "0");
  return `hai-oracle-${nameSlug}-${seedHex}.png`;
}
