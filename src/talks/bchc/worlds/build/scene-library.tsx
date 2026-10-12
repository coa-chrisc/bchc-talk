/**
 * Slides 15 to 17 on the stage: the design system's strip and the three
 * tools it passes over, the shelf of tested modules, and the source data
 * with the app built from all three. Static markup; steps-library.ts moves
 * it, and the words are the script's (layout-library.ts).
 */
"use client";

import { Fragment } from "react";
import { APP_LAYOUT, BAND, DESIGN, NEW_LABEL_AT, READER, SHELF_ROWS, SPECIMEN, TABLE_LAYOUT, TOOLS, TOTAL } from "./layout-library";
import { Agent, Pic, Words } from "./parts";
import { ToolArt } from "./scene-tools";

const padded = (b: { x: number; y: number; w: number; h: number }, p = 4) => ({
  x: b.x - p,
  y: b.y - p,
  w: b.w + 2 * p,
  h: b.h + 2 * p,
});

function Design() {
  return (
    <>
      <Pic at={padded(DESIGN.at)} id={DESIGN.key} className="dk-wipe">
        <rect className="bw-frame" x={DESIGN.at.x} y={DESIGN.at.y} width={DESIGN.at.w} height={DESIGN.at.h} rx={12} />
        {DESIGN.swatches.map(({ at, hue, tone }, i) => (
          <rect key={i} className={tone === "hue" ? "bw-swatch" : tone === "paper" ? "bw-paper-fill" : "bw-raised bw-edge"} data-hue={hue} x={at.x} y={at.y} width={at.w} height={at.h} rx={8} />
        ))}
        {DESIGN.type.map(({ size, x }) => (
          <text key={size} className="bw-specimen" x={x} y={DESIGN.baseline} fontSize={size}>
            {SPECIMEN}
          </text>
        ))}
        {DESIGN.components.map((at, i) => (
          <Fragment key={i}>
            <rect className={["bw-process", "bw-ink bw-white", "bw-paper-fill"][i]} x={at.x} y={at.y} width={at.w} height={at.h} rx={20} />
            <rect className={i === 1 ? "bw-paper-fill" : "bw-white"} x={at.x + 24} y={at.y + 16} width={48} height={8} rx={4} />
          </Fragment>
        ))}
      </Pic>
      <div data-build={DESIGN.labelKey}>
        {DESIGN.labels.map(({ text, x, y }) => (
          <Words key={text} at={{ x, y }} lines={[text]} size="text" />
        ))}
      </div>
      {TOOLS.map((tool) => (
        <Fragment key={tool.key}>
          <Words id={tool.key} at={tool.labelAt} lines={[tool.text]} size="text" />
          <Pic at={padded(tool.at)} id={tool.greyKey}>
            <ToolArt kind={tool.kind} at={tool.at} tone="grey" />
          </Pic>
          <Pic at={padded(tool.at)} id={tool.brandKey} className="dk-wipe">
            <ToolArt kind={tool.kind} at={tool.at} tone="brand" />
          </Pic>
          <div
            className="bw-band"
            data-build={tool.bandKey}
            style={{
              left: tool.at.x - 8,
              top: tool.at.y - BAND.h / 2,
              width: tool.at.w + 16,
              height: BAND.h,
            }}
          />
        </Fragment>
      ))}
    </>
  );
}

function Shelf() {
  return (
    <>
      {SHELF_ROWS.map((row) => {
        const first = row.tiles[0];
        return (
          <Fragment key={row.key}>
            {row.text && <Words id={row.nameKey} at={row.nameAt} lines={[row.text]} size="text" />}
            <Pic
              at={{
                x: row.rule.x0 - 2,
                y: first.y - 2,
                w: row.rule.x1 - row.rule.x0 + 4,
                h: row.rule.y - first.y + 6,
              }}
              id={row.key}
              className={`dk-wipe${row.more ? " bw-more" : ""}`}
            >
              {row.tiles.map((tile, n) => (
                <rect key={n} className="bw-module" x={tile.x} y={tile.y} width={tile.w} height={tile.h} rx={6} />
              ))}
              <path className="bw-rule" d={`M${row.rule.x0} ${row.rule.y}H${row.rule.x1}`} />
            </Pic>
          </Fragment>
        );
      })}
      <Pic at={TOTAL.frame} id={TOTAL.bracketKey}>
        <path className="bw-ink dk-draw" d={TOTAL.bracket} pathLength={1} />
      </Pic>
      <Words id={TOTAL.key} at={TOTAL.at} lines={TOTAL.lines} size="big" />
    </>
  );
}

