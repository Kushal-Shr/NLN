"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  CheckCircle2,
  ExternalLink,
  Bookmark,
  BookmarkCheck,
} from "lucide-react";
import { useTheme } from "@/lib/ThemeContext";
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
  const theme = useTheme();

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
            className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm"
          />

          <motion.div
            key="modal"
            initial={{ opacity: 0, y: 40, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.97 }}
            transition={{ type: "spring" as const, stiffness: 350, damping: 30 }}
            className="fixed inset-x-4 top-[5vh] bottom-[5vh] z-50 mx-auto flex max-w-2xl flex-col overflow-hidden rounded-2xl shadow-xl md:inset-x-auto"
            style={{
              backgroundColor: theme.cardBg,
              border: `1px solid ${theme.cardBorder}`,
            }}
          >
            {/* Header */}
            <div
              className="flex items-start justify-between gap-4 p-6"
              style={{ borderBottom: `1px solid ${theme.cardBorder}` }}
            >
              <div className="min-w-0 flex-1">
                <p
                  className="text-[10px] font-semibold uppercase tracking-widest"
                  style={{ color: theme.accent }}
                >
                  Library Entry
                </p>
                <h2
                  className="mt-1 text-xl font-semibold leading-tight"
                  style={{ color: theme.text }}
                >
                  {result.title}
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onBookmark}
                  disabled={bookmarked || bookmarking}
                  className="rounded-lg p-2 transition"
                  style={{
                    border: `1px solid ${bookmarked ? theme.accent : theme.cardBorder}`,
                    backgroundColor: bookmarked ? `${theme.accent}15` : "transparent",
                    color: bookmarked ? theme.accent : theme.textMuted,
                  }}
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
                  className="rounded-lg p-2 transition"
                  style={{
                    border: `1px solid ${theme.cardBorder}`,
                    color: theme.textMuted,
                  }}
                  aria-label="Close"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              {/* Description */}
              <div className="space-y-3 text-sm leading-relaxed" style={{ color: theme.text, opacity: 0.85 }}>
                {result.description.split("\n").map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>

              {/* Guidance */}
              <div>
                <h3
                  className="mb-4 text-xs font-semibold uppercase tracking-widest"
                  style={{ color: theme.textMuted }}
                >
                  Actionable Steps
                </h3>
                <div className="space-y-3">
                  {result.guidance.map((step, i) => (
                    <div key={i} className="flex gap-3">
                      <span
                        className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold"
                        style={{
                          backgroundColor: `${theme.accent}18`,
                          color: theme.accent,
                        }}
                      >
                        {i + 1}
                      </span>
                      <p className="text-sm leading-relaxed" style={{ color: theme.text, opacity: 0.85 }}>
                        {step}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Citations */}
              <div>
                <h3
                  className="mb-4 text-xs font-semibold uppercase tracking-widest"
                  style={{ color: theme.textMuted }}
                >
                  Trusted Sources
                </h3>
                <div className="space-y-2">
                  {result.citations.map((citation, i) => (
                    <a
                      key={i}
                      href={citation.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center gap-3 rounded-xl px-4 py-3 transition"
                      style={{
                        border: `1px solid ${theme.cardBorder}`,
                        backgroundColor: `${theme.accent}08`,
                      }}
                    >
                      <CheckCircle2 className="h-4 w-4 shrink-0" style={{ color: theme.accent }} />
                      <span
                        className="flex-1 text-sm font-medium"
                        style={{ color: theme.text }}
                      >
                        {citation.sourceName}
                      </span>
                      <ExternalLink className="h-3.5 w-3.5 shrink-0" style={{ color: theme.textMuted }} />
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
