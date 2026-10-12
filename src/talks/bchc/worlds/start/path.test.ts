/** Slides 39 to 42: what each one's click shows, in what order, and where it ends (steps-path.ts, steps-ask.ts). */
import { describe, expect, it } from "vitest";
import { CONTENT_TOP } from "@/components/deck/kit";
import { endOf, endState, markup, movesOf, only, pictures, showsAtEnd, text } from "./harness";
import { ASK, RAMP } from "./layout-ask";
import { EXAMPLES, LOW_RISK, PATH } from "./layout-path";

describe("slide 39: low risk, high return", () => {
  it("draws the path only once the residents have reached the services", () => {
    const served = Math.max(...LOW_RISK.services.map((service) => endOf(only(movesOf("low-risk.play", service.key, "--k")))));
    expect(only(movesOf("low-risk.play", PATH.line.key)).at).toBeGreaterThanOrEqual(served);
  });

  it("lifts the path off the footer and leaves air over the pile and under it", () => {
    expect(PATH.line.from.y).toBeLessThanOrEqual(960);
    expect(PATH.tool.at.y + PATH.tool.at.h).toBeLessThanOrEqual(PATH.line.from.y - 12);
    // Under the story band's second line (420 + 2 x 48), with a clear gap.
    const top = Math.min(...LOW_RISK.sheets.map((sheet) => sheet.at.y));
    expect(top).toBeGreaterThanOrEqual(420 + 2 * 48 + 32);
    // The pile's name sits clear over the first project's.
    const data = LOW_RISK.labels[0];
    expect(LOW_RISK.labels.map((label) => label.text)).toEqual(["Public data", "Agent", "One clear tool"]);
    expect(data.at.y + 16).toBeLessThan(LOW_RISK.first.at.y - 16);
  });

  it("draws the flow in navy arrows: public data to the agent, the agent to the tool, the tool to the residents, each as its step happens", () => {
    const { arrows, residents, tool, rows, residentsLabel } = LOW_RISK;
    expect(arrows.map((arrow) => arrow.key)).toEqual(["low-risk.arrow.data", "low-risk.arrow.agent", "low-risk.arrow.tool"]);
    const draws = arrows.map((arrow) => only(movesOf("low-risk.play", arrow.key, "--d")));
    draws.slice(1).forEach((play, i) => expect(play.at).toBeGreaterThan(draws[i].at));
    for (const arrow of arrows) {
      expect(markup).toMatch(new RegExp(`class="dk-connector dk-connector--paper" data-build="${arrow.key}"`));
      expect(showsAtEnd("low-risk.play", arrow.key), arrow.key).toBe(true);
    }
    // The last arrow comes before the residents arrive.
    const arrive = Math.min(...residents.map((person) => only(movesOf("low-risk.play", person.key, "x")).at));
    expect(draws[2].at).toBeLessThanOrEqual(arrive);
    // The residents end outside the tool, at its right, each level with a row, and named.
    residents.forEach((person, i) => {
      const end = { x: person.at.x + person.to.x, y: person.at.y + person.to.y };
      expect(end.x, person.key).toBeGreaterThan(tool.at.x + tool.at.w + 48);
      expect(end.x + person.at.w, person.key).toBeLessThanOrEqual(1824);
      const row = rows[Math.floor(i / 2)];
      expect(Math.abs(end.y + person.at.h / 2 - (row.y + row.h / 2)), person.key).toBeLessThanOrEqual(2);
    });
    expect(residentsLabel.text).toBe("Residents");
    expect(showsAtEnd("low-risk.play", residentsLabel.key)).toBe(true);
  });
});

