/** Slide 26's picture: the real form with four of its choices circled, a finished project card with its contact line, and two messages from people in other departments. */
"use client";

import { ArtefactFrame, InkRing, Part, Person } from "@/components/deck/kit";
import { MORE } from "./layout-more";
import { Group, IconMark, StoryOf } from "./scene-parts";

const M = MORE;

export function MoreMarks() {
  const { card } = M;
  const { contact } = card;
  return (
    <Part id={M.marks}>
      <g data-build={card.key}>
        <text className="dk-label sh-word" x={card.name.at.x} y={card.name.at.y + card.name.at.h / 2} dominantBaseline="central">
          {card.name.text}
        </text>
        <rect className="sh-card__listed" x={card.at.x} y={card.at.y} width={card.at.w} height={card.at.h} rx={12} />
        {card.bars.map((bar) => (
          <rect key={`${bar.x},${bar.y}`} className={`sh-line sh-line--${bar.tone}`} x={bar.at.x} y={bar.at.y} width={bar.at.w} height={bar.at.h} rx={bar.at.h / 2} />
        ))}
        <path className="dk-rule" d={`M${card.rule.from.x} ${card.rule.from.y}H${card.rule.to.x}`} />
        {/* The contact line: an envelope and its line, lit in indigo over the soft ones (--k). */}
        <g className="sh-contact" data-build={contact.key}>
          <g className="sh-contact__off">
            <IconMark icon="mail" at={contact.icon} size={contact.icon.size} />
            <rect className="sh-line sh-line--text" x={contact.bar.x} y={contact.bar.y} width={contact.bar.w} height={contact.bar.h} rx={contact.bar.h / 2} />
          </g>
          <g className="sh-contact__on">
            <IconMark icon="mail" at={contact.icon} size={contact.icon.size} />
            <rect className="sh-contact__bar" x={contact.bar.x} y={contact.bar.y} width={contact.bar.w} height={contact.bar.h} rx={contact.bar.h / 2} />
          </g>
        </g>
      </g>
      {M.messages.map((message) => (
        <g key={message.key} data-build={message.key}>
          <Person id={message.person.key} at={message.person.at} />
          <rect className="sh-bubble" x={message.bubble.x} y={message.bubble.y} width={message.bubble.w} height={message.bubble.h} rx={message.bubble.h / 2} />
          <text className="dk-text sh-word" x={message.textAt.x} y={message.textAt.y} dominantBaseline="central">
            {message.text}
          </text>
        </g>
      ))}
    </Part>
  );
}

/** The rings go over the HTML: they are drawn on the form's picture. */
export function MoreOver() {
  return (
    <Part id={M.over}>
      {M.rings.map((ring) => (
        <InkRing key={ring.key} id={ring.key} at={ring.at} rx={10} />
      ))}
    </Part>
  );
}

export function MoreHtml() {
  return (
    <Group id={M.html}>
      <StoryOf picture="more" />
      <ArtefactFrame id={M.frame.key} at={M.frame.at} stills={M.frame.stills} />
    </Group>
  );
}
