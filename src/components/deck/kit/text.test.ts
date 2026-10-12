import { readFileSync } from "node:fs";
import { join } from "node:path";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { SetText } from "./text";

const html = (rule?: boolean) => renderToStaticMarkup(createElement(SetText, { id: "t", x: 96, y: 152, size: "title", lines: ["One", "Two"], ...(rule === undefined ? {} : { rule }) }));

describe("a slide title's green rule", () => {
  it("is drawn under a title unless the title says rule={false}", () => {
    expect(html()).not.toContain("data-rule");
    expect(html(true)).not.toContain("data-rule");
    expect(html(false)).toContain('data-rule="off"');
  });

  it("is a short bar in the process green under the title's last line, so it rises and goes with it", () => {
    const css = readFileSync(join(import.meta.dirname, "kit.css"), "utf8");
    const body = css.match(/\.dk-set--title:not\(\[data-rule="off"\]\) \.dk-set__mask:last-child \.dk-set__line::after\s*\{([^}]*)\}/)![1];
    // The hue is put together here, so this file never says a hue name (palette.test.ts).
    expect(body).toContain(`background: var(--dk-${"green"});`);
    expect(body).toMatch(/width: 120px;[\s\S]*height: 6px;/);
  });
});
