"use client";

import { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  BookOpen,
  Loader2,
  Hash,
} from "lucide-react";
import Navbar from "@/components/shared/Navbar";
import ResilienceCard from "@/components/features/hub/ResilienceCard";
import ReadMoreModal from "@/components/features/hub/ReadMoreModal";
import ThemeDoodles from "@/components/shared/ThemesDoddles";
import { useTheme } from "@/lib/ThemeContext";
import { db, auth } from "@/lib/db";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import type { LibraryResult, DiscoveryCard, PersonaTone } from "@/lib/types";

// ── Persona-based discovery cards ───────────

const ALL_DISCOVERY_CARDS: DiscoveryCard[] = [
  { id: "mindfulness", title: "The Practice of Stillness", teaser: "Quiet the noise and discover the power hidden in a single breath.", query: "mindfulness", image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600&q=80", persona: "spiritual" },
  { id: "gratitude", title: "Counting What Remains", teaser: "Even on the heaviest days, gratitude can shift the landscape of your inner world.", query: "gratitude", image: "https://images.unsplash.com/photo-1474540412665-1cdae210ae6b?w=600&q=80", persona: "spiritual" },
  { id: "focus", title: "Sharpening the Inner Lens", teaser: "Your attention is currency — learn where to invest it for the highest return.", query: "focus", image: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=600&q=80", persona: "practical" },
  { id: "time-mgmt", title: "Architecting Your Hours", teaser: "Structure is not a cage — it is the scaffold that holds your ambitions upright.", query: "time management", image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600&q=80", persona: "practical" },
  { id: "burnout", title: "Navigating Burnout", teaser: "When the flame flickers, it is not dying — it is asking to be tended differently.", query: "burnout recovery", image: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=600&q=80", persona: "nature" },
  { id: "seasons", title: "Trusting the Seasons", teaser: "Every storm passes. Every root deepens. Nature has already written your resilience story.", query: "emotional resilience", image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&q=80", persona: "nature" },
  { id: "connection", title: "Rebuilding the Circle", teaser: "One genuine connection can shift the entire landscape of your inner world.", query: "connection", image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&q=80", persona: "community" },
  { id: "belonging", title: "The Fireside Within", teaser: "Belonging is not found — it is built, one honest conversation at a time.", query: "sense of belonging", image: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=600&q=80", persona: "community" },
  { id: "rest", title: "The Art of Sacred Rest", teaser: "Rest is not laziness — it is the root system that feeds every branch of your life.", query: "rest", image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80", persona: "all" },
  { id: "patience", title: "The Strength of Patience", teaser: "Patience is not passive waiting — it is the quiet confidence that the seed will sprout.", query: "patience and resilience", image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&q=80", persona: "all" },
  { id: "self-worth", title: "Reclaiming Your Worth", teaser: "You are not what the world says you are. You are what you choose to become.", query: "self worth and confidence", image: "https://images.unsplash.com/photo-1504805572947-34fad45aed93?w=600&q=80", persona: "all" },
  { id: "grounding", title: "Roots in the Storm", teaser: "When everything shakes, go lower. Touch the ground. Remember what holds you.", query: "grounding techniques", image: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=600&q=80", persona: "all" },
];

const TRENDING = [
  { label: "Focus", query: "focus" },
  { label: "Rest", query: "rest" },
  { label: "Connection", query: "connection" },
  { label: "Grounding", query: "grounding techniques" },
  { label: "Family Pressure", query: "family pressure" },
  { label: "Inner Peace", query: "inner peace" },
  { label: "Burnout", query: "burnout recovery" },
  { label: "Self-Worth", query: "self worth and confidence" },
];

function getPersona(): PersonaTone | null {
  if (typeof window === "undefined") return null;
  const stored = localStorage.getItem("sanctuary_comfort");
  if (stored && ["spiritual", "nature", "practical", "community"].includes(stored)) {
    return stored as PersonaTone;
  }
  return null;
}

function getDiscoveryFeed(persona: PersonaTone | null): DiscoveryCard[] {
  if (!persona) return ALL_DISCOVERY_CARDS;
  return ALL_DISCOVERY_CARDS.filter(
    (c) => c.persona === persona || c.persona === "all"
  );
}

export default function HubPage() {
  const theme = useTheme();

  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  const [persona, setPersona] = useState<PersonaTone | null>(null);
  const [discoveryCards, setDiscoveryCards] = useState<DiscoveryCard[]>(ALL_DISCOVERY_CARDS);

  const [searchResults, setSearchResults] = useState<Map<string, LibraryResult>>(new Map());
  const [searchCards, setSearchCards] = useState<DiscoveryCard[]>([]);
  const [isSearchMode, setIsSearchMode] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalResult, setModalResult] = useState<LibraryResult | null>(null);
  const [activeQuery, setActiveQuery] = useState("");
  const [bookmarked, setBookmarked] = useState(false);
  const [bookmarking, setBookmarking] = useState(false);

  useEffect(() => {
    setMounted(true);
    const p = getPersona();
    setPersona(p);
    setDiscoveryCards(getDiscoveryFeed(p));
  }, []);

  const searchLibrary = useCallback(
    async (searchQuery?: string) => {
      const q = (searchQuery ?? query).trim();
      if (!q) {
        setError("Type a topic to search the library.");
        return;
      }

      setError(null);
      setLoading(true);
      setIsSearchMode(true);
      setBookmarked(false);

      try {
        const res = await fetch("/api/ai/library", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query: q }),
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Something went wrong.");
        }

        const data = await res.json();
        const result = data.data as LibraryResult;

        const card: DiscoveryCard = {
          id: `search-${Date.now()}`,
          title: result.title,
          teaser: result.description.split("\n")[0]?.slice(0, 140) || q,
          query: q,
          image: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=600&q=80",
          persona: "all",
        };

        setSearchCards([card]);
        setSearchResults(new Map([[card.id, result]]));
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to search the library."
        );
      } finally {
        setLoading(false);
      }
    },
    [query]
  );

  const handleCardClick = useCallback(
    async (card: DiscoveryCard) => {
      const existing = searchResults.get(card.id);
      if (existing) {
        setModalResult(existing);
        setActiveQuery(card.query);
        setBookmarked(false);
        setModalOpen(true);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const res = await fetch("/api/ai/library", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query: card.query }),
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Something went wrong.");
        }

        const data = await res.json();
        const result = data.data as LibraryResult;

        setSearchResults((prev) => new Map(prev).set(card.id, result));
        setModalResult(result);
        setActiveQuery(card.query);
        setBookmarked(false);
        setModalOpen(true);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load this entry."
        );
      } finally {
        setLoading(false);
      }
    },
    [searchResults]
  );

  const handleBookmark = useCallback(async () => {
    if (!modalResult || bookmarked || bookmarking) return;
    setBookmarking(true);

    try {
      const user = auth.currentUser;
      if (!user) {
        setBookmarking(false);
        return;
      }

      await addDoc(collection(db, "users", user.uid, "saved_resources"), {
        query: activeQuery,
        result: modalResult,
        savedAt: serverTimestamp(),
      });

      setBookmarked(true);
    } catch (err) {
      console.error("Bookmark failed:", err);
    } finally {
      setBookmarking(false);
    }
  }, [modalResult, activeQuery, bookmarked, bookmarking]);

  const handleTrending = useCallback(
    (trendQuery: string) => {
      setQuery(trendQuery);
      searchLibrary(trendQuery);
    },
    [searchLibrary]
  );

  const clearSearch = useCallback(() => {
    setIsSearchMode(false);
    setSearchCards([]);
    setQuery("");
    setError(null);
  }, []);

  const displayCards = isSearchMode ? searchCards : discoveryCards;

  if (!mounted) return null;

  return (
    <div
      className="relative min-h-screen"
      style={{ backgroundColor: theme.bg, color: theme.text, fontFamily: "'Georgia', serif" }}
    >
      <Navbar />
      <ThemeDoodles />

      <main
        className="relative z-10 mx-auto w-full max-w-5xl space-y-8 px-6 pb-10 pt-10"
      >
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-1"
        >
          <div className="flex items-center gap-2.5">
            <BookOpen className="h-5 w-5" style={{ color: theme.accent }} />
            <p
              className="text-[11px] font-semibold uppercase tracking-[0.2em]"
              style={{ color: theme.textMuted, fontFamily: "sans-serif" }}
            >
              Wisdom Library
            </p>
          </div>
          <h1
            className="text-[26px] font-normal"
            style={{ color: theme.text, lineHeight: 1.35 }}
          >
            Resilience Gallery
          </h1>
          <p
            className="max-w-xl text-sm"
            style={{ color: theme.textMuted, fontFamily: "sans-serif", lineHeight: 1.6 }}
          >
            {persona
              ? `Curated for your ${persona} path — explore topics that resonate with your journey.`
              : "Explore research-backed wisdom, practical guidance, and trusted sources — all in one place."}
          </p>
        </motion.header>

        {/* Search bar */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex items-center gap-3"
        >
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2" style={{ color: theme.textMuted }} />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") searchLibrary();
              }}
              placeholder="Search for focus, rest, grounding, connection..."
              className="w-full rounded-xl py-3.5 pl-11 pr-4 text-sm transition focus:outline-none focus:ring-2"
              style={{
                backgroundColor: theme.cardBg,
                border: `1px solid ${theme.cardBorder}`,
                color: theme.text,
                fontFamily: "sans-serif",
                boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
              }}
            />
          </div>
          <button
            type="button"
            onClick={() => searchLibrary()}
            disabled={loading}
            className="shrink-0 rounded-xl px-6 py-3.5 text-sm font-medium transition disabled:opacity-50"
            style={{
              backgroundColor: theme.btnBg,
              color: theme.btnColor,
              fontFamily: "sans-serif",
            }}
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Search"
            )}
          </button>
        </motion.div>

        {/* Trending + back to discovery */}
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap items-center gap-2"
        >
          {isSearchMode && (
            <button
              type="button"
              onClick={clearSearch}
              className="rounded-full px-3.5 py-1.5 text-xs font-medium transition"
              style={{
                border: `1px solid ${theme.accentSoft}`,
                backgroundColor: `${theme.accent}10`,
                color: theme.accent,
                fontFamily: "sans-serif",
              }}
            >
              &larr; Back to Discovery
            </button>
          )}
          {!isSearchMode && (
            <>
              <p
                className="mr-1 text-[11px] font-semibold uppercase tracking-widest"
                style={{ color: theme.textMuted, opacity: 0.6, fontFamily: "sans-serif" }}
              >
                Trending
              </p>
              {TRENDING.map((t) => (
                <button
                  key={t.query}
                  type="button"
                  onClick={() => handleTrending(t.query)}
                  className="inline-flex items-center gap-1 rounded-full px-3.5 py-1.5 text-xs font-medium transition"
                  style={{
                    border: `1px solid ${theme.cardBorder}`,
                    color: theme.textMuted,
                    fontFamily: "sans-serif",
                  }}
                >
                  <Hash className="h-3 w-3" />
                  {t.label}
                </button>
              ))}
            </>
          )}
        </motion.div>

        {/* Error */}
        {error && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-sm"
            style={{ color: "#c0392b", fontFamily: "sans-serif" }}
          >
            {error}
          </motion.p>
        )}

        {/* Loading */}
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center justify-center gap-3 rounded-xl py-16"
            style={{
              backgroundColor: `${theme.accent}08`,
              border: `1px solid ${theme.cardBorder}`,
            }}
          >
            <Loader2 className="h-5 w-5 animate-spin" style={{ color: theme.accent }} />
            <span className="text-sm" style={{ color: theme.textMuted, fontFamily: "sans-serif" }}>
              The Library is assembling your wisdom...
            </span>
          </motion.div>
        )}

        {/* Masonry Gallery */}
        {!loading && displayCards.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15 }}
            className="columns-1 gap-4 md:columns-2 lg:columns-3"
          >
            <AnimatePresence mode="popLayout">
              {displayCards.map((card, i) => (
                <ResilienceCard
                  key={card.id}
                  card={card}
                  result={searchResults.get(card.id)}
                  index={i}
                  onCardClick={handleCardClick}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Empty search state */}
        {!loading && isSearchMode && searchCards.length === 0 && !error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center gap-2 py-16 text-center"
          >
            <Search className="h-8 w-8" style={{ color: `${theme.textMuted}50` }} />
            <p className="text-sm" style={{ color: theme.textMuted, fontFamily: "sans-serif" }}>
              No results yet — try searching for a topic above.
            </p>
          </motion.div>
        )}
      </main>

      {/* Read More Modal */}
      <ReadMoreModal
        open={modalOpen}
        result={modalResult}
        bookmarked={bookmarked}
        bookmarking={bookmarking}
        onClose={() => setModalOpen(false)}
        onBookmark={handleBookmark}
      />
    </div>
  );
}
