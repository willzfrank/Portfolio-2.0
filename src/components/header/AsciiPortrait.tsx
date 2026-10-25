import React, { useEffect, useRef } from 'react';
import { gsap } from '@/lib/gsap';
import { track } from '@/lib/analytics';

const SRC = '/profile-hero.jpeg';
/** Where the crop is anchored vertically (0 = top). Shared with the CSS lens image. */
const FOCUS_Y = 0.22;
/** Sparse -> dense. */
const RAMP = ['.', ':', '/', '+', '<', '>', '{', '}', '#', '@'];
const MINT = '231, 250, 236';
const SCAN_MS = 2600;
const LENS_R = 150;

const smooth = (t: number) => {
  const c = Math.min(1, Math.max(0, t));
  return c * c * (3 - 2 * c);
};

/**
 * The portrait drawn as a field of code glyphs: it scans in, shimmers, and a
 * cursor-driven lens swaps the glyphs for the real photograph underneath.
 */
const AsciiPortrait = ({ ready }: { ready: boolean }) => {
  const wrap = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const lensRef = useRef<HTMLDivElement>(null);
  const readyRef = useRef(ready);
  readyRef.current = ready;
  const startRef = useRef<() => void>(() => undefined);

  useEffect(() => {
    if (ready) startRef.current();
  }, [ready]);

  useEffect(() => {
    const el = wrap.current;
    const cv = canvasRef.current;
    const lensEl = lensRef.current;
    if (!el || !cv || !lensEl) return;
    const ctx = cv.getContext('2d');
    if (!ctx) return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const coarse = window.matchMedia('(hover: none)').matches;

    let raf = 0;
    let disposed = false;
    let visible = true;
    let cols = 0;
    let rows = 0;
    let cell = 8;
    let glyph = new Uint8Array(0);
    let alpha = new Float32Array(0);
    let noise = new Float32Array(0);
    let startedAt = 0; // 0 until the loader hands off
    let revealed = false;
    let prevFront = -10;

    const lens = { x: -999, y: -999, r: 0 };
    const target = { x: -999, y: -999, r: 0 };
    let prevBox = { x0: 0, y0: 0, x1: 0, y1: 0 };
    let lastPointer = 0;
    let introTl: gsap.core.Timeline | null = null;
    let lensTracked = false;

    const img = new window.Image();

    const build = () => {
      const rect = el.getBoundingClientRect();
      const w = Math.max(1, rect.width);
      const h = Math.max(1, rect.height);
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      cv.width = Math.round(w * dpr);
      cv.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cell = w < 700 ? 7 : 8;
      cols = Math.ceil(w / cell);
      rows = Math.ceil(h / cell);

      // Sample the photo at glyph resolution, using the same cover/focus crop as the CSS lens.
      const off = document.createElement('canvas');
      off.width = cols;
      off.height = rows;
      const octx = off.getContext('2d', { willReadFrequently: true });
      if (!octx) return;
      const scale = Math.max(cols / img.naturalWidth, rows / img.naturalHeight);
      const sw = cols / scale;
      const sh = rows / scale;
      octx.drawImage(
        img,
        (img.naturalWidth - sw) / 2,
        (img.naturalHeight - sh) * FOCUS_Y,
        sw,
        sh,
        0,
        0,
        cols,
        rows
      );
      const px = octx.getImageData(0, 0, cols, rows).data;
      const lum = new Float32Array(cols * rows);
      for (let i = 0; i < lum.length; i++) {
        lum[i] = (0.2126 * px[i * 4] + 0.7152 * px[i * 4 + 1] + 0.0722 * px[i * 4 + 2]) / 255;
      }
      // Stretch contrast so the face reads clearly.
      const sorted = Array.from(lum).sort((a, b) => a - b);
      const lo = sorted[Math.floor(sorted.length * 0.04)];
      const hi = sorted[Math.floor(sorted.length * 0.96)];

      glyph = new Uint8Array(cols * rows);
      alpha = new Float32Array(cols * rows);
      noise = new Float32Array(cols * rows);
      for (let j = 0; j < rows; j++) {
        for (let i = 0; i < cols; i++) {
          const idx = j * cols + i;
          // darker pixel -> denser glyph (like ink)
          let d = 1 - Math.min(1, Math.max(0, (lum[idx] - lo) / (hi - lo || 1)));
          d = Math.pow(d, 1.25);
          // fade towards the edges so the portrait floats in the dark
          const ex = Math.min(i, cols - 1 - i) / (cols * 0.14);
          const ey = Math.min(j, rows - 1 - j) / (rows * 0.1);
          d *= smooth(Math.min(ex, ey));
          glyph[idx] = d < 0.06 ? 0 : 1 + Math.min(RAMP.length - 2, Math.floor(d * (RAMP.length - 1)));
          alpha[idx] = 0.22 + 0.78 * d;
          noise[idx] = Math.random();
        }
      }
      ctx.font = `${cell + 1}px ui-monospace, Menlo, Consolas, monospace`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = `rgb(${MINT})`;
      ctx.clearRect(0, 0, w, h);
      if (startedAt === 0 && !reduce) return; // wait for the reveal
      for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) drawCell(i, j, performance.now());
    };

    const drawCell = (i: number, j: number, now: number) => {
      const idx = j * cols + i;
      const x = i * cell;
      const y = j * cell;
      ctx.clearRect(x, y, cell, cell);
      const g = glyph[idx];
      if (!g) return;
      let a = alpha[idx];

      if (!revealed && !reduce) {
        if (startedAt === 0) return;
        const front = ((now - startedAt) / SCAN_MS) * (rows + 14) - 4;
        const jj = j + noise[idx] * 8;
        if (jj > front) return;
        if (front - jj < 4) a = 1; // bright scan edge
      }

      if (lens.r > 1) {
        const dx = x + cell / 2 - lens.x;
        const dy = y + cell / 2 - lens.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        a *= 1 - smooth(1 - dist / (lens.r * 1.05));
      }
      if (a < 0.02) return;
      ctx.globalAlpha = a;
      ctx.fillText(RAMP[g - 1], x + cell / 2, y + cell / 2 + 0.5);
      ctx.globalAlpha = 1;
    };

    const redrawBox = (x0: number, y0: number, x1: number, y1: number, now: number) => {
      const i0 = Math.max(0, Math.floor(x0 / cell));
      const i1 = Math.min(cols - 1, Math.floor(x1 / cell));
      const j0 = Math.max(0, Math.floor(y0 / cell));
      const j1 = Math.min(rows - 1, Math.floor(y1 / cell));
      for (let j = j0; j <= j1; j++) for (let i = i0; i <= i1; i++) drawCell(i, j, now);
    };

    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      if (!visible || !cols) return;

      // Reveal scan: redraw only the band the front moved through.
      if (!revealed && startedAt && !reduce) {
        const front = ((now - startedAt) / SCAN_MS) * (rows + 14) - 4;
        const j0 = Math.max(0, Math.floor(prevFront - 10));
        const j1 = Math.min(rows - 1, Math.ceil(front + 2));
        for (let j = j0; j <= j1; j++) for (let i = 0; i < cols; i++) drawCell(i, j, now);
        prevFront = front;
        if (front > rows + 6) revealed = true;
      }

      // Lens easing
      const k = 0.14;
      const moved =
        Math.abs(target.x - lens.x) > 0.3 ||
        Math.abs(target.y - lens.y) > 0.3 ||
        Math.abs(target.r - lens.r) > 0.3;
      if (moved) {
        lens.x += (target.x - lens.x) * k;
        lens.y += (target.y - lens.y) * k;
        lens.r += (target.r - lens.r) * k;
        lensEl.style.setProperty('--x', `${lens.x}px`);
        lensEl.style.setProperty('--y', `${lens.y}px`);
        lensEl.style.setProperty('--r', `${Math.max(0, lens.r)}px`);
        if (revealed) {
          const pad = Math.max(lens.r, prevBox.x1 - prevBox.x0) * 1.2 + cell * 2;
          const box = { x0: lens.x - pad, y0: lens.y - pad, x1: lens.x + pad, y1: lens.y + pad };
          redrawBox(
            Math.min(box.x0, prevBox.x0),
            Math.min(box.y0, prevBox.y0),
            Math.max(box.x1, prevBox.x1),
            Math.max(box.y1, prevBox.y1),
            now
          );
          prevBox = box;
        }
      }

      // Touch screens: keep the lens drifting on its own.
      if (coarse && revealed && now - lastPointer > 1500) {
        const w = el.clientWidth;
        const h = el.clientHeight;
        target.x = w * (0.5 + 0.28 * Math.sin(now / 1900));
        target.y = h * (0.38 + 0.16 * Math.sin(now / 1300 + 1));
        target.r = LENS_R * 0.8;
      }

      // Ambient shimmer: a few glyphs change now and then.
      if (revealed && !reduce) {
        for (let n = 0; n < 18; n++) {
          const idx = Math.floor(Math.random() * glyph.length);
          const g = glyph[idx];
          if (g > 1) {
            glyph[idx] = Math.min(RAMP.length, Math.max(2, g + (Math.random() < 0.5 ? -1 : 1)));
            drawCell(idx % cols, Math.floor(idx / cols), now);
          }
        }
      }
    };

    const onPointer = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      lastPointer = performance.now();
      const inside = x > -60 && x < r.width + 60 && y > -60 && y < r.height + 60;
      if (introTl && inside) {
        introTl.kill();
        introTl = null;
      }
      if (introTl) return;
      target.x = x;
      target.y = y;
      target.r = inside ? LENS_R : 0;
      if (inside && !lensTracked) {
        lensTracked = true;
        track('lens'); // they found the interactive portrait
      }
    };

    startRef.current = () => {
      if (startedAt) return;
      startedAt = performance.now();
      if (reduce) return;
      // After the scan, sweep the lens across the face once to show it's interactive.
      const w = el.clientWidth;
      const h = el.clientHeight;
      introTl = gsap.timeline({ delay: SCAN_MS / 1000 + 0.3, onComplete: () => (introTl = null) });
      introTl
        .set(target, { x: w * 0.32, y: h * 0.4 })
        .to(target, { r: LENS_R, duration: 0.9, ease: 'power3.out' })
        .to(target, { x: w * 0.68, y: h * 0.46, duration: 1.8, ease: 'power2.inOut' }, '<0.2')
        .to(target, { r: 0, duration: 0.9, ease: 'power3.in' });
    };

    const io = new IntersectionObserver(([entry]) => (visible = entry.isIntersecting));
    io.observe(el);

    let resizeTimer = 0;
    const ro = new ResizeObserver(() => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        if (img.complete && img.naturalWidth) build();
      }, 150);
    });

    img.onload = () => {
      if (disposed) return;
      build();
      ro.observe(el);
      window.addEventListener('pointermove', onPointer, { passive: true });
      raf = requestAnimationFrame(tick);
      if (readyRef.current) startRef.current();
    };
    img.src = SRC;

    return () => {
      disposed = true;
      introTl?.kill();
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onPointer);
      window.clearTimeout(resizeTimer);
      io.disconnect();
      ro.disconnect();
    };
  }, []);

  return (
    <div ref={wrap} className="ascii-wrap" aria-hidden>
      <div ref={lensRef} className="ascii-lens" />
      <canvas ref={canvasRef} className="ascii-canvas" />
    </div>
  );
};

export default AsciiPortrait;
