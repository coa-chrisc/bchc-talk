import { describe, expect, it } from "vitest";
import { HOME } from "./camera";
import { BEAT, compile } from "./compile";
import type { WorldDef } from "./types";

const Scene = () => null;
const CLOSE = { fx: 0.2, fy: 0.3, scale: 2 };

const world: WorldDef = {
  id: "w",
  Scene,
  steps: [
    { id: "a", moves: [{ key: "title", on: { autoAlpha: 1, y: 0 }, off: { autoAlpha: 0, y: 22 } }] },
    {
      id: "b",
      moves: [
        { key: "cell", on: { "--k": 1 }, off: { "--k": 0, "--pass": 0 } },
        { camera: CLOSE, with: true },
        { key: "title", on: { autoAlpha: 0.25 }, at: 1 },
      ],
    },
    { id: "c", moves: [{ key: "cell", on: { "--pass": 1 } }] },
  ],
};

describe("compiling a world", () => {
  const compiled = compile(world);

  it("starts every part at its first off value, before any step", () => {
    expect(compiled.keys).toEqual(["title", "cell"]);
    expect(compiled.states[0]).toEqual({ title: { autoAlpha: 0, y: 22 }, cell: { "--k": 0, "--pass": 0 } });
    expect(compiled.cameras[0]).toEqual(HOME);
  });

  it("gives every step every part and every property, so any step can be cut to", () => {
    for (const state of compiled.states) {
      expect(Object.keys(state)).toEqual(compiled.keys);
      for (const key of compiled.keys) expect(Object.keys(state[key]).sort()).toEqual(Object.keys(compiled.states[0][key]).sort());
    }
  });

  it("carries each move forward into the steps after it", () => {
    expect(compiled.states[1].title).toEqual({ autoAlpha: 1, y: 0 });
    expect(compiled.states[2]).toEqual({ title: { autoAlpha: 0.25, y: 0 }, cell: { "--k": 1, "--pass": 0 } });
    expect(compiled.states[3].cell).toEqual({ "--k": 1, "--pass": 1 });
    expect(compiled.cameras).toEqual([HOME, HOME, CLOSE, CLOSE]);
  });

  it("plays a step's moves a beat apart, unless a move says when", () => {
    expect(compiled.plays[1].map((play) => play.at)).toEqual([0, 0, 1]);
    const three = compile({ ...world, steps: [{ id: "a", moves: [world.steps[0].moves[0], world.steps[0].moves[0], world.steps[0].moves[0]] }] });
    expect(three.plays[0].map((play) => play.at)).toEqual([0, BEAT, 2 * BEAT]);
  });

  it("tells the camera where it is coming from", () => {
    expect(compiled.plays[1][1]).toMatchObject({ camera: CLOSE, from: HOME });
  });

  it("refuses a move with nothing to start from", () => {
    expect(() => compile({ id: "w", Scene, steps: [{ id: "a", moves: [{ key: "x", on: { autoAlpha: 1 } }] }] })).toThrow(/nothing to start from/);
  });
});
