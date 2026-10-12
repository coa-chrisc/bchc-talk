/**
 * Where Part 3's pictures go: the titles every slide shares, then slide 14
 * (the three steps) and slide 18 (the week). Plain numbers in stage pixels
 * and the ids the steps' moves name. Every word comes from the script
 * (`shown`, `pictureOf`), never typed here.
 */
import { CONTENT_TOP, box, type Hue, type StoryBand } from "@/components/deck/kit";
import { breakAfter, pictureOf, shown } from "../../script/find";

/* Titles */

export const TITLE = { x: 96, y: 152 } as const;
export const titleKey = (pictureId: string) => `title.${pictureId}`;
/** The pictures whose On screen line is set as a title, in the script's order. */
export const TITLED = ["rad", "week", "setup", "design", "modules", "data", "split", "tested", "reviewed", "memory", "scale", "process"] as const;
/** The titles that run past the field at 72 px, set on two lines broken after the word given; their story bands and pictures sit under both. */
const BREAKS: Partial<Record<(typeof TITLED)[number], string[]>> = {
  rad: ["dashboards"],
  week: ["Monday"],
  setup: ["agents"],
  split: ["epics,"],
  tested: ["screen"],
  memory: ["learn,"],
  scale: ["tool"],
  process: ["process."],
};
export const TITLES = TITLED.map((id) => ({
  key: titleKey(id),
  lines: breakAfter(pictureOf(id).show, ...(BREAKS[id] ?? [])),
  size: "title" as const,
}));
/** A picture's story band: under its title's one line or two. */
export const bandOf = (pictureId: string): Exclude<StoryBand, "foot"> => ((BREAKS as Record<string, string[] | undefined>)[pictureId] ? "two" : "one");
/** Where a picture's drawing may start: under its title and its story band. */
export const topOf = (pictureId: string) => CONTENT_TOP[bandOf(pictureId)];

/** The field every picture is drawn in: the safe edges, and the lowest a drawing reaches, 40 px clear of the footer. */
export const FIELD = { left: 96, right: 1824, floor: 994 } as const;

/* 15 to 17: the row the folders slide 14a keeps sit in, and the design system's strip under it. Other worlds read `DESIGN`, so it is here. */

/** The folders' row: under the story band, a folder high. */
export const FOLDER_ROW_AT = { y: topOf("design") + 12, h: 50 } as const;

const DESIGN_WORDS = shown("design", "play");
const STRIP = box(FIELD.left, FOLDER_ROW_AT.y + FOLDER_ROW_AT.h + 22, FIELD.right - FIELD.left, 100);
const GROUP_X = [128, 700, 1272] as const;
const BAND_Y = STRIP.y + 26;
/**
 * The strip: swatches, type and buttons, each named in the script's
 * words. The swatches are the department's indigo and green, then navy and
 * the raised grey. Other worlds read `swatches`' hues.
 */
export const DESIGN = {
  key: "design.strip",
  at: STRIP,
  labelKey: "design.labels",
  labels: DESIGN_WORDS.slice(0, 3).map((text, i) => ({
    text,
    x: GROUP_X[i] + [252, 190, 344][i],
    y: BAND_Y + 6,
  })),
  swatches: ([["catalog"], ["process"], [undefined, "paper"], [undefined, "raised"]] as const).map(([hue, tone], i) => ({
    at: box(GROUP_X[0] + i * 60, BAND_Y, 48, 48),
    hue: hue as Hue | undefined,
    tone: (tone ?? "hue") as "hue" | "paper" | "raised",
  })),
  /** "Aa" at 56, 40 and 32, on one baseline. */
  type: [
    { size: 56, x: GROUP_X[1] },
    { size: 40, x: GROUP_X[1] + 76 },
    { size: 32, x: GROUP_X[1] + 128 },
  ],
  baseline: BAND_Y + 46,
  /** Three buttons, each 96 by 40: filled green, outlined, filled navy. */
  components: [box(GROUP_X[2], BAND_Y + 4, 96, 40), box(GROUP_X[2] + 112, BAND_Y + 4, 96, 40), box(GROUP_X[2] + 224, BAND_Y + 4, 96, 40)],
};
/** The type sample's letters: a specimen, not a word, so it is not in the script's words. */
export const SPECIMEN = "Aa";

/* 14. The three steps */

/** Where each step's name breaks: the author's, so a fallback face never decides a break. */
const STEP_BREAKS: readonly (readonly string[])[] = [["decide"], ["build"], ["approves"]];
const STEP = { y: topOf("rad") + 28, w: 496, h: 400, gap: 120 } as const;
const stepAt = (i: number) => box(FIELD.left + i * (STEP.w + STEP.gap), STEP.y, STEP.w, STEP.h);

