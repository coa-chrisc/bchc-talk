/**
 * Slide 22a: the board shrinks into one block of a year of work, and the
 * year comes in round it, sprint by sprint, this week's sprint outlined
 * across every row and named "This week".
 * The sprints either side of the release finish and turn solid, the next
 * one starts, every check passes, a person approves the release, it is
 * released, and the products rise off it to settle beside it.
 */
import { EASE, fill, hide, retitle, rise, show, to } from "@/components/deck/kit";
import { picture, story } from "../steps";
import { beats, from, gone, opens, told, type Beat } from "./beats";
import { titleKey } from "./layout";
import { BOARD_KEY, MINI_MOVE } from "./layout-board";
import { MEMORY_KEYS } from "./layout-close";
import { CHECKS, COLUMNS, INTO_WEEK, LEGEND, MARKERS, NOW, PRODUCTS, RELEASE, REVEAL, ROW_FILL, STARTED, THIS_WEEK, YEAR, YEAR_ROW, dotKey, fillKey } from "./layout-year";

/** How long a sprint takes to build, and when each of the three being built starts. */
const SPRINT_T = 1.4;
const BUILD_AT = {
  [NOW.finishing[0]]: 3.0,
  [NOW.finishing[1]]: 4.0,
  [NOW.starting]: 5.0,
} as Record<number, number>;
const REVEAL_AT = 1.0;

const built = COLUMNS.filter((column) => column.state === "built").map(({ sprint }) => {
  const at = BUILD_AT[sprint];
  const finishes = sprint !== NOW.starting;
  const k = finishes ? 1 : STARTED;
  const t = SPRINT_T * k;
  return [
    show(dotKey(sprint), { at: at - 0.2, duration: 0.2, stagger: 0 }),
    fill(fillKey(sprint), {
      to: k,
      at,
      duration: t,
      ease: "none",
      stagger: 0,
    }),
    to(dotKey(sprint), { x: YEAR.block * k }, { x: 0 }, { at, duration: t, ease: "none" }),
    finishes ? [to(fillKey(sprint), { "--solid": 1 }, { "--solid": 0 }, { at: at + t, duration: 0.3, ease: EASE.soft }), hide(dotKey(sprint), { at: at + t, duration: 0.2, stagger: 0 })] : [],
  ];
});

const RELEASE_AT = 6.4;
const scale: Beat[] = [
  {
    moves: [
      gone([...MEMORY_KEYS, ...told("memory")]),
      retitle(titleKey("memory"), titleKey("scale")),
      // The board goes into its block of the year, and the year comes in round it.
      to(BOARD_KEY, INTO_WEEK, MINI_MOVE, {
        at: 0.2,
        duration: 1.2,
        ease: EASE.page,
      }),
      hide(BOARD_KEY, { at: 1.1, duration: 0.4 }),
      show(THIS_WEEK.key, { at: REVEAL_AT }),
      show(
        REVEAL.map((column) => column.key),
        { at: REVEAL_AT, duration: 0.3, stagger: 0.05 },
      ),
      opens(YEAR_ROW.key, { at: 1.6 }),
      fill(YEAR_ROW.fillKey, { to: ROW_FILL.from, at: 1.6, duration: 0.6 }),
      show(MARKERS.key, { at: 2.3 }),
      // The sprints round the release are built; the row creeps on to it.
      built,
      fill(YEAR_ROW.fillKey, {
        to: ROW_FILL.to,
        at: BUILD_AT[NOW.finishing[0]],
        duration: BUILD_AT[NOW.finishing[1]] + SPRINT_T - BUILD_AT[NOW.finishing[0]],
        ease: "none",
      }),
      show(CHECKS.key, { at: 5.6 }),
      // A person approves the release, it is released, and the products rise off it.
      show(RELEASE.personKey, { at: RELEASE_AT }),
      show(RELEASE.markKey, { at: RELEASE_AT + 0.4 }),
      rise(RELEASE.releasedKey, { at: RELEASE_AT + 0.8 }),
      PRODUCTS.map((product, i) => from(product.key, product.rise, { at: RELEASE_AT + 1.2 + i * 0.15, duration: 0.8, ease: EASE.out })),
      show(LEGEND.key, { at: RELEASE_AT + 1.8 }),
    ],
  },
  { with: true, hold: 2.0, moves: [story("scale", 0)] },
  { with: true, hold: RELEASE_AT + 1.6 - 2.0, moves: [story("scale", 1)] },
];

export const yearSteps = picture("scale", { play: beats(scale) });
