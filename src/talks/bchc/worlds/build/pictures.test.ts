import { describe, expect, it } from "vitest";
import { STAGE } from "@/components/deck/kit";
import { pictureOf, shown } from "../../script/find";
import { CALENDAR, CHECKER, DAYS, FIELD, NOTES, PROTOTYPE, RAD, WEEK, topOf } from "./layout";
import {
  AGENT_R,
  BOARD_KEY,
  BUILDERS,
  CELLS,
  CHECKERS,
  FAILED_KEY,
  FIXER,
  GRID,
  GRID_BOTTOM,
  LEADS as BOARD_LEADS,
  MINI_BOX,
  MINI_MOVE,
  NAMES,
  PLAN_APPROVAL,
  PLAN_KEYS,
  PROJECT,
  ROWS,
  SPRINTS,
  WAVE,
  checkAt,
  fillKey,
  tickAt,
  waveCells,
} from "./layout-board";
import { NOTES_PANEL, NOTE_DOTS, REVIEW, SCREEN_PAIR, SESSION, TEST_PAIR, screenParts } from "./layout-close";
import { APP_LAYOUT, DESIGN, LIBRARY_KEYS, READER, SHELF_ROWS, TABLE_LAYOUT, TOOLS, TOTAL } from "./layout-library";
import { DESIGN_FOLDER, FOLDERS, LEADS, MODULES_FOLDER, READS } from "./layout-setup";
import { CHECKS, COLUMNS, LEGEND, MARKERS, NOW, PRODUCTS, RELEASE, STARTED, THIS_WEEK, YEAR, dotKey, fillKey as yearFill } from "./layout-year";
import { KINDS } from "./kinds";
import { compiled, end, landed, markup, on, start, stateAt, visible } from "./probe";

const shownIn = (id: string, keys: readonly string[]) => keys.filter((key) => visible(stateAt(id)[key]));

describe("14 and 18", () => {
  it("14: draws the three steps one at a time, people either side of the agents, the orange mark last; other worlds keep RAD's shape", () => {
    expect(RAD.boxes.map((box) => box.lines.join(" "))).toEqual(shown("rad", "play"));
    expect(RAD.agent).toEqual([1]);
    expect(RAD.human).toEqual([0, 2]);
    const names = RAD.boxes.map((_, i) => start(on("rad.play", RAD.nameKey(i))));
    expect([...names].sort((a, b) => a - b)).toEqual(names);
    expect(start(on("rad.play", RAD.markKey))).toBeGreaterThan(names[2]);
    expect(stateAt("rad.play")[RAD.cellsKey]).toMatchObject({ "--k": 1 });
  });

  it("14: draws the agents in the middle step as the deck's plain agent glyph, its ring filled in the process colour, not slide 19's shapes", () => {
    for (const key of [RAD.builderKey, RAD.testerKey]) {
      const part = markup.match(new RegExp(`data-build="${key.replace(".", "\\.")}"(.*?)</svg>`))![1];
      expect(part, key).toMatch(/class="dk-agent" data-build="[^"]+" data-role="process"/);
      expect(part, key).not.toContain("bw-shape");
    }
    for (const key of RAD.glyphKeys) expect(stateAt("rad.play")[key], key).toMatchObject({ "--k": 1 });
  });

  it("14: brings each box up first and draws the arrow into it after, so no arrow or stroke shows before its box", () => {
    const [boxes] = on("rad.play", RAD.boxKey);
    const [links] = on("rad.play", RAD.linkKey);
    expect(boxes.on).not.toHaveProperty("--d");
    expect(links.on).toMatchObject({ "--d": 1 });
    for (let i = 0; i < RAD.boxes.length - 1; i++) expect(links.at + i * links.stagger, `link ${i}`).toBeGreaterThan(boxes.at + (i + 1) * boxes.stagger);
    // The boxes' strokes are whole once shown; only the arrows stroke on, so nothing draws at the boxes' corners.
    for (const [, group] of markup.matchAll(/data-build="rad\.link">(.*?)<\/g>/g)) expect(group.match(/class="dk-draw"/g), group).toHaveLength(2);
    expect(markup).not.toMatch(/class="dk-draw[^"]*" data-build="rad\.box"/);
  });

  it("18: turns the calendar Monday to Friday over one sketch, and names the working prototype last", () => {
    expect(DAYS.map((day) => day.name)).toEqual(shown("week", "play").slice(0, 5));
    const days = DAYS.map((_, i) => start(on("week.play", WEEK.dayKey(i))));
    expect([...days].sort((a, b) => a - b)).toEqual(days);
    expect(stateAt("week.play")[CALENDAR.todayKey]).toMatchObject({
      x: 4 * CALENDAR.pitch,
      autoAlpha: 1,
    });
    expect(start(on("week.play", PROTOTYPE.key))).toBeGreaterThan(days[4]);
    for (const key of [WEEK.buildKey, WEEK.testKey, PROTOTYPE.key]) expect(visible(stateAt("week.play")[key]), key).toBe(true);
    // The plan's dashed outlines give way to the built screens: none is left round a finished one.
    expect(visible(stateAt("week.play")[WEEK.planKey])).toBe(false);
    expect(PROTOTYPE.text).toBe("Working prototype");
  });

  it("18: names the meeting's notes over their card under Monday, and the person beside the sketch as the people who need the tool", () => {
    expect(NOTES.text).toBe("Meeting notes");
    expect(CHECKER.lines.join(" ")).toBe("People who need the tool");
    const monday = DAYS[0].at;
    expect(NOTES.at.x).toBeGreaterThanOrEqual(monday.x);
    expect(NOTES.at.x + NOTES.at.w).toBeLessThanOrEqual(monday.x + monday.w);
    // On the line "Working prototype" names the sketch on, clear of the card under it.
    expect(NOTES.labelAt.y).toBe(PROTOTYPE.at.y);
    expect(NOTES.labelAt.y + 39 + 12).toBeLessThanOrEqual(NOTES.at.y);
    expect(CHECKER.labelAt.x).toBeGreaterThan(CHECKER.at.x + CHECKER.at.w);
    for (const key of [NOTES.labelKey, CHECKER.labelKey]) expect(visible(stateAt("week.play")[key]), key).toBe(true);
    expect(start(on("week.play", NOTES.labelKey))).toBeGreaterThan(start(on("week.play", NOTES.key)));
    expect(start(on("week.play", CHECKER.labelKey))).toBeGreaterThan(start(on("week.play", CHECKER.key)));
  });
});

