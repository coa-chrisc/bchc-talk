/**
 * Slide 33a, the help spreads (docs/bchc-talk-script.md, slide 33a, They
 * see): slide 33's table, small, at the left with Austin's circle beside it;
 * three lines out from that table to three circles, "Ready now", each with a
 * small table of its own; and two or three circles on lines out from each of
 * those tables, "Next". A tree three levels deep, read left to right from
 * Austin at its root. The tables and lines are help's sky, the circles navy
 * line like slide 27's departments. Every place is a plain number; every
 * word is the script's.
 */
import { CONTENT_TOP, STAGE, box, type Box, type Point } from "@/components/deck/kit";
import { shown } from "../../script/find";
import { TABLE } from "./layout-workshop";

const [AUSTIN_NAME, READY_NOW, NEXT] = shown("spreads", "play");

/** Where the picture goes: under the one-line title's story band, inside the stage's side margins, above the footer. */
export const FIELD = { left: 96, right: STAGE.w - 96, top: CONTENT_TOP.one, floor: 1016 - 24 } as const;

/** A small table is slide 33's table at a fifth of its size, corners and all. */
export const SHRINK = 0.2;
const SMALL = { w: TABLE.at.w * SHRINK, h: TABLE.at.h * SHRINK, rx: TABLE.rx * SHRINK } as const;
/** A department's circle. Austin's is larger, to hold its name in the label type. */
export const R = 34;
export const AUSTIN_R = 52;
/** Between a department's circle and the table at its right. */
const BESIDE = 16;

/**
 * The next departments, top to bottom, 55 px apart from 96 px under the
 * field's top: two for the first table, three for the second and two for
 * the third, alternately in a near column and a far one, so each group fans
 * out from its table.
 */
const NEXT_TOP = FIELD.top + 96;
const NEXT_PITCH = 55;
const NEXT_X = { near: 1440, far: 1640 } as const;
const GROUPS = [2, 3, 2] as const;
const nextAt = (k: number): Point => ({ x: k % 2 ? NEXT_X.far : NEXT_X.near, y: NEXT_TOP + k * NEXT_PITCH });
/** Which table each next department joins, in order. */
const GROUP_OF = GROUPS.flatMap((size, i) => Array.from({ length: size }, () => i));
/**
 * Each ready department's row: level with its group's far circle, so the
 * line out to that circle runs straight between the two near ones.
 */
const ROWS = GROUPS.map((_, i) => nextAt(GROUP_OF.findIndex((group, k) => group === i && k % 2 === 1)).y);

/** The middle column of the tree: each ready department's circle, with its own small table at its right. */
const READY_X = 760;
/** Austin's circle at the left, level with the middle row, and its table at its right. */
const AUSTIN_AT: Point = { x: FIELD.left + 60, y: ROWS[1] };

const tableBeside = (circle: Point, r: number): Box => box(circle.x + r + BESIDE, circle.y - SMALL.h / 2, SMALL.w, SMALL.h);
/** Where a line from a table's right end meets a circle's edge: at the point of the circle facing it. */
const edgeToward = (from: Point, centre: Point, r: number): Point => {
  const d = Math.hypot(centre.x - from.x, centre.y - from.y);
  return { x: centre.x - ((centre.x - from.x) * r) / d, y: centre.y - ((centre.y - from.y) * r) / d };
};
const rightEnd = (at: Box): Point => ({ x: at.x + at.w, y: at.y + at.h / 2 });
const line = (from: Point, to: Point) => ({ from, to, d: `M${from.x} ${from.y}L${to.x} ${to.y}` });


/** Austin's table, where slide 33's table lands as it shrinks: the same table, a fifth of its size. */
export const ROOT_TABLE = { key: "rel.spread.table.0", at: tableBeside(AUSTIN_AT, AUSTIN_R), rx: SMALL.rx } as const;

/** Slide 33's table, carried by its top left corner (--x, --y) and scaled about it (--s) onto Austin's table. */
export const SHRUNK = { "--x": ROOT_TABLE.at.x - TABLE.at.x, "--y": ROOT_TABLE.at.y - TABLE.at.y, "--s": SHRINK } as const;

/** The three ready departments, top to bottom: each circle, its own table, and the line out to it from Austin's table. */
export const READY = ROWS.map((y, i) => {
  const at: Point = { x: READY_X, y };
  return {
    key: `rel.spread.ready.${i}`,
    at,
    r: R,
    table: { key: `rel.spread.table.${i + 1}`, at: tableBeside(at, R), rx: SMALL.rx },
    tie: { key: `rel.spread.tie.${i}`, ...line(rightEnd(ROOT_TABLE.at), edgeToward(rightEnd(ROOT_TABLE.at), at, R)) },
  };
});

/** The next departments, top to bottom: each circle and the line out to it from its ready department's table. */
export const NEXT_DEPTS = GROUP_OF.map((group, k) => {
  const at = nextAt(k);
  const from = rightEnd(READY[group].table.at);
  return { key: `rel.spread.next.${k}`, at, r: R, group, branch: { key: `rel.spread.branch.${k}`, ...line(from, edgeToward(from, at, R)) } };
});

/**
 * A label set in the label type (26 px), and the room it takes: 0.55 em a
 * letter, wider than Geist sets any of these, and a line's height.
 */
const LABEL = { size: 26, em: 0.55 } as const;
const room = (text: string, centre: Point): Box => {
  const w = text.length * LABEL.size * LABEL.em;
  return box(centre.x - w / 2, centre.y - LABEL.size / 2, w, LABEL.size);
};
const label = (key: string, text: string, centre: Point) => ({ key, text, centre, at: room(text, centre) });
/** The two group labels, each once, over its column, on one line 32 px under the content's top. */
const LABEL_Y = FIELD.top + 32;
export const READY_LABEL = label("rel.spread.ready-label", READY_NOW, { x: READY_X, y: LABEL_Y });
export const NEXT_LABEL = label("rel.spread.next-label", NEXT, { x: (NEXT_X.near + NEXT_X.far) / 2, y: LABEL_Y });

/** Austin: its circle at the left, its name inside it as slide 27 names its departments, coming up as the circle draws. */
export const AUSTIN = { key: "rel.spread.austin", at: AUSTIN_AT, r: AUSTIN_R, text: AUSTIN_NAME, name: room(AUSTIN_NAME, AUSTIN_AT) } as const;

/** Every part slide 33a puts on the stage. */
export const SPREADS_OWN: readonly string[] = [
  AUSTIN.key,
  ROOT_TABLE.key,
  ...READY.flatMap((ready) => [ready.tie.key, ready.key, ready.table.key]),
  ...NEXT_DEPTS.flatMap((next) => [next.branch.key, next.key]),
  READY_LABEL.key,
  NEXT_LABEL.key,
];
