"use client";

import { Search } from "lucide-react";

type SearchBarProps = {
  query: string;
  onChange: (value: string) => void;
  onSearch: () => void;
  loading: boolean;
};

export default function SearchBar({
  query,
  onChange,
  onSearch,
  loading,
}: SearchBarProps) {
  return (
    <div className="flex items-center gap-3">
      <div className="relative flex-1">
        <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-stealth-muted" />
        <input
          type="text"
          value={query}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") onSearch();
          }}
          placeholder="Search for wisdom or resilience techniques..."
          className="w-full rounded-xl border border-white/10 bg-stealth-card py-3 pl-10 pr-4 text-sm text-stealth-text placeholder:text-stealth-muted/60 transition focus:border-stealth-accent/50 focus:outline-none focus:ring-1 focus:ring-stealth-accent/30"
        />
      </div>
      <button
        type="button"
        onClick={onSearch}
        disabled={loading}
        className="shrink-0 rounded-xl bg-stealth-accent px-5 py-3 text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-50"
      >
        {loading ? "Generating..." : "Generate Wisdom"}
      </button>
    </div>
  );
}
