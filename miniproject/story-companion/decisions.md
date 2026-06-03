# Story Companion — Decision log

Lightweight ADR-style log. Add new entries at the **top** with date and status.

**Statuses:** `accepted` | `proposed` | `superseded` | `deprecated`

---

## Template (copy for new entries)

```markdown
### YYYY-MM-DD — Title

**Status:** proposed | accepted | superseded  
**Context:** …  
**Decision:** …  
**Consequences:** …
```

---

## 2026-06-03 — Lovable for visual prototype

**Status:** accepted  
**Context:** MP2 needed a caregiver-first UI with custom illustration style, multiple flows (library, upload, scan, reading), and fast iteration on layout and copy.  
**Decision:** Build the interactive prototype in **Lovable**, using the TanStack Start TypeScript template, then export to this repository.  
**Consequences:**

- Strong visual and UX baseline in `src/routes/` and `src/components/story/`.
- Lovable-specific Vite config (`@lovable.dev/vite-tanstack-config`) must be preserved; duplicate plugins break the app (see `vite.config.ts` comments).
- Some scaffolding (example `createServerFn`, SSR wrappers) comes with the template.

---

## 2026-06-03 — Cursor for logic and backend iteration

**Status:** accepted  
**Context:** After export, the team needs typed refactors, session persistence, ingestion APIs, and agent-assisted development without redesigning every screen in Lovable.  
**Decision:** Use **Cursor** as the primary IDE for MP2 implementation, with `.cursorrules` and root docs defining scope and constraints.  
**Consequences:**

- Product changes happen in this repo with reviewable diffs.
- Agents should read `project_notes.md` and `development_plan.md` before large edits.
- Visual tweaks should stay aligned with existing Tailwind tokens unless explicitly requested.

---

## 2026-06-03 — Upload and scan remain simulated for current MP2 scope

**Status:** accepted  
**Context:** Real OCR/vision/LLM requires API keys, cost controls, storage, and validation — high risk for an early MP2 milestone. The prototype must still **demonstrate** caregiver flows end-to-end.  
**Decision:** Keep upload (`/upload`) and scan (`/scan`) as **simulated pipelines**:

- Three-step “analysis” UI for expectations setting.
- `pickExtracted()` in `src/lib/mock-extracted.ts` selects from a fixed pool.
- Extracted results map to existing `storyId` in `src/lib/story-data.ts` for hotspots and SVG scenes.

**Consequences:**

- Demo clearly shows ingest **UX** but not true page understanding.
- `project_notes.md` must list this limitation for reviewers.
- Phase 3+ in `development_plan.md` replaces simulation incrementally.

---

## 2026-06-03 — Story content centralized in `story-data.ts`

**Status:** accepted  
**Context:** Four library stories with hotspots, prompts, guided sequences, toolkit, and extensions needed one source of truth for the prototype.  
**Decision:** Store catalog and per-story config in **`src/lib/story-data.ts`**; session holds runtime progress in **`src/lib/session.ts`**.  
**Consequences:**

- Easy to demo consistent quality prompts.
- Hard to support arbitrary user books until Phase 3–4.
- Phase 1 should extract domain types without splitting content across many files prematurely.

---

## 2026-06-03 — Session persistence via localStorage

**Status:** accepted  
**Context:** MP2 prototype must survive refresh during a reading session without standing up a database.  
**Decision:** Use browser **`localStorage`** key `story-companion-session` with `loadSession` / `saveSession` helpers.  
**Consequences:**

- No cross-device sync; clearing site data resets progress.
- Phase 2 may add server persistence or extend the same shape via TanStack Query.
- Reflection text on summary is **not** in session yet — known gap for Phase 2.

---

## 2026-06-03 — Do not hand-edit `routeTree.gen.ts`

**Status:** accepted  
**Context:** TanStack Router generates the route tree from files in `src/routes/`.  
**Decision:** Treat `src/routeTree.gen.ts` as **generated only**; add routes by creating/editing route files, not the gen file.  
**Consequences:**

- Documented in `.cursorrules`, `src/routes/README.md`, and agent instructions.
- Lint/format may exclude this file if needed.

---

## 2026-06-03 — What “real implementation” requires later

**Status:** accepted (reference)  
**Context:** Stakeholders may ask when upload/scan and prompts become “real.”  
**Decision:** Defer **real implementation** until these capabilities exist (see `development_plan.md` Phases 3–4):

| Capability | Purpose |
|------------|---------|
| Object storage | Persist uploaded/scanned page images |
| Ingest API (`createServerFn` or REST) | Accept image, return job result |
| OCR / vision | Extract text and region candidates from page |
| LLM prompt generation | Caregiver prompts by age, reading goal, and scene content |
| Structured output validation | Zod schemas for hotspots and prompts |
| Data store | Reading moments, sessions, optional user accounts |
| Hotspot UI on real image | Percent or bbox coords over user image, not only SVG library art |
| Error handling | Failed ingest, timeouts, unsupported files |
| Privacy review | Child-adjacent data, retention, COPPA-aware design if accounts added |

**Consequences:**

- Current MP2 demo should label simulated steps honestly in presentation, not only in code comments.
- Mock module `mock-extracted.ts` should be feature-flagged or removed when ingest API ships.

---

## 2026-06-03 — Caregiver-first product framing

**Status:** accepted  
**Context:** HCD problem focuses on adults who lack question strategies during read-aloud.  
**Decision:** All primary UX (setup, prompts, toolkit, guide) addresses **caregivers/educators**; children benefit indirectly.  
**Consequences:**

- Copy and metrics on summary target adult reflection (“what the child noticed”).
- Not positioned as a child self-serve app in marketing or IA.
