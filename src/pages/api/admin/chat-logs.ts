import { withAdmin } from '@/lib/adminAuth'
import { getServerClient } from '@/lib/supabaseAdmin'

export default withAdmin(async (req, res) => {
  const db = getServerClient()

  if (req.method === 'GET') {
    try {
      let query = db
        .from('ai_chat_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100)

      if (req.query.leads_only === 'true' || req.query.leads_only === '1') {
        query = query.eq('is_lead', true)
      }

      const { data, error } = await query

      if (error) {
        // If table doesn't exist yet, return empty list gracefully
        if (error.code === '42P01' || error.message?.includes('schema cache')) {
          return res.status(200).json({ logs: [], needsMigration: true })
        }
        return res.status(500).json({ error: error.message })
      }

      return res.status(200).json({ logs: data || [], needsMigration: false })
    } catch (err: any) {
      return res.status(500).json({ error: err?.message || 'Failed to fetch logs' })
    }
  }

  const id = req.query.id as string
  if (!id) return res.status(400).json({ error: 'id is required' })

  if (req.method === 'DELETE') {
    try {
      const { error } = await db.from('ai_chat_logs').delete().eq('id', id)
      if (error) return res.status(400).json({ error: error.message })
      return res.status(204).end()
    } catch (err: any) {
      return res.status(500).json({ error: err?.message || 'Failed to delete' })
    }
  }

  res.setHeader('Allow', 'GET, DELETE')
  return res.status(405).json({ error: 'Method not allowed' })
})

