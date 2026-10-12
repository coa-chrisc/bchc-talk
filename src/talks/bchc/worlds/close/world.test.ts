import { existsSync, readdirSync, readFileSync } from "node:fs";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { compile, type Play } from "@/components/deck/engine/compile";
import { CHAIN, HOME, STAGE } from "@/components/deck/kit";
import { VENDOR_COLOURS, strayTokens } from "@/components/deck/kit/palette";
import type { Vars } from "@/components/deck/engine/types";
import { BASE_PATH, withBase } from "@/lib/base-path";
import { SCRIPT } from "../../script";
import { shown } from "../../script/find";
import { picturesOf } from "../steps";
import finaleJson from "./finale.json";
import { finalePictures } from "./finale-pictures.mjs";

// The stage imports its stylesheet; it does not matter to the markup under test.
vi.mock("./close.css", () => ({}));

const { AGENTS, AGENT_R, ARRIVAL, DISC_R, FINALE_VERSION, GRID, GRID_BOX, HERO, LABEL, LEGEND, MULTI, PICTURES, STILLS, THANKS, TITLES, heroName, stillName } = await import("./layout");
const { Scene } = await import("./scene");
/** A public address's file under public/, the base path taken off. */
const onDisk = (src: string) => `public${src.slice(BASE_PATH.length)}`;
const { CLOSING, LANDED, PULL_BACK, TRIP, closeEntry } = await import("./world");

const finale: { version: string; stills: number[]; hero?: boolean } = finaleJson;
const world = closeEntry.world;
const compiled = compile(world);
const pictures = picturesOf("close");
const STEP = "thanks.play";
const end = compiled.states[1];
const plays = compiled.plays[0];

/** The world's first click starts after the engine's hand-over (engine/director.ts). */
const HANDOVER = 0.6;

/** How many elements share a part's id: a title has one per line, everything else here is one element. */
const lineCounts: Record<string, number> = { [TITLES.thanks.key]: TITLES.thanks.lines.length };
const ends = (play: Play) => play.at + play.duration + play.stagger * Math.max(0, ("key" in play ? (lineCounts[play.key] ?? 1) : 1) - 1);

/** Whether a part shows at all: not faded out, not undrawn, not wiped shut, its lines not below their masks. */
const visible = (vars: Vars) => vars.autoAlpha !== 0 && vars["--d"] !== 0 && !(Number(vars.yPercent) >= 100) && !["--wt", "--wr", "--wb", "--wl"].some((inset) => Number(vars[inset]) >= 100);
/** A part inside another shows only while that one does: slide 1's frame inside its full-stage picture, an agent's glyph inside its flying part. */
const parentOf = (key: string) => (key === HERO.frameKey ? HERO.key : key.endsWith(".glyph") ? key.slice(0, -".glyph".length) : null);
const shownAt = (state: Record<string, Vars>) =>
  compiled.keys
    .filter((key) => {
      const parent = parentOf(key);
      return visible(state[key]) && !(parent && !visible(state[parent]));
    })
    .sort();

const stills = STILLS.map((still) => still.key);
const agents = AGENTS.map((agent) => agent.key);
const glyphs = AGENTS.map((agent) => agent.glyphKey);

/** The plays that move one part: at least one, or the test fails. */
function partPlays(key: string): Play[] {
  const found = plays.filter((play) => "key" in play && play.key === key);
  expect(found.length, `${STEP} moves ${key}`).toBeGreaterThan(0);
  return found;
}
const propPlays = (key: string, prop: string) => partPlays(key).filter((play) => "key" in play && prop in play.on) as (Play & { on: Vars })[];
const startOf = (key: string) => Math.min(...partPlays(key).map((play) => play.at));
const endOf = (key: string) => Math.max(...partPlays(key).map(ends));
/** When a cell's still is all the way up: the first when the hero lands in it, the others when their fade ends. */
const upAt = (cell: number) => (cell === 0 ? ends(propPlays(HERO.key, "--s")[0]) : ends(propPlays(stills[cell], "autoAlpha")[0]));

