# Build your own deck from this repo

This guide takes you from a copy of this repo to your own talk, live on GitHub Pages. You can follow it yourself, or hand it to an AI coding agent along with [working-with-an-ai-agent.md](working-with-an-ai-agent.md). Read [how-a-deck-works.md](how-a-deck-works.md) first: it explains the words used here.

Throughout, `<id>` is a short name for your talk in lower case, such as `flu-season`. The existing talk's id is `bchc`.

## 1. Make your own copy and run it

1. On GitHub, make a new repo from this one: click "Use this template" on https://github.com/crypticpy/bchc-talk, or clone this repo and push it to a new, empty repo of your own.
2. Install Node.js 20.9 or later. The GitHub workflows use Node 24.
3. Install and start it:

   ```sh
   npm install
   npm run dev
   ```

4. Open http://localhost:3000 and press Start. You should see the BCHC talk. Keep it running while you work: it is your working example until your own talk replaces it.
5. Run the tests once, so you know they pass before you change anything:

   ```sh
   npx vitest run
   ```

## 2. Write the script first

Do not draw anything until the words are approved. Every word on screen and every speaker note comes from the script, and the tests hold the slides to it.

### The script document

Write `docs/<id>-talk-script.md` in the same shape as `docs/bchc-talk-script.md`. Anything above the first part heading is free text: say what the talk is for and how to read the script. Then each part and slide looks like this:

```markdown
## Part 1. Why we started (about 5 minutes)

### 1. Title
**On screen:** The title of your talk. Who is giving it, and to whom.
- A first story line: one sentence a reader can take in without a speaker.
- A second story line, if the slide needs one.

**They see:** The title and credit.

**You say:** What the speaker says over this slide, as one paragraph.

### 2. The problem
**On screen:** A short title.
- One story line.

**They see:** One click:
1. Three boxes come up in a row: "Intake", "Review" and "Done".
2. A card moves from one box to the next.
   Labels: Intake / Review / Done

**You say:** The speaker's words.
```

The rules the test reads by:

- A part heading is exactly `## Part N. Name (about M minutes)`, with N a single digit.
- A slide heading is `### N. Name`. The number can carry a letter, such as `36a`. A closing `(new)` or `(two clicks)` is read as a note and left out of the name.
- The **On screen** line is the slide's title. The bullets under it are story lines A and B. A closing `*(click N)*` on a bullet is read as a note.
- **They see** is a paragraph or a numbered list, then any bullets. An indented `Labels:` line lists the words a click puts on the stage, split by ` / `.
- **You say** is one line.
- `&amp;` is read as `&`.
- Under any other `##` heading, the test skips everything until the next part heading, so you can keep notes there.

### The script as data

Mirror the document in `src/talks/<id>/script/`. Copy these files from `src/talks/bchc/script/` and change them:

- `types.ts`: set `WORLDS` to your world ids, in the order you will show them. Keep `Picture` and `Step` as they are.
- One file per part, such as `part-1-why-we-started.ts`, exporting a list of `Picture` entries. Copy every field word for word from the document. Each picture's `steps` is usually `[{ id: "play", show: [...] }]`, where `show` lists that click's labels in the order they arrive.
- `index.ts`: join the parts into `SCRIPT` and list the part names in `PARTS`.
- `find.ts`: copy it unchanged.
- `script.test.ts`: copy it, then change the path it reads to `docs/<id>-talk-script.md` and replace the BCHC-specific lists described below.

### The word-for-word test

`script.test.ts` parses your Markdown the way a person reads it and compares every picture's part, number, name, On screen, story lines, You say and They see with `SCRIPT`. If you change a word in one place and not the other, the test fails and shows the difference. Change the document first, have it approved, then change the `.ts` file to match.

In the BCHC copy, these lists are specific to that talk. Replace them with your own:

- the count in `toHaveLength(50)`;
- `PLAN`, every picture id and its step ids in order;
- `WORLD_OF_PART`, which world each part is drawn in;
- the two-click slides (19 and 27) and the total of 52 clicks;
- `LONG_STORY`, the story lines allowed past 100 characters;
- `GITHUB_TERMS_SAID` and the "pull request" or "fork" rule;
- the six-steps test and the rule that only slide 44 has no story line;
- `OFF_SCRIPT`, labels that are not the slide's own words (the BCHC catalog's address).

