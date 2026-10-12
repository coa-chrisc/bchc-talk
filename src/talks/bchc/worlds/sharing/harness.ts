/**
 * What Part 4's tests share: the world compiled, its scene rendered, and
 * the questions every test file asks of them (when a part moves in a step,
 * where it is after it, how many elements carry its id). Only the test
 * files import it.
 */
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { compile, type Play } from "@/components/deck/engine/compile";
import type { Box, Point } from "@/components/deck/kit";
import { stepId } from "../steps";
import { PICTURES } from "./layout";
import { pointOn, type Curve } from "./layout-network-ties";
import { Scene } from "./scene";
import { sharing } from "./world";

export const world = compile(sharing);
/** The world before this one fading out: a world's first click plays after it (engine/director.ts). */
export const LEAVE = 0.6;
export const ids = PICTURES.flatMap((picture) => picture.steps.map((step) => stepId(picture.id, step.id)));
export const n = (id: string) => {
  const index = ids.indexOf(id);
  if (index < 0) throw new Error(`No step "${id}".`);
  return index;
};
/** Every part's state once a step has played. */
export const at = (id: string) => world.states[n(id) + 1];
export const playsAt = (id: string) => world.plays[n(id)].flatMap((play) => ("key" in play ? [play] : []));
export const playOf = (id: string, key: string) => playsAt(id).filter((play) => play.key === key);
export const firstStep = (pictureId: string) => {
  const picture = PICTURES.find((entry) => entry.id === pictureId)!;
  return stepId(pictureId, picture.steps[0].id);
};
/** The last step of a slide: where its picture is whole. */
export const lastStep = (pictureId: string) => {
  const picture = PICTURES.find((entry) => entry.id === pictureId)!;
  return stepId(pictureId, picture.steps[picture.steps.length - 1].id);
};

export const markup = renderToStaticMarkup(createElement(Scene));
export const built = [...markup.matchAll(/data-build="([^"]+)"/g)].map((match) => match[1]);
export const elements = (key: string) => built.filter((id) => id === key).length;
/** The opening tag of the element a part's id is on. */
export const tagOf = (key: string) => markup.match(new RegExp(`<[^<>]*data-build="${key.replace(/\./g, "\\.")}"[^<>]*>`))?.[0] ?? "";
/** The markup inside the element a part's id is on, up to the end of the scene: what follows its opening tag. */
export const after = (key: string) => markup.slice(markup.indexOf(tagOf(key)) + tagOf(key).length);

/** When a play has landed: its last element's start, plus its duration. */
export const ends = (play: Play & { key: string }) => play.at + play.duration + play.stagger * Math.max(0, elements(play.key) - 1);
/** When a part first starts to move in a step, and when the last of its moves there has landed. */
export const startOf = (id: string, key: string) => Math.min(...playOf(id, key).map((play) => play.at));
export const endOf = (id: string, key: string) => Math.max(...playOf(id, key).map(ends));

/** Every word set on the stage, one text node each. */
const decode = (text: string) => text.replace(/&#x27;/g, "'").replace(/&quot;/g, '"').replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">");
export const texts = markup
  .replace(/<[^>]+>/g, "\n")
  .split("\n")
  .map((text) => decode(text).trim())
  .filter(Boolean);

/** Whether two boxes overlap. */
export const overlaps = (a: Box, b: Box) => a.x < b.x + b.w && b.x < a.x + a.w && a.y < b.y + b.h && b.y < a.y + a.h;
export const ringBox = (c: Point, r: number): Box => ({ x: c.x - r, y: c.y - r, w: 2 * r, h: 2 * r });
export const inside = (inner: Box, outer: Box) => inner.x >= outer.x && inner.y >= outer.y && inner.x + inner.w <= outer.x + outer.w && inner.y + inner.h <= outer.y + outer.h;
/** How far a point is from the line segment between two others. */
export const fromSegment = (p: Point, a: Point, b: Point) => {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const t = Math.max(0, Math.min(1, ((p.x - a.x) * dx + (p.y - a.y) * dy) / (dx * dx + dy * dy)));
  return Math.hypot(p.x - (a.x + t * dx), p.y - (a.y + t * dy));
};

/* Slide 27's lines and the labels turned along them (network.test.ts, network-ties.test.ts). */

/** A curve as the straight pieces it is drawn in, close enough to measure by. */
export const piecesOf = (curve: Curve) => Array.from({ length: 401 }, (_, n) => pointOn(curve, n / 400));
/** How far a point is from a line drawn through points. */
export const fromPath = (p: Point, path: readonly Point[]) => Math.min(...path.slice(1).map((q, n) => fromSegment(p, path[n], q)));
/** How near two lines drawn through points come. */
export const between = (a: readonly Point[], b: readonly Point[]) => Math.min(...a.map((p) => fromPath(p, b)));
type Turned = { at: Box; angle: number };
/** Whether a point lies within `margin` of a label's box, turned to its angle about its middle. */
export const inTurned = (p: Point, label: Turned, margin: number) => {
  const c = { x: label.at.x + label.at.w / 2, y: label.at.y + label.at.h / 2 };
  const a = (-label.angle * Math.PI) / 180;
  const x = (p.x - c.x) * Math.cos(a) - (p.y - c.y) * Math.sin(a);
  const y = (p.x - c.x) * Math.sin(a) + (p.y - c.y) * Math.cos(a);
  return Math.abs(x) < label.at.w / 2 + margin && Math.abs(y) < label.at.h / 2 + margin;
};
/** The four corners of a label's box, turned to its angle about its middle. */
export const cornersOf = (label: Turned): Point[] => {
  const c = { x: label.at.x + label.at.w / 2, y: label.at.y + label.at.h / 2 };
  const a = (label.angle * Math.PI) / 180;
  return [
    [-1, -1],
    [1, -1],
    [1, 1],
    [-1, 1],
  ].map(([sx, sy]) => {
    const x = (sx * label.at.w) / 2;
    const y = (sy * label.at.h) / 2;
    return { x: c.x + x * Math.cos(a) - y * Math.sin(a), y: c.y + x * Math.sin(a) + y * Math.cos(a) };
  });
};
/** Whether two turned labels come within `margin` of each other: any corner of one inside the other, either way round. */
export const labelsMeet = (a: Turned, b: Turned, margin: number) => cornersOf(a).some((p) => inTurned(p, b, margin)) || cornersOf(b).some((p) => inTurned(p, a, margin));
