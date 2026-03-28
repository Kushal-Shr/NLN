"use client";

import { motion } from "framer-motion";
import type { Message } from "./types";
import { SELF_ID } from "./types";

type MessageBubbleProps = {
  message: Message;
};

export default function MessageBubble({ message }: MessageBubbleProps) {
  const isSelf = message.senderId === SELF_ID;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: "spring" as const, stiffness: 400, damping: 28 }}
      className={`flex ${isSelf ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`max-w-[75%] rounded-2xl px-4 py-2.5 ${
          isSelf
            ? "bg-teal-700/60 text-stealth-text"
            : "bg-slate-700/50 text-stealth-text"
        }`}
      >
        <p className="text-sm leading-relaxed">{message.content}</p>
        <p
          className={`mt-1 text-[10px] ${
            isSelf ? "text-teal-300/50 text-right" : "text-slate-400/60"
          }`}
        >
          {message.timestamp}
        </p>
      </div>
    </motion.div>
  );
}
