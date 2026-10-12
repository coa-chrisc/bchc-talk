import { describe, expect, it } from "vitest";
import { commandFor, swipeCommand, typeDigit } from "./keys";

describe("the deck's keys", () => {
  it("steps on the arrows, Space, Backspace and a clicker's PageDown and PageUp", () => {
    for (const key of ["ArrowRight", " ", "PageDown"]) expect(commandFor({ key })).toBe("next");
    for (const key of ["ArrowLeft", "PageUp", "Backspace"]) expect(commandFor({ key })).toBe("prev");
    expect(commandFor({ key: "Enter" })).toBe("enter");
    expect(commandFor({ key: "Home" })).toBe("first");
    expect(commandFor({ key: "End" })).toBe("last");
  });

  it("opens the views and blacks the screen on a letter in either case", () => {
    expect(commandFor({ key: "O" })).toBe("overview");
    expect(commandFor({ key: "n" })).toBe("notes");
    expect(commandFor({ key: "h" })).toBe("hud");
    expect(commandFor({ key: "b" })).toBe("blackout");
    expect(commandFor({ key: "." })).toBe("blackout");
    expect(commandFor({ key: "Escape" })).toBe("close");
  });

  it("takes digits for a typed jump", () => {
    expect(commandFor({ key: "7" })).toEqual({ digit: 7 });
    expect(typeDigit("", 1)).toBe("1");
    expect(typeDigit("12", 3)).toBe("123");
    expect(typeDigit("1234", 5)).toBe("2345");
  });

  it("swallows a clicker's F5 and a held key's repeats", () => {
    expect(commandFor({ key: "F5" })).toBe("noop");
    expect(commandFor({ key: "ArrowRight", repeat: true })).toBe("noop");
    expect(commandFor({ key: "PageDown", repeat: true })).toBe("noop");
  });

  it("has no full screen key, and leaves the browser's shortcuts, typing and a control's own keys alone", () => {
    expect(commandFor({ key: "f" })).toBeNull();
    expect(commandFor({ key: "r", metaKey: true })).toBeNull();
    expect(commandFor({ key: "ArrowLeft", altKey: true })).toBeNull();
    expect(commandFor({ key: "n", typing: true })).toBeNull();
    expect(commandFor({ key: " ", onControl: true })).toBeNull();
    expect(commandFor({ key: "Enter", onControl: true })).toBeNull();
    expect(commandFor({ key: "ArrowRight", onControl: true })).toBe("next");
    expect(commandFor({ key: "x" })).toBeNull();
  });

  it("lets a held Space or Enter press a control once, as a held key steps once", () => {
    expect(commandFor({ key: "Enter", onControl: true, repeat: true })).toBe("noop");
    expect(commandFor({ key: " ", onControl: true, repeat: true })).toBe("noop");
  });
});

describe("a swipe", () => {
  it("steps forward to the left and back to the right", () => {
    expect(swipeCommand(-120, 10)).toBe("next");
    expect(swipeCommand(120, -10)).toBe("prev");
  });

  it("is not a short drag or a mostly vertical one", () => {
    expect(swipeCommand(-30, 0)).toBeNull();
    expect(swipeCommand(-90, 80)).toBeNull();
  });
});
