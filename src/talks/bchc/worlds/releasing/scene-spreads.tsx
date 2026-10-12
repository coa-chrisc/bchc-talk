/**
 * Slide 33a's stage (layout-spreads.ts): Austin's table, where slide 33's
 * table lands, the three ready departments' tables and every line between a
 * table and a circle, in help's sky; the departments' circles in navy line on
 * white, like slide 27's, Austin's with its name inside; and the two group
 * labels. All SVG on the plane. Static markup: the steps (steps-spreads.ts)
 * do all the moving.
 */
import type { ReactNode } from "react";
import type { Box, Point } from "@/components/deck/kit";
import { AUSTIN, NEXT_DEPTS, NEXT_LABEL, READY, READY_LABEL, ROOT_TABLE } from "./layout-spreads";

/** A small table from above: its tint and its sky edge. A drawn one's edge draws on and its tint comes up with it (--d); otherwise it is there whole. */
function SmallTable({ at, rx, drawn }: { at: Box; rx: number; drawn: boolean }) {
  return (
    <>
      <rect className={drawn ? "rel-table" : "rel-table rel-table--whole"} x={at.x} y={at.y} width={at.w} height={at.h} rx={rx} />
      <rect className={drawn ? "rel-hue-line dk-draw" : "rel-hue-line"} x={at.x} y={at.y} width={at.w} height={at.h} rx={rx} pathLength={1} />
    </>
  );
}

/** A department: a navy circle on white that draws on from the top (--d), clockwise. */
function Disc({ id, at, r, children }: { id: string; at: Point; r: number; children?: ReactNode }) {
  return (
    <g className="rel-disc" data-build={id}>
      <circle cx={at.x} cy={at.y} r={r} pathLength={1} transform={`rotate(-90 ${at.x} ${at.y})`} />
      {children}
    </g>
  );
}

function Label({ id, text, at }: { id: string; text: string; at: Point }) {
  return (
    <text className="rel-words rel-words--label" data-build={id} x={at.x} y={at.y} textAnchor="middle" dominantBaseline="central">
      {text}
    </text>
  );
}

export function SpreadsMarks() {
  return (
    <>
      <g data-hue="share-help">
        {READY.map((ready) => (
          <path key={ready.tie.key} className="rel-hue-line rel-tie dk-draw" data-build={ready.tie.key} d={ready.tie.d} pathLength={1} />
        ))}
        {NEXT_DEPTS.map((next) => (
          <path key={next.branch.key} className="rel-hue-line dk-draw" data-build={next.branch.key} d={next.branch.d} pathLength={1} />
        ))}
        <g data-build={ROOT_TABLE.key}>
          <SmallTable at={ROOT_TABLE.at} rx={ROOT_TABLE.rx} drawn={false} />
        </g>
        {READY.map((ready) => (
          <g key={ready.table.key} data-build={ready.table.key}>
            <SmallTable at={ready.table.at} rx={ready.table.rx} drawn />
          </g>
        ))}
      </g>
      <Disc id={AUSTIN.key} at={AUSTIN.at} r={AUSTIN.r}>
        <text className="rel-words rel-words--label rel-words--drawn" x={AUSTIN.at.x} y={AUSTIN.at.y} textAnchor="middle" dominantBaseline="central">
          {AUSTIN.text}
        </text>
      </Disc>
      {READY.map((ready) => (
        <Disc key={ready.key} id={ready.key} at={ready.at} r={ready.r} />
      ))}
      {NEXT_DEPTS.map((next) => (
        <Disc key={next.key} id={next.key} at={next.at} r={next.r} />
      ))}
      <Label id={READY_LABEL.key} text={READY_LABEL.text} at={READY_LABEL.centre} />
      <Label id={NEXT_LABEL.key} text={NEXT_LABEL.text} at={NEXT_LABEL.centre} />
    </>
  );
}
