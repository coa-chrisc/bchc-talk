/**
 * The start world's drawings for slides 34 to 38 and 41, for the things
 * neither the kit nor parts.tsx has a part for: a project card, a catalog
 * entry drawn without words, a laptop with an AI coding tool on its
 * screen, a GitHub account and a row of its history, a receipt, a door
 * with its jambs and swing, a person's card, an agent's card holding a
 * change, a locked button, a tool's window with its name, a map pin and a
 * data source. 42's drawings are in parts-ask.tsx. Each is SVG for the
 * plane's marks (the dashed room is HTML, so it can wipe on), moved with
 * the house moves only: `draw` (`--d`), `fill` and `open` (`--k`), and
 * `x`/`y` for travel. Colours are the deck's tokens and a role's colour
 * (start.css); none of them is the approving orange or the passing green. */
import type { ReactNode } from "react";
import { Agent, type Box, type Point } from "@/components/deck/kit";

/** A rounded box: outline only, its class saying how it is drawn. */
const Rect = ({ at, rx, className, draws = false }: { at: Box; rx: number; className: string; draws?: boolean }) => (
  <rect className={draws ? `${className} dk-draw` : className} x={at.x} y={at.y} width={at.w} height={at.h} rx={rx} pathLength={draws ? 1 : undefined} />
);

/** A bar of writing that fills in from its left (`fill`). */
export function Writing({ id, at }: { id: string; at: Box }) {
  return <rect className="st-writing" data-build={id} x={at.x} y={at.y} width={at.w} height={at.h} rx={at.h / 2} />;
}

/** A plain bar of writing, there whenever its drawing is. */
const Bar = ({ at, className = "st-bar" }: { at: Box; className?: string }) => <rect className={className} x={at.x} y={at.y} width={at.w} height={at.h} rx={at.h / 2} />;

/** A word on the stage, in the label face and in navy, as every word on these slides is; `size="text"` sets it at the text size. */
export function Words({ id, at, text, anchor = "middle", size = "label" }: { id?: string; at: Point; text: string; anchor?: "start" | "middle" | "end"; size?: "label" | "text" }) {
  return (
    <text className={size === "text" ? "dk-text" : "dk-label st-name"} data-build={id} x={at.x} y={at.y} textAnchor={anchor} dominantBaseline="central">
      {text}
    </text>
  );
}

type Field = { key: string; text: string; label: Point; at: Box; bar: { key: string; at: Box } };

/**
 * 35's project card: a white card with its name over a rule, and three
 * fields, each a name over a box its writing fills in. The card's outline
 * draws (`draw`); each field's name and box come up (`rise`) and its
 * writing fills (`fill`).
 */
export function ProjectCard({ id, at, name, rule, fields }: { id: string; at: Box; name: { key: string; text: string; at: Point }; rule: { key: string; from: Point; to: Point }; fields: Field[] }) {
  return (
    <>
      <g data-build={id}>
        <rect className="st-card" x={at.x} y={at.y} width={at.w} height={at.h} rx={16} />
        <Rect at={at} rx={16} className="st-card__edge" draws />
      </g>
      <text className="st-card__name" data-build={name.key} x={name.at.x} y={name.at.y} dominantBaseline="central">
        {name.text}
      </text>
      <path className="dk-rule dk-draw" data-build={rule.key} d={`M${rule.from.x} ${rule.from.y}H${rule.to.x}`} pathLength={1} />
      {fields.map((field) => (
        <g key={field.key} data-build={field.key}>
          <Words at={field.label} text={field.text} anchor="start" />
          <Rect at={field.at} rx={10} className="st-field" />
          <Writing id={field.bar.key} at={field.bar.at} />
        </g>
      ))}
    </>
  );
}

/** A catalog entry drawn without words, as the catalog's cards look: a tag in the catalog's colour, a title and lines of writing. With `peek` only its foot shows, cut by the frame's top edge. */
export function Entry({ id, at, peek = false }: { id: string; at: Box; peek?: boolean }) {
  const { x, y, w, h } = at;
  if (peek) {
    const r = 14;
    return (
      <g className="st-entry" data-build={id}>
        <path className="st-entry__edge" d={`M${x} ${y}V${y + h - r}Q${x} ${y + h} ${x + r} ${y + h}H${x + w - r}Q${x + w} ${y + h} ${x + w} ${y + h - r}V${y}`} />
        <Bar at={{ x: x + 20, y: y + h - 58, w: 200, h: 10 }} />
        <Bar at={{ x: x + 20, y: y + h - 32, w: 120, h: 10 }} />
      </g>
    );
  }
  return (
    <g className="st-entry" data-build={id}>
      <rect className="st-entry__edge" x={x} y={y} width={w} height={h} rx={14} />
      <rect className="st-entry__tag" x={x + 20} y={y + 22} width={92} height={22} rx={11} />
      <Bar at={{ x: x + 20, y: y + 66, w: 190, h: 16 }} className="st-bar st-bar--title" />
      {[0, 1, 2].map((i) => (
        <Bar key={i} at={{ x: x + 20, y: y + 104 + i * 22, w: [220, 196, 208][i], h: 10 }} />
      ))}
      <Bar at={{ x: x + 20, y: y + h - 36, w: 120, h: 10 }} />
    </g>
  );
}

