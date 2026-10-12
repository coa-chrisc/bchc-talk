/**
 * What slide 27's second click adds to the ring (layout-network.ts): a small
 * grey vendor square just outside the ring near each department, labelled
 * "Vendors" once, beside Los Angeles County's; each department's heavy
 * line, a dollar sign that slides along it toward the square, and the faint
 * dashed copy the line leaves where it ran out; and the tool Austin makes,
 * which travels into the middle, and its three copies, which travel out to
 * three other departments and settle inside their circles under the name.
 *
 * Each heavy line is one path: from its square in to its circle, a short
 * piece through the circle (hidden under it), then on in to the middle. It
 * is drawn as a window along that path (`--tail` to `--head`, the path 1
 * long): first only the part out to the square, then the window slides on,
 * so the one line is pulled back through its circle and on to the middle.
 * Austin's dashed copy is labelled "Before" and its line in "Now".
 *
 * The ring is packed: its top and foot circles reach the band's gap and the
 * safe foot, so only the four departments at the oval's two ends have room
 * for a square straight out from the middle. The pair beside them have
 * theirs out to the side. The top and foot pair beyond those have no room
 * straight out: theirs stand just under the band's gap or over the safe
 * foot, above or under their outer neighbour's circle, the nearest a square
 * can be to them with room for the dollar sign to slide. The right side is
 * the left turned half round the middle.
 */
import { TILE, box, type Point } from "@/components/deck/kit";
import { shown } from "../../script/find";
import { LABEL_LINE, round } from "./layout";
import { ANGLES, CENTRE_R, DEPT_R, JOINED, NETWORK, onOval } from "./layout-network";

const [VENDORS, BEFORE, NOW] = shown("network", "outside").slice(JOINED.all - JOINED.join);
const C = NETWORK.centre.at;

/** A heavy line's weight. */
export const WEIGHT = 8;
/** A vendor square's side. */
export const SQUARE = 20;
/** The dollar sign's box: a bar `h` tall through an S `w` wide, its centre on the line it slides along. */
export const DOLLAR = { w: 18, h: 26 } as const;

/** A line: a cubic curve, its start, its two handles and its end. */
export type Curve = readonly [Point, Point, Point, Point];
/** The point `t` of the way along a curve. */
export const pointOn = ([a, b, c, d]: Curve, t: number): Point => {
  const u = 1 - t;
  return { x: u * u * u * a.x + 3 * u * u * t * b.x + 3 * u * t * t * c.x + t * t * t * d.x, y: u * u * u * a.y + 3 * u * u * t * b.y + 3 * u * t * t * c.y + t * t * t * d.y };
};
const runOn = ([a, b, c, d]: Curve, t: number): Point => {
  const u = 1 - t;
  const x = 3 * u * u * (b.x - a.x) + 6 * u * t * (c.x - b.x) + 3 * t * t * (d.x - c.x);
  const y = 3 * u * u * (b.y - a.y) + 6 * u * t * (c.y - b.y) + 3 * t * t * (d.y - c.y);
  const length = Math.hypot(x, y);
  return { x: x / length, y: y / length };
};
/** A curve cut at `t` into the part before and the part after, each a curve of its own (de Casteljau). */
const cutAt = ([a, b, c, d]: Curve, t: number): [Curve, Curve] => {
  const mix = (p: Point, q: Point) => ({ x: p.x + (q.x - p.x) * t, y: p.y + (q.y - p.y) * t });
  const [ab, bc, cd] = [mix(a, b), mix(b, c), mix(c, d)];
  const [abc, bcd] = [mix(ab, bc), mix(bc, cd)];
  const at = mix(abc, bcd);
  return [
    [a, ab, abc, at],
    [at, bcd, cd, d],
  ];
};
/** The part of a curve from `from` to `upTo`. */
const partOf = (curve: Curve, from: number, upTo: number): Curve => cutAt(cutAt(curve, from)[1], (upTo - from) / (1 - from))[0];
/** A curve as the points it is measured by: 400 straight pieces, close enough to measure along. */
const PIECES = 400;
const pointsOf = (curve: Curve) => Array.from({ length: PIECES + 1 }, (_, n) => pointOn(curve, n / PIECES));
/** How far along a run of points each one is, from the first. */
const runningLength = (points: readonly Point[]) => {
  const along = [0];
  for (let n = 1; n < points.length; n++) along.push(along[n - 1] + Math.hypot(points[n].x - points[n - 1].x, points[n].y - points[n - 1].y));
  return along;
};
const lengthOf = (curve: Curve) => runningLength(pointsOf(curve)).at(-1)!;

