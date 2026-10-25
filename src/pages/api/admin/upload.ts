import { withAdmin } from '@/lib/adminAuth'
import { getServerClient } from '@/lib/supabaseAdmin'

const BUCKET = 'portfolio'
export const MAX_UPLOAD_BYTES = 5 * 1024 * 1024
const TYPES: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
  'image/avif': 'avif',
  'application/pdf': 'pdf',
}

/**
 * Returns a signed upload URL so the browser can send the file straight to
 * Supabase Storage (avoids the API-route body size limit).
 */
export default withAdmin(async (req, res) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed' })
  }
  const { filename, contentType, size } = req.body ?? {}
  const ext = TYPES[contentType]
  if (typeof filename !== 'string' || !ext) {
    return res
      .status(400)
      .json({ error: 'Use a JPG, PNG, WebP, GIF or AVIF image, or a PDF' })
  }
  if (typeof size === 'number' && size > MAX_UPLOAD_BYTES) {
    return res.status(400).json({ error: 'Files must be 5 MB or smaller' })
  }
  const base = filename
    .toLowerCase()
    .replace(/\.[^.]*$/, '')
    .replace(/[^a-z0-9]+/g, '-')
    .slice(0, 60)
  // Extension comes from the validated type, not the user's file name.
  const dir = ext === 'pdf' ? 'resume' : 'projects'
  const path = `${dir}/${Date.now()}-${base}.${ext}`
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
