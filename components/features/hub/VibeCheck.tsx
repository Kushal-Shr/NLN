"use client";

import { motion } from "framer-motion";
import { Wind, CloudRain, Users, Flame, Anchor, Eye } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type Feeling = {
  id: string;
  label: string;
  icon: LucideIcon;
  description: string;
};

export const FEELINGS: Feeling[] = [
  {
    id: "restless-spirit",
    label: "Restless Spirit",
    icon: Wind,
    description: "When the mind won't settle",
  },
  {
    id: "heavy-heart",
    label: "Heavy Heart",
    icon: CloudRain,
    description: "Carrying a weight you can't name",
  },
  {
    id: "social-friction",
    label: "Social Friction",
    icon: Users,
    description: "The crowd feels like static",
  },
  {
    id: "burning-edge",
    label: "Burning Edge",
    icon: Flame,
    description: "Running hot, close to overflow",
  },
  {
    id: "lost-anchor",
    label: "Lost Anchor",
    icon: Anchor,
    description: "Drifting without direction",
  },
  {
    id: "foggy-lens",
    label: "Foggy Lens",
    icon: Eye,
    description: "Can't see what's ahead clearly",
  },
];

type VibeCheckProps = {
  selected: string[];
  onToggle: (id: string) => void;
};

export default function VibeCheck({ selected, onToggle }: VibeCheckProps) {
  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-stealth-text">
          Vibe Check
        </h2>
        <p className="text-sm text-stealth-muted">
          Tap what resonates right now — no labels, no judgment.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {FEELINGS.map((feeling) => {
          const isSelected = selected.includes(feeling.id);
          const Icon = feeling.icon;

          return (
            <motion.button
              key={feeling.id}
              type="button"
              whileTap={{ scale: 0.95 }}
              animate={{ scale: isSelected ? 1.03 : 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
              onClick={() => onToggle(feeling.id)}
              className={`group flex flex-col items-start gap-2 rounded-xl border p-4 text-left transition-colors ${
                isSelected
                  ? "border-stealth-accent/60 bg-stealth-accent/15 shadow-md shadow-stealth-accent/10"
                  : "border-white/10 bg-stealth-card hover:border-white/20"
              }`}
            >
              <Icon
                className={`h-5 w-5 transition-colors ${
                  isSelected ? "text-stealth-accent" : "text-stealth-muted"
                }`}
              />
              <span className="text-sm font-medium text-stealth-text">
                {feeling.label}
              </span>
              <span className="text-xs text-stealth-muted">
                {feeling.description}
              </span>
            </motion.button>
          );
        })}
      </div>
    </section>
  );
}
