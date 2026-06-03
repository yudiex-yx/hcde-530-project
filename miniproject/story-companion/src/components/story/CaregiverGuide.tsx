// Caregiver Guide panel — guidance for the adult, not the child.
// Sits next to the scene on desktop; collapses to a bottom drawer on mobile.

import { useState } from "react";
import { BookOpen, ChevronDown, Sparkles } from "lucide-react";
import type { ReadingGoal } from "@/lib/story-data";

interface Props {
  goal: ReadingGoal;
}

const TIPS = [
  "Pause after each page for 1–2 prompts.",
  "Try not to ask every question. Choose what fits the child's attention.",
  "Follow the child's curiosity — let them lead.",
  "Wait time matters. Give 5–10 seconds for a response.",
];

export function CaregiverGuide({ goal }: Props) {
  const [open, setOpen] = useState(true);
  return (
    <aside className="rounded-3xl border border-border bg-secondary/40 p-5 shadow-[var(--shadow-soft)]">
      <button
        className="flex w-full items-center justify-between"
        onClick={() => setOpen((v) => !v)}
      >
        <div className="flex items-center gap-2">
          <div className="rounded-full bg-primary/15 p-1.5 text-primary">
            <BookOpen className="h-4 w-4" />
          </div>
          <h3 className="font-display text-lg">Caregiver Guide</h3>
        </div>
        <ChevronDown
          className={`h-4 w-4 text-muted-foreground transition-transform ${
            open ? "" : "-rotate-90"
          }`}
        />
      </button>

      {open && (
        <div className="mt-4 space-y-4 text-sm">
          <div className="rounded-2xl bg-card p-3">
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
              Today's reading goal
            </p>
            <p className="mt-1 flex items-center gap-1.5 font-display text-lg text-foreground">
              <Sparkles className="h-4 w-4 text-primary" />
              {goal}
            </p>
          </div>
          <ul className="space-y-2">
            {TIPS.map((t) => (
              <li key={t} className="flex gap-2 text-muted-foreground">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/60" />
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </aside>
  );
}
