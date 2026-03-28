"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

const themes = {
  spiritual: {
    bg: "#040d08",
    accent: "#7ec99a",
    cardBg: "rgba(126,201,154,0.06)",
    cardBorder: "rgba(126,201,154,0.15)",
    greeting: "As-salamu alaykum — peace be with you.",
    greetingSub: "This space holds whatever you bring to it today.",
    quote: "\"Verily, with hardship comes ease.\"",
    quoteSource: "Quran 94:5 — a reminder that difficulty is always temporary",
    quoteIcon: "\u{1F54A}\u{FE0F}",
    tag: "Your Sanctuary",
  },
  nature: {
    bg: "#040d08",
    accent: "#a8d5a2",
    cardBg: "rgba(168,213,162,0.06)",
    cardBorder: "rgba(168,213,162,0.15)",
    greeting: "Welcome back. Take a breath.",
    greetingSub: "You don't have to have it all figured out. Just be here.",
    quote: "\"In every walk with nature, one receives far more than he seeks.\"",
    quoteSource: "John Muir — on finding peace in the natural world",
    quoteIcon: "\u{1F33F}",
    tag: "Your Clearing",
  },
  practical: {
    bg: "#141418",
    accent: "#8eafd4",
    cardBg: "rgba(142,175,212,0.06)",
    cardBorder: "rgba(142,175,212,0.15)",
    greeting: "Good to see you. Let's make today count.",
    greetingSub: "Small steps forward still move you forward.",
    quote: "\"You don't have to see the whole staircase. Just take the first step.\"",
    quoteSource: "Martin Luther King Jr. — on getting started",
    quoteIcon: "\u{1F4A1}",
    tag: "Your Workspace",
  },
  community: {
    bg: "#18120f",
    accent: "#d4a57a",
    cardBg: "rgba(212,165,122,0.06)",
    cardBorder: "rgba(212,165,122,0.15)",
    greeting: "You are not alone in this.",
    greetingSub: "Someone here understands exactly what you're carrying.",
    quote: "\"We are all just walking each other home.\"",
    quoteSource: "Ram Dass — on the power of human connection",
    quoteIcon: "\u{1F91D}",
    tag: "Your Community",
  },
};

const moods = [
  { emoji: "\u{1F614}", label: "Heavy" },
  { emoji: "\u{1F610}", label: "Okay" },
  { emoji: "\u{1F642}", label: "Calm" },
  { emoji: "\u{1F60A}", label: "Good" },
];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: "easeOut" as const },
  }),
};

