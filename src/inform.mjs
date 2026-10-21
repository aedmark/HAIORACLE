// A purpose-built interpreter for the strict subset of Inform 7 that writes
// the Kapellmeister's genre rulebooks (src/rulebooks.ni, D-033). It reads
// kinds, values, properties, either/or adjectives, instances, globals,
// tables, and value-producing rulebooks, and nothing else: no world model,
// actions, parser, phrases, or turn loop. `compileRulebooks()` then evaluates
// every rulebook over its whole input domain and returns frozen, validated
// plain data, so the conductor never sees Inform text.
//
// Departures from real Inform 7: rules fire in source order (first match
// wins) instead of by specificity, and a changes table may count its rows by
// "region" (three steps each) or "step".

export class InformError extends Error {
  constructor(line, message) {
    super(`Inform 7 line ${line}: ${message}`);
    this.name = "InformError";
    this.line = line;
  }
}

const OUT_OF_SUBSET = /^(instead of|before|after|check|carry out|report|every turn|when play begins|when play ends|understand|to decide|to say|to |if |let |say |now |try |definition:|include |release along|use )/i;

// ---------------------------------------------------------------------------
// Source text: comments, paragraphs, sentences.

// Square brackets outside quotes are comments (they nest); inside quotes
// they are text substitutions and are kept. Newlines survive so offsets
// still map to source lines.
function stripComments(source) {
  let out = "";
  let depth = 0;
  let inQuote = false;
  let line = 1;
  let openedAt = 0;
  for (const ch of source) {
    if (ch === "\n") line += 1;
    if (depth === 0 && ch === '"') inQuote = !inQuote;
    if (!inQuote && ch === "[") {
      if (depth === 0) openedAt = line;
      depth += 1;
      out += " ";
      continue;
    }
    if (!inQuote && ch === "]" && depth > 0) {
      depth -= 1;
      out += " ";
      continue;
    }
    out += depth > 0 && ch !== "\n" ? " " : ch;
  }
  if (depth > 0) throw new InformError(openedAt, "this comment is never closed with ']'");
  if (inQuote) throw new InformError(line, "a quoted text is never closed");
  return out;
}

function paragraphsOf(text) {
  const lines = text.split("\n");
  const paragraphs = [];
  let current = null;
  lines.forEach((raw, index) => {
    const lineText = raw.replace(/\s+$/, "");
    if (lineText.trim() === "") {
      current = null;
      return;
    }
    if (!current) {
      current = { line: index + 1, lines: [] };
      paragraphs.push(current);
    }
    current.lines.push({ line: index + 1, text: lineText });
  });
  return paragraphs;
}

// Sentences end at a full stop outside quotes and braces (not a decimal
// point), or, as in Inform 7, at a closing quote whose text ends in . ! or ?.
function sentencesOf(paragraph) {
  const sentences = [];
  let buffer = "";
  let startLine = null;
  let inQuote = false;
  let braces = 0;
  const flush = (line) => {
    const text = buffer.replace(/\s+/g, " ").trim();
    if (text) sentences.push({ line: startLine ?? line, text });
    buffer = "";
    startLine = null;
  };
  paragraph.lines.forEach(({ line, text }, lineIndex) => {
    const chars = [...text];
    chars.forEach((ch, i) => {
      if (startLine === null && ch.trim() !== "") startLine = line;
      const next = chars[i + 1];
      if (ch === '"') {
        inQuote = !inQuote;
        buffer += ch;
        const prev = chars[i - 1];
        if (!inQuote && braces === 0 && /[.!?]/.test(prev ?? "") && (next === undefined || /\s/.test(next))) flush(line);
        return;
      }
      if (!inQuote) {
        if (ch === "{") braces += 1;
        if (ch === "}") braces = Math.max(0, braces - 1);
        if (ch === "." && braces === 0 && !/\d/.test(next ?? "")) {
          flush(line);
          return;
        }
      }
      buffer += ch;
    });
    if (lineIndex < paragraph.lines.length - 1) buffer += " ";
  });
  if (buffer.trim()) {
    throw new InformError(startLine ?? paragraph.line, `this sentence never ends with a full stop: "${buffer.trim().slice(0, 60)}"`);
  }
  return sentences;
}

// ---------------------------------------------------------------------------
// Names and kinds.

const key = (name) => name.trim().replace(/\s+/g, " ").toLowerCase();

