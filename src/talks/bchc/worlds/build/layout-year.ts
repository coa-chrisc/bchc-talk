/**
 * Slide 22a: the year. The board shrinks into one block of a year of work
 * laid out left to right; the year comes in round it, sprint by sprint out
 * from that block, and a tall outline stands across every row at this
 * week's sprint, named "This week" under it. Each sprint is a solid block
 * with a gap before the next: green and solid once done, green and filling
 * while built (a navy dot riding its front), grey while only planned.
 * Release markers run along the top, the last one well inside the stage,
 * and the slide ends on the release a person approves, the products rising
 * off it to settle beside it, clear of the story above and the markers
 * below. Every word is the script's.
 */
import { box, type Box } from "@/components/deck/kit";
import { shown } from "../../script/find";
import { FIELD, topOf } from "./layout";
import { LAYER } from "./layout-board";

const [WEEK_TEXT, SPRINT_TEXT, RELEASE_TEXT, RELEASED_TEXT, ...PRODUCT_TEXTS] = shown("scale", "play");

/** 24 sprints across the field, 70 apart with a 10 px gap; eight epics down, 26 apart. */
export const YEAR = {
  x: FIELD.left,
  sprints: 24,
  pitch: 70,
  block: 60,
  h: 18,
  top: topOf("scale") + 220,
  rowPitch: 26,
} as const;
const sprintX = (s: number) => YEAR.x + s * YEAR.pitch;
const rowY = (r: number) => YEAR.top + r * YEAR.rowPitch;

/** Each epic's first and last sprint. */
const EPIC_SPANS: readonly (readonly [number, number])[] = [
  [0, 9],
  [2, 13],
  [4, 11],
  [6, 19],
  [10, 17],
  [12, 23],
  [14, 21],
  [16, 23],
];
/** The sprints being built during the click: the two before the release finish, the one after it starts. */
export const NOW = { finishing: [10, 11], starting: 12 } as const;
/** Where the release falls: at the end of the twelfth sprint. */
export const RELEASE_AT = 11;

export type YearBlock = Box & { row: number; sprint: number };
const blocksOf = (s: number): YearBlock[] => EPIC_SPANS.flatMap(([first, last], row) => (s >= first && s <= last ? [{ ...box(sprintX(s), rowY(row), YEAR.block, YEAR.h), row, sprint: s }] : []));
/** The year, a column per sprint, each the blocks of the epics running in it. */
export const COLUMNS = Array.from({ length: YEAR.sprints }, (_, s) => ({
  key: `year.col.${s}`,
  sprint: s,
  blocks: blocksOf(s),
  state: s < NOW.finishing[0] ? ("done" as const) : s <= NOW.starting ? ("built" as const) : ("planned" as const),
}));
export const fillKey = (s: number) => `year.fill.${s}`;
export const dotKey = (s: number) => `year.dots.${s}`;
/** The order the year comes in: out from this week's sprint, nearest first. */
export const REVEAL = [...COLUMNS].sort((a, b) => Math.abs(a.sprint - RELEASE_AT) - Math.abs(b.sprint - RELEASE_AT) || a.sprint - b.sprint);
/** How much of the starting sprint is built when the click ends. */
export const STARTED = 0.45;

/** This week: one block of the year, the board shrunk into it; a tall outline round its sprint across every row, named under it. */
const WEEK_BLOCK = blocksOf(RELEASE_AT).find((b) => b.row === 1)!;
const LAST_ROW_BOTTOM = rowY(EPIC_SPANS.length - 1) + YEAR.h;
const COLUMN_PAD = 4;
export const THIS_WEEK = {
  key: "year.week",
  block: WEEK_BLOCK,
  outline: box(WEEK_BLOCK.x - COLUMN_PAD, YEAR.top - COLUMN_PAD - 2, WEEK_BLOCK.w + 2 * COLUMN_PAD, LAST_ROW_BOTTOM - YEAR.top + 2 * COLUMN_PAD + 4),
  text: WEEK_TEXT,
  /** The name, 26 px, centred under the outline. */
  at: { x: WEEK_BLOCK.x + WEEK_BLOCK.w / 2 - 100, y: LAST_ROW_BOTTOM + COLUMN_PAD + 2 + 10, w: 200 },
};
/** The board's move from the corner into the block: its top left on the block's, scaled to its width. */
export const INTO_WEEK = {
  x: WEEK_BLOCK.x - LAYER.x,
  y: WEEK_BLOCK.y - LAYER.y,
  scale: WEEK_BLOCK.w / LAYER.w,
};

