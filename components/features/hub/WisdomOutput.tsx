"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Lamp } from "lucide-react";

type WisdomOutputProps = {
  metaphor: string | null;
  loading: boolean;
};

export default function WisdomOutput({ metaphor, loading }: WisdomOutputProps) {
  return (
    <AnimatePresence mode="wait">
      {loading && (
        <motion.div
          key="loading"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="flex items-center gap-3 rounded-xl border border-stealth-accent/20 bg-stealth-accent/5 p-5"
        >
          <Lamp className="h-5 w-5 animate-pulse text-stealth-accent" />
          <span className="text-sm text-stealth-muted">
            Refueling the lantern... gathering wisdom for you.
          </span>
        </motion.div>
      )}

      {!loading && metaphor && (
        <motion.div
          key="metaphor"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ type: "spring", stiffness: 300, damping: 24 }}
          className="rounded-xl border border-stealth-accent/30 bg-gradient-to-br from-stealth-accent/10 to-transparent p-6"
        >
          <div className="mb-3 flex items-center gap-2">
            <Lamp className="h-5 w-5 text-stealth-accent" />
            <span className="text-xs font-semibold uppercase tracking-widest text-stealth-accent">
              The Lantern Speaks
            </span>
          </div>
          <p className="text-base italic leading-relaxed text-stealth-text/90">
            &ldquo;{metaphor}&rdquo;
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
