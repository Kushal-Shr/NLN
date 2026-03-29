"use client";

import { Phone, Video, DoorOpen, Menu } from "lucide-react";
import { useTheme } from "@/lib/ThemeContext";
import type { Peer } from "./types";

type ChatHeaderProps = {
  peer: Peer;
  onVoiceCall: () => void;
  onVideoCall: () => void;
  onMobileMenuToggle: () => void;
};

export default function ChatHeader({
  peer,
  onVoiceCall,
  onVideoCall,
  onMobileMenuToggle,
}: ChatHeaderProps) {
  const theme = useTheme();

  return (
    <header
      className="flex items-center gap-3 px-4 py-3"
      style={{ borderBottom: `1px solid ${theme.cardBorder}` }}
    >
      {/* Mobile hamburger */}
      <button
        type="button"
        onClick={onMobileMenuToggle}
        className="rounded-lg p-1.5 md:hidden"
        style={{ color: theme.textMuted }}
        aria-label="Toggle sidebar"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Name + tier */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <h2
            className="text-sm font-semibold"
            style={{ color: theme.text, fontFamily: "sans-serif" }}
          >
            {peer.name}
          </h2>
          {peer.online && (
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
          )}
        </div>
        {peer.tier && (
          <p
            className="text-[11px]"
            style={{ color: theme.textMuted, fontFamily: "sans-serif" }}
          >
            {peer.tier}
          </p>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={onVoiceCall}
          className="rounded-lg p-2 transition"
          style={{ color: theme.textMuted }}
          aria-label="Voice call"
        >
          <Phone className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={onVideoCall}
          className="rounded-lg p-2 transition"
          style={{ color: theme.textMuted }}
          aria-label="Video call"
        >
          <Video className="h-4 w-4" />
        </button>
        <a
          href="https://www.bbc.com"
          className="rounded-lg bg-red-600 p-2 text-white transition hover:bg-red-500"
          aria-label="Quick exit"
        >
          <DoorOpen className="h-4 w-4" />
        </a>
      </div>
    </header>
  );
}
