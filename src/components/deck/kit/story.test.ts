import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { CONTENT_TOP, STORY, Story, storyKeys, storyRows } from "./story";

const html = (props: Parameters<typeof Story>[0]) => renderToStaticMarkup(createElement(Story, props));
const tops = (markup: string) => [...markup.matchAll(/style="left:(\d+)px;top:(\d+)px"/g)].map(([, x, y]) => [Number(x), Number(y)]);

describe("where the story band sits", () => {
  it("runs down from y 338 under a one-line title and from y 420 under a two-line one, 48 px a row, at x 96", () => {
    expect(storyRows("one", 2)).toEqual([
      { x: 96, y: 338 },
      { x: 96, y: 386 },
    ]);
    expect(storyRows("two", 2)).toEqual([
      { x: 96, y: 420 },
      { x: 96, y: 468 },
    ]);
  });

  it("runs down from y 498 under a three-line title, a title line (72 px at 1.08) lower than under two", () => {
    expect(storyRows("three", 2)).toEqual([
      { x: 96, y: 498 },
      { x: 96, y: 546 },
    ]);
  });

  it("stacks up from the foot, so the last row always sits at y 988", () => {
    expect(storyRows("foot", 1)).toEqual([{ x: 96, y: 988 }]);
    expect(storyRows("foot", 2).map((row) => row.y)).toEqual([940, 988]);
    expect(storyRows("foot", 3).map((row) => row.y)).toEqual([892, 940, 988]);
  });

  it("leaves the drawing to start 100 px below where it did, clear of the band's last row", () => {
    expect(CONTENT_TOP).toEqual({ one: 440, two: 520, three: 598 });
    expect(CONTENT_TOP.one).toBeGreaterThan(storyRows("one", 2)[1].y + STORY.pitch);
    expect(CONTENT_TOP.two).toBeGreaterThan(storyRows("two", 2)[1].y + STORY.pitch);
    expect(CONTENT_TOP.three).toBeGreaterThan(storyRows("three", 2)[1].y + STORY.pitch);
  });
});

describe("the story lines", () => {
  it("are lettered a and b after their band", () => {
    expect(storyKeys("story.find", 2)).toEqual(["story.find.a", "story.find.b"]);
    expect(storyKeys("story.two-lines", 1)).toEqual(["story.two-lines.a"]);
  });

  it("set each line as 32 px body text in its own part, A over B", () => {
    const markup = html({ id: "story.find", band: "one", lines: ["Search by keyword.", "Compare two entries."] });
    expect(markup.match(/class="dk-set dk-set--text"/g)).toHaveLength(2);
    expect(markup.match(/data-build="[^"]+"/g)).toEqual(['data-build="story.find.a"', 'data-build="story.find.b"']);
    expect(tops(markup)).toEqual([
      [96, 338],
      [96, 386],
    ]);
    expect(markup).toContain(">Search by keyword.<");
  });

  it("set a line broken over two rows as one part, its rows taking the band's next places", () => {
    const markup = html({ id: "story.title", band: "foot", lines: ["Something you can use today.", ["How we built it in a few weeks,", "and how your department can build its own tools."]] });
    expect(tops(markup)).toEqual([
      [96, 892],
      [96, 940],
    ]);
    expect(markup.match(/data-build="story\.title\.b"/g)).toHaveLength(2);
  });

  it("set a line in the row it is given, where an earlier line has gone before it comes up", () => {
    const markup = html({ id: "story.swap", band: "two", lines: ["The old way.", "The new way."], starts: [0, 0] });
    expect(tops(markup)).toEqual([
      [96, 420],
      [96, 420],
    ]);
    expect(tops(html({ id: "story.swap", band: "foot", lines: ["The old way.", "The new way."], starts: [0, 0] }))).toEqual([
      [96, 988],
      [96, 988],
    ]);
  });

  it("set nothing when a slide has no story line", () => {
    expect(html({ id: "story.thanks", band: "foot", lines: [] })).toBe("");
  });
});
