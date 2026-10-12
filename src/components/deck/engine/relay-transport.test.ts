import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ANSWER_WITHIN, REMAKE_GAP, relayTransport, TEND_EVERY, type RelayClient, type RelayPhase } from "./relay-transport";
import { intent, state, type Message, type Snapshot } from "./transport";

const snapshot: Snapshot = { world: 0, step: 0, worldId: "w", stepId: "s", number: 1, total: 2, title: "T", note: null, nextTitle: null, started: null, blackout: false };
const CHANNEL = "deck:bchc:AAAAAAAAAAAAAAAA";

type Listener = (change: { current: string; reason?: { statusCode?: number } | null; resumed?: boolean }) => void;

/** A stand-in for the relay's client, with its connection and its one channel driven by hand. */
function fakeClient() {
  const links: Listener[] = [];
  const channels: Listener[] = [];
  let inbound: (message: { data?: unknown }) => void = () => {};
  /** What `publish` and `ping` return: answered at once unless a test makes the relay go quiet. */
  let answer: () => Promise<unknown> = () => Promise.resolve();
  const channel = {
    state: "initialized",
    on: (listener: Listener) => void channels.push(listener),
    subscribe: vi.fn((listener: (message: { data?: unknown }) => void) => {
      inbound = listener;
      return Promise.resolve();
    }),
    publish: vi.fn((name: string, data: unknown) => (void name, void data, answer())),
    attach: vi.fn(() => Promise.resolve()),
  };
  const connection = { state: "connecting", on: (listener: Listener) => void links.push(listener), connect: vi.fn(), ping: vi.fn(() => answer()) };
  const client = { connection, channels: { get: vi.fn(() => channel) }, close: vi.fn() } satisfies RelayClient;
  return {
    client,
    channel,
    connection,
    link(current: string, reason?: { statusCode?: number }) {
      connection.state = current;
      links.forEach((listener) => listener({ current, reason }));
    },
    chan(current: string, resumed = false) {
      channel.state = current;
      channels.forEach((listener) => listener({ current, resumed }));
    },
    up() {
      this.link("connected");
      this.chan("attached");
    },
    receive: (data: unknown) => inbound({ data }),
    goQuiet: () => void (answer = () => new Promise(() => {})),
  };
}

/** A transport over a line of stand-in clients: the first, then one for every time the connection is made again. */
async function open() {
  const made: ReturnType<typeof fakeClient>[] = [];
  const make = vi.fn(async () => {
    const next = fakeClient();
    made.push(next);
    return next.client;
  });
  const transport = relayTransport({ make, channel: CHANNEL });
  const phases: RelayPhase[] = [];
  transport.watch((phase) => phases.push(phase));
  await vi.advanceTimersByTimeAsync(0);
  return { transport, made, make, phases };
}

beforeEach(() => void vi.useFakeTimers());
afterEach(() => void vi.useRealTimers());

describe("the relay transport's connection", () => {
  it("is connected only with the link up and the channel attached", async () => {
    const { transport, made, phases } = await open();
    expect(made[0].client.channels.get).toHaveBeenCalledWith(CHANNEL);
    expect(transport.phase()).toBe("connecting");
    expect(transport.status()).toBe("closed");
    made[0].link("connected");
    expect(transport.phase()).toBe("connecting");
    made[0].chan("attached");
    expect(transport.phase()).toBe("connected");
    expect(transport.status()).toBe("open");
    expect(phases).toEqual(["connected"]);
    transport.close();
  });

  it("says reconnecting once it has been up, and connected again when it returns", async () => {
    const { transport, made, phases } = await open();
    made[0].up();
    made[0].link("disconnected");
    expect(transport.status()).toBe("closed");
    made[0].link("connecting");
    made[0].link("connected");
    expect(phases).toEqual(["connected", "reconnecting", "connected"]);
    transport.close();
  });

  it("tells its watchers again when the channel returns having missed messages", async () => {
    const { transport, made, phases } = await open();
    made[0].up();
    made[0].chan("attached", true);
    expect(phases).toEqual(["connected"]);
    made[0].chan("attached", false);
    expect(phases).toEqual(["connected", "connected"]);
    transport.close();
  });

  it("is refused for good when the server answers the token request with 403", async () => {
    const { transport, made, make } = await open();
    made[0].link("failed", { statusCode: 403 });
    expect(transport.phase()).toBe("refused");
    expect(transport.status()).toBe("error");
    transport.wake();
    await vi.advanceTimersByTimeAsync(TEND_EVERY * 4);
    expect(made[0].connection.connect).not.toHaveBeenCalled();
    expect(make).toHaveBeenCalledTimes(1);
    transport.close();
  });

  it("starts a failed connection again, quietly, for as long as it takes", async () => {
    const { transport, made } = await open();
    made[0].up();
    made[0].link("failed", { statusCode: 500 });
    expect(transport.phase()).toBe("reconnecting");
    await vi.advanceTimersByTimeAsync(TEND_EVERY);
    expect(made[0].connection.connect).toHaveBeenCalledTimes(1);
    await vi.advanceTimersByTimeAsync(TEND_EVERY);
    expect(made[0].connection.connect).toHaveBeenCalledTimes(2);
    made[0].up();
    await vi.advanceTimersByTimeAsync(TEND_EVERY * 3);
    expect(made[0].connection.connect).toHaveBeenCalledTimes(2);
    transport.close();
  });

  it("attaches a channel that failed while the link stayed up", async () => {
    const { transport, made } = await open();
    made[0].up();
    made[0].chan("failed");
    expect(transport.phase()).toBe("reconnecting");
    await vi.advanceTimersByTimeAsync(TEND_EVERY);
    expect(made[0].channel.attach).toHaveBeenCalledTimes(1);
    transport.close();
  });

  it("tries again when the relay's client could not be loaded", async () => {
    const good = fakeClient();
    const make = vi.fn<() => Promise<RelayClient>>().mockRejectedValueOnce(new Error("chunk failed")).mockResolvedValue(good.client);
    const transport = relayTransport({ make, channel: CHANNEL });
    await vi.advanceTimersByTimeAsync(TEND_EVERY);
    expect(make).toHaveBeenCalledTimes(2);
    good.up();
    expect(transport.phase()).toBe("connected");
    transport.close();
  });
});

