/**
 * The clicks of slides 37 to 38b, one a slide, each a chain of beats
 * (docs/bchc-flow-revision.md, sections 1 and 3). Slides 34 to 36a are in
 * steps-steps.ts.
 */
import type { StepDef } from "@/components/deck/engine";
import { DUR, EASE, draw, fill, hide, mark, open, rise, show, to, wipe } from "@/components/deck/kit";
import { picture, story } from "../steps";
import { APPROVER_SLIDE, TOOLS } from "./layout-two";
import { FDE, QUESTIONS } from "./layout-help";
import { chained, handOver, leave } from "./moves";
import { STAGGER_PEOPLE, keys } from "./steps-steps";

/** An agent arrives beside its person, and its ring fills in the process's colour: it is ready to work. */
const agentsArrive = (agentKeys: string[], at: number) => [rise(agentKeys, { at, stagger: STAGGER_PEOPLE }), fill(agentKeys, { at: at + 0.35, duration: 0.6, stagger: STAGGER_PEOPLE })].flat();

/** 37: the tool at the door of your department; a receipt and a plain tick, Purchased; a person's mark, Approved; the door swings open, the tool goes in and opens into its window beside the people, and each of them gets an agent writing code in it. */
const tools = () => {
  const { room, label, door, tool, receipt, approver, mark: approval, people, agents } = TOOLS;
  const both = [tool.key, tool.name.key];
  const code = agents.flatMap((agent) => keys(agent.code));
  return picture("tools", {
    play: chained([
      { moves: [leave("github"), handOver("github", "tools")] },
      {
        moves: [
          wipe(room.key, { at: 0 }),
          show(door.key, { at: 0.2 }),
          rise(label.key, { at: 0.2 }),
          draw(keys(people), { at: 0.35, duration: 0.5, stagger: STAGGER_PEOPLE }),
          draw(tool.key, { at: 0.2, duration: 0.7 }),
          rise(tool.name.key, { at: 0.5 }),
        ],
        with: true,
        hold: 0.3,
      },
      { moves: story("tools", 0), with: true, hold: 0.3 },
      {
        // Purchased: a receipt slides in and takes a plain tick.
        moves: [
          to(receipt.key, { autoAlpha: 1, x: 0 }, { autoAlpha: 0, x: receipt.from }, { at: 0, duration: 0.7, ease: EASE.page }),
          draw(receipt.tick.key, { at: 0.7, duration: 0.4 }),
          rise(receipt.label.key, { at: 0.9 }),
        ],
        hold: 0.4,
      },
      {
        // Approved: IT, security and legal look it over, and a person gives their mark.
        moves: [draw(approver.key, { at: 0, duration: 0.5 }), rise(approver.label.key, { at: 0.2 }), mark(approval.key, { at: 0.8, duration: 0.7 })],
        hold: 0.5,
      },
      {
        // Only then does the door swing open: the tool goes in through it, its name on it.
        moves: [
          open(door.key, { at: 0, duration: 0.7 }),
          draw(door.swing.key, { at: 0, duration: 0.7 }),
          to(both, { x: tool.through }, { x: 0 }, { at: 0.5, duration: 1.2, ease: EASE.page, stagger: 0 }),
        ],
        hold: 0.2,
      },
      {
        // Inside, it opens into its window, and the small tool gives way to it.
        moves: [draw(tool.window.key, { at: 0, duration: 0.8 }), hide(both, { at: 0.2, duration: 0.4 })],
        hold: 0.2,
      },
      // Each person gets an agent in the window, level with them, and it writes their code.
      {
        moves: [agentsArrive(keys(agents), 0), fill(code, { at: 0.7, duration: 0.6, stagger: 0.12 })],
        hold: 0.4,
      },
      { moves: story("tools", 1), with: true },
    ]),
  });
};

/** 38's approver takes a change from its agent's card onto their own card, where their mark lands on it. It stays there, approved. */
const take = (i: number) => {
  const { change } = APPROVER_SLIDE.queue[i];
  return [to(change.key, change.desk!, { x: 0, y: 0 }, { at: 0, duration: 0.7, ease: EASE.page }), mark(change.mark.key, { at: 0.75, duration: 0.6 })].flat();
};

