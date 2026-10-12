/**
 * The persistent layer as one long world. Every step of the deck, in order,
 * becomes a step of the layer holding that step's `chrome` moves, so the
 * layer is compiled and driven exactly as a world is: a complete picture per
 * step, tweened to going forward and set outright on a cut. A step that
 * says nothing about the layer holds the picture before it.
 */
import { isCameraMove, type DeckDef, type WorldDef } from "./types";

export const CHROME_ID = "chrome";

/** The layer's world, or null for a deck without one. Its step `n` is the deck's step number `n + 1`. */
export function chromeWorld(deck: DeckDef): WorldDef | null {
  if (!deck.chrome) return null;
  const steps = deck.worlds.flatMap(({ world }) =>
    world.steps.map((step) => {
      const moves = step.chrome ?? [];
      if (moves.some(isCameraMove)) throw new Error(`${world.id}/${step.id}: the persistent layer has no camera to move.`);
      return { id: `${world.id}/${step.id}`, moves };
    }),
  );
  return { id: CHROME_ID, Scene: deck.chrome.Scene, anchors: deck.chrome.anchors, steps };
}
