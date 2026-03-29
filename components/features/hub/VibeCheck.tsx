"use client";

// ============================================================
// components/features/hub/VibeCheck.tsx
// The feeling selector — 6 cards the user taps to describe
// how they're feeling WITHOUT using clinical language
// ============================================================

import { motion } from "framer-motion";
import { Wind, CloudRain, Users, Flame, Anchor, Eye } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useTheme } from "@/lib/ThemeContext";

// Each feeling has a poetic label — no "depression", "anxiety" etc
export type Feeling = {
  id: string;
  label: string;
  icon: LucideIcon;
  description: string;
};

export const FEELINGS: Feeling[] = [
  { id: "restless-spirit", label: "Restless Spirit", icon: Wind,      description: "When the mind won't settle" },
  { id: "heavy-heart",     label: "Heavy Heart",     icon: CloudRain,  description: "Carrying a weight you can't name" },
  { id: "social-friction", label: "Social Friction", icon: Users,      description: "The crowd feels like static" },
  { id: "burning-edge",    label: "Burning Edge",    icon: Flame,      description: "Running hot, close to overflow" },
  { id: "lost-anchor",     label: "Lost Anchor",     icon: Anchor,     description: "Drifting without direction" },
  { id: "foggy-lens",      label: "Foggy Lens",      icon: Eye,        description: "Can't see what's ahead clearly" },
];

type VibeCheckProps = {
  selected: string[];
  onToggle: (id: string) => void;
};

export default function VibeCheck({ selected, onToggle }: VibeCheckProps) {
  const theme = useTheme();
  // ↑ Gets accent, cardBg, cardBorder, text, textMuted from user's comfort choice

  return (
    <section>
      {/* Section heading */}
      <div style={{ marginBottom: "18px" }}>
        <h2 style={{ fontSize: "18px", fontWeight: "normal", color: theme.text, marginBottom: "6px" }}>
          Vibe Check
        </h2>
        <p style={{ fontSize: "13px", fontFamily: "sans-serif", color: theme.textMuted, lineHeight: 1.6 }}>
          Tap what resonates right now — no labels, no judgment.
        </p>
      </div>

      {/* 2x3 grid of feeling cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px" }}>
        {FEELINGS.map((feeling) => {
          const isSelected = selected.includes(feeling.id);
          const Icon = feeling.icon;

          return (
            <motion.button
              key={feeling.id}
              type="button"
              whileTap={{ scale: 0.96 }}
              animate={{ scale: isSelected ? 1.02 : 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
              onClick={() => onToggle(feeling.id)}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                gap: "8px",
                borderRadius: "14px",
                padding: "16px",
                textAlign: "left",
                cursor: "pointer",
                transition: "all 0.2s",
                fontFamily: "sans-serif",
                // Selected = accent border + tinted bg, unselected = card style
                background:   isSelected ? `${theme.accent}18` : theme.cardBg,
                border:       isSelected ? `2px solid ${theme.accent}` : `1px solid ${theme.cardBorder}`,
              }}
            >
              {/* Icon — accent color when selected, muted when not */}
              <Icon
                style={{
                  width: "18px", height: "18px",
                  color: isSelected ? theme.accent : theme.textMuted,
                  transition: "color 0.2s",
                }}
              />

              {/* Feeling label */}
              <span style={{ fontSize: "13px", fontWeight: 500, color: theme.text }}>
                {feeling.label}
              </span>

              {/* Short description */}
              <span style={{ fontSize: "11px", color: theme.textMuted, lineHeight: 1.5 }}>
                {feeling.description}
              </span>
            </motion.button>
          );
        })}
      </div>
    </section>
  );
}