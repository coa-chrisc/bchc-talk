/**
 * Where a grid of unit marks goes: one small mark for each thing counted,
 * in rows that read left to right, with the place the next one would take.
 * Plain numbers and ids, so a scene draws from it and a step's moves name
 * its parts.
 */
import type { Box } from "./tokens";

export type UnitGridSpec = {
  id: string;
  /** The first mark's top left corner. */
  x: number;
  y: number;
  /** How many things are counted. */
  count: number;
  cols: number;
  /** A mark's size, and the space between two. */
  w: number;
  h: number;
  gap: number;
};

export type UnitGridLayout = {
  /** The marks as one part: `light` it to show the first so many. */
  key: string;
  /** The place after the last mark, as its own part. */
  nextKey: string;
  /** The marks and the next place together. */
  box: Box;
  marks: Box[];
  next: Box;
};

export function unitGrid(spec: UnitGridSpec): UnitGridLayout {
  const { id, x, y, count, cols, w, h, gap } = spec;
  if (!Number.isInteger(count) || count < 0 || !Number.isInteger(cols) || cols < 1) throw new Error(`A unit grid needs a whole count and at least one column; "${id}" has ${count} in ${cols}.`);
  const at = (n: number): Box => ({ x: x + (n % cols) * (w + gap), y: y + Math.floor(n / cols) * (h + gap), w, h });
  const rows = Math.floor(count / cols) + 1;
  const across = Math.min(cols, count + 1);
  return {
    key: id,
    nextKey: `${id}.next`,
    box: { x, y, w: across * (w + gap) - gap, h: rows * (h + gap) - gap },
    marks: Array.from({ length: count }, (_, n) => at(n)),
    next: at(count),
  };
}
