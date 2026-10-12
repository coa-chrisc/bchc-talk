/**
 * What Part 5's world test files share: the world compiled once, the
 * stage rendered once, and the small readers they use to ask when a part
 * moves, where it ends and what colour it sits in. Not a test itself.
 */
import { readFileSync } from "node:fs";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { expect } from "vitest";
import { compile, type Play } from "@/components/deck/engine/compile";
import type { Vars } from "@/components/deck/engine/types";
import { STAGE } from "@/components/deck/kit";
import { picturesOf } from "../steps";
import { TITLES } from "./layout";
import { Scene } from "./scene";
import { releasingEntry } from "./world";

export const world = releasingEntry.world;
export const compiled = compile(world);
export const pictures = picturesOf("releasing");

/** The world's first click starts after the engine's hand-over through night (engine/director.ts). */
export const HANDOVER = 0.6;

/** How many elements share a part's id: a title has one per line, everything else here is one element. */
export const lineCounts: Record<string, number> = Object.fromEntries(Object.values(TITLES).map((title) => [title.key, title.lines.length]));
export const ends = (play: Play) => play.at + play.duration + play.stagger * Math.max(0, ("key" in play ? (lineCounts[play.key] ?? 1) : 1) - 1);

/** A step's plays, by its id. */
export const playsOf = (stepId: string) => compiled.plays[world.steps.findIndex((step) => step.id === stepId)];
/** The plays that move one part in a step: at least one, or the test fails. */
export function partPlays(stepId: string, key: string): Play[] {
  const found = playsOf(stepId).filter((play) => "key" in play && play.key === key);
  expect(found.length, `${stepId} moves ${key}`).toBeGreaterThan(0);
  return found;
}
/** The plays of one part in a step that move a given property, in time order. */
export const propPlays = (stepId: string, key: string, prop: string) =>
  (partPlays(stepId, key).filter((play) => "key" in play && prop in play.on) as (Play & { on: Vars })[]).sort((a, b) => a.at - b.at);
/** When a part first starts moving in a step, and when it has landed. */
export const startOf = (stepId: string, key: string) => Math.min(...partPlays(stepId, key).map((play) => play.at));
export const endOf = (stepId: string, key: string) => Math.max(...partPlays(stepId, key).map(ends));
/** The picture at the end of a step. */
export const stateAt = (stepId: string) => compiled.states[world.steps.findIndex((step) => step.id === stepId) + 1];

/** Whether a part shows at all in a picture: not faded out, not undrawn, not wiped shut, its lines not below their masks. */
export const visible = (vars: Vars) =>
  vars.autoAlpha !== 0 && vars["--d"] !== 0 && !(Number(vars.yPercent) >= 100) && !["--wt", "--wr", "--wb", "--wl"].some((inset) => Number(vars[inset]) >= 100);
export const shownAt = (stepId: string) => compiled.keys.filter((key) => visible(stateAt(stepId)[key]));

export const markup = renderToStaticMarkup(createElement(Scene));
export const decode = (text: string) => text.replace(/&#x27;/g, "'").replace(/&quot;/g, '"').replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">");
export const texts = [...markup.matchAll(/>([^<]+)</g)].map((match) => decode(match[1]).trim()).filter(Boolean);
/** Where a part's id first appears in the markup. */
export const indexOf = (key: string) => markup.indexOf(`data-build="${key}"`);
/** The markup of the element that carries a part's id, up to its first child's end: its own attributes and its parents' are in what came before. */
const before = (key: string) => markup.slice(0, indexOf(key));
/** The last `data-hue` set before a part's id in the markup: the colour it sits in. */
export const hueOf = (key: string) => [...before(key).matchAll(/data-hue="([^"]+)"/g)].at(-1)?.[1];
export const css = readFileSync(new URL("./releasing.css", import.meta.url), "utf8");
/** The declarations of one class's rule in releasing.css. */
export const ruleOf = (selector: string) => css.match(new RegExp(`(?:^|\\n)\\${selector}\\s*\\{([^}]*)\\}`))?.[1] ?? "";
/** The right margin of the stage: nothing of a slide's picture goes past it. */
export const RIGHT_EDGE = STAGE.w - 96;
