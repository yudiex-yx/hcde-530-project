// Saved prompts drawer — caregivers can revisit bookmarked prompts,
// grouped by prompt category. Uses the shadcn Sheet primitive.

import { Bookmark } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { PROMPT_META, type PromptType } from "@/lib/story-data";
import type { Session } from "@/lib/session";

interface Props {
  saved: Session["savedPrompts"];
}

const GROUPS: PromptType[] = ["Feel", "Imagine", "Move", "Look", "Talk"];

export function SavedPromptsDrawer({ saved }: Props) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="rounded-full">
          <Bookmark className="h-4 w-4" />
          Saved
          <span className="ml-1 rounded-full bg-primary/15 px-1.5 text-xs text-primary">
            {saved.length}
          </span>
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="font-display text-2xl">Saved prompts</SheetTitle>
          <SheetDescription>
            A small collection of prompts worth coming back to.
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6 overflow-y-auto pr-1">
          {saved.length === 0 && (
            <p className="rounded-2xl border border-dashed border-border p-4 text-sm text-muted-foreground">
              Tap the bookmark icon on any prompt to save it here.
            </p>
          )}

          {GROUPS.map((g) => {
            const items = saved.filter((s) => s.type === g);
            if (items.length === 0) return null;
            const M = PROMPT_META[g];
            const I = M.icon;
            return (
              <div key={g}>
                <div
                  className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold"
                  style={{
                    background: `color-mix(in oklab, var(--${M.color}) 22%, transparent)`,
                    color: `var(--${M.color})`,
                  }}
                >
                  <I className="h-3.5 w-3.5" />
                  {M.label} prompts
                </div>
                <ul className="mt-2 space-y-2">
                  {items.map((sp, i) => (
                    <li
                      key={i}
                      className="rounded-2xl border border-border bg-background/40 p-3 text-sm text-foreground"
                    >
                      {sp.prompt}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </SheetContent>
    </Sheet>
  );
}
