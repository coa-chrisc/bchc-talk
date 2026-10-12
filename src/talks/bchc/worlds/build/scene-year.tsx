/**
 * Slide 22a's year: a column of sprint blocks per sprint, the project row
 * over them with its release markers and passed checks, this week's sprint
 * outlined across every row and named under it, the release a person approves, the products that rise off it,
 * and the legend. Blocks are HTML: green and solid once done, filling while
 * built (a navy dot on the front), grey while planned. steps-year.ts moves
 * it; the words are the script's (layout-year.ts).
 */
"use client";

import { place, type Box } from "@/components/deck/kit";
import { CHECKS, COLUMNS, LEGEND, MARKERS, PRODUCTS, RELEASE, THIS_WEEK, YEAR_ROW, dotKey, fillKey } from "./layout-year";
import { Approves, Figure, Pic, Tick, Words } from "./parts";

const DOT = 14;

/** A product slide 22a releases, drawn small: an app, a data pipeline or a dashboard. Slide 22b settles the same ones into your department. */
export function Product({ kind, at }: { kind: (typeof PRODUCTS)[number]["kind"]; at: Box }) {
  const { x, y, w, h } = at;
  if (kind === "app")
    return (
      <>
        <rect className="bw-frame bw-frame--ink" x={x} y={y} width={w} height={h} rx={8} />
        <rect className="bw-paper-fill" x={x} y={y} width={w} height={14} rx={0} />
        <rect className="bw-paper-fill" x={x + 12} y={y + 24} width={40} height={6} rx={3} />
        <rect className="bw-ink" x={x + 12} y={y + 34} width={44} height={12} rx={3} />
        <rect className="bw-process" x={x + 64} y={y + 34} width={22} height={12} rx={6} />
      </>
    );
  if (kind === "pipeline")
    return (
      <>
        <path className="bw-ink" d={`M${x + 16} ${y + h / 2}H${x + w - 16}`} />
        {[16, w / 2, w - 16].map((dx, i) => (
          <rect key={dx} className={i === 2 ? "bw-process" : "bw-paper-fill"} x={x + dx - 13} y={y + h / 2 - 13} width={26} height={26} rx={5} />
        ))}
      </>
    );
  return (
    <>
      <rect className="bw-frame bw-frame--ink" x={x} y={y} width={w} height={h} rx={8} />
      {[0.45, 0.75, 0.55, 0.9].map((k, i) => (
        <rect key={i} className={i % 2 ? "bw-paper-fill" : "bw-process"} x={x + 14 + i * 19} y={y + h - 8 - (h - 18) * k} width={12} height={(h - 18) * k} rx={2} />
      ))}
    </>
  );
}

function Year() {
  return (
    <>
      {COLUMNS.map((column) => (
        <div key={column.key} data-build={column.key}>
          {column.blocks.map((block) => (
            <div key={block.row} className={`bw-block bw-block--${column.state}`} style={place(block)}>
              {column.state === "built" && <div className="bw-block__fill" data-build={fillKey(column.sprint)} />}
            </div>
          ))}
          {column.state === "built" &&
            column.blocks.map((block) => (
              <div
                key={`dot${block.row}`}
                className="bw-dot bw-dot--small"
                data-build={dotKey(column.sprint)}
                style={{
                  left: block.x - DOT / 2,
                  top: block.y + block.h / 2 - DOT / 2,
                }}
              />
            ))}
        </div>
      ))}
    </>
  );
}

function Row() {
  const b = YEAR_ROW.at;
  return (
    <>
      <div className="bw-cell bw-cell--row dk-wipe" data-build={YEAR_ROW.key} style={place(b)}>
        <div className="bw-cell__fill" data-build={YEAR_ROW.fillKey} />
      </div>
      <Pic
        at={{
          x: b.x - 4,
          y: MARKERS.y - MARKERS.r - 6,
          w: Math.max(...MARKERS.at) + MARKERS.r + 6 - (b.x - 4),
          h: 2 * MARKERS.r + 12,
        }}
        id={MARKERS.key}
      >
        {MARKERS.at.map((x) => (
          <Approves key={x} at={{ x, y: MARKERS.y }} r={MARKERS.r} />
        ))}
      </Pic>
      <Pic at={{ x: b.x - 4, y: b.y - 6, w: b.w + 8, h: b.h + 12 }} id={CHECKS.key}>
        {CHECKS.at.map((at) => (
          <Tick key={at.x} at={at} r={8} />
        ))}
      </Pic>
    </>
  );
}

function Week() {
  const o = THIS_WEEK.outline;
  return (
    <div data-build={THIS_WEEK.key}>
      <div className="bw-outline" style={place(o)} />
      <Words at={THIS_WEEK.at} width={THIS_WEEK.at.w} align="center" lines={[THIS_WEEK.text]} />
    </div>
  );
}

function Release() {
  const m = RELEASE.mark;
  return (
    <>
      <Pic at={{ x: m.x - 24, y: m.y - 24, w: 48, h: 48 }} id={RELEASE.markKey}>
        <Approves at={m} r={18} />
      </Pic>
      <Pic
        at={{
          x: RELEASE.person.x - 4,
          y: RELEASE.person.y - 4,
          w: RELEASE.person.w + 8,
          h: RELEASE.person.h + 8,
        }}
        id={RELEASE.personKey}
      >
        <Figure at={RELEASE.person} />
      </Pic>
      <Words id={RELEASE.releasedKey} at={RELEASE.releasedAt} lines={[RELEASE.released]} size="text" className="bw-words--tag" />
      {PRODUCTS.map((product) => (
        <div key={product.key} data-build={product.key}>
          <Pic
            at={{
              x: product.icon.x - 4,
              y: product.icon.y - 4,
              w: product.icon.w + 8,
              h: product.icon.h + 8,
            }}
          >
            <Product kind={product.kind} at={product.icon} />
          </Pic>
          <Words at={product.labelAt} width={product.labelAt.w} align="center" lines={[product.text]} />
        </div>
      ))}
    </>
  );
}

function Legend() {
  const { sprint, release } = LEGEND;
  return (
    <div data-build={LEGEND.key}>
      <div className="bw-block bw-block--done" style={place(sprint.block)} />
      <Words at={sprint.at} lines={[sprint.text]} />
      <Pic
        at={{
          x: release.marker.x - 14,
          y: release.marker.y - 14,
          w: 28,
          h: 28,
        }}
      >
        <Approves at={release.marker} r={MARKERS.r} />
      </Pic>
      <Words at={release.at} lines={[release.text]} />
    </div>
  );
}

export function YearScene() {
  return (
    <>
      <Year />
      <Row />
      <Week />
      <Release />
      <Legend />
    </>
  );
}
