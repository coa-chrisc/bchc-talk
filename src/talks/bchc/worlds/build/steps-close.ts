/**
 * Slides 20 to 22, with the board small in the corner: the failed test the
 * fixer repairs and the screen an agent flags against the design system,
 * one piece of work and the three marks it needs, and the notes the agents
 * write each wave and a new session reads.
 */
import { DUR, EASE, fill, hide, retitle, rise, show, to } from "@/components/deck/kit";
import { picture, story } from "../steps";
import { beats, gone, opens, told, type Beat } from "./beats";
import { titleKey } from "./layout";
import { BOARD_KEY, BUILDERS, CHECKERS, FIXER, FRONT, LATE, MINI_MOVE, PLAN_KEYS, PROJECT, ROWS, frontKey, lateKey } from "./layout-board";
import { NOTES_PANEL, NOTE_DOTS, REVIEW, REVIEW_KEYS, SCREEN_PAIR, SESSION, TESTED_KEYS, TEST_PAIR } from "./layout-close";

/** The agents on the board: they go as it goes small, and the cells and ticks tell the rest. */
const BOARD_AGENTS = [...BUILDERS.map((b) => b.key), ...CHECKERS.map((c) => c.key), FIXER.key];

/* 20 */

const SCAN = { at: 5.0, travel: 1.0 } as const;
const tested: Beat[] = [
  {
    moves: [
      gone([...PLAN_KEYS, ...BOARD_AGENTS, ...told("split")]),
      retitle(titleKey("split"), titleKey("tested")),
      to(BOARD_KEY, MINI_MOVE, { x: 0, y: 0, scale: 1 }, { at: 0.2, duration: 1.0, ease: EASE.page }),
      show(TEST_PAIR.focusKey, { at: 1.2 }),
      rise(TEST_PAIR.failedKey, { at: 1.4 }),
      show(TEST_PAIR.fixerKey, { at: 2.8 }),
      show(TEST_PAIR.arrowKey, { at: 3.1 }),
      rise(TEST_PAIR.fixedKey, { at: 3.4 }),
      // The screens: an agent checks each against the design system, flags the one that is off, and it is fixed.
      show([SCREEN_PAIR.testerKey, SCREEN_PAIR.labelKey], {
        at: 4.3,
        stagger: 0.1,
      }),
      show(SCREEN_PAIR.flaggedKey, { at: 4.5 }),
      show(SCREEN_PAIR.scanKey, { at: SCAN.at, duration: 0.2 }),
      to(SCREEN_PAIR.scanKey, { y: SCREEN_PAIR.flagged.h - 6 }, { y: 0 }, { at: SCAN.at, duration: SCAN.travel, ease: EASE.draw }),
      hide(SCREEN_PAIR.scanKey, { at: SCAN.at + SCAN.travel, duration: 0.25 }),
      to(SCREEN_PAIR.ringKey, { autoAlpha: 1, "--d": 1 }, { autoAlpha: 0, "--d": 0 }, { at: SCAN.at + SCAN.travel, duration: 0.6, ease: EASE.draw }),
      show(SCREEN_PAIR.arrowKey, { at: 7.0 }),
      opens(SCREEN_PAIR.fixedKey, { at: 7.2 }),
      show(SCREEN_PAIR.personKey, { at: 8.2 }),
    ],
  },
  { with: true, hold: 1.7, moves: [story("tested", 0)] },
  { with: true, hold: 6.6 - 1.7, moves: [story("tested", 1)] },
];

/* 21 */

const MARK_AT = [2.6, 3.8, 5.8] as const;
const reviewed: Beat[] = [
  {
    moves: [
      gone([...TESTED_KEYS, ...told("tested")]),
      retitle(titleKey("tested"), titleKey("reviewed")),
      show(REVIEW.focusKey, { at: 0.4 }),
      show(REVIEW.pieceKey, { at: 0.6 }),
      show(REVIEW.builderKey, { at: 0.9 }),
      REVIEW.marks.map((mark, i) => rise(mark.key, { at: MARK_AT[i] })),
      show(REVIEW.tickKey, { at: MARK_AT[2] + 1.0 }),
    ],
  },
  { with: true, hold: 1.0, moves: [story("reviewed", 0)] },
  { with: true, hold: 4.8 - 1.0, moves: [story("reviewed", 1)] },
];

/* 22 */

/** When each of the three waves starts: its cells fill on the board, then its note goes to the panel and its lesson is written. */
const WAVE_AT = [2.0, 3.7, 5.4] as const;
const NOTE = { after: 0.6, travel: 0.7 } as const;
const STILL_FRONT = ROWS.flatMap((row, r) => (row.cells.some((cell) => cell.slot === FRONT) ? [frontKey(r)] : []));
const SESSION_AT = 7.6;
const memory: Beat[] = [
  {
    moves: [
      gone([...REVIEW_KEYS, ...told("reviewed")]),
      retitle(titleKey("reviewed"), titleKey("memory")),
      show(NOTES_PANEL.key, { at: 0.3 }),
      fill(STILL_FRONT, { at: WAVE_AT[0], duration: 0.4, stagger: 0 }),
      LATE.map((_, n) => [
        fill(lateKey(n), { at: WAVE_AT[n], duration: 0.5, stagger: 0.03 }),
        to(
          NOTE_DOTS[n].key,
          {
            x: NOTE_DOTS[n].to.x - NOTE_DOTS[n].from.x,
            y: NOTE_DOTS[n].to.y - NOTE_DOTS[n].from.y,
            autoAlpha: 1,
          },
          { x: 0, y: 0, autoAlpha: 0 },
          {
            at: WAVE_AT[n] + NOTE.after,
            duration: NOTE.travel,
            ease: EASE.page,
          },
        ),
        hide(NOTE_DOTS[n].key, {
          at: WAVE_AT[n] + NOTE.after + NOTE.travel,
          duration: 0.2,
        }),
        rise(NOTES_PANEL.lessons[n].key, {
          at: WAVE_AT[n] + NOTE.after + NOTE.travel - 0.1,
        }),
      ]),
      fill(PROJECT.fillKey, { at: WAVE_AT[2] + 0.4, duration: 0.6 }),
      // A new session starts and reads the panel, line by line.
      show(SESSION.key, { at: SESSION_AT }),
      show(SESSION.arrowKey, { at: SESSION_AT + 0.4 }),
      NOTES_PANEL.lessons.map((lesson, i) =>
        to(
          lesson.readKey,
          { autoAlpha: 1, scaleY: 1 },
          { autoAlpha: 0, scaleY: 0 },
          {
            at: SESSION_AT + 0.9 + i * 0.35,
            duration: DUR.quick,
            ease: EASE.out,
          },
        ),
      ),
    ],
  },
  { with: true, hold: 0.8, moves: [story("memory", 0)] },
  { with: true, hold: WAVE_AT[2] + 0.8 - 0.8, moves: [story("memory", 1)] },
];

export const closeSteps = [...picture("tested", { play: beats(tested) }), ...picture("reviewed", { play: beats(reviewed) }), ...picture("memory", { play: beats(memory) })];
