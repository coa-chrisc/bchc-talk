/**
 * Slide 32's stage (layout-binders.ts): two binders in the design system's
 * pink, each with its rings and four tabbed pages; ours filled in our
 * colors, yours arriving blank, page by page, and filled in, in the team's
 * own. SVG for the plane's marks; the binders' names are HTML in
 * BinderWords. Static markup: the steps (world.ts) do all the moving.
 */
import { Block, Part } from "@/components/deck/kit";
import { PageMarks } from "./drawings";
import { BINDER, OURS, PAGE, PAGES, YOURS } from "./layout-binders";

/** A binder's cover and rings, drawn on with its part (--d). */
function Cover({ binder }: { binder: typeof OURS }) {
  const { at } = binder;
  return (
    <g data-build={binder.key}>
      <rect className="rel-cover-tint" x={at.x} y={at.y} width={at.w} height={at.h} rx={BINDER.rx} />
      <rect className="rel-hue-line dk-draw" x={at.x} y={at.y} width={at.w} height={at.h} rx={BINDER.rx} pathLength={1} />
      <path className="rel-hue-line dk-draw" d={`M${at.x + BINDER.spine} ${at.y}V${at.y + at.h}`} pathLength={1} />
      {binder.rings.map((ring) => (
        <circle key={ring.y} className="bchc-line dk-draw" cx={ring.x} cy={ring.y} r={9} pathLength={1} />
      ))}
    </g>
  );
}

/** A page: its tab, with the tab's name, and its sheet. */
function Sheet({ tab, sheet, name }: { tab: { x: number; y: number; w: number; h: number }; sheet: { x: number; y: number; w: number; h: number }; name: string }) {
  return (
    <>
      <rect className="rel-tab" x={tab.x} y={tab.y} width={tab.w} height={tab.h + PAGE.rx} rx={PAGE.rx} />
      <text className="rel-words rel-words--label" x={tab.x + 14} y={tab.y + tab.h / 2} dominantBaseline="central">
        {name}
      </text>
      <rect className="rel-sheet" x={sheet.x} y={sheet.y} width={sheet.w} height={sheet.h} rx={PAGE.rx} />
    </>
  );
}

export function BinderMarks() {
  return (
    <g data-hue="share-design">
      <Cover binder={OURS} />
      <Cover binder={YOURS} />
      {PAGES.map((page) => (
        <g key={page.yours.key}>
          <Part id={page.yours.key} origin={page.yours.centre}>
            <Sheet tab={page.yours.tab} sheet={page.yours.sheet} name={page.tab} />
          </Part>
          <g data-build={page.yours.fillKey}>
            <PageMarks kind={page.kind} at={page.yours.sheet} />
          </g>
        </g>
      ))}
      {/* Ours over yours: a blank copy slides out from under our page. */}
      {PAGES.map((page) => (
        <g key={page.ours.key} data-build={page.ours.key}>
          <Sheet tab={page.ours.tab} sheet={page.ours.sheet} name={page.tab} />
          <PageMarks kind={page.kind} at={page.ours.sheet} ours />
        </g>
      ))}
    </g>
  );
}

export function BinderWords() {
  return [OURS, YOURS].map((binder) => (
    <Block key={binder.name.key} id={binder.name.key} at={binder.name.at} className="dk-block--line rel-binder-name">
      {binder.name.text}
    </Block>
  ));
}
