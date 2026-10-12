/**
 * A QR code as one SVG path: the join address, for a phone's camera. Drawn
 * here rather than fetched, so the address and the pairing code in it go to
 * no other service.
 */
import qrcode from "qrcode-generator";

/** The clear margin a reader needs around the code, in modules. */
const QUIET = 4;

/** The code's dark modules as a path in a square `size` units across, each module one unit. */
export function qrPath(text: string): { size: number; path: string } {
  const code = qrcode(0, "M");
  code.addData(text);
  code.make();
  const count = code.getModuleCount();
  let path = "";
  for (let row = 0; row < count; row++) {
    for (let col = 0; col < count; col++) {
      if (!code.isDark(row, col)) continue;
      // A run of dark modules along the row is one rectangle.
      let run = 1;
      while (col + run < count && code.isDark(row, col + run)) run++;
      path += `M${col + QUIET} ${row + QUIET}h${run}v1h-${run}z`;
      col += run - 1;
    }
  }
  return { size: count + QUIET * 2, path };
}
