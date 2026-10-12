/**
 * The clicks of slides 41 and 42, one a slide, each a chain of beats
 * (docs/bchc-flow-revision.md, sections 1 and 3). 41 brings back the path
 * 39 started and stands bigger tools on it; 42 leaves it for the four
 * requests' cards.
 */
import type { StepDef } from "@/components/deck/engine";
import type { PartMove } from "@/components/deck/engine/types";
import { EASE, draw, fill, hide, open, rise, show, to, wipe } from "@/components/deck/kit";
import { picture, story } from "../steps";
import { layerOf } from "./layout";
import { ASK, RAMP } from "./layout-ask";
import { chained, handOver, leave } from "./moves";
import { keys } from "./steps-steps";

/** 41's newest tool comes up inside your department, waits a moment, then goes along into the catalog's open place. */
const TILE = { up: 0.9, travel: 0.9 };

/**
 * 41: the path comes back, and bigger tools stand on it one after another:
 * a clinic finder, a dashboard, then a data pipeline whose feeds run into
 * both. Your department's walls go up round them, the catalog stands at the
 * path's end past its wall, and your department's newest tool goes, as a
 * tile, into the catalog's open place, the way it went drawn behind it. The
 * first project is named again as the path comes back.
 */
const ramp = () => {
  const { first, clinic, board, pipeline, room, shelf, tile, trail } = RAMP;
  const path = layerOf("path");
  return picture("ramp", {
    play: chained([
      { moves: [leave("examples"), handOver("examples", "ramp"), show([path.marks, path.html], { at: 0.2, duration: 0.4, stagger: 0 }), rise(first.key, { at: 0.4 })] },
      {
        // A clinic finder: a map, a pin dropping on it, and the clinics it finds.
        moves: [
          draw(clinic.key, { at: 0, duration: 0.7 }),
          draw(clinic.map.key, { at: 0.3, duration: 0.6 }),
          to(clinic.pin.key, { autoAlpha: 1, y: 0 }, { autoAlpha: 0, y: clinic.pin.drop }, { at: 0.8, duration: 0.5, ease: EASE.out }),
          fill(keys(clinic.rows), { at: 1.0, duration: 0.4, stagger: 0.15 }),
        ],
        with: true,
        hold: 0.4,
      },
      { moves: story("ramp", 0), with: true, hold: 0.3 },
      {
        // A dashboard, bigger: bars grow, a line draws, a ring draws round, and the legend fills.
        moves: [
          draw(board.key, { at: 0, duration: 0.7 }),
          draw(board.axis.key, { at: 0.3, duration: 0.4 }),
          fill(keys(board.bars), { at: 0.4, duration: 0.5, stagger: 0.1 }),
          draw(board.line.key, { at: 0.8, duration: 0.6 }),
          draw(board.ring.key, { at: 1.1, duration: 0.6 }),
          fill(keys(board.legend), { at: 1.3, duration: 0.4, stagger: 0.12 }),
        ],
        hold: 0.2,
      },
      {
        // A data pipeline, bigger again: three sources joined into one step that fills a table, and its feeds run into the other two.
        moves: [
          draw(pipeline.key, { at: 0, duration: 0.7 }),
          draw(keys(pipeline.sources), { at: 0.3, duration: 0.4, stagger: 0.1 }),
          draw(pipeline.joins.key, { at: 0.7, duration: 0.4 }),
          draw(pipeline.step.key, { at: 0.9, duration: 0.4 }),
          draw(pipeline.table.key, { at: 1.1, duration: 0.4 }),
          draw(keys(pipeline.feeds), { at: 1.5, duration: 0.6, stagger: 0.3 }),
        ],
        hold: 0.2,
      },
      {
        // Your department round its tools, and at the path's end, past its wall, the catalog with one place open.
        moves: [
          wipe(room.key, { at: 0 }),
          rise(room.label.key, { at: 0.2 }),
          draw(shelf.key, { at: 0.3, duration: 0.6 }),
          rise(shelf.label.key, { at: 0.5 }),
          show(keys(shelf.entries), { at: 0.6, stagger: 0.08 }),
          show(shelf.slot.key, { at: 0.9 }),
        ],
        hold: 0.2,
      },
      {
        // Its newest tool comes up inside it, and goes along into the catalog's open place, the way it went drawn along the path behind it.
        moves: [
          to(tile.key, { autoAlpha: 1, x: tile.from.x, y: tile.from.y }, { autoAlpha: 0, x: tile.from.x, y: tile.from.y + 22 }, { at: 0, duration: 0.5, ease: EASE.out }),
          to(tile.key, { x: 0, y: 0 }, undefined, { at: TILE.up, duration: TILE.travel, ease: EASE.page }),
          draw(trail.key, { at: TILE.up, duration: TILE.travel, ease: EASE.page }),
          hide(shelf.slot.key, { at: TILE.up + TILE.travel - 0.15 }),
        ],
        hold: 0.2,
      },
      { moves: story("ramp", 1), with: true, hold: 1.2 },
    ]),
  });
};

