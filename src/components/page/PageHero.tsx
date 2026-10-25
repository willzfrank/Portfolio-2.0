import React from 'react'
import Link from 'next/link'
import { useReveal, riseChars, fadeUp } from '@/lib/useReveal'
import { gsap } from '@/lib/gsap'
import { Hero, Title, Intro } from './pageStyles'

interface PageHeroProps {
  label: string
  meta?: string
  /** Title split into lines; `out: true` outlines that line. */
  lines: { text: string; out?: boolean }[]
  long?: boolean
  back?: { href: string; text: string }
  children?: React.ReactNode
}

/** Page opener: hairline label row and a giant title that rises letter by letter. */
const PageHero = ({ label, meta, lines, long, back, children }: PageHeroProps) => {
  const ref = useReveal<HTMLElement>(({ el, q, splits, reduce }) => {
    if (reduce) return
    gsap.from(q('.rule'), {
      scaleX: 0,
      transformOrigin: 'left',
      duration: 1.6,
      ease: 'expo.inOut',
    })
    gsap.from(q('.top span, .top a'), { autoAlpha: 0, y: 12, duration: 1, stagger: 0.1, ease: 'expo.out' })
    q('.l').forEach((line, i) => riseChars(line, splits, { delay: 0.2 + i * 0.12 }))
    gsap.from(q('.intro'), { autoAlpha: 0, y: 24, duration: 1.1, delay: 0.7, ease: 'expo.out' })
    // anything marked data-hero-in (meta rows, buttons) follows
    const extra = q('[data-hero-in]')
    if (extra.length) fadeUp(extra, el, 'top 95%')
  }, [lines.map((l) => l.text).join('|')])

  return (
    <Hero ref={ref}>
      <div className="top">
        {back ? (
          <Link href={back.href} data-cursor>
            {back.text}
          </Link>
        ) : (
          <span>{label}</span>
        )}
        {meta && <span>{meta}</span>}
        <span className="rule" />
      </div>
      <Title className={long ? 'long' : ''}>
        {lines.map((l, i) => (
          <span key={i} className={`l${l.out ? ' out' : ''}`}>
            {l.text}
          </span>
        ))}
      </Title>
      {children && <Intro className="intro">{children}</Intro>}
    </Hero>
  )
}

export default PageHero
