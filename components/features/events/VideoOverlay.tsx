"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Camera,
  CameraOff,
  Mic,
  MicOff,
  PhoneOff,
  DoorOpen,
  Shield,
  Users,
} from "lucide-react";
import { useTheme } from "@/lib/ThemeContext";
import type { CircleEvent } from "./types";

type VideoOverlayProps = {
  event: CircleEvent | null;
  anonymous: boolean;
  onEnd: () => void;
};

const MOCK_PARTICIPANTS = [
  { id: "p1", name: "Guide Sarah", initials: "GS" },
  { id: "p2", name: "River Stone", initials: "RS" },
];

export default function VideoOverlay({
  event,
  anonymous,
  onEnd,
}: VideoOverlayProps) {
  const theme = useTheme();

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [cameraOn, setCameraOn] = useState(true);
  const [micOn, setMicOn] = useState(true);
  const [mediaError, setMediaError] = useState<string | null>(null);
  const [showOthers, setShowOthers] = useState(false);

  // Acquire media stream when overlay opens
  useEffect(() => {
    if (!event) return;

    let cancelled = false;

    async function startMedia() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        if (!cancelled) {
          setMediaError(
            err instanceof DOMException && err.name === "NotAllowedError"
              ? "Camera or microphone access was denied. Please allow permissions and try again."
              : "Could not access your camera or microphone."
          );
        }
      }
    }

    setCameraOn(!anonymous);
    setMicOn(true);
    setMediaError(null);
    setShowOthers(false);
    startMedia();

    return () => {
      cancelled = true;
      streamRef.current?.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    };
  }, [event, anonymous]);

  // Toggle camera track
  useEffect(() => {
    const track = streamRef.current?.getVideoTracks()[0];
    if (track) track.enabled = cameraOn;
  }, [cameraOn]);

  // Toggle mic track
  useEffect(() => {
    const track = streamRef.current?.getAudioTracks()[0];
    if (track) track.enabled = micOn;
  }, [micOn]);

  const handleLeave = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    onEnd();
  }, [onEnd]);

  if (!event) return null;

  const soloMode = !showOthers;

  return (
    <AnimatePresence>
      <motion.div
        key="video-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[70] flex flex-col"
        style={{ backgroundColor: theme.bg }}
      >
        {/* ── Top bar ──────────────────────────────────────── */}
        <div
          className="flex items-center justify-between px-5 py-3"
          style={{ borderBottom: `1px solid ${theme.cardBorder}` }}
        >
          <div className="flex items-center gap-3">
            <div
              className="flex items-center gap-1.5 rounded-full px-3 py-1"
              style={{
                border: `1px solid ${theme.accentSoft}`,
                backgroundColor: `${theme.accent}10`,
              }}
            >
              <Shield className="h-3 w-3" style={{ color: theme.accent }} />
              <span
                className="text-[10px] font-medium"
                style={{ color: theme.accent, fontFamily: "sans-serif" }}
              >
                Encrypted Room
              </span>
            </div>
            <h2
              className="text-sm font-semibold"
              style={{ color: theme.text, fontFamily: "sans-serif" }}
            >
              {event.title}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setShowOthers((v) => !v)}
              className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition"
              style={{
                border: `1px solid ${theme.cardBorder}`,
                color: showOthers ? theme.accent : theme.textMuted,
                backgroundColor: showOthers ? `${theme.accent}10` : "transparent",
                fontFamily: "sans-serif",
              }}
            >
              <Users className="h-3.5 w-3.5" />
              {showOthers ? "Solo View" : "Gallery View"}
            </button>

            <a
              href="https://www.bbc.com"
              className="inline-flex items-center gap-1.5 rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-red-500"
              aria-label="Quick exit"
              style={{ fontFamily: "sans-serif" }}
            >
              <DoorOpen className="h-3.5 w-3.5" />
              Quick Exit
            </a>
          </div>
        </div>

        {/* ── Video area ───────────────────────────────────── */}
        <div className="flex flex-1 items-center justify-center p-6">
          {mediaError ? (
            <div
              className="flex max-w-md flex-col items-center gap-4 rounded-2xl p-8 text-center"
              style={{
                backgroundColor: theme.cardBg,
                border: `1px solid ${theme.cardBorder}`,
                boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
              }}
            >
              <CameraOff className="h-10 w-10" style={{ color: theme.textMuted }} />
              <p
                className="text-sm leading-relaxed"
                style={{ color: theme.text, fontFamily: "sans-serif" }}
              >
                {mediaError}
              </p>
              <button
                type="button"
                onClick={handleLeave}
                className="rounded-xl px-6 py-2.5 text-sm font-medium transition"
                style={{
                  backgroundColor: theme.btnBg,
                  color: theme.btnColor,
                  fontFamily: "sans-serif",
                }}
              >
                Go Back
              </button>
            </div>
          ) : soloMode ? (
            /* ── Solo: single large centered card ─────────── */
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative w-full max-w-2xl overflow-hidden rounded-2xl"
              style={{
                border: `1px solid ${theme.cardBorder}`,
                boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
                aspectRatio: "16 / 9",
              }}
            >
              {cameraOn ? (
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="h-full w-full object-cover"
                  style={{ transform: "scaleX(-1)" }}
                />
              ) : (
                <div
                  className="flex h-full w-full flex-col items-center justify-center gap-3"
                  style={{ backgroundColor: theme.surface }}
                >
                  <CameraOff className="h-10 w-10" style={{ color: theme.textMuted, opacity: 0.4 }} />
                  <p
                    className="text-sm"
                    style={{ color: theme.textMuted, fontFamily: "sans-serif" }}
                  >
                    Camera is off
                  </p>
                </div>
              )}

              <span
                className="absolute bottom-3 left-3 rounded-lg px-2.5 py-1 text-[11px] font-medium backdrop-blur-sm"
                style={{
                  backgroundColor: "rgba(255,255,255,0.7)",
                  color: theme.text,
                  fontFamily: "sans-serif",
                }}
              >
                {anonymous ? "Wisdom Avatar" : "You"}
              </span>

              {!micOn && (
                <span
                  className="absolute bottom-3 right-3 rounded-lg p-1.5 backdrop-blur-sm"
                  style={{ backgroundColor: "rgba(255,255,255,0.7)" }}
                >
                  <MicOff className="h-3.5 w-3.5 text-red-500" />
                </span>
              )}
            </motion.div>
          ) : (
            /* ── Gallery: grid layout ─────────────────────── */
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid w-full max-w-4xl gap-4"
              style={{
                gridTemplateColumns: `repeat(${Math.min(MOCK_PARTICIPANTS.length + 1, 3)}, 1fr)`,
              }}
            >
              {/* Self tile */}
              <div
                className="relative overflow-hidden rounded-2xl"
                style={{
                  aspectRatio: "16 / 9",
                  border: `1px solid ${theme.cardBorder}`,
                  boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
                }}
              >
                {cameraOn ? (
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="h-full w-full object-cover"
                    style={{ transform: "scaleX(-1)" }}
                  />
                ) : (
                  <div
                    className="flex h-full w-full flex-col items-center justify-center gap-2"
                    style={{ backgroundColor: theme.surface }}
                  >
                    <CameraOff className="h-6 w-6" style={{ color: theme.textMuted, opacity: 0.4 }} />
                  </div>
                )}
                <span
                  className="absolute bottom-2 left-2 rounded-lg px-2 py-0.5 text-[10px] font-medium backdrop-blur-sm"
                  style={{
                    backgroundColor: "rgba(255,255,255,0.7)",
                    color: theme.text,
                    fontFamily: "sans-serif",
                  }}
                >
                  {anonymous ? "Wisdom Avatar" : "You"}
                </span>
              </div>

              {/* Mock participant tiles */}
              {MOCK_PARTICIPANTS.map((p) => (
                <div
                  key={p.id}
                  className="relative flex items-center justify-center overflow-hidden rounded-2xl"
                  style={{
                    aspectRatio: "16 / 9",
                    backgroundColor: theme.surface,
                    border: `1px solid ${theme.cardBorder}`,
                    boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
                  }}
                >
                  <div
                    className="flex h-12 w-12 items-center justify-center rounded-full text-sm font-semibold"
                    style={{
                      backgroundColor: `${theme.accent}15`,
                      color: theme.accent,
                      fontFamily: "sans-serif",
                    }}
                  >
                    {p.initials}
                  </div>
                  <span
                    className="absolute bottom-2 left-2 rounded-lg px-2 py-0.5 text-[10px] font-medium backdrop-blur-sm"
                    style={{
                      backgroundColor: "rgba(255,255,255,0.7)",
                      color: theme.text,
                      fontFamily: "sans-serif",
                    }}
                  >
                    {p.name}
                  </span>
                </div>
              ))}
            </motion.div>
          )}
        </div>

        {/* ── Floating controls ────────────────────────────── */}
        <div
          className="flex items-center justify-center gap-4 py-4"
          style={{ borderTop: `1px solid ${theme.cardBorder}` }}
        >
          <button
            type="button"
            onClick={() => setMicOn((v) => !v)}
            className="flex h-12 w-12 items-center justify-center rounded-full transition"
            style={{
              backgroundColor: micOn ? theme.cardBg : "rgba(220,38,38,0.1)",
              color: micOn ? theme.text : "#dc2626",
              border: `1px solid ${micOn ? theme.cardBorder : "rgba(220,38,38,0.3)"}`,
              boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
            }}
            aria-label={micOn ? "Mute" : "Unmute"}
          >
            {micOn ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
          </button>

          <button
            type="button"
            onClick={() => setCameraOn((v) => !v)}
            className="flex h-12 w-12 items-center justify-center rounded-full transition"
            style={{
              backgroundColor: cameraOn ? theme.cardBg : "rgba(220,38,38,0.1)",
              color: cameraOn ? theme.text : "#dc2626",
              border: `1px solid ${cameraOn ? theme.cardBorder : "rgba(220,38,38,0.3)"}`,
              boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
            }}
            aria-label={cameraOn ? "Turn Off Camera" : "Turn On Camera"}
          >
            {cameraOn ? <Camera className="h-5 w-5" /> : <CameraOff className="h-5 w-5" />}
          </button>

          <button
            type="button"
            onClick={handleLeave}
            className="flex h-14 w-14 items-center justify-center rounded-full bg-red-600 text-white transition hover:bg-red-500"
            aria-label="Leave Meeting"
          >
            <PhoneOff className="h-6 w-6" />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
