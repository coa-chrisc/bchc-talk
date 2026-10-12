/**
 * A world's camera, as pure numbers. The camera looks at a point on the
 * world's plane (`fx` and `fy`, as fractions of the plane's size) and shows
 * it in the middle of the stage at `scale`. Moves between two framings run
 * the scale on a log scale and carry the focus with the window's size, as
 * the fleet film's camera does (control-room/fleet-director.ts), so a pull
 * back reads as one steady zoom, not a pan and a zoom fighting each other.
 */

export type Camera = { fx: number; fy: number; scale: number };

export type Size = { w: number; h: number };

type Rect = { x: number; y: number; w: number; h: number };

/** The whole plane, centred, at its own size. */
export const HOME: Camera = { fx: 0.5, fy: 0.5, scale: 1 };

/** The framing `k` of the way from `a` to `b`. */
export function blend(a: Camera, b: Camera, k: number): Camera {
  if (k <= 0) return a;
  if (k >= 1) return b;
  const scale = Math.exp(Math.log(a.scale) + (Math.log(b.scale) - Math.log(a.scale)) * k);
  const span = 1 / b.scale - 1 / a.scale;
  const w = Math.abs(span) < 1e-6 ? k : (1 / scale - 1 / a.scale) / span;
  return { fx: a.fx + (b.fx - a.fx) * w, fy: a.fy + (b.fy - a.fy) * w, scale };
}

/**
 * The camera that fits a box on the plane inside the stage, with `pad`
 * stage pixels clear around it. `max` caps the zoom, so a small box is not
 * blown up past the point its text stays comfortable.
 */
export function frame(plane: Size, stage: Size, target: Rect, pad = 120, max = 4): Camera {
  const scale = Math.min(max, (stage.w - 2 * pad) / target.w, (stage.h - 2 * pad) / target.h);
  return { fx: (target.x + target.w / 2) / plane.w, fy: (target.y + target.h / 2) / plane.h, scale };
}

/** Where the plane's top left corner sits on the stage, and its scale: the plane's transform. */
export function planeTransform(camera: Camera, plane: Size, stage: Size): { x: number; y: number; scale: number } {
  return {
    x: stage.w / 2 - camera.fx * plane.w * camera.scale,
    y: stage.h / 2 - camera.fy * plane.h * camera.scale,
    scale: camera.scale,
  };
}

export const sameCamera = (a: Camera, b: Camera) => a.fx === b.fx && a.fy === b.fy && a.scale === b.scale;
