import type { Picture } from "./types";

/** Part 7. Close. */
export const AGENTIC_PRESENTING: Picture[] = [
  // Slide 43 is cut in draft 8: its story, agents built this talk too, lands here.
  {
    id: "thanks",
    number: "44",
    part: 7,
    world: "close",
    name: "Thank you",
    show: "One city proves value. Every city starts further ahead. Thank you. Austin Public Health.",
    say: "One city proves value, and every city starts further ahead. The catalog is the proof, and it's what cities working together can build. The agent pack, our source code and your use cases are how every city gets further ahead. One more thing: agents built this talk too. We built it by voice, talking to agents. Agents built each slide, other agents reviewed them, and a person approved them. Thank you. I'm happy to take questions.",
    see: ["The close is navy. The view pulls back from the first slide, and real thumbnails of every slide in the talk assemble into one grid. As each thumbnail lands, an agent flies in and settles on it, and a label reads \"Agents built this talk too\". The closing lines appear above the grid."],
    story: [],
    steps: [
      { id: "play", show: ["Agents built this talk too", "One city proves value.", "Every city starts further ahead.", "Thank you. Austin Public Health."] },
    ],
  },
];