function pluralOf(name) {
  const words = name.trim().split(/\s+/);
  const last = words.pop();
  let plural;
  if (/[^aeiou]y$/i.test(last)) plural = `${last.slice(0, -1)}ies`;
  else if (/(s|x|z|ch|sh)$/i.test(last)) plural = `${last}es`;
  else plural = `${last}s`;
  return [...words, plural].join(" ");
}

const BUILTIN_TYPES = new Set(["number", "text", "table name"]);

function splitList(text) {
  // "a, b, c and d" → [a, b, c, d]
  return text.split(/\s*,\s*|\s+and\s+/i).map((part) => part.trim()).filter(Boolean);
}

function splitBraces(inner) {
  const items = [];
  let depth = 0;
  let inQuote = false;
  let current = "";
  for (const ch of inner) {
    if (ch === '"') inQuote = !inQuote;
    if (!inQuote && ch === "{") depth += 1;
    if (!inQuote && ch === "}") depth -= 1;
    if (!inQuote && depth === 0 && ch === ",") {
      items.push(current.trim());
      current = "";
    } else {
      current += ch;
    }
  }
  if (current.trim()) items.push(current.trim());
  return items;
}

class Story {
  constructor() {
    this.title = null;
    this.author = null;
    this.kinds = new Map();
    this.plurals = new Map();
    this.values = new Map();
    this.objects = new Map();
    this.objectOrder = [];
    this.tables = new Map();
    this.globals = new Map();
    this.rulebooks = new Map();
    this.pending = [];
  }

  defineKind(name, base, line) {
    const k = key(name);
    if (this.kinds.has(k) || BUILTIN_TYPES.has(k)) throw new InformError(line, `the kind "${name}" already exists`);
    const kind = { name: name.trim(), base, values: [], properties: new Map(), adjectives: new Map(), defaults: new Map() };
    this.kinds.set(k, kind);
    this.plurals.set(key(pluralOf(name)), k);
    return kind;
  }

  kind(name, line) {
    const k = key(name);
    const kind = this.kinds.get(k) || this.kinds.get(this.plurals.get(k));
    if (!kind) throw new InformError(line, `there is no kind called "${name}"`);
    return kind;
  }

  type(text, line) {
    const t = key(text).replace(/^(an?|some) /, "");
    if (t === "number" || t === "text" || t === "table name") return { base: t };
    const list = t.match(/^list of (.+)$/);
    if (list) {
      const inner = list[1] === "numbers" ? { base: "number" } : list[1] === "texts" ? { base: "text" } : { base: "value", kind: this.kind(list[1], line) };
      if (inner.kind && inner.kind.base !== "value") throw new InformError(line, `lists may only hold numbers, texts, or values, not ${list[1]}`);
      return { base: "list", of: inner };
    }
    const kind = this.kind(t, line);
    if (kind.base !== "value") throw new InformError(line, `properties may not hold a ${kind.name}`);
    return { base: "value", kind };
  }

  owner(name, line) {
    const k = key(name);
    if (this.objects.has(k)) return this.objects.get(k);
    if (this.values.has(k)) return this.values.get(k);
    throw new InformError(line, `there is no thing or value called "${name}"`);
  }

  property(owner, name, line) {
    const kind = owner.kind;
    const property = kind.properties.get(key(name));
    if (!property) throw new InformError(line, `a ${kind.name} has no property called "${name}"`);
    return property;
  }

  // Values whose meaning depends on things declared later (tables, mostly)
  // are parsed when the whole source has been read.
  defer(line, fn) {
    this.pending.push({ line, fn });
  }

