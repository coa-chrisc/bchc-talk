# How a deck works

This page explains how the deck in this repo is put together, from the words of the talk to what the browser plays. Read it before you build your own deck, or before you hand the repo to an AI coding agent. The live deck is at https://crypticpy.github.io/bchc-talk/.

Every path below is in this repo. The engine and the kit, under `src/components/deck/`, can be shared by any talk. Everything under `src/talks/bchc/` belongs to this one talk.

## The model in one picture

```
docs/bchc-talk-script.md          the approved script, in plain Markdown
        |   (script.test.ts checks the two match, word for word)
        v
src/talks/bchc/script/*.ts        the same script as data: Picture, Step
        |   shown(), storyOf()
        v
worlds/<world>/layout*.ts         where each part sits, and which words it carries
        |
        v
worlds/<world>/scene*.tsx         the drawing: kit parts, each with a data-build key
        |
        v
worlds/<world>/steps*.ts          what each click moves, written with the kit's verbs
        |
        v
worlds/<world>/world.ts           one WorldEntry: Scene + steps + speaker notes
        |
        v
src/talks/bchc/deck.ts            DeckDef: the worlds in order, the frame, the notes path
        |
        v
src/components/deck/engine/       compiles every step to a fixed state, plays clicks,
                                  reads keys, writes the address, runs the notes view
```

## The script is the single source

The talk's words live in one place: `docs/bchc-talk-script.md`. Every slide in it has three fields:

- **On screen:** the title, then up to two story lines as bullets.
- **They see:** what the animation shows. An indented `Labels:` line lists the words a click puts on the stage.
- **You say:** what the speaker says. It becomes the speaker's note.

The same words are kept as data in `src/talks/bchc/script/`:

- `types.ts` defines `Picture` (one slide) and `Step` (one click). A `Picture` has `id`, `number`, `part`, `world`, `name`, `show` (On screen), `say` (You say), `see` (They see), `story` (the story lines) and `steps`. A `Step` has an `id` and `show`, the labels that click puts on the stage, in the order they arrive.
- `part-1-the-catalog.ts` to `part-7-agentic-presenting.ts` each export a list of pictures. `index.ts` joins them into `SCRIPT` and exports `PARTS`, the part names.
- `find.ts` is how scenes read words. `shown(pictureId, stepId)` returns a step's labels, `storyOf(pictureId)` its story lines, and `pictureOf()` and `stepOf()` the whole entry. `breakAfter(text, ...words)` splits a line after words you name, and fails if the script changes under it.

`script/script.test.ts` reads the Markdown and fails if any word differs from the `.ts` files. Scenes never type their own words: they take them from the script through `shown()` and `storyOf()`, and the world tests check that no other words reach the stage.

A few literal strings that are not script words, such as the catalog's web address (`ADDRESS`), live in `part-1-the-catalog.ts` with a comment saying why.

## One click plays a whole picture

A picture (a slide) usually has one step, `play`. One click plays every beat of it in a chain: the title comes up, the drawing builds, the story lines rise. A slide takes two clicks only when the audience should sit on a half-finished picture. In this talk that is slide 19 (`plan`, then `work`) and slide 27 (`grow`, then `outside`).

The kit's `chain()` (in `src/components/deck/kit/verbs.ts`) turns a list of beats into one step's moves. Each beat starts after the one before it has landed, plus a short hold (`HOLD.gap`, 0.5 s). A beat with `with: true` starts with the beat before it instead. The house limits are in `src/components/deck/kit/tokens.ts`: a click finishes inside `CHAIN.longest` (12 s), and the stage is never still for more than `CHAIN.still` (3 s) inside a click.

If you click while a build is still playing, the build jumps to its end. The next click moves on.

## Worlds and the deck definition

A world is one stage that holds several slides that belong together. This talk has six, listed in `WORLDS` in `script/types.ts`: `catalog`, `build`, `sharing`, `releasing`, `start` and `close`. Each lives in `src/talks/bchc/worlds/<world>/`.

The types are in `src/components/deck/engine/types.ts`:

