/**
 * The start world's own short-hands over the house verbs: leaving a picture,
 * handing the title (and the step label over it) on, and writing a click as
 * a chain of beats.
 */
import type { PartMove } from "@/components/deck/engine/types";
import { RETITLE, chain, hide, lines, retitle, type ChainBeat } from "@/components/deck/kit";
import type { Beat } from "../steps";
import { TITLE_LINES, kickerOf, layerOf, titleKey } from "./layout";

/** The pictures given are done with: their marks and their HTML go, at the click. */
export const leave = (...ids: string[]): PartMove[] => hide(ids.flatMap((id) => [layerOf(id).marks, layerOf(id).html]), { at: 0, stagger: 0 });

/**
 * The title hands from one picture to the next, and the step label over it
 * goes the same way: the old one fades as the new one comes up with the
 * title's first line. Two pictures on the same step keep the one label,
 * still.
 */
export const handOver = (from: string, next: string): PartMove[] => {
  const was = kickerOf(from);
  const now = kickerOf(next);
  const label = was?.key === now?.key ? [] : [...(was ? hide(was.key, { duration: RETITLE.out, at: 0 }) : []), ...(now ? lines(now.key, { duration: RETITLE.in, at: RETITLE.at }) : [])];
  return [...retitle(titleKey(from), titleKey(next)), ...label];
};

/** One click: its beats in order (kit `chain`), the first starting `at` seconds in, a title's lines counted where a beat brings one up. */
export const chained = (beats: readonly ChainBeat[], at = 0): Beat => ({ moves: chain(beats, { at, counts: TITLE_LINES }) });