  literal(text, type, line) {
    const raw = text.trim();
    const t = type.base;
    if (t === "number") {
      if (!/^-?\d+$/.test(raw)) throw new InformError(line, `expected a number, found "${raw}"`);
      return Number.parseInt(raw, 10);
    }
    if (t === "text") {
      const quoted = raw.match(/^"([^"]*)"$/);
      if (!quoted) throw new InformError(line, `expected a quoted text, found ${raw}`);
      return quoted[1];
    }
    if (t === "table name") {
      const name = raw.replace(/^the\s+/i, "");
      const table = this.tables.get(key(name));
      if (!/^table of /i.test(name) || !table) throw new InformError(line, `there is no table called "${name}"`);
      return Object.freeze({ table: table.name });
    }
    if (t === "list") {
      const braces = raw.match(/^\{(.*)\}$/);
      if (!braces) throw new InformError(line, `expected a list in braces, found "${raw}"`);
      return Object.freeze(splitBraces(braces[1]).map((item) => this.literal(item, type.of, line)));
    }
    if (t === "value") {
      const value = this.values.get(key(raw));
      if (!value || value.kind !== type.kind) throw new InformError(line, `"${raw}" is not a ${type.kind.name}`);
      return value.name;
    }
    throw new InformError(line, `cannot read "${raw}"`);
  }

  // Table entries carry no declared kind; like Inform, a column's kind comes
  // from its entries, and every entry in a column must agree.
  inferredLiteral(text, line) {
    const raw = text.trim();
    if (/^-?\d+$/.test(raw)) return { type: "number", value: Number.parseInt(raw, 10) };
    if (/^"[^"]*"$/.test(raw)) return { type: "text", value: raw.slice(1, -1) };
    if (/^\{.*\}$/.test(raw)) {
      const items = splitBraces(raw.slice(1, -1)).map((item) => this.inferredLiteral(item, line));
      const inner = [...new Set(items.map((item) => item.type))];
      if (inner.length > 1) throw new InformError(line, `the list ${raw} mixes ${inner.join(" and ")}`);
      return { type: `list of ${inner[0] ?? "anything"}`, value: Object.freeze(items.map((item) => item.value)) };
    }
    if (/^(the\s+)?table of /i.test(raw)) return { type: "table name", value: this.literal(raw, { base: "table name" }, line) };
    const value = this.values.get(key(raw));
    if (value) return { type: value.kind.name, value: value.name };
    throw new InformError(line, `cannot understand the table entry "${raw}"`);
  }
}

// ---------------------------------------------------------------------------
// Sentences.

function readTable(story, paragraph) {
  const [header, columnsLine, ...rows] = paragraph.lines;
  const continued = /\s+\(continued\)$/i.test(header.text.trim());
  const name = header.text.trim().replace(/\s+\(continued\)$/i, "");
  if (!columnsLine) throw new InformError(header.line, `${name} has no column headings`);
  const columns = columnsLine.text.split("\t").map((column) => key(column));
  if (columns.some((column) => !/^[a-z][a-z ]*$/.test(column))) {
    throw new InformError(columnsLine.line, `${name} has a blank or unreadable column heading (columns are separated by tabs)`);
  }
  let table = story.tables.get(key(name));
  if (continued) {
    if (!table) throw new InformError(header.line, `${name} is continued before it is defined`);
    if (table.columns.join("\t") !== columns.join("\t")) throw new InformError(columnsLine.line, `${name} (continued) must repeat the same columns`);
  } else {
    if (table) throw new InformError(header.line, `${name} is defined twice`);
    table = { name, line: header.line, columns, rawRows: [] };
    story.tables.set(key(name), table);
  }
  for (const row of rows) {
    const cells = row.text.split("\t").map((cell) => cell.trim());
    if (cells.length > columns.length) throw new InformError(row.line, `${name} has ${columns.length} columns but this row has ${cells.length} entries`);
    while (cells.length < columns.length) cells.push("--");
    table.rawRows.push({ line: row.line, cells });
  }
}

function resolveTables(story) {
  for (const table of story.tables.values()) {
    const kinds = table.columns.map(() => null);
    table.rows = Object.freeze(table.rawRows.map(({ line, cells }) => Object.freeze(Object.fromEntries(cells.map((cell, c) => {
      if (cell === "--") return [table.columns[c], null];
      const { type, value } = story.inferredLiteral(cell, line);
      // An empty list {} fits any list column.
      const fits = !kinds[c] || kinds[c] === type
        || (type === "list of anything" && kinds[c].startsWith("list of"))
        || (kinds[c] === "list of anything" && type.startsWith("list of"));
      if (!fits) throw new InformError(line, `the ${table.columns[c]} column of ${table.name} mixes ${kinds[c]} and ${type}`);
      if (!kinds[c] || kinds[c] === "list of anything") kinds[c] = type;
      return [table.columns[c], value];
    })))));
  }
}

function parseCondition(story, text, line) {
  return text.split(/\s+and\s+/i).map((clause) => {
    const match = clause.match(/^(?:the\s+)?(.+?)\s+is\s+(not\s+)?(at most\s+|at least\s+|listed in\s+)?(.+)$/i);
    if (!match) throw new InformError(line, `cannot understand the condition "${clause}"`);
    const [, globalName, negated, comparison, operand] = match;
    const global = story.globals.get(key(globalName));
    if (!global) throw new InformError(line, `"${globalName}" is not a value that varies`);
    const op = key(comparison || "is");
    const expected = op === "listed in" ? { base: "list", of: global.type } : global.type;
    if ((op === "at most" || op === "at least") && global.type.base !== "number") throw new InformError(line, `only numbers can be at most or at least something`);
    const value = story.literal(operand, expected, line);
    return Object.freeze({ global: global.name, op, negated: Boolean(negated), value });
  });
}

