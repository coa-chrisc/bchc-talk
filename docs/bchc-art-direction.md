# Visual plan: "Using AI in Public Health Practice"

Files referenced are under `/Users/crypticpy/orca/workspaces/AEP_LandingPage/Presentation/` unless given in full.

## 0. Before the five builders start: one short kit-prep commit

Five worlds built in parallel will each need the same few drawings. If each builder invents their own, the deck gets five kinds of agent and three kinds of tile, which is exactly the "hot mess". So one builder lands these first (half a day), the five fork from that commit, and nobody redraws them.

1. **Rewrite the script module** `src/talks/bchc/script/` from `docs/bchc-talk-script.md`: seven parts, 47 pictures, the slide ids and step ids in the tables below, `show` = the On screen line, `say` = You say. Keep `shown()`/`breakAfter()` from `script/find.ts`. Delete `releases.ts`, the `Ledger` type and the `WorldId` union (replace with the five world ids below).
2. **Remove the persistent layer.** `src/talks/bchc/deck.ts`: drop `chrome`; delete `src/talks/bchc/chrome/`. The engine's `ChromeDef` stays available but this deck does not use it.
3. **Add four kit parts** to `src/components/deck/kit/` (SVG for a plane's `marks`, each with a `data-build` id, drawn only with the existing verbs):
   - `Agent` — the AI agent glyph. Ring r 22, stroke 3 in `--dk-rule`, three arc segments with 0.24 rad gaps (the film's harness ring, `fleet-agents.ts:142-147`), filling to paper with `fill` (`--k` scales each segment's arc). Body in paper, by role, exactly the film's shapes: builder filled circle r 8; planner stroked circle r 7 stroke 3; tester filled square 14; reviewer filled diamond 20 tall; fixer filled triangle 20 wide. Optional label under (26 px soft): "planner", "builder", "tester", "reviewer", "fixer" are the only allowed labels. Moves with `x`/`y`. **Never any colour but paper and rule.**
   - `Tile` — a module. Small (library) 18 × 18 at 24 pitch, rx 3, paper at 0.85 alpha; `fill` scales it in from the centre. Large (subject) 64 × 64, rx 8, stroke 2.5 paper, same fill. A **new** module is `Dashed` (already in the kit) at the same size.
   - `Dept` — a health department: ring r 36 stroke 2.5 `--dk-rule`, optional label under at 26 px. "Your department" variant: stroke paper 3. `fill` is not used on these; `show`, `x`, `y` only.
   - `Waveform` — 24 vertical bars, 6 wide at 14 pitch, heights from a fixed array (no randomness), paper, each bar a `rect` with its own `data-build` (`id.0`…`id.23`) so they can `rise`, `fill` and travel.
4. **A `Thumb` still frame** is not needed: `ArtefactFrame` already does it.

Everything else is already in the kit: `Person` (head and shoulders, paper, never coral), `HumanMark` (the coral ring and dot), `Node`, `Connector`, `FanOut`, `Packet`, `Dashed`, `Tag`, `Board/Row/Cell` (the film's rows of cells), `Stations/CardToken` (the six-step row), `InkRing/Tab` (marks on a screenshot), `SetText`, `Block`, `Counter`, `TypeText`, `UnitRow`, `Flag`, `Bracket`.

---

## 1. The visual system (one page)

**Stage.** 1920 × 1080, night ground `#0b1020`, star field backdrop (`src/talks/bchc/backdrop.tsx`) held dim inside the 64 px safe edge. Field for drawing: x 96–1824. The old margin column at x 1536 is gone with the ledger; use the full width.

**Type.** Title in the headline face (`SetText size="title"`, 80 px) at x 96, y 152, one or two lines (second line at y 240). Content band starts at y 340 under a one-line title, y 420 under two. Labels: Public Sans 32 paper (`dk-text`) for things that matter, 26 soft `#c3bfb8` (`dk-label`) for names under glyphs. Nothing under 26 px. No text inside anything drawn under 0.5 scale.

**Words on screen.** The title is the script's On screen line, verbatim. The only other words allowed are labels the script's They see names (in quotes or by name: "automatic", "Months or years", "Our platform", "Our method", "Yours", "Azure", "AWS", "Once cleared", "Released", "Planned", "Purchased", "Approved", "More departments sharing", "Your department", "GitHub", the five role names, the station headings). Where this plan says a label comes from You say, it is a fragment of at most five words quoted verbatim. Nothing else: no invented names, no coined terms, no running totals.

**Line weights.** Rules and connectors 2.5 px in `--dk-rule` (paper at 0.44). Outlines of a subject 2.5–3 px paper. Ink on a screenshot: night ink 3 px (`InkRing`). Arrowheads only where something travels that way (`Connector head`); a leader to a label has none.

**Colour roles.**
- Paper `#f6f1e7`: the drawing, type, agents, people, tiles, fills.
- Soft `#c3bfb8`: secondary labels, a thing standing back.
- Rule (paper at 0.44): connectors, outlines of places and wells, ghosted things.
- Pass green `#9be29b`: a test or check that passed (tick on a cell). Nowhere else.
- Fail: no colour. A failed thing is a dashed paper outline with a cross (`fail` verb). Shape, not tint.
- **Coral `#ff8c5a` means one thing: a person approved it.** It appears only as `HumanMark`, as the coral outline of an Approval station, as an approval mark on a history line, and as the coral outline on the two person steps of Part 3. No agent, tile, chart line, department or label is ever coral. A person who is not approving (sitting at training, directing work) is a paper `Person`.
- The film's provider colours (`--fr-claude`, `--fr-cursor`, `--fr-gemini`) do not enter the deck. Role is told by shape only.
- Screenshots are grayscale on a paper mount (`ArtefactFrame`), as in Part 1.

**People versus agents.** A person is always the head-and-shoulders `Person` (48 × 64). An agent is always the ringed `Agent` glyph. They never share a shape, and a glyph is never scaled under 0.6 with its label.

**What persists.** Only the backdrop and the title's position. There is no chrome layer, no time rule, no ledger, no docked row. Within a run of consecutive slides that are about the same drawing, the drawing stays (Part 1 slides 5–7 keep the six-step row; Part 3 slides 19–22 keep the board; Part 4 slides 27–28 keep nothing but swap; Part 6 slides 39–42 keep the path). The plan marks each carry explicitly as **(carry)**. Anything not marked (carry) is gone before the next slide's title lands.

**Motion grammar.** Five moves, all from `kit/verbs.ts`, house timings from `kit/tokens.ts`:
- `draw` (0.9 s, power2.inOut): a line, an outline, a frame appears by being drawn.
- `rise` (0.75 s, expo.out, 22 px): text and blocks arrive.
- `fill` (0.75 s): a cell, ring or tile fills because work was done.
- travel (`to` x/y, or `send` along a `Packet`, 1.2 s, page ease): one thing moves from one place to another because it changed hands.
- `hide`/`ghost`/`dim` (0.4 s): a thing steps back or goes.
Each click has one subject: at most three moves besides hides, staggered 0.09–0.16 s, finished inside 2 s. A `retitle` (old title out 0.3 s, new lines up from 0.25 s) is how every slide hands to the next inside a world; the outgoing picture `hide`s at 0 in the same click unless marked (carry). Between worlds the engine fades through night (0.6 s out, 0.7 s in, `engine/director.ts`); no visual hand-off is attempted across it. The camera moves exactly twice in the talk (slide 21, slide 44); everywhere else `HOME`. Nothing pulses, orbits, breathes or glows. Nothing moves on a timer; everything moves on a click.

**Pixel parity.** Every state is a function of the compiled moves. No CSS transitions, no `Math.random`, no `Date`, no `setInterval`; a driven property for anything numeric (`kit/driven.ts`). `deck-check.mjs` must pass at the three sizes.

---

## 2. The build split

Five worlds, five worktrees, one builder each. World ids are the step addresses; all steps are keyed `slide-id.step-id` from the tables.

| World id | Builder | Slides | Plane | Camera |
|---|---|---|---|---|
| `catalog` | A | 1–13 (Parts 1–2) | 1920 × 1080 | HOME |
| `build` | B | 14–22 (Part 3) | 1920 × 1080 | HOME; one close-up and pull-back on 21 |
| `sharing` | C | 23–28 (Part 4) | 1920 × 1080 | HOME |
| `releasing` + `close` | D | 29–33 (Part 5), 43–44 (Part 7) | 1920 × 1080 each | HOME; pull-back on 44 |
| `start` | E | 34–42 (Part 6) | 1920 × 1080 | HOME |

Deck order in `deck.ts`: `catalog, build, sharing, releasing, start, close`.

**Boundaries.** The engine cuts to night between worlds, so a boundary is only: the last frame is complete and still, the first step of the next world is "title rises, first element draws". The first and last frames:

- `catalog` first: title lines 1–3 of slide 1 at (96,152/240/328), nothing else, then the empty frame draws at E. Last (13): app outline centred, "Yours" ring round it, history line across y 880 with its marks.
- `build` first (14): six boxes rise in a row at y 480. Last (22): project bar full across y 400, "Released" at its right end, the catalog thumbnail (288 × 144) sitting on the bar's centre, memory panel at right.
- `sharing` first (23): the catalog strip draws across y 340. Last (28): the two lines, drawn, with "More departments sharing" under them.
- `releasing` first (29): four empty panels rise. Last (33): table, five people, five agents, "Planned".
- `start` first (34): three lines rise. Last (42): network at left, four request lines at right, all lit.
- `close` first (43): waveform alone at centre. Last (44): the grid of 45 stills with the closing lines above.

**The finale without other worlds' internals.** Slide 44's "every picture at once" is a grid of grayscale stills of each slide's final frame, captured from the finished deck: 45 stills (slides 1–42 plus 43; 44 excluded), 9 columns × 5 rows at 176 × 99, 16 px gaps, grid box (104, 360, 1712, 559). The Part 7 builder works with 45 placeholder stills (a generated neutral frame, `public/talks/bchc/finale/placeholder.webp`) and the step addresses; after the five worlds merge, a capture script (a sibling of `src/talks/bchc/capture/capture-stills.mjs`) writes `public/talks/bchc/finale/NN.v1.webp` and the placeholders are swapped by name. No dependency on any other world's code. Version the asset names, as the stills in `slides/layout.ts:283` already do.

---

## 3. Shared layouts (numbers every builder uses as given)

- `TITLE` (96, 152), second line y 240.
- `E` catalog slot = box(576, 340, 928, 464), as Part 1 today. `E_LEFT` = box(96, 340, 928, 464) when the right side needs room.
- `S` small catalog picture = box(96, 400, 464, 232) (the list still, `catalog-list.v2.webp`, at 0.5).
- `THUMB` catalog thumbnail = 288 × 144.
- `ROW6` = `stations({ id: "row", x: 256, y: 560, headings: [Form, Request, Draft, Checks, Approval, Live], human: 4 })`: wells 208 × 72 at 240 pitch (x 256…1456), headings at y 496, card 168 × 48. Docked position y 860 (wells), headings y 796.
- `STEPS6` (Part 3's six steps, text does not fit a 208 well): six boxes 256 × 136, gap 24, x 132…1532, y 480, rx 12, stroke rule 2.5, text inside at 32 px paper, wrapped by the author (`breakAfter`). Boxes 3 and 4 ("A person reviews", "A person approves the release") take a 3 px coral outline when highlighted.
- `AGENT_R` 22; `PERSON` 48 × 64; `DEPT_R` 36; tile small 18/24 pitch, large 64.
- The module library wall `WALL`: 13 shelves (rows), counts `[31, 25, 16, 16, 13, 8, 7, 6, 5, 5, 5, 4, 4]` (from the old act 2, `agent-a3cd09ad259deb8f7/src/talks/bchc/act-2/layout-wall.ts:44`), tile 18, pitch 24, shelf rise 24, so 744 × 312. Reuse that file's `tileAt`, `SHELVES`, `TILES` (a `UnitGridLayout`, lit by `light`) and the `Swatch` part from the same folder's `parts.tsx:23` for the design strip. Nothing else from the old acts.
- The agent board `BOARD` (Part 3): `board({ id: "board", x: 256, y: 460, w: 1408, rows: 4 × { cells: 4 }, rowH 92 })` from `kit/board-layout.ts`, giving four workstream rows of four cells under a project bar at box(256, 400, 1408, 40).

---

## 4. Per slide

Format: **Composition** (where things sit), **Clicks** (key frame after each click; click 1 is the slide's arrival and always includes the retitle plus the previous slide's hides unless (carry)), **Reuse**.

### Part 1. The catalog — world `catalog` (builder A)

Trim the existing world: delete the Dana picture (`has-anyone-tried-this`), `since-june`, `sample-entries`, the time rule and ledger moves; keep and re-key `the-catalog`, `nothing-to-run`, `six-stations`, `descriptions-not-data`. Rename the station heading "Issue" to "Request" in the script module. The row is no longer chrome: draw `ROW6` in this world's own scene.

**1. Title** `title` — steps `credit`, `window`
- Composition: three lines at (96,152), (96,240), (96,328) in `title` size: "Using AI in Public Health Practice" / "Big Cities Health Coalition, Data Modernization Work Group" (size `medium`, soft) / "Austin Public Health" (size `medium`). Empty browser frame: a rule-stroke rounded rect at E with a 36 px top bar and three 10 px circles at its left (the only browser chrome drawn in the talk).
- Clicks: (1) lines rise. (2) the frame draws clockwise from top-left, then its bar line draws.
- Reuse: `ASK.place` pattern (a drawn rect) from `slides/scene-opening.tsx`.

**2. The catalog** `the-catalog` — steps `home`, `address`
- Composition: title one line. `ArtefactFrame` at E with `catalog-list.v2.webp`. Address at (576, 820) as `Block` 32 px soft, left-aligned to the frame.
- Clicks: (1) retitle; the still wipes in from the top (`wipe from: "top"`) inside the drawn frame, frame outline fades as the mount takes over. (2) address rises.
- Reuse: existing `Catalog()` in `scene-row.tsx`; drop the "line up out of the Live well".

**3. Find what others have tried** `find` — step `search`, `filter`, `compare`
- Composition: title "Search, Filter, Compare." The frame stays (carry). Three `InkRing` + `Tab` pairs on the still as today (`CATALOG.find`).
- Clicks: one per word, 0.2 s apart is wrong here, the script says one per click: (1) retitle + Search ring and tab. (2) Filter. (3) Compare.
- Reuse: as built, split into three steps.

**4. What an entry tells you** `entry` — steps `ring`, `built`, `runs`, `skills`, `ready`, `cost`, `contact`
- Composition: frame (carry), callouts hide. `InkRing` round the first entry (`CATALOG.same.ring`). Fields listed in the left column x 96–540 from y 360, 32 px, one per line at 56 pitch: "what the department built", "where it runs", "the skills it took", "how ready it is", "what it cost", "a contact" — fragments of You say.
- Clicks: (1) retitle, ring draws, leader to column draws (no head). (2–7) each line rises.
- Reuse: `same` parts in `scene-row.tsx`; delete the line to the Form well.

**5. From form to live page** `six-steps` — steps `boxes`, `card`, `automatic`, `approval`
- Composition: frame unwipes toward top and hides. `ROW6` at y 560 (headings y 496). "automatic" label 32 px at (736, 672) under a `Bracket` spanning Draft and Checks at y 652. `Person` at (1472, 440) above Approval, `HumanMark` at the person's foot (1496, 520).
- Clicks: (1) retitle; wells draw left to right, headings rise behind them (`rowDraws`). (2) card arrives from off-left into Form, then moves well to well, each left well's quiet fill wiping behind it (`cardMoves`), ending in Live, 1.8 s total. (3) bracket draws, "automatic" rises. (4) Approval's coral outline draws (`personDecides`), the person draws, the coral mark lands.
- Reuse: `Stations`, `CardToken`, `chrome/moves.ts` (move its functions into this world).

**6. A person approves it, and it goes live** `approved` — steps `checklist`, `approved`, `catalog`, `published`
- Composition: ROW6 docks to y 860 (carry). Left: a drawn draft sheet at box(96, 340, 560, 420): a paper rect rx 8, three title bars, five checklist rows each a 20 px square and a line. Right: `ArtefactFrame` at box(760, 340, 1064, 420).
- Clicks: (1) sheet draws, ticks `pass` one by one (0.1 stagger). (2) "Approved" rises at (96, 790) in 32 px with a `HumanMark` to its left; under it a name and time as soft 26 px set as `Block` — **use a real reviewer name and a real time from the catalog's record, or the placeholders "Reviewer" and "14:32"; no invented person**. (3) right frame wipes from bottom with the catalog grid still (`catalog-page-02.v2.webp` or a fresh capture of the list with the newest entry at top), `InkRing` round the newest entry. (4) the frame's strip travels to a new still of the "Check your submission" page showing Published, `InkRing` round "Published". **New still needed:** `check-submission.v1.webp`.
- Reuse: the drawn sheet from old act 3 (`agent-a417e45b575bb4e92/src/talks/bchc/act-3/sheets.tsx`) if its checklist drawing is clean; otherwise six rects.

**7. Easy to review** `review` — steps `privacy`, `flag`, `agent`
- Composition: ROW6 docked (carry). Left frame box(96, 340, 792, 400) with `submit-form.v2.webp` and the attestation `InkRing` (`DATA.attest`). Middle: the dashed card in the Draft well with a `Flag` on its corner and "Data governance review" 26 px beside it at (780, 800). Right: `Person` at (1360, 380), `Agent` builder at (1560, 380), and two `TypeText` lines under them at (1240, 500) and (1240, 560), 32 px, the two instructions as fragments of You say: "Pull up the new submission." / "Tell us what's in it."
- Clicks: (1) frame wipes, ring draws. (2) card shows in Draft, flag draws, label rises. (3) person and agent draw, two lines type (`type`), the coral mark lands under the person.
- Reuse: `Form()`, `DATA.flagged` from `scene-row.tsx`.

**8. No server, no database** `nothing-to-run` — steps `usual`, `removed`, `files`
- Composition: as built today: three dashed boxes with stubs in the left column at y 340/468/596 ("server", "database", "editor login"), the file list at y 424–520, "Hosted free on GitHub Pages" as `Block` at (96, 656). ROW6 hides at 0 in click 1 (frame leaves with it).
- Clicks: (1) three boxes wipe on with labels. (2) labels hide, boxes unwipe. (3) files head, rule and three mono lines rise; hosting line rises.
- Reuse: `HOST` in `layout.ts`, as built, minus the leader to the site.

**9. About three working days** `three-days` — steps `day1`, `day2`, `day3`, `odd-hours`
- Composition: S (small catalog picture) at box(96, 400, 464, 232). Three blocks 288 × 160 at x 704, 1040, 1376, y 420, rx 8, rule outline, paper fill by `fill`. Between and after them, at y 620, four short 24 px paper ticks in pairs (the odd hours), from `TickRule`'s tick shape.
- Clicks: (1) retitle, S wipes in, block 1 outline draws and fills. (2) block 2. (3) block 3. (4) the small marks show, 0.05 stagger.
- **CHANGE**: the script puts the odd-hour marks "between" the days; put them under, at y 620, so the three blocks stay one even row and the marks read as "a little more", not as a fourth and fifth day.

### Part 2. Why this matters — same world `catalog`

**10. The proof** `proof` — steps `picture`, `people-agents`, `labels`
- Composition: S moves (travel) to box(728, 380, 464, 232), centre. Under-left: three `Person` at x 560, 632, 704, y 660. Under-right: three `Agent` (planner, builder, reviewer) at x 1216, 1288, 1360, y 692. Two `Block` labels 32 px at (560, 800) "Our platform" and (1216, 800) "Our method".
- Clicks: (1) retitle, S travels to centre. (2) people draw, agents draw. (3) labels rise.

**11. The problem we all share** `too-long` — steps `line`, `off-edge`, `loops`, `pile`
- Composition: a single rule path from a `Node` "We need a tool" (box(96, 540, 280, 72)) through four Nodes 240 × 72 at x 480, 800, 1120, 1440 y 540 ("Requirements", "Procurement", "Vendor", "Setup"), then straight to x 1920 (off the stage). "Months or years" 32 px soft at (1440, 650), right-aligned to 1824. Three loop arcs from Setup back to Vendor above the line (y 460), drawn one after another. A pile: five card rects 200 × 44 stacked under the first node from y 640 at 52 pitch, offset 8 px each.
- Clicks: (1) retitle, first node draws, line draws node to node with each node drawing as the line reaches it (`behind`), 2.0 s. (2) line draws to the edge, label rises. (3) three loops draw. (4) cards rise one at a time.
- Reuse: `Node`, `Connector`, `behind`.

**12. Let AI build it** `ai-builds` — steps `inside`, `builds`
- Composition: app outline: rule rounded rect box(640, 380, 640, 400) with a 40 px top bar line. Inside, a chat bubble (rounded rect 320 × 120 with a tail) centred, and "AI inside a tool" 32 px under the outline at (640, 800). `Agent` builder at (480, 580). Twelve small tiles (18 px) start on the agent and travel into the outline to a 4 × 3 grid at (720, 460) pitch 140. `Person` at (1400, 548), `HumanMark` at (1424, 640). "AI that builds the tool" replaces the label at the same place.
- Clicks: (1) retitle, outline draws, bubble draws, label rises. (2) bubble and label hide; agent draws; tiles travel in with 0.05 stagger as they grow (`fill`); new label rises; person draws, coral mark lands.
- **CHANGE**: use twelve tiles, not "building blocks", so this picture matches slide 16's library and the viewer learns the tile once.

**13. You own it** `yours` — steps `yours`, `history`
- Composition: app outline and tiles (carry from 12; agent, person and label hide). "Yours" 32 px at (640, 340) with a paper rounded rect (`InkRing` style but paper) drawn round the outline at 16 px clearance. History line: rule from (96, 900) to (1824, 900) with five coral approval marks (`HumanMark` r 12, no ring label) at x 400, 680, 960, 1240; the fifth lands at 1520 on the click.
- Clicks: (1) retitle, ring draws, "Yours" rises. (2) line draws, four marks show behind the front, the fifth lands (`mark`).

### Part 3. How we build — world `build` (builder B)

**What the film is, and what to reuse.** `src/components/control-room/` is a 2D canvas (`fleet-canvas.ts`) drawn every animation frame from a 100 ms-tick simulation (`fleet-sim.ts`), under a DOM text layer measured on resize (`fleet-layout.ts`), with provider colours. None of that can be dropped into the deck: a deck step must be a pure function of compiled moves, and the film's state is time and simulation. **Redraw in deck primitives**: the kit's `Board/Row/Cell` already is the film's rows of cells (`kit/board.tsx` says so); the `Agent` glyph from kit prep carries the film's role shapes and ring; dependency links are `Connector`s; the project bar is a `Cell`-style rect filled by `fill`; the memory panel is a `Block` list; the release marker is a `Flag`. Take geometry proportions from `fleet-world.tsx`/`fleet-room.css` by eye, not by import.

**14. Our rapid application development system** `rad` — steps `steps`, `people`
- Composition: `STEPS6` row at y 480: "Describe." / "AI reads our standards and modules." / "Build." / "A person reviews." / "A person approves the release." / "Run it." Short rule connectors between boxes (no heads).
- Clicks: (1) boxes draw left to right, text rises inside each (0.16 stagger), connectors draw behind. (2) boxes 4 and 5 take the coral outline; a `Person` draws above each (y 380).

**15. The design system** `design` — steps `strip`
- Composition: STEPS6 hides. A strip box(96, 340, 1728, 120): rule outline rx 12; inside, four groups at x 136, 568, 1000, 1432: six colour swatches (paper rects at 0.3/0.5/0.7/0.9/1.0 alpha, 48 × 48), three type samples ("Aa" at 64/40/28 px), three component outlines (a button, a field, a card at 96 × 40), and the accessibility mark (a `Person` inside a ring r 30). Labels 26 px under each: "colors", "type", "components", "accessibility" (fragments of You say).
- Clicks: (1) retitle, strip draws, groups fill left to right 0.16 apart.
- Reuse: `Swatch` from old act 2 `parts.tsx:23` if it draws these four kinds; the strip stays (carry) for 16–17 at 0.5 alpha (`dim`).

**16. 145 modules** `modules` — steps `tiles`, `into-app`
- Composition: strip dimmed at top (carry). WALL at (96, 520): 13 shelves, counts as given, 744 × 312, a 26 px soft count "145" is **not** shown (the title says it). App outline box(1120, 500, 640, 380) with top bar. From the wall, 14 tiles travel to a 5 × 3 grid inside the outline (pitch 120, origin (1180, 580)); the last gap is filled by two `Dashed` tiles (the new code).
- Clicks: (1) retitle, tiles light in one sweep column by column (`light` on the wall's `UnitGridLayout`, 1.4 s), shelves' rules draw behind. (2) outline draws; 14 tiles fly (copies at 64 px, `to` x/y with 0.05 stagger, 1.2 s); two dashed tiles wipe in.
- Reuse: `tileAt`, `TILES`, `SHELVES` from the old act 2 wall.

**17. The source data** `data` — step `table`
- Composition: strip, wall, app outline (carry). A table at box(96, 880, 744, 120): 4 columns × 3 rows of rule lines with short paper bars as cells. Three `Connector`s with heads: strip → outline (from (960, 460) down then right), wall → outline (from the wall's right edge), table → outline (from the table's right edge).
- Clicks: (1) retitle, table draws, three connectors draw 0.16 apart.
- **CHANGE**: the script puts the table "beside the tiles"; the wall already fills that width, so the table goes under the wall and its line runs up to the app. Same idea, no overlap.

**18. Monday meeting, Friday demo** `week` — steps `mon`, `tue`, `wed`, `thu`, `fri`
- Composition: everything from 15–17 hides. Five boxes 288 × 300, gap 48, x 240…1392, y 420, rx 12. Each holds one drawing, no words: Mon two `Person`s facing a third; Tue a plan sheet (rect with four lines) and a `Person` with a cross-out stroke on one line; Wed three `Agent` builders with rings filling; Thu an `Agent` tester and a tick; Fri a browser outline with a `Person` and a pointing hand (a short line to the screen).
- Clicks: one box per click: outline draws, drawing draws inside, box fills to 0.08 paper.
- **CHANGE**: the script's "five day boxes fill in" would read as five empty rectangles; put a drawing in each so the week reads without words. Day names are not on screen (the title carries Monday and Friday).

**19. The agents split up the work** `split` — steps `plan`, `streams`, `agents`
- Composition: plan tile box(880, 300, 160, 72) with an `Agent` planner at (960, 250) above it; `Person` at (1080, 300) with `HumanMark` at (1104, 380) (the plan is approved). BOARD: project bar box(256, 400, 1408, 40) and four rows of four cells from y 460. `FanOut` from the plan tile to the four row starts. Two dependency `Connector`s between cells of different rows (row 1 cell 2 → row 3 cell 1; row 2 cell 3 → row 4 cell 2), rule, with heads. Agents at cells: a builder at the first cell of each row, a tester beside the builder in rows 1 and 3, a reviewer in rows 2 and 4, a fixer standing at the board's right edge (1700, 640) idle.
- Clicks: (1) retitle; planner draws, its ring fills, plan tile draws, person draws, coral mark lands. (2) fan-out draws, board frame and rows draw, dependency links draw. (3) agents rise at their spots, 0.09 stagger; the four builders' rings begin to fill (to 0.4) and their first cells `fill` to 0.4.
- Reuse: `Board`, `FanOut`, `Connector`, `Agent`.

**20. Tested, and looked at** `tested` — steps `fail-fix`, `screens`
- Composition: board (carry). Row 2, cell 2 is the subject. Under the board, a grid of page screenshots at box(256, 880, 584, 160): 8 × 2 rects 64 × 36, gap 10. Two take a `Flag`. `Person` at (900, 880) looking at the grid.
- Clicks: (1) row 2 cell 2 fills then `fail`s (dashed, cross); the fixer travels from the board edge to the cell (1.2 s), its ring fills, the cell `clear`s and `pass`es (green tick). Fixer returns. (2) tester glyph at (200, 900) draws, the 16 small rects wipe in 0.05 apart; two flag; the two `fail` then `pass`; person draws, no coral (a check, not an approval).

**21. Two reviewers, then a person** `reviewed` — steps `one`, `all`
- Composition: board (carry); the camera frames row 1 cell 3 at scale 2.4 (`frame(plane, STAGE, cellBox, pad 200, max 2.4)`). Over that cell, two `Agent` reviewers (diamonds) at its top-left and top-right corners, and a `Person` at its right with a `HumanMark`. Each cell carries three 10 px marks under its bottom edge: two paper diamonds and one coral dot, hidden until click 2.
- Clicks: (1) retitle; camera moves in 1.2 s; reviewers draw, rings fill, coral mark lands. (2) camera returns to HOME; the two reviewers and the person `hide`; the three marks under every filled cell show in reading order, 0.03 stagger.
- Note: this is the talk's only in-world camera move. Max scale 2.4 keeps labels under 70 px.

**22. Lessons carry forward** `memory` — steps `memory`, `released`, `catalog`
- Composition: board (carry) `dim`s rows, keeps the project bar. Memory panel box(1400, 880, 424, 160) with a raised fill `#121936` and four paper lines rising inside (no words: lines 14 px tall). Project bar `fill`s as four packets travel up from the rows (`Packet` from each row's last cell to the bar). "Released" 32 px at (1680, 352) right-aligned at the bar's end with a `Flag` at (1664, 400). THUMB (288 × 144) catalog still lands centred on the bar at (816, 328).
- Clicks: (1) panel draws, four lines rise; a `Connector` from the panel up to the planner's tile draws (the next agent reads it). (2) four packets `send` to the bar, bar fills to 1, flag draws, "Released" rises. (3) thumbnail wipes in from the bottom onto the bar.

### Part 4. Sharing — world `sharing` (builder C)

**23. Add everyone's use cases** `together` — steps `strip-and-tiles`
- Composition: catalog strip: `ArtefactFrame` box(256, 340, 1408, 180) showing the top of `catalog-list.v2.webp` (strip height crops it). WALL at (588, 620), 744 × 312. Three `Connector`s from three entry positions on the strip (x 480, 960, 1440 at its bottom edge) down to three tiles, rule, no heads.
- Clicks: (1) title; strip wipes from top; tiles light in one sweep; three lines draw.

**24. Every department builds, every department reuses** `everyone` — steps `grid`, `travel`, `grow`
- Composition: 8 `Dept` circles in 4 × 2 at x 384, 768, 1152, 1536, y 480 and 760. Beside each, a 3 × 2 tile set (small tiles) at the circle's right, pitch 24. Two Packet routes: dept 1 → dept 6, dept 4 → dept 7.
- Clicks: (1) circles draw, each set shows its first two tiles. (2) two tiles travel (`send`) between departments. (3) every set fills to six tiles, 0.05 stagger.

**25. Your agents adapt it to where you run** `adapt` — steps `azure`, `rework`, `approve`, `library`
- Composition: large tile 160 × 160 at (520, 480) labelled "Azure" (26 px under). `Agent` builder at (960, 560), its ring. Second tile at (1200, 480) starts hidden, label "AWS". `Person` at (1500, 528), `HumanMark` at (1524, 620). A library shelf: a rule at y 900 from 256 to 1664 with eight small tiles on it from x 300 at 48 pitch; two gaps at its right end.
- Clicks: (1) title; Azure tile and label draw. (2) agent draws, ring fills; a copy of the tile travels right (1.2 s) and its label fades to "AWS" (two `Block`s at the same place: hide one, show the other). (3) person draws, coral mark lands. (4) both tiles scale to small (`--s`) and travel to the two gaps on the shelf.

**26. Share more than code** `more` — steps `types`, `help`
- Composition: `ArtefactFrame` at E_LEFT with a still of the form's "Type of solution" section. **New still needed:** `submit-form-type.v1.webp`; the existing `submit-form.v2.webp` shows the data section. Six `InkRing`s on the choices. Right of it at x 1200–1824: two `Dept` circles at (1360, 560) and (1680, 560); two `Connector`s with heads between them, one above (left→right) and one below (right→left), both `tone="paper"`.
- Clicks: (1) frame wipes; six rings draw 0.2 apart. (2) frame `dim`s; circles draw; the two lines draw 0.3 apart with a `Packet` on each.
- **CHANGE**: if the still cannot be captured, draw the list: six rule rects 400 × 44 at (160, 400) 56 pitch, each with a radio circle, no words, and ring them. Same picture, no screenshot.

**27. The more we share, the more we can do** `network` — steps `austin`, `join`, `outside`, `thin`
- Composition: centre `Dept`-style ring at (960, 600), r 60 then growing to r 120 (`--s` on a `Part` with origin at centre). Departments on a ring of radius 320: Austin first at angle −90° (top), labelled "Austin" 26 px, paper stroke; eleven more at 30° steps. Each joins the centre with a rule `Connector`, no head. Inside the centre, small tiles appear as the centre grows (a 3 × 3 grid, pitch 28). Outside, three `Node`s "Vendors" (box(96, 420, 240, 72)), "Budgets" (box(96, 620, 240, 72)), "Budget cuts" (box(96, 820, 240, 72)); from each, heavy 6 px rule lines to every department (36 lines; draw them as one `Part` per node, `draw` staggered).
- Clicks: (1) centre draws at r 60; Austin draws, its line draws, three tiles show in the centre. (2) five more departments and lines draw (0.16 stagger); centre scales to r 90, five more tiles. (3) the three nodes draw; heavy lines draw to all six departments, 1.2 s. (4) six more departments and lines draw; centre to r 120, full 3 × 3 tiles; all heavy lines `to` stroke-width 2 and `dim` to 0.45 (a `--w` custom property driving `stroke-width` so it compiles).
- No numbers anywhere. The centre's growth is the only "chart".

**28. More capable, less dependent** `two-lines` — steps `axis`, `lines`
- Composition: network hides. Axis: a rule from (256, 820) to (1664, 820) with an arrowhead; "More departments sharing" 32 px soft centred under it at y 860. No y axis, no ticks, no numbers. Two paths drawn with `draw`: rising curve from (300, 760) to (1620, 380), paper 4 px; falling curve from (300, 420) to (1620, 760), paper 4 px dashed 14/10 (**not** a colour). A 26 px label at each line's end, fragments of You say: "what we can build for ourselves" at (1640, 370); "what we depend on vendors and budgets for" at (1640, 770), left-aligned, wrapped in two lines by the author.
- Clicks: (1) axis draws, label rises. (2) rising line draws (1.2 s) with its label; falling line draws with its label, 0.3 later.
- Because a dashed stroke cannot stroke-draw, make the falling line a `Dashed`-style HTML part that `wipe`s from left (the kit's rule, `kit/dashed.tsx`).

### Part 5. What we're releasing — world `releasing` (builder D)

**29. What we're releasing** `releasing` — steps `skills`, `code`, `design`, `workshops`
- Composition: four panels 384 × 520 at x 120, 552, 984, 1416, y 400, rx 12, rule outline, raised fill. Heading inside each at top (32 px paper, two lines max): "Our agentic skills." / "Our source code." / "How to build a design system." / "Workshops." Under each heading, its drawing: a package (rect 160 × 120 with a tie line); a shelf of six tiles; the design strip (small); the table and people (small).
- Clicks: one panel per click: outline draws, heading rises, drawing draws.

**30. Our agentic skills, in December** `skills` — steps `fold`, `drop`
- Composition: STEPS6 drawn small at 0.6 (`Part` with origin), y 380, centred. A package box 240 × 180 at (840, 440) rx 12. Three tool outlines (rounded rects 320 × 200 with a top bar, no names) at x 256, 800, 1344, y 740.
- Clicks: (1) six boxes `to` the package's centre with `--s` 0.2 and fade; the package draws and fills to 0.1. (2) three outlines draw; three copies of the package (small, 96 × 72) travel down into them 0.16 apart.

**31. Our source code, once it's cleared** `source` — steps `wait`, `move`
- Composition: `ArtefactFrame` at box(760, 340, 1064, 500) with `catalog-list.v2.webp`. Left: three tile groups (3 × 2 small tiles each) at (160, 420), (160, 560), (160, 700), with a `Dashed` outline round all three and a `Tag` "Once cleared" at (160, 360).
- Clicks: (1) frame wipes, groups show, dashed outline wipes, tag shows. (2) tag and outline hide; groups travel into three entry positions on the still (x 1100, y 420/560/700), landing as `InkRing`s drawn round those entries.

**32. How to build your own design system** `design-yours` — steps `open`, `yours`
- Composition: the strip from slide 15 at box(96, 360, 1728, 120). Four labels under it. Below, a second empty strip at box(96, 640, 1728, 120) with "Yours" 32 px at (96, 600).
- Clicks: (1) strip draws, four groups fill (as 15). (2) "Yours" rises; the empty strip's outline draws; four faint copies of the groups wipe in at 0.45 alpha.

**33. Workshops** `workshops` — step `table`
- Composition: a table: ellipse rx 420 ry 140 centred (960, 660), rule stroke. Five `Person`s around it at angles −90, −30, 30, 150, 210 (radius 480/200), each with an `Agent` builder 60 px to their outer side. `Tag` "Planned" at (960, 400) centred.
- Clicks: (1) table draws, people draw 0.1 apart, agents draw 0.1 apart, tag shows.

### Part 6. How your department starts — world `start` (builder E)

**34. Three steps** `three` — steps `one`, `two`, `three`
- Composition: three lines of the title's own words set as three `SetText` blocks size `medium` (48 px) at (160, 400), (160, 560), (160, 720), each with a short rule 64 px to its left at the line's middle. The on-screen line is the whole title; it is shown as three stacked lines, not a one-line title.
- Clicks: one line per click: rule draws, line rises.

**35. Step one** `step-one` — steps `submit`, `communities`
- Composition: `ArtefactFrame` at box(256, 340, 1408, 300) with the catalog grid's end (`catalog-page-11.v2.webp` strip) and a `Dashed` empty slot (reuse `SAMPLES.slot` pattern). ROW6 docked at y 860. Card travels all six wells (1.8 s) then rises as a `Packet` up into the slot, which `fill`s. Click 2: frame and row hide; "Your department" `Dept` (paper) at (960, 600); six `Dept`s around (r 320) and two `Node`s "work group" at (256, 420) and (1420, 420); rule `Connector`s from the centre to all eight, no heads.
- Clicks: (1) frame wipes, row draws, card travels, slot fills. (2) hides; centre draws; eight lines and circles draw 0.09 apart.

**36. Step two: train your people** `training` — steps `in`, `out`
- Composition: room: rule rect box(760, 400, 400, 320) with a door gap on each side. Three `Person`s start at x 240, 330, 420, y 528. They travel into the room (to x 820…). Then out to x 1300, 1440, 1580, each with an `Agent` builder appearing beside them (r 22, at +70 x). `Node` "GitHub" box(1360, 360, 200, 60) above them.
- Clicks: (1) room draws; three people draw and travel in (1.2 s). (2) three people travel out; agents rise beside each; GitHub node draws with a leader down to the group (no head).

**36a. Step two: GitHub** `github` — steps `department`, `pieces`
- Composition: `Dashed` outline box(560, 420, 800, 360) labelled "Your department" (32 px at (560, 380)). Around it three `Node`s with fragments of You say: "organization account" box(160, 420, 320, 72), "accounts for the people" box(160, 560, 320, 72), "permission to create projects" box(160, 700, 320, 72); each joined by a `Connector` with a head into the outline. Inside the outline, a history line y 700 from 600 to 1320 with three coral marks (approvals on record).
- Clicks: (1) outline wipes, label rises. (2) three nodes rise and their lines draw 0.16 apart; history line draws, marks show.

**37. Step two: AI coding tools** `tools` — steps `pass`, `arrive`
- Composition: a tool outline (rounded rect 240 × 150 with top bar) at (160, 500). Two wells from `stations({ id: "buy", x: 560, y: 560, headings: ["Purchased", "Approved"] })`, no `human` (institutional approval, paper, not coral). The dashed "Your department" outline from 36a at box(1160, 400, 600, 400) with three `Person`s inside at y 560.
- Clicks: (1) outline draws; wells draw; the tool travels (as the row's `CardToken`) Purchased → Approved → into the department outline, each well filling behind it. (2) an `Agent` rises beside each person.

**38. Step two: a person who approves** `approver` — step `line`, `sides`
- Composition: ROW6 at y 560. A vertical rule from (1192, 440) to (1192, 720), between Checks and Approval. Left of it above the row: three `Agent`s (builder, tester, reviewer) at x 640, 760, 880, y 420. Right: `Person` at (1472, 400) with `HumanMark` at (1496, 500). The Approval well's coral outline.
- Clicks: (1) row draws; the line draws top to bottom. (2) agents rise on the left; person draws, coral outline draws, coral mark lands.

**38a. The questions your IT and security teams will ask** `questions` — steps `q1`, `q2`, `q3`, `q4`
- Composition: four questions as `Block` 32 px paper in the left column x 96 w 760 at y 400, 540, 680, 820 (each one line). Beside each at x 960 w 864, the answer in 32 px soft, verbatim fragments of You say, at most one line: "Start with public data." / "A named person approves every change." / "Tests, two AI reviewers and a person check every change." / "Someone technical to help with setup." A 2.5 px rule between the columns from (912, 380) to (912, 880).
- Clicks: (1) rule draws, question 1 rises, answer slides in from +60 x (`to` x). (2–4) same for 2–4.
- Here the title is the first question; the other three are in the body. **CHANGE**: the four questions set as the body list rather than a four-line title, so each question and answer pair appears on its own click as the script asks.

**38b. No tech staff?** `fde` — steps `queue`, `sits`, `build`, `back`
- Composition: `Dashed` "Your department" box(96, 420, 640, 400) with three `Person`s at x 200, 330, 460, y 560. `Dashed` "IT" (fragment of You say: "central IT") box(1184, 420, 640, 400) with three `Person`s at x 1300, 1430, 1560, y 560. Between them, a queue: eight small cards 80 × 32 in a row at y 600 from x 780 at 52 pitch. One engineer `Person` (paper, no mark) at (1430, 560) travels to (590, 560). A tool outline 200 × 130 drawn between the engineer and the staff at (330, 700). On click 4 the engineer `ghost`s and a second tool outline draws beside the first.
- Clicks: (1) outlines wipe, people draw, queue cards show. (2) engineer travels left, 1.4 s. (3) tool outline draws, fills to 0.1. (4) engineer ghosts; a second outline draws.

**39. Step three: low risk, high return** `low-risk` — steps `pile`, `tool`, `path`
- Composition: left: a scatter of twelve small sheet rects (three kinds by their inner lines: a list, a clock-like ring, a checkbox row) at fixed positions in box(96, 400, 560, 360), no rotation. `Agent` builder at (800, 580). A tool outline box(960, 420, 480, 320) with three list rows. Residents: six small `Person`s (0.6 scale, no label) travelling from (1560, 760) to three service `Node`s (rects 120 × 48, no words) inside the tool. Path: rule from (96, 940) to (1824, 940); the first project a filled circle r 12 at (200, 940) with the small tool outline above it; the rest dashed (HTML `Dashed` strip wiped left to right).
- Clicks: (1) sheets show 0.05 apart. (2) agent draws, ring fills; sheets travel into the tool and become its three rows (the sheets hide as the rows fill); residents travel in and the three nodes fill. (3) path draws to x 260; dashed rest wipes.

**40. Two examples from Austin** `examples` — steps `catalog`, `helpline`, `services`
- Composition: path (carry, at y 940). Two frames: left box(96, 340, 800, 450), right box(1024, 340, 800, 450). If grayscale stills of the two live sites can be captured, use `ArtefactFrame` with an `InkRing` on the matching results; otherwise line drawings: left, three question rows with a radio each and a results column of five rects, three of which `fill`; right, a `Waveform` at top and a list of three rects that `rise`. Under both, three service `Node`s on the path area at x 560, 960, 1360, y 860, with `Connector`s from each frame's bottom to them; the nodes fill with small `Person`s.
- Clicks: (1) left frame; rows rise, three results fill. (2) right frame; waveform rises, list rises. (3) connectors draw, nodes fill with people 0.09 apart.
- **New stills wanted:** `service-catalog.v1.webp`, `helpline.v1.webp`, captured in grayscale like the others. Build the drawn version first; swap in stills if they exist.

**41. Then ramp up** `ramp` — steps `bigger`, `join`
- Composition: path (carry) and frames hide. Along the path at x 500, 800, 1150, blocks 120 × 80, 160 × 110, 220 × 150 above the line, filling in turn. At the right end (1500, 760) the small network from 27 (centre r 36, six departments r 18 on a ring of 140); "Your department" circle travels from the path's end up into the ring and a small tile travels from it into the centre.
- Clicks: (1) three blocks draw and fill 0.3 apart. (2) network draws; your department travels in; tile travels to centre.

**42. Our ask** `ask` — steps `share`, `set-up`, `skills`, `share-back`
- Composition: network (carry) travels to the left, centre at (480, 620), r 72 centre and 300 ring. Right column x 1000–1824: four lines 32 px paper at y 420, 540, 660, 780 (the title's four sentences; the title itself is shown in one line at 152, so the body lines **repeat its four sentences one per click** — that is the script's "the four requests appear one at a time"). Each line has a leader (no head) to the thing it lights: a catalog entry marker on the ring (a small rect at the top department), your department circle, a small package rect at (480, 960), the centre.
- Clicks: one per request: line rises, leader draws, target `fill`s to paper or its stroke goes to paper 3 px.

### Part 7. Agentic presenting — world `close` (builder D)

**43. Agentic presenting** `agentic` — steps `wave`, `agents`
- Composition: `Waveform` centred, 24 bars at pitch 14, box(792, 500, 336, 80). Twenty-four `Agent` glyphs (builder, with no label, r 14) hidden at the bars' positions. The 45-cell finale grid (slide 44) is already in this scene, hidden.
- Clicks: (1) title; bars rise with heights from the fixed array, 0.03 stagger. (2) bars `hide` as glyphs `show` in their places; the glyphs travel (1.4 s, 0.03 stagger) to 24 of the 45 grid cells' centres and `hide` as they land.
- **CHANGE**: "move off into the slides" is given a destination: the agents fly to where the slides are about to appear, so 43 hands to 44 and nothing leaves the stage for nowhere.

**44. Thank you** `thanks` — steps `pictures`, `line`, `thanks`
- Composition: grid of 45 `ArtefactFrame`s 176 × 99 at (104, 360), 9 × 5, gap 16, each holding `public/talks/bchc/finale/NN.v1.webp`. Closing lines size `medium` at (96, 152) "One city proves value." and (96, 240) "Every city starts further ahead." "Thank you. Austin Public Health." 32 px at (96, 980).
- Clicks: (1) retitle to the two lines; the 45 frames wipe in, in reading order, 0.03 stagger (1.4 s). (2) camera `frame`s the grid at scale 1.08 then back to HOME over 1.2 s: this is the "pull back" the script asks for, done as the whole set drawing the eye once. If it reads as fidgeting in review, drop it; the grid alone is the picture. (3) "Thank you. Austin Public Health." rises.

---

## 5. The traps

1. **Private vocabulary creeps back in.** A builder adds a label to make a picture "clearer": "sprint", "gate", "ledger", "station", a count. Rule: a word may be on screen only if it is the slide's On screen line or a label this plan lists for that slide (each one traceable to the script's They see or a quoted fragment of You say). The script module's `shown()` is the only source of strings; a literal string in a scene file fails review.

2. **Carry-over clutter.** Something from the last slide is still there because nobody hid it, and three slides later the stage is a collage. Rule: click 1 of every slide hides everything not marked **(carry)** in this plan at `at: 0`, before the retitle. A reviewer stepping to any slide's click 1 and counting more than seven parts on stage sends it back. Jumping to a slide by its address (`?w=start&s=ask.share`-style) must show the same clean picture.

3. **Everything moves at once.** Ten things rising together with one stagger reads as a screen refresh, not an explanation. Rule: one subject per click, at most three moves plus hides, finished inside 2 s, and each move is one of the five in the grammar. If the They see for a click lists more than that (slide 27 click 3's 36 lines), group them into one `Part` and draw the part.

4. **Agents, people and approvals blur.** A circle that is sometimes a person, sometimes an agent, sometimes a department; coral used for "important". Rule: `Person` for every human, `Agent` for every AI (shape = role), `Dept` for every department, `Tile` for every module; coral only through `HumanMark`, the Approval station's outline, the two person boxes in STEPS6, and approval marks on a history line. Grep the world's CSS and scenes for `--dk-human`: every hit must be one of those four.

5. **Pictures that do not compile.** A CSS `transition`, a `setTimeout`, a dashed path "drawn" with dash offset, random tile positions, a label that measures its own width: each one breaks the parity check or looks different on a cut. Rule: every visible state is written through a move's `on`/`off`; dashed things are HTML parts that `wipe`; positions are literal numbers in the layout file; `deck-check.mjs` runs green at 1920 × 1080, 1366 × 768 and 1280 × 720 before the world is handed in.
