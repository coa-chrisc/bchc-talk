/**
 * The deck: a full-window, click-through talk. It owns where the talk is
 * (deck-state.ts decides every move), hands each move to the director to
 * show, and tells its other screens over a transport. Every world is in the
 * one bundle and mounted once, behind a readiness gate; after that nothing
 * is fetched, so the room's network cannot touch the talk.
 */
"use client";

import { useGSAP } from "@gsap/react";
import { memo, useCallback, useEffect, useMemo, useRef, useState, type ComponentType } from "react";
import { NearContext } from "../kit/near";
import { STAGE } from "../kit/tokens";
import { ensureStart, readStart, resetStart } from "./clock";
import { locate, move, numberOf, progressOf, samePosition, totalSteps, type Action, type Position } from "./deck-state";
import { formatHash, parseHash } from "./deck-url";
import { chromeWorld } from "./chrome";
import { createDirector, type Director } from "./director";
import { createFrameMeter } from "./frame-meter";
import { gsap } from "./gsap";
import { fanOut, type FanOut } from "./fan-out";
import { typeDigit, type Command } from "./keys";
import { Chrome, Gate, Hud, Overview } from "./panels";
import { decodeImages, keepAwake, loadFonts, measureHz, type Readiness } from "./readiness";
import { broadcastTransport, channelName, state, type Intent, type TransportStatus } from "./transport";
import { copyOf, outlineOf, shapeOf, type DeckDef } from "./types";
import { useDeckInput, useStageFit } from "./use-deck-input";
import { useRemote } from "./use-remote";
import "./deck.css";
import "../kit/kit.css";
import "../kit/kit-parts.css";

gsap.registerPlugin(useGSAP);

const START: Position = { world: 0, step: 0 };

/** A world's scene, mounted once and never rendered again: the director does all the moving. */
const Still = memo(function Still({ Scene }: { Scene: ComponentType }) {
  return <Scene />;
});

type Ui = { blackout: boolean; overview: boolean; hud: boolean; typed: string; reduced: boolean };
const UI: Ui = { blackout: false, overview: false, hud: false, typed: "", reduced: false };
type Tools = { director: Director; meter: ReturnType<typeof createFrameMeter>; transport: FanOut };

