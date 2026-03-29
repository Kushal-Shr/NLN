"use client";

// ============================================================
// components/features/hub/ResourceCards.tsx
// Three result cards shown after AI generates wisdom
// ============================================================

import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, HeartPulse, ExternalLink } from "lucide-react";
import type { GeminiResponse } from "@/lib/gemini";
import { useTheme } from "@/lib/ThemeContext";

type ResourceCardsProps = {
  data: GeminiResponse | null;
};

// Staggered animation — each card appears slightly after the last
const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.12, type: "spring" as const, stiffness: 300, damping: 24 },
  }),
};

export default function ResourceCards({ data }: ResourceCardsProps) {
  const theme = useTheme();

  // Don't render anything until there's AI data to show
  if (!data) return null;

  // Three card types — each with slightly different accent
  // We derive softer versions of the theme accent for variety
  const cards = [
    {
      type: "Internal Wisdom",
      icon: Sparkles,
      // Amber tint for wisdom — warm
      accentColor: "#C6A868",
      bgColor: "rgba(198,168,104,0.08)",
      borderColor: "rgba(198,168,104,0.2)",
      content: data.wisdom,
    },
    {
      type: "Physical Practice",
      icon: HeartPulse,
      // Green tint for physical — natural
      accentColor: "#7AAB82",
      bgColor: "rgba(122,171,130,0.08)",
      borderColor: "rgba(122,171,130,0.2)",
      content: data.practice,
    },
    {
      type: "External Path",
      icon: ExternalLink,
      // Blue tint for external — sky, open
      accentColor: "#6FA3C8",
      bgColor: "rgba(111,163,200,0.08)",
      borderColor: "rgba(111,163,200,0.2)",
      content: data.metaphor,
    },
  ];

  return (
    <AnimatePresence mode="wait">
      <motion.section
        key="resource-results"
        initial="hidden"
        animate="visible"
        style={{ marginTop: "32px" }}
      >
        {/* Section label */}
        <p style={{
          fontSize: "11px", fontFamily: "sans-serif",
          letterSpacing: "0.16em", textTransform: "uppercase",
          color: theme.textMuted, marginBottom: "14px",
        }}>
          Resource Results
        </p>

        {/* Three cards side by side */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "14px" }}>
          {cards.map((card, i) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.type}
                custom={i}
                variants={cardVariants}
                style={{
                  borderRadius: "14px",
                  border: `1px solid ${card.borderColor}`,
                  background: card.bgColor,
                  padding: "20px",
                }}
              >
                {/* Icon + type label */}
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
                  <Icon style={{ width: "16px", height: "16px", color: card.accentColor }} />
                  <span style={{
                    fontSize: "10px", fontFamily: "sans-serif",
                    fontWeight: 600, letterSpacing: "0.14em",
                    textTransform: "uppercase", color: card.accentColor,
                  }}>
                    {card.type}
                  </span>
                </div>

                {/* The actual content from AI */}
                <p style={{
                  fontSize: "13px", fontFamily: "sans-serif",
                  lineHeight: 1.7, color: theme.text, opacity: 0.9,
                }}>
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
