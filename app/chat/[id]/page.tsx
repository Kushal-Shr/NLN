"use client";

import { useCallback, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import ChatHeader from "@/components/features/chat/ChatHeader";
import MessageList from "@/components/features/chat/MessageList";
import ChatInput from "@/components/features/chat/ChatInput";
import { useChatContext } from "@/components/features/chat/ChatContext";
import { MENTOR, PEERS, SEED_MESSAGES, SELF_ID } from "@/components/features/chat/types";
import type { Message } from "@/components/features/chat/types";

export default function ChatConversationPage() {
  const { id } = useParams<{ id: string }>();
  const { toggleMobile, startCall } = useChatContext();

  const peer = useMemo(() => {
    if (id === MENTOR.id) return MENTOR;
    return PEERS.find((p) => p.id === id) ?? {
      id,
      name: "Unknown",
      lastMessage: "",
      timestamp: "",
      online: false,
    };
  }, [id]);

  const [messages, setMessages] = useState<Message[]>(
    () => SEED_MESSAGES[id] ?? []
  );

  const handleSend = useCallback((text: string) => {
    const msg: Message = {
      id: `self-${Date.now()}`,
      senderId: SELF_ID,
      content: text,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    setMessages((prev) => [...prev, msg]);
  }, []);

  return (
    <>
      <ChatHeader
        peer={peer}
        onVoiceCall={() => startCall(peer.name)}
        onVideoCall={() => startCall(peer.name)}
        onMobileMenuToggle={toggleMobile}
      />
      <MessageList messages={messages} />
      <ChatInput onSend={handleSend} />
    </>
  );
}
