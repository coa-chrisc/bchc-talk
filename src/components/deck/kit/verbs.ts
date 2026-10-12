/**
 * The house moves. A step is written with these, not with raw tweens:
 *
 *   step("checks", [draw("gate.line"), rise(rows), work(build, 2), pass(cell), mark("approve")])
 *
 * Each verb carries the house duration and curve and, as importantly, the
 * value its part starts from, so a step's picture can be worked out without
 * a page (engine/compile.ts). Pass a list of ids to play one after another.
 * `to` is the way out for a move no verb covers.
 */
import type { Camera } from "../engine/camera";
import { BEAT, HOUSE } from "../engine/compile";
import type { CameraMove, Move, MoveOpts, PartMove, StepDef, Vars } from "../engine/types";
import type { CellLayout, MultiplesLayout, RowLayout } from "./board-layout";
import { DUR, EASE, HOLD, RISE, STAGGER } from "./tokens";

type Keys = string | readonly string[];

/** One click: its id, what moves in the world and, when given, what moves in the deck's persistent layer. */
export const step = (id: string, moves: (Move | Move[])[], chrome?: (Move | Move[])[]): StepDef => ({ id, moves: moves.flat(), ...(chrome ? { chrome: chrome.flat() } : {}) });

/** Any part, from `off` to `on`. A list of ids plays in turn, `stagger` seconds apart. */
export function to(key: Keys, on: Vars, off?: Vars, opts: MoveOpts = {}): PartMove[] {
  if (typeof key === "string") return [{ key, on, off, ...opts }];
  const { stagger = STAGGER.base, ...rest } = opts;
  return key.map((k, i) => ({ key: k, on, off, ...rest, ...(i > 0 ? { with: true, at: undefined } : {}), lag: (rest.lag ?? 0) + i * stagger }));
}

const QUICK = { duration: DUR.quick, ease: EASE.soft };

/** Fades in. */
export const show = (key: Keys, opts?: MoveOpts) => to(key, { autoAlpha: 1 }, { autoAlpha: 0 }, { ...QUICK, ...opts });
/** Fades out. */
export const hide = (key: Keys, opts?: MoveOpts) => to(key, { autoAlpha: 0 }, { autoAlpha: 1 }, { ...QUICK, ...opts });
/** Arrives: fades in while rising a little. */
export const rise = (key: Keys, opts?: MoveOpts) => to(key, { autoAlpha: 1, y: 0 }, { autoAlpha: 0, y: RISE }, { duration: DUR.base, ease: EASE.out, ...opts });
/** A headline's lines coming up out of their masks (SetText). */
export const lines = (key: Keys, opts?: MoveOpts) =>
  to(key, { yPercent: 0 }, { yPercent: 120 }, { duration: DUR.slow, ease: EASE.out, stagger: STAGGER.base, ...opts });
/** Draws a line, a frame or an outline on. */
export const draw = (key: Keys, opts?: MoveOpts) => to(key, { "--d": 1 }, { "--d": 0 }, { duration: DUR.draw, ease: EASE.draw, ...opts });
/** Fills a cell, or part of one. */
export const fill = (key: Keys, opts?: MoveOpts & { to?: number }) => {
  const { to: amount = 1, ...rest } = opts ?? {};
  return to(key, { "--k": amount }, { "--k": 0 }, { duration: DUR.base, ease: EASE.draw, ...rest });
};
/** A row's dot works one of its cells: the cell fills and the dot rides the front. */
export const work = (row: RowLayout, cell: number, opts?: MoveOpts): PartMove[] => {
  const target = row.cells[cell];
  const timing = { duration: DUR.base, ease: EASE.draw, ...opts };
  return [
    ...fill(target.key, timing),
    ...to(row.dotKey, { x: target.x + target.w - row.dotAt.x, autoAlpha: 1 }, { x: 0, autoAlpha: 0 }, { ...timing, at: undefined, with: true }),
  ];
};
/** A row's dot stands down. */
export const rest = (row: RowLayout, opts?: MoveOpts) => to(row.dotKey, { autoAlpha: 0 }, { x: 0, autoAlpha: 0 }, { ...QUICK, ...opts });

