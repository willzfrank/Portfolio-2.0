import { withAdmin } from '@/lib/adminAuth'
import { getServerClient } from '@/lib/supabaseAdmin'
import { revalidateSite } from '@/lib/revalidate'

// Keys the admin is allowed to edit.
const KEYS = ['about', 'hero']

export default withAdmin(async (req, res) => {
  const db = getServerClient()

  if (req.method === 'GET') {
    const { data, error } = await db.from('site_content').select('*')
    if (error) return res.status(500).json({ error: error.message })
    return res.status(200).json(data)
  }

  if (req.method === 'PUT') {
    const { key, value } = req.body ?? {}
    if (!KEYS.includes(key) || typeof value !== 'object' || value === null) {
      return res.status(400).json({ error: 'Invalid content' })
    }
    const { error } = await db
      .from('site_content')
      .upsert({ key, value, updated_at: new Date().toISOString() })
    if (error) return res.status(400).json({ error: error.message })
    await revalidateSite(res)
    return res.status(200).json({ ok: true })
  }

  res.setHeader('Allow', 'GET, PUT')
  return res.status(405).json({ error: 'Method not allowed' })
})
