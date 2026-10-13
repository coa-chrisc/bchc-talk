/**
 * The start world (Part 6, slides 34 to 42) on one plane the size of the
 * stage: the titles, the step labels over them, and the helpers every
 * slide's layout shares, and where slides 34 to 36 put their parts and
 * words. Every word is read from the script; a title's line break is given
 * by the word it falls after. Every id starts with its picture's id, so
 * what a slide leaves behind is easy to name. Slides 36a to 38 are in layout-two.ts, 38s in
 * layout-safe.ts, 38a and 38b in layout-help.ts, 39 and 40 in layout-path.ts, and 41 and 42 in
 * layout-ask.ts.
 */
import { box, type Box, type Point, type StoryBand } from "@/components/deck/kit";
import { breakAfter, shown } from "../../script/find";
import { picturesOf } from "../steps";

export const TITLE = { x: 96, y: 152 };
export const titleKey = (pictureId: string) => `title.${pictureId}`;
/** A picture's two parts: its marks (one SVG group) and its HTML (one layer). Leaving the picture hides both. The path of 39 and 41 has its own pair, under `path`. */
export const layerOf = (id: string) => ({ marks: `${id}.marks`, html: `${id}.html` });

/** Titles too long for one line at 72 px inside x 1824, by the word each line ends on. Slide 40's runs to three lines. */
const BREAKS: Record<string, string[]> = {
  safe: ["data"],
  questions: ["teams"],
  fde: ["staff,"],
  "low-risk": ["projects"],
  examples: ["templates:", "and"],
};

export const TITLES = picturesOf("start").map((picture) => ({ picture: picture.id, key: titleKey(picture.id), lines: breakAfter(picture.show, ...(BREAKS[picture.id] ?? [])) }));

/** How many lines each title is set on: a move that brings a title up staggers across them. */
export const TITLE_LINES: Record<string, number> = Object.fromEntries(TITLES.map((title) => [title.key, title.lines.length]));

/**
 * The slides whose title has a small label over it, naming which of the
 * three steps the slide is: the first word their click shows is that label
 * (the script's They see says so).
 */
const LABELLED = new Set(["step-one", "training", "github", "tools", "approver", "safe", "low-risk"]);

/** The words a picture's drawing is labelled with: its click's words, the label over its title aside. */
export const labelsOf = (pictureId: string) => shown(pictureId, "play").slice(LABELLED.has(pictureId) ? 1 : 0);

/** A step label's top left: at the title's left edge, a label's height and a clear gap over its first line. */
export const KICKER = { x: TITLE.x, y: 108 };

/**
 * Each step label as one part: one for a run of slides in a row that share
 * it, so it stays still while they hand the title on. Its id is its first
 * slide's: `kicker.<picture>`.
 */
export const KICKERS = picturesOf("start").reduce<{ key: string; text: string; pictures: string[] }[]>((runs, picture, i, all) => {
  if (!LABELLED.has(picture.id)) return runs;
  const text = shown(picture.id, "play")[0];
  const last = runs[runs.length - 1];
  if (last && last.text === text && last.pictures.includes(all[i - 1].id)) last.pictures.push(picture.id);
  else runs.push({ key: `kicker.${picture.id}`, text, pictures: [picture.id] });
  return runs;
}, []);

/** The step label over a picture's title, if it has one. */
export const kickerOf = (pictureId: string) => KICKERS.find((kicker) => kicker.pictures.includes(pictureId)) ?? null;

/** Where a picture's story lines sit: under its one-line title, or under a longer one. */
export const bandOf = (pictureId: string): StoryBand => (BREAKS[pictureId] ? "two" : "one");

/**
 * A three-line title (slide 40's) leaves no room for the two-line band, so
 * its story lines are set the same way lower: as far under the title's rule
 * as the two-line band sits under a two-line title's.
 */
export const THREE_LINE_STORY_TOP = 476;
/** Where a slide's drawing may start under its story lines: a one-line title with two story lines, and a three-line title with two. */
export const DRAWING_TOP = { one: 470, three: 590 } as const;

/** A line of 32 px text is this tall. */
export const LINE = 45;
export const PERSON = { w: 48, h: 64 };

