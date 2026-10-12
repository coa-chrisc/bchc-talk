/**
 * 42's drawings, one a card, each acting out its request: a form with its
 * catalog tag and the tray it goes out into, a person whose hand goes up
 * (`open`, `--k`), the agent pack, and the empty chair an engineer comes to
 * sit in. A drawing in a role's colour says so with `data-hue`; its fill
 * goes from the idle tint to the active one as it lights (`fill`, `--k`).
 */
import type { CSSProperties } from "react";
import type { Box, Point } from "@/components/deck/kit";
import { Writing, personShape } from "./parts-figures";

/** The form: a page with its catalog tag across the top and three fields it is filled in with. It travels whole (`x`, `y`). */
export function Form({ id, at, tag, fields }: { id: string; at: Box; tag: Box; fields: { key: string; at: Box }[] }) {
  return (
    <g data-build={id}>
      <rect className="st-page" x={at.x} y={at.y} width={at.w} height={at.h} rx={6} />
      <rect className="st-ask__tag" data-hue="catalog" x={tag.x} y={tag.y} width={tag.w} height={tag.h} rx={6} />
      {fields.map((field) => (
        <Writing key={field.key} id={field.key} at={field.at} />
      ))}
    </g>
  );
}

/** An open tray, its mouth at the top: what goes out goes in here. */
export function Tray({ id, at }: { id: string; at: Box }) {
  return <path className="st-ask__tray" data-build={id} d={`M${at.x} ${at.y}V${at.y + at.h}H${at.x + at.w}V${at.y}`} />;
}

/**
 * A person putting their hand up, in the process's colour. Their arm pivots
 * inside their shoulder (`from`), tilted out (`tilt`, degrees); as `--k`
 * goes to 1 the hand rises from there up the arm's reach and the arm grows
 * behind it, and the person lights. A copy of the person in the card's
 * ground sits between, so the arm's root is hidden behind them.
 */
export function HandUp({ id, at, hand }: { id: string; at: Box; hand: { from: Point; reach: number; r: number; w: number; tilt: number } }) {
  const { from, reach, r, w, tilt } = hand;
  const origin = `${from.x}px ${from.y}px`;
  return (
    <g className="st-ask__lit" data-build={id} data-hue="process">
      <g transform={`rotate(${tilt} ${from.x} ${from.y})`}>
        <rect className="st-ask__arm" x={from.x - w / 2} y={from.y - reach + r} width={w} height={reach - r} rx={w / 2} vectorEffect="non-scaling-stroke" style={{ transformOrigin: origin }} />
        <circle className="st-ask__palm" cx={from.x} cy={from.y - reach} r={r} style={{ "--reach": `${reach}px` } as CSSProperties} />
      </g>
      <g className="st-ask__under">{personShape(at)}</g>
      {personShape(at)}
    </g>
  );
}

/** The agent pack: a case with a handle and a band, in the pack's colour, lit once it is in (`fill`). */
export function Pack({ id, at }: { id: string; at: Box }) {
  const { x, y, w, h } = at;
  const cx = x + w / 2;
  return (
    <g className="st-ask__lit" data-build={id} data-hue="share-pack">
      <path className="st-ask__handle" d={`M${cx - 22} ${y}V${y - 14}H${cx + 22}V${y}`} />
      <rect x={x} y={y} width={w} height={h} rx={10} />
      <path className="st-ask__band" d={`M${x} ${y + h * 0.42}H${x + w}`} />
    </g>
  );
}

/** The chair at the table, empty until the engineer sits in it: its back, drawn (`draw`). */
export function Chair({ id, at }: { id: string; at: Box }) {
  return <rect className="st-ask__chair dk-draw" data-build={id} x={at.x} y={at.y} width={at.w} height={at.h} rx={18} pathLength={1} />;
}

/** The engineer, in the colour of help getting set up: they come in (`x`) and light once seated (`fill`). */
export function Engineer({ id, at }: { id: string; at: Box }) {
  return (
    <g className="st-ask__lit st-ask__person" data-build={id} data-hue="share-help">
      {personShape(at)}
    </g>
  );
}
