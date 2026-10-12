/** Slides 37 to 38b: what each one's click shows, in what order, and where it ends (steps-two.ts). */
import { describe, expect, it } from "vitest";
import { endOf, endState, hiddenAt, markup, movesOf, nodeOf, nodes, only, pictureOfKey, showsAtEnd, text } from "./harness";
import { storyOf } from "../../script/find";
import { FDE, QUESTIONS } from "./layout-help";
import { bandOf, DRAWING_TOP } from "./layout";
import { APPROVER_SLIDE, TOOLS } from "./layout-two";

/** Slide 38a's questions come up this far apart (docs/bchc-flow-revision.md, section 3): slower than the speaker reads them out. */
const QUESTION_APART = 2.4;

describe("slide 37: AI coding tools", () => {
  const { room, door, tool, receipt, approver, mark, people, agents } = TOOLS;

  it("buys the tool first: the receipt slides in, then its plain tick, then Purchased", () => {
    const slides = only(movesOf("tools.play", receipt.key, "x"));
    const tick = only(movesOf("tools.play", receipt.tick.key, "--d"));
    expect(tick.at).toBeGreaterThanOrEqual(endOf(slides) - 1e-9);
    expect(only(movesOf("tools.play", receipt.label.key)).at).toBeGreaterThan(tick.at);
    // The tick is the plain navy one: not a pass and not a person's approval.
    expect(nodeOf(receipt.tick.key)?.classes).toEqual(["st-tick", "dk-draw"]);
    expect(text).toContain(receipt.label.text);
    expect([tool.name.text, TOOLS.label.text, receipt.label.text]).toEqual(["AI coding tool", "Your department", "Purchased"]);
  });

  it("then approves it: IT, security and legal, and a person's mark, Approved", () => {
    const tick = endOf(only(movesOf("tools.play", receipt.tick.key)));
    const approves = only(movesOf("tools.play", mark.key, "--d"));
    expect(only(movesOf("tools.play", approver.key)).at).toBeGreaterThanOrEqual(tick);
    expect(approves.at).toBeGreaterThan(only(movesOf("tools.play", approver.key)).at);
    expect(approver.label.text).toBe("IT, security and legal");
    expect(mark.label).toBe("Approved");
    expect(markup).toMatch(new RegExp(`class="dk-human" data-build="${mark.key}"`));
  });

  it("opens a door that reads as a door only once it is approved: jambs at the doorway's ends, a leaf that swings in on its hinge, and its swing drawn", () => {
    const approved = endOf(only(movesOf("tools.play", mark.key, "--d")));
    const opens = only(movesOf("tools.play", door.key, "--k"));
    expect(opens.at).toBeGreaterThanOrEqual(approved);
    const swing = only(movesOf("tools.play", door.swing.key, "--d"));
    expect(swing.at).toBeCloseTo(opens.at, 5);
    expect(markup.match(/class="st-door__jamb"/g)).toHaveLength(2);
    expect(markup).toMatch(/class="st-door__leaf"/);
    // The doorway is the gap in the room's left wall; the hinge is at its top, and the leaf swings into the room.
    expect(door.hinge).toEqual({ x: room.at.x, y: door.top });
    expect(door.length).toBeGreaterThanOrEqual(tool.at.h + 24);
    const end = endState("tools.play");
    expect(end[door.key]).toMatchObject({ "--k": 1 });
    expect(end[door.swing.key]).toMatchObject({ "--d": 1 });
  });

  it("takes the tool in through the doorway, where it opens into one tool window beside the people, and gives each person an agent working in it", () => {
    const opens = only(movesOf("tools.play", door.key, "--k"));
    const across = only(movesOf("tools.play", tool.key, "x"));
    expect(across.at).toBeGreaterThan(opens.at);
    expect(movesOf("tools.play", tool.name.key, "x").map((play) => [play.on.x, play.at])).toEqual([[across.on.x, across.at]]);
    // Through the doorway: inside its height, clear of its jambs.
    expect(tool.at.y).toBeGreaterThanOrEqual(door.top + 12);
    expect(tool.at.y + tool.at.h).toBeLessThanOrEqual(door.top + door.length - 12);
    const rest = { x: tool.at.x + Number(across.on.x), y: tool.at.y, w: tool.at.w, h: tool.at.h };
    const win = tool.window.at;
    expect(rest.x).toBeGreaterThan(win.x);
    expect(rest.x + rest.w).toBeLessThan(win.x + win.w);
    expect(rest.y).toBeGreaterThan(win.y + tool.window.bar);
    expect(rest.y + rest.h).toBeLessThan(win.y + win.h);
    // Once it is in, its window opens around it and the small tool gives way to it: one tool on the stage at the end.
    const opensUp = only(movesOf("tools.play", tool.window.key, "--d"));
    expect(opensUp.at).toBeGreaterThanOrEqual(endOf(across) - 1e-9);
    expect(tool.window.name).toBe(tool.name.text);
    const end = endState("tools.play");
    expect(showsAtEnd("tools.play", tool.window.key)).toBe(true);
    for (const key of [tool.key, tool.name.key]) expect(end[key], key).toMatchObject({ autoAlpha: 0 });
    // The window and the people sit together in the room: the people at its right, close by, each level with a row of the window.
    expect(win.x).toBeGreaterThan(room.at.x + door.length);
    expect(win.y).toBeGreaterThanOrEqual(room.at.y + 24);
    expect(win.y + win.h).toBeLessThanOrEqual(room.at.y + room.at.h - 24);
    people.forEach((person, i) => {
      const agent = agents[i];
      expect(person.at.x - (win.x + win.w), person.key).toBeGreaterThan(24);
      expect(person.at.x - (win.x + win.w), person.key).toBeLessThanOrEqual(120);
      expect(person.at.x + person.at.w, person.key).toBeLessThanOrEqual(room.at.x + room.at.w - 24);
      expect(Math.abs(person.at.y + person.at.h / 2 - agent.at.y), person.key).toBeLessThanOrEqual(2);
      // The agent works inside the window, under its bar, and writes its code there.
      expect(agent.at.x - 22).toBeGreaterThan(win.x);
      expect(agent.at.y - 22).toBeGreaterThan(win.y + tool.window.bar);
      expect(agent.at.y + 22).toBeLessThan(win.y + win.h);
      const arrives = only(movesOf("tools.play", agent.key, "autoAlpha"));
      expect(arrives.at, agent.key).toBeGreaterThanOrEqual(opensUp.at);
      for (const line of agent.code) {
        expect(line.at.x).toBeGreaterThan(agent.at.x + 22);
        expect(line.at.x + line.at.w).toBeLessThan(win.x + win.w);
        expect(only(movesOf("tools.play", line.key, "--k")).at, line.key).toBeGreaterThan(arrives.at);
        expect(showsAtEnd("tools.play", line.key), line.key).toBe(true);
      }
      expect(showsAtEnd("tools.play", agent.key), agent.key).toBe(true);
    });
  });

  it("draws no row of boxes", () => {
    expect(nodes.filter((node) => pictureOfKey(node.key) === "tools" && /buy|station|well/.test(node.key))).toEqual([]);
  });
});

