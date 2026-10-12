import type { Picture } from "./types";

/** Part 4. Sharing and collaboration. */
export const SHARING: Picture[] = [
  {
    id: "together",
    number: "23",
    part: 4,
    world: "sharing",
    name: "Share one tool, get them all",
    show: "When three departments each share one tool, all three get three tools.",
    say: "This is what I'd like you to get excited about. You share one thing, you share one thing, you share one thing, and now as a group we have three tools and every one of us has all three. The catalog is where we share. The process is how each of us takes something and makes it ours. The more we share, the bigger the pool we and our agents can build from.",
    see: ["Three departments stand along the bottom, labelled Department A, Department B and Department C. Each holds one tool with its own icon and name: a \"Clinic finder\" with a map pin, a \"Dashboard\" with a bar chart, and a \"Data pipeline\" with joined pipes. Each tool sits at the foot of a stack of three places. Above them, a still of the catalog's card grid, labelled \"The catalog\", is cropped to three empty slots, so no other entry can be read. One by one, each department sends its tool up into a slot, where it lands as a card in the catalog's colour. Then copies flow back down, one at a time, and no card ever crosses another. Each copy waits beside that department's own agents while they adapt it, then drops into the stack with a dashed corner labelled \"Adapted\". The agents are labelled once, \"AI agents\". Each department now holds all three tools, its own at the foot, told apart by icon and name, and the count under the catalog reads \"3 tools shared, 3 tools each\". No other slide shows departments under the catalog."],
    story: [
      "The catalog holds what they share, and each department takes what it needs.",
      "Each department's own AI agents do the heavy lifting of adapting each tool to fit.",
    ],
    steps: [
      { id: "play", show: ["Department A", "Department B", "Department C", "Clinic finder", "Dashboard", "Data pipeline", "Adapted", "AI agents", "The catalog"] },
    ],
  },
  {
    id: "everyone",
    number: "24",
    part: 4,
    world: "sharing",
    name: "When every member shares",
    show: "If every member shares one, every member gets all of them, and the catalog keeps growing.",
    say: "It's the module idea at coalition scale. Every member shares one use case, and every member gets all of them, with AI tailoring each one to each department. We stop spending that money, and we stop waiting months or years to be turned down. Each of us can also build new modules and post them, so the pool keeps growing. We start the work and get it done.",
    see: ["The view starts close on one outline labelled \"Your department\", holding a single tile labelled \"Yours\": the use case you shared. Tiles from other members start to land in it, in the catalog's colour: one, then two at once, then four, then too many to follow. The outline packs full and widens to make room, and new tiles keep landing at its edges as the slide ends. As each tile lands, a dashed corner shows your agents adapting it. No number appears anywhere."],
    story: [
      "Share the source code too when you can, so others can build from it.",
      "Your agents adapt the ones you need to fit your department.",
    ],
    steps: [
      { id: "play", show: ["Your department", "Yours"] },
    ],
  },
  {
    id: "adapt",
    number: "25",
    part: 4,
    world: "sharing",
    name: "Your agents adapt it to where you run",
    show: "Your agents can adapt a tool to run on your systems.",
    say: "Your setup won't match ours. Your agents handle how it stores data, how people sign in and how it deploys. The next department on AWS starts from your version.",
    see: ["One large tool card fills the middle of the frame: \"Clinic finder\", with its map pin and a badge in the corner reading \"Azure\". An agent labelled \"Your agents\" works on the card, and three of its lines rewrite one at a time: \"Data storage\", \"Sign-in\", \"Deployment\". The badge flips over and reads \"AWS\", and a dashed corner labelled \"Adapted\" appears. A deep-green tick appears beside each of the three lines as its tests pass. A person labelled \"A person on your team approves\" gives it the \"a person approves\" mark. The card shrinks and slides up into the catalog, next to the Azure original."],
    story: [
      "If a tool runs on Microsoft Azure and your city uses Amazon Web Services (AWS), they can move it over.",
      "They test it, a person on your team approves it, and the AWS version goes back into the catalog.",
    ],
    steps: [
      { id: "play", show: ["Clinic finder", "Azure", "Your agents", "Data storage", "Sign-in", "Deployment", "AWS", "Adapted", "A person on your team approves"] },
    ],
  },
  {
    id: "more",
    number: "26",
    part: 4,
    world: "sharing",
    name: "Share more than code",
    show: "Share more than code.",
    say: "Sharing goes well beyond AI and code. We want departments working together.",
    see: ["A still of the real catalog form at its question \"What kind of solution is it?\". Four of its options are circled one at a time: \"Data pipeline or integration\", \"Dashboard or visualization\", \"Workflow automation\" and \"Standards, governance or playbook\". Then a finished project card labelled \"Your project in the catalog\" appears beside the form with its contact line lit, and two messages come in from people in other departments: \"Can we reuse this?\" and \"We can help with that.\""],
    story: [
      "Post a data pipeline, a dashboard, a workflow or a playbook, with or without its code.",
      "Another department might reuse it, or offer help with something you're stuck on.",
    ],
    steps: [
      { id: "play", show: ["What kind of solution is it?", "Data pipeline or integration", "Dashboard or visualization", "Workflow automation", "Standards, governance or playbook", "Your project in the catalog", "Can we reuse this?", "We can help with that."] },
    ],
  },
  // Two clicks: `grow` (line A) and `outside` (line B). Closes Part 4 since slide 28 was cut in draft 8.
  {
    id: "network",
    number: "27",
    part: 4,
    world: "sharing",
    name: "The more we share, the more we can do",
    show: "The more we share, the more we can do.",
    say: "This is the picture I'd like you to take home. Where each of us relied on a vendor on our own, we can rely on what we share. When Austin shares a tool, every department can have it, and every department that joins makes the middle bigger for all of us.",
    see: ["Austin connects to the centre and adds a few modules. More departments join, and the centre grows with each one. Every department is a circle in the same colour, and each circle carries its department's name inside it as it joins: \"Austin\", \"Los Angeles County\", \"Chicago\", \"Houston\", \"New York City\", \"Denver\".", "The other six departments join, each named inside its circle: \"Detroit\", \"Philadelphia\", \"Dallas County\", \"Boston\", \"Washington, D.C.\", \"San Antonio\". The centre grows again and five more modules fill in. A small grey square appears just outside the ring near each department, labelled once \"Vendors\" beside Los Angeles County's square. Every department draws a heavy grey line out to its square, and a dollar sign slides along each line toward the vendor and fades just before it reaches the square. Then Austin's line is pulled in through its circle to the middle, leaving a faint dashed copy where it ran out, and its square fades. The other departments' lines are pulled in the same way one after another round the ring, ending at Los Angeles County under Austin, and the squares and the label \"Vendors\" fade. Austin's dashed copy is labelled \"Before\", and its line in to the middle is labelled \"Now\". A tile in the catalog's colour, a little larger than the modules in the centre, appears inside Austin's circle: a tool Austin made. It travels into the middle and takes its place there. Three copies of it travel out to Boston, Houston and Chicago and settle inside each circle under its name, each with the dashed corner that marks an adapted tool on slides 23 to 25. No other slide shows this network."],
    story: [
      "Each circle is a health department, and in the middle is everything we share.",
      "Where each of us relied on a vendor, we can rely on what we share, and pass tools between us.",
    ],
    steps: [
      { id: "grow", show: ["Austin", "Los Angeles County", "Chicago", "Houston", "New York City", "Denver"] },
      { id: "outside", show: ["Detroit", "Philadelphia", "Dallas County", "Boston", "Washington, D.C.", "San Antonio", "Vendors", "Before", "Now"] },
    ],
  },
];
