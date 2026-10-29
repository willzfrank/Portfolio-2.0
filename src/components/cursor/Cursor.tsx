import React, { useEffect, useRef, useState } from 'react';
import { gsap } from '@/lib/gsap';

const INTERACTIVE = 'a, button, [data-cursor], summary, label';
const TEXT_FIELDS = 'input, textarea, select, [contenteditable="true"]';

/**
 * Liquid cursor (fine pointers only). The native pointer is hidden and replaced by:
 *  - a dot that tracks exactly,
 *  - a ring that trails behind and stretches/squashes with pointer speed,
 *  - a label bubble for elements marked data-cursor="Text" (e.g. "View").
 * Over text fields the native I-beam is restored.
 */
const Cursor: React.FC = () => {
  // Outer wrappers are positioned by hand each frame; inner elements are scaled by GSAP,
  // so the two never write the same `transform`.
  const dot = useRef<HTMLDivElement>(null);
  const dotInner = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const bubble = useRef<HTMLDivElement>(null);
  const bubbleInner = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);
  // Touch devices have no pointer to replace; render nothing so the label bubble can't sit visible at 0,0.
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    setEnabled(window.matchMedia('(hover: hover) and (pointer: fine)').matches);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const dotEl = dot.current;
    const dotIn = dotInner.current;
    const ringEl = ring.current;
    const bubbleEl = bubble.current;
    const bubbleIn = bubbleInner.current;
    const labelEl = label.current;
    if (!dotEl || !dotIn || !ringEl || !bubbleEl || !bubbleIn || !labelEl) return;

    const root = document.documentElement;
    root.classList.add('has-cursor');

    gsap.set([dotIn, bubbleIn], { scale: 0 });

    const mouse = { x: -100, y: -100 };
    const pos = { x: -100, y: -100 };
    const state = { shown: false, hot: false, text: false, label: '', down: false };
    // eased scale of the ring (grows over links, shrinks on press)
    const ringScale = { v: 1 };

    const applyState = () => {
      const showBubble = state.shown && !state.text && state.label !== '';
      const showRing = state.shown && !state.text && !showBubble;
      const showDot = state.shown && !state.text && !showBubble;
      gsap.to(dotIn, { scale: showDot ? (state.hot ? 0.6 : 1) : 0, duration: 0.35, ease: 'expo.out', overwrite: 'auto' });
      gsap.to(ringEl, { opacity: showRing ? 1 : 0, duration: 0.3, overwrite: 'auto' });
      gsap.to(ringScale, {
        v: state.down ? 0.75 : state.hot ? 1.9 : 1,
        duration: 0.5,
        ease: 'expo.out',
        overwrite: 'auto',
      });
      gsap.to(bubbleIn, {
        scale: showBubble ? (state.down ? 0.9 : 1) : 0,
        duration: 0.5,
        ease: 'expo.out',
        overwrite: 'auto',
      });
    };

    const onMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      if (!state.shown) {
        pos.x = mouse.x;
        pos.y = mouse.y;
        state.shown = true;
        gsap.set(ringEl, { opacity: 1 });
        applyState();
      }
      dotEl.style.transform = `translate3d(${mouse.x}px, ${mouse.y}px, 0) translate(-50%, -50%)`;
    };

    const onOver = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      const text = !!t.closest(TEXT_FIELDS);
      const target = t.closest<HTMLElement>(INTERACTIVE);
      const next = {
        text,
        hot: !!target && !text,
        label: !text && target ? target.dataset.cursor || '' : '',
      };
      if (next.text !== state.text || next.hot !== state.hot || next.label !== state.label) {
        state.text = next.text;
        state.hot = next.hot;
        if (next.label !== state.label) {
          state.label = next.label;
          if (next.label) labelEl.textContent = next.label;
        }
        applyState();
      }
    };

    const onDown = () => {
      state.down = true;
      applyState();
    };
    const onUp = () => {
      state.down = false;
      applyState();
    };
    const onLeave = () => {
      state.shown = false;
      applyState();
    };

    // Trail + liquid stretch, driven by GSAP's ticker so it matches scroll animations.
    let prevX = pos.x;
    let prevY = pos.y;
    const tick = (_t: number, dt: number) => {
      const k = 1 - Math.pow(1 - 0.16, (dt / 16.67) || 1);
      pos.x += (mouse.x - pos.x) * k;
      pos.y += (mouse.y - pos.y) * k;

      const vx = pos.x - prevX;
      const vy = pos.y - prevY;
      prevX = pos.x;
      prevY = pos.y;
      const speed = Math.hypot(vx, vy);
      const stretch = Math.min(speed / 38, 0.55);
      const angle = (Math.atan2(vy, vx) * 180) / Math.PI;
      const s = ringScale.v;

      ringEl.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0) translate(-50%, -50%) rotate(${speed > 0.3 ? angle : 0}deg) scale(${s * (1 + stretch)}, ${s * (1 - stretch * 0.6)})`;
      bubbleEl.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0) translate(-50%, -50%)`;
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('mouseover', onOver, { passive: true });
    window.addEventListener('mousedown', onDown);
    window.addEventListener('mouseup', onUp);
    document.addEventListener('mouseleave', onLeave);
    gsap.ticker.add(tick);

    return () => {
      root.classList.remove('has-cursor');
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseover', onOver);
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('mouseup', onUp);
      document.removeEventListener('mouseleave', onLeave);
      gsap.ticker.remove(tick);
    };
  }, [enabled]);

  const base: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    pointerEvents: 'none',
    zIndex: 99999,
  };

  if (!enabled) return null;

  return (
    <>
      {/* ring + dot invert whatever is underneath */}
      <div
        ref={ring}
        aria-hidden
        style={{
          ...base,
          width: 38,
          height: 38,
          borderRadius: '50%',
          border: '1px solid #fff',
          mixBlendMode: 'difference',
          opacity: 0,
        }}
      />
      <div ref={dot} aria-hidden style={{ ...base, width: 8, height: 8, mixBlendMode: 'difference' }}>
        <div
          ref={dotInner}
          style={{ width: '100%', height: '100%', borderRadius: '50%', background: '#fff' }}
        />
      </div>
      {/* label bubble sits above the blend layers so its text stays readable */}
      <div ref={bubble} aria-hidden style={{ ...base, zIndex: 100000, width: 92, height: 92 }}>
        <div
          ref={bubbleInner}
          style={{
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            background: 'rgb(231, 250, 236)',
            color: '#1f1f1f',
            display: 'grid',
            placeItems: 'center',
            fontSize: '0.7rem',
            fontWeight: 600,
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
          }}
        >
          <span ref={label} />
        </div>
      </div>
    </>
  );
};

export default Cursor;
