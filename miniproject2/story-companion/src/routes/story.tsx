// Interactive story page — now story-aware.
// Pulls scene, hotspots, and guided order from STORIES[session.storyId].
// Adds completion state, clearer navigation, and tighter mode logic.

import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Check, Library as LibraryIcon, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StoryScene } from "@/components/story/StoryScene";
import { PromptCard } from "@/components/story/PromptCard";
import { CaregiverGuide } from "@/components/story/CaregiverGuide";
import { ReadingToolkit } from "@/components/story/ReadingToolkit";
import { SavedPromptsDrawer } from "@/components/story/SavedPromptsDrawer";
import { AccessibilityBar } from "@/components/story/AccessibilityBar";
import { Breadcrumbs } from "@/components/story/Breadcrumbs";
import {
  getStory, type Hotspot, type Prompt, type PromptType,
} from "@/lib/story-data";
import { loadSession, saveSession, type Session } from "@/lib/session";

export const Route = createFileRoute("/story")({
  head: () => ({
    meta: [
      { title: "Reading scene — Story Companion" },
      {
        name: "description",
        content:
          "Explore an illustrated scene with hotspots and gentle prompts for shared reading.",
      },
    ],
  }),
  component: StoryPage,
});

const TEXT_SIZE = { sm: "text-sm", md: "text-base", lg: "text-lg" } as const;

