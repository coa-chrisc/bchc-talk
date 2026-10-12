/**
 * Slide 7's parts of the plane: the reviewer at their desk, and on it the
 * submission open as one card (the draft page with its privacy box ticked
 * by the sender, and the checklist), the data governance flag that lands on
 * it, the checklist's ticks, and the sign-off at its foot. `ReviewMarks` are
 * SVG under the HTML `ReviewParts`, which hold the words.
 */
import { Block, Flag, HumanMark, Person } from "@/components/deck/kit";
import { REVIEW } from "./layout";
import { Tick } from "./scene-catalog";

const path = (className: string, d: string, width?: number) => <path className={`${className} dk-draw`} d={d} strokeWidth={width} pathLength={1} />;

/** The card and everything printed on it, drawn on as one part. */
function Card() {
  const { key, at, bars, lines, privacy, divider, foot, checks } = REVIEW.card;
  const tick = privacy.at;
  return (
    <g data-build={key}>
      <rect className="catalog-sheet dk-draw" x={at.x} y={at.y} width={at.w} height={at.h} rx={12} pathLength={1} />
      {bars.map((bar) => (
        <g key={bar.y}>{path("catalog-sheet__bar", `M${bar.x0} ${bar.y}H${bar.x1}`, bar.w)}</g>
      ))}
      {lines.map((line) => (
        <g key={line.y}>{path("catalog-sheet__line", `M${line.x0} ${line.y}H${line.x1}`)}</g>
      ))}
      <rect className="catalog-sheet dk-draw" x={tick.x} y={tick.y} width={tick.w} height={tick.h} rx={3} pathLength={1} />
      {path("catalog-sheet__tick", `M${tick.x + 4.5} ${tick.y + 10.5}L${tick.x + 8.5} ${tick.y + 14.5}L${tick.x + 15.5} ${tick.y + 6}`)}
      {path("catalog-sheet__line", `M${privacy.line.x0} ${privacy.line.y}H${privacy.line.x1}`)}
      {path("dk-rule", `M${divider.x} ${divider.y0}V${divider.y1}`)}
      {path("dk-rule", `M${foot.x0} ${foot.y}H${foot.x1}`)}
      {checks.map((check) => (
        <g key={check.at.y}>
          <rect className="catalog-sheet dk-draw" x={check.at.x} y={check.at.y} width={check.at.w} height={check.at.h} rx={3} pathLength={1} />
          {path("catalog-sheet__line", `M${check.line.x0} ${check.line.y}H${check.line.x1}`)}
        </g>
      ))}
    </g>
  );
}

export function ReviewMarks() {
  const { desk, person, flag, ticks, mark } = REVIEW;
  return (
    <>
      <path className="dk-rule dk-draw catalog-desk" data-build={desk.key} d={`M${desk.x0} ${desk.y}H${desk.x1}`} pathLength={1} />
      <Person id={person.key} at={person.at} />
      <Card />
      <Flag id={flag.key} at={flag.at} size={flag.size} />
      {ticks.map((tick) => (
        <Tick key={tick.key} id={tick.key} at={tick.at} />
      ))}
      <HumanMark id={mark.key} at={mark.at} />
    </>
  );
}

export function ReviewParts() {
  const { name, flagged, approved, signed } = REVIEW;
  return (
    <>
      <Block id={name.key} at={name.at} className="dk-block--label dk-block--line dk-block--center">
        {name.text}
      </Block>
      <Block id={flagged.key} at={flagged.at} className="dk-block--label dk-block--line">
        {flagged.text}
      </Block>
      <Block id={approved.key} at={approved.at} className="dk-block--line dk-human-text">
        {approved.text}
      </Block>
      <Block id={signed.key} at={signed.at} className="dk-block--label dk-block--row">
        <span>{signed.who}</span>
        <span>{signed.when}</span>
      </Block>
    </>
  );
}
