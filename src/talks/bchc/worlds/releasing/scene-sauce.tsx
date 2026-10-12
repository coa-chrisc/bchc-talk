/**
 * Slide 29's stage (layout-sauce.ts): the bottle of Austin's magic sauce,
 * the drops it pours and the four panels they open into. The bottle, its
 * sauce, the drops and the panels' outlines and drawings are SVG for the
 * plane's marks; the panels' headings are HTML over them. Static markup: the
 * steps (world-sauce.ts) do all the moving.
 */
import { Block, box } from "@/components/deck/kit";
import { Figure, Package, Tiles } from "./drawings";
import { BOTTLE, BOTTLE_INSIDE, BOTTLE_KEYS, BOTTLE_OUTLINE, DROP, DROPS, HOME, PANEL_ART, PANELS, POOL, SAUCE_BOX, TIP } from "./layout-sauce";

const { cap, label, labelLines, labelPitch, lip, neck } = BOTTLE;
/** The cap's grip: ridges 12 apart, three spans of them past each side, so sliding them a span to the side looks like the cap turning. */
const RIDGE = { pitch: 12, spare: 3 } as const;
const ridges = Array.from({ length: Math.round(cap.w / RIDGE.pitch) + 2 * RIDGE.spare + 1 }, (_, i) => cap.x + (i - RIDGE.spare) * RIDGE.pitch);

/**
 * The bottle, drawn upright with its base's middle at HOME and turned about
 * that point: --x and --y carry it, --r leans it (releasing.css `.rel-bottle`).
 * Inside, the sauce stands upright (`--k`, its height) or, once tipped, lies
 * as a pool whose top stays level on the stage; the bottle's inside cuts both
 * to shape. The cap turns off by its grip (--tw) and lifts away (--cx, --cy, --cr).
 */
function Bottle() {
  return (
    <g className="rel-bottle" data-build={BOTTLE_KEYS.bottle} style={{ transformOrigin: `${HOME.x}px ${HOME.y}px` }}>
      <g transform={`translate(${HOME.x} ${HOME.y})`}>
        <clipPath id="rel-bottle-inside">
          <path d={BOTTLE_INSIDE} />
        </clipPath>
        <clipPath id="rel-cap-grip">
          <rect x={cap.x} y={cap.y} width={cap.w} height={cap.h} rx={6} />
        </clipPath>
        <g clipPath="url(#rel-bottle-inside)" data-hue="share-sauce">
          <rect className="rel-sauce rel-sauce--upright" data-build={BOTTLE_KEYS.upright} x={SAUCE_BOX.x} y={SAUCE_BOX.y} width={SAUCE_BOX.w} height={SAUCE_BOX.h} />
          <g transform={`rotate(${-TIP.pour})`}>
            <rect className="rel-sauce rel-sauce--pool" data-build={BOTTLE_KEYS.tipped} x={POOL.x} y={POOL.y} width={POOL.w} height={POOL.h} />
          </g>
        </g>
        <g data-build={BOTTLE_KEYS.line}>
          <path className="bchc-line dk-draw" d={BOTTLE_OUTLINE} pathLength={1} />
          <path className="bchc-line dk-draw" d={`M${-lip.half} ${neck.mouth}H${lip.half}`} pathLength={1} />
        </g>
        <g className="rel-label" data-build={BOTTLE_KEYS.label}>
          <rect x={label.x} y={label.y} width={label.w} height={label.h} rx={6} />
          {labelLines.map((line, i) => (
            <text key={line} x={0} y={label.y + label.h / 2 + (i - (labelLines.length - 1) / 2) * labelPitch} textAnchor="middle" dominantBaseline="central">
              {line}
            </text>
          ))}
        </g>
        <g className="rel-cap" data-build={BOTTLE_KEYS.cap}>
          <rect className="rel-cap__body" x={cap.x} y={cap.y} width={cap.w} height={cap.h} rx={6} />
          <g clipPath="url(#rel-cap-grip)">
            <g className="rel-cap__grip">
              {ridges.map((x) => (
                <path key={x} className="rel-cap__ridge" d={`M${x} ${cap.y + 8}V${cap.y + cap.h - 8}`} />
              ))}
            </g>
          </g>
          <rect className="bchc-line dk-draw" x={cap.x} y={cap.y} width={cap.w} height={cap.h} rx={6} pathLength={1} />
        </g>
      </g>
    </g>
  );
}

/** A drop of sauce, its tip up, centred on (0, 0). */
const TEAR = `M0 ${-2.2 * DROP.r}C${0.4 * DROP.r} ${-1.2 * DROP.r} ${DROP.r} ${-0.6 * DROP.r} ${DROP.r} ${0.2 * DROP.r}A${DROP.r} ${DROP.r} 0 0 1 ${-DROP.r} ${0.2 * DROP.r}C${-DROP.r} ${-0.6 * DROP.r} ${-0.4 * DROP.r} ${-1.2 * DROP.r} 0 ${-2.2 * DROP.r}Z`;

