import React, { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/router'
import { AnimatePresence } from 'framer-motion'
import { Stack, Toast, Dot } from './presenceStyles'
import { getVisitorId, isOwnerBrowser, openPresence } from '@/lib/presence'

interface Item {
  id: number
  kind: 'join' | 'leave'
  /** how many join/leave events were merged into this card */
  people: number
  count: number
  at: number
}

const TTL = 4000
/** Events of the same kind inside this window merge into one card. */
const MERGE_MS = 1500
const MAX_CARDS = 4

const labelFor = (i: Item) => {
  const verb = i.kind === 'join' ? 'joined' : 'left'
  return i.people === 1 ? `Someone ${verb}` : `${i.people} people ${verb}`
}

/** Bottom-left "Someone joined / left" cards with a live online count. */
const PresenceToast: React.FC = () => {
  const [items, setItems] = useState<Item[]>([])
  const nextId = useRef(0)
  const timers = useRef(new Map<number, ReturnType<typeof setTimeout>>())
  const router = useRouter()

  // Presence tracking
  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || isOwnerBrowser()) return

    const expire = (id: number) => {
      clearTimeout(timers.current.get(id))
      timers.current.set(
        id,
        setTimeout(() => {
          timers.current.delete(id)
          setItems((prev) => prev.filter((i) => i.id !== id))
        }, TTL)
      )
    }

    const presence = openPresence(
      getVisitorId(),
      ({ type, count }) => {
        if (type === 'sync') return
        const now = Date.now()
        setItems((prev) => {
          const top = prev[prev.length - 1]
          // Same kind right after the last card: fold into it instead of stacking.
          if (top && top.kind === type && now - top.at < MERGE_MS) {
            expire(top.id)
            return [...prev.slice(0, -1), { ...top, people: top.people + 1, count, at: now }]
          }
          const id = nextId.current++
          expire(id)
          const next = [...prev, { id, kind: type, people: 1, count, at: now }]
          return next.slice(-MAX_CARDS)
        })
      },
      true,
      () => ({ path: window.location.pathname })
    )

    // Tell the admin which page this visitor is on.
    const onRoute = () => presence.update()
    router.events.on('routeChangeComplete', onRoute)

    return () => {
      router.events.off('routeChangeComplete', onRoute)
      presence()
      timers.current.forEach(clearTimeout)
      timers.current.clear()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Stack aria-live="polite">
      <AnimatePresence>
        {items.map((i, n) => {
          // 0 = newest (front); older cards sit behind it, smaller and higher.
          const depth = items.length - 1 - n
          return (
            <Toast
              key={i.id}
              initial={{ y: 40, opacity: 0, scale: 0.96 }}
              animate={{
                y: -depth * 12,
                scale: 1 - depth * 0.055,
                opacity: depth > 2 ? 0 : 1 - depth * 0.25,
              }}
              exit={{ y: 8, opacity: 0, scale: 0.97, transition: { duration: 0.25 } }}
              transition={{ type: 'spring', stiffness: 420, damping: 34 }}
              style={{ zIndex: 10 - depth }}
            >
              <Dot $kind={i.kind} />
              <div>
                <strong>{labelFor(i)}</strong>
                <span>{i.count} online</span>
              </div>
            </Toast>
          )
        })}
      </AnimatePresence>
    </Stack>
  )
}

export default PresenceToast
