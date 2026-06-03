// Story Library — every story is now interactive and openable.
// Caregiver picks a story → setup → reading. Selected story is highlighted
// so the user always knows which story they're about to set up.

import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { BookOpen, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LIBRARY, getStory, type LibraryStory } from "@/lib/story-data";
import { LibraryCover } from "@/components/story/LibraryCover";
import { loadSession, saveSession } from "@/lib/session";
import { Breadcrumbs } from "@/components/story/Breadcrumbs";
import { useState } from "react";

export const Route = createFileRoute("/library")({
  head: () => ({
    meta: [
      { title: "Story Library — Story Companion" },
      {
        name: "description",
        content:
          "Browse sample picture-book stories with age range and reading focus, and start a guided or exploratory shared-reading moment.",
      },
    ],
  }),
  component: LibraryPage,
});

function LibraryPage() {
  const navigate = useNavigate();
  const initial = loadSession();
  const [selectedId, setSelectedId] = useState<string>(initial.storyId);

  const choose = (s: LibraryStory) => {
    const current = loadSession();
    const story = getStory(s.id);
    saveSession({
      ...current,
      storyId: s.id,
      storyTitle: s.title,
      sceneText: story.scene,
      exploredHotspots: [],
      usedPromptTypes: [],
      savedPrompts: [],
      guidedStep: 0,
      source: "Manual",
      sourceLabel: "Sample library",
    });
    navigate({ to: "/setup" });
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-6 py-6">
        <div className="flex flex-col gap-1">
          <Breadcrumbs items={[{ label: "Library" }]} />
        </div>
        <Link to="/" className="flex items-center gap-2">
          <div className="grid h-8 w-8 place-items-center rounded-xl bg-primary text-primary-foreground">
            <BookOpen className="h-4 w-4" />
          </div>
          <span className="font-display font-semibold">Story Companion</span>
        </Link>
      </header>

      <main className="mx-auto max-w-6xl px-6 pb-20">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/70 px-3 py-1 text-xs font-semibold text-muted-foreground">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            Story library · step 1 of 4
          </div>
          <h1 className="mt-4 font-display text-4xl md:text-5xl">
            Choose a story to read together
          </h1>
          <p className="mt-3 text-muted-foreground">
            Each story is paired with caregiver prompts, gentle hotspots, and
            extension activities for after reading. All four stories are
            interactive in this prototype.
          </p>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-2">
          {LIBRARY.map((s) => {
            const selected = selectedId === s.id;
            const hotspotCount = getStory(s.id).hotspots.length;
            return (
              <article
                key={s.id}
                onMouseEnter={() => setSelectedId(s.id)}
                className={`group flex flex-col overflow-hidden rounded-3xl border bg-card shadow-[var(--shadow-soft)] transition hover:-translate-y-0.5 ${
                  selected ? "border-primary ring-2 ring-primary/20" : "border-border"
                }`}
              >
                <LibraryCover variant={s.cover} />
                <div className="flex flex-1 flex-col gap-3 p-5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-secondary px-2.5 py-0.5 text-xs font-semibold text-secondary-foreground">
                      {s.ageRange}
                    </span>
                    <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                      {s.focus}
                    </span>
                    <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-semibold text-muted-foreground">
                      {hotspotCount} hotspots
                    </span>
                  </div>
                  <h2 className="font-display text-2xl leading-snug">{s.title}</h2>
                  <p className="text-sm text-muted-foreground">{s.description}</p>
                  <div className="mt-auto pt-2">
                    <Button
                      onClick={() => choose(s)}
                      className="w-full rounded-full"
                    >
                      Start this story <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </main>
    </div>
  );
}
