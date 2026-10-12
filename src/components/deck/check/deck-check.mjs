/**
 * The deck's browser check. For every step of a deck it proves the picture
 * is the same however the step was reached: stepped to with its build
 * playing, cut back to, and loaded cold at its address. It also proves that
 * every part a step names exists (the persistent layer's too), that a second
 * press during a build never skips a step and leaves nothing to land late,
 * that a jump to either end lands on the picture that was played to, that the site's page transition never runs, that the notes
 * screen drives the deck, that the on-screen back and forward buttons each move exactly one step (and never also
 * count as a click on the stage, or keep the keyboard's Space for themselves), and it times every build's frames.
 *
 * Playwright is not a dependency of the site. Run it through npx, against a
 * built and started site:
 *
 *   npm run dev (or serve the static build in out/)
 *   npx -y -p playwright@1.63.0 node src/components/deck/check/deck-check.mjs http://localhost:3000/
 *
 * Options: --headed (needed for frame timings that mean anything),
 * --browsers=chromium,webkit, --sizes=1920x1080,1366x768,1280x720.
 * Frame pacing is judged in headed Chromium only; WebKit is checked for
 * correctness.
 */
import { execSync } from "node:child_process";
import { realpathSync } from "node:fs";
import { dirname, join } from "node:path";
import { pathToFileURL } from "node:url";

const args = process.argv.slice(2);
const option = (name, fallback) => args.find((arg) => arg.startsWith(`--${name}=`))?.split("=")[1] ?? fallback;
const url = args.find((arg) => arg.startsWith("http")) ?? "http://localhost:3000/";
const headed = args.includes("--headed");
const browsers = option("browsers", "chromium,webkit").split(",");
const sizes = option("sizes", "1920x1080,1366x768,1280x720").split(",").map((size) => size.split("x").map(Number));

/** Pixels that may differ between two pictures of one step, as a share of the frame, and how far a channel must move to count. */
const TOLERANCE = 0.0005;
const CHANNEL = 16;
/** Longer than any build, in ms: how long to wait before deciding a build cut short left nothing behind it. A click plays a chain of up to 12 s (kit CHAIN.longest), so 12.5 s. */
const LONGEST_BUILD = 12500;

async function loadPlaywright() {
  try {
    return await import("playwright");
  } catch {
    const bin = realpathSync(execSync("command -v playwright", { encoding: "utf8" }).trim());
    return import(pathToFileURL(join(dirname(bin), "index.mjs")).href);
  }
}

const failures = [];
const fail = (where, what) => {
  failures.push(`${where}: ${what}`);
  console.log(`  FAIL ${what}`);
};

/**
 * Opens the deck (at a step's address, when given), passes the gate and waits for the picture to land. The chrome is
 * hidden so it never counts in a picture's difference, unless `chrome` asks for it.
 */
async function open(page, hash = "", { chrome = false } = {}) {
  await page.goto(url + hash);
  if (hash) await page.reload();
  if (!chrome) await page.addStyleTag({ content: ".deck-chrome { display: none !important; }" });
  await page.waitForSelector(".deck-gate__start:not([disabled])");
  await page.keyboard.press("Enter");
  await settled(page);
}

const settled = async (page) => {
  await page.waitForFunction(() => window.__deck?.ready() && !window.__deck.busy());
  // The cut's short fade, and a frame for the last values to paint.
  await page.waitForTimeout(260);
};

/** The share of pixels that differ between two screenshots, counted in the page. */
const difference = (page, a, b) =>
  page.evaluate(
    async ([one, two, channel]) => {
      const pixels = async (data) => {
        const image = new Image();
        image.src = `data:image/png;base64,${data}`;
        await image.decode();
        const canvas = new OffscreenCanvas(image.width, image.height);
        const context = canvas.getContext("2d");
        context.drawImage(image, 0, 0);
        return context.getImageData(0, 0, image.width, image.height).data;
      };
      const [p, q] = [await pixels(one), await pixels(two)];
      if (p.length !== q.length) return 1;
      let differing = 0;
      for (let i = 0; i < p.length; i += 4) {
        if (Math.abs(p[i] - q[i]) > channel || Math.abs(p[i + 1] - q[i + 1]) > channel || Math.abs(p[i + 2] - q[i + 2]) > channel) differing++;
      }
      return differing / (p.length / 4);
    },
    [a.toString("base64"), b.toString("base64"), CHANNEL],
  );

