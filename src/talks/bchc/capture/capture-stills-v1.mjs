/**
 * Captures the stills the approved talk added (docs/bchc-art-direction.md,
 * slides 6 and 26) from the public catalog, and prints where the things the
 * scenes ring sit in each one, in the frame's own pixels. It sits beside
 * capture-stills.mjs and leaves that script's stills alone: those are the
 * catalog as it was when they were taken, and the scenes' rings are
 * measured on them.
 *
 *   catalog-newest     the list of use cases, newest first, 1064 by 420: the
 *                      count, the search band and the newest entry whole.
 *   check-submission   the "Check your submission" page with a published
 *                      submission looked up, 1064 by 420, the page shown at
 *                      1.75 times its size so the result card fills the
 *                      frame: its number, title, date and the three stages
 *                      ending at Published.
 *   submit-form-type   the submit form at its first section, cut to the
 *                      section list and the question "What kind of
 *                      solution is it?" with its six choices, 928 by 464.
 *
 * Every still is saved in the page's own colours, as capture-stills.mjs
 * saves them (docs/bchc-brand.md, rule 6). Nothing is typed into the form and nothing is sent; the
 * status page is opened at its own shareable address (`?n=`), which asks
 * GitHub's public API for the submission from the browser, as it does for
 * any reader. The site's logo image is hidden before any picture is taken.
 *
 * Playwright is not a dependency of the site, and cwebp does the saving.
 * Run it through npx; the stills are written as `<name>.v2.webp` (the file
 * keeps its name from the stills' first version):
 *
 *   npx -y -p playwright@1.63.0 node src/talks/bchc/capture/capture-stills-v1.mjs public
 */
