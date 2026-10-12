/**
 * The speaker's screen: a second window on a laptop, or a phone in the
 * hand. It shows the note for the step on stage, what comes next, the
 * talk's clock and the time of day, with Next and Back. It never holds the
 * deck's state: it sends intents over the transport and draws the snapshots
 * that come back, so the same view works over any transport. Opened plainly
 * it is a window of the deck's own browser. Opened at a join address, with a
 * pairing code in the fragment, it is a remote on the network relay: it
 * says how its connection stands, and asks for a fresh snapshot every time
 * the connection comes back. Laid out for a phone held upright first; a wide
 * window gets two columns. Printed, it is the whole script, one step to a
 * block.
 */
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { formatElapsed } from "./clock";
import { commandFor } from "./keys";
import { keepAwake } from "./readiness";
import type { RelayPhase } from "./relay-transport";
import { connectRelay } from "./remote-client";
import { isJoinHash, readJoinCode } from "./remote-protocol";
import { broadcastTransport, channelName, intent, type Intent, type Snapshot, type Transport, type TransportStatus } from "./transport";
import type { DeckDef } from "./types";
import "./notes.css";

/** A second tap this soon after the first is the same thumb, not a second step. */
const TAP_GUARD = 250;

/** A remote's connection, in the speaker's words: the short mark in the bar, and the line shown until the talk's first snapshot arrives. */
const REMOTE: Record<RelayPhase, { mark: string; line: string }> = {
  connecting: { mark: "connecting", line: "Connecting to the talk." },
  connected: { mark: "connected", line: "Connected. Waiting for the presenting screen." },
  reconnecting: { mark: "reconnecting", line: "The connection dropped. Reconnecting; this screen catches up by itself." },
  refused: { mark: "could not join", line: "This phone could not join the talk. Scan the code on the presenting screen again." },
  closed: { mark: "off", line: "Not connected." },
};

