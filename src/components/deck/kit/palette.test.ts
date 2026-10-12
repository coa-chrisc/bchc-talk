import { readdirSync, readFileSync } from "node:fs";
import { join, relative } from "node:path";
import { describe, expect, it } from "vitest";
import { HUE_NAMES, HUES, WORLD_TOKENS, hueNamesIn, isHue, strayTokens } from "./palette";

const SRC = join(import.meta.dirname, "../../..");
/** A deck token by name. The hue names are put together here, so this file never says one. */
const dk = (name: string) => `--dk-${name}`;
const KIT_CSS = join(import.meta.dirname, "kit.css");

function files(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) return files(path);
    return /\.(css|tsx?|mjs)$/.test(entry.name) ? [path] : [];
  });
}

/** The custom properties `.deck` declares in kit.css, by name. */
const declared = () => {
  const block = readFileSync(KIT_CSS, "utf8").match(/^\.deck\s*\{([^}]*)\}/m)![1];
  return [...block.matchAll(/^\s*(--dk-[a-z0-9-]+)\s*:/gm)].map(([, token]) => token);
};

describe("the hue names", () => {
  const planted = (name: string) => `stroke: var(${dk(name)});`;

  it("are caught wherever a source says one", () => {
    for (const name of HUE_NAMES) expect(hueNamesIn(planted(name))).toEqual([dk(name)]);
    expect(hueNamesIn(`${planted("sky")} fill: var(${dk("pink")})`)).toEqual([dk("sky"), dk("pink")]);
  });

  it("are not confused with a role or a longer name", () => {
    expect(hueNamesIn("var(--dk-catalog) var(--dk-process) var(--dk-share-code) var(--dk-dept-a)")).toEqual([]);
    expect(hueNamesIn(`var(${dk("sky")}line) var(${dk("green")}house)`)).toEqual([]);
  });

  it("appear in no file under src but kit.css", () => {
    const sources = files(SRC);
    expect(sources.length).toBeGreaterThan(100);
    expect(sources.includes(KIT_CSS)).toBe(true);
    const strays = sources.filter((path) => path !== KIT_CSS && hueNamesIn(readFileSync(path, "utf8")).length > 0).map((path) => relative(SRC, path));
    expect(strays).toEqual([]);
  });
});

describe("the deck's colour tokens", () => {
  it("declares each hue, each role as an alias of one, and the tint strengths, as the brand lists them", () => {
    const css = readFileSync(KIT_CSS, "utf8");
    const hexes = { green: "#009f4d", indigo: "#44499c", gold: "#e0a100", pink: "#e8559a", sky: "#2f9be3" };
    expect(Object.keys(hexes)).toEqual([...HUE_NAMES]);
    expect(css).toMatch(new RegExp(Object.entries(hexes).map(([name, hex]) => `${dk(name)}: ${hex};`).join("\\s*")));
    const alias = { catalog: "indigo", process: "green", lead: "gold", review: "sky", fix: "pink", "dept-a": "sky", "dept-b": "pink", "dept-c": "gold", "share-pack": "green", "share-code": "indigo", "share-design": "pink", "share-help": "sky", "share-sauce": "gold" };
    expect(Object.keys(alias)).toEqual([...HUES]);
    for (const [role, hue] of Object.entries(alias)) expect(css).toContain(`${dk(role)}: var(${dk(hue)});`);
    expect(css).toMatch(/--dk-tint-idle: 0\.12;\s*--dk-tint-active: 0\.55;\s*--dk-wash: 0\.08;/);
  });

  it("sets the brand's ground, words and reserved colours: white, navy words, a deep-green pass and an orange person", () => {
    const css = readFileSync(KIT_CSS, "utf8");
    const tones = { night: "#ffffff", raised: "#ececf2", paper: "#22254e", soft: "#6b7086", rule: "#dde0ea", pass: "#1f573b", human: "#f4642c", mount: "#ffffff", ink: "#22254e" };
    for (const [name, hex] of Object.entries(tones)) expect(css).toContain(`--dk-${name}: ${hex};`);
  });

  it("turns the title and close slides navy by changing only tokens the deck declares: white words, a lighter catalog, the rule at white 0.3", () => {
    const css = readFileSync(KIT_CSS, "utf8");
    const block = css.match(/^\.deck\[data-ground="navy"\]\s*\{([^}]*)\}/m)![1];
    const tokens = Object.fromEntries([...block.matchAll(/^\s*(--dk-[a-z0-9-]+)\s*:\s*([^;]+);/gm)].map(([, token, value]) => [token, value]));
    expect(Object.keys(tokens).every((token) => declared().includes(token))).toBe(true);
    expect(tokens).toMatchObject({ "--dk-night": "#22254e", "--dk-paper": "#ffffff", "--dk-catalog": "#8a8fd0", "--dk-rule": "rgb(255 255 255 / 0.3)" });
    expect(tokens).not.toHaveProperty("--dk-process");
  });

  it("lets a world use every token kit.css declares but the hue names, and no other", () => {
    expect([...declared()].sort()).toEqual([...WORLD_TOKENS, ...HUE_NAMES.map(dk)].sort());
    expect(strayTokens("var(--dk-paper) var(--dk-catalog) var(--dk-tint-idle) var(--dk-human)")).toEqual([]);
    expect(strayTokens(`var(${dk("green")}) var(--dk-teal)`)).toEqual([dk("green"), "--dk-teal"]);
  });

  it("maps each role to its alias, and only to one, as the --hue a part paints with", () => {
    const css = readFileSync(KIT_CSS, "utf8");
    const maps = [...css.matchAll(/([^{}]*)\{\s*--hue:\s*([^;]+);\s*\}/g)].map(([, selector, value]) => [selector.replace(/\/\*[\s\S]*?\*\//g, "").trim(), value] as const);
    expect(maps.map(([, value]) => value)).toEqual(HUES.map((hue) => `var(--dk-${hue})`));
    maps.forEach(([selector], i) => expect(selector).toContain(`[data-hue="${HUES[i]}"]`));
    expect(maps.filter(([selector]) => selector.includes("data-role")).map(([, value]) => value)).toEqual(["var(--dk-process)", "var(--dk-lead)", "var(--dk-review)", "var(--dk-fix)"]);
    expect(css.match(/--hue:/g)).toHaveLength(HUES.length);
  });

  it("tells a role from any other tone", () => {
    expect(HUES.every(isHue)).toBe(true);
    expect(["rule", "paper", "soft", "ink", "sky"].some(isHue)).toBe(false);
  });
});
