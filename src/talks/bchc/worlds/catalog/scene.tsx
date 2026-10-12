/**
 * The catalog world's stage: Parts 1 and 2 of the talk on one plane the
 * size of the stage, from the title to "You own it". Every slide's title
 * and story lines, then each part's marks and pictures (scene-catalog.tsx,
 * scene-review.tsx, scene-proof.tsx, scene-why.tsx). Nothing here moves on its own; the steps move it.
 */
"use client";

import { Plane, SetText, Story } from "@/components/deck/kit";
import { picturesOf, storyId } from "../steps";
import "./catalog.css";
import { OPENING, titleOf } from "./layout";
import { bandOf, storyLines, storyStarts } from "./layout-story";
import { CatalogMarks, CatalogOver, CatalogParts } from "./scene-catalog";
import { ProofMarks, ProofOver, ProofParts } from "./scene-proof";
import { ReviewMarks, ReviewParts } from "./scene-review";
import { WhyMarks, WhyOver, WhyParts } from "./scene-why";

/** Slide 1's three lines, as one part, every later slide's title, and every slide's story lines. */
function Titles() {
  const { key, talk, credit, department } = OPENING;
  return (
    <>
      <SetText id={key} x={talk.x} y={talk.y} size="title" rule={false} lines={talk.lines} />
      <SetText id={key} x={credit.x} y={credit.y} size="medium" lines={credit.lines.map((line) => <span key={line} className="catalog-soft">{line}</span>)} />
      <SetText id={key} x={department.x} y={department.y} size="medium" lines={department.lines} />
      {picturesOf("catalog")
        .slice(1)
        .map((picture) => {
          const title = titleOf(picture.id);
          return <SetText key={title.key} id={title.key} x={title.x} y={title.y} size="title" lines={title.lines} />;
        })}
      {picturesOf("catalog").map((picture) => (
        <Story key={picture.id} id={storyId(picture.id)} band={bandOf(picture.id)} lines={storyLines(picture.id)} starts={storyStarts(picture.id)} />
      ))}
    </>
  );
}

export function Scene() {
  return (
    <Plane
      marks={
        <>
          <CatalogMarks />
          <ReviewMarks />
          <ProofMarks />
          <WhyMarks />
        </>
      }
      over={
        <>
          <CatalogOver />
          <ProofOver />
          <WhyOver />
        </>
      }
    >
      <Titles />
      <CatalogParts />
      <ReviewParts />
      <ProofParts />
      <WhyParts />
    </Plane>
  );
}
