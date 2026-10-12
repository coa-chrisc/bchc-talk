import { readFileSync } from "node:fs";
import { join } from "node:path";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { ArtefactFrame } from "./artefact-frame";
import { Board, Cell } from "./board";
import { board } from "./board-layout";
import { Dashed } from "./dashed";
import { Connector, Line } from "./marks";
import { AGENT_HUES, HUES } from "./palette";
import { CardToken, Stations } from "./stations";
import { stations } from "./stations-layout";
import { take } from "./verbs";

const html = (element: Parameters<typeof renderToStaticMarkup>[0]) => renderToStaticMarkup(element);
const css = ["kit.css", "kit-parts.css"].map((file) => readFileSync(join(import.meta.dirname, file), "utf8")).join("\n");
/** A rule's body, by its exact selector list: the whole list, after the last rule or comment. */
const rule = (selector: string) => css.match(new RegExp(`(^|[}/])\\s*${selector.replace(/[[\].+*]/g, "\\$&")}\\s*\\{([^}]*)\\}`))?.[2];
const strip = (markup: string, attribute: string) => markup.replaceAll(new RegExp(` ${attribute}="[^"]*"`, "g"), "");

describe("a board cell's holder", () => {
  const layout = board({ id: "b", x: 0, y: 0, w: 1200, rows: [{ label: "Build", cells: 3 }] });
  const cell = layout.rows[0].cells[0];

  it("is not there unless given: the cell is the paper cell", () => {
    const plain = html(createElement(Cell, { cell }));
    expect(plain).not.toMatch(/data-role|dk-cell__hold|dk-cell__work/);
    expect(plain.match(/<rect class="dk-cell__[a-z]+"/g)).toEqual(['<rect class="dk-cell__well"', '<rect class="dk-cell__fill"', '<rect class="dk-cell__tint"', '<rect class="dk-cell__dash"']);
  });

  it("names the holder's role and adds the hold tint and the work over the paper fill, under the pass tint", () => {
    for (const holder of AGENT_HUES) {
      const held = html(createElement(Cell, { cell, holder }));
      expect(held.startsWith(`<g class="dk-cell" data-build="b.r0.c0" data-role="${holder}">`)).toBe(true);
      expect(held.match(/<rect class="dk-cell__[a-z]+"/g)).toEqual([
        '<rect class="dk-cell__well"',
        '<rect class="dk-cell__fill"',
        '<rect class="dk-cell__hold"',
        '<rect class="dk-cell__work"',
        '<rect class="dk-cell__tint"',
        '<rect class="dk-cell__dash"',
      ]);
      expect(strip(held, "data-role").replace(/<rect class="dk-cell__(hold|work)"[^>]*><\/rect>/g, "")).toBe(html(createElement(Cell, { cell })));
    }
  });

  it("is given to a board's cells by id, and only to those", () => {
    const plain = html(createElement(Board, { layout }));
    expect(plain).not.toContain("data-role");
    const held = html(createElement(Board, { layout, holders: { "b.r0.c1": "fix" } }));
    expect(held.match(/data-role="[^"]*"/g)).toEqual(['data-role="fix"']);
    expect(held).toContain('<g class="dk-cell" data-build="b.r0.c1" data-role="fix">');
  });

  it("tints the whole cell at the idle fraction and the work at the active one once taken (--hold), takes the paper fill's place, and empties on a fail", () => {
    expect(rule(".dk-cell__hold,\n.dk-cell__work")).toMatch(/fill: var\(--hue\);/);
    expect(rule(".dk-cell__hold")).toMatch(/opacity: calc\(var\(--hold, 0\) \* var\(--dk-tint-idle\) \* \(1 - var\(--fail, 0\)\)\);/);
    expect(rule(".dk-cell__work")).toMatch(/transform: scaleX\(var\(--k, 0\)\);[\s\S]*opacity: calc\(var\(--hold, 0\) \* var\(--dk-tint-active\) \* \(1 - var\(--fail, 0\)\)\);/);
    expect(rule(".dk-cell[data-role] .dk-cell__fill")).toMatch(/opacity: calc\(\(1 - var\(--hold, 0\)\) \* \(0\.92 - var\(--fail, 0\)\)\);/);
    expect(rule(".dk-cell__tint")).toMatch(/fill: var\(--dk-pass\);/);
  });

  it("is taken by the take verb: --hold from 0 to 1", () => {
    expect(take(cell)).toEqual([expect.objectContaining({ key: "b.r0.c0", on: { "--hold": 1 }, off: { "--hold": 0 } })]);
    expect(take([layout.rows[0].cells[1], layout.rows[0].cells[2]]).map((move) => move.key)).toEqual(["b.r0.c1", "b.r0.c2"]);
  });
});

describe("a row of stations in the catalog's colour", () => {
  const layout = stations({ id: "row", x: 96, y: 920, headings: ["Form", "Issue", "Draft", "Checks", "Approval", "Live"], human: 4 });

  it("draws as it was without a catalog station", () => {
    expect(html(createElement(Stations, { layout }))).not.toMatch(/dk-well--catalog|data-landed/);
  });

  it("puts the catalog's outline on the catalog station's well and its lit outline, and on no other", () => {
    const markup = html(createElement(Stations, { layout, catalog: 5 }));
    expect(markup.match(/<rect class="[^"]*dk-well--catalog[^"]*" data-build="[^"]*"/g)).toEqual([
      '<rect class="dk-well dk-well--catalog dk-draw" data-build="row.s5"',
      '<rect class="dk-well dk-well--lit dk-well--catalog" data-build="row.s5.lit"',
    ]);
    expect(markup.replaceAll(" dk-well--catalog", "")).toBe(html(createElement(Stations, { layout })));
    expect(rule(".dk-well--catalog")).toMatch(/stroke: var\(--dk-catalog\);/);
  });

  it("gives a landed card the catalog's edge, which a step can bring up with --landed", () => {
    const at = { x: 0, y: 0, w: 168, h: 48 };
    const plain = html(createElement(CardToken, { id: "card", at }));
    expect(plain).not.toContain("data-landed");
    const landed = html(createElement(CardToken, { id: "card", at, landed: true }));
    expect(landed.startsWith('<div class="dk-card" data-build="card" data-landed="true"')).toBe(true);
    expect(strip(landed, "data-landed")).toBe(plain);
    expect(rule(".dk-card[data-landed]::after")).toMatch(/border: 3px solid var\(--dk-catalog\);[\s\S]*opacity: var\(--landed, 1\);/);
  });
});

