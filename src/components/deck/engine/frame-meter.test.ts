import { describe, expect, it, vi } from "vitest";

vi.mock("./gsap", () => ({ gsap: { ticker: { add: () => {}, remove: () => {} } } }));

import { frameStats, paces } from "./frame-meter";

describe("frame statistics", () => {
  it("reports nothing for no frames", () => {
    expect(frameStats([])).toEqual({ frames: 0, p95: 0, worst: 0 });
  });

  it("finds the 95th percentile and the worst frame", () => {
    const deltas = [...Array.from({ length: 95 }, () => 16.7), 20, 20, 20, 20, 48];
    expect(frameStats(deltas)).toEqual({ frames: 100, p95: 16.7, worst: 48 });
  });

  it("passes a steady build and flags a slow or a hitching one", () => {
    expect(paces({ frames: 60, p95: 17, worst: 30 }, 16.67)).toBe(true);
    expect(paces({ frames: 60, p95: 23, worst: 30 }, 16.67)).toBe(false);
    expect(paces({ frames: 60, p95: 17, worst: 51 }, 16.67)).toBe(false);
  });
});
