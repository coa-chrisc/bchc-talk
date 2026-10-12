/**
 * Captures the talk's evidence stills from the public catalog, and prints
 * where the things the scenes point at sit in each one, in the still's own
 * CSS pixels. A still is shown at the size it was captured, one page pixel
 * to one stage pixel, so nothing on it is scaled down:
 *
 *   catalog-grid     the list of use cases as the catalog first shows it, in
 *                    its card grid, 928 by 520: the search
 *                    field at the top, the first row of cards with the first
 *                    card's Compare control, and the Filters bar the page
 *                    pins to the bottom of a window this wide. 520 is the
 *                    least height that holds all three over the bar.
 *   submit-form      the submit form at its "Data & access" section, cut to
 *                    the section list and the question column, 792 by 464.
 *
 * Every still is saved in the page's own colours (docs/bchc-brand.md, rule
 * 6), so it looks like the site the audience will open. Nothing is picked
 * for comparison, nothing is typed into the form and nothing is sent.
 * Moving forward in the form validates every answer, so the section is shown
 * the way the form's own script shows one (assets/js/submit/steps.js
 * `apply`): every other section hidden, and the list's link marked as the
 * current step. The site's logo image is hidden before any picture is taken,
 * and so are the department names on the grid's cards (the catalog's sample
 * entries name made-up departments, and none may be read on a slide) and the
 * count of use cases over the grid (the talk gives no count anywhere). The
 * red-to-blue stripe the site draws across the top of each card is taken
 * off by injected CSS, keeping its place, so the stills carry only the
 * deck's own colours and the page's plain ones.
 *
 * Playwright is not a dependency of the site, and cwebp does the saving. Run
 * it through npx; the stills are written as `<name>.v6.webp`:
 *
 *   npx -y -p playwright@1.63.0 node src/talks/bchc/capture/capture-stills.mjs public
 */
import { execFileSync, execSync } from "node:child_process";
import { mkdtempSync, realpathSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { pathToFileURL } from "node:url";

const out = process.argv[2] ?? ".";
const work = mkdtempSync(join(tmpdir(), "bchc-stills-"));
const BASE = "https://big-cities-health-coalition.github.io/use-case-catalog/";
const VERSION = "v6";
/** The evidence frame, and the window the catalog's grid is captured in. */
const FRAME = { width: 928, height: 520 };
/** The form keeps its section list beside the questions only in a wider window; the still is cut from it. */
const FORM_WINDOW = { width: 1160, height: 496 };
const FORM_CUT = { x: 16, y: 16, width: 792, height: 464 };

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

async function open(path, viewport) {
  const context = await browser.newContext({ viewport, deviceScaleFactor: 2, reducedMotion: "reduce" });
  const page = await context.newPage();
  await page.goto(`${BASE}${path}`, { waitUntil: "networkidle" });
  console.log(path, "logos hidden", await hideLogos(page));
  return page;
}

const shoot = async (page, name, options = {}) => {
  await page.waitForTimeout(500);
  await page.screenshot({ path: join(work, `${name}.png`), ...options });
  save(name);
};

/** Hides the count of use cases over the grid, keeping its place, and says how many were hidden. */
const hideCount = (page) =>
  page.evaluate(() => {
    const counts = document.querySelectorAll(".results-count");
    for (const count of counts) count.style.visibility = "hidden";
    return counts.length;
  });

/** Hides the department named on each of the grid's cards, keeping its place, and says how many were hidden. */
const hideDepartments = (page) =>
  page.evaluate(() => {
    const names = document.querySelectorAll(".entry-card .entry-meta-seg--text");
    for (const name of names) name.style.visibility = "hidden";
    return names.length;
  });

/** Takes the gradient stripe off every card, whether it is drawn by the card, by a part of it or by a pseudo-element, keeping its place, and says how many were taken off. */
const hideStripes = (page) =>
  page.evaluate(() => {
    let n = 0;
    const cards = document.querySelectorAll(".entry-card, .entry-card *");
    for (const element of cards) {
      for (const pseudo of [null, "::before", "::after"]) {
        const style = getComputedStyle(element, pseudo);
        if (!/gradient/.test(`${style.backgroundImage} ${style.borderImageSource}`)) continue;
        element.setAttribute("data-no-stripe", "");
        n += 1;
      }
    }
    const sheet = document.createElement("style");
    sheet.textContent = "[data-no-stripe], [data-no-stripe]::before, [data-no-stripe]::after { background-image: none !important; border-image: none !important; }";
    document.head.append(sheet);
    return n;
  });

// The card grid, as the page opens: its results band at the top of the frame, the first row of cards, and the pinned bar.
{
  const page = await open("catalog/", FRAME);
  console.log("catalog/ department names hidden", await hideDepartments(page));
  console.log("catalog/ counts hidden", await hideCount(page));
  console.log("catalog/ stripes taken off", await hideStripes(page));
  await page.evaluate(() => window.scrollTo(0, window.scrollY + document.querySelector(".results-header").getBoundingClientRect().top));
  await page.mouse.move(0, 200);
  await shoot(page, "catalog-grid");
  const titles = await page.evaluate(() => Array.from(document.querySelectorAll(".entry-card h2, .entry-card h3"), (h) => h.textContent.trim()).slice(0, 2));
  console.log("catalog-grid", JSON.stringify({ titles, ...(await rects(page, { band: ".results-header", count: ".results-count", search: ".results-header input", cards: ".entry-card", compare: ".entry-card .compare-toggle", bar: ".filter-bar", filters: ".filter-bar button" })) }));
  await page.context().close();
}

// The submit form at the section that holds the attestation.
{
  const page = await open("submit/", FORM_WINDOW);
  await page.evaluate(() => {
    for (const section of document.querySelectorAll(".form-section")) section.hidden = section.dataset.section !== "data";
    for (const link of document.querySelectorAll("[data-progress-link]")) {
      if (link.dataset.progressLink === "data") link.setAttribute("aria-current", "step");
      else link.removeAttribute("aria-current");
    }
    // The section list holds its place under the page's top once the page has moved this far.
    window.scrollTo(0, window.scrollY + document.querySelector(".progress-rail").getBoundingClientRect().top - 12);
  });
  await page.mouse.move(0, 200);
  await shoot(page, "submit-form", { clip: FORM_CUT });
  const found = await rects(page, { rail: ".progress-rail", links: ".progress-link", heading: "#section-data h2", field: '[data-field="no_pii_attestation"]' });
  const cut = Object.fromEntries(Object.entries(found).map(([name, list]) => [name, list.map(([x, y, w, h]) => [x - FORM_CUT.x, y - FORM_CUT.y, w, h])]));
  console.log("submit-form", JSON.stringify(cut));
  await page.context().close();
}

await browser.close();