describe("14a to 17", () => {
  it("14a: lands the six folders one at a time in the script's order, each read before the next, and the lead agents stand once all are read", () => {
    expect(FOLDERS.map((folder) => folder.text)).toEqual(shown("setup", "play").slice(1));
    const lands = FOLDERS.map((folder) => start(on("setup.play", folder.key)));
    lands.slice(1).forEach((at, i) => expect(at).toBeGreaterThan(landed(on("setup.play", READS[i].key)[0])));
    const stand = on("setup.play", LEADS.key).find((play) => play.on.y === LEADS.stand)!;
    expect(stand.at).toBeGreaterThanOrEqual(end(on("setup.play", READS[5].key)));
    expect(LEADS.text).toBe("Lead agents");
  });

  it("14a: puts the design system's folder on top of the pile and the tested modules' under it, draws the lead agents as gold agent rings, and keeps them close to the pile", () => {
    expect(FOLDERS.slice(-2)).toEqual([MODULES_FOLDER, DESIGN_FOLDER]);
    const leads = markup.match(/data-build="setup\.leads"(.*?)<\/svg>/)![1];
    expect(leads.match(/class="bw-lead"/g)).toHaveLength(3);
    expect(leads.match(/class="bw-lead__arc"/g)).toHaveLength(9);
    const pile = Math.min(...FOLDERS.map((folder) => folder.at.x));
    expect(pile - (LEADS.at[2].x + LEADS.r)).toBeLessThanOrEqual(120);
    expect(LEADS.label.y + 38 + 24).toBeLessThanOrEqual(LEADS.at[0].y + LEADS.stand - LEADS.r);
  });

  it("15: keeps the design system's folder and the modules' at the top, passes the strip over each grey sketch in turn, and uses the strip on no other slide", () => {
    for (const id of ["design.play", "modules.play", "data.play"]) expect(shownIn(id, [DESIGN_FOLDER.key, MODULES_FOLDER.key]), id).toHaveLength(2);
    const passes = TOOLS.map((tool) => start(on("design.play", tool.brandKey)));
    expect([...passes].sort((a, b) => a - b)).toEqual(passes);
    for (const tool of TOOLS)
      expect(stateAt("design.play")[tool.brandKey], tool.text).toMatchObject({
        "--wt": 0,
        "--wb": 0,
      });
    expect(TOOLS.map((tool) => tool.text)).toEqual(["Form", "Dashboard", "Map"]);
    const usedBy = compiled.plays.flatMap((plays, n) => (plays.some((play) => "key" in play && play.key === DESIGN.key && play.on.autoAlpha !== 0) ? [n] : []));
    expect(usedBy).toHaveLength(1);
    expect(DESIGN.labels.map((label) => label.text)).toEqual(["colors", "fonts", "buttons"]);
  });

  it("16: fills the shelf row by row, six rows named and more after, and totals it as over 140 tested modules", () => {
    expect(SHELF_ROWS.length).toBeGreaterThanOrEqual(8);
    expect(SHELF_ROWS.filter((row) => row.text).map((row) => row.text)).toEqual(shown("modules", "play").slice(0, 6));
    expect(TOTAL.text).toBe("Over 140 tested modules");
    expect(start(on("modules.play", TOTAL.key))).toBeGreaterThan(start(on("modules.play", SHELF_ROWS[SHELF_ROWS.length - 1].key)));
    for (const key of LIBRARY_KEYS.modules) expect(visible(stateAt("modules.play")[key]), key).toBe(true);
  });

  it("17: keeps the app empty until the last column is read, then fills it from all three at once, the new code dashed and named", () => {
    const read = end(TABLE_LAYOUT.heads.flatMap((head) => on("data.play", head.key)));
    const fills = [APP_LAYOUT.headerKey, APP_LAYOUT.tilesKey, APP_LAYOUT.fieldsKey].map((key) => start(on("data.play", key)));
    for (const at of fills) expect(at).toBeGreaterThanOrEqual(read);
    expect(new Set(fills).size).toBe(1);
    expect(APP_LAYOUT.newText).toBe("New code");
    expect(markup).toContain('class="bw-dashed"');
  });
});

