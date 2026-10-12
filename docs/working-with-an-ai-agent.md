# Working with an AI coding agent

The BCHC talk in this repo was built by AI coding agents, with a person approving the words and reviewing the result. This page sets out the process that worked, the prompts to start it, and the rules an agent must keep. It is written for both of you: the person who owns the talk, and the agent they hand the repo to.

If you are the agent, also read [how-a-deck-works.md](how-a-deck-works.md) and [kit-reference.md](kit-reference.md) before you write code. `AGENTS.md` at the repo root applies too: this repo uses a recent Next.js, so read the matching guide in `node_modules/next/dist/docs/` before you write Next.js code.

## The process

### 1. Words first

Write the script before anything is drawn, and get the owner's approval on it. The script is `docs/<id>-talk-script.md`, in the shape described in [build-your-own-deck.md](build-your-own-deck.md). For each slide it gives the title and story lines (On screen), what the animation shows (They see), and what the speaker says (You say).

- The owner tells the story; the agent drafts and the owner corrects. Start from the owner's own material: their notes, past decks, the documents the talk is about.
- Settle the outline (the parts and what each one is for) before writing slides.
- The deck will often be shared with no speaker, so every slide must make sense from its title and story lines alone.
- Once the script is approved, mirror it in `src/talks/<id>/script/` and run `npx vitest run src/talks/<id>/script` until the word-for-word test passes.

Changing words later is fine, but always change the document first, get it approved, then change the code.

### 2. One world at a time

Build one world (one group of slides), finish it, and review it before starting the next. Smaller pieces are easier to review, and the lessons from the first world make the rest go faster. Each world has its own files, so two agents can work on two worlds at once without touching the same file, as long as only one of them edits shared files (`deck.ts`, `kit/`, `worlds/steps.ts`).

A world is ready for review when:

- `npx vitest run`, `npx eslint .` and `npx tsc --noEmit` pass;
- `deck-check.mjs` passes for that world in Chromium and WebKit at the three sizes;
- the agent has watched every slide of it play, headless, and compared it with the script's They see.

### 3. Review gates, per section

Before a world counts as done, run three reviews on it. Give each to a fresh agent that did not build it. The prompts are below.

1. **Copywriter.** Reads every word on screen and in the notes for that section against the script and the house style.
2. **Motion design panel.** Steps through each slide and judges whether the motion explains the idea, in order, at a pace an audience can follow.
3. **Cold viewer.** Sees the slides with no script and no speaker, and says what each one means. If a slide only makes sense with the speaker, it goes back.

Fix what they find, then run the gates again.

### 4. Code review

After the review gates, a separate agent reviews the code changes: tests that prove behaviour, no copied magic numbers, files kept under about 500 lines, nothing outside the files the work owns, every rule below kept.

### 5. Recapture the finale

If the last slide shows every slide as a grid, recapture its stills after every round of changes, with a new version name (see [build-your-own-deck.md](build-your-own-deck.md)).

### 6. The owner reviews the finished preview

Push the work and let the deploy build. The owner reviews the live deck, from start to finish, in a browser: not stills, not screenshots, not one slide at a time. Their notes start the next round, and the round goes through the same gates.

## A brief to start a new deck

Paste this to the agent, with the parts in angle brackets filled in.

```text
You are building an animated, click-to-play talk in this repo. Each click plays
one whole slide. The repo holds a finished example talk (BCHC) under
src/talks/bchc/, live at https://crypticpy.github.io/bchc-talk/.

Read these first, in order:
- docs/how-a-deck-works.md
- docs/build-your-own-deck.md
- docs/working-with-an-ai-agent.md (the house rules)
- docs/kit-reference.md
- AGENTS.md, then the Next.js guide it points to before writing Next.js code

The talk:
- Title: <title>
- Audience: <who will see it, and whether it will be shared with no speaker>
- What it is for: <the one thing the audience should leave with>
- Length: <minutes>
- Source material: <paths or links to notes, past decks, documents>
- Brand: <colours, typeface, logo files, footer text, or "keep the current kit">

Step 1 only, for now: draft docs/<id>-talk-script.md in the shape of
docs/bchc-talk-script.md. Propose the parts first, with one line on what each
is for, and stop for my approval before writing slides. Use plain words and
short sentences. Invent no numbers, names or claims that are not in the
source material. Every slide needs a title and at most two story lines that
make sense with no speaker.

Do not draw anything until I approve the script. After that, we build one
world at a time, and each world goes through the review gates in
docs/working-with-an-ai-agent.md before the next one starts.
```

