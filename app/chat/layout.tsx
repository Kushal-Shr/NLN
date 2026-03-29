"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/shared/Navbar";
import { useTheme } from "@/lib/ThemeContext";
import { ChatProvider, useChatContext } from "@/components/features/chat/ChatContext";
import ChatSidebar from "@/components/features/chat/ChatSidebar";
import CallOverlay from "@/components/features/chat/CallOverlay";

function ChatShell({ children }: { children: React.ReactNode }) {
  const theme = useTheme();
  const pathname = usePathname();
  const { mobileOpen, closeMobile, callPeer, endCall, nukeSession } =
    useChatContext();

  const activeChatId = pathname.startsWith("/chat/")
    ? pathname.replace("/chat/", "").split("/")[0] || null
    : null;

  return (
    <div
      className="flex h-screen flex-col"
      style={{ backgroundColor: theme.bg, color: theme.text }}
    >
      <Navbar />

      <div className="flex min-h-0 flex-1 overflow-hidden">
        <ChatSidebar
          activeChatId={activeChatId}
          onNuke={nukeSession}
          mobileOpen={mobileOpen}
          onMobileClose={closeMobile}
        />

        <main className="flex min-w-0 flex-1 flex-col">{children}</main>

        <CallOverlay
          open={!!callPeer}
          peerName={callPeer ?? ""}
          onEnd={endCall}
        />
      </div>
    </div>
  );
}

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ChatProvider>
      <ChatShell>{children}</ChatShell>
    </ChatProvider>
  );
}
