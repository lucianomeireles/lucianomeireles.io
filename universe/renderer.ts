import {
  COMPOSITE_FRAG,
  FULLSCREEN_VERT,
  SKY_GEN_FRAG,
  STAR_FRAG,
  STAR_VERT,
} from "./shaders";
import type { QualityLevel } from "./messages";

type GL = WebGL2RenderingContext;

const QUALITY: Record<QualityLevel, { stars: number; dprCap: number }> = {
  0: { stars: 1800, dprCap: 1 },
  1: { stars: 3200, dprCap: 1.25 },
  2: { stars: 5000, dprCap: 1.5 },
};

function compile(gl: GL, type: number, src: string): WebGLShader {
  const s = gl.createShader(type)!;
  gl.shaderSource(s, src);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
    throw new Error(gl.getShaderInfoLog(s) ?? "shader compile failed");
  }
  return s;
}

function program(gl: GL, vs: string, fs: string): WebGLProgram {
  const p = gl.createProgram()!;
  gl.attachShader(p, compile(gl, gl.VERTEX_SHADER, vs));
  gl.attachShader(p, compile(gl, gl.FRAGMENT_SHADER, fs));
  gl.linkProgram(p);
  if (!gl.getProgramParameter(p, gl.LINK_STATUS)) {
    throw new Error(gl.getProgramInfoLog(p) ?? "program link failed");
  }
  return p;
}

function tex(gl: GL, w: number, h: number, filter = gl.LINEAR): WebGLTexture {
  const t = gl.createTexture()!;
  gl.bindTexture(gl.TEXTURE_2D, t);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, filter);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, filter);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA8, w, h, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
  return t;
}

export class UniverseRenderer {
  private gl: GL;
  private canvas: OffscreenCanvas | HTMLCanvasElement;
  private width = 1;
  private height = 1;
  private dpr = 1;
  private quality: QualityLevel = 0;
  private isMobile = false;

  private skyProg!: WebGLProgram;
  private starProg!: WebGLProgram;
  private compProg!: WebGLProgram;

  private skyTex!: WebGLTexture;
  private starFbo!: WebGLFramebuffer;
  private starTex!: WebGLTexture;

  private starVao!: WebGLVertexArrayObject;
  private starCount = 0;

  private time = 0;
  private drift = 0;
  private skyOffset = [0, 0];
  private reducedMotion = false;
  private running = true;
  private fade = 0;
  private frameTimes: number[] = [];
  private prevTime = 0;
  private raf = 0;

  constructor(canvas: OffscreenCanvas | HTMLCanvasElement, gl: WebGL2RenderingContext) {
    this.canvas = canvas;
    this.gl = gl;
    this.initPrograms();
    this.handleContextLoss();
  }

  private handleContextLoss(): void {
    this.canvas.addEventListener?.("webglcontextlost", (e) => {
      e.preventDefault();
      this.running = false;
      cancelAnimationFrame(this.raf);
    });
    this.canvas.addEventListener?.("webglcontextrestored", () => {
      this.initPrograms();
      this.resize(this.width, this.height, this.dpr);
      this.running = true;
      this.loop(performance.now());
    });
  }

  private initPrograms(): void {
    const gl = this.gl;
    this.skyProg = program(gl, FULLSCREEN_VERT, SKY_GEN_FRAG);
    this.starProg = program(gl, STAR_VERT, STAR_FRAG);
    this.compProg = program(gl, FULLSCREEN_VERT, COMPOSITE_FRAG);
  }

  setQuality(level: QualityLevel): void {
    if (level === this.quality) return;
    this.quality = level;
    this.buildStars();
  }

  setReducedMotion(v: boolean): void {
    this.reducedMotion = v;
  }

  setVisibility(hidden: boolean): void {
    this.running = !hidden;
    if (!hidden) {
      this.prevTime = performance.now();
      this.loop(this.prevTime);
    }
  }

  resize(cssW: number, cssH: number, dpr: number): void {
    this.width = cssW;
    this.height = cssH;
    this.isMobile = cssW < 768 || dpr > 1.25;
    const cap = QUALITY[this.quality].dprCap;
    this.dpr = Math.min(dpr, this.isMobile ? Math.min(cap, 1.5) : Math.min(cap, 2));
    const w = Math.max(1, Math.floor(cssW * this.dpr));
    const h = Math.max(1, Math.floor(cssH * this.dpr));
    this.canvas.width = w;
    this.canvas.height = h;
    this.gl.viewport(0, 0, w, h);
    this.buildSky(w, h);
    this.buildStars();
    this.buildStarTarget(w, h);
  }

