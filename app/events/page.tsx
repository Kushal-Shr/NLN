"use client";

import { useCallback, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Compass, EyeOff } from "lucide-react";
import Navbar from "@/components/shared/Navbar";
import FilterBar from "@/components/features/events/FilterBar";
import EventCard from "@/components/features/events/EventCard";
import VideoOverlay from "@/components/features/events/VideoOverlay";
import Toast from "@/components/features/events/Toast";
import { useTheme } from "@/lib/ThemeContext";
import { SEED_EVENTS } from "@/components/features/events/types";
import type { EventCategory, CircleEvent } from "@/components/features/events/types";

export default function EventsPage() {
  const theme = useTheme();

  const [filter, setFilter] = useState<EventCategory | "all">("all");
  const [registered, setRegistered] = useState<Set<string>>(new Set());
  const [anonymous, setAnonymous] = useState(false);
  const [liveEvent, setLiveEvent] = useState<CircleEvent | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const filtered = useMemo(
    () =>
      filter === "all"
        ? SEED_EVENTS
        : SEED_EVENTS.filter((e) => e.category === filter),
    [filter]
  );

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }, []);

  const handleJoin = useCallback(
    (event: CircleEvent) => {
      if (event.isLive) {
        setLiveEvent(event);
      } else {
        setRegistered((prev) => new Set(prev).add(event.id));
        showToast(`Reminder set for "${event.title}"`);
      }
    },
    [showToast]
  );

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: theme.bg, color: theme.text, fontFamily: "'Georgia', serif" }}
    >
      <Navbar />

      <main className="mx-auto w-full max-w-5xl space-y-8 px-6 pb-10 pt-10">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-1"
        >
          <div className="flex items-center gap-2.5">
            <Compass className="h-5 w-5" style={{ color: theme.accent }} />
            <p
              className="text-[11px] font-semibold uppercase tracking-[0.2em]"
              style={{ color: theme.textMuted, fontFamily: "sans-serif" }}
            >
              Community Circles
            </p>
          </div>
          <h1
            className="text-[26px] font-normal"
            style={{ color: theme.text, lineHeight: 1.35 }}
          >
            Coming Together
          </h1>
          <p
            className="max-w-xl text-sm"
            style={{ color: theme.textMuted, fontFamily: "sans-serif", lineHeight: 1.6 }}
          >
            Safe spaces for shared healing — join a circle that speaks to
            where you are today.
          </p>
        </motion.header>

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-wrap items-center justify-between gap-4"
        >
          <FilterBar active={filter} onChange={setFilter} theme={theme} />

          <button
            type="button"
            onClick={() => setAnonymous((v) => !v)}
            className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-medium transition"
            style={{
              border: `1px solid ${anonymous ? theme.accent : theme.cardBorder}`,
              backgroundColor: anonymous ? `${theme.accent}12` : "transparent",
              color: anonymous ? theme.accent : theme.textMuted,
              fontFamily: "sans-serif",
            }}
          >
            <EyeOff className="h-3.5 w-3.5" />
            Join Anonymously
          </button>
        </motion.div>

        {/* Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          {filtered.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              registered={registered.has(event.id)}
              onJoin={handleJoin}
              theme={theme}
            />
          ))}
        </motion.div>

        {filtered.length === 0 && (
          <p
            className="py-12 text-center text-sm"
            style={{ color: theme.textMuted, fontFamily: "sans-serif" }}
          >
            No circles match this filter right now.
          </p>
        )}
      </main>

      {/* Video overlay */}
      <VideoOverlay
        event={liveEvent}
        anonymous={anonymous}
        onEnd={() => setLiveEvent(null)}
      />

      {/* Toast */}
      <Toast message={toast} />
    </div>
  );
}
