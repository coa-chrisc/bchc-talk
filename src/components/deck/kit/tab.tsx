/**
 * A night tab: the label of a place on a paper-mounted picture, set against
 * the ink ring round that place so the two read as one mark. It goes in an
 * ArtefactFrame's children, in the still's own pixels, and is shown (`show`).
 * `tabBeside` says where a tab sits for a ring.
 */
import type { ReactNode } from "react";
import type { Box, Point } from "./tokens";

/** A tab's height: 26 px type on a 40 px ground. */
export const TAB_H = 40;

export type TabPlace = Point & {
  /** Set by its right edge, when it sits to the left of its ring or hangs from the ring's right end. */
  end?: boolean;
};

/**
 * Where a tab goes for a ring: against the middle of its left or right side,
 * under it, hung from its left or right end, or standing on its left end. A
 * tab on a side shares the ring's edge; one underneath starts at the ring's
 * foot, and one on top ends at its head.
 */
export function tabBeside(ring: Box, side: "left" | "right" | "below-left" | "below-right" | "above-left"): TabPlace {
  const middle = ring.y + (ring.h - TAB_H) / 2;
  if (side === "above-left") return { x: ring.x, y: ring.y - TAB_H };
  if (side === "right") return { x: ring.x + ring.w, y: middle };
  if (side === "left") return { x: ring.x, y: middle, end: true };
  if (side === "below-left") return { x: ring.x, y: ring.y + ring.h };
  return { x: ring.x + ring.w, y: ring.y + ring.h, end: true };
}

/** `stacked`: the label set on lines of its own (children as one span a line), for a place with no room for one long tab. */
export function Tab({ id, at, stacked, children }: { id: string; at: TabPlace; stacked?: boolean; children: ReactNode }) {
  const className = ["dk-tab", at.end && "dk-tab--end", stacked && "dk-tab--stacked"].filter(Boolean).join(" ");
  return (
    <span className={className} data-build={id} style={{ left: at.x, top: at.y }}>
      {children}
    </span>
  );
}
