"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const WHEEL_SCALE = 0.4;
const MIN_OFFSET = 0;

type Options = {
  enabled: boolean;
  maxOffset: number;
  /** Avanço automático, em px do plano por segundo. */
  speed: number;
  reducedMotion: boolean;
};

export function useTextOffset({ enabled, maxOffset, speed, reducedMotion }: Options): {
  offset: number;
  atEnd: boolean;
  applyDelta: (delta: number) => void;
  crawlRef: React.RefObject<HTMLDivElement | null>;
} {
  const [offset, setOffset] = useState(0);
  const offsetRef = useRef(0);
  const crawlRef = useRef<HTMLDivElement | null>(null);
  const maxRef = useRef(maxOffset);
  const speedRef = useRef(speed);

  maxRef.current = maxOffset;
  speedRef.current = speed;

  const clamp = useCallback((v: number) => {
    const max = maxRef.current;
    return Math.max(MIN_OFFSET, Math.min(max, v));
  }, []);

  const applyDelta = useCallback(
    (delta: number) => {
      if (!enabled) return;
      const next = clamp(offsetRef.current + delta);
      offsetRef.current = next;
      setOffset(next);
    },
    [clamp, enabled],
  );

  useEffect(() => {
    if (!enabled) return;
    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      if (document.hidden) {
        last = now;
        return;
      }
      const dt = (now - last) / 1000;
      last = now;
      if (!reducedMotion && offsetRef.current < maxRef.current) {
        const next = clamp(offsetRef.current + speedRef.current * dt);
        offsetRef.current = next;
        setOffset(next);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [clamp, enabled, reducedMotion]);

  useEffect(() => {
    if (!crawlRef.current) return;
    crawlRef.current.style.transform = `translateY(${-offset}px)`;
  }, [offset]);

  useEffect(() => {
    if (reducedMotion && enabled) {
      // Sem animação, o começo do texto já fica na zona legível.
      const start = clamp(window.innerHeight * 0.9);
      offsetRef.current = start;
      setOffset(start);
    }
  }, [clamp, enabled, reducedMotion]);

  const atEnd = offset >= maxOffset - 2;

  return { offset, atEnd, applyDelta, crawlRef };
}

export type CrawlMetrics = {
  maxOffset: number;
  speed: number;
  /** Trecho final do percurso em que o bloco inteiro esmaece até sumir. */
  fadeSpan: number;
};

/**
 * Quanto o texto precisa percorrer ao longo do plano: a própria altura
 * mais o trecho até a última linha se afastar rumo ao ponto de fuga. No
 * final desse trecho o bloco esmaece, então o texto some de fato antes
 * dos contatos entrarem. A velocidade acompanha a altura de linha, para
 * o ritmo de leitura ser o mesmo em qualquer largura de tela.
 */
export function measureCrawl(innerEl: HTMLElement | null): CrawlMetrics {
  const h = window.innerHeight;
  if (!innerEl) return { maxOffset: 2800, speed: 30, fadeSpan: h * 0.7 };
  const travel = innerEl.offsetHeight + h * 2.4;
  const para = innerEl.querySelector<HTMLElement>(".crawl-body p");
  const lineHeight = para ? parseFloat(getComputedStyle(para).lineHeight) : 40;
  // ~3,5 s por linha, perto do ritmo do filme.
  const speed = Math.max(8, (Number.isFinite(lineHeight) ? lineHeight : 40) * 0.28);
  return { maxOffset: Math.max(1400, travel), speed, fadeSpan: h * 0.7 };
}

export { WHEEL_SCALE };