/** 42's cards come up this far apart, each acting out its request inside that time. */
const APART = 1.8;

/** A card comes up: its outline draws and its words rise. */
const cardUp = (i: number): PartMove[] => {
  const card = ASK.cards[i];
  return [draw(card.key, { at: 0, duration: 0.6 }), rise(card.words.key, { at: 0.2 })].flat();
};

/** Each card's drawing acting out its request, timed from the card coming up. */
const acts: (() => PartMove[])[] = [
  // The form comes up, fills in, and goes out into the tray.
  () => {
    const { form } = ASK;
    return [
      rise(form.tray.key, { at: 0.3 }),
      rise(form.key, { at: 0.3 }),
      fill(keys(form.fields), { at: 0.6, duration: 0.35, stagger: 0.15 }),
      to(form.key, form.out, { x: 0, y: 0 }, { at: 1.35, duration: 0.7, ease: EASE.page }),
    ].flat();
  },
  // A person comes up, and once the card's words are in, puts their hand up and lights.
  () => {
    const { ready } = ASK;
    return [rise(ready.key, { at: 0.3 }), open(ready.key, { at: 1.0, duration: 0.7, ease: EASE.out })].flat();
  },
  // The pack comes in along the floor and lights once it is in.
  () => {
    const { pack } = ASK;
    return [
      draw(pack.floor.key, { at: 0.3, duration: 0.5 }),
      to(pack.key, { autoAlpha: 1, x: 0 }, { autoAlpha: 0, x: pack.from }, { at: 0.6, duration: 0.8, ease: EASE.page }),
      fill(pack.key, { at: 1.3, duration: 0.5 }),
    ].flat();
  },
  // The empty chair at the table; the engineer comes in, takes it, and lights.
  () => {
    const { engineer } = ASK;
    return [
      draw([engineer.chair.key, engineer.table.key], { at: 0.3, duration: 0.5, stagger: 0.1 }),
      to(engineer.key, { autoAlpha: 1, x: 0 }, { autoAlpha: 0, x: engineer.from }, { at: 0.9, duration: 0.9, ease: EASE.page }),
      fill(engineer.key, { at: 1.7, duration: 0.5 }),
    ].flat();
  },
];

/** 42: the four requests come up as cards 1.8 s apart, two by two, and each card's drawing acts its request out: a form goes out, a hand goes up, the pack arrives, and an engineer takes the empty seat. */
const ask = () =>
  picture("ask", {
    play: chained([
      { moves: [leave("ramp", "path"), handOver("ramp", "ask")] },
      { moves: story("ask", 0), with: true, hold: 0.3 },
      { moves: [cardUp(0), acts[0]()].flat(), with: true, hold: 0.4 },
      // A `with` beat's hold is from the start of the beat before: each card comes up 1.8 s after the last.
      { moves: [cardUp(1), acts[1]()].flat(), with: true, hold: APART },
      { moves: [cardUp(2), acts[2]()].flat(), with: true, hold: APART },
      { moves: [cardUp(3), acts[3]()].flat(), with: true, hold: APART },
    ]),
  });

export const stepsOfAsk = (): StepDef[] => [...ramp(), ...ask()];
