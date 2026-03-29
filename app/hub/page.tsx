"use client";

import { useCallback, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { BookOpen } from "lucide-react";
import VibeCheck, { FEELINGS } from "@/components/features/hub/VibeCheck";
import SearchBar from "@/components/features/hub/SearchBar";
import ResourceCards from "@/components/features/hub/ResourceCards";
import WisdomOutput from "@/components/features/hub/WisdomOutput";
import type { GeminiResponse } from "@/lib/gemini";
import { useTheme } from "@/lib/ThemeContext";
import Navbar from "@/components/shared/Navbar"; 
import ThemeDoodles from "@/components/shared/ThemesDoddles";


export default function HubPage() {
  const theme = useTheme();

  const [selectedFeelings, setSelectedFeelings] = useState<string[]>([]);
  const [query,    setQuery]    = useState("");
  const [loading,  setLoading]  = useState(false);
  const [result,   setResult]   = useState<GeminiResponse | null>(null);
  const [error,    setError]    = useState<string | null>(null);
  const [mounted,  setMounted]  = useState(false);

  useEffect(() => setMounted(true), []);

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

    if (!mounted) return null;

    const hubBg = theme.surface;
  return (
    // Outer wrapper — full page background from theme
    <div style={{ minHeight: "100vh", backgroundColor: theme.bg, color: theme.text, fontFamily: "'Georgia', serif" }}>
      
      <ThemeDoodles/>
      <Navbar/> 
      <main style={{ maxWidth: "860px", margin: "0 auto", padding: "48px 32px" }}>

        <motion.header
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{ marginBottom: "40px" }}
        >
          {/* Icon + small label row */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
            <BookOpen style={{ width: "20px", height: "20px", color: theme.accent }} />
            <p style={{ fontSize: "11px", fontFamily: "sans-serif", letterSpacing: "0.2em", textTransform: "uppercase", color: theme.textMuted }}>
              Wisdom Library
            </p>
          </div>

          {/* Page title */}
          <h1 style={{ fontSize: "30px", fontWeight: "normal", color: theme.text, marginBottom: "10px", lineHeight: 1.2 }}>
            Information Hub
          </h1>

          {/* Subtitle — no clinical words */}
          <p style={{ fontSize: "14px", fontFamily: "sans-serif", color: theme.textMuted, lineHeight: 1.7, maxWidth: "520px" }}>
            A quiet space to check in, explore resilience techniques, and receive
            personalised insight — no clinical labels, just clarity.
          </p>
        </motion.header>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          style={{ marginBottom: "40px" }}
        >
          <SearchBar
            query={query}
            onChange={setQuery}
            onSearch={generateWisdom}
            loading={loading}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          style={{ marginBottom: "40px" }}
        >
          <VibeCheck selected={selectedFeelings} onToggle={toggleFeeling} />
        </motion.div>

        {/* Error message */}
        {error && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ fontSize: "13px", fontFamily: "sans-serif", color: "#e05555", marginBottom: "24px" }}
          >
            {error}
          </motion.p>
        )}

        <WisdomOutput metaphor={result?.metaphor ?? null} loading={loading} />
        <ResourceCards data={result} />

      </main>
    </div>
  );
}