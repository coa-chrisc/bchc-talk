/**
 * Part 2's parts of the plane (slides 11 to 13, with 11a): the long road to
 * a bought tool, all in grey (the request card, the wall calendar and its
 * turning pages, the quotes and the stack of dollar signs they grow, the
 * "No" its stamp leaves, and the change request); the tools gap, in the same
 * grey (the product card, the AI badge that settles in it, its price growing
 * a row, and the dashed outlines of the tools still waiting); the app the
 * program staff describe and an agent builds, set against the small app with
 * a chatbot inside; and the history of approvals that comes with owning it,
 * named. `WhyMarks` are SVG under the HTML `WhyParts`; `WhyOver` is SVG over
 * them (the stamp).
 */
import { Agent, Block, Connector, Dashed, HumanMark, Part, Person, Tile, type Box } from "@/components/deck/kit";
import { AI_BUILDS, TOO_LONG, TOOLS_GAP, YOURS } from "./layout-why";

const line = (id: string, x0: number, x1: number, y: number) => <path className="dk-rule dk-draw" data-build={id} d={`M${x0} ${y}H${x1}`} pathLength={1} />;
const rect = (className: string, at: Box, rx = 4) => <rect className={className} x={at.x} y={at.y} width={at.w} height={at.h} rx={rx} pathLength={1} />;

/** A dollar sign, drawn as a line (no type), in its box: an S over a bar. */
function dollar({ x, y, w, h }: Box) {
  const l = x + w * 0.2;
  const r = x + w * 0.8;
  const m = y + h / 2;
  const s = `M${r} ${y + h * 0.28}C${r - 2} ${y + h * 0.14} ${l} ${y + h * 0.14} ${l} ${y + h * 0.33}C${l} ${m} ${r} ${m} ${r} ${y + h * 0.67}C${r} ${y + h * 0.86} ${l + 2} ${y + h * 0.86} ${l} ${y + h * 0.72}`;
  return `${s}M${x + w / 2} ${y}V${y + h}`;
}

/** The request card, its line of writing, and the "No" its stamp leaves, tilted, at its lower right. */
function Request() {
  const { request, no } = TOO_LONG;
  const cx = no.at.x + no.at.w / 2;
  const cy = no.at.y + no.at.h / 2;
  return (
    <>
      <g data-build={request.key}>
        {rect("catalog-grey dk-draw", request.at, 12)}
        {request.lines.map((l) => (
          <path key={l.y} className="catalog-grey__line dk-draw" d={`M${l.x0} ${l.y}H${l.x1}`} pathLength={1} />
        ))}
      </g>
      <g className="catalog-no" data-build={no.key} transform={`rotate(-10 ${cx} ${cy})`}>
        <rect x={no.at.x} y={no.at.y} width={no.at.w} height={no.at.h} rx={8} />
        <text x={cx} y={cy} textAnchor="middle" dominantBaseline="central">
          {no.text}
        </text>
      </g>
    </>
  );
}

/** A page of days: the face, or a page over it. */
const days = (className: string) => TOO_LONG.calendar.days.map((day) => <g key={`${day.x} ${day.y}`}>{rect(className, day)}</g>);

/** A page's month, at the top of the face under the binding. */
const month = (text: string, id?: string) => {
  const { head } = TOO_LONG.calendar;
  return (
    <text className="catalog-page__month" data-build={id} x={head.x + head.w / 2} y={head.y + head.h / 2} textAnchor="middle" dominantBaseline="central">
      {text}
    </text>
  );
};

/** The wall calendar: its binding and two rings over the face, drawn on, and the face's own month; the pages over the face, each named for its month and turning up over the binding; and the strips of turned pages piled over it. */
function Calendar() {
  const { calendar, pages } = TOO_LONG;
  return (
    <>
      <g data-build={calendar.key}>
        {rect("catalog-grey dk-draw", calendar.face, 8)}
        {month(calendar.month.text, calendar.month.key)}
        {days("catalog-grey__day dk-draw")}
        {rect("catalog-grey catalog-grey--binding dk-draw", calendar.binding, 8)}
        {calendar.rings.map((ring) => (
          <circle key={ring.x} className="catalog-grey dk-draw" cx={ring.x} cy={ring.y} r={10} pathLength={1} />
        ))}
      </g>
      {[...pages].reverse().map((page) => (
        <g key={page.key} className="catalog-page" data-build={page.key}>
          {rect("catalog-page__sheet", calendar.face, 8)}
          {month(page.month)}
          {days("catalog-grey__day")}
        </g>
      ))}
      {pages.map(({ strip }) => (
        <g key={strip.key} data-build={strip.key}>
          {rect("catalog-page__strip", strip.at, 2)}
        </g>
      ))}
    </>
  );
}

