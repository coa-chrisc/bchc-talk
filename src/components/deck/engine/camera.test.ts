import { describe, expect, it } from "vitest";
import { blend, frame, HOME, planeTransform, sameCamera, type Camera } from "./camera";

const STAGE = { w: 1920, h: 1080 };
const PLANE = { w: 3840, h: 2160 };

describe("framing a box", () => {
  it("centres it and fits it inside the stage with the padding clear", () => {
    const camera = frame(PLANE, STAGE, { x: 960, y: 540, w: 840, h: 420 }, 120);
    expect(camera.fx).toBeCloseTo(1380 / 3840);
    expect(camera.fy).toBeCloseTo(750 / 2160);
    expect(camera.scale).toBeCloseTo(2);
  });

  it("fits the tighter of the two sides, and never zooms past the cap", () => {
    expect(frame(PLANE, STAGE, { x: 0, y: 0, w: 3840, h: 400 }, 0).scale).toBeCloseTo(0.5);
    expect(frame(PLANE, STAGE, { x: 0, y: 0, w: 20, h: 20 }, 120, 3).scale).toBe(3);
  });
});

describe("the plane's transform", () => {
  it("puts the focus at the middle of the stage", () => {
    const camera: Camera = { fx: 0.25, fy: 0.75, scale: 2 };
    const t = planeTransform(camera, PLANE, STAGE);
    expect(t.x + camera.fx * PLANE.w * t.scale).toBeCloseTo(960);
    expect(t.y + camera.fy * PLANE.h * t.scale).toBeCloseTo(540);
  });

  it("leaves a stage-sized plane where it is at home", () => {
    expect(planeTransform(HOME, STAGE, STAGE)).toEqual({ x: 0, y: 0, scale: 1 });
  });
});

describe("a camera move", () => {
  const a: Camera = { fx: 0.2, fy: 0.3, scale: 3 };
  const b: Camera = { fx: 0.7, fy: 0.6, scale: 0.5 };

  it("starts and ends on its framings exactly", () => {
    expect(blend(a, b, 0)).toBe(a);
    expect(blend(a, b, 1)).toBe(b);
  });

  it("zooms by the same ratio in each equal part of the move", () => {
    const scales = [0, 0.25, 0.5, 0.75, 1].map((k) => blend(a, b, k).scale);
    const ratios = scales.slice(1).map((s, i) => s / scales[i]);
    for (const ratio of ratios) expect(ratio).toBeCloseTo(ratios[0]);
  });

  it("carries the focus with the window: most of a pull back's travel comes late, when the window is wide", () => {
    const half = blend(a, b, 0.5);
    expect((half.fx - a.fx) / (b.fx - a.fx)).toBeLessThan(0.5);
    expect(half.fx).toBeGreaterThan(a.fx);
    expect(half.fx).toBeLessThan(b.fx);
  });

  it("is a plain pan between framings at one scale", () => {
    const pan = blend({ fx: 0, fy: 0, scale: 2 }, { fx: 1, fy: 0.5, scale: 2 }, 0.4);
    expect(pan.fx).toBeCloseTo(0.4);
    expect(pan.fy).toBeCloseTo(0.2);
    expect(pan.scale).toBeCloseTo(2);
  });
});

describe("comparing cameras", () => {
  it("is by value", () => {
    expect(sameCamera({ fx: 0.5, fy: 0.5, scale: 1 }, HOME)).toBe(true);
    expect(sameCamera({ fx: 0.5, fy: 0.5, scale: 1.01 }, HOME)).toBe(false);
  });
});