const unit = (from: Point, to: Point): Point => {
  const length = Math.hypot(to.x - from.x, to.y - from.y);
  return { x: (to.x - from.x) / length, y: (to.y - from.y) / length };
};
const plus = (p: Point, u: Point, k: number): Point => ({ x: p.x + u.x * k, y: p.y + u.y * k });
const gap = (p: Point, q: Point) => Math.hypot(p.x - q.x, p.y - q.y);
const rounded = (p: Point): Point => ({ x: round(p.x), y: round(p.y) });
const turned = (p: Point): Point => ({ x: round(2 * C.x - p.x), y: round(2 * C.y - p.y) });
const straight = (a: Point, b: Point): Curve => [a, plus(a, unit(a, b), gap(a, b) / 3), plus(b, unit(b, a), gap(a, b) / 3), b];
const roundedCurve = (curve: Curve) => curve.map(rounded) as unknown as Curve;
const pathOf = ([a, b, c, d]: Curve) => `M${a.x} ${a.y}C${b.x} ${b.y} ${c.x} ${c.y} ${d.x} ${d.y}`;
const deptAt = (degrees: number) => ANGLES.indexOf(degrees as (typeof ANGLES)[number]);

/**
 * The left side's six squares, each line out straight from its circle's
 * edge to its square's centre (the square covers the line's end). The two
 * at the oval's end go straight out from the middle, `reach` from their
 * circle's centre to their square's; the others to a square set by hand:
 * the pair beside them out to the side, and the top and foot pair just
 * under the band's gap or over the safe foot, above or under their outer
 * neighbour's circle, close enough for a short line and far enough for the
 * dollar sign to slide along it. The numbers were fitted against the rules
 * network-ties.test.ts holds the lines to.
 */
type Spec = { degrees: number; reach?: number; square?: Point };
const LEFT: Spec[] = [
  { degrees: -165, reach: 205 },
  { degrees: 165, reach: 205 },
  { degrees: -135, square: { x: 560, y: 530 } },
  { degrees: 135, square: { x: 560, y: 934 } },
  { degrees: -105, square: { x: 747, y: 484 } },
  { degrees: 105, square: { x: 747, y: 980 } },
];

const leftTies = LEFT.map(({ degrees, reach, square }) => {
  const centre = onOval(degrees);
  const end = reach === undefined ? square! : rounded(plus(centre, unit(C, centre), reach));
  return { degrees, square: end, curve: roundedCurve(straight(plus(centre, unit(centre, end), DEPT_R), end)) };
});
const allTies = [...leftTies, ...leftTies.map(({ degrees, square, curve }) => ({ degrees: degrees > 0 ? degrees - 180 : degrees + 180, square: turned(square), curve: curve.map(turned) as unknown as Curve }))];

/** How far past its circle's edge the dollar sign's box starts. */
export const MONEY_CLEAR = 8;
/** How far short of its square's centre the dollar sign's path ends. */
export const MONEY_STOP = SQUARE / 2 + 2;
/** How far the dollar sign's upright box, centred on `p`, is from a point (0 inside it). */
export const fromDollar = (p: Point, q: Point) => Math.hypot(Math.max(Math.abs(q.x - p.x) - DOLLAR.w / 2, 0), Math.max(Math.abs(q.y - p.y) - DOLLAR.h / 2, 0));
/** Whether the dollar sign's box, centred on `p`, meets a square centred on `q`. */
export const dollarMeets = (p: Point, q: Point) => Math.abs(p.x - q.x) < (DOLLAR.w + SQUARE) / 2 && Math.abs(p.y - q.y) < (DOLLAR.h + SQUARE) / 2;
/** Where a line in ends: under the middle's edge at its largest, as it is by the time the lines are pulled in. */
const INNER_END = CENTRE_R[2] - 4;
/** A fraction of a path's length, to four places: enough for a window along a path a few hundred pixels long. */
const fraction = (n: number) => Math.round(n * 1e4) / 1e4;

/**
 * A department's one heavy line: its line out run backwards (square to
 * circle), straight through the circle to where its line in starts, then
 * its line in. `window` gives the fractions of the path's length where the
 * line out ends (`out`) and the line in starts (`through`).
 */
