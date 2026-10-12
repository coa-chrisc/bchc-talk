/**
 * Part 5, one click a slide (docs/bchc-talk-script.md, slides 29 to 33a):
 * each click plays its slide's whole chain, beat after beat, with its story
 * lines landing beside the beats they explain. A slide's first beat clears
 * the slide before it at 0 and hands the title over. The camera stays at
 * HOME. Slide 29, the magic sauce, is in world-sauce.ts and slide 33a, the
 * help spreading, in steps-spreads.ts; each slide's places are in its layout
 * module.
 */
import type { WorldEntry } from "@/components/deck/engine";
import { DUR, EASE, RISE, chain, draw, hide, retitle, rise, show, to, wipe, type Counts } from "@/components/deck/kit";
import { copyFor, picturesOf, picture, story, worldTitle } from "../steps";
import { OWN, TITLES } from "./layout";
import { OURS, PAGES, YOURS } from "./layout-binders";
import { CONTENTS, FLAPS, LINK, PACK, TOOLS } from "./layout-pack";
import { CARDS, CATALOG, SLOT, STACK, WAITING } from "./layout-source";
import { HELPER, HELPER_TURN, PLANNED, SEATS, TABLE } from "./layout-workshop";
import { Scene } from "./scene";
import { spreadsSteps } from "./steps-spreads";
import { releasingSteps } from "./world-sauce";

/** How many elements a title's id has: one a line. A move's stagger runs across them. */
const counts: Counts = Object.fromEntries(Object.values(TITLES).map((title) => [title.key, title.lines.length]));

/** A drawing whose lines draw on as its fills come up: one move for the whole drawing. */
const drawn = (key: string | readonly string[], opts: Parameters<typeof to>[3] = {}) => to(key, { "--d": 1, "--k": 1 }, { "--d": 0, "--k": 0 }, { duration: DUR.draw, ease: EASE.draw, ...opts });

/** What one slide leaves on the stage goes, at the click, in 0.3 s; its title goes with the retitle. */
const clear = (pictureId: keyof typeof OWN) => {
  const title = TITLES[pictureId].key;
  return hide(
    OWN[pictureId].filter((key) => key !== title),
    { duration: 0.3, stagger: 0, at: 0 },
  );
};

/* 30. The agent pack: its package draws beside three coding tools; its flaps open, its four contents rise out one at a time with their labels, settle back in onto its packing list, and the flaps close; a navy line draws out from it to the tools, and a copy of it rides the line into each. */

/** Seconds between one content rising out of the package and the next, and between one settling back and the next. */
export const RISE_APART = 0.45;
export const SETTLE_APART = 0.2;
/** A content's trip out of the package, and back in. */
const OUT = 0.8;
const BACK = 0.6;
const flaps = FLAPS.map((flap) => flap.key);
/** A copy's pace along the line, in px a second, and the seconds between one copy setting off and the next: enough that each is clear of the one ahead on the trunk. */
export const COPY_PACE = 1100;
export const COPY_APART = 0.4;
/**
 * A copy comes up behind the package's front and rides its legs at one pace:
 * easing in on the first, out on the last, through each turn without a stop
 * (an eased leg takes twice as long as a steady one of its length).
 */
