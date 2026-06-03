// Scan Physical Storybook flow — mobile-first camera UX.
// We simulate a viewfinder, "capture", preview confirmation, and a calm
// processing transition. Real camera access is optional: if available we
// show a live <video> stream; otherwise a warm placeholder viewfinder.

import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft, BookOpen, Camera, RefreshCw, ArrowRight, Sparkles,
  CheckCircle2, X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Breadcrumbs } from "@/components/story/Breadcrumbs";
import { loadSession, saveSession } from "@/lib/session";
import { pickExtracted, type ExtractedStory } from "@/lib/mock-extracted";
import { getStory } from "@/lib/story-data";

export const Route = createFileRoute("/scan")({
  head: () => ({
    meta: [
      { title: "Scan a storybook page — Story Companion" },
      {
        name: "description",
        content:
          "Use your camera to capture a physical picture book page and create a guided shared-reading moment.",
      },
    ],
  }),
  component: ScanPage,
});

type Phase = "viewfinder" | "captured" | "processing" | "ready";

const STEPS = [
  "Analyzing story illustration…",
  "Detecting interactive elements…",
  "Generating caregiver prompts…",
];

function ScanPage() {
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [phase, setPhase] = useState<Phase>("viewfinder");
  const [capturedUrl, setCapturedUrl] = useState<string | null>(null);
  const [stepIdx, setStepIdx] = useState(0);
  const [extracted, setExtracted] = useState<ExtractedStory | null>(null);
  const [cameraReady, setCameraReady] = useState(false);

  // Try to attach the user's camera; gracefully fail to placeholder.
  useEffect(() => {
    let stream: MediaStream | null = null;
    if (phase !== "viewfinder") return;
    if (typeof navigator === "undefined" || !navigator.mediaDevices?.getUserMedia) return;
    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: "environment" }, audio: false })
      .then((s) => {
        stream = s;
        if (videoRef.current) {
          videoRef.current.srcObject = s;
          setCameraReady(true);
        }
      })
      .catch(() => setCameraReady(false));
    return () => {
      stream?.getTracks().forEach((t) => t.stop());
    };
  }, [phase]);

  const capture = () => {
    // If we have a live video stream, snap a frame to a canvas.
    if (videoRef.current && cameraReady) {
      const v = videoRef.current;
      const canvas = document.createElement("canvas");
      canvas.width = v.videoWidth || 640;
      canvas.height = v.videoHeight || 480;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(v, 0, 0, canvas.width, canvas.height);
        setCapturedUrl(canvas.toDataURL("image/jpeg", 0.85));
      }
    } else {
      // Placeholder: trigger native file picker with camera capture hint.
      fileRef.current?.click();
      return;
    }
    setPhase("captured");
  };

  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setCapturedUrl(URL.createObjectURL(f));
    setPhase("captured");
  };

  const retake = () => {
    setCapturedUrl(null);
    setPhase("viewfinder");
  };

  const generate = () => {
    setPhase("processing");
    setStepIdx(0);
    let i = 0;
    const tick = () => {
      i += 1;
      if (i < STEPS.length) {
        setStepIdx(i);
        setTimeout(tick, 900);
      } else {
        setExtracted(pickExtracted(capturedUrl ?? "scan"));
        setPhase("ready");
      }
    };
    setTimeout(tick, 900);
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
      source: "Scan",
      sourceLabel: "Camera capture",
    });
    navigate({ to: "/setup" });
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="mx-auto flex max-w-3xl flex-wrap items-center justify-between gap-3 px-6 py-6">
        <div className="flex flex-col gap-1">
          <Breadcrumbs
            items={[
              { label: "New reading moment", to: "/create" },
              { label: "Scan storybook" },
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

      <main className="mx-auto max-w-3xl px-6 pb-20">
        <p className="text-xs font-bold uppercase tracking-widest text-primary">
          Scan physical storybook
        </p>
        <h1 className="mt-2 font-display text-4xl md:text-5xl">
          Capture a real picture book page
        </h1>
        <p className="mt-3 max-w-xl text-muted-foreground">
          Frame the open page inside the guides. Soft, even light works best.
        </p>

        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={onFile}
        />

        {/* Viewfinder */}
        {phase === "viewfinder" && (
          <div className="mt-8">
            <div className="relative mx-auto aspect-[3/4] w-full max-w-md overflow-hidden rounded-3xl border border-border bg-black shadow-[var(--shadow-soft)]">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className={`h-full w-full object-cover ${cameraReady ? "" : "hidden"}`}
              />
              {!cameraReady && (
                <div className="absolute inset-0 grid place-items-center bg-[var(--gradient-night)] text-white/80">
                  <div className="text-center">
                    <Camera className="mx-auto h-10 w-10 opacity-80" />
                    <p className="mt-2 text-sm">Camera preview</p>
                    <p className="text-xs opacity-70">Tap capture to open your device camera</p>
                  </div>
                </div>
              )}
              {/* Framing corners */}
              <FramingGuides />
            </div>

            <div className="mt-6 flex flex-col items-center gap-2">
              <Button
                onClick={capture}
                size="lg"
                className="h-16 w-16 rounded-full p-0 shadow-[var(--shadow-soft)]"
                aria-label="Capture page"
              >
                <Camera className="h-6 w-6" />
              </Button>
              <p className="text-xs text-muted-foreground">Capture page</p>
            </div>
          </div>
        )}

        {/* Captured preview */}
        {phase === "captured" && capturedUrl && (
          <div className="mt-8 rounded-3xl border border-border bg-card p-5 shadow-[var(--shadow-soft)] md:p-6">
            <div className="relative mx-auto aspect-[3/4] w-full max-w-md overflow-hidden rounded-2xl border border-border">
              <img src={capturedUrl} alt="Scanned page" className="h-full w-full object-cover" />
            </div>
            <p className="mt-4 text-center text-sm text-muted-foreground">
              Looks good? We'll turn this page into a guided reading moment.
            </p>
            <div className="mt-5 flex flex-wrap justify-center gap-2">
              <Button onClick={generate} className="rounded-full">
                Generate reading moment <ArrowRight className="h-4 w-4" />
              </Button>
              <Button onClick={retake} variant="outline" className="rounded-full">
                <RefreshCw className="h-4 w-4" /> Retake
              </Button>
            </div>
          </div>
        )}

        {/* Processing */}
        {phase === "processing" && capturedUrl && (
          <div className="mt-8 rounded-3xl border border-border bg-card p-6 shadow-[var(--shadow-soft)] md:p-8">
            <div className="grid gap-6 md:grid-cols-[1fr_1.2fr]">
              <div className="relative mx-auto aspect-[3/4] w-full max-w-xs overflow-hidden rounded-2xl border border-border">
                <img src={capturedUrl} alt="Scanned page" className="h-full w-full object-cover opacity-80" />
                <div className="absolute inset-x-0 bottom-0 h-1 overflow-hidden bg-black/10">
                  <div className="h-full w-1/3 animate-[pulse_1.4s_ease-in-out_infinite] bg-primary" />
                </div>
              </div>
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
          </div>
        )}

        {/* Ready */}
        {phase === "ready" && extracted && capturedUrl && (
          <div className="mt-8 rounded-3xl border border-border bg-card p-6 shadow-[var(--shadow-soft)] md:p-8">
            <div className="grid gap-6 md:grid-cols-[1fr_1.2fr]">
              <div className="relative mx-auto aspect-[3/4] w-full max-w-xs overflow-hidden rounded-2xl border border-border">
                <img src={capturedUrl} alt="Scanned page" className="h-full w-full object-cover" />
              </div>
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
                  <Button onClick={continueToSetup} className="rounded-full">
                    Continue to setup <ArrowRight className="h-4 w-4" />
                  </Button>
                  <Button onClick={retake} variant="outline" className="rounded-full">
                    <X className="h-4 w-4" /> Scan another page
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function FramingGuides() {
  const cornerCls =
    "absolute h-8 w-8 border-white/80";
  return (
    <div className="pointer-events-none absolute inset-6">
      <div className={`${cornerCls} left-0 top-0 border-l-2 border-t-2 rounded-tl-xl`} />
      <div className={`${cornerCls} right-0 top-0 border-r-2 border-t-2 rounded-tr-xl`} />
      <div className={`${cornerCls} bottom-0 left-0 border-b-2 border-l-2 rounded-bl-xl`} />
      <div className={`${cornerCls} bottom-0 right-0 border-b-2 border-r-2 rounded-br-xl`} />
    </div>
  );
}
