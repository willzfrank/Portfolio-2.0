import { getVisitorId, isOwnerBrowser } from './presence'

const SESSION_KEY = 'pf_sid'
const SESSION_TS = 'pf_sid_ts'
const SEEN_KEY = 'pf_seen'
const REF_KEY = 'pf_ref'
const SESSION_REF = 'pf_sref'
const REF_TTL_MS = 30 * 24 * 60 * 60 * 1000
const IDLE_SESSION_MS = 30 * 60 * 1000
const ACTIVE_WINDOW_MS = 30 * 1000
const FLUSH_EVERY_TICKS = 10
// Module-level so it survives a tracker being torn down and recreated.
let lastPageView = { path: '', at: 0 }

const IMMEDIATE = new Set(['resume', 'email', 'social', 'outbound', 'form_submit'])

type EventType =
  | 'resume' | 'email' | 'social' | 'outbound' | 'form_start' | 'form_submit' | 'form_error'
  | 'lens' | 'js_error' | 'resource_error' | 'rage_click' | 'not_found' | 'vitals'

interface QueuedEvent {
  type: EventType
  path: string
  meta: Record<string, unknown>
}

/** A ?ref=<tag> on the landing URL, cleaned up so "Resend " and "resend" count as one. */
const urlRef = (): string | null => {
  const raw = new URLSearchParams(location.search).get('ref')
  const ref = raw ? raw.trim().toLowerCase().replace(/[^a-z0-9._-]/g, '-').slice(0, 60) : ''
  return ref || null
}

/** The last tracked link this browser used, for 30 days. Stored as "<ref>|<timestamp>". */
const storedRef = (): string | null => {
  try {
    const [ref, at] = (localStorage.getItem(REF_KEY) || '').split('|')
    return ref && Date.now() - Number(at) < REF_TTL_MS ? ref : null
  } catch {
    return null
  }
}

const cameFromElsewhere = () => {
  try {
    return !!document.referrer && new URL(document.referrer).host !== location.host
  } catch {
    return false
  }
}

/** The tracked link this visit is credited to, if any (sent along with contact messages). */
export const currentRef = (): string | null => {
  try {
    return sessionStorage.getItem(SESSION_REF)
  } catch {
    return null
  }
}

/** Visitors who opt out via Do Not Track (or the owner's own browser) are never measured. */
export const analyticsAllowed = (): boolean => {
  if (typeof window === 'undefined') return false
  if (navigator.doNotTrack === '1' || (window as any).doNotTrack === '1') return false
  return !isOwnerBrowser()
}

