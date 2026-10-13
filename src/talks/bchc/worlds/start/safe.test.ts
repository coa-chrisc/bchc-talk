/** Slide 38s, data security and governance: what its click shows, in what order, and where it ends (steps-safe.ts). */
import { describe, expect, it } from "vitest";
import { storyOf } from "../../script/find";
import { endOf, endState, longestStep, compiled, markup, movesOf, nodeOf, only, showsAtEnd, steps, text } from "./harness";
import { EASE } from "@/components/deck/kit";
import { TITLES, bandOf, kickerOf } from "./layout";
import { SAFE } from "./layout-safe";

const PLAY = "safe.play";
const { fence, gate, dept, publicData, personal, approver, record, changes, lift, undone } = SAFE;
/** Room a table's name takes over the table: its offset and half a line of the label type. */
const NAME_CLEAR = 24 + 16;

describe("slide 38s: data security and governance", () => {
  it("sits between 38 and 38a, under the step-two label held over from 36, its title on two lines and both story lines under it", () => {
    const ids = steps.map((step) => step.id);
    expect(ids.slice(ids.indexOf("approver.play"), ids.indexOf("approver.play") + 3)).toEqual(["approver.play", PLAY, "questions.play"]);
    expect(kickerOf("safe")?.key).toBe(kickerOf("training")?.key);
    expect(TITLES.find((title) => title.picture === "safe")?.lines).toEqual(["Rolling out AI safely means controlling the data", "and keeping a person in charge."]);
    expect(bandOf("safe")).toBe("two");
    for (const line of storyOf("safe")) {
      expect(line.length, line).toBeLessThanOrEqual(100);
      expect(text).toContain(line);
    }
  });

  it("plays in one click inside 12 s", () => {
    const end = longestStep(compiled)[steps.findIndex((step) => step.id === PLAY)];
    expect(end).toBeLessThanOrEqual(12);
  });

  it("puts up the fence round your department, named, with its gate, before anything moves", () => {
    const up = endOf(only(movesOf(PLAY, fence.key, "--d")));
    expect(text).toContain(fence.label.text);
    for (const key of [fence.key, fence.posts.key, fence.label.key, gate.key, dept.key]) expect(showsAtEnd(PLAY, key), key).toBe(true);
    expect(only(movesOf(PLAY, gate.key, "--k").filter((play) => play.on["--k"] === 1)).at).toBeGreaterThanOrEqual(up - 1e-9);
    // Your department stands inside the fence, a clear gap from it all round.
    expect(dept.at.x).toBeGreaterThan(fence.at.x + 16);
    expect(dept.at.y).toBeGreaterThan(fence.at.y + 16);
    expect(dept.at.x + dept.at.w).toBeLessThan(fence.at.x + fence.at.w - 16);
    expect(dept.at.y + dept.at.h).toBeLessThan(fence.at.y + fence.at.h - 16);
    // Off the footer, and inside the stage's margins.
    expect(fence.at.y + fence.at.h).toBeLessThanOrEqual(968);
    expect(fence.at.x + fence.at.w).toBeLessThanOrEqual(1824);
  });

  it("lets public data in through the open gate, shuts the gate behind it, and stops personal or health data outside, where it stays", () => {
    const [opens, shuts] = movesOf(PLAY, gate.key, "--k");
    expect([opens.on["--k"], shuts.on["--k"]]).toEqual([1, 0]);
    const goesIn = only(movesOf(PLAY, publicData.key, "x"));
    expect(goesIn.at).toBeGreaterThanOrEqual(opens.at);
    expect(shuts.at).toBeGreaterThanOrEqual(endOf(goesIn) - 1e-9);
    // In: inside your department, past its doorway, and in the lane, inside the gate's opening.
    const inside = { x: publicData.at.x + publicData.through, y: publicData.at.y + publicData.lane };
    expect(inside.x).toBeGreaterThan(dept.at.x);
    expect(inside.x + publicData.at.w).toBeLessThan(approver.at.x);
    expect(inside.y).toBeGreaterThan(gate.hinge.y + 24);
    expect(inside.y + publicData.at.h).toBeLessThan(gate.hinge.y + gate.length);
    expect(endState(PLAY)[publicData.key]).toMatchObject({ x: publicData.through, y: publicData.lane });
    expect(endState(PLAY)[gate.key]).toMatchObject({ "--k": 0 });
    // Personal or health data reaches the gate only once it is shut, meets it, is pushed back, and waits outside, named.
    const [tries, stays] = movesOf(PLAY, personal.key, "x");
    expect(endOf(tries)).toBeGreaterThanOrEqual(endOf(shuts) - 1e-9);
    expect(personal.at.x + personal.tries + personal.at.w).toBeLessThanOrEqual(gate.hinge.x - 4);
    expect(personal.at.x + personal.tries + personal.at.w).toBeGreaterThan(gate.hinge.x - 16);
    expect(stays.at).toBeGreaterThanOrEqual(endOf(tries) - 1e-9);
    expect(endState(PLAY)[personal.key]).toMatchObject({ x: personal.stays, y: personal.lane });
    expect(personal.name.x + personal.stays).toBeLessThan(fence.at.x - 24);
    for (const table of [publicData, personal]) {
      expect(showsAtEnd(PLAY, table.key), table.key).toBe(true);
      expect(text).toContain(table.text);
    }
  });

  it("names your department's dashed outline inside the fence, at its top left, from the script", () => {
    expect(text).toContain(dept.label.text);
    expect(dept.label.text).toBe("Your department");
    expect(showsAtEnd(PLAY, dept.label.key)).toBe(true);
    expect(dept.label.at.x).toBeGreaterThan(dept.at.x);
    expect(dept.label.at.y - dept.at.y).toBeGreaterThanOrEqual(24);
    // Above the doorway, so nothing that comes in passes over it.
    expect(dept.label.at.y + 16).toBeLessThan(gate.hinge.y);
    // It comes up after the outline starts to wipe on.
    expect(only(movesOf(PLAY, dept.label.key)).at).toBeGreaterThan(only(movesOf(PLAY, dept.key)).at);
  });

  it("uses the frame: the tables wait at the left, named inside the stage's margin, and the fence takes the rest", () => {
    /** A name's width in the label type, at 0.55 em a letter: wider than Geist sets these words. */
    const width = (words: string) => words.length * 26 * 0.55;
    for (const table of [publicData, personal]) expect(table.name.x - width(table.text), table.key).toBeGreaterThanOrEqual(96);
    expect(fence.at.x).toBeLessThanOrEqual(560);
    expect(fence.at.x + fence.at.w).toBe(1824);
    // Personal or health data waits over the lane and public data under it, so neither crosses the other's name on its way to the lane.
    expect(personal.at.y + personal.at.h).toBeLessThan(publicData.at.y + publicData.lane - NAME_CLEAR);
    expect(publicData.at.y).toBeGreaterThan(personal.at.y + personal.lane + publicData.at.h);
    // The open gate's leaf, swung out level with its hinge, passes under the table waiting above.
    expect(gate.hinge.y - 4 - (personal.at.y + personal.at.h)).toBeGreaterThanOrEqual(8);
  });

  it("passes three changes, one at a time, by the approver, whose orange \"a person approves\" mark lands on each before it goes on to the record", () => {
    expect(text).toEqual(expect.arrayContaining([approver.label.text, record.label.text]));
    let last = -1;
    for (const change of changes) {
      const [out, toDesk, toSlot] = movesOf(PLAY, change.key, "x");
      const marked = only(movesOf(PLAY, change.mark.key, "--d"));
      expect([out.on.x, toDesk.on.x, toSlot.on.x]).toEqual([change.out, change.desk.x, change.slot.x]);
      expect(out.at).toBeGreaterThan(last);
      last = out.at;
      expect(out.at).toBeGreaterThanOrEqual(endOf(only(movesOf(PLAY, publicData.key, "x"))) - 1e-9);
      expect(marked.at).toBeGreaterThanOrEqual(endOf(toDesk) - 1e-9);
      expect(toSlot.at).toBeGreaterThanOrEqual(endOf(marked) - 1e-9);
      // At the desk the change stands just past the approver, at their foot, and level with its place on the record.
      const atDesk = { x: change.at.x + change.desk.x, y: change.at.y + change.desk.y };
      expect(atDesk.x).toBeGreaterThan(approver.at.x + approver.at.w);
      expect(atDesk.x - (approver.at.x + approver.at.w)).toBeLessThanOrEqual(32);
      expect(atDesk.y).toBeGreaterThanOrEqual(approver.at.y + approver.at.h + 12);
      expect(change.desk.y).toBe(change.slot.y);
      // On its way it drops to the desk's level before it reaches the approver, so it never crosses them: the drop eases out, starting with the move across.
      const drop = only(movesOf(PLAY, change.key, "y").filter((play) => play.on.y === change.desk.y && play.at === toDesk.at));
      expect(drop.ease).toBe(EASE.out);
      expect(drop.duration).toBeLessThanOrEqual(toDesk.duration);
      // Then it goes along the record's level to its place, under the approver's foot and over the record's name.
      expect(record.label.at.y - 16).toBeGreaterThan(record.from.y);
      // On the record: standing on its line, a time stamp under it once it lands.
      expect(change.at.y + change.slot.y + change.at.h).toBe(record.from.y);
      expect(only(movesOf(PLAY, change.stamp.key, "autoAlpha").filter((play) => play.on.autoAlpha === 1)).at).toBeGreaterThan(toSlot.at);
      expect(markup).toContain(`class="dk-human" data-build="${change.mark.key}"`);
      expect(nodeOf(change.mark.key)?.parent?.key).toBe(change.key);
    }
    // The orange mark of a person approving, as on slides 36a to 38, not a tick, which means a check passed.
    expect(markup).not.toContain("st-tick--approve");
    // Each change's place is further along the record than the last, and the line reaches past the newest.
    const slots = changes.map((change) => change.at.x + change.slot.x);
    expect(slots).toEqual([...slots].sort((a, b) => a - b));
    changes.forEach((change, i) => {
      const reach = record.from.x + (record.to.x - record.from.x) * change.reach;
      expect(reach, change.key).toBeGreaterThan(slots[i] + change.at.w);
    });
  });

  it("undoes the last change: it lifts off the record, faded and named Undone, its time stamp goes, and the line closes up behind the one before", () => {
    const final = changes[changes.length - 1];
    const before = changes[changes.length - 2];
    const lifts = movesOf(PLAY, final.key, "y").filter((play) => play.on.y === final.slot.y - lift);
    expect(lifts).toHaveLength(1);
    const landed = endOf(only(movesOf(PLAY, final.stamp.key, "autoAlpha").filter((play) => play.on.autoAlpha === 1)));
    expect(lifts[0].at).toBeGreaterThanOrEqual(landed - 1e-9);
    const end = endState(PLAY);
    expect(end[final.key]).toMatchObject({ y: final.slot.y - lift, autoAlpha: 0.3 });
    expect(end[final.stamp.key]).toMatchObject({ autoAlpha: 0 });
    expect(end[record.key]).toMatchObject({ "--d": before.reach });
    expect(only(movesOf(PLAY, undone.key)).at).toBeGreaterThan(lifts[0].at);
    expect(showsAtEnd(PLAY, undone.key)).toBe(true);
    expect(text).toContain(undone.text);
    // Undone sits over the lifted change, centred on it, clear of it.
    const page = { x: final.at.x + final.slot.x, y: final.at.y + final.slot.y - lift };
    expect(undone.at.x).toBe(page.x + final.at.w / 2);
    expect(page.y - undone.at.y).toBeGreaterThanOrEqual(24);
    // Every other change stays on the record, marked, with its time stamp.
    for (const change of changes.slice(0, -1)) {
      expect(end[change.key], change.key).toMatchObject({ autoAlpha: 1, x: change.slot.x, y: change.slot.y });
      expect(showsAtEnd(PLAY, change.mark.key), change.mark.key).toBe(true);
      expect(showsAtEnd(PLAY, change.stamp.key), change.stamp.key).toBe(true);
    }
    expect(nodeOf(final.mark.key)?.parent?.key).toBe(final.key);
  });
});
