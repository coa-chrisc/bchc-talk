/**
 * A field of marks, for a number too large to count by eye: hundreds to a
 * few thousand, drawn on one canvas. `light(id, { to })` lights the first
 * marks; the rest stay dim. The canvas holds memory only while its world is
 * near, and what it shows depends on nothing but how many are lit.
 */
"use client";

import { useCallback, useEffect, useRef } from "react";
import { driven, read } from "./driven";
import { place } from "./geometry";
import { backingRatio, useNear } from "./near";
import type { Box } from "./tokens";

type TickFieldProps = { id: string; at: Box; count: number; cols: number };

/** The words' navy (kit.css `--dk-paper`) as RGB, for a canvas that cannot read the token. */
const PAPER = "34, 37, 78";

function paint(canvas: HTMLCanvasElement, { at, count, cols }: TickFieldProps, lit: number) {
  const context = canvas.width ? canvas.getContext("2d") : null;
  if (!context) return;
  const ratio = canvas.width / at.w;
  const rows = Math.ceil(count / cols);
  const pitchX = at.w / cols;
  const pitchY = at.h / rows;
  const w = Math.max(3, pitchX * 0.34);
  const h = pitchY * 0.72;
  context.setTransform(ratio, 0, 0, ratio, 0, 0);
  context.clearRect(0, 0, at.w, at.h);
  const upTo = Math.round(lit);
  for (const bright of [false, true]) {
    context.fillStyle = `rgba(${PAPER}, ${bright ? 0.95 : 0.24})`;
    for (let i = bright ? 0 : upTo; i < (bright ? upTo : count); i++) {
      context.fillRect((i % cols) * pitchX + (pitchX - w) / 2, Math.floor(i / cols) * pitchY + (pitchY - h) / 2, w, h);
    }
  }
}

export function TickField(props: TickFieldProps) {
  const { id, at } = props;
  const near = useNear();
  const canvas = useRef<HTMLCanvasElement | null>(null);
  const latest = useRef(props);
  const attach = useCallback((element: HTMLCanvasElement | null) => {
    canvas.current = element;
    driven<HTMLCanvasElement>("lit", 0, (target, lit) => paint(target, latest.current, lit))(element);
  }, []);

  useEffect(() => {
    const element = canvas.current;
    if (!element) return;
    latest.current = props;
    const scale = Number(getComputedStyle(element).getPropertyValue("--deck-scale")) || 1;
    const ratio = near ? backingRatio(at.w, at.h, scale) : 0;
    element.width = Math.round(at.w * ratio);
    element.height = Math.round(at.h * ratio);
    paint(element, props, read(element, "lit"));
  });

  return <canvas ref={attach} className="dk-ticks" data-build={id} data-canvas={near ? "on" : "off"} style={place(at)} />;
}
