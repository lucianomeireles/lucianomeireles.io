"use client";

import type { Locale } from "@/content/types";

const LOCALES: { id: Locale; label: string }[] = [
  { id: "en", label: "EN" },
  { id: "es", label: "ES" },
  { id: "pt", label: "PT" },
];

type Props = {
  locale: Locale;
  onChange: (locale: Locale) => void;
};

export function LocaleSwitcher({ locale, onChange }: Props) {
  return (
    <nav className="locale-switch" aria-label="Language">
      {LOCALES.map(({ id, label }) => (
        <button
          key={id}
          type="button"
          aria-current={locale === id ? "true" : undefined}
          onClick={() => onChange(id)}
        >
          {label}
        </button>
      ))}
    </nav>
  );
}
