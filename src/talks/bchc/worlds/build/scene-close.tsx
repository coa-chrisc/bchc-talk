/**
 * Slides 20 to 22 in close, beside the board in the corner: the failed and
 * fixed test and the flagged and fixed screen, the piece of work with its
 * three marks, and the notes panel with the new session that reads it.
 * Static markup; steps-close.ts moves it, and the words are the script's
 * (layout-close.ts).
 */
"use client";

import { Fragment } from "react";
import type { Box } from "@/components/deck/kit";
import { NOTES_PANEL, NOTE_DOTS, REVIEW, SCREEN_PAIR, SESSION, TEST_PAIR, screenParts } from "./layout-close";
import { Agent, Approves, Arrow, Cross, Figure, Pic, Shape, Tick, Words } from "./parts";

const padded = (b: Box, p = 6) => ({
  x: b.x - p,
  y: b.y - p,
  w: b.w + 2 * p,
  h: b.h + 2 * p,
});

function Focus({ id, at }: { id: string; at: Box }) {
  return (
    <Pic at={padded(at)} id={id}>
      <rect className="bw-focus" x={at.x} y={at.y} width={at.w} height={at.h} rx={4} />
    </Pic>
  );
}

/** A page screenshot, flagged (its button wrong) or fixed. */
function Screen({ at, wrong }: { at: Box; wrong: boolean }) {
  const p = screenParts(at);
  return (
    <>
      <rect className="bw-frame" x={at.x} y={at.y} width={at.w} height={at.h} rx={10} />
      <path className="bw-rule" d={`M${at.x} ${p.bar}H${at.x + at.w}`} />
      {p.dots.map((dot, i) => (
        <circle key={i} className="bw-rule-fill" cx={dot.x} cy={dot.y} r={4.5} />
      ))}
      <rect className="bw-catalog" x={p.head.x} y={p.head.y} width={p.head.w} height={p.head.h} />
      <rect className="bw-white" x={p.headTitle.x} y={p.headTitle.y} width={p.headTitle.w} height={p.headTitle.h} rx={5} />
      {p.fields.map(({ label, field }, i) => (
        <Fragment key={i}>
          <rect className="bw-paper-fill" x={label.x} y={label.y} width={label.w} height={label.h} rx={4} />
          <rect className="bw-ink" x={field.x} y={field.y} width={field.w} height={field.h} rx={5} />
        </Fragment>
      ))}
      {wrong ? (
        <rect className="bw-wrong" x={p.wrongButton.x} y={p.wrongButton.y} width={p.wrongButton.w} height={p.wrongButton.h} rx={2} />
      ) : (
        <rect className="bw-process" x={p.button.x} y={p.button.y} width={p.button.w} height={p.button.h} rx={15} />
      )}
      <rect className="bw-frame" x={p.chart.x} y={p.chart.y} width={p.chart.w} height={p.chart.h} rx={6} />
      {p.bars.map((bar, i) => (
        <rect key={i} className={i % 2 ? "bw-catalog" : "bw-process"} x={bar.x} y={bar.y} width={bar.w} height={bar.h} rx={3} />
      ))}
    </>
  );
}