const shot = (page) => page.screenshot({ type: "png" });
const number = (page) => page.evaluate(() => window.__deck.number());
const percent = (share) => `${(share * 100).toFixed(4)}%`;

async function checkSize(browser, name, [width, height]) {
  const where = `${name} ${width}x${height}`;
  console.log(`\n== ${where}${headed ? " (headed)" : ""}`);
  const context = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: 1 });
  await context.addInitScript(() => {
    window.__viewTransitions = 0;
    const start = document.startViewTransition;
    if (start) {
      document.startViewTransition = function (...rest) {
        window.__viewTransitions++;
        return start.apply(this, rest);
      };
    }
  });
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => message.type() === "error" && errors.push(message.text()));

  await open(page);
  const total = await page.evaluate(() => window.__deck.total);
  const interval = await page.evaluate(
    () =>
      new Promise((resolve) => {
        const gaps = [];
        let last = 0;
        const tick = (now) => {
          if (last) gaps.push(now - last);
          last = now;
          if (gaps.length < 40) return requestAnimationFrame(tick);
          resolve(gaps.sort((a, b) => a - b)[20]);
        };
        requestAnimationFrame(tick);
      }),
  );
  const missing = await page.evaluate(() => window.__deck.missing());
  if (missing.length) fail(where, `steps name parts their scenes do not have: ${missing.join(", ")}`);
  else console.log(`  parts: every part a step names is in its scene`);

  // Forward: every build plays, and is timed.
  const forward = [await shot(page)];
  const paced = [];
  for (let n = 2; n <= total; n++) {
    await page.evaluate(() => window.__deck.meter.start());
    await page.keyboard.press("ArrowRight");
    await page.waitForFunction(() => !window.__deck.busy());
    const stats = await page.evaluate(() => window.__deck.meter.stop());
    paced.push({ n, ...stats });
    await page.waitForTimeout(120);
    forward.push(await shot(page));
    if ((await number(page)) !== n) fail(where, `stepping forward landed on ${await number(page)}, not ${n}`);
  }
  await page.waitForTimeout(350);
  const last = await page.evaluate(() => [window.location.hash, window.__deck.hash(window.__deck.total)]);
  if (last[0] !== last[1]) fail(where, `the address is ${last[0]}, not ${last[1]}`);

  // Back: every step is a cut to the picture that was there.
  let worstBack = 0;
  for (let n = total - 1; n >= 1; n--) {
    await page.keyboard.press("ArrowLeft");
    await settled(page);
    const share = await difference(page, forward[n - 1], await shot(page));
    worstBack = Math.max(worstBack, share);
    if (share > TOLERANCE) fail(where, `step ${n} cut back to differs from the step played forward by ${percent(share)}`);
  }
  console.log(`  back:   ${total - 1} steps cut back to, worst difference ${percent(worstBack)}`);

  // A second press during a build finishes it and stops; a held key steps once.
  await page.keyboard.press("ArrowRight");
  await page.keyboard.press("ArrowRight");
  const afterDouble = await page.evaluate(() => [window.__deck.number(), window.__deck.busy()]);
  if (afterDouble[0] !== 2 || afterDouble[1]) fail(where, `two quick presses left the deck on ${afterDouble[0]}${afterDouble[1] ? ", still playing" : ""}, not settled on 2`);
  // Nothing the cut-short build had scheduled may still land: wait out the longest build and look again.
  await page.waitForTimeout(LONGEST_BUILD);
  const shareLate = await difference(page, forward[1], await shot(page));
  if (shareLate > TOLERANCE) fail(where, `a build finished early changed afterwards: step 2 differs from the step played through by ${percent(shareLate)}`);
  await page.keyboard.down("PageDown");
  await page.keyboard.down("PageDown");
  await page.keyboard.down("PageDown");
  await page.keyboard.up("PageDown");
  await settled(page);
  if ((await number(page)) !== 3) fail(where, `a held key moved the deck to ${await number(page)}, not 3`);
  else console.log("  keys:   a press during a build completes it and stops; a held key steps once");
  const pressed = await shot(page);
  const shareSettled = await difference(page, forward[2], pressed);
  if (shareSettled > TOLERANCE) fail(where, `a build finished early differs from one played through by ${percent(shareSettled)}`);

  // Jumps: the far ends of the deck, reached in one move, are the pictures that were played to. This is where a
  // layer that persists across steps (the deck's chrome) would show a state it had only half caught up to.
  for (const [key, n] of [["End", total], ["Home", 1], ["End", total]]) {
    await page.keyboard.press(key);
    await settled(page);
    if ((await number(page)) !== n) fail(where, `${key} moved the deck to ${await number(page)}, not ${n}`);
    const share = await difference(page, forward[n - 1], await shot(page));
    if (share > TOLERANCE) fail(where, `step ${n} jumped to with ${key} differs from the step played forward by ${percent(share)}`);
  }
  console.log("  jumps:  the first and last steps, jumped to, match the steps played forward");

  // Cold: every step loaded at its own address.
  let worstCold = 0;
  for (let n = 1; n <= total; n++) {
    const hash = await page.evaluate((step) => window.__deck.hash(step), n);
    await open(page, hash);
    if ((await number(page)) !== n) fail(where, `${hash} opened on step ${await number(page)}, not ${n}`);
    const share = await difference(page, forward[n - 1], await shot(page));
    worstCold = Math.max(worstCold, share);
    if (share > TOLERANCE) fail(where, `step ${n} (${hash}) loaded cold differs from the step played forward by ${percent(share)}`);
  }
  console.log(`  cold:   ${total} steps reloaded at their addresses, worst difference ${percent(worstCold)}`);

  const transitions = await page.evaluate(() => window.__viewTransitions);
  if (transitions) fail(where, `the site's page transition ran ${transitions} times`);
  else console.log("  route:  no view transition started at any step, address change or reload");

  // Pace. Judged only where the timings are real: a visible Chromium window.
  const judged = headed && name === "chromium";
  const slow = paced.filter((build) => build.p95 > interval * 1.3 || build.worst > 50);
  const p95s = paced.map((build) => build.p95);
  console.log(`  pace:   display ${interval.toFixed(1)} ms; ${paced.length} builds; p95 worst ${Math.max(...p95s)} ms, median ${p95s.sort((a, b) => a - b)[p95s.length >> 1]} ms; worst frame ${Math.max(...paced.map((build) => build.worst))} ms${judged ? "" : " (not judged here)"}`);
  for (const build of slow) {
    const line = `step ${build.n}: p95 ${build.p95} ms, worst ${build.worst} ms over ${build.frames} frames`;
    if (judged) fail(where, `slow build, ${line}`);
    else console.log(`          flagged, ${line}`);
  }
  if (errors.length) fail(where, `page errors: ${[...new Set(errors)].join(" | ")}`);
  await context.close();
}

