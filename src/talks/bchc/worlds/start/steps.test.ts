/** Slides 34 to 36a: what each one's click shows, in what order, and where it ends (steps-steps.ts). */
import { describe, expect, it } from "vitest";
import { CONTENT_TOP } from "@/components/deck/kit";
import { endOf, endState, markup, movesOf, nodes, only, showsAtEnd, text } from "./harness";
import { STEP_ONE, THREE, TRAINING } from "./layout";
import { GITHUB_SETUP } from "./layout-two";

describe("slide 34: three steps", () => {
  it("brings the three steps up 1.4 s apart, each its face, its edge and its words", () => {
    const starts = THREE.steps.map((step) => {
      const face = only(movesOf("three.play", step.face.key, "--k"));
      expect(only(movesOf("three.play", step.key, "--d")).at, step.key).toBeCloseTo(face.at, 5);
      expect(only(movesOf("three.play", step.words.key)).at, step.words.key).toBeGreaterThan(face.at);
      return face.at;
    });
    starts.slice(1).forEach((at, i) => expect(at - starts[i]).toBeGreaterThanOrEqual(1.4 - 1e-9));
  });

  it("has your department step up onto the first step once all three are up, their name going with them", () => {
    const { person, steps } = THREE;
    const lastUp = Math.max(...steps.map((step) => endOf(only(movesOf("three.play", step.face.key)))));
    const moves = movesOf("three.play", person.key, "x").concat(movesOf("three.play", person.key, "y"));
    expect(Math.min(...moves.map((play) => play.at))).toBeGreaterThanOrEqual(lastUp - 1e-9);
    const end = endState("three.play");
    expect(end[person.key]).toMatchObject({ x: person.up.x, y: person.up.y });
    expect(end[person.label.key]).toMatchObject({ x: person.up.x, y: person.up.y });
    // Their feet end on the first tread, inside its width.
    const first = steps[0].face.at;
    expect(person.at.y + person.at.h + person.up.y).toBe(first.y);
    expect(person.at.x + person.up.x).toBeGreaterThanOrEqual(first.x);
    expect(person.at.x + person.at.w + person.up.x).toBeLessThanOrEqual(first.x + first.w);
    expect(text).toContain(person.label.text);
  });

  it("keeps the stair under the story line and inside the content area", () => {
    for (const step of THREE.steps) {
      expect(step.face.at.y).toBeGreaterThanOrEqual(CONTENT_TOP.one);
      expect(step.face.at.x + step.face.at.w).toBeLessThanOrEqual(1824);
      expect(step.face.at.y + step.face.at.h).toBeLessThanOrEqual(1000);
    }
  });
});

