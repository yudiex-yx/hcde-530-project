// Collapsible "Reading Toolkit" panel — quick caregiver support tips
// for the most common in-the-moment challenges.

import { useState } from "react";
import { LifeBuoy, ChevronDown } from "lucide-react";
import { TOOLKIT } from "@/lib/story-data";

export function ReadingToolkit() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(TOOLKIT[0].id);

  return (
    <aside className="rounded-3xl border border-border bg-card p-5 shadow-[var(--shadow-soft)]">
      <button
        className="flex w-full items-center justify-between"
        onClick={() => setOpen((v) => !v)}
      >
        <div className="flex items-center gap-2">
          <div className="rounded-full bg-accent/40 p-1.5 text-primary">
            <LifeBuoy className="h-4 w-4" />
          </div>
          <h3 className="font-display text-lg">Reading Toolkit</h3>
        </div>
        <ChevronDown
          className={`h-4 w-4 text-muted-foreground transition-transform ${
            open ? "" : "-rotate-90"
          }`}
        />
      </button>

      {open && (
        <div className="mt-4 space-y-3">
          <div className="flex flex-wrap gap-1.5">
            {TOOLKIT.map((t) => (
              <button
                key={t.id}
                onClick={() => setActive(t.id)}
                className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                  active === t.id
                    ? "bg-primary/15 text-primary"
                    : "bg-muted text-muted-foreground hover:text-foreground"
                }`}
              >
                {t.situation.replace(/^When the child /, "")}
              </button>
            ))}
          </div>

          {TOOLKIT.filter((t) => t.id === active).map((t) => (
            <div key={t.id} className="rounded-2xl bg-secondary/40 p-4">
              <p className="font-display text-base">{t.situation}</p>
              <ul className="mt-3 space-y-2">
                {t.tips.map((tip) => (
                  <li
                    key={tip}
                    className="flex gap-2 text-sm text-muted-foreground"
                  >
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/60" />
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </aside>
  );
}
