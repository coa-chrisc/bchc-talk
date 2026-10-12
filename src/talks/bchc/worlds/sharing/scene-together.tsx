/** Slide 23's picture: the catalog's places with its name, three departments with their agents over their rings and their stacks beside them, and the tool cards that travel between them. */
"use client";

import { Agent, ArtefactFrame, Part, place } from "@/components/deck/kit";
import { CARD } from "./layout";
import { TOGETHER } from "./layout-together";
import { Disc, Group, Label, StoryOf, ToolCard } from "./scene-parts";

const T = TOGETHER;

export function TogetherMarks() {
  return (
    <Part id={T.marks}>
      {T.departments.map((dept) => (
        <g key={dept.key}>
          <Disc id={dept.key} at={dept.at} r={dept.r} name={dept.name} />
          <g data-build={dept.wells.key}>
            {dept.wells.at.map((well) => (
              <rect key={well.y} className="sh-well" x={well.x} y={well.y} width={CARD.w} height={CARD.h} rx={CARD.rx} />
            ))}
          </g>
          <Agent id={dept.agent.key} at={dept.agent.at} role="builder" hue="process" />
        </g>
      ))}
    </Part>
  );
}

/** The cards go over the HTML: a tool lands on the catalog's picture. */
export function TogetherOver() {
  return (
    <Part id={T.over}>
      {T.departments.map((dept) => (
        <ToolCard key={dept.own.key} id={dept.own.key} at={dept.own.at} tool={T.tools[dept.own.tool]} kind="own" />
      ))}
      {T.posts.map((post) => (
        <ToolCard key={post.key} id={post.key} at={post.at} tool={T.tools[post.tool]} kind="listed" />
      ))}
      {T.copies.map((copy) => (
        <ToolCard key={copy.key} id={copy.key} at={copy.at} tool={T.tools[copy.tool]} kind="copy" />
      ))}
    </Part>
  );
}

export function TogetherHtml() {
  return (
    <Group id={T.html}>
      <StoryOf picture="together" />
      <ArtefactFrame id={T.frame.key} at={T.frame.at} stills={T.frame.stills} stillH={T.frame.stillH} edge="catalog" />
      <Label id={T.catalog.key} at={T.catalog.at} align="right">
        {T.catalog.text}
      </Label>
      <div className="dk-block dk-block--row sh-tally" style={place(T.count.at)}>
        {T.count.parts.map((part) => (
          <span key={part.key} data-build={part.key}>
            {part.text}
          </span>
        ))}
      </div>
      <Label id={T.agents.key} at={T.agents.at} align="right">
        {T.agents.text}
      </Label>
      <Label id={T.adapted.key} at={T.adapted.at} align="left">
        {T.adapted.text}
      </Label>
    </Group>
  );
}
