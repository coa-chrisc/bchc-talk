/** Slide 27, the more we share, the more we can do: the talk's only network, and the end of Part 4. Its ring and its middle; what its second click adds outside them is in network-ties.test.ts. */
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { shown } from "../../script/find";
import { PICTURES, SAFE, SAFE_BOTTOM, contentTop } from "./layout";
import { CENTRE_R, DEPT_R, JOINED, NAME, NETWORK, SHOWN_TILES, fitsCircle } from "./layout-network";
import { after, at, cornersOf, endOf, markup, overlaps, playOf, ringBox, startOf, tagOf } from "./harness";

const N = NETWORK;
/** Austin and five more join on the first click; the second click's list starts with the other six. */
const NAMES = [...shown("network", "grow"), ...shown("network", "outside").slice(0, JOINED.all - JOINED.join)];
const C = N.centre.at;

describe("27. the more we share, the more we can do", () => {
  it("closes Part 4, two clicks", () => {
    expect(PICTURES.at(-1)!.id).toBe("network");
    expect(PICTURES.at(-1)!.steps.map((step) => step.id)).toEqual(["grow", "outside"]);
  });

  it("draws twelve departments as the same navy circle round the shared middle, Austin at the left", () => {
    expect(N.departments).toHaveLength(12);
    for (const dept of N.departments) expect(dept.r).toBe(DEPT_R);
    for (const dept of N.departments) {
      // Well clear of the story band's second line at every size: the top circle a line's gap under the band.
      expect(dept.at.y - dept.r).toBeGreaterThanOrEqual(contentTop("network") + 32);
      expect(dept.at.y + dept.r).toBeLessThanOrEqual(SAFE_BOTTOM);
    }
    // Neighbours keep a gap between them, and the middle at its largest keeps clear of every circle.
    N.departments.forEach((dept, i) => {
      for (const other of N.departments.slice(i + 1)) expect(Math.hypot(dept.at.x - other.at.x, dept.at.y - other.at.y), `${i} / ${other.key}`).toBeGreaterThanOrEqual(2 * DEPT_R + 16);
      expect(Math.hypot(dept.at.x - C.x, dept.at.y - C.y) - DEPT_R - CENTRE_R[2], dept.key).toBeGreaterThanOrEqual(12);
    });
    // Austin keeps its place half a step above the oval's left end, nothing further left; Los Angeles County stands straight under it.
    const austin = N.departments[0].at;
    const la = N.departments[NAMES.indexOf("Los Angeles County")].at;
    expect(austin.x).toBeLessThan(C.x);
    expect(austin.y).toBeLessThan(C.y);
    expect(Math.min(...N.departments.map((dept) => dept.at.x))).toBe(austin.x);
    expect(la.x).toBe(austin.x);
    expect(la.y - C.y).toBeCloseTo(C.y - austin.y, 0);
  });

  it("names every department inside its circle, in the order they join: Austin first", () => {
    expect(N.names.map((name) => name.text)).toEqual(NAMES);
    expect(NAMES).toHaveLength(N.departments.length);
    expect(shown("network", "grow")).toEqual(["Austin", "Los Angeles County", "Chicago", "Houston", "New York City", "Denver"]);
    expect(NAMES.slice(JOINED.join)).toEqual(["Detroit", "Philadelphia", "Dallas County", "Boston", "Washington, D.C.", "San Antonio"]);
    for (const [i, name] of N.names.entries()) {
      expect(name.centre, name.key).toEqual(N.departments[i].at);
      expect(name.rows.join(" "), name.key).toBe(name.text);
      // One row where it fits, two where it does not.
      expect(name.rows.length, name.key).toBe(fitsCircle([name.text]) ? 1 : 2);
      expect(fitsCircle(name.rows), name.key).toBe(true);
      // Each row is set once on the stage, in the name's own group, in the name type.
      const group = after(name.key).split("</g>")[0];
      expect(tagOf(name.key)).toMatch(/^<g /);
      expect([...group.matchAll(/<tspan[^>]*>([^<]*)<\/tspan>/g)].map((match) => match[1].replace(/&#x27;/g, "'"))).toEqual(name.rows);
      expect(group).toMatch(/class="dk-label sh-word sh-name"/);
    }
    // Two rows where the coalition's longer names need them.
    expect(N.names.find((name) => name.text === "Los Angeles County")!.rows).toEqual(["Los Angeles", "County"]);
    expect(N.names.find((name) => name.text === "Washington, D.C.")!.rows).toEqual(["Washington,", "D.C."]);
    expect(N.names.find((name) => name.text === "Philadelphia")!.rows).toEqual(["Philadelphia"]);
    const css = readFileSync(join(import.meta.dirname, "sharing.css"), "utf8");
    expect(NAME.size).toBe(19);
    expect(css.match(/\.dk-label\.sh-name \{[^}]*font-size: (\d+)px/)?.[1]).toBe(String(NAME.size));
    // Each name comes after every circle in the markup, so no circle's ground covers it.
    const lastDisc = Math.max(...N.departments.map((dept) => markup.indexOf(tagOf(dept.key))));
    for (const name of N.names) expect(markup.indexOf(tagOf(name.key)), name.key).toBeGreaterThan(lastDisc);
  });

  it("sets the departments roughly as on a map: west to east along the top and the foot, north to south down the right end", () => {
    const row = (upper: boolean) =>
      N.names
        .filter((name) => name.centre.y < C.y === upper)
        .sort((a, b) => a.centre.x - b.centre.x)
        .map((name) => name.text);
    expect(row(true)).toEqual(["Austin", "Dallas County", "Denver", "Chicago", "Detroit", "Boston"]);
    expect(row(false)).toEqual(["Los Angeles County", "San Antonio", "Houston", "Washington, D.C.", "Philadelphia", "New York City"]);
    const right = N.names.filter((name) => name.centre.x > C.x + 300).sort((a, b) => a.centre.y - b.centre.y);
    expect(right.map((name) => name.text)).toEqual(["Boston", "New York City"]);
  });

  it("keeps every name inside its own circle, clear of the other names, the other circles and the safe edges", () => {
    for (const [i, name] of N.names.entries()) {
      const dept = N.departments[i];
      // Inside its circle's edge: every corner of the name's box.
      for (const corner of cornersOf({ at: name.at, angle: 0 })) expect(Math.hypot(corner.x - dept.at.x, corner.y - dept.at.y), name.key).toBeLessThanOrEqual(DEPT_R - 1.5);
      for (const other of N.names.slice(i + 1)) expect(overlaps(name.at, other.at), `${name.key} / ${other.key}`).toBe(false);
      N.departments.forEach((otherDept, j) => {
        if (j !== i) expect(overlaps(name.at, ringBox(otherDept.at, otherDept.r)), `${name.key} / ${otherDept.key}`).toBe(false);
      });
      expect(name.at.x).toBeGreaterThanOrEqual(SAFE.left);
      expect(name.at.x + name.at.w).toBeLessThanOrEqual(SAFE.right);
      expect(name.at.y).toBeGreaterThanOrEqual(contentTop("network") + 32);
      expect(name.at.y + name.at.h).toBeLessThanOrEqual(SAFE_BOTTOM);
    }
  });

  it("brings each name up inside its circle as the circle draws on", () => {
    for (const [i, name] of N.names.entries()) {
      const dept = N.departments[i].key;
      const step = i < JOINED.join ? "network.grow" : "network.outside";
      expect(at("network.grow")[name.key].autoAlpha, name.key).toBe(i < JOINED.join ? 1 : 0);
      expect(at("network.outside")[name.key].autoAlpha, name.key).toBe(1);
      expect(at("network.outside")[name.key].y, name.key).toBe(0);
      expect(playOf(step, name.key), name.key).toHaveLength(1);
      // From 0.1 s after its circle starts, landing as the circle closes.
      expect(startOf(step, name.key) - startOf(step, dept), name.key).toBeCloseTo(0.1, 5);
      expect(endOf(step, name.key), name.key).toBeLessThanOrEqual(endOf(step, dept) + 1e-9);
    }
  });

  it("joins Austin and five more in the first click, the other six in the second, the middle growing each time", () => {
    const grow = at("network.grow");
    const end = at("network.outside");
    N.departments.forEach((dept, i) => {
      expect(grow[dept.key]["--d"], dept.key).toBe(i < JOINED.join ? 1 : 0);
      expect(end[dept.key]["--d"], dept.key).toBe(1);
      expect(end[dept.spoke]["--d"], dept.spoke).toBe(1);
    });
    expect(CENTRE_R).toEqual([60, 90, 110]);
    expect(grow[N.centre.key]["--s"]).toBe(CENTRE_R[1] / CENTRE_R[0]);
    expect(end[N.centre.key]["--s"]).toBe(CENTRE_R[2] / CENTRE_R[0]);
    N.tiles.forEach((tile, k) => {
      expect(grow[tile.key]["--k"], tile.key).toBe(k < SHOWN_TILES.join ? 1 : 0);
      expect(end[tile.key]["--k"], tile.key).toBe(1);
    });
    expect(N.tiles).toHaveLength(SHOWN_TILES.all);
  });
});
