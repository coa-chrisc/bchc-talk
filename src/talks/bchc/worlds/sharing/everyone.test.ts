/** Slide 24, when every member shares: your department's outline, close, and the other members' tiles pouring in faster and faster as the view pulls back. No number anywhere. */
import { describe, expect, it } from "vitest";
import { shown } from "../../script/find";
import { PICTURES, SAFE, SAFE_BOTTOM, STORIES, TITLES, contentTop } from "./layout";
import { EVERYONE, POOL, STAGES } from "./layout-everyone";
import { at, markup, overlaps, startOf, tagOf } from "./harness";

const id = "everyone.play";
const E = EVERYONE;
const C = E.pool.origin;

describe("24. when every member shares", () => {
  it("sets no number anywhere on the slide: not in its title, its story, its label or its picture", () => {
    const picture = PICTURES.find((entry) => entry.id === "everyone")!;
    const words = [...TITLES.find((title) => title.picture === "everyone")!.lines, ...STORIES.find((band) => band.picture === "everyone")!.lines.flat(), E.label.text];
    for (const text of words) expect(text).not.toMatch(/\d/);
    expect(picture.steps.flatMap((step) => step.show).join(" ")).not.toMatch(/\d/);
    const slide = markup.slice(markup.indexOf('data-build="everyone.html"'), markup.indexOf('data-build="adapt.html"'));
    expect(slide.replace(/<[^>]+>/g, " ")).not.toMatch(/\d/);
  });

  it("labels the outline \"Your department\", over its top edge at every stage of the view", () => {
    expect(E.label.text).toBe(shown("everyone", "play")[0]);
    for (const stage of STAGES) {
      const top = C.y - (E.outline.at.h * stage.oy * stage.s) / 2;
      expect(E.label.at.y + E.label.at.h + stage.labelY, `${stage.count} tiles`).toBeLessThanOrEqual(top + 1e-6);
      expect(top - (E.label.at.y + E.label.at.h + stage.labelY), `${stage.count} tiles`).toBeLessThan(20);
    }
    expect(at(id)[E.label.key]).toMatchObject({ autoAlpha: 1, y: 0 });
  });

  it("labels your own tile \"Yours\" over it, in the room left for it, from the start to the end", () => {
    expect(E.yours.text).toBe(shown("everyone", "play")[1]);
    expect(tagOf(E.yours.key)).toContain("sh-yours");
    // It sits in the pool, so it moves with the view, centred over your tile and clear of every other.
    expect(markup.indexOf(`data-build="${E.yours.key}"`)).toBeGreaterThan(markup.indexOf(`data-build="${E.pool.key}"`));
    expect(markup.indexOf(`data-build="${E.yours.key}"`)).toBeLessThan(markup.indexOf(`data-build="${E.tiles[0].key}"`));
    expect(E.yours.at.x + E.yours.at.w / 2).toBe(E.own.at.x + POOL.tile / 2);
    expect(E.yours.at.y + E.yours.at.h).toBeLessThanOrEqual(E.own.at.y);
    for (const tile of E.tiles) expect(overlaps({ ...tile.at, w: POOL.tile, h: POOL.tile }, E.yours.at), tile.key).toBe(false);
    expect(startOf(id, E.yours.key)).toBeLessThan(Math.min(...E.tiles.map((tile) => startOf(id, tile.key))));
    expect(at(id)[E.yours.key].autoAlpha).toBe(1);
  });

  it("starts close on your own tile alone, and pulls back to the outline at full width as the tiles land", () => {
    expect(STAGES[0].count).toBe(1);
    expect(STAGES[0].s).toBeGreaterThan(2.5);
    expect(STAGES[0].s).toBeLessThanOrEqual(3);
    expect(STAGES.at(-1)).toMatchObject({ count: 1 + E.tiles.length, s: 1, ox: 1, oy: 1, labelY: 0 });
    expect(1 + E.tiles.length + E.yours.places).toBe(POOL.cols * POOL.rows);
    STAGES.slice(1).forEach((stage, k) => expect(stage.s).toBeLessThanOrEqual(STAGES[k].s));
    expect(at(id)[E.pool.key]["--s"]).toBe(1);
    expect(at(id)[E.outline.key]).toMatchObject({ autoAlpha: 1, "--ox": 1, "--oy": 1 });
  });

  it("lands the tiles in waves of one, two at once, four, then more and more, each wave sooner after the last", () => {
    expect(E.waves.slice(0, 6)).toEqual([1, 2, 4, 8, 16, 32]);
    expect(E.waves.reduce((sum, count) => sum + count, 0)).toBe(E.tiles.length);
    E.waves.forEach((count, w) => expect(E.tiles.filter((tile) => tile.wave === w), `wave ${w}`).toHaveLength(count));
    const starts = E.waves.map((_, w) => Math.min(...E.tiles.filter((tile) => tile.wave === w).map((tile) => startOf(id, tile.key))));
    const gaps = starts.slice(1).map((start, k) => start - starts[k]);
    gaps.forEach((gap) => expect(gap).toBeGreaterThan(0));
    gaps.slice(1).forEach((gap, k) => expect(gap).toBeLessThan(gaps[k] + 1e-9));
  });

  it("brings each tile in along its row, never over the title or the story band, and leaves it landed with its dashed corner", () => {
    const state = at(id);
    for (const tile of E.tiles) {
      expect(tile.from.y, tile.key).toBe(0);
      expect(state[tile.key], tile.key).toMatchObject({ x: 0, y: 0, autoAlpha: 1, "--k": 1 });
    }
  });

  it("ends with the outline full width inside the safe area, under the story band", () => {
    const { at: box } = E.outline;
    expect(box.x).toBeGreaterThanOrEqual(SAFE.left);
    expect(box.x + box.w).toBeLessThanOrEqual(SAFE.right);
    expect(box.y + box.h).toBeLessThanOrEqual(SAFE_BOTTOM);
    expect(E.label.at.y).toBeGreaterThanOrEqual(contentTop("everyone"));
  });
});
