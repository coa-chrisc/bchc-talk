import { describe, expect, it } from "vitest";
import { BOARD, board, multiples } from "./board-layout";

describe("a board's layout", () => {
  const layout = board({ id: "b", x: 100, y: 200, w: 1200, rows: [{ label: "Plan", cells: 3 }, { label: "Build", cells: 5 }] });

  it("names every part from the board's id", () => {
    expect(layout.key).toBe("b");
    expect(layout.rows.map((row) => row.key)).toEqual(["b.r0", "b.r1"]);
    expect(layout.rows[1].dotKey).toBe("b.r1.dot");
    expect(layout.rows[0].cells.map((cell) => cell.key)).toEqual(["b.r0.c0", "b.r0.c1", "b.r0.c2"]);
  });

  it("fills each row's lane edge to edge, whatever the number of cells", () => {
    for (const row of layout.rows) {
      const last = row.cells[row.cells.length - 1];
      expect(row.cells[0].x).toBe(100 + BOARD.pad + BOARD.labelW);
      expect(last.x + last.w).toBeCloseTo(100 + 1200 - BOARD.pad);
      expect(row.dotAt.x).toBe(row.cells[0].x);
    }
  });

  it("is as tall as its rows and padding", () => {
    expect(layout.box).toEqual({ x: 100, y: 200, w: 1200, h: 2 * BOARD.pad + 2 * BOARD.rowH });
  });
});

describe("small multiples", () => {
  const from = { x: 400, y: 300, w: 1000, h: 500 };
  const layout = multiples({ id: "m", from, area: { x: 0, y: 0, w: 3000, h: 1600 }, cols: 3, rows: 2, gap: 0 });

  it("moves the one picture to the first slot and makes a copy for each other slot", () => {
    expect(layout.copies).toHaveLength(5);
    expect(layout.hero).toEqual({ x: -400, y: 0 - 300 + (800 - 500) / 2, scale: 1 });
    expect(layout.copies[0]).toMatchObject({ key: "m.1", x: 1000, scale: 1 });
  });
});