describe("a line in a role's colour", () => {
  const from = { x: 0, y: 0, w: 100, h: 40 };
  const to = { x: 300, y: 0, w: 100, h: 40 };

  it("a connector names its role as data-hue, and is otherwise the rule connector", () => {
    const plain = html(createElement(Connector, { id: "c", from, to }));
    expect(plain).not.toContain("data-hue");
    expect(html(createElement(Connector, { id: "c", from, to, tone: "paper" }))).toContain('class="dk-connector dk-connector--paper"');
    for (const tone of HUES) {
      const tinted = html(createElement(Connector, { id: "c", from, to, tone }));
      expect(tinted.startsWith(`<g class="dk-connector" data-build="c" data-hue="${tone}">`)).toBe(true);
      expect(strip(tinted, "data-hue")).toBe(plain);
    }
  });

  it("a line draws on in rule, full paper or a role's colour", () => {
    const at = { from: { x: 10, y: 20 }, to: { x: 210, y: 20 } };
    expect(html(createElement(Line, { id: "l", ...at }))).toBe('<path class="dk-rule dk-draw" data-build="l" d="M10 20L210 20" pathLength="1"></path>');
    expect(html(createElement(Line, { id: "l", ...at, tone: "paper" }))).toBe('<path class="dk-rule dk-line--paper dk-draw" data-build="l" d="M10 20L210 20" pathLength="1"></path>');
    expect(html(createElement(Line, { id: "l", ...at, tone: "share-code" }))).toBe('<path class="dk-rule dk-draw" data-build="l" data-hue="share-code" d="M10 20L210 20" pathLength="1"></path>');
  });

  it("a dashed outline names its role as data-hue in place of its tone class", () => {
    const at = { x: 0, y: 0, w: 100, h: 40 };
    const plain = html(createElement(Dashed, { id: "d", at }));
    expect(plain).toContain('class="dk-dashed dk-dashed--paper dk-wipe" data-build="d" style=');
    const tinted = html(createElement(Dashed, { id: "d", at, tone: "catalog" }));
    expect(tinted).toContain('class="dk-dashed dk-wipe" data-build="d" data-hue="catalog" style=');
    expect(strip(tinted, "data-hue").replace("dk-dashed dk-wipe", "dk-dashed dk-dashed--paper dk-wipe")).toBe(plain);
  });

  it("strokes in the role's colour: a line, a connector's line and head, a dashed outline", () => {
    expect(rule(".dk-rule[data-hue],\n.dk-connector[data-hue] .dk-rule,\n.dk-connector[data-hue] .dk-connector__head")).toMatch(/stroke: var\(--hue\);/);
    expect(rule(".dk-dashed[data-hue] rect,\n.dk-dashed[data-hue] path")).toMatch(/stroke: var\(--hue\);/);
    expect(rule(".dk-line--paper")).toMatch(/stroke: var\(--dk-paper\);/);
  });
});

describe("an artefact frame's catalog edge", () => {
  const props = { id: "f", at: { x: 0, y: 0, w: 800, h: 500 }, stills: [{ src: "/a.webp", alt: "A page" }] };

  it("is on the mount only when asked for", () => {
    const plain = html(createElement(ArtefactFrame, props));
    expect(plain).not.toContain("data-edge");
    const edged = html(createElement(ArtefactFrame, { ...props, edge: "catalog" }));
    expect(edged).toContain('<div class="dk-artefact__mount dk-wipe" data-build="f" data-edge="catalog">');
    expect(strip(edged, "data-edge")).toBe(plain);
  });

  it("is 3 px of the catalog's colour, over the mount's border and inside its clip", () => {
    expect(rule('.dk-artefact__mount[data-edge="catalog"]')).toMatch(/border-color: var\(--dk-catalog\);\s*outline: 3px solid var\(--dk-catalog\);\s*outline-offset: -3px;/);
  });
});

describe("the role colours in the kit's stylesheets", () => {
  it("never tint a word, never glow, never move by a transition or an animation", () => {
    const hued = [...css.matchAll(/([^{}]*(?:data-hue|data-role|data-edge|data-landed|--catalog)[^{}]*)\{([^}]*)\}/g)].map(([, , body]) => body);
    expect(hued.length).toBeGreaterThan(10);
    for (const body of hued) expect(body).not.toMatch(/(^|[\s;])color:|gradient|shadow|transition|animation/);
  });
});
