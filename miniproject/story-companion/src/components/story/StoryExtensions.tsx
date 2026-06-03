// "Continue Beyond the Story" — caregiver-facing extension activities
// connecting the reading moment to real-world play.

import { EXTENSIONS } from "@/lib/story-data";

export function StoryExtensions() {
  return (
    <section className="rounded-3xl border border-border bg-card p-6 shadow-[var(--shadow-soft)]">
      <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
        Continue beyond the story
      </p>
      <h2 className="mt-1 font-display text-2xl">Small ways to keep wondering</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Pick one — they take 2–10 minutes and need no special materials.
      </p>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {EXTENSIONS.map((a) => {
          const I = a.icon;
          return (
            <div
              key={a.id}
              className="rounded-2xl border border-border bg-secondary/30 p-4 transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-soft)]"
            >
              <div className="flex items-center gap-2">
                <div className="grid h-8 w-8 place-items-center rounded-xl bg-primary/15 text-primary">
                  <I className="h-4 w-4" />
                </div>
                <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                  {a.kind}
                </span>
              </div>
              <p className="mt-3 font-display text-lg leading-snug">{a.title}</p>
              <p className="mt-1 text-sm text-muted-foreground">{a.description}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
