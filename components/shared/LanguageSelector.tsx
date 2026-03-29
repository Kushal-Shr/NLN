"use client";

import { Globe } from "lucide-react";
import { useTheme } from "@/lib/ThemeContext";
import { useLanguage, SUPPORTED_LANGUAGES } from "@/lib/LanguageContext";
import type { LanguageCode } from "@/lib/LanguageContext";

export default function LanguageSelector() {
  const theme = useTheme();
  const { language, setLanguage } = useLanguage();

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
      <Globe
        style={{ width: "14px", height: "14px", color: theme.textMuted }}
      />
      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value as LanguageCode)}
        style={{
          appearance: "none",
          WebkitAppearance: "none",
          background: "none",
          border: `1px solid ${theme.cardBorder}`,
          borderRadius: "8px",
          padding: "4px 24px 4px 8px",
          fontSize: "11px",
          fontFamily: "sans-serif",
          color: theme.text,
          cursor: "pointer",
          outline: "none",
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 24 24' fill='none' stroke='%23999' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "right 6px center",
        }}
      >
        {SUPPORTED_LANGUAGES.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.label}
          </option>
        ))}
      </select>
    </div>
  );
}
