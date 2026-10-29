import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { gsap, SplitText } from '@/lib/gsap';
import AsciiPortrait from './AsciiPortrait';
import {
  SrOnly,
  Hero,
  PortraitArea,
  TopMeta,
  Lower,
  Giant,
  BottomRow,
  WorkList,
} from './headerStyles';

export interface HeroProject {
  title: string;
  slug: string;
  type: string;
}

const lagosTime = () =>
  new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Africa/Lagos',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date());

/** `ready` flips true as the preloader lifts, so the hero arrives with the reveal. */
const Header = ({
  ready = true,
  projects = [],
}: {
  ready?: boolean;
  projects?: HeroProject[];
}) => {
  const root = useRef<HTMLElement>(null);
  const timeline = useRef<gsap.core.Timeline | null>(null);
  const readyRef = useRef(ready);
  readyRef.current = ready;
  const [time, setTime] = useState('--:--');

  // Live Lagos clock (client only, avoids a hydration mismatch).
  useEffect(() => {
    setTime(lagosTime());
    const id = setInterval(() => setTime(lagosTime()), 15000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    let cancelled = false;
    let ctx: gsap.Context | undefined;
    const splits: SplitText[] = [];

    // Split only once the display font is in, so the letters measure correctly.
    const fontsReady = document.fonts ? document.fonts.ready : Promise.resolve();
    fontsReady.then(() => {
      if (cancelled) return;
      ctx = gsap.context(() => {
        const q = gsap.utils.selector(el);
        const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        gsap.set(q('[data-hero]'), { autoAlpha: 1 });
        if (reduce) return;

        /* ---------- entrance ---------- */
        const lines = q('.giant .line').map((line) => {
          const s = SplitText.create(line, { type: 'chars', mask: 'chars' });
          splits.push(s);
          return s;
        });
        gsap.set(lines.flatMap((s) => s.chars), { yPercent: 118, rotate: 6 });
        gsap.set(q('.fade-up'), { autoAlpha: 0, y: 18 });
        gsap.set(q('.work-row'), { autoAlpha: 0, y: 22 });
        gsap.set(q('.rule'), { scaleX: 0, transformOrigin: 'left' });

        const tl = gsap.timeline({ paused: true, defaults: { ease: 'expo.out' } });
        tl.to(q('.rule'), { scaleX: 1, duration: 1.6, stagger: 0.15, ease: 'expo.inOut' }, 0)
          .to(q('.top-meta .fade-up'), { autoAlpha: 1, y: 0, duration: 1, stagger: 0.08 }, 0.2)
          .to(lines[0].chars, { yPercent: 0, rotate: 0, duration: 1.4, stagger: 0.05 }, 0.5)
          .to(lines[1].chars, { yPercent: 0, rotate: 0, duration: 1.4, stagger: 0.05 }, 0.7)
          .to(q('.bottom-row .fade-up'), { autoAlpha: 1, y: 0, duration: 1, stagger: 0.1 }, 1.3)
          .to(q('.work-row'), { autoAlpha: 1, y: 0, duration: 1, stagger: 0.12 }, 1.5);
        timeline.current = tl;
        if (readyRef.current) tl.play();

        /* ---------- scroll-linked motion ---------- */
        const scrub = { trigger: el, start: 'top top', end: 'bottom top', scrub: true };
        gsap.to(q('.giant .line.first'), { xPercent: -8, ease: 'none', scrollTrigger: scrub });
        gsap.to(q('.giant .line.second'), { xPercent: 8, ease: 'none', scrollTrigger: scrub });
        gsap.to(q('.portrait-area'), { yPercent: 10, ease: 'none', scrollTrigger: scrub });
      }, el);
    });

    return () => {
      cancelled = true;
      timeline.current = null;
      ctx?.revert();
      splits.forEach((s) => s.revert());
    };
  }, []);

  // Play the entrance the moment the loader starts lifting.
  useEffect(() => {
    if (ready) timeline.current?.play();
  }, [ready]);

  return (
    <header ref={root}>
      <SrOnly id="index-h1">
        Godswill Francis — Software Developer based in Lagos, Nigeria
      </SrOnly>

      <Hero data-hero>
        <PortraitArea className="portrait-area">
          <AsciiPortrait ready={ready} />
        </PortraitArea>

        <TopMeta className="top-meta">
          <div>
            <div className="fade-up">(Software Developer)</div>
            <div className="fade-up dim coords">
              Lagos, Nigeria
            </div>
          </div>
          <div className="meta-right">
            <div className="fade-up avail">
              <i /> Available for freelance
            </div>
            <div className="fade-up dim">{time} WAT</div>
          </div>
          <span
            className="rule"
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              bottom: -1,
              height: 1,
              background: 'rgba(231,250,236,0.35)',
            }}
          />
        </TopMeta>

        <Lower>
          <Giant className="giant" aria-hidden>
            <div className="line first">Godswill</div>
            <div className="line second">
              <span>Francis</span>
            </div>
          </Giant>

          <BottomRow className="bottom-row">
            <div>
              <p className="about fade-up">
                I build software end to end: fast interfaces in React and
                Next.js, backed by APIs and data in Node.js, Java and PostgreSQL.
              </p>
              <div className="scroll fade-up">
                <span /> Scroll
              </div>
            </div>
            <WorkList>
              <div className="head fade-up">
                <span>Selected work</span>
                <span>({String(projects.length).padStart(2, '0')})</span>
              </div>
              {projects.slice(0, 4).map((p, i) => (
                <Link
                  key={p.slug}
                  href={`/project/${p.slug}`}
                  className="work-row"
                >
                  <span className="n">{String(i + 1).padStart(2, '0')}</span>
                  <span className="t">{p.title}</span>
                  <span className="k">{p.type} ↗</span>
                </Link>
              ))}
            </WorkList>
          </BottomRow>
        </Lower>
      </Hero>
    </header>
  );
};

export default Header;