/** Rows of dollar signs, a row at a time from the foot up: slide 11's stack, and slide 11a's price. */
function Dollars({ rows }: { rows: readonly { key: string; glyphs: readonly Box[] }[] }) {
  return rows.map((row) => (
    <g key={row.key} data-build={row.key}>
      {row.glyphs.map((glyph) => (
        <path key={glyph.x} className="catalog-dollar" d={dollar(glyph)} />
      ))}
    </g>
  ));
}

/** Slide 11a's product card and its two lines of writing. */
function OwnedCard() {
  const { card } = TOOLS_GAP;
  return (
    <g data-build={card.key}>
      {rect("catalog-grey dk-draw", card.at, 12)}
      {card.lines.map((l) => (
        <path key={l.y} className="catalog-grey__line dk-draw" d={`M${l.x0} ${l.y}H${l.x1}`} pathLength={1} />
      ))}
    </g>
  );
}

/** A chat bubble's outline (a rounded box with a tail off its lower left) and the two lines of its message. */
function bubblePaths() {
  const { at } = AI_BUILDS.bubble;
  const r = 20;
  const right = at.x + at.w;
  const bottom = at.y + at.h;
  const outline = [
    `M${at.x + r} ${at.y}H${right - r}A${r} ${r} 0 0 1 ${right} ${at.y + r}V${bottom - r}A${r} ${r} 0 0 1 ${right - r} ${bottom}`,
    `H${at.x + 80}L${at.x + 48} ${bottom + 28}L${at.x + 52} ${bottom}H${at.x + r}A${r} ${r} 0 0 1 ${at.x} ${bottom - r}V${at.y + r}A${r} ${r} 0 0 1 ${at.x + r} ${at.y}Z`,
  ].join("");
  return { outline, lines: [`M${at.x + 36} ${at.y + 44}H${at.x + 260}`, `M${at.x + 36} ${at.y + 80}H${at.x + 190}`] };
}

/** A chat bubble inside the app, drawn on. */
function Bubble() {
  const { outline, lines } = bubblePaths();
  return (
    <g data-build={AI_BUILDS.bubble.key}>
      <path className="catalog-bubble dk-draw" d={outline} pathLength={1} />
      {lines.map((d) => (
        <path key={d} className="catalog-bubble__line dk-draw" d={d} pathLength={1} />
      ))}
    </g>
  );
}

/** The prohibition sign over the app's bubble: its ring and its slash, each its own part drawn on where `drawn` (the ring first, then the slash), both whole otherwise. */
function NoSign({ drawn }: { drawn: boolean }) {
  const { key, cx, cy, r, slash } = AI_BUILDS.noSign;
  const className = drawn ? "catalog-nope dk-draw" : "catalog-nope";
  const length = drawn ? 1 : undefined;
  return (
    <>
      <circle className={className} data-build={drawn ? key : undefined} cx={cx} cy={cy} r={r} pathLength={length} />
      <path className={className} data-build={drawn ? slash.key : undefined} d={`M${slash.x1} ${slash.y1}L${slash.x2} ${slash.y2}`} pathLength={length} />
    </>
  );
}

/**
 * The app with its chat bubble and the sign over it, small and whole, at the
 * left: what slide 12 sets the new picture against. The part is moved and
 * scaled about the small copy's top left, so it can start exactly over the
 * full-size app and carry the picture to its place. Its outlines keep the
 * full picture's weight; the bubble's lines and the sign shrink with it.
 */
function Before() {
  const { app, before } = AI_BUILDS;
  const { outline, lines } = bubblePaths();
  return (
    <Part id={before.key} origin={before.at}>
      <g transform={`translate(${before.at.x} ${before.at.y}) scale(${before.scale}) translate(${-app.at.x} ${-app.at.y})`}>
        <rect className="dk-rule" x={app.at.x} y={app.at.y} width={app.at.w} height={app.at.h} rx={12} vectorEffect="non-scaling-stroke" />
        <path className="dk-rule" d={`M${app.at.x} ${app.bar}H${app.at.x + app.at.w}`} vectorEffect="non-scaling-stroke" />
        <path className="catalog-bubble" d={outline} vectorEffect="non-scaling-stroke" />
        {lines.map((d) => (
          <path key={d} className="catalog-bubble__line" d={d} />
        ))}
        <NoSign drawn={false} />
      </g>
    </Part>
  );
}

/** The approvals on the history line: the coral mark at half its size. */
function Approval({ id, at }: { id: string; at: { x: number; y: number } }) {
  return (
    <g className="catalog-history" transform={`translate(${at.x} ${at.y}) scale(0.5) translate(${-at.x} ${-at.y})`}>
      <HumanMark id={id} at={at} />
    </g>
  );
}

