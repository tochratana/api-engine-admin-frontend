import { WordRotate } from "../magicui/word-rotate";

export function WordRotateDemo() {
  return (
    <WordRotate
      className=" text-start inline bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent"
      words={[
        "Backend Manually",
        "Complex Setup",
        "Database Config",
        "API Building",
      ]}
      duration={980}
    />
  );
}
