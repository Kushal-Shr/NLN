"use client";

import { motion } from "framer-motion";
import { Calendar, Clock, Users } from "lucide-react";
import Image from "next/image";
import { CATEGORY_META } from "./types";
import type { CircleEvent } from "./types";
import { useTheme } from "@/lib/ThemeContext";

type EventCardProps = {
  event: CircleEvent;
  registered: boolean;
  onJoin: (event: CircleEvent) => void;
};

export default function EventCard({ event, registered, onJoin }: EventCardProps) {
  const theme = useTheme();
  const meta  = CATEGORY_META[event.category];

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ type: "spring" as const, stiffness: 300, damping: 22 }}
      style={{
        display: "flex", flexDirection: "column",
        overflow: "hidden", borderRadius: "16px",
        border: `1px solid ${theme.cardBorder}`,
        background: theme.cardBg,
      }}
    >
      {/* Cover image */}
      <div style={{ position: "relative", height: "176px", width: "100%", overflow: "hidden" }}>
        <Image
          src={event.coverUrl}
          alt={event.title}
          fill
          style={{ objectFit: "cover", transition: "transform 0.5s" }}
          sizes="(max-width: 768px) 100vw, 400px"
          unoptimized
        />
        {/* Dark gradient overlay */}
        <div style={{ position: "absolute", inset: 0, background: `linear-gradient(to top, ${theme.bg}cc, transparent)` }} />

        {/* Live badge */}
        {event.isLive && (
          <span style={{
            position: "absolute", left: "12px", top: "12px",
            display: "inline-flex", alignItems: "center", gap: "6px",
            background: "rgba(192,57,43,0.9)", borderRadius: "20px",
            padding: "4px 10px", fontSize: "10px", fontFamily: "sans-serif",
            fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "white",
          }}>
            <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "white", animation: "pulse 1s infinite" }} />
            Live Now
          </span>
        )}

        {/* Category badge */}
        <span style={{
          position: "absolute", right: "12px", top: "12px",
          background: "rgba(0,0,0,0.5)", borderRadius: "20px",
          padding: "4px 10px", fontSize: "10px", fontFamily: "sans-serif",
          fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase",
          color: meta.hexColor,
          backdropFilter: "blur(4px)",
        }}>
          {meta.label}
        </span>
      </div>

      {/* Body */}
      <div style={{ display: "flex", flexDirection: "column", gap: "10px", padding: "16px", flex: 1 }}>
        <h3 style={{ fontSize: "14px", fontFamily: "sans-serif", fontWeight: 600, color: theme.text, lineHeight: 1.4, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
          {event.title}
        </h3>

        <p style={{ fontSize: "12px", fontFamily: "sans-serif", color: theme.textMuted }}>
          {event.host}{" "}
          <span style={{ opacity: 0.5 }}>· {event.hostRole}</span>
        </p>

        <div style={{ display: "flex", alignItems: "center", gap: "14px", fontSize: "11px", fontFamily: "sans-serif", color: theme.textMuted }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
            <Calendar style={{ width: "12px", height: "12px" }} /> {event.date}
          </span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
            <Clock style={{ width: "12px", height: "12px" }} /> {event.time}
          </span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
            <Users style={{ width: "12px", height: "12px" }} /> {event.attendees}
          </span>
        </div>

        {/* Action button */}
        <div style={{ marginTop: "auto", paddingTop: "4px" }}>
          {registered ? (
            <span style={{
              display: "flex", width: "100%", alignItems: "center", justifyContent: "center",
              borderRadius: "12px", border: `1px solid ${theme.accent}40`,
              background: `${theme.accent}12`, padding: "8px",
              fontSize: "12px", fontFamily: "sans-serif", fontWeight: 500, color: theme.accent,
            }}>
              Registered
            </span>
          ) : (
            <button
              type="button"
              onClick={() => onJoin(event)}
              style={{
                width: "100%", borderRadius: "12px", padding: "9px",
                fontSize: "12px", fontFamily: "sans-serif", fontWeight: 600,
                border: "none", cursor: "pointer", transition: "all 0.2s",
                background: event.isLive ? "#c0392b" : theme.accent,
                color: event.isLive ? "white" : theme.bg,
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