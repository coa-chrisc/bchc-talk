/** Part 5's slides 30 to 33, one describe each: the agent pack, our source code, the design binders and the workshop. */
import { describe, expect, it, vi } from "vitest";
import { CONTENT_TOP, STORY } from "@/components/deck/kit";
import { shown } from "../../script/find";

// The stage imports its stylesheet; it does not matter to the markup under test.
vi.mock("./releasing.css", () => ({}));

const { RIGHT_EDGE, compiled, endOf, ends, hueOf, indexOf, markup, partPlays, propPlays, ruleOf, shownAt, startOf, stateAt, texts, visible } = await import("./test-support");
const { ARRIVALS, DWELL, PAGE_APART, PAGE_TRIP, RISE_APART } = await import("./world");
const { OWN, STORIES } = await import("./layout");
const { CONTENTS, FLAPS, LINK, PACK, PACK_NAME, TOOLS, flapTip } = await import("./layout-pack");
const { CARDS, CATALOG, SLOT, STACK, WAITING } = await import("./layout-source");
const { ACROSS, OURS, PAGES, YOURS } = await import("./layout-binders");
const { HELPER, HELPER_TURN, PLANNED, SEATS, TABLE } = await import("./layout-workshop");

describe("Part 5, slides 30 to 33", () => {
  describe("slide 30, the agent pack", () => {
    const step = "skills.play";
    const labels = shown("skills", "play");

    it("uses the script's eight labels: the package's name, its four contents and the three coding tools, in its order", () => {
      expect(labels).toHaveLength(8);
      expect(PACK_NAME).toBe(labels[0]);
      expect(CONTENTS.map((item) => item.text)).toEqual(labels.slice(1, 5));
      expect(TOOLS.map((tool) => tool.name.text)).toEqual(labels.slice(5, 8));
      for (const label of labels) expect(texts, label).toContain(label);
      // Each content is named on its card and again on the packing list.
      for (const item of CONTENTS) expect(texts.filter((text) => text === item.text), item.text).toHaveLength(2);
    });

    it("draws the package and the tools with line A, opens the flaps, raises the contents one at a time with line B, settles them back onto the packing list, closes the flaps, draws the line to the tools, then sends the copies along it", () => {
      const packDrawn = endOf(step, PACK.key);
      const opens = FLAPS.map((flap) => propPlays(step, flap.key, "--r").find((play) => play.on["--r"] === flap.open)!);
      const closes = FLAPS.map((flap) => propPlays(step, flap.key, "--r").find((play) => play.on["--r"] === 0)!);
      for (const flap of opens) expect(flap.at).toBeGreaterThanOrEqual(packDrawn);
      // Line A comes with the tools, before anything leaves the package.
      const lineA = startOf(step, STORIES.skills.keys[0]);
      for (const tool of TOOLS) expect(lineA).toBeLessThan(endOf(step, tool.key));
      expect(lineA).toBeLessThan(Math.min(...opens.map((play) => play.at)));
      const outs = CONTENTS.map((item) => propPlays(step, item.key, "--x").find((play) => play.on["--x"] === 0)!);
      const backs = CONTENTS.map((item) => propPlays(step, item.key, "--x").find((play) => play.on["--x"] === item.inside["--x"])!);
      for (const [i, out] of outs.entries()) {
        expect(out.at).toBeGreaterThanOrEqual(Math.max(...opens.map(ends)) - 1e-9);
        if (i > 0) expect(out.at - outs[i - 1].at).toBeCloseTo(RISE_APART, 9);
      }
      const allOut = Math.max(...outs.map(ends));
      // Line B names the contents as they come out.
      const lineB = startOf(step, STORIES.skills.keys[1]);
      expect(lineB).toBeGreaterThan(outs[0].at);
      expect(lineB).toBeLessThan(allOut);
      // Held in their row at least 1.2 s before the first goes back.
      expect(Math.min(...backs.map((play) => play.at)) - allOut).toBeGreaterThanOrEqual(1.2 - 1e-9);
      for (const [i, item] of CONTENTS.entries()) {
        const listed = propPlays(step, item.listed.key, "autoAlpha")[0];
        expect(listed.at, item.listed.key).toBeGreaterThan(backs[i].at);
        expect(listed.at, item.listed.key).toBeLessThan(ends(backs[i]));
      }
      const allBack = Math.max(...CONTENTS.map((item) => endOf(step, item.key)));
      for (const close of closes) expect(close.at).toBeGreaterThanOrEqual(allBack - 1e-9);
      expect(startOf(step, LINK.key)).toBeGreaterThanOrEqual(Math.max(...closes.map(ends)) - 1e-9);
      for (const tool of TOOLS) expect(startOf(step, tool.copy.key)).toBeGreaterThanOrEqual(endOf(step, LINK.key) - 1e-9);
    });

    it("ends on the shut package with its packing list, and a copy in each named tool", () => {
      const end = stateAt(step);
      expect(end[PACK.key]["--d"]).toBe(1);
      expect(end[PACK.name.key].autoAlpha).toBe(1);
      for (const flap of FLAPS) expect(end[flap.key]).toMatchObject({ "--d": 1, "--r": 0 });
      for (const item of CONTENTS) {
        expect(end[item.key]).toMatchObject({ ...item.inside, autoAlpha: 0 });
        expect(end[item.listed.key]).toMatchObject({ autoAlpha: 1, y: 0 });
      }
      for (const tool of TOOLS) {
        expect(end[tool.key]["--d"]).toBe(1);
        expect(end[tool.copy.key]).toMatchObject({ "--x": 0, "--y": 0, autoAlpha: 1 });
      }
      // The line from the package to the tools stays, so the end frame says where the pack goes.
      expect(end[LINK.key]["--d"]).toBe(1);
    });

    it("joins the package to each tool with one navy line, and each copy rides it out from behind the package's front to its place", () => {
      // One part, navy, drawing on; painted under the copies, which are painted under the package so each starts hidden behind its front.
      expect(markup.slice(indexOf(LINK.key)).match(/<path class="([^"]+)"/)?.[1]).toBe("bchc-line dk-draw");
      expect(indexOf(LINK.key)).toBeLessThan(Math.min(...TOOLS.map((tool) => indexOf(tool.copy.key))));
      for (const tool of TOOLS) expect(indexOf(tool.copy.key), tool.copy.key).toBeLessThan(indexOf(PACK.key));
      // Each copy enters its window over the window's frame, not under it.
      for (const tool of TOOLS) expect(indexOf(tool.key), tool.key).toBeLessThan(indexOf(tool.copy.key));
      expect(LINK.routes).toHaveLength(TOOLS.length);
      const trunk = LINK.routes[0][0];
      expect(trunk.x).toBe(PACK.at.x + PACK.at.w);
      expect(trunk.y).toBeGreaterThan(PACK.at.y + 24);
      expect(trunk.y).toBeLessThan(PACK.at.y + PACK.at.h - 24);
      /** Whether a point lies on a route of level and upright legs. */
      const onRoute = (route: readonly { x: number; y: number }[], p: { x: number; y: number }) =>
        route.slice(1).some((b, n) => {
          const a = route[n];
          return (a.x === b.x && p.x === a.x && p.y >= Math.min(a.y, b.y) && p.y <= Math.max(a.y, b.y)) || (a.y === b.y && p.y === a.y && p.x >= Math.min(a.x, b.x) && p.x <= Math.max(a.x, b.x));
        });
      for (const [i, tool] of TOOLS.entries()) {
        const route = LINK.routes[i];
        // Every branch leaves the one trunk at the package's side and ends at its copy's left side, at its middle, with square turns between.
        expect(route[0], tool.key).toEqual(trunk);
        expect(route.at(-1), tool.key).toEqual({ x: tool.copy.at.x, y: tool.copy.centre.y });
        for (const [n, b] of route.slice(1).entries()) expect(route[n].x === b.x || route[n].y === b.y, `${tool.key} leg ${n}`).toBe(true);
        // The branches split in the gap, clear of the package and of the windows.
        for (const p of route.slice(1, -1)) {
          expect(p.x, tool.key).toBeGreaterThan(PACK.at.x + PACK.at.w + 120);
          expect(p.x, tool.key).toBeLessThan(tool.at.x - 60);
        }
        // The copy starts wholly behind the package's front, level with the trunk.
        const { centre, at, start, legs } = tool.copy;
        const from = { x: centre.x + start["--x"], y: centre.y + start["--y"] };
        expect(from.y, tool.key).toBe(trunk.y);
        expect(from.x - at.w / 2, tool.key).toBeGreaterThanOrEqual(PACK.at.x);
        expect(from.x + at.w / 2, tool.key).toBeLessThanOrEqual(PACK.at.x + PACK.at.w - 4);
        expect(from.y - at.h / 2, tool.key).toBeGreaterThanOrEqual(PACK.at.y);
        expect(from.y + at.h / 2, tool.key).toBeLessThanOrEqual(PACK.at.y + PACK.at.h);
        // Each leg of its trip ends on its line (carried on to its middle), and the last ends in its place.
        const track = [from, ...route.slice(1), centre];
        for (const leg of legs) expect(onRoute(track, { x: centre.x + leg["--x"], y: centre.y + leg["--y"] }), `${tool.key} leg`).toBe(true);
        expect(legs.at(-1)).toMatchObject({ "--x": 0, "--y": 0 });
        // Played, it rides its legs in order, each starting as the one before lands.
        const plays = propPlays(step, tool.copy.key, "--x");
        expect(plays.map((play) => [play.on["--x"], play.on["--y"]])).toEqual(legs.map((leg) => [leg["--x"], leg["--y"]]));
        expect(compiled.states[0][tool.copy.key], tool.copy.key).toMatchObject({ ...start, autoAlpha: 0 });
        for (let n = 1; n < plays.length; n++) expect(plays[n].at, `${tool.key} leg ${n}`).toBeCloseTo(ends(plays[n - 1]), 9);
      }
    });

    it("keeps the agent pack in the process's colour, hides each content behind the package's front while it is inside, and keeps the open picture on the stage", () => {
      for (const key of [PACK.key, ...FLAPS.map((flap) => flap.key), ...CONTENTS.map((item) => item.key), ...TOOLS.map((tool) => tool.copy.key)]) expect(hueOf(key), key).toBe("share-pack");
      // The contents are painted before the package, so its opaque front covers them inside it.
      for (const item of CONTENTS) expect(indexOf(item.key), item.key).toBeLessThan(indexOf(PACK.key));
      for (const item of CONTENTS) {
        const x = item.at.x + item.inside["--x"];
        const y = item.at.y + item.inside["--y"];
        expect(x, item.key).toBeGreaterThanOrEqual(PACK.at.x);
        expect(x + item.at.w, item.key).toBeLessThanOrEqual(PACK.at.x + PACK.at.w);
        expect(y, item.key).toBeGreaterThanOrEqual(PACK.at.y);
        expect(y + item.at.h, item.key).toBeLessThanOrEqual(PACK.at.y + PACK.at.h);
      }
      // Out, the row is under the story band and over the open flaps, which stay on the stage.
      const rowFoot = Math.max(...CONTENTS.map((item) => item.at.y + item.at.h));
      for (const item of CONTENTS) expect(item.at.y).toBeGreaterThanOrEqual(CONTENT_TOP.two);
      // Each card holds its label with room either side: the label face runs about 13.5 px a letter ("Approval steps" measures 184 px at 1920 wide).
      for (const item of CONTENTS) expect(item.at.w, item.key).toBeGreaterThanOrEqual(item.text.length * 13.5 + 16);
      for (const item of CONTENTS) {
        expect(item.at.x, item.key).toBeGreaterThanOrEqual(96);
        expect(item.at.x + item.at.w, item.key).toBeLessThan(TOOLS[0].at.x);
      }
      for (const flap of FLAPS) {
        const tip = flapTip(flap);
        expect(tip.y, flap.key).toBeGreaterThan(rowFoot);
        expect(tip.x, flap.key).toBeGreaterThanOrEqual(96);
        expect(tip.x, flap.key).toBeLessThan(TOOLS[0].at.x);
      }
      // Passing upright as it opens, a flap stays under the story's first line, which is up by then; closing, it stays over none of the second line's letters (they start 8 px into its row).
      for (const flap of FLAPS) expect(flap.hinge.y - PACK.at.w / 2, flap.key).toBeGreaterThanOrEqual(STORY.top.two + STORY.pitch);
      for (const flap of FLAPS) expect(flap.hinge.y - PACK.at.w / 2, flap.key).toBeLessThanOrEqual(STORY.top.two + STORY.pitch + 8);
      // The end frame is balanced: the shut package (its flaps on top) and the stack of tools share their middle, so neither side leaves an empty corner over it.
      const packMiddle = (FLAPS[0].at.y + PACK.at.y + PACK.at.h) / 2;
      const toolsMiddle = (TOOLS[0].at.y + TOOLS.at(-1)!.at.y + TOOLS.at(-1)!.at.h) / 2;
      expect(Math.abs(packMiddle - toolsMiddle)).toBeLessThanOrEqual(1);
      expect(TOOLS[0].at.y - CONTENT_TOP.two).toBeLessThanOrEqual(120);
      // Each copy sits inside its tool's window, under the bar.
      for (const tool of TOOLS) {
        expect(tool.copy.at.y, tool.copy.key).toBeGreaterThanOrEqual(tool.bar + 8);
        expect(tool.copy.at.y + tool.copy.at.h, tool.copy.key).toBeLessThanOrEqual(tool.at.y + tool.at.h - 8);
      }
      // Each tool is named in its bar, inside the stage's margin.
      for (const tool of TOOLS) {
        expect(tool.name.at.y).toBeGreaterThan(tool.at.y);
        expect(tool.name.at.y).toBeLessThan(tool.bar);
        expect(tool.at.x + tool.at.w).toBeLessThanOrEqual(RIGHT_EDGE);
        expect(tool.at.y + tool.at.h).toBeLessThanOrEqual(STORY.foot);
      }
    });
  });

  describe("slide 31, our source code once it's cleared", () => {
    const step = "source.play";

    it("names the stack, its tag and the empty slot with the script's labels, in its order", () => {
      expect([STACK.name.text, WAITING.text, SLOT.text]).toEqual(shown("source", "play"));
      expect(shown("source", "play")).toEqual(["Austin source code", "Awaiting City of Austin approval", "New project"]);
      for (const text of shown("source", "play")) expect(texts, text).toContain(text);
    });

    it("draws the catalog's last row with its empty slot, brings the stack in beside it, and then puts up its tag with line A", () => {
      const slotOpen = endOf(step, SLOT.key);
      expect(startOf(step, SLOT.key)).toBeGreaterThanOrEqual(Math.max(...CARDS.map((card) => endOf(step, card.key))) - 1e-9);
      expect(startOf(step, STACK.key)).toBeGreaterThanOrEqual(slotOpen);
      expect(startOf(step, WAITING.key)).toBeGreaterThanOrEqual(endOf(step, STACK.key));
      expect(startOf(step, STORIES.source.keys[0])).toBeGreaterThan(startOf(step, WAITING.key));
      expect(startOf(step, STORIES.source.keys[1])).toBeGreaterThan(endOf(step, STORIES.source.keys[0]));
    });

    it("leaves the tiles waiting outside behind their tag at the end: nothing moves them in, and the tag never goes", () => {
      const end = stateAt(step);
      for (const key of [CATALOG.key, ...CARDS.map((card) => card.key), SLOT.key, STACK.key, STACK.name.key, WAITING.key]) expect(visible(end[key]), key).toBe(true);
      expect(end[STACK.key]).toMatchObject({ "--x": 0, autoAlpha: 1 });
      expect(end[WAITING.key]).toMatchObject({ "--wt": 0, "--wr": 0, "--wb": 0, "--wl": 0 });
      expect(propPlays(step, STACK.key, "--x").map((play) => play.on["--x"])).toEqual([0]);
      expect(partPlays(step, WAITING.key)).toHaveLength(1);
      expect(shownAt(step).sort()).toEqual([...OWN.source].sort());
    });

    it("draws the grid, with no still and no entry's words, the slot dashed in the catalog's colour, the stack's tiles too, and the tag soft", () => {
      expect(markup).not.toMatch(/<img|\.webp|catalog-end|catalog-grid/);
      expect(hueOf(CATALOG.key)).toBe("catalog");
      for (const card of CARDS) expect(hueOf(card.key), card.key).toBe("catalog");
      expect(markup).toContain(`data-build="${SLOT.key}" data-hue="share-code"`);
      expect(markup).toMatch(new RegExp(`data-build="${STACK.key}\\.tile\\.0" data-hue="share-code"`));
      expect(markup.slice(indexOf(WAITING.key))).toMatch(/^[^>]*>\s*<span class="dk-tag dk-dashed--soft"/);
      // The cards hold shapes, never words: the only words in the frame are the slot's.
      const grid = markup.slice(indexOf(CATALOG.key), indexOf(STACK.key));
      expect([...grid.matchAll(/>([^<]+)</g)].map((match) => match[1].trim()).filter(Boolean)).toEqual([]);
    });

    it("puts the slot in the row's last place, the size of a card, and the stack and tag right of the catalog, clear of it and inside the stage", () => {
      const last = CARDS.at(-1)!.at;
      expect(SLOT.at.y).toBe(last.y);
      expect(SLOT.at.w).toBe(last.w);
      expect(SLOT.at.h).toBe(last.h);
      expect(SLOT.at.x).toBeGreaterThan(last.x + last.w);
      expect(SLOT.at.x + SLOT.at.w).toBeLessThan(CATALOG.at.x + CATALOG.at.w);
      expect(SLOT.at.y + SLOT.at.h).toBeLessThan(CATALOG.at.y + CATALOG.at.h);
      expect(CATALOG.at.y).toBeGreaterThanOrEqual(CONTENT_TOP.two);
      expect(CATALOG.at.y + CATALOG.at.h).toBeLessThanOrEqual(STORY.foot);
      const right = CATALOG.at.x + CATALOG.at.w;
      for (const at of [STACK.at, WAITING.at]) {
        expect(at.x - right).toBeGreaterThanOrEqual(40);
        expect(at.x + at.w).toBeLessThanOrEqual(RIGHT_EDGE);
      }
      expect(STACK.name.at.y + STACK.name.at.h).toBeLessThanOrEqual(STACK.at.y);
      expect(WAITING.at.y).toBeGreaterThan(STACK.at.y + STACK.at.h);
    });
  });

  describe("slide 32, how to build your own design system and skills", () => {
    const step = "design-yours.play";

    it("names the two binders and the four tabs with the script's labels, in its order", () => {
      const labels = shown("design-yours", "play");
      expect([OURS.name.text, ...PAGES.map((page) => page.tab), YOURS.name.text]).toEqual(labels);
      for (const label of labels) expect(texts, label).toContain(label);
      // Each tab is on our page and on its copy.
      for (const page of PAGES) expect(texts.filter((text) => text === page.tab), page.tab).toHaveLength(2);
      expect(Object.values(OWN).flat().some((key) => /strip/.test(key))).toBe(false);
    });

    it("sends each page, one at a time once Yours is drawn, from our page to the same place in Yours, and fills it in where it lands", () => {
      const yoursDrawn = endOf(step, YOURS.key);
      expect(startOf(step, YOURS.key)).toBeGreaterThanOrEqual(Math.max(...PAGES.map((page) => endOf(step, page.ours.key))));
      for (const [i, page] of PAGES.entries()) {
        expect(page.yours.sheet.x - ACROSS).toBe(page.ours.sheet.x);
        expect(page.yours.sheet.y).toBe(page.ours.sheet.y);
        const trip = propPlays(step, page.yours.key, "--x")[0];
        expect(trip.at).toBeGreaterThanOrEqual(yoursDrawn);
        expect(trip.duration).toBe(PAGE_TRIP);
        if (i > 0) expect(trip.at - propPlays(step, PAGES[i - 1].yours.key, "--x")[0].at).toBeCloseTo(PAGE_APART, 9);
        expect(startOf(step, page.yours.fillKey)).toBeCloseTo(ends(trip), 9);
      }
      expect(startOf(step, STORIES["design-yours"].keys[1])).toBeGreaterThanOrEqual(Math.max(...PAGES.map((page) => endOf(step, page.yours.fillKey))));
    });

    it("ends on the two binders side by side, the same tabs in each, ours in our colors and yours filled in pink", () => {
      const end = stateAt(step);
      expect(shownAt(step).sort()).toEqual([...OWN["design-yours"]].sort());
      for (const page of PAGES) {
        expect(end[page.yours.key]).toMatchObject({ "--x": 0, "--y": 0, autoAlpha: 1 });
        expect(end[page.yours.fillKey]).toMatchObject({ "--d": 1, "--k": 1 });
        expect(hueOf(page.yours.fillKey), page.yours.fillKey).toBe("share-design");
      }
      expect(hueOf(OURS.key)).toBe("share-design");
      expect(hueOf(YOURS.key)).toBe("share-design");
      // Our brand page's swatches: navy, the process's green, the catalog's indigo and the pink.
      const brand = markup.slice(indexOf(PAGES[0].ours.key), indexOf(PAGES[1].ours.key));
      expect([...brand.matchAll(/<rect class="(rel-swatch|rel-ink-fill)"(?: data-hue="([^"]+)")?/g)].map(([, , hue]) => hue ?? "navy")).toEqual(["navy", "process", "catalog", "share-design"]);
      // Our pages are painted over the copies, so a copy slides out from under its page.
      for (const page of PAGES) expect(indexOf(page.ours.key)).toBeGreaterThan(Math.max(...PAGES.map((p) => indexOf(p.yours.fillKey))));
    });

    it("sets both binders under the two-line title's story band, side by side on the stage", () => {
      for (const binder of [OURS, YOURS]) {
        expect(binder.name.at.y).toBeGreaterThanOrEqual(CONTENT_TOP.two);
        expect(binder.at.y + binder.at.h).toBeLessThanOrEqual(STORY.foot);
        expect(binder.at.x).toBeGreaterThanOrEqual(96);
        expect(binder.at.x + binder.at.w).toBeLessThanOrEqual(RIGHT_EDGE);
      }
      expect(YOURS.at.x).toBeGreaterThan(OURS.at.x + OURS.at.w);
    });
  });

  describe("slide 33, help getting set up", () => {
    const step = "workshops.play";
    /** The seats in the order the helper reaches them: along the top, round the end, back along the foot. */
    const stops = [...SEATS.slice(0, 3).map((seat) => seat.helper), HELPER_TURN, ...SEATS.slice(3).map((seat) => seat.helper)];

    it("labels the helper \"Austin team\" and the tag \"Planned\", from the script", () => {
      expect([HELPER.text, PLANNED.text]).toEqual(shown("workshops", "play"));
      expect(HELPER.text).toBe("Austin team");
      expect(texts).toContain("Austin team");
      expect(texts).toContain("Planned");
    });

    it("sends the helper to each seat in turn, and has each seat's tool take shape, and its agent fill, as they arrive", () => {
      const hops = propPlays(step, HELPER.key, "--x");
      expect(hops.map((play) => [play.on["--x"], play.on["--y"]])).toEqual(stops.map((p) => [p.x - HELPER.start.x, p.y - HELPER.start.y]));
      const tourStart = hops[0].at;
      expect(tourStart).toBeGreaterThanOrEqual(endOf(step, TABLE.key));
      for (const [n, seat] of SEATS.entries()) {
        const stop = n < 3 ? n : n + 1;
        const arrive = ends(hops[stop]);
        expect(arrive).toBeCloseTo(tourStart + ARRIVALS[stop], 9);
        expect(startOf(step, seat.toolKey), seat.toolKey).toBeCloseTo(arrive, 9);
        expect(propPlays(step, seat.agentKey, "--k")[0].at, seat.agentKey).toBeCloseTo(arrive, 9);
        // They stay while it takes shape, then go on.
        if (stop + 1 < hops.length) expect(hops[stop + 1].at - arrive).toBeCloseTo(DWELL, 9);
      }
      // The person, laptop and agent at each seat are drawn before the helper sets off.
      for (const seat of SEATS) for (const key of [seat.key, seat.laptopKey]) expect(endOf(step, key), key).toBeLessThanOrEqual(tourStart);
      // Line B, about building a first project, comes during the tour; "Planned" after it.
      expect(startOf(step, STORIES.workshops.keys[1])).toBeGreaterThan(tourStart);
      expect(startOf(step, STORIES.workshops.keys[1])).toBeLessThan(ends(hops.at(-1)!));
      expect(startOf(step, PLANNED.key)).toBeGreaterThanOrEqual(Math.max(...SEATS.map((seat) => endOf(step, seat.toolKey))));
    });

    it("ends with a tool on every screen, every agent filled, the helper at the last seat with their name, and the Planned tag", () => {
      const end = stateAt(step);
      expect(shownAt(step).sort()).toEqual([...OWN.workshops].sort());
      for (const seat of SEATS) {
        expect(end[seat.toolKey]).toMatchObject({ "--d": 1, "--k": 1 });
        expect(end[seat.agentKey]).toMatchObject({ "--d": 1, "--k": 1 });
      }
      const last = HELPER.at(SEATS[5].helper, false);
      expect(end[HELPER.key]).toMatchObject({ ...last.helper, autoAlpha: 1 });
      expect(end[HELPER.nameKey]).toMatchObject({ ...last.name, autoAlpha: 1 });
      expect(end[PLANNED.key].autoAlpha).toBe(1);
    });

    it("draws the table and the helper in help's sky and the agents in the process's colour, and pins Planned as a small tag on the table's top right corner, clear of every seat", () => {
      expect(hueOf(TABLE.key)).toBe("share-help");
      expect(hueOf(HELPER.key)).toBe("share-help");
      for (const seat of SEATS) expect(markup, seat.agentKey).toContain(`data-build="${seat.agentKey}" data-role="process"`);
      expect(markup.slice(indexOf(PLANNED.key))).toMatch(/^[^>]*>\s*<span class="dk-tag dk-dashed--soft"/);
      expect(markup).toContain(`class="dk-block rel-planned" data-build="${PLANNED.key}"`);
      // A white ground under its dashes, so the table's edge does not run through its word.
      expect(ruleOf(".rel-planned .dk-tag rect")).toMatch(/fill:\s*var\(--dk-night\)/);
      // The outline's svg is positioned, so it would paint over the word: the tag holds its own stack and the svg sits under the word.
      expect(ruleOf(".rel-planned .dk-tag")).toMatch(/z-index:\s*0/);
      expect(ruleOf(".rel-planned .dk-tag svg")).toMatch(/z-index:\s*-1/);
      // Across the table's top edge, over its right end: on the picture, not beside it.
      const tag = PLANNED.at;
      const table = TABLE.at;
      expect(tag.y).toBeLessThan(table.y);
      expect(tag.y + tag.h).toBeGreaterThan(table.y);
      expect(tag.x).toBeLessThan(table.x + table.w);
      expect(tag.x + tag.w).toBeGreaterThan(table.x + table.w);
      expect(tag.x + tag.w).toBeLessThanOrEqual(RIGHT_EDGE);
      expect(tag.y).toBeGreaterThanOrEqual(CONTENT_TOP.one);
      // Clear of every seat's person, laptop and agent by at least 12 px.
      const apart = (a: { x: number; y: number; w: number; h: number }, b: { x: number; y: number; w: number; h: number }) =>
        Math.max(b.x - (a.x + a.w), a.x - (b.x + b.w), b.y - (a.y + a.h), a.y - (b.y + b.h));
      for (const seat of SEATS) {
        const agent = { x: seat.agent.at.x - seat.agent.r, y: seat.agent.at.y - seat.agent.r, w: 2 * seat.agent.r, h: 2 * seat.agent.r };
        for (const [name, at] of [["person", seat.person], ["screen", seat.screen], ["base", seat.base], ["agent", agent]] as const) expect(apart(tag, at), `${seat.key} ${name}`).toBeGreaterThanOrEqual(12);
      }
      // And of the helper and their name where the tour ends.
      const last = HELPER.at(SEATS[5].helper, false);
      const helper = { ...HELPER.person, x: HELPER.person.x + last.helper["--x"], y: HELPER.person.y + last.helper["--y"] };
      expect(apart(tag, helper)).toBeGreaterThanOrEqual(12);
    });

    it("keeps the helper's name off the table and inside the story's foot, and every seat's screen on the table", () => {
      for (const [n, seat] of SEATS.entries()) {
        const name = HELPER.name.y + HELPER.at(seat.helper, seat.top).name["--y"];
        if (seat.top) expect(name + 16, seat.key).toBeLessThan(TABLE.at.y);
        else expect(name - 16, seat.key).toBeGreaterThan(TABLE.at.y + TABLE.at.h);
        expect(name + 16, seat.key).toBeLessThanOrEqual(STORY.foot);
        expect(seat.top, seat.key).toBe(n < 3);
        expect(seat.screen.y).toBeGreaterThan(TABLE.at.y);
        expect(seat.screen.y + seat.screen.h + 12).toBeLessThan(TABLE.at.y + TABLE.at.h);
      }
      expect(HELPER.name.y - 16).toBeGreaterThanOrEqual(CONTENT_TOP.one);
    });
  });

});