const ride = (copy: (typeof TOOLS)[number]["copy"], at: number) => {
  let next = at;
  return [
    ...show(copy.key, { duration: 0.01, ease: "none", at }),
    ...copy.legs.flatMap(({ length, ...stop }, n, legs) => {
      const first = n === 0;
      const last = n === legs.length - 1;
      const ease = first && last ? "power1.inOut" : first ? "power1.in" : last ? "power1.out" : "none";
      const duration = ((first || last ? 2 : 1) * length) / COPY_PACE;
      const leg = to(copy.key, stop, first ? copy.start : undefined, { duration, ease, at: next });
      next += duration;
      return leg;
    }),
  ];
};
const skills = picture("skills", {
  play: {
    moves: chain(
      [
        { moves: [clear("releasing"), retitle(TITLES.releasing.key, TITLES.skills.key)] },
        {
          // The package draws, shut, with its name; the three coding tools draw on the right, each named in its bar.
          moves: [
            draw(PACK.key, { at: 0 }),
            draw(flaps, { duration: 0.6, stagger: 0, at: 0.3 }),
            show(PACK.name.key, { at: 0.5 }),
            draw(
              TOOLS.map((tool) => tool.key),
              { stagger: 0.16, at: 0.5 },
            ),
          ],
          with: true,
          hold: 0.3,
        },
        { moves: story("skills", 0), with: true, hold: 0.6 },
        // The flaps open up and out.
        { moves: FLAPS.map((flap) => to(flap.key, { "--r": flap.open }, { "--r": 0 }, { duration: 0.6, ease: EASE.page, at: 0 })), hold: 0.4 },
        {
          // One at a time, each content rises out of the package and across to its place in the row above it, its label with it.
          moves: CONTENTS.flatMap((item, i) => [
            ...to(item.key, { autoAlpha: 1 }, { autoAlpha: 0 }, { duration: 0.01, ease: "none", at: i * RISE_APART }),
            ...to(item.key, { "--x": 0, "--y": 0 }, item.inside, { duration: OUT, ease: EASE.page, at: i * RISE_APART }),
          ]),
          hold: 0.1,
        },
        { moves: story("skills", 1), with: true, hold: 0.3 },
        {
          // Held to be read, they settle back in, last first, each one's label landing on the packing list as it goes behind the front.
          moves: CONTENTS.flatMap((item, n) => {
            const at = (CONTENTS.length - 1 - n) * SETTLE_APART;
            return [
              ...to(item.key, item.inside, undefined, { duration: BACK, ease: EASE.page, at }),
              ...hide(item.key, { duration: 0.01, at: at + BACK }),
              ...rise(item.listed.key, { duration: 0.5, at: at + BACK - 0.2 }),
            ];
          }),
          hold: 1.2,
        },
        // The flaps close.
        { moves: to(flaps, { "--r": 0 }, undefined, { duration: 0.5, ease: EASE.page, stagger: 0, at: 0 }), hold: 0.2 },
        // The line draws out from the package's side to the three tools.
        { moves: draw(LINK.key, { duration: 0.6 }), hold: 0.2 },
        // One after another, a copy of the package comes out from behind its front and rides the line into each coding tool.
        { moves: TOOLS.flatMap((tool, i) => ride(tool.copy, i * COPY_APART)), hold: 0.1 },
      ],
      { counts },
    ),
  },
});

/* 31. Our source code: the catalog's last row draws with its empty slot, a dashed "New project"; the stack of Austin source code comes in beside it and waits behind its "Awaiting City of Austin approval" tag, and is still waiting at the end. */

const source = picture("source", {
  play: {
    moves: chain(
      [
        { moves: [clear("skills"), retitle(TITLES.skills.key, TITLES.source.key)] },
        {
          // The catalog's frame and its last row's two cards draw.
          moves: [
            draw(CATALOG.key, { at: 0 }),
            drawn(
              CARDS.map((card) => card.key),
              { stagger: 0.16, at: 0.4 },
            ),
          ],
          with: true,
          hold: 0.3,
        },
        // The empty slot at the row's end opens from the top.
        { moves: wipe(SLOT.key, { from: "top" }), hold: 0.2 },
        {
          // The stack of tiles comes in from the right and stops beside the catalog, its name over it.
          moves: [
            // The stack travels by --x (Part), so it arrives by --x too: a move's x would be overridden by the Part's CSS transform.
            to(STACK.key, { "--x": 0, autoAlpha: 1 }, { ...STACK.from, autoAlpha: 0 }, { duration: 0.9, ease: EASE.page, at: 0 }),
            rise(STACK.name.key, { at: 0.3 }),
          ],
          hold: 0.4,
        },
        // It waits behind its tag.
        { moves: wipe(WAITING.key, { from: "left" }), hold: 0.3 },
        { moves: story("source", 0), with: true, hold: 0.2 },
        { moves: story("source", 1), hold: 1.6 },
      ],
      { counts },
    ),
  },
});

/* 32. Our templates: our binder's pages slide out one at a time and land as blank copies in Yours, where each is filled in, in your own colors. */

/** Seconds between one page setting off for Yours and the next. */
export const PAGE_APART = 0.6;
/** A page's trip from our binder to the same place in Yours. */
export const PAGE_TRIP = 0.8;
const design = picture("design-yours", {
  play: {
    moves: chain(
      [
        { moves: [clear("source"), retitle(TITLES.source.key, TITLES["design-yours"].key)] },
        {
          // Our binder draws with its name, and its four pages come up in it.
          moves: [
            draw(OURS.key, { at: 0 }),
            rise(OURS.name.key, { at: 0.3 }),
            rise(
              PAGES.map((page) => page.ours.key),
              { duration: DUR.base, stagger: 0.12, at: 0.5 },
            ),
          ],
          with: true,
          hold: 0.3,
        },
        { moves: story("design-yours", 0), with: true, hold: 0.6 },
        // Yours draws, empty, with its name.
        { moves: [draw(YOURS.key, { at: 0 }), rise(YOURS.name.key, { at: 0.3 })], hold: 0.5 },
        {
          // A blank copy of each page slides out from under ours and lands in the same place in Yours, where it is filled in.
          moves: PAGES.flatMap((page, i) => {
            const at = i * PAGE_APART;
            return [
              ...show(page.yours.key, { duration: 0.15, at }),
              ...to(page.yours.key, { "--x": 0, "--y": 0 }, page.yours.from, { duration: PAGE_TRIP, ease: EASE.page, at }),
              ...drawn(page.yours.fillKey, { duration: 0.6, at: at + PAGE_TRIP }),
            ];
          }),
          hold: 0.3,
        },
        { moves: story("design-yours", 1), hold: 0.4 },
      ],
      { counts },
    ),
  },
});

