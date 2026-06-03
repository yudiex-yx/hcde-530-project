// Reflection summary — story-aware recap and clear next steps.

import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Sparkles, BookOpen, Heart, ArrowRight, Library as LibraryIcon, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  getStory, PROMPT_META, EXTENSIONS, type PromptType,
} from "@/lib/story-data";
import { loadSession, saveSession, type Session } from "@/lib/session";
import { StoryExtensions } from "@/components/story/StoryExtensions";
import { Breadcrumbs } from "@/components/story/Breadcrumbs";

export const Route = createFileRoute("/summary")({
  head: () => ({
    meta: [
      { title: "Reading moment summary — Story Companion" },
      {
        name: "description",
        content:
          "A gentle recap of the shared-reading moment, with space to note what the child noticed, wondered, and expressed.",
      },
    ],
  }),
  component: Summary,
});

function pickHighlight(used: PromptType[]) {
  if (used.includes("Feel")) return "named feelings in the scene";
  if (used.includes("Imagine")) return "wondered beyond the page";
  if (used.includes("Talk")) return "shared their own words";
  if (used.includes("Move")) return "joined in with their body";
  if (used.includes("Look")) return "noticed small details";
  return "settled into a quiet shared moment";
}

function suggestNext(used: PromptType[]) {
  if (!used.includes("Move")) return EXTENSIONS.find((e) => e.kind === "Pretend")!;
  if (!used.includes("Imagine")) return EXTENSIONS.find((e) => e.kind === "Draw")!;
  if (!used.includes("Talk")) return EXTENSIONS.find((e) => e.kind === "Talk")!;
  return EXTENSIONS.find((e) => e.kind === "Explore")!;
}

