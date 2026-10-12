/**
 * Slide 19's board, the agent film's schedule: a project row on top, eight
 * workstreams of different lengths under it (the epics), four sprints across,
 * and the cells each piece of work fills. The board is a layer of its own
 * (`LAYER`) so slides 20 to 22a can carry it small to the corner (`MINI`)
 * and into the year by transform alone. The words round it are the
 * script's: the plan's on the first click, the work's on the second.
 */
import { box, type Box, type Point } from "@/components/deck/kit";
import { shown } from "../../script/find";
import type { Kind } from "./kinds";
import { FIELD, topOf } from "./layout";

const [LEADS_TEXT, EPICS_TEXT, SPRINTS_TEXT, FIRST_TEXT, PROJECT_TEXT] = shown("split", "plan");
const [WAVES_TEXT, BUILDER_TEXT, TESTER_TEXT, REVIEWER_TEXT, FIXER_TEXT] = shown("split", "work");

/** The board's layer on the stage: everything that shrinks with it, a clear gap under the story band. */
export const LAYER = box(540, topOf("split") + 24, FIELD.right - 540, FIELD.floor - (topOf("split") + 24));
export const BOARD_KEY = "board";

/** The grid: 16 cells across in four sprints of four, 71 apart; eight rows 42 apart. */
export const GRID = {
  x: 560,
  slot: 71,
  cell: 62,
  h: 30,
  top: LAYER.y + 56,
  pitch: 42,
  slots: 16,
  sprint: 4,
} as const;
const slotX = (slot: number) => GRID.x + slot * GRID.slot;
const rowY = (row: number) => GRID.top + row * GRID.pitch;
export const GRID_RIGHT = slotX(GRID.slots - 1) + GRID.cell;
export const GRID_BOTTOM = rowY(7) + GRID.h;

/** The project row the plan splits from, and fills as the work passes; named in the margin at its left end, right-aligned with "Epics" under it, a short line on to the row. */
const PROJECT_AT = box(GRID.x, LAYER.y + 16, GRID_RIGHT - GRID.x, 14);
const PROJECT_LABEL_W = 140;
export const PROJECT = {
  key: "board.project",
  fillKey: "board.project.fill",
  at: PROJECT_AT,
  labelKey: "board.project.label",
  text: PROJECT_TEXT,
  /** A 26 px name, centred on the row. */
  labelAt: { x: GRID.x - 40 - PROJECT_LABEL_W, y: PROJECT_AT.y + PROJECT_AT.h / 2 - 16, w: PROJECT_LABEL_W },
  leader: { x0: GRID.x - 32, x1: GRID.x - 8, y: PROJECT_AT.y + PROJECT_AT.h / 2 },
};

/** Each workstream's first and last slot: eight of different lengths, as the film draws them. */
const SPANS: readonly (readonly [number, number])[] = [
  [0, 6],
  [0, 8],
  [2, 9],
  [3, 15],
  [0, 5],
  [1, 12],
  [0, 6],
  [8, 15],
];
export type CellAt = Box & { row: number; slot: number };
export const ROWS = SPANS.map(([first, last], row) => ({
  key: `board.row.${row}`,
  first,
  last,
  y: rowY(row),
  cells: Array.from(
    { length: last - first + 1 },
    (_, n): CellAt => ({
      ...box(slotX(first + n), rowY(row), GRID.cell, GRID.h),
      row,
      slot: first + n,
    }),
  ),
}));
export const CELLS = ROWS.flatMap((row) => row.cells);
/** How far each row starts above its place: in the project row, which it splits from. */
export const SPLIT_FROM = (row: number) => PROJECT.at.y - rowY(row);

/** The sprints' edges, between each sprint and the next. */
export const SPRINT_EDGES = {
  key: "board.sprints",
  x: [1, 2, 3].map((k) => slotX(k * GRID.sprint) - (GRID.slot - GRID.cell) / 2),
  y0: GRID.top - 12,
  y1: GRID_BOTTOM + 8,
};

/* The work: three waves, one a sprint; the third is under way when the click ends. */

