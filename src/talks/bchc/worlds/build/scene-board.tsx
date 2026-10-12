/**
 * Slide 19's board on the stage, in the agent film's way: the project row,
 * eight workstreams of cells, the agents on them, and the passed ticks. The
 * board is one layer (`BOARD_KEY`) that later slides carry small and into
 * the year by transform; inside it, everything is placed in stage pixels.
 * The plan's and the work's words sit round it, on the stage, and go before
 * the board goes small.
 */
"use client";

import type { ReactNode } from "react";
import { place } from "@/components/deck/kit";
import {
  AGENT_R,
  BOARD_KEY,
  BUILDERS,
  CHECKERS,
  EPICS,
  FAILED,
  FAILED_KEY,
  FIRST,
  FIXER,
  GRID,
  LAYER,
  LEADS,
  NAMES,
  PASSED,
  PLAN_APPROVAL,
  PROJECT,
  ROWS,
  SPRINTS,
  SPRINT_EDGES,
  WAVE,
  cellKeyOf,
  checkAt,
  onCell,
  tickAt,
  tickKey,
} from "./layout-board";
import { Agent, Approves, Cross, Figure, Pic, Shape, Tick, Words } from "./parts";

/** The board's layer: its children are placed in stage pixels. */
function Layer({ children }: { children: ReactNode }) {
  return (
    <div className="bw-layer" data-build={BOARD_KEY} style={place(LAYER)}>
      <div className="bw-origin" style={{ left: -LAYER.x, top: -LAYER.y }}>
        {children}
      </div>
    </div>
  );
}

function Board() {
  return (
    <Layer>
      <div className="bw-cell bw-cell--row dk-wipe" data-build={PROJECT.key} style={place(PROJECT.at)}>
        <div className="bw-cell__fill" data-build={PROJECT.fillKey} />
      </div>
      <Pic at={LAYER}>
        <g data-build={SPRINT_EDGES.key}>
          {SPRINT_EDGES.x.map((x) => (
            <path key={x} className="bw-rule bw-rule--edge" d={`M${x} ${SPRINT_EDGES.y0}V${SPRINT_EDGES.y1}`} />
          ))}
        </g>
      </Pic>
      {ROWS.map((row) => (
        <div key={row.key} className="bw-row" data-build={row.key}>
          {row.cells.map((cell) => (
            <div key={cell.slot} className="bw-cell" style={place(cell)}>
              <div className="bw-cell__fill" data-build={cellKeyOf(cell)} />
            </div>
          ))}
        </div>
      ))}
      <Pic at={LAYER}>
        <path className="bw-ink dk-draw" data-build={FIRST.lineKey} d={FIRST.d} pathLength={1} />
        {[0, 1].map((wave) =>
          PASSED.filter((cell) => Math.floor(cell.slot / GRID.sprint) === wave && cell !== FAILED).map((cell) => <Tick key={`${cell.row}.${cell.slot}`} id={tickKey(wave)} at={tickAt(cell)} r={9} />),
        )}
        <g data-build={FAILED_KEY.cross}>
          <rect className="bw-failed" x={FAILED.x} y={FAILED.y} width={FAILED.w} height={FAILED.h} rx={4} />
          <Cross at={onCell(FAILED)} r={8} />
        </g>
        <Tick id={FAILED_KEY.tick} at={tickAt(FAILED)} r={9} />
        {CHECKERS.map((crew) => (
          <Shape key={crew.key} id={crew.key} kind={crew.kind} at={checkAt(crew.cell)} r={AGENT_R} />
        ))}
        <Shape id={FIXER.key} kind="fixer" at={checkAt(FIXER.cell)} r={AGENT_R + 1} />
      </Pic>
      {BUILDERS.map((builder) => (
        <Agent key={builder.key} id={builder.key} kind="builder" at={builder.at} r={AGENT_R} />
      ))}
    </Layer>
  );
}

/** The names' thin lines back to their agents: from the grid's left edge to the names' column. */
const NAME_LINES_W = NAMES.kinds[0].at.x - GRID.x;