When the script is approved, start each world with:

```text
The script is approved. Build the <world> world: slides <numbers>. Follow
docs/build-your-own-deck.md section 3. Own only src/talks/<id>/worlds/<world>/
and the line that adds it to src/talks/<id>/deck.ts. Run npx vitest run,
npx eslint ., npx tsc --noEmit and deck-check.mjs (headless, Chromium and
WebKit, three sizes) and report the raw results. Then watch every slide play
and compare it with the script's They see, and tell me where they differ.
```

## Review gate prompts

Give each prompt to a fresh agent. Fill in the section and slide numbers.

### Copywriter

```text
Review the words in slides <numbers> of this talk, as a copywriter for a
first-time visitor. Read docs/<id>-talk-script.md for these slides, then step
through them in the running deck (npm run dev, http://localhost:3000, headless
browser) and read every word on screen.

Check:
- Every word on screen is in the script, word for word.
- Each title and story line says one thing, in plain words, in short sentences.
- No coined terms or private vocabulary: name things for what they are.
- No hype ("powerful", "seamless", "robust"), no caveats nobody asked for,
  no exclamation marks, no em dashes.
- Each slide makes sense from its title and story lines alone.
- The speaker notes (You say) add detail and do not repeat the screen.

Report each problem as: slide number, the exact words, what is wrong, and a
replacement in the same voice. Change no files.
```

### Motion design panel

```text
You are a panel of three motion designers reviewing slides <numbers> of this
talk. Read docs/<id>-talk-script.md for these slides (They see is the intended
animation), then play each slide in the running deck (npm run dev,
http://localhost:3000, headless browser). Use the address of each slide, such as
#/<world>/<picture>.play, and record or screenshot each slide's chain at
several moments.

Each panelist judges every slide on:
- Does the motion explain the idea, one subject at a time, in the order the
  speaker would say it?
- Can a viewer read each story line before the next thing starts?
- Is anything left over from the previous slide that should have gone?
- Does anything move for decoration rather than meaning?
- Is the stage ever still so long it looks stuck, or so busy it reads as a
  screen refresh?
- Does it match They see? Where it differs, is the difference better?

Report per slide: what works, what to change, and how, with timings in
seconds where they matter. Then give one list of changes the panel agrees on.
Change no files.
```

### Cold viewer

```text
You have never seen this talk and no one will explain it. Open the deck
(npm run dev, http://localhost:3000, headless browser), press Start, and click
through slides <numbers>, letting each one finish. Do not read the script or
the code.

For each slide, write:
- what you think it is telling you, in one sentence;
- anything you did not understand, or a word you did not know;
- anything you had to guess.

Then say, in two sentences, what the whole section was about. Change no files.
```

Compare the cold viewer's sentences with what the script meant. Any slide where they differ goes back for a fix.

## House rules

An agent building in this repo keeps these rules. Each one names where it is written or tested.

### Words

- Every word on the stage comes from the script, through `shown()` and `storyOf()`. Scene files type no words of their own. (`docs/bchc-art-direction.md` section 5, trap 1; the world tests, for example "types no words into its scene files" in `worlds/catalog/world.test.ts`.)
- The script and its `.ts` mirror match word for word. (`script/script.test.ts`)
- No coined terms or private vocabulary: no "stations", "the gate", "ledger" or "sprint" on screen. (`docs/bchc-art-direction.md` section 5, trap 1; `docs/bchc-flow-revision.md` section 3)
- Story lines come from the approved You say, word for word or with words removed, never with facts added. At most two per slide, each at most 100 characters. (`docs/bchc-flow-revision.md` section 3; `script/script.test.ts`)
- No em or en dashes, no banned words, American spelling, two to nine spelled out. (`script/script.test.ts`)

