"use client";

import { useEffect, useRef } from "react";

type Options = {
  enabled: boolean;
  onDrag: (deltaY: number) => void;
};

/** Arraste vertical do dedo desloca o texto. Um toque curto não desloca. */
export function useVerticalDrag({ enabled, onDrag }: Options): void {
  const dragRef = useRef<{ active: boolean; lastY: number }>({ active: false, lastY: 0 });

  useEffect(() => {
    if (!enabled) return;

    const onPointerDown = (e: PointerEvent) => {
      if (e.pointerType !== "touch") return;
      dragRef.current = { active: true, lastY: e.clientY };
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!dragRef.current.active || e.pointerType !== "touch") return;
      const dy = e.clientY - dragRef.current.lastY;
      dragRef.current.lastY = e.clientY;
      if (Math.abs(dy) > 2) onDrag(-dy * 0.9);
    };

    const onPointerUp = () => {
      dragRef.current.active = false;
    };

    window.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    window.addEventListener("pointercancel", onPointerUp);
    return () => {
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointercancel", onPointerUp);
    };
  }, [enabled, onDrag]);
}