function readSentence(story, { line, text }) {
  if (OUT_OF_SUBSET.test(text)) {
    throw new InformError(line, `"${text.slice(0, 50)}" uses phrases, actions, or the world model, which the Kapellmeister subset does not support`);
  }

  // Rules: "<Rulebook> rule for <thing> [when <condition>]: rule succeeds with result <value>."
  const colon = text.indexOf(":");
  if (colon > 0 && / rule for /i.test(text.slice(0, colon))) {
    const header = text.slice(0, colon).trim();
    const body = text.slice(colon + 1).trim();
    const match = header.match(/^(.+?) rule for (.+?)(?: when (.+))?$/i);
    const rulebook = match && story.rulebooks.get(key(match[1]));
    if (!rulebook) throw new InformError(line, `there is no rulebook called "${match ? match[1] : header}"`);
    const subject = story.objects.get(key(match[2]));
    if (!subject || subject.kind !== rulebook.basis) throw new InformError(line, `"${match[2]}" is not a ${rulebook.basis.name}`);
    const result = body.match(/^rule succeeds with result (.+)$/i);
    if (!result) throw new InformError(line, `a rule may only say "rule succeeds with result ..." in the Kapellmeister subset`);
    const rule = { line, subject: subject.name, conditions: match[3] ? null : Object.freeze([]), value: undefined };
    rulebook.rules.push(rule);
    story.defer(line, () => {
      rule.value = story.literal(result[1], rulebook.produces, line);
      if (match[3]) rule.conditions = parseCondition(story, match[3], line);
      Object.freeze(rule);
    });
    return;
  }

  let m;
  if ((m = text.match(/^(?:an? )?(.+?) is a kind of (thing|value)$/i))) {
    story.defineKind(m[1], key(m[2]), line);
    return;
  }
  if ((m = text.match(/^the (.+?) (?:are|is) an? (.+?) based rulebook producing (?:an? )?(.+)$/i))) {
    const name = key(m[1]).replace(/ rules?$/, "");
    if (story.rulebooks.has(name)) throw new InformError(line, `the ${m[1]} already exist`);
    story.rulebooks.set(name, { name, basis: story.kind(m[2], line), produces: story.type(m[3], line), rules: [] });
    return;
  }
  if ((m = text.match(/^the (.+?) is an? (.+?) that varies$/i))) {
    const type = story.type(m[2], line);
    story.globals.set(key(m[1]), { name: key(m[1]), type });
    return;
  }
  if ((m = text.match(/^the (.+?) are (.+)$/i)) && story.plurals.has(key(m[1]))) {
    const kind = story.kind(m[1], line);
    if (kind.base !== "value" || kind.values.length) throw new InformError(line, `the values of ${kind.name} are already set`);
    for (const value of splitList(m[2])) {
      if (story.values.has(key(value)) || story.objects.has(key(value))) throw new InformError(line, `"${value}" already means something else`);
      const entry = { name: value, kind, props: new Map() };
      kind.values.push(value);
      story.values.set(key(value), entry);
    }
    return;
  }
  if ((m = text.match(/^the (.+?) of (.+?) (?:is|are) (.+)$/i))) {
    const owner = story.owner(m[2], line);
    const property = story.property(owner, m[1], line);
    if (owner.props.has(property.name)) throw new InformError(line, `the ${property.name} of ${owner.name} is already set`);
    owner.props.set(property.name, null);
    story.defer(line, () => owner.props.set(property.name, story.literal(m[3], property.type, line)));
    return;
  }
  if ((m = text.match(/^(?:an? )?(.+?) has (?:an?|some) (.+?)(?: called (?:the )?(.+))?$/i))) {
    const kind = story.kind(m[1], line);
    const type = story.type(m[2], line);
    const name = key(m[3] ?? m[2].replace(/^(an?|some) /i, ""));
    if (kind.properties.has(name)) throw new InformError(line, `a ${kind.name} already has a ${name}`);
    kind.properties.set(name, { name, type });
    return;
  }
  if ((m = text.match(/^(?:an? )?(.+?) can be (\S+) or (\S+)$/i))) {
    const kind = story.kind(m[1], line);
    const [a, b] = [key(m[2]), key(m[3])];
    const pair = { first: a, second: b, default: a };
    kind.adjectives.set(a, pair);
    kind.adjectives.set(b, pair);
    return;
  }
  if ((m = text.match(/^(?:an? )?(.+?) is usually (\S+)$/i)) && (story.kinds.has(key(m[1])))) {
    const kind = story.kind(m[1], line);
    const pair = kind.adjectives.get(key(m[2]));
    if (!pair) throw new InformError(line, `a ${kind.name} cannot be ${m[2]}`);
    pair.default = key(m[2]);
    return;
  }
  if ((m = text.match(/^(.+?) is (?:(an?) )?(.+)$/i))) {
    const words = m[3].split(/\s+/);
    const existing = story.objects.get(key(m[1]));
    if (!m[2] && existing) {
      // "Delta Blues is insistent."
      for (const word of words) setAdjective(existing, word, line);
      return;
    }
    if (m[2]) {
      for (let cut = 0; cut < words.length; cut += 1) {
        const kindName = words.slice(cut).join(" ");
        const kind = story.kinds.get(key(kindName));
        if (kind && kind.base === "thing") {
          if (story.objects.has(key(m[1])) || story.values.has(key(m[1]))) throw new InformError(line, `"${m[1]}" already exists`);
          const object = { name: m[1].trim(), kind, props: new Map(), adjectives: new Map(), line };
          story.objects.set(key(m[1]), object);
          story.objectOrder.push(object);
          for (const word of words.slice(0, cut)) setAdjective(object, word, line);
          return;
        }
      }
    }
  }
  throw new InformError(line, `I can't find a verb that I know how to deal with in "${text.slice(0, 70)}"`);
}

