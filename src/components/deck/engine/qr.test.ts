import { describe, expect, it } from "vitest";
import { qrPath } from "./qr";

const URL = "https://aboveearth.example/talks/bchc/notes#k=AAAAAAAAAAAAAAAA.BBBBBBBBBBBBBBBB";

describe("the join address as a QR code", () => {
  it("is a square with a four-module clear margin all round", () => {
    const { size, path } = qrPath(URL);
    // A QR code is 21 modules a side at its smallest and grows by four a version.
    expect((size - 8 - 21) % 4).toBe(0);
    const cells = Array.from(path.matchAll(/M(\d+) (\d+)h(\d+)v1h-\d+z/g), ([, x, y, run]) => ({ x: Number(x), y: Number(y), run: Number(run) }));
    expect(cells.length).toBeGreaterThan(50);
    for (const { x, y, run } of cells) {
      expect(x).toBeGreaterThanOrEqual(4);
      expect(y).toBeGreaterThanOrEqual(4);
      expect(x + run).toBeLessThanOrEqual(size - 4);
      expect(y).toBeLessThan(size - 4);
    }
    // The top edge of the top-left finder: seven dark modules in a row, at the margin.
    expect(path.startsWith("M4 4h7v1h-7z")).toBe(true);
  });

  it("draws the same address the same way, and another address another way", () => {
    expect(qrPath(URL)).toEqual(qrPath(URL));
    expect(qrPath(URL).path).not.toBe(qrPath(URL.replace("AAAA", "AAAB")).path);
  });
});
