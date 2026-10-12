/**
 * The talk's clock. Its start is kept in the browser's storage under the
 * deck's id, so a reload in the middle of a talk does not lose the time, and
 * every screen of the deck reads the same start.
 */

const key = (deckId: string) => `deck:${deckId}:started`;

export function readStart(deckId: string): number | null {
  try {
    const value = Number(window.localStorage.getItem(key(deckId)));
    return Number.isFinite(value) && value > 0 ? value : null;
  } catch {
    return null;
  }
}

/** Starts the clock if it is not running, and says when it started. */
export function ensureStart(deckId: string): number | null {
  const running = readStart(deckId);
  if (running) return running;
  try {
    const now = Date.now();
    window.localStorage.setItem(key(deckId), String(now));
    return now;
  } catch {
    return null;
  }
}

export function resetStart(deckId: string) {
  try {
    window.localStorage.removeItem(key(deckId));
  } catch {
    // Storage is off: there is no clock to reset.
  }
}

/** Elapsed time as m:ss, or h:mm:ss past the hour. */
export function formatElapsed(ms: number): string {
  const total = Math.max(0, Math.floor(ms / 1000));
  const pad = (n: number) => String(n).padStart(2, "0");
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  return h ? `${h}:${pad(m)}:${pad(total % 60)}` : `${m}:${pad(total % 60)}`;
}
