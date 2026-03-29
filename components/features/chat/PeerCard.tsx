"use client";

import Link from "next/link";
import { User } from "lucide-react";
import { useTheme } from "@/lib/ThemeContext";
import type { Peer } from "./types";

type PeerCardProps = {
  peer: Peer;
  active: boolean;
};

const STATUS_COLORS: Record<string, string> = {
  online: "#34d399",
  away:   "#fbbf24",
};

export default function PeerCard({ peer, active }: PeerCardProps) {
  const theme = useTheme();
  const dotColor = STATUS_COLORS[peer.status];

  return (
    <Link
      href={`/chat/${peer.id}`}
      className="flex items-center gap-3 rounded-lg px-3 py-2.5 transition"
      style={{
        backgroundColor: active ? `${theme.accent}10` : "transparent",
      }}
    >
      <div
        className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
        style={{ backgroundColor: theme.surface }}
      >
        <User className="h-4 w-4" style={{ color: theme.textMuted }} />
        {dotColor && (
          <span
            className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full"
            style={{ backgroundColor: dotColor, border: `2px solid ${theme.bg}` }}
          />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between">
          <span
            className="text-sm font-medium"
            style={{ color: theme.text, fontFamily: "sans-serif" }}
          >
            {peer.name}
          </span>
          <span
            className="shrink-0 text-[10px]"
            style={{ color: theme.textMuted, fontFamily: "sans-serif" }}
          >
            {peer.timestamp}
          </span>
        </div>
        <p
          className="truncate text-xs"
          style={{ color: theme.textMuted, fontFamily: "sans-serif" }}
        >
          {peer.lastMessage}
        </p>
      </div>
    </Link>
  );
}
