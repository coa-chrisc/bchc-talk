import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { compile } from "@/components/deck/engine/compile";
import { CHAIN, cardAt } from "@/components/deck/kit";
import { strayTokens } from "@/components/deck/kit/palette";
import { ADDRESS, APPROVED_AT, ENTRY_FILES, ENTRY_FOLDER } from "../../script/part-1-the-catalog";
import { LEAVE, compiled, endOf, keyOf, markup, moved, onStage, parts, pictures, startOf, stateAfter, stepIndex, timesOf, world } from "./harness";
import { AUTOMATIC, CATALOG, DAYS, ENTRY, HOST, REVIEW, ROW, SIX, STATUS, titleOf } from "./layout";
import { PROOF, YOURS } from "./layout-why";
import { COUNTS } from "./moves";

/** What a slide keeps from the slides before it (the plan's "carry"): the catalog's frame on 3, the app and its tiles on 13. */
const CARRY: Record<string, (key: string) => boolean> = {
  find: (key) => key === "catalog",
  yours: (key) => key === "app" || /^tile\.\d+$/.test(key),
};

const SOURCES = join(import.meta.dirname);
const sources = readdirSync(SOURCES)
  .filter((name) => /\.(tsx?|css)$/.test(name) && !name.endsWith(".test.ts"))
  .map((name) => ({ name, text: readFileSync(join(SOURCES, name), "utf8") }));

describe("the catalog world", () => {
  it("has every step of slides 1 to 13, in the script's order", () => {
    expect(world.steps.map((step) => step.id)).toEqual(pictures.flatMap((picture) => picture.steps.map((step) => `${picture.id}.${step.id}`)));
  });

  it("compiles, with a starting value for everything a step moves", () => {
    expect(() => compile(world)).not.toThrow();
  });

  it("names only parts the scene has", () => {
    expect(compiled.keys.filter((key) => !parts[key])).toEqual([]);
  });

  it("moves every part the scene has, so nothing sits on the stage all talk", () => {
    // A station's lit copy is hidden and a well's quiet fill shut until a step names them (only Live lights); a frame's strip is inside its frame.
    const quiet = (key: string) => key.endsWith(".lit") || key.endsWith(".done") || key.endsWith(".strip");
    expect(Object.keys(parts).filter((key) => !compiled.keys.includes(key) && !quiet(key))).toEqual([]);
  });

  it("leaves a part's own opacity to show and hide: a part that fades by a variable fades its fill, not its opacity", () => {
    // Showing or hiding a part writes its opacity inline, which would override a rule that sets the part's opacity from --k or --d.
    const css = sources.find((source) => source.name === "catalog.css")!.text;
    const fading = [...css.matchAll(/([^{}]+)\{([^}]*)\}/g)]
      .filter(([, , body]) => /(^|[^-])opacity:\s*var\(--/m.test(body))
      .flatMap(([, selector]) => [...selector.matchAll(/\.([\w-]+)\s*(?=,|$)/g)].map(([, name]) => name));
    const parted = [...markup.matchAll(/<[^>]*>/g)].map(([tag]) => tag).filter((tag) => tag.includes("data-build="));
    expect(fading.filter((name) => parted.some((tag) => new RegExp(`class="([^"]* )?${name}( [^"]*)?"`).test(tag)))).toEqual([]);
  });

  it("paints nothing a drawn outline has not drawn yet: an outline's fill comes in with its line", () => {
    // A dk-draw outline is hidden by its stroke alone, so a solid fill under it would sit on the stage, undrawn, from the first slide.
    const css = sources.find((source) => source.name === "catalog.css")!.text;
    const filled = [...css.matchAll(/([^{}]+)\{([^}]*)\}/g)]
      .filter(([, , body]) => [...body.matchAll(/(?:^|[^-])fill:\s*([^;\s]+)/gm)].some(([, value]) => value !== "none") && !/fill-opacity:[^;]*var\(--/.test(body))
      .flatMap(([, selector]) => [...selector.matchAll(/\.([\w-]+)\s*(?=,|$)/g)].map(([, name]) => name));
    const drawn = [...markup.matchAll(/class="([^"]*\bdk-draw\b[^"]*)"/g)].flatMap(([, names]) => names.split(" "));
    expect(filled.filter((name) => drawn.includes(name))).toEqual([]);
  });

  it("finishes every click inside 12 s, the first counting the world's arrival fade", () => {
    world.steps.forEach((step, i) => {
      const end = Math.max(0, ...compiled.plays[i].map((play) => play.at + play.duration + play.stagger * Math.max(0, ("key" in play ? parts[play.key] : 1) - 1)));
      expect(end + (i === 0 ? LEAVE : 0), step.id).toBeLessThanOrEqual(CHAIN.longest);
    });
  });

  it("keeps the camera at home", () => {
    for (const step of world.steps) expect(step.moves.some((move) => "camera" in move), step.id).toBe(false);
  });

  it("clears each slide's picture before the next one: on a slide's first click only its own parts and what it carries are on the stage", () => {
    for (const picture of pictures) {
      const index = stepIndex(picture.id, picture.steps[0].id);
      const own = new Set(world.steps.filter((step) => step.id.startsWith(`${picture.id}.`)).flatMap((step) => step.moves.flatMap((move) => ("key" in move ? [move.key] : []))));
      const carried = CARRY[picture.id] ?? (() => false);
      // The row's own element draws nothing: what shows is its wells, headings and card.
      const strays = compiled.keys.filter((key) => key !== ROW.key && onStage(compiled.states[index + 1], key) && !own.has(key) && !carried(key));
      expect(strays, picture.id).toEqual([]);
    }
  });

  it("ends on the app, ringed as yours, over the history line with its five approvals", () => {
    const last = compiled.states[compiled.states.length - 1];
    const visible = compiled.keys.filter((key) => onStage(last, key));
    expect(visible).toEqual(expect.arrayContaining(["app", "yours.ring", "yours", "history", YOURS.historyName.key, ...[0, 1, 2, 3, 4].map((i) => `history.${i}`)]));
    expect(visible.filter((key) => !/^(app|tile\.\d+|yours(\.ring)?|history(\.\d|\.name)?|title\.yours|story\.yours\.[ab])$/.test(key))).toEqual([]);
  });
});

