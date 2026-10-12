/**
 * What Part 4's clicks share (docs/bchc-flow-revision.md, sections 1 and 3).
 * A click brings the whole slide: its beats chain on their own, a story line
 * landing with the beat it explains, and the chain ends on the slide's
 * result. A slide's click puts the last slide's picture away at once and
 * changes the title; nothing carries from one slide to the next in this
 * part. Each slide's moves are in its own module (steps-together.ts,
 * steps-everyone.ts, steps-adapt.ts, steps-more.ts, steps-network.ts).
 */
import { EASE, chain, hide, retitle, type ChainBeat } from "@/components/deck/kit";
import { COUNTS, PICTURES, groupOf, titleKey } from "./layout";

/** The world's first title waits for the world's arrival fade to be under way. */
export const ARRIVE = 0.35;

/** A slide's beats as its one click's moves, timed by the kit's chain. */
export const play = (...beats: ChainBeat[]) => ({ moves: chain(beats, { counts: COUNTS }) });

/** The click's first beat: the slide before puts its whole picture away at once, and the title changes. */
export const into = (pictureId: string): ChainBeat => {
  const i = PICTURES.findIndex((entry) => entry.id === pictureId);
  const before = PICTURES[i - 1].id;
  const { marks, html, over } = groupOf(before);
  return { moves: [hide([marks, html, over], { at: 0, stagger: 0 }), retitle(titleKey(before), titleKey(pictureId))] };
};

export const keys = <T extends { key: string }>(list: readonly T[]) => list.map((entry) => entry.key);

/** A part placed by `--x`, `--y` and `--s` about its origin, as it is before any click moves it. */
export const PLACED = (scale: number) => ({ "--x": 0, "--y": 0, "--s": scale });

/** A tool going into the catalog: it travels up on the page curve. */
export const POST = { duration: 1.0, ease: EASE.page } as const;
