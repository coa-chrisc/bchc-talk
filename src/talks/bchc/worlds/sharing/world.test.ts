/**
 * Part 4 as a whole: its five slides in order, one at a time, every word
 * from the script, the house rules, and the story lines. Each slide's own
 * picture is tested in its own file (together, everyone, adapt, more and
 * network .test.ts); what they share is in harness.ts.
 */
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { HOME } from "@/components/deck/engine/camera";
import { CHAIN, storyKeys, storyRows } from "@/components/deck/kit";
import { VENDOR_COLOURS, strayTokens } from "@/components/deck/kit/palette";
import { withBase } from "@/lib/base-path";
import { stepId } from "../steps";
import { ARRIVE } from "./beats";
import { COUNTS, PICTURES, STORIES, SUBMIT_FORM, TITLES, groupOf, quoted, titleKey } from "./layout";
import { ADAPT } from "./layout-adapt";
import { MORE } from "./layout-more";
import { TOGETHER } from "./layout-together";
import { LEAVE, at, built, ends, firstStep, ids, lastStep, markup, n, playOf, playsAt, startOf, texts, world } from "./harness";
import { sharing } from "./world";

describe("the sharing world", () => {
  it("holds the script's five pictures of Part 4 in the order shown, every step in order, and slide 28 no more", () => {
    expect(PICTURES.map((picture) => picture.number)).toEqual(["23", "24", "25", "26", "27"]);
    expect(sharing.steps.map((step) => step.id)).toEqual(ids);
    const dir = import.meta.dirname;
    for (const file of readdirSync(dir).filter((name) => !name.endsWith(".test.ts"))) expect(readFileSync(join(dir, file), "utf8"), file).not.toMatch(/two-lines|TWO_LINES|twoLines/);
  });

  it("has in its scene every part a step names", () => {
    expect(world.keys.filter((key) => !built.includes(key))).toEqual([]);
  });

  it("moves every part in its scene, so none shows by default where no step put it", () => {
    const moved = new Set(world.keys);
    /** Shown by their parent: the last slide's picture, which nothing puts away, and a catalog picture's still, inside its frame. */
    const byParent = new Set([...Object.values(groupOf("network")), ...[TOGETHER.frame, ADAPT.frame, MORE.frame].map((frame) => `${frame.key}.strip`)]);
    expect([...new Set(built)].filter((key) => !moved.has(key) && !byParent.has(key))).toEqual([]);
  });

  it("gives every part one element, but a title's lines and a story line set on two rows", () => {
    const counted = (key: string) => built.filter((id) => id === key).length;
    expect([...new Set(built)].filter((key) => counted(key) !== (COUNTS[key] ?? 1))).toEqual([]);
  });

  it("keeps the camera at home at every step", () => {
    for (const camera of world.cameras) expect(camera).toEqual(HOME);
  });

  it.each(ids)("finishes %s inside 12 s, the first counting the world's arrival fade", (id) => {
    const longest = Math.max(...playsAt(id).map(ends));
    expect(longest + (n(id) === 0 ? LEAVE : 0)).toBeLessThanOrEqual(CHAIN.longest);
  });

  it("brings the first title up once the world's arrival fade is under way", () => {
    const [title] = playOf(firstStep("together"), titleKey("together"));
    expect(title.at).toBe(ARRIVE);
  });

  it("shows only the two catalog stills captured for this round", () => {
    const stills = new Set([...markup.matchAll(/src="([^"]+\.(?:webp|png|jpg))"/g)].map(([, src]) => src));
    expect([...stills].sort()).toEqual([withBase("/catalog-slots.v2.webp"), withBase("/submit-form-type.v2.webp")]);
  });
});

describe("one slide at a time", () => {
  it.each(PICTURES.slice(1).map((picture, i) => [picture.id, PICTURES[i].id]))("puts the whole picture before %s away at its first click, and changes the title", (id, before) => {
    const first = firstStep(id);
    for (const key of Object.values(groupOf(before))) {
      const [gone] = playOf(first, key);
      expect(gone, key).toMatchObject({ at: 0, on: { autoAlpha: 0 } });
      for (const later of ids.slice(n(first))) expect(at(later)[key].autoAlpha, `${key} at ${later}`).toBe(0);
    }
    expect(at(first)[titleKey(before)].autoAlpha).toBe(0);
    expect(at(first)[titleKey(id)].yPercent).toBe(0);
  });

  it("shows each slide's title from its first click to its last, and no other title", () => {
    for (const id of ids) {
      const showing = PICTURES.filter((picture) => {
        const state = at(id)[titleKey(picture.id)];
        return state.yPercent === 0 && state.autoAlpha !== 0;
      });
      expect(showing.map((picture) => picture.id), id).toEqual([id.split(".")[0]]);
    }
  });

  it("breaks the two long titles after the words the brief names, slide 24's over three lines", () => {
    const lines = (id: string) => TITLES.find((title) => title.picture === id)!.lines;
    expect(lines("together")).toHaveLength(2);
    expect(lines("together")[0].endsWith("tool,")).toBe(true);
    expect(lines("everyone")).toHaveLength(3);
    expect(lines("everyone")[1].endsWith("them,")).toBe(true);
    for (const title of TITLES.filter((entry) => !["together", "everyone"].includes(entry.picture))) expect(title.lines, title.picture).toHaveLength(1);
  });
});

describe("the words on the stage", () => {
  /** The form's question and the four choices circled on slide 26 are words in the form's own picture, not set on the stage (more.test.ts). */
  const inStill = new Set([MORE.question, ...Object.keys(SUBMIT_FORM.choices)]);
  const labels = PICTURES.flatMap((picture) => [picture.show, ...picture.steps.flatMap((step) => step.show)]);
  const stories = PICTURES.flatMap((picture) => picture.story);
  const allowed = [...labels, ...quoted("together"), ...stories];

  it("are each a title, a story line or a label the script gives this part", () => {
    for (const text of texts) expect(allowed.some((words) => words.includes(text)), text).toBe(true);
  });

  it("include every title, story line and label the script gives this part, but the words in the form's picture", () => {
    const shown = texts.join(" ");
    for (const words of [...labels.filter((label) => !inStill.has(label)), ...stories]) for (const word of words.split(" ")) expect(shown, words).toContain(word);
  });

  it("keep the words in the form's picture out of the stage's own text", () => {
    for (const words of inStill) expect(texts, words).not.toContain(words);
  });

  it("are typed only in the script: the scenes and the moves hold no string of their own", () => {
    const dir = import.meta.dirname;
    const files = readdirSync(dir).filter((file) => /^(scene.*\.tsx|beats\.ts|steps-.*\.ts)$/.test(file));
    expect(files.length).toBeGreaterThan(10);
    for (const file of files) {
      const source = readFileSync(join(dir, file), "utf8");
      for (const words of allowed) expect(source.includes(words), `${file}: ${words}`).toBe(false);
      // JSX text: anything set between a tag's end and the next tag that is not an expression.
      expect(source.match(/>[ \t]*[A-Za-z][^<>{}]*<\//g) ?? [], file).toEqual([]);
    }
  });
});

describe("the house rules", () => {
  const dir = import.meta.dirname;
  const sources = readdirSync(dir)
    .filter((file) => /\.(tsx?|css)$/.test(file) && !file.endsWith(".test.ts"))
    .map((file) => [file, readFileSync(join(dir, file), "utf8")] as const);

  it("uses orange only through the kit's human mark, and no deep pass green or provider colour", () => {
    for (const [file, source] of sources) expect(source, file).not.toMatch(/--dk-human|--dk-pass|--fr-|#f4642c|#1f573b/i);
    for (const [file, source] of sources) expect(source, file).not.toMatch(VENDOR_COLOURS);
  });

  it("paints otherwise only with the deck's tokens and the role aliases", () => {
    for (const [file, source] of sources) expect(strayTokens(source), file).toEqual([]);
  });

  it("moves nothing on a clock, a transition or chance, and repeats nothing", () => {
    for (const [file, source] of sources) expect(source, file).not.toMatch(/Math\.random|Date\b|setTimeout|setInterval|requestAnimationFrame|transition\s*:|animation\s*:|repeat|yoyo/);
  });

  it("draws no gradient and no glow", () => {
    for (const [file, source] of sources) expect(source, file).not.toMatch(/gradient|drop-shadow|box-shadow|filter\s*:/i);
  });

  it("keeps every module under 500 lines", () => {
    const all = readdirSync(dir).filter((file) => /\.(tsx?|css)$/.test(file));
    for (const file of all) expect(readFileSync(join(dir, file), "utf8").split("\n").length, file).toBeLessThan(500);
  });
});

describe("the story lines", () => {
  /** The click each line comes up in: slide 27's B waits for its second click, with what it describes. */
  const toldIn = (pictureId: string, line: number) => {
    const picture = PICTURES.find((entry) => entry.id === pictureId)!;
    return stepId(pictureId, picture.steps[Math.min(line, picture.steps.length - 1)].id);
  };

  it("are set once each, in the band under their title, one title line or two, a long line on two rows", () => {
    for (const band of STORIES) {
      expect(band.band, band.picture).toBe(["one", "two", "three"][TITLES.find((title) => title.picture === band.picture)!.lines.length - 1]);
      const rows = storyRows(band.band, band.lines.flat().length);
      let row = 0;
      storyKeys(band.id, band.lines.length).forEach((key, i) => {
        expect(built.filter((id) => id === key).length, key).toBe(band.lines[i].length);
        expect(markup, key).toContain(`top:${rows[row].y}px`);
        row += band.lines[i].length;
      });
      expect(band.lines.map((rows) => rows.join(" ")), band.picture).toEqual(PICTURES.find((picture) => picture.id === band.picture)!.story);
    }
  });

  it("set slide 25's first line on two rows, broken after \"(AWS),\"", () => {
    const adapt = STORIES.find((band) => band.picture === "adapt")!;
    expect(adapt.lines[0]).toHaveLength(2);
    expect(adapt.lines[0][0].endsWith("(AWS),")).toBe(true);
  });

  it("come up in their slide's click, A before B, and stay up to the slide's end", () => {
    for (const band of STORIES) {
      const [a, b] = storyKeys(band.id, band.lines.length);
      expect(playOf(toldIn(band.picture, 0), a), a).toHaveLength(1);
      expect(at(lastStep(band.picture))[a].yPercent, a).toBe(0);
      expect(b, band.picture).toBeDefined();
      expect(playOf(toldIn(band.picture, 1), b), b).toHaveLength(1);
      expect(at(lastStep(band.picture))[b].yPercent, b).toBe(0);
      if (toldIn(band.picture, 0) === toldIn(band.picture, 1)) expect(startOf(toldIn(band.picture, 1), b)).toBeGreaterThan(startOf(toldIn(band.picture, 0), a));
    }
  });

  it("hold slide 27's second line back for its second click", () => {
    const [, b] = storyKeys(STORIES.find((band) => band.picture === "network")!.id, 2);
    expect(at("network.grow")[b].yPercent).toBe(120);
    expect(at("network.outside")[b].yPercent).toBe(0);
  });

  it("go away with their slide's picture", () => {
    for (const band of STORIES.slice(0, -1)) {
      const { html } = groupOf(band.picture);
      expect(markup.indexOf(`data-build="${html}"`), band.picture).toBeLessThan(markup.indexOf(`data-build="${storyKeys(band.id, 1)[0]}"`));
      const next = PICTURES[PICTURES.findIndex((picture) => picture.id === band.picture) + 1];
      expect(at(firstStep(next.id))[html].autoAlpha, html).toBe(0);
    }
  });
});
