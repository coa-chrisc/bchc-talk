/**
 * A real artefact on the stage: a screenshot of a page, set on a
 * paper-tinted mount with a line border. The mount is the part a move names:
 * it opens and shuts by its clip (`wipe`, `unwipe`). Given several stills it
 * holds them as one strip, top to bottom, that travels behind the mount (`y`
 * on `id.strip`), the way a page scrolls. A `pinned` still stays at the
 * mount's foot while the strip moves under it, the way a page pins a bar to
 * the window. Children are set over the strip in the frame's own pixels and
 * are cut by the mount like the page is: a mark on a part of the page that
 * runs out of the frame. The caption underneath says where it came from; it
 * is optional, sits left or right, and is its own part (`id.source`). Stills
 * are served as they were saved and loaded eagerly, so the gate decodes them
 * before the talk starts. A mount that shows the catalog has the catalog's
 * 3 px edge (`edge="catalog"`).
 */
import Image from "next/image";
import type { ReactNode } from "react";
import { place } from "./geometry";
import type { Box } from "./tokens";

type Still = { src: string; alt: string };
type ArtefactFrameProps = {
  id: string;
  at: Box;
  stills: readonly Still[];
  /** A still held at the mount's foot, `h` tall. */
  pinned?: Still & { h: number };
  source?: string;
  sourceAlign?: "left" | "right";
  /** The catalog's edge round the mount, for a picture of the catalog. */
  edge?: "catalog";
  /** Each still's height, when a still is taller than the mount (the mount's own height when left out): the strip then scrolls within one still (`y` on `id.strip`). */
  stillH?: number;
  children?: ReactNode;
};

export function ArtefactFrame({ id, at, stills, pinned, source, sourceAlign = "left", edge, stillH, children }: ArtefactFrameProps) {
  const sizes = `${Math.round(at.w * 2)}px`;
  return (
    <figure className="dk-artefact" style={place(at)}>
      <div className="dk-artefact__mount dk-wipe" data-build={id} data-edge={edge}>
        <div className={stills.length > 2 ? "dk-artefact__strip dk-artefact__strip--long" : "dk-artefact__strip"} data-build={`${id}.strip`}>
          {stills.map((still) => (
            <div key={still.src} className="dk-artefact__still" style={{ height: stillH ?? at.h }}>
              <Image src={still.src} alt={still.alt} fill sizes={sizes} loading="eager" decoding="sync" unoptimized />
            </div>
          ))}
        </div>
        {children && <div className="dk-artefact__over">{children}</div>}
        {pinned && (
          <div className="dk-artefact__pinned" style={{ height: pinned.h }}>
            <Image src={pinned.src} alt={pinned.alt} fill sizes={sizes} loading="eager" decoding="sync" unoptimized />
          </div>
        )}
      </div>
      {source && (
        <figcaption className={`dk-label dk-artefact__source dk-artefact__source--${sourceAlign}`} data-build={`${id}.source`}>
          {source}
        </figcaption>
      )}
    </figure>
  );
}