function StoryPage() {
  const navigate = useNavigate();
  const [session, setSession] = useState<Session>(() => loadSession());
  const [active, setActive] = useState<Hotspot | null>(null);
  const [promptIdx, setPromptIdx] = useState(0);

  // Active story config (scene, hotspots, guided order)
  const story = useMemo(() => getStory(session.storyId), [session.storyId]);
  const displayTitle = session.storyTitle || story.title;
  const displayScene = session.sceneText || story.scene;
  const hotspots = story.hotspots;
  const guidedOrder = story.guided;

  useEffect(() => { saveSession(session); }, [session]);

  // ---- Explore mode handlers ----
  const selectHotspot = (h: Hotspot) => {
    if (session.readingMode === "Guided") return; // guided controls progression
    setActive(h);
    setPromptIdx(0);
    setSession((s) => ({
      ...s,
      exploredHotspots: addUnique(s.exploredHotspots, h.id),
      usedPromptTypes: addUnique(s.usedPromptTypes, h.prompts[0].type),
    }));
  };

  const switchType = (t: PromptType) => {
    if (!active) return;
    const i = active.prompts.findIndex((p) => p.type === t);
    if (i >= 0) {
      setPromptIdx(i);
      setSession((s) => ({ ...s, usedPromptTypes: addUnique(s.usedPromptTypes, t) }));
    }
  };

  const nextPromptExplore = () => {
    if (!active) return;
    const next = (promptIdx + 1) % active.prompts.length;
    setPromptIdx(next);
    setSession((s) => ({
      ...s,
      usedPromptTypes: addUnique(s.usedPromptTypes, active.prompts[next].type),
    }));
  };

  // ---- Guided mode ----
  const guidedActive = useMemo(() => {
    if (session.readingMode !== "Guided") return null;
    const step = guidedOrder[session.guidedStep];
    if (!step) return null;
    const h = hotspots.find((x) => x.id === step.hotspotId);
    if (!h) return null;
    const idx = h.prompts.findIndex((p) => p.type === step.type);
    return { hotspot: h, promptIndex: Math.max(0, idx) };
  }, [session.readingMode, session.guidedStep, hotspots, guidedOrder]);

  // Sync guided state into active/promptIdx + tracking
  useEffect(() => {
    if (!guidedActive) return;
    setActive(guidedActive.hotspot);
    setPromptIdx(guidedActive.promptIndex);
    setSession((s) => ({
      ...s,
      exploredHotspots: addUnique(s.exploredHotspots, guidedActive.hotspot.id),
      usedPromptTypes: addUnique(
        s.usedPromptTypes,
        guidedActive.hotspot.prompts[guidedActive.promptIndex].type,
      ),
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session.guidedStep, session.readingMode, session.storyId]);

  const guidedNext = () => {
    if (session.guidedStep >= guidedOrder.length - 1) {
      navigate({ to: "/summary" });
      return;
    }
    setSession((s) => ({ ...s, guidedStep: s.guidedStep + 1 }));
  };
  const guidedPrev = () => {
    setSession((s) => ({ ...s, guidedStep: Math.max(0, s.guidedStep - 1) }));
  };

  // ---- Save prompt ----
  const savePrompt = (p: Prompt) => {
    if (!active) return;
    setSession((s) => {
      const exists = s.savedPrompts.some(
        (sp) => sp.hotspotId === active.id && sp.prompt === p.prompt,
      );
      if (exists) {
        return {
          ...s,
          savedPrompts: s.savedPrompts.filter(
            (sp) => !(sp.hotspotId === active.id && sp.prompt === p.prompt),
          ),
        };
      }
      return {
        ...s,
        savedPrompts: [
          ...s.savedPrompts,
          { hotspotId: active.id, prompt: p.prompt, type: p.type },
        ],
      };
    });
  };

  const isSaved = useMemo(() => {
    if (!active) return false;
    const p = active.prompts[promptIdx];
    return session.savedPrompts.some(
      (sp) => sp.hotspotId === active.id && sp.prompt === p.prompt,
    );
  }, [active, promptIdx, session.savedPrompts]);

  const finish = () => navigate({ to: "/summary" });
  const exploredCount = session.exploredHotspots.filter((id) =>
    hotspots.some((h) => h.id === id),
  ).length;
  const allExplored = exploredCount === hotspots.length;
  const sizeClass = TEXT_SIZE[session.a11y.textSize];

  return (
    <div className={`min-h-screen bg-background ${sizeClass}`}>
      <header className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-6 py-5">
        <div className="flex flex-col gap-1">
          <Breadcrumbs
            items={[
              { label: "Library", to: "/library" },
              { label: "Setup", to: "/setup" },
              { label: displayTitle },
            ]}
          />
          <Link
            to="/setup"
            className="inline-flex w-fit items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" /> Back to setup
          </Link>
        </div>
        <div className="flex items-center gap-2">
          <SavedPromptsDrawer saved={session.savedPrompts} />
          <AccessibilityBar
            value={session.a11y}
            onChange={(a11y) => setSession((s) => ({ ...s, a11y }))}
          />
          <Button onClick={finish} variant={allExplored ? "default" : "outline"} className="rounded-full">
            Finish reading
            <Check className="h-4 w-4" />
          </Button>
        </div>
      </header>

      <main className="mx-auto grid max-w-6xl gap-6 px-6 pb-16 lg:grid-cols-[1.5fr_1fr]">
        <div>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                Now reading · {session.readingMode} mode
              </p>
              <h1 className="mt-1 font-display text-3xl md:text-4xl">{displayTitle}</h1>
              <p className="mt-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/80">
                Generated from:{" "}
                <span className="text-foreground/80 normal-case tracking-normal">
                  {session.source === "Upload"
                    ? "Uploaded storybook"
                    : session.source === "Scan"
                    ? "Physical scan"
                    : "Manual setup"}
                </span>
              </p>
            </div>
            <ProgressTracker explored={exploredCount} total={hotspots.length} />
          </div>

          <p className="mt-3 max-w-prose text-muted-foreground">{displayScene}</p>

          <div className="mt-6">
            <StoryScene
              storyId={story.id}
              hotspots={hotspots}
              activeId={active?.id}
              exploredIds={session.exploredHotspots}
              onSelect={selectHotspot}
              reducedMotion={session.a11y.reducedMotion}
              lockedToId={
                session.readingMode === "Guided" && guidedActive
                  ? guidedActive.hotspot.id
                  : null
              }
            />
            <p className="mt-3 text-center text-xs text-muted-foreground">
              {session.readingMode === "Guided"
                ? "Use Next step to move through the scene at a calm pace."
                : "Tap any glowing dot to explore the scene together."}
            </p>
          </div>

          {/* Completion banner */}
          {allExplored && (
            <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-3xl border border-primary/30 bg-primary/5 p-5 animate-pop-in">
              <div className="flex items-start gap-3">
                <div className="grid h-9 w-9 place-items-center rounded-full bg-primary text-primary-foreground">
                  <Sparkles className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-display text-lg">You explored every corner of this scene.</p>
                  <p className="text-sm text-muted-foreground">
                    When you're ready, gather a few thoughts in the reflection summary.
                  </p>
                </div>
              </div>
              <Button onClick={finish} className="rounded-full">
                Finish reading <Check className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>

        <div className="space-y-5">
          {active ? (
            <PromptCard
              hotspot={active}
              promptIndex={promptIdx}
              onChangeType={switchType}
              onSave={savePrompt}
              onClose={() => {
                if (session.readingMode === "Guided") return;
                setActive(null);
              }}
              isSaved={isSaved}
              guided={
                session.readingMode === "Guided"
                  ? {
                      step: session.guidedStep,
                      total: guidedOrder.length,
                      onNext: guidedNext,
                      onPrev: guidedPrev,
                      isLast: session.guidedStep === guidedOrder.length - 1,
                    }
                  : undefined
              }
              onNext={session.readingMode === "Explore" ? nextPromptExplore : undefined}
            />
          ) : (
            <div className="rounded-3xl border border-dashed border-border bg-card/60 p-6 text-center">
              <p className="font-display text-xl">Pick a hotspot to begin</p>
              <p className="mt-2 text-sm text-muted-foreground">
                {hotspots.length} spots to explore in this scene.
              </p>
            </div>
          )}

          <CaregiverGuide goal={session.readingGoal} />
          <ReadingToolkit />

          <div className="flex flex-wrap gap-2 pt-1">
            <Button asChild variant="ghost" className="flex-1 rounded-full">
              <Link to="/library">
                <LibraryIcon className="h-4 w-4" /> Back to library
              </Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}

function ProgressTracker({ explored, total }: { explored: number; total: number }) {
  const pct = Math.round((explored / total) * 100);
  return (
    <div className="rounded-2xl border border-border bg-card px-3 py-2 text-xs">
      <p className="font-semibold text-muted-foreground">
        Explored {explored} / {total} hotspots
      </p>
      <div className="mt-1.5 h-1.5 w-36 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-primary transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

function addUnique<T>(arr: T[], v: T): T[] {
  return arr.includes(v) ? arr : [...arr, v];
}
