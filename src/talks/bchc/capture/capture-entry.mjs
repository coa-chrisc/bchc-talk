/**
 * Captures slide 4's opened project from the public catalog, and prints
 * where the parts the slide points at sit in each still, in the still's own
 * CSS pixels. A still is shown at the size it was captured, one page pixel
 * to one stage pixel:
 *
 *   catalog-entry       the top of one project's page, in a window wide
 *                       enough to hold its side panel: who runs it and how
 *                       far along it is, its name and summary, the grid of
 *                       facts (skills, readiness, what it cost to stand up)
 *                       and the contact beside them.
 *   catalog-entry-runs  further down the same page, its "How it's built"
 *                       section to the line that says where it runs.
 *
 * Saved in the page's own colours like the other stills (capture-stills.mjs;
 * docs/bchc-brand.md, rule 6). Nothing is clicked or typed. The eyebrow over
 * the project's name keeps how far along it is and drops the department
 * after it: the catalog's sample entries name made-up departments, and none
 * may be read on a slide. Three things the slide does not point at are
 * hidden, keeping their places, so its labels sit on the plain page and
 * cross nothing: the side panel's "On this page" box, which the top cut
 * would slice through, the "Share & provenance" box under the contact,
 * and the published and updated dates. Any gradient stripe the page draws
 * is taken off by injected CSS, so the stills carry only the page's plain
 * colours. Run it through npx; the stills are written as
 * `<name>.v4.webp`:
 *
 *   npx -y -p playwright@1.63.0 node src/talks/bchc/capture/capture-entry.mjs public
 */
