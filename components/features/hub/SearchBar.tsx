"use client";

// ============================================================
// components/features/hub/SearchBar.tsx
// Search input + Generate Wisdom button
// ============================================================

import { Search } from "lucide-react";
import { useTheme } from "@/lib/ThemeContext";

type SearchBarProps = {
  query: string;
  onChange: (value: string) => void;
  onSearch: () => void;
  loading: boolean;
};

export default function SearchBar({ query, onChange, onSearch, loading }: SearchBarProps) {
  const theme = useTheme();

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>

      {/* Input wrapper — relative so we can position the icon inside */}
      <div style={{ position: "relative", flex: 1 }}>

        {/* Search icon inside the input */}
        <Search
          style={{
            position: "absolute", left: "14px",
            top: "50%", transform: "translateY(-50%)",
            width: "16px", height: "16px",
            color: theme.textMuted, pointerEvents: "none",
          }}
        />

        {/* The actual input */}
        <input
          type="text"
          value={query}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") onSearch(); }}
          placeholder="Search for wisdom or resilience techniques..."
          style={{
            width: "100%",
            background: theme.cardBg,
            border: `1px solid ${theme.cardBorder}`,
            borderRadius: "12px",
            padding: "13px 16px 13px 42px",   // left padding leaves room for icon
            fontSize: "14px",
            fontFamily: "sans-serif",
            color: theme.text,
            outline: "none",
            transition: "border-color 0.2s",
          }}
          // Focus style via onFocus/onBlur since we can't use CSS pseudo-classes inline
          onFocus={(e) => e.target.style.borderColor = theme.accent}
          onBlur={(e)  => e.target.style.borderColor = theme.cardBorder}
        />
      </div>

      {/* Generate button */}
      <button
        type="button"
        onClick={onSearch}
        disabled={loading}
        style={{
          flexShrink: 0,
          background: loading ? theme.textMuted : theme.accent,
          color: theme.bg,
          border: "none",
          borderRadius: "12px",
          padding: "13px 22px",
          fontSize: "14px",
          fontFamily: "sans-serif",
          fontWeight: 600,
          cursor: loading ? "not-allowed" : "pointer",
          transition: "all 0.2s",
          opacity: loading ? 0.6 : 1,
          whiteSpace: "nowrap",
        }}
      >
        {loading ? "Generating..." : "Generate Wisdom"}
      </button>
    </div>
  );
}
