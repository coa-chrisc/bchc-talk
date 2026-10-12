import type { Picture } from "./types";

/** The catalog's web address, the "web address" of slide 2's On screen line. */
export const ADDRESS = "big-cities-health-coalition.github.io/use-case-catalog";

/**
 * The time on the approval at the foot of slide 7's review card, beside
 * "Reviewer" (slide 6, where it first stood, is cut and folded into 5 and
 * 7): the plan's placeholder (docs/bchc-art-direction.md, slide 6), since
 * the deck names no real reviewer. Like the address it is not a phrase of the script, so it is
 * kept here and not in a step's `show`.
 */
export const APPROVED_AT = "14:32";

/**
 * Slide 8's list of files: the folder every entry lives in, and three of the
 * catalog's real entries by their files (use-case-catalog: catalog/<entry>/index.md).
 */
export const ENTRY_FOLDER = "catalog/";
export const ENTRY_FILES = ["epi-signal-triage/index.md", "overdose-spike-brief/index.md", "plain-language-notices/index.md"];

/** Part 1. The catalog. */
export const THE_CATALOG: Picture[] = [
  {
    id: "title",
    number: "1",
    part: 1,
    world: "catalog",
    name: "Title",
    show: "Using AI in Public Health Practice. Big Cities Health Coalition, Data Modernization Work Group. Austin Public Health.",
    say: "Thanks for having us. This is launch week for something we've been working on with the coalition, so if you haven't heard about it yet, I'll start there: a new tool that came out of a collaboration between Austin Public Health and the Big Cities Health Coalition, and every department here can use it today. This whole conference is about big cities coming together and getting things done, and this is one example of that. Most of the AI reaching our tools today is features inside products; I'll show you agents that build the tools themselves. Then I'll show you the agentic development process we used to build it in about three working sessions, and how we plan to share that process with you, so your department can build its own tools the same way.",
    see: ["The title and credit."],
    story: [
      "AI in public health is moving from chatbots inside tools to agents that build the tools.",
      "We built the coalition's use case catalog that way, and we'll show how your department can too.",
    ],
    steps: [
      { id: "play", show: [] },
    ],
  },
  {
    id: "the-catalog",
    number: "2",
    part: 1,
    world: "catalog",
    name: "The catalog",
    show: "The Public Health AI & Tech Exchange.",
    say: "This is the coalition's use case catalog, the Public Health AI and Tech Exchange, and it launched this week. Departments post the AI tools, data projects and digital services they've built, so the rest of us can find them. Before your team spends months on something new, look here. Another department may have solved it already, and you can call them.",
    see: ["The catalog's home page wipes in. A small tag appears beside it, \"Built by Austin Public Health and the Big Cities Health Coalition\", and the web address appears underneath."],
    story: [
      "In the coalition's use case catalog, departments post the AI tools and data projects they've built.",
      "Before your team spends months building something, see if another city already has.",
    ],
    steps: [
      { id: "play", show: [ADDRESS] },
    ],
  },
  {
    id: "find",
    number: "3",
    part: 1,
    world: "catalog",
    name: "Find what others have built",
    show: "Find what other departments have built.",
    say: "You can search by keyword, filter by public health area, type of solution, how far along a project is and where it runs, and compare two projects side by side.",
    see: ["The catalog's card grid in colour, as it looks on the live site. The search box, the filters and the compare button are circled one at a time."],
    story: [
      "Search by keyword, or filter by public health area, type of solution and how far along it is.",
      "Compare two projects side by side before you call anyone.",
    ],
    steps: [
      { id: "play", show: ["Search", "Filter", "Compare"] },
    ],
  },
  {
    id: "entry",
    number: "4",
    part: 1,
    world: "catalog",
    name: "What a project tells you",
    show: "Each project shows what was built, what it cost and who to call.",
    say: "Open a project and you get the full profile, including what it cost to stand up and to keep running. Every project names a contact, so you can talk to the people who built it.",
    see: ["One project circled. Its six fields list beside it one at a time: what the department built, where it runs, the skills it needed, how ready it is, what it cost, who to contact."],
    story: [
      "Open a project to see where it runs, the skills it needed and how ready it is.",
      "Every project names a contact, so you can ask the team that built it.",
    ],
    steps: [
      { id: "play", show: ["what the department built", "where it runs", "the skills it needed", "how ready it is", "what it cost", "who to contact"] },
    ],
  },
  {
    id: "six-steps",
    number: "5",
    part: 1,
    world: "catalog",
    name: "From form to live page",
    show: "How a project gets from the form to the live site.",
    say: "Adding your own project is simple. You fill in a form and send it, and that opens a request on GitHub. Scripts turn your answers into a draft page and check it. A person on the review team reads it and approves it, and about five minutes later it's on the site. Nobody retypes anything. The person who sent it gets a link to a status page, so they can see where their project is at each step and when it's published.",
    see: ["Six boxes in a row: Form, Request, Draft, Checks, Approval, Live. A person fills in the form and sends it, and a card for that submission moves into Request. \"Automatic\" marks Draft and Checks while the card passes through them, and each check gets the \"passed\" tick. The card waits at Approval until a reviewer approves it with the \"a person approves\" mark, then moves to Live. Under the row, the sender's status page, labelled \"You can follow it the whole way\", lights each step as the card reaches it and reads \"Published\" when the card reaches Live. In Part 1, only this slide shows the row of boxes."],
    story: [
      "You fill in the form and send it, and that opens a request on GitHub.",
      "Scripts turn your answers into a draft page and check it. A reviewer approves it, and it goes live.",
    ],
    steps: [
      { id: "play", show: ["Form", "Request", "Draft", "Checks", "Approval", "Live", "Automatic", "You can follow it the whole way", "Published"] },
    ],
  },
  {
    id: "review",
    number: "7",
    part: 1,
    world: "catalog",
    name: "Easy to review",
    show: "Sending a project in is easy, and so is reviewing it.",
    say: "We made the reviewers' job easy too. Each draft comes with a checklist from the catalog's governance rules, and anything that touches sensitive data gets flagged for a data governance review. A person reads the draft, works through the checklist and decides. There's no AI in the review.",
    see: ["A reviewer, labelled \"Reviewer\", sits at a desk with the new submission open as one card: the draft page, its privacy box ticked, and a checklist. A \"Data governance review\" flag lands on the card. The reviewer reads the draft and works down the checklist, and each item gets the \"passed\" tick. The reviewer's \"a person approves\" mark lands at the foot of the card with \"Approved\", the reviewer's name and the time. No AI agent appears on this slide. The row of boxes from slide 5 is gone."],
    story: [
      "People who submit confirm they aren't sharing personal or health information, and anything sensitive gets a data governance review.",
      "A reviewer works through a checklist for each submission and decides.",
    ],
    steps: [
      { id: "play", show: ["Data governance review", "Approved"] },
    ],
  },
  {
    id: "nothing-to-run",
    number: "8",
    part: 1,
    world: "catalog",
    name: "No server, no database",
    show: "There's no server or database to maintain.",
    say: "Someone has to pay for a server and a database and keep them secure. We had faced the same problem on an earlier Austin Public Health project: no budget for servers or hosting, and no wish to pay an agency. We did have GitHub accounts. So we wrote Ruby and Jekyll scripts on top of features GitHub already has. A form submission becomes a GitHub issue, the scripts turn it into a pull request, and a person approves it. We used the same idea for the catalog.",
    see: ["Three boxes appear (server, database, editor login), then are crossed out. A list of files appears beside them, with \"Hosted free on GitHub Pages\"."],
    story: [
      "Most websites that take submissions need a server, a database and logins for editors.",
      "We copied an earlier Austin project, where GitHub stored each entry as a file and hosted it free.",
    ],
    steps: [
      { id: "play", show: ["server", "database", "editor login", "Hosted free on GitHub Pages"] },
    ],
  },
  {
    id: "three-days",
    number: "9",
    part: 1,
    world: "catalog",
    name: "Three working sessions",
    show: "We built the catalog in three working sessions.",
    say: "The coalition asked Austin Public Health for help building a catalog every department could use. In the first session, I sat down with my agents and our development process. We talked through the idea and the earlier project, and the agents laid out the options. I approved their plan, and they built most of it on their own in that session. By the end of it we had a first draft. The coalition liked it and asked for changes. A second session made them. Then the work group and the coalition's leaders saw it and asked for some branding and other changes, and a third session finished it. That's three working sessions and three rounds of feedback. Dozens of agents did the heavy lifting, and people made the decisions. For Austin, this was a way to give something back. We built it for every member of the coalition.",
    see: ["Three session cards, Session 1, Session 2 and Session 3, appear one after another. Under them, three people stand on a line labelled \"Big Cities Health Coalition\". After each card, a \"Feedback\" mark comes up from the coalition, and the next card starts from it. The last \"Feedback\" leads to the catalog going \"Live\". The slide shows no clock, no hours and no timeline."],
    story: [
      "The Big Cities Health Coalition asked Austin Public Health for help. In the first session, we planned it with our agents, and they built a working draft.",
      "After each session, the coalition gave feedback, and the agents made the changes in the next one.",
    ],
    steps: [
      { id: "play", show: [] },
    ],
  },
  {
    id: "proof",
    number: "10",
    part: 1,
    world: "catalog",
    name: "What made it possible",
    show: "We built the catalog with our agentic development process.",
    say: "We started with the catalog because you can use it. It's also proof. We didn't hire a vendor. We used the process we use for every tool we build, and in a few minutes I'll show you how it works.",
    see: ["A bare wireframe of the catalog's front page draws on the right. AI agents, labelled \"AI agents\", build it piece by piece: the header, then the search box and filters, then the rows of project cards. A few people, labelled \"People\", stand beside the agents, and the \"a person approves\" mark lands on each piece as they approve it. When the last card is in, the real catalog picture settles into the wireframe. On the left, with the people and agents and apart from the page, one label: \"Our agentic process\", with \"modules, design system, memory\" beneath it, in the process's colour."],
    story: [
      "In this process, AI agents plan, build, test and review the work, and a person approves every release.",
      "A small Austin Public Health team used it to build the catalog for every coalition member, without hiring a vendor.",
    ],
    steps: [
      { id: "play", show: ["Our agentic process", "modules, design system, memory"] },
    ],
  },
];
