/**
 * What the build world's clicks are written with: how many elements carry
 * each id that more than one element carries (`COUNTS`, read off the layouts
 * the scene draws from; world.test.ts holds it to the scene's markup), and
 * the small helpers every click's chain of beats uses.
 */
import { DUR, EASE, HOLD, chain, covered, hide, storyKeys, to, type ChainBeat, type Counts, type WipeFrom } from "@/components/deck/kit";
import type { Move } from "@/components/deck/engine";
import type { MoveOpts } from "@/components/deck/engine/types";
import { storyOf } from "../../script/find";
import { storyId } from "../steps";
import { RAD, RAD_LINKS, TITLES } from "./layout";
import { FAILED, GRID, LATE, PASSED, ROWS, WAVES, fillKey, lateCells, lateKey, tickKey, waveCells } from "./layout-board";
import { SCREEN_PAIR, TEST_PAIR } from "./layout-close";
import { COLUMNS, dotKey, fillKey as yearFillKey } from "./layout-year";

type Keys = string | readonly string[];

const many = (entries: readonly (readonly [string, number])[]) => Object.fromEntries(entries.filter(([, n]) => n > 1));

export const COUNTS: Counts = {
  [RAD.boxKey]: RAD.boxes.length,
  [RAD.linkKey]: RAD_LINKS.length,
  [RAD.cellsKey]: 4,
  // Slide 20's close-ups: each drawing and its label are one part.
  [TEST_PAIR.failedKey]: 2,
  [TEST_PAIR.fixedKey]: 2,
  [SCREEN_PAIR.ringKey]: 2,
  [SCREEN_PAIR.fixedKey]: 2,
  ...many(ROWS.flatMap((_, r) => WAVES.map((w) => [fillKey(r, w), waveCells(r, w).length] as const))),
  ...many(WAVES.slice(0, 2).map((w) => [tickKey(w), PASSED.filter((cell) => Math.floor(cell.slot / GRID.sprint) === w && cell !== FAILED).length] as const)),
  ...many(LATE.map((_, n) => [lateKey(n), lateCells(n).length] as const)),
  ...many(
    COLUMNS.filter((column) => column.state === "built").flatMap((column) => [[yearFillKey(column.sprint), column.blocks.length] as const, [dotKey(column.sprint), column.blocks.length] as const]),
  ),
  ...Object.fromEntries(TITLES.filter((title) => title.lines.length > 1).map((title) => [title.key, title.lines.length])),
};

/** Moves as a beat lists them: grouped by subject, as deep as the picture needs. */
export type Moves = Move | readonly Moves[];
/** One beat of a click (kit `ChainBeat`), its moves grouped as deep as they need. */
export type Beat = Omit<ChainBeat, "moves"> & { moves: readonly Moves[] };

/** One click's beats, as its step's moves. */
export const beats = (list: readonly Beat[]) => ({
  moves: chain(
    list.map((beat) => ({
      ...beat,
      moves: (beat.moves as unknown[]).flat(Infinity) as Move[],
    })),
    { counts: COUNTS },
  ),
});
/** One click's beats, as its one step. */
export const play = (list: readonly Beat[]) => ({ play: beats(list) });

/** A picture's story lines, A then B: what the next picture takes away. */
export const told = (pictureId: string) => storyKeys(storyId(pictureId), storyOf(pictureId).length);

/** Takes what the picture before left, at once: the click's subject is what comes next. */
export const gone = (keys: readonly string[]) => hide(keys, { at: 0, duration: 0.3, stagger: 0 });

/** A beat that waits for the story line before it to land, then for the audience to read it. */
export const AFTER_READ = { with: true, hold: DUR.base + HOLD.read } as const;

/** Opens a part out of an edge by its clip (`dk-wipe`), fading in with it what has no clip: its label. */
export const opens = (key: Keys, opts: MoveOpts & { from?: WipeFrom } = {}) => {
  const { from = "left", ...rest } = opts;
  return to(key, { "--wt": 0, "--wr": 0, "--wb": 0, "--wl": 0, autoAlpha: 1 }, { ...covered(from), autoAlpha: 0 }, { duration: DUR.base, ease: EASE.page, ...rest });
};

/** Comes on from somewhere else on the stage: from `off` (a shift in pixels) to its place. */
export const from = (key: Keys, off: { x?: number; y?: number }, opts: MoveOpts = {}) =>
  to(key, { x: 0, y: 0, autoAlpha: 1 }, { x: off.x ?? 0, y: off.y ?? 0, autoAlpha: 0 }, { duration: DUR.base, ease: EASE.page, ...opts });
