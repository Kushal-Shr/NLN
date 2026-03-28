"use client";

import { CATEGORY_META } from "./types";
import type { EventCategory } from "./types";

type FilterBarProps = {
  active: EventCategory | "all";
  onChange: (cat: EventCategory | "all") => void;
};

const FILTERS: { key: EventCategory | "all"; label: string }[] = [
  { key: "all", label: "All Circles" },
  { key: "mindfulness", label: "Mindfulness" },
  { key: "expert-wisdom", label: "Expert Wisdom" },
  { key: "physical-flow", label: "Physical Flow" },
  { key: "community-talk", label: "Community Talk" },
];

export default function FilterBar({ active, onChange }: FilterBarProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {FILTERS.map((f) => {
        const isActive = active === f.key;
        const color =
          f.key !== "all"
            ? CATEGORY_META[f.key].color
            : "text-stealth-text";

        return (
          <button
            key={f.key}
            type="button"
            onClick={() => onChange(f.key)}
            className={`rounded-full px-4 py-1.5 text-xs font-medium transition ${
              isActive
                ? `bg-white/10 ${color} border border-white/15`
                : "border border-transparent text-stealth-muted hover:bg-white/5 hover:text-stealth-text"
            }`}
          >
            {f.label}
          </button>
        );
      })}
    </div>
  );
}
