/**
 * Slide 29, Austin's magic sauce, as one click (docs/bchc-talk-script.md,
 * slide 29, They see): the bottle draws in the middle of the stage and fills
 * with gold sauce; its cap turns off and lifts away; it tips and pours one
 * drop over each panel's place in turn, a little shake sending each drop
 * off; each drop falls, lands with a splash and opens into its panel in its
 * part's colour, its heading and drawing following; then the bottle stands
 * back up over the row's right end with a small wobble. The sauce drains drop by
 * drop. Every move has its own `at`, written in the order it plays, so the
 * step's picture is each part's last move. The world's first click starts
 * after the engine's 0.6 s hand-over, so these times count from there.
 */
import type { Move } from "@/components/deck/engine";
import { DUR, EASE, RETITLE, hide, lines, rise, show, to } from "@/components/deck/kit";
import { picture, story } from "../steps";
import { TITLES } from "./layout";
import { BOTTLE_KEYS, DROPS, HOME, LEVEL, PANELS, PANEL_SHUT, POURS, REST, TIP, WOBBLE, poseVars } from "./layout-sauce";

/** A drawing whose lines draw on as its fills come up: one move for the whole drawing. */
const drawn = (key: string, opts: Parameters<typeof to>[3] = {}) => to(key, { "--d": 1, "--k": 1 }, { "--d": 0, "--k": 0 }, { duration: DUR.draw, ease: EASE.draw, ...opts });

const { bottle, line, cap, label, upright, tipped } = BOTTLE_KEYS;
const HOME_POSE = poseVars(HOME);

/** When each beat starts, in seconds from the world's start. */
export const SAUCE_TIMES = {
  /** The bottle's outline and cap draw. */
  bottle: 0.2,
  /** The sauce comes up inside it. */
  fill: 0.9,
  /** The cap turns, then lifts away. */
  twist: 2.0,
  lift: 2.7,
  /** It tips and carries to the first panel's place. */
  tip: 3.0,
  /** The first drop leaves; each next one this much later. */
  firstPour: 4.1,
  pourApart: 1.3,
  /** From a drop leaving to its landing. */
  fall: 0.42,
  /** It stands back up over the row's right end. */
  settle: 8.6,
} as const;
const T = SAUCE_TIMES;

/** When drop `i` leaves the mouth, and when it lands. */
export const pourAt = (i: number) => T.firstPour + i * T.pourApart;
export const landAt = (i: number) => pourAt(i) + 0.06 + T.fall;

/** The bottle draws, fills, and loses its cap. */
const arrive: Move[] = [
  ...show(bottle, { duration: 0.01, at: T.bottle }),
  ...to(bottle, HOME_POSE, HOME_POSE, { duration: 0.01, at: T.bottle }),
  ...to(line, { "--d": 1 }, { "--d": 0 }, { duration: DUR.draw, ease: EASE.draw, at: T.bottle }),
  ...to(cap, { "--d": 1, autoAlpha: 1 }, { "--d": 0, autoAlpha: 1, "--tw": 0, "--cx": 0, "--cy": 0, "--cr": 0 }, { duration: DUR.draw, ease: EASE.draw, at: T.bottle + 0.15 }),
  ...show(label, { duration: DUR.quick, at: T.bottle + 0.7 }),
  ...to(upright, { autoAlpha: 1, "--k": LEVEL.full }, { autoAlpha: 0, "--k": 0 }, { duration: DUR.draw, ease: "power2.out", at: T.fill }),
  // The grip slides a span and a half to the side as the cap rises a little: it turns.
  ...to(cap, { "--tw": -18, "--cy": -8 }, undefined, { duration: 0.7, ease: "power1.inOut", at: T.twist }),
  // Then it lifts up and off to the side, leaning, and fades before the bottle tips.
  ...to(cap, { "--cx": 40, "--cy": -72, "--cr": 28 }, undefined, { duration: 0.55, ease: "power2.out", at: T.lift }),
  ...hide(cap, { duration: 0.3, at: T.lift + 0.1 }),
];

/** It tips and carries to the first place; the standing sauce becomes a pool lying level in it. */
const tip: Move[] = [
  ...to(bottle, poseVars(POURS[0]), undefined, { duration: 0.9, ease: EASE.page, at: T.tip }),
  ...to(tipped, { autoAlpha: 1, "--k": LEVEL.tipped[0] }, { autoAlpha: 0, "--k": LEVEL.tipped[0] }, { duration: 0.3, ease: EASE.soft, at: T.tip + 0.3 }),
  ...hide(upright, { duration: 0.3, at: T.tip + 0.3 }),
];

/** How long after a drop lands its panel's heading rises: the bottle sets off for the next place 0.22 s after the landing and is past the panel 0.5 s later, so the heading never comes up under it. */
export const HEAD_AFTER = 0.75;

