/**
 * Where the deck is, and every way to move: pure functions of a position and
 * the deck's shape (how many steps each world has). A position is a world
 * and the step showing in it.
 */

export type Position = { world: number; step: number };

/** The number of steps in each world, in order. Every world has at least one. */
export type Shape = readonly number[];

/**
 * How a move was asked for. Only an `advance` plays; a `retreat` and a
 * `jump` cut to the step's finished picture. The reducer never decides this
 * from the positions alone, because a jump to the next step is still a cut.
 */
export type Via = "advance" | "retreat" | "jump";

export type Action =
  | { type: "next" }
  | { type: "prev" }
  | { type: "first" }
  | { type: "last" }
  | { type: "goTo"; world: number; step?: number };

export type Move = { position: Position; via: Via };

const within = (value: number, max: number) => Math.min(max, Math.max(0, Math.trunc(value) || 0));

/** The nearest real position. */
export function clampPosition(shape: Shape, { world, step }: Position): Position {
  const s = within(world, shape.length - 1);
  return { world: s, step: within(step, shape[s] - 1) };
}

export const samePosition = (a: Position, b: Position) => a.world === b.world && a.step === b.step;

/**
 * The position an action leads to. Past a world's last step is the next
 * world's first; back from a world's first step is the previous world's
 * last. At either end of the deck the position stays put.
 */
export function move(shape: Shape, from: Position, action: Action): Move {
  const at = clampPosition(shape, from);
  switch (action.type) {
    case "next":
      if (at.step < shape[at.world] - 1) return { position: { world: at.world, step: at.step + 1 }, via: "advance" };
      if (at.world < shape.length - 1) return { position: { world: at.world + 1, step: 0 }, via: "advance" };
      return { position: at, via: "advance" };
    case "prev":
      if (at.step > 0) return { position: { world: at.world, step: at.step - 1 }, via: "retreat" };
      if (at.world > 0) return { position: { world: at.world - 1, step: shape[at.world - 1] - 1 }, via: "retreat" };
      return { position: at, via: "retreat" };
    case "first":
      return { position: { world: 0, step: 0 }, via: "jump" };
    case "last":
      return { position: clampPosition(shape, { world: shape.length - 1, step: Infinity }), via: "jump" };
    case "goTo":
      return { position: clampPosition(shape, { world: action.world, step: action.step ?? 0 }), via: "jump" };
  }
}

/** How many steps the deck has. */
export const totalSteps = (shape: Shape) => shape.reduce((sum, steps) => sum + steps, 0);

/** How far through the deck a position is, from 0 at the first step to 1 at the last. */
export function progressOf(shape: Shape, position: Position): number {
  const at = clampPosition(shape, position);
  const before = shape.slice(0, at.world).reduce((sum, steps) => sum + steps, 0);
  return (before + at.step) / Math.max(1, totalSteps(shape) - 1);
}

/** A position's place in the whole deck, counting from 1: the number the overview shows and a typed jump takes. */
export function numberOf(shape: Shape, position: Position): number {
  const at = clampPosition(shape, position);
  return shape.slice(0, at.world).reduce((sum, steps) => sum + steps, 0) + at.step + 1;
}

/** The position with that number; a number outside the deck lands on its nearest end. */
export function locate(shape: Shape, number: number): Position {
  let left = Math.min(totalSteps(shape), Math.max(1, Math.trunc(number) || 1)) - 1;
  let world = 0;
  while (left >= shape[world]) left -= shape[world++];
  return { world, step: left };
}
