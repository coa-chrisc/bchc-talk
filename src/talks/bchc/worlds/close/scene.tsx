/**
 * Part 7's stage: the close (slide 44). The finale's stills (one for each
 * picture before Part 7), the titles, the thanks and the label are HTML, and
 * slide 1's full-stage picture over them, so the view can pull back from it
 * into the grid. The agents are SVG over all of it (the plane's `over`), so
 * they settle on the stills; each sits on a navy disc so it reads on a white
 * still. A still not yet captured is a white tile with a navy rule. Static
 * markup: the steps (world.ts) do all the moving.
 */
"use client";

import { Agent, ArtefactFrame, Block, Part, Plane, SetText, place, type Box } from "@/components/deck/kit";
import { AGENTS, AGENT_R, DISC_R, HERO, LABEL, LEGEND, STILLS, THANKS, TITLES, blankRule } from "./layout";
import "./close.css";

/** A still in its frame, or a white tile with a navy rule when it has not been captured. */
function Still({ id, at, src }: { id: string; at: Box; src: string | null }) {
  if (src) return <ArtefactFrame id={id} at={at} stills={[{ src, alt: "" }]} />;
  return (
    <ArtefactFrame id={id} at={at} stills={[]}>
      <div className="close-blank" style={place(blankRule(at))} />
    </ArtefactFrame>
  );
}

function Agents() {
  return (
    <>
      <Agent id={LEGEND.key} at={LEGEND.at} role="builder" r={AGENT_R} hue="process" />
      {AGENTS.map((agent) => (
        <Part key={agent.key} id={agent.key}>
          <circle className="close-disc" cx={agent.at.x} cy={agent.at.y} r={DISC_R} />
          <Agent id={agent.glyphKey} at={agent.at} role="builder" r={AGENT_R} hue="process" />
        </Part>
      ))}
    </>
  );
}

export function Scene() {
  return (
    <Plane over={<Agents />}>
      {Object.values(TITLES).map((title) => (
        <SetText key={title.key} id={title.key} x={title.x} y={title.y} size="title" lines={title.lines} />
      ))}
      {STILLS.map((still) => (
        <Still key={still.key} id={still.key} at={still.at} src={still.src} />
      ))}
      <Block id={THANKS.key} at={THANKS.at} className="dk-block--line">
        {THANKS.text}
      </Block>
      <Block id={LABEL.key} at={LABEL.at} className="dk-block--line close-label">
        {LABEL.text}
      </Block>
      {/* Slide 1 at the size of the stage, moved about its top left (kit `spread`). */}
      <div className="close-hero dk-move" data-build={HERO.key}>
        <Still id={HERO.frameKey} at={HERO.at} src={HERO.src} />
      </div>
    </Plane>
  );
}
