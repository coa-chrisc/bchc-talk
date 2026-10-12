import type { Picture } from "./types";

/** Part 5. What we're sharing. */
export const RELEASING: Picture[] = [
  {
    id: "releasing",
    number: "29",
    part: 5,
    world: "releasing",
    name: "Austin's magic sauce",
    show: "We're giving you Austin's magic sauce.",
    say: "We're doing this for everybody. We want every department in the coalition to have what we have, so we're giving you Austin's magic sauce. It comes in four parts, and I'll take you through each one.",
    see: ["A hot sauce bottle drawn in line, labelled \"Austin's magic sauce\", sits in the middle of the screen. Its cap twists off and it tips, pouring four drops one at a time. Each drop lands with a small splash and opens into a panel: An agent pack for your AI coding tool. Our source code, in the catalog. How to build your own design system and skills. Help getting set up. The bottle stands back up with a little wobble and settles to one side. The bottle is drawn in navy line, and the sauce inside is gold and drains as it pours. Each drop falls gold and opens into a panel in that part's own colour: the agent pack in the process's colour, the source code in the catalog's colour, design system and skills pink, help sky. The same four colours carry through the next four slides."],
    story: [
      "It comes in four parts, and each one helps your department build the way we do.",
    ],
    steps: [
      { id: "play", show: ["An agent pack for your AI coding tool.", "Our source code, in the catalog.", "How to build your own design system and skills.", "Help getting set up."] },
    ],
  },
  {
    id: "skills",
    number: "30",
    part: 5,
    world: "releasing",
    name: "An agent pack, in December",
    show: "An agent pack for your AI coding tool. We're aiming for December 2026.",
    say: "It won't include everything we use. Hand it to your technical team and they can start without repeating the trial and error it took us to get here. The skills are written in plain English, so your team can read them and change them.",
    see: ["A package labelled \"Agent pack\", in the process's colour, opens its lid, and its contents rise out one at a time, each with its label: \"Skills\", \"Planning\", \"Review\", \"Approval steps\". They settle back in, and the lid closes. A navy line draws from the package to three coding tool windows, named Claude Code, Codex and Other AI coding tools, and a copy of the package travels along the line into each window. The slide ends with the line joining the package to a copy in each tool."],
    story: [
      "Load it into Claude Code, Codex or another AI coding tool, and it's ready to use.",
      "It holds our skills, plain-English instructions for agents, plus our planning, review and approval steps.",
    ],
    steps: [
      { id: "play", show: ["Agent pack", "Skills", "Planning", "Review", "Approval steps", "Claude Code", "Codex", "Other AI coding tools"] },
    ],
  },
  {
    id: "source",
    number: "31",
    part: 5,
    world: "releasing",
    name: "Our source code, once it's cleared",
    show: "Once the City of Austin approves it, we'll post some of our source code in the catalog.",
    say: "We're going through the City's process now.",
    see: ["A still of the catalog's card grid, cropped to its last row so only one empty slot shows and no entry can be read. Beside it, a stack of tiles labelled \"Austin source code\", in the catalog's colour, waits behind a tag reading \"Awaiting City of Austin approval\". A dashed outline in the empty slot, labelled \"New project\", shows where the tiles will go. The tiles stay outside with their tag as the slide ends, because the City hasn't approved them yet."],
    story: [
      "We'll explain how we built each application we post.",
      "Your agents can adapt it to your setup, and when you improve something, you can share that back too.",
    ],
    steps: [
      { id: "play", show: ["Austin source code", "Awaiting City of Austin approval", "New project"] },
    ],
  },
  {
    id: "design-yours",
    number: "32",
    part: 5,
    world: "releasing",
    name: "How to build your own design system and skills",
    show: "We'll teach you to build your own design system and skills, using our templates.",
    say: "This is the part that makes our agents work the way they do. We'll show you how we built our design system and our skills, and give you our templates to learn from. Without a design system, every tool looks a little different and needs its own accessibility fixes.",
    see: ["An open binder labelled \"Our templates\", in pink, lies on the left, with tabs reading brand, components, accessibility and skills. Its pages slide out one at a time and land as blank copies in a second binder on the right, labelled \"Yours\". Your team fills in each copy: your own colors on the brand page, your own buttons on the components page, your own rules on a skill page. The slide ends on the two binders side by side, with the same tabs and different colors."],
    story: [
      "Your agents need a design system and written skills before they build anything for you.",
      "Your team fills in each template with your own colors, buttons and rules.",
    ],
    steps: [
      { id: "play", show: ["Our templates", "brand", "components", "accessibility", "skills", "Yours"] },
    ],
  },
  {
    id: "workshops",
    number: "33",
    part: 5,
    world: "releasing",
    name: "Help getting set up",
    show: "We'll help the first departments get set up.",
    say: "We'd run workshops through this group and other public health AI work groups. We'll share dates if we can make it happen.",
    see: ["A workshop table seen from above, with people from your department in every seat and a laptop in front of each. A person labelled \"Austin team\" moves from seat to seat. On each screen a small tool takes shape as its person works with an AI agent: a form on one, a map on another, a chart on a third. A small tag pinned on the table's corner reads \"Planned\". The table is drawn in sky, the colour help has on slide 29."],
    story: [
      "We can meet with your team, and we hope to run hands-on workshops.",
      "Your people would sit at a keyboard and build a first small project with us.",
    ],
    steps: [
      { id: "play", show: ["Austin team", "Planned"] },
    ],
  },
  {
    id: "spreads",
    number: "33a",
    part: 5,
    world: "releasing",
    name: "The help spreads",
    show: "The departments we help first will teach the next.",
    say: "We're planting seeds. A few departments start now and teach the next, so all of this can grow and adapt as fast as agentic development moves.",
    see: ["The workshop table from slide 33 shrinks to a small table at the left, with a circle labelled \"Austin\" beside it. Three lines draw out from that table, and a circle joins at the end of each, labelled \"Ready now\". Then each of the three gets a small table of its own, and two or three new circles join each one on lines of their own, labelled \"Next\". As the new tables light up, Austin's lines to the first three thin and fade, so the help visibly moves outward. The slide ends on a tree three levels deep: Austin, the ready departments with their tables, and the next departments. The tables and the lines are sky, the colour help has on slide 29, and the circles are navy line like the departments on slide 27."],
    story: [
      "We'll start with a few departments that are ready now.",
      "Then each one teaches the next, so all of this can grow as fast as agentic development moves.",
    ],
    steps: [
      { id: "play", show: ["Austin", "Ready now", "Next"] },
    ],
  },
];
