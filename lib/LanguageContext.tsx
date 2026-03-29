"use client";

import { createContext, useContext, useCallback, useEffect, useState } from "react";

export const SUPPORTED_LANGUAGES = [
  { code: "en", label: "English" },
  { code: "es", label: "Spanish" },
  { code: "fr", label: "French" },
  { code: "ne", label: "Nepali" },
] as const;

export type LanguageCode = (typeof SUPPORTED_LANGUAGES)[number]["code"];

interface LanguageContextValue {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  isEnglish: boolean;
}

const LanguageContext = createContext<LanguageContextValue>({
  language: "en",
  setLanguage: () => {},
  isEnglish: true,
});

const STORAGE_KEY = "sanctuary_language";

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLangState] = useState<LanguageCode>("en");

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && SUPPORTED_LANGUAGES.some((l) => l.code === saved)) {
      setLangState(saved as LanguageCode);
    }
  }, []);

  const setLanguage = useCallback((lang: LanguageCode) => {
    setLangState(lang);
    localStorage.setItem(STORAGE_KEY, lang);
  }, []);

  return (
    <LanguageContext.Provider
      value={{ language, setLanguage, isEnglish: language === "en" }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
