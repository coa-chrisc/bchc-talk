/**
 * Slides 36a to 38 of the start world: where every part goes, the id it
 * takes and the words it holds, read from the script. Shared helpers and
 * slides 34 to 36 are in layout.ts.
 */
import { box } from "@/components/deck/kit";
import { LINE, labelsOf, personAt } from "./layout";

/* 36a. Set up GitHub. One request card headed Request to IT, listing the three pieces, which a person named IT approves; then your department's own space on GitHub, holding your staff's accounts and a project that keeps the history, each row marked with a passed check or an approval. */

const [REQUEST_TO_IT, ORGANIZATION, STAFF_ACCOUNTS, CREATE, IT, DEPARTMENT, HISTORY] = labelsOf("github");
const GH_TOP = 488;
const GH_H = 420;
/** The request, at the left: its header in a bar across its top, as the history's project has, then the three pieces one under another, a bullet before each. */
const REQUEST = box(96, GH_TOP, 600, GH_H);
export const REQUEST_BAR = 56;
const ROW = { x: REQUEST.x + 72, y: REQUEST.y + REQUEST_BAR + 24, pitch: 66, w: REQUEST.w - 104 };
/** The person from IT at the card's foot, named, and their mark beside the name, inside the card. */
const IT_PERSON = personAt(REQUEST.x + 48, REQUEST.y + 300, 1.25);
const IT_NAME = { x: IT_PERSON.x + IT_PERSON.w + 20, y: IT_PERSON.y + IT_PERSON.h / 2 };
/** Your department's space on GitHub, at the right, as wide as the stage leaves. */
const SPACE = box(776, GH_TOP, 1824 - 776, GH_H);
const ACCOUNT_R = 42;
const ACCOUNTS = [
  [SPACE.x + 84, SPACE.y + 166],
  [SPACE.x + 194, SPACE.y + 166],
  [SPACE.x + 84, SPACE.y + 296],
  [SPACE.x + 194, SPACE.y + 296],
];
const PROJECT = box(SPACE.x + 288, SPACE.y + 112, SPACE.w - 288 - 32, 284);
export const PROJECT_BAR = 56;
/** What each row of the history records, top to bottom: a change whose checks passed, then its approval, twice over. */
const ROW_KINDS = ["check", "approval", "check", "approval"] as const;

export const GITHUB_SETUP = {
  request: {
    key: "github.request",
    at: REQUEST,
    /** Its header, one line of label type centred in the bar. */
    header: { key: "github.request.header", text: REQUEST_TO_IT, at: box(REQUEST.x + 24, REQUEST.y + REQUEST_BAR / 2 - 14, REQUEST.w - 48, 28) },
    items: [ORGANIZATION, STAFF_ACCOUNTS, CREATE].map((text, i) => {
      const at = box(ROW.x, ROW.y + i * ROW.pitch, ROW.w, LINE);
      return { key: `github.request.item.${i}`, text, at, bullet: { x: REQUEST.x + 44, y: at.y + at.h / 2 } };
    }),
    person: { key: "github.request.person", at: IT_PERSON },
    /** Who the person is: IT, named at their right. */
    label: { key: "github.request.label", text: IT, at: IT_NAME },
    /** The person's mark, past their name: the request is approved. */
    mark: { key: "github.request.mark", at: { x: IT_NAME.x + 94, y: IT_NAME.y } },
  },
  space: {
    key: "github.space",
    at: SPACE,
    /** GitHub's mark and your department's name, at the space's top left, as a GitHub organization shows them. */
    logo: { key: "github.space.logo", at: { x: SPACE.x + 32, y: SPACE.y + 28 }, size: 48 },
    label: { key: "github.space.label", text: DEPARTMENT, at: box(SPACE.x + 100, SPACE.y + 30, 600, LINE) },
    staff: ACCOUNTS.map(([cx, cy], i) => ({ key: `github.staff.${i}`, at: box(cx - ACCOUNT_R, cy - ACCOUNT_R, 2 * ACCOUNT_R, 2 * ACCOUNT_R) })),
    project: {
      key: "github.project",
      at: PROJECT,
      name: HISTORY,
      /** One row a change or an approval, written in as they happen: a change's row carries the deep-green tick of its passed checks, an approval's the approval mark, which lands once the row is in. */
      rows: ROW_KINDS.map((kind, i) => ({ key: `github.project.row.${i}`, kind, at: box(PROJECT.x + 28, PROJECT.y + PROJECT_BAR + 28 + i * 48, PROJECT.w - 56, 28) })),
    },
  },
};