function Summary() {
  const navigate = useNavigate();
  const [session, setSession] = useState<Session>(() => loadSession());
  const [reflection, setReflection] = useState({ noticed: "", wondered: "", expressed: "", note: "" });

  useEffect(() => { setSession(loadSession()); }, []);

  const story = useMemo(() => getStory(session.storyId), [session.storyId]);
  const displayTitle = session.storyTitle || story.title;
  const hotspots = story.hotspots;
  const exploredHotspots = hotspots.filter((h) => session.exploredHotspots.includes(h.id));
  const highlight = useMemo(() => pickHighlight(session.usedPromptTypes), [session.usedPromptTypes]);
  const next = useMemo(() => suggestNext(session.usedPromptTypes), [session.usedPromptTypes]);

  const replayStory = () => {
    // Keep the story choice, reset only interactions.
    const cleared: Session = {
      ...session,
      exploredHotspots: [],
      usedPromptTypes: [],
      savedPrompts: [],
      guidedStep: 0,
    };
    saveSession(cleared);
    navigate({ to: "/story" });
  };

  const handleNote = (v: string) => {
    setReflection((r) => ({ ...r, note: v }));
    // (Reflection text is intentionally local-only for this prototype.)
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="mx-auto flex max-w-3xl flex-wrap items-center justify-between gap-3 px-6 py-6">
        <div className="flex flex-col gap-1">
          <Breadcrumbs
            items={[
              { label: "Library", to: "/library" },
              { label: displayTitle, to: "/story" },
              { label: "Summary" },
            ]}
          />
        </div>
        <Link to="/" className="flex items-center gap-2">
          <div className="grid h-8 w-8 place-items-center rounded-xl bg-primary text-primary-foreground">
            <BookOpen className="h-4 w-4" />
          </div>
          <span className="font-display font-semibold">Story Companion</span>
        </Link>
      </header>

      <main className="mx-auto max-w-3xl px-6 pb-20">
        <div className="text-center">
          <div className="mx-auto inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            <Sparkles className="h-3.5 w-3.5" /> Reading moment complete
          </div>
          <h1 className="mt-4 font-display text-4xl md:text-5xl">
            What a thoughtful read.
          </h1>
          <p className="mt-3 text-muted-foreground">
            Together you {highlight}. Small moments like this matter more than they feel like they do.
          </p>
        </div>

        {/* Stats */}
        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          <StatCard label="Story" value={displayTitle} />
          <StatCard label="Hotspots explored" value={`${exploredHotspots.length} / ${hotspots.length}`} />
          <StatCard label="Reading goal" value={session.readingGoal} />
        </div>

        {/* Engagement */}
        <section className="mt-10 rounded-3xl border border-border bg-card p-6 shadow-[var(--shadow-soft)]">
          <h2 className="font-display text-2xl">Engagement highlights</h2>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl bg-secondary/40 p-4">
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                Hotspots explored
              </p>
              {exploredHotspots.length === 0 ? (
                <p className="mt-2 text-sm text-muted-foreground">
                  None this time — that's okay too.
                </p>
              ) : (
                <ul className="mt-3 flex flex-wrap gap-1.5">
                  {exploredHotspots.map((h) => (
                    <li
                      key={h.id}
                      className="rounded-full bg-card px-2.5 py-0.5 text-xs font-semibold text-foreground"
                    >
                      {h.label}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="rounded-2xl bg-secondary/40 p-4">
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                Prompt categories used
              </p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {session.usedPromptTypes.length === 0 ? (
                  <span className="text-sm text-muted-foreground">None yet.</span>
                ) : (
                  session.usedPromptTypes.map((t) => {
                    const M = PROMPT_META[t];
                    const I = M.icon;
                    return (
                      <span
                        key={t}
                        className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold"
                        style={{
                          background: `color-mix(in oklab, var(--${M.color}) 22%, transparent)`,
                          color: `var(--${M.color})`,
                        }}
                      >
                        <I className="h-3 w-3" />
                        {M.label}
                      </span>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          {session.savedPrompts.length > 0 && (
            <>
              <h3 className="mt-6 font-display text-lg">Saved prompts</h3>
              <ul className="mt-3 space-y-2">
                {session.savedPrompts.map((sp, i) => (
                  <li
                    key={i}
                    className="rounded-2xl border border-border bg-background/50 p-3 text-sm"
                  >
                    <span className="font-semibold text-foreground">{sp.type}:</span>{" "}
                    <span className="text-muted-foreground">{sp.prompt}</span>
                  </li>
                ))}
              </ul>
            </>
          )}
        </section>

        {/* Suggested next */}
        <section className="mt-6 rounded-3xl border border-primary/30 bg-primary/5 p-6">
          <p className="text-xs font-bold uppercase tracking-widest text-primary">
            Suggested next activity
          </p>
          {(() => {
            const NextIcon = next.icon;
            return (
              <div className="mt-2 flex items-start gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-2xl bg-primary text-primary-foreground">
                  <NextIcon className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-display text-xl">{next.title}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{next.description}</p>
                </div>
              </div>
            );
          })()}
        </section>

        {/* Reflection notes */}
        <section className="mt-6 rounded-3xl border border-border bg-card p-6 shadow-[var(--shadow-soft)]">
          <div className="flex items-center gap-2">
            <Heart className="h-4 w-4 text-primary" />
            <h2 className="font-display text-2xl">A small reflection</h2>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Optional — a few words help future you remember today.
          </p>
          <div className="mt-4 grid gap-4">
            {(["noticed", "wondered", "expressed"] as const).map((k) => (
              <div key={k} className="space-y-1.5">
                <Label htmlFor={k}>The child {k}…</Label>
                <Textarea
                  id={k}
                  rows={2}
                  value={reflection[k]}
                  onChange={(e) => setReflection((r) => ({ ...r, [k]: e.target.value }))}
                  className="rounded-xl"
                />
              </div>
            ))}
            <div className="space-y-1.5">
              <Label htmlFor="note">Caregiver note</Label>
              <Textarea
                id="note"
                rows={2}
                placeholder="Anything you want to remember about this reading moment…"
                value={reflection.note}
                onChange={(e) => handleNote(e.target.value)}
                className="rounded-xl"
              />
            </div>
          </div>
        </section>

        {/* Full extension grid for revisit */}
        <div className="mt-6">
          <StoryExtensions />
        </div>

        {/* Clear next-step navigation */}
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button asChild variant="ghost" className="rounded-full">
            <Link to="/story">Back to story</Link>
          </Button>
          <Button onClick={replayStory} variant="outline" className="rounded-full">
            <RotateCcw className="h-4 w-4" /> Replay this story
          </Button>
          <Button asChild className="rounded-full">
            <Link to="/library">
              <LibraryIcon className="h-4 w-4" /> Read another story <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </main>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-3xl border border-border bg-card p-4 shadow-[var(--shadow-soft)]">
      <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
        {label}
      </p>
      <p className="mt-1 font-display text-xl text-foreground line-clamp-2">{value}</p>
    </div>
  );
}
