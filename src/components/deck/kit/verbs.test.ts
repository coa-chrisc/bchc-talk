import { describe, expect, it } from "vitest";
import { compile } from "../engine/compile";
import { board, multiples } from "./board-layout";
import { HOLD } from "./tokens";
import { RETITLE, behind, camera, chain, clear, covered, dim, draw, fail, gather, ghost, lines, pass, retitle, ride, rise, show, span, spread, step, tell, unwipe, wipe, work } from "./verbs";

const Scene = () => null;
const layout = board({ id: "b", x: 0, y: 0, w: 1000, rows: [{ label: "Build", cells: 4 }] });
const [row] = layout.rows;
const grid = multiples({ id: "m", from: layout.box, area: { x: 0, y: 0, w: 2000, h: 1000 }, cols: 2, rows: 1 });

describe("the house moves", () => {
  it("plays a list of parts one after another without holding up what follows", () => {
    const { plays } = compile({ id: "w", Scene, steps: [step("a", [rise(["x", "y", "z"], { stagger: 0.1 }), rise("after")])] });
    expect(plays[0].map((play) => Number(play.at.toFixed(2)))).toEqual([0, 0.1, 0.2, 0.13]);
  });

  it("fills a cell and rides the row's dot along with it", () => {
    const { states, plays } = compile({ id: "w", Scene, steps: [step("a", [work(row, 1)])] });
    expect(states[0][row.dotKey]).toEqual({ x: 0, autoAlpha: 0 });
    expect(states[1][row.cells[1].key]).toEqual({ "--k": 1 });
    expect(states[1][row.dotKey]).toEqual({ x: row.cells[1].x + row.cells[1].w - row.dotAt.x, autoAlpha: 1 });
    expect(plays[0][0].at).toBe(plays[0][1].at);
  });

  it("gives every step a whole picture, through a fail, a rework and a pass", () => {
    const cell = row.cells[0];
    const { states } = compile({
      id: "w",
      Scene,
      steps: [step("work", [work(row, 0)]), step("fail", [fail(cell)]), step("again", [clear(cell), work(row, 0)]), step("pass", [pass(cell), ghost(layout.key)])],
    });
    expect(states.map((state) => state[cell.key])).toEqual([
      { "--k": 0, "--pass": 0, "--fail": 0 },
      { "--k": 1, "--pass": 0, "--fail": 0 },
      { "--k": 1, "--pass": 0, "--fail": 1 },
      { "--k": 1, "--pass": 0, "--fail": 0 },
      { "--k": 1, "--pass": 1, "--fail": 0 },
    ]);
    expect(states.map((state) => state[layout.key].autoAlpha)).toEqual([1, 1, 1, 1, 0.25]);
  });

  it("spreads one picture into a grid and gathers it back to where it began", () => {
    const { states } = compile({ id: "w", Scene, steps: [step("many", [spread("hero", grid), camera({ fx: 0.5, fy: 0.5, scale: 0.5 })]), step("one", [gather("hero", grid)])] });
    expect(states[1].hero).toEqual({ "--x": grid.hero.x, "--y": grid.hero.y, "--s": grid.hero.scale });
    expect(states[1]["m.1"]).toEqual({ autoAlpha: 1 });
    expect(states[2].hero).toEqual(states[0].hero);
    expect(states[2]["m.1"]).toEqual({ autoAlpha: 0 });
  });
});

describe("the wipe", () => {
  it("opens out of a corner by drawing back the two sides away from it", () => {
    expect(covered("bottom-right")).toEqual({ "--wt": 100, "--wr": 0, "--wb": 0, "--wl": 100 });
    expect(covered("left")).toEqual({ "--wt": 0, "--wr": 100, "--wb": 0, "--wl": 0 });
    expect(covered("top")).toEqual({ "--wt": 0, "--wr": 0, "--wb": 100, "--wl": 0 });
  });

  it("is shut before its first step, open after it, and can shut toward another corner", () => {
    const { states } = compile({ id: "w", Scene, steps: [step("open", [wipe("frame", { from: "bottom-right" })]), step("hold", []), step("shut", [unwipe("frame", { toward: "bottom-left" })])] });
    const open = { "--wt": 0, "--wr": 0, "--wb": 0, "--wl": 0 };
    expect(states.map((state) => state.frame)).toEqual([covered("bottom-right"), open, open, covered("bottom-left")]);
  });
});

describe("the smaller house moves", () => {
  it("changes a title the same way every time", () => {
    const { states, plays } = compile({ id: "w", Scene, steps: [step("a", [lines("one")]), step("b", [retitle("one", "two")])] });
    expect(states[2].one).toEqual({ yPercent: 0, autoAlpha: 0 });
    expect(states[2].two).toEqual({ yPercent: 0 });
    expect(plays[1].map((play) => [play.at, play.duration])).toEqual([
      [0, RETITLE.out],
      [RETITLE.at, RETITLE.in],
    ]);
  });

  it("dims to a level between full strength and a ghost", () => {
    const { states } = compile({ id: "w", Scene, steps: [step("a", [dim("quote")])] });
    expect(states.map((state) => state.quote.autoAlpha)).toEqual([1, 0.45]);
  });

  it("puts the layer's moves on the step, apart from the world's", () => {
    const steps = [step("a", [rise("x")], [rise("layer")]), step("b", [])];
    expect(steps.map((s) => s.chrome?.length ?? 0)).toEqual([1, 0]);
    expect(steps[0].chrome![0]).toMatchObject({ key: "layer", on: { autoAlpha: 1, y: 0 } });
    expect(steps[0].moves).toHaveLength(1);
  });

  it("times ticks to fall behind a drawing line's front", () => {
    const times = behind({ at: 0.4, duration: 0.8 }, [0, 0.125, 0.5, 0.875, 1]);
    expect(times.map((t) => Number(t.toFixed(3)))).toEqual([0.4, 0.6, 0.8, 1, 1.2]);
  });
});

