import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { withBase } from "@/lib/base-path";

// The stage imports its stylesheet; it does not matter to the markup under test.
vi.mock("./close.css", () => ({}));

/** The close's stage as it renders with the given capture manifest in place of finale.json. */
async function stageWith(manifest: { version: string; stills: number[]; hero?: boolean }) {
  vi.resetModules();
  vi.doMock("./finale.json", () => ({ default: manifest }));
  const layout = await import("./layout");
  const { Scene } = await import("./scene");
  return { layout, markup: renderToStaticMarkup(createElement(Scene)) };
}

/** The markup of one frame, from its mount to the next frame. */
const frameOf = (markup: string, key: string) => {
  const from = markup.indexOf(`data-build="${key}"`);
  const next = markup.indexOf('class="dk-artefact"', from);
  return markup.slice(from, next < 0 ? undefined : next);
};

describe("the close with stills missing", () => {
  it("shows a white tile with a navy rule for a still the capture has not written, and the still where it has", async () => {
    const { layout, markup } = await stageWith({ version: "v9", stills: [1, 2, 4], hero: true });
    const { STILLS, blankRule } = layout;
    expect(STILLS.map((still) => still.src).slice(0, 5)).toEqual([withBase("/finale/01.v9.webp"), withBase("/finale/02.v9.webp"), null, withBase("/finale/04.v9.webp"), null]);
    expect(STILLS.filter((still) => still.src)).toHaveLength(3);
    for (const still of STILLS) {
      const frame = frameOf(markup, still.key);
      if (still.src) {
        expect(frame, still.key).toContain(still.src);
        expect(frame, still.key).not.toContain("close-blank");
      } else {
        const rule = blankRule(still.at);
        expect(frame, still.key).not.toContain("<img");
        expect(frame, still.key).toContain(`class="close-blank" style="left:${rule.x}px;top:${rule.y}px;width:${rule.w}px;height:${rule.h}px"`);
      }
    }
  });

  it("stands the first still in for slide 1's full-stage picture until that is captured, and a blank tile when neither is", async () => {
    const first = await stageWith({ version: "v9", stills: [1], hero: false });
    expect(first.layout.HERO.src).toBe(withBase("/finale/01.v9.webp"));
    expect(frameOf(first.markup, first.layout.HERO.frameKey)).toContain("01.v9.webp");

    const none = await stageWith({ version: "v9", stills: [] });
    expect(none.layout.HERO.src).toBeNull();
    expect(none.layout.STILLS.every((still) => still.src === null)).toBe(true);
    const rule = none.layout.blankRule(none.layout.HERO.at);
    expect(frameOf(none.markup, none.layout.HERO.frameKey)).toContain(`class="close-blank" style="left:${rule.x}px;top:${rule.y}px;width:${rule.w}px;height:${rule.h}px"`);
    expect(none.markup).not.toContain("<img");
  });
});
