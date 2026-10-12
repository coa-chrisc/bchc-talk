/**
 * The build world's stage, slides 14 to 22b: how we build, from the three
 * steps to the year and the whole process as one ring. One plane at the stage's size; static markup with an id
 * on every part a step moves (world.ts). The titles are the script's On
 * screen lines, set where every title in the talk sits, and each picture's
 * story lines sit in the band under them. Every drawing is HTML with its
 * own small SVG (parts.tsx), so a move repaints only what it moves.
 */
"use client";

import { Plane, SetText, Story } from "@/components/deck/kit";
import { picturesOf, storyId } from "../steps";
import "./build.css";
import { TITLE, TITLES, bandOf } from "./layout";
import { BoardScene } from "./scene-board";
import { CloseScene } from "./scene-close";
import { IntroScene } from "./scene-intro";
import { LibraryScene } from "./scene-library";
import { ProcessScene } from "./scene-process";
import { SetupScene } from "./scene-setup";
import { YearScene } from "./scene-year";

export function Scene() {
  return (
    <Plane>
      {TITLES.map(({ key, lines, size }) => (
        <SetText key={key} id={key} x={TITLE.x} y={TITLE.y} lines={lines} size={size} />
      ))}
      {picturesOf("build").map((picture) => (
        <Story key={picture.id} id={storyId(picture.id)} band={bandOf(picture.id)} lines={picture.story} />
      ))}
      <IntroScene />
      <SetupScene />
      <LibraryScene />
      <BoardScene />
      <CloseScene />
      <YearScene />
      <ProcessScene />
    </Plane>
  );
}
