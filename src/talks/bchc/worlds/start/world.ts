/** The start world: Part 6, how your department starts (slides 34 to 42). */
import type { WorldEntry } from "@/components/deck/engine";
import { copyFor, picturesOf, worldTitle } from "../steps";
import { Scene } from "./scene";
import { stepsOfAsk } from "./steps-ask";
import { stepsOfPath } from "./steps-path";
import { stepsOfSteps } from "./steps-steps";
import { stepsOfTwo } from "./steps-two";

export const startEntry: WorldEntry = {
  title: worldTitle("start"),
  world: { id: "start", Scene, steps: [...stepsOfSteps(), ...stepsOfTwo(), ...stepsOfPath(), ...stepsOfAsk()] },
  copy: copyFor(picturesOf("start")),
};
