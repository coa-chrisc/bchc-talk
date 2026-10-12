import { describe, expect, it } from "vitest";
import { formatHash, parseHash, type Outline } from "./deck-url";

const OUTLINE: Outline = [
  { id: "opening", steps: ["title", "the-promise", "june"] },
  { id: "the-catalog", steps: ["the-form", "an-issue", "a-draft", "a-person-merges", "live"] },
  { id: "close", steps: ["thanks"] },
];

describe("the deck's address", () => {
  it("names a world, and the step when it is past the first", () => {
    expect(formatHash(OUTLINE, { world: 0, step: 0 })).toBe("#/opening");
    expect(formatHash(OUTLINE, { world: 1, step: 3 })).toBe("#/the-catalog/a-person-merges");
    expect(formatHash(OUTLINE, { world: 9, step: 0 })).toBe("");
    expect(formatHash(OUTLINE, { world: 2, step: 4 })).toBe("");
  });

  it("reads back every address it writes", () => {
    OUTLINE.forEach((entry, world) => {
      entry.steps.forEach((_, step) => {
        expect(parseHash(formatHash(OUTLINE, { world, step }), OUTLINE)).toEqual({ world, step });
      });
    });
  });

  it("opens the world when the step is missing or unknown, and reads a number as a place", () => {
    expect(parseHash("#/the-catalog", OUTLINE)).toEqual({ world: 1, step: 0 });
    expect(parseHash("#/the-catalog/", OUTLINE)).toEqual({ world: 1, step: 0 });
    expect(parseHash("#/the-catalog/renamed-step", OUTLINE)).toEqual({ world: 1, step: 0 });
    expect(parseHash("#/the-catalog/2", OUTLINE)).toEqual({ world: 1, step: 2 });
    expect(parseHash("#/the-catalog/99", OUTLINE)).toEqual({ world: 1, step: 4 });
    expect(parseHash("/close/thanks", OUTLINE)).toEqual({ world: 2, step: 0 });
  });

  it("names no world for anything else", () => {
    for (const hash of ["", "#", "#contact", "#/unknown", "#/opening/title/2", "#/%E0%A4%A"]) {
      expect(parseHash(hash, OUTLINE)).toBeNull();
    }
  });
});
