import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { gsap, SplitText } from '@/lib/gsap';
import { Chapter, Label, ManifestoText, Facts, LinkArrow } from './homeStyles';

const DEFAULT_TEXT =
  'With 5 years of software development experience, I am now working with Polar Frequency, having previously been part of the amazing team at Sterling Bank Plc. I am a master of crafting efficient and creative solutions. Passionate about using tech for good, I am constantly seeking innovative problem-solving methods. Expert in React, Next.js, TypeScript, Node.js, and modern web technologies, I deliver high-quality software that impresses clients.';

/** The About text lights up word by word as you scroll through it. */
const Manifesto = ({ text }: { text?: string | null }) => {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    let cancelled = false;
    let ctx: gsap.Context | undefined;
    let split: SplitText | undefined;

    const fontsReady = document.fonts ? document.fonts.ready : Promise.resolve();
    fontsReady.then(() => {
      if (cancelled) return;
      ctx = gsap.context(() => {
        const q = gsap.utils.selector(el);
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        const p = q('.manifesto-text')[0];
        split = SplitText.create(p, { type: 'words' });
        gsap.set(split.words, { opacity: 0.16 });
        gsap.to(split.words, {
          opacity: 1,
          ease: 'none',
          stagger: 0.12,
          scrollTrigger: { trigger: p, start: 'top 82%', end: 'bottom 50%', scrub: true },
        });

        gsap.from(q('.rule'), {
          scaleX: 0,
          duration: 1.6,
          ease: 'expo.inOut',
          scrollTrigger: { trigger: el, start: 'top 80%' },
        });
        gsap.from(q('.reveal'), {
          autoAlpha: 0,
          y: 28,
          duration: 1,
          stagger: 0.12,
          ease: 'expo.out',
          scrollTrigger: { trigger: q('.facts')[0], start: 'top 88%' },
        });
      }, el);
    });

    return () => {
      cancelled = true;
      ctx?.revert();
      split?.revert();
    };
  }, [text]);

  return (
    <Chapter ref={root} id="about">
      <Label>
        <span>(01) — About</span>
        <span>Scroll to read</span>
        <span className="rule" />
      </Label>

      <ManifestoText className="manifesto-text">{text || DEFAULT_TEXT}</ManifestoText>

      <Facts className="facts">
        <div className="reveal">
          <small>Based in</small>
          Lagos, Nigeria
        </div>
        <div className="reveal">
          <small>Focus</small>
          React, Next.js, TypeScript
        </div>
        <div className="reveal">
          <small>Status</small>
          Open to freelance projects
        </div>
      </Facts>

      <Link href="/about" legacyBehavior passHref>
        <LinkArrow className="reveal">
          More about me <span>↗</span>
        </LinkArrow>
      </Link>
    </Chapter>
  );
};

export default Manifesto;
