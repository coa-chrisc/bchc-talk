/**
 * A part whose picture is a pure function of one number. `driven` gives an
 * element a numeric property (a counter's `count`, a packet's `along`) that
 * repaints the element when it is written, so the engine can set it outright
 * or tween it like any other property, and the same number always paints the
 * same picture.
 */
export function driven<E extends Element>(prop: string, initial: number, paint: (element: E, value: number) => void) {
  return (element: E | null) => {
    if (!element || prop in element) return;
    let value = initial;
    Object.defineProperty(element, prop, {
      configurable: true,
      get: () => value,
      set(next: number) {
        value = Number(next);
        paint(element, value);
      },
    });
    paint(element, value);
  };
}

/** Reads a driven property back. */
export const read = (element: Element, prop: string) => (element as unknown as Record<string, number>)[prop] ?? 0;