/**
 * 35's project as a catalog entry: an entry drawn as the catalog's cards
 * are, its name where their title bar is, and an empty lower corner for a
 * person's mark. It travels by `x` and `y`; its edge in the catalog's colour
 * (`edge`) shows once it is in.
 */
export function PostedEntry({ id, at, name, edge }: { id: string; at: Box; name: string; edge: string }) {
  const { x, y, w, h } = at;
  return (
    <g className="st-entry" data-build={id}>
      <rect className="st-entry__edge" x={x} y={y} width={w} height={h} rx={14} />
      <rect className="st-entry__tag" x={x + 20} y={y + 22} width={92} height={22} rx={11} />
      <text className="st-entry__name" x={x + 20} y={y + 78} dominantBaseline="central">
        {name}
      </text>
      {[0, 1, 2].map((i) => (
        <Bar key={i} at={{ x: x + 20, y: y + 112 + i * 22, w: [220, 196, 208][i], h: 10 }} />
      ))}
      <Bar at={{ x: x + 20, y: y + h - 36, w: 120, h: 10 }} />
      <rect className="st-entry__lit" data-build={edge} x={x} y={y} width={w} height={h} rx={14} />
    </g>
  );
}

/** A slot not filled yet: a dashed outline in the catalog's colour (`show`, `hide`). */
export function Slot({ id, at }: { id: string; at: Box }) {
  return <rect className="st-slot" data-build={id} x={at.x} y={at.y} width={at.w} height={at.h} rx={12} />;
}

/** GitHub's mark (its octicon, 16 units square), in navy, at `at` (its top left) and `size` square. */
export function GitHubMark({ at, size }: { at: Point; size: number }) {
  return (
    <path
      className="st-github"
      transform={`translate(${at.x} ${at.y}) scale(${size / 16})`}
      d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"
    />
  );
}

/**
 * 36's laptop, seen from the front: a base, and a lid that opens about its
 * hinge (`open`) to show an AI coding tool's window, its code, the box
 * you ask it in, and GitHub's mark in its corner.
 */
export function Laptop({ id, lid, hinge, screen, base }: { id: string; lid: string; hinge: Point; screen: Box; base: Box }) {
  const win = { x: screen.x + 12, y: screen.y + 12, w: screen.w - 24, h: screen.h - 24 };
  const code = [
    [0, 150],
    [24, 120],
    [24, 168],
    [0, 96],
  ];
  return (
    <g data-build={id}>
      <rect className="st-laptop__base" x={base.x} y={base.y} width={base.w} height={base.h} rx={6} />
      <g className="st-lid" data-build={lid} style={{ transformOrigin: `${hinge.x}px ${hinge.y}px` }}>
        <rect className="st-laptop__screen" x={screen.x} y={screen.y} width={screen.w} height={screen.h} rx={12} />
        <rect className="st-laptop__window" x={win.x} y={win.y} width={win.w} height={win.h} rx={6} />
        <path className="st-laptop__bar" d={`M${win.x} ${win.y + 28}H${win.x + win.w}`} />
        {[0, 1, 2].map((i) => (
          <circle key={i} className="st-laptop__dot" cx={win.x + 16 + i * 14} cy={win.y + 14} r={4} />
        ))}
        <GitHubMark at={{ x: win.x + win.w - 30, y: win.y + 5 }} size={18} />
        {code.map(([indent, w], i) => (
          <Bar key={i} at={{ x: win.x + 18 + indent, y: win.y + 44 + i * 20, w, h: 8 }} className="st-bar st-bar--code" />
        ))}
        <rect className="st-laptop__ask" x={win.x + 14} y={win.y + win.h - 40} width={win.w - 28} height={28} rx={8} />
        <path className="st-laptop__caret" d={`M${win.x + 26} ${win.y + win.h - 32}L${win.x + 34} ${win.y + win.h - 26}L${win.x + 26} ${win.y + win.h - 20}`} />
      </g>
    </g>
  );
}

