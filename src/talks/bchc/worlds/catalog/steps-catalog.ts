/**
 * Part 1, one click a slide (slides 1 to 9): the catalog, how it is found
 * and read, the six steps from form to live page and the status page that
 * follows them, the reviewer at their desk, what stands behind the site,
 * and the three working sessions, ending on the catalog going live. Each
 * click plays its slide's whole chain (docs/bchc-flow-revision.md, section
 * 3): the first beat changes the title and clears what the last slide does
 * not carry, its story lines among them; the story lines land with the
 * beats they explain. A beat's own times are seconds from the beat's start;
 * `chain()` places the beats.
 */
import { EASE, dim, draw, fill, lines, mark, pass, rise, show, to, unwipe, wipe } from "@/components/deck/kit";
import { picture, story } from "../steps";
import { CATALOG, DAYS, ENTRY, HOST, OPENING, REVIEW, ROW, SIX, STATUS } from "./layout";
import { HOP, cardArrives, cardHops, checksPass, leave, liveLights, personDecides, play, rowDraws, statusDraws } from "./moves";

/** The first slide's chain waits for the world's arrival fade. */
const ARRIVE = 0.35;
const READ = 1.6;
const keys = (list: readonly { key: string }[]) => list.map((entry) => entry.key);

const { find } = CATALOG;

const title = picture("title", {
  play: play(
    [
      { moves: [lines(OPENING.key, { stagger: 0.16, at: 0 })] },
      { with: true, hold: 1.2, moves: [story("title", 0)] },
      { with: true, hold: 0.8, moves: [story("title", 1)] },
    ],
    ARRIVE,
  ),
}, { ground: "navy" });

const theCatalog = picture("the-catalog", {
  play: play([
    // The page comes down into its place.
    { moves: [leave("title", "the-catalog", []), wipe(CATALOG.frame.key, { from: "top", duration: 0.9, at: 0.3 })] },
    // Who built it: a tag on the page, then where to find it.
    { with: true, hold: 1.3, moves: [show(CATALOG.tag.key, { at: 0 }), rise(CATALOG.address.key, { at: 0.5 })] },
    { with: true, hold: 0.3, moves: [story("the-catalog", 0)] },
    { with: true, hold: READ, moves: [story("the-catalog", 1)] },
  ]),
});

/** A ring on the still, and its tab on the ring. */
const found = (i: number) => [draw(find[i].ring, { duration: 0.6, at: 0 }), show(find[i].key, { at: 0.45 })];

/** Search, Filter, Compare, 1.4 s apart, in the order spoken. */
const finding = picture("find", {
  play: play([
    { moves: leave("the-catalog", "find", [CATALOG.tag.key, CATALOG.address.key]) },
    { with: true, hold: 0.3, moves: [story("find", 0)] },
    { with: true, hold: 0.7, moves: found(0) },
    { with: true, hold: 1.4, moves: found(1) },
    { with: true, hold: 1.4, moves: found(2) },
    { with: true, hold: 0.8, moves: [story("find", 1)] },
  ]),
});

/** A field lands on its place on the opened page: its ring draws, and its tab shows on the ring. */
const landed = (field: (typeof ENTRY.fields)[number], at = 0) => [draw(field.ring.key, { duration: 0.5, at }), show(field.tab.key, { at: at + 0.35 })];
const [built, runs, ...rest] = ENTRY.fields;
const entryParts = [ENTRY.opened.key, ENTRY.runs.key, ...ENTRY.fields.flatMap((field) => [field.ring.key, field.tab.key])];

const entryTells = picture("entry", {
  play: play([
    {
      moves: [
        leave("find", "entry", find.flatMap((callout) => [callout.ring, callout.key])),
        // The list goes up, and the project opens: its page comes down in its place, and the project is circled.
        unwipe(CATALOG.frame.key, { toward: "top", duration: 0.5, at: 0 }),
        wipe(ENTRY.opened.key, { from: "top", duration: 0.8, at: 0.4 }),
        draw(built.ring.key, { duration: 0.7, at: 1.3 }),
      ],
    },
    { with: true, hold: 1.2, moves: [story("entry", 0)] },
    // The six fields, one at a time, each on its place: what was built, on the ring round the project, then, further down the page, where it runs.
    { hold: 0.2, moves: [show(built.tab.key, { at: 0 })] },
    { hold: 0.2, moves: [wipe(ENTRY.runs.key, { from: "top", duration: 0.6, at: 0 }), ...landed(runs, 0.5)] },
    ...rest.slice(0, -1).map((field) => ({ hold: 0.2, moves: landed(field) })),
    // The last, the contact, then line B as soon as it has landed, so the click does not seem to have ended.
    { hold: 0.2, moves: landed(rest[rest.length - 1]) },
    { hold: 0.3, moves: [story("entry", 1)] },
  ]),
});

