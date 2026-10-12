import { describe, expect, it, vi } from "vitest";
import { accepts, createPairing, paired } from "./pairing";
import { intent, state, type Message, type Snapshot, type Transport } from "./transport";

const CODE = "AAAAAAAAAAAAAAAA.BBBBBBBBBBBBBBBB";
const snapshot: Snapshot = { world: 0, step: 0, worldId: "w", stepId: "s", number: 1, total: 2, title: "T", note: null, nextTitle: null, started: null, blackout: false };

/** A transport whose inbound side the test drives by hand. */
function wire() {
  const handlers = new Set<(message: Message) => void>();
  const transport: Transport = {
    send: vi.fn(),
    subscribe(handler) {
      handlers.add(handler);
      return () => handlers.delete(handler);
    },
    status: () => "open",
    close: vi.fn(),
  };
  return { transport, deliver: (message: Message) => handlers.forEach((handler) => handler(message)), listening: () => handlers.size };
}

describe("who may drive the deck", () => {
  it("asks nothing of this browser's own windows", () => {
    expect(accepts(createPairing(), undefined)).toBe(true);
    expect(accepts(createPairing(), "anything")).toBe(true);
  });

  it("asks a session's exact code of everything else", () => {
    const pairing = createPairing(CODE);
    expect(accepts(pairing, CODE)).toBe(true);
    for (const code of [undefined, "", CODE.slice(0, -1), CODE + "B", CODE.toLowerCase(), "null"]) expect(accepts(pairing, code)).toBe(false);
  });
});

describe("the relay, as the deck hears it", () => {
  it("lets through an intent that carries the session's code", () => {
    const { transport, deliver } = wire();
    const heard: Message[] = [];
    const onPaired = vi.fn();
    paired(transport, CODE, onPaired).subscribe((message) => heard.push(message));
    deliver(intent({ type: "next" }, CODE));
    expect(heard).toEqual([intent({ type: "next" }, CODE)]);
    expect(onPaired).toHaveBeenCalledTimes(1);
  });

  it("drops an intent with no code, or the wrong one", () => {
    const { transport, deliver } = wire();
    const heard: Message[] = [];
    const onPaired = vi.fn();
    paired(transport, CODE, onPaired).subscribe((message) => heard.push(message));
    deliver(intent({ type: "next" }));
    deliver(intent({ type: "next" }, CODE.slice(0, -1) + "C"));
    deliver(intent({ type: "goTo", world: 3 }, "AAAAAAAAAAAAAAAA.AAAAAAAAAAAAAAAA"));
    deliver(intent({ type: "blackout" }, ""));
    expect(heard).toEqual([]);
    expect(onPaired).not.toHaveBeenCalled();
  });

  it("drops a snapshot: nothing on the network tells the deck where it is", () => {
    const { transport, deliver } = wire();
    const heard: Message[] = [];
    paired(transport, CODE).subscribe((message) => heard.push(message));
    deliver(state(snapshot));
    expect(heard).toEqual([]);
  });

  it("sends, reports and stops listening as the transport under it does", () => {
    const { transport, listening } = wire();
    const guarded = paired(transport, CODE);
    guarded.send(state(snapshot));
    expect(transport.send).toHaveBeenCalledWith(state(snapshot));
    expect(guarded.status()).toBe("open");
    const stop = guarded.subscribe(() => {});
    expect(listening()).toBe(1);
    stop();
    expect(listening()).toBe(0);
  });
});
