/**
 * The catalog world's moves, named for what they do, so a chain reads "the
 * card hops" and not which part goes where: the row of six steps (drawn,
 * travelled by its card one well at a time, ticked at Checks, lit at Live)
 * and the sender's status page under it, which lights each step as the card
 * reaches it; the hides that clear one slide's picture before the next
 * one's title lands; and how many elements carry each staggered id, so
 * `chain()` times a beat to its last element.
 */
import type { Move } from "@/components/deck/engine";
import { EASE, cardAt, chain, draw, fill, hide, pass, retitle, rise, show, to, wipe, type ChainBeat, type Counts } from "@/components/deck/kit";
import { picturesOf } from "../steps";
import { AUTOMATIC, CARD_AWAY, OPENING, ROW, SIX, STATUS, titleKey, titleOf } from "./layout";
import { storyKeysOf, storyLines } from "./layout-story";

type At = { at?: number; duration?: number };

/** The ids several elements carry: slide 1's three opening lines, a two-line title, and a story line set on two rows. */
export const COUNTS: Counts = Object.fromEntries(
  [
    [OPENING.key, 3] as const,
    ...picturesOf("catalog").flatMap((picture) => [
      ...(picture.id === "title" ? [] : [[titleKey(picture.id), titleOf(picture.id).lines.length] as const]),
      ...storyLines(picture.id).map((rows, i) => [storyKeysOf(picture.id)[i], rows.length] as const),
    ]),
  ].filter(([, count]) => count > 1),
);

/** One slide's title gives way to the next's. */
export const titleTo = (from: string, next: string) => retitle(titleKey(from), titleKey(next));

/** What the last slide left that this one does not carry: gone at the click, together, before the new title lands. */
export const clear = (keys: readonly string[]) => hide(keys, { duration: 0.3, stagger: 0, at: 0 });

/** A slide's first beat starts here: its title replaces the last one's, and the last one's picture and story lines go. */
export const leave = (from: string, next: string, parts: readonly string[]) => [...titleTo(from, next), ...clear([...parts, ...storyKeysOf(from)])];

/** One click: its beats chained (`at` seconds after the click), each beat timed to its last element. */
export const play = (beats: ChainBeat[], at?: number) => ({ moves: chain(beats, { at, counts: COUNTS }) });

/** The row is drawn once, in reading order: each well, its heading once the well is under way, and the link out of it. */
export const rowDraws = (at: number): Move[] => [
  ...draw(ROW.stations.map((station) => station.key), { duration: 0.75, stagger: 0.16, at }),
  ...rise(ROW.stations.map((station) => station.headKey), { duration: 0.5, stagger: 0.16, at: at + 0.35 }),
  ...draw(ROW.links.map((link) => link.key), { duration: 0.3, stagger: 0.16, at: at + 0.4 }),
];

/** The status page under the row draws with it: its outline, the line its steps sit on and each step's ring, then its name. */
export const statusDraws = (at: number): Move[] => [...draw(STATUS.page.key, { duration: 0.9, at }), ...rise(STATUS.name.key, { at: at + 0.4 })];

/** How long the card takes from one well to the next, and to come in from off the stage into the first. */
export const HOP = 0.4;
const ARRIVE = 0.5;

/** The status page's step `n` lights: the card has reached well `n`. */
const stepLights = (n: number, at: number): Move[] => fill(STATUS.steps[n].key, { duration: 0.3, at });

/** The card comes in from off the left edge and rests in the first well, Form; the status page's first step lights as it lands. */
export const cardArrives = (at: number): Move[] => [
  ...to(ROW.cardKey, { x: cardAt(ROW, 0) }, { x: CARD_AWAY }, { duration: ARRIVE, ease: EASE.page, at }),
  ...stepLights(0, at + ARRIVE),
];

/**
 * The row's card goes on from well `n - 1` to well `n`: the well it leaves
 * keeps a quiet fill, unless scripts worked there, and Draft and Checks take
 * the process's tint as it arrives, because the work happens while it sits
 * there. On the status page the line to step `n` lights as the card travels,
 * and the step lights as it lands.
 */
export function cardHops(n: number, at: number): Move[] {
  const timing = { duration: HOP, ease: EASE.draw, at };
  const leaves = ROW.stations[n - 1].doneKey;
  const arrives = ROW.stations[n].doneKey;
  return [
    ...to(ROW.cardKey, { x: cardAt(ROW, n) }, { x: cardAt(ROW, n - 1) }, timing),
    ...(AUTOMATIC.includes(leaves) ? [] : wipe(leaves, { from: "left", ...timing })),
    ...(AUTOMATIC.includes(arrives) ? wipe(arrives, { from: "left", ...timing }) : []),
    ...draw(STATUS.links[n - 1].key, timing),
    ...stepLights(n, at + HOP),
  ];
}

const LIVE = ROW.stations[ROW.stations.length - 1];
const TICKS = SIX.ticks.map((tick) => tick.key);

/** The checks pass, one tick after another on the Checks heading's line. */
export const checksPass = (at: number): Move[] => pass(TICKS, { duration: 0.3, stagger: 0.15, at });

/** The card has landed in Live: the well takes its fill and lights, the card takes the catalog's edge, so "it's on the site" is seen, and the status page reads "Published". */
export const liveLights = (at: number): Move[] => [
  ...wipe(LIVE.doneKey, { from: "left", duration: 0.4, at }),
  ...show(LIVE.litKey, { at }),
  ...to(ROW.cardKey, { "--landed": 1 }, { "--landed": 0 }, { duration: 0.5, ease: EASE.soft, at }),
  ...rise(STATUS.published.key, { at: at + 0.2 }),
];

/** The navy outline round the station where a person decides (catalog.css); the orange is the mark over it. */
export const personDecides = (opts: At) => draw(ROW.humanKey!, { duration: 0.9, ...opts });
