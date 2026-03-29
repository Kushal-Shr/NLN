"use client";

import Link from "next/link";
import { Shield } from "lucide-react";
import { useTheme } from "@/lib/ThemeContext";
import type { Peer } from "./types";

type MentorCardProps = {
  mentor: Peer;
  active: boolean;
};

export default function MentorCard({ mentor, active }: MentorCardProps) {
  const theme = useTheme();

  return (
    <div className="px-3 pt-3">
      <p
        className="mb-2 px-1 text-[10px] font-semibold uppercase tracking-widest"
        style={{ color: theme.accent, opacity: 0.7, fontFamily: "sans-serif" }}
      >
        Sacred Connection
      </p>
      <Link
        href={`/chat/${mentor.id}`}
        className="flex items-center gap-3 rounded-xl p-3 transition"
        style={{
          border: `1px solid ${theme.accentSoft}`,
          backgroundColor: active ? `${theme.accent}10` : `${theme.accent}05`,
        }}
      >
        <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full" style={{ backgroundColor: `${theme.accent}15` }}>
          <Shield className="h-5 w-5" style={{ color: theme.accent }} />
          <span
            className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-emerald-400"
            style={{ border: `2px solid ${theme.bg}` }}
          />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span
              className="text-sm font-semibold"
              style={{ color: theme.text, fontFamily: "sans-serif" }}
            >
              {mentor.name}
            </span>
            {mentor.tier && (
              <span
                className="rounded-full px-2 py-0.5 text-[10px] font-medium"
                style={{
                  backgroundColor: `${theme.accent}15`,
                  color: theme.accent,
                  fontFamily: "sans-serif",
                }}
              >
                {mentor.tier}
              </span>
            )}
          </div>
          <p
            className="truncate text-xs"
            style={{ color: theme.textMuted, fontFamily: "sans-serif" }}
          >
            {mentor.lastMessage}
          </p>
        </div>
      </Link>
    </div>
  );
}
