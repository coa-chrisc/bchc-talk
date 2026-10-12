import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

/**
 * The deck is projected from whatever laptop is in the room. A few CSS
 * features repaint whole layers every frame and are where a smooth build
 * turns into a slow one, so no file under the deck or the talks may use
 * them, in a stylesheet, an inline style or SVG markup.
 */
const ROOTS = ["src/components/deck", "src/talks"];
const BANNED: [string, RegExp][] = [
  ["a CSS blur, shadow or colour effect property", /(^|[\s;{("'`])(-webkit-)?(backdrop-)?filter\s*:/im],
  ["the same property set from script", /\b(backdropFilter|WebkitBackdropFilter|WebkitFilter|mixBlendMode)\b|style\.filter\b/],
  ["a blend mode", /mix-blend-mode/i],
  ["an SVG effect element", /<filter\b|<fe[A-Z]/],
];

function files(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) return files(path);
    return /\.(css|tsx?|mjs)$/.test(entry.name) && !entry.name.endsWith("forbidden.test.ts") ? [path] : [];
  });
}

describe("the deck's rendering rules", () => {
  const sources = ROOTS.flatMap(files);

  it("finds the deck's files", () => {
    expect(sources.length).toBeGreaterThan(20);
  });

  it.each(BANNED)("never uses %s", (_, pattern) => {
    expect(sources.filter((path) => pattern.test(readFileSync(path, "utf8")))).toEqual([]);
  });
});
