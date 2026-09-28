"use client";

import { useCallback, useEffect, useState } from "react";
import { LocaleSwitcher } from "@/components/LocaleSwitcher";
import { UniverseCanvas } from "@/components/UniverseCanvas";
import { useLocale } from "@/hooks/useLocale";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useVerticalDrag } from "@/hooks/useVerticalDrag";
import {
  measureCrawl,
  useTextOffset,
  WHEEL_SCALE,
  type CrawlMetrics,
} from "@/hooks/useTextOffset";

export function OpeningPage() {
  const reducedMotion = useReducedMotion();
  const { locale, content, setLocale } = useLocale();
  const [skyReady, setSkyReady] = useState(false);
  const [metrics, setMetrics] = useState<CrawlMetrics>({
    maxOffset: 2400,
    speed: 30,
    fadeSpan: 500,
  });

  // O texto entra assim que o céu aparece e o idioma está resolvido.
  const crawlActive = skyReady && locale !== null && content !== null;

  const { offset, atEnd, applyDelta, crawlRef } = useTextOffset({
    enabled: crawlActive,
    maxOffset: metrics.maxOffset,
    speed: metrics.speed,
    reducedMotion,
  });

  useVerticalDrag({ enabled: crawlActive, onDrag: applyDelta });

  const onSkyFadeIn = useCallback(() => setSkyReady(true), []);

  useEffect(() => {
    if (!crawlActive || !crawlRef.current) return;
    const measure = () => setMetrics(measureCrawl(crawlRef.current));
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [crawlActive, crawlRef, content, locale]);

  useEffect(() => {
    if (!crawlActive) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      applyDelta(e.deltaY * WHEEL_SCALE);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown" || e.key === "PageDown") {
        e.preventDefault();
        applyDelta(120);
      }
      if (e.key === "ArrowUp" || e.key === "PageUp") {
        e.preventDefault();
        applyDelta(-120);
      }
    };
    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKey);
    };
  }, [applyDelta, crawlActive]);

  const showContacts = crawlActive && (atEnd || reducedMotion);

  // No trecho final o bloco esmaece até sumir. Voltar o texto o traz de volta.
  const fadeStart = metrics.maxOffset - metrics.fadeSpan;
  const crawlOpacity = reducedMotion
    ? 1
    : Math.max(0, Math.min(1, 1 - (offset - fadeStart) / metrics.fadeSpan));

  if (!content || !locale) {
    return (
      <main className="page">
        <UniverseCanvas reducedMotion={reducedMotion} onSkyFadeIn={onSkyFadeIn} />
      </main>
    );
  }

  return (
    <main className="page">
      <UniverseCanvas reducedMotion={reducedMotion} onSkyFadeIn={onSkyFadeIn} />

      <div className="content-layer">
        <LocaleSwitcher locale={locale} onChange={setLocale} />

        {crawlActive && (
          <div className="crawl-viewport" style={{ opacity: crawlOpacity }}>
            <div className="crawl-plane">
              <div className="crawl-inner" ref={crawlRef}>
                <p className="crawl-episode">{content.episodeLine}</p>
                <h1 className="crawl-title">{content.title}</h1>
                <div className="crawl-body">
                  {content.paragraphs.map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div
        className={`contacts ${showContacts ? "visible" : ""} ${reducedMotion ? "static" : ""}`}
        aria-hidden={!showContacts}
      >
        <a href={content.contactUrls.email}>{content.links.email}</a>
        <a href={content.contactUrls.linkedin} target="_blank" rel="noopener noreferrer">
          {content.links.linkedin}
        </a>
        <a href={content.contactUrls.github} target="_blank" rel="noopener noreferrer">
          {content.links.github}
        </a>
      </div>
    </main>
  );
}
