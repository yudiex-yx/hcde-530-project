// Shared sample data for the Story Companion prototype.
// All four library stories are now first-class: each one has its own scene
// text, hotspots, prompts, and a guided reading order. The story.tsx +
// summary.tsx pages read whichever story is active from the session.

import type { LucideIcon } from "lucide-react";
import {
  Eye,
  Heart,
  Sparkles,
  Activity,
  MessageCircle,
  Pencil,
  Drama,
  MessagesSquare,
  Compass,
} from "lucide-react";

export type PromptType = "Look" | "Feel" | "Imagine" | "Move" | "Talk";

export interface Prompt {
  type: PromptType;
  prompt: string;
  followUp?: string;
  action?: string;
}

export interface Hotspot {
  id: string;
  label: string;
  // Position as percentages within the scene container
  x: number;
  y: number;
  prompts: Prompt[];
}

export const PROMPT_META: Record<
  PromptType,
  { icon: LucideIcon; color: string; label: string }
> = {
  Look: { icon: Eye, color: "look", label: "Look" },
  Feel: { icon: Heart, color: "feel", label: "Feel" },
  Imagine: { icon: Sparkles, color: "imagine", label: "Imagine" },
  Move: { icon: Activity, color: "move", label: "Move" },
  Talk: { icon: MessageCircle, color: "talk", label: "Talk" },
};

// ---------------- Library ----------------

export type ReadingFocus =
  | "Observation"
  | "Emotional Understanding"
  | "Imagination"
  | "Problem Solving"
  | "Friendship";

export interface LibraryStory {
  id: string;
  title: string;
  ageRange: string;
  focus: ReadingFocus;
  description: string;
  // All four stories are interactive in this prototype iteration.
  interactive: boolean;
  cover: "luna" | "rain" | "backpack" | "forest";
}

export const LIBRARY: LibraryStory[] = [
  {
    id: "luna",
    title: "Luna and the Lost Moon Button",
    ageRange: "Ages 4–6",
    focus: "Imagination",
    description: "A small girl finds a shimmering button under a towering blue tree.",
    interactive: true,
    cover: "luna",
  },
  {
    id: "rain",
    title: "Maya's Rainy Day",
    ageRange: "Ages 4–6",
    focus: "Emotional Understanding",
    description: "Maya's outdoor plans wash away — and a quiet afternoon begins.",
    interactive: true,
    cover: "rain",
  },
  {
    id: "backpack",
    title: "Benny's Missing Backpack",
    ageRange: "Ages 5–6",
    focus: "Problem Solving",
    description: "Benny retraces his steps to find a backpack with a secret inside.",
    interactive: true,
    cover: "backpack",
  },
  {
    id: "forest",
    title: "The Quiet Forest Path",
    ageRange: "Ages 4–6",
    focus: "Observation",
    description: "Two friends walk slowly and notice what most people miss.",
    interactive: true,
    cover: "forest",
  },
];

export const READING_GOALS = [
  "Observation",
  "Emotion Talk",
  "Imagination",
  "Vocabulary",
  "Social Skills",
] as const;

export type ReadingGoal = (typeof READING_GOALS)[number];

export type ReadingMode = "Explore" | "Guided";

// ---------------- Per-story content ----------------

export interface StoryConfig {
  id: string;
  title: string;
  scene: string;
  hotspots: Hotspot[];
  guided: { hotspotId: string; type: PromptType }[];
  // Recommended reading goal — used as default if caregiver hasn't picked one.
  recommendedGoal: ReadingGoal;
}

