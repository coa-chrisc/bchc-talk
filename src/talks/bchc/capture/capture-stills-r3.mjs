/**
 * Captures the two stills Part 4 needed for round 3 of the talk
 * (docs/bchc-audit-r3.md, slides 23, 25 and 26) from the public catalog,
 * and prints where the things the scenes point at sit in each one, in the
 * still's own CSS pixels. It sits beside capture-stills.mjs and
 * capture-stills-v1.mjs and leaves their stills alone. A still is shown at
 * the size it was captured, one page pixel to one stage pixel.
 *
 *   catalog-slots      the first row of the catalog's card grid, cut to the
 *                      tops of its three cards, 936 by 148, with every word
 *                      and badge inside the cards hidden (their places kept),
 *                      so the cards read as three empty places and no entry
 *                      can be read, and the site's red-to-blue stripe across
 *                      each card's top hidden too, so the still carries no
 *                      gradient (v2; v1 kept the stripe). The count above the
 *                      grid is outside the cut. Slides 23 and 25 land tools
 *                      in these places.
 *   submit-form-type   the submit form at its question "What kind of
 *                      solution is it?", cut to the question, its hint and
 *                      all nine of its choices, in a window narrow enough
 *                      that the choices sit two to a row under the question
 *                      and the section list is not beside them. Slide 26
 *                      circles four of the choices.
 *
 * Every still is saved in the page's own colours (docs/bchc-brand.md, rule
 * 6). Nothing is typed into the form and nothing is sent. The site's logo
 * image is hidden before any picture is taken.
 *
 * Playwright is not a dependency of the site, and cwebp does the saving.
 * Run it through npx; each still is written under its own version, and a
 * still already saved under its version is left as it is:
 *
 *   npx -y -p playwright@1.63.0 node src/talks/bchc/capture/capture-stills-r3.mjs public
 */
