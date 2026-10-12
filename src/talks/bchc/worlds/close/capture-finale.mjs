/**
 * Captures the finale's stills: one picture of each slide of the talk before
 * Part 7, taken from the finished deck at the end of the slide's chain, as
 * slide 44's grid shows them, and slide 1 whole, the picture slide 44 pulls
 * back from.
 *
 * Which pictures: the script's own (finale-pictures.mjs reads them from
 * src/talks/bchc/script), every picture before the close, in the order
 * shown, one for each cell of the grid. Which steps: worked out from the
 * running deck's own step list. A slide is one click, its step `play`,
 * except slide 19, whose second click `work` follows `plan`, and slide 27,
 * whose second click `outside` follows `grow`; the still is the end of the
 * slide's last step. The overview groups the steps by picture (its title
 * "NN. Name") and each step's address names its id (`#/world/picture.step`;
 * a world's first step has no id in its address, and must then be its
 * picture's first step). The deck's last world, the close that holds the
 * grid, is left out. The script stops if the deck's pictures are not the
 * script's, in number, title or order, or if a picture's steps are not
 * `play`, `plan` then `work`, or `grow` then `outside`. `--steps=3,9,14`
 * names the step numbers outright instead, for at most as many cells; a cell
 * with no still shows a white tile with a navy rule.
 *
 * Each step is loaded cold at its address, so it shows its end state, with
 * the deck's own controls hidden (the Austin Public Health frame stays, as
 * the slide shows it), at 1920 by 1080. The still is saved in colour, 352 by
 * 198 (16:9, about twice its cell), as `NN.<version>.webp`, NN its place in
 * the grid from 01 in reading order. The first picture is also saved whole,
 * 1920 by 1080, as `hero.<version>.webp`. With `--manifest` the list of
 * stills, their version and `hero: true` go to the close world's
 * finale.json, which is what the grid reads: a still not on the list shows
 * as the blank tile.
 *
 * Run it against the whole, finished deck only: the stills are the talk as
 * it stands, and a deck with worlds still being rebuilt captures them half
 * done. Every new capture takes a new version, so no browser or cache holds
 * an old picture under a new name.
 *
 * Playwright is not a dependency of the site, and ffmpeg and cwebp do the
 * saving. With the deck served (`next start`), run it through npx:
 *
 *   npx -y -p playwright@1.63.0 node src/talks/bchc/worlds/close/capture-finale.mjs \
 *     http://localhost:3000/ public/finale --version=v6 --manifest
 *
 * Options:
 *   --version=v6        the version in the file names (default v6)
 *   --steps=1,4,9       capture these step numbers, in this order, instead
 *   --manifest[=path]   also write the list of stills captured, their
 *                       version and whether the full-stage picture was
 *                       saved to the close world's finale.json (or to
 *                       path): finale.json's version is the one the deck
 *                       reads
 */
