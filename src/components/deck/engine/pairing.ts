/**
 * Pairing: who may drive the deck. The notes window in the deck's own
 * browser needs no code, because BroadcastChannel reaches no further than
 * this browser and this site. A remote on the network relay must present
 * the session's pairing code with every intent (`code` on an intent message,
 * transport.ts). The server issues the code and only lets its holders onto
 * the session's channel (remote-session.ts); the deck checks it again here,
 * so the relay's own permissions are not the only thing between a stranger
 * and the talk.
 */
import type { Transport } from "./transport";

export type Pairing = {
  /** The code a remote must present, or null when no remote needs one. */
  code: string | null;
};

/** The pairing for a deck session: no code for this browser's own windows, the session's code for the relay. */
export const createPairing = (code: string | null = null): Pairing => ({ code });

/** Whether an intent presenting `code` may drive the deck. */
export const accepts = (pairing: Pairing, code: string | undefined) => pairing.code === null || pairing.code === code;

/**
 * A network transport as the deck hears it. Only an intent carrying the
 * session's code gets through; an intent with no code or the wrong one is
 * dropped, and so is everything that is not an intent, since nothing on the
 * network tells the deck where it is. `onPaired` hears each one let through.
 */
export function paired(transport: Transport, code: string, onPaired?: () => void): Transport {
  const pairing = createPairing(code);
  return {
    ...transport,
    subscribe: (handler) =>
      transport.subscribe((message) => {
        if (message.kind !== "intent" || !accepts(pairing, message.code)) return;
        onPaired?.();
        handler(message);
      }),
  };
}
