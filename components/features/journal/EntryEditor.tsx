"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { PenLine, ShieldCheck, Timer, Loader2 } from "lucide-react";
import EnergyTracker from "./EnergyTracker";
import WisdomNugget from "./WisdomNugget";
import type { JournalEntry } from "./types";
import type { JournalInsight } from "@/lib/gemini";

type EntryEditorProps = {
  entry: JournalEntry;
  spark: string | null;
  onUpdate: (patch: Partial<JournalEntry>) => void;
};

export default function EntryEditor({
  entry,
  spark,
  onUpdate,
}: EntryEditorProps) {
  const [saveState, setSaveState] = useState<"saved" | "saving" | "idle">("idle");
  const [nugget, setNugget] = useState<string | null>(null);
  const [insightLoading, setInsightLoading] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleBodyChange = useCallback(
    (value: string) => {
      onUpdate({ body: value });
      setSaveState("saving");

      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        setSaveState("saved");
      }, 800);
    },
    [onUpdate]
  );

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  const handleInsight = useCallback(async () => {
    if (!entry.body.trim()) return;
    setInsightLoading(true);
    try {
      const res = await fetch("/api/journal-insight", {
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
      className="flex flex-1 flex-col overflow-y-auto"
    >
      <div className="mx-auto w-full max-w-2xl space-y-6 px-6 py-8">
        {/* Daily Spark */}
        {spark && (
          <motion.div
            initial={{ opacity: 0, filter: "blur(6px)" }}
            animate={{ opacity: 1, filter: "blur(0px)" }}
            transition={{ duration: 0.7 }}
            className="rounded-xl border border-stealth-accent/20 bg-stealth-accent/5 p-4"
          >
            <p className="mb-1 text-[10px] font-semibold uppercase tracking-widest text-stealth-accent">
              Daily Spark
            </p>
            <p className="text-sm italic text-stealth-text/80">{spark}</p>
          </motion.div>
        )}

        {/* Title */}
        <input
          type="text"
          value={entry.title}
          onChange={(e) => onUpdate({ title: e.target.value })}
          placeholder="Untitled reflection..."
          className="w-full bg-transparent text-2xl font-semibold text-stealth-text placeholder:text-stealth-muted/30 focus:outline-none"
        />

        {/* Auto-save indicator */}
        <div className="flex items-center gap-2">
          <PenLine className="h-3 w-3 text-stealth-muted/40" />
          <span className="text-[11px] text-stealth-muted/50">
            {saveState === "saving" && (
              <span className="inline-flex items-center gap-1">
                <Loader2 className="h-3 w-3 animate-spin" /> Saving...
              </span>
            )}
            {saveState === "saved" && "Saved"}
            {saveState === "idle" && "Ready"}
          </span>
        </div>

        {/* Writing area */}
        <textarea
          value={entry.body}
          onChange={(e) => handleBodyChange(e.target.value)}
          placeholder="Begin writing — let it flow without judgment..."
          rows={12}
          className="w-full resize-none bg-transparent text-sm leading-relaxed text-stealth-text placeholder:text-stealth-muted/30 focus:outline-none"
        />

        {/* Energy Tracker */}
        <EnergyTracker
          value={entry.energy}
          onChange={(v) => onUpdate({ energy: v })}
        />

        {/* Auto-Nuke toggle */}
        <div className="flex items-center justify-between rounded-lg border border-white/10 bg-stealth-card/50 px-4 py-3">
          <div className="flex items-center gap-2">
            <Timer className="h-4 w-4 text-red-400/70" />
            <div>
              <p className="text-xs font-medium text-stealth-text">
                Self-Destruct after 24 hours
              </p>
              <p className="text-[10px] text-stealth-muted">
                Entry will auto-nuke for your safety.
              </p>
            </div>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={entry.autoNuke}
            onClick={() => onUpdate({ autoNuke: !entry.autoNuke })}
            className={`relative h-6 w-11 rounded-full transition ${
              entry.autoNuke ? "bg-red-500/60" : "bg-slate-700"
            }`}
          >
            <span
              className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                entry.autoNuke ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
        </div>

        {/* Wisdom Nugget */}
        <WisdomNugget
          nugget={nugget}
          loading={insightLoading}
          onGenerate={handleInsight}
          disabled={!entry.body.trim()}
        />

        {/* Encryption note */}
        <div className="flex items-center gap-2 pb-6 pt-2">
          <ShieldCheck className="h-3.5 w-3.5 text-stealth-accent/50" />
          <p className="text-[11px] text-stealth-muted/50">
            Your words are encrypted and owned by you.
          </p>
        </div>
      </div>
    </motion.div>
  );
}
