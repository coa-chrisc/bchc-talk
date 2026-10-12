/**
 * Moves one world. `set` puts every part and the camera at a step's picture
 * with no tween; `play` tweens one step's moves from the picture before it,
 * then sets the step's picture outright, so what is left on the stage after
 * a build is the same values a cut would have written. Nothing here reads
 * the page to decide a value.
 */
import { STAGE } from "../kit/tokens";
import { blend, planeTransform, type Camera } from "./camera";
import { compile } from "./compile";
import { gsap } from "./gsap";
import type { WorldDef } from "./types";

export type Driver = ReturnType<typeof createDriver>;

export function createDriver(root: HTMLElement, world: WorldDef) {
  const compiled = compile(world);
  const plane = root.querySelector<HTMLElement>("[data-plane]");
  const size = world.plane ?? STAGE;
  const targets = new Map(compiled.keys.map((key) => [key, Array.from(root.querySelectorAll(`[data-build="${key}"]`))]));
  let finish: (() => void) | null = null;
  /**
   * Everything the running build started, the call that lands it included.
   * Each is killed whole: killing by target (`gsap.killTweensOf`) with any
   * list but the tween's own goes property by property, and GSAP 3.15's
   * CSSPlugin cannot find a custom property (`--wb`) that way, so the tween
   * would run on over the picture a cut had just set.
   */
  let running: gsap.core.Animation[] = [];

  /** Stops a build where it is, with the call that would have landed it. */
  const halt = () => {
    finish = null;
    for (const animation of running) animation.kill();
    running = [];
  };

  const aim = (camera: Camera) => {
    if (!plane) return;
    const { x, y, scale } = planeTransform(camera, size, STAGE);
    gsap.set(plane, { x, y, scale });
  };

  /** The picture at a step, at once. Step -1 is the world before it arrives. */
  function set(step: number) {
    halt();
    for (const key of compiled.keys) gsap.set(targets.get(key)!, compiled.states[step + 1][key]);
    aim(compiled.cameras[step + 1]);
  }

  const lens = { k: 0 };

  /** Tweens onto a step from the one before it, `wait` seconds from now, and calls `done` when it has landed. */
  function play(step: number, done: () => void, wait = 0) {
    set(step - 1);
    let end = 0;
    for (const move of compiled.plays[step]) {
      const at = wait + move.at;
      if ("camera" in move) {
        const { from, camera } = move;
        running.push(gsap.fromTo(lens, { k: 0 }, { k: 1, duration: move.duration, ease: move.ease, delay: at, immediateRender: false, onUpdate: () => aim(blend(from, camera, lens.k)) }));
        end = Math.max(end, at + move.duration);
      } else {
        const elements = targets.get(move.key)!;
        running.push(gsap.to(elements, { ...move.on, duration: move.duration, ease: move.ease, delay: at, stagger: move.stagger, overwrite: "auto" }));
        end = Math.max(end, at + move.duration + move.stagger * Math.max(0, elements.length - 1));
      }
    }
    const land = () => {
      set(step);
      done();
    };
    running.push(gsap.delayedCall(end, land));
    finish = land;
  }

  return {
    set,
    play,
    /** Whether a build is still running. */
    playing: () => finish !== null,
    /** Lands a running build on its picture now. */
    settle: () => finish?.(),
    /** Parts a move names that the scene does not have. */
    missing: compiled.keys.filter((key) => targets.get(key)!.length === 0).map((key) => `${world.id}: ${key}`),
    /** How many steps there are. */
    steps: world.steps.length,
    kill: halt,
  };
}
