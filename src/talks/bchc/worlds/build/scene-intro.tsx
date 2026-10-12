/**
 * Slides 14 and 18 on the stage: the three steps, and the week over its app
 * sketch. Static markup; the steps do all the moving (steps-intro.ts), and
 * the words are the script's (layout.ts).
 */
"use client";

import { Fragment } from "react";
import { Agent as KitAgent, type Point } from "@/components/deck/kit";
import { APPROVE_ART, BUILD_ART, CALENDAR, CHECKER, CURSOR, DAYS, DECIDE_ART, NOTES, PROTOTYPE, RAD, RAD_LINKS, SKETCH, SKETCH_BARS, SKETCH_BLOCKS, WEEK } from "./layout";
import { Approves, Arrow, Figure, Pic, Tick, Words } from "./parts";

/** The steps' drawing: their row, with room for the strokes. */
const STEPS_BOX = {
  x: RAD.boxes[0].at.x - 4,
  y: RAD.boxes[0].at.y - 4,
  w: RAD.boxes[2].at.x + RAD.boxes[2].at.w - RAD.boxes[0].at.x + 8,
  h: RAD.boxes[0].at.h + 8,
};

/** An agent in step two: the deck's plain agent glyph (a ring round a dot, its ring in the process colour), in a drawing of its own that a move can carry. Slide 19 introduces each kind's own shape. */
function StepAgent({ id, glyph, at }: { id: string; glyph: string; at: Point }) {
  const pad = BUILD_ART.r + 4;
  return (
    <Pic at={{ x: at.x - pad, y: at.y - pad, w: 2 * pad, h: 2 * pad }} id={id} className="bw-agent">
      <KitAgent id={glyph} at={at} r={BUILD_ART.r} role="builder" hue="process" />
    </Pic>
  );
}

function Steps() {
  return (
    <>
      <Pic at={STEPS_BOX}>
        {RAD.boxes.map(({ at }, i) => (
          <rect key={i} className={i === 1 ? "bw-agent-box" : "bw-step-box"} data-build={RAD.boxKey} x={at.x} y={at.y} width={at.w} height={at.h} rx={16} />
        ))}
        {RAD_LINKS.map((link, i) => (
          <Arrow key={i} id={RAD.linkKey} from={link.from} to={link.to} className="bw-arrow--link" drawn />
        ))}
        <g data-build={RAD.artKey(0)}>
          {DECIDE_ART.people.map((at, i) => (
            <Figure key={i} at={at} />
          ))}
          <rect className="bw-frame" x={DECIDE_ART.sheet.x} y={DECIDE_ART.sheet.y} width={DECIDE_ART.sheet.w} height={DECIDE_ART.sheet.h} rx={8} />
          {DECIDE_ART.lines.map((line, i) => (
            <path key={i} className="bw-ink" d={`M${line.x0} ${line.y}H${line.x1}`} />
          ))}
        </g>
        <g data-build={RAD.artKey(1)}>
          {BUILD_ART.cells.map((cell, i) => (
            <rect key={i} className="bw-well" x={cell.x} y={cell.y} width={cell.w} height={cell.h} rx={6} />
          ))}
        </g>
        {BUILD_ART.cells.map((cell, i) => (
          <rect key={i} className="bw-fill bw-process-soft" data-build={RAD.cellsKey} x={cell.x} y={cell.y} width={cell.w} height={cell.h} rx={6} />
        ))}
        <g data-build={RAD.artKey(2)}>
          <Figure at={APPROVE_ART.person} />
          <rect className="bw-frame" x={APPROVE_ART.release.x} y={APPROVE_ART.release.y} width={APPROVE_ART.release.w} height={APPROVE_ART.release.h} rx={10} />
          <path className="bw-rule" d={`M${APPROVE_ART.release.x} ${APPROVE_ART.release.y + 30}H${APPROVE_ART.release.x + APPROVE_ART.release.w}`} />
          <rect className="bw-process" x={APPROVE_ART.release.x + 22} y={APPROVE_ART.release.y + 50} width={88} height={14} rx={7} />
          <rect className="bw-raised" x={APPROVE_ART.release.x + 22} y={APPROVE_ART.release.y + 78} width={136} height={40} rx={6} />
        </g>
        <Approves id={RAD.markKey} at={APPROVE_ART.mark} />
      </Pic>
      <StepAgent id={RAD.builderKey} glyph={RAD.glyphKeys[0]} at={{ x: BUILD_ART.cells[0].x + BUILD_ART.r + 4, y: BUILD_ART.agentY }} />
      <StepAgent id={RAD.testerKey} glyph={RAD.glyphKeys[1]} at={{ x: BUILD_ART.cells[0].x + BUILD_ART.cells[0].w / 2, y: BUILD_ART.agentY }} />
      {RAD.boxes.map(({ at, lines }, i) => (
        <Words key={i} id={RAD.nameKey(i)} at={{ x: at.x + 36, y: at.y + 34 }} lines={lines} size="name" />
      ))}
    </>
  );
}

