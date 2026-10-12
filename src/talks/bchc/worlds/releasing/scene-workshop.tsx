/**
 * Slide 33's stage (layout-workshop.ts): the table from above in help's sky,
 * a person and a laptop at each of its six seats, the AI agent beside each
 * laptop, the tool that takes shape on each screen, and the Austin team's
 * helper with their name. SVG for the plane's marks; the "Planned" tag is
 * HTML in WorkshopWords. Static markup: the steps (world.ts) do all the
 * moving.
 */
import { Agent, Block, Part, Person, Tag } from "@/components/deck/kit";
import { Figure } from "./drawings";
import { HELPER, PLANNED, SEATS, TABLE, type ToolKind } from "./layout-workshop";

/** The small tool on a screen `at`: lines draw on (--d) and fills come up (--k), so it takes shape. */
function ScreenTool({ kind, at }: { kind: ToolKind; at: { x: number; y: number; w: number; h: number } }) {
  const x = at.x + 16;
  const y = at.y + 14;
  if (kind === "form")
    return (
      <>
        {[0, 1].map((n) => (
          <g key={n}>
            <rect className="rel-tool-fill rel-tool-fill--soft" x={x} y={y + 4 + n * 24} width={24} height={6} rx={3} />
            <rect className="rel-tool-line dk-draw" x={x + 32} y={y + n * 24} width={86} height={14} rx={3} pathLength={1} />
          </g>
        ))}
        <rect className="rel-tool-fill" x={x + 74} y={y + 50} width={44} height={14} rx={7} />
      </>
    );
  if (kind === "map")
    return (
      <>
        <path
          className="rel-tool-line dk-draw"
          d={`M${x + 8} ${y + 10}L${x + 52} ${y + 2}L${x + 96} ${y + 8}L${x + 116} ${y + 30}L${x + 104} ${y + 60}L${x + 60} ${y + 64}L${x + 18} ${y + 54}L${x + 4} ${y + 30}Z`}
          pathLength={1}
        />
        <path className="rel-tool-line rel-tool-line--soft dk-draw" d={`M${x + 52} ${y + 2}L${x + 60} ${y + 64}M${x + 4} ${y + 30}L${x + 116} ${y + 30}`} pathLength={1} />
        {[
          [34, 18],
          [82, 44],
          [70, 16],
        ].map(([dx, dy]) => (
          <circle key={dx} className="rel-tool-fill" cx={x + dx} cy={y + dy} r={5} />
        ))}
      </>
    );
  const base = y + 62;
  return (
    <>
      <path className="rel-tool-line dk-draw" d={`M${x} ${y}V${base}H${x + 118}`} pathLength={1} />
      {[22, 34, 48, 60].map((h, n) => (
        <rect key={n} className="rel-tool-fill rel-tool-bar" x={x + 14 + n * 26} y={base - h} width={16} height={h} rx={2} />
      ))}
    </>
  );
}

export function WorkshopMarks() {
  return (
    <>
      {/* Carried by its top left corner and scaled about it: slide 33a shrinks it onto Austin's table. */}
      <g data-hue="share-help">
        <Part id={TABLE.key} origin={TABLE.at}>
          <rect className="rel-table" x={TABLE.at.x} y={TABLE.at.y} width={TABLE.at.w} height={TABLE.at.h} rx={TABLE.rx} />
          <rect className="rel-hue-line rel-table-edge dk-draw" x={TABLE.at.x} y={TABLE.at.y} width={TABLE.at.w} height={TABLE.at.h} rx={TABLE.rx} pathLength={1} />
        </Part>
      </g>
      {SEATS.map((seat) => (
        <g key={seat.key}>
          <Person id={seat.key} at={seat.person} />
          <g data-build={seat.laptopKey}>
            <rect className="rel-screen" x={seat.screen.x} y={seat.screen.y} width={seat.screen.w} height={seat.screen.h} rx={6} />
            <rect className="bchc-line dk-draw" x={seat.screen.x} y={seat.screen.y} width={seat.screen.w} height={seat.screen.h} rx={6} pathLength={1} />
            <path
              className="bchc-line dk-draw"
              d={`M${seat.base.x + 8} ${seat.base.y}H${seat.base.x + seat.base.w - 8}L${seat.base.x + seat.base.w} ${seat.base.y + seat.base.h}H${seat.base.x}Z`}
              pathLength={1}
            />
          </g>
          <g data-build={seat.toolKey}>
            <ScreenTool kind={seat.tool} at={seat.screen} />
          </g>
          <Agent id={seat.agentKey} at={seat.agent.at} r={seat.agent.r} role="builder" hue="process" />
        </g>
      ))}
      <g data-hue="share-help">
        <Part id={HELPER.key} origin={HELPER.start}>
          <Figure at={HELPER.person} className="rel-hue-line rel-helper" />
        </Part>
      </g>
      <Part id={HELPER.nameKey} origin={HELPER.name}>
        <text className="rel-words rel-words--label" x={HELPER.name.x} y={HELPER.name.y} textAnchor="middle" dominantBaseline="central">
          {HELPER.text}
        </text>
      </Part>
    </>
  );
}

export function WorkshopWords() {
  return (
    <Block id={PLANNED.key} at={PLANNED.at} className="rel-planned">
      <Tag w={PLANNED.at.w} h={PLANNED.at.h}>
        {PLANNED.text}
      </Tag>
    </Block>
  );
}
