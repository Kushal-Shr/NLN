"use client";

import { useState } from "react";
import { Search, Trash2, X } from "lucide-react";
import { useTheme } from "@/lib/ThemeContext";
import MentorCard from "./MentorCard";
import PeerCard from "./PeerCard";
import { MENTOR, PEERS } from "./types";

type ChatSidebarProps = {
  activeChatId: string | null;
  onNuke: () => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
};

export default function ChatSidebar({
  activeChatId,
  onNuke,
  mobileOpen,
  onMobileClose,
}: ChatSidebarProps) {
  const theme = useTheme();
  const [search, setSearch] = useState("");

  const filteredPeers = PEERS.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/20 md:hidden"
          onClick={onMobileClose}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-80 flex-col transition-transform duration-300 md:static md:z-auto md:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{
          backgroundColor: theme.bg,
          borderRight: `1px solid ${theme.cardBorder}`,
        }}
      >
        {/* Sidebar header */}
        <div
          className="flex items-center gap-2 px-3 py-3"
          style={{ borderBottom: `1px solid ${theme.cardBorder}` }}
        >
          <div className="relative flex-1">
            <Search
              className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2"
              style={{ color: theme.textMuted }}
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Find a Guide..."
              className="w-full rounded-lg py-2 pl-9 pr-3 text-xs focus:outline-none"
              style={{
                backgroundColor: theme.cardBg,
                border: `1px solid ${theme.cardBorder}`,
                color: theme.text,
                fontFamily: "sans-serif",
              }}
            />
          </div>
          <button
            type="button"
            onClick={onMobileClose}
            className="rounded-lg p-2 md:hidden"
            style={{ color: theme.textMuted }}
            aria-label="Close sidebar"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto">
          {/* Pinned Mentor */}
          <MentorCard mentor={MENTOR} active={activeChatId === MENTOR.id} />

          {/* Recent Peers */}
          <div className="mt-4 px-3">
            <p
              className="mb-2 px-1 text-[10px] font-semibold uppercase tracking-widest"
              style={{ color: theme.textMuted, fontFamily: "sans-serif" }}
            >
              Recent Peers
            </p>
            <div className="space-y-0.5">
              {filteredPeers.map((peer) => (
                <PeerCard
                  key={peer.id}
                  peer={peer}
                  active={activeChatId === peer.id}
                />
              ))}
              {filteredPeers.length === 0 && (
                <p
                  className="px-1 py-4 text-center text-xs"
                  style={{ color: theme.textMuted, fontFamily: "sans-serif" }}
                >
                  No peers found.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar footer — Nuke */}
        <div className="p-3" style={{ borderTop: `1px solid ${theme.cardBorder}` }}>
          <button
            type="button"
            onClick={onNuke}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-red-500/20 bg-red-500/5 py-2 text-xs font-medium text-red-500 transition hover:bg-red-500/10"
            style={{ fontFamily: "sans-serif" }}
          >
            <Trash2 className="h-3.5 w-3.5" />
            Nuke Session
          </button>
        </div>
      </aside>
    </>
  );
}
