/**
 * The build world, Part 3: how our agentic development process works,
 * slides 14, 18, 14a, 15, 16, 17, 19, 20, 21, 22, 22a and 22b in that order
 * (docs/bchc-talk-script.md). One click a slide, but two for slide 19 (the
 * plan, then the work): each click is one chain of beats (kit `chain`) that
 * plays the picture and its story lines on its own, lands inside 12 s and
 * never sits still for 3 (world.test.ts, flow.test.ts). The camera stays
 * home, so titles and story lines never move: the board goes small to the
 * corner for 20 to 22 and into the year on 22a by its own transform, and
 * the year gives way to the process ring on 22b.
 *
 * Steps: steps-intro.ts (14, 18, 14a), steps-library.ts (15 to 17),
 * steps-board.ts (19), steps-close.ts (20 to 22), steps-year.ts (22a),
 * steps-process.ts (22b).
 */
import type { WorldEntry } from "@/components/deck/engine";
import { copyFor, picturesOf, worldTitle } from "../steps";
import { Scene } from "./scene";
import { boardSteps } from "./steps-board";
import { closeSteps } from "./steps-close";
import { introSteps } from "./steps-intro";
import { librarySteps } from "./steps-library";
import { processSteps } from "./steps-process";
import { yearSteps } from "./steps-year";

export { COUNTS } from "./beats";

export const buildEntry: WorldEntry = {
  title: worldTitle("build"),
  world: {
    id: "build",
    Scene,
    steps: [...introSteps, ...librarySteps, ...boardSteps, ...closeSteps, ...yearSteps, ...processSteps],
  },
  copy: copyFor(picturesOf("build")),
};
