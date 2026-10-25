import React, { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/router'
import { Toast, Dot } from './presenceStyles'
import { getVisitorId, isOwnerBrowser, openPresence } from '@/lib/presence'

interface Item {
  id: number
  label: string
  count: number
  kind: 'join' | 'leave'
}

const TTL = 4000

/** Bottom-left "Someone joined / left" cards with a live online count. */
const PresenceToast: React.FC = () => {
  const [items, setItems] = useState<Item[]>([])
  const nextId = useRef(0)
  const router = useRouter()

  // Presence tracking
  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || isOwnerBrowser()) return
    const close = openPresence(getVisitorId(), ({ type, count }) => {
      if (type === 'sync') return
      const id = nextId.current++
      setItems((prev) => [
        ...prev.slice(-2),
        {
          id,
          kind: type,
          count,
          label: type === 'join' ? 'Someone joined' : 'Someone left',
        },
      ])
      setTimeout(() => setItems((prev) => prev.filter((i) => i.id !== id)), TTL)
    })
    return close
  }, [])

  // Page view analytics
  useEffect(() => {
    if (isOwnerBrowser()) return
    const track = (path: string) => {
      fetch('/api/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          visitorId: getVisitorId(),
          path,
          referrer: document.referrer || null,
        }),
        keepalive: true,
      }).catch(() => undefined)
    }
    track(window.location.pathname)
    const onRoute = (url: string) => track(url.split(/[?#]/)[0])
    router.events.on('routeChangeComplete', onRoute)
    return () => router.events.off('routeChangeComplete', onRoute)
  }, [router.events])

  return (
    <div
      style={{
        position: 'fixed',
        left: 16,
        bottom: 16,
        zIndex: 9998,
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        pointerEvents: 'none',
      }}
    >
      {items.map((i) => (
        <Toast key={i.id}>
          <Dot $kind={i.kind} />
          <div>
            <strong>{i.label}</strong>
            <span>{i.count} online</span>
          </div>
        </Toast>
      ))}
    </div>
  )
}

export default PresenceToast