/** The slot the work has reached: cells before it are built, this one is under way. */
export const FRONT = 9;
/** How much of the front cell is built at the end. */
export const FRONT_FILL = 0.6;
export const WAVES = [0, 1, 2] as const;
/** The cells of a row a wave builds whole: its sprint's, short of the front. */
export const waveCells = (row: number, wave: number) => ROWS[row].cells.filter((cell) => cell.slot >= wave * GRID.sprint && cell.slot < (wave + 1) * GRID.sprint && cell.slot < FRONT);
export const fillKey = (row: number, wave: number) => `board.fill.${row}.${wave}`;
/** The cells at the front, a part each, built part way when slide 19 ends. */
export const frontKey = (row: number) => `board.front.${row}`;
export const FRONT_CELLS = CELLS.filter((cell) => cell.slot === FRONT);
/** Slide 22's waves, on the board in the corner: the rest of the third sprint, then the fourth in two. */
export const LATE = [
  [10, 11],
  [12, 13],
  [14, 15],
] as const;
export const lateKey = (n: number) => `board.late.${n}`;
export const lateCells = (n: number) => CELLS.filter((cell) => cell.slot >= LATE[n][0] && cell.slot <= LATE[n][1]);
/** The part a cell's fill belongs to: its row's wave, the front, or one of slide 22's waves. */
export const cellKeyOf = (cell: CellAt) =>
  cell.slot < FRONT ? fillKey(cell.row, Math.floor(cell.slot / GRID.sprint)) : cell.slot === FRONT ? frontKey(cell.row) : lateKey(LATE.findIndex(([a, b]) => cell.slot >= a && cell.slot <= b));
/** The cells that pass during the click: every built cell before the third sprint. */
export const PASSED = CELLS.filter((cell) => cell.slot < 2 * GRID.sprint);
/** The test that fails and the fixer repairs: the fifth row's last cell, in the second sprint. */
export const FAILED = ROWS[4].cells[ROWS[4].cells.length - 1];
export const FAILED_KEY = {
  cross: "board.failed",
  tick: "board.fixed.tick",
} as const;
export const tickKey = (wave: number) => `board.ticks.${wave}`;
/** Where a cell's passed tick sits: in its top right corner, inside the cell, so it stays clear of the next cell and the wave's outline. */
export const tickAt = (cell: Box): Point => ({
  x: cell.x + cell.w - 11,
  y: cell.y + 3,
});

/** An agent's place on a cell: on its middle; a builder rides the front of the fill. */
export const AGENT_R = 11;
export const onCell = (cell: Box): Point => ({
  x: cell.x + cell.w / 2,
  y: cell.y + cell.h / 2,
});
/** Where a tester, reviewer or fixer stands on a cell: left of middle, clear of the cell's tick. */
export const checkAt = (cell: Box): Point => ({
  x: cell.x + 24,
  y: cell.y + cell.h / 2,
});
export const frontOf = (cell: Box, k: number): Point => ({
  x: cell.x + Math.max(AGENT_R + 2, cell.w * k - AGENT_R - 2),
  y: cell.y + cell.h / 2,
});

/** One builder a row, riding the front from the row's first cell; it leaves when its row's last cell is built. */
export const BUILDERS = ROWS.map((row, r) => {
  const first = row.cells[0];
  const reaches = row.last <= FRONT ? row.cells[row.cells.length - 1] : row.cells.find((cell) => cell.slot === FRONT)!;
  const stays = row.last >= FRONT;
  return {
    key: `board.builder.${r}`,
    row: r,
    at: frontOf(first, 0),
    stays,
    reaches,
  };
});

type Crew = { key: string; kind: Kind; cell: CellAt };
const on = (kind: Kind, row: number, slot: number): Crew => ({
  key: `board.${kind}.${row}`,
  kind,
  cell: ROWS[row].cells.find((cell) => cell.slot === slot)!,
});
/** The agents that check the work in the third wave, each on the cell it has: testers on the cell just built, reviewers on the one before. */
export const CHECKERS: Crew[] = [
  on("reviewer", 0, 6),
  on("tester", 1, 8),
  on("reviewer", 1, 7),
  on("tester", 2, 8),
  on("reviewer", 2, 7),
  on("tester", 3, 8),
  on("reviewer", 3, 7),
  on("tester", 5, 8),
  on("reviewer", 5, 7),
  on("tester", 7, 8),
];
/** The fixer, on the failed cell. */
export const FIXER = { key: "board.fixer", cell: FAILED };

/** The lead agents, gold agent rings by the project row. */
export const LEADS = {
  key: "board.leads",
  r: 16,
  at: [118, 160, 202].map((x) => ({ x, y: PROJECT.at.y + PROJECT.at.h / 2 })),
};

/**
 * The lead agents are named on the plan's click, beside them. On the work's,
 * the first agent of each kind carries its name: the reviewer, tester and
 * builder in a column clear of the grid, right of the wave, each on its own
 * row's empty end with a thin line back to its agent; the fixer beside it,
 * where its row is empty.
 */