### Rules the tests enforce

These are the rules a test fails on today. Each is in the file named. The word rules in `script.test.ts` are the house style of the BCHC talk: keep them unless you have a reason not to.

In `src/talks/bchc/script/script.test.ts`:

- The document and the `.ts` script match, word for word, and the part names match `PARTS`.
- Every `Labels:` entry is on that picture's clicks, in order.
- Picture ids are unique and in kebab case (they appear in the address). Step ids are kebab case and unique within their picture.
- Parts run in order and none is empty. Each picture is in its part's world, and every world holds a picture.
- One click per picture, except the listed two-click slides.
- No empty strings.
- No em dashes or en dashes.
- None of these words: leverage, seamless, delve, tapestry, robust, game-changing, cutting-edge, unlock, empower.
- No format words (PowerPoint, slide deck, slideshow) before the last part.
- American spelling (no colour, organise, centre, catalogue, whilst, towards and the like).
- No "journey", "at the end of the day", "simply" or exclamation marks.
- Two to nine spelled out, numerals from 10 (dates excepted).
- Every On screen line starts with a capital letter.
- A click's labels are the picture's own words, from its On screen, You say or They see.
- A label is at most 60 characters, with no stray spaces.
- At most two story lines per picture. Each is a sentence (capital letter, ends with a period) and at most 100 characters, except the listed long ones.

In `src/talks/bchc/deck.test.ts`:

- The deck's worlds are in `WORLDS` order, and every script step appears once, in order, in its picture's world.
- Each step's overview title is its slide's number and name, and its speaker note is the script's You say.
- Every world compiles.
- No persistent layer and no backdrop.
- Only the title and close slides are navy.

In `src/talks/bchc/worlds/flow.test.ts`:

- The stage is never still for more than `CHAIN.still` (3 s) inside a click, in any world.

In each world's own `src/talks/bchc/worlds/<world>/world.test.ts` (most worlds also have per-slide tests beside it):

- Each click finishes inside `CHAIN.longest` (12 s), with the 0.6 s arrival fade counted on a world's first step (all six worlds).
- Every key a step names is on the stage (`catalog`, `build`, `sharing` and `start`; `deck-check.mjs` checks every world).
- Only script words are on the stage, and the scene files type no words of their own (checked in `catalog`, `build` and `sharing`).
- Orange only through the human mark and the word "Approved"; deep green only on the passed tick; no literal colours and no hue names; no vendor colours (`strayTokens` and `VENDOR_COLOURS` from `kit/palette.ts`).
- No gradients or glows, and nothing moved by a timer, by chance or by a CSS transition (checked in `catalog`, `build` and `sharing`).

In `src/components/deck/forbidden.test.ts`, for every file under `src/components/deck` and `src/talks`:

- No CSS `filter` or `backdrop-filter`, no `mix-blend-mode`, the same not set from script, and no SVG `<filter>` or `<fe...>` elements. These repaint whole layers and slow a laptop down.

In `src/components/deck/kit/palette.test.ts`:

- The five hue names appear in no file under `src/` except `kit.css`. The test also expects more than 100 source files under `src/`.
- The hue, role and tint values are exactly the ones listed, and the navy slides change only the declared tokens.

In `src/talks/bchc/frame.test.ts`: the logo, footer and number sit in the stage's 64 px edge and keep clear of the deck's counter.

In the kit's own tests (`src/components/deck/kit/*.test.ts`): the story band positions (`story.test.ts`), the title's green rule (`text.test.ts`), glyph sizes and colours (`glyphs.test.ts`) and the kit's layout helpers.

## 3. Build one world at a time

Group your slides into worlds. A world is a set of slides that share one stage; most talks have one per part. Build them one at a time, and get each one reviewed before you start the next (see [working-with-an-ai-agent.md](working-with-an-ai-agent.md)).

For a world called `intro`, in `src/talks/<id>/worlds/intro/`:

