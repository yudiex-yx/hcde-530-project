// Prompt card with category tabs (Look / Feel / Imagine / Talk / Move).
// Only renders the categories actually available for the selected hotspot,
// keeping the visual hierarchy clear and uncluttered.

import { Bookmark, X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PROMPT_META, type Hotspot, type Prompt, type PromptType } from "@/lib/story-data";

interface Props {
  hotspot: Hotspot;
  promptIndex: number;
  onChangeType: (type: PromptType) => void;
  onSave: (prompt: Prompt) => void;
  onClose: () => void;
  isSaved: boolean;
  // Guided mode controls (optional)
  guided?: {
    step: number;
    total: number;
    onNext: () => void;
    onPrev: () => void;
    isLast: boolean;
  };
  // Explore mode action
  onNext?: () => void;
}

export function PromptCard({
  hotspot,
  promptIndex,
  onChangeType,
  onSave,
  onClose,
  isSaved,
  guided,
  onNext,
}: Props) {
  const prompt = hotspot.prompts[promptIndex];
  const Meta = PROMPT_META[prompt.type];
  const Icon = Meta.icon;

  return (
    <div
      key={`${hotspot.id}-${promptIndex}`}
      className="animate-pop-in rounded-3xl border border-border bg-card p-6 shadow-[var(--shadow-soft)]"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          {guided && (
            <p className="text-xs font-bold uppercase tracking-widest text-primary">
              Guided · step {guided.step + 1} of {guided.total}
            </p>
          )}
          <p className="mt-0.5 text-xs font-bold uppercase tracking-widest text-muted-foreground">
            {hotspot.label}
          </p>
        </div>
        <button
          onClick={onClose}
          className="rounded-full p-1.5 text-muted-foreground hover:bg-muted"
          aria-label="Close prompt"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Category tabs — only those available on this hotspot */}
      <div className="mt-4 flex flex-wrap gap-1.5" role="tablist">
        {hotspot.prompts.map((p, i) => {
          const M = PROMPT_META[p.type];
          const PI = M.icon;
          const active = i === promptIndex;
          return (
            <button
              key={i}
              role="tab"
              aria-selected={active}
              onClick={() => onChangeType(p.type)}
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                active ? "shadow-[var(--shadow-soft)]" : "opacity-60 hover:opacity-100"
              }`}
              style={{
                background: `color-mix(in oklab, var(--${M.color}) ${active ? 30 : 14}%, transparent)`,
                color: `var(--${M.color})`,
              }}
            >
              <PI className="h-3.5 w-3.5" />
              {M.label}
            </button>
          );
        })}
      </div>

      {/* Active category banner + prompt content */}
      <div
        className="mt-4 inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-semibold"
        style={{
          background: `color-mix(in oklab, var(--${Meta.color}) 22%, transparent)`,
          color: `var(--${Meta.color})`,
        }}
      >
        <Icon className="h-4 w-4" />
        {Meta.label} prompt
      </div>

      <p className="mt-3 font-display text-2xl leading-snug text-foreground">
        {prompt.prompt}
      </p>

      {prompt.followUp && (
        <p className="mt-3 rounded-2xl bg-muted/60 p-3 text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">Follow-up: </span>
          {prompt.followUp}
        </p>
      )}

      {prompt.action && (
        <p className="mt-3 rounded-2xl border border-dashed border-primary/40 bg-primary/5 p-3 text-sm">
          <span className="font-semibold text-primary">Try together: </span>
          {prompt.action}
        </p>
      )}

      {/* Actions */}
      <div className="mt-5 flex flex-wrap gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onSave(prompt)}
          className="flex-1 rounded-full"
        >
          <Bookmark className={`h-4 w-4 ${isSaved ? "fill-current" : ""}`} />
          {isSaved ? "Saved" : "Save prompt"}
        </Button>

        {guided ? (
          <>
            <Button
              variant="ghost"
              size="sm"
              onClick={guided.onPrev}
              disabled={guided.step === 0}
              className="rounded-full"
            >
              Back
            </Button>
            <Button size="sm" onClick={guided.onNext} className="flex-1 rounded-full">
              {guided.isLast ? (
                <>
                  Finish reading <Check className="h-4 w-4" />
                </>
              ) : (
                <>Next step</>
              )}
            </Button>
          </>
        ) : (
          onNext && (
            <Button size="sm" onClick={onNext} className="flex-1 rounded-full">
              Next prompt
            </Button>
          )
        )}
      </div>
    </div>
  );
}
