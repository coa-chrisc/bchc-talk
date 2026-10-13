/**
 * Slide 38s of the start world, data security and governance: where every
 * part goes, the id it takes and the words it holds, read from the script.
 * Your department's outline inside a fence of the accounts your city
 * approves, seen from above, with a gate in the fence's left side; public
 * data goes in through the gate, personal or health data stops outside it;
 * inside, each change takes your approver's mark and lands on the GitHub
 * record, and the last one is undone.
 */
import { box, type Box, type Point } from "@/components/deck/kit";
import { labelsOf, personAt } from "./layout";

const [ACCOUNTS, YOUR_DEPARTMENT, PUBLIC_DATA, PERSONAL_DATA, APPROVER, GITHUB_RECORD, UNDONE] =
  labelsOf("safe");

/** The fence, under the two-line title's story band, from the tables' side of the frame to its right margin, ending on the footer's keep-clear line as 38b's outlines do. */
const FENCE = box(540, 580, 1284, 388);
/** The gate's opening in the fence's left side, and the doorway in your department's wall behind it: tall enough for a table and the name over it. */
const GATE = { top: 680, bottom: 888 };
/** Your department, inside the fence, a clear gap from it all round, and its name inside its top left corner, over the doorway. */
const DEPT = box(572, 612, 1220, 324);
const DEPT_NAME = { x: DEPT.x + 24, y: DEPT.y + 34 };
/** How far apart the fence's posts stand along it, and how big each is. */
const POST = { pitch: 92, size: 10 };
/** A data table, and the lane through the gate every table travels along: its top. */
const TABLE = { w: 140, h: 104 };
const LANE_Y = (GATE.top + GATE.bottom) / 2 - TABLE.h / 2;
/** A table's name sits over it, its right end at the table's right edge, so a name never reaches past the table toward the fence. */
const NAME_ABOVE = 24;
/**
 * Where the two tables wait outside at the left, before either moves to the
 * lane: personal or health data over it, high enough that the open gate's
 * leaf passes under it, and public data under it, so neither crosses the
 * other's name on its way to the lane. Far enough in that each name, set
 * over its table's right end, starts inside the stage's margin.
 */
const WAIT_X = 285;
const WAIT_Y = { personal: 560, public: 852 };
/** Public data, once in: just inside the doorway. */
const IN_X = DEPT.x + 38;
/** Personal or health data goes until its edge is this close to the shut gate, and is pushed back to stop this far off it. */
const TRIES_GAP = 8;
const STAYS_GAP = 56;

/** Posts at even steps along a side, from `a` to `b`, both ends included: x and y of each post's centre. */
const postsAlong = (from: Point, to: Point): Point[] => {
  const length = Math.hypot(to.x - from.x, to.y - from.y);
  const count = Math.max(1, Math.round(length / POST.pitch));
  return Array.from({ length: count + 1 }, (_, i) => ({
    x: Math.round(from.x + ((to.x - from.x) * i) / count),
    y: Math.round(from.y + ((to.y - from.y) * i) / count),
  }));
};
const POSTS = [
  ...postsAlong(
    { x: FENCE.x, y: FENCE.y },
    { x: FENCE.x + FENCE.w, y: FENCE.y },
  ),
  ...postsAlong(
    { x: FENCE.x + FENCE.w, y: FENCE.y },
    { x: FENCE.x + FENCE.w, y: FENCE.y + FENCE.h },
  ).slice(1),
  ...postsAlong(
    { x: FENCE.x + FENCE.w, y: FENCE.y + FENCE.h },
    { x: FENCE.x, y: FENCE.y + FENCE.h },
  ).slice(1),
].filter(
  (post, i, all) =>
    all.findIndex((other) => other.x === post.x && other.y === post.y) === i,
);
/** The left side's posts, clear of the gate's jambs: above the opening and below it. */
const SIDE_POSTS = [
  FENCE.y + POST.pitch / 2,
  FENCE.y + FENCE.h - POST.pitch / 2,
].map((y) => ({ x: FENCE.x, y: Math.round(y) }));

/** A change: a page with writing at its top and room under it for the approver's mark, the size slide 38's are. */
const PAGE = { w: 72, h: 110 };
const PAGE_Y = LANE_Y + TABLE.h / 2 - PAGE.h / 2;
/** Where a change starts: behind public data, once it is in, at its right edge, so it slides out of the table. */
const PAGE_FROM = { x: IN_X + TABLE.w - PAGE.w, y: PAGE_Y };
/** Where it shows, just out of the table. */
const PAGE_OUT = IN_X + TABLE.w + 20;
/** The record: a line the changes land on, its name under it at its left; its places, and the line's end. */
const RECORD = { x0: 1290, x1: 1760, y: 888 };
/** Where a change stops for the approver's mark: level with its place on the record, so from there it goes straight along to it. */
const DESK_Y = RECORD.y - PAGE.h;
/** Your approver, standing 12 px over the desk's level, so a change passes under their foot and never across them. */
const STANDING = personAt(990, 0, 1.5);
const APPROVER_AT = box(STANDING.x, DESK_Y - 12 - STANDING.h, STANDING.w, STANDING.h);
/** The desk: just past the approver. */
const DESK = { x: APPROVER_AT.x + APPROVER_AT.w + 20, y: DESK_Y };
const SLOTS = [1320, 1470, 1620];
/** The line reaches this far past the newest change on it. */
const REACH = 24;
/** The undone change lifts this far off the line, its name over it still clear of your department's top edge. */
const LIFT = 90;

