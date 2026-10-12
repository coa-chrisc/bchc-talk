/**
 * The start world's own small drawings, for the things the kit has no part
 * for: a tool (a screen outline with a top bar), a sheet of public
 * information, a request slip in a queue, a service, a filled dot on the
 * path, a piece of a tool being built, and a form's question. Each is SVG
 * for the plane's marks, drawn with the house moves only: `draw` for an
 * outline, `fill` for what fills, and `x`/`y` for travel. Colours are navy,
 * slate and rule, or a role's colour (start.css): none of them is the
 * approving orange or the passing green. Slide 34 to 38's and 41 to 42's
 * own drawings are in parts-figures.tsx.
 */
import type { ReactNode } from "react";
import { Ring, type Box, type Hue, type Point } from "@/components/deck/kit";

/** How far a tool's top bar sits under its top edge. */
const BAR = 28;

/** A tool: a rounded screen outline with a top bar that draws on (`draw`), and a faint paper ground that fills (`fill`). */
export function Tool({ id, at, rx = 12 }: { id: string; at: Box; rx?: number }) {
  const bar = Math.min(BAR, at.h * 0.22);
  return (
    <g className="st-tool" data-build={id}>
      <rect className="st-tool__fill" x={at.x} y={at.y} width={at.w} height={at.h} rx={rx} />
      <rect className="st-tool__edge dk-draw" x={at.x} y={at.y} width={at.w} height={at.h} rx={rx} pathLength={1} />
      <path className="st-tool__edge dk-draw" d={`M${at.x} ${at.y + bar}H${at.x + at.w}`} pathLength={1} />
    </g>
  );
}

export type SheetKind = "list" | "clock" | "checks";

/** A sheet of public information, set down at `at` (its top left corner): a list, a clock face, or a row of checkboxes. Moves with `x` and `y`. */
export function Sheet({ id, at, kind, w = 80, h = 100 }: { id: string; at: Point; kind: SheetKind; w?: number; h?: number }) {
  const { x, y } = at;
  return (
    <g className="st-sheet" data-build={id}>
      <rect className="st-sheet__page" x={x} y={y} width={w} height={h} rx={6} />
      {kind === "list" && [0, 1, 2, 3].map((i) => <path key={i} className="st-sheet__ink" d={`M${x + 14} ${y + 24 + i * 18}H${x + w - (i % 2 ? 26 : 14)}`} />)}
      {kind === "clock" && (
        <>
          <circle className="st-sheet__ink" cx={x + w / 2} cy={y + h / 2 - 6} r={22} />
          <path className="st-sheet__ink" d={`M${x + w / 2} ${y + h / 2 - 20}V${y + h / 2 - 6}H${x + w / 2 + 12}`} />
          <path className="st-sheet__ink" d={`M${x + 14} ${y + h - 16}H${x + w - 14}`} />
        </>
      )}
      {kind === "checks" &&
        [0, 1, 2].map((i) => (
          <g key={i}>
            <rect className="st-sheet__ink" x={x + 12} y={y + 18 + i * 26} width={14} height={14} rx={2} />
            <path className="st-sheet__ink" d={`M${x + 34} ${y + 25 + i * 26}H${x + w - 12}`} />
          </g>
        ))}
    </g>
  );
}

/** A request waiting in a queue: a small slip with one line of writing on it. */
export function Slip({ id, at }: { id: string; at: Box }) {
  return (
    <g className="st-slip" data-build={id}>
      <rect className="st-slip__edge" x={at.x} y={at.y} width={at.w} height={at.h} rx={4} />
      <path className="st-slip__edge" d={`M${at.x + 9} ${at.y + at.h / 2}H${at.x + at.w - 9}`} />
    </g>
  );
}

/** A service: a box with no words that fills with paper when people reach it (`fill`). */
export function Service({ id, at }: { id: string; at: Box }) {
  return (
    <g className="st-service" data-build={id}>
      <rect className="dk-node__box" x={at.x} y={at.y} width={at.w} height={at.h} rx={10} />
      <rect className="st-service__fill" x={at.x} y={at.y} width={at.w} height={at.h} rx={10} />
    </g>
  );
}

/** A project on the path: a paper dot that scales in from its centre (`fill`). */
export function Dot({ id, at, r = 12 }: { id: string; at: Point; r?: number }) {
  return <circle className="st-dot" data-build={id} cx={at.x} cy={at.y} r={r} />;
}

/** A plain rule that draws on from its first point to its last (`draw`). With a `hue` (`data-hue`) it is drawn in that role's colour. */
export function Line({ id, from, to, tone = "rule", hue }: { id: string; from: Point; to: Point; tone?: "rule" | "paper"; hue?: Hue }) {
  return <path className={tone === "paper" ? "st-line--paper dk-draw" : "dk-rule dk-draw"} data-build={id} data-hue={hue} d={`M${from.x} ${from.y}L${to.x} ${to.y}`} pathLength={1} />;
}

/** A piece of a tool being built: a paper bar that a person places, travelling from their hands into the tool (`x`, `y`). */
export function Piece({ id, at }: { id: string; at: Box }) {
  return <rect className="st-piece" data-build={id} x={at.x} y={at.y} width={at.w} height={at.h} rx={at.h / 2} />;
}

/** A short name set beside or under what it names, in the label face and in navy (`rise` or `show`; it travels with `x` and `y`). */
export function Label({ id, at, text, anchor = "middle" }: { id: string; at: Point; text: string; anchor?: "start" | "middle" }) {
  return (
    <text className="dk-label st-name" data-build={id} x={at.x} y={at.y} textAnchor={anchor} dominantBaseline="central">
      {text}
    </text>
  );
}

/** A form's question, drawn: a field outline with a radio at its left and a bar of writing. The radio (`radio`) fills when it is answered. */
export function Field({ id, at, radio }: { id: string; at: Box; radio: { id: string; at: Point } }) {
  const cy = at.y + at.h / 2;
  return (
    <g data-build={id}>
      <rect className="st-slip__edge" x={at.x} y={at.y} width={at.w} height={at.h} rx={10} />
      <path className="st-sheet__ink" d={`M${radio.at.x + 32} ${cy}H${at.x + at.w - 28}`} />
      <Ring id={radio.id} at={radio.at} r={12} />
    </g>
  );
}

/** A step label over a title: one line in the label face, in a mask it rises out of the way a title's lines do (`lines`). */
export function Kicker({ id, at, text }: { id: string; at: Point; text: string }) {
  return (
    <p className="dk-set st-kicker" style={{ left: at.x, top: at.y }}>
      <span className="dk-set__mask">
        <span className="dk-set__line" data-build={id}>
          {text}
        </span>
      </span>
    </p>
  );
}

/** A picture's HTML as one part: what a step hides when the picture is done with. It covers the plane and places nothing itself. */
export function Layer({ id, children }: { id: string; children?: ReactNode }) {
  return (
    <div className="st-layer" data-build={id}>
      {children}
    </div>
  );
}
