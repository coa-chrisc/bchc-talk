/**
 * Slides 41 and 42 of the start world: where every part goes, the id it
 * takes and the words it holds, read from the script. 41 stands its tools
 * on the path from 39 (layout-path.ts).
 */
import { box, type Box, type Hue, type Point } from "@/components/deck/kit";
import { shown } from "../../script/find";
import { LINE, personAt } from "./layout";
import { PATH, PATH_Y } from "./layout-path";

/* 41. Start small, then take on more: the first project still named at the path's start, bigger tools along the path inside your department (a clinic finder, a dashboard, a data pipeline feeding both); the path leads on out of your department to the catalog at its end, and your department's newest tool goes, as a tile, into the catalog's open slot, the stretch of path it took left drawn in navy. */

const [CLINIC_FINDER, DASHBOARD, DATA_PIPELINE, RAMP_DEPARTMENT, THE_CATALOG, RAMP_FIRST] = shown("ramp", "play");
/** A tool's window: its name in a bar across its top, this tall. */
export const WINDOW_BAR = 44;
/** Each tool stands on the path (layout-path.ts), as the first project does. */
const FLOOR = PATH.tool.at.y + PATH.tool.at.h;
const CLINIC = box(300, FLOOR - 200, 240, 200);
const BOARD = box(600, FLOOR - 280, 320, 280);
const PIPELINE = box(980, FLOOR - 360, 340, 360);
const top = (b: Box) => ({ x: b.x + b.w / 2, y: b.y });
/** The pipeline's feeds leave its top, run left over the other two, and drop into each. */
const FEED_Y = PIPELINE.y - 36;
const arrowInto = (to: Point) => `M${to.x} ${FEED_Y}V${to.y - 8}M${to.x - 8} ${to.y - 18}L${to.x} ${to.y - 6}L${to.x + 8} ${to.y - 18}`;
/** Your department: walls and a roof round its tools, the path its floor. */
const ROOM = box(96, FEED_Y - 40, 1336, PATH_Y - (FEED_Y - 40));
/** The catalog, past your department's wall, standing on the path at its end: two rows of entries, the last place open. */
const SHELF = box(1480, FLOOR - 280, 1824 - 1480, 280);
const PLACE = 72;
const PLACES = [0, 1].flatMap((row) => [0, 1, 2].map((col) => ({ x: SHELF.x + 36 + col * 100, y: SHELF.y + 52 + row * 108 })));
const OPEN = PLACES[PLACES.length - 1];
/** Where your department's newest tool comes up: inside its wall, beside the pipeline it grew out of. */
const NEWEST = { x: PIPELINE.x + PIPELINE.w + 20, y: FLOOR - PLACE - 24 };

/** The stretch of path the newest tool takes, drawn solid: from the foot of your department's wall along the path, then up into the slot it fills, an arrowhead at the slot. */
const WALL = ROOM.x + ROOM.w;
const INTO = { x: OPEN.x + PLACE / 2, y: OPEN.y + PLACE + 6 };

