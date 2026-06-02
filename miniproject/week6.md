# Week 6 — Mini Project 2 Competency Claim

This document relates my **MP2 interactive storybook** (*Whispering Woods* — Milo the mouse and Pip the sparrow) to the eight HCDE 530 competency domains. MP2 is a mobile-first web storybook for children ages 6–12 with a core loop of **read → choose at a branch → see a different ending**, implemented in `mp2-interactive-storybook/` with HTML, CSS, vanilla JavaScript, and a data-driven `story/story.json`.

---

## C1: Vibecoding and rapid prototyping

This project demonstrates **C1 (Vibecoding and rapid prototyping)** because I described the product I wanted in plain language—audience, tone, interactivity goals, and art direction—and deployed a working prototype from that description without writing most of the code by hand. In Cursor, I answered setup questions (web storybook, playful UI, placeholder adventure in the Whispering Woods, AI art later) and the agent scaffolded `index.html`, `css/styles.css`, `js/app.js`, and `story/story.json` in one session. After professor feedback to prioritize **story-first branching** over stretch features (read-aloud, hotspots, mini-games), I narrowed v1 to three scenes—map → fork → two endings—and kept a working demo I could preview locally with `python3 -m http.server 8080`. That cycle—describe intent, ship a testable branch, refine scope from feedback—is rapid prototyping in practice: the app runs end-to-end before polish, and deferred features are documented in `decisions.md` rather than blocking the core demo.

---

## C2: Code Reading

This project demonstrates **C2 (Code reading)** because I can read and explain what the story router in `js/app.js` does in normal language, not just run it. For example, `loadStory()` uses `fetch("story/story.json")` to load the narrative as JSON; `getScene(sceneId)` looks up one scene object and throws if the id is missing; `renderScene(sceneId)` builds HTML for the chapter label, illustration, paragraphs, and choice buttons, then attaches click handlers that call `renderScene(nextId)` so the story advances. I understand why `escapeHtml()` exists (user-facing text must not become raw HTML), why the branch at Scene 2 sets a different choices hint (“What should Milo and Pip do?”), and why the README warns that opening `index.html` via `file://` fails—browsers block `fetch` without a local server. I can trace a user click from a button’s `data-next` attribute through to the next scene’s content in `story.json`, which means I am reading code as a map of behavior, not as opaque syntax.

---

## C3: Data handling

This project demonstrates **C3 (Data handling)** in the sense of **structuring and consuming data** for the application, even though MP2 uses JSON and JavaScript rather than pandas. All copy, scene ids, image paths, and branching links live in `story/story.json` as a single source of truth: each scene has `id`, `chapter`, `heading`, `image`, `imageAlt`, `paragraphs`, and a `choices` array where each choice has `id`, `label`, and `next`. Separating content from presentation lets me edit the story without touching layout code—adding a paragraph or renaming a choice is a data change, not a refactor of `app.js`. I treat missing or invalid data explicitly: `getScene()` errors on unknown ids, and `init()` catches load failures and shows a readable error pointing to the README. That mirrors MP1’s mindset (clean tables, expected nulls) applied to narrative data: the graph of scenes must stay consistent so every `next` pointer resolves to a real scene.

---

## C4: API use

This project demonstrates **C4 (API use)** through asynchronous data retrieval with the **`fetch` API**. On startup, `loadStory()` requests `story/story.json`, checks `response.ok`, and parses JSON— the same request/response pattern as calling a remote REST API, except the “API” is a static file served over HTTP (which is why local preview requires a small server). I handle failure modes (`Could not load story`, network or 404) instead of assuming success. For v2, `decisions.md` notes planned use of external services (e.g., TTS providers for read-aloud), which would extend this competency to real third-party APIs with keys, rate limits, and reliability tradeoffs on GitHub Pages. Even in v1, separating **load data → validate → render** is the same architectural habit as MP1’s PokéAPI pull: the app’s behavior depends on structured data arriving from outside the UI layer.

---

## C5: Visualization

