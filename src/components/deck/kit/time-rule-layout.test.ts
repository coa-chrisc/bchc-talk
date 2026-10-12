import { describe, expect, it } from "vitest";
import { timeRule } from "./time-rule-layout";

const rule = timeRule({ id: "time", x0: 96, x1: 1824, y: 76, days: 51, buildDays: 3, events: [0, 0, 1, 1, 1, 2, 5, 50] });

describe("a time rule", () => {
  it("gives every day the same length and closes the build stretch after its days", () => {
    expect(rule.perDay).toBeCloseTo(33.88, 2);
    expect(rule.build).toMatchObject({ x0: 96, x1: 197.6 });
    expect(rule.run).toMatchObject({ x0: 197.6, x1: 1824 });
  });

  it("ticks each whole week, and knows how far along the run each tick is", () => {
    expect(rule.weeks.length).toBe(7);
    expect(rule.weeks[0].x).toBeCloseTo(333.2, 1);
    expect(rule.weeks[1].x - rule.weeks[0].x).toBeCloseTo(237.2, 1);
    expect(rule.weeks.every((week, i, all) => week.along > 0 && week.along < 1 && (i === 0 || week.along > all[i - 1].along))).toBe(true);
  });

  it("places marks by day, in order, spread across a day that holds several", () => {
    expect(rule.marks.length).toBe(8);
    expect([...rule.marks].sort((a, b) => a - b)).toEqual(rule.marks);
    expect(rule.marks.filter((x) => x < rule.build.x1).length).toBe(6);
    expect(rule.marks[1] - rule.marks[0]).toBeCloseTo(rule.perDay / 2, 0);
    expect(rule.marks[7]).toBeGreaterThan(1790);
    expect(rule.marks[7]).toBeLessThan(1824);
  });
});
