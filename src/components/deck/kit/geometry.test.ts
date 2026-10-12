import { describe, expect, it } from "vitest";
import { ARRIVE_GAP, centre, route } from "./geometry";
import { box } from "./tokens";

describe("a connector's route", () => {
  it("is a straight run between boxes on one row", () => {
    const r = route(box(100, 200, 200, 100), box(500, 200, 200, 100));
    expect(r.start).toEqual({ x: 300, y: 250 });
    expect(r.end).toEqual({ x: 500 - ARRIVE_GAP, y: 250 });
    expect(r.d).toBe("M300 250L490 250");
    expect(r.heading).toBe(0);
  });

  it("is an S-curve between rows, level where it leaves and where it arrives", () => {
    const r = route(box(100, 200, 200, 100), box(500, 500, 200, 100));
    expect(r.d).toBe("M300 250C395 250 395 550 490 550");
    expect(r.heading).toBe(0);
  });

  it("runs right to left when the target is behind", () => {
    const r = route(box(500, 200, 200, 100), box(100, 200, 200, 100));
    expect(r.start.x).toBe(500);
    expect(r.end.x).toBe(300 + ARRIVE_GAP);
    expect(r.heading).toBe(180);
  });

  it("drops from a box's foot to the next one's head along the vertical axis", () => {
    const r = route(box(100, 100, 200, 100), box(400, 500, 200, 100), "v");
    expect(r.start).toEqual({ x: 200, y: 200 });
    expect(r.end).toEqual({ x: 500, y: 500 - ARRIVE_GAP });
    expect(r.heading).toBe(90);
    expect(route(box(400, 500, 200, 100), box(100, 100, 200, 100), "v").heading).toBe(270);
  });

  it("reaches the box itself when asked for no gap", () => {
    expect(route(box(0, 0, 100, 100), box(300, 0, 100, 100), "h", 0).end.x).toBe(300);
  });
});

describe("a box", () => {
  it("has its centre in the middle", () => {
    expect(centre(box(100, 200, 200, 100))).toEqual({ x: 200, y: 250 });
  });
});
