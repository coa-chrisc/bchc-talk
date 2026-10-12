/** The sharing world: Part 4, slides 23 to 27, on one plane the size of the stage, the camera never moved. */
import type { WorldDef, WorldEntry } from "@/components/deck/engine";
import { copyFor, worldTitle } from "../steps";
import { PICTURES } from "./layout";
import { Scene } from "./scene";
import { adapt } from "./steps-adapt";
import { everyone } from "./steps-everyone";
import { more } from "./steps-more";
import { network } from "./steps-network";
import { together } from "./steps-together";

/** In the order shown (docs/bchc-talk-script.md): 23, 24, 25, 26, 27. */
export const sharing: WorldDef = { id: "sharing", Scene, steps: [...together, ...everyone, ...adapt, ...more, ...network] };

export const sharingEntry: WorldEntry = { title: worldTitle("sharing"), world: sharing, copy: copyFor(PICTURES) };
