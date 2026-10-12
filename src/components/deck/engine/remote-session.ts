/**
 * The server's half of the phone remote. Server only: it holds the relay's
 * API key, which never leaves it.
 *
 * The server keeps no record of sessions. A pairing code is a random
 * session id and a tag, and the tag is an HMAC of the id under a key only
 * the server has, so a code that verifies is one this server issued. The
 * tag's key is derived from the API key rather than being it, so the two
 * uses of the secret cannot be played against each other.
 *
 * What a browser gets back is a token request: the relay's own signed,
 * single-use note saying "give the bearer a token for this one channel".
 * Signing it needs no call to the relay, so nothing here touches the
 * network. Nothing here logs, and a refusal never says why.
 */
import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import { CODE_PATTERN, relayChannel, requestSchema, type TokenRequest } from "./remote-protocol";

/** Names what the derived key is for. Changing it invalidates every code ever issued. */
const CONTEXT = "above-earth:deck-remote:pairing:v1";
const ID_BYTES = 12;
const TAG_BYTES = 12;

/** How long a relay token lasts. The relay's library asks for another before it runs out. */
export const TOKEN_TTL = 3 * 60 * 60 * 1000;

/** What a session's deck and remote may do on their channel, and only there. */
const OPERATIONS = ["publish", "subscribe"];

export const MESSAGES = {
  unavailable: "The phone remote is not set up.",
  bad: "Bad request.",
  refused: "Forbidden.",
} as const;

export type Deps = {
  /** The relay's API key, `app.key:secret`, or nothing when the remote is not set up. */
  apiKey: string | undefined;
  deckId: string;
  random?: (bytes: number) => Buffer;
  now?: () => number;
};

export type Reply =
  | { status: 200; body: { code?: string; tokenRequest: TokenRequest } }
  | { status: 400 | 403 | 503; body: string };

/** The key's public name and its secret, or null when it is not a key of the relay's shape. */
function splitKey(apiKey: string | undefined) {
  const match = /^([^:\s]+\.[^:\s]+):([^:\s]+)$/.exec(apiKey ?? "");
  return match ? { name: match[1], secret: match[2] } : null;
}

const pairingKey = (apiKey: string) => createHmac("sha256", apiKey).update(CONTEXT).digest();

const tagOf = (apiKey: string, deckId: string, id: string) =>
  createHmac("sha256", pairingKey(apiKey)).update(`${deckId}:${id}`).digest().subarray(0, TAG_BYTES).toString("base64url");

/** A new session's pairing code. */
export function issueCode(apiKey: string, deckId: string, random: (bytes: number) => Buffer = randomBytes): string {
  const id = random(ID_BYTES).toString("base64url");
  return `${id}.${tagOf(apiKey, deckId, id)}`;
}

/** The session id of a code this server issued for this deck, or null. The tags are compared in constant time. */
export function verifyCode(apiKey: string, deckId: string, code: unknown): string | null {
  if (typeof code !== "string" || !CODE_PATTERN.test(code)) return null;
  const [id, tag] = code.split(".");
  const given = Buffer.from(tag, "utf8");
  const expected = Buffer.from(tagOf(apiKey, deckId, id), "utf8");
  return given.length === expected.length && timingSafeEqual(given, expected) ? id : null;
}

/** The capability a session's token carries: its one channel, by its exact name. */
export const capabilityFor = (channel: string) => JSON.stringify({ [channel]: OPERATIONS });

/**
 * A token request for one channel, signed the way the relay's library signs
 * its own (remote-session.test.ts holds the two side by side).
 */
export function signTokenRequest(apiKey: string, channel: string, { random = randomBytes, now = Date.now }: Pick<Deps, "random" | "now"> = {}): TokenRequest {
  const key = splitKey(apiKey);
  if (!key) throw new Error("The relay key is not of the relay's shape.");
  const request = { keyName: key.name, ttl: TOKEN_TTL, capability: capabilityFor(channel), timestamp: now(), nonce: random(16).toString("hex") };
  // The empty line is the client id, which these tokens do not carry.
  const text = [request.keyName, request.ttl, request.capability, "", request.timestamp, request.nonce].join("\n") + "\n";
  return { ...request, mac: createHmac("sha256", key.secret).update(text).digest("base64") };
}

/** Answers one request to the remote's route: `open` from a deck, `join` from a remote. */
export function handleRemote(raw: unknown, { apiKey: given, deckId, random, now }: Deps): Reply {
  // A key pasted with a stray space or line end is still the key.
  const apiKey = given?.trim();
  if (!apiKey || !splitKey(apiKey)) return { status: 503, body: MESSAGES.unavailable };
  const parsed = requestSchema.safeParse(raw);
  if (!parsed.success) {
    // A join with anything wrong in it is refused in the same words as a wrong code.
    const joining = typeof raw === "object" && raw !== null && (raw as { op?: unknown }).op === "join";
    return joining ? { status: 403, body: MESSAGES.refused } : { status: 400, body: MESSAGES.bad };
  }
  if (parsed.data.op === "open") {
    const code = issueCode(apiKey, deckId, random);
    const tokenRequest = signTokenRequest(apiKey, relayChannel(deckId, code.slice(0, code.indexOf("."))), { random, now });
    return { status: 200, body: { code, tokenRequest } };
  }
  const id = verifyCode(apiKey, deckId, parsed.data.code);
  if (id === null) return { status: 403, body: MESSAGES.refused };
  return { status: 200, body: { tokenRequest: signTokenRequest(apiKey, relayChannel(deckId, id), { random, now }) } };
}

/**
 * Whether a request came from this site's own pages. A browser says where a
 * POST came from, in `Sec-Fetch-Site` and in `Origin`; one that names
 * another site is refused, so no other site can spend the relay's quota
 * through a visitor's browser. A request with neither header is not from a
 * browser, and refusing it would stop nobody who can write their own.
 */
export function fromThisSite({ origin, hosts, site }: { origin: string | null; hosts: (string | null)[]; site: string | null }): boolean {
  if (site) return site === "same-origin";
  if (!origin) return true;
  try {
    return hosts.includes(new URL(origin).host);
  } catch {
    return false;
  }
}