function Tested() {
  const t = TEST_PAIR;
  const s = SCREEN_PAIR;
  const { wrongButton: wrong, ring } = screenParts(s.flagged);
  return (
    <>
      <Focus id={t.focusKey} at={t.focus} />
      <Pic at={padded(t.failed, 8)} id={t.failedKey}>
        <rect className="bw-failed bw-failed--big" x={t.failed.x} y={t.failed.y} width={t.failed.w} height={t.failed.h} rx={10} />
        <Cross
          at={{
            x: t.failed.x + t.failed.w / 2,
            y: t.failed.y + t.failed.h / 2,
          }}
          r={22}
        />
      </Pic>
      <Words id={t.failedKey} at={{ x: t.failed.x, y: t.labelY }} lines={[t.failedText]} size="text" />
      <div data-build={t.fixerKey}>
        <Agent kind="fixer" at={t.fixer} r={22} />
        <Words at={t.fixerTextAt} lines={[t.fixerText]} size="text" />
      </div>
      <Pic
        at={{
          x: t.failed.x + t.failed.w,
          y: t.failed.y,
          w: t.fixed.x - t.failed.x - t.failed.w,
          h: t.failed.h,
        }}
        id={t.arrowKey}
      >
        <Arrow
          from={{
            x: t.failed.x + t.failed.w + 14,
            y: t.failed.y + t.failed.h / 2,
          }}
          to={{ x: t.fixed.x - 14, y: t.failed.y + t.failed.h / 2 }}
        />
      </Pic>
      <Pic at={padded(t.fixed, 18)} id={t.fixedKey}>
        <rect className="bw-well" x={t.fixed.x} y={t.fixed.y} width={t.fixed.w} height={t.fixed.h} rx={10} />
        <rect className="bw-process-soft" x={t.fixed.x} y={t.fixed.y} width={t.fixed.w} height={t.fixed.h} rx={10} />
        <Tick at={{ x: t.fixed.x + t.fixed.w - 6, y: t.fixed.y + 6 }} r={16} />
      </Pic>
      <Words id={t.fixedKey} at={{ x: t.fixed.x, y: t.labelY }} lines={[t.fixedText]} size="text" />

      <Agent id={s.testerKey} kind="tester" at={s.tester} r={14} />
      <Words id={s.labelKey} at={s.labelAt} lines={[s.text]} size="text" />
      <div data-build={s.personKey}>
        <Pic at={padded(s.person, 4)}>
          <Figure at={s.person} />
        </Pic>
        <Words at={s.personTextAt} lines={[s.personText]} />
      </div>
      <Pic at={padded(s.flagged)} id={s.flaggedKey}>
        <Screen at={s.flagged} wrong />
      </Pic>
      <div className="bw-scan" data-build={s.scanKey} style={{ left: s.flagged.x, top: s.flagged.y, width: s.flagged.w }} />
      <Pic
        at={padded({
          x: wrong.x - 30,
          y: wrong.y - 22,
          w: wrong.w + 60,
          h: wrong.h + 44,
        })}
        id={s.ringKey}
      >
        <ellipse className="bw-ink bw-ink--heavy dk-draw" cx={ring.cx} cy={ring.cy} rx={ring.rx} ry={ring.ry} pathLength={1} />
      </Pic>
      <Words id={s.ringKey} at={{ x: s.flagged.x, y: s.labelY }} lines={[s.flaggedText]} size="text" />
      <Pic
        at={{
          x: s.flagged.x + s.flagged.w,
          y: s.flagged.y,
          w: s.fixed.x - s.flagged.x - s.flagged.w,
          h: s.flagged.h,
        }}
        id={s.arrowKey}
      >
        <Arrow
          from={{
            x: s.flagged.x + s.flagged.w + 14,
            y: s.flagged.y + s.flagged.h / 2,
          }}
          to={{ x: s.fixed.x - 14, y: s.flagged.y + s.flagged.h / 2 }}
        />
      </Pic>
      <Pic at={padded(s.fixed)} id={s.fixedKey} className="dk-wipe">
        <Screen at={s.fixed} wrong={false} />
      </Pic>
      <Words id={s.fixedKey} at={{ x: s.fixed.x, y: s.labelY }} lines={[s.fixedText]} size="text" />
    </>
  );
}

