import type { Metadata, Viewport } from "next";
import { TalkNotes } from "../talk";

export const metadata: Metadata = {
  title: "Speaker notes: Big Cities Health Coalition talk",
  robots: { index: false, follow: false },
};

/** The notes are held in a hand as often as they sit on a desk: draw under the phone's rounded corners and keep clear of them in CSS. */
export const viewport: Viewport = { viewportFit: "cover" };

export default function NotesPage() {
  return <TalkNotes />;
}
