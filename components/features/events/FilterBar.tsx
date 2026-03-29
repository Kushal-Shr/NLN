"use client";

import type { EventCategory } from "./types";
import type { Theme } from "@/lib/ThemeContext";

type FilterBarProps = {
  active: EventCategory | "all";
  onChange: (cat: EventCategory | "all") => void;
  theme: Theme;
};

const FILTERS: { key: EventCategory | "all"; label: string }[] = [
  { key: "all", label: "All Circles" },
  { key: "mindfulness", label: "Mindfulness" },
  { key: "expert-wisdom", label: "Expert Wisdom" },
  { key: "physical-flow", label: "Physical Flow" },
  { key: "community-talk", label: "Community Talk" },
];

export default function FilterBar({ active, onChange, theme }: FilterBarProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {FILTERS.map((f) => {
        const isActive = active === f.key;

        return (
          <button
            key={f.key}
            type="button"
            onClick={() => onChange(f.key)}
            className="rounded-full px-4 py-1.5 text-xs font-medium transition"
            style={{
              border: `1px solid ${isActive ? theme.accent : theme.cardBorder}`,
              backgroundColor: isActive ? `${theme.accent}12` : "transparent",
              color: isActive ? theme.accent : theme.textMuted,
              fontFamily: "sans-serif",
            }}
          >
            {f.label}
          </button>
        );
      })}
    </div>
  );
}
