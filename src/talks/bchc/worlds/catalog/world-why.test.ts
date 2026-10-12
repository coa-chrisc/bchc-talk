/**
 * The catalog world's last chains, slides 10 to 12 with 11a (steps-why.ts):
 * the wireframe the agents build, the long road to a bought tool, the tools
 * gap, and the tool AI builds. The world's own suite is world.test.ts; both read the world
 * through harness.ts.
 */
import { describe, expect, it } from "vitest";
import { EASE, HOLD } from "@/components/deck/kit";
import { compiled, markup, moved, onStage, startOf, endOf, keyOf, stateAfter, timesOf } from "./harness";
import { AI_BUILDS, PROOF, TOO_LONG, TOOLS_GAP } from "./layout-why";

describe("the catalog world's chains, slides 10 to 12", () => {
  it("slide 10: the agents build the wireframe piece by piece, header, search and filters, cards, each agent's ring filling as its piece is built and a person's mark landing on it once built; then the catalog settles into it", () => {
    const plays = timesOf("proof");
    const { pieces, agents, still } = PROOF;
    /** When a piece's mark has landed: its plays before the catalog settles in (it fades after). */
    const landed = (key: string) => endOf(plays.filter((play) => play.at < startOf(plays, still.key)), key);
    expect(startOf(plays, pieces[0].key)).toBeGreaterThanOrEqual(endOf(plays, PROOF.wire.key) - 1e-9);
    pieces.forEach((piece, i) => {
      if (i > 0) expect(startOf(plays, piece.key), piece.key).toBeGreaterThanOrEqual(landed(pieces[i - 1].mark.key) - 1e-9);
      expect(Math.abs(moved(plays, agents[i].key, "--k")[0].at - startOf(plays, piece.key)), agents[i].key).toBeLessThanOrEqual(0.2);
      expect(startOf(plays, piece.mark.key), piece.mark.key).toBeGreaterThanOrEqual(endOf(plays, piece.key) - 1e-9);
    });
    expect(moved(plays, agents[0].key, "--k")).toHaveLength(1);
    expect(startOf(plays, still.key)).toBeGreaterThanOrEqual(landed(pieces.at(-1)!.mark.key) - 1e-9);
    expect(PROOF.names.map((name) => name.text)).toEqual(["People", "AI agents"]);
    expect(PROOF.labels.map((label) => label.text)).toEqual(["Our agentic process", "modules, design system, memory"]);
    const end = stateAfter("proof");
    for (const key of [PROOF.wire.key, still.key, PROOF.mark.key, ...pieces.map((piece) => piece.key), ...PROOF.people.map((p) => p.key), ...agents.map((a) => a.key), ...PROOF.names.map((n) => n.key), PROOF.rule.key, ...PROOF.labels.map((l) => l.key)]) expect(onStage(end, key), key).toBe(true);
    for (const piece of pieces) expect(onStage(end, piece.mark.key), piece.mark.key).toBe(false);
    expect(end[still.key].scale).toBe(1);
  });

  it("slide 11: the calendar turns a page at a time, each quote grows the dollar signs, the stamp leaves its \"No\" and lifts away, then a change request starts it again", () => {
    const plays = timesOf("too-long");
    const { pages, quotes, dollars, stamp, no, change, rowsPerQuote, request, calendar, months } = TOO_LONG;
    const turns = pages.map((page) => moved(plays, page.key, "--t")[0]);
    turns.slice(1).forEach((turn, i) => expect(turn.at, pages[i + 1].key).toBeGreaterThan(turns[i].at));
    pages.forEach((page, i) => expect(startOf(plays, page.strip.key), page.strip.key).toBeGreaterThan(turns[i].at));
    expect(turns[0].at).toBeGreaterThanOrEqual(endOf(plays, calendar.key) - 1e-9);
    const quoteAt = quotes.map((quote) => startOf(plays, quote.key));
    quotes.forEach((quote, i) => {
      for (const row of dollars.slice(i * rowsPerQuote, (i + 1) * rowsPerQuote)) expect(startOf(plays, row.key), row.key).toBeGreaterThan(quoteAt[i]);
      if (i > 0) expect(quoteAt[i], quote.key).toBeGreaterThan(quoteAt[i - 1]);
    });
    const [down, up] = moved(plays, stamp.key, "autoAlpha");
    expect([down.on.autoAlpha, up.on.autoAlpha]).toEqual([1, 0]);
    expect(startOf(plays, no.key)).toBeGreaterThanOrEqual(down.end - 1e-9);
    expect(up.at).toBeGreaterThanOrEqual(endOf(plays, no.key) - 1e-9);
    expect(down.at).toBeGreaterThanOrEqual(quoteAt[2]);
    // The change request comes after the "No", and the last quote and pages after it.
    const changed = startOf(plays, change.key);
    expect(changed).toBeGreaterThanOrEqual(up.end - 1e-9);
    expect(quoteAt[3]).toBeGreaterThan(changed);
    expect(turns.filter((turn) => turn.at > changed)).toHaveLength(3);
    const end = stateAfter("too-long");
    expect(onStage(end, stamp.key)).toBe(false);
    for (const key of [request.key, request.words.key, no.key, calendar.key, months.key, change.key, ...pages.map((page) => page.strip.key), ...quotes.map((q) => q.key), ...dollars.map((d) => d.key)]) expect(onStage(end, key), key).toBe(true);
    expect([request.words.text, months.text, quotes[0].text, no.text, change.text]).toEqual(["We need a tool", "Months or years", "New quote", "No", "Change request"]);
  });

  it("slide 11: each page names its month, Jan to Oct over the calendar's own Nov, and the pages turn faster as they go, one with each quote's dollar signs", () => {
    const plays = timesOf("too-long");
    const { pages, quotes, dollars, rowsPerQuote, calendar, months, change } = TOO_LONG;
    expect([...pages.map((page) => page.month), calendar.month.text]).toEqual(["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov"]);
    // Each page's month is drawn on its own page, over its days; the calendar's own face carries the last.
    const sheetThenMonth = (key: string, month: string) => new RegExp(`data-build="${key.replace(/\./g, "\\.")}"[^>]*><rect[^>]*>(</rect>)?<text[^>]*>${month}</text>`);
    for (const page of pages) expect(markup, page.key).toMatch(sheetThenMonth(page.key, page.month));
    expect(markup).toMatch(sheetThenMonth(calendar.key, calendar.month.text));
    expect(markup).toMatch(new RegExp(`<text[^>]*data-build="calendar\\.month"[^>]*>${calendar.month.text}</text>`));
    // The calendar's own month comes on with the pages that cover it, never before them.
    expect(startOf(plays, calendar.month.key)).toBeGreaterThanOrEqual(startOf(plays, pages[0].key));
    const turns = pages.map((page) => moved(plays, page.key, "--t")[0]);
    // Every turn is quicker than the one before it.
    turns.slice(1).forEach((turn, i) => expect(turn.duration, pages[i + 1].key).toBeLessThan(turns[i].duration));
    // Jan to Apr turn while the card waits, May to Jul with the first three quotes, Aug to Oct after the change request: the gaps between turns shrink through all three.
    const runs = [[0, 1, 2, 3], [4, 5, 6], [7, 8, 9]];
    const gaps = runs.flatMap((run) => run.slice(1).map((page, i) => turns[page].at - turns[run[i]].at));
    gaps.slice(1).forEach((gap, i) => expect(gap, `gap ${i + 1}`).toBeLessThan(gaps[i]));
    expect(startOf(plays, months.key)).toBeGreaterThanOrEqual(turns[3].end - 1e-9);
    expect(startOf(plays, quotes[0].key)).toBeGreaterThanOrEqual(turns[3].end - 1e-9);
    // A page turns as each quote's dollar signs start to rise: May, Jun and Jul with the first three, Aug with the change request's.
    quotes.forEach((quote, i) => expect(turns[4 + i].at, quote.key).toBeCloseTo(startOf(plays, dollars[i * rowsPerQuote].key), 9));
    const changed = startOf(plays, change.key);
    expect(turns.slice(7).every((turn) => turn.at > changed)).toBe(true);
    // At the end every page has turned and lies on the pile, and the face shows Nov.
    const end = stateAfter("too-long");
    for (const page of pages) {
      expect(end[page.key]["--t"], page.key).toBe(1);
      expect(onStage(end, page.strip.key), page.strip.key).toBe(true);
    }
    for (const key of [calendar.key, calendar.month.key]) expect(onStage(end, key), key).toBe(true);
  });

  it("slide 11a: once line A is up the AI badge slides in from the left and settles in the card, the price grows a row as it lands, the outlines come on after it, and line B comes up last", () => {
    const plays = timesOf("tools-gap");
    const { card, words, badge, price, wanted } = TOOLS_GAP;
    const [lineA, lineB] = ["a", "b"].map((line) => `story.tools-gap.${line}`);
    const up = (key: string) => moved(plays, key, "yPercent").find((play) => play.on.yPercent === 0)!;
    // The card, its words and the first row of its price come first, before line A.
    for (const key of [card.key, words.key, price[0].key]) expect(startOf(plays, key), key).toBeLessThan(up(lineA).at);
    // The badge travels once, from off to the left of the card into its place, after line A has landed.
    const slides = moved(plays, badge.key, "x");
    expect(slides).toHaveLength(1);
    expect([stateAfter("too-long")[badge.key].x, slides[0].on.x]).toEqual([badge.from, 0]);
    expect(slides[0].at).toBeGreaterThanOrEqual(up(lineA).end - 1e-9);
    const lands = slides[0].end;
    expect(startOf(plays, price[1].key)).toBeCloseTo(lands, 9);
    // The outlines wipe on one after another, each named as it comes, once the badge has landed.
    const wiped = wanted.map((tool) => moved(plays, tool.key, "--wr")[0]);
    wiped.forEach((wipe, i) => {
      expect(wipe.at, wanted[i].key).toBeGreaterThanOrEqual(lands - 1e-9);
      if (i > 0) expect(wipe.at, wanted[i].key).toBeGreaterThan(wiped[i - 1].at);
      expect(startOf(plays, wanted[i].name.key), wanted[i].name.key).toBeGreaterThan(wipe.at);
    });
    // Line B comes up last.
    expect(up(lineB).at).toBe(Math.max(...plays.map((play) => play.at)));
    expect(moved(plays, lineB, "yPercent")).toHaveLength(1);
    const end = stateAfter("tools-gap");
    for (const key of [card.key, words.key, badge.key, ...price.map((row) => row.key), ...wanted.flatMap((tool) => [tool.key, tool.name.key]), lineA, lineB]) expect(onStage(end, key), key).toBe(true);
    expect(end[badge.key].x).toBe(0);
    expect([words.text, badge.text, ...wanted.map((tool) => tool.name.text)]).toEqual(["A tool you already have", "AI", "Data pipeline", "Analysis tool", "Dashboard"]);
  });

  it("slide 11a: the badge fades in quickly on its own and is carried across on its own, so it is solid well before it reaches the card's edge", () => {
    const plays = timesOf("tools-gap");
    const { badge } = TOOLS_GAP;
    const fades = moved(plays, badge.key, "autoAlpha");
    const [slide] = moved(plays, badge.key, "x");
    expect(fades).toHaveLength(1);
    const [fade] = fades;
    expect([fade.on, slide.on]).toEqual([{ autoAlpha: 1 }, { x: 0 }]);
    expect([fade.ease, slide.ease]).toEqual([EASE.soft, EASE.carry]);
    expect([fade.at, fade.duration, slide.duration]).toEqual([slide.at, 0.25, 1.0]);
    // On the carry's slow start the badge has gone about a sixth of the way when the fade lands; its leading edge reaches the card about a ninth of the way, its trailing edge a third.
    expect(fade.end - slide.at).toBeLessThanOrEqual(slide.duration / 4);
  });

  it("slide 11a: the outlines are empty dashed outlines, the slide is all in grey, and it ends on its own parts alone", () => {
    const { card, badge, price, wanted } = TOOLS_GAP;
    // Each outline is the kit's dashed outline in soft, the card the grey outline, the badge a quote's grey outline, the price slide 11's grey dollar signs.
    for (const tool of wanted) expect(markup, tool.key).toMatch(new RegExp(`class="dk-dashed dk-dashed--soft dk-wipe" data-build="${tool.key.replace(/\./g, "\\.")}"[^>]*><svg[^>]*><rect[^>]*></rect></svg></div>`));
    // Their names are in soft, the tone slide 11 gives what is absent, so the outlines read as waiting, not as buttons.
    for (const { name } of wanted) expect(markup, name.key).toMatch(new RegExp(`class="dk-block [^"]*\\bdk-block--soft\\b[^"]*" data-build="${name.key.replace(/\./g, "\\.")}"`));
    expect(markup).toMatch(new RegExp(`data-build="${card.key}"><rect class="catalog-grey dk-draw"`));
    expect(markup).toMatch(new RegExp(`class="dk-block dk-block--center catalog-quote catalog-badge" data-build="${badge.key}"`));
    for (const row of price) expect(markup.match(new RegExp(`data-build="${row.key.replace(/\./g, "\\.")}">(.*?)</g>`))![1].match(/class="catalog-dollar"/g), row.key).toHaveLength(3);
    // At the end the card, its words, badge and price, and the outlines and their names are all that is on the stage.
    const end = stateAfter("tools-gap");
    const own = ["owned", "owned.words", "badge", "price.0", "price.1"];
    expect(own.every((key) => onStage(end, key))).toBe(true);
    expect(compiled.keys.filter((key) => onStage(end, key) && !own.includes(key) && !/^(wanted\.\d(\.name)?|title\.tools-gap|story\.tools-gap\.[ab])$/.test(key))).toEqual([]);
  });

  it("slide 12: the program staff describe the tool first, its modules' places dashed, then the agent fills each place with a tile, and the staff approve last", () => {
    const plays = timesOf("ai-builds");
    const { person, personName, describes, agent, tiles, mark } = AI_BUILDS;
    const places = tiles.map((tile) => tile.place.key);
    expect(startOf(plays, describes.key)).toBeGreaterThanOrEqual(startOf(plays, person.key));
    expect(startOf(plays, personName.key)).toBeGreaterThanOrEqual(startOf(plays, person.key));
    expect(Math.min(...places.map((key) => startOf(plays, key)))).toBeGreaterThanOrEqual(startOf(plays, describes.key));
    expect(startOf(plays, agent.key)).toBeGreaterThanOrEqual(Math.max(...places.map((key) => moved(plays, key, "--wl")[0]?.end ?? endOf(plays, key))) - 1e-9);
    tiles.forEach((tile) => {
      const lands = moved(plays, tile.key, "x")[0].end;
      expect(moved(plays, tile.place.key, "autoAlpha").at(-1)!.at, tile.place.key).toBeCloseTo(lands, 5);
    });
    expect(startOf(plays, mark.key)).toBeGreaterThanOrEqual(Math.max(...tiles.map((tile) => endOf(plays, tile.key))) - 1e-9);
    const end = stateAfter("ai-builds");
    for (const key of places) expect(onStage(end, key), key).toBe(false);
    for (const key of [person.key, personName.key, describes.key, agent.key, mark.key, ...tiles.map((tile) => tile.key)]) expect(onStage(end, key), key).toBe(true);
  });

  it("slide 12: the chatbot picture steps aside, small and set back with its words, as the bubble goes, and stays beside the new one", () => {
    const plays = timesOf("ai-builds");
    const { before, inside } = AI_BUILDS;
    expect(startOf(plays.filter((play) => play.at > 0), before.key)).toBeGreaterThanOrEqual(startOf(plays.filter((play) => play.at > 0 && keyOf(play) === AI_BUILDS.bubble.key && "on" in play && play.on.autoAlpha === 0), AI_BUILDS.bubble.key));
    const end = stateAfter("ai-builds");
    expect(onStage(end, AI_BUILDS.bubble.key)).toBe(false);
    for (const key of [before.key, inside.key]) {
      expect(onStage(end, key), key).toBe(true);
      expect(end[key].autoAlpha, key).toBe(before.faded);
    }
    expect([end[inside.key].x, end[inside.key].y]).toEqual([before.words.x, before.words.y]);
  });

  it("slide 12: the picture itself travels: the small copy starts exactly over the app, bubble and sign, takes over from them unseen, and shrinks to its place at the left with its words", () => {
    const plays = timesOf("ai-builds");
    const { app, before, bubble, noSign, inside } = AI_BUILDS;
    const gone = (key: string) => moved(plays, key, "autoAlpha").find((play) => play.on.autoAlpha === 0)!;
    // Its start is the full-size app: its top left on the app's, its size the app's, moved and scaled about its own top left.
    expect([before.at.x + before.start.x, before.at.y + before.start.y]).toEqual([app.at.x, app.at.y]);
    expect([before.at.w * before.start.scale, before.at.h * before.start.scale]).toEqual([app.at.w, app.at.h]);
    expect(markup).toMatch(new RegExp(`data-build="${before.key}" class="dk-move" style="transform-origin:${before.at.x}px ${before.at.y}px"`));
    // It waits there, hidden, on every slide before this one.
    const waiting = stateAfter("tools-gap");
    expect([waiting[before.key]["--x"], waiting[before.key]["--y"], waiting[before.key]["--s"]]).toEqual([before.start.x, before.start.y, before.start.scale]);
    expect(onStage(waiting, before.key)).toBe(false);
    // It comes on as the bubble and the sign go, as quickly, so the two are never seen at once; then it travels, shrinking and fading back, and lands at its place.
    const travels = moved(plays, before.key, "--x");
    expect(travels).toHaveLength(1);
    const [travel] = travels;
    expect(travel.on).toEqual({ "--x": 0, "--y": 0, "--s": 1 });
    expect([travel.duration, travel.ease]).toEqual([0.8, EASE.page]);
    const alphas = moved(plays, before.key, "autoAlpha");
    expect(alphas.map((play) => play.on.autoAlpha)).toEqual([1, before.faded]);
    const [on, fades] = alphas;
    expect(on.at).toBe(travel.at);
    expect(on.duration).toBeLessThanOrEqual(0.05);
    for (const key of [bubble.key, noSign.key, noSign.slash.key]) expect([gone(key).at, gone(key).duration], key).toEqual([on.at, on.duration]);
    expect(fades.at).toBeCloseTo(on.end, 9);
    expect(fades.end).toBeCloseTo(travel.end, 9);
    // Its words travel with it, on the same curve over the same time.
    const words = moved(plays, inside.key, "x").at(-1)!;
    expect([words.at, words.duration, words.ease]).toEqual([travel.at, travel.duration, travel.ease]);
    const end = stateAfter("ai-builds")[before.key];
    expect([end["--x"], end["--y"], end["--s"], end.autoAlpha]).toEqual([0, 0, 1, before.faded]);
  });

  it("slide 12: once line A has been read a prohibition sign is drawn over the chatbot picture, its ring then its slash; sign, bubble and line A go together as the picture steps aside carrying the sign, and line B comes up before the staff", () => {
    const plays = timesOf("ai-builds");
    const { noSign, bubble, before, person } = AI_BUILDS;
    const [lineA, lineB] = ["a", "b"].map((line) => `story.ai-builds.${line}`);
    const up = (key: string) => moved(plays, key, "yPercent").find((play) => play.on.yPercent === 0)!;
    const gone = (key: string) => moved(plays, key, "autoAlpha").find((play) => play.on.autoAlpha === 0)!;
    const drawn = moved(plays, noSign.key, "--d");
    const slashed = moved(plays, noSign.slash.key, "--d");
    expect(drawn.map((play) => play.on["--d"])).toEqual([1]);
    expect(slashed.map((play) => play.on["--d"])).toEqual([1]);
    // Line A is up for the reading hold before the sign, which it does not describe, is drawn.
    expect(drawn[0].at).toBeGreaterThanOrEqual(up(lineA).end + HOLD.read - 1e-9);
    // The ring, then the slash across it, overlapping a little: two strokes, not one.
    expect([drawn[0].duration, slashed[0].duration]).toEqual([0.5, 0.3]);
    expect(slashed[0].at - drawn[0].at).toBeCloseTo(0.35, 9);
    // The sign is read before it goes, and the bubble, the slash and line A go at the same moment, as the small copy comes in.
    const stepsAside = gone(noSign.key).at;
    expect(stepsAside).toBeGreaterThan(Math.max(drawn[0].end, slashed[0].end));
    expect([gone(bubble.key).at, gone(noSign.slash.key).at, gone(lineA).at]).toEqual([stepsAside, stepsAside, stepsAside]);
    expect(startOf(plays.filter((play) => play.at > 0), before.key)).toBeGreaterThanOrEqual(stepsAside);
    // Line B comes up once line A has gone, before the staff come in.
    expect(up(lineB).at).toBeGreaterThanOrEqual(gone(lineA).end - 1e-9);
    expect(up(lineB).at).toBeLessThan(startOf(plays, person.key));
    expect(moved(plays, lineB, "yPercent")).toHaveLength(1);
    const end = stateAfter("ai-builds");
    for (const key of [noSign.key, noSign.slash.key, bubble.key, lineA]) expect(onStage(end, key), key).toBe(false);
    for (const key of [before.key, lineB]) expect(onStage(end, key), key).toBe(true);
    // The small copy carries the whole sign, ring and slash, undrawn-proof: no draw class and no part of its own, so it shows whole with the copy.
    const small = markup.match(new RegExp(`data-build="${before.key}"[^>]*>(.*?)</g>`))![1];
    expect(small.match(/class="catalog-nope"/g)).toHaveLength(2);
    expect(small).not.toMatch(/data-build=/);
    for (const key of [noSign.key, noSign.slash.key]) expect(markup, key).toMatch(new RegExp(`class="catalog-nope dk-draw" data-build="${key.replace(/\./g, "\\.")}"`));
  });

  it("slide 12: line B takes the band's first row, where line A was, since A has gone before B comes up", () => {
    const top = (key: string) => Number(markup.match(new RegExp(`<p class="dk-set dk-set--text" style="left:\\d+px;top:(\\d+)px"[^>]*>(?:(?!</p>).)*?data-build="${key.replace(/\./g, "\\.")}"`))![1]);
    const [lineA, lineB] = ["a", "b"].map((line) => `story.ai-builds.${line}`);
    expect([top(lineA), top(lineB)]).toEqual([420, 420]);
    // A slide whose line A stays keeps B in the row under it.
    expect([top("story.tools-gap.a"), top("story.tools-gap.b")]).toEqual([420, 468]);
  });
});