describe("the relay transport's messages", () => {
  it("publishes at once when connected, and does not wait for the answer", async () => {
    const { transport, made } = await open();
    made[0].up();
    made[0].goQuiet();
    transport.send(intent({ type: "next" }, "code"));
    expect(made[0].channel.publish).toHaveBeenCalledWith("m", intent({ type: "next" }, "code"));
    transport.close();
  });

  it("drops a message it cannot send now, and never sends it later", async () => {
    const { transport, made } = await open();
    transport.send(intent({ type: "next" }));
    made[0].link("connected");
    transport.send(intent({ type: "next" }));
    made[0].chan("attached");
    made[0].link("disconnected");
    transport.send(intent({ type: "next" }));
    made[0].link("connected");
    await vi.advanceTimersByTimeAsync(60_000);
    expect(made[0].channel.publish).not.toHaveBeenCalled();
    transport.close();
  });

  it("does not throw, or change its mind about the link, when a publish is refused", async () => {
    const { transport, made } = await open();
    made[0].up();
    made[0].channel.publish.mockImplementationOnce(() => Promise.reject(new Error("rate limited")));
    made[0].channel.publish.mockImplementationOnce(() => {
      throw new Error("not attached");
    });
    expect(() => transport.send(state(snapshot))).not.toThrow();
    expect(() => transport.send(state(snapshot))).not.toThrow();
    await vi.advanceTimersByTimeAsync(ANSWER_WITHIN * 4);
    expect(transport.phase()).toBe("connected");
    transport.close();
  });

  it("hands on what parses as one of our messages, as an object or as JSON", async () => {
    const { transport, made } = await open();
    const heard: Message[] = [];
    transport.subscribe((message) => heard.push(message));
    made[0].up();
    made[0].receive(state(snapshot));
    made[0].receive(JSON.stringify(intent({ type: "prev" }, "code")));
    expect(heard).toEqual([state(snapshot), intent({ type: "prev" }, "code")]);
    transport.close();
  });

  it("drops everything else that arrives", async () => {
    const { transport, made } = await open();
    const heard: Message[] = [];
    transport.subscribe((message) => heard.push(message));
    made[0].up();
    for (const data of [undefined, null, 42, "not json", "{}", [], { kind: "intent", intent: { type: "next" } }, { v: 2, kind: "intent", intent: { type: "next" } }, { v: 1, kind: "intent", intent: { type: "reload" } }, { v: 1, kind: "intent", intent: { type: "goTo", world: -1 } }, { v: 1, kind: "state", state: { ...snapshot, title: 7 } }, { v: 1, kind: "intent", intent: { type: "next" }, code: "x".repeat(65) }]) {
      made[0].receive(data);
    }
    expect(heard).toEqual([]);
    transport.close();
  });
});

