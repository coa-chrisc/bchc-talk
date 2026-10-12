/**
 * The three tools of slide 15, drawn twice: grey, as plain sketches, and in
 * the design system's colours, type and buttons, as the strip's band leaves
 * them. Shapes only: bars stand for words.
 */
"use client";

import { Fragment } from "react";
import type { Box } from "@/components/deck/kit";

type Tone = "grey" | "brand";
/** Each part's class in each tone. */
const TONE = {
  header: { grey: "bw-raised", brand: "bw-catalog" },
  text: { grey: "bw-rule-fill", brand: "bw-paper-fill" },
  field: { grey: "bw-rule", brand: "bw-ink" },
  button: { grey: "bw-rule-fill", brand: "bw-process" },
  barA: { grey: "bw-rule-fill", brand: "bw-process" },
  barB: { grey: "bw-raised", brand: "bw-catalog" },
  area: { grey: "bw-raised", brand: "bw-raised" },
  road: { grey: "bw-road bw-road--grey", brand: "bw-road" },
  pin: { grey: "bw-soft-fill", brand: "bw-process" },
} as const;

function Header({ at, tone }: { at: Box; tone: Tone }) {
  return (
    <>
      <path
        className={TONE.header[tone]}
        d={`M${at.x} ${at.y + 44}V${at.y + 12}Q${at.x} ${at.y} ${at.x + 12} ${at.y}H${at.x + at.w - 12}Q${at.x + at.w} ${at.y} ${at.x + at.w} ${at.y + 12}V${at.y + 44}Z`}
      />
      <rect className="bw-white" x={at.x + 24} y={at.y + 16} width={140} height={12} rx={6} />
    </>
  );
}

function Form({ at, tone }: { at: Box; tone: Tone }) {
  return (
    <>
      {[0, 1, 2].map((n) => (
        <Fragment key={n}>
          <rect className={TONE.text[tone]} x={at.x + 32} y={at.y + 64 + n * 54} width={[90, 120, 70][n]} height={10} rx={5} />
          <rect className={TONE.field[tone]} x={at.x + 32} y={at.y + 80 + n * 54} width={300} height={30} rx={6} />
        </Fragment>
      ))}
      <rect className={TONE.area[tone]} x={at.x + 372} y={at.y + 64} width={136} height={112} rx={8} />
      <rect className={TONE.button[tone]} x={at.x + 372} y={at.y + 196} width={136} height={36} rx={18} />
    </>
  );
}

function Dashboard({ at, tone }: { at: Box; tone: Tone }) {
  const bars = [0.45, 0.7, 0.55, 0.9, 0.62, 0.8, 0.5, 0.74];
  return (
    <>
      {[0, 1, 2].map((n) => (
        <Fragment key={n}>
          <rect className={TONE.field[tone]} x={at.x + 24 + n * 168} y={at.y + 62} width={152} height={64} rx={8} />
          <rect className={TONE.text[tone]} x={at.x + 40 + n * 168} y={at.y + 76} width={[56, 72, 48][n]} height={18} rx={4} />
          <rect className={TONE.text[tone]} x={at.x + 40 + n * 168} y={at.y + 104} width={84} height={8} rx={4} />
        </Fragment>
      ))}
      {bars.map((k, n) => (
        <rect key={n} className={n % 2 ? TONE.barB[tone] : TONE.barA[tone]} x={at.x + 40 + n * 60} y={at.y + 240 - 96 * k} width={40} height={96 * k} rx={4} />
      ))}
    </>
  );
}

function MapTool({ at, tone }: { at: Box; tone: Tone }) {
  const area = { x: at.x + 24, y: at.y + 104, w: at.w - 48, h: at.h - 124 };
  const pins = [
    [0.22, 0.42],
    [0.55, 0.68],
    [0.78, 0.3],
  ];
  return (
    <>
      <rect className={TONE.field[tone]} x={at.x + 24} y={at.y + 60} width={320} height={30} rx={6} />
      <rect className={TONE.button[tone]} x={at.x + 356} y={at.y + 60} width={104} height={30} rx={15} />
      <rect className={TONE.area[tone]} x={area.x} y={area.y} width={area.w} height={area.h} rx={8} />
      <path
        className={TONE.road[tone]}
        d={`M${area.x} ${area.y + area.h * 0.55}C${area.x + area.w * 0.3} ${area.y + area.h * 0.3} ${area.x + area.w * 0.6} ${area.y + area.h * 0.8} ${area.x + area.w} ${area.y + area.h * 0.45}M${area.x + area.w * 0.4} ${area.y}L${area.x + area.w * 0.5} ${area.y + area.h}`}
      />
      {pins.map(([kx, ky], n) => (
        <circle key={n} className={TONE.pin[tone]} cx={area.x + area.w * kx} cy={area.y + area.h * ky} r={10} />
      ))}
    </>
  );
}

const BODY = { form: Form, dashboard: Dashboard, map: MapTool } as const;

/** One tool in one tone: its frame, its header and its body. */
export function ToolArt({ kind, at, tone }: { kind: keyof typeof BODY; at: Box; tone: Tone }) {
  const Body = BODY[kind];
  return (
    <>
      <rect className="bw-frame" x={at.x} y={at.y} width={at.w} height={at.h} rx={12} />
      <Header at={at} tone={tone} />
      <Body at={at} tone={tone} />
    </>
  );
}