/** The words and marks round the board, on the stage. */
function Round() {
  const pad = LEADS.r + 4;
  return (
    <>
      <Pic
        at={{
          x: LEADS.at[0].x - pad,
          y: LEADS.at[0].y - pad,
          w: LEADS.at[2].x - LEADS.at[0].x + 2 * pad,
          h: 2 * pad,
        }}
        id={LEADS.key}
      >
        {LEADS.at.map((at, i) => (
          <Shape key={i} kind="lead" at={at} r={LEADS.r} />
        ))}
      </Pic>
      <Words id={NAMES.leadKey} at={NAMES.lead.at} lines={[NAMES.lead.text]} />
      <div data-build={PROJECT.labelKey}>
        <Pic at={{ x: PROJECT.leader.x0, y: PROJECT.leader.y - 2, w: PROJECT.leader.x1 - PROJECT.leader.x0, h: 4 }}>
          <path className="bw-leader" d={`M${PROJECT.leader.x0} ${PROJECT.leader.y}H${PROJECT.leader.x1}`} />
        </Pic>
        <Words at={PROJECT.labelAt} width={PROJECT.labelAt.w} align="right" lines={[PROJECT.text]} />
      </div>
      <div data-build={NAMES.key}>
        <Pic at={{ x: GRID.x, y: ROWS[0].y, w: NAME_LINES_W, h: ROWS[3].y - ROWS[0].y }}>
          {NAMES.kinds.map(({ kind, leader }) => (
            <path key={kind} className="bw-leader" d={`M${leader.x0} ${leader.y}H${leader.x1}`} />
          ))}
        </Pic>
        {NAMES.kinds.map((name) => (
          <Words key={name.kind} at={name.at} lines={[name.text]} />
        ))}
        <Words at={NAMES.fixer.at} lines={[NAMES.fixer.text]} className="bw-words--tag" />
      </div>
      <div data-build={EPICS.key}>
        <Pic
          at={{
            x: GRID.x - 28,
            y: ROWS[0].y - 4,
            w: 20,
            h: ROWS[7].y + GRID.h - ROWS[0].y + 8,
          }}
        >
          <path className="bw-ink" d={EPICS.bracket} />
        </Pic>
        <Words at={EPICS.at} width={EPICS.at.w} align="right" lines={[EPICS.text]} />
      </div>
      <div data-build={SPRINTS.key}>
        <Pic
          at={{
            x: GRID.x - 4,
            y: ROWS[7].y + GRID.h + 6,
            w: 4 * GRID.slot,
            h: 16,
          }}
        >
          <path className="bw-ink" d={SPRINTS.bracket} />
        </Pic>
        <Words at={SPRINTS.at} lines={[SPRINTS.text]} />
      </div>
      <Words id={FIRST.key} at={FIRST.at} width={FIRST.at.w} align="right" lines={[FIRST.text]} className="bw-words--tag" />
      <Pic
        at={{
          x: PLAN_APPROVAL.person.x - 4,
          y: PLAN_APPROVAL.person.y - 4,
          w: PLAN_APPROVAL.mark.x + 30 - PLAN_APPROVAL.person.x,
          h: 64,
        }}
        id={PLAN_APPROVAL.key}
      >
        <Figure at={PLAN_APPROVAL.person} />
        <Approves at={PLAN_APPROVAL.mark} r={22} />
      </Pic>
      <div data-build={WAVE.key}>
        <Pic
          at={{
            x: WAVE.at.x - 4,
            y: WAVE.at.y - 4,
            w: WAVE.at.w + 8,
            h: WAVE.at.h + 8,
          }}
        >
          <rect className="bw-wave" x={WAVE.at.x} y={WAVE.at.y} width={WAVE.at.w} height={WAVE.at.h} rx={10} />
        </Pic>
        <Words at={{ x: WAVE.textAt.x - 300, y: WAVE.textAt.y }} width={600} align="center" lines={[WAVE.text]} />
      </div>
    </>
  );
}

export function BoardScene() {
  return (
    <>
      <Board />
      <Round />
    </>
  );
}
