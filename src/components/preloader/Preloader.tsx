import React, { useEffect, useRef, useState } from 'react'
import { animate, motion } from 'framer-motion'
import {
  Overlay,
  Strips,
  Strip,
  Stage,
  Greeting,
  Dot,
  NameLine,
  Mask,
  Letter,
  Corner,
  Counter,
  Role,
} from './PreloaderStyles'

const GREETINGS = ['Hello', 'Ndewo', 'Bonjour', 'Hola', 'Ciao', 'Hallo']
const NAME = 'GODSWILL FRANCIS'.split('')
const STRIPS = 7
const GREETING_MS = 600
const COUNT_SECONDS = 2.4
const EASE = [0.76, 0, 0.24, 1] as const

const SEEN_KEY = 'pf_preloader_seen'
// Survives client-side navigation (module state) without touching storage.
let playedThisPageLoad = false
export const hasPreloaderPlayed = () => playedThisPageLoad

const FONT_WAIT_MAX_MS = 1500
const LOAD_WAIT_MAX_MS = 1500

const withTimeout = (p: Promise<unknown>, ms: number) =>
  Promise.race([p, new Promise((r) => setTimeout(r, ms))])

/** Resolves once the display font is usable, so the first words don't flash a fallback. */
const fontReady = () =>
  withTimeout(
    document.fonts ? document.fonts.load('1em MyFont') : Promise.resolve(),
    FONT_WAIT_MAX_MS
  )

/** Resolves once the page's images/scripts finished, so the reveal never shows a half-loaded site. */
const pageLoaded = () =>
  withTimeout(
    document.readyState === 'complete'
      ? Promise.resolve()
      : new Promise((r) => window.addEventListener('load', r, { once: true })),
    LOAD_WAIT_MAX_MS
  )

interface PreloaderProps {
  onComplete: () => void
  /** Fires the moment the panels start lifting, so the hero can animate in with them. */
  onLeaving?: () => void
}

/**
 * 1. Greetings flash by in several languages
 * 2. The name rises letter by letter through a mask
 * 3. The dark screen splits into panels that lift away from the centre
 */
const Preloader: React.FC<PreloaderProps> = ({ onComplete, onLeaving }) => {
  const [greeting, setGreeting] = useState(0)
  const [count, setCount] = useState(0)
  const [leaving, setLeaving] = useState(false)
  const [started, setStarted] = useState(false)
  const onCompleteRef = useRef(onComplete)
  onCompleteRef.current = onComplete
  const onLeavingRef = useRef(onLeaving)
  onLeavingRef.current = onLeaving

  // Skip for reduced-motion users and for reloads within the same session.
  const skip = useRef(false)
  useEffect(() => {
    let seen = false
    try {
      seen = sessionStorage.getItem(SEEN_KEY) === '1'
    } catch {}
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (seen || reduce) {
      skip.current = true
      playedThisPageLoad = true
      onCompleteRef.current()
    }
  }, [])

  useEffect(() => {
    if (skip.current) return
    document.body.style.overflow = 'hidden'
    // Lets the analytics tell a first load slowed by this intro from a genuinely slow page.
    document.documentElement.dataset.intro = '1'
    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  useEffect(() => {
    let cancelled = false
    fontReady().then(() => !cancelled && setStarted(true))
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    if (!started) return
    const id = setInterval(
      () => setGreeting((g) => Math.min(g + 1, GREETINGS.length)),
      GREETING_MS
    )
    return () => clearInterval(id)
  }, [started])

  useEffect(() => {
    if (!started) return
    let cancelled = false
    const controls = animate(0, 100, {
      duration: COUNT_SECONDS,
      ease: 'easeInOut',
      onUpdate: (v) => setCount(Math.round(v)),
      onComplete: () =>
        pageLoaded().then(
          () => !cancelled && setTimeout(() => setLeaving(true), 300)
        ),
    })
    return () => {
      cancelled = true
      controls.stop()
    }
  }, [started])

  // Unmount once the panels have cleared the screen.
  useEffect(() => {
    if (!leaving) return
    onLeavingRef.current?.()
    const id = setTimeout(() => {
      playedThisPageLoad = true
      try {
        sessionStorage.setItem(SEEN_KEY, '1')
      } catch {}
      onCompleteRef.current()
    }, 2200)
    return () => clearTimeout(id)
  }, [leaving])

  const showName = greeting >= GREETINGS.length

  return (
    <Overlay className="preloader-overlay">
      <Strips>
        {Array.from({ length: STRIPS }).map((_, i) => (
          <Strip
            key={i}
            animate={{ y: leaving ? '-101%' : '0%' }}
            transition={{
              duration: 1.4,
              ease: EASE,
              // lift from the centre outwards
              delay: leaving ? Math.abs(i - (STRIPS - 1) / 2) * 0.12 : 0,
            }}
          />
        ))}
      </Strips>

      <motion.div
        style={{ position: 'absolute', inset: 0 }}
        animate={{ opacity: leaving ? 0 : 1, y: leaving ? -40 : 0 }}
        transition={{ duration: 0.8, ease: 'easeIn' }}
      >
        <Corner style={{ top: '2rem', left: '2.5rem' }}>
          Portfolio ©{new Date().getFullYear()}
        </Corner>
        <Corner style={{ top: '2rem', right: '2.5rem' }}>Open to freelance</Corner>

        <Stage>
          {!showName ? (
            // Remount per word; entrance only, so a fast tick can never
            // leave an exit animation hanging.
            <Greeting
              key={GREETINGS[greeting]}
              initial={{ y: '40%', opacity: 0 }}
              animate={{ y: '0%', opacity: 1 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            >
              <Dot />
              {GREETINGS[greeting]}
            </Greeting>
          ) : (
            <NameLine key="name">
              {NAME.map((ch, i) => (
                <Mask key={i} $space={ch === ' '}>
                  <Letter
                    initial={{ y: '110%', rotate: 8 }}
                    animate={{ y: '0%', rotate: 0 }}
                    transition={{ duration: 1.1, ease: EASE, delay: i * 0.07 }}
                  >
                    {ch === ' ' ? '\u00A0' : ch}
                  </Letter>
                </Mask>
              ))}
            </NameLine>
          )}
          <Role
            initial={{ opacity: 0 }}
            animate={{ opacity: showName ? 0.7 : 0 }}
            transition={{ delay: showName ? 1.2 : 0, duration: 0.9 }}
          >
            Software Developer
          </Role>
        </Stage>

        <Corner style={{ bottom: '1.5rem', left: '2.5rem' }}>Loading</Corner>
        <Counter style={{ bottom: '1rem', right: '2.5rem' }}>
          {String(count).padStart(3, '0')}
        </Counter>
      </motion.div>
    </Overlay>
  )
}

export default Preloader
