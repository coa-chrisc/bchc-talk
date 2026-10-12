/**
 * The smaller marks: a node, a connector between two places, a packet that
 * travels one, a glyph that rides a line, a gate that opens, the human mark
 * and an annotation. All are
 * SVG for a plane's `marks`, and all take an `id` a move can name.
 */
"use client";

import { driven } from "./driven";
import { route, type Axis } from "./geometry";
import { isHue, type Hue } from "./palette";
import type { Box, Point } from "./tokens";

type NodeProps = { id: string; at: Box; label: string; sub?: string };

/** A named thing: a system, a file, a place work passes through. */
export function Node({ id, at, label, sub }: NodeProps) {
  const cy = at.y + at.h / 2;
  return (
    <g className="dk-node" data-build={id}>
      <rect className="dk-node__box" x={at.x} y={at.y} width={at.w} height={at.h} rx={12} />
      <text className="dk-text" x={at.x + at.w / 2} y={sub ? cy - 18 : cy} textAnchor="middle" dominantBaseline="central">
        {label}
      </text>
      {sub && (
        <text className="dk-label" x={at.x + at.w / 2} y={cy + 24} textAnchor="middle" dominantBaseline="central">
          {sub}
        </text>
      )}
    </g>
  );
}

type ConnectorProps = { id: string; from: Box; to: Box; axis?: Axis };

/** What a line is drawn in: rule, full paper, or a role's colour (palette.ts `HUES`). */
export type LineTone = "rule" | "paper" | Hue;

/**
 * A line from one place to another that draws on (`draw`), ending in an
 * arrowhead. The arrowhead says something travels that way; a leader that
 * only joins a label to what it names goes without (`head={false}`). In
 * full paper (`tone="paper"`) it is a line something came back along; in a
 * role (`tone="catalog"`) it is that role's line, in its colour.
 */
export function Connector({ id, from, to, axis = "h", head = true, tone = "rule" }: ConnectorProps & { head?: boolean; tone?: LineTone }) {
  const path = route(from, to, axis);
  return (
    <g className={tone === "paper" ? "dk-connector dk-connector--paper" : "dk-connector"} data-build={id} data-hue={isHue(tone) ? tone : undefined}>
      <path className="dk-rule dk-draw" d={path.d} pathLength={1} />
      {head && <path className="dk-connector__head" d="M-14 -9L0 0L-14 9" transform={`translate(${path.end.x} ${path.end.y}) rotate(${path.heading})`} />}
    </g>
  );
}

/** A straight line from one point to another that draws on (`draw`), in rule, full paper or a role's colour. */
export function Line({ id, from, to, tone = "rule" }: { id: string; from: Point; to: Point; tone?: LineTone }) {
  return (
    <path
      className={tone === "paper" ? "dk-rule dk-line--paper dk-draw" : "dk-rule dk-draw"}
      data-build={id}
      data-hue={isHue(tone) ? tone : undefined}
      d={`M${from.x} ${from.y}L${to.x} ${to.y}`}
      pathLength={1}
    />
  );
}

/** One place feeding several: a connector to each, ids `id.0`, `id.1` and on. Given a start for each, the lines leave side by side and read as that many lines, not one trunk. */
export function FanOut({ id, from, to, axis = "h" }: { id: string; from: Box | readonly Box[]; to: readonly Box[]; axis?: Axis }) {
  return to.map((target, i) => <Connector key={i} id={`${id}.${i}`} from={"x" in from ? from : from[i]} to={target} axis={axis} />);
}

/** The ids a FanOut's connectors take, for `draw`. */
export const fanKeys = (id: string, count: number) => Array.from({ length: count }, (_, i) => `${id}.${i}`);

const travel = driven<SVGGElement>("along", 0, (group, k) => {
  const path = group.firstElementChild as SVGPathElement;
  const dot = group.lastElementChild as SVGCircleElement;
  const point = path.getPointAtLength(path.getTotalLength() * Math.min(1, Math.max(0, k)));
  dot.setAttribute("cx", point.x.toFixed(1));
  dot.setAttribute("cy", point.y.toFixed(1));
  // Out of sight at both ends of the trip, so it never sits on a node.
  dot.setAttribute("opacity", String(Math.min(1, Math.min(k, 1 - k) * 12)));
});

/** A thing moving along a connector's route (`send`). For one item's journey; not a default decoration. */
export function Packet({ id, from, to, axis = "h" }: ConnectorProps) {
  return (
    <g ref={travel} data-build={id}>
      <path d={route(from, to, axis).d} fill="none" />
      <circle className="dk-packet" r={11} />
    </g>
  );
}

