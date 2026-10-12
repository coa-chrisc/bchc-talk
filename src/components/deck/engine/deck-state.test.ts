import { describe, expect, it } from "vitest";
import { clampPosition, locate, move, numberOf, progressOf, totalSteps, type Position, type Shape } from "./deck-state";

/** Three worlds: three steps, one step, two steps. */
const SHAPE: Shape = [3, 1, 2];
const at = (world: number, step: number): Position => ({ world, step });

describe("moving through the deck", () => {
  it("steps through a world, then onto the next world's first step", () => {
    expect(move(SHAPE, at(0, 0), { type: "next" })).toEqual({ position: at(0, 1), via: "advance" });
    expect(move(SHAPE, at(0, 2), { type: "next" })).toEqual({ position: at(1, 0), via: "advance" });
    expect(move(SHAPE, at(1, 0), { type: "next" })).toEqual({ position: at(2, 0), via: "advance" });
  });

  it("steps back from a world's first step onto the previous world's last", () => {
    expect(move(SHAPE, at(0, 2), { type: "prev" })).toEqual({ position: at(0, 1), via: "retreat" });
    expect(move(SHAPE, at(1, 0), { type: "prev" })).toEqual({ position: at(0, 2), via: "retreat" });
    expect(move(SHAPE, at(2, 0), { type: "prev" })).toEqual({ position: at(1, 0), via: "retreat" });
  });

  it("stays put at either end", () => {
    expect(move(SHAPE, at(0, 0), { type: "prev" }).position).toEqual(at(0, 0));
    expect(move(SHAPE, at(2, 1), { type: "next" }).position).toEqual(at(2, 1));
  });

  it("walks every step forward and the same steps back", () => {
    const forward: Position[] = [at(0, 0)];
    for (let i = 1; i < totalSteps(SHAPE); i++) forward.push(move(SHAPE, forward[i - 1], { type: "next" }).position);
    expect(forward[forward.length - 1]).toEqual(at(2, 1));
    const back = [forward[forward.length - 1]];
    for (let i = 1; i < totalSteps(SHAPE); i++) back.push(move(SHAPE, back[i - 1], { type: "prev" }).position);
    expect(back).toEqual([...forward].reverse());
  });

  it("cuts to the ends and to a named world", () => {
    expect(move(SHAPE, at(1, 0), { type: "first" })).toEqual({ position: at(0, 0), via: "jump" });
    expect(move(SHAPE, at(0, 0), { type: "last" })).toEqual({ position: at(2, 1), via: "jump" });
    expect(move(SHAPE, at(0, 0), { type: "goTo", world: 2 })).toEqual({ position: at(2, 0), via: "jump" });
    expect(move(SHAPE, at(0, 0), { type: "goTo", world: 0, step: 2 })).toEqual({ position: at(0, 2), via: "jump" });
  });

  it("lands a position outside the deck on the nearest real one", () => {
    expect(clampPosition(SHAPE, at(9, 9))).toEqual(at(2, 1));
    expect(clampPosition(SHAPE, at(-1, -4))).toEqual(at(0, 0));
    expect(clampPosition(SHAPE, at(0, 7))).toEqual(at(0, 2));
    expect(clampPosition(SHAPE, at(Number.NaN, 1.8))).toEqual(at(0, 1));
    expect(move(SHAPE, at(0, 0), { type: "goTo", world: 40, step: 3 }).position).toEqual(at(2, 1));
  });
});

describe("progress", () => {
  it("runs from 0 at the first step to 1 at the last, evenly", () => {
    expect(totalSteps(SHAPE)).toBe(6);
    expect(progressOf(SHAPE, at(0, 0))).toBe(0);
    expect(progressOf(SHAPE, at(1, 0))).toBeCloseTo(3 / 5);
    expect(progressOf(SHAPE, at(2, 1))).toBe(1);
  });

  it("is 0 on a deck of one step", () => {
    expect(progressOf([1], at(0, 0))).toBe(0);
  });
});

describe("a step's number", () => {
  it("counts from 1 through the whole deck, and finds its position again", () => {
    const numbers: number[] = [];
    SHAPE.forEach((steps, world) => {
      for (let step = 0; step < steps; step++) {
        const n = numberOf(SHAPE, at(world, step));
        numbers.push(n);
        expect(locate(SHAPE, n)).toEqual(at(world, step));
      }
    });
    expect(numbers).toEqual([1, 2, 3, 4, 5, 6]);
  });

  it("lands a number outside the deck on its nearest end", () => {
    expect(locate(SHAPE, 0)).toEqual(at(0, 0));
    expect(locate(SHAPE, 99)).toEqual(at(2, 1));
    expect(locate(SHAPE, Number.NaN)).toEqual(at(0, 0));
  });
});
