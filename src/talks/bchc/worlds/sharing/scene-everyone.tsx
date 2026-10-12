/** Slide 24's picture: your department's outline and the pool of tiles in it, your own with its word over it, on a part the view pulls back on; its name over it. */
"use client";

import { Part } from "@/components/deck/kit";
import { EVERYONE, POOL } from "./layout-everyone";
import { Corner, Group, Label, StoryOf } from "./scene-parts";

const E = EVERYONE;

export function EveryoneMarks() {
  const { outline } = E;
  return (
    <Part id={E.marks}>
      <Part id={E.pool.key} origin={E.pool.origin}>
        <rect className="sh-pool" data-build={outline.key} x={outline.at.x} y={outline.at.y} width={outline.at.w} height={outline.at.h} rx={POOL.rx} />
        <rect className="sh-own" data-build={E.own.key} x={E.own.at.x} y={E.own.at.y} width={POOL.tile} height={POOL.tile} rx={4} />
        <text className="dk-label sh-word sh-yours" data-build={E.yours.key} x={E.yours.at.x + E.yours.at.w / 2} y={E.yours.at.y + E.yours.at.h / 2} textAnchor="middle" dominantBaseline="central">
          {E.yours.text}
        </text>
        {E.tiles.map((tile) => (
          <g key={tile.key} className="sh-tile" data-build={tile.key}>
            <rect className="sh-tile__body" x={tile.at.x} y={tile.at.y} width={POOL.tile} height={POOL.tile} rx={4} />
            <Corner right={tile.at.x + POOL.tile} top={tile.at.y} size={POOL.corner} />
          </g>
        ))}
      </Part>
    </Part>
  );
}

/** Nothing of slide 24's goes over the HTML. */
export function EveryoneOver() {
  return <Part id={E.over}>{null}</Part>;
}

export function EveryoneHtml() {
  return (
    <Group id={E.html}>
      <StoryOf picture="everyone" />
      <Label id={E.label.key} at={E.label.at}>
        {E.label.text}
      </Label>
    </Group>
  );
}
