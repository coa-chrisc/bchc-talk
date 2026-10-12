/**
 * Slide 19's two clicks, in the agent film's way. The plan: the project row
 * splits into eight workstreams, named epics and sprints, the line of what
 * has to finish first draws, and a person approves the plan. The work: three
 * waves, one a sprint; builders ride the front of their rows' cells as they
 * fill, each wave's cells pass as the next starts, one test fails and the
 * fixer repairs it, and the third wave ends with testers and reviewers on
 * the cells just built and the front cells part built.
 */
import { draw, fill, hide, retitle, rise, show, to, wipe } from "@/components/deck/kit";
import { picture, story } from "../steps";
import { beats, from, gone, told, type Beat } from "./beats";
import { titleKey } from "./layout";
import {
  BUILDERS,
  CHECKERS,
  EPICS,
  FAILED_KEY,
  FIRST,
  FIXER,
  FRONT,
  FRONT_FILL,
  LEADS,
  NAMES,
  PLAN_APPROVAL,
  PROJECT,
  ROWS,
  SPLIT_FROM,
  SPRINTS,
  SPRINT_EDGES,
  WAVE,
  WAVES,
  fillKey,
  frontKey,
  frontOf,
  tickKey,
  waveCells,
} from "./layout-board";
import { LIBRARY_KEYS } from "./layout-library";
import { DESIGN_FOLDER, MODULES_FOLDER } from "./layout-setup";

/* The plan */

const ROWS_AT = 1.2;
const plan: Beat[] = [
  {
    moves: [
      gone([...LIBRARY_KEYS.data, DESIGN_FOLDER.key, MODULES_FOLDER.key, ...told("data")]),
      retitle(titleKey("data"), titleKey("split")),
      wipe(PROJECT.key, { at: 0.4 }),
      rise(PROJECT.labelKey, { at: 0.7 }),
      show(LEADS.key, { at: 0.5 }),
      rise(NAMES.leadKey, { at: 1.0 }),
      ROWS.map((row, r) => from(row.key, { y: SPLIT_FROM(r) }, { at: ROWS_AT + r * 0.1, duration: 0.9 })),
      show(EPICS.key, { at: 2.7 }),
      show([SPRINT_EDGES.key, SPRINTS.key], { at: 3.3, stagger: 0.1 }),
      draw(FIRST.lineKey, { at: 4.0 }),
      show(FIRST.key, { at: 4.5 }),
      show(PLAN_APPROVAL.key, { at: 5.3 }),
    ],
  },
  { with: true, hold: 5.6, moves: [story("split", 0)] },
];

/* The work */

/** When each wave starts, and how long a cell takes to build. */
const WAVE_AT = [1.2, 3.6, 6.0] as const;
const CELL_T = 0.45;
/** Where a builder is, relative to where it starts, at the front of a cell `k` built. */
const rideTo = (r: number, cell: (typeof ROWS)[number]["cells"][number], k: number) => frontOf(cell, k).x - BUILDERS[r].at.x;
/** The wave a row's first cell is built in. */
const firstWave = (r: number) => Math.floor(ROWS[r].first / 4);

const rowWork = ROWS.map((row, r) => {
  const builder = BUILDERS[r].key;
  const waves = WAVES.map((w) => ({ w, cells: waveCells(r, w) })).filter(({ cells }) => cells.length > 0);
  const lastWave = waves[waves.length - 1];
  const lastEnd = WAVE_AT[lastWave.w] + lastWave.cells.length * CELL_T;
  const front = row.cells.find((cell) => cell.slot === FRONT);
  return [
    show(builder, { at: WAVE_AT[firstWave(r)] - 0.35, duration: 0.3 }),
    waves.map(({ w, cells }) => [
      fill(fillKey(r, w), {
        at: WAVE_AT[w],
        duration: CELL_T,
        stagger: CELL_T,
        ease: "none",
      }),
      to(builder, { x: rideTo(r, cells[cells.length - 1], 1) }, { x: 0 }, { at: WAVE_AT[w], duration: cells.length * CELL_T, ease: "none" }),
    ]),
    front
      ? [
          fill(frontKey(r), {
            to: FRONT_FILL,
            at: lastEnd,
            duration: 0.6,
            ease: "none",
          }),
          to(builder, { x: rideTo(r, front, FRONT_FILL) }, { x: 0 }, { at: lastEnd, duration: 0.6, ease: "none" }),
        ]
      : hide(builder, { at: lastEnd + 0.1, duration: 0.3 }),
  ];
});

const work: Beat[] = [
  {
    moves: [
      rowWork,
      // Each wave's cells pass as the next wave starts, but the one that fails.
      show(tickKey(0), { at: WAVE_AT[1], stagger: 0.02 }),
      show(tickKey(1), { at: WAVE_AT[2], stagger: 0.02 }),
      show(FAILED_KEY.cross, { at: WAVE_AT[2] }),
      show(FIXER.key, { at: WAVE_AT[2] + 0.4 }),
      hide(FAILED_KEY.cross, { at: WAVE_AT[2] + 1.3 }),
      show(FAILED_KEY.tick, { at: WAVE_AT[2] + 1.4 }),
      // The third wave: testers and reviewers on the cells just built, the wave named.
      show(WAVE.key, { at: WAVE_AT[2] }),
      show(
        CHECKERS.map((crew) => crew.key),
        { at: WAVE_AT[2] + 0.6, stagger: 0.07 },
      ),
      // The project row fills as each wave passes.
      WAVES.slice(1).map((w) => fill(PROJECT.fillKey, { to: w * 0.25, at: WAVE_AT[w], duration: 0.6 })),
      fill(PROJECT.fillKey, {
        to: (2 * 4 + 1 + FRONT_FILL) / 16,
        at: WAVE_AT[2] + 1.2,
        duration: 0.6,
      }),
      rise(NAMES.key, { at: 8.1 }),
    ],
  },
  { with: true, hold: 0.3, moves: [story("split", 1)] },
];

export const boardSteps = picture("split", {
  plan: beats(plan),
  work: beats(work),
});