export const RAMP = {
  /** The first project, still on the path from 39, named over its card: in this picture, so it goes when the picture does. */
  first: { key: "ramp.first", text: RAMP_FIRST, at: { x: PATH.tool.at.x + PATH.tool.at.w / 2, y: PATH.tool.at.y - 26 } },
  clinic: {
    key: "ramp.clinic",
    at: CLINIC,
    name: CLINIC_FINDER,
    /** A map with two roads each way, and the pin that drops on it. */
    map: { key: "ramp.clinic.map", at: box(CLINIC.x + 16, CLINIC.y + WINDOW_BAR + 12, CLINIC.w - 32, 84) },
    pin: { key: "ramp.clinic.pin", at: { x: CLINIC.x + 120, y: CLINIC.y + WINDOW_BAR + 44 }, drop: -40 },
    rows: [0, 1].map((i) => ({ key: `ramp.clinic.row.${i}`, at: box(CLINIC.x + 16, CLINIC.y + 154 + i * 20, [150, 110][i], 10) })),
  },
  board: {
    key: "ramp.board",
    at: BOARD,
    name: DASHBOARD,
    /** Its charts, one after another: bars that grow, a line that draws, a ring that draws round. */
    bars: [50, 80, 64, 104].map((h, i) => ({ key: `ramp.board.bar.${i}`, at: box(BOARD.x + 30 + i * 32, BOARD.y + 180 - h, 22, h) })),
    axis: { key: "ramp.board.axis", d: `M${BOARD.x + 20} ${BOARD.y + 180}H${BOARD.x + 160}` },
    line: { key: "ramp.board.line", d: `M${BOARD.x + 184} ${BOARD.y + 164}L${BOARD.x + 214} ${BOARD.y + 140}L${BOARD.x + 244} ${BOARD.y + 150}L${BOARD.x + 272} ${BOARD.y + 106}L${BOARD.x + 300} ${BOARD.y + 84}` },
    ring: { key: "ramp.board.ring", at: { x: BOARD.x + 62, y: BOARD.y + 230 }, r: 26 },
    legend: [0, 1].map((i) => ({ key: `ramp.board.legend.${i}`, at: box(BOARD.x + 120, BOARD.y + 216 + i * 22, [160, 120][i], 10) })),
  },
  pipeline: {
    key: "ramp.pipeline",
    at: PIPELINE,
    name: DATA_PIPELINE,
    /** Three sources, joined into one step, which fills a table. */
    sources: [70, 170, 270].map((dx, i) => ({ key: `ramp.pipeline.source.${i}`, at: box(PIPELINE.x + dx - 30, PIPELINE.y + 66, 60, 56) })),
    joins: { key: "ramp.pipeline.joins", d: [70, 170, 270].map((dx) => `M${PIPELINE.x + dx} ${PIPELINE.y + 122}L${PIPELINE.x + 170} ${PIPELINE.y + 176}`).join("") + `M${PIPELINE.x + 170} ${PIPELINE.y + 224}V${PIPELINE.y + 252}` },
    step: { key: "ramp.pipeline.step", at: box(PIPELINE.x + 120, PIPELINE.y + 176, 100, 48) },
    table: { key: "ramp.pipeline.table", at: box(PIPELINE.x + 40, PIPELINE.y + 252, 260, 92), rows: 3 },
    /** Out of its top, over the dashboard and the clinic finder, into each. */
    feedY: FEED_Y,
    feeds: [
      { key: "ramp.pipeline.feed.0", d: `M${top(PIPELINE).x} ${PIPELINE.y}V${FEED_Y}H${top(BOARD).x}${arrowInto(top(BOARD))}` },
      { key: "ramp.pipeline.feed.1", d: `M${top(BOARD).x} ${FEED_Y}H${top(CLINIC).x}${arrowInto(top(CLINIC))}` },
    ],
  },
  room: {
    key: "ramp.room",
    at: ROOM,
    /** Its walls and roof, in its own pixels: no floor, which is the path. */
    d: `M0 ${ROOM.h}V0H${ROOM.w}V${ROOM.h}`,
    label: { key: "ramp.room.label", text: RAMP_DEPARTMENT, at: box(ROOM.x, ROOM.y - 54, 600, LINE) },
  },
  /** The catalog: five entries and an open place, in its frame in the catalog's colour, named over it. */
  shelf: {
    key: "ramp.shelf",
    at: SHELF,
    label: { key: "ramp.shelf.label", text: THE_CATALOG, at: { x: SHELF.x, y: SHELF.y - 30 } },
    entries: PLACES.slice(0, -1).map((at, i) => ({ key: `ramp.shelf.entry.${i}`, at: box(at.x, at.y, PLACE, PLACE) })),
    slot: { key: "ramp.shelf.slot", at: box(OPEN.x, OPEN.y, PLACE, PLACE) },
  },
  /** Your department's newest tool, as a tile: it comes up inside your department, then goes along to the open place. */
  tile: { key: "ramp.tile", at: box(OPEN.x, OPEN.y, PLACE, PLACE), from: { x: NEWEST.x - OPEN.x, y: NEWEST.y - OPEN.y } },
  /** The way it went, drawn as it goes and left on the stage: one unbroken stroke, its arrowhead's left barb out and back, so no piece of it shows before the draw reaches it. */
  trail: { key: "ramp.trail", d: `M${WALL} ${PATH_Y}H${INTO.x}V${INTO.y}L${INTO.x - 8} ${INTO.y + 12}L${INTO.x} ${INTO.y}L${INTO.x + 8} ${INTO.y + 12}` },
};