export const STORIES: Record<string, StoryConfig> = {
  // -------- Luna --------
  luna: {
    id: "luna",
    title: "Luna and the Lost Moon Button",
    scene:
      "Luna found a tiny silver button under the big blue tree. It shimmered like the moon. 'Who could have lost this?' she wondered.",
    recommendedGoal: "Imagination",
    hotspots: [
      {
        id: "luna",
        label: "Luna",
        x: 32,
        y: 68,
        prompts: [
          { type: "Look", prompt: "What do you notice about Luna's face or body?" },
          { type: "Feel", prompt: "How do you think Luna feels right now?", followUp: "What makes you think that?" },
          { type: "Talk", prompt: "What would you say to Luna if you were there?" },
        ],
      },
      {
        id: "button",
        label: "Silver button",
        x: 46,
        y: 80,
        prompts: [
          { type: "Look", prompt: "What does the button look like?" },
          { type: "Imagine", prompt: "Who do you think lost it?" },
          { type: "Move", prompt: "Look around the room.", action: "Ask the child to point to something shiny nearby." },
        ],
      },
      {
        id: "tree",
        label: "Big blue tree",
        x: 70,
        y: 42,
        prompts: [
          { type: "Look", prompt: "What colors and shapes do you see in the tree?" },
          { type: "Talk", prompt: "The tree is 'towering.' What do you think towering means?", followUp: "Have you ever stood next to something towering?" },
          { type: "Move", prompt: "Stretch tall together.", action: "Can you stretch your arms like a tall tree?" },
        ],
      },
      {
        id: "sky",
        label: "Moon & sky",
        x: 78,
        y: 18,
        prompts: [
          { type: "Feel", prompt: "Does this scene feel calm, mysterious, or exciting?" },
          { type: "Imagine", prompt: "What might happen if the moon button starts glowing?" },
          { type: "Move", prompt: "Breathe with the moon.", action: "Take one slow moon breath together." },
        ],
      },
    ],
    guided: [
      { hotspotId: "luna", type: "Look" },
      { hotspotId: "luna", type: "Feel" },
      { hotspotId: "button", type: "Look" },
      { hotspotId: "button", type: "Imagine" },
      { hotspotId: "tree", type: "Talk" },
      { hotspotId: "tree", type: "Move" },
      { hotspotId: "sky", type: "Feel" },
      { hotspotId: "sky", type: "Move" },
    ],
  },

  // -------- Maya's Rainy Day --------
  rain: {
    id: "rain",
    title: "Maya's Rainy Day",
    scene:
      "Maya pressed her nose to the window. The picnic she'd planned was washed away. But the rain made gentle music on the glass, and her teacup was still warm.",
    recommendedGoal: "Emotion Talk",
    hotspots: [
      {
        id: "maya",
        label: "Maya at the window",
        x: 28,
        y: 55,
        prompts: [
          { type: "Feel", prompt: "How do you think Maya feels watching the rain?", followUp: "Have you ever felt disappointed like that?" },
          { type: "Look", prompt: "What is her face telling you?" },
          { type: "Talk", prompt: "What would you say to a friend who felt this way?" },
        ],
      },
      {
        id: "rain",
        label: "Rain on the window",
        x: 65,
        y: 30,
        prompts: [
          { type: "Look", prompt: "How many raindrops can you count before they slide down?" },
          { type: "Move", prompt: "Make rain with your fingers.", action: "Tap fingertips softly on the table together." },
          { type: "Feel", prompt: "Does the sound of rain feel cozy, sleepy, or sad?" },
        ],
      },
      {
        id: "teacup",
        label: "Warm teacup",
        x: 55,
        y: 75,
        prompts: [
          { type: "Imagine", prompt: "What's inside Maya's cup? What does it smell like?" },
          { type: "Talk", prompt: "What's something warm that makes you feel better on a hard day?" },
          { type: "Move", prompt: "Take a warm breath.", action: "Pretend to hold a warm cup and breathe in slowly." },
        ],
      },
      {
        id: "boat",
        label: "Little paper boat",
        x: 80,
        y: 82,
        prompts: [
          { type: "Imagine", prompt: "If Maya floated this boat outside, where would it sail?" },
          { type: "Look", prompt: "What shapes do you see in the boat?" },
          { type: "Feel", prompt: "Sometimes a quiet plan is better than a busy one. What do you think?" },
        ],
      },
    ],
    guided: [
      { hotspotId: "maya", type: "Feel" },
      { hotspotId: "rain", type: "Look" },
      { hotspotId: "rain", type: "Move" },
      { hotspotId: "teacup", type: "Talk" },
      { hotspotId: "maya", type: "Talk" },
      { hotspotId: "boat", type: "Imagine" },
    ],
  },

  // -------- Benny's Missing Backpack --------
  backpack: {
    id: "backpack",
    title: "Benny's Missing Backpack",
    scene:
      "Benny stopped on the path. His backpack was gone! He looked at the bench, the bushes, and the soft prints on the ground. Where had he been before?",
    recommendedGoal: "Observation",
    hotspots: [
      {
        id: "benny",
        label: "Benny",
        x: 25,
        y: 65,
        prompts: [
          { type: "Feel", prompt: "What might Benny be feeling right now?" },
          { type: "Talk", prompt: "What's the first thing you do when you lose something?" },
          { type: "Look", prompt: "What is Benny looking at first?" },
        ],
      },
      {
        id: "bench",
        label: "The bench",
        x: 55,
        y: 55,
        prompts: [
          { type: "Look", prompt: "What do you notice on or under the bench?" },
          { type: "Imagine", prompt: "What if Benny sat here earlier — what was he doing?" },
          { type: "Talk", prompt: "Where do you sometimes leave things by accident?" },
        ],
      },
      {
        id: "bush",
        label: "Bushy hiding spot",
        x: 78,
        y: 60,
        prompts: [
          { type: "Look", prompt: "Look carefully — can you spot something behind the leaves?" },
          { type: "Imagine", prompt: "What do you think is inside Benny's backpack?" },
          { type: "Feel", prompt: "How might Benny feel if he finds it here?" },
        ],
      },
      {
        id: "tracks",
        label: "Footprints",
        x: 42,
        y: 85,
        prompts: [
          { type: "Look", prompt: "Which way do the footprints go?" },
          { type: "Move", prompt: "Walk it out.", action: "Take three steps together, slowly, like a detective." },
          { type: "Talk", prompt: "What would you ask Benny to help him remember?" },
        ],
      },
    ],
    guided: [
      { hotspotId: "benny", type: "Feel" },
      { hotspotId: "tracks", type: "Look" },
      { hotspotId: "tracks", type: "Move" },
      { hotspotId: "bench", type: "Look" },
      { hotspotId: "bush", type: "Look" },
      { hotspotId: "bush", type: "Imagine" },
    ],
  },

  // -------- The Quiet Forest Path --------
  forest: {
    id: "forest",
    title: "The Quiet Forest Path",
    scene:
      "Sam and Ada walked slowly along the forest path. They didn't talk much. They just listened — to leaves, to a faraway bird, to their own footsteps.",
    recommendedGoal: "Observation",
    hotspots: [
      {
        id: "friends",
        label: "Sam & Ada",
        x: 30,
        y: 72,
        prompts: [
          { type: "Talk", prompt: "Why do you think they're being so quiet?" },
          { type: "Feel", prompt: "How do walks with a friend feel different from walks alone?" },
          { type: "Imagine", prompt: "What might they be thinking about?" },
        ],
      },
      {
        id: "tree",
        label: "Tall old tree",
        x: 70,
        y: 35,
        prompts: [
          { type: "Look", prompt: "How tall does this tree feel compared to the children?" },
          { type: "Imagine", prompt: "If this tree had a memory, what would it remember?" },
          { type: "Move", prompt: "Reach up like branches.", action: "Stretch arms wide and sway gently together." },
        ],
      },
      {
        id: "mushroom",
        label: "Tiny mushroom",
        x: 55,
        y: 85,
        prompts: [
          { type: "Look", prompt: "What's the smallest thing you can find on this page?" },
          { type: "Imagine", prompt: "Who might live in or under this little mushroom?" },
          { type: "Talk", prompt: "What is something small you noticed today that most people didn't?" },
        ],
      },
      {
        id: "bird",
        label: "Faraway bird",
        x: 82,
        y: 18,
        prompts: [
          { type: "Look", prompt: "Where is the bird? How can you tell it's far away?" },
          { type: "Move", prompt: "Listen carefully.", action: "Close your eyes for five seconds and count the sounds you hear." },
          { type: "Feel", prompt: "Does this forest feel busy, peaceful, or a little mysterious?" },
        ],
      },
    ],
    guided: [
      { hotspotId: "friends", type: "Talk" },
      { hotspotId: "bird", type: "Move" },
      { hotspotId: "tree", type: "Look" },
      { hotspotId: "mushroom", type: "Look" },
      { hotspotId: "mushroom", type: "Imagine" },
      { hotspotId: "friends", type: "Feel" },
    ],
  },
};

