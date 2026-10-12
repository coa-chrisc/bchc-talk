/**
 * Slide 23, share one tool, get them all: the catalog's three empty places
 * across the top, named "The catalog" at their left, its count under them,
 * and three departments along the foot. Each department is a ring with its
 * name under it, a stack of three places for tools to its right, and its
 * agents at the stack's top left corner, named once ("AI agents") at the
 * left of Department C's. Each starts with the one tool it built, told
 * apart by its icon and name, in the foot of its stack; the two copies it
 * takes from the catalog fill the places over it, in the catalog's order,
 * so every stack ends two adapted copies over the department's own tool.
 *
 * No card ever crosses another. Every card travels by one lane, a clear row
 * between the count and the departments: a tool goes up from its stack to
 * the lane and along it to its catalog place; a copy comes straight down
 * from the catalog to the lane, along it to over its department's stack,
 * and down to the desk over the stack, beside the agents, while they adapt
 * it, then drops straight down into its place. The lower place fills first,
 * so a dropping card only ever passes empty places.
 */
import { AGENT_R, box, type Point } from "@/components/deck/kit";
import { breakAfter, shown } from "../../script/find";
import { CARD, CATALOG_SLOTS, LABEL_LINE, LINE, contentTop, groupOf, minus, quoted, slotsAt, type Icon } from "./layout";

const SHOWN = shown("together", "play");
/** The departments' names, the three tools' names, the word for the dashed corner, the agents' name and the catalog's, in the order the script lists them. */
const NAMES = SHOWN.slice(0, 3);
const TOOL_NAMES = SHOWN.slice(3, 6);
const ADAPTED = SHOWN[6];
const AGENTS = SHOWN[7];
const CATALOG = SHOWN[8];
const ICONS: readonly Icon[] = ["pin", "chart", "pipes"];
/** The count under the catalog: the one words its They see quotes that its steps do not list. */
const [COUNT] = quoted("together").filter((words) => !SHOWN.includes(words));

/**
 * The catalog's still, centred under the two-line title's story band. The
 * mount shows only the top of each card, so a tool's card fills its place;
 * the still below the mount's foot is cut off.
 */
const MOUNT_H = 88;
const FRAME = box(960 - CATALOG_SLOTS.w / 2, contentTop("together") + 16, CATALOG_SLOTS.w, MOUNT_H);
const SLOTS = slotsAt(FRAME, MOUNT_H);
/** A tool in the catalog: a card in the middle of its place. */
const listedAt = (k: number): Point => ({ x: SLOTS[k].x + (SLOTS[k].w - CARD.w) / 2, y: SLOTS[k].y + (SLOTS[k].h - CARD.h) / 2 });

/**
 * Each department: its ring with its name under it, its stack of three
 * places to the ring's right, and its agents just left of the desk, the
 * place over the stack. The lane runs over the desks, clear of them and of
 * the count.
 */
const RING = { x: [190, 750, 1310], y: 910, r: 30 } as const;
const STACK = { dx: 100, top: 828, pitch: 58 } as const;
const AGENT = { dx: -42, y: 784 } as const;
const DESK_Y = AGENT.y - CARD.h / 2;
const LANE_Y = DESK_Y - CARD.h - 20;
const NAME_W = 180;
/** The foot of the stack holds the department's own tool. */
const OWN_PLACE = 2;

const stackX = (i: number) => RING.x[i] + STACK.dx;
const place = (i: number, k: number): Point => ({ x: stackX(i), y: STACK.top + k * STACK.pitch });
/** Where a department's copy waits while its agents adapt it: over the stack, so it drops straight down. */
const deskAt = (i: number): Point => ({ x: stackX(i), y: DESK_Y });
const others = (i: number) => [0, 1, 2].filter((k) => k !== i);

export const TOGETHER = {
  ...groupOf("together"),
  frame: { key: "together.frame", at: FRAME, stills: [CATALOG_SLOTS], stillH: CATALOG_SLOTS.h },
  slots: SLOTS,
  tools: TOOL_NAMES.map((name, k) => ({ name, icon: ICONS[k] })),
  departments: RING.x.map((x, i) => ({
    key: `together.dept.${i}`,
    at: { x, y: RING.y },
    r: RING.r,
    /** Its name, under its ring: it draws with the ring. */
    name: { text: NAMES[i], at: box(x - NAME_W / 2, RING.y + RING.r + 10, NAME_W, LABEL_LINE) },
    /** Its stack's three places, as one part. */
    wells: { key: `together.dept.${i}.wells`, at: [0, 1, 2].map((k) => place(i, k)) },
    /** The tool it built, in the foot of its stack. */
    own: { key: `together.dept.${i}.own`, at: place(i, OWN_PLACE), tool: i },
    /** Its agents, at the left of its desk. */
    agent: { key: `together.agent.${i}`, at: { x: stackX(i) + AGENT.dx, y: AGENT.y } },
  })),
  /** Each department's tool going up into the catalog: a card drawn in its catalog place that starts over the department's own, which stays. */
  posts: SLOTS.map((_, k) => ({
    key: `together.post.${k}`,
    at: listedAt(k),
    tool: k,
    travel: minus(place(k, OWN_PLACE), listedAt(k)),
    /** Where it meets the lane, straight up from its department's stack. */
    lane: minus({ x: stackX(k), y: LANE_Y }, listedAt(k)),
  })),
  /**
   * Each department's copies of the other two tools, in the catalog's order
   * down the places over its own: drawn in their place in its stack, they
   * start over the tool in the catalog, come down to the lane, along it to
   * over the stack and down to the desk, turn from
   * the catalog's card to the department's own with a dashed corner as the
   * agents adapt them (`--k`), and drop into the stack. `turn` is the order
   * a department takes them in: the lower place first.
   */
  copies: RING.x.flatMap((_, i) =>
    others(i).map((k, row) => {
      const at = place(i, row);
      return {
        key: `together.copy.${i}.${k}`,
        dept: i,
        tool: k,
        row,
        turn: 1 - row,
        at,
        /** Where it starts, meets the lane, leaves it and waits, as offsets from its place in the stack. */
        start: minus(listedAt(k), at),
        out: minus({ x: listedAt(k).x, y: LANE_Y }, at),
        over: minus({ x: stackX(i), y: LANE_Y }, at),
        wait: minus(deskAt(i), at),
      };
    }),
  ),
  /** The count under the catalog, in two parts: the first once every tool is shared, the second once every department holds all three. */
  count: {
    at: box(FRAME.x, FRAME.y + FRAME.h + 12, FRAME.w, LINE),
    parts: breakAfter(COUNT, "shared,").map((text, n) => ({ key: `together.count.${n}`, text })),
  },
  /** "AI agents", once, at the left of Department C's agents: clear of Department B's desk and under the lane. */
  agents: { key: "together.agents", text: AGENTS, at: box(stackX(2) + AGENT.dx - AGENT_R - 12 - 160, AGENT.y - LABEL_LINE / 2, 160, LABEL_LINE) },
  /** "The catalog", at the left of its strip, level with it: in the row the strip holds, so it pushes nothing into the title or the departments. */
  catalog: { key: "together.catalog", text: CATALOG, at: box(FRAME.x - 16 - 200, FRAME.y + (MOUNT_H - LABEL_LINE) / 2, 200, LABEL_LINE) },
  /** "Adapted", once, beside the dashed corner of Department C's top copy. */
  adapted: { key: "together.adapted", text: ADAPTED, at: box(stackX(2) + CARD.w + 16, place(2, 0).y + (CARD.h - LABEL_LINE) / 2, 150, LABEL_LINE) },
};