/* 33. Help getting set up: a workshop table from above, a person and a laptop at each seat; the Austin team's helper goes round, and a small tool takes shape on each screen as they reach it. */

/** The helper's trip: to each seat in turn, round the table's right end between the top and the foot. */
const TOUR = [
  ...SEATS.slice(0, 3).map((seat, i) => ({ point: seat.helper, above: true, seat, hop: i === 0 ? 0.6 : 0.45 })),
  { point: HELPER_TURN, above: true, seat: undefined, hop: 0.4 },
  ...SEATS.slice(3).map((seat, i) => ({ point: seat.helper, above: false, seat, hop: i === 0 ? 0.4 : 0.45 })),
];
/** Seconds the helper stays at a seat while its tool takes shape. */
export const DWELL = 0.35;
/** When the helper reaches each stop on the tour, from the tour's start. */
export const ARRIVALS = TOUR.reduce<number[]>((times, stop, i) => [...times, (i ? times[i - 1] + (TOUR[i - 1].seat ? DWELL : 0) : 0) + stop.hop], []);
const workshops = picture("workshops", {
  play: {
    moves: chain(
      [
        { moves: [clear("design-yours"), retitle(TITLES["design-yours"].key, TITLES.workshops.key)] },
        {
          // The table draws; then each seat's person, laptop and agent.
          moves: [
            draw(TABLE.key, { at: 0 }),
            draw(
              SEATS.map((seat) => seat.key),
              { stagger: 0.08, at: 0.4 },
            ),
            draw(
              SEATS.map((seat) => seat.laptopKey),
              { stagger: 0.08, at: 0.6 },
            ),
            draw(
              SEATS.map((seat) => seat.agentKey),
              { duration: 0.7, stagger: 0.08, at: 0.8 },
            ),
          ],
          with: true,
          hold: 0.3,
        },
        { moves: story("workshops", 0), with: true, hold: 0.6 },
        {
          // The Austin team's helper comes up at the table's left end, named over their head. Both travel by --x and --y (Part).
          moves: [
            to(HELPER.key, { autoAlpha: 1, "--y": 0 }, { autoAlpha: 0, "--x": 0, "--y": RISE }, { duration: 0.6, ease: EASE.out, at: 0 }),
            to(HELPER.nameKey, { autoAlpha: 1, "--y": 0 }, { autoAlpha: 0, "--x": 0, "--y": RISE }, { duration: 0.6, ease: EASE.out, at: 0.1 }),
          ],
          hold: 0.3,
        },
        {
          // They go round; at each seat its tool takes shape on the screen and the agent beside it fills its ring.
          moves: TOUR.flatMap((stop, i) => {
            const arrive = ARRIVALS[i];
            const place = HELPER.at(stop.point, stop.above);
            return [
              ...to(HELPER.key, place.helper, undefined, { duration: stop.hop, ease: EASE.draw, at: arrive - stop.hop }),
              ...to(HELPER.nameKey, place.name, undefined, { duration: stop.hop, ease: EASE.draw, at: arrive - stop.hop }),
              ...(stop.seat
                ? [...drawn(stop.seat.toolKey, { duration: 0.6, at: arrive }), ...to(stop.seat.agentKey, { "--k": 1 }, { "--k": 0 }, { duration: 0.5, ease: EASE.draw, at: arrive })]
                : []),
            ];
          }),
          hold: 0.2,
        },
        { moves: story("workshops", 1), with: true, hold: 1.2 },
        // It's planned, not running yet.
        { moves: show(PLANNED.key), hold: 0.3 },
      ],
      { counts },
    ),
  },
});

export const RELEASING_STEPS = [...releasingSteps, ...skills, ...source, ...design, ...workshops, ...spreadsSteps];

export const releasingEntry: WorldEntry = {
  title: worldTitle("releasing"),
  world: { id: "releasing", Scene, steps: RELEASING_STEPS },
  copy: copyFor(picturesOf("releasing")),
};
