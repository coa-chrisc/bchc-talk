/**
 * The clicks of slides 34 to 36a, one a slide: each plays its whole picture
 * as a chain of beats (docs/bchc-flow-revision.md, sections 1 and 3), the
 * story lines landing with the beats they explain. The first beat hides the
 * slide before and hands the title on; a beat's moves are timed from its own
 * start, and `chain` places it. Slides 37 to 38b are in steps-two.ts.
 */
import type { StepDef } from "@/components/deck/engine";
import { EASE, draw, fill, hide, lines, mark, open, rise, show, to, wipe } from "@/components/deck/kit";
import { picture, story } from "../steps";
import { STEP_ONE, THREE, TRAINING, titleKey } from "./layout";
import { GITHUB_SETUP } from "./layout-two";
import { chained, handOver, leave } from "./moves";

/** The world's first click waits this long for the fade through night to bring it up: 0.95 s from the click. */
const ARRIVE = 0.35;
/** People arrive this far apart. */
export const STAGGER_PEOPLE = 0.09;

export const keys = <T extends { key: string }>(items: readonly T[]) => items.map((item) => item.key);

/** One of 34's steps comes up: its face rises out of the floor, its edge draws, and its words come up on it. */
const stepUp = (i: number) => {
  const step = THREE.steps[i];
  return [fill(step.face.key, { at: 0, duration: 0.6 }), draw(step.key, { at: 0, duration: 0.6 }), rise(step.words.key, { at: 0.35 })].flat();
};

/** 34: the title and the first step, with your department at its foot; the next two steps 1.4 s apart; your department steps up onto the first; then what to do first. */
const three = () => {
  const { person } = THREE;
  const both = [person.key, person.label.key];
  return picture("three", {
    play: chained(
      [
        { moves: [lines(titleKey("three"), { at: 0 }), stepUp(0), draw(person.key, { at: 0.3, duration: 0.5 }), rise(person.label.key, { at: 0.5 })] },
        { moves: stepUp(1), with: true, hold: 1.4 },
        { moves: stepUp(2), with: true, hold: 1.4 },
        {
          // The step up: up first, so their feet clear the riser, then across onto the tread. Their name goes with them.
          moves: [
            to(both, { y: person.up.y }, { y: 0 }, { at: 0, duration: 0.5, ease: EASE.out, stagger: 0 }),
            to(both, { x: person.up.x }, { x: 0 }, { at: 0.12, duration: 0.9, ease: EASE.page, stagger: 0 }),
          ],
          hold: 0.4,
        },
        { moves: story("three", 0), hold: 0.2 },
      ],
      ARRIVE,
    ),
  });
};

/** One of 35's fields: its name and box come up, then its writing fills in. */
const field = (i: number) => {
  const { key, bar } = STEP_ONE.card.fields[i];
  return [rise(key, { at: 0 }), fill(bar.key, { at: 0.35, duration: 0.6 })].flat();
};

/** 35: your project's card and the catalog's last row; the card fills in a field at a time, and a copy of it, as an entry, slides out to the empty slot, waits for a person's approval, and drops in. The card stays. */
const stepOne = () => {
  const { card, copy, catalog, mark: approval } = STEP_ONE;
  return picture("step-one", {
    play: chained([
      { moves: [leave("three"), handOver("three", "step-one")] },
      {
        moves: [
          draw(card.key, { at: 0, duration: 0.7 }),
          rise(card.name.key, { at: 0.3 }),
          draw(card.rule.key, { at: 0.4, duration: 0.5 }),
          draw(catalog.key, { at: 0.1, duration: 0.8 }),
          show([...keys(catalog.above), ...keys(catalog.entries)], { at: 0.4, stagger: 0.08 }),
          show(catalog.slot.key, { at: 0.9 }),
        ],
        with: true,
        hold: 0.3,
      },
      { moves: story("step-one", 0), with: true, hold: 0.3 },
      { moves: field(0), hold: 0.3 },
      { moves: field(1), hold: 0.2 },
      { moves: field(2), hold: 0.2 },
      { moves: story("step-one", 1), with: true, hold: 0.2 },
      // Filled in, its copy slides out from behind it as an entry, crosses to the empty slot and waits over it.
      { moves: to(copy.key, { autoAlpha: 1, ...copy.hover }, { autoAlpha: 0, x: 0, y: 0 }, { at: 0, duration: 1.2, ease: EASE.page }), hold: 0.3 },
      // A person approves it.
      { moves: mark(approval.key, { at: 0, duration: 0.7 }), hold: 0.2 },
      {
        // Only then does it drop in, the mark with it: the slot is filled, and the copy is a catalog entry.
        moves: [
          to(copy.key, copy.lands, undefined, { at: 0, duration: 0.45, ease: EASE.page }),
          to(approval.key, { y: approval.drop }, { y: 0 }, { at: 0, duration: 0.45, ease: EASE.page }),
          hide(catalog.slot.key, { at: 0.3, duration: 0.2 }),
          show(copy.edge, { at: 0.35 }),
        ],
        hold: 0.6,
      },
    ]),
  });
};

