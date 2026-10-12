/**
 * What the deck's pages and the remote's route handler say to each other,
 * and the shape of a pairing code. A deck asks the server to open a session
 * and is given a pairing code; a phone presents that code to join. Either
 * way the answer is a signed token request the browser takes to the relay,
 * good for that session's one channel and nothing else.
 *
 * Nothing here is secret and nothing here needs Node, so the server and
 * both pages share it. The secrets are in remote-session.ts.
 */
import { z } from "zod";

/** A session id and its tag, each twelve bytes (96 bits) in URL-safe base64, joined by a full stop. */
export const CODE_PATTERN = /^[A-Za-z0-9_-]{16}\.[A-Za-z0-9_-]{16}$/;
export const CODE_LENGTH = 33;

export const requestSchema = z.discriminatedUnion("op", [
  z.object({ op: z.literal("open") }),
  /** Only the length is checked here: every other fault in a code gets the same refusal (remote-session.ts). */
  z.object({ op: z.literal("join"), code: z.string().min(1).max(64) }),
]);

/** The relay's token request, as its client library expects it back from an auth callback. */
export const tokenRequestSchema = z.object({
  keyName: z.string().min(1).max(200),
  ttl: z.number().int().positive(),
  capability: z.string().min(2).max(500),
  timestamp: z.number().int().positive(),
  nonce: z.string().min(16).max(100),
  mac: z.string().min(1).max(200),
});

export const openResponseSchema = z.object({ code: z.string().regex(CODE_PATTERN), tokenRequest: tokenRequestSchema });
export const joinResponseSchema = z.object({ tokenRequest: tokenRequestSchema });

export type RemoteRequest = z.infer<typeof requestSchema>;
export type TokenRequest = z.infer<typeof tokenRequestSchema>;

/** The session id inside a well-formed code, or null. */
export const sessionOf = (code: string) => (CODE_PATTERN.test(code) ? code.slice(0, 16) : null);

/** The relay channel a session's deck and remote share. The first part is the relay's namespace. */
export const relayChannel = (deckId: string, sessionId: string) => `deck:${deckId}:${sessionId}`;

/**
 * The join address carries the code in its fragment, which a browser keeps
 * to itself: it is not in the page request, so it is in no server log.
 */
export const joinHash = (code: string) => `#k=${code}`;

/** Whether an address is a join address at all, well formed or not. */
export const isJoinHash = (hash: string) => hash.startsWith("#k=");

/** The code a join address carries, or null when it carries none that could be real. */
export function readJoinCode(hash: string): string | null {
  const code = isJoinHash(hash) ? hash.slice(3) : "";
  return CODE_PATTERN.test(code) ? code : null;
}
