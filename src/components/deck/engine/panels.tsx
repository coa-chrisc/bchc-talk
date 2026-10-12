/**
 * The deck's panels. All of them sit over the window, outside the scaled
 * stage, in ordinary screen pixels: the gate before the first step, the
 * overview, the rehearsal readout, and the thin chrome.
 */
"use client";

import { useEffect, useMemo, useState } from "react";
import { formatElapsed, readStart } from "./clock";
import type { Position } from "./deck-state";
import { paces, type FrameStats } from "./frame-meter";
import type { Command } from "./keys";
import { qrPath } from "./qr";
import type { Readiness } from "./readiness";
import type { TransportStatus } from "./transport";
import type { DeckDef } from "./types";
import type { RemoteState } from "./use-remote";

type GateProps = {
  title: string;
  readiness: Readiness;
  ready: boolean;
  reduced: boolean;
  missing: string[];
  onReduced(reduced: boolean): void;
  onStart(): void;
  /** The phone remote, or null on a deck that offers none. */
  remote: RemoteState | null;
  onRemote(): void;
};

const Check = ({ ok, children }: { ok: boolean; children: React.ReactNode }) => (
  <li data-ok={ok}>
    <span aria-hidden="true">{ok ? "✓" : "…"}</span>
    {children}
  </li>
);

/** The join address as a QR code, dark on white whatever the page's colours, because that is what a camera reads. */
function Qr({ text }: { text: string }) {
  const { size, path } = useMemo(() => qrPath(text), [text]);
  return (
    <svg className="deck-qr" viewBox={`0 0 ${size} ${size}`} role="img" aria-label="QR code for the phone remote" shapeRendering="crispEdges">
      <rect width={size} height={size} fill="#fff" />
      <path d={path} fill="#000" />
    </svg>
  );
}

/** How the remote stands, in the presenter's words. */
function remoteLine({ phase, paired }: RemoteState): string {
  if (phase === "connecting") return "Connecting to the relay.";
  if (phase === "reconnecting") return "The relay dropped and is reconnecting. The keyboard and clicker work regardless.";
  if (phase === "refused") return "The relay refused this session. Ask for a new one.";
  if (phase === "connected") return paired ? "A phone is paired and can drive the talk." : "Ready for a phone. Anyone who scans this can drive the talk, so keep it off the room’s screen.";
  return "";
}

/** The gate's remote: one control to ask for it, then how to pair a phone. Nothing is asked of the network until that control is pressed. */
function GateRemote({ remote, onRemote }: { remote: RemoteState; onRemote(): void }) {
  const { phase, url } = remote;
  if (phase === "unavailable") {
    return <p className="deck-gate__remote">The phone remote is not set up on this site, so run the talk from the keyboard or a clicker.</p>;
  }
  if (phase === "opening") return <p className="deck-gate__remote">Setting up the phone remote.</p>;
  const asking = !url || phase === "refused" || phase === "closed";
  return (
    <div className="deck-gate__remote">
      {asking ? (
        <p>
          <button type="button" className="deck-gate__ask" onClick={onRemote}>
            {phase === "off" || phase === "closed" ? "Use a phone as the remote" : "Try the phone remote again"}
          </button>
          {phase === "failed" && " The phone remote could not be reached. The keyboard and clicker work regardless."}
          {phase === "refused" && ` ${remoteLine(remote)}`}
        </p>
      ) : (
        <>
          <Qr text={url} />
          <p>
            Scan this with the phone’s camera, or open this address on the phone:
            <span className="deck-gate__address">{url}</span>
            <span aria-live="polite">{remoteLine(remote)}</span>
          </p>
        </>
      )}
    </div>
  );
}

/** The readiness gate: what the presenter sees before the first step, and the only place the talk starts from. */
export function Gate({ title, readiness, ready, reduced, missing, onReduced, onStart, remote, onRemote }: GateProps) {
  const { fonts, images, canvases, hz, prefersReduced, wakeLock } = readiness;
  return (
    <div className="deck-gate" data-deck-control>
      <div className="deck-gate__panel">
        <p className="deck-gate__eyebrow">Ready check</p>
        <h1 className="deck-gate__title">{title}</h1>
        <ul className="deck-gate__checks">
          <Check ok={fonts}>Typefaces loaded</Check>
          <Check ok={images.done === images.total && fonts}>
            Pictures decoded ({images.done} of {images.total})
          </Check>
          <Check ok={fonts}>Canvases allocated ({canvases})</Check>
          <Check ok={hz !== null}>Display {hz === null ? "being measured" : `runs at ${hz} Hz`}</Check>
          <Check ok>Screen wake lock {wakeLock ? "available" : "not available in this browser: turn off the screen saver"}</Check>
        </ul>
        {missing.length > 0 && <p className="deck-gate__warning">A step names parts its scene does not have: {missing.join(", ")}.</p>}
        {prefersReduced && (
          <p className="deck-gate__warning">
            This computer asks for reduced motion. The talk plays its motion unless you choose otherwise here.
          </p>
        )}
        <div className="deck-gate__row">
          <button type="button" className="deck-gate__start" disabled={!ready} onClick={onStart}>
            {ready ? "Start" : "Getting ready"}
          </button>
          <label className="deck-gate__toggle">
            <input type="checkbox" checked={reduced} onChange={(event) => onReduced(event.target.checked)} />
            Reduce motion (every step cuts)
          </label>
        </div>
        {remote && <GateRemote remote={remote} onRemote={onRemote} />}
        <p className="deck-gate__keys">
          Space, arrows, a click or a clicker step. Backspace goes back. The back and forward buttons at the bottom right step too. Type a number, then Enter, to jump. O overview, N notes, B or full stop blanks the
          screen, H rehearsal readout. Use the browser’s own full screen.
        </p>
      </div>
    </div>
  );
}

