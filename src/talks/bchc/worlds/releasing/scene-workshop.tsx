/**
 * Slide 33's stage (layout-workshop.ts): the table from above in help's sky,
 * a person and a laptop at each of its six seats, the guide booklet and the
 * AI agent beside each laptop, the tool that takes shape on each screen, and
 * the chat window in the top right corner with Austin's name, a tail down to
 * the table, and a short line typing in it. SVG for the plane's marks. Static markup: the steps
 * (world.ts) do all the moving.
 */
import { Agent, Part, Person, type Box } from "@/components/deck/kit";
import { BOOKLET, CHAT, SEATS, TABLE, type ToolKind } from "./layout-workshop";

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
          {/* Carried by --y as it lands (Part). */}
          <g data-hue="share-help">
            <Part id={seat.guideKey} origin={seat.guide.at}>
              <Booklet at={seat.guide.at} lines={seat.guide.lines} />
            </Part>
          </g>
          <g data-build={seat.toolKey}>
            <ScreenTool kind={seat.tool} at={seat.screen} />
          </g>
          <Agent id={seat.agentKey} at={seat.agent.at} r={seat.agent.r} role="builder" hue="process" />
        </g>
      ))}
      <ChatMarks />
    </>
  );
}

/** A guide booklet: a white cover with a spine in help's sky, its edge and spine drawing on (--d), and its name, or two lines of writing where the name would be, coming up on the cover as they draw. */
function Booklet({ at, lines }: { at: Box; lines: readonly string[] }) {
  const cx = at.x + BOOKLET.spine + (at.w - BOOKLET.spine) / 2;
  const cy = at.y + at.h / 2;
  return (
    <>
      <rect className="rel-guide" x={at.x} y={at.y} width={at.w} height={at.h} rx={6} />
      <path className="rel-guide rel-guide--spine" d={`M${at.x + BOOKLET.spine} ${at.y}V${at.y + at.h}H${at.x + 6}Q${at.x} ${at.y + at.h} ${at.x} ${at.y + at.h - 6}V${at.y + 6}Q${at.x} ${at.y} ${at.x + 6} ${at.y}Z`} />
      <rect className="rel-hue-line dk-draw" x={at.x} y={at.y} width={at.w} height={at.h} rx={6} pathLength={1} />
      <path className="rel-hue-line dk-draw" d={`M${at.x + BOOKLET.spine} ${at.y}V${at.y + at.h}`} pathLength={1} />
      {lines.length === 0 &&
        BOOKLET.writing.map((w, n) => (
          <rect key={n} className="rel-ink-fill rel-guide__writing" x={cx - w / 2} y={cy + (n - 0.5) * BOOKLET.pitch - 5} width={w} height={10} rx={5} />
        ))}
      {lines.map((line, n) => (
        <text
          key={line}
          className="rel-words rel-words--label rel-words--name rel-words--drawn"
          x={cx}
          y={cy + (n - (lines.length - 1) / 2) * BOOKLET.pitch}
          textAnchor="middle"
          dominantBaseline="central"
        >
          {line}
        </text>
      ))}
    </>
  );
}

/** The chat window: its frame, bar, tail and face draw on with the name (--d); its bubble comes up whole; each run of the line types out left to right (--k). */
function ChatMarks() {
  const { at, rx, bar, face, name, bubble, lines, tail } = CHAT;
  return (
    <g data-hue="share-help">
      <g data-build={CHAT.key}>
        <rect className="rel-screen" x={at.x} y={at.y} width={at.w} height={at.h} rx={rx} />
        <path
          className="rel-chat-bar"
          d={`M${at.x} ${at.y + bar}V${at.y + rx}Q${at.x} ${at.y} ${at.x + rx} ${at.y}H${at.x + at.w - rx}Q${at.x + at.w} ${at.y} ${at.x + at.w} ${at.y + rx}V${at.y + bar}Z`}
        />
        <rect className="bchc-line dk-draw" x={at.x} y={at.y} width={at.w} height={at.h} rx={rx} pathLength={1} />
        <path className="bchc-line dk-draw" d={`M${at.x} ${at.y + bar}H${at.x + at.w}`} pathLength={1} />
        {/* The tail opens the window's foot where it joins: white over that stretch of the frame, then its two sides. */}
        <path className="rel-screen" d={`M${tail.from.x + 1.5} ${tail.from.y - 3}H${tail.to.x - 1.5}V${tail.to.y + 2}L${tail.tip.x} ${tail.tip.y}Z`} />
        <path className="bchc-line dk-draw rel-chat-tail" d={`M${tail.from.x} ${tail.from.y}L${tail.tip.x} ${tail.tip.y}L${tail.to.x} ${tail.to.y}`} pathLength={1} />
        <circle className="rel-hue-line dk-draw" cx={face.x} cy={face.y} r={face.r} pathLength={1} />
        <text className="rel-words rel-words--label rel-words--name rel-words--drawn" x={name.x} y={name.y} dominantBaseline="central">
          {name.text}
        </text>
      </g>
      <g data-build={CHAT.bubbleKey}>
        <rect className="rel-chat-bubble" x={bubble.x} y={bubble.y} width={bubble.w} height={bubble.h} rx={14} />
      </g>
      {lines.map((line) => (
        <g key={line.key} data-build={line.key}>
          <rect className="rel-ink-fill rel-chat-typing" x={line.x} y={line.y} width={line.w} height={10} rx={5} />
        </g>
      ))}
    </g>
  );
}
