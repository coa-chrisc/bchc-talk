/**
 * Frame times, measured on GSAP's own ticker: the gap between one tick and
 * the next is what the audience sees as smoothness. The rehearsal readout
 * and the browser check both read from here.
 */
import { gsap } from "./gsap";

export type FrameStats = { frames: number; p95: number; worst: number };

/** The 95th percentile and the worst of a run of frame times, in milliseconds. */
export function frameStats(deltas: readonly number[]): FrameStats {
  if (deltas.length === 0) return { frames: 0, p95: 0, worst: 0 };
  const sorted = [...deltas].sort((a, b) => a - b);
  const round = (ms: number) => Math.round(ms * 10) / 10;
  return { frames: sorted.length, p95: round(sorted[Math.min(sorted.length - 1, Math.ceil(sorted.length * 0.95) - 1)]), worst: round(sorted[sorted.length - 1]) };
}

/** A build's verdict against the display: its p95 within 1.3 frames, and no frame over 50 ms. */
export const paces = (stats: FrameStats, interval: number) => stats.p95 <= interval * 1.3 && stats.worst <= 50;

const KEEP = 240;

export function createFrameMeter() {
  let recent: number[] = [];
  let run: number[] | null = null;
  let last = 0;
  const tick = () => {
    const now = performance.now();
    if (last) {
      const delta = now - last;
      recent.push(delta);
      if (recent.length > KEEP) recent = recent.slice(-KEEP);
      run?.push(delta);
    }
    last = now;
  };
  gsap.ticker.add(tick);
  return {
    /** The last few seconds. */
    recent: () => frameStats(recent),
    /** Starts recording a run. */
    start() {
      run = [];
    },
    /** Ends the run and reports it. */
    stop() {
      const stats = frameStats(run ?? []);
      run = null;
      return stats;
    },
    kill: () => gsap.ticker.remove(tick),
  };
}
