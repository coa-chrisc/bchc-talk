/**
 * Where the glyphs' pieces sit (glyphs.tsx): the agent's harness ring and
 * body, a module tile's sizes, and the voice waveform's bars. Plain numbers
 * from plain numbers, so the same props always draw the same picture.
 */
import type { Box, Point } from "./tokens";

/** The agent roles, by the shape of their body. A role's name is the only label an agent takes. */
export const AGENT_ROLES = ["planner", "builder", "tester", "reviewer", "fixer"] as const;
export type AgentRole = (typeof AGENT_ROLES)[number];

/** An agent's ring radius at full size; its body's sizes below are given at this radius and scale with it. */
export const AGENT_R = 22;
const GAP = 0.24;
const TAU = Math.PI * 2;

const n = (value: number) => Math.round(value * 100) / 100;

/**
 * The harness ring's three arcs, as the fleet film draws them
 * (control-room/fleet-agents.ts `drawAgent`): from the top, clockwise, each
 * a third of the circle less a 0.24 rad gap, centred in its third.
 */
export function agentArcs(at: Point, r = AGENT_R) {
  return [0, 1, 2].map((i) => {
    const start = -Math.PI / 2 + (i * TAU) / 3 + GAP / 2;
    const end = start + TAU / 3 - GAP;
    const d = `M${n(at.x + r * Math.cos(start))} ${n(at.y + r * Math.sin(start))}A${r} ${r} 0 0 1 ${n(at.x + r * Math.cos(end))} ${n(at.y + r * Math.sin(end))}`;
    return { start, end, d };
  });
}

/** A role's body, centred on the agent: builder a filled circle r 8, planner a hollow circle r 7, tester a square of 14, reviewer a diamond 20 tall, fixer a triangle 20 wide. */
export function agentBody(role: AgentRole, at: Point, r = AGENT_R) {
  const s = r / AGENT_R;
  const { x, y } = at;
  switch (role) {
    case "builder":
      return { shape: "circle", cx: x, cy: y, r: n(8 * s) } as const;
    case "planner":
      return { shape: "ring", cx: x, cy: y, r: n(7 * s) } as const;
    case "tester":
      return { shape: "rect", x: n(x - 7 * s), y: n(y - 7 * s), side: n(14 * s) } as const;
    case "reviewer": {
      const h = 10 * s;
      return { shape: "path", d: `M${n(x)} ${n(y - h)}L${n(x + h)} ${n(y)}L${n(x)} ${n(y + h)}L${n(x - h)} ${n(y)}Z` } as const;
    }
    case "fixer": {
      // The film's triangle: apex up, its base 0.95 of its reach either side and 0.7 of it below the centre.
      const half = 10 * s;
      const reach = half / 0.95;
      return { shape: "path", d: `M${n(x)} ${n(y - reach)}L${n(x + half)} ${n(y + 0.7 * reach)}L${n(x - half)} ${n(y + 0.7 * reach)}Z` } as const;
    }
  }
}

/** How far under an agent's or a department's centre its label sits: the ring's radius and this. */
export const LABEL_GAP = 28;

/** A module tile: small on a library wall, large as the subject of a picture. */
export const TILE = { small: { side: 18, rx: 3, pitch: 24 }, large: { side: 64, rx: 8 } } as const;
export type TileSize = keyof typeof TILE;

/** The box a tile fills from its top left corner: the box a `Dashed` new module takes at the same size. */
export const tileBox = (at: Point, size: TileSize = "small"): Box => ({ x: at.x, y: at.y, w: TILE[size].side, h: TILE[size].side });

/** A voice waveform: 24 bars, 6 wide at a pitch of 14, their heights fixed, centred in a box 80 high. */
export const WAVE = {
  bars: 24,
  w: 6,
  pitch: 14,
  h: 80,
  heights: [18, 30, 44, 62, 48, 28, 36, 58, 76, 64, 40, 24, 32, 52, 70, 80, 60, 38, 26, 46, 66, 50, 30, 20],
} as const;

export type WaveformLayout = {
  key: string;
  /** Each bar's id, `id.0` to `id.23`, left to right. */
  keys: string[];
  box: Box;
  bars: { key: string; x: number; y: number; w: number; h: number; cx: number; cy: number }[];
};

/** A waveform whose box's top left corner is at (x, y). */
export function waveform({ id, x, y }: { id: string; x: number; y: number }): WaveformLayout {
  const cy = y + WAVE.h / 2;
  const bars = WAVE.heights.map((h, i) => {
    const left = x + i * WAVE.pitch + (WAVE.pitch - WAVE.w) / 2;
    return { key: `${id}.${i}`, x: left, y: cy - h / 2, w: WAVE.w, h, cx: left + WAVE.w / 2, cy };
  });
  return { key: id, keys: bars.map((bar) => bar.key), box: { x, y, w: WAVE.bars * WAVE.pitch, h: WAVE.h }, bars };
}
