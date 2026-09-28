"use client";

import { useEffect, useRef, useState } from "react";
import { UniverseRenderer } from "@/universe/renderer";
import type { WorkerInMessage, WorkerOutMessage } from "@/universe/messages";

type Send = (msg: WorkerInMessage) => void;

type Props = {
  reducedMotion: boolean;
  onSkyFadeIn: () => void;
};

export function UniverseCanvas({ reducedMotion, onSkyFadeIn }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rendererRef = useRef<UniverseRenderer | null>(null);
  const workerRef = useRef<Worker | null>(null);
  const sendRef = useRef<Send>(() => {});
  const [useFallback, setUseFallback] = useState(false);
  const [fadeVisible, setFadeVisible] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const reduced = reducedMotion;
    const dpr = window.devicePixelRatio || 1;
    const w = window.innerWidth;
    const h = window.innerHeight;

    sendRef.current = (msg: WorkerInMessage) => {
      workerRef.current?.postMessage(msg);
      if (workerRef.current) return;
      const r = rendererRef.current;
      if (!r) return;
      applyMainThread(msg, r);
    };

    const onResize = () => {
      sendRef.current({
        type: "resize",
        width: window.innerWidth,
        height: window.innerHeight,
        dpr: window.devicePixelRatio || 1,
      });
    };

    const supportsOffscreen =
      typeof OffscreenCanvas !== "undefined" &&
      typeof canvas.transferControlToOffscreen === "function";

    const startMain = () => {
      const gl = canvas.getContext("webgl2", {
        alpha: false,
        antialias: false,
        depth: false,
        stencil: false,
        powerPreference: "high-performance",
      });
      if (!gl) {
        setUseFallback(true);
        setFadeVisible(true);
        onSkyFadeIn();
        return;
      }
      const r = new UniverseRenderer(canvas, gl);
      r.setReducedMotion(reduced);
      r.resize(w, h, dpr);
      rendererRef.current = r;
      r.start(() => {
        setFadeVisible(true);
        onSkyFadeIn();
      });
    };

    if (supportsOffscreen) {
      try {
        const offscreen = canvas.transferControlToOffscreen();
        const worker = new Worker(new URL("../universe/worker.ts", import.meta.url));
        workerRef.current = worker;
        worker.onmessage = (ev: MessageEvent<WorkerOutMessage>) => {
          if (ev.data.type === "fadeIn") {
            setFadeVisible(true);
            onSkyFadeIn();
          }
          if (ev.data.type === "contextLost") {
            setUseFallback(true);
          }
        };
        worker.postMessage(
          {
            type: "init",
            canvas: offscreen,
            width: w,
            height: h,
            dpr,
            reducedMotion: reduced,
          } satisfies WorkerInMessage,
          [offscreen],
        );
      } catch {
        startMain();
      }
    } else {
      startMain();
    }

    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      workerRef.current?.terminate();
      workerRef.current = null;
      rendererRef.current = null;
    };
  }, [onSkyFadeIn, reducedMotion]);

  useEffect(() => {
    sendRef.current({ type: "reducedMotion", enabled: reducedMotion });
  }, [reducedMotion]);

  useEffect(() => {
    const onVis = () => sendRef.current({ type: "visibility", hidden: document.hidden });
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  return (
    <div className="universe-layer" aria-hidden="true">
      <canvas ref={canvasRef} className={fadeVisible ? "visible" : undefined} />
      {useFallback && (
        <div className={`universe-fallback ${fadeVisible ? "visible" : ""}`} />
      )}
    </div>
  );
}

function applyMainThread(msg: WorkerInMessage, r: UniverseRenderer): void {
  switch (msg.type) {
    case "resize":
      r.resize(msg.width, msg.height, msg.dpr);
      break;
    case "reducedMotion":
      r.setReducedMotion(msg.enabled);
      break;
    case "visibility":
      r.setVisibility(msg.hidden);
      break;
  }
}
