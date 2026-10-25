import { withAdmin } from '@/lib/adminAuth'
import { getServerClient } from '@/lib/supabaseAdmin'
import { pickProjectFields } from '@/lib/projectInput'
import { revalidateSite } from '@/lib/revalidate'
import { imageUrls, removeUploaded } from '@/lib/storageCleanup'

export default withAdmin(async (req, res) => {
  const id = req.query.id as string
  const db = getServerClient()

  if (req.method === 'PUT') {
    const parsed = pickProjectFields(req.body, false)
    if ('error' in parsed) return res.status(400).json(parsed)
    const { data: before } = await db
      .from('projects')
      .select('slug, image, images')
      .eq('id', id)
      .single()
    const save = (fields: Record<string, unknown>) =>
      db
        .from('projects')
        .update({ ...fields, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single()
    let { data, error } = await save(parsed.fields)
    // The `links` column comes from supabase/project-links.sql; save the rest if it's missing.
    if (error && /links/.test(error.message) && 'links' in parsed.fields) {
      const { links: _links, ...rest } = parsed.fields
      ;({ data, error } = await save(rest))
    }
    if (error) return res.status(400).json({ error: error.message })
    // Drop uploads that are no longer referenced.
    if (before) {
      const keep = new Set(imageUrls(data))
      await removeUploaded(imageUrls(before).filter((u) => !keep.has(u)))
    }
    await revalidateSite(res, [before?.slug, data.slug])
    return res.status(200).json(data)
  }

  if (req.method === 'DELETE') {
    const { data: before } = await db
      .from('projects')
      .select('slug, image, images')
      .eq('id', id)
      .single()
    const { error } = await db.from('projects').delete().eq('id', id)
    if (error) return res.status(400).json({ error: error.message })
    if (before) await removeUploaded(imageUrls(before))
    await revalidateSite(res, [before?.slug])
    return res.status(204).end()
  }

  res.setHeader('Allow', 'PUT, DELETE')
  return res.status(405).json({ error: 'Method not allowed' })
})
