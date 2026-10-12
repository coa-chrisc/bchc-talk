/**
 * The catalog world's last five slides, one click a slide (slides 10 to
 * 13, with 11a): the process that built the catalog, the long road to a
 * bought tool, the tools gap, AI that builds the tool, and owning what you
 * build. Each click plays its
 * slide's whole chain (docs/bchc-flow-revision.md, section 3): the first
 * beat changes the title and clears what the last slide does not carry, its
 * story lines among them; slide 13 carries the app and its tiles from slide
 * 12. A beat's own times are seconds from the beat's start; `chain()`
 * places the beats.
 */
import type { Move } from "@/components/deck/engine";
import { EASE, behind, draw, fill, hide, mark, rise, show, to, wipe } from "@/components/deck/kit";
import { picture, story } from "../steps";
import { DAYS } from "./layout";
import { AI_BUILDS, PROOF, TOO_LONG, TOOLS_GAP, YOURS } from "./layout-why";
import { storyKeysOf } from "./layout-story";
import { clear, leave, play } from "./moves";

const READ = 1.6;
const keys = (list: readonly { key: string }[]) => list.map((entry) => entry.key);
const daysParts = [
  ...DAYS.sessions.flatMap((s) => [s.key, s.label.key]),
  ...DAYS.feedback.flatMap((f) => [f.key, f.from.key, f.arrow.key]),
  DAYS.live.key,
  DAYS.coalition.rule.key,
  DAYS.coalition.name.key,
  ...DAYS.coalition.people.map((person) => person.key),
];

/** Piece `i` of the wireframe is built: its agent's ring fills as the piece takes the process's colour, and a person's mark lands on it once it is built. */
const pieceBuilt = (i: number) => [
  fill(PROOF.agents[i].key, { duration: 0.8, at: 0 }),
  draw(PROOF.pieces[i].key, { duration: 0.8, at: 0.1 }),
  mark(PROOF.pieces[i].mark.key, { duration: 0.5, at: 1.0 }),
];

const proof = picture("proof", {
  play: play([
    // The sessions go; a bare wireframe of the catalog's front page draws on the right.
    { moves: [leave("three-days", "proof", daysParts), draw(PROOF.wire.key, { duration: 1.0, at: 0.3 })] },
    { with: true, hold: 0.9, moves: [story("proof", 0)] },
    // On the left, the people and the agents, each three named over them.
    {
      with: true,
      hold: 0.8,
      moves: [
        draw(keys(PROOF.people), { duration: 0.6, stagger: 0.09, at: 0 }),
        rise(PROOF.names[0].key, { at: 0.3 }),
        draw(keys(PROOF.agents), { duration: 0.6, stagger: 0.09, at: 0.4 }),
        rise(PROOF.names[1].key, { at: 0.7 }),
      ],
    },
    // Piece by piece, the header, then the search box and filters, then the cards: an agent builds it, and a person approves it.
    { hold: 0.1, moves: pieceBuilt(0) },
    { hold: 0.1, moves: pieceBuilt(1) },
    { hold: 0.1, moves: pieceBuilt(2) },
    // The real catalog settles into the wireframe; the marks on its pieces fade as it comes in, and the people keep one mark beside them.
    {
      hold: 0.2,
      moves: [
        to(PROOF.still.key, { autoAlpha: 1, scale: 1 }, { autoAlpha: 0, scale: 1.04 }, { duration: 0.9, ease: EASE.soft, at: 0 }),
        hide(PROOF.pieces.map((piece) => piece.mark.key), { duration: 0.4, stagger: 0, at: 0.3 }),
        mark(PROOF.mark.key, { duration: 0.6, at: 0.5 }),
      ],
    },
    // Under the people and agents, apart from the page, what they are.
    { with: true, hold: 0.3, moves: [draw(PROOF.rule.key, { duration: 0.6, at: 0 }), rise(keys(PROOF.labels), { stagger: 0.3, at: 0.3 })] },
    { with: true, hold: 0.6, moves: [story("proof", 1)] },
  ]),
});

const proofParts = [PROOF.wire.key, ...keys(PROOF.pieces), ...PROOF.pieces.map((piece) => piece.mark.key), PROOF.mark.key, PROOF.still.key, ...keys(PROOF.people), ...keys(PROOF.agents), ...keys(PROOF.names), PROOF.rule.key, ...keys(PROOF.labels)];

