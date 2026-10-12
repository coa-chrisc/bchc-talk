/**
 * The geometry of the kit's connectors, as pure numbers: the S-curve the
 * fleet film joins its tasks with (control-room/fleet-routes.ts), leaving one
 * box's edge and arriving at another's heading the same way, along either
 * axis. A straight run when the boxes line up.
 */
import type { Box, Point } from "./tokens";

export type Axis = "h" | "v";

export type Route = {
  /** The path, for an SVG `d`. */
  d: string;
  start: Point;
  end: Point;
  /** The way the path is heading as it arrives, in degrees (0 is right, 90 is down). */
  heading: number;
};

const round = (n: number) => Math.round(n * 10) / 10;

/** How far a connector stops short of the box it arrives at, so its arrowhead clears the edge. */
export const ARRIVE_GAP = 10;

/**
 * The route from one box to another. Along `h` it leaves the middle of the
 * first box's near side and arrives at the middle of the second's, turning
 * halfway; along `v` the same, top to bottom. `gap` holds the end short of
 * the box.
 */
export function route(from: Box, to: Box, axis: Axis = "h", gap = ARRIVE_GAP): Route {
  if (axis === "h") {
    const forward = to.x >= from.x;
    const start = { x: forward ? from.x + from.w : from.x, y: from.y + from.h / 2 };
    const end = { x: forward ? to.x - gap : to.x + to.w + gap, y: to.y + to.h / 2 };
    const mid = (start.x + end.x) / 2;
    return { d: curve(start, { x: mid, y: start.y }, { x: mid, y: end.y }, end), start, end, heading: forward ? 0 : 180 };
  }
  const down = to.y >= from.y;
  const start = { x: from.x + from.w / 2, y: down ? from.y + from.h : from.y };
  const end = { x: to.x + to.w / 2, y: down ? to.y - gap : to.y + to.h + gap };
  const mid = (start.y + end.y) / 2;
  return { d: curve(start, { x: start.x, y: mid }, { x: end.x, y: mid }, end), start, end, heading: down ? 90 : 270 };
}

function curve(a: Point, c1: Point, c2: Point, b: Point): string {
  const p = (point: Point) => `${round(point.x)} ${round(point.y)}`;
  return a.x === b.x || a.y === b.y ? `M${p(a)}L${p(b)}` : `M${p(a)}C${p(c1)} ${p(c2)} ${p(b)}`;
}

/** The middle of a box. */
export const centre = (b: Box): Point => ({ x: b.x + b.w / 2, y: b.y + b.h / 2 });

/** A box as CSS: where a part sits on the stage. */
export const place = (b: Box) => ({ left: b.x, top: b.y, width: b.w, height: b.h });
