/**
 * The catalog world's tests' shared view of it (world.test.ts and
 * world-why.test.ts): the world compiled once, the stage rendered once, and
 * the small readers both use to ask when a part moves, where it ends and
 * whether it is on the stage. Test code only; the world never imports it.
 */
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { compile } from "@/components/deck/engine/compile";
import type { Vars } from "@/components/deck/engine/types";
import { picturesOf } from "../steps";
import { CARD_AWAY, ROW } from "./layout";
import { catalogEntry } from "./world";

export const { world } = catalogEntry;
export const compiled = compile(world);
export const markup = renderToStaticMarkup(createElement(world.Scene));
export const pictures = picturesOf("catalog");
/** Every part the scene gives an id, with how many elements carry it. */
export const parts = [...markup.matchAll(/data-build="([^"]+)"/g)].reduce<Record<string, number>>((count, [, key]) => ({ ...count, [key]: (count[key] ?? 0) + 1 }), {});
/** The world before this one fading out: a world's first click plays after it (engine/director.ts). */
export const LEAVE = 0.6;
export const stepIndex = (pictureId: string, stepId: string) => world.steps.findIndex((step) => step.id === `${pictureId}.${stepId}`);

/** The part a part is drawn inside, which hides it with itself: the row holds its wells, card and ticks, a frame the ink and tabs on its still. */
function parentOf(key: string): string | undefined {
  if (key.startsWith("row.")) return "row";
  if (key.startsWith("find.")) return "catalog";
  const [head] = key.split(".");
  return key !== head && ["catalog", "opened", "runs"].includes(head) ? head : undefined;
}

/** Whether a part is on the stage in a picture: not faded out, not undrawn or unfilled, not shut, not below its mask, not untyped, not an unticked check, not waiting off the stage, and inside a part that is on the stage too. */
export function onStage(state: Record<string, Vars>, key: string): boolean {
  const vars = state[key] ?? {};
  const n = (prop: string) => (prop in vars ? Number(vars[prop]) : undefined);
  const parent = parentOf(key);
  if (parent && !onStage(state, parent)) return false;
  if (n("autoAlpha") === 0 || n("--d") === 0 || n("--k") === 0 || n("typed") === 0) return false;
  if ((n("yPercent") ?? 0) >= 100) return false;
  if (n("--pass") === 0 && n("--fail") === 0) return false;
  if (key === ROW.cardKey && n("x") === CARD_AWAY) return false;
  return !["--wt", "--wr", "--wb", "--wl"].some((side) => n(side) === 100);
}

/** When each play of a slide's click starts and lands, in the scene's own counts. */
export const timesOf = (pictureId: string) =>
  compiled.plays[stepIndex(pictureId, "play")].map((play) => ({
    ...play,
    end: play.at + play.duration + play.stagger * Math.max(0, ("key" in play ? (parts[play.key] ?? 1) : 1) - 1),
  }));
export const stateAfter = (pictureId: string) => compiled.states[stepIndex(pictureId, "play") + 1];
export const keyOf = (play: object) => ("key" in play ? String(play.key) : "");
export type Timed = ReturnType<typeof timesOf>[number];
/** The plays of a click that move one part's `prop`, in time order. */
export const moved = (plays: Timed[], key: string, prop: string) =>
  plays.filter((play): play is Timed & { key: string; on: Vars } => keyOf(play) === key && "on" in play && prop in play.on).sort((a, b) => a.at - b.at);
export const startOf = (plays: Timed[], key: string) => Math.min(...plays.filter((play) => keyOf(play) === key).map((play) => play.at));
export const endOf = (plays: Timed[], key: string) => Math.max(...plays.filter((play) => keyOf(play) === key).map((play) => play.end));
