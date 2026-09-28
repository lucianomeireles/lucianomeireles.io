import type { Locale } from "@/content/types";
import { isLocale } from "@/content";

const COOKIE_NAME = "locale";
const MAX_AGE = 60 * 60 * 24 * 365;

export function readLocaleCookie(): Locale | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${COOKIE_NAME}=([^;]*)`));
  if (!match) return null;
  const value = decodeURIComponent(match[1]);
  return isLocale(value) ? value : null;
}

export function writeLocaleCookie(locale: Locale): void {
  document.cookie = `${COOKIE_NAME}=${encodeURIComponent(locale)}; Path=/; SameSite=Lax; Max-Age=${MAX_AGE}`;
}
