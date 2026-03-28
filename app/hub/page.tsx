"use client";

import { useCallback, useState } from "react";
import { motion } from "framer-motion";
import { BookOpen } from "lucide-react";
import VibeCheck, { FEELINGS } from "@/components/features/hub/VibeCheck";
import SearchBar from "@/components/features/hub/SearchBar";
import ResourceCards from "@/components/features/hub/ResourceCards";
import WisdomOutput from "@/components/features/hub/WisdomOutput";
import PageContainer from "@/components/shared/PageContainer";
import type { GeminiResponse } from "@/lib/gemini";

export default function HubPage() {
  const [selectedFeelings, setSelectedFeelings] = useState<string[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<GeminiResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const toggleFeeling = useCallback((id: string) => {
    setSelectedFeelings((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  }, []);

  const generateWisdom = useCallback(async () => {
    if (selectedFeelings.length === 0 && !query.trim()) {
      setError("Select a vibe or type a search to begin.");
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const feelingLabels = selectedFeelings.map(
        (id) => FEELINGS.find((f) => f.id === id)?.label ?? id
      );

      const res = await fetch("/api/hub-generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ feelings: feelingLabels, query }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Something went wrong.");
      }

      const data: GeminiResponse = await res.json();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate wisdom.");
    } finally {
      setLoading(false);
    }
  }, [selectedFeelings, query]);

  return (
    <PageContainer>
    <main className="space-y-10">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-1"
      >
        <div className="flex items-center gap-2.5">
          <BookOpen className="h-6 w-6 text-stealth-accent" />
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-stealth-muted">
            Wisdom Library
          </p>
        </div>
        <h1 className="text-3xl font-semibold text-stealth-text">
          Information Hub
        </h1>
        <p className="max-w-xl text-sm text-stealth-muted">
          A quiet space to check in, explore resilience techniques, and receive
          personalised insight — no clinical labels, just clarity.
        </p>
      </motion.header>

      {/* Search & Generate */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
      >
        <SearchBar
          query={query}
          onChange={setQuery}
          onSearch={generateWisdom}
          loading={loading}
        />
      </motion.div>

      {/* Vibe Check */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
      >
        <VibeCheck selected={selectedFeelings} onToggle={toggleFeeling} />
      </motion.div>

      {/* Error */}
      {error && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-sm text-red-400"
        >
          {error}
        </motion.p>
      )}

      {/* Wisdom Loading / Metaphor */}
      <WisdomOutput metaphor={result?.metaphor ?? null} loading={loading} />

      {/* Resource Cards */}
      <ResourceCards data={result} />
    </main>
    </PageContainer>
  );
}
