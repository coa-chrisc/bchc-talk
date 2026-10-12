import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { CHAIN, HOME } from "@/components/deck/kit";
import { VENDOR_COLOURS, strayTokens } from "@/components/deck/kit/palette";
import { breakAfter, shown } from "../../script/find";
import { picturesOf } from "../steps";
import { CHECKER, RAD, TITLES } from "./layout";
import { BOARD_KEY } from "./layout-board";
import { SPECIMEN, TOTAL } from "./layout-library";
import { compiled, counts, landed, markup, on, storyKey, world } from "./probe";
import { COUNTS } from "./world";

const here = __dirname;
/** The world's arrival fade: its first step plays after it (engine/director.ts). */
const LEAVE = 0.6;

describe("the build world", () => {
  it("has a part on the stage for every id a step names", () => {
    expect(compiled.keys.filter((key) => !counts.has(key))).toEqual([]);
  });

  it("is one click a slide but two for slide 19, the plan and then the work: thirteen clicks in the script's order", () => {
    expect(world.steps.map((step) => step.id)).toEqual(picturesOf("build").flatMap((picture) => picture.steps.map((step) => `${picture.id}.${step.id}`)));
    expect(world.steps).toHaveLength(13);
  });

  it("finishes every click inside 12 s, counting the arrival fade on the first", () => {
    const late = compiled.plays.flatMap((plays, n) =>
      plays.flatMap((play) => {
        const done = landed(play) + (n === 0 ? LEAVE : 0);
        return done > CHAIN.longest + 1e-9 ? [`${world.steps[n].id} ${"key" in play ? play.key : "camera"} ends at ${done.toFixed(2)}`] : [];
      }),
    );
    expect(late).toEqual([]);
  });

  it("never leaves the stage still for more than 3 s inside a click (flow.test.ts, for this world alone)", () => {
    const stillest = compiled.plays.map((plays) => {
      let done = 0;
      let still = 0;
      for (const play of [...plays].sort((a, b) => a.at - b.at)) {
        still = Math.max(still, play.at - done);
        done = Math.max(done, landed(play));
      }
      return still;
    });
    for (const [n, still] of stillest.entries()) expect(still, world.steps[n].id).toBeLessThanOrEqual(CHAIN.still + 1e-9);
  });

  it("never moves the camera, so no title or story line moves: the board goes small and into the year by its own transform", () => {
    expect(compiled.plays.flatMap((plays, n) => (plays.some((play) => "camera" in play) ? [world.steps[n].id] : []))).toEqual([]);
    for (const camera of compiled.cameras) expect(camera).toEqual(HOME);
  });

  it("starts empty: everything a step brings on is off the stage before it, but the board's layer, whose parts each start off", () => {
    const [baseline] = compiled.states;
    for (const title of TITLES) expect(baseline[title.key], title.key).toMatchObject({ yPercent: 120 });
    const showing = compiled.keys.filter((key) => {
      const vars = baseline[key];
      const off = vars.autoAlpha === 0 || vars["--d"] === 0 || vars["--k"] === 0 || vars.yPercent === 120 || ["--wt", "--wr", "--wb", "--wl"].some((inset) => vars[inset] === 100);
      return !off;
    });
    expect(showing).toEqual([BOARD_KEY]);
  });

  it("knows how many elements carry each id a move staggers, the same as the scene draws", () => {
    for (const [key, n] of Object.entries(COUNTS)) expect(counts.get(key), key).toBe(n);
    const staggered = compiled.plays.flat().flatMap((play) => ("key" in play && play.stagger > 0 && (counts.get(play.key) ?? 1) > 1 ? [play.key] : []));
    expect(staggered.filter((key) => COUNTS[key] === undefined)).toEqual([]);
  });

  it("tells each story line once, and line B only after line A has landed", () => {
    for (const picture of picturesOf("build")) {
      const steps = picture.steps.map((step) => `${picture.id}.${step.id}`);
      const told = picture.story.map((_, n) =>
        steps.flatMap((id) =>
          on(id, storyKey(picture.id, n))
            .filter((play) => play.on.yPercent === 0)
            .map((play) => ({ id, play })),
        ),
      );
      expect(
        told.map((plays) => plays.length),
        picture.id,
      ).toEqual(picture.story.map(() => 1));
      if (told.length === 2 && told[0][0].id === told[1][0].id) expect(told[1][0].play.at, picture.id).toBeGreaterThanOrEqual(landed(told[0][0].play));
      if (told.length === 2) expect(steps.indexOf(told[1][0].id), picture.id).toBeGreaterThanOrEqual(steps.indexOf(told[0][0].id));
    }
  });

  it("keeps the number of parts moving at once bounded, so a slow browser keeps its frames", () => {
    const busiest = compiled.plays.map((plays) => {
      const times = plays.flatMap((play) => [play.at, play.at + 0.01]);
      return Math.max(
        0,
        ...times.map((t) => plays.filter((play) => "key" in play && play.at <= t && landed(play) > t).reduce((sum, play) => sum + ("key" in play ? (counts.get(play.key) ?? 1) : 1), 0)),
      );
    });
    for (const [n, most] of busiest.entries()) expect(most, world.steps[n].id).toBeLessThanOrEqual(60);
  });
});

