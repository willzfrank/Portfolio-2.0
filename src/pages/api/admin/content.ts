import { withAdmin } from '@/lib/adminAuth'
import { getServerClient } from '@/lib/supabaseAdmin'
import { revalidateSite } from '@/lib/revalidate'
import { removeUploaded } from '@/lib/storageCleanup'

// Keys the admin is allowed to edit.
const KEYS = ['about', 'hero', 'resume']

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
    const { data: before } =
      key === 'resume' ? await db.from('site_content').select('value').eq('key', 'resume').maybeSingle() : { data: null }
    const { error } = await db
      .from('site_content')
      .upsert({ key, value, updated_at: new Date().toISOString() })
    if (error) return res.status(400).json({ error: error.message })
    // Replacing the resume: drop the old uploaded PDF so storage doesn't fill with stale copies.
    const old = (before?.value as { url?: string } | null)?.url
    if (old && old !== (value as { url?: string }).url) await removeUploaded([old])
    await revalidateSite(res)
    return res.status(200).json({ ok: true })
  }

  res.setHeader('Allow', 'GET, PUT')
  return res.status(405).json({ error: 'Method not allowed' })
})
