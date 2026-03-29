"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BookOpen, Menu, X } from "lucide-react";
import JournalSidebar from "@/components/features/journal/JournalSidebar";
import EntryEditor from "@/components/features/journal/EntryEditor";
import { SEED_ENTRIES } from "@/components/features/journal/types";
import type { JournalEntry } from "@/components/features/journal/types";
import type { JournalSpark } from "@/lib/gemini";
import Navbar from "@/components/shared/Navbar";
import ThemeDoodles from "@/components/shared/ThemesDoddles";
import { useTheme } from "@/lib/ThemeContext";

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
  const theme = useTheme();

  const [entries,    setEntries]    = useState<JournalEntry[]>(SEED_ENTRIES);
  const [activeId,   setActiveId]   = useState<string | null>(SEED_ENTRIES[0]?.id ?? null);
  const [spark,      setSpark]      = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mounted,    setMounted]    = useState(false);

  useEffect(() => {
    setMounted(true);
    fetch("/api/journal-spark")
      .then((r) => r.json())
      .then((data: JournalSpark) => setSpark(data.prompt))
      .catch(() => setSpark(null));
  }, []);

  if (!mounted) return null;

  const activeEntry = entries.find((e) => e.id === activeId) ?? null;

  const handleSelect = (id: string) => {
    setActiveId(id);
    setMobileOpen(false);
  };

  const handleNew = () => {
    const blank = createBlankEntry();
    setEntries((prev) => [blank, ...prev]);
    setActiveId(blank.id);
    setMobileOpen(false);
  };

  const handleUpdate = (patch: Partial<JournalEntry>) => {
    setEntries((prev) =>
      prev.map((e) => (e.id === activeId ? { ...e, ...patch } : e))
    );
  };

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column", backgroundColor: theme.bg, position: "relative", overflow: "hidden" }}>

      {/* Background doodles */}
      <ThemeDoodles />

      {/* Navbar */}
      <div style={{ position: "relative", zIndex: 10 }}>
        <Navbar />
      </div>

      {/* Mobile toggle button */}
      <button
        type="button"
        onClick={() => setMobileOpen((v) => !v)}
        style={{
          position: "fixed", left: "16px", top: "70px", zIndex: 50,
          background: theme.cardBg, border: `1px solid ${theme.cardBorder}`,
          borderRadius: "10px", padding: "8px", color: theme.textMuted,
          cursor: "pointer", display: "none", // hide on desktop
        }}
        aria-label="Toggle sidebar"
      >
        {mobileOpen ? <X size={18} /> : <Menu size={18} />}
      </button>

      {/* Mobile backdrop */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            key="journal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileOpen(false)}
            style={{
              position: "fixed", inset: 0, zIndex: 40,
              background: "rgba(0,0,0,0.5)",
            }}
          />
        )}
      </AnimatePresence>

      {/* Main layout — sidebar + editor */}
      <div style={{ display: "flex", flex: 1, overflow: "hidden", position: "relative", zIndex: 1 }}>

        {/* SIDEBAR */}
        <div style={{
          transform: mobileOpen ? "translateX(0)" : undefined,
          flexShrink: 0,
        }}>
          <JournalSidebar
            entries={entries}
            activeId={activeId}
            onSelect={handleSelect}
            onNew={handleNew}
          />
        </div>

        {/* EDITOR PANE */}
        <main style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, overflowY: "auto" }}>
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
                style={{
                  flex: 1, display: "flex", flexDirection: "column",
                  alignItems: "center", justifyContent: "center", gap: "16px",
                }}
              >
                <div style={{
                  width: "64px", height: "64px", borderRadius: "16px",
                  background: theme.cardBg, border: `1px solid ${theme.cardBorder}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <BookOpen size={28} color={theme.textMuted} />
                </div>
                <p style={{ fontSize: "13px", fontFamily: "sans-serif", color: theme.textMuted }}>
                  Select a reflection or start a new one.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
