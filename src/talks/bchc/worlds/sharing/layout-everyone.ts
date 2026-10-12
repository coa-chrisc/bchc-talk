/**
 * Slide 24, when every member shares: one outline, "Your department",
 * holding the one use case you shared, "Yours" over it, seen close; then
 * the use cases other members share land in it, one, then two at once, then
 * four, then more and more, until there are too many to follow. The
 * outline widens to make room as the view pulls back, and the last tiles
 * land at its edges as the slide ends. No number shows anywhere.
 *
 * The tiles sit on a grid of places round the outline's middle, filled in
 * order of how far each place is from the middle (measured against the
 * grid's own width and height), so the pool grows out from your own tile
 * and the outline is always the box round the tiles there. The three places
 * over your own tile stay empty for its word, so the outline holds it too.
 */
import { box, type Box, type Point } from "@/components/deck/kit";
import { shown } from "../../script/find";
import { LABEL_LINE, SAFE_BOTTOM, groupOf, round } from "./layout";

const [DEPARTMENT, YOURS] = shown("everyone", "play");

/** The grid: 27 places across and 6 down, each tile 40 px with 12 between, and the outline 20 px round the tiles. */
export const POOL = { cols: 27, rows: 6, tile: 40, pitch: 52, pad: 20, rx: 6, corner: 14 } as const;
const span = (n: number) => (n - 1) * POOL.pitch + POOL.tile + 2 * POOL.pad;
/** The outline at its widest, with every place filled: the picture the slide ends on, at the view's full width. */
const FULL = { w: span(POOL.cols), h: span(POOL.rows) } as const;
/** The outline's middle: low enough that its label sits under the story band at its widest, its foot above the safe line. */
const C: Point = { x: 960, y: SAFE_BOTTOM - 10 - FULL.h / 2 };
/** The label's gap over the outline's top edge. */
const LABEL_GAP = 12;
/** How close the view starts: the one tile at three times its size. */
const CLOSEST = 3;

const mid = { c: (POOL.cols - 1) / 2, r: (POOL.rows - 1) / 2 };
/** Every place on the grid, nearest the middle first: by its distance against the grid's half width and half height, then by steps from the middle, then clockwise from the right. */
const places = Array.from({ length: POOL.cols * POOL.rows }, (_, n) => {
  const dc = (n % POOL.cols) - mid.c;
  const dr = Math.floor(n / POOL.cols) - mid.r;
  return { dc, dr, reach: Math.max(Math.abs(dc) / (mid.c + 0.5), Math.abs(dr) / (mid.r + 0.5)), steps: Math.abs(dc) + Math.abs(dr), turn: (Math.atan2(dr, dc) + 2 * Math.PI) % (2 * Math.PI) };
}).sort((a, b) => a.reach - b.reach || a.steps - b.steps || a.turn - b.turn);
/** Your own tile's place, the nearest the middle, and the three places over it that hold its word, "Yours", in place of tiles. */
const [OWN] = places;
const WORD = places.filter((p) => p.dr === OWN.dr - 1 && Math.abs(p.dc - OWN.dc) <= 1);
/** The places tiles fill, in order: your own first. */
const order = places.filter((p) => !WORD.includes(p));

/** How many tiles land in each wave after your own: one, two at once, four, then more and more, the last wave every place left. */
const WAVE_SIZES = [1, 2, 4, 8, 16, 32] as const;
const WAVES = [...WAVE_SIZES, order.length - 1 - WAVE_SIZES.reduce((sum, n) => sum + n, 0)];
/** How many tiles are in the outline once each wave has landed: your own alone, then each wave more. */
const held = [1, ...WAVES.map((_, k) => 1 + WAVES.slice(0, k + 1).reduce((sum, n) => sum + n, 0))];

/** Where a place's tile sits on the stage, at the view's full width. */
const tileAt = (p: { dc: number; dr: number }): Point => ({ x: C.x + p.dc * POOL.pitch - POOL.tile / 2, y: C.y + p.dr * POOL.pitch - POOL.tile / 2 });

/** The outline round the first `count` tiles and your tile's word, as its width and height. */
const outlineFor = (count: number) => {
  const taken = [...order.slice(0, count), ...WORD];
  const cols = Math.max(...taken.map((p) => p.dc)) - Math.min(...taken.map((p) => p.dc)) + 1;
  const rows = Math.max(...taken.map((p) => p.dr)) - Math.min(...taken.map((p) => p.dr)) + 1;
  return { w: span(cols), h: span(rows) };
};

/**
 * Each stage of the view: the outline round the tiles held, how close the
 * view is (`--s` on the pool about its middle: as close as lets the outline
 * fit the full width and height, and never closer than CLOSEST), the
 * outline's own scale against its widest (`--ox`, `--oy`), and how far the
 * label sits below its place at the end (`y`), so it stays over the
 * outline's top edge. The last stage is the full view.
 */
export const STAGES = held.map((count) => {
  const outline = outlineFor(count);
  const s = round(Math.min(CLOSEST, FULL.w / outline.w, FULL.h / outline.h) * 1000) / 1000;
  const top = C.y - (outline.h / 2) * s;
  return { count, s, ox: round((outline.w / FULL.w) * 1000) / 1000, oy: round((outline.h / FULL.h) * 1000) / 1000, labelY: round(top - (C.y - FULL.h / 2)) };
});

/**
 * How far, in stage pixels on screen, a tile starts out from where it lands:
 * it comes in along its row from the side it lands on (a tile in the middle
 * column from the left above the middle, from the right below it), so
 * nothing comes in over the title or the story band.
 */
const FLIGHT = 420;
const sideOf = (p: { dc: number; dr: number }) => (p.dc !== 0 ? Math.sign(p.dc) : p.dr < 0 ? -1 : 1);

export const EVERYONE = {
  ...groupOf("everyone"),
  /** The pool: a part about the outline's middle that the view pulls back on (`--s`). */
  pool: { key: "everyone.pool", origin: C },
  outline: { key: "everyone.outline", at: box(C.x - FULL.w / 2, C.y - FULL.h / 2, FULL.w, FULL.h) as Box },
  /** Your own tile, in the middle: the use case you shared. */
  own: { key: "everyone.own", at: tileAt(OWN) },
  /** "Yours", over your own tile in the three places kept for it: in the pool, so it moves with the view, its type kept at label size as the view pulls back (sharing.css). */
  yours: { key: "everyone.yours", text: YOURS, at: box(tileAt(OWN).x - POOL.pitch, tileAt(OWN).y - POOL.pitch, 2 * POOL.pitch + POOL.tile, POOL.tile) as Box, places: WORD.length },
  /** Every other member's tile, in the order they land, each with the wave it lands in and where it starts from, as an offset along its row in the pool's own pixels at the scale of that wave. */
  tiles: order.slice(1).map((p, n) => {
    const wave = held.findIndex((count) => count > n + 1) - 1;
    return { key: `everyone.tile.${n}`, at: tileAt(p), wave, from: { x: round((sideOf(p) * FLIGHT) / STAGES[wave + 1].s), y: 0 } };
  }),
  waves: WAVES,
  /** "Your department", over the outline's top edge, centred on it: at its end place, carried down by `y` while the view is close. */
  label: { key: "everyone.label", text: DEPARTMENT, at: box(C.x - 200, C.y - FULL.h / 2 - LABEL_GAP - LABEL_LINE, 400, LABEL_LINE) },
};
