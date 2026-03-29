"use client";

import { useRouter, usePathname } from "next/navigation";
import { useTheme } from "@/lib/ThemeContext";

// Nav items and where they route to
const navItems = [
  { label: "Home",             path: "/dashboard" },
  { label: "Information Hub",  path: "/hub" },
  { label: "Inner Ledger",     path: "/journal" },
  { label: "Circles",          path: "/events" },
  { label: "Mentors",          path: "/chat" },
];

export default function Navbar() {
  const theme    = useTheme();
  const router   = useRouter();
  const pathname = usePathname(); // ← tells us which page we're on

  const handleQuickExit = () => {
    localStorage.clear();
    window.location.href = "https://www.google.com";
  };

  return (
    <nav
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "16px 32px",
        borderBottom: `1px solid ${theme.cardBorder}`,
        backgroundColor: theme.bg,
        position: "sticky",
        top: 0,
        zIndex: 100,
      }}
    >
      {/* Logo */}
      <div
        style={{
          color: theme.accent,
          fontSize: "13px",
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          fontFamily: "sans-serif",
          cursor: "pointer",
        }}
        onClick={() => router.push("/dashboard")}
      >
        Sanctuary
      </div>

      {/* Nav links */}
      <div style={{ display: "flex", gap: "28px" }}>
        {navItems.map((item) => {
          // isActive = true when current page matches this nav item
          const isActive = pathname === item.path || pathname?.startsWith(item.path + "/");
          return (
            <button
              key={item.label}
              onClick={() => router.push(item.path)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                fontSize: "13px",
                fontFamily: "sans-serif",
                color: isActive ? theme.accent : theme.textMuted,
                fontWeight: isActive ? 600 : 400,
                padding: "0 0 2px 0",
                // Active underline
                borderBottom: isActive
                  ? `2px solid ${theme.accent}`
                  : "2px solid transparent",
                transition: "all 0.2s",
              }}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      {/* Quick Exit */}
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
  );
}