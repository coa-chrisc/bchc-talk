/**
 * The deck's motion and stage tokens: one place for every easing, duration
 * and stagger, so forty slides move as one piece. The easings are the site's
 * own family (`--ease-page`, `--ease-out-expo`, `--ease-out-soft` in
 * globals.css); `page`, `soft` and `carry` are registered in engine/gsap.ts.
 */

/** The stage's design size. Every kit part is placed in these pixels. */
export const STAGE = { w: 1920, h: 1080 } as const;

export const EASE = {
  /** Arrivals: fast off the mark, a long settle. */
  out: "expo.out",
  /** Slide changes and anything that crosses the stage. */
  page: "page",
  /** A large part carried across the stage as one piece: a row going to its dock. */
  carry: "carry",
  /** Small fades and labels. */
  soft: "soft",
  /** Lines drawing on and things travelling along them. */
  draw: "power2.inOut",
  /** Counting up: quick, then slow enough to read the last digits. */
  count: "power3.out",
} as const;

/** Seconds. */
export const DUR = {
  quick: 0.4,
  base: 0.75,
  slow: 1.1,
  draw: 0.9,
  travel: 1.2,
  count: 1.4,
} as const;

/** Seconds between one part and the next in a group. */
export const STAGGER = { tight: 0.05, base: 0.09, loose: 0.16 } as const;

/** How far an arriving part rises, in stage pixels. */
export const RISE = 22;

/** A place on the stage. */
export type Box = { x: number; y: number; w: number; h: number };
export type Point = { x: number; y: number };

export const box = (x: number, y: number, w: number, h: number): Box => ({ x, y, w, h });

/**
 * Seconds held inside a chain, so the audience can read (docs/bchc-flow-revision.md, section 1):
 * after a story line lands nothing new starts for `read`, and one drawing
 * beat finishing and the next starting are `gap` apart.
 */
export const HOLD = { read: 1.6, gap: 0.5 } as const;

/** Seconds: how long one click's chain may run from the click, arrival fade included, and the longest the stage may sit still inside one. */
export const CHAIN = { longest: 12, still: 3 } as const;
