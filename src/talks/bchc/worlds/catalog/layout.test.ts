import { describe, expect, it } from "vitest";
import { AGENT_R, STAGE, STORY, TILE, box, storyRows, type Box } from "@/components/deck/kit";
import { CATALOG, DAYS, E, ENTRY, HOST, REVIEW, ROW, SIX, STATUS } from "./layout";
import { AI_BUILDS, PROOF, TOO_LONG, TOOLS_GAP, YOURS } from "./layout-why";
import { bandOf, storyLines } from "./layout-story";

/** Where a slide's story band ends: under its last row. */
const bandFoot = (pictureId: string) => {
  const rows = storyLines(pictureId).flat().length;
  return storyRows(bandOf(pictureId), rows).at(-1)!.y + STORY.pitch;
};
const bottom = (b: Box) => b.y + b.h;
const agentBox = (at: { x: number; y: number }) => box(at.x - AGENT_R, at.y - AGENT_R, 2 * AGENT_R, 2 * AGENT_R);
const MARK_R = 24;
const LINE = 44.8;
const markBox = (at: { x: number; y: number }) => box(at.x - MARK_R, at.y - MARK_R, 2 * MARK_R, 2 * MARK_R);
const bounds = (boxes: Box[]) => {
  const x = Math.min(...boxes.map((b) => b.x));
  const y = Math.min(...boxes.map((b) => b.y));
  return box(x, y, Math.max(...boxes.map((b) => b.x + b.w)) - x, Math.max(...boxes.map(bottom)) - y);
};
const apart = (a: Box, b: Box) => a.x + a.w <= b.x || b.x + b.w <= a.x || bottom(a) <= b.y || bottom(b) <= a.y;

const inside = (a: Box, b: Box) => a.x >= b.x && a.y >= b.y && a.x + a.w <= b.x + b.w && bottom(a) <= bottom(b);
const tileAt = (at: { x: number; y: number }) => box(at.x, at.y, TILE.large.side, TILE.large.side);

/** Clear of the frame's chrome: under the logo, over the footer and the slide number, inside the story band's width (and the stage's right edge). */
const SAFE = { top: 64, bottom: 1016, left: STORY.x - 16, right: STORY.x + STORY.w };

/** What each slide draws under its story band. */
const DRAWN: Record<string, Box[]> = {
  entry: [ENTRY.opened.at, ENTRY.runs.at],
  "six-steps": [SIX.person.at, markBox(SIX.mark.at), ROW.box, SIX.automatic.at, STATUS.page.at, STATUS.name.at, STATUS.published.at],
  review: [REVIEW.name.at, REVIEW.person.at, REVIEW.card.at, REVIEW.flagged.at, markBox(REVIEW.mark.at), REVIEW.approved.at, REVIEW.signed.at],
  "nothing-to-run": [...HOST.usual.map((thing) => thing.at), HOST.panel.at, HOST.hosting.at],
  "three-days": [...DAYS.feedback.map((feedback) => feedback.at), ...DAYS.sessions.map((session) => session.at), DAYS.live.at, ...DAYS.coalition.people.map((person) => person.at), DAYS.coalition.name.at],
  proof: [
    PROOF.wire.at,
    ...PROOF.pieces.map((piece) => markBox(piece.mark.at)),
    ...PROOF.names.map((name) => name.at),
    ...PROOF.people.map((person) => person.at),
    markBox(PROOF.mark.at),
    ...PROOF.agents.map((agent) => agentBox(agent.at)),
    ...PROOF.labels.map((label) => label.at),
  ],
  "too-long": [
    TOO_LONG.request.at,
    TOO_LONG.calendar.at,
    ...TOO_LONG.pages.map((page) => page.strip.at),
    TOO_LONG.months.at,
    ...TOO_LONG.quotes.map((quote) => quote.at),
    ...TOO_LONG.dollars.flatMap((row) => row.glyphs),
    TOO_LONG.stamp.at,
    TOO_LONG.change.at,
  ],
  "tools-gap": [
    TOOLS_GAP.card.at,
    TOOLS_GAP.words.at,
    TOOLS_GAP.badge.at,
    { ...TOOLS_GAP.badge.at, x: TOOLS_GAP.badge.at.x + TOOLS_GAP.badge.from },
    ...TOOLS_GAP.price.flatMap((row) => row.glyphs),
    ...TOOLS_GAP.wanted.map((tool) => tool.at),
  ],
  "ai-builds": [AI_BUILDS.app.at, AI_BUILDS.before.at, AI_BUILDS.person.at, AI_BUILDS.personName.at, markBox(AI_BUILDS.mark.at), agentBox(AI_BUILDS.agent.at), AI_BUILDS.agentName.at, AI_BUILDS.builds.at],
  yours: [YOURS.ring.at, YOURS.label.at, YOURS.historyName.at],
};

