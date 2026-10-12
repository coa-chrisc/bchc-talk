/**
 * The pieces Part 4's slides draw with: a slide's HTML as one part, its
 * story lines, a navy label, a tool's icon, a tool card, the dashed corner
 * an adapted copy carries, and a department's disc. Every word set here is
 * passed in from the layout, which reads it from the script.
 */
"use client";

import type { ReactNode } from "react";
import { Block, Story, type Box, type Point } from "@/components/deck/kit";
import { CARD, STORIES, type Icon } from "./layout";

/** A slide's HTML, gathered as one part. */
export function Group({ id, children }: { id: string; children?: ReactNode }) {
  return (
    <div className="sh-group" data-build={id}>
      {children}
    </div>
  );
}

/** A slide's story lines, in the band under its title. */
export function StoryOf({ picture }: { picture: string }) {
  const band = STORIES.find((entry) => entry.picture === picture)!;
  return <Story id={band.id} band={band.band} lines={band.lines} />;
}

/** A label of a few words, in the 26 px label type, in navy: the viewer reads it. */
export function Label({ id, at, align = "center", children }: { id: string; at: Box; align?: "center" | "left" | "right"; children: ReactNode }) {
  const set = align === "center" ? " dk-block--center" : align === "right" ? " dk-block--right" : "";
  return (
    <Block id={id} at={at} className={`dk-block--label dk-block--lines sh-word${set}`}>
      {children}
    </Block>
  );
}

/** A tool's icon, drawn in a 28 px box and scaled to `size`: a map pin, a bar chart, joined pipes, or an envelope. */
export function IconMark({ icon, at, size = 28 }: { icon: Icon; at: Point; size?: number }) {
  return (
    <g className="sh-icon" transform={`translate(${at.x} ${at.y}) scale(${size / 28})`}>
      {icon === "pin" && (
        <>
          <path d="M14 25.5C14 25.5 6 16.6 6 11a8 8 0 0 1 16 0c0 5.6-8 14.5-8 14.5Z" />
          <circle cx={14} cy={11} r={3} />
        </>
      )}
      {icon === "chart" && (
        <>
          <path d="M3 25H25" />
          <rect className="sh-icon__solid" x={6} y={15} width={4} height={8} />
          <rect className="sh-icon__solid" x={12} y={7} width={4} height={16} />
          <rect className="sh-icon__solid" x={18} y={11} width={4} height={12} />
        </>
      )}
      {icon === "pipes" && (
        <>
          <path className="sh-icon__pipe" d="M3 9H14a5 5 0 0 1 5 5V25" />
          <path d="M9 4.5V13.5M14.5 19H23.5" />
        </>
      )}
      {icon === "mail" && (
        <>
          <rect x={3} y={7} width={22} height={15} rx={2} />
          <path d="M4.5 8.5L14 16l9.5-7.5" />
        </>
      )}
    </g>
  );
}

/** The dashed corner an adapted copy carries at its top right: the corner cut back to the ground and redrawn dashed in navy. */
export function Corner({ id, right, top, size, className }: { id?: string; right: number; top: number; size: number; className?: string }) {
  return (
    <g className={className ? `sh-corner ${className}` : "sh-corner"} data-build={id}>
      <rect className="sh-corner__cut" x={right - size} y={top - 2} width={size + 2} height={size + 2} />
      <path className="sh-corner__dash" d={`M${right - size} ${top}V${top + size}H${right}`} />
    </g>
  );
}

export type Tool = { name: string; icon: Icon };

/**
 * A tool as a card: its icon and name on one line. `own` is a department's,
 * with a navy edge; `listed` is the catalog's, with its indigo edge and
 * tint; `copy` starts as the catalog's and turns into the department's own
 * with a dashed corner as its `--k` goes from 0 to 1.
 */
export function ToolCard({ id, at, tool, kind }: { id: string; at: Point; tool: Tool; kind: "own" | "listed" | "copy" }) {
  const { w, h, rx, icon, pad } = CARD;
  return (
    <g className={`sh-card sh-card--${kind}`} data-build={id}>
      {kind !== "own" && <rect className="sh-card__listed" x={at.x} y={at.y} width={w} height={h} rx={rx} />}
      {kind !== "listed" && <rect className="sh-card__own" x={at.x} y={at.y} width={w} height={h} rx={rx} />}
      <IconMark icon={tool.icon} at={{ x: at.x + pad, y: at.y + (h - icon) / 2 }} size={icon} />
      <text className="dk-label sh-word" x={at.x + pad + icon + 12} y={at.y + h / 2} dominantBaseline="central">
        {tool.name}
      </text>
      {kind === "copy" && <Corner right={at.x + w} top={at.y} size={CARD.corner} />}
    </g>
  );
}

/** A department as a navy circle on the ground, that draws on (`draw`, `--d`), or shows whole where it has no id of its own; given a name, it is set under the circle and comes up with it. */
export function Disc({ id, at, r, name }: { id?: string; at: Point; r: number; name?: { text: string; at: Box } }) {
  return (
    <g className="sh-disc" data-build={id}>
      <circle cx={at.x} cy={at.y} r={r} pathLength={1} transform={`rotate(-90 ${at.x} ${at.y})`} />
      {name && (
        <text className="dk-label sh-word" x={name.at.x + name.at.w / 2} y={name.at.y + name.at.h / 2} textAnchor="middle" dominantBaseline="central">
          {name.text}
        </text>
      )}
    </g>
  );
}
