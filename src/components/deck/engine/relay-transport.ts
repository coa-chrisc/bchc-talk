/**
 * The transport that crosses the network: a deck on the room's wifi and a
 * phone on cellular, meeting on one channel of a hosted relay. It is the
 * same four things as every transport, and the same check on the way in:
 * what does not parse as one of our messages is dropped.
 *
 * It is written against the few parts of the relay's client it uses, so the
 * client's library is loaded only when a remote is asked for (remote-client.ts)
 * and the behaviour here is tested with a stand-in.
 *
 * Three rules, all for a live talk:
 *   - A message that cannot go now is dropped, never kept for later. A tap
 *     made while the link was down must not move the deck when it returns.
 *   - A send is never waited on. It goes, and the caller carries on.
 *   - A link that has gone quiet is not trusted. A phone that slept, or
 *     changed network, can hold a dead socket that still reads as connected
 *     for many seconds; a send or a ping that is not answered in time has the
 *     connection thrown away and made again.
 */
import { parseMessage, type Message, type Transport } from "./transport";

/** How the link stands. `refused` is final: the server would not let this client in. */
export type RelayPhase = "connecting" | "connected" | "reconnecting" | "refused" | "closed";

type Change = { current: string; reason?: { statusCode?: number } | null; resumed?: boolean };

export type RelayChannel = {
  readonly state: string;
  on(listener: (change: Change) => void): void;
  subscribe(listener: (message: { data?: unknown }) => void): Promise<unknown>;
  publish(name: string, data: unknown): Promise<unknown>;
  attach(): Promise<unknown>;
};

/** The parts of the relay's realtime client this transport uses. */
export type RelayClient = {
  connection: { readonly state: string; on(listener: (change: Change) => void): void; connect(): void; ping(): Promise<unknown> };
  channels: { get(name: string): RelayChannel };
  close(): void;
};

export type RelayTransport = Transport & {
  phase(): RelayPhase;
  /** Called on every change of phase, and again when the channel comes back having missed messages. Returns the way to stop. */
  watch(handler: (phase: RelayPhase) => void): () => void;
  /** The page is back in view or the network is back: check the link now rather than on the next timer. */
  wake(): void;
};

/** The name every message is published under. */
const EVENT = "m";
/** An answer from the relay that takes longer than this is not coming. */
export const ANSWER_WITHIN = 3000;
/** The connection is thrown away and made again no more often than this. */
export const REMAKE_GAP = 8000;
/** How often a link that is down is looked at, for the faults the client does not retry itself. */
export const TEND_EVERY = 5000;

const quiet = (promise: Promise<unknown>) => void promise.catch(() => undefined);

export function relayTransport({ make, channel: name }: { make(): Promise<RelayClient>; channel: string }): RelayTransport {
  const handlers = new Set<(message: Message) => void>();
  const watchers = new Set<(phase: RelayPhase) => void>();
  let client: RelayClient | null = null;
  let channel: RelayChannel | null = null;
  /** Counts connections made, so a thrown-away connection's late events are ignored. */
  let generation = 0;
  let making = false;
  let madeAt = 0;
  let everUp = false;
  let refused = false;
  let closed = false;
  let phase: RelayPhase = "connecting";

  const read = (): RelayPhase => {
    if (closed) return "closed";
    if (refused) return "refused";
    if (client?.connection.state === "connected" && channel?.state === "attached") return "connected";
    return everUp ? "reconnecting" : "connecting";
  };

  /** Works out the phase again and tells the watchers when it changed, or when `again` says they must hear it twice. */
  const settle = (again = false) => {
    const next = read();
    if (next === phase && !(again && next === "connected")) return;
    phase = next;
    if (phase === "connected") everUp = true;
    watchers.forEach((watcher) => watcher(phase));
  };

  const build = () => {
    const mine = ++generation;
    const old = client;
    client = null;
    channel = null;
    making = true;
    madeAt = Date.now();
    try {
      old?.close();
    } catch {
      // It is being thrown away either way.
    }
    settle();
    make().then(
      (made) => {
        if (mine !== generation) return void made.close();
        making = false;
        client = made;
        channel = made.channels.get(name);
        made.connection.on((change) => {
          if (mine !== generation) return;
          // The server's 403 to this client's request for a token: it will not be let in by asking again.
          if (change.current === "failed" && change.reason?.statusCode === 403) refused = true;
          settle();
        });
        channel.on((change) => mine === generation && settle(change.current === "attached" && change.resumed === false));
        quiet(
          channel.subscribe((inbound) => {
            if (mine !== generation) return;
            const message = parseMessage(inbound.data);
            if (message) handlers.forEach((handler) => handler(message));
          }),
        );
        settle();
      },
      () => {
        // The client's code did not load. The next look at the link tries again.
        if (mine === generation) making = false;
      },
    );
  };

  const remake = () => {
    if (closed || refused || making || Date.now() - madeAt < REMAKE_GAP) return;
    build();
  };

  /**
   * Holds the relay to an answer: if none comes in time and the client still
   * believes it is connected, the socket under it is taken to be dead. A
   * client that has noticed for itself is already reconnecting.
   */
  const expect = (answer: Promise<unknown>) => {
    const mine = generation;
    const timer = setTimeout(() => mine === generation && phase === "connected" && remake(), ANSWER_WITHIN);
    const done = () => clearTimeout(timer);
    answer.then(done, done);
  };

  /** What the client does not do for itself: start again after a fatal error, or after its code failed to load. */
  const tend = () => {
    if (closed || refused || making || phase === "connected") return;
    if (!client || !channel) return build();
    const link = client.connection.state;
    if (link === "failed" || link === "closed") client.connection.connect();
    else if (link === "connected" && (channel.state === "failed" || channel.state === "detached")) quiet(channel.attach());
  };

  build();
  const tending = setInterval(tend, TEND_EVERY);

  return {
    send(message) {
      if (phase !== "connected" || !channel) return;
      try {
        expect(channel.publish(EVENT, message));
      } catch {
        // Not sent. The link's own state says whether anything is wrong with it.
      }
    },
    subscribe(handler) {
      handlers.add(handler);
      return () => handlers.delete(handler);
    },
    status: () => (phase === "connected" ? "open" : phase === "refused" ? "error" : "closed"),
    phase: () => phase,
    watch(handler) {
      watchers.add(handler);
      return () => watchers.delete(handler);
    },
    wake() {
      if (closed || refused || !client) return;
      const link = client.connection.state;
      try {
        if (link === "connected") expect(client.connection.ping());
        else if (link !== "connecting") client.connection.connect();
      } catch {
        // The next look at the link deals with it.
      }
    },
    close() {
      if (closed) return;
      closed = true;
      generation++;
      clearInterval(tending);
      try {
        client?.close();
      } catch {
        // Closing a client that is already gone.
      }
      client = null;
      channel = null;
      settle();
      handlers.clear();
      watchers.clear();
    },
  };
}
