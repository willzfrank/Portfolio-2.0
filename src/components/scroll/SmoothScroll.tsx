import { useEffect } from 'react'
import { useRouter } from 'next/router'
import Lenis from 'lenis'
import { gsap, ScrollTrigger } from '@/lib/gsap'

/**
 * Inertia smooth scrolling for the public site (not the admin), driven by
 * GSAP's ticker so ScrollTrigger animations stay in lockstep with it.
 */
const SmoothScroll: React.FC = () => {
  const router = useRouter()

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    })

    lenis.on('scroll', ScrollTrigger.update)
    const tick = (time: number) => lenis.raf(time * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)

    const toTop = () => lenis.scrollTo(0, { immediate: true })
    router.events.on('routeChangeComplete', toTop)

    return () => {
      router.events.off('routeChangeComplete', toTop)
      gsap.ticker.remove(tick)
      lenis.destroy()
    }
  }, [router.events])

  return null
}

export default SmoothScroll
