import { en } from "./en";
import { es } from "./es";
import { pt } from "./pt";
import type { ContentDictionary, Locale } from "./types";

export const dictionaries: Record<Locale, ContentDictionary> = { en, es, pt };

export function isLocale(value: string): value is Locale {
  return value === "en" || value === "es" || value === "pt";
}

export function resolveLocaleFromBrowser(languages: readonly string[]): Locale {
  for (const lang of languages) {
    const lower = lang.toLowerCase();
    if (lower.startsWith("pt")) return "pt";
    if (lower.startsWith("es")) return "es";
    if (lower.startsWith("en")) return "en";
  }
  return "en";
}