describe("slide 40: two starter templates", () => {
  const { catalog, helpline } = EXAMPLES;

  it("names both drawings and tags each Starter template, with no stills and no lines to people", () => {
    for (const name of [catalog.name, helpline.name]) {
      expect(showsAtEnd("examples.play", name.key), name.key).toBe(true);
      const at = markup.indexOf(`data-build="${name.key}"`);
      const block = markup.slice(at, markup.indexOf("</div>", markup.indexOf("dk-tag", at)));
      expect(block, name.key).toContain(name.text);
      expect(block, name.key).toContain(EXAMPLES.tag);
    }
    expect(text.filter((words) => words === EXAMPLES.tag)).toHaveLength(2);
    expect(markup).not.toMatch(/<img/);
    expect(markup).not.toMatch(/examples\.(service|feed|person)/);
  });

  it("answers the catalog's questions one at a time before the matches light, and turns the helpline's spoken question into the list", () => {
    const answers = catalog.questions.map((q) => only(movesOf("examples.play", q.radio.key, "--k")));
    answers.slice(1).forEach((play, i) => expect(play.at - answers[i].at).toBeGreaterThanOrEqual(0.25));
    const answered = endOf(answers[answers.length - 1]);
    for (const i of catalog.matches) expect(only(movesOf("examples.play", catalog.results[i].key, "--k")).at).toBeGreaterThanOrEqual(answered);
    helpline.voice.groups.forEach((bars, g) => {
      const leave = Math.min(...bars.map((bar) => only(movesOf("examples.play", bar.key, "x")).at));
      const item = helpline.list[g];
      expect(bars.every((bar) => bar.to.y > 0), `group ${g} goes down to its line`).toBe(true);
      expect(only(movesOf("examples.play", item.key, "--k")).at).toBeGreaterThan(leave);
      expect(only(movesOf("examples.play", item.key, "autoAlpha")).at).toBeGreaterThan(leave);
      for (const bar of bars) expect(endState("examples.play")[bar.key], bar.key).toMatchObject({ autoAlpha: 0 });
    });
    expect(helpline.voice.groups.flat()).toHaveLength(helpline.voice.bars.length);
  });
});