import { execFileSync, execSync } from "node:child_process";
import { existsSync, mkdtempSync, realpathSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { pathToFileURL } from "node:url";

const out = process.argv[2] ?? ".";
const work = mkdtempSync(join(tmpdir(), "bchc-stills-r3-"));
const BASE = "https://big-cities-health-coalition.github.io/use-case-catalog/";
/** The grid shows three cards to a row in a window this wide. */
const GRID_WINDOW = { width: 1280, height: 720 };
/** How far round the three cards the cut reaches, and how much of each card's top it keeps. */
const SLOTS = { pad: 12, keep: 136 };
/** The form puts its choices two to a row, under the question and with no section list beside them, in a window this wide. */
const FORM_WINDOW = { width: 1000, height: 900 };
/**
 * The catalog card's colour stripe, hidden: the site draws it across each
 * card's top, on the card itself or on a layer over it, never on the words
 * inside (which are hidden on their own).
 */
const STRIPE_OFF = `.entry-card::before, .entry-card::after { display: none !important; }
.entry-card { border-image: none !important; background-image: none !important; }`;
/** How far round the question and its choices the cut reaches. */
const FORM_PAD = 16;
/** The question's place in the window once scrolled: this far under the bars the page pins to the window's top (its header and the form's progress). */
const FORM_GAP = 32;

/** Playwright from npx's own install, which is not this site's: found by its command on the path npx sets. */
async function loadPlaywright() {
  try {
    return await import("playwright");
  } catch {
    const bin = realpathSync(execSync("command -v playwright", { encoding: "utf8" }).trim());
    return import(pathToFileURL(join(dirname(bin), "index.mjs")).href);
  }
}

/** Hides the site's logo wherever the page shows it, keeping its place, and says how many were hidden. */
const hideLogos = (page) =>
  page.evaluate(() => {
    const logos = document.querySelectorAll("header img, footer img");
    for (const logo of logos) logo.style.visibility = "hidden";
    return logos.length;
  });

const target = (name, version) => join(out, `${name}.${version}.webp`);

/** A PNG saved as WebP, in its own colours, under the still's versioned name. */
function save(name, version) {
  execFileSync("cwebp", ["-quiet", "-q", "86", join(work, `${name}.png`), "-o", target(name, version)]);
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

const shoot = async (page, name, version, clip) => {
  if (existsSync(target(name, version))) {
    console.log(name, version, "already saved, left as it is");
    return;
  }
  await page.mouse.move(0, 0);
  await page.waitForTimeout(500);
  await page.screenshot({ path: join(work, `${name}.png`), clip });
  save(name, version);
};

// The grid's first three cards, emptied: every word and badge inside each card hidden in place, and the stripe across each card's top hidden; the card itself and its border left as the page draws them.
{
  const page = await open("catalog/", GRID_WINDOW);
  await page.addStyleTag({ content: STRIPE_OFF });
  const cards = await page.evaluate(() => {
    window.scrollTo(0, 0);
    const row = Array.from(document.querySelectorAll(".entry-card")).slice(0, 3);
    for (const card of row) for (const inner of card.querySelectorAll("*")) inner.style.visibility = "hidden";
    return row.map((card) => {
      const box = card.getBoundingClientRect();
      return [box.x, box.y, box.width, box.height].map((n) => Math.round(n));
    });
  });
  const left = cards[0][0] - SLOTS.pad;
  const top = cards[0][1] - SLOTS.pad;
  const clip = { x: left, y: top, width: cards[2][0] + cards[2][2] + SLOTS.pad - left, height: SLOTS.keep + SLOTS.pad };
  await shoot(page, "catalog-slots", "v2", clip);
  console.log("catalog-slots", JSON.stringify({ size: [clip.width, clip.height], cards: cards.map(([x, y, w]) => [x - left, y - top, w]) }));
  await page.context().close();
}

// The form at its question of what kind of solution it is: the question, its hint and every choice.
{
  const page = await open("submit/", FORM_WINDOW);
  const found = await page.evaluate((gap) => {
    const legend = Array.from(document.querySelectorAll('[data-section="about"] legend, [data-section="about"] label, [data-section="about"] p, [data-section="about"] span')).find((element) => element.textContent.trim() === "What kind of solution is it?");
    // Scrolled past the header, so the bars the page pins to the window's top are pinned there, then clear of them.
    window.scrollTo(0, window.scrollY + legend.getBoundingClientRect().top - 400);
    const pinned = Array.from(document.querySelectorAll("body *")).filter((element) => ["fixed", "sticky"].includes(getComputedStyle(element).position) && element.getBoundingClientRect().top < 200 && element.getBoundingClientRect().height > 0);
    const under = Math.max(0, ...pinned.map((element) => element.getBoundingClientRect().bottom));
    window.scrollTo(0, window.scrollY + legend.getBoundingClientRect().top - under - gap);
    const group = legend.closest("fieldset") ?? legend.parentElement;
    const rect = (element) => {
      const box = element.getBoundingClientRect();
      return [box.x, box.y, box.width, box.height].map((n) => Math.round(n));
    };
    const choices = Array.from(group.querySelectorAll("label:has(input)"), (label) => ({ name: label.textContent.trim().replace(/\s+/g, " ").slice(0, 34), at: rect(label) }));
    return { legend: rect(legend), group: rect(group), choices, pinnedBottom: Math.round(under) };
  }, FORM_GAP);
  console.log("pinned bars end at", found.pinnedBottom);
  const [gx, , gw] = found.group;
  const bottom = Math.max(...found.choices.map(({ at: [, y, , h] }) => y + h));
  const clip = { x: gx - FORM_PAD, y: found.legend[1] - FORM_PAD, width: gw + 2 * FORM_PAD, height: bottom + FORM_PAD - (found.legend[1] - FORM_PAD) };
  await shoot(page, "submit-form-type", "v2", clip);
  const inCut = ([x, y, w, h]) => [x - clip.x, y - clip.y, w, h];
  console.log("submit-form-type", JSON.stringify({ size: [clip.width, clip.height], legend: inCut(found.legend), choices: found.choices.map((choice) => ({ name: choice.name, at: inCut(choice.at) })) }));
  await page.context().close();
}

await browser.close();