/** How far above its path's point a Rider sits, in stage pixels: clear of the stroke on any gentle slope. */
export const RIDE_ABOVE = 26;

/** A Rider's driven `along`: sets its text at that fraction of the path's length, `RIDE_ABOVE` over the point. Its visibility is its own `autoAlpha`. */
export const riding = () =>
  driven<SVGGElement>("along", 0, (group, k) => {
    const path = group.firstElementChild as SVGPathElement;
    const text = group.lastElementChild as SVGTextElement;
    const point = path.getPointAtLength(path.getTotalLength() * Math.min(1, Math.max(0, k)));
    text.setAttribute("x", point.x.toFixed(1));
    text.setAttribute("y", (point.y - RIDE_ABOVE).toFixed(1));
  });

/**
 * A glyph riding the front of a line as it comes on (`ride`): slide 28's
 * dollar sign on the falling line. Placed by a driven `along` on the line's
 * own path `d`, in stage pixels, so a cut and a build land it on the same
 * point. Paper, never coral: it is money, not a decision.
 */
export function Rider({ id, d, text }: { id: string; d: string; text: string }) {
  return (
    <g ref={riding()} className="dk-rider" data-build={id}>
      <path d={d} fill="none" />
      <text className="dk-rider__text" textAnchor="middle" dominantBaseline="central">
        {text}
      </text>
    </g>
  );
}

/** A gate across a line: two bars that part when it opens (`open`). */
export function Gate({ id, at, size = 64 }: { id: string; at: Point; size?: number }) {
  return (
    <g className="dk-gate" data-build={id}>
      <path className="dk-gate__bar dk-gate__bar--a" d={`M${at.x} ${at.y - size / 2}V${at.y}`} />
      <path className="dk-gate__bar dk-gate__bar--b" d={`M${at.x} ${at.y}V${at.y + size / 2}`} />
    </g>
  );
}

/**
 * The human mark: the one place the deck uses coral. It means a person
 * decided here, and nothing else on the stage may take the colour (`mark`).
 */
export function HumanMark({ id, at, label, side = "right" }: { id: string; at: Point; label?: string; side?: "left" | "right" }) {
  return (
    <g className="dk-human" data-build={id}>
      <circle className="dk-human__ring dk-draw" cx={at.x} cy={at.y} r={24} pathLength={1} transform={`rotate(-90 ${at.x} ${at.y})`} />
      <circle className="dk-human__dot" cx={at.x} cy={at.y} r={9} />
      {label && (
        <text className="dk-label dk-human__label" x={at.x + (side === "right" ? 44 : -44)} y={at.y} textAnchor={side === "right" ? "start" : "end"} dominantBaseline="central">
          {label}
        </text>
      )}
    </g>
  );
}

type AnnotationProps = { id: string; region: Box; label: string; side?: "above" | "below" | "left" | "right"; reach?: number };

/** A note on the picture: an outline round a region, a leader line out of it, and a label at the end (`annotate`). */
export function Annotation({ id, region, label, side = "below", reach = 90 }: AnnotationProps) {
  const pad = 14;
  const r = { x: region.x - pad, y: region.y - pad, w: region.w + 2 * pad, h: region.h + 2 * pad };
  const cx = r.x + r.w / 2;
  const cy = r.y + r.h / 2;
  const leader: { d: string; x: number; y: number; anchor: "start" | "middle" | "end" } = (
    {
    above: { d: `M${cx} ${r.y}v${-reach}`, x: cx, y: r.y - reach - 26, anchor: "middle" },
    below: { d: `M${cx} ${r.y + r.h}v${reach}`, x: cx, y: r.y + r.h + reach + 30, anchor: "middle" },
    left: { d: `M${r.x} ${cy}h${-reach}`, x: r.x - reach - 18, y: cy, anchor: "end" },
    right: { d: `M${r.x + r.w} ${cy}h${reach}`, x: r.x + r.w + reach + 18, y: cy, anchor: "start" },
    } as const
  )[side];
  return (
    <g className="dk-note" data-build={id}>
      <rect className="dk-note__region dk-draw" x={r.x} y={r.y} width={r.w} height={r.h} rx={10} pathLength={1} />
      <path className="dk-note__leader" d={leader.d} pathLength={1} />
      <text className="dk-label dk-note__label" x={leader.x} y={leader.y} textAnchor={leader.anchor} dominantBaseline="central">
        {label}
      </text>
    </g>
  );
}