const cellKeys = (cells: CellLayout | readonly CellLayout[] | Keys): Keys =>
  typeof cells === "string" ? cells : "key" in cells ? cells.key : cells.map((cell) => (typeof cell === "string" ? cell : cell.key));
const VERDICT = { "--pass": 0, "--fail": 0 };

/** A cell passes its check: it takes the pass tint and a tick. */
export const pass = (cells: CellLayout | readonly CellLayout[] | Keys, opts?: MoveOpts) =>
  to(cellKeys(cells), { "--pass": 1, "--fail": 0 }, VERDICT, { ...QUICK, stagger: STAGGER.tight, ...opts });
/** A cell fails its check: it empties to a dashed outline and takes a cross. */
export const fail = (cells: CellLayout | readonly CellLayout[] | Keys, opts?: MoveOpts) =>
  to(cellKeys(cells), { "--fail": 1, "--pass": 0 }, VERDICT, { ...QUICK, stagger: STAGGER.tight, ...opts });
/** An agent takes a cell: a cell with a holder (board.tsx) tints in the holder's colour, ready to be worked. */
export const take = (cells: CellLayout | readonly CellLayout[] | Keys, opts?: MoveOpts) => to(cellKeys(cells), { "--hold": 1 }, { "--hold": 0 }, { ...QUICK, stagger: STAGGER.tight, ...opts });
/** A cell's verdict is taken back, ready to be worked again. */
export const clear = (cells: CellLayout | readonly CellLayout[] | Keys, opts?: MoveOpts) =>
  to(cellKeys(cells), { "--fail": 0, "--pass": 0, "--k": 0 }, { ...VERDICT, "--k": 0 }, { ...QUICK, ...opts });

/** A Counter arrives and counts to a number. */
export const count = (key: string, opts: MoveOpts & { to: number; from?: number }) => {
  const { to: end, from = 0, ...rest } = opts;
  return [...show(`${key}.box`, { at: rest.at }), ...to(key, { count: end }, { count: from }, { duration: DUR.count, ease: EASE.count, ...rest, at: undefined, with: true })];
};
/** A TypeText types itself out. */
export const type = (key: string, opts?: MoveOpts) => to(key, { typed: 1 }, { typed: 0 }, { duration: DUR.travel, ease: "none", ...opts });
/** The human mark lands: a person decided here. */
export const mark = (key: string, opts?: MoveOpts) => to(key, { autoAlpha: 1, "--d": 1 }, { autoAlpha: 0, "--d": 0 }, { duration: DUR.base, ease: EASE.draw, ...opts });
/** An annotation draws its region and leader, then its label. */
export const annotate = (key: string, opts?: MoveOpts) => to(key, { autoAlpha: 1, "--d": 1 }, { autoAlpha: 0, "--d": 0 }, { duration: DUR.slow, ease: EASE.draw, ...opts });
/** Steps back to a ghost of itself: still there, no longer the subject. */
export const ghost = (key: Keys, opts?: MoveOpts) => to(key, { autoAlpha: 0.25 }, { autoAlpha: 1 }, { ...QUICK, ...opts });
/** Steps back a little: still readable, no longer the subject. Between full strength and a ghost. */
export const dim = (key: Keys, opts?: MoveOpts) => to(key, { autoAlpha: 0.45 }, { autoAlpha: 1 }, { ...QUICK, ...opts });
/** Comes back from a ghost. */
export const solid = (key: Keys, opts?: MoveOpts) => to(key, { autoAlpha: 1 }, { autoAlpha: 1 }, { ...QUICK, ...opts });
/** A packet travels its connector. */
export const send = (key: string, opts?: MoveOpts) => to(key, { along: 1 }, { along: 0 }, { duration: DUR.travel, ease: EASE.draw, ...opts });
/** A Rider rides its path to the end, showing over the first 0.2 s of the trip. */
export const ride = (key: string, opts?: MoveOpts): PartMove[] => [
  ...send(key, opts),
  ...to(key, { autoAlpha: 1 }, { autoAlpha: 0 }, { duration: 0.2, ease: EASE.soft, at: undefined, with: true, lag: opts?.lag }),
];
/** A story line comes up out of its mask (`Story`): the house arrival, so it reads at once. */
export const tell = (key: Keys, opts?: MoveOpts) => lines(key, { duration: DUR.base, ease: EASE.out, ...opts });
/** A gate opens. */
export const open = (key: string, opts?: MoveOpts) => to(key, { "--k": 1 }, { "--k": 0 }, { duration: DUR.base, ease: EASE.page, ...opts });
/** A tick field lights its first `to` marks. */
export const light = (key: string, opts: MoveOpts & { to: number }) => {
  const { to: lit, ...rest } = opts;
  return to(key, { lit }, { lit: 0 }, { duration: DUR.count, ease: EASE.count, ...rest });
};

