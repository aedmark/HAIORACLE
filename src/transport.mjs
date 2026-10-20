// Master transport state and hotkey resolution. Pure functions only: the host
// owns audio and DOM, and asks this module what the next state should be.

export const TRANSPORT_STATES = Object.freeze({
  STOPPED: "stopped",
  PLAYING: "playing",
  PAUSED: "paused",
});

export const TRANSPORT_COMMANDS = Object.freeze(["play", "pause", "toggle", "stop", "restart"]);

export function createTransportState() {
  return Object.freeze({ state: TRANSPORT_STATES.STOPPED, cursor: 0 });
}

function normalizeCursor(cursor) {
  return Number.isInteger(cursor) && cursor >= 0 ? cursor : 0;
}

/**
 * Returns the next transport state. `cursor` is the raw step counter the loop
 * should resume from; the host supplies it on pause because only the host knows
 * which step was last audible. The counter is not wrapped to 12 because some
 * rhythm patterns have five or six cells, and resuming must continue the exact
 * rhythmic phase rather than snapping it back to the bar line.
 */
export function transportReduce(current, command, { cursor } = {}) {
  const { state } = current;
  switch (command) {
    case "play":
      return state === TRANSPORT_STATES.PLAYING
        ? current
        : Object.freeze({ state: TRANSPORT_STATES.PLAYING, cursor: current.cursor });
    case "pause":
      return state === TRANSPORT_STATES.PLAYING
        ? Object.freeze({ state: TRANSPORT_STATES.PAUSED, cursor: normalizeCursor(cursor ?? current.cursor) })
        : current;
    case "toggle":
      return transportReduce(current, state === TRANSPORT_STATES.PLAYING ? "pause" : "play", { cursor });
    case "stop":
      return Object.freeze({ state: TRANSPORT_STATES.STOPPED, cursor: 0 });
    case "restart":
      return Object.freeze({ state: TRANSPORT_STATES.PLAYING, cursor: 0 });
    default:
      throw new RangeError(`Unknown transport command: ${command}`);
  }
}

const TEXT_ENTRY_INPUT_TYPES = new Set([
  "", "text", "search", "email", "url", "tel", "password", "number",
  "date", "datetime-local", "month", "time", "week",
]);

// Controls whose native Space behavior must win when they hold keyboard focus.
const SPACE_ACTIVATED_TAGS = new Set(["BUTTON", "SUMMARY"]);
const SPACE_ACTIVATED_INPUT_TYPES = new Set(["checkbox", "radio", "button", "submit", "reset", "color", "file"]);
const SPACE_ACTIVATED_ROLES = new Set(["button", "checkbox", "switch", "radio", "tab", "menuitem", "option"]);

function isTextEntry(target) {
  if (!target) return false;
  if (target.isContentEditable) return true;
  if (target.tagName === "TEXTAREA" || target.tagName === "SELECT") return true;
  if (target.tagName === "INPUT") {
    return TEXT_ENTRY_INPUT_TYPES.has(String(target.type || "").toLowerCase());
  }
  return false;
}

function isSpaceActivated(target) {
  if (!target) return false;
  if (SPACE_ACTIVATED_TAGS.has(target.tagName)) return true;
  if (target.tagName === "INPUT" && SPACE_ACTIVATED_INPUT_TYPES.has(String(target.type || "").toLowerCase())) return true;
  const role = typeof target.getAttribute === "function" ? target.getAttribute("role") : null;
  return SPACE_ACTIVATED_ROLES.has(role);
}

/**
 * Maps a keyboard event to a transport command, or null to leave it alone.
 *
 * Space toggles play/pause except while typing, and except on a control that
 * holds keyboard focus, where Space must keep activating that control. The host
 * passes `pointerFocused`, the control last focused by a pointer press: Space
 * after clicking MUTATE pauses the loop instead of mutating again. (:focus-visible
 * cannot make this call, because Chrome promotes a clicked button to
 * :focus-visible on the first key press.) Without that hint native activation
 * wins, so keyboard users never lose a control to the transport.
 * Escape stops and rewinds from anywhere, including the phrase field.
 */
export function transportCommandForKey(event, { pointerFocused = null } = {}) {
  if (!event || event.ctrlKey || event.metaKey || event.altKey) return null;
  if (event.key === "Escape" || event.code === "Escape") return "stop";
  const isSpace = event.code === "Space" || event.key === " " || event.key === "Spacebar";
  if (!isSpace || event.shiftKey) return null;
  const { target } = event;
  if (isTextEntry(target)) return null;
  if (isSpaceActivated(target) && target !== pointerFocused) return null;
  return "toggle";
}