const PER_QUOTE = TOO_LONG.rowsPerQuote;
/**
 * The months fly by faster as the slide goes on: each page turns quicker
 * than the one before (Jan to Oct), and the gaps between turns shrink, from
 * 0.6 s between Jan and Feb to 0.2 s between Sep and Oct. Jan to Apr turn
 * while the card waits (`WAIT_TURNS`, seconds into the calendar's beat), May
 * to Jul with the first three quotes (`QUOTES_AT`), Aug with the change
 * request's quote, and Sep and Oct after it (`LAST_TURNS`).
 */
const TURN = [0.45, 0.4, 0.35, 0.3, 0.28, 0.26, 0.24, 0.22, 0.2, 0.18];
const WAIT_TURNS = [0.9, 1.5, 2.0, 2.4];
const QUOTES_AT = [0, 0.38, 0.7];
const LAST_TURNS = [1.15, 1.35];
/** A calendar page turns up over the binding, and its strip lands on the pile of turned pages. */
const pageTurns = (i: number, at: number): Move[] => [
  ...to(TOO_LONG.pages[i].key, { "--t": 1 }, { "--t": 0 }, { duration: TURN[i], ease: EASE.draw, at }),
  ...show(TOO_LONG.pages[i].strip.key, { duration: 0.15, at: at + 0.8 * TURN[i] }),
];
/** Quote `i` arrives from the right, and the dollar signs grow by its rows, from the foot up, as another page turns (May for the first). */
const quoteArrives = (i: number, at: number): Move[] => [
  ...to(TOO_LONG.quotes[i].key, { autoAlpha: 1, x: 0 }, { autoAlpha: 0, x: 80 }, { duration: 0.5, ease: EASE.out, at }),
  ...rise(keys(TOO_LONG.dollars.slice(i * PER_QUOTE, (i + 1) * PER_QUOTE)), { duration: 0.4, stagger: 0.15, at: at + 0.3 }),
  ...pageTurns(WAIT_TURNS.length + i, at + 0.3),
];
const { stamp } = TOO_LONG;

const tooLong = picture("too-long", {
  play: play([
    // The request card, with its words.
    { moves: [leave("proof", "too-long", proofParts), draw(TOO_LONG.request.key, { duration: 0.7, at: 0.3 }), rise(TOO_LONG.request.words.key, { at: 0.7 })] },
    { with: true, hold: 0.5, moves: [story("too-long", 0)] },
    // The wall calendar beside it, its pages named for their months, turning Jan to Apr, each faster, while the card waits.
    {
      with: true,
      hold: 1.0,
      moves: [
        draw(TOO_LONG.calendar.key, { duration: 0.7, at: 0 }),
        show([...keys(TOO_LONG.pages), TOO_LONG.calendar.month.key], { duration: 0.2, stagger: 0, at: 0.6 }),
        WAIT_TURNS.flatMap((at, i) => pageTurns(i, at)),
        rise(TOO_LONG.months.key, { at: 2.8 }),
      ],
    },
    // A new quote, a new stack of dollar signs and another month gone: three quotes, May to Jul.
    { hold: 0.1, moves: QUOTES_AT.flatMap((at, i) => quoteArrives(i, at)) },
    { with: true, hold: 0.4, moves: [story("too-long", 1)] },
    // The stamp swings down onto the card and lifts away: "No".
    {
      hold: 0.2,
      moves: [
        to(stamp.key, { autoAlpha: 1, y: 0, "--s": 0 }, { autoAlpha: 0, y: -stamp.lift, "--s": 1 }, { duration: 0.45, ease: EASE.draw, at: 0 }),
        show(TOO_LONG.no.key, { duration: 0.15, at: 0.45 }),
        to(stamp.key, { autoAlpha: 0, y: -stamp.lift }, undefined, { duration: 0.45, ease: EASE.soft, at: 0.75 }),
      ],
    },
    // A change request arrives, and it starts again: another quote and more dollar signs as Aug turns, then Sep and Oct, fastest of all.
    { hold: 0.2, moves: [to(TOO_LONG.change.key, { autoAlpha: 1, x: 0 }, { autoAlpha: 0, x: TOO_LONG.change.from }, { duration: 0.6, ease: EASE.out, at: 0 }), quoteArrives(3, 0.6), LAST_TURNS.flatMap((at, i) => pageTurns(TOO_LONG.pages.length - LAST_TURNS.length + i, at))] },
  ]),
});