/** The kit's person at a scale, its top left corner at (x, y). */
export const personAt = (x: number, y: number, scale = 1): Box => box(x, y, Math.round(PERSON.w * scale), Math.round(PERSON.h * scale));
/** The point `gap` short of `to`, on the way from `from`: where a line stops before a ring of that radius. */
export const short = (from: Point, to: Point, gap: number): Point => {
  const d = Math.hypot(to.x - from.x, to.y - from.y);
  const k = (d - gap) / d;
  return { x: Math.round(from.x + (to.x - from.x) * k), y: Math.round(from.y + (to.y - from.y) * k) };
};

/* 34. Three steps: a staircase rising left to right, each step's words on its face, and your department at the foot, stepping up onto the first. */

const FLOOR = 976;
/** Each step is this much higher than the one before, and this wide. */
const STEP = { rise: 150, w: 500, x: 324 };
/** Where each step's words break: step one's on two lines, the others on three. */
const STEP_BREAKS = [["project"], ["people,", "and"], ["with", "projects"]];
const [STEP_ONE_WORDS, STEP_TWO_WORDS, STEP_THREE_WORDS, YOUR_DEPARTMENT] = shown("three", "play");
const STAIR_PERSON = 1.25;
const STANDS = personAt(160, FLOOR - Math.round(PERSON.h * STAIR_PERSON), STAIR_PERSON);
/** Where the person steps to: onto the first tread, a little in from its front edge. */
const STEPS_TO = STEP.x + 76;

export const THREE = {
  steps: [STEP_ONE_WORDS, STEP_TWO_WORDS, STEP_THREE_WORDS].map((text, i) => {
    const x = STEP.x + i * STEP.w;
    const tread = FLOOR - (i + 1) * STEP.rise;
    return {
      key: `three.step.${i}`,
      /** The step's face, from its tread to the floor: it rises out of the floor (`fill`). */
      face: { key: `three.step.${i}.face`, at: box(x, tread, STEP.w, FLOOR - tread) },
      /** The stair's edge: up the riser and along the tread. The first starts on the floor at the margin, where the person stands. */
      d: i === 0 ? `M96 ${FLOOR}H${x}V${tread}H${x + STEP.w}` : `M${x} ${tread + STEP.rise}V${tread}H${x + STEP.w}`,
      words: { key: `three.step.${i}.words`, lines: breakAfter(text, ...STEP_BREAKS[i]), at: box(x, tread, STEP.w, FLOOR - tread) },
    };
  }),
  person: {
    key: "three.person",
    at: STANDS,
    /** Named over their head; the name goes where they go. */
    label: { key: "three.person.label", text: YOUR_DEPARTMENT, at: { x: STANDS.x + STANDS.w / 2, y: STANDS.y - 28 } },
    /** The step up: across to the first tread, and up by its rise. */
    up: { x: STEPS_TO - STANDS.x, y: -STEP.rise },
  },
};

/* 35. Post a project in the catalog: your project's card fills in a field at a time and stays on the left; a copy of it, as a catalog entry, slides out from behind it to the empty slot at the end of the catalog's grid, waits there for a person's approval, and drops in. */

const CARD = box(96, 500, 400, 456);
const [YOUR_PROJECT, ...FIELD_NAMES] = labelsOf("step-one");
/** Each field's writing, as long as the field's answer: a bar that fills in from the left. */
const FIELD_BARS = [300, 230, 170];
/**
 * The catalog's grid, drawn, cropped to its last row: the bottoms of the
 * row above show at its top edge, and the last row's last place is empty.
 * It spans the rest of the stage beside the card, so the copy's flight
 * crosses it. Its cards are the project card at two thirds.
 */
const MOUNT = box(552, 500, 1272, 456);
const SCALE = 0.6625;
const ENTRY = { w: Math.round(CARD.w * SCALE), h: Math.round(CARD.h * SCALE) };
const COLUMNS = [610, 907, 1204, 1501];
const LAST_ROW = MOUNT.y + MOUNT.h - 36 - ENTRY.h;
/** How much of the row above shows: its cards' bottoms, cut by the mount's top edge. */
const PEEK = 80;
const SLOT = box(COLUMNS[3], LAST_ROW, ENTRY.w, ENTRY.h);
/** The copy hovers this far over the slot while it waits. */
const HOVER = 44;
/** The copy starts behind the card, at its right edge and its middle, so it slides out from under it. */
const COPY = box(CARD.x + CARD.w - ENTRY.w, CARD.y + Math.round((CARD.h - ENTRY.h) / 2), ENTRY.w, ENTRY.h);
/** The approval lands in the copy's empty lower right corner while it hovers, well inside its edge, and drops in with it. */
const STAMP = { x: SLOT.x + SLOT.w - 52, y: SLOT.y - HOVER + SLOT.h - 58 };

