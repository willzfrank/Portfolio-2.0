import { useEffect, useRef } from 'react'
import { useRouter } from 'next/router'

/** Thin top bar that creeps while a route is loading, so a click visibly "took". */
const RouteProgress = () => {
  const router = useRouter()
  const bar = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = bar.current
    if (!el) return
    let raf = 0
    let hide = 0
    let value = 0

    const set = (v: number, opacity = 1) => {
      el.style.transform = `scaleX(${v})`
      el.style.opacity = String(opacity)
    }
    const tick = () => {
      // Ease towards 90% and wait for the route to actually finish.
      value += (0.9 - value) * 0.04
      set(value)
      raf = requestAnimationFrame(tick)
    }
    const start = () => {
      cancelAnimationFrame(raf)
      clearTimeout(hide)
      el.style.transition = 'none'
      value = 0.08
      set(value)
      void el.offsetWidth
      el.style.transition = 'opacity 0.3s ease'
      document.body.classList.add('is-routing')
      raf = requestAnimationFrame(tick)
    }
    const done = () => {
      cancelAnimationFrame(raf)
      document.body.classList.remove('is-routing')
      el.style.transition = 'transform 0.2s ease, opacity 0.3s ease 0.2s'
      set(1, 0)
      hide = window.setTimeout(() => {
        el.style.transition = 'none'
        set(0, 0)
      }, 600)
    }

    router.events.on('routeChangeStart', start)
    router.events.on('routeChangeComplete', done)
    router.events.on('routeChangeError', done)
    return () => {
      cancelAnimationFrame(raf)
      clearTimeout(hide)
      document.body.classList.remove('is-routing')
      router.events.off('routeChangeStart', start)
      router.events.off('routeChangeComplete', done)
      router.events.off('routeChangeError', done)
    }
  }, [router])

  return (
    <div
      ref={bar}
      aria-hidden
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: 3,
        background: 'rgb(231, 250, 236)',
        boxShadow: '0 0 10px rgba(231, 250, 236, 0.6)',
        transformOrigin: 'left',
        transform: 'scaleX(0)',
        opacity: 0,
        zIndex: 100000,
        pointerEvents: 'none',
      }}
    />
  )
}

export default RouteProgress
