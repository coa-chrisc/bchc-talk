/**
 * Part 7, slide 44 alone, one click (docs/bchc-talk-script.md, draft 8):
 * on navy, slide 1 opens over the whole stage and the view pulls back from
 * it into the grid's first cell as every other slide of the talk comes up
 * round it; then an agent flies in to each slide in reading order and
 * settles on it, as the label "Agents built this talk too" rises with an
 * agent beside it; then the closing lines. The camera never moves: the
 * pull-back is the picture's own move (kit `spread`). The end state is the
 * full grid with an agent on every slide and every word on the stage.
 */
import type { Move, WorldEntry } from "@/components/deck/engine";
import { DUR, EASE, RETITLE, fill, lines, rise, show, hide, spread, to, wipe } from "@/components/deck/kit";
import { copyFor, picture, picturesOf, worldTitle } from "../steps";
import { AGENTS, HERO, LABEL, LEGEND, MULTI, STILLS, THANKS, TITLES } from "./layout";
import { Scene } from "./scene";

/** Slide 44's beats, in seconds from the click. */
export const PULL_BACK = {
  /** Slide 1 comes up over the whole stage. */
  hero: 0.2,
  /** It shrinks into the first cell while the others come up round it. */
  spread: 1.2,
  travel: 1.6,
} as const;
const P = PULL_BACK;
/** When the hero has landed in the first cell: the first agent flies in, and the label rises. */
export const LANDED = P.spread + P.travel;
/** Seconds between one agent leaving and the next, in reading order. */
export const APART = 0.05;
/** An agent's flight onto its slide. */
export const TRIP = { duration: 0.9 } as const;
/** When each agent flies in: in reading order, from the moment the hero lands, each well after its slide has come up. */
export const leavesAt = (cell: number) => LANDED + cell * APART;
/** When the last agent has settled: then the closing lines. */
const SETTLED = leavesAt(AGENTS.length - 1) + TRIP.duration;
export const CLOSING = { title: SETTLED - 0.2, thanks: SETTLED + 1.2 } as const;

const thanksMoves: Move[] = [
  // Slide 1, as big as the stage, opens over the navy.
  ...show(HERO.key, { duration: 0.01, at: P.hero }),
  ...wipe(HERO.frameKey, { from: "left", duration: 0.6, at: P.hero }),
  // The view pulls back: it shrinks into the first cell, and every other slide comes up round it.
  ...spread(HERO.key, MULTI, { duration: P.travel, at: P.spread }),
  // Landed, it hands over to the first cell's own still.
  ...show(STILLS[0].key, { duration: 0.01, at: LANDED }),
  ...hide(HERO.key, { duration: 0.2, at: LANDED + 0.05 }),
  // The label rises with its agent, a builder, its ring filling green, as the first agents fly in.
  ...rise(LABEL.key, { at: LANDED + 0.2 }),
  ...show(LEGEND.key, { duration: 0.3, at: LANDED + 0.2 }),
  ...fill(LEGEND.key, { duration: 0.6, at: LANDED + 0.3 }),
  // An agent flies in to each slide, its ring filling as it goes, and settles on the slide's corner.
  ...AGENTS.flatMap((agent) => {
    const at = leavesAt(agent.cell);
    return [
      ...show(agent.key, { duration: 0.2, at }),
      ...to(agent.key, { x: 0, y: 0 }, agent.from, { duration: TRIP.duration, ease: EASE.page, at }),
      ...fill(agent.glyphKey, { duration: TRIP.duration * 0.75, at: at + 0.15 }),
    ];
  }),
  // Then the closing lines above the grid.
  ...lines(TITLES.thanks.key, { duration: RETITLE.in, at: CLOSING.title }),
  ...rise(THANKS.key, { duration: DUR.base, at: CLOSING.thanks }),
];

const thanks = picture("thanks", { play: { moves: thanksMoves } }, { ground: "navy" });

export const CLOSE_STEPS = [...thanks];

export const closeEntry: WorldEntry = {
  title: worldTitle("close"),
  world: { id: "close", Scene, steps: CLOSE_STEPS },
  copy: copyFor(picturesOf("close")),
};
