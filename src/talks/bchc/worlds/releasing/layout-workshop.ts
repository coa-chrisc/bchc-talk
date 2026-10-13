/**
 * Slide 33, setup guides (docs/bchc-talk-script.md, slide 33, They see): a
 * table seen from above, in sky, with a person in each of its six seats and
 * a laptop in front of each. A small guide booklet lands beside each
 * laptop, the first with "Setup guide" on its cover and the rest with lines
 * of writing; then a small tool takes shape on each screen (a form, a map, a
 * chart) and the AI agent beside it fills its ring. Over the table's far end
 * a small chat window, "Austin" in its bar, opens, its tail reaching down to
 * the table, and a short line types into it. Every place is a plain number;
 * every word is the script's.
 */
import { CONTENT_TOP, box, type Box } from "@/components/deck/kit";
import { breakAfter, shown } from "../../script/find";

const [SETUP_GUIDE, AUSTIN] = shown("workshops", "play");

/** The table, from above: a rounded slab 1240 by 270 under the story band, wide enough for a booklet beside each laptop. */
export const TABLE = { key: "rel.table", at: box(340, 590, 1240, 270), rx: 28 } as const;

/** What each screen shows when its tool has taken shape. */
export const TOOL_KINDS = ["form", "map", "chart"] as const;
export type ToolKind = (typeof TOOL_KINDS)[number];

/** A person 48 by 64; a laptop's screen 150 by 92 over a base 176 wide; the agent beside it, radius 14. */
const PERSON = { w: 48, h: 64 } as const;
export const SCREEN = { w: 150, h: 92, base: { w: 176, h: 12 } } as const;
const AGENT = { gap: 100, r: 14 } as const;
/**
 * A booklet 108 by 100, 12 px left of its laptop's base and level with the
 * laptop. The first carries its name on its cover on two lines in the label
 * type, right of its spine; the others carry two lines of writing where the
 * name would be, `writing` wide.
 */
export const BOOKLET = { w: 108, h: 100, gap: 12, spine: 12, pitch: 30, writing: [64, 52] } as const;
/**
 * The seats' middles along the table, three a side, 360 apart: each seat's
 * booklet, laptop and agent run from 208 px left of its middle to 114 px
 * right of it, so the three sit about 100 px in from either end.
 */
const SEAT_XS = [645, 1005, 1365] as const;

/** The booklet's name, broken where the author breaks it. */
const COVER = breakAfter(SETUP_GUIDE, "Setup");

/**
 * The six seats, three along the top and three along the foot, numbered in
 * the order their tools take shape: left to right along the top, then right
 * to left along the foot. Each has its person off the table's edge, its
 * laptop on the table in front of them, upright so its screen can be read,
 * its booklet at the laptop's left and the agent at its right. Only the
 * first seat's booklet is named: six names would say the same word six
 * times.
 */
export const SEATS = [0, 1, 2, 3, 4, 5].map((n) => {
  const top = n < 3;
  const x = top ? SEAT_XS[n] : SEAT_XS[5 - n];
  const person: Box = box(x - PERSON.w / 2, top ? TABLE.at.y - 20 - PERSON.h : TABLE.at.y + TABLE.at.h + 16, PERSON.w, PERSON.h);
  const screenY = top ? TABLE.at.y + 16 : TABLE.at.y + TABLE.at.h - 16 - SCREEN.base.h - SCREEN.h;
  const screen: Box = box(x - SCREEN.w / 2, screenY, SCREEN.w, SCREEN.h);
  const base = box(x - SCREEN.base.w / 2, screenY + SCREEN.h, SCREEN.base.w, SCREEN.base.h);
  const booklet = box(base.x - BOOKLET.gap - BOOKLET.w, screenY + (SCREEN.h + SCREEN.base.h - BOOKLET.h) / 2, BOOKLET.w, BOOKLET.h);
  return {
    key: `rel.seat.${n}`,
    laptopKey: `rel.seat.${n}.laptop`,
    toolKey: `rel.seat.${n}.tool`,
    agentKey: `rel.seat.${n}.agent`,
    guideKey: `rel.seat.${n}.guide`,
    top,
    person,
    screen,
    base,
    agent: { at: { x: x + AGENT.gap, y: screenY + SCREEN.h / 2 }, r: AGENT.r },
    /** A form on one, a map on the next, a chart on the third, round the table. */
    tool: TOOL_KINDS[n % 3],
    /** The guide booklet at the laptop's left, its name on the first one's cover. */
    guide: { at: booklet, lines: n === 0 ? COVER : [] },
  };
});

/** How far a booklet drops as it lands. */
export const BOOKLET_DROP = -18;

/**
 * The chat window in the top right corner: 300 by 132, its right edge 16 px
 * inside the stage's margin and its foot 14 px over the table, clear of the
 * top row's last person. A bar 44 high carries a small round picture and
 * the name; under it, one message bubble holds a short line that types out
 * in two runs. A tail from its foot, near its left end, reaches down to the
 * table's top edge, so the chat is with the people at the table.
 */
const CHAT_AT = box(1508, CONTENT_TOP.one + 4, 300, 132);
const BAR = 44;
const BUBBLE = box(CHAT_AT.x + 18, CHAT_AT.y + BAR + 16, 216, 56);
export const CHAT = {
  key: "rel.chat",
  bubbleKey: "rel.chat.bubble",
  at: CHAT_AT,
  rx: 12,
  bar: BAR,
  /** The tail: two points on the window's foot, and its tip on the table's top edge. */
  tail: {
    from: { x: CHAT_AT.x + 40, y: CHAT_AT.y + CHAT_AT.h },
    to: { x: CHAT_AT.x + 68, y: CHAT_AT.y + CHAT_AT.h },
    tip: { x: CHAT_AT.x + 30, y: TABLE.at.y },
  },
  /** The small round picture at the bar's left, and the name beside it. */
  face: { x: CHAT_AT.x + 30, y: CHAT_AT.y + BAR / 2, r: 11 },
  name: { x: CHAT_AT.x + 52, y: CHAT_AT.y + BAR / 2, text: AUSTIN },
  bubble: BUBBLE,
  /** The line's two runs, typed one after the other: each a bar of writing 10 high, left to right. */
  lines: [
    { key: "rel.chat.line.0", x: BUBBLE.x + 16, y: BUBBLE.y + 14, w: 176 },
    { key: "rel.chat.line.1", x: BUBBLE.x + 16, y: BUBBLE.y + 32, w: 104 },
  ],
} as const;

/** Every part slide 33 puts on the stage. */
export const WORKSHOP_OWN: readonly string[] = [
  TABLE.key,
  ...SEATS.flatMap((seat) => [seat.key, seat.laptopKey, seat.guideKey, seat.toolKey, seat.agentKey]),
  CHAT.key,
  CHAT.bubbleKey,
  ...CHAT.lines.map((line) => line.key),
];
