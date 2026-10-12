/**
 * The build world's own drawing parts. Every picture is HTML on the plane:
 * a small SVG per drawing (`Pic`), so a change repaints that drawing and no
 * other, and set words (`Words`) in navy. What moves is moved by transform
 * and opacity; the board and the year are layers of their own (scene-board,
 * scene-year). The agents' shapes are this world's, one per kind, as the
 * script gives them (slide 19): lead agents a gold ring, builders squares,
 * testers triangles, reviewers diamonds, fixers hexagons. Only the lead
 * agents have a colour; the shape alone tells the other kinds apart.
 */
"use client";

import type { CSSProperties, ReactNode } from "react";
import { place, type Box, type Point } from "@/components/deck/kit";
import { agentArcs } from "@/components/deck/kit/glyph-geometry";
import type { Kind } from "./kinds";

type PicProps = {
  at: Box;
  id?: string;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
};

/** A drawing in its own SVG, drawn in stage pixels: its view box is its place on the stage. */
export function Pic({ at, id, className, style, children }: PicProps) {
  return (
    <div className={`bw-pic${className ? ` ${className}` : ""}`} data-build={id} style={{ ...place(at), ...style }}>
      <svg width={at.w} height={at.h} viewBox={`${at.x} ${at.y} ${at.w} ${at.h}`} aria-hidden="true">
        {children}
      </svg>
    </div>
  );
}

type WordsProps = {
  id?: string;
  /** Top left; with `width` and `align`, the box the lines sit in. */
  at: Point;
  lines: readonly string[];
  /** 26 px (`label`), 32 px (`text`), 40 px semibold (`name`) or 48 px semibold (`big`). */
  size?: "label" | "text" | "name" | "big";
  width?: number;
  align?: "left" | "center" | "right";
  className?: string;
};

/** Words on the plane, in navy, broken where the author broke them. */
export function Words({ id, at, lines, size = "label", width, align = "left", className }: WordsProps) {
  return (
    <p className={`bw-words bw-words--${size}${className ? ` ${className}` : ""}`} data-build={id} style={{ left: at.x, top: at.y, width, textAlign: align }}>
      {lines.map((line, i) => (
        <span key={i} className="bw-words__line">
          {line}
        </span>
      ))}
    </p>
  );
}

/** The outline of each kind's shape, centred on 0 0, `r` its half width. */
export function shapePath(kind: Kind, r: number): string {
  const k = (n: number) => Math.round(n * r * 100) / 100;
  switch (kind) {
    case "builder":
      return `M${k(-0.86)} ${k(-0.86)}H${k(0.86)}V${k(0.86)}H${k(-0.86)}Z`;
    case "tester":
      return `M0 ${k(-1)}L${k(0.98)} ${k(0.8)}H${k(-0.98)}Z`;
    case "reviewer":
      return `M0 ${k(-1.08)}L${k(1.08)} 0L0 ${k(1.08)}L${k(-1.08)} 0Z`;
    case "fixer":
      return `M${k(-0.5)} ${k(-0.87)}H${k(0.5)}L${k(1)} 0L${k(0.5)} ${k(0.87)}H${k(-0.5)}L${k(-1)} 0Z`;
    case "lead":
      return `M${k(-0.46)} 0A${k(0.46)} ${k(0.46)} 0 1 0 ${k(0.46)} 0A${k(0.46)} ${k(0.46)} 0 1 0 ${k(-0.46)} 0Z`;
  }
}

/** One agent: its kind's shape in navy, with a white edge so it reads over a filled cell. A lead agent is the deck's agent ring in gold, round a gold body. */
export function Shape({ kind, at, r, id }: { kind: Kind; at: Point; r: number; id?: string }) {
  if (kind === "lead") {
    const ring = r - Math.max(1.5, r * 0.08);
    return (
      <g className="bw-lead" data-build={id}>
        {agentArcs(at, ring).map((arc, i) => (
          <path key={i} className="bw-lead__arc" d={arc.d} strokeWidth={Math.max(3, r * 0.16)} />
        ))}
        <path className="bw-shape" data-kind="lead" d={shapePath("lead", r)} transform={`translate(${at.x} ${at.y})`} />
      </g>
    );
  }
  return <path className="bw-shape" data-kind={kind} data-build={id} d={shapePath(kind, r)} transform={`translate(${at.x} ${at.y})`} />;
}

