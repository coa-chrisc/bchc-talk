/**
 * Slides 15 to 17, under the two folders slide 14a left on top: the design
 * system's strip passing over three grey sketches (15), the shelf of tested
 * modules (16), and the source data read before an empty app fills from all
 * three (17). Every word is the script's.
 */
import { box, type Box } from "@/components/deck/kit";
import { shown } from "../../script/find";
import { DESIGN, FIELD } from "./layout";

export { DESIGN, SPECIMEN } from "./layout";
import { FOLDER_ROW } from "./layout-setup";

/* 15. The design system: its strip (layout.ts `DESIGN`) and the three sketches it passes over */

const DESIGN_WORDS = shown("design", "play");
const STRIP = DESIGN.at;
const SKETCH = { y: STRIP.y + STRIP.h + 76, w: 540, h: 260, gap: 54 } as const;
/** The three grey sketches, each named over it, and the coloured tool it becomes as the strip's band passes down it. */
export const TOOLS = (["form", "dashboard", "map"] as const).map((kind, i) => {
  const at = box(FIELD.left + i * (SKETCH.w + SKETCH.gap), SKETCH.y, SKETCH.w, SKETCH.h);
  return {
    kind,
    at,
    text: DESIGN_WORDS[3 + i],
    key: `design.tool.${i}`,
    greyKey: `design.grey.${i}`,
    brandKey: `design.brand.${i}`,
    bandKey: `design.band.${i}`,
    labelAt: { x: at.x, y: at.y - 46 },
  };
});
/** The strip's band, indigo over green, as tall as the strip's swatches are wide apart. */
export const BAND = { h: 16 } as const;

/* 16. The shelf of tested modules */

const MODULE_WORDS = shown("modules", "play");
const SHELF = {
  x: 420,
  top: FOLDER_ROW.bottom + 26,
  pitch: 52,
  tile: 34,
  step: 44,
} as const;
/** Six named rows, then two more in grey: there are more kinds than the six. */
const ROW_TILES = [16, 13, 9, 15, 7, 11, 14, 10] as const;
export const SHELF_ROWS = ROW_TILES.map((count, i) => {
  const top = SHELF.top + i * SHELF.pitch;
  return {
    key: `modules.row.${i}`,
    nameKey: `modules.name.${i}`,
    text: i < 6 ? MODULE_WORDS[i] : undefined,
    more: i >= 6,
    tiles: Array.from({ length: count }, (_, n) => box(SHELF.x + n * SHELF.step, top + 4, SHELF.tile, SHELF.tile)),
    rule: {
      x0: SHELF.x - 10,
      x1: SHELF.x + 18 * SHELF.step,
      y: top + SHELF.tile + 10,
    },
    nameAt: { x: FIELD.left, y: top + 1 },
  };
});
const SHELF_TOP = SHELF.top;
const SHELF_BOTTOM = SHELF_ROWS[SHELF_ROWS.length - 1].rule.y;
const BRACKET_X = SHELF.x + 18 * SHELF.step + 40;
const MID = (SHELF_TOP + SHELF_BOTTOM) / 2;
/** The total, set large beside a bracket that takes in the whole shelf. */
export const TOTAL = {
  key: "modules.total",
  bracketKey: "modules.bracket",
  text: MODULE_WORDS[6],
  lines: [MODULE_WORDS[6].slice(0, MODULE_WORDS[6].indexOf("tested")).trim(), MODULE_WORDS[6].slice(MODULE_WORDS[6].indexOf("tested"))],
  at: { x: BRACKET_X + 70, y: MID - 58 },
  bracket: `M${BRACKET_X - 20} ${SHELF_TOP}Q${BRACKET_X} ${SHELF_TOP} ${BRACKET_X} ${SHELF_TOP + 20}V${MID - 20}Q${BRACKET_X} ${MID} ${BRACKET_X + 20} ${MID}Q${BRACKET_X} ${MID} ${BRACKET_X} ${MID + 20}V${SHELF_BOTTOM - 20}Q${BRACKET_X} ${SHELF_BOTTOM} ${BRACKET_X - 20} ${SHELF_BOTTOM}`,
  frame: box(BRACKET_X - 24, SHELF_TOP - 4, 52, SHELF_BOTTOM - SHELF_TOP + 8),
};

/* 17. The source data, and the app built from all three */

