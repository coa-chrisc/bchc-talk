/**
 * The catalog world's story lines (docs/bchc-flow-revision.md, section 3):
 * which band each slide's lines sit in, and where a line too long for one
 * row is broken. The words are the script's (`storyOf`); a break is given by
 * the word it falls after.
 */
import { storyKeys, type StoryBand } from "@/components/deck/kit";
import { breakAfter, storyOf } from "../../script/find";
import { storyId } from "../steps";
import { titleOf } from "./layout";

/**
 * Slide 1 has no title line to sit under (its three opening lines fill the
 * top), so its story is at the foot. Line A of slides 7 and 9 is wider than
 * the band (1728 px), so it is set on two rows, broken after "information,"
 * and "help.", and each slide's drawing starts a row lower (layout.ts,
 * REVIEW and DAYS). Line A of slide 12 has gone by the time line B comes up,
 * so B takes the band's first row, where A was.
 */
const FOOT = new Set(["title"]);
const BREAKS: Record<string, Partial<Record<0 | 1, string[]>>> = { review: { 0: ["information,"] }, "three-days": { 0: ["help."] } };
const STARTS: Record<string, number[]> = { "ai-builds": [0, 0] };

/** A slide's story band: at the foot, or under its one- or two-line title. */
export const bandOf = (pictureId: string): StoryBand => (FOOT.has(pictureId) ? "foot" : titleOf(pictureId).lines.length > 1 ? "two" : "one");

/** A slide's story lines, A then B, each as the rows it is set on. */
export const storyLines = (pictureId: string): string[][] =>
  storyOf(pictureId).map((line, i) => {
    const words = BREAKS[pictureId]?.[i as 0 | 1];
    return words ? breakAfter(line, ...words) : [line];
  });

/** The row each of a slide's story lines starts in, where a line does not simply take the band's next row (kit `Story`'s `starts`). */
export const storyStarts = (pictureId: string): number[] | undefined => STARTS[pictureId];

/** A slide's story line ids, A then B. */
export const storyKeysOf = (pictureId: string) => storyKeys(storyId(pictureId), storyOf(pictureId).length);
