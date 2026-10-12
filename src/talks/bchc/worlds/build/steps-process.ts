/**
 * Slide 22b: the year goes, and the process draws as one ring, clockwise
 * from "Describe", each step's pill showing as the line reaches it, the
 * passed tick by "Check" and the person-approves mark by "Approve". Line A
 * comes up while the ring draws, so it is read alongside the steps it names.
 * Once the ring closes, your department's outline opens inside it and the
 * three products settle in; line B comes last, once the stage is still. A
 * breath after the busy year: few moves, and nothing moving once the
 * products land.
 */
import { DUR, EASE, HOLD, retitle, show, to } from "@/components/deck/kit";
import { picture, story } from "../steps";
import { beats, from, gone, opens, told, type Beat } from "./beats";
import { titleKey } from "./layout";
import { DEPARTMENT, MARKS, PRODUCTS, RING, SETTLE, STEPS } from "./layout-process";
import { YEAR_KEYS } from "./layout-year";

/**
 * The ring's stroke: from just after the new title is up, for long enough to
 * read each step as it lands. It draws at an even pace, a loop with no start
 * or end in its speed, so the seven steps, an even distance apart, arrive on
 * an even beat, half a second apart.
 */
export const DRAW = { at: 1.0, duration: 3.5 } as const;
/**
 * When each step's pill shows: as the ring's front comes up to it, and
 * quickly, so the pill is solid before the front reaches its middle and the
 * line runs on under a pill that is already there. "Describe" shows just
 * before the line leaves it.
 */
const PILL = { lead: 0.3, duration: 0.25 } as const;
export const STEP_AT = STEPS.map((step) => DRAW.at + step.along * DRAW.duration - PILL.lead);
/** A mark lands a tenth of a second after the ring's front passes its step's middle, between two pills' starts. */
const MARK_LAG = PILL.lead + 0.1;
/** Line A, while the ring draws: between the second and third pills' starts, so the line and a drawing never start on the same instant. */
export const A_AT = 1.55;
/** Your department opens a beat after the ring closes, and the products settle in one after another. */
export const DEPARTMENT_AT = DRAW.at + DRAW.duration + HOLD.gap;
export const PRODUCT_AT = PRODUCTS.map((_, i) => DEPARTMENT_AT + 0.55 + i * 0.15);
const SETTLE_T = 0.8;
/** Line B, once line A has been up for 4.5 s and the stage has been still a moment after the last product settles. */
const A_READ = 4.5;
const STILL = 0.65;
export const B_AT = Math.max(A_AT + DUR.base + A_READ, PRODUCT_AT[PRODUCT_AT.length - 1] + SETTLE_T + STILL);

const process: Beat[] = [
  {
    moves: [
      gone([...YEAR_KEYS, ...told("scale")]),
      retitle(titleKey("scale"), titleKey("process")),
      to(RING.key, { "--d": 1 }, { "--d": 0 }, { at: DRAW.at, duration: DRAW.duration, ease: "none" }),
      STEPS.map((step, i) => show(step.key, { at: STEP_AT[i], duration: PILL.duration })),
      show(MARKS.tickKey, { at: STEP_AT[MARKS.checkStep] + MARK_LAG }),
      show(MARKS.approveKey, { at: STEP_AT[MARKS.approveStep] + MARK_LAG }),
      opens(DEPARTMENT.key, { at: DEPARTMENT_AT }),
      PRODUCTS.map((product, i) => from(product.key, SETTLE, { at: PRODUCT_AT[i], duration: SETTLE_T, ease: EASE.out })),
    ],
  },
  { with: true, hold: A_AT, moves: [story("process", 0)] },
  { with: true, hold: B_AT - A_AT, moves: [story("process", 1)] },
];

export const processSteps = picture("process", { play: beats(process) });