const lineOf = (out: Curve, inner: Curve) => {
  const [a, b, c, d] = out;
  const [lengthOut, lengthThrough, lengthIn] = [lengthOf(out), gap(a, inner[0]), lengthOf(inner)];
  const total = lengthOut + lengthThrough + lengthIn;
  const [, p, q, end] = inner;
  return {
    d: `M${d.x} ${d.y}C${c.x} ${c.y} ${b.x} ${b.y} ${a.x} ${a.y}L${inner[0].x} ${inner[0].y}C${p.x} ${p.y} ${q.x} ${q.y} ${end.x} ${end.y}`,
    window: { out: fraction(lengthOut / total), through: fraction((lengthOut + lengthThrough) / total) },
  };
};

/**
 * The dollar sign's path along a line out: from where its box is
 * `MONEY_CLEAR` past its circle's edge to `MONEY_STOP` short of its square's
 * centre. `touch` is the fraction of the path's length where the sign's box
 * first meets the square: it has faded by then (steps-network.ts).
 */
const moneyOf = (out: Curve, centre: Point, square: Point) => {
  let from = 0;
  while (fromDollar(pointOn(out, from), centre) < DEPT_R + MONEY_CLEAR) from += 0.001;
  let upTo = 1;
  while (gap(pointOn(out, upTo), square) < MONEY_STOP) upTo -= 0.001;
  const curve = roundedCurve(partOf(out, from, upTo));
  const points = pointsOf(curve);
  const along = runningLength(points);
  const meets = points.findIndex((p) => dollarMeets(p, square));
  return { curve, d: pathOf(curve), touch: meets < 0 ? 1 : fraction(along[meets] / along.at(-1)!) };
};

/** A line out up to where it meets its square's edge: the dashed copy stops there, so none of it shows through the square once the square has faded. */
const toEdge = (out: Curve, square: Point) => {
  const inside = (t: number) => {
    const p = pointOn(out, t);
    return Math.max(Math.abs(p.x - square.x), Math.abs(p.y - square.y)) <= SQUARE / 2;
  };
  let upTo = 1;
  while (inside(upTo)) upTo -= 0.001;
  return roundedCurve(partOf(out, 0, upTo));
};

/** Each department's vendor square, its heavy line, the dashed copy its line out leaves and its dollar sign, by department, in the order they join. */
const ties = ANGLES.map((degrees, i) => {
  const { square, curve } = allTies.find((tie) => tie.degrees === degrees)!;
  const centre = onOval(degrees);
  const rimIn = plus(centre, unit(centre, C), DEPT_R);
  const inner = roundedCurve(straight(rimIn, plus(C, unit(C, centre), INNER_END)));
  const was = toEdge(curve, square);
  return {
    dept: i,
    degrees,
    square: { key: `network.vendor.${i}`, centre: square, at: box(round(square.x - SQUARE / 2), round(square.y - SQUARE / 2), SQUARE, SQUARE) },
    /** The line out, from the circle's edge to the square, and the line in, from the circle's edge to under the middle: the two parts of the heavy line that show. */
    out: { curve },
    in: { curve: inner },
    line: { key: `network.line.${i}`, ...lineOf(curve, inner) },
    was: { key: `network.was.${i}`, curve: was, d: pathOf(was) },
    money: { key: `network.money.${i}`, ...moneyOf(curve, centre, square) },
  };
});

/** The dollar sign drawn as a line about its centre, in `DOLLAR`'s box: an S over a bar, the catalog's own (slide 11's) at this size. */
export const dollarPath = () => {
  const { w, h } = DOLLAR;
  const [x, y] = [-w / 2, -h / 2];
  const l = round(x + w * 0.2);
  const r = round(x + w * 0.8);
  const at = (k: number) => round(y + h * k);
  return `M${r} ${at(0.28)}C${r - 2} ${at(0.14)} ${l} ${at(0.14)} ${l} ${at(0.33)}C${l} ${at(0.5)} ${r} ${at(0.5)} ${r} ${at(0.67)}C${r} ${at(0.86)} ${l + 2} ${at(0.86)} ${l} ${at(0.72)}M0 ${at(0)}V${at(1)}`;
};

/** The way a curve runs at `t`, turned to read left to right, and the side of it above. */
const readingOn = (curve: Curve, t: number) => {
  const run = runOn(curve, t);
  const u = run.x < 0 ? { x: -run.x, y: -run.y } : run;
  return { u, up: { x: u.y, y: -u.x } };
};
/** A label set along a line, turned to it, on the side under it: its middle `along` of the way along, 6 px clear of the line's heavy weight. */
const underLine = (curve: Curve, along: number, w: number) => {
  const p = pointOn(curve, along);
  const { u, up } = readingOn(curve, along);
  const off = -(WEIGHT / 2 + 6 + LABEL_LINE / 2);
  const centre = { x: p.x + up.x * off, y: p.y + up.y * off };
  return { at: box(round(centre.x - w / 2), round(centre.y - LABEL_LINE / 2), w, LABEL_LINE), angle: round((Math.atan2(u.y, u.x) * 180) / Math.PI) };
};

