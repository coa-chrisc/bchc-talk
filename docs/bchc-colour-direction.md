# BCHC deck: colour direction

Written 2026-10-09 from a design consult, after the owner's note: "it's very monotone… these are public health people, let's use some color and make it beautiful… elegant, and a little whimsical and fun at the same time." This replaces the colour-role section of `bchc-art-direction.md`. Script slides: `bchc-talk-script.md`.

## Palette

The background and ink stay. Five accent hues are added, taken from or tuned to the fleet film's family (`src/components/control-room/fleet-room.css`).

| Token | Hex | On night | Role |
|---|---|---|---|
| night | #0b1020 | | background |
| raised | #121936 | | the only second background |
| paper | #f6f1e7 | 16.8:1 | all words |
| soft | #c3bfb8 | 10.3:1 | secondary labels |
| rule | paper at 0.44 | | lines |
| coral | #ff8c5a | 8.3:1 | **reserved:** a person approves |
| green | #9be29b | 12.4:1 | **reserved:** a check passed |
| sky | #8fb0ff | 8.9:1 | the catalog, what's shared |
| mint | #7fd4bc | 10.9:1 | the process, agents at work |
| butter | #f2d16b | 12.7:1 | set per Part |
| lilac | #c9a8ff | 9.5:1 | set per Part |
| rose | #f4a3c4 | 9.8:1 | set per Part |

- Don't darken the accents for variety. A darker accent goes muddy on a projector.
- A failure stays shapeless: a dashed outline or a cross, never red.

## What each colour means

- **Coral** means only that a person approved. **Green** means only that a check passed. Nothing else is ever coral or green.
- **Sky means the catalog, everywhere.** That covers the catalog mount edge, the Live well, a tile once it sits in the catalog, the catalog band, the shared centre on 27, the rising line on 28, and the source-code panel on 29 and 31.
- **Mint means the process, everywhere.** That covers builder agents, cells being built, the session blocks on 9, the "Our agentic process" label on 10, and the agent pack on 29, 30 and 42. Sky and mint sit side by side on 10, 23 and 29, the slides that teach that the catalog and the process are two separate things. Never swap them.
- **Butter, lilac and rose mean different things in each Part.** No slide uses one with two meanings.
  - **Part 3, by agent role:** planner (lead agent) is butter, builder mint, reviewer lilac, fixer rose. The tester stays paper, and its work shows as green ticks.
  - **Part 4, by department:** departments cycle lilac, rose, butter. A tile keeps its home department's hue wherever it goes. "Your department" and Austin stay as paper outlines.
  - **Part 5, by what we share:** agent pack mint, source code sky, design system and skills rose, help getting set up lilac. The magic sauce is butter.
- Parts 1, 2, 6 and 7 use sky, mint, coral and green, plus any Part 5 hue a thing already owns.

## Where colour goes

**Part 1**
- Stills stay grayscale on their paper mount. Wherever a mount shows the catalog (2, 3, 4, 6, 31, 35), it gets a 3 px sky edge.
- **2:** the "Built by…" tag is paper on a sky rule.
- **5:** Draft and Checks get a mint fill at 0.18 behind the card. Checks gets green ticks. Approval has a coral outline. Live has a sky outline, and the card picks up a sky edge as it lands there.
- **6:** green ticks, and "Approved" in coral.
- **9:** the session blocks fill mint. The feedback marks arrive in sky from the coalition's side.
- **10:** agent rings fill mint, and the catalog picture has its sky edge. This slide teaches the pair.

**Part 2**
- **11:** ink and rule only. The vendor story stays grey on purpose.
- **12:** the tiles arrive mint, and the person's mark is coral.
- **13:** approval marks in coral.

**Part 3**
- **14:** boxes 2 and 3 get a mint outline, and boxes 4 and 5 coral. The row reads people, process, people.
- **14a:** the six inputs stay paper. The two lead agents light up, with a butter ring fill.
- **15:** the swatches are the deck's own six accents, at 48 px.
- **16 and 17:** the wall tiles stay paper. Tiles turn mint as they land in the app.
- **19:** project row, epics and sprints in rule.
  - Click 1: the planner is butter and the person coral.
  - Click 2: agents arrive in their role hues. A cell tints at 0.18 in its holder's hue when an agent takes it, fills to 0.78 as the work goes on, and turns green at 0.72 when it passes. These are the fleet film's numbers.
  - The "What has to finish first" line is paper.
- **20:** the failed cell is dashed with a cross. The fixer travels in rose, and the cell clears and passes green.
- **21:** two lilac diamonds and one coral dot under each cell.
- **22:** work packets in mint, and the bar fills mint. A coral flag goes up with "Released".
- **22a:** the pull-back shows the fleet film look. At far scale the board becomes a field of mint (building) and green (passed), with small butter sprint heads and a coral marker at every release. Lilac and rose dots are hidden at far scale.

