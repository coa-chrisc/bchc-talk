/**
 * What slide 38s draws (layout-safe.ts): its marks as one SVG part and its
 * HTML as one layer, so the step that leaves it hides it in two moves. Every
 * word comes from the layout, which reads the script.
 */
import { HumanMark, Part, Person } from "@/components/deck/kit";
import { layerOf } from "./layout";
import { SAFE } from "./layout-safe";
import { Change, DashedShape, Words } from "./parts-figures";
import { Layer } from "./parts";
import { DataTable, Fence, FenceGate, Stamp } from "./parts-safe";
import { PictureStory } from "./story";

export function SafeMarks() {
  const { fence, gate, dept, publicData, personal, approver, record, changes, undone } = SAFE;
  return (
    <Part id={layerOf("safe").marks}>
      <Fence id={fence.key} d={fence.d} posts={fence.posts} />
      <Words id={fence.label.key} at={fence.label.at} text={fence.label.text} anchor="start" />
      <FenceGate id={gate.key} hinge={gate.hinge} length={gate.length} />
      <Words id={dept.label.key} at={dept.label.at} text={dept.label.text} anchor="start" />
      <path className="st-record dk-draw" data-build={record.key} d={`M${record.from.x} ${record.from.y}H${record.to.x}`} pathLength={1} />
      <Words id={record.label.key} at={record.label.at} text={record.label.text} anchor="end" />
      {changes.map((change) => (
        <Stamp key={change.stamp.key} id={change.stamp.key} at={change.stamp.at} />
      ))}
      <Person id={approver.key} at={approver.at} />
      <Words id={approver.label.key} at={approver.label.at} text={approver.label.text} />
      {/* The changes start behind public data, so they are drawn before it. */}
      {changes.map((change) => (
        <g key={change.key} data-build={change.key}>
          <Change at={change.at} />
          <HumanMark id={change.mark.key} at={change.mark.at} />
        </g>
      ))}
      {[publicData, personal].map((table) => (
        <DataTable key={table.key} id={table.key} at={table.at} text={table.text} name={table.name} />
      ))}
      <Words id={undone.key} at={undone.at} text={undone.text} />
    </Part>
  );
}

export function SafeHtml() {
  return (
    <Layer id={layerOf("safe").html}>
      <DashedShape id={SAFE.dept.key} at={SAFE.dept.at} d={SAFE.dept.d} />
      <PictureStory picture="safe" />
    </Layer>
  );
}
