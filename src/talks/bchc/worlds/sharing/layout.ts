/**
 * Part 4, Sharing, on one plane the size of the stage (docs/bchc-talk-script.md,
 * slides 23 to 27): what every slide shares. Each slide's own layout is in
 * its own module (layout-together.ts, layout-everyone.ts, layout-adapt.ts,
 * layout-more.ts, layout-network.ts). Every word is read from the script; a
 * line break is given by the word it falls after. Each slide's picture is
 * gathered under three ids, its marks under the HTML, its HTML (its story
 * lines among them) and its marks over the HTML, so the next slide's click
 * can put the whole of it away in one move. Colour follows docs/bchc-brand.md:
 * words and outlines in navy (paper), the catalog in indigo, a department's
 * own agents in green, and orange only where a person approves.
 */
import { CONTENT_TOP, STORY, box, type Box, type Point } from "@/components/deck/kit";
import { withBase } from "@/lib/base-path";
import { breakAfter, pictureOf } from "../../script/find";
import { picturesOf, storyId } from "../steps";

/** The pictures this world holds, in the script's order. */
export const PICTURES = picturesOf("sharing");

/** The stage's lowest safe line, 24 px clear of the footer and slide number (y > 1016), and its left and right edges: nothing is drawn outside them. */
export const SAFE_BOTTOM = 1016 - 24;
export const SAFE = { left: 96, right: 1824 } as const;

/* Titles and story lines */

export const TITLE = { x: 96, y: 152 } as const;
/** Every title fits on one line at 72 px inside x 1824; one that does not names the words it breaks after. Slide 24's breaks after "them,", and its first part is too wide for one line, so it is set on three. */
const BREAKS: Record<string, string[]> = { together: ["tool,"], everyone: ["one,", "them,"] };

export const TITLES = PICTURES.map((picture) => ({
  picture: picture.id,
  key: `title.${picture.id}`,
  lines: breakAfter(picture.show, ...(BREAKS[picture.id] ?? [])),
}));

export const titleKey = (pictureId: string) => `title.${pictureId}`;

/**
 * A story line wider than the band (1728 px) is set on two rows, broken by
 * the word it falls after: slide 25's line A, after "(AWS),". The slide's
 * drawing then starts a row lower (`contentTop`).
 */
const STORY_BREAKS: Record<string, Partial<Record<0 | 1, string[]>>> = { adapt: { 0: ["(AWS),"] } };

/** The story band under a title of one, two or three lines. */
const BANDS = ["one", "two", "three"] as const;

/** Each slide's story lines, in the band under its title (one, two or three title lines), each line as the rows it is set on. */
export const STORIES = PICTURES.map((picture, i) => ({
  picture: picture.id,
  id: storyId(picture.id),
  band: BANDS[TITLES[i].lines.length - 1],
  lines: picture.story.map((line, n) => {
    const words = STORY_BREAKS[picture.id]?.[n as 0 | 1];
    return words ? breakAfter(line, ...words) : [line];
  }),
}));

const storyOfPicture = (pictureId: string) => STORIES.find((entry) => entry.picture === pictureId)!;

/** Where a slide's drawing may start: the kit's CONTENT_TOP under two story rows, a row lower for each row more. */
export const contentTop = (pictureId: string) => {
  const band = storyOfPicture(pictureId);
  return CONTENT_TOP[band.band] + (band.lines.flat().length - 2) * STORY.pitch;
};

/** How many elements carry each id that is on more than one: a title's lines, and a story line set on two rows. A chain times a staggered move by it. */
export const COUNTS: Readonly<Record<string, number>> = Object.fromEntries([
  ...TITLES.map((title) => [title.key, title.lines.length] as const),
  ...STORIES.flatMap((band) => band.lines.map((rows, n) => [`${band.id}.${String.fromCharCode(97 + n)}`, rows.length] as const)),
]);