/* 42. Four things to do next: four cards, two by two, each the request in words beside a drawing that acts it out. A form fills in and goes out into a tray; a person raises a hand; the agent pack arrives; an engineer comes to the empty seat at your table. */

const [POST, READY, LOAD, WITHOUT, ASK_IT] = shown("ask", "play");
const GRID = { x: [96, 976], y: [456, 728], w: 848, h: 240 };
/** Each card's drawing, at its left, and its words, at its right. */
const ART = { dx: 28, dy: 20, w: 232, h: 200 };
const WORDS = { dx: 296, pad: 32 };
/** What each request is: the project you post is the catalog's, telling us you're ready starts you on the process, the pack is the agent pack's, and the engineer is help getting set up. */
const OWNS: Hue[] = ["catalog", "process", "share-pack", "share-help"];
const LINES = [[POST], [READY], [LOAD], [WITHOUT, ASK_IT]];
const CARDS = LINES.map((lines, i) => {
  const at = box(GRID.x[i % 2], GRID.y[Math.floor(i / 2)], GRID.w, GRID.h);
  return {
    key: `ask.card.${i}`,
    at,
    hue: OWNS[i],
    lines,
    art: box(at.x + ART.dx, at.y + ART.dy, ART.w, ART.h),
    words: { key: `ask.words.${i}`, at: box(at.x + WORDS.dx, at.y + WORDS.pad, at.w - WORDS.dx - WORDS.pad, at.h - 2 * WORDS.pad) },
  };
});
const [A0, A1, A2, A3] = CARDS.map((card) => card.art);
/** The form, at the drawing's top left, and the tray it goes out into, along the drawing's foot at the right. */
const FORM = box(A0.x, A0.y, 96, 128);
const TRAY = box(A0.x + 112, A0.y + 136, 120, 56);
/**
 * The person who is ready, in the middle of the drawing, and their arm: it
 * pivots inside their shoulder, tilted out past their head, and its hand
 * starts there, hidden behind them, and goes up the arm's reach.
 */
const READY_PERSON = personAt(A1.x + 58, A1.y + 50, 2);
const SHOULDER = { x: READY_PERSON.x + 72, y: READY_PERSON.y + 100 };
/** The pack, standing on the floor at the drawing's foot; it comes in from the left. */
const FLOOR_Y = A2.y + A2.h - 12;
const PACK = box(A2.x + 60, FLOOR_Y - 92, 120, 92);
/** The table, the empty chair behind it, and the engineer who comes to sit in it from the left. */
const TABLE_Y = A3.y + 150;
const CHAIR = box(A3.x + 82, A3.y + 36, 84, 108);
const SEATED = personAt(CHAIR.x + 12, CHAIR.y + 26, 1.25);

export const ASK = {
  cards: CARDS,
  form: {
    key: "ask.form",
    at: FORM,
    tag: box(FORM.x, FORM.y, FORM.w, 22),
    fields: [64, 48, 56].map((w, i) => ({ key: `ask.form.field.${i}`, at: box(FORM.x + 14, FORM.y + 46 + i * 26, w, 10) })),
    /** Where it goes out to: down into the tray, standing in it. */
    out: { x: TRAY.x + (TRAY.w - FORM.w) / 2 - FORM.x, y: TRAY.y + TRAY.h - 6 - FORM.h - FORM.y },
    tray: { key: "ask.form.tray", at: TRAY },
  },
  /** The person who is ready: their hand goes up (`open`, `--k`), and they light as it does. */
  ready: { key: "ask.ready", at: READY_PERSON, hand: { from: SHOULDER, reach: 112, r: 16, w: 20, tilt: 18 } },
  pack: { key: "ask.pack", at: PACK, from: -72, floor: { key: "ask.pack.floor", from: { x: A2.x, y: FLOOR_Y }, to: { x: A2.x + A2.w, y: FLOOR_Y } } },
  engineer: {
    key: "ask.engineer",
    at: SEATED,
    from: -150,
    chair: { key: "ask.engineer.chair", at: CHAIR },
    /** The table's top, and its two legs down to the drawing's foot. */
    table: { key: "ask.engineer.table", d: `M${A3.x} ${TABLE_Y}H${A3.x + A3.w}M${A3.x + 24} ${TABLE_Y}V${A3.y + A3.h - 4}M${A3.x + A3.w - 24} ${TABLE_Y}V${A3.y + A3.h - 4}` },
  },
};
