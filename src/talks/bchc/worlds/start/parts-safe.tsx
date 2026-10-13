/**
 * 38s's drawings, for the things neither the kit nor the start world's other
 * parts have: a fence seen from above (a rail that draws on and its posts), a
 * gate in it that swings out and shuts, a data table with its name over it,
 * and a record's time stamp. Each is SVG for the plane's marks, moved with
 * the house moves only: `draw` (`--d`), `open` (`--k`), `show` and `rise`,
 * and `x`/`y` for travel. Colours are navy, soft and rule (start.css); the
 * approver's mark, drawn by the scene, is the kit's orange "a person
 * approves" mark.
 */
import type { Box, Point } from "@/components/deck/kit";
import { Words } from "./parts-figures";

/** The fence: its rail draws on (`draw`), and its posts, small navy squares along it, come up together (`show`). */
export function Fence({ id, d, posts }: { id: string; d: string; posts: { key: string; at: Box[] } }) {
  return (
    <>
      <path className="st-fence dk-draw" data-build={id} d={d} pathLength={1} />
      <g className="st-fence__posts" data-build={posts.key}>
        {posts.at.map((post) => (
          <rect key={`${post.x} ${post.y}`} x={post.x} y={post.y} width={post.w} height={post.h} rx={2} />
        ))}
      </g>
    </>
  );
}

/**
 * The fence's gate, as a plan draws one: a jamb at each end of the opening,
 * and a leaf hung from the top one, shut across it. The leaf swings out of
 * the fence about its hinge as `--k` goes to 1 (`open`), and shuts as it
 * goes back to 0.
 */
export function FenceGate({ id, hinge, length }: { id: string; hinge: Point; length: number }) {
  const { x, y } = hinge;
  return (
    <g data-build={id}>
      <rect className="st-gate__jamb" x={x - 8} y={y - 18} width={16} height={18} rx={2} />
      <rect className="st-gate__jamb" x={x - 8} y={y + length} width={16} height={18} rx={2} />
      <rect className="st-gate__leaf" x={x - 4} y={y} width={8} height={length} rx={3} style={{ transformOrigin: `${x}px ${y}px` }} />
    </g>
  );
}

/** A data table: a white sheet with a header row and a grid, its name over it at its right end. Table and name travel as one (`x`, `y`). */
export function DataTable({ id, at, text, name }: { id: string; at: Box; text: string; name: Point }) {
  const { x, y, w, h } = at;
  const head = 26;
  const rows = [1, 2].map((i) => y + head + ((h - head) * i) / 3);
  const columns = [1, 2].map((i) => x + (w * i) / 3);
  return (
    <g data-build={id}>
      <rect className="st-table" x={x} y={y} width={w} height={h} rx={6} />
      <rect className="st-table__head" x={x} y={y} width={w} height={head} rx={6} />
      <path className="st-table__grid" d={[`M${x} ${y + head}H${x + w}`, ...rows.map((ry) => `M${x} ${ry}H${x + w}`), ...columns.map((cx) => `M${cx} ${y + head}V${y + h}`)].join("")} />
      <rect className="st-table__edge" x={x} y={y} width={w} height={h} rx={6} />
      <Words at={name} text={text} anchor="end" />
    </g>
  );
}

/** A time stamp under a record's entry: a small clock and a line of writing (`show`). */
export function Stamp({ id, at }: { id: string; at: Point }) {
  const r = 9;
  const cx = at.x + r + 2;
  return (
    <g className="st-stamp" data-build={id}>
      <circle cx={cx} cy={at.y} r={r} />
      <path d={`M${cx} ${at.y - 5}V${at.y}H${cx + 4}`} />
      <rect className="st-stamp__bar" x={cx + r + 8} y={at.y - 4} width={30} height={8} rx={4} />
    </g>
  );
}
