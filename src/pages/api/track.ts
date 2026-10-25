import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerClient, isSupabaseConfigured } from '@/lib/supabaseAdmin'
import { rateLimited } from '@/lib/rateLimit'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).end()
  }
  if (!isSupabaseConfigured()) return res.status(204).end()
  // Don't count local development.
  if (/^(localhost|127\.0\.0\.1|\[::1\])(:|$)/.test(req.headers.host ?? '')) {
    return res.status(204).end()
  }
  if (rateLimited(req, 'track', 120, 60 * 1000)) return res.status(429).end()
  const { visitorId, path, referrer } = req.body ?? {}
  if (
    typeof visitorId !== 'string' ||
    visitorId.length > 64 ||
    typeof path !== 'string' ||
    !path.startsWith('/') ||
    path.startsWith('/admin')
  ) {
    return res.status(400).end()
  }
  const ua = req.headers['user-agent'] ?? ''
  if (/bot|crawl|spider|preview/i.test(ua)) return res.status(204).end()
  const device = /mobile|android|iphone/i.test(ua) ? 'mobile' : 'desktop'
  await getServerClient()
    .from('page_views')
    .insert({
      visitor_id: visitorId,
      path: path.slice(0, 200),
      referrer: typeof referrer === 'string' ? referrer.slice(0, 300) : null,
      device,
    })
  return res.status(204).end()
}
