/**
 * Where a row of stations goes. A station is a place work passes through:
 * a well with its heading above it. The row is one part that only ever
 * moves as a whole; a card token rests in a well and travels from one to
 * the next. The layout is plain numbers and the ids of the parts, so a
 * scene draws from it and a step's moves name parts through it.
 */
import type { Box, Point } from "./tokens";

export type StationsSpec = {
  /** The row's id; every part takes its own from it. */
  id: string;
  /** The first well's top left corner. */
  x: number;
  y: number;
  headings: readonly string[];
  /** A well's size, and the space between two. */
  wellW?: number;
  wellH?: number;
  gap?: number;
  /** How far above the wells the headings' tops sit. */
  headingRise?: number;
  /** The card's size. It rests centered in a well. */
  cardW?: number;
  cardH?: number;
  /** The station where a person decides, by index: the only well that can take the coral outline. */
  human?: number;
};

export type StationLayout = Box & {
  /** The well's outline, which draws on. */
  key: string;
  label: string;
  headKey: string;
  /** The heading's top left corner. */
  headAt: Point;
  /** The quiet fill a well keeps once the card has left it. It wipes on from the left. */
  doneKey: string;
  /** The lit overlay: the heading and the outline in full paper. */
  litKey: string;
};

export type LinkLayout = { key: string; from: Box; to: Box };

export type StationsLayout = {
  /** The whole row as one part: wells, headings, card and anything placed inside it. */
  key: string;
  /** The wells' bounding box. */
  box: Box;
  stations: StationLayout[];
  /** The link in each gap, from one station to the next. */
  links: LinkLayout[];
  /** The coral outline's id, when the row has a station where a person decides. */
  humanKey?: string;
  human?: number;
  cardKey: string;
  /** The card at rest in the first well. */
  card: Box;
  /** How far the card travels from one well to the next. */
  pitch: number;
};

export const STATIONS = { wellW: 208, wellH: 72, gap: 32, headingRise: 64, cardW: 168, cardH: 48 } as const;

export function stations(spec: StationsSpec): StationsLayout {
  const { id, x, y, headings, human } = spec;
  const wellW = spec.wellW ?? STATIONS.wellW;
  const wellH = spec.wellH ?? STATIONS.wellH;
  const gap = spec.gap ?? STATIONS.gap;
  const headingRise = spec.headingRise ?? STATIONS.headingRise;
  const cardW = spec.cardW ?? STATIONS.cardW;
  const cardH = spec.cardH ?? STATIONS.cardH;
  const pitch = wellW + gap;
  const list = headings.map((label, n): StationLayout => {
    const key = `${id}.s${n}`;
    return { key, label, x: x + n * pitch, y, w: wellW, h: wellH, headKey: `${key}.head`, headAt: { x: x + n * pitch, y: y - headingRise }, doneKey: `${key}.done`, litKey: `${key}.lit` };
  });
  const box = ({ x: bx, y: by, w, h }: StationLayout): Box => ({ x: bx, y: by, w, h });
  return {
    key: id,
    box: { x, y, w: headings.length * pitch - gap, h: wellH },
    stations: list,
    links: list.slice(1).map((station, n) => ({ key: `${id}.l${n}`, from: box(list[n]), to: box(station) })),
    ...(human === undefined ? {} : { human, humanKey: `${id}.human` }),
    cardKey: `${id}.card`,
    card: { x: x + (wellW - cardW) / 2, y: y + (wellH - cardH) / 2, w: cardW, h: cardH },
    pitch,
  };
}

/** How far the card has moved, in x, when it rests in a station's well. */
export const cardAt = (layout: StationsLayout, station: number) => station * layout.pitch;