import { execFileSync, execSync } from "node:child_process";
import { mkdirSync, mkdtempSync, realpathSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { finalePictures } from "./finale-pictures.mjs";

const DEFAULT_VERSION = "v6";
const VIEW = { width: 1920, height: 1080 };
const STILL = { width: 352, height: 198 };
const DEFAULT_MANIFEST = join(dirname(fileURLToPath(import.meta.url)), "finale.json");

const args = process.argv.slice(2);
const option = (name) => {
  const found = args.find((arg) => arg === `--${name}` || arg.startsWith(`--${name}=`));
  if (!found) return undefined;
  const at = found.indexOf("=");
  return at < 0 ? true : found.slice(at + 1);
};
const [base, out] = args.filter((arg) => !arg.startsWith("--"));
if (!base || !out) {
  console.error("usage: capture-finale.mjs <deck-url> <out-dir> [--version=v6] [--steps=1,4,9] [--manifest[=path]]");
  process.exit(2);
}
const version = option("version") === undefined ? DEFAULT_VERSION : String(option("version"));
if (!/^v\d+$/.test(version)) throw new Error(`--version must be v and a number, not ${version}`);
const manifestOption = option("manifest");
const manifest = manifestOption === undefined ? null : manifestOption === true ? DEFAULT_MANIFEST : resolve(String(manifestOption));
const named = option("steps");

async function loadPlaywright() {
  try {
    return await import("playwright");
  } catch {
    const bin = realpathSync(execSync("command -v playwright", { encoding: "utf8" }).trim());
    return import(pathToFileURL(join(dirname(bin), "index.mjs")).href);
  }
}

/** Loads one address cold, past the gate, until the deck stands still. */
async function open(page, url) {
  await page.goto("about:blank");
  await page.goto(url);
  await page.addStyleTag({ content: ".deck-chrome { display: none !important; }" });
  await page.waitForSelector(".deck-gate__start:not([disabled])");
  await page.keyboard.press("Enter");
  await page.waitForFunction(() => window.__deck?.ready() && !window.__deck.busy());
  await page.waitForTimeout(400);
}

/** A picture's clicks, as the script cuts them: one `play`, `plan` then `work` (slide 19), or `grow` then `outside` (slide 27). The last one finishes the picture. */
const CUTS = [["play"], ["plan", "work"], ["grow", "outside"]];

/**
 * Every picture's finishing step, in deck order: the overview gives each
 * step's number and its picture's title, and the step's address its id. The
 * last world (the close) is left out.
 */
async function finishingSteps(page) {
  await page.keyboard.press("o");
  await page.waitForSelector(".deck-overview__world");
  const worlds = await page.$$eval(".deck-overview__world", (sections) =>
    sections.map((section) =>
      Array.from(section.querySelectorAll("button"), (button) => {
        const number = Number(button.querySelector("span")?.textContent);
        return { number, title: button.textContent.slice(String(number).length).trim(), hash: window.__deck.hash(number) };
      }),
    ),
  );
  await page.keyboard.press("o");
  const pictures = new Map();
  for (const steps of worlds.slice(0, -1)) {
    for (const [i, step] of steps.entries()) {
      // A world's first step leaves its id out of the address (`#/world`): it is its picture's first step.
      const id = /^#\/[^/]+\/(.+)$/.exec(step.hash)?.[1];
      if (!id && i > 0) throw new Error(`step ${step.number} (${step.title}) has no step id in its address ${step.hash}`);
      const own = pictures.get(step.title) ?? [];
      pictures.set(step.title, [...own, { number: step.number, cut: id ? id.slice(id.lastIndexOf(".") + 1) : null }]);
    }
  }
  return [...pictures.entries()].map(([title, steps]) => {
    // An unnamed first step stands for whichever cut's first click the rest of its steps match.
    const ok = CUTS.some((c) => c.length === steps.length && steps.every((step, i) => (step.cut ?? c[i]) === c[i]));
    if (!ok) throw new Error(`${title}: steps ${steps.map((step) => step.cut ?? "(first)").join(", ")} are not a picture's play, plan then work, or grow then outside`);
    return { title, number: steps.at(-1).number };
  });
}

// One cell for each picture before the close, as the script gives them; the deck must give the same pictures in the same order.
const pictures = await finalePictures();
const cells = pictures.length;

const { chromium } = await loadPlaywright();
const browser = await chromium.launch();
const context = await browser.newContext({ viewport: VIEW, deviceScaleFactor: 1 });
const page = await context.newPage();
page.on("pageerror", (error) => console.error("page error:", error.message));

await open(page, base);
const steps = named ? String(named).split(",").map((n) => ({ title: `step ${n}`, number: Number(n) })) : await finishingSteps(page);
if (steps.some((step) => !Number.isInteger(step.number) || step.number < 1)) throw new Error(`not a step number in ${named}`);
// The deck must give the script's pictures, in the script's order.
if (!named) {
  const differ = pictures.findIndex((picture, i) => steps[i]?.title !== picture.title);
  if (steps.length !== cells || differ >= 0) {
    const at = differ >= 0 ? differ : Math.min(steps.length, cells);
    throw new Error(`the deck's pictures before the close are not the script's ${cells}: cell ${at + 1} is "${steps[at]?.title ?? "(none)"}" in the deck and "${pictures[at]?.title ?? "(none)"}" in the script. Serve the finished deck, or name the steps with --steps`);
  }
}
if (steps.length > cells) throw new Error(`${steps.length} steps for ${cells} cells`);

mkdirSync(out, { recursive: true });
const work = mkdtempSync(join(tmpdir(), "bchc-finale-"));
const written = [];
let hero = false;
for (const [i, step] of steps.entries()) {
  const n = i + 1;
  const name = `${String(n).padStart(2, "0")}.${version}`;
  const hash = await page.evaluate((number) => window.__deck.hash(number), step.number);
  await open(page, `${base}${hash}`);
  const missing = await page.evaluate(() => window.__deck.missing());
  if (missing.length) console.warn(`${name}: images missing:`, missing.join(", "));
  const png = join(work, `${name}.png`);
  const small = join(work, `${name}.small.png`);
  await page.screenshot({ path: png });
  execFileSync("ffmpeg", ["-loglevel", "error", "-y", "-i", png, "-vf", `scale=${STILL.width}:${STILL.height}:flags=lanczos`, small]);
  execFileSync("cwebp", ["-quiet", "-q", "86", small, "-o", join(out, `${name}.webp`)]);
  written.push(n);
  console.log(`${name}.webp  step ${step.number}  ${hash}  ${step.title}`);
  if (n === 1) {
    // The first picture whole, as big as the stage: the picture slide 44 pulls back from.
    execFileSync("cwebp", ["-quiet", "-q", "86", png, "-o", join(out, `hero.${version}.webp`)]);
    hero = true;
    console.log(`hero.${version}.webp  step ${step.number}  ${hash}  ${step.title}, ${VIEW.width} by ${VIEW.height}`);
  }
}
await browser.close();

if (manifest) {
  writeFileSync(manifest, `${JSON.stringify({ version, stills: written, hero })}\n`);
  console.log("manifest", manifest);
}
