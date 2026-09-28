"use client";

import { useCallback, useEffect, useState } from "react";
import { dictionaries, resolveLocaleFromBrowser } from "@/content";
import type { ContentDictionary, Locale } from "@/content/types";
import { readLocaleCookie, writeLocaleCookie } from "@/lib/localeCookie";

export function useLocale(): {
  locale: Locale | null;
  content: ContentDictionary | null;
  setLocale: (locale: Locale) => void;
} {
  const [locale, setLocaleState] = useState<Locale | null>(null);

  useEffect(() => {
    const fromCookie = readLocaleCookie();
    const resolved =
      fromCookie ??
      resolveLocaleFromBrowser(
        typeof navigator !== "undefined" ? navigator.languages : ["en"],
      );
    setLocaleState(resolved);
    document.documentElement.lang = resolved;
  }, []);

  const setLocale = useCallback((next: Locale) => {
    writeLocaleCookie(next);
    setLocaleState(next);
    document.documentElement.lang = next;
  }, []);

  const content = locale ? dictionaries[locale] : null;

  return { locale, content, setLocale };
}
