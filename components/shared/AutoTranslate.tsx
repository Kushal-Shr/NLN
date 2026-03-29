"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "@/lib/LanguageContext";
import { translateText } from "@/lib/translate";

interface AutoTranslateProps {
  children: string;
  as?: React.ElementType;
  className?: string;
  style?: React.CSSProperties;
}

export default function AutoTranslate({
  children,
  as: Tag = "span",
  className,
  style,
}: AutoTranslateProps) {
  const { language, isEnglish } = useLanguage();
  const [translated, setTranslated] = useState(children);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEnglish) {
      setTranslated(children);
      return;
    }

    let cancelled = false;
    setLoading(true);

    translateText(children, language).then((result) => {
      if (!cancelled) {
        setTranslated(result);
        setLoading(false);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [children, language, isEnglish]);

  return (
    <Tag className={className} style={style}>
      {loading ? "..." : translated}
    </Tag>
  );
}

export function useTranslation(text: string): { translated: string; loading: boolean } {
  const { language, isEnglish } = useLanguage();
  const [translated, setTranslated] = useState(text);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEnglish) {
      setTranslated(text);
      return;
    }

    let cancelled = false;
    setLoading(true);

    translateText(text, language).then((result) => {
      if (!cancelled) {
        setTranslated(result);
        setLoading(false);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [text, language, isEnglish]);

  return { translated, loading };
}
