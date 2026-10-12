/**
 * Slides 15 to 17: the design system's strip passing over three grey
 * sketches, the shelf of tested modules, and the source data read before an
 * empty app fills from all three. The two folders slide 14a kept go to the
 * top of the stage and stay there, the one in use at full strength.
 */
import { DUR, EASE, dim, draw, fill, hide, retitle, rise, show, to, wipe } from "@/components/deck/kit";
import { picture, story } from "../steps";
import { from, gone, opens, play, told } from "./beats";
import { titleKey } from "./layout";
import { APP_LAYOUT, DESIGN, LIBRARY_KEYS, READER, SHELF_ROWS, TABLE_LAYOUT, TOOLS, TOTAL } from "./layout-library";
import { DESIGN_FOLDER, FOLDER_ROW, MODULES_FOLDER, SETUP_KEYS } from "./layout-setup";

const FULL = { autoAlpha: 1 };

/* 15 */

/** When the strip's band starts down each sketch, and how long it takes. */
const PASS_AT = [3.0, 4.6, 6.2] as const;
const PASS = 1.0;
const design = play([
  {
    moves: [
      gone([...SETUP_KEYS, ...told("setup")]),
      retitle(titleKey("setup"), titleKey("design")),
      to(DESIGN_FOLDER.key, FOLDER_ROW.design, { x: 0, y: 0 }, { at: 0.2, duration: 1.0, ease: EASE.page }),
      to(MODULES_FOLDER.key, FOLDER_ROW.modules, { x: 0, y: 0 }, { at: 0.3, duration: 1.0, ease: EASE.page }),
      dim(MODULES_FOLDER.key, { at: 1.2 }),
      wipe(DESIGN.key, { at: 1.0 }),
      show(DESIGN.labelKey, { at: 1.5 }),
      show(
        TOOLS.flatMap((tool) => [tool.key, tool.greyKey]),
        { at: 1.9, stagger: 0.08 },
      ),
      TOOLS.map((tool, i) => [
        show(tool.bandKey, { at: PASS_AT[i], duration: 0.2 }),
        to(tool.bandKey, { y: tool.at.h }, { y: 0 }, { at: PASS_AT[i], duration: PASS, ease: EASE.draw }),
        wipe(tool.brandKey, {
          from: "top",
          at: PASS_AT[i],
          duration: PASS,
          ease: EASE.draw,
        }),
        hide(tool.bandKey, { at: PASS_AT[i] + PASS, duration: 0.25 }),
      ]),
    ],
  },
  { with: true, hold: 1.3, moves: [story("design", 0)] },
  {
    with: true,
    hold: PASS_AT[2] + PASS + 0.2 - 1.3,
    moves: [story("design", 1)],
  },
]);

/* 16 */

const ROW_AT = (i: number) => 0.6 + i * 0.35;
const lastRow = ROW_AT(SHELF_ROWS.length - 1) + 0.6;
const modules = play([
  {
    moves: [
      gone([...LIBRARY_KEYS.design, ...told("design")]),
      retitle(titleKey("design"), titleKey("modules")),
      dim(DESIGN_FOLDER.key, { at: 0.2 }),
      to(MODULES_FOLDER.key, FULL, { autoAlpha: 0.45 }, { at: 0.2, duration: DUR.quick, ease: EASE.soft }),
      SHELF_ROWS.map((row, i) => [wipe(row.key, { at: ROW_AT(i), duration: 0.6 }), row.text ? rise(row.nameKey, { at: ROW_AT(i) }) : []]),
      draw(TOTAL.bracketKey, { at: lastRow + 0.15 }),
      rise(TOTAL.key, { at: lastRow + 0.75 }),
    ],
  },
  { with: true, hold: 1.2, moves: [story("modules", 0)] },
  { with: true, hold: lastRow + 1.7 - 1.2, moves: [story("modules", 1)] },
]);

/* 17 */

/** The reader is at each column from `READ_AT + c * READ_PITCH`; the heading lights as it arrives. */
const READ_AT = 1.8;
const READ_PITCH = 0.8;
const BUILT_AT = READ_AT + TABLE_LAYOUT.cols * READ_PITCH + 0.4;
const data = play([
  {
    moves: [
      gone([...LIBRARY_KEYS.modules, ...told("modules")]),
      retitle(titleKey("modules"), titleKey("data")),
      to(DESIGN_FOLDER.key, FULL, { autoAlpha: 0.45 }, { at: 0.2, duration: DUR.quick, ease: EASE.soft }),
      show(APP_LAYOUT.key, { at: 0.4 }),
      show(TABLE_LAYOUT.key, { at: 0.6 }),
      rise(TABLE_LAYOUT.labelKey, { at: 0.7 }),
      show(READER.key, { at: READ_AT - 0.3 }),
      TABLE_LAYOUT.heads.map((head, c) => [
        c > 0
          ? to(
              READER.key,
              { x: c * READER.pitch },
              { x: 0 },
              {
                at: READ_AT + c * READ_PITCH - 0.4,
                duration: 0.4,
                ease: EASE.page,
              },
            )
          : [],
        fill(head.key, { at: READ_AT + c * READ_PITCH, duration: 0.4 }),
      ]),
      // The app fills all at once, from the design system, the modules and the data together; the reader's work is done.
      hide(READER.key, { at: BUILT_AT - 0.3 }),
      wipe(APP_LAYOUT.headerKey, { from: "top", at: BUILT_AT }),
      from(APP_LAYOUT.tilesKey, { y: -48 }, { at: BUILT_AT }),
      from(APP_LAYOUT.fieldsKey, { x: -60 }, { at: BUILT_AT }),
      opens(APP_LAYOUT.newKey, { at: BUILT_AT + 1.0, duration: 0.6 }),
      rise(APP_LAYOUT.newLabelKey, { at: BUILT_AT + 1.3 }),
    ],
  },
  { with: true, hold: 1.0, moves: [story("data", 0)] },
  { with: true, hold: BUILT_AT - 1.0, moves: [story("data", 1)] },
]);

export const librarySteps = [...picture("design", design), ...picture("modules", modules), ...picture("data", data)];
