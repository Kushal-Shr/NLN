"use client";

import Link from "next/link";
import { User } from "lucide-react";
import type { Peer } from "./types";

type PeerCardProps = {
  peer: Peer;
  active: boolean;
};

export default function PeerCard({ peer, active }: PeerCardProps) {
  return (
    <Link
      href={`/chat/${peer.id}`}
      className={`flex items-center gap-3 rounded-lg px-3 py-2.5 transition ${
        active
          ? "bg-teal-900/20"
          : "hover:bg-white/5"
      }`}
    >
      <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-stealth-card">
        <User className="h-4 w-4 text-stealth-muted" />
        {peer.online && (
          <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-stealth-bg bg-emerald-400" />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-stealth-text">
            {peer.name}
          </span>
          <span className="shrink-0 text-[10px] text-stealth-muted">
            {peer.timestamp}
          </span>
        </div>
        <p className="truncate text-xs text-stealth-muted">
          {peer.lastMessage}
        </p>
      </div>
    </Link>
  );
}
