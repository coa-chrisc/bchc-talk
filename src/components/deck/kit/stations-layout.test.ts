import { describe, expect, it } from "vitest";
import { cardAt, stations } from "./stations-layout";

const row = stations({ id: "row", x: 96, y: 920, headings: ["Form", "Issue", "Draft", "Checks", "Approval", "Live"], human: 4 });

describe("a row of stations", () => {
  it("sets six wells of 208 by 72 on a pitch of 240, with headings 64 above", () => {
    expect(row.stations.map((s) => s.x)).toEqual([96, 336, 576, 816, 1056, 1296]);
    expect(row.stations.every((s) => s.w === 208 && s.h === 72 && s.y === 920)).toBe(true);
    expect(row.stations[2].headAt).toEqual({ x: 576, y: 856 });
    expect(row.box).toEqual({ x: 96, y: 920, w: 1408, h: 72 });
  });

  it("rests the card inset 20 and 12 in the first well and moves it a pitch at a time", () => {
    expect(row.card).toEqual({ x: 116, y: 932, w: 168, h: 48 });
    expect(row.pitch).toBe(240);
    expect(cardAt(row, 1)).toBe(240);
  });

  it("names a link for each gap and the one station where a person decides", () => {
    expect(row.links.map((link) => link.key)).toEqual(["row.l0", "row.l1", "row.l2", "row.l3", "row.l4"]);
    expect(row.links[0].from.x + row.links[0].from.w).toBe(304);
    expect(row.links[0].to.x).toBe(336);
    expect(row.humanKey).toBe("row.human");
    expect(stations({ id: "r", x: 0, y: 0, headings: ["A"] }).humanKey).toBeUndefined();
  });

  it("takes another well size and gap", () => {
    const small = stations({ id: "s", x: 0, y: 0, headings: ["A", "B", "C"], wellW: 100, wellH: 40, gap: 10, cardW: 60, cardH: 20 });
    expect(small.stations.map((s) => s.x)).toEqual([0, 110, 220]);
    expect(small.box.w).toBe(320);
    expect(small.card).toEqual({ x: 20, y: 10, w: 60, h: 20 });
  });
});