/** One drop: the bottle glides over the place (after the first), shakes once, the drop falls, lands, splashes and opens the panel. */
function pour(i: number): Move[] {
  const at = pourAt(i);
  const land = landAt(i);
  const drop = DROPS[i];
  const panel = PANELS[i];
  return [
    ...(i > 0 ? to(bottle, poseVars(POURS[i]), undefined, { duration: 0.5, ease: EASE.draw, at: at - 0.6 }) : []),
    // A shake: a little further over and back, and the pool drops to its next level.
    ...to(bottle, { "--r": TIP.pour + TIP.shake }, undefined, { duration: 0.12, ease: "power2.out", at }),
    ...to(bottle, { "--r": TIP.pour }, undefined, { duration: 0.24, ease: EASE.draw, at: at + 0.12 }),
    ...to(tipped, { "--k": LEVEL.tipped[i + 1] }, undefined, { duration: 0.3, ease: EASE.soft, at }),
    // The drop leaves the mouth and falls, quickening.
    ...to(drop.key, { autoAlpha: 1 }, { autoAlpha: 0, "--y": 0, "--sx": 1, "--sy": 1 }, { duration: 0.06, ease: "none", at: at + 0.04 }),
    ...to(drop.key, { "--y": drop.fall }, undefined, { duration: T.fall, ease: "power2.in", at: at + 0.06 }),
    // It lands: flattens, and goes as the panel opens out of it.
    ...to(drop.key, { "--sx": 2.4, "--sy": 0.3 }, undefined, { duration: 0.12, ease: "power2.out", at: land }),
    ...hide(drop.key, { duration: 0.2, at: land + 0.06 }),
    // Two splashes fly up either side and fade.
    ...drop.splash.flatMap((splash) => [
      ...to(splash.key, { autoAlpha: 1 }, { autoAlpha: 0, "--x": 0, "--y": 0 }, { duration: 0.05, ease: "none", at: land }),
      ...to(splash.key, splash.to, undefined, { duration: 0.4, ease: "power2.out", at: land }),
      ...hide(splash.key, { duration: 0.25, at: land + 0.2 }),
    ]),
    // The panel opens: a line across, then down to its full height, a touch past and back.
    ...to(panel.key, { autoAlpha: 1, "--sx": 1 }, { autoAlpha: 0, ...PANEL_SHUT }, { duration: 0.32, ease: EASE.out, at: land }),
    ...to(panel.key, { "--sy": 1 }, undefined, { duration: 0.5, ease: "back.out(1.4)", at: land + 0.2 }),
    // Its heading and drawing follow once the bottle has glided on past the panel (HEAD_AFTER).
    ...rise(panel.headKey, { at: land + HEAD_AFTER }),
    ...drawn(panel.artKey, { duration: 0.85, at: land + HEAD_AFTER + 0.1 }),
  ];
}

/**
 * It stands back up over the row's right end, a little past upright and
 * back, and what sauce is left stands in it. Its base hardly moves (a step
 * to the left and 8 px up), so standing up swings its neck up through the
 * empty corner right of the title, clear of the words and of the last panel.
 */
const SETTLE_STEPS = [0.8, 0.22, 0.18, 0.16] as const;
export const SETTLE_END = T.settle + SETTLE_STEPS.reduce((sum, d) => sum + d, 0);
const settle: Move[] = [
  ...to(bottle, { "--x": poseVars(REST)["--x"] }, undefined, { duration: SETTLE_STEPS[0], ease: "power2.out", at: T.settle }),
  ...to(bottle, { "--y": poseVars(REST)["--y"] }, undefined, { duration: SETTLE_STEPS[0], ease: "power2.in", at: T.settle }),
  ...WOBBLE.flatMap((r, n) =>
    to(bottle, { "--r": r }, undefined, {
      duration: SETTLE_STEPS[n],
      ease: n === 0 ? EASE.page : "sine.inOut",
      at: T.settle + SETTLE_STEPS.slice(0, n).reduce((sum, d) => sum + d, 0),
    }),
  ),
  ...to(upright, { autoAlpha: 1, "--k": LEVEL.left }, undefined, { duration: 0.3, ease: EASE.soft, at: T.settle + 0.45 }),
  ...hide(tipped, { duration: 0.3, at: T.settle + 0.45 }),
];

export const releasingSteps = picture("releasing", {
  play: {
    moves: [
      ...lines(TITLES.releasing.key, { duration: RETITLE.in, at: 0 }),
      ...story("releasing", 0, { at: 0.5 }),
      ...arrive,
      ...tip,
      ...PANELS.flatMap((_, i) => pour(i)),
      ...settle,
    ],
  },
});
