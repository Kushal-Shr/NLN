"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import ThemesDoddles from "@/components/shared/ThemesDoddles";
import { useTheme } from "@/lib/ThemeContext";
import LanguageSelector from "@/components/shared/LanguageSelector";

const moods = [
  { emoji: "😔", label: "Heavy" },
  { emoji: "😐", label: "Okay" },
  { emoji: "🙂", label: "Calm" },
  { emoji: "😊", label: "Good" },
];

const navItems = ["Home", "Information Hub", "Circles", "Inner Ledger", "Mentors"];

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.07, duration: 0.5, ease: "easeOut" as const },
  }),
};

export default function DashboardPage() {
  const router = useRouter();
  const theme = useTheme();

  const [mood,      setMood]      = useState<string | null>(null);
  const [activeNav, setActiveNav] = useState("Home");
  const [mounted,   setMounted]   = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // Quick Exit — safety feature, always available
  const handleQuickExit = () => {
    localStorage.clear();
    window.location.href = "https://www.google.com";
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: theme.bg, color: theme.text, fontFamily: "'Georgia', serif" }}>
          <ThemesDoddles/>
      <nav style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "16px 32px",
        borderBottom: `1px solid ${theme.navBorder}`,
        backgroundColor: theme.bg,
        position: "sticky", top: 0, zIndex: 100,
      }}>
        {/* Logo */}
        <div style={{ color: theme.accent, fontSize: "13px", letterSpacing: "0.2em", textTransform: "uppercase", fontFamily: "sans-serif" }}>
          Sanctuary
        </div>

        {/* Nav links */}
        <div style={{ display: "flex", gap: "28px" }}>
          {navItems.map((item) => (
            <button
              key={item}
              onClick={() => {
                  setActiveNav(item);
                  if (item === "Information Hub") router.push("/hub");
                  if(item === "Inner Ledger") router.push("/journal");
                  if(item === "Circles") router.push("/events")
                  if(item === "Mentors") router.push("/chat");
              }} 
              style={{
                background: "none", border: "none", cursor: "pointer",
                fontSize: "13px", fontFamily: "sans-serif",
                color: activeNav === item ? theme.accent : theme.textMuted,
                fontWeight: activeNav === item ? 600 : 400,
                padding: 0, transition: "color 0.2s",
                // Active item gets a subtle underline
                borderBottom: activeNav === item ? `2px solid ${theme.accentSoft}` : "2px solid transparent",
                paddingBottom: "2px",
              }}
            >
              {item}
            </button>
          ))}
        </div>

        {/* Quick Exit — always red */}
      {/* Right side */}
<div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
  <LanguageSelector />
  <button
    onClick={handleQuickExit}
    style={{
      background: "#c0392b", color: "white", border: "none",
      borderRadius: "20px", padding: "7px 18px",
      fontSize: "12px", fontFamily: "sans-serif", cursor: "pointer",
    }}
  >
    Quick Exit
  </button>