export default function DashboardPage() {
  const router = useRouter();
  const [comfort, setComfort] = useState<string>("spiritual");
  const [mood, setMood] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const savedComfort = localStorage.getItem("sanctuary_comfort") || "spiritual";
    setComfort(savedComfort);
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const theme = themes[comfort as keyof typeof themes] || themes.spiritual;

  return (
    <div className="min-h-screen" style={{ fontFamily: "'Georgia', serif" }}>
      <main className="mx-auto max-w-[900px] px-6 py-8">
        <motion.div variants={fadeUp} initial="hidden" animate="show" custom={0} className="mb-8">
          <p
            style={{ color: theme.accent }}
            className="mb-2.5 text-[11px] font-sans uppercase tracking-[0.18em]"
          >
            {theme.tag}
          </p>
          <h1 className="mb-2 text-[28px] font-normal leading-snug text-white">
            {theme.greeting}
          </h1>
          <p className="text-sm font-sans leading-relaxed text-white/35">
            {theme.greetingSub}
          </p>
        </motion.div>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={1}
          className="mb-8 flex items-start gap-[18px] rounded-2xl p-[22px_26px]"
          style={{
            background: theme.cardBg,
            border: `1px solid ${theme.cardBorder}`,
          }}
        >
          <span className="mt-0.5 text-[22px]">{theme.quoteIcon}</span>
          <div>
            <p className="mb-2 text-[15px] italic leading-[1.7] text-white/80">
              {theme.quote}
            </p>
            <p className="text-xs font-sans text-white/30">{theme.quoteSource}</p>
          </div>
        </motion.div>

        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={2}
          className="mb-3.5 text-[11px] font-sans uppercase tracking-[0.14em] text-white/25"
        >
          Where would you like to go?
        </motion.p>

        <div className="mb-7 grid grid-cols-3 gap-3.5">
          {[
            {
              icon: "\u{1F4D6}",
              title: "Wisdom Hub",
              desc: "Understand what you're feeling — in your own words, not clinical ones.",
              badge: "Explore topics",
              href: "/hub",
              delay: 3,
            },
            {
              icon: "\u{2709}\u{FE0F}",
              title: "Message Board",
              desc: "Share something you've never said out loud. Anonymously and safely.",
              badge: "Anonymous & safe",
              href: "/board",
              delay: 4,
            },
            {
              icon: "\u{1F932}",
              title: "Mentors",
              desc: "Talk to someone who truly understands your world and your background.",
              badge: "Find a match",
              href: "/chat",
              delay: 5,
            },
          ].map((card) => (
            <motion.div
              key={card.title}
              variants={fadeUp}
              initial="hidden"
              animate="show"
              custom={card.delay}
              whileHover={{ scale: 1.02, transition: { duration: 0.15 } }}
              onClick={() => router.push(card.href)}
              className="cursor-pointer rounded-2xl border border-white/[0.08] bg-white/[0.04] p-[22px]"
            >
              <div className="mb-3 text-[22px]">{card.icon}</div>
              <p className="mb-1.5 text-sm font-sans font-medium text-white">
                {card.title}
              </p>
              <p className="mb-3.5 text-xs font-sans leading-[1.55] text-white/35">
                {card.desc}
              </p>
              <span
                className="inline-block rounded-full px-3 py-1 text-[11px] font-sans"
                style={{
                  background: `${theme.accent}20`,
                  color: theme.accent,
                }}
              >
                {card.badge}
              </span>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-3.5">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={6}
            className="rounded-2xl border border-white/[0.08] bg-white/[0.04] p-[22px]"
          >
            <p className="mb-4 text-sm font-sans font-medium text-white">
              How are you feeling right now?
            </p>
            <div className="flex gap-2.5">
              {moods.map((m) => (
                <button
                  key={m.label}
                  onClick={() => setMood(m.label)}
                  className="flex-1 rounded-xl border p-[10px_4px] text-center transition-all duration-200"
                  style={{
                    background:
                      mood === m.label
                        ? `${theme.accent}18`
                        : "rgba(255,255,255,0.04)",
                    borderColor:
                      mood === m.label
                        ? `${theme.accent}60`
                        : "rgba(255,255,255,0.08)",
                  }}
                >
                  <span className="mb-1 block text-lg">{m.emoji}</span>
                  <span
                    className="text-[10px] font-sans"
                    style={{
                      color:
                        mood === m.label ? theme.accent : "rgba(255,255,255,0.3)",
                    }}
                  >
                    {m.label}
                  </span>
                </button>
              ))}
            </div>
          </motion.div>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={7}
            className="flex flex-col justify-between rounded-2xl border border-white/[0.08] bg-white/[0.04] p-[22px]"
          >
            <div>
              <p className="mb-2 text-sm font-sans font-medium text-white">
                Unsent Message
              </p>
              <p className="mb-[18px] text-xs font-sans leading-relaxed text-white/30">
                Something you wish you could say — to anyone. It stays here, safe
                and private.
              </p>
            </div>
            <button
              onClick={() => router.push("/board")}
              className="w-full rounded-[10px] py-[11px] text-[13px] font-sans transition-all duration-200"
              style={{
                background: `${theme.accent}15`,
                border: `1px solid ${theme.accent}35`,
                color: theme.accent,
              }}
            >
              Write something &rarr;
            </button>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
