"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";

type WisdomNuggetProps = {
  nugget: string | null;
  loading: boolean;
  onGenerate: () => void;
  disabled: boolean;
};

export default function WisdomNugget({
  nugget,
  loading,
  onGenerate,
  disabled,
}: WisdomNuggetProps) {
  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={onGenerate}
        disabled={disabled || loading}
        className="inline-flex items-center gap-2 rounded-lg bg-amber-500/10 px-3.5 py-2 text-xs font-medium text-amber-400 transition hover:bg-amber-500/20 disabled:opacity-40"
      >
        <Sparkles className="h-3.5 w-3.5" />
        {loading ? "Extracting wisdom..." : "Generate Insight"}
      </button>

      <AnimatePresence mode="wait">
        {nugget && !loading && (
          <motion.div
            key="nugget"
            initial={{ opacity: 0, y: 8, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -6, filter: "blur(4px)" }}
            transition={{ duration: 0.5 }}
            className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4"
          >
            <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-widest text-amber-400/70">
              Wisdom Nugget
            </p>
            <p className="text-sm italic leading-relaxed text-stealth-text/90">
              &ldquo;{nugget}&rdquo;
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
