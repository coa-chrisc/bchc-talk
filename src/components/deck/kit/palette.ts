/**
 * The deck's colour roles (docs/bchc-colour-direction.md, with the hues of
 * docs/bchc-brand.md). The five accent hues are named only in kit.css, as
 * custom properties; everything else paints with a role: the catalog, the
 * process, an agent's role, a department, a thing that is shared. A part
 * takes a role as `data-hue` (an agent and a board cell as `data-role`), and
 * kit.css turns it into `--hue` for the part's own rules. Orange and the
 * deep pass green stay with their own selectors: a person approved, a check
 * passed.
 */
import type { AgentRole } from "./glyph-geometry";

/** Every role a part can be coloured by: each is a `--dk-<role>` alias in kit.css. */
export const HUES = ["catalog", "process", "lead", "review", "fix", "dept-a", "dept-b", "dept-c", "share-pack", "share-code", "share-design", "share-help", "share-sauce"] as const;
export type Hue = (typeof HUES)[number];

/** The roles an agent's ring, and a cell it holds, take: Part 3's lead (planner), process (builder), review and fix. */
export const AGENT_HUES = ["lead", "process", "review", "fix"] as const satisfies readonly Hue[];
export type AgentHue = (typeof AGENT_HUES)[number];

/** Part 3's colour for each agent role. The tester has none: it stays paper, and its work shows as pass-green ticks. */
export const ROLE_HUE: { readonly [R in AgentRole]?: AgentHue } = { planner: "lead", builder: "process", reviewer: "review", fixer: "fix" };

export const isHue = (tone: string): tone is Hue => (HUES as readonly string[]).includes(tone);

/** The accent hues by name. Only kit.css may say them; a world says the role. */
export const HUE_NAMES = ["green", "indigo", "gold", "pink", "sky"] as const;

/** The hue names a source refers to as deck tokens, in the order they appear. */
export const hueNamesIn = (source: string): string[] => [...source.matchAll(new RegExp(`--dk-(${HUE_NAMES.join("|")})\\b`, "g"))].map(([token]) => token);

/** The deck tokens a world may use: the ground and ink, orange and the pass green (each only through its own selectors), a mounted still's white and the ink drawn on it, the sizes, the face, the tint strengths, and the role aliases. */
export const WORLD_TOKENS: readonly string[] = ["night", "raised", "paper", "soft", "rule", "human", "pass", "mount", "ink", "text", "label", "face", "tint-idle", "tint-active", "wash", ...HUES].map((name) => `--dk-${name}`);

/** The deck tokens in a source that a world may not use: a hue by name, or a token the kit does not define. */
export const strayTokens = (source: string): string[] => [...source.matchAll(/--dk-[a-z0-9-]*[a-z0-9]/g)].map(([token]) => token).filter((token) => !WORLD_TOKENS.includes(token));

/** The fleet film's vendor colours: the deck never borrows them. */
export const VENDOR_COLOURS = /fr-claude|fr-cursor|fr-gemini/i;
