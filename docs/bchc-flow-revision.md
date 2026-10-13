# Flow revision: "Using AI in Public Health Practice"

Revises `docs/bchc-art-direction.md` after the owner's click-through. Everything in that plan stands (colour roles, coral only for a person approving, the kit glyphs, no provider colours, no CSS transitions, no randomness, the carries, the layouts) unless this document says otherwise. Section 1 of the art direction ("one subject per click, at most three moves, inside 2 s") is replaced by section 1 below.

The owner's three asks, in his words: "way too many clicks when it should be more fluid animation and stop on the money slide for each section"; "more text on screen that's kind of explaining the story", for "someone watching it without the background of me speaking"; and on slide 28 "a dollar sign that rides the line that goes down".

Today: 129 clicks. This plan: **48 clicks** (47 slides, one click each, plus a second click on slide 27). Nothing is merged or cut; the reasons are in section 2.

Files referenced are under `/Users/crypticpy/orca/workspaces/AEP_LandingPage/Presentation/` unless given in full.

---

## 1. Motion rules (replace art direction section 1, "Motion grammar")

**One click, one slide.** A click brings the whole slide: its title, its drawing, its story lines, in a chain that plays on its own. The chain is one `StepDef` whose moves carry explicit `at` times. The engine already runs this: `engine/compile.ts` puts no cap on a step, `engine/driver.ts` lands the step at its last move's end, and a cut (back, jump, reload) sets the compiled end state. No engine change is needed for chaining (section 6 lists what does change: tests, the parity checker, the script module and two small kit helpers).