describe("19", () => {
  it("fills the frame with eight or more workstreams, under the story band and over the floor", () => {
    expect(ROWS.length).toBeGreaterThanOrEqual(8);
    expect(SPRINTS.at.y + 32).toBeLessThanOrEqual(FIELD.floor);
    expect(GRID_BOTTOM).toBeLessThan(FIELD.floor);
  });

  it("draws each kind of agent in its own shape, names the first of each on the board, and has no legend", () => {
    for (const kind of KINDS) expect(markup, kind).toContain(`data-kind="${kind}"`);
    expect(NAMES.lead.text).toBe(shown("split", "plan")[0]);
    expect([...NAMES.kinds.map((name) => name.text), NAMES.fixer.text]).toEqual(shown("split", "work").slice(1));
    expect([...markup.matchAll(/data-build="([^"]*legend[^"]*)"/gi)].map(([, key]) => key)).toEqual([LEGEND.key]);
    for (const id of ["split.work", "tested.play", "reviewed.play", "memory.play"]) expect(visible(stateAt(id)[LEGEND.key]), id).toBe(false);
    expect(stateAt("split.work")[NAMES.key]).toMatchObject({ autoAlpha: 1 });
  });

  it("plans on the first click, a person approving it last; agents and cells only on the second", () => {
    expect(start(on("split.plan", PLAN_APPROVAL.key))).toBeGreaterThan(
      Math.max(...PLAN_KEYS.filter((key) => key !== PLAN_APPROVAL.key && on("split.plan", key).length).map((key) => start(on("split.plan", key)))),
    );
    for (const key of [...BUILDERS.map((b) => b.key), ...CHECKERS.map((c) => c.key), FIXER.key]) expect(on("split.plan", key), key).toEqual([]);
    expect(visible(stateAt("split.plan")[BOARD_LEADS.key])).toBe(true);
  });

  it("names the project row on the plan's click, in the margin at its left end, and keeps it through the work's", () => {
    expect(PROJECT.text).toBe("Project");
    for (const id of ["split.plan", "split.work"]) expect(visible(stateAt(id)[PROJECT.labelKey]), id).toBe(true);
    expect(visible(stateAt("tested.play")[PROJECT.labelKey])).toBe(false);
    expect(PLAN_KEYS).toContain(PROJECT.labelKey);
    expect(PROJECT.labelAt.x + PROJECT.labelAt.w).toBeLessThan(PROJECT.at.x);
    expect(PROJECT.labelAt.y + 16).toBe(PROJECT.at.y + PROJECT.at.h / 2);
    expect(start(on("split.plan", PROJECT.labelKey))).toBeLessThan(start(on("split.plan", PLAN_APPROVAL.key)));
  });

  it("names the lead agents on the first click, as they arrive, so the gold rings are never unnamed", () => {
    expect(visible(stateAt("split.plan")[NAMES.leadKey])).toBe(true);
    expect(start(on("split.plan", NAMES.leadKey))).toBeGreaterThan(start(on("split.plan", BOARD_LEADS.key)));
    expect(start(on("split.plan", NAMES.leadKey))).toBeLessThan(start(on("split.plan", PLAN_APPROVAL.key)));
    expect(PLAN_KEYS).toContain(NAMES.leadKey);
  });

  it("sets the reviewer's, tester's and builder's names in a column clear of the grid, each on its own row's empty end, and leaves room under the story band", () => {
    for (const name of NAMES.kinds) {
      expect(name.at.x, name.kind).toBeGreaterThanOrEqual(WAVE.at.x + WAVE.at.w + 24);
      const row = ROWS.find((r) => r.y + GRID.h / 2 === name.leader.y)!;
      expect(Math.max(...row.cells.map((cell) => cell.x + cell.w)), name.kind).toBeLessThanOrEqual(name.leader.x0);
      expect(name.leader.x1, name.kind).toBeLessThan(name.at.x);
    }
    expect(new Set(NAMES.kinds.map((name) => name.at.x)).size).toBe(1);
    expect(BOARD_LEADS.at[0].y - BOARD_LEADS.r).toBeGreaterThanOrEqual(topOf("split") + 24);
    expect(PLAN_APPROVAL.person.y).toBeGreaterThanOrEqual(topOf("split") + 24);
  });

  it("fails one test and has the fixer repair it before the click ends", () => {
    const cross = on("split.work", FAILED_KEY.cross);
    const tick = on("split.work", FAILED_KEY.tick);
    expect(start(tick)).toBeGreaterThan(start(cross));
    expect(stateAt("split.work")[FAILED_KEY.cross]).toMatchObject({
      autoAlpha: 0,
    });
    expect(stateAt("split.work")[FAILED_KEY.tick]).toMatchObject({
      autoAlpha: 1,
    });
    for (const crew of CHECKERS)
      expect(stateAt("split.work")[crew.key], crew.key).toMatchObject({
        autoAlpha: 1,
      });
    ROWS.forEach((_, r) => [0, 1].forEach((w) => waveCells(r, w).length && expect(stateAt("split.work")[fillKey(r, w)], `${r}.${w}`).toMatchObject({ "--k": 1 })));
  });
});

