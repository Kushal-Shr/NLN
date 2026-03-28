"use client";

import { useState } from "react";
import { Search, Trash2, X } from "lucide-react";
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
  const [search, setSearch] = useState("");

  const filteredPeers = PEERS.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={onMobileClose}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-80 flex-col border-r border-white/10 bg-stealth-bg transition-transform duration-300 md:static md:z-auto md:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Sidebar header */}
        <div className="flex items-center gap-2 border-b border-white/10 px-3 py-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-stealth-muted" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Find a Guide..."
              className="w-full rounded-lg border border-white/10 bg-stealth-card py-2 pl-9 pr-3 text-xs text-stealth-text placeholder:text-stealth-muted/50 focus:border-stealth-accent/40 focus:outline-none"
            />
          </div>
          <button
            type="button"
            onClick={onMobileClose}
            className="rounded-lg p-2 text-stealth-muted hover:bg-white/5 md:hidden"
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
            <p className="mb-2 px-1 text-[10px] font-semibold uppercase tracking-widest text-stealth-muted">
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
                <p className="px-1 py-4 text-center text-xs text-stealth-muted">
                  No peers found.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar footer — Nuke */}
        <div className="border-t border-white/10 p-3">
          <button
            type="button"
            onClick={onNuke}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-red-500/20 bg-red-500/5 py-2 text-xs font-medium text-red-400 transition hover:bg-red-500/10"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Nuke Session
          </button>
        </div>
      </aside>
    </>
  );
}
