/**
 * Slide 33, help getting set up (docs/bchc-talk-script.md, slide 33, They
 * see): a workshop table seen from above, in sky, with a person in each of
 * its six seats and a laptop in front of each. A person labelled "Austin
 * team" goes round the table from seat to seat; as they reach each seat, a
 * small tool takes shape on its screen (a form, a map, a chart) and the AI
 * agent beside it fills its ring. A small "Planned" tag is pinned on the
 * table's corner. Every place is a plain number; every word is the script's.
 */
import { box, type Box, type Point } from "@/components/deck/kit";
import { shown } from "../../script/find";

const [AUSTIN_TEAM, PLANNED_TAG] = shown("workshops", "play");

/** The table, from above: a rounded slab 1080 by 270 in the middle of the room under the story band. */
export const TABLE = { key: "rel.table", at: box(420, 590, 1080, 270), rx: 28 } as const;

/** What each screen shows when its tool has taken shape. */
export const TOOL_KINDS = ["form", "map", "chart"] as const;
export type ToolKind = (typeof TOOL_KINDS)[number];

/** A person 48 by 64; a laptop's screen 150 by 92 over a base 176 wide; the agent beside it, radius 14. */
const PERSON = { w: 48, h: 64 } as const;
export const SCREEN = { w: 150, h: 92, base: { w: 176, h: 12 } } as const;
const AGENT = { gap: 100, r: 14 } as const;
/** The seats' middles along the table, three a side. */
const SEAT_XS = [660, 960, 1260] as const;
/** Where the helper stands: this far right of the person they are helping. */
const BESIDE = 82;

/**
 * The six seats, three along the top and three along the foot, numbered the
 * way the helper goes round: left to right along the top, then right to
 * left along the foot. Each has its person off the table's edge, its laptop
 * on the table in front of them, upright so its screen can be read, and the
 * agent at the laptop's right.
 */
export const SEATS = [0, 1, 2, 3, 4, 5].map((n) => {
  const top = n < 3;
  const x = top ? SEAT_XS[n] : SEAT_XS[5 - n];
  const person: Box = box(x - PERSON.w / 2, top ? TABLE.at.y - 20 - PERSON.h : TABLE.at.y + TABLE.at.h + 16, PERSON.w, PERSON.h);
  const screenY = top ? TABLE.at.y + 16 : TABLE.at.y + TABLE.at.h - 16 - SCREEN.base.h - SCREEN.h;
  const screen: Box = box(x - SCREEN.w / 2, screenY, SCREEN.w, SCREEN.h);
  const helper: Point = { x: x + BESIDE, y: person.y + PERSON.h / 2 };
  return {
    key: `rel.seat.${n}`,
    laptopKey: `rel.seat.${n}.laptop`,
    toolKey: `rel.seat.${n}.tool`,
    agentKey: `rel.seat.${n}.agent`,
    top,
    person,
    screen,
    base: box(x - SCREEN.base.w / 2, screenY + SCREEN.h, SCREEN.base.w, SCREEN.base.h),
    agent: { at: { x: x + AGENT.gap, y: screenY + SCREEN.h / 2 }, r: AGENT.r },
    /** A form on one, a map on the next, a chart on the third, round the table. */
    tool: TOOL_KINDS[n % 3],
    /** Where the helper stands at this seat, the middle of their figure. */
    helper,
  };
});

/**
 * The helper: a person in sky, help's colour, who comes in at the table's
 * left end, goes along the top from seat to seat, round the right end and
 * back along the foot. Their name travels with them, over their head along
 * the top and under their feet along the foot, so it never sits on the table.
 */
const HELPER_START: Point = { x: TABLE.at.x - 100, y: TABLE.at.y + TABLE.at.h / 2 };
/** Round the table's right end, between the top's last seat and the foot's first. */
export const HELPER_TURN: Point = { x: TABLE.at.x + TABLE.at.w + 100, y: TABLE.at.y + TABLE.at.h / 2 };
const NAME_GAP = 26;
const nameAt = (p: Point, above: boolean): Point => ({ x: p.x, y: above ? p.y - PERSON.h / 2 - NAME_GAP : p.y + PERSON.h / 2 + NAME_GAP });
export const HELPER = {
  key: "rel.helper",
  nameKey: "rel.helper.name",
  text: AUSTIN_TEAM,
  start: HELPER_START,
  person: box(HELPER_START.x - PERSON.w / 2, HELPER_START.y - PERSON.h / 2, PERSON.w, PERSON.h),
  /** The name's middle where the helper starts: over their head. */
  name: nameAt(HELPER_START, true),
  /** The helper's offset from the start at a point, and their name's offset from where it starts. */
  at: (p: Point, above: boolean) => {
    const name = nameAt(p, above);
    const start = nameAt(HELPER_START, true);
    return { helper: { "--x": p.x - HELPER_START.x, "--y": p.y - HELPER_START.y }, name: { "--x": name.x - start.x, "--y": name.y - start.y } };
  },
} as const;

/**
 * The tag pinned on the table's top right corner: across the table's top
 * edge, 24 px past its right end, on a white ground that covers the edge
 * under it, so it reads as a label on the workshop itself.
 */
const TAG = { w: 160, h: 44, past: 24 } as const;
export const PLANNED = {
  key: "rel.planned",
  at: box(TABLE.at.x + TABLE.at.w + TAG.past - TAG.w, TABLE.at.y - TAG.h / 2, TAG.w, TAG.h),
  text: PLANNED_TAG,
} as const;

/** Every part slide 33 puts on the stage. */
export const WORKSHOP_OWN: readonly string[] = [
  TABLE.key,
  ...SEATS.flatMap((seat) => [seat.key, seat.laptopKey, seat.toolKey, seat.agentKey]),
  HELPER.key,
  HELPER.nameKey,
  PLANNED.key,
];