/** 36: three of your people; a laptop opens in front of each in turn, an AI coding tool on its screen; the bracket and the label under all three. */
const training = () => {
  const { seats, bracket, label } = TRAINING;
  return picture("training", {
    play: chained([
      { moves: [leave("step-one"), handOver("step-one", "training")] },
      { moves: draw(seats.map((seat) => seat.person.key), { at: 0, duration: 0.5, stagger: STAGGER_PEOPLE }), with: true, hold: 0.3 },
      { moves: story("training", 0), with: true, hold: 0.3 },
      {
        moves: seats.flatMap((seat, i) => [...show(seat.laptop.key, { at: i * 0.7, duration: 0.3 }), ...open(seat.laptop.lid, { at: i * 0.7 + 0.1, duration: 0.75 })]),
        hold: 0.3,
      },
      { moves: [draw(bracket.key, { at: 0, duration: 0.6 }), rise(label.key, { at: 0.3 })], hold: 0.2 },
      { moves: story("training", 1), with: true, hold: 0.8 },
    ]),
  });
};

/** 36a: the request to IT, headed so, its three pieces listed one by one; a person named IT gives it their mark; then your department's space on GitHub opens beside it, its staff's accounts come up, and its project fills with the history, each approval's mark landing on its row. */
const github = () => {
  const { request, space } = GITHUB_SETUP;
  return picture("github", {
    play: chained([
      { moves: [leave("training"), handOver("training", "github")] },
      { moves: story("github", 0), with: true, hold: 0.3 },
      {
        moves: [draw(request.key, { at: 0, duration: 0.7 }), rise(request.header.key, { at: 0.3 }), rise(keys(request.items), { at: 0.5, stagger: 0.35 })],
        hold: 0.4,
      },
      {
        // IT approves the request: a person, named IT, and their mark beside the name.
        moves: [draw(request.person.key, { at: 0, duration: 0.5 }), rise(request.label.key, { at: 0.3 }), mark(request.mark.key, { at: 0.6, duration: 0.7 })],
        hold: 0.4,
      },
      {
        // Your department's space opens: GitHub's mark and its name, then your staff's accounts.
        moves: [
          wipe(space.key, { at: 0 }),
          rise([space.logo.key, space.label.key], { at: 0.3, stagger: 0.1 }),
          rise(keys(space.staff), { at: 0.7, stagger: 0.15 }),
        ],
        hold: 0.3,
      },
      {
        // Its project keeps the history: a row for each change and approval as it happens, a change's passed checks ticked, an approval's mark landing once its row is in.
        moves: [
          draw(space.project.key, { at: 0, duration: 0.7 }),
          rise(keys(space.project.rows), { at: 0.6, stagger: 0.3 }),
          space.project.rows.flatMap((row, i) => (row.kind === "approval" ? mark(`${row.key}.mark`, { at: 0.6 + i * 0.3 + 0.6, duration: 0.5 }) : [])),
        ],
        hold: 0.4,
      },
      { moves: story("github", 1), with: true, hold: 0.6 },
    ]),
  });
};

export const stepsOfSteps = (): StepDef[] => [...three(), ...stepOne(), ...training(), ...github()];
