/**
 * Slide 29, Austin's magic sauce (docs/bchc-talk-script.md, slide 29;
 * docs/bchc-brand.md): a bottle drawn in navy line, full of gold sauce,
 * loses its cap, tips to the left, and pours four drops one at a time along
 * the row where the four panels will stand, just under the story line. Each
 * drop lands, splashes and opens into its panel in its part's colour, then
 * the bottle stands back up and settles over the row's right end, beside the
 * title and the story line. Every place here is a plain number; every word
 * is the script's.
 */
import { CONTENT_TOP, box, type Box, type Hue, type Point } from "@/components/deck/kit";
import { breakAfter, pictureOf, shown } from "../../script/find";

/** Each part's colour, in the script's order: the agent pack, the source code, the design system and skills, the setup guides. */
export const SHARE_HUES = ["share-pack", "share-code", "share-design", "share-help"] as const satisfies readonly Hue[];

/* The panels */

/** Four panels in a row across the stage's whole width, 40 px under the story line's room, so the picture fills the stage from the story line down. */
export const PANEL = { w: 408, h: 460, y: CONTENT_TOP.one + 40, pitch: 440, x0: 96, pad: 16 } as const;
const HEADINGS = shown("releasing", "play");
/** Where each heading breaks to fit its panel's 376 px at 32 px: after each word given (the author's, so a fallback face never decides a break). */
const HEADING_BREAKS: readonly (readonly string[])[] = [["for your"], ["code,"], ["system", "with"], ["guides"]];

export const PANELS = HEADINGS.map((heading, i) => {
  const x = PANEL.x0 + i * PANEL.pitch;
  const at = box(x, PANEL.y, PANEL.w, PANEL.h);
  const centre: Point = { x: x + PANEL.w / 2, y: PANEL.y + PANEL.h / 2 };
  return {
    key: `rel.panel.${i}`,
    headKey: `rel.panel.${i}.head`,
    artKey: `rel.panel.${i}.art`,
    hue: SHARE_HUES[i],
    at,
    /** Where its drop lands and the panel opens from. */
    centre,
    head: { at: box(x + PANEL.pad, PANEL.y + 24, PANEL.w - 2 * PANEL.pad, 140), lines: breakAfter(heading, ...HEADING_BREAKS[i]) },
    /** The middle of the room under the heading, where the panel's drawing sits. */
    art: { x: centre.x, y: PANEL.y + 310 },
  };
});
/** How far a closed panel is open while it is still a drop's splash: a short line across, then the whole panel. */
export const PANEL_SHUT = { "--sx": 0.04, "--sy": 0.02 } as const;

/** The panels' drawings, each centred on its panel's `art` point, each inside the 376 px within a panel, and each a small preview of its own slide. */
export const PANEL_ART = {
  /** The agent pack: slide 30's package, its flaps shut. */
  package: { w: 210, h: 128 },
  /** The source code: a shelf of six library tiles, drawn at 2.3 times the wall's size. */
  shelf: { tiles: 6, scale: 2.3, rise: 40, reach: 176 },
  /** The design system and skills: slide 32's two binders in small, ours filled and yours blank, their pages drawn `scale` times a 36 by 32 sheet. */
  binders: { w: 150, h: 124, gap: 48, ring: 5, scale: 1.35 },
  /** The setup guides: slide 33's table from above, three people a side, 84 apart. */
  table: { w: 280, h: 78, reach: 42, pitch: 84, person: { w: 28, h: 36 }, laptop: { w: 36, h: 22 } },
} as const;

/* The bottle */

/**
 * The bottle in its own pixels, upright: (0, 0) is the middle of its base and
 * up is negative. A body 140 wide and 150 high with round shoulders, a neck
 * 44 wide with a lip at its mouth, and a cap over the mouth. The label sits on
 * the body and carries the script's name for it on three lines.
 */
export const BOTTLE = {
  body: { half: 70, top: -150, corner: 16 },
  neck: { half: 22, base: -190, mouth: -228 },
  lip: { half: 26 },
  cap: box(-28, -262, 56, 36),
  label: box(-56, -136, 112, 96),
  labelLines: breakAfter(pictureOf("releasing").name, "Austin's", "magic"),
  /** The label's lines, 30 px apart about its middle. */
  labelPitch: 30,
} as const;

const { body, neck } = BOTTLE;
/** The bottle's outline, open at the mouth: down the neck, round the shoulders and the base, and up the other side. */
export const BOTTLE_OUTLINE = [
  `M${-neck.half} ${neck.mouth}V${neck.base}`,
  `C${-neck.half} ${neck.base + 20} ${-body.half} ${neck.base + 18} ${-body.half} ${body.top + 10}`,
  `V${-body.corner}Q${-body.half} 0 ${-body.half + body.corner} 0`,
  `H${body.half - body.corner}Q${body.half} 0 ${body.half} ${-body.corner}`,
  `V${body.top + 10}C${body.half} ${neck.base + 18} ${neck.half} ${neck.base + 20} ${neck.half} ${neck.base}V${neck.mouth}`,
].join("");
/** The inside, closed across the mouth: what the sauce is cut to. */
export const BOTTLE_INSIDE = `${BOTTLE_OUTLINE}Z`;
/** The sauce's full box: the whole inside from the base to the mouth, so a level is a share of the bottle's height. */
export const SAUCE_BOX: Box = box(-body.half, neck.mouth, 2 * body.half, -neck.mouth);
/** The mouth, where the sauce leaves. */
export const MOUTH: Point = { x: 0, y: neck.mouth };

