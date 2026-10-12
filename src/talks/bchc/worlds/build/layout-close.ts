/**
 * Slides 20 to 22 in close: the board small in the corner (layout-board.ts
 * `MINI`) and, beside it, the drawing the slide is about, large: the failed
 * and fixed test and the flagged and fixed screen (20), one piece of work
 * and its three marks (21), and the notes the agents keep (22). Every word
 * is the script's.
 */
import { box, type Box } from "@/components/deck/kit";
import { shown } from "../../script/find";
import { FIELD, topOf } from "./layout";
import { CHECKERS, FAILED, MINI_BOX, onMini } from "./layout-board";

/** A box round a piece of the board where it shows small, and a line from it to the drawing in close. */
const focusOf = (cell: Box) => {
  const at = onMini(cell);
  return box(at.x - 6, at.y - 6, at.w + 12, at.h + 12);
};

/* 20. Tested, and looked at */

const [FAILED_TEXT, FIXER_TEXT, FIXED_BY_TEXT, CHECKED_TEXT, FLAGGED_TEXT, FIXED_TEXT, PERSON_TEXT] = shown("tested", "play");
const PAIR_Y = MINI_BOX.y + MINI_BOX.h + 100;
const FIXER_AT = { x: FIELD.left + 352, y: PAIR_Y - 46 };
const TEST_CELL = { w: 300, h: 90 } as const;
export const TEST_PAIR = {
  focusKey: "tested.focus",
  focus: focusOf(FAILED),
  failedKey: "tested.failed",
  failed: box(FIELD.left, PAIR_Y, TEST_CELL.w, TEST_CELL.h),
  failedText: FAILED_TEXT,
  fixerKey: "tested.fixer",
  /** The fixer over the arrow, named on its right, clear of the fixed test under it. */
  fixer: FIXER_AT,
  fixerText: FIXER_TEXT,
  fixerTextAt: { x: FIXER_AT.x + 34, y: FIXER_AT.y - 19 },
  arrowKey: "tested.arrow",
  fixedKey: "tested.fixed",
  fixed: box(FIELD.left + TEST_CELL.w + 104, PAIR_Y, TEST_CELL.w, TEST_CELL.h),
  fixedText: FIXED_BY_TEXT,
  labelY: PAIR_Y + TEST_CELL.h + 18,
};
const SCREEN = {
  x: 900,
  y: topOf("tested") + 80,
  w: 420,
  h: 280,
  gap: 84,
} as const;
const SCREEN_LABEL_Y = SCREEN.y + SCREEN.h + 16;
/** The person who checks the screens: in the labels' row at the field's right edge, named at 26 px on their right and centred on the row's 32 px labels. */
const PERSON_TEXT_W = 230;
const PERSON = box(FIELD.right - PERSON_TEXT_W - 12 - 36, SCREEN_LABEL_Y + 19 - 25, 36, 50);
export const SCREEN_PAIR = {
  labelKey: "tested.checked",
  text: CHECKED_TEXT,
  labelAt: { x: SCREEN.x + 40, y: topOf("tested") + 14 },
  testerKey: "tested.tester",
  tester: { x: SCREEN.x + 12, y: topOf("tested") + 34 },
  personKey: "tested.person",
  person: PERSON,
  personText: PERSON_TEXT,
  personTextAt: { x: PERSON.x + PERSON.w + 12, y: SCREEN_LABEL_Y + 19 - 16, w: PERSON_TEXT_W },
  flaggedKey: "tested.flagged",
  flagged: box(SCREEN.x, SCREEN.y, SCREEN.w, SCREEN.h),
  flaggedText: FLAGGED_TEXT,
  scanKey: "tested.scan",
  ringKey: "tested.ring",
  fixedKey: "tested.screen.fixed",
  fixed: box(SCREEN.x + SCREEN.w + SCREEN.gap, SCREEN.y, SCREEN.w, SCREEN.h),
  fixedText: FIXED_TEXT,
  arrowKey: "tested.screen.arrow",
  labelY: SCREEN_LABEL_Y,
};
/** A page screenshot: a browser bar, a header, a form on the left with its button, a chart on the right. */
export const screenParts = (at: Box) => {
  const bar = 28;
  const head = box(at.x, at.y + bar, at.w, 40);
  const formX = at.x + 24;
  const top = head.y + head.h + 24;
  const wrongButton = box(formX + 34, top + 146, 150, 30);
  return {
    bar: at.y + bar,
    dots: [0, 1, 2].map((n) => ({ x: at.x + 18 + n * 16, y: at.y + bar / 2 })),
    head,
    headTitle: box(at.x + 20, head.y + 15, 120, 10),
    fields: [0, 1, 2].map((n) => ({
      label: box(formX, top + n * 46, [60, 80, 52][n], 8),
      field: box(formX, top + 14 + n * 46, 170, 26),
    })),
    button: box(formX, top + 150, 104, 30),
    wrongButton,
    /** The ring round the wrong button, inside the screen and clear of the field above. */
    ring: { cx: wrongButton.x + wrongButton.w / 2, cy: wrongButton.y + wrongButton.h / 2, rx: wrongButton.w / 2 + 20, ry: wrongButton.h / 2 + 8 },
    chart: box(at.x + 228, top, at.w - 252, 150),
    bars: [0.5, 0.8, 0.62, 0.9, 0.7].map((k, n) => box(at.x + 244 + n * 32, top + 150 - 10 - 120 * k, 20, 120 * k)),
  };
};
export const TESTED_KEYS = [
  TEST_PAIR.focusKey,
  TEST_PAIR.failedKey,
  TEST_PAIR.fixerKey,
  TEST_PAIR.arrowKey,
  TEST_PAIR.fixedKey,
  SCREEN_PAIR.labelKey,
  SCREEN_PAIR.testerKey,
  SCREEN_PAIR.personKey,
  SCREEN_PAIR.flaggedKey,
  SCREEN_PAIR.scanKey,
  SCREEN_PAIR.ringKey,
  SCREEN_PAIR.fixedKey,
  SCREEN_PAIR.arrowKey,
];

