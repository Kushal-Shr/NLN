"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  Camera,
  CameraOff,
  Mic,
  MicOff,
  PhoneOff,
  DoorOpen,
  Shield,
  EyeOff,
} from "lucide-react";
import { useState } from "react";
import type { CircleEvent } from "./types";

type VideoOverlayProps = {
  event: CircleEvent | null;
  anonymous: boolean;
  onEnd: () => void;
};

export default function VideoOverlay({
  event,
  anonymous,
  onEnd,
}: VideoOverlayProps) {
  const [cameraOn, setCameraOn] = useState(!anonymous);
  const [micOn, setMicOn] = useState(true);

  if (!event) return null;

  return (
    <AnimatePresence>
      <motion.div
        key="video-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[70] flex flex-col bg-slate-950"
      >
        {/* Top bar */}
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-3">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 rounded-full border border-stealth-accent/30 bg-stealth-accent/10 px-3 py-1">
              <Shield className="h-3 w-3 text-stealth-accent" />
              <span className="text-[10px] font-medium text-stealth-accent">
                Encrypted Room
              </span>
            </div>
            <h2 className="text-sm font-semibold text-stealth-text">
              {event.title}
            </h2>
          </div>

          <a
            href="https://www.bbc.com"
            className="inline-flex items-center gap-1.5 rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-red-500"
            aria-label="Quick exit"
          >
            <DoorOpen className="h-3.5 w-3.5" />
            Quick Exit
          </a>
        </div>

        {/* Video grid area */}
        <div className="flex flex-1 items-center justify-center p-6">
          <div className="grid w-full max-w-4xl grid-cols-2 gap-4 md:grid-cols-3">
            {/* Host tile */}
            <div className="relative flex aspect-video items-center justify-center rounded-2xl bg-stealth-card">
              <div className="text-center">
                <p className="text-lg font-semibold text-stealth-text">
                  {event.host.charAt(0)}
                </p>
                <p className="mt-1 text-xs text-stealth-muted">{event.host}</p>
              </div>
              <span className="absolute bottom-2 left-2 rounded bg-black/40 px-1.5 py-0.5 text-[10px] text-white">
                Host
              </span>
            </div>

            {/* Self tile */}
            <div className="relative flex aspect-video items-center justify-center rounded-2xl border border-stealth-accent/20 bg-stealth-card">
              {cameraOn ? (
                <div className="text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-stealth-accent/20">
                    <Camera className="h-5 w-5 text-stealth-accent" />
                  </div>
                  <p className="mt-2 text-[11px] text-stealth-muted">
                    Camera preview
                  </p>
                </div>
              ) : (
                <div className="text-center">
                  <CameraOff className="mx-auto h-6 w-6 text-stealth-muted/40" />
                  <p className="mt-2 text-[11px] text-stealth-muted/50">
                    Camera off
                  </p>
                </div>
              )}
              <span className="absolute bottom-2 left-2 rounded bg-black/40 px-1.5 py-0.5 text-[10px] text-white">
                {anonymous ? "Wisdom Avatar" : "You"}
              </span>
              {anonymous && (
                <span className="absolute right-2 top-2">
                  <EyeOff className="h-3.5 w-3.5 text-stealth-muted/40" />
                </span>
              )}
            </div>

            {/* Placeholder participants */}
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="flex aspect-video items-center justify-center rounded-2xl bg-stealth-card/50"
              >
                <p className="text-xs text-stealth-muted/30">Participant {n}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom controls */}
        <div className="flex items-center justify-center gap-4 border-t border-white/10 py-4">
          <button
            type="button"
            onClick={() => setMicOn((v) => !v)}
            className={`flex h-12 w-12 items-center justify-center rounded-full transition ${
              micOn
                ? "bg-stealth-card text-stealth-text hover:bg-white/10"
                : "bg-red-500/20 text-red-400"
            }`}
            aria-label={micOn ? "Mute microphone" : "Unmute microphone"}
          >
            {micOn ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
          </button>

          <button
            type="button"
            onClick={() => setCameraOn((v) => !v)}
            className={`flex h-12 w-12 items-center justify-center rounded-full transition ${
              cameraOn
                ? "bg-stealth-card text-stealth-text hover:bg-white/10"
                : "bg-red-500/20 text-red-400"
            }`}
            aria-label={cameraOn ? "Turn camera off" : "Turn camera on"}
          >
            {cameraOn ? (
              <Camera className="h-5 w-5" />
            ) : (
              <CameraOff className="h-5 w-5" />
            )}
          </button>

          <button
            type="button"
            onClick={onEnd}
            className="flex h-14 w-14 items-center justify-center rounded-full bg-red-600 text-white transition hover:bg-red-500"
            aria-label="Leave circle"
          >
            <PhoneOff className="h-6 w-6" />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
