/**
 * The browser's half of the phone remote: asking this site's route for a
 * session or a place in one, and connecting the relay's client with what
 * comes back. The relay's library is fetched here, when a remote is asked
 * for, so a talk run from the keyboard never loads it.
 *
 * The relay's API key is never here. This side holds a pairing code and
 * short-lived tokens for one channel, and asks the route for another token
 * whenever the relay's client wants one.
 */
import { relayTransport, type RelayClient, type RelayTransport } from "./relay-transport";
import { joinResponseSchema, openResponseSchema, relayChannel, sessionOf, type TokenRequest } from "./remote-protocol";

/** A token request is signed with the time; one that has sat this long is asked for again instead. */
const FIRST_GOOD_FOR = 30_000;
const ASK_WITHIN = 8000;

/** `unavailable`: the site has no relay set up. `failed`: the route could not be reached, or made no sense. */
export type Opened = { ok: true; code: string; tokenRequest: TokenRequest } | { ok: false; reason: "unavailable" | "failed" };

async function ask(endpoint: string, body: object): Promise<{ status: number; data: unknown }> {
  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    cache: "no-store",
    // An older browser without the timeout still asks; the relay's client has a time limit of its own.
    signal: "timeout" in AbortSignal ? AbortSignal.timeout(ASK_WITHIN) : undefined,
  });
  return { status: response.status, data: response.ok ? await response.json() : null };
}

/** Asks the server for a new session. Called only when the presenter asks for a remote. */
export async function openSession(endpoint: string): Promise<Opened> {
  try {
    const { status, data } = await ask(endpoint, { op: "open" });
    if (status === 503) return { ok: false, reason: "unavailable" };
    const parsed = openResponseSchema.safeParse(data);
    return parsed.success ? { ok: true, ...parsed.data } : { ok: false, reason: "failed" };
  } catch {
    return { ok: false, reason: "failed" };
  }
}

/** A token request for a session already open, or the HTTP status that came instead (0 when nothing came). */
async function joinSession(endpoint: string, code: string): Promise<TokenRequest | number> {
  try {
    const { status, data } = await ask(endpoint, { op: "join", code });
    const parsed = joinResponseSchema.safeParse(data);
    return parsed.success ? parsed.data.tokenRequest : status === 200 ? 0 : status;
  } catch {
    return 0;
  }
}

type Connect = {
  endpoint: string;
  deckId: string;
  code: string;
  /** The token request that came with a session just opened, saving the deck one round trip. */
  first?: TokenRequest;
};

/**
 * The relay transport for one session, connecting as soon as it is made. It
 * wakes the link when the page returns to view or the network returns, which
 * is when a phone's socket is most likely to have died unnoticed.
 */
export function connectRelay({ endpoint, deckId, code, first }: Connect): RelayTransport {
  const firstAt = Date.now();
  let unused = first;

  const make = async (): Promise<RelayClient> => {
    // The library's browser build is one CommonJS object: depending on the bundler it arrives as the module or as its default.
    const loaded = await import("ably");
    const { Realtime, ErrorInfo } = "Realtime" in loaded ? loaded : (loaded as unknown as { default: typeof loaded }).default;
    return new Realtime({
      authCallback(_params, callback) {
        const ready = unused && Date.now() - firstAt < FIRST_GOOD_FOR ? unused : null;
        unused = undefined;
        if (ready) return callback(null, ready);
        void joinSession(endpoint, code).then((answer) => {
          if (typeof answer !== "number") callback(null, answer);
          // A 403 here ends the connection for good; anything else is tried again.
          else callback(new ErrorInfo("The talk's remote could not get a token.", answer === 403 ? 40300 : 40170, answer === 403 ? 403 : 401), null);
        });
      },
      // The deck must not hear its own snapshots, nor a remote its own taps.
      echoMessages: false,
      // Nothing is kept to send later (relay-transport.ts).
      queueMessages: false,
      disconnectedRetryTimeout: 4000,
      suspendedRetryTimeout: 10_000,
    });
  };

  const relay = relayTransport({ make, channel: relayChannel(deckId, sessionOf(code) ?? "") });
  const wake = () => document.visibilityState === "visible" && relay.wake();
  document.addEventListener("visibilitychange", wake);
  window.addEventListener("pageshow", wake);
  window.addEventListener("online", wake);
  return {
    ...relay,
    close() {
      document.removeEventListener("visibilitychange", wake);
      window.removeEventListener("pageshow", wake);
      window.removeEventListener("online", wake);
      relay.close();
    },
  };
}
