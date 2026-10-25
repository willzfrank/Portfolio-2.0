import { withAdmin } from '@/lib/adminAuth'
import { getServerClient } from '@/lib/supabaseAdmin'

const BUCKET = 'portfolio'

/**
 * Returns a signed upload URL so the browser can send the file straight to
 * Supabase Storage (avoids the API-route body size limit).
 */
export default withAdmin(async (req, res) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed' })
  }
  const { filename, contentType } = req.body ?? {}
  if (typeof filename !== 'string' || !/^image\//.test(contentType ?? '')) {
    return res.status(400).json({ error: 'An image file is required' })
  }
  const safe = filename.toLowerCase().replace(/[^a-z0-9.]+/g, '-')
  const path = `projects/${Date.now()}-${safe}`
  const db = getServerClient()
  const { data, error } = await db.storage
    .from(BUCKET)
    .createSignedUploadUrl(path)
  if (error) return res.status(500).json({ error: error.message })
  const { data: pub } = db.storage.from(BUCKET).getPublicUrl(path)
  return res
    .status(200)
    .json({ path, token: data.token, publicUrl: pub.publicUrl })
})