describe("20 to 22a", () => {
  it("20: shows Failed first, then ends on two large before-and-after pairs, the board small", () => {
    expect(start(on("tested.play", TEST_PAIR.failedKey))).toBeLessThan(start(on("tested.play", TEST_PAIR.fixedKey)));
    expect(stateAt("tested.play")[BOARD_KEY]).toMatchObject(MINI_MOVE);
    for (const key of [TEST_PAIR.failedKey, TEST_PAIR.fixedKey, SCREEN_PAIR.flaggedKey, SCREEN_PAIR.ringKey, SCREEN_PAIR.fixedKey, SCREEN_PAIR.personKey])
      expect(visible(stateAt("tested.play")[key]), key).toBe(true);
    expect(TEST_PAIR.fixedText).toBe("Fixed by the fixer agent");
    // The fixer is named beside it, clear of the board above and of the fixed test under it.
    expect(TEST_PAIR.fixerText).toBe("Fixer");
    expect(TEST_PAIR.fixer.y - 22 - 24).toBeGreaterThanOrEqual(MINI_BOX.y + MINI_BOX.h);
    expect(TEST_PAIR.fixerTextAt.y + 38 + 12).toBeLessThanOrEqual(TEST_PAIR.fixed.y);
    expect(markup).toMatch(new RegExp(`data-build="${TEST_PAIR.fixerKey}">.*?>${TEST_PAIR.fixerText}<`));
    expect(SCREEN_PAIR.fixed.y + SCREEN_PAIR.fixed.h).toBeLessThan(FIELD.floor);
    expect(SCREEN_PAIR.fixed.x + SCREEN_PAIR.fixed.w).toBeLessThanOrEqual(FIELD.right);
  });

  it("20: names the person who checks the screens, in the labels' row under the fixed screen, clear of its label", () => {
    expect(SCREEN_PAIR.personText).toBe("A person checks");
    expect(visible(stateAt("tested.play")[SCREEN_PAIR.personKey])).toBe(true);
    expect(start(on("tested.play", SCREEN_PAIR.personKey))).toBeGreaterThan(start(on("tested.play", SCREEN_PAIR.fixedKey)));
    const { person, personTextAt, fixed } = SCREEN_PAIR;
    expect(person.y).toBeGreaterThan(fixed.y + fixed.h);
    expect(person.y + person.h).toBeLessThanOrEqual(FIELD.floor);
    // "Fixed" is about 90 px wide at 32 px: the person stands well clear of it.
    expect(person.x).toBeGreaterThanOrEqual(fixed.x + 90 + 48);
    expect(personTextAt.x).toBeGreaterThan(person.x + person.w);
    expect(personTextAt.x + personTextAt.w).toBeLessThanOrEqual(FIELD.right);
  });

  it("21: lands the three marks one at a time under one piece of work, the person's last, the board small beside it", () => {
    const marks = REVIEW.marks.map((mark) => start(on("reviewed.play", mark.key)));
    expect([...marks].sort((a, b) => a - b)).toEqual(marks);
    expect(REVIEW.marks.map((mark) => mark.text)).toEqual(shown("reviewed", "play").slice(1));
    for (const mark of REVIEW.marks) {
      expect(visible(stateAt("reviewed.play")[mark.key]), mark.key).toBe(true);
      expect(mark.at.y + REVIEW.markR + 12).toBeLessThanOrEqual(FIELD.floor);
    }
    // The builder who wrote the piece stands beside it, named.
    expect(REVIEW.builderText).toBe("Builder");
    expect(visible(stateAt("reviewed.play")[REVIEW.builderKey])).toBe(true);
    expect(REVIEW.builder.x - 26).toBeGreaterThan(REVIEW.piece.x + REVIEW.piece.w + 24);
    expect(REVIEW.builderTextAt.x + REVIEW.builderTextAt.w).toBeLessThanOrEqual(FIELD.right);
    expect(stateAt("reviewed.play")[BOARD_KEY]).toMatchObject(MINI_MOVE);
  });

  it("22: writes one lesson a wave, each after its note reaches the panel, then a new session reads the panel", () => {
    NOTES_PANEL.lessons.forEach((lesson, i) => expect(start(on("memory.play", lesson.key))).toBeGreaterThan(start(on("memory.play", NOTE_DOTS[i].key))));
    const lastLesson = start(on("memory.play", NOTES_PANEL.lessons[2].key));
    expect(start(on("memory.play", SESSION.key))).toBeGreaterThan(lastLesson);
    for (const lesson of NOTES_PANEL.lessons) expect(start(on("memory.play", lesson.readKey))).toBeGreaterThan(start(on("memory.play", SESSION.key)));
    expect(NOTES_PANEL.at.y + NOTES_PANEL.at.h).toBeLessThanOrEqual(FIELD.floor);
  });

  it("22a: keeps this week outlined in the year, the sprints round the release solid, the next one started, and ends on the release and the products", () => {
    const year = stateAt("scale.play");
    expect(year[THIS_WEEK.key]).toMatchObject({ autoAlpha: 1 });
    for (const s of NOW.finishing)
      expect(year[yearFill(s)], `sprint ${s}`).toMatchObject({
        "--k": 1,
        "--solid": 1,
      });
    expect(year[yearFill(NOW.starting)]).toMatchObject({ "--k": STARTED });
    expect(year[dotKey(NOW.starting)]).toMatchObject({ autoAlpha: 1 });
    for (const key of [RELEASE.markKey, RELEASE.personKey, RELEASE.releasedKey, CHECKS.key, LEGEND.key, ...PRODUCTS.map((p) => p.key), ...COLUMNS.map((c) => c.key)])
      expect(visible(year[key]), key).toBe(true);
    expect(year[BOARD_KEY]).toMatchObject({ autoAlpha: 0 });
    expect(start(on("scale.play", RELEASE.releasedKey))).toBeGreaterThan(start(on("scale.play", RELEASE.markKey)));
    expect(LEGEND.y + 32).toBeLessThanOrEqual(FIELD.floor);
    expect(LEGEND.y + 32).toBeLessThan(STAGE.h - 46);
    expect(pictureOf("scale").steps[0].show).toContain("Released");
  });
});

