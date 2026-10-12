/**
 * Slide 23 in motion: the click played forward, frame by frame, with every
 * tool card where its moves put it at each moment. No card crosses another,
 * an agent, a department's ring or its name at any moment, but where a card
 * is drawn off another (a tool posted from a department's own, a copy taken
 * from the catalog's) and has not yet left it.
 */
import { describe, expect, it } from "vitest";
import { AGENT_R, EASE, type Box } from "@/components/deck/kit";
import { CARD } from "./layout";
import { TOGETHER } from "./layout-together";
import { ends, n, overlaps, playOf, playsAt, ringBox, startOf, world } from "./harness";

const id = "together.play";
const T = TOGETHER;
/** Every part as the click finds it. */
const before = world.states[n(id)];

/** A cubic Bézier easing, as CSS and GSAP's CustomEase draw it, solved for its progress at time `x`. */
const bezier = (x1: number, y1: number, x2: number, y2: number) => (x: number) => {
  const at = (a: number, b: number, t: number) => 3 * (1 - t) ** 2 * t * a + 3 * (1 - t) * t * t * b + t ** 3;
  let lo = 0;
  let hi = 1;
  for (let i = 0; i < 40; i++) {
    const t = (lo + hi) / 2;
    if (at(x1, x2, t) < x) lo = t;
    else hi = t;
  }
  return at(y1, y2, (lo + hi) / 2);
};
/** The easings the click's moves use (kit tokens.ts, engine/gsap.ts). */
const EASES: Record<string, (t: number) => number> = {
  [EASE.page]: bezier(0.2, 0, 0, 1),
  [EASE.soft]: bezier(0.2, 0.65, 0.3, 1),
  [EASE.out]: (t) => (t >= 1 ? 1 : 1 - 2 ** (-10 * t)),
  [EASE.draw]: (t) => (t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2),
};

/** A part's value of `prop` at `t` seconds after the click, its moves played in order. */
const valueAt = (key: string, prop: string, t: number) => {
  let value = Number(before[key]?.[prop] ?? 0);
  for (const play of playOf(id, key).filter((entry) => prop in entry.on)) {
    if (t <= play.at) break;
    const ease = EASES[play.ease];
    if (!ease) throw new Error(`No easing "${play.ease}" in the motion test.`);
    const target = Number(play.on[prop]);
    const f = Math.min(1, (t - play.at) / play.duration);
    value = value + (target - value) * ease(f);
    if (f < 1) break;
  }
  return value;
};

const card = (at: { x: number; y: number }, key: string, t: number): Box => ({ x: at.x + valueAt(key, "x", t), y: at.y + valueAt(key, "y", t), w: CARD.w, h: CARD.h });

type Chip = { key: string; box: (t: number) => Box; drawnOff?: string };
const chips: Chip[] = [
  ...T.departments.map((dept) => ({ key: dept.own.key, box: (t: number) => card(dept.own.at, dept.own.key, t) })),
  ...T.posts.map((post) => ({ key: post.key, box: (t: number) => card(post.at, post.key, t), drawnOff: T.departments[post.tool].own.key })),
  ...T.copies.map((copy) => ({ key: copy.key, box: (t: number) => card(copy.at, copy.key, t), drawnOff: T.posts[copy.tool].key })),
];
/** What stands still on the slide once drawn: each department's agents, its ring and its name. */
const fixtures = T.departments.flatMap((dept) => [
  { key: dept.agent.key, prop: "--d", box: ringBox(dept.agent.at, AGENT_R + 2) },
  { key: dept.key, prop: "--d", box: ringBox(dept.at, dept.r + 2) },
  { key: dept.key, prop: "--d", box: dept.name.at },
]).concat({ key: T.agents.key, prop: "autoAlpha", box: T.agents.at });

const visible = (key: string, t: number) => valueAt(key, "autoAlpha", t) > 0;
/** A card drawn off another is let lie over it until it has had this long to leave it. */
const LEAVING = 0.45;
/** How far apart two cards keep as they pass: less than the gap between a stack's places. */
const CLEAR = 8;
const grown = (b: Box, by: number): Box => ({ x: b.x - by, y: b.y - by, w: b.w + 2 * by, h: b.h + 2 * by });
const last = Math.max(...playsAt(id).map(ends));
const frames = Array.from({ length: Math.ceil(last / 0.01) + 1 }, (_, i) => i * 0.01);

describe("23. share one tool, get them all, in motion", () => {
  it("knows every easing the click's card moves use", () => {
    for (const chip of chips) for (const play of playOf(id, chip.key)) expect(EASES[play.ease], `${chip.key}: ${play.ease}`).toBeDefined();
  });

  it(`never lays one card over another, or within ${CLEAR} px of it, but a card just drawn off the one under it`, () => {
    const crossings: string[] = [];
    for (const t of frames) {
      const shown = chips.filter((chip) => visible(chip.key, t));
      for (const [i, a] of shown.entries()) {
        for (const b of shown.slice(i + 1)) {
          const leaving = (x: Chip, y: Chip) => x.drawnOff === y.key && t < startOf(id, x.key) + LEAVING;
          if (leaving(a, b) || leaving(b, a)) continue;
          if (overlaps(grown(a.box(t), CLEAR), b.box(t))) crossings.push(`${t.toFixed(2)} s: ${a.key} over ${b.key}`);
        }
      }
    }
    expect(crossings.slice(0, 10)).toEqual([]);
  });

  it("never passes a card over a department's agents, its ring or its name", () => {
    const crossings: string[] = [];
    for (const t of frames) {
      for (const chip of chips.filter((entry) => visible(entry.key, t))) {
        for (const fixture of fixtures) {
          if (valueAt(fixture.key, fixture.prop, t) > 0 && overlaps(chip.box(t), fixture.box)) crossings.push(`${t.toFixed(2)} s: ${chip.key} over ${fixture.key}`);
        }
      }
    }
    expect(crossings.slice(0, 10)).toEqual([]);
  });
});
