/**
 * What slides 34 to 36a draw (layout.ts, layout-two.ts): each picture's
 * marks as one SVG part and its HTML as one layer, so the step that leaves a
 * picture hides it in two moves. Every word comes from the layout, which
 * reads the script. Slides 37 to 38b are in scene-two.tsx.
 */
import { Block, Dashed, HumanMark, Part, PassTick, Person, type Box } from "@/components/deck/kit";
import { STEP_ONE, THREE, TRAINING, layerOf } from "./layout";
import { GITHUB_SETUP, PROJECT_BAR, REQUEST_BAR } from "./layout-two";
import { Account, Card, Entry, GitHubMark, HistoryRow, Laptop, PostedEntry, ProjectCard, Slot, Window, Words, historyMark } from "./parts-figures";
import { Layer } from "./parts";
import { PictureStory } from "./story";

const LABEL = "dk-block--line";

const { request, space } = GITHUB_SETUP;

/** The approval mark at a history row's size: the kit's mark, scaled about its centre to the row's height. */
const ROW_MARK = 0.6;

/** A history row's mark: the deep-green tick of a passed check, or the approval mark, which lands on its own key. */
function RowMark({ id, kind, at }: { id: string; kind: "check" | "approval"; at: Box }) {
  const centre = historyMark(at);
  if (kind === "check") return <PassTick id={`${id}.tick`} at={centre} r={at.h / 2} />;
  return (
    <g transform={`translate(${centre.x} ${centre.y}) scale(${ROW_MARK})`}>
      <HumanMark id={`${id}.mark`} at={{ x: 0, y: 0 }} />
    </g>
  );
}

export function StepsMarks() {
  const { card, copy, catalog } = STEP_ONE;
  return (
    <>
      <Part id={layerOf("three").marks}>
        {THREE.steps.map((step) => (
          <g key={step.key}>
            <rect className="st-stair-face" data-build={step.face.key} x={step.face.at.x} y={step.face.at.y} width={step.face.at.w} height={step.face.at.h} />
            <path className="st-stair dk-draw" data-build={step.key} d={step.d} pathLength={1} />
          </g>
        ))}
        <Person id={THREE.person.key} at={THREE.person.at} />
        <Words id={THREE.person.label.key} at={THREE.person.label.at} text={THREE.person.label.text} />
      </Part>

      <Part id={layerOf("step-one").marks}>
        <rect className="st-catalog dk-draw" data-build={catalog.key} x={catalog.at.x} y={catalog.at.y} width={catalog.at.w} height={catalog.at.h} rx={4} pathLength={1} />
        {catalog.above.map((entry) => (
          <Entry key={entry.key} id={entry.key} at={entry.at} peek />
        ))}
        {catalog.entries.map((entry) => (
          <Entry key={entry.key} id={entry.key} at={entry.at} />
        ))}
        <Slot id={catalog.slot.key} at={catalog.slot.at} />
        {/* The copy is set under the card, so it slides out from behind it. */}
        <PostedEntry id={copy.key} at={copy.at} name={copy.name} edge={copy.edge} />
        <ProjectCard id={card.key} at={card.at} name={card.name} rule={card.rule} fields={card.fields} />
        <HumanMark id={STEP_ONE.mark.key} at={STEP_ONE.mark.at} />
      </Part>

      <Part id={layerOf("training").marks}>
        {TRAINING.seats.map(({ person, laptop }) => (
          <g key={person.key}>
            <Person id={person.key} at={person.at} />
            <Laptop id={laptop.key} lid={laptop.lid} hinge={laptop.hinge} screen={laptop.screen} base={laptop.base} />
          </g>
        ))}
        <path className="st-line--paper dk-draw" data-build={TRAINING.bracket.key} d={TRAINING.bracket.d} pathLength={1} />
        <Words id={TRAINING.label.key} at={TRAINING.label.at} text={TRAINING.label.text} size="text" />
      </Part>

      <Part id={layerOf("github").marks}>
        <Card id={request.key} at={request.at}>
          <path className="st-card__edge dk-draw" d={`M${request.at.x} ${request.at.y + REQUEST_BAR}H${request.at.x + request.at.w}`} pathLength={1} />
        </Card>
        <Words id={request.header.key} at={{ x: request.header.at.x, y: request.header.at.y + request.header.at.h / 2 }} text={request.header.text} anchor="start" />
        {request.items.map((item) => (
          <g key={item.key} data-build={item.key}>
            <circle className="st-bullet" cx={item.bullet.x} cy={item.bullet.y} r={6} />
            <Words at={{ x: item.at.x, y: item.at.y + item.at.h / 2 }} text={item.text} anchor="start" />
          </g>
        ))}
        <Person id={request.person.key} at={request.person.at} />
        <Words id={request.label.key} at={request.label.at} text={request.label.text} anchor="start" />
        <HumanMark id={request.mark.key} at={request.mark.at} />
        <g data-build={space.logo.key}>
          <GitHubMark at={space.logo.at} size={space.logo.size} />
        </g>
        {space.staff.map((account) => (
          <Account key={account.key} id={account.key} at={account.at} />
        ))}
        <Window id={space.project.key} at={space.project.at} name={space.project.name} bar={PROJECT_BAR} />
        {space.project.rows.map((row) => (
          <HistoryRow key={row.key} id={row.key} at={row.at}>
            <RowMark id={row.key} kind={row.kind} at={row.at} />
          </HistoryRow>
        ))}
      </Part>
    </>
  );
}

export function StepsHtml() {
  return (
    <>
      <Layer id={layerOf("three").html}>
        {THREE.steps.map((step) => (
          <Block key={step.words.key} id={step.words.key} at={step.words.at} className="dk-block--lines st-stair-words">
            {step.words.lines.map((text) => (
              <span key={text}>{text}</span>
            ))}
          </Block>
        ))}
        <PictureStory picture="three" />
      </Layer>

      <Layer id={layerOf("step-one").html}>
        <PictureStory picture="step-one" />
      </Layer>

      <Layer id={layerOf("training").html}>
        <PictureStory picture="training" />
      </Layer>

      <Layer id={layerOf("github").html}>
        <Dashed id={space.key} at={space.at} rx={14} />
        <Block id={space.label.key} at={space.label.at} className={LABEL}>
          {space.label.text}
        </Block>
        <PictureStory picture="github" />
      </Layer>
    </>
  );
}