/** The app sketch's outline, and what each day adds to it. */
function Sketch() {
  const { at, barY, sideX, nav, button } = SKETCH;
  return (
    <Pic
      at={{
        x: NOTES.at.x - 10,
        y: at.y - 10,
        w: at.x + at.w - NOTES.at.x + 20,
        h: at.h + 20,
      }}
    >
      <g data-build={NOTES.key}>
        <rect className="bw-frame" x={NOTES.at.x} y={NOTES.at.y} width={NOTES.at.w} height={NOTES.at.h} rx={8} />
        {NOTES.lines.map((line, i) => (
          <path key={i} className="bw-ink" d={`M${line.x0} ${line.y}H${line.x1}`} />
        ))}
      </g>
      <g data-build={SKETCH.key}>
        <rect className="bw-frame" x={at.x} y={at.y} width={at.w} height={at.h} rx={12} />
        <path className="bw-rule" d={`M${at.x} ${barY}H${at.x + at.w}M${sideX} ${barY}V${at.y + at.h}`} />
        {[0, 1, 2].map((n) => (
          <circle key={n} className="bw-rule-fill" cx={at.x + 20 + n * 16} cy={at.y + 18} r={5} />
        ))}
      </g>
      <g data-build={WEEK.planKey}>
        {SKETCH_BLOCKS.map((b, i) => (
          <rect key={i} className="bw-plan" x={b.x} y={b.y} width={b.w} height={b.h} rx={8} />
        ))}
        {nav.map((line, i) => (
          <path key={i} className="bw-plan-line" d={`M${line.x0} ${line.y}H${line.x1}`} />
        ))}
        <rect className="bw-plan" x={button.x} y={button.y} width={button.w} height={button.h} rx={18} />
      </g>
      <g data-build={WEEK.buildKey}>
        {SKETCH.cards.map((b, i) => (
          <Fragment key={i}>
            <rect className="bw-process-soft" x={b.x} y={b.y} width={b.w} height={b.h} rx={8} />
            <rect className="bw-paper-fill" x={b.x + 18} y={b.y + 22} width={[72, 96, 60][i]} height={12} rx={6} />
            <rect className="bw-paper-fill" x={b.x + 18} y={b.y + 48} width={[44, 36, 52][i]} height={18} rx={4} />
          </Fragment>
        ))}
        <rect className="bw-frame" x={SKETCH.chart.x} y={SKETCH.chart.y} width={SKETCH.chart.w} height={SKETCH.chart.h} rx={8} />
        {SKETCH_BARS.map((b, i) => (
          <rect key={i} className={i % 2 ? "bw-paper-fill" : "bw-process"} x={b.x} y={b.y} width={b.w} height={b.h} rx={4} />
        ))}
        {nav.map((line, i) => (
          <path key={i} className="bw-ink" d={`M${line.x0} ${line.y}H${line.x1}`} />
        ))}
        <rect className="bw-process" x={button.x} y={button.y} width={button.w} height={button.h} rx={18} />
      </g>
      <g data-build={WEEK.testKey}>
        {SKETCH_BLOCKS.map((b, i) => (
          <Tick key={i} at={{ x: b.x + b.w - 6, y: b.y + 6 }} r={13} />
        ))}
      </g>
      <ellipse className="bw-ink bw-ink--heavy dk-draw" data-build={CHECKER.markKey} cx={CHECKER.mark.cx} cy={CHECKER.mark.cy} rx={CHECKER.mark.rx} ry={CHECKER.mark.ry} pathLength={1} />
    </Pic>
  );
}

