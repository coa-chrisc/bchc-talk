/**
 * Runs the worlds. Every world is mounted the whole time; one shows. A step
 * forward inside a world plays that step's build. A step forward into the
 * next world is a slow fade through the night ground and then the new
 * world's arrival. Everything else (back, a jump, reduced motion) is a cut:
 * the picture is set outright under a short fade. A cut never reverses a
 * tween, so going back is always exactly the picture that was there.
 *
 * The persistent layer (chrome.ts) is driven alongside: it plays its step
 * with the world's build, is set with every cut, and is never faded by a
 * world change, so what it holds stays on the stage from one world to the
 * next.
 */
import type { Position, Via } from "./deck-state";
import { createDriver } from "./driver";
import { gsap } from "./gsap";
import type { WorldDef } from "./types";

/** Seconds: a world fading out to night, and the next fading up. */
const LEAVE = 0.6;
const ARRIVE = 0.7;
/**
 * Seconds: the deck's first world fading up when the deck opens. Nothing is
 * handed over from a world before it, so it is short and through before the
 * first build has anything on the stage.
 */
export const OPENING_ARRIVE = 0.3;
/** Seconds: the fade a cut happens under. */
const CUT = 0.14;

export type Director = ReturnType<typeof createDirector>;

/** The persistent layer's element and its world (chrome.ts). */
export type ChromeStage = { root: HTMLElement; world: WorldDef };

/** `surfaces` are what a cut's short fade is put on: the worlds and, when there is one, the persistent layer. */
export function createDirector(frames: HTMLElement[], surfaces: HTMLElement[], worlds: WorldDef[], chrome?: ChromeStage) {
  const drivers = worlds.map((world, i) => createDriver(frames[i], world));
  const layer = chrome ? createDriver(chrome.root, chrome.world) : null;
  /** A position's step in the persistent layer: its place in the whole deck. */
  const layerStep = ({ world, step }: Position) => worlds.slice(0, world).reduce((sum, w) => sum + w.steps.length, 0) + step;
  let landing: Position | null = null;
  let onLand: (() => void) | undefined;

  const only = (world: number) => frames.forEach((frame, i) => gsap.set(frame, { autoAlpha: i === world ? 1 : 0 }));
  const still = () => gsap.killTweensOf([...surfaces, ...frames]);

  /** Plays a step's build in its world and in the persistent layer, and lands when both have. */
  function build(position: Position, wait = 0) {
    landing = position;
    let running = layer ? 2 : 1;
    const one = () => {
      if (--running === 0) land();
    };
    drivers[position.world].play(position.step, one, wait);
    layer?.play(layerStep(position), one, wait);
  }

  function land() {
    landing = null;
    const done = onLand;
    onLand = undefined;
    done?.();
  }

  /** The picture at a position, at once. */
  function place(position: Position) {
    still();
    drivers.forEach((driver, i) => (i === position.world ? driver.set(position.step) : driver.kill()));
    layer?.set(layerStep(position));
    only(position.world);
    gsap.set(surfaces, { opacity: 1 });
  }

  function cut(position: Position) {
    place(position);
    gsap.set(surfaces, { opacity: 0.25 });
    gsap.to(surfaces, { opacity: 1, duration: CUT, ease: "none" });
  }

  /** A world arriving: its first step plays from the world's baseline. */
  function arrive(position: Position, wait = 0, fade = ARRIVE) {
    drivers[position.world].set(-1);
    gsap.set(frames[position.world], { autoAlpha: 0 });
    gsap.to(frames[position.world], { autoAlpha: 1, duration: fade, ease: "power1.inOut", delay: wait });
    build(position, wait);
  }

  return {
    cut,
    place,
    /** Shows the deck's first picture: an arrival at a world's first step, a cut anywhere else. */
    open(position: Position, motion: boolean, done?: () => void) {
      if (!motion || position.step > 0) return cut(position);
      still();
      only(-1);
      gsap.set(surfaces, { opacity: 1 });
      onLand = done;
      arrive(position, 0, OPENING_ARRIVE);
    },
    /** Goes from one position to another. Only a single step forward plays. */
    go(from: Position, to: Position, via: Via, done?: () => void) {
      if (via !== "advance") return cut(to);
      onLand = done;
      if (to.world === from.world) return build(to);
      still();
      gsap.to(frames[from.world], { autoAlpha: 0, duration: LEAVE, ease: "power1.inOut" });
      arrive(to, LEAVE);
    },
    /** Whether a build or a world change is still running. */
    busy: () => landing !== null,
    /** Lands whatever is running on its finished picture, now. */
    settle() {
      if (!landing) return;
      const position = landing;
      place(position);
      land();
    },
    missing: () => [...drivers, ...(layer ? [layer] : [])].flatMap((driver) => driver.missing),
    kill() {
      still();
      drivers.forEach((driver) => driver.kill());
      layer?.kill();
      landing = null;
    },
  };
}
