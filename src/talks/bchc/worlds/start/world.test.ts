/**
 * The start world as a whole: it compiles, its clicks stay inside the
 * house limits, its words are the script's, its colours are the kit's, each
 * slide shows only its own picture (and the path, where it is carried), and
 * every story line comes up. Each slide's own picture is pinned in
 * steps.test.ts (34 to 36a), two.test.ts (37 to 38b) and path.test.ts
 * (39 to 42).
 */
import { readdirSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { compile } from "@/components/deck/engine/compile";
import { CHAIN, storyKeys } from "@/components/deck/kit";
import { VENDOR_COLOURS, strayTokens } from "@/components/deck/kit/palette";
import { storyId } from "../steps";
import { compiled, endState, hiddenAt, longestStep, markup, movesOf, nodeOf, nodes, pictureOfKey, pictures, playsOf, steps, text } from "./harness";
import { kickerOf } from "./layout";
import { LOW_RISK } from "./layout-path";
import { APPROVER_SLIDE, TOOLS } from "./layout-two";
import { startEntry } from "./world";

/** What stays on the stage past its own slide: the path, drawn at 39, steps aside for 40's templates and comes back at 41; and a step label, over every slide of its run. */
function carried(key: string, step: string) {
  const [picture] = step.split(".");
  if (key.startsWith("path.")) return picture === "low-risk" || picture === "ramp";
  if (key.startsWith("kicker.")) return kickerOf(picture)?.key === key;
  return false;
}

describe("the start world", () => {
  it("compiles, with a starting value for everything a step moves", () => {
    expect(() => compile(startEntry.world)).not.toThrow();
  });

  it("finishes every click within 12 s", () => {
    const late = longestStep(compiled)
      .map((end, i) => ({ step: steps[i].id, end: Math.round(end * 100) / 100 }))
      .filter(({ end }) => end > CHAIN.longest);
    expect(late).toEqual([]);
  });

  it("moves only parts the stage has", () => {
    const onStage = new Set(nodes.map((node) => node.key));
    expect(compiled.keys.filter((key) => !onStage.has(key))).toEqual([]);
  });

  it("puts no words on the stage but the script's On screen lines, story lines and labels", () => {
    const allowed = pictures.flatMap((picture) => [picture.show, ...picture.story, ...picture.steps.flatMap((step) => step.show)]);
    expect(text.filter((words) => !allowed.some((line) => line.includes(words)))).toEqual([]);
  });

  it("uses no approving orange, no passing deep green, no literal colour and no provider colours", () => {
    const css = readFileSync(new URL("./start.css", import.meta.url), "utf8");
    expect(css).not.toMatch(/--dk-(human|pass)/);
    expect(css.match(/#[0-9a-f]{3,8}\b/gi) ?? []).toEqual([]);
    expect(css.match(/rgba?\([^)]*\)/g) ?? []).toEqual([]);
    for (const name of readdirSync(import.meta.dirname).filter((file) => /\.(tsx?|css)$/.test(file) && !file.endsWith(".test.ts"))) {
      const source = readFileSync(new URL(`./${name}`, import.meta.url), "utf8");
      expect(strayTokens(source), name).toEqual([]);
      expect(source, name).not.toMatch(VENDOR_COLOURS);
    }
  });

  it("sets every word in navy: no slate label or soft block, and Approved the one orange word", () => {
    // The kit's label face is slate; every label here takes the navy name class, or is set at the text size.
    const slate = [...markup.matchAll(/<text class="([^"]*)"/g)].map(([, classes]) => classes.split(" ")).filter((classes) => classes.includes("dk-label") && !classes.includes("st-name") && !classes.includes("dk-human__label"));
    expect(slate).toEqual([]);
    expect(markup).not.toMatch(/dk-block--(soft|label)/);
    const orange = [...markup.matchAll(/<text class="[^"]*dk-human__label[^"]*"[^>]*>([^<]+)</g)].map(([, words]) => words);
    expect(orange).toEqual([TOOLS.mark.label]);
  });

  it("shows only the slide's own picture at each click, and the path where it is carried", () => {
    const seen = steps.map((step, i) => {
      const state = compiled.states[i + 1];
      const own = step.id.split(".")[0];
      const strays = nodes.filter((node) => node.paints && pictureOfKey(node.key) !== own && !carried(node.key, step.id) && !hiddenAt(state, node)).map((node) => node.key);
      return { step: step.id, strays: [...new Set(strays)] };
    });
    expect(seen.filter(({ strays }) => strays.length)).toEqual([]);
  });

  it("keeps the path at 39, steps it aside for 40's templates, brings it back at 41, and leaves it at 42", () => {
    const path = nodes.filter((node) => node.key.startsWith("path."));
    expect(path.length).toBeGreaterThan(0);
    const hidden = (id: string) => path.filter((node) => hiddenAt(endState(id), node)).map((node) => node.key);
    const shown = (id: string) => path.filter((node) => !hiddenAt(endState(id), node)).map((node) => node.key);
    expect(hidden("low-risk.play")).toEqual([]);
    expect(shown("examples.play")).toEqual([]);
    expect(hidden("ramp.play")).toEqual([]);
    expect(shown("ask.play")).toEqual([]);
  });

  it("sets each slide's story lines on the stage and brings them up inside its click, B after A, both still up at the end", () => {
    const wrong = pictures.flatMap((picture) => {
      const id = `${picture.id}.play`;
      const keys = storyKeys(storyId(picture.id), picture.story.length);
      const tells = keys.map((key) => movesOf(id, key, "yPercent"));
      const problems: string[] = [];
      keys.forEach((key, i) => {
        if (!nodeOf(key)) problems.push(`${key} is not on the stage`);
        if (tells[i].length !== 1) problems.push(`${key} comes up ${tells[i].length} times`);
        else if (hiddenAt(endState(id), nodeOf(key))) problems.push(`${key} is hidden at the end`);
      });
      if (tells.length === 2 && tells[0].length && tells[1].length && tells[1][0].at <= tells[0][0].at) problems.push(`${picture.id}: B comes up before A`);
      return problems;
    });
    expect(wrong).toEqual([]);
  });

  it("gives every agent in Part 6 the process's colour, and fills its ring once it has arrived", () => {
    const agents = [...markup.matchAll(/<g class="dk-agent" data-build="([^"]+)"( data-role="([^"]+)")?/g)].map(([, key, , role]) => ({ key, role }));
    const drawn = [...TOOLS.agents, ...APPROVER_SLIDE.queue.map((card) => card.agent), LOW_RISK.agent].map((agent) => agent.key);
    expect(agents.map(({ key }) => key).sort()).toEqual(drawn.sort());
    expect(agents.filter(({ role }) => role !== "process").map(({ key }) => key)).toEqual([]);
    for (const { key } of agents) {
      const id = `${pictureOfKey(key)}.play`;
      const ring = movesOf(id, key, "--k");
      expect(ring.length, key).toBe(1);
      const arrives = playsOf(id).find((play) => play.key === key && ("autoAlpha" in play.on || "--d" in play.on));
      if (arrives) expect(ring[0].at, key).toBeGreaterThan(arrives.at);
    }
  });

  it("names no made-up department anywhere on the stage", () => {
    expect(markup).not.toMatch(/Harbor City|Practice Health/i);
  });
});
