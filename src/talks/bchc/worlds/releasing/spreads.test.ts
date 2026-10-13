/** Slide 33a, the help spreads: Part 5's last picture. Its words, its tree's geometry, its chain's order and length, and what it leaves on the stage. */
import { describe, expect, it, vi } from "vitest";
import { CHAIN, CONTENT_TOP, HOLD, STAGE, STORY } from "@/components/deck/kit";
import { shown, storyOf } from "../../script/find";

// The stage imports its stylesheet; it does not matter to the markup under test.
vi.mock("./releasing.css", () => ({}));

const { compiled, endOf, ends, hueOf, markup, playsOf, propPlays, ruleOf, shownAt, startOf, stateAt, texts, world } = await import("./test-support");
const { OWN, STORIES, TITLES } = await import("./layout");
const { AUSTIN, FIELD, NEXT_DEPTS, NEXT_LABEL, READY, READY_LABEL, ROOT_TABLE, SHRINK: SCALE, SHRUNK, SPREADS_OWN } = await import("./layout-spreads");
const { TABLE } = await import("./layout-workshop");
const { A_AT, BRANCH_AT, B_AT, FAINT, NEXT_AT, SHRINK } = await import("./steps-spreads");

type Area = { x: number; y: number; w: number; h: number };
type Circle = { at: { x: number; y: number }; r: number; key: string };

const step = "spreads.play";
const circles: Circle[] = [AUSTIN, ...READY, ...NEXT_DEPTS];
const tables = [ROOT_TABLE, ...READY.map((ready) => ready.table)];
const labels = [READY_LABEL, NEXT_LABEL];
const lines = [...READY.map((ready) => ready.tie), ...NEXT_DEPTS.map((next) => next.branch)];
const storyKeys = STORIES.spreads.keys;

/** The gap between two areas: negative where they overlap. */
const apart = (a: Area, b: Area) => Math.max(b.x - (a.x + a.w), a.x - (b.x + b.w), b.y - (a.y + a.h), a.y - (b.y + b.h));
/** The gap between a circle's edge and an area. */
const circleApart = (c: Circle, b: Area) => {
  const dx = Math.max(b.x - c.at.x, 0, c.at.x - (b.x + b.w));
  const dy = Math.max(b.y - c.at.y, 0, c.at.y - (b.y + b.h));
  return Math.hypot(dx, dy) - c.r;
};
/** How far a point is from a straight line's run between its two ends. */
const fromSegment = (p: { x: number; y: number }, l: { from: { x: number; y: number }; to: { x: number; y: number } }) => {
  const vx = l.to.x - l.from.x;
  const vy = l.to.y - l.from.y;
  const t = Math.max(0, Math.min(1, ((p.x - l.from.x) * vx + (p.y - l.from.y) * vy) / (vx * vx + vy * vy)));
  return Math.hypot(p.x - (l.from.x + t * vx), p.y - (l.from.y + t * vy));
};
/** Every play in the step but its story lines, and when the last of them lands. */
const drawing = () => playsOf(step).filter((play) => "key" in play && !storyKeys.includes(play.key));
const storyStart = (n: number) => startOf(step, storyKeys[n]);
const storyEnd = (n: number) => endOf(step, storyKeys[n]);

