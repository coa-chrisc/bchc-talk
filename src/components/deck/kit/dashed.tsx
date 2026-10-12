/**
 * Dashed marks: an outline, with or without a short stub, that says "a
 * sample" or "not real yet". A dashed stroke cannot draw on by its dash
 * offset, so each is an HTML part holding its own small SVG, and arrives by
 * its clip (`wipe`) or simply shows. `tone` is paper on the night ground, or night ink on a
 * paper-mounted picture, or a role's colour (palette.ts `HUES`).
 */
import type { ReactNode } from "react";
import { isHue, type Hue } from "./palette";
import type { Box } from "./tokens";

type Tone = "paper" | "soft" | "ink" | Hue;

const PAD = 4;

/**
 * A dashed outline round a box. Children are set inside it, centered: a
 * label, a name. `stub` is a dashed line that long out of the middle of its
 * right side, toward what the box would serve; box and stub are one part, so
 * a wipe from the left crosses the box and then runs out along the stub.
 */
export function Dashed({ id, at, rx = 6, tone = "paper", stub = 0, children }: { id: string; at: Box; rx?: number; tone?: Tone; stub?: number; children?: ReactNode }) {
  const w = at.w + 2 * PAD + stub;
  const h = at.h + 2 * PAD;
  return (
    <div className={isHue(tone) ? "dk-dashed dk-wipe" : `dk-dashed dk-dashed--${tone} dk-wipe`} data-build={id} data-hue={isHue(tone) ? tone : undefined} style={{ left: at.x - PAD, top: at.y - PAD, width: w, height: h, paddingRight: stub }}>
      <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} aria-hidden="true">
        <rect x={PAD} y={PAD} width={at.w} height={at.h} rx={rx} />
        {stub > 0 && <path d={`M${PAD + at.w} ${h / 2}H${w}`} />}
      </svg>
      {children}
    </div>
  );
}

/** A word in a dashed outline, set in the run of a line: the "Sample" tag. Its size is fixed, so the outline never depends on a measured width. */
export function Tag({ w, h = 44, children }: { w: number; h?: number; children: ReactNode }) {
  return (
    <span className="dk-tag dk-dashed--soft" style={{ width: w, height: h }}>
      <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} aria-hidden="true">
        <rect x={1.5} y={1.5} width={w - 3} height={h - 3} rx={6} />
      </svg>
      {children}
    </span>
  );
}