type OverviewProps = { deck: DeckDef; position: Position; onPick(world: number, step: number): void };

/** Every step, grouped by world and numbered as a typed jump numbers them. */
export function Overview({ deck, position, onPick }: OverviewProps) {
  let number = 0;
  return (
    <div className="deck-overview" data-deck-control>
      {deck.worlds.map((entry, w) => (
        <section key={entry.world.id} className="deck-overview__world">
          <h2>{entry.title}</h2>
          <ol>
            {entry.world.steps.map((step, s) => (
              <li key={step.id}>
                <button type="button" aria-current={w === position.world && s === position.step ? "step" : undefined} onClick={() => onPick(w, s)}>
                  <span>{++number}</span>
                  {entry.copy?.[step.id]?.title ?? step.id}
                </button>
              </li>
            ))}
          </ol>
        </section>
      ))}
    </div>
  );
}

type HudProps = { deckId: string; number: number; total: number; hz: number | null; frames(): FrameStats };

/** The rehearsal readout: frame pace, place, time. Off unless asked for with H. */
export function Hud({ deckId, number, total, hz, frames }: HudProps) {
  const [reading, setReading] = useState<{ stats: FrameStats; elapsed: string } | null>(null);
  useEffect(() => {
    const read = () => {
      const started = readStart(deckId);
      setReading({ stats: frames(), elapsed: started ? formatElapsed(Date.now() - started) : "0:00" });
    };
    const timer = window.setInterval(read, 500);
    return () => window.clearInterval(timer);
  }, [deckId, frames]);
  const interval = hz ? 1000 / hz : 16.7;
  return (
    <dl className="deck-hud" data-slow={reading ? !paces(reading.stats, interval) : undefined}>
      <dt>Frame p95</dt>
      <dd>{reading ? `${reading.stats.p95} ms` : "…"}</dd>
      <dt>Worst</dt>
      <dd>{reading ? `${reading.stats.worst} ms` : "…"}</dd>
      <dt>Step</dt>
      <dd>
        {number} of {total}
      </dd>
      <dt>Elapsed</dt>
      <dd>{reading?.elapsed ?? "…"}</dd>
      <dt>Display</dt>
      <dd>{hz ? `${hz} Hz` : "…"}</dd>
    </dl>
  );
}

type ChromeProps = {
  progress: number;
  number: number;
  total: number;
  typed: string;
  link: TransportStatus;
  remote: RemoteState;
  /** Whether to show the back and forward buttons: not while the screen is blanked or a panel covers the stage. */
  controls: boolean;
  /** The deck's own command path, the one its keys take. */
  onCommand(command: Command): void;
};

/** The remote's phases in which a phone cannot drive the deck, and the mark each gets. */
const REMOTE_MARKS: Partial<Record<RemoteState["phase"], string>> = { connecting: "connecting", reconnecting: "reconnecting", refused: "down" };

/** A chevron for the back and forward buttons, a fine line in the text's colour. */
const Chevron = ({ back }: { back?: boolean }) => (
  <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false">
    <path d={back ? "M10 3 5 8l5 5" : "M6 3l5 5-5 5"} />
  </svg>
);

/** A press with the pointer leaves focus where it was, so Space and Enter go on stepping the deck instead of pressing the button again. */
const keepFocus = (event: React.MouseEvent) => event.preventDefault();

/**
 * The thin chrome: a progress line, the step's number, back and forward
 * buttons for a mouse, and a mark when the link to the notes or to the
 * phone is down. Until a phone has paired it also shows how to: the chrome
 * fades when the pointer rests, and once a phone is driving the talk the
 * code is not put on the screen again.
 */
export function Chrome({ progress, number, total, typed, link, remote, controls, onCommand }: ChromeProps) {
  const mark = REMOTE_MARKS[remote.phase];
  return (
    <div className="deck-chrome">
      <div className="deck-chrome__progress">
        <i style={{ transform: `scaleX(${progress})` }} />
      </div>
      {remote.url && remote.phase === "connected" && !remote.paired && (
        <div className="deck-chrome__pairing">
          <Qr text={remote.url} />
          <p>
            Phone remote: scan, or open <span>{remote.url}</span>
          </p>
        </div>
      )}
      <div className="deck-chrome__corner">
        <p className="deck-chrome__counter">
          {mark ? (
            <span className="deck-chrome__link" title="The phone remote is not connected. Keys and clicker still work.">
              Phone remote {mark}
            </span>
          ) : (
            link !== "open" && (
              <span className="deck-chrome__link" title="The notes link is down. Keys and clicker still work.">
                Notes link {link === "error" ? "down" : "off"}
              </span>
            )
          )}
          {typed ? <span className="deck-chrome__typed">Go to {typed}, then Enter</span> : `${number} / ${total}`}
        </p>
        {controls && (
          <nav className="deck-chrome__steps" aria-label="Slides">
            {/* At either end the deck stays put, as it does for the keys, and the button says so. */}
            <button type="button" className="deck-chrome__step" aria-label="Previous slide" aria-disabled={number <= 1 || undefined} onMouseDown={keepFocus} onClick={() => onCommand("prev")}>
              <Chevron back />
            </button>
            <button type="button" className="deck-chrome__step" aria-label="Next slide" aria-disabled={number >= total || undefined} onMouseDown={keepFocus} onClick={() => onCommand("next")}>
              <Chevron />
            </button>
          </nav>
        )}
      </div>
    </div>
  );
}
