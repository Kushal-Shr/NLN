"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import type { DiscoveryCard, LibraryResult } from "@/lib/types";

interface ResilienceCardProps {
  card: DiscoveryCard;
  result?: LibraryResult;
  index: number;
  onCardClick: (card: DiscoveryCard) => void;
}

const HEIGHT_CLASSES = [
  "h-60",
  "h-72",
  "h-80",
  "h-64",
  "h-56",
  "h-72",
];

export default function ResilienceCard({
  card,
  result,
  index,
  onCardClick,
}: ResilienceCardProps) {
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
      className="group relative mb-4 w-full overflow-hidden rounded-2xl border border-white/10 bg-slate-900/50 text-left break-inside-avoid transition focus:outline-none focus-visible:ring-2 focus-visible:ring-stealth-accent/50"
    >
      <div className={`relative w-full overflow-hidden ${heightClass}`}>
        <Image
          src={card.image}
          alt={card.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
      </div>

      <div className="absolute inset-x-0 bottom-0 p-5">
        <h3 className="text-base font-semibold leading-snug text-white">
          {result?.title ?? card.title}
        </h3>
        <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-slate-300/80">
          {result?.description?.split("\n")[0]?.slice(0, 120) ?? card.teaser}
          {(result?.description?.split("\n")[0]?.length ?? card.teaser.length) > 120 && "..."}
        </p>
      </div>
    </motion.button>
  );
}