describe("a chain of beats in one click", () => {
  const timesOf = (moves: Parameters<typeof step>[1]) => compile({ id: "w", Scene, steps: [step("a", moves)] }).plays[0].map((play) => Number(play.at.toFixed(3)));

  it("starts each beat a gap after the one before has landed, or a read's hold after a story line", () => {
    const moves = chain([{ moves: [rise("a", { at: 0.3 })] }, { moves: [draw("b", { at: 0 })] }, { moves: [tell("story.a", { at: 0 })] }, { moves: [show("c", { at: 0 })], hold: HOLD.read }]);
    // a lands at 1.05; b a gap later lands at 2.45; the line a gap later lands at 3.7; c a read later.
    expect(timesOf(moves)).toEqual([0.3, 1.55, 2.95, 5.3]);
  });

  it("starts a beat with the one before it when the line and the drawing it names go together", () => {
    const moves = chain([{ moves: [draw("frame", { at: 0.3 })] }, { moves: [tell("story.a")], with: true, hold: 0.9 }, { moves: [rise("label", { at: 0 })] }]);
    // The line starts 0.9 after the frame's beat starts; the label waits a gap after the later of the two lands (the line, at 1.65).
    expect(timesOf(moves)).toEqual([0.3, 0.9, 2.15]);
  });

  it("keeps the moves' own timing inside a beat: a beat apart when untimed, with, and lag", () => {
    const beat = [rise("x"), rise("y"), rise("z", { with: true }), rise("w", { at: 0.5, lag: 0.2 })];
    const alone = compile({ id: "w", Scene, steps: [step("a", beat)] }).plays[0];
    const chained = compile({ id: "w", Scene, steps: [step("a", chain([{ moves: [] }, { moves: beat, hold: 1 }]))] }).plays[0];
    expect(chained.map((play) => Number((play.at - 1).toFixed(3)))).toEqual(alone.map((play) => Number(play.at.toFixed(3))));
  });

  it("waits out a stagger across every element of a counted part", () => {
    const beats = [{ moves: [rise("lines", { at: 0, stagger: 0.5 })] }, { moves: [show("next", { at: 0 })] }];
    expect(timesOf(chain(beats)).at(-1)).toBe(1.25);
    expect(timesOf(chain(beats, { counts: { lines: 3 } })).at(-1)).toBe(2.25);
  });

  it("starts the first beat at the chain's own start, plus its hold", () => {
    expect(timesOf(chain([{ moves: [rise("a", { at: 0.1 })], hold: 0.2 }], { at: 0.95 }))).toEqual([1.25]);
  });

  it("ends on the same picture as its beats' moves played in order", () => {
    const beats = [{ moves: [rise("a"), draw("b")] }, { moves: [ghost("a"), camera({ fx: 0.5, fy: 0.5, scale: 2 })] }, { moves: [dim("b")] }];
    const flat = compile({ id: "w", Scene, steps: [step("a", beats.flatMap((beat) => beat.moves))] });
    const chained = compile({ id: "w", Scene, steps: [step("a", chain(beats))] });
    expect(chained.states).toEqual(flat.states);
    expect(chained.cameras).toEqual(flat.cameras);
  });

  it("measures how long a list of moves runs, staggers counted", () => {
    expect(span([rise("a", { at: 0.3 }), draw("b", { at: 0.2 })])).toBeCloseTo(1.1, 10);
    expect(span([rise("lines", { at: 0, stagger: 0.1 })], { lines: 4 })).toBeCloseTo(1.05, 10);
    expect(span([])).toBe(0);
  });
});

describe("the story line and the rider", () => {
  it("brings a story line up out of its mask in the house arrival", () => {
    const [move] = tell("story.find.a", { at: 1.2 });
    expect(move).toMatchObject({ key: "story.find.a", on: { yPercent: 0 }, off: { yPercent: 120 }, duration: 0.75, ease: "expo.out", at: 1.2 });
  });

  it("rides to the end of its path, showing over the first 0.2 s, and lands there on a cut", () => {
    const { states, plays } = compile({ id: "w", Scene, steps: [step("a", [ride("dollar", { at: 1.9 })])] });
    expect(states[0].dollar).toEqual({ along: 0, autoAlpha: 0 });
    expect(states[1].dollar).toEqual({ along: 1, autoAlpha: 1 });
    expect(plays[0].map((play) => [play.at, play.duration])).toEqual([
      [1.9, 1.2],
      [1.9, 0.2],
    ]);
  });
});
