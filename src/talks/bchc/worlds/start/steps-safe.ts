/**
 * The click of slide 38s, one chain of beats (docs/bchc-flow-revision.md,
 * sections 1 and 3): the fence of accounts your city approves goes up round
 * your department; public data goes in through the gate and personal or
 * health data is stopped outside it; three changes take your approver's
 * mark and go onto the GitHub record, and the last is undone.
 */
import type { StepDef } from "@/components/deck/engine";
import type { PartMove } from "@/components/deck/engine/types";
import { EASE, draw, hide, mark, open, rise, show, to, wipe } from "@/components/deck/kit";
import { picture, story } from "../steps";
import { SAFE } from "./layout-safe";
import { chained, handOver, leave } from "./moves";

/** A new change comes out of public data this often, so one is at the approver while the last goes on to the record. */
const APART = 1.0;
/** Inside one change's turn: out of the table, over to the approver, their mark, and on to the record. */
const TURN = { out: 0.45, over: 0.55, mark: 0.35, on: 0.55 } as const;

/** One change: out of the table, to the approver, who marks it approved, and on to its place on the record, which reaches past it; then its time stamp. */
const pass = (i: number, at: number): PartMove[] => {
  const { record } = SAFE;
  const change = SAFE.changes[i];
  const atDesk = at + TURN.out;
  const marked = atDesk + TURN.over;
  const leaves = marked + TURN.mark + 0.1;
  return [
    to(change.key, { autoAlpha: 1, x: change.out, y: 0 }, { autoAlpha: 0, x: 0, y: 0 }, { at, duration: TURN.out, ease: EASE.out }),
    to(change.key, { x: change.desk.x }, undefined, { at: atDesk, duration: TURN.over, ease: EASE.page }),
    // It drops to the record's level as it sets off, well before it reaches the approver, and passes under their foot.
    to(change.key, { y: change.desk.y }, undefined, { at: atDesk, duration: TURN.over, ease: EASE.out }),
    mark(change.mark.key, { at: marked, duration: TURN.mark }),
    to(change.key, { x: change.slot.x, y: change.slot.y }, undefined, { at: leaves, duration: TURN.on, ease: EASE.page }),
    to(record.key, { "--d": change.reach }, undefined, { at: leaves, duration: TURN.on, ease: EASE.page }),
    show(change.stamp.key, { at: leaves + TURN.on - 0.1 }),
  ].flat();
};

/** 38s: the fence, your department, named, the two tables, the approver and the record; public data in, personal or health data stopped; three changes approved and recorded; the last undone. */
export const safe = (): StepDef[] => {
  const { fence, gate, dept, publicData, personal, approver, record, changes, lift, undone } = SAFE;
  const last = changes[changes.length - 1];
  return picture("safe", {
    play: chained([
      { moves: [leave("approver"), handOver("approver", "safe")] },
      {
        // The fence goes up round your department, which is named, with its gate shut; the two tables wait outside; inside, the approver and the start of the record.
        moves: [
          draw(fence.key, { at: 0, duration: 1.0 }),
          rise(fence.label.key, { at: 0.3 }),
          wipe(dept.key, { at: 0.4 }),
          rise(dept.label.key, { at: 0.6 }),
          show([fence.posts.key, gate.key], { at: 0.5, duration: 0.5, stagger: 0 }),
          rise([publicData.key, personal.key], { at: 0.8, stagger: 0.15 }),
          draw(approver.key, { at: 1.0, duration: 0.5 }),
          rise(approver.label.key, { at: 1.2 }),
          to(record.key, { "--d": record.stub }, { "--d": 0 }, { at: 1.2, duration: 0.3, ease: EASE.draw }),
          rise(record.label.key, { at: 1.3 }),
        ],
        with: true,
        hold: 0.3,
      },
      { moves: story("safe", 0), with: true, hold: 0.3 },
      {
        // The gate opens; public data comes up to it and goes in, and the gate shuts behind it.
        moves: [
          open(gate.key, { at: 0, duration: 0.5 }),
          to(publicData.key, { y: publicData.lane }, { y: 0 }, { at: 0, duration: 0.5, ease: EASE.out }),
          to(publicData.key, { x: publicData.through }, { x: 0 }, { at: 0.45, duration: 1.1, ease: EASE.page }),
          to(gate.key, { "--k": 0 }, undefined, { at: 1.6, duration: 0.5, ease: EASE.page }),
        ],
        hold: 0.2,
      },
      {
        // As it shuts, personal or health data comes down to it, meets the shut gate, and is pushed back to wait outside.
        moves: [
          to(personal.key, { y: personal.lane }, { y: 0 }, { at: 0, duration: 0.5, ease: EASE.out }),
          to(personal.key, { x: personal.tries }, { x: 0 }, { at: 0.4, duration: 0.7, ease: "power2.in" }),
          to(personal.key, { x: personal.stays }, undefined, { at: 1.1, duration: 0.4, ease: EASE.out }),
        ],
        with: true,
        hold: 1.6,
      },
      { moves: story("safe", 1), with: true, hold: 0.7 },
      // Three changes, one at a time: each stops at the approver, takes their mark, and lands on the record with its time stamp.
      { moves: changes.flatMap((_, i) => pass(i, i * APART)), hold: 0.2 },
      {
        // The last change lifts back off the record, faded and named Undone, and the line closes up behind the one before it.
        moves: [
          to(last.key, { y: last.slot.y - lift, autoAlpha: 0.3 }, undefined, { at: 0, duration: 0.7, ease: EASE.page }),
          hide(last.stamp.key, { at: 0 }),
          rise(undone.key, { at: 0.3 }),
          to(record.key, { "--d": changes[changes.length - 2].reach }, undefined, { at: 0.45, duration: 0.6, ease: EASE.page }),
        ],
        hold: 0.3,
      },
    ]),
  });
};
