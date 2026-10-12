import { describe, expect, it } from "vitest";
import { compile } from "@/components/deck/engine/compile";
import { deck } from "./deck";
import { Frame } from "./frame";
import { SCRIPT, WORLDS } from "./script";

const addresses = deck.worlds.flatMap(({ world }) => world.steps.map((step) => `${world.id}/${step.id}`));

describe("the talk's deck", () => {
  it("gives its worlds in the plan's order", () => {
    expect(deck.worlds.map(({ world }) => world.id)).toEqual([...WORLDS]);
  });

  it("has every step of the script once, in the script's order, in the picture's world", () => {
    expect(addresses).toEqual(SCRIPT.flatMap((picture) => picture.steps.map((step) => `${picture.world}/${picture.id}.${step.id}`)));
    expect(new Set(addresses).size).toBe(addresses.length);
  });

  it("gives every step its slide's name and the script's You say as the speaker's note", () => {
    for (const picture of SCRIPT) {
      const { copy } = deck.worlds.find(({ world }) => world.id === picture.world)!;
      for (const step of picture.steps) expect(copy?.[`${picture.id}.${step.id}`]).toEqual({ title: `${picture.number}. ${picture.name}`, note: picture.say });
    }
  });

  it("compiles every world, with a starting value for everything a step moves", () => {
    for (const { world } of deck.worlds) expect(() => compile(world), world.id).not.toThrow();
  });

  it("keeps nothing on the stage across worlds but the Austin Public Health frame: no persistent layer and no backdrop", () => {
    expect(deck.chrome).toBeUndefined();
    expect(deck.Backdrop).toBeUndefined();
    expect(deck.Frame).toBe(Frame);
  });

  it("sets slide 1 and the close (slide 44) on navy, and every other step on the deck's white", () => {
    const navy = deck.worlds.flatMap(({ world }) => world.steps.filter((step) => step.ground === "navy").map((step) => `${world.id}/${step.id}`));
    expect(navy).toEqual(SCRIPT.filter((picture) => ["1", "44"].includes(picture.number)).flatMap((picture) => picture.steps.map((step) => `${picture.world}/${picture.id}.${step.id}`)));
    expect(navy).toHaveLength(2);
    expect(deck.worlds.flatMap(({ world }) => world.steps).every((step) => step.ground === undefined || step.ground === "navy")).toBe(true);
  });
});
