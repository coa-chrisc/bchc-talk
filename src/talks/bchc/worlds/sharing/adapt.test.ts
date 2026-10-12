/** Slide 25, your agents adapt it to where you run: one large card, its badge flipping from the first provider to the second, your agents' rework, the dashed corner, your reviewer's approval, and the adapted copy in the catalog. */
import { describe, expect, it } from "vitest";
import { shown } from "../../script/find";
import { CATALOG_SLOTS, SAFE, SAFE_BOTTOM, contentTop } from "./layout";
import { ADAPT, MINI } from "./layout-adapt";
import { PLACED } from "./beats";
import { at, inside, markup, overlaps, startOf, tagOf, texts } from "./harness";

const id = "adapt.play";
const A = ADAPT;
const [TOOL, AZURE, YOUR_AGENTS, STORAGE, SIGN_IN, DEPLOYMENT, AWS, ADAPTED, APPROVES] = shown("adapt", "play");

describe("25. your agents adapt it to where you run", () => {
  it("sets all nine of the script's labels", () => {
    expect(shown("adapt", "play")).toHaveLength(9);
    for (const label of shown("adapt", "play")) expect(texts, label).toContain(label);
  });

  it("draws one large card: its map pin and name, its three lines, and a badge that flips from the first provider to the second", () => {
    expect(A.tool).toEqual({ name: TOOL, icon: "pin" });
    expect(A.rows.map((row) => row.text)).toEqual([STORAGE, SIGN_IN, DEPLOYMENT]);
    expect(A.badge).toMatchObject({ from: AZURE, to: AWS });
    const end = at(id);
    expect(end[A.card.key].autoAlpha).toBe(1);
    expect(end[A.badge.key]["--k"]).toBe(1);
    for (const row of A.rows) expect(end[row.key]["--k"], row.key).toBe(1);
    expect(markup.match(/class="sh-card__own"/g)).toHaveLength(1 + 3 + 6);
  });

  it("has your agents rework the lines one at a time, then the corner and its word come up", () => {
    const starts = A.rows.map((row) => startOf(id, row.key));
    starts.slice(1).forEach((start, k) => expect(start).toBeGreaterThan(starts[k]));
    expect(startOf(id, A.badge.key)).toBeGreaterThan(starts.at(-1)!);
    expect(A.agentLabel.text).toBe(YOUR_AGENTS);
    expect(A.adapted.text).toBe(ADAPTED);
    const end = at(id);
    expect(end[A.agent.key]["--k"]).toBe(1);
    expect(end[A.corner.key].autoAlpha).toBe(1);
    expect(end[A.adapted.key].autoAlpha).toBe(1);
    expect(tagOf(A.agent.key)).toContain('data-role="process"');
  });

  it("ticks each reworked line in deep green once its tests pass, after the badge has flipped and before anyone approves", () => {
    expect(A.ticks).toHaveLength(A.rows.length);
    const end = at(id);
    A.ticks.forEach((tick, n) => {
      const row = A.rows[n];
      expect(tagOf(tick.key)).toContain("dk-pass-tick");
      expect(tick.at.y).toBe(row.at.y);
      expect(tick.at.x - tick.r).toBeGreaterThan(row.bar.x + row.bar.w);
      expect(tick.at.x + tick.r).toBeLessThan(A.card.at.x + A.card.at.w);
      expect(end[tick.key].autoAlpha).toBe(1);
      expect(startOf(id, tick.key)).toBeGreaterThan(startOf(id, A.badge.key));
      expect(startOf(id, tick.key)).toBeLessThan(startOf(id, A.mark.key));
    });
  });

  it("has a person on your team approve it: the orange mark, and beside it their words in navy", () => {
    expect(A.approves.text).toBe(APPROVES);
    expect(tagOf(A.mark.key)).toContain("dk-human");
    // Only the mark is orange: the words are a navy label of their own, not the mark's.
    expect(markup).not.toContain("dk-human__label");
    expect(tagOf(A.approves.key)).not.toContain("human");
    expect(A.approves.at.x).toBeGreaterThan(A.mark.at.x + 24);
    expect(Math.abs(A.approves.at.y + A.approves.at.h / 2 - A.mark.at.y)).toBeLessThan(1);
    expect(A.approves.at.x + A.approves.at.w).toBeLessThanOrEqual(SAFE.right);
    const end = at(id);
    expect(end[A.mark.key]["--d"]).toBe(1);
    expect(end[A.approves.key].autoAlpha).toBe(1);
    expect(startOf(id, A.mark.key)).toBeGreaterThan(startOf(id, A.badge.key));
    expect(startOf(id, A.approves.key)).toBeGreaterThanOrEqual(startOf(id, A.mark.key));
  });

  it("puts the adapted copy into the catalog's second place beside the original, and keeps the large card", () => {
    expect(A.frame.stills).toEqual([CATALOG_SLOTS]);
    expect(inside(A.original.at, A.slots[0])).toBe(true);
    expect(inside(A.copy.at, A.slots[1])).toBe(true);
    expect(A.original.badge).toBe(AZURE);
    expect(A.copy.badge).toBe(AWS);
    const end = at(id);
    expect(end[A.copy.key]).toMatchObject({ ...PLACED(1), autoAlpha: 1 });
    expect(end[A.original.key].autoAlpha).toBe(1);
    expect(A.copy.start["--s"]).toBeCloseTo(A.card.at.w / MINI.w, 2);
  });

  it("keeps everything under the story band, inside the safe area, and clear of the large card", () => {
    expect(A.frame.at.y).toBeGreaterThanOrEqual(contentTop("adapt"));
    expect(A.card.at.y).toBeGreaterThan(A.frame.at.y + A.frame.at.h);
    expect(A.card.at.y + A.card.at.h).toBeLessThanOrEqual(SAFE_BOTTOM);
    expect(A.agentLabel.at.x).toBeGreaterThanOrEqual(SAFE.left);
    expect(A.agentLabel.at.y + A.agentLabel.at.h).toBeLessThanOrEqual(SAFE_BOTTOM);
    for (const label of [A.adapted.at, A.agentLabel.at, A.person.at]) expect(overlaps(label, A.card.at)).toBe(false);
    expect(overlaps(A.adapted.at, A.person.at)).toBe(false);
    expect(A.mark.at.y + 24).toBeLessThanOrEqual(SAFE_BOTTOM);
  });
});
