/**
 * Where a time rule's parts go: a line across the stage on which a day is
 * always the same length. Its first stretch (the build) is drawn heavy and
 * closed by a tick; the rest is a lighter line with a tick each week. The
 * things that happened are marks along it, placed by the day they happened
 * on and spread across that day when several share it.
 */
export type TimeRuleSpec = {
  id: string;
  x0: number;
  x1: number;
  y: number;
  /** How many days the rule spans, counting the first and the last. */
  days: number;
  /** How many of them, from the start, are the heavy stretch. */
  buildDays: number;
  /** One entry for each thing that happened: the day it happened on, from 0, in order. */
  events: readonly number[];
};

export type TimeRuleLayout = {
  key: string;
  y: number;
  /** Stage pixels to a day. */
  perDay: number;
  build: { key: string; x0: number; x1: number; tickKey: string };
  run: { key: string; x0: number; x1: number };
  /** A tick at the end of each whole week, with how far along the run it sits, from 0 to 1. */
  weeks: { key: string; x: number; along: number }[];
  /** The marks, in order; `marksKey` lights the first of them (its `lit`). */
  marksKey: string;
  marks: number[];
};

const round = (n: number) => Math.round(n * 10) / 10;

export function timeRule({ id, x0, x1, y, days, buildDays, events }: TimeRuleSpec): TimeRuleLayout {
  const perDay = (x1 - x0) / days;
  const buildEnd = x0 + buildDays * perDay;
  const perDayCount = new Map<number, number>();
  for (const day of events) perDayCount.set(day, (perDayCount.get(day) ?? 0) + 1);
  const seen = new Map<number, number>();
  const marks = events.map((day) => {
    const nth = seen.get(day) ?? 0;
    seen.set(day, nth + 1);
    return round(x0 + (day + (nth + 0.5) / perDayCount.get(day)!) * perDay);
  });
  const weeks = Array.from({ length: Math.floor((days - 1) / 7) }, (_, i) => {
    const x = x0 + (i + 1) * 7 * perDay;
    return { key: `${id}.w${i}`, x: round(x), along: (x - buildEnd) / (x1 - buildEnd) };
  });
  return {
    key: id,
    y,
    perDay,
    build: { key: `${id}.build`, x0, x1: round(buildEnd), tickKey: `${id}.built` },
    run: { key: `${id}.run`, x0: round(buildEnd), x1 },
    weeks,
    marksKey: `${id}.marks`,
    marks,
  };
}
