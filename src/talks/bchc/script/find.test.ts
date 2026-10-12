import { describe, expect, it } from "vitest";
import { breakAfter, elide, pictureOf, shown, stepOf, storyOf } from "./find";

describe("reading the script by id", () => {
  it("finds a picture, a step and what the step shows", () => {
    expect(pictureOf("the-catalog").part).toBe(1);
    expect(pictureOf("github").number).toBe("36a");
    expect(stepOf("network", "outside").show).toEqual(["Detroit", "Philadelphia", "Dallas County", "Boston", "Washington, D.C.", "San Antonio", "Vendors", "Before", "Now"]);
    expect(shown("six-steps", "play")).toEqual(["Form", "Request", "Draft", "Checks", "Approval", "Live", "Automatic", "You can follow it the whole way", "Published"]);
  });

  it("finds a picture's story lines, A then B", () => {
    expect(storyOf("network")).toEqual(["Each circle is a health department, and in the middle is everything we share.", "Where each of us relied on a vendor, we can rely on what we share, and pass tools between us."]);
    expect(storyOf("three")).toHaveLength(1);
    expect(storyOf("thanks")).toEqual([]);
    expect(() => storyOf("nowhere")).toThrow(/nowhere/);
  });

  it("fails loudly on an id the script does not have", () => {
    expect(() => pictureOf("nowhere")).toThrow(/nowhere/);
    expect(() => stepOf("the-catalog", "nowhere")).toThrow(/nowhere/);
  });
});

describe("setting a string on several lines", () => {
  it("breaks after each word, in order, and keeps every word", () => {
    expect(breakAfter("Public Health AI & Tech Exchange", "Health", "Tech")).toEqual(["Public Health", "AI & Tech", "Exchange"]);
    expect(breakAfter("Taken down first, discussed second", "first,")).toEqual(["Taken down first,", "discussed second"]);
  });

  it("refuses a break the string does not hold", () => {
    expect(() => breakAfter("One place to look", "nowhere")).toThrow(/cannot break/);
  });
});

describe("shortening a file path", () => {
  it("leaves a short path alone", () => {
    expect(elide("catalog/index.md", 22)).toBe("catalog/index.md");
  });

  it("keeps the folder's start and the file's name within the length", () => {
    const short = elide("catalog/inspection-backlog-dashboard/index.md", 22);
    expect(short).toBe("catalog/insp…/index.md");
    expect(short.length).toBe(22);
  });
});
