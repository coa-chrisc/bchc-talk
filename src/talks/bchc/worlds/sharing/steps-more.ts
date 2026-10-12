/**
 * Slide 26's click: the real form at its question of what kind of solution
 * it is, four of its choices circled one at a time; then a finished
 * project card beside it, its contact line lit; and two messages from people
 * in other departments, one after the other, each person drawn on as their
 * message comes in.
 */
import { draw, fill, rise, wipe } from "@/components/deck/kit";
import { picture, story } from "../steps";
import { into, keys, play } from "./beats";
import { MORE } from "./layout-more";

const M = MORE;

export const more = picture("more", {
  play: play(
    // The form, at its question.
    { moves: [...into("more").moves, wipe(M.frame.key, { from: "top", at: 0.2 })] },
    { with: true, hold: 0.6, moves: [story("more", 0)] },
    // Four of its choices, circled one at a time.
    { with: true, hold: 0.5, moves: [draw(keys(M.rings), { at: 0, duration: 0.6, stagger: 0.45 })] },
    // A finished project, its contact line lit.
    { hold: 0.3, moves: [rise(M.card.key, { at: 0 }), fill(M.card.contact.key, { at: 0.8, duration: 0.6 })] },
    // Two messages come in from people in other departments.
    {
      hold: 0.2,
      moves: [
        rise(keys(M.messages), { at: 0, stagger: 0.6 }),
        draw(
          M.messages.map((message) => message.person.key),
          { at: 0.1, duration: 0.6, stagger: 0.6 },
        ),
      ],
    },
    { with: true, hold: 0.3, moves: [story("more", 1)] },
  ),
});
