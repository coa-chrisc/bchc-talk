/** Slide 27's picture: the departments on their oval round the shared middle, each named inside its circle; in its second click the vendor squares outside, the heavy lines out to them that are pulled in to the middle, and the tool the first department makes and its copies (scene-network-ties.tsx). */
"use client";

import { Part, Tile } from "@/components/deck/kit";
import { NAME, NETWORK } from "./layout-network";
import { LINKS, TOOL } from "./layout-network-ties";
import { Copies, Ghosts, Lines, Squares, TieLabels } from "./scene-network-ties";
import { Disc, Group, StoryOf } from "./scene-parts";

const N = NETWORK;
const { tool } = LINKS;
const straight = (a: { x: number; y: number }, b: { x: number; y: number }) => `M${a.x} ${a.y}L${b.x} ${b.y}`;

export function NetworkMarks() {
  const { centre } = N;
  return (
    <Part id={N.marks}>
      <Ghosts />
      {N.departments.map((dept) => (
        <path key={dept.spoke} className="dk-rule dk-draw" data-build={dept.spoke} d={straight(dept.at, centre.at)} pathLength={1} />
      ))}
      <Lines />
      <Squares />
      {N.departments.map((dept) => (
        <Disc key={dept.key} id={dept.key} at={dept.at} r={dept.r} />
      ))}
      {/* Each department's name inside its circle, its rows centred there, rising as the circle draws on. */}
      {N.names.map((name) => (
        <g key={name.key} data-build={name.key}>
          <text className="dk-label sh-word sh-name" textAnchor="middle" dominantBaseline="central">
            {name.rows.map((row, j) => (
              <tspan key={row} x={name.centre.x} y={name.centre.y + (j - (name.rows.length - 1) / 2) * NAME.line}>
                {row}
              </tspan>
            ))}
          </text>
        </g>
      ))}
      <Part id={centre.key} origin={centre.at}>
        <circle className="sh-centre" data-build={centre.ringKey} cx={centre.at.x} cy={centre.at.y} r={centre.r} pathLength={1} transform={`rotate(-90 ${centre.at.x} ${centre.at.y})`} />
      </Part>
      {/* The middle's tiles; the one the first department's tool becomes, a step larger, is carried to its place from inside that department's circle. */}
      {N.tiles.map((tile) =>
        tile.key === tool.tile ? (
          <Part key={tile.key} id={tool.key} origin={tool.origin}>
            <g className="dk-tile" data-build={tile.key} data-hue="catalog">
              <rect className="dk-tile__fill" x={tool.at.x} y={tool.at.y} width={TOOL.side} height={TOOL.side} rx={TOOL.rx} />
            </g>
          </Part>
        ) : (
          <Tile key={tile.key} id={tile.key} at={tile.at} hue="catalog" />
        ),
      )}
      <Copies />
    </Part>
  );
}

/** Nothing of slide 27's goes over the HTML. */
export function NetworkOver() {
  return <Part id={N.over}>{null}</Part>;
}

export function NetworkHtml() {
  return (
    <Group id={N.html}>
      <StoryOf picture="network" />
      <TieLabels />
    </Group>
  );
}