describe("slide 38: a person who approves", () => {
  const { cards, queue, publish, trier, tries, pushedTo, cannot } = APPROVER_SLIDE;

  it("names the two person cards, Your approver and Backup, keeps both to the end, and sizes each to what it holds", () => {
    expect(cards.map((card) => card.name)).toEqual(["Your approver", "Backup"]);
    for (const card of cards) {
      expect(text).toContain(card.name);
      for (const key of [card.key, card.figure.key, card.nameKey]) expect(showsAtEnd("approver.play", key), key).toBe(true);
    }
    expect(Math.min(...cards.map((card) => card.at.y))).toBeGreaterThanOrEqual(DRAWING_TOP.one);
    // The approver's card holds them and the changes they approve, and ends close past the last of those.
    const [approverCard, backupCard] = cards;
    const desk = queue.filter((item) => item.change.desk).map((item) => item.change.at.x + item.change.desk!.x + item.change.at.w);
    expect(approverCard.at.x + approverCard.at.w - Math.max(...desk)).toBeLessThanOrEqual(40);
    // The backup's card holds one person and their name, and no more.
    expect(backupCard.at.w).toBeLessThanOrEqual(260);
    expect(backupCard.at.x - (approverCard.at.x + approverCard.at.w)).toBeLessThanOrEqual(48);
  });

  it("has the approver take the first three changes in turn, each landing on their card, where their mark lands on it and it stays", () => {
    const approved = queue.filter((item) => item.change.desk);
    expect(approved.map((item) => item.key)).toEqual(queue.slice(0, 3).map((item) => item.key));
    let last = -1;
    for (const item of approved) {
      const goes = only(movesOf("approver.play", item.change.key, "x"));
      const marked = only(movesOf("approver.play", item.change.mark.key, "--d"));
      expect(goes.on).toMatchObject(item.change.desk!);
      expect(goes.at).toBeGreaterThan(last);
      expect(marked.at).toBeGreaterThanOrEqual(endOf(goes) - 1e-9);
      last = goes.at;
      // It stays with the approver, marked: their card holds what they approved.
      expect(endState("approver.play")[item.change.key]).toMatchObject(item.change.desk!);
      expect(endState("approver.play")[item.change.mark.key]).toMatchObject({ autoAlpha: 1, "--d": 1 });
      expect(nodeOf(item.change.mark.key)?.parent?.key).toBe(item.change.key);
      const page = { x: item.change.at.x + item.change.desk!.x, y: item.change.at.y + item.change.desk!.y, w: item.change.at.w, h: item.change.at.h };
      expect(page.x).toBeGreaterThan(cards[0].figure.at.x + cards[0].figure.at.w);
      expect(page.x + page.w).toBeLessThan(cards[0].at.x + cards[0].at.w);
      expect(page.y).toBeGreaterThan(cards[0].at.y);
      expect(page.y + page.h).toBeLessThan(cards[0].at.y + cards[0].at.h);
      // The mark lands on the page itself, its ring inside the page's edges.
      const ring = item.change.mark.at;
      expect(ring.x - 26).toBeGreaterThanOrEqual(item.change.at.x);
      expect(ring.x + 26).toBeLessThanOrEqual(item.change.at.x + item.change.at.w);
      expect(ring.y - 26).toBeGreaterThanOrEqual(item.change.at.y + 54);
      expect(ring.y + 26).toBeLessThanOrEqual(item.change.at.y + item.change.at.h);
    }
    // The agent cards carry no approval: the one change left on them is unmarked, and nothing marks a card.
    for (const item of queue.filter((entry) => !entry.change.desk)) {
      expect(movesOf("approver.play", item.change.mark.key), item.change.mark.key).toEqual([]);
      expect(nodeOf(item.change.mark.key), item.change.mark.key).toBeNull();
    }
    const humans = [...markup.matchAll(/class="dk-human" data-build="(approver\.[^"]+)"/g)].map(([, key]) => key);
    expect(humans.sort()).toEqual(approved.map((item) => item.change.mark.key).sort());
  });

  it("keeps each agent card whole once its change is taken: the card frames only its agent, and the change sits beside it", () => {
    for (const item of queue) {
      const card = item.at;
      const ring = item.agent.at;
      expect(ring.x - card.x, item.key).toBe(card.x + card.w - ring.x);
      expect(item.change.at.x, item.key).toBeGreaterThanOrEqual(card.x + card.w + 8);
      expect(item.change.at.y, item.key).toBeGreaterThanOrEqual(card.y);
      expect(item.change.at.y + item.change.at.h, item.key).toBeLessThanOrEqual(card.y + card.h);
    }
    // The pairs do not touch: each change ends before the next card starts.
    for (let i = 1; i < queue.length; i++) expect(queue[i - 1].change.at.x + queue[i - 1].change.at.w).toBeLessThan(queue[i].at.x - 16);
  });

  it("has the last agent card go for the locked Publish, bounce off it, and the reason come up", () => {
    const [goes, back] = movesOf("approver.play", queue[trier].key, "x");
    expect(goes.on.x).toBe(tries.x);
    expect(goes.on.y).toBe(tries.y);
    expect(back.on.x).toBe(pushedTo);
    expect(back.at).toBeGreaterThanOrEqual(endOf(goes) - 1e-9);
    // It reaches the button's edge, level with it, and no further.
    // What it carries leads: the change it holds, beside the card, meets the button's edge.
    const card = queue[trier].at;
    const held = queue[trier].change.at;
    expect(held.x + held.w + tries.x).toBeLessThanOrEqual(publish.at.x);
    expect(held.x + held.w + tries.x).toBeGreaterThan(publish.at.x - 12);
    expect(card.y + tries.y + card.h / 2).toBe(publish.at.y + publish.at.h / 2);
    expect(only(movesOf("approver.play", cannot.key)).at).toBeGreaterThanOrEqual(endOf(goes) - 1e-9);
    expect(endState("approver.play")[queue[trier].key]).toMatchObject({ x: pushedTo, y: tries.y });
    for (const key of [cannot.key, publish.key]) expect(showsAtEnd("approver.play", key), key).toBe(true);
    expect(text).toEqual(expect.arrayContaining([cannot.text, publish.text]));
    expect(cannot.at.x).toBeLessThanOrEqual(1824);
    // Pushed back, it stays clear of the people's cards.
    expect(card.x + pushedTo).toBeGreaterThan(cards[1].at.x + cards[1].at.w + 24);
  });

  it("gives 38 no catalog colour: it is the process, not the catalog", () => {
    const approver = nodes.filter((node) => pictureOfKey(node.key) === "approver");
    expect(approver.length).toBeGreaterThan(0);
    for (const node of approver) {
      const tag = markup.match(new RegExp(`<[^>]*data-build="${node.key.replace(/\./g, "\\.")}"[^>]*>`))?.[0] ?? "";
      expect(tag, node.key).not.toMatch(/catalog/);
    }
  });
});