/* 21. Two reviewers, then a person */

const REVIEWED_CELL = CHECKERS.find((crew) => crew.kind === "reviewer" && crew.cell.row === 3)!.cell;
const [BUILDER_TEXT, ...MARK_TEXTS] = shown("reviewed", "play");
/** The piece of work: a change, its lines of code drawn as bars, with the builder who wrote it named beside it. */
const PIECE = box(640, topOf("reviewed") + 30, 940, 130);
const MARK_X = PIECE.x + 112;
/** The marks: 32 px shapes, 120 apart, their names at 40 px. */
const MARK = { r: 32, first: 84, pitch: 120 } as const;
const BUILDER_AT = { x: PIECE.x + PIECE.w + 96, y: PIECE.y + 44 };
export const REVIEW = {
  focusKey: "reviewed.focus",
  focus: focusOf(REVIEWED_CELL),
  pieceKey: "reviewed.piece",
  piece: PIECE,
  /** The code: three lines of bars, indented as code is. */
  code: [
    [0, [140, 96, 180]],
    [1, [120, 220]],
    [1, [88, 160, 104]],
  ].map(([indent, widths], n) => {
    let x = PIECE.x + 40 + (indent as number) * 48;
    return (widths as number[]).map((w) => {
      const bar = box(x, PIECE.y + 30 + n * 28, w, 14);
      x += w + 16;
      return bar;
    });
  }),
  builderKey: "reviewed.builder",
  builder: BUILDER_AT,
  builderText: BUILDER_TEXT,
  builderTextAt: { x: BUILDER_AT.x - 100, y: BUILDER_AT.y + 36, w: 200 },
  tickKey: "reviewed.tick",
  spine: { x: MARK_X, y0: PIECE.y + PIECE.h },
  markR: MARK.r,
  marks: MARK_TEXTS.map((text, i) => ({
    key: `reviewed.mark.${i}`,
    text,
    at: { x: MARK_X, y: PIECE.y + PIECE.h + MARK.first + i * MARK.pitch },
    person: i === 2,
  })),
  personBox: (y: number) => box(MARK_X - 108, y - 32, 48, 64),
};
export const REVIEW_KEYS = [REVIEW.focusKey, REVIEW.pieceKey, REVIEW.builderKey, REVIEW.tickKey, ...REVIEW.marks.map((mark) => mark.key)];

/* 22. Lessons carry forward */

const [HEADING_TEXT, ...REST] = shown("memory", "play");
const LESSON_TEXTS = REST.slice(0, 3);
const PANEL = box(640, topOf("memory") + 20, FIELD.right - 640, 400);
export const NOTES_PANEL = {
  key: "memory.panel",
  at: PANEL,
  heading: HEADING_TEXT,
  headingAt: { x: PANEL.x + 40, y: PANEL.y + 28 },
  rule: { x0: PANEL.x + 32, x1: PANEL.x + PANEL.w - 32, y: PANEL.y + 96 },
  lessons: LESSON_TEXTS.map((text, i) => {
    const y = PANEL.y + 128 + i * 76;
    return {
      key: `memory.lesson.${i}`,
      readKey: `memory.read.${i}`,
      text,
      at: { x: PANEL.x + 64, y },
      bar: box(PANEL.x + 36, y + 2, 8, 40),
    };
  }),
};
/** At the end of each wave a note goes from the board to the panel: a dot from the board's edge to its line. */
export const NOTE_DOTS = NOTES_PANEL.lessons.map((lesson, i) => ({
  key: `memory.note.${i}`,
  from: { x: MINI_BOX.x + MINI_BOX.w + 12, y: MINI_BOX.y + MINI_BOX.h / 2 },
  to: { x: PANEL.x - 14, y: lesson.at.y + 20 },
}));
/** The new session: its agents, one of each kind, named, and the line they read the panel along. */
const SESSION_Y = MINI_BOX.y + MINI_BOX.h + 120;
export const SESSION = {
  key: "memory.session",
  text: REST[3],
  labelAt: { x: FIELD.left, y: SESSION_Y - 74 },
  agents: (["lead", "builder", "tester", "reviewer", "fixer"] as const).map((kind, i) => ({ kind, at: { x: FIELD.left + 24 + i * 66, y: SESSION_Y } })),
  arrowKey: "memory.session.arrow",
  arrow: {
    from: { x: FIELD.left + 24 + 4 * 66 + 44, y: SESSION_Y },
    to: { x: PANEL.x - 16, y: SESSION_Y },
  },
};
export const MEMORY_KEYS = [NOTES_PANEL.key, SESSION.key, SESSION.arrowKey, ...NOTES_PANEL.lessons.flatMap((lesson) => [lesson.key, lesson.readKey]), ...NOTE_DOTS.map((dot) => dot.key)];
