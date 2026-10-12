/**
 * Part 5, what we're sharing (slides 29 to 33a): each slide's title and story
 * band, and every part each slide puts on the stage. Each slide's own places
 * are in its module: layout-sauce.ts (29), layout-pack.ts (30),
 * layout-source.ts (31), layout-binders.ts (32), layout-workshop.ts (33) and
 * layout-spreads.ts (33a).
 * Every word is the script's, read through `shown()`, `storyOf()` or a
 * picture's On screen line: nothing on this stage is typed twice.
 */
import { storyKeys, type StoryBand } from "@/components/deck/kit";
import { breakAfter, pictureOf, storyOf } from "../../script/find";
import { storyId } from "../steps";
import { BINDERS_OWN } from "./layout-binders";
import { PACK_OWN } from "./layout-pack";
import { SAUCE_OWN } from "./layout-sauce";
import { SOURCE_OWN } from "./layout-source";
import { SPREADS_OWN } from "./layout-spreads";
import { WORKSHOP_OWN } from "./layout-workshop";

const TITLE = { x: 96, y: 152 } as const;

/** Each slide's title: its On screen line, set by the author on one or two lines. */
export const TITLES = {
  releasing: { key: "rel.title.releasing", ...TITLE, lines: [pictureOf("releasing").show] },
  skills: { key: "rel.title.skills", ...TITLE, lines: breakAfter(pictureOf("skills").show, "tool.") },
  source: { key: "rel.title.source", ...TITLE, lines: breakAfter(pictureOf("source").show, "post") },
  "design-yours": { key: "rel.title.design-yours", ...TITLE, lines: breakAfter(pictureOf("design-yours").show, "your own") },
  workshops: { key: "rel.title.workshops", ...TITLE, lines: [pictureOf("workshops").show] },
  spreads: { key: "rel.title.spreads", ...TITLE, lines: [pictureOf("spreads").show] },
} as const;

/** Each slide's story lines: their ids, in the band under the slide's title of one line or two. */
const band = (pictureId: keyof typeof TITLES) => {
  const lines = storyOf(pictureId);
  const place: StoryBand = TITLES[pictureId].lines.length > 1 ? "two" : "one";
  return { id: storyId(pictureId), band: place, lines, keys: storyKeys(storyId(pictureId), lines.length) };
};
export const STORIES = {
  releasing: band("releasing"),
  skills: band("skills"),
  source: band("source"),
  "design-yours": band("design-yours"),
  workshops: band("workshops"),
  spreads: band("spreads"),
} as const;

/** Every part each slide puts on the stage: what its first click must clear away for the next. */
export const OWN = {
  releasing: [TITLES.releasing.key, ...STORIES.releasing.keys, ...SAUCE_OWN],
  skills: [TITLES.skills.key, ...STORIES.skills.keys, ...PACK_OWN],
  source: [TITLES.source.key, ...STORIES.source.keys, ...SOURCE_OWN],
  "design-yours": [TITLES["design-yours"].key, ...STORIES["design-yours"].keys, ...BINDERS_OWN],
  workshops: [TITLES.workshops.key, ...STORIES.workshops.keys, ...WORKSHOP_OWN],
  spreads: [TITLES.spreads.key, ...STORIES.spreads.keys, ...SPREADS_OWN],
} as const;
