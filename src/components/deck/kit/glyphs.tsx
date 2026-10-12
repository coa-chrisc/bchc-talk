/**
 * The talk's glyphs: an AI agent, a module tile, a health department and a
 * voice waveform. All are SVG for a plane's `marks`, each with an `id` a
 * move can name, and all are drawn in paper and rule unless given a role's
 * colour (palette.ts): none of them is ever coral, which is a person's
 * approval, or green, which is a check that passed. Each arrives with `show` or `rise` and travels with `x` and `y`;
 * what draws on (`draw`) or fills (`fill`) is said part by part. Until a
 * move says otherwise each is there whole, so a glyph a step only shows is
 * complete.
 */
import { AGENT_R, LABEL_GAP, TILE, agentArcs, agentBody, tileBox, type AgentRole, type TileSize, type WaveformLayout } from "./glyph-geometry";
import type { AgentHue, Hue } from "./palette";
import type { Point } from "./tokens";

/**
 * An AI agent: the fleet film's harness ring round a body whose shape is its
 * role. The ring's three arcs are a track in rule that draws on (`draw`),
 * and a paper arc over each that fills along it (`fill`, `--k`). `label`
 * sets the role's name under it, the only words an agent takes. Keep a
 * labelled agent at a radius of 13 or more. `hue` colours the ring's fill
 * by role (`data-role`; palette.ts `ROLE_HUE` gives Part 3's), and the body
 * stays paper; `ink` keeps a tiny agent's ring paper whatever its hue.
 */
export function Agent({ id, at, role, r = AGENT_R, label = false, hue, ink = false }: { id: string; at: Point; role: AgentRole; r?: number; label?: boolean; hue?: AgentHue; ink?: boolean }) {
  const arcs = agentArcs(at, r);
  const body = agentBody(role, at, r);
  return (
    <g className="dk-agent" data-build={id} data-role={ink ? undefined : hue}>
      {arcs.map((arc, i) => (
        <path key={`t${i}`} className="dk-agent__track" d={arc.d} pathLength={1} />
      ))}
      {arcs.map((arc, i) => (
        <path key={`f${i}`} className="dk-agent__fill" d={arc.d} pathLength={1} />
      ))}
      {body.shape === "circle" && <circle className="dk-agent__body" cx={body.cx} cy={body.cy} r={body.r} />}
      {body.shape === "ring" && <circle className="dk-agent__body dk-agent__body--hollow" cx={body.cx} cy={body.cy} r={body.r} />}
      {body.shape === "rect" && <rect className="dk-agent__body" x={body.x} y={body.y} width={body.side} height={body.side} />}
      {body.shape === "path" && <path className="dk-agent__body" d={body.d} />}
      {label && (
        <text className="dk-label dk-agent__label" x={at.x} y={at.y + r + LABEL_GAP} textAnchor="middle" dominantBaseline="central">
          {role}
        </text>
      )}
    </g>
  );
}

/**
 * A module: a paper tile whose top left corner is at `at`, small on a
 * library wall or large as the subject. It scales in from its centre as it
 * fills (`fill`); a large one has a paper edge that draws on (`draw`). A new
 * module, not built yet, is a `Dashed` in `tileBox(at, size)`. With a `hue`
 * (`data-hue`) a small tile is solid in that colour, and a large one has
 * its edge in it and a fill at the idle tint.
 */
export function Tile({ id, at, size = "small", hue }: { id: string; at: Point; size?: TileSize; hue?: Hue }) {
  const { x, y, w, h } = tileBox(at, size);
  const { rx } = TILE[size];
  return (
    <g className="dk-tile" data-build={id} data-hue={hue}>
      {size === "large" && <rect className="dk-tile__edge" x={x} y={y} width={w} height={h} rx={rx} pathLength={1} />}
      <rect className="dk-tile__fill" x={x} y={y} width={w} height={h} rx={rx} />
    </g>
  );
}

/** A health department: a ring centred on `at` that draws on (`draw`), with its name under it. Yours is drawn in paper. With a `hue` (`data-hue`) the ring is in that colour and holds the idle tint as it draws. */
export function Dept({ id, at, r = 36, label, yours = false, hue }: { id: string; at: Point; r?: number; label?: string; yours?: boolean; hue?: Hue }) {
  return (
    <g className={yours ? "dk-dept dk-dept--yours" : "dk-dept"} data-build={id} data-hue={hue}>
      <circle className="dk-dept__ring" cx={at.x} cy={at.y} r={r} pathLength={1} transform={`rotate(-90 ${at.x} ${at.y})`} />
      {label && (
        <text className="dk-label dk-dept__label" x={at.x} y={at.y + r + LABEL_GAP} textAnchor="middle" dominantBaseline="central">
          {label}
        </text>
      )}
    </g>
  );
}

/**
 * A voice waveform (glyph-geometry.ts `waveform`): the whole is its id, and
 * each bar has its own (`id.0` to `id.23`) to `rise`, `fill` from its middle,
 * or travel. A bar's id is on a group round its rect: the rect's fill is a
 * CSS transform, and a move's `x` and `y` must not be overridden by it.
 */
export function Waveform({ layout }: { layout: WaveformLayout }) {
  return (
    <g className="dk-wave" data-build={layout.key}>
      {layout.bars.map((bar) => (
        <g key={bar.key} data-build={bar.key}>
          <rect className="dk-wave__bar" x={bar.x} y={bar.y} width={bar.w} height={bar.h} rx={bar.w / 2} />
        </g>
      ))}
    </g>
  );
}
