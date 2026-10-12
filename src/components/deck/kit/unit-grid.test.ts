import { describe, expect, it } from "vitest";
import { unitGrid } from "./unit-grid";

const grid = unitGrid({ id: "units", x: 96, y: 480, count: 17, cols: 6, w: 52, h: 30, gap: 14 });

describe("a grid of unit marks", () => {
  it("has one mark for each thing counted, in rows that read left to right", () => {
    expect(grid.marks).toHaveLength(17);
    expect(grid.marks[0]).toEqual({ x: 96, y: 480, w: 52, h: 30 });
    expect(grid.marks[5]).toEqual({ x: 96 + 5 * 66, y: 480, w: 52, h: 30 });
    expect(grid.marks[6]).toEqual({ x: 96, y: 524, w: 52, h: 30 });
    expect(grid.marks[16]).toEqual({ x: 96 + 4 * 66, y: 568, w: 52, h: 30 });
  });

  it("keeps the place after the last mark for the next one", () => {
    expect(grid.next).toEqual({ x: 96 + 5 * 66, y: 568, w: 52, h: 30 });
    expect(grid.marks).not.toContainEqual(grid.next);
  });

  it("starts a new row for the next place when the last row is full", () => {
    const full = unitGrid({ id: "u", x: 0, y: 0, count: 6, cols: 6, w: 10, h: 10, gap: 2 });
    expect(full.next).toEqual({ x: 0, y: 12, w: 10, h: 10 });
    expect(full.box).toEqual({ x: 0, y: 0, w: 70, h: 22 });
  });

  it("is as wide as its columns and as tall as its rows, the next place included", () => {
    expect(grid.box).toEqual({ x: 96, y: 480, w: 6 * 66 - 14, h: 3 * 44 - 14 });
    expect(unitGrid({ id: "u", x: 0, y: 0, count: 2, cols: 6, w: 10, h: 10, gap: 2 }).box).toEqual({ x: 0, y: 0, w: 34, h: 10 });
  });

  it("names its parts from its id", () => {
    expect([grid.key, grid.nextKey]).toEqual(["units", "units.next"]);
  });

  it("refuses a count or a column number that is not whole", () => {
    expect(() => unitGrid({ id: "u", x: 0, y: 0, count: 2.5, cols: 6, w: 10, h: 10, gap: 2 })).toThrow();
    expect(() => unitGrid({ id: "u", x: 0, y: 0, count: 2, cols: 0, w: 10, h: 10, gap: 2 })).toThrow();
  });
});
