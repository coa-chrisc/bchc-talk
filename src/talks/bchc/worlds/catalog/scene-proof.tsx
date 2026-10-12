/**
 * Slide 10's parts of the plane: on the right, the bare wireframe of the
 * catalog's front page, its three pieces built over it in the process's
 * colour, the mark a person gives each piece, and the real catalog that
 * settles into it at the end; on the left, apart from the page, the people
 * and the agents, each three named, the people's mark beside them, and the
 * process's rule and name under them. `ProofMarks` are SVG under the HTML `ProofParts`, and `ProofOver`,
 * the marks, SVG over them.
 */
import { Agent, ArtefactFrame, Block, HumanMark, Line, Person, type Box } from "@/components/deck/kit";
import { STILLS } from "./layout";
import { PROOF } from "./layout-why";

const rect = (className: string, at: Box, rx = 6) => <rect className={`${className} dk-draw`} x={at.x} y={at.y} width={at.w} height={at.h} rx={rx} pathLength={1} />;
const { wire, pieces, menu, headerRule } = PROOF;
const [header] = pieces;

/** The bare page: its outline, the rule under its header, and every piece's place, in the quiet rule colour. */
function Wire() {
  return (
    <g data-build={wire.key}>
      {rect("dk-rule", wire.at, 12)}
      <path className="dk-rule dk-draw" d={`M${wire.at.x} ${headerRule}H${wire.at.x + wire.at.w}`} pathLength={1} />
      <circle className="dk-rule dk-draw" cx={menu.x} cy={menu.y} r={menu.r} pathLength={1} />
      {pieces.flatMap((piece) => piece.parts.map((part) => <g key={`${part.x} ${part.y}`}>{rect("dk-rule", part)}</g>))}
    </g>
  );
}

/** A piece built: its places drawn again in the process's colour, with its quiet tint. The header's menu button comes with it. */
function Piece({ piece }: { piece: (typeof pieces)[number] }) {
  return (
    <g className="catalog-built" data-build={piece.key}>
      {piece.parts.map((part) => (
        <g key={`${part.x} ${part.y}`}>{rect("catalog-built__part", part)}</g>
      ))}
      {piece === header && <circle className="catalog-built__part dk-draw" cx={menu.x} cy={menu.y} r={menu.r} pathLength={1} />}
    </g>
  );
}

export function ProofMarks() {
  return (
    <>
      <Wire />
      {pieces.map((piece) => (
        <Piece key={piece.key} piece={piece} />
      ))}
      {PROOF.people.map((person) => (
        <Person key={person.key} id={person.key} at={person.at} />
      ))}
      {PROOF.agents.map((agent) => (
        <Agent key={agent.key} id={agent.key} at={agent.at} role={agent.role} hue="process" />
      ))}
      <Line id={PROOF.rule.key} from={PROOF.rule.from} to={PROOF.rule.to} tone="process" />
    </>
  );
}

/** Over the HTML: the mark a person gives each piece, on the piece, so it fades on it as the real catalog comes in; and the one mark the people keep beside them. */
export function ProofOver() {
  return (
    <>
      {pieces.map(({ mark }) => (
        <HumanMark key={mark.key} id={mark.key} at={mark.at} />
      ))}
      <HumanMark id={PROOF.mark.key} at={PROOF.mark.at} />
    </>
  );
}

export function ProofParts() {
  return (
    <>
      <ArtefactFrame id={PROOF.still.key} at={PROOF.still.at} stills={STILLS.grid} edge="catalog" />
      {PROOF.names.map((name) => (
        <Block key={name.key} id={name.key} at={name.at} className="dk-block--label dk-block--line dk-block--center">
          {name.text}
        </Block>
      ))}
      {PROOF.labels.map((label) => (
        <Block key={label.key} id={label.key} at={label.at} className={label.soft ? "dk-block--line dk-block--soft" : "dk-block--line"}>
          {label.text}
        </Block>
      ))}
    </>
  );
}