- `DeckDef` is the whole talk: `id`, `title`, `notesPath`, `worlds`, and the optional `Frame`, `Backdrop` and `chrome`.
- `WorldEntry` is one world as the deck lists it: `title` (its name in the overview), `world`, and `copy` (each step's title and speaker note).
- `WorldDef` is `id`, `Scene` (a React component), `steps`, and the optional `plane`, `camera` and `anchors`.
- `StepDef` is `id`, `moves`, and the optional `chrome` and `ground` (`"navy"` for the title and close slides).

`src/talks/bchc/deck.ts` builds the `DeckDef`:

```ts
export const deck: DeckDef = {
  id: "bchc",
  title: "Using AI in Public Health Practice",
  notesPath: withBase("/notes/"),
  Frame,
  worlds: [catalogEntry, buildEntry, sharingEntry, releasingEntry, startEntry, closeEntry],
};
```

`src/app/talk.tsx` hands this deck to the engine's `Deck` and `NotesView` components. `src/app/page.tsx` serves the deck, and `src/app/notes/page.tsx` serves the notes view.

## Layout, scene and steps

Each world splits its work into a few kinds of file. The `start` world is a good one to read first.

- **Layout** (for example `worlds/start/layout-ask.ts`): plain numbers and words. Where each part sits on the 1920 by 1080 stage (`box()` from the kit), and which script words it carries (`shown("ask", "play")`). Each part gets a key, such as `ask.card.0`.
- **Scene** (`scene-ask.tsx`): the drawing. It places kit parts (`SetText`, `Block`, `Part` and the rest) and plain SVG, and puts each part's key on it as a `data-build` attribute. The world's `scene.tsx` joins every picture's scene into one `Plane`.
- **Steps** (`steps-ask.ts`): what each click moves, written with the kit's verbs (`show`, `rise`, `draw`, `fill`, `to` and the rest) and its tokens (`DUR`, `EASE`, `STAGGER`, `HOLD`). Steps name parts only by key.
- **World** (`world.ts`): one `WorldEntry` that gathers the scene, every steps file, and the speaker notes.

`src/talks/bchc/worlds/steps.ts` holds the helpers every world shares:

- `picture(pictureId, beats, { ground })` returns a picture's steps in the script's order. It throws if you give a step the script does not have, or leave one out.
- `stepId(pictureId, id)` gives a step's id in its world, such as `ask.play`.
- `story(pictureId, 0 | 1, opts)` brings up story line A or B, and throws if the script gives the picture no such line.
- `picturesOf(world)`, `copyFor(pictures)` and `worldTitle(world)` give a world its pictures, its speaker notes (title "N. Name", note from You say) and its name in the overview.

## Data-build keys

A key ties a step to the thing it moves. The scene writes `data-build="ask.card.0"` on an element, and a step moves `"ask.card.0"`. The engine finds the element with the selector `[data-build="ask.card.0"]`.

- Keys are dotted, picture id first, so they never collide inside a world.
- If a step names a key the scene does not have, the start screen lists it as a warning and `window.__deck.missing` returns it. The world tests fail on it too.
- Kit parts that hold several pieces build their own keys from yours. For example, `Counter` adds `<id>.box`, and `storyKeys(id, 2)` gives `<id>.a` and `<id>.b`.

## Story lines A and B

Each slide can carry up to two story lines, so it makes sense with no speaker. They are the bullets under On screen in the script.

- The kit's `Story` part (`src/components/deck/kit/story.tsx`) sets them in a band under the title. The band is `"one"`, `"two"` or `"three"` (under a title of that many lines) or `"foot"` (at the bottom of the stage).
- Line A is `<storyId>.a` and line B is `<storyId>.b`. In this talk the story id is `story.<picture>`, from `storyId()` in `worlds/steps.ts`.
- A step brings a line up with `story(pictureId, 0)` or `story(pictureId, 1)`, which uses the kit's `tell` verb. Line A lands with the beat it explains and line B with its own. Both stay up to the end of the click.

## Compiled step states

The engine never works out a frame by playing animations forward. Before the talk starts, `compile()` in `src/components/deck/engine/compile.ts` turns each world's steps into a list of fixed states:

- The baseline (state 0) is each part's first `off` value: how it looks before anything happens.
- State n + 1 is the baseline with every move up to and including step n applied.
- If a step moves a property that has no starting value, compiling throws: `"key" moves "prop" with nothing to start from. Give the move an off value.` The world tests and `deck.test.ts` compile every world, so this shows up as a failing test.

The driver (`engine/driver.ts`) has two ways to reach a step:

- `set(step)` writes the step's state at once, with no tween.
- `play(step)` sets the step before it, plays the tweens, then sets the step's own state.

The director (`engine/director.ts`) uses `play` only for a single step forward. Going back, jumping, and reduced motion all use `set` under a 0.14 s fade. So going back, jumping to a slide, and loading an address cold all land on exactly the same frame as clicking through to it. `src/components/deck/check/deck-check.mjs` checks this in a real browser.

Clicking forward into another world fades the old world out over 0.6 s, then fades the new one in over 0.7 s while its first step starts to play. That is why the world tests count 0.6 s into the first click of each world.

## The frame

The frame is what stays on every slide: here, the Austin Public Health logo, the footer line and the slide number. It is the deck's `Frame` component, `src/talks/bchc/frame.tsx`, styled by `frame.css`. The engine gives it `number`, `total` and `ground`. On a navy step it shows only the white logo. `frame.test.ts` checks that it stays inside the stage's 64 px edge and clear of the deck's counter.

This talk uses no `Backdrop` and no persistent `chrome` layer (`engine/chrome.ts`). `deck.test.ts` checks that both are absent.

## The start screen

When the deck loads it shows a start screen (`engine/panels.tsx`, with checks from `engine/readiness.ts`). It lists:

- typefaces loaded, pictures decoded and canvases allocated;
- the display's refresh rate;
- whether the browser offers a screen wake lock;
- any step that names a part its scene does not have.

It also has a "Reduce motion (every step cuts)" checkbox. The Start button turns on once everything is ready. Enter or any next key also starts the talk.

## Addresses

Every step has an address in the page's hash (`engine/deck-url.ts`):

- `#/start/ask.play` is the start world, step `ask.play`.
- `#/start` is the start world's first step.
- A number in place of a step id is read as the step's position in its world.
- An unknown step id lands on the world's first step.

The deck rewrites the address 200 ms after a move, with `history.replaceState`, so the browser's back button does not fill up with slides. Paste an address to open the talk on that slide. `window.__deck.hash(n)` gives the address of step number n.

## Keys and controls

From `engine/keys.ts` and `engine/use-deck-input.ts`:

| Key | What it does |
|---|---|
| Right arrow, Down arrow, Space, Page Down, Enter, a click or a tap | Next |
| Left arrow, Up arrow, Page Up, Backspace | Back |
| Home, End | First step, last step |
| A number, then Enter | Jump to that step |
| O | Overview of every step |
| N | Open the notes view in a second window |
| B or full stop | Blank the screen |
| H | Rehearsal readout (frame timings) |
| Escape | Close the overview or the blank screen |

A sideways swipe works on a touch screen. A key held down moves once, not over and over. The deck does not call the browser's fullscreen API: use the browser's own full screen.

## The notes view

`/notes/` opens the speaker's view (`engine/notes-view.tsx`). It talks to the deck in the same browser over a BroadcastChannel, so it follows the deck and can drive it. It shows the current note, what comes next, the talk's clock and the time of day, with Back, Next, Blank screen and Reset clock buttons. Printing it gives the whole script.

The engine can also pair a phone as a remote, but that needs a server route (`remotePath`). `src/app/talk.tsx` passes none, because GitHub Pages serves files only. So the phone remote is not included here.

## The finale stills

The last slide (slide 44, the `close` world) shows a grid of every slide in the talk. Each tile is a small still image captured from the deck itself:

- `src/talks/bchc/worlds/close/capture-finale.mjs` opens each slide's last step cold at its address in a headless browser, takes a 1920 by 1080 screenshot, and saves a 352 by 198 WebP to `public/finale/NN.<version>.webp`. Slide 1 is also saved whole, at 1920 by 1080, as `hero.<version>.webp`.
- `finale-pictures.mjs` reads the list of slides from the script.
- `finale.json` records the version and which stills exist. `close/layout.ts` reads it, and draws a white tile with a navy rule for any still that is missing.

Recapture the stills whenever a slide changes, under a new version name so browsers do not show old ones. How to run it is in [build-your-own-deck.md](build-your-own-deck.md).

## Where to go next

- [build-your-own-deck.md](build-your-own-deck.md): make your own talk from this repo, step by step.
- [working-with-an-ai-agent.md](working-with-an-ai-agent.md): how to run the work with an AI coding agent.
- [kit-reference.md](kit-reference.md): every kit part, verb and token.
