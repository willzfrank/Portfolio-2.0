import { withAdmin } from '@/lib/adminAuth'
import { getServerClient } from '@/lib/supabaseAdmin'
import { buildReport } from '@/lib/analyticsReport'
import { EventRow, SessionRow, ViewRow } from '@/lib/analyticsTypes'

const ALLOWED_DAYS = [1, 7, 30, 90]
const LIMIT = 20000

export default withAdmin(async (req, res) => {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET')
    return res.status(405).json({ error: 'Method not allowed' })
  }
  const asked = Number(req.query.days)
  const days = ALLOWED_DAYS.includes(asked) ? asked : 30
  const since = new Date(Date.now() - days * 86400000).toISOString()
  const db = getServerClient()

  const [s, v, e] = await Promise.all([
    db.from('sessions').select('*').gte('started_at', since).order('started_at', { ascending: false }).limit(LIMIT),
    db
      .from('page_views')
      .select('view_id, session_id, visitor_id, path, created_at, duration_ms, max_scroll')
      .gte('created_at', since)
      .order('created_at', { ascending: false })
      .limit(LIMIT),
    db.from('events').select('session_id, visitor_id, type, path, meta, created_at').gte('created_at', since).order('created_at', { ascending: false }).limit(LIMIT),
  ])

  const failed = s.error || v.error || e.error
  if (failed) {
    // Tables from supabase/analytics-v2.sql haven't been created yet.
    const missing = /does not exist|schema cache|relation|column/i.test(failed.message)
    return res.status(missing ? 200 : 500).json({ setupNeeded: missing, error: failed.message })
  }

  return res.status(200).json(
    buildReport(
      {
        sessions: (s.data ?? []) as SessionRow[],
        views: (v.data ?? []) as ViewRow[],
        events: (e.data ?? []) as EventRow[],
      },
      days
    )
  )
})