const DATA_WORDS = shown("data", "play");
const TABLE = {
  x: FIELD.left,
  y: FOLDER_ROW.bottom + 92,
  cols: 4,
  rows: 4,
  colW: 170,
  rowH: 50,
} as const;
/** The table, named over it; each column's heading lights as an agent reads it. */
export const TABLE_LAYOUT = {
  key: "data.table",
  labelKey: "data.label",
  text: DATA_WORDS[0],
  labelAt: { x: TABLE.x, y: TABLE.y - 52 },
  at: box(TABLE.x, TABLE.y, TABLE.cols * TABLE.colW, (TABLE.rows + 1) * TABLE.rowH),
  heads: Array.from({ length: TABLE.cols }, (_, c) => ({
    key: `data.head.${c}`,
    at: box(TABLE.x + c * TABLE.colW, TABLE.y, TABLE.colW, TABLE.rowH),
  })),
  rowH: TABLE.rowH,
  colW: TABLE.colW,
  cols: TABLE.cols,
  rows: TABLE.rows,
  /** A navy bar in each cell; the headings' a little longer. */
  bars: Array.from({ length: TABLE.cols * (TABLE.rows + 1) }, (_, i) => {
    const c = i % TABLE.cols;
    const r = Math.floor(i / TABLE.cols);
    return box(TABLE.x + c * TABLE.colW + 22, TABLE.y + r * TABLE.rowH + 20, r === 0 ? 110 : [90, 64, 104, 76][(c + r) % 4], 10);
  }),
};
/** The agent that reads the table, under it, at each column in turn. */
export const READER = {
  key: "data.reader",
  r: 22,
  at: {
    x: TABLE.x + TABLE.colW / 2,
    y: TABLE.y + (TABLE.rows + 1) * TABLE.rowH + 56,
  },
  pitch: TABLE.colW,
};

const APP = box(1000, FOLDER_ROW.bottom + 28, FIELD.right - 1000, 430);
const HEADER_H = 60;
const TILE = { w: 112, h: 88, gap: 16, x: 1400 } as const;
const tileAt = (r: number, c: number): Box => box(TILE.x + c * (TILE.w + TILE.gap), APP.y + HEADER_H + 30 + r * (TILE.h + TILE.gap), TILE.w, TILE.h);
/** The two places new code fills: the bottom row's last two. */
const NEW_AT = [
  [2, 1],
  [2, 2],
] as const;
const isNew = (r: number, c: number) => NEW_AT.some(([nr, nc]) => nr === r && nc === c);
/** The app, empty until the table is read: then its header takes the design system's colours, the modules drop into place, and the table's columns become its fields. */
export const APP_LAYOUT = {
  key: "data.app",
  at: APP,
  headerKey: "data.app.header",
  header: box(APP.x, APP.y, APP.w, HEADER_H),
  pill: box(APP.x + APP.w - 150, APP.y + 16, 110, 28),
  titleBar: box(APP.x + 32, APP.y + 25, 220, 12),
  fieldsKey: "data.app.fields",
  fields: Array.from({ length: TABLE.cols }, (_, n) => ({
    label: box(APP.x + 40, APP.y + HEADER_H + 30 + n * 84, [96, 72, 110, 84][n], 10),
    field: box(APP.x + 40, APP.y + HEADER_H + 48 + n * 84, 300, 36),
  })),
  tilesKey: "data.app.tiles",
  tiles: [0, 1, 2].flatMap((r) => [0, 1, 2].filter((c) => !isNew(r, c)).map((c) => tileAt(r, c))),
  newKey: "data.app.new",
  newTiles: NEW_AT.map(([r, c]) => tileAt(r, c)),
  newLabelKey: "data.app.new.label",
  newText: DATA_WORDS[1],
};
const lastNew = APP_LAYOUT.newTiles[APP_LAYOUT.newTiles.length - 1];
export const NEW_LABEL_AT = {
  x: APP_LAYOUT.newTiles[0].x,
  y: lastNew.y + lastNew.h + 8,
  w: lastNew.x + lastNew.w - APP_LAYOUT.newTiles[0].x,
};

export const LIBRARY_KEYS = {
  design: [DESIGN.key, DESIGN.labelKey, ...TOOLS.flatMap((tool) => [tool.key, tool.greyKey, tool.brandKey, tool.bandKey])],
  modules: [TOTAL.key, TOTAL.bracketKey, ...SHELF_ROWS.flatMap((row) => (row.text ? [row.key, row.nameKey] : [row.key]))],
  data: [
    TABLE_LAYOUT.key,
    TABLE_LAYOUT.labelKey,
    READER.key,
    APP_LAYOUT.key,
    APP_LAYOUT.headerKey,
    APP_LAYOUT.fieldsKey,
    APP_LAYOUT.tilesKey,
    APP_LAYOUT.newKey,
    APP_LAYOUT.newLabelKey,
    ...TABLE_LAYOUT.heads.map((head) => head.key),
  ],
};
