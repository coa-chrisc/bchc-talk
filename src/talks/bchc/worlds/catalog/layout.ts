/**
 * The catalog world, Part 1 (slides 1 to 9; slide 10 is in layout-why.ts):
 * where every part goes, the id each takes, and the words it holds. Every
 * word is read from the script; a line break is given by the word it falls
 * after. A place on a still is given in the still's own pixels, from its
 * frame's top left corner. The stills are captured with every made-up
 * department's name taken off the page (capture/capture-stills.mjs,
 * capture/capture-entry.mjs), so none is legible on the stage.
 */
import { CONTENT_TOP, STORY, box, stations, tabBeside, type Box } from "@/components/deck/kit";
import { withBase } from "@/lib/base-path";
import { APPROVED_AT, ENTRY_FILES, ENTRY_FOLDER } from "../../script/part-1-the-catalog";
import { breakAfter, pictureOf, shown } from "../../script/find";

/* Titles */

export const TITLE = { x: 96, y: 152 };
/** A title's second line, under the first at the headline's 72 px (88 was set for 80, and still clears it). */
const TITLE_LINE = 88;

/**
 * The labels a slide's They see line quotes, in its order: words the script
 * asks the picture to draw that the slide's own show list does not hold.
 */
export const quoted = (pictureId: string) => pictureOf(pictureId).see.flatMap((line) => [...line.matchAll(/"([^"]+)"/g)].map(([, text]) => text));

/** A label a slide's They see line quotes, by its words: a script that no longer quotes it fails loudly. */
export function label(pictureId: string, text: string): string {
  const words = quoted(pictureId).find((entry) => entry === text);
  if (!words) throw new Error(`The script's picture "${pictureId}" quotes no "${text}".`);
  return words;
}

/** Each slide's title: its On screen line, as the plan sets it. */
const sentences = (text: string) => text.split(/(?<=\.)\s+/).map((line) => line.replace(/\.$/, ""));
const [TALK, CREDIT, DEPARTMENT] = sentences(pictureOf("title").show);

/** Slide 1's three lines, one part: they come up in turn and go together. The credit is set at 48 in soft. */
export const OPENING = {
  key: "title.title",
  talk: { x: TITLE.x, y: TITLE.y, lines: [TALK] },
  credit: { x: TITLE.x, y: TITLE.y + TITLE_LINE, lines: [CREDIT] },
  department: { x: TITLE.x, y: 328, lines: [DEPARTMENT] },
};

/** The title of every other slide, broken where it would run past the field. */
const BREAKS: Record<string, string[]> = {
  entry: ["built,"],
  review: ["easy,"],
  proof: ["catalog"],
  "too-long": ["new tool"],
  "tools-gap": ["features,"],
  "ai-builds": ["gap,"],
};

export const titleKey = (pictureId: string) => `title.${pictureId}`;
export const titleOf = (pictureId: string) => ({ key: titleKey(pictureId), x: TITLE.x, y: TITLE.y, lines: breakAfter(pictureOf(pictureId).show, ...(BREAKS[pictureId] ?? [])) });

/* The grid */

/** The catalog's slot, under the story band, and the left column beside it: as tall as the card grid's still (capture/capture-stills.mjs), which needs 520 to show the search field, the first card's Compare control and the pinned Filters bar together. */
export const E = box(576, CONTENT_TOP.one, 928, 520);
const L = { x: 96, w: 444 };
/** A line of 32 px text is this tall, and a 26 px label. */
export const LINE = 44.8;
const LABEL_LINE = 32;
/** A ring round a place on a still: the place, opened out by `pad` so the ink clears what it rings. */
const round = (x: number, y: number, w: number, h: number, pad = 0) => box(x - pad, y - pad, w + 2 * pad, h + 2 * pad);

/** The stills, as saved: a version in the name, because a changed picture under an old name is served from cache. */
export const STILLS = {
  grid: [{ src: withBase("/catalog-grid.v6.webp"), alt: "The catalog's use cases in its card grid: a search field, the first two entries and a Filters button" }],
  opened: [{ src: withBase("/catalog-entry.v4.webp"), alt: "One project's page in the catalog: how far along it is and who runs it, its name and summary, the skills it needs, how ready it is, what it cost to stand up, and who to contact" }],
  runs: [{ src: withBase("/catalog-entry-runs.v4.webp"), alt: "Further down the same project's page: how it's built, ending with where it runs" }],
};

/* 2 to 4. The catalog, and what an entry tells you */

/** On the card grid's still: the search field, the pinned Filters button and the first card's Compare control, whose tab sits in the card's empty foot. */
const SEARCH = round(135, 12, 384, 44, 6);
const FILTERS = round(406, 464, 116, 44, 6);
const COMPARE = round(331, 397, 97, 44, 6);
/** Slide 2's tag, in the left column beside the catalog, level with its middle, so it covers nothing on the page and the column is not left empty under it: who built the catalog, on two lines. */
const TAG_H = 75;
const TAG = box(L.x, E.y + (E.h - TAG_H) / 2, 456, TAG_H);
const [BUILT_BY] = quoted("the-catalog");
const FIND = [
  { step: "search", target: SEARCH, tab: tabBeside(SEARCH, "right") },
  { step: "filter", target: FILTERS, tab: tabBeside(FILTERS, "right") },
  { step: "compare", target: COMPARE, tab: tabBeside(COMPARE, "left") },
];

export const CATALOG = {
  frame: { key: "catalog", at: E },
  tag: { key: "catalog.tag", lines: breakAfter(BUILT_BY, "Public Health"), at: TAG },
  address: { key: "address", text: shown("the-catalog", "play")[0], at: box(E.x, E.y + E.h + 8, E.w, LINE) },
  find: FIND.map(({ step, target, tab }, i) => ({ step, key: `find.${i}`, ring: `find.${i}.ring`, text: shown("find", "play")[i], target, tab })),
};

/* 4. What a project tells you */

/**
 * Slide 4 opens one project, under the two-line title's story band: the top
 * of its page on the right, and, on the left, further down the same page,
 * the part that says where it runs. Each of the six fields lands on its
 * place on those stills as a ring with its tab, in the order the script
 * lists them. The first ring, round the project's name and summary, is the
 * project circled.
 */
const OPENED_TOP = CONTENT_TOP.two + 12;
const OPENED = box(576, OPENED_TOP, 1232, 468);
const RUNS = box(L.x, OPENED_TOP, L.w, 302);
/** A cell of the page's grid of facts, ringed a little inside its edges, since the cells touch. */
const cell = (x: number, y: number, w: number, h: number) => box(x + 4, y + 4, w - 8, h - 8);
/** `x`: where the tab starts instead, when its side's own place would lie across one of the page's edges. */
type Field = { step: string; frame: "opened" | "runs"; ring: Box; side: Parameters<typeof tabBeside>[1]; x?: number };
/** Where the page's grid of facts ends at the right, in the still: cost's tab starts clear of it. */
const FACTS_END = 872;
/**
 * Places on the stills (capture/capture-entry.mjs prints them): the name,
 * outcome and summary; where it runs; the cells for skills, readiness and
 * cost; the contact panel. The still hides what the slide does not point
 * at (the side panel's page list, the dates, the box under the contact), so
 * each tab sits on the plain page: the name's in the open right of it,
 * skills' and readiness's in the line the dates held, cost's past the grid,
 * and the contact's left of its panel.
 */
const FIELDS: Field[] = [
  { step: "built", frame: "opened", ring: round(16, 60, 704, 190, 6), side: "right" },
  { step: "runs", frame: "runs", ring: round(16, 212, 306, 32, 8), side: "below-left" },
  { step: "skills", frame: "opened", ring: cell(15, 321, 291, 69), side: "above-left" },
  { step: "ready", frame: "opened", ring: cell(305, 321, 568, 69), side: "above-left" },
  { step: "cost", frame: "opened", ring: cell(648, 389, 224, 69), side: "right", x: FACTS_END + 8 },
  { step: "contact", frame: "opened", ring: round(920, 212, 280, 176, 6), side: "left" },
];

export const ENTRY = {
  opened: { key: "opened", at: OPENED, stills: STILLS.opened },
  runs: { key: "runs", at: RUNS, stills: STILLS.runs },
  fields: FIELDS.map(({ step, frame, ring, side, x }, i) => {
    const place = tabBeside(ring, side);
    return { step, frame, ring: { key: `${frame}.${step}`, at: ring }, tab: { key: `${frame}.${step}.tab`, at: { ...place, x: x ?? place.x } }, text: shown("entry", "play")[i] };
  }),
};

/* 5. The six steps, from form to live page */

/** The row's wells sit low enough that the person and the mark over Approval clear the story band. */
const ROW_Y = 660;
const SIX_SHOWN = shown("six-steps", "play");
export const ROW = stations({ id: "row", x: 256, y: ROW_Y, headings: SIX_SHOWN.slice(0, 6), human: 4 });
/** Where the card waits, off the stage's left edge, before it arrives in the first well. */
export const CARD_AWAY = -(ROW.card.x + 300);
const [, , DRAFT, CHECKS, APPROVAL] = ROW.stations;
const [AUTOMATIC_WORD, FOLLOW, PUBLISHED] = SIX_SHOWN.slice(6);

export const SIX = {
  /** A bracket under Draft and Checks, its ends turned up toward the wells, and its label under it. */
  bracket: { key: "auto.bracket", x0: DRAFT.x, x1: CHECKS.x + CHECKS.w, y: ROW_Y + 92, drop: -12 },
  automatic: { key: "auto", text: AUTOMATIC_WORD, at: box(DRAFT.x, ROW_Y + 112, 448, LINE) },
  /** A person over the Approval station, with the orange mark between them and the heading. */
  person: { key: "six.person", at: box(APPROVAL.x + 80, ROW_Y - 208, 48, 64) },
  mark: { key: "six.mark", at: { x: APPROVAL.x + 104, y: ROW_Y - 116 } },
  /** Three ticks on the Checks heading's line, after the word. */
  ticks: [0, 1, 2].map((i) => ({ key: `row.tick.${i}`, at: box(CHECKS.headAt.x + 124 + i * 28, CHECKS.headAt.y + 10, 20, 20) })),
};
/** The wells where scripts do the work: their fill is the process's tint (catalog.css), and it comes as the card arrives. */
export const AUTOMATIC = [DRAFT.doneKey, CHECKS.doneKey];

/**
 * Under the row, the sender's status page: a page outline with a step under
 * each well, joined by a line, and its name over its top left corner. Each
 * step lights as the card reaches its well, the line between two steps
 * lighting as the card travels, and the page reads "Published" beside the
 * last step once the card is in Live.
 */
const PAGE_AT = box(232, 872, 1592, 80);
const STEP_Y = PAGE_AT.y + PAGE_AT.h / 2;
const STEP_R = 12;
const STEP_XS = ROW.stations.map((station) => station.x + station.w / 2);

export const STATUS = {
  page: { key: "status", at: PAGE_AT },
  name: { key: "status.name", text: FOLLOW, at: box(PAGE_AT.x, PAGE_AT.y - 52, 640, LINE) },
  /** The quiet line the steps sit on, drawn with the page. */
  track: { x0: STEP_XS[0], x1: STEP_XS[STEP_XS.length - 1], y: STEP_Y },
  steps: STEP_XS.map((x, n) => ({ key: `status.step.${n}`, at: { x, y: STEP_Y }, r: STEP_R })),
  /** The lit stretch between step `n` and the next, lit as the card travels from well `n` to the next. */
  links: STEP_XS.slice(1).map((x, n) => ({ key: `status.link.${n}`, x0: STEP_XS[n] + STEP_R, x1: x - STEP_R, y: STEP_Y })),
  published: { key: "status.published", text: PUBLISHED, at: box(STEP_XS[STEP_XS.length - 1] + 36, STEP_Y - LINE / 2, 220, LINE) },
};

/* 7. Easy to review */

/**
 * A reviewer at a desk, and on the desk the submission open as one card:
 * on its left the draft page (title bars, lines of text, and the privacy
 * box the sender ticked), on its right the checklist, headed by the data
 * governance flag once it lands, and at its foot the sign-off: the orange
 * mark, "Approved", and the reviewer and the time. Story line A is set on
 * two rows under the two-line title, so the picture starts under the third.
 */
const X0 = 230;
const DESK_Y = 950;
const CARD = box(X0 + 340, 596, 1000, DESK_Y - 2 - 596);
const COL = { left: CARD.x + 40, right: CARD.x + 540 };
const CHECK_SIZE = 20;
const CHECK_YS = [708, 752, 796, 840];
const CHECK_LINES = [300, 250, 330, 230];
const TEXT_LINES = [{ y: 732, w: 380 }, { y: 760, w: 340 }, { y: 788, w: 370 }, { y: 816, w: 300 }];
const PRIVACY = box(COL.left, 854, CHECK_SIZE, CHECK_SIZE);
const SIGN_Y = 916;
const REVIEWER_AT = box(X0 + 120, DESK_Y - 128, 96, 128);
const [FLAGGED, APPROVED_WORD] = shown("review", "play");

export const REVIEW = {
  desk: { key: "desk", x0: X0, x1: CARD.x + CARD.w + 100, y: DESK_Y },
  person: { key: "review.person", at: REVIEWER_AT },
  /** Over the reviewer's head, what they are. */
  name: { key: "review.person.name", text: label("review", "Reviewer"), at: box(REVIEWER_AT.x + REVIEWER_AT.w / 2 - 100, REVIEWER_AT.y - 44, 200, LABEL_LINE) },
  card: {
    key: "review.card",
    at: CARD,
    /** The draft page's three title bars: their x0, x1, y and weight. */
    bars: [
      { x0: COL.left, x1: COL.left + 320, y: 640, w: 14 },
      { x0: COL.left, x1: COL.left + 400, y: 668, w: 8 },
      { x0: COL.left, x1: COL.left + 260, y: 688, w: 8 },
    ],
    lines: TEXT_LINES.map(({ y, w }) => ({ x0: COL.left, x1: COL.left + w, y })),
    /** The privacy box, ticked by the sender (a plain tick, not a check that passed), and its line. */
    privacy: { at: PRIVACY, line: { x0: PRIVACY.x + 40, x1: PRIVACY.x + 300, y: PRIVACY.y + CHECK_SIZE / 2 } },
    /** The rule between the page and the checklist, and the one over the sign-off. */
    divider: { x: COL.right - 40, y0: CARD.y + 32, y1: CARD.y + CARD.h - 32 },
    foot: { x0: COL.right, x1: CARD.x + CARD.w - 40, y: SIGN_Y - 36 },
    checks: CHECK_YS.map((y, i) => ({ at: box(COL.right, y, CHECK_SIZE, CHECK_SIZE), line: { x0: COL.right + 40, x1: COL.right + 40 + CHECK_LINES[i], y: y + CHECK_SIZE / 2 } })),
  },
  /** The flag lands at the head of the checklist, its words beside it. */
  flag: { key: "review.flag", at: { x: COL.right + 4, y: 676 }, size: 32 },
  flagged: { key: "review.flagged", text: FLAGGED, at: box(COL.right + 44, 644, 380, LABEL_LINE) },
  /** Each checklist row's tick: the pass tint and a tick, as the reviewer works down the list. */
  ticks: CHECK_YS.map((y, i) => ({ key: `review.tick.${i}`, at: box(COL.right, y, CHECK_SIZE, CHECK_SIZE) })),
  mark: { key: "review.mark", at: { x: COL.right + 24, y: SIGN_Y } },
  approved: { key: "review.approved", text: APPROVED_WORD, at: box(COL.right + 64, SIGN_Y - LINE / 2, 150, LINE) },
  signed: { key: "review.signed", who: label("review", "Reviewer"), when: APPROVED_AT, at: box(COL.right + 224, SIGN_Y - LABEL_LINE / 2, 220, LABEL_LINE) },
};

/* 8. No server, no database */

/**
 * The three things most sites need, down the left, filling the stage to its
 * lower third; on the right, level with them, the folder that took their
 * place: a panel with the folder's name over its files, and under it where
 * it is hosted.
 */
const USUAL = { y: 472, w: 384, h: 120, pitch: 160 };
const PANEL = box(720, 544, 840, 260);
const FILE_X = PANEL.x + 48;
const FILE_YS = [PANEL.y + 108, PANEL.y + 148, PANEL.y + 188];
const FILE_H = 32;
const [SERVER, DATABASE, LOGIN, HOSTING] = shown("nothing-to-run", "play");

export const HOST = {
  /** Each box, its name, and the line that crosses it out through the name. */
  usual: [SERVER, DATABASE, LOGIN].map((text, i) => {
    const at = box(L.x, USUAL.y + i * USUAL.pitch, USUAL.w, USUAL.h);
    return { key: `usual.${i}`, label: `usual.${i}.label`, strike: { key: `usual.${i}.strike`, from: { x: at.x + 32, y: at.y + at.h / 2 }, to: { x: at.x + at.w - 32, y: at.y + at.h / 2 } }, text, at };
  }),
  /** The folder's panel, drawn as its name comes up. */
  panel: { key: "files.panel", at: PANEL },
  folder: { key: "files.folder", text: ENTRY_FOLDER, at: box(FILE_X, PANEL.y + 40, 520, FILE_H) },
  rule: { key: "files.rule", x: FILE_X + 1, y0: FILE_YS[0], y1: FILE_YS[2] + FILE_H },
  files: ENTRY_FILES.map((text, i) => ({ key: `files.${i}`, text, at: box(FILE_X + 20, FILE_YS[i], 600, FILE_H) })),
  hosting: { key: "host", text: HOSTING, at: box(PANEL.x, PANEL.y + PANEL.h + 32, 720, LINE) },
};

/* 9. Three working sessions */

/**
 * Under the title and its story band (line A set on two rows): three
 * session cards in a row, each in the process's colour, filling as its
 * session's work is done, with the catalog's page as that session left it
 * drawn inside: the first a working draft, the second with the changes the
 * agents made in the process's colour, the third with the catalog's own
 * header, its branding. Under the row, the coalition: three people, named,
 * on a line that runs under the whole row. After each session its feedback
 * comes up from the coalition's line into the gap after the card, and the
 * next card starts from it: an arrow from the feedback up into the next
 * card's foot. The last feedback leads up into "Live", at the row's end in
 * the catalog's colour: the catalog on the site.
 */
const SESSION = { y: 512, w: 352, h: 184, gap: 224 };
const SESSION_BOXES = [0, 1, 2].map((i) => box(STORY.x + i * (SESSION.w + SESSION.gap), SESSION.y, SESSION.w, SESSION.h));
const FEEDBACK_BOX = { w: 184, h: 64, y: 768 };
const COALITION_Y = 904;
const COALITION_PERSON = { w: 48, h: 64, pitch: 64 };
const FEEDBACK = label("three-days", "Feedback");
const LIVE = label("three-days", "Live");
/** "Live", level with the cards' middle at the row's end, over the last feedback. */
const LIVE_BOX = { w: 144, h: 64 };
const COALITION = label("three-days", "Big Cities Health Coalition");
const LAST_GAP = SESSION_BOXES[2].x + SESSION_BOXES[2].w + SESSION.gap / 2;
const LIVE_AT = box(LAST_GAP - LIVE_BOX.w / 2, SESSION.y + (SESSION.h - LIVE_BOX.h) / 2, LIVE_BOX.w, LIVE_BOX.h);
const SESSION_NAMES = pictureOf("three-days").see.flatMap((line) => line.match(/Session \d/g) ?? []);

/**
 * The page inside a session card, in the page's own pixels (256 by 100): its
 * outline, the rule under its header and the search bar, then a row of
 * cards per session's work. `tone`: "rule" for what an earlier session made,
 * "process" for the changes this one made, "catalog" for the branding.
 */
const PAGE = { dx: 48, dy: 72, w: 256, h: 100 };
type PagePart = { at: Box; tone: "rule" | "process" | "catalog" };
const pageCards = (y: number, tone: PagePart["tone"]): PagePart[] => [12, 92, 172].map((x) => ({ at: box(x, y, 72, 20), tone }));
const PAGE_PARTS: PagePart[][] = [
  [{ at: box(12, 30, 140, 10), tone: "process" }, ...pageCards(50, "process")],
  [{ at: box(12, 30, 140, 10), tone: "rule" }, ...pageCards(50, "rule"), ...pageCards(74, "process")],
  [{ at: box(0, 0, PAGE.w, 20), tone: "catalog" }, { at: box(12, 30, 140, 10), tone: "rule" }, ...pageCards(50, "rule"), ...pageCards(74, "rule")],
];

export const DAYS = {
  /** Each session's name is set at the top of its card, and its page under it. */
  sessions: SESSION_BOXES.map((at, i) => {
    const page = box(at.x + PAGE.dx, at.y + PAGE.dy, PAGE.w, PAGE.h);
    return {
      key: `session.${i}`,
      at,
      label: { key: `session.${i}.label`, text: SESSION_NAMES[i], at: box(at.x, at.y + 16, at.w, LINE) },
      page: { at: page, header: page.y + 20, parts: PAGE_PARTS[i].map(({ at: part, tone }) => ({ at: box(page.x + part.x, page.y + part.y, part.w, part.h), tone })) },
    };
  }),
  /** The coalition: its line under the row, and at the line's start three people with its name beside them. */
  coalition: {
    rule: { key: "coalition", from: { x: STORY.x, y: COALITION_Y }, to: { x: STORY.x + STORY.w - 20, y: COALITION_Y } },
    people: [0, 1, 2].map((i) => ({ key: `coalition.person.${i}`, at: box(STORY.x + i * COALITION_PERSON.pitch, COALITION_Y + 16, COALITION_PERSON.w, COALITION_PERSON.h) })),
    name: { key: "coalition.name", text: COALITION, at: box(STORY.x + 3 * COALITION_PERSON.pitch + 16, COALITION_Y + 26, 560, LINE) },
  },
  /** How far the feedback travels up to its place. */
  drop: 64,
  live: { key: "live", text: LIVE, at: LIVE_AT },
  feedback: SESSION_BOXES.map((at, i) => {
    const x = at.x + at.w + SESSION.gap / 2;
    const bubble = box(x - FEEDBACK_BOX.w / 2, FEEDBACK_BOX.y, FEEDBACK_BOX.w, FEEDBACK_BOX.h);
    const next = SESSION_BOXES[i + 1] ?? LIVE_AT;
    return {
      key: `feedback.${i}`,
      text: FEEDBACK,
      at: bubble,
      /** Up from the coalition's line into the feedback. */
      from: { key: `feedback.${i}.from`, from: box(x - 1, COALITION_Y, 2, 0), to: bubble },
      arrow: { key: `feedback.${i}.arrow`, from: bubble, to: next },
    };
  }),
};
