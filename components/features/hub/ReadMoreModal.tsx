"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  CheckCircle2,
  ExternalLink,
  Bookmark,
  BookmarkCheck,
} from "lucide-react";
import type { LibraryResult } from "@/lib/types";

interface ReadMoreModalProps {
  open: boolean;
  result: LibraryResult | null;
  bookmarked: boolean;
  bookmarking: boolean;
  onClose: () => void;
  onBookmark: () => void;
}

export default function ReadMoreModal({
  open,
  result,
  bookmarked,
  bookmarking,
  onClose,
  onBookmark,
}: ReadMoreModalProps) {
  if (!result) return null;

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
          />

          <motion.div
            key="modal"
            initial={{ opacity: 0, y: 40, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.97 }}
            transition={{ type: "spring" as const, stiffness: 350, damping: 30 }}
            className="fixed inset-x-4 top-[5vh] bottom-[5vh] z-50 mx-auto flex max-w-2xl flex-col overflow-hidden rounded-2xl border border-white/10 bg-slate-900 shadow-2xl md:inset-x-auto"
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-4 border-b border-white/10 p-6">
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-stealth-accent">
                  Library Entry
                </p>
                <h2 className="mt-1 text-xl font-semibold leading-tight text-white">
                  {result.title}
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onBookmark}
                  disabled={bookmarked || bookmarking}
                  className={`rounded-lg border p-2 transition ${
                    bookmarked
                      ? "border-amber-500/30 bg-amber-500/10 text-amber-400"
                      : "border-white/10 text-stealth-muted hover:border-amber-500/30 hover:text-amber-400"
                  }`}
                  aria-label={bookmarked ? "Bookmarked" : "Bookmark"}
                >
                  {bookmarked ? (
                    <BookmarkCheck className="h-4 w-4" />
                  ) : (
                    <Bookmark className="h-4 w-4" />
                  )}
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-lg border border-white/10 p-2 text-stealth-muted transition hover:text-white"
                  aria-label="Close"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              {/* Description */}
              <div className="space-y-3 text-sm leading-relaxed text-slate-300">
                {result.description.split("\n").map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>

              {/* Guidance */}
              <div>
                <h3 className="mb-4 text-xs font-semibold uppercase tracking-widest text-stealth-muted">
                  Actionable Steps
                </h3>
                <div className="space-y-3">
                  {result.guidance.map((step, i) => (
                    <div key={i} className="flex gap-3">
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-stealth-accent/15 text-[10px] font-bold text-stealth-accent">
                        {i + 1}
                      </span>
                      <p className="text-sm leading-relaxed text-slate-300">
                        {step}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Citations */}
              <div>
                <h3 className="mb-4 text-xs font-semibold uppercase tracking-widest text-stealth-muted">
                  Trusted Sources
                </h3>
                <div className="space-y-2">
                  {result.citations.map((citation, i) => (
                    <a
                      key={i}
                      href={citation.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3 transition hover:border-teal-500/30 hover:bg-teal-500/5"
                    >
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-teal-500" />
                      <span className="flex-1 text-sm font-medium text-slate-200 group-hover:text-teal-400">
                        {citation.sourceName}
                      </span>
                      <ExternalLink className="h-3.5 w-3.5 shrink-0 text-stealth-muted/50 transition group-hover:text-teal-500" />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
