/**
 * Slide 30's stage (layout-pack.ts): the package and its two flaps, its four
 * contents, the packing list on its front, the navy line out to the three
 * coding tools, and a copy for each tool. All SVG for the plane's marks. The
 * line, the tools, the copies and the contents are drawn before the package,
 * so its opaque front hides the copies and contents while they are inside
 * it, and each copy rides over the line and into its window over its frame.
 * Static markup: the steps (world.ts) do all the moving. The agent pack is
 * the process's colour (`share-pack`).
 */
import { Part } from "@/components/deck/kit";
import { Figure, Package, Writing } from "./drawings";
import { CONTENTS, FLAPS, LINK, PACK, TOOLS } from "./layout-pack";

/** Each content's drawing, centred on (x, y): a page of skills, a planning board, review's magnifier, a person for the approval steps. */
function ContentArt({ i, x, y }: { i: number; x: number; y: number }) {
  if (i === 0)
    return (
      <>
        <rect className="bchc-line" x={x - 18} y={y - 22} width={36} height={44} rx={3} />
        {[12, 20, 28].map((dy, n) => (
          <Writing key={n} x={x - 10} y={y - 22 + dy} w={n === 2 ? 12 : 20} h={4} />
        ))}
      </>
    );
  if (i === 1)
    return (
      <>
        <rect className="bchc-line" x={x - 30} y={y - 20} width={60} height={40} rx={4} />
        <path className="bchc-line" d={`M${x - 30} ${y}H${x + 30}M${x - 10} ${y - 20}V${y + 20}M${x + 10} ${y - 20}V${y + 20}`} />
      </>
    );
  if (i === 2)
    return (
      <>
        <circle className="bchc-line" cx={x - 5} cy={y - 5} r={14} />
        <path className="bchc-line rel-line--heavy" d={`M${x + 5} ${y + 5}L${x + 18} ${y + 18}`} />
      </>
    );
  return <Figure at={{ x: x - 14, y: y - 21, w: 28, h: 42 }} />;
}

export function PackMarks() {
  return (
    <>
      <g data-build={LINK.key}>
        {LINK.paths.map((d) => (
          <path key={d} className="bchc-line dk-draw" d={d} pathLength={1} />
        ))}
      </g>
      {TOOLS.map((tool) => (
        <g key={tool.key} data-build={tool.key}>
          <rect className="rel-frame dk-draw" x={tool.at.x} y={tool.at.y} width={tool.at.w} height={tool.at.h} rx={12} pathLength={1} />
          <path className="rel-frame dk-draw" d={`M${tool.at.x} ${tool.bar}H${tool.at.x + tool.at.w}`} pathLength={1} />
          <text className="rel-words rel-words--label rel-words--drawn" x={tool.name.at.x} y={tool.name.at.y} textAnchor="middle" dominantBaseline="central">
            {tool.name.text}
          </text>
        </g>
      ))}
      {TOOLS.map((tool) => (
        <g key={tool.copy.key} data-hue="share-pack">
          <Part id={tool.copy.key} origin={tool.copy.centre}>
            <Package at={tool.copy.at} rx={6} />
          </Part>
        </g>
      ))}
      {CONTENTS.map((item, i) => (
        <g key={item.key} data-hue="share-pack">
          <Part id={item.key} origin={item.centre}>
            <rect className="rel-card" x={item.at.x} y={item.at.y} width={item.at.w} height={item.at.h} rx={8} />
            <ContentArt i={i} x={item.art.x} y={item.art.y} />
            <text className="rel-words rel-words--label" x={item.label.x} y={item.label.y} textAnchor="middle" dominantBaseline="central">
              {item.text}
            </text>
          </Part>
        </g>
      ))}
      <g data-hue="share-pack">
        <g data-build={PACK.key}>
          <Package at={PACK.at} rx={PACK.rx} draw lid={false} />
        </g>
        <text className="rel-words rel-words--name" data-build={PACK.name.key} x={PACK.name.at.x} y={PACK.name.at.y} textAnchor="middle" dominantBaseline="central">
          {PACK.name.text}
        </text>
        {CONTENTS.map((item) => (
          <text key={item.listed.key} className="rel-words rel-words--label" data-build={item.listed.key} x={item.listed.at.x} y={item.listed.at.y} dominantBaseline="central">
            {item.text}
          </text>
        ))}
        {FLAPS.map((flap) => (
          <g key={flap.key} className="rel-flap" data-build={flap.key} style={{ transformOrigin: `${flap.hinge.x}px ${flap.hinge.y}px` }}>
            <rect className="rel-flap__body" x={flap.at.x} y={flap.at.y} width={flap.at.w} height={flap.at.h} rx={3} />
          </g>
        ))}
      </g>
    </>
  );
}
