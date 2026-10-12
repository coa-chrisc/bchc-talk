/**
 * One transport made of several. The deck speaks to the notes window in
 * its own browser and to a phone on the relay at once: a snapshot goes out
 * on every leg, and an intent from any leg comes in. Everything a leg hands
 * over is checked again on the way in, so a leg with a fault of its own
 * still cannot put an unchecked message in front of the deck.
 *
 * Legs can be added while it runs, because the relay only exists once the
 * presenter asks for it. A leg that was added can be taken out again and
 * stays open; closing the whole closes every leg still in it.
 */
import { parseMessage, type Message, type Transport, type TransportStatus } from "./transport";

export type FanOut = Transport & {
  /** Puts a leg in. Returns the way to take it out again, still open. */
  add(leg: Transport): () => void;
};

export function fanOut(...first: Transport[]): FanOut {
  const handlers = new Set<(message: Message) => void>();
  const legs = new Map<Transport, () => void>();
  let closed = false;

  const add = (leg: Transport) => {
    if (closed || legs.has(leg)) return () => {};
    const stop = leg.subscribe((raw) => {
      const message = parseMessage(raw);
      if (message) handlers.forEach((handler) => handler(message));
    });
    legs.set(leg, stop);
    return () => {
      if (legs.get(leg) !== stop) return;
      stop();
      legs.delete(leg);
    };
  };
  first.forEach(add);

  return {
    add,
    send(message) {
      legs.forEach((_, leg) => {
        try {
          leg.send(message);
        } catch {
          // A leg is meant never to throw; one that does must not stop the others.
        }
      });
    },
    subscribe(handler) {
      handlers.add(handler);
      return () => handlers.delete(handler);
    },
    /** Open only when every leg is; in error when any leg is. */
    status(): TransportStatus {
      if (closed || legs.size === 0) return "closed";
      const all = Array.from(legs.keys(), (leg) => leg.status());
      return all.includes("error") ? "error" : all.includes("closed") ? "closed" : "open";
    },
    close() {
      closed = true;
      legs.forEach((stop, leg) => {
        stop();
        leg.close();
      });
      legs.clear();
      handlers.clear();
    },
  };
}
