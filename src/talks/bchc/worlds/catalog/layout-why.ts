/**
 * The catalog world, slides 10 to 13: what made the catalog possible, and
 * Part 2, why this matters (11, 11a, 12 and 13). Where every part goes, the id each takes, and
 * the words it holds, read from the script.
 */
import { AGENT_R, CONTENT_TOP, TILE, box, tileBox, type Box } from "@/components/deck/kit";
import { shown } from "../../script/find";
import { label } from "./layout";

/** A line of 32 px text is this tall, and a 26 px label. */
const LINE = 44.8;
const LABEL_LINE = 32;
const PERSON = { w: 48, h: 64 };

/* 10. What made it possible */

/**
 * On the right, a bare wireframe of the catalog's front page, in the card
 * grid still's proportions (928 by 520), so the still settles into it at the
 * end. Its three pieces, in the order they are built: the header, the
 * search box and filters, then two rows of project cards. Each piece's
 * place is in the wireframe's own pixels. The person's mark for each lands
 * on its piece, in an open place in the piece's band, and is drawn over the
 * still so it fades on its piece as the still comes in. On the left, apart
 * from the page, the people and the agents, each named, the one mark the
 * people keep beside them once the page is real, and under them the
 * process's rule and its name.
 */
const WIRE = box(1024, CONTENT_TOP.two + 28, 800, 448);
const CARD_W = 240;
const CARD_H = 104;
const cardsAt = (y: number) => [24, 280, 536].map((x) => box(x, y, CARD_W, CARD_H));
/**
 * Each piece's band, its places and where its mark lands, in the
 * wireframe's pixels: the header's in the open middle of its bar (between
 * the search field and the sort menu on the real page); the search row's at
 * its right end, past the filters; the cards' in the gap between their two
 * rows, where the real page's two cards meet.
 */
const PIECES = [
  { id: "header", band: box(0, 0, 800, 64), parts: [box(24, 26, 200, 12)], mark: { x: 506, y: 32 } },
  { id: "search", band: box(0, 76, 800, 60), parts: [box(24, 84, 400, 44), box(448, 84, 112, 44), box(576, 84, 112, 44)], mark: { x: 740, y: 106 } },
  { id: "cards", band: box(0, 148, 800, 272), parts: [...cardsAt(148), ...cardsAt(148 + CARD_H + 56)], mark: { x: 400, y: 148 + CARD_H + 28 } },
];
/** The people, then their mark, then the agents: the mark sits close beside the people, well apart from the agents, and the rule runs under all of them. */
const PEOPLE_PITCH = 72;
const MARK_X = 2 * PEOPLE_PITCH + PERSON.w + 48;
const AGENTS_X = MARK_X + 104;
const GROUP = { x: 160, y: 706, w: AGENTS_X + 2 * PEOPLE_PITCH + AGENT_R };
const [PROCESS, PARTS] = shown("proof", "play");
const RULE_Y = GROUP.y + PERSON.h + 32;