const uuid = () =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`

const scrollPct = () => {
  const el = document.documentElement
  const max = el.scrollHeight - window.innerHeight
  if (max <= 0) return 100
  return Math.min(100, Math.round(((window.scrollY || el.scrollTop) / max) * 100))
}

/**
 * Anonymous, cookie-less analytics client. Measures *active* time (tab visible and the
 * person recently interacted), scroll depth, key clicks, errors and load speed.
 */
export const createTracker = () => {
  const vid = getVisitorId()
  let sid = ''
  let sessionIsNew = false

  const ensureSession = () => {
    const now = Date.now()
    let last = 0
    let id: string | null = null
    try {
      id = sessionStorage.getItem(SESSION_KEY)
      last = Number(sessionStorage.getItem(SESSION_TS) || 0)
    } catch {}
    // Arriving through a different tracked link starts a fresh visit so it is credited to that link.
    const fresh = urlRef()
    if (!id || now - last > IDLE_SESSION_MS || (fresh && fresh !== currentRef())) {
      id = uuid()
      sessionIsNew = true
    }
    sid = id
    try {
      sessionStorage.setItem(SESSION_KEY, id)
      sessionStorage.setItem(SESSION_TS, String(now))
    } catch {}
  }
  const touchSession = () => {
    try {
      sessionStorage.setItem(SESSION_TS, String(Date.now()))
    } catch {}
  }

  let returning = false
  try {
    returning = localStorage.getItem(SEEN_KEY) === '1'
    localStorage.setItem(SEEN_KEY, '1')
  } catch {}

  let view: { id: string; path: string; active: number; scroll: number; dirty: boolean } | null = null
  let queue: QueuedEvent[] = []
  let lastInteraction = Date.now()
  let ticks = 0
  let flushTimer = 0
  let errorCount = 0
  const seenErrors = new Set<string>()
  const rageClicks: { t: number; x: number; y: number }[] = []
  let rageOnPage = 0
  let lastRage = 0

  const send = (body: Record<string, unknown>, beacon = false) => {
    const json = JSON.stringify({ sid, vid, ...body })
    if (beacon && navigator.sendBeacon) {
      navigator.sendBeacon('/api/collect', new Blob([json], { type: 'application/json' }))
      return
    }
    fetch('/api/collect', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: json,
      keepalive: true,
    }).catch(() => undefined)
  }

  const flush = (beacon = false) => {
    window.clearTimeout(flushTimer)
    const body: Record<string, unknown> = {}
    if (view && view.dirty) {
      body.upd = { view: view.id, d: view.active, s: view.scroll }
      view.dirty = false
    }
    if (queue.length) body.evs = queue.splice(0, 20)
    if (body.upd || body.evs) send(body, beacon)
  }

  const event = (type: EventType, meta: Record<string, unknown> = {}) => {
    queue.push({ type, path: view?.path ?? location.pathname, meta })
    if (IMMEDIATE.has(type)) flush(true)
    else {
      window.clearTimeout(flushTimer)
      flushTimer = window.setTimeout(() => flush(), 1200)
    }
  }

  const pageView = (path: string) => {
    // Same page reported twice in a row (e.g. React dev double-mount): count it once.
    const now = Date.now()
    if (lastPageView.path === path && now - lastPageView.at < 2000) return
    lastPageView = { path, at: now }
    if (view) flush(true)
    // A long idle gap starts a new visit.
    let last = 0
    try {
      last = Number(sessionStorage.getItem(SESSION_TS) || 0)
    } catch {}
    const fresh = urlRef()
    if (!sid || (last && Date.now() - last > IDLE_SESSION_MS) || (fresh && fresh !== currentRef())) {
      ensureSession()
    }
    touchSession()

    view = { id: uuid(), path, active: 0, scroll: scrollPct(), dirty: false }
    rageOnPage = 0
    const body: Record<string, unknown> = {
      pv: { view: view.id, path, ref: document.referrer || null },
    }
    if (sessionIsNew) {
      const q = new URLSearchParams(location.search)
      // A fresh ?ref= wins. Otherwise a remembered one only counts for a direct return, so a
      // later visit via Google or LinkedIn is credited to that site instead.
      const ref = urlRef() || (cameFromElsewhere() ? null : storedRef())
      try {
        if (ref) {
          localStorage.setItem(REF_KEY, `${ref}|${Date.now()}`)
          sessionStorage.setItem(SESSION_REF, ref)
        } else sessionStorage.removeItem(SESSION_REF)
      } catch {}
      body.ses = {
        lang: navigator.language,
        tz: Intl.DateTimeFormat().resolvedOptions().timeZone,
        sw: window.innerWidth,
        ref: document.referrer || null,
        ret: returning,
        utm_source: q.get('utm_source') || ref || q.get('source'),
        utm_medium: q.get('utm_medium'),
        utm_campaign: q.get('utm_campaign'),
      }
      sessionIsNew = false
    }
    send(body)
  }

  /* ---------- active time ---------- */
  const interact = () => {
    lastInteraction = Date.now()
  }
  const onScroll = () => {
    interact()
    if (view) {
      const s = scrollPct()
      if (s > view.scroll) {
        view.scroll = s
        view.dirty = true
      }
    }
  }
  const tick = window.setInterval(() => {
    if (!view || document.visibilityState !== 'visible') return
    if (Date.now() - lastInteraction > ACTIVE_WINDOW_MS) return
    view.active += 1000
    view.dirty = true
    touchSession()
    if (++ticks % FLUSH_EVERY_TICKS === 0) flush()
  }, 1000)

  /* ---------- clicks: intent signals + rage clicks ---------- */
  const onClick = (e: MouseEvent) => {
    interact()
    const target = e.target as Element | null
    if (!target) return

    const a = target.closest('a')
    if (a) {
      const href = a.getAttribute('href') || ''
      if (href.startsWith('mailto:')) {
        event('email', { to: href.slice(7).split('?')[0] })
      } else if (/\.pdf($|\?)/i.test(href) || a.hasAttribute('download')) {
        event('resume', { file: decodeURIComponent(href).slice(0, 120) })
      } else if (a.host && a.host !== location.host) {
        const host = a.host.replace(/^www\./, '')
        if (/github\.com|twitter\.com|x\.com|linkedin\.com/.test(host)) event('social', { host })
        else event('outbound', { host, url: a.href.slice(0, 200) })
      }
    }

    const now = Date.now()
    rageClicks.push({ t: now, x: e.clientX, y: e.clientY })
    while (rageClicks.length && now - rageClicks[0].t > 700) rageClicks.shift()
    if (
      rageClicks.length >= 3 &&
      rageOnPage < 3 &&
      now - lastRage > 3000 &&
      Math.hypot(rageClicks[0].x - e.clientX, rageClicks[0].y - e.clientY) < 40
    ) {
      lastRage = now
      rageOnPage++
      event('rage_click', {
        tag: target.tagName.toLowerCase(),
        text: (target.textContent || '').trim().slice(0, 40),
        x: Math.round((e.clientX / window.innerWidth) * 100),
        y: Math.round((e.clientY / window.innerHeight) * 100),
      })
    }
  }

  /* ---------- errors ---------- */
  const noisy = (msg: string) =>
    /ResizeObserver loop|Script error\.?$|chrome-extension|moz-extension|Non-Error promise rejection/i.test(msg)

  const report = (type: 'js_error' | 'resource_error', meta: Record<string, unknown>, key: string) => {
    if (errorCount >= 8 || seenErrors.has(key)) return
    seenErrors.add(key)
    errorCount++
    event(type, meta)
  }
  const onError = (e: Event) => {
    const t = e.target as HTMLElement | null
    if (t && t !== (window as unknown as HTMLElement) && t.tagName) {
      const src = (t as HTMLImageElement).src || (t as HTMLLinkElement).href || ''
      if (/^(IMG|SCRIPT|LINK|VIDEO|SOURCE)$/.test(t.tagName)) {
        report('resource_error', { tag: t.tagName.toLowerCase(), url: src.slice(0, 200) }, `r:${src}`)
      }
      return
    }
    const ev = e as ErrorEvent
    const msg = ev.message || ''
    if (!msg || noisy(msg) || /extension:/.test(ev.filename || '')) return
    const file = (ev.filename || '').split('/').pop()?.split('?')[0] || ''
    report('js_error', { msg: msg.slice(0, 200), src: `${file}:${ev.lineno || 0}` }, `j:${msg}`)
  }
  const onRejection = (e: PromiseRejectionEvent) => {
    const r = e.reason as { message?: string } | string | undefined
    const msg = (typeof r === 'string' ? r : r?.message) || 'Unhandled rejection'
    if (noisy(msg)) return
    report('js_error', { msg: msg.slice(0, 200), src: 'promise' }, `j:${msg}`)
  }

  /* ---------- load speed (landing page) ---------- */
  let lcp = 0
  let cls = 0
  let fid: number | null = null
  let vitalsSent = false
  const observers: PerformanceObserver[] = []
  const observe = (type: string, cb: (list: PerformanceObserverEntryList) => void) => {
    try {
      const po = new PerformanceObserver(cb)
      po.observe({ type, buffered: true } as PerformanceObserverInit)
      observers.push(po)
    } catch {}
  }
  observe('largest-contentful-paint', (l) => {
    const e = l.getEntries()
    lcp = e[e.length - 1].startTime
  })
  observe('layout-shift', (l) => {
    for (const e of l.getEntries() as unknown as { value: number; hadRecentInput: boolean }[]) {
      if (!e.hadRecentInput) cls += e.value
    }
  })
  observe('first-input', (l) => {
    const e = l.getEntries()[0] as unknown as { processingStart: number; startTime: number }
    if (e) fid = e.processingStart - e.startTime
  })
  const sendVitals = () => {
    if (vitalsSent || !lcp) return
    vitalsSent = true
    const nav = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined
    event('vitals', {
      lcp: Math.round(lcp),
      cls: Math.round(cls * 1000) / 1000,
      fid: fid === null ? -1 : Math.round(fid),
      ttfb: nav ? Math.round(nav.responseStart) : -1,
      intro: document.documentElement.dataset.intro === '1' ? 1 : 0,
    })
  }

  const onHidden = () => {
    if (document.visibilityState === 'hidden') {
      sendVitals()
      flush(true)
    }
  }
  const onPageHide = () => {
    sendVitals()
    flush(true)
  }
  const onCustom = (e: Event) => {
    const d = (e as CustomEvent).detail as { type?: EventType; meta?: Record<string, unknown> } | undefined
    if (d?.type) event(d.type, d.meta || {})
  }

  ensureSession()
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('mousemove', interact, { passive: true })
  window.addEventListener('keydown', interact)
  window.addEventListener('touchstart', interact, { passive: true })
  window.addEventListener('click', onClick, true)
  window.addEventListener('error', onError, true)
  window.addEventListener('unhandledrejection', onRejection)
  window.addEventListener('pf:event', onCustom)
  document.addEventListener('visibilitychange', onHidden)
  window.addEventListener('pagehide', onPageHide)

  return {
    pageView,
    event,
    destroy: () => {
      window.clearInterval(tick)
      window.clearTimeout(flushTimer)
      observers.forEach((o) => o.disconnect())
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('mousemove', interact)
      window.removeEventListener('keydown', interact)
      window.removeEventListener('touchstart', interact)
      window.removeEventListener('click', onClick, true)
      window.removeEventListener('error', onError, true)
      window.removeEventListener('unhandledrejection', onRejection)
      window.removeEventListener('pf:event', onCustom)
      document.removeEventListener('visibilitychange', onHidden)
      window.removeEventListener('pagehide', onPageHide)
      flush(true)
    },
  }
}

/** Fire a custom analytics event from anywhere (e.g. the contact form). */
export const track = (type: EventType, meta: Record<string, unknown> = {}) => {
  if (typeof window === 'undefined') return
  window.dispatchEvent(new CustomEvent('pf:event', { detail: { type, meta } }))
}
