import React, { useEffect, useRef } from 'react';
import { gsap } from '@/lib/gsap';

/**
 * Smooth ring cursor (fine pointers only). It inverts over any background and
 * swells over links, buttons and anything marked data-cursor.
 */
const Cursor: React.FC = () => {
  const ring = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ring.current;
    if (!el || !window.matchMedia('(hover: hover) and (pointer: fine)').matches)
      return;

    gsap.set(el, { xPercent: -50, yPercent: -50, scale: 0 });
    const x = gsap.quickTo(el, 'x', { duration: 0.35, ease: 'power3.out' });
    const y = gsap.quickTo(el, 'y', { duration: 0.35, ease: 'power3.out' });
    let shown = false;

    const onMove = (e: MouseEvent) => {
      x(e.clientX);
      y(e.clientY);
      if (!shown) {
        shown = true;
        gsap.to(el, { scale: 1, duration: 0.5, ease: 'expo.out' });
      }
    };
    const onOver = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      const hot = t.closest('a, button, [data-cursor]');
      gsap.to(el, {
        scale: hot ? 2.1 : 1,
        duration: 0.5,
        ease: 'expo.out',
        overwrite: 'auto',
      });
    };
    const onLeave = () => {
      shown = false;
      gsap.to(el, { scale: 0, duration: 0.4, ease: 'power2.out' });
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('mouseover', onOver, { passive: true });
    document.addEventListener('mouseleave', onLeave);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseover', onOver);
      document.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  return (
    <div
      ref={ring}
      aria-hidden
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: 34,
        height: 34,
        borderRadius: '50%',
        border: '1px solid #fff',
        background: 'transparent',
        mixBlendMode: 'difference',
        pointerEvents: 'none',
        zIndex: 99999,
        transform: 'translate(-50%, -50%) scale(0)',
      }}
    />
  );
};

export default Cursor;
