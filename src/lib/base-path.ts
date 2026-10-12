/**
 * The path the deck is served under: empty locally, "/bchc-talk" on GitHub
 * Pages. next.config.ts sets Next's `basePath` from the same variable and
 * inlines it into the client bundle at build time.
 */
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/**
 * A public file's or page's address under the base path. Next adds the base
 * path to next/link and the router only: an image's `src` (next/image
 * included), `window.open` and a URL put together by hand need it added here.
 */
export const withBase = (path: string) => `${BASE_PATH}${path}`;
