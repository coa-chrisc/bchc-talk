/**
 * What slides 39 and 40 draw (layout-path.ts): the path and what stands on
 * it, and the two starter templates. Each picture's marks are one SVG part
 * and its HTML one layer; the path has its own pair, because 41 brings it
 * back. Slides 41 and 42 are in scene-ask.tsx.
 */
import { Agent, Block, Cell, Connector, Dashed, Part, Person, Tag, Waveform } from "@/components/deck/kit";
import { layerOf } from "./layout";
import { EXAMPLES, LOW_RISK, PATH, TAG } from "./layout-path";
import { Dot, Field, Label, Layer, Line, Service, Sheet, Tool } from "./parts";
import { PictureStory } from "./story";

export function PathMarks() {
  const { catalog, helpline } = EXAMPLES;
  return (
    <>
      <Part id={layerOf("low-risk").marks}>
        <Tool id={LOW_RISK.tool.key} at={LOW_RISK.tool.at} />
        {LOW_RISK.rows.map((row) => (
          <Cell key={row.key} cell={row} />
        ))}
        {LOW_RISK.services.map((service) => (
          <Service key={service.key} id={service.key} at={service.at} />
        ))}
        <Agent id={LOW_RISK.agent.key} at={LOW_RISK.agent.at} role="builder" hue="process" />
        {LOW_RISK.sheets.map((sheet) => (
          <Sheet key={sheet.key} id={sheet.key} at={sheet.at} kind={sheet.kind} />
        ))}
        {LOW_RISK.sheets.map((sheet) => (
          <Sheet key={sheet.copyKey} id={sheet.copyKey} at={sheet.at} kind={sheet.kind} />
        ))}
        {LOW_RISK.arrows.map((arrow) => (
          <Connector key={arrow.key} id={arrow.key} from={arrow.from} to={arrow.to} tone="paper" />
        ))}
        {[...LOW_RISK.labels, LOW_RISK.residentsLabel, LOW_RISK.first].map((label) => (
          <Label key={label.key} id={label.key} at={label.at} text={label.text} anchor={label.anchor} />
        ))}
        {LOW_RISK.residents.map((person) => (
          <Person key={person.key} id={person.key} at={person.at} />
        ))}
      </Part>

      <Part id={layerOf("path").marks}>
        <Line id={PATH.line.key} from={PATH.line.from} to={PATH.line.to} tone="paper" />
        <Tool id={PATH.tool.key} at={PATH.tool.at} rx={8} />
        <Dot id={PATH.dot.key} at={PATH.dot.at} />
      </Part>

      <Part id={layerOf("examples").marks}>
        <Tool id={catalog.key} at={catalog.at} />
        {catalog.questions.map((field) => (
          <Field key={field.key} id={field.key} at={field.at} radio={{ id: field.radio.key, at: field.radio.at }} />
        ))}
        {catalog.results.map((result) => (
          <Cell key={result.key} cell={result} />
        ))}
        <Tool id={helpline.key} at={helpline.at} />
        <Waveform layout={helpline.wave} />
        {helpline.list.map((item) => (
          <Cell key={item.key} cell={item} />
        ))}
        <Waveform layout={helpline.voice} />
      </Part>
    </>
  );
}

export function PathHtml() {
  return (
    <>
      <Layer id={layerOf("low-risk").html}>
        <PictureStory picture="low-risk" />
      </Layer>
      <Layer id={layerOf("path").html}>
        <Dashed id={PATH.rest.key} at={PATH.rest.at} tone="soft" stub={PATH.rest.stub} />
      </Layer>
      <Layer id={layerOf("examples").html}>
        {/* Each template's name, and the tag that says what it is: a starter template, not a live tool. */}
        {[EXAMPLES.catalog.name, EXAMPLES.helpline.name].map((name) => (
          <Block key={name.key} id={name.key} at={name.at} className="dk-block--row st-template">
            <span>{name.text}</span>
            <Tag w={TAG.w} h={TAG.h}>
              {EXAMPLES.tag}
            </Tag>
          </Block>
        ))}
        <PictureStory picture="examples" />
      </Layer>
    </>
  );
}