describe("slide 35: step one", () => {
  const { card, copy, catalog, mark } = STEP_ONE;

  it("names the card and its fields from the click's words, the step's label over the title aside", () => {
    expect(card.name.text).toBe("Your project");
    expect(card.fields.map((field) => field.text)).toEqual(["What it does", "What it took", "Contact"]);
  });

  it("fills the project card in a field at a time, each field's writing after its name", () => {
    let last = -1;
    for (const field of card.fields) {
      const comes = only(movesOf("step-one.play", field.key));
      const writes = only(movesOf("step-one.play", field.bar.key, "--k"));
      expect(comes.at, field.key).toBeGreaterThan(last);
      expect(writes.at, field.bar.key).toBeGreaterThan(comes.at);
      last = endOf(writes);
    }
  });

  it("slides the card's copy out to the empty slot once the card is filled, holds it there for the person's mark, then drops it in with the mark", () => {
    const [hover, lands] = movesOf("step-one.play", copy.key, "x");
    const written = Math.max(...card.fields.map((field) => endOf(only(movesOf("step-one.play", field.bar.key)))));
    expect(hover.on).toMatchObject(copy.hover);
    expect(hover.at).toBeGreaterThanOrEqual(written);
    const approved = only(movesOf("step-one.play", mark.key, "--d"));
    expect(approved.at).toBeGreaterThanOrEqual(endOf(hover));
    expect(lands.on).toMatchObject(copy.lands);
    expect(lands.at).toBeGreaterThanOrEqual(endOf(approved));
    expect(only(movesOf("step-one.play", mark.key, "y")).at).toBeCloseTo(lands.at, 5);
    // It starts behind the card, which is set over it, so it slides out from under it.
    expect(copy.at.x).toBeGreaterThanOrEqual(card.at.x);
    expect(copy.at.x + copy.at.w).toBeLessThanOrEqual(card.at.x + card.at.w);
    expect(markup.indexOf(`data-build="${copy.key}"`)).toBeLessThan(markup.indexOf(`data-build="${card.key}"`));
  });

  it("ends with the filled card on the left and its copy in the slot as an entry: the slot gone, the catalog's edge on, the mark inside its edge", () => {
    const end = endState("step-one.play");
    expect(end[copy.key]).toMatchObject({ autoAlpha: 1, ...copy.lands });
    expect(end[catalog.slot.key]).toMatchObject({ autoAlpha: 0 });
    expect(end[copy.edge]).toMatchObject({ autoAlpha: 1 });
    expect(end[mark.key]).toMatchObject({ autoAlpha: 1, "--d": 1, y: mark.drop });
    for (const key of [catalog.key, ...catalog.entries.map((entry) => entry.key), card.key, ...card.fields.map((field) => field.key)]) expect(showsAtEnd("step-one.play", key), key).toBe(true);
    // Landed, the copy is the slot exactly.
    const slot = catalog.slot.at;
    expect({ x: copy.at.x + copy.lands.x, y: copy.at.y + copy.lands.y, w: copy.at.w, h: copy.at.h }).toEqual(slot);
    // The mark (a 24 px ring, 3.5 px stroke) lands well inside the entry's edge.
    const ring = 24 + 2;
    const at = { x: mark.at.x, y: mark.at.y + mark.drop };
    expect(at.x - ring).toBeGreaterThanOrEqual(slot.x + 12);
    expect(at.x + ring).toBeLessThanOrEqual(slot.x + slot.w - 12);
    expect(at.y - ring).toBeGreaterThanOrEqual(slot.y + 12);
    expect(at.y + ring).toBeLessThanOrEqual(slot.y + slot.h - 12);
    // The card fills the left of the stage and the catalog the rest: no empty third.
    expect(card.at.x).toBe(96);
    expect(catalog.at.x - (card.at.x + card.at.w)).toBeLessThanOrEqual(64);
    expect(catalog.at.x + catalog.at.w).toBe(1824);
  });

  it("draws the catalog's cards without a word on them, the slot in the catalog's colour", () => {
    for (const entry of [...catalog.above, ...catalog.entries]) {
      const at = markup.indexOf(`data-build="${entry.key}"`);
      const body = markup.slice(at, markup.indexOf("</g>", at));
      expect(body, entry.key).not.toMatch(/<text/);
    }
    expect(markup).toMatch(new RegExp(`class="st-slot" data-build="${catalog.slot.key}"`));
    expect(catalog.at.x + catalog.at.w).toBeLessThanOrEqual(1824);
    expect(catalog.at.y + catalog.at.h).toBeLessThanOrEqual(1000);
  });
});

describe("slide 36: training", () => {
  const { seats, bracket, label } = TRAINING;

  it("opens a laptop in front of each person in turn, each with an AI coding tool and GitHub's mark on its screen", () => {
    const opens = seats.map(({ laptop }) => {
      const shows = only(movesOf("training.play", laptop.key, "autoAlpha"));
      const open = only(movesOf("training.play", laptop.lid, "--k"));
      expect(open.at, laptop.lid).toBeGreaterThanOrEqual(shows.at);
      expect(endState("training.play")[laptop.lid], laptop.lid).toMatchObject({ "--k": 1 });
      const at = markup.indexOf(`data-build="${laptop.lid}"`);
      expect(markup.slice(at, markup.indexOf("</g>", markup.indexOf("st-laptop__caret", at))), laptop.lid).toMatch(/st-github/);
      return open.at;
    });
    opens.slice(1).forEach((at, i) => expect(at - opens[i]).toBeGreaterThanOrEqual(0.5));
  });

  it("puts one label under all three once the last laptop is open: Trained on AI coding tools and GitHub", () => {
    expect(label.text).toBe("Trained on AI coding tools and GitHub");
    expect(text).toContain(label.text);
    const lastOpen = endOf(only(movesOf("training.play", seats[seats.length - 1].laptop.lid)));
    expect(only(movesOf("training.play", label.key)).at).toBeGreaterThanOrEqual(lastOpen - 0.5);
    expect(bracket.x0).toBeLessThanOrEqual(seats[0].laptop.base.x);
    expect(bracket.x1).toBeGreaterThanOrEqual(seats[2].laptop.base.x + seats[2].laptop.base.w);
    expect(showsAtEnd("training.play", label.key)).toBe(true);
    expect(markup).not.toMatch(/training\.room/);
  });
});

