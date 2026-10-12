import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import { compile } from "./compile";
import { createDirector } from "./director";
import { createDriver } from "./driver";
import { gsap } from "./gsap";
import type { WorldDef } from "./types";

/**
 * Real GSAP on a clock moved by hand. There is no DOM library here, so an
 * element is the least CSSPlugin reads and writes: a node type and a style
 * that keeps custom properties and the plain ones the director fades. GSAP registers CSSPlugin only
 * when a window exists, so the window is made before GSAP is imported.
 */
type Fake = { nodeType: 1; style: Record<string, unknown>; vars: Map<string, string> };

const { element } = vi.hoisted(() => {
  function element(): Fake {
    const vars = new Map<string, string>();
    const style: Record<string, unknown> = {
      opacity: "",
      visibility: "",
      setProperty: (name: string, value: unknown) => vars.set(name, String(value)),
      getPropertyValue: (name: string) => vars.get(name) ?? (style[name] as string | undefined) ?? "",
      removeProperty: (name: string) => {
        const value = vars.get(name) ?? "";
        vars.delete(name);
        return value;
      },
    };
    return { nodeType: 1, style, vars };
  }
  const g = globalThis as Record<string, unknown>;
  const document = { createElement: () => element(), documentElement: element() };
  g.window = { document };
  g.document = document;
  g.getComputedStyle = (target: Fake) => target.style;
  return { element };
});

function root(parts: Record<string, Fake[]>) {
  return {
    querySelector: () => null,
    querySelectorAll: (selector: string) => parts[/data-build="([^"]+)"/.exec(selector)![1]] ?? [],
  } as unknown as HTMLElement;
}

const read = (fakes: Fake[], name: string) => fakes.map((fake) => Number.parseFloat(fake.vars.get(name) ?? "NaN"));

let now = 0;
/** Moves GSAP's clock on by `seconds`, in frames. */
function advance(seconds: number) {
  const end = now + seconds;
  while (now < end - 1e-9) {
    now = Math.min(end, now + 1 / 60);
    gsap.updateRoot(now);
  }
}

beforeAll(() => {
  gsap.ticker.remove(gsap.updateRoot);
  now = gsap.globalTimeline.time();
});

afterAll(() => {
  gsap.ticker.add(gsap.updateRoot);
  const g = globalThis as Record<string, unknown>;
  delete g.window;
  delete g.document;
  delete g.getComputedStyle;
});

/** Slide 30 to 31 of the releasing world in miniature: a slot wiped by a custom property, rows staggered in, one part that starts late. */
const world: WorldDef = {
  id: "w",
  Scene: () => null,
  steps: [
    { id: "pack", moves: [{ key: "slot", on: { "--wb": 100 }, off: { "--wb": 0 } }] },
    {
      id: "wipe",
      moves: [
        { key: "slot", on: { "--wb": 0 }, duration: 0.8, ease: "none" },
        { key: "rows", on: { "--k": 1 }, off: { "--k": 0 }, duration: 0.8, ease: "none", stagger: 0.2, with: true },
        { key: "late", on: { "--k": 1 }, off: { "--k": 0 }, duration: 0.8, ease: "none", at: 1 },
      ],
    },
  ],
};

describe("stopping a build part way", () => {
  it("leaves nothing moving after a cut back to the step before", () => {
    const parts = { slot: [element()], rows: [element(), element(), element()], late: [element()] };
    const driver = createDriver(root(parts), world);
    driver.set(0);
    driver.play(1, () => {});
    advance(0.3);
    expect(read(parts.slot, "--wb")[0]).toBeLessThan(100);
    expect(driver.playing()).toBe(true);

    driver.set(0);
    advance(2);

    expect(driver.playing()).toBe(false);
    expect(read(parts.slot, "--wb")).toEqual([100]);
    expect(read(parts.rows, "--k")).toEqual([0, 0, 0]);
    expect(read(parts.late, "--k")).toEqual([0]);
  });

  it("leaves the stage on the step's own picture when a build is landed early", () => {
    const parts = { slot: [element()], rows: [element(), element(), element()], late: [element()] };
    const driver = createDriver(root(parts), world);
    driver.set(0);
    let landed = 0;
    driver.play(1, () => landed++);
    advance(0.3);
    driver.settle();
    expect(landed).toBe(1);
    advance(2);

    expect(landed).toBe(1);
    const picture = compile(world).states[2];
    expect(read(parts.slot, "--wb")).toEqual([picture.slot["--wb"]]);
    expect(read(parts.rows, "--k")).toEqual([1, 1, 1]);
    expect(read(parts.late, "--k")).toEqual([1]);
  });

  it("goes back through the director as the deck does: settle the build, then cut to the step before", () => {
    const parts = { slot: [element()], rows: [element(), element(), element()], late: [element()] };
    const frame = Object.assign(element(), root(parts));
    const director = createDirector([frame as unknown as HTMLElement], [element() as unknown as HTMLElement], [world]);
    director.place({ world: 0, step: 0 });
    director.go({ world: 0, step: 0 }, { world: 0, step: 1 }, "advance");
    advance(0.3);
    expect(director.busy()).toBe(true);

    director.settle();
    director.go({ world: 0, step: 1 }, { world: 0, step: 0 }, "retreat");
    advance(0.2);
    const after = [read(parts.slot, "--wb"), read(parts.rows, "--k"), read(parts.late, "--k")];
    advance(1.8);

    expect([read(parts.slot, "--wb"), read(parts.rows, "--k"), read(parts.late, "--k")]).toEqual(after);
    expect(after).toEqual([[100], [0, 0, 0], [0]]);
  });

  it("goes back during a change of world and leaves both worlds still", () => {
    const next: WorldDef = { id: "v", Scene: () => null, steps: [{ id: "mark", moves: [{ key: "mark", on: { "--k": 1 }, off: { "--k": 0 }, duration: 0.8 }] }] };
    const parts = { slot: [element()], rows: [element(), element(), element()], late: [element()] };
    const marks = { mark: [element()] };
    const frames = [Object.assign(element(), root(parts)), Object.assign(element(), root(marks))];
    const director = createDirector(frames as unknown as HTMLElement[], [element() as unknown as HTMLElement], [world, next]);
    director.place({ world: 0, step: 1 });
    director.go({ world: 0, step: 1 }, { world: 1, step: 0 }, "advance");
    advance(0.3);

    director.settle();
    director.go({ world: 1, step: 0 }, { world: 0, step: 1 }, "retreat");
    const look = () => [...frames.map((frame) => [frame.style.opacity, frame.style.visibility]), read(marks.mark, "--k"), read(parts.slot, "--wb"), read(parts.rows, "--k")];
    advance(0.2);
    const after = look();
    advance(1.8);

    expect(look()).toEqual(after);
    expect(after).toEqual([[1, "inherit"], [0, "hidden"], [1], [0], [1, 1, 1]]);
  });

  it("plays the step in full again after such a back", () => {
    const parts = { slot: [element()], rows: [element(), element(), element()], late: [element()] };
    const driver = createDriver(root(parts), world);
    driver.set(0);
    driver.play(1, () => {});
    advance(0.3);
    driver.set(0);

    let landed = false;
    driver.play(1, () => (landed = true));
    advance(0.4);
    expect(read(parts.slot, "--wb")[0]).toBeCloseTo(50, 0);
    advance(2);
    expect(landed).toBe(true);
    expect(read(parts.slot, "--wb")).toEqual([0]);
    expect(read(parts.rows, "--k")).toEqual([1, 1, 1]);
  });
});
