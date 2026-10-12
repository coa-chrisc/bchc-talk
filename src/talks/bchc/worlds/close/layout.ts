/**
 * Where everything in Part 7 sits, in stage pixels, and every part's id.
 * Part 7 is slide 44 alone, on navy with no frame (docs/bchc-talk-script.md,
 * draft 8): the view pulls back from slide 1 into a grid of every slide
 * before it, an agent flies in and settles on each one, the label reads
 * "Agents built this talk too", and the closing lines stand above the grid.
 * Every word is the script's, read through `shown()`.
 */
import { CONTENT_TOP, STAGE, box, multiples, type Box, type Point } from "@/components/deck/kit";
import { withBase } from "@/lib/base-path";
import { SCRIPT } from "../../script";
import { shown } from "../../script/find";
import finale from "./finale.json";

/** Slide 44's words, in the script's order: the label, then the closing lines. */
const [LABEL_TEXT, FIRST, SECOND, LAST] = shown("thanks", "play");

/** The first two closing lines, set as the title on two lines. */
export const TITLES = {
  thanks: { key: "close.title.thanks", x: 96, y: 152, lines: [FIRST, SECOND] },
} as const;

/** The last closing line, in the story band's first row under the two-line title. */
export const THANKS = { key: "close.thanks", at: box(96, 420, 900, 45), text: LAST } as const;

/* The grid: every picture of the talk before this part, at once. */

/** One cell for each picture of the talk before this part, in the order shown. */
export const PICTURES = SCRIPT.filter((picture) => picture.world !== "close").length;

/**
 * Five rows, as many across as the pictures need (nine for 45, so every row
 * is full), from where the content starts under a two-line title and its
 * story band. The cells keep the stills' 16:9 (160 by 90, 10 apart); five
 * rows of them are as tall as the stage allows under the band. The grid is
 * centred across the stage.
 */
const ROWS = 5;
const COLS = Math.ceil(PICTURES / ROWS);
const CELL = { w: 160, h: 90, gap: 10 } as const;
const GRID_W = COLS * CELL.w + (COLS - 1) * CELL.gap;
export const GRID = { cols: COLS, rows: ROWS, ...CELL, x: (STAGE.w - GRID_W) / 2, y: CONTENT_TOP.two } as const;
export const GRID_BOX = box(GRID.x, GRID.y, GRID_W, ROWS * CELL.h + (ROWS - 1) * CELL.gap);

/**
 * Which stills have been captured (capture-finale.mjs writes the list): a
 * cell shows its own still once it exists, and a white tile with a navy rule
 * until then. Read at build time, so every load of the deck shows the same
 * picture.
 */
const MANIFEST: { version: string; stills: number[]; hero?: boolean } = finale;
/**
 * The version the finale's pictures were captured under, and the one place it
 * is set: finale.json, which capture-finale.mjs writes. Every still's file
 * name, and the full-stage picture of slide 1, follow it.
 */
export const FINALE_VERSION = MANIFEST.version;
export const FINALE_DIR = withBase("/finale");
/** A still's file name: its place in the grid from 1, in reading order, and the version it was captured under. */
export const stillName = (n: number, version = FINALE_VERSION) => `${String(n).padStart(2, "0")}.${version}.webp`;
/** The full-stage picture of slide 1 the view pulls back from (capture-finale.mjs writes it with the stills). */
export const heroName = (version = FINALE_VERSION) => `hero.${version}.webp`;

/** The grid's cells, one picture's place each, in reading order. Each still's id is its cell's in the pull-back (`MULTI`), from 0; `src` is null until the still is captured. */
const STILL_ID = "close.still";
export const STILLS = Array.from({ length: PICTURES }, (_, i) => {
  const n = i + 1;
  const at = box(GRID.x + (i % GRID.cols) * (GRID.w + GRID.gap), GRID.y + Math.floor(i / GRID.cols) * (GRID.h + GRID.gap), GRID.w, GRID.h);
  return { key: `${STILL_ID}.${i}`, at, src: MANIFEST.stills.includes(n) ? `${FINALE_DIR}/${stillName(n)}` : null };
});

/** A missing still's stand-in: a white tile with a navy rule where a slide's title would sit, in the tile's own pixels. */
export const blankRule = (at: Box): Box => box(Math.round(at.w * 0.09), Math.round(at.h * 0.2), Math.round(at.w * 0.4), Math.max(4, Math.round(at.h * 0.045)));

/**
 * The pull-back (kit `spread`): slide 1's picture at the size of the stage,
 * carried by --x, --y and --s about its top left into the first cell, as the
 * others come up round it. Until the full-stage picture is captured
 * (finale.json `hero`), the first cell's still stands in for it, enlarged.
 */
const SLOTS = multiples({ id: STILL_ID, from: box(0, 0, STAGE.w, STAGE.h), area: GRID_BOX, cols: GRID.cols, rows: GRID.rows, gap: GRID.gap });
export const MULTI = { ...SLOTS, copies: SLOTS.copies.slice(0, STILLS.length - 1) };
export const HERO = {
  key: "close.hero",
  frameKey: "close.hero.frame",
  at: box(0, 0, STAGE.w, STAGE.h),
  src: MANIFEST.hero ? `${FINALE_DIR}/${heroName()}` : STILLS[0].src,
} as const;

/* The agents. */

/** A landed agent's ring, and the navy disc it sits on so it reads on a white still. */
export const AGENT_R = 12;
export const DISC_R = AGENT_R + 3;
/** How far in from a cell's bottom right corner an agent settles, its disc just inside the still: where a slide holds only its number. */
const PERCH = DISC_R + 2;
/** Where each agent flies in from, from where it lands: up and to the right, so it comes down onto its still. */
export const ARRIVAL = { x: 36, y: -64 } as const;

/**
 * The label, just above the grid's top right corner, a caption for the
 * grid, its right edge on the grid's, with an agent at its end as the key.
 */
const LABEL_H = 32;
const LABEL_Y = GRID.y - 12 - LABEL_H;
const GRID_RIGHT = GRID_BOX.x + GRID_BOX.w;
export const LEGEND = { key: "close.legend", at: { x: GRID_RIGHT - AGENT_R, y: LABEL_Y + LABEL_H / 2 } as Point };
export const LABEL = { key: "close.label", at: box(GRID_RIGHT - 2 * AGENT_R - 16 - 600, LABEL_Y, 600, LABEL_H), text: LABEL_TEXT } as const;

/** One agent for each still, in reading order: it flies in and settles on its still's bottom right corner, and stays. */
export const AGENTS = STILLS.map((still, cell) => {
  const at = { x: still.at.x + still.at.w - PERCH, y: still.at.y + still.at.h - PERCH };
  return { key: `close.agent.${cell}`, glyphKey: `close.agent.${cell}.glyph`, cell, at, from: ARRIVAL };
});
