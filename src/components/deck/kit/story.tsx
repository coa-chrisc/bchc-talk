/**
 * The story band: one or two lines of plain text under a slide's title that
 * say what the drawing is showing, for a viewer with no speaker
 * (docs/bchc-flow-revision.md, section 3). Each line is a SetText at 32 px
 * in paper (`size="text"`), left-aligned across the band, and comes up with
 * `tell` as its beat lands. `storyRows` says where each row sits.
 */
import { SetText } from "./text";
import type { Point } from "./tokens";

/**
 * Where a slide's story lines go: under a one-line title, under a two-line
 * or a three-line one, or at the foot of the stage where there is no title
 * to sit under (or no room).
 */
export type StoryBand = "one" | "two" | "three" | "foot";

/** The band in stage pixels: its left edge and width, one row's pitch, its first row's top under each title, and its last row's top at the foot. */
export const STORY = { x: 96, w: 1728, pitch: 48, top: { one: 338, two: 420, three: 498 }, foot: 988 } as const;

/** Where a slide's drawing may start under its story band: 100 px lower than before the band, under a one-, two- or three-line title. */
export const CONTENT_TOP = { one: 440, two: 520, three: 598 } as const;

/** The top left of each of `rows` rows. Under a title the rows run down from the band's top; at the foot they stack up, so the last row always sits at the foot. */
export function storyRows(band: StoryBand, rows: number): Point[] {
  const first = band === "foot" ? STORY.foot - (rows - 1) * STORY.pitch : STORY.top[band];
  return Array.from({ length: rows }, (_, i) => ({ x: STORY.x, y: first + i * STORY.pitch }));
}

/** A story line's id: the band's id and the line's letter, `a` then `b`. */
export const storyKeys = (id: string, count: number) => Array.from({ length: count }, (_, i) => `${id}.${String.fromCharCode(97 + i)}`);

type StoryProps = {
  /** The band's id; each line's is this and its letter (`storyKeys`). */
  id: string;
  band: StoryBand;
  /** A slide's story lines, A then B. A line given as several rows is one line broken by its author (`breakAfter`), and comes up as one. */
  lines: readonly (string | readonly string[])[];
  /** The row each line starts in, counted from the band's first. Left out, each line takes the band's next row; a line may take a row an earlier line has left, where that line is gone before it comes up. */
  starts?: readonly number[];
};

/** A slide's story lines, each in its band's next row, or in the row `starts` gives it. */
export function Story({ id, band, lines, starts }: StoryProps) {
  const rows = lines.map((line) => (typeof line === "string" ? [line] : line));
  const first = starts ?? rows.map((_, i) => rows.slice(0, i).reduce((sum, line) => sum + line.length, 0));
  const places = storyRows(band, Math.max(0, ...rows.map((line, i) => first[i] + line.length)));
  const keys = storyKeys(id, rows.length);
  return rows.map((line, i) => {
    const { x, y } = places[first[i]];
    return <SetText key={keys[i]} id={keys[i]} x={x} y={y} lines={line} size="text" />;
  });
}