/** Where a wipe opens from: an edge, or a corner for a frame that grows out of one. */
export type WipeFrom = "left" | "right" | "top" | "bottom" | "top-left" | "top-right" | "bottom-left" | "bottom-right";
const UNCOVERED: Vars = { "--wt": 0, "--wr": 0, "--wb": 0, "--wl": 0 };
/** A wiped part's insets (top, right, bottom, left, in percent) when it is shut toward `from`: the sides away from it are fully drawn in. */
export const covered = (from: WipeFrom): Vars => ({
  "--wt": from.includes("bottom") ? 100 : 0,
  "--wr": from.includes("left") ? 100 : 0,
  "--wb": from.includes("top") ? 100 : 0,
  "--wl": from.includes("right") ? 100 : 0,
});
/** Opens a part (class `dk-wipe`) out of an edge or a corner, by its clip: an evidence frame, a dashed outline that cannot stroke-draw. */
export const wipe = (key: Keys, opts?: MoveOpts & { from?: WipeFrom }) => {
  const { from = "left", ...rest } = opts ?? {};
  return to(key, UNCOVERED, covered(from), { duration: DUR.base, ease: EASE.page, ...rest });
};
/** Shuts a wiped part back toward an edge or a corner. */
export const unwipe = (key: Keys, opts?: MoveOpts & { toward?: WipeFrom }) => {
  const { toward = "left", ...rest } = opts ?? {};
  return to(key, covered(toward), UNCOVERED, { duration: DUR.base, ease: EASE.page, ...rest });
};

/** How a picture's title gives way to the next, the same every time: the old one fades as the new one's lines come up. */
export const RETITLE = { out: 0.3, in: 0.9, at: 0.25 } as const;
/** Changes the title: `from` and `next` are the two SetTexts' ids. */
export const retitle = (from: string, next: string, opts?: MoveOpts): PartMove[] => {
  const at = opts?.at ?? 0;
  return [...hide(from, { duration: RETITLE.out, at }), ...lines(next, { duration: RETITLE.in, at: at + RETITLE.at })];
};

/**
 * When a line that draws over `duration` on the house drawing curve
 * (power2.inOut) has reached each fraction of its length: the moments to
 * show ticks so they appear just behind the front.
 */
export const behind = (front: { at: number; duration: number }, fractions: readonly number[]): number[] =>
  fractions.map((p) => {
    const k = Math.min(1, Math.max(0, p));
    return front.at + front.duration * (k < 0.5 ? Math.sqrt(k / 2) : 1 - Math.sqrt((1 - k) / 2));
  });

/** The camera travels to a framing. */
export const camera = (framing: Camera, opts?: MoveOpts): CameraMove => ({ camera: framing, duration: DUR.travel, ease: EASE.page, ...opts });

const HOME_PLACE = { "--x": 0, "--y": 0, "--s": 1 };

