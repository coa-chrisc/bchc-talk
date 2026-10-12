/**
 * Slide 23's click: the catalog's three empty places come up, named; three
 * departments, each with the tool it built and its own agents; one by one
 * each sends its tool up into a place, where it lands as a card in the
 * catalog's indigo; copies flow back down one at a time, wait beside each
 * department's agents while the agents adapt them, and drop into the stack
 * with a dashed corner; and the count under the catalog says what happened.
 * Every card travels by the lane between the count and the departments, so
 * none crosses another (together-motion.test.ts plays it frame by frame).
 */
import { EASE, draw, fill, lines, rise, show, to, wipe } from "@/components/deck/kit";
import { picture, story } from "../steps";
import { ARRIVE, keys, play } from "./beats";
import { titleKey } from "./layout";
import { TOGETHER } from "./layout-together";

/** The departments post one after another: each tool sets off this long after the one before, goes `up` to the lane and `across` into its catalog place. */
const POST_GAP = 0.25;
const POSTS = { up: 0.45, across: 0.55 } as const;
/**
 * A department's copies, one at a time, the lower place first: each comes
 * straight down out of the catalog to the lane (`out`), along it to over
 * the stack (`over`) and down to the desk (`wait`); it turns from the
 * catalog's card to the department's own with its dashed corner as the
 * agents adapt it (`turn` after it sets off, for `turns`), and drops
 * straight down into its place (`down`). The second reaches the desk just
 * as the first has left it. The agents' ring fills green as they take the
 * first. Departments set off `stagger` apart: at this spacing each card on
 * the lane has run on before the next comes in behind it (0.58 to 0.60 s
 * clears; a few hundredths either way and two meet, together-motion.test.ts
 * holds it). The copies keep the same order on the lane at four fifths of
 * their first pace, so the whole click settles inside 11 s.
 */
const ADAPTS = { stagger: 0.59, out: 0.25, over: 0.37, wait: 0.2, turn: 0.75, turns: 0.3, down: 1.08, drop: 0.42, fills: 0.58, fill: 0.6 } as const;
/** When a department's second copy sets off, after its first: it comes down to the desk once the first has dropped clear of it. */
const SECOND = 0.58;
/** When the last department's last copy has landed, from the copies' beat's start. */
const LANDED = 2 * ADAPTS.stagger + SECOND + ADAPTS.down + ADAPTS.drop;

const T = TOGETHER;

export const together = picture("together", {
  play: play(
    // In comes the catalog: its three empty places, and its name at their left.
    { moves: [lines(titleKey("together"), { at: ARRIVE }), wipe(T.frame.key, { from: "left", at: ARRIVE + 0.4 }), rise(T.catalog.key, { at: ARRIVE + 0.4 })] },
    { with: true, hold: ARRIVE + 0.6, moves: [story("together", 0)] },
    // Three departments, each with the tool it built and its own agents, named once.
    {
      hold: 0.1,
      moves: [
        draw(keys(T.departments), { at: 0, duration: 0.8, stagger: 0.12 }),
        show(
          T.departments.map((dept) => dept.wells.key),
          { at: 0.2, stagger: 0.12 },
        ),
        show(
          T.departments.map((dept) => dept.own.key),
          { at: 0.45, stagger: 0.12 },
        ),
        draw(
          T.departments.map((dept) => dept.agent.key),
          { at: 0.6, duration: 0.6, stagger: 0.12 },
        ),
        // Their name, once, with the last department's agents, over the same time, so the beat ends no later.
        rise(T.agents.key, { at: 0.6 + 2 * 0.12, duration: 0.6 }),
      ],
    },
    // One by one, each department sends its tool up into the catalog.
    {
      hold: 0.25,
      moves: T.posts.flatMap((post, k) => [
        ...show(post.key, { at: k * POST_GAP, duration: 0.2 }),
        ...to(post.key, { ...post.lane }, { ...post.travel }, { at: k * POST_GAP, duration: POSTS.up, ease: EASE.page }),
        ...to(post.key, { x: 0, y: 0 }, undefined, { at: k * POST_GAP + POSTS.up, duration: POSTS.across, ease: EASE.page }),
      ]),
    },
    // Once all three are there, the count's first part; and copies flow back down, one at a time to each department's agents, and drop into its stack adapted.
    {
      hold: 0.2,
      moves: T.departments.flatMap((dept, i) => {
        const d = i * ADAPTS.stagger;
        return [
          ...(i === 0 ? rise(T.count.parts[0].key, { at: 0 }) : []),
          ...fill(dept.agent.key, { at: d + ADAPTS.fills, duration: ADAPTS.fill }),
          ...T.copies
            .filter((copy) => copy.dept === i)
            .flatMap((copy) => {
              const c = d + copy.turn * SECOND;
              return [
                ...show(copy.key, { at: c, duration: 0.2 }),
                ...to(copy.key, { ...copy.out }, { ...copy.start }, { at: c, duration: ADAPTS.out, ease: EASE.page }),
                ...to(copy.key, { ...copy.over }, undefined, { at: c + ADAPTS.out, duration: ADAPTS.over, ease: EASE.page }),
                ...to(copy.key, { ...copy.wait }, undefined, { at: c + ADAPTS.out + ADAPTS.over, duration: ADAPTS.wait, ease: EASE.page }),
                ...fill(copy.key, { at: c + ADAPTS.turn, duration: ADAPTS.turns }),
                ...to(copy.key, { x: 0, y: 0 }, undefined, { at: c + ADAPTS.down, duration: ADAPTS.drop, ease: EASE.page }),
              ];
            }),
        ];
      }),
    },
    // The dashed corner named once, beside the last department's top copy as it lands.
    { with: true, hold: LANDED - 0.3, moves: [rise(T.adapted.key, { at: 0 })] },
    { with: true, hold: 0.15, moves: [story("together", 1)] },
    // Every department now holds all three: the count says so.
    { hold: 0.2, moves: [rise(T.count.parts[1].key, { at: 0 })] },
  ),
});
