"use client";

// ============================================================
// components/features/journal/EnergyTracker.tsx
// Slider showing inner energy level — Depleted to Radiant
// ============================================================

import { Zap } from "lucide-react";
import { useTheme } from "@/lib/ThemeContext";

type EnergyTrackerProps = {
  value: number;
  onChange: (v: number) => void;
};

function energyLabel(v: number) {
  if (v <= 20) return "Depleted";
  if (v <= 40) return "Low Tide";
  if (v <= 60) return "Steady";
  if (v <= 80) return "Charged";
  return "Radiant";
}

export default function EnergyTracker({ value, onChange }: EnergyTrackerProps) {
  const theme = useTheme();

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>

      {/* Label row */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <Zap size={13} color="#C6A868" />
          <span style={{ fontSize: "12px", fontFamily: "sans-serif", color: theme.textMuted }}>
            Inner Energy
          </span>
        </div>
        <span style={{ fontSize: "12px", fontFamily: "sans-serif", fontWeight: 600, color: theme.text }}>
          {energyLabel(value)}
        </span>
      </div>

      {/* Slider */}
      <input
        type="range"
        min={0}
        max={100}
        step={1}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{
          width: "100%",
          accentColor: theme.accent,
          cursor: "pointer",
          height: "4px",
        }}
      />

      {/* Min/max labels */}
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <span style={{ fontSize: "10px", fontFamily: "sans-serif", color: theme.textMuted, opacity: 0.5 }}>Depleted</span>
        <span style={{ fontSize: "10px", fontFamily: "sans-serif", color: theme.textMuted, opacity: 0.5 }}>Radiant</span>
      </div>

    </div>
  );
}