/** `remotePath` is the route a phone remote is set up through (remote-session.ts); without it the deck offers none. */
export function Deck({ deck, remotePath }: { deck: DeckDef; remotePath?: string }) {
  const shape = useMemo(() => shapeOf(deck), [deck]);
  const outline = useMemo(() => outlineOf(deck), [deck]);
  const { remote, open: openRemote, attach: attachRemote } = useRemote(deck.id, remotePath, deck.notesPath);
  const total = totalSteps(shape);

  const { root, stage } = useStageFit(STAGE.w, STAGE.h);
  const tools = useRef<Tools | null>(null);
  const at = useRef(START);
  const live = useRef(false);
  const view = useRef(UI);

  const [position, setPosition] = useState(START);
  const [ui, setUi] = useState(UI);
  const [armed, setArmed] = useState(false);
  const [started, setStarted] = useState(false);
  const [link, setLink] = useState<TransportStatus>("open");
  const [missing, setMissing] = useState<string[]>([]);
  const [readiness, setReadiness] = useState<Readiness>({ fonts: false, images: { done: 0, total: 0 }, canvases: 0, hz: null, prefersReduced: false, wakeLock: false });
  const ready = readiness.fonts && readiness.hz !== null && readiness.images.done === readiness.images.total && armed;

  const patch = useCallback((change: Partial<Ui>) => {
    view.current = { ...view.current, ...change };
    setUi(view.current);
  }, []);

  /** Tells the other screens where the deck is. */
  const announce = useCallback(() => {
    const here = at.current;
    const { world } = deck.worlds[here.world];
    const { position: next } = move(shape, here, { type: "next" });
    const copy = copyOf(deck, here);
    tools.current?.transport.send(
      state({
        ...here,
        worldId: world.id,
        stepId: world.steps[here.step].id,
        number: numberOf(shape, here),
        total: totalSteps(shape),
        title: copy.title,
        note: copy.note ?? null,
        nextTitle: samePosition(next, here) ? null : copyOf(deck, next).title,
        started: readStart(deck.id),
        blackout: view.current.blackout,
      }),
    );
  }, [deck, shape]);

  const go = useCallback(
    (action: Action) => {
      const director = tools.current?.director;
      if (!director || !live.current) return;
      if (director.busy()) {
        // A click during a build finishes that build and stops there.
        director.settle();
        if (action.type === "next") return;
      }
      const from = at.current;
      const { position: next, via } = move(shape, from, action);
      if (samePosition(from, next)) return;
      at.current = next;
      setPosition(next);
      ensureStart(deck.id);
      director.go(from, next, view.current.reduced ? "jump" : via);
      announce();
    },
    [announce, deck.id, shape],
  );

  const start = useCallback(() => {
    const director = tools.current?.director;
    if (!director || live.current) return;
    live.current = true;
    setStarted(true);
    director.open(at.current, !view.current.reduced);
    announce();
  }, [announce]);

  const command = useCallback(
    (cmd: Command) => {
      if (!live.current) return void ((cmd === "enter" || cmd === "next") && start());
      if (typeof cmd === "object") return patch({ typed: typeDigit(view.current.typed, cmd.digit) });
      const { typed, overview, blackout, hud } = view.current;
      if (typed || overview) patch({ typed: "", overview: false });
      if (cmd === "enter" && typed) return go({ type: "goTo", ...locate(shape, Number(typed)) });
      if (cmd === "next" || cmd === "enter") go({ type: "next" });
      else if (cmd === "prev" || cmd === "first" || cmd === "last") go({ type: cmd });
      else if (cmd === "overview") patch({ overview: !overview });
      else if (cmd === "hud") patch({ hud: !hud });
      else if (cmd === "notes") window.open(deck.notesPath, "deck-notes", "popup,width=1180,height=780");
      else if (cmd === "blackout") {
        patch({ blackout: !blackout });
        announce();
      } else if (cmd === "close" && blackout) {
        patch({ blackout: false });
        announce();
      }
    },
    [announce, deck.notesPath, go, patch, shape, start],
  );

  /** An intent from another screen. It asks; the deck decides. */
  const obey = useCallback(
    (intent: Intent) => {
      if (intent.type === "hello") return announce();
      if (intent.type === "resetTimer") {
        resetStart(deck.id);
        return announce();
      }
      if (intent.type === "blackout") {
        patch({ blackout: intent.on ?? !view.current.blackout });
        return announce();
      }
      go(intent);
    },
    [announce, deck.id, go, patch],
  );

  useDeckInput(root, command);

  // The faces first: the worlds are not mounted, and nothing is set, until they are in.
  useEffect(() => {
    let alive = true;
    const element = root.current!;
    void loadFonts(element).then(() => {
      if (!alive) return;
      setReadiness((r) => ({ ...r, fonts: true, prefersReduced: window.matchMedia("(prefers-reduced-motion: reduce)").matches, wakeLock: "wakeLock" in navigator }));
    });
    void measureHz().then((hz) => alive && setReadiness((r) => ({ ...r, hz })));
    return () => {
      alive = false;
    };
  }, [root]);

  // With the worlds mounted: the director, the first picture, the pictures' decode, the link.
  useGSAP(
    () => {
      const element = root.current;
      if (!readiness.fonts || !element || !stage.current) return;
      const frames = Array.from(stage.current.querySelectorAll<HTMLElement>(".deck-world"));
      const worlds = stage.current.querySelector<HTMLElement>(".deck-worlds")!;
      const layer = stage.current.querySelector<HTMLElement>(".deck-layer")!;
      const chrome = chromeWorld(deck);
      const director = createDirector(frames, chrome ? [worlds, layer] : [worlds], deck.worlds.map((entry) => entry.world), chrome ? { root: layer, world: chrome } : undefined);
      const meter = createFrameMeter();
      // This browser's notes window now; the phone's relay joins as a second leg when the presenter asks for it.
      const transport = fanOut(broadcastTransport(channelName(deck.id)));
      const detachRemote = attachRemote(transport);
      tools.current = { director, meter, transport };

      const first = parseHash(window.location.hash, outline) ?? START;
      at.current = first;
      director.place(first);
      const stopListening = transport.subscribe((message) => {
        // The relay's leg has already refused any intent without the session's code (pairing.ts).
        if (message.kind === "intent") obey(message.intent);
      });
      const onHash = () => {
        const target = parseHash(window.location.hash, outline);
        if (target && !samePosition(target, at.current)) go({ type: "goTo", ...target });
      };
      window.addEventListener("hashchange", onHash);
      const watch = window.setInterval(() => setLink(transport.status()), 2000);

      let alive = true;
      void decodeImages(element, (done, count) => {
        if (!alive) return;
        setPosition(first);
        setArmed(true);
        setMissing(director.missing());
        setReadiness((r) => ({ ...r, images: { done, total: count }, canvases: element.querySelectorAll('canvas[data-canvas="on"]').length }));
      });

      Object.assign(window, {
        __deck: {
          ready: () => live.current,
          busy: () => director.busy(),
          position: () => at.current,
          number: () => numberOf(shape, at.current),
          total: totalSteps(shape),
          hash: (number: number) => formatHash(outline, locate(shape, number)),
          missing: () => director.missing(),
          meter,
        },
      });

      return () => {
        alive = false;
        live.current = false;
        window.clearInterval(watch);
        window.removeEventListener("hashchange", onHash);
        stopListening();
        detachRemote();
        transport.close();
        meter.kill();
        director.kill();
        tools.current = null;
      };
    },
    { dependencies: [readiness.fonts, deck, outline, shape, attachRemote, obey, go], scope: root },
  );

  // The address follows the deck, a moment later, without waking the router: the reducer is the truth, the hash is a bookmark.
  useEffect(() => {
    if (!started) return;
    const timer = window.setTimeout(() => {
      try {
        History.prototype.replaceState.call(window.history, window.history.state, "", formatHash(outline, position));
      } catch {
        // A browser that refuses the write loses the bookmark, not the talk.
      }
    }, 200);
    return () => window.clearTimeout(timer);
  }, [outline, position, started]);

  useEffect(() => (started ? keepAwake() : undefined), [started]);

  // A phone that has just connected, or come back, is told where the deck is without having to ask.
  useEffect(() => {
    if (remote.phase === "connected") announce();
  }, [announce, remote.phase]);

  const number = numberOf(shape, position);
  const { ground } = deck.worlds[position.world].world.steps[position.step];
  const frames = useCallback(() => tools.current?.meter.recent() ?? { frames: 0, p95: 0, worst: 0 }, []);

  return (
    <div ref={root} className="deck" data-live={started} data-ground={ground}>
      <div className="deck-backdrop">{deck.Backdrop && <deck.Backdrop />}</div>
      <div ref={stage} className="deck-stage">
        <div className="deck-worlds">
          {readiness.fonts &&
            deck.worlds.map((entry, i) => (
              <div key={entry.world.id} className="deck-world" data-world={entry.world.id}>
                <NearContext value={Math.abs(i - position.world) <= 1}>
                  <Still Scene={entry.world.Scene} />
                </NearContext>
              </div>
            ))}
        </div>
        <div className="deck-layer">{readiness.fonts && deck.chrome && <Still Scene={deck.chrome.Scene} />}</div>
        {deck.Frame && <div className="deck-frame">{readiness.fonts && <deck.Frame number={number} total={total} ground={ground} />}</div>}
      </div>
      {started && <Chrome progress={progressOf(shape, position)} number={number} total={total} typed={ui.typed} link={link} remote={remote} controls={!ui.blackout && !ui.overview} onCommand={command} />}
      {ui.blackout && <div className="deck-blackout" />}
      {ui.overview && <Overview deck={deck} position={position} onPick={(w, s) => {
            patch({ overview: false });
            go({ type: "goTo", world: w, step: s });
          }} />}
      {ui.hud && <Hud deckId={deck.id} number={number} total={total} hz={readiness.hz} frames={frames} />}
      {!started && <Gate title={deck.title} readiness={readiness} ready={ready} reduced={ui.reduced} missing={missing} onReduced={(reduced) => patch({ reduced })} onStart={start} remote={remotePath ? remote : null} onRemote={openRemote} />}
    </div>
  );
}
