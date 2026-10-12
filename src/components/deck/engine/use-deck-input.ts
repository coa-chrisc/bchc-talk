"use client";

import { useEffect, useRef, type RefObject } from "react";
import { commandFor, swipeCommand, type Command } from "./keys";

/** Seconds of stillness before the pointer and the chrome fade. */
const IDLE = 2000;

/** The controls. A click on one, or on anything inside one, belongs to the control and never steps the deck. */
export const CONTROL = "button, a, input, select, textarea, [data-deck-control]";

/**
 * The deck's input: keys from the keyboard or a clicker, a click or tap
 * anywhere that is not a control, and a horizontal swipe. Also marks the
 * deck idle after two seconds without the pointer, so the cursor and the
 * chrome get out of the picture.
 */
export function useDeckInput(root: RefObject<HTMLElement | null>, onCommand: (command: Command) => void) {
  useEffect(() => {
    const element = root.current;
    if (!element) return;

    const onKey = (event: KeyboardEvent) => {
      const target = event.target instanceof Element ? event.target : null;
      const command = commandFor({
        key: event.key,
        metaKey: event.metaKey,
        ctrlKey: event.ctrlKey,
        altKey: event.altKey,
        repeat: event.repeat,
        onControl: Boolean(target?.closest("button, a")),
        typing: Boolean(target?.closest("input, textarea, select, [contenteditable]")),
      });
      if (command === null) return;
      event.preventDefault();
      if (command !== "noop") onCommand(command);
    };

    let down: { x: number; y: number } | null = null;
    let swiped = false;
    const onTouchStart = (event: TouchEvent) => {
      down = event.touches.length === 1 ? { x: event.touches[0].clientX, y: event.touches[0].clientY } : null;
      swiped = false;
    };
    const onTouchEnd = (event: TouchEvent) => {
      const up = event.changedTouches[0];
      const command = down && up ? swipeCommand(up.clientX - down.x, up.clientY - down.y) : null;
      down = null;
      if (!command) return;
      swiped = true;
      onCommand(command);
    };
    const onClick = (event: MouseEvent) => {
      if (swiped) return void (swiped = false);
      if (event.button !== 0 || (event.target as Element).closest(CONTROL)) return;
      onCommand("next");
    };

    let timer = 0;
    const wake = () => {
      element.removeAttribute("data-idle");
      window.clearTimeout(timer);
      timer = window.setTimeout(() => element.setAttribute("data-idle", ""), IDLE);
    };
    wake();

    window.addEventListener("keydown", onKey);
    element.addEventListener("click", onClick);
    element.addEventListener("touchstart", onTouchStart, { passive: true });
    element.addEventListener("touchend", onTouchEnd, { passive: true });
    element.addEventListener("pointermove", wake);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("keydown", onKey);
      element.removeEventListener("click", onClick);
      element.removeEventListener("touchstart", onTouchStart);
      element.removeEventListener("touchend", onTouchEnd);
      element.removeEventListener("pointermove", wake);
    };
  }, [root, onCommand]);
}

/**
 * Fits the 1920 by 1080 stage to the window: scaled as one piece, centred,
 * and placed on whole device pixels so its edges and hairlines stay sharp.
 * The scale is also published as `--deck-scale`, for canvases sizing their
 * backing store. Returns the refs for the deck's root and its stage.
 */
export function useStageFit(width: number, height: number) {
  const root = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const fit = () => {
      const frame = stage.current;
      if (!root.current || !frame) return;
      const scale = Math.min(window.innerWidth / width, window.innerHeight / height);
      const snap = (css: number) => Math.round(css * window.devicePixelRatio) / window.devicePixelRatio;
      const x = snap((window.innerWidth - width * scale) / 2);
      const y = snap((window.innerHeight - height * scale) / 2);
      frame.style.transform = `translate(${x}px, ${y}px) scale(${scale})`;
      root.current.style.setProperty("--deck-scale", scale.toFixed(4));
    };
    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, [width, height]);
  return { root, stage };
}
