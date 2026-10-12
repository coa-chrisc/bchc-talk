/** A start-world picture's story lines (kit `Story`): the script's words, in the band its title leaves them. */
import { STORY, SetText, Story, storyKeys } from "@/components/deck/kit";
import { storyOf } from "../../script/find";
import { storyId } from "../steps";
import { THREE_LINE_STORY_TOP, TITLE_LINES, bandOf, titleKey } from "./layout";

/**
 * Set inside the picture's HTML layer, so leaving the picture takes its
 * story with it. A title on three lines (slide 35's) leaves no room for the
 * two-line band, so its lines are set the same way a little lower.
 */
export function PictureStory({ picture }: { picture: string }) {
  const lines = storyOf(picture);
  if (TITLE_LINES[titleKey(picture)] !== 3) return <Story id={storyId(picture)} band={bandOf(picture)} lines={lines} />;
  const keys = storyKeys(storyId(picture), lines.length);
  return lines.map((line, i) => <SetText key={keys[i]} id={keys[i]} x={STORY.x} y={THREE_LINE_STORY_TOP + i * STORY.pitch} lines={[line]} size="text" />);
}
