"use client";

import { createContext, useContext, useEffect, useState } from "react";

export const themes = {
  spiritual: {
    // Soft warm beige/cream — sacred and calming
    bg:          "#FAF6EF",
    surface:     "#F3EDE0",
    accent:      "#8B6914",       // Deep warm gold — readable on beige
    accentSoft:  "#C6A868",       // Lighter gold for borders
    cardBg:      "#FFFFFF",
    cardBorder:  "#E8D9B0",
    text:        "#2a1f0e",
    textMuted:   "#9a8068",
    navBorder:   "#E8D9B0",
    quoteBg:     "#FFF8EC",
    quoteBorder: "#E8D9B0",
    greeting:    "How are you doing today?",
    greetingSub: "This space holds whatever you bring to it today.",
    quote:       "\"Verily, with hardship comes ease.\"",
    quoteSource: "Quran 94:5 — a reminder that difficulty is always temporary",
    quoteIcon:   "🕊️",
    tag:         "Your Sanctuary",
    badgeBg:     "rgba(139,105,20,0.1)",
    badgeColor:  "#8B6914",
    moodBorder:  "#E8D9B0",
    moodSelected:"#FFF8EC",
    btnBg:       "#2a1f0e",
    btnColor:    "#C6A868",
  },
  nature: {
    // Soft muted greens — earthy, grounded, no neon
    bg:          "#F0F5EE",
    surface:     "#E4EEE1",
    accent:      "#3B6B42",       // Deep forest green — readable
    accentSoft:  "#7AAB82",       // Softer green for borders
    cardBg:      "#FFFFFF",
    cardBorder:  "#C8DFC9",
    text:        "#1a2e1c",
    textMuted:   "#6a8a6c",
    navBorder:   "#C8DFC9",
    quoteBg:     "#F4FAF4",
    quoteBorder: "#C8DFC9",
    greeting:    "Welcome back. Take a breath.",
    greetingSub: "You don't have to have it all figured out. Just be here.",
    quote:       "\"In every walk with nature, one receives far more than he seeks.\"",
    quoteSource: "John Muir — on finding peace in the natural world",
    quoteIcon:   "🌿",
    tag:         "Your Clearing",
    badgeBg:     "rgba(59,107,66,0.1)",
    badgeColor:  "#3B6B42",
    moodBorder:  "#C8DFC9",
    moodSelected:"#F4FAF4",
    btnBg:       "#1a2e1c",
    btnColor:    "#7AAB82",
  },
  practical: {
    // Very neutral beige — organized, clean, in control
    bg:          "#EBEAE3",
    surface:     "#E0DFD8",
    accent:      "#3a3a30",       // Near-black — authoritative, clear
    accentSoft:  "#8a8a7a",       // Muted for borders
    cardBg:      "#F8F7F4",
    cardBorder:  "#D8D5C8",
    text:        "#1a1a18",
    textMuted:   "#6a6a60",
    navBorder:   "#D8D5C8",
    quoteBg:     "#FFFFFF",
    quoteBorder: "#D8D5C8",
    greeting:    "Good to see you. Let's make today count.",
    greetingSub: "Small steps forward still move you forward.",
    quote:       "\"You don't have to see the whole staircase. Just take the first step.\"",
    quoteSource: "Martin Luther King Jr. — on getting started",
    quoteIcon:   "💡",
    tag:         "Your Workspace",
    badgeBg:     "rgba(58,58,48,0.08)",
    badgeColor:  "#3a3a30",
    moodBorder:  "#D8D5C8",
    moodSelected:"#FFFFFF",
    btnBg:       "#1a1a18",
    btnColor:    "#EBEAE3",
  },
  community: {
    // Soft welcoming blue — warm not cold, friendly not corporate
    bg:          "#EEF3F8",
    surface:     "#E2EBF4",
    accent:      "#1F5C8B",       // Deep calm blue — readable
    accentSoft:  "#6FA3C8",       // Softer blue for borders
    cardBg:      "#FFFFFF",
    cardBorder:  "#BDD4E8",
    text:        "#0f2030",
    textMuted:   "#5a7a98",
    navBorder:   "#BDD4E8",
    quoteBg:     "#F4F8FC",
    quoteBorder: "#BDD4E8",
    greeting:    "You are not alone in this.",
    greetingSub: "Someone here understands exactly what you're carrying.",
    quote:       "\"We are all just walking each other home.\"",
    quoteSource: "Ram Dass — on the power of human connection",
    quoteIcon:   "🤝",
    tag:         "Your Community",
    badgeBg:     "rgba(31,92,139,0.1)",
    badgeColor:  "#1F5C8B",
    moodBorder:  "#BDD4E8",
    moodSelected:"#F4F8FC",
    btnBg:       "#0f2030",
    btnColor:    "#6FA3C8",
  },
};


export type ThemeKey = keyof typeof themes;
export type Theme = typeof themes[ThemeKey];

const ThemeContext = createContext<Theme>(themes.spiritual);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(themes.spiritual);

  useEffect(() => {
  const update = () => {
    const saved = localStorage.getItem("sanctuary_comfort") as ThemeKey || "spiritual";
    setTheme(themes[saved] || themes.spiritual);
  };

  update();

  window.addEventListener("storage", update);
  return () => window.removeEventListener("storage", update);
}, []);

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}