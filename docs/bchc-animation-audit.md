# BCHC animation depth audit (2026-10-09)

Read-only audit of the built slides against the script's They see lines, the art direction and the flow revision. Slide numbers are from script draft 5/6; where draft 6 changed a slide, the script wins.

No moves were lost in the cut from 129 clicks to 48. I compared every world at the 129-click version (`a97cf1b`) with HEAD and with the working tree, and every v1 move is still there, plus the nine story fixes from the flow revision. The depth was never in v1 to begin with. v1 followed the old art-direction rule of one subject per click, at most three moves, finished inside 2 s, so each click was a small gesture the speaker talked over. The fold chained those gestures and put story lines where the speaker's words used to be. It added no motion, so what happens between beats (who does what, and what changes because of it) is missing. That hits hardest on 5, 19, 21, 24 and 35. A few things in the script's "They see" were never built in any version: the agent-film workstreams on 19, the pull-back on 44, and the question turning into a list on 40.

Caveat: the build world files (`world.ts`, `layout-board.ts`, `scene-board.tsx`) had uncommitted edits from another agent while I worked. I audited them as they stood; for example, the person approving the release on slide 22 is already in.

## 1. Agreed vs built

| # | id | Agreed motion | Built motion | Gap | Sev |
|---|---|---|---|---|---|
| 1 | title | credit lines, empty browser frame draws | same, plus story lines | none | – |
| 2 | the-catalog | page wipes into frame, address | same | none | – |
| 3 | find | Search, Filter, Compare circled one at a time | rings 1.4 s apart | none | – |
| 4 | entry | entry ringed, six fields one at a time | fields 0.5 s apart | none | – |
| 5 | six-steps | card moves through the six boxes "as you talk"; "automatic" over Draft/Checks; person at Approval | card runs Form to Live in 1.8 s with 0.26 s hops, Live lights, **then** "automatic", **then** the person approves (`catalog/steps-catalog.ts:97-100`, `moves.ts:49-61`) | The card goes live before anyone approves it, which contradicts story line B. The card never stops at the stations it is explaining. | high |
| 6 | approved | ticks, Approved, catalog page, Published | same | none | – |
| 7 | review | privacy ring, flag, person and agent type, then the card goes on to Live | same | none | – |
| 8 | nothing-to-run | three boxes, gone, files, hosting | same | none | – |
| 9 | three-days | three blocks fill, odd-hour marks | same | the tick marks mean nothing on their own (list 3) | low |
| 10 | proof | small catalog picture travels, people, agents, labels | same | none | – |
| 11 | too-long | line crawls, runs off the edge, loops, pile | same | none | – |
| 12 | ai-builds | bubble; agent fills the app with tiles; person approves | same | none | – |
| 13 | yours | ring, "Yours", history line, fifth approval | same | none | – |
| 14 | rad | six steps, two coral, people | same | none | – |
| 15 | design | strip, four groups fill | same | none | – |
| 16 | modules | wall lights, tiles fly, new code | same | none | – |
| 17 | data | table, three lines into the app, app fills | same | none | – |
| 18 | week | five days, each with a drawing and a label | each day lands whole in 0.9 s; nothing happens inside a box | drawings are static vignettes | low |
| 19 | split | "same style as the agent film": plan splits into workstreams, agents of each role working along them | planner, approval, fan-out, board; agents rise and stay in the label column; builder rings and first cells fill to 0.4; row dots never shown (`build/world.ts:218-248`; the kit's `work` verb, `kit/verbs.ts:48`, is used nowhere in the deck) | No work moves along any workstream. The film's moving dots and filling cells (which the owner loves) are absent. The board is a still diagram. | high |
| 20 | tested | fail and fix; screenshot grid; two flagged and fixed; person looks | same; screens are 46×30 and fail-to-pass takes 0.6 s with nobody acting (`world.ts:277-279`) | the screenshot fix is tiny and has no cause | low |
| 21 | reviewed | one piece checked by two reviewers and a person; pull back; every piece carries the same three marks | camera in, reviewers appear, person and mark; camera out, all cells fill 0.03 apart, marks appear (`world.ts:287-318`) | The close-up never produces the three marks, so the marks seen after the pull-back come from nowhere. Reviewers appear but do nothing. | med |
| 22 | memory | memory fills; work flows to the bar; Released; catalog lands on it | same, plus the person approving the release; catalog thumbnail lands on the bar (`world.ts:354`, `layout-board.ts:209`) | Shows the process's output as "the catalog". That contradicts v2 story B ("same process builds tools, data pipelines and more") and the two-things doc. | med |
| 23 | together | catalog strip, module wall, links | catalog strip on top, wall under it, links drawn down from entries to modules, linked tiles light (`sharing/beats.ts:41-61`, `sharing/layout.ts:77-98`) | Literally draws the catalog sitting on top of the process. No department posts and no department pulls. | high |
| 24 | everyone | departments, tiles travel between them, sets grow | 2 direct department-to-department trips, then all 8 sets grow at once (`beats.ts:63-90`, `layout.ts:116-151`) | No catalog and no process in the flow. Reuse is shown only twice. The growth isn't caused by anything. | high |
| 25 | adapt | Azure tile; agent reworks it to AWS; approve; back into the library | as agreed; small copies go to an unnamed shelf (`layout.ts:167-200`, `beats.ts:113-124`) | V2 story B says "back into the catalog" but the picture shows a shelf. The tile is never shown coming from the catalog. | med |
| 26 | more | six labelled solution types circled; help both ways | same | none | – |
| 27 | network (2 clicks) | Austin; more join; outside ties; thin | same | none | – |
| 28 | two-lines | axis, rising line, falling line with "$" | same | none | – |
| 29 | releasing | four panels one at a time | same | none | – |
| 30 | skills | six steps fold into a package; copies drop into three tools | six wordless 0.6-scale boxes fold (`releasing/layout.ts:80-100`) | A cold viewer can't tell what folds. Only the coral on boxes 4 and 5 hints at slide 14. | med |
| 31 | source | groups wait "Once cleared", then move in as entries | same | none (matches v2 "share our source code on the catalog") | – |
| 32 | design-yours | our strip; "Yours" strip fills faintly | same | none | – |
| 33 | workshops | table, people, agents, Planned | same | none | – |
| 34 | three | three lines one at a time | 1.4 s apart | none | – |
| 35 | step-one | submission moves through the six steps and fills the empty spot; communities | card glides Form to Live in one 1.8 s move with no well fills and no stop at Approval, though Approval's coral outline is drawn (`start/steps-steps.ts:62-72`) | Undoes the lesson of 5 and 38. Nothing happens at Approval. | med |
| 36 | training | in to the room; out with agents; GitHub | same | none | – |
| 36a | github | outline; three pieces; history marks | same | none | – |
| 37 | tools | Purchased, Approved, into the department; agents | same | none | – |
| 38 | approver | card stops at the line, person marks, card crosses | same | none | – |
| 38a | questions | four questions, answers slide in | 2.4 s apart | none | – |
| 38b | fde | queue; engineer sits down; build together; steps back | tool draws and fills by itself; staff do nothing (`steps-steps.ts:253-256`) | "build together" isn't shown | low |
| 39 | low-risk | pile; agent makes the tool; residents; path | same | none | – |
| 40 | examples | answers light matches; spoken question turns into a list; services fill | drawn stand-ins; waveform and list rise separately (`steps-path.ts:82-91`) | no "turns into" | low |
| 41 | ramp | bigger blocks; joins network; adds module | same | none | – |
| 42 | ask | four requests, each lights its part | same | none | – |
| 43 | agentic | waveform turns into agents that fly off and stay | same | the destination cells are empty until 44 (list 3) | low |
| 44 | thanks | "The view pulls back to show every picture at once" | grid wipes in at normal view; camera pushes in to 1.08 and back (`close/world.ts:76`, `close/layout.ts:83`) | There is no pull-back. The motion is a push-in that reads as fidgeting. | med |

## 2. Fix specs (high and med)

**Slide 5 (`catalog/steps-catalog.ts:86-102`, `catalog/moves.ts`)**
- Split `cardTravels` into a hop function, e.g. `cardHop(from, to, at)`, that wipes the left well's `doneKey`.
- 0.3: row draws. 1.2: story A.
- 2.2: card arrives in Form (0.5). Then it hops Request, Draft, Checks at 0.4 each with a 0.15 pause.
- 3.6: the bracket draws under Draft and Checks (0.6) while the card is in them; "automatic" rises at 4.0.
- 4.6: card hops into Approval and stops.
- 5.1: coral outline draws (`personDecides`). 5.4: person draws. 6.2: coral mark lands.
- 7.0: card hops to Live (0.4). 7.4: `liveLights` and story B together.
- Ends about 8.2 s. The end state is unchanged, so slide 6's docking is unaffected.

**Slide 19 (`build/world.ts:242-246`; `layout-board.ts:88-95`)**
- Replace the two 0.4 fills (`fill(BUILDER_KEY…)`, `fill(FIRST_CELLS…)`) with a work beat that starts 0.5 s after the agents land.
- Each row's dot runs `work(row, 0)` (kit verb: the cell fills and the dot rides the fill front, 0.75 s), rows starting 0.3 apart so the streams read as parallel.
- At the same time each builder's ring fills to 1. This needs per-builder sub-ids under `BUILDER_KEY`.
- When cell 0 lands in tester rows 1 and 3, `pass` it (green tick, a passed check).
- Then rows 1, 3 and 4 run `work(row, 1)`. Leave row 2 cell 1 empty: it is slide 20's `FIXED` cell.
- About 2.6 s added, so the chain ends about 10.4 s. Story B stays where it is.
- Slide 20 then drives `FIXED` with `work(ROWS[1], 1)` in place of the bare `fill` at `world.ts:258`. Slide 21's pull-back adds `rest(row)` for all four dots.

**Slide 21 (`world.ts:298-312`; `layout-board.ts:164`)**
- Give the reviewed cell's three marks their own ids, e.g. `reviewed.marks.own.0/1/2`, and take them out of the shared `MARKS.key`.
- Inside the existing beats, with no added length:
  - As reviewer A's ring completes (about 2.2), its paper diamond drops from the reviewer to its slot under the cell (`to` y, 0.4).
  - Reviewer B's diamond follows 0.2 later.
  - 0.4 after the person's coral mark (about 4.0), a coral dot drops into the third slot.
- The pull-back then shows the same three marks appearing under every other cell, so the link is visible.
- Optional: fill the cells 0.08 apart, not 0.03 (still under 1.3 s).

**Slide 22 (`world.ts:354`; `layout-board.ts:209`; `scene-board.tsx`)**
- Replace the single catalog thumbnail with three or four wordless products rising off the right half of the bar, 0.16 apart (rise, 0.75):
  - a small app outline (the slide 16/17 app),
  - a pipeline (three small Nodes joined by Connectors),
  - a dashboard (three bars in an outline),
  - optionally the catalog thumbnail at 0.5 scale as one product among them.
- Adds about 0.5 s. Shows that the process builds many things, matching v2 story B and the two-things doc.

**Slide 23 (`sharing/layout.ts:77-98`, `sharing/scene.tsx`, `sharing/beats.ts:41-61`, `sharing/world.test.ts`)**
- Remove the wall and the links.
- Keep the catalog strip at box(256, 440, 1408, 180) with a Dashed empty slot at about box(1440, 470, 180, 120).
- Dept A (r 48) at (420, 800) with a 3×2 tile set.
- Dept B (r 48) at (1180, 800) with the six steps at 0.35 scale (about 90×48 boxes, coral on boxes 4 and 5, x 1240–1820, y 776) as "its process".
- Beats:
  - 0.95: title. 1.3: strip wipes from the top (0.75). 1.5: story A.
  - 2.3: Dept A draws (0.8) and its tiles fill 0.05 apart.
  - 3.3: one of A's tiles travels up into the slot (1.2, EASE.page) and an ink ring draws round it (0.6): posted.
  - 5.1: Dept B draws; its small row draws left to right (0.6, 0.06 apart).
  - 5.6: story B rises with the next beat.
  - 6.4: a copy leaves the slot (the original stays) and travels to B's first box (1.2).
  - 7.6: it hops box to box (0.25 each); a small coral mark lands under each coral box.
  - At the last box the copy swaps for a tile with a Dashed corner. Dashed is slide 16's sign for new code, so it reads as adapted.
  - 9.4: the copy travels into B's set (0.7).
- Ends about 10.3 s. No new words.

**Slide 24 (`layout.ts:100-151`, `beats.ts:63-90`)**
- Add a catalog band as the hub between the two rows of departments: the same still cropped, box(256, 700, 1408, 64).
- Move `GRID_Y` to [560, 900].
- Beats:
  - 0.3: eight departments draw with their first two tiles (as now). 0.6: story A.
  - 1.6: band wipes from the left (0.75).
  - 2.6: posting wave. Departments 0, 3, 5 and 6 each send a tile into the band at four x positions (1.0, 0.12 apart). The tiles stay.
  - 4.0: pulling wave. Copies leave the band for departments 1, 2, 4 and 7 (1.0, 0.12 apart). As each lands, that department's ring fills briefly (0.3, its process adapting) and its set grows to six, 0.04 apart, in landing order.
  - 5.0: story B.
  - 6.2: the givers' sets grow.
- Ends about 7.5 s. Replace `TRIPS`/`RECEIVED` with post and pull lists. One exception to raise: the art direction says departments don't fill. Either clear that with the owner, or use a 0.3 dim-and-solid blink instead.

**Slide 25 (`layout.ts:167-200`, `beats.ts:93-126`)**
- Replace the shelf with the catalog band at the foot, box(256, 880, 1408, 96), with two empty slots at its right.
- New first beat: 0.3, band wipes (0.75). 0.9: the Azure tile rises out of a band entry to (520, 560), scaling from small to 160 (1.2). "Azure" rises at 2.0. This shows it was pulled from the catalog.
- The existing rework, approval and story beats follow.
- Last beat: a small copy of the AWS tile travels into the slot beside the Azure entry (1.2) and an ink ring draws round it (0.6). Both big tiles keep their labels.
- Ends about 9.5 s. Matches v2 story B ("back into the catalog").

**Slide 30 (`releasing/world.ts:66-104`, `releasing/layout.ts:80-100`)**
- Open on the full-size six steps with their words, exactly as slide 14 (`STEPS6` at y 520, coral on 4 and 5), drawing 0.06 apart (0.9).
- Hold 1.2 s with story A.
- Then the boxes shrink to 0.6 (0.5) and fold into the package as now.
- Adds about 1.6 s, so about 7.8 s total. A cold viewer recognises the RAD steps before they become the package.

**Slide 35 (`start/steps-steps.ts:61-72`)**
- Move `draw(row.humanKey)` out of the row beat.
- Card hops well to well (0.3 each, wiping each `doneKey` behind it) and stops in Approval.
- Coral outline draws then (0.6) and holds 0.3. Card hops to Live; `litKey` shows.
- Then the packet rises to the slot as now.
- Adds about 1.3 s, so about 9.3 s.

**Slide 44 (`close/world.ts:58-82`, `close/layout.ts`, `capture-finale.mjs`)**
- Make it a real pull-back with the kit's `spread` (`kit/verbs.ts`), not the 1.08 camera push.
- Capture one full-size grayscale still of slide 1. `capture-finale.mjs` currently writes only 352×198.
- 0: hide story and title.
- 0.2: the hero still (full stage, 1920×1080 ArtefactFrame) wipes in (0.6).
- 1.2: `spread(hero, multiples)` shrinks it into cell 0 (1.6, EASE.page) while the other 44 stills arrive and the agents hide under them.
- 3.0: retitle to the two closing lines. 4.4: "Thank you…" rises.
- Ends about 5.2 s. Remove `PULL`. The camera then moves only on 21, which is within the "exactly twice" rule.

## 3. Motion with no story for a cold viewer

- 9: eight odd-hour ticks (`steps-catalog.ts:193`), unlabelled.
- 19: dependency arrows `DEP` (`build/world.ts:239`) with no label or line explaining them. Rings and first cells parked at 0.4 (`:244`) read as a frozen half state.
- 20: two screens fail then pass in 0.6 s with no agent acting (`:277-279`).
- 21: 16 cells fill 0.03 apart (`:307-310`), which reads as a screen refresh.
- 22: the plan tile reappears, takes a line from the memory panel, then vanishes (`:336`, `:354`). The memory "lessons" are wordless bars.
- 24: all eight sets grow at once with no visible cause (`beats.ts:87`).
- 30: six wordless boxes fold (`releasing/layout.ts:80`).
- 42: the "package" rect fills (`steps-path.ts:161`), but nothing on screen says it is the skills package.
- 43: agents fly to empty, undrawn grid cells (`close/world.ts:46`).
- 44: camera push to 1.08 and back (`close/world.ts:76`).

## Two-things check, slides 14–31

- 23: shows the catalog on top of the process (strip over the module wall, links down into modules). High; spec above.
- 24: no catalog or process in the flow; departments swap tiles directly. Spec above.
- 25: the result goes to an unnamed shelf, not the catalog. Spec above.
- 22: the catalog thumbnail is presented as the product of the release. Spec above.
- 14–21, 26–31: no catalog-inside-process imagery found. 31 (code groups move into the catalog as entries) matches the v2 title.