/* 37. Request access to AI coding tools: an AI coding tool waits at the door of your department; it is purchased (a receipt and a plain tick) and approved (a person's mark); the door opens, the tool goes in and opens into one tool window beside the people inside, and each of them gets an agent working in it. */

const [TOOL_NAME, TOOLS_DEPARTMENT, PURCHASED, APPROVERS, APPROVED] = labelsOf("tools");
/** Your department, a dashed outline with a doorway in its left wall. */
const ROOM = { x0: 760, y0: 520, x1: 1824, y1: 960 };
const DOOR = { top: 640, bottom: 800 };
/** The tool waits outside the doorway, its name on it. */
const TOOL = box(480, 660, 230, 120);
/** What it needs before the door opens, one above the other at the left: a receipt (Purchased), then a person's mark (Approved). */
const RECEIPT = box(96, 540, 120, 150);
const APPROVER = personAt(96, 820, 1.5);
/** Inside, the tool opens into its window, clear of the door's swing; the people stand at its right. */
const WINDOW = box(1000, 556, 560, 376);
const WINDOW_BAR = 56;
const ROWS = [0, 1, 2].map((i) => Math.round(WINDOW.y + WINDOW_BAR + ((WINDOW.h - WINDOW_BAR) * (2 * i + 1)) / 6));
const PERSON_SCALE = 1.25;
const PEOPLE_X = WINDOW.x + WINDOW.w + 72;
const AGENT_X = WINDOW.x + 56;
/** Each agent's code, two lines it writes out to its right. */
const CODE = [
  { dy: -14, w: 300 },
  { dy: 6, w: 220 },
];

export const TOOLS = {
  room: {
    key: "tools.room",
    at: box(ROOM.x0, ROOM.y0, ROOM.x1 - ROOM.x0, ROOM.y1 - ROOM.y0),
    /** From the top of the doorway round the room to its foot: the gap between is the doorway. In the room's own pixels. */
    d: `M0 ${DOOR.top - ROOM.y0}V0H${ROOM.x1 - ROOM.x0}V${ROOM.y1 - ROOM.y0}H0V${DOOR.bottom - ROOM.y0}`,
  },
  label: { key: "tools.label", text: TOOLS_DEPARTMENT, at: box(ROOM.x0, ROOM.y0 - 54, 600, LINE) },
  /** The door: a jamb at each end of the doorway, and a leaf hung from the top one, shut across the doorway. It swings into the room (`open`), and its swing draws as it goes. */
  door: {
    key: "tools.door",
    top: DOOR.top,
    length: DOOR.bottom - DOOR.top,
    hinge: { x: ROOM.x0, y: DOOR.top },
    swing: { key: "tools.door.swing" },
  },
  tool: {
    key: "tools.tool",
    at: TOOL,
    name: { key: "tools.tool.name", text: TOOL_NAME, at: { x: TOOL.x + TOOL.w / 2, y: TOOL.y + 26 + (TOOL.h - 26) / 2 } },
    /** Through the doorway, into the place its window opens round it. */
    through: WINDOW.x + 60 - TOOL.x,
    window: { key: "tools.window", at: WINDOW, bar: WINDOW_BAR, name: TOOL_NAME },
  },
  receipt: {
    key: "tools.receipt",
    at: RECEIPT,
    /** It slides in from the left margin. */
    from: -160,
    tick: { key: "tools.receipt.tick", d: `M${RECEIPT.x + 32} ${RECEIPT.y + 96}L${RECEIPT.x + 52} ${RECEIPT.y + 116}L${RECEIPT.x + 90} ${RECEIPT.y + 74}` },
    label: { key: "tools.receipt.label", text: PURCHASED, at: { x: RECEIPT.x + RECEIPT.w + 18, y: RECEIPT.y + RECEIPT.h / 2 } },
  },
  approver: {
    key: "tools.approver",
    at: APPROVER,
    /** Over them, from the margin. */
    label: { key: "tools.approver.label", text: APPROVERS, at: { x: APPROVER.x, y: APPROVER.y - 30 } },
  },
  /** The person's mark, beside them and facing the tool: "Approved". */
  mark: { key: "tools.mark", at: { x: APPROVER.x + APPROVER.w + 62, y: APPROVER.y + APPROVER.h / 2 }, label: APPROVED },
  people: ROWS.map((cy, i) => ({ key: `tools.person.${i}`, at: personAt(PEOPLE_X, cy - (64 * PERSON_SCALE) / 2, PERSON_SCALE) })),
  /** One agent a person, in the window's row level with them, writing its code. */
  agents: ROWS.map((cy, i) => ({
    key: `tools.agent.${i}`,
    at: { x: AGENT_X, y: cy },
    code: CODE.map((line, j) => ({ key: `tools.agent.${i}.code.${j}`, at: box(AGENT_X + 48, cy + line.dy, line.w, 10) })),
  })),
};