This project demonstrates **C5 (Visualization)** because the experience is **visually designed for young readers**, not only text on a page. Each scene pairs narrative with a full-width illustration (`scene__image`), chapter label, and large touch-friendly choice buttons (`choice-btn`) sized for phones and tablets. Placeholder SVGs in `assets/images/` stand in for future AI illustrations guided by `assets/STYLE_PROMPT.md` (cozy watercolor storybook look). The fork scene makes the branch **visible**: two paths in the artwork align with two labeled buttons so children see the decision before they tap. CSS choices—readable type, spacing, primary vs. secondary button styles for “Read the story again”—support comprehension the way a labeled chart supports analysis in MP1: the layout encodes what matters (story text, image, then action). When I replace placeholders with final art, the same JSON `image` fields update the visuals without changing routing logic.

---

## C6: ML evaluation

This project demonstrates **C6 (ML evaluation)** in a **planned, tool-assisted creative pipeline** rather than a numeric model benchmark. MP2’s art direction relies on **AI image generation** with a fixed style prompt (`assets/STYLE_PROMPT.md`) so illustrations stay consistent across scenes; evaluating those outputs means judging whether each image matches the scene description, age-appropriate tone, and accessibility (`imageAlt` text for screen readers). I treat generated art like model output: keep what works, regenerate or edit what doesn’t, and document style constraints so results stay on-brand. Read-aloud v2 may use **TTS APIs** (also ML-backed); choosing a voice that feels warm and playful—not distracting—requires listening and comparing outputs, similar to interpreting whether an ML prediction is good enough to ship. MP2 therefore connects ML evaluation to **human-centered quality gates** for media children will see and hear, not only to accuracy scores.

---

## C7: Critical evaluation and professional judgment

This project demonstrates **C7 (Critical evaluation and professional judgment)** because I scoped and shipped a tool for a **real HCD problem**: helping children ages 6–12 engage with a branching story on devices they already use. Professor feedback drove a deliberate tradeoff—**nail the branch point first** (read → choose → story responds) and defer audio, hotspots, puzzles, and progress stars to v2 so the demo proves the core interaction in class. I locked product decisions in `decisions.md` (audience, platform, story-first v1, GitHub Pages hosting) and logged rationale in `project_notes.md` so future sessions do not reopen settled questions. I judge success by whether a child can complete both paths at the fork and understand that their choice changed the ending, not by feature count. That is professional judgment: fewer features, clearer learning and portfolio story.

---

## C8: Building and deploying a complete tool

This project demonstrates **C8 (Building and deploying a complete tool)** because MP2 is a **complete, deployable web application**, not a code snippet—and I describe it in **HCD terms**, not only technical ones. The deliverable is an interactive storybook where narrative choice matters; technically it is HTML/CSS/JS plus JSON, but the value proposition is **agency and delight for young readers** (Milo and Pip’s adventure, two endings, “Read the story again”). The repo includes README setup steps, local preview instructions, project structure, and a path to **GitHub Pages** for a public demo URL. Documentation (`.cursorrules`, `decisions.md`, `project_notes.md`) preserves how the tool was built and what comes next, so instructors and portfolio viewers see both the artifact and the human-centered reasoning. Deploying a complete tool here means someone can open the link, tap through the fork, and experience the design intent without reading the codebase.

---

## Summary

| Domain | MP2 evidence (short) |
|--------|----------------------|
| **C1** | Described storybook in Cursor; working 3-scene branch prototype after scope trim |
| **C2** | Can explain `app.js` load → render → choice routing and why `fetch` needs a server |
| **C3** | Data-driven `story.json`; consistent scene graph; content edits without code changes |
| **C4** | `fetch` + JSON load/error handling; same pattern as external APIs in v2 TTS |
| **C5** | Scene illustrations, mobile layout, accessible alt text, choice UI at the fork |
| **C6** | AI art style prompt + planned TTS; evaluate outputs for child-appropriate quality |
| **C7** | Story-first scope from HCD feedback; audience 6–12; decisions logged |
| **C8** | End-to-end web storybook + docs + Pages path; value framed as reader experience |

Together, MP2 shows I can move from a spoken product vision to a deployed interactive experience, read and maintain the code that powers it, and justify each technical choice in terms of children’s reading and choosing—not just because the JavaScript runs.
