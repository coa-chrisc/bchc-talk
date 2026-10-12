import { readFileSync } from "node:fs";
import { join } from "node:path";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { AGENT_ROLES, TILE, WAVE, agentArcs, tileBox, waveform } from "./glyph-geometry";
import { Agent, Dept, Tile, Waveform } from "./glyphs";
import { AGENT_HUES, HUES, ROLE_HUE } from "./palette";

const html = (element: Parameters<typeof renderToStaticMarkup>[0]) => renderToStaticMarkup(element);
const at = { x: 400, y: 300 };

describe("the agent glyph", () => {
  it("is one part, named by its id, that moves with x and y", () => {
    const markup = html(createElement(Agent, { id: "agent.a", at, role: "builder" }));
    expect(markup.match(/data-build="[^"]*"/g)).toEqual(['data-build="agent.a"']);
  });

  it("has the film's harness ring: three arcs with 0.24 rad gaps, each a track in rule and a fill in paper", () => {
    const arcs = agentArcs(at, 22);
    expect(arcs).toHaveLength(3);
    arcs.forEach((arc, i) => {
      expect(arc.start).toBeCloseTo(-Math.PI / 2 + (i * 2 * Math.PI) / 3 + 0.12, 10);
      expect(arc.end - arc.start).toBeCloseTo((2 * Math.PI) / 3 - 0.24, 10);
    });
    expect(arcs[1].start - arcs[0].end).toBeCloseTo(0.24, 10);
    const markup = html(createElement(Agent, { id: "a", at, role: "builder" }));
    expect(markup.match(/class="dk-agent__track"/g)).toHaveLength(3);
    expect(markup.match(/class="dk-agent__fill"/g)).toHaveLength(3);
    expect(markup.match(/pathLength="1"/g)).toHaveLength(6);
    expect(markup).toContain(`d="${arcs[0].d}"`);
  });

  it("starts and ends each arc on its circle", () => {
    for (const arc of agentArcs(at, 22)) {
      const [x0, y0, x1, y1] = arc.d.match(/-?\d+(\.\d+)?/g)!.map(Number).filter((_, i) => [0, 1, 7, 8].includes(i));
      expect(Math.hypot(x0 - at.x, y0 - at.y)).toBeCloseTo(22, 1);
      expect(Math.hypot(x1 - at.x, y1 - at.y)).toBeCloseTo(22, 1);
    }
  });

  it("tells its role by the body's shape, at the plan's sizes", () => {
    const body = (role: (typeof AGENT_ROLES)[number], r?: number) => html(createElement(Agent, { id: "a", at, role, r }));
    expect(body("builder")).toContain('<circle class="dk-agent__body" cx="400" cy="300" r="8"');
    expect(body("planner")).toContain('<circle class="dk-agent__body dk-agent__body--hollow" cx="400" cy="300" r="7"');
    expect(body("tester")).toContain('<rect class="dk-agent__body" x="393" y="293" width="14" height="14"');
    expect(body("reviewer")).toContain('<path class="dk-agent__body" d="M400 290L410 300L400 310L390 300Z"');
    expect(body("fixer")).toMatch(/<path class="dk-agent__body" d="M400 289\.47L410 307\.37L390 307\.37Z"/);
    expect(body("builder", 11)).toContain('r="4"');
  });

  it("takes no label but its role's name, and only when asked", () => {
    expect(html(createElement(Agent, { id: "a", at, role: "planner" }))).not.toContain("<text");
    for (const role of AGENT_ROLES) {
      const markup = html(createElement(Agent, { id: "a", at, role, label: true }));
      expect(markup).toContain(`<text class="dk-label dk-agent__label" x="400" y="350" text-anchor="middle" dominant-baseline="central">${role}</text>`);
    }
    expect([...AGENT_ROLES]).toEqual(["planner", "builder", "tester", "reviewer", "fixer"]);
  });
});

describe("a module tile", () => {
  it("is 18 square at 24 pitch with corners of 3 when small, and fills in from its centre", () => {
    expect(TILE.small).toEqual({ side: 18, rx: 3, pitch: 24 });
    const markup = html(createElement(Tile, { id: "t", at }));
    expect(markup).toBe('<g class="dk-tile" data-build="t"><rect class="dk-tile__fill" x="400" y="300" width="18" height="18" rx="3"></rect></g>');
  });

  it("is 64 square with corners of 8 and a paper edge when large", () => {
    expect(TILE.large).toEqual({ side: 64, rx: 8 });
    const markup = html(createElement(Tile, { id: "t", at, size: "large" }));
    expect(markup).toContain('<rect class="dk-tile__edge" x="400" y="300" width="64" height="64" rx="8" pathLength="1"></rect>');
    expect(markup).toContain('<rect class="dk-tile__fill" x="400" y="300" width="64" height="64" rx="8"></rect>');
  });

  it("gives the box a dashed new module takes at the same size", () => {
    expect(tileBox(at)).toEqual({ x: 400, y: 300, w: 18, h: 18 });
    expect(tileBox(at, "large")).toEqual({ x: 400, y: 300, w: 64, h: 64 });
  });
});

describe("a health department", () => {
  it("is a ring of 36 that draws on, with its label under it", () => {
    const markup = html(createElement(Dept, { id: "d", at, label: "Austin" }));
    expect(markup).toContain('<g class="dk-dept" data-build="d">');
    expect(markup).toContain('<circle class="dk-dept__ring" cx="400" cy="300" r="36" pathLength="1" transform="rotate(-90 400 300)"></circle>');
    expect(markup).toContain('<text class="dk-label dk-dept__label" x="400" y="364" text-anchor="middle" dominant-baseline="central">Austin</text>');
  });

  it("is drawn in paper as your department, and takes another size", () => {
    expect(html(createElement(Dept, { id: "d", at, yours: true }))).toContain('class="dk-dept dk-dept--yours"');
    expect(html(createElement(Dept, { id: "d", at, r: 18 }))).toContain('r="18"');
    expect(html(createElement(Dept, { id: "d", at }))).not.toContain("<text");
  });
});

describe("a voice waveform", () => {
  const layout = waveform({ id: "wave", x: 792, y: 500 });

  it("sets 24 bars, 6 wide at a pitch of 14, in a box 336 by 80", () => {
    expect(layout.box).toEqual({ x: 792, y: 500, w: 336, h: 80 });
    expect(layout.bars).toHaveLength(24);
    expect(layout.bars.map((bar) => bar.x)).toEqual(Array.from({ length: 24 }, (_, i) => 796 + i * 14));
    expect(layout.bars.every((bar) => bar.w === 6)).toBe(true);
  });

  it("takes its heights from a fixed list, centred on the box's middle, never taller than the box", () => {
    expect(layout.bars.map((bar) => bar.h)).toEqual([...WAVE.heights]);
    for (const bar of layout.bars) {
      expect(bar.y + bar.h / 2).toBe(540);
      expect(bar.h).toBeGreaterThanOrEqual(12);
      expect(bar.h).toBeLessThanOrEqual(80);
      expect(bar.cx).toBe(bar.x + 3);
      expect(bar.cy).toBe(540);
    }
    expect(waveform({ id: "wave", x: 792, y: 500 })).toEqual(layout);
  });

  it("names each bar on its own, wave.0 to wave.23, under the whole waveform's id", () => {
    expect(layout.keys).toEqual(Array.from({ length: 24 }, (_, i) => `wave.${i}`));
    const markup = html(createElement(Waveform, { layout }));
    expect(markup.startsWith('<g class="dk-wave" data-build="wave">')).toBe(true);
    expect(markup.match(/<g data-build="wave\.\d+"><rect class="dk-wave__bar"/g)).toHaveLength(24);
  });
});

describe("a glyph in a role's colour", () => {
  const strip = (markup: string, attribute: string) => markup.replace(new RegExp(` ${attribute}="[^"]*"`), "");

  it("an agent names its ring's role as data-role, and is otherwise the agent it was", () => {
    for (const role of AGENT_ROLES) {
      const plain = html(createElement(Agent, { id: "a", at, role, label: true }));
      expect(plain).not.toContain("data-role");
      for (const hue of AGENT_HUES) {
        const tinted = html(createElement(Agent, { id: "a", at, role, label: true, hue }));
        expect(tinted.startsWith(`<g class="dk-agent" data-build="a" data-role="${hue}">`)).toBe(true);
        expect(strip(tinted, "data-role")).toBe(plain);
      }
    }
  });

  it("a tiny agent in ink keeps a paper ring whatever its hue", () => {
    const plain = html(createElement(Agent, { id: "a", at, role: "builder", r: 11 }));
    expect(html(createElement(Agent, { id: "a", at, role: "builder", r: 11, hue: "process", ink: true }))).toBe(plain);
  });

  it("gives Part 3's roles their colours, and the tester none", () => {
    expect(ROLE_HUE).toEqual({ planner: "lead", builder: "process", reviewer: "review", fixer: "fix" });
    expect(ROLE_HUE.tester).toBeUndefined();
  });

  it("a tile and a department name their role as data-hue, and are otherwise what they were", () => {
    for (const hue of HUES) {
      for (const size of ["small", "large"] as const) {
        const tinted = html(createElement(Tile, { id: "t", at, size, hue }));
        expect(tinted.startsWith(`<g class="dk-tile" data-build="t" data-hue="${hue}">`)).toBe(true);
        expect(strip(tinted, "data-hue")).toBe(html(createElement(Tile, { id: "t", at, size })));
      }
      const dept = html(createElement(Dept, { id: "d", at, label: "A", hue }));
      expect(dept.startsWith(`<g class="dk-dept" data-build="d" data-hue="${hue}">`)).toBe(true);
      expect(strip(dept, "data-hue")).toBe(html(createElement(Dept, { id: "d", at, label: "A" })));
    }
    expect(html(createElement(Tile, { id: "t", at }))).not.toContain("data-hue");
    expect(html(createElement(Dept, { id: "d", at }))).not.toContain("data-hue");
  });

  it("colours an agent's ring fill and never its body; strokes a tile's edge and a department's ring in full, and fills them at the idle tint", () => {
    const css = readFileSync(join(import.meta.dirname, "kit-parts.css"), "utf8");
    const rule = (selector: string) => css.match(new RegExp(`(^|[}/])\\s*${selector.replace(/[[\].+]/g, "\\$&")}\\s*\\{([^}]*)\\}`))?.[2];
    expect(rule(".dk-agent[data-role] .dk-agent__fill")).toMatch(/stroke: var\(--hue\);/);
    expect(css).not.toMatch(/data-role\][^{]*\.dk-agent__body/);
    expect(rule(".dk-tile[data-hue] .dk-tile__fill")).toMatch(/fill: var\(--hue\);/);
    expect(rule(".dk-tile[data-hue] .dk-tile__edge")).toMatch(/stroke: var\(--hue\);/);
    expect(rule(".dk-tile[data-hue] .dk-tile__edge + .dk-tile__fill")).toMatch(/fill-opacity: var\(--dk-tint-idle\);/);
    expect(rule(".dk-dept[data-hue] .dk-dept__ring")).toMatch(/stroke: var\(--hue\);[\s\S]*fill-opacity: calc\(var\(--dk-tint-idle\) \* var\(--d, 1\)\);/);
  });
});

describe("the glyphs' colours", () => {
  it("are paper and rule, or a role named in a data attribute: no orange, no deep pass green, no colour set in the markup", () => {
    const markups = [
      ...AGENT_ROLES.map((role) => html(createElement(Agent, { id: "a", at, role, label: true }))),
      ...AGENT_ROLES.map((role) => html(createElement(Agent, { id: "a", at, role, label: true, hue: ROLE_HUE[role] }))),
      html(createElement(Tile, { id: "t", at, size: "large" })),
      ...HUES.map((hue) => html(createElement(Tile, { id: "t", at, size: "large", hue }))),
      html(createElement(Dept, { id: "d", at, yours: true, label: "Your department" })),
      ...HUES.map((hue) => html(createElement(Dept, { id: "d", at, label: "A", hue }))),
      html(createElement(Waveform, { layout: waveform({ id: "w", x: 0, y: 0 }) })),
    ];
    for (const markup of markups) expect(markup).not.toMatch(/fill="|stroke="|style=|#[0-9a-f]{3,6}|human|pass/i);
  });

  it("take no colour in the stylesheet but paper, rule and a role's (--hue, or a role's alias)", () => {
    const css = readFileSync(join(import.meta.dirname, "kit-parts.css"), "utf8");
    const rules = [...css.matchAll(/([^{}]*\.dk-(agent|tile|dept|wave)[^{}]*)\{([^}]*)\}/g)];
    expect(rules.length).toBeGreaterThan(0);
    const allowed = ["var(--dk-paper)", "var(--dk-rule)", "var(--hue)", ...HUES.map((hue) => `var(--dk-${hue})`)];
    for (const [, , , body] of rules) {
      const colours = (body.match(/var\(--(dk-[a-z0-9-]+|hue)\)|#[0-9a-f]{3,6}|rgb\([^)]*\)/gi) ?? []).filter((colour) => !/--dk-(tint-|wash)/.test(colour));
      for (const colour of colours) expect(allowed, body).toContain(colour);
    }
  });
});