describe("slide 36a: GitHub", () => {
  const { request, space } = GITHUB_SETUP;
  const inside = (inner: { x: number; y: number; w: number; h: number }, outer: { x: number; y: number; w: number; h: number }, pad = 12) =>
    inner.x >= outer.x + pad && inner.y >= outer.y + pad && inner.x + inner.w <= outer.x + outer.w - pad && inner.y + inner.h <= outer.y + outer.h - pad;
  const githubMarks = () => {
    const at = markup.indexOf(`data-build="github.marks"`);
    return markup.slice(at, markup.indexOf(`data-build="tools.marks"`));
  };

  it("asks IT in one card: the three pieces listed on it, then a person from IT gives it their mark, inside its edge", () => {
    expect(request.items.map((item) => item.text)).toEqual(["organization account", "accounts for your staff", "permission to create projects"]);
    for (const item of request.items) {
      expect(text).toContain(item.text);
      expect(inside(item.at, request.at), item.key).toBe(true);
      expect(showsAtEnd("github.play", item.key), item.key).toBe(true);
    }
    const listed = Math.max(...request.items.map((item) => endOf(only(movesOf("github.play", item.key)))));
    const approves = only(movesOf("github.play", request.mark.key, "--d"));
    expect(approves.at).toBeGreaterThanOrEqual(listed - 1e-9);
    expect(inside({ x: request.mark.at.x - 26, y: request.mark.at.y - 26, w: 52, h: 52 }, request.at)).toBe(true);
    expect(inside(request.person.at, request.at)).toBe(true);
    expect(showsAtEnd("github.play", request.mark.key)).toBe(true);
  });

  it("draws your department's GitHub space once IT has approved: GitHub's mark, its name, your staff's accounts and a project keeping the history inside it", () => {
    const approved = endOf(only(movesOf("github.play", request.mark.key, "--d")));
    expect(only(movesOf("github.play", space.key)).at).toBeGreaterThanOrEqual(approved - 1e-9);
    expect(space.label.text).toBe("Your department");
    expect(space.project.name).toBe("History of every change and approval");
    expect(githubMarks()).toMatch(/st-github/);
    for (const account of space.staff) expect(inside(account.at, space.at), account.key).toBe(true);
    expect(inside(space.project.at, space.at)).toBe(true);
    for (const row of space.project.rows) expect(inside(row.at, space.project.at, 0), row.key).toBe(true);
    for (const key of [space.key, space.label.key, space.logo.key, space.project.key, ...space.staff.map((account) => account.key), ...space.project.rows.map((row) => row.key)]) expect(showsAtEnd("github.play", key), key).toBe(true);
    // The space and the card fill the stage between them.
    expect(request.at.x).toBe(96);
    expect(space.at.x + space.at.w).toBe(1824);
    expect(space.at.x - (request.at.x + request.at.w)).toBeLessThanOrEqual(80);
    expect(space.at.y).toBeLessThanOrEqual(request.at.y + 24);
  });

  it("heads the card Request to IT and names the person who approves it IT, both inside the card and up at the end", () => {
    const { header, label } = request;
    expect(header.text).toBe("Request to IT");
    expect(label.text).toBe("IT");
    for (const words of [header, label]) {
      expect(text).toContain(words.text);
      expect(showsAtEnd("github.play", words.key), words.key).toBe(true);
    }
    expect(inside(header.at, request.at)).toBe(true);
    // The header sits over the three pieces, and the name between the person and their mark.
    expect(header.at.y + header.at.h).toBeLessThanOrEqual(Math.min(...request.items.map((item) => item.at.y)));
    expect(label.at.x).toBeGreaterThan(request.person.at.x + request.person.at.w);
    expect(label.at.x + 40).toBeLessThan(request.mark.at.x - 24);
    expect(Math.abs(label.at.y - (request.person.at.y + request.person.at.h / 2))).toBeLessThanOrEqual(2);
  });

  it("records in the history each passed check with the deep-green tick and each approval with the approval mark, landing after its row", () => {
    const { rows } = space.project;
    expect(rows.map((row) => row.kind)).toEqual(["check", "approval", "check", "approval"]);
    for (const row of rows) {
      const at = markup.indexOf(`data-build="${row.key}"`);
      const drawn = markup.slice(at, markup.indexOf(`data-build="${rows[rows.indexOf(row) + 1]?.key ?? "tools.marks"}"`));
      expect(drawn, row.key).not.toMatch(/st-account/);
      if (row.kind === "check") expect(drawn, row.key).toMatch(/class="dk-pass-tick"/);
      else {
        expect(drawn, row.key).toMatch(new RegExp(`class="dk-human" data-build="${row.key}.mark"`));
        const lands = only(movesOf("github.play", `${row.key}.mark`, "--d"));
        expect(lands.at, row.key).toBeGreaterThanOrEqual(endOf(only(movesOf("github.play", row.key))) - 0.2);
        expect(endState("github.play")[`${row.key}.mark`], row.key).toMatchObject({ "--d": 1 });
      }
    }
  });

  it("repeats neither slide 13's line of approvals nor a stack of arrows: IT's mark, one small mark an approval in the history, no connector", () => {
    const marks = githubMarks();
    expect(marks.match(/class="dk-human"/g)).toHaveLength(1 + space.project.rows.filter((row) => row.kind === "approval").length);
    expect(marks).not.toMatch(/dk-connector/);
    expect(nodes.filter((node) => /^github\.(history|approval|piece)/.test(node.key))).toEqual([]);
  });
});
