/**
 * Where a board's parts go. A board is the fleet film's picture: rows of
 * work, each a lane of cells that fill as the work is done, with a dot
 * working the cell in hand. The layout is plain numbers and the ids of the
 * parts, so a scene draws from it and a step's moves name parts through it.
 */
import type { Box, Point } from "./tokens";

export type BoardSpec = {
  /** The board's id; rows and cells take theirs from it. */
  id: string;
  x: number;
  y: number;
  w: number;
  title?: string;
  rows: readonly { label: string; cells: number }[];
  /** A row's height. */
  rowH?: number;
  /** The width kept for row labels. */
  labelW?: number;
};

export type CellLayout = Box & { key: string };

export type RowLayout = {
  key: string;
  dotKey: string;
  label: string;
  box: Box;
  /** The label's baseline, at its left. */
  labelAt: Point;
  cells: CellLayout[];
  /** Where the row's dot rests: the left edge of its first cell. */
  dotAt: Point;
};

export type BoardLayout = { key: string; title?: string; titleAt: Point; box: Box; rows: RowLayout[] };

export const BOARD = { pad: 40, rowH: 92, cellH: 48, cellGap: 12, labelW: 300 } as const;

export function board(spec: BoardSpec): BoardLayout {
  const rowH = spec.rowH ?? BOARD.rowH;
  const labelW = spec.labelW ?? BOARD.labelW;
  const laneX = spec.x + BOARD.pad + labelW;
  const laneW = spec.w - 2 * BOARD.pad - labelW;
  const rows = spec.rows.map((row, r): RowLayout => {
    const y = spec.y + BOARD.pad + r * rowH;
    const cellW = (laneW - (row.cells - 1) * BOARD.cellGap) / row.cells;
    const cellY = y + (rowH - BOARD.cellH) / 2;
    const key = `${spec.id}.r${r}`;
    const cells = Array.from({ length: row.cells }, (_, c) => ({
      key: `${key}.c${c}`,
      x: laneX + c * (cellW + BOARD.cellGap),
      y: cellY,
      w: cellW,
      h: BOARD.cellH,
    }));
    return {
      key,
      dotKey: `${key}.dot`,
      label: row.label,
      box: { x: spec.x, y, w: spec.w, h: rowH },
      labelAt: { x: spec.x + BOARD.pad, y: y + rowH / 2 },
      cells,
      dotAt: { x: laneX, y: y + rowH / 2 },
    };
  });
  return {
    key: spec.id,
    title: spec.title,
    titleAt: { x: spec.x, y: spec.y - 28 },
    box: { x: spec.x, y: spec.y, w: spec.w, h: 2 * BOARD.pad + spec.rows.length * rowH },
    rows,
  };
}

export type MultiplesSpec = {
  id: string;
  /** The one picture's own place. */
  from: Box;
  /** The area the grid fills. */
  area: Box;
  cols: number;
  rows: number;
  gap?: number;
};

export type MultiplesLayout = {
  from: Box;
  /** Where the one picture goes: the grid's first slot. */
  hero: { x: number; y: number; scale: number };
  /** The other slots, each a copy at the same scale. */
  copies: { key: string; x: number; y: number; scale: number }[];
};

/** One picture becoming a grid of the same picture: the first slot is the original, moved and scaled. */
export function multiples({ id, from, area, cols, rows, gap = 48 }: MultiplesSpec): MultiplesLayout {
  const slotW = (area.w - (cols - 1) * gap) / cols;
  const slotH = (area.h - (rows - 1) * gap) / rows;
  const scale = Math.min(slotW / from.w, slotH / from.h);
  const slots = Array.from({ length: cols * rows }, (_, i) => ({
    key: `${id}.${i}`,
    x: area.x + (i % cols) * (slotW + gap) + (slotW - from.w * scale) / 2,
    y: area.y + Math.floor(i / cols) * (slotH + gap) + (slotH - from.h * scale) / 2,
    scale,
  }));
  return { from, hero: { x: slots[0].x - from.x, y: slots[0].y - from.y, scale }, copies: slots.slice(1) };
}
