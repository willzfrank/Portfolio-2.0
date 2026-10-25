import { useEffect } from 'react'
import { useRouter } from 'next/router'
import Lenis from 'lenis'

/** Inertia-based smooth scrolling for the public site (not the admin). */
const SmoothScroll: React.FC = () => {
  const router = useRouter()

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    })

    let frame = requestAnimationFrame(function raf(time) {
      lenis.raf(time)
      frame = requestAnimationFrame(raf)
    })

    const toTop = () => lenis.scrollTo(0, { immediate: true })
    router.events.on('routeChangeComplete', toTop)

    return () => {
      router.events.off('routeChangeComplete', toTop)
      cancelAnimationFrame(frame)
      lenis.destroy()
    }
  }, [router.events])

  return null
}

export default SmoothScroll