### Motion

- One click plays one whole slide. A slide takes two clicks only when the audience must sit on a half-finished picture. (`docs/bchc-flow-revision.md` section 1; `script/script.test.ts`)
- A click finishes within 12 s, counting a world's arrival fade on its first slide. (`docs/bchc-flow-revision.md` section 1; every world's `world.test.ts`)
- The stage is never still for more than 3 s inside a click. (`worlds/flow.test.ts`)
- Hold 1.6 s after a story line and 0.5 s between beats (`HOLD` in `kit/tokens.ts`). Write a click with `chain()`, not hand-added seconds. (`docs/bchc-flow-revision.md` section 1)
- Each slide's first click hides whatever it does not carry over from the slide before. (`docs/bchc-art-direction.md` section 5, trap 2)
- Every visible state is written as a move's `on` and `off` values. Nothing moves on a `setTimeout`, `setInterval`, `requestAnimationFrame`, CSS `transition` or `animation`, or at random. Positions are literal numbers in the layout file. Dashed outlines open with `wipe`, not a dash offset. (`docs/bchc-art-direction.md` section 5, trap 5; the `catalog`, `build` and `sharing` world tests)
- Back, jump and a cold load land on the same frame as clicking through. (`deck-check.mjs`)

### Colour and drawing

- Words are navy. The one orange word is "Approved". (`docs/bchc-brand.md`, rule 1; `worlds/start/world.test.ts`)
- Orange means a person approves, through the kit's `HumanMark`, and nothing else. (`docs/bchc-brand.md`; `docs/bchc-art-direction.md` section 1; the world tests)
- Deep green means a check passed, and appears only as a tick. Green is the process. (`docs/bchc-brand.md`, rule 4; the world tests)
- Gold is for fills and strokes of 3 px or more, never thin lines or words. (`docs/bchc-brand.md`, rule 3; `worlds/releasing/world.test.ts`)
- Strokes at full strength, fills at fractions: 0.12 idle, 0.55 active. (`docs/bchc-brand.md`, rule 2; `kit/palette.test.ts`)
- No stars, gradients or glows. (`docs/bchc-brand.md`, rule 5; the world tests)
- No CSS `filter`, `backdrop-filter` or `mix-blend-mode`, and no SVG filter elements, anywhere under `src/components/deck` or `src/talks`. (`src/components/deck/forbidden.test.ts`)
- The five hue names appear only in `kit.css`. Scenes paint with role names (`--dk-process`, `--dk-catalog` and so on) and the kit's tokens, never a literal colour or a vendor's colour. (`kit/palette.test.ts`; `strayTokens` and `VENDOR_COLOURS` in the world tests)
- A person is always `Person`, an AI agent is always `Agent` (its shape is its role), a department is `Dept`, a module is `Tile`. They never share a shape. (`docs/bchc-art-direction.md` section 1 and section 5, trap 4; `kit/glyphs.test.ts`)
- A failure has no colour of its own: a dashed outline with a cross (`fail`). (`docs/bchc-art-direction.md` section 1)
- Screenshots are shown in colour on a white mount, with a 3 px indigo edge where they show the catalog. (`docs/bchc-brand.md`, rule 6; `kit/roles.test.ts`)
- Text at 32 px or more, labels at 26 px or more, rules of 2 px or more, dots of 12 px or more. (`kit/kit.css` header)
- The title's short green rule is drawn under every title unless `rule={false}`. (`kit/text.test.ts`)

### Code

- Keep each module under about 500 lines. (`worlds/sharing/world.test.ts` enforces it there)
- Every image path, `window.open` and hand-built URL goes through `withBase()`. (`src/lib/base-path.ts`)
- Import `gsap` from `src/components/deck/engine/gsap.ts`, where the house eases are registered.
- Run browsers headless. A visible browser is only for the owner to watch.
- Do not edit `AGENTS.md`: `next dev` rewrites it.
