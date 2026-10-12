/**
 * Part 5's stage: what we're sharing (slides 29 to 33a). Marks are SVG on the
 * plane; titles, story lines, headings, names and tags are HTML over them.
 * Each slide's drawing is in its own module: scene-sauce.tsx (29),
 * scene-pack.tsx (30), scene-source.tsx (31), scene-binders.tsx (32),
 * scene-workshop.tsx (33) and scene-spreads.tsx (33a). Static markup: the
 * steps (world.ts, world-sauce.ts, steps-spreads.ts) do all the moving.
 * Colour comes by role (`data-hue`): the agent pack the process's green, the
 * source code the catalog's indigo, the design system and skills pink, help
 * getting set up sky, and the sauce gold. Agents are the process's green.
 */
"use client";

import { Plane, SetText, Story } from "@/components/deck/kit";
import { STORIES, TITLES } from "./layout";
import { BinderMarks, BinderWords } from "./scene-binders";
import { PackMarks } from "./scene-pack";
import { SauceMarks, SauceWords } from "./scene-sauce";
import { SourceMarks, SourceWords } from "./scene-source";
import { SpreadsMarks } from "./scene-spreads";
import { WorkshopMarks, WorkshopWords } from "./scene-workshop";
import "./releasing.css";

function Marks() {
  return (
    <>
      <SauceMarks />
      <PackMarks />
      <SourceMarks />
      <BinderMarks />
      <WorkshopMarks />
      <SpreadsMarks />
    </>
  );
}

export function Scene() {
  return (
    <Plane marks={<Marks />}>
      {Object.values(TITLES).map((title) => (
        <SetText key={title.key} id={title.key} x={title.x} y={title.y} size="title" lines={title.lines} />
      ))}
      {Object.values(STORIES).map((story) => (
        <Story key={story.id} id={story.id} band={story.band} lines={story.lines} />
      ))}
      <SauceWords />
      <SourceWords />
      <BinderWords />
      <WorkshopWords />
    </Plane>
  );
}
