"use client";

import { MessageSquare } from "lucide-react";
import { useTheme } from "@/lib/ThemeContext";

export default function ChatIndexPage() {
  const theme = useTheme();

  return (
    <div
      className="flex flex-1 flex-col items-center justify-center gap-4 rounded-2xl px-6 m-4"
      style={{
        backgroundColor: theme.cardBg,
        border: `1px solid ${theme.cardBorder}`,
        boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
      }}
    >
      <div
        className="flex h-16 w-16 items-center justify-center rounded-2xl"
        style={{ backgroundColor: theme.surface }}
      >
        <MessageSquare className="h-7 w-7" style={{ color: theme.textMuted }} />
      </div>
      <h2
        className="text-lg font-semibold"
        style={{ color: theme.text, fontFamily: "sans-serif" }}
      >
        Your Sanctuary Inbox
      </h2>
      <p
        className="max-w-sm text-center text-sm"
        style={{ color: theme.textMuted, fontFamily: "sans-serif" }}
      >
        Select a guide or peer from the sidebar to begin a private,
        encrypted conversation.
      </p>
    </div>
  );
}
