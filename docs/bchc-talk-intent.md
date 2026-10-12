# What the BCHC talk is for

Written 2026-10-09 from the owner's own words. This sits above the script: when a slide seems unclear, check it against this. Read it with `docs/bchc-two-things-we-share.md` and `docs/bchc-catalog-origin-story.md`.

## The arc

1. **The result.** Introduce the use case catalog, the Public Health AI & Tech Exchange: what it does and how departments use it.
2. **How we built it.** We used our agentic development process to build it in about three working sessions (see the origin story).
3. **The process itself, and how we've refined it.** This is a general development system for any tool, data pipeline or other technical work, not just "how we built the catalog". Everything below feeds the agents before any building starts:
   - a context and memory layer (what the agents learned last time, read at the start of the next session),
   - permissions management (what agents are and aren't allowed to do),
   - a set of default skills,
   - our tested modules,
   - our design system, which we always start from so everything looks and feels the same,
   - our tech stack and technical specifications (the technology we use and how we want things built).

   Then a couple of orchestrator agents do the planning. They break the work into epics, sprints and waves. The agents then assign the tasks among themselves, do the work, check each other's work and run the reviews. A person approves.

   **Show this the way the fleet film does** on the Above Earth site (`/architecture/control-room`, code in `src/components/control-room/`): the breakdown into workstreams, waves of agents, moving dots, cells filling, reviews. The owner loves that film and wants the talk to use much more of it.
4. **Sharing and collaboration: multiply the effect.** Get people excited about sharing. If you share one thing, and you share one, and you share one, then as a group we have three tools and everyone gets all three. The more we share, the bigger the pool we and our agents can build from, and the agents do the heavy lifting of adapting each tool.
5. **Sharing the capability: "Austin's magic sauce"** (the owner's phrase, and it goes on screen). It introduces the four things we're giving away.
   - By December, we expect to have an **agent pack** you can load into any AI coding tool. It won't include all of our features, but it gives you much of what we can do, ready to use.
   - We're working on getting some of our applications and source code approved to go into the use case catalog.
   - We'll make ourselves available to help your team get set up.
   - **Why it matters, when every city shares.** Say every city takes up this process, or just starts using AI to build things, and puts its work in the catalog. Then everyone benefits. With AI, and especially with the agentic process, you can take another department's use case and source code, if they've uploaded it, and have your agents customize it for your organization. You can also build your own modules. If every member of the Big Cities Health Coalition builds and shares just one use case, we go from one idea to about 30 use cases. That's the module idea at coalition scale: the toolset grows fast, everyone has access to all of it, and AI tailors each tool to each department. We stop relying on vendors, stop spending that money and stop waiting months or years only to be turned down. We can start the work and get it done.
   - We'll teach departments to build their own design system and their own skills, and give them our templates to learn from: the parts that make our agents work the way they do.
   - Earlier approved items stay: workshops we hope to run.
6. **How your department starts.** The existing script stays: enabling your teams, GitHub, AI tools, an approver, low-risk public-data projects, the Austin examples.
7. **Close.** Agents built this talk too. Thank you, Austin Public Health.

## The spirit: cities working together

This conference is about big cities coming together and doing things together. The catalog is an example of that: a real collaboration between Austin Public Health and the Big Cities Health Coalition. It's also the City of Austin giving back to the coalition's members. We built it for everybody, and we're showing everyone how we did it so they can do the same. Carry that warmth and excitement through the opening, the origin story, the sharing part and the close. Say it plainly, with no hype.

## The point

We used our agentic process at Austin Public Health to help the Big Cities Health Coalition build the catalog. Every other department can follow the same model, and we'll show them how, so they can build for themselves and depend less on vendors.

## Scope of revisions (owner's instruction)

- Don't redo everything. Much of the animation is good.
- Tighten it, improve the weaker animations and make the story more coherent.
- Stop treating the process and the catalog as one thing. They're separate. The process happened to build the catalog.
- The owner's outline above isn't a strict slide order. Use it as background to fill in the blanks.