describe("the catalog world's layout", () => {
  it("starts every slide's drawing under its story band, however many rows the band takes", () => {
    for (const [pictureId, boxes] of Object.entries(DRAWN)) expect(Math.min(...boxes.map((b) => b.y)), pictureId).toBeGreaterThanOrEqual(bandFoot(pictureId));
  });

  it("keeps every slide's drawing clear of the footer, the slide number and the stage's edges", () => {
    for (const [pictureId, boxes] of Object.entries(DRAWN)) {
      const all = bounds(boxes);
      expect(all.y, pictureId).toBeGreaterThanOrEqual(SAFE.top);
      expect(bottom(all), pictureId).toBeLessThanOrEqual(SAFE.bottom);
      expect(all.x, pictureId).toBeGreaterThanOrEqual(SAFE.left);
      expect(all.x + all.w, pictureId).toBeLessThanOrEqual(SAFE.right);
    }
  });

  it("sets slide 2's tag beside the catalog, covering none of it", () => {
    expect(apart(CATALOG.tag.at, E)).toBe(true);
    expect(CATALOG.tag.at.x).toBeGreaterThanOrEqual(STORY.x);
  });

  it("sets slide 4's two parts of the opened page apart and on the stage, and every ring and tab inside the still it marks", () => {
    const { opened, runs, fields } = ENTRY;
    expect(apart(opened.at, runs.at)).toBe(true);
    for (const frame of [opened.at, runs.at]) {
      expect(frame.x + frame.w).toBeLessThanOrEqual(STORY.x + STORY.w);
      expect(bottom(frame)).toBeLessThanOrEqual(1000);
    }
    const TAB_H = 40;
    for (const field of fields) {
      const frame = field.frame === "opened" ? opened.at : runs.at;
      const { at } = field.ring;
      expect(at.x >= 0 && at.y >= 0 && at.x + at.w <= frame.w && bottom(at) <= frame.h, field.step).toBe(true);
      expect(field.tab.at.y >= 0 && field.tab.at.y + TAB_H <= frame.h, field.step).toBe(true);
    }
  });

  it("sets slide 5's status page under the row and its \"Automatic\", a step under each well, \"Published\" inside the page beside the last step", () => {
    const { page, name, steps, links, published } = STATUS;
    for (const above of [ROW.box, SIX.automatic.at]) {
      expect(apart(above, name.at)).toBe(true);
      expect(bottom(above)).toBeLessThanOrEqual(name.at.y);
    }
    expect(bottom(name.at)).toBeLessThanOrEqual(page.at.y);
    expect(steps.map((step) => step.at.x)).toEqual(ROW.stations.map((station) => station.x + station.w / 2));
    for (const step of steps) expect(inside(box(step.at.x - step.r, step.at.y - step.r, 2 * step.r, 2 * step.r), page.at), step.key).toBe(true);
    expect(links).toHaveLength(steps.length - 1);
    links.forEach((link, n) => {
      expect(link.x0).toBeGreaterThan(steps[n].at.x);
      expect(link.x1).toBeLessThan(steps[n + 1].at.x);
    });
    expect(inside(published.at, page.at)).toBe(true);
    expect(published.at.x).toBeGreaterThan(steps.at(-1)!.at.x + steps.at(-1)!.r);
  });

  it("sets slide 7's reviewer beside the card, named over their head, and everything printed on the card inside it", () => {
    const { person, name, card, flag, flagged, ticks, mark, approved, signed, desk } = REVIEW;
    expect(apart(person.at, card.at)).toBe(true);
    expect(bottom(name.at)).toBeLessThanOrEqual(person.at.y);
    expect(apart(name.at, card.at)).toBe(true);
    for (const part of [flagged.at, markBox(mark.at), approved.at, signed.at, ...ticks.map((tick) => tick.at), card.privacy.at]) expect(inside(part, card.at)).toBe(true);
    expect(inside(box(flag.at.x, flag.at.y - flag.size, flag.size, flag.size), card.at)).toBe(true);
    // Each tick sits on its checklist box, and the sign-off reads left to right: the mark, "Approved", who and when.
    expect(ticks.map((tick) => tick.at)).toEqual(card.checks.map((check) => check.at));
    expect(approved.at.x).toBeGreaterThan(mark.at.x + MARK_R);
    expect(signed.at.x).toBeGreaterThanOrEqual(approved.at.x + approved.at.w);
    // Reviewer and card stand on the desk.
    expect(bottom(person.at)).toBe(desk.y);
    expect(bottom(card.at)).toBeLessThanOrEqual(desk.y);
  });

  it("keeps slide 8's crossed-out boxes and the files beside them apart, the files in their folder's panel and the hosting under it", () => {
    const files = [HOST.panel.at, HOST.folder.at, ...HOST.files.map((file) => file.at), HOST.hosting.at];
    for (const thing of HOST.usual) for (const file of files) expect(apart(thing.at, file), thing.key).toBe(true);
    for (const file of files) expect(file.x + file.w).toBeLessThanOrEqual(STAGE.w);
    for (const file of [HOST.folder.at, ...HOST.files.map((entry) => entry.at)]) expect(inside(file, HOST.panel.at)).toBe(true);
    expect(HOST.hosting.at.y).toBeGreaterThanOrEqual(bottom(HOST.panel.at));
  });

  it("fills slide 8's stage into its lower third, the files level with the boxes", () => {
    const left = bounds(HOST.usual.map((thing) => thing.at));
    const right = bounds([HOST.panel.at, HOST.hosting.at]);
    expect(bottom(left)).toBeGreaterThanOrEqual(STAGE.h * 0.8);
    expect(Math.abs(left.y + left.h / 2 - (right.y + right.h / 2))).toBeLessThanOrEqual(48);
  });

  it("sets slide 9's three session cards apart, each with the page its session left inside it, under its name", () => {
    const sessions = DAYS.sessions.map((session) => session.at);
    sessions.slice(1).forEach((at, i) => expect(apart(at, sessions[i])).toBe(true));
    for (const session of DAYS.sessions) {
      expect(inside(session.page.at, session.at), session.key).toBe(true);
      expect(session.page.at.y, session.key).toBeGreaterThanOrEqual(bottom(session.label.at));
      for (const part of session.page.parts) expect(inside(part.at, session.page.at), session.key).toBe(true);
    }
    // Each session's page holds more than the one before: the changes the agents made.
    DAYS.sessions.slice(1).forEach((session, i) => expect(session.page.parts.length, session.key).toBeGreaterThan(DAYS.sessions[i].page.parts.length));
  });

  it("sets slide 9's coalition, named, under the row, each feedback coming up from it over the gap after its session, and an arrow into the session that follows or, after the last, into \"Live\"", () => {
    const sessions = DAYS.sessions.map((session) => session.at);
    const { coalition } = DAYS;
    const row = bounds(sessions);
    const group = bounds([...coalition.people.map((person) => person.at), coalition.name.at]);
    expect(coalition.name.text).toBe("Big Cities Health Coalition");
    expect(coalition.rule.from.y).toBeLessThan(group.y);
    DAYS.feedback.forEach((feedback, i) => {
      const session = sessions[i];
      const middle = feedback.at.x + feedback.at.w / 2;
      expect(middle).toBeGreaterThan(session.x + session.w);
      expect(feedback.at.y).toBeGreaterThan(bottom(row));
      expect(bottom(feedback.at)).toBeLessThan(coalition.rule.from.y);
      // The feedback comes from the coalition's line, straight up into it.
      expect(feedback.from.from.y).toBe(coalition.rule.from.y);
      expect(feedback.from.from.x + feedback.from.from.w / 2).toBeCloseTo(middle, 5);
      expect(feedback.from.to).toEqual(feedback.at);
      expect(middle).toBeGreaterThanOrEqual(coalition.rule.from.x);
      expect(middle).toBeLessThanOrEqual(coalition.rule.to.x);
      expect(feedback.arrow.to).toEqual(sessions[i + 1] ?? DAYS.live.at);
    });
    // "Live" ends the row: level with the cards' middle, past the last card, straight over the last feedback.
    const { live } = DAYS;
    const last = sessions.at(-1)!;
    expect(live.at.x).toBeGreaterThanOrEqual(last.x + last.w + 24);
    expect(live.at.y + live.at.h / 2).toBeCloseTo(last.y + last.h / 2, 5);
    const lastFeedback = DAYS.feedback.at(-1)!.at;
    expect(live.at.x + live.at.w / 2).toBeCloseTo(lastFeedback.x + lastFeedback.w / 2, 5);
  });

  it("sets slide 10's wireframe on the right and the people and agents on the left, apart, every piece inside the page and its mark on it", () => {
    const { wire, pieces, still } = PROOF;
    const left = bounds([...PROOF.names.map((name) => name.at), ...PROOF.people.map((person) => person.at), ...PROOF.agents.map((agent) => agentBox(agent.at)), ...PROOF.labels.map((label) => label.at)]);
    expect(wire.at.x - (left.x + left.w)).toBeGreaterThanOrEqual(200);
    expect(still.at).toEqual(wire.at);
    // The page is the card grid still's shape, so the still settles into it.
    expect(wire.at.w / wire.at.h).toBeCloseTo(928 / 520, 2);
    for (const piece of pieces) {
      for (const part of piece.parts) expect(inside(part, wire.at), piece.key).toBe(true);
      // The person's mark lands on the piece it approves: inside the page, in the piece's own band, on none of the page's parts.
      const mark = markBox(piece.mark.at);
      expect(inside(mark, wire.at), piece.key).toBe(true);
      expect(inside(mark, piece.band), piece.key).toBe(true);
      for (const other of pieces) for (const part of other.parts) expect(apart(mark, part), `${piece.key} on ${other.key}`).toBe(true);
    }
    pieces.slice(1).forEach((piece, i) => expect(Math.min(...piece.parts.map((part) => part.y))).toBeGreaterThan(Math.max(...pieces[i].parts.map(bottom))));
  });

  it("sets slide 10's kept mark beside the people, level with them, nearer them than the agents", () => {
    const mark = markBox(PROOF.mark.at);
    const people = bounds(PROOF.people.map((person) => person.at));
    const agents = bounds(PROOF.agents.map((agent) => agentBox(agent.at)));
    expect(PROOF.mark.at.y).toBeCloseTo(people.y + people.h / 2, 5);
    expect(apart(mark, people)).toBe(true);
    expect(apart(mark, agents)).toBe(true);
    const toPeople = mark.x - (people.x + people.w);
    const toAgents = agents.x - (mark.x + mark.w);
    expect(toPeople).toBeGreaterThanOrEqual(16);
    expect(toAgents).toBeGreaterThanOrEqual(2 * toPeople);
    for (const name of PROOF.names) expect(apart(mark, name.at), name.key).toBe(true);
    expect(mark.y + mark.h).toBeLessThan(PROOF.rule.from.y);
  });

  it("sets slide 11's request card, calendar, dollar signs and quotes apart, left to right, the \"No\" on the card and the change request under it", () => {
    const { request, calendar, pages, months, quotes, dollars, no, stamp, change } = TOO_LONG;
    const pile = bounds(pages.map((page) => page.strip.at));
    const stack = bounds(dollars.flatMap((row) => row.glyphs));
    const column = bounds(quotes.map((quote) => quote.at));
    const order = [request.at, bounds([calendar.at, pile, months.at]), stack, column];
    order.slice(1).forEach((b, i) => expect(b.x).toBeGreaterThan(order[i].x + order[i].w));
    expect(bottom(pile)).toBeLessThanOrEqual(calendar.at.y);
    expect(inside(no.at, request.at)).toBe(true);
    expect(inside(stamp.at, request.at)).toBe(true);
    expect(change.at.y).toBeGreaterThanOrEqual(bottom(request.at));
    expect(apart(change.at, months.at)).toBe(true);
    // The pile of turned pages: a strip for each page, none over another.
    expect(pages).toHaveLength(10);
    pages.slice(1).forEach((page, i) => expect(apart(page.strip.at, pages[i].strip.at), page.strip.key).toBe(true));
    // Each page's month sits at the top of the face, under the binding and over the first row of days; the days stay on the face.
    expect(inside(calendar.head, calendar.face)).toBe(true);
    expect(calendar.head.y).toBeGreaterThanOrEqual(bottom(calendar.binding));
    expect(bottom(calendar.head)).toBeLessThanOrEqual(Math.min(...calendar.days.map((day) => day.y)));
    for (const day of calendar.days) expect(inside(day, calendar.face)).toBe(true);
    // Each quote adds its rows of dollar signs, from the foot up.
    expect(dollars).toHaveLength(quotes.length * TOO_LONG.rowsPerQuote);
    dollars.slice(1).forEach((row, i) => expect(row.glyphs[0].y).toBeLessThan(dollars[i].glyphs[0].y));
  });

  it("sets slide 11a's card on the left, its words and price under it, the badge starting clear of it and settling in its upper right corner, and the empty outlines in a column on the right", () => {
    const { card, words, badge, price, wanted } = TOOLS_GAP;
    // The badge settles in the card's upper right corner, over the card's lines of writing; it starts off to the card's left, clear of it.
    expect(inside(badge.at, card.at)).toBe(true);
    expect(badge.at.x + badge.at.w / 2).toBeGreaterThan(card.at.x + card.at.w / 2);
    expect(badge.at.y + badge.at.h / 2).toBeLessThan(card.at.y + card.at.h / 2);
    for (const line of card.lines) expect(bottom(badge.at)).toBeLessThan(line.y);
    const start = { ...badge.at, x: badge.at.x + badge.from };
    expect(start.x + start.w).toBeLessThan(card.at.x);
    // The words under the card, the price's first row directly under them (no empty slot between), and its second row added under the first.
    expect(words.at.y).toBeGreaterThanOrEqual(bottom(card.at));
    const [first, second] = price.map((row) => bounds(row.glyphs));
    expect(first.y - bottom(words.at)).toBeGreaterThanOrEqual(16);
    expect(first.y - bottom(words.at)).toBeLessThanOrEqual(24);
    expect(second.y).toBeGreaterThanOrEqual(bottom(first));
    expect(second.y - bottom(first)).toBeLessThanOrEqual(16);
    expect(second.x).toBe(first.x);
    expect(first.x + first.w / 2).toBeCloseTo(card.at.x + card.at.w / 2, 5);
    // The outlines: a column, none over another, well to the right of everything on the left, each name inside its outline.
    wanted.slice(1).forEach((tool, i) => expect(tool.at.y, tool.key).toBeGreaterThanOrEqual(bottom(wanted[i].at) + 16));
    const left = bounds([card.at, words.at, ...price.flatMap((row) => row.glyphs)]);
    const column = bounds(wanted.map((tool) => tool.at));
    expect(column.x - (left.x + left.w)).toBeGreaterThanOrEqual(400);
    for (const tool of wanted) expect(inside(tool.name.at, tool.at), tool.key).toBe(true);
  });

  it("names slide 12's agent and the staff under them, on the stage and clear of the app, every tile inside the app", () => {
    const { agentName, personName, app, person, mark, tiles } = AI_BUILDS;
    for (const name of [agentName, personName]) {
      expect(apart(name.at, app.at), name.key).toBe(true);
      expect(name.at.x + name.at.w).toBeLessThanOrEqual(STAGE.w);
    }
    expect(bottom(person.at)).toBeLessThanOrEqual(personName.at.y);
    expect(apart(person.at, app.at)).toBe(true);
    // The staff's mark lands on the tool it approves: inside the app, under its bar, clear of its edges and of every tile.
    const body = box(app.at.x + 8, app.bar + 8, app.at.w - 16, app.at.h - (app.bar - app.at.y) - 16);
    expect(inside(markBox(mark.at), body)).toBe(true);
    for (const tile of tiles) expect(apart(markBox(mark.at), box(tile.at.x - 8, tile.at.y - 8, TILE.large.side + 16, TILE.large.side + 16)), tile.key).toBe(true);
    for (const tile of tiles) {
      expect(inside(tileAt(tile.at), box(app.at.x, app.bar, app.at.w, app.at.h - (app.bar - app.at.y))), tile.key).toBe(true);
      expect(tile.place.at).toEqual(tileAt(tile.at));
    }
  });

  it("sets slide 12's agent beside the app it builds, much nearer the app than the chatbot picture", () => {
    const { before, agent, app } = AI_BUILDS;
    const ring = agentBox(agent.at);
    const toApp = app.at.x - (ring.x + ring.w);
    const toBefore = ring.x - (before.at.x + before.at.w);
    expect(toApp).toBeGreaterThanOrEqual(24);
    expect(toBefore).toBeGreaterThanOrEqual(2.5 * toApp);
  });

  it("sets slide 12's small chatbot picture and its words at the left, clear of the agent and its name", () => {
    const { before, agent, agentName, app, inside: words0 } = AI_BUILDS;
    const words = box(words0.at.x + before.words.x, words0.at.y + before.words.y, 280, LINE);
    for (const part of [before.at, words]) {
      expect(part.x).toBeGreaterThanOrEqual(STORY.x);
      for (const other of [agentBox(agent.at), agentName.at, app.at]) expect(apart(part, other)).toBe(true);
    }
  });

  it("names slide 13's history line under it, clear of the approvals on it", () => {
    const { historyName, history, marks } = YOURS;
    expect(historyName.at.y).toBeGreaterThan(history.y + MARK_R / 2);
    for (const entry of marks) expect(apart(historyName.at, box(entry.at.x - MARK_R / 2, entry.at.y - MARK_R / 2, MARK_R, MARK_R))).toBe(true);
  });
});
