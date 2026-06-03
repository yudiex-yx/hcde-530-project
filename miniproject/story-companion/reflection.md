# Story Companion — MP2 Reflection

HCDE 530 · Story Companion · Shared-reading companion prototype

---

## 1. What did you build?

I built **Story Companion**, a deployed, high-fidelity functional web prototype that supports caregivers and early childhood educators during picture book read-alouds with children ages 4–6.

The tool includes:

- A **landing page** that introduces the product and routes users into either a sample **library** or a **create** hub for bringing their own material.
- **Three reading-input pathways** aligned with real caregiver behavior:
  - **Quick Story Setup** for typing or pasting a title and scene.
  - **Upload Digital Storybook** for PDF/image upload with a believable multi-step processing experience.
  - **Scan Physical Storybook** for camera-style capture and review before setup.
- A shared **setup** flow where adults choose child age, reading goal, and **Explore** or **Guided** mode, and edit the title and scene text that will appear during reading.
- An **interactive reading screen** with illustrated scenes, clickable hotspots, and caregiver-facing prompts organized as Look, Feel, Imagine, Move, and Talk.
- **In-moment support** through a caregiver guide, reading toolkit, saved prompts, and accessibility toggles.
- A **summary** screen with engagement highlights, suggested extension activities, and optional reflection fields.

Technically, the prototype is a React + TypeScript application exported from Lovable and refined in Cursor, using TanStack Start/Router, static story content in `story-data.ts`, browser `localStorage` for session continuity, and **simulated** extraction for upload/scan—not production OCR or generative AI.

---

## 2. What decisions did you make?

**Caregiver-first framing.** The interface, copy, and tools address the adult conducting the read-aloud. Children benefit indirectly through better questions and pacing, but the product is not designed as a child-facing game.

**Prototype fidelity over backend complexity.** Upload and scan show realistic loading states and extracted fields, but extraction is mocked (`mock-extracted.ts`) and maps to existing sample stories for hotspots and visuals. This let me test workflow and interaction design without API cost, privacy risk, or unreliable vision output during MP2.

**Lovable for visual velocity, Cursor for flow logic.** Lovable produced a cohesive visual system and route structure quickly. Cursor supported smaller, reviewable changes—session carry-through, source-specific setup copy, and documentation—without a large refactor.

**Static content + session overlay.** Four fully authored stories in `story-data.ts` ensure consistent prompt quality. `session.ts` stores the caregiver’s title, scene text, goals, mode, progress, and input source so the reading experience reflects what they configured.

**Honest scope communication.** Project docs (`project_notes.md`, `decisions.md`) record limitations (no real image analysis, reflection not persisted, SVG scenes vs uploaded pages) so reviewers can evaluate the prototype as interaction design evidence, not as a shipped AI product.

---

## 3. What would you do differently?

**Earlier separation of “moment content” vs “catalog template.”** Title and scene text now flow from session into the story page, but hotspots still bind to `storyId`. I would formalize a `ReadingMoment` shape earlier to avoid mismatches between extracted text and illustration.

**Persist reflection and ingest metadata.** Summary reflection fields reset on refresh; upload/scan filenames and captures are not stored long-term. For a field study, I would persist reflection in session or a lightweight backend.

**Pilot with caregivers sooner.** The five prompt types and toolkit tips are design hypotheses. Observing real read-alouds would clarify which prompts feel natural vs burdensome.

**Label simulated steps more explicitly in the UI.** The processing copy implies analysis; a short “demo extraction” note for evaluators would reduce confusion without changing the visual design.

**Defer non-essential infrastructure.** TanStack Query and example `createServerFn` scaffolding are present but unused. I would either wire a minimal server function for session save or remove unused paths to reduce cognitive load for future contributors.

---

## 4. What does this work demonstrate?

This work demonstrates **human-centered design for a real caregiver problem**: making shared reading more interactive when adults lack strategies for what to ask or do beyond reading words on a page.

It shows ability to:

- **Translate HCD intent into a multi-step product** with distinct entry paths, setup, core experience, and reflection.
- **Prototype complex workflows** (upload, scan, guided sequencing) without claiming unbuilt AI capabilities.
- **Iterate in code** on session behavior and source-specific setup while preserving a consistent visual language.
- **Document tradeoffs** so technical and design reviewers can assess what is real vs simulated.

Story Companion is not a production literacy platform. It is a **credible, deployable demonstration** of how a caregiver-facing companion could scaffold observation, emotion talk, imagination, movement, and discussion during picture book reading—and a foundation for later ingestion, persistence, and evaluation work.