function setAdjective(object, word, line) {
  const pair = object.kind.adjectives.get(key(word));
  if (!pair) throw new InformError(line, `a ${object.kind.name} cannot be ${word}`);
  object.adjectives.set(pair.first, key(word));
}

/**
 * Reads Inform 7 subset source into a story: kinds, values, things with
 * properties and adjectives, globals, tables, and rulebooks. Throws
 * InformError (with a line number) on anything outside the subset.
 */
export function readStory(source) {
  const story = new Story();
  const text = stripComments(String(source ?? ""));
  paragraphsOf(text).forEach((paragraph, index) => {
    const first = paragraph.lines[0].text.trim();
    // The bibliographic sentence opens the source and, as in Inform, needs no full stop.
    const bibliographic = index === 0 && paragraph.lines.length === 1 && first.match(/^"([^"]+)" by (.+?)\.?$/);
    if (bibliographic) {
      story.title = bibliographic[1];
      story.author = bibliographic[2].trim();
      return;
    }
    if (paragraph.lines.length === 1 && /^(volume|book|part|chapter|section) \S+( - .+)?$/i.test(first)) return;
    if (/^table of /i.test(first)) {
      readTable(story, paragraph);
      return;
    }
    for (const sentence of sentencesOf(paragraph)) readSentence(story, sentence);
  });
  resolveTables(story);
  for (const { fn } of story.pending) fn();
  story.pending = [];
  return story;
}

export function propertyOf(owner, name) {
  const k = key(name);
  if (owner.props.has(k)) return owner.props.get(k);
  const property = owner.kind.properties.get(k);
  if (!property) throw new Error(`a ${owner.kind.name} has no property called "${name}"`);
  const t = property.type;
  if (t.base === "number") return 0;
  if (t.base === "text") return "";
  if (t.base === "list") return Object.freeze([]);
  if (t.base === "value") return t.kind.values[0];
  return null;
}

export function adjectiveOf(object, either) {
  const pair = object.kind.adjectives.get(key(either));
  if (!pair) throw new Error(`a ${object.kind.name} cannot be ${either}`);
  return object.adjectives.get(pair.first) ?? pair.default;
}

function holds(condition, globals) {
  const actual = globals[condition.global];
  if (actual === undefined) throw new Error(`the conductor did not set "${condition.global}"`);
  let result;
  if (condition.op === "at most") result = actual <= condition.value;
  else if (condition.op === "at least") result = actual >= condition.value;
  else if (condition.op === "listed in") result = condition.value.includes(actual);
  else result = actual === condition.value;
  return condition.negated ? !result : result;
}

