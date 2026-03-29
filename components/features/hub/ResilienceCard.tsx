"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useTheme } from "@/lib/ThemeContext";
import type { DiscoveryCard, LibraryResult } from "@/lib/types";

interface ResilienceCardProps {
  card: DiscoveryCard;
  result?: LibraryResult;
  index: number;
  onCardClick: (card: DiscoveryCard) => void;
}

const HEIGHT_CLASSES = [
  "h-36",
  "h-44",
  "h-48",
  "h-40",
  "h-36",
  "h-44",
];

export default function ResilienceCard({
  card,
  result,
  index,
  onCardClick,
}: ResilienceCardProps) {
  const theme = useTheme();
  const heightClass = HEIGHT_CLASSES[index % HEIGHT_CLASSES.length];

  return (
    <motion.button
      type="button"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ delay: index * 0.06, duration: 0.4 }}
      whileHover={{ y: -4 }}
      onClick={() => onCardClick(card)}
      className="group mb-4 w-full overflow-hidden rounded-2xl text-left break-inside-avoid transition focus:outline-none"
      style={{
        backgroundColor: theme.cardBg,
        border: `1px solid ${theme.cardBorder}`,
        boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
      }}
    >
      <div className={`relative w-full overflow-hidden ${heightClass}`}>
        <Image
          src={card.image}
          alt={card.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      <div className="p-4">
        <h3
          className="text-sm font-semibold leading-snug"
          style={{ color: theme.text }}
        >
          {result?.title ?? card.title}
        </h3>
        <p
          className="mt-1.5 line-clamp-2 text-xs leading-relaxed"
          style={{ color: theme.textMuted }}
        >
          {result?.description?.split("\n")[0]?.slice(0, 120) ?? card.teaser}
          {(result?.description?.split("\n")[0]?.length ?? card.teaser.length) > 120 && "..."}
        </p>
      </div>
    </motion.button>
  );
}
