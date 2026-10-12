/**
 * The board, in the fleet film's style: rows of work, each a lane of cells
 * that fill as work is done, and a dot that works the cell in hand. The frame
 * draws on with `--d`. A cell's fill is `--k`; its verdict is `--pass` or `--fail`, and each verdict has a
 * shape as well as a tint: a tick on a filled cell, or a cross in a dashed,
 * emptied one. Draw from a layout (board-layout.ts) and move with the verbs.
 *
 * A cell an agent holds names the holder's role (`holder`, as `data-role`;
 * a Board or Row takes them by cell id in `holders`) and takes its colour
 * once the agent takes it (`take`, `--hold`): a tint over the whole cell,
 * and the work filling over it. Without a holder it is the paper cell.
 */
import type { BoardLayout, CellLayout, RowLayout } from "./board-layout";
import type { AgentHue } from "./palette";

/** The role of the agent holding each cell, by the cell's id. */
export type Holders = Readonly<Record<string, AgentHue>>;

export function Cell({ cell, holder }: { cell: CellLayout; holder?: AgentHue }) {
  const cx = cell.x + cell.w / 2;
  const cy = cell.y + cell.h / 2;
  const shape = { x: cell.x, y: cell.y, width: cell.w, height: cell.h, rx: 6 };
  return (
    <g className="dk-cell" data-build={cell.key} data-role={holder}>
      <rect className="dk-cell__well" {...shape} />
      <rect className="dk-cell__fill" {...shape} />
      {holder && <rect className="dk-cell__hold" {...shape} />}
      {holder && <rect className="dk-cell__work" {...shape} />}
      <rect className="dk-cell__tint" {...shape} />
      <rect className="dk-cell__dash" {...shape} />
      <path className="dk-cell__tick" d={`M${cx - 11} ${cy + 1}l8 8 15-17`} />
      <path className="dk-cell__cross" d={`M${cx - 10} ${cy - 10}l20 20m0-20l-20 20`} />
    </g>
  );
}

export function Row({ row, holders }: { row: RowLayout; holders?: Holders }) {
  return (
    <g className="dk-row" data-build={row.key}>
      <text className="dk-label" x={row.labelAt.x} y={row.labelAt.y} dominantBaseline="central">
        {row.label}
      </text>
      {row.cells.map((cell) => (
        <Cell key={cell.key} cell={cell} holder={holders?.[cell.key]} />
      ))}
      <circle className="dk-dot" data-build={row.dotKey} cx={row.dotAt.x} cy={row.dotAt.y} r={10} />
    </g>
  );
}

export function Board({ layout, holders }: { layout: BoardLayout; holders?: Holders }) {
  const { box } = layout;
  return (
    <g className="dk-board" data-build={layout.key}>
      <rect className="dk-board__frame dk-draw" x={box.x} y={box.y} width={box.w} height={box.h} rx={14} pathLength={1} />
      {layout.title && (
        <text className="dk-label dk-board__title" x={layout.titleAt.x} y={layout.titleAt.y}>
          {layout.title}
        </text>
      )}
      {layout.rows.map((row) => (
        <Row key={row.key} row={row} holders={holders} />
      ))}
    </g>
  );
}
