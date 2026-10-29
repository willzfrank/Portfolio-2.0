import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { gsap, SplitText } from '@/lib/gsap';
import {
  ContactWrap,
  ContactLabel,
  BigLine,
  CtaRow,
  Magnetic,
  FootGrid,
  Legal,
  Wordmark,
} from './homeStyles';

const EMAIL = 'willzudoh4@gmail.com';

const lagosTime = () =>
  new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Africa/Lagos',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date());

/** Closing section: inverted mint panel with a giant headline and magnetic CTA. */
const Contact = ({ minimal = false }: { minimal?: boolean }) => {
  const root = useRef<HTMLElement>(null);
  const [time, setTime] = useState('--:--');
  const year = new Date().getFullYear();

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

    const fontsReady = document.fonts ? document.fonts.ready : Promise.resolve();
    fontsReady.then(() => {
      if (cancelled) return;
      ctx = gsap.context(() => {
        const q = gsap.utils.selector(el);
        const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        if (!reduce && !minimal) {
          gsap.from(q('.rule'), {
            scaleX: 0,
            duration: 1.6,
            ease: 'expo.inOut',
            scrollTrigger: { trigger: el, start: 'top 75%' },
          });
          q('.l').forEach((line, i) => {
            const s = SplitText.create(line, { type: 'chars', mask: 'chars' });
            splits.push(s);
            gsap.from(s.chars, {
              yPercent: 115,
              duration: 1.2,
              stagger: 0.03,
              delay: i * 0.12,
              ease: 'expo.out',
              scrollTrigger: { trigger: el, start: 'top 65%' },
            });
          });
          gsap.from(q('.cta-in'), {
            autoAlpha: 0,
            y: 30,
            duration: 1,
            stagger: 0.12,
            ease: 'expo.out',
            scrollTrigger: { trigger: q('.cta-row')[0], start: 'top 90%' },
          });
          // The giant wordmark slides up from below as the page ends.
          gsap.fromTo(
            q('.wordmark'),
            { yPercent: 55 },
            {
              yPercent: 18,
              ease: 'none',
              scrollTrigger: { trigger: el, start: 'bottom 140%', end: 'bottom bottom', scrub: true },
            }
          );
        }

        if (!window.matchMedia('(hover: hover)').matches) return;
        const mag = q('.magnetic')[0] as HTMLElement | undefined;
        if (!mag) return;
        const mx = gsap.quickTo(mag, 'x', { duration: 0.6, ease: 'power3.out' });
        const my = gsap.quickTo(mag, 'y', { duration: 0.6, ease: 'power3.out' });
        const onMove = (e: MouseEvent) => {
          const r = mag.getBoundingClientRect();
          const dx = e.clientX - (r.left + r.width / 2);
          const dy = e.clientY - (r.top + r.height / 2);
          if (Math.hypot(dx, dy) < r.width * 0.9) {
            mx(dx * 0.4);
            my(dy * 0.4);
          } else {
            mx(0);
            my(0);
          }
        };
        const onLeave = () =>
          gsap.to(mag, { x: 0, y: 0, duration: 0.9, ease: 'elastic.out(1, 0.4)' });
        window.addEventListener('mousemove', onMove, { passive: true });
        mag.addEventListener('mouseleave', onLeave);
        ctx?.add(() => {
          window.removeEventListener('mousemove', onMove);
          mag.removeEventListener('mouseleave', onLeave);
        });
      }, el);
    });

    return () => {
      cancelled = true;
      ctx?.revert();
      splits.forEach((s) => s.revert());
    };
  }, [minimal]);

  return (
    <ContactWrap ref={root} id="contact">
      <div className="inner">
        {!minimal && (
          <>
            <ContactLabel>
              <span>(03) — Contact</span>
              <span>Open to new projects</span>
              <span className="rule" />
            </ContactLabel>

            <BigLine>
              <span className="l">Let’s build</span>
              <span className="l out">something</span>
              <span className="l">remarkable.</span>
            </BigLine>

            <CtaRow className="cta-row">
              <a className="mail cta-in" href={`mailto:${EMAIL}`} data-cursor>
                {EMAIL}
              </a>
              <Magnetic className="magnetic cta-in">
                <a href={`mailto:${EMAIL}`}>Say hello</a>
              </Magnetic>
            </CtaRow>
          </>
        )}

        <FootGrid>
          <div>
            <small>Follow</small>
            <a href="https://github.com/willzfrank" target="_blank" rel="noreferrer">
              GitHub ↗
            </a>
            <a href="https://twitter.com/willzfrank001" target="_blank" rel="noreferrer">
              Twitter ↗
            </a>
            <a
              href="https://www.linkedin.com/in/godswill-udoh/"
              target="_blank"
              rel="noreferrer"
            >
              LinkedIn ↗
            </a>
          </div>
          <div>
            <small>Explore</small>
            <Link href="/project">Projects</Link>
            <Link href="/about">About</Link>
            <Link href="/contact">Contact</Link>
            <Link href="/privacy">Privacy</Link>
          </div>
          <div>
            <small>Lagos, Nigeria</small>
            <span style={{ lineHeight: 1.9 }}>{time} WAT</span>
          </div>
          <div>
            <button type="button" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              Back to top ↑
            </button>
          </div>
        </FootGrid>
      </div>

      <Legal>
        Website made in Nigeria with ♥ by Godswill Francis — © @iamwillzfrank / {year} / All
        rights reserved.
        <br />
        Privacy-friendly analytics: no cookies, no IP addresses stored, and your browser&apos;s
        Do Not Track setting is respected. <Link href="/privacy" style={{ color: 'inherit' }}>Read the privacy note</Link>.
      </Legal>
      <Wordmark className="wordmark" aria-hidden>
        Godswill Francis
      </Wordmark>
    </ContactWrap>
  );
};

export default Contact;
