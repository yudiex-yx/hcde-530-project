# Story Companion — Project notes (MP2)

Living document for product concept, prototype status, and known gaps. Update as phases complete.

---

## Product concept

Story Companion turns picture book pages into **playful, guided shared-reading moments** for adults reading with children ages 4–6.

- **Caregiver-first:** Prompts, toolkit tips, and setup flows speak to the adult reader.
- **Five prompt categories:** Look, Feel, Imagine, Move, Talk — each with optional follow-up and “try together” actions.
- **Two reading modes:** Explore (free hotspot exploration) and Guided (paced sequence across hotspots).
- **Inputs:** Sample library, typed/pasted scene (manual setup), simulated upload (PDF/image), simulated camera scan.
- **After reading:** Summary recap, saved prompts, suggested extensions, optional reflection fields.

---

## Completed prototype features

### Marketing & navigation

- Landing page (`/`) with feature overview and CTAs to library and create flow.
- Global shell: meta/OG tags, 404, error UI (`src/routes/__root.tsx`).

### Story library

- Four curated sample stories with covers, age range, reading focus (`src/routes/library.tsx`).
- Selecting a story writes session and navigates to setup.

### Bring-your-own entry

- Create hub (`/create`): manual setup, upload, or scan.
- Upload (`/upload`): drag/drop, image preview, three-step “analysis” animation, mock extraction panel.
- Scan (`/scan`): viewfinder (camera when available), capture/retake, same mock pipeline.

### Reading setup

- Setup (`/setup`): title, child age (4–6), reading goal, Explore vs Guided mode, editable scene text, accessibility bar, source badge (Manual / Upload / Scan).

### Interactive reading

- Story page (`/story`): SVG scene per `storyId`, percent-positioned hotspots, prompt card with category tabs, save prompts drawer, caregiver guide, reading toolkit, progress tracker, completion banner.

### Reflection

- Summary (`/summary`): engagement stats, saved prompts, suggested next activity, reflection textareas (local UI state only), extension grid, replay / library navigation.

### Data & session

- Static content in `src/lib/story-data.ts` (library metadata, per-story hotspots, prompts, guided order, toolkit, extensions).
- Session in `localStorage` (`src/lib/session.ts`): story choice, goals, mode, explored hotspots, used prompt types, saved prompts, guided step, a11y settings, source metadata.
- Mock extraction pool in `src/lib/mock-extracted.ts` for upload/scan.

### Infrastructure (scaffold)

- TanStack Start app with SSR entry (`src/server.ts`, `src/start.ts`).
- Example `createServerFn` in `src/lib/api/example.functions.ts` (not used by product routes yet).

---

## Routing model

TanStack Router **file-based routing**: one route file per URL under `src/routes/`. See `src/routes/README.md` for conventions.

**Do not edit** `src/routeTree.gen.ts` — generated from route files.

### Primary user flows

```
Library path:
  / → /library → /setup → /story → /summary

Bring-your-own path:
  / → /create → /upload OR /scan → /setup → /story → /summary

Manual quick path:
  / → /create → /setup → /story → /summary
```

### Route responsibilities

| Route | Role |
|-------|------|
| `index.tsx` | Landing |
| `library.tsx` | Choose sample story |
| `create.tsx` | Choose input method |
| `upload.tsx` | Digital page ingest (simulated) |
| `scan.tsx` | Camera capture ingest (simulated) |
| `setup.tsx` | Caregiver onboarding for reading moment |
| `story.tsx` | Hotspot + prompt experience |
| `summary.tsx` | Post-reading recap |

---

## Data model (current)

Defined primarily in `src/lib/story-data.ts`:

- **`LibraryStory`** — catalog card (id, title, ageRange, focus, cover variant).
- **`StoryConfig`** — scene text, `hotspots[]`, `guided[]` sequence, `recommendedGoal`.
- **`Hotspot`** — id, label, x/y (%), `prompts[]`.
- **`Prompt`** — type (Look/Feel/Imagine/Move/Talk), prompt text, optional followUp, action.
- **`Session`** (`src/lib/session.ts`) — runtime state for one reading moment.

Upload/scan produce **`ExtractedStory`** (`mock-extracted.ts`) that points at an existing `storyId` for hotspot reuse — not net-new content from the image.

---

## Known limitations

1. **Upload/scan do not analyze images** — `pickExtracted()` hashes filename/seed and picks from a fixed pool; hotspots always come from `STORIES[storyId]`.
2. **Scenes are SVG illustrations** — not the user’s uploaded/scanned page as the reading canvas.
3. **Title/scene text can disagree with visuals** after upload/scan (extracted copy vs library artwork).
4. **Reflection notes on summary are not persisted** — only in component state; lost on refresh.
5. **React Query is configured but unused** for story/session data.
6. **No auth, no multi-user library, no cloud sync.**
7. **Manual create → setup** does not run a dedicated “paste story” ingest step; defaults lean on prior session or Luna sample.
8. **Audio narration toggle** is a placeholder in accessibility settings.

---

## Next-step priorities

Aligned with `development_plan.md`:

1. **Phase 0 (done/in progress):** Repo documentation — `.cursorrules`, this file, `development_plan.md`, `decisions.md`.
2. **Phase 1:** Extract domain types/schemas from `story-data.ts`; clarify `ReadingMoment` vs catalog `Story`.
3. **Phase 2:** Persist session + reflection (server or structured client store via TanStack Query).
4. **Phase 3:** Ingestion prototype — real image display + hotspot overlay pipeline (may still stub AI).
5. **Phase 4:** Optional OCR/LLM for text and prompt generation.
6. **Phase 5:** Accessibility pass, demo hardening, error states.

---

## Design decisions already made

| Decision | Notes |
|----------|--------|
| Caregiver as primary user | UI copy, toolkit, and guide panels target adults. |
| Five prompt types | Consistent taxonomy with color tokens in `styles.css`. |
| Explore vs Guided modes | Guided locks hotspot progression and uses `guided[]` order per story. |
| Percent-based hotspots | x/y on scene container; works with SVG backdrops. |
| Source provenance | Session `source` + badge on setup/story (Manual, Upload, Scan). |
| Calm, warm visual language | Gradients, rounded cards, soft motion; preserve unless asked to redesign. |
| localStorage session | Simple prototype persistence across refresh within one browser. |
| Four library stories | All interactive with full hotspot sets in `STORIES`. |
| Simulated ingest UX | Three-step loading copy sets caregiver expectations for future AI pipeline. |

---

## Related docs

- `development_plan.md` — phased implementation plan
- `decisions.md` — decision log
- `.cursorrules` — agent working constraints
