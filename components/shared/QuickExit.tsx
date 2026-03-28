"use client";

import { DoorOpen } from "lucide-react";
import { useCallback, useEffect } from "react";

const QUICK_EXIT_URLS = ["https://www.google.com", "https://www.bbc.com"];

function redirectToSafeSite() {
  const randomIndex = Math.floor(Math.random() * QUICK_EXIT_URLS.length);
  window.location.assign(QUICK_EXIT_URLS[randomIndex]);
}

export default function QuickExit() {
  const handleQuickExit = useCallback(() => {
    redirectToSafeSite();
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        redirectToSafeSite();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <button
      aria-label="Quick Exit"
      className="fixed bottom-5 right-5 z-50 inline-flex items-center gap-2 rounded-full border border-red-300/40 bg-red-600 px-4 py-3 text-sm font-semibold text-white shadow-xl transition hover:bg-red-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-200 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
      onClick={handleQuickExit}
      type="button"
    >
      <DoorOpen className="h-4 w-4" />
      Quick Exit
    </button>
  );
}
