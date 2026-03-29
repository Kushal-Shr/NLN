"use client";

// ============================================================
// components/features/journal/WisdomNugget.tsx
// AI-generated insight pulled from the journal entry
// ============================================================

import { motion, AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";
import { useTheme } from "@/lib/ThemeContext";

type WisdomNuggetProps = {
  nugget: string | null;
  loading: boolean;
  onGenerate: () => void;
  disabled: boolean;
};

export default function WisdomNugget({ nugget, loading, onGenerate, disabled }: WisdomNuggetProps) {
  const theme = useTheme();

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>

      {/* Generate button */}
      <button
        type="button"
        onClick={onGenerate}
        disabled={disabled || loading}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "8px",
          background: `${theme.accent}15`,
          color: theme.accent,
          border: `1px solid ${theme.accent}30`,
          borderRadius: "10px",
          padding: "8px 14px",
          fontSize: "12px",
          fontFamily: "sans-serif",
          fontWeight: 500,
          cursor: disabled || loading ? "not-allowed" : "pointer",
          opacity: disabled || loading ? 0.4 : 1,
          transition: "all 0.2s",
          alignSelf: "flex-start",
        }}
      >
        <Sparkles size={13} />
        {loading ? "Extracting wisdom..." : "Generate Insight"}
      </button>

      {/* Result */}
      <AnimatePresence mode="wait">
        {nugget && !loading && (
          <motion.div
            key="nugget"
            initial={{ opacity: 0, y: 8, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -6, filter: "blur(4px)" }}
            transition={{ duration: 0.5 }}
            style={{
              borderRadius: "14px",
              border: `1px solid ${theme.accent}25`,
              background: `${theme.accent}08`,
              padding: "16px",
            }}
          >
            <p style={{
              fontSize: "10px", fontFamily: "sans-serif",
              fontWeight: 700, letterSpacing: "0.16em",
              textTransform: "uppercase", color: theme.accent,
              opacity: 0.7, marginBottom: "8px",
            }}>
              Wisdom Nugget
            </p>
            <p style={{ fontSize: "13px", fontStyle: "italic", lineHeight: 1.7, color: theme.text, opacity: 0.9 }}>
              &ldquo;{nugget}&rdquo;
            </p>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
