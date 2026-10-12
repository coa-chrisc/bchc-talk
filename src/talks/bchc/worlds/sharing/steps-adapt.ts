/**
 * Slide 25's click: the catalog with the original in its first place; the
 * large tool card with its first badge; your agents rework its three lines
 * one at a time, their ring filling green as each line's bar does; the badge
 * flips to the other provider and the dashed corner comes up with its word;
 * its lines pass their tests, a deep-green tick at each; a person on your
 * team approves it; and a copy shrinks up into the catalog beside
 * the original.
 */
import { DUR, EASE, draw, fill, mark, rise, show, to, wipe } from "@/components/deck/kit";
import { picture, story } from "../steps";
import { PLACED, into, keys, play } from "./beats";
import { ADAPT } from "./layout-adapt";

const A = ADAPT;
/** Each line's bar fills this long after the one before, taking `fill` to fill. */
const REWRITE = { first: 0.7, gap: 0.8, fill: 0.7 } as const;

export const adapt = picture("adapt", {
  play: play(
    // In comes the catalog, with the original in its first place.
    { moves: [...into("adapt").moves, wipe(A.frame.key, { from: "left", at: 0.2 }), show(A.original.key, { at: 0.6 })] },
    { with: true, hold: 0.6, moves: [story("adapt", 0)] },
    // The tool itself, large, on the provider it was built for.
    { with: true, hold: 0.5, moves: [rise(A.card.key, { at: 0 })] },
    // The department's agents rework it, one line at a time.
    {
      hold: 0.3,
      moves: [
        draw(A.agent.key, { at: 0, duration: 0.6 }),
        rise(A.agentLabel.key, { at: 0.2 }),
        draw(A.reach.key, { at: 0.4, duration: 0.4 }),
        fill(A.agent.key, { at: 0.6, duration: REWRITE.first + 2 * REWRITE.gap + REWRITE.fill - 0.6 }),
        fill(keys(A.rows), { at: REWRITE.first, duration: REWRITE.fill, stagger: REWRITE.gap }),
      ],
    },
    // It runs on the other provider now: the badge flips, and the dashed corner says it is adapted.
    { hold: 0.2, moves: [fill(A.badge.key, { at: 0, duration: 0.6, ease: EASE.draw }), show(A.corner.key, { at: 0.5 }), rise(A.adapted.key, { at: 0.6 })] },
    // They test it: each line passes, one after another.
    { hold: 0.2, moves: [show(keys(A.ticks), { at: 0, stagger: 0.2 })] },
    { with: true, hold: 0.1, moves: [story("adapt", 1)] },
    // A person on the department's team approves it.
    { hold: 0.2, moves: [draw(A.person.key, { at: 0 }), mark(A.mark.key, { at: 0.6 }), rise(A.approves.key, { at: 0.7 })] },
    // The adapted version goes into the catalog, beside the original.
    { hold: 0.3, moves: [show(A.copy.key, { at: 0, duration: 0.3 }), to(A.copy.key, PLACED(1), { ...A.copy.start }, { at: 0, duration: DUR.travel, ease: EASE.page })] },
  ),
});
