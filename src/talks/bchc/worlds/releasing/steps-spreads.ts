/**
 * Slide 33a: slide 33's room clears and its table shrinks to the left, where
 * it becomes Austin's small table with Austin's circle beside it. Three lines
 * draw out from it and a ready department joins at the end of each, with
 * line A. Then each of those three gets its own table; as each lights,
 * Austin's line to it thins and fades, and two or three next departments
 * join that table on lines of their own. Line B comes with those lines,
 * and the click ends on the last next department. Part 5's last picture: the
 * start world follows it.
 */
import { EASE, chain, draw, hide, retitle, rise, show, to, type Counts } from "@/components/deck/kit";
import { picture, story } from "../steps";
import { OWN, TITLES } from "./layout";
import { AUSTIN, NEXT_DEPTS, NEXT_LABEL, READY, READY_LABEL, ROOT_TABLE, SHRUNK } from "./layout-spreads";
import { TABLE } from "./layout-workshop";

/** How many elements a title's id has: one a line. */
const counts: Counts = Object.fromEntries(Object.values(TITLES).map((title) => [title.key, title.lines.length]));

/** Slide 33's table shrinks onto Austin's table once the rest of its room has gone. */
export const SHRINK = { at: 0.3, duration: 1.0 } as const;
/** As it lands, the small table takes its place in a cut: the same table at the same size, so nothing seems to change. */
export const SWAP_AT = SHRINK.at + SHRINK.duration;
const SWAP = 0.01;
/** Austin's circle draws, its name inside, while the table comes in. */
export const AUSTIN_AT = 0.7;
const AUSTIN_DRAW = 0.8;
/** Austin's three lines draw out one after another; each ready department's circle draws as its line arrives. */
export const TIE_AT = READY.map((_, i) => 1.6 + i * 0.22);
const TIE_DRAW = 0.6;
export const READY_AT = TIE_AT.map((at) => at + TIE_DRAW - 0.15);
const CIRCLE_DRAW = 0.6;
/** "Ready now" once the first has joined; line A with the lines. */
export const READY_LABEL_AT = READY_AT[0] + 0.3;
export const A_AT = TIE_AT[0] + 0.3;
/** The ready departments' tables light one after another, far enough apart that no two next lines set off together; as each lights, Austin's line to it thins and fades. */
export const TABLE_AT = READY.map((_, i) => 3.6 + i * 0.35);
const TABLE_DRAW = 0.6;
const THIN = 0.8;
/** How faint Austin's lines end: still there, behind the help that has moved on. */
export const FAINT = 0.5;
/** Each next department's line sets off once its table is nearly lit, 0.15 s after the one before it in its group; its circle draws as the line arrives. */
export const BRANCH_AT = NEXT_DEPTS.map((next) => TABLE_AT[next.group] + 0.45 + NEXT_DEPTS.filter((other) => other.group === next.group).indexOf(next) * 0.15);
const BRANCH_DRAW = 0.5;
export const NEXT_AT = BRANCH_AT.map((at) => at + BRANCH_DRAW - 0.1);
const NEXT_DRAW = 0.5;
/** "Next" once the first next department has started to draw; line B with the first next line, so the click ends on the last next circle. */
export const NEXT_LABEL_AT = NEXT_AT[0] + 0.3;
export const B_AT = BRANCH_AT[0] + 0.3;

/** Everything slide 33 left on the stage but its title, which goes with the retitle, and its table, which shrinks. */
const leaving = OWN.workshops.filter((key) => key !== TITLES.workshops.key && key !== TABLE.key);

export const spreadsSteps = picture("spreads", {
  play: {
    moves: chain(
      [
        {
          moves: [
            hide(leaving, { duration: 0.3, stagger: 0, at: 0 }),
            retitle(TITLES.workshops.key, TITLES.spreads.key),
            to(TABLE.key, SHRUNK, { "--x": 0, "--y": 0, "--s": 1 }, { ...SHRINK, ease: EASE.page }),
            show(ROOT_TABLE.key, { at: SWAP_AT, duration: SWAP, ease: "none" }),
            hide(TABLE.key, { at: SWAP_AT, duration: SWAP, ease: "none" }),
            draw(AUSTIN.key, { at: AUSTIN_AT, duration: AUSTIN_DRAW }),
            READY.map((ready, i) => [draw(ready.tie.key, { at: TIE_AT[i], duration: TIE_DRAW }), draw(ready.key, { at: READY_AT[i], duration: CIRCLE_DRAW })]),
            rise(READY_LABEL.key, { at: READY_LABEL_AT }),
            READY.map((ready, i) => [
              draw(ready.table.key, { at: TABLE_AT[i], duration: TABLE_DRAW }),
              to(ready.tie.key, { autoAlpha: FAINT, "--thin": 1 }, { autoAlpha: 1, "--thin": 0 }, { at: TABLE_AT[i], duration: THIN, ease: EASE.soft }),
            ]),
            NEXT_DEPTS.map((next, k) => [draw(next.branch.key, { at: BRANCH_AT[k], duration: BRANCH_DRAW }), draw(next.key, { at: NEXT_AT[k], duration: NEXT_DRAW })]),
            rise(NEXT_LABEL.key, { at: NEXT_LABEL_AT }),
          ].flat(2),
        },
        { with: true, hold: A_AT, moves: story("spreads", 0) },
        { with: true, hold: B_AT - A_AT, moves: story("spreads", 1) },
      ],
      { counts },
    ),
  },
});
