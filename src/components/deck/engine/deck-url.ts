/**
 * The deck's address: the fragment `#/world-id/step-id` names one step of
 * one world. A world's first step is left off, so the world's own link is
 * `#/world-id`.
 */
import { clampPosition, type Position } from "./deck-state";

/** The worlds' ids and each one's step ids, in order: all the address needs of the manifest. */
export type Outline = readonly { id: string; steps: readonly string[] }[];

/** The fragment for a position. */
export function formatHash(outline: Outline, position: Position): string {
  const world = outline[position.world];
  const step = world?.steps[position.step];
  if (!world || step === undefined) return "";
  return position.step > 0 ? `#/${world.id}/${step}` : `#/${world.id}`;
}

/**
 * The position a fragment names, or null when it names no world. A step
 * that is not one of the world's opens the world at its start, and a plain
 * number is read as the step's place in the world, so an old or hand-typed
 * link still lands somewhere sensible.
 */
export function parseHash(hash: string, outline: Outline): Position | null {
  const match = /^#?\/([^/]+)(?:\/([^/]*))?\/?$/.exec(hash);
  if (!match) return null;
  let id: string;
  let stepId: string;
  try {
    id = decodeURIComponent(match[1]);
    stepId = decodeURIComponent(match[2] ?? "");
  } catch {
    return null;
  }
  const world = outline.findIndex((entry) => entry.id === id);
  if (world < 0) return null;
  const named = outline[world].steps.indexOf(stepId);
  const step = named >= 0 ? named : /^\d+$/.test(stepId) ? Number(stepId) : 0;
  return clampPosition(
    outline.map((entry) => entry.steps.length),
    { world, step },
  );
}
