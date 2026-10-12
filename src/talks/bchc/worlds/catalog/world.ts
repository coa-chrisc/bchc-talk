/** The catalog world: Parts 1 and 2 of the talk, slides 1 to 13, under the script's addresses. */
import type { WorldEntry } from "@/components/deck/engine";
import { copyFor, picturesOf, worldTitle } from "../steps";
import { Scene } from "./scene";
import { PART_ONE } from "./steps-catalog";
import { PART_TWO } from "./steps-why";

export const catalogEntry: WorldEntry = {
  title: worldTitle("catalog"),
  world: { id: "catalog", Scene, steps: [...PART_ONE, ...PART_TWO] },
  copy: copyFor(picturesOf("catalog")),
};
