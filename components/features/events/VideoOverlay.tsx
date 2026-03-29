"use client";
 
import { motion, AnimatePresence } from "framer-motion";
import { Camera, CameraOff, Mic, MicOff, PhoneOff, DoorOpen, Shield, EyeOff } from "lucide-react";
import { useState } from "react";
import type { CircleEvent } from "./types";
import { useTheme } from "@/lib/ThemeContext";
 
type VideoOverlayProps = {
  event: CircleEvent | null;
  anonymous: boolean;
  onEnd: () => void;
};
 
export function VideoOverlay({ event, anonymous, onEnd }: VideoOverlayProps) {
  const theme = useTheme();
  const [cameraOn, setCameraOn] = useState(!anonymous);
  const [micOn,    setMicOn]    = useState(true);
 
  if (!event) return null;
 
  return (
    <AnimatePresence>
      <motion.div
        key="video-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{ position: "fixed", inset: 0, zIndex: 70, display: "flex", flexDirection: "column", backgroundColor: theme.bg }}
      >
        {/* Top bar */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          borderBottom: `1px solid ${theme.cardBorder}`,
          padding: "12px 20px",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{
              display: "flex", alignItems: "center", gap: "6px",
              borderRadius: "20px", border: `1px solid ${theme.accent}40`,
              background: `${theme.accent}12`, padding: "4px 12px",
            }}>
              <Shield style={{ width: "12px", height: "12px", color: theme.accent }} />
              <span style={{ fontSize: "10px", fontFamily: "sans-serif", fontWeight: 500, color: theme.accent }}>
                Encrypted Room
              </span>
            </div>
            <h2 style={{ fontSize: "14px", fontFamily: "sans-serif", fontWeight: 600, color: theme.text }}>
              {event.title}
            </h2>
          </div>
 
          <a
            href="https://www.google.com"
            style={{
              display: "inline-flex", alignItems: "center", gap: "6px",
              background: "#c0392b", color: "white", borderRadius: "10px",
              padding: "6px 14px", fontSize: "12px", fontFamily: "sans-serif",
              fontWeight: 600, textDecoration: "none",
            }}
          >
            <DoorOpen style={{ width: "13px", height: "13px" }} />
            Quick Exit
          </a>
        </div>
 
        {/* Video grid */}
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", width: "100%", maxWidth: "900px" }}>
 
            {/* Host tile */}
            <div style={{
              aspectRatio: "16/9", display: "flex", alignItems: "center", justifyContent: "center",
              borderRadius: "16px", background: theme.surface, border: `1px solid ${theme.cardBorder}`,
              position: "relative",
            }}>
              <div style={{ textAlign: "center" }}>
                <p style={{ fontSize: "20px", fontFamily: "sans-serif", fontWeight: 600, color: theme.text }}>
                  {event.host.charAt(0)}
                </p>
                <p style={{ fontSize: "11px", fontFamily: "sans-serif", color: theme.textMuted, marginTop: "4px" }}>
                  {event.host}
                </p>
              </div>
              <span style={{ position: "absolute", bottom: "8px", left: "8px", background: "rgba(0,0,0,0.5)", borderRadius: "6px", padding: "2px 8px", fontSize: "10px", color: "white", fontFamily: "sans-serif" }}>
                Host
              </span>
            </div>
 
            {/* Self tile */}
            <div style={{
              aspectRatio: "16/9", display: "flex", alignItems: "center", justifyContent: "center",
              borderRadius: "16px", background: theme.surface,
              border: `1px solid ${theme.accent}30`, position: "relative",
            }}>
              {cameraOn ? (
                <div style={{ textAlign: "center" }}>
                  <div style={{ width: "48px", height: "48px", borderRadius: "50%", background: `${theme.accent}20`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 8px" }}>
                    <Camera style={{ width: "20px", height: "20px", color: theme.accent }} />
                  </div>
                  <p style={{ fontSize: "11px", fontFamily: "sans-serif", color: theme.textMuted }}>Camera preview</p>
                </div>
              ) : (
                <div style={{ textAlign: "center" }}>
                  <CameraOff style={{ width: "24px", height: "24px", color: theme.textMuted, opacity: 0.4, margin: "0 auto 8px" }} />
                  <p style={{ fontSize: "11px", fontFamily: "sans-serif", color: theme.textMuted, opacity: 0.5 }}>Camera off</p>
                </div>
              )}
              <span style={{ position: "absolute", bottom: "8px", left: "8px", background: "rgba(0,0,0,0.5)", borderRadius: "6px", padding: "2px 8px", fontSize: "10px", color: "white", fontFamily: "sans-serif" }}>
                {anonymous ? "Wisdom Avatar" : "You"}
              </span>
              {anonymous && <EyeOff style={{ position: "absolute", right: "8px", top: "8px", width: "14px", height: "14px", color: theme.textMuted, opacity: 0.4 }} />}
            </div>
 
            {/* Placeholder participants */}
            {[1, 2, 3].map((n) => (
              <div key={n} style={{
                aspectRatio: "16/9", display: "flex", alignItems: "center", justifyContent: "center",
                borderRadius: "16px", background: `${theme.surface}80`, border: `1px solid ${theme.cardBorder}`,
              }}>
                <p style={{ fontSize: "11px", fontFamily: "sans-serif", color: theme.textMuted, opacity: 0.3 }}>Participant {n}</p>
              </div>
            ))}
          </div>
        </div>
 
        {/* Controls */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "center", gap: "16px",
          borderTop: `1px solid ${theme.cardBorder}`, padding: "16px",
        }}>
          <button type="button" onClick={() => setMicOn((v) => !v)}
            style={{
              width: "48px", height: "48px", borderRadius: "50%", border: "none", cursor: "pointer",
              background: micOn ? theme.cardBg : "rgba(192,57,43,0.2)",
              color: micOn ? theme.text : "#e05555", display: "flex", alignItems: "center", justifyContent: "center",
            }}>
            {micOn ? <Mic size={20} /> : <MicOff size={20} />}
          </button>
 
          <button type="button" onClick={() => setCameraOn((v) => !v)}
            style={{
              width: "48px", height: "48px", borderRadius: "50%", border: "none", cursor: "pointer",
              background: cameraOn ? theme.cardBg : "rgba(192,57,43,0.2)",
              color: cameraOn ? theme.text : "#e05555", display: "flex", alignItems: "center", justifyContent: "center",
            }}>
            {cameraOn ? <Camera size={20} /> : <CameraOff size={20} />}
          </button>
 
          <button type="button" onClick={onEnd}
            style={{
              width: "56px", height: "56px", borderRadius: "50%", border: "none", cursor: "pointer",
              background: "#c0392b", color: "white",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
            <PhoneOff size={22} />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
 
export default VideoOverlay;