const LIVE = ROW.stations[ROW.stations.length - 1];

describe("the catalog world's chains", () => {
  it("times each beat by the elements the scene really gives a staggered id", () => {
    expect(Object.entries(COUNTS).filter(([key, count]) => parts[key] !== count)).toEqual([]);
    const staggered = world.steps.flatMap((step) => step.moves.flatMap((move) => ("key" in move && (move.stagger ?? 0) > 0 && (parts[move.key] ?? 1) > 1 ? [move.key] : [])));
    expect(staggered.filter((key) => !(key in COUNTS))).toEqual([]);
  });

  it("brings each slide's story lines up inside its own click, and clears them on the next", () => {
    for (const [n, picture] of pictures.entries()) {
      const lines = picture.story.map((_, i) => `story.${picture.id}.${"ab"[i]}`);
      const shownAt = timesOf(picture.id).filter((play) => "key" in play && lines.includes(play.key) && play.on.yPercent === 0);
      expect(shownAt.map(keyOf).sort(), picture.id).toEqual(lines);
      const next = pictures[n + 1];
      if (next) for (const line of lines) expect(onStage(stateAfter(next.id), line), `${line} on ${next.id}`).toBe(false);
    }
  });

  it("slide 5: the card stops in each well in turn, waits at Approval until the person's mark has landed, and only then goes on to Live", () => {
    const plays = timesOf("six-steps");
    const card = moved(plays, ROW.cardKey, "x");
    expect(card.map((play) => play.on.x)).toEqual(ROW.stations.map((_, n) => cardAt(ROW, n)));
    // Each hop starts once the card has come to rest in the well before.
    card.slice(1).forEach((play, i) => expect(play.at, ROW.stations[i + 1].label).toBeGreaterThanOrEqual(card[i].end - 1e-9));
    const atApproval = card[ROW.human!];
    const toLive = card[card.length - 1];
    const approves = plays.filter((play) => [ROW.humanKey, SIX.person.key, SIX.mark.key].includes(keyOf(play)));
    expect(Math.min(...approves.map((play) => play.at))).toBeGreaterThanOrEqual(atApproval.end - 1e-9);
    expect(endOf(plays, SIX.mark.key)).toBeLessThanOrEqual(toLive.at + 1e-9);
  });

  it("slide 5: the links between the wells are full paper lines, not rule", () => {
    for (const link of ROW.links) expect(markup, link.key).toMatch(new RegExp(`class="dk-connector dk-connector--paper" data-build="${link.key.replace(/\./g, "\\.")}"`));
  });

  it("slide 10: each person's mark is drawn over the real catalog, so it fades on its piece as the catalog comes in", () => {
    const still = markup.indexOf(`data-build="${PROOF.still.key}"`);
    for (const piece of PROOF.pieces) expect(markup.indexOf(`data-build="${piece.mark.key}"`), piece.mark.key).toBeGreaterThan(still);
  });

  it("slide 10: the marks on the pieces fade as the real catalog settles in, and the end frame keeps one mark, the people's, beside them", () => {
    const plays = timesOf("proof");
    const settles = startOf(plays, PROOF.still.key);
    const settled = endOf(plays, PROOF.still.key);
    for (const piece of PROOF.pieces) {
      const [fades] = moved(plays, piece.mark.key, "autoAlpha").filter((play) => play.on.autoAlpha === 0);
      expect(fades, piece.mark.key).toBeDefined();
      expect(fades.at, piece.mark.key).toBeGreaterThanOrEqual(settles);
      expect(fades.end, piece.mark.key).toBeLessThanOrEqual(settled + 1e-9);
    }
    expect(startOf(plays, PROOF.mark.key)).toBeGreaterThanOrEqual(settles);
    const end = stateAfter("proof");
    const marks = [...markup.matchAll(/class="dk-human" data-build="([^"]+)"/g)].map(([, key]) => key);
    expect(marks.filter((key) => onStage(end, key))).toEqual([PROOF.mark.key]);
  });

  it("slide 10: the three agents are one kind, the deck's ring with a dot", () => {
    for (const agent of PROOF.agents) {
      expect(agent.role, agent.key).toBe("builder");
      expect(markup.match(new RegExp(`data-build="${agent.key.replace(/\./g, "\\.")}"[^>]*>(.*?)</g>`))?.[1], agent.key).toMatch(/<circle class="dk-agent__body" /);
    }
  });

  it("slide 4: line B comes up as soon as the last field has landed, so the click does not seem to have ended", () => {
    const plays = timesOf("entry");
    const lineB = startOf(plays, "story.entry.b");
    const before = Math.max(...plays.filter((play) => play.at < lineB).map((play) => play.end));
    expect(lineB - before).toBeLessThanOrEqual(0.7);
  });

  it("slide 5: the Approval box is outlined in navy; only the person's mark over it is orange", () => {
    const css = sources.find((source) => source.name === "catalog.css")!.text;
    expect(css).toMatch(new RegExp(`\\.dk-well--human\\[data-build="${ROW.humanKey!.replace(/\./g, "\\.")}"\\]\\s*\\{\\s*stroke: var\\(--dk-paper\\);`));
  });

  it("slide 5: Live fills and lights, and the card takes the catalog's edge, as the card lands in it; all three stay", () => {
    const plays = timesOf("six-steps");
    const lands = moved(plays, ROW.cardKey, "x").at(-1)!.end;
    const live = plays.filter((play) => keyOf(play) === LIVE.doneKey || keyOf(play) === LIVE.litKey);
    expect(live.map(keyOf).sort()).toEqual([LIVE.doneKey, LIVE.litKey].sort());
    for (const play of [...live, ...moved(plays, ROW.cardKey, "--landed")]) expect(play.at).toBeCloseTo(lands, 5);
    const end = stateAfter("six-steps");
    expect(onStage(end, LIVE.doneKey)).toBe(true);
    expect(onStage(end, LIVE.litKey)).toBe(true);
    expect(end[ROW.cardKey].x).toBe(ROW.pitch * (ROW.stations.length - 1));
    expect(end[ROW.cardKey]["--landed"]).toBe(1);
    expect(compiled.states[0][ROW.cardKey]["--landed"]).toBe(0);
  });

  it("slide 5: Draft and Checks take the process's tint as the card arrives in each, \"Automatic\" marks them while it passes, and the checks pass while it sits in Checks", () => {
    const plays = timesOf("six-steps");
    const card = moved(plays, ROW.cardKey, "x");
    const [, , intoDraft, intoChecks, leavesChecks] = card;
    expect(AUTOMATIC).toEqual([ROW.stations[2].doneKey, ROW.stations[3].doneKey]);
    for (const [key, hop] of [[AUTOMATIC[0], intoDraft], [AUTOMATIC[1], intoChecks]] as const) expect(startOf(plays, key), key).toBeCloseTo(hop.at, 5);
    for (const key of [SIX.bracket.key, SIX.automatic.key]) {
      expect(startOf(plays, key), key).toBeGreaterThanOrEqual(intoDraft.at);
      expect(endOf(plays, key), key).toBeLessThanOrEqual(leavesChecks.at + 1e-9);
    }
    const ticks = SIX.ticks.map((tick) => tick.key);
    for (const key of ticks) {
      expect(startOf(plays, key), key).toBeGreaterThanOrEqual(intoChecks.end - 1e-9);
      expect(endOf(plays, key), key).toBeLessThanOrEqual(leavesChecks.at + 1e-9);
    }
    // The wells the card only passes through keep the quiet fill, laid as the card leaves them.
    for (const n of [0, 1, ROW.human!]) expect(startOf(plays, ROW.stations[n].doneKey), ROW.stations[n].label).toBeCloseTo(card[n + 1].at, 5);
    const end = stateAfter("six-steps");
    expect(ROW.stations.filter((station) => !onStage(end, station.doneKey)).map((station) => station.label)).toEqual([]);
    for (const key of ticks) expect(onStage(end, key), key).toBe(true);
  });

  it("slide 4: the list gives way to one opened project, circled, and its six fields land on their places one at a time, in the script's order", () => {
    const plays = timesOf("entry");
    expect(ENTRY.fields.map((field) => field.text)).toEqual(pictures.find((picture) => picture.id === "entry")!.steps[0].show);
    const [built] = ENTRY.fields;
    expect(startOf(plays, ENTRY.opened.key)).toBeGreaterThanOrEqual(startOf(plays, CATALOG.frame.key));
    expect(startOf(plays, built.ring.key)).toBeGreaterThanOrEqual(endOf(plays, ENTRY.opened.key) - 1e-9);
    // Each tab lands after the one before it, on its ring, once the ring is drawing; where it runs, once its part of the page has come down.
    const tabs = ENTRY.fields.map((field) => startOf(plays, field.tab.key));
    tabs.slice(1).forEach((at, i) => expect(at, ENTRY.fields[i + 1].step).toBeGreaterThan(tabs[i]));
    for (const field of ENTRY.fields) expect(startOf(plays, field.tab.key), field.step).toBeGreaterThanOrEqual(startOf(plays, field.ring.key));
    expect(startOf(plays, ENTRY.fields[1].ring.key)).toBeGreaterThanOrEqual(startOf(plays, ENTRY.runs.key));
    const end = stateAfter("entry");
    expect(onStage(end, CATALOG.frame.key)).toBe(false);
    for (const key of [ENTRY.opened.key, ENTRY.runs.key, ...ENTRY.fields.flatMap((field) => [field.ring.key, field.tab.key])]) expect(onStage(end, key), key).toBe(true);
  });

  it("slide 5: the status page lights each step as the card lands in its well, the line to it as the card travels, and reads \"Published\" once the card is in Live", () => {
    const plays = timesOf("six-steps");
    const card = moved(plays, ROW.cardKey, "x");
    STATUS.steps.forEach((step, n) => expect(startOf(plays, step.key), step.key).toBeCloseTo(card[n].end, 5));
    STATUS.links.forEach((link, n) => {
      expect(startOf(plays, link.key), link.key).toBeCloseTo(card[n + 1].at, 5);
      expect(endOf(plays, link.key), link.key).toBeCloseTo(card[n + 1].end, 5);
    });
    expect(startOf(plays, STATUS.published.key)).toBeGreaterThanOrEqual(card.at(-1)!.end - 1e-9);
    // The page and its name are there before the card arrives.
    for (const key of [STATUS.page.key, STATUS.name.key]) expect(endOf(plays, key), key).toBeLessThanOrEqual(card[0].end + 1e-9);
    const end = stateAfter("six-steps");
    for (const key of [STATUS.page.key, STATUS.name.key, STATUS.published.key, ...STATUS.steps.map((step) => step.key), ...STATUS.links.map((link) => link.key)]) expect(onStage(end, key), key).toBe(true);
    expect(STATUS.name.text).toBe("You can follow it the whole way");
    expect(STATUS.published.text).toBe("Published");
  });

  it("slide 7: the reviewer at the desk, the card, then the flag, then each checklist tick in turn, then the mark with \"Approved\", who and when; no row and no agent", () => {
    const plays = timesOf("review");
    const ticks = REVIEW.ticks.map((tick) => tick.key);
    expect(startOf(plays, REVIEW.card.key)).toBeGreaterThanOrEqual(startOf(plays, REVIEW.person.key));
    expect(startOf(plays, REVIEW.flag.key)).toBeGreaterThanOrEqual(endOf(plays, REVIEW.card.key) - 1e-9);
    expect(startOf(plays, REVIEW.flagged.key)).toBeGreaterThanOrEqual(startOf(plays, REVIEW.flag.key));
    const tickAt = ticks.map((key) => startOf(plays, key));
    expect(tickAt[0]).toBeGreaterThanOrEqual(endOf(plays, REVIEW.flag.key) - 1e-9);
    tickAt.slice(1).forEach((at, i) => expect(at, ticks[i + 1]).toBeGreaterThan(tickAt[i]));
    const marked = startOf(plays, REVIEW.mark.key);
    expect(marked).toBeGreaterThanOrEqual(Math.max(...ticks.map((key) => endOf(plays, key))) - 1e-9);
    for (const key of [REVIEW.approved.key, REVIEW.signed.key]) expect(startOf(plays, key), key).toBeGreaterThan(marked);
    const end = stateAfter("review");
    for (const key of [REVIEW.desk.key, REVIEW.person.key, REVIEW.name.key, REVIEW.card.key, REVIEW.flag.key, REVIEW.flagged.key, ...ticks, REVIEW.mark.key, REVIEW.approved.key, REVIEW.signed.key]) expect(onStage(end, key), key).toBe(true);
    expect([REVIEW.name.text, REVIEW.flagged.text, REVIEW.approved.text]).toEqual(["Reviewer", "Data governance review", "Approved"]);
    const agents = [...markup.matchAll(/class="dk-agent" data-build="([^"]+)"/g)].map(([, key]) => key);
    expect(agents.length).toBeGreaterThan(0);
    expect(compiled.keys.filter((key) => onStage(end, key) && (key === ROW.key || key.startsWith("row.") || agents.includes(key)))).toEqual([]);
  });

  it("slide 9: each session fills, then the coalition's feedback comes down, and the next session starts from it; the last feedback leads into \"Live\", which ends the slide, with no clock", () => {
    const plays = timesOf("three-days");
    DAYS.sessions.forEach((session, i) => {
      const feedback = DAYS.feedback[i];
      expect(startOf(plays, feedback.key), feedback.key).toBeGreaterThanOrEqual(endOf(plays, session.key) - 1e-9);
      const next = DAYS.sessions[i + 1];
      if (next) expect(startOf(plays, next.key), next.key).toBeGreaterThanOrEqual(startOf(plays, feedback.arrow.key));
    });
    expect(DAYS.feedback.map((feedback) => feedback.arrow.to)).toEqual([...DAYS.sessions.slice(1).map((session) => session.at), DAYS.live.at]);
    expect(DAYS.live.text).toBe("Live");
    expect(startOf(plays, DAYS.live.key)).toBeGreaterThanOrEqual(endOf(plays, DAYS.feedback.at(-1)!.arrow.key) - 1e-9);
    expect(DAYS.sessions.map((session) => session.label.text)).toEqual(["Session 1", "Session 2", "Session 3"]);
    // The coalition is there, named, before the first session; each feedback comes up from it along its line, and lands before its arrow on to the next session draws.
    const { coalition } = DAYS;
    const coalitionKeys = [coalition.rule.key, coalition.name.key, ...coalition.people.map((person) => person.key)];
    for (const key of coalitionKeys) expect(endOf(plays, key), key).toBeLessThanOrEqual(startOf(plays, DAYS.sessions[0].key) + 1e-9);
    DAYS.feedback.forEach((feedback) => {
      expect(startOf(plays, feedback.from.key), feedback.from.key).toBeGreaterThanOrEqual(startOf(plays, DAYS.sessions[DAYS.feedback.indexOf(feedback)].key));
      expect(startOf(plays, feedback.key), feedback.key).toBeGreaterThanOrEqual(startOf(plays, feedback.from.key));
      expect(startOf(plays, feedback.arrow.key), feedback.arrow.key).toBeGreaterThanOrEqual(startOf(plays, feedback.key));
    });
    const end = stateAfter("three-days");
    const own = [...DAYS.sessions.flatMap((s) => [s.key, s.label.key]), ...DAYS.feedback.flatMap((f) => [f.key, f.from.key, f.arrow.key]), DAYS.live.key, ...coalitionKeys];
    for (const key of own) expect(onStage(end, key), key).toBe(true);
    expect(compiled.keys.filter((key) => onStage(end, key) && !own.includes(key) && !/^(title|story)\.three-days/.test(key))).toEqual([]);
  });

  it("slide 8: the three boxes are crossed out and set back, their names kept at full secondary grey under the strike, and stay beside the files that replaced them; no line leads off a box to nothing", () => {
    const plays = timesOf("nothing-to-run");
    const end = stateAfter("nothing-to-run");
    for (const thing of HOST.usual) expect(markup.match(new RegExp(`data-build="${thing.key}"[^>]*>(.*?)</svg>`))?.[1], thing.key).not.toMatch(/<path/);
    expect(onStage(end, HOST.panel.key)).toBe(true);
    for (const thing of HOST.usual) {
      // Crossed out once its name has shown, and its box set back once crossed out; the name is not dimmed, so it reads on a projector.
      const [named, ...dimmed] = moved(plays, thing.label, "autoAlpha");
      expect(startOf(plays, thing.strike.key), thing.strike.key).toBeGreaterThanOrEqual(named.end - 1e-9);
      expect(dimmed, thing.label).toEqual([]);
      const [setBack] = moved(plays, thing.key, "autoAlpha").filter((play) => Number(play.on.autoAlpha) < 1);
      expect(setBack.at, thing.key).toBeGreaterThanOrEqual(startOf(plays, thing.strike.key));
      for (const key of [thing.key, thing.label, thing.strike.key]) expect(onStage(end, key), key).toBe(true);
      expect(end[thing.key].autoAlpha, thing.key).toBeLessThan(1);
      expect(end[thing.label].autoAlpha, thing.label).toBe(1);
    }
    for (const key of [HOST.folder.key, ...HOST.files.map((file) => file.key), HOST.hosting.key]) expect(onStage(end, key), key).toBe(true);
  });
});

