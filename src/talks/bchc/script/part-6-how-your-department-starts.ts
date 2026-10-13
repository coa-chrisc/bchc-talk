import type { Picture } from "./types";

/** Part 6. How your department starts. */
export const HOW_YOU_START: Picture[] = [
  {
    id: "three",
    number: "34",
    part: 6,
    world: "start",
    name: "Three steps",
    show: "Your department can start in three steps.",
    say: "So how does your department start?",
    see: ["Three stair steps rise from left to right, each with its words: Post a project in the catalog. Get your people, GitHub, AI tools and an approver ready. Start with low-risk projects on public data. A small figure labelled \"Your department\" stands at the foot of the stairs and steps up onto the first one."],
    story: [
      "Take step one this month.",
    ],
    steps: [
      { id: "play", show: ["Post a project in the catalog.", "Get your people, GitHub, AI tools and an approver ready.", "Start with low-risk projects on public data.", "Your department"] },
    ],
  },
  {
    id: "step-one",
    number: "35",
    part: 6,
    world: "start",
    name: "Step one: post one project",
    show: "Post a project in the catalog.",
    say: "You'll need a free GitHub account. Describe what it does and what it took. Minutes after a reviewer approves it, it's live for every department in the coalition. While you're at it, get your people into the public health AI communities, starting with this work group.",
    see: ["A small label \"Step one\" sits above the title. A blank project card labelled \"Your project\" fills in one field at a time: \"What it does\", \"What it took\", \"Contact\". Beside it, the catalog's cards are drawn without words, cropped to their last row, with one empty slot. A copy of the card, as a catalog entry named \"Your project\", slides out from behind it and stops over the slot. A reviewer gives it the \"a person approves\" mark, and it drops into the slot while the card stays where it was."],
    story: [
      "Pick one thing your department has built or launched: an AI tool, a dashboard, a data pipeline.",
      "Leave out personal and health information, and name a contact so other departments can reach you.",
    ],
    steps: [
      { id: "play", show: ["Step one", "Your project", "What it does", "What it took", "Contact"] },
    ],
  },
  {
    id: "training",
    number: "36",
    part: 6,
    world: "start",
    name: "Step two: train your people",
    show: "Send your people to training.",
    say: "The people who know your programs best don't need to become software engineers.",
    see: ["A small label \"Step two\" sits above the title. Three people from your department sit side by side, seen from the front. A laptop opens in front of each person in turn, showing an AI coding tool window with a GitHub mark in its corner. A label runs under all three: \"Trained on AI coding tools and GitHub\"."],
    story: [
      "Choose training on AI coding tools and on GitHub.",
      "They need to know how to describe what they want, and how to read and check what comes back.",
    ],
    steps: [
      { id: "play", show: ["Step two", "Trained on AI coding tools and GitHub"] },
    ],
  },
  {
    id: "github",
    number: "36a",
    part: 6,
    world: "start",
    name: "Step two: GitHub",
    show: "Set up GitHub.",
    say: "That's where the work lives, and where every change gets reviewed.",
    see: ["A small label \"Step two\" sits above the title. A card headed \"Request to IT\" asks IT for three things: organization account, accounts for your staff, permission to create projects. A person labelled \"IT\" gives it the \"a person approves\" mark. Then your department's space on GitHub opens beside it, with GitHub's mark and the name \"Your department\": your staff's accounts, and a project labelled \"History of every change and approval\" that fills with rows. Each row carries the deep-green tick for a change whose checks passed, or the \"a person approves\" mark for an approval."],
    story: [
      "Ask IT to set up a GitHub space for your department, or use the city's if it has one.",
      "GitHub keeps the full history of every change and approval, and your auditors can read all of it.",
    ],
    steps: [
      { id: "play", show: ["Step two", "Request to IT", "organization account", "accounts for your staff", "permission to create projects", "IT", "Your department", "History of every change and approval"] },
    ],
  },
  {
    id: "tools",
    number: "37",
    part: 6,
    world: "start",
    name: "Step two: AI coding tools",
    show: "Request access to AI coding tools.",
    say: "Tools like Claude, Codex and GitHub Copilot. The catalog is a good example to show IT, security and legal.",
    see: ["A small label \"Step two\" sits above the title. An AI coding tool waits outside the door of an outline labelled \"Your department\", with three people inside. A receipt slides in and gets a plain tick: \"Purchased\". A person labelled \"IT, security and legal\" gives it the \"a person approves\" mark, with \"Approved\" beside it. The door swings open, the tool goes in and opens into one window beside the people, and each person gets an agent working in it, writing code."],
    story: [
      "Bring IT, security and legal in early, and show them how the work flows.",
      "Agents write the code, AI reviewers check it, a person approves it, and GitHub records every step.",
    ],
    steps: [
      { id: "play", show: ["Step two", "AI coding tool", "Your department", "Purchased", "IT, security and legal", "Approved"] },
    ],
  },
  {
    id: "approver",
    number: "38",
    part: 6,
    world: "start",
    name: "Step two: a person who approves",
    show: "Decide who is responsible for approving changes.",
    say: "They should know your department and the subject.",
    see: ["A small label \"Step two\" sits above the title. Two person cards stand side by side: \"Your approver\" and \"Backup\". A queue of agent cards lines up in front of them, each agent holding a change. The approver takes three of the changes onto their own card, and the \"a person approves\" mark lands on each one. The last agent card tries to go straight to a locked \"Publish\" button and bounces off, and a label appears: \"An agent can't approve its own work\"."],
    story: [
      "Pick someone who knows your department and the subject, and name a backup.",
      "Agents can't publish anything until your approver signs off.",
    ],
    steps: [
      { id: "play", show: ["Step two", "Your approver", "Backup", "Publish", "An agent can't approve its own work"] },
    ],
  },
  {
    id: "safe",
    number: "38s",
    part: 6,
    world: "start",
    name: "Step two: data security and governance",
    show: "Rolling out AI safely means controlling the data and keeping a person in charge.",
    say: "Some of you are rightly cautious about AI, and this is how we keep it safe. Nothing runs outside accounts your city has approved. We start with data you already publish. Every change goes through tests, two AI reviewers and a person before it goes live, and the record on GitHub shows your auditors who changed what and when. If something is wrong, you roll it back.",
    see: ["A small label \"Step two\" sits above the title. A dashed outline labelled \"Your department\" stands inside a fence, labelled \"Accounts your city approves\". A data table labelled \"Public data\" passes through the gate in the fence into the department; a second table labelled \"Personal or health data\" stops outside it and stays there. Inside, three changes arrive one at a time; each stops at a person labelled \"Approver\", takes the \"a person approves\" mark, and lands on a record line labelled \"GitHub record\" with a time stamp. The last entry slides back off the line, labelled \"Undone\", and the line closes up."],
    story: [
      "Agents work inside the GitHub and AI tool accounts your city already approves, under its own rules.",
      "Start with public data. A person approves every change, GitHub records it, and you can undo it.",
    ],
    steps: [
      { id: "play", show: ["Step two", "Accounts your city approves", "Your department", "Public data", "Personal or health data", "Approver", "GitHub record", "Undone"] },
    ],
  },
  {
    id: "questions",
    number: "38a",
    part: 6,
    world: "start",
    name: "Your IT and security teams will ask these four questions",
    show: "Your IT and security teams will ask these four questions.",
    say: "Keep the work inside accounts your city already approves, and remember that any change can be rolled back.",
    see: ["Four questions appear one at a time, each with its short answer beside it:", "Where does our data go? Start with public data.", "Who is accountable? A person approves every change.", "What if the AI gets it wrong? Tests, two AI reviewers and a person check every change.", "Do we need developers? You need someone technical to help with setup."],
    story: [
      "Keep the work in accounts your city already approves, and you can undo any change.",
    ],
    steps: [
      { id: "play", show: ["Where does our data go?", "Start with public data.", "Who is accountable?", "A person approves every change.", "What if the AI gets it wrong?", "Tests, two AI reviewers and a person check every change.", "Do we need developers?", "You need someone technical to help with setup."] },
    ],
  },
  {
    id: "fde",
    number: "38b",
    part: 6,
    world: "start",
    name: "No tech staff? Forward-deployed engineers",
    show: "If you have no technical staff, ask IT to place an engineer inside your team.",
    say: "Your IT department might assign one of its own engineers this way, or bring one in through a partner. The engineer builds the plane while it's flying, and your staff's new skills stay after the engineer moves on.",
    see: ["Your department on one side and central IT on the other, with the central IT queue between them. One engineer leaves IT and sits down with your staff. They build a first tool together, then the engineer steps back and your staff keep building."],
    story: [
      "This is called a forward-deployed engineer: an IT engineer placed inside your team.",
      "Your work skips the central IT queue, and the engineer builds with your people day to day.",
    ],
    steps: [
      { id: "play", show: ["Your department", "Central IT", "Engineer", "Central IT queue"] },
    ],
  },
  {
    id: "low-risk",
    number: "39",
    part: 6,
    world: "start",
    name: "Step three: low risk, high return",
    show: "Start with low-risk projects that use public data and help residents right away.",
    say: "Start where the data is already public. The agents do the building, and your approver signs off.",
    see: ["A small label \"Step three\" sits above the title. A scattered pile of public information labelled \"Public data\". Navy arrows carry it to an agent, and from the agent into one clear tool with three services. A third arrow leads out to residents, who arrive beside the services. A path starts with this first project on it. The rest of the path is dotted."],
    story: [
      "You already publish the data: your services, clinic hours and eligibility rules.",
      "Agents can build the data pipeline, analysis tool or dashboard you want, and a person approves it.",
    ],
    steps: [
      { id: "play", show: ["Step three", "Public data", "Agent", "One clear tool", "Residents", "First project"] },
    ],
  },
  {
    id: "examples",
    number: "40",
    part: 6,
    world: "start",
    name: "Two starter templates",
    show: "Two ideas we plan to release as starter templates: a Service Catalog and a Voice-Assisted Service Helpline.",
    say: "These are ideas we've worked out in Austin, and both are planned for our release. The helpline lets people ask out loud and get pointed to the right service. Projects like these are a good place to cut your teeth, and they pay off from the first day.",
    see: ["Two line drawings side by side, each with a tag reading \"Starter template\". In the first, labelled \"Service Catalog\", a resident answers a few questions and their matching services light up. In the second, labelled \"Voice-Assisted Service Helpline\", a spoken question turns into a short list of services. Both stay line drawings, with no screenshots."],
    story: [
      "The Service Catalog matches residents to services. The helpline answers questions people ask out loud.",
      "Each template gives your agents a starting point to build on with your own public data.",
    ],
    steps: [
      { id: "play", show: ["Starter template", "Service Catalog", "Voice-Assisted Service Helpline"] },
    ],
  },
  {
    id: "ramp",
    number: "41",
    part: 6,
    world: "start",
    name: "Then take on more",
    show: "Start small, then take on more.",
    say: "By then you'll have the agent pack, everyone else's use cases and, once it's cleared, our source code to build from.",
    see: ["The path from slide 39 goes on, with the \"First project\" still standing at its start. Further along it, bigger tools fill in and grow as you watch: a \"Clinic finder\", then a \"Dashboard\" with more charts, then a \"Data pipeline\" feeding both. They all stand inside an outline labelled \"Your department\", with the path as its floor. The path leads on out of it to \"The catalog\", a frame of entries with one open slot, and your department's newest tool goes along it, as a tile, into that slot. The stretch of path it took stays drawn in navy, from your department's wall to the slot."],
    story: [
      "Your team learns the tools, your approver learns the job, and you build your design system.",
      "When you build something, share it back in the catalog.",
    ],
    steps: [
      { id: "play", show: ["Clinic finder", "Dashboard", "Data pipeline", "Your department", "The catalog", "First project"] },
    ],
  },
  {
    id: "ask",
    number: "42",
    part: 6,
    world: "start",
    name: "Our ask",
    show: "Four things to do next.",
    say: "Post one project in the catalog this month. If every member posts one, every member gets all of them, and the catalog keeps growing. For the agent pack, we're aiming for December 2026.",
    see: ["Four cards come up one at a time, two by two, each with a drawing that acts it out. Post one project in the catalog this month: a form fills in and goes out into a tray. Tell us if you're ready to start now: a person raises a hand. Load the agent pack when it's ready: the pack arrives. Without technical staff, ask IT to place an engineer inside your team: an engineer comes to the empty seat at a table. No number appears."],
    story: [
      "Approvals take the longest, so start those requests early. Tell us if you're ready now.",
    ],
    steps: [
      { id: "play", show: ["Post one project in the catalog this month.", "Tell us if you're ready to start now.", "Load the agent pack when it's ready.", "Without technical staff,", "ask IT to place an engineer inside your team."] },
    ],
  },
];
