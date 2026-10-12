/**
 * The pictures slide 44's grid holds, read from the script itself
 * (src/talks/bchc/script): every picture of the talk before the close, in
 * the order shown, each with the title the deck's overview gives its steps
 * ("NN. Name", steps.ts `copyFor`). capture-finale.mjs takes its count and
 * order from here, so the stills always match the script's grid.
 *
 * The script is TypeScript. Its part files import nothing but types, so
 * Node (22.18 or later, which strips types) loads them as they are; the
 * index is left alone, as its imports carry no extensions. The parts are
 * read in their number's order, the order the index joins them in.
 */
import { readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

export const SCRIPT_DIR = join(dirname(fileURLToPath(import.meta.url)), "../../script");

const PART = /^part-(\d+)-.+\.ts$/;
const isPicture = (value) => typeof value === "object" && value !== null && typeof value.world === "string" && Array.isArray(value.steps);

/** Every picture before the close, in the order shown: its number, its name and its title in the deck's overview. */
export async function finalePictures(dir = SCRIPT_DIR) {
  const parts = readdirSync(dir)
    .filter((name) => PART.test(name))
    .sort((a, b) => Number(PART.exec(a)[1]) - Number(PART.exec(b)[1]));
  const pictures = [];
  for (const name of parts) {
    const part = await import(pathToFileURL(join(dir, name)).href);
    for (const value of Object.values(part)) if (Array.isArray(value) && value.length > 0 && value.every(isPicture)) pictures.push(...value);
  }
  return pictures.filter((picture) => picture.world !== "close").map(({ number, name }) => ({ number, name, title: `${number}. ${name}` }));
}