export const PROOF = {
  wire: { key: "wire", at: WIRE },
  /** The pieces: each is drawn bare with the wireframe, then built in the process's colour, then approved. */
  pieces: PIECES.map(({ id, band, parts, mark }) => ({
    key: `wire.${id}`,
    /** The piece's band across the page. */
    band: box(WIRE.x + band.x, WIRE.y + band.y, band.w, band.h),
    parts: parts.map((part) => box(WIRE.x + part.x, WIRE.y + part.y, part.w, part.h)),
    /** The person's mark for the piece, on the piece. */
    mark: { key: `wire.${id}.mark`, at: { x: WIRE.x + mark.x, y: WIRE.y + mark.y } },
  })),
  /** The rule under the header. */
  headerRule: WIRE.y + PIECES[0].band.h,
  /** The header's round menu button, at its right. */
  menu: { x: WIRE.x + 760, y: WIRE.y + 32, r: 14 },
  /** The real catalog, which settles into the wireframe once the last card is in. */
  still: { key: "wire.still", at: WIRE },
  people: [0, 1, 2].map((i) => ({ key: `proof.person.${i}`, at: box(GROUP.x + i * PEOPLE_PITCH, GROUP.y, PERSON.w, PERSON.h) })),
  /** The mark the people keep once the page is real: theirs, beside them, level with them. */
  mark: { key: "proof.mark", at: { x: GROUP.x + MARK_X, y: GROUP.y + PERSON.h / 2 } },
  /** Every agent the deck's builder, the ring with a dot, so the three read as one kind. */
  agents: [0, 1, 2].map((i) => ({ key: `proof.agent.${i}`, at: { x: GROUP.x + AGENTS_X + i * PEOPLE_PITCH, y: GROUP.y + PERSON.h / 2 }, role: "builder" as const })),
  /** Over each three, what they are: the people, then the agents. */
  names: [
    { key: "proof.people", text: label("proof", "People"), at: box(GROUP.x, GROUP.y - 16 - LABEL_LINE, 192, LABEL_LINE) },
    { key: "proof.agents", text: label("proof", "AI agents"), at: box(GROUP.x + AGENTS_X - AGENT_R, GROUP.y - 16 - LABEL_LINE, 192, LABEL_LINE) },
  ],
  rule: { key: "proof.rule", from: { x: GROUP.x, y: RULE_Y }, to: { x: GROUP.x + GROUP.w, y: RULE_Y } },
  labels: [
    { key: "proof.process", text: PROCESS, at: box(GROUP.x, RULE_Y + 16, 560, LINE), soft: false },
    { key: "proof.parts", text: PARTS, at: box(GROUP.x, RULE_Y + 16 + LINE, 560, LINE), soft: true },
  ],
};

/* 11. The problem we all share */

/**
 * All in grey. On the left the request card, "We need a tool", with a line
 * of writing under its words and, at its lower right, where the "No" stamp
 * leaves its mark. Beside it the wall calendar: a binding with two rings
 * over a page of days, and pages over it that turn up over the binding one
 * month at a time, each leaving a strip on the pile of turned pages over the
 * binding. Each page names its month at its top, "Jan" to "Oct", and the
 * calendar's own page under them "Nov". "Months or years" under it. Then the stack of dollar signs, a
 * row of three for every two... a row pair for each quote, growing up from
 * its foot, and the quotes in a column at the right, one under another.
 * Under the request card, where the change request arrives.
 */
const [NEED, MONTHS, QUOTE, NO] = shown("too-long", "play");
const REQUEST = box(120, 600, 420, 260);
const CAL = box(660, 600, 300, 300);
const BINDING_H = 44;
/** The months the pages name, top page first, and last the one on the calendar's own page under them: the script's labels. */
const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov"].map((month) => label("too-long", month));
const PAGES = MONTH_NAMES.length - 1;
/** Ten strips on the pile, kept under the story band's foot (516). */
const STRIP = { h: 4, pitch: 6 };
/** A page's month, in a band at the top of the face, under the binding; the days under it. */
const HEAD = box(CAL.x, CAL.y + BINDING_H + 8, CAL.w, 36);
const DAY = { cols: 5, rows: 4, size: 28, x: CAL.x + 34, y: CAL.y + BINDING_H + 52, dx: 48, dy: 48 };
const DOLLAR = { x: 1080, foot: 900, w: 24, h: 32, dx: 44, dy: 40, perRow: 3 };
const QUOTES = 4;
const ROWS_PER_QUOTE = 2;
const QUOTE_AT = { x: 1340, y: 600, w: 360, h: 56, pitch: 72 };

