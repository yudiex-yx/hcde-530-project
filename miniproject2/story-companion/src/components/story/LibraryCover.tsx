// Tiny inline SVG cover illustrations for each library story.
// Keeps the library visually distinct without needing image assets.

interface Props {
  variant: "luna" | "rain" | "backpack" | "forest";
}

export function LibraryCover({ variant }: Props) {
  return (
    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl">
      {variant === "luna" && <LunaCover />}
      {variant === "rain" && <RainCover />}
      {variant === "backpack" && <BackpackCover />}
      {variant === "forest" && <ForestCover />}
    </div>
  );
}

function LunaCover() {
  return (
    <svg viewBox="0 0 200 150" className="h-full w-full">
      <defs>
        <linearGradient id="lc-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="oklch(0.48 0.1 270)" />
          <stop offset="1" stopColor="oklch(0.72 0.09 60)" />
        </linearGradient>
      </defs>
      <rect width="200" height="120" fill="url(#lc-sky)" />
      <rect y="115" width="200" height="35" fill="oklch(0.55 0.08 70)" />
      <circle cx="155" cy="35" r="14" fill="oklch(0.95 0.04 90)" />
      {[[20, 20], [60, 35], [110, 18], [140, 60], [40, 70]].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="1.2" fill="white" />
      ))}
      <g transform="translate(140,85)">
        <circle r="28" fill="oklch(0.5 0.12 245)" />
        <circle cx="-18" cy="8" r="20" fill="oklch(0.55 0.11 240)" />
        <rect x="-4" y="22" width="8" height="22" fill="oklch(0.32 0.04 30)" rx="2" />
      </g>
      <g transform="translate(60,108)">
        <path d="M-8 18 Q-8 0 0 0 Q8 0 8 18 Z" fill="oklch(0.72 0.14 20)" />
        <circle cy="-6" r="8" fill="oklch(0.85 0.06 60)" />
      </g>
    </svg>
  );
}

function RainCover() {
  return (
    <svg viewBox="0 0 200 150" className="h-full w-full">
      <rect width="200" height="150" fill="oklch(0.78 0.04 240)" />
      {Array.from({ length: 28 }).map((_, i) => (
        <line
          key={i}
          x1={(i * 19) % 200}
          y1={(i * 11) % 90}
          x2={(i * 19) % 200 - 4}
          y2={(i * 11) % 90 + 14}
          stroke="oklch(0.92 0.02 240)"
          strokeWidth="1.2"
          opacity="0.7"
        />
      ))}
      <g transform="translate(100,90)">
        <path d="M-40 0 Q0 -40 40 0 Z" fill="oklch(0.68 0.12 20)" />
        <rect x="-1" y="0" width="2" height="40" fill="oklch(0.3 0.04 30)" />
      </g>
      <rect y="130" width="200" height="20" fill="oklch(0.5 0.05 250)" />
    </svg>
  );
}

function BackpackCover() {
  return (
    <svg viewBox="0 0 200 150" className="h-full w-full">
      <rect width="200" height="150" fill="oklch(0.92 0.04 70)" />
      <rect y="115" width="200" height="35" fill="oklch(0.78 0.07 80)" />
      <g transform="translate(100,80)">
        <rect x="-30" y="-30" width="60" height="60" rx="12" fill="oklch(0.6 0.13 30)" />
        <rect x="-20" y="-10" width="40" height="20" rx="4" fill="oklch(0.85 0.06 60)" />
        <path d="M-30 -15 Q-45 -25 -45 -5" stroke="oklch(0.5 0.1 30)" strokeWidth="6" fill="none" />
        <path d="M30 -15 Q45 -25 45 -5" stroke="oklch(0.5 0.1 30)" strokeWidth="6" fill="none" />
      </g>
      <circle cx="40" cy="40" r="14" fill="oklch(0.95 0.07 90)" opacity="0.8" />
    </svg>
  );
}

function ForestCover() {
  return (
    <svg viewBox="0 0 200 150" className="h-full w-full">
      <rect width="200" height="150" fill="oklch(0.86 0.05 130)" />
      <rect y="120" width="200" height="30" fill="oklch(0.6 0.08 110)" />
      {[20, 60, 95, 130, 170].map((x, i) => (
        <g key={i} transform={`translate(${x},90)`}>
          <rect x="-3" y="0" width="6" height="30" fill="oklch(0.35 0.05 40)" />
          <polygon points="-20,0 0,-50 20,0" fill="oklch(0.45 0.1 140)" />
          <polygon points="-16,-15 0,-55 16,-15" fill="oklch(0.5 0.11 145)" />
        </g>
      ))}
      <path
        d="M0 140 Q100 120 200 140"
        stroke="oklch(0.78 0.05 80)"
        strokeWidth="3"
        fill="none"
        strokeDasharray="2 6"
      />
    </svg>
  );
}
