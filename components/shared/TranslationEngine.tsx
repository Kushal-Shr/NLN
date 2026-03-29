"use client";

import { useEffect, useRef } from "react";
import { useLanguage } from "@/lib/LanguageContext";
import { translateDOM } from "@/lib/domTranslator";

/**
 * Invisible component that mounts at the layout level.
 *
 * - On language change → scans the full DOM and batch-translates.
 * - MutationObserver → detects dynamic content (modals, toasts, lists)
 *   and re-translates new nodes automatically.
 * - Disconnects the observer while applying translations to prevent
 *   infinite feedback loops.
 */
export default function TranslationEngine() {
  const { language } = useLanguage();
  const langRef        = useRef(language);
  const observerRef    = useRef<MutationObserver | null>(null);
  const debounceRef    = useRef<ReturnType<typeof setTimeout> | null>(null);
  const translatingRef = useRef(false);

  langRef.current = language;

  useEffect(() => {
    const root = document.body;

    const run = async () => {
      if (translatingRef.current) return;
      translatingRef.current = true;

      observerRef.current?.disconnect();
      await translateDOM(root, langRef.current);
      translatingRef.current = false;

      if (langRef.current !== "en") attachObserver();
    };

    const attachObserver = () => {
      observerRef.current?.disconnect();

      const observer = new MutationObserver((mutations) => {
        if (translatingRef.current) return;

        let relevant = false;
        for (const m of mutations) {
          if (m.type === "childList" && m.addedNodes.length > 0) { relevant = true; break; }
          if (m.type === "characterData") { relevant = true; break; }
        }
        if (!relevant) return;

        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(run, 300);
      });

      observer.observe(root, {
        childList: true,
        characterData: true,
        subtree: true,
      });

      observerRef.current = observer;
    };

    const timer = setTimeout(run, 150);

    return () => {
      clearTimeout(timer);
      if (debounceRef.current) clearTimeout(debounceRef.current);
      observerRef.current?.disconnect();
    };
  }, [language]);

  return null;
}