/** A slide's whole picture as three parts: its marks under the HTML, its HTML, and its marks over the HTML (a tool landing on a picture of the catalog). */
export const groupOf = (pictureId: string) => ({ marks: `${pictureId}.marks`, html: `${pictureId}.html`, over: `${pictureId}.over` });

/** A line of 26 px label type is this tall; a line of 32 px text. */
export const LABEL_LINE = 32;
export const LINE = 45;

export const round = (n: number) => Math.round(n * 10) / 10;
export const plus = (a: Point, b: Point): Point => ({ x: a.x + b.x, y: a.y + b.y });
export const minus = (a: Point, b: Point): Point => ({ x: a.x - b.x, y: a.y - b.y });
export const centreOf = (b: Box): Point => ({ x: b.x + b.w / 2, y: b.y + b.h / 2 });

/** The words a slide's They see quotes, in order: slide 23's count among them, read from the script. */
export const quoted = (pictureId: string) => pictureOf(pictureId).see.flatMap((line) => [...line.matchAll(/"([^"]+)"/g)].map((match) => match[1]));

/* Part 4's shared pieces */

/** The small pictures a tool is told apart by, with its name (scene-parts.tsx draws them). */
export type Icon = "pin" | "chart" | "pipes" | "mail";

/**
 * A tool as a card: its icon and its name on one line. In a department it
 * has a navy edge; in the catalog, the catalog's indigo edge and tint; a copy
 * a department's agents have adapted keeps the navy edge and carries a
 * dashed corner.
 */
export const CARD = { w: 240, h: 48, rx: 8, icon: 28, pad: 12, corner: 16 } as const;

/**
 * The catalog's card grid, cut to the tops of its first three cards with
 * every word inside them and the site's coloured stripe across each card's
 * top hidden (capture/capture-stills-r3.mjs): three empty places, and no
 * entry that can be read. Shown one page pixel to one stage pixel. `slots`
 * are the cards' left edges inside the still; each card is `slotW` wide and
 * runs from `slotTop` to the still's foot, or to the foot of a mount that
 * shows less of the still than its whole height.
 */
export const CATALOG_SLOTS = {
  src: withBase("/catalog-slots.v2.webp"),
  alt: "Three empty places in the catalog's card grid",
  w: 936,
  h: 148,
  slots: [12, 324, 636],
  slotW: 288,
  slotTop: 12,
} as const;

/** The catalog's three places, in stage pixels, for the still set with its top left at `at` in a mount `h` tall (the whole still when left out). */
export const slotsAt = (at: Point, h: number = CATALOG_SLOTS.h): Box[] =>
  CATALOG_SLOTS.slots.map((x) => box(at.x + x, at.y + CATALOG_SLOTS.slotTop, CATALOG_SLOTS.slotW, h - CATALOG_SLOTS.slotTop));

/**
 * The submit form at its question "What kind of solution is it?", cut to the
 * question, its hint and all nine of its choices (capture-stills-r3.mjs),
 * shown one page pixel to one stage pixel. Each choice's box is in the
 * still's own pixels, by its name on the form.
 */
export const SUBMIT_FORM = {
  src: withBase("/submit-form-type.v2.webp"),
  w: 984,
  h: 486,
  choices: {
    "Data pipeline or integration": box(16, 150, 472, 74),
    "Dashboard or visualization": box(16, 232, 472, 74),
    "Workflow automation": box(496, 314, 472, 74),
    "Standards, governance or playbook": box(16, 396, 472, 74),
  } as Readonly<Record<string, Box>>,
} as const;

/**
 * Where a box inside a mounted still sits on the stage: the kit's frame sets
 * its strip 2 px up and left of the mount and 4 px wider (kit-parts.css,
 * dk-artefact__strip), so the still is scaled by (w + 4) / w from there.
 */
export const onStill = (frame: Box, inner: Box): Box => {
  const k = (frame.w + 4) / frame.w;
  return box(round(frame.x - 2 + inner.x * k), round(frame.y - 2 + inner.y * k), round(inner.w * k), round(inner.h * k));
};