function Reviewed() {
  const r = REVIEW;
  const last = r.marks[r.marks.length - 1].at;
  return (
    <>
      <Focus id={r.focusKey} at={r.focus} />
      <Pic
        at={{
          x: r.piece.x - 8,
          y: r.piece.y - 24,
          w: r.piece.w + 32,
          h: last.y + 40 - r.piece.y + 24,
        }}
        id={r.pieceKey}
      >
        <rect className="bw-well" x={r.piece.x} y={r.piece.y} width={r.piece.w} height={r.piece.h} rx={12} />
        <rect className="bw-process-soft" x={r.piece.x} y={r.piece.y} width={r.piece.w} height={r.piece.h} rx={12} />
        {r.code.flat().map((bar, i) => (
          <rect key={i} className="bw-paper-fill" x={bar.x} y={bar.y} width={bar.w} height={bar.h} rx={bar.h / 2} />
        ))}
        <path className="bw-rule" d={`M${r.spine.x} ${r.spine.y0}V${last.y}`} />
      </Pic>
      <div data-build={r.builderKey}>
        <Agent kind="builder" at={r.builder} r={26} />
        <Words at={r.builderTextAt} width={r.builderTextAt.w} align="center" lines={[r.builderText]} size="text" />
      </div>
      <Pic at={{ x: r.piece.x + r.piece.w - 30, y: r.piece.y - 24, w: 48, h: 48 }} id={r.tickKey}>
        <Tick at={{ x: r.piece.x + r.piece.w - 6, y: r.piece.y }} r={18} />
      </Pic>
      {r.marks.map((mark) => (
        <div key={mark.key} data-build={mark.key}>
          <Pic at={{ x: mark.at.x - 116, y: mark.at.y - 40, w: 160, h: 80 }}>
            {mark.person ? (
              <>
                <Figure at={r.personBox(mark.at.y)} />
                <Approves at={mark.at} r={r.markR} />
              </>
            ) : (
              <Shape kind="reviewer" at={mark.at} r={r.markR} />
            )}
          </Pic>
          <Words at={{ x: mark.at.x + r.markR + 32, y: mark.at.y - 24 }} lines={[mark.text]} size="name" />
        </div>
      ))}
    </>
  );
}

function Memory() {
  const p = NOTES_PANEL;
  return (
    <>
      <div data-build={p.key}>
        <Pic at={padded(p.at, 4)}>
          <rect className="bw-frame" x={p.at.x} y={p.at.y} width={p.at.w} height={p.at.h} rx={16} />
          <path className="bw-rule" d={`M${p.rule.x0} ${p.rule.y}H${p.rule.x1}`} />
        </Pic>
        <Words at={p.headingAt} lines={[p.heading]} size="name" />
      </div>
      {p.lessons.map((lesson) => (
        <Fragment key={lesson.key}>
          <div
            className="bw-reading"
            data-build={lesson.readKey}
            style={{
              left: lesson.bar.x,
              top: lesson.bar.y,
              width: lesson.bar.w,
              height: lesson.bar.h,
            }}
          />
          <Words id={lesson.key} at={lesson.at} lines={[lesson.text]} size="text" />
        </Fragment>
      ))}
      {NOTE_DOTS.map((dot) => (
        <div key={dot.key} className="bw-dot" data-build={dot.key} style={{ left: dot.from.x - 8, top: dot.from.y - 8 }} />
      ))}
      <div data-build={SESSION.key}>
        <Words at={SESSION.labelAt} lines={[SESSION.text]} size="text" />
        <Pic
          at={{
            x: SESSION.agents[0].at.x - 26,
            y: SESSION.agents[0].at.y - 26,
            w: SESSION.agents[4].at.x - SESSION.agents[0].at.x + 52,
            h: 52,
          }}
        >
          {SESSION.agents.map((agent) => (
            <Shape key={agent.kind} kind={agent.kind} at={agent.at} r={agent.kind === "lead" ? 22 : 18} />
          ))}
        </Pic>
      </div>
      <Pic
        at={{
          x: SESSION.arrow.from.x - 4,
          y: SESSION.arrow.from.y - 12,
          w: SESSION.arrow.to.x - SESSION.arrow.from.x + 8,
          h: 24,
        }}
        id={SESSION.arrowKey}
      >
        <Arrow from={SESSION.arrow.from} to={SESSION.arrow.to} />
      </Pic>
    </>
  );
}

export function CloseScene() {
  return (
    <>
      <Tested />
      <Reviewed />
      <Memory />
    </>
  );
}
