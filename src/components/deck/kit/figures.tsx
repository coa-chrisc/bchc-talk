/**
 * More marks: a person, a target ring, a bracket, a flag, a quote rule, and
 * the night-ink marks for drawing on a paper-mounted artefact. All are SVG
 * for a plane's `marks` (or its `over`, for ink on a picture), and all take
 * an `id` a move can name. Dashed things cannot stroke-draw, so they are
 * HTML parts that wipe on (dashed.tsx).
 */
import type { Box, Point } from "./tokens";

/** A person: a stroked head and shoulders in paper, drawn on (`draw`). Never coral: that is the human mark's. */
export function Person({ id, at }: { id: string; at: Box }) {
  const cx = at.x + at.w / 2;
  const r = at.w * 0.25;
  const head = at.y + r + 2;
  const top = head + r + at.h * 0.1;
  const bottom = at.y + at.h - 2;
  return (
    <g className="dk-person" data-build={id}>
      <circle className="dk-draw" cx={cx} cy={head} r={r} pathLength={1} transform={`rotate(-90 ${cx} ${head})`} />
      <path className="dk-draw" d={`M${at.x + 2} ${bottom}V${top + at.w * 0.42}A${at.w / 2 - 2} ${at.w * 0.42} 0 0 1 ${at.x + at.w - 2} ${top + at.w * 0.42}V${bottom}`} pathLength={1} />
    </g>
  );
}

/** A target: a hollow ring (`show`) that can fill solid (`fill`). With `tick`, the solid ring carries a night-ink tick, so one that answered differs from one that did not by shape, not only by fill. Move it with `x` and `y`. */
export function Ring({ id, at, r = 10, tick = false }: { id: string; at: Point; r?: number; tick?: boolean }) {
  const k = r / 18;
  return (
    <g className="dk-ring" data-build={id}>
      <circle className="dk-ring__solid" cx={at.x} cy={at.y} r={r} />
      <circle className="dk-ring__edge" cx={at.x} cy={at.y} r={r} />
      {tick && <path className="dk-ring__tick" d={`M${at.x - 8 * k} ${at.y + 0.5 * k}L${at.x - 2.5 * k} ${at.y + 6 * k}L${at.x + 8 * k} ${at.y - 6 * k}`} />}
    </g>
  );
}

/** The passed tick: a deep-green badge with a white tick, the one mark that means a check passed (`show`). */
export function PassTick({ id, at, r = 11 }: { id: string; at: Point; r?: number }) {
  const k = r / 11;
  return (
    <g className="dk-pass-tick" data-build={id}>
      <circle className="dk-pass-tick__badge" cx={at.x} cy={at.y} r={r} />
      <path className="dk-pass-tick__mark" d={`M${at.x - 5 * k} ${at.y + 0.5 * k}L${at.x - 1.5 * k} ${at.y + 4 * k}L${at.x + 5.5 * k} ${at.y - 4 * k}`} />
    </g>
  );
}

/** A bracket over a span: a rule with a short drop at each end (`draw`). */
export function Bracket({ id, x0, x1, y, drop = 12 }: { id: string; x0: number; x1: number; y: number; drop?: number }) {
  return <path className="dk-rule dk-draw" data-build={id} d={`M${x0} ${y + drop}V${y}H${x1}V${y + drop}`} pathLength={1} />;
}

/** A flag: a pole and a pennant, drawn on (`draw`), or there whole from the start (`drawn`) to be shown. `at` is the foot of the pole. */
export function Flag({ id, at, size = 28, drawn = false }: { id: string; at: Point; size?: number; drawn?: boolean }) {
  const top = at.y - size;
  return (
    <path
      className={drawn ? "dk-flag" : "dk-flag dk-draw"}
      data-build={id}
      d={`M${at.x} ${at.y}V${top}L${at.x + size * 0.78} ${top + size * 0.26}L${at.x} ${top + size * 0.52}`}
      pathLength={1}
    />
  );
}

/** The rule down the left of a quotation (`draw`, top to bottom). */
export function QuoteRule({ id, x, y0, y1 }: { id: string; x: number; y0: number; y1: number }) {
  return <path className="dk-rule dk-draw" data-build={id} d={`M${x} ${y0}V${y1}`} pathLength={1} />;
}

/** A rule with ticks along it that draws left to right (`draw` its id; `show` each tick, `id.t0` and on). */
export function TickRule({ id, x0, x1, y, ticks, tick = 16 }: { id: string; x0: number; x1: number; y: number; ticks: number; tick?: number }) {
  return (
    <g>
      <path className="dk-rule dk-draw" data-build={id} d={`M${x0} ${y}H${x1}`} pathLength={1} />
      {tickXs(x0, x1, ticks).map((x, i) => (
        <path key={i} className="dk-rule" data-build={`${id}.t${i}`} d={`M${x} ${y - tick / 2}V${y + tick / 2}`} />
      ))}
    </g>
  );
}

/** Where a TickRule's ticks sit: evenly spaced, the first a step in from the start and the last at the end. */
export const tickXs = (x0: number, x1: number, ticks: number) => Array.from({ length: ticks }, (_, i) => Math.round((x0 + ((i + 1) * (x1 - x0)) / ticks) * 10) / 10);

/** Night ink round a region of a paper-mounted picture: an outline that draws on clockwise from the top left (`draw`). */
export function InkRing({ id, at, rx = 8 }: { id: string; at: Box; rx?: number }) {
  return <rect className="dk-ink dk-draw" data-build={id} x={at.x} y={at.y} width={at.w} height={at.h} rx={rx} pathLength={1} />;
}

/** Night ink under a line of a paper-mounted picture (`draw`, left to right). */
export function InkUnderline({ id, x0, x1, y }: { id: string; x0: number; x1: number; y: number }) {
  return <path className="dk-ink dk-draw" data-build={id} d={`M${x0} ${y}H${x1}`} pathLength={1} />;
}
