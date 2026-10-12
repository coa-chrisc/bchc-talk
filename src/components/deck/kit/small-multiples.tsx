/**
 * One picture becoming a grid of the same picture, and back. The original
 * stays the original: it is the scene's own part, and `spread` moves it to
 * the grid's first slot. This draws the copies for the other slots, each a
 * finished version of the picture (`--d`, `--k` and `--pass` are set on the
 * copy, so a board inside it is drawn, with its work done).
 */
import type { CSSProperties, ReactNode } from "react";
import type { MultiplesLayout } from "./board-layout";

const DONE = { "--d": 1, "--k": 1, "--pass": 1 } as CSSProperties;

export function SmallMultiples({ layout, children }: { layout: MultiplesLayout; children: (index: number) => ReactNode }) {
  const { from } = layout;
  return layout.copies.map((copy, i) => (
    <g key={copy.key} transform={`translate(${copy.x} ${copy.y}) scale(${copy.scale}) translate(${-from.x} ${-from.y})`}>
      <g data-build={copy.key} style={DONE}>
        {children(i + 1)}
      </g>
    </g>
  ));
}
