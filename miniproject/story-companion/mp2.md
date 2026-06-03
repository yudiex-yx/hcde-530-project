# HCDE 530 MP2 — Story Companion Competency Evidence

**Project:** Story Companion (deployed shared-reading companion prototype)  
**Deployed URL:** `[ADD YOUR DEPLOYED URL HERE]`  
**Repository:** Story Companion (Lovable export + Cursor iteration)

This document maps work to the **eight HCDE 530 competency domains**. Claims are limited to what the prototype actually implements.

---

## Competency overview

| Code | Domain | Primary evidence in this project |
|------|--------|----------------------------------|
| C1 | Vibecoding and rapid prototyping | Lovable → Cursor → deployable multi-route app |
| C2 | Code reading | TypeScript routes, session, story data, ingest simulation |
| C3 | Data handling | Static story catalog + session JSON (not pandas pipelines) |
| C4 | API use | Scaffold only; product paths do not call live APIs |
| C5 | Visualization | SVG scenes, progress UI, summary engagement display |
| C6 | ML evaluation | Not demonstrated; upload/scan extraction is simulated |
| C7 | Critical evaluation and professional judgment | Caregiver-first scope, simulated vs real ingest |
| C8 | Building and deploying a complete tool | End-to-end flows, HCD-framed deliverable |

---

## C1 — Vibecoding and rapid prototyping

**Claim:** I described a caregiver-facing shared-reading tool and deployed a working multi-screen application from that description.

**Evidence:**

- Initial UI and routes were generated in **Lovable** (TanStack Start template), then exported to this repository (`decisions.md`).
- The app ships **eight functional routes**: `/`, `/create`, `/upload`, `/scan`, `/library`, `/setup`, `/story`, `/summary` (`src/routes/`).
- **Three input pathways** are implemented as separate flows converging on shared setup and reading (`project_notes.md` flow diagram).
- Local and production builds run via `npm run dev` and `npm run build` (`README.md`).

**Interaction design example:** `/create` presents three method cards; each navigates to the correct next step (manual → `/setup`, upload → `/upload`, scan → `/scan`) with appropriate session initialization in `create.tsx`.

---

## C2 — Code reading

**Claim:** I can read and explain what implemented code does across routes and data modules.

**Evidence:**

| File | What it does |
|------|----------------|
| `src/lib/session.ts` | Defines `Session`, loads/merges defaults from `localStorage`, saves caregiver state between pages. |
| `src/lib/story-data.ts` | Holds `STORIES` record: per-story `scene`, `hotspots[]` with `%` positions, `prompts[]`, `guided[]` step order. |
| `src/lib/mock-extracted.ts` | `pickExtracted(seed)` hashes a filename/URL to select a canned `ExtractedStory` and `storyId` for hotspot reuse. |
| `src/routes/story.tsx` | Reads `session.storyId` for hotspots/SVG via `getStory()`; displays `session.storyTitle` and `session.sceneText` on the reading screen. |
| `src/routes/setup.tsx` | Branches page copy by `source` / `sourceLabel` (Quick setup, Upload, Scan, Library). |

**Behavior I can explain:** In upload flow, `handleFile` sets phase to `analyzing`, advances `STEPS` on timers, then calls `pickExtracted(file.name)`—no image parsing occurs (`upload.tsx`).

---

## C3 — Data handling

**Claim (bounded):** I structured and used application data for stories, prompts, and session state. This project does **not** use pandas or analytical data pipelines.

**Evidence:**

- **Catalog data:** `LIBRARY` array and `STORIES` record in `story-data.ts`—typed interfaces (`Hotspot`, `Prompt`, `StoryConfig`, `ReadingGoal`).
- **Session merge:** `loadSession()` spreads parsed JSON over `DEFAULT` and deep-merges `a11y` (`session.ts`).
- **Progress tracking:** `exploredHotspots`, `usedPromptTypes`, `savedPrompts`, `guidedStep` updated during `/story` and cleared on setup submit or replay.

**Honest limit:** No CSV ingestion, cleaning, or reshaping; not a primary competency demonstration for this MP2.

---

## C4 — API use

**Claim (bounded):** API patterns exist as **template scaffolding**; the MP2 prototype does not retrieve or process live external data for reading content.

**Evidence:**

- `src/lib/api/example.functions.ts` defines `getGreeting` via `createServerFn` with Zod validation—illustrates intended server pattern.
- Upload/scan “extraction” reads from `EXTRACTED_POOL` in `mock-extracted.ts`, not a network call.
- `getStory(id)` is a synchronous in-memory lookup with Luna fallback.

**Honest limit:** No production API integration for OCR, LLM prompts, or storage (`decisions.md` — “real implementation” deferred).

---

## C5 — Visualization

**Claim (bounded):** I produced clear, labeled visual representations of story scenes and reading progress—not statistical charts or pandas plots.

**Evidence:**

- **Scene visuals:** `StoryScene.tsx` renders per-story SVG backdrops (`luna`, `rain`, `backpack`, `forest`) with positioned hotspot buttons (`x`, `y` percentages from `story-data.ts`).
- **Library covers:** `LibraryCover.tsx` — distinct SVG thumbnails per story.
- **Progress:** `ProgressTracker` on `/story` shows “Explored X / Y hotspots” with a filled bar (`story.tsx`).
- **Summary:** Engagement section lists explored hotspot labels and prompt category chips with color tokens tied to Look/Feel/Imagine/Move/Talk (`summary.tsx`, `PROMPT_META` in `story-data.ts`).

