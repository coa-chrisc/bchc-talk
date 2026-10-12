/** The kinds of agent Part 3 draws, each with its own shape (parts.tsx), all navy but the gold lead agents (build.css). */
export const KINDS = ["lead", "builder", "tester", "reviewer", "fixer"] as const;
export type Kind = (typeof KINDS)[number];
