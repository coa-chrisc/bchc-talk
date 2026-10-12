/**
 * The clicks of slides 39 and 40, one a slide, each a chain of beats
 * (docs/bchc-flow-revision.md, sections 1 and 3). The path 39 starts goes
 * at 40's click and comes back at 41's (steps-ask.ts), where it carries on.
 */
import type { StepDef } from "@/components/deck/engine";
import { EASE, draw, fill, ghost, hide, rise, show, to, wipe } from "@/components/deck/kit";
import { picture, story } from "../steps";
import { EXAMPLES, LOW_RISK, PATH } from "./layout-path";
import { chained, handOver, leave } from "./moves";
import { keys } from "./steps-steps";

/** Shows a person who is drawn on: they come up already drawn. */
const appear = (key: string | string[], opts: { at: number; duration?: number; stagger?: number }) =>
  to(key, { autoAlpha: 1, "--d": 1 }, { autoAlpha: 0, "--d": 0 }, { duration: 0.3, ease: EASE.soft, ...opts });

/** 39: a pile of public information becomes one clear tool, residents reach its services, and the path starts with it. The pile stays, named, so the end reads left to right in navy arrows: public data, the agent, the tool, the residents. */
const lowRisk = () =>
  picture("low-risk", {
    play: chained([
      { moves: [leave("fde"), handOver("fde", "low-risk")] },
      { moves: [show(keys(LOW_RISK.sheets), { at: 0, duration: 0.35, stagger: 0.05 }), rise(LOW_RISK.labels[0].key, { at: 0.5 })], with: true, hold: 0.3 },
      { moves: story("low-risk", 0), with: true, hold: 0.3 },
      {
        moves: [
          // The agent and the tool it makes, each named as it comes, and the arrows that carry the data from the pile to the agent and on into the tool.
          draw(LOW_RISK.agent.key, { at: 0, duration: 0.6 }),
          draw(LOW_RISK.arrows[0].key, { at: 0.2, duration: 0.5 }),
          draw(LOW_RISK.arrows[1].key, { at: 0.55, duration: 0.5 }),
          fill(LOW_RISK.agent.key, { at: 0.3, duration: 0.6 }),
          rise(LOW_RISK.labels[1].key, { at: 0.3 }),
          draw(LOW_RISK.tool.key, { at: 0.1, duration: 0.8 }),
          // A copy of each sheet leaves the pile, past the agent, into the tool, and becomes one of its three rows; the pile stays.
          show(LOW_RISK.sheets.map((sheet) => sheet.copyKey), { at: 0.35, duration: 0.01, stagger: 0 }),
          LOW_RISK.sheets.flatMap((sheet, i) => to(sheet.copyKey, sheet.to, { x: 0, y: 0 }, { at: 0.35 + i * 0.03, duration: 0.7, ease: EASE.page })),
          hide(
            LOW_RISK.sheets.map((sheet) => sheet.copyKey),
            { at: 0.9, duration: 0.3, stagger: 0.03 },
          ),
          to(keys(LOW_RISK.rows), { autoAlpha: 1, "--k": 1 }, { autoAlpha: 0, "--k": 0 }, { at: 0.95, duration: 0.6, ease: EASE.draw, stagger: 0.09 }),
          rise(LOW_RISK.labels[2].key, { at: 1.2 }),
        ],
        hold: 0.85,
      },
      {
        // The tool reaches residents: an arrow out to them, they come in beside its services, and the services fill.
        moves: [
          draw(LOW_RISK.arrows[2].key, { at: 0, duration: 0.5 }),
          show(keys(LOW_RISK.services), { at: 0, duration: 0.3, stagger: 0.05 }),
          appear(keys(LOW_RISK.residents), { at: 0.3, stagger: 0.04 }),
          LOW_RISK.residents.flatMap((person, i) => to(person.key, person.to, { x: 0, y: 0 }, { at: 0.3 + i * 0.04, duration: 0.75, ease: EASE.page })),
          rise(LOW_RISK.residentsLabel.key, { at: 0.8 }),
          fill(keys(LOW_RISK.services), { at: 0.7, duration: 0.45, stagger: 0.07 }),
        ],
        hold: 0.15,
      },
      { moves: story("low-risk", 1), with: true, hold: 0.1 },
      {
        // The first project on the path, and the rest of the path still to come.
        moves: [
          draw(PATH.line.key, { at: 0, duration: 0.5 }),
          fill(PATH.dot.key, { at: 0.25, duration: 0.4 }),
          draw(PATH.tool.key, { at: 0.3, duration: 0.6 }),
          rise(LOW_RISK.first.key, { at: 0.6 }),
          wipe(PATH.rest.key, { at: 0.45, duration: 0.9 }),
        ],
        hold: 0.7,
      },
    ]),
  });

