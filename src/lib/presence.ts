import type { RealtimeChannel } from '@supabase/supabase-js'
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

export interface PresencePerson {
  key: string
  path?: string
  since?: string
}

export interface PresenceEvent {
  type: 'sync' | 'join' | 'leave'
  count: number
  /** everyone currently online (with the page they are on) */
  people: PresencePerson[]
}

/**
 * One presence channel per tab; `track` is false for observers (the admin).
 * The returned cleanup function also has `.update()` to publish the visitor's current page.
 *
 * supabase-js reuses a channel with the same topic until its (async) removal finishes, and
 * refuses new listeners on an already-subscribed channel. So a fast unmount -> mount (React
 * dev double-mount, switching admin tabs) must wait for the stale channel to be gone first.
 */
export const openPresence = (
  key: string,
  onChange: (e: PresenceEvent) => void,
  track = true,
  getMeta: () => Record<string, unknown> = () => ({})
) => {
  const client = getBrowserClient()
  const topic = `realtime:${PRESENCE_CHANNEL}`
  const joinedAt = new Date().toISOString()
  let channel: RealtimeChannel | null = null
  let cancelled = false

  const setup = async (retry = true): Promise<void> => {
    const stale = client.getChannels().filter((c) => c.topic === topic)
    await Promise.all(stale.map((c) => client.removeChannel(c)))
    if (cancelled) return

    let ch: RealtimeChannel
    try {
      ch = client.channel(PRESENCE_CHANNEL, { config: { presence: { key } } })
      // Another consumer may have just created and joined this topic; touching it throws.
      if (ch.state === 'joined' || ch.state === 'joining') throw new Error('channel in use')
    } catch {
      if (retry && !cancelled) {
        await new Promise((r) => setTimeout(r, 250))
        return setup(false)
      }
      return
    }
    const people = (): PresencePerson[] =>
      Object.entries(ch.presenceState()).map(([k, metas]) => {
        const m = (metas as unknown as Record<string, unknown>[])[0] ?? {}
        return { key: k, path: m.path as string | undefined, since: m.at as string | undefined }
      })
    // A join/leave can fire before our own state syncs, so never report fewer
    // people than the event itself implies (the other visitor plus us).
    const count = (min = 0) => Math.max(min, Object.keys(ch.presenceState()).length)
    ch.on('presence', { event: 'sync' }, () => onChange({ type: 'sync', count: count(), people: people() }))
      .on('presence', { event: 'join' }, ({ key: k }) => {
        if (k !== key) onChange({ type: 'join', count: count(2), people: people() })
      })
      .on('presence', { event: 'leave' }, ({ key: k }) => {
        if (k !== key) onChange({ type: 'leave', count: count(1), people: people() })
      })
      .subscribe((status) => {
        if (status === 'SUBSCRIBED' && track) ch.track({ at: joinedAt, ...getMeta() })
      })
    channel = ch
  }
  setup()

  const cleanup = () => {
    cancelled = true
    if (channel) client.removeChannel(channel)
    channel = null
  }
  return Object.assign(cleanup, {
    update: () => {
      if (track && channel) channel.track({ at: joinedAt, ...getMeta() })
    },
  })
}
