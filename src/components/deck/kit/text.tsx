/**
 * Set text for the stage: HTML placed on a plane in stage pixels. Headlines
 * are set by the author line by line and never measured or split in the
 * browser, so a fallback face can never decide a break.
 */
"use client";

import type { CSSProperties, ReactNode } from "react";
import { driven } from "./driven";
import { place } from "./geometry";
import type { Box } from "./tokens";

const at = (box: Partial<Box> & { x: number; y: number }): CSSProperties => ({ left: box.x, top: box.y, width: box.w, height: box.h });

type SetTextProps = {
  /** Each line's id is this; `lines(id)` brings them up in turn. */
  id: string;
  x: number;
  y: number;
  lines: readonly ReactNode[];
  /** The headline face at 108 (`display`), 96 (`large`), 72 (`title`), 64 (`quote`) or 48 (`medium`); `text` is body copy at 32. */
  size?: "display" | "large" | "title" | "quote" | "medium" | "text";
  /** A `title` draws the short green rule under its last line unless this is false. */
  rule?: boolean;
};

/** Lines of type, each in a mask it rises out of. */
export function SetText({ id, x, y, lines, size = "display", rule = true }: SetTextProps) {
  return (
    <p className={`dk-set dk-set--${size}`} style={at({ x, y })} data-rule={rule ? undefined : "off"}>
      {lines.map((line, i) => (
        <span key={i} className="dk-set__mask">
          <span className="dk-set__line" data-build={id}>
            {line}
          </span>
        </span>
      ))}
    </p>
  );
}

/** A block of HTML on the plane that a move can name: a caption, a paragraph, a figure with its label. */
export function Block({ id, at: box, className, children }: { id: string; at: Box; className?: string; children: ReactNode }) {
  return (
    <div className={`dk-block${className ? ` ${className}` : ""}`} data-build={id} style={place(box)}>
      {children}
    </div>
  );
}

const number = new Intl.NumberFormat("en-US");
const tally = driven<HTMLSpanElement>("count", 0, (span, value) => {
  span.textContent = number.format(Math.round(value));
});

/** A number that counts (`count`). `width` in digits keeps the label beside it still; `size` is the figure's, 108 (`display`) or 56 (`figure`). */
export function Counter({ id, x, y, width = 4, label, size = "display" }: { id: string; x: number; y: number; width?: number; label?: string; size?: "display" | "figure" }) {
  return (
    <p className="dk-counter" data-build={`${id}.box`} style={at({ x, y })}>
      <span ref={tally} className={`dk-counter__figure${size === "figure" ? " dk-figure" : ""}`} data-build={id} style={{ minWidth: `${width}ch` }} />
      {label && <span className="dk-label">{label}</span>}
    </p>
  );
}

/** A line that types itself out (`type`): a command, a request in plain language. Its box is the full line's from the start. */
export function TypeText({ id, x, y, text }: { id: string; x: number; y: number; text: string }) {
  const typing = driven<HTMLSpanElement>("typed", 0, (span, k) => {
    span.textContent = text.slice(0, Math.round(text.length * Math.min(1, Math.max(0, k))));
  });
  return (
    <p className="dk-type" style={at({ x, y })}>
      <span className="dk-type__full" aria-hidden="true">
        {text}
      </span>
      <span ref={typing} className="dk-type__typed" data-build={id} aria-label={text} />
    </p>
  );
}