/** Each drop falls by --y from under the mouth and flattens (--sx, --sy) about its foot where it lands; two splashes fly up beside it. */
function Drops() {
  return DROPS.map((drop) => (
    <g key={drop.key} data-hue="share-sauce">
      <g className="rel-drop" data-build={drop.key} style={{ transformOrigin: `${drop.start.x}px ${drop.start.y + 1.2 * DROP.r}px` }}>
        <path className="rel-sauce-mark" d={TEAR} transform={`translate(${drop.start.x} ${drop.start.y})`} />
      </g>
      {drop.splash.map((splash) => (
        <g key={splash.key} className="dk-move" data-build={splash.key}>
          <circle className="rel-sauce-mark" cx={splash.at.x} cy={splash.at.y} r={7} />
        </g>
      ))}
    </g>
  ));
}

/** Each panel's drawing, centred on its `art` point: a small preview of its own slide, in its part's colour where the drawing has colour to give. It comes up with its part (--k), its lines drawing on (--d). */
function PanelArt({ i, x, y }: { i: number; x: number; y: number }) {
  const id = PANELS[i].artKey;
  if (i === 0) {
    const { w, h } = PANEL_ART.package;
    return <Package at={box(x - w / 2, y - h / 2, w, h)} />;
  }
  if (i === 1) {
    const { tiles, scale, rise, reach } = PANEL_ART.shelf;
    const side = 18 * scale;
    const span = (tiles * 24 - 6) * scale;
    return (
      <>
        <path className="bchc-line dk-draw" d={`M${x - reach} ${y + rise}H${x + reach}`} pathLength={1} />
        <Tiles id={`${id}.tile`} at={{ x: x - span / 2, y: y + rise - 6 - side }} cols={tiles} scale={scale} hue={PANELS[i].hue} />
      </>
    );
  }
  if (i === 2) {
    const { w, h, gap, ring, scale } = PANEL_ART.binders;
    const sheet = { w: 36 * scale, h: 32 * scale };
    return [0, 1].map((n) => {
      const left = x - gap / 2 - w + n * (w + gap);
      const top = y - h / 2;
      return (
        <g key={n}>
          <rect className="rel-hue-line dk-draw" x={left} y={top} width={w} height={h} rx={6} pathLength={1} />
          {[0.25, 0.5, 0.75].map((share) => (
            <circle key={share} className="bchc-line" cx={left + 12} cy={top + share * h} r={ring} />
          ))}
          {[0, 1, 2, 3].map((p) => {
            const px = left + 26 * scale + (p % 2) * (sheet.w + 6 * scale);
            const py = top + 10 * scale + Math.floor(p / 2) * (sheet.h + 8 * scale);
            return (
              <g key={p}>
                <rect className="rel-mini-sheet" x={px} y={py} width={sheet.w} height={sheet.h} rx={3} />
                <rect className={n === 0 ? "rel-ink-fill" : "rel-hue-fill rel-hue-fill--whole"} x={px + 6 * scale} y={py + 12 * scale} width={24 * scale} height={8 * scale} rx={2} />
              </g>
            );
          })}
        </g>
      );
    });
  }
  const { w, h, reach, pitch, person, laptop } = PANEL_ART.table;
  return (
    <>
      <rect className="rel-table" x={x - w / 2} y={y - h / 2} width={w} height={h} rx={12} />
      <rect className="rel-hue-line dk-draw" x={x - w / 2} y={y - h / 2} width={w} height={h} rx={12} pathLength={1} />
      {[-1, 0, 1].flatMap((n) =>
        [-1, 1].map((side) => {
          const px = x + n * pitch;
          const py = y + side * (h / 2 + 5 + person.h / 2);
          return (
            <g key={`${n}${side}`}>
              <Figure at={box(px - person.w / 2, py - person.h / 2, person.w, person.h)} />
              <rect className="bchc-line" x={px - laptop.w / 2} y={y + side * (h / 2 - reach / 2) - laptop.h / 2} width={laptop.w} height={laptop.h} rx={2} />
            </g>
          );
        }),
      )}
    </>
  );
}

/** The panels: each opens about its middle (--sx, --sy) with its outline in its part's colour, and holds its drawing. */
function Panels() {
  return PANELS.map((panel, i) => (
    <g key={panel.key} data-hue={panel.hue}>
      <g className="rel-panel" data-build={panel.key} style={{ transformOrigin: `${panel.centre.x}px ${panel.centre.y}px` }}>
        <rect x={panel.at.x} y={panel.at.y} width={panel.at.w} height={panel.at.h} rx={12} />
      </g>
      <g className="rel-panel-art" data-build={panel.artKey}>
        <g className="rel-panel-art__fade">
          <PanelArt i={i} x={panel.art.x} y={panel.art.y} />
        </g>
      </g>
    </g>
  ));
}

/** Slide 29's marks: the panels under everything, then the drops, then the bottle over all. */
export function SauceMarks() {
  return (
    <>
      <Panels />
      <Drops />
      <Bottle />
    </>
  );
}

/** Slide 29's words on the stage: each panel's heading, in navy. */
export function SauceWords() {
  return PANELS.map((panel) => (
    <Block key={panel.headKey} id={panel.headKey} at={panel.head.at} className="dk-block--lines">
      {panel.head.lines.map((line) => (
        <span key={line}>{line}</span>
      ))}
    </Block>
  ));
}
