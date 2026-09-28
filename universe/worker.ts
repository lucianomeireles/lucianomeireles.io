/// <reference lib="webworker" />

import { UniverseRenderer } from "./renderer";
import type { WorkerInMessage, WorkerOutMessage } from "./messages";

let renderer: UniverseRenderer | null = null;

function post(msg: WorkerOutMessage): void {
  self.postMessage(msg);
}

self.onmessage = (ev: MessageEvent<WorkerInMessage>) => {
  const msg = ev.data;
  switch (msg.type) {
    case "init": {
      const gl = msg.canvas.getContext("webgl2", {
        alpha: false,
        antialias: false,
        depth: false,
        stencil: false,
        powerPreference: "high-performance",
      });
      if (!gl) {
        post({ type: "contextLost" });
        return;
      }
      renderer = new UniverseRenderer(msg.canvas, gl);
      renderer.setReducedMotion(msg.reducedMotion);
      renderer.resize(msg.width, msg.height, msg.dpr);
      post({ type: "ready" });
      renderer.start(() => post({ type: "fadeIn" }));
      break;
    }
    case "resize":
      renderer?.resize(msg.width, msg.height, msg.dpr);
      break;
    case "reducedMotion":
      renderer?.setReducedMotion(msg.enabled);
      break;
    case "visibility":
      renderer?.setVisibility(msg.hidden);
      break;
  }
};

export {};
