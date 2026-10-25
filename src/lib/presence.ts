import { getBrowserClient } from './supabaseClient'

export const PRESENCE_CHANNEL = 'portfolio-presence'

const VISITOR_KEY = 'pf_visitor_id'
const OWNER_KEY = 'pf_owner'

/** Browsers where the admin has signed in are excluded from analytics. */
export const markOwnerBrowser = () => {
  try {
    localStorage.setItem(OWNER_KEY, '1')
  } catch {}
}
export const isOwnerBrowser = (): boolean => {
  try {
    return localStorage.getItem(OWNER_KEY) === '1'
  } catch {
    return false
  }
}

/** Stable anonymous id per browser, used for presence and unique-visitor counts. */
export const getVisitorId = (): string => {
  try {
    let id = localStorage.getItem(VISITOR_KEY)
    if (!id) {
      id = crypto.randomUUID()
      localStorage.setItem(VISITOR_KEY, id)
    }
    return id
  } catch {
    return crypto.randomUUID()
  }
}

/** One presence channel per tab; `track` is false for observers (the admin). */
export const openPresence = (
  key: string,
  onChange: (e: { type: 'sync' | 'join' | 'leave'; count: number }) => void,
  track = true
) => {
  const channel = getBrowserClient().channel(PRESENCE_CHANNEL, {
    config: { presence: { key } },
  })
  // A join/leave can fire before our own state syncs, so never report fewer
  // people than the event itself implies (the other visitor plus us).
  const count = (min = 0) =>
    Math.max(min, Object.keys(channel.presenceState()).length)
  channel
    .on('presence', { event: 'sync' }, () =>
      onChange({ type: 'sync', count: count() })
    )
    .on('presence', { event: 'join' }, ({ key: k }) => {
      if (k !== key) onChange({ type: 'join', count: count(2) })
    })
    .on('presence', { event: 'leave' }, ({ key: k }) => {
      if (k !== key) onChange({ type: 'leave', count: count(1) })
    })
    .subscribe((status) => {
      if (status === 'SUBSCRIBED' && track)
        channel.track({ at: new Date().toISOString() })
    })
  return () => {
    getBrowserClient().removeChannel(channel)
  }
}
