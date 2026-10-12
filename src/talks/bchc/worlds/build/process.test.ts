/**
 * Slide 22b, the whole process: the ring the year gives way to, its seven
 * steps and two marks, and your department with its three products inside
 * it. The build world's last picture.
 */
import { describe, expect, it } from "vitest";
import { HOLD } from "@/components/deck/kit";
import { shown } from "../../script/find";
import { FIELD, TITLES, titleKey, topOf } from "./layout";
import { DEPARTMENT, MARKS, PROCESS_KEYS, PRODUCTS as SETTLED, RING, STEPS as RING_STEPS } from "./layout-process";
import { PRODUCTS, YEAR_KEYS } from "./layout-year";
import { compiled, end, landed, last, markup, on, start, storyKey, visible } from "./probe";
import { DRAW } from "./steps-process";

describe("22b", () => {
  const P = "process.play";
  const ringPlays = () => on(P, RING.key);
  const storyAt = (n: number) => on(P, storyKey("process", n)).find((play) => play.on.yPercent === 0)!;
  type Area = { x: number; y: number; w: number; h: number };
  const overlaps = (a: Area, b: Area) => a.x < b.x + b.w && b.x < a.x + a.w && a.y < b.y + b.h && b.y < a.y + a.h;
  /** Inside the ring's ellipse, `margin` px in from it along each axis. */
  const insideRing = (x: number, y: number, margin: number) => ((x - RING.c.x) / (RING.r.x - margin)) ** 2 + ((y - RING.c.y) / (RING.r.y - margin)) ** 2 < 1;

  it("22b: takes the year and 22a's story lines away at once, as the title changes", () => {
    for (const key of [...YEAR_KEYS, storyKey("scale", 0), storyKey("scale", 1)]) {
      expect(start(on(P, key)), key).toBe(0);
      expect(visible(last[key]), key).toBe(false);
    }
    expect(visible(last[titleKey("scale")])).toBe(false);
    expect(last[titleKey("process")]).toMatchObject({ yPercent: 0 });
    expect(TITLES.find((title) => title.key === titleKey("process"))!.lines).toEqual(["That's the whole process.", "Any department can run it and own what it builds."]);
  });

  it("22b: draws the ring once, clockwise from Describe, each step showing in the script's order as the line reaches it", () => {
    expect(RING_STEPS.map((step) => step.text)).toEqual(shown("process", "play").slice(0, 7));
    expect(RING_STEPS.map((step) => step.text)).toEqual(["Describe", "Plan", "Build", "Check", "Approve", "Release", "Learn"]);
    expect(ringPlays()).toHaveLength(1);
    const [ring] = ringPlays();
    expect(ring.on).toEqual({ "--d": 1 });
    expect(markup).toMatch(new RegExp(`data-build="${RING.key}".*?class="bw-ring dk-draw"[^>]*pathLength="1"`));
    // The line starts on Describe's pill and runs clockwise: both half ellipses sweep the positive way on the stage.
    const describe = RING_STEPS[0].pill;
    const [, mx, my] = RING.d.match(/^M([\d.]+) ([\d.]+)/)!.map(Number);
    expect(mx).toBeCloseTo(describe.x + describe.w / 2, 0);
    expect(my).toBeCloseTo(describe.y + describe.h / 2, 0);
    expect(RING.d.match(/A\S+ \S+ 0 0 1 /g)).toHaveLength(2);
    // Along the ring: Describe at its start, the rest an even seventh apart, all before it closes.
    expect(RING_STEPS.map((step) => step.along)).toEqual([0, 1, 2, 3, 4, 5, 6].map((n) => n / 7));
    // Describe at the left end, Plan, Build and Check over the top left to right, Approve, Release and Learn under it right to left.
    const [describeAt, plan, build, check, approve, release, learn] = RING_STEPS.map((step) => ({ x: step.pill.x + step.pill.w / 2, y: step.pill.y + step.pill.h / 2 }));
    expect(describeAt).toMatchObject({ x: RING.c.x - RING.r.x, y: RING.c.y });
    for (const top of [plan, build, check]) expect(top.y).toBeLessThan(RING.c.y - RING.r.y / 2);
    for (const bottom of [approve, release, learn]) expect(bottom.y).toBeGreaterThan(RING.c.y + RING.r.y / 2);
    expect(plan.x).toBeLessThan(build.x);
    expect(build.x).toBeLessThan(check.x);
    expect(approve.x).toBeGreaterThan(release.x);
    expect(release.x).toBeGreaterThan(learn.x);
    // Each pill shows as the line comes up to it: a moment before the front, drawing at an even pace, reaches its middle, and solid before it does.
    expect(ring.ease).toBe("none");
    const shows = RING_STEPS.map((step) => on(P, step.key));
    for (const plays of shows) expect(plays).toHaveLength(1);
    shows.map(([play]) => play).forEach((play, i) => {
      const reached = ring.at + RING_STEPS[i].along * ring.duration;
      expect(play.at, RING_STEPS[i].text).toBeLessThan(reached);
      expect(play.at, RING_STEPS[i].text).toBeGreaterThanOrEqual(reached - 0.3 - 1e-9);
      expect(landed(play), RING_STEPS[i].text).toBeLessThan(reached);
    });
  });

  it("22b: gives Check the passed tick and Approve the orange person-approves mark, each just after the line passes its step, never on a pill's start", () => {
    expect(RING_STEPS[MARKS.checkStep].text).toBe("Check");
    expect(RING_STEPS[MARKS.approveStep].text).toBe("Approve");
    const [ring] = ringPlays();
    const pillStarts = RING_STEPS.map((step) => start(on(P, step.key)));
    for (const [key, step] of [
      [MARKS.tickKey, MARKS.checkStep],
      [MARKS.approveKey, MARKS.approveStep],
    ] as const) {
      const mark = start(on(P, key));
      const passed = ring.at + RING_STEPS[step].along * ring.duration;
      expect(mark, key).toBeGreaterThan(pillStarts[step]);
      // About a tenth of a second after the front passes the step's middle.
      expect(mark - passed, key).toBeCloseTo(0.1, 5);
      for (const pill of pillStarts) expect(Math.abs(mark - pill), key).toBeGreaterThan(0.05);
    }
    expect(markup).toMatch(new RegExp(`data-build="${MARKS.tickKey}".*?class="bw-tick"`));
    expect(markup).toMatch(new RegExp(`data-build="${MARKS.approveKey}".*?class="bw-approves"`));
    // The mark is the picture's only orange: nothing else it draws carries the approves mark.
    const own = markup.slice(markup.indexOf(`data-build="${RING.key}"`));
    expect(own.match(/class="bw-approves"/g)).toHaveLength(1);
  });

  it("22b: brings line A up while the ring draws, opens your department after the ring closes, settles the three products into it, and brings line B last", () => {
    const [ring] = ringPlays();
    const a = storyAt(0);
    const b = storyAt(1);
    // Line A starts during the draw, on no pill's or mark's start.
    expect(a.at).toBeGreaterThan(ring.at);
    expect(a.at).toBeLessThan(ring.at + ring.duration);
    for (const key of [...RING_STEPS.map((step) => step.key), MARKS.tickKey, MARKS.approveKey]) expect(Math.abs(a.at - start(on(P, key))), key).toBeGreaterThan(0.05);
    const department = start(on(P, DEPARTMENT.key));
    expect(department).toBeCloseTo(ring.at + ring.duration + HOLD.gap, 5);
    expect(DEPARTMENT.text).toBe("Your department");
    expect(SETTLED.map((product) => product.text)).toEqual(shown("process", "play").slice(8));
    expect(SETTLED.map((product) => product.kind)).toEqual(PRODUCTS.map((product) => product.kind));
    const settles = SETTLED.map((product) => start(on(P, product.key)));
    expect([...settles].sort((x, y) => x - y)).toEqual(settles);
    expect(settles[0]).toBeGreaterThan(department);
    // Line B once line A has been up at least 4.5 s, and the stage has been still a moment since the last product settled.
    expect(b.at).toBeGreaterThanOrEqual(landed(a) + 4.5 - 1e-9);
    expect(b.at).toBeGreaterThanOrEqual(Math.max(...SETTLED.map((product) => end(on(P, product.key)))) + 0.6);
    expect(landed(b)).toBeLessThanOrEqual(9);
    expect(end(compiled.plays[compiled.plays.length - 1])).toBe(landed(b));
  });

  it("22b: ends on the ring, your department and its three products in their places, nothing of the year left", () => {
    for (const key of PROCESS_KEYS) expect(visible(last[key]), key).toBe(true);
    expect(last[RING.key]).toMatchObject({ "--d": 1 });
    expect(last[DEPARTMENT.key]).toMatchObject({ "--wt": 0, "--wr": 0, "--wb": 0, "--wl": 0, autoAlpha: 1 });
    for (const product of SETTLED) expect(last[product.key], product.key).toMatchObject({ x: 0, y: 0, autoAlpha: 1 });
    expect(DRAW.at + DRAW.duration).toBeGreaterThan(storyAt(0).at);
  });

  it("22b: keeps the ring under the story band and over the floor, the department inside it and clear of every step", () => {
    const pills = RING_STEPS.map((step) => step.pill);
    for (const pill of pills) {
      expect(pill.y).toBeGreaterThanOrEqual(topOf("process") + 20);
      expect(pill.y + pill.h).toBeLessThanOrEqual(FIELD.floor);
      expect(pill.x).toBeGreaterThanOrEqual(FIELD.left);
      expect(pill.x + pill.w).toBeLessThanOrEqual(FIELD.right);
    }
    expect(pills).toHaveLength(7);
    // Each mark sits on its pill's right-hand corner outside the ring (the top one over the ring's middle, the bottom one under it), clear of the ring's line by its stroke and more, and inside the field.
    const ringPoints = Array.from({ length: 720 }, (_, n) => ({ x: RING.c.x + RING.r.x * Math.cos((n * Math.PI) / 360), y: RING.c.y + RING.r.y * Math.sin((n * Math.PI) / 360) }));
    for (const [mark, r, step] of [
      [MARKS.tick, MARKS.tickR, MARKS.checkStep],
      [MARKS.approve, MARKS.approveR, MARKS.approveStep],
    ] as const) {
      const pill = RING_STEPS[step].pill;
      const under = pill.y + pill.h / 2 > RING.c.y;
      expect(Math.hypot(mark.x - (pill.x + pill.w), mark.y - (under ? pill.y + pill.h : pill.y))).toBeLessThan(r);
      expect(Math.min(...ringPoints.map((p) => Math.hypot(p.x - mark.x, p.y - mark.y)))).toBeGreaterThan(r + RING.stroke / 2 + 12);
      expect(mark.x + r).toBeLessThanOrEqual(FIELD.right);
      expect(mark.y - r).toBeGreaterThanOrEqual(topOf("process"));
      expect(mark.y + r).toBeLessThanOrEqual(FIELD.floor);
    }
    const o = DEPARTMENT.outline;
    // "Your department" at 32 px is about 240 px wide, centred in its 400 px box.
    const label = { x: DEPARTMENT.textAt.x + 80, y: DEPARTMENT.textAt.y, w: DEPARTMENT.textAt.w - 160, h: 38 };
    for (const [x, y] of [
      [o.x, o.y],
      [o.x + o.w, o.y],
      [o.x, o.y + o.h],
      [o.x + o.w, o.y + o.h],
      [label.x, label.y],
      [label.x + label.w, label.y],
    ])
      expect(insideRing(x, y, 24), `${x} ${y}`).toBe(true);
    for (const pill of pills) {
      expect(overlaps(pill, { x: o.x - 32, y: o.y - 32, w: o.w + 64, h: o.h + 64 })).toBe(false);
      expect(overlaps(pill, { x: label.x, y: label.y - 24, w: label.w, h: label.h + 24 })).toBe(false);
    }
    for (const product of SETTLED) {
      expect(product.icon.x).toBeGreaterThan(o.x);
      expect(product.icon.x + product.icon.w).toBeLessThan(o.x + o.w);
      expect(product.icon.y).toBeGreaterThan(o.y + 12);
      expect(product.labelAt.y + 32 + 12).toBeLessThanOrEqual(o.y + o.h);
      expect(product.labelAt.x).toBeGreaterThanOrEqual(o.x);
      expect(product.labelAt.x + product.labelAt.w).toBeLessThanOrEqual(o.x + o.w);
    }
  });
});