/** A table with its name over it, at its right end. */
const named = <T extends { at: Box }>(table: T) => ({
  ...table,
  name: { x: table.at.x + table.at.w, y: table.at.y - NAME_ABOVE },
});

const reachOf = (slotX: number) =>
  (slotX + PAGE.w + REACH - RECORD.x0) / (RECORD.x1 - RECORD.x0);

export const SAFE = {
  fence: {
    key: "safe.fence",
    at: FENCE,
    /** The rail, from the top of the gate's opening round the fence to its foot: the gap between is the opening. */
    d: `M${FENCE.x} ${GATE.top}V${FENCE.y}H${FENCE.x + FENCE.w}V${FENCE.y + FENCE.h}H${FENCE.x}V${GATE.bottom}`,
    posts: {
      key: "safe.fence.posts",
      at: [...POSTS, ...SIDE_POSTS].map((post) =>
        box(
          post.x - POST.size / 2,
          post.y - POST.size / 2,
          POST.size,
          POST.size,
        ),
      ),
    },
    /** Its name, over its top left corner. */
    label: {
      key: "safe.fence.label",
      text: ACCOUNTS,
      at: { x: FENCE.x, y: FENCE.y - 28 },
    },
  },
  /** The gate: a jamb at each end of the opening and a leaf hung from the top one, shut across it. It swings out of the fence (`open`) and shuts again. */
  gate: {
    key: "safe.gate",
    hinge: { x: FENCE.x, y: GATE.top },
    length: GATE.bottom - GATE.top,
  },
  /** Your department: a dashed outline with a doorway behind the gate. In its own pixels. */
  dept: {
    key: "safe.dept",
    at: DEPT,
    d: `M0 ${GATE.top - DEPT.y}V0H${DEPT.w}V${DEPT.h}H0V${GATE.bottom - DEPT.y}`,
    label: { key: "safe.dept.label", text: YOUR_DEPARTMENT, at: DEPT_NAME },
  },
  publicData: named({
    key: "safe.table.public",
    text: PUBLIC_DATA,
    at: box(WAIT_X, WAIT_Y.public, TABLE.w, TABLE.h),
    /** Up to the lane, then in through the gate and the doorway. */
    lane: LANE_Y - WAIT_Y.public,
    through: IN_X - WAIT_X,
  }),
  personal: named({
    key: "safe.table.personal",
    text: PERSONAL_DATA,
    at: box(WAIT_X, WAIT_Y.personal, TABLE.w, TABLE.h),
    /** Down to the lane, to the shut gate, and pushed back to wait outside. */
    lane: LANE_Y - WAIT_Y.personal,
    tries: FENCE.x - TRIES_GAP - TABLE.w - WAIT_X,
    stays: FENCE.x - STAYS_GAP - TABLE.w - WAIT_X,
  }),
  approver: {
    key: "safe.approver",
    at: APPROVER_AT,
    label: {
      key: "safe.approver.label",
      text: APPROVER,
      at: { x: APPROVER_AT.x + APPROVER_AT.w / 2, y: APPROVER_AT.y - 26 },
    },
  },
  record: {
    key: "safe.record",
    from: { x: RECORD.x0, y: RECORD.y },
    to: { x: RECORD.x1, y: RECORD.y },
    /** How much of the line shows before any change is on it. */
    stub: 0.08,
    label: {
      key: "safe.record.label",
      text: GITHUB_RECORD,
      at: { x: RECORD.x0 - 16, y: RECORD.y + 24 },
    },
  },
  changes: SLOTS.map((slotX, i) => {
    const at: Box = box(PAGE_FROM.x, PAGE_FROM.y, PAGE.w, PAGE.h);
    return {
      key: `safe.change.${i}`,
      at,
      /** Out of the table, to the approver, and onto its place on the record: offsets from where it starts. */
      out: PAGE_OUT - at.x,
      desk: { x: DESK.x - at.x, y: DESK.y - at.y },
      slot: { x: slotX - at.x, y: RECORD.y - PAGE.h - at.y },
      /** How much of the record's line shows once it is on it. */
      reach: reachOf(slotX),
      /** The approver's mark, under the page's writing, where slide 38 sets it on a change. */
      mark: { key: `safe.change.${i}.mark`, at: { x: at.x + PAGE.w / 2, y: at.y + PAGE.h - 28 } },
      /** When it was recorded: a clock and a line, under the record at its place. */
      stamp: { key: `safe.stamp.${i}`, at: { x: slotX, y: RECORD.y + 26 } },
    };
  }),
  /** The last change lifts off the record, faded, with its name over it. */
  lift: LIFT,
  undone: {
    key: "safe.undone",
    text: UNDONE,
    at: {
      x: SLOTS[SLOTS.length - 1] + PAGE.w / 2,
      y: RECORD.y - PAGE.h - LIFT - 26,
    },
  },
};