/** One picture becomes a grid of it: the original (`hero`, a Part with its origin at the picture's top left) moves to the first slot and the copies arrive around it. */
export const spread = (hero: string, layout: MultiplesLayout, opts?: MoveOpts): PartMove[] => {
  const travel = { duration: DUR.travel, ease: EASE.page, ...opts };
  return [
    ...to(hero, { "--x": layout.hero.x, "--y": layout.hero.y, "--s": layout.hero.scale }, HOME_PLACE, travel),
    ...to(layout.copies.map((copy) => copy.key), { autoAlpha: 1 }, { autoAlpha: 0 }, { ...QUICK, with: true, lag: DUR.travel * 0.45, stagger: STAGGER.tight }),
  ];
};
/** The grid goes back to the one picture. */
export const gather = (hero: string, layout: MultiplesLayout, opts?: MoveOpts): PartMove[] => [
  ...to(layout.copies.map((copy) => copy.key), { autoAlpha: 0 }, { autoAlpha: 0 }, { ...QUICK, stagger: 0 }),
  ...to(hero, HOME_PLACE, HOME_PLACE, { duration: DUR.travel, ease: EASE.page, with: true, ...opts }),
];

/** How many elements carry each part's id, by id, where it is more than one: a move's stagger runs across all of them. */
export type Counts = Readonly<Record<string, number>>;

/** Each move with the second it starts, read the way the engine reads a step (engine/compile.ts): its own `at`, or a beat after the move before, or `with` it. */
function timed(moves: readonly Move[]) {
  let last = -BEAT;
  return moves.map((move) => {
    const start = move.at ?? (move.with ? Math.max(0, last) : last + BEAT);
    last = start;
    return { move, start };
  });
}

const endOf = (move: Move, start: number, counts: Counts) =>
  start + (move.lag ?? 0) + (move.duration ?? HOUSE.duration) + (move.stagger ?? 0) * Math.max(0, ("key" in move ? (counts[move.key] ?? 1) : 1) - 1);

/** Seconds from a list of moves' start to the last of them landing, timed as a step's are. */
export const span = (moves: readonly (Move | Move[])[], counts: Counts = {}) => Math.max(0, ...timed(moves.flat()).map(({ move, start }) => endOf(move, start, counts)));

/**
 * One beat of a chain: one subject's moves, timed from the beat's own start
 * the way a step's are from the click. It starts `hold` seconds after the
 * chain so far has landed: `HOLD.gap` when left out, `HOLD.read` after a
 * story line. With `with` it starts alongside the beat before it instead,
 * `hold` seconds after that beat's start (none when left out): a story line
 * and the drawing it describes.
 */
export type ChainBeat = { moves: (Move | Move[])[]; hold?: number; with?: boolean };

/**
 * One click's beats in order, as one step's moves (docs/bchc-flow-revision.md,
 * section 1): each beat's moves get an explicit `at`, so nobody sums seconds
 * by hand. A beat lands when its last move does, `counts` giving how many
 * elements a staggered id has. The first beat starts at `at` (0 when left
 * out), plus its own `hold`. The moves keep their order, so the step's
 * picture is the same as the beats' moves played one after another.
 */
export function chain(beats: readonly ChainBeat[], opts: { at?: number; counts?: Counts } = {}): Move[] {
  const { at = 0, counts = {} } = opts;
  let end = at;
  let previous = at;
  return beats.flatMap((beat, i) => {
    const begin = i === 0 ? at + (beat.hold ?? 0) : beat.with ? previous + (beat.hold ?? 0) : end + (beat.hold ?? HOLD.gap);
    previous = begin;
    return timed(beat.moves.flat()).map(({ move, start }) => {
      end = Math.max(end, begin + endOf(move, start, counts));
      // A set `at` wins over `with` in the engine, so a chained move keeps its flags and is placed by `at` alone.
      return { ...move, at: begin + start };
    });
  });
}
