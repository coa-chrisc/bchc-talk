/**
 * A world's plane: the surface its picture is laid out on, in stage pixels,
 * and the thing the camera moves. It can be larger than the stage. Marks
 * (boards, lines, labels) go in one SVG the size of the plane; set text and
 * pictures are HTML on top, placed in the same pixels. A second SVG, `over`,
 * sits above the HTML for marks drawn on a picture: ink round a region of a
 * screenshot.
 */
import type { ReactNode } from "react";
import type { Size } from "../engine/camera";
import { STAGE } from "./tokens";

type PlaneProps = { size?: Size; marks?: ReactNode; over?: ReactNode; children?: ReactNode };

export function Plane({ size = STAGE, marks, over, children }: PlaneProps) {
  return (
    <div className="dk-plane" data-plane style={{ width: size.w, height: size.h }}>
      <svg className="dk-marks" width={size.w} height={size.h} viewBox={`0 0 ${size.w} ${size.h}`} aria-hidden="true">
        {marks}
      </svg>
      {children}
      {over && (
        <svg className="dk-marks" width={size.w} height={size.h} viewBox={`0 0 ${size.w} ${size.h}`} aria-hidden="true">
          {over}
        </svg>
      )}
    </div>
  );
}

/**
 * Any marks as one part a move can name: to ghost them, hide them, or move
 * them together. Given an `origin` (a point on the plane), the part can also
 * be moved and scaled about that point with `--x`, `--y` and `--s`, which is
 * how `spread` carries one picture to its place in a grid.
 */
export function Part({ id, origin, children }: { id: string; origin?: { x: number; y: number }; children: ReactNode }) {
  return (
    <g data-build={id} className={origin ? "dk-move" : undefined} style={origin ? { transformOrigin: `${origin.x}px ${origin.y}px` } : undefined}>
      {children}
    </g>
  );
}

/** A ghost is a part that steps back to low alpha and is later removed: `ghost(id)`, then `hide(id)`. */
export const Ghost = Part;
