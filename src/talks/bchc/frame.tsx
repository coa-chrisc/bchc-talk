/**
 * The talk's frame, as the Austin Public Health deck draws it on every
 * content slide (docs/bchc-brand.md): the department's logo top left, the
 * footer bottom left and the slide's number bottom right. All three sit in
 * the stage's 64 px edge, outside the safe area the worlds draw in. The
 * number ends short of the window's corner, where the deck's own back and
 * forward buttons and its counter sit. The title and close slides, on navy,
 * carry only the logo, in its white version.
 */
import Image from "next/image";
import type { FrameProps } from "@/components/deck/engine";
import { withBase } from "@/lib/base-path";
import "./frame.css";

/** The logo's file (1920 by 646) and its height on the stage; its width keeps the file's proportions. */
export const LOGO = { src: withBase("/brand/aph-logo.v1.png"), h: 40, w: Math.round((40 * 1920) / 646) } as const;

/** The logo's white version, for the navy title and close slides. */
export const LOGO_WHITE = withBase("/brand/aph-logo-white.v1.png");

/** The footer's words: the department, then the group the talk is for. */
export const FOOTER = { department: "Austin Public Health", group: "BCHC Data Modernization Work Group" } as const;

export function Frame({ number, ground }: FrameProps) {
  const logo = (src: string) => (
    <Image className="bchc-frame__logo" src={src} alt="Austin Public Health" width={LOGO.w} height={LOGO.h} loading="eager" decoding="sync" unoptimized />
  );
  if (ground) return logo(LOGO_WHITE);
  return (
    <>
      {logo(LOGO.src)}
      <p className="bchc-frame__footer">
        <b>{FOOTER.department}</b> · {FOOTER.group}
      </p>
      <p className="bchc-frame__number">{number}</p>
    </>
  );
}
