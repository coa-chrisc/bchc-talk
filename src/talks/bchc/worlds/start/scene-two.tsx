/**
 * What slides 37 to 38b draw (layout-two.ts, layout-help.ts): each
 * picture's marks as one SVG part and its HTML as one layer, so the step
 * that leaves a picture hides it in two moves. Every word comes from the
 * layout, which reads the script.
 */
import { Agent, Block, Dashed, HumanMark, Part, Person } from "@/components/deck/kit";
import { layerOf } from "./layout";
import { FDE, QUESTIONS } from "./layout-help";
import { APPROVER_SLIDE, TOOLS } from "./layout-two";
import { AgentCard, Card, Change, DashedShape, Door, LockedButton, Receipt, Window, Words, Writing } from "./parts-figures";
import { Label, Layer, Line, Piece, Slip, Tool } from "./parts";
import { PictureStory } from "./story";

const LABEL = "dk-block--line";

export function TwoMarks() {
  const { door, tool, receipt, approver, mark, people, agents } = TOOLS;
  const { cards, queue, publish, cannot } = APPROVER_SLIDE;
  return (
    <>
      <Part id={layerOf("tools").marks}>
        <Door id={door.key} hinge={door.hinge} length={door.length} swing={door.swing.key} />
        {people.map((person) => (
          <Person key={person.key} id={person.key} at={person.at} />
        ))}
        <Window id={tool.window.key} at={tool.window.at} name={tool.window.name} bar={tool.window.bar} />
        {agents.map((agent) => (
          <g key={agent.key}>
            <Agent id={agent.key} at={agent.at} role="builder" hue="process" />
            {agent.code.map((line) => (
              <Writing key={line.key} id={line.key} at={line.at} />
            ))}
          </g>
        ))}
        <Receipt id={receipt.key} at={receipt.at} tick={receipt.tick} />
        <Words id={receipt.label.key} at={receipt.label.at} text={receipt.label.text} anchor="start" />
        <Person id={approver.key} at={approver.at} />
        <Words id={approver.label.key} at={approver.label.at} text={approver.label.text} anchor="start" />
        <HumanMark id={mark.key} at={mark.at} label={mark.label} />
        <Tool id={tool.key} at={tool.at} />
        <Words id={tool.name.key} at={tool.name.at} text={tool.name.text} />
      </Part>

      <Part id={layerOf("approver").marks}>
        {cards.map((card) => (
          <g key={card.key}>
            <Card id={card.key} at={card.at} />
            <Person id={card.figure.key} at={card.figure.at} />
            <Words id={card.nameKey} at={card.nameAt} text={card.name} />
          </g>
        ))}
        {queue.map((item) => (
          <AgentCard key={item.key} id={item.key} at={item.at} agent={item.agent}>
            <g data-build={item.change.key}>
              <Change at={item.change.at} />
              {item.change.desk && <HumanMark id={item.change.mark.key} at={item.change.mark.at} />}
            </g>
          </AgentCard>
        ))}
        <LockedButton id={publish.key} at={publish.at} text={publish.text} lock={publish.lock} />
        <Words id={cannot.key} at={cannot.at} text={cannot.text} anchor="end" />
      </Part>

      <Part id={layerOf("questions").marks}>
        <Line id={QUESTIONS.rule.key} from={QUESTIONS.rule.from} to={QUESTIONS.rule.to} />
      </Part>

      <Part id={layerOf("fde").marks}>
        {[...FDE.staff, ...FDE.itStaff, FDE.engineer].map((person) => (
          <Person key={person.key} id={person.key} at={person.at} />
        ))}
        <Label id={FDE.engineer.label.key} at={FDE.engineer.label.at} text={FDE.engineer.label.text} />
        {FDE.queue.map((slip) => (
          <Slip key={slip.key} id={slip.key} at={slip.at} />
        ))}
        <Label id={FDE.queueLabel.key} at={FDE.queueLabel.at} text={FDE.queueLabel.text} />
        {FDE.tools.map((tool) => [
          <Tool key={tool.key} id={tool.key} at={tool.at} />,
          ...tool.pieces.map((piece) => <Piece key={piece.key} id={piece.key} at={piece.at} />),
        ])}
      </Part>
    </>
  );
}

export function TwoHtml() {
  return (
    <>
      <Layer id={layerOf("tools").html}>
        <DashedShape id={TOOLS.room.key} at={TOOLS.room.at} d={TOOLS.room.d} />
        <Block id={TOOLS.label.key} at={TOOLS.label.at} className={LABEL}>
          {TOOLS.label.text}
        </Block>
        <PictureStory picture="tools" />
      </Layer>

      <Layer id={layerOf("approver").html}>
        <PictureStory picture="approver" />
      </Layer>

      <Layer id={layerOf("questions").html}>
        {QUESTIONS.pairs.map(({ question, answer }) => [
          <Block key={question.key} id={question.key} at={question.at} className={LABEL}>
            {question.text}
          </Block>,
          <Block key={answer.key} id={answer.key} at={answer.at} className={LABEL}>
            {answer.text}
          </Block>,
        ])}
        <PictureStory picture="questions" />
      </Layer>

      <Layer id={layerOf("fde").html}>
        {[FDE.dept, FDE.it].map((side) => [
          <Dashed key={side.key} id={side.key} at={side.at} rx={14} />,
          <Block key={side.label.key} id={side.label.key} at={side.label.at} className={LABEL}>
            {side.label.text}
          </Block>,
        ])}
        <PictureStory picture="fde" />
      </Layer>
    </>
  );
}
