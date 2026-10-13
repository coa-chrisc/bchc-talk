/** Part 5's world (slides 29 to 33a): its steps, its timing and what it leaves on the stage, slide 29 in full, and its words and colours. Slides 30 to 33 are in world-slides.test.ts, and 33a in spreads.test.ts. */
import { readFileSync, readdirSync } from "node:fs";
import { describe, expect, it, vi } from "vitest";
import { CHAIN, HOME, STAGE, STORY } from "@/components/deck/kit";
import { VENDOR_COLOURS, strayTokens } from "@/components/deck/kit/palette";
import { storyOf } from "../../script/find";

// The stage imports its stylesheet; it does not matter to the markup under test.
vi.mock("./releasing.css", () => ({}));

const { HANDOVER, compiled, css, endOf, ends, hueOf, markup, pictures, propPlays, ruleOf, shownAt, startOf, stateAt, texts, visible, world } = await import("./test-support");
const { OWN, STORIES, TITLES } = await import("./layout");
const { landAt, pourAt } = await import("./world-sauce");
const sauce = await import("./layout-sauce");
const { BOTTLE_KEYS, BOTTLE_POINTS, DROPS, HOME: BOTTLE_HOME, LEVEL, MOUTH, PANELS, POURS, REST, SAUCE_OWN, SAUCE_PASSING, SHARE_HUES, TIP, onStage, poseVars } = sauce;