/** The notes screen asks and the deck decides: one tap is one step, and a double tap is still one. */
async function checkNotes(browser, name) {
  const where = `${name} notes`;
  console.log(`\n== ${where}`);
  const context = await browser.newContext({ viewport: { width: 1280, height: 720 } });
  const page = await context.newPage();
  await open(page);
  const notes = await context.newPage();
  await notes.setViewportSize({ width: 390, height: 844 });
  await notes.goto(`${url.replace(/\/$/, "")}/notes/`);
  await notes.waitForSelector(".deck-notes__place:has-text('1 of')");
  await notes.click(".deck-notes__forward");
  await notes.waitForSelector(".deck-notes__place:has-text('2 of')");
  // Let the build land first: a tap during a build finishes it and stops there.
  await settled(page);
  await notes.dblclick(".deck-notes__forward");
  await notes.waitForSelector(".deck-notes__place:has-text('3 of')");
  await notes.waitForTimeout(400);
  const at = await number(page);
  if (at !== 3) fail(where, `a tap and a double tap on Next left the deck on ${at}, not 3`);
  await notes.keyboard.press("ArrowLeft");
  await notes.waitForSelector(".deck-notes__place:has-text('2 of')");
  const sizes = await notes.evaluate(() => [".deck-notes__forward", ".deck-notes__back"].map((selector) => Math.round(document.querySelector(selector).getBoundingClientRect().height)));
  if (sizes[0] < 64 || sizes[1] < 64) fail(where, `the phone's Next and Back are ${sizes[0]} and ${sizes[1]} px tall`);
  else console.log(`  notes:  a tap is one step, a double tap is one step, keys work from the notes; Next ${sizes[0]} px, Back ${sizes[1]} px tall at 390 wide`);
  await context.close();
}

