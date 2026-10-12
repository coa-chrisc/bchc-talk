/**
 * What a talk deck is made of. A deck is a short list of worlds. A world is
 * one long-lived scene, with a camera over a plane that may be larger than
 * the stage, and many steps: each click moves the same picture to its next
 * state. A step is a list of moves, and the picture at any step is the
 * world's baseline with every move up to that step applied (compile.ts), so
 * a step looks the same whether the deck tweened to it or cut to it.
 */
import type { ComponentType } from "react";
import type { Camera, Size } from "./camera";
import type { Position } from "./deck-state";

/** Property values a part can be set to and tweened between: `autoAlpha`, `x`, `--k` and so on. Numbers and strings only. */
export type Vars = Record<string, number | string>;

/** How a move plays when the deck steps forward. A cut ignores all of it. */
export type MoveOpts = {
  duration?: number;
  ease?: string;
  /** Seconds between one element and the next when several share the part's id. */
  stagger?: number;
  /** Seconds after the click. Left out, a move starts a beat after the one before it. */
  at?: number;
  /** Start with the move before it. */
  with?: boolean;
  /** Seconds added to when it would start, without holding back the moves after it. */
  lag?: number;
};

/** One part going from where it was to `on`. `off` is what it is before any step touches it. */
export type PartMove = MoveOpts & {
  /** The part's `data-build` id. */
  key: string;
  on: Vars;
  off?: Vars;
};

/** The world's camera going to a new framing. */
export type CameraMove = MoveOpts & { camera: Camera };

export type Move = PartMove | CameraMove;

export const isCameraMove = (move: Move): move is CameraMove => "camera" in move;

/** A ground a step asks for instead of the deck's own, set on the deck as `data-ground` while the step shows: the title and close slides' navy. */
export type Ground = "navy";

/** One click's worth of a world. */
export type StepDef = {
  /** Kebab case, stable and unique within its world: with the world's id it is the step's address. */
  id: string;
  moves: Move[];
  /**
   * What this click does to the deck's persistent layer (`DeckDef.chrome`):
   * moves that name its parts, timed from the same click. Left out, the
   * layer holds the picture it had.
   */
  chrome?: Move[];
  /** The ground behind this step; the deck's own when left out. */
  ground?: Ground;
};

export type Rect = { x: number; y: number; w: number; h: number };

export type WorldDef = {
  /** Kebab case and stable: it is the world's address. */
  id: string;
  /**
   * What is on the stage: static markup with no state of its own, mounted
   * once and never remounted, with a `data-build` id on every part a move
   * names. The engine does all the moving.
   */
  Scene: ComponentType;
  /** The plane's size in stage pixels; the stage's own size when left out. */
  plane?: Size;
  /** Where the camera is before the first step; the whole plane, centred, when left out. */
  camera?: Camera;
  /** The first step is how the world arrives. */
  steps: StepDef[];
  /** Places on the stage another world can pick a picture up from, by name. */
  anchors?: Record<string, Rect>;
};

/** What the audience never sees about a step: its name in the overview and the speaker's note. Plain data. */
export type StepCopy = { title: string; note?: string };

export type WorldEntry = {
  title: string;
  world: WorldDef;
  /** Copy by step id. A step without any is listed by its id. */
  copy?: Record<string, StepCopy>;
};

/**
 * The persistent layer: what sits on the stage over every world and
 * survives each world change (a time rule, a running ledger, a docked row).
 * It is a scene like a world's, with no camera, and it is moved the same
 * way: each step's `chrome` moves are compiled across the whole deck into
 * one complete picture per step (chrome.ts), so the layer at any step is the
 * same however that step was reached.
 */
export type ChromeDef = {
  /** Static markup, mounted once, with a `data-build` id on every part a step's `chrome` names. */
  Scene: ComponentType;
  /** Places on the stage a world can line its own picture up with, by name. */
  anchors?: Record<string, Rect>;
};

export type DeckDef = {
  /** Names the channel and the timer the deck and its notes window share. */
  id: string;
  title: string;
  /** Where the speaker notes page lives. */
  notesPath: string;
  worlds: WorldEntry[];
  /** Fills the window behind the stage, and survives every world change. */
  Backdrop?: ComponentType;
  /** Sits on the stage over the worlds, and survives every world change. */
  chrome?: ChromeDef;
  /**
   * The slide's frame: a logo, a footer, the slide's number. It sits on the
   * stage over the worlds and the persistent layer, is never moved, and is
   * drawn again with each step it is told about.
   */
  Frame?: ComponentType<FrameProps>;
};

/** What a deck's frame is told about the step on the stage: its number as a typed jump numbers it, and its ground. */
export type FrameProps = { number: number; total: number; ground?: Ground };

/** How many steps each world has, in order. */
export const shapeOf = (deck: DeckDef) => deck.worlds.map((entry) => entry.world.steps.length);

/** The deck's addresses: each world's id and its steps' ids. */
export const outlineOf = (deck: DeckDef) =>
  deck.worlds.map((entry) => ({ id: entry.world.id, steps: entry.world.steps.map((step) => step.id) }));

/** A step's copy, falling back to its id for a title. */
export function copyOf(deck: DeckDef, position: Position): StepCopy {
  const entry = deck.worlds[position.world];
  const id = entry.world.steps[position.step].id;
  return entry.copy?.[id] ?? { title: id };
}
