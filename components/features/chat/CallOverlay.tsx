"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Camera, CameraOff, PhoneOff, Shield } from "lucide-react";
import { useState } from "react";

type CallOverlayProps = {
  open: boolean;
  peerName: string;
  onEnd: () => void;
};

export default function CallOverlay({ open, peerName, onEnd }: CallOverlayProps) {
  const [cameraOn, setCameraOn] = useState(true);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="call-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] flex flex-col items-center justify-center bg-stealth-bg/95 backdrop-blur-sm"
        >
          {/* Secure badge */}
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8 flex items-center gap-2 rounded-full border border-stealth-accent/30 bg-stealth-accent/10 px-4 py-1.5"
          >
            <Shield className="h-3.5 w-3.5 text-stealth-accent" />
            <span className="text-xs font-medium text-stealth-accent">
              End-to-End Encrypted
            </span>
          </motion.div>

          {/* Pulse ring */}
          <div className="relative mb-6">
            <motion.div
              animate={{ scale: [1, 1.4, 1], opacity: [0.4, 0, 0.4] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-0 rounded-full bg-stealth-accent/20"
            />
            <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-stealth-card">
              <span className="text-2xl font-semibold text-stealth-text">
                {peerName.charAt(0)}
              </span>
            </div>
          </div>

          <h2 className="mb-1 text-xl font-semibold text-stealth-text">
            {peerName}
          </h2>
          <motion.p
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="mb-10 text-sm text-stealth-muted"
          >
            Establishing Secure, Encrypted Connection...
          </motion.p>

          {/* Controls */}
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setCameraOn((prev) => !prev)}
              className={`flex h-14 w-14 items-center justify-center rounded-full transition ${
                cameraOn
                  ? "bg-stealth-card text-stealth-text hover:bg-white/10"
                  : "bg-slate-600/50 text-stealth-muted"
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
              className="flex h-16 w-16 items-center justify-center rounded-full bg-red-600 text-white transition hover:bg-red-500"
              aria-label="End call"
            >
              <PhoneOff className="h-6 w-6" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
