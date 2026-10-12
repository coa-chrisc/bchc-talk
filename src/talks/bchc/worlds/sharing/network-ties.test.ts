/** Slide 27's second click (layout-network-ties.ts): the vendor squares and the lines out to them, each line pulled in through its circle to the middle, and the tool Austin makes and its three copies. */
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { gsap } from "gsap";
import { describe, expect, it } from "vitest";
import { EASE, TILE, type Box, type Point } from "@/components/deck/kit";
import { shown } from "../../script/find";
import { storyId } from "../steps";
import { SAFE, SAFE_BOTTOM, contentTop } from "./layout";
import { ANGLES, CENTRE_R, DEPT_R, JOINED, NETWORK, SHOWN_TILES } from "./layout-network";
import { DOLLAR, LINKS, MONEY_CLEAR, MONEY_STOP, SQUARE, TOOL, WEIGHT, dollarMeets, fromDollar } from "./layout-network-ties";
import { at, between, cornersOf, endOf, ends, fromPath, fromSegment, inTurned, labelsMeet, markup, overlaps, piecesOf, playOf, playsAt, startOf, tagOf, texts } from "./harness";
import { POST } from "./beats";
import { MONEY, pullingIn, reached } from "./steps-network";

const N = NETWORK;
const L = LINKS;
const C = N.centre.at;
const STEP = "network.outside";
const TOP = contentTop("network") + 32;
const [VENDORS, BEFORE, NOW] = shown("network", "outside").slice(JOINED.all - JOINED.join);
const named = (text: string) => N.names.findIndex((name) => name.text === text);

const gap = (p: Point, q: Point) => Math.hypot(p.x - q.x, p.y - q.y);
/** How far a point is from a box (0 inside it). */
const fromBox = (p: Point, b: Box) => Math.hypot(Math.max(b.x - p.x, 0, p.x - b.x - b.w), Math.max(b.y - p.y, 0, p.y - b.y - b.h));
/** How far a point is from a label turned along a line (0 inside it). */
const fromTurned = (p: Point, label: { at: Box; angle: number }) => {
  const c = { x: label.at.x + label.at.w / 2, y: label.at.y + label.at.h / 2 };
  const a = (-label.angle * Math.PI) / 180;
  const x = (p.x - c.x) * Math.cos(a) - (p.y - c.y) * Math.sin(a);
  const y = (p.x - c.x) * Math.sin(a) + (p.y - c.y) * Math.cos(a);
  return Math.hypot(Math.max(Math.abs(x) - label.at.w / 2, 0), Math.max(Math.abs(y) - label.at.h / 2, 0));
};
const grown = (b: Box, m: number): Box => ({ x: b.x - m, y: b.y - m, w: b.w + 2 * m, h: b.h + 2 * m });
const inSafe = (p: Point) => p.x >= SAFE.left && p.x <= SAFE.right && p.y >= TOP && p.y <= SAFE_BOTTOM;
const tileBox = (centre: Point, side: number = TILE.small.side): Box => ({ x: centre.x - side / 2, y: centre.y - side / 2, w: side, h: side });
const HALF_TOOL = Math.hypot(TOOL.side, TOOL.side) / 2;
/** The direction from the middle to a point, in degrees as the screen measures them. */
const bearing = (p: Point) => (Math.atan2(p.y - C.y, p.x - C.x) * 180) / Math.PI;
const apart = (a: number, b: number) => Math.abs(((a - b + 540) % 360) - 180);
const index = (key: string) => markup.indexOf(tagOf(key));
const lengthOf = (points: readonly Point[]) => points.slice(1).reduce((sum, p, n) => sum + gap(p, points[n]), 0);
/** Points every few pixels along a straight run, both ends included. */
const along = (a: Point, b: Point) => Array.from({ length: 41 }, (_, n) => ({ x: a.x + ((b.x - a.x) * n) / 40, y: a.y + ((b.y - a.y) * n) / 40 }));
const clickEnd = (step: string) => Math.max(...playsAt(step).map(ends));
/** A line's two moves in the click: drawn out to its square, then pulled in. */
const linePlays = (key: string) => playOf(STEP, key).sort((a, b) => a.at - b.at);

const outs = L.ties.map((tie) => piecesOf(tie.out.curve));
const ins = L.ties.map((tie) => piecesOf(tie.in.curve));
const monies = L.ties.map((tie) => piecesOf(tie.money.curve));
const css = readFileSync(join(import.meta.dirname, "sharing.css"), "utf8");

