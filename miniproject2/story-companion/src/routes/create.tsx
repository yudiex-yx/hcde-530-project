// Choose Story Input Method — three large cards: type, upload, scan.
// Sits between the landing/library and /setup so caregivers can adapt
// Story Companion to whatever picture book they actually have in hand.

import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Pencil, Upload, Camera, BookOpen, ArrowRight, Sparkles, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Breadcrumbs } from "@/components/story/Breadcrumbs";
import { loadSession, saveSession } from "@/lib/session";

export const Route = createFileRoute("/create")({
  head: () => ({
    meta: [
      { title: "Choose a story input method — Story Companion" },
      {
        name: "description",
        content:
          "Type a story, upload a digital storybook page, or scan a physical picture book to create a guided shared-reading moment.",
      },
    ],
  }),
  component: CreatePage,
});

type MethodKey = "manual" | "upload" | "scan";

interface Method {
  key: MethodKey;
  icon: typeof Pencil;
  title: string;
  blurb: string;
  cta: string;
  to: "/setup" | "/upload" | "/scan";
  badge?: string;
}

const METHODS: Method[] = [
  {
    key: "manual",
    icon: Pencil,
    title: "Quick story setup",
    blurb: "Type or paste a short story scene to create a guided reading moment.",
    cta: "Type a story",
    to: "/setup",
  },
  {
    key: "upload",
    icon: Upload,
    title: "Upload digital storybook",
    blurb: "Upload a digital storybook page, PDF, or screenshot to generate prompts.",
    cta: "Upload a page",
    to: "/upload",
    badge: "PDF · JPG · PNG",
  },
  {
    key: "scan",
    icon: Camera,
    title: "Scan physical storybook",
    blurb: "Use your camera to capture a real picture book page and turn it into a reading moment.",
    cta: "Open scanner",
    to: "/scan",
    badge: "Mobile-friendly",
  },
];

function CreatePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <header className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-6 py-6">
        <div className="flex flex-col gap-1">
          <Breadcrumbs items={[{ label: "New reading moment" }]} />
          <Link
            to="/"
            className="inline-flex w-fit items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" /> Back home
          </Link>
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
            Start a reading moment
          </div>
          <h1 className="mt-4 font-display text-4xl md:text-5xl">
            How would you like to bring a story in?
          </h1>
          <p className="mt-3 text-muted-foreground">
            Story Companion adapts to the picture book you already have — typed,
            uploaded from a screen, or scanned from a paper page.
          </p>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {METHODS.map((m) => (
            <article
              key={m.key}
              className="group flex flex-col rounded-3xl border border-border bg-card p-6 shadow-[var(--shadow-soft)] transition hover:-translate-y-0.5 hover:border-primary/40"
            >
              <div className="flex items-center justify-between">
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-primary/10 text-primary">
                  <m.icon className="h-5 w-5" />
                </div>
                {m.badge && (
                  <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-semibold text-muted-foreground">
                    {m.badge}
                  </span>
                )}
              </div>
              <h2 className="mt-5 font-display text-2xl leading-snug">{m.title}</h2>
              <p className="mt-2 flex-1 text-sm text-muted-foreground">{m.blurb}</p>
              <Button
                onClick={() => {
                  if (m.key === "manual") {
                    const current = loadSession();
                    saveSession({
                      ...current,
                      storyId: "luna",
                      storyTitle: "",
                      sceneText: "",
                      source: "Manual",
                      sourceLabel: "Quick story setup",
                      exploredHotspots: [],
                      usedPromptTypes: [],
                      savedPrompts: [],
                      guidedStep: 0,
                    });
                    navigate({ to: "/setup" });
                    return;
                  }
                  navigate({ to: m.to });
                }}
                className="mt-6 w-full rounded-full"
              >
                {m.cta} <ArrowRight className="h-4 w-4" />
              </Button>
            </article>
          ))}
        </div>

        <p className="mt-10 text-center text-sm text-muted-foreground">
          Or{" "}
          <Link to="/library" className="font-semibold text-foreground underline-offset-4 hover:underline">
            browse our sample story library
          </Link>{" "}
          to try the experience with curated picture books.
        </p>
      </main>
    </div>
  );
}
