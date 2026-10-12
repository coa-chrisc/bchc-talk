/**
 * Slide 32, how to build your own design system and skills
 * (docs/bchc-talk-script.md, slide 32, They see): an open binder labelled
 * "Our templates", in pink, on the left, its four pages under tabs reading
 * brand, components, accessibility and skills. Each page slides out, one
 * at a time, and lands as a blank copy in the same place in a second binder
 * on the right, labelled "Yours"; then your team fills the copy in, in your
 * own colors. The slide ends on the two binders side by side: the same tabs,
 * different colors. Every place is a plain number; every word is the script's.
 */
import { CONTENT_TOP, box, type Box } from "@/components/deck/kit";
import { shown } from "../../script/find";

const LABELS = shown("design-yours", "play");
/** The script's labels, in its order: our binder, its four tabs, and yours. */
const OURS_NAME = LABELS[0];
const TAB_NAMES = LABELS.slice(1, 5);
const YOURS_NAME = LABELS[5];

/**
 * A binder: a cover 560 by 386 with three rings down a 36 px spine on its
 * left, and two rows of two pages, each 232 by 130 under a 36 px tab.
 */
export const BINDER = { w: 560, h: 386, y: CONTENT_TOP.two + 68, spine: 36, rx: 14 } as const;
export const PAGE = { w: 232, h: 130, tab: { w: 200, h: 36 }, rx: 6 } as const;
const GRID = { left: BINDER.spine + 16, top: 18, gapX: 20, gapY: 14 } as const;

const binder = (id: string, x: number, name: string) => ({
  key: `rel.binder.${id}`,
  at: box(x, BINDER.y, BINDER.w, BINDER.h),
  /** The binder's name, above it at its left. */
  name: { key: `rel.binder.${id}.name`, text: name, at: box(x, BINDER.y - 56, BINDER.w, 44) },
  rings: [0.25, 0.5, 0.75].map((share) => ({ x: x + BINDER.spine / 2, y: BINDER.y + share * BINDER.h })),
});
/** Ours on the left and yours on the right, 400 apart, the pair centred on the stage. */
export const OURS = binder("ours", 200, OURS_NAME);
export const YOURS = binder("yours", 1160, YOURS_NAME);
/** How far a page travels from our binder to the same place in yours. */
export const ACROSS = YOURS.at.x - OURS.at.x;

/** A page's place in a binder at `x`: its tab and its sheet, by its number, left to right and then down. */
const placeOf = (x: number, i: number) => {
  const col = i % 2;
  const row = Math.floor(i / 2);
  const left = x + GRID.left + col * (PAGE.w + GRID.gapX);
  const tabTop = BINDER.y + GRID.top + row * (PAGE.tab.h + PAGE.h + GRID.gapY);
  const sheet: Box = box(left, tabTop + PAGE.tab.h, PAGE.w, PAGE.h);
  return { tab: box(left, tabTop, PAGE.tab.w, PAGE.tab.h), sheet, centre: { x: left + PAGE.w / 2, y: tabTop + (PAGE.tab.h + PAGE.h) / 2 } };
};

/** What each page holds, by its tab: brand, components, accessibility, skills. */
export const PAGE_KINDS = ["brand", "components", "accessibility", "skills"] as const;
export type PageKind = (typeof PAGE_KINDS)[number];

/** The four pages: ours, filled in our colors, and yours, which arrives blank (`key`) and is filled in (`fillKey`). */
export const PAGES = TAB_NAMES.map((tab, i) => {
  const ours = placeOf(OURS.at.x, i);
  const yours = placeOf(YOURS.at.x, i);
  return {
    kind: PAGE_KINDS[i],
    tab,
    ours: { key: `rel.page.ours.${i}`, ...ours },
    yours: {
      key: `rel.page.yours.${i}`,
      fillKey: `rel.page.yours.${i}.fill`,
      ...yours,
      /** Where the copy starts: over our page. */
      from: { "--x": -ACROSS, "--y": 0 },
    },
  };
});

/** Every part slide 32 puts on the stage. */
export const BINDERS_OWN: readonly string[] = [
  OURS.key,
  OURS.name.key,
  YOURS.key,
  YOURS.name.key,
  ...PAGES.flatMap((page) => [page.ours.key, page.yours.key, page.yours.fillKey]),
];
