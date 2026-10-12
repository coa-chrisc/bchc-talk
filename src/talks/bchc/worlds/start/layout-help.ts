/**
 * Slides 38a and 38b of the start world: the questions your IT and security
 * teams will ask, and the forward-deployed engineer. Where every part goes,
 * the id it takes and the words it holds, read from the script.
 */
import { box } from "@/components/deck/kit";
import { shown } from "../../script/find";
import { LINE, PERSON, personAt } from "./layout";

/* 38a. The questions your IT and security teams will ask: each question, and its short answer sliding in beside it. */

/** Under the two-line title's story band, which here holds one line: the pairs start a clear row below it. */
const QUESTION_Y = [552, 660, 768, 876];
const QUESTION_W = 760;
const RULE_X = 912;
const ANSWER_X = 960;

export const QUESTIONS = {
  rule: { key: "questions.rule", from: { x: RULE_X, y: 536 }, to: { x: RULE_X, y: 936 } },
  pairs: QUESTION_Y.map((y, i) => ({
    question: { key: `questions.q.${i}`, text: shown("questions", "play")[2 * i], at: box(96, y, QUESTION_W, LINE) },
    answer: { key: `questions.a.${i}`, text: shown("questions", "play")[2 * i + 1], at: box(ANSWER_X, y, 1824 - ANSWER_X, LINE) },
  })),
  /** How far an answer slides in from. */
  slide: 60,
};

/* 38b. Forward-deployed engineers. Your department and central IT with a queue between; one engineer comes to sit with your staff. */

/** Both end 48 px over the footer's keep-clear line. */
const FDE_DEPT = box(96, 600, 640, 368);
const FDE_IT = box(1184, 600, 640, 368);
const FDE_Y = 680;
const ENGINEER = personAt(1430, FDE_Y);
/** Where the engineer sits down, beside the third of your staff, and where they step back to. */
const ENGINEER_SITS = 530;
const ENGINEER_BACK = 610;
const SLIP = { y: 800, w: 40, h: 32, pitch: 52 };
const QUEUE_X = Math.round((FDE_DEPT.x + FDE_DEPT.w + FDE_IT.x) / 2 - (7 * SLIP.pitch + SLIP.w) / 2);
const [FDE_YOURS, FDE_IT_LABEL, FDE_ENGINEER, FDE_QUEUE] = shown("fde", "play");
const STAFF = [140, 270, 400].map((x, i) => ({ key: `fde.staff.${i}`, at: personAt(x, FDE_Y) }));
const ENGINEER_SAT = personAt(ENGINEER_SITS, FDE_Y);
/** Where a piece of work leaves a person: just under their hands. */
const HANDS_Y = FDE_Y + PERSON.h + 10;
/**
 * The two tools, each under the people who build it: the first under the
 * engineer and the third of your staff, the second under the other two
 * once the engineer has stepped back. Each is built of three pieces, each
 * placed by one of them in turn.
 */
const TOOL_SPECS = [
  { at: box(360, 792, 240, 150), by: [ENGINEER_SAT, STAFF[2].at, ENGINEER_SAT], builders: ["fde.engineer", STAFF[2].key, "fde.engineer"] },
  { at: box(110, 792, 220, 150), by: [STAFF[0].at, STAFF[1].at, STAFF[0].at], builders: [STAFF[0].key, STAFF[1].key, STAFF[0].key] },
];
const FDE_PIECE_W = [128, 84, 108];

export const FDE = {
  dept: { key: "fde.dept", at: FDE_DEPT, label: { key: "fde.dept.label", text: FDE_YOURS, at: box(FDE_DEPT.x, FDE_DEPT.y - 58, 600, LINE) } },
  it: { key: "fde.it", at: FDE_IT, label: { key: "fde.it.label", text: FDE_IT_LABEL, at: box(FDE_IT.x, FDE_IT.y - 58, 600, LINE) } },
  staff: STAFF,
  itStaff: [1300, 1560].map((x, i) => ({ key: `fde.it-staff.${i}`, at: personAt(x, FDE_Y) })),
  engineer: {
    key: "fde.engineer",
    at: ENGINEER,
    to: ENGINEER_SITS - ENGINEER.x,
    back: ENGINEER_BACK - ENGINEER.x,
    /** Named over their head, and the name goes where they go. */
    label: { key: "fde.engineer.label", text: FDE_ENGINEER, at: { x: ENGINEER.x + ENGINEER.w / 2, y: FDE_Y - 26 } },
  },
  queue: Array.from({ length: 8 }, (_, i) => ({ key: `fde.slip.${i}`, at: box(QUEUE_X + i * SLIP.pitch, SLIP.y, SLIP.w, SLIP.h) })),
  /** The queue's name, under its slips, clear of the engineer's way over them. */
  queueLabel: { key: "fde.queue.label", text: FDE_QUEUE, at: { x: QUEUE_X + (7 * SLIP.pitch + SLIP.w) / 2, y: SLIP.y + SLIP.h + 34 } },
  tools: TOOL_SPECS.map(({ at, by, builders }, i) => ({
    key: `fde.tool.${i}`,
    at,
    /** Each piece: where it sits in the tool, who places it, and how far it travels from their hands to get there. */
    pieces: by.map((person, j) => {
      const piece = box(at.x + 20, at.y + 46 + j * 30, FDE_PIECE_W[j], 14);
      return { key: `fde.tool.${i}.piece.${j}`, at: piece, by: builders[j], from: { x: person.x + person.w / 2 - piece.w / 2 - piece.x, y: HANDS_Y - piece.y } };
    }),
  })),
};