/** The department "Vendors" is set beside: Los Angeles County, the lower of the two straight out at the left. Set left of its square, level with it. */
const VENDORS_AT = { dept: deptAt(165), w: 120, gap: 12 } as const;
/** The department whose lines carry "Before" and "Now": Austin, the first pulled in. Its line out and its line in run on one straight line through its circle, so the two words read left to right under it, "Before" under its dashed copy and "Now" under its line in. */
const PAIR = 0;
const BEFORE_AT = { along: 0.45, w: 110 } as const;
const NOW_AT = { along: 0.5, w: 80 } as const;

/**
 * The tool Austin makes, a tile one step larger than the middle's (`side`)
 * with the dashed corner of an adapted tool on its copies (`corner`). It
 * shows inside Austin's circle `rise` px from its centre toward the middle,
 * clear of the name and inside the circle's edge, and lands on the middle's
 * outer ring at the place facing Austin.
 */
export const TOOL = { side: 24, rx: 4, corner: 10, rise: 49 } as const;
const austin = NETWORK.departments[0].at;
const centreOf = (at: Point): Point => ({ x: at.x + TILE.small.side / 2, y: at.y + TILE.small.side / 2 });
const slot = NETWORK.tiles
  .filter((tile) => tile.stage === 2)
  .reduce((best, tile) => {
    const toward = unit(C, austin);
    const dot = (t: typeof tile) => {
      const u = unit(C, centreOf(t.at));
      return u.x * toward.x + u.y * toward.y;
    };
    return dot(tile) > dot(best) ? tile : best;
  });
const landing = centreOf(slot.at);
const start = rounded(plus(austin, unit(austin, C), TOOL.rise));
const toolBox = (centre: Point) => ({ x: round(centre.x - TOOL.side / 2), y: round(centre.y - TOOL.side / 2) });

/** The three departments its copies go to, spread round the ring away from Austin: Chicago, Boston and Houston, clockwise from Austin. */
const SHARED_WITH = [-75, -15, 105] as const;
/** How far under a name's box a copy's tile starts. */
const COPY_GAP = 5;
/** How far inside the middle's edge, at its largest, a copy starts: the tile's half diagonal and 3 px more. */
const COPY_INSET = Math.ceil(Math.hypot(TOOL.side, TOOL.side) / 2) + 3;

export const LINKS = {
  /** By department, in the order they join. */
  ties,
  vendors: { key: "network.vendors", text: VENDORS, dept: VENDORS_AT.dept, at: box(round(ties[VENDORS_AT.dept].square.at.x - VENDORS_AT.gap - VENDORS_AT.w), round(ties[VENDORS_AT.dept].square.centre.y - LABEL_LINE / 2), VENDORS_AT.w, LABEL_LINE) },
  before: { key: "network.before", text: BEFORE, dept: PAIR, ...underLine(ties[PAIR].out.curve, BEFORE_AT.along, BEFORE_AT.w) },
  now: { key: "network.now", text: NOW, dept: PAIR, ...underLine(ties[PAIR].in.curve, NOW_AT.along, NOW_AT.w) },
  /** The middle's tile Austin's tool becomes, drawn `TOOL.side` square at `at`: carried from inside Austin's circle (`from`, its offset there) to its own place. */
  tool: { key: "network.tool", tile: slot.key, origin: landing, start, at: toolBox(landing), from: { "--x": round(start.x - landing.x), "--y": round(start.y - landing.y) } },
  /** Its copies, each settled inside its department's circle under the name, carried there from inside the middle (`from`, its offset there). */
  copies: SHARED_WITH.map((degrees, j) => {
    const dept = deptAt(degrees);
    const name = NETWORK.names[dept].at;
    const dock = { x: round(name.x + name.w / 2), y: round(name.y + name.h + COPY_GAP + TOOL.side / 2) };
    const from = rounded(plus(C, unit(C, dock), CENTRE_R[2] - COPY_INSET));
    return { key: `network.copy.${j}`, dept, dock, start: from, at: toolBox(dock), from: { "--x": round(from.x - dock.x), "--y": round(from.y - dock.y) } };
  }),
};
