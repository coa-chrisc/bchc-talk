import { THE_CATALOG } from "./part-1-the-catalog";
import { WHY_THIS_MATTERS } from "./part-2-why-this-matters";
import { HOW_WE_BUILD } from "./part-3-how-we-build";
import { SHARING } from "./part-4-sharing";
import { RELEASING } from "./part-5-what-we-are-releasing";
import { HOW_YOU_START } from "./part-6-how-your-department-starts";
import { AGENTIC_PRESENTING } from "./part-7-agentic-presenting";
import type { Picture } from "./types";

export type { Picture, Step, WorldId } from "./types";
export { WORLDS } from "./types";
export { ADDRESS } from "./part-1-the-catalog";

/** The seven parts, by number from 1, as the script heads them: `PARTS[part - 1]` is a part's name. */
export const PARTS = ["The catalog", "Why this matters", "How our agentic development process works", "Sharing and collaboration", "What we're sharing", "How your department starts", "Close"];

/** Every picture of the talk, in the order it is given. */
export const SCRIPT: Picture[] = [...THE_CATALOG, ...WHY_THIS_MATTERS, ...HOW_WE_BUILD, ...SHARING, ...RELEASING, ...HOW_YOU_START, ...AGENTIC_PRESENTING];
