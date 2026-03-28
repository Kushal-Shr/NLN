"use client";

import { Zap } from "lucide-react";

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
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Zap className="h-3.5 w-3.5 text-amber-400" />
          <span className="text-xs font-medium text-stealth-muted">
            Inner Energy
          </span>
        </div>
        <span className="text-xs font-semibold text-stealth-text">
          {energyLabel(value)}
        </span>
      </div>

      <input
        type="range"
        min={0}
        max={100}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-slate-700 accent-stealth-accent outline-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-stealth-accent [&::-webkit-slider-thumb]:shadow-md"
      />

      <div className="flex justify-between text-[10px] text-stealth-muted/50">
        <span>Depleted</span>
        <span>Radiant</span>
      </div>
    </div>
  );
}
