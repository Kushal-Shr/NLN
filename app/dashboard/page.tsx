"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Zap,
  Target,
  Calendar,
  Clock,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import Navbar from "@/components/shared/Navbar";
import { useTheme } from "@/lib/ThemeContext";

// ── Daily Pulse mood options ────────────────────────────────────────

const MOODS = [
  { emoji: "😔", label: "Heavy" },
  { emoji: "😐", label: "Okay" },
  { emoji: "🙂", label: "Calm" },
  { emoji: "😊", label: "Good" },
  { emoji: "✨", label: "Great" },
];

// ── AI-generated roadmap cards ──────────────────────────────────────

interface RoadmapCard {
  id: string;
  time: string;
  title: string;
  why: string;
  isCurrent: boolean;
  duration: string;
}

const ROADMAP_CARDS: RoadmapCard[] = [
  {
    id: "r1",
    time: "9:00 AM",
    title: "Morning Grounding",
    why: "Starting the day anchored reduces the weight of everything that follows.",
    isCurrent: true,
    duration: "15 min",
  },
  {
    id: "r2",
    time: "9:30 AM",
    title: "Deep Work Block",
    why: "Your focus peaks in the morning — protect this window for what matters most.",
    isCurrent: false,
    duration: "90 min",
  },
  {
    id: "r3",
    time: "11:00 AM",
    title: "Movement Break",
    why: "A short walk resets your nervous system and boosts clarity for the next sprint.",
    isCurrent: false,
    duration: "20 min",
  },
  {
    id: "r4",
    time: "11:30 AM",
    title: "Creative Exploration",
    why: "After movement, your mind is primed for lateral thinking and new ideas.",
    isCurrent: false,
    duration: "60 min",
  },
  {
    id: "r5",
    time: "1:00 PM",
    title: "Nourishment & Rest",
    why: "Eating mindfully isn't a break from productivity — it fuels the second half.",
    isCurrent: false,
    duration: "45 min",
  },
  {
    id: "r6",
    time: "2:00 PM",
    title: "Collaborative Session",
    why: "Afternoon energy suits connection — meetings and pair work thrive here.",
    isCurrent: false,
    duration: "60 min",
  },
  {
    id: "r7",
    time: "3:30 PM",
    title: "Reflection & Planning",
    why: "Closing the day with intention prevents tomorrow from feeling overwhelming.",
    isCurrent: false,
    duration: "30 min",
  },
];

// ── Fade-up animation variant ───────────────────────────────────────

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06, duration: 0.45, ease: "easeOut" as const },
  }),
};

// ── Slider component ────────────────────────────────────────────────

function LevelSlider({
  label,
  icon: Icon,
  value,
  onChange,
  theme,
}: {
  label: string;
  icon: React.ElementType;
  value: number;
  onChange: (v: number) => void;
  theme: ReturnType<typeof useTheme>;
}) {
  return (
    <div>
      <div
        className="mb-2 flex items-center justify-between"
        style={{ fontFamily: "sans-serif" }}
      >
        <div className="flex items-center gap-2">
          <Icon className="h-3.5 w-3.5" style={{ color: theme.accent }} />
          <span className="text-xs font-medium" style={{ color: theme.text }}>
            {label}
          </span>
        </div>
        <span
          className="text-xs font-semibold"
          style={{ color: theme.accent }}
        >
          {value}/10
        </span>
      </div>
      <input
        type="range"
        min={1}
        max={10}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-green-700"
        style={{ height: "4px" }}
      />
    </div>
  );
}

// ── Main page ───────────────────────────────────────────────────────

