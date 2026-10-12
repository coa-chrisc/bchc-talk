/**
 * What the build world's tests read: the world compiled, the scene's markup,
 * how many elements carry each id, and the plays of a click on one part.
 * Test support only; the deck never imports it.
 */
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { compile, type Play } from "@/components/deck/engine/compile";
import { storyKeys } from "@/components/deck/kit";
import { storyOf } from "../../script/find";
import { storyId } from "../steps";
import { Scene } from "./scene";
import { buildEntry } from "./world";

export const { world } = buildEntry;
export const compiled = compile(world);
export const markup = renderToStaticMarkup(createElement(Scene));

/** How many elements carry each part's id: a move's stagger runs across all of them. */
export const counts = new Map<string, number>();
for (const [, key] of markup.matchAll(/data-build="([^"]+)"/g)) counts.set(key, (counts.get(key) ?? 0) + 1);

export const stepIndex = (id: string) => world.steps.findIndex((step) => step.id === id);
/** The picture once a click has played. */
export const stateAt = (id: string) => compiled.states[stepIndex(id) + 1];
export const last = compiled.states[compiled.states.length - 1];

export type KeyPlay = Extract<Play, { key: string }>;
export const playsOf = (stepId: string) => compiled.plays[stepIndex(stepId)];
/** A click's plays on one part, in the order they start. */
export const on = (stepId: string, key: string) =>
  playsOf(stepId)
    .filter((play): play is KeyPlay => "key" in play && play.key === key)
    .sort((a, b) => a.at - b.at);
/** When a play has landed, its stagger run across every element with its id. */
export const landed = (play: Play) => play.at + play.duration + play.stagger * Math.max(0, ("key" in play ? (counts.get(play.key) ?? 1) : 1) - 1);
export const start = (plays: readonly Play[]) => Math.min(...plays.map((play) => play.at));
export const end = (plays: readonly Play[]) => Math.max(...plays.map(landed));
/** A picture's story line, A (0) or B (1). */
export const storyKey = (pictureId: string, n: number) => storyKeys(storyId(pictureId), storyOf(pictureId).length)[n];
/** Whether a part is on the stage in a picture: shown, and not shut by its clip. */
export const visible = (vars: Record<string, unknown> | undefined) => !!vars && vars.autoAlpha !== 0 && vars["--d"] !== 0 && !["--wt", "--wr", "--wb", "--wl"].some((inset) => vars[inset] === 100);
