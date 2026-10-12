/**
 * Slide 24's click: the view starts close on your department's outline and
 * the one use case you shared, with its word over it; then the other members' tiles land in it in
 * waves that come faster and grow, one, two at once, four, then more and
 * more. With each wave the outline widens to make room and the view pulls
 * back, until the outline is full width and its last tiles land at its
 * edges. Each tile's dashed corner shows as it lands: your agents adapting it.
 */
import { EASE, RISE, fill, show, to } from "@/components/deck/kit";
import { picture, story } from "../steps";
import { into, play } from "./beats";
import { EVERYONE, STAGES } from "./layout-everyone";

const E = EVERYONE;
const [CLOSE] = STAGES;

/** When each wave sets off, from the waves' beat's start: each sooner after the one before than the last. */
const WAVE_AT = [0, 1.0, 1.9, 2.7, 3.4, 4.0, 4.6] as const;
/** How far apart the tiles of each wave set off: the first three waves all at once. */
const WAVE_STAGGER = [0, 0, 0, 0.04, 0.025, 0.015, 0.012] as const;
/** A tile's flight, and the view's and outline's move for each wave: the last one slower, as its tiles keep landing. */
const FLY = 0.9;
const VIEW = { duration: 0.9, last: 1.6 } as const;
/** A tile's dashed corner shows as it lands. */
const CORNER = 0.3;

const waveMoves = E.waves.flatMap((_, w) => {
  const stage = STAGES[w + 1];
  const at = WAVE_AT[w];
  const view = { at, duration: w === E.waves.length - 1 ? VIEW.last : VIEW.duration, ease: EASE.page };
  return [
    ...to(E.pool.key, { "--s": stage.s }, { "--s": CLOSE.s }, view),
    ...to(E.outline.key, { "--ox": stage.ox, "--oy": stage.oy }, { "--ox": CLOSE.ox, "--oy": CLOSE.oy }, view),
    ...to(E.label.key, { y: stage.labelY }, undefined, view),
    ...E.tiles
      .filter((tile) => tile.wave === w)
      .flatMap((tile, j) => {
        const sets = at + j * WAVE_STAGGER[w];
        return [
          ...show(tile.key, { at: sets, duration: 0.25 }),
          ...to(tile.key, { x: 0, y: 0 }, { ...tile.from }, { at: sets, duration: FLY, ease: EASE.page }),
          ...fill(tile.key, { at: sets + FLY - 0.1, duration: CORNER }),
        ];
      }),
  ];
});

export const everyone = picture("everyone", {
  play: play(
    into("everyone"),
    // Close on your department: its outline, the use case you shared, and its name.
    {
      with: true,
      hold: 0.3,
      moves: [
        show(E.outline.key, { at: 0, duration: 0.5 }),
        show(E.own.key, { at: 0.15 }),
        show(E.yours.key, { at: 0.3 }),
        to(E.label.key, { autoAlpha: 1, y: CLOSE.labelY }, { autoAlpha: 0, y: CLOSE.labelY + RISE }, { at: 0.3, duration: 0.75, ease: EASE.out }),
      ],
    },
    { with: true, hold: 0.6, moves: [story("everyone", 0)] },
    // The other members' tiles pour in, faster and faster, and the view pulls back as the outline widens.
    { hold: 0.3, moves: waveMoves },
    { with: true, hold: 4.0, moves: [story("everyone", 1)] },
  ),
});