export function WhyMarks() {
  const { app } = AI_BUILDS;
  return (
    <>
      <Request />
      <Calendar />
      <Dollars rows={TOO_LONG.dollars} />
      <OwnedCard />
      <Dollars rows={TOOLS_GAP.price} />

      <g data-build={app.key}>
        <rect className="dk-rule dk-draw" x={app.at.x} y={app.at.y} width={app.at.w} height={app.at.h} rx={12} pathLength={1} />
        <path className="dk-rule dk-draw" d={`M${app.at.x} ${app.bar}H${app.at.x + app.at.w}`} pathLength={1} />
      </g>
      <Bubble />
      <NoSign drawn />
      <Before />
      <Agent id={AI_BUILDS.agent.key} at={AI_BUILDS.agent.at} role="builder" hue="process" />
      {AI_BUILDS.tiles.map((tile) => (
        <Tile key={tile.key} id={tile.key} at={tile.at} size="large" hue="process" />
      ))}
      <Person id={AI_BUILDS.person.key} at={AI_BUILDS.person.at} />
      <Connector id={AI_BUILDS.describes.key} from={AI_BUILDS.describes.from} to={AI_BUILDS.describes.to} />
      <HumanMark id={AI_BUILDS.mark.key} at={AI_BUILDS.mark.at} />

      <rect className="catalog-yours dk-draw" data-build={YOURS.ring.key} x={YOURS.ring.at.x} y={YOURS.ring.at.y} width={YOURS.ring.at.w} height={YOURS.ring.at.h} rx={20} pathLength={1} />
      {line(YOURS.history.key, YOURS.history.x0, YOURS.history.x1, YOURS.history.y)}
      {YOURS.marks.map((mark) => (
        <Approval key={mark.key} id={mark.key} at={mark.at} />
      ))}
    </>
  );
}

/** Over the HTML: the stamp, a grey block on a handle, that swings down onto the card and lifts away. */
export function WhyOver() {
  const { at, key } = TOO_LONG.stamp;
  const cx = at.x + at.w / 2;
  const foot = at.y + at.h;
  return (
    <g data-build={key}>
      <g className="catalog-stamp" style={{ transformOrigin: `${cx}px ${foot}px` }}>
        <rect x={at.x} y={foot - 28} width={at.w} height={28} rx={4} />
        <rect x={cx - 10} y={at.y + 28} width={20} height={at.h - 56} />
        <rect x={cx - 28} y={at.y} width={56} height={32} rx={14} />
      </g>
    </g>
  );
}

export function WhyParts() {
  const { request, months, quotes, change } = TOO_LONG;
  return (
    <>
      <Block id={request.words.key} at={request.words.at} className="dk-block--line dk-block--center">
        {request.words.text}
      </Block>
      <Block id={months.key} at={months.at} className="dk-block--line dk-block--center">
        {months.text}
      </Block>
      {quotes.map((quote) => (
        <Block key={quote.key} id={quote.key} at={quote.at} className="dk-block--center catalog-quote">
          {quote.text}
        </Block>
      ))}
      <Block id={change.key} at={change.at} className="dk-block--center catalog-quote">
        {change.text}
      </Block>
      <Block id={TOOLS_GAP.words.key} at={TOOLS_GAP.words.at} className="dk-block--line dk-block--center">
        {TOOLS_GAP.words.text}
      </Block>
      <Block id={TOOLS_GAP.badge.key} at={TOOLS_GAP.badge.at} className="dk-block--center catalog-quote catalog-badge">
        {TOOLS_GAP.badge.text}
      </Block>
      {TOOLS_GAP.wanted.map((tool) => (
        <Dashed key={tool.key} id={tool.key} at={tool.at} rx={12} tone="soft" />
      ))}
      {TOOLS_GAP.wanted.map(({ name }) => (
        <Block key={name.key} id={name.key} at={name.at} className="dk-block--line dk-block--center dk-block--soft">
          {name.text}
        </Block>
      ))}
      {[AI_BUILDS.agentName, AI_BUILDS.personName].map((name) => (
        <Block key={name.key} id={name.key} at={name.at} className="dk-block--label dk-block--line dk-block--center">
          {name.text}
        </Block>
      ))}
      {AI_BUILDS.tiles.map(({ place }) => (
        <Dashed key={place.key} id={place.key} at={place.at} rx={8} tone="soft" />
      ))}
      {[AI_BUILDS.inside, AI_BUILDS.builds].map((label) => (
        <Block key={label.key} id={label.key} at={label.at} className="dk-block--line">
          {label.text}
        </Block>
      ))}
      <Block id={YOURS.label.key} at={YOURS.label.at} className="dk-block--line">
        {YOURS.label.text}
      </Block>
      <Block id={YOURS.historyName.key} at={YOURS.historyName.at} className="dk-block--label dk-block--line">
        {YOURS.historyName.text}
      </Block>
    </>
  );
}
