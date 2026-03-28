"use client";

import { createContext, useCallback, useContext, useState } from "react";

type ChatContextValue = {
  mobileOpen: boolean;
  toggleMobile: () => void;
  closeMobile: () => void;
  callPeer: string | null;
  startCall: (name: string) => void;
  endCall: () => void;
  nukeSession: () => void;
};

const ChatContext = createContext<ChatContextValue | null>(null);

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [callPeer, setCallPeer] = useState<string | null>(null);

  const toggleMobile = useCallback(() => setMobileOpen((v) => !v), []);
  const closeMobile = useCallback(() => setMobileOpen(false), []);
  const startCall = useCallback((name: string) => setCallPeer(name), []);
  const endCall = useCallback(() => setCallPeer(null), []);

  const nukeSession = useCallback(() => {
    if (typeof window !== "undefined") {
      sessionStorage.clear();
      localStorage.removeItem("nln-chat");
      window.location.href = "/chat";
    }
  }, []);

  return (
    <ChatContext.Provider
      value={{
        mobileOpen,
        toggleMobile,
        closeMobile,
        callPeer,
        startCall,
        endCall,
        nukeSession,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChatContext() {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error("useChatContext must be used within ChatProvider");
  return ctx;
}
