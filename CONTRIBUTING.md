# Contributing

Thank you for helping. A few things to know before you open a pull request.

## Run the checks first

Every pull request runs the same three checks in CI (`.github/workflows/ci.yml`). Run them locally and make sure they pass:

```sh
npx vitest run
npx eslint .
npx tsc --noEmit
```

If you changed anything that moves on screen, also run the browser check with the site running (`npm run dev`):

```sh
npx -y -p playwright@1.63.0 node src/components/deck/check/deck-check.mjs http://localhost:3000/
```

## Keep the script and its code in step

The script document (`docs/bchc-talk-script.md`) and the script code (`src/talks/bchc/script/*.ts`) must match word for word. `src/talks/bchc/script/script.test.ts` fails if they differ. Change the document first, then the code to match. The same applies to a talk of your own: `docs/<id>-talk-script.md` and `src/talks/<id>/script/`.

## The BCHC talk's content

The BCHC talk's slide content (its words, pictures and story) belongs to its owner at Austin Public Health. Pull requests that fix bugs in the engine or the kit, or improve the guides in `docs/`, are welcome. Please do not change the talk's words or slides in a pull request; open an issue to suggest a change instead.

## Where to start

[docs/README.md](docs/README.md) lists the guides. [docs/how-a-deck-works.md](docs/how-a-deck-works.md) explains how the pieces fit together, and [docs/working-with-an-ai-agent.md](docs/working-with-an-ai-agent.md) lists the rules every change must keep.
