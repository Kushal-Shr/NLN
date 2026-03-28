"use client";

import { MessageSquare } from "lucide-react";

export default function ChatIndexPage() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-stealth-card">
        <MessageSquare className="h-7 w-7 text-stealth-muted" />
      </div>
      <h2 className="text-lg font-semibold text-stealth-text">
        Your Sanctuary Inbox
      </h2>
      <p className="max-w-sm text-center text-sm text-stealth-muted">
        Select a guide or peer from the sidebar to begin a private,
        encrypted conversation.
      </p>
    </div>
  );
}
