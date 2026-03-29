"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { PenLine, ShieldCheck, Timer, Loader2 } from "lucide-react";
import EnergyTracker from "./EnergyTracker";
import WisdomNugget from "./WisdomNugget";
import type { JournalEntry } from "./types";
import type { JournalInsight } from "@/lib/gemini";
import { useTheme } from "@/lib/ThemeContext";

type EntryEditorProps = {
  entry: JournalEntry;
  spark: string | null;
  onUpdate: (patch: Partial<JournalEntry>) => void;
};

export default function EntryEditor({ entry, spark, onUpdate }: EntryEditorProps) {
  const theme = useTheme();

  const [saveState,      setSaveState]      = useState<"saved" | "saving" | "idle">("idle");
  const [nugget,         setNugget]         = useState<string | null>(null);
  const [insightLoading, setInsightLoading] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleBodyChange = useCallback((value: string) => {
    onUpdate({ body: value });
    setSaveState("saving");
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => setSaveState("saved"), 800);
  }, [onUpdate]);

  useEffect(() => {
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, []);

  const handleInsight = useCallback(async () => {
    if (!entry.body.trim()) return;
    setInsightLoading(true);
    try {
      const res  = await fetch("/api/journal-insight", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ entry: entry.body }),
      });
      const data: JournalInsight = await res.json();
      setNugget(data.nugget);
    } catch {
      setNugget("Could not extract wisdom right now. Try again.");
    } finally {
      setInsightLoading(false);
    }
  }, [entry.body]);

  return (
    <motion.div
      key={entry.id}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      style={{ flex: 1, display: "flex", flexDirection: "column", overflowY: "auto" }}
    >
      <div style={{ maxWidth: "680px", width: "100%", margin: "0 auto", padding: "32px 24px", display: "flex", flexDirection: "column", gap: "24px" }}>

        {/* Daily Spark — quote shown at top to inspire writing */}
        {spark && (
          <motion.div
            initial={{ opacity: 0, filter: "blur(6px)" }}
            animate={{ opacity: 1, filter: "blur(0px)" }}
            transition={{ duration: 0.7 }}
            style={{
              borderRadius: "12px",
              border: `1px solid ${theme.accent}25`,
              background: `${theme.accent}08`,
              padding: "16px",
            }}
          >
            <p style={{ fontSize: "10px", fontFamily: "sans-serif", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: theme.accent, marginBottom: "6px" }}>
              Daily Spark
            </p>
            <p style={{ fontSize: "13px", fontStyle: "italic", color: theme.text, opacity: 0.8, lineHeight: 1.6 }}>
              {spark}
            </p>
          </motion.div>
        )}

        {/* Title input */}
        <input
          type="text"
          value={entry.title}
          onChange={(e) => onUpdate({ title: e.target.value })}
          placeholder="Untitled reflection..."
          style={{
            width: "100%",
            background: "transparent",
            border: "none",
            outline: "none",
            fontSize: "24px",
            fontFamily: "'Georgia', serif",
            fontWeight: 600,
            color: theme.text,
            padding: 0,
          }}
        />

        {/* Auto-save indicator */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <PenLine size={12} color={theme.textMuted} style={{ opacity: 0.4 }} />
          <span style={{ fontSize: "11px", fontFamily: "sans-serif", color: theme.textMuted, opacity: 0.5 }}>
            {saveState === "saving" && (
              <span style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                <Loader2 size={12} style={{ animation: "spin 1s linear infinite" }} />
                Saving...
              </span>
            )}
            {saveState === "saved" && "Saved"}
            {saveState === "idle"  && "Ready"}
          </span>
        </div>

        {/* Writing textarea */}
        <textarea
          value={entry.body}
          onChange={(e) => handleBodyChange(e.target.value)}
          placeholder="Begin writing — let it flow without judgment..."
          rows={12}
          style={{
            width: "100%",
            background: "transparent",
            border: "none",
            outline: "none",
            resize: "none",
            fontSize: "14px",
            fontFamily: "'Georgia', serif",
            lineHeight: 1.8,
            color: theme.text,
            padding: 0,
          }}
        />

        {/* Energy tracker slider */}
        <EnergyTracker
          value={entry.energy}
          onChange={(v) => onUpdate({ energy: v })}
        />

        {/* Auto-nuke toggle */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          borderRadius: "12px",
          border: `1px solid ${theme.cardBorder}`,
          background: `${theme.cardBg}80`,
          padding: "12px 16px",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Timer size={16} color="#e05555" style={{ opacity: 0.7 }} />
            <div>
              <p style={{ fontSize: "12px", fontFamily: "sans-serif", fontWeight: 500, color: theme.text, marginBottom: "2px" }}>
                Self-Destruct after 24 hours
              </p>
              <p style={{ fontSize: "10px", fontFamily: "sans-serif", color: theme.textMuted }}>
                Entry will auto-delete for your safety.
              </p>
            </div>
          </div>

          {/* Toggle switch */}
          <button
            type="button"
            role="switch"
            aria-checked={entry.autoNuke}
            onClick={() => onUpdate({ autoNuke: !entry.autoNuke })}
            style={{
              position: "relative",
              width: "44px", height: "24px",
              borderRadius: "12px",
              border: "none",
              cursor: "pointer",
              transition: "background 0.2s",
              background: entry.autoNuke ? "rgba(224,85,85,0.6)" : theme.cardBorder,
              flexShrink: 0,
            }}
          >
            <span style={{
              position: "absolute",
              top: "2px",
              left: entry.autoNuke ? "22px" : "2px",
              width: "20px", height: "20px",
              borderRadius: "50%",
              background: "white",
              transition: "left 0.2s",
              boxShadow: "0 1px 3px rgba(0,0,0,0.3)",
            }} />
          </button>
        </div>

        {/* Wisdom nugget */}
        <WisdomNugget
          nugget={nugget}
          loading={insightLoading}
          onGenerate={handleInsight}
          disabled={!entry.body.trim()}
        />

        {/* Encryption note */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px", paddingBottom: "24px" }}>
          <ShieldCheck size={13} color={theme.accent} style={{ opacity: 0.5 }} />
          <p style={{ fontSize: "11px", fontFamily: "sans-serif", color: theme.textMuted, opacity: 0.5 }}>
            Your words are encrypted and owned by you.
          </p>
        </div>

      </div>
    </motion.div>
  );
}
