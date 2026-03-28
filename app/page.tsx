"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

const themes = {
  spiritual: {
    bg: "#040d08",
    accent: "#a160f",
    cardBg: "rgba(126,201,154,0.06)",
    cardBorder: "rgba(126,201,154,0.15)",
    greeting: "As-salamu alaykum — peace be with you.",
    greetingSub: "This space holds whatever you bring to it today.",
    quote: "\"Verily, with hardship comes ease.\"",
    quoteSource: "Quran 94:5 — a reminder that difficulty is always temporary",
    quoteIcon: "🕊️",
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
    quoteIcon: "🌿",
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
    quoteIcon: "💡",
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
    quoteIcon: "🤝",
    tag: "Your Community",
  },
};

const moods =[
  { emoji: "😔", label: "Heavy" },
  { emoji: "😐", label: "Okay" },
  { emoji: "🙂", label: "Calm" },
  { emoji: "😊", label: "Good" },
];

const navItems = ["Home", "Information Hub", "Message Board", "Mentors"];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: "easeOut" as const},
  }),
};

export default function HomePage() {
  const router = useRouter();

  const [comfort, setComfort]     = useState<string>("spiritual");
  const [language, setLanguage]   = useState<string>("en");
  const [mood, setMood]           = useState<string | null>(null);
  const [activeNav, setActiveNav] = useState("Home");

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const savedComfort  = localStorage.getItem("sanctuary_comfort")  || "spiritual";
    const savedLanguage = localStorage.getItem("sanctuary_language") || "en";
    setComfort(savedComfort);
    setLanguage(savedLanguage);
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const theme = themes[comfort as keyof typeof themes] || themes.spiritual;

  const handleQuickExit = () => {
    localStorage.clear();
    window.location.href = "https://www.google.com";
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: theme.bg,   
        fontFamily: "'Georgia', serif",
        color: "#fff",
      }}
    >

      <nav
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "18px 32px",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          position: "sticky",
          top: 0,
          backgroundColor: theme.bg,
          zIndex: 100,
        }}
      >

        <div
          style={{
            color: theme.accent,
            fontSize: "14px",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            fontFamily: "sans-serif",
          }}
        >
          Sanctuary
        </div>

        <div style={{ display: "flex", gap: "32px" }}>
          {navItems.map((item) => (
            <button
              key={item}
              onClick={() => setActiveNav(item)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                fontSize: "13px",
                fontFamily: "sans-serif",
                letterSpacing: "0.04em",
                color: activeNav === item
                  ? theme.accent                  // Active = accent color
                  : "rgba(255,255,255,0.35)",     // Inactive = dim
                transition: "color 0.2s",
                padding: 0,
              }}
            >
              {item}
            </button>
          ))}
        </div>

        {/* Quick Exit — always red so it's easy to find in a panic */}
        <button
          onClick={handleQuickExit}
          style={{
            background: "#c0392b",
            color: "white",
            border: "none",
            borderRadius: "20px",
            padding: "7px 18px",
            fontSize: "12px",
            fontFamily: "sans-serif",
            cursor: "pointer",
          }}
        >
          Quick Exit
        </button>
      </nav>

      
      <main style={{ padding: "44px 32px", maxWidth: "900px", margin: "0 auto" }}>
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={0}
          style={{ marginBottom: "32px" }}
        >
         
          <p
            style={{
              color: theme.accent,
              fontSize: "11px",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              fontFamily: "sans-serif",
              marginBottom: "10px",
            }}
          >
            {theme.tag}
          </p>

          <h1
            style={{
              fontSize: "28px",
              fontWeight: "normal",
              lineHeight: 1.35,
              marginBottom: "8px",
            }}
          >
            {theme.greeting}
          </h1>

          <p
            style={{
              color: "rgba(255,255,255,0.35)",
              fontSize: "14px",
              fontFamily: "sans-serif",
              lineHeight: 1.6,
            }}
          >
            {theme.greetingSub}
          </p>
        </motion.div>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={1}
          style={{
            background: theme.cardBg,
            border: `1px solid ${theme.cardBorder}`,
            borderRadius: "16px",
            padding: "22px 26px",
            marginBottom: "32px",
            display: "flex",
            gap: "18px",
            alignItems: "flex-start",
          }}
        >
          <span style={{ fontSize: "22px", marginTop: "2px" }}>{theme.quoteIcon}</span>
          <div>
            {/* The quote — italic and warm */}
            <p
              style={{
                color: "rgba(255,255,255,0.8)",
                fontSize: "15px",
                fontStyle: "italic",
                lineHeight: 1.7,
                marginBottom: "8px",
              }}
            >
              {theme.quote}
            </p>
            {/* Who said it and why it matters */}
            <p
              style={{
                color: "rgba(255,255,255,0.3)",
                fontSize: "12px",
                fontFamily: "sans-serif",
              }}
            >
              {theme.quoteSource}
            </p>
          </div>
        </motion.div>

        {/* --- SECTION LABEL --- */}
        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={2}
          style={{
            color: "rgba(255,255,255,0.25)",
            fontSize: "11px",
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            fontFamily: "sans-serif",
            marginBottom: "14px",
          }}
        >
          Where would you like to go?
        </motion.p>

        {/* --- THREE MAIN SECTION CARDS --- */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: "14px",
            marginBottom: "28px",
          }}
        >
          {[
            {
              icon: "📖",
              title: "Information Hub",
              desc: "Understand what you're feeling — in your own words, not clinical ones.",
              badge: "Explore topics",
              delay: 3,
            },
            {
              icon: "✉️",
              title: "Message Board",
              desc: "Share something you've never said out loud. Anonymously and safely.",
              badge: "Anonymous & safe",
              delay: 4,
            },
            {
              icon: "🤲",
              title: "Mentors",
              desc: "Talk to someone who truly understands your world and your background.",
              badge: "Find a match",
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
              // whileHover = subtle scale on hover, makes cards feel alive
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "16px",
                padding: "22px",
                cursor: "pointer",
              }}
            >
              <div style={{ fontSize: "22px", marginBottom: "12px" }}>{card.icon}</div>
              <p
                style={{
                  color: "#fff",
                  fontSize: "14px",
                  fontFamily: "sans-serif",
                  fontWeight: 500,
                  marginBottom: "6px",
                }}
              >
                {card.title}
              </p>
              <p
                style={{
                  color: "rgba(255,255,255,0.35)",
                  fontSize: "12px",
                  fontFamily: "sans-serif",
                  lineHeight: 1.55,
                  marginBottom: "14px",
                }}
              >
                {card.desc}
              </p>
              {/* Badge — color uses theme accent with low opacity */}
              <span
                style={{
                  display: "inline-block",
                  background: `${theme.accent}20`,
                  color: theme.accent,
                  fontSize: "11px",
                  borderRadius: "20px",
                  padding: "4px 12px",
                  fontFamily: "sans-serif",
                }}
              >
                {card.badge}
              </span>
            </motion.div>
          ))}
        </div>

        {/* --- BOTTOM ROW: Mood Check-in + Unsent Message --- */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>

          {/* MOOD CHECK-IN */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={6}
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "16px",
              padding: "22px",
            }}
          >
            <p
              style={{
                color: "#fff",
                fontSize: "14px",
                fontFamily: "sans-serif",
                fontWeight: 500,
                marginBottom: "16px",
              }}
            >
              How are you feeling right now?
            </p>

            {/* Four mood buttons — clicking one highlights it */}
            <div style={{ display: "flex", gap: "10px" }}>
              {moods.map((m) => (
                <button
                  key={m.label}
                  onClick={() => setMood(m.label)}
                  style={{
                    flex: 1,
                    // Selected = themed glow, unselected = dark and dim
                    background: mood === m.label
                      ? `${theme.accent}18`
                      : "rgba(255,255,255,0.04)",
                    border: mood === m.label
                      ? `1px solid ${theme.accent}60`
                      : "1px solid rgba(255,255,255,0.08)",
                    borderRadius: "12px",
                    padding: "10px 4px",
                    cursor: "pointer",
                    transition: "all 0.2s",
                    textAlign: "center",
                  }}
                >
                  <span style={{ fontSize: "18px", display: "block", marginBottom: "4px" }}>
                    {m.emoji}
                  </span>
                  <span
                    style={{
                      color: mood === m.label
                        ? theme.accent
                        : "rgba(255,255,255,0.3)",
                      fontSize: "10px",
                      fontFamily: "sans-serif",
                    }}
                  >
                    {m.label}
                  </span>
                </button>
              ))}
            </div>
          </motion.div>

          {/* UNSENT MESSAGE */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={7}
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "16px",
              padding: "22px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <div>
              <p
                style={{
                  color: "#fff",
                  fontSize: "14px",
                  fontFamily: "sans-serif",
                  fontWeight: 500,
                  marginBottom: "8px",
                }}
              >
                Unsent Message
              </p>
              <p
                style={{
                  color: "rgba(255,255,255,0.3)",
                  fontSize: "12px",
                  fontFamily: "sans-serif",
                  lineHeight: 1.6,
                  marginBottom: "18px",
                }}
              >
                Something you wish you could say — to anyone.
                It stays here, safe and private.
              </p>
            </div>

            {/* Button takes them to message board */}
            <button
              onClick={() => setActiveNav("Message Board")}
              style={{
                background: `${theme.accent}15`,
                border: `1px solid ${theme.accent}35`,
                color: theme.accent,
                borderRadius: "10px",
                padding: "11px 16px",
                fontSize: "13px",
                cursor: "pointer",
                fontFamily: "sans-serif",
                width: "100%",
                transition: "all 0.2s",
              }}
            >
              Write something →
            </button>
          </motion.div>

        </div>
      </main>
    </div>
  );
}