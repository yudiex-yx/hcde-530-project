// Lightweight breadcrumbs for orientation across the prototype.
// Uses TanStack Router Link so navigation stays client-side.

import { Link } from "@tanstack/react-router";
import { ChevronRight, Home } from "lucide-react";

type RoutePath = "/" | "/library" | "/setup" | "/story" | "/summary" | "/create" | "/upload" | "/scan";

export interface Crumb {
  label: string;
  to?: RoutePath;
}

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav
      aria-label="Breadcrumb"
      className="flex flex-wrap items-center gap-1.5 text-xs font-semibold text-muted-foreground"
    >
      <Link to="/" className="inline-flex items-center gap-1 hover:text-foreground">
        <Home className="h-3.5 w-3.5" /> Home
      </Link>
      {items.map((c, i) => (
        <span key={i} className="inline-flex items-center gap-1.5">
          <ChevronRight className="h-3 w-3 opacity-50" />
          {c.to ? (
            <Link to={c.to} className="hover:text-foreground">
              {c.label}
            </Link>
          ) : (
            <span className="text-foreground">{c.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