const sixSteps = picture("six-steps", {
  play: play([
    {
      moves: [
        leave("entry", "six-steps", entryParts.filter((key) => key !== ENTRY.opened.key && key !== ENTRY.runs.key)),
        unwipe([ENTRY.opened.key, ENTRY.runs.key], { toward: "top", duration: 0.6, stagger: 0, at: 0 }),
        rowDraws(0.3),
        statusDraws(0.3),
      ],
    },
    // The card comes into Form and goes on to Request, as line A says.
    { with: true, hold: 1.2, moves: [cardArrives(0), cardHops(1, 0.65), story("six-steps", 0, { at: 0.65 })] },
    // Into Draft: the scripts' wells are marked "Automatic", and line B says what they do.
    { hold: 0.15, moves: [cardHops(2, 0), draw(SIX.bracket.key, { duration: 0.6, at: HOP }), rise(SIX.automatic.key, { at: HOP + 0.3 }), story("six-steps", 1, { at: HOP + 0.3 })] },
    // Into Checks: the checks pass.
    { hold: 0.2, moves: [cardHops(3, 0), checksPass(HOP)] },
    // Into Approval, where the card waits: a person approves it.
    { hold: 0.2, moves: [cardHops(4, 0), personDecides({ at: HOP }), draw(SIX.person.key, { at: HOP + 0.3 }), mark(SIX.mark.key, { at: HOP + 1.0 })] },
    // Only then on to Live, which takes its fill and lights as the card lands.
    { hold: 0.3, moves: [cardHops(5, 0), liveLights(HOP)] },
  ]),
});

/** Everything slide 5 leaves: the row with its card and ticks, its marks, and the status page. */
const sixParts = [
  ROW.key,
  SIX.bracket.key,
  SIX.automatic.key,
  SIX.person.key,
  SIX.mark.key,
  STATUS.page.key,
  STATUS.name.key,
  ...keys(STATUS.steps),
  ...keys(STATUS.links),
  STATUS.published.key,
];

const review = picture("review", {
  play: play([
    // The row of boxes goes. A reviewer at a desk, named over their head.
    {
      moves: [
        leave("six-steps", "review", sixParts),
        draw(REVIEW.desk.key, { duration: 0.7, at: 0.3 }),
        draw(REVIEW.person.key, { duration: 0.7, at: 0.5 }),
        rise(REVIEW.name.key, { at: 0.9 }),
      ],
    },
    { with: true, hold: 0.6, moves: [story("review", 0)] },
    // On the desk, the submission open as one card: the draft page with its privacy box ticked, and the checklist.
    { with: true, hold: 0.8, moves: [draw(REVIEW.card.key, { duration: 1.1, at: 0 })] },
    // The data governance flag lands on the checklist.
    { hold: 0.2, moves: [draw(REVIEW.flag.key, { duration: 0.5, at: 0 }), rise(REVIEW.flagged.key, { at: 0.3 })] },
    // The reviewer works down the checklist: each item passes.
    { hold: 0.4, moves: [pass(keys(REVIEW.ticks), { duration: 0.3, stagger: 0.35, at: 0 })] },
    // At the card's foot, the reviewer's mark, "Approved", and who approved it and when.
    { hold: 0.3, moves: [mark(REVIEW.mark.key, { duration: 0.6, at: 0 }), rise(REVIEW.approved.key, { at: 0.4 }), rise(REVIEW.signed.key, { at: 0.6 })] },
    { with: true, hold: 0.4, moves: [story("review", 1)] },
  ]),
});

