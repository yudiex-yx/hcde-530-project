// Lightweight accessibility controls: text size, reduced motion, audio narration.
// Visually integrated as a compact popover-style panel so it stays calm.

import { useState } from "react";
import { Type, Volume2, Wind, Settings2, Check } from "lucide-react";
import type { AccessibilitySettings } from "@/lib/session";

interface Props {
  value: AccessibilitySettings;
  onChange: (next: AccessibilitySettings) => void;
}

export function AccessibilityBar({ value, onChange }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground"
        aria-expanded={open}
      >
        <Settings2 className="h-3.5 w-3.5" />
        Reading comfort
      </button>
      {open && (
        <div className="absolute right-0 z-30 mt-2 w-72 rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-soft)]">
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
            Reading comfort
          </p>

          <div className="mt-3 space-y-3">
            <div>
              <div className="mb-1.5 flex items-center gap-2 text-sm">
                <Type className="h-4 w-4 text-primary" />
                <span className="font-semibold">Text size</span>
              </div>
              <div className="flex gap-1.5">
                {(["sm", "md", "lg"] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => onChange({ ...value, textSize: s })}
                    className={`flex-1 rounded-full border px-2 py-1 text-xs font-semibold transition ${
                      value.textSize === s
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {s === "sm" ? "Small" : s === "md" ? "Medium" : "Large"}
                  </button>
                ))}
              </div>
            </div>

            <Toggle
              icon={<Wind className="h-4 w-4 text-primary" />}
              label="Reduced motion"
              hint="Calms animations across the app"
              checked={value.reducedMotion}
              onChange={(v) => onChange({ ...value, reducedMotion: v })}
            />

            <Toggle
              icon={<Volume2 className="h-4 w-4 text-primary" />}
              label="Audio narration"
              hint="Placeholder — coming soon"
              checked={value.audioNarration}
              onChange={(v) => onChange({ ...value, audioNarration: v })}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function Toggle({
  icon,
  label,
  hint,
  checked,
  onChange,
}: {
  icon: React.ReactNode;
  label: string;
  hint?: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className="flex w-full items-start gap-3 rounded-xl border border-border bg-background/40 p-2.5 text-left hover:bg-background"
    >
      <div className="mt-0.5">{icon}</div>
      <div className="flex-1">
        <p className="text-sm font-semibold">{label}</p>
        {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
      </div>
      <span
        className={`mt-0.5 grid h-5 w-5 place-items-center rounded-full border ${
          checked ? "border-primary bg-primary text-primary-foreground" : "border-border"
        }`}
      >
        {checked && <Check className="h-3 w-3" />}
      </span>
    </button>
  );
}