/** 38: your approver and a backup; the queue of agent cards; the approver takes the first three changes and marks each; the last card tries the locked Publish, is pushed back, and the reason comes up. */
const approver = () => {
  const { cards, queue, publish, trier, tries, pushedTo, cannot } = APPROVER_SLIDE;
  return picture("approver", {
    play: chained([
      { moves: [leave("tools"), handOver("tools", "approver")] },
      {
        moves: [
          draw(keys(cards), { at: 0, duration: 0.7, stagger: 0.15 }),
          draw(cards.map((card) => card.figure.key), { at: 0.3, duration: 0.5, stagger: 0.15 }),
          rise(cards.map((card) => card.nameKey), { at: 0.5, stagger: 0.15 }),
        ],
        with: true,
        hold: 0.3,
      },
      { moves: story("approver", 0), with: true, hold: 0.3 },
      {
        moves: [
          show(keys(queue), { at: 0, duration: 0.3, stagger: 0.12 }),
          draw(keys(queue), { at: 0, duration: 0.6, stagger: 0.12 }),
          fill(queue.map((card) => card.agent.key), { at: 0.5, duration: 0.6, stagger: 0.12 }),
          show(publish.key, { at: 0.6 }),
        ],
        hold: 0.2,
      },
      { moves: take(0), hold: 0.1 },
      { moves: take(1), hold: 0.1 },
      { moves: take(2), hold: 0.2 },
      {
        // The last card goes straight for Publish, meets the lock, and is pushed back.
        moves: [
          to(queue[trier].key, tries, { x: 0, y: 0 }, { at: 0, duration: 0.9, ease: "power2.in" }),
          to(queue[trier].key, { x: pushedTo }, undefined, { at: 0.9, duration: 0.5, ease: EASE.out }),
          rise(cannot.key, { at: 1.0 }),
        ],
        hold: 0.3,
      },
      { moves: story("approver", 1), with: true, hold: 0.9 },
    ]),
  });
};

/** One of 38a's questions comes up, and its answer slides in beside it. */
const question = (i: number) => {
  const { question: q, answer } = QUESTIONS.pairs[i];
  return [rise(q.key, { at: 0 }), to(answer.key, { autoAlpha: 1, x: 0 }, { autoAlpha: 0, x: QUESTIONS.slide }, { at: 0.3, duration: DUR.base, ease: EASE.out })].flat();
};

/** 38a: the four questions and their answers, 2.4 s apart, under the line that says to expect them. */
const questions = () =>
  picture("questions", {
    play: chained([
      { moves: [leave("approver"), handOver("approver", "questions")] },
      { moves: story("questions", 0), with: true, hold: 0.3 },
      { moves: draw(QUESTIONS.rule.key, { at: 0, duration: 0.6 }), with: true, hold: 0.9 },
      { moves: question(0), with: true, hold: 0.4 },
      { moves: question(1), with: true, hold: 2.4 },
      { moves: question(2), with: true, hold: 2.4 },
      { moves: question(3), with: true, hold: 2.4 },
    ]),
  });

/** A piece leaves its builder's hands and drops into its place in the tool. */
const PLACE = { apart: 0.55, travel: 0.5 };
/**
 * One tool built by the people over it: each piece shows at its builder's
 * hands and drops into place, one builder after another. The first piece
 * sets the tool's outline drawing, and once the last is in, its ground fills.
 */
const buildTool = (tool: (typeof FDE.tools)[number], at = 0) => {
  const done = at + (tool.pieces.length - 1) * PLACE.apart + PLACE.travel;
  return [
    tool.pieces.flatMap((piece, j) =>
      to(piece.key, { autoAlpha: 1, x: 0, y: 0 }, { autoAlpha: 0, ...piece.from }, { at: at + j * PLACE.apart, duration: PLACE.travel, ease: EASE.page }),
    ),
    draw(tool.key, { at: at + PLACE.travel - 0.1, duration: 0.7 }),
    fill(tool.key, { at: done, duration: 0.5 }),
  ].flat();
};

/** 38b: your department and central IT with a queue between; an engineer leaves IT to sit with your staff, they build a tool together, the engineer steps back, and your staff build the next. */
const fde = () =>
  picture("fde", {
    play: chained([
      { moves: [leave("questions"), handOver("questions", "fde")] },
      {
        moves: [
          wipe([FDE.dept.key, FDE.it.key], { at: 0, stagger: 0.1 }),
          rise([FDE.dept.label.key, FDE.it.label.key], { at: 0.2, stagger: 0.1 }),
          draw(keys([...FDE.staff, ...FDE.itStaff, FDE.engineer]), { at: 0.35, duration: 0.5, stagger: 0.06 }),
          rise(FDE.engineer.label.key, { at: 0.7 }),
          show(keys(FDE.queue), { at: 0.6, stagger: 0.05 }),
          rise(FDE.queueLabel.key, { at: 0.9 }),
        ],
        with: true,
        hold: 0.3,
      },
      { moves: story("fde", 0), with: true, hold: 0.5 },
      // The engineer leaves IT, passes over the queue, and sits down beside your staff, their name going with them.
      { moves: to([FDE.engineer.key, FDE.engineer.label.key], { x: FDE.engineer.to }, { x: 0 }, { at: 0, duration: 1.4, ease: EASE.page, stagger: 0 }), hold: 0.95 },
      // The engineer and your staff build the first tool together, a piece each in turn.
      { moves: buildTool(FDE.tools[0]), hold: 0.2 },
      { moves: story("fde", 1), with: true, hold: 0.3 },
      // The engineer steps back, still with your team and at full strength, and your staff build the second on their own.
      {
        moves: [to([FDE.engineer.key, FDE.engineer.label.key], { x: FDE.engineer.back }, { x: FDE.engineer.to }, { at: 0, duration: 0.6, ease: EASE.page, stagger: 0 }), buildTool(FDE.tools[1], 0.5)],
        hold: 0.2,
      },
    ]),
  });

export const stepsOfTwo = (): StepDef[] => [...tools(), ...approver(), ...questions(), ...fde()];