const reviewParts = [REVIEW.desk.key, REVIEW.person.key, REVIEW.name.key, REVIEW.card.key, REVIEW.flag.key, REVIEW.flagged.key, ...keys(REVIEW.ticks), REVIEW.mark.key, REVIEW.approved.key, REVIEW.signed.key];

const nothingToRun = picture("nothing-to-run", {
  play: play([
    {
      moves: leave("review", "nothing-to-run", reviewParts),
    },
    { with: true, hold: 0.3, moves: [story("nothing-to-run", 0)] },
    // Each box wipes on; its name shows as the box completes.
    {
      with: true,
      hold: 0.5,
      moves: [wipe(keys(HOST.usual), { from: "left", duration: 0.5, ease: EASE.draw, stagger: 0.2, at: 0 }), show(HOST.usual.map((thing) => thing.label), { stagger: 0.2, at: 0.35 })],
    },
    // Each is crossed out, through its name, and its box steps back: still there, so the files are seen beside what they replace. The names keep the secondary grey under their navy strike, so they read from the back of the room.
    {
      hold: READ,
      moves: [draw(HOST.usual.map((thing) => thing.strike.key), { duration: 0.4, stagger: 0.2, at: 0 }), dim(keys(HOST.usual), { stagger: 0, at: 0.8 })],
    },
    { hold: 0, moves: [story("nothing-to-run", 1)] },
    {
      with: true,
      hold: 0.2,
      moves: [
        draw(HOST.panel.key, { duration: 0.6, at: 0 }),
        rise([HOST.folder.key, ...keys(HOST.files)], { duration: 0.6, stagger: 0.09, at: 0.2 }),
        draw(HOST.rule.key, { duration: 0.5, at: 0.5 }),
        rise(HOST.hosting.key, { at: 1.1 }),
      ],
    },
  ]),
});

/** A working session: its outline and the page it left draw, its name comes up under it, and it fills as the work is done. */
const session = (i: number) => [draw(DAYS.sessions[i].key, { duration: 0.6, at: 0 }), rise(DAYS.sessions[i].label.key, { at: 0.2 }), fill(DAYS.sessions[i].key, { duration: 0.8, at: 0.5 })];

/** The coalition's feedback after a session comes up from its line into its place, and its arrow draws into the next card, or after the last session into "Live". */
const feedback = (i: number) => {
  const { key, from, arrow } = DAYS.feedback[i];
  return [
    ...draw(from.key, { duration: 0.4, at: 0 }),
    ...to(key, { autoAlpha: 1, y: 0 }, { autoAlpha: 0, y: DAYS.drop }, { duration: 0.6, ease: EASE.out, at: 0.2 }),
    ...draw(arrow.key, { duration: 0.6, at: 0.6 }),
  ];
};

const { coalition } = DAYS;

const threeDays = picture("three-days", {
  play: play([
    { moves: [leave("nothing-to-run", "three-days", [...HOST.usual.flatMap((thing) => [thing.key, thing.label, thing.strike.key]), HOST.panel.key, HOST.folder.key, ...keys(HOST.files), HOST.rule.key, HOST.hosting.key])] },
    // The coalition, as line A says it asked for help: its people, its line under where the row will be, and its name.
    {
      with: true,
      hold: 0.3,
      moves: [
        story("three-days", 0),
        draw(keys(coalition.people), { duration: 0.6, stagger: 0.09, at: 0.2 }),
        draw(coalition.rule.key, { duration: 0.8, at: 0.4 }),
        rise(coalition.name.key, { at: 0.6 }),
      ],
    },
    // Session, feedback, session: each starts from the feedback before it.
    { hold: 0.2, moves: session(0) },
    { hold: 0.1, moves: [...feedback(0), story("three-days", 1, { at: 0.2 })] },
    { hold: 0, moves: session(1) },
    { hold: 0.1, moves: feedback(1) },
    { hold: 0, moves: session(2) },
    // The coalition's feedback on the last session leads into "Live": the catalog goes on the site.
    { hold: 0.1, moves: feedback(2) },
    { hold: 0, moves: [show(DAYS.live.key, { duration: 0.4, at: 0 })] },
  ]),
});

export const PART_ONE = [...title, ...theCatalog, ...finding, ...entryTells, ...sixSteps, ...review, ...nothingToRun, ...threeDays];