/** Runs a rulebook for one thing: the first rule (in source order) whose conditions hold decides. */
export function followRulebook(story, rulebookName, subject, globals = {}) {
  const rulebook = story.rulebooks.get(key(rulebookName));
  if (!rulebook) throw new Error(`there is no rulebook called "${rulebookName}"`);
  for (const rule of rulebook.rules) {
    if (key(rule.subject) === key(subject.name) && rule.conditions.every((condition) => holds(condition, globals))) return rule.value;
  }
  return undefined;
}

// ---------------------------------------------------------------------------
// The Kapellmeister schema.

export const INTERVALS = Object.freeze(Array.from({ length: 12 }, (_, i) => i));
export const STRICTNESS_RANGE = Object.freeze([1, 14]);
const code = (valueName) => valueName.replace(/ /g, "_").toLowerCase();

function fail(where, message) {
  throw new RangeError(`Kapellmeister rulebooks: ${where}: ${message}`);
}

function isPitchClass(n) {
  return Number.isInteger(n) && n >= 0 && n < 12;
}

function tableFor(story, ref, where) {
  if (!ref) fail(where, "no table given");
  return story.tables.get(key(ref.table));
}

function requireColumns(table, columns, where) {
  for (const column of columns) if (!table.columns.includes(column)) fail(where, `${table.name} needs a "${column}" column`);
}

function readChanges(story, genre, ref) {
  const where = `${genre.name} changes`;
  const table = tableFor(story, ref, where);
  requireColumns(table, ["degree", "quality", "label", "tones"], where);
  const byRegion = table.columns.includes("region");
  if (byRegion === table.columns.includes("step")) fail(where, `${table.name} must count its rows by "region" or by "step"`);
  const expected = byRegion ? 4 : 12;
  if (table.rows.length !== expected) fail(where, `${table.name} needs ${expected} rows, found ${table.rows.length}`);
  const rows = table.rows.map((row, i) => {
    if (row[byRegion ? "region" : "step"] !== i + 1) fail(where, `${table.name} row ${i + 1} is out of order`);
    if (!isPitchClass(row.degree)) fail(where, `degree ${row.degree} is not 0..11`);
    if (!row.label) fail(where, `row ${i + 1} has no label`);
    if (!Array.isArray(row.tones) || !row.tones.length || !row.tones.every(isPitchClass)) fail(where, `row ${i + 1} tones must be pitch classes`);
    return Object.freeze({ degree: row.degree, quality: code(row.quality), label: row.label, tones: Object.freeze([...row.tones]) });
  });
  return Object.freeze(byRegion ? rows.flatMap((row) => [row, row, row]) : rows);
}

function readWalks(story, genre, ref) {
  const where = `${genre.name} Tonnetz walks`;
  const table = tableFor(story, ref, where);
  requireColumns(table, ["moves"], where);
  if (!table.rows.length) fail(where, `${table.name} is empty`);
  return Object.freeze(table.rows.map((row, i) => {
    if (!Array.isArray(row.moves) || !row.moves.length) fail(where, `row ${i + 1} needs a list of Tonnetz moves`);
    return Object.freeze([...row.moves]);
  }));
}

function readProgression(story, ref, where) {
  const table = tableFor(story, ref, where);
  requireColumns(table, ["degree", "quality", "melody", "shown"], where);
  if (table.rows.length !== 4) fail(where, `${table.name} needs 4 rows, one per region`);
  return Object.freeze(table.rows.map((row, i) => {
    if (!isPitchClass(row.degree)) fail(where, `${table.name} row ${i + 1} degree is not 0..11`);
    if (!Array.isArray(row.melody) || row.melody.length !== 3 || !row.melody.every(Number.isInteger)) fail(where, `${table.name} row ${i + 1} needs three melody notes`);
    if (typeof row.shown !== "string" || /\[(?!root\])/.test(row.shown)) fail(where, `${table.name} row ${i + 1} may only substitute [root]`);
    return Object.freeze({ degree: row.degree, quality: code(row.quality), melody: Object.freeze([...row.melody]), shown: row.shown });
  }));
}

