"use client";

import { useState, useCallback } from "react";
import { Paperclip, Send } from "lucide-react";

type ChatInputProps = {
  onSend: (text: string) => void;
};

export default function ChatInput({ onSend }: ChatInputProps) {
  const [text, setText] = useState("");

  const handleSend = useCallback(() => {
    const trimmed = text.trim();
    if (!trimmed) return;
    onSend(trimmed);
    setText("");
  }, [text, onSend]);

  return (
    <div className="border-t border-white/10 px-4 py-3">
      <div className="mx-auto flex max-w-2xl items-end gap-2">
        <button
          type="button"
          className="shrink-0 rounded-lg p-2 text-stealth-muted transition hover:bg-white/5 hover:text-stealth-text"
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
          className="max-h-32 min-h-[40px] flex-1 resize-none rounded-xl border border-white/10 bg-stealth-card px-4 py-2.5 text-sm text-stealth-text placeholder:text-stealth-muted/50 focus:border-stealth-accent/40 focus:outline-none"
        />

        <button
          type="button"
          onClick={handleSend}
          disabled={!text.trim()}
          className="shrink-0 rounded-xl bg-stealth-accent p-2.5 text-white transition hover:opacity-90 disabled:opacity-30"
          aria-label="Send message"
        >
          <Send className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
