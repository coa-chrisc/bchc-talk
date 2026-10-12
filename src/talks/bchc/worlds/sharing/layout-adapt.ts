/**
 * Slide 25, your agents adapt it to where you run: one large tool card in
 * the middle, "Clinic finder" with its map pin and a badge reading "Azure",
 * under the catalog's three places, the Azure original in the first. Your
 * agents stand at its left and rework three of its lines one at a time; the
 * badge flips to "AWS" and a dashed corner says it is adapted; each line
 * takes a deep-green tick as its tests pass; a person on your team, at its
 * right, approves it; and a copy of it shrinks up into the catalog's
 * second place, beside the original. The large card stays, so the end frame
 * still shows what changed.
 */
import { box, type Box, type Point } from "@/components/deck/kit";
import { shown } from "../../script/find";
import { CATALOG_SLOTS, LABEL_LINE, centreOf, contentTop, groupOf, slotsAt } from "./layout";

const [TOOL, AZURE, YOUR_AGENTS, STORAGE, SIGN_IN, DEPLOYMENT, AWS, ADAPTED, APPROVES] = shown("adapt", "play");

/** The catalog's still, centred under the story band. */
const FRAME = box(960 - CATALOG_SLOTS.w / 2, contentTop("adapt") + 8, CATALOG_SLOTS.w, CATALOG_SLOTS.h);
const SLOTS = slotsAt(FRAME);

/** A tool in the catalog: its icon and name, and its badge at its foot right; a card in the middle of its place. */
export const MINI = { w: 256, h: 100, rx: 8, icon: 28, pad: 14, badge: { w: 92, h: 34 }, corner: 18 } as const;
const miniAt = (k: number): Box => box(SLOTS[k].x + (SLOTS[k].w - MINI.w) / 2, SLOTS[k].y + (SLOTS[k].h - MINI.h) / 2, MINI.w, MINI.h);

/** The large card: its icon and name across the top, its three lines under them, its badge at its foot right and its dashed corner at its top right. */
export const BIG = { at: box(660, FRAME.y + FRAME.h + 28, 600, 312), rx: 12, icon: 36, pad: 28, badge: { w: 120, h: 44 }, corner: 32 } as const;
const { at: CARD } = BIG;
const ROWS = { first: 104, pitch: 52, barX: 250, barW: 290, barH: 14 } as const;
/** A line's tick: this far right of its bar's end, at this radius. */
const TICK = { gap: 15, r: 11 } as const;
const badgeIn = (card: Box, size: { w: number; h: number }, inset: { x: number; y: number }): Box => box(card.x + card.w - inset.x - size.w, card.y + card.h - inset.y - size.h, size.w, size.h);

const AGENT: Point = { x: CARD.x - 120, y: CARD.y + CARD.h / 2 };
const AGENT_R = 28;
const PERSON: Box = box(CARD.x + CARD.w + 40, CARD.y + 108, 48, 64);
const MARK: Point = { x: PERSON.x + PERSON.w / 2, y: PERSON.y + PERSON.h + 48 };

export const ADAPT = {
  ...groupOf("adapt"),
  frame: { key: "adapt.frame", at: FRAME, stills: [CATALOG_SLOTS] },
  slots: SLOTS,
  tool: { name: TOOL, icon: "pin" as const },
  /** The Azure original, in the catalog's first place from the start. */
  original: { key: "adapt.original", at: miniAt(0), badge: AZURE, badgeAt: badgeIn(miniAt(0), MINI.badge, { x: 12, y: 12 }) },
  card: { key: "adapt.card", at: CARD },
  /** The three lines your agents rework, each a name and a bar that fills green as the agents rewrite it. */
  rows: [STORAGE, SIGN_IN, DEPLOYMENT].map((text, n) => {
    const y = CARD.y + ROWS.first + n * ROWS.pitch;
    return { key: `adapt.row.${n}`, text, at: { x: CARD.x + BIG.pad, y }, bar: box(CARD.x + ROWS.barX, y - ROWS.barH / 2, ROWS.barW, ROWS.barH) };
  }),
  /** Each line's tick as its tests pass, at its bar's end (kit PassTick). */
  ticks: [0, 1, 2].map((n) => ({ key: `adapt.tick.${n}`, at: { x: CARD.x + ROWS.barX + ROWS.barW + TICK.gap + TICK.r, y: CARD.y + ROWS.first + n * ROWS.pitch }, r: TICK.r })),
  /** The badge: "Azure" flips over to "AWS" (`--k`). */
  badge: { key: "adapt.badge", at: badgeIn(CARD, BIG.badge, { x: 24, y: 20 }), from: AZURE, to: AWS },
  corner: { key: "adapt.corner" },
  adapted: { key: "adapt.adapted", text: ADAPTED, at: box(CARD.x + CARD.w + 16, CARD.y + 4, 160, LABEL_LINE) },
  agent: { key: "adapt.agent", at: AGENT, r: AGENT_R },
  /** A short green line from your agents to the card: they work on it. */
  reach: { key: "adapt.reach", from: { x: AGENT.x + AGENT_R + 10, y: AGENT.y }, to: { x: CARD.x - 10, y: AGENT.y } },
  agentLabel: { key: "adapt.agent.label", text: YOUR_AGENTS, at: box(AGENT.x - 120, AGENT.y + AGENT_R + 12, 240, LABEL_LINE) },
  person: { key: "adapt.person", at: PERSON },
  /** The orange mark (kit HumanMark, without its own label: only the mark is orange). */
  mark: { key: "adapt.mark", at: MARK },
  /** "A person on your team approves", in navy at the mark's right. */
  approves: { key: "adapt.approves", text: APPROVES, at: box(MARK.x + 44, MARK.y - LABEL_LINE / 2, 440, LABEL_LINE) },
  /**
   * The AWS version going into the catalog: a card drawn in the second
   * place, about that place's middle, that starts over the large card at its
   * width and shrinks up into the place.
   */
  copy: {
    key: "adapt.copy",
    at: miniAt(1),
    origin: centreOf(miniAt(1)),
    badge: AWS,
    badgeAt: badgeIn(miniAt(1), MINI.badge, { x: 12, y: 12 }),
    start: { "--x": centreOf(CARD).x - centreOf(miniAt(1)).x, "--y": centreOf(CARD).y - centreOf(miniAt(1)).y, "--s": Math.round((CARD.w / MINI.w) * 1000) / 1000 },
  },
};
