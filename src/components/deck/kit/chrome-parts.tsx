/**
 * The parts a deck's persistent layer is made of: a time rule along the
 * top and a ledger of running totals. Each is a pure
 * picture of the values the engine writes to it, so the layer at a step is
 * the same however the step was reached.
 */
"use client";

import { driven } from "./driven";
import type { TimeRuleLayout } from "./time-rule-layout";

const TICK = 16;
const MARK = 24;

const lightMarks = driven<SVGGElement>("lit", 0, (group, lit) => {
  const upTo = Math.round(lit);
  Array.from(group.children).forEach((mark, i) => mark.setAttribute("opacity", i < upTo ? "1" : "0"));
});

/**
 * The time rule (time-rule-layout.ts), as SVG for a plane's marks. The build
 * stretch and the run draw on (`draw`), the ticks show (`show`), and the
 * marks light in order (`light` on the layout's `marksKey`).
 */
export function TimeRule({ layout }: { layout: TimeRuleLayout }) {
  const { y, build, run } = layout;
  const tick = (x: number) => `M${x} ${y - TICK / 2}V${y + TICK / 2}`;
  return (
    <g className="dk-time">
      <path className="dk-rule dk-draw" data-build={run.key} d={`M${run.x0} ${y}H${run.x1}`} pathLength={1} />
      {layout.weeks.map((week) => (
        <path key={week.key} className="dk-rule" data-build={week.key} d={tick(week.x)} />
      ))}
      <path className="dk-time__build dk-draw" data-build={build.key} d={`M${build.x0} ${y}H${build.x1}`} pathLength={1} />
      <path className="dk-time__built" data-build={build.tickKey} d={tick(build.x1)} />
      <g ref={lightMarks} data-build={layout.marksKey}>
        {layout.marks.map((x, i) => (
          <path key={i} className="dk-time__mark" d={`M${x} ${y - MARK / 2}V${y + MARK / 2}`} />
        ))}
      </g>
    </g>
  );
}

const number = new Intl.NumberFormat("en-US");
const tally = driven<HTMLSpanElement>("count", 0, (span, value) => {
  const total = Math.round(value);
  span.textContent = number.format(total);
  span.toggleAttribute("data-zero", total === 0);
});

export type LedgerLine = { key: string; label: string; y: number };

/** The ids a ledger's parts take: its rule, each line, and each line's figure (which counts). */
export const ledgerKeys = (id: string, key: string) => ({ rule: `${id}.rule`, line: `${id}.${key}`, figure: `${id}.${key}.n` });

/**
 * A ledger's lines: a figure, right-aligned to `figureRight`, and its label
 * beside it. Each line arrives as one part (`rise`); its figure counts
 * (`to` its `count`), and is drawn faint for as long as it reads 0. The rule
 * beside them is the scene's to draw.
 */
export function Ledger({ id, lines, figureRight, labelX }: { id: string; lines: readonly LedgerLine[]; figureRight: number; labelX: number }) {
  const width = 200;
  return lines.map((line) => {
    const keys = ledgerKeys(id, line.key);
    return (
      <p key={line.key} className="dk-ledger" data-build={keys.line} style={{ left: figureRight - width, top: line.y }}>
        <span ref={tally} className="dk-figure" data-build={keys.figure} style={{ width }} />
        <span className="dk-label" style={{ marginLeft: labelX - figureRight }}>
          {line.label}
        </span>
      </p>
    );
  });
}