function Week() {
  const { today, band, ring } = CALENDAR;
  return (
    <>
      <Pic
        at={{
          x: DAYS[0].at.x - 4,
          y: DAYS[0].at.y - ring - 4,
          w: DAYS[4].at.x + DAYS[4].at.w - DAYS[0].at.x + 8,
          h: DAYS[0].at.h + ring + 8,
        }}
        id={CALENDAR.key}
      >
        {DAYS.map(({ at }, i) => (
          <Fragment key={i}>
            <rect className="bw-frame" x={at.x} y={at.y} width={at.w} height={at.h} rx={12} />
            <path className="bw-binder" d={`M${at.x} ${at.y + band}V${at.y + 12}A12 12 0 0 1 ${at.x + 12} ${at.y}H${at.x + at.w - 12}A12 12 0 0 1 ${at.x + at.w} ${at.y + 12}V${at.y + band}Z`} />
            {[0.3, 0.7].map((k) => (
              <rect key={k} className="bw-binder" x={at.x + at.w * k - 5} y={at.y - ring} width={10} height={ring + band - 4} rx={5} />
            ))}
          </Fragment>
        ))}
      </Pic>
      {DAYS.map(({ name, at }, i) => (
        <Words key={i} id={WEEK.dayKey(i)} at={{ x: at.x, y: at.y + CALENDAR.band + (at.h - CALENDAR.band) / 2 - 19 }} width={at.w} align="center" lines={[name]} size="text" />
      ))}
      <div
        className="bw-today"
        data-build={CALENDAR.todayKey}
        style={{
          left: today.x - 3,
          top: today.y - 3,
          width: today.w + 6,
          height: today.h + 6,
        }}
      />
      <Sketch />
      <Pic
        at={{
          x: CHECKER.at.x - 4,
          y: CHECKER.at.y - 4,
          w: CHECKER.at.w + 8,
          h: CHECKER.at.h + 8,
        }}
        id={CHECKER.key}
      >
        <Figure at={CHECKER.at} />
      </Pic>
      <Words id={CHECKER.labelKey} at={CHECKER.labelAt} lines={CHECKER.lines} size="text" />
      <Words id={NOTES.labelKey} at={NOTES.labelAt} lines={[NOTES.text]} size="text" />
      <Pic at={{ x: CURSOR.tip.x - 4, y: CURSOR.tip.y - 4, w: 40, h: 48 }} id={CURSOR.key}>
        <path
          className="bw-cursor"
          d={`M${CURSOR.tip.x} ${CURSOR.tip.y}V${CURSOR.tip.y + 34}L${CURSOR.tip.x + 9} ${CURSOR.tip.y + 26}L${CURSOR.tip.x + 16} ${CURSOR.tip.y + 40}L${CURSOR.tip.x + 22} ${CURSOR.tip.y + 37}L${CURSOR.tip.x + 15} ${CURSOR.tip.y + 23}L${CURSOR.tip.x + 26} ${CURSOR.tip.y + 23}Z`}
        />
      </Pic>
      <Words id={PROTOTYPE.key} at={PROTOTYPE.at} lines={[PROTOTYPE.text]} size="text" />
    </>
  );
}

export function IntroScene() {
  return (
    <>
      <Steps />
      <Week />
    </>
  );
}
