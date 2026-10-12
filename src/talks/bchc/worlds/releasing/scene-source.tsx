/**
 * Slide 31's stage (layout-source.ts): the catalog's grid, drawn and cropped
 * to its last row, with the catalog's edge; its two cards; the waiting stack
 * of tiles in the catalog's colour. These are SVG for the plane's marks. The
 * empty slot (a dashed outline that cannot stroke-draw), the stack's name and
 * the "Awaiting City of Austin approval" tag are HTML in SourceWords. Static markup:
 * the steps (world.ts) do all the moving.
 */
import { Block, Dashed, Part, Tag } from "@/components/deck/kit";
import { Tiles, Writing } from "./drawings";
import { CARDS, CATALOG, PEEKS, SLOT, STACK, STACK_CENTRE, STACK_TILES, WAITING } from "./layout-source";

/** A catalog card without words: a chip, a title in two bars, three lines of description, a rule and a footer of three marks. */
function Card({ at }: { at: { x: number; y: number; w: number; h: number } }) {
  const x = at.x + 28;
  return (
    <>
      <rect className="rel-card-ground" x={at.x} y={at.y} width={at.w} height={at.h} rx={14} />
      <rect className="rel-card-edge dk-draw" x={at.x} y={at.y} width={at.w} height={at.h} rx={14} pathLength={1} />
      <rect className="rel-catalog-chip" x={x} y={at.y + 28} width={96} height={26} rx={13} />
      <Writing x={x} y={at.y + 76} w={232} h={14} className="rel-card-title" />
      <Writing x={x} y={at.y + 100} w={150} h={14} className="rel-card-title" />
      {[0, 1, 2].map((n) => (
        <Writing key={n} x={x} y={at.y + 140 + n * 22} w={[272, 250, 180][n]} h={9} className="rel-card-text" />
      ))}
      <path className="rel-card-edge dk-draw" d={`M${x} ${at.y + 236}H${at.x + at.w - 28}`} pathLength={1} />
      {[0, 1, 2].map((n) => (
        <Writing key={n} x={x + n * 92} y={at.y + 262} w={72} h={10} className="rel-card-text" />
      ))}
    </>
  );
}

export function SourceMarks() {
  return (
    <>
      <g data-hue="catalog" data-build={CATALOG.key}>
        <clipPath id="rel-catalog-crop">
          <rect x={CATALOG.at.x} y={CATALOG.at.y} width={CATALOG.at.w} height={CATALOG.at.h} rx={CATALOG.rx} />
        </clipPath>
        <rect className="rel-catalog-ground" x={CATALOG.at.x} y={CATALOG.at.y} width={CATALOG.at.w} height={CATALOG.at.h} rx={CATALOG.rx} />
        <g clipPath="url(#rel-catalog-crop)" className="rel-catalog-peeks">
          {PEEKS.map((peek) => (
            <rect key={peek.x} className="rel-card-ground rel-card-ground--peek" x={peek.x} y={peek.y} width={peek.w} height={peek.h} rx={14} />
          ))}
        </g>
        <rect className="rel-catalog-edge dk-draw" x={CATALOG.at.x} y={CATALOG.at.y} width={CATALOG.at.w} height={CATALOG.at.h} rx={CATALOG.rx} pathLength={1} />
      </g>
      {CARDS.map((card) => (
        <g key={card.key} data-hue="catalog" data-build={card.key}>
          <Card at={card.at} />
        </g>
      ))}
      <g data-hue="share-code">
        <Part id={STACK.key} origin={STACK_CENTRE}>
          <Tiles id={`${STACK.key}.tile`} at={STACK.at} cols={STACK_TILES.cols} rows={STACK_TILES.rows} scale={STACK_TILES.scale} hue="share-code" />
        </Part>
      </g>
    </>
  );
}

export function SourceWords() {
  return (
    <>
      <Dashed id={SLOT.key} at={SLOT.at} rx={14} tone="share-code">
        <span className="rel-slot-name">{SLOT.text}</span>
      </Dashed>
      <Block id={STACK.name.key} at={STACK.name.at} className="dk-block--center rel-stack-name">
        {STACK.name.text}
      </Block>
      <Block id={WAITING.key} at={WAITING.at} className="dk-wipe">
        <Tag w={WAITING.at.w} h={WAITING.at.h}>
          {WAITING.text}
        </Tag>
      </Block>
    </>
  );
}
