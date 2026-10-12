/**
 * What slides 41 and 42 draw (layout-ask.ts): the bigger tools standing on
 * the path inside your department and the catalog at the path's end; then
 * the four requests, each on its own card beside the drawing that acts it
 * out. Each picture's marks are one
 * SVG part and its HTML one layer.
 */
import { Block, Part } from "@/components/deck/kit";
import { layerOf } from "./layout";
import { ASK, RAMP, WINDOW_BAR } from "./layout-ask";
import { Card, DashedShape, Pin, Source, Window, Writing } from "./parts-figures";
import { Chair, Engineer, Form, HandUp, Pack, Tray } from "./parts-ask";
import { Label, Layer, Line } from "./parts";
import { PictureStory } from "./story";

/** A box that draws on (`draw`), in the class given. */
const Outline = ({ id, at, rx, className }: { id: string; at: { x: number; y: number; w: number; h: number }; rx: number; className: string }) => (
  <rect className={`${className} dk-draw`} data-build={id} x={at.x} y={at.y} width={at.w} height={at.h} rx={rx} pathLength={1} />
);

export function AskMarks() {
  const { clinic, board, pipeline, shelf, tile } = RAMP;
  const { form, ready, pack, engineer } = ASK;
  const { map } = clinic;
  return (
    <>
      <Part id={layerOf("ramp").marks}>
        <Window id={clinic.key} at={clinic.at} name={clinic.name} bar={WINDOW_BAR} />
        <g className="st-map" data-build={map.key}>
          <rect className="st-map__edge dk-draw" x={map.at.x} y={map.at.y} width={map.at.w} height={map.at.h} rx={6} pathLength={1} />
          {[0.38, 0.72].map((f) => (
            <path key={`v${f}`} className="st-map__road dk-draw" d={`M${map.at.x + map.at.w * f} ${map.at.y}V${map.at.y + map.at.h}`} pathLength={1} />
          ))}
          {[0.45].map((f) => (
            <path key={`h${f}`} className="st-map__road dk-draw" d={`M${map.at.x} ${map.at.y + map.at.h * f}H${map.at.x + map.at.w}`} pathLength={1} />
          ))}
        </g>
        <Pin id={clinic.pin.key} at={clinic.pin.at} />
        {clinic.rows.map((row) => (
          <Writing key={row.key} id={row.key} at={row.at} />
        ))}

        <Window id={board.key} at={board.at} name={board.name} bar={WINDOW_BAR} />
        <path className="st-line--paper dk-draw" data-build={board.axis.key} d={board.axis.d} pathLength={1} />
        {board.bars.map((bar) => (
          <rect key={bar.key} className="st-grow" data-build={bar.key} x={bar.at.x} y={bar.at.y} width={bar.at.w} height={bar.at.h} rx={3} />
        ))}
        <path className="st-chart dk-draw" data-build={board.line.key} d={board.line.d} pathLength={1} />
        <circle className="st-chart dk-draw" data-build={board.ring.key} cx={board.ring.at.x} cy={board.ring.at.y} r={board.ring.r} pathLength={1} transform={`rotate(-90 ${board.ring.at.x} ${board.ring.at.y})`} />
        {board.legend.map((row) => (
          <Writing key={row.key} id={row.key} at={row.at} />
        ))}

        <Window id={pipeline.key} at={pipeline.at} name={pipeline.name} bar={WINDOW_BAR} />
        {pipeline.sources.map((source) => (
          <Source key={source.key} id={source.key} at={source.at} />
        ))}
        <path className="st-line--paper dk-draw" data-build={pipeline.joins.key} d={pipeline.joins.d} pathLength={1} />
        <Outline id={pipeline.step.key} at={pipeline.step.at} rx={10} className="st-line--paper" />
        <g data-build={pipeline.table.key}>
          <rect className="st-line--paper dk-draw" x={pipeline.table.at.x} y={pipeline.table.at.y} width={pipeline.table.at.w} height={pipeline.table.at.h} rx={6} pathLength={1} />
          {Array.from({ length: pipeline.table.rows - 1 }, (_, i) => {
            const y = pipeline.table.at.y + ((i + 1) * pipeline.table.at.h) / pipeline.table.rows;
            return <path key={i} className="st-line--paper dk-draw" d={`M${pipeline.table.at.x} ${y}H${pipeline.table.at.x + pipeline.table.at.w}`} pathLength={1} />;
          })}
        </g>
        {pipeline.feeds.map((feed) => (
          <path key={feed.key} className="st-line--paper dk-draw" data-build={feed.key} d={feed.d} pathLength={1} />
        ))}

        <Outline id={shelf.key} at={shelf.at} rx={14} className="st-shelf" />
        <Label id={shelf.label.key} at={shelf.label.at} text={shelf.label.text} anchor="start" />
        {shelf.entries.map((entry) => (
          <rect key={entry.key} className="st-shelf__entry" data-build={entry.key} x={entry.at.x} y={entry.at.y} width={entry.at.w} height={entry.at.h} rx={10} />
        ))}
        <rect className="st-slot" data-build={shelf.slot.key} x={shelf.slot.at.x} y={shelf.slot.at.y} width={shelf.slot.at.w} height={shelf.slot.at.h} rx={10} />
        <path className="st-line--paper dk-draw" data-build={RAMP.trail.key} d={RAMP.trail.d} pathLength={1} />
        <rect className="st-shelf__entry st-shelf__entry--new" data-build={tile.key} x={tile.at.x} y={tile.at.y} width={tile.at.w} height={tile.at.h} rx={10} />
        <Label id={RAMP.first.key} at={RAMP.first.at} text={RAMP.first.text} />
      </Part>

      <Part id={layerOf("ask").marks}>
        {ASK.cards.map((card) => (
          <Card key={card.key} id={card.key} at={card.at} />
        ))}
        <Tray id={form.tray.key} at={form.tray.at} />
        <Form id={form.key} at={form.at} tag={form.tag} fields={form.fields} />
        <HandUp id={ready.key} at={ready.at} hand={ready.hand} />
        <Line id={pack.floor.key} from={pack.floor.from} to={pack.floor.to} tone="paper" />
        <Pack id={pack.key} at={pack.at} />
        <Chair id={engineer.chair.key} at={engineer.chair.at} />
        <Engineer id={engineer.key} at={engineer.at} />
        <path className="st-line--paper dk-draw" data-build={engineer.table.key} d={engineer.table.d} pathLength={1} />
      </Part>
    </>
  );
}

export function AskHtml() {
  return (
    <>
      <Layer id={layerOf("ramp").html}>
        <DashedShape id={RAMP.room.key} at={RAMP.room.at} d={RAMP.room.d} />
        <Block id={RAMP.room.label.key} at={RAMP.room.label.at} className="dk-block--line">
          {RAMP.room.label.text}
        </Block>
        <PictureStory picture="ramp" />
      </Layer>
      <Layer id={layerOf("ask").html}>
        {ASK.cards.map((card) => (
          <Block key={card.words.key} id={card.words.key} at={card.words.at} className="st-ask__words">
            <span>
              {card.lines.map((line, i) => (
                <span key={line}>
                  {i > 0 && " "}
                  {line}
                </span>
              ))}
            </span>
          </Block>
        ))}
        <PictureStory picture="ask" />
      </Layer>
    </>
  );
}