/* 38. Decide who is responsible for approving changes: your approver and a backup, each on a card sized to them, and a queue of agent cards each holding a change; the approver takes the first three onto their card and their mark lands on each; the last agent card tries a locked Publish and bounces off. */

const [YOUR_APPROVER, BACKUP, PUBLISH, CANNOT] = labelsOf("approver");
const CARDS_TOP = 488;
const CARDS_H = 236;
const SEATED = 1.5;
/** A change: a page with writing at its top, and room under the writing for a person's mark. */
const CHANGE = { w: 72, h: 110 };
/** Where the approver keeps what they approve: on their card, right of them, one place for each change they take. */
const DESK = { x: 96 + 240, y: CARDS_TOP + 36, apart: CHANGE.w + 20 };
const TAKEN = 3;
const APPROVER_CARD = box(96, CARDS_TOP, DESK.x + (TAKEN - 1) * DESK.apart + CHANGE.w + 32 - 96, CARDS_H);
const BACKUP_CARD = box(APPROVER_CARD.x + APPROVER_CARD.w + 40, CARDS_TOP, 232, CARDS_H);
/** A person on a card: their figure in the card's left part, their name under it. */
const seated = (card: typeof APPROVER_CARD, cx: number) => personAt(cx - (48 * SEATED) / 2, card.y + 34, SEATED);
const APPROVER_FIGURE = seated(APPROVER_CARD, APPROVER_CARD.x + 120);
const BACKUP_FIGURE = seated(BACKUP_CARD, BACKUP_CARD.x + BACKUP_CARD.w / 2);
/** The queue: agent cards in front of the people, each card framing its agent, the change it holds beside it, so a card stays whole when its change is taken. */
const QUEUE = { y: CARDS_TOP + 264, w: 104, h: 150, x: [96, 316, 536, 756] };
const HELD = { dx: QUEUE.w + 16, dy: 20 };
const PUBLISH_AT = box(1464, CARDS_TOP + 156, 360, 96);
/** The card that tries to publish: the last in the queue. It goes until it meets the button, level with it, and is pushed back. */
const TRIER = QUEUE.x.length - 1;
const TRIES = { x: PUBLISH_AT.x - (QUEUE.x[TRIER] + HELD.dx + CHANGE.w) - 4, y: PUBLISH_AT.y + PUBLISH_AT.h / 2 - (QUEUE.y + QUEUE.h / 2) };

export const APPROVER_SLIDE = {
  cards: [
    { key: "approver.card.approver", at: APPROVER_CARD, figure: { key: "approver.approver", at: APPROVER_FIGURE }, name: YOUR_APPROVER },
    { key: "approver.card.backup", at: BACKUP_CARD, figure: { key: "approver.backup", at: BACKUP_FIGURE }, name: BACKUP },
  ].map((card) => ({ ...card, nameKey: `${card.key}.name`, nameAt: { x: card.figure.at.x + card.figure.at.w / 2, y: card.at.y + card.at.h - 40 } })),
  queue: QUEUE.x.map((x, i) => {
    const change = box(x + HELD.dx, QUEUE.y + HELD.dy, CHANGE.w, CHANGE.h);
    return {
      key: `approver.queue.${i}`,
      at: box(x, QUEUE.y, QUEUE.w, QUEUE.h),
      agent: { key: `approver.queue.${i}.agent`, at: { x: x + 52, y: QUEUE.y + QUEUE.h / 2 } },
      change: {
        key: `approver.queue.${i}.change`,
        at: change,
        /** How far it goes to its place on the approver's card, for the three the approver takes. */
        desk: i < TAKEN ? { x: DESK.x + i * DESK.apart - change.x, y: DESK.y - change.y } : null,
        /** The approval, under the page's writing: it goes where the change goes. */
        mark: { key: `approver.queue.${i}.mark`, at: { x: change.x + CHANGE.w / 2, y: change.y + CHANGE.h - 28 } },
      },
    };
  }),
  publish: { key: "approver.publish", at: PUBLISH_AT, text: PUBLISH, lock: { x: PUBLISH_AT.x + 52, y: PUBLISH_AT.y + PUBLISH_AT.h / 2 } },
  /** The card that tries: up and across to the button's edge, then pushed back. */
  trier: TRIER,
  tries: TRIES,
  pushedTo: TRIES.x - 140,
  cannot: { key: "approver.cannot", text: CANNOT, at: { x: PUBLISH_AT.x + PUBLISH_AT.w, y: PUBLISH_AT.y - 52 } },
};