/** 37's receipt: a slip of paper with a torn foot and lines of writing. It slides in (`x`), and takes a plain tick (`tick`, `draw`). */
export function Receipt({ id, at, tick }: { id: string; at: Box; tick: { key: string; d: string } }) {
  const { x, y, w, h } = at;
  const teeth = Array.from({ length: 6 }, (_, i) => `L${x + w - (i * w) / 6 - w / 12} ${y + h - 8}L${x + w - ((i + 1) * w) / 6} ${y + h}`).join("");
  return (
    <g data-build={id}>
      <path className="st-receipt" d={`M${x} ${y}H${x + w}V${y + h}${teeth}Z`} />
      {[0, 1].map((i) => (
        <Bar key={i} at={{ x: x + 18, y: y + 20 + i * 18, w: [84, 60][i], h: 8 }} />
      ))}
      <path className="st-tick dk-draw" data-build={tick.key} d={tick.d} pathLength={1} />
    </g>
  );
}

/**
 * 37's door, in a doorway of a room's left wall, as a plan draws one: a
 * jamb at each end of the doorway, and a leaf hung from the top jamb, shut
 * across the doorway. The leaf swings into the room about its hinge
 * (`open`), and the arc it sweeps draws as it goes (`swing`, `draw`).
 */
export function Door({ id, hinge, length, swing }: { id: string; hinge: Point; length: number; swing: string }) {
  const { x, y } = hinge;
  return (
    <g data-build={id}>
      <rect className="st-door__jamb" x={x - 8} y={y - 18} width={16} height={18} rx={2} />
      <rect className="st-door__jamb" x={x - 8} y={y + length} width={16} height={18} rx={2} />
      <path className="st-door__swing dk-draw" data-build={swing} d={`M${x} ${y + length}A${length} ${length} 0 0 0 ${x + length} ${y}`} pathLength={1} />
      <rect className="st-door__leaf" x={x - 4} y={y} width={8} height={length} rx={3} style={{ transformOrigin: `${x}px ${y}px` }} />
    </g>
  );
}

/** A dashed outline of any shape (`d`, in the box's own pixels), as HTML so it can wipe on: 37's room with its doorway. */
export function DashedShape({ id, at, d }: { id: string; at: Box; d: string }) {
  const pad = 4;
  return (
    <div className="dk-dashed dk-wipe" data-build={id} style={{ left: at.x - pad, top: at.y - pad, width: at.w + 2 * pad, height: at.h + 2 * pad }}>
      <svg width={at.w + 2 * pad} height={at.h + 2 * pad} viewBox={`${-pad} ${-pad} ${at.w + 2 * pad} ${at.h + 2 * pad}`} aria-hidden="true">
        <path d={d} />
      </svg>
    </div>
  );
}

/** A card holding a person or an agent: its outline draws (`draw`) and its ground comes up with it. */
export function Card({ id, at, children }: { id: string; at: Box; children?: ReactNode }) {
  return (
    <g data-build={id}>
      <rect className="st-card st-card--soft" x={at.x} y={at.y} width={at.w} height={at.h} rx={16} />
      <Rect at={at} rx={16} className="st-card__edge" draws />
      {children}
    </g>
  );
}

/** A change: a page with lines of writing on it. */
export function Change({ at }: { at: Box }) {
  return (
    <>
      <rect className="st-page" x={at.x} y={at.y} width={at.w} height={at.h} rx={5} />
      {[0, 1, 2].map((i) => (
        <Bar key={i} at={{ x: at.x + 10, y: at.y + 16 + i * 16, w: [36, 28, 32][i], h: 6 }} />
      ))}
    </>
  );
}

/** An agent's card: the agent, in the process's colour, with the change it holds beside it. */
export function AgentCard({ id, at, agent, children }: { id: string; at: Box; agent: { key: string; at: Point }; children?: ReactNode }) {
  return (
    <Card id={id} at={at}>
      <Agent id={agent.key} at={agent.at} role="builder" hue="process" />
      {children}
    </Card>
  );
}