/**
 * The three steps, in a row. The middle one is the agents' (`agent`), in the
 * process colour; people do the first and the last (`human`), and the last
 * carries the person-approves mark. Slides in other worlds read `boxes`,
 * `agent` and `human`, so they keep their shape.
 */
export const RAD = {
  boxKey: "rad.box",
  linkKey: "rad.link",
  nameKey: (i: number) => `rad.name.${i}`,
  artKey: (i: number) => `rad.art.${i}`,
  cellsKey: "rad.cells",
  builderKey: "rad.builder",
  testerKey: "rad.tester",
  /** The two agents' rings, which fill in the process colour as they start work. */
  glyphKeys: ["rad.builder.ring", "rad.tester.ring"] as const,
  markKey: "rad.mark",
  boxes: shown("rad", "play").map((text, i) => ({
    at: stepAt(i),
    lines: breakAfter(text, ...STEP_BREAKS[i]),
  })),
  agent: [1] as const,
  human: [0, 2] as const,
};
/** Inside each step: its name at the top, its drawing under it. */
const ART_Y = STEP.y + 190;
const [DECIDE, BUILD, APPROVE] = RAD.boxes.map((entry) => entry.at);
/** Step one: three people at a list of what to build. */
export const DECIDE_ART = {
  people: [0, 1, 2].map((n) => box(DECIDE.x + 48 + n * 76, ART_Y + 40, 60, 80)),
  sheet: box(DECIDE.x + 300, ART_Y, 148, 168),
  lines: [0, 1, 2, 3].map((n) => ({
    x0: DECIDE.x + 324,
    x1: DECIDE.x + 324 + [96, 80, 100, 64][n],
    y: ART_Y + 36 + n * 32,
  })),
};
/** Step two: two agents, the deck's plain agent glyph, one riding the front of four cells as they fill, the other a cell behind. */
const CELL = { w: 92, h: 44, gap: 12 } as const;
export const BUILD_ART = {
  cells: [0, 1, 2, 3].map((n) => box(BUILD.x + 32 + n * (CELL.w + CELL.gap), ART_Y + 96, CELL.w, CELL.h)),
  agentY: ART_Y + 50,
  r: 18,
};
/** Step three: a person, the release they approve, and the mark. */
export const APPROVE_ART = {
  person: box(APPROVE.x + 64, ART_Y + 40, 60, 80),
  mark: { x: APPROVE.x + 196, y: ART_Y + 80 },
  release: box(APPROVE.x + 268, ART_Y + 8, 180, 140),
};
/** The arrows from one step to the next, across the gaps. */
export const RAD_LINKS = RAD.boxes.slice(1).map((_, i) => ({
  from: { x: stepAt(i).x + STEP.w + 16, y: STEP.y + STEP.h / 2 },
  to: { x: stepAt(i + 1).x - 16, y: STEP.y + STEP.h / 2 },
}));
export const RAD_KEYS = [RAD.boxKey, RAD.linkKey, RAD.cellsKey, RAD.builderKey, RAD.testerKey, RAD.markKey, ...RAD.boxes.flatMap((_, i) => [RAD.nameKey(i), RAD.artKey(i)])];

/* 18. The week: a desk calendar over one app sketch that fills in a little more each day */

const WEEK_WORDS = shown("week", "play");
const PAGE = { y: topOf("week") + 20, w: 316, h: 84, gap: 37 } as const;
/** The calendar's five pages, Monday to Friday, each with its day's name. */
export const DAYS = WEEK_WORDS.slice(0, 5).map((name, i) => ({
  name,
  at: box(FIELD.left + i * (PAGE.w + PAGE.gap), PAGE.y, PAGE.w, PAGE.h),
}));
/** The calendar's pages, each a desk calendar's page with a navy band across its top and two rings through it; the day's page, marked by a navy frame that moves along the week. */
export const CALENDAR = {
  key: "week.calendar",
  todayKey: "week.today",
  pitch: PAGE.w + PAGE.gap,
  today: DAYS[0].at,
  /** The band's height, and how far the rings stand above the page. */
  band: 16,
  ring: 12,
};