describe("27. what the second click adds", () => {
  describe("the vendor squares", () => {
    it("sets one small grey square just outside the ring near each department, inside the safe area", () => {
      expect(L.ties).toHaveLength(12);
      L.ties.forEach((tie, i) => {
        const dept = N.departments[i].at;
        expect(tie.dept).toBe(i);
        expect(tie.square.at.w).toBe(SQUARE);
        expect(tagOf(tie.square.key), tie.square.key).toMatch(/^<rect [^>]*class="sh-vendor"/);
        for (const corner of cornersOf({ at: tie.square.at, angle: 0 })) expect(inSafe(corner), tie.square.key).toBe(true);
        expect(fromBox(C, tie.square.at) - CENTRE_R[2], tie.square.key).toBeGreaterThanOrEqual(150);
        // Near its own circle: the line out to it is short. The four at the oval's two ends go straight out, so no other circle is nearer.
        // The rest have no room straight out, and a dollar sign needs about 140 px from the circle's centre to slide, more than the ring's
        // spacing; their lines join them to their departments.
        expect(lengthOf(outs[i]), tie.square.key).toBeLessThanOrEqual(140);
        const nearest = N.departments.reduce((best, other) => (gap(other.at, tie.square.centre) < gap(best.at, tie.square.centre) ? other : best));
        if (Math.abs(Math.abs(tie.degrees) - 90) === 75) expect(nearest.key, tie.square.key).toBe(N.departments[i].key);
        // The top and foot pair's stand just under the band's gap or over the safe foot, on a line no longer than 90 px.
        if (Math.abs(Math.abs(tie.degrees) - 90) === 15) {
          expect(lengthOf(outs[i]), tie.square.key).toBeLessThanOrEqual(90);
          expect(Math.min(tie.square.at.y - TOP, SAFE_BOTTOM - tie.square.at.y - SQUARE), tie.square.key).toBeLessThanOrEqual(4);
        }
        expect(gap(tie.square.centre, dept), tie.square.key).toBeGreaterThan(DEPT_R + SQUARE);
      });
    });

    it("keeps each square clear of every circle, every name and every other square", () => {
      L.ties.forEach((tie, i) => {
        for (const dept of N.departments) expect(fromBox(dept.at, tie.square.at) - DEPT_R, `${tie.square.key} / ${dept.key}`).toBeGreaterThanOrEqual(12);
        for (const name of N.names) expect(overlaps(grown(tie.square.at, 8), name.at), `${tie.square.key} / ${name.key}`).toBe(false);
        for (const other of L.ties.slice(i + 1)) expect(overlaps(grown(tie.square.at, 12), other.square.at), `${tie.square.key} / ${other.square.key}`).toBe(false);
      });
    });

    it("labels them once, \"Vendors\", level with Los Angeles County's square and left of it, clear of everything", () => {
      expect(L.vendors.text).toBe(VENDORS);
      expect(texts.filter((text) => text === VENDORS)).toHaveLength(1);
      expect(L.vendors.dept).toBe(named("Los Angeles County"));
      const square = L.ties[L.vendors.dept].square;
      expect(L.vendors.at.x + L.vendors.at.w).toBeLessThanOrEqual(square.at.x - 8);
      expect(L.vendors.at.x + L.vendors.at.w).toBeGreaterThanOrEqual(square.at.x - 16);
      expect(Math.abs(L.vendors.at.y + L.vendors.at.h / 2 - square.centre.y)).toBeLessThanOrEqual(1);
      expect(L.vendors.at.x).toBeGreaterThanOrEqual(SAFE.left);
      for (const dept of N.departments) expect(fromBox(dept.at, L.vendors.at) - DEPT_R, dept.key).toBeGreaterThanOrEqual(12);
      for (const tie of L.ties) if (tie !== L.ties[L.vendors.dept]) expect(overlaps(grown(L.vendors.at, 12), tie.square.at), tie.square.key).toBe(false);
      for (const [i, out] of outs.entries()) for (const p of out) expect(fromBox(p, L.vendors.at), L.ties[i].line.key).toBeGreaterThanOrEqual(WEIGHT / 2 + 6);
    });
  });

  describe("the heavy lines", () => {
    it("run out straight from the edge of each circle to its square's centre, and in along its spoke to under the middle", () => {
      L.ties.forEach((tie, i) => {
        const dept = N.departments[i].at;
        expect(Math.abs(gap(tie.out.curve[0], dept) - DEPT_R), tie.line.key).toBeLessThanOrEqual(1);
        expect(gap(tie.out.curve[3], tie.square.centre), tie.line.key).toBeLessThanOrEqual(0.5);
        for (const p of outs[i]) expect(fromSegment(p, tie.out.curve[0], tie.out.curve[3]), tie.line.key).toBeLessThanOrEqual(1);
        for (const p of outs[i]) expect(gap(p, dept), tie.line.key).toBeGreaterThanOrEqual(DEPT_R - 1);
        expect(Math.abs(gap(tie.in.curve[0], dept) - DEPT_R), tie.line.key).toBeLessThanOrEqual(1);
        expect(gap(tie.in.curve[3], C), tie.line.key).toBeLessThan(CENTRE_R[2]);
        expect(gap(tie.in.curve[3], C), tie.line.key).toBeGreaterThan(CENTRE_R[1]);
        for (const p of ins[i]) expect(fromSegment(p, dept, C), tie.line.key).toBeLessThanOrEqual(1);
      });
    });

    it("are one path each: square to circle, through the circle, on in to the middle, with the window's ends where each part meets the next", () => {
      L.ties.forEach((tie) => {
        const [out, inner] = [tie.out.curve, tie.in.curve];
        const { d, window } = tie.line;
        expect(d.startsWith(`M${out[3].x} ${out[3].y}C`), tie.line.key).toBe(true);
        expect(d, tie.line.key).toContain(`${out[0].x} ${out[0].y}L${inner[0].x} ${inner[0].y}C`);
        expect(d.endsWith(`${inner[3].x} ${inner[3].y}`), tie.line.key).toBe(true);
        const [lengthOut, through, lengthIn] = [lengthOf(piecesOf(out)), gap(out[0], inner[0]), lengthOf(piecesOf(inner))];
        const total = lengthOut + through + lengthIn;
        expect(window.out, tie.line.key).toBeCloseTo(lengthOut / total, 3);
        expect(window.through, tie.line.key).toBeCloseTo((lengthOut + through) / total, 3);
        // The piece between runs across the circle, so the circle covers it.
        for (const p of along(out[0], inner[0])) expect(gap(p, N.departments[tie.dept].at), tie.line.key).toBeLessThanOrEqual(DEPT_R + 0.5);
        const tag = tagOf(tie.line.key);
        expect(tag, tie.line.key).toMatch(/class="sh-tie"/);
        const path = markup.slice(markup.indexOf(tag) + tag.length).split("</g>")[0];
        expect(path, tie.line.key).toContain(`d="${d}"`);
        expect(path, tie.line.key).toMatch(/pathLength="1"/);
        expect(path, tie.line.key).toContain(`stroke-width:${WEIGHT}px`);
      });
      // The window along the path: from `--tail` to `--head`, nothing drawn where they meet.
      const rule = css.match(/\.sh-tie path \{([^}]*)\}/)?.[1] ?? "";
      expect(rule).toContain("stroke-dasharray: calc(var(--head, 0) - var(--tail, 0)) 2;");
      expect(rule).toContain("stroke-dashoffset: calc(-1 * var(--tail, 0));");
      expect(rule).toMatch(/stroke-opacity: min\(1, calc\(\(var\(--head, 0\) - var\(--tail, 0\)\) \* \d+\)\)/);
    });

    it("keep clear of the other circles, the middle at its largest, the stage's edges, each other and the other squares", () => {
      L.ties.forEach((tie, i) => {
        for (const p of outs[i]) {
          expect(inSafe({ x: p.x, y: p.y - WEIGHT / 2 }) && inSafe({ x: p.x, y: p.y + WEIGHT / 2 }), tie.line.key).toBe(true);
          expect(gap(p, C), tie.line.key).toBeGreaterThanOrEqual(CENTRE_R[2] + 40);
          N.departments.forEach((dept, j) => {
            if (j !== i) expect(gap(p, dept.at), `${tie.line.key} / ${dept.key}`).toBeGreaterThanOrEqual(DEPT_R + WEIGHT / 2 + 8);
          });
        }
        L.ties.forEach((other, j) => {
          if (j > i) expect(between(outs[i], outs[j]), `${tie.line.key} / ${other.line.key}`).toBeGreaterThanOrEqual(WEIGHT + 14);
          if (j !== i) for (const p of outs[i]) expect(fromBox(p, other.square.at), `${tie.line.key} / ${other.square.key}`).toBeGreaterThanOrEqual(WEIGHT / 2 + 6);
          expect(between(outs[i], ins[j]), `${tie.line.key} / ${other.line.key} in`).toBeGreaterThanOrEqual(WEIGHT + 14);
        });
      });
    });

    it("lie over the faint dashed copies and the spokes, under the squares, the circles and the middle", () => {
      const firstDisc = Math.min(...N.departments.map((dept) => index(dept.key)));
      const firstSpoke = Math.min(...N.departments.map((dept) => index(dept.spoke)));
      const lastSpoke = Math.max(...N.departments.map((dept) => index(dept.spoke)));
      for (const tie of L.ties) {
        expect(index(tie.was.key), tie.was.key).toBeLessThan(firstSpoke);
        expect(index(tie.line.key), tie.line.key).toBeGreaterThan(lastSpoke);
        expect(index(tie.line.key), tie.line.key).toBeLessThan(firstDisc);
        expect(index(tie.square.key), tie.square.key).toBeGreaterThan(index(tie.line.key));
        expect(index(tie.square.key), tie.square.key).toBeLessThan(firstDisc);
        expect(index(tie.line.key), tie.line.key).toBeLessThan(index(N.centre.ringKey));
      }
    });

    it("leave dashed copies at half the weight, dashed 8 on 7, along the lines out", () => {
      for (const [i, tie] of L.ties.entries()) {
        const tag = tagOf(tie.was.key);
        expect(tag, tie.was.key).toMatch(/class="sh-ghost"/);
        const path = markup.slice(markup.indexOf(tag) + tag.length).split("</g>")[0];
        expect(path, tie.was.key).toContain(`stroke-width:${WEIGHT / 2}px`);
        expect(path, tie.was.key).toContain(`d="M${tie.out.curve[0].x} ${tie.out.curve[0].y}C`);
        // It runs along the line out and stops at the square's edge, so none of it shows through the square once that has faded.
        for (const p of piecesOf(tie.was.curve)) expect(fromPath(p, outs[i]), tie.was.key).toBeLessThanOrEqual(1);
        const end = tie.was.curve[3];
        expect(Math.max(Math.abs(end.x - tie.square.centre.x), Math.abs(end.y - tie.square.centre.y)), tie.was.key).toBeGreaterThan(SQUARE / 2 - 0.5);
        expect(Math.max(Math.abs(end.x - tie.square.centre.x), Math.abs(end.y - tie.square.centre.y)), tie.was.key).toBeLessThanOrEqual(SQUARE / 2 + 1);
      }
      expect(css.match(/\.sh-ghost path \{[^}]*stroke-dasharray: ([^;]+);/)?.[1]).toBe("8 7");
    });
  });

  describe("the dollar signs", () => {
    it("slide along each line from 8 px clear of its circle to short of its square's centre, clear of everything else", () => {
      expect(MONEY_CLEAR).toBe(8);
      expect(MONEY_STOP).toBeGreaterThanOrEqual(SQUARE / 2 + 2);
      L.ties.forEach((tie, i) => {
        const dept = N.departments[i].at;
        const glyph = (p: Point): Box => ({ x: p.x - DOLLAR.w / 2, y: p.y - DOLLAR.h / 2, w: DOLLAR.w, h: DOLLAR.h });
        expect(fromDollar(tie.money.curve[0], dept) - DEPT_R, tie.money.key).toBeGreaterThanOrEqual(MONEY_CLEAR - 0.5);
        expect(fromDollar(tie.money.curve[0], dept) - DEPT_R, tie.money.key).toBeLessThanOrEqual(MONEY_CLEAR + 1.5);
        expect(gap(tie.money.curve[3], tie.square.centre), tie.money.key).toBeGreaterThanOrEqual(MONEY_STOP - 0.5);
        expect(gap(tie.money.curve[3], tie.square.centre), tie.money.key).toBeLessThanOrEqual(MONEY_STOP + 1.5);
        // Far enough to be seen sliding.
        expect(lengthOf(monies[i]), tie.money.key).toBeGreaterThanOrEqual(40);
        for (const p of monies[i]) {
          expect(fromPath(p, outs[i]), tie.money.key).toBeLessThanOrEqual(1);
          for (const corner of cornersOf({ at: glyph(p), angle: 0 })) expect(inSafe(corner), tie.money.key).toBe(true);
          N.departments.forEach((other, j) => {
            if (j !== i) expect(fromDollar(p, other.at) - DEPT_R, `${tie.money.key} / ${other.key}`).toBeGreaterThanOrEqual(4);
          });
          L.ties.forEach((other, j) => {
            if (j !== i) expect(overlaps(grown(glyph(p), 4), other.square.at), `${tie.money.key} / ${other.square.key}`).toBe(false);
          });
          expect(overlaps(grown(glyph(p), 4), L.vendors.at), tie.money.key).toBe(false);
        }
        // Where its box first meets the square.
        const meets = monies[i].findIndex((p) => dollarMeets(p, tie.square.centre));
        const touch = meets < 0 ? 1 : lengthOf(monies[i].slice(0, meets + 1)) / lengthOf(monies[i]);
        expect(tie.money.touch, tie.money.key).toBeCloseTo(touch, 2);
        expect(index(tie.money.key), tie.money.key).toBeGreaterThan(index(tie.square.key));
      });
    });

    it("ride for a second on power1.inOut once their line is out, and have faded before they touch the square", () => {
      expect(MONEY).toMatchObject({ ride: 1.0, ease: "power1.inOut" });
      const ease = gsap.parseEase(MONEY.ease);
      for (const p of [0.1, 0.3, 0.5, 0.7, 0.95]) expect(ease(reached(p))).toBeCloseTo(p, 6);
      L.ties.forEach((tie, i) => {
        const [drawn] = linePlays(tie.line.key);
        const ride = playOf(STEP, tie.money.key).find((play) => "along" in play.on)!;
        const shows = playOf(STEP, tie.money.key).find((play) => play.on.autoAlpha === 1)!;
        const gone = playOf(STEP, tie.money.key).find((play) => play.on.autoAlpha === 0)!;
        expect(ride.at, tie.money.key).toBeCloseTo(drawn.at + drawn.duration, 5);
        expect(ride.duration, tie.money.key).toBe(MONEY.ride);
        expect(ride.ease, tie.money.key).toBe(MONEY.ease);
        expect(gone.at, tie.money.key).toBeGreaterThanOrEqual(shows.at + shows.duration - 1e-9);
        const faded = gone.at + gone.duration;
        expect(faded, tie.money.key).toBeLessThanOrEqual(ride.at + ride.duration);
        // Where the sign is as it finishes fading: not yet at the square, which it would meet `touch` of the way along.
        const covered = ease((faded - ride.at) / ride.duration);
        expect(covered, tie.money.key).toBeLessThanOrEqual(tie.money.touch + 1e-3);
        const length = lengthOf(monies[i]);
        const before = monies[i].findLast((p, n) => lengthOf(monies[i].slice(0, n + 1)) <= (covered - 0.005) * length)!;
        expect(dollarMeets(before, tie.square.centre), tie.money.key).toBe(false);
        expect(at(STEP)[tie.money.key].autoAlpha, tie.money.key).toBe(0);
      });
    });
  });

  describe("the first beat", () => {
    it("draws each line out from its circle in the order the departments join, after its circle and its square start", () => {
      let last = -1;
      L.ties.forEach((tie, i) => {
        const [drawn] = linePlays(tie.line.key);
        const { out } = tie.line.window;
        expect(at("network.grow")[tie.line.key], tie.line.key).toEqual({ "--tail": out, "--head": out });
        expect(drawn.on, tie.line.key).toEqual({ "--tail": 0, "--head": out });
        expect(drawn.ease, tie.line.key).toBe(EASE.draw);
        expect(drawn.at, tie.line.key).toBeGreaterThan(last);
        last = drawn.at;
        if (i >= JOINED.join) expect(drawn.at, tie.line.key).toBeGreaterThanOrEqual(startOf(STEP, N.departments[i].key));
        expect(startOf(STEP, tie.square.key), tie.square.key).toBeLessThanOrEqual(drawn.at);
      });
      expect(startOf(STEP, L.vendors.key)).toBeLessThan(linePlays(L.ties[0].line.key)[0].at + 0.5);
    });
  });

  describe("the second beat", () => {
    const pulls = L.ties.map((tie) => linePlays(tie.line.key)[1]);
    const austin = pulls[0];

    it("pulls each line in through its circle in one move: the window slides from the line out on to the line in", () => {
      L.ties.forEach((tie, i) => {
        const { through } = tie.line.window;
        expect(linePlays(tie.line.key), tie.line.key).toHaveLength(2);
        expect(pulls[i].on, tie.line.key).toEqual({ "--tail": through, "--head": 1 });
        expect(pulls[i].duration, tie.line.key).toBe(0.9);
        expect(pulls[i].ease, tie.line.key).toBe(EASE.draw);
        expect(at(STEP)[tie.line.key], tie.line.key).toEqual({ "--tail": through, "--head": 1 });
        // It leaves its dashed copy as it goes, and its square fades to a ghost just after.
        expect(startOf(STEP, tie.was.key), tie.was.key).toBeCloseTo(pulls[i].at, 5);
        expect(playOf(STEP, tie.square.key).at(-1)!.at - pulls[i].at, tie.square.key).toBeCloseTo(0.1, 5);
        expect(at(STEP)[tie.was.key].autoAlpha, tie.was.key).toBe(1);
        expect(at(STEP)[tie.square.key].autoAlpha, tie.square.key).toBe(0.25);
        expect(at("network.grow")[tie.was.key].autoAlpha, tie.was.key).toBe(0);
      });
    });

    it("starts with Austin's alone, half a second after the first beat lands, then the rest clockwise 0.15 s apart, ending at Los Angeles County", () => {
      const before = Math.max(...playsAt(STEP).filter((play) => play.at < austin.at).map(ends));
      expect(austin.at - before).toBeCloseTo(0.5, 5);
      expect(pullingIn[0]).toBe(0);
      const order = L.ties.map((tie) => tie.dept).sort((a, b) => pulls[a].at - pulls[b].at);
      expect(order[0]).toBe(0);
      expect(order.at(-1)).toBe(named("Los Angeles County"));
      const round = order.map((dept) => (((ANGLES[dept] - ANGLES[0]) % 360) + 360) % 360);
      expect(round).toEqual([...round].sort((a, b) => a - b));
      order.forEach((dept, k) => {
        if (k > 0) expect(pulls[dept].at - pulls[order[k - 1]].at, N.names[dept].text).toBeCloseTo(k === 1 ? 0.9 : 0.15, 5);
      });
      // Austin's is in before any other starts.
      expect(pulls[order[1]].at).toBeGreaterThanOrEqual(austin.at + austin.duration - 1e-9);
    });

    it("brings story line B up a second into the beat, once Austin's line is in", () => {
      const b = `${storyId("network")}.b`;
      expect(startOf(STEP, b) - austin.at).toBeCloseTo(1.0, 5);
      expect(startOf(STEP, b)).toBeGreaterThanOrEqual(austin.at + austin.duration);
      expect(at("network.grow")[b].yPercent).not.toBe(0);
      expect(at(STEP)[b].yPercent).toBe(0);
    });

    it("dims \"Vendors\" with Los Angeles County's square, to the squares' ghost", () => {
      const square = L.ties[L.vendors.dept].square.key;
      const dims = playOf(STEP, L.vendors.key).at(-1)!;
      expect(dims.on.autoAlpha).toBe(0.25);
      expect(dims.at).toBeCloseTo(playOf(STEP, square).at(-1)!.at, 5);
      expect(at(STEP)[L.vendors.key].autoAlpha).toBe(at(STEP)[square].autoAlpha);
    });
  });

  describe("\"Before\" and \"Now\"", () => {
    const labels = [L.before, L.now];
    const austin = 0;

    it("sit under Austin's two lines, \"Before\" under its dashed copy and \"Now\" under its line in", () => {
      expect([L.before.text, L.now.text]).toEqual([BEFORE, NOW]);
      expect(N.names[L.before.dept].text).toBe("Austin");
      expect([L.before.dept, L.now.dept]).toEqual([austin, austin]);
      for (const [label, line] of [
        [L.before, outs[austin]],
        [L.now, ins[austin]],
      ] as const) {
        const centre = { x: label.at.x + label.at.w / 2, y: label.at.y + label.at.h / 2 };
        expect(fromPath(centre, line), label.key).toBeGreaterThanOrEqual(WEIGHT / 2 + label.at.h / 2);
        expect(fromPath(centre, line), label.key).toBeLessThanOrEqual(WEIGHT / 2 + label.at.h / 2 + 12);
        // Under it: lower on the stage than the nearest point of the line.
        const nearest = line.reduce((best, p) => (gap(p, centre) < gap(best, centre) ? p : best));
        expect(centre.y, label.key).toBeGreaterThan(nearest.y);
        expect(Math.abs(label.angle), label.key).toBeLessThan(45);
      }
      expect(L.before.at.x).toBeLessThan(L.now.at.x);
    });

    it("keep clear of every circle, name, square, line, sign, label and the tool's way in, inside the safe area", () => {
      const toolWay = along(L.tool.start, L.tool.origin);
      for (const label of labels) {
        for (const corner of cornersOf(label)) expect(inSafe(corner), label.key).toBe(true);
        expect(fromTurned(C, label) - CENTRE_R[2], label.key).toBeGreaterThanOrEqual(8);
        for (const dept of N.departments) expect(fromTurned(dept.at, label) - DEPT_R, `${label.key} / ${dept.key}`).toBeGreaterThanOrEqual(4);
        for (const name of N.names) expect(labelsMeet({ at: name.at, angle: 0 }, label, 4), `${label.key} / ${name.key}`).toBe(false);
        for (const tie of L.ties) expect(labelsMeet({ at: tie.square.at, angle: 0 }, label, 6), `${label.key} / ${tie.square.key}`).toBe(false);
        for (const line of [...outs, ...ins]) for (const p of line) expect(fromTurned(p, label), label.key).toBeGreaterThanOrEqual(WEIGHT / 2 + 4);
        expect(labelsMeet({ at: L.vendors.at, angle: 0 }, label, 8), label.key).toBe(false);
        for (const p of toolWay) expect(labelsMeet({ at: tileBox(p, TOOL.side), angle: 0 }, label, 3), `${label.key} / tool`).toBe(false);
        for (const copy of L.copies) for (const p of along(copy.start, copy.dock)) expect(labelsMeet({ at: tileBox(p, TOOL.side), angle: 0 }, label, 3), `${label.key} / ${copy.key}`).toBe(false);
      }
      expect(labelsMeet(L.before, L.now, 8)).toBe(false);
      expect(inTurned(C, L.now, 0)).toBe(false);
    });

    it("rise once Austin's dashed copy and line in are there", () => {
      const pull = linePlays(L.ties[austin].line.key)[1];
      expect(startOf(STEP, L.before.key)).toBeGreaterThanOrEqual(endOf(STEP, L.ties[austin].was.key) - 1e-9);
      expect(startOf(STEP, L.now.key)).toBeGreaterThanOrEqual(pull.at + pull.duration - 1e-9);
      expect(startOf(STEP, L.now.key)).toBeGreaterThan(startOf(STEP, L.before.key));
      // Every dollar sign is gone by then: Austin's slid where "Before" stands.
      for (const tie of L.ties) expect(startOf(STEP, L.before.key), tie.money.key).toBeGreaterThanOrEqual(endOf(STEP, tie.money.key));
      for (const label of labels) expect(at(STEP)[label.key].autoAlpha, label.key).toBe(1);
      expect(at("network.grow")[L.before.key].autoAlpha).toBe(0);
    });
  });

  describe("the tool and its copies", () => {
    const toolTile = N.tiles.find((tile) => tile.key === L.tool.tile)!;
    const austin = N.departments[0].at;
    const move = playOf(STEP, L.tool.key)[0];
    const filled = playOf(STEP, L.tool.tile)[0];
    const segment = (key: string) => after(key).split("data-build=")[0];
    const after = (key: string) => markup.slice(markup.indexOf(tagOf(key)) + tagOf(key).length);

    it("is a tile one step larger than the middle's, in the catalog's colour, and its copies carry the dashed corner of an adapted tool", () => {
      expect(TOOL.side).toBeGreaterThan(TILE.small.side);
      expect(tagOf(L.tool.tile)).toMatch(/class="dk-tile"[^>]*data-hue="catalog"|data-hue="catalog"[^>]*class="dk-tile"/);
      expect(segment(L.tool.tile)).toContain(`width="${TOOL.side}" height="${TOOL.side}"`);
      for (const copy of L.copies) {
        const own = segment(copy.key);
        expect(own, copy.key).toMatch(/class="dk-tile" data-hue="catalog"/);
        expect(own, copy.key).toContain(`width="${TOOL.side}" height="${TOOL.side}"`);
        expect(own, copy.key).toMatch(/class="sh-corner"/);
        expect(own, copy.key).toContain(`M${copy.at.x + TOOL.side - TOOL.corner} ${copy.at.y}V${copy.at.y + TOOL.corner}H${copy.at.x + TOOL.side}`);
      }
    });

    it("fills inside Austin's circle, clear of its name, and lands on its place in the middle's outer ring", () => {
      for (const corner of cornersOf({ at: tileBox(L.tool.start, TOOL.side), angle: 0 })) expect(gap(corner, austin)).toBeLessThanOrEqual(DEPT_R - 1.5);
      expect(overlaps(grown(tileBox(L.tool.start, TOOL.side), 4), N.names[0].at)).toBe(false);
      expect(fromSegment(L.tool.start, austin, C)).toBeLessThanOrEqual(1);
      expect(toolTile.stage).toBe(2);
      expect(N.tiles.indexOf(toolTile)).toBeGreaterThanOrEqual(SHOWN_TILES.join);
      expect(L.tool.origin).toEqual({ x: toolTile.at.x + TILE.small.side / 2, y: toolTile.at.y + TILE.small.side / 2 });
      expect(L.tool.at).toEqual({ x: L.tool.origin.x - TOOL.side / 2, y: L.tool.origin.y - TOOL.side / 2 });
      expect(apart(bearing(L.tool.origin), bearing(austin))).toBeLessThan(20);
      expect(L.tool.origin.x + L.tool.from["--x"]).toBeCloseTo(L.tool.start.x, 5);
      expect(L.tool.origin.y + L.tool.from["--y"]).toBeCloseTo(L.tool.start.y, 5);
      expect(gap(L.tool.origin, C) + HALF_TOOL).toBeLessThanOrEqual(CENTRE_R[2] - 1.5);
      for (const tile of N.tiles) if (tile !== toolTile) expect(overlaps(grown(tileBox(L.tool.origin, TOOL.side), 2), tileBox({ x: tile.at.x + TILE.small.side / 2, y: tile.at.y + TILE.small.side / 2 })), tile.key).toBe(false);
      for (const [i, dept] of N.departments.entries()) if (i > 0) expect(fromSegment(dept.at, L.tool.start, L.tool.origin) - HALF_TOOL, dept.key).toBeGreaterThanOrEqual(DEPT_R + 8);
      expect(at("network.grow")[L.tool.key]).toMatchObject(L.tool.from);
      expect(at(STEP)[L.tool.key]).toMatchObject({ "--x": 0, "--y": 0 });
    });

    it("fills once the lines are in, travels 0.6 s after it has filled, and the middle does not grow again", () => {
      expect(filled.at).toBeGreaterThanOrEqual(Math.max(...L.ties.map((tie) => endOf(STEP, tie.line.key))));
      expect(move.at - (filled.at + filled.duration)).toBeCloseTo(0.6, 5);
      expect(move).toMatchObject({ duration: POST.duration, ease: POST.ease });
      // The middle grows and its five other new tiles fill in the first beat, before any line is pulled in.
      const grows = playOf(STEP, N.centre.key);
      expect(grows).toHaveLength(1);
      expect(grows[0].on["--s"]).toBe(CENTRE_R[2] / CENTRE_R[0]);
      const firstPull = Math.min(...L.ties.map((tie) => linePlays(tie.line.key)[1].at));
      expect(ends(grows[0])).toBeLessThan(firstPull);
      const others = N.tiles.slice(SHOWN_TILES.join).filter((tile) => tile !== toolTile);
      expect(others).toHaveLength(5);
      for (const tile of others) expect(endOf(STEP, tile.key), tile.key).toBeLessThan(firstPull);
    });

    it("sends three copies to Chicago, Boston and Houston, spread round the ring away from Austin and from each other", () => {
      expect(L.copies.map((copy) => N.names[copy.dept].text)).toEqual(["Chicago", "Boston", "Houston"]);
      const bearings = [austin, ...L.copies.map((copy) => N.departments[copy.dept].at)].map(bearing);
      bearings.forEach((a, i) => {
        for (const b of bearings.slice(i + 1)) expect(apart(a, b)).toBeGreaterThanOrEqual(50);
      });
    });

    it("settles each inside its department's circle under the name, clear of every name and other circle", () => {
      for (const copy of L.copies) {
        const dept = N.departments[copy.dept].at;
        const name = N.names[copy.dept].at;
        const docked = tileBox(copy.dock, TOOL.side);
        expect(copy.at).toEqual({ x: docked.x, y: docked.y });
        // Inside the circle's edge, its corner's cut too.
        for (const corner of [...cornersOf({ at: docked, angle: 0 }), { x: docked.x + docked.w + 2, y: docked.y - 2 }]) expect(gap(corner, dept), copy.key).toBeLessThanOrEqual(DEPT_R - 1.5);
        expect(docked.y, copy.key).toBeGreaterThanOrEqual(name.y + name.h + 4);
        expect(Math.abs(copy.dock.x - (name.x + name.w / 2)), copy.key).toBeLessThanOrEqual(1);
        for (const other of N.names) expect(overlaps(grown(docked, 4), other.at), `${copy.key} / ${other.key}`).toBe(false);
      }
    });

    it("carries each from inside the middle at its largest, clear of its tiles and of the other circles, after the tool lands", () => {
      for (const copy of L.copies) {
        expect(gap(copy.start, C) + HALF_TOOL, copy.key).toBeLessThanOrEqual(CENTRE_R[2] - 1.5);
        for (const tile of N.tiles) {
          const placed = tile === toolTile ? tileBox(L.tool.origin, TOOL.side) : tileBox({ x: tile.at.x + TILE.small.side / 2, y: tile.at.y + TILE.small.side / 2 });
          expect(overlaps(grown(tileBox(copy.start, TOOL.side), 2), placed), `${copy.key} / ${tile.key}`).toBe(false);
        }
        expect(copy.dock.x + copy.from["--x"], copy.key).toBeCloseTo(copy.start.x, 5);
        expect(copy.dock.y + copy.from["--y"], copy.key).toBeCloseTo(copy.start.y, 5);
        for (const [j, dept] of N.departments.entries()) if (j !== copy.dept) expect(fromSegment(dept.at, copy.start, copy.dock) - HALF_TOOL, `${copy.key} / ${dept.key}`).toBeGreaterThanOrEqual(DEPT_R + 8);
        expect(at("network.grow")[copy.key].autoAlpha).toBe(0);
        expect(at(STEP)[copy.key]).toMatchObject({ autoAlpha: 1, "--x": 0, "--y": 0 });
        expect(startOf(STEP, copy.key)).toBeGreaterThanOrEqual(move.at + move.duration - 1e-9);
        expect(index(copy.key)).toBeGreaterThan(Math.max(...N.tiles.map((tile) => index(tile.key))));
      }
      const starts = L.copies.map((copy) => startOf(STEP, copy.key));
      expect(starts[0]).toBeCloseTo(move.at + move.duration, 5);
      expect(starts[1] - starts[0]).toBeCloseTo(0.15, 5);
      expect(starts[2] - starts[1]).toBeCloseTo(0.15, 5);
    });
  });

  it("plays each click in under twelve seconds", () => {
    expect(clickEnd("network.grow")).toBeLessThan(12);
    expect(clickEnd(STEP)).toBeLessThan(12);
    expect(clickEnd(STEP)).toBeGreaterThan(9);
  });
});
