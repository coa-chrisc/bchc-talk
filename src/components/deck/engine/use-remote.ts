/**
 * The deck's side of the phone remote. Nothing happens until the presenter
 * asks: opening the page creates no session and spends none of the relay's
 * quota. Asking opens a session, and the relay then joins the deck's
 * transport as one more leg, heard only through the pairing check. The deck
 * never waits on any of it.
 *
 * The session's code is kept for this tab, so a reload in the middle of a
 * talk comes back to the same session and the phone in the speaker's hand
 * goes on working without being paired again.
 */
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { FanOut } from "./fan-out";
import { paired } from "./pairing";
import type { RelayPhase, RelayTransport } from "./relay-transport";
import { connectRelay, openSession } from "./remote-client";
import { joinHash, sessionOf, type TokenRequest } from "./remote-protocol";
import type { Transport } from "./transport";

export type RemoteState = {
  /**
   * `off` until asked for; `opening` while the server is asked; `unavailable`
   * when the site has no relay; `failed` when the server could not be
   * reached; then the relay's own phase.
   */
  phase: "off" | "opening" | "unavailable" | "failed" | RelayPhase;
  /** The address a phone opens to join, once there is a session. */
  url: string | null;
  /** Whether a remote has driven the deck in this session. */
  paired: boolean;
};

const OFF: RemoteState = { phase: "off", url: null, paired: false };
const none = () => {};

const storageKey = (deckId: string) => `deck:${deckId}:remote`;

function remember(deckId: string, code: string | null) {
  try {
    if (code) window.sessionStorage.setItem(storageKey(deckId), code);
    else window.sessionStorage.removeItem(storageKey(deckId));
  } catch {
    // Storage is off: a reload will need the remote asked for again.
  }
}

function recall(deckId: string): string | null {
  try {
    const code = window.sessionStorage.getItem(storageKey(deckId)) ?? "";
    return sessionOf(code) ? code : null;
  } catch {
    return null;
  }
}

/**
 * `endpoint` is the remote's route and `notesPath` the page a phone joins
 * on. `attach` gives the deck's transport to the remote, which puts the
 * relay in it now or when there is one; it returns the way to take it out.
 */
export function useRemote(deckId: string, endpoint: string | undefined, notesPath: string) {
  const [remote, setRemote] = useState(OFF);
  const fan = useRef<FanOut | null>(null);
  const relay = useRef<RelayTransport | null>(null);
  const leg = useRef<Transport | null>(null);
  const unplug = useRef(none);
  const busy = useRef(false);
  const mounted = useRef(false);

  const plug = useCallback(() => {
    unplug.current();
    unplug.current = fan.current && leg.current ? fan.current.add(leg.current) : none;
  }, []);

  const drop = useCallback(() => {
    unplug.current();
    unplug.current = none;
    const old = relay.current;
    relay.current = null;
    leg.current = null;
    old?.close();
  }, []);

  const connect = useCallback(
    (code: string, first?: TokenRequest) => {
      if (!endpoint) return;
      drop();
      const made = connectRelay({ endpoint, deckId, code, first });
      relay.current = made;
      leg.current = paired(made, code, () => relay.current === made && setRemote((now) => (now.paired ? now : { ...now, paired: true })));
      made.watch((phase) => {
        if (relay.current !== made) return;
        // A session the server no longer honours is forgotten, so a reload does not come back to it.
        if (phase === "refused") remember(deckId, null);
        setRemote((now) => ({ ...now, phase }));
      });
      plug();
      setRemote({ phase: made.phase(), url: `${window.location.origin}${notesPath}${joinHash(code)}`, paired: false });
    },
    [deckId, drop, endpoint, notesPath, plug],
  );

  /** Opens a new session. The presenter's to call; nothing calls it for them. */
  const open = useCallback(async () => {
    if (!endpoint || busy.current) return;
    busy.current = true;
    drop();
    setRemote({ ...OFF, phase: "opening" });
    const opened = await openSession(endpoint);
    busy.current = false;
    if (!mounted.current) return;
    if (!opened.ok) return setRemote({ ...OFF, phase: opened.reason });
    remember(deckId, opened.code);
    connect(opened.code, opened.tokenRequest);
  }, [connect, deckId, drop, endpoint]);

  useEffect(() => {
    mounted.current = true;
    const code = recall(deckId);
    // A turn later, so a mount that is torn down at once (as React does in development) makes no connection.
    const resume = code ? window.setTimeout(() => connect(code), 0) : 0;
    return () => {
      mounted.current = false;
      window.clearTimeout(resume);
      drop();
    };
  }, [connect, deckId, drop]);

  const attach = useCallback(
    (to: FanOut) => {
      fan.current = to;
      plug();
      return () => {
        unplug.current();
        unplug.current = none;
        fan.current = null;
      };
    },
    [plug],
  );

  return { remote, open, attach };
}
