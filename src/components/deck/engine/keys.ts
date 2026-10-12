/**
 * What each key does. Presentation clickers send PageDown and PageUp to
 * step, and some send F5 and Escape for "start" and "end": F5 is swallowed so
 * it never reloads the talk, and Escape only ever closes the overview. The
 * deck does not use the Fullscreen API, because a clicker's Escape would
 * drop out of it; the browser's own full screen is the presenter's.
 */

export type Command =
  | "next"
  | "prev"
  | "first"
  | "last"
  | "overview"
  | "notes"
  | "blackout"
  | "hud"
  | "close"
  /** Enter: the next step, or the jump to a number just typed. */
  | "enter"
  /** Handled, and does nothing. */
  | "noop"
  | { digit: number };

const KEYS: Record<string, Command> = {
  ArrowRight: "next",
  ArrowDown: "next",
  " ": "next",
  PageDown: "next",
  Enter: "enter",
  ArrowLeft: "prev",
  ArrowUp: "prev",
  PageUp: "prev",
  Backspace: "prev",
  Home: "first",
  End: "last",
  o: "overview",
  n: "notes",
  b: "blackout",
  ".": "blackout",
  h: "hud",
  Escape: "close",
  F5: "noop",
};

export type KeyPress = {
  key: string;
  metaKey?: boolean;
  ctrlKey?: boolean;
  altKey?: boolean;
  /** A held key repeating. */
  repeat?: boolean;
  /** Whether the key was pressed on a control (a button or a link), which Space and Enter belong to. */
  onControl?: boolean;
  /** Whether it was pressed where text is typed. */
  typing?: boolean;
};

/**
 * The command a key press asks for, or null when the key is not the deck's
 * (the browser then does what it always does). A held key steps once: its
 * repeats are swallowed, on a control as everywhere else.
 */
export function commandFor({ key, metaKey, ctrlKey, altKey, repeat, onControl, typing }: KeyPress): Command | null {
  if (metaKey || ctrlKey || altKey || typing) return null;
  // A focused control's Space and Enter are the browser's, to press it; a held one presses it once.
  if (onControl && (key === " " || key === "Enter")) return repeat ? "noop" : null;
  const command = /^\d$/.test(key) ? { digit: Number(key) } : (KEYS[key.length === 1 ? key.toLowerCase() : key] ?? null);
  if (command === null) return null;
  return repeat ? "noop" : command;
}

/** A horizontal swipe, from where a touch went down to where it lifted: left is next. */
export function swipeCommand(dx: number, dy: number): "next" | "prev" | null {
  if (Math.abs(dx) < 56 || Math.abs(dx) < Math.abs(dy) * 1.5) return null;
  return dx < 0 ? "next" : "prev";
}

/** The number typed so far with one more digit, kept to a length no deck needs more than. */
export const typeDigit = (typed: string, digit: number) => (typed + digit).slice(-4);