**A big phase may take two clicks.** Only where the audience must sit on a half-finished picture while the speaker makes a point that the second half answers. In this deck that is slide 27 alone (the middle grows; then the things we don't control appear and thin). Every other slide is one click. Total: 48.

**How long a click may run.** The longest chain is **12 s** from the click (the first slide of a world counts its 0.95 s arrival fade inside that). Most chains run 5 to 9 s. A chain never ends on a hold: its last move is a drawing or a story line, and the picture simply stays.

**Holds, so the audience can read.**
- `READ` = 1.6 s: after a story line lands, nothing new starts for 1.6 s, unless the next beat is the thing the line describes, in which case they start together.
- `GAP` = 0.5 s between one drawing beat finishing and the next starting.
- A label on a drawing (26 px) needs no hold of its own; it arrives inside its beat.
- No silence longer than **3 s** inside a chain (a test checks this, section 6), so the deck never looks stuck.

**Rhythm inside a chain.** The five house moves stay (`draw` 0.9, `rise` 0.75, `fill` 0.75, travel 1.2, `hide`/`dim` 0.4). A beat is one subject's moves, staggered 0.05 to 0.16 as before. Chains are written as beats in order, each beat's `at` the previous beat's end plus `GAP` or `READ`. Builders should add a `chain()` helper to `kit/verbs.ts` that takes beats with `hold` values and writes the `at`s, so nobody hand-sums seconds (section 6).

**The slide's first beat.** The previous slide's parts not marked (carry) hide at 0 (0.3 s), and the retitle runs as before (old out 0.3 s, new lines up from 0.25 s). The story lines are not on until their beat.

**Clicking during a chain.** The engine's rule stays: a click during a chain finishes it and stops on the end state; the next click advances. That is PowerPoint's rule, and the owner should know it: to skip a long chain he clicks twice. `deck-check.mjs` already tests this.

**Pixel parity.** Unchanged in substance. Every state is the compiled `on` values; a chain's holds are `at` offsets inside the step; nothing is on a `setTimeout`, `setInterval`, `requestAnimationFrame` or CSS `transition`. Going back, jumping or reloading cuts to the step's end state, which is the chain's end state by construction. The dollar sign (section 4) rides by a driven `along` value for the same reason.

**The camera.** Still moves exactly twice: slide 21 (in and out inside one chain) and slide 44.

---

## 2. Clicks per slide

47 slides, 48 clicks. "Chain" is the running time of the click, including holds, to the nearest half second. The detail (beat order, where the story lines land, what changes in the layout) is in section 3.

| # | Slide | Clicks | Chain | Notes | Story |
|---|---|---|---|---|---|
| 1 | Title | 1 (the Enter) | 4 | credit lines, frame draws, story line at the foot | complete (the frame is filled on 2) |
| 2 | The catalog | 1 | 6 | page wipes, address, two story lines | complete |
| 3 | Find | 1 | 7 | three rings 1.4 s apart, with their tabs | complete |
| 4 | What an entry tells you | 1 | 8 | ring, leader, six fields 0.5 s apart | complete |
| 5 | From form to live page | 1 | 10 | row draws, card travels, "automatic", approval | needs the Live well to light as the card lands |
| 6 | A person approves it | 1 | 10.5 | checklist, approved, catalog, published | complete |
| 7 | Easy to review | 1 | 8.5 | privacy ring, flag, person and agent type | needs the result: after the mark, the card goes on to Live |
| 8 | No server, no database | 1 | 8 | three boxes, gone, files | complete |
| 9 | About three working days | 1 | 7 | three blocks, the odd hours | complete |
| 10 | The proof | 1 | 6.5 | picture travels, people, agents, labels | complete |
| 11 | The problem we all share | 1 | 11 | line crawls, off the edge, loops, pile | complete |
| 12 | Let AI build it | 1 | 11.5 | inside a tool, the sign, the picture steps aside; then the staff describe and an agent builds the tool | complete |
| 13 | You own it | 1 | 6.5 | ring, history line, fifth approval | complete |
| 14 | Our rapid application development system | 1 | 7 | six steps, two coral, people | complete |
| 15 | The design system | 1 | 6 | strip, four groups | complete |
| 16 | 145 modules | 1 | 8.5 | wall lights, tiles fly, new code | complete |
| 17 | The source data | 1 | 5.5 | table, three lines in | needs the app to take a fill once the three lines arrive |
| 18 | Monday meeting, Friday demo | 1 | 11 | five days 1.5 s apart, each labelled | needs its labels (today five wordless boxes) |
| 19 | The agents split up the work | 1 | 9 | plan, approved, fan-out, board, agents | complete (the board carries on through 20 to 22) |
| 20 | Tested, and looked at | 1 | 10 | fail and fix; screenshot grid; a person looks | complete |
| 21 | Two reviewers, then a person | 1 | 10.5 | camera in, reviewers, approval, camera out, marks | complete |
| 22 | Lessons carry forward | 1 | 9 | memory, packets, released, catalog lands | complete |
| 23 | Add everyone's use cases | 1 | 6.5 | strip, wall, links | needs the linked tiles to light, so the links have a result |
| 24 | Every department builds | 1 | 7.5 | grid, tiles travel, every set grows | needs to be readable: larger rings and tiles |
| 25 | Built on Azure, adapted for AWS | 1 | 9.5 | Azure, rework to AWS, approve, to the shelf | needs the labels kept and copies sent to the shelf |
| 26 | Share more than code | 1 | 8 | six labelled rows ringed; help both ways | needs its row labels (today six wordless rows) |
| 27 | The more we share | **2** | 4 + 11.5 | click 1: Austin, more join, the middle grows. click 2: six more join, the middle grows again, and they pay their vendors; the lines are pulled in to the middle; a tool goes in and out to three | complete |
| 28 | More capable, less dependent | 1 | 6.5 | axis, rising line, falling line with the dollar sign | complete, plus the dollar sign |
| 29 | What we're releasing | 1 | 7 | four panels 1.3 s apart | complete |
| 30 | Our agentic skills | 1 | 8.5 | six steps fold; three copies drop | complete once the story line names the tools |
| 31 | Our source code | 1 | 8 | waits beside the catalog; moves in | complete |
| 32 | How to build your own design system | 1 | 7 | our strip; yours | complete |
| 33 | Setup guides | 1 | 9.35 | table, people, laptops, agents; six booklets land, the first named; tools take shape; chat window with its tail to the table types a line | complete |
| 33a | The help spreads | 1 | 6 | the table shrinks to Austin's; three ready now; their own tables and the next ones; Austin's lines fade | complete |
| 34 | Three steps | 1 | 6.5 | three lines 1.4 s apart, story at the foot | complete |
| 35 | Step one | 1 | 10 | submission travels and lands; then the communities | complete |
| 36 | Step two: train your people | 1 | 9 | in to the room; out with agents; GitHub | complete |
| 36a | Step two: GitHub | 1 | 7.5 | outline; three pieces; history line | complete |
| 37 | Step two: AI coding tools | 1 | 8.5 | purchased, approved, into the department; agents | complete |
| 38 | Step two: a person who approves | 1 | 7 | row, the line, agents one side, person the other | needs the card: it stops at the line, the person marks, it crosses |
| 38s | Step two: data security and governance | 1 | 11.5 | fence and gate; public data in, personal or health data stopped; three changes past the approver onto the record; the last undone | complete |
| 38a | The questions IT will ask | 1 | 10.5 | four questions and answers 2.4 s apart | complete |
| 38b | Forward-deployed engineers | 1 | 11.5 | queue; engineer sits down; build; steps back | complete |
| 39 | Step three: low risk, high return | 1 | 10 | pile; agent makes the tool; residents; path | complete |
| 40 | Two examples from Austin | 1 | 9 | catalog; helpline; both feed the same services | complete |
| 41 | Then ramp up | 1 | 8 | bigger blocks; joins the network | complete |
| 42 | Our ask | 1 | 9.5 | four requests 1.8 s apart, each lighting its part | complete |
| 43 | Agentic presenting | 1 | 7 | waveform; becomes agents; they fly to the grid | needs the agents to land and stay (today ends empty) |
| 44 | Thank you | 1 | 6 | the 45 stills; pull back; Thank you | complete |

**Why nothing is merged or cut.** The owner's target was "about 45" and 48 is inside that. Every slide has its own On screen line, which the owner approved and which is the title on screen; merging two slides means losing one of those lines or changing the title mid-chain without a click, which reads as the deck moving on its own. The two obvious candidates (3+4 on the same screenshot; 16+17 on the same wall) each save one click at the cost of a title, so they stay. If the owner wants fewer still, the order to cut is: 17 into 16 (the table draws as a last beat under the modules title with the "And the source data" line as a story line), then 10 into 9 (the people and agents arrive beside the three days). That gets to 46.

**Why 27 is the only two-click slide.** The owner names three "big phases" that could be two clicks: Monday-to-Friday, the agents planning, and the reviewing. Each of those turns out to be one picture that ends on its own money shot, so one click each. Slide 27 is different: the first half ("the middle grows") is a complete picture the speaker sits on, and the second half changes the subject to what we don't control. 38a (four questions) was the other candidate; it stays one click because the answers are already on screen and the speaker reads down them while they arrive 2.4 s apart, which is slower than he talks.

---

## 3. Per slide: the chain and the story lines

### The story line: a new type role

**What it is.** One or two lines of plain text under the title that say what the drawing is showing, for a viewer with no speaker. Drawn from the approved You say, verbatim or trimmed (words removed, nothing added). Where a line is not a contiguous run of You say with words removed, it is marked **NEW** and listed in section 7 for the owner.

**Where it sits.** `STORY` band: line 1 at (96, 338), line 2 at (96, 386), both x 96, width 1728. Under a two-line title (9, 11, 24, 30, 31, 35, 39, 40, 42, 44) the band is at y 420 and 468. The content band therefore starts at **y 440** under a one-line title and **y 520** under a two-line one: every layout in the art direction shifts down 100 px unless a slide's notes below say otherwise. Four slides have no title line to sit under (1, 34, 38a) or no room (44); there the band is at the **foot**, (96, 940) and (96, 988).

**Type.** `SetText size="text"`: Public Sans 32 px, paper `#f6f1e7` (not soft; this text must be read), left-aligned, rising with `lines()` (0.75 s, expo.out). The ids are `story.<slide>.a` and `story.<slide>.b`. The strings come from the script module (a new `story: string[]` on `Picture`, section 6), never a literal.

**Limits, so slides stay clean.** At most **two story lines per slide**, each **one line of at most 100 characters** (about 1500 px at 32 px Public Sans; the author checks the longest at 1920 wide). Lines stack; a line never replaces another inside a chain. Line A lands with the beat it explains; line B with its beat. A slide may have no story line when the title and labels already say it (28 has one; 38a's answers are its story).

**What the words must do.** Each line passes the copy-editing sweeps the owner uses: it says one thing, in the owner's voice, concrete, with the "so what" in it where the You say has one ("so the rest of us can find them", "That's the return", "so the risk is low"). No coined terms: "stations", "the gate", "ledger", "sprint" and the like never appear. Nothing is invented: no numbers, names or claims that are not in the script.

### Notation

Times are seconds from the click. `A:` and `B:` are the story lines, with their source (verbatim or trimmed from You say; **NEW** where not). "Layout" notes what moves beyond the 100 px shift. Everything not mentioned is as the art direction had it.

### Part 1. The catalog (world `catalog`)

**1. Title** — 1 click (the Enter on the start screen). Story at the foot.
- 0.3 three credit lines rise (0.16 apart). 1.4 the empty browser frame draws clockwise, bar, three dots (to 2.9). 2.6 A rises. 3.4 B rises. End 4.2.
- A: "Something you can use today." (verbatim)
- B: "How we built it in a few weeks, and how your department can build its own tools the same way, without waiting years on a vendor." Over 100 characters: break B after "weeks," into the foot's two lines (A then takes a single line at y 892). Verbatim.

**2. The catalog** — 1 click.
- 0 retitle. 0.3 page wipes down inside the frame (0.9), frame lines go at 1.0. 1.3 address rises. 1.6 A rises. 3.2 (READ) B rises. End 4.0; a 2 s look at the page before the next click is the speaker's.
- A: "Health departments post the AI tools, data projects and digital services they've built, so the rest of us can find them." (verbatim; 118 characters, so set as A on one line at 32 px only if it fits 1728 px; if not, drop "digital services" after checking with the owner, or carry "so the rest of us can find them." to B and move the next line to a label). Preferred: A = "Health departments post the AI tools, data projects and digital services they've built." (trimmed), B = "Before your team spends months on something new, look here first." (verbatim)

**3. Find what others have tried** — 1 click. Frame (carry).
- 0 retitle, address hides. 0.3 A rises. 1.0 Search ring draws, tab shows. 2.4 Filter. 3.8 Compare. 4.6 B rises. End 5.4.
- A: "Search by keyword. Filter by type of solution, public health area, how far along a project is, and where it runs." (trimmed: "You can" dropped twice; 111 characters, so builders set it at the band's full width; if it overflows at 1920, drop "public health area," and tell the owner).
- B: "Compare two entries side by side before you pick up the phone." (trimmed: "And you can" dropped)

**4. What an entry tells you** — 1 click. Frame (carry). Layout: fields column starts y 460.
- 0 retitle, rings and tabs hide. 0.3 entry ring draws, leader draws (to 1.4). 1.2 A rises. 2.0 six fields rise 0.5 s apart (to 4.8). 5.0 B rises. End 5.8.
- A: "Open an entry and you get the full profile." (verbatim)
- B: "Every entry names a contact, so you know who to contact." (verbatim)

**5. From form to live page** — 1 click. Layout: row at y 600 (headings 536); bracket and "automatic" under at 692/712; person above Approval at 480, mark at 560. Story fix: today the card stops in Live and nothing lands (the Live well's fill never opens, `catalog/moves.ts` `cardTravels`). The Live well fills as the card arrives, so "it's on the site" is seen.
- 0 retitle, frame unwipes and hides. 0.3 wells, headings and links draw left to right (to 1.6). 1.2 A rises. 2.2 card arrives in Form and hops well to well, the fills wiping behind it (1.8, to 4.0); the Live well's fill wipes at 4.0 (0.4). 4.6 bracket draws, "automatic" rises (to 5.4). 5.9 Approval's coral outline draws, person draws, coral mark lands (to 7.3). 6.9 B rises. End 7.7.
- A: "You fill in a form on the site, and that opens a request on GitHub." (verbatim)
- B: "Nobody retypes anything, and nothing goes live until a person approves it." (verbatim)

**6. A person approves it, and it goes live** — 1 click. Row (carry) docks. Layout: sheet at box(96, 440, 560, 380); right frame at box(760, 440, 1064, 380); "Approved" line at (96, 850); row docked at wells y 900, headings 836 (the stage ends at 1016, so the docked row drops to 40 px below the sheet; builders check the fit at 1280 × 720).
- 0 retitle; bracket, "automatic", person and mark hide; row docks (1.0). 0.6 sheet draws (0.9). 1.4 A rises. 1.6 five ticks pass 0.2 apart (to 2.6). 3.2 coral mark lands, "Approved" rises, name and time rise (to 4.0). 4.0 B rises. 5.6 (READ) right frame wipes up with the catalog page (0.9), ring draws round the newest entry (to 7.2). 7.7 the strip scrolls to the status page (1.2), ring draws round "Published" (to 9.5). End 9.5.
- A: "Each draft comes with a checklist for the reviewer." (trimmed: ", built from the catalog's governance rules" dropped)
- B: "When the reviewer approves it, their name and the time go on the record." (verbatim)

**7. Easy to review** — 1 click. Row docked (carry). Layout: form frame box(96, 440, 792, 400); person and agent at y 480; typed lines at 600 and 660.
Story fix: today the slide ends on two typed lines and a mark, and nothing happens as a result; "the agent does the clicking" needs a click to be seen. After the person's mark, the card in the docked row goes on from Draft to Live, the wells filling behind it.
- 0 retitle, the sheet, marks, frame and rings hide. 0.3 form frame wipes (0.75), attestation ring draws (to 1.8). 1.4 A rises. 3.0 (READ) card shows in Draft, flag draws, "Data governance review" rises (to 4.0). 4.5 person and agent draw (0.8, 0.16 apart). 5.3 two lines type one after the other (0.6 each). 6.6 coral mark lands. 6.6 B rises. 7.2 the flag hides; the card hops Draft, Checks, Approval, Live in the docked row (0.26 a hop, to 8.3), the Live well filling at 8.3. End 8.7.
- A: "Submitters confirm they aren't sharing personal or protected health information." (verbatim)
- B: "We make the decision, and the agent does the clicking." (verbatim)

**8. No server, no database** — 1 click. Layout: boxes at y 440/568/696; file list from 524; hosting line at 756.
- 0 retitle; row, frame and review parts hide. 0.3 A rises. 0.8 three boxes wipe on with their labels 0.2 apart (to 2.1). 3.7 (READ) labels hide, boxes unwipe (to 4.6). 4.6 B rises. 4.8 folder, rule and three file lines rise 0.09 apart; hosting line rises at 5.7. End 6.5.
- A: "Most websites that take submissions need a server, a database and editor logins." (verbatim)
- B: "This one has none of it. Every entry is a plain file on GitHub." (trimmed)

**9. About three working days** — 1 click. Two-line title; band at 420/468; content from 520. Layout: S at box(96, 520, 464, 232); blocks at y 540; ticks at 740.
- 0 retitle, files hide. 0.3 S wipes in. 0.8 A rises. 1.2 block 1 draws and fills (1.5). 2.4 block 2. 3.6 block 3 (to 5.1). 5.3 the odd-hour ticks show 0.05 apart. 5.6 B rises. End 6.4.
- A: "All of that took about three eight-hour working sessions." (trimmed)
- B: "Usually a project of many months. Ours took three working days, spread over a few weeks." **NEW** (the first sentence is reordered from "usually runs as a project of many months"; the second is verbatim)

### Part 2. Why this matters (world `catalog`)

**10. The proof** — 1 click. Layout: S travels to box(728, 440, 464, 232); people at y 720; agents at y 752; labels at 860.
- 0 retitle, blocks and ticks hide. 0.3 S travels to the centre (1.2). 1.2 A rises. 2.0 three people draw 0.09 apart; 2.5 three agents draw (to 3.4). 3.8 "Our platform" and "Our method" rise 0.16 apart. 4.2 B rises. End 5.0.
- A: "A small health department team, working with AI agents, built and launched a public service." (trimmed)
- B: "We didn't hire a vendor. The same platform and the same method we use for all our tools." (trimmed)

**11. The problem we all share** — 1 click. Two-line title; band 420/468; content from 520. Layout: line at y 620; loops above at y 540; "Months or years" at (1440, 730); pile from y 720.
- 0 retitle, proof parts hide. 0.3 A rises. 1.2 first node shows; the line crawls node to node, each node showing as the line reaches it (1.5, to 2.7). 3.2 the line runs off the edge (0.6, power2.in); "Months or years" rises at 3.7. 4.9 three loops draw 0.5 apart (to 6.5). 6.0 B rises. 7.8 five cards pile up 0.3 apart (to 9.3). End 9.3.
- A: "Think about the last tool your team asked for." (verbatim)
- B: "Every change after that went back to the vendor with a new quote." (verbatim)

**11a. The tools gap** (round 4) — 1 click. Two-line title, broken after "features,"; band 420/468; content from 520. All in grey, like 11. Layout: product card box(240, 560, 400, 240), "A tool you already have" under it at 816, price rows of three dollar signs directly under that (the first row from 877, the second added under it, to 957); AI badge box(528, 584, 88, 52) in the card's upper right, starting 424 to its left; three dashed outlines box(1280, 560 / 696 / 832, 400, 112), each named inside in soft, so they read as waiting. Nothing carries into 12.
- 0 retitle, the road hides. 0.3 card draws (0.7); its words rise at 0.7; the first price row rises at 0.9. 1.0 A rises. 2.55 the badge fades in (0.25, soft) while it is carried in from the left and settles in the card (1.0, carry), so it is solid before it reaches the card's edge; 3.55, as it lands, the second price row rises under the first. 4.65 the three outlines wipe on from the left 0.3 apart (0.6 each), each name rising 0.3 after its outline starts (to 6.3). 6.05 B rises. End 6.8.
- A: "An AI feature inside a tool you already use can be useful, though it often raises the price." **NEW**
- B: "It doesn't close the tools gap: the pipeline, analysis tool or dashboard you've been waiting for." **NEW**

**12. Let AI build it** — 1 click. Layout: app outline box(640, 536, 640, 360); "AI inside a tool" under it at 916; the prohibition sign a ring of radius 164 on the app's centre with its slash; the small copy of the chatbot picture box(96, 636, 256, 144), at 0.6, its words under it; agent at (560, 716); staff at box(1424, 640, 48, 64), mark at (1240, 852). Line B sits in the band's first row (420), where line A was.
- 0 retitle, the tools gap hides. 0.3 outline and bar draw (to 1.2). 1.24 bubble draws (0.8); "AI inside a tool" rises at 1.84. 1.64 A rises (to 2.39). 3.99 (READ after A lands) the sign's ring draws (0.5), its slash at 4.34 (0.3, to 4.64). 5.44 the picture steps aside: the bubble and sign hide in 0.05 as the small copy, exactly over them, comes on in 0.05; the copy then travels from the app's place to its own, shrinking from the app's size to 0.4 and fading to 0.6 (0.8, page, to 6.24), its words travelling under it on the same curve; A hides (0.3). 6.04 B rises in the first row. 6.54 (with B, which describes them) the staff draw, their name rises at 6.84, the line to the app draws at 7.04, the twelve places wipe on 0.05 apart from 7.44 (to 8.39). 8.69 agent draws, its name at 8.89, its ring fills from 8.99; the tiles leave the agent 0.05 apart (0.9 each, to 10.44), each place hiding as its tile lands; "AI that builds the tool" rises at 9.99. 11.04 the staff's mark lands (0.6). End 11.64.
- A: "AI inside a tool helps with the work that tool was built for." **NEW**
- B: "With agentic development, your staff describe what they need, and AI agents build the whole tool." **NEW**

**13. You own it** — 1 click. App and tiles (carry). Layout: "Yours" ring round the app at box(624, 424, 672, 432); history line at y 900 as before.
- 0 retitle; agent, person, mark and label hide. 0.3 the paper ring draws round the app, "Yours" rises at 0.8. 1.0 A rises. 2.6 (READ) history line draws (1.2); the four approvals on record show as the front passes them; the fifth lands at 3.9 (0.6). 4.0 B rises. End 4.8.
- A: "The code lives in your own GitHub account, with every change and every approval on record." (verbatim)
- B: "You describe the change, the agents make it and your reviewer approves it." (verbatim)

### Part 3. How we build (world `build`)

The build world is the densest. Besides the 100 px shift it needs one relayout: the board (`BOARD`) narrows to w 1100 (x 256 to 1356) so a right column x 1400 to 1824 can hold slide 20's screenshot grid (y 560 to 720) and slide 22's memory panel (y 760 to 920); the idle fixer stands at (1380, 700). Slide 15's strip sits at box(96, 440, 1728, 100); slides 16 and 17 keep it dimmed, with the wall at (96, 580) and the app outline at box(1120, 580, 640, 340); slide 17's table is box(96, 920, 744, 90), three rows at 30 pitch.

**14. Our rapid application development system** — 1 click. Layout: six boxes at y 540; people above the two coral boxes at y 440 (they sit between story line 2 and the boxes; if the band has two lines on this slide the people draw at y 452 at 0.85 scale).
- 0.95 (arrival) boxes draw left to right 0.12 apart, text rises inside each, links draw behind (to 2.4). 1.6 A rises. 3.6 (READ) boxes 4 and 5 take the coral outline 0.16 apart; a person draws above each at 4.0 (to 4.9). 4.4 B rises. End 5.2.
- A: "Working software, built in short cycles and checked by the people who'll use it." (verbatim)
- B: "AI agents now do 95 to 99 percent of the building and testing, and people make the decisions." (verbatim)

**15. The design system** — 1 click.
- 0 retitle, six steps hide. 0.3 A rises. 0.6 strip outline draws (0.9). 1.2 four groups fill left to right 0.4 apart, each with its label (colors, type, components, accessibility) (to 3.3). 3.4 B rises. End 4.2.
- A: "The agents never start from a blank page. They start from three things we've already built." (verbatim)
- B: "Accessibility built in, so every tool meets ADA standards from the first page." (trimmed)

**16. 145 modules** — 1 click. Strip (carry, dimmed).
- 0 retitle, strip dims. 0.3 wall lights column by column (1.4), shelves draw behind. 0.8 A rises. 2.4 app outline draws (0.9). 3.0 fourteen tiles fly from the wall into the app 0.04 apart (1.1 each, to 4.6); two dashed tiles wipe in at 4.7 (to 5.5). 4.8 B rises. End 5.6.
- A: "Each one came out of a real project, and we cleaned it up so we could use it again." (verbatim)
- B: "Most of it comes from these blocks, and they write new code only for the parts that are new." (verbatim)

**17. The source data** — 1 click. Strip, wall, app (carry). Story fix: today three lines run into an outline and nothing changes; the app should take a quiet fill (`--k` 0.1, as the week's boxes do) when the third line arrives, so the three inputs are seen to make a tool.
- 0 retitle. 0.3 table draws (0.9). 1.0 A rises. 1.4 three connectors draw into the app 0.4 apart: strip, wall, table (to 3.0). 3.0 the app outline fills to 0.1 (0.6). End 3.6.
- A: "The agents read it before they build, so the tool fits the data you actually have." (verbatim)

**18. Monday meeting, Friday demo** — 1 click. The day names and a line under each box go on screen (the art direction kept the names off; the owner wants the week to read on its own). Layout: five boxes 288 × 260 at y 500; day name 26 px soft above each at y 468; the line under each at y 780, 26 px paper, centred, at most two lines of 20 characters.
- 0 retitle; strip, wall, app and table hide. 0.2 A rises. 1.0 Monday: name rises, box draws, drawing draws, its line rises (1.3). 2.5 Tuesday. 4.0 Wednesday. 5.5 Thursday (the tick passes at 6.7). 7.0 Friday (to 8.3). 8.4 B rises. End 9.2.
- Labels under the days, all from the You say: Monday "we listen"; Tuesday "a plan, and they tell us what's wrong"; Wednesday "the agents build"; Thursday "we test"; Friday "a working prototype". Day names "Monday" to "Friday" are in the You say. Listed in section 7 as label additions.
- A: "On Monday we meet the people who need the tool, and we listen." (verbatim)
- B: "If we got it wrong, we've lost a week." (verbatim)

**19. The agents split up the work** — 1 click. Layout: plan tile box(880, 440, 160, 72), planner above at (960, 400), person at (1080, 440), mark at (1104, 520); project bar box(256, 540, 1100, 40); four rows from y 600 (rowH 82, to 928).
- 0 retitle, week hides. 0.3 planner draws, ring fills; plan tile draws at 0.6; person draws at 1.0, coral mark lands at 1.6 (to 2.1). 1.2 A rises. 3.3 (READ) fan-out draws to four row starts 0.09 apart; board frame and rows draw at 3.6 (0.9); dependency links draw at 4.5 (to 5.4). 5.6 agents rise at their places 0.09 apart (to 6.6); the four builders' rings and first cells fill to 0.4 at 6.2 (to 7.0). 6.0 B rises. End 7.0.
- A: "A planning agent writes the plan, and a person approves it before anything gets built." **NEW** (two verbatim fragments joined; "it" stands for "the plan")
- B: "Builders write the code, testers test it, reviewers read it, and a fixer takes anything that fails." (verbatim)

**20. Tested, and looked at** — 1 click. Board (carry). Layout: screenshot grid in the right column box(1400, 560, 424, 160), 8 × 2; the tester glyph at (1400, 520) at 0.8 scale; the person at (1780, 740).
- 0 retitle. 0.2 row 2 cell 2 fills (0.4) then fails at 0.6; the fixer travels to it (1.0, to 1.6), ring fills; the cell clears and passes at 1.9 (to 2.4). 0.6 A rises. 2.9 fixer returns to its post (0.6). 3.7 (READ from A, GAP) tester rises; sixteen small screens wipe in 0.05 apart (to 4.9); two fail and take a flag at 5.0; they pass at 5.6; the person draws at 5.5 (to 6.1). 4.2 B rises. End 6.1.
- A: "When a test fails, the fixer gets the failure and repairs it." (verbatim)
- B: "Tests tell you a page works, but they can't tell you it looks right." (verbatim)

**21. Two reviewers, then a person** — 1 click. Board (carry). The camera's in-and-out is inside this one chain.
- 0 retitle; the screens, tester, person, plan, mark and fan-out hide. 0 camera moves in on row 1 cell 3 at 2.4 (1.2). 0.8 the cell fills. 1.3 two reviewers draw at its corners, rings fill 0.09 apart (to 2.3). 1.6 A rises (the band is at HOME framing; it is out of the close-up, so A sits as a near-title inside the framed box at 26 px as the build already does with `NEAR_TITLE`; use the same part for the story line while the camera is in). 3.2 (READ) person draws, coral mark lands (to 4.1). 3.6 B rises in the same near position. 5.7 (READ) reviewers and person hide (0.3); camera returns to HOME (1.2, to 6.9); every cell fills 0.03 apart from 6.2; the three marks under each cell show in reading order 0.03 apart from 6.9 (to 7.5). 7.0 A and B re-rise in the STORY band (the near copies hide at 5.7). End 7.8.
- A: "No agent reviews its own work. Two AI reviewers check every change." (verbatim)
- B: "One makes sure the work is complete. The other reads the code the way a senior engineer would." (verbatim)

**22. Lessons carry forward** — 1 click. Board (carry) dims rows, keeps the bar. Layout: memory panel box(1400, 760, 424, 160); "Released" at the bar's right end (1356, 492); flag at (1340, 540); thumbnail 288 × 144 centred on the bar at (662, 468).
- 0 retitle, rows and marks dim. 0.3 panel draws (0.9); four lines rise inside 0.09 apart from 0.9; the plan tile shows and the line from the panel up to it draws at 1.3 (to 2.2). 0.8 A rises. 3.0 four packets travel from the rows' last cells up to the bar 0.09 apart (1.0); bar fills from 3.5 (0.9); flag draws at 4.2; "Released" rises at 4.4 (to 5.0). 4.6 B rises. 5.6 plan and its line hide; the catalog thumbnail wipes up onto the bar (0.75, to 6.4). End 6.4.
- A: "Agents forget everything when a session ends, so we keep a memory layer." (verbatim)
- B: "A person approves the release and it goes live. That's how we built the catalog." (verbatim)

**22b. The whole process** (round 4) — 1 click. Two-line title, broken after "process."; band 420/468; content from 520. Layout: the ring an ellipse centred (960, 756), radii 620 and 184, stroke 4 in process green; seven pills 220 × 60 with a 4 px green edge, an even seventh of the ring apart: "Describe" at the left end (340, 756), "Plan", "Build" and "Check" over the top (671, 593), (1057, 574) and (1438, 639), "Approve", "Release" and "Learn" under it (1438, 873), (1056, 938) and (670, 919). The passed tick (r 16) on Check's top right corner, the orange mark (r 18) on Approve's bottom right corner, both outside the ring. "Your department" outline box(640, 706, 640, 140), named centred over it at 658; the three products of 22a, same art, at x 760, 960 and 1160, named under them. Nothing carries into 23.
- 0 the year and 22a's lines hide (0.3); retitle. 1.0 the ring strokes on clockwise from Describe at an even pace (3.5, to 4.5); each pill shows (0.25) as the line comes up to it, 0.3 before the front reaches its middle, 0.5 apart (0.7 to 3.7, the last solid at 3.95); A rises at 1.55 (to 2.3), between the second and third pills; the tick lands at 2.6, the orange mark at 3.1, each 0.1 after the front passes its pill's middle. 5.0 the outline opens from the left with its name (0.75, to 5.75). 5.55 the three products settle in from 22 px above, 0.15 apart (0.8 each, to 6.65). 7.3 B rises, A having been up 5.0 s and the stage still 0.65 s. End 8.05.
- A: "Your staff describe, agents plan, build and check, a person approves, and the agents learn." **NEW**
- B: "One department can build only so many tools. Share them, and every department gets more." **NEW**

### Part 4. Sharing (world `sharing`)

**23. Add everyone's use cases** — 1 click. Layout: strip box(256, 440, 1408, 180); wall at (588, 700).
Story fix: the links draw and nothing results; the three tiles at the links' ends light to full paper as each link lands, so "share the modules we make" has a visible outcome.
- 0.95 (arrival) title lines. 1.3 strip wipes from the top (0.75). 1.5 A rises. 2.3 wall lights (1.1). 3.5 three links draw 0.12 apart (to 4.3); the tile at each link's end fills to full 0.12 apart from 4.0 (to 4.8). 3.6 B rises. End 4.8.
- A: "The catalog is where departments share what they've built." (trimmed)
- B: "Next we want everyone's use cases in the catalog, with source code alongside them." (trimmed)

**24. Every department builds, every department reuses** — 1 click. Two-line title; content from 520. The eight departments read too small today (contact sheet, slide 24): draw them at r 48 with tile sets at 24 px tiles, 30 pitch, so a 3 × 2 set is 84 × 54, in 4 × 2 at x 320, 736, 1152, 1568, y 600 and 840.
- 0 retitle, slide 23 hides. 0.3 eight circles draw 0.05 apart; each set's first two tiles fill at 0.8 (to 1.5). 0.6 A rises. 2.3 (READ) two tiles travel between departments 0.16 apart (1.2, to 3.7). 4.0 every set fills to six 0.04 apart (to 5.2). 4.0 B rises. End 5.2.
- A: "A module one city built for its clinics becomes the starting point for another city's tool." (verbatim)
- B: "A small department with no developers gets the same building blocks as the biggest city." (trimmed)

**25. Your agents adapt it to where you run** — 1 click. End-state fix: today the slide ends with two unlabelled small tiles on a shelf and the story gone (contact sheet, slide 25). The Azure and AWS tiles keep their labels and their size to the end; small **copies** go to the shelf. Layout: Azure tile at (520, 560), agent at (960, 640), AWS tile at (1200, 560), person at (1500, 608), shelf rule at y 940.
- 0 retitle, grid hides. 0.3 Azure tile draws and fills, "Azure" rises at 0.9. 0.6 A rises. 2.2 (READ) agent draws, ring fills (1.0); a copy of the tile travels right through the agent (1.2, from 2.5), carrying the Azure label, which fades at 3.6 as "AWS" shows (to 3.9). 4.4 person draws, coral mark lands at 5.0 (to 5.5). 4.6 B rises. 6.2 shelf rule draws, its eight tiles fill 0.04 apart; two small copies travel from the two big tiles to the shelf's two gaps 0.08 apart (1.2, to 7.8). End 7.8.
- A: "Your agents can take our module and rework it for your setup." (verbatim)
- B: "They test it and your reviewer approves it. Then the AWS version goes back into the shared library." (trimmed)

**26. Share more than code** — 1 click. The drawn form rows take labels (26 px paper, left of each ring's row), all from the You say: "Data pipelines", "Data platforms", "Workflow automation", "Dashboards", "Governance playbooks", "Processes your team worked out". Listed in section 7 as label additions. Layout: form at box(96, 440, 800, 400); departments at (1360, 640) and (1680, 640).
- 0 retitle, slide 25 hides. 0.3 form outline draws (0.8); six rows rise 0.05 apart from 0.35, each with its label. 1.2 six rings draw 0.4 apart (to 3.8). 1.4 A rises. 4.4 form dims; two departments draw 0.09 apart (0.8); the two lines draw 0.3 apart with a packet on each (to 6.4). 4.8 B rises. End 6.4.
- A: "The catalog has a place for all of it, and code is optional." (verbatim)
- B: "Someone might reuse what you have, or offer to help with the thing you're stuck on." (verbatim)

**27. The more we share, the more we can do** — **2 clicks**. Layout: the middle at (960, 732), r 60 / 90 / 110; twelve departments r 66 on an oval 400 × 193 round it, set roughly as on a map (west to east along the top and the foot, north to south down the right end), each named inside its circle in 19 px type, Austin just above the left end and Los Angeles County straight under it. For click 2, a 20 px grey vendor square near each department on a short 8 px line: the four at the oval's ends straight out, the pair beside them out to the side, and the top and foot pair just under the band's gap or over the safe foot, above or under their outer neighbour's circle (the ring is packed, and a dollar sign needs about 140 px from a circle's centre to slide). "Vendors" left of Los Angeles County's square; "Before" under Austin's dashed copy and "Now" under its line in. Dashed copies at half weight (4 px), dashed 8 on 7. The tool is a 24 px tile, a step larger than the middle's 18 px ones.
- Click 1 `grow`: 0 retitle, slide 26 hides. 0.1 the middle's ring draws at r 60 (0.8); 0.3 Austin's circle draws (0.8), its name rising inside from 0.4; its spoke draws at 0.7 (0.6); three tiles fill in the middle from 1.0, 0.1 apart (to 1.7). 0.7 A rises. 2.3 five more departments draw 0.16 apart, each name rising inside its circle, their spokes from 2.6; the middle grows to r 90 from 2.4 (1.2); five more tiles fill 0.16 apart from 2.8 (to 3.9). End 3.9. The picture holds on a growing middle while the speaker makes the point.
- Click 2 `outside`, three beats (11.4 s): **paying the vendors** 0 the other six departments and spokes draw 0.16 apart, names inside (to 1.7); the middle grows to r 110 from 0.1 (1.2) and five more tiles fill 0.16 apart from 0.5 (to 1.6); twelve vendor squares show 0.05 apart from 0.2; "Vendors" rises at 0.6; each department's heavy line draws out from its circle to its square in join order, 0.12 apart from 0.5 (0.6 each, to 2.4), and as each lands a dollar sign slides along it toward the square (1.0, power1.inOut) and fades (0.25), gone as its box would reach the square (last gone 3.2, last slide over 3.4). **The lines come in** 3.9 Austin's line is pulled in alone (0.9, to 4.8): one path from its square through its circle to the middle, drawn as a window that slides from the part out to the part in, so the line runs back through the circle and on to the middle; its dashed copy shows (0.5) and its square fades to 0.25 at 4.0. From 4.8 the other eleven follow clockwise round the ring, 0.15 apart (Dallas County, Denver, Chicago, Detroit, Boston, New York City, Philadelphia, Washington, D.C., Houston, San Antonio, Los Angeles County; last done 7.2); "Vendors" fades to 0.25 with Los Angeles County's square at 6.4. 4.9 B rises. 6.6 "Before" rises, 7.0 "Now" (to 7.8). **Make and trade** 8.2 the tool tile fills inside Austin's circle (0.4); 9.2 it travels to its place on the middle's outer ring, the one facing Austin (1.0, to 10.2); from 10.2 three copies show inside the middle and travel out 0.15 apart (0.9) to Chicago, Boston and Houston, settling inside each circle under its name with the dashed corner of an adapted tool. End 11.4.
- Split: click 1 is "everything we share, and it grows"; click 2 is "what we used to buy, we now share and trade". The speaker needs the pause between them.
- A: "Each circle is a health department, and in the middle is everything we share." (verbatim)
- B: "Where each of us relied on a vendor, we can rely on what we share, and pass tools between us." (verbatim)

**28. More capable, less dependent** — 1 click. Layout: axis at y 880, "More departments sharing" at 920; rising curve (300, 820) to (1620, 460); falling curve (300, 500) to (1620, 820); end labels at x 1688 (moved right 48 px to clear the dollar sign). The dollar sign is specified in section 4.
- 0 retitle, network hides. 0.3 axis draws (0.9), its label rises at 0.8. 1.6 rising line draws (1.2); its label rises at 2.3. 1.9 falling line wipes from the left (1.2) with the dollar sign riding its front; its label rises at 3.2 (to 3.9). 3.4 A rises. End 4.2.
- A: "Together, we get more self-sufficient." (verbatim)

### Part 5. What we're releasing (world `releasing`)

**29. What we're releasing** — 1 click. Layout: four panels 384 × 480 at y 480.
- 0.95 (arrival) title. 1.3 A rises. 2.0 panel 1 draws, heading rises, drawing draws (1.2). 3.3 panel 2. 4.6 panel 3. 5.9 panel 4 (to 7.1). End 7.1.
- A: "We want your teams to have all of this, so we're working on four things." (verbatim)

**30. Our agentic skills, in December** — 1 click. Two-line title; content from 520. Layout: six steps at 0.6 scale at y 520; package box 240 × 180 at (840, 560); three tool outlines at y 820.
- 0 retitle, panels hide. 0.3 six small steps draw 0.05 apart (0.5). 0.8 A rises. 2.4 (READ) the six steps travel into the package's centre, shrinking and fading, 0.03 apart (0.75); the package draws from 2.6 and washes to 0.1 at 3.0 (to 3.4). 3.6 B rises. 4.4 three tool outlines draw 0.16 apart; three small copies of the package drop into them 0.16 apart (1.1, to 6.2). End 6.2.
- A: "The skills and settings you load into your AI coding tool: Claude Code, Codex or something else." (trimmed: "whether that's" dropped)
- B: "It brings the planning, the reviewers, the memory layer and the stop for a person's approval." (verbatim)

**31. Our source code, once it's cleared** — 1 click. Two-line title; content from 520. Layout: frame box(760, 520, 1064, 460); tile groups at (160, 560), (160, 700), (160, 840); tag "Once cleared" at (160, 500).
- 0 retitle, slide 30 hides. 0.3 frame wipes from the top (0.75). 0.5 three groups rise 0.09 apart; the dashed outline wipes at 0.9; the tag shows at 1.2 (to 1.6). 1.0 A rises. 2.8 (READ) tag and outline hide; each group travels onto its entry 0.16 apart (1.2), the ring draws round the entry as it lands, and the group goes into it (to 5.3). 3.6 B rises. End 5.3.
- A: "Once it's cleared, we'll share it on the catalog, along with how we built it." (verbatim)
- B: "Your agents can adapt it to your setup, and when you improve something, you can share that back too." (verbatim)

**32. How to build your own design system** — 1 click. Layout: our strip at box(96, 460, 1728, 100), labels under at 580; "Yours" at (96, 700); the empty strip at box(96, 740, 1728, 100).
- 0 retitle, slide 31 hides. 0.3 strip draws; four groups draw and fill 0.16 apart from 0.6; labels rise from 0.8 (to 1.9). 0.6 A rises. 2.5 (READ) "Yours" rises; the empty strip draws at 2.7; four faint copies of the groups wipe in 0.16 apart from 3.0 (to 4.3). 3.4 B rises. End 4.3.
- A: "Your agents need a design system before they build anything for you." (verbatim)
- B: "We'll publish how we built ours, so you can write down your own." **NEW** (two verbatim fragments joined over a dropped middle)

**33. Setup guides** (round 4) — 1 click. One-line title. Layout (`releasing/layout-workshop.ts`): the table from above, box(340, 590, 1240, 270) rx 28, in sky; six seats, three a side at x 645, 1005 and 1365, each a person off the table's edge, a laptop (screen 150 × 92) on the table, a booklet 108 × 100 at the laptop's left and the agent (r 14) at its right. Only the first booklet, top left, carries "Setup guide" on its cover (two lines); the other five carry two lines of writing where the name would be (round 4d: six names said one word six times). The chat window box(1508, 444, 300, 132), "Austin" in its bar, sits over the table's far end; a tail from its foot reaches down to the table's top edge at x 1538 (round 4d), so the chat is with the people at the table.
- 0 retitle; slide 32's binders hide. 0.3 table draws (0.9). 0.7 people, laptops and agents draw 0.08 apart (to 2.2). 2.4 the booklets drop in 0.15 apart (0.6 each, to 3.75). 2.7 A rises. 4.05 round the table, each screen's tool takes shape and its agent fills, 0.4 apart (to 6.65). 6.95 the chat window draws with its tail and name (0.7); 7.25 B rises; 7.55 its bubble shows; its line types in two runs (7.75 to 8.65, 8.75 to 9.35). End 9.35.
- A: "Your people follow the guides to build a first small project with your agents."
- B: "We're happy to chat with your team as you get started."

**33a. The help spreads** (round 4) — 1 click. Slide 33's On screen line becomes "We'll help the first departments get set up." (one line). 33a: one-line title; band 338/386; content from 440. Layout, a tree read left to right: Austin's circle r 52 at (156, 701) with "Austin" inside it, and its table box(224, 674, 216, 54), slide 33's table at a fifth of its size; three ready circles r 34 at x 760, y 591, 701 and 811, each with its own small table at its right, box(810, y − 27, 216, 54); seven next circles r 34, 55 apart from y 536 to 866, alternately at x 1440 and 1640, two on the first ready table, three on the second, two on the third, each ready row level with its group's far circle so that line runs straight between the near two. Lines run from a table's right end to the facing edge of each circle it joins. "Ready now" centred over its column at (760, 472), "Next" over its two columns at (1540, 472). Tables and lines sky, circles navy line on white like slide 27's. Nothing carries into 34.
- 0 slide 33's seats, helper and tag hide (0.3); retitle. 0.3 the table shrinks about its top left corner onto Austin's table (1.0, page, to 1.3), its edge held at 3 px as it shrinks; 1.3 the small table shows as the big one hides, a cut (0.01). 0.7 Austin's circle draws with its name (0.8, to 1.5). 1.6 Austin's three lines draw 0.22 apart (0.6 each), each ready circle drawing 0.45 after its line sets off (0.6, to 3.09). 1.9 A rises (to 2.65). 2.35 "Ready now" rises (to 3.1). 3.6 the three ready tables draw 0.35 apart (0.6, to 4.9); as each starts, Austin's line to it fades to 0.5 and thins from 3 px to 2 px (0.8, to 5.1). Each next circle's line sets off 0.45 after its table starts, 0.15 apart within its group (0.5), no two together (4.05 to 4.9), the circle drawing 0.4 after its line sets off (0.5); the last lands at 5.8. 4.35 B rises with the next lines (to 5.1). 4.75 "Next" rises (to 5.5). End 5.8, on the last next circle.
- A: "We'll start with a few departments that are ready now." **NEW**
- B: "Then each one teaches the next, so all of this can grow as fast as agentic development moves." **NEW**

### Part 6. How your department starts (world `start`)

**34. Three steps** — 1 click. No title; the three lines are the body (unchanged). Story at the foot.
- 0.95 (arrival) rule 1 draws, line 1 rises. 2.4 rule 2, line 2. 3.8 rule 3, line 3 (to 4.9). 5.0 A rises. End 5.8.
- A: "You can do the first one this week, while the second works its way through your approvals." (verbatim)

**35. Step one** — 1 click. Two-line title; content from 520. Layout: frame box(256, 520, 1408, 260); row docked at wells y 900 (headings 836); the network for the second half: your department at (960, 720), six departments on r 260, two work-group nodes at (256, 520) and (1420, 520).
- 0 retitle, three lines hide. 0.3 frame wipes with the catalog's end and its empty slot. 0.6 A rises. 1.0 row draws (to 2.1); Approval's coral outline draws at 1.5. 2.4 the card travels the six wells (1.8); rises out of Live as a packet at 4.2 (0.45); the slot fills at 4.7 (to 5.1). 6.0 (READ) frame and row hide (0.3); your department draws at 6.2; eight lines and their circles and nodes draw 0.09 apart from 6.5 (to 8.0). 6.6 B rises. End 8.0.
- A: "Pick one thing your department has built or launched: an AI tool, a dashboard, a data pipeline." (trimmed: ", a process" dropped)
- B: "Get your people into the public health AI communities, starting with this work group." (trimmed: "And" dropped)

**36. Step two: train your people** — 1 click. Layout: room box(760, 500, 400, 320); people enter at y 628; out to the right with agents; "GitHub" node at (1360, 460).
- 0 retitle, network hides. 0.3 room draws (0.9). 0.5 A rises. 1.2 three people draw 0.09 apart and travel into the room (1.2, to 2.9). 3.6 (GAP + READ) three people travel out 0.05 apart (1.1); an agent rises beside each from 4.4 0.09 apart; GitHub node rises at 4.6, its leader draws at 4.8 (to 5.5). 4.8 B rises. End 5.6.
- A: "Send team members to training on AI coding tools. Encourage them to learn GitHub." (trimmed)
- B: "They need to know how to describe what they want, and how to read and check what comes back." (verbatim)

**36a. Step two: GitHub** — 1 click. Layout: dashed outline box(560, 520, 800, 360), label at (560, 480); three nodes at x 160, y 520/660/800; history line at y 800 inside.
- 0 retitle, slide 36 hides. 0.3 outline wipes, "Your department" rises at 0.5. 0.8 A rises. 2.4 (READ) three nodes rise 0.4 apart, each line drawing into the outline 0.2 after it (to 4.2). 4.6 history line draws (0.6); three coral marks land 0.15 apart from 4.9 (to 5.6). 4.8 B rises. End 5.6.
- A: "If your city already has a GitHub organization, ask IT for a space inside it." (verbatim)
- B: "GitHub keeps the full history of every change and approval, and your auditors can read all of it." (trimmed)

**37. Step two: AI coding tools** — 1 click. Layout: tool outline at (160, 600); the two wells at y 660; the department outline box(1160, 500, 600, 400) with three people at y 660.
- 0 retitle, slide 36a hides. 0.3 tool outline draws; the two wells draw with their headings (to 1.4); department outline wipes at 0.5, its label rises, three people draw 0.09 apart (to 1.6). 0.8 A rises. 2.4 (READ) the tool travels Purchased (0.45), Approved (0.7), each well filling behind it, and comes to rest in the department (to 4.2). 4.6 an agent rises beside each person 0.09 apart (to 5.5). 4.6 B rises. End 5.5.
- A: "Bring IT, security and legal in early, and show them how the work flows." (verbatim)
- B: "Agents draft, AI reviewers check, a person approves, and everything is on record." (verbatim)

**38. Step two: a person who approves** — 1 click. Layout: row at y 660 (headings 596); the vertical rule from (1192, 540) to (1192, 820); agents at y 520 on the left; person at (1472, 500), mark at (1496, 600). Story fix: today the row's card is suppressed (`start/moves.ts` `never`) and the end state is a still diagram. The card makes the point: it travels Form to Checks and stops at the line; the person's mark lands; only then does it cross into Approval and on to Live.
- 0 retitle, slide 37 hides. 0.3 row draws (to 1.4). 0.6 A rises. 1.6 the line draws top to bottom (0.6). 2.4 three agents rise on the left 0.09 apart (to 3.3). 3.4 the card arrives in Form and hops to Checks (1.3, to 4.7) and waits at the line. 4.9 person draws; Approval's coral outline draws at 5.1; coral mark lands at 5.6 (to 6.3). 5.0 B rises. 6.5 the card crosses into Approval and on to Live (0.6), the Live well filling at 7.1. End 7.5.
- A: "Choose someone to review and approve changes, and name a backup." (verbatim)
- B: "An agent can't approve its own work, and it can't publish." (verbatim)

**38s. Step two: data security and governance** (round 4) — 1 click. Under the step-two label held still from 36 (`kicker.training`), a two-line title broken after "data"; band 420/468; content from 540. Layout (`start/layout-safe.ts`), a plan view across the frame (round 4d: the picture had sat in the right two thirds): the fence, a navy rail with 10 px posts about 92 apart, box(540, 580, 1284, 388), named "Accounts your city approves" over its top left at (540, 552); its gate in the left side from y 680 to 888, two jambs and a leaf hung from the top one that swings out of the fence; your department's dashed outline box(572, 612, 1220, 324) inside it, with a doorway behind the gate, named "Your department" inside its top left corner at (596, 646). Two data tables 140 × 104 wait outside at x 285, "Personal or health data" over the lane at y 560 (high enough that the open leaf passes under it) and "Public data" under it at y 852, so neither crosses the other's name on its way to the lane; each name sits over its table's right end. Inside: the record line from (1290, 888) to (1760, 888), "GitHub record" under its left end; three places on it at x 1320, 1470 and 1620, a clock and a line under each for its time stamp; the approver (person at 1.5) at (990, 670), named over the head, standing 12 px over the record's page level, so the changes pass under their foot (round 4d: they had crossed the approver's figure on the way to the desk); the desk, where a change takes the mark, just past the approver at (1082, 778), level with its place on the record. Changes are 72 × 110 pages, the size slide 38's are, so the approver's mark fits under the writing.
- 0 retitle; slide 38 hides; the step label stays. 0.3 fence rail draws (1.0); its name rises at 0.6; the department wipes at 0.7, its name rising at 0.9; posts and the gate show at 0.8; the tables rise 0.15 apart from 1.1; the approver draws at 1.3, named at 1.5; the record's stub draws and its name rises from 1.5 (to 2.35). 0.6 A rises. 2.55 the gate opens (0.5); public data comes up to the lane (0.5) and goes in through the gate and the doorway (1.1, from 3.0); the gate shuts at 4.15 (to 4.65). 4.15 personal or health data comes down to the lane (0.5), runs at the shut gate (0.7, from 4.55), and is pushed back 48 px to wait outside (0.4, to 5.65). 4.85 B rises. 5.85 three changes 1.0 s apart: each slides out of public data (0.45), crosses under the approver's foot to the desk (0.55, dropping to the record's level as it sets off), takes the orange "a person approves" mark (0.35, round 4d: it had been a green tick, which means a check passed), and goes straight along to its place on the record as the line reaches past it (0.55), its time stamp showing as it lands (to 10.15). 10.45 the last change lifts 90 px off the line and fades to 0.3 (0.7); its time stamp goes; "Undone" rises over it at 10.75; the line closes back to just past the second change (0.6, from 10.9). End 11.5.
- A: "Agents work inside the GitHub and AI tool accounts your city already approves, under its own rules." **NEW**
- B: "Start with public data. A person approves every change, GitHub records it, and you can undo it." **NEW**

**38a. Your IT and security teams will ask these four questions** — 1 click. The title, broken after "teams", says to expect the four questions; they and their answers are the body. The second answer drops "named" (round 4).
- 0 retitle, slide 38s hides; the step label goes. 0.3 A rises. 1.2 rule draws (0.6). 1.6 question 1 rises, its answer slides in at 1.9. 4.0 question 2 and answer. 6.4 question 3. 8.8 question 4 (to 9.9). End 9.9.
- A: "Keep the work in accounts your city already approves, and you can undo any change." (round 4d: "uses" said less than 38s's "approves" about the same accounts)

**38b. No tech staff? Forward-deployed engineers** — 1 click. Layout: "Your department" box(96, 520, 640, 400); "central IT" box(1184, 520, 640, 400); queue cards at y 700; engineer sits at (590, 660); tool outlines at (330, 800) and (560, 800).
- 0 retitle, slide 38a hides. 0.3 two outlines wipe 0.1 apart; labels rise; six people and the engineer draw 0.06 apart; eight queue cards show 0.05 apart (to 1.9). 0.8 A rises. 2.6 (READ) the engineer travels left and sits down inside your department (1.4, to 4.0). 4.5 the first tool outline draws and fills (1.2, to 5.7). 4.6 B rises. 6.4 (READ) the engineer ghosts; the second tool outline draws beside the first and fills (to 7.9). End 7.9.
- A: "A technical person who works inside your team instead of in a central IT queue." (trimmed)
- B: "They build the first projects alongside your people, and teach them as they go." (trimmed)

**39. Step three: low risk, high return** — 1 click. Two-line title; content from 520. Path slides (39 to 42): the path moves to **y 1000**; the service nodes on 40 sit at y 900. Layout: sheets in box(96, 520, 560, 320); agent at (800, 680); tool box(960, 520, 480, 320); residents travel from (1560, 820) into it.
- 0 retitle, slide 38b hides. 0.3 twelve sheets show 0.05 apart (to 1.2). 0.6 A rises. 2.2 (READ) agent draws, ring fills; tool outline draws at 2.3 (0.8); the sheets travel into it 0.03 apart and become its three rows (to 4.0); residents arrive at the three services from 4.1 0.04 apart; the services fill at 4.5 (to 5.2). 4.2 B rises. 5.8 path draws to x 260 (0.5); the first project's dot fills, its small tool draws; the dotted rest wipes to the right (0.9, to 7.3). End 7.3.
- A: "Data that's already public: your services, your clinics and their hours, your eligibility rules." (trimmed)
- B: "No private data is involved, so the risk is low. More of them use those services. That's the return." **NEW** (three verbatim fragments joined; "more of them" refers to residents)

**40. Two examples from Austin** — 1 click. Two-line title; content from 520. Path (carry). Layout: two frames 800 × 340 at y 520 (x 96 and 1024); three service nodes at y 900 (x 560, 960, 1360); connectors from the frames' feet to them.
- 0 retitle; sheets, agent, tool and residents hide. 0.3 left frame draws; its rows rise 0.06 apart; the resident's answers fill and three results light from 1.3 (to 2.2). 0.6 A rises. 2.8 right frame draws; waveform rises 0.02 apart from 3.1; the list rises from 3.6 (to 4.4). 5.0 the three services show; connectors draw from both frames 0.06 apart (0.8); people fill the nodes 0.08 apart from 5.9 (to 6.8). 5.2 B rises. End 6.8.
- A: "Our Service Catalog helps residents find the services that fit them." (trimmed)
- B: "Both run on public data we already had. All we did was make it easier to reach." (verbatim)

**41. Then ramp up** — 1 click. Path (carry); frames and services hide. Layout: blocks above the path at x 500, 800, 1150 (path at 1000); the small network at (1500, 760).
- 0 retitle, frames and services hide. 0.3 three blocks draw and fill 0.4 apart (to 2.2). 0.6 A rises. 2.6 the small network draws 0.04 apart; your department rises off the path's end into its place (0.8, from 3.1); its spoke draws at 3.9; a tile travels from it into the centre (0.7, from 4.1, to 4.8). 4.2 B rises. End 5.0.
- A: "Your team learns the tools, your reviewer learns the job, and your design system takes shape." (verbatim)
- B: "And when you build something, share it back." (verbatim)

**42. Our ask** — 1 click. Two-line title; band at 420/468; content from 520. Network (carry) travels left to centre (480, 740). Layout: four request lines at x 1000, y 540, 660, 780, 900.
- 0 retitle, path and blocks hide; the network travels to the left (1.2). 0.4 A rises. 1.6 request 1 rises, its leader draws, the catalog entry marker on the ring fills (to 2.6). 3.4 request 2, your department's circle fills. 5.2 request 3, the package rect fills. 7.0 request 4, the centre's stroke goes to paper (to 8.0). End 8.0.
- A: "Start the GitHub and AI tool requests now, since approvals take the longest." (trimmed: "and start" to "Start")

### Part 7. Agentic presenting (world `close`)

**43. Agentic presenting** — 1 click. End-state fix: today the slide ends empty but for the title, because the agents fly to the grid cells and hide (contact sheet, slide 43). The agents land and **stay**, as 24 small glyphs at their grid cells (r 14, no label); slide 44's first beat hides them as the stills wipe in over them.
- 0.95 (arrival) title. 1.4 A rises. 2.2 waveform bars rise to their fixed heights 0.03 apart (0.5, to 3.4). 4.6 (READ) bars give way to agents 0.02 apart; each flies to its cell (1.2, 0.02 apart, to 6.3) and stays. 5.0 B rises. End 6.3.
- A: "We built it by voice, talking to agents." (verbatim)
- B: "Agents built each slide, other agents reviewed them, and a person approved them." (verbatim)

**44. Thank you** — 1 click. No story line: the two closing lines and "Thank you. Austin Public Health." are the words. Layout: the grid at (104, 440, 1712, 480), 9 × 5 at 176 × 88 with 16 px gaps (the band shift costs 79 px, taken from the cells' height; the stills letterbox inside their frames, or the grid keeps 16:9 cells at 170 × 96 with 10 px gaps; builders choose by eye); "Thank you. Austin Public Health." at (96, 980).
- 0 retitle to the two closing lines (two-line title). 0.4 the 45 stills wipe in, in reading order, 0.022 apart (0.6 each, to 1.6); the 24 agents hide under them at 0.4. 2.2 camera frames the grid at 1.08 (0.6) and returns home (1.2, to 4.0). 4.2 "Thank you. Austin Public Health." rises. End 5.0.

---

## 4. Slide 28: the dollar sign that rides the falling line

**What it is.** A single "$" in Public Sans 44 px semibold, paper, no ring and no box, that sits on the front of the falling line as it wipes in and comes to rest at the line's end. It is the only glyph of its kind in the talk, and it is paper: a dollar is money, not an approval, so it is never coral.

**Where it rides.** The falling line is an HTML part that `wipe`s from the left (a dashed stroke cannot draw on; `kit/dashed.tsx`). The dollar sign is a second part, `two-lines.dollar`, placed by a driven `along` value (as `Packet` is in `kit/marks.tsx`, `send` in `kit/verbs.ts`) on the **same path `d`** as the falling line (`TWO_LINES.falling.d`, in the stage's pixels rather than the box's), offset 26 px above the path's point (perpendicular is unnecessary; a constant −26 in y reads cleanly on this slope). At `along: 0` it is at (300, 474), hidden; at `along: 1` it is at (1620, 794), on. Builders add a `Rider` part to `kit/marks.tsx` if `Packet` cannot carry a text child: the same driven `along`, a `<text>` instead of a dot.

**Timing.** The wipe of the falling line runs 1.2 s on `EASE.draw` from 1.9 s (section 3, slide 28). The dollar sign's `along` runs 0 → 1 over the same 1.2 s on the same ease, starting at the same instant, with `autoAlpha` 0 → 1 over its first 0.2 s. A horizontal wipe and a path's arc length are not the same parameter, so at mid-travel the glyph may lead or trail the wipe's edge by a few pixels; that is invisible at speed and exactly zero at the end, which is the frame that matters. The falling label rises 0.1 s after the glyph lands, at x 1688 (moved right 48 px from the art direction's 1640 so the glyph and the label do not touch).

**Pixel parity.** The glyph's end state is `{ along: 1, autoAlpha: 1 }` in the compiled picture; a cut sets it there, which is the same point on the same path. Nothing is measured from the page. The world test's end-state check (`sharing/world.test.ts`) gains the assertion that the dollar sign's end is `along: 1`.

**What it does not do.** It does not pulse, shrink, fade as it falls, or leave a trail. One glyph, one ride, one landing. The rising line gets nothing: the title and the end label carry "more capable".

---

## 5. Stories that stop short today, and other flow problems

The owner's note: "some of the animations also feel incomplete or the story feels incomplete." The test applied to every slide: does the chain have a start (what is there), a change (something happens to it) and an end state where the result visibly lands, so a viewer sees the outcome and not just the activity? The "Story" column in section 2 is the result. Nine slides stop short today; each fix is written into its chain in section 3 and summarised here:

- **5.** The card reaches Live and nothing lights. Fix: the Live well fills as the card lands.
- **7.** The person and agent type two requests, a mark lands, and nothing results. Fix: after the mark the card goes Draft to Live in the docked row.
- **17.** Three lines run into an empty outline. Fix: the app takes a fill when the third line arrives.
- **18.** Five wordless boxes. Fix: day names and a line under each (section 3, section 7).
- **23.** Links draw to tiles and nothing results. Fix: the linked tiles light to full.
- **25.** Ends with the labels gone and two unmarked tiles on a shelf. Fix: labels stay; copies go to the shelf.
- **26.** Six wordless rows get ringed. Fix: each row is labelled with its solution type.
- **38.** A still diagram of agents on one side and a person on the other. Fix: the card stops at the line, the person marks, the card crosses to Live.
- **43.** Ends on an empty stage. Fix: the agents land and stay.

Two more are not incomplete but read as such without words, and the story lines carry them: **30** (three unlabelled tool outlines) and **32** (a faint strip labelled Yours, which is the point: yours is still to be filled in).

Other problems the owner would notice:

1. **Slide 43 and 25 are in the list above** (contact sheet, slides 43 and 25; `sharing/beats.ts` `library` beat hides the labels; `close/world.ts` `agents` beat hides the glyphs as they land).
2. **A chain's end state is what a reload shows.** Every story fix above also fixes what the owner sees when he jumps to a slide by its address, because the end state is the compiled picture.
3. **Slide 24 is too small to read.** Eight r 36 rings with 18 px tiles on a 1920 stage read as dots from the back of a room. Fixed: r 48, 24 px tiles, 30 pitch.
4. **The six-step row appears four times with different weights** (5, 6 docked, 7 docked, 35 docked, 38 at full size). That is fine as a recall, but the docked row at y 860 to 932 at 0.5 alpha on 6 and 7 is close to the foot; with the band shift it is at 900 to 972, inside the 64 px safe edge but not by much. Builders check it at 1280 × 720 (`deck-check.mjs` runs the three sizes).
5. **Slides 16 and 17 rely on the dimmed strip from 15 being understood as "the design system".** With the story line and the labels (colors, type, components, accessibility) staying visible under the dimmed strip at 0.45, the three lines into the app on 17 read without the speaker. Keep the labels when the strip dims (today `dim(DESIGN.key)` dims the whole group; the labels should go to 0.6, not 0.45).
6. **Four slides in a row on step two** (36, 36a, 37, 38). The step is a small label over the title ("Step one", "Step two", "Step three" on 35 to 39), one label held still across 36 to 38, and each title says the thing itself. No change beyond section 3.
7. **The notes window and the HUD count 129 steps today; after this plan they count 48.** The notes page shows the whole You say for the slide, which is now one step, which is what the speaker wants on the confidence monitor. No change needed; builders check the notes page still breaks lines well for the longest You say (38b).
8. **The world fades.** Five times the deck fades through night for 1.3 s on a click (13→14, 22→23, 28→29, 33→34, 42→43). They mark the seven parts and read as section breaks, so they stay; the first-slide chains in section 3 count the 0.95 s arrival as part of their 12 s.
9. **A click to skip needs a second click to go on.** Engine behaviour, kept on purpose (section 1); the owner should be told, since 129 short clicks never made it visible and 48 long ones will.

---

## 6. What the builders change (and what the engine does not)

**No engine change for chaining.** Verified in `src/components/deck/engine/compile.ts` (a step's plays carry their own `at`; no cap) and `engine/driver.ts` (`play` lands at the last move's end via `gsap.delayedCall`; `set` writes the compiled end state). `engine/deck.tsx` `go()` already settles a running build on a click and advances on the next. Cuts, jumps and reloads are unaffected.

What does change:

1. **Tests: loosen the per-click cap and add a stall check.** Each world test caps a click at 2 s (`catalog/world.test.ts:75`, `build/world.test.ts:45`, `sharing/world.test.ts:72`, `releasing/world.test.ts:44`, `close/world.test.ts:56`, and `start/world.test.ts`). Raise to **12 s** (the first step of a world still adds its arrival fade). Add one shared test: inside any step, sorting the plays by start, no gap between one play's end and the next play's start exceeds **3 s**, so a chain never looks stuck.
2. **Parity checker.** `src/components/deck/check/deck-check.mjs:37` `LONGEST_BUILD = 3500` becomes **12500** (it waits out the longest build after a cut-short click to prove nothing lands late). The forward sweep gets slower by roughly 48 × the average chain; that is acceptable for a gate run, not for a watch loop.
3. **Script module: re-cut the steps and add the story lines.** In `src/talks/bchc/script/part-*.ts` each `Picture.steps` becomes one step (id `play`) or, for slide 27, two (`grow`, `outside`). `picture()` in `src/talks/bchc/worlds/steps.ts` already fails the build if a world and the script disagree, so this is the single source of the new click count. Add `story: string[]` to `Picture` in `script/types.ts` (zero to two strings) and a `storyOf(id)` in `script/find.ts`; the world tests' "every word on the stage comes from the script" checks admit them. The new labels on 18 (day names and the five lines) and 26 (six solution types) go into those steps' `show`.
4. **Kit: a `chain()` helper** in `kit/verbs.ts`: takes an ordered list of `{ moves, hold? }` beats and returns the moves with `at` set from the running end of the previous beat plus `GAP` or the beat's `hold`, computing a beat's end from its moves' `at + duration + stagger × (count − 1)` where the count is given by the layout. Builders can hand-write `at`s instead; the helper is to keep 48 chains consistent, not a requirement.
5. **Kit: the story line.** A `Story` layout helper in `src/talks/bchc/worlds/steps.ts` returning the band's two `SetText size="text"` positions for a one- or two-line title, and the `story()` move (`lines()` on `story.<slide>.a` / `.b`). Add `.dk-set--text` to the no-text-under-26 px check if there is one; it is 32 px.
6. **Kit: `Rider`** in `kit/marks.tsx` for the dollar sign if `Packet` cannot take a child (section 4).
7. **Layouts: the 100 px shift** and the per-slide relayouts in section 3 (build world board width; slide 24 sizes; slide 25 copies; 39 to 42 path at y 1000; 43 agents stay; 44 grid height).
8. **Finale stills.** After the worlds are rebuilt, re-run `src/talks/bchc/worlds/close/capture-finale.mjs` so the 45 stills show the new end states (story lines included), and bump the asset version to `NN.v2.webp`.

---

## 7. Words for the owner to sign off

**NEW lines** (not a contiguous run of the approved You say with words removed):

- Slide 9, B: "Usually a project of many months. Ours took three working days, spread over a few weeks."
- Slide 12, B: "Your staff describe what they need. The agents do the building. A person approves every change."
- Slide 19, A: "A planning agent writes the plan, and a person approves it before anything gets built."
- Slide 32, B: "We'll publish how we built ours, so you can write down your own."
- Slide 39, B: "No private data is involved, so the risk is low. More of them use those services. That's the return."

**Label additions** (words from the You say, newly placed on screen as labels rather than in a sentence):

- Slide 18: the day names "Monday", "Tuesday", "Wednesday", "Thursday", "Friday" above the boxes, and under them "we listen", "a plan, and they tell us what's wrong", "the agents build", "we test", "a working prototype".
- Slide 26: the six solution types on the drawn form rows: "Data pipelines", "Data platforms", "Workflow automation", "Dashboards", "Governance playbooks", "Processes your team worked out".
- Slide 28: the "$" glyph.

Everything else on screen is the title (the On screen line, verbatim), a label the art direction already listed, or a verbatim or trimmed run of the You say as marked in section 3.

**Two lines that may not fit on one line at 32 px** and need the owner's choice if they overflow at 1920 wide (section 3 gives the fallback): slide 2 A and slide 3 A.