export const TOO_LONG = {
  request: { key: "need", at: REQUEST, words: { key: "need.words", text: NEED, at: box(REQUEST.x, REQUEST.y + 28, REQUEST.w, LINE) }, lines: [{ x0: REQUEST.x + 48, x1: REQUEST.x + 372, y: REQUEST.y + 108 }, { x0: REQUEST.x + 48, x1: REQUEST.x + 292, y: REQUEST.y + 140 }] },
  /** The stamp's mark on the card, tilted, and the stamp that leaves it and lifts away. */
  no: { key: "no", text: NO, at: box(REQUEST.x + 220, REQUEST.y + 168, 160, 68) },
  stamp: { key: "stamp", at: box(REQUEST.x + 240, REQUEST.y + 72, 120, 96), lift: 72 },
  calendar: {
    key: "calendar",
    at: CAL,
    binding: box(CAL.x, CAL.y, CAL.w, BINDING_H),
    rings: [CAL.x + 80, CAL.x + CAL.w - 80].map((x) => ({ x, y: CAL.y })),
    face: box(CAL.x, CAL.y + BINDING_H, CAL.w, CAL.h - BINDING_H),
    /** Where a page's month is set, and the month on the calendar's own page, which comes on with the pages that cover it. */
    head: HEAD,
    month: { key: "calendar.month", text: MONTH_NAMES[PAGES] },
    days: Array.from({ length: DAY.cols * DAY.rows }, (_, i) => box(DAY.x + (i % DAY.cols) * DAY.dx, DAY.y + Math.floor(i / DAY.cols) * DAY.dy, DAY.size, DAY.size)),
  },
  /** The pages over the face, top one first, each named for its month: each turns up over the binding, and leaves its strip on the pile. */
  pages: Array.from({ length: PAGES }, (_, i) => ({ key: `calendar.page.${i}`, month: MONTH_NAMES[i], strip: { key: `calendar.strip.${i}`, at: box(CAL.x + 8, CAL.y - (i + 1) * STRIP.pitch, CAL.w - 16, STRIP.h) } })),
  months: { key: "months", text: MONTHS, at: box(CAL.x - 60, CAL.y + CAL.h + 20, CAL.w + 120, LINE) },
  quotes: Array.from({ length: QUOTES }, (_, i) => ({ key: `quote.${i}`, text: QUOTE, at: box(QUOTE_AT.x, QUOTE_AT.y + i * QUOTE_AT.pitch, QUOTE_AT.w, QUOTE_AT.h) })),
  /** The rows of dollar signs, from the foot up: each quote adds two. */
  dollars: Array.from({ length: QUOTES * ROWS_PER_QUOTE }, (_, row) => ({
    key: `dollar.${row}`,
    glyphs: Array.from({ length: DOLLAR.perRow }, (_, i) => box(DOLLAR.x + i * DOLLAR.dx, DOLLAR.foot - (row + 1) * DOLLAR.dy + (DOLLAR.dy - DOLLAR.h) / 2, DOLLAR.w, DOLLAR.h)),
  })),
  rowsPerQuote: ROWS_PER_QUOTE,
  change: { key: "change", text: label("too-long", "Change request"), at: box(REQUEST.x + 40, REQUEST.y + REQUEST.h + 36, 340, 64), from: -280 },
};

/* 11a. The tools gap */

/**
 * All in grey, like slide 11, under the two-line title's story band. On the
 * left the product card, with two lines of writing in it, "A tool you
 * already have" under it and its price under that, a row of dollar signs.
 * The AI badge starts off to the left of the card and settles in its upper
 * right corner, and the price grows a second row under the first. On the
 * right, well apart from the card,
 * the three dashed outlines of the tools still waiting, in a column, each
 * named inside.
 */
const [OWNED, AI, ...WANTED] = shown("tools-gap", "play");
const OWNED_CARD = box(240, CONTENT_TOP.two + 40, 400, 240);
const OWNED_WORDS = box(OWNED_CARD.x - 40, OWNED_CARD.y + OWNED_CARD.h + 16, OWNED_CARD.w + 80, LINE);
const BADGE = box(OWNED_CARD.x + OWNED_CARD.w - 24 - 88, OWNED_CARD.y + 24, 88, 52);
/** The price: rows of three of slide 11's dollar signs, centred under the card's words, the first directly under them and the second under the first. */
const PRICE_TOP = OWNED_WORDS.y + OWNED_WORDS.h + 16;
const PRICE_X = OWNED_CARD.x + (OWNED_CARD.w - (DOLLAR.perRow - 1) * DOLLAR.dx - DOLLAR.w) / 2;
const OUTLINE = { x: 1280, y: OWNED_CARD.y, w: 400, h: 112, pitch: 136 };

