"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BookOpen, Menu, X } from "lucide-react";
import JournalSidebar from "@/components/features/journal/JournalSidebar";
import EntryEditor from "@/components/features/journal/EntryEditor";
import { SEED_ENTRIES } from "@/components/features/journal/types";
import type { JournalEntry } from "@/components/features/journal/types";
import type { JournalSpark } from "@/lib/gemini";

function createBlankEntry(): JournalEntry {
  return {
    id: `entry-${Date.now()}`,
    title: "",
    body: "",
    energy: 50,
    autoNuke: false,
    createdAt: new Date().toISOString(),
  };
}

export default function JournalPage() {
  const [entries, setEntries] = useState<JournalEntry[]>(SEED_ENTRIES);
  const [activeId, setActiveId] = useState<string | null>(
    SEED_ENTRIES[0]?.id ?? null
  );
  const [spark, setSpark] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    fetch("/api/journal-spark")
      .then((r) => r.json())
      .then((data: JournalSpark) => setSpark(data.prompt))
      .catch(() => setSpark(null));
  }, []);

  const activeEntry = entries.find((e) => e.id === activeId) ?? null;

  const handleSelect = useCallback((id: string) => {
    setActiveId(id);
    setMobileOpen(false);
  }, []);

  const handleNew = useCallback(() => {
    const blank = createBlankEntry();
    setEntries((prev) => [blank, ...prev]);
    setActiveId(blank.id);
    setMobileOpen(false);
  }, []);

  const handleUpdate = useCallback(
    (patch: Partial<JournalEntry>) => {
      setEntries((prev) =>
        prev.map((e) => (e.id === activeId ? { ...e, ...patch } : e))
      );
    },
    [activeId]
  );

  return (
    <div className="flex h-screen overflow-hidden bg-slate-950 pt-16">
      {/* Mobile toggle */}
      <button
        type="button"
        onClick={() => setMobileOpen((v) => !v)}
        className="fixed left-4 top-4 z-50 rounded-lg bg-stealth-card p-2 text-stealth-muted shadow-lg md:hidden"
        aria-label="Toggle sidebar"
      >
        {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {/* Mobile backdrop */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            key="journal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/60 md:hidden"
            onClick={() => setMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 transition-transform duration-300 md:static md:z-auto md:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <JournalSidebar
          entries={entries}
          activeId={activeId}
          onSelect={handleSelect}
          onNew={handleNew}
        />
      </div>

      {/* Editor pane */}
      <main className="flex min-w-0 flex-1 flex-col">
        <AnimatePresence mode="wait">
          {activeEntry ? (
            <EntryEditor
              key={activeEntry.id}
              entry={activeEntry}
              spark={spark}
              onUpdate={handleUpdate}
            />
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-1 flex-col items-center justify-center gap-4"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-stealth-card">
                <BookOpen className="h-7 w-7 text-stealth-muted" />
              </div>
              <p className="text-sm text-stealth-muted">
                Select a reflection or start a new one.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