function readOvertones(story, genre, ref) {
  const where = `${genre.name} overtones`;
  const table = tableFor(story, ref, where);
  requireColumns(table, ["ratio"], where);
  if (!table.rows.length) fail(where, `${table.name} is empty`);
  return Object.freeze(table.rows.map((row) => {
    const ratio = typeof row.ratio === "string" && row.ratio.match(/^(\d+)\/(\d+)$/);
    if (!ratio || Number(ratio[2]) === 0) fail(where, `"${row.ratio}" is not a ratio like "3/2"`);
    return Object.freeze({ ratio: row.ratio, value: Number(ratio[1]) / Number(ratio[2]) });
  }));
}

/**
 * Compiles src/rulebooks.ni into the conductor's genre data. Every rulebook
 * is followed over its whole domain here (twelve intervals above the tonic,
 * every strictness), so playing never runs Inform. Returns
 * `{ title, author, genres, byCode, progressions, qualityProgressions }`.
 */
export function compileRulebooks(source) {
  const story = readStory(source);
  const genreKind = story.kinds.get("genre");
  if (!genreKind) fail("source", 'there is no kind called "genre"');
  const qualityKind = story.kinds.get("chord quality");
  if (!qualityKind) fail("source", 'there is no kind called "chord quality"');

  const progressions = {};
  const progressionId = (ref, where) => {
    const id = ref?.table;
    if (!id) fail(where, "no progression table given");
    if (!progressions[id]) progressions[id] = readProgression(story, ref, where);
    return id;
  };

  const qualityProgressions = Object.freeze(Object.fromEntries(qualityKind.values.map((name) => {
    const quality = story.values.get(key(name));
    return [code(name), progressionId(propertyOf(quality, "progression"), `the progression of ${name}`)];
  })));

  const genres = story.objectOrder.filter((object) => object.kind === genreKind).map((genre) => {
    const where = genre.name;
    const genreCode = propertyOf(genre, "code");
    if (!/^[a-z][a-z0-9_]*$/.test(genreCode)) fail(where, `the code "${genreCode}" must be lower_snake_case`);
    const title = propertyOf(genre, "title");
    const motto = propertyOf(genre, "motto");
    if (!title || !motto) fail(where, "needs a title and a motto");
    const unfettered = adjectiveOf(genre, "unfettered") === "unfettered";

    const colouring = Object.freeze(INTERVALS.map((interval) => {
      const quality = followRulebook(story, "colouring", genre, { "interval above the tonic": interval });
      if (quality === undefined) fail(where, `no colouring rule decides interval ${interval}`);
      return code(quality);
    }));
    const progressionByInterval = Object.freeze(INTERVALS.map((interval) => {
      const ref = followRulebook(story, "progression", genre, { "interval above the tonic": interval });
      if (ref === undefined) fail(where, `no progression rule decides interval ${interval}`);
      return progressionId(ref, `${where} progression`);
    }));
    const overtones = readOvertones(story, genre, propertyOf(genre, "overtones"));
    // Optional (D-043): a genre that names no moves plays as written.
    const variation = story.kinds.get("variation move") ? Object.freeze(propertyOf(genre, "permitted moves").map(code)) : Object.freeze([]);

    const book = {
      code: genreCode,
      name: genre.name,
      title,
      motto,
      unfettered,
      insistent: adjectiveOf(genre, "insistent") === "insistent",
      colouring,
      progressionByInterval,
      overtones,
      variation,
    };

    if (unfettered) {
      Object.assign(book, {
        spine: Object.freeze({ method: "unfettered" }),
        melody: Object.freeze({ method: "unfettered" }),
        bass: Object.freeze({ method: "cells" }),
        organ: Object.freeze({ method: "inversion" }),
      });
      return Object.freeze(book);
    }

    const spineMethod = propertyOf(genre, "spine method");
    book.spine = spineMethod === "Tonnetz walking"
      ? Object.freeze({ method: "tonnetz", walks: readWalks(story, genre, propertyOf(genre, "changes")) })
      : Object.freeze({ method: "table", steps: readChanges(story, genre, propertyOf(genre, "changes")) });

    const melodyMethod = propertyOf(genre, "melody method");
    if (melodyMethod === "scale snapping") {
      const byStrictness = {};
      for (let strictness = STRICTNESS_RANGE[0]; strictness <= STRICTNESS_RANGE[1]; strictness += 1) {
        const tones = followRulebook(story, "melody tone", genre, { strictness });
        if (!tones || !tones.length || !tones.every(isPitchClass)) fail(where, `no melody tone rule gives pitch classes at strictness ${strictness}`);
        byStrictness[strictness] = Object.freeze([...tones]);
      }
      book.melody = Object.freeze({ method: "scale", tonesByStrictness: Object.freeze(byStrictness) });
    } else if (melodyMethod === "member snapping") {
      const members = propertyOf(genre, "melody members");
      const extensions = propertyOf(genre, "melody extensions");
      if (!members.length) fail(where, "member snapping needs melody members");
      if (!extensions.every(isPitchClass)) fail(where, "melody extensions must be pitch classes");
      book.melody = Object.freeze({ method: "members", members: Object.freeze(members.map(code)), extensions: Object.freeze([...extensions]) });
    } else {
      book.melody = Object.freeze({ method: melodyMethod === "chord snapping" ? "chord" : "euler" });
    }

    const bassMethod = propertyOf(genre, "bass method");
    if (bassMethod === "walking") {
      const walk = propertyOf(genre, "bass walk");
      if (walk.length !== 12 || !walk.every(isPitchClass)) fail(where, "a bass walk needs twelve pitch classes");
      book.bass = Object.freeze({ method: "walk", walk: Object.freeze([...walk]) });
    } else {
      book.bass = Object.freeze({ method: bassMethod === "contrary motion" ? "contrary" : "cells" });
    }

    if (adjectiveOf(genre, "voiced") === "voiced") {
      const members = propertyOf(genre, "organ voicing");
      if (!members.length) fail(where, "a voiced genre needs an organ voicing");
      book.organ = Object.freeze({ method: "voiced", members: Object.freeze(members.map(code)) });
    } else {
      book.organ = Object.freeze({ method: "inversion" });
    }
    return Object.freeze(book);
  });

  if (!genres.length) fail("source", "there are no genres");
  const creature = readCreatureGrammar(story);
  const byCode = {};
  for (const genre of genres) {
    if (byCode[genre.code]) fail(genre.name, `the code "${genre.code}" is already used by ${byCode[genre.code].name}`);
    byCode[genre.code] = genre;
  }

  return Object.freeze({
    title: story.title,
    author: story.author,
    genres: Object.freeze(genres),
    byCode: Object.freeze(byCode),
    progressions: Object.freeze(progressions),
    qualityProgressions,
    creature,
  });
}

