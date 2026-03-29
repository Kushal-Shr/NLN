"use client";

import { useCallback, useMemo, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Compass, EyeOff } from "lucide-react";
import FilterBar from "@/components/features/events/FilterBar";
import EventCard from "@/components/features/events/EventCard";
import VideoOverlay from "@/components/features/events/VideoOverlay";
import Toast from "@/components/features/events/Toast";
import { SEED_EVENTS } from "@/components/features/events/types";
import type { EventCategory, CircleEvent } from "@/components/features/events/types";
import Navbar from "@/components/shared/Navbar";
import ThemeDoodles from "@/components/shared/ThemesDoddles";
import { useTheme } from "@/lib/ThemeContext";

export default function EventsPage() {
  const theme = useTheme();
  const [filter,     setFilter]     = useState<EventCategory | "all">("all");
  const [registered, setRegistered] = useState<Set<string>>(new Set());
  const [anonymous,  setAnonymous]  = useState(false);
  const [liveEvent,  setLiveEvent]  = useState<CircleEvent | null>(null);
  const [toast,      setToast]      = useState<string | null>(null);
  const [mounted,    setMounted]    = useState(false);

  

  const filtered = useMemo(
    () => filter === "all" ? SEED_EVENTS : SEED_EVENTS.filter((e) => e.category === filter),
    [filter]
  );

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }, []);

  const handleJoin = useCallback((event: CircleEvent) => {
    if (event.isLive) {
      setLiveEvent(event);
    } else {
      setRegistered((prev) => new Set(prev).add(event.id));
      showToast(`Reminder set for "${event.title}"`);
    }
  }, [showToast]);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  
  return (
    <>
      <div style={{ minHeight: "100vh", backgroundColor: theme.bg, color: theme.text, fontFamily: "'Georgia', serif", position: "relative" }}>
        <ThemeDoodles />

        <div style={{ position: "relative", zIndex: 10 }}>
          <Navbar />
        </div>

        <main style={{ maxWidth: "1000px", margin: "0 auto", padding: "48px 32px", position: "relative", zIndex: 1 }}>

          {/* HEADER */}
          <motion.header
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{ marginBottom: "36px" }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
              <Compass style={{ width: "20px", height: "20px", color: theme.accent }} />
              <p style={{ fontSize: "11px", fontFamily: "sans-serif", letterSpacing: "0.2em", textTransform: "uppercase", color: theme.textMuted }}>
                Community Circles
              </p>
            </div>
            <h1 style={{ fontSize: "30px", fontWeight: "normal", color: theme.text, marginBottom: "10px", lineHeight: 1.2 }}>
              Coming Together
            </h1>
            <p style={{ fontSize: "14px", fontFamily: "sans-serif", color: theme.textMuted, lineHeight: 1.7, maxWidth: "520px" }}>
              Safe spaces for shared healing — join a circle that speaks to where you are today.
            </p>
          </motion.header>

          {/* CONTROLS */}
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "16px", marginBottom: "32px" }}
          >
            <FilterBar active={filter} onChange={setFilter} />

            {/* Anonymous toggle */}
            <button
              type="button"
              onClick={() => setAnonymous((v) => !v)}
              style={{
                display: "inline-flex", alignItems: "center", gap: "8px",
                borderRadius: "20px", padding: "6px 16px",
                fontSize: "12px", fontFamily: "sans-serif", fontWeight: 500,
                cursor: "pointer", transition: "all 0.2s",
                background: anonymous ? `${theme.accent}15` : "transparent",
                border: anonymous ? `1px solid ${theme.accent}40` : `1px solid ${theme.cardBorder}`,
                color: anonymous ? theme.accent : theme.textMuted,
              }}
            >
              <EyeOff style={{ width: "13px", height: "13px" }} />
              Join Anonymously
            </button>
          </motion.div>

          {/* EVENT GRID */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px" }}
          >
            {filtered.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                registered={registered.has(event.id)}
                onJoin={handleJoin}
              />
            ))}
          </motion.div>

          {filtered.length === 0 && (
            <p style={{ textAlign: "center", fontSize: "13px", fontFamily: "sans-serif", color: theme.textMuted, padding: "48px 0" }}>
              No circles match this filter right now.
            </p>
          )}

        </main>
      </div>

      <VideoOverlay event={liveEvent} anonymous={anonymous} onEnd={() => setLiveEvent(null)} />
      <Toast message={toast} />
    </>
  );
}