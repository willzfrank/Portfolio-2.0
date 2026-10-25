import React, { useEffect, useRef } from 'react';
import { gsap } from '@/lib/gsap';
import { Progress } from './homeStyles';

/** Thin line along the top that fills as you scroll the page. */
const ScrollProgress = () => {
  const bar = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = bar.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      gsap.to(el, {
        scaleX: 1,
        ease: 'none',
        scrollTrigger: { start: 0, end: 'max', scrub: 0.2 },
      });
    });
    return () => ctx.revert();
  }, []);
  return <Progress ref={bar} aria-hidden />;
};

export default ScrollProgress;
