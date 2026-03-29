"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, BookOpen } from "lucide-react";
import type { JournalEntry } from "./types";
import { useTheme } from "@/lib/ThemeContext";

type JournalSidebarProps = {
  entries: JournalEntry[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onNew: () => void;
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export default function JournalSidebar({ entries, activeId, onSelect, onNew }: JournalSidebarProps) {
  const theme = useTheme();
  const [search, setSearch] = useState("");

  const filtered = entries.filter((e) =>
    e.title.toLowerCase().includes(search.toLowerCase()) ||
    e.body.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <aside style={{
      width: "280px",
      flexShrink: 0,
      display: "flex",
      flexDirection: "column",
      borderRight: `1px solid ${theme.cardBorder}`,
      backgroundColor: theme.surface,
      height: "100%",
    }}>

      {/* Header */}
      <div style={{
        padding: "16px",
        borderBottom: `1px solid ${theme.cardBorder}`,
        display: "flex",
        flexDirection: "column",
        gap: "12px",
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <BookOpen size={16} color={theme.accent} />
            <span style={{
              fontSize: "10px", fontFamily: "sans-serif",
              fontWeight: 700, letterSpacing: "0.16em",
              textTransform: "uppercase", color: theme.textMuted,
            }}>
              Past Reflections
            </span>
          </div>

          {/* New entry button */}
          <button
            type="button"
            onClick={onNew}
            style={{
              background: `${theme.accent}18`,
              color: theme.accent,
              border: `1px solid ${theme.accent}30`,
              borderRadius: "8px",
              padding: "4px 10px",
              fontSize: "11px",
              fontFamily: "sans-serif",
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.2s",
            }}
          >
            + New
          </button>
        </div>

        {/* Search */}
        <div style={{ position: "relative" }}>
          <Search
            size={13}
            color={theme.textMuted}
            style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search reflections..."
            style={{
              width: "100%",
              background: theme.cardBg,
              border: `1px solid ${theme.cardBorder}`,
              borderRadius: "10px",
              padding: "8px 12px 8px 34px",
              fontSize: "12px",
              fontFamily: "sans-serif",
              color: theme.text,
              outline: "none",
              boxSizing: "border-box",
            }}
            onFocus={(e) => e.target.style.borderColor = theme.accent}
            onBlur={(e)  => e.target.style.borderColor = theme.cardBorder}
          />
        </div>
      </div>

      {/* Entry list */}
      <div style={{ flex: 1, overflowY: "auto", padding: "8px" }}>
        <AnimatePresence initial={false}>
          {filtered.map((entry) => (
            <motion.button
              key={entry.id}
              type="button"
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              onClick={() => onSelect(entry.id)}
              style={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                padding: "10px 12px",
                borderRadius: "10px",
                marginBottom: "4px",
                cursor: "pointer",
                textAlign: "left",
                transition: "all 0.2s",
                background: activeId === entry.id ? `${theme.accent}12` : "transparent",
                border: activeId === entry.id
                  ? `1px solid ${theme.accent}30`
                  : "1px solid transparent",
              }}
            >
              <div style={{ display: "flex", width: "100%", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{
                  fontSize: "13px", fontFamily: "sans-serif",
                  fontWeight: 500, color: theme.text,
                  overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                }}>
                  {entry.title || "Untitled"}
                </span>
                <span style={{ fontSize: "10px", fontFamily: "sans-serif", color: theme.textMuted, flexShrink: 0, marginLeft: "8px" }}>
                  {formatDate(entry.createdAt)}
                </span>
              </div>
              <p style={{
                fontSize: "11px", fontFamily: "sans-serif",
                color: theme.textMuted, marginTop: "3px",
                overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", width: "100%",
              }}>
                {entry.body.slice(0, 60) || "Empty entry..."}
              </p>
            </motion.button>
          ))}
        </AnimatePresence>

        {filtered.length === 0 && (
          <p style={{ textAlign: "center", fontSize: "12px", fontFamily: "sans-serif", color: theme.textMuted, padding: "24px 12px" }}>
            No reflections match your search.
          </p>
        )}
      </div>
    </aside>
  );
}