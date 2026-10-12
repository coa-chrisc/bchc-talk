/** The talk's worlds, in the order the deck gives them. Each is built by one builder (docs/bchc-art-direction.md, section 2). */
export const WORLDS = ["catalog", "build", "sharing", "releasing", "start", "close"] as const;
export type WorldId = (typeof WORLDS)[number];

/**
 * One click. A click brings a whole picture, its beats chaining on their
 * own (docs/bchc-flow-revision.md, section 1), so a picture has one step,
 * `play`, or two where the audience must sit on a half-finished picture
 * (slide 19: `plan`, then `work`; slide 27: `grow`, then `outside`). `id` is the step's id; with its
 * picture's id it is the step's address (`picture.step`). `show` is every
 * label the click puts on the stage besides the picture's title and its
 * story lines, in the order they arrive: a label the script's They see
 * names, or a fragment of You say the plan quotes. Scenes take their words
 * from here (`shown()`), never from a literal.
 */
export type Step = { id: string; show: string[] };

/**
 * One slide of the approved script (docs/bchc-talk-script.md), word for
 * word. `show` is its On screen line, `say` its You say, and `see` its They
 * see: one entry per numbered click, or a single entry when the script does
 * not number them, then one entry per item of a list under it (slide 38a's
 * four questions). `number` is the script's own ("1", "36a"), and `name` its
 * heading. `story` is the slide's story lines, zero to two, so the deck
 * reads without a speaker: line A lands with the beat it explains, line B
 * with its own (docs/bchc-flow-revision.md, section 3). They are the
 * script's story lines under its On screen line, word for word. `steps` are
 * the plan's clicks, in order.
 */
export type Picture = { id: string; number: string; part: number; world: WorldId; name: string; show: string; say: string; see: string[]; story: string[]; steps: Step[] };
