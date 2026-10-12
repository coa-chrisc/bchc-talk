/**
 * Slide 27, the more we share, the more we can do: the talk's only network,
 * and the end of Part 4. Twelve departments on an oval round the shared
 * middle, every one the same navy circle with its department's name inside
 * it. Click 1: Austin joins and adds its modules, five more join, and the
 * middle grows. Click 2 (its vendor squares, lines, labels and tool are in
 * layout-network-ties.ts): the other six join and the middle grows again,
 * every department pays a vendor along a heavy line, each line is pulled in
 * through its circle to the middle, and a tool Austin made goes into the
 * middle and copies of it out to three others.
 */
import { TILE, box, type Point } from "@/components/deck/kit";
import { shown } from "../../script/find";
import { SAFE_BOTTOM, contentTop, groupOf, round } from "./layout";

/** How many have joined after each click that adds some. */
export const JOINED = { austin: 1, join: 6, all: 12 } as const;
/** The departments' names, in the order they join: Austin and five more on the first click, then the six the second click lists before its labels. */
const NAMES = [...shown("network", "grow"), ...shown("network", "outside").slice(0, JOINED.all - JOINED.join)];

/**
 * The oval the departments sit on: its middle halfway between a line's gap
 * (32 px) under the story band and the safe foot, as tall as lets its top
 * and foot circles fit between the two, and wide enough to leave a gap
 * between neighbours with room outside its two ends for the vendor squares.
 */
export const OVAL = { x: 400, y: 193 } as const;
/** A department's circle: wide enough to hold its name inside, with room above the top pair and under the foot pair for their vendors' squares. */
export const DEPT_R = 66;
const C: Point = { x: 960, y: (contentTop("network") + 32 + SAFE_BOTTOM) / 2 };
/** The middle's radius at each stage: Austin alone, six departments, all of them. */
export const CENTRE_R = [60, 90, 110] as const;
/** How many places the oval holds. */
const PLACES = 12;
/**
 * The places round the oval, every neighbour the same distance apart: the
 * first stands half a step above the left end, the sixth half a step above
 * the right end, and the other six mirror them below. No circle sits at the
 * very top or foot, so a line can pass over or under the circles beside them,
 * and the pairs either side of each end are as far apart as any other pair.
 */
const places = (() => {
  const STEPS = 20000;
  const on = (i: number) => {
    const t = Math.PI + (i / STEPS) * Math.PI;
    return { x: C.x + OVAL.x * Math.cos(t), y: C.y + OVAL.y * Math.sin(t) };
  };
  const upper = (step: number) => {
    let i = 0;
    while (on(i).y > C.y - step / 2) i++;
    const row = [on(i)];
    while (row.length < PLACES / 2) {
      const from = row[row.length - 1];
      while (i < STEPS && Math.hypot(on(i).x - from.x, on(i).y - from.y) < step) i++;
      row.push(on(i));
    }
    return row;
  };
  // The longest step that still leaves the sixth place half a step above the right end.
  let [short, long]: number[] = [0, OVAL.y];
  for (let n = 0; n < 40; n++) {
    const step = (short + long) / 2;
    if (upper(step)[PLACES / 2 - 1].y <= C.y - step / 2) short = step;
    else long = step;
  }
  const top = upper(short).map((p) => ({ x: round(p.x), y: round(p.y) }));
  return [...top, ...top.map((p) => ({ x: p.x, y: round(2 * C.y - p.y) })).reverse()];
})();
/** A place by the angle it stands for on a circle (degrees, as the screen measures them): -165 is the place just above the left end, 15 the one just under the right end. */
export const onOval = (degrees: number): Point => places[Math.round(((((degrees - 195) % 360) + 360) % 360) / 30)];

/**
 * Each department's place, in the order they join, set roughly as on a map:
 * west to east from left to right along the top and along the foot, and
 * north to south down the right end. Austin keeps the place just above the
 * left end and Los Angeles County takes the one under it. The first six
 * (Austin, Los Angeles County, Chicago, Houston, New York City, Denver) come
 * from every part of the country and stand at both ends, the top and the
 * foot of the ring; the second six fill the places between.
 */
export const ANGLES = [-165, 165, -75, 105, 15, -105, -45, 45, -135, -15, 75, 135] as const;

/**
 * The middle's tiles, in rings out from its centre: Austin's three, then one
 * from each department as it joins, five and then six. The outer ring is
 * turned so one of its places faces Austin, for the tool Austin makes, and
 * none stands where the tool's copies start out (layout-network-ties.ts).
 */
const ROSETTE = [
  { r: 20, count: 3, from: -90 },
  { r: 52, count: 5, from: -90 },
  { r: 84, count: 6, from: -30 },
] as const;
/** How many tiles show after each click that adds some. */
export const SHOWN_TILES = { austin: 3, join: 8, all: 14 } as const;
const tileCentres = ROSETTE.flatMap((ring, stage) =>
  Array.from({ length: ring.count }, (_, n) => {
    const a = ((ring.from + (n * 360) / ring.count) * Math.PI) / 180;
    return { stage, x: round(C.x + ring.r * Math.cos(a)), y: round(C.y + ring.r * Math.sin(a)) };
  }),
);

/**
 * A department's name, set inside its circle in 19 px type, 21 px a row:
 * on one row where that fits, otherwise on two, broken at the space nearest
 * its middle. A row is taken at 0.55 em a letter, wider than any of the
 * twelve sets in Geist.
 */
export const NAME = { size: 19, line: 21, em: 0.55 } as const;
export const nameWidth = (row: string) => row.length * NAME.size * NAME.em;
/** Whether rows of the name type, stacked about a circle's centre, each fit inside the circle's 3 px edge. */
export const fitsCircle = (rows: readonly string[]) => {
  const inner = DEPT_R - 1.5;
  return rows.every((row, j) => {
    const far = Math.max(Math.abs(j - rows.length / 2), Math.abs(j + 1 - rows.length / 2)) * NAME.line;
    return nameWidth(row) / 2 <= Math.sqrt(inner * inner - far * far);
  });
};
const rowsOf = (name: string) => {
  if (fitsCircle([name])) return [name];
  const middle = name.length / 2;
  const at = [...name.matchAll(/ /g)].map((space) => space.index).reduce((best, i) => (Math.abs(i - middle) < Math.abs(best - middle) ? i : best));
  return [name.slice(0, at), name.slice(at + 1)];
};

export const NETWORK = {
  ...groupOf("network"),
  centre: { key: "network.centre", ringKey: "network.centre.ring", at: C, r: CENTRE_R[0] },
  /** The middle's tiles, in the catalog's indigo: Austin's three, then one from each department in the order they join. */
  tiles: tileCentres.map((centre, n) => ({ key: `network.tile.${n}`, at: { x: centre.x - TILE.small.side / 2, y: centre.y - TILE.small.side / 2 }, stage: centre.stage })),
  departments: ANGLES.map((degrees, i) => ({ key: `network.dept.${i}`, at: onOval(degrees), r: DEPT_R, spoke: `network.spoke.${i}` })),
  /** Each department's name, inside its circle, its rows centred on the circle's centre; `at` is the room its widest row and its rows take up. */
  names: NAMES.map((text, i) => {
    const centre = onOval(ANGLES[i]);
    const rows = rowsOf(text);
    const w = Math.max(...rows.map(nameWidth));
    const h = rows.length * NAME.line;
    return { key: `network.name.${i}`, text, rows, centre, at: box(round(centre.x - w / 2), round(centre.y - h / 2), w, h) };
  }),
};
