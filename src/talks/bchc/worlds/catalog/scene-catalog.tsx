/**
 * Part 1's parts of the plane, but for slide 7's desk (scene-review.tsx):
 * the catalog in its slot with its rings and its tag,
 * the row of six steps and the sender's status page under it, what stands
 * behind the site and the three working sessions, each with the page it
 * left, the coalition under them and the feedback that comes up from it
 * after each, the last leading into "Live". `CatalogMarks` are SVG under the HTML `CatalogParts`; `CatalogOver`
 * is SVG over them (the lines that cross out slide 8's boxes). What names a
 * place on a still is set inside that still's frame, in the still's own
 * pixels.
 */
import type { ReactNode } from "react";
import { ArtefactFrame, Block, Bracket, Connector, Dashed, HumanMark, InkRing, Line, Person, STAGE, Stations, Tab, type Box } from "@/components/deck/kit";
import { CATALOG, DAYS, ENTRY, HOST, ROW, SIX, STATUS, STILLS } from "./layout";

const rule = (id: string, x: number, y0: number, y1: number) => <path className="dk-rule dk-draw" data-build={id} d={`M${x} ${y0}V${y1}`} pathLength={1} />;

/** Ink on a still: an SVG the size of its frame, in the frame's own pixels. */
const Ink = ({ at, children }: { at: Box; children: ReactNode }) => (
  <svg className="dk-marks" width={at.w} height={at.h} viewBox={`0 0 ${at.w} ${at.h}`} aria-hidden="true">
    {children}
  </svg>
);

/** A checklist row's tick: its square fills with the pass tint and takes a night tick (`pass`). */
export function Tick({ id, at }: { id: string; at: Box }) {
  return (
    <g className="catalog-check" data-build={id}>
      <rect className="catalog-check__tint" x={at.x} y={at.y} width={at.w} height={at.h} rx={3} />
      <path className="catalog-check__tick" d={`M${at.x + 4.5} ${at.y + 10.5}L${at.x + 8.5} ${at.y + 14.5}L${at.x + 15.5} ${at.y + 6}`} />
    </g>
  );
}

export function CatalogMarks() {
  return (
    <>
      <Bracket id={SIX.bracket.key} x0={SIX.bracket.x0} x1={SIX.bracket.x1} y={SIX.bracket.y} drop={SIX.bracket.drop} />
      <Person id={SIX.person.key} at={SIX.person.at} />
      <HumanMark id={SIX.mark.key} at={SIX.mark.at} />

      <StatusPage />

      <rect className="catalog-sheet dk-draw" data-build={HOST.panel.key} x={HOST.panel.at.x} y={HOST.panel.at.y} width={HOST.panel.at.w} height={HOST.panel.at.h} rx={12} pathLength={1} />
      {rule(HOST.rule.key, HOST.rule.x, HOST.rule.y0, HOST.rule.y1)}

      {DAYS.sessions.map((session) => (
        <g key={session.key} data-build={session.key}>
          <rect className="catalog-session__fill" x={session.at.x} y={session.at.y} width={session.at.w} height={session.at.h} rx={8} />
          <rect className="catalog-session dk-draw" x={session.at.x} y={session.at.y} width={session.at.w} height={session.at.h} rx={8} pathLength={1} />
          <SessionPage page={session.page} />
        </g>
      ))}
      <Line id={DAYS.coalition.rule.key} from={DAYS.coalition.rule.from} to={DAYS.coalition.rule.to} tone="paper" />
      {DAYS.coalition.people.map((person) => (
        <Person key={person.key} id={person.key} at={person.at} />
      ))}
      {DAYS.feedback.map(({ from }) => (
        <Connector key={from.key} id={from.key} from={from.from} to={from.to} axis="v" tone="catalog" />
      ))}
      {DAYS.feedback.map(({ arrow }) => (
        <Connector key={arrow.key} id={arrow.key} from={arrow.from} to={arrow.to} axis="v" tone="catalog" />
      ))}
    </>
  );
}

const PAGE_TONE = { rule: "dk-rule", process: "catalog-built__part", catalog: "catalog-brand" } as const;

/** The catalog's page as a session left it, drawn with its card: its outline and header rule, and its parts, each in the tone of the session that made it. */
function SessionPage({ page }: { page: (typeof DAYS.sessions)[number]["page"] }) {
  const { at, header, parts } = page;
  return (
    <>
      <rect className="catalog-sheet dk-draw" x={at.x} y={at.y} width={at.w} height={at.h} rx={6} pathLength={1} />
      <path className="dk-rule dk-draw" d={`M${at.x} ${header}H${at.x + at.w}`} pathLength={1} />
      {parts.map((part) => (
        <rect key={`${part.at.x} ${part.at.y}`} className={`${PAGE_TONE[part.tone]} dk-draw`} x={part.at.x} y={part.at.y} width={part.at.w} height={part.at.h} rx={part.at.h > 12 ? 4 : 5} pathLength={1} />
      ))}
    </>
  );
}

/** Marks over the HTML: the lines through the names of the three things a site needs no longer. */
export function CatalogOver() {
  return HOST.usual.map(({ strike }) => <Line key={strike.key} id={strike.key} from={strike.from} to={strike.to} tone="paper" />);
}

/**
 * The sender's status page under the row: its outline, the line its steps
 * sit on and each step's ring draw as one part; each step's dot fills
 * (`fill`), and each stretch of line between two steps draws (`draw`), as
 * the card reaches it.
 */
