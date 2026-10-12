/**
 * Slide 30, the agent pack (docs/bchc-talk-script.md, slide 30, They see): a
 * package labelled "Agent pack", in the process's colour, opens its two
 * flaps; its four contents rise out one at a time, each with its label, and
 * spread into a row above it; they settle back in, each label landing on the
 * package's packing list as it goes, and the flaps close. Copies of the
 * package then ride a navy line out of it into three coding tools, stacked on
 * the right, each named in its top bar. Every place is a plain number; every
 * word is the script's.
 */
import { CONTENT_TOP, box, type Point } from "@/components/deck/kit";
import { shown } from "../../script/find";

const LABELS = shown("skills", "play");
/** The script's labels, in its order: the package's name, its four contents, and the three coding tools. */
export const PACK_NAME = LABELS[0];
const CONTENT_NAMES = LABELS.slice(1, 5);
const TOOL_NAMES = LABELS.slice(5, 8);

/**
 * The package: a box 440 by 240 on the stage's left, its name across the top
 * of its front and its packing list under that. It sits as high as its flaps
 * allow (each, passing upright, stays under the story's first line and over
 * none of the second's letters), so the shut package and the three tools
 * share their middle and the end frame leaves no empty corner.
 */
const PACK_AT = box(356, 690, 440, 240);
export const PACK = {
  key: "rel.pack",
  at: PACK_AT,
  rx: 10,
  /** Its name, on the front: 32 px semibold, its middle 46 below the box's top. */
  name: { key: "rel.pack.name", text: PACK_NAME, at: { x: PACK_AT.x + PACK_AT.w / 2, y: PACK_AT.y + 46 } },
} as const;
export const PACK_CENTRE: Point = { x: PACK.at.x + PACK.at.w / 2, y: PACK.at.y + PACK.at.h / 2 };

/**
 * The two flaps: each half the box's width, lying shut along its top, hinged
 * at its outer corner. Open, each turns 170 degrees up and over, to lie out
 * nearly flat beside the box's top: under the contents' row, inside the
 * stage's margin, and, passing upright, under the story's first line.
 */
const FLAP = { h: 12, open: 172 } as const;
export const FLAPS = [-1, 1].map((side) => {
  const hinge: Point = { x: side < 0 ? PACK.at.x : PACK.at.x + PACK.at.w, y: PACK.at.y };
  return {
    key: `rel.pack.flap.${side < 0 ? "l" : "r"}`,
    hinge,
    at: box(side < 0 ? PACK.at.x : PACK_CENTRE.x, PACK.at.y - FLAP.h, PACK.at.w / 2, FLAP.h),
    /** Open: the left flap turns anticlockwise, the right one clockwise. */
    open: side * FLAP.open,
  };
});

/** Where a flap's free end is when it is open: for checking it stays clear of the contents and on the stage. */
export const flapTip = (flap: (typeof FLAPS)[number]): Point => {
  const rad = (flap.open * Math.PI) / 180;
  const reach = PACK.at.w / 2;
  const dir = flap.hinge.x === PACK.at.x ? 1 : -1;
  return { x: flap.hinge.x + dir * reach * Math.cos(rad), y: flap.hinge.y + dir * reach * Math.sin(rad) };
};

/**
 * The four contents, as cards 208 by 112 in a row above the package, 16
 * apart, centred on it, under the story band. Each starts inside the
 * package, hidden behind its front, spread across the box, and rises out
 * and across to its place. Its drawing sits in its top half and its label
 * under it.
 */
const CARD = { w: 208, h: 112, gap: 16, y: CONTENT_TOP.two + 8 } as const;
const ROW_W = 4 * CARD.w + 3 * CARD.gap;
/** The packing list on the package's front: two columns of two, 26 px, under its name. */
const LIST = { x: [PACK.at.x + 40, PACK_CENTRE.x + 16], y: [PACK.at.y + 124, PACK.at.y + 176] } as const;
export const CONTENTS = CONTENT_NAMES.map((text, i) => {
  const at = box(PACK_CENTRE.x - ROW_W / 2 + i * (CARD.w + CARD.gap), CARD.y, CARD.w, CARD.h);
  const centre: Point = { x: at.x + at.w / 2, y: at.y + at.h / 2 };
  /** Inside the package: spread evenly across its opening, 4 px in from its sides, low enough that the front hides the whole card. */
  const inside: Point = { x: PACK.at.x + CARD.w / 2 + 4 + (i * (PACK.at.w - CARD.w - 8)) / 3, y: PACK.at.y + PACK.at.h - CARD.h / 2 - 4 };
  return {
    key: `rel.pack.item.${i}`,
    text,
    at,
    centre,
    /** Its drawing's middle, in the card's top half. */
    art: { x: centre.x, y: at.y + 38 },
    /** Its label's middle, near the card's foot. */
    label: { x: centre.x, y: at.y + at.h - 26 },
    /** Where it starts and settles back to: inside the package. */
    inside: { "--x": inside.x - centre.x, "--y": inside.y - centre.y },
    /** Its line on the packing list: middle left of the words. */
    listed: { key: `rel.pack.list.${i}`, at: { x: LIST.x[i % 2], y: LIST.y[Math.floor(i / 2)] } },
  };
});

