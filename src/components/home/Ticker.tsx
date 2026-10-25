import React, { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import { TickerWrap, TickerRow } from './homeStyles';

const A = ['JavaScript', 'React', 'Next.js', 'TypeScript', 'Python', 'Tailwind CSS', 'Docker'];
const B = ['Styled-Components', 'GraphQL', 'AWS', 'Azure DevOps', 'React Native', 'Flutter', 'REST'];

const Items = ({ words }: { words: string[] }) => (
  <div className="item">
    {words.map((w) => (
      <React.Fragment key={w}>
        <span>{w}</span>
        <i>✦</i>
      </React.Fragment>
    ))}
  </div>
);

/** Two skill lines in opposite directions; scroll speed pushes and skews them. */
const Ticker = () => {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(el);
      const [t1, t2] = q('.track') as HTMLElement[];
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

      const l1 = gsap.to(t1, { xPercent: -50, ease: 'none', duration: 45, repeat: -1 });
      const l2 = gsap.fromTo(
        t2,
        { xPercent: -50 },
        { xPercent: 0, ease: 'none', duration: 55, repeat: -1 }
      );
      const skew = gsap.quickTo(q('.track'), 'skewX', { duration: 0.5, ease: 'power3.out' });

      ScrollTrigger.create({
        start: 0,
        end: 'max',
        onUpdate: (self) => {
          const v = self.getVelocity();
          const boost = 1 + Math.min(Math.abs(v) / 350, 6);
          gsap.to([l1, l2], { timeScale: boost, duration: 0.2, overwrite: true });
          gsap.to([l1, l2], { timeScale: 1, duration: 1.2, delay: 0.2 });
          skew(gsap.utils.clamp(-10, 10, v / -250));
        },
      });
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <TickerWrap ref={root} aria-hidden>
      <TickerRow className="track">
        <Items words={A} />
        <Items words={A} />
      </TickerRow>
      <TickerRow className="track outline">
        <Items words={B} />
        <Items words={B} />
      </TickerRow>
    </TickerWrap>
  );
};

export default Ticker;