describe("slide 38a: the questions your IT and security teams will ask", () => {
  it("brings slide 38a's questions up in turn, 2.4 s apart so each pair is read, each answer after its question, in paper and at full strength", () => {
    for (const { answer } of QUESTIONS.pairs) {
      expect(nodes.find((node) => node.key === answer.key)?.classes, answer.key).not.toContain("dk-block--soft");
      expect(endState("questions.play")[answer.key], answer.key).toMatchObject({ autoAlpha: 1 });
    }
    const pairs = QUESTIONS.pairs.map(({ question, answer }) => ({ q: only(movesOf("questions.play", question.key)), a: only(movesOf("questions.play", answer.key)) }));
    pairs.forEach(({ q, a }, i) => {
      expect(a.at).toBeGreaterThan(q.at);
      if (i > 0) expect(q.at - pairs[i - 1].q.at).toBeGreaterThanOrEqual(QUESTION_APART - 1e-9);
    });
  });
});

describe("slide 38b: forward-deployed engineers", () => {
  it("names a forward-deployed engineer in its first story line and says what one is, under its two-line title", () => {
    const [a, b] = storyOf("fde");
    expect(a).toBe("This is called a forward-deployed engineer: an IT engineer placed inside your team.");
    expect(b).toBe("Your work skips the central IT queue, and the engineer builds with your people day to day.");
    expect(bandOf("fde")).toBe("two");
    expect(text).toEqual(expect.arrayContaining([a, b]));
  });

  it("builds 38b's tools with the people over them: the engineer and your staff a piece each, then your staff alone once the engineer steps back", () => {
    const [first, second] = FDE.tools;
    const sits = endOf(only(movesOf("fde.play", FDE.engineer.key, "x").filter((play) => play.on.x === FDE.engineer.to)));
    const placed = (tool: typeof first) => tool.pieces.map((piece) => only(movesOf("fde.play", piece.key, "x")));
    const firstPieces = placed(first);
    const secondPieces = placed(second);
    // Built together: the engineer and at least one of your staff each place a piece of the first.
    expect(first.pieces.map((piece) => piece.by)).toContain(FDE.engineer.key);
    expect(first.pieces.some((piece) => FDE.staff.some((person) => person.key === piece.by))).toBe(true);
    expect(firstPieces[0].at).toBeGreaterThanOrEqual(sits);
    // The tool does not draw itself: its outline starts only once its first piece is on the way, and it fills once its last is in.
    for (const [tool, pieces] of [
      [first, firstPieces],
      [second, secondPieces],
    ] as const) {
      expect(only(movesOf("fde.play", tool.key, "--d")).at, tool.key).toBeGreaterThan(pieces[0].at);
      expect(only(movesOf("fde.play", tool.key, "--k")).at, tool.key).toBeGreaterThanOrEqual(endOf(pieces[pieces.length - 1]));
      pieces.slice(1).forEach((play, i) => expect(play.at, tool.key).toBeGreaterThan(pieces[i].at));
    }
    // The engineer steps back after the first is done, still at full strength and named, and your staff alone build the second.
    const back = only(movesOf("fde.play", FDE.engineer.key, "x").filter((play) => play.on.x === FDE.engineer.back));
    expect(back.at).toBeGreaterThanOrEqual(endOf(only(movesOf("fde.play", first.key, "--k"))) - 1e-9);
    expect(secondPieces[0].at).toBeGreaterThan(back.at);
    expect(second.pieces.every((piece) => FDE.staff.some((person) => person.key === piece.by))).toBe(true);
    const end = endState("fde.play");
    for (const key of [FDE.engineer.key, FDE.engineer.label.key, FDE.queueLabel.key]) {
      expect(hiddenAt(end, nodes.find((node) => node.key === key) ?? null), key).toBe(false);
      expect(movesOf("fde.play", key, "autoAlpha").every((play) => play.on.autoAlpha === 1), key).toBe(true);
    }
    // The engineer's name goes where they go: out of IT, to your staff, and the step back.
    expect(movesOf("fde.play", FDE.engineer.label.key, "x").map((play) => [play.on.x, play.at])).toEqual(movesOf("fde.play", FDE.engineer.key, "x").map((play) => [play.on.x, play.at]));
    expect(end[FDE.engineer.label.key]).toMatchObject({ x: FDE.engineer.back });
    expect(text).toEqual(expect.arrayContaining([FDE.engineer.label.text, FDE.queueLabel.text]));
    for (const piece of [...first.pieces, ...second.pieces]) expect(endState("fde.play")[piece.key], piece.key).toMatchObject({ autoAlpha: 1, x: 0, y: 0 });
  });
});

describe("slide 38b: clear of the footer", () => {
  it("lifts your department and central IT off the footer, with the tools built inside your department clear of its edge", () => {
    for (const side of [FDE.dept, FDE.it]) expect(side.at.y + side.at.h, side.key).toBeLessThanOrEqual(968);
    for (const tool of FDE.tools) {
      expect(tool.at.y + tool.at.h, tool.key).toBeLessThanOrEqual(FDE.dept.at.y + FDE.dept.at.h - 24);
      expect(tool.at.x, tool.key).toBeGreaterThanOrEqual(FDE.dept.at.x + 12);
    }
  });
});
