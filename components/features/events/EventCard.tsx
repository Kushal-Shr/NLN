"use client";

import { motion } from "framer-motion";
import { Calendar, Clock, Users } from "lucide-react";
import Image from "next/image";
import { CATEGORY_META } from "./types";
import type { CircleEvent } from "./types";

type EventCardProps = {
  event: CircleEvent;
  registered: boolean;
  onJoin: (event: CircleEvent) => void;
};

export default function EventCard({
  event,
  registered,
  onJoin,
}: EventCardProps) {
  const meta = CATEGORY_META[event.category];

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ type: "spring" as const, stiffness: 300, damping: 22 }}
      className="group flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-stealth-card"
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
        <div className="absolute inset-0 bg-gradient-to-t from-stealth-bg/80 to-transparent" />

        {/* Live badge */}
        {event.isLive && (
          <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-red-600/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
            Live Now
          </span>
        )}

        {/* Category badge */}
        <span
          className={`absolute right-3 top-3 rounded-full bg-black/50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider backdrop-blur-sm ${meta.color}`}
        >
          {meta.label}
        </span>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col gap-3 p-4">
        <h3 className="text-sm font-semibold leading-snug text-stealth-text line-clamp-2">
          {event.title}
        </h3>

        <p className="text-xs text-stealth-muted">
          {event.host}{" "}
          <span className="text-stealth-muted/50">· {event.hostRole}</span>
        </p>

        <div className="flex items-center gap-4 text-[11px] text-stealth-muted">
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
            <span className="inline-flex w-full items-center justify-center rounded-xl border border-stealth-accent/30 bg-stealth-accent/10 py-2 text-xs font-medium text-stealth-accent">
              Registered
            </span>
          ) : (
            <button
              type="button"
              onClick={() => onJoin(event)}
              className={`w-full rounded-xl py-2 text-xs font-semibold transition ${
                event.isLive
                  ? "bg-red-600 text-white hover:bg-red-500"
                  : "bg-stealth-accent text-white hover:opacity-90"
              }`}
            >
              {event.isLive ? "Join Circle — Live" : "Join Circle"}
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
