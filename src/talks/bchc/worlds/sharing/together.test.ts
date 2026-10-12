/** Slide 23, share one tool, get them all: the catalog's three empty places, three departments, their tools going up and the adapted copies coming back. */
import { describe, expect, it } from "vitest";
import { AGENT_R, type Box } from "@/components/deck/kit";
import { withBase } from "@/lib/base-path";
import { shown } from "../../script/find";
import { CARD, CATALOG_SLOTS, LABEL_LINE, SAFE, SAFE_BOTTOM, contentTop, quoted } from "./layout";
import { TOGETHER } from "./layout-together";
import { LEAVE, after, at, endOf, ends, inside, markup, overlaps, playOf, playsAt, ringBox, startOf, tagOf, texts } from "./harness";

const id = "together.play";
const T = TOGETHER;
const cardBox = (p: { x: number; y: number }): Box => ({ x: p.x, y: p.y, w: CARD.w, h: CARD.h });
/** Whether the element a part's id is on draws an icon before the next part starts. */
const hasIcon = (key: string) => {
  const rest = after(key);
  const next = rest.indexOf("data-build=");
  return rest.slice(0, next < 0 ? undefined : next).includes('class="sh-icon"');
};

describe("23. share one tool, get them all", () => {
  it("shows the catalog as its card grid cut to three empty places, under the story band, in the catalog's edge", () => {
    expect(T.frame.stills).toEqual([CATALOG_SLOTS]);
    expect(CATALOG_SLOTS.src).toBe(withBase("/catalog-slots.v2.webp"));
    expect(T.frame.at.y).toBeGreaterThanOrEqual(contentTop("together"));
    expect(T.frame.at.x + T.frame.at.w / 2).toBe(960);
    expect(T.slots).toHaveLength(3);
    for (const slot of T.slots) expect(inside(slot, T.frame.at)).toBe(true);
    expect(markup).toMatch(/data-edge="catalog"/);
  });

  it("gives each tool its own icon and name, as the script names them", () => {
    expect(T.tools.map((tool) => tool.name)).toEqual(shown("together", "play").slice(3, 6));
    expect(T.tools.map((tool) => tool.icon)).toEqual(["pin", "chart", "pipes"]);
    for (const key of [...T.departments.map((dept) => dept.own.key), ...T.posts.map((post) => post.key), ...T.copies.map((copy) => copy.key)]) expect(hasIcon(key), key).toBe(true);
    for (const tool of T.tools) expect(texts).toContain(tool.name);
  });

  it("names the three departments under their rings, and names them on no other slide", () => {
    const names = shown("together", "play").slice(0, 3);
    expect(T.departments.map((dept) => dept.name.text)).toEqual(names);
    for (const dept of T.departments) {
      expect(texts.filter((text) => text === dept.name.text), dept.name.text).toHaveLength(1);
      expect(dept.name.at.y).toBeGreaterThan(dept.at.y + dept.r);
      expect(dept.name.at.y + dept.name.at.h).toBeLessThanOrEqual(SAFE_BOTTOM);
      expect(dept.name.at.x).toBeGreaterThanOrEqual(SAFE.left);
      expect(tagOf(dept.agent.key)).toContain('data-role="process"');
    }
  });

  it("keeps every department, its stack and its agents clear of the catalog and its count, and inside the safe area", () => {
    for (const dept of T.departments) {
      for (const well of dept.wells.at) {
        const place = cardBox(well);
        expect(overlaps(place, T.frame.at)).toBe(false);
        expect(overlaps(place, T.count.at)).toBe(false);
        expect(place.x + place.w).toBeLessThanOrEqual(SAFE.right);
        expect(place.y + place.h).toBeLessThanOrEqual(SAFE_BOTTOM);
      }
      expect(overlaps(ringBox(dept.agent.at, AGENT_R), T.count.at)).toBe(false);
      expect(dept.agent.at.y - AGENT_R).toBeGreaterThan(T.count.at.y + T.count.at.h);
    }
    // A copy waiting beside its agents stays on the stage, over its own stack and clear of its agents.
    for (const copy of T.copies) {
      const dept = T.departments[copy.dept];
      const waiting = cardBox({ x: copy.at.x + copy.wait.x, y: copy.at.y + copy.wait.y });
      expect(waiting.x).toBe(dept.own.at.x);
      expect(waiting.x + waiting.w).toBeLessThanOrEqual(SAFE.right);
      expect(waiting.y + waiting.h).toBeLessThanOrEqual(dept.wells.at[0].y);
      expect(overlaps(waiting, ringBox(dept.agent.at, AGENT_R))).toBe(false);
    }
  });

  it("runs every card's way by one lane, under the count and over the desks and agents", () => {
    const lanes = [
      ...T.posts.map((post) => cardBox({ x: post.at.x + post.lane.x, y: post.at.y + post.lane.y })),
      ...T.copies.flatMap((copy) => [copy.out, copy.over].map((leg) => cardBox({ x: copy.at.x + leg.x, y: copy.at.y + leg.y }))),
    ];
    const laneY = lanes[0].y;
    for (const lane of lanes) {
      expect(lane.y).toBe(laneY);
      expect(lane.y).toBeGreaterThan(T.count.at.y + T.count.at.h);
      expect(lane.x).toBeGreaterThanOrEqual(SAFE.left);
      expect(lane.x + lane.w).toBeLessThanOrEqual(SAFE.right);
    }
    for (const dept of T.departments) expect(laneY + CARD.h).toBeLessThan(dept.agent.at.y - AGENT_R);
    for (const copy of T.copies) expect(laneY + CARD.h).toBeLessThan(copy.at.y + copy.wait.y);
    // A copy comes straight down from its tool in the catalog, and goes down to its desk straight from the lane.
    for (const copy of T.copies) {
      expect(copy.out.x).toBe(copy.start.x);
      expect(copy.over.x).toBe(copy.wait.x);
    }
  });

  it("sends each department's own tool up into a place, one after another, where it lands as the catalog's card; the department keeps its own", () => {
    const state = at(id);
    const starts = T.posts.map((post) => startOf(id, post.key));
    starts.slice(1).forEach((start, k) => expect(start).toBeGreaterThan(starts[k]));
    T.posts.forEach((post, k) => {
      expect(inside(cardBox(post.at), T.slots[k])).toBe(true);
      expect({ x: post.at.x + post.travel.x, y: post.at.y + post.travel.y }).toEqual(T.departments[k].own.at);
      expect(state[post.key]).toMatchObject({ x: 0, y: 0, autoAlpha: 1 });
      expect(tagOf(post.key)).toContain("sh-card--listed");
      expect(state[T.departments[k].own.key].autoAlpha).toBe(1);
    });
  });

  it("brings each department copies of the other two through its own agents, adapted, in the catalog's order over its own tool", () => {
    const state = at(id);
    for (const [i, dept] of T.departments.entries()) {
      const copies = T.copies.filter((copy) => copy.dept === i);
      expect(copies.map((copy) => copy.tool).sort()).toEqual([0, 1, 2].filter((k) => k !== i));
      // Its own tool in the foot of its stack, the copies over it in the catalog's order; the lower place fills first.
      expect(dept.wells.at[2]).toEqual(dept.own.at);
      expect(copies.map((copy) => copy.at)).toEqual(dept.wells.at.slice(0, 2));
      expect(startOf(id, copies[1].key)).toBeLessThan(startOf(id, copies[0].key));
      for (const copy of copies) {
        expect(state[copy.key]).toMatchObject({ x: 0, y: 0, autoAlpha: 1, "--k": 1 });
        expect(tagOf(copy.key)).toContain("sh-card--copy");
        // It turns into the department's own once the agents are filling, and drops into the stack after.
        expect(startOf(id, copy.key)).toBeLessThan(playOf(id, copy.key).find((play) => "--k" in play.on)!.at);
      }
      expect(state[dept.agent.key]["--k"]).toBe(1);
    }
  });

  it("names the dashed corner once, beside Department C's top copy, as it lands", () => {
    const top = T.copies.find((copy) => copy.dept === 2 && copy.row === 0)!;
    expect(T.adapted.text).toBe(shown("together", "play")[6]);
    expect(T.adapted.at.x).toBeGreaterThanOrEqual(top.at.x + CARD.w);
    expect(T.adapted.at.x + T.adapted.at.w).toBeLessThanOrEqual(SAFE.right);
    expect(Math.abs(T.adapted.at.y + LABEL_LINE / 2 - (top.at.y + CARD.h / 2))).toBeLessThan(1);
    expect(at(id)[T.adapted.key].autoAlpha).toBe(1);
    expect(startOf(id, T.adapted.key)).toBeGreaterThanOrEqual(endOf(id, top.key) - 0.4);
  });

  it("names the agents once, \"AI agents\", at the left of Department C's, clear of every desk, stack and the lane, as they come", () => {
    const agents = T.departments[2].agent;
    expect(T.agents.text).toBe(shown("together", "play")[7]);
    expect(markup.match(new RegExp(`>${T.agents.text}<`, "g"))).toHaveLength(1);
    expect(T.agents.at.x + T.agents.at.w).toBeLessThanOrEqual(agents.at.x - AGENT_R - 8);
    expect(Math.abs(T.agents.at.y + T.agents.at.h / 2 - agents.at.y)).toBeLessThan(1);
    expect(T.agents.at.x).toBeGreaterThanOrEqual(SAFE.left);
    // It fits its box: 26 px type is under 0.55 em a letter.
    expect(T.agents.text.length * 26 * 0.55).toBeLessThanOrEqual(T.agents.at.w);
    const laneY = T.posts[0].at.y + T.posts[0].lane.y;
    expect(T.agents.at.y).toBeGreaterThan(laneY + CARD.h);
    for (const dept of T.departments) {
      for (const well of dept.wells.at) expect(overlaps(T.agents.at, cardBox(well))).toBe(false);
      expect(overlaps(T.agents.at, ringBox(dept.agent.at, AGENT_R + 4))).toBe(false);
      expect(overlaps(T.agents.at, ringBox(dept.at, dept.r + 4))).toBe(false);
      expect(overlaps(T.agents.at, dept.name.at)).toBe(false);
    }
    for (const copy of T.copies) expect(overlaps(T.agents.at, cardBox({ x: copy.at.x + copy.wait.x, y: copy.at.y + copy.wait.y }))).toBe(false);
    expect(at(id)[T.agents.key].autoAlpha).toBe(1);
    expect(startOf(id, T.agents.key)).toBeGreaterThanOrEqual(startOf(id, agents.key));
    expect(startOf(id, T.agents.key)).toBeLessThan(Math.min(...T.posts.map((post) => startOf(id, post.key))));
  });

  it("settles inside 11 s, its leaving included, with room to spare for the browser", () => {
    expect(Math.max(...playsAt(id).map(ends)) + LEAVE).toBeLessThanOrEqual(10.7);
  });

  it("reads the count under the catalog as the script quotes it, its second part once every stack is full", () => {
    expect(quoted("together").at(-1)).toBe("3 tools shared, 3 tools each");
    expect(T.count.parts.map((part) => part.text).join(" ")).toBe(quoted("together").at(-1));
    expect(T.count.at.y).toBeGreaterThanOrEqual(T.frame.at.y + T.frame.at.h);
    const copied = Math.max(...T.copies.map((copy) => endOf(id, copy.key)));
    expect(startOf(id, T.count.parts[1].key)).toBeGreaterThanOrEqual(copied);
    const posted = Math.max(...T.posts.map((post) => endOf(id, post.key)));
    expect(startOf(id, T.count.parts[0].key)).toBeGreaterThanOrEqual(posted - 1e-9);
    for (const part of T.count.parts) expect(at(id)[part.key].autoAlpha).toBe(1);
  });

  it("names the catalog's strip once, \"The catalog\", at its left, level with it, clear of the story band and the departments, as it comes in", () => {
    expect(T.catalog.text).toBe(shown("together", "play")[8]);
    expect(markup.match(new RegExp(`>${T.catalog.text}<`, "g"))).toHaveLength(1);
    expect(T.catalog.at.x + T.catalog.at.w).toBeLessThanOrEqual(T.frame.at.x - 12);
    expect(T.catalog.at.x).toBeGreaterThanOrEqual(SAFE.left);
    expect(Math.abs(T.catalog.at.y + T.catalog.at.h / 2 - (T.frame.at.y + T.frame.at.h / 2))).toBeLessThan(1);
    expect(T.catalog.at.y).toBeGreaterThanOrEqual(contentTop("together"));
    // It fits its box: 26 px type is under 0.55 em a letter.
    expect(T.catalog.text.length * 26 * 0.55).toBeLessThanOrEqual(T.catalog.at.w);
    expect(overlaps(T.catalog.at, T.count.at)).toBe(false);
    const laneY = T.posts[0].at.y + T.posts[0].lane.y;
    expect(T.catalog.at.y + T.catalog.at.h).toBeLessThan(laneY);
    for (const dept of T.departments) expect(overlaps(T.catalog.at, ringBox(dept.agent.at, AGENT_R + 4))).toBe(false);
    expect(at(id)[T.catalog.key].autoAlpha).toBe(1);
    expect(startOf(id, T.catalog.key)).toBeGreaterThanOrEqual(startOf(id, T.frame.key));
    expect(startOf(id, T.catalog.key)).toBeLessThan(Math.min(...T.posts.map((post) => startOf(id, post.key))));
  });
});
