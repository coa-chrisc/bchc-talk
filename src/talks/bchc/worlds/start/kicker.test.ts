/**
 * Part 6's step labels (slides 35 to 39): each title says the thing itself,
 * and which of the three steps a slide belongs to is a small label over the
 * title, at its left edge. The label comes up with the title and goes with
 * it, and a run of slides on the same step keeps one label, still, while
 * they hand the title on.
 */
import { describe, expect, it } from "vitest";
import { pictureOf } from "../../script/find";
import { endState, hiddenAt, markup, movesOf, nodeOf, only, pictures, text } from "./harness";
import { KICKER, KICKERS, TITLE, TITLES, TITLE_LINES, bandOf, kickerOf, titleKey } from "./layout";

/** The titles the owner approved for 35 to 39, and the label over each. */
const STEPS: Record<string, { label: string; title: string }> = {
  "step-one": { label: "Step one", title: "Post a project in the catalog." },
  training: { label: "Step two", title: "Send your people to training." },
  github: { label: "Step two", title: "Set up GitHub." },
  tools: { label: "Step two", title: "Request access to AI coding tools." },
  approver: { label: "Step two", title: "Decide who is responsible for approving changes." },
  "low-risk": { label: "Step three", title: "Start with low-risk projects that use public data and help residents right away." },
};

const play = (id: string) => `${id}.play`;
const after = (id: string) => pictures[pictures.findIndex((picture) => picture.id === id) + 1].id;
const titleOf = (id: string) => TITLES.find((title) => title.picture === id)!;

describe("Part 6's titles", () => {
  it("say the thing itself on 35 to 39: no step number in front of any title", () => {
    for (const [id, { title }] of Object.entries(STEPS)) expect(titleOf(id).lines.join(" "), id).toBe(title);
    for (const title of TITLES) expect(title.lines[0], title.picture).not.toMatch(/^Step /);
  });

  it("set 38's on one line, under which its story lines take the one-line band, and keep 39's on two", () => {
    expect(TITLE_LINES[titleKey("approver")]).toBe(1);
    expect(bandOf("approver")).toBe("one");
    expect(titleOf("low-risk").lines).toEqual(["Start with low-risk projects", "that use public data and help residents right away."]);
  });
});

describe("Part 6's step labels", () => {
  it("put the step's label over the titles of 35 to 39, and over no other slide's", () => {
    expect(Object.fromEntries(pictures.map((picture) => [picture.id, kickerOf(picture.id)?.text ?? null]))).toEqual({
      three: null,
      "step-one": "Step one",
      training: "Step two",
      github: "Step two",
      tools: "Step two",
      approver: "Step two",
      questions: null,
      fde: null,
      "low-risk": "Step three",
      examples: null,
      ramp: null,
      ask: null,
    });
  });

  it("read each label from the script: its click's first word, which its They see names as a small label over the title", () => {
    for (const [id, { label }] of Object.entries(STEPS)) {
      const picture = pictureOf(id);
      expect(picture.steps[0].show[0], id).toBe(label);
      expect(picture.see[0], id).toMatch(new RegExp(`^A small label "${label}" sits above the title\\. `));
      expect(text).toContain(label);
    }
    for (const picture of pictures.filter((entry) => !STEPS[entry.id])) expect(picture.see.join(" "), picture.id).not.toMatch(/sits above the title/);
  });

  it("share one label across the four step-two slides, which stays still while they hand the title on", () => {
    const two = kickerOf("training")!;
    expect(["github", "tools", "approver"].map((id) => kickerOf(id)!.key)).toEqual([two.key, two.key, two.key]);
    expect(KICKERS.map((kicker) => kicker.key)).toEqual(["kicker.step-one", "kicker.training", "kicker.low-risk"]);
    for (const id of ["github", "tools", "approver"]) {
      expect(movesOf(play(id), two.key), id).toEqual([]);
      expect(hiddenAt(endState(play(id)), nodeOf(two.key)), id).toBe(false);
    }
  });

  it("bring each label up with its title's first line, by the same move, and take it away when the title goes", () => {
    for (const kicker of KICKERS) {
      const [first] = kicker.pictures;
      const last = kicker.pictures[kicker.pictures.length - 1];
      const title = movesOf(play(first), titleKey(first), "yPercent")[0];
      const comes = only(movesOf(play(first), kicker.key, "yPercent"));
      expect({ at: comes.at, duration: comes.duration, ease: comes.ease, on: comes.on }, kicker.key).toEqual({ at: title.at, duration: title.duration, ease: title.ease, on: title.on });
      const next = after(last);
      const goes = only(movesOf(play(next), kicker.key));
      const titleGoes = only(movesOf(play(next), titleKey(last), "autoAlpha"));
      expect(goes.on, kicker.key).toEqual({ autoAlpha: 0 });
      expect({ at: goes.at, duration: goes.duration }, kicker.key).toEqual({ at: titleGoes.at, duration: titleGoes.duration });
    }
  });

  it("show at the end of each click only the slide's own label", () => {
    const showing = Object.fromEntries(pictures.map((picture) => [picture.id, KICKERS.filter((kicker) => !hiddenAt(endState(play(picture.id)), nodeOf(kicker.key))).map((kicker) => kicker.key)]));
    expect(showing).toEqual(Object.fromEntries(pictures.map((picture) => [picture.id, kickerOf(picture.id) ? [kickerOf(picture.id)!.key] : []])));
  });

  it("set each label at the title's left edge, a label's height and a gap over the title, in the label face and the words' navy", () => {
    expect(KICKER.x).toBe(TITLE.x);
    // A 26 px label on its 1.2 line, ending at least 12 px above the title's line box, so it sits with the title.
    expect(TITLE.y - (KICKER.y + 26 * 1.2)).toBeGreaterThanOrEqual(12);
    // Under the logo, which ends at 54.
    expect(KICKER.y).toBeGreaterThanOrEqual(64);
    expect(markup.match(/class="dk-set st-kicker"/g)).toHaveLength(KICKERS.length);
    for (const kicker of KICKERS) expect(nodeOf(kicker.key), kicker.key).not.toBeNull();
  });
});
