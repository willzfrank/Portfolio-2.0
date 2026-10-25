import { withAdmin } from '@/lib/adminAuth'
import { getServerClient } from '@/lib/supabaseAdmin'

export default withAdmin(async (req, res) => {
  const db = getServerClient()

  if (req.method === 'GET') {
    const { data, error } = await db
      .from('messages')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) return res.status(500).json({ error: error.message })
    return res.status(200).json(data)
  }

  const id = req.query.id as string
  if (!id) return res.status(400).json({ error: 'id is required' })

  if (req.method === 'PATCH') {
    const { error } = await db
      .from('messages')
      .update({ read: req.body?.read !== false })
      .eq('id', id)
    if (error) return res.status(400).json({ error: error.message })
    return res.status(200).json({ ok: true })
  }

  if (req.method === 'DELETE') {
    const { error } = await db.from('messages').delete().eq('id', id)
    if (error) return res.status(400).json({ error: error.message })
    return res.status(204).end()
  }

  res.setHeader('Allow', 'GET, PATCH, DELETE')
  return res.status(405).json({ error: 'Method not allowed' })
})