const tooLongParts = [
  TOO_LONG.request.key,
  TOO_LONG.request.words.key,
  TOO_LONG.no.key,
  TOO_LONG.calendar.key,
  TOO_LONG.calendar.month.key,
  ...keys(TOO_LONG.pages),
  ...TOO_LONG.pages.map((page) => page.strip.key),
  TOO_LONG.months.key,
  ...keys(TOO_LONG.quotes),
  ...keys(TOO_LONG.dollars),
  TOO_LONG.change.key,
];

const { badge, wanted } = TOOLS_GAP;

const toolsGap = picture("tools-gap", {
  play: play([
    // The product card, its words, and its price under it.
    {
      moves: [
        leave("too-long", "tools-gap", tooLongParts),
        draw(TOOLS_GAP.card.key, { duration: 0.7, at: 0.3 }),
        rise(TOOLS_GAP.words.key, { at: 0.7 }),
        rise(TOOLS_GAP.price[0].key, { duration: 0.5, at: 0.9 }),
      ],
    },
    { with: true, hold: 1.0, moves: [story("tools-gap", 0)] },
    // The AI badge slides across and settles in the card, and the price grows a row as it lands. It is solid before it reaches the card's edge: a short fade, apart from the carry.
    {
      hold: 0.8,
      moves: [
        to(badge.key, { autoAlpha: 1 }, { autoAlpha: 0 }, { duration: 0.25, ease: EASE.soft, at: 0 }),
        to(badge.key, { x: 0 }, { x: badge.from }, { duration: 1.0, ease: EASE.carry, at: 0 }),
        rise(TOOLS_GAP.price[1].key, { duration: 0.5, at: 1.0 }),
      ],
    },
    // On the right, the tools still waiting: their dashed outlines one after another, each named.
    {
      hold: 0.6,
      moves: [
        wipe(keys(wanted), { from: "left", duration: 0.6, stagger: 0.3, at: 0 }),
        rise(wanted.map((tool) => tool.name.key), { stagger: 0.3, at: 0.3 }),
      ],
    },
    { with: true, hold: 1.4, moves: [story("tools-gap", 1)] },
  ]),
});

const toolsGapParts = [TOOLS_GAP.card.key, TOOLS_GAP.words.key, badge.key, ...keys(TOOLS_GAP.price), ...keys(wanted), ...wanted.map((tool) => tool.name.key)];

const { before, noSign } = AI_BUILDS;
/** The chatbot picture steps aside: the small copy takes over from the full-size bubble and sign in `TAKE_OVER`, then carries the picture to the left for the rest of `STEP_ASIDE`. */
const TAKE_OVER = 0.05;
const STEP_ASIDE = 0.8;

/** The twelve tiles leave the agent one after another and grow as they travel to their places in the app. */
const TILE_TRAVEL = 0.9;
const tilesTravel = (at: number): Move[] =>
  AI_BUILDS.tiles.flatMap((tile, i) => to(tile.key, { x: 0, y: 0, autoAlpha: 1, "--k": 1 }, { x: tile.from.x, y: tile.from.y, autoAlpha: 0, "--k": 0 }, { duration: TILE_TRAVEL, ease: EASE.page, at: at + i * 0.05 }));

