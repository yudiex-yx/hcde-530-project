// Story setup — caregiver onboarding for the currently selected story.
// Pre-fills from session (chosen from /library) and clarifies the
// reading-mode decision before entering the scene.

import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, BookOpen, Compass, Footprints, ArrowRight, Pencil, Upload, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  READING_GOALS, type ReadingGoal, type ReadingMode, getStory,
} from "@/lib/story-data";
import { loadSession, saveSession } from "@/lib/session";
import { AccessibilityBar } from "@/components/story/AccessibilityBar";
import { Breadcrumbs } from "@/components/story/Breadcrumbs";

export const Route = createFileRoute("/setup")({
  head: () => ({
    meta: [
      { title: "Story setup — Story Companion" },
      {
        name: "description",
        content:
          "Set up a shared-reading moment: choose age, reading goal, and an Explore or Guided reading mode.",
      },
    ],
  }),
  component: Setup,
});

function Setup() {
  const initial = loadSession();
  const navigate = useNavigate();
  const story = getStory(initial.storyId);
  const [title, setTitle] = useState(
    initial.sourceLabel === "Quick story setup"
      ? initial.storyTitle
      : initial.storyTitle || story.title,
  );
  const [age, setAge] = useState<string>(String(initial.childAge));
  const [goal, setGoal] = useState<ReadingGoal>(initial.readingGoal);
  const [mode, setMode] = useState<ReadingMode>(initial.readingMode);
  const [scene, setScene] = useState(
    initial.sourceLabel === "Quick story setup"
      ? initial.sceneText
      : initial.sceneText || story.scene,
  );
  const [a11y, setA11y] = useState(initial.a11y);
  const isQuickSetup = initial.sourceLabel === "Quick story setup";
  const isLibrary = initial.sourceLabel === "Sample library";
  const isUpload = initial.source === "Upload";
  const isScan = initial.source === "Scan";
  const fromCreate = isQuickSetup || isUpload || isScan;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    saveSession({
      ...initial,
      storyTitle: title || story.title,
      childAge: Number(age) as 4 | 5 | 6,
      readingGoal: goal,
      readingMode: mode,
      sceneText: scene || story.scene,
      exploredHotspots: [],
      usedPromptTypes: [],
      savedPrompts: [],
      guidedStep: 0,
      a11y,
    });
    navigate({ to: "/story" });
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="mx-auto flex max-w-3xl flex-wrap items-center justify-between gap-3 px-6 py-6">
        <div className="flex flex-col gap-1">
          <Breadcrumbs
            items={
              fromCreate
                ? [
                    { label: "New reading moment", to: "/create" },
                    { label: "Setup" },
                  ]
                : [
                    { label: "Library", to: "/library" },
                    { label: "Setup" },
                  ]
            }
          />
          <Link
            to={fromCreate ? "/create" : "/library"}
            className="inline-flex w-fit items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />{" "}
            {fromCreate ? "Back to create" : "Back to library"}
          </Link>
        </div>
        <div className="flex items-center gap-3">
          <AccessibilityBar value={a11y} onChange={setA11y} />
          <Link to="/" className="flex items-center gap-2">
            <div className="grid h-8 w-8 place-items-center rounded-xl bg-primary text-primary-foreground">
              <BookOpen className="h-4 w-4" />
            </div>
            <span className="font-display font-semibold">Story Companion</span>
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-6 py-6 md:py-12">
        {isQuickSetup ? (
          <>
            <p className="text-xs font-bold uppercase tracking-widest text-primary">
              Quick story setup · Step 2 of 3
            </p>
            <h1 className="mt-2 font-display text-4xl md:text-5xl">Quick Story Setup</h1>
            <p className="mt-3 text-muted-foreground">Type or paste your story.</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Enter a title and scene below — this is what you&apos;ll read aloud on the next screen.
            </p>
          </>
        ) : isUpload ? (
          <>
            <p className="text-xs font-bold uppercase tracking-widest text-primary">
              Upload digital storybook · Step 3 of 4
            </p>
            <h1 className="mt-2 font-display text-4xl md:text-5xl">Upload Digital Storybook</h1>
            <p className="mt-3 text-muted-foreground">
              Review what we found on your page. You can edit anything below.
            </p>
            {initial.sourceLabel && (
              <p className="mt-2 text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">File:</span> {initial.sourceLabel}
              </p>
            )}
          </>
        ) : isScan ? (
          <>
            <p className="text-xs font-bold uppercase tracking-widest text-primary">
              Scan physical storybook · Step 3 of 4
            </p>
            <h1 className="mt-2 font-display text-4xl md:text-5xl">Scan Physical Storybook</h1>
            <p className="mt-3 text-muted-foreground">
              Review the captured story page. You can edit anything below.
            </p>
            {initial.sourceLabel && (
              <p className="mt-2 text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">Capture:</span> {initial.sourceLabel}
              </p>
            )}
          </>
        ) : (
          <>
            <p className="text-xs font-bold uppercase tracking-widest text-primary">
              Step 2 of 4 · Reading setup
            </p>
            <h1 className="mt-2 font-display text-4xl md:text-5xl">Set up your reading moment</h1>
            <p className="mt-3 text-muted-foreground">
              You&apos;re about to read <span className="font-semibold text-foreground">{title}</span>.
              A few quick choices help shape the prompts.
            </p>
          </>
        )}
        <SourceBadge source={initial.source} label={isLibrary ? initial.sourceLabel : undefined} />

        <form
          onSubmit={submit}
          className="mt-8 space-y-6 rounded-3xl border border-border bg-card p-6 md:p-8 shadow-[var(--shadow-soft)]"
        >
          <div className="space-y-2">
            <Label htmlFor="title">Story title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={
                isQuickSetup
                  ? "e.g. My Picture Book Page"
                  : isUpload
                    ? "Extracted title — edit if needed"
                    : isScan
                      ? "Extracted title — edit if needed"
                      : undefined
              }
              className="rounded-xl"
            />
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Child age</Label>
              <Select value={age} onValueChange={setAge}>
                <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {[4, 5, 6].map((a) => (
                    <SelectItem key={a} value={String(a)}>{a} years old</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Reading goal</Label>
              <Select value={goal} onValueChange={(v) => setGoal(v as ReadingGoal)}>
                <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {READING_GOALS.map((g) => (
                    <SelectItem key={g} value={g}>{g}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Reading mode selector */}
          <div className="space-y-2">
            <Label>Reading mode</Label>
            <div className="grid gap-3 sm:grid-cols-2">
              <ModeCard
                active={mode === "Explore"}
                onClick={() => setMode("Explore")}
                icon={<Compass className="h-4 w-4" />}
                title="Explore Mode"
                desc="Free hotspot exploration — pick what catches the child's curiosity."
              />
              <ModeCard
                active={mode === "Guided"}
                onClick={() => setMode("Guided")}
                icon={<Footprints className="h-4 w-4" />}
                title="Guided Reading"
                desc="A paced step-by-step sequence of prompts across the scene."
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="scene">Scene description</Label>
            <Textarea
              id="scene"
              value={scene}
              onChange={(e) => setScene(e.target.value)}
              rows={4}
              placeholder={
                isQuickSetup
                  ? "Paste or type the scene you'll read together…"
                  : isUpload || isScan
                    ? "Extracted scene text — edit if needed"
                    : undefined
              }
              className="rounded-xl"
            />
            <p className="text-xs text-muted-foreground">
              {isQuickSetup
                ? "This text appears on the reading screen for you to read aloud."
                : isUpload || isScan
                  ? "Adjust the scene before you begin reading."
                  : "Edit if you'd like to tailor what the caregiver reads aloud first."}
            </p>
          </div>

          <Button type="submit" size="lg" className="w-full rounded-full text-base">
            Begin reading moment <ArrowRight className="h-4 w-4" />
          </Button>
        </form>
      </main>
    </div>
  );
}

function ModeCard({
  active, onClick, icon, title, desc,
}: {
  active: boolean; onClick: () => void; icon: React.ReactNode; title: string; desc: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-2xl border p-4 text-left transition ${
        active
          ? "border-primary bg-primary/5 shadow-[var(--shadow-soft)]"
          : "border-border bg-background/40 hover:border-primary/40"
      }`}
      aria-pressed={active}
    >
      <div className="flex items-center gap-2">
        <span className={`grid h-7 w-7 place-items-center rounded-full ${active ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
          {icon}
        </span>
        <span className="font-display text-lg">{title}</span>
      </div>
      <p className="mt-2 text-sm text-muted-foreground">{desc}</p>
    </button>
  );
}

// Small "Generated from" pill so caregivers see where this reading moment
// originated (typed, uploaded file, camera scan).
function SourceBadge({
  source, label,
}: {
  source: "Manual" | "Upload" | "Scan";
  label?: string;
}) {
  const map = {
    Manual: { icon: Pencil, text: "Manual setup" },
    Upload: { icon: Upload, text: "Uploaded storybook" },
    Scan: { icon: Camera, text: "Physical scan" },
  } as const;
  const { icon: Icon, text } = map[source];
  return (
    <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-border bg-card/70 px-3 py-1 text-xs font-semibold text-muted-foreground">
      <Icon className="h-3.5 w-3.5 text-primary" />
      Generated from: <span className="text-foreground">{text}</span>
      {label && <span className="text-muted-foreground/70">· {label}</span>}
    </div>
  );
}