1. **Layout** (`layout.ts`). Decide where every part sits, in stage pixels on the 1920 by 1080 stage, with `box()`. Read the words from the script with `shown(pictureId, stepId)` and `storyOf(pictureId)`. Give every part a key, picture id first: `problem.title`, `problem.card.0`.
2. **Scene** (`scene.tsx`). Draw the parts with the kit (see [kit-reference.md](kit-reference.md)) inside one `Plane`. Pass each part its key as `id`. For plain SVG or HTML you draw yourself, put the key on the element as `data-build`. Put the story lines in with `Story`, using `storyId(pictureId)` as its id. Type no words here: take them from the layout. Put styles in an `intro.css` next to it, using only the kit's tokens.
3. **Steps** (`steps.ts`). Write each picture's click with `picture(pictureId, { play: { moves } })` from `worlds/steps.ts`, and the moves with the kit's verbs. Write a click as a chain of beats with `chain()`, so nobody adds up seconds by hand. Bring story lines up with `story(pictureId, 0)` and `story(pictureId, 1)`. Every part a step moves needs a starting value, which the verbs give; with `to()`, give an `off` value.
4. **World** (`world.ts`). Export one `WorldEntry`:

   ```ts
   export const introEntry: WorldEntry = {
     title: worldTitle("intro"),
     world: { id: "intro", Scene, steps: [...introSteps] },
     copy: copyFor(picturesOf("intro")),
   };
   ```

5. **Tests** (`world.test.ts`). Copy `src/talks/bchc/worlds/start/world.test.ts` and its `harness.ts`, and keep the general checks: it compiles, every click within 12 s, only parts the stage has, only script words, only the kit's colours.

Copy `src/talks/bchc/worlds/steps.ts` and `flow.test.ts` once, unchanged, into `src/talks/<id>/worlds/`.

### Register it in the deck

Write `src/talks/<id>/deck.ts`, modelled on `src/talks/bchc/deck.ts`:

```ts
export const deck: DeckDef = {
  id: "<id>",
  title: "Your talk's title",
  notesPath: withBase("/notes/"),
  Frame,
  worlds: [introEntry],
};
```

Add each world to `worlds` as you build it, in `WORLDS` order. Copy `src/talks/bchc/deck.test.ts` and change its talk-specific checks (which slides are navy).

To see your deck, point `src/app/talk.tsx` at it: change `import { deck } from "@/talks/bchc/deck"` to `"@/talks/<id>/deck"`. Change it back if you need to compare with the BCHC talk.

### The frame and the brand

- **Frame.** Copy `src/talks/bchc/frame.tsx`, `frame.css` and `frame.test.ts`. Change `LOGO`, `LOGO_WHITE` and `FOOTER`, and put your logo files in `public/brand/`. Build every image path with `withBase()`.
- **Typeface.** It is set in `src/app/layout.tsx` with `next/font` as `--font-geist`, and the kit reads it through `--dk-face` in `kit.css`.
- **Colours.** They are in `src/components/deck/kit/kit.css`. The ground, word and line colours are `--dk-night`, `--dk-paper` and the rest; the five hues are named only there, and scenes use role names such as `--dk-process`. If you change the palette, change the expected values in `src/components/deck/kit/palette.test.ts` to match, and the role names in `kit/palette.ts` if you rename roles.
- **Rules to keep.** One orange mark for "a person decides", one deep green for "passed", no gradients, glows or filters, text at 32 px or more and labels at 26 px or more. The tests above hold most of these.

## 4. Run the gates

Run all of these before you call a world done.

```sh
npx vitest run
npx eslint .
npx tsc --noEmit
```

The same three run in CI on every push and pull request (`.github/workflows/ci.yml`).

Then check the deck in real browsers. Start the site with `npm run dev` (or serve the static build in `out/` after `npm run build`), and in another terminal run:

```sh
npx -y -p playwright@1.63.0 node src/components/deck/check/deck-check.mjs http://localhost:3000/
```

It proves every step looks the same when clicked to, stepped back to and loaded cold, that every part a step names exists, that a second click during a build skips nothing, that jumps to either end land right, that the notes view drives the deck, and that the back and forward buttons move one step each. Options:

- `--browsers=chromium,webkit` (the default runs both);
- `--sizes=1920x1080,1366x768,1280x720` (the default runs all three);
- `--headed` only when you want frame timings that mean something. Otherwise it runs headless.

### Recapture the finale

If your last slide shows every slide as a grid, as the BCHC talk's does, recapture the stills once every world is done. With the site running:

```sh
npx -y -p playwright@1.63.0 node src/talks/bchc/worlds/close/capture-finale.mjs http://localhost:3000/ public/finale --version=v10 --manifest
```

