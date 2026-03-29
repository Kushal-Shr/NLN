"use client";

import { motion } from "framer-motion";
import { Calendar, Clock, Users } from "lucide-react";
import Image from "next/image";
import { CATEGORY_META } from "./types";
import type { CircleEvent } from "./types";
import type { Theme } from "@/lib/ThemeContext";

type EventCardProps = {
  event: CircleEvent;
  registered: boolean;
  onJoin: (event: CircleEvent) => void;
  theme: Theme;
};

export default function EventCard({
  event,
  registered,
  onJoin,
  theme,
}: EventCardProps) {
  const meta = CATEGORY_META[event.category];

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ type: "spring" as const, stiffness: 300, damping: 22 }}
      className="group flex flex-col overflow-hidden rounded-2xl"
      style={{
        backgroundColor: theme.cardBg,
        border: `1px solid ${theme.cardBorder}`,
        boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
      }}
    >
      {/* Cover image */}
      <div className="relative h-44 w-full overflow-hidden">
        <Image
          src={event.coverUrl}
          alt={event.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 400px"
          unoptimized
        />

        {/* Live badge */}
        {event.isLive && (
          <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-red-600/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
            Live Now
          </span>
        )}

        {/* Category badge */}
        <span
          className="absolute right-3 top-3 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider"
          style={{
            backgroundColor: `${theme.accent}CC`,
            color: "#fff",
          }}
        >
          {meta.label}
        </span>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col gap-3 p-4">
        <h3
          className="text-sm font-semibold leading-snug line-clamp-2"
          style={{ color: theme.text, fontFamily: "sans-serif" }}
        >
          {event.title}
        </h3>

        <p className="text-xs" style={{ color: theme.textMuted, fontFamily: "sans-serif" }}>
          {event.host}{" "}
          <span style={{ opacity: 0.5 }}>· {event.hostRole}</span>
        </p>

        <div
          className="flex items-center gap-4 text-[11px]"
          style={{ color: theme.textMuted, fontFamily: "sans-serif" }}
        >
          <span className="inline-flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {event.date}
          </span>
          <span className="inline-flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {event.time}
          </span>
          <span className="inline-flex items-center gap-1">
            <Users className="h-3 w-3" />
            {event.attendees}
          </span>
        </div>

        {/* Action button */}
        <div className="mt-auto pt-1">
          {registered ? (
            <span
              className="inline-flex w-full items-center justify-center rounded-xl py-2 text-xs font-medium"
              style={{
                border: `1px solid ${theme.accentSoft}`,
                backgroundColor: `${theme.accent}10`,
                color: theme.accent,
                fontFamily: "sans-serif",
              }}
            >
              Registered
            </span>
          ) : (
            <button
              type="button"
              onClick={() => onJoin(event)}
              className="w-full rounded-xl py-2 text-xs font-semibold transition"
              style={{
                backgroundColor: event.isLive ? "#c0392b" : theme.btnBg,
                color: event.isLive ? "#fff" : theme.btnColor,
                fontFamily: "sans-serif",
              }}
            >
              {event.isLive ? "Join Circle — Live" : "Join Circle"}
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