const NAME_X = slotX(3 * GRID.sprint) + 30;
/** A 26 px name, centred on its row. */
const nameY = (cell: Box) => cell.y + cell.h / 2 - 16;
const named = (kind: Kind, text: string, cell: Box) => ({
  kind,
  text,
  at: { x: NAME_X, y: nameY(cell) },
  leader: { x0: cell.x + cell.w + 8, x1: NAME_X - 12, y: cell.y + cell.h / 2 },
});
export const NAMES = {
  key: "board.names",
  leadKey: "board.names.lead",
  lead: {
    text: LEADS_TEXT,
    at: { x: LEADS.at[2].x + LEADS.r + 18, y: PROJECT.at.y + PROJECT.at.h / 2 - 16 },
  },
  kinds: [
    named("builder", BUILDER_TEXT, BUILDERS[2].reaches),
    named("tester", TESTER_TEXT, on("tester", 1, 8).cell),
    named("reviewer", REVIEWER_TEXT, on("reviewer", 0, 6).cell),
  ],
  fixer: {
    kind: "fixer" as const,
    text: FIXER_TEXT,
    at: { x: FAILED.x + FAILED.w + 18, y: nameY(FAILED) },
  },
};

/* The plan's words */

/** "Epics": a bracket down the rows' left, the words beside it. */
export const EPICS = {
  key: "board.epics",
  text: EPICS_TEXT,
  bracket: `M${GRID.x - 12} ${GRID.top}H${GRID.x - 24}V${GRID_BOTTOM}H${GRID.x - 12}`,
  at: {
    x: FIELD.left,
    y: (GRID.top + GRID_BOTTOM) / 2 - 16,
    w: GRID.x - 40 - FIELD.left,
  },
};
/** "Sprints": a bracket under the first sprint, the words under it. */
const SPRINT_W = GRID.sprint * GRID.slot - (GRID.slot - GRID.cell);
export const SPRINTS = {
  key: "board.sprint.label",
  text: SPRINTS_TEXT,
  bracket: `M${GRID.x} ${GRID_BOTTOM + 10}V${GRID_BOTTOM + 18}H${GRID.x + SPRINT_W}V${GRID_BOTTOM + 10}`,
  at: { x: GRID.x, y: GRID_BOTTOM + 24 },
};
/** What has to finish first: the seventh row before the eighth starts, an S between them, named in the eighth row's empty start. */
const DEP_FROM = ROWS[6].cells[ROWS[6].cells.length - 1];
const DEP_TO = ROWS[7].cells[0];
const depStart = { x: DEP_FROM.x + DEP_FROM.w, y: DEP_FROM.y + DEP_FROM.h / 2 };
const depEnd = { x: DEP_TO.x - 6, y: DEP_TO.y + DEP_TO.h / 2 };
const depMid = (depStart.x + depEnd.x) / 2;
export const FIRST = {
  key: "board.first",
  lineKey: "board.first.line",
  text: FIRST_TEXT,
  d: `M${depStart.x} ${depStart.y}C${depMid} ${depStart.y} ${depMid} ${depEnd.y} ${depEnd.x} ${depEnd.y}`,
  head: depEnd,
  at: { x: GRID.x, y: DEP_TO.y - 1, w: DEP_FROM.x + DEP_FROM.w - 30 - GRID.x },
};
/** A person approves the plan: by the project row's far end. */
export const PLAN_APPROVAL = {
  key: "board.approval",
  person: box(GRID_RIGHT + 30, LAYER.y + 2, 40, 54),
  mark: { x: GRID_RIGHT + 30 + 40 + 36, y: LAYER.y + 26 },
};

/** "Waves": the third wave's sprint outlined from the first row with cells in it, named under it. */
const WAVE_X = slotX(2 * GRID.sprint) - 6;
const WAVE_TOP = rowY(1) - 8;
export const WAVE = {
  key: "board.wave",
  at: box(WAVE_X, WAVE_TOP, SPRINT_W + 12, GRID_BOTTOM + 8 - WAVE_TOP),
  text: WAVES_TEXT,
  textAt: { x: WAVE_X + (SPRINT_W + 12) / 2, y: GRID_BOTTOM + 24 },
};

/* Slides 20 to 22: the board small in the corner, with the piece in view marked */

/** The board's scale and place when small: its top left at the field's corner under the story band. */
export const MINI = {
  s: 0.3,
  at: { x: FIELD.left, y: topOf("tested") + 20 },
} as const;
export const MINI_MOVE = {
  x: MINI.at.x - LAYER.x,
  y: MINI.at.y - LAYER.y,
  scale: MINI.s,
};
/** A box on the board, where it shows when the board is small. */
export const onMini = (b: Box): Box => box(MINI.at.x + (b.x - LAYER.x) * MINI.s, MINI.at.y + (b.y - LAYER.y) * MINI.s, b.w * MINI.s, b.h * MINI.s);
export const MINI_BOX = onMini(LAYER);

/** The words and marks round the board that do not go small with it. */
export const PLAN_KEYS = [PROJECT.labelKey, EPICS.key, SPRINTS.key, FIRST.key, PLAN_APPROVAL.key, NAMES.key, NAMES.leadKey, WAVE.key, LEADS.key];
