"use client";

import Link from "next/link";
import { Shield } from "lucide-react";
import type { Peer } from "./types";

type MentorCardProps = {
  mentor: Peer;
  active: boolean;
};

export default function MentorCard({ mentor, active }: MentorCardProps) {
  return (
    <div className="px-3 pt-3">
      <p className="mb-2 px-1 text-[10px] font-semibold uppercase tracking-widest text-amber-400/70">
        Sacred Connection
      </p>
      <Link
        href={`/chat/${mentor.id}`}
        className={`flex items-center gap-3 rounded-xl border p-3 transition ${
          active
            ? "border-amber-500/30 bg-teal-900/20"
            : "border-amber-500/20 bg-amber-500/5 hover:bg-amber-500/10"
        }`}
      >
        <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-500/15">
          <Shield className="h-5 w-5 text-amber-400" />
          <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-stealth-bg bg-emerald-400" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-stealth-text">
              {mentor.name}
            </span>
            {mentor.tier && (
              <span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-[10px] font-medium text-amber-400">
                {mentor.tier}
              </span>
            )}
          </div>
          <p className="truncate text-xs text-stealth-muted">
            {mentor.lastMessage}
          </p>
        </div>
      </Link>
    </div>
  );
}