import { execFileSync, execSync } from "node:child_process";
import { mkdtempSync, realpathSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { pathToFileURL } from "node:url";

const out = process.argv[2] ?? ".";
const work = mkdtempSync(join(tmpdir(), "bchc-stills-v1-"));
const BASE = "https://big-cities-health-coalition.github.io/use-case-catalog/";
const VERSION = "v2";
/** The submission the status page looks up: published, and the newest entry on the catalog's list. */
const SUBMISSION = 107;
/** The right-hand frame of slide 6, and the window the list is captured in. */
const WIDE = { width: 1064, height: 420 };
/** The status page in a window this size, drawn at 3.5 device pixels to the CSS pixel, fills the same frame at 1.75 times the page's size. */
const STATUS = { window: { width: 608, height: 240 }, scale: 3.5 };
/** The form keeps its section list beside the questions only in a wider window; the still is cut from it, the size of slide 26's frame. */
const FORM_WINDOW = { width: 1160, height: 496 };
const FORM_CUT = { x: 16, y: 16, width: 928, height: 464 };
/** How far under the window's top the list view's results band starts, as in catalog-list. */
const BAND_GAP = 14;

/** Playwright from npx's own install, which is not this site's: found by its command on the path npx sets. */
async function loadPlaywright() {
  try {
    return await import("playwright");
  } catch {
    const bin = realpathSync(execSync("command -v playwright", { encoding: "utf8" }).trim());
    return import(pathToFileURL(join(dirname(bin), "index.mjs")).href);
  }
}

/** Where the matching elements sit in the window, as [x, y, w, h]. */
const rects = (page, selectors) =>
  page.evaluate((list) => {
    const rect = (element) => {
      const box = element.getBoundingClientRect();
      return [box.x, box.y, box.width, box.height].map((n) => Math.round(n));
    };
    return Object.fromEntries(list.map(([name, selector]) => [name, Array.from(document.querySelectorAll(selector), rect)]));
  }, Object.entries(selectors));

/** Hides the site's logo wherever the page shows it, keeping its place, and says how many were hidden. */
const hideLogos = (page) =>
  page.evaluate(() => {
    const logos = document.querySelectorAll("header img, footer img");
    for (const logo of logos) logo.style.visibility = "hidden";
    return logos.length;
  });

/** A PNG saved as WebP, in its own colours, under the still's versioned name. */
function save(name) {
  execFileSync("cwebp", ["-quiet", "-q", "86", join(work, `${name}.png`), "-o", join(out, `${name}.${VERSION}.webp`)]);
}

const { chromium } = await loadPlaywright();
const browser = await chromium.launch();

async function open(path, viewport, deviceScaleFactor = 2) {
  const context = await browser.newContext({ viewport, deviceScaleFactor, reducedMotion: "reduce" });
  const page = await context.newPage();
  await page.goto(`${BASE}${path}`, { waitUntil: "networkidle" });
  console.log(path, "logos hidden", await hideLogos(page));
  return page;
}

const shoot = async (page, name, options = {}) => {
  await page.mouse.move(0, 0);
  await page.waitForTimeout(500);
  await page.screenshot({ path: join(work, `${name}.png`), ...options });
  save(name);
};

/** Scrolls so an element's top is `gap` under the window's top. */
const scrollTo = (page, selector, gap) =>
  page.evaluate(
    ([wanted, room]) => {
      const element = document.querySelector(wanted);
      window.scrollTo(0, window.scrollY + element.getBoundingClientRect().top - room);
    },
    [selector, gap],
  );

// The list, newest first: the count and search band at the top of the frame, and the newest entry under it.
{
  const page = await open("catalog/", WIDE);
  await page.click('button[aria-label="List view"]');
  await scrollTo(page, ".results-header", BAND_GAP);
  await shoot(page, "catalog-newest");
  const titles = await page.evaluate(() => Array.from(document.querySelectorAll(".entry-card h2, .entry-card h3"), (h) => h.textContent.trim()).slice(0, 2));
  console.log("catalog-newest", JSON.stringify({ titles, ...(await rects(page, { band: ".results-header", count: ".results-count", cards: ".entry-card" })) }));
  await page.context().close();
}

// The status page, with the submission looked up at its own address.
{
  const page = await open(`status/?n=${SUBMISSION}`, STATUS.window, STATUS.scale);
  await page.waitForSelector('[data-status-result] [data-state="done"][aria-current="step"]', { timeout: 15000 });
  await scrollTo(page, "[data-status-result] .card", 8);
  await shoot(page, "check-submission");
  const found = await rects(page, { card: "[data-status-result] .card", now: "[data-status-result] strong", steps: "[data-status-result] .status-step", labels: "[data-status-result] [data-step-label]" });
  // In the frame's pixels: the page is drawn at 1.75 times its size.
  const zoom = WIDE.width / STATUS.window.width;
  const framed = Object.fromEntries(Object.entries(found).map(([name, list]) => [name, list.map((r) => r.map((n) => Math.round(n * zoom)))]));
  console.log("check-submission (frame px)", JSON.stringify(framed));
  await page.context().close();
}

// The submit form at its first section, at the question of what kind of solution it is.
{
  const page = await open("submit/", FORM_WINDOW);
  const question = await page.evaluate(() => {
    const legend = Array.from(document.querySelectorAll('[data-section="about"] legend, [data-section="about"] label, [data-section="about"] p, [data-section="about"] span')).find((element) => element.textContent.trim() === "What kind of solution is it?");
    const group = legend.closest("fieldset") ?? legend.parentElement;
    group.setAttribute("data-capture-question", "");
    return group.querySelectorAll('input[type="checkbox"], input[type="radio"]').length;
  });
  console.log("submit-form-type choices", question);
  await page.evaluate(() => {
    // The section list holds its place under the page's top once the page has moved this far.
    const rail = document.querySelector(".progress-rail").getBoundingClientRect().top;
    const asked = document.querySelector("[data-capture-question]").getBoundingClientRect().top;
    window.scrollTo(0, window.scrollY + Math.max(0, asked - 40) + Math.min(0, rail - 12));
  });
  await shoot(page, "submit-form-type", { clip: FORM_CUT });
  const found = await rects(page, { rail: ".progress-rail", question: "[data-capture-question]", choices: "[data-capture-question] label:has(input)" });
  const cut = Object.fromEntries(Object.entries(found).map(([name, list]) => [name, list.map(([x, y, w, h]) => [x - FORM_CUT.x, y - FORM_CUT.y, w, h])]));
  console.log("submit-form-type", JSON.stringify(cut));
  await page.context().close();
}

await browser.close();
