import type { Picture } from "./types";

/** Part 3. How our agentic development process works. */
export const HOW_WE_BUILD: Picture[] = [
  {
    id: "rad",
    number: "14",
    part: 3,
    world: "build",
    name: "The process",
    show: "We build tools, data pipelines and dashboards with our agentic development process.",
    say: "This is the process itself. We use it for websites, and also for data pipelines, dashboards and other technical work. People decide what to build, AI agents build it and test it, and a person approves every release. It grew out of rapid application development, where the people who'll use a tool check it after each short build cycle. In Austin we've been refining it for years, and it keeps getting more agentic.",
    see: ["Three steps appear in a row, one at a time: People decide what to build. AI agents build and test it. A person approves the release. The first and last steps show people, and the last carries the \"a person approves\" mark. The middle step shows agents at work in the process's colour."],
    story: [
      "AI agents now do most of the building and testing.",
    ],
    steps: [
      { id: "play", show: ["People decide what to build", "AI agents build and test it", "A person approves the release"] },
    ],
  },
  {
    id: "week",
    number: "18",
    part: 3,
    world: "build",
    name: "Monday meeting, Friday demo",
    show: "We meet on Monday and show a working prototype on Friday.",
    say: "On Monday we listen to the people who'll use the tool. Then the agents turn our notes into requirements and a plan, and on Tuesday the people from Monday tell us what's wrong with it. On Wednesday and Thursday the agents build and test. If we got something wrong, we find out within the week.",
    see: ["A desk calendar shows one week, Monday to Friday, above a single app sketch. Each day the calendar page turns, and the sketch fills in a little more. Monday: notes from the meeting, labelled \"Meeting notes\", sit beside a blank outline. Tuesday: the agents' plan draws over the outline, and the people who need the tool, labelled \"People who need the tool\", mark it up. Wednesday: the agents build, and screens fill the outline. Thursday: the agents test it. Friday: the sketch is a working prototype, and a cursor clicks through it."],
    story: [
      "On Tuesday, the people who need the tool check the plan the agents wrote.",
      "On Friday, those same people click through it and tell us what to change.",
    ],
    steps: [
      { id: "play", show: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Working prototype", "Meeting notes", "People who need the tool"] },
    ],
  },
  // New in draft 6; moved before slide 15 in draft 8.
  {
    id: "setup",
    number: "14a",
    part: 3,
    world: "build",
    name: "What the lead agents read first",
    show: "Before any building starts, our lead agents read everything we've set up.",
    say: "Most of our refinements live here. The notes are our memory layer. The rules are a permissions system that controls what agents may and may not do. The skills give them our way of working. Add the design system, the modules and our tech stack, and the agents start from everything we've learned.",
    see: ["The lead agents, labelled \"Lead agents\", sit at a desk. Six folders land on it one at a time, each with its label on the spine: \"Notes from past projects\", \"Rules on what agents may and may not do\", \"Skills, written instructions for agents\", \"Our technology and how we want it built\", \"Tested modules\", \"Design system\". The lead agents open each folder, read it and close it. When all six are read, the lead agents stand, ready to plan. The design system and tested modules folders stay on top, because the next two slides open them."],
    story: [
      "They read notes from past projects, rules on what agents may do, and our written skills.",
      "These lead agents, called orchestrators, plan the work and hand it out.",
    ],
    steps: [
      { id: "play", show: ["Lead agents", "Notes from past projects", "Rules on what agents may and may not do", "Skills, written instructions for agents", "Our technology and how we want it built", "Tested modules", "Design system"] },
    ],
  },
  {
    id: "design",
    number: "15",
    part: 3,
    world: "build",
    name: "The design system",
    show: "Agents start from our design system.",
    say: "We always start from the design system: the City's colors, type and layouts, and ready-made components. A form, a dashboard and a map built months apart still look like they belong together.",
    see: ["A strip of the design system draws across the top: swatches in the City's colors, the same indigo and green as the Austin Public Health logo, then fonts and buttons. Three plain grey sketches sit below it: a form, a dashboard and a map. The strip slides down over each sketch in turn, and each one takes on the same colors, fonts and buttons. The slide ends on the three finished tools side by side, matching, with the strip above them. No other slide shows the strip."],
    story: [
      "It sets the colors, fonts and buttons, so every tool looks and feels the same.",
      "Agents follow our skills to apply it to each tool and check the result.",
    ],
    steps: [
      { id: "play", show: ["colors", "fonts", "buttons", "Form", "Dashboard", "Map"] },
    ],
  },
  {
    id: "modules",
    number: "16",
    part: 3,
    world: "build",
    name: "Over 140 modules",
    show: "Agents build from over 140 tested modules.",
    say: "Sign-in, search, audit logs, data pipelines, AI chat, maps and more. That's where the speed comes from. It's also why the parts where a mistake hurts most arrive already tested.",
    see: ["A shelf of tested modules fills row by row. Each row carries the name of its kind: Sign-in, Search, Audit logs, Data pipelines, AI chat, Maps. More rows fade in below, and a total under the shelf reads \"Over 140 tested modules\". The modules stay on the shelf. Slide 17 puts them into a tool."],
    story: [
      "A module is a tested working part, like sign-in or search, taken from a real project.",
      "Agents assemble most of a tool from modules and write new code for the rest.",
    ],
    steps: [
      { id: "play", show: ["Sign-in", "Search", "Audit logs", "Data pipelines", "AI chat", "Maps", "Over 140 tested modules"] },
    ],
  },
  {
    id: "data",
    number: "17",
    part: 3,
    world: "build",
    name: "The source data",
    show: "Agents read the source data first.",
    say: "It could be a public dataset or tables your team keeps.",
    see: ["An empty app outline waits on the right and stays empty. A data table appears on the left, labelled \"Source data\", and an agent reads it column by column, each column heading lighting as it goes. When the reading is done, the outline fills all at once from three sides: the design system's colors wash in, module tiles from the shelf on slide 16 drop into place, and the table's columns become the tool's fields. A few dashed tiles fill the gaps, labelled \"New code\"."],
    story: [
      "They learn every column before building, so the tool fits the data you have.",
      "Then they build the tool from the design system, the modules and your data together.",
    ],
    steps: [
      { id: "play", show: ["Source data", "New code"] },
    ],
  },
  // Two clicks in draft 6: `plan` (line A) and `work` (line B).
  {
    id: "split",
    number: "19",
    part: 3,
    world: "build",
    name: "Epics, sprints and waves",
    show: "The lead agents break the project into epics, sprints and waves of tasks.",
    say: "The orchestrators do the planning. Then the agents assign the work among themselves and run in parallel, dozens at a time on a big project.",
    see: ["The same style as the agent film on our website.", "The project row at the top, labelled \"Project\", splits into eight or more workstreams of different sizes, and the board grows to fill the frame. The workstreams are labelled \"Epics: large pieces of work\". Each is divided into \"Sprints: short build cycles\", and a line marked \"What has to finish first\" draws through the dependencies. The lead agents sit beside the project row, labelled \"Lead agents\". A person approves the plan with the \"a person approves\" mark.", "Agents arrive in waves (\"Waves: agents working at the same time\") and take rows, dozens on the board at once. Each kind of agent has its own shape: lead agents a gold ring, builders squares, testers triangles, reviewers diamonds, fixers hexagons. The first agent of each kind carries its name on the board: builder, tester, reviewer, fixer. Dots ride along the cells as they fill in the process's colour. The project row fills as tasks finish, and each passed test gets the \"passed\" tick."],
    story: [
      "A person approves the plan before any agent starts building.",
      "Then agents split the tasks: builders, testers, reviewers, and a fixer for anything that fails.",
    ],
    steps: [
      { id: "plan", show: ["Lead agents", "Epics: large pieces of work", "Sprints: short build cycles", "What has to finish first", "Project"] },
      { id: "work", show: ["Waves: agents working at the same time", "Builder", "Tester", "Reviewer", "Fixer"] },
    ],
  },
  {
    id: "tested",
    number: "20",
    part: 3,
    world: "build",
    name: "Tested, and looked at",
    show: "Agents test every change, and check every screen against the design system.",
    say: "Tests tell you a page works. They can't tell you it looks right. So an agent opens every page in a real browser, screenshots it and compares it with the design system. Then a person looks too.",
    see: ["The view moves in from the board to one test. It fails and gets a cross, labelled \"Failed\". The fixer agent, labelled \"Fixer\", picks up the failure and repairs it, and the test passes with the \"passed\" tick. The failed and fixed pair stays on screen, labelled \"Fixed by the fixer agent\". Beside it, page screenshots appear, each with a real layout: a header, a form, a chart. An agent compares each one with the design system: \"Every screen checked against the design system\". One screen is flagged, with its wrong button circled, and the same screen appears beside it, fixed. A person, labelled \"A person checks\", checks the screens. The slide ends on two before-and-after pairs, large and readable: the failed and fixed test, and the flagged and fixed screen, with the board small behind them."],
    story: [
      "When a test fails, the fixer agent repairs it and runs the test again.",
      "An agent screenshots each screen to catch what tests miss, like a wrong button. Then a person checks.",
    ],
    steps: [
      { id: "play", show: ["Failed", "Fixer", "Fixed by the fixer agent", "Every screen checked against the design system", "Flagged", "Fixed", "A person checks"] },
    ],
  },
  {
    id: "reviewed",
    number: "21",
    part: 3,
    world: "build",
    name: "Two reviewers, then a person",
    show: "Agents review each other's work.",
    say: "The first reviewer checks the work does everything the plan asked for. The second reads the code like a senior engineer. Then a person approves the change.",
    see: ["The view moves in from the board to one finished piece of work and stays there, with the board small beside it. Three large marks land under it one at a time, each with its label: \"First reviewer: is it complete?\", then \"Second reviewer: is it safe and bug-free?\", then \"A person approves\" with the \"a person approves\" mark. Both reviewer marks carry the reviewer's diamond from slide 19, and the builder who did the work stands to one side, labelled \"Builder\". The slide ends on the piece of work and its three labelled marks."],
    story: [
      "Two AI reviewers check every change, and neither one wrote it.",
      "After both reviewers pass it, a person approves the change.",
    ],
    steps: [
      { id: "play", show: ["Builder", "First reviewer: is it complete?", "Second reviewer: is it safe and bug-free?", "A person approves"] },
    ],
  },
  {
    id: "memory",
    number: "22",
    part: 3,
    world: "build",
    name: "Lessons carry forward",
    show: "Agents write down what they learn, and read it at the start of the next session.",
    say: "That memory layer is a running record of lessons, decisions and conventions. It's one reason the agents get better on every project.",
    see: ["The view moves from the board to a notes panel beside it, labelled \"What the agents learned\". At the end of each wave, an agent writes one new line in the panel, and the panel grows: \"Start from the tested sign-in module.\" \"Check each screen against the design system.\" \"Run the tests before review.\" Then a new session starts, labelled \"New session\", and its agents read the panel from the top, each line lighting as they read it. The slide ends on the panel, large and readable, with the board small behind it."],
    story: [
      "An agent remembers nothing from one session to the next.",
      "Each wave adds lessons, and the agents repeat fewer mistakes.",
    ],
    steps: [
      { id: "play", show: ["What the agents learned", "Start from the tested sign-in module.", "Check each screen against the design system.", "Run the tests before review.", "New session"] },
    ],
  },
  // New in draft 6. Ends on the release and products moved here from slide 22 in draft 8.
  {
    id: "scale",
    number: "22a",
    part: 3,
    world: "build",
    name: "It scales to any size of project",
    show: "The same process runs a one-week tool or a year-long project.",
    say: "Large or small, the process repeats. On a big project, dozens of agents work on different parts at once, each heading for the next planned release. People approve every release.",
    see: ["The board from slides 19 to 22 stays on screen, outlined and labelled \"This week\". The view pulls back, and the board becomes one small part of a much larger project: a year of work laid out left to right, with release markers along the top. The \"This week\" outline becomes a tall marker standing across every row of the year, so you can see where this week sits. More epics and sprints come into view as the camera keeps pulling back, each sprint a solid block with a clear gap before the next. Agents keep working across the whole frame by themselves: dots ride along cells, sprints finish and turn solid, new waves start, and the project row creeps toward the next release marker. This is the year view from the fleet film on our website. A small legend under the year names the marks along the top: \"Sprint\" and \"Release, approved by a person\". At the end, the project row reaches a release marker. Every check gets the \"passed\" tick, a person approves with the \"a person approves\" mark, and \"Released\" appears. Products rise off the marker and settle beside it: an app, a data pipeline, a dashboard."],
    story: [
      "When a wave finishes, the lead agents plan the next wave, sprint and epic.",
      "Each release goes live once it passes every check and a person approves it.",
    ],
    steps: [
      { id: "play", show: ["This week", "Sprint", "Release, approved by a person", "Released", "App", "Data pipeline", "Dashboard"] },
    ],
  },
  // New in round 4: the endcap of Part 3, the process as one ring, before Part 4 shares what it builds.
  {
    id: "process",
    number: "22b",
    part: 3,
    world: "build",
    name: "The whole process",
    show: "That's the whole process. Any department can run it and own what it builds.",
    say: "Each time round the loop, your department gets another tool it owns, and the agents get a little better at the next one. One department can only build so much on its own, though. Here's what happens when we share.",
    see: ["The year view from slide 22a fades away. A ring of seven steps draws once, clockwise, in the process green, and each step's name appears as the line reaches it: \"Describe\", \"Plan\", \"Build\", \"Check\", \"Approve\", \"Release\", \"Learn\". \"Check\" gets the \"passed\" tick, and \"Approve\" gets the \"a person approves\" mark. The ring closes back at \"Describe\". Inside the ring, an outline labelled \"Your department\" opens, and the three products from slide 22a settle into it, each with its name: \"App\", \"Data pipeline\", \"Dashboard\". The slide ends on the ring with your department and its three tools inside it."],
    story: [
      "Your staff describe, agents plan, build and check, a person approves, and the agents learn.",
      "One department can build only so many tools. Share them, and every department gets more.",
    ],
    steps: [
      { id: "play", show: ["Describe", "Plan", "Build", "Check", "Approve", "Release", "Learn", "Your department", "App", "Data pipeline", "Dashboard"] },
    ],
  },
];
