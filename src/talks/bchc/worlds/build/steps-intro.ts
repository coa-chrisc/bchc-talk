/**
 * Slides 14, 18 and 14a: the three steps, the week over its app sketch, and
 * the lead agents reading the six folders at their desk. Each click is one
 * chain (beats.ts) that plays the picture and its story lines on its own.
 */
import { DUR, EASE, draw, fill, hide, lines, retitle, rise, show, to } from "@/components/deck/kit";
import { picture, story } from "../steps";
import { from, gone, play, told } from "./beats";
import { BUILD_ART, CALENDAR, CHECKER, CURSOR, DAYS, NOTES, PROTOTYPE, RAD, RAD_KEYS, SKETCH, WEEK, WEEK_KEYS, titleKey } from "./layout";
import { DESK_KEY, DROP, FOLDERS, LEADS, READS } from "./layout-setup";

/* 14 */

/** When each step starts: its box comes up, then its name, then its drawing; the arrow into it draws once the box is there. */
const STEP_AT = [1.0, 3.1, 5.2] as const;
const LINK_AFTER = 0.3;
/** The builder rides the cells' front as they fill, one after another; the tester follows a cell behind. */
const CELL_T = 0.45;
const cells = BUILD_ART.cells;
const RIDE = cells[3].x + cells[3].w - BUILD_ART.r - 4 - (cells[0].x + BUILD_ART.r + 4);
const TRAIL = cells[2].x - cells[0].x;
const FILL_AT = STEP_AT[1] + 0.7;

const rad = play([
  {
    moves: [
      lines(titleKey("rad"), { at: 0, duration: 0.9 }),
      show(RAD.boxKey, { at: STEP_AT[0], stagger: STEP_AT[1] - STEP_AT[0] }),
      draw(RAD.linkKey, {
        at: STEP_AT[1] + LINK_AFTER,
        duration: 0.45,
        stagger: STEP_AT[1] - STEP_AT[0],
      }),
      RAD.boxes.map((_, i) => [rise(RAD.nameKey(i), { at: STEP_AT[i] + 0.2 }), show(RAD.artKey(i), { at: STEP_AT[i] + 0.45 })]),
      show([RAD.builderKey, RAD.testerKey], {
        at: STEP_AT[1] + 0.5,
        stagger: 0.1,
      }),
      // Each agent's ring fills in the process colour as it starts work.
      fill(RAD.glyphKeys, { at: STEP_AT[1] + 0.6, duration: 0.5, stagger: 0.1 }),
      fill(RAD.cellsKey, {
        at: FILL_AT,
        duration: CELL_T,
        stagger: CELL_T,
        ease: "none",
      }),
      to(RAD.builderKey, { x: RIDE }, { x: 0 }, { at: FILL_AT, duration: 4 * CELL_T, ease: "none" }),
      to(RAD.testerKey, { x: TRAIL }, { x: 0 }, { at: FILL_AT + 2 * CELL_T, duration: 2 * CELL_T, ease: EASE.soft }),
      show(RAD.markKey, { at: STEP_AT[2] + 0.9 }),
    ],
  },
  { with: true, hold: 0.6, moves: [story("rad", 0)] },
]);

/* 18 */

/** When each day starts: its name comes up and the day's frame moves to it; what it adds comes a moment later. */
const DAY_AT = [1.0, 2.7, 4.4, 6.1, 7.8] as const;
const today = DAYS.slice(1).map((_, n) => to(CALENDAR.todayKey, { x: (n + 1) * CALENDAR.pitch }, { x: 0 }, { at: DAY_AT[n + 1], duration: 0.5, ease: EASE.page }));
const week = play([
  {
    moves: [
      gone([...RAD_KEYS, ...told("rad")]),
      retitle(titleKey("rad"), titleKey("week")),
      show(CALENDAR.key, { at: 0.3 }),
      DAYS.map((_, i) => rise(WEEK.dayKey(i), { at: DAY_AT[i] })),
      show(CALENDAR.todayKey, { at: DAY_AT[0] }),
      today,
      // Monday: the meeting's notes beside the blank outline.
      show([NOTES.key, SKETCH.key], { at: DAY_AT[0] + 0.3, stagger: 0.15 }),
      rise(NOTES.labelKey, { at: DAY_AT[0] + 0.5 }),
      // Tuesday: the agents' plan draws over it, and the people who need the tool mark it up.
      show(WEEK.planKey, { at: DAY_AT[1] + 0.2, duration: 0.6 }),
      show(CHECKER.key, { at: DAY_AT[1] + 0.5 }),
      rise(CHECKER.labelKey, { at: DAY_AT[1] + 0.7 }),
      draw(CHECKER.markKey, { at: DAY_AT[1] + 0.8, duration: 0.7 }),
      // Wednesday: the agents build, and the screens fill the outline.
      hide(CHECKER.markKey, { at: DAY_AT[2] + 0.2 }),
      show(WEEK.buildKey, { at: DAY_AT[2] + 0.2, duration: 0.7 }),
      hide(WEEK.planKey, { at: DAY_AT[2] + 0.6 }),
      // Thursday: the agents test it.
      show(WEEK.testKey, { at: DAY_AT[3] + 0.2 }),
      // Friday: the same people click through it.
      from(CURSOR.key, CURSOR.from, { at: DAY_AT[4] + 0.1, duration: 0.8 }),
      rise(PROTOTYPE.key, { at: DAY_AT[4] + 1.2 }),
    ],
  },
  { with: true, hold: DAY_AT[1] + 0.3, moves: [story("week", 0)] },
  { with: true, hold: DAY_AT[4] - DAY_AT[1] + 0.5, moves: [story("week", 1)] },
]);

/* 14a */

/** When each folder lands; its reading runs from its spine to the lead agents a moment later. */
const FOLDER_AT = FOLDERS.map((_, i) => 1.8 + i * 1.1);
const READ = { after: 0.45, travel: 0.55 } as const;
const setup = play([
  {
    moves: [
      gone([...WEEK_KEYS, ...told("week")]),
      retitle(titleKey("week"), titleKey("setup")),
      show(DESK_KEY, { at: 0.3 }),
      show(LEADS.key, { at: 0.5 }),
      rise(LEADS.labelKey, { at: 0.8 }),
      FOLDERS.map((folder, i) => from(folder.key, { y: DROP }, { at: FOLDER_AT[i], duration: 0.5, ease: EASE.out })),
      READS.map((read, i) => [
        to(
          read.key,
          { x: read.to.x - read.at.x, y: read.to.y - read.at.y, autoAlpha: 1 },
          { x: 0, y: 0, autoAlpha: 0 },
          {
            at: FOLDER_AT[i] + READ.after,
            duration: READ.travel,
            ease: EASE.page,
          },
        ),
        hide(read.key, {
          at: FOLDER_AT[i] + READ.after + READ.travel,
          duration: 0.2,
        }),
      ]),
      // Once they have read everything, the lead agents stand: they plan the work and hand it out.
      to(LEADS.key, { y: LEADS.stand }, { y: 0 }, { at: FOLDER_AT[5] + 1.6, duration: DUR.base, ease: EASE.out }),
    ],
  },
  { with: true, hold: 1.1, moves: [story("setup", 0)] },
  { with: true, hold: FOLDER_AT[5] + 1.3 - 1.1, moves: [story("setup", 1)] },
]);

export const introSteps = [...picture("rad", rad), ...picture("week", week), ...picture("setup", setup)];