import { execFileSync, execSync } from "node:child_process";
import { mkdtempSync, realpathSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { pathToFileURL } from "node:url";

const out = process.argv[2] ?? ".";
const work = mkdtempSync(join(tmpdir(), "bchc-entry-"));
const PAGE = "https://big-cities-health-coalition.github.io/use-case-catalog/catalog/wastewater-surveillance-trend-alerts/";
const VERSION = "v4";
/** The window: wide enough that the page sets its contact panel beside the facts. */
const WINDOW = { width: 1248, height: 800 };
/** The cut of the page's top, from just over its eyebrow line to just under the facts' second row. */
const TOP = { x: 16, width: 1232, above: 16, height: 468 };
/** The cut of "How it's built", from just over its heading to under "Where it runs", with room for a label under it. */
const RUNS = { x: 16, width: 444, above: 16, below: 60 };

async function loadPlaywright() {
  try {
    return await import("playwright");
  } catch {
    const bin = realpathSync(execSync("command -v playwright", { encoding: "utf8" }).trim());
    return import(pathToFileURL(join(dirname(bin), "index.mjs")).href);
  }
}

function save(name) {
  execFileSync("cwebp", ["-quiet", "-q", "86", join(work, `${name}.png`), "-o", join(out, `${name}.${VERSION}.webp`)]);
}

const { chromium } = await loadPlaywright();
const browser = await chromium.launch();
const context = await browser.newContext({ viewport: WINDOW, deviceScaleFactor: 2, reducedMotion: "reduce" });
const page = await context.newPage();
await page.goto(PAGE, { waitUntil: "networkidle" });
await page.mouse.move(0, 0);
/** The eyebrow reads "In production · <department>": only the stage is kept. */
console.log(
  "eyebrow",
  await page.evaluate(() => {
    const eyebrow = document.querySelector("h1").parentElement.querySelector(".eyebrow");
    eyebrow.textContent = eyebrow.textContent.split("·")[0].trim();
    return eyebrow.textContent;
  }),
);

/** The boxes and the line the slide does not point at hidden, and every gradient on the page taken off, each keeping its place. */
console.log(
  "hidden",
  await page.evaluate(() => {
    const leaf = (pattern) => Array.from(document.querySelectorAll("body *")).filter((element) => element.children.length === 0 && pattern.test(element.textContent.trim()));
    /** The panel a heading heads: its nearest box that holds more than the heading. */
    const panel = (heading) => heading.closest("aside > *, nav, section") ?? heading.parentElement;
    const boxes = [...leaf(/^on this page$/i), ...leaf(/^share & provenance$/i)].map(panel);
    /** The line that holds the published date and the updated one beside it: the parent of the smallest box that starts "Published". */
    const published = Array.from(document.querySelectorAll("main *")).filter((element) => /^Published\s/.test(element.textContent.trim()));
    const dates = published.length ? [published.at(-1).parentElement] : [];
    for (const element of [...boxes, ...dates]) element.style.visibility = "hidden";
    const named = [...boxes, ...dates].map((element) => `${element.tagName.toLowerCase()}.${element.className}`.slice(0, 60));
    let stripes = 0;
    for (const element of document.querySelectorAll("main *, article *")) {
      for (const pseudo of [null, "::before", "::after"]) {
        const style = getComputedStyle(element, pseudo);
        if (!/gradient/.test(`${style.backgroundImage} ${style.borderImageSource}`)) continue;
        element.setAttribute("data-no-stripe", "");
        stripes += 1;
      }
    }
    const sheet = document.createElement("style");
    sheet.textContent = "[data-no-stripe], [data-no-stripe]::before, [data-no-stripe]::after { background-image: none !important; border-image: none !important; }";
    document.head.append(sheet);
    return { named, stripes };
  }),
);

/** Where things sit on the page (not the window), as [x, y, w, h]. */
const found = await page.evaluate(() => {
  const at = (element) => {
    const box = element.getBoundingClientRect();
    return [box.x, box.y + window.scrollY, box.width, box.height].map((n) => Math.round(n));
  };
  /** The cell of the facts grid, or the row of a section, whose label reads `text`. */
  const holder = (text) => {
    const label = Array.from(document.querySelectorAll("dt")).find((dt) => dt.textContent.trim() === text && dt.offsetParent);
    return at(label.parentElement.children.length > 2 ? label : label.parentElement);
  };
  const runsLabel = Array.from(document.querySelectorAll("dt")).find((dt) => dt.textContent.trim() === "Where it runs");
  return {
    eyebrow: at(document.querySelector("h1").previousElementSibling ?? document.querySelector("h1")),
    title: at(document.querySelector("h1")),
    skills: holder("Skills needed to set it up"),
    readiness: holder("Readiness"),
    cost: holder("Cost to stand up"),
    rows: Array.from(document.querySelectorAll("dl")).slice(0, 1).map(at),
    contact: at(document.querySelector("#rail-contact-heading, .rail-contact-heading, [id$=contact-heading]").closest("section, aside, div")),
    build: at(document.querySelector("#section-build")),
    buildHeading: at(document.querySelector("#section-build-heading")),
    runs: [at(runsLabel), at(runsLabel.nextElementSibling)],
  };
});
console.log("page", JSON.stringify(found));

const topY = found.eyebrow[1] - TOP.above;
await page.screenshot({ path: join(work, "catalog-entry.png"), fullPage: true, clip: { x: TOP.x, y: topY, width: TOP.width, height: TOP.height } });
save("catalog-entry");

const runsY = found.buildHeading[1] - RUNS.above;
const runsH = found.runs[1][1] + found.runs[1][3] + RUNS.below - runsY;
await page.screenshot({ path: join(work, "catalog-entry-runs.png"), fullPage: true, clip: { x: RUNS.x, y: runsY, width: RUNS.width, height: runsH } });
save("catalog-entry-runs");

const inTop = ([x, y, w, h]) => [x - TOP.x, y - topY, w, h];
const inRuns = ([x, y, w, h]) => [x - RUNS.x, y - runsY, w, h];
console.log("catalog-entry", JSON.stringify({ size: [TOP.width, TOP.height], eyebrow: inTop(found.eyebrow), title: inTop(found.title), skills: inTop(found.skills), readiness: inTop(found.readiness), cost: inTop(found.cost), contact: inTop(found.contact) }));
console.log("catalog-entry-runs", JSON.stringify({ size: [RUNS.width, runsH], runs: found.runs.map(inRuns) }));
await browser.close();