export const STEP_ONE = {
  card: {
    key: "step-one.card",
    at: CARD,
    name: { key: "step-one.card.name", text: YOUR_PROJECT, at: { x: CARD.x + 28, y: CARD.y + 46 } },
    rule: { key: "step-one.card.rule", from: { x: CARD.x + 28, y: CARD.y + 80 }, to: { x: CARD.x + CARD.w - 28, y: CARD.y + 80 } },
    fields: FIELD_NAMES.map((text, i) => {
      const top = CARD.y + 100 + i * 112;
      return {
        key: `step-one.field.${i}`,
        text,
        label: { x: CARD.x + 28, y: top + 14 },
        at: box(CARD.x + 28, top + 34, CARD.w - 56, 56),
        bar: { key: `step-one.field.${i}.bar`, at: box(CARD.x + 48, top + 34 + 23, FIELD_BARS[i], 10) },
      };
    }),
  },
  /** The card's copy as a catalog entry: drawn where it starts, behind the card, and moved by `x` and `y`. */
  copy: {
    key: "step-one.copy",
    at: COPY,
    name: YOUR_PROJECT,
    /** Its edge in the catalog's colour, once it is in: it is an entry now. */
    edge: "step-one.copy.edge",
    hover: { x: SLOT.x - COPY.x, y: SLOT.y - HOVER - COPY.y },
    lands: { x: SLOT.x - COPY.x, y: SLOT.y - COPY.y },
  },
  catalog: {
    key: "step-one.catalog",
    at: MOUNT,
    /** The row above's cards, as much of them as shows. */
    above: COLUMNS.map((x, i) => ({ key: `step-one.catalog.above.${i}`, at: box(x, MOUNT.y, ENTRY.w, PEEK) })),
    entries: COLUMNS.slice(0, 3).map((x, i) => ({ key: `step-one.catalog.entry.${i}`, at: box(x, LAST_ROW, ENTRY.w, ENTRY.h) })),
    slot: { key: "step-one.catalog.slot", at: SLOT },
  },
  /** A person approves it while it waits over the slot; the mark goes in with it. */
  mark: { key: "step-one.mark", at: STAMP, drop: HOVER },
};

/* 36. Send your people to training: three of your people side by side, a laptop opening in front of each in turn, an AI coding tool on its screen, and one label under all three. */

const TRAINED_SCALE = 2;
const SEATS = [560, 960, 1360];
const PERSON_TOP = 488;
const SCREEN = { w: 320, h: 200, top: 600 };
const BASE = { w: 370, h: 18 };
const HINGE = SCREEN.top + SCREEN.h;
const BRACKET = { x0: SEATS[0] - BASE.w / 2, x1: SEATS[2] + BASE.w / 2, y: 862, drop: 16 };

export const TRAINING = {
  seats: SEATS.map((cx, i) => ({
    person: { key: `training.person.${i}`, at: personAt(cx - (PERSON.w * TRAINED_SCALE) / 2, PERSON_TOP, TRAINED_SCALE) },
    laptop: {
      key: `training.laptop.${i}`,
      /** The lid opens about its hinge (`open`): the screen's foot. */
      lid: `training.laptop.${i}.lid`,
      hinge: { x: cx, y: HINGE },
      screen: box(cx - SCREEN.w / 2, SCREEN.top, SCREEN.w, SCREEN.h),
      base: box(cx - BASE.w / 2, HINGE, BASE.w, BASE.h),
    },
  })),
  /** One bracket under all three laptops, and the label under it: they were all trained. */
  bracket: { key: "training.bracket", d: `M${BRACKET.x0} ${BRACKET.y - BRACKET.drop}V${BRACKET.y}H${BRACKET.x1}V${BRACKET.y - BRACKET.drop}`, x0: BRACKET.x0, x1: BRACKET.x1 },
  label: { key: "training.label", text: labelsOf("training")[0], at: { x: (BRACKET.x0 + BRACKET.x1) / 2, y: BRACKET.y + 42 } },
};