/** A point of the bottle's own drawing turned `deg` degrees clockwise about its base. */
export const turn = (p: Point, deg: number): Point => {
  const rad = (deg * Math.PI) / 180;
  return { x: p.x * Math.cos(rad) - p.y * Math.sin(rad), y: p.x * Math.sin(rad) + p.y * Math.cos(rad) };
};

/** Where the bottle stands: its base's middle on the stage, and how far it leans clockwise, in degrees. */
export type Pose = { x: number; y: number; r: number };

/**
 * How far it tips to pour, and how much further a shake takes it as each
 * drop leaves: anticlockwise, so its mouth points down to the left and its
 * body hangs to the right, over the places whose panels are still to open,
 * never over a panel that has opened.
 */
export const TIP = { pour: -115, shake: -9 } as const;
/**
 * Where the mouth is while it pours: 80 px into the top of the panel's place,
 * so the whole tipped bottle stays under the story line (its highest point
 * is 160 px over its mouth) and the drop falls onto the panel's middle.
 */
const MOUTH_Y = 560;
const mouthOffset = turn(MOUTH, TIP.pour);

/** Upright in the middle of the stage, where it is drawn: every other pose is a move from here. */
export const HOME: Pose = { x: 960, y: 850, r: 0 };
/** Tipped over each panel's place in turn, its mouth straight above where the drop lands. */
export const POURS: Pose[] = PANELS.map((panel) => ({ x: panel.centre.x - mouthOffset.x, y: MOUTH_Y - mouthOffset.y, r: TIP.pour }));
/** Settled upright over the row's right end, its side on the row's right edge and its base 24 px over the panels' tops: beside the title and the story line, far from the slide number. */
export const REST: Pose = { x: PANEL.x0 + 3 * PANEL.pitch + PANEL.w - BOTTLE.body.half, y: PANEL.y - 24, r: 0 };
/** The little wobble it settles with: past upright, back, and still. */
export const WOBBLE = [6, -3.5, 1.5, 0] as const;
/**
 * The title's and the story line's right ends at 1920 by 1080, measured in
 * the deck's face (the title at 1287, the story line at 1264): the bottle
 * keeps right of this wherever it rises to their height.
 */
export const WORDS_END_X = 1400;

/** A pose as the bottle part's values: how far from HOME, and the lean. */
export const poseVars = (pose: Pose) => ({ "--x": pose.x - HOME.x, "--y": pose.y - HOME.y, "--r": pose.r });

/** Where a point of the bottle's drawing is on the stage in a pose. */
export const onStage = (p: Point, pose: Pose): Point => {
  const q = turn(p, pose.r);
  return { x: pose.x + q.x, y: pose.y + q.y };
};
/** The bottle's corners and the ends of its curves, for checking where it reaches in a pose (the cap is off once it tips). */
export const BOTTLE_POINTS: readonly Point[] = [
  { x: -body.half, y: 0 },
  { x: body.half, y: 0 },
  { x: -body.half, y: body.top + 10 },
  { x: body.half, y: body.top + 10 },
  { x: -neck.half, y: neck.base },
  { x: neck.half, y: neck.base },
  { x: -BOTTLE.lip.half, y: neck.mouth },
  { x: BOTTLE.lip.half, y: neck.mouth },
];

/**
 * The sauce as it lies in the tipped bottle: a pool drawn in a frame turned
 * back by the tip about the base, so its top is level on the stage while the
 * bottle pours. Its box reaches past the bottle on every side; the bottle's
 * inside cuts it to shape.
 */
export const POOL: Box = box(-260, -80, 380, 220);
/** The pool's top on the stage, below the base, before the first drop and after each one. */
const SURFACES = [20, 45, 68, 88, 104] as const;
/** How full the sauce is: upright, a share of the bottle's height; tipped, a share of the pool's box, before the first drop and after each one; and what is left when it stands back up. */
export const LEVEL = {
  full: 0.62,
  tipped: SURFACES.map((surface) => (POOL.y + POOL.h - surface) / POOL.h),
  left: 0.12,
} as const;

/* The drops */

/** A drop: gold, 13 px round with its tip up and a navy edge so it reads on white, leaving the mouth and falling onto its panel's middle, where it splashes. */
export const DROP = { r: 13, gap: 12 } as const;
export const DROPS = PANELS.map((panel, i) => {
  const start: Point = { x: panel.centre.x, y: MOUTH_Y + DROP.gap };
  return {
    key: `rel.drop.${i}`,
    start,
    fall: panel.centre.y - start.y,
    /** Two small splashes thrown up either side of where it lands. */
    splash: [-1, 1].map((side) => ({ key: `rel.splash.${i}.${side < 0 ? "l" : "r"}`, at: panel.centre, to: { "--x": side * 34, "--y": -26 } })),
  };
});

export const BOTTLE_KEYS = {
  bottle: "rel.bottle",
  line: "rel.bottle.line",
  cap: "rel.bottle.cap",
  label: "rel.bottle.label",
  upright: "rel.sauce.upright",
  tipped: "rel.sauce.tipped",
} as const;

/** Every part slide 29 puts on the stage. */
export const SAUCE_OWN: readonly string[] = [
  ...Object.values(BOTTLE_KEYS),
  ...DROPS.flatMap((drop) => [drop.key, ...drop.splash.map((s) => s.key)]),
  ...PANELS.flatMap((panel) => [panel.key, panel.headKey, panel.artKey]),
];
/** The parts that only pass through: gone again by the slide's end. */
export const SAUCE_PASSING: readonly string[] = [BOTTLE_KEYS.cap, BOTTLE_KEYS.tipped, ...DROPS.flatMap((drop) => [drop.key, ...drop.splash.map((s) => s.key)])];
