import * as Ably from "ably";
import { describe, expect, it, vi } from "vitest";
import { CODE_PATTERN, relayChannel, sessionOf } from "./remote-protocol";
import { capabilityFor, fromThisSite, handleRemote, issueCode, MESSAGES, signTokenRequest, TOKEN_TTL, verifyCode } from "./remote-session";

// The real comparison, watched: the tests below need to know it is the one in use.
const { compare } = vi.hoisted(() => ({ compare: vi.fn() }));
vi.mock("node:crypto", async (original) => {
  const actual = await original<typeof import("node:crypto")>();
  compare.mockImplementation(actual.timingSafeEqual);
  return { ...actual, timingSafeEqual: compare };
});

const KEY = "appId.keyId:c2VjcmV0LXNlY3JldC1zZWNyZXQ";
const OTHER_KEY = "appId.keyId:b3RoZXItc2VjcmV0LW90aGVyLXNlY3JldA";
const SECRET = KEY.split(":")[1];
/** Bytes that count up from `start`, so a test knows the id and the nonce it will get. */
const counting = (start: number) => (bytes: number) => Buffer.from(Array.from({ length: bytes }, (_, i) => (start + i) % 256));
const swap = (text: string, at: number) => text.slice(0, at) + (text[at] === "A" ? "B" : "A") + text.slice(at + 1);

describe("a pairing code", () => {
  it("is 96 random bits and a 96-bit tag, and verifies for the deck it was issued for", () => {
    const code = issueCode(KEY, "bchc");
    expect(code).toMatch(CODE_PATTERN);
    const [id, tag] = code.split(".");
    expect(Buffer.from(id, "base64url")).toHaveLength(12);
    expect(Buffer.from(tag, "base64url")).toHaveLength(12);
    expect(verifyCode(KEY, "bchc", code)).toBe(id);
    expect(issueCode(KEY, "bchc")).not.toBe(code);
  });

  it("takes its id from the randomness it is given", () => {
    const code = issueCode(KEY, "bchc", counting(0));
    expect(sessionOf(code)).toBe(counting(0)(12).toString("base64url"));
    expect(issueCode(KEY, "bchc", counting(0))).toBe(code);
  });

  it("fails with any character of its id or its tag changed", () => {
    const code = issueCode(KEY, "bchc");
    for (let at = 0; at < code.length; at++) {
      if (code[at] !== ".") expect(verifyCode(KEY, "bchc", swap(code, at))).toBeNull();
    }
  });

  it("fails for another deck, and under another key", () => {
    const code = issueCode(KEY, "bchc");
    expect(verifyCode(KEY, "other", code)).toBeNull();
    expect(verifyCode(OTHER_KEY, "bchc", code)).toBeNull();
  });

  it("fails at the wrong length or the wrong shape, without throwing", () => {
    const code = issueCode(KEY, "bchc");
    const [id, tag] = code.split(".");
    for (const bad of [code.slice(0, -1), code + "A", id, `${id}.`, `.${tag}`, `${id}.${tag}.${tag}`, `${id}:${tag}`, `${id}.${tag.slice(0, 15)}=`, ` ${code}`, "", "..", null, undefined, 7, {}, [code]]) {
      expect(verifyCode(KEY, "bchc", bad)).toBeNull();
    }
  });

  it("is compared in constant time, on tags of equal length", () => {
    const code = issueCode(KEY, "bchc");
    compare.mockClear();
    expect(verifyCode(KEY, "bchc", code)).not.toBeNull();
    expect(verifyCode(KEY, "bchc", swap(code, code.length - 1))).toBeNull();
    expect(compare).toHaveBeenCalledTimes(2);
    for (const [given, expected] of compare.mock.calls) expect(given).toHaveLength(expected.length);
    // A code of the wrong shape is refused on its shape alone: there is no tag to compare.
    compare.mockClear();
    expect(verifyCode(KEY, "bchc", code.slice(0, -1))).toBeNull();
    expect(compare).not.toHaveBeenCalled();
  });
});

