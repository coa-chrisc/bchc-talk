import { describe, expect, it } from "vitest";
import { CODE_LENGTH, isJoinHash, joinHash, openResponseSchema, readJoinCode, relayChannel, requestSchema, sessionOf } from "./remote-protocol";

const CODE = "AAAAAAAAAAAAAAAA.BBBBBBBBBBBB-_bb";

describe("requests to the remote's route", () => {
  it("accepts the two operations and nothing else", () => {
    expect(requestSchema.safeParse({ op: "open" }).success).toBe(true);
    expect(requestSchema.safeParse({ op: "join", code: CODE }).success).toBe(true);
    for (const raw of [null, "open", [], {}, { op: "close" }, { op: "join" }, { op: "join", code: 7 }, { op: "join", code: "" }, { op: "join", code: "x".repeat(65) }]) {
      expect(requestSchema.safeParse(raw).success).toBe(false);
    }
  });

  it("carries nothing through that the operation does not name", () => {
    expect(requestSchema.parse({ op: "open", deckId: "other", code: CODE })).toEqual({ op: "open" });
  });

  it("checks what the server sends back before the browser uses it", () => {
    const tokenRequest = { keyName: "app.key", ttl: 1000, capability: "{}", timestamp: 1, nonce: "0123456789abcdef", mac: "bWFj" };
    expect(openResponseSchema.safeParse({ code: CODE, tokenRequest }).success).toBe(true);
    expect(openResponseSchema.safeParse({ code: "short", tokenRequest }).success).toBe(false);
    expect(openResponseSchema.safeParse({ code: CODE, tokenRequest: { ...tokenRequest, mac: undefined } }).success).toBe(false);
  });
});

describe("a pairing code's shape and address", () => {
  it("names its session and that session's one channel", () => {
    expect(CODE).toHaveLength(CODE_LENGTH);
    expect(sessionOf(CODE)).toBe("AAAAAAAAAAAAAAAA");
    expect(relayChannel("bchc", "AAAAAAAAAAAAAAAA")).toBe("deck:bchc:AAAAAAAAAAAAAAAA");
  });

  it("travels in the address's fragment and is read back from it", () => {
    expect(joinHash(CODE)).toBe(`#k=${CODE}`);
    expect(readJoinCode(joinHash(CODE))).toBe(CODE);
  });

  it("reads no code from an address that is cut short, padded or not a join address", () => {
    for (const hash of ["", "#", "#k=", `#k=${CODE.slice(0, -1)}`, `#k=${CODE}x`, `#k=${CODE.replace(".", ":")}`, `#/world/step`, `#k=${CODE}&x=1`, `k=${CODE}`]) {
      expect(readJoinCode(hash)).toBeNull();
      expect(sessionOf(hash.slice(3))).toBeNull();
    }
    expect(isJoinHash(`#k=${CODE.slice(0, 5)}`)).toBe(true);
    expect(isJoinHash("#/world/step")).toBe(false);
  });
});