describe("the catalog world's words", () => {
  /** The labels a slide's They see line asks to be drawn: what it quotes, and the sessions it names. */
  const seen = pictures.flatMap((picture) => picture.see.flatMap((line) => [...[...line.matchAll(/"([^"]+)"/g)].map(([, text]) => text), ...(line.match(/Session \d/g) ?? [])]));
  /** Every string the world may set: the slides' titles, their story lines and the labels their clicks show or their They see line asks for, the catalog's address, and the artefact text the script module keeps beside them. A story line or a label set on two rows is allowed row by row, each row a run of the line. */
  const allowed = new Set([
    ...pictures.flatMap((picture) => [...titleOf(picture.id).lines, ...picture.show.split(/(?<=\.)\s+/).map((line) => line.replace(/\.$/, "")), ...picture.story, ...picture.steps.flatMap((step) => step.show)]),
    ...seen,
    ADDRESS,
    APPROVED_AT,
    ENTRY_FOLDER,
    ...ENTRY_FILES,
  ]);
  const texts = [...markup.matchAll(/>([^<>]+)</g)].map(([, text]) => text.replace(/&amp;/g, "&").replace(/&#x27;/g, "'").trim()).filter(Boolean);

  it("sets every word on the stage from the script", () => {
    expect(texts.length).toBeGreaterThan(30);
    const broken = [...pictures.flatMap((picture) => picture.story), ...seen];
    const rowOf = (text: string) => broken.some((line) => line !== text && (line.startsWith(`${text} `) || line.endsWith(` ${text}`)));
    expect(texts.filter((text) => !allowed.has(text) && !rowOf(text))).toEqual([]);
  });

  it("types no words into its scene files", () => {
    for (const { name, text } of sources.filter((source) => source.name.startsWith("scene"))) {
      // JSX text between tags that is not an expression.
      expect([...text.matchAll(/>\s*([A-Za-z][^<>{}]*?)\s*</g)].map(([, words]) => words), name).toEqual([]);
    }
  });
});

describe("the catalog world's colours and motion", () => {
  it("uses orange only through the kit's human mark and the word \"Approved\", and otherwise only the deck's tokens and the role aliases", () => {
    const coralWords = [...markup.matchAll(/<[^>]*class="[^"]*\bdk-human-text\b[^"]*"[^>]*>([^<]*)</g)].map(([, text]) => text);
    expect(coralWords).toEqual([REVIEW.approved.text]);
    for (const { name, text } of sources) expect(text.replace(/\bdk-human-text\b/g, ""), name).not.toMatch(/--dk-human|dk-human-text|#f4642c|fr-claude|fr-cursor|fr-gemini/i);
    for (const { name, text } of sources) expect(strayTokens(text), name).toEqual([]);
  });

  it("uses green only on a check that passed", () => {
    const css = sources.find((source) => source.name === "catalog.css")!.text;
    const green = [...css.replace(/\/\*[\s\S]*?\*\//g, "").matchAll(/([^{}]+)\{[^}]*--dk-pass[^}]*\}/g)].map(([, selector]) => selector.trim());
    expect(green).toEqual([".catalog-check__tint"]);
    for (const { name, text } of sources.filter((source) => source.name !== "catalog.css")) expect(text, name).not.toMatch(/--dk-pass/);
  });

  it("tints only Draft and Checks, the wells where scripts work, in the process's colour", () => {
    const css = sources.find((source) => source.name === "catalog.css")!.text;
    expect([...css.matchAll(/\.dk-well__done\[data-build="([^"]+)"\]/g)].map(([, key]) => key)).toEqual(AUTOMATIC);
    expect(ROW.stations.filter((station) => AUTOMATIC.includes(station.doneKey)).map((station) => station.label)).toEqual(["Draft", "Checks"]);
  });

  it("gives every picture of the catalog the catalog's edge, the Live well the catalog's outline, and the row's card the edge it takes there", () => {
    for (const key of ["catalog", "opened", "runs", PROOF.still.key]) expect(markup, key).toMatch(new RegExp(`data-build="${key}" data-edge="catalog"`));
    expect(markup).toMatch(new RegExp(`class="dk-well dk-well--catalog dk-draw" data-build="${LIVE.key}"`));
    expect(markup).toMatch(new RegExp(`class="dk-card" data-build="${ROW.cardKey}" data-landed="true"`));
  });

  it("moves nothing on a timer, at random, or by a CSS transition", () => {
    for (const { name, text } of sources) expect(text, name).not.toMatch(/Math\.random|\bDate\b|setTimeout|setInterval|requestAnimationFrame|transition\s*:|animation\s*:/);
  });
});
