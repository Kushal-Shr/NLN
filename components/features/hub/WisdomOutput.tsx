"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Lamp } from "lucide-react";
import { useTheme } from "@/lib/ThemeContext";

type WisdomOutputProps = {
  metaphor: string | null;
  loading: boolean;
};

export default function WisdomOutput({ metaphor, loading }: WisdomOutputProps) {
  const theme = useTheme();

  return (
    <AnimatePresence mode="wait">

      {/* LOADING STATE — shown while waiting for AI response */}
      {loading && (
        <motion.div
          key="loading"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            display: "flex", alignItems: "center", gap: "12px",
            borderRadius: "14px",
            border: `1px solid ${theme.accent}30`,
            background: `${theme.accent}08`,
            padding: "18px 20px",
            marginBottom: "24px",
          }}
        >
          {/* Pulsing lamp icon */}
          <Lamp style={{ width: "18px", height: "18px", color: theme.accent, animation: "pulse 1.5s infinite" }} />
          <span style={{ fontSize: "13px", fontFamily: "sans-serif", color: theme.textMuted }}>
            Refueling the lantern... gathering wisdom for you.
          </span>
        </motion.div>
      )}

      {/* RESULT STATE — shown after AI responds */}
      {!loading && metaphor && (
        <motion.div
          key="metaphor"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ type: "spring", stiffness: 300, damping: 24 }}
          style={{
            borderRadius: "16px",
            border: `1px solid ${theme.accent}40`,
            background: `${theme.accent}10`,
            padding: "24px",
            marginBottom: "24px",
          }}
        >
          {/* Lamp + label */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
            <Lamp style={{ width: "18px", height: "18px", color: theme.accent }} />
            <span style={{
              fontSize: "10px", fontFamily: "sans-serif",
              fontWeight: 600, letterSpacing: "0.18em",
              textTransform: "uppercase", color: theme.accent,
            }}>
              The Lantern Speaks
            </span>
          </div>

          {/* The metaphor text — italic, warm, human */}
          <p style={{
            fontSize: "15px", fontStyle: "italic",
            lineHeight: 1.75, color: theme.text, opacity: 0.92,
          }}>
            &ldquo;{metaphor}&rdquo;
          </p>
        </motion.div>
      )}

    </AnimatePresence>
  );
}