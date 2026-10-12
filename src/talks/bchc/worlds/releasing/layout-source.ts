/**
 * Slide 31, our source code once it's cleared (docs/bchc-talk-script.md,
 * slide 31, They see): the catalog's card grid, cropped to its last row,
 * with one empty slot at the row's end, drawn as a dashed "New project"
 * outline. The grid is drawn, not a still: no still of the live grid has an
 * empty slot, and no entry may be legible. Beside it, a stack of tiles in the
 * catalog's colour, labelled "Austin source code", waits behind an "Awaiting
 * City of Austin approval" tag, and is still waiting when the slide ends.
 */
import { CONTENT_TOP, box, type Box } from "@/components/deck/kit";
import { shown } from "../../script/find";

const [SOURCE_CODE, AWAITING, NEW_PROJECT] = shown("source", "play");

/**
 * The catalog's grid, seen through a frame with the catalog's 3 px edge:
 * three columns of cards, 340 wide and 28 apart, 32 in from the frame's
 * sides. The frame's top cuts through the row above, so only its cards'
 * feet show, and the last row sits under it.
 */
const GRID = { pad: 32, card: 340, gap: 28, peek: 40, rowH: 316 } as const;
const FRAME_W = 2 * GRID.pad + 3 * GRID.card + 2 * GRID.gap;
export const CATALOG = {
  key: "rel.catalog",
  at: box(96, CONTENT_TOP.two + 28, FRAME_W, GRID.peek + GRID.gap + GRID.rowH + 30),
  rx: 12,
} as const;

const colX = (col: number) => CATALOG.at.x + GRID.pad + col * (GRID.card + GRID.gap);
const ROW_Y = CATALOG.at.y + GRID.peek + GRID.gap;

/** The row above: each card's foot, a card's height above the frame's top so only its last 40 px show. */
export const PEEKS: readonly Box[] = [0, 1, 2].map((col) => box(colX(col), CATALOG.at.y - GRID.rowH + GRID.peek, GRID.card, GRID.rowH));

/** The last row's two cards, drawn without words: a chip, a title in two bars, three lines of description, a rule and a footer. */
export const CARDS = [0, 1].map((col) => ({ key: `rel.card.${col}`, at: box(colX(col), ROW_Y, GRID.card, GRID.rowH) }));

/** The empty slot at the row's end: a dashed outline in the catalog's colour, named in its middle. */
export const SLOT = { key: "rel.slot", at: box(colX(2), ROW_Y, GRID.card, GRID.rowH), text: NEW_PROJECT } as const;

/**
 * The waiting stack, centred in the room right of the catalog: its name on
 * top, eight tiles in two rows of four drawn at three times the wall's size,
 * and the tag under them, in front of where they would go.
 */
const RIGHT = { x0: CATALOG.at.x + CATALOG.at.w, x1: 1824 } as const;
const MIDDLE = (RIGHT.x0 + RIGHT.x1) / 2;
export const STACK_TILES = { cols: 4, rows: 2, scale: 3 } as const;
const STACK_SIZE = { w: (STACK_TILES.cols * 24 - 6) * STACK_TILES.scale, h: (STACK_TILES.rows * 24 - 6) * STACK_TILES.scale };
const STACK_Y = CATALOG.at.y + 124;
export const STACK = {
  key: "rel.stack",
  at: box(Math.round(MIDDLE - STACK_SIZE.w / 2), STACK_Y, STACK_SIZE.w, STACK_SIZE.h),
  /** It comes in from the right, toward the catalog, and stops here. */
  from: { "--x": 160 },
  name: { key: "rel.stack.name", text: SOURCE_CODE, at: box(RIGHT.x0 + 24, STACK_Y - 64, RIGHT.x1 - RIGHT.x0 - 24, 44) },
} as const;
export const STACK_CENTRE = { x: STACK.at.x + STACK.at.w / 2, y: STACK.at.y + STACK.at.h / 2 };

const TAG_W = 460;
export const WAITING = { key: "rel.waiting", at: box(Math.round(MIDDLE - TAG_W / 2), STACK.at.y + STACK.at.h + 32, TAG_W, 48), text: AWAITING } as const;

/** Every part slide 31 puts on the stage. */
export const SOURCE_OWN: readonly string[] = [CATALOG.key, ...CARDS.map((card) => card.key), SLOT.key, STACK.key, STACK.name.key, WAITING.key];
