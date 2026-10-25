import { useEffect, useRef } from 'react'
import { gsap, SplitText } from './gsap'

export interface RevealApi {
  el: HTMLElement
  q: gsap.utils.SelectorFunc
  splits: SplitText[]
  reduce: boolean
}

/**
 * Runs `build` inside a gsap.context once fonts are ready (so SplitText
 * measures correctly), and cleans everything up on unmount or dep change.
 */
export function useReveal<T extends HTMLElement = HTMLElement>(
  build: (api: RevealApi) => void,
  deps: unknown[] = []
) {
  const ref = useRef<T>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    let cancelled = false
    let ctx: gsap.Context | undefined
    const splits: SplitText[] = []
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const fontsReady = document.fonts ? document.fonts.ready : Promise.resolve()
    fontsReady.then(() => {
      if (cancelled) return
      ctx = gsap.context(() => {
        build({ el, q: gsap.utils.selector(el), splits, reduce })
      }, el)
    })

    return () => {
      cancelled = true
      ctx?.revert()
      splits.forEach((s) => s.revert())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  return ref
}

/** Words dim until scrolled through, then light up one by one. */
export const scrollWords = (target: Element, splits: SplitText[]) => {
  const s = SplitText.create(target, { type: 'words' })
  splits.push(s)
  gsap.set(s.words, { opacity: 0.16 })
  gsap.to(s.words, {
    opacity: 1,
    ease: 'none',
    stagger: 0.12,
    scrollTrigger: { trigger: target, start: 'top 82%', end: 'bottom 50%', scrub: true },
  })
}

/** Letters rise through a mask (by word so lines never break mid-word). */
export const riseChars = (
  target: Element,
  splits: SplitText[],
  opts: { trigger?: Element; start?: string; delay?: number } = {}
) => {
  const s = SplitText.create(target, { type: 'words,chars', mask: 'chars' })
  splits.push(s)
  gsap.from(s.chars, {
    yPercent: 115,
    duration: 1.2,
    stagger: 0.03,
    delay: opts.delay ?? 0,
    ease: 'expo.out',
    scrollTrigger: opts.trigger
      ? { trigger: opts.trigger, start: opts.start ?? 'top 85%' }
      : undefined,
  })
}

export const fadeUp = (
  targets: gsap.TweenTarget,
  trigger: Element,
  start = 'top 88%'
) =>
  gsap.from(targets, {
    autoAlpha: 0,
    y: 28,
    duration: 1,
    stagger: 0.1,
    ease: 'expo.out',
    scrollTrigger: { trigger, start },
  })

export const drawRule = (targets: gsap.TweenTarget, trigger: Element, start = 'top 85%') =>
  gsap.from(targets, {
    scaleX: 0,
    transformOrigin: 'left',
    duration: 1.6,
    ease: 'expo.inOut',
    scrollTrigger: { trigger, start },
  })
