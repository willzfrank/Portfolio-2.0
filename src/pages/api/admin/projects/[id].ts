import { withAdmin } from '@/lib/adminAuth'
import { getServerClient } from '@/lib/supabaseAdmin'
import { pickProjectFields } from '@/lib/projectInput'

export default withAdmin(async (req, res) => {
  const id = req.query.id as string
  const db = getServerClient()

  if (req.method === 'PUT') {
    const parsed = pickProjectFields(req.body, false)
    if ('error' in parsed) return res.status(400).json(parsed)
    const { data, error } = await db
      .from('projects')
      .update({ ...parsed.fields, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()
    if (error) return res.status(400).json({ error: error.message })
    return res.status(200).json(data)
  }

  if (req.method === 'DELETE') {
    const { error } = await db.from('projects').delete().eq('id', id)
    if (error) return res.status(400).json({ error: error.message })
    return res.status(204).end()
  }

  res.setHeader('Allow', 'PUT, DELETE')
  return res.status(405).json({ error: 'Method not allowed' })
})
