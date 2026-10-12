/**
 * Slide 26, share more than code: the real submit form at its question
 * "What kind of solution is it?", four of its choices circled one at a
 * time; then a finished project card beside it, named as yours in the
 * catalog, its contact line lit, and
 * two messages coming in from people in other departments.
 */
import { box, type Box, type Point } from "@/components/deck/kit";
import { shown } from "../../script/find";
import { LABEL_LINE, SAFE, SUBMIT_FORM, contentTop, groupOf, onStill } from "./layout";

const SHOWN = shown("more", "play");
/** The form's question and the four choices circled, as the script lists them; then the project card's name and the two messages. */
const [QUESTION] = SHOWN;
const CIRCLED = SHOWN.slice(1, 5);
const POSTED = SHOWN[5];
const MESSAGES = SHOWN.slice(6);

const FRAME = box(96, contentTop("more") + 8, SUBMIT_FORM.w, SUBMIT_FORM.h);
/** How far round a choice's own border its ring is drawn: inside the 8 px between two choices. */
const RING_PAD = 2;

/** The project card at the right: as wide as the stage leaves beside the form, its name over it. */
const CARD_X = FRAME.x + FRAME.w + 72;
const NAME_ROOM = LABEL_LINE + 8;
const CARD = box(CARD_X, FRAME.y + 8 + NAME_ROOM, SAFE.right - CARD_X, 248);
/** Its placeholder lines, as the card's own offsets: the name, two lines of description, three tags, a rule, and the contact line. */
const BARS = [
  { x: 28, y: 30, w: 340, h: 20, tone: "name" },
  { x: 28, y: 72, w: 520, h: 12, tone: "text" },
  { x: 28, y: 96, w: 440, h: 12, tone: "text" },
  { x: 28, y: 128, w: 96, h: 24, tone: "tag" },
  { x: 136, y: 128, w: 120, h: 24, tone: "tag" },
  { x: 268, y: 128, w: 84, h: 24, tone: "tag" },
] as const;
const RULE_Y = 176;
const CONTACT = { icon: { x: 28, y: 194, size: 28 }, bar: { x: 72, y: 202, w: 260, h: 12 } } as const;

/** A message: the person who sent it at the left (kit Person) and their words in a bubble beside it. */
const MESSAGE = { person: { w: 40, h: 52 }, bubble: { dx: 48, w: 520, h: 60 }, first: CARD.y + CARD.h + 76, pitch: 100 } as const;
/** The middle of a message's person. */
const messageAt = (n: number): Point => ({ x: CARD.x + 30, y: MESSAGE.first + n * MESSAGE.pitch });

export const MORE = {
  ...groupOf("more"),
  frame: { key: "more.frame", at: FRAME, stills: [{ src: SUBMIT_FORM.src, alt: `The catalog's submit form at its question "${QUESTION}", with all its choices` }] },
  question: QUESTION,
  /** A ring round each of the four choices, in the order the script circles them. */
  rings: CIRCLED.map((name, n) => {
    const choice = onStill(FRAME, SUBMIT_FORM.choices[name]);
    return { key: `more.ring.${n}`, name, at: box(choice.x - RING_PAD, choice.y - RING_PAD, choice.w + 2 * RING_PAD, choice.h + 2 * RING_PAD) as Box };
  }),
  card: {
    key: "more.card",
    at: CARD,
    /** What the card is, over its top left: it comes with the card. */
    name: { text: POSTED, at: box(CARD.x, CARD.y - NAME_ROOM, CARD.w, LABEL_LINE) as Box },
    bars: BARS.map((bar) => ({ ...bar, at: box(CARD.x + bar.x, CARD.y + bar.y, bar.w, bar.h) })),
    rule: { from: { x: CARD.x + 28, y: CARD.y + RULE_Y }, to: { x: CARD.x + CARD.w - 28, y: CARD.y + RULE_Y } },
    /** The contact line: an envelope and a line of text, lit in the catalog's indigo (`--k`). */
    contact: {
      key: "more.contact",
      icon: { x: CARD.x + CONTACT.icon.x, y: CARD.y + CONTACT.icon.y, size: CONTACT.icon.size },
      bar: box(CARD.x + CONTACT.bar.x, CARD.y + CONTACT.bar.y, CONTACT.bar.w, CONTACT.bar.h),
    },
  },
  /** Two messages from people in other departments, in the order they come in: each its person, drawn on (`draw`), and its bubble. */
  messages: MESSAGES.map((text, n) => {
    const mid = messageAt(n);
    const bubble = box(mid.x + MESSAGE.bubble.dx, mid.y - MESSAGE.bubble.h / 2, MESSAGE.bubble.w, MESSAGE.bubble.h);
    const person = { key: `more.message.${n}.person`, at: box(mid.x - MESSAGE.person.w / 2, mid.y - MESSAGE.person.h / 2, MESSAGE.person.w, MESSAGE.person.h) as Box };
    return { key: `more.message.${n}`, text, person, bubble, textAt: { x: bubble.x + 28, y: mid.y } };
  }),
};
