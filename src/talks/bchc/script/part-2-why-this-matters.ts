import type { Picture } from "./types";

/** Part 2. Why this matters. */
export const WHY_THIS_MATTERS: Picture[] = [
  {
    id: "too-long",
    number: "11",
    part: 2,
    world: "catalog",
    name: "The problem we all share",
    show: "For most health departments, getting a new tool takes months or years and costs too much.",
    say: "You wrote requirements, went through procurement, waited for a vendor and waited for setup. Sometimes the answer after all that was no. By the time the tool arrived the program had changed. Meanwhile your staff kept the work going in spreadsheets.",
    see: ["A request card, \"We need a tool\", sits on the left. Beside it, a wall calendar has a page for each month, its name at the top: \"Jan\", \"Feb\", \"Mar\", \"Apr\", \"May\", \"Jun\", \"Jul\", \"Aug\", \"Sep\", \"Oct\", over the calendar's own \"Nov\". The pages turn while the card waits, each a little faster than the last, and \"Months or years\" appears. Quotes arrive one at a time, each labelled \"New quote\", and a stack of dollar signs beside the card grows taller with each one as another page turns, faster again. A \"No\" stamp swings over the card and lifts: the answer can still be no. Then a change request arrives, labelled \"Change request\", and it starts again: another \"New quote\", more dollar signs, and the last pages flip fastest of all, until the calendar shows November. All in grey."],
    story: [
      "Think about the last tool your team asked for.",
      "It can take months or years, the answer can still be no, and every later change needs a new quote.",
    ],
    steps: [
      { id: "play", show: ["We need a tool", "Months or years", "New quote", "No"] },
    ],
  },
  {
    id: "tools-gap",
    number: "11a",
    part: 2,
    world: "catalog",
    name: "The tools gap",
    show: "Your tools are gaining AI features, but the tools you still need aren't getting built.",
    say: "Many of the tools you already pay for are adding AI features this year. Some of those features are useful. But the price often goes up, and the tools your team has been asking for still aren't there.",
    see: ["A product card on the left, labelled \"A tool you already have\", with its price under it as a row of dollar signs. An AI badge, labelled \"AI\", slides across and settles inside the card, and the price grows another row of dollar signs. On the right, three dashed outlines wait, labelled \"Data pipeline\", \"Analysis tool\" and \"Dashboard\". The card keeps its badge; the outlines stay empty. All in grey."],
    story: [
      "An AI feature inside a tool you already use can be useful, though it often raises the price.",
      "It doesn't close the tools gap: the pipeline, analysis tool or dashboard you've been waiting for.",
    ],
    steps: [
      { id: "play", show: ["A tool you already have", "AI", "Data pipeline", "Analysis tool", "Dashboard"] },
    ],
  },
  {
    id: "ai-builds",
    number: "12",
    part: 2,
    world: "catalog",
    name: "AI that builds the tool",
    show: "To close the tools gap, have AI agents build the tools you need.",
    say: "So how do you get the tools that aren't coming? Have AI agents build them. The people who know the work, your epidemiologists and program staff, describe what they need. Agents plan it, build it, test it and review each other's work.",
    see: ["An app outline with a chat bubble inside: \"AI inside a tool\". A prohibition sign is drawn over it. Then the picture itself shrinks and travels to the left, carrying the sign, and stays there, faded, leaving the empty outline in place; the first story line leaves the screen. A person, labelled \"Program staff\", describes what they need. An AI agent, labelled \"AI agent\", outside the outline fills it with building blocks: \"AI that builds the tool\". The program staff approve the finished tool with the \"a person approves\" mark."],
    story: [
      "AI inside a tool helps with the work that tool was built for.",
      "With agentic development, your staff describe what they need, and AI agents build the whole tool.",
    ],
    steps: [
      { id: "play", show: ["AI inside a tool", "AI that builds the tool"] },
    ],
  },
  {
    id: "yours",
    number: "13",
    part: 2,
    world: "catalog",
    name: "You own it",
    show: "When your agents build the tool, you own it.",
    say: "Because your agents built it, the tool is yours. When the program changes next month, you don't wait for a new quote.",
    see: ["The app with \"Yours\" drawn around it. A history line underneath, labelled \"Every change and every approval on record\", gains a new approval mark."],
    story: [
      "The code lives in your own GitHub account, with every change and every approval on record.",
      "When your program changes, you describe the change, agents make it and someone on your team approves it.",
    ],
    steps: [
      { id: "play", show: ["Yours"] },
    ],
  },
];
