import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerClient, isSupabaseConfigured } from '@/lib/supabaseAdmin'
import { rateLimited } from '@/lib/rateLimit'
import { hostOf, parseUA } from '@/lib/ua'
import { notifyForeignVisit } from '@/lib/notify'

/**
 * Anonymous analytics collector. One endpoint, three kinds of message
 * (sent together or alone):
 *  - pv:  a page view started (the first one of a visit also creates the session)
 *  - upd: running totals for a page view (active seconds, scroll depth)
 *  - evs: discrete events (clicks, errors, vitals…)
 * No IP address is stored; country/city come from the hosting edge headers.
 */

const str = (v: unknown, max: number): string | null =>
  typeof v === 'string' && v ? v.slice(0, max) : null
const int = (v: unknown, min: number, max: number): number | null => {
  const n = Number(v)
  return Number.isFinite(n) ? Math.min(max, Math.max(min, Math.round(n))) : null
}
const decode = (v: string | string[] | undefined): string | null => {
  const s = Array.isArray(v) ? v[0] : v
  if (!s) return null
  try {
    return decodeURIComponent(s).slice(0, 80)
  } catch {
    return s.slice(0, 80)
  }
}

const EVENT_TYPES = new Set([
  'resume', 'email', 'social', 'outbound', 'form_start', 'form_submit', 'form_error',
  'lens', 'js_error', 'resource_error', 'rage_click', 'not_found', 'vitals',
])

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).end()
  }
  if (!isSupabaseConfigured()) return res.status(204).end()
  // Don't count local development.
  if (/^(localhost|127\.0\.0\.1|\[::1\])(:|$)/.test(req.headers.host ?? '')) {
    return res.status(204).end()
  }
  if (rateLimited(req, 'collect', 240, 60 * 1000)) return res.status(429).end()

  const ua = parseUA(String(req.headers['user-agent'] ?? ''))
  if (ua.bot) return res.status(204).end()

  const b = (req.body ?? {}) as Record<string, any>
  const sid = str(b.sid, 64)
  const vid = str(b.vid, 64)
  if (!sid || !vid) return res.status(400).end()

  const db = getServerClient()
  const now = new Date().toISOString()

  try {
    /* ---- page view (+ session on the first one) ---- */
    if (b.pv && typeof b.pv === 'object') {
      const pv = b.pv
      const path = str(pv.path, 200)
      const view = str(pv.view, 64)
      if (!path || !view || !path.startsWith('/') || path.startsWith('/admin')) {
        return res.status(400).end()
      }

      if (b.ses && typeof b.ses === 'object') {
        const s = b.ses
        const { data: created } = await db.from('sessions').upsert(
          {
            id: sid,
            visitor_id: vid,
            started_at: now,
            last_seen_at: now,
            country: str(req.headers['x-vercel-ip-country'], 8),
            region: decode(req.headers['x-vercel-ip-country-region']),
            city: decode(req.headers['x-vercel-ip-city']),
            device: ua.device,
            browser: ua.browser,
            os: ua.os,
            language: str(s.lang, 16),
            timezone: str(s.tz, 64),
            screen_w: int(s.sw, 0, 10000),
            referrer_host: hostOf(str(s.ref, 300)),
            utm_source: str(s.utm_source, 80),
            utm_medium: str(s.utm_medium, 80),
            utm_campaign: str(s.utm_campaign, 80),
            landing_path: path,
            is_returning: Boolean(s.ret),
          },
          { onConflict: 'id', ignoreDuplicates: true }
        ).select('*')
        // Only a brand-new session is a new visit worth a notification.
        if (created?.length) await notifyForeignVisit(created[0])
      }

      // If the visit's first request was lost, still record a basic session row.
      if (!b.ses) {
        const { data: created } = await db.from('sessions').upsert(
          {
            id: sid,
            visitor_id: vid,
            started_at: now,
            last_seen_at: now,
            country: str(req.headers['x-vercel-ip-country'], 8),
            region: decode(req.headers['x-vercel-ip-country-region']),
            city: decode(req.headers['x-vercel-ip-city']),
            device: ua.device,
            browser: ua.browser,
            os: ua.os,
            landing_path: path,
          },
          { onConflict: 'id', ignoreDuplicates: true }
        ).select('*')
        if (created?.length) await notifyForeignVisit(created[0])
      }

      await db.from('page_views').upsert(
        {
          view_id: view,
          session_id: sid,
          visitor_id: vid,
          path,
          referrer: str(pv.ref, 300),
          device: ua.device,
        },
        { onConflict: 'view_id', ignoreDuplicates: true }
      )
      await db.from('sessions').update({ last_seen_at: now }).eq('id', sid)
    }

    /* ---- running totals for a view ---- */
    if (b.upd && typeof b.upd === 'object') {
      const view = str(b.upd.view, 64)
      const d = int(b.upd.d, 0, 60 * 60 * 1000)
      const sc = int(b.upd.s, 0, 100)
      if (view && d !== null && sc !== null) {
        // Only ever raise the totals so a late, older update cannot overwrite a newer one.
        await db.from('page_views').update({ duration_ms: d }).eq('view_id', view).lt('duration_ms', d)
        await db.from('page_views').update({ max_scroll: sc }).eq('view_id', view).lt('max_scroll', sc)
        await db.from('sessions').update({ last_seen_at: now }).eq('id', sid)
      }
    }

    /* ---- events ---- */
    if (Array.isArray(b.evs) && b.evs.length) {
      const rows = b.evs
        .slice(0, 20)
        .filter((e: any) => e && EVENT_TYPES.has(e.type))
        .map((e: any) => {
          const meta: Record<string, unknown> = {}
          if (e.meta && typeof e.meta === 'object') {
            for (const [k, v] of Object.entries(e.meta).slice(0, 12)) {
              if (typeof v === 'string') meta[k] = v.slice(0, 300)
              else if (typeof v === 'number' || typeof v === 'boolean') meta[k] = v
            }
          }
          return {
            session_id: sid,
            visitor_id: vid,
            type: e.type,
            path: str(e.path, 200),
            meta,
          }
        })
      if (rows.length) await db.from('events').insert(rows)
    }
  } catch {
    // Analytics must never break the site.
  }
  return res.status(204).end()
}
