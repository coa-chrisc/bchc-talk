# BCHC round 4: the tools gap

Written 2026-10-12 from the owner's direction. This round sharpens Part 2 so the talk says, politely, that AI features inside the tools a department already has do not close its tools gap, and that AI agents can build the missing tools now. Read with `bchc-talk-intent.md` and `bchc-two-things-we-share.md`. Slide numbers below are the script's (`src/talks/bchc/script/*.ts`); the footer on screen runs one behind from the chatbot slide on.

## Tone rules for this round (owner)

- Polite to vendors. Criticise the situation (a gap that is not closing), never a company or a product.
- Do not say "safest" or "safer". Do not claim the tools agents build have no AI inside them; sometimes they must.
- Do not mention subscriptions or contracts.
- Friendly, forward-looking, "this is possible now, join us". Plain words, no coined terms.

## What changes

### A. Already landed on branches (merge first)

1. Slide 11, the calendar (branch `bchc-r4-calendar`, commit eb32f2b): named months, pages turn faster as the dollars stack.
2. Slide 12, the chatbot (branch `bchc-r4-slide12-no-sign`, commit e5c61ca): line A, a prohibition sign over the chatbot picture, it steps aside carrying the sign while line A leaves, new line B.

Both touch the same seven catalog-world files. Merge the calendar branch into `crypticpy/Presentation` first, then the chatbot branch, resolving conflicts in `layout-why.ts`, `scene-why.tsx`, `steps-why.ts`, `world.test.ts`, `catalog.css`, `part-2-why-this-matters.ts` and `docs/bchc-talk-script.md`.

### B. New slide 11a, "The tools gap" (catalog world, Part 2, between 11 and 12)

**On screen:** Your tools are gaining AI features, but the tools you still need aren't getting built.
- An AI feature inside a tool you already use can help, and it usually costs more.
- It doesn't build the data pipeline, the analysis tool or the dashboard you've been waiting for.

**They see:** A product card on the left, labelled "A tool you already have", with its price under it. An AI badge slides across and settles inside the card, and the price grows a row of dollar signs. On the right, three dashed outlines wait, labelled "Data pipeline", "Analysis tool" and "Dashboard". The card keeps its badge; the outlines stay empty. All in grey, like slide 11.

**You say:** Many of the tools you already pay for are adding AI features this year. Some of those features are useful. But the price goes up, and the tools your team has been asking for still aren't there.

Reuse: the dollar-sign glyph and the grey palette from slide 11; `Dashed` outlines from the kit, as slide 12 uses for the tiles' places. Clear everything at the click into slide 12 (nothing carries).

### C. Slide 12 reworded (animation unchanged)

**On screen:** To close the tools gap, have AI agents build the tools you need.
- AI inside a tool answers questions about that tool.
- With agentic development, your staff describe what they need and AI agents build the whole tool.

The title break in `layout.ts` (`"ai-builds": ["chatbot,"]`) must move to the new title, probably after "gap,". The They see and You say lines are adjusted to the new words; the sign and step-aside stay as built.

### D. Slide 39 reworded (start world, Part 6)

- Story line B becomes: "Agents can build the data pipeline, the analysis tool or the dashboard you've wanted, and a person on your team approves it."
- The You say line "These first tools don't need AI inside them. The agents do the building." becomes: "Start where the data is already public. The agents do the building, and your approver signs off."

No animation change.

### E. Finale stills

The close slide's grid (`worlds/close/layout.ts`, `finale.json`) holds one still per slide. Adding 11a changes the picture count and the grid, so: update the count, recapture every still as v7 with `worlds/close/capture-finale.mjs`, and check the grid still fits its columns.

### F. Bookkeeping the tests enforce

- `script.test.ts` expects 46 pictures and 48 steps; both go up by one.
- `docs/bchc-talk-script.md` must match the script word for word: add the 11a section, update 12 and 39, and the preamble's "Part 2 (slides 11 to 13)" note.
- `docs/bchc-flow-revision.md` section 3, Part 2: add 11a's chain.
- Every quoted phrase in They see is a label the world must draw.

## Order of attack

1. **Merge** A into `crypticpy/Presentation`. Run the full suite, typecheck, lint. Deploy, so the owner can see 11 and 12 live while the rest is built.
2. **Build B and C together** in one worktree (same files), one Opus agent: script, doc, layout, scene, steps, tests. Headless capture of 11a's end state and the 11a to 12 transition.
3. **Build D** in parallel, a second agent, start world only. Disjoint files.
4. **Review gates** (`aep-deck-review-gates`): copywriter and motion-design panels on 11a and 12, cold-viewer test on Part 2 as a whole, then code review.
5. **Finale stills** E, after B to D merge.
6. **Ship**: merge, deploy, verify with `vercel inspect`, send the owner the preview link. Owner reviews the live result.

## Deferred, owner's call later

- The thesis line on the title slide ("AI in public health is moving from chatbots inside tools to agents that build the tools").
- Carrying 11a's three dashed outlines into slide 12 so the agent visibly fills the gap.
- Footer numbering: show the script's number instead of the click index.
- The GitHub Pages mirror on the City of Austin account (`aep-bchc-github-pages-mirror`).
