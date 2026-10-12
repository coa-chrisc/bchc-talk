import { describe, expect, it } from "vitest";
import { chromeWorld } from "./chrome";
import { compile } from "./compile";
import type { DeckDef, StepDef } from "./types";

const Scene = () => null;
const step = (id: string, chrome?: StepDef["chrome"]): StepDef => ({ id, moves: [], chrome });
const count = (value: number, at?: number) => [{ key: "total", on: { count: value }, off: { count: 0 }, at }];

const deck: DeckDef = {
  id: "d",
  title: "D",
  notesPath: "/n",
  chrome: { Scene, anchors: { row: { x: 96, y: 920, w: 1408, h: 72 } } },
  worlds: [
    { title: "One", world: { id: "one", Scene, steps: [step("a"), step("b", count(3, 0.4)), step("c")] } },
    { title: "Two", world: { id: "two", Scene, steps: [step("a"), step("b", [...count(7), { key: "rule", on: { "--d": 1 }, off: { "--d": 0 } }])] } },
  ],
};

describe("the persistent layer", () => {
  it("is absent from a deck that has none", () => {
    expect(chromeWorld({ ...deck, chrome: undefined })).toBeNull();
  });

  it("has one step for every step of the deck, addressed by world and step", () => {
    const layer = chromeWorld(deck)!;
    expect(layer.steps.map((s) => s.id)).toEqual(["one/a", "one/b", "one/c", "two/a", "two/b"]);
    expect(layer.anchors?.row).toEqual({ x: 96, y: 920, w: 1408, h: 72 });
  });

  it("compiles to a whole picture per step, held through steps and worlds that say nothing", () => {
    const { states, plays } = compile(chromeWorld(deck)!);
    expect(states.map((state) => state.total.count)).toEqual([0, 0, 3, 3, 3, 7]);
    expect(states.map((state) => state.rule["--d"])).toEqual([0, 0, 0, 0, 0, 1]);
    expect(plays.map((list) => list.length)).toEqual([0, 1, 0, 0, 2]);
    expect(plays[1][0].at).toBe(0.4);
  });

  it("refuses a camera move, since the layer has no camera", () => {
    const broken: DeckDef = { ...deck, worlds: [{ title: "One", world: { id: "one", Scene, steps: [step("a", [{ camera: { fx: 0.5, fy: 0.5, scale: 2 } }])] } }] };
    expect(() => chromeWorld(broken)).toThrow(/one\/a/);
  });
});