/** The app sketch under the calendar, named over its top left on Friday, and what each day adds to it. */
const APP_BOX = box(560, PAGE.y + PAGE.h + 76, 800, 276);
const SIDE = 160;
const MAIN_X = APP_BOX.x + SIDE + 24;
const CARD = { y: APP_BOX.y + 56, w: 176, h: 84, gap: 32 } as const;
export const SKETCH = {
  at: APP_BOX,
  key: "week.sketch",
  barY: APP_BOX.y + 36,
  sideX: APP_BOX.x + SIDE,
  nav: [0, 1, 2].map((n) => ({
    x0: APP_BOX.x + 24,
    x1: APP_BOX.x + 24 + [96, 80, 88][n],
    y: APP_BOX.y + 68 + n * 30,
  })),
  cards: [0, 1, 2].map((n) => box(MAIN_X + n * (CARD.w + CARD.gap), CARD.y, CARD.w, CARD.h)),
  chart: box(MAIN_X, CARD.y + CARD.h + 20, 3 * CARD.w + 2 * CARD.gap, APP_BOX.y + APP_BOX.h - 20 - (CARD.y + CARD.h + 20)),
  button: box(APP_BOX.x + 24, APP_BOX.y + APP_BOX.h - 60, 112, 36),
};
/** The blocks the plan draws and the build fills: the three cards and the chart. */
export const SKETCH_BLOCKS = [...SKETCH.cards, SKETCH.chart];
/** The chart's bars, heights in fractions of the chart. */
export const SKETCH_BARS = [0.45, 0.7, 0.55, 0.85, 0.6, 0.75].map((k, n) => {
  const w = 48;
  const pitch = (SKETCH.chart.w - 48) / 6;
  const h = (SKETCH.chart.h - 28) * k;
  return box(SKETCH.chart.x + 24 + n * pitch + (pitch - w) / 2, SKETCH.chart.y + SKETCH.chart.h - 14 - h, w, h);
});
/** Monday: the meeting's notes, under Monday's page and beside the blank outline, named on the line "Working prototype" is named on. */
const NOTES_AT = box(DAYS[0].at.x + (DAYS[0].at.w - 200) / 2, APP_BOX.y, 200, 220);
export const NOTES = {
  key: "week.notes",
  at: NOTES_AT,
  lines: [0, 1, 2, 3, 4].map((n) => ({
    x0: NOTES_AT.x + 24,
    x1: NOTES_AT.x + 24 + [140, 120, 150, 96, 128][n],
    y: NOTES_AT.y + 44 + n * 34,
  })),
  labelKey: "week.notes.label",
  text: WEEK_WORDS[6],
  labelAt: { x: NOTES_AT.x, y: APP_BOX.y - 56 },
};
/** Tuesday: the people who need the tool, named beside them, and the mark one makes on the plan. */
const CHECKER_AT = box(1424, APP_BOX.y + 24, 60, 80);
export const CHECKER = {
  key: "week.person",
  at: CHECKER_AT,
  labelKey: "week.person.label",
  lines: breakAfter(WEEK_WORDS[7], "who"),
  /** Two 32 px lines, centred on the person. */
  labelAt: { x: CHECKER_AT.x + CHECKER_AT.w + 16, y: CHECKER_AT.y + CHECKER_AT.h / 2 - 38 },
  markKey: "week.markup",
  mark: {
    cx: SKETCH.cards[1].x + SKETCH.cards[1].w / 2,
    cy: SKETCH.cards[1].y + SKETCH.cards[1].h / 2,
    rx: 112,
    ry: 62,
  },
};
/** Friday: a cursor clicks the sketch's button, and the sketch is named. */
export const CURSOR = {
  key: "week.cursor",
  tip: { x: SKETCH.button.x + 76, y: SKETCH.button.y + 24 },
  from: { x: 1500 - (SKETCH.button.x + 76), y: 40 },
};
export const PROTOTYPE = {
  key: "week.prototype",
  text: WEEK_WORDS[5],
  at: { x: APP_BOX.x, y: APP_BOX.y - 56 },
};
export const WEEK = {
  planKey: "week.plan",
  buildKey: "week.build",
  testKey: "week.tests",
  dayKey: (i: number) => `week.day.${i}`,
};
export const WEEK_KEYS = [
  CALENDAR.key,
  CALENDAR.todayKey,
  SKETCH.key,
  NOTES.key,
  NOTES.labelKey,
  CHECKER.key,
  CHECKER.labelKey,
  CHECKER.markKey,
  CURSOR.key,
  PROTOTYPE.key,
  WEEK.planKey,
  WEEK.buildKey,
  WEEK.testKey,
  ...DAYS.map((_, i) => WEEK.dayKey(i)),
];
