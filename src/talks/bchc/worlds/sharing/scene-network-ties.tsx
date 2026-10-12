/** Slide 27's second click on the stage (layout-network-ties.ts): the faint dashed copies the lines out leave, each department's heavy line, the squares and the dollar signs, the tool's copies, and the three labels. */
"use client";

import type { CSSProperties } from "react";
import { Part, place } from "@/components/deck/kit";
import { driven } from "@/components/deck/kit/driven";
import { LINKS, TOOL, WEIGHT, dollarPath } from "./layout-network-ties";
import { Corner, Label } from "./scene-parts";

const L = LINKS;
const heavy = { strokeWidth: `${WEIGHT}px` };
const faint = { strokeWidth: `${WEIGHT / 2}px` };
const DOLLAR = dollarPath();

/** A dollar sign's driven `along`: sets it at that fraction of its path's length, centred on the line (the kit's `ride` tweens it). */
const sliding = () =>
  driven<SVGGElement>("along", 0, (group, k) => {
    const path = group.firstElementChild as SVGPathElement;
    const sign = group.lastElementChild as SVGGElement;
    const point = path.getPointAtLength(path.getTotalLength() * Math.min(1, Math.max(0, k)));
    sign.setAttribute("transform", `translate(${point.x.toFixed(1)} ${point.y.toFixed(1)})`);
  });

/** The faint dashed copy each line out leaves where it ran, at half the heavy weight. Under the spokes and the heavy lines. */
export function Ghosts() {
  return L.ties.map((tie) => (
    <g key={tie.was.key} className="sh-ghost" data-build={tie.was.key}>
      <path d={tie.was.d} style={faint} />
    </g>
  ));
}

/** Each department's heavy line, one path from its square through its circle to the middle, shown as a window along it (`--tail` to `--head`). Over the spokes and under the squares, the circles and the middle, so a circle hides the piece through it. */
export function Lines() {
  return L.ties.map((tie) => (
    <g key={tie.line.key} className="sh-tie" data-build={tie.line.key}>
      <path d={tie.line.d} pathLength={1} style={heavy} />
    </g>
  ));
}

/** The vendor squares, over the ends of the lines out, and the dollar signs that slide along those lines toward them. */
export function Squares() {
  return (
    <>
      {L.ties.map((tie) => (
        <rect key={tie.square.key} className="sh-vendor" data-build={tie.square.key} x={tie.square.at.x} y={tie.square.at.y} width={tie.square.at.w} height={tie.square.at.h} rx={3} />
      ))}
      {L.ties.map((tie) => (
        <g key={tie.money.key} ref={sliding()} className="sh-money" data-build={tie.money.key}>
          <path d={tie.money.d} fill="none" />
          <g transform={`translate(${tie.money.curve[0].x} ${tie.money.curve[0].y})`}>
            <path className="sh-money__ground" d={DOLLAR} />
            <path className="sh-money__sign" d={DOLLAR} />
          </g>
        </g>
      ))}
    </>
  );
}

/** The tool's three copies, each a tile in the catalog's indigo the tool's size, with the dashed corner of an adapted tool (slides 23 to 25), carried by `--x` and `--y` to where it settles. */
export function Copies() {
  const { side, rx, corner } = TOOL;
  return L.copies.map((copy) => (
    <Part key={copy.key} id={copy.key} origin={copy.dock}>
      <g className="dk-tile" data-hue="catalog">
        <rect className="dk-tile__fill" x={copy.at.x} y={copy.at.y} width={side} height={side} rx={rx} />
      </g>
      <Corner right={copy.at.x + side} top={copy.at.y} size={corner} />
    </Part>
  ));
}

/** The squares' label beside one square, and the label on each of the first department's two lines, set along it: a box turned to the line's angle, its words rising in it. */
export function TieLabels() {
  const { vendors, before, now } = L;
  return (
    <>
      <Label id={vendors.key} at={vendors.at} align="right">
        {vendors.text}
      </Label>
      {[before, now].map((label) => (
        <div key={label.key} className="sh-along" style={{ ...place(label.at), "--turn": `${label.angle}deg` } as CSSProperties}>
          <span className="sh-along__words sh-word" data-build={label.key}>
            {label.text}
          </span>
        </div>
      ))}
    </>
  );
}
