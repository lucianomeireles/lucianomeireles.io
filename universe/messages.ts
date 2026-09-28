export type QualityLevel = 0 | 1 | 2;

export type WorkerInMessage =
  | { type: "init"; canvas: OffscreenCanvas; width: number; height: number; dpr: number; reducedMotion: boolean }
  | { type: "resize"; width: number; height: number; dpr: number }
  | { type: "reducedMotion"; enabled: boolean }
  | { type: "visibility"; hidden: boolean };

export type WorkerOutMessage =
  | { type: "ready" }
  | { type: "fadeIn" }
  | { type: "contextLost" }
  | { type: "quality"; level: QualityLevel };
