# Story Companion

A shared-reading companion prototype for **caregivers** and **early childhood educators** working with children **ages 4–6**. Story Companion helps adults turn picture book pages into guided, developmentally meaningful read-aloud moments—not a children's game.

**Deployed prototype:** `[ADD YOUR DEPLOYED URL HERE]`

---

## HCD problem

Caregivers often want read-aloud time to be more interactive and meaningful, but they may not know what questions to ask or how to guide children beyond reading the text aloud. Story Companion supports the **adult reader** with structured prompts, in-the-moment toolkit tips, and post-reading reflection—while the child benefits from richer conversation.

---

## Target audience

- **Primary users:** Caregivers and educators (the person using the device).
- **Beneficiaries:** Children ages 4–6 listening during shared reading.

---

## Core features

### Three reading-input pathways

1. **Quick Story Setup** — Type or paste a title and scene (`/create` → `/setup`).
2. **Upload Digital Storybook** — Drag/drop PDF or image with a simulated processing flow (`/create` → `/upload` → `/setup`).
3. **Scan Physical Storybook** — Camera-style capture with simulated extraction (`/create` → `/scan` → `/setup`).

### Reading experience

- **Sample library** — Four curated stories with illustrated scenes (`/library`).
- **Setup** — Child age, reading goal, Explore vs Guided mode, editable title/scene, accessibility options.
- **Interactive scene** — Hotspots with prompts in five categories: Look, Feel, Imagine, Move, Talk (`/story`).
- **Caregiver support** — In-moment guide, reading toolkit, saved prompts.
- **Reflection** — Summary stats, suggested extensions, optional reflection notes (`/summary`).

### Prototype scope (important)

Upload and scan use **simulated extraction** (`src/lib/mock-extracted.ts`)—believable UX without real OCR or AI. Hotspots and scene illustrations come from four static sample stories in `src/lib/story-data.ts`. Session state persists in the browser via `localStorage`.

---

## Tech stack

| Layer | Technology |
|-------|------------|
| UI | React 19, TypeScript |
| Framework | TanStack Start, TanStack Router (file-based routes) |
| Styling | Tailwind CSS v4, shadcn/ui |
| Build | Vite 7 (`@lovable.dev/vite-tanstack-config`) |
| Session | Browser `localStorage` (`src/lib/session.ts`) |
| Origin | Prototype built in Lovable, extended in Cursor |

---

## Run locally

**Requirements:** Node.js 18+ (npm included).

```bash
cd story-companion
npm install
npm run dev
```

Open the URL printed in the terminal (typically `http://localhost:5173`).

**Other commands:**

```bash
npm run build    # production build
npm run preview  # preview production build
npm run lint     # ESLint
```

---

## Project structure

```text
story-companion/
├── README.md                 # This file
├── reflection.md             # MP2 reflection
├── mp2.md                    # Competency evidence (HCDE 530)
├── project_notes.md          # Current prototype status
├── development_plan.md       # Phased roadmap
├── decisions.md              # Design decision log
├── .cursorrules              # Agent/dev constraints
├── src/
│   ├── routes/               # Pages (one file per URL)
│   │   ├── index.tsx         # Landing (/)
│   │   ├── create.tsx        # Input method hub (/create)
│   │   ├── upload.tsx        # Upload flow (/upload)
│   │   ├── scan.tsx          # Scan flow (/scan)
│   │   ├── library.tsx       # Story library (/library)
│   │   ├── setup.tsx         # Reading setup (/setup)
│   │   ├── story.tsx         # Interactive reading (/story)
│   │   ├── summary.tsx       # Post-reading recap (/summary)
│   │   └── __root.tsx        # App shell
│   ├── components/
│   │   ├── story/            # Reading UI (scene, prompts, toolkit)
│   │   └── ui/               # shadcn primitives
│   ├── lib/
│   │   ├── story-data.ts     # Stories, hotspots, prompts (static)
│   │   ├── session.ts        # localStorage session
│   │   └── mock-extracted.ts # Simulated upload/scan extraction
│   ├── router.tsx
│   └── styles.css
└── package.json
```

---

## Primary user flows

```text
Library:     / → /library → /setup → /story → /summary
Quick setup: / → /create → /setup → /story → /summary
Upload:      / → /create → /upload → /setup → /story → /summary
Scan:        / → /create → /scan → /setup → /story → /summary
```

---

## Related documentation

- `reflection.md` — What was built, decisions, and lessons learned
- `mp2.md` — HCDE 530 competency mapping with codebase evidence
- `project_notes.md` — Known limitations and feature list