describe("Part 5, what we are sharing (slides 29 to 33a)", () => {
  it("has the script's steps in the script's order", () => {
    expect(world.steps.map((step) => step.id)).toEqual(pictures.flatMap((picture) => picture.steps.map((step) => `${picture.id}.${step.id}`)));
  });

  it("never moves the camera", () => {
    expect(compiled.cameras.every((camera) => camera === HOME)).toBe(true);
    expect(compiled.plays.flat().some((play) => "camera" in play)).toBe(false);
  });

  it("finishes every click inside 12 s from the click, the world's hand-over counted on its first", () => {
    for (const [i, plays] of compiled.plays.entries()) expect(Math.max(...plays.map(ends)) + (i === 0 ? HANDOVER : 0), world.steps[i].id).toBeLessThanOrEqual(CHAIN.longest);
  });

  it("names every part it moves as some slide's own", () => {
    const owned = new Set(Object.values(OWN).flat());
    expect(compiled.keys.filter((key) => !owned.has(key))).toEqual([]);
  });

  it("shows only the current slide's parts at every step, and starts with an empty stage", () => {
    expect(compiled.keys.filter((key) => visible(compiled.states[0][key]))).toEqual([]);
    for (const [i, step] of world.steps.entries()) {
      const pictureId = step.id.split(".")[0] as keyof typeof OWN;
      const own = new Set<string>(OWN[pictureId]);
      const shown = compiled.keys.filter((key) => visible(compiled.states[i + 1][key]));
      expect(
        shown.filter((key) => !own.has(key)),
        step.id,
      ).toEqual([]);
    }
  });

  it("ends slide 29 with the bottle, its label and what sauce is left, and all four panels up", () => {
    const passing = new Set(SAUCE_PASSING);
    expect(shownAt("releasing.play").sort()).toEqual(OWN.releasing.filter((key) => !passing.has(key)).sort());
  });

  it("brings each slide's story lines up in its own click, line A before line B, and leaves them up", () => {
    for (const picture of pictures) {
      const keys = STORIES[picture.id as keyof typeof STORIES].keys;
      expect(keys).toHaveLength(picture.story.length);
      const stepId = `${picture.id}.play`;
      for (const key of keys) expect(stateAt(stepId)[key].yPercent, key).toBe(0);
      if (keys.length === 2) expect(startOf(stepId, keys[0])).toBeLessThan(startOf(stepId, keys[1]));
    }
  });

  describe("slide 29, Austin's magic sauce", () => {
    const step = "releasing.play";
    const { bottle, line, cap, label, upright, tipped } = BOTTLE_KEYS;
    /** The bottle's lean plays, in time order. */
    const leans = () => propPlays(step, bottle, "--r").sort((a, b) => a.at - b.at);

    it("draws the bottle and fills it before the cap comes off, and has the cap gone before it tips", () => {
      const tipStart = Math.min(...propPlays(step, bottle, "--r").filter((play) => play.on["--r"] === TIP.pour).map((play) => play.at));
      expect(startOf(step, line)).toBeLessThan(startOf(step, upright));
      const filled = propPlays(step, upright, "--k").find((play) => play.on["--k"] === LEVEL.full)!;
      expect(ends(filled)).toBeLessThanOrEqual(Math.min(...propPlays(step, cap, "--tw").map((play) => play.at)));
      const capGone = propPlays(step, cap, "autoAlpha").find((play) => play.on.autoAlpha === 0)!;
      expect(ends(capGone)).toBeLessThanOrEqual(tipStart + 0.2);
      expect(startOf(step, label)).toBeLessThan(tipStart);
      expect(stateAt(step)[cap]).toMatchObject({ autoAlpha: 0 });
    });

    it("pours one drop over each panel's place in turn, 1.3 s apart, each leaving once the bottle is there and landing where its panel opens", () => {
      const glides = propPlays(step, bottle, "--x").sort((a, b) => a.at - b.at);
      for (const [i, drop] of DROPS.entries()) {
        // The bottle reaches this place before the drop leaves it.
        const there = glides.find((play) => play.on["--x"] === poseVars(POURS[i])["--x"])!;
        expect(there, `bottle over panel ${i}`).toBeDefined();
        const falls = propPlays(step, drop.key, "--y").find((play) => play.on["--y"] === drop.fall)!;
        expect(ends(there)).toBeLessThanOrEqual(falls.at);
        expect(falls.at).toBeCloseTo(pourAt(i) + 0.06, 9);
        // It lands at its panel's middle, and the panel opens there as it does.
        expect(drop.start.x).toBe(PANELS[i].centre.x);
        expect(drop.start.y + drop.fall).toBe(PANELS[i].centre.y);
        expect(ends(falls)).toBeCloseTo(landAt(i), 9);
        expect(startOf(step, PANELS[i].key)).toBeCloseTo(landAt(i), 9);
        for (const splash of drop.splash) expect(startOf(step, splash.key)).toBeCloseTo(landAt(i), 9);
        // Its heading and drawing follow the panel.
        expect(startOf(step, PANELS[i].headKey)).toBeGreaterThan(startOf(step, PANELS[i].key));
        expect(startOf(step, PANELS[i].artKey)).toBeGreaterThan(startOf(step, PANELS[i].key));
        if (i > 0) expect(falls.at - (pourAt(i - 1) + 0.06)).toBeCloseTo(1.3, 9);
        // Each panel has opened all the way before the next one starts.
        if (i > 0) expect(endOf(step, PANELS[i - 1].key)).toBeLessThanOrEqual(startOf(step, PANELS[i].key));
      }
      // The line says there are four parts before the first one lands.
      expect(startOf(step, STORIES.releasing.keys[0])).toBeLessThan(startOf(step, PANELS[0].key));
    });

    it("shakes once for each drop, a little further over and back, and drains the sauce drop by drop", () => {
      const shakes = leans().filter((play) => play.on["--r"] === TIP.pour + TIP.shake);
      expect(shakes.map((play) => play.at)).toEqual(DROPS.map((_, i) => pourAt(i)));
      const levels = propPlays(step, tipped, "--k").map((play) => Number(play.on["--k"]));
      expect(levels).toEqual([...LEVEL.tipped]);
      for (let i = 1; i < levels.length; i++) expect(levels[i]).toBeLessThan(levels[i - 1]);
      expect(LEVEL.left).toBeLessThan(LEVEL.full);
    });

    it("stands back up at the row's end with a wobble that settles, upright, with what is left standing in it", () => {
      const end = stateAt(step);
      expect(end[bottle]).toMatchObject({ ...poseVars(REST), autoAlpha: 1 });
      expect(end[upright]).toMatchObject({ autoAlpha: 1, "--k": LEVEL.left });
      expect(end[tipped].autoAlpha).toBe(0);
      const last = leans().slice(-4).map((play) => play.on["--r"]);
      expect(last).toEqual([...sauce.WOBBLE]);
      expect(Math.abs(Number(last[0])) + Math.abs(Number(last[1]))).toBeGreaterThan(0);
      for (const panel of PANELS) expect(end[panel.key]).toMatchObject({ autoAlpha: 1, "--sx": 1, "--sy": 1 });
    });

    it("keeps the bottle on the stage and under the story line while it pours, clear of every open panel, and settles beside the words, clear of the panels and the slide's chrome", () => {
      const bandFoot = STORY.top.one + STORY.pitch * STORIES.releasing.lines.length;
      const reach = (pose: { x: number; y: number; r: number }) => BOTTLE_POINTS.map((point) => onStage(point, pose));
      // Upright at home and tipped over each place (shaken too), it is on the stage and under the story line.
      for (const pose of [BOTTLE_HOME, ...POURS, ...POURS.map((pose) => ({ ...pose, r: TIP.pour + TIP.shake }))]) {
        for (const at of reach(pose)) {
          expect(at.x, JSON.stringify(pose)).toBeGreaterThanOrEqual(0);
          expect(at.x, JSON.stringify(pose)).toBeLessThanOrEqual(STAGE.w);
          expect(at.y, JSON.stringify(pose)).toBeGreaterThanOrEqual(bandFoot);
          expect(at.y, JSON.stringify(pose)).toBeLessThanOrEqual(STAGE.h);
        }
      }
      for (const [i, pose] of POURS.entries()) {
        // Pouring, the mouth is straight above where its drop lands.
        expect(onStage(MOUTH, pose).x).toBeCloseTo(PANELS[i].centre.x, 9);
        expect(onStage(MOUTH, pose).y).toBeLessThan(DROPS[i].start.y + DROPS[i].fall);
        // Its body hangs right, over places still to open: every point is right of the panels already open, and of the left half of the place it pours on.
        for (const shake of [0, TIP.shake]) {
          const left = Math.min(...reach({ ...pose, r: pose.r + shake }).map((at) => at.x));
          if (i > 0) expect(left - (PANELS[i - 1].at.x + PANELS[i - 1].at.w), `pour ${i}`).toBeGreaterThanOrEqual(40);
          expect(left, `pour ${i}`).toBeGreaterThan(PANELS[i].at.x + PANELS[i].at.w / 2 - 40);
        }
      }
      // Gliding on from a place, it is past that panel before the panel's heading rises.
      for (let i = 0; i + 1 < PANELS.length; i++) {
        const glide = propPlays(step, bottle, "--x").find((play) => play.on["--x"] === poseVars(POURS[i + 1])["--x"])!;
        expect(ends(glide), `glide ${i + 1}`).toBeLessThanOrEqual(startOf(step, PANELS[i].headKey));
        expect(Math.min(...reach(POURS[i + 1]).map((at) => at.x))).toBeGreaterThan(PANELS[i].at.x + PANELS[i].at.w);
      }
      // Settled, it stands over the row's right end: right of the title and the story line, over the panels with room to spare, inside the stage's margin, and far above the footer and the slide number.
      const rest = reach(REST);
      const lastPanel = PANELS.at(-1)!.at;
      expect(Math.min(...rest.map((p) => p.x))).toBeGreaterThanOrEqual(sauce.WORDS_END_X + 24);
      expect(Math.max(...rest.map((p) => p.x))).toBe(lastPanel.x + lastPanel.w);
      expect(Math.max(...rest.map((p) => p.y))).toBe(lastPanel.y - 24);
      expect(Math.min(...rest.map((p) => p.y))).toBeGreaterThanOrEqual(64 + 24);
      expect(Math.max(...rest.map((p) => p.y))).toBeLessThanOrEqual(1016 - 24);
      // Standing up from the last place to there (sampled along the way), it rises to the words' height only right of them.
      for (let n = 0; n <= 20; n++) {
        const k = n / 20;
        const pose = { x: POURS[3].x + (REST.x - POURS[3].x) * k, y: POURS[3].y + (REST.y - POURS[3].y) * k, r: POURS[3].r * (1 - k) };
        for (const at of reach(pose)) {
          if (at.y < bandFoot) expect(at.x, `standing up, ${k}`).toBeGreaterThanOrEqual(sauce.WORDS_END_X);
          expect(at.x, `standing up, ${k}`).toBeLessThanOrEqual(STAGE.w);
        }
      }
    });

    it("keeps each panel's drawing out of sight until it draws: its --k fade sits inside the part, where the part's own opacity cannot override it", () => {
      for (const panel of PANELS) {
        // The part is shown and hidden by opacity like every slide's own part, which would beat a fade on the part itself.
        expect(compiled.states[0][panel.artKey]).toHaveProperty("autoAlpha");
        expect(compiled.states[0][panel.artKey]).toMatchObject({ "--k": 0, "--d": 0 });
        expect(markup).toMatch(new RegExp(`data-build="${panel.artKey.replace(/\./g, "\\.")}"[^>]*><g class="rel-panel-art__fade">`));
      }
      expect(ruleOf(".rel-panel-art__fade")).toMatch(/opacity:\s*var\(--k,\s*0\)/);
      expect(ruleOf(".rel-panel-art")).not.toMatch(/opacity/);
    });

    it("pours gold, and opens each panel in its part's colour: the agent pack the process's green, the source code the catalog's indigo, the design system pink, help sky", () => {
      expect(SHARE_HUES).toEqual(["share-pack", "share-code", "share-design", "share-help"]);
      for (const [i, panel] of PANELS.entries()) {
        expect(panel.hue).toBe(SHARE_HUES[i]);
        expect(hueOf(panel.key), panel.key).toBe(SHARE_HUES[i]);
      }
      for (const key of [upright, tipped, ...DROPS.flatMap((drop) => [drop.key, ...drop.splash.map((s) => s.key)])]) expect(hueOf(key), key).toBe("share-sauce");
      expect(SAUCE_OWN).toEqual(expect.arrayContaining(Object.values(BOTTLE_KEYS)));
    });
  });


  it("puts only the script's words on the stage, and every slide's On screen line", () => {
    const allowed = pictures.flatMap((picture) => [picture.show, ...picture.story, ...picture.steps.flatMap((step) => step.show)]);
    for (const text of texts) expect(allowed.some((words) => words.includes(text)), text).toBe(true);
    // Every slide sets its On screen line as the title, line by line, and slide 29's four panels carry its labels.
    for (const picture of pictures) {
      const title = TITLES[picture.id as keyof typeof TITLES];
      expect(title.lines.join(" ")).toBe(picture.show);
      for (const line of title.lines) expect(texts).toContain(line);
    }
    expect(TITLES.skills.lines).toEqual(["An agent pack for your AI coding tool.", "We're aiming for December 2026."]);
    const headings = pictures.find((p) => p.id === "releasing")!.steps.flatMap((step) => step.show);
    for (const [i, panel] of PANELS.entries()) {
      expect(panel.head.lines.join(" ")).toBe(headings[i]);
      for (const line of panel.head.lines) expect(texts).toContain(line);
    }
    // The bottle's label is the slide's name for it.
    expect(sauce.BOTTLE.labelLines.join(" ")).toBe(pictures[0].name);
    for (const line of sauce.BOTTLE.labelLines) expect(texts).toContain(line);
    // Slide 33 shares setup guides and offers a chat; it promises no workshops.
    expect(storyOf("workshops").join(" ")).not.toMatch(/workshop/i);
    expect(storyOf("workshops")[1]).toMatch(/happy to chat/);
  });

  it("never uses orange or the pass green: nobody approves anything on these slides and nothing is checked", () => {
    expect(css).not.toMatch(/--dk-human|--dk-pass/);
    expect(markup).not.toMatch(/dk-human|human-mark|dk-tick|#[0-9a-f]{3,6}\b/i);
  });

  it("keeps gold to fills: the sauce and its drops are solid, and gold never draws a line", () => {
    const sauceKeys = [BOTTLE_KEYS.upright, BOTTLE_KEYS.tipped, ...DROPS.flatMap((drop) => [drop.key, ...drop.splash.map((s) => s.key)])];
    for (const key of sauceKeys) expect(hueOf(key), key).toBe("share-sauce");
    // Every mark under the sauce's colour is a rel-sauce or rel-sauce-mark: solid, never an outline in its colour.
    const sauceMarks = [...markup.matchAll(/data-hue="share-sauce"[^>]*>([\s\S]*?)<\/g>/g)].flatMap((match) => [...match[1].matchAll(/class="([^"]+)"/g)].map(([, name]) => name));
    expect(sauceMarks.length).toBeGreaterThan(0);
    for (const name of sauceMarks) expect(name, name).toMatch(/^(rel-sauce( rel-sauce--(upright|pool))?|rel-sauce-mark|rel-drop|dk-move)$/);
    for (const selector of [".rel-sauce", ".rel-sauce-mark"]) {
      expect(ruleOf(selector), selector).toMatch(/fill:\s*var\(--hue\)/);
      expect(ruleOf(selector), selector).not.toMatch(/stroke:\s*var\(--hue\)/);
    }
  });

  it("paints otherwise only with the deck's tokens and the role aliases, and never a vendor's colour", () => {
    const sources = readdirSync(import.meta.dirname).filter((name) => /\.(tsx?|css)$/.test(name) && !name.endsWith(".test.ts"));
    for (const name of sources) {
      const source = readFileSync(new URL(`./${name}`, import.meta.url), "utf8");
      expect(strayTokens(source), name).toEqual([]);
      expect(source, name).not.toMatch(VENDOR_COLOURS);
    }
    expect(markup).not.toMatch(VENDOR_COLOURS);
  });
});