/**
 * The chrome's back and forward buttons, for a viewer with a mouse: a click on one is one step, back as a cut and
 * forward as a build, and never also the stage's click forward. Playwright clicks a button's centre, which is its
 * chevron, so the click lands on the drawing inside the button. A key after a click still steps the deck.
 */
async function checkButtons(browser, name) {
  const where = `${name} buttons`;
  console.log(`\n== ${where}`);
  const context = await browser.newContext({ viewport: { width: 1280, height: 720 } });
  const page = await context.newPage();
  await open(page, "", { chrome: true });
  const back = 'button[aria-label="Previous slide"]';
  const forward = 'button[aria-label="Next slide"]';
  const wake = async () => {
    await page.mouse.move(600, 300);
    await page.mouse.move(640, 360);
    await page.waitForSelector(".deck:not([data-idle])");
  };
  /** Whether the deck, and a moment later its address, are on step `n`; a failure if not. */
  const at = async (n, what) => {
    await settled(page);
    const now = await number(page);
    if (now !== n) {
      fail(where, `${what} left the deck on ${now}, not ${n}`);
      return false;
    }
    const followed = await page.waitForFunction((step) => window.location.hash === window.__deck.hash(step), n, { timeout: 2000 }).then(
      () => true,
      () => false,
    );
    if (!followed) fail(where, `${what} left the address at ${await page.evaluate(() => window.location.hash)}, not step ${n}'s`);
    return followed;
  };

  for (let n = 2; n <= 4; n++) {
    await page.keyboard.press("ArrowRight");
    await settled(page);
  }
  let good = await at(4, "three steps forward");
  await wake();
  const sizes = await page.evaluate((selectors) => selectors.map((selector) => document.querySelector(selector)?.getBoundingClientRect()), [back, forward]);
  if (sizes.some((box) => !box || box.width < 44 || box.height < 44)) {
    good = false;
    fail(where, `the buttons are ${sizes.map((box) => (box ? `${Math.round(box.width)}x${Math.round(box.height)}` : "missing")).join(" and ")} px, not at least 44 px square`);
  }
  // The stage's own listener hears a click before the button's does, so a click that also counted as the stage's
  // would step forward first and then back, and leave the deck on 4.
  await page.click(back);
  good = (await at(3, "a click on Previous slide from 4")) && good;
  await wake();
  await page.click(forward);
  good = (await at(4, "a click on Next slide from 3")) && good;
  // The button just clicked must not have kept the focus: Space is the deck's, a step forward.
  await page.keyboard.press(" ");
  good = (await at(5, "Space after a click on Next slide")) && good;
  // At the first step the deck stays put, as it does for the keys.
  await page.keyboard.press("Home");
  await settled(page);
  await wake();
  if ((await page.getAttribute(back, "aria-disabled")) !== "true") {
    good = false;
    fail(where, "Previous slide does not say it is unavailable on the first step");
  }
  // Playwright waits forever for an aria-disabled button to be enabled; `force` clicks it anyway, as a person can.
  await page.click(back, { force: true });
  good = (await at(1, "a click on Previous slide at the first step")) && good;
  // Blanked, the screen shows no buttons and offers none to the keyboard.
  await page.keyboard.press("b");
  const gone = await page.waitForSelector(`${back}, ${forward}`, { state: "detached", timeout: 2000 }).then(
    () => true,
    () => false,
  );
  await page.keyboard.press("b");
  if (!gone) {
    good = false;
    fail(where, "the buttons are still on the blanked screen");
  }
  if (good) console.log("  buttons: Previous and Next each move one step, never also the stage's, leave Space to the deck, and go when the screen is blanked");
  await context.close();
}

const playwright = await loadPlaywright();
for (const name of browsers) {
  const browser = await playwright[name].launch({ headless: !headed });
  for (const size of sizes) await checkSize(browser, name, size);
  await checkNotes(browser, name);
  await checkButtons(browser, name);
  await browser.close();
}

console.log(failures.length ? `\n${failures.length} failed:\n${failures.map((line) => `- ${line}`).join("\n")}` : "\nAll deck checks passed.");
process.exit(failures.length ? 1 : 0);
