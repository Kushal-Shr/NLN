// Shared cache helpers used by both the DOM translator and the
// AutoTranslate component, ensuring a single source of truth.

const CACHE_KEY = "sanctuary_translations";

export function getTranslationCache(): Record<string, string> {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(CACHE_KEY) || "{}");
  } catch {
    return {};
  }
}

function cacheKey(text: string, lang: string): string {
  return `${lang}::${text}`;
}

/**
 * Look up a single string in the translation cache.
 * Falls back to the API only if the DOM engine hasn't cached it yet.
 */
export async function translateText(
  text: string,
  targetLanguage: string
): Promise<string> {
  if (targetLanguage === "en") return text;
  if (!text.trim()) return text;

  const key = cacheKey(text.trim(), targetLanguage);
  const cache = getTranslationCache();
  if (cache[key]) return cache[key];

  try {
    const res = await fetch("/api/ai/translate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, targetLanguage }),
    });
    if (!res.ok) return text;

    const data = await res.json();
    const translated = data.translated || text;

    const updated = getTranslationCache();
    updated[cacheKey(text.trim(), targetLanguage)] = translated;
    try { localStorage.setItem(CACHE_KEY, JSON.stringify(updated)); } catch { /* skip */ }

    return translated;
  } catch {
    return text;
  }
}