/** `remotePath` is the route a remote joins through (remote-session.ts); without it this is only ever a window of the deck's browser. */
export function NotesView({ deck, remotePath }: { deck: DeckDef; remotePath?: string }) {
  const transport = useRef<Transport | null>(null);
  const code = useRef<string | undefined>(undefined);
  const lastTap = useRef(-TAP_GUARD);
  const [snapshot, setSnapshot] = useState<Snapshot | null>(null);
  const [now, setNow] = useState<number | null>(null);
  const [link, setLink] = useState<TransportStatus>("closed");
  /** The relay's phase when this screen is a remote; null when it is a window of the deck's browser. */
  const [remote, setRemote] = useState<RelayPhase | null>(null);
  const [pressed, setPressed] = useState<string | null>(null);

  // The intent goes the moment it is asked for. Nothing here waits for the deck's answer.
  const send = useCallback((value: Intent) => transport.current?.send(intent(value, code.current)), []);
  const tap = useCallback(
    (value: Intent) => {
      const time = performance.now();
      if (time - lastTap.current < TAP_GUARD) return;
      lastTap.current = time;
      send(value);
    },
    [send],
  );

  /** A button shows it is pressed from the touch itself, not from anything the deck sends back. */
  const press = (name: string) => {
    const lift = () => setPressed((held) => (held === name ? null : held));
    return { "data-pressed": pressed === name || undefined, onPointerDown: () => setPressed(name), onPointerUp: lift, onPointerLeave: lift, onPointerCancel: lift };
  };

  useEffect(() => {
    // The code is read from the fragment, which the browser never sent to the server with the page.
    const hash = window.location.hash;
    const joining = remotePath ? readJoinCode(hash) : null;
    const relay = joining && remotePath ? connectRelay({ endpoint: remotePath, deckId: deck.id, code: joining }) : null;
    const channel = relay ?? broadcastTransport(channelName(deck.id));
    transport.current = channel;
    code.current = joining ?? undefined;
    const stop = channel.subscribe((message) => message.kind === "state" && setSnapshot(message.state));
    const hello = () => channel.send(intent({ type: "hello" }, code.current));
    // Every time the link comes up, and whenever it may have missed something: ask where the deck is.
    const show = (phase: RelayPhase) => {
      setRemote(phase);
      if (phase === "connected") hello();
    };
    if (relay) {
      relay.watch(show);
      show(relay.phase());
    } else {
      // A join address whose code is cut short or mistyped joins nothing, and says so.
      if (remotePath && isJoinHash(hash)) show("refused");
      hello();
    }
    const tick = () => {
      setNow(Date.now());
      setLink(channel.status());
    };
    tick();
    const timer = window.setInterval(tick, 1000);
    const release = keepAwake();
    const onKey = (event: KeyboardEvent) => {
      const command = commandFor({ key: event.key, metaKey: event.metaKey, ctrlKey: event.ctrlKey, altKey: event.altKey, repeat: event.repeat, onControl: Boolean((event.target as Element).closest("button")) });
      if (command === null) return;
      event.preventDefault();
      if (command === "next" || command === "enter") channel.send(intent({ type: "next" }, code.current));
      else if (command === "prev" || command === "first" || command === "last" || command === "blackout") channel.send(intent({ type: command }, code.current));
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.clearInterval(timer);
      release();
      stop();
      channel.close();
      transport.current = null;
    };
  }, [deck.id, remotePath]);

  const elapsed = snapshot?.started && now ? formatElapsed(now - snapshot.started) : "0:00";
  const clock = now ? new Date(now).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }) : "";

  const waiting = remote
    ? REMOTE[remote].line
    : "Waiting for the talk. Open it in another window of this browser and press Start; this screen then follows it and can drive it.";

  return (
    <div className="deck-notes" data-remote={remote ?? undefined}>
      <header className="deck-notes__bar">
        <p className="deck-notes__time">
          <strong>{elapsed}</strong>
          <span>{clock}</span>
        </p>
        <p className="deck-notes__place">
          {snapshot ? `${snapshot.number} of ${snapshot.total}` : remote ? "Phone remote" : "Not connected"}
          {remote ? (
            <span className="deck-notes__link" role="status">
              {" "}
              · {REMOTE[remote].mark}
            </span>
          ) : (
            link !== "open" && <span> · link {link === "error" ? "down" : "off"}</span>
          )}
          {snapshot?.blackout && <span> · screen blanked</span>}
        </p>
      </header>

      <div className="deck-notes__body">
        {snapshot ? (
          <>
            <h1 className="deck-notes__title">{snapshot.title}</h1>
            <p className="deck-notes__note">{snapshot.note ?? "No note for this step."}</p>
            <p className="deck-notes__next">
              <span>Next</span>
              {snapshot.nextTitle ?? "The end of the talk."}
            </p>
          </>
        ) : (
          <>
            <h1 className="deck-notes__title">{deck.title}</h1>
            <p className="deck-notes__note">{waiting}</p>
          </>
        )}
      </div>

      <nav className="deck-notes__controls" aria-label="Deck controls">
        <button type="button" className="deck-notes__back" {...press("prev")} onClick={() => tap({ type: "prev" })}>
          Back
        </button>
        <button type="button" className="deck-notes__forward" {...press("next")} onClick={() => tap({ type: "next" })}>
          Next
        </button>
        <button type="button" className="deck-notes__minor" onClick={() => send({ type: "blackout" })}>
          {snapshot?.blackout ? "Show screen" : "Blank screen"}
        </button>
        <button type="button" className="deck-notes__minor" onClick={() => send({ type: "resetTimer" })}>
          Reset clock
        </button>
      </nav>

      <section className="deck-notes__script" aria-label="The whole script">
        <h1>{deck.title}</h1>
        {deck.worlds.map((entry) => (
          <div key={entry.world.id}>
            <h2>{entry.title}</h2>
            {entry.world.steps.map((step) => (
              <article key={step.id}>
                <h3>{entry.copy?.[step.id]?.title ?? step.id}</h3>
                <p>{entry.copy?.[step.id]?.note ?? ""}</p>
              </article>
            ))}
          </div>
        ))}
      </section>
    </div>
  );
}
