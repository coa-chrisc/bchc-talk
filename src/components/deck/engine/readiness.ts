/**
 * What must be true before the first step: the faces are loaded (nothing is
 * set in a fallback face), every picture is decoded, and the display's pace
 * is known. The gate shows the presenter each of these.
 */

export type Readiness = {
  fonts: boolean;
  images: { done: number; total: number };
  /** Canvases holding memory now: the backdrop and the near worlds'. */
  canvases: number;
  /** The display's refresh rate, or null while it is being measured. */
  hz: number | null;
  /** Whether the system asks for reduced motion. */
  prefersReduced: boolean;
  wakeLock: boolean;
};

/**
 * Loads the faces the stage sets in, by the names next/font gave them, in
 * every weight and style it uses: the kit's face (`--dk-face`, the deck's own)
 * and the site's two, which the panels use.
 */
export async function loadFonts(root: HTMLElement): Promise<void> {
  const style = getComputedStyle(root);
  const families = ["--dk-face", "--font-newsreader", "--font-public-sans"].map((name) => style.getPropertyValue(name).split(",")[0].trim()).filter(Boolean);
  const specs = [...new Set(families)].flatMap((family) => [`400 32px ${family}`, `italic 400 32px ${family}`, `500 32px ${family}`, `600 32px ${family}`, `700 32px ${family}`]);
  await Promise.allSettled(specs.map((spec) => document.fonts.load(spec)));
  await document.fonts.ready;
}

/** Decodes every picture under the root, reporting as each lands. A picture that fails still counts, so the gate cannot hang. */
export async function decodeImages(root: HTMLElement, onProgress: (done: number, total: number) => void): Promise<void> {
  const images = Array.from(root.querySelectorAll("img"));
  let done = 0;
  onProgress(0, images.length);
  await Promise.all(
    images.map((image) =>
      image
        .decode()
        .catch(() => undefined)
        .then(() => onProgress(++done, images.length)),
    ),
  );
}

/** The display's refresh rate, from the middle gap of a run of frames. */
export function measureHz(frames = 40): Promise<number> {
  return new Promise((resolve) => {
    const gaps: number[] = [];
    let last = 0;
    const tick = (now: number) => {
      if (last) gaps.push(now - last);
      last = now;
      if (gaps.length < frames) return void requestAnimationFrame(tick);
      gaps.sort((a, b) => a - b);
      resolve(Math.round(1000 / gaps[Math.floor(gaps.length / 2)]));
    };
    requestAnimationFrame(tick);
  });
}

/**
 * Keeps the screen awake for the talk, where the browser can. Asked again
 * whenever the page comes back into view, because the lock is dropped when
 * it is hidden. Returns the way to let go.
 */
export function keepAwake(): () => void {
  if (!("wakeLock" in navigator)) return () => {};
  let lock: WakeLockSentinel | null = null;
  let released = false;
  const request = () => {
    if (released || document.visibilityState !== "visible") return;
    navigator.wakeLock
      .request("screen")
      .then((sentinel) => {
        lock = sentinel;
        if (released) void sentinel.release();
      })
      .catch(() => undefined);
  };
  request();
  document.addEventListener("visibilitychange", request);
  return () => {
    released = true;
    document.removeEventListener("visibilitychange", request);
    void lock?.release().catch(() => undefined);
  };
}
