// Discovery and the whole cabinet (D-037). In discovery mode the page opens
// on its front panel (phrase, vitrine, transport, Fun Machine) and each
// drawer below unlocks the first time the visitor reaches for what it holds;
// any drawer can be opened early. The whole cabinet lays every drawer bare.
// Pure state only: src/app.mjs adds the drawer chrome and the triggers.

export const CABINET_STORAGE_KEY = "edmark-fun-machine.cabinet.v1";
export const CABINET_MODES = Object.freeze(["discovery", "cabinet"]);

// In page order. `target` is the element the drawer wraps; `invite` is the
// one line a sealed drawer shows; `unlock` names the moment it opens itself.
export const DRAWERS = Object.freeze([
  Object.freeze({ id: "kapellmeister", target: "kapellmeister-engine", label: "KAPELLMEISTER", invite: "hold a Fun Machine key to wake the rulebooks", unlock: "held-key" }),
  Object.freeze({ id: "mix", target: "wing-mix", label: "MIX", invite: "opens after your first full loop", unlock: "loop" }),
  Object.freeze({ id: "band", target: "wing-band", label: "THE BAND", invite: "the five players behind the curtain", unlock: "band" }),
  Object.freeze({ id: "keep", target: "wing-keep", label: "KEEP", invite: "save and export what you make", unlock: "change" }),
]);

const DRAWER_IDS = DRAWERS.map((drawer) => drawer.id);
export const LOOPS_BEFORE_BAND = 4;

export function defaultCabinetState() {
  return Object.freeze({ mode: "discovery", open: Object.freeze([]), seen: Object.freeze([]) });
}

function drawerList(value) {
  if (!Array.isArray(value)) return null;
  const ids = value.filter((id) => DRAWER_IDS.includes(id));
  if (ids.length !== value.length) return null;
  return Object.freeze(DRAWER_IDS.filter((id) => ids.includes(id)));
}

/** Reads the remembered cabinet; anything missing, foreign, or malformed starts fresh. */
export function parseCabinetState(text) {
  if (typeof text !== "string" || text.length > 512) return defaultCabinetState();
  let raw;
  try {
    raw = JSON.parse(text);
  } catch {
    return defaultCabinetState();
  }
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return defaultCabinetState();
  const keys = Object.keys(raw).sort().join(",");
  const open = drawerList(raw.open);
  const seen = drawerList(raw.seen);
  if (keys !== "mode,open,seen" || !CABINET_MODES.includes(raw.mode) || !open || !seen) return defaultCabinetState();
  return Object.freeze({ mode: raw.mode, open, seen: drawerList([...new Set([...seen, ...open])]) });
}

export function serializeCabinetState(state) {
  return JSON.stringify({ mode: state.mode, open: state.open, seen: state.seen });
}

export function isDrawerOpen(state, id) {
  return state.mode === "cabinet" || state.open.includes(id);
}

function withDrawer(list, id, present) {
  return drawerList(present ? [...new Set([...list, id])] : list.filter((entry) => entry !== id));
}

/**
 * Applies one event and reports what changed:
 *  - `{ type: "unlock", drawer }`: the visitor reached for a drawer's contents.
 *    In discovery it opens a drawer that has never opened before; a drawer the
 *    visitor has seen (and perhaps closed again) stays as they left it.
 *  - `{ type: "toggle", drawer }`: the visitor opened or closed it by hand.
 *  - `{ type: "mode", mode }`: switch between discovery and the whole cabinet.
 * Returns `{ state, opened }`, where `opened` is the drawer id that this event
 * revealed (for an announcement), or null.
 */
export function cabinetReduce(state, event) {
  if (event.type === "mode") {
    if (!CABINET_MODES.includes(event.mode) || event.mode === state.mode) return { state, opened: null };
    return { state: Object.freeze({ ...state, mode: event.mode }), opened: null };
  }
  if (!DRAWER_IDS.includes(event.drawer)) return { state, opened: null };
  if (event.type === "unlock") {
    if (state.mode === "cabinet" || state.seen.includes(event.drawer)) return { state, opened: null };
    return {
      state: Object.freeze({ ...state, open: withDrawer(state.open, event.drawer, true), seen: withDrawer(state.seen, event.drawer, true) }),
      opened: event.drawer,
    };
  }
  if (event.type === "toggle") {
    if (state.mode === "cabinet") return { state, opened: null };
    const opening = !state.open.includes(event.drawer);
    return {
      state: Object.freeze({ ...state, open: withDrawer(state.open, event.drawer, opening), seen: withDrawer(state.seen, event.drawer, true) }),
      opened: opening ? event.drawer : null,
    };
  }
  return { state, opened: null };
}

/** The drawer a trigger unlocks, if any. */
export function drawerForTrigger(trigger) {
  return DRAWERS.find((drawer) => drawer.unlock === trigger)?.id ?? null;
}
