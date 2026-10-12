import { afterEach, describe, expect, it, vi } from "vitest";

/** The helper as a build with this base path would inline it. */
async function load(base: string | undefined) {
  vi.resetModules();
  vi.stubEnv("NEXT_PUBLIC_BASE_PATH", base);
  return import("./base-path");
}

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("withBase", () => {
  it("leaves a path as it is when the deck is served from the root", async () => {
    const { BASE_PATH, withBase } = await load(undefined);
    expect(BASE_PATH).toBe("");
    expect(withBase("/finale/01.v9.webp")).toBe("/finale/01.v9.webp");
  });

  it("puts the GitHub Pages project path in front of a public file and a page", async () => {
    const { withBase } = await load("/bchc-talk");
    expect(withBase("/brand/aph-logo.v1.png")).toBe("/bchc-talk/brand/aph-logo.v1.png");
    expect(withBase("/notes/")).toBe("/bchc-talk/notes/");
  });
});
