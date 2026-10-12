# Using AI in Public Health Practice

The slides for Austin Public Health's talk to the Big Cities Health Coalition Data Modernization Work Group. The deck runs in a web browser. Each click plays one slide's animation, and every slide carries its own words on screen, so you can click through it on your own without a speaker.

Live: https://crypticpy.github.io/bchc-talk/

## Run it on your computer

You need Node.js 20.9 or later.

```sh
npm install
npm run dev
```

Then open http://localhost:3000 and press Start.

## Keys

- Click, Space, the right arrow or a presentation clicker: next slide.
- Left arrow or Backspace: back one slide.
- Home and End: the first slide and the last one. The last slide is the finale, a grid of every slide in the talk.
- Type a slide number, then Enter: jump to that slide.
- O: an overview of every slide.
- N: the speaker notes in a second window. They are also at `/notes/` (http://localhost:3000/notes/ locally) and follow the deck as it moves.
- B or full stop: blank the screen.

Use the browser's own full screen for presenting.

## How it is built

- `docs/bchc-talk-script.md` is the single source for the talk. Every word on screen and every speaker note is read from it, and the tests fail if the slides and the script disagree.
- The talk is drawn as six worlds, one for each part of the script, under `src/talks/bchc/worlds/`. Each world is one picture the size of the stage, and the camera moves across it from slide to slide.
- `src/components/deck/` is the engine that plays the worlds (keys, addresses, the notes window) and the kit of parts the slides are drawn with, in Austin Public Health's colours and the Geist typeface (`docs/bchc-brand.md`).
- `npx vitest run` runs the tests, `npx eslint .` the linter and `npx tsc --noEmit` the type check. `src/components/deck/check/deck-check.mjs` checks every slide in a real browser; its header says how to run it.
- Pushing to `main` builds a static copy of the site and publishes it to GitHub Pages (`.github/workflows/pages.yml`).

The original version on the Above Earth Productions site could be driven from a phone. That remote needs a server, so it is not included here. The keyboard, a clicker and the notes window all work as before.

## Credits

Austin Public Health, for the Big Cities Health Coalition Data Modernization Work Group.