describe("slide 33a, the help spreads", () => {
  it("follows slide 33 as Part 5's last click, one click more than before: six in all", () => {
    expect(world.steps.map((s) => s.id)).toEqual(["releasing.play", "skills.play", "source.play", "design-yours.play", "workshops.play", "spreads.play"]);
    expect(world.steps).toHaveLength(6);
  });

  it("labels Austin, the ready departments and the next ones once each, from the script, and puts every part of its own on the stage once", () => {
    expect([AUSTIN.text, READY_LABEL.text, NEXT_LABEL.text]).toEqual(shown("spreads", "play"));
    expect([AUSTIN.text, READY_LABEL.text, NEXT_LABEL.text]).toEqual(["Austin", "Ready now", "Next"]);
    // Austin is named twice in the world: in slide 33's chat window and on its circle here.
    expect(texts.filter((t) => t === "Austin")).toHaveLength(2);
    for (const text of ["Ready now", "Next"]) expect(texts.filter((t) => t === text), text).toHaveLength(1);
    for (const key of SPREADS_OWN) expect(markup.split(`data-build="${key}"`).length - 1, key).toBe(1);
    expect(OWN.spreads).toEqual([TITLES.spreads.key, ...storyKeys, ...SPREADS_OWN]);
    // The title fits one line, so its story band sits under one line.
    expect(TITLES.spreads.lines).toEqual(["The departments that start first will teach the next."]);
    expect(STORIES.spreads.band).toBe("one");
    expect(STORIES.spreads.lines).toEqual(storyOf("spreads"));
    // Slide 33's title is the setup guides now, on one line.
    expect(TITLES.workshops.lines).toEqual(["Setup guides come with the release."]);
  });

  it("builds a tree three levels deep from Austin at the left: three ready departments, each with its own table and two or three next ones", () => {
    expect(READY).toHaveLength(3);
    for (const [i, ready] of READY.entries()) {
      const group = NEXT_DEPTS.filter((next) => next.group === i);
      expect([2, 3], ready.key).toContain(group.length);
    }
    const xs = (list: readonly Circle[]) => list.map((c) => c.at.x);
    expect(Math.max(AUSTIN.at.x, ...tables.slice(0, 1).map((t) => t.at.x + t.at.w))).toBeLessThan(Math.min(...xs(READY)) - READY[0].r);
    expect(Math.max(...READY.map((ready) => ready.table.at.x + ready.table.at.w))).toBeLessThan(Math.min(...xs(NEXT_DEPTS)) - NEXT_DEPTS[0].r);
    // Austin is the root, at the left of the stage, not its middle, level with the middle ready department.
    expect(AUSTIN.at.x).toBeLessThan(STAGE.w / 4);
    expect(AUSTIN.at.y).toBe(READY[1].at.y);
    // Each table sits at its department's right, level with it, a little way off its circle.
    for (const [c, t] of [[AUSTIN, ROOT_TABLE] as const, ...READY.map((ready) => [ready, ready.table] as const)]) {
      expect(t.at.y + t.at.h / 2, t.key).toBe(c.at.y);
      expect(t.at.x - (c.at.x + c.r), t.key).toBeGreaterThanOrEqual(12);
    }
  });

  it("shrinks slide 33's table onto Austin's: its top left corner to the small table's, at a fifth of its size, corners and all", () => {
    expect(TABLE.at.x + SHRUNK["--x"]).toBe(ROOT_TABLE.at.x);
    expect(TABLE.at.y + SHRUNK["--y"]).toBe(ROOT_TABLE.at.y);
    expect(SHRUNK["--s"]).toBe(SCALE);
    for (const t of tables) {
      expect(t.at.w, t.key).toBeCloseTo(TABLE.at.w * SCALE, 9);
      expect(t.at.h, t.key).toBeCloseTo(TABLE.at.h * SCALE, 9);
      expect(t.rx, t.key).toBeCloseTo(TABLE.rx * SCALE, 9);
    }
    // Slide 33's table is carried and scaled about its top left corner.
    expect(markup).toContain(`data-build="${TABLE.key}" class="dk-move" style="transform-origin:${TABLE.at.x}px ${TABLE.at.y}px"`);
  });

  it("keeps every circle, table and label inside the field under the story band, clear of each other", () => {
    const bandFoot = STORY.top.one + STORY.pitch * STORIES.spreads.lines.length;
    expect(FIELD.top).toBeGreaterThanOrEqual(bandFoot);
    // The field starts where a one-line title's content does.
    expect(FIELD.top).toBe(CONTENT_TOP.one);
    const inField = (a: Area, what: string) => {
      expect(a.x, what).toBeGreaterThanOrEqual(FIELD.left);
      expect(a.x + a.w, what).toBeLessThanOrEqual(FIELD.right);
      expect(a.y, what).toBeGreaterThanOrEqual(FIELD.top);
      expect(a.y + a.h, what).toBeLessThanOrEqual(FIELD.floor);
    };
    for (const c of circles) inField({ x: c.at.x - c.r - 1.5, y: c.at.y - c.r - 1.5, w: 2 * c.r + 3, h: 2 * c.r + 3 }, c.key);
    for (const t of tables) inField(t.at, t.key);
    for (const l of labels) inField(l.at, l.key);
    // Circles: 16 px clear of each other, 12 of every table and label.
    for (const [i, a] of circles.entries()) {
      for (const b of circles.slice(i + 1)) expect(Math.hypot(a.at.x - b.at.x, a.at.y - b.at.y) - a.r - b.r, `${a.key} ${b.key}`).toBeGreaterThanOrEqual(16);
      for (const t of tables) expect(circleApart(a, t.at), `${a.key} ${t.key}`).toBeGreaterThanOrEqual(12);
      for (const l of labels) expect(circleApart(a, l.at), `${a.key} ${l.key}`).toBeGreaterThanOrEqual(12);
    }
    // Tables and labels: 12 px clear of each other.
    for (const [i, a] of [...tables, ...labels].entries()) for (const b of [...tables, ...labels].slice(i + 1)) expect(apart(a.at, b.at), `${a.key} ${b.key}`).toBeGreaterThanOrEqual(12);
    // Each label over its column: "Ready now" over the ready departments, "Next" over the next ones, above the top one.
    expect(READY_LABEL.centre.x).toBe(READY[0].at.x);
    expect(READY_LABEL.at.y + READY_LABEL.at.h).toBeLessThan(Math.min(...READY.map((c) => c.at.y - c.r)));
    expect(NEXT_LABEL.at.x).toBeGreaterThanOrEqual(Math.min(...NEXT_DEPTS.map((c) => c.at.x)));
    expect(NEXT_LABEL.at.x + NEXT_LABEL.at.w).toBeLessThanOrEqual(Math.max(...NEXT_DEPTS.map((c) => c.at.x)));
    expect(NEXT_LABEL.at.y + NEXT_LABEL.at.h).toBeLessThan(Math.min(...NEXT_DEPTS.map((c) => c.at.y - c.r)));
    // Austin's name fits inside its circle's 3 px edge.
    const { name } = AUSTIN;
    for (const [x, y] of [[name.x, name.y], [name.x + name.w, name.y + name.h]]) expect(Math.hypot(x - AUSTIN.at.x, y - AUSTIN.at.y)).toBeLessThanOrEqual(AUSTIN.r - 1.5);
  });

  it("runs each line from its table's right end to the edge of its circle, 12 px clear of every other circle and table", () => {
    const ends = [...READY.map((ready) => ({ line: ready.tie, table: ROOT_TABLE, circle: ready as Circle })), ...NEXT_DEPTS.map((next) => ({ line: next.branch, table: READY[next.group].table, circle: next as Circle }))];
    expect(ends).toHaveLength(lines.length);
    for (const { line, table, circle } of ends) {
      expect(line.from, line.key).toEqual({ x: table.at.x + table.at.w, y: table.at.y + table.at.h / 2 });
      expect(Math.hypot(line.to.x - circle.at.x, line.to.y - circle.at.y), line.key).toBeCloseTo(circle.r, 9);
      // The 3 px line keeps 12 px of white between it and anything it does not join.
      for (const other of circles.filter((c) => c !== circle)) expect(fromSegment(other.at, line) - other.r - 1.5, `${line.key} ${other.key}`).toBeGreaterThanOrEqual(12);
      for (const t of tables.filter((t) => t !== table)) {
        const corners = [t.at, { x: t.at.x + t.at.w, y: t.at.y }, { x: t.at.x, y: t.at.y + t.at.h }, { x: t.at.x + t.at.w, y: t.at.y + t.at.h }];
        const clear = Math.max(line.from.x, line.to.x) < t.at.x || Math.min(line.from.x, line.to.x) > t.at.x + t.at.w || corners.every((p) => fromSegment(p, line) >= 12);
        expect(clear, `${line.key} ${t.key}`).toBe(true);
      }
    }
  });

  it("clears slide 33 at the click, then shrinks its table onto Austin's, which takes its place in a cut as it lands, with Austin's circle, by 1.5 s", () => {
    const leaving = OWN.workshops.filter((key) => key !== TITLES.workshops.key && key !== TABLE.key);
    for (const key of leaving) {
      expect(startOf(step, key), key).toBe(0);
      expect(endOf(step, key), key).toBeLessThanOrEqual(0.3);
    }
    const [shrink] = propPlays(step, TABLE.key, "--s");
    expect(shrink.on).toEqual(SHRUNK);
    expect(shrink.at).toBeLessThanOrEqual(0.3);
    // The seats, the booklets and the chat window have gone before the table moves.
    expect(shrink.at).toBeGreaterThanOrEqual(Math.max(...leaving.map((key) => endOf(step, key))));
    // The swap is a cut the moment the shrink lands: the small table shows as the big one goes.
    const gone = propPlays(step, TABLE.key, "autoAlpha").find((play) => play.on.autoAlpha === 0)!;
    expect(gone.at).toBe(startOf(step, ROOT_TABLE.key));
    expect(gone.at).toBeCloseTo(ends(shrink), 9);
    expect(ends(gone)).toBeLessThanOrEqual(gone.at + 0.01);
    expect(endOf(step, ROOT_TABLE.key)).toBeLessThanOrEqual(gone.at + 0.01);
    expect(ends(shrink)).toBeCloseTo(SHRINK.at + SHRINK.duration, 9);
    expect(endOf(step, ROOT_TABLE.key)).toBeLessThanOrEqual(1.5);
    expect(endOf(step, AUSTIN.key)).toBeLessThanOrEqual(1.5);
    expect(startOf(step, AUSTIN.key)).toBeLessThan(ends(shrink));
  });

  it("joins the three ready departments one after another, line then circle, with line A and then their label", () => {
    for (const [i, ready] of READY.entries()) {
      expect(startOf(step, ready.key), ready.key).toBeGreaterThan(startOf(step, ready.tie.key));
      expect(startOf(step, ready.key), ready.key).toBeLessThan(endOf(step, ready.tie.key));
      expect(startOf(step, ready.tie.key), ready.tie.key).toBeGreaterThanOrEqual(endOf(step, AUSTIN.key));
      if (i > 0) expect(startOf(step, ready.tie.key)).toBeGreaterThan(startOf(step, READY[i - 1].tie.key));
    }
    expect(storyStart(0)).toBeCloseTo(A_AT, 9);
    expect(storyStart(0)).toBeGreaterThan(startOf(step, READY[0].tie.key));
    expect(storyStart(0)).toBeLessThan(endOf(step, READY[2].key));
    expect(startOf(step, READY_LABEL.key)).toBeGreaterThan(startOf(step, READY[0].key));
  });

  it("lights each ready department's table once they have all joined, thins and fades Austin's line to it as it does, then joins the next ones to it", () => {
    const joined = Math.max(...READY.map((ready) => endOf(step, ready.key)));
    for (const [i, ready] of READY.entries()) {
      const lit = startOf(step, ready.table.key);
      expect(lit, ready.table.key).toBeGreaterThanOrEqual(joined);
      if (i > 0) expect(lit).toBeGreaterThan(startOf(step, READY[i - 1].table.key));
      const [thin] = propPlays(step, ready.tie.key, "--thin");
      expect(thin.on).toEqual({ autoAlpha: FAINT, "--thin": 1 });
      expect(thin.at, ready.tie.key).toBe(lit);
      for (const next of NEXT_DEPTS.filter((n) => n.group === i)) {
        expect(startOf(step, next.branch.key), next.branch.key).toBeGreaterThan(lit);
        expect(startOf(step, next.key), next.key).toBeGreaterThan(startOf(step, next.branch.key));
        expect(startOf(step, next.key), next.key).toBeLessThan(endOf(step, next.branch.key));
      }
      const group = NEXT_DEPTS.filter((n) => n.group === i).map((n) => startOf(step, n.key));
      expect(group).toEqual([...group].sort((a, b) => a - b));
    }
    // No two lines out of the ready tables set off together.
    const branchStarts = NEXT_DEPTS.map((next) => startOf(step, next.branch.key));
    expect(new Set(branchStarts.map((at) => at.toFixed(6))).size).toBe(branchStarts.length);
    // "Next" once the first next department has started to draw.
    expect(startOf(step, NEXT_LABEL.key)).toBeGreaterThanOrEqual(NEXT_AT[0]);
    expect(startOf(step, NEXT_LABEL.key)).toBeGreaterThanOrEqual(startOf(step, NEXT_DEPTS[0].key));
  });

  it("brings line B with the next departments' lines, a reading hold after line A has landed, and ends on the last next circle", () => {
    expect(storyStart(0)).toBeLessThan(storyStart(1));
    expect(storyStart(1)).toBeCloseTo(B_AT, 9);
    expect(storyStart(1)).toBeGreaterThanOrEqual(Math.min(...BRANCH_AT));
    expect(storyStart(1)).toBeLessThanOrEqual(Math.max(...NEXT_AT));
    expect(storyStart(1) - storyEnd(0)).toBeGreaterThanOrEqual(HOLD.read);
    // The click ends as the last next department's circle lands, at about 5.8 s.
    const last = NEXT_DEPTS.at(-1)!;
    expect(Math.max(...playsOf(step).map(ends))).toBeCloseTo(endOf(step, last.key), 9);
    expect(endOf(step, last.key)).toBeCloseTo(5.8, 9);
    expect(Math.max(...drawing().map(ends))).toBeCloseTo(endOf(step, last.key), 9);
  });

  it("plays in about 6 s, well inside the 12 s cap, and never sits still for 3", () => {
    const plays = playsOf(step);
    const end = Math.max(...plays.map(ends));
    expect(end).toBeGreaterThanOrEqual(5.5);
    expect(end).toBeLessThanOrEqual(6.5);
    expect(end).toBeLessThanOrEqual(CHAIN.longest);
    let landed = 0;
    for (const play of [...plays].sort((a, b) => a.at - b.at)) {
      expect(play.at - landed, "key" in play ? play.key : "camera").toBeLessThan(CHAIN.still);
      landed = Math.max(landed, ends(play));
    }
  });

  it("ends on the whole tree: Austin's table in place of slide 33's, Austin's lines faint and thin, every table lit and every circle drawn", () => {
    const end = stateAt(step);
    expect(shownAt(step).sort()).toEqual([...OWN.spreads].sort());
    expect(end[TABLE.key]).toMatchObject({ autoAlpha: 0, ...SHRUNK });
    expect(end[ROOT_TABLE.key]).toMatchObject({ autoAlpha: 1 });
    for (const ready of READY) {
      expect(end[ready.tie.key], ready.tie.key).toMatchObject({ "--d": 1, autoAlpha: FAINT, "--thin": 1 });
      expect(end[ready.table.key], ready.table.key).toMatchObject({ "--d": 1 });
    }
    for (const c of circles) expect(end[c.key], c.key).toMatchObject({ "--d": 1 });
    for (const next of NEXT_DEPTS) expect(end[next.branch.key], next.branch.key).toMatchObject({ "--d": 1 });
    // Before the click, none of it shows.
    const before = compiled.states[world.steps.findIndex((s) => s.id === step)];
    for (const key of SPREADS_OWN) expect(shownAt("workshops.play"), key).not.toContain(key);
    expect(before[TABLE.key]).toMatchObject({ "--s": 1, "--x": 0, "--y": 0 });
  });

  it("draws the tables and lines in help's sky and the circles in navy line on white, like slide 27's", () => {
    for (const key of [...tables.map((t) => t.key), ...lines.map((l) => l.key)]) expect(hueOf(key), key).toBe("share-help");
    for (const c of circles) expect(markup, c.key).toContain(`class="rel-disc" data-build="${c.key}"`);
    expect(ruleOf(".rel-disc circle")).toMatch(/stroke:\s*var\(--dk-paper\)/);
    expect(ruleOf(".rel-disc circle")).toMatch(/fill:\s*var\(--dk-night\)/);
    // Austin's lines thin as they fade: from 3 px to 2 px at the end.
    expect(ruleOf(".rel-tie")).toMatch(/stroke-width:\s*calc\(3px - 1px \* var\(--thin, 0\)\)/);
    // Slide 33's table keeps a 3 px edge as it shrinks: the edge's stroke grows as the table's scale (--s) falls.
    expect(ruleOf(".rel-table-edge")).toMatch(/stroke-width:\s*calc\(3px \/ var\(--s, 1\)\)/);
    expect(markup).toContain(`class="rel-hue-line rel-table-edge dk-draw"`);
    for (const ready of READY) expect(markup).toContain(`class="rel-hue-line rel-tie dk-draw" data-build="${ready.tie.key}"`);
  });
});
