import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { RIDE_ABOVE, Rider, riding } from "./marks";

/** A stand-in for a Rider's group: a straight path from (300, 500) to (1620, 820), and the text it places. */
function fakeRider() {
  const from = { x: 300, y: 500 };
  const to = { x: 1620, y: 820 };
  const length = Math.hypot(to.x - from.x, to.y - from.y);
  const placed: Record<string, string> = {};
  const path = { getTotalLength: () => length, getPointAtLength: (d: number) => ({ x: from.x + ((to.x - from.x) * d) / length, y: from.y + ((to.y - from.y) * d) / length }) };
  const text = { setAttribute: (name: string, value: string) => (placed[name] = value) };
  return { group: { firstElementChild: path, lastElementChild: text } as unknown as SVGGElement, placed };
}

describe("the rider", () => {
  it("is one part, named by its id, that carries its glyph on the line's own path", () => {
    const markup = renderToStaticMarkup(createElement(Rider, { id: "two-lines.dollar", d: "M300 500L1620 820", text: "$" }));
    expect(markup.match(/data-build="[^"]*"/g)).toEqual(['data-build="two-lines.dollar"']);
    expect(markup).toContain('d="M300 500L1620 820"');
    expect(markup).toMatch(/<text class="dk-rider__text"[^>]*>\$<\/text>/);
  });

  it("sits 26 px over its path's point: at the start before it rides, at the end once it has", () => {
    const { group, placed } = fakeRider();
    riding()(group);
    expect(RIDE_ABOVE).toBe(26);
    expect(placed).toEqual({ x: "300.0", y: "474.0" });
    (group as unknown as { along: number }).along = 1;
    expect(placed).toEqual({ x: "1620.0", y: "794.0" });
    (group as unknown as { along: number }).along = 0.5;
    expect(placed).toEqual({ x: "960.0", y: "634.0" });
  });

  it("stays on the path past either end of the trip", () => {
    const { group, placed } = fakeRider();
    riding()(group);
    (group as unknown as { along: number }).along = 1.2;
    expect(placed).toEqual({ x: "1620.0", y: "794.0" });
  });
});
