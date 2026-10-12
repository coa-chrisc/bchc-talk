/** Slide 25's picture: the large tool card your agents rework, its passed tests, a person's approval, and the catalog's places with the original and the adapted version. */
"use client";

import { Agent, ArtefactFrame, HumanMark, Line, Part, PassTick, Person, type Box } from "@/components/deck/kit";
import { ADAPT, BIG, MINI } from "./layout-adapt";
import { Corner, Group, IconMark, Label, StoryOf } from "./scene-parts";

const A = ADAPT;

/** A badge on a card: a pill with its words in the middle. */
function Pill({ at, text }: { at: Box; text: string }) {
  return (
    <>
      <rect className="sh-pill" x={at.x} y={at.y} width={at.w} height={at.h} rx={at.h / 2} />
      <text className="dk-label sh-word" x={at.x + at.w / 2} y={at.y + at.h / 2} textAnchor="middle" dominantBaseline="central">
        {text}
      </text>
    </>
  );
}

/** The tool as the catalog holds it: in its indigo, its icon and name across the top, its badge at its foot right; the adapted one with its dashed corner. */
function MiniCard({ id, at, badge, badgeAt, adapted = false }: { id?: string; at: Box; badge: string; badgeAt: Box; adapted?: boolean }) {
  return (
    <g className="sh-card" data-build={id}>
      <rect className="sh-card__listed" x={at.x} y={at.y} width={at.w} height={at.h} rx={MINI.rx} />
      <IconMark icon={A.tool.icon} at={{ x: at.x + MINI.pad, y: at.y + MINI.pad }} size={MINI.icon} />
      <text className="dk-label sh-word" x={at.x + MINI.pad + MINI.icon + 10} y={at.y + MINI.pad + MINI.icon / 2} dominantBaseline="central">
        {A.tool.name}
      </text>
      <Pill at={badgeAt} text={badge} />
      {adapted && <Corner right={at.x + at.w} top={at.y} size={MINI.corner} />}
    </g>
  );
}

export function AdaptMarks() {
  const { card, badge } = A;
  const c = card.at;
  return (
    <Part id={A.marks}>
      <Line id={A.reach.key} from={A.reach.from} to={A.reach.to} tone="process" />
      <Agent id={A.agent.key} at={A.agent.at} r={A.agent.r} role="builder" hue="process" />
      <g data-build={card.key}>
        <rect className="sh-card__own" x={c.x} y={c.y} width={c.w} height={c.h} rx={BIG.rx} />
        <IconMark icon={A.tool.icon} at={{ x: c.x + BIG.pad, y: c.y + 26 }} size={BIG.icon} />
        <text className="dk-text sh-word sh-word--name" x={c.x + BIG.pad + BIG.icon + 16} y={c.y + 44} dominantBaseline="central">
          {A.tool.name}
        </text>
        {A.rows.map((row) => (
          <g key={row.key}>
            <text className="dk-label sh-word" x={row.at.x} y={row.at.y} dominantBaseline="central">
              {row.text}
            </text>
            <rect className="sh-bar" x={row.bar.x} y={row.bar.y} width={row.bar.w} height={row.bar.h} rx={row.bar.h / 2} />
            <rect className="sh-bar__fill" data-build={row.key} x={row.bar.x} y={row.bar.y} width={row.bar.w} height={row.bar.h} rx={row.bar.h / 2} />
          </g>
        ))}
        {/* The badge flips over (--k): the first face folds away as the second opens. */}
        <g data-build={badge.key}>
          <g className="sh-flip sh-flip--from">
            <Pill at={badge.at} text={badge.from} />
          </g>
          <g className="sh-flip sh-flip--to">
            <Pill at={badge.at} text={badge.to} />
          </g>
        </g>
        <Corner id={A.corner.key} right={c.x + c.w} top={c.y} size={BIG.corner} />
        {A.ticks.map((tick) => (
          <PassTick key={tick.key} id={tick.key} at={tick.at} r={tick.r} />
        ))}
      </g>
      <Person id={A.person.key} at={A.person.at} />
      <HumanMark id={A.mark.key} at={A.mark.at} />
    </Part>
  );
}

/** Cards in the catalog go over the HTML: they sit on its picture. */
export function AdaptOver() {
  const { original, copy } = A;
  return (
    <Part id={A.over}>
      <MiniCard id={original.key} at={original.at} badge={original.badge} badgeAt={original.badgeAt} />
      <Part id={copy.key} origin={copy.origin}>
        <MiniCard at={copy.at} badge={copy.badge} badgeAt={copy.badgeAt} adapted />
      </Part>
    </Part>
  );
}

export function AdaptHtml() {
  return (
    <Group id={A.html}>
      <StoryOf picture="adapt" />
      <ArtefactFrame id={A.frame.key} at={A.frame.at} stills={A.frame.stills} edge="catalog" />
      <Label id={A.agentLabel.key} at={A.agentLabel.at}>
        {A.agentLabel.text}
      </Label>
      <Label id={A.adapted.key} at={A.adapted.at} align="left">
        {A.adapted.text}
      </Label>
      <Label id={A.approves.key} at={A.approves.at} align="left">
        {A.approves.text}
      </Label>
    </Group>
  );
}
