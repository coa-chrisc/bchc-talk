> **Superseded.** The on-screen words now live in `bchc-talk-script.md`, the single source for the build.

# On-screen copy, v3: every slide, final

Written 2026-10-09. This file supersedes `bchc-onscreen-copy-v2.md`, which stays only as history. Builders apply exactly this text. Background is in `bchc-talk-intent.md`, `bchc-two-things-we-share.md` and `bchc-catalog-origin-story.md`.

**Passes run.** stop-slop and copy-editing (clarity, voice, so-what, specificity, AI-tell check).

**The rule.** A first-time viewer with no speaker must get each slide's point from its title, and the story from its two lines. The agentic development process and the catalog are two separate things. Titles are full statements, not lists. Where a slide steps through a list, the list goes in the labels.

Key: **T** = title, **A** / **B** = story lines, **L** = labels (the `show` strings on the slide's steps), **M** = a motion note for the builder.

## Part 1: The catalog

**1 `title`**
- T (unchanged): Using AI in Public Health Practice. Big Cities Health Coalition, Data Modernization Work Group. Austin Public Health.
- A: We'll start with a new tool that Austin Public Health and the Big Cities Health Coalition built together.
- B: Then we'll show how we built it in a few weeks, and how your department can build its own tools the same way.

**2 `the-catalog`**
- T: The Public Health AI & Tech Exchange.
- A: Health departments post the AI tools, data projects and digital services they've built.
- B: Before your team spends months building something, see if another city already has.
- L: Just launched / big-cities-health-coalition.github.io/use-case-catalog
- M: A small "Just launched" tag lands on the home page before the address appears.

**3 `find`**
- T: Find what other departments have built.
- A: Search by keyword, or filter by public health area, type of solution and how far along it is.
- B: Compare two projects side by side before you call anyone.
- L: Search / Filter / Compare

**4 `entry`**
- T: Each project shows what was built, what it cost and who to call.
- A: Open a project to see where it runs, the skills it needed and how ready it is.
- B: Every project names a contact, so you can ask the team that built it.
- L: what the department built / where it runs / the skills it needed / how ready it is / what it cost / who to contact

**5 `six-steps`**
- T: How a project gets from the form to the live site.
- A: You fill in a form on the site, and that opens a request on GitHub.
- B: The site drafts the page and runs the checks itself. A person approves it before it goes live.
- L: Form / Request / Draft / Checks / Approval / Live / automatic
- M: The card stops at each step. It waits at Approval until the person approves, and only then goes live.

**6 `approved`**
- T: A person approves it, and it's live within minutes.
- A: The reviewer gets each draft with a checklist.
- B: The record keeps the reviewer's name and the time they approved it.
- L: Approved / Reviewer

**7 `review`**
- T: Easy to send in, and easy to review.
- A: People who submit confirm they aren't sharing personal or health information.
- B: An AI agent pulls up each submission and sums it up. The reviewer makes the call.
- L: unchanged

**8 `nothing-to-run`**
- T: There's no server or database to maintain.
- A: Most websites that take submissions need a server, a database and logins for editors.
- B: We reused an approach from an earlier Austin project. GitHub stores each project as a file and hosts the site for free.
- L: server / database / editor login / Hosted free on GitHub Pages

**9 `three-days`**
- T: We built it in about three working days, not months.
- A: The Big Cities Health Coalition asked us for help. In the first session, agents planned and built a working draft in a day.
- B: After each session, the coalition and the work group gave feedback, and the next session made their changes.
- L: Session 1 / Session 2 / Session 3 / Feedback
- M: Three session blocks fill one after another. After each block, a feedback mark lands from the coalition side, and the next block starts from that mark. The unlabelled odd-hour ticks go.

**10 `proof`**
- T: Our agentic development process made it possible.
- A: A small health department team built and launched a public service with AI agents.
- B: We didn't hire a vendor. We built it for every member, with the same process we use for all our tools.
- L: Our modules and design system / Our agentic process

## Part 2: Why this matters

**11 `too-long`**
- T: Getting a tool takes too long and costs too much.
- A: Think about the last tool your team asked for.
- B: It took months to buy, and every change after that came back with a new quote.
- L: unchanged

**12 `ai-builds`**
- T: AI can build the tool itself.
- A: Most AI talk in public health is about putting AI inside a tool, like a chatbot.
- B: With agentic development, your staff describe what they need and AI agents build the whole tool.
- L: unchanged

**13 `yours`**
- T: You own what you build.
- A: The code lives in your own GitHub account, with every change and every approval on record.
- B: To change it, you describe the change, the agents make it and your reviewer approves it.
- L: Yours

## Part 3: How our agentic development process works

This part covers the process on its own: a general way to build tools, data pipelines and more. Never present it as "how we built the catalog".

**14 `rad`**
- T: How our agentic development process works.
- A: It's rapid application development: short build cycles, each one checked by the people who'll use the tool.
- B: AI agents now do 95 to 99 percent of the building and testing. People make the decisions.
- L: We describe it. / AI reads our standards and modules. / Agents build it. / A person reviews. / A person approves the release. / It goes live.

**14a `setup` (new)**
- T: Before any building starts, agents load our setup.
- A: Every project starts from the same setup, so the agents never begin with a blank page.
- B: Two orchestrator agents read all of it before they plan the work.
- L: memory of past work / permissions / skills / modules / design system / tech stack and specs
- M: The six inputs appear one at a time and each flows into two orchestrator agents at the centre. The orchestrators light up once all six are in.

**15 `design`**
- T: Agents start from our design system.
- A: It sets the colors, type and components, so every tool looks and feels the same.
- B: Accessibility is built in, so every tool meets ADA standards from the first page.
- L: unchanged

**16 `modules`**
- T: Agents build from about 145 tested modules.
- A: Each module came from a real project, and we cleaned it up so we could use it again.
- B: Agents assemble most of a tool from these modules and write new code only for what's new.

**17 `data`**
- T: Agents read the source data first.
- A: They study your data before they build, so the tool fits what you actually have.

**18 `week`**
- T: We meet on Monday and show a working tool on Friday.
- A: On Monday we meet the people who need the tool, and we listen.
- B: If we got something wrong, we find out that Friday.
- L: Monday / we listen / Tuesday / they review the plan / Wednesday / the agents build / Thursday / we test / Friday / a working prototype

**19 `split` (two clicks: `plan`, `work`)**
- T: Orchestrator agents break the work into epics, sprints and waves.
- A (`plan`): They turn the project into epics, sprints and waves of tasks, and a person approves the plan.
- B (`work`): Then agents take the tasks among themselves: builders build, testers test, reviewers read the code and a fixer takes anything that fails.
- L: epics / sprints / waves / plus the role labels already on the board
- M: Use the style of the fleet film (`src/components/control-room/`).
  - `plan`: the project row splits into workstreams (epics) of different sizes, divided into sprints, with a critical path through the dependencies. A coral approval follows.
  - `work`: agents arrive in waves and take rows. Moving dots ride the cells as they fill, and the project row fills as tasks finish. Passed tests turn green.

**20 `tested`**
- T: Agents test every page and check how it looks.
- A: When a test fails, the fixer agent gets the failure and repairs it.

**21 `reviewed`**
- T: Agents review each other's work.
- A: No agent reviews its own work. Two AI reviewers check every change.
- B: One makes sure the work is complete. The other reads the code the way a senior engineer would.

**22 `memory`**
- T: Agents keep what they learn, and a person approves the release.
- A: Agents forget everything when a session ends, so we keep notes they read at the start of the next one.
- B: A person approves the release, and it goes live. The same process builds tools, data pipelines and more.
- M: Several products rise off the release bar: an app, a data pipeline and a dashboard. The catalog may appear as one product among them, never the only one.

## Part 4: Sharing

**23 `together`**
- T: Share what you build, and build from what others share.
- A: Departments post their tools, data pipelines and dashboards in the catalog.
- B: With an agentic process like ours, your agents can take any of it and adapt it to fit your department.
- M: One department posts a tile into the catalog. Another department pulls a copy into its own process, which adapts it (Dashed corner). The catalog never sits on top of the process.

**24 `everyone`**
- T: If every city shares one tool, every city gets about 30.
- A: Say each member of the coalition shares one use case in the catalog, with its source code if it can.
- B: Each department's agents adapt the ones it needs, so every toolset grows fast, without waiting on vendors.
- L: 1 use case / 30 use cases
- M: Posting wave: each department sends one tile into the catalog band, and the count climbs from "1 use case" to "30 use cases". Pulling wave: copies flow out, are adapted, and every department's set grows from one tile to many.

**25 `adapt`**
- T: Built on Azure. Adapted for AWS.
- A: Your agents can take a module we built on Azure and rework it to run on AWS.
- B: They test it, your reviewer approves it, and the AWS version goes back into the catalog.
- L: Azure / AWS
- M: The Azure tile comes out of the catalog band at the start, and the AWS version goes back into the band at the end.

**26 `more`**
- T: Share more than code.
- A: The catalog takes all of these, and sharing code is optional.
- B: Someone might reuse what you have, or offer to help with the thing you're stuck on.
- L: unchanged

**27 `network`**
- T: The more we share, the more we can do.
- A: Each circle is a health department, and in the middle is everything we share.
- B: As the shared middle grows, we depend less on vendors and budgets.
- L: unchanged

**28 `two-lines`**
- T: More capable, less dependent.
- A: Together, we can build more for ourselves and depend less on vendors and budget cycles.
- L: unchanged

## Part 5: What we're sharing

**29 `releasing`**
- T: We're working on four things to share with you.
- A: Each one helps your department build the way we do.
- L: An agent pack for your AI coding tool. / Our source code, on the catalog. / How to build a design system. / Help getting set up.

**30 `skills`**
- T: In December, we plan to release an agent pack for any AI coding tool.
- A: Load it into Claude Code, Codex or another AI coding tool, and it's ready to use.
- B: It doesn't include everything we use, but it brings our skills and our planning, review, memory and approval steps.
- M: Open on the full-size six steps from slide 14, with their words. Hold, then fold them into the package.

**31 `source`**
- T: We'll share our source code on the catalog once it's cleared.
- A: We're working to get some of our applications and source code approved, and we'll explain how we built them.
- B: Your agents can adapt it to your setup, and when you improve something, you can share that back too.
- L: Once cleared

**32 `design-yours`**
- T: How to build your own design system.
- A: Your agents need a design system before they build anything for you.
- B: We'll publish how we built ours, so you can write down your own.
- L: unchanged

**33 `workshops` (name: Help getting set up)**
- T: We'll help your team get set up.
- A: We'll make ourselves available to help your team get started, and we hope to run hands-on workshops.
- B: Your people would sit at a keyboard and build a first small project with us.
- L: Planned

## Part 6: How your department starts

**34 `three`**
- T: Your department can start in three steps.
- A: You can start the first step this week while the second works through your approvals.
- L: Share on the catalog. / Get set up. / Start with low-risk projects on public data.

**35 `step-one`**
- T: Step one: explore the catalog, share on it, and join the conversation.
- A: Pick one thing your department has built or launched: an AI tool, a dashboard, a data pipeline.
- B: Get your people into the public health AI communities, starting with this work group.
- M: The submission stops at Approval and waits for the person before it goes live, as on slide 5.

**36 `training`**, **36a `github`**, **37 `tools`**: unchanged.

**38 `approver`**
- T: Name a person to approve every change.
- A: Choose someone to review and approve changes, and name a backup.
- B: An agent can't approve its own work, and it can't publish.

**38a `questions`**
- T: Four questions to expect, and our answers.
- A: When you take this to your IT and security teams, expect these four questions.
- L: unchanged

**38b `fde`**
- T: No tech staff? Ask IT for a forward deployed engineer.
- A: A technical person who works inside your team instead of in a central IT queue.
- B: They build the first projects alongside your people, and teach them as they go.

**39 `low-risk`**
- T: Step three: start with low-risk projects on public data that pay off.
- A: Data that's already public: your services, your clinics and their hours, your eligibility rules.
- B: The data is already public, so the risk is low. When residents find your services, more of them use them.

**40 `examples`**
- T: Two Austin examples: a Service Catalog and a Voice-Assisted Service Helpline.
- A: Our Service Catalog helps residents find the services that fit them.
- B: Both run on public data we already had. All we did was make it easier to reach.

**41 `ramp`**
- T: Start small, then take on more.
- A: Your team learns the tools, your reviewer learns the job, and your design system takes shape.
- B: When you build something, share it back in the catalog.

**42 `ask`**
- T: Four things you can do now.
- A: Start the GitHub and AI tool requests now, since approvals take the longest.
- L: Share a use case. / Get set up. / Pick up the December agent pack. / Share back.

## Part 7: Close

**43 `agentic`**
- T: Agents built this talk.
- A: We built it by voice, talking to agents.
- B: Agents built each slide, other agents reviewed them, and a person approved them.

**44 `thanks`**: unchanged.