**Honest limit:** No matplotlib/plotly-style analytics; visualization supports **interaction design**, not dataset exploration.

---

## C6 — ML evaluation

**Claim:** **Not demonstrated** in this MP2 submission.

**Evidence:**

- Upload/scan pipelines are **explicitly simulated** (`decisions.md`, comments in `mock-extracted.ts`).
- No model inference, confidence scores, or evaluation metrics.
- `suggestedGoal` in mock extraction is authored text, not model output.

**What would change this:** Phase 4 in `development_plan.md` (vision + LLM with validated structured output)—out of current scope.

---

## C7 — Critical evaluation and professional judgment

**Claim:** I deployed a working tool for a real HCD problem while making defensible scope choices about simulation, users, and fidelity.

**Evidence:**

- **Problem:** Caregivers need help making read-alouds interactive without turning reading into a child-directed app (`README.md`, `.cursorrules` HCD framing).
- **User model:** Primary user is the adult; prompts and toolkit target caregiver language (`CaregiverGuide.tsx`, `ReadingToolkit.tsx`).
- **Simulated ingest:** Accepted tradeoff to validate **workflow and trust cues** (processing steps, review on setup) without false claims of OCR (`upload.tsx`, `scan.tsx`, `setup.tsx` Upload/Scan copy).
- **Mismatch awareness:** Extracted title/scene can differ from SVG scene art because hotspots remain tied to `storyId`—documented in `project_notes.md` known limitations.
- **Accessibility:** `AccessibilityBar` exposes text size and reduced motion; audio narration toggle is placeholder—judgment to ship partial a11y vs block demo.

**Professional judgment example:** Chose `localStorage` session over database for MP2 to support refresh during demos without auth/privacy scope (`session.ts`, `decisions.md`).

---

## C8 — Building and deploying a complete tool

**Claim:** I built and deployed a complete caregiver-facing tool and can describe it in HCD value terms, not only in code terms.

**HCD value (what the tool does for people):**

- Reduces uncertainty about **what to ask** during read-aloud through categorized prompts.
- Supports **pacing** via Guided mode (sequenced hotspots) or child-led **Explore** mode.
- Offers **pathways** matching how books enter the home: typed text, digital page, physical page.
- Closes the loop with **reflection and extensions** on `/summary`.

**Complete tool evidence (technical + UX):**

| Stage | Route | Caregiver action |
|-------|-------|------------------|
| Discover | `/` | Learn value; start or browse library |
| Choose input | `/create` | Pick Quick setup, Upload, or Scan |
| Ingest (simulated) | `/upload`, `/scan` | File/capture → processing → review extract |
| Configure | `/setup` | Age, goal, mode, edit title/scene |
| Read | `/story` | Hotspots, prompts, toolkit, save prompts |
| Reflect | `/summary` | Stats, extensions, optional notes |

**Deployable artifact:** Production build via `npm run build`; deployed URL in README (placeholder for submission link).

**Codebase anchor:** End-to-end state flows through `saveSession` / `loadSession` so title, scene, source, goal, and mode persist from setup into story and summary.

---

## Flow-specific evidence (MP2 demo paths)

### Quick Story Setup

1. `/create` → “Type a story” writes `source: "Manual"`, `sourceLabel: "Quick story setup"`, empty title/scene, `storyId: "luna"` for hotspots.
2. `/setup` shows **Quick Story Setup** heading, placeholders, editable fields.
3. `/story` displays session title and scene text; static Luna SVG and hotspots.

### Upload Digital Storybook

1. `/upload` — drag/drop, `analyzing` phase with three labeled steps, `ready` panel with mock title/scene/goal.
2. `continueToSetup` sets `source: "Upload"`, `sourceLabel` = filename.
3. `/setup` — **Upload Digital Storybook** copy, file name, editable extract.
4. `/story` — session text + Upload source label.

### Scan Physical Storybook

1. `/scan` — viewfinder, capture/retake, processing steps, ready panel.
2. `continueToSetup` sets `source: "Scan"`.
3. `/setup` — **Scan Physical Storybook** copy, editable extract.
4. Same reading/summary pattern as upload.

### Library (regression path)

1. `/library` → select story → `sourceLabel: "Sample library"` → `/setup` with library copy → back to `/library`.

---

## Supporting documentation

| File | Role |
|------|------|
| `README.md` | Overview, run instructions, structure |
| `reflection.md` | Build narrative, decisions, lessons |
| `project_notes.md` | Feature list and known limitations |
| `decisions.md` | Lovable, simulation, session ADRs |
| `development_plan.md` | Post-MP2 phases (types, persistence, real ingest) |

---

## Summary for reviewers

Story Companion is a **high-fidelity HCD prototype** with three believable input workflows, a full shared-reading interaction, and honest boundaries around simulated AI. It strongly supports **C1, C2, C7, and C8**; offers **bounded evidence** for **C3 and C5**; shows **API scaffolding only** for **C4**; and does **not** claim **C6** for this submission.