- It needs `ffmpeg` and `cwebp` on your machine, and Node 22.18 or later (`finale-pictures.mjs` loads the script's `.ts` part files directly).
- Always pass `--version`, and use a new one each time (the default in the script is `v6`; `finale.json` is on `v10`). A new name stops browsers showing old stills.
- `--manifest` writes the list into `close/finale.json`, which the grid reads.
- `--steps=3,9,14` captures only the step numbers you name.
- Its header says to serve the site with `next start`. This site is a static export, so `next start` does not serve it: use `npm run dev` or serve `out/`.

For your own talk, copy the `close` world with its two `.mjs` files. They find the script by a relative path (`../../script`), so only the command changes: run `src/talks/<id>/worlds/close/capture-finale.mjs`.

## 5. Deploy to GitHub Pages

`.github/workflows/pages.yml` builds and publishes the site on every push to `main`, and can be run by hand from the Actions tab. It runs `npm run build` with `NEXT_PUBLIC_BASE_PATH: /bchc-talk`, adds `out/.nojekyll`, and deploys `out/`.

1. In your repo's Settings, under Pages, set the source to GitHub Actions.
2. A project site lives at `https://<user>.github.io/<repo>/`, so the base path must be `/<repo>`. If your repo is not called `bchc-talk`, change `NEXT_PUBLIC_BASE_PATH` in `pages.yml` to `/<your-repo>`. If you rename the repo later, change it again.
3. `next.config.ts` reads the same variable as Next's `basePath`, so links made with `next/link` and the router are right. Everything else must go through `withBase()` from `src/lib/base-path.ts`: an image's `src`, `window.open`, the notes path, and any URL you put together by hand. Without it, the site works locally and breaks on Pages.
4. Locally the variable is empty, so `npm run dev` serves at `/`.

The build is a static export (`output: "export"` in `next.config.ts`). There is no server, so the phone remote is not included.

## 6. Replace the BCHC talk safely

Build your talk next to the BCHC one, switch `src/app/talk.tsx` to it, and get all the gates green before you delete anything. One test depends on the order: `palette.test.ts` expects more than 100 source files under `src/`, and without `src/talks/bchc/` there are 96. So add your own talk first, then delete the old one.

Every place outside `src/talks/bchc/` that names the BCHC talk, found with:

```sh
grep -rniI "bchc\|Big Cities\|Austin Public Health" --exclude-dir=node_modules --exclude-dir=.next --exclude-dir=out --exclude-dir=.git --exclude-dir=docs -l .
```

| File | What to change |
|---|---|
| `src/app/talk.tsx` | The deck import, to `@/talks/<id>/deck` |
| `src/app/layout.tsx` | The page title in `metadata`, and the comment on the typeface |
| `src/app/notes/page.tsx` | The notes page title, "Speaker notes: Big Cities Health Coalition talk" |
| `src/app/globals.css` | A comment naming Austin Public Health's colours |
| `package.json`, `package-lock.json` | The `name`, `bchc-talk` (run `npm install` after changing `package.json`) |
| `next.config.ts`, `src/lib/base-path.ts` | Comments naming `/bchc-talk` |
| `src/lib/base-path.test.ts` | Example strings with `/bchc-talk`; the test passes either way |
| `.github/workflows/pages.yml` | `NEXT_PUBLIC_BASE_PATH` |
| `src/components/deck/kit/kit.css`, `kit/palette.ts` | The palette and role names, if your brand differs, with `kit/palette.test.ts` to match |
| Kit comments in `verbs.ts`, `tokens.ts`, `story.tsx`, `palette.ts`, `kit.css` | They cite `docs/bchc-*.md` as the reason for a rule. Leave them, or point them at your own docs |
| `src/components/deck/engine/*.test.ts` | Use `bchc` as a sample deck id. Nothing to change |
| `public/` | The catalog stills at the root (`catalog-*.webp`, `submit-form-type.v2.webp`), `public/brand/` and `public/finale/` |
| `docs/bchc-*.md` | The BCHC talk's script and design history. Keep them for reference or remove them |
| `README.md` | Describe your talk |

Then delete `src/talks/bchc/`, and run every gate in section 4 again. Search once more to confirm nothing still imports it:

```sh
grep -rn "talks/bchc" src
```