const markup = renderToStaticMarkup(createElement(Scene));
const decode = (text: string) => text.replace(/&#x27;/g, "'").replace(/&quot;/g, '"').replace(/&amp;/g, "&");
const texts = [...markup.matchAll(/>([^<]+)</g)].map((match) => decode(match[1]).trim()).filter(Boolean);
const source = (name: string) => readFileSync(new URL(`./${name}`, import.meta.url), "utf8");

describe("Part 7, the close (slide 44 alone; slide 43 is cut)", () => {
  it("has the script's one step, slide 44's play, on navy", () => {
    expect(pictures.map((picture) => picture.number)).toEqual(["44"]);
    expect(world.steps.map((step) => step.id)).toEqual([STEP]);
    expect(world.steps.every((step) => step.ground === "navy")).toBe(true);
  });

  it("never moves the camera: the pull-back is the picture's own move", () => {
    expect(plays.some((play) => "camera" in play)).toBe(false);
    expect(compiled.cameras.every((camera) => camera === HOME)).toBe(true);
  });

  it("finishes the click inside 12 s, the world's hand-over counted", () => {
    expect(Math.max(...plays.map(ends)) + HANDOVER).toBeLessThanOrEqual(CHAIN.longest);
  });

  it("starts empty and ends on the full grid, an agent settled on every slide, the label with its agent, the closing lines and the thanks", () => {
    expect(shownAt(compiled.states[0])).toEqual([]);
    expect(shownAt(end)).toEqual([TITLES.thanks.key, THANKS.key, LABEL.key, LEGEND.key, ...stills, ...agents, ...glyphs].sort());
    expect(visible(end[HERO.key])).toBe(false);
    for (const agent of AGENTS) {
      expect(end[agent.key], agent.key).toMatchObject({ x: 0, y: 0, autoAlpha: 1 });
      expect(end[agent.glyphKey], agent.glyphKey).toMatchObject({ "--k": 1 });
    }
    expect(end[LEGEND.key]).toMatchObject({ autoAlpha: 1, "--k": 1 });
  });

  it("pulls back from slide 1 at the size of the stage into the first cell as every other slide comes up round it", () => {
    expect(HERO.at).toEqual({ x: 0, y: 0, w: STAGE.w, h: STAGE.h });
    expect(markup).toMatch(new RegExp(`class="close-hero dk-move" data-build="${HERO.key}"`));
    // It shows whole before it moves.
    const comesUp = propPlays(HERO.key, "autoAlpha").find((play) => play.on.autoAlpha === 1)!;
    expect(comesUp.at).toBe(PULL_BACK.hero);
    expect(endOf(HERO.frameKey)).toBeLessThanOrEqual(PULL_BACK.spread);
    // It lands exactly on the first cell.
    const [pull] = propPlays(HERO.key, "--s");
    expect(pull.on).toMatchObject({ "--x": MULTI.hero.x, "--y": MULTI.hero.y, "--s": MULTI.hero.scale });
    expect(pull.at).toBe(PULL_BACK.spread);
    expect(ends(pull)).toBeCloseTo(LANDED, 9);
    const cell = STILLS[0].at;
    expect(MULTI.hero.x).toBeCloseTo(cell.x, 6);
    expect(MULTI.hero.y).toBeCloseTo(cell.y, 6);
    expect(STAGE.w * MULTI.hero.scale).toBeCloseTo(cell.w, 6);
    expect(STAGE.h * MULTI.hero.scale).toBeCloseTo(cell.h, 6);
    // The other slides are the spread's copies, in their cells, coming up in reading order while it travels.
    expect(MULTI.copies.map((copy) => copy.key)).toEqual(stills.slice(1));
    const comes = MULTI.copies.map((copy, i) => {
      expect(copy.x).toBeCloseTo(STILLS[i + 1].at.x, 6);
      expect(copy.y).toBeCloseTo(STILLS[i + 1].at.y, 6);
      return propPlays(copy.key, "autoAlpha")[0].at;
    });
    expect(comes[0]).toBeGreaterThan(pull.at);
    expect(comes[0]).toBeLessThan(ends(pull));
    expect([...comes].sort((x, y) => x - y)).toEqual(comes);
    // Landed, the first cell's own still takes over and the big picture goes.
    expect(startOf(stills[0])).toBeGreaterThanOrEqual(ends(pull) - 1e-9);
    const goes = propPlays(HERO.key, "autoAlpha").find((play) => play.on.autoAlpha === 0)!;
    expect(goes.at).toBeGreaterThan(startOf(stills[0]));
    expect(end[HERO.key]).toMatchObject({ "--x": MULTI.hero.x, "--y": MULTI.hero.y, "--s": MULTI.hero.scale });
  });

  it("raises the label with its agent as the first agents fly in, once the view has landed", () => {
    const firstLands = Math.min(...agents.map(endOf));
    expect(startOf(LABEL.key)).toBeGreaterThanOrEqual(LANDED);
    expect(startOf(LABEL.key)).toBeLessThan(firstLands);
    expect(startOf(LEGEND.key)).toBe(startOf(LABEL.key));
  });

  it("flies one agent in to each slide, in reading order, each once its slide is up, its ring filling green on the way, and settles it on the slide's bottom right corner", () => {
    expect(AGENTS).toHaveLength(STILLS.length);
    const leaves = AGENTS.map((agent) => {
      const [comes, flies] = [propPlays(agent.key, "autoAlpha")[0], propPlays(agent.key, "x")[0]];
      expect(comes.at, agent.key).toBe(flies.at);
      expect(flies.duration).toBe(TRIP.duration);
      // It comes down onto its slide from above and to the right.
      expect(agent.from).toEqual(ARRIVAL);
      expect(ARRIVAL.y).toBeLessThan(0);
      expect(compiled.states[0][agent.key]).toMatchObject({ x: ARRIVAL.x, y: ARRIVAL.y, autoAlpha: 0 });
      expect(flies.at, agent.key).toBeGreaterThanOrEqual(upAt(agent.cell));
      const fills = propPlays(agent.glyphKey, "--k")[0];
      expect(fills.on["--k"]).toBe(1);
      expect(fills.at).toBeGreaterThan(flies.at);
      expect(ends(fills)).toBeLessThanOrEqual(ends(flies));
      // Its disc sits wholly on its slide, in the bottom right corner.
      const cell = STILLS[agent.cell].at;
      expect(agent.at.x - DISC_R, agent.key).toBeGreaterThan(cell.x + cell.w / 2);
      expect(agent.at.x + DISC_R, agent.key).toBeLessThanOrEqual(cell.x + cell.w);
      expect(agent.at.y - DISC_R, agent.key).toBeGreaterThan(cell.y + cell.h / 2);
      expect(agent.at.y + DISC_R, agent.key).toBeLessThanOrEqual(cell.y + cell.h);
      return flies.at;
    });
    expect([...leaves].sort((x, y) => x - y)).toEqual(leaves);
    expect(new Set(AGENTS.map((agent) => agent.cell)).size).toBe(STILLS.length);
  });

  it("brings the closing lines up above the grid once the agents have settled, the thanks last", () => {
    const settled = Math.max(...agents.map(endOf));
    expect(startOf(TITLES.thanks.key)).toBe(CLOSING.title);
    expect(startOf(TITLES.thanks.key)).toBeGreaterThanOrEqual(settled - 0.25);
    expect(startOf(THANKS.key)).toBeGreaterThanOrEqual(endOf(TITLES.thanks.key) - 0.5);
    expect(startOf(THANKS.key)).toBeGreaterThan(settled);
    expect(Math.max(...stills.map(endOf))).toBeLessThanOrEqual(startOf(TITLES.thanks.key));
  });

  it("lays out a still for each of the script's pictures before Part 7, five full rows at 160 by 90, centred under the closing lines, each its captured still or a blank tile until it exists", () => {
    const before = SCRIPT.filter((picture) => picture.world !== "close");
    expect(PICTURES).toBe(before.length);
    expect(STILLS).toHaveLength(before.length);
    expect(GRID.rows).toBe(5);
    expect(GRID.cols).toBe(Math.ceil(before.length / 5));
    expect(STILLS.length).toBeGreaterThan(GRID.cols * (GRID.rows - 1));
    for (const [i, still] of STILLS.entries()) {
      const n = i + 1;
      expect(still.at).toEqual({ x: GRID.x + (i % GRID.cols) * 170, y: GRID.y + Math.floor(i / GRID.cols) * 100, w: 160, h: 90 });
      expect(still.src).toBe(finale.stills.includes(n) ? withBase(`/finale/${stillName(n)}`) : null);
      if (still.src) expect(existsSync(onDisk(still.src)), still.src).toBe(true);
    }
    // One version, set in one place: finale.json, which the capture writes.
    expect(FINALE_VERSION).toBe(finale.version);
    expect(stillName(7)).toBe(`07.${finale.version}.webp`);
    expect(heroName()).toBe(`hero.${finale.version}.webp`);
    expect(HERO.src).toBe(finale.hero ? withBase(`/finale/${heroName()}`) : STILLS[0].src);
    if (HERO.src) expect(existsSync(onDisk(HERO.src)), HERO.src).toBe(true);
    // Centred across the stage, under the thanks and the label, inside the stage's 64 px edge.
    expect(GRID_BOX.x).toBe(STILLS[0].at.x);
    expect(GRID_BOX.x).toBe(STAGE.w - (GRID_BOX.x + GRID_BOX.w));
    expect(GRID_BOX.x).toBeGreaterThanOrEqual(64);
    expect(GRID_BOX.y + GRID_BOX.h).toBeLessThanOrEqual(STAGE.h - 64);
    expect(GRID_BOX.y + GRID_BOX.h).toBe(STILLS.at(-1)!.at.y + GRID.h);
    expect(THANKS.at.y + THANKS.at.h).toBeLessThan(LABEL.at.y);
    expect(LABEL.at.y + LABEL.at.h).toBeLessThan(GRID.y);
  });

  it("sets the label just above the grid's top right, ending by its agent at the grid's right edge, clear of the thanks", () => {
    const right = GRID_BOX.x + GRID_BOX.w;
    expect(LEGEND.at.x + AGENT_R).toBe(right);
    expect(LABEL.at.x + LABEL.at.w).toBeLessThan(LEGEND.at.x - AGENT_R);
    expect(LEGEND.at.y).toBe(LABEL.at.y + LABEL.at.h / 2);
    expect(LABEL.at.x).toBeGreaterThan(THANKS.at.x + THANKS.at.w);
    expect(markup).toMatch(new RegExp(`class="dk-block dk-block--line close-label" data-build="${LABEL.key}"`));
  });

  it("puts only the script's words on the stage: the label, the two closing lines and the thanks", () => {
    const [label, ...closing] = shown("thanks", "play");
    expect(label).toBe("Agents built this talk too");
    expect(LABEL.text).toBe(label);
    expect(TITLES.thanks.lines).toEqual(closing.slice(0, 2));
    expect(THANKS.text).toBe(closing[2]);
    expect(texts.sort()).toEqual([label, ...closing].sort());
    expect(markup).not.toMatch(/@|https?:|mailto/);
  });

  it("flies the agents as green builders on navy discs, and uses no orange and no pass green", () => {
    expect(source("scene.tsx")).toMatch(/<Agent [^>]*role="builder"/);
    for (const key of [LEGEND.key, ...glyphs]) expect(markup).toContain(`class="dk-agent" data-build="${key}" data-role="process"`);
    for (const agent of AGENTS) expect(markup).toMatch(new RegExp(`data-build="${agent.key}"><circle class="close-disc" cx="${agent.at.x}" cy="${agent.at.y}" r="${DISC_R}"`));
    expect(source("close.css")).toMatch(/\.close-disc \{\s*fill: var\(--dk-night\);/);
    // The agents are drawn over the stills: in the plane's second SVG, after the HTML.
    expect(markup.indexOf(`data-build="${agents[0]}"`)).toBeGreaterThan(markup.lastIndexOf('class="dk-artefact"'));
    expect(markup).not.toMatch(/pass|dk-human/i);
    expect(source("close.css")).not.toMatch(/--dk-human|--dk-pass/);
  });

  it("paints only with the deck's tokens and the role aliases, and never a vendor's colour", () => {
    const sources = readdirSync(import.meta.dirname).filter((name) => /\.(tsx?|css|mjs)$/.test(name) && !name.endsWith(".test.ts"));
    expect(sources).toEqual(expect.arrayContaining(["close.css", "capture-finale.mjs", "finale-pictures.mjs"]));
    for (const name of sources) {
      expect(strayTokens(source(name)), name).toEqual([]);
      expect(source(name), name).not.toMatch(VENDOR_COLOURS);
    }
    expect(markup).not.toMatch(VENDOR_COLOURS);
  });
});

describe("the finale's capture", () => {
  it("reads the grid's pictures from the script, with the titles the deck's overview gives them, instead of a fixed count", async () => {
    const before = SCRIPT.filter((picture) => picture.world !== "close");
    expect(await finalePictures()).toEqual(before.map(({ number, name }) => ({ number, name, title: `${number}. ${name}` })));
    const capture = source("capture-finale.mjs");
    expect(capture).not.toMatch(/CELLS\s*=\s*\d/);
    expect(capture).toContain('import { finalePictures } from "./finale-pictures.mjs";');
    expect(capture).toContain("const cells = pictures.length;");
  });

  it("takes its version as an option, v6 by default, and documents the command that writes finale.json", () => {
    const capture = source("capture-finale.mjs");
    expect(capture).toContain('const DEFAULT_VERSION = "v6";');
    expect(capture).toMatch(/--version=v6 --manifest/);
  });
});
