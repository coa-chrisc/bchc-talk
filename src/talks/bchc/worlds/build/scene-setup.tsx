/**
 * Slide 14a on the stage: the desk, the lead agents and the six folders they
 * read. The folders are HTML, each its own part, so the two the next slides
 * open can be carried to the top of the stage by transform.
 */
"use client";

import { DESK, DESK_KEY, DESK_LINES, FOLDERS, LEADS, READS } from "./layout-setup";
import { Pic, Shape, Words } from "./parts";

export function SetupScene() {
  const pad = LEADS.r + 6;
  return (
    <>
      <Pic at={{ x: DESK.x0 - 10, y: DESK.y - 10, w: DESK.x1 - DESK.x0 + 20, h: 70 }} id={DESK_KEY}>
        <path className="bw-desk" d={DESK_LINES.top} />
        <path className="bw-ink" d={DESK_LINES.legs} />
      </Pic>
      <Pic
        at={{
          x: LEADS.at[0].x - pad,
          y: LEADS.at[0].y - pad,
          w: LEADS.at[2].x - LEADS.at[0].x + 2 * pad,
          h: 2 * pad,
        }}
        id={LEADS.key}
      >
        {LEADS.at.map((at, i) => (
          <Shape key={i} kind="lead" at={at} r={LEADS.r} />
        ))}
      </Pic>
      <Words id={LEADS.labelKey} at={LEADS.label} lines={[LEADS.text]} size="text" />
      {READS.map((read) => (
        <div key={read.key} className="bw-dot" data-build={read.key} style={{ left: read.at.x - 8, top: read.at.y - 8 }} />
      ))}
      {FOLDERS.map((folder) => (
        <div
          key={folder.key}
          className="bw-folder"
          data-build={folder.key}
          style={{
            left: folder.at.x,
            top: folder.at.y,
            width: folder.at.w,
            height: folder.at.h,
          }}
        >
          <span className="bw-folder__label">{folder.text}</span>
        </div>
      ))}
    </>
  );
}
