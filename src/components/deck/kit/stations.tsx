/**
 * A row of stations: the wells work passes through, a heading over each,
 * and the card that travels them. It is HTML with its own SVG inside, so
 * the whole row is one element that moves as a piece (`y` on the row's id)
 * with its card and whatever else is placed in it.
 *
 * A well's outline draws on (`draw`); its heading arrives (`rise`); the well
 * a card has left keeps a quiet fill (`wipe` on its done id); a station is
 * lit by fading up a paper copy of its heading, with a bar under it, and a
 * heavier paper outline (`show` on its lit id, which both carry). The coral
 * outline belongs to the one station where a person decides, and to nothing
 * else: that station's heading lights, and its outline stays coral. The
 * station where work goes live in the catalog (`catalog`, its index) has
 * the catalog's colour on its outline, lit or not, and the card that lands
 * there can take the catalog's edge (`landed`). The links between the
 * wells are drawn in rule unless `linkTone` says otherwise (a role's colour,
 * or full paper for a row that must read from the back of the room).
 */
import type { ReactNode } from "react";
import { place } from "./geometry";
import { Connector, type LineTone } from "./marks";
import type { StationsLayout } from "./stations-layout";
import { STAGE } from "./tokens";

const RX = 6;

/**
 * The token that travels the row: one submission, as a small paper card with a face of its own, a three-bar chart and two lines. Move it with `x`.
 * A `landed` card (`data-landed`) has the catalog's edge; a step can bring the edge up as the card lands with `--landed` (0 to 1) on its id.
 */
export function CardToken({ id, at, landed = false }: { id: string; at: { x: number; y: number; w: number; h: number }; landed?: boolean }) {
  return (
    <div className="dk-card" data-build={id} data-landed={landed || undefined} style={place(at)}>
      <i className="dk-card__bar" />
      <i className="dk-card__bar" />
      <i className="dk-card__bar" />
      <i className="dk-card__line" />
      <i className="dk-card__line" />
    </div>
  );
}

/** `landed`: the row's card can take the catalog's edge (`CardToken`), brought up by `--landed` on the card's id as it lands in the `catalog` well. `linkTone`: what the links between the wells are drawn in (rule by default). */
export function Stations({ layout, catalog, landed = false, linkTone = "rule", children }: { layout: StationsLayout; catalog?: number; landed?: boolean; linkTone?: LineTone; children?: ReactNode }) {
  const human = layout.human === undefined ? null : layout.stations[layout.human];
  return (
    <div className="dk-stations" data-build={layout.key}>
      {layout.stations.map((station) => (
        <div key={station.doneKey} className="dk-well__done dk-wipe" data-build={station.doneKey} style={place(station)} />
      ))}
      <svg className="dk-marks" width={STAGE.w} height={STAGE.h} viewBox={`0 0 ${STAGE.w} ${STAGE.h}`} aria-hidden="true">
        {layout.stations.map((station, n) => {
          const shape = { x: station.x, y: station.y, width: station.w, height: station.h, rx: RX };
          const edge = n === catalog ? " dk-well--catalog" : "";
          return (
            <g key={station.key}>
              <rect className={`dk-well${edge} dk-draw`} data-build={station.key} {...shape} pathLength={1} />
              {n !== layout.human && <rect className={`dk-well dk-well--lit${edge}`} data-build={station.litKey} {...shape} />}
            </g>
          );
        })}
        {layout.links.map((link) => (
          <Connector key={link.key} id={link.key} from={link.from} to={link.to} tone={linkTone} />
        ))}
        {human && layout.humanKey && <rect className="dk-well dk-well--human dk-draw" data-build={layout.humanKey} x={human.x} y={human.y} width={human.w} height={human.h} rx={RX} pathLength={1} />}
      </svg>
      {layout.stations.map((station) => (
        <div key={station.headKey} className="dk-station__head" data-build={station.headKey} style={{ left: station.headAt.x, top: station.headAt.y }}>
          {station.label}
          <span className="dk-station__lit" data-build={station.litKey} aria-hidden="true">
            {station.label}
          </span>
        </div>
      ))}
      <CardToken id={layout.cardKey} at={layout.card} landed={landed} />
      {children}
    </div>
  );
}
