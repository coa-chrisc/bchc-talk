/** The start world's stage: Part 6, slides 34 to 42, on one plane at HOME. */
"use client";

import { Plane, SetText } from "@/components/deck/kit";
import { KICKER, KICKERS, TITLE, TITLES } from "./layout";
import { Kicker } from "./parts";
import { AskHtml, AskMarks } from "./scene-ask";
import { PathHtml, PathMarks } from "./scene-path";
import { SafeHtml, SafeMarks } from "./scene-safe";
import { StepsHtml, StepsMarks } from "./scene-steps";
import { TwoHtml, TwoMarks } from "./scene-two";
import "./start.css";

export function Scene() {
  return (
    <Plane
      marks={
        <>
          <StepsMarks />
          <TwoMarks />
          <SafeMarks />
          <PathMarks />
          <AskMarks />
        </>
      }
    >
      {TITLES.map((title) => (
        <SetText key={title.key} id={title.key} x={TITLE.x} y={TITLE.y} size="title" lines={title.lines} />
      ))}
      {KICKERS.map((kicker) => (
        <Kicker key={kicker.key} id={kicker.key} at={KICKER} text={kicker.text} />
      ))}
      <StepsHtml />
      <TwoHtml />
      <SafeHtml />
      <PathHtml />
      <AskHtml />
    </Plane>
  );
}