describe("the build world's words", () => {
  const allowed = new Set([
    ...TITLES.flatMap((title) => title.lines),
    ...RAD.boxes.flatMap((box) => box.lines),
    ...CHECKER.lines,
    ...picturesOf("build").flatMap((picture) => picture.steps.flatMap((step) => shown(picture.id, step.id))),
    ...picturesOf("build").flatMap((picture) => picture.story.flatMap((line) => (typeof line === "string" ? [line] : line))),
    SPECIMEN,
    ...TOTAL.lines,
  ]);

  it("puts no word on the stage but the script's, and the type sample", () => {
    const text = markup
      .replace(/<[^>]+>/g, "\n")
      .split("\n")
      .map((run) => run.trim())
      .filter(Boolean)
      .map((run) => run.replaceAll("&#x27;", "'").replaceAll("&amp;", "&"));
    expect(text.filter((run) => !allowed.has(run))).toEqual([]);
  });

  it("breaks each step's name, the people who need the tool and the total between words, never inside one", () => {
    shown("rad", "play").forEach((name, i) => expect(RAD.boxes[i].lines.join(" ")).toBe(name));
    expect(CHECKER.lines.join(" ")).toBe(shown("week", "play")[7]);
    expect(TOTAL.lines.join(" ")).toBe(TOTAL.text);
    expect(breakAfter(TOTAL.text, "140")).toEqual(TOTAL.lines);
  });

  it("writes no word in its scene files: every word comes from the script", () => {
    for (const file of readdirSync(here).filter((name) => name.endsWith(".tsx"))) {
      const source = readFileSync(join(here, file), "utf8");
      expect(source.match(/>[^<>{}\n]*[A-Za-z][^<>{}\n]*</g), file).toBeNull();
    }
  });

  it("says over 140 modules and lead agents, never a count of lead agents", () => {
    const words = [...allowed].join(" ");
    expect(words).toContain("Over 140 tested modules");
    expect(words).not.toMatch(/\btwo lead agents\b|\b72 hours\b|\beight-hour\b/i);
  });
});

describe("the build world's colour and motion", () => {
  const css = readFileSync(join(here, "build.css"), "utf8");
  const rules = [...css.replace(/\/\*[\s\S]*?\*\//g, "").matchAll(/([^{}]+)\{([^{}]*)\}/g)].map(([, selector, body]) => [selector.trim(), body] as const);
  const sources = readdirSync(here)
    .filter((name) => /\.(tsx?|css)$/.test(name) && !name.endsWith(".test.ts"))
    .map((name) => [name, readFileSync(join(here, name), "utf8")] as const);

  it("uses orange only for a person approving and the deep pass green only for the passed tick", () => {
    const using = (token: string) => rules.filter(([, body]) => body.includes(token)).map(([selector]) => selector);
    expect(using("--dk-human").every((selector) => selector.startsWith(".bw-approves"))).toBe(true);
    expect(using("--dk-human").length).toBeGreaterThan(0);
    expect(using("--dk-pass")).toEqual([".bw-tick__badge"]);
    for (const [name, source] of sources) if (name !== "build.css") expect(/--dk-(human|pass)\b/.test(source), name).toBe(false);
  });

  it("paints only with the deck's tokens and the role aliases, never a hue by name or a vendor's colour, and draws no gradient or glow", () => {
    for (const [name, source] of sources) {
      expect(strayTokens(source), name).toEqual([]);
      expect(source, name).not.toMatch(VENDOR_COLOURS);
      expect(/gradient|drop-shadow|box-shadow|filter:|#[0-9a-f]{3,6}\b/i.test(source.replace(/\/\*[\s\S]*?\*\//g, "")), name).toBe(false);
    }
  });

  it("moves nothing on a clock or a transition, and animates no filter or layout property", () => {
    for (const [name, source] of sources) expect(/Math\.random|\bDate\b|setTimeout|setInterval|requestAnimationFrame|transition:|@keyframes|animation:/.test(source), name).toBe(false);
    const props = new Set(compiled.plays.flatMap((play) => play.flatMap((p) => ("key" in p ? Object.keys(p.on) : []))));
    const allowedProps = ["autoAlpha", "x", "y", "scale", "scaleY", "yPercent", "--d", "--k", "--solid", "--wt", "--wr", "--wb", "--wl"];
    expect([...props].filter((prop) => !allowedProps.includes(prop))).toEqual([]);
  });
});