function StatusPage() {
  const { page, track, steps, links } = STATUS;
  return (
    <>
      <g data-build={page.key}>
        <rect className="catalog-status dk-draw" x={page.at.x} y={page.at.y} width={page.at.w} height={page.at.h} rx={12} pathLength={1} />
        <path className="dk-rule dk-draw" d={`M${track.x0} ${track.y}H${track.x1}`} pathLength={1} />
        {steps.map((step) => (
          <circle key={step.key} className="catalog-status__ring dk-draw" cx={step.at.x} cy={step.at.y} r={step.r} pathLength={1} />
        ))}
      </g>
      {links.map((link) => (
        <path key={link.key} className="catalog-status__link dk-draw" data-build={link.key} d={`M${link.x0} ${link.y}H${link.x1}`} pathLength={1} />
      ))}
      {steps.map((step) => (
        <circle key={step.key} className="catalog-status__step" data-build={step.key} cx={step.at.x} cy={step.at.y} r={step.r} />
      ))}
    </>
  );
}

/** The ticks on the Checks heading's line, set inside the row so they go with it. */
function RowTicks() {
  return (
    <svg className="dk-marks" width={STAGE.w} height={STAGE.h} viewBox={`0 0 ${STAGE.w} ${STAGE.h}`} aria-hidden="true">
      {SIX.ticks.map((tick) => (
        <Tick key={tick.key} id={tick.key} at={tick.at} />
      ))}
    </svg>
  );
}

/** The catalog's list, with the three places it is found by. */
function Catalog() {
  const { frame, find } = CATALOG;
  return (
    <ArtefactFrame id={frame.key} at={frame.at} stills={STILLS.grid} edge="catalog">
      <Ink at={frame.at}>
        {find.map((callout) => (
          <InkRing key={callout.ring} id={callout.ring} at={callout.target} />
        ))}
      </Ink>
      {find.map((callout) => (
        <Tab key={callout.key} id={callout.key} at={callout.tab}>
          {callout.text}
        </Tab>
      ))}
    </ArtefactFrame>
  );
}

/** The fields that land on one of the opened project's stills. */
const fieldsOn = (frame: string) => ENTRY.fields.filter((field) => field.frame === frame);

/** One project opened: the top of its page, and further down it, where it runs; each field ringed on its place, with its tab. */
function Opened() {
  return [ENTRY.opened, ENTRY.runs].map((frame) => {
    const fields = fieldsOn(frame.key);
    return (
      <ArtefactFrame key={frame.key} id={frame.key} at={frame.at} stills={frame.stills} edge="catalog">
        <Ink at={frame.at}>
          {fields.map((field) => (
            <InkRing key={field.ring.key} id={field.ring.key} at={field.ring.at} rx={12} />
          ))}
        </Ink>
        {fields.map((field) => (
          <Tab key={field.tab.key} id={field.tab.key} at={field.tab.at}>
            {field.text}
          </Tab>
        ))}
      </ArtefactFrame>
    );
  });
}

export function CatalogParts() {
  const { address, tag } = CATALOG;
  return (
    <>
      <Catalog />
      <Block id={tag.key} at={tag.at} className="catalog-tag">
        {tag.lines.map((line) => (
          <span key={line}>{line}</span>
        ))}
      </Block>
      <Block id={address.key} at={address.at} className="dk-block--line dk-block--soft">
        {address.text}
      </Block>
      <Opened />

      <Stations layout={ROW} catalog={ROW.stations.length - 1} landed linkTone="paper">
        <RowTicks />
      </Stations>
      <Block id={SIX.automatic.key} at={SIX.automatic.at} className="dk-block--line">
        {SIX.automatic.text}
      </Block>

      <Block id={STATUS.name.key} at={STATUS.name.at} className="dk-block--line">
        {STATUS.name.text}
      </Block>
      <Block id={STATUS.published.key} at={STATUS.published.at} className="dk-block--line">
        {STATUS.published.text}
      </Block>

      {HOST.usual.map((thing) => (
        <Dashed key={thing.key} id={thing.key} at={thing.at} rx={12} tone="soft" />
      ))}
      {HOST.usual.map((thing) => (
        <Block key={thing.label} id={thing.label} at={thing.at} className="dk-block--center dk-block--soft">
          {thing.text}
        </Block>
      ))}
      <Block id={HOST.folder.key} at={HOST.folder.at} className="dk-mono dk-block--line dk-block--soft">
        {HOST.folder.text}
      </Block>
      {HOST.files.map((file) => (
        <Block key={file.key} id={file.key} at={file.at} className="dk-mono dk-block--line">
          {file.text}
        </Block>
      ))}
      <Block id={HOST.hosting.key} at={HOST.hosting.at} className="dk-block--line">
        {HOST.hosting.text}
      </Block>

      <Block id={DAYS.coalition.name.key} at={DAYS.coalition.name.at} className="dk-block--line">
        {DAYS.coalition.name.text}
      </Block>
      {DAYS.sessions.map(({ label }) => (
        <Block key={label.key} id={label.key} at={label.at} className="dk-block--line dk-block--center">
          {label.text}
        </Block>
      ))}
      {DAYS.feedback.map((mark) => (
        <Block key={mark.key} id={mark.key} at={mark.at} className="dk-block--line dk-block--center catalog-feedback">
          {mark.text}
        </Block>
      ))}
      <Block id={DAYS.live.key} at={DAYS.live.at} className="dk-block--line dk-block--center catalog-live">
        {DAYS.live.text}
      </Block>
    </>
  );
}
