import { describe, expect, it, vi } from "vitest";
import { fanOut } from "./fan-out";
import { intent, state, type Message, type Snapshot, type Transport, type TransportStatus } from "./transport";

const snapshot: Snapshot = { world: 0, step: 0, worldId: "w", stepId: "s", number: 1, total: 2, title: "T", note: null, nextTitle: null, started: null, blackout: false };

/** A leg the test drives by hand. `deliver` takes anything, as a leg with a fault of its own might hand anything over. */
function leg(status: TransportStatus = "open") {
  const handlers = new Set<(message: Message) => void>();
  const transport = {
    send: vi.fn(),
    subscribe(handler: (message: Message) => void) {
      handlers.add(handler);
      return () => handlers.delete(handler);
    },
    status: vi.fn(() => status),
    close: vi.fn(),
  } satisfies Transport;
  return { transport, deliver: (raw: unknown) => handlers.forEach((handler) => handler(raw as Message)), listening: () => handlers.size };
}

describe("one transport made of several", () => {
  it("sends every message out on every leg", () => {
    const a = leg();
    const b = leg();
    fanOut(a.transport, b.transport).send(state(snapshot));
    expect(a.transport.send).toHaveBeenCalledWith(state(snapshot));
    expect(b.transport.send).toHaveBeenCalledWith(state(snapshot));
  });

  it("goes on to the other legs when one throws", () => {
    const a = leg();
    const b = leg();
    a.transport.send.mockImplementation(() => {
      throw new Error("leg down");
    });
    expect(() => fanOut(a.transport, b.transport).send(state(snapshot))).not.toThrow();
    expect(b.transport.send).toHaveBeenCalledTimes(1);
  });

  it("hears a message from any leg, once", () => {
    const a = leg();
    const b = leg();
    const heard: Message[] = [];
    fanOut(a.transport, b.transport).subscribe((message) => heard.push(message));
    a.deliver(intent({ type: "next" }));
    b.deliver(intent({ type: "prev" }, "code"));
    expect(heard).toEqual([intent({ type: "next" }), intent({ type: "prev" }, "code")]);
  });

  it("drops what a leg hands over that is not one of our messages", () => {
    const a = leg();
    const heard: Message[] = [];
    fanOut(a.transport).subscribe((message) => heard.push(message));
    for (const raw of [null, undefined, 42, "not json", {}, { v: 2, kind: "intent", intent: { type: "next" } }, { v: 1, kind: "intent", intent: { type: "reload" } }, { v: 1, kind: "state", state: { ...snapshot, number: "1" } }, { v: 1, kind: "intent", intent: { type: "next" }, code: "x".repeat(65) }]) {
      a.deliver(raw);
    }
    expect(heard).toEqual([]);
    a.deliver({ v: 1, kind: "intent", intent: { type: "next" }, extra: "stripped" });
    expect(heard).toEqual([intent({ type: "next" })]);
  });

  it("takes a leg in while running, and gives it back still open", () => {
    const a = leg();
    const late = leg();
    const all = fanOut(a.transport);
    const heard: Message[] = [];
    all.subscribe((message) => heard.push(message));
    const remove = all.add(late.transport);
    late.deliver(intent({ type: "next" }));
    all.send(state(snapshot));
    expect(heard).toHaveLength(1);
    expect(late.transport.send).toHaveBeenCalledTimes(1);

    remove();
    remove();
    late.deliver(intent({ type: "next" }));
    all.send(state(snapshot));
    expect(heard).toHaveLength(1);
    expect(late.transport.send).toHaveBeenCalledTimes(1);
    expect(late.listening()).toBe(0);
    expect(late.transport.close).not.toHaveBeenCalled();
  });

  it("does not take the same leg twice", () => {
    const a = leg();
    const all = fanOut(a.transport);
    all.add(a.transport);
    all.send(state(snapshot));
    expect(a.transport.send).toHaveBeenCalledTimes(1);
    expect(a.listening()).toBe(1);
  });

  it("is open only when every leg is, and in error when any is", () => {
    expect(fanOut(leg().transport, leg().transport).status()).toBe("open");
    expect(fanOut(leg().transport, leg("closed").transport).status()).toBe("closed");
    expect(fanOut(leg("closed").transport, leg("error").transport).status()).toBe("error");
    expect(fanOut().status()).toBe("closed");
  });

  it("closes every leg still in it, and then carries nothing", () => {
    const a = leg();
    const b = leg();
    const gone = leg();
    const all = fanOut(a.transport, b.transport);
    all.add(gone.transport)();
    const heard: Message[] = [];
    all.subscribe((message) => heard.push(message));
    all.close();
    expect(a.transport.close).toHaveBeenCalledTimes(1);
    expect(b.transport.close).toHaveBeenCalledTimes(1);
    expect(gone.transport.close).not.toHaveBeenCalled();
    a.deliver(intent({ type: "next" }));
    all.send(state(snapshot));
    expect(heard).toEqual([]);
    expect(a.transport.send).not.toHaveBeenCalled();
    expect(all.status()).toBe("closed");
    expect(a.listening()).toBe(0);
  });
});
