/**
 * Slide 14a: the lead agents at a desk, and the six folders they read, each
 * labelled on its spine in the script's words. The design system's folder
 * and the tested modules' stay on, lifted to the top of slides 15 to 17,
 * which open them (`FOLDER_ROW`).
 */
import { box } from "@/components/deck/kit";
import { shown } from "../../script/find";
import { FOLDER_ROW_AT } from "./layout";

const [LEADS_TEXT, ...FOLDER_TEXTS] = shown("setup", "play");

/** The desk: a top and two legs, under the lead agents and the pile, which sit close together near the middle of the stage. */
export const DESK = { y: 930, x0: 420, x1: 1620 } as const;
export const DESK_KEY = "setup.desk";
export const DESK_LINES = {
  top: `M${DESK.x0} ${DESK.y}H${DESK.x1}`,
  legs: `M${DESK.x0 + 60} ${DESK.y}V${DESK.y + 52}M${DESK.x1 - 60} ${DESK.y}V${DESK.y + 52}`,
};

/** The lead agents: gold agent rings on the desk, named over them, which stand once they have read everything. */
const LEAD_R = 38;
const LEAD_Y = DESK.y - LEAD_R - 4;
const STAND = -44;
export const LEADS = {
  key: "setup.leads",
  labelKey: "setup.leads.label",
  text: LEADS_TEXT,
  r: LEAD_R,
  at: [560, 660, 760].map((x) => ({ x, y: LEAD_Y })),
  /** How far they rise as they stand. */
  stand: STAND,
  /** The name, a 32 px line, 24 px over the standing agents. */
  label: { x: 560 - LEAD_R, y: LEAD_Y + STAND - LEAD_R - 24 - 38 },
};

/** A folder: its size, and the pile's place on the desk. */
export const FOLDER = { w: 640, h: FOLDER_ROW_AT.h, pitch: 58, x: 880 } as const;
const slotY = (k: number) => DESK.y - FOLDER.pitch * (k + 1) + (FOLDER.pitch - FOLDER.h);
/** Where a folder drops from, above its place. */
export const DROP = -60;

/** The six folders, in the script's order, from the bottom of the pile up: the design system's lands last, on top, with the tested modules' under it. */
export const FOLDERS = FOLDER_TEXTS.map((text, i) => ({
  key: `setup.folder.${i}`,
  text,
  at: box(FOLDER.x, slotY(i), FOLDER.w, FOLDER.h),
}));
/** Each folder's reading: a dot from its spine to the lead agents. */
export const READS = FOLDERS.map((folder, i) => ({
  key: `setup.read.${i}`,
  at: { x: folder.at.x - 14, y: folder.at.y + folder.at.h / 2 },
  to: { x: LEADS.at[2].x + LEADS.r + 18, y: LEADS.at[2].y },
}));

/** The two folders the next slides open: the tested modules' and the design system's, by their place in the script. */
const folderOf = (text: string) => {
  const found = FOLDERS.find((folder) => folder.text === text);
  if (!found) throw new Error(`Slide 14a has no folder "${text}".`);
  return found;
};
export const MODULES_FOLDER = folderOf("Tested modules");
export const DESIGN_FOLDER = folderOf("Design system");

/** Slides 15 to 17: the two folders in a row under the story band, the design system's first. */
const ROW_Y = FOLDER_ROW_AT.y;
export const FOLDER_ROW = {
  design: { x: 96 - DESIGN_FOLDER.at.x, y: ROW_Y - DESIGN_FOLDER.at.y },
  modules: {
    x: 96 + FOLDER.w + 32 - MODULES_FOLDER.at.x,
    y: ROW_Y - MODULES_FOLDER.at.y,
  },
  /** Where the row sits on the stage. */
  y: ROW_Y,
  bottom: ROW_Y + FOLDER.h,
  designX: 96,
  modulesX: 96 + FOLDER.w + 32,
};

export const SETUP_KEYS = [DESK_KEY, LEADS.key, LEADS.labelKey, ...FOLDERS.filter((f) => f !== MODULES_FOLDER && f !== DESIGN_FOLDER).map((f) => f.key), ...READS.map((r) => r.key)];
