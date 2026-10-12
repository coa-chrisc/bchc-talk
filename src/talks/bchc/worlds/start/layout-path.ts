/**
 * Slides 39 and 40 of the start world, and the path along the foot of the
 * stage that 39 starts and 41 carries on: where every part goes and the id
 * it takes. The path's own parts start `path.`; everything else starts with
 * its picture's id. The path's ends are exported for 41 (layout-ask.ts).
 */
import { AGENT_R, WAVE, box, waveform, type Box, type CellLayout } from "@/components/deck/kit";
import { shown } from "../../script/find";
import { PERSON, labelsOf } from "./layout";
import type { SheetKind } from "./parts";

/** A small person, for residents: the kit's person at 0.6. */
const RESIDENT = { w: Math.round(PERSON.w * 0.6), h: Math.round(PERSON.h * 0.6) };
export const cell = (key: string, at: Box): CellLayout => ({ key, ...at });

/* The path: from the left edge to the right along y 960, clear of the footer. Its first stretch is drawn, the rest is dashed. */

export const PATH_Y = 960;
export const PATH_END = 1824;
const FIRST = { x: 200, y: PATH_Y };

export const PATH = {
  line: { key: "path.line", from: { x: 96, y: PATH_Y }, to: { x: 260, y: PATH_Y } },
  dot: { key: "path.dot", at: FIRST },
  tool: { key: "path.tool", at: box(FIRST.x - 48, PATH_Y - 80, 96, 64) },
  /** A dashed line with no box, only its stub: the box is a point at the drawn stretch's end. */
  rest: { key: "path.rest", at: box(260, PATH_Y, 0, 0), stub: PATH_END - 260 },
};

/* 39. Step three: a pile of public information, an agent that turns it into one clear tool, residents arriving at its services; navy arrows carry the flow from one to the next. */

/** Twelve sheets, set down by hand, four of each kind: listings, hours, rules. Given from the pile's top; it sits a clear gap under a two-line title's story band. */
const PILE_TOP = 556;
const SHEETS: [number, number, SheetKind][] = [
  [112, 0, "list"],
  [236, 29, "clock"],
  [356, 3, "checks"],
  [474, 26, "list"],
  [572, 5, "clock"],
  [160, 106, "checks"],
  [290, 125, "list"],
  [420, 99, "clock"],
  [548, 118, "checks"],
  [118, 165, "clock"],
  [338, 173, "checks"],
  [470, 162, "list"],
];
const SHEET = { w: 80, h: 100 };
const TOOL = box(960, 560, 440, 300);
const ROW_Y = [612, 688, 764];
const ROW = { x: 992, w: 200, h: 48 };
const SERVICE = { x: 1224, w: 136, h: 48 };
/** The residents stand at the tool's right, two to each of its rows, and come in from further right. */
const RESIDENTS = { x: 1528, apart: 40, from: 120 };
/** Which row each kind of sheet becomes. */
const ROW_OF: Record<SheetKind, number> = { list: 0, clock: 1, checks: 2 };

/** Level with the tool's middle, so the arrows run straight. */
const AGENT = { x: 800, y: TOOL.y + TOOL.h / 2 };
const [PUBLIC_DATA, AGENT_LABEL, CLEAR_TOOL, RESIDENTS_LABEL, FIRST_PROJECT] = labelsOf("low-risk");
/** The pile's own extent: its words go under it. */
const PILE = { x0: Math.min(...SHEETS.map(([x]) => x)), x1: Math.max(...SHEETS.map(([x]) => x)) + SHEET.w, y1: Math.max(...SHEETS.map(([, top]) => top)) + PILE_TOP + SHEET.h };
/** Where each arrow leaves from and goes to, level with the tool's middle: the arrows start a little clear of what they leave. */
const LEAVE = 14;
const PILE_EDGE = box(PILE.x1 + LEAVE, AGENT.y, 0, 0);
const AGENT_BOX = box(AGENT.x - AGENT_R - LEAVE, AGENT.y - AGENT_R, 2 * (AGENT_R + LEAVE), 2 * AGENT_R);
const TOOL_EDGE = box(TOOL.x, TOOL.y, TOOL.w + LEAVE, TOOL.h);
/** The residents, as one group as tall as the tool, for the arrow that reaches them. */
const CROWD = box(RESIDENTS.x - 8, TOOL.y, RESIDENTS.apart + RESIDENT.w + 16, TOOL.h);