describe("a link that has gone quiet", () => {
  it("is thrown away and made again when a send is not answered in time", async () => {
    const { transport, made, make, phases } = await open();
    made[0].up();
    await vi.advanceTimersByTimeAsync(REMAKE_GAP);
    made[0].goQuiet();
    transport.send(intent({ type: "next" }));
    await vi.advanceTimersByTimeAsync(ANSWER_WITHIN - 1);
    expect(make).toHaveBeenCalledTimes(1);
    await vi.advanceTimersByTimeAsync(1);
    expect(make).toHaveBeenCalledTimes(2);
    expect(made[0].client.close).toHaveBeenCalledTimes(1);
    expect(transport.phase()).toBe("reconnecting");
    made[1].up();
    expect(phases).toEqual(["connected", "reconnecting", "connected"]);
    // The send that went unanswered is not sent again on the new connection.
    expect(made[1].channel.publish).not.toHaveBeenCalled();
    transport.close();
  });

  it("is left alone when the answer comes in time", async () => {
    const { transport, made, make } = await open();
    made[0].up();
    await vi.advanceTimersByTimeAsync(REMAKE_GAP);
    transport.send(intent({ type: "next" }));
    await vi.advanceTimersByTimeAsync(ANSWER_WITHIN * 3);
    expect(make).toHaveBeenCalledTimes(1);
    transport.close();
  });

  it("is checked with a ping when the page wakes, and made again if the ping is not answered", async () => {
    const { transport, made, make } = await open();
    made[0].up();
    await vi.advanceTimersByTimeAsync(REMAKE_GAP);
    transport.wake();
    expect(made[0].connection.ping).toHaveBeenCalledTimes(1);
    await vi.advanceTimersByTimeAsync(ANSWER_WITHIN);
    expect(make).toHaveBeenCalledTimes(1);
    made[0].goQuiet();
    transport.wake();
    await vi.advanceTimersByTimeAsync(ANSWER_WITHIN);
    expect(make).toHaveBeenCalledTimes(2);
    transport.close();
  });

  it("is told to connect at once when the page wakes to a link that is down", async () => {
    const { transport, made } = await open();
    made[0].up();
    made[0].link("suspended");
    transport.wake();
    expect(made[0].connection.connect).toHaveBeenCalledTimes(1);
    made[0].link("connecting");
    transport.wake();
    expect(made[0].connection.connect).toHaveBeenCalledTimes(1);
    transport.close();
  });

  it("is not made again more often than the gap allows", async () => {
    const { transport, made, make } = await open();
    made[0].up();
    await vi.advanceTimersByTimeAsync(REMAKE_GAP);
    made[0].goQuiet();
    transport.send(intent({ type: "next" }));
    await vi.advanceTimersByTimeAsync(ANSWER_WITHIN);
    expect(make).toHaveBeenCalledTimes(2);
    made[1].up();
    made[1].goQuiet();
    transport.send(intent({ type: "next" }));
    await vi.advanceTimersByTimeAsync(ANSWER_WITHIN);
    expect(make).toHaveBeenCalledTimes(2);
    transport.close();
  });

  it("ignores whatever a thrown-away connection goes on to say", async () => {
    const { transport, made } = await open();
    const heard: Message[] = [];
    transport.subscribe((message) => heard.push(message));
    made[0].up();
    await vi.advanceTimersByTimeAsync(REMAKE_GAP);
    made[0].goQuiet();
    transport.send(intent({ type: "next" }));
    await vi.advanceTimersByTimeAsync(ANSWER_WITHIN);
    made[0].receive(state(snapshot));
    made[0].link("failed", { statusCode: 403 });
    expect(heard).toEqual([]);
    expect(transport.phase()).toBe("reconnecting");
    transport.close();
  });
});

describe("closing the relay transport", () => {
  it("closes the client, stops every timer and carries nothing more", async () => {
    const { transport, made, make, phases } = await open();
    const heard: Message[] = [];
    transport.subscribe((message) => heard.push(message));
    made[0].up();
    transport.close();
    transport.close();
    expect(made[0].client.close).toHaveBeenCalledTimes(1);
    expect(transport.phase()).toBe("closed");
    expect(transport.status()).toBe("closed");
    expect(phases).toEqual(["connected", "closed"]);
    made[0].receive(state(snapshot));
    transport.send(intent({ type: "next" }));
    transport.wake();
    await vi.advanceTimersByTimeAsync(60_000);
    expect(heard).toEqual([]);
    expect(made[0].channel.publish).not.toHaveBeenCalled();
    expect(make).toHaveBeenCalledTimes(1);
    expect(vi.getTimerCount()).toBe(0);
  });

  it("closes a client that only finished loading after the close", async () => {
    const late = fakeClient();
    let finish: (client: RelayClient) => void = () => {};
    const transport = relayTransport({ make: () => new Promise((resolve) => void (finish = resolve)), channel: CHANNEL });
    transport.close();
    finish(late.client);
    await vi.advanceTimersByTimeAsync(0);
    expect(late.client.close).toHaveBeenCalledTimes(1);
    expect(late.channel.subscribe).not.toHaveBeenCalled();
  });
});
