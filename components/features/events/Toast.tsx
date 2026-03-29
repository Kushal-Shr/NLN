// ============================================================
// components/features/events/Toast.tsx
// ============================================================
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle } from "lucide-react";
import { useTheme } from "@/lib/ThemeContext";

type ToastProps = { message: string | null };

export function Toast({ message }: ToastProps) {
  const theme = useTheme();
  return (
    <AnimatePresence>
      {message && (
        <motion.div
          key="toast"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          transition={{ type: "spring" as const, stiffness: 400, damping: 28 }}
          style={{ position: "fixed", bottom: "80px", left: "50%", transform: "translateX(-50%)", zIndex: 80 }}
        >
          <div style={{
            display: "inline-flex", alignItems: "center", gap: "8px",
            borderRadius: "14px",
            border: `1px solid ${theme.accent}40`,
            background: theme.cardBg,
            padding: "12px 20px",
            boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
          }}>
            <CheckCircle style={{ width: "16px", height: "16px", color: theme.accent }} />
            <span style={{ fontSize: "13px", fontFamily: "sans-serif", fontWeight: 500, color: theme.text }}>
              {message}
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default Toast;
