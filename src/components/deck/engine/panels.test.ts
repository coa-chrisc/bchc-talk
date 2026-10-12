import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { Chrome } from "./panels";
import { CONTROL } from "./use-deck-input";
import type { RemoteState } from "./use-remote";

const remote = { phase: "off", url: null, paired: false } as unknown as RemoteState;
const chrome = (props: { number?: number; total?: number; controls?: boolean } = {}) =>
  renderToStaticMarkup(
    createElement(Chrome, { progress: 0.5, number: 3, total: 9, typed: "", link: "open", remote, controls: true, onCommand: () => {}, ...props }),
  );

/** Each element of the markup, with whether it is a button or sits inside one. */
function elements(markup: string) {
  const open: string[] = [];
  const found: { tag: string; inButton: boolean; attrs: string }[] = [];
  for (const [, close, tag, attrs, self] of markup.matchAll(/<(\/?)([a-z]+)([^>]*?)(\/?)>/g)) {
    if (close) {
      open.splice(open.lastIndexOf(tag), 1);
      continue;
    }
    found.push({ tag, inButton: tag === "button" || open.includes("button"), attrs });
    if (!self) open.push(tag);
  }
  return found;
}

describe("the chrome's back and forward buttons", () => {
  it("are two buttons named Previous slide and Next slide", () => {
    const buttons = elements(chrome()).filter((element) => element.tag === "button");
    expect(buttons.map((button) => button.attrs.match(/aria-label="([^"]*)"/)?.[1])).toEqual(["Previous slide", "Next slide"]);
    for (const button of buttons) expect(button.attrs).toMatch(/type="button"/);
  });

  it("say so at either end of the deck, where the deck does not move", () => {
    const disabled = (markup: string) => elements(markup).filter((element) => element.tag === "button").map((button) => /aria-disabled="true"/.test(button.attrs));
    expect(disabled(chrome({ number: 1 }))).toEqual([true, false]);
    expect(disabled(chrome({ number: 3 }))).toEqual([false, false]);
    expect(disabled(chrome({ number: 9 }))).toEqual([false, true]);
  });

  it("are left out when the deck says there are to be none, as when the screen is blanked", () => {
    expect(chrome({ controls: false })).not.toMatch(/<button/);
    expect(chrome({ controls: false })).toMatch(/3 \/ 9/);
  });

  it("are never also a click on the stage: every element a click on them can land on is a button or inside one, and a button is a control", () => {
    const markup = chrome();
    const nav = markup.slice(markup.indexOf("<nav"), markup.indexOf("</nav>"));
    const inside = elements(nav).slice(1);
    expect(inside.map((element) => element.tag)).toEqual(expect.arrayContaining(["button", "svg", "path"]));
    expect(inside.filter((element) => !element.inButton)).toEqual([]);
    expect(CONTROL.split(",").map((selector) => selector.trim())).toContain("button");
  });
});