/** An agent standing on its own: a shape in a small drawing of its own that a move can carry. */
export function Agent({ kind, at, r, id }: { kind: Kind; at: Point; r: number; id?: string }) {
  const pad = r + 4;
  return (
    <Pic at={{ x: at.x - pad, y: at.y - pad, w: 2 * pad, h: 2 * pad }} id={id} className="bw-agent">
      <Shape kind={kind} at={at} r={r} />
    </Pic>
  );
}

/** The passed tick: a deep-green badge with a white tick, the one mark that means a check passed. */
export function Tick({ at, r = 11, id }: { at: Point; r?: number; id?: string }) {
  const k = r / 11;
  return (
    <g className="bw-tick" data-build={id}>
      <circle className="bw-tick__badge" cx={at.x} cy={at.y} r={r} />
      <path className="bw-tick__mark" d={`M${at.x - 5 * k} ${at.y + 0.5 * k}L${at.x - 1.5 * k} ${at.y + 4 * k}L${at.x + 5.5 * k} ${at.y - 4 * k}`} />
    </g>
  );
}

/** A failed check: a navy cross. */
export function Cross({ at, r = 12 }: { at: Point; r?: number }) {
  return <path className="bw-ink bw-ink--heavy" d={`M${at.x - r} ${at.y - r}L${at.x + r} ${at.y + r}M${at.x + r} ${at.y - r}L${at.x - r} ${at.y + r}`} />;
}

/** A person, as the kit draws one, at any size: head and shoulders in navy. */
export function Figure({ at, id }: { at: Box; id?: string }) {
  const cx = at.x + at.w / 2;
  const r = at.w * 0.25;
  const head = at.y + r + 2;
  const top = head + r + at.h * 0.1;
  const bottom = at.y + at.h - 2;
  return (
    <g className="bw-figure" data-build={id}>
      <circle cx={cx} cy={head} r={r} />
      <path d={`M${at.x + 2} ${bottom}V${top + at.w * 0.42}A${at.w / 2 - 2} ${at.w * 0.42} 0 0 1 ${at.x + at.w - 2} ${top + at.w * 0.42}V${bottom}`} />
    </g>
  );
}

/** The person-approves mark: an orange ring round an orange dot. Orange is for this and nothing else. */
export function Approves({ at, id, r = 24 }: { at: Point; id?: string; r?: number }) {
  return (
    <g className="bw-approves" data-build={id}>
      <circle className="bw-approves__ring" cx={at.x} cy={at.y} r={r} />
      <circle className="bw-approves__dot" cx={at.x} cy={at.y} r={r * 0.38} />
    </g>
  );
}

/** An arrow: a line and an open head where it arrives. A `drawn` one strokes on from its tail with `draw`; any other comes and goes whole. */
export function Arrow({ from, to, id, className, drawn = false }: { from: Point; to: Point; id?: string; className?: string; drawn?: boolean }) {
  const angle = Math.atan2(to.y - from.y, to.x - from.x);
  const head = (turn: number) => `${to.x - 14 * Math.cos(angle + turn)} ${to.y - 14 * Math.sin(angle + turn)}`;
  const stroke = drawn ? { className: "dk-draw", pathLength: 1 } : {};
  return (
    <g className={`bw-arrow${className ? ` ${className}` : ""}`} data-build={id}>
      <path d={`M${from.x} ${from.y}L${to.x} ${to.y}`} {...stroke} />
      <path d={`M${head(0.5)}L${to.x} ${to.y}L${head(-0.5)}`} {...stroke} />
    </g>
  );
}
