import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { gsap, SplitText } from '@/lib/gsap';
import { Project } from '@/data/projects';
import { Chapter, Label, WorkList, Preview, LinkArrow } from './homeStyles';

const src = (u: string) => u.replace(/ /g, '%20');

/**
 * Giant project index. On hover the others dim, the title slides, and a
 * preview of the project floats after the cursor.
 */
const WorkIndex = ({
  projects,
  label = '(02) — Selected work',
  showAll = true,
}: {
  projects: Project[]
  label?: string
  showAll?: boolean
}) => {
  const root = useRef<HTMLElement>(null);
  const preview = useRef<HTMLDivElement>(null);

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

        gsap.from(q('.label-rule'), {
          scaleX: 0,
          duration: 1.6,
          ease: 'expo.inOut',
          scrollTrigger: { trigger: el, start: 'top 80%' },
        });

        if (!reduce) {
          // Each project title rises letter by letter as its row enters.
          q('.row').forEach((row) => {
            const title = row.querySelector('.title') as HTMLElement;
            const s = SplitText.create(title, { type: 'words,chars', mask: 'chars' });
            splits.push(s);
            gsap.from(s.chars, {
              yPercent: 115,
              duration: 1.1,
              stagger: 0.03,
              ease: 'expo.out',
              scrollTrigger: { trigger: row, start: 'top 88%' },
            });
            gsap.from(row.querySelectorAll('.n, .meta'), {
              autoAlpha: 0,
              y: 16,
              duration: 0.9,
              stagger: 0.08,
              ease: 'expo.out',
              scrollTrigger: { trigger: row, start: 'top 88%' },
            });
          });
        }

        /* ---------- floating preview ---------- */
        const box = preview.current;
        if (!box || reduce || !window.matchMedia('(hover: hover)').matches) return;
        const imgs = Array.from(box.querySelectorAll('img'));
        gsap.set(box, { xPercent: -50, yPercent: -50, scale: 0.7, rotate: 0 });
        const x = gsap.quickTo(box, 'x', { duration: 0.7, ease: 'power3.out' });
        const y = gsap.quickTo(box, 'y', { duration: 0.7, ease: 'power3.out' });
        const rot = gsap.quickTo(box, 'rotate', { duration: 0.6, ease: 'power3.out' });
        let lastX = 0;

        const onMove = (e: MouseEvent) => {
          x(e.clientX + 40);
          y(e.clientY + 30);
          rot(gsap.utils.clamp(-9, 9, (e.clientX - lastX) * 0.25));
          lastX = e.clientX;
        };
        const show = (i: number) => {
          imgs.forEach((im, n) => im.classList.toggle('on', n === i));
          gsap.to(box, { autoAlpha: 1, scale: 1, duration: 0.6, ease: 'expo.out', overwrite: 'auto' });
        };
        const hide = () =>
          gsap.to(box, { autoAlpha: 0, scale: 0.7, duration: 0.4, ease: 'power2.in', overwrite: 'auto' });

        const list = q('.list')[0];
        const rows = q('.row');
        const handlers = rows.map((row, i) => {
          const enter = () => show(i);
          row.addEventListener('mouseenter', enter);
          return () => row.removeEventListener('mouseenter', enter);
        });
        list.addEventListener('mouseleave', hide);
        window.addEventListener('mousemove', onMove, { passive: true });
        ctx?.add(() => {
          handlers.forEach((off) => off());
          list.removeEventListener('mouseleave', hide);
          window.removeEventListener('mousemove', onMove);
        });
      }, el);
    });

    return () => {
      cancelled = true;
      ctx?.revert();
      splits.forEach((s) => s.revert());
    };
  }, [projects]);

  return (
    <Chapter ref={root} id="work">
      <Label>
        <span>{label}</span>
        <span>({String(projects.length).padStart(2, '0')})</span>
        <span className="rule label-rule" />
      </Label>

      <WorkList className="list">
        {projects.map((p, i) => (
          <Link key={p.slug} href={`/project/${p.slug}`} className="row" data-cursor>
            <span className="n">{String(i + 1).padStart(2, '0')}</span>
            <span className="title">{p.title}</span>
            <span className="meta">
              {p.type}
              <br />
              {p.timeline}
              <span className="arrow">↗</span>
            </span>
          </Link>
        ))}
      </WorkList>

      <Preview ref={preview} aria-hidden>
        {projects.map((p) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img key={p.slug} src={src(p.image)} alt="" />
        ))}
      </Preview>

      {showAll && (
        <Link href="/project" legacyBehavior passHref>
          <LinkArrow>
            All projects <span>↗</span>
          </LinkArrow>
        </Link>
      )}
    </Chapter>
  );
};

export default WorkIndex;