export const LOW_RISK = {
  /** The pile stays to the end: it is what the tool is made from. A copy of each sheet is what travels into the tool. */
  sheets: SHEETS.map(([x, top, kind], i) => {
    const y = top + PILE_TOP;
    const row = ROW_Y[ROW_OF[kind]];
    return {
      key: `low-risk.sheet.${i}`,
      copyKey: `low-risk.copy.${i}`,
      at: { x, y },
      kind,
      /** How far its copy travels to land on its row. */
      to: { x: ROW.x + ROW.w / 2 - (x + SHEET.w / 2), y: row + ROW.h / 2 - (y + SHEET.h / 2) },
    };
  }),
  agent: { key: "low-risk.agent", at: AGENT },
  /** Each part named under it, so the slide reads left to right: public data, the agent, the one clear tool; and the path's first project beside it. */
  labels: [
    { key: "low-risk.label.data", text: PUBLIC_DATA, at: { x: (PILE.x0 + PILE.x1) / 2, y: PILE.y1 + 28 }, anchor: "middle" as const },
    { key: "low-risk.label.agent", text: AGENT_LABEL, at: { x: AGENT.x, y: AGENT.y + AGENT_R + 30 }, anchor: "middle" as const },
    { key: "low-risk.label.tool", text: CLEAR_TOOL, at: { x: TOOL.x + TOOL.w / 2, y: TOOL.y + TOOL.h + 30 }, anchor: "middle" as const },
  ],
  /** The path's first project, named to the right of it: in this picture, so it goes when the picture does. */
  first: { key: "low-risk.label.first", text: FIRST_PROJECT, at: { x: FIRST.x + 64, y: FIRST.y - 48 }, anchor: "start" as const },
  tool: { key: "low-risk.tool", at: TOOL },
  rows: ROW_Y.map((y, i) => cell(`low-risk.row.${i}`, box(ROW.x, y, ROW.w, ROW.h))),
  services: ROW_Y.map((y, i) => ({ key: `low-risk.service.${i}`, at: box(SERVICE.x, y, SERVICE.w, SERVICE.h) })),
  /** Six residents, two to each service, who come in from the right and stand at the tool's right, level with its rows. */
  residents: Array.from({ length: 6 }, (_, i) => {
    const service = Math.floor(i / 2);
    const end = { x: RESIDENTS.x + (i % 2) * RESIDENTS.apart, y: ROW_Y[service] + (ROW.h - RESIDENT.h) / 2 };
    const at = box(end.x + RESIDENTS.from, end.y, RESIDENT.w, RESIDENT.h);
    return { key: `low-risk.resident.${i}`, at, to: { x: end.x - at.x, y: end.y - at.y } };
  }),
  residentsLabel: { key: "low-risk.label.residents", text: RESIDENTS_LABEL, at: { x: CROWD.x + CROWD.w / 2, y: TOOL.y + TOOL.h + 30 }, anchor: "middle" as const },
  /** The flow, in navy arrows: public data to the agent, the agent to the tool, the tool to the residents. */
  arrows: [
    { key: "low-risk.arrow.data", from: PILE_EDGE, to: AGENT_BOX },
    { key: "low-risk.arrow.agent", from: AGENT_BOX, to: TOOL },
    { key: "low-risk.arrow.tool", from: TOOL_EDGE, to: CROWD },
  ],
};

/* 40. Two starter templates, each a line drawing tagged "Starter template": the Service Catalog matching a resident to services, and the helpline turning a spoken question into a short list. */

/** Under the three-line title's story lines: each drawing's name and tag, then the drawing. */
const NAME_Y = 596;
const FRAME_TOP = 656;
const FRAME_H = 320;
const CATALOG = box(96, FRAME_TOP, 800, FRAME_H);
const HELPLINE = box(1024, FRAME_TOP, 800, FRAME_H);
const QUESTION_Y = [56, 128, 200].map((dy) => FRAME_TOP + dy);
const RESULT_Y = [44, 94, 144, 194, 244].map((dy) => FRAME_TOP + dy);
const LIST_Y = [160, 208, 256].map((dy) => FRAME_TOP + dy);
const HELPLINE_WAVE = waveform({ id: "examples.helpline.wave", x: HELPLINE.x + (HELPLINE.w - 336) / 2, y: FRAME_TOP + 44 });
const VOICE = waveform({ id: "examples.helpline.voice", x: HELPLINE_WAVE.box.x, y: HELPLINE_WAVE.box.y });
const LIST = LIST_Y.map((y, i) => cell(`examples.helpline.item.${i}`, box(1104, y, 640, 40)));
/** The question's 24 bars go a third to each line of the list, set at the waveform's own spacing along the line's start. */
const VOICE_GROUP = VOICE.bars.length / LIST.length;
const [TEMPLATE, CATALOG_NAME, HELPLINE_NAME] = shown("examples", "play");
/** The tag's outline is a fixed size: the word with room round it. */
export const TAG = { w: 240, h: 44 };

export const EXAMPLES = {
  tag: TEMPLATE,
  catalog: {
    key: "examples.catalog",
    at: CATALOG,
    name: { key: "examples.catalog.name", text: CATALOG_NAME, at: box(CATALOG.x, NAME_Y, CATALOG.w, TAG.h) },
    questions: QUESTION_Y.map((y, i) => ({ key: `examples.catalog.q.${i}`, at: box(144, y, 300, 48), radio: { key: `examples.catalog.radio.${i}`, at: { x: 176, y: y + 24 } } })),
    results: RESULT_Y.map((y, i) => cell(`examples.catalog.result.${i}`, box(520, y, 320, 40))),
    /** The services that match: they fill. */
    matches: [0, 2, 3],
  },
  helpline: {
    key: "examples.helpline",
    at: HELPLINE,
    name: { key: "examples.helpline.name", text: HELPLINE_NAME, at: box(HELPLINE.x, NAME_Y, HELPLINE.w, TAG.h) },
    wave: HELPLINE_WAVE,
    /** The spoken question, turning into the list: a copy of the waveform over it, whose bars travel down a group to each line of the list. */
    voice: { ...VOICE, groups: LIST.map((item, g) => VOICE.bars.slice(g * VOICE_GROUP, (g + 1) * VOICE_GROUP).map((bar, j) => ({ key: bar.key, to: { x: item.x + 18 + j * WAVE.pitch + WAVE.w / 2 - bar.cx, y: item.y + item.h / 2 - bar.cy } }))) },
    list: LIST,
  },
};
