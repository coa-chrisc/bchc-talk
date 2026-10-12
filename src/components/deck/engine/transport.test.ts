import { describe, expect, it } from "vitest";
import { PROTOCOL, intent, parseMessage, state, type Snapshot } from "./transport";

const snapshot: Snapshot = { world: 0, step: 2, worldId: "proof", stepId: "work", number: 3, total: 10, title: "Work", note: null, nextTitle: "Check", started: null, blackout: false };

describe("messages between the deck and its other screens", () => {
  it("round-trips an intent and a snapshot, as objects and as JSON", () => {
    expect(parseMessage(intent({ type: "next" }))).toEqual({ v: PROTOCOL, kind: "intent", intent: { type: "next" } });
    expect(parseMessage(JSON.stringify(intent({ type: "goTo", world: 1, step: 4 }, "4821")))).toMatchObject({ code: "4821", intent: { world: 1, step: 4 } });
    expect(parseMessage(state(snapshot))).toEqual(state(snapshot));
  });

  it("carries a remote's whole pairing code, and drops an intent whose code is longer than any could be", () => {
    const code = "AAAAAAAAAAAAAAAA.BBBBBBBBBBBBBBBB";
    expect(parseMessage(JSON.stringify(intent({ type: "next" }, code)))).toEqual({ v: PROTOCOL, kind: "intent", intent: { type: "next" }, code });
    expect(parseMessage(intent({ type: "next" }, "x".repeat(65)))).toBeNull();
  });

  it("drops anything that is not one of ours", () => {
    for (const raw of [null, 42, "not json", "{}", { kind: "intent", intent: { type: "next" } }, { v: 2, kind: "intent", intent: { type: "next" } }]) {
      expect(parseMessage(raw)).toBeNull();
    }
    expect(parseMessage({ v: PROTOCOL, kind: "intent", intent: { type: "reload" } })).toBeNull();
    expect(parseMessage({ v: PROTOCOL, kind: "intent", intent: { type: "goTo", world: -1 } })).toBeNull();
    expect(parseMessage({ v: PROTOCOL, kind: "intent", intent: { type: "goTo", world: "0" } })).toBeNull();
    expect(parseMessage({ v: PROTOCOL, kind: "state", state: { ...snapshot, number: "3" } })).toBeNull();
  });
});
