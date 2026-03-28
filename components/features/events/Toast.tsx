"use client";

import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle } from "lucide-react";

type ToastProps = {
  message: string | null;
};

export default function Toast({ message }: ToastProps) {
  return (
    <AnimatePresence>
      {message && (
        <motion.div
          key="toast"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          transition={{ type: "spring" as const, stiffness: 400, damping: 28 }}
          className="fixed bottom-20 left-1/2 z-[80] -translate-x-1/2"
        >
          <div className="inline-flex items-center gap-2 rounded-xl border border-stealth-accent/30 bg-stealth-card px-5 py-3 shadow-xl">
            <CheckCircle className="h-4 w-4 text-stealth-accent" />
            <span className="text-sm font-medium text-stealth-text">
              {message}
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
