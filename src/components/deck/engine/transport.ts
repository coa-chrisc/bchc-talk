/**
 * How the deck talks to its other screens: a notes window today, a phone in
 * the speaker's hand later. The deck window owns the state. Every other
 * client sends intents and receives snapshots; none of them ever decides
 * where the deck is. Messages are plain JSON with a version, and every one
 * is checked on the way in, because a network transport will carry input
 * the deck cannot trust. Anything unknown or malformed is dropped.
 *
 * A transport is four things: `send`, `subscribe`, `status` and `close`.
 * BroadcastChannel (same browser, same origin) is the first. A relay for a
 * phone implements the same four and nothing else changes. The deck never
 * waits on a transport: with none, or a broken one, the keyboard and the
 * clicker still run the talk.
 */
import { z } from "zod";

export const PROTOCOL = 1;

const index = z.number().int().min(0).max(9999);
const text = z.string().max(20000);

export const intentSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("next") }),
  z.object({ type: z.literal("prev") }),
  z.object({ type: z.literal("first") }),
  z.object({ type: z.literal("last") }),
  z.object({ type: z.literal("goTo"), world: index, step: index.optional() }),
  /** Blanks or restores the screen; toggles when `on` is left out. */
  z.object({ type: z.literal("blackout"), on: z.boolean().optional() }),
  z.object({ type: z.literal("resetTimer") }),
  /** A client has just connected and wants a snapshot. */
  z.object({ type: z.literal("hello") }),
]);

export const snapshotSchema = z.object({
  world: index,
  step: index,
  worldId: z.string().max(200),
  stepId: z.string().max(200),
  /** The step's number in the whole deck, from 1, and how many there are. */
  number: index,
  total: index,
  title: text,
  note: text.nullable(),
  nextTitle: text.nullable(),
  /** When the talk's clock started, in epoch milliseconds, or null before it has. */
  started: z.number().nullable(),
  blackout: z.boolean(),
});

export const messageSchema = z.discriminatedUnion("kind", [
  /** `code` is the pairing code a remote presents (pairing.ts). */
  z.object({ v: z.literal(PROTOCOL), kind: z.literal("intent"), intent: intentSchema, code: z.string().max(64).optional() }),
  z.object({ v: z.literal(PROTOCOL), kind: z.literal("state"), state: snapshotSchema }),
]);

export type Intent = z.infer<typeof intentSchema>;
export type Snapshot = z.infer<typeof snapshotSchema>;
export type Message = z.infer<typeof messageSchema>;

export const intent = (value: Intent, code?: string): Message => ({ v: PROTOCOL, kind: "intent", intent: value, ...(code ? { code } : {}) });
export const state = (value: Snapshot): Message => ({ v: PROTOCOL, kind: "state", state: value });

/** A message off the wire, as an object or as JSON text, or null when it is not one of ours. */
export function parseMessage(raw: unknown): Message | null {
  let value = raw;
  if (typeof raw === "string") {
    try {
      value = JSON.parse(raw);
    } catch {
      return null;
    }
  }
  const parsed = messageSchema.safeParse(value);
  return parsed.success ? parsed.data : null;
}

export type TransportStatus = "open" | "closed" | "error";

export type Transport = {
  /** Never throws: a failed send turns the status to `error`. */
  send(message: Message): void;
  /** Checked messages only. Returns the way to stop listening. */
  subscribe(handler: (message: Message) => void): () => void;
  status(): TransportStatus;
  close(): void;
};

/** A transport to the other windows of this browser. */
export function broadcastTransport(name: string): Transport {
  const handlers = new Set<(message: Message) => void>();
  let status: TransportStatus = "closed";
  let channel: BroadcastChannel | null = null;
  try {
    channel = new BroadcastChannel(name);
    status = "open";
    channel.onmessage = (event) => {
      const message = parseMessage(event.data);
      if (message) handlers.forEach((handler) => handler(message));
    };
    channel.onmessageerror = () => {
      status = "error";
    };
  } catch {
    status = "error";
  }
  return {
    send(message) {
      try {
        channel?.postMessage(message);
      } catch {
        status = "error";
      }
    },
    subscribe(handler) {
      handlers.add(handler);
      return () => handlers.delete(handler);
    },
    status: () => status,
    close() {
      channel?.close();
      channel = null;
      handlers.clear();
      status = "closed";
    },
  };
}

/** The channel a deck and its other screens share. */
export const channelName = (deckId: string) => `deck:${deckId}`;