/** 38's Publish button, locked: a padlock and the word. It is there whole from the start. */
export function LockedButton({ id, at, text, lock }: { id: string; at: Box; text: string; lock: Point }) {
  return (
    <g data-build={id}>
      <rect className="st-button" x={at.x} y={at.y} width={at.w} height={at.h} rx={14} />
      <path className="st-lock__shackle" d={`M${lock.x - 11} ${lock.y - 4}V${lock.y - 13}A11 11 0 0 1 ${lock.x + 11} ${lock.y - 13}V${lock.y - 4}`} />
      <rect className="st-lock__body" x={lock.x - 17} y={lock.y - 5} width={34} height={26} rx={4} />
      <text className="dk-text" x={lock.x + 40} y={at.y + at.h / 2} dominantBaseline="central">
        {text}
      </text>
    </g>
  );
}

/** 41's tool: a window that draws on (`draw`), its name in the bar across its top. What it shows is drawn inside it. */
export function Window({ id, at, name, bar }: { id: string; at: Box; name: string; bar: number }) {
  return (
    <g data-build={id}>
      <rect className="st-card" x={at.x} y={at.y} width={at.w} height={at.h} rx={12} />
      <Rect at={at} rx={12} className="st-card__edge" draws />
      <path className="st-card__edge dk-draw" d={`M${at.x} ${at.y + bar}H${at.x + at.w}`} pathLength={1} />
      <text className="dk-label st-name st-window__name" x={at.x + 18} y={at.y + bar / 2} dominantBaseline="central">
        {name}
      </text>
    </g>
  );
}

/** A map pin, its point at `at`. */
export function Pin({ id, at }: { id: string; at: Point }) {
  const { x, y } = at;
  return (
    <g data-build={id}>
      <path className="st-pin" d={`M${x} ${y}C${x - 4} ${y - 12} ${x - 16} ${y - 18} ${x - 16} ${y - 30}A16 16 0 0 1 ${x + 16} ${y - 30}C${x + 16} ${y - 18} ${x + 4} ${y - 12} ${x} ${y}Z`} />
      <circle className="st-pin__hole" cx={x} cy={y - 30} r={6} />
    </g>
  );
}

/** A data source: a cylinder that draws on (`draw`). */
export function Source({ id, at }: { id: string; at: Box }) {
  const { x, y, w, h } = at;
  const ry = 9;
  return (
    <path
      className="st-line--paper dk-draw"
      data-build={id}
      d={`M${x} ${y + ry}A${w / 2} ${ry} 0 0 1 ${x + w} ${y + ry}A${w / 2} ${ry} 0 0 1 ${x} ${y + ry}V${y + h - ry}A${w / 2} ${ry} 0 0 0 ${x + w} ${y + h - ry}V${y + ry}`}
      pathLength={1}
    />
  );
}

/** The kit's person (figures.tsx), as plain shapes: for a figure that takes a colour, which the kit's person never does (42's engineer, 36a's accounts). */
export function personShape(at: Box) {
  const cx = at.x + at.w / 2;
  const r = at.w * 0.25;
  const head = at.y + r + 2;
  const shoulders = head + r + at.h * 0.1 + at.w * 0.42;
  const bottom = at.y + at.h - 2;
  return (
    <>
      <circle cx={cx} cy={head} r={r} />
      <path d={`M${at.x + 2} ${bottom}V${shoulders}A${at.w / 2 - 2} ${at.w * 0.42} 0 0 1 ${at.x + at.w - 2} ${shoulders}V${bottom}`} />
    </>
  );
}

/** 36a's staff account on GitHub: a round avatar with a person in it. */
export function Account({ id, at }: { id: string; at: Box }) {
  const r = at.w / 2;
  const cx = at.x + r;
  const cy = at.y + r;
  return (
    <g data-build={id}>
      <circle className="st-account" cx={cx} cy={cy} r={r} />
      <g className="st-account__person">{personShape({ x: cx - r * 0.48, y: cy - r * 0.62, w: r * 0.96, h: r * 1.24 })}</g>
    </g>
  );
}

/** Where a history row's mark is centred: in a square at the row's left. */
export const historyMark = (at: Box): Point => ({ x: at.x + at.h / 2, y: at.y + at.h / 2 });

/** A row of 36a's history: its mark at the left (the kit's, given by the scene, centred on `historyMark`), a line saying what it was, and when. */
export function HistoryRow({ id, at, children }: { id: string; at: Box; children: ReactNode }) {
  const cy = at.y + at.h / 2;
  return (
    <g data-build={id}>
      {children}
      <Bar at={{ x: at.x + at.h + 16, y: cy - 5, w: at.w * 0.5, h: 10 }} className="st-bar st-bar--title" />
      <Bar at={{ x: at.x + at.w - 96, y: cy - 4, w: 96, h: 8 }} />
    </g>
  );
}
