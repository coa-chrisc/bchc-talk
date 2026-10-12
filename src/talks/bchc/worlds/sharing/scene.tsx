/**
 * Part 4's stage: one plane the size of the stage, never moved by a camera.
 * Every slide's title sits in the same place; each slide's picture is three
 * parts, its marks under the HTML, its HTML and its marks over the HTML, so
 * it goes in one move when the next slide arrives. Each slide's drawing is
 * in its own scene module; where things go and what they say is in the
 * layout modules, how they move in the steps modules.
 */
"use client";

import { Plane, SetText } from "@/components/deck/kit";
import { TITLE, TITLES } from "./layout";
import { AdaptHtml, AdaptMarks, AdaptOver } from "./scene-adapt";
import { EveryoneHtml, EveryoneMarks, EveryoneOver } from "./scene-everyone";
import { MoreHtml, MoreMarks, MoreOver } from "./scene-more";
import { NetworkHtml, NetworkMarks, NetworkOver } from "./scene-network";
import { TogetherHtml, TogetherMarks, TogetherOver } from "./scene-together";
import "./sharing.css";

export function Scene() {
  return (
    <Plane
      marks={
        <>
          <TogetherMarks />
          <EveryoneMarks />
          <AdaptMarks />
          <MoreMarks />
          <NetworkMarks />
        </>
      }
      over={
        <>
          <TogetherOver />
          <EveryoneOver />
          <AdaptOver />
          <MoreOver />
          <NetworkOver />
        </>
      }
    >
      {TITLES.map((title) => (
        <SetText key={title.key} id={title.key} x={TITLE.x} y={TITLE.y} size="title" lines={title.lines} />
      ))}
      <TogetherHtml />
      <EveryoneHtml />
      <AdaptHtml />
      <MoreHtml />
      <NetworkHtml />
    </Plane>
  );
}