export default function DashboardPage() {
  const theme = useTheme();

  const [mounted, setMounted] = useState(false);
  const [mood, setMood] = useState<string | null>(null);
  const [energy, setEnergy] = useState(6);
  const [focus, setFocus] = useState(5);
  const [calSynced, setCalSynced] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSyncCalendar = useCallback(() => {
    setCalSynced(true);
  }, []);

  if (!mounted) return null;

  return (
    <div
      className="min-h-screen"
      style={{
        backgroundColor: theme.bg,
        color: theme.text,
        fontFamily: "'Georgia', serif",
      }}
    >
      <Navbar />

      <main className="mx-auto w-full max-w-3xl space-y-10 px-6 pb-16 pt-10">
        {/* ── Greeting ───────────────────────────────────── */}
        <motion.div variants={fadeUp} initial="hidden" animate="show" custom={0}>
          <p
            className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em]"
            style={{ color: theme.accentSoft, fontFamily: "sans-serif" }}
          >
            {theme.tag}
          </p>
          <h1
            className="text-[26px] font-normal"
            style={{ color: theme.text, lineHeight: 1.35 }}
          >
            {theme.greeting}
          </h1>
          <p
            className="mt-1 max-w-lg text-sm"
            style={{
              color: theme.textMuted,
              fontFamily: "sans-serif",
              lineHeight: 1.6,
            }}
          >
            {theme.greetingSub}
          </p>
        </motion.div>

        {/* ── Daily Pulse ────────────────────────────────── */}
        <motion.section variants={fadeUp} initial="hidden" animate="show" custom={1}>
          <div className="mb-4 flex items-center gap-2">
            <Sparkles className="h-4 w-4" style={{ color: theme.accent }} />
            <h2
              className="text-xs font-semibold uppercase tracking-[0.15em]"
              style={{ color: theme.textMuted, fontFamily: "sans-serif" }}
            >
              Daily Pulse
            </h2>
          </div>

          <div
            className="space-y-6 rounded-2xl p-6"
            style={{
              backgroundColor: theme.cardBg,
              border: `1px solid ${theme.cardBorder}`,
              boxShadow: "0 1px 4px rgba(0,0,0,0.03)",
            }}
          >
            {/* Mood row */}
            <div>
              <p
                className="mb-3 text-sm font-semibold"
                style={{ color: theme.text, fontFamily: "sans-serif" }}
              >
                How are you feeling right now?
              </p>
              <div className="flex gap-2">
                {MOODS.map((m) => {
                  const active = mood === m.label;
                  return (
                    <button
                      key={m.label}
                      type="button"
                      onClick={() => setMood(m.label)}
                      className="flex-1 rounded-xl py-2.5 text-center transition"
                      style={{
                        backgroundColor: active ? theme.moodSelected : theme.cardBg,
                        border: active
                          ? `2px solid ${theme.accentSoft}`
                          : `1px solid ${theme.moodBorder}`,
                        cursor: "pointer",
                      }}
                    >
                      <span className="block text-lg">{m.emoji}</span>
                      <span
                        className="mt-0.5 block text-[10px]"
                        style={{
                          color: active ? theme.accent : theme.textMuted,
                          fontFamily: "sans-serif",
                        }}
                      >
                        {m.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Sliders */}
            <div className="grid gap-5 sm:grid-cols-2">
              <LevelSlider
                label="Energy Level"
                icon={Zap}
                value={energy}
                onChange={setEnergy}
                theme={theme}
              />
              <LevelSlider
                label="Focus Level"
                icon={Target}
                value={focus}
                onChange={setFocus}
                theme={theme}
              />
            </div>
          </div>
        </motion.section>

        {/* ── The Roadmap ────────────────────────────────── */}
        <motion.section variants={fadeUp} initial="hidden" animate="show" custom={2}>
          <div className="mb-5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" style={{ color: theme.accent }} />
              <h2
                className="text-xs font-semibold uppercase tracking-[0.15em]"
                style={{ color: theme.textMuted, fontFamily: "sans-serif" }}
              >
                The Roadmap
              </h2>
            </div>

            <button
              type="button"
              onClick={handleSyncCalendar}
              className="inline-flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-medium transition"
              style={{
                backgroundColor: calSynced ? `${theme.accent}10` : theme.cardBg,
                border: `1px solid ${calSynced ? theme.accentSoft : theme.cardBorder}`,
                color: calSynced ? theme.accent : theme.textMuted,
                fontFamily: "sans-serif",
              }}
            >
              <Calendar className="h-3.5 w-3.5" />
              {calSynced ? "Calendar Synced" : "Sync Google Calendar"}
            </button>
          </div>

          {/* Timeline */}
          <div className="space-y-3">
            {ROADMAP_CARDS.map((card, i) => (
              <motion.div
                key={card.id}
                variants={fadeUp}
                initial="hidden"
                animate="show"
                custom={3 + i * 0.5}
                className="relative rounded-2xl p-5 transition"
                style={{
                  backgroundColor: card.isCurrent
                    ? theme.quoteBg
                    : theme.cardBg,
                  border: `1px solid ${card.isCurrent ? theme.accentSoft : theme.cardBorder}`,
                  boxShadow: card.isCurrent
                    ? `0 0 20px ${theme.accent}10, 0 2px 8px rgba(0,0,0,0.04)`
                    : "0 1px 3px rgba(0,0,0,0.03)",
                }}
              >
                {/* Current indicator */}
                {card.isCurrent && (
                  <div
                    className="mb-3 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1"
                    style={{
                      backgroundColor: `${theme.accent}12`,
                      fontFamily: "sans-serif",
                    }}
                  >
                    <span
                      className="h-1.5 w-1.5 animate-pulse rounded-full"
                      style={{ backgroundColor: theme.accent }}
                    />
                    <span
                      className="text-[10px] font-semibold uppercase tracking-wider"
                      style={{ color: theme.accent }}
                    >
                      Current Task
                    </span>
                  </div>
                )}

                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-3">
                      <span
                        className="shrink-0 text-xs font-medium"
                        style={{ color: theme.accent, fontFamily: "sans-serif" }}
                      >
                        {card.time}
                      </span>
                      <span
                        className="rounded-full px-2 py-0.5 text-[10px]"
                        style={{
                          backgroundColor: `${theme.accent}08`,
                          color: theme.textMuted,
                          fontFamily: "sans-serif",
                        }}
                      >
                        {card.duration}
                      </span>
                    </div>
                    <h3
                      className="mt-1.5 text-[15px] font-semibold"
                      style={{ color: theme.text, fontFamily: "sans-serif" }}
                    >
                      {card.title}
                    </h3>
                    <p
                      className="mt-1 text-xs leading-relaxed"
                      style={{
                        color: theme.textMuted,
                        fontFamily: "sans-serif",
                        fontStyle: "italic",
                      }}
                    >
                      Why? {card.why}
                    </p>
                  </div>

                  <ChevronRight
                    className="mt-4 h-4 w-4 shrink-0"
                    style={{ color: theme.cardBorder }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>
      </main>
    </div>
  );
}