/** A resident answers 40's questions one at a time, then the services that match them light up. */
const ANSWER = { first: 1.0, apart: 0.3 };
/** The spoken question's bars travel a group to each line of the list, this far apart; each line comes up and fills as its bars arrive. */
const SPOKEN = { first: 1.5, apart: 0.5, travel: 0.6 };

/** 40's helpline, drawn: a spoken question comes up, then its bars travel down into the lines of a short list, which fill as they arrive. */
const spokenToList = () => {
  const { helpline } = EXAMPLES;
  const { voice } = helpline;
  return [
    draw(helpline.key, { at: 0, duration: 0.8 }),
    rise(helpline.wave.keys, { at: 0.3, duration: 0.6, stagger: 0.02 }),
    // The question leaves: a copy of it takes its place, and the waveform it leaves steps back.
    show(voice.keys, { at: SPOKEN.first, duration: 0.01, stagger: 0 }),
    ghost(helpline.wave.key, { at: SPOKEN.first, duration: 0.3 }),
    voice.groups.flatMap((bars, g) => {
      const at = SPOKEN.first + 0.05 + g * SPOKEN.apart;
      const lands = at + SPOKEN.travel;
      const item = helpline.list[g].key;
      return [
        // The bars go down to the line, flattening from a voice into a line of writing.
        bars.flatMap((bar) => to(bar.key, { ...bar.to, "--k": 0.2 }, { x: 0, y: 0, "--k": 1 }, { at, duration: SPOKEN.travel, ease: EASE.page })),
        rise(item, { at: lands - 0.3, duration: 0.4 }),
        fill(item, { at: lands - 0.1, duration: 0.45 }),
        hide(bars.map((bar) => bar.key), { at: lands, duration: 0.25, stagger: 0 }),
      ].flat();
    }),
  ].flat();
};

/** 40: two starter templates, each named and tagged as it comes: the Service Catalog matches a resident's answers to services, and the helpline turns a spoken question into a short list. The path steps aside for them. */
const examples = () => {
  const { catalog, helpline } = EXAMPLES;
  const radios = catalog.questions.map((q) => q.radio.key);
  return picture("examples", {
    play: chained([
      { moves: [leave("low-risk", "path"), handOver("low-risk", "examples")] },
      {
        moves: [
          rise(catalog.name.key, { at: 0 }),
          draw(catalog.key, { at: 0.1, duration: 0.8 }),
          rise([...keys(catalog.questions), ...keys(catalog.results)], { at: 0.35, stagger: 0.06 }),
          // A resident answers each question in turn, and then the services that fit them light up.
          fill(radios, { at: ANSWER.first, duration: 0.35, stagger: ANSWER.apart }),
          fill(
            catalog.matches.map((i) => catalog.results[i].key),
            { at: ANSWER.first + radios.length * ANSWER.apart + 0.2, duration: 0.5, stagger: 0.09 },
          ),
        ],
        with: true,
        hold: 0.3,
      },
      { moves: story("examples", 0), with: true, hold: 0.3 },
      { moves: [rise(helpline.name.key, { at: 0 }), spokenToList()], hold: 0.55 },
      { moves: story("examples", 1), hold: 0.4 },
    ]),
  });
};

export const stepsOfPath = (): StepDef[] => [...lowRisk(), ...examples()];