/**
 * THE CREATURE'S OWN grammar (D-043): harmonic functions with candidate
 * roots, four-region paths of functions, and chord shapes in order of
 * preference. Optional: without the tables a source compiles without it.
 */
function readCreatureGrammar(story) {
  const tables = ["Table of Harmonic Functions", "Table of Harmonic Paths", "Table of Chord Shapes"].map((name) => story.tables.get(key(name)));
  if (tables.every((table) => !table)) return null;
  const [functionsTable, pathsTable, shapesTable] = tables;
  const where = "the creature's own grammar";
  if (tables.some((table) => !table)) fail(where, "needs the Tables of Harmonic Functions, Harmonic Paths, and Chord Shapes together");
  requireColumns(functionsTable, ["function", "name", "roots"], where);
  requireColumns(pathsTable, ["path", "functions"], where);
  requireColumns(shapesTable, ["shape", "quality", "tones"], where);
  const functions = {};
  functionsTable.rows.forEach((row, i) => {
    if (!Number.isInteger(row.function) || row.function < 1) fail(where, `function row ${i + 1} needs a positive number`);
    if (!Array.isArray(row.roots) || !row.roots.length || !row.roots.every(isPitchClass)) fail(where, `function ${row.function} roots must be pitch classes`);
    functions[row.function] = Object.freeze({ name: row.name, roots: Object.freeze([...row.roots]) });
  });
  const paths = pathsTable.rows.map((row, i) => {
    if (!Array.isArray(row.functions) || row.functions.length !== 4 || !row.functions.every((f) => functions[f])) fail(where, `path ${i + 1} needs four known functions`);
    if (row.functions[0] !== 1) fail(where, `path ${i + 1} must start at home (function 1)`);
    return Object.freeze([...row.functions]);
  });
  if (!paths.length) fail(where, "there are no harmonic paths");
  const shapes = shapesTable.rows.map((row, i) => {
    if (!Array.isArray(row.tones) || !row.tones.includes(0) || !row.tones.every(isPitchClass)) fail(where, `shape ${i + 1} tones must be pitch classes including the root (0)`);
    return Object.freeze({ quality: code(row.quality), tones: Object.freeze([...row.tones]) });
  });
  return Object.freeze({ functions: Object.freeze(functions), paths: Object.freeze(paths), shapes: Object.freeze(shapes) });
}
