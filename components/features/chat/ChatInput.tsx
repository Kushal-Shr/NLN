"use client";

import { useState, useCallback } from "react";
import { Paperclip, Send } from "lucide-react";
import { useTheme } from "@/lib/ThemeContext";

type ChatInputProps = {
  onSend: (text: string) => void;
};

export default function ChatInput({ onSend }: ChatInputProps) {
  const theme = useTheme();
  const [text, setText] = useState("");

  const handleSend = useCallback(() => {
    const trimmed = text.trim();
    if (!trimmed) return;
    onSend(trimmed);
    setText("");
  }, [text, onSend]);

  return (
    <div className="px-4 py-3" style={{ borderTop: `1px solid ${theme.cardBorder}` }}>
      <div className="mx-auto flex max-w-2xl items-end gap-2">
        <button
          type="button"
          className="shrink-0 rounded-lg p-2 transition"
          style={{ color: theme.textMuted }}
          aria-label="Attach file"
        >
          <Paperclip className="h-4 w-4" />
        </button>

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          placeholder="Write something..."
          rows={1}
          className="max-h-32 min-h-[40px] flex-1 resize-none rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2"
          style={{
            backgroundColor: theme.cardBg,
            border: `1px solid ${theme.cardBorder}`,
            color: theme.text,
            fontFamily: "sans-serif",
            boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
          }}
        />

        <button
          type="button"
          onClick={handleSend}
          disabled={!text.trim()}
          className="shrink-0 rounded-xl p-2.5 transition disabled:opacity-30"
          style={{
            backgroundColor: theme.btnBg,
            color: theme.btnColor,
          }}
          aria-label="Send message"
        >
          <Send className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
