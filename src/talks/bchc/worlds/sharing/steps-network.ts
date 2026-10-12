/**
 * Slide 27's two clicks. Every department's name rises inside its circle as
 * the circle draws on. Click 1: the first department joins the middle and
 * adds its modules; five more join, each adding one, and the middle grows.
 * Click 2, in three beats: the other six join, each adding one, and the
 * middle grows again; every department draws a heavy line out to its
 * vendor's square, a dollar sign sliding along each toward the square. Then
 * the first department's line is pulled in through its circle to the middle,
 * leaving a faint dashed copy where it ran out, and its square fades; the
 * other lines follow clockwise round the ring. Last, a tool the first
 * department makes travels into the middle, and three copies of it travel
 * out to three other departments.
 */
import { DUR, EASE, draw, fill, ghost, hide, rise, ride, show, to } from "@/components/deck/kit";
import { picture, story } from "../steps";
import { PLACED, POST, into, keys, play } from "./beats";
import { ANGLES, CENTRE_R, JOINED, NETWORK, SHOWN_TILES } from "./layout-network";
import { LINKS } from "./layout-network-ties";

const N = NETWORK;
const L = LINKS;
const depts = N.departments;
const spokes = depts.map((dept) => dept.spoke);
const tiles = (from: number, upTo: number) => keys(N.tiles.slice(from, upTo));

/** The middle grows to its next radius. */
const grow = (stage: 1 | 2, at: number) => to(N.centre.key, { "--s": CENTRE_R[stage] / CENTRE_R[0] }, PLACED(1), { at, duration: DUR.travel, ease: EASE.page });
/** A circle draws on in `draw` seconds; its name rises inside it from `name` after the circle starts, landing as the circle closes. */
const DISC = { draw: 0.8, name: 0.1 } as const;
const named = (from: number, upTo: number, at: number, stagger = 0) => rise(keys(N.names.slice(from, upTo)), { at: at + DISC.name, duration: DISC.draw - DISC.name, stagger });
/** Departments join the middle, each with its name and its spoke, `JOIN` apart. */
const JOIN = 0.16;
const join = (from: number, upTo: number) => [
  draw(keys(depts.slice(from, upTo)), { at: 0, duration: DISC.draw, stagger: JOIN }),
  named(from, upTo, 0, JOIN),
  draw(spokes.slice(from, upTo), { at: 0.3, duration: 0.6, stagger: JOIN }),
];
/** As departments join, the middle grows and one tile fills for each, `JOIN` apart. */
const adding = (stage: 1 | 2, tileKeys: readonly string[]) => [grow(stage, 0.1), fill(tileKeys, { at: 0.5, duration: 0.5, stagger: JOIN })];

/** The middle's new tiles in the second click but the one the first department's tool becomes. */
const newTiles = keys(N.tiles.slice(SHOWN_TILES.join, SHOWN_TILES.all).filter((tile) => tile.key !== L.tool.tile));

/**
 * A dollar sign slides toward its vendor in `ride` seconds, easing in and
 * out, and fades over `gone` seconds that end as its box would meet the
 * square, so it is gone before it touches it.
 */
export const MONEY = { ride: 1.0, ease: "power1.inOut", gone: 0.25 } as const;
/** The share of a slide on power1.inOut gone by when it has covered `p` of its path: the curve (2t² up to half way, then mirrored) turned round. */
export const reached = (p: number) => (p < 0.5 ? Math.sqrt(p / 2) : 1 - Math.sqrt((1 - p) / 2));

/**
 * Click 2's first beat, from the click: the squares come in and their label
 * beside the square of the department under the first, and each
 * department's line draws out to its square in the order they join, `gap` apart: the window along its path
 * opens from the circle's edge out to the square. As a line lands its
 * dollar sign slides along it toward the square.
 */
const PAY = { squares: 0.2, label: 0.6, lines: 0.5, gap: 0.12, line: 0.6 } as const;
const paying = L.ties.flatMap((tie, k) => {
  const drawn = PAY.lines + k * PAY.gap;
  const paid = drawn + PAY.line;
  const { out } = tie.line.window;
  return [
    to(tie.line.key, { "--tail": 0, "--head": out }, { "--tail": out, "--head": out }, { at: drawn, duration: PAY.line, ease: EASE.draw }),
    ride(tie.money.key, { at: paid, duration: MONEY.ride, ease: MONEY.ease }),
    hide(tie.money.key, { at: paid + MONEY.ride * reached(tie.money.touch) - MONEY.gone, duration: MONEY.gone }),
  ];
});