export const TOOLS_GAP = {
  card: { key: "owned", at: OWNED_CARD, lines: [{ x0: OWNED_CARD.x + 48, x1: OWNED_CARD.x + 352, y: OWNED_CARD.y + 132 }, { x0: OWNED_CARD.x + 48, x1: OWNED_CARD.x + 272, y: OWNED_CARD.y + 172 }] },
  words: { key: "owned.words", text: OWNED, at: OWNED_WORDS },
  /** Where the badge settles, and how far it starts to the left of there: clear of the card. */
  badge: { key: "badge", text: AI, at: BADGE, from: OWNED_CARD.x - 48 - BADGE.w - BADGE.x },
  /** The price's rows, top down: the first comes with the card, the second, under it, with the badge. */
  price: [0, 1].map((row) => ({
    key: `price.${row}`,
    glyphs: Array.from({ length: DOLLAR.perRow }, (_, i) => box(PRICE_X + i * DOLLAR.dx, PRICE_TOP + row * DOLLAR.dy + (DOLLAR.dy - DOLLAR.h) / 2, DOLLAR.w, DOLLAR.h)),
  })),
  /** The tools still waiting: a dashed outline each, named inside. */
  wanted: WANTED.map((text, i) => {
    const at = box(OUTLINE.x, OUTLINE.y + i * OUTLINE.pitch, OUTLINE.w, OUTLINE.h);
    return { key: `wanted.${i}`, at, name: { key: `wanted.${i}.name`, text, at } };
  }),
};

/* 12. Let AI build it */

/**
 * Under the two-line title's story band. The app outline in the middle; the
 * program staff at its right, who describe what they need first: a line from
 * them to the app, and the twelve modules' places in it, dashed, as they
 * describe them. Then the agent at its left fills each place with a tile, and
 * last the staff's mark, on the app itself, approves the finished tool.
 */
const APP = box(640, CONTENT_TOP.two + 16, 640, 360);
const BAR = 40;
/** The app's twelve modules: large tiles, four by three, centred in the app under its bar. */
const GRID = { x: 720, y: APP.y + 72, dx: 140, dy: 92, cols: 4, rows: 3 };
/** The agent outside the app's left edge, close to the outline it builds and well apart from the chatbot picture set back at the left. */
const AGENT = { x: APP.x - 80, y: APP.y + 180 };
const UNDER = APP.y + APP.h + 20;
const HALF = TILE.large.side / 2;
/** The app with its chat bubble, kept small and set back at the left once the agent takes over, with its words under it: the picture this one is set against. Faded only so far that its outline still reads. */
const BEFORE_SCALE = 0.4;
const BEFORE = box(96, APP.y + 100, APP.w * BEFORE_SCALE, APP.h * BEFORE_SCALE);
const BEFORE_FADED = 0.6;
/** The prohibition sign drawn over the app and its bubble before the picture steps aside: a ring on the app's centre, clear of its outline, and the slash across it from top left to bottom right, drawn after the ring. */
const NOPE_R = APP.h / 2 - 16;
const NOPE = { cx: APP.x + APP.w / 2, cy: APP.y + APP.h / 2 };
const SLASH = NOPE_R * Math.SQRT1_2;
const STAFF = box(1424, APP.y + 104, PERSON.w, PERSON.h);
const STAFF_NAME = box(STAFF.x + STAFF.w / 2 - 120, STAFF.y + STAFF.h + 12, 240, LABEL_LINE);