describe("a session's token request", () => {
  const channel = relayChannel("bchc", "AAAAAAAAAAAAAAAA");

  it("is for the session's one channel, to publish and subscribe, for three hours", () => {
    const request = signTokenRequest(KEY, channel, { random: counting(1), now: () => 1_700_000_000_000 });
    expect(JSON.parse(request.capability)).toEqual({ "deck:bchc:AAAAAAAAAAAAAAAA": ["publish", "subscribe"] });
    expect(capabilityFor(channel)).toBe(request.capability);
    expect(request).toMatchObject({ keyName: "appId.keyId", ttl: TOKEN_TTL, timestamp: 1_700_000_000_000 });
    expect(TOKEN_TTL).toBe(3 * 60 * 60 * 1000);
    expect(request.nonce).toHaveLength(32);
  });

  it("is signed exactly as the relay's own library signs one", async () => {
    const mine = signTokenRequest(KEY, channel, { random: counting(1), now: () => 1_700_000_000_000 });
    const rest = new Ably.Rest({ key: KEY });
    const theirs = await rest.auth.createTokenRequest({ capability: mine.capability, ttl: mine.ttl, timestamp: mine.timestamp, nonce: mine.nonce });
    expect(mine).toEqual({ keyName: theirs.keyName, ttl: theirs.ttl, capability: theirs.capability, timestamp: theirs.timestamp, nonce: theirs.nonce, mac: theirs.mac });
  });

  it("carries the key's name and never its secret", () => {
    expect(JSON.stringify(signTokenRequest(KEY, channel))).not.toContain(SECRET);
    expect(() => signTokenRequest("not-a-key", channel)).toThrow();
  });
});

describe("the remote's route", () => {
  const deps = { apiKey: KEY, deckId: "bchc", random: counting(3), now: () => 1_700_000_000_000 };

  it("answers 503 in plain words when no key is set, whatever is asked", () => {
    for (const apiKey of [undefined, "", "no-colon", "name:", "has space.key:secret"]) {
      for (const body of [{ op: "open" }, { op: "join", code: "x" }, null]) {
        expect(handleRemote(body, { ...deps, apiKey })).toEqual({ status: 503, body: "The phone remote is not set up." });
      }
    }
  });

  it("opens a session: a code that verifies, and a token for that session's channel alone", () => {
    const reply = handleRemote({ op: "open" }, deps);
    if (reply.status !== 200 || !reply.body.code) throw new Error("not opened");
    const id = verifyCode(KEY, "bchc", reply.body.code);
    expect(id).toBe(counting(3)(12).toString("base64url"));
    expect(Object.keys(JSON.parse(reply.body.tokenRequest.capability))).toEqual([`deck:bchc:${id}`]);
    expect(JSON.stringify(reply.body)).not.toContain(SECRET);
  });

  it("lets a holder of the code join the same channel, and gives it no new code", () => {
    const opened = handleRemote({ op: "open" }, deps);
    if (opened.status !== 200 || !opened.body.code) throw new Error("not opened");
    const joined = handleRemote({ op: "join", code: opened.body.code }, deps);
    if (joined.status !== 200) throw new Error("not joined");
    expect(joined.body.code).toBeUndefined();
    expect(joined.body.tokenRequest.capability).toBe(opened.body.tokenRequest.capability);
  });

  it("refuses every bad join with the same 403 and the same words", () => {
    const opened = handleRemote({ op: "open" }, deps);
    if (opened.status !== 200 || !opened.body.code) throw new Error("not opened");
    const { code } = opened.body;
    const bad = [swap(code, 0), swap(code, 20), code.slice(0, -1), "", "x".repeat(65), "x".repeat(5000), 7, null, undefined, { code }];
    for (const attempt of bad) {
      expect(handleRemote({ op: "join", code: attempt }, deps)).toEqual({ status: 403, body: MESSAGES.refused });
    }
    expect(handleRemote({ op: "join", code: issueCode(OTHER_KEY, "bchc") }, deps)).toEqual({ status: 403, body: MESSAGES.refused });
    expect(handleRemote({ op: "join", code: issueCode(KEY, "other") }, deps)).toEqual({ status: 403, body: MESSAGES.refused });
  });

  it("answers 400 to what is not a request at all", () => {
    for (const body of [null, "open", 3, [], {}, { op: "close" }, { op: ["join"] }]) {
      expect(handleRemote(body, deps)).toEqual({ status: 400, body: MESSAGES.bad });
    }
  });
});

describe("where a request came from", () => {
  const hosts = ["aboveearth.example", null];

  it("takes the browser's word that it is this site's own page", () => {
    expect(fromThisSite({ site: "same-origin", origin: "https://aboveearth.example", hosts })).toBe(true);
    expect(fromThisSite({ site: null, origin: "https://aboveearth.example", hosts })).toBe(true);
    expect(fromThisSite({ site: null, origin: null, hosts })).toBe(true);
  });

  it("refuses a request another site's page made", () => {
    for (const site of ["cross-site", "same-site", "none"]) expect(fromThisSite({ site, origin: "https://aboveearth.example", hosts })).toBe(false);
    expect(fromThisSite({ site: null, origin: "https://elsewhere.example", hosts })).toBe(false);
    expect(fromThisSite({ site: null, origin: "null", hosts })).toBe(false);
    expect(fromThisSite({ site: null, origin: "https://aboveearth.example", hosts: [null, null] })).toBe(false);
  });
});
