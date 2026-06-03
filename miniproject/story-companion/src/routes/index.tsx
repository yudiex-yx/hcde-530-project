// Landing page — warm, inviting entry to Story Companion.
import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import {
  BookOpen, Sparkles, Heart, Eye, Activity, MessageCircle, Library,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Story Companion — Playful shared-reading moments" },
      {
        name: "description",
        content:
          "A cozy companion tool for caregivers and early childhood educators to turn picture book pages into meaningful, interactive read-aloud moments.",
      },
      { property: "og:title", content: "Story Companion" },
      {
        property: "og:description",
        content: "Turn any picture book page into playful shared-reading moments.",
      },
    ],
  }),
  component: Landing,
});

const FEATURES = [
  { icon: Eye, label: "Look", desc: "Notice details together" },
  { icon: Heart, label: "Feel", desc: "Name emotions in the scene" },
  { icon: Sparkles, label: "Imagine", desc: "Wonder beyond the page" },
  { icon: Activity, label: "Move", desc: "Small body-based activities" },
  { icon: MessageCircle, label: "Talk", desc: "Open-ended conversation" },
];

function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <div className="pointer-events-none absolute right-0 top-0 h-96 w-96 rounded-full bg-[var(--gradient-dawn)] opacity-60 blur-3xl" />

      <header className="relative mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <div className="flex items-center gap-2">
          <div className="grid h-9 w-9 place-items-center rounded-2xl bg-primary text-primary-foreground shadow-[var(--shadow-soft)]">
            <BookOpen className="h-4 w-4" />
          </div>
          <span className="font-display text-xl font-semibold">Story Companion</span>
        </div>
        <nav className="flex items-center gap-5 text-sm font-semibold text-muted-foreground">
          <Link to="/library" className="hover:text-foreground">Library</Link>
          <Link to="/create" className="hover:text-foreground">Start →</Link>
        </nav>
      </header>

      <main className="relative mx-auto max-w-6xl px-6 pb-24">
        <section className="grid items-center gap-12 pt-12 md:grid-cols-[1.1fr_0.9fr] md:pt-20">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/70 px-3 py-1 text-xs font-semibold text-muted-foreground">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              For caregivers & early childhood educators
            </div>
            <h1 className="mt-5 font-display text-5xl font-semibold leading-[1.05] text-foreground md:text-7xl">
              Turn any picture book page into{" "}
              <span className="italic text-primary">playful</span> shared-reading moments.
            </h1>
            <p className="mt-6 max-w-xl text-lg text-muted-foreground">
              A calm, caregiver-first companion for shared reading with children
              ages 4–6 — built around observation, imagination, emotional
              reflection, and small real-world activities.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="rounded-full px-7 text-base shadow-[var(--shadow-soft)]">
                <Link to="/create">
                  <Sparkles className="h-4 w-4" />
                  Start a reading moment
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="rounded-full px-7 text-base">
                <Link to="/library">
                  <Library className="h-4 w-4" />
                  Browse the library
                </Link>
              </Button>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-4 rounded-[2.5rem] bg-[var(--gradient-night)] opacity-30 blur-2xl" />
            <div className="relative overflow-hidden rounded-[2rem] border border-border bg-card p-6 shadow-[var(--shadow-soft)]">
              <div className="relative aspect-square rounded-3xl bg-[var(--gradient-night)]">
                <svg viewBox="0 0 200 200" className="absolute inset-0 h-full w-full">
                  {[[30,40],[60,20],[120,35],[160,25],[180,70],[40,90],[150,90]].map(([x,y],i)=>(
                    <circle key={i} cx={x} cy={y} r="1.5" fill="white" className="animate-twinkle" style={{animationDelay:`${i*0.4}s`}}/>
                  ))}
                  <circle cx="150" cy="60" r="22" fill="oklch(0.95 0.04 90)" className="animate-float" />
                  <circle cx="145" cy="55" r="3" fill="oklch(0.85 0.04 90)" opacity="0.4" />
                  <g transform="translate(60,140)">
                    <rect x="-6" y="20" width="12" height="40" fill="oklch(0.32 0.04 30)" rx="3" />
                    <circle r="32" fill="oklch(0.5 0.12 245)" />
                    <circle cx="-18" cy="10" r="22" fill="oklch(0.55 0.11 240)" />
                    <circle cx="18" cy="12" r="20" fill="oklch(0.45 0.13 250)" />
                  </g>
                </svg>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <p className="font-display text-lg">Luna and the Lost Moon Button</p>
                <span className="rounded-full bg-secondary px-2.5 py-0.5 text-xs font-semibold text-secondary-foreground">
                  Sample
                </span>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-24">
          <p className="text-center text-sm font-semibold uppercase tracking-widest text-muted-foreground">
            Five gentle ways to wonder together
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 md:grid-cols-5">
            {FEATURES.map((f) => (
              <div
                key={f.label}
                className="rounded-3xl border border-border bg-card p-5 transition hover:-translate-y-1 hover:shadow-[var(--shadow-soft)]"
              >
                <div
                  className="grid h-10 w-10 place-items-center rounded-2xl"
                  style={{
                    background: `color-mix(in oklab, var(--${f.label.toLowerCase()}) 22%, transparent)`,
                    color: `var(--${f.label.toLowerCase()})`,
                  }}
                >
                  <f.icon className="h-5 w-5" />
                </div>
                <p className="mt-3 font-display text-lg">{f.label}</p>
                <p className="text-sm text-muted-foreground">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-20 rounded-3xl border border-border bg-card/70 p-8 md:p-12">
          <div className="grid items-center gap-8 md:grid-cols-[1fr_auto]">
            <div>
              <h2 className="font-display text-3xl md:text-4xl">
                Designed for caregivers, with the child as the beneficiary.
              </h2>
              <p className="mt-3 text-muted-foreground">
                Story Companion is not a children's game. It supports the adult
                who is reading — with guided prompts, in-the-moment toolkit
                tips, and gentle follow-up activities for after the page is
                turned.
              </p>
            </div>
            <Button asChild size="lg" className="rounded-full px-7">
              <Link to="/library">Open the library</Link>
            </Button>
          </div>
        </section>
      </main>
    </div>
  );
}