function Data() {
  const t = TABLE_LAYOUT;
  const app = APP_LAYOUT;
  const lastRow = t.at.y + (t.rows + 1) * t.rowH;
  return (
    <>
      <Words id={t.labelKey} at={t.labelAt} lines={[t.text]} size="text" />
      <Pic at={padded(t.at)} id={t.key}>
        <rect className="bw-frame" x={t.at.x} y={t.at.y} width={t.at.w} height={t.at.h} rx={8} />
        {t.heads.map((head) => (
          <rect key={head.key} className="bw-fill bw-process-soft" data-build={head.key} x={head.at.x} y={head.at.y} width={head.at.w} height={head.at.h} />
        ))}
        {Array.from({ length: t.rows }, (_, r) => (
          <path key={r} className="bw-rule" d={`M${t.at.x} ${t.at.y + (r + 1) * t.rowH}H${t.at.x + t.at.w}`} />
        ))}
        {Array.from({ length: t.cols - 1 }, (_, c) => (
          <path key={c} className="bw-rule" d={`M${t.at.x + (c + 1) * t.colW} ${t.at.y}V${lastRow}`} />
        ))}
        {t.bars.map((bar, i) => (
          <rect key={i} className={i < t.cols ? "bw-paper-fill" : "bw-soft-fill"} x={bar.x} y={bar.y} width={bar.w} height={bar.h} rx={5} />
        ))}
      </Pic>
      <Agent id={READER.key} kind="builder" r={READER.r} at={READER.at} />
      <Pic at={padded(app.at)} id={app.key}>
        <rect className="bw-frame" x={app.at.x} y={app.at.y} width={app.at.w} height={app.at.h} rx={14} />
      </Pic>
      <Pic at={padded(app.header)} id={app.headerKey} className="dk-wipe">
        <path
          className="bw-catalog"
          d={`M${app.header.x} ${app.header.y + app.header.h}V${app.header.y + 14}Q${app.header.x} ${app.header.y} ${app.header.x + 14} ${app.header.y}H${app.header.x + app.header.w - 14}Q${app.header.x + app.header.w} ${app.header.y} ${app.header.x + app.header.w} ${app.header.y + 14}V${app.header.y + app.header.h}Z`}
        />
        <rect className="bw-white" x={app.titleBar.x} y={app.titleBar.y} width={app.titleBar.w} height={app.titleBar.h} rx={6} />
        <rect className="bw-process" x={app.pill.x} y={app.pill.y} width={app.pill.w} height={app.pill.h} rx={14} />
      </Pic>
      <Pic
        at={{
          x: app.at.x + 30,
          y: app.fields[0].label.y - 4,
          w: 330,
          h: app.fields[3].field.y + 40 - app.fields[0].label.y,
        }}
        id={app.fieldsKey}
      >
        {app.fields.map(({ label, field }, i) => (
          <Fragment key={i}>
            <rect className="bw-paper-fill" x={label.x} y={label.y} width={label.w} height={label.h} rx={5} />
            <rect className="bw-ink" x={field.x} y={field.y} width={field.w} height={field.h} rx={6} />
          </Fragment>
        ))}
      </Pic>
      <Pic
        at={{
          x: app.tiles[0].x - 4,
          y: app.tiles[0].y - 4,
          w: 3 * 128,
          h: 3 * 104,
        }}
        id={app.tilesKey}
      >
        {app.tiles.map((tile, i) => (
          <rect key={i} className="bw-module" x={tile.x} y={tile.y} width={tile.w} height={tile.h} rx={8} />
        ))}
      </Pic>
      <Pic
        at={{
          x: app.newTiles[0].x - 4,
          y: app.newTiles[0].y - 4,
          w: 2 * 128,
          h: 100,
        }}
        id={app.newKey}
        className="dk-wipe"
      >
        {app.newTiles.map((tile, i) => (
          <rect key={i} className="bw-dashed" x={tile.x} y={tile.y} width={tile.w} height={tile.h} rx={8} />
        ))}
      </Pic>
      <Words id={app.newLabelKey} at={NEW_LABEL_AT} width={NEW_LABEL_AT.w} align="center" lines={[app.newText]} />
    </>
  );
}

export function LibraryScene() {
  return (
    <>
      <Design />
      <Shelf />
      <Data />
    </>
  );
}