describe("end frames without collisions", () => {
  /** A set line of 26 px words is about 32 px tall. */
  const LINE = 32;
  const TICK_R = 9;

  it("17: the agent that read the table leaves once the tool is built", () => {
    expect(visible(stateAt("data.play")[READER.key])).toBe(false);
  });

  it("19: each passed tick sits inside its cell, clear of the agent on the cell and of the wave's outline, and the first reviewer's name clears the outline", () => {
    for (const cell of CELLS) expect(tickAt(cell).x + TICK_R, `${cell.row}.${cell.slot}`).toBeLessThanOrEqual(cell.x + cell.w);
    for (const crew of [...CHECKERS, FIXER]) expect(checkAt(crew.cell).x + 1.1 * (AGENT_R + 1) + 4, crew.key).toBeLessThanOrEqual(tickAt(crew.cell).x - TICK_R);
    for (const cell of CELLS.filter((c) => c.slot < 2 * GRID.sprint)) expect(tickAt(cell).x + TICK_R, `${cell.row}.${cell.slot}`).toBeLessThan(WAVE.at.x);
    const reviewer = NAMES.kinds.find((name) => name.kind === "reviewer")!;
    expect(reviewer.at.y + LINE).toBeLessThanOrEqual(WAVE.at.y);
  });

  it("20: the flagged button sits inside its screen, and its ring clears the field above and the label below", () => {
    const parts = screenParts(SCREEN_PAIR.flagged);
    const { wrongButton: wrong, ring } = parts;
    expect(wrong.y + wrong.h).toBeLessThanOrEqual(SCREEN_PAIR.flagged.y + SCREEN_PAIR.flagged.h - 6);
    const lastField = parts.fields[2].field;
    expect(ring.cy - ring.ry - 3).toBeGreaterThanOrEqual(lastField.y + lastField.h);
    expect(ring.cy + ring.ry + 3).toBeLessThan(SCREEN_PAIR.labelY);
  });

  it("22a: the products settle beside the release with air above and below, rising off its marker", () => {
    for (const product of PRODUCTS) {
      expect(product.icon.y, product.text).toBeGreaterThanOrEqual(topOf("scale") + 24);
      expect(product.labelAt.y + LINE + 24, product.text).toBeLessThanOrEqual(MARKERS.y - MARKERS.r);
      expect(product.icon.x, product.text).toBeGreaterThanOrEqual(RELEASE.releasedAt.x + 160);
      expect(product.icon.x + product.icon.w / 2 + product.rise.x).toBe(RELEASE.mark.x);
      expect(product.icon.y + product.icon.h / 2 + product.rise.y).toBe(RELEASE.mark.y);
    }
    for (const marker of MARKERS.at) expect(marker + MARKERS.r + 40).toBeLessThanOrEqual(FIELD.right);
  });

  it("22a: marks this week with a tall outline across every row of the year at its sprint, named under it on the legend's line", () => {
    const { outline, block, at } = THIS_WEEK;
    const rows = COLUMNS.flatMap((column) => column.blocks);
    expect(outline.y).toBeLessThan(Math.min(...rows.map((b) => b.y)));
    expect(outline.y + outline.h).toBeGreaterThan(Math.max(...rows.map((b) => b.y + b.h)));
    expect(outline.x).toBeLessThan(block.x);
    expect(outline.x + outline.w).toBeGreaterThan(block.x + block.w);
    expect(outline.x + outline.w).toBeLessThan(block.x + YEAR.pitch);
    expect(at.y).toBeGreaterThan(outline.y + outline.h);
    expect(at.y + LINE).toBeLessThanOrEqual(FIELD.floor);
    expect(LEGEND.y).toBe(at.y);
  });
});
