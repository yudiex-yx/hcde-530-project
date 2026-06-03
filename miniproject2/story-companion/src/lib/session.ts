// Tiny session store for the prototype.
// Persists caregiver setup, tracked interactions, saved prompts, and
// lightweight accessibility settings in localStorage so the flow survives
// a refresh and the summary page can recap what happened.

import type { PromptType, ReadingGoal, ReadingMode } from "./story-data";

const KEY = "story-companion-session";

export interface AccessibilitySettings {
  textSize: "sm" | "md" | "lg";
  reducedMotion: boolean;
  audioNarration: boolean; // placeholder toggle only
}

export type StorySource = "Manual" | "Upload" | "Scan";

export interface Session {
  storyTitle: string;
  storyId: string;
  childAge: 4 | 5 | 6;
  readingGoal: ReadingGoal;
  readingMode: ReadingMode;
  sceneText: string;
  exploredHotspots: string[];
  usedPromptTypes: PromptType[];
  savedPrompts: { hotspotId: string; prompt: string; type: PromptType }[];
  guidedStep: number;
  a11y: AccessibilitySettings;
  source: StorySource;
  sourceLabel?: string;
}

const DEFAULT: Session = {
  storyTitle: "Luna and the Lost Moon Button",
  storyId: "luna",
  childAge: 5,
  readingGoal: "Observation",
  readingMode: "Explore",
  sceneText:
    "Luna found a tiny silver button under the big blue tree. It shimmered like the moon. 'Who could have lost this?' she wondered.",
  exploredHotspots: [],
  usedPromptTypes: [],
  savedPrompts: [],
  guidedStep: 0,
  a11y: { textSize: "md", reducedMotion: false, audioNarration: false },
  source: "Manual",
};

export function loadSession(): Session {
  if (typeof window === "undefined") return DEFAULT;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return DEFAULT;
    const parsed = JSON.parse(raw);
    return { ...DEFAULT, ...parsed, a11y: { ...DEFAULT.a11y, ...(parsed.a11y ?? {}) } };
  } catch {
    return DEFAULT;
  }
}

export function saveSession(s: Session) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(s));
}

export function resetSession() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(KEY);
}
