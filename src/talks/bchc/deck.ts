/**
 * The Big Cities Health Coalition talk: six worlds, one for each run of the
 * script drawn as one picture (docs/bchc-art-direction.md, section 2). A
 * step's address, its name and its speaker note all come from the script
 * (script/). Only the frame (the Austin Public Health logo, footer and slide
 * number) persists across worlds: the deck has no persistent layer and no
 * backdrop, so the ground is the kit's plain one (docs/bchc-brand.md).
 */
import type { DeckDef } from "@/components/deck/engine";
import { withBase } from "@/lib/base-path";
import { Frame } from "./frame";
import { buildEntry } from "./worlds/build/world";
import { catalogEntry } from "./worlds/catalog/world";
import { closeEntry } from "./worlds/close/world";
import { releasingEntry } from "./worlds/releasing/world";
import { sharingEntry } from "./worlds/sharing/world";
import { startEntry } from "./worlds/start/world";

export const deck: DeckDef = {
  id: "bchc",
  title: "Using AI in Public Health Practice",
  notesPath: withBase("/notes/"),
  Frame,
  worlds: [catalogEntry, buildEntry, sharingEntry, releasingEntry, startEntry, closeEntry],
};
