"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, HeartPulse, ExternalLink } from "lucide-react";
import type { GeminiResponse } from "@/lib/gemini";

type ResourceCardsProps = {
  data: GeminiResponse | null;
};

const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, type: "spring" as const, stiffness: 300, damping: 24 },
  }),
};

export default function ResourceCards({ data }: ResourceCardsProps) {
  if (!data) return null;

  const cards = [
    {
      type: "Internal Wisdom",
      icon: Sparkles,
      accent: "text-amber-400",
      border: "border-amber-400/20",
      bg: "bg-amber-400/5",
      content: data.wisdom,
    },
    {
      type: "Physical Practice",
      icon: HeartPulse,
      accent: "text-emerald-400",
      border: "border-emerald-400/20",
      bg: "bg-emerald-400/5",
      content: data.practice,
    },
    {
      type: "External Path",
      icon: ExternalLink,
      accent: "text-sky-400",
      border: "border-sky-400/20",
      bg: "bg-sky-400/5",
      content: data.metaphor,
    },
  ];

  return (
    <AnimatePresence mode="wait">
      <motion.section
        key="resource-results"
        className="space-y-4"
        initial="hidden"
        animate="visible"
      >
        <h3 className="text-sm font-semibold uppercase tracking-widest text-stealth-muted">
          Resource Results
        </h3>

        <div className="grid gap-4 md:grid-cols-3">
          {cards.map((card, i) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.type}
                custom={i}
                variants={cardVariants}
                className={`rounded-xl border ${card.border} ${card.bg} p-5 space-y-3`}
              >
                <div className="flex items-center gap-2">
                  <Icon className={`h-4 w-4 ${card.accent}`} />
                  <span className={`text-xs font-semibold uppercase tracking-wider ${card.accent}`}>
                    {card.type}
                  </span>
                </div>
                <p className="text-sm leading-relaxed text-stealth-text">
                  {card.content}
                </p>
              </motion.div>
            );
          })}
        </div>
      </motion.section>
    </AnimatePresence>
  );
}