describe("slide 41: then take on more", () => {
  const { clinic, board, pipeline, room, shelf, tile } = RAMP;

  it("stands bigger tools on the path one after another, named, and the pipeline's feeds into both once it is built", () => {
    const tools = [clinic, board, pipeline];
    const starts = tools.map((t) => only(movesOf("ramp.play", t.key, "--d")).at);
    starts.slice(1).forEach((at, i) => expect(at).toBeGreaterThan(starts[i]));
    tools.slice(1).forEach((t, i) => expect(t.at.w * t.at.h, t.key).toBeGreaterThan(tools[i].at.w * tools[i].at.h));
    for (const t of tools) {
      expect(text).toContain(t.name);
      expect(t.at.y + t.at.h).toBeLessThanOrEqual(PATH.tool.at.y + PATH.tool.at.h);
    }
    const built = endOf(only(movesOf("ramp.play", pipeline.table.key)));
    for (const feed of pipeline.feeds) expect(only(movesOf("ramp.play", feed.key)).at, feed.key).toBeGreaterThanOrEqual(built - 0.2);
  });

  it("ends with your department's newest tool in the catalog's open slot: it comes up inside your department, then slides up into the slot", () => {
    const appears = only(movesOf("ramp.play", tile.key, "autoAlpha"));
    const [, travels] = movesOf("ramp.play", tile.key, "x");
    expect(appears.at).toBeGreaterThanOrEqual(only(movesOf("ramp.play", room.key)).at);
    const inRoom = { x: tile.at.x + tile.from.x, y: tile.at.y + tile.from.y };
    expect(inRoom.x).toBeGreaterThan(room.at.x);
    expect(inRoom.x + tile.at.w).toBeLessThan(room.at.x + room.at.w);
    expect(inRoom.y).toBeGreaterThan(room.at.y);
    expect(inRoom.y + tile.at.h).toBeLessThan(room.at.y + room.at.h);
    expect(travels.at - endOf(appears)).toBeGreaterThanOrEqual(0.3);
    expect({ x: tile.at.x, y: tile.at.y }).toEqual({ x: shelf.slot.at.x, y: shelf.slot.at.y });
    const end = endState("ramp.play");
    expect(end[tile.key]).toMatchObject({ autoAlpha: 1, x: 0, y: 0 });
    expect(end[shelf.slot.key]).toMatchObject({ autoAlpha: 0 });
    expect(markup).toMatch(new RegExp(`class="st-shelf__entry st-shelf__entry--new" data-build="${tile.key}"`));
    expect(text).toContain(room.label.text);
    expect(markup).not.toMatch(/ramp\.net/);
  });

  it("names the first project again where it stands on the path, clear of the clinic finder and inside your department", () => {
    const { first } = RAMP;
    expect(first.text).toBe("First project");
    expect(text.filter((words) => words === first.text)).toHaveLength(2);
    expect(showsAtEnd("ramp.play", first.key)).toBe(true);
    // Over the first project's card, centred on it: about 150 px of words, clear of the clinic finder and the wall.
    expect(first.at.x).toBe(PATH.tool.at.x + PATH.tool.at.w / 2);
    expect(first.at.y + 16).toBeLessThan(PATH.tool.at.y);
    expect(first.at.x + 80).toBeLessThan(clinic.at.x);
    expect(first.at.x - 80).toBeGreaterThan(room.at.x);
  });

  it("leaves a navy trail along the path from your department's wall to the slot the newest tool filled, drawn as it goes", () => {
    const { trail } = RAMP;
    const wall = room.at.x + room.at.w;
    const slot = shelf.slot.at;
    expect(trail.d.startsWith(`M${wall} ${PATH.line.from.y}H${slot.x + slot.w / 2}V${slot.y + slot.h + 6}`)).toBe(true);
    // One subpath: a dash restarts at every move, which would show a piece of the arrowhead before the draw reached it.
    expect(trail.d.match(/M/g)).toHaveLength(1);
    expect(markup).toMatch(new RegExp(`class="st-line--paper dk-draw" data-build="${trail.key}"`));
    expect(showsAtEnd("ramp.play", trail.key)).toBe(true);
    expect(endState("ramp.play")[trail.key]).toMatchObject({ "--d": 1 });
    const [, travels] = movesOf("ramp.play", tile.key, "x");
    const drawn = only(movesOf("ramp.play", trail.key, "--d"));
    expect(drawn.at).toBeCloseTo(travels.at, 5);
    expect(endOf(drawn)).toBeCloseTo(endOf(travels), 5);
  });

  it("holds every tool inside your department, its floor the path, and the path leads on out of it to the catalog, which is named", () => {
    const { at, d } = room;
    expect(at.y + at.h).toBe(PATH.line.from.y);
    // Walls and a roof, and no floor of its own: the path is its floor.
    expect(d).toBe(`M0 ${at.h}V0H${at.w}V${at.h}`);
    for (const t of [PATH.tool, clinic, board, pipeline]) {
      expect(t.at.x, t.key).toBeGreaterThanOrEqual(at.x + 24);
      expect(t.at.x + t.at.w, t.key).toBeLessThanOrEqual(at.x + at.w - 24);
      expect(t.at.y, t.key).toBeGreaterThanOrEqual(at.y + 24);
    }
    // The pipeline's feeds run inside it too.
    expect(pipeline.feedY).toBeGreaterThanOrEqual(at.y + 24);
    // The catalog stands on the path past your department's wall, at the path's end, named.
    expect(shelf.at.x).toBeGreaterThan(at.x + at.w + 24);
    expect(shelf.at.x + shelf.at.w).toBe(1824);
    expect(shelf.at.y + shelf.at.h).toBeLessThanOrEqual(PATH.tool.at.y + PATH.tool.at.h);
    expect(shelf.label.text).toBe("The catalog");
    expect(text).toContain(shelf.label.text);
    for (const key of [shelf.key, shelf.label.key, room.key, room.label.key]) expect(showsAtEnd("ramp.play", key), key).toBe(true);
    for (const entry of [...shelf.entries, shelf.slot]) {
      expect(entry.at.x, entry.key).toBeGreaterThan(shelf.at.x);
      expect(entry.at.x + entry.at.w, entry.key).toBeLessThan(shelf.at.x + shelf.at.w);
      expect(entry.at.y, entry.key).toBeGreaterThan(shelf.at.y);
      expect(entry.at.y + entry.at.h, entry.key).toBeLessThan(shelf.at.y + shelf.at.h);
    }
    expect(markup).not.toMatch(/data-build="ramp\.person"/);
  });
});

