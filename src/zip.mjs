// Minimal ZIP writer for stem bundles. Entries are STORED (no compression):
// PCM audio barely deflates, and skipping DEFLATE keeps this dependency-free
// and small. Every entry carries the DOS epoch (1980-01-01 00:00) so the same
// files always produce byte-identical archives.

const CRC_TABLE = (() => {
  const table = new Uint32Array(256);
  for (let n = 0; n < 256; n += 1) {
    let c = n;
    for (let k = 0; k < 8; k += 1) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    table[n] = c >>> 0;
  }
  return table;
})();

export function crc32(bytes) {
  let crc = 0xffffffff;
  for (let i = 0; i < bytes.length; i += 1) crc = CRC_TABLE[(crc ^ bytes[i]) & 0xff] ^ (crc >>> 8);
  return (crc ^ 0xffffffff) >>> 0;
}

const DOS_TIME = 0;
const DOS_DATE = (0 << 9) | (1 << 5) | 1; // 1980-01-01
const UTF8_FLAG = 0x0800;
const textEncoder = new TextEncoder();

function assertEntryName(name) {
  if (typeof name !== "string" || !name || name.startsWith("/") || name.includes("\\") || name.split("/").includes("..")) {
    throw new RangeError(`Unsafe ZIP entry name: ${name}`);
  }
}

/**
 * Builds a ZIP archive from `[{ name, data }]`, where `data` is a Uint8Array or
 * a string (encoded as UTF-8). Returns the archive as one Uint8Array.
 */
export function createStoredZip(entries) {
  const prepared = entries.map(({ name, data }) => {
    assertEntryName(name);
    const bytes = typeof data === "string" ? textEncoder.encode(data) : data;
    if (!(bytes instanceof Uint8Array)) throw new TypeError(`ZIP entry ${name} must be bytes or text`);
    if (bytes.length > 0xfffffffe) throw new RangeError(`ZIP entry ${name} needs ZIP64`);
    return { nameBytes: textEncoder.encode(name), bytes, crc: crc32(bytes) };
  });
  if (prepared.length > 0xffff) throw new RangeError("Too many ZIP entries");

  const localSize = prepared.reduce((sum, e) => sum + 30 + e.nameBytes.length + e.bytes.length, 0);
  const centralSize = prepared.reduce((sum, e) => sum + 46 + e.nameBytes.length, 0);
  const out = new Uint8Array(localSize + centralSize + 22);
  const view = new DataView(out.buffer);
  let offset = 0;
  const localOffsets = [];

  for (const entry of prepared) {
    localOffsets.push(offset);
    view.setUint32(offset, 0x04034b50, true);
    view.setUint16(offset + 4, 20, true); // version needed: 2.0
    view.setUint16(offset + 6, UTF8_FLAG, true);
    view.setUint16(offset + 8, 0, true); // method: stored
    view.setUint16(offset + 10, DOS_TIME, true);
    view.setUint16(offset + 12, DOS_DATE, true);
    view.setUint32(offset + 14, entry.crc, true);
    view.setUint32(offset + 18, entry.bytes.length, true);
    view.setUint32(offset + 22, entry.bytes.length, true);
    view.setUint16(offset + 26, entry.nameBytes.length, true);
    view.setUint16(offset + 28, 0, true);
    out.set(entry.nameBytes, offset + 30);
    out.set(entry.bytes, offset + 30 + entry.nameBytes.length);
    offset += 30 + entry.nameBytes.length + entry.bytes.length;
  }

  const centralStart = offset;
  prepared.forEach((entry, index) => {
    view.setUint32(offset, 0x02014b50, true);
    view.setUint16(offset + 4, 20, true); // version made by
    view.setUint16(offset + 6, 20, true); // version needed
    view.setUint16(offset + 8, UTF8_FLAG, true);
    view.setUint16(offset + 10, 0, true);
    view.setUint16(offset + 12, DOS_TIME, true);
    view.setUint16(offset + 14, DOS_DATE, true);
    view.setUint32(offset + 16, entry.crc, true);
    view.setUint32(offset + 20, entry.bytes.length, true);
    view.setUint32(offset + 24, entry.bytes.length, true);
    view.setUint16(offset + 28, entry.nameBytes.length, true);
    view.setUint16(offset + 30, 0, true); // extra length
    view.setUint16(offset + 32, 0, true); // comment length
    view.setUint16(offset + 34, 0, true); // disk number
    view.setUint16(offset + 36, 0, true); // internal attributes
    view.setUint32(offset + 38, 0, true); // external attributes
    view.setUint32(offset + 42, localOffsets[index], true);
    out.set(entry.nameBytes, offset + 46);
    offset += 46 + entry.nameBytes.length;
  });

  view.setUint32(offset, 0x06054b50, true);
  view.setUint16(offset + 4, 0, true);
  view.setUint16(offset + 6, 0, true);
  view.setUint16(offset + 8, prepared.length, true);
  view.setUint16(offset + 10, prepared.length, true);
  view.setUint32(offset + 12, offset - centralStart, true);
  view.setUint32(offset + 16, centralStart, true);
  view.setUint16(offset + 20, 0, true);
  return out;
}