/**
 * The three coding tools, stacked on the right, each a window 520 by 112 with
 * its name in a 44 px top bar, and in its middle the place a copy of the
 * package comes to. The stack's middle is level with the shut package's,
 * flaps and all.
 */
const TOOL = { x: 1240, w: 520, h: 112, bar: 44, pitch: 128 } as const;
const STACK_H = 2 * TOOL.pitch + TOOL.h;
const TOOLS_TOP = Math.round((PACK.at.y - FLAP.h + PACK.at.y + PACK.at.h) / 2 - STACK_H / 2);
const COPY = { w: 84, h: 48 } as const;
/** Where each copy's middle comes to rest in its window, under the bar. */
const slotOf = (i: number): Point => ({ x: TOOL.x + TOOL.w / 2, y: TOOLS_TOP + i * TOOL.pitch + TOOL.bar + (TOOL.h - TOOL.bar) / 2 });

/**
 * The line that joins the package to the tools, navy: one trunk leaves the
 * package's right side level with the middle tool's copy and runs straight
 * into that window; 120 px short of the windows it splits, a branch turning
 * up to the first tool and one down to the last. Each branch ends at its
 * copy's left side. Each route is its corners, in order, every leg level or
 * upright; the line rounds its turns into the windows by CORNER, and meets
 * the trunk square, so the split reads as one clean joint.
 */
const TRUNK: Point = { x: PACK.at.x + PACK.at.w, y: slotOf(1).y };
const SPLIT_X = TOOL.x - 120;
const CORNER = 14;
const ROUTES = TOOL_NAMES.map((_, i): Point[] => {
  const slot = slotOf(i);
  const end = { x: slot.x - COPY.w / 2, y: slot.y };
  return slot.y === TRUNK.y ? [TRUNK, end] : [TRUNK, { x: SPLIT_X, y: TRUNK.y }, { x: SPLIT_X, y: slot.y }, end];
});
/** A route as a path, its turns after the split rounded. */
const pathOf = (route: readonly Point[]) =>
  route
    .map((p, n) => {
      if (n === 0) return `M${p.x} ${p.y}`;
      if (n === 1 || n === route.length - 1) return `L${p.x} ${p.y}`;
      const a = route[n - 1];
      const b = route[n + 1];
      const into = { x: Math.sign(p.x - a.x), y: Math.sign(p.y - a.y) };
      const out = { x: Math.sign(b.x - p.x), y: Math.sign(b.y - p.y) };
      return `L${p.x - into.x * CORNER} ${p.y - into.y * CORNER}Q${p.x} ${p.y} ${p.x + out.x * CORNER} ${p.y + out.y * CORNER}`;
    })
    .join("");
export const LINK = { key: "rel.pack.link", routes: ROUTES, paths: ROUTES.map(pathOf) } as const;

export const TOOLS = TOOL_NAMES.map((name, i) => {
  const y = TOOLS_TOP + i * TOOL.pitch;
  const at = box(TOOL.x, y, TOOL.w, TOOL.h);
  const centre = slotOf(i);
  /** The copy's trip, as offsets from its place: from wholly behind the package's front, level with the trunk, along its branch's corners to its place. */
  const offset = (p: Point) => ({ "--x": p.x - centre.x, "--y": p.y - centre.y });
  const start: Point = { x: PACK.at.x + PACK.at.w - 6 - COPY.w / 2, y: TRUNK.y };
  const stops = [start, ...ROUTES[i].slice(1, -1), centre];
  return {
    key: `rel.tool.${i}`,
    at,
    bar: y + TOOL.bar,
    name: { text: name, at: { x: centre.x, y: y + TOOL.bar / 2 } },
    copy: {
      key: `rel.copy.${i}`,
      at: box(centre.x - COPY.w / 2, centre.y - COPY.h / 2, COPY.w, COPY.h),
      centre,
      /** Where the copy waits before its trip: hidden behind the package's front. */
      start: offset(start),
      /** Each leg of its trip: where it ends, and how long it is in px. */
      legs: stops.slice(1).map((p, n) => ({ ...offset(p), length: Math.abs(p.x - stops[n].x) + Math.abs(p.y - stops[n].y) })),
    },
  };
});

/** Every part slide 30 puts on the stage. */
export const PACK_OWN: readonly string[] = [
  PACK.key,
  PACK.name.key,
  ...FLAPS.map((flap) => flap.key),
  ...CONTENTS.flatMap((item) => [item.key, item.listed.key]),
  LINK.key,
  ...TOOLS.flatMap((tool) => [tool.key, tool.copy.key]),
];