/** The project row over the year, filling to the release. */
export const YEAR_ROW = {
  key: "year.row",
  fillKey: "year.row.fill",
  at: box(YEAR.x, YEAR.top - 28, YEAR.sprints * YEAR.pitch - (YEAR.pitch - YEAR.block), 12),
};
const RELEASE_X = (s: number) => sprintX(s + 1) - (YEAR.pitch - YEAR.block) / 2;
/** How far the row has come: to the start of the sprints being built, then to the release. */
export const ROW_FILL = {
  from: (sprintX(NOW.finishing[0]) - YEAR.x) / YEAR_ROW.at.w,
  to: (RELEASE_X(RELEASE_AT) - YEAR.x) / YEAR_ROW.at.w,
};
/** A release marker at the end of every sixth sprint, over the row. */
export const MARKERS = {
  key: "year.markers",
  y: YEAR_ROW.at.y - 24,
  at: [5, 11, 17, 23].map((s) => RELEASE_X(s)),
  r: 9,
};
/** Every check passed: a tick over each sprint up to the release, on the row. */
export const CHECKS = {
  key: "year.checks",
  at: Array.from({ length: RELEASE_AT + 1 }, (_, s) => ({
    x: sprintX(s) + YEAR.block / 2,
    y: YEAR_ROW.at.y + YEAR_ROW.at.h / 2,
  })),
};

/** The release: a person approves at its marker, and it is released. */
const MARK = { x: RELEASE_X(RELEASE_AT), y: MARKERS.y };
export const RELEASE = {
  markKey: "year.release.mark",
  mark: MARK,
  personKey: "year.release.person",
  person: box(MARK.x - 70, MARK.y - 36, 36, 52),
  releasedKey: "year.released",
  released: RELEASED_TEXT,
  releasedAt: { x: MARK.x + 36, y: MARK.y - 20 },
};
/**
 * The products: a row up and to the right of the release, past "Released",
 * each named under it, with air above (the story band) and below (the
 * markers). Each rises off the release marker to its place.
 */
const PRODUCT = { w: 96, h: 56, y: topOf("scale") + 28, pitch: 190, first: MARK.x + 300 } as const;
export const PRODUCTS = PRODUCT_TEXTS.map((text, i) => {
  const cx = PRODUCT.first + i * PRODUCT.pitch;
  return {
    key: `year.product.${i}`,
    text,
    kind: (["app", "pipeline", "dashboard"] as const)[i],
    icon: box(cx - PRODUCT.w / 2, PRODUCT.y, PRODUCT.w, PRODUCT.h),
    labelAt: { x: cx - 100, y: PRODUCT.y + PRODUCT.h + 4, w: 200 },
    /** Where it starts, from its place: on the release marker. */
    rise: { x: MARK.x - cx, y: MARK.y - (PRODUCT.y + PRODUCT.h / 2) },
  };
});

/** The legend under the year, on the line "This week" is named on: a sprint's block, and a release marker. */
const LEGEND_Y = THIS_WEEK.at.y;
export const LEGEND = {
  key: "year.legend",
  y: LEGEND_Y,
  sprint: {
    block: box(FIELD.left, LEGEND_Y + 7, 40, 18),
    text: SPRINT_TEXT,
    at: { x: FIELD.left + 54, y: LEGEND_Y },
  },
  release: {
    marker: { x: FIELD.left + 190, y: LEGEND_Y + 16 },
    text: RELEASE_TEXT,
    at: { x: FIELD.left + 212, y: LEGEND_Y },
  },
};
export const YEAR_KEYS = [
  THIS_WEEK.key,
  YEAR_ROW.key,
  MARKERS.key,
  CHECKS.key,
  RELEASE.markKey,
  RELEASE.personKey,
  RELEASE.releasedKey,
  LEGEND.key,
  ...COLUMNS.map((c) => c.key),
  ...PRODUCTS.map((p) => p.key),
];
