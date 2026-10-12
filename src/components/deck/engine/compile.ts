/**
 * Turns a world's steps into pictures. The baseline is every part at the
 * first `off` a move gives it; the picture at a step is the baseline with
 * each move's `on` applied in order, up to and including that step. Both are
 * plain data worked out once, with no page and no clock, so cutting to a
 * step and tweening to it end on the same values by construction.
 */
import { HOME, type Camera } from "./camera";
import { isCameraMove, type Vars, type WorldDef } from "./types";

/** Seconds between one move and the next in a step, when a move does not say. */
export const BEAT = 0.13;

/** The house move: how long and on what curve, when a move does not say. */
export const HOUSE = { duration: 0.75, ease: "expo.out" } as const;

export type Play = {
  /** Seconds after the click. */
  at: number;
  duration: number;
  ease: string;
  stagger: number;
} & ({ key: string; on: Vars } | { camera: Camera; from: Camera });

export type Compiled = {
  /** Every part any move names, in the order first named. */
  keys: string[];
  /** `states[0]` is the baseline; `states[n + 1]` is the picture at step `n`. */
  states: Record<string, Vars>[];
  /** The camera, indexed the same way. */
  cameras: Camera[];
  /** What plays, by step, when the deck steps forward onto it. */
  plays: Play[][];
};

export function compile(world: WorldDef): Compiled {
  const baseline: Record<string, Vars> = {};
  for (const step of world.steps) {
    for (const move of step.moves) {
      if (isCameraMove(move)) continue;
      const part = (baseline[move.key] ??= {});
      for (const [prop, value] of Object.entries(move.off ?? {})) part[prop] ??= value;
      for (const prop of Object.keys(move.on)) {
        if (!(prop in part)) {
          throw new Error(`${world.id}/${step.id}: "${move.key}" moves "${prop}" with nothing to start from. Give the move an off value.`);
        }
      }
    }
  }

  const states = [baseline];
  const cameras = [world.camera ?? HOME];
  const plays: Play[][] = [];
  for (const step of world.steps) {
    const state = { ...states[states.length - 1] };
    let camera = cameras[cameras.length - 1];
    const stepPlays: Play[] = [];
    let last = -BEAT;
    for (const move of step.moves) {
      const start = move.at ?? (move.with ? Math.max(0, last) : last + BEAT);
      last = start;
      const at = start + (move.lag ?? 0);
      const timing = { at, duration: move.duration ?? HOUSE.duration, ease: move.ease ?? HOUSE.ease, stagger: move.stagger ?? 0 };
      if (isCameraMove(move)) {
        stepPlays.push({ ...timing, camera: move.camera, from: camera });
        camera = move.camera;
      } else {
        state[move.key] = { ...state[move.key], ...move.on };
        stepPlays.push({ ...timing, key: move.key, on: move.on });
      }
    }
    states.push(state);
    cameras.push(camera);
    plays.push(stepPlays);
  }
  return { keys: Object.keys(baseline), states, cameras, plays };
}