export const AI_BUILDS = {
  app: { key: "app", at: APP, bar: APP.y + BAR },
  bubble: { key: "bubble", at: box(800, APP.y + 120, 320, 120) },
  noSign: { key: "nope", ...NOPE, r: NOPE_R, slash: { key: "nope.slash", x1: NOPE.cx - SLASH, y1: NOPE.cy - SLASH, x2: NOPE.cx + SLASH, y2: NOPE.cy + SLASH } },
  inside: { key: "inside", text: shown("ai-builds", "play")[0], at: box(APP.x, UNDER, 640, LINE) },
  /**
   * The small copy, moved and scaled about its top left (`at`'s); where it
   * starts, exactly over the app, bubble and sign it stands in for, so it
   * carries them to the left; and where the words under the app go to sit
   * under it: how far they travel.
   */
  before: {
    key: "before",
    at: BEFORE,
    scale: BEFORE_SCALE,
    faded: BEFORE_FADED,
    start: { x: APP.x - BEFORE.x, y: APP.y - BEFORE.y, scale: 1 / BEFORE_SCALE },
    words: { x: BEFORE.x - APP.x, y: BEFORE.y + BEFORE.h + 12 - UNDER },
  },
  builds: { key: "builds", text: shown("ai-builds", "play")[1], at: box(APP.x, UNDER, 640, LINE) },
  agent: { key: "builder", at: AGENT },
  /** Under the agent what it is. */
  agentName: { key: "builder.name", text: label("ai-builds", "AI agent"), at: box(AGENT.x - 80, AGENT.y + AGENT_R + 12, 160, LABEL_LINE) },
  /** Each tile's place in the app, the dashed outline the staff's description leaves there, and how far the tile starts from it: on the agent. */
  tiles: Array.from({ length: GRID.cols * GRID.rows }, (_, i) => {
    const at = { x: GRID.x + (i % GRID.cols) * GRID.dx, y: GRID.y + Math.floor(i / GRID.cols) * GRID.dy };
    return { key: `tile.${i}`, at, place: { key: `tile.${i}.place`, at: tileBox(at, "large") }, from: { x: AGENT.x - HALF - at.x, y: AGENT.y - HALF - at.y } };
  }),
  person: { key: "builds.person", at: STAFF },
  personName: { key: "builds.person.name", text: label("ai-builds", "Program staff"), at: STAFF_NAME },
  /** What the staff describe, carried to the app. */
  describes: { key: "builds.describes", from: box(STAFF.x - 16, STAFF.y, 16, STAFF.h), to: box(APP.x, STAFF.y, APP.w, STAFF.h) },
  /** The staff's mark on the finished tool: inside the app, in its lower right corner clear of the last column of tiles. */
  mark: { key: "builds.mark", at: { x: APP.x + APP.w - 40, y: APP.y + APP.h - 44 } },
};

/* 13. You own it */

const CLEAR = 16;
const RING: Box = box(APP.x - CLEAR, APP.y - CLEAR, APP.w + 2 * CLEAR, APP.h + 2 * CLEAR);
const HISTORY = { x0: 96, x1: 1824, y: RING.y + RING.h + 36 };

export const YOURS = {
  ring: { key: "yours.ring", at: RING },
  /** Beside the ring's top right corner: over the ring is the story band's. */
  label: { key: "yours", text: shown("yours", "play")[0], at: box(RING.x + RING.w + 24, RING.y, 400, LINE) },
  history: { key: "history", ...HISTORY },
  /** Under the line, at its start: what the marks on it are. */
  historyName: { key: "history.name", text: label("yours", "Every change and every approval on record"), at: box(HISTORY.x0, HISTORY.y + 24, 640, LABEL_LINE) },
  /** The approvals already on record, and the one this change adds; where along the line each falls. */
  marks: [400, 680, 960, 1240, 1520].map((x, i) => ({ key: `history.${i}`, at: { x, y: HISTORY.y }, along: (x - HISTORY.x0) / (HISTORY.x1 - HISTORY.x0) })),
};
