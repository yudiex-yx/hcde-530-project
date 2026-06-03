// Upload Digital Storybook flow.
// Caregivers drop a PDF/JPG/PNG of a storybook page. We simulate the
// "analyze illustration → detect interactive elements → generate prompts"
// pipeline with calm loading states, then write extracted text into the
// session and continue into the existing /setup → /story flow.

import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useRef, useState } from "react";
import {
  ArrowLeft, BookOpen, Upload, FileText, Image as ImageIcon, X,
  CheckCircle2, ArrowRight, Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Breadcrumbs } from "@/components/story/Breadcrumbs";
import { loadSession, saveSession } from "@/lib/session";
import { pickExtracted, type ExtractedStory } from "@/lib/mock-extracted";
import { getStory } from "@/lib/story-data";

export const Route = createFileRoute("/upload")({
  head: () => ({
    meta: [
      { title: "Upload a storybook page — Story Companion" },
      {
        name: "description",
        content:
          "Upload a digital storybook page, PDF, or screenshot to generate a guided shared-reading moment.",
      },
    ],
  }),
  component: UploadPage,
});

type Phase = "idle" | "analyzing" | "ready";

const STEPS = [
  "Analyzing story illustration…",
  "Detecting interactive elements…",
  "Generating caregiver prompts…",
];

function UploadPage() {
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const [phase, setPhase] = useState<Phase>("idle");
  const [stepIdx, setStepIdx] = useState(0);
  const [fileName, setFileName] = useState<string>("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [extracted, setExtracted] = useState<ExtractedStory | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const handleFile = (file: File) => {
    setFileName(file.name);
    // Make a quick local preview for images; PDFs get a placeholder.
    if (file.type.startsWith("image/")) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    } else {
      setPreviewUrl(null);
    }
    setPhase("analyzing");
    setStepIdx(0);

    // Simulated pipeline — three calm steps, then "extract" a mock story.
    let i = 0;
    const tick = () => {
      i += 1;
      if (i < STEPS.length) {
        setStepIdx(i);
        setTimeout(tick, 900);
      } else {
        setExtracted(pickExtracted(file.name));
        setPhase("ready");
      }
    };
    setTimeout(tick, 900);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files?.[0];
    if (f) handleFile(f);
  };

  const reset = () => {
    setPhase("idle");
    setFileName("");
    setPreviewUrl(null);
    setExtracted(null);
  };

  const continueToSetup = () => {
    if (!extracted) return;
    const current = loadSession();
    const story = getStory(extracted.storyId);
    saveSession({
      ...current,
      storyId: story.id,
      storyTitle: extracted.title,
      sceneText: extracted.scene,
      readingGoal: extracted.suggestedGoal,
      exploredHotspots: [],
      usedPromptTypes: [],
      savedPrompts: [],
      guidedStep: 0,
      source: "Upload",
      sourceLabel: fileName || "Uploaded page",
    });
    navigate({ to: "/setup" });
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="mx-auto flex max-w-4xl flex-wrap items-center justify-between gap-3 px-6 py-6">
        <div className="flex flex-col gap-1">
          <Breadcrumbs
            items={[
              { label: "New reading moment", to: "/create" },
              { label: "Upload storybook" },
            ]}
          />
          <Link
            to="/create"
            className="inline-flex w-fit items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" /> Choose another method
          </Link>
        </div>
        <Link to="/" className="flex items-center gap-2">
          <div className="grid h-8 w-8 place-items-center rounded-xl bg-primary text-primary-foreground">
            <BookOpen className="h-4 w-4" />
          </div>
          <span className="font-display font-semibold">Story Companion</span>
        </Link>
      </header>

      <main className="mx-auto max-w-4xl px-6 pb-20">
        <p className="text-xs font-bold uppercase tracking-widest text-primary">
          Upload digital storybook
        </p>
        <h1 className="mt-2 font-display text-4xl md:text-5xl">
          Bring a digital page into the moment
        </h1>
        <p className="mt-3 max-w-xl text-muted-foreground">
          Drop a storybook page, PDF, or screenshot. We'll gently extract the
          scene and suggest caregiver prompts you can adapt.
        </p>

        {phase === "idle" && (
          <div className="mt-8">
            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={onDrop}
              onClick={() => inputRef.current?.click()}
              role="button"
              tabIndex={0}
              className={`grid cursor-pointer place-items-center rounded-3xl border-2 border-dashed p-12 text-center transition ${
                dragOver
                  ? "border-primary bg-primary/5"
                  : "border-border bg-card/70 hover:border-primary/40"
              }`}
            >
              <div className="grid h-14 w-14 place-items-center rounded-2xl bg-primary/10 text-primary">
                <Upload className="h-6 w-6" />
              </div>
              <p className="mt-4 font-display text-xl">Drag a storybook page here</p>
              <p className="mt-1 text-sm text-muted-foreground">
                or click to choose a file from your device
              </p>
              <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs text-muted-foreground">
                <Chip icon={<FileText className="h-3 w-3" />} label="PDF" />
                <Chip icon={<ImageIcon className="h-3 w-3" />} label="JPG" />
                <Chip icon={<ImageIcon className="h-3 w-3" />} label="PNG" />
              </div>
              <input
                ref={inputRef}
                type="file"
                accept="image/*,application/pdf"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) handleFile(f);
                }}
              />
            </div>
          </div>
        )}

        {phase === "analyzing" && (
          <AnalyzingPanel
            fileName={fileName}
            previewUrl={previewUrl}
            stepIdx={stepIdx}
          />
        )}

        {phase === "ready" && extracted && (
          <ReadyPanel
            fileName={fileName}
            previewUrl={previewUrl}
            extracted={extracted}
            onReset={reset}
            onContinue={continueToSetup}
          />
        )}
      </main>
    </div>
  );
}

