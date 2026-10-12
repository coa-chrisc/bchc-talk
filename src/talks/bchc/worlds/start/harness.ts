/**
 * The start world's tests' shared view of it (world.test.ts and the
 * per-slide suites): the stage's markup parsed into its keyed parts, the
 * compiled steps, and small readers over both. Test code only; the world
 * itself never imports it.
 */
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { expect } from "vitest";
import { compile, type Compiled, type Play } from "@/components/deck/engine/compile";
import type { Vars } from "@/components/deck/engine/types";
import { picturesOf } from "../steps";
import { startEntry } from "./world";

/** A part of the stage: its key, its classes, the part it sits in, and whether it paints anything of its own. */
export type Node = { key: string; classes: string[]; parent: Node | null; paints: boolean };

const VOID = new Set(["area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "source", "track", "wbr"]);
/** Elements that put something on the stage; the rest (g, div, svg, span) only hold other things. */
const PAINT = new Set(["path", "circle", "rect", "line", "polyline", "polygon", "ellipse", "text", "img", "image"]);

/** Elements whose children are never painted themselves: a clip's shape only cuts what it clips. */
const UNPAINTED = new Set(["clippath", "defs", "mask"]);

/** Every keyed part in the markup, each with the keyed part it sits inside, and every text node. */
export function parse(markup: string) {
  const nodes: Node[] = [];
  const text: string[] = [];
  const stack: (Node | null)[] = [];
  let unpainted = 0;
  const keyed = () => stack.findLast((node) => node) ?? null;
  const paint = (node: Node | null) => {
    const owner = node ?? keyed();
    if (owner) owner.paints = true;
  };
  for (const [, close, tag, attrs, selfClosing, words] of markup.matchAll(/<(\/?)([a-zA-Z][\w-]*)([^>]*?)(\/?)>|([^<]+)/g)) {
    if (words !== undefined) {
      const trimmed = words.replace(/&#x27;/g, "'").replace(/&amp;/g, "&").trim();
      if (trimmed) {
        text.push(trimmed);
        paint(null);
      }
    } else if (close) {
      stack.pop();
      if (UNPAINTED.has(tag.toLowerCase())) unpainted--;
    } else {
      const key = attrs.match(/data-build="([^"]+)"/)?.[1];
      const node = key ? { key, classes: attrs.match(/class="([^"]+)"/)?.[1].split(/\s+/) ?? [], parent: keyed(), paints: false } : null;
      if (node) nodes.push(node);
      if (PAINT.has(tag.toLowerCase()) && !unpainted) paint(node);
      if (!selfClosing && !VOID.has(tag.toLowerCase())) {
        stack.push(node);
        if (UNPAINTED.has(tag.toLowerCase())) unpainted++;
      }
    }
  }
  return { nodes, text };
}

export const markup = renderToStaticMarkup(createElement(startEntry.world.Scene));
export const { nodes, text } = parse(markup);
export const compiled = compile(startEntry.world);
export const steps = startEntry.world.steps;
export const pictures = picturesOf("start");
export const nodeOf = (key: string) => nodes.find((node) => node.key === key) ?? null;

/** The picture a key belongs to: its first segment, or the picture a title, a story line or a step label is for (a step label's first). */
export const pictureOfKey = (key: string) => (key.startsWith("title.") ? key.slice(6) : key.startsWith("kicker.") ? key.slice(7) : key.startsWith("story.") ? key.split(".")[1] : key.split(".")[0]);

/** Parts whose whole picture is their fill: a dot, a stair's face, a bar that grows, a bar of writing, a pool's level. */
const FILL_ONLY = /^st-(dot|stair-face|grow|writing|pool__level)$/;

/** Hidden by its own values: gone, undrawn, under its mask, wiped shut, or an empty fill-only part. */
const shut = (vars: Vars | undefined, node: Node) =>
  !!vars &&
  (vars.autoAlpha === 0 ||
    vars["--d"] === 0 ||
    Number(vars.yPercent ?? 0) >= 100 ||
    ["--wt", "--wr", "--wb", "--wl"].some((inset) => vars[inset] === 100) ||
    (vars["--k"] === 0 && node.classes.some((name) => FILL_ONLY.test(name))));

/** Parts the kit's CSS keeps hidden until a move shows them: a lit edge, a done fill. */
const hiddenByCss = (node: Node) => node.classes.some((name) => /(^|__|-)(lit|done)$/.test(name));

export const hiddenAt = (state: Record<string, Vars>, node: Node | null): boolean => !!node && (shut(state[node.key], node) || hiddenByCss(node) || hiddenAt(state, node.parent));

const elementsOf = (key: string) => nodes.filter((node) => node.key === key).length;

/** When a play has landed: its last element, staggers counted. */
export const endOf = (play: Play) => play.at + play.duration + play.stagger * Math.max(0, ("key" in play ? elementsOf(play.key) : 1) - 1);

export const longestStep = (world: Compiled) => world.plays.map((plays) => Math.max(0, ...plays.map(endOf)));

export type PartPlay = Extract<Play, { key: string }>;
const stepAt = (id: string) => steps.findIndex((step) => step.id === id);
/** A click's plays on parts, in the order the step gives them. */
export const playsOf = (id: string) => compiled.plays[stepAt(id)].filter((play): play is PartPlay => "key" in play);
/** The plays of a click that move one part, optionally only those that move one of its properties. */
export const movesOf = (id: string, key: string, prop?: string) => playsOf(id).filter((play) => play.key === key && (!prop || prop in play.on));
export const only = (plays: PartPlay[]) => {
  expect(plays).toHaveLength(1);
  return plays[0];
};
/** The picture at the end of a click. */
export const endState = (id: string) => compiled.states[stepAt(id) + 1];
/** Whether a part shows at the end of a click. */
export const showsAtEnd = (id: string, key: string) => !hiddenAt(endState(id), nodeOf(key));
