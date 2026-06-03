// Illustrated story scene with hotspots, themed per story.
// - Renders a different SVG backdrop per storyId
// - Hotspots come from the active story config
// - Tracks explored/active states with clear visual feedback
// - Respects reduced-motion preference

import { Check } from "lucide-react";
import type { Hotspot } from "@/lib/story-data";

interface Props {
  storyId: string;
  hotspots: Hotspot[];
  activeId?: string | null;
  exploredIds: string[];
  onSelect: (h: Hotspot) => void;
  reducedMotion?: boolean;
  // When guided mode locks navigation to a specific hotspot
  lockedToId?: string | null;
}

export function StoryScene({
  storyId,
  hotspots,
  activeId,
  exploredIds,
  onSelect,
  reducedMotion,
  lockedToId,
}: Props) {
  return (
    <div className="relative w-full aspect-[4/3] overflow-hidden rounded-3xl border border-border shadow-[var(--shadow-soft)]">
      <svg
        viewBox="0 0 400 300"
        className="absolute inset-0 w-full h-full"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden
      >
        {storyId === "luna" && <LunaBackdrop reducedMotion={reducedMotion} />}
        {storyId === "rain" && <RainBackdrop reducedMotion={reducedMotion} />}
        {storyId === "backpack" && <BackpackBackdrop />}
        {storyId === "forest" && <ForestBackdrop reducedMotion={reducedMotion} />}
      </svg>

      {hotspots.map((h) => {
        const explored = exploredIds.includes(h.id);
        const active = activeId === h.id;
        const locked = lockedToId != null && h.id !== lockedToId;
        const pulse = !active && !explored && !reducedMotion && !locked;
        return (
          <button
            key={h.id}
            onClick={() => onSelect(h)}
            disabled={locked}
            aria-label={`Explore ${h.label}${explored ? " (already explored)" : ""}`}
            aria-pressed={active}
            className={`group absolute -translate-x-1/2 -translate-y-1/2 ${
              locked ? "cursor-not-allowed opacity-40" : ""
            }`}
            style={{ left: `${h.x}%`, top: `${h.y}%` }}
          >
            <span
              className={`grid h-9 w-9 place-items-center rounded-full border-2 border-white/85 backdrop-blur-sm transition-all group-hover:scale-110 group-hover:shadow-[var(--shadow-glow)] ${
                active
                  ? "scale-110 bg-primary"
                  : explored
                    ? "bg-primary/80"
                    : "bg-white/45"
              } ${pulse ? "animate-pulse-soft" : ""}`}
            >
              {explored && !active && (
                <Check className="h-4 w-4 text-primary-foreground" />
              )}
            </span>
            <span className="pointer-events-none absolute left-1/2 top-full mt-2 -translate-x-1/2 whitespace-nowrap rounded-full bg-card/95 px-2.5 py-0.5 text-xs font-semibold text-foreground opacity-0 shadow-[var(--shadow-soft)] transition-opacity group-hover:opacity-100">
              {h.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

// ---------------- Backdrops ----------------

function LunaBackdrop({ reducedMotion }: { reducedMotion?: boolean }) {
  return (
    <>
      <defs>
        <linearGradient id="sky-luna" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="oklch(0.48 0.1 270)" />
          <stop offset="60%" stopColor="oklch(0.62 0.09 280)" />
          <stop offset="100%" stopColor="oklch(0.78 0.07 60)" />
        </linearGradient>
        <radialGradient id="moonGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="oklch(0.95 0.06 90)" stopOpacity="0.6" />
          <stop offset="100%" stopColor="oklch(0.95 0.06 90)" stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect width="400" height="230" fill="url(#sky-luna)" />
      <path d="M0 230 Q200 200 400 230 L400 300 L0 300 Z" fill="oklch(0.55 0.08 70)" />
      <path d="M0 250 Q200 225 400 250 L400 300 L0 300 Z" fill="oklch(0.48 0.07 60)" />

      {[
        [40, 30], [80, 60], [140, 25], [200, 45], [260, 20],
        [310, 55], [355, 35], [105, 90], [240, 95], [330, 100],
      ].map(([cx, cy], i) => (
        <circle
          key={i}
          cx={cx}
          cy={cy}
          r="1.4"
          fill="white"
          className={reducedMotion ? "" : "animate-twinkle"}
          style={{ animationDelay: `${i * 0.3}s` }}
        />
      ))}

      <path
        d="M120 295 Q180 260 220 280 Q260 295 320 270"
        stroke="oklch(0.78 0.05 80)"
        strokeWidth="6"
        fill="none"
        strokeLinecap="round"
        strokeDasharray="2 8"
        opacity="0.7"
      />

      <g transform="translate(280, 130)">
        <rect x="-8" y="40" width="16" height="100" rx="6" fill="oklch(0.32 0.04 30)" />
        <circle cx="0" cy="0" r="55" fill="oklch(0.5 0.12 245)" />
        <circle cx="-30" cy="15" r="40" fill="oklch(0.55 0.11 240)" />
        <circle cx="28" cy="20" r="35" fill="oklch(0.45 0.13 250)" />
        <circle cx="-10" cy="-30" r="32" fill="oklch(0.6 0.1 235)" />
      </g>

      <g transform="translate(128, 205)">
        <path d="M-14 30 Q-14 0 0 0 Q14 0 14 30 Z" fill="oklch(0.72 0.14 20)" />
        <circle cx="0" cy="-10" r="14" fill="oklch(0.85 0.06 60)" />
        <path d="M-14 -12 Q-14 -28 0 -26 Q14 -28 14 -12 Q14 -22 0 -22 Q-14 -22 -14 -12 Z" fill="oklch(0.3 0.05 40)" />
        <circle cx="-4" cy="-10" r="1.4" fill="oklch(0.2 0.03 30)" />
        <circle cx="4" cy="-10" r="1.4" fill="oklch(0.2 0.03 30)" />
        <path d="M-3 -5 Q0 -3 3 -5" stroke="oklch(0.3 0.05 30)" strokeWidth="1" fill="none" strokeLinecap="round" />
        <path d="M10 8 Q22 18 30 28" stroke="oklch(0.85 0.06 60)" strokeWidth="4" fill="none" strokeLinecap="round" />
      </g>

      <circle cx="312" cy="55" r="28" fill="url(#moonGlow)" />
      <circle
        cx="312"
        cy="55"
        r="18"
        fill="oklch(0.95 0.04 90)"
        className={reducedMotion ? "" : "animate-float"}
      />
      <circle cx="306" cy="50" r="3" fill="oklch(0.85 0.04 90)" opacity="0.6" />
      <circle cx="316" cy="60" r="2" fill="oklch(0.85 0.04 90)" opacity="0.5" />

      <g transform="translate(184, 240)">
        <circle r="9" fill="oklch(0.92 0.02 240)" />
        <circle r="6" fill="oklch(0.82 0.03 240)" />
        <circle cx="-1.5" cy="-1.5" r="1" fill="white" />
        <circle cx="2" cy="2" r="0.8" fill="oklch(0.7 0.02 240)" />
      </g>
    </>
  );
}

function RainBackdrop({ reducedMotion }: { reducedMotion?: boolean }) {
  return (
    <>
      <defs>
        <linearGradient id="sky-rain" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="oklch(0.7 0.05 240)" />
          <stop offset="1" stopColor="oklch(0.55 0.06 245)" />
        </linearGradient>
      </defs>
      {/* Cozy indoor wall */}
      <rect width="400" height="300" fill="oklch(0.92 0.04 70)" />
      {/* Window frame */}
      <rect x="60" y="40" width="300" height="200" rx="14" fill="oklch(0.86 0.05 65)" />
      <rect x="80" y="60" width="260" height="160" rx="6" fill="url(#sky-rain)" />
      {/* Window mullions */}
      <line x1="210" y1="60" x2="210" y2="220" stroke="oklch(0.86 0.05 65)" strokeWidth="6" />
      <line x1="80" y1="140" x2="340" y2="140" stroke="oklch(0.86 0.05 65)" strokeWidth="6" />
      {/* Rain streaks */}
      {Array.from({ length: 26 }).map((_, i) => {
        const x = 90 + ((i * 19) % 240);
        const y = 70 + ((i * 13) % 140);
        return (
          <line
            key={i}
            x1={x}
            y1={y}
            x2={x - 4}
            y2={y + 14}
            stroke="oklch(0.94 0.02 240)"
            strokeWidth="1.4"
            opacity="0.85"
            className={reducedMotion ? "" : "animate-twinkle"}
            style={{ animationDelay: `${(i % 6) * 0.4}s` }}
          />
        );
      })}
      {/* Distant hills behind glass */}
      <path d="M80 200 Q160 175 230 195 Q300 215 340 195 L340 220 L80 220 Z" fill="oklch(0.48 0.06 250)" opacity="0.6" />

      {/* Floor */}
      <rect y="240" width="400" height="60" fill="oklch(0.7 0.06 60)" />
      <rect y="240" width="400" height="6" fill="oklch(0.55 0.06 60)" />

      {/* Maya silhouette at the window */}
      <g transform="translate(110, 175)">
        <path d="M-16 50 Q-16 0 0 0 Q16 0 16 50 Z" fill="oklch(0.55 0.12 320)" />
        <circle cx="0" cy="-12" r="15" fill="oklch(0.78 0.07 50)" />
        <path d="M-15 -14 Q-15 -32 0 -30 Q15 -32 15 -14 Q15 -26 0 -26 Q-15 -26 -15 -14 Z" fill="oklch(0.3 0.04 40)" />
        <circle cx="-3" cy="-12" r="1.2" fill="oklch(0.2 0.03 30)" />
      </g>

      {/* Small side table with teacup */}
      <g transform="translate(220, 240)">
        <rect x="-26" y="-8" width="52" height="8" rx="2" fill="oklch(0.4 0.04 30)" />
        <rect x="-22" y="0" width="6" height="30" fill="oklch(0.4 0.04 30)" />
        <rect x="16" y="0" width="6" height="30" fill="oklch(0.4 0.04 30)" />
        <g transform="translate(0, -16)">
          <path d="M-10 0 L10 0 L8 10 L-8 10 Z" fill="oklch(0.95 0.02 80)" />
          <path d="M10 1 Q16 3 16 6 Q16 9 10 9" stroke="oklch(0.85 0.04 80)" strokeWidth="1.4" fill="none" />
          <path
            d="M-3 -4 Q-4 -10 -1 -14"
            stroke="oklch(0.85 0.04 80)"
            strokeWidth="1.2"
            fill="none"
            opacity="0.7"
            className={reducedMotion ? "" : "animate-float"}
          />
        </g>
      </g>

      {/* Paper boat on the floor */}
      <g transform="translate(320, 270)">
        <path d="M-22 0 L22 0 L14 10 L-14 10 Z" fill="oklch(0.96 0.02 80)" />
        <path d="M0 -16 L0 6 L-12 6 Z" fill="oklch(0.85 0.06 60)" />
      </g>
    </>
  );
}

function BackpackBackdrop() {
  return (
    <>
      <defs>
        <linearGradient id="sky-bp" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="oklch(0.86 0.05 220)" />
          <stop offset="1" stopColor="oklch(0.93 0.04 80)" />
        </linearGradient>
      </defs>
      <rect width="400" height="200" fill="url(#sky-bp)" />
      {/* Grass + path */}
      <rect y="195" width="400" height="105" fill="oklch(0.78 0.09 130)" />
      <path d="M0 230 Q200 210 400 240 L400 260 Q200 245 0 260 Z" fill="oklch(0.86 0.07 90)" />
      {/* Distant trees */}
      {[40, 360].map((x, i) => (
        <g key={i} transform={`translate(${x},170)`}>
          <rect x="-3" y="0" width="6" height="30" fill="oklch(0.35 0.05 40)" />
          <polygon points="-18,0 0,-40 18,0" fill="oklch(0.5 0.11 140)" />
        </g>
      ))}

      {/* Bench */}
      <g transform="translate(220, 165)">
        <rect x="-40" y="0" width="80" height="8" rx="2" fill="oklch(0.45 0.07 40)" />
        <rect x="-40" y="-12" width="80" height="6" rx="2" fill="oklch(0.45 0.07 40)" />
        <rect x="-36" y="8" width="6" height="22" fill="oklch(0.4 0.06 40)" />
        <rect x="30" y="8" width="6" height="22" fill="oklch(0.4 0.06 40)" />
      </g>

      {/* Bush hiding the backpack */}
      <g transform="translate(315, 215)">
        <ellipse cx="0" cy="0" rx="50" ry="28" fill="oklch(0.55 0.11 145)" />
        <ellipse cx="-22" cy="-8" rx="22" ry="18" fill="oklch(0.6 0.1 140)" />
        <ellipse cx="20" cy="-6" rx="20" ry="16" fill="oklch(0.5 0.12 150)" />
        {/* peek of backpack */}
        <rect x="-8" y="-12" width="22" height="20" rx="4" fill="oklch(0.6 0.13 30)" />
        <rect x="-3" y="-6" width="12" height="6" rx="2" fill="oklch(0.85 0.06 60)" />
      </g>

      {/* Benny */}
      <g transform="translate(100, 200)">
        <path d="M-14 40 Q-14 0 0 0 Q14 0 14 40 Z" fill="oklch(0.6 0.13 250)" />
        <circle cx="0" cy="-10" r="13" fill="oklch(0.85 0.06 60)" />
        <path d="M-13 -12 Q-13 -28 0 -26 Q13 -28 13 -12 Q13 -22 0 -22 Q-13 -22 -13 -12 Z" fill="oklch(0.3 0.05 30)" />
        <circle cx="-4" cy="-10" r="1.3" fill="oklch(0.2 0.03 30)" />
        <circle cx="4" cy="-10" r="1.3" fill="oklch(0.2 0.03 30)" />
        <path d="M-3 -4 Q0 -2 3 -4" stroke="oklch(0.3 0.05 30)" strokeWidth="1" fill="none" strokeLinecap="round" />
      </g>

      {/* Footprints along path */}
      {[
        [140, 255], [165, 268], [195, 254], [220, 268], [250, 254], [280, 268],
      ].map(([cx, cy], i) => (
        <ellipse key={i} cx={cx} cy={cy} rx="6" ry="3.5" fill="oklch(0.45 0.05 60)" opacity={0.45 + (i % 3) * 0.1} />
      ))}
    </>
  );
}

function ForestBackdrop({ reducedMotion }: { reducedMotion?: boolean }) {
  return (
    <>
      <defs>
        <linearGradient id="sky-forest" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="oklch(0.88 0.05 130)" />
          <stop offset="1" stopColor="oklch(0.78 0.08 130)" />
        </linearGradient>
      </defs>
      <rect width="400" height="300" fill="url(#sky-forest)" />
      {/* Far layer */}
      {[10, 60, 110, 160, 210, 260, 310, 360].map((x, i) => (
        <g key={`f-${i}`} transform={`translate(${x},120)`} opacity="0.55">
          <rect x="-2" y="0" width="4" height="40" fill="oklch(0.4 0.05 60)" />
          <polygon points="-14,0 0,-40 14,0" fill="oklch(0.55 0.09 145)" />
        </g>
      ))}
      {/* Mid layer */}
      {[30, 100, 170, 240, 320].map((x, i) => (
        <g key={`m-${i}`} transform={`translate(${x},160)`}>
          <rect x="-3" y="0" width="6" height="60" fill="oklch(0.32 0.05 50)" />
          <polygon points="-22,0 0,-60 22,0" fill="oklch(0.5 0.11 140)" />
          <polygon points="-18,-18 0,-66 18,-18" fill="oklch(0.55 0.12 145)" />
        </g>
      ))}
      {/* Ground */}
      <rect y="240" width="400" height="60" fill="oklch(0.62 0.08 110)" />
      {/* Path */}
      <path d="M120 300 Q200 260 280 300 Z" fill="oklch(0.78 0.06 90)" />

      {/* Two friends walking together */}
      <g transform="translate(120, 250)">
        <path d="M-12 30 Q-12 0 0 0 Q12 0 12 30 Z" fill="oklch(0.65 0.13 30)" />
        <circle cx="0" cy="-9" r="11" fill="oklch(0.85 0.06 60)" />
        <circle cx="-3" cy="-9" r="1.1" fill="oklch(0.2 0.03 30)" />
        <circle cx="3" cy="-9" r="1.1" fill="oklch(0.2 0.03 30)" />
      </g>
      <g transform="translate(150, 252)">
        <path d="M-12 28 Q-12 0 0 0 Q12 0 12 28 Z" fill="oklch(0.55 0.13 295)" />
        <circle cx="0" cy="-9" r="11" fill="oklch(0.8 0.07 50)" />
        <path d="M-12 -10 Q-12 -26 0 -24 Q12 -26 12 -10 Q12 -20 0 -20 Q-12 -20 -12 -10 Z" fill="oklch(0.3 0.05 40)" />
        <circle cx="-3" cy="-9" r="1.1" fill="oklch(0.2 0.03 30)" />
        <circle cx="3" cy="-9" r="1.1" fill="oklch(0.2 0.03 30)" />
      </g>

      {/* Mushroom */}
      <g transform="translate(220, 258)">
        <rect x="-3" y="0" width="6" height="10" fill="oklch(0.93 0.02 80)" />
        <ellipse cx="0" cy="0" rx="9" ry="6" fill="oklch(0.65 0.16 30)" />
        <circle cx="-3" cy="-2" r="1" fill="white" />
        <circle cx="3" cy="-1" r="0.8" fill="white" />
      </g>

      {/* Bird */}
      <g
        transform="translate(330, 55)"
        className={reducedMotion ? "" : "animate-float"}
      >
        <path d="M-6 0 Q-3 -4 0 0 Q3 -4 6 0" stroke="oklch(0.3 0.05 30)" strokeWidth="1.6" fill="none" strokeLinecap="round" />
      </g>
    </>
  );
}