**Part 4**
- **23:** the catalog strip has a sky edge and three sky slots. Departments A, B and C are lilac, rose and butter, and each holds a tile in its own hue.
  - When a tile sits in the catalog, its edge turns sky and it keeps its fill.
  - Copies pass through a small mint agent, the department's own process, and come out with a dashed corner.
  - At the end, each department holds one lilac, one rose and one butter tile.
- **24:** departments cycle the three hues, and every tile keeps its home hue. Each department's set ends as a mixed row of colours, and that mix is the message of the slide.
- **25:** agent mint, person coral. The tiles take a sky edge when they land in the catalog.
- **26:** the two departments are lilac and rose.
- **27:** the centre is sky and fills with tiles in the departments' mixed hues. Vendors, budgets, budget cuts and their lines stay rule only. The point: a coloured middle, a grey outside.
- **28:** the rising line is sky. The falling line stays dashed paper with the "$".

**Part 5**
- **29:** the bottle is a paper line drawing, and the liquid inside is butter, draining as it pours. Each drop falls butter and opens into a panel in that part's hue: agent pack mint, source code sky, design system and skills rose, help lilac. Panel headings stay paper.
- **30:** mint.
- **31:** sky. The "Awaiting City approval" tag is soft. A City approval comes from the institution, not a person in the loop, so it isn't coral.
- **32:** the "Yours" strip fills rose from the templates.
- **33:** lilac.

**Part 6**
- Mostly ink, because these slides are instructions. Agents are mint, the catalog is sky, and approvals are coral.
- **42:** each request lights its target in the hue it owns.

**Part 7**
- **43:** the agents fly off as mint builders.
- **44:** the finale stills are captured **in colour**, so the grid becomes a quilt of the talk's palette. Capture them as `NN.v4.webp` (v3 is already taken by the grayscale set).

## Rules that keep it elegant

1. **Words are ink.** The one exception is "Approved" in coral.
2. **Strokes at full strength, fills at fractions.**
   - Large fills run 0.18 when idle and up to 0.78 when active.
   - Washes run 0.08 to 0.14.
   - Small marks under 24 px may be solid.
3. **One or two hues per slide beyond coral and green.** The exceptions are slides whose point is the mix: 15, 19–22a, 23, 24, 27, 29 and 44. On those, colour sits on small things.
4. **No gradients, glows or tinted backgrounds.**
5. **Colour arrives by work.** It comes through a fill, a drawn edge or a tile arriving. Nothing pulses, flashes or cycles.
6. **A hue means one thing within a Part.** Sky and mint mean the same thing everywhere.
7. **Grey means something.** Vendors, queues, budgets, "awaiting approval", failures and a department before it shares stay ink and rule.
8. **Projector check.** Every accent stays above 8:1 contrast on night.

## Implementation

**Tokens** go in `.deck`, in `src/components/deck/kit/kit.css`:

```css
--dk-sky: #8fb0ff; --dk-mint: #7fd4bc; --dk-butter: #f2d16b; --dk-lilac: #c9a8ff; --dk-rose: #f4a3c4;
--dk-catalog: var(--dk-sky); --dk-process: var(--dk-mint);
--dk-lead: var(--dk-butter); --dk-review: var(--dk-lilac); --dk-fix: var(--dk-rose);
--dk-dept-a: var(--dk-lilac); --dk-dept-b: var(--dk-rose); --dk-dept-c: var(--dk-butter);
--dk-share-pack: var(--dk-mint); --dk-share-code: var(--dk-sky); --dk-share-design: var(--dk-rose); --dk-share-help: var(--dk-lilac);
--dk-tint-idle: 0.18; --dk-tint-active: 0.78; --dk-wash: 0.10;
```

Worlds use only the role aliases, never the hue names. A test enforces it: no `--dk-sky|mint|butter|lilac|rose` outside `kit.css`.

**Kit glyphs and parts**

| Part | Change |
|---|---|
| `Agent` | Add `data-role` so the ring fill takes its role colour, and an `ink` prop that forces paper for tiny agents. The body stays paper. |
| `Tile` and `Dept` | Add a `hue` prop (catalog, process, dept-a/b/c) through `data-hue`. |
| `Board` cell | Add a `.dk-cell__hold` tint that follows `--k` from idle to active. The `__tint` stays green for a pass. |
| `Stations` | Add a `catalog` index for the sky Live well. `CardToken` gets `data-landed`. |
| `Connector`, `Dashed`, `Line` | Extend `tone` with the role names. |
| `ArtefactFrame` | Add `edge="catalog"`. |

**Tests to revise, not delete**
- The colour whitelists in `kit/glyphs.test.ts` and in each world's `world.test.ts` change to: coral only through its selectors, green only on its selectors, and the role aliases otherwise.
- Keep the ban on fleet vendor colours (`fr-claude|fr-cursor|fr-gemini`).

**How to check it worked**
- On 10, 23 and 29, a cold viewer can tell that the blue thing is the catalog and the green-blue thing is the process.
- On 24, each department's row turns from one colour to a mix.
- On 11 and around the outside of 27, everything is grey.
