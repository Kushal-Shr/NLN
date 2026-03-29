// ============================================================
// components/features/events/FilterBar.tsx
// ============================================================
"use client";

import { CATEGORY_META } from "./types";
import type { EventCategory } from "./types";
import { useTheme } from "@/lib/ThemeContext";

type FilterBarProps = {
  active: EventCategory | "all";
  onChange: (cat: EventCategory | "all") => void;
};

const FILTERS: { key: EventCategory | "all"; label: string }[] = [
  { key: "all",            label: "All Circles" },
  { key: "mindfulness",    label: "Mindfulness" },
  { key: "expert-wisdom",  label: "Expert Wisdom" },
  { key: "physical-flow",  label: "Physical Flow" },
  { key: "community-talk", label: "Community Talk" },
];

export default function FilterBar({ active, onChange }: FilterBarProps) {
  const theme = useTheme();

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
      {FILTERS.map((f) => {
        const isActive = active === f.key;
        const accentColor = f.key !== "all" ? CATEGORY_META[f.key].hexColor : theme.accent;

        return (
          <button
            key={f.key}
            type="button"
            onClick={() => onChange(f.key)}
            style={{
              borderRadius: "20px",
              padding: "6px 16px",
              fontSize: "12px",
              fontFamily: "sans-serif",
              fontWeight: 500,
              cursor: "pointer",
              transition: "all 0.2s",
              background: isActive ? "rgba(255,255,255,0.1)" : "transparent",
              border: isActive ? `1px solid rgba(255,255,255,0.15)` : "1px solid transparent",
              color: isActive ? accentColor : theme.textMuted,
            }}
          >
            {f.label}
          </button>
        );
      })}
    </div>
  );
}