export function getStory(id: string | undefined): StoryConfig {
  if (!id) return STORIES.luna;
  return STORIES[id] ?? STORIES.luna;
}

// Backwards-compat exports (Luna defaults for any older callers).
export const SAMPLE_STORY = { title: STORIES.luna.title, scene: STORIES.luna.scene };
export const HOTSPOTS = STORIES.luna.hotspots;
export const GUIDED_ORDER = STORIES.luna.guided;

// ---------------- Caregiver Toolkit ----------------

export interface ToolkitCard {
  id: string;
  situation: string;
  tips: string[];
}

export const TOOLKIT: ToolkitCard[] = [
  {
    id: "attention",
    situation: "When the child loses attention",
    tips: [
      "Try a 30-second movement break.",
      "Play a quick point-and-find game on the page.",
      "Take one slow breath together before continuing.",
    ],
  },
  {
    id: "idk",
    situation: "When the child says 'I don't know'",
    tips: [
      "Offer two gentle choices: 'Do you think she's happy or worried?'",
      "Model your own answer first, then invite theirs.",
      "Wait 5–10 seconds before repeating or rephrasing.",
    ],
  },
  {
    id: "fast",
    situation: "When the child answers very quickly",
    tips: [
      "Follow up with 'Why do you think that?'",
      "Ask 'What else do you notice?'",
      "Connect it to real life: 'When have you felt that way?'",
    ],
  },
];

// ---------------- Story Extension Activities ----------------

export interface ExtensionActivity {
  id: string;
  kind: "Draw" | "Pretend" | "Talk" | "Explore";
  icon: LucideIcon;
  title: string;
  description: string;
}

export const EXTENSIONS: ExtensionActivity[] = [
  {
    id: "draw",
    kind: "Draw",
    icon: Pencil,
    title: "Draw something from the story",
    description: "Add one new detail of your own — a new character, object, or weather.",
  },
  {
    id: "pretend",
    kind: "Pretend",
    icon: Drama,
    title: "Act it out together",
    description: "Choose a moment from the story and play it out with voices and small movements.",
  },
  {
    id: "talk",
    kind: "Talk",
    icon: MessagesSquare,
    title: "Conversation starter",
    description: "Ask: 'What part of this story do you want to talk about more?'",
  },
  {
    id: "explore",
    kind: "Explore",
    icon: Compass,
    title: "Real-world echo",
    description: "Find one thing in your home that connects to something from the story.",
  },
];