function Chip({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-1 font-semibold">
      {icon} {label}
    </span>
  );
}

function AnalyzingPanel({
  fileName, previewUrl, stepIdx,
}: { fileName: string; previewUrl: string | null; stepIdx: number }) {
  return (
    <div className="mt-8 grid gap-6 rounded-3xl border border-border bg-card p-6 shadow-[var(--shadow-soft)] md:grid-cols-[1fr_1.2fr] md:p-8">
      <PagePreview fileName={fileName} previewUrl={previewUrl} />
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-primary">
          Creating your reading moment…
        </p>
        <h2 className="mt-2 font-display text-2xl">A quiet moment of analysis</h2>
        <ul className="mt-5 space-y-3">
          {STEPS.map((s, i) => {
            const done = i < stepIdx;
            const active = i === stepIdx;
            return (
              <li key={s} className="flex items-center gap-3 text-sm">
                <span
                  className={`grid h-6 w-6 place-items-center rounded-full ${
                    done
                      ? "bg-primary text-primary-foreground"
                      : active
                      ? "bg-primary/10 text-primary"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {done ? <CheckCircle2 className="h-3.5 w-3.5" /> : <span className={active ? "h-2 w-2 rounded-full bg-primary animate-pulse" : "h-2 w-2 rounded-full bg-muted-foreground/40"} />}
                </span>
                <span className={done || active ? "text-foreground" : "text-muted-foreground"}>
                  {s}
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

function ReadyPanel({
  fileName, previewUrl, extracted, onReset, onContinue,
}: {
  fileName: string;
  previewUrl: string | null;
  extracted: ExtractedStory;
  onReset: () => void;
  onContinue: () => void;
}) {
  return (
    <div className="mt-8 grid gap-6 rounded-3xl border border-border bg-card p-6 shadow-[var(--shadow-soft)] md:grid-cols-[1fr_1.2fr] md:p-8">
      <PagePreview fileName={fileName} previewUrl={previewUrl} ready />
      <div>
        <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
          <Sparkles className="h-3.5 w-3.5" /> Reading moment ready
        </div>
        <h2 className="mt-3 font-display text-2xl leading-snug">{extracted.title}</h2>
        <p className="mt-2 text-sm text-muted-foreground">{extracted.scene}</p>

        <div className="mt-5 rounded-2xl border border-border bg-background/60 p-4">
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
            Smart suggestions
          </p>
          <p className="mt-2 text-sm">
            <span className="font-semibold">Suggested age:</span> {extracted.suggestedAge}
          </p>
          <p className="mt-1 text-sm">
            <span className="font-semibold">Recommended goal:</span> {extracted.suggestedGoal}
          </p>
          <p className="mt-2 text-xs font-semibold text-muted-foreground">This page may support</p>
          <div className="mt-1 flex flex-wrap gap-1.5">
            {extracted.supports.map((t) => (
              <span key={t} className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                ✓ {t}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          <Button onClick={onContinue} className="rounded-full">
            Continue to setup <ArrowRight className="h-4 w-4" />
          </Button>
          <Button onClick={onReset} variant="outline" className="rounded-full">
            <X className="h-4 w-4" /> Use a different page
          </Button>
        </div>
      </div>
    </div>
  );
}

function PagePreview({
  fileName, previewUrl, ready,
}: { fileName: string; previewUrl: string | null; ready?: boolean }) {
  return (
    <div>
      <div className="relative aspect-[3/4] overflow-hidden rounded-2xl border border-border bg-[var(--gradient-dawn)]">
        {previewUrl ? (
          <img
            src={previewUrl}
            alt="Uploaded storybook page"
            className={`h-full w-full object-cover ${ready ? "" : "animate-pulse"}`}
          />
        ) : (
          <div className="grid h-full place-items-center text-muted-foreground">
            <div className="text-center">
              <FileText className="mx-auto h-10 w-10" />
              <p className="mt-2 text-xs font-semibold">PDF preview</p>
            </div>
          </div>
        )}
        {!ready && (
          <div className="absolute inset-x-0 bottom-0 h-1 overflow-hidden bg-black/10">
            <div className="h-full w-1/3 animate-[pulse_1.4s_ease-in-out_infinite] bg-primary" />
          </div>
        )}
      </div>
      <p className="mt-2 truncate text-xs text-muted-foreground">{fileName}</p>
    </div>
  );
}
