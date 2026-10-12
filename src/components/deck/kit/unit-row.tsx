/**
 * Unit marks (unit-grid.ts): one small mark for each thing counted, so a
 * number is also a picture of that many things. The marks light in order
 * (`light` on the layout's key, in step with a Counter). The place after the
 * last mark is a Dashed of its own, for the scene to set and wipe on.
 */
"use client";

import { driven } from "./driven";
import { place } from "./geometry";
import type { UnitGridLayout } from "./unit-grid";

const lit = driven<HTMLDivElement>("lit", 0, (group, value) => {
  let n = 0;
  for (const mark of group.firstElementChild?.children ?? []) mark.toggleAttribute("data-on", n++ < Math.round(value));
});

export function UnitRow({ layout, rx = 4 }: { layout: UnitGridLayout; rx?: number }) {
  const { box } = layout;
  return (
    <div ref={lit} className="dk-units" data-build={layout.key} style={place(box)}>
      <svg width={box.w} height={box.h} viewBox={`0 0 ${box.w} ${box.h}`} aria-hidden="true">
        {layout.marks.map((mark, i) => (
          <rect key={i} className="dk-unit" x={mark.x - box.x} y={mark.y - box.y} width={mark.w} height={mark.h} rx={rx} />
        ))}
      </svg>
    </div>
  );
}
