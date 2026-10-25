import { withAdmin } from '@/lib/adminAuth'
import { getServerClient } from '@/lib/supabaseAdmin'

const DAYS = 14

const count = (items: string[]) =>
  Object.entries(
    items.reduce<Record<string, number>>((acc, k) => {
      acc[k] = (acc[k] || 0) + 1
      return acc
    }, {})
  )
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([name, views]) => ({ name, views }))

export default withAdmin(async (req, res) => {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET')
    return res.status(405).json({ error: 'Method not allowed' })
  }
  const since = new Date(Date.now() - DAYS * 86400000).toISOString()
  const { data, error } = await getServerClient()
    .from('page_views')
    .select('visitor_id, path, referrer, device, created_at')
    .gte('created_at', since)
    .order('created_at', { ascending: false })
    .limit(50000)
  if (error) return res.status(500).json({ error: error.message })

  const rows = data ?? []
  const byDay: Record<string, { views: number; visitors: Set<string> }> = {}
  for (let i = DAYS - 1; i >= 0; i--) {
    const d = new Date(Date.now() - i * 86400000).toISOString().slice(0, 10)
    byDay[d] = { views: 0, visitors: new Set() }
  }
  for (const r of rows) {
    const d = r.created_at.slice(0, 10)
    if (byDay[d]) {
      byDay[d].views++
      byDay[d].visitors.add(r.visitor_id)
    }
  }
  const referrers = rows
    .map((r) => {
      try {
        return r.referrer ? new URL(r.referrer).hostname : 'direct'
      } catch {
        return 'direct'
      }
    })
    .filter((h) => h !== 'localhost')

  return res.status(200).json({
    days: DAYS,
    totalViews: rows.length,
    uniqueVisitors: new Set(rows.map((r) => r.visitor_id)).size,
    daily: Object.entries(byDay).map(([date, v]) => ({
      date,
      views: v.views,
      visitors: v.visitors.size,
    })),
    topPages: count(rows.map((r) => r.path)),
    topReferrers: count(referrers),
    devices: count(rows.map((r) => r.device ?? 'desktop')),
    recent: rows.slice(0, 10),
  })
})
