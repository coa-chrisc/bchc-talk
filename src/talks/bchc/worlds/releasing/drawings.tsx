/**
 * Small drawings Part 5 uses on more than one slide: a package, a run of
 * library tiles, a line of writing, a figure, and the four pages of a design
 * system binder. SVG for the plane's marks; each takes its colour from the
 * part it sits in (--hue, from data-hue) and its strength from the part's
 * moves (--d drawn, --k filled) where it says so.
 */
import { Tile, type Box, type Hue } from "@/components/deck/kit";
import type { PageKind } from "./layout-binders";

/**
 * A package: an opaque box, tinted in its part's colour, with its edge in
 * that colour, and the line of its shut lid across its top. `draw` draws
 * the edge on as its part's --d grows; otherwise it is there whole.
 */
export function Package({ at, rx = 8, draw = false, lid = true }: { at: Box; rx?: number; draw?: boolean; lid?: boolean }) {
  const edge = draw ? "rel-pack__edge dk-draw" : "rel-pack__edge";
  return (
    <>
      <rect className={draw ? "rel-pack__ground rel-pack__ground--drawn" : "rel-pack__ground"} x={at.x} y={at.y} width={at.w} height={at.h} rx={rx} />
      <rect className={draw ? "rel-pack__tint rel-pack__ground--drawn" : "rel-pack__tint"} x={at.x} y={at.y} width={at.w} height={at.h} rx={rx} />
      <rect className={edge} x={at.x} y={at.y} width={at.w} height={at.h} rx={rx} pathLength={1} />
      {lid && <path className={edge} d={`M${at.x} ${at.y + at.h * 0.22}H${at.x + at.w}`} pathLength={1} />}
    </>
  );
}

/** Library tiles, `cols` by `rows`, with their top left corner at `at`, drawn `scale` times the wall's size, in a part's colour when given one. */
export function Tiles({ id, at, cols, rows = 1, scale, hue }: { id: string; at: { x: number; y: number }; cols: number; rows?: number; scale: number; hue?: Hue }) {
  return (
    <g transform={`translate(${at.x} ${at.y}) scale(${scale})`}>
      {Array.from({ length: cols * rows }, (_, n) => (
        <Tile key={n} id={`${id}.${n}`} at={{ x: (n % cols) * 24, y: Math.floor(n / cols) * 24 }} hue={hue} />
      ))}
    </g>
  );
}

/** A line of writing: a bar `h` high, in `className`'s colour. */
export const Writing = ({ x, y, w, h = 8, className = "rel-ink-fill" }: { x: number; y: number; w: number; h?: number; className?: string }) => (
  <rect className={className} x={x} y={y} width={w} height={h} rx={h / 2} />
);

/** A figure, head and shoulders, in `at`: plain line, there whole (the kit's `Person` draws on with its part instead). */
export function Figure({ at, className = "bchc-line" }: { at: Box; className?: string }) {
  const cx = at.x + at.w / 2;
  const r = at.w * 0.25;
  const head = at.y + r + 2;
  const top = head + r + at.h * 0.1;
  const bottom = at.y + at.h - 2;
  return (
    <>
      <circle className={className} cx={cx} cy={head} r={r} />
      <path className={className} d={`M${at.x + 2} ${bottom}V${top + at.w * 0.42}A${at.w / 2 - 2} ${at.w * 0.42} 0 0 1 ${at.x + at.w - 2} ${top + at.w * 0.42}V${bottom}`} />
    </>
  );
}

/**
 * What a design system page holds, inside its sheet `at`: brand swatches,
 * buttons and a field, the accessibility figure in its circle, or the lines
 * of a written skill. `ours` is drawn in our colors (navy, and the deck's
 * green, indigo and pink swatches); a copy is drawn in its part's colour,
 * which is the team's own, and comes up with its part (--d, --k).
 */
export function PageMarks({ kind, at, ours = false }: { kind: PageKind; at: Box; ours?: boolean }) {
  const line = ours ? "bchc-line" : "rel-hue-line dk-draw";
  const solid = ours ? "rel-ink-fill" : "rel-hue-fill";
  const midY = at.y + at.h / 2;
  if (kind === "brand") {
    // Ours: Austin Public Health's navy, green and indigo, and the bulb's pink.
    const ourHues = [undefined, "process", "catalog", "share-design"] as const;
    const yourStrengths = [0.3, 0.5, 0.75, 1];
    return [0, 1, 2, 3].map((n) => (
      <rect
        key={n}
        className={ours ? (ourHues[n] ? "rel-swatch" : "rel-ink-fill") : "rel-swatch rel-swatch--yours"}
        data-hue={ours ? ourHues[n] : undefined}
        x={at.x + 26 + n * 48}
        y={midY - 20}
        width={40}
        height={40}
        rx={4}
        fillOpacity={ours ? undefined : yourStrengths[n]}
      />
    ));
  }
  if (kind === "components")
    return (
      <>
        <rect className={solid} x={at.x + 24} y={at.y + 26} width={88} height={30} rx={15} />
        <rect className={line} x={at.x + 124} y={at.y + 26} width={84} height={30} rx={15} pathLength={1} />
        <rect className={line} x={at.x + 24} y={at.y + 74} width={184} height={30} rx={4} pathLength={1} />
        <Writing x={at.x + 36} y={at.y + 85} w={64} className={solid} />
      </>
    );
  if (kind === "accessibility") {
    const cx = at.x + at.w / 2;
    return (
      <>
        <circle className={line} cx={cx} cy={midY} r={36} pathLength={1} transform={`rotate(-90 ${cx} ${midY})`} />
        <Figure at={{ x: cx - 15, y: midY - 21, w: 30, h: 42 }} className={ours ? "bchc-line" : "rel-hue-line rel-hue-line--whole"} />
      </>
    );
  }
  return [184, 150, 170, 104].map((w, n) => <Writing key={n} x={at.x + 24} y={at.y + 26 + n * 22} w={ours ? w : [120, 176, 96, 150][n]} h={10} className={solid} />);
}
