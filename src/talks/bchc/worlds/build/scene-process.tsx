/**
 * Slide 22b's ring: the seven steps on one line that strokes on clockwise in
 * the process green, each step a pill with its name, the passed tick on
 * the corner of "Check"'s pill and the person-approves mark on "Approve"'s;
 * inside it, your department's outline, named over it, and the three
 * products of slide 22a.
 * steps-process.ts moves it; the words are the script's (layout-process.ts).
 */
"use client";

import { place } from "@/components/deck/kit";
import { DEPARTMENT, MARKS, PRODUCTS, RING, STEPS } from "./layout-process";
import { Approves, Pic, Tick, Words } from "./parts";
import { Product } from "./scene-year";

function Ring() {
  return (
    <>
      <Pic at={RING.at} id={RING.key}>
        <path className="bw-ring dk-draw" d={RING.d} pathLength={1} />
      </Pic>
      {STEPS.map((step) => (
        <div key={step.key} data-build={step.key}>
          <Pic at={{ x: step.pill.x - 4, y: step.pill.y - 4, w: step.pill.w + 8, h: step.pill.h + 8 }}>
            <rect className="bw-ring-step" x={step.pill.x} y={step.pill.y} width={step.pill.w} height={step.pill.h} rx={step.pill.h / 2} />
          </Pic>
          <Words at={step.textAt} width={step.textAt.w} align="center" lines={[step.text]} size="text" />
        </div>
      ))}
      <Pic at={{ x: MARKS.tick.x - MARKS.tickR - 4, y: MARKS.tick.y - MARKS.tickR - 4, w: 2 * MARKS.tickR + 8, h: 2 * MARKS.tickR + 8 }} id={MARKS.tickKey}>
        <Tick at={MARKS.tick} r={MARKS.tickR} />
      </Pic>
      <Pic at={{ x: MARKS.approve.x - MARKS.approveR - 6, y: MARKS.approve.y - MARKS.approveR - 6, w: 2 * MARKS.approveR + 12, h: 2 * MARKS.approveR + 12 }} id={MARKS.approveKey}>
        <Approves at={MARKS.approve} r={MARKS.approveR} />
      </Pic>
    </>
  );
}

function Department() {
  return (
    <>
      <div data-build={DEPARTMENT.key}>
        <div className="bw-outline dk-wipe" style={place(DEPARTMENT.outline)} />
        <Words at={DEPARTMENT.textAt} width={DEPARTMENT.textAt.w} align="center" lines={[DEPARTMENT.text]} size="text" />
      </div>
      {PRODUCTS.map((product) => (
        <div key={product.key} data-build={product.key}>
          <Pic at={{ x: product.icon.x - 4, y: product.icon.y - 4, w: product.icon.w + 8, h: product.icon.h + 8 }}>
            <Product kind={product.kind} at={product.icon} />
          </Pic>
          <Words at={product.labelAt} width={product.labelAt.w} align="center" lines={[product.text]} />
        </div>
      ))}
    </>
  );
}

export function ProcessScene() {
  return (
    <>
      <Ring />
      <Department />
    </>
  );
}