  private buildSky(w: number, h: number): void {
    const gl = this.gl;
    const sw = Math.max(1, Math.floor(w * 0.5));
    const sh = Math.max(1, Math.floor(h * 0.5));
    if (this.skyTex) gl.deleteTexture(this.skyTex);
    this.skyTex = tex(gl, sw, sh);
    const fb = gl.createFramebuffer()!;
    gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.skyTex, 0);
    gl.useProgram(this.skyProg);
    gl.uniform1f(gl.getUniformLocation(this.skyProg, "uSeed")!, Math.random() * 10);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.deleteFramebuffer(fb);
  }

  private buildStarTarget(w: number, h: number): void {
    const gl = this.gl;
    if (this.starFbo) gl.deleteFramebuffer(this.starFbo);
    if (this.starTex) gl.deleteTexture(this.starTex);
    this.starTex = tex(gl, w, h, gl.LINEAR);
    this.starFbo = gl.createFramebuffer()!;
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.starFbo);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.starTex, 0);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  }

  private buildStars(): void {
    const gl = this.gl;
    const q = QUALITY[this.quality];
    this.starCount = q.stars;
    const seeds = new Float32Array(this.starCount);
    const layers = new Float32Array(this.starCount);
    for (let i = 0; i < this.starCount; i++) {
      seeds[i] = i * 0.713 + 0.1;
      const r = i / this.starCount;
      layers[i] = r < 0.65 ? 0 : r < 0.88 ? 0.5 : 1;
    }
    if (this.starVao) gl.deleteVertexArray(this.starVao);
    this.starVao = gl.createVertexArray()!;
    gl.bindVertexArray(this.starVao);
    const buf = gl.createBuffer()!;
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, seeds, gl.STATIC_DRAW);
    const locSeed = gl.getAttribLocation(this.starProg, "aSeed");
    gl.enableVertexAttribArray(locSeed);
    gl.vertexAttribPointer(locSeed, 1, gl.FLOAT, false, 0, 0);
    const bufL = gl.createBuffer()!;
    gl.bindBuffer(gl.ARRAY_BUFFER, bufL);
    gl.bufferData(gl.ARRAY_BUFFER, layers, gl.STATIC_DRAW);
    const locLayer = gl.getAttribLocation(this.starProg, "aLayer");
    gl.enableVertexAttribArray(locLayer);
    gl.vertexAttribPointer(locLayer, 1, gl.FLOAT, false, 0, 0);
    gl.bindVertexArray(null);
  }

  start(onFade: () => void): void {
    this.prevTime = performance.now();
    requestAnimationFrame(() => {
      onFade();
      this.loop(this.prevTime);
    });
  }

  private drawFullscreen(prog: WebGLProgram): void {
    const gl = this.gl;
    gl.useProgram(prog);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }

  private stepStars(): void {
    const gl = this.gl;
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.starFbo);
    gl.viewport(0, 0, this.canvas.width, this.canvas.height);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.useProgram(this.starProg);
    gl.uniform2f(
      gl.getUniformLocation(this.starProg, "uResolution")!,
      this.canvas.width,
      this.canvas.height,
    );
    gl.uniform1f(gl.getUniformLocation(this.starProg, "uTime")!, this.time);
    gl.uniform1f(gl.getUniformLocation(this.starProg, "uDrift")!, this.drift);
    gl.uniform1f(gl.getUniformLocation(this.starProg, "uReduced")!, this.reducedMotion ? 1 : 0);
    gl.bindVertexArray(this.starVao);
    gl.drawArrays(gl.POINTS, 0, this.starCount);
    gl.bindVertexArray(null);
    gl.disable(gl.BLEND);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  }

  private stepComposite(): void {
    const gl = this.gl;
    gl.viewport(0, 0, this.canvas.width, this.canvas.height);
    gl.clearColor(0.094, 0.094, 0.094, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.useProgram(this.compProg);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.skyTex);
    gl.uniform1i(gl.getUniformLocation(this.compProg, "uSky")!, 0);
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, this.starTex);
    gl.uniform1i(gl.getUniformLocation(this.compProg, "uStars")!, 1);
    gl.uniform2f(
      gl.getUniformLocation(this.compProg, "uSkyOffset")!,
      this.skyOffset[0],
      this.skyOffset[1],
    );
    this.drawFullscreen(this.compProg);
  }

  private adaptQuality(frameMs: number): void {
    this.frameTimes.push(frameMs);
    if (this.frameTimes.length > 45) this.frameTimes.shift();
    if (this.frameTimes.length < 30) return;
    const avg = this.frameTimes.reduce((a, b) => a + b, 0) / this.frameTimes.length;
    const budget = 1000 / 60;
    if (avg > budget * 1.15 && this.quality > 0) {
      this.setQuality((this.quality - 1) as QualityLevel);
      this.frameTimes.length = 0;
    } else if (avg < budget * 0.75 && this.quality < 2) {
      this.setQuality((this.quality + 1) as QualityLevel);
      this.frameTimes.length = 0;
    }
  }

  private loop = (now: number): void => {
    if (!this.running) return;
    this.raf = requestAnimationFrame(this.loop);
    const dt = Math.min(0.05, (now - (this.prevTime || now)) / 1000);
    this.adaptQuality(dt * 1000);
    this.prevTime = now;
    if (!this.reducedMotion) {
      this.time += dt;
      this.drift += dt * 0.02;
    }
    // O céu deriva dentro de uma margem da própria textura, sem repetir:
    // a textura não é tileável e a repetição mostraria costuras.
    this.skyOffset[0] = 0.04 + 0.03 * Math.sin(this.time * 0.05);
    this.skyOffset[1] = 0.04 + 0.03 * Math.cos(this.time * 0.037);
    this.stepStars();
    this.stepComposite();
    if (this.fade < 1) this.fade = Math.min(1, this.fade + dt * 2);
  };

  getQuality(): QualityLevel {
    return this.quality;
  }
}
