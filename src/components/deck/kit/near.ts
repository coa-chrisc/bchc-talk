"use client";

import { createContext, useContext } from "react";

/**
 * Whether a world is the one showing or next to it. Parts that hold memory
 * (a canvas) allocate only while this is true; every world stays mounted
 * either way.
 */
export const NearContext = createContext(true);
export const useNear = () => useContext(NearContext);

/** A canvas's pixel ratio: the window's, times the scale it is shown at, kept under a 3840 by 2160 backing store. */
export function backingRatio(w: number, h: number, shown = 1) {
  const wanted = (typeof window === "undefined" ? 1 : window.devicePixelRatio) * shown;
  return Math.max(0.5, Math.min(wanted, Math.sqrt((3840 * 2160) / (w * h))));
}