describe("slide 42: our ask", () => {
  const { cards, form, ready, pack, engineer } = ASK;
  const askMarks = () => markup.slice(markup.indexOf(`data-build="ask.marks"`), markup.indexOf(`data-build="ramp.html"`));

  it("lays the four requests out as four cards that fill the stage, two by two, each with its words from the script", () => {
    expect(cards).toHaveLength(4);
    expect(cards.map((card) => card.lines.join(" "))).toEqual([
      "Post one project in the catalog this month.",
      "Tell us if you're ready to start now.",
      "Load the agent pack when it's ready.",
      "Without technical staff, ask IT to place an engineer inside your team.",
    ]);
    expect(Math.min(...cards.map((card) => card.at.x))).toBe(96);
    expect(Math.max(...cards.map((card) => card.at.x + card.at.w))).toBe(1824);
    expect(Math.min(...cards.map((card) => card.at.y))).toBeGreaterThanOrEqual(CONTENT_TOP.one);
    expect(Math.max(...cards.map((card) => card.at.y + card.at.h))).toBeLessThanOrEqual(992);
    for (const card of cards) {
      for (const line of card.lines) expect(text).toContain(line);
      const { x, y, w, h } = card.words.at;
      expect(x).toBeGreaterThan(card.art.x + card.art.w);
      expect(x + w).toBeLessThanOrEqual(card.at.x + card.at.w - 24);
      expect(y).toBeGreaterThanOrEqual(card.at.y);
      expect(y + h).toBeLessThanOrEqual(card.at.y + card.at.h);
      for (const key of [card.key, card.words.key]) expect(showsAtEnd("ask.play", key), key).toBe(true);
    }
    expect(cards.map((card) => card.hue)).toEqual(["catalog", "process", "share-pack", "share-help"]);
  });

  it("brings the cards up 1.8 s apart, and each acts out its request once it is up: a form goes out, a hand goes up once the words are in, the pack arrives, an engineer takes the empty seat", () => {
    const up = cards.map((card) => only(movesOf("ask.play", card.key, "--d")));
    up.slice(1).forEach((play, i) => expect(play.at - up[i].at).toBeGreaterThanOrEqual(1.8 - 1e-9));
    const after = (i: number, key: string, prop: string) => {
      const play = only(movesOf("ask.play", key, prop));
      expect(play.at, key).toBeGreaterThan(up[i].at);
      return play;
    };
    // The form fills in, then goes out into the tray.
    const filled = form.fields.map((field) => after(0, field.key, "--k"));
    const goes = after(0, form.key, "x");
    expect(goes.at).toBeGreaterThanOrEqual(Math.max(...filled.map(endOf)) - 1e-9);
    expect(goes.on).toMatchObject(form.out);
    // A person comes up; once the card's words are in, their hand goes up, done before the next card comes up.
    const comesUp = after(1, ready.key, "autoAlpha");
    const raised = after(1, ready.key, "--k");
    expect(raised.at).toBeGreaterThan(comesUp.at);
    expect(raised.at).toBeGreaterThanOrEqual(endOf(only(movesOf("ask.play", cards[1].words.key, "autoAlpha"))) - 1e-9);
    expect(endOf(raised)).toBeLessThanOrEqual(up[2].at + 1e-9);
    // The pack arrives, and lights once it is in.
    const arrives = after(2, pack.key, "x");
    expect(only(movesOf("ask.play", pack.key, "--k")).at).toBeGreaterThanOrEqual(endOf(arrives) - 0.2);
    // The engineer comes to the empty seat, and lights once they are in it.
    const comes = after(3, engineer.key, "x");
    expect(only(movesOf("ask.play", engineer.key, "--k")).at).toBeGreaterThanOrEqual(endOf(comes) - 0.2);
    expect(only(movesOf("ask.play", engineer.chair.key, "--d")).at).toBeLessThan(comes.at);
  });

  it("ends with all four in hand, the hand up, and no tile, no pool, no approval mark, no request slips or clock and no number", () => {
    const end = endState("ask.play");
    expect(end[form.key]).toMatchObject(form.out);
    for (const field of form.fields) expect(end[field.key], field.key).toMatchObject({ "--k": 1 });
    // The harness takes a `__lit` part as hidden by the kit's CSS, as with the pack and the engineer: its end values say it is up, in place and lit.
    expect(end[ready.key]).toMatchObject({ autoAlpha: 1, y: 0, "--k": 1 });
    expect(end[pack.key]).toMatchObject({ x: 0, "--k": 1 });
    expect(end[engineer.key]).toMatchObject({ x: 0, "--k": 1 });
    for (const key of [form.tray.key, pack.floor.key, engineer.chair.key, engineer.table.key]) expect(showsAtEnd("ask.play", key), key).toBe(true);
    const marks = askMarks();
    expect(marks).not.toMatch(/ask\.(tile|pool)/);
    expect(marks).not.toMatch(/dk-human/);
    expect(marks).not.toMatch(/st-github|ask\.(slip|clock)/);
    // The hand is the ready person's own: its arm and palm sit in their part, in the process's colour.
    const part = marks.slice(marks.indexOf(`data-build="${ready.key}"`), marks.indexOf(`data-build="${pack.floor.key}"`));
    expect(part).toMatch(/data-hue="process"/);
    expect(part).toMatch(/st-ask__arm/);
    expect(part).toMatch(/st-ask__palm/);
    const ask = pictures.find((picture) => picture.id === "ask")!;
    expect([ask.show, ...ask.story, ...ask.steps.flatMap((step) => step.show)].filter((words) => /\d/.test(words))).toEqual([]);
  });
});