</div>
      </nav>

      <main style={{ padding: "44px 32px", maxWidth: "880px", margin: "0 auto", position: "relative", zIndex: 1 }}>

        {/* --- GREETING --- */}
        <motion.div variants={fadeUp} initial="hidden" animate="show" custom={0} style={{ marginBottom: "28px" }}>
          <p style={{ color: theme.accentSoft, fontSize: "11px", letterSpacing: "0.18em", textTransform: "uppercase", fontFamily: "sans-serif", marginBottom: "10px" }}>
            {theme.tag}
          </p>
          <h1 style={{ fontSize: "26px", fontWeight: "normal", lineHeight: 1.35, marginBottom: "8px", color: theme.text }}>
            {theme.greeting}
          </h1>
          <p style={{ color: theme.textMuted, fontSize: "14px", fontFamily: "sans-serif", lineHeight: 1.6 }}>
            {theme.greetingSub}
          </p>
        </motion.div>

        {/* --- QUOTE CARD --- */}
        <motion.div
          variants={fadeUp} initial="hidden" animate="show" custom={1}
          style={{
            background: theme.quoteBg,
            border: `1px solid ${theme.quoteBorder}`,
            borderRadius: "16px", padding: "20px 24px",
            marginBottom: "32px", display: "flex", gap: "16px", alignItems: "flex-start",
          }}
        >
          <span style={{ fontSize: "20px", marginTop: "2px" }}>{theme.quoteIcon}</span>
          <div>
            <p style={{ color: theme.text, fontSize: "15px", fontStyle: "italic", lineHeight: 1.7, marginBottom: "8px", opacity: 0.85 }}>
              {theme.quote}
            </p>
            <p style={{ color: theme.textMuted, fontSize: "12px", fontFamily: "sans-serif" }}>
              {theme.quoteSource}
            </p>
          </div>
        </motion.div>

        {/* --- SECTION LABEL --- */}
        <motion.p
          variants={fadeUp} initial="hidden" animate="show" custom={2}
          style={{ color: theme.textMuted, fontSize: "11px", letterSpacing: "0.14em", textTransform: "uppercase", fontFamily: "sans-serif", marginBottom: "14px", opacity: 0.7 }}
        >
          Where would you like to go?
        </motion.p>

        {/* --- THREE MAIN CARDS --- */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px", marginBottom: "24px" }}>
          {[
            { icon: "🌐", title: "Information Hub", desc: "Understand what you're feeling — in your own words, not clinical ones.", badge: "Explore topics", delay: 3 },
            { icon: "✉️", title: "Message Board",   desc: "Share something you've never said out loud. Anonymously and safely.",  badge: "Anonymous & safe", delay: 4 },
            { icon: "🧠", title: "Mentors",          desc: "Talk to someone who truly understands your world and your background.", badge: "Find a match",    delay: 5 },
          ].map((card) => (
            <motion.div
              key={card.title}
              variants={fadeUp} initial="hidden" animate="show" custom={card.delay}
              whileHover={{ scale: 1.02, transition: { duration: 0.15 } }}
              style={{
                background: theme.cardBg,
                border: `1px solid ${theme.cardBorder}`,
                borderRadius: "16px", padding: "20px", cursor: "pointer",
              }}
            >
              <div style={{ fontSize: "20px", marginBottom: "12px" }}>{card.icon}</div>
              <p style={{ color: theme.text, fontSize: "14px", fontFamily: "sans-serif", fontWeight: 600, marginBottom: "6px" }}>
                {card.title}
              </p>
              <p style={{ color: theme.textMuted, fontSize: "12px", fontFamily: "sans-serif", lineHeight: 1.55, marginBottom: "14px" }}>
                {card.desc}
              </p>
              <span style={{
                display: "inline-block", background: theme.badgeBg, color: theme.badgeColor,
                fontSize: "11px", borderRadius: "20px", padding: "4px 12px", fontFamily: "sans-serif",
              }}>
                {card.badge}
              </span>
            </motion.div>
          ))}
        </div>

        {/* --- BOTTOM ROW: Mood check-in + Unsent message --- */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>

          {/* MOOD CHECK-IN */}
          <motion.div
            variants={fadeUp} initial="hidden" animate="show" custom={6}
            style={{ background: theme.cardBg, border: `1px solid ${theme.cardBorder}`, borderRadius: "16px", padding: "20px" }}
          >
            <p style={{ color: theme.text, fontSize: "14px", fontFamily: "sans-serif", fontWeight: 600, marginBottom: "16px" }}>
              How are you feeling right now?
            </p>
            <div style={{ display: "flex", gap: "8px" }}>
              {moods.map((m) => (
                <button
                  key={m.label}
                  onClick={() => setMood(m.label)}
                  style={{
                    flex: 1,
                    background: mood === m.label ? theme.moodSelected : theme.cardBg,
                    border: mood === m.label ? `2px solid ${theme.accentSoft}` : `1px solid ${theme.moodBorder}`,
                    borderRadius: "12px", padding: "10px 4px",
                    cursor: "pointer", transition: "all 0.2s", textAlign: "center",
                  }}
                >
                  <span style={{ fontSize: "18px", display: "block", marginBottom: "4px" }}>{m.emoji}</span>
                  <span style={{ color: mood === m.label ? theme.accent : theme.textMuted, fontSize: "10px", fontFamily: "sans-serif" }}>
                    {m.label}
                  </span>
                </button>
              ))}
            </div>
          </motion.div>

          {/* UNSENT MESSAGE */}
          <motion.div
            variants={fadeUp} initial="hidden" animate="show" custom={7}
            style={{
              background: theme.cardBg, border: `1px solid ${theme.cardBorder}`,
              borderRadius: "16px", padding: "20px",
              display: "flex", flexDirection: "column", justifyContent: "space-between",
            }}
          >
            <div>
              <p style={{ color: theme.text, fontSize: "14px", fontFamily: "sans-serif", fontWeight: 600, marginBottom: "8px" }}>
                Unsent Message
              </p>
              <p style={{ color: theme.textMuted, fontSize: "12px", fontFamily: "sans-serif", lineHeight: 1.6, marginBottom: "16px" }}>
                Something you wish you could say — to anyone. It stays here, safe and private.
              </p>
            </div>
            <button
              onClick={() => router.push("/board")}
              style={{
                background: theme.btnBg, color: theme.btnColor,
                border: "none", borderRadius: "10px",
                padding: "11px 16px", fontSize: "13px",
                fontFamily: "sans-serif", width: "100%", cursor: "pointer",
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