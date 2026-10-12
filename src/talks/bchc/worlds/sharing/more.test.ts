/** Slide 26, share more than code: the real form at its question, four of its choices circled; a project card with its contact line lit; two messages. */
import { describe, expect, it } from "vitest";
import { withBase } from "@/lib/base-path";
import { shown } from "../../script/find";
import { SAFE, SAFE_BOTTOM, SUBMIT_FORM, contentTop } from "./layout";
import { MORE } from "./layout-more";
import { after, at, inside, overlaps, startOf, tagOf, texts } from "./harness";

const id = "more.play";
const M = MORE;
const SHOWN = shown("more", "play");

describe("26. share more than code", () => {
  it("shows the real form at its question, from the still captured for this round", () => {
    expect(M.question).toBe(SHOWN[0]);
    expect(M.question).toBe("What kind of solution is it?");
    expect(M.frame.stills).toHaveLength(1);
    expect(M.frame.stills[0].src).toBe(withBase("/submit-form-type.v2.webp"));
    expect(M.frame.stills[0].alt).toContain(M.question);
    expect(M.frame.at).toMatchObject({ w: SUBMIT_FORM.w, h: SUBMIT_FORM.h });
    expect(M.frame.at.y).toBeGreaterThanOrEqual(contentTop("more"));
    expect(M.frame.at.y + M.frame.at.h).toBeLessThanOrEqual(SAFE_BOTTOM);
  });

  it("circles exactly the four choices the script names, where the form shows them, one at a time", () => {
    const circled = SHOWN.slice(1, 5);
    expect(circled).toEqual(["Data pipeline or integration", "Dashboard or visualization", "Workflow automation", "Standards, governance or playbook"]);
    expect(Object.keys(SUBMIT_FORM.choices).sort()).toEqual([...circled].sort());
    expect(M.rings.map((ring) => ring.name)).toEqual(circled);
    for (const ring of M.rings) expect(inside(ring.at, { ...M.frame.at, x: M.frame.at.x - 2, y: M.frame.at.y - 2, w: M.frame.at.w + 4, h: M.frame.at.h + 4 }), ring.name).toBe(true);
    M.rings.forEach((ring, k) => M.rings.slice(k + 1).forEach((other) => expect(overlaps(ring.at, other.at), `${ring.name} / ${other.name}`).toBe(false)));
    const starts = M.rings.map((ring) => startOf(id, ring.key));
    starts.slice(1).forEach((start, k) => expect(start).toBeGreaterThan(starts[k]));
    for (const ring of M.rings) expect(at(id)[ring.key]["--d"]).toBe(1);
  });

  it("brings a finished project card beside the form, its contact line lit", () => {
    const { card } = M;
    expect(card.at.x).toBeGreaterThan(M.frame.at.x + M.frame.at.w);
    expect(card.at.x + card.at.w).toBeLessThanOrEqual(SAFE.right);
    for (const bar of card.bars) expect(inside(bar.at, card.at)).toBe(true);
    expect(inside({ ...card.contact.bar }, card.at)).toBe(true);
    const end = at(id);
    expect(end[card.key].autoAlpha).toBe(1);
    expect(end[card.contact.key]["--k"]).toBe(1);
    expect(startOf(id, card.key)).toBeGreaterThan(startOf(id, M.rings.at(-1)!.key));
  });

  it("names the card as the posted project, in the script's words, over it, coming in with it", () => {
    const { card } = M;
    expect(card.name.text).toBe(SHOWN[5]);
    expect(texts).toContain(card.name.text);
    expect(card.name.at.y + card.name.at.h).toBeLessThanOrEqual(card.at.y);
    expect(card.name.at.y).toBeGreaterThan(M.frame.at.y);
    expect(card.name.at.x).toBe(card.at.x);
    // It fits the card's width: 26 px type is under 0.55 em a letter.
    expect(card.name.text.length * 26 * 0.55).toBeLessThanOrEqual(card.name.at.w);
    // It is drawn in the card's own part, so it comes and goes with the card.
    expect(after(card.key).split("</g>")[0]).toContain(`>${card.name.text}<`);
  });

  it("then two messages, in the script's words, one after the other, under the card, each from a person", () => {
    expect(M.messages.map((message) => message.text)).toEqual(SHOWN.slice(6));
    expect(SHOWN.slice(6)).toEqual(["Can we reuse this?", "We can help with that."]);
    for (const message of M.messages) {
      expect(texts).toContain(message.text);
      expect(message.person.at.y).toBeGreaterThan(M.card.at.y + M.card.at.h);
      // Each message comes from a person: the deck's person glyph, drawn on as its message comes in, beside its bubble.
      expect(tagOf(message.person.key)).toContain("dk-person");
      expect(message.person.at.x + message.person.at.w).toBeLessThan(message.bubble.x);
      expect(Math.abs(message.person.at.y + message.person.at.h / 2 - (message.bubble.y + message.bubble.h / 2))).toBeLessThan(1);
      expect(at(id)[message.person.key]["--d"]).toBe(1);
      expect(startOf(id, message.person.key)).toBeGreaterThanOrEqual(startOf(id, message.key));
      expect(message.bubble.x + message.bubble.w).toBeLessThanOrEqual(SAFE.right);
      expect(message.bubble.y + message.bubble.h).toBeLessThanOrEqual(SAFE_BOTTOM);
      // The words fit their bubble: 32 px type is under 0.6 em a letter.
      expect(message.textAt.x + message.text.length * 32 * 0.6).toBeLessThanOrEqual(message.bubble.x + message.bubble.w - 16);
      expect(at(id)[message.key].autoAlpha).toBe(1);
    }
    expect(startOf(id, M.messages[1].key)).toBeGreaterThan(startOf(id, M.messages[0].key));
    expect(overlaps(M.messages[0].bubble, M.messages[1].bubble)).toBe(false);
  });
});
