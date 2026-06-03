# Story Companion — Development plan (MP2)

Phased plan for moving from Lovable prototype to demo-ready MP2. **Do not skip Phase 0** before large code changes.

---

## Phase 0: Documentation and repo hygiene

**Goals**

- Establish shared context for humans and agents.
- Avoid accidental edits to generated or product-critical files without a plan.

**Deliverables**

- [x] `.cursorrules` — agent constraints and file map
- [x] `project_notes.md` — current state and limitations
- [x] `development_plan.md` — this document
- [x] `decisions.md` — decision log
- [ ] Optional: root `README.md` with install/run (if team requests)
- [ ] Optional: `.env.example` for future API keys (no secrets committed)

**Files likely touched**

- Repo root docs only (no `src/` product changes in Phase 0 doc task).

**Out of scope**

- Feature implementation, UI redesign, backend deployment.

**Acceptance criteria**

- New contributor can read docs and understand routes, data location, and MP2 boundaries.
- Agents follow `.cursorrules` (no `routeTree.gen.ts` edits, plan before major changes).

---

## Phase 1: Clean domain model and types

**Goals**

- Separate **catalog story**, **reading moment**, and **session progress** concepts.
- Prepare for API and persistence without breaking prototype UX.

**Deliverables**

- `src/domain/` (or `src/types/`) with shared TypeScript types: `Prompt`, `Hotspot`, `StoryConfig`, `ReadingMoment`, `CaregiverSession`, etc.
- Zod schemas mirroring types for `createServerFn` validation.
- Thin re-exports from `story-data.ts` during migration (avoid big-bang rename).

**Files likely touched**

- New: `src/domain/*.ts`
- Refactor (small steps): `src/lib/story-data.ts`, consumers in `src/routes/story.tsx`, `src/lib/session.ts`

**Out of scope**

- Real OCR/LLM; database migrations.

**Acceptance criteria**

- Types are imported from one domain module; no duplicate interface definitions.
- Existing routes behave the same (manual QA on library → story → summary).

---

## Phase 2: Improve session persistence and reflection saving

**Goals**

- Survive refresh with full reading moment state including reflection notes.
- Introduce TanStack Query for session read/write where appropriate.

**Deliverables**

- Extend `Session` (or split `ReadingMoment` + `SessionProgress`) to include reflection fields.
- `saveSession` / `loadSession` updates OR `createServerFn` CRUD for sessions (choose one for MP2 demo).
- Summary page loads/saves reflection via session API or unified store.
- Optional: `resetSession` semantics documented for “replay story” vs “new moment”.

**Files likely touched**

- `src/lib/session.ts`
- `src/routes/summary.tsx`, `src/routes/setup.tsx`, `src/routes/story.tsx`
- New: `src/lib/api/session.functions.ts` (if server-backed)

**Out of scope**

- User accounts and cross-device sync (unless explicitly added).

**Acceptance criteria**

- Reflection text persists after refresh on summary.
- Replay clears interaction state but preserves story choice (current behavior, verified).

---

## Phase 3: Real upload/scan ingestion prototype

**Goals**

- Show the **actual uploaded/scanned image** on the story page.
- Support **dynamic hotspot placement** (manual or semi-automated) instead of only SVG library scenes.
- Keep AI optional — may use placeholder regions or editor UI.

**Deliverables**

- Store page image (blob URL for demo, or server storage path).
- `StoryScene` mode: image background + percent hotspots (reuse positioning model).
- Upload/scan flows attach `imageUrl` + hotspot list to session (not only `storyId` from mock pool).
- Deprecate or gate mock `pickExtracted` mapping when real ingest path exists.

**Files likely touched**

- `src/routes/upload.tsx`, `src/routes/scan.tsx`
- `src/components/story/StoryScene.tsx`
- `src/lib/session.ts`, `src/lib/mock-extracted.ts` (narrow or replace)
- New: `src/lib/ingest/` client helpers

**Out of scope**

- Production-grade vision API; multi-page books.

**Acceptance criteria**

- User can upload/scan an image and see **that image** during `/story`.
- At least one hotspot can be defined and tapped on the real image (manual placement acceptable for MP2).

---

## Phase 4: Optional AI/OCR integration

**Goals**

- Replace simulated analysis steps with a real pipeline stub or provider integration.
- Generate scene text and caregiver prompts from page content.

**Deliverables**

- `createServerFn` `ingestPage` (image in → structured `ReadingMoment` out).
- Server: storage upload, OCR/vision call, LLM prompt generation with Zod-validated output.
- Error and loading states in upload/scan routes.
- Environment variables documented in `.env.example`.

**Files likely touched**

- New: `src/lib/api/ingest.functions.ts`, `src/lib/services/` (server-only)
- `src/routes/upload.tsx`, `src/routes/scan.tsx`
- Remove or feature-flag `mock-extracted.ts` for production path

**Out of scope**

- Fine-tuned child-facing chat; unbounded LLM conversation.

**Acceptance criteria**

- Upload/scan produces **new** scene copy and hotspot suggestions not limited to four library `storyId`s.
- Failures show caregiver-friendly errors (no silent fallback to wrong story without indication).

---

## Phase 5: Polish, accessibility, and demo preparation

**Goals**

- MP2 demo is reliable, accessible, and explainable to reviewers.

**Deliverables**

- Keyboard focus order on hotspots and prompt card; ARIA audit on guided mode.
- `reducedMotion` respected globally; review animation usage.
- Resolve or document placeholder features (audio narration).
- Demo script: library path + upload path + guided mode + summary.
- Lint clean; build passes; known limitations listed in `project_notes.md`.

**Files likely touched**

- `src/components/story/*`, `src/routes/*`, `src/styles.css`
- Docs: `project_notes.md`, `decisions.md`

**Out of scope**

- Full production launch (auth, billing, analytics platform).

**Acceptance criteria**

- `npm run build` succeeds.
- Demo flows complete without console errors on happy path.
- Accessibility checklist completed for story and summary pages.

---

## How to use this plan

1. Pick the **lowest incomplete phase**.
2. Post a short implementation plan (files + behavior) before large edits — per `.cursorrules`.
3. Log decisions that change scope or architecture in `decisions.md`.
4. Update `project_notes.md` when limitations are resolved.

---

## Dependency overview

```
Phase 0 (docs)
    ↓
Phase 1 (types) ──────────────────────────┐
    ↓                                     │
Phase 2 (session/reflection)              │
    ↓                                     │
Phase 3 (image + dynamic hotspots) ←──────┘
    ↓
Phase 4 (AI/OCR) [optional for MP2 demo]
    ↓
Phase 5 (polish + demo)
```

Phase 4 can be deferred for MP2 if Phase 3 uses manual hotspots on real images.
