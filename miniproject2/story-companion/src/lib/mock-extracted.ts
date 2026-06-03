// Mock "extracted" story data used by the upload + scan flows.
// In a real app, this would come from OCR + an LLM. Here we rotate through
// a few believable picture-book scenes so each upload/scan feels different.

import type { ReadingGoal } from "./story-data";

export interface ExtractedStory {
  storyId: string; // existing story whose hotspots we reuse for the prototype
  title: string;
  scene: string;
  suggestedGoal: ReadingGoal;
  suggestedAge: string;
  supports: string[]; // e.g. ["Observation", "Emotion Talk"]
}

export const EXTRACTED_POOL: ExtractedStory[] = [
  {
    storyId: "rain",
    title: "A Window Full of Rain",
    scene:
      "Maya pressed her nose to the window. The picnic she'd planned was washed away. But the rain made gentle music on the glass, and her teacup was still warm.",
    suggestedGoal: "Emotion Talk",
    suggestedAge: "4–6 years",
    supports: ["Emotion Talk", "Observation", "Imagination"],
  },
  {
    storyId: "forest",
    title: "A Quiet Walk in the Woods",
    scene:
      "Sam and Ada walked slowly along the forest path. They didn't talk much. They just listened — to leaves, to a faraway bird, to their own footsteps.",
    suggestedGoal: "Observation",
    suggestedAge: "4–6 years",
    supports: ["Observation", "Vocabulary", "Social Skills"],
  },
  {
    storyId: "backpack",
    title: "The Missing Backpack Mystery",
    scene:
      "Benny stopped on the path. His backpack was gone! He looked at the bench, the bushes, and the soft prints on the ground. Where had he been before?",
    suggestedGoal: "Observation",
    suggestedAge: "5–6 years",
    supports: ["Problem Solving", "Observation", "Emotion Talk"],
  },
  {
    storyId: "luna",
    title: "A Button Under the Blue Tree",
    scene:
      "Luna found a tiny silver button under the big blue tree. It shimmered like the moon. 'Who could have lost this?' she wondered.",
    suggestedGoal: "Imagination",
    suggestedAge: "4–6 years",
    supports: ["Imagination", "Observation", "Vocabulary"],
  },
];

export function pickExtracted(seed?: string): ExtractedStory {
  // Stable-ish pick so the same filename "extracts" the same story.
  const s = (seed ?? String(Math.random())).split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  return EXTRACTED_POOL[s % EXTRACTED_POOL.length];
}
