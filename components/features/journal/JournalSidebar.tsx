"use client";

import { Search, BookOpen } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { JournalEntry } from "./types";

type JournalSidebarProps = {
  entries: JournalEntry[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onNew: () => void;
};

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}

export default function JournalSidebar({
  entries,
  activeId,
  onSelect,
  onNew,
}: JournalSidebarProps) {
  const [search, setSearch] = useState("");

  const filtered = entries.filter(
    (e) =>
      e.title.toLowerCase().includes(search.toLowerCase()) ||
      e.body.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <aside className="flex w-72 shrink-0 flex-col border-r border-white/10 bg-slate-950/80">
      {/* Header */}
      <div className="space-y-3 border-b border-white/10 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-stealth-accent" />
            <span className="text-xs font-semibold uppercase tracking-widest text-stealth-muted">
              Past Reflections
            </span>
          </div>
          <button
            type="button"
            onClick={onNew}
            className="rounded-lg bg-stealth-accent/15 px-2.5 py-1 text-[11px] font-medium text-stealth-accent transition hover:bg-stealth-accent/25"
          >
            + New
          </button>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-stealth-muted/50" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search reflections..."
            className="w-full rounded-lg border border-white/10 bg-stealth-card py-2 pl-9 pr-3 text-xs text-stealth-text placeholder:text-stealth-muted/40 focus:border-stealth-accent/40 focus:outline-none"
          />
        </div>
      </div>

      {/* Entry list */}
      <div className="flex-1 overflow-y-auto p-2">
        <AnimatePresence initial={false}>
          {filtered.map((entry) => (
            <motion.button
              key={entry.id}
              type="button"
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              onClick={() => onSelect(entry.id)}
              className={`mb-1 flex w-full flex-col items-start rounded-lg px-3 py-2.5 text-left transition ${
                activeId === entry.id
                  ? "bg-stealth-accent/10 border border-stealth-accent/20"
                  : "hover:bg-white/5 border border-transparent"
              }`}
            >
              <div className="flex w-full items-center justify-between">
                <span className="text-sm font-medium text-stealth-text truncate">
                  {entry.title || "Untitled"}
                </span>
                <span className="shrink-0 text-[10px] text-stealth-muted">
                  {formatDate(entry.createdAt)}
                </span>
              </div>
              <p className="mt-0.5 w-full truncate text-xs text-stealth-muted">
                {entry.body.slice(0, 60) || "Empty entry..."}
              </p>
            </motion.button>
          ))}
        </AnimatePresence>
        {filtered.length === 0 && (
          <p className="px-3 py-6 text-center text-xs text-stealth-muted">
            No reflections match your search.
          </p>
        )}
      </div>
    </aside>
  );
}