/**
 * The second beat: the first department's line is pulled in alone, then
 * every other one clockwise round the ring from it, `gap` apart, ending at
 * the department under it. A line is pulled in in one move of `pull` seconds:
 * the window along its path slides from the part out to the square on to
 * the part in to the middle, so the line's far end runs back through the
 * circle while its front runs on in. Its dashed copy shows where it ran
 * and its square fades, the squares' label with the last square, beside it.
 * `rest` lets the first finish before the others start. Then the label under
 * the first department's dashed copy, and the label under its line in.
 */
const PULL = { first: 0, rest: 0.9, gap: 0.15, pull: 0.9, copy: 0.5, faint: 0.1, before: 2.7, now: 3.1 } as const;
/** How far round the ring clockwise a department's place is from the first department's, in degrees. */
const fromFirst = (degrees: number) => (((degrees - ANGLES[0]) % 360) + 360) % 360;
const clockwise = [...L.ties].sort((a, b) => fromFirst(a.degrees) - fromFirst(b.degrees)).map((tie) => tie.dept);
/** When each department's line is pulled in, by department, in the order they join. */
export const pullingIn = L.ties.map((tie) => {
  const k = clockwise.indexOf(tie.dept);
  return k === 0 ? PULL.first : PULL.rest + (k - 1) * PULL.gap;
});
const pulling = L.ties.flatMap((tie) => {
  const at = pullingIn[tie.dept];
  const { out, through } = tie.line.window;
  return [
    to(tie.line.key, { "--tail": through, "--head": 1 }, { "--tail": 0, "--head": out }, { at, duration: PULL.pull, ease: EASE.draw }),
    show(tie.was.key, { at, duration: PULL.copy }),
    ghost(tie.square.key, { at: at + PULL.faint }),
  ];
});

/**
 * The third beat: the tool fills inside the first department's circle, waits
 * there `wait` seconds, and travels along its line to its place in the
 * middle; once it lands its three copies show inside the middle and travel
 * out, `gap` apart, to settle inside their departments' circles.
 */
const TRADE = { made: 0.4, wait: 0.6, gap: 0.15, show: 0.25, copy: 0.9 } as const;
const travels = TRADE.made + TRADE.wait;
const lands = travels + POST.duration;
const trading = [
  fill(L.tool.tile, { at: 0, duration: TRADE.made }),
  to(L.tool.key, { "--x": 0, "--y": 0 }, L.tool.from, { at: travels, ...POST }),
  ...L.copies.flatMap((copy, j) => [
    show(copy.key, { at: lands + j * TRADE.gap, duration: TRADE.show }),
    to(copy.key, { "--x": 0, "--y": 0 }, copy.from, { at: lands + j * TRADE.gap, duration: TRADE.copy, ease: EASE.draw }),
  ]),
];

/** Story line B waits `story` seconds into the second beat, so the first department's line has been seen pulled in; the beat itself opens `hold` after the first. */
const BEAT_2 = { hold: 0.5, story: 1.0 } as const;

export const network = picture("network", {
  // Click 1: the first department joins, then five more, as the middle grows.
  grow: play(
    {
      moves: [
        ...into("network").moves,
        draw(N.centre.ringKey, { at: 0.1, duration: 0.8 }),
        draw(depts[0].key, { at: 0.3, duration: DISC.draw }),
        named(0, JOINED.austin, 0.3),
        draw(spokes[0], { at: 0.7, duration: 0.6 }),
        fill(tiles(0, SHOWN_TILES.austin), { at: 1.0, duration: 0.5, stagger: 0.1 }),
      ],
    },
    { with: true, hold: 0.7, moves: [story("network", 0)] },
    {
      hold: 0.6,
      moves: [...join(JOINED.austin, JOINED.join), ...adding(1, tiles(SHOWN_TILES.austin, SHOWN_TILES.join))],
    },
  ),
  // Click 2: the other six join and every department pays its vendor; the lines are pulled in to the middle; a tool goes in and copies of it out to three others.
  outside: play(
    {
      moves: [
        ...join(JOINED.join, JOINED.all),
        ...adding(2, newTiles),
        show(L.ties.map((tie) => tie.square.key), { at: PAY.squares, stagger: 0.05 }),
        rise(L.vendors.key, { at: PAY.label }),
        ...paying,
      ],
    },
    {
      hold: BEAT_2.hold,
      moves: [...pulling, ghost(L.vendors.key, { at: pullingIn[L.vendors.dept] + PULL.faint }), rise(L.before.key, { at: PULL.before }), rise(L.now.key, { at: PULL.now })],
    },
    { with: true, hold: BEAT_2.story, moves: [story("network", 1)] },
    { hold: 0.4, moves: trading },
  ),
});
