import { describe, expect, it } from "vitest";
import { TAB_H, tabBeside } from "./tab";

const ring = { x: 100, y: 200, w: 300, h: 56 };

describe("where a tab sits for a ring", () => {
  it("shares the ring's right edge, level with its middle", () => {
    expect(tabBeside(ring, "right")).toEqual({ x: 400, y: 200 + (56 - TAB_H) / 2 });
  });

  it("is set by its right edge when it sits to the left", () => {
    expect(tabBeside(ring, "left")).toEqual({ x: 100, y: 208, end: true });
  });

  it("stands on the ring's head, at its left end", () => {
    expect(tabBeside(ring, "above-left")).toEqual({ x: 100, y: 200 - TAB_H });
  });

  it("hangs from the ring's foot, at either end", () => {
    expect(tabBeside(ring, "below-left")).toEqual({ x: 100, y: 256 });
    expect(tabBeside(ring, "below-right")).toEqual({ x: 400, y: 256, end: true });
  });
});
