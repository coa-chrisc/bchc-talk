/**
 * Slide 22b: the whole process. A ring of seven steps, an ellipse wide enough
 * to hold a department, drawn once clockwise from "Describe" at its left end
 * in the process green, each step a pill on the line with its name, the seven
 * an even distance apart along it. "Check" carries the passed tick and
 * "Approve" the person-approves mark, each on its pill's right-hand corner
 * outside the ring, as slide 20 sets the tick on its fixed test. Inside the
 * ring, an outline named "Your department" over its top edge holds the three
 * products from slide 22a, drawn with the same art, each named under it.
 * Every word is the script's.
 */
import { RISE, box, type Point } from "@/components/deck/kit";
import { shown } from "../../script/find";
import { PRODUCTS as YEAR_PRODUCTS } from "./layout-year";

const WORDS = shown("process", "play");
const STEP_TEXTS = WORDS.slice(0, 7);
const [DEPARTMENT_TEXT, ...PRODUCT_TEXTS] = WORDS.slice(7);

/** The ring: an ellipse on the stage's middle, low enough that its top pills clear the story band and its bottom pills the floor, and wide enough that the pills either side of your department clear it. */
const C: Point = { x: 960, y: 756 };
const R = { x: 620, y: 184 } as const;
/** Where the ring starts and ends, in degrees on the ellipse from its right, clockwise on the stage: its left end. */
const START = 180;
const rad = (deg: number) => (deg * Math.PI) / 180;
const pointAt = (deg: number): Point => ({ x: C.x + R.x * Math.cos(rad(deg)), y: C.y + R.y * Math.sin(rad(deg)) });
const round = (n: number) => Math.round(n * 10) / 10;

/**
 * The angle a given fraction of the ring's length along from its start, the
 * ellipse measured in small steps, since its length is not even in its
 * angle. The ring's stroke draws by its length (`pathLength` 1), so a step
 * at fraction f is reached when the stroke's front is at f.
 */
const SAMPLES = 3600;
const angleAlong = (() => {
  const cumulative = [0];
  let prev = pointAt(START);
  for (let n = 1; n <= SAMPLES; n++) {
    const p = pointAt(START + (360 * n) / SAMPLES);
    cumulative.push(cumulative[n - 1] + Math.hypot(p.x - prev.x, p.y - prev.y));
    prev = p;
  }
  const total = cumulative[SAMPLES];
  return (fraction: number) => START + (360 * cumulative.findIndex((length) => length >= fraction * total - 1e-9)) / SAMPLES;
})();

/** A step's pill: 220 by 60, round-ended, centred on the line. */
const PILL = { w: 220, h: 60 } as const;
/** A 32 px name, about 38 px tall. */
const TEXT_H = 38;

export const RING = {
  key: "process.ring",
  c: C,
  r: R,
  stroke: 4,
  /** Two half ellipses, clockwise from the left end over the top and back under it. */
  d: (() => {
    const a = pointAt(START);
    const b = pointAt(START + 180);
    return `M${round(a.x)} ${round(a.y)}A${R.x} ${R.y} 0 0 1 ${round(b.x)} ${round(b.y)}A${R.x} ${R.y} 0 0 1 ${round(a.x)} ${round(a.y)}`;
  })(),
  at: box(C.x - R.x - 6, C.y - R.y - 6, 2 * R.x + 12, 2 * R.y + 12),
};

/** The seven steps, an even seventh of the ring apart: "Describe" at its left end, "Plan", "Build" and "Check" over the top, "Approve", "Release" and "Learn" under it. */
export const STEPS = STEP_TEXTS.map((text, i) => {
  const along = i / STEP_TEXTS.length;
  const p = pointAt(angleAlong(along));
  const pill = box(round(p.x - PILL.w / 2), round(p.y - PILL.h / 2), PILL.w, PILL.h);
  return {
    key: `process.step.${i}`,
    text,
    pill,
    textAt: { x: pill.x, y: round(p.y - TEXT_H / 2), w: PILL.w },
    /** How far along the ring the step is, from "Describe" (0). */
    along,
  };
});

/** Which steps carry a mark: the fourth, "Check", the passed tick; the fifth, "Approve", the person-approves mark. */
const CHECK_STEP = 3;
const APPROVE_STEP = 4;
/**
 * A mark on a pill's right-hand corner where its round end begins, on the
 * ring's outside, clear of the line: the top corner for a step over the
 * ring's middle ("Check"), the bottom one for a step under it ("Approve").
 */
const onCorner = (i: number): Point => {
  const { pill } = STEPS[i];
  const under = pill.y + pill.h / 2 > C.y;
  return { x: pill.x + pill.w - 14, y: under ? pill.y + pill.h - 2 : pill.y + 2 };
};
export const MARKS = {
  checkStep: CHECK_STEP,
  approveStep: APPROVE_STEP,
  tickKey: "process.tick",
  tick: onCorner(CHECK_STEP),
  tickR: 16,
  approveKey: "process.mark",
  approve: onCorner(APPROVE_STEP),
  approveR: 18,
};

/**
 * Your department: an outline in the ring's middle, named over its top
 * edge, holding the three products in a row, each the art slide 22a drew
 * (`kind`), named under it. The name and the outline sit at least 40 px
 * clear of every pill.
 */
const PRODUCT = { w: 96, h: 56, pitch: 200, label: 200 } as const;
const OUTLINE = box(C.x - 320, 706, 640, 140);
export const DEPARTMENT = {
  key: "process.department",
  outline: OUTLINE,
  text: DEPARTMENT_TEXT,
  /** Centred 10 px over the outline. */
  textAt: { x: C.x - 200, y: OUTLINE.y - 10 - TEXT_H, w: 400 },
};
export const PRODUCTS = PRODUCT_TEXTS.map((text, i) => {
  const cx = C.x + (i - 1) * PRODUCT.pitch;
  const icon = box(cx - PRODUCT.w / 2, OUTLINE.y + 22, PRODUCT.w, PRODUCT.h);
  return {
    key: `process.product.${i}`,
    text,
    kind: YEAR_PRODUCTS[i].kind,
    icon,
    labelAt: { x: cx - PRODUCT.label / 2, y: icon.y + icon.h + 4, w: PRODUCT.label },
  };
});
/** How far over its place a product starts as it settles in. */
export const SETTLE = { y: -RISE } as const;

/** Every part slide 22b draws. */
export const PROCESS_KEYS = [RING.key, ...STEPS.map((step) => step.key), MARKS.tickKey, MARKS.approveKey, DEPARTMENT.key, ...PRODUCTS.map((product) => product.key)];