const aiBuilds = picture("ai-builds", {
  play: play([
    { moves: [leave("tools-gap", "ai-builds", toolsGapParts), draw(AI_BUILDS.app.key, { at: 0.3 })] },
    { hold: 0, moves: [draw(AI_BUILDS.bubble.key, { duration: 0.8, at: 0 }), rise(AI_BUILDS.inside.key, { at: 0.6 })] },
    { with: true, hold: 0.4, moves: [story("ai-builds", 0)] },
    // Line A has READ from its landing (the beat before ends 0.2 s after it) before a prohibition sign, which it does not describe, is drawn over the chatbot picture: its ring, then its slash.
    { hold: 1.4, moves: [draw(noSign.key, { duration: 0.5, at: 0 }), draw(noSign.slash.key, { duration: 0.3, at: 0.35 })] },
    // The picture steps aside carrying the sign: the small copy comes on exactly over the bubble and the sign as they go, so it takes over unseen, and travels to its place at the left, shrinking and fading back, its words under it; line A goes.
    {
      hold: 0.8,
      moves: [
        hide([AI_BUILDS.bubble.key, noSign.key, noSign.slash.key], { duration: TAKE_OVER, stagger: 0, at: 0 }),
        clear([storyKeysOf("ai-builds")[0]]),
        show(before.key, { duration: TAKE_OVER, at: 0 }),
        to(before.key, { "--x": 0, "--y": 0, "--s": 1 }, { "--x": before.start.x, "--y": before.start.y, "--s": before.start.scale }, { duration: STEP_ASIDE, ease: EASE.page, at: 0 }),
        to(before.key, { autoAlpha: before.faded }, undefined, { duration: STEP_ASIDE - TAKE_OVER, ease: EASE.page, at: TAKE_OVER }),
        to(AI_BUILDS.inside.key, { x: before.words.x, y: before.words.y, autoAlpha: before.faded }, { x: 0, y: 0, autoAlpha: 1 }, { duration: STEP_ASIDE, ease: EASE.page, at: 0 }),
      ],
    },
    // Line B, the new way, comes up as the picture settles at the left, in the row line A has left.
    { with: true, hold: 0.6, moves: [story("ai-builds", 1)] },
    // The program staff, at the right, describe what they need: a line to the app, and the places of its modules, dashed. Line B describes them, so they start with it.
    {
      with: true,
      hold: 0.5,
      moves: [
        draw(AI_BUILDS.person.key, { duration: 0.6, at: 0 }),
        rise(AI_BUILDS.personName.key, { at: 0.3 }),
        draw(AI_BUILDS.describes.key, { duration: 0.6, at: 0.5 }),
        wipe(AI_BUILDS.tiles.map((tile) => tile.place.key), { from: "left", duration: 0.4, stagger: 0.05, at: 0.9 }),
      ],
    },
    // An agent outside the app, its ring filling as it works, fills each place with a tile.
    {
      hold: 0.3,
      moves: [
        draw(AI_BUILDS.agent.key, { duration: 0.5, at: 0 }),
        rise(AI_BUILDS.agentName.key, { at: 0.2 }),
        fill(AI_BUILDS.agent.key, { duration: 1.2, at: 0.3 }),
        tilesTravel(0.3),
        AI_BUILDS.tiles.flatMap((tile, i) => hide(tile.place.key, { duration: 0.2, at: 0.3 + i * 0.05 + TILE_TRAVEL })),
        rise(AI_BUILDS.builds.key, { at: 1.3 }),
      ],
    },
    // The staff approve the finished tool.
    { hold: 0.3, moves: [mark(AI_BUILDS.mark.key, { duration: 0.6, at: 0 })] },
  ]),
});

/** The history line draws, the approvals on record show as its front passes them, and this change's approval lands. */
const HISTORY = { at: 0, duration: 1.2 };
const ON_RECORD = YOURS.marks.slice(0, -1);
const LANDS = YOURS.marks[YOURS.marks.length - 1];
const passed = behind(HISTORY, ON_RECORD.map((entry) => entry.along));

const yours = picture("yours", {
  play: play([
    { moves: [leave("ai-builds", "yours", [before.key, AI_BUILDS.inside.key, AI_BUILDS.agent.key, AI_BUILDS.agentName.key, AI_BUILDS.person.key, AI_BUILDS.describes.key, AI_BUILDS.mark.key, AI_BUILDS.personName.key, AI_BUILDS.builds.key]), draw(YOURS.ring.key, { at: 0.3 }), rise(YOURS.label.key, { at: 0.8 })] },
    { with: true, hold: 1.0, moves: [story("yours", 0)] },
    // The history line draws and is named; the approvals on record show as its front passes them, and this change's approval lands.
    {
      with: true,
      hold: READ,
      moves: [draw(YOURS.history.key, HISTORY), rise(YOURS.historyName.key, { at: 0.4 }), ON_RECORD.flatMap((entry, i) => mark(entry.key, { duration: 0.3, at: passed[i] })), mark(LANDS.key, { duration: 0.6, at: 1.3 })],
    },
    { with: true, hold: 1.4, moves: [story("yours", 1)] },
  ]),
});

export const PART_TWO = [...proof, ...tooLong, ...toolsGap, ...aiBuilds, ...yours];
