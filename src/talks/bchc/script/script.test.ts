import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { ADDRESS, PARTS, SCRIPT, WORLDS } from "./index";
import type { Picture } from "./index";

/**
 * The approved script (docs/bchc-talk-script.md), read from its document
 * the way a person reads it: the single source of every word on the stage
 * and in the notes. A part is a `## Part N. Name (about M minutes)` heading,
 * a picture a `### N. Name` heading under it (a closing "(new)" or "(two
 * clicks)" is the document's note, not the name). Its On screen line is the
 * title, and the bullets under it are the story lines, A then B, each with
 * its "(click N)" note taken off. Its They see is a paragraph or a numbered
 * list, then any bulleted list under it; an indented `Labels:` line lists
 * labels its clicks put on the stage, with " / " between them. `&amp;` is
 * the document's way of writing an ampersand.
 */
function approved() {
  const text = readFileSync(join(import.meta.dirname, "../../../../docs/bchc-talk-script.md"), "utf8").replace(/&amp;/g, "&");
  const parts: string[] = [];
  const pictures: { part: number; number: string; name: string; show?: string; say?: string; see: string[]; story: string[]; labels: string[] }[] = [];
  let part = 0;
  let field = "";
  for (const line of text.split("\n")) {
    const partHeading = line.match(/^## Part (\d)\. (.*) \(about \d+ minutes\)$/);
    if (line.startsWith("## ")) {
      part = partHeading ? Number(partHeading[1]) : 0;
      if (partHeading) parts.push(partHeading[2]);
      field = "";
    }
    const heading = line.match(/^### (\d+[a-z]?)\. (.*)$/);
    if (part && heading) {
      pictures.push({ part, number: heading[1], name: heading[2].replace(/ \((new|two clicks)\)$/, ""), see: [], story: [], labels: [] });
      field = "";
      continue;
    }
    const picture = pictures[pictures.length - 1];
    if (!part || !picture) continue;
    const opens = line.match(/^\*\*(On screen|You say|They see):\*\*\s*(.*)$/);
    const bullet = line.match(/^- (.*)$/);
    const click = line.match(/^\d+\. (.*)$/);
    const labels = line.match(/^\s+Labels: (.*)$/);
    if (opens) {
      field = opens[1];
      if (field === "On screen") picture.show = opens[2];
      else if (field === "You say") picture.say = opens[2];
      else if (opens[2]) picture.see.push(opens[2]);
    } else if (field === "On screen" && bullet) picture.story.push(bullet[1].replace(/ \*\(click \d\)\*$/, ""));
    else if (field === "They see" && (click || bullet)) picture.see.push((click ?? bullet)![1]);
    else if (field === "They see" && labels) picture.labels.push(...labels[1].split(" / "));
  }
  return { parts, pictures };
}
const SOURCE = approved();

/**
 * The pictures and their clicks, in the order shown (docs/bchc-talk-script.md):
 * one click a picture, `play`, but for slide 19, whose plan is approved on
 * one click and worked on the next, and slide 27, whose middle grows on one
 * click and whose lines are pulled in from the vendors on the next.
 */
const PLAN: [string, string[]][] = [
  ["title", ["play"]],
  ["the-catalog", ["play"]],
  ["find", ["play"]],
  ["entry", ["play"]],
  ["six-steps", ["play"]],
  ["review", ["play"]],
  ["nothing-to-run", ["play"]],
  ["three-days", ["play"]],
  ["proof", ["play"]],
  ["too-long", ["play"]],
  ["tools-gap", ["play"]],
  ["ai-builds", ["play"]],
  ["yours", ["play"]],
  ["rad", ["play"]],
  ["week", ["play"]],
  ["setup", ["play"]],
  ["design", ["play"]],
  ["modules", ["play"]],
  ["data", ["play"]],
  ["split", ["plan", "work"]],
  ["tested", ["play"]],
  ["reviewed", ["play"]],
  ["memory", ["play"]],
  ["scale", ["play"]],
  ["process", ["play"]],
  ["together", ["play"]],
  ["everyone", ["play"]],
  ["adapt", ["play"]],
  ["more", ["play"]],
  ["network", ["grow", "outside"]],
  ["releasing", ["play"]],
  ["skills", ["play"]],
  ["source", ["play"]],
  ["design-yours", ["play"]],
  ["workshops", ["play"]],
  ["spreads", ["play"]],
  ["three", ["play"]],
  ["step-one", ["play"]],
  ["training", ["play"]],
  ["github", ["play"]],
  ["tools", ["play"]],
  ["approver", ["play"]],
  ["safe", ["play"]],
  ["questions", ["play"]],
  ["fde", ["play"]],
  ["low-risk", ["play"]],
  ["examples", ["play"]],
  ["ramp", ["play"]],
  ["ask", ["play"]],
  ["thanks", ["play"]],
];
/** Which world each part is drawn in (section 2). */
const WORLD_OF_PART = ["catalog", "catalog", "build", "sharing", "releasing", "start", "close"];

const labels = SCRIPT.flatMap((picture) => picture.steps.flatMap((step) => step.show));
// Every string the audience reads or the presenter says.
const voicedIn = (picture: Picture) => [picture.show, picture.say, ...picture.story, ...picture.steps.flatMap((step) => step.show)];
const voiced = SCRIPT.flatMap(voicedIn);
// Those, plus the script's headings and its They see.
const everything = [...voiced, ...SCRIPT.flatMap((picture) => [picture.name, ...picture.see])];

/** Labels that are not a run of their picture's words: the catalog's address. */
const OFF_SCRIPT = [ADDRESS];

/**
 * Story lines allowed past 100 characters: the script's own, as draft 6
 * writes them. A line wider than the band (1728 px, about 105 characters at
 * 32 px) is broken onto two rows by its world (`breakAfter`).
 */
const LONG_STORY: [string, number][] = [
  ["review", 0],
  ["three-days", 0],
  ["proof", 0],
  ["proof", 1],
  ["yours", 1],
  ["tested", 1],
  ["adapt", 0],
  ["skills", 1],
  ["examples", 0],
];

/**
 * GitHub's own terms the script may name in a speaker's note, where the
 * presenter tells the story behind the catalog: slide 8's You say, as draft 6
 * writes it. Nothing on screen names them.
 */
const GITHUB_TERMS_SAID = ["nothing-to-run"];

const KEBAB = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const BANNED = /\b(leverag\w*|seamless\w*|delv\w*|tapestry|robust|game[- ]chang\w*|cutting[- ]edge|unlock\w*|empower\w*)\b/i;
const FORMAT_WORDS = /powerpoint|slide deck|slideshow/i;
const BRITISH = /\b(colour\w*|prioritis\w*|organis\w*|recognis\w*|licences?|modell\w+|centre\w*|catalogue\w*|whilst|towards)\b/i;
const TIRED = /\bjourney\w*|at the end of the day|\bsimply\b|!/i;
// A lone digit from 2 to 9. Digits inside larger numbers (27, 1,283) and list numbers ("2. ") are not lone.
const LONE_DIGIT = /(?<![\d,.])[2-9](?![\d,.])/;

describe("the talk's script", () => {
  it("is the approved script, word for word: every picture's heading, On screen, story lines, You say and They see", () => {
    expect(SOURCE.pictures).toHaveLength(50);
    expect(SCRIPT.map(({ part, number, name, show, story, say, see }) => ({ part, number, name, show, story, say, see }))).toEqual(
      SOURCE.pictures.map(({ part, number, name, show, story, say, see }) => ({ part, number, name, show, story, say, see })),
    );
  });

  it("names its parts as the script heads them", () => {
    expect(PARTS).toEqual(SOURCE.parts);
  });

  it("puts every label the script lists on its picture's clicks, in the script's order", () => {
    const listing = SOURCE.pictures.filter((picture) => picture.labels.length);
    expect(listing.length).toBeGreaterThan(0);
    for (const { number, labels } of listing) {
      const picture = SCRIPT.find((entry) => entry.number === number)!;
      const shown = picture.steps.flatMap((step) => step.show);
      expect(shown.filter((label) => labels.includes(label)).sort((a, b) => labels.indexOf(a) - labels.indexOf(b)), `slide ${number}`).toEqual(labels);
    }
  });

  it("uses the plan's picture ids and step ids, in the plan's order", () => {
    expect(SCRIPT.map((picture) => [picture.id, picture.steps.map((step) => step.id)])).toEqual(PLAN);
  });

  it("gives every picture a unique id in kebab case, since ids are used in the address", () => {
    const ids = SCRIPT.map((picture) => picture.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) expect(id).toMatch(KEBAB);
  });

  it("gives every step an id in kebab case that is unique within its picture", () => {
    for (const picture of SCRIPT) {
      const ids = picture.steps.map((step) => step.id);
      expect(new Set(ids).size, picture.id).toBe(ids.length);
      for (const id of ids) expect(id).toMatch(KEBAB);
    }
  });

  it("runs the parts in order and leaves none empty", () => {
    const parts = SCRIPT.map((picture) => picture.part);
    expect(parts).toEqual([...parts].sort((a, b) => a - b));
    expect([...new Set(parts)]).toEqual(PARTS.map((_, index) => index + 1));
  });

  it("sets every picture in its part's world, and every world holds a picture", () => {
    expect([...WORLDS]).toEqual([...new Set(WORLD_OF_PART)]);
    for (const picture of SCRIPT) expect(picture.world, picture.id).toBe(WORLD_OF_PART[picture.part - 1]);
  });

  it("gives every picture one click, and slides 19 and 27 two: 52 in all", () => {
    for (const picture of SCRIPT) expect(picture.steps.length, picture.id).toBe(["19", "27"].includes(picture.number) ? 2 : 1);
    expect(SCRIPT.flatMap((picture) => picture.steps)).toHaveLength(52);
  });

  it("leaves no string empty", () => {
    for (const text of everything) expect(text.trim()).not.toBe("");
  });

  it("uses no em or en dashes", () => {
    for (const text of everything) expect(text).not.toMatch(/[–—]/);
  });

  it("keeps the words we avoid out of what is shown and said", () => {
    for (const text of voiced) expect(text).not.toMatch(BANNED);
  });

  it("does not name the format before the last part", () => {
    for (const picture of SCRIPT.filter((picture) => picture.part < PARTS.length)) for (const text of voicedIn(picture)) expect(text, picture.id).not.toMatch(FORMAT_WORDS);
  });

  it("uses American spelling in what is shown and said", () => {
    for (const text of voiced) expect(text).not.toMatch(BRITISH);
  });

  it("keeps tired phrases and exclamation marks out of what is shown and said", () => {
    for (const text of voiced) expect(text).not.toMatch(TIRED);
  });

  it("spells out two to nine and uses numerals from 10, in what is shown and said", () => {
    // A calendar date keeps its numeral ("October 6"), and so does the numbered part of a step in draft 6's titles ("Step two, part 2:"); every other lone digit is spelled out.
    const withoutDates = (text: string) => text.replace(/\b(January|February|March|April|May|June|July|August|September|October|November|December) \d{1,2}\b/g, "").replace(/^Step (two|three), part \d:/, "");
    for (const text of voiced) expect(withoutDates(text)).not.toMatch(LONE_DIGIT);
    for (const text of voiced) expect(text).not.toMatch(/\b(ten|eleven|twelve|fifteen|twenty|thirty|forty|fifty)\b/i);
  });

  it("starts every On screen line with a capital letter", () => {
    for (const picture of SCRIPT) expect(picture.show, picture.id).toMatch(/^[A-Z]/);
  });

  it("names GitHub's own terms nowhere on screen, and in the notes only where the script tells the catalog's story", () => {
    for (const picture of SCRIPT) for (const text of voicedIn(picture)) if (text !== picture.say || !GITHUB_TERMS_SAID.includes(picture.id)) expect(text, picture.id).not.toMatch(/pull request|\bfork/i);
    for (const id of GITHUB_TERMS_SAID) expect(SCRIPT.find((picture) => picture.id === id)!.say).toMatch(/pull request/);
  });
});

describe("the words a click puts on screen", () => {
  it("are the picture's own words: its On screen line, You say or They see, case and a closing period aside", () => {
    const plain = (text: string) => text.toLowerCase().replace(/\.$/, "");
    for (const picture of SCRIPT) {
      const words = plain([picture.show, picture.say, ...picture.see].join(" "));
      for (const step of picture.steps) for (const label of step.show) if (!OFF_SCRIPT.includes(label)) expect(words, `${picture.id}.${step.id}`).toContain(plain(label));
    }
  });

  it("are short enough to read from the back of the room, with no stray spaces", () => {
    for (const text of labels) {
      expect(text.length, text).toBeLessThanOrEqual(60);
      expect(text).toBe(text.trim());
    }
  });

  it("give the six steps from form to live page in order, under a title of their own", () => {
    const six = SCRIPT.find((picture) => picture.id === "six-steps")!;
    expect(six.steps[0].show.slice(0, 6)).toEqual(["Form", "Request", "Draft", "Checks", "Approval", "Live"]);
    expect(six.show).not.toContain(six.steps[0].show.slice(0, 6).join(", "));
  });
});

describe("the story lines", () => {
  const listed = (list: [string, number][], id: string, i: number) => list.some(([p, n]) => p === id && n === i);

  it("give each picture none, one or two, with slide 44 the only one without", () => {
    for (const picture of SCRIPT) expect(picture.story.length, picture.id).toBeLessThanOrEqual(2);
    expect(SCRIPT.filter((picture) => picture.story.length === 0).map((picture) => picture.number)).toEqual(["44"]);
  });

  it("are sentences with no stray spaces", () => {
    for (const picture of SCRIPT)
      for (const line of picture.story) {
        expect(line, picture.id).toBe(line.trim());
        expect(line, picture.id).toMatch(/^[A-Z].*\.$/);
      }
  });

  it("each fit one line of 100 characters, but the script's longer ones", () => {
    for (const picture of SCRIPT) picture.story.forEach((line, i) => expect(line.length <= 100 || listed(LONG_STORY, picture.id, i), `${picture.id} ${line.length}`).toBe(true));
    for (const [id, i] of LONG_STORY) expect(SCRIPT.find((picture) => picture.id === id)!.story[i].length).toBeGreaterThan(100);
  });
});
